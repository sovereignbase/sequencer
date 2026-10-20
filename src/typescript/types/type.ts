/** Unsigned 32-bit structural words, accepted as a typed view or JSON numeric array. */
export type U32List = Uint32Array | ReadonlyArray<number>

/**
 * Exactly six words, in the replication order:
 * `[anchorSession, anchorStart, anchorDiff,
 *   insertionSession, insertionStart, insertionDiff]`.
 * The anchor triple names a logical point in an existing Insertion; the Session
 * and start pair identifies the authored Insertion. A positive diff adds Frames;
 * a negative diff masks original Frames. Signed values use uint32 bit patterns.
 */
export type InsertionWords = U32List

/**
 * Canonical replication operation and optional JavaScript-owned Footage.
 * Positive Insertions may omit Footage; their Frames then read as `undefined`.
 * Reducing Insertions carry no content into native state.
 */
export type Insertion<T> = Readonly<
  [
    /** Stable anchor, identity and signed Frame effect. */
    words: InsertionWords,
    /** Values of a positive Insertion, in original Frame order. */
    footage?: ReadonlyArray<T | undefined>,
  ]
>

/**
 * Describes one Actor's acknowledgement frontier.
 * `[actorID, sessionID, sessionEnd, ...]` contains removal Session/frontier pairs.
 * Actor-only tuples establish membership before removals, including offline Actors.
 * Compaction requires equal complete Session frontiers from every active Actor.
 * The application must deliver pending history before claiming that frontier.
 */
export type Acknowledgement = U32List

/** Replication batch within retained history; delivery may be duplicated or causally reordered. */
export type Gossip<T> = ReadonlyArray<Acknowledgement | Insertion<T>>

/**
 * Retained state required to hydrate the same visible Projection.
 * One structural array and one JavaScript-owned content array.
 * Small snapshots use six-word insertion records after length-prefixed ACKs;
 * `words[0]` locates those records. Large snapshots begin with
 * `[0, frontiersEnd, insertionCount]` and omit predictable coordinate fields.
 * Both layouts encode the retained coordinates and acknowledgements.
 * Eligible masks, deleted Footage and compacted Session claims are omitted;
 * Actor membership remains. Compaction may translate retained coordinates.
 * Positive insertion diffs consume successive spans of `footage`.
 * `[[], []]` is an empty Sequence. Both numeric arrays and typed views are accepted.
 */
export type Sequence<T> = Readonly<
  [
    /** Acknowledgements followed by canonical Insertions in Structural Order. */
    words: U32List,
    /** Consecutive positive Insertion spans, including missing Footage slots. */
    footage: ReadonlyArray<T | undefined>,
  ]
>

/** Visible mutation: insertion uses `[at, at, values]`; removal ends exclusively. */
export type Splice<T> = Readonly<
  [
    /** First affected position in the Projection after preceding Splices. */
    startAt: number,
    /** Exclusive removal boundary; equal to `startAt` for insertion. */
    endWith: number,
    /** Inserted Footage; omitted for removal. */
    values?: ReadonlyArray<T | undefined>,
  ]
>

/** Splices applied in order to reproduce the remote operation's visible effect. */
export type Change<T> = ReadonlyArray<Splice<T>>
/** Visible changes and optional Gossip returned by `apply()` or `merge()`. */
export type Result<T> = Readonly<[change: Change<T>, gossip?: Gossip<T>]>
