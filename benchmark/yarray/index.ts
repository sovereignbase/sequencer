import { mkdir, writeFile } from 'node:fs/promises'
import { arch, cpus, platform } from 'node:os'
import { dirname, extname, resolve } from 'node:path'
import { createRequire } from 'node:module'
import { pathToFileURL } from 'node:url'
import * as Y from 'yjs'
import {
  deriveSeed,
  formatSeed,
  measure,
  MetricAccumulator,
  OperationAccumulator,
  Random,
  RatioAccumulator,
  seedFromString,
  StripIndex,
} from '../support.ts'
import {
  operation_names,
  type AggregateMetric,
  type Direction,
  type MetricResult,
  type MetricScope,
  type OperationMetrics,
  type OperationName,
  type RatioAverage,
} from '../types.ts'

const require = createRequire(import.meta.url)
const yjsVersion = (require('yjs/package.json') as { version: string }).version
const scopes: Array<MetricScope> = ['scaleUp', 'scaleDown', 'fullLifecycle']
const managementNames = [
  'toArray',
  'encodeStateVector',
  'encodeStateAsUpdate',
  'destroy',
  'initialize',
] as const

type ManagementName = (typeof managementNames)[number]

type Config = {
  runs: number
  maximumStripCount: number
  checkpoints: Array<number>
  minimumStripFrameLength: number
  maximumStripFrameLength: number
  warmupCycles: number
  baseSeed: string
  outputPath: string | null
}

type CapturedReplica = {
  doc: Y.Doc
  array: Y.Array<number>
  capturing: boolean
  capturedUpdate: Uint8Array | undefined
}

type StorageAccumulators = Record<
  MetricScope,
  {
    bytesPerStrip: RatioAccumulator
    bytesPerFrame: RatioAccumulator
  }
>

type Runtime = {
  measured: CapturedReplica
  peer: CapturedReplica
  strips: StripIndex
  random: Random
  nextStripId: number
  metrics: OperationAccumulator
  storage: StorageAccumulators
}

type ManagementMetrics = Record<ManagementName, MetricResult>

type Checkpoint = {
  run: number
  direction: Direction
  stripCount: number
  frameCount: number
  operations: OperationMetrics
  management: ManagementMetrics
  stateVectorBytes: number
  measuredStateUpdateBytes: number
  peerStateUpdateBytes: number
  stateUpdateBytesPerStrip: number | null
  stateUpdateBytesPerFrame: number | null
  processMemory: NodeJS.MemoryUsage
}

type RunResult = {
  run: number
  seed: string
  initialization: MetricResult
  checkpoints: Array<Checkpoint>
  operations: Record<MetricScope, OperationMetrics>
  storageAverages: Record<
    MetricScope,
    {
      bytesPerStrip: RatioAverage
      bytesPerFrame: RatioAverage
    }
  >
}

type Report = {
  schemaVersion: 1
  benchmark: 'yjs-yarray-lifecycle'
  generatedAt: string
  environment: {
    node: string
    v8: string
    yjs: string
    platform: NodeJS.Platform
    architecture: string
    cpu: string
  }
  config: Config
  methodology: {
    implementation: string
    timer: 'process.hrtime.bigint'
    operations: string
    merge: string
    checkpoints: string
    memory: string
  }
  runs: Array<RunResult>
  aggregates: Record<MetricScope, Record<OperationName, AggregateMetric>>
}

let resultSink: unknown

const ratio = (bytes: number, units: number): number | null =>
  units === 0 ? null : bytes / units

const timeMetric = <T>(operation: () => T): [MetricResult, T] => {
  const accumulator = new MetricAccumulator()
  const timed = measure(operation)
  accumulator.add(timed.nanoseconds)
  resultSink = timed.result
  return [accumulator.snapshot(), timed.result]
}

const timeOperation = <T>(
  runtime: Runtime,
  direction: Direction,
  name: OperationName,
  operation: () => T
): T => {
  const timed = measure(operation)
  runtime.metrics.add(name, direction, timed.nanoseconds)
  resultSink = timed.result
  return timed.result
}

