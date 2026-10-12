import { spawnSync } from 'node:child_process'
import { readFileSync, writeFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { pathToFileURL } from 'node:url'
const variant = process.argv[2]
if (!variant) {
  const rows = []
  for (let run = 0; run < 9; run++)
    for (const name of run % 2 ? ['after', 'before'] : ['before', 'after']) {
      const r = spawnSync(
        process.execPath,
        ['--expose-gc', import.meta.filename, name],
        { encoding: 'utf8' }
      )
      if (r.status) throw new Error(r.stderr)
      rows.push({ run, variant: name, ...JSON.parse(r.stdout) })
    }
  writeFileSync(
    'temp/performance/cached-reads.json',
    JSON.stringify(rows, null, 2)
  )
} else {
  const { Projection } = await import(
    pathToFileURL(
      resolve(
        variant === 'before'
          ? 'temp/performance/sync-map-dist/index.js'
          : 'dist/index.js'
      )
    ).href
  )
  const p = new Projection(1)
  let frames = 0,
    sink = 0
  for (let i = 0; i < 10000; i++) {
    const n = 1 + (i % 100)
    p.insert(new Array(n).fill(i), frames)
    frames += n
  }
  const operations = {
    length: () => p.length(),
    head: () => p.value(0),
    middle: () => p.value(frames >>> 1),
    tail: () => p.value(frames - 1),
  }
  const measured = {}
  for (const [op, call] of Object.entries(operations)) {
    for (let i = 0; i < 10000; i++) sink += call()
    globalThis.gc()
    const start = process.hrtime.bigint()
    for (let i = 0; i < 1000000; i++) sink += call()
    measured[op] = Number(process.hrtime.bigint() - start) / 1000000
  }
  p.destroy()
  console.log(JSON.stringify({ measured, sink }))
}
