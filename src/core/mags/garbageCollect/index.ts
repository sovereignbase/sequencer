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
  if (!Array.isArray(frontiers)) return
  const valid: Array<bigint> = []

  for (const frontier of frontiers) {
    if (typeof frontier !== 'string') continue
    const bigint = safeBigIntFromString(frontier)

    if (bigint === false) continue

    void valid.push(bigint)
  }

  if (valid.length === 0) return
  void valid.sort((a, b) => (a < b ? -1 : 1))
  const smallestBig = valid[0]

  /** Drop whole ranges, then trim the straddling range, of ids acknowledged
   * by every supplied frontier. Ranges are sorted ascending by start. */
  const ranges = replica.deletedRanges
  let removeCount = 0
  while (removeCount < ranges.length && ranges[removeCount][1] <= smallestBig)
    removeCount++
  if (removeCount < ranges.length && ranges[removeCount][0] <= smallestBig)
    ranges[removeCount][0] = smallestBig + 1n
  if (removeCount > 0) void ranges.splice(0, removeCount)
}