const createCapturedReplica = (snapshot?: Uint8Array): CapturedReplica => {
  const doc = new Y.Doc({ gc: true })
  const replica: CapturedReplica = {
    doc,
    array: doc.getArray<number>('sequence'),
    capturing: false,
    capturedUpdate: undefined,
  }
  doc.on('update', (update: Uint8Array) => {
    if (!replica.capturing) return
    if (replica.capturedUpdate !== undefined)
      throw new TypeError('A Y.Array operation emitted multiple updates.')
    replica.capturedUpdate = update
  })
  if (snapshot !== undefined) Y.applyUpdate(doc, snapshot)
  return replica
}

const beginCapture = (replica: CapturedReplica): void => {
  replica.capturedUpdate = undefined
  replica.capturing = true
}

const finishCapture = (
  replica: CapturedReplica,
  operation: string
): Uint8Array => {
  replica.capturing = false
  const update = replica.capturedUpdate
  replica.capturedUpdate = undefined
  if (update === undefined)
    throw new TypeError(`Y.Array ${operation} emitted no update.`)
  return update
}

const runCaptured = (
  replica: CapturedReplica,
  operationName: string,
  operation: () => void
): Uint8Array => {
  beginCapture(replica)
  try {
    operation()
  } finally {
    replica.capturing = false
  }
  return finishCapture(replica, operationName)
}

const runMeasuredMutation = (
  runtime: Runtime,
  direction: Direction,
  operationName: Exclude<OperationName, 'randomFind' | 'randomMerge'>,
  operation: () => void
): void => {
  beginCapture(runtime.measured)
  try {
    timeOperation(runtime, direction, operationName, operation)
  } finally {
    runtime.measured.capturing = false
  }
  const update = finishCapture(runtime.measured, operationName)
  Y.applyUpdate(runtime.peer.doc, update)
}

const createStrip = (
  runtime: Runtime,
  config: Config
): { id: number; length: number; values: Array<number> } => {
  const id = runtime.nextStripId++
  const length = runtime.random.inclusive(
    config.minimumStripFrameLength,
    config.maximumStripFrameLength
  )
  return { id, length, values: new Array<number>(length).fill(id) }
}

const createReplacementStrip = (
  runtime: Runtime,
  length: number
): { id: number; length: number; values: Array<number> } => {
  const id = runtime.nextStripId++
  return { id, length, values: new Array<number>(length).fill(id) }
}

const insertAt = (
  runtime: Runtime,
  config: Config,
  direction: Direction,
  operationName: 'tailInsert' | 'headInsert' | 'randomInsert',
  stripIndex: number
): void => {
  const frameIndex = runtime.strips.frameOffsetAt(stripIndex)
  const strip = createStrip(runtime, config)
  runMeasuredMutation(runtime, direction, operationName, () =>
    runtime.measured.array.insert(frameIndex, strip.values)
  )
  runtime.strips.insert(stripIndex, strip)
}

const removeAt = (
  runtime: Runtime,
  direction: Direction,
  operationName: 'headRemove' | 'tailRemove' | 'randomRemove',
  stripIndex: number
): void => {
  const frameIndex = runtime.strips.frameOffsetAt(stripIndex)
  const strip = runtime.strips.at(stripIndex)
  runMeasuredMutation(runtime, direction, operationName, () =>
    runtime.measured.array.delete(frameIndex, strip.length)
  )
  runtime.strips.remove(stripIndex)
}

const randomFind = (runtime: Runtime, direction: Direction): void => {
  const frameIndex = runtime.random.integer(runtime.strips.frameCount)
  const value = timeOperation(runtime, direction, 'randomFind', () =>
    runtime.measured.array.get(frameIndex)
  )
  if (value === undefined)
    throw new TypeError('Y.Array randomFind did not resolve a value.')
}

