import { __create, __update, __delete } from '../dist/index.js'
function build(n) {
  const s = __create()
  for (let i = 0; i < n; i++) __update(s.size, [{ id: i }], s, 'after')
  return s
}
const N = 5000, CHUNK = 100
// Pre-build a pool of lists (untimed-ish), then delete them all in a tight loop.
const POOL = 200
function run() {
  const lists = []
  for (let i = 0; i < POOL; i++) lists.push(build(N))
  for (const s of lists) while (s.size > 0) __delete(s, 0, Math.min(CHUNK, s.size))
}
for (let i = 0; i < 12; i++) run()
