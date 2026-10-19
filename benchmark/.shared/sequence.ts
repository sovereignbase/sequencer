import type { U32List } from '../../dist/index.js'

/**
 * Counts retained roots outside measured API calls, without coordinate-array allocation.
 * @param words Trusted plain or compact snapshot metadata.
 * @returns Positive-root count as `stripCount`, and all retained canonical identities.
 * These counts describe export records, not native arena fragments or visible workload groups.
 */
export function sequenceCounts(words: U32List): {
  stripCount: number
  retainedInsertionCount: number
} {
  let stripCount = 0
  if (words.length === 0) return { stripCount, retainedInsertionCount: 0 }
  if (words[0] !== 0) {
    for (let at = words[0]; at < words.length; at += 6)
      if ((words[at + 5] | 0) > 0) ++stripCount
    return { stripCount, retainedInsertionCount: (words.length - words[0]) / 6 }
  }
  const sparse = words[2] === 0x3ffffffe
  const records = sparse ? words[3] : words[2]
  let at = words[1]
  const word = () => {
    const value = words[at++]
    return value === 0x3fffffff
      ? (words[at++] | (words[at++] << 16)) >>> 0
      : value
  }
  // Only signed-diff parity matters for positive-root counting; other explicit fields are skipped.
  for (let i = 0; i < records;) {
    const first = words[at++]
    const run = sparse && first === 0x3ffffffe
    const width = run ? word() : 1,
      repeats = run ? word() : 1
    for (let lane = 0; lane < width; ++lane) {
      const control = run ? words[at++] : first
      if (control & 1) at += 2
      if (control & 2) at += 2
      if (control & 4) word()
      if (control & 8) word()
      if (control & 16) word()
      const positive = !(control & 32) || !(word() & 1)
      if (run) for (let field = 0; field < 6; ++field) word()
      if (positive) {
        stripCount += repeats
        if (sparse) {
          const count = word()
          for (let n = 1; n < count; ++n) {
            word()
            word()
          }
        }
      }
    }
    i += width * repeats
  }
  return { stripCount, retainedInsertionCount: records }
}

/**
 * Expands trusted snapshot metadata for fixture construction and assertions.
 * @param words Plain or compact metadata emitted by the public API.
 * @returns Exact ACK lanes and six-word Insertion records; signed diffs retain uint32 bit patterns.
 * This inspection helper is not part of runtime application or the timed benchmark path.
 */
export function sequenceMetadata(words: U32List): {
  frontiers: number[][]
  insertions: number[][]
  ranges: Array<Array<readonly [start: number, count: number]>>
} {
  const frontiers: number[][] = [],
    insertions: number[][] = [],
    ranges: Array<Array<readonly [number, number]>> = []
  if (words.length === 0) return { frontiers, insertions, ranges }
  const packed = words[0] === 0
  const end = packed ? words[1] : words[0]
  const sparse = packed && words[2] === 0x3ffffffe
  let at = packed ? (sparse ? 4 : 3) : 1
  const word = () => {
    const value = words[at++]
    return value === 0x3fffffff
      ? (words[at++] | (words[at++] << 16)) >>> 0
      : value
  }
  // Session identities always use two halves, independent of scalar escape rules.
  const session = () => (words[at++] | (words[at++] << 16)) >>> 0
  while (at < end) {
    const count = words[at++]
    const frontier: number[] = []
    for (let i = 0; i < count; ++i) frontier.push(packed ? word() : words[at++])
    frontiers.push(frontier)
  }
  if (!packed) {
    for (; at < words.length; at += 6) {
      insertions.push(Array.from(words.slice(at, at + 6)))
      ranges.push((words[at + 5] | 0) > 0 ? [[0, words[at + 5]]] : [])
    }
    return { frontiers, insertions, ranges }
  }
  let previousSession = 0,
    nextStart = 1
  const coordinates = (control: number): number[] => {
    const insertionSession = control & 1 ? session() : previousSession
    const anchorSession = control & 2 ? session() : insertionSession
    const start =
      control & 4
        ? word()
        : insertionSession !== previousSession
          ? 0
          : nextStart
    const anchorStart = control & 8 ? word() : control >>> 6
    const anchorDiff = control & 16 ? word() : 1
    const zigzag = control & 32 ? word() : 2
    // Restore signed magnitude for next-start prediction, then expose unsigned wire lanes.
    const diff = ((zigzag >>> 1) ^ -(zigzag & 1)) | 0
    previousSession = insertionSession
    nextStart = (start + Math.abs(diff) + 1) >>> 0
    return [
      anchorSession,
      anchorStart,
      anchorDiff,
      insertionSession,
      start,
      diff >>> 0,
    ]
  }
  const layout = (diff: number) => {
    const frames: Array<readonly [number, number]> = []
    if (diff > 0) {
      const count = sparse ? word() : 0
      if (!count) frames.push([0, diff])
      else {
        let end = 0
        for (let n = 1; n < count; ++n) {
          const start = end + word(),
            length = word()
          frames.push([start, length])
          end = start + length
        }
      }
    }
    return frames
  }
  while (insertions.length < (sparse ? words[3] : words[2])) {
    const control = words[at++]
    const run = sparse && control === 0x3ffffffe
    const width = run ? word() : 1,
      repeats = run ? word() : 1
    const pattern = Array.from({ length: width }, () => {
      const base = coordinates(run ? words[at++] : control)
      const stride = run ? Array.from({ length: 6 }, word) : [0, 0, 0, 0, 0, 0]
      return { base, stride, frames: layout(base[5] | 0) }
    })
    for (let repeat = 0; repeat < repeats; ++repeat)
      for (const { base, stride, frames } of pattern) {
        const c = base.map(
          (value, field) => (value + Math.imul(repeat, stride[field])) >>> 0
        )
        insertions.push(c)
        ranges.push(frames)
        previousSession = c[3]
        nextStart = (c[4] + Math.abs(c[5] | 0) + 1) >>> 0
      }
  }
  return { frontiers, insertions, ranges }
}
