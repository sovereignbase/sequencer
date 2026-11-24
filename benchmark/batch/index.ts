/** Identical editing traces compare individual binary Gossip with native batch output. */
import { strict as assert } from 'node:assert'
import { arch, cpus, platform } from 'node:os'
import { decode, encode } from '@msgpack/msgpack'
import {
  Projection,
  PeerProjection,
  resetRuntime,
  measureRuntimeMemory,
} from '../.shared/runtime.ts'
import { Random, deriveSeed, seedFromString } from '../.shared/support.ts'
import { writeReportFiles } from '../.shared/report.ts'
import {
  reportLink,
  runSource,
  updateReadme,
  type RunSource,
} from '../.shared/readme.ts'
import type {
  Gossip,
  Projection as PublicProjection,
} from '../../dist/index.js'
import type { RuntimeMemoryResult } from '../.shared/types.ts'
import { render } from './report.ts'

export type Mode = 'individual' | 'batch'
const workloads = [
  'append',
  'prepend',
  'random.characters',
  'random.words',
  'concurrent.characters',
  'concurrent.words',
  'concurrent.mixed',
  'causal.characters',
  'causal.words',
  'causal.mixed',
] as const
export type Workload = (typeof workloads)[number]
type Action = {
  kind: 'insert' | 'remove' | 'replace'
  at: number
  end: number
  text: string
}
type Trace = { actions: Action[]; expected: string }
export type Sample = {
  run: number
  mode: Mode
  workload: Workload
  edits: number
  authorMilliseconds: number
  applyMilliseconds: number
  receiveMilliseconds: number
  encodeMilliseconds: number
  decodeMilliseconds: number
  metadataBytes: number
  updateBytes: number
  documentBytes: number
  memory: RuntimeMemoryResult
}
export type Report = RunSource & {
  environment: string
  runs: number
  edits: number
  samples: Sample[]
}
const initialText = 'initial text '.repeat(8)

/** Positions use each author's own evolving view; entropy and expected text are prepared untimed. */
function trace(
  workload: Workload,
  edits: number,
  author: number,
  initial = initialText
): Trace {
  const random = new Random(
    deriveSeed(seedFromString('batch-edits'), `${workload}:${author}`)
  )
  let expected = initial
  const actions: Action[] = []
  for (let i = 0; i < edits; ++i) {
    const at =
      workload === 'append'
        ? expected.length
        : workload === 'prepend'
          ? 0
          : random.integer(expected.length + 1)
    const mixed = workload.endsWith('.mixed')
    const kind =
      mixed && at < expected.length
        ? i % 4 === 0
          ? 'remove'
          : i % 4 === 1
            ? 'replace'
            : 'insert'
        : 'insert'
    const end =
      kind === 'remove'
        ? Math.min(expected.length - 1, at + random.integer(3))
        : at
    const length =
      kind === 'remove'
        ? 0
        : workload.endsWith('.words') || mixed
          ? random.inclusive(3, 9)
          : 1
    let text = ''
    for (let n = 0; n < length; ++n)
      text += String.fromCharCode(97 + random.integer(26))
    actions.push({ kind, at, end, text })
    expected =
      expected.slice(0, at) +
      text +
      expected.slice(kind === 'insert' ? at : end + 1)
  }
  return { actions, expected }
}

/** Runs an ordinary mutator with the same inclusive bounds as the editor. */
function authorEdits(
  source: PublicProjection<string>,
  input: Trace,
  mode: Mode
): Gossip<string, boolean, true> {
  if (mode === 'batch')
    return source.batch((edit) => {
      for (const action of input.actions) {
        if (action.kind === 'insert') edit.insert(action.text, action.at)
        else if (action.kind === 'remove') edit.remove(action.at, action.end)
        else edit.replace(action.text, action.at, action.end)
      }
    })
  const gossip: Array<Gossip<string, boolean, true>[number]> = []
  for (const action of input.actions) {
    const result =
      action.kind === 'insert'
        ? source.insert(action.text, action.at, true)
        : action.kind === 'remove'
          ? source.remove(action.at, action.end, true)
          : source.replace(action.text, action.at, action.end, true)
    gossip.push(...result)
  }
  return gossip
}

