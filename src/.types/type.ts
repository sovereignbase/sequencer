export type Uint32UuidV7 = Readonly<[number, number, number, number]>

/**
 * Mutable CRList replica state.
 *
 * `blocksById` indexes blocks by every contained item id.
 * `blocksByPreviousBlockId` indexes stable ordering buckets for deterministic
 * flattening. `deletedRanges` records deleted item ids as sorted id ranges until
 * they are garbage collected through acknowledgement frontiers.
 */
export type CRListState<T> = {
  instanceId: Uint32UuidV7
  clock: number

  ranges: CRListSnapshot<T>
  values: Array<T>
}

/**
 * Block record used by snapshots and deltas.
 *
 * `items` are live payload references. Consumers that mutate items outside
 * CRList operations must provide their own isolation first.
 */
export type CRListSnapshotRange<T> = {
  /** Stable identity for this block's first item. */
  id: Uint32UuidV7
  /** User payload items stored in this block. */
  items: Array<T> | undefined
  /** Number of entries represented by a tombstoned range. */
  length?: number
  /** Stable previous block or item id, or `'0'` for root-level blocks. */
  previousRangeId: Uint32UuidV7
}

/**
 * Full CRList state snapshot.
 */
export type CRListSnapshot<T> = Array<CRListSnapshotRange<T>>
/**
 * Minimal local live-view patch keyed by list index.
 *
 * `undefined` means an item was removed at the index. Any other value means an
 * item was inserted or replaced at the index.
 */
export type CRListChange<T> = Record<number, T | undefined>

/**
 * Partial CRList state gossiped between replicas.
 *
 * Delta item payloads are live references.
 */
export type CRListDelta<T> = CRListSnapshot<T>

/**
 * Deleted acknowledgement frontier.
 *
 * The value is the highest deleted item id the replica can prove it has seen.
 */
export type CRListAck = Uint32UuidV7

/**
 * Maps CRList event names to their event payload shapes.
 */
export type CRListEventMap<T> = {
  /** Full replica snapshot event payload. */
  snapshot: CRListSnapshot<T>
  /** Local live projection patch event payload. */
  change: CRListChange<T>

  /** Gossip delta event payload. */
  delta: CRListDelta<T>
  /** Deleted-id acknowledgement event payload. */
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
