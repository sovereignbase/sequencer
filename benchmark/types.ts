export const operation_names = [
  'tailInsert',
  'headInsert',
  'headRemove',
  'tailRemove',
  'randomFind',
  'randomRemove',
  'randomReplace',
  'randomMerge',
  'randomInsert',
] as const

export const management_names = [
  'values',
  'recover',
  'acknowledge',
  'compact',
  'snapshot',
  'destroy',
  'initialize',
] as const

export type Direction = 'up' | 'down'
export type ReplicaName = 'A' | 'B' | 'C'
export type RemovalPolicy = 'soft' | 'hard'
export type CompactionPolicy = 'soft' | 'hard'
export type ReplicaPolicy = {
  remove: RemovalPolicy
  compact: CompactionPolicy
}
export type OperationName = (typeof operation_names)[number]
export type ManagementName = (typeof management_names)[number]
export type MetricScope = 'scaleUp' | 'scaleDown' | 'fullLifecycle'

export type BenchmarkConfig = {
  runs: number
  maximumStripCount: number
  checkpoints: Array<number>
  minimumStripFrameLength: number
  maximumStripFrameLength: number
  warmupCycles: number
  replicaPolicies: Record<ReplicaName, ReplicaPolicy>
  baseSeed: string
  outputPath: string | null
}

export type MetricResult = {
  count: number
  totalNanoseconds: number
  averageNanoseconds: number | null
  operationsPerSecond: number | null
  minimumNanoseconds: number | null
  maximumNanoseconds: number | null
}

export type OperationMetrics = Record<OperationName, MetricResult>

export type ManagementResult = MetricResult

export type StripStatistics = {
  stripCount: number
  frameCount: number
  averageStripLength: number | null
  minimumStripLength: number | null
  maximumStripLength: number | null
  retainedStructuralStripCount: number
}

export type MemoryResult = {
  bytes: number
  bytesPerStrip: number | null
  bytesPerFrame: number | null
  measurement: 'estimated-native-words-plus-js-footage-slots'
  nativeProjectionWordBytes: number
  javascriptFootageSlotBytes: number
  wasmLinearMemoryBytes: null
  wasmLinearMemoryReason: string
}

export type StorageResult = {
  serialization: 'node:v8.serialize'
  beforeCompactBytes: number
  afterCompactBytes: number
  beforeCompactBytesPerStrip: number | null
  afterCompactBytesPerStrip: number | null
  beforeCompactBytesPerFrame: number | null
  afterCompactBytesPerFrame: number | null
}

export type ReplicaCheckpoint = {
  policy: ReplicaPolicy
  operations: OperationMetrics
  management: Record<ManagementName, ManagementResult>
  memory: MemoryResult
  storage: StorageResult
  strips: StripStatistics
}

export type ProcessMemoryResult = {
  scope: 'shared-process-not-attributable-to-one-replica'
  rssBytes: number
  heapTotalBytes: number
  heapUsedBytes: number
  externalBytes: number
  arrayBufferBytes: number
}

export type CheckpointResult = {
  run: number
  direction: Direction
  stripCount: number
  frameCount: number
  processMemory: ProcessMemoryResult
  replicas: Record<ReplicaName, ReplicaCheckpoint>
}

export type RatioAverage = {
  observationCount: number
  totalBytes: number
  totalUnits: number
  averageBytesPerUnit: number | null
}

export type SpaceAverages = {
  memoryBytesPerFrame: RatioAverage
  memoryBytesPerStrip: RatioAverage
  storageBytesPerFrameBeforeCompact: RatioAverage
  storageBytesPerFrameAfterCompact: RatioAverage
  storageBytesPerStripBeforeCompact: RatioAverage
  storageBytesPerStripAfterCompact: RatioAverage
}

export type ReplicaRunResult = {
  operations: Record<MetricScope, OperationMetrics>
  spaceAverages: Record<MetricScope, SpaceAverages>
}

export type InitializationResult = Record<ReplicaName, MetricResult>

export type RunResult = {
  run: number
  seed: string
  initialization: InitializationResult
  checkpoints: Array<CheckpointResult>
  replicas: Record<ReplicaName, ReplicaRunResult>
}

export type AggregateMetric = {
  runCount: number
  totalSampleCount: number
  totalNanoseconds: number
  sampleWeightedAverageNanoseconds: number | null
  sampleWeightedOperationsPerSecond: number | null
  meanRunAverageNanoseconds: number | null
  medianRunAverageNanoseconds: number | null
  standardDeviationNanoseconds: number | null
  minimumRun: { run: number; averageNanoseconds: number } | null
  maximumRun: { run: number; averageNanoseconds: number } | null
}

export type BenchmarkReport = {
  schemaVersion: 1
  generatedAt: string
  environment: {
    node: string
    v8: string
    platform: NodeJS.Platform
    architecture: string
    cpu: string
  }
  config: BenchmarkConfig
  methodology: {
    implementation: 'TypeScript public API backed by the package WebAssembly runtime'
    timer: 'process.hrtime.bigint'
    stripCount: string
    merge: string
    average: string
    memory: string
    storage: string
  }
  runs: Array<RunResult>
  aggregates: Record<
    ReplicaName,
    Record<MetricScope, Record<OperationName, AggregateMetric>>
  >
}
