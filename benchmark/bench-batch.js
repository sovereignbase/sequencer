import { BENCHMARKS } from './definitions.js'
import { runBenchmark } from './runner.js'
import { printTable } from './helpers/table.js'

const BATCH_NAMES = [
  'append / batch after tail',
  'prepend / batch before head',
  'insert / batch before head',
  'insert / batch after head',
  'insert / batch before middle',
  'insert / batch after middle',
  'insert / batch before tail',
  'insert / batch after tail',
  'paste / insert 10,000 entries at cursor',
  'append / batch after tail',
  'prepend / batch before head',
  'insert / batch before middle',
  'append tail write to remote visible',
  'prepend head write to remote visible',
  'middle insert write to remote visible',
]

const targets = BENCHMARKS.filter((d) => BATCH_NAMES.includes(d.name))

const libraries = ['crlist', 'yjs']

const rows = targets.map((definition) => {
  const row = { ...definition, ops: definition.ops }
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
