/**
 * Deterministic, seeded convergence stress engine.
 *
 * A stress scenario models several replicas of one document editing concurrently
 * and then gossiping every produced delta to a set of target replicas under a
 * chosen delivery mode (shuffled, duplicated, delayed, restarted, or in order).
 * Every target must converge to the same live projection as a reference replica
 * that applied the deltas in their natural generation order.
 *
 * The engine is fully driven by an explicit numeric seed and records a
 * structured operation trace, so any failure can be reproduced and replayed. It
 * is runtime-agnostic (no `node:` imports) so the same scenarios run inside the
 * cross-runtime suite as a fast sanity layer and inside the heavy Node-only
 * stress runner at much larger sizes.
 */

import { createRandom, randomInt, shuffledIndices } from './random.mjs'
import {
  liveIds,
  assertStructuralIntegrity,
  assertSnapshotRoundTrip,
} from './assertions.mjs'
import {
  applyDelete,
  applyUpdateValues,
  cloneReplica,
  seededReplica,
} from './fixtures.mjs'

/**
 * Chooses and applies one random operation against a source replica.
 *
 * The operation distribution is controlled by `weights`, which lets scenarios
 * focus on inserts, deletes, overwrites, or a balanced mix. The op is recorded
 * as a compact, JSON-safe trace entry and the produced gossip delta is returned.
 *
 * @param {object} api - The CRList primitive API.
 * @param {object} replica - The source replica to mutate.
 * @param {() => number} random - The deterministic generator for this scenario.
 * @param {() => string} makeId - A factory producing unique payload ids.
 * @param {{ insert: number, overwrite: number, delete: number }} weights -
 *   The relative operation weights.
 * @returns {{ delta: object | undefined, entry: object }} The produced delta
 *   (when the op changed state) and the trace entry describing the op.
 */
function applyRandomOperation(api, replica, random, makeId, weights) {
  // Normalize the operation weights into cumulative thresholds in [0, 1).
  const total = weights.insert + weights.overwrite + weights.delete
  const insertThreshold = weights.insert / total
  const overwriteThreshold = insertThreshold + weights.overwrite / total

  // Draw the operation selector once for this step.
  const roll = random()

  // An empty replica can only grow, so force an insert regardless of weights.
  const forceInsert = replica.size === 0

  // Choose a small batch width so block batching is exercised by inserts.
  const width = 1 + randomInt(random, 3)

  // INSERT branch: place new values before or after a visible index.
  if (forceInsert || roll < insertThreshold) {
    // Build the batch of unique ids to insert.
    const ids = Array.from({ length: width }, () => makeId())

    // Pick a direction; an empty replica always inserts at the root.
    const mode = forceInsert || random() < 0.5 ? 'after' : 'before'

    // Choose a valid target index for the chosen direction.
    const index = forceInsert
      ? 0
      : mode === 'after'
        ? randomInt(random, replica.size + 1)
        : randomInt(random, replica.size)

    // Apply the insert and capture the produced delta.
    const result = applyUpdateValues(api, replica, index, ids, mode)

    // Record a compact, replayable trace entry for the insert.
    return {
      delta: result.delta,
      entry: { op: 'insert', mode, index, ids },
    }
  }

  // OVERWRITE branch: replace a visible range starting at a valid index.
  if (roll < overwriteThreshold) {
    // Build the batch of replacement ids.
    const ids = Array.from({ length: width }, () => makeId())

    // Choose a starting index within (or just past) the visible range.
    const index = randomInt(random, replica.size + 1)

    // Apply the overwrite and capture the produced delta.
    const result = applyUpdateValues(api, replica, index, ids, 'overwrite')

    // Record a compact, replayable trace entry for the overwrite.
    return {
      delta: result.delta,
      entry: { op: 'overwrite', index, ids },
    }
  }

  // DELETE branch: remove a short visible range starting at a valid index.
  const start = randomInt(random, replica.size)
  const span = 1 + randomInt(random, Math.min(3, replica.size - start))
  const result = applyDelete(api, replica, start, start + span)

  // Record a compact, replayable trace entry for the delete.
  return {
    delta: result.delta,
    entry: { op: 'delete', start, end: start + span },
  }
}

/**
 * Delivers a pool of deltas to a target replica under a named delivery mode.
 *
 * The delivery mode models a different real-world network condition. Because the
 * `restart` mode replaces the replica with a re-hydrated copy mid-stream, this
 * function returns the final replica rather than mutating in place.
 *
 * @param {object} api - The CRList primitive API.
 * @param {object} target - The target replica to deliver into.
 * @param {Array<object>} deltas - The pool of gossip deltas.
 * @param {number} seed - The per-target seed controlling delivery order.
 * @param {string} mode - One of `ordered`, `shuffled`, `duplicate`, `delayed`,
 *   `restart`, or `offline-burst`.
 * @returns {object} The final target replica after delivery.
 */
