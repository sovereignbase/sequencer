import type { CRListReplica } from '../../.types/index.js'
export function flattenAndLinkValues<T>(crListReplica: CRListReplica<T>): void {
  crListReplica.size = 0
  for (const entry of Object.values(crListReplica.parentMap)) {
    if (!entry) continue
    const predecessorIdentifier = entry.predecessor
    const predecessor = crListReplica.parentMap[predecessorIdentifier]

    if (!predecessor || predecessorIdentifier !== predecessor.uuidv7) continue

    const rawSiblings = crListReplica.childrenMap[predecessorIdentifier]

    if (!Array.isArray(rawSiblings)) {
      delete crListReplica.childrenMap[predecessorIdentifier]
      continue
    }

    crListReplica.size++

    const siblings = rawSiblings
      .filter((sibling) => sibling !== undefined)
      .sort((a, b) => a.uuidv7.localeCompare(b.uuidv7))

    let prev = predecessor
    let nextIndex = 0
    for (const sibling of siblings) {
      nextIndex++
      sibling.next = siblings[nextIndex]
      sibling.prev = prev
      prev.next = sibling
      prev = sibling
    }
    crListReplica.cursor = prev
  }
}
