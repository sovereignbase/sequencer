import type { U32List } from '../../dist/index.js'

/** Count retained identities without retaining decoded coordinate arrays. */
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
  let at = words[1]
  const word = () => {
    const value = words[at++]
    return value === 0x3fffffff
      ? (words[at++] | (words[at++] << 16)) >>> 0
      : value
  }
  for (let i = 0; i < words[2]; ++i) {
    const control = words[at++]
    if (control & 1) at += 2
    if (control & 2) at += 2
    if (control & 4) word()
    if (control & 8) word()
    if (control & 16) word()
    if (!(control & 32) || !(word() & 1)) ++stripCount
  }
  return { stripCount, retainedInsertionCount: words[2] }
}

/** Inspect snapshot metadata outside timed public API calls. */
export function sequenceMetadata(words: U32List): {
  frontiers: number[][]
  insertions: number[][]
} {
  const frontiers: number[][] = [],
    insertions: number[][] = []
  if (words.length === 0) return { frontiers, insertions }
  const packed = words[0] === 0
  const end = packed ? words[1] : words[0]
  let at = packed ? 3 : 1
  const word = () => {
    const value = words[at++]
    return value === 0x3fffffff
      ? (words[at++] | (words[at++] << 16)) >>> 0
      : value
  }
  const session = () => (words[at++] | (words[at++] << 16)) >>> 0
  while (at < end) {
    const count = words[at++]
    const frontier: number[] = []
    for (let i = 0; i < count; ++i) frontier.push(packed ? word() : words[at++])
    frontiers.push(frontier)
  }
  if (!packed) {
    for (; at < words.length; at += 6)
      insertions.push(Array.from(words.slice(at, at + 6)))
    return { frontiers, insertions }
  }
  let previousSession = 0,
    nextStart = 1
  for (let i = 0; i < words[2]; ++i) {
    const control = words[at++]
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
    const diff = ((zigzag >>> 1) ^ -(zigzag & 1)) | 0
    insertions.push([
      anchorSession,
      anchorStart,
      anchorDiff,
      insertionSession,
      start,
      diff >>> 0,
    ])
    previousSession = insertionSession
    nextStart = (start + Math.abs(diff) + 1) >>> 0
  }
  return { frontiers, insertions }
}