const randomReplace = (runtime: Runtime, direction: Direction): void => {
  const stripIndex = runtime.random.integer(runtime.strips.count)
  const frameIndex = runtime.strips.frameOffsetAt(stripIndex)
  const replaced = runtime.strips.at(stripIndex)
  const strip = createReplacementStrip(runtime, replaced.length)
  runMeasuredMutation(runtime, direction, 'randomReplace', () =>
    runtime.measured.doc.transact(() => {
      runtime.measured.array.delete(frameIndex, replaced.length)
      runtime.measured.array.insert(frameIndex, strip.values)
    })
  )
  runtime.strips.replace(stripIndex, strip)
}

const randomMerge = (runtime: Runtime, direction: Direction): void => {
  const stripIndex = runtime.random.integer(runtime.strips.count)
  const frameIndex = runtime.strips.frameOffsetAt(stripIndex)
  const replaced = runtime.strips.at(stripIndex)
  const strip = createReplacementStrip(runtime, replaced.length)
  const update = runCaptured(runtime.peer, 'randomMerge peer replacement', () =>
    runtime.peer.doc.transact(() => {
      runtime.peer.array.delete(frameIndex, replaced.length)
      runtime.peer.array.insert(frameIndex, strip.values)
    })
  )
  timeOperation(runtime, direction, 'randomMerge', () =>
    Y.applyUpdate(runtime.measured.doc, update)
  )
  runtime.strips.replace(stripIndex, strip)
}

const runRandomWorkload = (
  runtime: Runtime,
  config: Config,
  direction: Direction
): void => {
  randomFind(runtime, direction)
  randomReplace(runtime, direction)
  randomMerge(runtime, direction)
  removeAt(
    runtime,
    direction,
    'randomRemove',
    runtime.random.integer(runtime.strips.count)
  )
  insertAt(
    runtime,
    config,
    direction,
    'randomInsert',
    runtime.random.integer(runtime.strips.count + 1)
  )
}

const runScaleUpStep = (runtime: Runtime, config: Config): void => {
  const tail = runtime.strips.count % 2 === 0
  insertAt(
    runtime,
    config,
    'up',
    tail ? 'tailInsert' : 'headInsert',
    tail ? runtime.strips.count : 0
  )
  runRandomWorkload(runtime, config, 'up')
}

const runScaleDownStep = (runtime: Runtime, config: Config): void => {
  runRandomWorkload(runtime, config, 'down')
  const head = runtime.strips.count % 2 === 0
  removeAt(
    runtime,
    'down',
    head ? 'headRemove' : 'tailRemove',
    head ? 0 : runtime.strips.count - 1
  )
}

const makeStorageAccumulators = (): StorageAccumulators => ({
  scaleUp: {
    bytesPerStrip: new RatioAccumulator(),
    bytesPerFrame: new RatioAccumulator(),
  },
  scaleDown: {
    bytesPerStrip: new RatioAccumulator(),
    bytesPerFrame: new RatioAccumulator(),
  },
  fullLifecycle: {
    bytesPerStrip: new RatioAccumulator(),
    bytesPerFrame: new RatioAccumulator(),
  },
})

const makeRuntime = (seed: number, measured: CapturedReplica): Runtime => ({
  measured,
  peer: createCapturedReplica(),
  strips: new StripIndex(),
  random: new Random(seed),
  nextStripId: 1,
  metrics: new OperationAccumulator(),
  storage: makeStorageAccumulators(),
})

const collectGarbage = async (): Promise<void> => {
  const collect = (globalThis as typeof globalThis & { gc?: () => void }).gc
  collect?.()
  await new Promise<void>((resolvePromise) => setImmediate(resolvePromise))
  collect?.()
}

