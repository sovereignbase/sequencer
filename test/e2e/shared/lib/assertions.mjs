/**
 * Reusable, runtime-agnostic assertion helpers for the CRList invariant suite.
 *
 * These helpers express the semantic guarantees the tests rely on so that an
 * individual invariant test reads as a single high-level statement instead of a
 * wall of low-level pokes. They are deliberately free of any `node:` imports or
 * runtime-specific globals so the exact same assertions run in Node, Bun, Deno,
 * Cloudflare Workers, the Edge Runtime, and browsers.
 *
 * Two families of helpers exist:
 *
 *   1. Primitive assertions (`assert`, `assertEqual`, `assertDeepEqual`,
 *      `assertThrows`) that throw a descriptive `Error` on failure.
 *   2. CRList-aware assertions that validate the *live projection* (the visible,
 *      non-deleted, ordered sequence) and the *structural integrity* of the
 *      internal block graph.
 *
 * The live projection is the convergence target of the whole CRDT, so most
 * guarantees are expressed in terms of it rather than internal cursor state.
 */

/**
 * Throws a descriptive error when a condition is falsy.
 *
 * @param {unknown} condition - The condition expected to be truthy.
 * @param {string} [message] - The failure message to surface.
 */
export function assert(condition, message) {
  // Surface the caller's message (or a default) when the condition fails.
  if (!condition) throw new Error(message || 'assertion failed')
}

/**
 * Throws when two values are not strictly equal.
 *
 * @param {unknown} actual - The observed value.
 * @param {unknown} expected - The required value.
 * @param {string} [message] - The failure message to surface.
 */
export function assertEqual(actual, expected, message) {
  // Use strict equality so that subtle type coercions are treated as failures.
  if (actual !== expected)
    throw new Error(
      message || `expected ${stringify(actual)} to equal ${stringify(expected)}`
    )
}

/**
 * Throws when two values are not deeply equal by canonical JSON comparison.
 *
 * JSON comparison is used because every CRList payload, snapshot, delta, and
 * change patch is required to be a detached structured-clone-style value, so a
 * stable JSON encoding is a faithful structural comparison.
 *
 * @param {unknown} actual - The observed value.
 * @param {unknown} expected - The required value.
 * @param {string} [message] - The failure message to surface.
 */
export function assertDeepEqual(actual, expected, message) {
  // Encode both sides to canonical JSON strings.
  const actualJson = stringify(actual)
  const expectedJson = stringify(expected)

  // Compare the encodings and report the difference on mismatch.
  if (actualJson !== expectedJson)
    throw new Error(message || `expected ${actualJson} to equal ${expectedJson}`)
}

/**
 * Throws when calling `fn` does not throw a matching error.
 *
 * @param {() => unknown} fn - The function expected to throw.
 * @param {((error: unknown) => boolean) | RegExp} matcher - A predicate or a
 *   regular expression matched against the thrown error's string form.
 * @param {string} [message] - The failure message to surface.
 */
export function assertThrows(fn, matcher, message) {
  // Track whether the function threw at all.
  let threw = false

  try {
    // Invoke the function that is expected to throw.
    void fn()
  } catch (error) {
    // Record that an error was raised so the "did not throw" path is excluded.
    threw = true

    // A regular expression matcher is tested against the error's string form.
    if (matcher instanceof RegExp) {
      if (!matcher.test(String(error)))
        throw new Error(
          message || `error ${String(error)} did not match ${matcher}`
        )

      // The regular expression matched, so the assertion is satisfied.
      return
    }

    // A predicate matcher is invoked directly against the thrown error.
    if (!matcher(error))
      throw new Error(message || `error ${String(error)} did not satisfy matcher`)

    // The predicate accepted the error, so the assertion is satisfied.
    return
  }

  // Reaching here without having thrown is itself an assertion failure.
  if (!threw) throw new Error(message || 'expected function to throw')
}

/**
 * Encodes a value as a stable JSON string, tolerating bigints and functions.
 *
 * The internal replica state contains bigints and live function payloads in some
 * tests, so the default `JSON.stringify` would throw. This encoder degrades such
 * values to a tagged string so comparisons stay total.
 *
 * @param {unknown} value - The value to encode.
 * @returns {string} A stable JSON-ish encoding of the value.
 */
