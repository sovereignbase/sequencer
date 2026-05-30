import type { DeletedRanges } from '../../.types/type.js'

/**
 * Tombstones stored as sorted, disjoint, non-adjacent id ranges.
 *
 * Because every block owns a contiguous, disjoint id span, a contiguous delete
 * collapses to a single range instead of one tombstone per item. Membership is a
 * binary search; recording a deletion merges into any overlapping or adjacent
 * neighbour so the range count stays proportional to the number of gaps, not the
 * number of deleted items.
 */

/** Index of the last range whose start is `<= id`, or `-1`. */
function floorIndex(ranges: DeletedRanges, id: bigint): number {
  // Binary-search lower bound.
  let lo = 0

  // Binary-search upper bound.
  let hi = ranges.length - 1

  // Default to no qualifying range.
  let result = -1

  // Narrow the range until every possible candidate has been inspected.
  while (lo <= hi) {
    // Midpoint through integer shift keeps the search in integer indexes.
    const mid = (lo + hi) >> 1

    // A start before or at id is a candidate floor.
    if (ranges[mid][0] <= id) {
      result = mid
      lo = mid + 1
    } else {
      // Starts after id cannot be floor candidates.
      hi = mid - 1
    }
  }

  // Return the highest start-at-or-before index, or -1.
  return result
}

/** Returns `true` when `id` falls inside a deleted range. */
export function isDeleted(ranges: DeletedRanges, id: bigint): boolean {
  // Find the only range that could contain the id.
  const index = floorIndex(ranges, id)

  // Membership requires a candidate range and an end at or after id.
  return index !== -1 && id <= ranges[index][1]
}

/**
 * Records `[start, end]` (inclusive) as deleted, merging neighbours.
 *
 * Adjacent or overlapping ranges are only ever merged across fully-deleted ids,
 * so a merged range never covers a live id.
 */
export function markDeletedRange(
  ranges: DeletedRanges,
  start: bigint,
  end: bigint
): void {
  // Empty or reversed ranges do not represent deleted ids.
  if (end < start) return

  // Fast path: deletes are overwhelmingly sequential, so `start` lands at or
  // after the maximum range and simply extends or appends it in O(1).
  const count = ranges.length
  if (count > 0) {
    // Inspect the highest existing range for the sequential fast path.
    const last = ranges[count - 1]

    // Sequential deletes should land at or after the last range start.
    if (start >= last[0]) {
      // Adjacent or overlapping ranges merge into the last range.
      if (start <= last[1] + 1n) {
        if (end > last[1]) last[1] = end
      } else {
        // Disjoint range after the current maximum can be appended.
        void ranges.push([start, end])
      }
      return
    }
  }

  // First range that overlaps or is adjacent to the right of `start`.
  let lo = 0
  let hi = ranges.length

  // Locate the first range whose end is not strictly before start - 1.
  while (lo < hi) {
    const mid = (lo + hi) >> 1
    if (ranges[mid][1] + 1n < start) lo = mid + 1
    else hi = mid
  }

  // Seed the merged span with the requested deleted range.
  let mergedStart = start
  let mergedEnd = end

  // Walk all overlapping or adjacent ranges and absorb them into the span.
  let last = lo
  while (last < ranges.length && ranges[last][0] <= end + 1n) {
    if (ranges[last][0] < mergedStart) mergedStart = ranges[last][0]
    if (ranges[last][1] > mergedEnd) mergedEnd = ranges[last][1]
    last++
  }

  // Replace the absorbed range window with the single merged range.
  void ranges.splice(lo, last - lo, [mergedStart, mergedEnd])
}
