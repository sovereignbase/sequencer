import { resolve } from 'node:path'
import { pathToFileURL } from 'node:url'
import { runBenchmark } from './lifecycle/index.ts'
import { printSummary, writeReports } from './lifecycle/report.ts'
import { runThroughput } from './throughput/index.ts'
import { writeThroughputReport } from './throughput/report.ts'
import type { BenchmarkConfig } from './.shared/types.ts'

const defaults = {
  suites: ['lifecycle', 'throughput'] as const,
  runs: 3,
  maximumStripCount: { lifecycle: 10_000, throughput: 10_000 },
  initialStripCount: 100,
  burstMilliseconds: 100,
  maximumCalls: 10_000,
  warmupCycles: 64,
  minimumStripFrameLength: 1,
  maximumStripFrameLength: 100,
  baseSeed: 'sequencer-lifecycle-v1',
  outputDirectory: 'benchmark/.results',
  checkpoints: [1, 10, 100, 1_000, 10_000, 100_000, 1_000_000],
}

const usage = [
  'Sequencer TypeScript API benchmarks',
  '',
  'Usage:',
  '  npm run bench -- [options]',
  '',
  'Options:',
  '  --suite <name>        lifecycle or throughput (default: both)',
  `  --start-strips <n>    Throughput starting size (default: ${defaults.initialStripCount})`,
  `  --burst-ms <n>        Throughput burst duration (default: ${defaults.burstMilliseconds})`,
  `  --max-calls <n>       Throughput call limit per burst (default: ${defaults.maximumCalls})`,
  `  --runs <n>            Complete runs (default: ${defaults.runs})`,
  `  --max-strips <n>      Maximum Strip count (lifecycle: ${defaults.maximumStripCount.lifecycle}; throughput: ${defaults.maximumStripCount.throughput})`,
  `  --seed <text>         Reproducible base seed (default: ${defaults.baseSeed})`,
  `  --warmup-cycles <n>   Unreported lifecycle cycles / throughput calls (default: ${defaults.warmupCycles})`,
  '  --strip-length <n>    Use one fixed Strip length',
  `  --min-strip-length <n> Minimum generated Strip length (default: ${defaults.minimumStripFrameLength})`,
  `  --max-strip-length <n> Maximum generated Strip length (default: ${defaults.maximumStripFrameLength})`,
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
  let suite: BenchmarkConfig['suite'] = defaults.suites[0]
  let {
    initialStripCount,
    burstMilliseconds,
    maximumCalls,
    runs,
    warmupCycles,
    minimumStripFrameLength,
    maximumStripFrameLength,
    baseSeed,
  } = defaults
  let maximumStripCount: number | undefined
  let outputPath: string | null | undefined

  for (let index = 0; index < arguments_.length; index++) {
    const argument = arguments_[index]
    if (argument === '--help') {
      console.log(usage)
      process.exit(0)
    } else if (argument === '--suite') {
      const value = arguments_[++index]
      if (value !== 'lifecycle' && value !== 'throughput')
        throw new TypeError('--suite must be lifecycle or throughput.')
      suite = value
    } else if (argument === '--start-strips')
      initialStripCount = readInteger(argument, arguments_[++index])
    else if (argument === '--burst-ms')
      burstMilliseconds = readInteger(argument, arguments_[++index])
    else if (argument === '--max-calls')
      maximumCalls = readInteger(argument, arguments_[++index])
    else if (argument === '--runs')
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

  maximumStripCount ??= defaults.maximumStripCount[suite]
  outputPath =
    outputPath === undefined
      ? `${defaults.outputDirectory}/${suite}.json`
      : outputPath
  if (initialStripCount <= 0 || burstMilliseconds <= 0 || maximumCalls <= 0)
    throw new RangeError(
      '--start-strips, --burst-ms and --max-calls must be greater than zero.'
    )
  if (suite === 'throughput' && initialStripCount > maximumStripCount)
    throw new RangeError('--start-strips cannot exceed --max-strips.')
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
      suite === 'throughput' ? initialStripCount : 0,
      ...defaults.checkpoints.filter(
        (checkpoint) =>
          checkpoint <= maximumStripCount &&
          (suite !== 'throughput' || checkpoint >= initialStripCount)
      ),
      maximumStripCount,
    ])
  ).sort((left, right) => left - right)

  return {
    suite,
    initialStripCount,
    burstMilliseconds,
    maximumCalls,
    runs,
    maximumStripCount,
    checkpoints,
    minimumStripFrameLength,
    maximumStripFrameLength,
    warmupCycles,
    baseSeed,
    outputPath,
  }
}

async function main(): Promise<void> {
  const arguments_ = process.argv.slice(2)
  const configs = arguments_.includes('--suite')
    ? [parseConfig(arguments_)]
    : defaults.suites.map((suite) =>
        parseConfig([...arguments_, '--suite', suite])
      )
  for (const config of configs) {
    if (
      configs.length > 1 &&
      arguments_.includes('--output') &&
      config.outputPath
    )
      config.outputPath = config.outputPath.replace(
        /(\.json)?$/i,
        `.${config.suite}.json`
      )
    let paths
    if (config.suite === 'throughput') {
      const report = await runThroughput(config)
      paths = await writeThroughputReport(report)
    } else {
      const report = await runBenchmark(config)
      printSummary(report)
      paths = await writeReports(report)
    }
    if (paths) {
      console.log('\nJSON report: ' + paths.jsonPath)
      console.log('Markdown report: ' + paths.markdownPath)
    }
  }
}

const entryPath = process.argv[1]
if (
  entryPath !== undefined &&
  import.meta.url === pathToFileURL(resolve(entryPath)).href
)
  await main()
