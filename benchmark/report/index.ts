import { mkdir, writeFile } from 'node:fs/promises'
import { dirname, extname, resolve } from 'node:path'
import {
  management_names,
  operation_names,
  type BenchmarkReport,
  type ManagementResult,
  type MetricScope,
  type ReplicaName,
} from '../types.ts'

const replicas: Array<ReplicaName> = ['A', 'B', 'C']
const scopes: Array<MetricScope> = [
  'scaleUp',
  'scaleDown',
  'fullLifecycle',
]

const microseconds = (nanoseconds: number | null): string =>
  nanoseconds === null ? '—' : (nanoseconds / 1_000).toFixed(3)

const decimal = (value: number | null): string =>
  value === null ? '—' : value.toFixed(3)

const metricAverage = (metric: ManagementResult): string =>
  microseconds(metric.averageNanoseconds)

const metricCount = (metric: ManagementResult): string =>
  metric.count.toLocaleString('en-US')

const row = (cells: Array<string | number>): string =>
  '| ' + cells.join(' | ') + ' |'

const makeMarkdown = (report: BenchmarkReport): string => {
  const lines: Array<string> = [
    '# Sequencer dynamic lifecycle benchmark',
    '',
    'Generated: ' + report.generatedAt,
    '',
    'Node ' +
      report.environment.node +
      '; V8 ' +
      report.environment.v8 +
      '; ' +
      report.environment.platform +
      ' ' +
      report.environment.architecture +
      '; ' +
      report.environment.cpu +
      '.',
    '',
    'Runs: ' +
      report.config.runs +
      '; lifecycle: 0 → ' +
      report.config.maximumStripCount.toLocaleString('en-US') +
      ' → 0 visible Strips; Strip length: ' +
      report.config.minimumStripFrameLength +
      '…' +
      report.config.maximumStripFrameLength +
      ' Frames.',
    '',
    'Latencies use the authoritative sample-weighted arithmetic average. All latency columns are µs/op.',
    '',
    '## Aggregate operation latency',
    '',
    '| Replica | scope | operation | calls | ops/sec | weighted avg | mean run avg | median run avg | std. dev. | minimum run | maximum run |',
    '| --- | --- | --- | ---: | ---: | ---: | ---: | ---: | ---: | --- | --- |',
  ]

  for (const replica of replicas)
    for (const scope of scopes)
      for (const operation of operation_names) {
        const aggregate = report.aggregates[replica][scope][operation]
        lines.push(
          row([
            replica,
            scope,
            operation,
            aggregate.totalSampleCount.toLocaleString('en-US'),
            aggregate.sampleWeightedOperationsPerSecond === null
              ? '—'
              : Math.round(
                  aggregate.sampleWeightedOperationsPerSecond
                ).toLocaleString('en-US'),
            microseconds(aggregate.sampleWeightedAverageNanoseconds),
            microseconds(aggregate.meanRunAverageNanoseconds),
            microseconds(aggregate.medianRunAverageNanoseconds),
            microseconds(aggregate.standardDeviationNanoseconds),
            aggregate.minimumRun
              ? aggregate.minimumRun.run +
                ': ' +
                microseconds(aggregate.minimumRun.averageNanoseconds)
              : '—',
            aggregate.maximumRun
              ? aggregate.maximumRun.run +
                ': ' +
                microseconds(aggregate.maximumRun.averageNanoseconds)
              : '—',
          ])
        )
      }

  lines.push(
    '',
    '## Scaling performance',
    '',
    'Checkpoint values are cumulative full-lifecycle averages at that point and are never reset.',
    '',
    '| Run | direction | Strips | Frames | Replica | operation | calls | ops/sec | avg | min | max |',
    '| ---: | --- | ---: | ---: | --- | --- | ---: | ---: | ---: | ---: | ---: |'
  )
  for (const run of report.runs)
    for (const checkpoint of run.checkpoints)
      for (const replica of replicas)
        for (const operation of operation_names) {
          const metric = checkpoint.replicas[replica].operations[operation]
          lines.push(
            row([
              run.run,
              checkpoint.direction,
              checkpoint.stripCount.toLocaleString('en-US'),
              checkpoint.frameCount.toLocaleString('en-US'),
              replica,
              operation,
              metric.count.toLocaleString('en-US'),
              metric.operationsPerSecond === null
                ? '—'
                : Math.round(metric.operationsPerSecond).toLocaleString(
                    'en-US'
                  ),
              microseconds(metric.averageNanoseconds),
              microseconds(metric.minimumNanoseconds),
              microseconds(metric.maximumNanoseconds),
            ])
          )
        }

  lines.push(
    '',
    '## Management performance',
    '',
    '| Run | direction | Strips | Replica | operation | calls | ops/sec | avg |',
    '| ---: | --- | ---: | --- | --- | ---: | ---: | ---: |'
  )
  for (const run of report.runs)
    for (const checkpoint of run.checkpoints)
      for (const replica of replicas)
        for (const operation of management_names) {
          const metric = checkpoint.replicas[replica].management[operation]
          lines.push(
            row([
              run.run,
              checkpoint.direction,
              checkpoint.stripCount.toLocaleString('en-US'),
              replica,
              operation,
              metricCount(metric),
              metric.operationsPerSecond === null
                ? '—'
                : Math.round(metric.operationsPerSecond).toLocaleString(
                    'en-US'
                  ),
              metricAverage(metric),
            ])
          )
        }

  lines.push(
    '',
    '## Memory and storage efficiency',
    '',
    '| Run | direction | Replica | remove | compact | visible Strips | retained structural Strips | Frames | estimated memory bytes | memory B/Strip | memory B/Frame | snapshot before | snapshot after | before B/Strip | after B/Strip | before B/Frame | after B/Frame | process RSS |',
    '| ---: | --- | --- | --- | --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |'
  )
  for (const run of report.runs)
    for (const checkpoint of run.checkpoints)
      for (const replica of replicas) {
        const observed = checkpoint.replicas[replica]
        lines.push(
          row([
            run.run,
            checkpoint.direction,
            replica,
            observed.policy.remove,
            observed.policy.compact,
            observed.strips.stripCount.toLocaleString('en-US'),
            observed.strips.retainedStructuralStripCount.toLocaleString(
              'en-US'
            ),
            observed.strips.frameCount.toLocaleString('en-US'),
            observed.memory.bytes.toLocaleString('en-US'),
            decimal(observed.memory.bytesPerStrip),
            decimal(observed.memory.bytesPerFrame),
            observed.storage.beforeCompactBytes.toLocaleString('en-US'),
            observed.storage.afterCompactBytes.toLocaleString('en-US'),
            decimal(observed.storage.beforeCompactBytesPerStrip),
            decimal(observed.storage.afterCompactBytesPerStrip),
            decimal(observed.storage.beforeCompactBytesPerFrame),
            decimal(observed.storage.afterCompactBytesPerFrame),
            checkpoint.processMemory.rssBytes.toLocaleString('en-US'),
          ])
        )
      }

  lines.push(
    '',
    '## Lifecycle space averages',
    '',
    '| Run | Replica | scope | memory B/Strip | memory B/Frame | storage before B/Strip | storage after B/Strip | storage before B/Frame | storage after B/Frame |',
    '| ---: | --- | --- | ---: | ---: | ---: | ---: | ---: | ---: |'
  )
  for (const run of report.runs)
    for (const replica of replicas)
      for (const scope of scopes) {
        const space = run.replicas[replica].spaceAverages[scope]
        lines.push(
          row([
            run.run,
            replica,
            scope,
            decimal(space.memoryBytesPerStrip.averageBytesPerUnit),
            decimal(space.memoryBytesPerFrame.averageBytesPerUnit),
            decimal(
              space.storageBytesPerStripBeforeCompact.averageBytesPerUnit
            ),
            decimal(
              space.storageBytesPerStripAfterCompact.averageBytesPerUnit
            ),
            decimal(
              space.storageBytesPerFrameBeforeCompact.averageBytesPerUnit
            ),
            decimal(
              space.storageBytesPerFrameAfterCompact.averageBytesPerUnit
            ),
          ])
        )
      }

  lines.push(
    '',
    '## Measurement notes',
    '',
    '- ' + report.methodology.stripCount,
    '- ' + report.methodology.merge,
    '- ' + report.methodology.memory,
    '- ' + report.methodology.storage,
    '- Every checkpoint explicitly destroys the old Replica and initializes a fresh Replica from the post-compaction snapshot.',
    ''
  )
  return lines.join('\n')
}