export function stringify(value) {
  // Replace values that standard JSON cannot encode with stable tagged strings.
  return JSON.stringify(value, (_, entry) => {
    // Encode bigints as a tagged decimal string.
    if (typeof entry === 'bigint') return `«bigint:${entry.toString()}»`

    // Encode functions as a stable tag so identity does not leak into output.
    if (typeof entry === 'function') return '«function»'

    // Encode the special undefined-as-removal marker used by change patches.
    if (entry === undefined) return '«undefined»'

    // All other values encode normally.
    return entry
  })
}

/**
 * Walks the live block graph forward from the head and returns visible values.
 *
 * The walk is bounded and cycle-checked so a corrupt graph produces a clear
 * failure instead of hanging. The returned array is the canonical *live
 * projection* in visible order.
 *
 * @template T
 * @param {{ size: number, firstBlock: unknown, blocksById?: Map<unknown, unknown> }} replica
 *   - The CRList replica state.
 * @returns {Array<T>} The visible values in projection order.
 */
export function liveProjection(replica) {
  // An empty replica projects to no visible values.
  if (replica.size === 0) return []

  // The head must exist whenever the replica reports a non-zero size.
  if (!replica.firstBlock) throw new Error('replica reports size but has no head')

  // Bound the traversal so a structural cycle cannot loop forever.
  const traversalLimit = replica.size + (replica.blocksById?.size ?? 0) + 16

  // Accumulate visible values across every block in projection order.
  const visibleValues = []

  // Track visited blocks so a forward cycle is detected rather than looping.
  const visitedBlocks = new Set()

  // Walk from the head block forward through `nextBlock` links.
  for (
    let block = replica.firstBlock, step = 0;
    block;
    block = block.nextBlock, step++
  ) {
    // A traversal longer than the bound proves the graph is corrupt.
    if (step > traversalLimit)
      throw new Error('forward traversal exceeded the projection bound')

    // Re-encountering a block proves a forward cycle exists.
    if (visitedBlocks.has(block))
      throw new Error('cycle detected during forward traversal')

    // Mark the block visited and collect each of its live items in order.
    void visitedBlocks.add(block)
    for (const item of block.items) void visibleValues.push(item)
  }

  // The collected count must match the reported live size exactly.
  if (visibleValues.length !== replica.size)
    throw new Error(
      `projection length ${visibleValues.length} did not match size ${replica.size}`
    )

  // Return the visible values in deterministic projection order.
  return visibleValues
}

/**
 * Returns the payload `id` of every value in the live projection.
 *
 * @param {object} replica - The CRList replica state.
 * @returns {Array<unknown>} The ordered list of payload ids.
 */
export function liveIds(replica) {
  // Map each visible value to its payload id for compact comparison.
  return liveProjection(replica).map((value) => value?.id)
}

/**
 * Returns the payload `id` of every value read through the public index path.
 *
 * This deliberately uses `__read` rather than graph traversal so it exercises an
 * independent code path (the index cache and cursor seek) and can be compared
 * against {@link liveIds} to prove the two paths agree.
 *
 * @param {object} api - The CRList primitive API.
 * @param {object} replica - The CRList replica state.
 * @returns {Array<unknown>} The ordered list of payload ids via indexed reads.
 */
export function materializedIds(api, replica) {
  // Read every index in range through the public read primitive.
  return Array.from(
    { length: replica.size },
    (_, index) => api.__read(index, replica)?.id
  )
}

/**
 * Asserts the live projection ids equal the expected ordered ids.
 *
 * @param {object} replica - The CRList replica state.
 * @param {Array<unknown>} expectedIds - The required ordered payload ids.
 * @param {string} [message] - The failure message to surface.
 */
export function assertLiveIds(replica, expectedIds, message) {
  // Compare the structural projection ids against the expectation.
  assertDeepEqual(
    liveIds(replica),
    expectedIds,
    message || 'live projection ids mismatch'
  )
}

/**
 * Asserts that graph traversal and indexed reads observe the same projection.
 *
 * @param {object} api - The CRList primitive API.
 * @param {object} replica - The CRList replica state.
 * @param {string} [message] - The failure message to surface.
 */
