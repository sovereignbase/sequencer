import { spawnSync } from 'node:child_process'
import { writeFileSync } from 'node:fs'
for (let run = 0; run < 5; run++)
  for (const variant of run % 2 ? ['wasm', 'js'] : ['js', 'wasm']) {
    const command =
      variant === 'js' ? 'temp/performance/bench-js.mjs' : 'benchmark/index.ts'
    const start = performance.now()
    const result = spawnSync(
      process.execPath,
      [
        '--expose-gc',
        command,
        '--suite',
        'throughput',
        '--runs',
        '1',
        '--max-strips',
        '10000',
        '--start-strips',
        '100',
        '--burst-ms',
        '100',
        '--max-calls',
        '10000',
        '--warmup-cycles',
        '64',
        '--output',
        `temp/performance/matched-${variant}-${run}.json`,
      ],
      { encoding: 'utf8', maxBuffer: 2000000 }
    )
    writeFileSync(
      `temp/performance/matched-${variant}-${run}.log`,
      result.stdout + result.stderr
    )
    console.log(
      variant,
      run,
      Math.round(performance.now() - start),
      result.status
    )
    if (result.status) process.exit(result.status)
  }
