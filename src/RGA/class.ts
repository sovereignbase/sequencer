import { isUuidV7, prototype, safeStructuredClone } from '@sovereignbase/utils'
import type { RGASnapshot, RGAStateEntry, RGAState } from '../.types/index.js'
import { v7 as uuidv7 } from 'uuid'
import { RGAError } from '../.errors/class.js'

export class RGA<T> {
  private readonly seenIdentifiers: Record<string, RGAStateEntry<T>> = {}
  private readonly seenAfterValues: Record<string, RGAStateEntry<T>> = {}
  private readonly __state: RGAState<T> = {
    __cursor: undefined,
    __tombstones: new Set<string>(),
  }
  private __length: number = 0
  constructor(snapshot?: RGASnapshot<T>) {
    if (!snapshot || prototype(snapshot) !== 'record') return

    if (
      Object.hasOwn(snapshot, '__tombstones') &&
      Array.isArray(snapshot.__tombstones)
    ) {
      for (const tombstone in snapshot.__tombstones) {
        if (this.__state.__tombstones.has(tombstone) || !isUuidV7(tombstone))
          continue
        this.__state.__tombstones.add(tombstone)
      }
    }

    if (Object.hasOwn(snapshot, '__values')) {
      for (const { __uuidv7, __value, __after } of snapshot?.__values) {
        if (this.__state.__tombstones.has(__uuidv7) || !isUuidV7(__uuidv7))
          continue
        const [cloned, copiedValue] = safeStructuredClone(__value)
        if (!cloned) continue
        this.__state.__cursor = {
          __uuidv7,
          __value: copiedValue,
          __after,
          _index: this.__length,
          _next: undefined,
          _prev: undefined,
        }
        this.__length++
      }
    }
  }

  /**CRUD*/

  static create() {
    return new RGA()
  }

  /**
   * Time complexity: O(d), worst case O(n)
   * - d = distance from cursor to target index
   * Space complexity: O(1)
   */
  read(index: number): T | undefined {
    try {
      this.walkToIndex(index)
    } catch {
      return undefined
    }
    return this.__state.__cursor?.__value
  }

  /**
   * Time complexity: O(d), worst case O(n)
   * - d = distance from cursor to target index
   * Space complexity: O(1)
   */
  update(index: number, value: T, overwrite: boolean = false): void {
    const [cloned, copiedValue] = safeStructuredClone(value)

    if (!cloned) throw new RGAError('VALUE_NOT_CLONEABLE')

    const v7 = uuidv7()

    if (index === this.__length + 1) /**push*/ {
      this.walkToIndex(index--)
      const cursor = this.__state.__cursor as RGAStateEntry<T>
      const node = {
        __uuidv7: v7,
        __value: copiedValue,
        __after: cursor.__uuidv7,
        _index: index,
        _next: undefined,
        _prev: cursor,
      }
      cursor._next = node
      this.__state.__cursor = node
    } else if (overwrite) /**write index*/ {
      this.walkToIndex(index)
      this.__state.__tombstones.add(node.__uuidv7)

      if (prev) prev._next = next
      if (next) {
        next._prev = prev
        if (prev) next.__after = prev.__uuidv7
      }

      let current = next
      while (current) {
        current._index++
        current = current._next
      }

      this.__state.__cursor = next ?? prev

      node._prev = undefined
      node._next = undefined
    } else /**insert*/ {
      const insert = {
        __uuidv7: v7,
        __value: copiedValue,
        __after: node.__uuidv7,
        _index: index,
        _next: next,
        _prev: node,
      }
      node._next = insert

      if (prev) prev._next = insert
      if (next) {
        next._prev = prev
        if (prev) next.__after = v7
      }

      let current = next
      while (current) {
        current._index++
        current = current._next
      }

      this.__state.__cursor = next ?? prev

      node._prev = undefined
      node._next = undefined
    }
  }

  /**
   * Time complexity: O(d + m), worst case O(n)
   * - d = distance from cursor to target index
   * - m = amount of nodes after the deleted node whose indexes must be shifted
   * Space complexity: O(1)
   */
  delete(index: number): void {
    this.walkToIndex(index)

    const node = this.__state.__cursor as RGAStateEntry<T>
    const prev = node._prev
    const next = node._next

    this.__state.__tombstones.add(node.__uuidv7)

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

    this.__state.__cursor = next ?? prev

    node._prev = undefined
    node._next = undefined
  }

  /**MAGS*/

  /**Additional*/
  get length(): number {
    return this.__length
  }

  static isRGA() {}

  /**HELPERS*/
  private forward() {
    if (this.__state.__cursor?._next)
      this.__state.__cursor = this.__state.__cursor?._next
  }
  private backward() {
    if (this.__state.__cursor?._prev)
      this.__state.__cursor = this.__state.__cursor?._prev
  }
  private walkToIndex(index: number): void {
    if (index > this.__length) throw new Error('out of bounds')
    if (!this.__state.__cursor) throw new Error('empty')
    const direction =
      this.__state.__cursor._index > index ? 'backward' : 'forward'
    const walk = this[direction].bind(this)
    while (this.__state.__cursor._index !== index) walk()
  }
}