function deliver(api, target, deltas, seed, mode) {
  // Ordered and offline-burst delivery both apply deltas in generation order.
  if (mode === 'ordered' || mode === 'offline-burst') {
    for (const delta of deltas) void api.__merge(target, delta)
    return target
  }

  // Compute a deterministic shuffled delivery order shared by shuffle-based modes.
  const order = shuffledIndices(deltas.length, seed)

  // Delayed delivery applies the shuffled order in reversed contiguous batches.
  if (mode === 'delayed') {
    // Choose a batch size that splits the stream into a few delayed chunks.
    const batchSize = Math.max(1, Math.floor(order.length / 4))

    // Walk the batches from the last batch to the first to model reordering.
    for (let batchStart = order.length; batchStart > 0; batchStart -= batchSize) {
      // Deliver the current batch in its shuffled order.
      const from = Math.max(0, batchStart - batchSize)
      for (let cursor = from; cursor < batchStart; cursor++)
        void api.__merge(target, deltas[order[cursor]])
    }
    return target
  }

  // The remaining modes walk the shuffled order, varying duplication and restarts.
  let current = target
  for (let position = 0; position < order.length; position++) {
    // Apply the next delta in shuffled order.
    const deltaIndex = order[position]
    void api.__merge(current, deltas[deltaIndex])

    // Duplicate delivery re-applies every third delta to prove idempotency.
    if (mode === 'duplicate' && deltaIndex % 3 === 0)
      void api.__merge(current, deltas[deltaIndex])

    // Restart delivery periodically snapshots and re-hydrates the replica so the
    // remaining deltas are applied on top of a freshly rebuilt projection.
    if (mode === 'restart' && position % 7 === 6)
      current = cloneReplica(api, current)
  }

  // Return the (possibly restarted) replica.
  return current
}

/**
 * Runs one deterministic convergence scenario and reports the outcome.
 *
 * @param {object} api - The CRList primitive API.
 * @param {{
 *   name: string,
 *   seed: number,
 *   replicaCount: number,
 *   rounds: number,
 *   baseSize?: number,
 *   weights?: { insert: number, overwrite: number, delete: number },
 *   deliveries?: Array<string>,
 * }} config - The scenario configuration.
 * @returns {{
 *   ok: boolean,
 *   name: string,
 *   seed: number,
 *   replicaCount: number,
 *   opCount: number,
 *   trace: Array<object>,
 *   failure?: object,
 * }} The scenario result, including a rich failure diagnostic when it fails.
 */
export function runConvergenceScenario(api, config) {
  // Apply scenario defaults for any omitted configuration fields.
  const name = config.name
  const seed = config.seed
  const replicaCount = config.replicaCount
  const rounds = config.rounds
  const baseSize = config.baseSize ?? 0
  const weights = config.weights ?? { insert: 0.5, overwrite: 0.3, delete: 0.2 }
  const deliveries = config.deliveries ?? [
    'ordered',
    'shuffled',
    'duplicate',
    'delayed',
    'restart',
  ]

  // Build a deterministic generator for the whole scenario from the seed.
  const random = createRandom(seed)

  // Seed a shared base document, then fork it into independent source replicas.
  const base = seededReplica(api, baseSize)
  const sources = Array.from({ length: replicaCount }, () =>
    cloneReplica(api, base)
  )

  // Maintain a monotonically increasing serial for globally-unique payload ids.
  let serial = 0

  // Record every operation so a failure can be replayed and understood.
  const trace = []

  // Collect every produced gossip delta in generation order.
  const deltas = []

  // Drive concurrent edits: each round, every source performs one random op.
  for (let round = 0; round < rounds; round++) {
    for (let replicaIndex = 0; replicaIndex < sources.length; replicaIndex++) {
      // Build a unique id factory scoped to this source and round.
      const makeId = () => `s${replicaIndex}-r${round}-${serial++}`

      // Apply one random operation and capture its delta and trace entry.
      const { delta, entry } = applyRandomOperation(
        api,
        sources[replicaIndex],
        random,
        makeId,
        weights
      )

      // Record the operation in the trace with its originating replica/round.
      void trace.push({ round, replica: replicaIndex, ...entry })

      // Pool the delta for later gossip when the op produced one.
      if (delta) void deltas.push(delta)
    }
  }

  // Build the reference projection by applying all deltas in generation order.
  const reference = cloneReplica(api, base)
  for (const delta of deltas) void api.__merge(reference, delta)
  const expectedIds = liveIds(reference)

  // Deliver the pooled deltas to one target per configured delivery mode.
  for (let targetIndex = 0; targetIndex < deliveries.length; targetIndex++) {
    // Identify the delivery mode under test for this target.
    const mode = deliveries[targetIndex]

    try {
      // Deliver all deltas into a fresh fork of the base under this mode.
      const target = deliver(
        api,
        cloneReplica(api, base),
        deltas,
        seed * 131 + targetIndex,
        mode
      )

      // The delivered projection must match the reference projection exactly.
      const actualIds = liveIds(target)
      if (stableJson(actualIds) !== stableJson(expectedIds))
        return failure({
          name,
          seed,
          replicaCount,
          opCount: deltas.length,
          mode,
          invariant: `replicas converge after ${mode} delivery`,
          expected: expectedIds,
          actual: actualIds,
          message: 'delivered projection diverged from the reference projection',
          trace,
        })

      // The delivered replica must be structurally consistent.
      assertStructuralIntegrity(api, target, `${name}/${mode}`)

      // A snapshot roundtrip of the delivered replica must also converge.
      assertSnapshotRoundTrip(api, target, `${name}/${mode} snapshot`)
    } catch (error) {
      // Any thrown invariant failure is reported as a scenario failure.
      return failure({
        name,
        seed,
        replicaCount,
        opCount: deltas.length,
        mode,
        invariant: `replicas converge after ${mode} delivery`,
        expected: expectedIds,
        actual: undefined,
        message: error instanceof Error ? error.message : String(error),
        trace,
      })
    }
  }

  // Every delivery mode converged: report a successful scenario.
  return {
    ok: true,
    name,
    seed,
    replicaCount,
    opCount: deltas.length,
    trace,
  }
}

