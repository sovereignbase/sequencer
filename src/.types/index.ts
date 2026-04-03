/****/
export type CRListStateEntry<T> = {
  __uuidv7: string
  __value: T
  __after: string
  _index: number
  _prev: CRListStateEntry<T> | undefined
  _next: CRListStateEntry<T> | undefined
}
/****/
export type CRListState<T> = {
  _length: number
  _cursor: CRListStateEntry<T> | undefined
  _tombstones: Set<string>
  _seenIdentifiers: Record<string, CRListStateEntry<T>>
  _seenAfterValues: Record<string, CRListStateEntry<T>>
}
/****/
export type CRListSnapshotEntry<T> = {
  __uuidv7: string
  __value: T
  __after: string
}
/****/
export type CRListSnapshot<T> = {
  __values: Array<CRListSnapshotEntry<T>>
  __tombstones: Array<string>
}
/****/
export type CRListDelta<T> = Partial<CRListSnapshot<T>>
