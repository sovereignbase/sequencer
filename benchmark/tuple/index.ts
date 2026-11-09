/** Public-API bursts for stable registers and ordinary sequences; fixture work is untimed. */
import { strict as assert } from 'node:assert'
import { arch, cpus, platform } from 'node:os'
import { resolve } from 'node:path'
import { gzipSync } from 'node:zlib'
import { encode } from '@msgpack/msgpack'
import { build } from 'tsdown'
import type {
  Projection as PublicProjection,
  TupleParams,
} from '../../dist/index.js'
import {
  Projection,
  PeerProjection,
  measureRuntimeMemory,
  resetRuntime,
} from '../.shared/runtime.ts'
import { Random } from '../.shared/support.ts'
import { writeReportFiles } from '../.shared/report.ts'
import { render } from './report.ts'

/** Comparison modes share inputs; sequence edits retain their usual shifting semantics. */
type Mode = 'sequence' | 'fixed' | 'dynamic' | 'baseline'
type Constructor = typeof PublicProjection
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
  runtimeBytes: number | null
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
  'insert.random',
  'remove.random',
  'replace.random',
  'apply.insert',
  'apply.remove',
  'apply.replace',
  'apply.duplicate',
  'merge.duplicate',
  'length',
  'value.random',
  'values',
  'sequence',
]
let retained: unknown

/** Seeds one Frame per Insertion at scattered positions, preventing linear extension bias. */
function fixture(
  Constructor: Constructor,
  mode: Mode,
  size: number
): PublicProjection<number> {
  const config: TupleParams | undefined =
    mode === 'fixed'
      ? { enabled: 1, maxLength: size }
      : mode === 'dynamic'
        ? { enabled: 1 }
        : undefined
  const projection = new Constructor<number>(1, undefined, config)
  const random = new Random(42)
  for (let i = 0; i < size; ++i)
    projection.insert(
      [i],
      mode === 'fixed' || mode === 'dynamic' ? i : random.integer(i + 1)
    )
  return projection
}

