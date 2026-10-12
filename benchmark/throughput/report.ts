import { caseColumns, writeReportFiles } from '../.shared/report.ts'
import type { ThroughputReport } from './index.ts'

const row = (cells: Array<string | number>) => '| ' + cells.join(' | ') + ' |'
const decimal = (value: number | null) =>
  value === null ? '—' : value.toFixed(3)

/** Renders raw bursts and weighted totals without treating process memory as a per-Projection cost. */
export async function writeThroughputReport(report: ThroughputReport) {
  if (report.config.outputPath === null) return null
  const lines = [
    '# Sequencer throughput benchmark',
    '',
    'Generated: ' + report.generatedAt,
    '',
    `Node ${report.environment.node}; V8 ${report.environment.v8}; ${report.environment.platform} ${report.environment.architecture}; ${report.environment.cpu}.`,
    '',
    `Runs: ${report.config.runs}; initial Strips: ${report.config.checkpoints.join(', ')}; Strip length: ${report.config.minimumStripFrameLength}…${report.config.maximumStripFrameLength} Frames.`,
    '',
    `Each burst calls the synchronous public API for approximately ${report.config.burstMilliseconds} ms, up to ${report.config.maximumCalls} calls.`,
    '',
    '## Aggregate throughput',
    '',
    'Averages are weighted by call count across runs, using total burst time / total calls.',
    '',
    '| Method | case | initial Strips | calls | ops/sec | avg µs |',
    '| --- | --- | ---: | ---: | ---: | ---: |',
  ]
  for (const { initialStripCount, operation, metric } of report.aggregates)
    lines.push(
      row([
        ...Object.values(caseColumns(operation)),
        initialStripCount,
        metric.count,
        Math.round(metric.operationsPerSecond!),
        decimal(metric.averageNanoseconds! / 1_000),
      ])
    )
  lines.push(
    '',
    '## Bursts',
    '',
    '| Method | case | run | initial Strips | calls | elapsed ms | ops/sec | avg µs | initial Frames | final Frames |',
    '| --- | --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |'
  )
  for (const {
    run,
    initialStripCount,
    operation,
    metric,
    before,
    after,
  } of report.samples)
    lines.push(
      row([
        ...Object.values(caseColumns(operation)),
        run + 1,
        initialStripCount,
        metric.count,
        decimal(metric.totalNanoseconds / 1_000_000),
        Math.round(metric.operationsPerSecond!),
        decimal(metric.averageNanoseconds! / 1_000),
        before.frameCount,
        after.frameCount,
      ])
    )
  lines.push(
    '',
    '## Memory usage',
    '',
    'Estimated bytes describe the exported Sequence representation. Process memory is shared by all fixtures, inputs and temporary results; it is not attributable to one Projection. Use `node --expose-gc benchmark/index.ts --suite throughput` to collect garbage between bursts.',
    '',
    '| Method | case | run | initial Strips | visible Strips | initial estimated bytes | final estimated bytes | memory B/Strip | memory B/Frame | initial process RSS | final process RSS | final process heap used |',
    '| --- | --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |'
  )
  for (const {
    run,
    initialStripCount,
    operation,
    before,
    after,
  } of report.samples)
    lines.push(
      row([
        ...Object.values(caseColumns(operation)),
        run + 1,
        initialStripCount,
        after.stripCount,
        before.memory.bytes,
        after.memory.bytes,
        decimal(after.memory.bytesPerStrip),
        decimal(after.memory.bytesPerFrame),
        before.processMemory.rssBytes,
        after.processMemory.rssBytes,
        after.processMemory.heapUsedBytes,
      ])
    )
  lines.push(
    '',
    '## Disk usage',
    '',
    'Disk bytes are the size of `node:v8.serialize(sequence)`, excluding filesystem metadata; no disk I/O is timed.',
    '',
    '| Method | case | run | initial Strips | retained insertions | initial sequence bytes | final sequence bytes | disk B/Strip | disk B/Frame |',
    '| --- | --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |'
  )
  for (const {
    run,
    initialStripCount,
    operation,
    before,
    after,
  } of report.samples)
    lines.push(
      row([
        ...Object.values(caseColumns(operation)),
        run + 1,
        initialStripCount,
        after.retainedInsertionCount,
        before.storage.sequenceBytes,
        after.storage.sequenceBytes,
        decimal(after.storage.bytesPerStrip),
        decimal(after.storage.bytesPerFrame),
      ])
    )
  lines.push(
    '',
    '## Measurement notes',
    '',
    '- Each operation and checkpoint has an independent Projection and independent Footage. Starting data, payload generation, warmup, snapshots, serialization, fixture destruction and reporting are excluded from burst timing.',
    '- The timer includes the call loop, dispatch, target selection, and result assignment. Time is checked every 64 calls; slow batches can exceed the requested duration. Individual-call min/max are not measured.',
    '- Inserts carry generated Strip payloads; removes consume one visible Frame per call; replacements replace one visible Frame with one Frame. Mutating bursts retain history and are not reset between calls. Removes stop at the empty Projection; remove.sameIndex stops when the original index is no longer valid.',
    '- insert, remove, replace, value and bounded values each cover head, tail, middle, sameIndex and deterministic random positions. middle tracks the current midpoint; sameIndex keeps the initial midpoint fixed.',
    '- apply.insert, apply.remove and apply.replace receive fresh causally ordered tail operations generated by a sender outside timing. apply.duplicate, apply.duplicateRemove and apply.duplicateReplace repeatedly receive an already materialized insertion, removal or replacement, respectively.',
    '- merge.insert receives fresh causally ordered tail insertions; merge.duplicate repeatedly receives an already materialized insertion. Both merge cases include the same actor-only frontier; earlier parents are already materialized.',
    '- create.sequence hydrates the complete initial Sequence; create.empty constructs an empty Projection. Their temporary results are discarded before memory observation; before/after sizes describe the retained source fixture.',
    '- retire removes distinct active Actors established before timing. length reads the maintained count. values and sequence process the entire document; values.head/tail/middle/sameIndex/random each read min(maximum Strip length, initial Frame count) Frames.',
    '- Memory estimate: four bytes per Sequence metadata word plus eight bytes per JavaScript Footage slot. Visible Strip counts after a burst count positive insertions in the exported Sequence.',
    ''
  )
  return writeReportFiles(report.config.outputPath, report, lines.join('\n'))
}
