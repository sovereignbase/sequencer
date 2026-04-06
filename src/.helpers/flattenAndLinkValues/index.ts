import type { CRListReplica } from '../../.types/index.js'
export function flattenAndLinkValues<T>(crListReplica: CRListReplica<T>): void {
  crListReplica.size = 0
  const resolvedSiblingPredeseccors = new Set<string>()
  for (const entry of Object.values(crListReplica.parentMap)) {
    if (!entry) continue
    if (crListReplica.tombstones.has(entry.uuidv7)) {
      delete crListReplica.parentMap[entry.uuidv7]
      continue
    }
    crListReplica.cursor = entry
    const predecessorIdentifier = entry.predecessor
    const predecessor = crListReplica.parentMap[predecessorIdentifier]

    if (!predecessor || predecessorIdentifier !== predecessor.uuidv7) continue

    const rawSiblings = crListReplica.childrenMap[predecessorIdentifier]

    if (!Array.isArray(rawSiblings)) {
      delete crListReplica.childrenMap[predecessorIdentifier]
      continue
    }

    crListReplica.size++

    if (resolvedSiblingPredeseccors.has(predecessorIdentifier)) continue

    const siblings = rawSiblings
      .filter((sibling) => sibling !== undefined)
      .sort((a, b) => a.uuidv7.localeCompare(b.uuidv7))

    let prev = predecessor
    let nextIndex = 0
    for (const sibling of siblings) {
      const safeSibling = crListReplica.parentMap[sibling.uuidv7]
      if (!safeSibling) continue
      nextIndex++
      safeSibling.next = crListReplica.parentMap[siblings[nextIndex].uuidv7]
      safeSibling.prev = prev
      prev.next = safeSibling
      prev = safeSibling
    }
    resolvedSiblingPredeseccors.add(predecessorIdentifier)
  }
  if (crListReplica.cursor) crListReplica.size++
}
