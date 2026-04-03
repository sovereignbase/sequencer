import { isUuidV7, prototype, safeStructuredClone } from '@sovereignbase/utils'
import type {
  CRListSnapshot,
  CRListStateEntry,
  CRListState,
} from '../.types/index.js'
import { v7 as uuidv7 } from 'uuid'
import { CRListError } from '../.errors/class.js'

export class CRList<T> {
  private readonly state: CRListState<T> = {
    _length: 0,
    _cursor: undefined,
    _tombstones: new Set<string>(),
    _seenIdentifiers: {},
    _seenAfterValues: {},
  }
  constructor(snapshot?: CRListSnapshot<T>) {}

  /**CRUD*/

  static create() {
    return new CRList()
  }

  /**
   * Time complexity: O(d + m), worst case O(n)
   * - d = distance from cursor to target index
   * - m = amount of nodes after the deleted node whose indexes must be shifted
   * Space complexity: O(1)
   */
  delete(index: number): void {
    this.walkToIndex(index)

    const node = this.state._cursor as CRListStateEntry<T>
    const prev = node._prev
    const next = node._next

    this.state._tombstones.add(node.__uuidv7)

    if (prev) prev._next = next
    if (next) {
      next._prev = prev
      if (prev) next.__after = prev.__uuidv7
    }

    let current = next
    while (current) {
      current._index--
      current = current._next
    }

    this.state._cursor = next ?? prev

    node._prev = undefined
    node._next = undefined
  }

  /**MAGS*/

  get length(): number {
    return this.state._length
  }

  static isCRList() {}
}
