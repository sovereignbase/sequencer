export const operation_names = [
  'apply.random',
  'insert.head',
  'insert.random',
  'insert.tail',
  'remove.head',
  'remove.random',
  'remove.tail',
  'replace.head',
  'replace.random',
  'replace.tail',
  'value.head',
  'value.random',
  'value.tail',
] as const

export const management_names = ['create', 'sequence', 'values'] as const
export const aggregate_names = [...operation_names, ...management_names].sort()

export type Direction = 'up' | 'down'
export type ReplicaName = 'A'
export type OperationName = (typeof operation_names)[number]
export type ManagementName = (typeof management_names)[number]
export type MetricScope = 'scaleUp' | 'scaleDown' | 'fullLifecycle'

export type BenchmarkConfig = {
  suite: 'lifecycle' | 'throughput'
  initialStripCount: number
  burstMilliseconds: number
  maximumCalls: number
  runs: number
  maximumStripCount: number
  checkpoints: Array<number>
  minimumStripFrameLength: number
  maximumStripFrameLength: number
  warmupCycles: number
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
  retainedDeltaCount: number
}

export type MemoryResult = {
  bytes: number
  bytesPerStrip: number | null
  bytesPerFrame: number | null
  measurement: 'estimated-sequence-words-plus-js-footage-slots'
  sequenceMetadataWordBytes: number
  javascriptFootageSlotBytes: number
}

export type StorageResult = {
  serialization: 'node:v8.serialize'
  sequenceBytes: number
  bytesPerStrip: number | null
  bytesPerFrame: number | null
}

export type ReplicaCheckpoint = {
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
  storageBytesPerFrame: RatioAverage
  storageBytesPerStrip: RatioAverage
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
  schemaVersion: 3
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
    implementation: 'TypeScript Projection class public API'
    timer: 'process.hrtime.bigint'
    stripCount: string
    ingest: string
    average: string
    memory: string
    storage: string
  }
  runs: Array<RunResult>
  aggregates: Record<
    ReplicaName,
    Record<MetricScope, Record<OperationName | ManagementName, AggregateMetric>>
  >
  spaceAggregates: Record<ReplicaName, Record<MetricScope, SpaceAverages>>
}
