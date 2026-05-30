import {
  isMainThread,
  parentPort,
  Worker,
  workerData,
} from 'node:worker_threads'
import { BENCHMARKS, LIBRARIES } from './definitions.js'
import { runBenchmark } from './runner.js'

// Scenarios that are O(n^2) for some competitor (e.g. automerge findIndexById)
// and that crlist already wins comfortably; excluded by default for fast loops.
const SLOW = new Set([
  'crud / delete / all entries in random order',
  'crud / delete / all entries from head one by one',
  'crud / delete / all entries from tail one by one',
])

// Filter to the delete / remove scenarios we are targeting.
const FILTER = (definition) => {
  const key = `${definition.group} / ${definition.name}`
  if (!process.env.INCLUDE_SLOW && SLOW.has(key)) return false
  return (
    (definition.group === 'crud' && definition.name.startsWith('delete /')) ||
    (definition.group === 'class' && definition.name.startsWith('remove /'))
  )
}

const SELECTED = BENCHMARKS.filter(FILTER)

const REPEATS = Number(process.env.BENCH_REPEATS ?? 3)

function optional(fn) {
  try {
    return fn()
  } catch {
    return undefined
  }
}

function runLibraryBenchmarks(library) {
  return SELECTED.map((definition) => {
    // Take the best (max ops/sec) of REPEATS runs to reduce noise.
    let best
    for (let run = 0; run < REPEATS; run++) {
      const result = optional(() => runBenchmark(library, definition))
      if (result && (!best || result.ops / result.ms > best.ops / best.ms))
        best = result
    }
    return { name: definition.name, group: definition.group, result: best }
  })
}

function runLibraryWorker(library) {
  return new Promise((resolve, reject) => {
    const worker = new Worker(new URL(import.meta.url), {
      type: 'module',
      workerData: { library },
    })
    worker.once('message', resolve)
    worker.once('error', reject)
    worker.once('exit', (code) => {
      if (code !== 0)
        reject(new Error(`${library} worker exited with code ${code}`))
    })
  })
}

function opsPerSec(result) {
  if (!result) return null
  return (result.ops / result.ms) * 1000
}

async function main() {
  const byLibrary = new Map()
  for (const library of LIBRARIES) {
    const message = await runLibraryWorker(library)
    byLibrary.set(message.library, message.results)
  }

  const crlist = byLibrary.get('crlist')
  const rows = crlist.map((row, index) => {
    const entry = { name: `${row.group} / ${row.name}` }
    let winner = null
    let winnerOps = -Infinity
    for (const library of LIBRARIES) {
      const ops = opsPerSec(byLibrary.get(library)[index]?.result)
      entry[library] = ops
      if (ops != null && ops > winnerOps) {
        winnerOps = ops
        winner = library
      }
    }
    entry.winner = winner
    return entry
  })

  const fmt = (n) =>
    n == null ? 'n/a' : Math.round(n).toLocaleString('en-US').padStart(13)
  console.log(
    'scenario'.padEnd(40),
    'crlist'.padStart(13),
    'yjs'.padStart(13),
    'jsonJoy'.padStart(13),
    'automerge'.padStart(13),
    ' winner'
  )
  for (const row of rows) {
    const flag = row.winner === 'crlist' ? '  WIN' : `  ${row.winner}`
    console.log(
      row.name.padEnd(40),
      fmt(row.crlist),
      fmt(row.yjs),
      fmt(row.jsonJoy),
      fmt(row.automerge),
      flag
    )
  }
  const wins = rows.filter((r) => r.winner === 'crlist').length
  console.log(`\ncrlist wins ${wins}/${rows.length} delete scenarios`)
}

if (isMainThread) {
  await main()
} else {
  parentPort.postMessage({
    library: workerData.library,
    results: runLibraryBenchmarks(workerData.library),
  })
}