const takeCheckpoint = async (
  run: number,
  direction: Direction,
  runtime: Runtime
): Promise<Checkpoint> => {
  await collectGarbage()
  const [toArrayMetric] = timeMetric(() => runtime.measured.array.toArray())
  const [stateVectorMetric, stateVector] = timeMetric(() =>
    Y.encodeStateVector(runtime.measured.doc)
  )
  const [snapshotMetricResult, measuredSnapshot] = timeMetric(() =>
    Y.encodeStateAsUpdate(runtime.measured.doc)
  )
  const peerSnapshot = Y.encodeStateAsUpdate(runtime.peer.doc)
  const [destroyMetric] = timeMetric(() => runtime.measured.doc.destroy())
  runtime.peer.doc.destroy()
  const [initializeMetric, measured] = timeMetric(() =>
    createCapturedReplica(measuredSnapshot)
  )
  runtime.measured = measured
  runtime.peer = createCapturedReplica(peerSnapshot)

  const stripCount = runtime.strips.count
  const frameCount = runtime.strips.frameCount
  const scope = direction === 'up' ? 'scaleUp' : 'scaleDown'
  for (const selectedScope of [scope, 'fullLifecycle'] as const) {
    runtime.storage[selectedScope].bytesPerStrip.add(
      measuredSnapshot.byteLength,
      stripCount
    )
    runtime.storage[selectedScope].bytesPerFrame.add(
      measuredSnapshot.byteLength,
      frameCount
    )
  }
  await collectGarbage()

  return {
    run,
    direction,
    stripCount,
    frameCount,
    operations: runtime.metrics.snapshot(),
    management: {
      toArray: toArrayMetric,
      encodeStateVector: stateVectorMetric,
      encodeStateAsUpdate: snapshotMetricResult,
      destroy: destroyMetric,
      initialize: initializeMetric,
    },
    stateVectorBytes: stateVector.byteLength,
    measuredStateUpdateBytes: measuredSnapshot.byteLength,
    peerStateUpdateBytes: peerSnapshot.byteLength,
    stateUpdateBytesPerStrip: ratio(measuredSnapshot.byteLength, stripCount),
    stateUpdateBytesPerFrame: ratio(measuredSnapshot.byteLength, frameCount),
    processMemory: process.memoryUsage(),
  }
}

const finishRuntime = (runtime: Runtime): RunResult['storageAverages'] =>
  Object.fromEntries(
    scopes.map((scope) => [
      scope,
      {
        bytesPerStrip: runtime.storage[scope].bytesPerStrip.snapshot(),
        bytesPerFrame: runtime.storage[scope].bytesPerFrame.snapshot(),
      },
    ])
  ) as RunResult['storageAverages']

const runOneLifecycle = async (
  run: number,
  seed: number,
  config: Config,
  reportProgress: boolean
): Promise<RunResult> => {
  const workloadSeed = deriveSeed(seed, 'shared-replica-workload')
  const [initialization, measured] = timeMetric(() => createCapturedReplica())
  const runtime = makeRuntime(workloadSeed, measured)
  const checkpoints: Array<Checkpoint> = []
  const checkpointSet = new Set(config.checkpoints)
  const record = async (direction: Direction): Promise<void> => {
    const checkpoint = await takeCheckpoint(run, direction, runtime)
    checkpoints.push(checkpoint)
    if (reportProgress)
      console.log(
        `Run ${run + 1} | ${direction} | ${checkpoint.stripCount.toLocaleString('en-US')} Strips | ${checkpoint.frameCount.toLocaleString('en-US')} Frames | Yjs update ${checkpoint.measuredStateUpdateBytes.toLocaleString('en-US')} bytes`
      )
  }

  while (runtime.strips.count < config.maximumStripCount) {
    runScaleUpStep(runtime, config)
    if (checkpointSet.has(runtime.strips.count)) await record('up')
  }
  while (runtime.strips.count > 0) {
    runScaleDownStep(runtime, config)
    if (checkpointSet.has(runtime.strips.count)) await record('down')
  }

  runtime.measured.doc.destroy()
  runtime.peer.doc.destroy()
  resultSink = undefined
  return {
    run,
    seed: formatSeed(seed),
    initialization,
    checkpoints,
    operations: {
      scaleUp: runtime.metrics.snapshot('scaleUp'),
      scaleDown: runtime.metrics.snapshot('scaleDown'),
      fullLifecycle: runtime.metrics.snapshot('fullLifecycle'),
    },
    storageAverages: finishRuntime(runtime),
  }
}

