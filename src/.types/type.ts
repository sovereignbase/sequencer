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

      /** Next block in the local projection. */
      nextBlock: CRListStateBlock<T> | undefined
      /** Previous block in the local projection. */
      previousBlock: CRListStateBlock<T> | undefined
      /** Stable previous block or item id, or `0n` for root-level blocks. */
      previousBlockId: bigint
    }
  | undefined

/**
 * Tracks a live block whose stable parent changed during merge processing.
 *
 * The old parent id is retained so splice fast paths can prove that the local
 * linked projection still matches the expected pre-merge shape.
 */
export type CRListReparentedStateBlock<T> = {
  /** Live block that was reparented. */
  block: NonNullable<CRListStateBlock<T>>
  /** Stable previousBlock id before the reparent operation. */
  oldPreviousBlockId: bigint
}

/**
 * Tombstones stored as sorted, disjoint, non-adjacent inclusive id ranges.
 *
 * Each entry is an inclusive `[startId, endId]` span of deleted item ids. A
 * contiguous delete collapses to a single range instead of one tombstone per
 * item.
 */
export type DeletedRanges = Array<[bigint, bigint]>

/**
 * Mutable CRList replica state.
 *
 * `blocksById` indexes blocks by every contained item id.
 * `blocksByPreviousBlockId` indexes stable ordering buckets for deterministic
 * flattening. `deletedRanges` records deleted item ids as sorted id ranges until
 * they are garbage collected through acknowledgement frontiers.
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

  /** Deleted item ids retained for gossip and convergence, as sorted id ranges. */
  deletedRanges: DeletedRanges
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
 * A run of deleted item ids on the wire: `[startId, length]` covers the ids
 * `startId .. startId + length - 1`.
 */
export type CRListDeletedRun = [string, number]

/**
 * Full CRList state snapshot.
 */
export type CRListSnapshot<T> = {
  /** Live blocks with stable CRDT metadata. */
  blocks: Array<CRListSnapshotBlock<T>>
  /** Retained deleted item ids, as contiguous runs. */
  deletedRuns: Array<CRListDeletedRun>
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

/**
 * Deleted acknowledgement frontier.
 *
 * The value is the highest deleted item id the replica can prove it has seen.
 */
export type CRListAck = string

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
