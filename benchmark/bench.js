import {
  isMainThread,
  parentPort,
  Worker,
  workerData,
} from 'node:worker_threads'
import { BENCHMARKS, LIBRARIES } from './definitions.js'
import { runBenchmark } from './runner.js'
import { printTable, formatDuration } from './helpers/table.js'

function optional(fn) {
  try {
    return fn()
  } catch {
    return undefined
  }
}

function runLibraryBenchmarks(library) {
  return BENCHMARKS.map((definition) => ({
    group: definition.group,
    name: definition.name,
    n: definition.n,
    requestedOps: definition.ops,
    result: optional(() => runBenchmark(library, definition)),
  }))
}

function runWorker(library) {
  parentPort.postMessage({ library, results: runLibraryBenchmarks(library) })
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

async function runLibraryWorkers() {
  const messages = []
  for (const library of LIBRARIES)
    messages.push(await runLibraryWorker(library))
  return messages
}

function combineLibraryResults(messages) {
  const byLibrary = new Map(
    messages.map((message) => [message.library, message.results])
  )
  return BENCHMARKS.map((definition, index) => ({
    ...definition,
    ops: byLibrary.get('crlist')?.[index]?.result?.ops ?? definition.ops,
    crlist: byLibrary.get('crlist')?.[index]?.result,
    yjs: byLibrary.get('yjs')?.[index]?.result,
    jsonJoy: byLibrary.get('jsonJoy')?.[index]?.result,
    automerge: byLibrary.get('automerge')?.[index]?.result,
  }))
}

async function main() {
  console.log('CRList benchmark')
  console.log(
    `node=${process.version} platform=${process.platform} arch=${process.arch}`
  )
  console.log(`workers=${LIBRARIES.join(', ')}`)
  console.log(`benchmarks=${BENCHMARKS.length}`)
  console.log('')
  const start = process.hrtime.bigint()
  const rows = combineLibraryResults(await runLibraryWorkers())
  printTable(rows)
  const totalMs = Number(process.hrtime.bigint() - start) / 1_000_000
  console.log('')
  console.log(`total wall time: ${formatDuration(totalMs)} ms`)
}

if (isMainThread) {
  await main()
} else {
  runWorker(workerData.library)
}
