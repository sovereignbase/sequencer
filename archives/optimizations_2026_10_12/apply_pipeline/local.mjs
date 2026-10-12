import { pathToFileURL } from 'node:url'
import { writeFileSync } from 'node:fs'
crypto.getRandomValues = (words) => {
  words[0] = 0x12345678
  return words
}
const { Projection } = await import(pathToFileURL(process.argv[2]).href)
const snapshot = [[1, 0, 0, 0, 100, 0, 10000], new Array(10000).fill('x')]
const rows = []
let sink
for (const method of ['remove', 'replace', 'insert', 'value', 'values']) {
  const timings = []
  for (let run = 0; run < 8; ++run) {
    const p = new Projection(1, snapshot)
    const payloads = Array.from({ length: 2048 }, () => ['y'])
    globalThis.gc?.()
    const begin = performance.now()
    for (let i = 0; i < 2048; ++i) {
      if (method === 'remove') sink = p.remove(0, 0)
      else if (method === 'replace') sink = p.replace(payloads[i], 0, 0)
      else if (method === 'insert') sink = p.insert(payloads[i], 0)
      else if (method === 'value') sink = p.value((i * 7919) % p.length())
      else sink = p.values(0, 99)
    }
    if (run > 1) timings.push(performance.now() - begin)
    sink = undefined
    p.destroy()
  }
  rows.push({
    method,
    timings,
    medianMs: timings.toSorted((a, b) => a - b)[timings.length >> 1],
  })
}
writeFileSync(process.argv[3], JSON.stringify(rows, null, 2))
