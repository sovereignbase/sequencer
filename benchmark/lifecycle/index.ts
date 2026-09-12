import { serialize } from 'node:v8'
import * as api from '../../dist/index.js'
import type { Delta, Replica } from '../../dist/index.js'
import {
  deriveSeed,
  formatSeed,
  measure,
  MetricAccumulator,
  OperationAccumulator,
  Random,
  seedFromString,
  SpaceAccumulator,
  StripIndex,
} from '../support.ts'
import {
  operation_names,
  type BenchmarkConfig,
  type BenchmarkReport,
  type CheckpointResult,
  type Direction,
  type ManagementResult,
  type MetricResult,
  type MetricScope,
  type OperationName,
  type ReplicaCheckpoint,
  type ReplicaName,
  type ReplicaRunResult,
  type RunResult,
} from '../types.ts'

type Runtime = {
  name: ReplicaName
  state: Replica<number>
  strips: StripIndex
  random: Random
  nextStripId: number
  metrics: OperationAccumulator
  space: Record<MetricScope, SpaceAccumulator>
  mergePool: Array<Delta<number>>
  mergePoolCursor: number
}

let resultSink: unknown

const unavailableDestroy: ManagementResult = {
  available: false,
  reason:
    'The public TypeScript API releases Replicas through FinalizationRegistry and exposes no synchronous destroy operation.',
}

const ratio = (bytes: number, units: number): number | null =>
  units === 0 ? null : bytes / units

