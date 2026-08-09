import { readFileSync } from 'node:fs'

const read_runs = (prefix) =>
  [1, 2, 3].map((run) =>
    JSON.parse(
      readFileSync(
        `archives/optimizations/hash_table_realm_entry_soa/raw/targeted/${prefix}_${run}.json`
      )
    )
  )
const baseline = read_runs('baseline')
const candidate = read_runs('candidate')
const metrics = ['random_lookup', 'hot_lookup', 'populate', 'middle_insert']
const operation_counts = {
  random_lookup: 2_000_000,
  hot_lookup: 5_000_000,
  populate: 100_000,
  middle_insert: 1,
}
const median = (values) => values[values.length >> 1]

const summarize = (runs, metric) => {
  const values = runs
    .flatMap((run) => run[metric].raw_nanoseconds)
    .map((value) => value / operation_counts[metric])
    .sort((left, right) => left - right)
  return {
    samples: values.length,
    median_nanoseconds: median(values),
    first_quartile_nanoseconds: values[Math.floor((values.length - 1) * 0.25)],
    third_quartile_nanoseconds: values[Math.ceil((values.length - 1) * 0.75)],
    process_median_nanoseconds: runs.map(
      (run) => run[metric].median_nanoseconds_per_operation
    ),
  }
}

console.log(
  JSON.stringify(
    Object.fromEntries(
      metrics.map((metric) => {
        const baseline_result = summarize(baseline, metric)
        const candidate_result = summarize(candidate, metric)
        return [
          metric,
          {
            baseline: baseline_result,
            candidate: candidate_result,
            change_percent:
              ((candidate_result.median_nanoseconds -
                baseline_result.median_nanoseconds) /
                baseline_result.median_nanoseconds) *
              100,
          },
        ]
      })
    ),
    null,
    2
  )
)
