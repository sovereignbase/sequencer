/** Isolated public-API bursts; fixture generation, serialization and observation are untimed. */
import { caseColumns } from '../.shared/report.ts'
import { arch, cpus, platform } from 'node:os'
import type { Gossip, Sequence } from '../../dist/index.js'
import {
  Projection,
  PeerProjection,
  measureRuntimeMemory,
  resetRuntime,
} from '../.shared/runtime.ts'
import { deriveSeed, Random, seedFromString } from '../.shared/support.ts'
import { measureProcessMemory, measureSpace } from '../.shared/space.ts'
import { sequenceCounts, sequenceMetadata } from '../.shared/sequence.ts'
import type {
  BenchmarkConfig,
  BenchmarkReport,
  MetricResult,
  RuntimeMemoryResult,
} from '../.shared/types.ts'
/** Positional reads/writes and distinct fresh or duplicate remote operations. */
export const throughputCases = [
  'apply.duplicate',
  'apply.duplicateRemove',
  'apply.duplicateReplace',
  'apply.insert',
  'apply.remove',
  'apply.replace',
  'create.empty',
  'create.sequence',
  'insert.head',
  'insert.middle',
  'insert.random',
  'insert.sameIndex',
  'insert.tail',
  'length',
  'merge.duplicate',
  'merge.insert',
  'remove.head',
  'remove.middle',
  'remove.random',
  'remove.sameIndex',
  'remove.tail',
  'replace.head',
  'replace.middle',
  'replace.random',
  'replace.sameIndex',
  'replace.tail',
  'retire',
  'sequence',
  'value.head',
  'value.middle',
  'value.random',
  'value.sameIndex',
  'value.tail',
  'values',
  'values.head',
  'values.middle',
  'values.random',
  'values.sameIndex',
  'values.tail',
] as const
/** Method and fixture variant selecting one independent burst. */
export type ThroughputCase = (typeof throughputCases)[number]
/** Isolated library memory, exported representation, and shared-process observations. */
type Observation = ReturnType<typeof measureSpace> & {
  runtimeMemory: RuntimeMemoryResult
  stripCount: number
  frameCount: number
  retainedInsertionCount: number
  processMemory: ReturnType<typeof measureProcessMemory>
}
/** One measured burst with untimed state observations on either side. */
export type ThroughputSample = {
  run: number
  initialStripCount: number
  operation: ThroughputCase
  metric: MetricResult
  before: Observation
  after: Observation
}
/** Reproducible fixture configuration, raw samples and call-weighted timings. */
export type ThroughputReport = {
  schemaVersion: 3
  suite: 'throughput'
  generatedAt: string
  environment: BenchmarkReport['environment']
  config: BenchmarkConfig
  samples: Array<ThroughputSample>
  aggregates: Array<{
    initialStripCount: number
    operation: ThroughputCase
    metric: MetricResult
  }>
}
/** Retains the last API result so measured work remains observable. */
let resultSink: unknown
/** Builds workload Strips; consecutive appends may coalesce into fewer native roots. */
function initialSequence(
  count: number,
  random: Random,
  config: BenchmarkConfig
): Sequence<number> {
  const state = new PeerProjection<number>(1)
  for (let index = 0; index < count; ++index) {
    const length = random.inclusive(
      config.minimumStripFrameLength,
      config.maximumStripFrameLength
    )
    state.insert(new Array<number>(length).fill(index), state.length())
  }
  const sequence = state.sequence()
  state.destroy()
  return sequence
}
/** Prepares independent Footage and pre-authored remote inputs outside timing. */
function prepare(
  operation: ThroughputCase,
  initial: Sequence<number>,
  random: Random,
  config: BenchmarkConfig
) {
  const snapshot = structuredClone(initial)
  const state = new Projection<number>(1, snapshot)
  const fixedIndex = Math.floor(state.length() / 2)
  const inserting =
    operation.startsWith('insert.') ||
    operation === 'apply.insert' ||
    operation === 'merge.insert'
  const replacing =
    operation.startsWith('replace.') ||
    operation === 'apply.replace' ||
    operation === 'apply.duplicateReplace'
  const removing =
    operation.startsWith('remove.') || operation === 'apply.remove'
  // Removal consumes the fixture; a fixed midpoint runs out before head or tail does.
  const limit = removing
    ? Math.min(
        config.maximumCalls,
        state.length() - (operation === 'remove.sameIndex' ? fixedIndex : 0)
      )
    : config.maximumCalls
  const rangeLength = Math.min(config.maximumStripFrameLength, state.length())
  const fixedRangeStart = Math.floor((state.length() - rangeLength) / 2)
  const payloads =
    inserting || replacing
      ? Array.from({ length: config.maximumCalls }, (_, index) =>
          new Array<number>(
            replacing
              ? 1
              : random.inclusive(
                  config.minimumStripFrameLength,
                  config.maximumStripFrameLength
                )
          ).fill(index)
        )
      : []
  // Prepare entropy outside timing; mutations map fractions to the live length.
  const positions = operation.endsWith('.random')
    ? Array.from({ length: config.maximumCalls }, () =>
        operation === 'value.random'
          ? random.integer(state.length())
          : random.nextUint32() / 4294967296
      )
    : []
  const updates: Array<Gossip<number>> = []
  if (
    operation === 'apply.insert' ||
    operation === 'apply.remove' ||
    operation === 'apply.replace' ||
    operation === 'apply.duplicateRemove' ||
    operation === 'apply.duplicateReplace' ||
    operation === 'merge.insert'
  ) {
    const sender = new PeerProjection<number>(2, snapshot)
    // Duplicate cases pre-apply one operation; fresh cases replay distinct causal updates.
    const count = operation.startsWith('apply.duplicate') ? 1 : limit
    for (let index = 0; index < count; ++index) {
      const at = sender.length() - 1
      if (operation === 'apply.remove' || operation === 'apply.duplicateRemove')
        updates.push(sender.remove(at, at))
      else if (
        operation === 'apply.replace' ||
        operation === 'apply.duplicateReplace'
      )
        updates.push(sender.replace(payloads[index], at, at))
      else updates.push(sender.insert(payloads[index], sender.length()))
    }
    sender.destroy()
    if (operation.startsWith('apply.duplicate')) state.apply(updates[0])
  } else if (
    operation === 'apply.duplicate' ||
    operation === 'merge.duplicate'
  ) {
    const coordinates = sequenceMetadata(snapshot[0]).insertions.at(-1)!
    updates.push([[coordinates, snapshot[1].slice(-(coordinates[5] | 0))]])
  }
  // Minimal plain snapshot: one Actor-only ACK followed by a six-word operation.
  const mergeWords = operation.startsWith('merge.')
    ? updates.map((gossip) => [
        3,
        1,
        2,
        ...(gossip[0] as [ReadonlyArray<number>])[0],
      ])
    : []
  if (operation === 'retire')
    // Establish distinct active Actors outside the measured retirement calls.
    state.apply(
      Array.from({ length: config.maximumCalls }, (_, index) => [index + 2])
    )
  /** Resolves a positional variant against the current visible length. */
  const position = (kind: string, index: number, insertion = false) =>
    kind.endsWith('.head')
      ? 0
      : kind.endsWith('.tail')
        ? state.length() - (insertion ? 0 : 1)
        : kind.endsWith('.sameIndex')
          ? fixedIndex
          : kind.endsWith('.random')
            ? kind === 'value.random'
              ? positions[index]
              : Math.floor(
                  positions[index] * (state.length() + (insertion ? 1 : 0))
                )
            : Math.floor(state.length() / 2)
  /** Executes the selected public method using inputs already prepared for this index. */
  const call = (index: number): unknown => {
    switch (operation) {
      case 'insert.head':
      case 'insert.tail':
      case 'insert.middle':
      case 'insert.random':
      case 'insert.sameIndex':
        return state.insert(payloads[index], position(operation, index, true))
      case 'remove.head':
      case 'remove.tail':
      case 'remove.middle':
      case 'remove.random':
      case 'remove.sameIndex': {
        const at = position(operation, index)
        return state.remove(at, at)
      }
      case 'replace.head':
      case 'replace.tail':
      case 'replace.middle':
      case 'replace.random':
      case 'replace.sameIndex': {
        const at = position(operation, index)
        return state.replace(payloads[index], at, at)
      }
      case 'value.head':
      case 'value.tail':
      case 'value.middle':
      case 'value.random':
      case 'value.sameIndex':
        return state.value(position(operation, index))
      case 'values.head':
      case 'values.tail':
      case 'values.middle':
      case 'values.random':
      case 'values.sameIndex': {
        const lastStart = state.length() - rangeLength
        const at =
          operation === 'values.head'
            ? 0
            : operation === 'values.tail'
              ? lastStart
              : operation === 'values.random'
                ? Math.floor(positions[index] * (lastStart + 1))
                : fixedRangeStart
        return state.values(at, at + rangeLength - 1)
      }
      case 'values':
        return state.values()
      case 'length':
        return state.length()
      case 'sequence':
        return state.sequence()
      case 'create.sequence': {
        const created = new PeerProjection<number>(1, snapshot)
        return created
      }
      case 'create.empty': {
        const created = new PeerProjection<number>(1)
        return created
      }
      case 'apply.insert':
      case 'apply.remove':
      case 'apply.replace':
        return state.apply(updates[index])
      case 'merge.insert':
        return state.merge([
          mergeWords[index],
          (updates[index][0] as [unknown, unknown])[1],
        ])
      case 'apply.duplicate':
      case 'apply.duplicateRemove':
      case 'apply.duplicateReplace':
        return state.apply(updates[0])
      case 'merge.duplicate':
        return state.merge([
          mergeWords[0],
          (updates[0][0] as [unknown, unknown])[1],
        ])
      case 'retire':
        return state.retire(index + 2)
    }
  }
  return { state, call, payloads, limit, inserting, removing, rangeLength }
}
/** Collects fixture garbage when --expose-gc is available, outside measured bursts. */
async function collectGarbage(): Promise<void> {
  const gc = (
    globalThis as typeof globalThis & {
      gc?: () => void
    }
  ).gc
  gc?.()
  await new Promise<void>((resolve) => setImmediate(resolve))
  gc?.()
}
/** Measures exported state without charging the API burst for serialization or metadata inspection. */
function observe(state: Projection<number>): Observation {
  const sequence = state.sequence()
  const words = sequence[0]
  const { stripCount, retainedInsertionCount } = sequenceCounts(words)
  return {
    stripCount,
    frameCount: state.length(),
    retainedInsertionCount,
    ...measureSpace(sequence, stripCount, state.length()),
    runtimeMemory: measureRuntimeMemory(),
    processMemory: measureProcessMemory(),
  }
}
/** Time the entire API-call loop; setup, snapshots, serialization and reporting are outside it. */
function burst(
  work: ReturnType<typeof prepare>,
  config: BenchmarkConfig
): MetricResult {
  let count = 0
  const limit = work.limit
  const start = process.hrtime.bigint()
  const duration = BigInt(config.burstMilliseconds) * 1000000n
  while (count < limit) {
    resultSink = work.call(count++)
    // Amortize clock overhead across 64 calls; a slow final batch may exceed the requested duration.
    if (count % 64 === 0 && process.hrtime.bigint() - start >= duration) break
  }
  const totalNanoseconds = Number(process.hrtime.bigint() - start)
  const averageNanoseconds = totalNanoseconds / count
  return {
    count,
    totalNanoseconds,
    averageNanoseconds,
    operationsPerSecond: 1000000000 / averageNanoseconds,
    // Batch timing does not measure individual-call extrema.
    minimumNanoseconds: null,
    maximumNanoseconds: null,
  }
}
/** Runs independent warmed fixtures and pools elapsed time over actual call counts. */
export async function runThroughput(
  config: BenchmarkConfig
): Promise<ThroughputReport> {
  const samples: Array<ThroughputSample> = []
  const seed = seedFromString(config.baseSeed)
  for (let run = 0; run < config.runs; ++run) {
    for (const size of config.checkpoints) {
      const initial = initialSequence(
        size,
        new Random(deriveSeed(seed, `run:${run}:size:${size}`)),
        config
      )
      console.log(
        `\nRun ${run + 1} | throughput | ${size.toLocaleString('en-US')} initial Strips`
      )
      for (const operation of throughputCases) {
        resetRuntime()
        const caseSeed = deriveSeed(
          seed,
          `run:${run}:size:${size}:${operation}`
        )
        if (config.warmupCycles > 0) {
          const warmup = {
            ...config,
            maximumCalls: Math.min(config.maximumCalls, config.warmupCycles),
          }
          const work = prepare(operation, initial, new Random(caseSeed), warmup)
          burst(work, warmup)
          resultSink = undefined
          work.state.destroy()
        }
        // Rebuild measured state after warmup so its mutations cannot change starting scale.
        const work = prepare(operation, initial, new Random(caseSeed), config)
        await collectGarbage()
        const before = observe(work.state)
        const metric = burst(work, config)
        if (
          (operation.startsWith('apply.') || operation.startsWith('merge.')) &&
          resultSink === undefined
        )
          throw new TypeError('Throughput remote input was rejected.')
        // Validate visible effects after timing, distinguishing fresh and duplicate operations.
        const expected =
          before.frameCount +
          (work.inserting
            ? work.payloads
                .slice(0, metric.count)
                .reduce((sum, payload) => sum + payload.length, 0)
            : work.removing
              ? -metric.count
              : 0)
        if (work.state.length() !== expected)
          throw new TypeError(
            `Throughput ${operation} changed the expected Frame count.`
          )
        if (
          operation === 'apply.replace' &&
          work.state.value(before.frameCount - 1) !== metric.count - 1
        )
          throw new TypeError('Throughput replacement was not materialized.')
        if (
          operation.startsWith('values.') &&
          (resultSink as number[]).length !== work.rangeLength
        )
          throw new TypeError(
            'Throughput range returned the wrong Frame count.'
          )
        resultSink = undefined
        await collectGarbage()
        samples.push({
          run,
          initialStripCount: size,
          operation,
          metric,
          before,
          after: observe(work.state),
        })
        work.state.destroy()
      }
      printCheckpoint(
        samples.filter(
          (sample) => sample.run === run && sample.initialStripCount === size
        )
      )
    }
  }
  samples.sort(
    (left, right) =>
      left.operation.localeCompare(right.operation) ||
      left.initialStripCount - right.initialStripCount ||
      left.run - right.run
  )
  // Bursts can stop at different counts; pool elapsed time and calls rather than rates.
  const aggregates = throughputCases.flatMap((operation) =>
    config.checkpoints.map((initialStripCount) => {
      const metrics = samples
        .filter(
          (sample) =>
            sample.initialStripCount === initialStripCount &&
            sample.operation === operation
        )
        .map((sample) => sample.metric)
      const count = metrics.reduce((sum, metric) => sum + metric.count, 0)
      const totalNanoseconds = metrics.reduce(
        (sum, metric) => sum + metric.totalNanoseconds,
        0
      )
      return {
        initialStripCount,
        operation,
        metric: {
          count,
          totalNanoseconds,
          averageNanoseconds: totalNanoseconds / count,
          operationsPerSecond: (1000000000 * count) / totalNanoseconds,
          minimumNanoseconds: null,
          maximumNanoseconds: null,
        },
      }
    })
  )
  console.log('\nAggregate throughput (all runs, weighted by call count)')
  console.table(
    aggregates.map(({ initialStripCount, operation, metric }) => ({
      'initial Strips': initialStripCount,
      ...caseColumns(operation),
      calls: metric.count,
      'ops/sec': Math.round(metric.operationsPerSecond!).toLocaleString(
        'en-US'
      ),
      'avg µs': (metric.averageNanoseconds! / 1000).toFixed(3),
    }))
  )
  return {
    schemaVersion: 3,
    suite: 'throughput',
    generatedAt: new Date().toISOString(),
    config,
    environment: {
      node: process.versions.node,
      v8: process.versions.v8,
      platform: platform(),
      architecture: arch(),
      cpu: cpus()[0]?.model ?? 'Unknown CPU',
    },
    samples,
    aggregates,
  }
}
/** Separates per-burst timing, representation estimates and shared-process memory. */
function printCheckpoint(samples: Array<ThroughputSample>): void {
  console.table(
    samples.map(({ operation, metric, before, after }) => ({
      ...caseColumns(operation),
      calls: metric.count,
      'ops/sec': Math.round(metric.operationsPerSecond!).toLocaleString(
        'en-US'
      ),
      'avg µs': (metric.averageNanoseconds! / 1000).toFixed(3),
      'initial Frames': before.frameCount,
      'final Frames': after.frameCount,
    }))
  )
  console.log('Memory usage')
  console.table(
    samples.map(({ operation, before, after }) => ({
      ...caseColumns(operation),
      'visible Strips': after.stripCount,
      'initial Sequencer KiB': (before.runtimeMemory.bytes / 1024).toFixed(2),
      'final Sequencer KiB': (after.runtimeMemory.bytes / 1024).toFixed(2),
    }))
  )
  console.log('Disk usage (serialized Sequence)')
  console.table(
    samples.map(({ operation, before, after }) => ({
      ...caseColumns(operation),
      'retained insertions': after.retainedInsertionCount,
      'initial sequence bytes': before.storage.sequenceBytes,
      'final sequence bytes': after.storage.sequenceBytes,
      'disk B/Frame': after.storage.bytesPerFrame?.toFixed(3) ?? '—',
    }))
  )
}