/** Times authoring and transport separately; only one receiver contributes to its memory estimate. */
function measure(
  run: number,
  workload: Workload,
  mode: Mode,
  inputs: Trace[]
): Sample {
  const initial = new PeerProjection<string>(9)
  initial.apply([[1], [2], [9]])
  initial.insert(initialText, 0)
  const snapshot = initial.sequence(true, true)
  initial.destroy()
  const authors = inputs.map(
    (_, i) => new PeerProjection<string>(i + 1, snapshot, undefined, true)
  )
  let receiver = new Projection<string>(9, snapshot, undefined, true)
  let decodedReceiver: Projection<string> | undefined
  try {
    globalThis.gc?.()
    let start = 0,
      authorMilliseconds = 0
    const gossip: Gossip<string, boolean, true>[] = []
    for (let i = 0; i < authors.length; ++i) {
      start = performance.now()
      gossip.push(authorEdits(authors[i], inputs[i], mode))
      authorMilliseconds += performance.now() - start
      // Causal authors receive preceding history before their own timed edits.
      if (workload.startsWith('causal.') && i + 1 < authors.length)
        assert(authors[i + 1].apply(gossip[i], true, true))
    }
    for (let i = 0; i < authors.length; ++i)
      assert.equal(
        authors[i].values(undefined, undefined, true),
        inputs[i].expected
      )
    start = performance.now()
    const messages = gossip.map((value) => encode(value))
    const encodeMilliseconds = performance.now() - start
    start = performance.now()
    const decoded = messages.map((value) => decode(value))
    const decodeMilliseconds = performance.now() - start
    const applied = []
    start = performance.now()
    for (const value of gossip) applied.push(receiver.apply(value, true, true))
    const applyMilliseconds = performance.now() - start
    for (const result of applied) assert(result)
    decodedReceiver = new Projection<string>(9, snapshot, undefined, true)
    const received = []
    start = performance.now()
    for (const message of messages)
      received.push(decodedReceiver.apply(decode(message), true, true))
    const receiveMilliseconds = performance.now() - start
    for (const result of received) assert(result)
    assert.equal(
      decodedReceiver.values(undefined, undefined, true),
      receiver.values(undefined, undefined, true)
    )
    decodedReceiver.destroy()
    decodedReceiver = undefined
    // Every active Actor sees the full history before the complete frontier exchange.
    const replies: Array<Gossip<string, false, true>> = []
    for (const state of [...authors, receiver])
      for (const value of decoded) {
        const result = state.apply(value, true, true)
        assert(result)
        if (result[1]) replies.push(result[1])
      }
    for (const state of [...authors, receiver])
      for (const reply of replies) assert(state.apply(reply, true, true))
    for (const author of authors)
      assert.equal(
        author.values(undefined, undefined, true),
        receiver.values(undefined, undefined, true)
      )
    for (const author of authors) author.destroy()
    const checkpoint = receiver.sequence(true, true)
    const documentBytes = encode(checkpoint).byteLength
    if (run) {
      receiver.destroy()
      resetRuntime()
      receiver = new Projection<string>(9, checkpoint, undefined, true)
    }
    return {
      run,
      mode,
      workload,
      edits: inputs.reduce((n, input) => n + input.actions.length, 0),
      authorMilliseconds,
      applyMilliseconds,
      receiveMilliseconds,
      encodeMilliseconds,
      decodeMilliseconds,
      metadataBytes:
        gossip.reduce(
          (n, value) =>
            n +
            value.reduce(
              (sum, entry) =>
                sum +
                (entry instanceof Uint8Array
                  ? entry.byteLength
                  : entry[0].byteLength),
              0
            ),
          0
        ) / gossip.length,
      updateBytes:
        messages.reduce((n, message) => n + message.byteLength, 0) /
        messages.length,
      documentBytes,
      memory: measureRuntimeMemory(),
    }
  } finally {
    for (const author of authors) author.destroy()
    receiver.destroy()
    decodedReceiver?.destroy()
  }
}

async function main() {
  let runs = 3,
    edits = 6000,
    output: string | null = 'benchmark/.results/batch.json'
  const args = process.argv.slice(2)
  for (let i = 0; i < args.length; ++i) {
    if (args[i] === '--runs') runs = Number(args[++i])
    else if (args[i] === '--edits') edits = Number(args[++i])
    else if (args[i] === '--output') output = args[++i]
    else if (args[i] === '--no-output') output = null
    else throw new TypeError(`Unknown batch benchmark option: ${args[i]}`)
  }
  if (
    !Number.isInteger(runs) ||
    runs < 1 ||
    !Number.isInteger(edits) ||
    edits < 16 ||
    edits > 100000
  )
    throw new RangeError('Runs must be positive; edits must be in 16..100000.')
  const report: Report = {
    ...runSource(),
    environment: `Node ${process.versions.node}, V8 ${process.versions.v8}, ${platform()} ${arch()}, ${cpus()[0]?.model ?? 'unknown CPU'}`,
    runs,
    edits,
    samples: [],
  }
  for (let run = 1; run <= runs; ++run)
    for (const workload of workloads) {
      const inputs = [trace(workload, edits, 0)]
      if (workload.startsWith('concurrent.') || workload.startsWith('causal.'))
        inputs.push(
          trace(
            workload,
            edits,
            1,
            workload.startsWith('causal.') ? inputs[0].expected : initialText
          )
        )
      for (const mode of (run % 2
        ? ['individual', 'batch']
        : ['batch', 'individual']) as Mode[]) {
        resetRuntime()
        measure(0, workload, mode, inputs)
        report.samples.push(measure(run, workload, mode, inputs))
        console.log(`Batch benchmark: run ${run}/${runs}, ${workload}, ${mode}`)
      }
    }
  if (output) {
    const files = await writeReportFiles(output, report, render(report))
    if (files) {
      await updateReadme(
        'batch:benchmarks',
        `${render(report, true)}\n[Full batch results](${reportLink(files.markdownPath)}).\n`
      )
      console.log(files.markdownPath)
    }
  } else console.log(render(report))
}
await main()
