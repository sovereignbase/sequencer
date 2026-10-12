import { performance } from 'node:perf_hooks'
for (const kind of ['indexed', 'push', 'apply', 'prelength']) {
  const samples = []
  for (let run = -1; run < 5; run++) {
    const payloads = Array.from({ length: 30000 }, (_, i) =>
      new Array(50).fill(i)
    )
    const footage = new Array(10000).fill(0)
    const start = performance.now()
    for (const values of payloads) {
      const end = footage.length
      if (kind === 'apply') footage.push.apply(footage, values)
      else if (kind === 'push')
        for (let i = 0; i < values.length; i++) footage.push(values[i])
      else {
        if (kind === 'prelength') footage.length = end + values.length
        for (let i = 0; i < values.length; i++) footage[end + i] = values[i]
      }
    }
    if (run >= 0)
      samples.push(((performance.now() - start) * 1e6) / payloads.length)
    global.gc?.()
  }
  console.log(
    kind,
    JSON.stringify(samples),
    samples.toSorted((a, b) => a - b)[2]
  )
}
