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
 * A Replica owns its JavaScript Footage and addresses one native Projector.
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

//MINIMIZE COPYING
//CREATE ONE METADATA OBJECCT WITH STRIPS BEING [meta, footage] //GIVE ITS POINTER TO WASM API, ONLY COPY THE VALUES AT WASM ABI AND ONLY COPY FOOTAGE TO REPLICA

// Stable Sequence Point tuple contract.
/**
 * Immutable identity of either the Root or one stable Frame in sequence space.
 *
 * The tuple contains three unsigned 32-bit lanes:
 *
 * 1. the lower Unix-time bits shared by one Realm;
 * 2. the Realm-local Frame counter;
 * 3. the random Realm discriminator.
 *
 * A Strip reserves one consecutive counter value per Frame. Consequently, its
 * first point and Frame count define the complete Frame Span. `[0, 0, 0]` is
 * the reserved Root and belongs to no Realm.
 */
export type SequencePoint = readonly [
  /** Lower Unix-time bits shared by the issuing Realm. */
  unix_lower_bits: number,

  /** Counter of this Frame within the issuing Realm. */
  counter_bits: number,

  /** Random discriminator separating otherwise equal Realms. */
  random_bits: number,
]

// Stable Strip placement contract.
/**
 * Stable placement relationship carried by one Strip.
 *
 * `previous_strip_start` supplies the established sequence context against
 * which the Strip is placed. For a Mask it is the indexed start of the
 * containing Strip. `this_strip_start` identifies the first Frame of the
 * Strip's own Frame Span, including an existing frame-specific point for a
 * Mask. Masks issue no Sequence Points. A visible Strip placed at the
 * beginning uses the Root as its previous point; native integration orders
 * competing Root successors in descending point order and ordinary successors
 * in ascending point order.
 */
export type SequenceCoordinate = [
  /** Existing placement context, or containing indexed Strip start for a Mask. */
  previous_strip_start: SequencePoint,

  /** First newly issued visible Frame, or first existing Frame masked. */
  this_strip_start: SequencePoint,
]

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
  /** Zero for visible; nonzero Mask states retain source-fragment boundaries. */
  is_masked: 0 | 1 | 3 | 5 | 7,

  /** Positive number of consecutive Frames represented by the Strip. */
  frame_count: number,

  /** Stable placement of the Strip in Sequence order. */
  coordinate: SequenceCoordinate,

  /** Contiguous Footage corresponding to the represented Frame Span. */
  footage?: Array<T>,
]

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
export type Frontier = Array<SequencePoint>