export function assertProjectionMatchesMaterialization(api, replica, message) {
  // Graph traversal order must equal indexed read order for every position.
  assertDeepEqual(
    liveIds(replica),
    materializedIds(api, replica),
    message || 'graph projection diverged from indexed reads'
  )
}

/**
 * Returns the number of tombstoned (deleted) item ids retained by the replica.
 *
 * @param {{ deletedRanges?: Array<[bigint, bigint]> }} replica - The replica.
 * @returns {number} The total count of ids covered by deleted ranges.
 */
export function deletedItemCount(replica) {
  // Sum the inclusive width of every retained deleted range.
  return (replica.deletedRanges ?? []).reduce(
    (total, [start, end]) => total + Number(end - start + 1n),
    0
  )
}

/**
 * Asserts that the deleted ranges are normalized: sorted, disjoint, non-adjacent.
 *
 * @param {{ deletedRanges?: Array<[bigint, bigint]> }} replica - The replica.
 * @param {string} [message] - The failure message to surface.
 */
export function assertTombstonesNormalized(replica, message) {
  // Read the deleted ranges, defaulting to an empty list.
  const ranges = replica.deletedRanges ?? []

  // Inspect each range and its relationship to the previous range.
  for (let index = 0; index < ranges.length; index++) {
    // Destructure the inclusive start and end of the current range.
    const [start, end] = ranges[index]

    // A range must never be reversed.
    if (start > end)
      throw new Error(message || `deleted range ${index} is reversed`)

    // After the first range each must start strictly above the previous end + 1
    // so ranges stay sorted, disjoint, and non-adjacent (otherwise they merge).
    if (index > 0) {
      const previousEnd = ranges[index - 1][1]
      if (start <= previousEnd + 1n)
        throw new Error(
          message || `deleted range ${index} overlaps or abuts its predecessor`
        )
    }
  }
}

/**
 * Asserts the full structural integrity of a replica's internal block graph.
 *
 * This is the workhorse assertion: it should hold after every mutation, merge,
 * snapshot hydration, acknowledgement, and garbage collection step. It proves
 * that the graph is acyclic, that traversal terminates from both ends, that the
 * head and tail are consistent, that the cursor stays inside the projection,
 * that every visible value is reachable exactly once, that indexed reads agree
 * with traversal, and that the tombstone ranges remain normalized.
 *
 * It assumes a *non-corrupt* replica (the invariant suite never deliberately
 * pokes internal state); the dedicated coverage tests own the corrupt-state
 * fallbacks separately.
 *
 * @param {object} api - The CRList primitive API.
 * @param {object} replica - The CRList replica state.
 * @param {string} [label] - A context label prefixed to any failure.
 */
