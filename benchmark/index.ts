import { arch, cpus, platform } from 'node:os'
import { resolve } from 'node:path'
import { pathToFileURL } from 'node:url'
import { aggregateRuns, runLifecycles, warmUp } from './lifecycle/index.ts'
import { printSummary, writeReports } from './report/index.ts'
import type { BenchmarkConfig, BenchmarkReport } from './types.ts'

// POWERS OF 10 (^0 ^1 ^2 ^3 ^4 ^5)
const defaultCheckpoints = [1, 10, 100, 1_000, 10_000]

const usage = [
  'Sequencer TypeScript API lifecycle benchmark',
  '',
  'Usage:',
  '  npm run bench -- [options]',
  '',
  'Options:',
  '  --runs <n>            Complete runs (default: 3)',
  '  --max-strips <n>      Maximum visible Strip count (default: 10_000)',
  '  --seed <text>          Reproducible base seed (default: sequencer-lifecycle-v1)',
  '  --warmup-cycles <n>    Unreported up/down workload cycles (default: 64)',
  '  --strip-length <n>     Use one fixed Strip length instead of 1...100',
  '  --min-strip-length <n> Minimum generated Strip length (default: 1)',
  '  --max-strip-length <n> Maximum generated Strip length (default: 100)',
  '  --output <path>        JSON output path; Markdown uses the same basename',
  '  --no-output            Run without writing report files',
  '  --help                 Show this help',
].join('\n')

const readInteger = (name: string, value: string | undefined): number => {
  if (value === undefined) throw new TypeError(name + ' requires a value.')
  const parsed = Number(value)
  if (!Number.isSafeInteger(parsed))
    throw new TypeError(name + ' must be an integer.')
  return parsed
}

export function parseConfig(arguments_: Array<string>): BenchmarkConfig {
  let runs = 3
  let maximumStripCount = 10_000
  let warmupCycles = 64
  let minimumStripFrameLength = 1
  let maximumStripFrameLength = 100
  let baseSeed = 'sequencer-lifecycle-v1'
  let outputPath: string | null = 'benchmark/results/lifecycle.json'

  for (let index = 0; index < arguments_.length; index++) {
    const argument = arguments_[index]
    if (argument === '--help') {
      console.log(usage)
      process.exit(0)
    } else if (argument === '--runs')
      runs = readInteger(argument, arguments_[++index])
    else if (argument === '--max-strips')
      maximumStripCount = readInteger(argument, arguments_[++index])
    else if (argument === '--warmup-cycles')
      warmupCycles = readInteger(argument, arguments_[++index])
    else if (argument === '--strip-length') {
      const length = readInteger(argument, arguments_[++index])
      minimumStripFrameLength = length
      maximumStripFrameLength = length
    } else if (argument === '--min-strip-length')
      minimumStripFrameLength = readInteger(argument, arguments_[++index])
    else if (argument === '--max-strip-length')
      maximumStripFrameLength = readInteger(argument, arguments_[++index])
    else if (argument === '--seed') {
      const value = arguments_[++index]
      if (!value) throw new TypeError('--seed requires a nonempty value.')
      baseSeed = value
    } else if (argument === '--output') {
      const value = arguments_[++index]
      if (!value) throw new TypeError('--output requires a path.')
      outputPath = value
    } else if (argument === '--no-output') outputPath = null
    else throw new TypeError('Unknown benchmark option: ' + argument)
  }

  if (runs <= 0) throw new RangeError('--runs must be greater than zero.')
  if (maximumStripCount <= 0)
    throw new RangeError('--max-strips must be greater than zero.')
  if (warmupCycles < 0)
    throw new RangeError('--warmup-cycles cannot be negative.')
  if (
    minimumStripFrameLength <= 0 ||
    maximumStripFrameLength < minimumStripFrameLength ||
    maximumStripFrameLength > 0xffff_ffff
  )
    throw new RangeError(
      'Strip lengths must satisfy 1 <= minimum <= maximum <= 4294967295.'
    )

  const checkpoints = Array.from(
    new Set([
      ...defaultCheckpoints.filter(
        (checkpoint) => checkpoint <= maximumStripCount
      ),
      maximumStripCount,
    ])
  ).sort((left, right) => left - right)

  return {
    runs,
    maximumStripCount,
    checkpoints,
    minimumStripFrameLength,
    maximumStripFrameLength,
    warmupCycles,
    replicaPolicies: {
      A: { remove: 'soft', compact: 'hard' },
    },
    baseSeed,
    outputPath,
  }
}

export async function runBenchmark(
  config: BenchmarkConfig
): Promise<BenchmarkReport> {
  console.log(
    'Warming TypeScript API (' +
      config.warmupCycles.toLocaleString('en-US') +
      ' cycles)...'
  )
  await warmUp(config)
  const runs = await runLifecycles(config)
  return {
    schemaVersion: 1,
    generatedAt: new Date().toISOString(),
    environment: {
      node: process.versions.node,
      v8: process.versions.v8,
      platform: platform(),
      architecture: arch(),
      cpu: cpus()[0]?.model ?? 'Unknown CPU',
    },
    config,
    methodology: {
      implementation:
        'TypeScript public API backed by the package WebAssembly runtime',
      timer: 'process.hrtime.bigint',
      stripCount:
        'Scale is the number of visible logical Strips maintained by the benchmark model. Every mutation targets a complete Strip boundary; retained Mask structures are reported separately.',
      merge:
        'Each policy workload has two Replicas editing the same document. Local Deltas are synchronized to the peer outside timed regions; randomMerge times the measured Replica integrating a newly issued, equal-length replacement Delta from its peer, including both its Mask and new Footage.',
      average:
        'Operation averages are calculated directly from count and total measured nanoseconds; checkpoint averages are never averaged together.',
      memory:
        'Per-Replica bytes after policy compaction and restart are an explicit estimate: four bytes per retained native snapshot word plus eight bytes per JavaScript Footage array slot. Process RSS is shared and reported at checkpoint scope; WebAssembly linear memory is unavailable through the public API.',
      storage:
        'Persistent representation size is the byte length of node:v8.serialize over the public snapshot before and after isolated hard compaction.',
    },
    runs,
    aggregates: aggregateRuns(runs),
  }
}

async function main(): Promise<void> {
  const config = parseConfig(process.argv.slice(2))
  const report = await runBenchmark(config)
  printSummary(report)
  const paths = await writeReports(report)
  if (paths) {
    console.log('\nJSON report: ' + paths.jsonPath)
    console.log('Markdown report: ' + paths.markdownPath)
  }
}

const entryPath = process.argv[1]
if (
  entryPath !== undefined &&
  import.meta.url === pathToFileURL(resolve(entryPath)).href
)
  await main()