const aggregateRuns = (runs: Array<RunResult>): Report['aggregates'] =>
  Object.fromEntries(
    scopes.map((scope) => [
      scope,
      Object.fromEntries(
        operation_names.map((operationName) => {
          const samples = runs
            .map((run) => ({
              run: run.run,
              metric: run.operations[scope][operationName],
            }))
            .filter((sample) => sample.metric.averageNanoseconds !== null)
          const ordered = samples
            .map((sample) => ({
              run: sample.run,
              averageNanoseconds: sample.metric.averageNanoseconds!,
            }))
            .sort(
              (left, right) =>
                left.averageNanoseconds - right.averageNanoseconds
            )
          const count = ordered.length
          const mean =
            count === 0
              ? null
              : ordered.reduce(
                  (sum, sample) => sum + sample.averageNanoseconds,
                  0
                ) / count
          const totalSampleCount = samples.reduce(
            (sum, sample) => sum + sample.metric.count,
            0
          )
          const totalNanoseconds = samples.reduce(
            (sum, sample) => sum + sample.metric.totalNanoseconds,
            0
          )
          const aggregate: AggregateMetric = {
            runCount: count,
            totalSampleCount,
            totalNanoseconds,
            sampleWeightedAverageNanoseconds:
              totalSampleCount === 0
                ? null
                : totalNanoseconds / totalSampleCount,
            sampleWeightedOperationsPerSecond:
              totalNanoseconds === 0
                ? null
                : (1_000_000_000 * totalSampleCount) / totalNanoseconds,
            meanRunAverageNanoseconds: mean,
            medianRunAverageNanoseconds:
              count === 0
                ? null
                : count % 2 === 1
                  ? ordered[(count - 1) / 2].averageNanoseconds
                  : (ordered[count / 2 - 1].averageNanoseconds +
                      ordered[count / 2].averageNanoseconds) /
                    2,
            standardDeviationNanoseconds:
              mean === null
                ? null
                : Math.sqrt(
                    ordered.reduce(
                      (sum, sample) =>
                        sum + (sample.averageNanoseconds - mean) ** 2,
                      0
                    ) / count
                  ),
            minimumRun: ordered[0] ?? null,
            maximumRun: ordered[count - 1] ?? null,
          }
          return [operationName, aggregate]
        })
      ),
    ])
  ) as Report['aggregates']

const microseconds = (nanoseconds: number | null): string =>
  nanoseconds === null ? '—' : (nanoseconds / 1_000).toFixed(3)

const row = (cells: Array<string | number>): string =>
  '| ' + cells.join(' | ') + ' |'

