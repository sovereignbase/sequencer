import type {
  CRListChange,
  CRListDelta,
  CRListState,
  CRListStateEntry,
} from '../../.types/type.js'
import { attachEntryToIndexes } from '../attachEntryToIndexes/index.js'
import { writeEntryChange } from '../writeEntryChange/index.js'

/**
 * Installs the first live RLE entry in an empty replica.
 */
export function attachEntryToEmptyReplica<T>(
  crListReplica: CRListState<T>,
  entry: NonNullable<CRListStateEntry<T>>,
  change: CRListChange<T>,
  delta: CRListDelta<T>
): void {
  entry.index = 0
  crListReplica.cursor = entry
  crListReplica.cursorIndex = 0
  void attachEntryToIndexes<T>(crListReplica, entry, delta)
  void crListReplica.cache.set(0, entry)
  void writeEntryChange<T>(change, entry)
  crListReplica.size = crListReplica.parentMap.size
}
