/** Continuously timed lifecycle operations; positional suffixes describe workload placement. */
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

/** Checkpoint-only management calls, measured independently from continuous edits. */
export const management_names = ['create', 'sequence', 'values'] as const
/** Stable presentation order for both continuous and checkpoint metric families. */
export const aggregate_names = [...operation_names, ...management_names].sort()

/** Document growth or shrink phase, distinct from structural traversal direction. */
export type Direction = 'up' | 'down'
/** Report label for the measured replica; its synchronized peer remains untimed. */
export type ReplicaName = 'A'
/** Public-call case charged to continuous lifecycle counters. */
export type OperationName = (typeof operation_names)[number]
/** Public-call case sampled at lifecycle checkpoints. */
export type ManagementName = (typeof management_names)[number]
/** Direction-specific or complete-lifecycle accumulation scope. */
export type MetricScope = 'scaleUp' | 'scaleDown' | 'fullLifecycle'

/** Reproducible workload controls and reporting bounds, validated before a suite starts. */
export type BenchmarkConfig = {
  /** Selects mixed acknowledged lifecycles or independent API-call bursts. */
  suite: 'lifecycle' | 'throughput'
  /** Throughput fixture's authored workload-group count; native extensions may coalesce roots. */
  initialStripCount: number
  /** Approximate wall-time bound per throughput burst; time is checked every 64 calls. */
  burstMilliseconds: number
  /** Per-burst call cap, further limited when removal exhausts the document. */
  maximumCalls: number
  /** Independent complete runs, not repeated calls within a single burst. */
  runs: number
  /** Upper workload-group scale; distinct from native arena capacity. */
  maximumStripCount: number
  /** Exact observed scales, deduplicated and sorted by the CLI. */
  checkpoints: Array<number>
  /** Inclusive lower Frame length for generated workload groups. */
  minimumStripFrameLength: number
  /** Inclusive upper Frame length, also bounding throughput range-read width. */
  maximumStripFrameLength: number
  /** Untimed lifecycle cycles or per-case throughput calls, according to the selected suite. */
  warmupCycles: number
  /** Workload seed label; native Session IDs still use runtime entropy. */
  baseSeed: string
  /** Paired report destination, or null to leave existing measurements untouched. */
  outputPath: string | null
}

/** Actual calls and elapsed nanoseconds; null timings mean no calls or unmeasured extrema. */
export type MetricResult = {
  /** Actual measured calls, including each iteration of a throughput burst. */
  count: number
  /** Sum of individual timings or elapsed whole-burst time, according to the suite. */
  totalNanoseconds: number
  /** totalNanoseconds / count; null when no calls were observed. */
  averageNanoseconds: number | null
  /** One billion divided by average latency, never an average of independently sampled rates. */
  operationsPerSecond: number | null
  /** Individual-call minimum; absent for throughput's batch timing. */
  minimumNanoseconds: number | null
  /** Individual-call maximum; absent for throughput's batch timing. */
  maximumNanoseconds: number | null
}

/** Independent counters for each continuous method and placement variant. */
export type OperationMetrics = Record<OperationName, MetricResult>

/** One checkpoint operation's timing, using the same units as continuous metrics. */
export type ManagementResult = MetricResult

/** Visible workload groups and retained snapshot identities, which are different counts. */
export type StripStatistics = {
  /** Visible workload groups maintained by the independent lifecycle model. */
  stripCount: number
  /** Visible Frames rather than structural effects or reserved logical boundaries. */
  frameCount: number
  averageStripLength: number | null
  minimumStripLength: number | null
  maximumStripLength: number | null
  /** Canonical snapshot records, including retained masks; runtime fragments are not extra records. */
  retainedDeltaCount: number
}

/** Exported representation estimate: four bytes per word plus eight per Footage slot. */
export type MemoryResult = {
  /** Combined word and Footage-slot estimate; excludes native live history and referenced value objects. */
  bytes: number
  bytesPerStrip: number | null
  bytesPerFrame: number | null
  measurement: 'estimated-sequence-words-plus-js-footage-slots'
  sequenceMetadataWordBytes: number
  javascriptFootageSlotBytes: number
}

