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
 * A visible Strip contributes its Frames to the Projection and carries an
 * equally long Footage array. A Mask remains in retained Structural Order while
 * contributing no visible Frames and carries no Footage in transfer form.
 * Pending state is represented by native linkage, not by an extra serialized
 * Strip field.
 *
 * @typeParam T Consumer-owned value represented by one Frame.
 */
export type Strip<T> = [
  meta: [
    /** Zero for a visible Strip; any nonzero value denotes a Mask. */
    is_masked: number,

    /** Zero inserts after the referenced Frame; nonzero inserts before it. */
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

    /** Counter of the first represented Frame within the issuing Realm. */
    this_counter_bits: number,

    /** Crypto-random Realm component of `previous_strip_end`. */
    previous_crypto_random_bits: number,

    /**
     * Lower Unix-time bits shared by the referenced previous Realm.
     *
     * Combined with its random discriminator to distribute collision probability
     * across time.
     */
    previous_unix_lower_bits: number,

    /** Realm-local counter of `previous_strip_end`. */
    previous_counter_bits: number,
  ],

  /** Required visible Footage; omitted from Mask commands. */
  footage?: T[],
]

/**
 * Strip Buffer representation extended with the optional local Footage Index
 * of its first represented Frame. The tenth lane is never serialized in a
 * Delta.
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
 * Each entry identifies the greatest materialized Strip start observed for one
 * Realm. Garbage collection reduces supplied matching entries to the least
 * counter.
 *
 * Entry order is insignificant. The caller must ensure that a Realm selected
 * for collection appears in every Replica Frontier required for safety.
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
