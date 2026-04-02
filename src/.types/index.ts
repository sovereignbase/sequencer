/****/
export type RGAStateEntry<T> = {
  __uuidv7: string
  __value: T
  __after: string
  _index: number | undefined
  _prev: RGAStateEntry<T> | undefined
  _next: RGAStateEntry<T> | undefined
}
/****/
export type RGAState<T> = {
  __cursor: RGAStateEntry<T> | undefined
  __tombstones: Set<string>
}
/****/
export type RGASnapshotEntry<T> = {
  __uuidv7: string
  __value: T
  __after: string
}
/****/
export type RGASnapshot<T> = {
  __values: Array<RGASnapshotEntry<T>>
  __tombstones: Array<string>
}
/****/
export type RGADelta<T> = Partial<RGASnapshot<T>>
