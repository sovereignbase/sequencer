import { readFileSync, writeFileSync } from 'node:fs'
const root = process.argv[2],
  baseline = process.argv[3],
  candidate = process.argv[4]
const stats = (values) => {
  const sorted = values.slice().sort((a, b) => a - b)
  return {
    median: sorted[sorted.length >> 1],
    iqr:
      sorted[Math.floor(sorted.length * 0.75)] -
      sorted[Math.floor(sorted.length * 0.25)],
    runs: values,
  }
}
const rows = []
const load = (names, suite) => {
  const reports = names
    .split(',')
    .map((name) => JSON.parse(readFileSync(`${root}/${name}.${suite}.json`)))
  return {
    ...reports[0],
    runs: reports.flatMap((x) => x.runs ?? []),
    samples: reports.flatMap((x) => x.samples ?? []),
  }
}
for (const suite of ['lifecycle', 'throughput']) {
  const a = load(baseline, suite)
  const b = load(candidate, suite)
  if (suite === 'lifecycle') {
    const runStats = (report, actor, phase, op) =>
      stats(
        report.runs.map((run) => {
          const metric = run.replicas[actor].operations[phase][op]
          if (metric) return metric.averageNanoseconds
          const samples = run.checkpoints
            .filter(
              (x) =>
                phase === 'fullLifecycle' ||
                x.direction === (phase === 'scaleUp' ? 'up' : 'down')
            )
            .map((x) => x.replicas[actor].management[op])
          return (
            samples.reduce((n, x) => n + x.totalNanoseconds, 0) /
            samples.reduce((n, x) => n + x.count, 0)
          )
        })
      )
    for (const actor in a.aggregates)
      for (const phase in a.aggregates[actor])
        for (const op in a.aggregates[actor][phase]) {
          const before = a.aggregates[actor][phase][op],
            after = b.aggregates[actor][phase][op]
          const beforeStats = runStats(a, actor, phase, op),
            afterStats = runStats(b, actor, phase, op)
          rows.push({
            suite,
            actor,
            phase,
            op,
            baseline: beforeStats.median,
            candidate: afterStats.median,
            baselineIqr: beforeStats.iqr,
            candidateIqr: afterStats.iqr,
            baselineRuns: beforeStats.runs,
            candidateRuns: afterStats.runs,
            percent: (afterStats.median / beforeStats.median - 1) * 100,
          })
        }
  } else {
    for (const row of a.aggregates) {
      const filter = (x) =>
        x.initialStripCount === row.initialStripCount &&
        x.operation === row.operation
      const before = stats(
        a.samples.filter(filter).map((x) => x.metric.averageNanoseconds)
      )
      const after = stats(
        b.samples.filter(filter).map((x) => x.metric.averageNanoseconds)
      )
      rows.push({
        suite,
        n: row.initialStripCount,
        op: row.operation,
        baseline: before.median,
        candidate: after.median,
        baselineIqr: before.iqr,
        candidateIqr: after.iqr,
        baselineRuns: before.runs,
        candidateRuns: after.runs,
        percent: (after.median / before.median - 1) * 100,
      })
    }
  }
}
writeFileSync(`${root}/suite-diff.json`, JSON.stringify(rows, null, 2))
console.log(
  JSON.stringify(
    rows.filter(
      (x) => x.percent > 10 || ['sequence', 'create.sequence'].includes(x.op)
    ),
    null,
    2
  )
)
