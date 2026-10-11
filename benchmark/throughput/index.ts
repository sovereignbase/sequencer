import { caseColumns } from '../.shared/report.ts'
import { arch, cpus, platform } from 'node:os'
import { Projection, type Gossip, type Sequence } from '../../dist/class.js'
import { deriveSeed, Random, seedFromString } from '../.shared/support.ts'
import { measureProcessMemory, measureSpace } from '../.shared/space.ts'
import type {
  BenchmarkConfig,
  BenchmarkReport,
  MetricResult,
} from '../.shared/types.ts'

export const throughputCases = [
  'apply.duplicate',
  'apply.insert',
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
  'remove.tail',
  'replace.head',
  'replace.middle',
  'replace.tail',
  'retire',
  'sequence',
  'value.head',
  'value.middle',
  'value.random',
  'value.sameIndex',
  'value.tail',
  'values',
] as const
export type ThroughputCase = (typeof throughputCases)[number]

type Observation = ReturnType<typeof measureSpace> & {
  stripCount: number
  frameCount: number
  structuralStripCount: number
  retainedInsertionCount: number
  processMemory: ReturnType<typeof measureProcessMemory>
}
export type ThroughputSample = {
  run: number
  initialStripCount: number
  operation: ThroughputCase
  metric: MetricResult
  before: Observation
  after: Observation
}
export type ThroughputReport = {
  schemaVersion: 2
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

let resultSink: unknown

function initialSequence(
  count: number,
  random: Random,
  config: BenchmarkConfig
): Sequence<number> {
  const state = new Projection<number>(1)
  for (let index = 0; index < count; ++index) {
    const length = random.inclusive(
      config.minimumStripFrameLength,
      config.maximumStripFrameLength
    )
    state.insert(new Array<number>(length).fill(index), state.length())
  }
  return state.sequence()
}

/** Each burst starts from independent Footage; masks must not mutate another case's input. */
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
  const replacing = operation.startsWith('replace.')
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
  const positions = operation.endsWith('.random')
    ? Array.from({ length: config.maximumCalls }, () =>
        operation === 'value.random'
          ? random.integer(state.length())
          : random.nextUint32() / 0x1_0000_0000
      )
    : []
  const updates: Array<Gossip<number>> = []
  if (operation === 'apply.insert' || operation === 'merge.insert') {
    const sender = new Projection<number>(2, snapshot)
    for (const payload of payloads) {
      updates.push(sender.insert(payload, sender.length()))
    }
  } else if (operation === 'apply.duplicate' || operation === 'merge.duplicate')
    updates.push([snapshot[1].at(-1)!])
  if (operation === 'retire')
    // Establish distinct active Actors outside the measured retirement calls.
    state.apply(
      Array.from({ length: config.maximumCalls }, (_, index) => [index + 2])
    )

  const position = (kind: string, index: number, insertion = false) =>
    kind.endsWith('.head')
      ? 0
      : kind.endsWith('.tail')
        ? state.length() - (insertion ? 0 : 1)
        : kind.endsWith('.random')
          ? Math.floor(
              positions[index] * (state.length() + (insertion ? 1 : 0))
            )
          : Math.floor(state.length() / 2)
  const call = (index: number): unknown => {
    switch (operation) {
      case 'insert.head':
      case 'insert.tail':
      case 'insert.middle':
      case 'insert.random':
        return state.insert(payloads[index], position(operation, index, true))
      case 'insert.sameIndex':
        return state.insert(payloads[index], fixedIndex)
      case 'remove.head':
      case 'remove.tail':
      case 'remove.middle': {
        const at = position(operation, index)
        return state.remove(at, at)
      }
      case 'replace.head':
      case 'replace.tail':
      case 'replace.middle': {
        const at = position(operation, index)
        return state.replace(payloads[index], at, at)
      }
      case 'value.head':
      case 'value.tail':
      case 'value.middle':
        return state.value(position(operation, index))
      case 'value.random':
        return state.value(positions[index])
      case 'value.sameIndex':
        return state.value(fixedIndex)
      case 'values':
        return state.values()
      case 'length':
        return state.length()
      case 'sequence':
        return state.sequence()
      case 'create.sequence':
        return new Projection<number>(1, snapshot)
      case 'create.empty':
        return new Projection<number>(1)
      case 'apply.insert':
        return state.apply(updates[index])
      case 'merge.insert':
        return state.merge([[[2]], updates[index]])
      case 'apply.duplicate':
        return state.apply(updates[0])
      case 'merge.duplicate':
        return state.merge([[[2]], updates[0]])
      case 'retire':
        return state.retire(index + 2)
    }
  }
  return { state, call, payloads }
}

