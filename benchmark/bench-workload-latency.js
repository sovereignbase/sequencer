import { crlistAdapter as crlist } from './adapters/crlist.js'
import { yjsAdapter as yjs } from './adapters/yjs.js'
import { runWorkload } from './scenarios/workload.js'
import { runLatency } from './scenarios/latency.js'

const LIST_SIZE = 5_000
const RUN_TIMES = 250

const workloadDefs = [
  'local app session',
  'read heavy session',
  'write heavy session',
  'balanced append prepend insert overwrite delete session',
  'text editing session',
  'collaborative offline session',
  'sync and cleanup session',
].map(name => ({ group: 'workload', name, n: LIST_SIZE, ops: RUN_TIMES }))

const latencyDefs = [
  'append tail write to remote visible',
  'middle insert write to remote visible',
  'offline burst 1,000 ops then sync',
  'forked replicas mixed ops then converge',
  'out-of-order append delivery to convergence',
  'duplicate shuffled gossip to convergence',
].map(name => ({ group: 'latency', name, n: LIST_SIZE, ops: RUN_TIMES }))

const adapters = [crlist, yjs]
const fmt = (r) => r == null ? '     n/a' : `${r.ms?.toFixed(2).padStart(7)}ms`

function run(defs, runFn) {
  for (const def of defs) {
    const results = {}
    for (const adapter of adapters) {
      results[adapter.name] = runFn(adapter, def)
    }
    const c = results.crlist?.ms
    const y = results.yjs?.ms
    const win = c != null && y != null ? (c <= y ? '✓ ' : '  ') : (c != null ? '✓ ' : '  ')
    console.log(`${win}${def.name.padEnd(52)} crlist=${fmt(results.crlist)} yjs=${fmt(results.yjs)}`)
  }
}

console.log('=== WORKLOAD ===')
run(workloadDefs, runWorkload)
console.log('\n=== LATENCY ===')
run(latencyDefs, runLatency)