export function assertStructuralIntegrity(api, replica, label) {
  // Build a prefix so failures point at the originating invariant.
  const where = label ? `${label}: ` : ''

  // The size must be a non-negative integer at all times.
  if (!Number.isInteger(replica.size) || replica.size < 0)
    throw new Error(`${where}replica size ${replica.size} is not a valid count`)

  // An empty replica must have no head, tail, cursor, or indexed ids.
  if (replica.size === 0) {
    if (replica.firstBlock !== undefined)
      throw new Error(`${where}empty replica retained a head block`)
    if (replica.lastBlock !== undefined)
      throw new Error(`${where}empty replica retained a tail block`)
    if (replica.currentBlock !== undefined)
      throw new Error(`${where}empty replica retained a cursor block`)
    if (replica.blocksById && replica.blocksById.size !== 0)
      throw new Error(`${where}empty replica retained indexed item ids`)

    // The tombstone ranges must still be normalized even when empty.
    assertTombstonesNormalized(replica, `${where}empty replica tombstones`)
    return
  }

  // Bound every traversal so corruption fails fast instead of hanging.
  const traversalLimit = replica.size + (replica.blocksById?.size ?? 0) + 16

  // The head block must not have a predecessor in the projection.
  if (replica.firstBlock.previousBlock !== undefined)
    throw new Error(`${where}head block has a previous block`)

  // Walk forward from the head, collecting the visible block order.
  const forwardBlocks = []
  const forwardSeen = new Set()
  for (
    let block = replica.firstBlock, step = 0;
    block;
    block = block.nextBlock, step++
  ) {
    // Exceeding the bound proves forward traversal does not terminate.
    if (step > traversalLimit)
      throw new Error(`${where}forward traversal did not terminate`)

    // A repeated block proves a forward cycle exists.
    if (forwardSeen.has(block))
      throw new Error(`${where}forward traversal contains a cycle`)

    // Record the block in forward order.
    void forwardSeen.add(block)
    void forwardBlocks.push(block)
  }

  // The final forward block must be the recorded tail block.
  const tailBlock = forwardBlocks[forwardBlocks.length - 1]
  if (replica.lastBlock !== tailBlock)
    throw new Error(`${where}tail block does not match forward traversal end`)

  // The tail block must not have a successor in the projection.
  if (tailBlock.nextBlock !== undefined)
    throw new Error(`${where}tail block has a next block`)

  // Walk backward from the tail to prove backward traversal also terminates.
  const backwardBlocks = []
  const backwardSeen = new Set()
  for (
    let block = replica.lastBlock, step = 0;
    block;
    block = block.previousBlock, step++
  ) {
    // Exceeding the bound proves backward traversal does not terminate.
    if (step > traversalLimit)
      throw new Error(`${where}backward traversal did not terminate`)

    // A repeated block proves a backward cycle exists.
    if (backwardSeen.has(block))
      throw new Error(`${where}backward traversal contains a cycle`)

    // Record the block; it is reversed below for comparison.
    void backwardSeen.add(block)
    void backwardBlocks.push(block)
  }

  // The reversed backward walk must equal the forward walk block-for-block.
  void backwardBlocks.reverse()
  if (backwardBlocks.length !== forwardBlocks.length)
    throw new Error(`${where}backward block count differs from forward`)
  for (let index = 0; index < forwardBlocks.length; index++)
    if (forwardBlocks[index] !== backwardBlocks[index])
      throw new Error(`${where}backward order diverged at block ${index}`)

  // The cursor must be reachable by walking back to the head (in the projection).
  if (replica.currentBlock) {
    let cursorIsReachable = false
    let cursorWalk = replica.currentBlock
    for (let step = 0; cursorWalk && step <= traversalLimit; step++) {
      if (cursorWalk === replica.firstBlock) {
        cursorIsReachable = true
        break
      }
      cursorWalk = cursorWalk.previousBlock
    }
    if (!cursorIsReachable)
      throw new Error(`${where}cursor block is not inside the live projection`)
  }

  // Every visible item must be reachable exactly once and indexed correctly.
  let liveItemCount = 0
  for (const block of forwardBlocks) {
    // Each item id maps back to the containing block through `blocksById`.
    for (let offset = 0; offset < block.items.length; offset++) {
      // Count the live item toward the total.
      liveItemCount++

      // The id-index must resolve this item id to the very block holding it.
      if (replica.blocksById) {
        const itemId = block.id + BigInt(offset)
        if (replica.blocksById.get(itemId) !== block)
          throw new Error(`${where}id index does not resolve to its block`)
      }
    }
  }

  // The reachable live item count must equal the reported size.
  if (liveItemCount !== replica.size)
    throw new Error(
      `${where}reachable item count ${liveItemCount} did not match size ${replica.size}`
    )

  // The id-index size must equal the live item count (no stale or phantom ids).
  if (replica.blocksById && replica.blocksById.size !== replica.size)
    throw new Error(
      `${where}id index size ${replica.blocksById.size} did not match size ${replica.size}`
    )

  // Indexed reads must agree with the structural projection for every position.
  assertProjectionMatchesMaterialization(
    api,
    replica,
    `${where}indexed reads diverged from structural projection`
  )

  // The tombstone ranges must remain normalized after the operation.
  assertTombstonesNormalized(replica, `${where}tombstones not normalized`)
}

