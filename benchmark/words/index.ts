/** Numeric and byte words through the same edits, transport and public API. */
import { strict as assert } from 'node:assert'
import { arch, cpus, platform } from 'node:os'
import { encode, decode } from '@msgpack/msgpack'
import { gzipSync } from 'node:zlib'
import { Projection, resetRuntime } from '../.shared/runtime.ts'
import { writeReportFiles } from '../.shared/report.ts'
import {
  runSource,
  updateReadme,
  reportLink,
  type RunSource,
} from '../.shared/readme.ts'
import type { Gossip, Sequence } from '../../dist/index.js'
import { render } from './report.ts'

const workloads = ['append', 'prepend', 'random', 'concurrent'] as const
const operations = [
  'sequence',
  'encode',
  'decode',
  'create',
  'load',
  'apply',
  'receive',
] as const
export type Workload = (typeof workloads)[number]
export type Operation = (typeof operations)[number]
export type Mode = 'numeric' | 'binary'
export type Report = RunSource & {
  environment: string
  runs: number
  edits: number
  samples: Array<{
    run: number
    workload: Workload
    mode: Mode
    operation: Operation
    calls: number
    milliseconds: number
  }>
  space: Array<{
    run: number
    workload: Workload
    mode: Mode
    metadataBytes: number
    documentBytes: number
    documentGzipBytes: number
    averageUpdateBytes: number
  }>
}
let observed: unknown

/** Identical seeded positions and payloads; concurrent authors retain independent local views. */
function fixture(workload: Workload, edits: number, binary: boolean) {
  const state = new Projection<string>(9)
  const members: Gossip<string> = [[1], [2], [3], [4], [9]]
  state.apply(members)
  const root = state.insert('initial text', 0, binary)
  const initial = state.sequence(true, binary)
  const authors =
    workload === 'concurrent'
      ? [1, 2, 3, 4].map(
          (actor) => new Projection<string>(actor, initial, undefined, true)
        )
      : [state]
  const updates: Gossip<string, boolean, boolean>[] = []
  let seed = 0x13579bdf
  const random = () => {
    seed ^= seed << 13
    seed ^= seed >>> 17
    seed ^= seed << 5
    return seed >>> 0
  }
  for (let i = 0; i < edits; ++i) {
    const author = authors[i % authors.length],
      length = author.length()
    const at =
      workload === 'append'
        ? length
        : workload === 'prepend'
          ? 0
          : random() % (length + 1)
    const mixed = workload === 'random' || workload === 'concurrent'
    const text = String.fromCharCode(97 + (random() % 26))
    updates.push(
      mixed && at < length && i % 4 === 0
        ? author.remove(at, Math.min(length - 1, at + (random() % 3)), binary)
        : mixed && at < length && i % 4 === 1
          ? author.replace(text + text, at, at, binary)
          : author.insert(text, at, binary)
    )
  }
  const gossip: Gossip<string, boolean, boolean> = [
    ...members,
    ...root,
    ...updates.flat(),
  ]
  if (workload === 'concurrent') {
    assert(state.apply(updates.flat(), true, binary))
    for (const author of authors) author.destroy()
  }
  const expected = state.values(undefined, undefined, true)
  return { state, gossip, updates, expected }
}

