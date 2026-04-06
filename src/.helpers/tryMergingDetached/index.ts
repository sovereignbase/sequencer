import type { CRListReplica } from '../../.types/index.js'
import { tryToMergeEntry } from '../index.js'

export function tryMergingDetached<T>(crListReplica: CRListReplica<T>) {
  const detachedSizeAfterLinear = crListReplica.detachedEntries.size
  for (let i = 0; i < detachedSizeAfterLinear; i++) {
    crListReplica.detachedEntries.forEach((entry) => {
      crListReplica.detachedEntries.delete(entry)
      tryToMergeEntry(crListReplica, entry)
    })
    if (crListReplica.detachedEntries.size <= 0) break
  }
}
