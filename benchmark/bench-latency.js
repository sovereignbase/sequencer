import { crlistAdapter as crlist } from './adapters/crlist.js'
import { yjsAdapter as yjs } from './adapters/yjs.js'
import { runLatency } from './scenarios/latency.js'

const LIST_SIZE = 5_000
const RUN_TIMES = 250

const defs = [
  'append tail write to remote visible',
  'prepend head write to remote visible',
  'middle insert write to remote visible',
  'head insert write to remote visible',
  'overwrite head write to remote visible',
  'overwrite middle write to remote visible',
  'offline burst 1,000 ops then sync',
  'forked replicas mixed ops then converge',
  'out-of-order write delivery to remote visible',
  'out-of-order append delivery to convergence',
  'remote snapshot hydrate then apply pending deltas',
].map(name => ({ group: 'latency', name, n: LIST_SIZE, ops: RUN_TIMES }))

const adapters = [crlist, yjs]
const fmt = (r) => r == null ? '  n/a' : `${r.ms?.toFixed(2).padStart(6)}ms`

for (const def of defs) {
  const results = {}
  for (const adapter of adapters) {
    results[adapter.name] = runLatency(adapter, def)
  }
  const winner = results.crlist?.ms != null && results.yjs?.ms != null
    ? (results.crlist.ms <= results.yjs.ms ? ' ✓' : '  ')
    : (results.crlist?.ms != null ? ' ✓' : '  ')
  console.log(`${winner} ${def.name.padEnd(50)} crlist=${fmt(results.crlist)} yjs=${fmt(results.yjs)}`)
}
