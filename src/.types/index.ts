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
  length: number
  cursor: DoublyLinkedListEntry<T>
  tombstones: Set<string>
  seenUuidV7Identifiers: Record<string, DoublyLinkedListEntry<T>>
  seenPredecessorIdentifiers: Record<string, DoublyLinkedListEntry<T>>
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
