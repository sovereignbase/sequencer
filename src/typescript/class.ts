/**
 * Public Sequencer algorithms and domain contracts.
 *
 * @packageDocumentation
 */

import { register_replica } from './helpers/index.js'
import { create_sequence, get_footage_frame_index } from './wasm/index.js'
import type { Snapshot } from './types/type.js'

/** Visible Projection of a replicated Sequence. */
export class Projection<T> {
  private sequenceID: number = 0
  private actorID: number = 0
  private footage: Array<T> = []
  private worker: Worker

  async apply(gossip: unknown): Promise<Result<T> | undefined> {
    // Bind the algorithm to this live Projection; the type assertion does not transform the returned tuple.
    return apply.call(this, gossip) as Result<T> | undefined
  }
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
    // Hydrate the graph and initialize fresh session clocks before the instance is used.
    const [frontiers, projection, sourceFootage] = (trustedSequence ?? [
      [],
      new Uint32Array(),
      [],
    ]) as Snapshot<T>
    //Unessecary copy!!!
    this.actorID = actorID
    this.footage = sourceFootage.slice() as Array<T>
    this.sequenceID = create_sequence(
      actorID,
      frontiers,
      projection,
      this.footage.length
    )

    register_replica(this, this.sequenceID)
  }

  /**
   * Inserts values at a Projection position.
   *
   * @param values Nonempty array of values to insert.
   * @param at Insertion position in `0..length()`, inclusive.
   * @returns Gossip describing the insertion.
   */
  async insert(values: Array<T>, at: number): Promise<Gossip<T>> {
    // Return canonical replication data for the edit already applied to this Projection.
    return insert.call(this, values, at) as Gossip<T>
  }
  /**
   * Returns the length, A.K.A. amount of entries of this projection.
   *
   * @returns Current Projection length.
   */
  async length(): Promise<number> {
    // Read the maintained visible count; length does not traverse structural history.
    return this.projectionFrameCount
  }
  /**
   * Applies relevant acknowledgements and nonduplicate insertions from a replica of the sequence.
   *
   * @param sequence Sequence to merge.
   * @returns Visible changes and optional acknowledgement Gossip, or
   * `undefined` if the Sequence has an invalid runtime shape.
   */
  async merge(sequence: unknown): Promise<Result<T> | undefined> {
    // Use the validated snapshot path while retaining this instance's materialized history.
    return merge.call(this, sequence) as Result<T> | undefined
  }
  /**
   * Removes an inclusive range of Projection positions.
   *
   * @param startAt First position to remove; defaults to 0.
   * @param endWith Last position to remove; defaults to `length() - 1`.
   * @returns Reducing Insertions and their acknowledgement as Gossip.
   */
  async remove(startAt?: number, endWith?: number): Promise<Gossip<T>> {
    // Delegate inclusive bounds; omitted arguments receive the algorithm's whole-Projection defaults.
    return remove.call(this, startAt, endWith) as Gossip<T>
  }
  /**
   * Replaces an inclusive range of Projection positions.
   *
   * @param withValues Replacement values; an empty array only removes the range.
   * @param startAt First position to replace; defaults to 0.
   * @param endWith Last position to replace; defaults to `length() - 1`.
   * @returns Removal and insertion Gossip, in that order.
   */
  async replace(
    withValues: Array<T>,
    startAt?: number,
    endWith?: number
  ): Promise<Gossip<T>> {
    // Keep removal and insertion sequencing in one algorithm so returned Gossip preserves operation order.
    return replace.call(this, withValues, startAt, endWith) as Gossip<T>
  }
  /**
   * Retires an Actor from future compaction requirements.
   *
   * @remarks
   * This is a manual per-replica operation. The application is responsible for
   * deciding which Actors are retired and for propagating that decision to the
   * relevant replicas.
   *
   * Retiring an Actor removes its acknowledgements from the FrontierTable and
   * keeps the Actor retired for the lifetime of the current session. As a result,
   * its acknowledgements are excluded from later sequenced state and are not
   * required when compaction is performed while sequencing that state.
   *
   * For example, an Actor managing a document could rotate keys and propagate a
   * directive telling the relevant replicas which Actors to retire.
   *
   * @param actorID Number identifying the Actor whose acknowledgements are no
   * longer required for safe compaction.
   */
  async retire(actorID: number): Promise<void> {
    // Change acknowledgement membership only; retiring an Actor does not remove its authored Insertions.
    void this.frontierTable.eraseActor(actorID)
  }
  /**
   * Sequences state into a compact serializable format.
   *
   * @returns A Sequence with acknowledged removals compacted in the exported state.
   */
  async sequence(): Promise<Sequence<T>> {
    // Export compacted state without replacing this instance's live structural graph.
    return sequence.call(this) as Sequence<T>
  }
  /**
   * Returns the value at a Projection position.
   *
   * @param at Valid visible position in `0..length() - 1`.
   * @returns The corresponding Footage value.
   */
  async value(at: number): Promise<T | undefined> {
    // Read through visible-position resolution rather than indexing a structural Strip directly.
    return (
      this.footage[get_footage_frame_index(this.sequenceID, at)] ?? undefined
    )
  }
  /**
   * Returns values from an inclusive range of Projection positions.
   *
   * @param startAt First included position; defaults to 0.
   * @param endWith Last included position; defaults to `length() - 1`.
   * @returns A new array of values, or an empty array for an empty range.
   */
  async values(startAt?: number, endWith?: number): Promise<Array<T>> {
    // Materialize the inclusive visible range; underlying Footage references remain in place.
    return values.call(this, startAt, endWith) as Array<T>
  }
}

// Re-export the public domain contracts without runtime code.
export type * from './types/type.js'
