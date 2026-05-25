import { crlistAdapter as crlist } from './adapters/crlist.js'
import { yjsAdapter as yjs } from './adapters/yjs.js'
import { runLatency } from './scenarios/latency.js'
import { runWorkload } from './scenarios/workload.js'
import { runMags } from './scenarios/mags.js'
import { printTable } from './helpers/table.js'

const LIST_SIZE = 5_000
const RUN_TIMES = 250

const defs = [
  { group: 'mags', name: 'merge / forked replicas rejoin after 250 ops each', n: LIST_SIZE, ops: RUN_TIMES },
  { group: 'latency', name: 'forked replicas mixed ops then converge', n: LIST_SIZE, ops: RUN_TIMES },
  { group: 'workload', name: 'collaborative offline session', n: LIST_SIZE, ops: RUN_TIMES },
]

const adapters = [crlist, yjs]
const results = []

for (const def of defs) {
  const row = { name: `${def.group} / ${def.name}` }
  for (const adapter of adapters) {
    let result
    if (def.group === 'mags') result = runMags(adapter, def)
    else if (def.group === 'latency') result = runLatency(adapter, def)
    else result = runWorkload(adapter, def)
    row[adapter.name] = result
  }
  results.push(row)
  const fmt = (r) => r == null ? 'n/a' : `${r.ms?.toFixed(2)}ms`
  console.log(`${row.name}: crlist=${fmt(row.crlist)} yjs=${fmt(row.yjs)}`)
}
