import type { Report } from './index.ts'

/** Arithmetic means of independent runs; memory covers one isolated library instance. */
export function render(report: Report): string {
  const mean = (values: number[]) =>
    values.reduce((sum, value) => sum + value, 0) / values.length
  const modes = [...new Set(report.samples.map((sample) => sample.mode))]
  const lines = [
    '# Tuple benchmarks',
    '',
    `Arithmetic means of ${report.runs} runs. Fixed and dynamic tuple modes use stable indices; ordinary sequences shift indices. Fixtures contain one Frame per scattered Insertion.`,
    '',
    '## Throughput (ops/s)',
    '',
    `| Indices | Method / case | ${modes.join(' | ')} |`,
    `| ---: | --- | ${modes.map(() => '---:').join(' | ')} |`,
  ]
  for (const size of new Set(report.samples.map((sample) => sample.size))) {
    for (const operation of new Set(
      report.samples.map((sample) => sample.operation)
    )) {
      const cells = modes.map((mode) =>
        mean(
          report.samples
            .filter(
              (sample) =>
                sample.size === size &&
                sample.mode === mode &&
                sample.operation === operation
            )
            .map((sample) => (sample.calls * 1000) / sample.milliseconds)
        ).toLocaleString('en-US', { maximumFractionDigits: 0 })
      )
      lines.push(
        `| ${size.toLocaleString('en-US')} | ${operation} | ${cells.join(' | ')} |`
      )
    }
  }
  lines.push(
    '',
    '## Space (KiB)',
    '',
    '| Indices | Mode | Estimated library memory | MessagePack | MessagePack + gzip |',
    '| ---: | --- | ---: | ---: | ---: |'
  )
  for (const size of new Set(report.space.map((sample) => sample.size))) {
    for (const mode of modes) {
      const samples = report.space.filter(
        (sample) => sample.size === size && sample.mode === mode
      )
      const memory = samples.flatMap((sample) =>
        sample.runtimeBytes === null ? [] : [sample.runtimeBytes]
      )
      const kib = (values: number[]) => (mean(values) / 1024).toFixed(2)
      lines.push(
        `| ${size.toLocaleString('en-US')} | ${mode} | ${memory.length ? kib(memory) : '—'} | ${kib(samples.map((sample) => sample.msgpackBytes))} | ${kib(samples.map((sample) => sample.gzipBytes))} |`
      )
    }
  }
  lines.push(
    '',
    `Measured on ${report.environment}. Peer authoring, encoding, validation, destruction and explicit JS process garbage collection are outside API timings. Constructor results are destroyed after each burst. Memory estimates include one instance's isolated WASM linear memory and retained JS array slots; referenced payload objects are excluded.`,
    ''
  )
  return lines.join('\n')
}
