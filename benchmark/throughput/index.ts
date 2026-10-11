import { caseColumns } from '../.shared/report.ts'
import { arch, cpus, platform } from 'node:os'
import { Projection, type Gossip, type Sequence } from '../../dist/index.js'
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
async function initialSequence(
  count: number,
  random: Random,
  config: BenchmarkConfig
): Promise<Sequence<number>> {
  const state = new Projection<number>(1)
  for (let index = 0; index < count; ++index) {
    const length = random.inclusive(
      config.minimumStripFrameLength,
      config.maximumStripFrameLength
    )
    await state.insert(
      new Array<number>(length).fill(index),
      await state.length()
    )
  }
  return await state.sequence()
}
/** Each burst starts from independent Footage; masks must not mutate another case's input. */
async function prepare(
  operation: ThroughputCase,
  initial: Sequence<number>,
  random: Random,
  config: BenchmarkConfig
) {
  const snapshot = structuredClone(initial)
  const state = new Projection<number>(1, snapshot)
  const fixedIndex = Math.floor((await state.length()) / 2)
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
    ? await Promise.all(
        Array.from({ length: config.maximumCalls }, async () =>
          operation === 'value.random'
            ? random.integer(await state.length())
            : random.nextUint32() / 4294967296
        )
      )
    : []
  const updates: Array<Gossip<number>> = []
  if (operation === 'apply.insert' || operation === 'merge.insert') {
    const sender = new Projection<number>(2, snapshot)
    for (const payload of payloads) {
      updates.push(await sender.insert(payload, await sender.length()))
    }
  } else if (operation === 'apply.duplicate' || operation === 'merge.duplicate')
    updates.push([snapshot[1].at(-1)!])
  if (operation === 'retire')
    // Establish distinct active Actors outside the measured retirement calls.
    await state.apply(
      Array.from({ length: config.maximumCalls }, (_, index) => [index + 2])
    )
  const position = async (kind: string, index: number, insertion = false) =>
    kind.endsWith('.head')
      ? 0
      : kind.endsWith('.tail')
        ? (await state.length()) - (insertion ? 0 : 1)
        : kind.endsWith('.random')
          ? Math.floor(
              positions[index] * ((await state.length()) + (insertion ? 1 : 0))
            )
          : Math.floor((await state.length()) / 2)
  const call = async (index: number): Promise<unknown> => {
    switch (operation) {
      case 'insert.head':
      case 'insert.tail':
      case 'insert.middle':
      case 'insert.random':
        return await state.insert(
          payloads[index],
          await position(operation, index, true)
        )
      case 'insert.sameIndex':
        return await state.insert(payloads[index], fixedIndex)
      case 'remove.head':
      case 'remove.tail':
      case 'remove.middle': {
        const at = await position(operation, index)
        return await state.remove(at, at)
      }
      case 'replace.head':
      case 'replace.tail':
      case 'replace.middle': {
        const at = await position(operation, index)
        return await state.replace(payloads[index], at, at)
      }
      case 'value.head':
      case 'value.tail':
      case 'value.middle':
        return await state.value(await position(operation, index))
      case 'value.random':
        return await state.value(positions[index])
      case 'value.sameIndex':
        return await state.value(fixedIndex)
      case 'values':
        return await state.values()
      case 'length':
        return await state.length()
      case 'sequence':
        return await state.sequence()
      case 'create.sequence': {
        const created = new Projection<number>(1, snapshot)
        await created.length()
        return created
      }
      case 'create.empty': {
        const created = new Projection<number>(1)
        await created.length()
        return created
      }
      case 'apply.insert':
        return await state.apply(updates[index])
      case 'merge.insert':
        return await state.merge([[[2]], updates[index]])
      case 'apply.duplicate':
        return await state.apply(updates[0])
      case 'merge.duplicate':
        return await state.merge([[[2]], updates[0]])
      case 'retire':
        return await state.retire(index + 2)
    }
  }
  return { state, call, payloads }
}
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
async function observe(state: Projection<number>): Promise<Observation> {
  const sequence = await state.sequence()
  const stripCount = sequence[1].filter((entry) => (entry[0][5] | 0) > 0).length
  return {
    stripCount,
    frameCount: await state.length(),
    retainedInsertionCount: sequence[1].length,
    ...measureSpace(sequence, stripCount, await state.length()),
    processMemory: measureProcessMemory(),
  }
}
/** Time the entire API-call loop; setup, snapshots, serialization and reporting are outside it. */
async function burst(
  work: Awaited<ReturnType<typeof prepare>>,
  operation: ThroughputCase,
  config: BenchmarkConfig
): Promise<MetricResult> {
  let count = 0
  const removing = operation.startsWith('remove.')
  const limit = removing
    ? Math.min(config.maximumCalls, await work.state.length())
    : config.maximumCalls
  const start = process.hrtime.bigint()
  const duration = BigInt(config.burstMilliseconds) * 1000000n
  while (count < limit) {
    resultSink = await work.call(count++)
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
export async function runThroughput(
  config: BenchmarkConfig
): Promise<ThroughputReport> {
  const samples: Array<ThroughputSample> = []
  const seed = seedFromString(config.baseSeed)
  for (let run = 0; run < config.runs; ++run) {
    for (const size of config.checkpoints) {
      const initial = await initialSequence(
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
          await burst(
            await prepare(operation, initial, new Random(caseSeed), warmup),
            operation,
            warmup
          )
          resultSink = undefined
        }
        const work = await prepare(
          operation,
          initial,
          new Random(caseSeed),
          config
        )
        await collectGarbage()
        const before = await observe(work.state)
        const metric = await burst(work, operation, config)
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
        if ((await work.state.length()) !== expected)
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
          after: await observe(work.state),
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
