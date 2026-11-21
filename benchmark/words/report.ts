import { sourceLine } from '../.shared/readme.ts'
import type { Report } from './index.ts'

/** Matched representation medians; the full report retains latency and dispersion. */
export function render(report: Report, summary = false): string {
  const q = (values: number[], fraction: number) => {
    const sorted = values.toSorted((a, b) => a - b),
      at = (sorted.length - 1) * fraction
    return (
      sorted[Math.floor(at)] +
      (sorted[Math.ceil(at)] - sorted[Math.floor(at)]) * (at % 1)
    )
  }
  const lines = [
    ...(summary ? [] : ['# Words benchmarks', '']),
    sourceLine(report),
    '',
    `${report.runs} runs, ${report.edits.toLocaleString('en-US')} edits. Median results; string Footage in both modes.`,
    '',
    '| Workload | Words | Snapshot KiB | Snapshot gzip KiB | Mean update B | Encode ops/s | Load ops/s | Receive batches/s |',
    '| --- | --- | ---: | ---: | ---: | ---: | ---: | ---: |',
  ]
  for (const workload of new Set(report.space.map((s) => s.workload)))
    for (const mode of new Set(report.space.map((s) => s.mode))) {
      const rows = report.space.filter(
        (s) => s.workload === workload && s.mode === mode
      )
      const speed = (operation: string) =>
        1e9 /
        q(
          report.samples
            .filter(
              (s) =>
                s.workload === workload &&
                s.mode === mode &&
                s.operation === operation
            )
            .map((s) => (s.milliseconds * 1e6) / s.calls),
          0.5
        )
      lines.push(
        `| ${workload} | ${mode === 'binary' ? 'packed' : 'unpacked'} | ${[
          'documentBytes',
          'documentGzipBytes',
          'averageUpdateBytes',
        ]
          .map((key) =>
            (
              q(
                rows.map((s) => s[key as keyof typeof s] as number),
                0.5
              ) / (key === 'averageUpdateBytes' ? 1 : 1024)
            ).toFixed(2)
          )
          .join(
            ' | '
          )} | ${['encode', 'load', 'receive'].map((op) => speed(op).toLocaleString('en-US', { maximumFractionDigits: 0 })).join(' | ')} |`
      )
    }
  if (!summary) {
    lines.push(
      '',
      '## API and transport latency',
      '',
      '| Workload | Words | Operation | Median ns | IQR ns |',
      '| --- | --- | --- | ---: | ---: |'
    )
    for (const key of new Set(
      report.samples.map((s) => `${s.workload}/${s.mode}/${s.operation}`)
    )) {
      const values = report.samples
        .filter((s) => `${s.workload}/${s.mode}/${s.operation}` === key)
        .map((s) => (s.milliseconds * 1e6) / s.calls)
      lines.push(
        `| ${key.split('/').join(' | ')} | ${q(values, 0.5).toFixed(2)} | ${(q(values, 0.75) - q(values, 0.25)).toFixed(2)} |`
      )
    }
  }
  lines.push(
    '',
    `Measured on ${report.environment}. Random and concurrent workloads mix insertion, removal and replacement. Concurrent authors edit independent views. Sizes use MessagePack; updates are encoded individually. Load includes decoding and construction. Receive includes decoding and applying one complete edit batch. Preparation, checks, destruction and explicit JS process garbage collection are outside timings.`
  )
  return lines.join('\n') + '\n'
}
