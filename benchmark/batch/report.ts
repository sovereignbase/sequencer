import { sourceLine } from '../.shared/readme.ts'
import type { Report } from './index.ts'

/** Reports matched workload medians; full output retains every timing and footprint. */
export function render(report: Report, summary = false): string {
  const q = (values: number[], fraction: number) => {
    const a = values.toSorted((a, b) => a - b),
      at = (a.length - 1) * fraction
    return a[Math.floor(at)] + (a[Math.ceil(at)] - a[Math.floor(at)]) * (at % 1)
  }
  const lines = [
    ...(summary ? [] : ['# Batch benchmarks', '']),
    sourceLine(report),
    '',
    `${report.runs} runs, ${report.edits.toLocaleString('en-US')} edits per author. Concurrent authors edit independent views; causal authors exchange history before the second author edits. Median results.`,
    '',
    '| Workload | Mode | Author edits/s | Apply edits/s | Receive edits/s | Update/author KiB | Document KiB | Memory MiB |',
    '| --- | --- | ---: | ---: | ---: | ---: | ---: | ---: |',
  ]
  for (const workload of new Set(report.samples.map((s) => s.workload)))
    for (const mode of ['individual', 'batch'] as const) {
      const rows = report.samples.filter(
        (s) => s.workload === workload && s.mode === mode
      )
      const speed = (
        key: 'authorMilliseconds' | 'applyMilliseconds' | 'receiveMilliseconds'
      ) =>
        q(
          rows.map((s) => (s.edits * 1000) / s[key]),
          0.5
        ).toLocaleString('en-US', { maximumFractionDigits: 0 })
      lines.push(
        `| ${workload} | ${mode} | ${speed('authorMilliseconds')} | ${speed('applyMilliseconds')} | ${speed('receiveMilliseconds')} | ${(
          q(
            rows.map((s) => s.updateBytes),
            0.5
          ) / 1024
        ).toFixed(2)} | ${(
          q(
            rows.map((s) => s.documentBytes),
            0.5
          ) / 1024
        ).toFixed(2)} | ${(
          q(
            rows.map((s) => s.memory.bytes),
            0.5
          ) / 1048576
        ).toFixed(3)} |`
      )
    }
  if (!summary) {
    lines.push(
      '',
      '## Timing dispersion',
      '',
      '| Workload | Mode | Operation | Median ms | IQR ms |',
      '| --- | --- | --- | ---: | ---: |'
    )
    for (const workload of new Set(report.samples.map((s) => s.workload)))
      for (const mode of ['individual', 'batch'] as const)
        for (const operation of [
          'author',
          'apply',
          'receive',
          'encode',
          'decode',
        ] as const) {
          const rows = report.samples
            .filter((s) => s.workload === workload && s.mode === mode)
            .map((s) => s[`${operation}Milliseconds`])
          lines.push(
            `| ${workload} | ${mode} | ${operation} | ${q(rows, 0.5).toFixed(3)} | ${(q(rows, 0.75) - q(rows, 0.25)).toFixed(3)} |`
          )
        }
  }
  lines.push(
    '',
    `Measured on ${report.environment}. Both modes group each author's binary Gossip into one MessagePack message. Batch Footage is uncompressed. Receive includes MessagePack decoding; apply excludes it. Document size follows complete acknowledgement exchange. Memory estimates use one receiver recreated from that compact checkpoint in a fresh runtime, excluding the author runtime. Preparation, verification, destruction and explicit JS process garbage collection are outside timings.`
  )
  return lines.join('\n') + '\n'
}
