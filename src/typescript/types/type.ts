/**
 * Public data contracts shared by the TypeScript algorithms and WebAssembly
 * adapter.
 *
 * @module
 */

/**
 * Local runtime state of one replicated sequence, stored as `[id, footage]`.
 *
 * The native Projector owns the known Strip state, including the materialized
 * Projection and detached pending Strips. Footage holds the consumer values
 * referenced by those Strips. The Projector identifier is local to this runtime
 * and is not part of transferable Sequence state.
 *
 * Replicas integrating the same Strips derive the same Projection from their
 * SequencePoints and causality, independently of merge arrival order.
 *
 * @typeParam T Consumer-owned value represented by one Frame.
 */
export type Replica<T> = [
  /** Opaque local identifier of the native Projector owned by this Replica. */
  id: number,

  /**
   * Consumer-owned values addressed by materialized and pending insert Strips.
   *
   * Released entries remain `undefined` so existing Footage frame indexes stay
   * stable. Sequencer never compacts this array implicitly.
   */
  footage: Array<T | undefined>,
]

/**
 * Consumer-facing Projection patch keyed by zero-based visible Frame index.
 *
 * `undefined` removes the value currently observed at an index. Any other entry
 * inserts or replaces the value at that index.
 *
 * A Change describes visible effects, not Strip identities, structural links,
 * or pending state. It is not a replacement for a Delta used to merge state.
 *
 * @typeParam T Consumer-owned sequence value.
 */
export type Change<T> = Record<number, T | undefined>

/**
 * Transferable Sequence material stored as `[projection, footage]`.
 *
 * `projection` is a flat numeric encoding of Strips, not an array of visible
 * consumer values. `footage` contains the values referenced by encoded insert
 * Strips. A Delta may describe one local change or a complete retained state;
 * the tuple type alone does not establish completeness or trusted ordering.
 *
 * A trusted snapshot uses this representation to store materialized Strips in
 * Head-to-Tail order, followed by separately marked pending Strips. Structural
 * references use snapshot-local indices. Initialization restores the trusted
 * order and derived runtime state directly, without replaying operations.
 * Pending Strips enter both containment and pending tables but remain outside
 * the linked Projection until their dependencies can be resolved.
 *
 * Merge does not trust incoming order or snapshot-local split and competitor
 * links. It deduplicates known SequencePoint ranges and derives structural
 * order from each Strip's own identity and previous Strip end.
 *
 * @typeParam T Consumer-owned value represented by one Frame.
 */

export type Delta<T> = [projection: Array<number>, footage?: Array<T>]

/**
 * Flat SequencePoint triples acknowledging complete Mask Realm frontiers.
 *
 * Each triple is `[crypto_random_bits, unix_lower_bits, counter_bits]`: the
 * first two words identify a Realm and the last identifies its final frontier.
 * Triple order is insignificant.
 *
 * A Mask Realm is acknowledged only when its complete counter sequence is
 * known without gaps, beginning at zero and continuing by each Strip's length.
 * A Realm with a missing interval produces no acknowledgement.
 *
 * Compaction requires every Actor to acknowledge the same final frontier for
 * the selected Realm. The application collects those acknowledgements,
 * distributes them to every Actor, and supplies them to compaction. Removing
 * the agreed Mask chains then reconnects the surviving causal structure.
 */

export type Acknowledgement = Array<number>
