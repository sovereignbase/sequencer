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