/**
 * Runs a convergence scenario and throws a full replay report when it fails.
 *
 * This adapts the result-returning {@link runConvergenceScenario} into an
 * assertion suitable for the invariant suite: a converged scenario returns
 * normally, while a divergence throws an `Error` whose message is the complete,
 * reproducible failure report produced by {@link formatStressFailure}.
 *
 * @param {object} api - The CRList primitive API.
 * @param {object} config - The scenario configuration (see
 *   {@link runConvergenceScenario}).
 * @returns {object} The successful scenario result.
 */
export function assertScenarioConverges(api, config) {
  // Run the deterministic scenario once.
  const result = runConvergenceScenario(api, config)

  // A failed scenario throws the complete replay report so CI surfaces it.
  if (!result.ok) throw new Error(`\n${formatStressFailure(result)}`)

  // Return the successful result for any further assertions.
  return result
}

/**
 * Builds a failed scenario result with a complete diagnostic payload.
 *
 * @param {object} detail - The failure detail fields.
 * @returns {object} The failed scenario result.
 */
function failure(detail) {
  // Wrap the detail in a standard failed-scenario envelope.
  return {
    ok: false,
    name: detail.name,
    seed: detail.seed,
    replicaCount: detail.replicaCount,
    opCount: detail.opCount,
    trace: detail.trace,
    failure: detail,
  }
}

/**
 * Produces a stable JSON encoding used for projection comparison.
 *
 * @param {unknown} value - The value to encode.
 * @returns {string} The stable JSON encoding.
 */
function stableJson(value) {
  // The projection ids are plain strings, so standard JSON is already stable.
  return JSON.stringify(value)
}

/**
 * Formats a failed scenario into a complete, human-readable replay report.
 *
 * The report prints the seed, scenario name, operation count, replica count, the
 * failed invariant name, the expected and actual projections, the exact replay
 * command, and the full operation trace, satisfying the requirement that every
 * stress failure is reproducible from its printed output alone.
 *
 * @param {object} result - A failed scenario result from
 *   {@link runConvergenceScenario}.
 * @returns {string} The formatted failure report.
 */
export function formatStressFailure(result) {
  // Pull the failure detail and prepare a list of report lines.
  const detail = result.failure
  const lines = []

  // Header identifying the failure.
  void lines.push('━━━ CRList stress failure ━━━')

  // Core reproduction metadata.
  void lines.push(`scenario:       ${detail.name}`)
  void lines.push(`failed invariant: ${detail.invariant}`)
  void lines.push(`delivery mode:  ${detail.mode}`)
  void lines.push(`seed:           ${detail.seed}`)
  void lines.push(`replica count:  ${detail.replicaCount}`)
  void lines.push(`operation count:${detail.opCount}`)

  // The exact command that re-runs only this scenario for debugging.
  void lines.push(
    `replay command: npm run stress -- --seed ${detail.seed} --scenario ${detail.name}`
  )

  // The diverging projections, so the discrepancy is visible at a glance.
  void lines.push(`expected projection: ${JSON.stringify(detail.expected)}`)
  void lines.push(`actual projection:   ${JSON.stringify(detail.actual)}`)

  // The failure message captured from the assertion or comparison.
  void lines.push(`message:        ${detail.message}`)

  // The full replayable operation trace.
  void lines.push('replayable trace:')
  for (const entry of detail.trace)
    void lines.push(`  ${JSON.stringify(entry)}`)

  // Join the report into a single multi-line string.
  return lines.join('\n')
}