const requireDelta = (
  result: Delta<number> | false,
  operation: string
): Delta<number> => {
  if (result === false)
    throw new TypeError(`Sequencer rejected benchmark ${operation}.`)
  return result
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

const createStrip = (
  runtime: Runtime,
  config: BenchmarkConfig
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

const rememberMergeCandidate = (
  runtime: Runtime,
  delta: Delta<number>,
  maximumPoolSize: number
): void => {
  const maskWords: Array<number> = []
  for (let start = 0; start < delta[0].length; start += 12)
    if (delta[0][start] === 2)
      for (let word = start; word < start + 12; word++)
        maskWords.push(delta[0][word])

  if (maskWords.length === 0) return
  const candidate: Delta<number> = [maskWords]
  if (runtime.mergePool.length < maximumPoolSize)
    runtime.mergePool.push(candidate)
  else {
    runtime.mergePool[runtime.mergePoolCursor] = candidate
    runtime.mergePoolCursor =
      (runtime.mergePoolCursor + 1) % maximumPoolSize
  }
}

const insertAt = (
  runtime: Runtime,
  config: BenchmarkConfig,
  direction: Direction,
  operationName: 'tailInsert' | 'headInsert' | 'randomInsert',
  stripIndex: number
): void => {
  const frameIndex = runtime.strips.frameOffsetAt(stripIndex)
  const strip = createStrip(runtime, config)
  const delta = timeOperation(runtime, direction, operationName, () =>
    api.insert(runtime.state, frameIndex, strip.values)
  )
  requireDelta(delta, operationName)
  runtime.strips.insert(stripIndex, strip)
}

const removeAt = (
  runtime: Runtime,
  config: BenchmarkConfig,
  direction: Direction,
  operationName: 'headRemove' | 'tailRemove' | 'randomRemove',
  stripIndex: number
): void => {
  const frameIndex = runtime.strips.frameOffsetAt(stripIndex)
  const strip = runtime.strips.at(stripIndex)
  const delta = timeOperation(runtime, direction, operationName, () =>
    api.remove(runtime.state, frameIndex, frameIndex + strip.length, true)
  )
  const accepted = requireDelta(delta, operationName)
  rememberMergeCandidate(runtime, accepted, config.mergePoolSize)
  runtime.strips.remove(stripIndex)
}

const randomFind = (runtime: Runtime, direction: Direction): void => {
  const frameIndex = runtime.random.integer(runtime.strips.frameCount)
  const value = timeOperation(runtime, direction, 'randomFind', () =>
    api.find(runtime.state, frameIndex)
  )
  if (value === undefined)
    throw new TypeError('Random find did not resolve a visible Frame.')
}

const randomReplace = (
  runtime: Runtime,
  config: BenchmarkConfig,
  direction: Direction
): void => {
  const stripIndex = runtime.random.integer(runtime.strips.count)
  const frameIndex = runtime.strips.frameOffsetAt(stripIndex)
  const replaced = runtime.strips.at(stripIndex)
  // The public replace operation removes exactly values.length Frames. Keeping
  // the selected Strip's length preserves Strip boundaries and scale.
  const strip = createReplacementStrip(runtime, replaced.length)
  const delta = timeOperation(runtime, direction, 'randomReplace', () =>
    api.replace(runtime.state, frameIndex, strip.values, true)
  )
  const accepted = requireDelta(delta, 'randomReplace')
  rememberMergeCandidate(runtime, accepted, config.mergePoolSize)
  runtime.strips.replace(stripIndex, strip)
}

const randomMerge = (runtime: Runtime, direction: Direction): void => {
  if (runtime.mergePool.length === 0)
    throw new TypeError('Random merge has no prepared Mask Delta.')
  const delta =
    runtime.mergePool[runtime.random.integer(runtime.mergePool.length)]
  resultSink = timeOperation(runtime, direction, 'randomMerge', () =>
    api.merge(runtime.state, delta)
  )
}

const runRandomWorkload = (
  runtime: Runtime,
  config: BenchmarkConfig,
  direction: Direction
): void => {
  randomFind(runtime, direction)
  randomReplace(runtime, config, direction)
  randomMerge(runtime, direction)
  removeAt(
    runtime,
    config,
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

const runScaleUpStep = (
  runtime: Runtime,
  config: BenchmarkConfig
): void => {
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

const runScaleDownStep = (
  runtime: Runtime,
  config: BenchmarkConfig
): void => {
  runRandomWorkload(runtime, config, 'down')
  const head = runtime.strips.count % 2 === 0
  removeAt(
    runtime,
    config,
    'down',
    head ? 'headRemove' : 'tailRemove',
    head ? 0 : runtime.strips.count - 1
  )
}

const snapshotMetric = <T>(operation: () => T): [MetricResult, T] => {
  const accumulator = new MetricAccumulator()
  const timed = measure(operation)
  accumulator.add(timed.nanoseconds)
  resultSink = timed.result
  return [accumulator.snapshot(), timed.result]
}

const cloneDelta = <T>(delta: Delta<T>): Delta<T> => [
  delta[0].slice(),
  delta[1]?.slice(),
]

const observeReplica = (
  runtime: Runtime,
  direction: Direction
): ReplicaCheckpoint => {
  const publicFrameCount = api.length(runtime.state)
  if (publicFrameCount !== runtime.strips.frameCount)
    throw new TypeError(
      `Replica ${runtime.name} model has ${runtime.strips.frameCount} Frames but Sequencer reports ${publicFrameCount}.`
    )

  const [valuesMetric] = snapshotMetric(() => api.values(runtime.state))
  const [acknowledgeMetric] = snapshotMetric(() =>
    api.acknowledge(runtime.state)
  )
  const [snapshotResult, beforeCompact] = snapshotMetric(() =>
    api.snapshot(runtime.state)
  )
  const beforeCompactBytes = serialize(beforeCompact).byteLength

  const initializeInput = cloneDelta(beforeCompact)
  const [initializeMetric, initializedState] = snapshotMetric(() =>
    api.create<number>(initializeInput)
  )
  resultSink = initializedState

  const compactState = api.create<number>(cloneDelta(beforeCompact))
  const frontier = api.acknowledge(compactState)
  const [compactMetric] = snapshotMetric(() =>
    api.compact(frontier === false ? [] : [frontier], compactState, true)
  )
  const afterCompact = api.snapshot(compactState)

  const afterCompactBytes = serialize(afterCompact).byteLength
  const stripCount = runtime.strips.count
  const frameCount = runtime.strips.frameCount
  const nativeProjectionWordBytes = beforeCompact[0].length * 4
  const javascriptFootageSlotBytes = runtime.state[1].length * 8
  const estimatedMemoryBytes =
    nativeProjectionWordBytes + javascriptFootageSlotBytes

  const checkpoint: ReplicaCheckpoint = {
    operations: runtime.metrics.snapshot(),
    management: {
      values: valuesMetric,
      acknowledge: acknowledgeMetric,
      snapshot: snapshotResult,
      destroy: unavailableDestroy,
      initialize: initializeMetric,
      compact: compactMetric,
    },
    memory: {
      bytes: estimatedMemoryBytes,
      bytesPerStrip: ratio(estimatedMemoryBytes, stripCount),
      bytesPerFrame: ratio(estimatedMemoryBytes, frameCount),
      measurement: 'estimated-native-words-plus-js-footage-slots',
      nativeProjectionWordBytes,
      javascriptFootageSlotBytes,
      wasmLinearMemoryBytes: null,
      wasmLinearMemoryReason:
        'The public package API does not expose its shared WebAssembly.Memory.',
    },
    storage: {
      serialization: 'node:v8.serialize',
      beforeCompactBytes,
      afterCompactBytes,
      beforeCompactBytesPerStrip: ratio(beforeCompactBytes, stripCount),
      afterCompactBytesPerStrip: ratio(afterCompactBytes, stripCount),
      beforeCompactBytesPerFrame: ratio(beforeCompactBytes, frameCount),
      afterCompactBytesPerFrame: ratio(afterCompactBytes, frameCount),
    },
    strips: {
      stripCount,
      frameCount,
      averageStripLength: ratio(frameCount, stripCount),
      minimumStripLength: runtime.strips.minimumLength,
      maximumStripLength: runtime.strips.maximumLength,
      retainedStructuralStripCount: beforeCompact[0].length / 12,
    },
  }

  const scope = direction === 'up' ? 'scaleUp' : 'scaleDown'
  for (const selectedScope of [scope, 'fullLifecycle'] as const)
    runtime.space[selectedScope].add(
      estimatedMemoryBytes,
      beforeCompactBytes,
      afterCompactBytes,
      stripCount,
      frameCount
    )

  return checkpoint
}

const collectGarbage = async (): Promise<void> => {
  const collect = (globalThis as typeof globalThis & { gc?: () => void }).gc
  collect?.()
  await new Promise<void>((resolve) => setImmediate(resolve))
  collect?.()
}

const takeCheckpoint = async (
  run: number,
  direction: Direction,
  runtimes: Record<ReplicaName, Runtime>
): Promise<CheckpointResult> => {
  await collectGarbage()
  const processMemory = process.memoryUsage()
  const replicas = {
    A: observeReplica(runtimes.A, direction),
  }

  return {
    run,
    direction,
    stripCount: replicas.A.strips.stripCount,
    frameCount: replicas.A.strips.frameCount,
    processMemory: {
      scope: 'shared-process-not-attributable-to-one-replica',
      rssBytes: processMemory.rss,
      heapTotalBytes: processMemory.heapTotal,
      heapUsedBytes: processMemory.heapUsed,
      externalBytes: processMemory.external,
      arrayBufferBytes: processMemory.arrayBuffers,
    },
    replicas,
  }
}

const checkpointMicroseconds = (nanoseconds: number | null): string =>
  nanoseconds === null ? '—' : (nanoseconds / 1_000).toFixed(3)

const printCheckpoint = (checkpoint: CheckpointResult): void => {
  const observed = checkpoint.replicas.A
  console.log(
    `\nRun ${checkpoint.run + 1} | ${checkpoint.direction} | ${checkpoint.stripCount.toLocaleString('en-US')} Strips | ${checkpoint.frameCount.toLocaleString('en-US')} Frames`
  )
  console.table(
    operation_names.map((operation) => {
      const metric = observed.operations[operation]
      return {
        operation,
        calls: metric.count,
        'ops/sec':
          metric.operationsPerSecond === null
            ? '—'
            : Math.round(metric.operationsPerSecond).toLocaleString('en-US'),
        'avg µs': checkpointMicroseconds(metric.averageNanoseconds),
        'min µs': checkpointMicroseconds(metric.minimumNanoseconds),
        'max µs': checkpointMicroseconds(metric.maximumNanoseconds),
      }
    })
  )
  console.table(
    Object.entries(observed.management).map(([operation, metric]) => ({
      operation,
      calls: 'available' in metric ? '—' : metric.count,
      'ops/sec':
        'available' in metric || metric.operationsPerSecond === null
          ? '—'
          : Math.round(metric.operationsPerSecond).toLocaleString('en-US'),
      'avg µs':
        'available' in metric
          ? 'unavailable'
          : checkpointMicroseconds(metric.averageNanoseconds),
    }))
  )
  console.table([
    {
      'visible Strips': observed.strips.stripCount,
      'retained Strips': observed.strips.retainedStructuralStripCount,
      Frames: observed.strips.frameCount,
      'avg Strip Frames': observed.strips.averageStripLength?.toFixed(3) ?? '—',
      'min Strip Frames': observed.strips.minimumStripLength ?? '—',
      'max Strip Frames': observed.strips.maximumStripLength ?? '—',
      'estimated memory bytes': observed.memory.bytes,
      'memory B/Strip': observed.memory.bytesPerStrip?.toFixed(3) ?? '—',
      'memory B/Frame': observed.memory.bytesPerFrame?.toFixed(3) ?? '—',
      'snapshot before bytes': observed.storage.beforeCompactBytes,
      'snapshot after bytes': observed.storage.afterCompactBytes,
      'process RSS bytes': checkpoint.processMemory.rssBytes,
    },
  ])
}

const makeRuntime = (
  name: ReplicaName,
  state: Replica<number>,
  workloadSeed: number
): Runtime => ({
  name,
  state,
  strips: new StripIndex(),
  random: new Random(workloadSeed),
  nextStripId: 1,
  metrics: new OperationAccumulator(),
  space: {
    scaleUp: new SpaceAccumulator(),
    scaleDown: new SpaceAccumulator(),
    fullLifecycle: new SpaceAccumulator(),
  },
  mergePool: [],
  mergePoolCursor: 0,
})

const finishRuntime = (runtime: Runtime): ReplicaRunResult => ({
  operations: {
    scaleUp: runtime.metrics.snapshot('scaleUp'),
    scaleDown: runtime.metrics.snapshot('scaleDown'),
    fullLifecycle: runtime.metrics.snapshot('fullLifecycle'),
  },
  spaceAverages: {
    scaleUp: runtime.space.scaleUp.snapshot(),
    scaleDown: runtime.space.scaleDown.snapshot(),
    fullLifecycle: runtime.space.fullLifecycle.snapshot(),
  },
})

async function runOneLifecycle(
  run: number,
  runSeed: number,
  config: BenchmarkConfig,
  reportProgress: boolean
): Promise<RunResult> {
  const [initializationA, stateA] = snapshotMetric(() => api.create<number>())
  const workloadSeed = deriveSeed(runSeed, 'replica-A-workload')
  const runtimes = {
    A: makeRuntime('A', stateA, workloadSeed),
  }
  const checkpoints: Array<CheckpointResult> = []
  const checkpointSet = new Set(config.checkpoints)

  const record = async (direction: Direction): Promise<void> => {
    const checkpoint = await takeCheckpoint(run, direction, runtimes)
    checkpoints.push(checkpoint)
    if (reportProgress) printCheckpoint(checkpoint)
  }

  await record('up')
  while (runtimes.A.strips.count < config.maximumStripCount) {
    runScaleUpStep(runtimes.A, config)
    if (checkpointSet.has(runtimes.A.strips.count)) await record('up')
  }

  while (runtimes.A.strips.count > 0) {
    runScaleDownStep(runtimes.A, config)
    if (checkpointSet.has(runtimes.A.strips.count)) await record('down')
  }

  resultSink = undefined
  return {
    run,
    seed: formatSeed(runSeed),
    initialization: { A: initializationA },
    checkpoints,
    replicas: {
      A: finishRuntime(runtimes.A),
    },
  }
}

/** Warms the package, JS/WASM boundary, JIT paths, buffers, and timer code. */
export async function warmUp(config: BenchmarkConfig): Promise<void> {
  if (config.warmupCycles === 0) return
  const maximumStripCount = config.warmupCycles
  const warmupConfig: BenchmarkConfig = {
    ...config,
    runs: 1,
    maximumStripCount,
    checkpoints: [0, maximumStripCount],
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

/** Runs one continuously evolving TypeScript API Replica. */
export async function runLifecycles(
  config: BenchmarkConfig
): Promise<Array<RunResult>> {
  const results: Array<RunResult> = []
  const baseSeed = seedFromString(config.baseSeed)
  for (let run = 0; run < config.runs; run++)
    results.push(
      await runOneLifecycle(
        run,
        deriveSeed(baseSeed, `run:${run}`),
        config,
        true
      )
    )
  return results
}

export function aggregateRuns(
  runs: Array<RunResult>
): BenchmarkReport['aggregates'] {
  const replicaNames: Array<ReplicaName> = ['A']
  const scopes: Array<MetricScope> = [
    'scaleUp',
    'scaleDown',
    'fullLifecycle',
  ]
  return Object.fromEntries(
    replicaNames.map((replicaName) => [
      replicaName,
      Object.fromEntries(
        scopes.map((scope) => [
          scope,
          Object.fromEntries(
            operation_names.map((operationName) => {
              const samples = runs
                .map((run) => ({
                  run: run.run,
                  metric:
                    run.replicas[replicaName].operations[scope][operationName],
                }))
                .filter(
                  (sample) => sample.metric.averageNanoseconds !== null
                )
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
              const median =
                count === 0
                  ? null
                  : count % 2 === 1
                    ? ordered[(count - 1) / 2].averageNanoseconds
                    : (ordered[count / 2 - 1].averageNanoseconds +
                        ordered[count / 2].averageNanoseconds) /
                      2
              const totalSampleCount = samples.reduce(
                (sum, sample) => sum + sample.metric.count,
                0
              )
              const totalNanoseconds = samples.reduce(
                (sum, sample) => sum + sample.metric.totalNanoseconds,
                0
              )
              return [
                operationName,
                {
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
                      : (1_000_000_000 * totalSampleCount) /
                        totalNanoseconds,
                  meanRunAverageNanoseconds: mean,
                  medianRunAverageNanoseconds: median,
                  standardDeviationNanoseconds:
                    mean === null
                      ? null
                      : Math.sqrt(
                          ordered.reduce(
                            (sum, sample) =>
                              sum +
                              (sample.averageNanoseconds - mean) ** 2,
                            0
                          ) / count
                        ),
                  minimumRun: ordered[0] ?? null,
                  maximumRun: ordered[count - 1] ?? null,
                },
              ]
            })
          ),
        ])
      ),
    ])
  ) as BenchmarkReport['aggregates']
}

void resultSink