/** API timing includes only the selected operation; construction and checks surround mutation calls. */
function measure(
  operation: Operation,
  work: ReturnType<typeof fixture>,
  binary: boolean,
  minimum: number
) {
  const snapshot = work.state.sequence(true, binary)
  const encoded = encode(snapshot),
    message = encode(work.gossip)
  let calls = 0,
    milliseconds = 0
  do {
    const receiver =
      operation === 'apply' || operation === 'receive'
        ? new Projection<string>(9)
        : undefined
    let created: Projection<string> | undefined
    const start = performance.now()
    switch (operation) {
      case 'sequence':
        observed = work.state.sequence(true, binary)
        break
      case 'encode':
        observed = encode(snapshot)
        break
      case 'decode':
        observed = decode(encoded)
        break
      case 'create':
        observed = created = new Projection<string>(
          9,
          snapshot,
          undefined,
          true
        )
        break
      case 'load':
        observed = created = new Projection<string>(
          9,
          decode(encoded),
          undefined,
          true
        )
        break
      case 'apply':
        observed = receiver!.apply(work.gossip, true, binary)
        break
      case 'receive':
        observed = receiver!.apply(decode(message), true, binary)
        break
    }
    milliseconds += performance.now() - start
    ++calls
    if (receiver) {
      assert(observed, 'Gossip must be accepted')
      assert.equal(receiver.values(undefined, undefined, true), work.expected)
      receiver.destroy()
    }
    if (created) {
      assert.equal(created.values(undefined, undefined, true), work.expected)
      created.destroy()
    }
  } while (calls < 10000 && milliseconds < minimum)
  return { calls, milliseconds }
}

/** Writes the complete report and refreshes only the binary-word README block. */
async function main() {
  let runs = 3,
    edits = 6000,
    modes: Mode[] = ['numeric', 'binary'],
    output: string | null = 'benchmark/.results/words.json'
  const args = process.argv.slice(2)
  for (let i = 0; i < args.length; ++i) {
    if (args[i] === '--runs') runs = Number(args[++i])
    else if (args[i] === '--edits') edits = Number(args[++i])
    else if (args[i] === '--modes') modes = args[++i].split(',') as Mode[]
    else if (args[i] === '--output') output = args[++i]
    else if (args[i] === '--no-output') output = null
    else throw new TypeError(`Unknown words benchmark option: ${args[i]}`)
  }
  if (
    !Number.isInteger(runs) ||
    runs < 1 ||
    !Number.isInteger(edits) ||
    edits < 16 ||
    edits > 100000 ||
    !modes.length ||
    modes.some((mode) => mode !== 'numeric' && mode !== 'binary')
  )
    throw new RangeError('Runs must be positive; edits must be in 16..100000.')
  const report: Report = {
    ...runSource(),
    environment: `Node ${process.versions.node}, V8 ${process.versions.v8}, ${platform()} ${arch()}, ${cpus()[0]?.model ?? 'unknown CPU'}`,
    runs,
    edits,
    samples: [],
    space: [],
  }
  for (let run = 1; run <= runs; ++run)
    for (const workload of workloads)
      for (const mode of run % 2 ? modes : modes.toReversed()) {
        resetRuntime()
        const binary = mode === 'binary',
          work = fixture(workload, edits, binary)
        try {
          const snapshot: Sequence<string, true, boolean> = work.state.sequence(
            true,
            binary
          )
          const encoded = encode(snapshot)
          report.space.push({
            run,
            workload,
            mode,
            metadataBytes:
              snapshot[0] instanceof Uint8Array
                ? snapshot[0].byteLength
                : snapshot[0].length * 4,
            documentBytes: encoded.byteLength,
            documentGzipBytes: gzipSync(encoded, { level: 9 }).byteLength,
            averageUpdateBytes:
              work.updates.reduce(
                (n, update) => n + encode(update).byteLength,
                0
              ) / edits,
          })
          for (const operation of operations) {
            globalThis.gc?.()
            measure(operation, work, binary, 25)
            globalThis.gc?.()
            report.samples.push({
              run,
              workload,
              mode,
              operation,
              ...measure(operation, work, binary, 50),
            })
          }
          console.log(
            `Words benchmark: run ${run}/${runs}, ${workload}, ${mode}`
          )
        } finally {
          work.state.destroy()
        }
      }
  if (output) {
    const files = await writeReportFiles(output, report, render(report))
    if (files) {
      await updateReadme(
        'words:benchmarks',
        `${render(report, true)}\n[Full words results](${reportLink(files.markdownPath)}).\n`
      )
      console.log(files.markdownPath)
    }
  } else console.log(render(report))
}
await main()
