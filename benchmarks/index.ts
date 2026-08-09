import { measure_bundle_sizes } from './bundle/index.ts'
import { measure_data_sizes } from './data/index.ts'
import { measure_memory_usage } from './memory/index.ts'
import { run_throughput_benchmarks } from './throughput/index.ts'

const memory_results = await measure_memory_usage()
const throughput_results = await run_throughput_benchmarks()
const bundle_results = await measure_bundle_sizes()
const disk_results = measure_data_sizes()

console.log('\nThroughput efficiency')
console.table(
  throughput_results.rows.map((row) => {
    const decimal_places =
      row.average_time_microseconds < 0.1
        ? 5
        : row.average_time_microseconds < 1
          ? 4
          : 3
    const average_time_microseconds = Number(
      row.average_time_microseconds.toFixed(decimal_places)
    )
    return {
      function: row.name,
      length: row.sequence_length,
      strips: row.sequencer_strip_count,
      'ops/sec': Math.round(1_000_000 / average_time_microseconds),
      calls: row.calls,
      'avg µs/op': average_time_microseconds.toFixed(decimal_places),
    }
  })
)

console.log('\nMemory efficiency')
console.table(memory_results)

console.log('\nBundle efficiency')
console.table(bundle_results)

console.log('\nData efficiency')
console.table(disk_results)
