/** Small fixed tuples and ordinary Projections under the same field-access workload. */
import { strict as assert } from 'node:assert'
import { arch, cpus, platform } from 'node:os'
import { gzipSync } from 'node:zlib'
import { encode } from '@msgpack/msgpack'
import type { Projection as PublicProjection } from '../../dist/index.js'
import {
  Projection,
  PeerProjection,
  measureAllocatedMemory,
  resetRuntime,
} from '../.shared/runtime.ts'
import { Random } from '../.shared/support.ts'
import { writeReportFiles } from '../.shared/report.ts'
import { render } from './report.ts'
import { updateTupleReadme } from './readme.ts'

type Mode = 'projection' | 'tuple'
export type Sample = {
  run: number
  size: number
  mode: Mode
  operation: string
  calls: number
  milliseconds: number
}
export type Space = {
  run: number
  size: number
  mode: Mode
  allocatedBytes: number
  msgpackBytes: number
  gzipBytes: number
}
export type Report = {
  environment: string
  runs: number
  samples: Sample[]
  space: Space[]
}
const operations = [
  'create.empty',
  'create.sequence',
  'replace.random',
  'apply.replace',
  'apply.duplicate',
  'merge.duplicate',
  'length',
  'value.random',
  'values',
  'sequence',
]
let retained: unknown

/** Edits each field once, then exports compacted history with identical values in both modes. */
function fixture(mode: Mode, size: number) {
  const config =
    mode === 'tuple' ? { enabled: 1 as const, maxLength: size } : undefined
  const source = new PeerProjection<number>(1, undefined, config)
  source.insert(
    Array.from({ length: size }, (_, i) => i),
    0
  )
  const indices = Array.from({ length: size }, (_, i) => i)
  const random = new Random(42)
  for (let i = size - 1; i > 0; --i) {
    const at = random.integer(i + 1)
    ;[indices[i], indices[at]] = [indices[at], indices[i]]
  }
  for (const at of indices) source.replace([at], at, at)
  const snapshot = source.sequence()
  source.destroy()
  return snapshot
}

/** Times whole bursts; construction, peer authoring and result checks remain outside the interval. */
function burst(mode: Mode, size: number, operation: string) {
  const snapshot = fixture(mode, size)
  const projection = new Projection<number>(1, snapshot)
  const config =
    mode === 'tuple' ? { enabled: 1 as const, maxLength: size } : undefined
  const calls =
    operation === 'length' || operation === 'value.random'
      ? 131_072
      : operation.startsWith('create.')
        ? 512
        : 4096
  const random = new Random(19)
  const indices = Array.from({ length: calls }, () => random.integer(size))
  const peer = new PeerProjection<number>(2, snapshot)
  const authored: ReturnType<PublicProjection<number>['replace']>[] = []
  if (operation.startsWith('apply.')) {
    const count = operation === 'apply.duplicate' ? 1 : calls
    for (let i = 0; i < count; ++i)
      authored.push(peer.replace([-i - 1], indices[i], indices[i]))
    if (operation === 'apply.duplicate') projection.apply(authored[0])
  }
  const created: PublicProjection<number>[] = []
  const start = performance.now()
  for (let i = 0; i < calls; ++i) {
    switch (operation) {
      case 'create.empty':
        created.push(new Projection<number>(3, undefined, config))
        break
      case 'create.sequence':
        created.push(new Projection<number>(3, snapshot))
        break
      case 'replace.random':
        retained = projection.replace([-i - 1], indices[i], indices[i])
        break
      case 'apply.replace':
        retained = projection.apply(authored[i])
        break
      case 'apply.duplicate':
        retained = projection.apply(authored[0])
        break
      case 'merge.duplicate':
        retained = projection.merge(snapshot)
        break
      case 'length':
        retained = projection.length()
        break
      case 'value.random':
        retained = projection.value(indices[i])
        break
      case 'values':
        retained = projection.values()
        break
      case 'sequence':
        retained = projection.sequence()
        break
    }
  }
  const milliseconds = performance.now() - start
  const expected = Array.from({ length: size }, (_, i) => i)
  if (operation === 'replace.random')
    for (let i = 0; i < calls; ++i) expected[indices[i]] = -i - 1
  assert.equal(projection.length(), size)
  assert.deepEqual(
    projection.values(),
    operation.startsWith('apply.') ? peer.values() : expected
  )
  assert.equal(created.length, operation.startsWith('create.') ? calls : 0)
  for (const instance of created) instance.destroy()
  peer.destroy()
  projection.destroy()
  return { calls, milliseconds }
}

/** Repeats bounded histories so fast methods receive sufficient timer resolution. */
function measure(mode: Mode, size: number, operation: string, minimum: number) {
  let calls = 0,
    milliseconds = 0
  do {
    const sample = burst(mode, size, operation)
    calls += sample.calls
    milliseconds += sample.milliseconds
  } while (milliseconds < minimum)
  return { calls, milliseconds }
}

/** Alternates comparison order; each measured burst follows a complete untimed warmup. */
async function main(): Promise<void> {
  const args = process.argv.slice(2)
  let runs = 3,
    sizes = [2, 4, 8, 100],
    output: string | null = 'benchmark/.results/tuple.json'
  for (let i = 0; i < args.length; ++i) {
    if (args[i] === '--runs') runs = Number(args[++i])
    else if (args[i] === '--sizes') sizes = args[++i].split(',').map(Number)
    else if (args[i] === '--output') output = args[++i]
    else if (args[i] === '--no-output') output = null
    else throw new TypeError(`Unknown tuple benchmark option: ${args[i]}`)
  }
  if (
    !Number.isInteger(runs) ||
    runs < 1 ||
    sizes.some((size) => !Number.isInteger(size) || size < 1 || size > 100)
  )
    throw new RangeError(
      'Runs must be positive integers; sizes must be integers in 1..100.'
    )
  const report: Report = {
    environment: `Node ${process.versions.node}, V8 ${process.versions.v8}, ${platform()} ${arch()}, ${cpus()[0]?.model ?? 'unknown CPU'}`,
    runs,
    samples: [],
    space: [],
  }
  for (let run = 1; run <= runs; ++run) {
    const modes: Mode[] =
      run % 2 ? ['projection', 'tuple'] : ['tuple', 'projection']
    for (const size of sizes) {
      for (const mode of modes) {
        resetRuntime()
        const snapshot = fixture(mode, size)
        const before = measureAllocatedMemory()
        const instance = new Projection<number>(1, snapshot)
        const allocatedBytes = measureAllocatedMemory() - before
        const encoded = encode(instance.sequence())
        report.space.push({
          run,
          size,
          mode,
          allocatedBytes,
          msgpackBytes: encoded.byteLength,
          gzipBytes: gzipSync(encoded, { level: 9 }).byteLength,
        })
        instance.destroy()
      }
      for (const operation of operations) {
        for (const mode of modes) {
          resetRuntime()
          measure(mode, size, operation, 25)
          globalThis.gc?.()
          report.samples.push({
            run,
            size,
            mode,
            operation,
            ...measure(mode, size, operation, 50),
          })
        }
      }
      console.log(`Tuple benchmark: run ${run}/${runs}, ${size} indices`)
    }
  }
  const paths = await writeReportFiles(output, report, render(report))
  if (paths) {
    await updateTupleReadme(report, paths.markdownPath)
    console.log(paths.markdownPath)
  }
  if (retained === null) throw new Error('Unexpected null result')
}
await main()