/** Measures complete calls; peer authoring, validation and destruction stay outside timings. */
function burst(
  Constructor: Constructor,
  mode: Mode,
  size: number,
  operation: string,
  warmup: boolean
): { calls: number; milliseconds: number } {
  const projection = fixture(Constructor, mode, size)
  const snapshot = projection.sequence()
  const random = new Random(19)
  const indices = Array.from({ length: 3000 }, () => random.integer(size))
  const fixed = mode === 'fixed' || mode === 'dynamic'
  const config: TupleParams | undefined = fixed
    ? { enabled: 1, ...(mode === 'fixed' ? { maxLength: size } : {}) }
    : undefined
  let calls =
    operation === 'length' || operation === 'value.random' ? 30_000 : 3000
  if (
    operation === 'sequence' ||
    operation === 'values' ||
    operation === 'merge.duplicate'
  )
    calls = 32
  if (operation.startsWith('create.')) calls = size >= 1000 ? 8 : 64
  if (operation === 'remove.random' || operation === 'apply.remove')
    calls = Math.min(calls, size)
  if (warmup) calls = Math.min(calls, 64)
  const peer = new PeerProjection<number>(2, snapshot)
  const authored: ReturnType<PublicProjection<number>['insert']>[] = []
  const targets = Array.from({ length: size }, (_, i) => i)
  for (let i = size - 1; i > 0; --i) {
    const at = random.integer(i + 1)
    ;[targets[i], targets[at]] = [targets[at], targets[i]]
  }
  if (operation.startsWith('apply.')) {
    for (let i = 0; i < calls; ++i) {
      const at =
        operation === 'apply.remove'
          ? fixed
            ? targets[i]
            : random.integer(peer.length())
          : indices[i]
      authored.push(
        operation === 'apply.remove'
          ? peer.remove(at, at)
          : operation === 'apply.replace'
            ? peer.replace([-i], at, at)
            : peer.insert([-i], at)
      )
    }
    if (operation === 'apply.duplicate') projection.apply(authored[0])
  }
  const created: PublicProjection<number>[] = []
  let expected: number | undefined
  const start = performance.now()
  for (let i = 0; i < calls; ++i) {
    switch (operation) {
      case 'create.empty':
        created.push(new Constructor<number>(3, undefined, config))
        break
      case 'create.sequence':
        created.push(new Constructor<number>(3, snapshot))
        break
      case 'insert.random':
        retained = projection.insert([-i], indices[i])
        break
      case 'remove.random': {
        const at = fixed ? targets[i] : indices[i] % projection.length()
        retained = projection.remove(at, at)
        break
      }
      case 'replace.random':
        retained = projection.replace([-i], indices[i], indices[i])
        break
      case 'apply.insert':
      case 'apply.remove':
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
        retained = projection.value(indices[i % indices.length])
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
  // Verify the final effect without adding observation work to the measured interval.
  if (operation.startsWith('apply.') && operation !== 'apply.duplicate')
    assert.deepEqual(projection.values(), peer.values())
  if (operation === 'remove.random') expected = fixed ? size : size - calls
  else if (operation === 'insert.random') expected = fixed ? size : size + calls
  else if (operation === 'replace.random') expected = size
  if (expected !== undefined) assert.equal(projection.length(), expected)
  assert.equal(created.length, operation.startsWith('create.') ? calls : 0)
  for (const instance of created) instance.destroy()
  peer.destroy()
  projection.destroy()
  return { calls, milliseconds }
}

/** Alternates comparison order and writes raw samples alongside the compact Markdown report. */
async function main(): Promise<void> {
  const args = process.argv.slice(2)
  let runs = 3,
    sizes = [100, 1000, 10_000],
    output: string | null = 'benchmark/.results/tuple.json'
  let baseline: (() => Constructor) | undefined
  for (let i = 0; i < args.length; ++i) {
    if (args[i] === '--runs') runs = Number(args[++i])
    else if (args[i] === '--sizes') sizes = args[++i].split(',').map(Number)
    else if (args[i] === '--output') output = args[++i]
    else if (args[i] === '--no-output') output = null
    else if (args[i] === '--baseline') {
      const built = await build({
        config: false,
        entry: resolve(args[++i]),
        format: 'iife',
        globalName: 'SequencerTupleBaseline',
        platform: 'neutral',
        target: 'es2024',
        dts: false,
        write: false,
        clean: false,
        logLevel: 'silent',
      })
      const chunk = built.bundles[0].chunks.find(
        (chunk) => chunk.type === 'chunk' && chunk.isEntry
      )
      if (chunk?.type !== 'chunk') throw new Error('Missing baseline bundle')
      // Recreate both controls equally; a warm imported baseline would bias fresh runtimes.
      baseline = new Function(
        chunk.code + '\nreturn SequencerTupleBaseline.Projection;'
      ) as () => Constructor
    } else throw new TypeError(`Unknown tuple benchmark option: ${args[i]}`)
  }
  if (
    !Number.isInteger(runs) ||
    runs < 1 ||
    sizes.some((size) => !Number.isInteger(size) || size < 1)
  )
    throw new RangeError('Runs and sizes must be positive integers.')
  const report: Report = {
    environment: `Node ${process.versions.node}, V8 ${process.versions.v8}, ${platform()} ${arch()}, ${cpus()[0]?.model ?? 'unknown CPU'}`,
    runs,
    samples: [],
    space: [],
  }
  const modes: Mode[] = baseline
    ? ['baseline', 'sequence', 'fixed', 'dynamic']
    : ['sequence', 'fixed', 'dynamic']
  for (let run = 1; run <= runs; ++run) {
    for (const size of sizes) {
      for (const mode of run % 2 ? modes : modes.toReversed()) {
        resetRuntime()
        const Constructor = mode === 'baseline' ? baseline!() : Projection
        const instance = fixture(Constructor, mode, size)
        const runtimeBytes =
          mode === 'baseline' ? null : measureRuntimeMemory().bytes
        const encoded = encode(instance.sequence())
        report.space.push({
          run,
          size,
          mode,
          runtimeBytes,
          msgpackBytes: encoded.byteLength,
          gzipBytes: gzipSync(encoded, { level: 9 }).byteLength,
        })
        instance.destroy()
      }
      for (const operation of operations) {
        for (const mode of run % 2 ? modes : modes.toReversed()) {
          resetRuntime()
          const Constructor = mode === 'baseline' ? baseline!() : Projection
          burst(Constructor, mode, size, operation, true)
          globalThis.gc?.()
          report.samples.push({
            run,
            size,
            mode,
            operation,
            ...burst(Constructor, mode, size, operation, false),
          })
        }
      }
      console.log(`Tuple benchmark: run ${run}/${runs}, ${size} indices`)
    }
  }
  const paths = await writeReportFiles(output, report, render(report))
  if (paths) console.log(paths.markdownPath)
  // Keep the final result observable throughout every measured burst.
  if (retained === null) throw new Error('Unexpected null result')
}
await main()
