import { BENCHMARKS } from './definitions.js'
import { runBenchmark } from './runner.js'
import { printTable } from './helpers/table.js'

const SNAPSHOT_NAMES = [
  'snapshot',
  'snapshot / clean state',
  'snapshot / tombstoned state 50% deleted',
  'snapshot / tombstoned state 90% deleted',
  'snapshot / after garbage collection',
]

const targets = BENCHMARKS.filter((d) => SNAPSHOT_NAMES.includes(d.name))

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