/**
 * Asserts every replica in a set has converged to the same live projection.
 *
 * Convergence is checked through two independent paths — indexed reads and graph
 * traversal — against the first replica, and each replica is also checked for
 * structural integrity so a "converged but corrupt" state cannot pass.
 *
 * @param {object} api - The CRList primitive API.
 * @param {Array<object>} replicas - The replicas expected to have converged.
 * @param {string} [label] - A context label prefixed to any failure.
 */
export function assertReplicasConverged(api, replicas, label) {
  // Build a prefix so failures point at the originating scenario.
  const where = label ? `${label}: ` : ''

  // A single replica trivially "converges" with itself.
  if (replicas.length < 2) return

  // Treat the first replica as the reference projection.
  const reference = replicas[0]
  const referenceIds = liveIds(reference)

  // Validate the reference replica's own structural integrity first.
  assertStructuralIntegrity(api, reference, `${where}reference replica`)

  // Compare every other replica against the reference projection.
  for (let index = 1; index < replicas.length; index++) {
    // Validate the candidate replica's structural integrity before comparison.
    const candidate = replicas[index]
    assertStructuralIntegrity(api, candidate, `${where}replica ${index}`)

    // The candidate's structural projection must equal the reference's.
    assertDeepEqual(
      liveIds(candidate),
      referenceIds,
      `${where}replica ${index} diverged from the reference projection`
    )

    // The candidate's indexed reads must also equal the reference's reads.
    assertDeepEqual(
      materializedIds(api, candidate),
      materializedIds(api, reference),
      `${where}replica ${index} indexed reads diverged from the reference`
    )
  }
}

/**
 * Hydrates a fresh replica from a base snapshot and merges a list of deltas.
 *
 * Used by the merge-algebra assertions to apply the same deltas to independent
 * replicas in different orders without disturbing the source replicas.
 *
 * @param {object} api - The CRList primitive API.
 * @param {object} baseSnapshot - The snapshot to hydrate the new replica from.
 * @param {Array<object>} deltas - The deltas to merge in order.
 * @returns {object} The hydrated and merged replica.
 */
export function replicaFromSnapshotWithDeltas(api, baseSnapshot, deltas) {
  // Hydrate a brand new replica from the supplied base snapshot.
  const replica = api.__create(baseSnapshot)

  // Apply each delta in the supplied order.
  for (const delta of deltas) void api.__merge(replica, delta)

  // Return the resulting replica for inspection.
  return replica
}

/**
 * Asserts that merging a delta is idempotent for the live projection.
 *
 * The delta is merged once to obtain the converged projection, then merged again
 * and required to leave the projection unchanged. The second merge must also be
 * reported as a no-op (a falsy return) since nothing visible changed.
 *
 * @param {object} api - The CRList primitive API.
 * @param {object} baseSnapshot - The base snapshot both replicas start from.
 * @param {object} delta - The delta whose merge must be idempotent.
 * @param {string} [label] - A context label prefixed to any failure.
 */
export function assertMergeIdempotent(api, baseSnapshot, delta, label) {
  // Build a prefix so failures point at the originating invariant.
  const where = label ? `${label}: ` : ''

  // Hydrate a replica and apply the delta exactly once.
  const replica = api.__create(baseSnapshot)
  void api.__merge(replica, delta)

  // Capture the projection after the first application.
  const afterFirst = liveIds(replica)

  // Apply the same delta a second time; it must report no visible change.
  const secondResult = api.__merge(replica, delta)
  assert(
    secondResult === false,
    `${where}re-merging a delta reported a visible change`
  )

  // The projection must be byte-for-byte identical after the second merge.
  assertDeepEqual(
    liveIds(replica),
    afterFirst,
    `${where}re-merging a delta changed the live projection`
  )

  // The replica must remain structurally consistent after the idempotent merge.
  assertStructuralIntegrity(api, replica, `${where}after idempotent merge`)
}

/**
 * Asserts that two deltas converge to the same projection regardless of order.
 *
 * This proves commutativity for the live projection: applying `deltaA` then
 * `deltaB` must yield the same visible sequence as `deltaB` then `deltaA`.
 *
 * @param {object} api - The CRList primitive API.
 * @param {object} baseSnapshot - The base snapshot both replicas start from.
 * @param {object} deltaA - The first delta.
 * @param {object} deltaB - The second delta.
 * @param {string} [label] - A context label prefixed to any failure.
 */
