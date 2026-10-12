import {
  operation_names,
  type Direction,
  type MetricResult,
  type MetricScope,
  type OperationMetrics,
  type OperationName,
  type RatioAverage,
  type SpaceAverages,
} from './types.ts'
/** Reproducible workload entropy, independent of native Session identity generation. */
export class Random {
  private state: number
  /** Initializes the workload stream; zero uses a fixed nonzero state. */
  constructor(seed: number) {
    this.state = seed >>> 0 || 0x6d2b79f5
  }
  /** Returns the next deterministic unsigned lane for fixture choices. */
  nextUint32(): number {
    let value = (this.state += 0x6d2b79f5)
    value = Math.imul(value ^ (value >>> 15), value | 1)
    value ^= value + Math.imul(value ^ (value >>> 7), value | 61)
    return (value ^ (value >>> 14)) >>> 0
  }
  /** Samples 0..exclusiveMaximum - 1; positive integer bounds prevent invalid local positions. */
  integer(exclusiveMaximum: number): number {
    if (!Number.isSafeInteger(exclusiveMaximum) || exclusiveMaximum <= 0)
      throw new RangeError('Random integer bound must be a positive integer.')
    return Math.floor((this.nextUint32() / 4294967296) * exclusiveMaximum)
  }
  /** Samples both endpoints, as used for generated Frame lengths. */
  inclusive(minimum: number, maximum: number): number {
    return minimum + this.integer(maximum - minimum + 1)
  }
}
/** Maps a workload label to a repeatable uint32 seed using FNV-1a. */
export function seedFromString(value: string): number {
  let hash = 0x811c9dc5
  for (let index = 0; index < value.length; index++) {
    hash ^= value.charCodeAt(index)
    hash = Math.imul(hash, 0x01000193)
  }
  return hash >>> 0
}
/** Separates run, scale and case streams so one case cannot advance another's entropy. */
export function deriveSeed(seed: number, label: string): number {
  return seedFromString(`${seed.toString(16)}:${label}`)
}
/** Formats the exact unsigned workload seed for replay. */
export function formatSeed(seed: number): string {
  return `0x${seed.toString(16).padStart(8, '0')}`
}
/** Accumulates individual call timings, retaining counts instead of averaging averages. */
export class MetricAccumulator {
  private count = 0
  private totalNanoseconds = 0
  private minimumNanoseconds = Number.POSITIVE_INFINITY
  private maximumNanoseconds = 0
  /** Adds one complete measured API-call duration in nanoseconds. */
  /** Charges one checkpoint representation to Frame- and Strip-weighted space totals. */
  add(nanoseconds: number): void {
    this.count++
    this.totalNanoseconds += nanoseconds
    if (nanoseconds < this.minimumNanoseconds)
      this.minimumNanoseconds = nanoseconds
    if (nanoseconds > this.maximumNanoseconds)
      this.maximumNanoseconds = nanoseconds
  }
  /** Returns call-weighted latency and rate; no calls yield null timings, not zero latency. */
  snapshot(): MetricResult {
    const averageNanoseconds =
      this.count === 0 ? null : this.totalNanoseconds / this.count
    return {
      count: this.count,
      totalNanoseconds: this.totalNanoseconds,
      averageNanoseconds,
      operationsPerSecond:
        averageNanoseconds === null ? null : 1000000000 / averageNanoseconds,
      minimumNanoseconds: this.count === 0 ? null : this.minimumNanoseconds,
      maximumNanoseconds: this.count === 0 ? null : this.maximumNanoseconds,
    }
  }
}
/** Supplies distinct counters so operation variants cannot share timing state. */
const makeAccumulatorRecord = (): Record<OperationName, MetricAccumulator> =>
  Object.fromEntries(
    operation_names.map((name) => [name, new MetricAccumulator()])
  ) as Record<OperationName, MetricAccumulator>
