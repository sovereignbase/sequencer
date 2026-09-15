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
export type Delta<T> = [
  type: number,
  dependencyPrefix: number,
  initialLength: number,
  offsetLength: number,
  actorX: number,
  timeX: number,
  actorY: number,
  timeY: number,
  footage?: Array<T | undefined>,
]

/** `[actorId, maskSessionId, frontier, ...]`. */
export type Acknowledgement = Uint32List

/** One atomic replication packet. `ingest` always consumes this pair. */
export type Mutation<T> = [acknowledgement: Acknowledgement, delta: Delta<T>]

/** Trusted persisted state: actor frontiers and dependency-ordered Deltas. */
export type Snapshot<T> = [
  frontiers: Array<Acknowledgement>,
  projection: Array<Delta<T>>,
]

export type ActorIdMap = Record<string, number>
