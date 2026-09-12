import { performance } from 'node:perf_hooks'

let resultSink: Array<number> = []
for (const size of [1, 5, 12, 256, 2560, 65536]) {
  const values = new Array<number>(size).fill(1)
  const count = Math.max(64, Math.floor(2_000_000 / size))
  const methods = {
    indexed: (target: Array<number>) => {
      const start = target.length
      target.length = start + size
      for (let frame = 0; frame < size; ++frame)
        target[start + frame] = values[frame]
    },
    pushLoop: (target: Array<number>) => {
      for (let frame = 0; frame < size; ++frame) target.push(values[frame])
    },
    spread: (target: Array<number>) => {
      target.push(...values)
    },
  }
  const timings: Record<string, Array<number>> = {}
  for (let round = 0; round < 7; ++round) {
    for (const [name, append] of Object.entries(methods)) {
      const start = performance.now()
      for (let iteration = 0; iteration < count; ++iteration) {
        const target = [0]
        append(target)
        resultSink = target
      }
      if (round >= 2)
        (timings[name] ??= []).push(
          ((performance.now() - start) * 1000) / count
        )
    }
  }
  console.log(
    JSON.stringify({
      size,
      median_us: Object.fromEntries(
        Object.entries(timings).map(([name, times]) => [
          name,
          times.sort((left, right) => left - right)[2],
        ])
      ),
    })
  )
}
if (resultSink.length === 0) throw new Error('Append did not run')
