/**
 * A live CRList block stored as a local projection node.
 *
 * A block is an internal batching unit. User-facing operations target items,
 * and each item inside the block has a virtual id derived from `id + offset`.
 * `previousBlockId` is the stable CRDT ordering anchor; `previousBlock` and
 * `nextBlock` are local projection links.
 */
export type CRListStateBlock<T> =
  | {
      /** Stable UUIDv7 identity for this block. */
      id: bigint
      /** User payload items stored in this internal block. */
      items: Array<T>
      /** Cached string form of `id` (avoids repeated bigint.toString()). */
      idString: string

      /** Next live block in the local projection. */
      nextBlock: CRListStateBlock<T> | undefined
      /** Previous live block in the local projection. */
      previousBlock: CRListStateBlock<T> | undefined
      /** Stable previous block or item id, or `0n` for root-level blocks. */
      previousBlockId: bigint
    }
  | undefined

export type CRListReparentedStateBlock<T> = {
  block: NonNullable<CRListStateBlock<T>>
  oldPreviousBlockId: bigint
}

/**
 * Mutable CRList replica state.
 *
 * `blocksById` indexes blocks by every contained item id.
 * `blocksByPreviousBlockId` indexes stable ordering buckets for deterministic
 * flattening. `deletedIds` records deleted item ids until they are garbage
 * collected through acknowledgement frontiers.
 */
export type CRListState<T> = {
  /** Number of live items in the local projection. */
  size: number
  /** Monotonic local block id clock. */
  clock: bigint

  /** First block (index 0). */
  firstBlock: CRListStateBlock<T>
  /** Current block used as the walking cursor. */
  currentBlock: CRListStateBlock<T>
  /** Last block in the local projection. */
  lastBlock: CRListStateBlock<T>

  /** Block-start index of `currentBlock` in the live projection. */
  currentBlockIndex: number | undefined

  /** Live blocks by contained item id. */
  blocksById: Map<bigint, CRListStateBlock<T>>
  /** Opportunistic block-start cache keyed by observed zero-based index. */
  blocksByIndex: Map<number, NonNullable<CRListStateBlock<T>>>
  /** Live blocks grouped by previous block or item id. */
  blocksByPreviousBlockId: Map<bigint, Array<NonNullable<CRListStateBlock<T>>>>

  /** Deleted item ids retained for gossip and convergence. */
  deletedIds: Set<string>
}

/**
 * Block record used by snapshots and deltas.
 *
 * `items` are live payload references. Consumers that mutate items outside
 * CRList operations must provide their own isolation first.
 */
export type CRListSnapshotBlock<T> = {
  /** Stable identity for this block's first item. */
  id: string
  /** User payload items stored in this block. */
  items: Array<T>
  /** Stable previous block or item id, or `'0'` for root-level blocks. */
  previousBlockId: string
}

/**
 * Full CRList state snapshot.
 */
export type CRListSnapshot<T> = {
  /** Live blocks with stable CRDT metadata. */
  blocks: Array<CRListSnapshotBlock<T>>
  /** Retained deleted item ids. */
  deletedIds: Array<string>
}

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
export type CRListDelta<T> = Partial<CRListSnapshot<T>>

/*
 * Deleted acknowledgement frontier (id).
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