/** One measured instance's isolated WASM allocation and retained JavaScript arrays. */
export type RuntimeMemoryResult = {
  scope: 'single-instance-runtime'
  measurement: 'wasm-linear-memory-plus-js-array-slots'
  bytes: number
  wasmBytes: number
  javascriptBytes: number
  javascriptSlotBytes: 8
}

/** Actual V8-serialized Sequence bytes, excluding filesystem metadata and I/O latency. */
export type StorageResult = {
  serialization: 'node:v8.serialize'
  /** Byte length of the actual serialized retained Sequence. */
  sequenceBytes: number
  bytesPerStrip: number | null
  bytesPerFrame: number | null
}

/** Transport sizes of the same Sequence encoded as numeric arrays. */
export type EncodedSequenceSizes = {
  jsonBytes: number
  jsonGzipBytes: number
  messagePackBytes: number
  messagePackGzipBytes: number
}

/** Compiled JavaScript bundle sizes, including the embedded WASM module. */
export type BundleSizes = Record<
  'ESM' | 'CommonJS',
  {
    rawBytes: number
    minifiedBytes: number
    gzipBytes: number
  }
>

/** Cumulative operation counters plus one checkpoint's management and document observations. */
export type ReplicaCheckpoint = {
  operations: OperationMetrics
  management: Record<ManagementName, ManagementResult>
  memory: MemoryResult
  storage: StorageResult & EncodedSequenceSizes
  strips: StripStatistics
}

/** Shared process allocation including all replicas, fixtures and temporary results. */
export type ProcessMemoryResult = {
  scope: 'shared-process-not-attributable-to-one-replica'
  rssBytes: number
  heapTotalBytes: number
  heapUsedBytes: number
  externalBytes: number
  arrayBufferBytes: number
}

/** Observation at an exact workload-group scale during one measured run. */
export type CheckpointResult = {
  run: number
  direction: Direction
  stripCount: number
  frameCount: number
  runtimeMemory: RuntimeMemoryResult
  processMemory: ProcessMemoryResult
  replicas: Record<ReplicaName, ReplicaCheckpoint>
}

/** Sum(bytes) / sum(units), preserving underlying totals and observation count. */
export type RatioAverage = {
  observationCount: number
  totalBytes: number
  totalUnits: number
  averageBytesPerUnit: number | null
}

/** Unit-weighted representation footprint across nonempty checkpoints. */
export type SpaceAverages = {
  memoryBytesPerFrame: RatioAverage
  memoryBytesPerStrip: RatioAverage
  storageBytesPerFrame: RatioAverage
  storageBytesPerStrip: RatioAverage
}

/** Independent operation and space accumulations for one complete replica history. */
export type ReplicaRunResult = {
  operations: Record<MetricScope, OperationMetrics>
  spaceAverages: Record<MetricScope, SpaceAverages>
}

/** Empty Projection initialization timing at the start of each run. */
export type InitializationResult = Record<ReplicaName, MetricResult>

/** One seeded lifecycle and its exact checkpoints, before cross-run aggregation. */
export type RunResult = {
  run: number
  seed: string
  initialization: InitializationResult
  checkpoints: Array<CheckpointResult>
  replicas: Record<ReplicaName, ReplicaRunResult>
}

/** Pooled call-weighted timing alongside independent run means and population dispersion. */
export type AggregateMetric = {
  runCount: number
  totalSampleCount: number
  totalNanoseconds: number
  /** All measured time divided by all measured calls across runs. */
  sampleWeightedAverageNanoseconds: number | null
  sampleWeightedOperationsPerSecond: number | null
  /** Equal-weight average of independent run means, distinct from the call-weighted average. */
  meanRunAverageNanoseconds: number | null
  medianRunAverageNanoseconds: number | null
  /** Population dispersion of run means, rather than individual-call latency. */
  standardDeviationNanoseconds: number | null
  minimumRun: { run: number; averageNanoseconds: number } | null
  maximumRun: { run: number; averageNanoseconds: number } | null
}

/** Complete lifecycle evidence, including environment, metric interpretation and raw runs. */
export type BenchmarkReport = {
  schemaVersion: 4
  /** Measured after the lifecycle finishes, when its reports are written. */
  bundles?: BundleSizes
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
    /** Legacy report field name for remote apply and Acknowledgement exchange, A.K.A. Gossip delivery. */
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
