
/**
 * Exactly six words, in the replication order:
 * `[anchorSession, anchorStart, anchorDiff,
 *   insertionSession, insertionStart, insertionDiff]`.
 * The anchor triple names a logical point in an existing Insertion; the Session
 * and start pair identifies the authored Insertion. A positive diff adds Frames;
 * a negative diff masks original Frames. Signed values use uint32 bit patterns.
 * In tuple mode, `anchorDiff` is the stable index and diff is `1` or `-1`.
 */
type InsertionWords = ReadonlyArray<number>;
/**
 * Canonical replication operation and optional JavaScript-owned Footage.
 * Positive Insertions may omit Footage; their Frames then read as `undefined`.
 * Reducing Insertions carry no content into native state.
 */
type Insertion<T> = Readonly<[
/** Stable anchor, identity and signed Frame effect. */
words: InsertionWords,
/** Values of a positive Insertion, in original Frame order. */
footage?: ReadonlyArray<T | undefined>]>;
/**
 * Describes one Actor's acknowledgement frontier.
 * `[actorID, sessionID, sessionEnd, ...]` contains removal Session/frontier pairs.
 * Actor-only tuples establish membership before removals, including offline Actors.
 * Compaction requires equal complete Session frontiers from every active Actor.
 * The application must deliver pending history before claiming that frontier.
 */
type Acknowledgement = ReadonlyArray<number>;
/** Replication batch within retained history; delivery may be duplicated or causally reordered. */
type Gossip<T> = ReadonlyArray<Acknowledgement | Insertion<T>>;
/**
 * Retained state required to hydrate the same visible Projection.
 * One structural array and JavaScript-owned Footage.
 * Small snapshots use six-word insertion records after length-prefixed ACKs;
 * `words[0]` locates those records. Large snapshots begin with
 * `[0, frontiersEnd, insertionCount]` and omit predictable coordinate fields.
 * Both layouts encode the retained coordinates and acknowledgements.
 * Eligible masks, deleted Footage and compacted Session claims are omitted;
 * Actor membership remains. Compaction may translate retained coordinates.
 * Positive insertion diffs consume successive spans of `footage`.
 * String-encoded Footage preserves Insertion order, not visible text order.
 * It uses one UTF-16 code unit per Frame. Missing slots use
 * NUL (`\u0000`); hydration splits the string with `split('')`.
 * `[[], []]` is an empty Sequence. Structural words use numeric arrays.
 * Tuple metadata prefixes the payload with `[0xffffffff, 1, maxLength, length]`;
 * `maxLength = 0xffffffff` denotes dynamic growth. Tuple indices are never translated.
 */
type Sequence<T, StringEncoded extends boolean = false> = Readonly<[
/** Acknowledgements followed by canonical Insertions in Structural Order. */
words: ReadonlyArray<number>,
/** Consecutive positive Insertion spans, including missing Footage slots. */
footage: StringEncoded extends true ? string : ReadonlyArray<T | undefined>]>;
/**
 * Visible mutation: insertion uses `[at, at, values]`; removal ends exclusively.
 * Tuple changes assign one stable index using `[index, index + 1, [value]]`;
 * an empty register supplies `undefined`, without shifting other indices.
 */
