/**
 * Public data contracts shared by the TypeScript algorithms and WebAssembly
 * adapter.
 *
 * @module
 */

/**
 * Independently maintained runtime state of one replicated sequence.
 *
 * A Replica owns its JavaScript Footage and references one native Projector.
 * Replicas that integrate the same Strips converge on the same Projection
 * independently of Delta arrival order.
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

/**
 * Serializable representation of one contiguous Frame Span.
 *
 * A visible Strip contributes its Frames to the Projection. A Mask remains in
 * retained Sequence order while contributing no visible Frames. Footage may be
 * omitted only when a Mask's consumer-owned values have already been released.
 * Pending state exists exclusively inside the runtime Projector and is never
 * serialized as part of a Strip.
 *
 * @typeParam T Consumer-owned value represented by one Frame.
 */
export type Strip<T> = [
  meta: [
    /** Zero for visible Strips; nonzero Mask states retain source-fragment boundaries. */
    is_masked: number,

    /** Whether `previous` is interpreted from right to left instead of left to right. */
    is_inverse: number,

    /** Positive number of consecutive Frames represented by this Strip. */
    frame_count: number,

    /** Cryptographically random discriminator separating otherwise equal Realms. */
    this_crypto_random_bits: number,

    /**
     * Lower Unix-time bits shared by the issuing Realm.
     *
     * Combined with the Realm's random discriminator to distribute collision
     * probability across time.
     */
    this_unix_lower_bits: number,

    /** Counter of this Frame within the issuing Realm. */
    this_counter_bits: number,

    /** Cryptographically random discriminator of the referenced previous Realm. */
    previous_crypto_random_bits: number,

    /**
     * Lower Unix-time bits shared by the referenced previous Realm.
     *
     * Combined with its random discriminator to distribute collision probability
     * across time.
     */
    previous_unix_lower_bits: number,

    /** Counter of the referenced previous Frame within its issuing Realm. */
    previous_counter_bits: number,
  ],

  /** Contiguous Footage corresponding to the represented Frame Span. */
  footage?: T[],
]

/**
 * Runtime Strip representation extended with the Footage position of its first
 * represented Frame.
 */
export type VirtualStrip<T> = [...Strip<T>[0], footage_frame_index?: number]

/**
 * Minimal consumer-facing Projection patch keyed by zero-based Frame index.
 *
 * `undefined` removes the value currently observed at an index. Any other entry
 * inserts or replaces the value at that index.
 *
 * @typeParam T Consumer-owned sequence value.
 */
export type Change<T> = Record<number, T | undefined>

/**
 * Serializable collection of Strips used to store or exchange Sequence
 * material.
 *
 * A Delta may contain only material produced by one local change or every
 * retained Strip. Completeness is determined by the operation producing the
 * Delta rather than by its representation.
 *
 * @typeParam T Consumer-owned value represented by one Frame.
 */
export type Delta<T> = Array<Strip<T>>

/**
 * Realm-indexed acknowledgement boundaries reported by one Replica.
 *
 * Each entry identifies the greatest materialized Strip start locally indexed
 * for one represented Realm. Garbage collection selects the least corresponding
 * point acknowledged across all participating Replica Frontiers.
 *
 * Entry order is insignificant. A Realm absent from any required Frontier does
 * not have a safe collection boundary.
 */
export type Acknowledgement = Array<
  [
    /** Cryptographically random discriminator identifying the acknowledged Realm. */
    frontier_crypto_random_bits: number,

    /** Lower Unix-time bits shared by the acknowledged Realm. */
    frontier_unix_lower_bits: number,

    /** Counter of the acknowledged Frame within its Realm. */
    frontier_counter_bits: number,
  ]
>

/**
 * Result of a local write or delete operation.
 *
 * A successful operation returns the minimal visible Projection change together
 * with the Delta required to reproduce the operation on other Replicas.
 * `false` indicates that the operation produced no change.
 *
 * @typeParam T Consumer-owned value represented by one Frame.
 */
export type Result<T> =
  | {
      /** Minimal patch for the consumer's currently visible Projection. */
      change: Change<T>

      /** Strips produced by the operation for exchange with other Replicas. */
      delta: Delta<T>
    }
  | false
