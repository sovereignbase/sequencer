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
  parentMap: Record<string, DoublyLinkedListEntry<T>>
  childrenMap: Record<string, Array<DoublyLinkedListEntry<T>>>
}
/****/
export type CRListSnapshotValueEntry<T> = {
  uuidv7: string
  value: T
  predecessor: string
}
/****/
export type CRListSnapshot<T> = {
  values: {
    parentMap: Record<string, CRListSnapshotValueEntry<T>>
    childrenMap: Record<string, Array<CRListSnapshotValueEntry<T>>>
  }
  tombstones: Array<string>
}
/****/
export type CRListDelta<T> = Partial<CRListSnapshot<T>>
