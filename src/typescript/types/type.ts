/** Local runtime state: native Projector id and consumer-owned Footage. */
export type Replica<T> = [id: number, footage: Array<T | undefined>]

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
export type Projection = /**  [
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
  frontiers: Acknowledgement,
  projection: Projection,
  footage?: Array<T>,
]

export type Snapshot<T> = [
  frontiers: Array<Acknowledgement>,
  projection: Projection,
  footage: Array<T>,
]
