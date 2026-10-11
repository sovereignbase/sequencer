import { caseColumns, writeReportFiles } from '../.shared/report.ts'
import {
  aggregate_names,
  management_names,
  operation_names,
  type BenchmarkReport,
  type ManagementResult,
  type MetricScope,
  type ReplicaName,
} from '../.shared/types.ts'

const replicas: Array<ReplicaName> = ['A']
const scopes: Array<MetricScope> = ['scaleUp', 'scaleDown', 'fullLifecycle']

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

const spaceRows = (report: BenchmarkReport, kind: 'memory' | 'storage') =>
  replicas.flatMap((replica) =>
    scopes.map((scope) => {
      const space = report.spaceAggregates[replica][scope]
      const strips =
        kind === 'memory'
          ? space.memoryBytesPerStrip
          : space.storageBytesPerStrip
      const frames =
        kind === 'memory'
          ? space.memoryBytesPerFrame
          : space.storageBytesPerFrame
      return {
        replica,
        scope,
        observations: strips.observationCount,
        'avg bytes': decimal(
          strips.observationCount === 0
            ? null
            : strips.totalBytes / strips.observationCount
        ),
        'B/Strip': decimal(strips.averageBytesPerUnit),
        'B/Frame': decimal(frames.averageBytesPerUnit),
      }
    })
  )

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
    '| Method | case | Replica | scope | calls | ops/sec | weighted avg | mean run avg | median run avg | std. dev. | minimum run | maximum run |',
    '| --- | --- | --- | --- | ---: | ---: | ---: | ---: | ---: | ---: | --- | --- |',
  ]

  for (const replica of replicas)
    for (const operation of aggregate_names)
      for (const scope of scopes) {
        const aggregate = report.aggregates[replica][scope][operation]
        lines.push(
          row([
            ...Object.values(caseColumns(operation)),
            replica,
            scope,
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

  for (const kind of ['memory', 'storage'] as const) {
    lines.push(
      '',
      '## Aggregate ' + (kind === 'memory' ? 'memory usage' : 'disk usage'),
      '',
      'Nonempty checkpoint observations across all runs. Bytes per unit use total bytes divided by total units.',
      '',
      '| Replica | scope | observations | avg bytes | B/Strip | B/Frame |',
      '| --- | --- | ---: | ---: | ---: | ---: |',
      ...spaceRows(report, kind).map((space) => row(Object.values(space)))
    )
  }

  lines.push(
    '',
    '## Scaling performance',
    '',
    'Checkpoint values are cumulative full-lifecycle averages at that point and are never reset.',
    '',
    '| Method | case | Run | direction | Strips | Frames | Replica | calls | ops/sec | avg | min | max |',
    '| --- | --- | ---: | --- | ---: | ---: | --- | ---: | ---: | ---: | ---: | ---: |'
  )
  for (const operation of operation_names)
    for (const run of report.runs)
      for (const checkpoint of run.checkpoints)
        for (const replica of replicas) {
          const metric = checkpoint.replicas[replica].operations[operation]
          lines.push(
            row([
              ...Object.values(caseColumns(operation)),
              run.run,
              checkpoint.direction,
              checkpoint.stripCount.toLocaleString('en-US'),
              checkpoint.frameCount.toLocaleString('en-US'),
              replica,
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
    '| Method | case | Run | direction | Strips | Replica | calls | ops/sec | avg |',
    '| --- | --- | ---: | --- | ---: | --- | ---: | ---: | ---: |'
  )
  for (const operation of management_names)
    for (const run of report.runs)
      for (const checkpoint of run.checkpoints)
        for (const replica of replicas) {
          const metric = checkpoint.replicas[replica].management[operation]
          lines.push(
            row([
              ...Object.values(caseColumns(operation)),
              run.run,
              checkpoint.direction,
              checkpoint.stripCount.toLocaleString('en-US'),
              replica,
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
    '## Memory usage',
    '',
    'Estimated bytes describe the exported Sequence representation. Process memory is shared by both peers, benchmark fixtures and temporary results.',
    '',
    '| Run | direction | Replica | visible Strips | retained insertions | Frames | estimated memory bytes | memory B/Strip | memory B/Frame | process RSS | process heap used |',
    '| ---: | --- | --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |'
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
            observed.strips.stripCount.toLocaleString('en-US'),
            observed.strips.retainedDeltaCount.toLocaleString('en-US'),
            observed.strips.frameCount.toLocaleString('en-US'),
            observed.memory.bytes.toLocaleString('en-US'),
            decimal(observed.memory.bytesPerStrip),
            decimal(observed.memory.bytesPerFrame),
            checkpoint.processMemory.rssBytes.toLocaleString('en-US'),
            checkpoint.processMemory.heapUsedBytes.toLocaleString('en-US'),
          ])
        )
      }

  lines.push(
    '',
    '## Disk usage',
    '',
    'Disk bytes are the size of node:v8.serialize(sequence), excluding filesystem metadata; no disk I/O is timed.',
    '',
    '| Run | direction | Replica | visible Strips | Frames | sequence bytes | disk B/Strip | disk B/Frame |',
    '| ---: | --- | --- | ---: | ---: | ---: | ---: | ---: |'
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
            observed.strips.stripCount,
            observed.strips.frameCount,
            observed.storage.sequenceBytes,
            decimal(observed.storage.bytesPerStrip),
            decimal(observed.storage.bytesPerFrame),
          ])
        )
      }

  lines.push(
    '',
    '## Lifecycle space averages',
    '',
    '| Run | Replica | scope | memory B/Strip | memory B/Frame | storage B/Strip | storage B/Frame |',
    '| ---: | --- | --- | ---: | ---: | ---: | ---: |'
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
            decimal(space.storageBytesPerStrip.averageBytesPerUnit),
            decimal(space.storageBytesPerFrame.averageBytesPerUnit),
          ])
        )
      }

  lines.push(
    '',
    '## Measurement notes',
    '',
    '- ' + report.methodology.stripCount,
    '- ' + report.methodology.ingest,
    '- ' + report.methodology.memory,
    '- ' + report.methodology.storage,
    '- Every checkpoint measures temporary Projection creation without replacing the two active gossip peers.',
    ''
  )
  return lines.join('\n')
}

