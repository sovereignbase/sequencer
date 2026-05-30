import { BENCHMARKS } from './definitions.js'
import { runBenchmark } from './runner.js'

const MERGE_NAMES = [
  'merge / append head delta into equal replica',
  'merge / append tail delta into equal replica',
  'merge / prepend head delta into equal replica',
  'merge / insert middle delta into equal replica',
  'merge / overwrite head delta into equal replica',
  'merge / overwrite middle delta into equal replica',
  'merge / overwrite tail delta into equal replica',
  'merge / delete head delta into equal replica',
  'merge / delete middle delta into equal replica',
  'merge / delete tail delta into equal replica',
  'merge / ordered 1,000 append deltas',
  'merge / ordered 1,000 prepend deltas',
  'merge / ordered 1,000 middle insert deltas',
  'merge / shuffled 1,000 mixed deltas',
  'merge / reverse ordered 1,000 mixed deltas',
  'merge ordered deltas',
  'merge shuffled gossip',
  'merge / concurrent prepends same head',
  'merge / concurrent appends same tail',
  'merge / concurrent inserts same middle position',
  'merge / concurrent overwrites same head',
  'merge / concurrent overwrites same middle',
  'merge / concurrent overwrites same tail',
  'merge / concurrent deletes same head',
  'merge / concurrent deletes same middle',
  'merge / concurrent deletes same tail',
  'merge / concurrent overwrite delete same entry',
  'merge / forked replicas rejoin after 250 ops each',
  'merge / 10 replicas gossip convergence',
  'merge / snapshot merge into stale replica',
]

const libraries = process.env.WITH_AUTOMERGE
  ? ['crlist', 'yjs', 'jsonJoy', 'automerge']
  : ['crlist', 'yjs', 'jsonJoy']
const RUNS = Number(process.argv[2] ?? 7)

const targets = BENCHMARKS.filter(
  (d) => d.group === 'mags' && MERGE_NAMES.includes(d.name)
)

function median(values) {
  const sorted = values.filter((v) => v !== undefined).sort((a, b) => a - b)
  if (sorted.length === 0) return undefined
  const mid = Math.floor(sorted.length / 2)
  return sorted.length % 2 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2
}

function pad(s, n) {
  s = String(s)
  return s.length >= n ? s : s + ' '.repeat(n - s.length)
}
function padL(s, n) {
  s = String(s)
  return s.length >= n ? s : ' '.repeat(n - s.length) + s
}

const header =
  pad('scenario', 52) +
  libraries.map((l) => padL(l + ' ms/op', 16)).join('') +
  '  ' +
  pad('winner', 10)
console.log(header)
console.log('-'.repeat(header.length))

for (const definition of targets) {
  const perLib = {}
  for (const lib of libraries) {
    const samples = []
    for (let r = 0; r < RUNS; r++) {
      let res
      try {
        res = runBenchmark(lib, definition)
      } catch {
        res = undefined
      }
      if (res && res.ops > 0) samples.push(res.ms / res.ops)
    }
    perLib[lib] = median(samples)
  }
  let winner = 'n/a'
  let best = Infinity
  for (const lib of libraries) {
    const v = perLib[lib]
    if (v !== undefined && v < best) {
      best = v
      winner = lib
    }
  }
  const cells = libraries
    .map((l) =>
      padL(perLib[l] === undefined ? 'n/a' : perLib[l].toFixed(5), 16)
    )
    .join('')
  console.log(
    pad(definition.name.replace('merge ', ''), 52) +
      cells +
      '  ' +
      pad(winner, 10)
  )
}
