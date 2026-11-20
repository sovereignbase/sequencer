import type { Report } from './index.ts'
import { sourceLine } from '../.shared/readme.ts'

/** Median API latency and dispersion for each payload size and representation. */
export function render(report: Report, summary = false): string {
  const quantile = (values: number[], p: number) => {
    const sorted = values.toSorted((a, b) => a - b),
      at = (sorted.length - 1) * p
    return (
      sorted[Math.floor(at)] +
      (sorted[Math.ceil(at)] - sorted[Math.floor(at)]) * (at % 1)
    )
  }
  const lines = [
    ...(summary ? [] : ['# Large string benchmarks', '']),
    sourceLine(report),
    '',
    `${report.runs} runs; ${summary ? 'median throughput in ops/s. Sizes are UTF-16 code units.' : 'times are median ns/call. IQR is Q3 minus Q1.'}`,
    '',
  ]
  const keys = [
    ...new Set(
      report.samples.map((s) => `${s.size}/${s.operation}/${s.representation}`)
    ),
  ]
  if (summary) {
    const columns = [
      ...new Set(report.samples.map((s) => `${s.size}/${s.representation}`)),
    ]
    lines.push(
      `| Operation | ${columns
        .map((key) => {
          const [size, mode] = key.split('/')
          return `${Number(size).toLocaleString('en-US')} ${mode}`
        })
        .join(' | ')} |`,
      `| --- | ${columns.map(() => '---:').join(' | ')} |`
    )
    for (const operation of new Set(report.samples.map((s) => s.operation))) {
      const rates = columns.map((key) => {
        const values = report.samples
          .filter(
            (s) =>
              `${s.size}/${s.representation}` === key &&
              s.operation === operation
          )
          .map((s) => (s.milliseconds * 1e6) / s.calls)
        return values.length
          ? (1e9 / quantile(values, 0.5)).toLocaleString('en-US', {
              maximumFractionDigits: 0,
            })
          : '—'
      })
      lines.push(`| ${operation} | ${rates.join(' | ')} |`)
    }
  } else {
    lines.push(
      '| UTF-16 code units | Operation | Representation | Median ns | IQR ns |',
      '| ---: | --- | --- | ---: | ---: |'
    )
    for (const key of keys) {
      const values = report.samples
        .filter((s) => `${s.size}/${s.operation}/${s.representation}` === key)
        .map((s) => (s.milliseconds * 1e6) / s.calls)
      lines.push(
        `| ${key.split('/').join(' | ')} | ${quantile(values, 0.5).toFixed(2)} | ${(quantile(values, 0.75) - quantile(values, 0.25)).toFixed(2)} |`
      )
    }
  }
  lines.push(
    '',
    'Encoded snapshots use string Footage in both representations.',
    '',
    summary
      ? '#### Memory and encoded size'
      : '## Estimated retained memory and snapshot size',
    '',
    '| UTF-16 code units | Representation | Estimated MiB | Snapshot MessagePack KiB | Snapshot gzip KiB | Gossip MessagePack KiB | Gossip gzip KiB |',
    '| ---: | --- | ---: | ---: | ---: | ---: | ---: |'
  )
  for (const key of [
    ...new Set(report.space.map((s) => `${s.size}/${s.representation}`)),
  ]) {
    const rows = report.space.filter(
      (s) => `${s.size}/${s.representation}` === key
    )
    lines.push(
      `| ${key.split('/').join(' | ')} | ${(
        [
          'estimatedBytes',
          'messagePackBytes',
          'gzipBytes',
          'updateMessagePackBytes',
          'updateGzipBytes',
        ] as const
      )
        .map((k) =>
          (
            quantile(
              rows.map((r) => r[k]),
              0.5
            ) / (k === 'estimatedBytes' ? 1048576 : 1024)
          ).toFixed(k === 'estimatedBytes' ? 4 : 2)
        )
        .join(' | ')} |`
    )
  }
  lines.push(
    '',
    `Measured on ${report.environment}. Splitting and text assembly are included where required; peer preparation, encoding and explicit JS process garbage collection are outside API timings.`
  )
  return lines.join('\n') + '\n'
}
