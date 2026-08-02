import { measure_bundle_sizes } from './bundle/index.ts'
import { measure_data_sizes } from './data/index.ts'
import { run_function_benchmarks } from './functions/index.ts'
import { write_benchmark_report } from './report/index.ts'

const function_results = await run_function_benchmarks()
const bundle_results = await measure_bundle_sizes()
const data_results = measure_data_sizes()

write_benchmark_report(function_results, bundle_results, data_results)

console.table(
  function_results.rows.map((row) => ({
    function: row.name,
    length: row.sequence_length,
    'ops/sec': Math.round(row.throughput_ops_per_second),
    calls: row.calls,
    'avg µs/op': row.average_time_microseconds.toFixed(3),
  }))
)
console.log('Benchmark report written to docs/benchmarks/index.html')
