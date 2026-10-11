import { arch, cpus, platform } from 'node:os'
import { Projection } from '../../dist/class.js'
import { caseColumns } from '../.shared/report.ts'
import { measureProcessMemory, measureSpace } from '../.shared/space.ts'
import type { Gossip, Result } from '../../dist/class.js'
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
} from '../.shared/support.ts'
import {
  aggregate_names,
  operation_names,
  type BenchmarkConfig,
  type BenchmarkReport,
  type CheckpointResult,
  type Direction,
  type ManagementName,
  type MetricResult,
  type MetricScope,
  type OperationName,
  type ReplicaCheckpoint,
  type ReplicaName,
  type ReplicaRunResult,
  type RunResult,
} from '../.shared/types.ts'

type Runtime = {
  name: ReplicaName
  actorId: number
  peerActorId: number
  state: Projection<number>
  peer: Projection<number>
  strips: StripIndex
  random: Random
  nextStripId: number
  metrics: OperationAccumulator
  space: Record<MetricScope, SpaceAccumulator>
}

let resultSink: unknown

const createReplica = (actorId: number, data?: unknown): Projection<number> =>
  new Projection<number>(actorId, data)

const ratio = (bytes: number, units: number): number | null =>
  units === 0 ? null : bytes / units

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

const applyUpdate = (
  receiver: Projection<number>,
  update: Gossip<number>,
  operation: string
): Result<number> => {
  const result = receiver.apply(update)
  if (!result) throw new TypeError(`Sequencer rejected benchmark ${operation}.`)
  return result
}

const gossip = (
  sender: Projection<number>,
  receiver: Projection<number>,
  update: Gossip<number>,
  operation: string
): void => {
  const acknowledgements = applyUpdate(receiver, update, operation)[1]
  if (acknowledgements?.length)
    void applyUpdate(sender, acknowledgements, operation + ' acknowledgements')
}

const insertAt = (
  runtime: Runtime,
  config: BenchmarkConfig,
  direction: Direction,
  operationName: 'insert.tail' | 'insert.head' | 'insert.random',
  stripIndex: number
): void => {
  const frameIndex = runtime.strips.frameOffsetAt(stripIndex)
  const strip = createStrip(runtime, config)
  const mutation = timeOperation(runtime, direction, operationName, () =>
    runtime.state.insert(strip.values, frameIndex)
  )
  gossip(runtime.state, runtime.peer, mutation, operationName)
  runtime.strips.insert(stripIndex, strip)
}

const removeAt = (
  runtime: Runtime,
  config: BenchmarkConfig,
  direction: Direction,
  operationName: 'remove.head' | 'remove.tail' | 'remove.random',
  stripIndex: number
): void => {
  const frameIndex = runtime.strips.frameOffsetAt(stripIndex)
  const strip = runtime.strips.at(stripIndex)
  const mutation = timeOperation(runtime, direction, operationName, () =>
    runtime.state.remove(frameIndex, frameIndex + strip.length - 1)
  )
  gossip(runtime.state, runtime.peer, mutation, operationName)
  runtime.strips.remove(stripIndex)
}

const valueAt = (
  runtime: Runtime,
  direction: Direction,
  operationName: 'value.head' | 'value.random' | 'value.tail',
  frameIndex: number
): void => {
  const value = timeOperation(runtime, direction, operationName, () =>
    runtime.state.value(frameIndex)
  )
  if (value === undefined)
    throw new TypeError(`${operationName} did not resolve a projected Frame.`)
}

const replaceAt = (
  runtime: Runtime,
  direction: Direction,
  operationName: 'replace.head' | 'replace.random' | 'replace.tail',
  stripIndex: number
): void => {
  const frameIndex = runtime.strips.frameOffsetAt(stripIndex)
  const replaced = runtime.strips.at(stripIndex)
  // The public replace operation removes exactly values.length Frames. Keeping
  // the selected Strip's length preserves Strip boundaries and scale.
  const strip = createReplacementStrip(runtime, replaced.length)
  const mutation = timeOperation(runtime, direction, operationName, () =>
    runtime.state.replace(
      strip.values,
      frameIndex,
      frameIndex + replaced.length - 1
    )
  )
  gossip(runtime.state, runtime.peer, mutation, operationName)
  runtime.strips.replace(stripIndex, strip)
}

const randomApply = (runtime: Runtime, direction: Direction): void => {
  const stripIndex = runtime.random.integer(runtime.strips.count)
  const frameIndex = runtime.strips.frameOffsetAt(stripIndex)
  const replaced = runtime.strips.at(stripIndex)
  const strip = createReplacementStrip(runtime, replaced.length)
  const mutation = runtime.peer.replace(
    strip.values,
    frameIndex,
    frameIndex + replaced.length - 1
  )
  const result = timeOperation(runtime, direction, 'apply.random', () =>
    applyUpdate(runtime.state, mutation, 'randomApply peer replacement')
  )
  const acknowledgements = result[1]
  if (acknowledgements?.length)
    void applyUpdate(
      runtime.peer,
      acknowledgements,
      'randomApply acknowledgements'
    )
  runtime.strips.replace(stripIndex, strip)
}