const makeMarkdown = (report: Report): string => {
  const lines = [
    '# Yjs Y.Array dynamic lifecycle benchmark',
    '',
    `Generated: ${report.generatedAt}`,
    '',
    `Yjs ${report.environment.yjs}; Node ${report.environment.node}; V8 ${report.environment.v8}; ${report.environment.platform} ${report.environment.architecture}; ${report.environment.cpu}.`,
    '',
    `Runs: ${report.config.runs}; lifecycle: 0 → ${report.config.maximumStripCount.toLocaleString('en-US')} → 0 visible Strips; Strip length: ${report.config.minimumStripFrameLength}…${report.config.maximumStripFrameLength} Frames.`,
    '',
    '## Aggregate operation latency',
    '',
    '| Scope | operation | calls | ops/sec | weighted avg µs | mean run µs | median run µs | std. dev. µs |',
    '| --- | --- | ---: | ---: | ---: | ---: | ---: | ---: |',
  ]
  for (const scope of scopes)
    for (const operation of operation_names) {
      const metric = report.aggregates[scope][operation]
      lines.push(
        row([
          scope,
          operation,
          metric.totalSampleCount.toLocaleString('en-US'),
          metric.sampleWeightedOperationsPerSecond === null
            ? '—'
            : Math.round(
                metric.sampleWeightedOperationsPerSecond
              ).toLocaleString('en-US'),
          microseconds(metric.sampleWeightedAverageNanoseconds),
          microseconds(metric.meanRunAverageNanoseconds),
          microseconds(metric.medianRunAverageNanoseconds),
          microseconds(metric.standardDeviationNanoseconds),
        ])
      )
    }

  lines.push(
    '',
    '## Scaling performance',
    '',
    'Checkpoint operation values are cumulative and are never reset.',
    '',
    '| Run | direction | Strips | Frames | operation | calls | ops/sec | avg µs | min µs | max µs |',
    '| ---: | --- | ---: | ---: | --- | ---: | ---: | ---: | ---: | ---: |'
  )
  for (const run of report.runs)
    for (const checkpoint of run.checkpoints)
      for (const operation of operation_names) {
        const metric = checkpoint.operations[operation]
        lines.push(
          row([
            run.run,
            checkpoint.direction,
            checkpoint.stripCount.toLocaleString('en-US'),
            checkpoint.frameCount.toLocaleString('en-US'),
            operation,
            metric.count.toLocaleString('en-US'),
            metric.operationsPerSecond === null
              ? '—'
              : Math.round(metric.operationsPerSecond).toLocaleString('en-US'),
            microseconds(metric.averageNanoseconds),
            microseconds(metric.minimumNanoseconds),
            microseconds(metric.maximumNanoseconds),
          ])
        )
      }

  lines.push(
    '',
    '## Checkpoints',
    '',
    '| Run | direction | Strips | Frames | state vector bytes | state update bytes | peer update bytes | update B/Strip | update B/Frame | process RSS |',
    '| ---: | --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |'
  )
  for (const run of report.runs)
    for (const checkpoint of run.checkpoints)
      lines.push(
        row([
          run.run,
          checkpoint.direction,
          checkpoint.stripCount.toLocaleString('en-US'),
          checkpoint.frameCount.toLocaleString('en-US'),
          checkpoint.stateVectorBytes.toLocaleString('en-US'),
          checkpoint.measuredStateUpdateBytes.toLocaleString('en-US'),
          checkpoint.peerStateUpdateBytes.toLocaleString('en-US'),
          checkpoint.stateUpdateBytesPerStrip?.toFixed(3) ?? '—',
          checkpoint.stateUpdateBytesPerFrame?.toFixed(3) ?? '—',
          checkpoint.processMemory.rss.toLocaleString('en-US'),
        ])
      )

  lines.push(
    '',
    '## Lifecycle state-update size averages',
    '',
    '| Run | scope | update B/Strip | update B/Frame |',
    '| ---: | --- | ---: | ---: |'
  )
  for (const run of report.runs)
    for (const scope of scopes)
      lines.push(
        row([
          run.run,
          scope,
          run.storageAverages[scope].bytesPerStrip.averageBytesPerUnit?.toFixed(
            3
          ) ?? '—',
          run.storageAverages[scope].bytesPerFrame.averageBytesPerUnit?.toFixed(
            3
          ) ?? '—',
        ])
      )

  lines.push(
    '',
    '## Checkpoint management latency',
    '',
    '| Run | direction | Strips | operation | avg µs |',
    '| ---: | --- | ---: | --- | ---: |'
  )
  for (const run of report.runs)
    for (const checkpoint of run.checkpoints)
      for (const operation of managementNames)
        lines.push(
          row([
            run.run,
            checkpoint.direction,
            checkpoint.stripCount.toLocaleString('en-US'),
            operation,
            microseconds(checkpoint.management[operation].averageNanoseconds),
          ])
        )

  lines.push(
    '',
    '## Measurement notes',
    '',
    `- ${report.methodology.operations}`,
    `- ${report.methodology.merge}`,
    `- ${report.methodology.checkpoints}`,
    `- ${report.methodology.memory}`,
    ''
  )
  return lines.join('\n')
}

