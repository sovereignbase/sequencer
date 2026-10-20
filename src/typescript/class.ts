import type { Gossip, Result, Sequence } from './types/type.js'
import { runtime } from './runtime/client.js'
import { Operation } from './runtime/protocol.js'
import { SequencerError } from './errors/class.js'

/** Visible Projection of a replicated Sequence. */
export class Projection<T> {
  /** Native instance handle; a negative value marks explicit destruction. */
  private id: number

  /**
   * Prepares to sequence a projection, optionally hydrating from a trusted sequence stored by the application.
   *
   * @param actorID Actor identifier used in acknowledgements.
   * @param trustedSequence Optional trusted Sequence in Structural Order; string Footage is split into UTF-16 code units.
   * @throws {@link SequencerError} if native initialization fails.
   */
  constructor(
    public readonly actorID: number,
    trustedSequence?: unknown
  ) {
    try {
      this.id = runtime.create(this, actorID, trustedSequence)
    } catch (cause) {
      throw cause instanceof SequencerError
        ? cause
        : new SequencerError(
            'UNKNOWN_ERROR',
            'Projection.constructor() failed.',
            { cause }
          )
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
      return runtime.apply(this.id, gossip)
    } catch (cause) {
      throw cause instanceof SequencerError
        ? cause
        : new SequencerError('UNKNOWN_ERROR', 'Projection.apply() failed.', {
            cause,
          })
    }
  }

  /**
   * Inserts values at a Projection position.
   *
   * @param values Nonempty array of values to insert.
   * @param at Insertion position in `0..length()`, inclusive.
   * @returns Gossip describing the insertion.
   * @throws {@link SequencerError} with code `PROJECTION_DESTROYED` after destruction.
   */
  insert(values: Array<T>, at: number): Gossip<T> {
    try {
      return runtime.insert(this.id, values, at) as Gossip<T>
    } catch (cause) {
      throw cause instanceof SequencerError
        ? cause
        : new SequencerError('UNKNOWN_ERROR', 'Projection.insert() failed.', {
            cause,
          })
    }
  }

  /**
   * Returns the length, A.K.A. amount of entries of this projection.
   *
   * @returns Current Projection length.
   * @throws {@link SequencerError} with code `PROJECTION_DESTROYED` after destruction.
   */
  length(): number {
    try {
      return runtime.length(this.id)
    } catch (cause) {
      throw cause instanceof SequencerError
        ? cause
        : new SequencerError('UNKNOWN_ERROR', 'Projection.length() failed.', {
            cause,
          })
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
      return runtime.call(Operation.Merge, this.id, sequence)
    } catch (cause) {
      throw cause instanceof SequencerError
        ? cause
        : new SequencerError('UNKNOWN_ERROR', 'Projection.merge() failed.', {
            cause,
          })
    }
  }

  /**
   * Removes an inclusive range of Projection positions.
   *
   * @param startAt First position to remove; defaults to 0.
   * @param endWith Last position to remove; defaults to `length() - 1`.
   * @returns Reducing Insertions and their acknowledgement as Gossip.
   * @throws {@link SequencerError} if destroyed or the native runtime reports an operation failure.
   */
  remove(startAt?: number, endWith?: number): Gossip<T> {
    try {
      return runtime.call(Operation.Remove, this.id, startAt, endWith)
    } catch (cause) {
      throw cause instanceof SequencerError
        ? cause
        : new SequencerError('UNKNOWN_ERROR', 'Projection.remove() failed.', {
            cause,
          })
    }
  }

  /**
   * Replaces an inclusive range of Projection positions.
   *
   * @param withValues Replacement values; an empty array only removes the range.
   * @param startAt First position to replace; defaults to 0.
   * @param endWith Last position to replace; defaults to `length() - 1`.
   * @returns Removal and insertion Gossip, in that order.
   * @throws {@link SequencerError} if destroyed or the native runtime reports an operation failure.
   */
  replace(withValues: Array<T>, startAt?: number, endWith?: number): Gossip<T> {
    try {
      return runtime.call(
        Operation.Replace,
        this.id,
        withValues,
        startAt,
        endWith
      )
    } catch (cause) {
      throw cause instanceof SequencerError
        ? cause
        : new SequencerError('UNKNOWN_ERROR', 'Projection.replace() failed.', {
            cause,
          })
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
      return runtime.call(Operation.Retire, this.id, actorID)
    } catch (cause) {
      throw cause instanceof SequencerError
        ? cause
        : new SequencerError('UNKNOWN_ERROR', 'Projection.retire() failed.', {
            cause,
          })
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
      return runtime.sequence(this.id, stringEncode)
    } catch (cause) {
      throw cause instanceof SequencerError
        ? cause
        : new SequencerError('UNKNOWN_ERROR', 'Projection.sequence() failed.', {
            cause,
          })
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
      return runtime.value(this.id, at)
    } catch (cause) {
      throw cause instanceof SequencerError
        ? cause
        : new SequencerError('UNKNOWN_ERROR', 'Projection.value() failed.', {
            cause,
          })
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
      return runtime.call(Operation.Values, this.id, startAt, endWith)
    } catch (cause) {
      throw cause instanceof SequencerError
        ? cause
        : new SequencerError('UNKNOWN_ERROR', 'Projection.values() failed.', {
            cause,
          })
    }
  }

  /** Destroys the Projection. Repeated calls have no effect. */
  destroy(): void {
    try {
      if (this.id < 0) return
      runtime.destroy(this, this.id)
      this.id = -1
    } catch (cause) {
      throw cause instanceof SequencerError
        ? cause
        : new SequencerError('UNKNOWN_ERROR', 'Projection.destroy() failed.', {
            cause,
          })
    }
  }
}

export type * from './types/type.js'
export { SequencerError, type SequencerErrorCode } from './errors/class.js'