const runPrimaryWorkload = (
  runtime: Runtime,
  config: BenchmarkConfig,
  direction: Direction
): void => {
  valueAt(runtime, direction, 'value.head', 0)
  valueAt(
    runtime,
    direction,
    'value.random',
    runtime.random.integer(runtime.strips.frameCount)
  )
  valueAt(runtime, direction, 'value.tail', runtime.strips.frameCount - 1)
  replaceAt(runtime, direction, 'replace.head', 0)
  replaceAt(
    runtime,
    direction,
    'replace.random',
    runtime.random.integer(runtime.strips.count)
  )
  replaceAt(runtime, direction, 'replace.tail', runtime.strips.count - 1)
  removeAt(
    runtime,
    config,
    direction,
    'remove.random',
    runtime.random.integer(runtime.strips.count)
  )
  insertAt(
    runtime,
    config,
    direction,
    'insert.random',
    runtime.random.integer(runtime.strips.count + 1)
  )
}

const runScaleUpStep = (runtime: Runtime, config: BenchmarkConfig): void => {
  const tail = runtime.strips.count % 2 === 0
  insertAt(
    runtime,
    config,
    'up',
    tail ? 'insert.tail' : 'insert.head',
    tail ? runtime.strips.count : 0
  )
  runPrimaryWorkload(runtime, config, 'up')
  randomApply(runtime, 'up')
}

const runScaleDownStep = (runtime: Runtime, config: BenchmarkConfig): void => {
  runPrimaryWorkload(runtime, config, 'down')
  const head = runtime.strips.count % 2 === 0
  removeAt(
    runtime,
    config,
    'down',
    head ? 'remove.head' : 'remove.tail',
    head ? 0 : runtime.strips.count - 1
  )
  if (runtime.strips.count > 0) randomApply(runtime, 'down')
}