const writeReports = async (
  report: Report
): Promise<{ jsonPath: string; markdownPath: string } | null> => {
  if (report.config.outputPath === null) return null
  const requestedPath = resolve(report.config.outputPath)
  const jsonPath =
    extname(requestedPath).toLowerCase() === '.json'
      ? requestedPath
      : requestedPath + '.json'
  const markdownPath = jsonPath.slice(0, -5) + '.md'
  await mkdir(dirname(jsonPath), { recursive: true })
  await Promise.all([
    writeFile(jsonPath, JSON.stringify(report, null, 2) + '\n'),
    writeFile(markdownPath, makeMarkdown(report)),
  ])
  return { jsonPath, markdownPath }
}

const usage = [
  'Yjs Y.Array lifecycle benchmark',
  '',
  'Usage:',
  '  npm run bench:yarray -- [options]',
  '',
  'Options:',
  '  --runs <n>            Complete runs (default: 3)',
  '  --max-strips <n>      Maximum visible Strip count (default: 10,000)',
  '  --seed <text>          Reproducible workload seed',
  '  --warmup-cycles <n>    Unreported up/down cycles (default: 64)',
  '  --strip-length <n>     Fixed Strip length instead of 1...100',
  '  --min-strip-length <n> Minimum Strip length (default: 1)',
  '  --max-strip-length <n> Maximum Strip length (default: 100)',
  '  --output <path>        JSON output; Markdown uses the same basename',
  '  --no-output            Do not write reports',
  '  --help                 Show this help',
].join('\n')

const readInteger = (name: string, value: string | undefined): number => {
  if (value === undefined) throw new TypeError(`${name} requires a value.`)
  const parsed = Number(value)
  if (!Number.isSafeInteger(parsed))
    throw new TypeError(`${name} must be an integer.`)
  return parsed
}

export const parseConfig = (arguments_: Array<string>): Config => {
  let runs = 3
  let maximumStripCount = 10_000
  let warmupCycles = 64
  let minimumStripFrameLength = 1
  let maximumStripFrameLength = 100
  let baseSeed = 'sequencer-lifecycle-v1'
  let outputPath: string | null = 'benchmark/yarray/results/lifecycle.json'

  for (let index = 0; index < arguments_.length; index++) {
    const argument = arguments_[index]
    if (argument === '--help') {
      console.log(usage)
      process.exit(0)
    } else if (argument === '--runs')
      runs = readInteger(argument, arguments_[++index])
    else if (argument === '--max-strips')
      maximumStripCount = readInteger(argument, arguments_[++index])
    else if (argument === '--warmup-cycles')
      warmupCycles = readInteger(argument, arguments_[++index])
    else if (argument === '--strip-length') {
      const length = readInteger(argument, arguments_[++index])
      minimumStripFrameLength = length
      maximumStripFrameLength = length
    } else if (argument === '--min-strip-length')
      minimumStripFrameLength = readInteger(argument, arguments_[++index])
    else if (argument === '--max-strip-length')
      maximumStripFrameLength = readInteger(argument, arguments_[++index])
    else if (argument === '--seed') {
      const value = arguments_[++index]
      if (!value) throw new TypeError('--seed requires a nonempty value.')
      baseSeed = value
    } else if (argument === '--output') {
      const value = arguments_[++index]
      if (!value) throw new TypeError('--output requires a path.')
      outputPath = value
    } else if (argument === '--no-output') outputPath = null
    else throw new TypeError(`Unknown benchmark option: ${argument}`)
  }

  if (runs <= 0) throw new RangeError('--runs must be greater than zero.')
  if (maximumStripCount <= 0)
    throw new RangeError('--max-strips must be greater than zero.')
  if (warmupCycles < 0)
    throw new RangeError('--warmup-cycles cannot be negative.')
  if (
    minimumStripFrameLength <= 0 ||
    maximumStripFrameLength < minimumStripFrameLength
  )
    throw new RangeError('Strip lengths must satisfy 1 <= minimum <= maximum.')

  const checkpoints = Array.from(
    new Set([
      ...[1, 10, 100, 1_000, 10_000, 100_000].filter(
        (checkpoint) => checkpoint <= maximumStripCount
      ),
      maximumStripCount,
    ])
  ).sort((left, right) => left - right)
  return {
    runs,
    maximumStripCount,
    checkpoints,
    minimumStripFrameLength,
    maximumStripFrameLength,
    warmupCycles,
    baseSeed,
    outputPath,
  }
}

