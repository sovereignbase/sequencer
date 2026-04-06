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
  detachedEntries: Set<DoublyLinkedListEntry<T>>
  seenUuidV7Identifiers: Set<string>
  seenPredecessorIdentifiersAndTheirEntry: Record<
    string,
    DoublyLinkedListEntry<T>
  >
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
