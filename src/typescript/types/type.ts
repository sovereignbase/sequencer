/** Structural words may be typed views or numeric arrays received as JSON. */
export type U32List = Uint32Array | ReadonlyArray<number>

/**
 * Exactly six words, in the replication order:
 * `[anchorSession, anchorStart, anchorDiff,
 *   insertionSession, insertionStart, insertionDiff]`.
 * Signed coordinates use their 32-bit bit pattern; WASM interprets those lanes
 * as signed.
 */
export type InsertionWords = U32List

/** Insertion coordinates plus optional JS-owned content. Only words enter WASM. */
export type Insertion<T> = Readonly<
  [words: InsertionWords, footage?: ReadonlyArray<T | undefined>]
>

/** `[actorID, sessionID, sessionEnd, ...]`. */
export type Acknowledgement = U32List

export type Gossip<T> = ReadonlyArray<Acknowledgement | Insertion<T>>

/**
 * One structural array and one JS-owned content array.
 * Small snapshots use six-word insertion records after length-prefixed ACKs;
 * `words[0]` locates those records. Large snapshots begin with
 * `[0, frontiersEnd, insertionCount]` and omit predictable coordinate fields.
 * Both layouts retain complete coordinates and acknowledgements.
 * Positive insertion diffs consume successive spans of `footage`.
 * `[[], []]` is an empty Sequence. Both numeric arrays and typed views are accepted.
 */
export type Sequence<T> = Readonly<
  [words: U32List, footage: ReadonlyArray<T | undefined>]
>

export type Splice<T> = Readonly<
  [startAt: number, endWith: number, values?: ReadonlyArray<T | undefined>]
>

export type Change<T> = ReadonlyArray<Splice<T>>
export type Result<T> = Readonly<[change: Change<T>, gossip?: Gossip<T>]>
