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

export class Random {
  private state: number

  constructor(seed: number) {
    this.state = seed >>> 0 || 0x6d2b79f5
  }

  nextUint32(): number {
    let value = (this.state += 0x6d2b79f5)
    value = Math.imul(value ^ (value >>> 15), value | 1)
    value ^= value + Math.imul(value ^ (value >>> 7), value | 61)
    return (value ^ (value >>> 14)) >>> 0
  }

  integer(exclusiveMaximum: number): number {
    if (!Number.isSafeInteger(exclusiveMaximum) || exclusiveMaximum <= 0)
      throw new RangeError('Random integer bound must be a positive integer.')
    return Math.floor((this.nextUint32() / 0x1_0000_0000) * exclusiveMaximum)
  }

  inclusive(minimum: number, maximum: number): number {
    return minimum + this.integer(maximum - minimum + 1)
  }
}

export function seedFromString(value: string): number {
  let hash = 0x811c9dc5
  for (let index = 0; index < value.length; index++) {
    hash ^= value.charCodeAt(index)
    hash = Math.imul(hash, 0x01000193)
  }
  return hash >>> 0
}

export function deriveSeed(seed: number, label: string): number {
  return seedFromString(`${seed.toString(16)}:${label}`)
}

export function formatSeed(seed: number): string {
  return `0x${seed.toString(16).padStart(8, '0')}`
}

export class MetricAccumulator {
  private count = 0
  private totalNanoseconds = 0
  private minimumNanoseconds = Number.POSITIVE_INFINITY
  private maximumNanoseconds = 0

  add(nanoseconds: number): void {
    this.count++
    this.totalNanoseconds += nanoseconds
    if (nanoseconds < this.minimumNanoseconds)
      this.minimumNanoseconds = nanoseconds
    if (nanoseconds > this.maximumNanoseconds)
      this.maximumNanoseconds = nanoseconds
  }

  snapshot(): MetricResult {
    const averageNanoseconds =
      this.count === 0 ? null : this.totalNanoseconds / this.count
    return {
      count: this.count,
      totalNanoseconds: this.totalNanoseconds,
      averageNanoseconds,
      operationsPerSecond:
        averageNanoseconds === null ? null : 1_000_000_000 / averageNanoseconds,
      minimumNanoseconds:
        this.count === 0 ? null : this.minimumNanoseconds,
      maximumNanoseconds:
        this.count === 0 ? null : this.maximumNanoseconds,
    }
  }
}

const makeAccumulatorRecord = (): Record<OperationName, MetricAccumulator> =>
  Object.fromEntries(
    operation_names.map((name) => [name, new MetricAccumulator()])
  ) as Record<OperationName, MetricAccumulator>

export class OperationAccumulator {
  private readonly scaleUp = makeAccumulatorRecord()
  private readonly scaleDown = makeAccumulatorRecord()
  private readonly fullLifecycle = makeAccumulatorRecord()

  add(name: OperationName, direction: Direction, nanoseconds: number): void {
    const directionMetrics =
      direction === 'up' ? this.scaleUp : this.scaleDown
    directionMetrics[name].add(nanoseconds)
    this.fullLifecycle[name].add(nanoseconds)
  }

  snapshot(scope: MetricScope = 'fullLifecycle'): OperationMetrics {
    const source = this[scope]
    return Object.fromEntries(
      operation_names.map((name) => [name, source[name].snapshot()])
    ) as OperationMetrics
  }
}

export function measure<T>(operation: () => T): {
  result: T
  nanoseconds: number
} {
  const start = process.hrtime.bigint()
  const result = operation()
  const end = process.hrtime.bigint()
  return { result, nanoseconds: Number(end - start) }
}

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

const nodeCount = (node: StripNode | null): number =>
  node?.subtreeCount ?? 0
const nodeFrames = (node: StripNode | null): number =>
  node?.subtreeFrames ?? 0

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
  const [left, right] = split(
    node.right,
    leftCount - nodeCount(node.left) - 1
  )
  node.right = left
  return [refresh(node), right]
}

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

const mixIdentifier = (identifier: number): number => {
  let value = identifier >>> 0
  value = Math.imul(value ^ (value >>> 16), 0x7feb352d)
  value = Math.imul(value ^ (value >>> 15), 0x846ca68b)
  return (value ^ (value >>> 16)) >>> 0
}

export type StripEntry = { id: number; length: number }

export class StripIndex {
  private root: StripNode | null = null

  get count(): number {
    return nodeCount(this.root)
  }

  get frameCount(): number {
    return nodeFrames(this.root)
  }

  get minimumLength(): number | null {
    return this.root?.subtreeMinimum ?? null
  }

  get maximumLength(): number | null {
    return this.root?.subtreeMaximum ?? null
  }

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

  at(index: number): StripEntry {
    if (!Number.isSafeInteger(index) || index < 0 || index >= this.count)
      throw new RangeError(`Strip index ${index} is outside the Projection.`)
    let node = this.root
    let remaining = index
    while (node) {
      const leftCount = nodeCount(node.left)
      if (remaining === leftCount)
        return { id: node.id, length: node.length }
      if (remaining < leftCount) node = node.left
      else {
        remaining -= leftCount + 1
        node = node.right
      }
    }
    throw new TypeError('Strip index traversal failed.')
  }

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

  remove(index: number): StripEntry {
    const [left, rest] = split(this.root, index)
    const [removed, right] = split(rest, 1)
    if (!removed) throw new TypeError('Strip removal failed.')
    this.root = mergeNodes(left, right)
    return { id: removed.id, length: removed.length }
  }

  replace(index: number, entry: StripEntry): StripEntry {
    const removed = this.remove(index)
    this.insert(index, entry)
    return removed
  }
}

export class RatioAccumulator {
  private observationCount = 0
  private totalBytes = 0
  private totalUnits = 0

  add(bytes: number, units: number): void {
    if (units <= 0) return
    this.observationCount++
    this.totalBytes += bytes
    this.totalUnits += units
  }

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

export class SpaceAccumulator {
  private readonly memoryFrames = new RatioAccumulator()
  private readonly memoryStrips = new RatioAccumulator()
  private readonly storageFramesBefore = new RatioAccumulator()
  private readonly storageFramesAfter = new RatioAccumulator()
  private readonly storageStripsBefore = new RatioAccumulator()
  private readonly storageStripsAfter = new RatioAccumulator()

  add(
    memoryBytes: number,
    beforeCompactBytes: number,
    afterCompactBytes: number,
    stripCount: number,
    frameCount: number
  ): void {
    this.memoryFrames.add(memoryBytes, frameCount)
    this.memoryStrips.add(memoryBytes, stripCount)
    this.storageFramesBefore.add(beforeCompactBytes, frameCount)
    this.storageFramesAfter.add(afterCompactBytes, frameCount)
    this.storageStripsBefore.add(beforeCompactBytes, stripCount)
    this.storageStripsAfter.add(afterCompactBytes, stripCount)
  }

  snapshot(): SpaceAverages {
    return {
      memoryBytesPerFrame: this.memoryFrames.snapshot(),
      memoryBytesPerStrip: this.memoryStrips.snapshot(),
      storageBytesPerFrameBeforeCompact:
        this.storageFramesBefore.snapshot(),
      storageBytesPerFrameAfterCompact: this.storageFramesAfter.snapshot(),
      storageBytesPerStripBeforeCompact:
        this.storageStripsBefore.snapshot(),
      storageBytesPerStripAfterCompact: this.storageStripsAfter.snapshot(),
    }
  }
}