export function assertMergeCommutative(api, baseSnapshot, deltaA, deltaB, label) {
  // Build a prefix so failures point at the originating invariant.
  const where = label ? `${label}: ` : ''

  // Apply the deltas in the forward order on an independent replica.
  const forward = replicaFromSnapshotWithDeltas(api, baseSnapshot, [
    deltaA,
    deltaB,
  ])

  // Apply the deltas in the reverse order on another independent replica.
  const reverse = replicaFromSnapshotWithDeltas(api, baseSnapshot, [
    deltaB,
    deltaA,
  ])

  // Both orders must reach the same visible projection.
  assertDeepEqual(
    liveIds(forward),
    liveIds(reverse),
    `${where}delta order changed the live projection`
  )

  // Both replicas must also be structurally consistent.
  assertStructuralIntegrity(api, forward, `${where}forward order`)
  assertStructuralIntegrity(api, reverse, `${where}reverse order`)
}

/**
 * Asserts that a set of deltas converges identically under several orderings.
 *
 * This proves order-insensitivity (the practical form of associativity plus
 * commutativity for the live projection): every supplied permutation seed must
 * yield the same visible sequence.
 *
 * @param {object} api - The CRList primitive API.
 * @param {object} baseSnapshot - The base snapshot every replica starts from.
 * @param {Array<object>} deltas - The deltas to deliver in shuffled orders.
 * @param {Array<number>} seeds - The permutation seeds to test.
 * @param {(deltas: Array<object>, seed: number) => Array<object>} permute -
 *   A deterministic permutation function (typically `shuffle`).
 * @param {string} [label] - A context label prefixed to any failure.
 * @returns {Array<unknown>} The agreed projection ids across all orderings.
 */
export function assertMergeOrderInsensitive(
  api,
  baseSnapshot,
  deltas,
  seeds,
  permute,
  label
) {
  // Build a prefix so failures point at the originating invariant.
  const where = label ? `${label}: ` : ''

  // Establish the reference projection from the natural delivery order.
  const reference = replicaFromSnapshotWithDeltas(api, baseSnapshot, deltas)
  const referenceIds = liveIds(reference)
  assertStructuralIntegrity(api, reference, `${where}natural order`)

  // Each permutation seed must converge to the very same projection.
  for (const seed of seeds) {
    // Deliver the deltas in a deterministic shuffled order for this seed.
    const shuffledDeltas = permute(deltas, seed)
    const candidate = replicaFromSnapshotWithDeltas(
      api,
      baseSnapshot,
      shuffledDeltas
    )

    // The shuffled delivery must match the reference projection exactly.
    assertDeepEqual(
      liveIds(candidate),
      referenceIds,
      `${where}shuffled delivery (seed ${seed}) diverged from natural order`
    )

    // The shuffled-delivery replica must also be structurally consistent.
    assertStructuralIntegrity(api, candidate, `${where}shuffled seed ${seed}`)
  }

  // Return the agreed projection so callers can assert further properties.
  return referenceIds
}

/**
 * Asserts that hydrating a fresh replica from a snapshot recreates the same
 * live projection and a structurally consistent graph.
 *
 * @param {object} api - The CRList primitive API.
 * @param {object} replica - The replica to snapshot and re-hydrate.
 * @param {string} [label] - A context label prefixed to any failure.
 * @returns {object} The newly hydrated replica.
 */
export function assertSnapshotRoundTrip(api, replica, label) {
  // Build a prefix so failures point at the originating invariant.
  const where = label ? `${label}: ` : ''

  // Produce a full-state snapshot and hydrate a fresh replica from it.
  const snapshot = api.__snapshot(replica)
  const hydrated = api.__create(snapshot)

  // The hydrated projection must equal the original projection exactly.
  assertDeepEqual(
    liveIds(hydrated),
    liveIds(replica),
    `${where}snapshot roundtrip changed the live projection`
  )

  // The hydrated replica must be structurally consistent.
  assertStructuralIntegrity(api, hydrated, `${where}after snapshot roundtrip`)

  // Return the hydrated replica for any further assertions.
  return hydrated
}