export function printSummary(report: BenchmarkReport): void {
  console.log('\nFull-lifecycle aggregate (µs/op)')
  console.table(
    replicas.flatMap((replica) =>
      aggregate_names.map((operation) => {
        const metric = report.aggregates[replica].fullLifecycle[operation]
        return {
          replica,
          ...caseColumns(operation),
          calls: metric.totalSampleCount,
          'ops/sec':
            metric.sampleWeightedOperationsPerSecond === null
              ? '—'
              : Math.round(
                  metric.sampleWeightedOperationsPerSecond
                ).toLocaleString('en-US'),
          'weighted avg': microseconds(metric.sampleWeightedAverageNanoseconds),
          'mean run': microseconds(metric.meanRunAverageNanoseconds),
          'min run': metric.minimumRun?.run ?? '—',
          'max run': metric.maximumRun?.run ?? '—',
        }
      })
    )
  )
  console.log('Full-lifecycle memory usage (estimated Sequence memory)')
  console.table(
    spaceRows(report, 'memory').filter(
      (space) => space.scope === 'fullLifecycle'
    )
  )
  console.log('Full-lifecycle disk usage (serialized Sequence)')
  console.table(
    spaceRows(report, 'storage').filter(
      (space) => space.scope === 'fullLifecycle'
    )
  )
}

export async function writeReports(
  report: BenchmarkReport
): Promise<{ jsonPath: string; markdownPath: string } | null> {
  if (report.config.outputPath === null) return null
  return writeReportFiles(
    report.config.outputPath,
    report,
    makeMarkdown(report)
  )
}
