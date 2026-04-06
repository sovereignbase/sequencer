import type {
  CRListReplica,
  DoublyLinkedListEntry,
} from '../../.types/index.js'

export function assertListIndices<T>(crListReplica: CRListReplica<T>): void {
  if (crListReplica.cursor) {
    const maybeFasterDirection =
      crListReplica.size - crListReplica.cursor.index > crListReplica.size / 2
        ? 'next'
        : 'prev'
    while (crListReplica.cursor[maybeFasterDirection]) {
      crListReplica.cursor = crListReplica.cursor[maybeFasterDirection]
    }
    let indexingCursor: DoublyLinkedListEntry<T> = crListReplica.cursor
    switch (maybeFasterDirection) {
      case 'next': {
        let listIndex: number = crListReplica.size - 1
        indexingCursor.index = listIndex
        while (indexingCursor && listIndex > 0) {
          listIndex--
          indexingCursor = indexingCursor.prev
          if (indexingCursor !== undefined) indexingCursor.index = listIndex
        }
        break
      }
      case 'prev': {
        for (let i = 0; i < crListReplica.size; i++) {
          if (indexingCursor !== undefined) {
            indexingCursor.index = i - 1
            indexingCursor = indexingCursor.next
          }
        }
        break
      }
    }
  }
}
