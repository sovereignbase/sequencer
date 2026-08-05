/**
 * Public domain contracts shared by TypeScript algorithms and the WebAssembly
 * adapter.
 *
 * @module
 */

// Replica runtime state contract.
/**
 * Independently maintained state of one replicated sequence.
 *
 * A Replica owns its JavaScript Footage and addresses one native Projector.ss
 * Replicas that integrate the same Strips converge on the same Projection
 * independently of Reel arrival order.
 *
 * @typeParam T Consumer-owned value represented by one Frame.
 */
export type Replica<T> = {
  /** Opaque local identifier of the native Projector owned by this Replica. */
  id: number

  /**
   * Consumer-owned Footage addressed by materialized Strips.
   *
   * Released entries remain `undefined` so existing Footage frame indexes stay
   * stable. Sequencer never compacts this array implicitly.
   */
  footage: Array<T | undefined>
}

// Transferable Strip tuple contract.
/**
 * Serializable material representation of one contiguous Frame Span.
 *
 * A visible Strip contributes its Frames to the Projection. A Mask remains in
 * retained Sequence order while contributing none. Footage may be omitted only
 * when a Mask's consumer-owned values have already been released. Pending is
 * exclusively runtime Projector state and is never serialized into a Strip.
 *
 * @typeParam T Consumer-owned value represented by one Frame.
 */
export type Strip<T> = [
  meta: [
    /** Zero for visible; nonzero Mask states retain source-fragment boundaries. */
    is_masked: number,

    /** Positive number of consecutive Frames represented by the Strip. */
    frame_count: number,

    /** Lower Unix-time bits shared by the issuing Realm. */
    this_unix_lower_bits: number,

    /** Counter of this Frame within the issuing Realm. */
    this_counter_bits: number,

    /** Random discriminator separating otherwise equal Realms. */
    this_random_bits: number,

    /** Lower Unix-time bits shared by the issuing Realm. */
    previous_unix_lower_bits: number,

    /** Counter of this Frame within the issuing Realm. */
    previous_counter_bits: number,

    /** Random discriminator separating otherwise equal Realms. */
    previous_random_bits: number,
  ],

  /** Contiguous Footage corresponding to the represented Frame Span. */
  footage?: T[],
]

export type StripMeta<T> = Strip<T>[0]

// Transferable Reel collection contract.
/**
 * Serializable collection of Strips used to store or exchange sequence
 * material.
 *
 * A Reel may contain only a local change or every retained Strip. Completeness
 * is determined by the operation producing the Reel, not by its representation.
 *
 * @typeParam T Consumer-owned value represented by one Frame.
 */
export type Reel<T> = Array<Strip<T>>

// Consumer-facing Projection Change contract.
/**
 * Minimal consumer-facing state patch keyed by zero-based index.
 *
 * `undefined` removes the value currently observed at an index. Any other entry
 * inserts or replaces the value at that index.
 *
 * @typeParam T Consumer-owned sequence value.
 */
export type Change<T> = Record<number, T | undefined>

// Realm-indexed acknowledgement contract.
/**
 * Realm-indexed acknowledgement boundary reported by one Replica.
 *
 * Every entry is the greatest materialized Strip start locally indexed in one
 * represented Realm. Garbage collection selects the least corresponding point
 * acknowledged across participating Replica Frontiers. Entry order is not
 * significant; a Realm absent from any required Frontier is not a safe
 * collection boundary.
 */
export type Frontier = Array<
  [
    /** Lower Unix-time bits shared by the issuing Realm. */
    this_unix_lower_bits: number,

    /** Counter of this Frame within the issuing Realm. */
    this_counter_bits: number,

    /** Random discriminator separating otherwise equal Realms. */
    this_random_bits: number,
  ]
>
