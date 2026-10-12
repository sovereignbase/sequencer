import { readFileSync } from 'node:fs'

const baseline_files = [1, 2, 3].map(
  (run) =>
    `archives/optimizations/hash_table_realm_entry_soa/raw/full/baseline_${run}.txt`
)
const candidate_files = [1, 2, 3].map(
  (run) =>
    `archives/optimizations/hash_table_realm_entry_soa/raw/full/candidate_${run}.txt`
)
const median = (values) =>
  [...values].sort((left, right) => left - right)[values.length >> 1]
const clean = (cell) => cell.trim().replace(/^'|'$/g, '')

const parse = (path) => {
  const sections = { throughput: [], memory: [], bundle: [], data: [] }
  let section
  for (const line of readFileSync(path, 'utf8').split(/\r?\n/)) {
    if (line === 'Throughput efficiency') section = 'throughput'
    else if (line === 'Memory efficiency') section = 'memory'
    else if (line === 'Bundle efficiency') section = 'bundle'
    else if (line === 'Data efficiency') section = 'data'
    else if (section && /^│\s*\d+\s*│/.test(line))
      sections[section].push(line.split('│').slice(2, -1).map(clean))
  }
  return sections
}

const baseline = baseline_files.map(parse)
const candidate = candidate_files.map(parse)
const throughput_rows = baseline[0].throughput.map((cells, index) => {
  const baseline_microseconds = baseline.map((run) =>
    Number(run.throughput[index][7])
  )
  const candidate_microseconds = candidate.map((run) =>
    Number(run.throughput[index][7])
  )
  const baseline_median = median(baseline_microseconds)
  const candidate_median = median(candidate_microseconds)
  return {
    function: cells[0],
    sequence_frames: Number(cells[1]),
    strip_frames: Number(cells[2]),
    retained_strips: Number(cells[3]),
    operation_frames: cells[4],
    baseline_microseconds,
    candidate_microseconds,
    baseline_median,
    candidate_median,
    latency_change_percent:
      ((candidate_median - baseline_median) / baseline_median) * 100,
  }
})

const numeric_section = (name, key_indexes) =>
  baseline[0][name].map((cells, index) => ({
    key: key_indexes.map((key_index) => cells[key_index]).join('|'),
    baseline: baseline.map((run) => run[name][index]),
    candidate: candidate.map((run) => run[name][index]),
  }))

console.log(
  JSON.stringify(
    {
      throughput_summary: {
        rows: throughput_rows.length,
        improved_over_five_percent: throughput_rows.filter(
          (row) => row.latency_change_percent < -5
        ).length,
        regressed_over_five_percent: throughput_rows.filter(
          (row) => row.latency_change_percent > 5
        ).length,
      },
      throughput_rows,
      memory_rows: numeric_section('memory', [0, 1]),
      bundle_rows: numeric_section('bundle', [0]),
      data_rows: numeric_section('data', [0]),
    },
    null,
    2
  )
)
