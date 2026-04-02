import { isUuidV7, prototype, safeStructuredClone } from '@sovereignbase/utils'
import { RGASnapshot, RGASnapshotEntry } from '../.types/index.js'
export class RGA<T> {
  private readonly __tombstones: Set<string>
  private readonly __indexed: Record<string, number>
  private readonly __ordered: Record<number, RGASnapshotEntry<T>>
  private __head: RGASnapshotEntry<T> | undefined
  private __length: number
  constructor(snapshot?: RGASnapshot<T>) {
    this.__tombstones = new Set()
    this.__indexed = {}
    this.__ordered = {}
    this.__length = 0
    this.__head = undefined

    if (!snapshot || prototype(snapshot) !== 'record') return

    if (Object.hasOwn(snapshot, '__tombstones')) {
      for (const tombstone in snapshot.__tombstones) {
        if (this.__tombstones.has(tombstone) || !isUuidV7(tombstone)) continue
        this.__tombstones.add(tombstone)
      }
    }

    if (Object.hasOwn(snapshot, '__values')) {
      for (const { __uuidv7, __value, __after } of snapshot?.__values) {
        if (this.__tombstones.has(__uuidv7) || !isUuidV7(__uuidv7)) continue
        const [cloned, copiedValue] = safeStructuredClone(__value)
        if (!cloned) continue
        const entry = {
          __uuidv7,
          __value: copiedValue,
          __after,
        }
        this.__length++

        if (this.__head) {
        } else {
          this.__head = entry
          this.__indexed[__uuidv7] = this.__length
          this.__ordered[this.__length] = entry
        }
      }
    }
  }
}
