/** Structural words may be typed views or numeric arrays received as JSON. */
export type U32List = Uint32Array | ReadonlyArray<number>

/**
 * Exactly six words, in the replication order:
 * `[anchorSession, anchorStart, anchorDiff,
 *   insertionSession, insertionStart, insertionDiff]`.
 * Signed coordinates use their 32-bit bit pattern; WASM interprets those lanes
 * as signed. There is no kind/prefix/end-time encoding from the old runtime.
 */
export type InsertionWords = U32List

/** Insertion coordinates plus optional JS-owned content. Only words enter WASM. */
export type Insertion<T> = Readonly<
  [words: InsertionWords, footage?: ReadonlyArray<T | undefined>]
>

/** `[actorID, sessionID, sessionEnd, ...]`. */
export type Acknowledgement = U32List

export type Gossip<T> = ReadonlyArray<Acknowledgement | Insertion<T>>

export type Sequence<T> = Readonly<
  [
    frontiers: ReadonlyArray<Acknowledgement>,
    insertions: ReadonlyArray<Insertion<T>>,
  ]
>

export type Splice<T> = Readonly<
  [startAt: number, endWith: number, values?: ReadonlyArray<T | undefined>]
>

export type Change<T> = ReadonlyArray<Splice<T>>
export type Result<T> = Readonly<[change: Change<T>, gossip?: Gossip<T>]>
