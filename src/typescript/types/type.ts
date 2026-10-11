/** Consumer-facing visible patch keyed by zero-based Projection index. */
export type Change<T> = Record<number, T | undefined>

/**
 * One transferable operation.
 *
 * The numeric prefix is
 * `[type, dependencyPrefix, initialLength, offsetLength,
 *   actorX, timeX, actorY, timeY]`.
 * X is the causal anchor clock and Y is this operation's insert/mask clock.
 */
export type Projection = /** [
  type: number,
  dependencyPrefix: number,
  initialLength: number,
  offsetLength: number,
  actorX: number,
  timeX: number,
  actorY: number,
  timeY: number,
] 
*/ Uint32List

/** `[actorId, maskSessionId, frontier, ...]`. */
export type Acknowledgement = Uint32List

/** Trusted persisted state: actor frontiers and dependency-ordered Deltas. */
export type Delta<T> = [
  acknowledgement: Acknowledgement,
  projection: Projection,
  footage?: Array<T | undefined>,
]

export type Snapshot<T> = [
  frontiers: Array<Acknowledgement>,
  projection: Projection,
  footage: Array<T | undefined>,
]

/**
 * Consumer-facing Projection splice.
 *
 * Replaces the half-open range `[startAt, endAt)` with optional `values`.
 */
export type Splice<T> = Readonly<
  [startAt: number, endAt: number, values?: ReadonlyArray<T | undefined>]
>

/**
 * Ordered visible Projection mutations produced by applying remote data.
 */
export type Change<T> = ReadonlyArray<Splice<T>>

/**
 * Result of a mutating Sequence operation.
 *
 * `change` describes the visible Projection mutations.
 *
 * `delta` contains replication data when the operation emitted any.
 */
export type Result<T> = Readonly<[change: Change<T>, delta?: Delta<T>]>
