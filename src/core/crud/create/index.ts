import { isUuidV7, safeStructuredClone, prototype } from '@sovereignbase/utils'
import { CRListSnapshot, CRListState } from '../../../.types/index.js'

export function create<T>(
  state: CRListState<T>,
  snapshot?: CRListSnapshot<T>
): void {
  if (!snapshot || prototype(snapshot) !== 'record') return

  if (
    Object.hasOwn(snapshot, '_tombstones') &&
    Array.isArray(snapshot.__tombstones)
  ) {
    for (const tombstone in snapshot.__tombstones) {
      if (state._tombstones.has(tombstone) || !isUuidV7(tombstone)) continue
      state._tombstones.add(tombstone)
    }
  }

  if (Object.hasOwn(snapshot, '__values')) {
    for (const { __uuidv7, __value, __after } of snapshot?.__values) {
      if (state._tombstones.has(__uuidv7) || !isUuidV7(__uuidv7)) continue
      const [cloned, copiedValue] = safeStructuredClone(__value)
      if (!cloned) continue
      state._cursor = {
        __uuidv7,
        __value: copiedValue,
        __after,
        _index: state._length,
        _next: undefined,
        _prev: undefined,
      }
      state._length++
    }
  }
}
