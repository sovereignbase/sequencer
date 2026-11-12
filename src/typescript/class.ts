import type { Gossip, Result, Sequence, TupleParams } from './types/type.js'
import {
  apply,
  call,
  create,
  destroy,
  insert,
  length,
  sequence,
  value,
  values,
} from './runtime/client.js'
import { Operation } from './runtime/protocol.js'
import { SequencerError, unknownError } from './errors/class.js'

/** Visible Projection of a replicated Sequence. */
export class Projection<T> {
  /** Native instance handle; a negative value marks explicit destruction. */
  private id: number

  /**
   * Prepares to sequence a projection, optionally hydrating from a trusted sequence stored by the application.
   *
   * @param actorID Actor identifier used in acknowledgements.
   * @param trustedSequence Optional trusted Sequence in Structural Order; string Footage is split into UTF-16 code units.
   * @param tupleParams Enables stable indices, optionally bounded by a fixed length. Tuple Sequences retain this configuration.
   * @throws {@link SequencerError} if native initialization fails.
   */
  constructor(
    public readonly actorID: number,
    trustedSequence?: unknown,
    tupleParams?: TupleParams
  ) {
    try {
      this.id = create(this, actorID, trustedSequence, tupleParams)
    } catch (cause) {
      throw unknownError(cause, 'constructor')
    }
  }

  /**
   * Applies gossiped Insertions and Acknowledgements.
   *
   * @param gossip Batch of Insertion and Acknowledgement tuples.
   * @returns Visible changes and optional acknowledgement Gossip, or
   * `undefined` for invalid input. Earlier entries may already have been applied.
   * @throws {@link SequencerError} with code `PROJECTION_DESTROYED` after destruction.
   */
  apply(gossip: unknown): Result<T> | undefined {
    try {
      return apply(this.id, gossip)
    } catch (cause) {
      throw unknownError(cause, 'apply')
    }
  }

  /**
   * Inserts values at a Projection position.
   *
   * @param values Nonempty array of values to insert.
   * @param at Insertion position in `0..length()`, inclusive. In tuple mode, the first stable index to write; each value creates a competing version.
   * @returns Gossip describing the insertion.
   * @throws {@link SequencerError} with code `PROJECTION_DESTROYED` after destruction.
   */
  insert(values: Array<T>, at: number): Gossip<T> {
    try {
      return insert(this.id, values, at) as Gossip<T>
    } catch (cause) {
      throw unknownError(cause, 'insert')
    }
  }

  /**
   * Returns the length, A.K.A. amount of entries of this projection.
   *
   * @returns Current Projection length. Tuples retain their fixed length or highest written boundary, including empty registers.
   * @throws {@link SequencerError} with code `PROJECTION_DESTROYED` after destruction.
   */
  length(): number {
    try {
      return length(this.id)
    } catch (cause) {
      throw unknownError(cause, 'length')
    }
  }

  /**
   * Applies relevant acknowledgements and nonduplicate insertions from a replica of the sequence.
   *
   * @param sequence Sequence to merge.
   * @returns Visible changes and optional acknowledgement Gossip, or
   * `undefined` if the Sequence has an invalid runtime shape.
   * @throws {@link SequencerError} with code `PROJECTION_DESTROYED` after destruction.
   */
  merge(sequence: unknown): Result<T> | undefined {
    try {
      return call(Operation.Merge, this.id, sequence)
    } catch (cause) {
      throw unknownError(cause, 'merge')
    }
  }

  /**
   * Removes an inclusive range of Projection positions.
   *
   * @param startAt First position to remove; defaults to 0.
   * @param endWith Last position to remove; defaults to `length() - 1`.
   * @returns Reducing Insertions and their acknowledgement as Gossip. Tuple removal targets all known active versions without shifting indices.
   * @throws {@link SequencerError} if destroyed or the native runtime reports an operation failure.
   */
  remove(startAt?: number, endWith?: number): Gossip<T> {
    try {
      return call(Operation.Remove, this.id, startAt, endWith)
    } catch (cause) {
      throw unknownError(cause, 'remove')
    }
  }

  /**
   * Replaces an inclusive range of Projection positions.
   *
   * @param withValues Replacement values; an empty array only removes the range.
   * @param startAt First position to replace; defaults to 0.
   * @param endWith Last position to replace; defaults to `length() - 1`.
   * @returns Removal and insertion Gossip, in that order. Tuple replacement removes known versions and writes consecutive stable indices.
   * @throws {@link SequencerError} if destroyed or the native runtime reports an operation failure.
   */
  replace(withValues: Array<T>, startAt?: number, endWith?: number): Gossip<T> {
    try {
      return call(Operation.Replace, this.id, withValues, startAt, endWith)
    } catch (cause) {
      throw unknownError(cause, 'replace')
    }
  }

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
  retire(actorID: number): void {
    try {
      return call(Operation.Retire, this.id, actorID)
    } catch (cause) {
      throw unknownError(cause, 'retire')
    }
  }

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
  sequence<StringEncoded extends boolean = false>(
    stringEncode?: StringEncoded
  ): Sequence<T, StringEncoded> {
    try {
      return sequence(this.id, stringEncode)
    } catch (cause) {
      throw unknownError(cause, 'sequence')
    }
  }

  /**
   * Returns the value at a Projection position.
   *
   * @param at Valid visible position in `0..length() - 1`.
   * @returns The corresponding Footage value.
   * @throws {@link SequencerError} with code `PROJECTION_DESTROYED` after destruction.
   */
  value(at: number): T | undefined {
    try {
      return value(this.id, at)
    } catch (cause) {
      throw unknownError(cause, 'value')
    }
  }

  /**
   * Returns values from an inclusive range of Projection positions.
   *
   * @param startAt First included position; defaults to 0.
   * @param endWith Last included position; defaults to `length() - 1`.
   * @returns A new array of values, or an empty array for an empty range.
   * @throws {@link SequencerError} if destroyed or the native runtime reports an operation failure.
   */
  values(startAt?: number, endWith?: number): Array<T> {
    try {
      return values(this.id, startAt, endWith)
    } catch (cause) {
      throw unknownError(cause, 'values')
    }
  }

  /** Destroys the Projection. Repeated calls have no effect. */
  destroy(): void {
    try {
      if (this.id < 0) return
      destroy(this, this.id)
      this.id = -1
    } catch (cause) {
      throw unknownError(cause, 'destroy')
    }
  }
}

export type * from './types/type.js'
export { SequencerError, type SequencerErrorCode } from './errors/class.js'
