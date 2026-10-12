import { performance } from 'node:perf_hooks'
import { pathToFileURL } from 'node:url'
import { writeFileSync } from 'node:fs'
const { Projection } = await import(pathToFileURL(process.argv[2]).href)
const samples = []
for (let run = -1; run < 5; run++) {
  const p = new Projection(1)
  p.insert(new Array(10000).fill(0), 0)
  const payloads = Array.from({ length: 30000 }, (_, i) =>
    new Array(Number(process.argv[4] ?? 50)).fill(i)
  )
  const start = performance.now()
  for (let i = 0; i < payloads.length; i++) p.insert(payloads[i], p.length())
  const elapsed = performance.now() - start
  if (run >= 0) samples.push((elapsed * 1e6) / payloads.length)
  p.destroy()
  global.gc?.()
}
const result = {
  nanosecondsPerCall: samples,
  median: samples.toSorted((a, b) => a - b)[2],
}
writeFileSync(process.argv[3], JSON.stringify(result, null, 2))
console.log(JSON.stringify(result))
