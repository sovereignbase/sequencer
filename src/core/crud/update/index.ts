/**
 * Time complexity: O(d), worst case O(n)
 * - d = distance from cursor to target index
 * Space complexity: O(1)
 */
export function update(
  index: number,
  value: T,
  overwrite: boolean = false
): void {
  const [cloned, copiedValue] = safeStructuredClone(value)

  if (!cloned) throw new CRListError('VALUE_NOT_CLONEABLE')

  const v7 = uuidv7()

  if (index === this.state._length + 1) /**push*/ {
    this.walkToIndex(index--)
    const cursor = this.state._cursor as CRListStateEntry<T>
    const node = {
      __uuidv7: v7,
      __value: copiedValue,
      __after: cursor.__uuidv7,
      _index: index,
      _next: undefined,
      _prev: cursor,
    }
    cursor._next = node
    this.state._cursor = node
  } else if (overwrite) /**write index*/ {
    this.walkToIndex(index)
    this.state._tombstones.add(node.__uuidv7)

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

    this.state._cursor = next ?? prev

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

    this.state._cursor = next ?? prev

    node._prev = undefined
    node._next = undefined
  }
}
