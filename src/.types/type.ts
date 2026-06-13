import type {
  HLC,
  HLCTimestamp,
  Uint32UuidV7,
} from '@sovereignbase/hybrid-logical-clock'

/**
 * Mutable CRList replica state.
 *
 * `values` stores JavaScript-owned payload references. Range projection,
 * tombstones, acknowledgement, and garbage collection live in the wasm engine.
 */
export type CRListState<T> = {
  clock: HLC
  items: Array<T>
  pending: Array<{ range: CRListFrame<T>; consumerReference: number }>
}

/**
 * Block record used by snapshots and deltas.
 *
 * `items` are live payload references. Consumers that mutate items outside
 * CRList operations must provide their own isolation first.
 */
export type CRListFrame<T> = {
  /** User payload items stored in this block. */
  items: Array<T>
  /** Is the frame deleted or not. */
  deleted: 0 | 1
  /** Stable previous and this frame timestamp */
  timestamp: HLCTimestamp
}

/**
 * Full CRList state snapshot.
 */
export type CRListSnapshot<T> = Array<CRListFrame<T>>
/**
 * Minimal local live-view patch keyed by list index.
 *
 * `undefined` means an item was removed at the index. Any other value means an
 * item was inserted or replaced at the index.
 */
export type CRListChange<T> = Record<number, T | undefined>

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
  /** Full snapshot event payload. */
  snapshot: CRListSnapshot<T>
  /** Gossip frame event payload. */
  frame: CRListFrame<T>
  /** Deleted-id acknowledgement event payload. */
  ack: CRListAck
  /** Local live projection patch event payload. */
  change: CRListChange<T>
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