type Splice<T> = Readonly<[
/** First affected position in the Projection after preceding Splices. */
startAt: number,
/** Exclusive removal boundary; equal to `startAt` for insertion. */
endWith: number,
/** Inserted Footage; omitted for removal. */
values?: ReadonlyArray<T | undefined>]>;
/** Splices applied in order to reproduce the remote operation's visible effect. */
type Change<T> = ReadonlyArray<Splice<T>>;
/** Visible changes and optional Gossip returned by `apply()` or `merge()`. */
type Result<T> = Readonly<[change: Change<T>, gossip?: Gossip<T>]>;
/** Stable-index register configuration; omitting maxLength permits dynamic growth. */
type TupleParams = {
  /** Whether indices remain fixed when values are inserted or removed. */
  enabled: boolean | 0 | 1;
  /** Fixed number of registers, indices must be in `0..maxLength - 1`. */
  maxLength?: number;
};
/** Semantic error codes reported by the Sequencer public API. */
type SequencerErrorCode = 'UNKNOWN_ERROR' | 'PROJECTION_DESTROYED' | 'NATIVE_OPERATION_FAILED' | 'STRING_ENCODING_FAILED';
/** Error reported by Sequencer with a stable code and package-prefixed message. */
export declare class SequencerError extends Error {
  /** Machine-readable code identifying the failure condition. */
  readonly code: SequencerErrorCode;
  /**
   * Creates a Sequencer error.
   *
   * @param code Stable code identifying the failure condition.
   * @param message Human-readable detail; defaults to `code`.
   * @param options Standard error options; `cause` retains an underlying error.
   */
  constructor(code: SequencerErrorCode, message?: string, options?: ErrorOptions);
}
/** Visible Projection of a replicated Sequence. */
export declare class Projection<T> {
  readonly actorID: number;
  /** Native instance handle; a negative value marks explicit destruction. */
  private id;
  /**
   * Prepares to sequence a projection, optionally hydrating from a trusted sequence stored by the application.
   *
   * @param actorID Actor identifier used in acknowledgements.
   * @param trustedSequence Optional trusted Sequence in Structural Order; string Footage is split into UTF-16 code units.
   * @param tupleParams Enables stable indices, optionally bounded by a fixed length. Tuple Sequences retain this configuration.
   * @throws {@link SequencerError} if native initialization fails.
   */
  constructor(actorID: number, trustedSequence?: unknown, tupleParams?: TupleParams);
  /**
   * Applies gossiped Insertions and Acknowledgements.
   *
   * @param gossip Batch of Insertion and Acknowledgement tuples.
   * @returns Visible changes and optional acknowledgement Gossip, or
   * `undefined` for invalid input. Earlier entries may already have been applied.
   * @throws {@link SequencerError} with code `PROJECTION_DESTROYED` after destruction.
   */
  apply(gossip: unknown): Result<T> | undefined;
  /**
   * Inserts values at a Projection position.
   *
   * @param values Nonempty array of values to insert.
   * @param at Insertion position in `0..length()`, inclusive. In tuple mode, the first stable index to write; each value creates a competing version.
   * @returns Gossip describing the insertion.
   * @throws {@link SequencerError} with code `PROJECTION_DESTROYED` after destruction.
   */
  insert(values: Array<T>, at: number): Gossip<T>;
  /**
   * Returns the length, A.K.A. amount of entries of this projection.
   *
   * @returns Current Projection length. Tuples retain their fixed length or highest written boundary, including empty registers.
   * @throws {@link SequencerError} with code `PROJECTION_DESTROYED` after destruction.
   */
  length(): number;
  /**
   * Applies relevant acknowledgements and nonduplicate insertions from a replica of the sequence.
   *
   * @param sequence Sequence to merge.
   * @returns Visible changes and optional acknowledgement Gossip, or
   * `undefined` if the Sequence has an invalid runtime shape.
   * @throws {@link SequencerError} with code `PROJECTION_DESTROYED` after destruction.
   */
  merge(sequence: unknown): Result<T> | undefined;
  /**
   * Removes an inclusive range of Projection positions.
   *
   * @param startAt First position to remove; defaults to 0.
   * @param endWith Last position to remove; defaults to `length() - 1`.
   * @returns Reducing Insertions and their acknowledgement as Gossip. Tuple removal targets all known active versions without shifting indices.
   * @throws {@link SequencerError} if destroyed or the native runtime reports an operation failure.
   */
  remove(startAt?: number, endWith?: number): Gossip<T>;
  /**
   * Replaces an inclusive range of Projection positions.
   *
   * @param withValues Replacement values; an empty array only removes the range.
   * @param startAt First position to replace; defaults to 0.
   * @param endWith Last position to replace; defaults to `length() - 1`.
   * @returns Removal and insertion Gossip, in that order. Tuple replacement removes known versions and writes consecutive stable indices.
   * @throws {@link SequencerError} if destroyed or the native runtime reports an operation failure.
   */
  replace(withValues: Array<T>, startAt?: number, endWith?: number): Gossip<T>;
  /**
   * Retires an Actor from future compaction requirements.
   *
   * @remarks
   * The application is responsible for deciding which Actors are retired and
   * for propagating that decision to the relevant replicas.
   *
   * @param actorID Actor whose Acknowledgements are no longer required for compaction.
   * @throws {@link SequencerError} if destroyed or the native runtime reports an operation failure.
   */
  retire(actorID: number): void;
  /**
   * Sequences state into a compact serializable format.
   *
   * @remarks
   * Register active Actors before removal. Equal complete Session frontiers
   * permit masks and deleted Footage to be omitted from the retained checkpoint.
   * Compaction may translate retained anchors without rewriting this instance.
   *
   * @param stringEncode Whether to concatenate Footage into a string; each text Frame must be one UTF-16 code unit. Defaults to `false`.
   * @returns A Sequence with acknowledged removals compacted in the exported state.
   * @throws {@link SequencerError} if destroyed or the native runtime reports an operation failure.
   * @throws {@link SequencerError} with code `STRING_ENCODING_FAILED` if Footage concatenation fails.
   */
  sequence<StringEncoded extends boolean = false>(stringEncode?: StringEncoded): Sequence<T, StringEncoded>;
  /**
   * Returns the value at a Projection position.
   *
   * @param at Valid visible position in `0..length() - 1`.
   * @returns The corresponding Footage value.
   * @throws {@link SequencerError} with code `PROJECTION_DESTROYED` after destruction.
   */
  value(at: number): T | undefined;
  /**
   * Returns values from an inclusive range of Projection positions.
   *
   * @param startAt First included position; defaults to 0.
   * @param endWith Last included position; defaults to `length() - 1`.
   * @returns A new array of values, or an empty array for an empty range.
   * @throws {@link SequencerError} if destroyed or the native runtime reports an operation failure.
   */
  values(startAt?: number, endWith?: number): Array<T>;
  /** Destroys the Projection. Repeated calls have no effect. */
  destroy(): void;
}
export type { Acknowledgement, Change, Gossip, Insertion, InsertionWords, Result, Sequence, SequencerErrorCode, Splice, TupleParams };
//# sourceMappingURL=index.d.ts.map