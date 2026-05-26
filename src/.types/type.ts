/**
 * A live CRList entry stored as a doubly-linked list node.
 *
 * The `predecessor` field is the stable ordering anchor used for convergence;
 * `prev` and `next` are local projection links for indexed reads and mutations.
 */
export type CRListStateEntry<T> =
  | {
      /** Stable UUIDv7 identity for this entry. */
      id: bigint
      /** Cached string form of `id` (avoids repeated bigint.toString()). */
      idStr: string
      /** User payload stored in the list. */
      values: Array<T>
      /** Stable predecessor UUIDv7, or `'\0'` for root-level entries. */
      predecessor: bigint
      /** Current zero-based index in the local live view. */
      index: number
      /** Previous live entry in the local projection. */
      prev: CRListStateEntry<T> | undefined
      /** Next live entry in the local projection. */
      next: CRListStateEntry<T> | undefined
    }
  | undefined

export type CRListReparentedStateEntry<T> = {
  entry: NonNullable<CRListStateEntry<T>>
  oldPredecessor: bigint
}

/**
 * Mutable CRList replica state.
 *
 * `parentMap` indexes live entries by UUIDv7. `childrenMap` indexes entries by
 * predecessor to support deterministic flattening. `tombstones` records deleted
 * UUIDv7 entries until they are garbage collected through acknowledgement
 * frontiers.
 */
export type CRListState<T> = {
  /** Number of live entries in the local projection. */
  size: number
  /***/
  head: CRListStateEntry<T>
  /***/
  tail: CRListStateEntry<T>
  /** Current live entry used as the walking cursor. */
  cursor: CRListStateEntry<T>
  /** Current zero-based index of `cursor`. */
  cursorIndex: number | undefined
  /** Opportunistic live-entry cache keyed by observed zero-based index. */
  cache: Map<number, NonNullable<CRListStateEntry<T>>>
  /** Delete identities of entries retained for gossip and convergence. */
  tombstones: Set<string>
  /***/
  clock: bigint
  /** Live entries by id. */
  parentMap: Map<bigint, CRListStateEntry<T>>
  /** Live entries grouped by predecessor. */
  childrenMap: Map<bigint, Array<NonNullable<CRListStateEntry<T>>>>
}

/**
 * Value entry used by snapshots and deltas.
 *
 * `value` is a live payload reference. Consumers that mutate values outside
 * CRList operations must provide their own isolation first.
 */
export type CRListSnapshotEntry<T> = {
  /** Stable identity for this entry. */
  id: string
  /** User payload for this entry. */
  values: Array<T>
  /** Stable predecessor identity, or `'\0'` for root-level entries. */
  predecessor: string
}

/**
 * Full CRList state snapshot.
 */
export type CRListSnapshot<T> = {
  /** Live values with stable CRDT metadata. */
  values: Array<CRListSnapshotEntry<T>>
  /** Retained deleted UUIDv7 entries. */
  tombstones: Array<string>
}

/**
 * Minimal local live-view patch keyed by list index.
 *
 * `undefined` means an entry was removed at the index. Any other value means a
 * value was inserted or replaced at the index.
 */
export type CRListChange<T> = Record<number, T | undefined>

/**
 * Partial CRList state gossiped between replicas.
 *
 * Delta value payloads are live references.
 */
export type CRListDelta<T> = Partial<CRListSnapshot<T>>

/*
 * Tombstone acknowledgement frontier.
 */
export type CRListAck = string

/**
 * Maps CRList event names to their event payload shapes.
 */
export type CRListEventMap<T> = {
  /** STATE / PROJECTION */
  snapshot: CRListSnapshot<T>
  change: CRListChange<T>

  /** GOSSIP / PROTOCOL */
  delta: CRListDelta<T>
  ack: CRListAck
}

/**
 * Represents a strongly typed CRList event listener.
 */
export type CRListEventListener<T, K extends keyof CRListEventMap<T>> =
  | ((event: CustomEvent<CRListEventMap<T>[K]>) => void)
  | { handleEvent(event: CustomEvent<CRListEventMap<T>[K]>): void }

/**
 * Resolves an event name to its corresponding listener type.
 */
export type CRListEventListenerFor<
  T,
  K extends string,
> = K extends keyof CRListEventMap<T>
  ? CRListEventListener<T, K>
  : EventListenerOrEventListenerObject
