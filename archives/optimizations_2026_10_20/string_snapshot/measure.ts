/** Paired text snapshot measurements; library builds, fixtures and observations are untimed. */
import assert from 'node:assert/strict'
import { mkdirSync, writeFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { gzipSync } from 'node:zlib'
import { encode } from '@msgpack/msgpack'
import { build } from 'tsdown'
import type { Projection } from '../../../src/typescript/class.ts'

const [
  baselineEntry,
  currentEntry = 'src/typescript/class.ts',
  destination = 'temp/string-snapshots.json',
] = process.argv.slice(2)
assert(
  baselineEntry,
  'Supply the baseline class.ts path, current class.ts path and output path.'
)

/** Each factory starts a separate WASM runtime; constructor probes do not retain the source graph. */
async function load(
  entry: string
): Promise<() => { Projection: typeof Projection }> {
  const result = await build({
    config: false,
    entry: resolve(entry),
    format: 'iife',
    globalName: 'SnapshotBenchmark',
    platform: 'neutral',
    target: 'es2024',
    dts: false,
    write: false,
    clean: false,
    logLevel: 'silent',
  })
  const chunk = result.bundles[0].chunks.find(
    (chunk) => chunk.type === 'chunk' && chunk.isEntry
  )
  assert(chunk?.type === 'chunk', 'Missing snapshot benchmark entry')
  return new Function(chunk.code + '\nreturn SnapshotBenchmark;') as () => {
    Projection: typeof Projection
  }
}
const factories = await Promise.all([load(baselineEntry), load(currentEntry)])
let sink: unknown

/** Fixed ASCII content has one code unit per Frame and identical UTF-8 transport in both formats. */
function fixture(Constructor: typeof Projection, size: number, shape: string) {
  const entropy = crypto.getRandomValues
  crypto.getRandomValues = <T extends ArrayBufferView | null>(words: T): T => {
    ;(words as Uint32Array)[0] = 42
    return words
  }
  let source: Projection<string>
  try {
    source = new Constructor<string>(1)
  } finally {
    crypto.getRandomValues = entropy
  }
  let seed = 0x12345678
  const random = () => {
    seed ^= seed << 13
    seed ^= seed >>> 17
    seed ^= seed << 5
    return seed >>> 0
  }
  for (let i = 0; i < size; i += 16) {
    const values = Array.from({ length: Math.min(16, size - i) }, () =>
      String.fromCharCode(32 + (random() % 95))
    )
    source.insert(
      values,
      shape === 'linear' ? source.length() : random() % (source.length() + 1)
    )
  }
  const snapshot = source.sequence(),
    expected = source.values()
  source.destroy()
  return { snapshot, expected }
}

/** Constructor timing excludes explicit destruction; export loops amortize clock overhead over 16 calls. */
function measure(run: () => unknown, constructor: boolean) {
  let ns = 0,
    count = 0
  if (constructor) {
    do {
      const start = process.hrtime.bigint()
      const projection = run() as Projection<string>
      ns += Number(process.hrtime.bigint() - start)
      projection.destroy()
      ++count
    } while (ns < 15_000_000)
  } else {
    const start = process.hrtime.bigint()
    do {
      for (let i = 0; i < 16; ++i) {
        sink = run()
        ++count
      }
    } while (process.hrtime.bigint() - start < 15_000_000n)
    ns = Number(process.hrtime.bigint() - start)
  }
  return { count, ns, ops: (count * 1e9) / ns }
}

const rows: unknown[] = []
mkdirSync(dirname(destination), { recursive: true })
for (const size of [1_000, 10_000, 100_000])
  for (const shape of ['linear', 'random']) {
    const constructors = factories.map((factory) => factory().Projection)
    const peers = factories.map((factory) => factory().Projection)
    const { snapshot, expected } = fixture(peers[0], size, shape)
    const sources = constructors.map(
      (Constructor) => new Constructor<string>(1, snapshot)
    )
    const encoded = sources[1].sequence(true)
    assert.deepEqual(encoded[0], snapshot[0])
    assert.equal(encoded[1], snapshot[1].join(''))
    const restored = new peers[1]<string>(
      2,
      JSON.parse(JSON.stringify(encoded))
    )
    assert.deepEqual(restored.values(), expected)
    restored.destroy()

    // Sizes include the complete snapshot; gzip receives the corresponding encoded bytes.
    const space = [snapshot, encoded].map((value) => {
      const json = JSON.stringify(value),
        msgpack = encode(value)
      return {
        json: Buffer.byteLength(json),
        jsonGzip: gzipSync(json).length,
        msgpack: msgpack.length,
        msgpackGzip: gzipSync(msgpack).length,
      }
    })
    const cases: Record<string, Array<() => unknown>> = {
      'sequence.array': [
        () => sources[0].sequence(),
        () => sources[1].sequence(),
      ],
      'sequence.string': [
        () => {
          const value = sources[0].sequence()
          return [value[0], value[1].join('')]
        },
        () => sources[1].sequence(true),
      ],
      'create.array': [
        () => new peers[0]<string>(2, snapshot),
        () => new peers[1]<string>(2, snapshot),
      ],
      'create.string': [
        () => new peers[0]<string>(2, snapshot),
        () => new peers[1]<string>(2, encoded),
      ],
    }
    const timings: Record<string, Array<ReturnType<typeof measure>[]>> = {}
    for (const [name, runs] of Object.entries(cases)) {
      const samples: ReturnType<typeof measure>[][] = []
      for (let round = -5; round < 24; ++round) {
        globalThis.gc?.()
        await new Promise<void>((resolve) => setImmediate(resolve))
        const pair: ReturnType<typeof measure>[] = []
        for (const side of round % 2 ? [1, 0] : [0, 1])
          pair[side] = measure(runs[side], name.startsWith('create.'))
        if (round >= 0) samples.push(pair)
      }
      timings[name] = samples
      console.log(size, shape, name)
    }
    sources.forEach((source) => source.destroy())
    rows.push({ size, shape, space, timings })
    writeFileSync(destination, JSON.stringify(rows, null, 2) + '\n')
  }
void sink
