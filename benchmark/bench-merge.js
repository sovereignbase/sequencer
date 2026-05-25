import { BENCHMARKS } from './definitions.js'
import { runBenchmark } from './runner.js'
import { printTable } from './helpers/table.js'

const MERGE_NAMES = [
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
  'merge / ordered 1,000 prepend deltas',
  'merge / ordered 1,000 middle insert deltas',
  'merge / ordered 1,000 append deltas',
  'merge / shuffled 1,000 mixed deltas',
  'merge ordered deltas',
  'merge shuffled gossip',
]

const targets = BENCHMARKS.filter((d) => MERGE_NAMES.includes(d.name))
const libraries = ['crlist', 'yjs', 'jsonJoy', 'automerge']

const rows = targets.map((definition) => {
  const row = { ...definition }
  for (const lib of libraries) {
    try {
      row[lib] = runBenchmark(lib, definition)
    } catch {
      row[lib] = undefined
    }
  }
  return row
})

printTable(rows)