const warmUp = async (config: Config): Promise<void> => {
  if (config.warmupCycles === 0) return
  const warmupConfig: Config = {
    ...config,
    runs: 1,
    maximumStripCount: config.warmupCycles,
    checkpoints: [1, config.warmupCycles],
    outputPath: null,
  }
  await runOneLifecycle(
    -1,
    deriveSeed(seedFromString(config.baseSeed), 'warmup'),
    warmupConfig,
    false
  )
  await collectGarbage()
}

export const runBenchmark = async (config: Config): Promise<Report> => {
  console.log(
    `Warming Yjs Y.Array (${config.warmupCycles.toLocaleString('en-US')} cycles)...`
  )
  await warmUp(config)
  const baseSeed = seedFromString(config.baseSeed)
  const runs: Array<RunResult> = []
  for (let run = 0; run < config.runs; run++)
    runs.push(
      await runOneLifecycle(
        run,
        deriveSeed(baseSeed, `run:${run}`),
        config,
        true
      )
    )
  return {
    schemaVersion: 1,
    benchmark: 'yjs-yarray-lifecycle',
    generatedAt: new Date().toISOString(),
    environment: {
      node: process.versions.node,
      v8: process.versions.v8,
      yjs: yjsVersion,
      platform: platform(),
      architecture: arch(),
      cpu: cpus()[0]?.model ?? 'Unknown CPU',
    },
    config,
    methodology: {
      implementation: 'Yjs Y.Doc with gc enabled and one named Y.Array<number>',
      timer: 'process.hrtime.bigint',
      operations:
        'The workload uses the Sequencer benchmark Strip model and operation order. Y.Array delete plus insert replacement is wrapped in one Y.Doc transaction.',
      merge:
        'Two Y.Docs edit the same array. Local updates synchronize to the peer outside timed regions. randomMerge times applyUpdate on a newly issued equal-length peer replacement update.',
      checkpoints:
        'toArray, encodeStateVector, encodeStateAsUpdate, destroy, and fresh document initialization from the encoded state are measured. Yjs has no public acknowledge, compact, or deleted-value recovery equivalent.',
      memory:
        'The public Yjs API exposes no attributable per-document heap size. Reports include encoded state-update bytes and shared process memory only.',
    },
    runs,
    aggregates: aggregateRuns(runs),
  }
}

const printSummary = (report: Report): void => {
  console.log('\nY.Array full-lifecycle aggregate (µs/op)')
  console.table(
    operation_names.map((operation) => {
      const metric = report.aggregates.fullLifecycle[operation]
      return {
        operation,
        calls: metric.totalSampleCount,
        'ops/sec':
          metric.sampleWeightedOperationsPerSecond === null
            ? '—'
            : Math.round(
                metric.sampleWeightedOperationsPerSecond
              ).toLocaleString('en-US'),
        'weighted avg': microseconds(metric.sampleWeightedAverageNanoseconds),
        'mean run': microseconds(metric.meanRunAverageNanoseconds),
      }
    })
  )
}

const main = async (): Promise<void> => {
  const config = parseConfig(process.argv.slice(2))
  const report = await runBenchmark(config)
  printSummary(report)
  const paths = await writeReports(report)
  if (paths) {
    console.log(`\nJSON report: ${paths.jsonPath}`)
    console.log(`Markdown report: ${paths.markdownPath}`)
  }
}

const entryPath = process.argv[1]
if (
  entryPath !== undefined &&
  import.meta.url === pathToFileURL(resolve(entryPath)).href
)
  await main()

void resultSink
