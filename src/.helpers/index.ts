import type { CRListStateEntry } from '../.types/index.ts'

const walker = {
  forward<T>(cursor: CRListStateEntry<T>) {
    if (cursor?._next) cursor = cursor?._next
  },
  backward<T>(cursor: CRListStateEntry<T>) {
    if (cursor?._prev) cursor = cursor?._prev
  },
}
export function walkToIndex<T>(
  cursor: CRListStateEntry<T>,
  maxLength: number,
  targetIndex: number
): void {
  if (targetIndex > maxLength) throw new Error('out of bounds')
  if (!cursor) throw new Error('empty')
  const direction = cursor._index > targetIndex ? 'backward' : 'forward'
  const walk = walker[direction]
  while (cursor._index !== targetIndex) walk<T>(cursor)
}
