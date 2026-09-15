import { serialize } from 'node:v8'
import * as api from '../../dist/index.js'
import type { Mutation, Replica } from '../../dist/index.js'
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
  actorId: number
  peerActorId: number
  state: Replica<number>
  peer: Replica<number>
  strips: StripIndex
  random: Random
  nextStripId: number
  metrics: OperationAccumulator
  space: Record<MetricScope, SpaceAccumulator>
}

let resultSink: unknown

const createReplica = (actorId: number, data?: unknown): Replica<number> =>
  api.create<number>(actorId, data)

const ratio = (bytes: number, units: number): number | null =>
  units === 0 ? null : bytes / units

const requireMutations = (
  result: Mutation<number> | Array<Mutation<number>> | false,
  operation: string
): Array<Mutation<number>> => {
  if (result === false)
    throw new TypeError(`Sequencer rejected benchmark ${operation}.`)
  return Array.isArray(result[1]) && typeof result[1][0] === 'number'
    ? [result as Mutation<number>]
    : (result as Array<Mutation<number>>)
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

const ingestIntoPeer = (
  runtime: Runtime,
  mutations: Array<Mutation<number>>,
  operation: string
): void => {
  for (const mutation of mutations)
    if (api.ingest(runtime.peer, mutation) === false)
      throw new TypeError(
        `Replica ${runtime.name} peer rejected new ${operation} Mutation.`
      )
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
  const mutation = timeOperation(runtime, direction, operationName, () =>
    api.insert(runtime.state, frameIndex, strip.values)
  )
  const accepted = requireMutations(mutation, operationName)
  ingestIntoPeer(runtime, accepted, operationName)
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
  const mutation = timeOperation(runtime, direction, operationName, () =>
    api.remove(runtime.state, frameIndex, frameIndex + strip.length)
  )
  const accepted = requireMutations(mutation, operationName)
  ingestIntoPeer(runtime, accepted, operationName)
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
  const mutation = timeOperation(runtime, direction, 'randomReplace', () =>
    api.replace(runtime.state, frameIndex, strip.values)
  )
  const accepted = requireMutations(mutation, 'randomReplace')
  ingestIntoPeer(runtime, accepted, 'randomReplace')
  runtime.strips.replace(stripIndex, strip)
}

const randomIngest = (runtime: Runtime, direction: Direction): void => {
  const stripIndex = runtime.random.integer(runtime.strips.count)
  const frameIndex = runtime.strips.frameOffsetAt(stripIndex)
  const replaced = runtime.strips.at(stripIndex)
  const strip = createReplacementStrip(runtime, replaced.length)
  const mutations = requireMutations(
    api.replace(runtime.peer, frameIndex, strip.values),
    'randomIngest peer replacement'
  )
  if (!mutations.some((mutation) => mutation[1][8]?.length))
    throw new TypeError('Random ingest received no Footage Mutation.')
  for (const mutation of mutations) {
    const change = timeOperation(runtime, direction, 'randomIngest', () =>
      api.ingest(runtime.state, mutation)
    )
    if (change === false)
      throw new TypeError(
        'Random ingest did not integrate a new peer Mutation.'
      )
  }
  runtime.strips.replace(stripIndex, strip)
}

const runPrimaryRandomWorkload = (
  runtime: Runtime,
  config: BenchmarkConfig,
  direction: Direction
): void => {
  randomFind(runtime, direction)
  randomReplace(runtime, config, direction)
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

const runScaleUpStep = (runtime: Runtime, config: BenchmarkConfig): void => {
  const tail = runtime.strips.count % 2 === 0
  insertAt(
    runtime,
    config,
    'up',
    tail ? 'tailInsert' : 'headInsert',
    tail ? runtime.strips.count : 0
  )
  runPrimaryRandomWorkload(runtime, config, 'up')
  randomIngest(runtime, 'up')
}

const runScaleDownStep = (runtime: Runtime, config: BenchmarkConfig): void => {
  runPrimaryRandomWorkload(runtime, config, 'down')
  const head = runtime.strips.count % 2 === 0
  removeAt(
    runtime,
    config,
    'down',
    head ? 'headRemove' : 'tailRemove',
    head ? 0 : runtime.strips.count - 1
  )
  if (runtime.strips.count > 0) randomIngest(runtime, 'down')
}

const snapshotMetric = <T>(operation: () => T): [MetricResult, T] => {
  const accumulator = new MetricAccumulator()
  const timed = measure(operation)
  accumulator.add(timed.nanoseconds)
  resultSink = timed.result
  return [accumulator.snapshot(), timed.result]
}

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
  const [snapshotResult, checkpointSnapshot] = snapshotMetric(() =>
    api.snapshot(runtime.state)
  )
  const snapshotBytes = serialize(checkpointSnapshot).byteLength

  const oldState = runtime.state
  const [destroyMetric] = snapshotMetric(() => api.destroy(oldState))
  void api.destroy(runtime.peer)
  const [createMetric, initializedState] = snapshotMetric(() =>
    createReplica(runtime.actorId, checkpointSnapshot)
  )
  const initializedPeer = createReplica(runtime.peerActorId, checkpointSnapshot)
  runtime.state = initializedState
  runtime.peer = initializedPeer

  const stripCount = runtime.strips.count
  const frameCount = runtime.strips.frameCount
  const nativeSnapshotWordBytes =
    (checkpointSnapshot[0].reduce(
      (words, acknowledgement) => words + acknowledgement.length,
      0
    ) +
      checkpointSnapshot[1].length * 8) *
    4
  const javascriptFootageSlotBytes =
    checkpointSnapshot[1].reduce(
      (slots, delta) => slots + (delta[8]?.length ?? 0),
      0
    ) * 8
  const estimatedMemoryBytes =
    nativeSnapshotWordBytes + javascriptFootageSlotBytes

  const checkpoint: ReplicaCheckpoint = {
    operations: runtime.metrics.snapshot(),
    management: {
      values: valuesMetric,
      snapshot: snapshotResult,
      destroy: destroyMetric,
      create: createMetric,
    },
    memory: {
      bytes: estimatedMemoryBytes,
      bytesPerStrip: ratio(estimatedMemoryBytes, stripCount),
      bytesPerFrame: ratio(estimatedMemoryBytes, frameCount),
      measurement: 'estimated-native-words-plus-js-footage-slots',
      nativeSnapshotWordBytes,
      javascriptFootageSlotBytes,
      wasmLinearMemoryBytes: null,
      wasmLinearMemoryReason:
        'The public package API does not expose its shared WebAssembly.Memory.',
    },
    storage: {
      serialization: 'node:v8.serialize',
      snapshotBytes,
      bytesPerStrip: ratio(snapshotBytes, stripCount),
      bytesPerFrame: ratio(snapshotBytes, frameCount),
    },
    strips: {
      stripCount,
      frameCount,
      averageStripLength: ratio(frameCount, stripCount),
      minimumStripLength: runtime.strips.minimumLength,
      maximumStripLength: runtime.strips.maximumLength,
      retainedDeltaCount: checkpointSnapshot[1].length,
    },
  }

  const scope = direction === 'up' ? 'scaleUp' : 'scaleDown'
  for (const selectedScope of [scope, 'fullLifecycle'] as const)
    runtime.space[selectedScope].add(
      estimatedMemoryBytes,
      snapshotBytes,
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
  runtime: Runtime
): Promise<CheckpointResult> => {
  await collectGarbage()
  const replicas = {
    A: observeReplica(runtime, direction),
  }
  await collectGarbage()
  const processMemory = process.memoryUsage()

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
  const replicaNames: Array<ReplicaName> = ['A']
  console.log(
    `\nRun ${checkpoint.run + 1} | ${checkpoint.direction} | ${checkpoint.stripCount.toLocaleString('en-US')} Strips | ${checkpoint.frameCount.toLocaleString('en-US')} Frames`
  )
  console.table(
    replicaNames.flatMap((replica) =>
      operation_names.map((operation) => {
        const metric = checkpoint.replicas[replica].operations[operation]
        return {
          replica,
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
  )
  console.table(
    replicaNames.flatMap((replica) =>
      Object.entries(checkpoint.replicas[replica].management).map(
        ([operation, metric]) => ({
          replica,
          operation,
          calls: metric.count,
          'ops/sec':
            metric.operationsPerSecond === null
              ? '—'
              : Math.round(metric.operationsPerSecond).toLocaleString('en-US'),
          'avg µs': checkpointMicroseconds(metric.averageNanoseconds),
        })
      )
    )
  )
  console.table(
    replicaNames.map((replica) => {
      const observed = checkpoint.replicas[replica]
      return {
        replica,
        'visible Strips': observed.strips.stripCount,
        'retained Deltas': observed.strips.retainedDeltaCount,
        Frames: observed.strips.frameCount,
        'avg Strip Frames':
          observed.strips.averageStripLength?.toFixed(3) ?? '—',
        'min Strip Frames': observed.strips.minimumStripLength ?? '—',
        'max Strip Frames': observed.strips.maximumStripLength ?? '—',
        'estimated memory bytes': observed.memory.bytes,
        'memory B/Strip': observed.memory.bytesPerStrip?.toFixed(3) ?? '—',
        'memory B/Frame': observed.memory.bytesPerFrame?.toFixed(3) ?? '—',
        'snapshot bytes': observed.storage.snapshotBytes,
        'process RSS bytes': checkpoint.processMemory.rssBytes,
      }
    })
  )
}

const makeRuntime = (
  name: ReplicaName,
  state: Replica<number>,
  workloadSeed: number,
  actorId: number,
  peerActorId: number
): Runtime => ({
  name,
  actorId,
  peerActorId,
  state,
  peer: createReplica(peerActorId, api.snapshot(state)),
  strips: new StripIndex(),
  random: new Random(workloadSeed),
  nextStripId: 1,
  metrics: new OperationAccumulator(),
  space: {
    scaleUp: new SpaceAccumulator(),
    scaleDown: new SpaceAccumulator(),
    fullLifecycle: new SpaceAccumulator(),
  },
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
  const [initializationA, stateA] = snapshotMetric(() => createReplica(1))
  const workloadSeed = deriveSeed(runSeed, 'shared-replica-workload')
  const runtime = makeRuntime('A', stateA, workloadSeed, 1, 2)
  const checkpoints: Array<CheckpointResult> = []
  const checkpointSet = new Set(config.checkpoints)

  const record = async (direction: Direction): Promise<void> => {
    const checkpoint = await takeCheckpoint(run, direction, runtime)
    checkpoints.push(checkpoint)
    if (reportProgress) printCheckpoint(checkpoint)
  }

  while (runtime.strips.count < config.maximumStripCount) {
    runScaleUpStep(runtime, config)
    if (checkpointSet.has(runtime.strips.count)) await record('up')
  }

  while (runtime.strips.count > 0) {
    runScaleDownStep(runtime, config)
    if (checkpointSet.has(runtime.strips.count)) await record('down')
  }

  void api.destroy(runtime.state)
  void api.destroy(runtime.peer)
  resultSink = undefined
  return {
    run,
    seed: formatSeed(runSeed),
    initialization: {
      A: initializationA,
    },
    checkpoints,
    replicas: {
      A: finishRuntime(runtime),
    },
  }
}

/** Warms the package, JS/WASM boundary, JIT paths, buffers, and timer code. */
export async function warmUp(config: BenchmarkConfig): Promise<void> {
  if (config.warmupCycles === 0) return
  const state = createReplica(3)
  const runtime = makeRuntime(
    'A',
    state,
    deriveSeed(seedFromString(config.baseSeed), 'warmup'),
    3,
    4
  )

  // Warm only the continuously measured operation paths. Running a hidden
  // lifecycle here also performs checkpoint snapshots, restarts,
  // serialization, and forced garbage collection, which is not warmup work.
  for (let cycle = 0; cycle < config.warmupCycles; cycle++)
    runScaleUpStep(runtime, config)
  for (let cycle = 0; cycle < config.warmupCycles; cycle++)
    runScaleDownStep(runtime, config)

  void api.destroy(runtime.state)
  void api.destroy(runtime.peer)
  resultSink = undefined
}

/** Runs one measured Replica and its continuously synchronized peer. */
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
  const scopes: Array<MetricScope> = ['scaleUp', 'scaleDown', 'fullLifecycle']
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
                      : (1_000_000_000 * totalSampleCount) / totalNanoseconds,
                  meanRunAverageNanoseconds: mean,
                  medianRunAverageNanoseconds: median,
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
