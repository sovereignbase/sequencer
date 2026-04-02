export type RGASnapshotEntry<T> = {
  __uuidv7: string
  __value: T
  __after: string
}

export type RGASnapshot<T> = {
  __values: Array<RGASnapshotEntry<T>>
  __tombstones: Array<string>
}

export type RGADelta<T> = Partial<RGASnapshot<T>>
