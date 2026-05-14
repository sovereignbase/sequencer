/**
 * A live CRList entry stored as a doubly-linked list node.
 *
 * The `predecessor` field is the stable ordering anchor used for convergence;
 * `prev` and `next` are local projection links for indexed reads and mutations.
 */
export type CRListStateEntry<T> =
  | {
      /** Stable UUIDv7 identity for this entry. */
      uuidv7: string
      /** User payload stored in the list. */
      value: T
      /** Stable predecessor UUIDv7, or `'\0'` for root-level entries. */
      predecessor: string
      /** Current zero-based index in the local live view. */
      index: number
      /** Previous live entry in the local projection. */
      prev: CRListStateEntry<T> | undefined
      /** Next live entry in the local projection. */
      next: CRListStateEntry<T> | undefined
    }
  | undefined

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
  /** Current live entry used as the walking cursor. */
  cursor: CRListStateEntry<T>
  /** Opportunistic live-entry cache keyed by observed zero-based index. */
  index?: Map<number, NonNullable<CRListStateEntry<T>>>
  /** Deleted UUIDv7 entries retained for gossip and convergence. */
  tombstones: Set<string>
  /** Live entries by UUIDv7. */
  parentMap: Map<string, CRListStateEntry<T>>
  /** Live entries grouped by stable predecessor identifier. */
  childrenMap: Map<string, Array<NonNullable<CRListStateEntry<T>>>>
}

/**
 * Serializable value entry used by snapshots and deltas.
 */
export type CRListSnapshotEntry<T> = {
  /** Stable UUIDv7 identity for this entry. */
  uuidv7: string
  /** User payload for this entry. */
  value: T
  /** Stable predecessor UUIDv7, or `'\0'` for root-level entries. */
  predecessor: string
}

/**
 * Full serializable CRList state.
 */
export type CRListSnapshot<T> = {
  /** Serializable live values. */
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