const managementMetric = <T>(operation: () => T): [MetricResult, T] => {
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
  const publicFrameCount = runtime.state.projectionFrameCount
  if (publicFrameCount !== runtime.strips.frameCount)
    throw new TypeError(
      `Replica ${runtime.name} model has ${runtime.strips.frameCount} Frames but Sequencer reports ${publicFrameCount}.`
    )

  if (runtime.peer.projectionFrameCount !== publicFrameCount)
    throw new TypeError(`Replica ${runtime.name} peers did not converge.`)

  for (let index = 0; index < publicFrameCount; ++index)
    if (runtime.peer.value(index) !== runtime.state.value(index))
      throw new TypeError(
        `Replica ${runtime.name} peers diverged at projection position ${index}.`
      )

  const [valuesMetric] = managementMetric(() => runtime.state.values())
  const [sequenceResult, checkpointSequence] = managementMetric(() =>
    runtime.state.sequence()
  )
  const [createMetric] = managementMetric(() =>
    createReplica(runtime.actorId, checkpointSequence)
  )

  const stripCount = runtime.strips.count
  const frameCount = runtime.strips.frameCount
  const { memory, storage } = measureSpace(
    checkpointSequence,
    stripCount,
    frameCount
  )

  const checkpoint: ReplicaCheckpoint = {
    operations: runtime.metrics.snapshot(),
    management: {
      create: createMetric,
      sequence: sequenceResult,
      values: valuesMetric,
    },
    memory,
    storage,
    strips: {
      stripCount,
      frameCount,
      averageStripLength: ratio(frameCount, stripCount),
      minimumStripLength: runtime.strips.minimumLength,
      maximumStripLength: runtime.strips.maximumLength,
      retainedDeltaCount: checkpointSequence[1].length,
    },
  }

  const scope = direction === 'up' ? 'scaleUp' : 'scaleDown'
  for (const selectedScope of [scope, 'fullLifecycle'] as const)
    runtime.space[selectedScope].add(
      memory.bytes,
      storage.sequenceBytes,
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

  return {
    run,
    direction,
    stripCount: replicas.A.strips.stripCount,
    frameCount: replicas.A.strips.frameCount,
    processMemory: measureProcessMemory(),
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
          ...caseColumns(operation),
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
          ...caseColumns(operation),
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
  console.log('Memory usage')
  console.table(
    replicaNames.map((replica) => {
      const observed = checkpoint.replicas[replica]
      return {
        replica,
        'projected Strips': observed.strips.stripCount,
        'retained insertions': observed.strips.retainedDeltaCount,
        Frames: observed.strips.frameCount,
        'avg Strip Frames':
          observed.strips.averageStripLength?.toFixed(3) ?? '—',
        'min Strip Frames': observed.strips.minimumStripLength ?? '—',
        'max Strip Frames': observed.strips.maximumStripLength ?? '—',
        'estimated memory bytes': observed.memory.bytes,
        'memory B/Strip': observed.memory.bytesPerStrip?.toFixed(3) ?? '—',
        'memory B/Frame': observed.memory.bytesPerFrame?.toFixed(3) ?? '—',
        'process RSS bytes': checkpoint.processMemory.rssBytes,
        'process heap used bytes': checkpoint.processMemory.heapUsedBytes,
      }
    })
  )
  console.log('Disk usage (serialized Sequence)')
  console.table(
    replicaNames.map((replica) => ({
      replica,
      'sequence bytes': checkpoint.replicas[replica].storage.sequenceBytes,
      'disk B/Strip':
        checkpoint.replicas[replica].storage.bytesPerStrip?.toFixed(3) ?? '—',
      'disk B/Frame':
        checkpoint.replicas[replica].storage.bytesPerFrame?.toFixed(3) ?? '—',
    }))
  )
}

const makeRuntime = (
  name: ReplicaName,
  state: Projection<number>,
  workloadSeed: number,
  actorId: number,
  peerActorId: number
): Runtime => ({
  name,
  actorId,
  peerActorId,
  state,
  peer: createReplica(peerActorId, state.sequence()),
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
  const [initializationA, stateA] = managementMetric(() => createReplica(1))
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

/** Warms the package, Projection methods, JIT paths, arrays, and timer code. */
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
  // lifecycle here also performs checkpoint sequences, restarts,
  // serialization, and forced garbage collection, which is not warmup work.
  for (let cycle = 0; cycle < config.warmupCycles; cycle++)
    runScaleUpStep(runtime, config)
  for (let cycle = 0; cycle < config.warmupCycles; cycle++)
    runScaleDownStep(runtime, config)

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
            aggregate_names.map((operationName) => {
              const samples = runs
                .map((run) => {
                  if (operationName.includes('.'))
                    return {
                      run: run.run,
                      metric:
                        run.replicas[replicaName].operations[scope][
                          operationName as OperationName
                        ],
                    }
                  const metric = new MetricAccumulator()
                  for (const checkpoint of run.checkpoints)
                    if (
                      scope === 'fullLifecycle' ||
                      checkpoint.direction ===
                        (scope === 'scaleUp' ? 'up' : 'down')
                    )
                      metric.add(
                        checkpoint.replicas[replicaName].management[
                          operationName as ManagementName
                        ].totalNanoseconds
                      )
                  if (operationName === 'create' && scope !== 'scaleDown')
                    metric.add(run.initialization[replicaName].totalNanoseconds)
                  return { run: run.run, metric: metric.snapshot() }
                })
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

export async function runBenchmark(
  config: BenchmarkConfig
): Promise<BenchmarkReport> {
  console.log(
    'Warming TypeScript API (' +
      config.warmupCycles.toLocaleString('en-US') +
      ' cycles)...'
  )
  await warmUp(config)
  const runs = await runLifecycles(config)
  return {
    schemaVersion: 3,
    generatedAt: new Date().toISOString(),
    environment: {
      node: process.versions.node,
      v8: process.versions.v8,
      platform: platform(),
      architecture: arch(),
      cpu: cpus()[0]?.model ?? 'Unknown CPU',
    },
    config,
    methodology: {
      implementation: 'TypeScript Projection class public API',
      timer: 'process.hrtime.bigint',
      stripCount:
        'Scale is the number of visible logical Strips maintained by the benchmark model. Every mutation targets a complete Strip boundary; retained Mask structures are reported separately.',
      ingest:
        'The workload has two peers editing the same document. Every local Gossip is applied by the receiver and every acknowledgement returned by apply is gossiped back to the sender. apply.random times only the measured peer applying the remote replacement Gossip.',
      average:
        'Operation averages are calculated directly from count and total measured nanoseconds; checkpoint averages are never averaged together.',
      memory:
        'Per-Replica retained bytes after restart are estimated as four bytes per Sequence metadata word plus eight bytes per JavaScript Footage array slot. Process RSS is shared and reported at checkpoint scope.',
      storage:
        'Persistent representation size is the byte length of node:v8.serialize over the automatically collected public Sequence.',
    },
    runs,
    aggregates: aggregateRuns(runs),
    spaceAggregates: {
      A: Object.fromEntries(
        (['scaleUp', 'scaleDown', 'fullLifecycle'] as const).map((scope) => {
          const space = new SpaceAccumulator()
          for (const run of runs)
            for (const checkpoint of run.checkpoints)
              if (
                scope === 'fullLifecycle' ||
                checkpoint.direction === (scope === 'scaleUp' ? 'up' : 'down')
              ) {
                const observed = checkpoint.replicas.A
                space.add(
                  observed.memory.bytes,
                  observed.storage.sequenceBytes,
                  observed.strips.stripCount,
                  observed.strips.frameCount
                )
              }
          return [scope, space.snapshot()]
        })
      ) as BenchmarkReport['spaceAggregates']['A'],
    },
  }
}

void resultSink