export function printSummary(report: BenchmarkReport): void {
  console.log('\nFull-lifecycle aggregate (µs/op)')
  console.table(
    replicas.flatMap((replica) =>
      operation_names.map((operation) => {
        const metric = report.aggregates[replica].fullLifecycle[operation]
        return {
          replica,
          operation,
          calls: metric.totalSampleCount,
          'ops/sec':
            metric.sampleWeightedOperationsPerSecond === null
              ? '—'
              : Math.round(
                  metric.sampleWeightedOperationsPerSecond
                ).toLocaleString('en-US'),
          'weighted avg': microseconds(
            metric.sampleWeightedAverageNanoseconds
          ),
          'mean run': microseconds(metric.meanRunAverageNanoseconds),
          'min run': metric.minimumRun?.run ?? '—',
          'max run': metric.maximumRun?.run ?? '—',
        }
      })
    )
  )
}

export async function writeReports(
  report: BenchmarkReport
): Promise<{ jsonPath: string; markdownPath: string } | null> {
  if (report.config.outputPath === null) return null
  const requestedPath = resolve(report.config.outputPath)
  const jsonPath =
    extname(requestedPath).toLowerCase() === '.json'
      ? requestedPath
      : requestedPath + '.json'
  const markdownPath = jsonPath.slice(0, -5) + '.md'
  await mkdir(dirname(jsonPath), { recursive: true })
  await Promise.all([
    writeFile(jsonPath, JSON.stringify(report, null, 2) + '\n'),
    writeFile(markdownPath, makeMarkdown(report)),
  ])
  return { jsonPath, markdownPath }
}
