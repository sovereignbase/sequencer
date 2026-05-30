import inspector from 'node:inspector'
import { promisify } from 'node:util'
import { __create, __update, __delete } from '../dist/index.js'

function build(n) {
  const s = __create()
  for (let i = 0; i < n; i++) __update(s.size, [{ id: i }], s, 'after')
  return s
}
const N = 5000, CHUNK = 100, POOL = 400
const session = new inspector.Session()
session.connect()
const post = promisify(session.post.bind(session))

// Pre-build pool BEFORE profiling
const lists = []
for (let p = 0; p < POOL; p++) lists.push(build(N))
// warmup delete on a few extra
for (let w = 0; w < 3; w++) { const s = build(N); while (s.size>0) __delete(s,0,Math.min(CHUNK,s.size)) }

await post('Profiler.enable')
await post('Profiler.setSamplingInterval', { interval: 50 }) // 50us
await post('Profiler.start')
for (const s of lists) while (s.size > 0) __delete(s, 0, Math.min(CHUNK, s.size))
const { profile } = await post('Profiler.stop')

// Aggregate self time by function name
const byNode = new Map()
for (const node of profile.nodes) byNode.set(node.id, node)
const self = new Map()
for (const node of profile.nodes) {
  const f = node.callFrame
  const name = (f.functionName || '(anon)') + ' ' + (f.url.split('/').pop() || '') + ':' + (f.lineNumber+1)
  self.set(name, (self.get(name) || 0) + (node.hitCount || 0))
}
const total = [...self.values()].reduce((a,b)=>a+b,0)
const top = [...self.entries()].sort((a,b)=>b[1]-a[1]).slice(0, 22)
console.log('total samples', total)
for (const [name, hits] of top) console.log((100*hits/total).toFixed(1).padStart(5)+'%', String(hits).padStart(6), name)
session.disconnect()
