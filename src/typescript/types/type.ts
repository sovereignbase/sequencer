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
export type Replica<T> = [
  /** Opaque local identifier of the native Projector owned by this Replica. */
  id: number,

  /**
   * Consumer-owned Footage addressed by materialized Strips.
   *
   * Released entries remain `undefined` so existing Footage frame indexes stay
   * stable. Sequencer never compacts this array implicitly.
   */
  footage: Array<T | undefined>,
]

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

export type Delta<T> = [projection: Array<number>, footage: Array<T>]

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

// Array of sequence points
export type Acknowledgement = Array<number>
