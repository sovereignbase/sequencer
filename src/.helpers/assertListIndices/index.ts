import type { CRListState } from '../../.types/index.js'

export function assertListIndices<T>(crListReplica: CRListState<T>): void {
  if (!crListReplica.cursor) {
    crListReplica.index?.clear()
    crListReplica.cursorIndex = undefined
    return
  }
  let index = crListReplica.size
  const entries = crListReplica.index ?? new Map()
  entries.clear()
  while (crListReplica.cursor.next)
    crListReplica.cursor = crListReplica.cursor.next

  while (index >= 1) {
    index--
    crListReplica.cursor.index = index
    entries.set(index, crListReplica.cursor)
    if (crListReplica.cursor.prev === undefined) break
    crListReplica.cursor = crListReplica.cursor.prev
  }
  crListReplica.index = entries
  crListReplica.cursorIndex = 0
}
