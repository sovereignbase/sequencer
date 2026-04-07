/****/
export type DoublyLinkedListEntry<T> =
  | {
      uuidv7: string
      value: T
      predecessor: string
      /***/
      index: number
      prev: DoublyLinkedListEntry<T> | undefined
      next: DoublyLinkedListEntry<T> | undefined
    }
  | undefined
/****/
export type CRListReplica<T> = {
  size: number
  cursor: DoublyLinkedListEntry<T>
  tombstones: Set<string>
  parentMap: Map<string, DoublyLinkedListEntry<T>>
  childrenMap: Map<string, Array<NonNullable<DoublyLinkedListEntry<T>>>>
}
/****/
export type CRListSnapshotValueEntry<T> = {
  uuidv7: string
  value: T
  predecessor: string
}
/****/
export type CRListSnapshot<T> = {
  values: Array<CRListSnapshotValueEntry<T>>
  tombstones: Array<string>
}
/****/
export type CRListDelta<T> = Partial<CRListSnapshot<T>>
/****/
export type CRListChange<T> = Record<number, T>
/****/
export type CRListAck = string
/****/
//CORE
//////////////////////////////////////////////////
//////////////////////////////////////////////////
//////////////////////////////////////////////////
//CLASS

/***/

/**
 * Maps OO-Struct event names to their event payload shapes.
 */
export type CRListEventMap<T extends Record<string, unknown>> = {
  /** STATE / PROJECTION */
  snapshot: CRListSnapshot<T>
  change: CRListChange<T>

  /** GOSSIP / PROTOCOL */
  delta: CRListDelta<T>
  ack: CRListAck
}

/**
 * Represents a strongly typed OO-Struct event listener.
 */
export type CRListEventListener<
  T extends Record<string, unknown>,
  K extends keyof CRListEventMap<T>,
> =
  | ((event: CustomEvent<CRListEventMap<T>[K]>) => void)
  | { handleEvent(event: CustomEvent<CRListEventMap<T>[K]>): void }

/**
 * Resolves an event name to its corresponding listener type.
 */
export type CRListEventListenerFor<
  T extends Record<string, unknown>,
  K extends string,
> = K extends keyof CRListEventMap<T>
  ? CRListEventListener<T, K>
  : EventListenerOrEventListenerObject
