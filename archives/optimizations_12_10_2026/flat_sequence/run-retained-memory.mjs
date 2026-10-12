import { spawnSync } from 'node:child_process'
import { writeFileSync } from 'node:fs'
const results = { baseline: [], current: [] }
for (let run = 0; run < 5; run++)
  for (const key of ['baseline', 'current']) {
    const file =
      key === 'baseline'
        ? 'temp/strip-runs/baseline-dist/index.js'
        : 'dist/index.js'
    const child = spawnSync(
      process.execPath,
      ['--expose-gc', 'temp/strip-runs/retained-memory.mjs', file],
      { encoding: 'utf8' }
    )
    if (child.status !== 0) throw Error(child.stderr)
    results[key].push(JSON.parse(child.stdout))
  }
writeFileSync(
  'temp/strip-runs/flat-retained-memory.json',
  JSON.stringify(results, null, 2)
)
const median = (a) => a.toSorted((x, y) => x - y)[Math.floor(a.length / 2)]
for (const key of ['baseline', 'current'])
  console.log(
    key,
    JSON.stringify(
      Object.fromEntries(
        Object.keys(results[key][0]).map((field) => [
          field,
          median(results[key].map((x) => x[field])),
        ])
      )
    )
  )
