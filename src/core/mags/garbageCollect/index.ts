import { safeBigIntFromString } from '@sovereignbase/utils'
import { CRListAck, CRListState } from '../../../.types/type.js'

/**
 * Removes deleted item ids acknowledged by all supplied frontiers.
 *
 * @param frontiers - Acknowledgement frontiers received from peers.
 * @param replica - Replica whose deleted item ids will be collected.
 */
export function __garbageCollect<T>(
  frontiers: Array<CRListAck>,
  replica: CRListState<T>
): void {
  // Ignore malformed acknowledgement payloads without mutating tombstones.
  if (!Array.isArray(frontiers)) return

  // Store only frontiers that parse to safe bigint ids.
  const valid: Array<bigint> = []

  // Validate every supplied peer frontier.
  for (const frontier of frontiers) {
    // Frontier values are transported as decimal strings.
    if (typeof frontier !== 'string') continue

    // Parse with the shared safe bigint helper.
    const bigint = safeBigIntFromString(frontier)

    // Skip malformed ids.
    if (bigint === false) continue

    // Keep the parsed frontier for minimum-frontier calculation.
    void valid.push(bigint)
  }

  // Without at least one valid frontier, no id is known acknowledged by peers.
  if (valid.length === 0) return

  // Sort ascending so the minimum peer frontier is first.
  void valid.sort((a, b) => (a < b ? -1 : 1))

  // Only ids at or below the smallest frontier are acknowledged by every peer.
  const smallestBig = valid[0]

  // Drop whole ranges, then trim the straddling range, of ids acknowledged by
  // every supplied frontier. Ranges are sorted ascending by start.
  const ranges = replica.deletedRanges

  // Count fully acknowledged tombstone ranges from the front of the sorted list.
  let removeCount = 0
  while (removeCount < ranges.length && ranges[removeCount][1] <= smallestBig)
    removeCount++

  // Trim the first remaining range when the frontier falls inside it.
  if (removeCount < ranges.length && ranges[removeCount][0] <= smallestBig)
    ranges[removeCount][0] = smallestBig + 1n

  // Physically remove the fully acknowledged prefix of tombstone ranges.
  if (removeCount > 0) void ranges.splice(0, removeCount)
}
