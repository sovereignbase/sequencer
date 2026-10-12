import { readFileSync, writeFileSync } from 'node:fs'
const directory = new URL('./', import.meta.url)
const prefix = process.argv[2] ?? 'paired'
const load = (side) =>
  [1, 2, 3].map((i) =>
    JSON.parse(readFileSync(new URL(`${prefix}-${side}-${i}.json`, directory)))
  )
const baseline = load('baseline'),
  candidate = load('candidate')
const stats = (values) => {
  const sorted = values.toSorted((a, b) => a - b)
  return { median: sorted[sorted.length >> 1], values }
}
const compare = (a, b) => ({
  baseline: stats(a),
  candidate: stats(b),
  percent: (stats(b).median / stats(a).median - 1) * 100,
})
const rows = baseline[0].map((row) => {
  const a = baseline.map((run) => run.find((x) => x.mode === row.mode))
  const b = candidate.map((run) => run.find((x) => x.mode === row.mode))
  return {
    mode: row.mode,
    metrics: Object.fromEntries(
      [
        'jsonBytes',
        'v8Bytes',
        'gzipBytes',
        'brotliBytes',
        'retainedSnapshotHeapBytes',
        'metadataWords',
      ].map((key) => [
        key,
        compare(
          a.map((x) => x[key]),
          b.map((x) => x[key])
        ),
      ])
    ),
    timings: Object.fromEntries(
      Object.keys(row.timings).map((key) => [
        key,
        compare(
          a.map((x) => x.timings[key].medianMs),
          b.map((x) => x.timings[key].medianMs)
        ),
      ])
    ),
  }
})
writeFileSync(
  new URL(`${prefix}-comparison.json`, directory),
  JSON.stringify(rows, null, 2)
)
console.table(
  rows.map((row) => ({
    mode: row.mode,
    json: Math.round(row.metrics.jsonBytes.percent) + '%',
    heap: Math.round(row.metrics.retainedSnapshotHeapBytes.percent) + '%',
    ...Object.fromEntries(
      Object.entries(row.timings).map(([key, value]) => [
        key,
        Math.round(value.percent) + '%',
      ])
    ),
  }))
)
