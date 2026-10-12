import type { U32List } from '../../dist/index.js'

/** Structural counts for either supported snapshot layout, outside timing. */
export function sequenceCounts(words: U32List) {
  const layout = words[0] ?? 0, begin = layout & 0x7fffffff
  let positive = 0
  if (layout < 0x80000000) {
    for (let at = begin; at < words.length; at += 6)
      positive += (words[at + 5] | 0) > 0 ? 1 : 0
    return { total: (words.length - begin) / 6, positive }
  }
  const total = words[begin]
  let at = begin + 2 + words[begin + 1]
  for (let field = 0; field < 6; ++field) {
    const mode = words[at++]
    if (mode === 0) {
      if (field === 5)
        for (let row = 0; row < total; ++row)
          positive += words[at + row] > 0 && !(words[at + row] & 1) ? 1 : 0
      at += total
    } else {
      let row = 0, value = 0
      if (mode === 3) {
        value = words[at++]; ++row
        if (field === 5) positive += value > 0 && !(value & 1) ? 1 : 0
      }
      while (row < total) {
        const length = words[at++], next = words[at++]
        if (mode === 2) {
          if (field === 5) positive += next > 0 && !(next & 1) ? length : 0
        } else {
          const delta = (next >>> 1) ^ -(next & 1)
          for (let i = 0; i < length; ++i) {
            value = (value + delta) >>> 0
            if (field === 5) positive += value > 0 && !(value & 1) ? 1 : 0
          }
        }
        row += length
      }
    }
  }
  return { total, positive }
}