async function collectGarbage(): Promise<void> {
  const gc = (globalThis as typeof globalThis & { gc?: () => void }).gc
  gc?.()
  await new Promise<void>((resolve) => setImmediate(resolve))
  gc?.()
}

function observe(state: Projection<number>): Observation {
  let stripCount = 0
  for (let strip = state.structuralHead; strip; strip = strip.rightStep)
    if ((strip.fragmentDiff ?? strip.insertionDiff) > 0) ++stripCount
  const sequence = state.sequence()
  return {
    stripCount,
    frameCount: state.length(),
    structuralStripCount: state.structuralStripCount,
    retainedInsertionCount: sequence[1].length,
    ...measureSpace(sequence, stripCount, state.length()),
    processMemory: measureProcessMemory(),
  }
}

/** Time the entire API-call loop; setup, snapshots, serialization and reporting are outside it. */
function burst(
  work: ReturnType<typeof prepare>,
  operation: ThroughputCase,
  config: BenchmarkConfig
): MetricResult {
  let count = 0
  const removing = operation.startsWith('remove.')
  const limit = removing
    ? Math.min(config.maximumCalls, work.state.length())
    : config.maximumCalls
  const start = process.hrtime.bigint()
  const duration = BigInt(config.burstMilliseconds) * 1_000_000n
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
    operationsPerSecond: 1_000_000_000 / averageNanoseconds,
    // Batch timing does not measure individual-call extrema.
    minimumNanoseconds: null,
    maximumNanoseconds: null,
  }
}

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
        const caseSeed = deriveSeed(
          seed,
          `run:${run}:size:${size}:${operation}`
        )
        if (config.warmupCycles > 0) {
          const warmup = {
            ...config,
            maximumCalls: Math.min(config.maximumCalls, config.warmupCycles),
          }
          burst(
            prepare(operation, initial, new Random(caseSeed), warmup),
            operation,
            warmup
          )
          resultSink = undefined
        }
        const work = prepare(operation, initial, new Random(caseSeed), config)
        await collectGarbage()
        const before = observe(work.state)
        const metric = burst(work, operation, config)
        if (
          (operation === 'apply.insert' || operation === 'merge.insert') &&
          resultSink === undefined
        )
          throw new TypeError('Throughput remote input was rejected.')
        const expected =
          before.frameCount +
          (operation.startsWith('insert.') ||
          operation === 'apply.insert' ||
          operation === 'merge.insert'
            ? work.payloads
                .slice(0, metric.count)
                .reduce((sum, payload) => sum + payload.length, 0)
            : operation.startsWith('remove.')
              ? -metric.count
              : 0)
        if (work.state.length() !== expected)
          throw new TypeError(
            `Throughput ${operation} changed the expected Frame count.`
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
          operationsPerSecond: (1_000_000_000 * count) / totalNanoseconds,
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
      'avg µs': (metric.averageNanoseconds! / 1_000).toFixed(3),
    }))
  )
  return {
    schemaVersion: 2,
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

function printCheckpoint(samples: Array<ThroughputSample>): void {
  console.table(
    samples.map(({ operation, metric, before, after }) => ({
      ...caseColumns(operation),
      calls: metric.count,
      'ops/sec': Math.round(metric.operationsPerSecond!).toLocaleString(
        'en-US'
      ),
      'avg µs': (metric.averageNanoseconds! / 1_000).toFixed(3),
      'initial Frames': before.frameCount,
      'final Frames': after.frameCount,
    }))
  )
  console.log('Memory usage')
  console.table(
    samples.map(({ operation, before, after }) => ({
      ...caseColumns(operation),
      'visible Strips': after.stripCount,
      'structural Strips': after.structuralStripCount,
      'initial estimated bytes': before.memory.bytes,
      'final estimated bytes': after.memory.bytes,
      'memory B/Frame': after.memory.bytesPerFrame?.toFixed(3) ?? '—',
      'process RSS bytes': after.processMemory.rssBytes,
      'process heap used bytes': after.processMemory.heapUsedBytes,
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
