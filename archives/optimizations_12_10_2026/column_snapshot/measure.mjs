import { writeFileSync } from 'node:fs'
import { serialize } from 'node:v8'
import { gzipSync, brotliCompressSync } from 'node:zlib'
import { pathToFileURL } from 'node:url'

const { Projection } = await import(pathToFileURL(process.argv[2]).href)
const output = process.argv[3]
crypto.getRandomValues = (values) => {
  values[0] = 0x12345678
  return values
}
let seed = 0x12345678
const random = () => {
  seed ^= seed << 13
  seed ^= seed >>> 17
  seed ^= seed << 5
  return (seed >>> 0) / 0x100000000
}
const median = (values) =>
  values.slice().sort((a, b) => a - b)[values.length >> 1]
const sizes = (value) => {
  const json = Buffer.from(JSON.stringify(value))
  return {
    json: json.length,
    gzip: gzipSync(json).length,
    brotli: brotliCompressSync(json).length,
    v8: serialize(value).length,
  }
}

// Experimental lossless numeric layout; this script never changes live state.
export function pack([words, footage]) {
  if (words[0] >= 0x80000000) return [words, footage]
  const begin = words[0] ?? 0,
    count = (words.length - begin) / 6
  if (count < 32) return [words, footage]
  const dictionary = [0],
    sessions = new Map([[0, 0]])
  const columns = Array.from({ length: 6 }, () => [])
  for (let at = begin; at < words.length; at += 6) {
    for (let c = 0; c < 6; ++c) {
      let value = words[at + c]
      if (c === 0 || c === 3) {
        if (!sessions.has(value)) {
          sessions.set(value, dictionary.length)
          dictionary.push(value)
        }
        value = sessions.get(value)
      } else if (c === 5) value = ((value << 1) ^ ((value | 0) >> 31)) >>> 0
      columns[c].push(value)
    }
  }
  const result = [
    ...words.slice(0, begin),
    count,
    dictionary.length - 1,
    ...dictionary.slice(1),
  ]
  result[0] = (begin | 0x80000000) >>> 0
  for (const values of columns) {
    let min = 0xffffffff,
      max = 0,
      linear = true
    const step = (values[1] - values[0]) >>> 0
    for (let i = 0; i < count; ++i) {
      min = Math.min(min, values[i])
      max = Math.max(max, values[i])
      if (i && values[i] !== (values[i - 1] + step) >>> 0) linear = false
    }
    const width = 32 - Math.clz32(max - min)
    if (linear && width) result.push(values[0], 33, step)
    else {
      result.push(min, width)
      if (!width) continue
      const packed = new Uint32Array(Math.ceil((count * width) / 32))
      for (let i = 0; i < count; ++i) {
        const at = i * width,
          word = at >>> 5,
          shift = at & 31
        const value = values[i] - min
        packed[word] |= value << shift
        if (shift + width > 32) packed[word + 1] |= value >>> (32 - shift)
      }
      result.push(...packed)
    }
  }
  return result.length < words.length ? [result, footage] : [words, footage]
}

function runs(values) {
  const output = []
  for (let i = 0; i < values.length;) {
    const start = i++,
      value = values[start]
    while (i < values.length && values[i] === value) ++i
    output.push(i - start, value)
  }
  return output
}
function columnPack([words, footage]) {
  if (words[0] >= 0x80000000) return [words, footage]
  const begin = words[0] ?? 0,
    count = (words.length - begin) / 6
  if (count < 32) return [words, footage]
  const result = [...words.slice(0, begin), count]
  result[0] = (begin | 0x80000000) >>> 0
  for (let c = 0; c < 6; ++c) {
    const values = []
    for (let at = begin; at < words.length; at += 6) values.push(words[at + c])
    const deltas = []
    for (let i = 1; i < count; ++i) {
      const diff = (values[i] - values[i - 1]) | 0
      deltas.push(((diff << 1) ^ (diff >> 31)) >>> 0)
    }
    const rawRuns = runs(values),
      deltaRuns = runs(deltas)
    // Modes 0/1 have equal word counts; use delta only for a smaller JSON payload.
    const raw = [0, ...values],
      delta = [1, values[0], ...deltas]
    const choices = [raw, delta, [2, ...rawRuns], [3, values[0], ...deltaRuns]]
    choices.sort(
      (a, b) =>
        a.length - b.length ||
        JSON.stringify(a).length - JSON.stringify(b).length
    )
    result.push(...choices[0])
  }
  return result.length < words.length ? [result, footage] : [words, footage]
}

const rows = []
for (const mode of [
  'append',
  'prepend',
  'random',
  'random.words',
  'random.remove',
  'concurrent',
]) {
  seed = 0x12345678
  const p = new Projection(1),
    q = mode === 'concurrent' ? new Projection(2) : undefined
  if (q) {
    p.apply([[2]])
    q.apply([[1]])
  }
  const begin = performance.now()
  for (let i = 0; i < 6000; ++i) {
    const owner = q && i & 1 ? q : p
    const at =
      mode === 'append'
        ? owner.length()
        : mode === 'prepend'
          ? 0
          : Math.floor(random() * (owner.length() + 1))
    const values = mode === 'random.words' ? Array.from('sequence') : ['x']
    const gossip = owner.insert(values, at)
    if (q && i % 13 === 0) (owner === p ? q : p).merge(owner.sequence())
    if (mode === 'random.remove' && i % 3 === 0 && owner.length())
      owner.remove(Math.floor(random() * owner.length()))
  }
  const mutationMs = performance.now() - begin
  if (q) {
    p.merge(q.sequence())
    q.merge(p.sequence())
  }
  const snapshot = p.sequence(),
    packed = pack(snapshot),
    column = columnPack(snapshot)
  const timings = { sequence: [], create: [], merge: [] }
  for (let run = 0; run < 6; ++run) {
    let begin = performance.now()
    for (let i = 0; i < 10; ++i) p.sequence()
    if (run) timings.sequence.push((performance.now() - begin) / 10)
    begin = performance.now()
    for (let i = 0; i < 10; ++i) {
      const restored = new Projection(3, snapshot)
      restored.destroy()
    }
    if (run) timings.create.push((performance.now() - begin) / 10)
    begin = performance.now()
    for (let i = 0; i < 10; ++i) p.merge(snapshot)
    if (run) timings.merge.push((performance.now() - begin) / 10)
  }
  rows.push({
    mode,
    length: p.length(),
    mutationMs,
    words: snapshot[0].length,
    baseline: sizes(snapshot),
    packed: sizes(packed),
    packedWords: packed[0].length,
    column: sizes(column),
    columnWords: column[0].length,
    footageOnly: sizes(snapshot[1]),
    timings,
    medians: Object.fromEntries(
      Object.entries(timings).map(([k, v]) => [k, median(v)])
    ),
  })
  p.destroy()
  q?.destroy()
}
writeFileSync(output, JSON.stringify(rows, null, 2))
console.log(
  JSON.stringify(
    rows.map(
      ({
        mode,
        baseline,
        packed,
        column,
        words,
        packedWords,
        columnWords,
        medians,
      }) => ({
        mode,
        baseline,
        packed,
        column,
        words,
        packedWords,
        columnWords,
        medians,
      })
    ),
    null,
    2
  )
)