/** Partitions continuous timings by growth/shrink while retaining their combined totals. */
export class OperationAccumulator {
  private readonly scaleUp = makeAccumulatorRecord()
  private readonly scaleDown = makeAccumulatorRecord()
  private readonly fullLifecycle = makeAccumulatorRecord()
  /** Charges the same call to its direction and the whole-lifecycle total. */
  add(name: OperationName, direction: Direction, nanoseconds: number): void {
    const directionMetrics = direction === 'up' ? this.scaleUp : this.scaleDown
    directionMetrics[name].add(nanoseconds)
    this.fullLifecycle[name].add(nanoseconds)
  }
  /** Reads accumulated counters without clearing the continuing workload's history. */
  snapshot(scope: MetricScope = 'fullLifecycle'): OperationMetrics {
    const source = this[scope]
    return Object.fromEntries(
      operation_names.map((name) => [name, source[name].snapshot()])
    ) as OperationMetrics
  }
}
/** Times one synchronous public call; input preparation and result checks belong outside it. */
export function measure<T>(operation: () => T): {
  result: T
  nanoseconds: number
} {
  const start = process.hrtime.bigint()
  const result = operation()
  const end = process.hrtime.bigint()
  return { result, nanoseconds: Number(end - start) }
}
/** Workload-group treap node; these are benchmark groups, not native Strip fragments. */
type StripNode = {
  id: number
  length: number
  priority: number
  left: StripNode | null
  right: StripNode | null
  subtreeCount: number
  subtreeFrames: number
  subtreeMinimum: number
  subtreeMaximum: number
}
/** Counts workload groups, including zero for an absent subtree. */
const nodeCount = (node: StripNode | null): number => node?.subtreeCount ?? 0
/** Sums visible Frame lengths represented by a workload-model subtree. */
const nodeFrames = (node: StripNode | null): number => node?.subtreeFrames ?? 0
/** Repairs aggregate counts and length bounds after a treap child changes. */
const refresh = (node: StripNode): StripNode => {
  node.subtreeCount = 1 + nodeCount(node.left) + nodeCount(node.right)
  node.subtreeFrames =
    node.length + nodeFrames(node.left) + nodeFrames(node.right)
  node.subtreeMinimum = Math.min(
    node.length,
    node.left?.subtreeMinimum ?? Number.POSITIVE_INFINITY,
    node.right?.subtreeMinimum ?? Number.POSITIVE_INFINITY
  )
  node.subtreeMaximum = Math.max(
    node.length,
    node.left?.subtreeMaximum ?? 0,
    node.right?.subtreeMaximum ?? 0
  )
  return node
}
/** Partitions by workload-group count while preserving each group's complete Frame span. */
const split = (
  node: StripNode | null,
  leftCount: number
): [StripNode | null, StripNode | null] => {
  if (!node) return [null, null]
  if (nodeCount(node.left) >= leftCount) {
    const [left, right] = split(node.left, leftCount)
    node.left = right
    return [left, refresh(node)]
  }
  const [left, right] = split(node.right, leftCount - nodeCount(node.left) - 1)
  node.right = left
  return [refresh(node), right]
}
/** Joins already ordered groups by heap priority, preserving visible group order. */
const mergeNodes = (
  left: StripNode | null,
  right: StripNode | null
): StripNode | null => {
  if (!left) return right
  if (!right) return left
  if (left.priority <= right.priority) {
    left.right = mergeNodes(left.right, right)
    return refresh(left)
  }
  right.left = mergeNodes(left, right.left)
  return refresh(right)
}
/** Derives repeatable balancing priority from group identity without consuming workload entropy. */
const mixIdentifier = (identifier: number): number => {
  let value = identifier >>> 0
  value = Math.imul(value ^ (value >>> 16), 0x7feb352d)
  value = Math.imul(value ^ (value >>> 15), 0x846ca68b)
  return (value ^ (value >>> 16)) >>> 0
}
/** Workload Strip, A.K.A. a contiguous equal-valued Frame group with an authored test ID. */
export type StripEntry = {
  id: number
  length: number
}
/** Independent workload boundary index; it neither models native fragmentation nor orders Gossip. */
export class StripIndex {
  private root: StripNode | null = null
  /** Visible workload-group count used as the lifecycle scale. */
  get count(): number {
    return nodeCount(this.root)
  }
  /** Total visible Frames implied by the workload model. */
  get frameCount(): number {
    return nodeFrames(this.root)
  }
  /** Smallest remaining workload-group length, or null when empty. */
  get minimumLength(): number | null {
    return this.root?.subtreeMinimum ?? null
  }
  /** Largest remaining workload-group length, or null when empty. */
  get maximumLength(): number | null {
    return this.root?.subtreeMaximum ?? null
  }
  /** Returns a group's visible boundary; index equal to count returns the append boundary. */
  frameOffsetAt(index: number): number {
    if (!Number.isSafeInteger(index) || index < 0 || index > this.count)
      throw new RangeError(`Strip index ${index} is outside the Projection.`)
    let node = this.root
    let remaining = index
    let offset = 0
    while (node) {
      const leftCount = nodeCount(node.left)
      if (remaining <= leftCount) {
        node = node.left
      } else {
        offset += nodeFrames(node.left) + node.length
        remaining -= leftCount + 1
        node = node.right
      }
    }
    return offset
  }
  /** Reads one whole workload group's identity and length without changing the model. */
  at(index: number): StripEntry {
    if (!Number.isSafeInteger(index) || index < 0 || index >= this.count)
      throw new RangeError(`Strip index ${index} is outside the Projection.`)
    let node = this.root
    let remaining = index
    while (node) {
      const leftCount = nodeCount(node.left)
      if (remaining === leftCount) return { id: node.id, length: node.length }
      if (remaining < leftCount) node = node.left
      else {
        remaining -= leftCount + 1
        node = node.right
      }
    }
    throw new TypeError('Strip index traversal failed.')
  }
  /** Adds an intact workload group at a group boundary, outside public-API timing. */
  insert(index: number, entry: StripEntry): void {
    const [left, right] = split(this.root, index)
    const node: StripNode = {
      ...entry,
      priority: mixIdentifier(entry.id),
      left: null,
      right: null,
      subtreeCount: 1,
      subtreeFrames: entry.length,
      subtreeMinimum: entry.length,
      subtreeMaximum: entry.length,
    }
    this.root = mergeNodes(mergeNodes(left, node), right)
  }
  /** Removes one complete group and returns its previous identity and Frame length. */
  remove(index: number): StripEntry {
    const [left, rest] = split(this.root, index)
    const [removed, right] = split(rest, 1)
    if (!removed) throw new TypeError('Strip removal failed.')
    this.root = mergeNodes(left, right)
    return { id: removed.id, length: removed.length }
  }
  /** Exchanges one workload group; callers decide whether its length is preserved. */
  replace(index: number, entry: StripEntry): StripEntry {
    const removed = this.remove(index)
    this.insert(index, entry)
    return removed
  }
}
/** Accumulates bytes and units separately to form a unit-weighted footprint ratio. */
export class RatioAccumulator {
  private observationCount = 0
  private totalBytes = 0
  private totalUnits = 0
  /** Includes nonempty scales only; empty documents cannot define bytes per Frame or Strip. */
  add(bytes: number, units: number): void {
    if (units <= 0) return
    this.observationCount++
    this.totalBytes += bytes
    this.totalUnits += units
  }
  /** Reports totals and their ratio, preserving null when no units were observed. */
  snapshot(): RatioAverage {
    return {
      observationCount: this.observationCount,
      totalBytes: this.totalBytes,
      totalUnits: this.totalUnits,
      averageBytesPerUnit:
        this.totalUnits === 0 ? null : this.totalBytes / this.totalUnits,
    }
  }
}
/** Tracks exported memory estimates and serialized storage per Frame and workload Strip. */
export class SpaceAccumulator {
  private readonly memoryFrames = new RatioAccumulator()
  private readonly memoryStrips = new RatioAccumulator()
  private readonly storageFrames = new RatioAccumulator()
  private readonly storageStrips = new RatioAccumulator()
  add(
    memoryBytes: number,
    storageBytes: number,
    stripCount: number,
    frameCount: number
  ): void {
    this.memoryFrames.add(memoryBytes, frameCount)
    this.memoryStrips.add(memoryBytes, stripCount)
    this.storageFrames.add(storageBytes, frameCount)
    this.storageStrips.add(storageBytes, stripCount)
  }
  /** Returns unit-weighted ratios, not an average of per-checkpoint ratios. */
  snapshot(): SpaceAverages {
    return {
      memoryBytesPerFrame: this.memoryFrames.snapshot(),
      memoryBytesPerStrip: this.memoryStrips.snapshot(),
      storageBytesPerFrame: this.storageFrames.snapshot(),
      storageBytesPerStrip: this.storageStrips.snapshot(),
    }
  }
}
