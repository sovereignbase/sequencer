import type { Report } from './index.ts'

/** Means of independent runs, comparing the same populated field count. */
export function render(report: Report, summary = false): string {
  const mean = (values: number[]) =>
    values.reduce((sum, value) => sum + value, 0) / values.length
  const modes = ['projection', 'tuple'] as const
  const sizes = [...new Set(report.samples.map((sample) => sample.size))].sort(
    (a, b) => a - b
  )
  const operations = [
    ...new Set(report.samples.map((sample) => sample.operation)),
  ]
  const lines = [
    summary ? '### Tuple mode' : '# Tuple benchmarks',
    '',
    `Arithmetic means of ${report.runs} runs. Ordinary Projection versus a static tuple with maxLength. Both contain the same values; replacements preserve the field count.`,
    '',
    summary ? '#### Throughput (ops/s)' : '## Throughput (ops/s)',
    '',
    '| Indices | Method / case | Projection | Static tuple | Tuple / Projection |',
    '| ---: | --- | ---: | ---: | ---: |',
  ]
  for (const size of sizes) {
    for (const operation of operations) {
      if (
        summary &&
        ![
          'create.sequence',
          'replace.random',
          'apply.replace',
          'value.random',
        ].includes(operation)
      )
        continue
      const rates = modes.map((mode) =>
        mean(
          report.samples
            .filter(
              (sample) =>
                sample.size === size &&
                sample.mode === mode &&
                sample.operation === operation
            )
            .map((sample) => (sample.calls * 1000) / sample.milliseconds)
        )
      )
      lines.push(
        `| ${size} | ${operation} | ${rates.map((rate) => rate.toLocaleString('en-US', { maximumFractionDigits: 0 })).join(' | ')} | ${(rates[1] / rates[0]).toFixed(2)}× |`
      )
    }
  }
  lines.push(
    '',
    summary ? '#### Space (KiB)' : '## Space (KiB)',
    '',
    '| Indices | Mode | Estimated allocated memory | MessagePack | MessagePack + gzip |',
    '| ---: | --- | ---: | ---: | ---: |'
  )
  for (const size of sizes) {
    for (const mode of modes) {
      const samples = report.space.filter(
        (sample) => sample.size === size && sample.mode === mode
      )
      const kib = (values: number[]) => (mean(values) / 1024).toFixed(2)
      lines.push(
        `| ${size} | ${mode === 'tuple' ? 'Static tuple' : 'Projection'} | ${kib(samples.map((sample) => sample.allocatedBytes))} | ${kib(samples.map((sample) => sample.msgpackBytes))} | ${kib(samples.map((sample) => sample.gzipBytes))} |`
      )
    }
  }
  lines.push(
    '',
    `Measured on ${report.environment}. Fixtures are hydrated compacted snapshots after one replacement per field. Each case warms up for ≥25 ms and measures ≥50 ms of API time; mutation bursts restart after 4,096 replacements. Peer authoring, encoding, result checks, destruction and explicit JS process garbage collection are outside API timings. Memory estimates are the increase in live native allocator bytes plus retained JS array slots for one instance, including exercised runtime buffers. Unused WASM capacity, JS object headers and referenced payload objects are excluded.`,
    ''
  )
  return lines.join('\n')
}
