import { readFile, writeFile } from 'node:fs/promises'
import { relative } from 'node:path'
import { fileURLToPath } from 'node:url'
import {
  management_names,
  operation_names,
  type BenchmarkReport,
  type CheckpointResult,
  type Direction,
  type OperationName,
} from '../.shared/types.ts'

/** Arithmetic mean of independent run observations; absent timings remain absent. */
const mean = (values: Array<number | null>): number | null => {
  const observed = values.filter((value): value is number => value !== null)
  return observed.length
    ? observed.reduce((sum, value) => sum + value, 0) / observed.length
    : null
}
/** Binary storage units shared by bundle and Sequence tables. */
const kib = (bytes: number | null): string =>
  bytes === null
    ? '—'
    : (bytes / 1024).toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })
const rate = (value: number | null): string =>
  value === null
    ? '—'
    : value.toLocaleString('en-US', { maximumFractionDigits: 0 })

/**
 * Replaces the README benchmark section with checkpoint means from the completed lifecycle.
 * @param report Independent runs and their measured bundle sizes.
 * @param markdownPath Full report linked from the README.
 */
export async function updateLifecycleReadme(
  report: BenchmarkReport,
  markdownPath: string
): Promise<void> {
  const root = fileURLToPath(new URL('../../', import.meta.url))
  const readmePath = new URL('../../README.md', import.meta.url)
  const original = await readFile(readmePath, 'utf8')
  const bundles = report.bundles
  const newline = original.includes('\r\n') ? '\r\n' : '\n'
  const start = original.indexOf(`## Benchmarks${newline}`)
  const end = original.indexOf(`## Tests${newline}`, start)
  if (start < 0 || end < 0 || !bundles)
    throw new Error('Missing benchmark section or bundle measurements')

  const findCheckpoint = (
    run: BenchmarkReport['runs'][number],
    direction: Direction,
    scale: number
  ): CheckpointResult => {
    const checkpoint = run.checkpoints.find(
      (value) => value.direction === direction && value.stripCount === scale
    )
    if (!checkpoint)
      throw new Error(
        `Missing ${direction} checkpoint ${scale} in run ${run.run}`
      )
    return checkpoint
  }
  const maximum = report.config.maximumStripCount
  const growthTotals = new Map(
    report.runs.map((run) => [run.run, findCheckpoint(run, 'up', maximum)])
  )
  // Stored counters cover the entire lifecycle; subtract growth for shrink-only rates.
  const phaseMetric = (point: CheckpointResult, operation: OperationName) => {
    const current = point.replicas.A.operations[operation]
    const baseline =
      point.direction === 'down'
        ? growthTotals.get(point.run)!.replicas.A.operations[operation]
        : null
    const count = current.count - (baseline?.count ?? 0)
    const nanoseconds =
      current.totalNanoseconds - (baseline?.totalNanoseconds ?? 0)
    return {
      count,
      operationsPerSecond: count === 0 ? null : (count * 1e9) / nanoseconds,
    }
  }
  const phases = (['up', 'down'] as const).map((direction) => {
    const scales = report.config.checkpoints.filter((scale) =>
      direction === 'up' ? scale > 0 : scale < maximum
    )
    if (direction === 'down') scales.reverse()
    return {
      label:
        direction === 'up'
          ? `**↑ Scale up (0 → ${rate(maximum)} Strips)**`
          : `**↓ Scale down (${rate(maximum)} → 0 Strips)**`,
      scales,
      checkpoints: scales.map((scale) =>
        report.runs.map((run) => findCheckpoint(run, direction, scale))
      ),
    }
  })
  const row = (cells: string[]): string => `| ${cells.join(' | ')} |`
  type Measurement = [
    label: string,
    select: (checkpoint: CheckpointResult) => number | null,
    format?: (value: number | null) => string,
  ]
  const tables = (label: string, measurements: Measurement[]): string[] =>
    phases.flatMap((phase) => [
      phase.label,
      '',
      row([label, ...phase.scales.map(rate)]),
      row(['---', ...phase.scales.map(() => '---:')]),
      ...measurements.map(([name, select, format = rate]) =>
        row([
          name,
          ...phase.checkpoints.map((points) =>
            format(mean(points.map(select)))
          ),
        ])
      ),
      '',
    ])
  const link = relative(root, markdownPath).replaceAll('\\', '/')
  const lines = [
    '## Benchmarks',
    '',
    '### Moderate bundle size',
    '',
    '| Format | Raw (KiB) | Minified (KiB) | Minified + gzip (KiB) |',
    '| --- | ---: | ---: | ---: |',
    ...(['ESM', 'CommonJS'] as const).map((format) =>
      row([
        format,
        kib(bundles[format].rawBytes),
        kib(bundles[format].minifiedBytes),
        kib(bundles[format].gzipBytes),
      ])
    ),
    '',
    'Both bundles include WASM. Terser uses three compression passes; gzip uses level 9.',
    '',
    '### Average throughput during editing to checkpoint',
    '',
    `Arithmetic means of ${report.runs.length} runs, in ops/s, from each phase's start to checkpoint.`,
    `Checkpoints are visible Strip counts; generated Strips contain ${report.config.minimumStripFrameLength}–${report.config.maximumStripFrameLength} Frames.`,
    '',
    ...tables(
      'Method / case',
      operation_names.map((operation) => [
        operation,
        (point) => phaseMetric(point, operation).operationsPerSecond,
      ])
    ),
    '',
    '### API throughput at checkpoint',
    '',
    'Checkpoint calls, in ops/s, averaged across runs.',
    '',
    ...tables(
      'Method',
      management_names.map((operation) => [
        operation === 'create'
          ? 'new Projection(actorID, sequence)'
          : `${operation}()`,
        (point) => point.replicas.A.management[operation].operationsPerSecond,
      ])
    ),
    '',
    '### Sequence disk size at checkpoint',
    '',
    'Complete exported Sequences, including Footage and acknowledgements. Sizes are in KiB.',
    '',
    ...tables('Encoding', [
      ['JSON', (point) => point.replicas.A.storage.jsonBytes, kib],
      ['JSON + gzip', (point) => point.replicas.A.storage.jsonGzipBytes, kib],
      [
        'MessagePack',
        (point) => point.replicas.A.storage.messagePackBytes,
        kib,
      ],
      [
        'MessagePack + gzip',
        (point) => point.replicas.A.storage.messagePackGzipBytes,
        kib,
      ],
    ]),
    '',
    '### Memory usage at checkpoint',
    '',
    'Estimated retained Sequence memory, in KiB (1,024 bytes).',
    '',
    ...tables('Measurement', [
      ['Estimated memory (KiB)', (point) => point.replicas.A.memory.bytes, kib],
    ]),
    '',
    `Measured on Node ${report.environment.node}, V8 ${report.environment.v8},`,
    `${report.environment.platform} ${report.environment.architecture}, ${report.environment.cpu}.`,
    'Peer synchronization, encoding and JS process garbage collection are outside API timings.',
    `[Full lifecycle results](${link}) · [Throughput results](benchmark/.results/throughput.md).`,
    '',
    '',
  ]
  // Format only the generated section so manual README content remains untouched.
  const { format, resolveConfig } = await import('prettier')
  const section = await format(lines.join('\n'), {
    ...(await resolveConfig(fileURLToPath(readmePath))),
    parser: 'markdown',
    endOfLine: newline === '\r\n' ? 'crlf' : 'lf',
  })
  await writeFile(
    readmePath,
    original.slice(0, start) + section + newline + original.slice(end)
  )
}
