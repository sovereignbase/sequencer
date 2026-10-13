import { readFile, writeFile } from 'node:fs/promises'
import { relative } from 'node:path'
import { fileURLToPath } from 'node:url'
import {
  management_names,
  operation_names,
  type BenchmarkReport,
  type CheckpointResult,
} from '../.shared/types.ts'

/** Arithmetic mean of independent run observations; absent timings remain absent. */
const mean = (values: Array<number | null>): number | null => {
  const observed = values.filter((value): value is number => value !== null)
  return observed.length
    ? observed.reduce((sum, value) => sum + value, 0) / observed.length
    : null
}
/** Binary storage units shared by bundle, Sequence, and process-memory tables. */
const kib = (bytes: number | null): string =>
  bytes === null ? '—' : (bytes / 1024).toFixed(2)
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

  const scales = report.config.checkpoints.filter((scale) => scale > 0)
  const checkpoints = scales.map((scale) =>
    report.runs.map((run) => {
      const checkpoint = run.checkpoints.find(
        (value) => value.direction === 'up' && value.stripCount === scale
      )
      if (!checkpoint)
        throw new Error(`Missing growth checkpoint ${scale} in run ${run.run}`)
      return checkpoint
    })
  )
  const row = (cells: string[]): string => `| ${cells.join(' | ')} |`
  const table = (label: string, rows: string[][]): string[] => [
    row([label, ...scales.map((scale) => scale.toLocaleString('en-US'))]),
    row(['---', ...scales.map(() => '---:')]),
    ...rows.map(row),
  ]
  const cells = (
    select: (checkpoint: CheckpointResult) => number | null,
    format = rate
  ): string[] => checkpoints.map((points) => format(mean(points.map(select))))
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
    '### Average throughput during editing from 0 to checkpoint',
    '',
    `Arithmetic means of ${report.runs.length} runs during growth, in ops/s. Checkpoints`,
    `are visible Strip counts; generated Strips contain ${report.config.minimumStripFrameLength}–${report.config.maximumStripFrameLength} Frames.`,
    '',
    ...table(
      'Method / case',
      operation_names.map((operation) => [
        operation,
        ...cells(
          (point) => point.replicas.A.operations[operation].operationsPerSecond
        ),
      ])
    ),
    '',
    '### API throughput at checkpoint',
    '',
    'Checkpoint calls, in ops/s, averaged across runs.',
    '',
    ...table(
      'Method',
      management_names.map((operation) => [
        operation === 'create'
          ? 'new Projection(actorID, sequence)'
          : `${operation}()`,
        ...cells(
          (point) => point.replicas.A.management[operation].operationsPerSecond
        ),
      ])
    ),
    '',
    '### Sequence disk size at checkpoint',
    '',
    'Complete exported Sequences, including Footage and acknowledgements. Sizes are in KiB.',
    '',
    ...table('Encoding', [
      ['JSON', ...cells((point) => point.replicas.A.storage.jsonBytes, kib)],
      [
        'JSON + gzip',
        ...cells((point) => point.replicas.A.storage.jsonGzipBytes, kib),
      ],
      [
        'MessagePack',
        ...cells((point) => point.replicas.A.storage.messagePackBytes, kib),
      ],
      [
        'MessagePack + gzip',
        ...cells((point) => point.replicas.A.storage.messagePackGzipBytes, kib),
      ],
    ]),
    '',
    '### Memory usage at checkpoint',
    '',
    ...table('Measurement', [
      ['Visible Frames', ...cells((point) => point.frameCount)],
      [
        'Local edit calls',
        ...cells((point) =>
          operation_names
            .filter((operation) => /^(insert|remove|replace)\./.test(operation))
            .reduce(
              (sum, operation) =>
                sum + point.replicas.A.operations[operation].count,
              0
            )
        ),
      ],
      [
        'Estimated Sequence (KiB)',
        ...cells((point) => point.replicas.A.memory.bytes, kib),
      ],
      [
        'Process heap used (KiB)',
        ...cells((point) => point.processMemory.heapUsedBytes, kib),
      ],
      [
        'Process RSS (KiB)',
        ...cells((point) => point.processMemory.rssBytes, kib),
      ],
    ]),
    '',
    'Sequence memory estimates use four bytes per metadata word and eight per Footage slot.',
    'Process memory includes both peers and the benchmark fixtures.',
    '',
    `Measured on Node ${report.environment.node}, V8 ${report.environment.v8},`,
    `${report.environment.platform} ${report.environment.architecture}, ${report.environment.cpu}.`,
    `Peer synchronization, encoding and garbage collection are outside API timings. [Full lifecycle results](${link}).`,
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
