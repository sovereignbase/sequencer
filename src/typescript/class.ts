import type { Gossip, Result, Sequence } from './types/type.js'
import { runtime } from './runtime/client.js'
import { Operation } from './runtime/protocol.js'

/** Visible Projection of a replicated Sequence. */
export class Projection<T> {
  /** Native instance handle; a negative value marks explicit destruction. */
  private id: number

  /**
   * Prepares to sequence a projection, optionally hydrating from a trusted sequence stored by the application.
   *
   * @param actorID Actor identifier used in acknowledgements.
   * @param trustedSequence Optional trusted Sequence in Structural Order, stored by the application.
   */
  constructor(
    public readonly actorID: number,
    trustedSequence?: unknown
  ) {
    this.id = runtime.create(this, actorID, trustedSequence)
  }

  /**
   * Applies gossiped Insertions and Acknowledgements.
   *
   * @param gossip Batch of Insertion and Acknowledgement tuples.
   * @returns Visible changes and optional acknowledgement Gossip, or
   * `undefined` for invalid input. Earlier entries may already have been applied.
   */
  apply(gossip: unknown): Result<T> | undefined {
    return runtime.apply(this.id, gossip)
  }

  /**
   * Inserts values at a Projection position.
   *
   * @param values Nonempty array of values to insert.
   * @param at Insertion position in `0..length()`, inclusive.
   * @returns Gossip describing the insertion.
   */
  insert(values: Array<T>, at: number): Gossip<T> {
    return runtime.insert(this.id, values, at) as Gossip<T>
  }

  /**
   * Returns the length, A.K.A. amount of entries of this projection.
   *
   * @returns Current Projection length.
   */
  length(): number {
    return runtime.length(this.id)
  }

  /**
   * Applies relevant acknowledgements and nonduplicate insertions from a replica of the sequence.
   *
   * @param sequence Sequence to merge.
   * @returns Visible changes and optional acknowledgement Gossip, or
   * `undefined` if the Sequence has an invalid runtime shape.
   */
  merge(sequence: unknown): Result<T> | undefined {
    return runtime.call(Operation.Merge, this.id, sequence)
  }

  /**
   * Removes an inclusive range of Projection positions.
   *
   * @param startAt First position to remove; defaults to 0.
   * @param endWith Last position to remove; defaults to `length() - 1`.
   * @returns Reducing Insertions and their acknowledgement as Gossip.
   */
  remove(startAt?: number, endWith?: number): Gossip<T> {
    return runtime.call(Operation.Remove, this.id, startAt, endWith)
  }

  /**
   * Replaces an inclusive range of Projection positions.
   *
   * @param withValues Replacement values; an empty array only removes the range.
   * @param startAt First position to replace; defaults to 0.
   * @param endWith Last position to replace; defaults to `length() - 1`.
   * @returns Removal and insertion Gossip, in that order.
   */
  replace(withValues: Array<T>, startAt?: number, endWith?: number): Gossip<T> {
    return runtime.call(
      Operation.Replace,
      this.id,
      withValues,
      startAt,
      endWith
    )
  }

  /**
   * Retires an Actor from future compaction requirements.
   *
   * @remarks
   * The application is responsible for deciding which Actors are retired and
   * for propagating that decision to the relevant replicas.
   *
   * @param actorID Actor whose Acknowledgements are no longer required for compaction.
   */
  retire(actorID: number): void {
    return runtime.call(Operation.Retire, this.id, actorID)
  }

  /**
   * Sequences state into a compact serializable format.
   *
   * @returns A Sequence with acknowledged removals compacted in the exported state.
   */
  sequence(): Sequence<T> {
    return runtime.call(Operation.Sequence, this.id)
  }

  /**
   * Returns the value at a Projection position.
   *
   * @param at Valid visible position in `0..length() - 1`.
   * @returns The corresponding Footage value.
   */
  value(at: number): T | undefined {
    return runtime.value(this.id, at)
  }

  /**
   * Returns values from an inclusive range of Projection positions.
   *
   * @param startAt First included position; defaults to 0.
   * @param endWith Last included position; defaults to `length() - 1`.
   * @returns A new array of values, or an empty array for an empty range.
   */
  values(startAt?: number, endWith?: number): Array<T> {
    return runtime.call(Operation.Values, this.id, startAt, endWith)
  }

  /** Destroys the Projection. Repeated calls have no effect. */
  destroy(): void {
    if (this.id < 0) return
    runtime.destroy(this, this.id)
    this.id = -1
  }
}

export type * from './types/type.js'
