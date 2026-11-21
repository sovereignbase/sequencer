/**
 * Numeric insertion metadata has exactly six words, in replication order:
 * `[anchorSession, anchorStart, anchorDiff,
 *   insertionSession, insertionStart, insertionDiff]`.
 * The anchor triple names a logical point in an existing Insertion; the Session
 * and start pair identifies the authored Insertion. A positive diff adds Frames;
 * a negative diff masks original Frames. Signed values use uint32 bit patterns.
 * In tuple mode, `anchorDiff` is the stable index and diff is `1` or `-1`.
 * Binary encoding stores the same coordinates in a `Uint8Array`.
 */
export type InsertionWords<BinaryEncoded extends boolean = false> =
  BinaryEncoded extends true ? Uint8Array : ReadonlyArray<number>

/** Frame values, or UTF-16 code units retained as a string; missing text slots use NUL. */
export type Footage<
  T,
  StringEncoded extends boolean = false,
> = StringEncoded extends true ? string : ReadonlyArray<T | undefined>

/**
 * Canonical replication operation and optional JavaScript-owned Footage.
 * Positive Insertions may omit Footage; their Frames then read as `undefined`.
 * Reducing Insertions carry no content into native state.
 */
export type Insertion<
  T,
  StringEncoded extends boolean = false,
  BinaryEncoded extends boolean = false,
> = Readonly<
  [
    /** Stable anchor, identity and signed Frame effect. */
    words: InsertionWords<BinaryEncoded>,
    /** Values of a positive Insertion, in original Frame order. */
    footage?: Footage<T, StringEncoded>,
  ]
>

/**
 * Describes one Actor's acknowledgement frontier.
 * Numeric `[actorID, sessionID, sessionEnd, ...]` contains removal Session/frontier pairs.
 * Actor-only tuples establish membership before removals, including offline Actors.
 * Compaction requires equal complete Session frontiers from every active Actor.
 * The application must deliver pending history before claiming that frontier.
 */
export type Acknowledgement<BinaryEncoded extends boolean = false> =
  BinaryEncoded extends true ? Uint8Array : ReadonlyArray<number>

/** Replication batch within retained history; delivery may be duplicated or causally reordered. */
export type Gossip<
  T,
  StringEncoded extends boolean = false,
  BinaryEncoded extends boolean = false,
> = ReadonlyArray<
  Acknowledgement<BinaryEncoded> | Insertion<T, StringEncoded, BinaryEncoded>
>

/**
 * Retained state required to hydrate the same visible Projection.
 * Structural metadata and JavaScript-owned Footage.
 * Small numeric snapshots use six-word insertion records after length-prefixed ACKs;
 * `words[0]` locates those records. Large snapshots begin with
 * `[0, frontiersEnd, insertionCount]` and omit predictable coordinate fields.
 * Both layouts encode the retained coordinates and acknowledgements.
 * Eligible masks, deleted Footage and compacted Session claims are omitted;
 * Actor membership remains. Compaction may translate retained coordinates.
 * Positive insertion diffs consume successive spans of `footage`.
 * String-encoded Footage preserves Insertion order, not visible text order.
 * It uses one UTF-16 code unit per Frame. Missing slots use
 * NUL (`\u0000`). Constructor string Footage is retained when requested explicitly.
 * `[[], []]` is an empty Sequence. Structural words use numeric arrays by default;
 * binary encoding uses a `Uint8Array` without changing Footage.
 * Tuple metadata prefixes the payload with `[0xffffffff, 1, maxLength, length]`;
 * `maxLength = 0xffffffff` denotes dynamic growth. Tuple indices are never translated.
 */
export type Sequence<
  T,
  StringEncoded extends boolean = false,
  BinaryEncoded extends boolean = false,
> = Readonly<
  [
    /** Acknowledgements followed by canonical Insertions in Structural Order. */
    words: InsertionWords<BinaryEncoded>,
    /** Consecutive positive Insertion spans, including missing Footage slots. */
    footage: Footage<T, StringEncoded>,
  ]
>

/**
 * Visible mutation: insertion uses `[at, at, values]`; removal ends exclusively.
 * Tuple changes assign one stable index using `[index, index + 1, [value]]`;
 * an empty register supplies `undefined`, without shifting other indices.
 */
export type Splice<T, StringEncoded extends boolean = false> = Readonly<
  [
    /** First affected position in the Projection after preceding Splices. */
    startAt: number,
    /** Exclusive removal boundary; equal to `startAt` for insertion. */
    endWith: number,
    /** Inserted Footage; omitted for removal. */
    values?: Footage<T, StringEncoded>,
  ]
>

/** Splices applied in order to reproduce the remote operation's visible effect. */
export type Change<T, StringEncoded extends boolean = false> = ReadonlyArray<
  Splice<T, StringEncoded>
>
/** Visible changes and optional Gossip returned by `apply()` or `merge()`. */
export type Result<
  T,
  StringEncoded extends boolean = false,
  BinaryEncoded extends boolean = false,
> = Readonly<
  [change: Change<T, StringEncoded>, gossip?: Gossip<T, false, BinaryEncoded>]
>

/** Stable-index register configuration; omitting maxLength permits dynamic growth. */
export type TupleParams = {
  /** Whether indices remain fixed when values are inserted or removed. */
  enabled: boolean | 0 | 1
  /** Fixed number of registers, indices must be in `0..maxLength - 1`. */
  maxLength?: number
}
