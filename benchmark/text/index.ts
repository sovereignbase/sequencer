/** Large UTF-16 inputs through the public array and string APIs. */
import { strict as assert } from 'node:assert'
import { arch, cpus, platform } from 'node:os'
import { encode } from '@msgpack/msgpack'
import { gzipSync } from 'node:zlib'
import {
  Projection,
  PeerProjection,
  resetRuntime,
  measureRuntimeMemory,
} from '../.shared/runtime.ts'
import { writeReportFiles } from '../.shared/report.ts'
import { render } from './report.ts'
import { runSource, type RunSource } from '../.shared/readme.ts'
import { updateTextReadme } from './readme.ts'

export type Representation = 'array' | 'string'
export type Sample = {
  run: number
  size: number
  representation: Representation
  operation: string
  calls: number
  milliseconds: number
}
export type Report = RunSource & {
  environment: string
  runs: number
  samples: Sample[]
  space: Array<{
    run: number
    size: number
    representation: Representation
    estimatedBytes: number
    messagePackBytes: number
    gzipBytes: number
    updateMessagePackBytes: number
    updateGzipBytes: number
  }>
}
const operations = [
  'insert',
  'insert.append',
  'replace',
  'remove',
  'remove.middle',
  'replace.middle',
  'apply',
  'apply.array',
  'concurrent.apply',
  'merge',
  'create',
  'value.random',
  'values.range',
  'values.array',
  'values.text',
  'sequence.array',
  'sequence.text',
  'sequence.edited.text',
  'sequence.masked.text',
] as const
type Operation = (typeof operations)[number]
let retained: unknown
let observedCode = 0

/** Preparation and assertions stay outside API time; array input splitting is timed. */
function prepare(
  operation: Operation,
  representation: Representation,
  text: string,
  snapshot: ReturnType<Projection<string>['sequence']>,
  update?: ReturnType<Projection<string>['insert']>,
  concurrent?: Array<ReturnType<Projection<string>['insert']>>
) {
  const state = new Projection<string>(1)
  let created: Projection<string> | undefined
  const textMode = representation === 'string'
  const midpoint = Math.floor(text.length / 2)
  const input = () => (textMode ? text : text.split(''))
  const positions =
    operation === 'value.random'
      ? Uint32Array.from(
          { length: 256 },
          (_, i) => (Math.imul(i, 2654435761) >>> 0) % text.length
        )
      : undefined
  let cursor = 0
  if (
    operation !== 'insert' &&
    operation !== 'insert.append' &&
    operation !== 'merge' &&
    operation !== 'create' &&
    operation !== 'apply' &&
    operation !== 'apply.array' &&
    operation !== 'concurrent.apply'
  )
    state.insert(input(), 0)
  let expectedLength = text.length
  if (operation === 'sequence.edited.text') {
    state.remove(midpoint, midpoint)
    --expectedLength
  } else if (operation === 'sequence.masked.text') {
    state.apply([[1], [2]])
    for (let i = 31; i >= 0; --i)
      state.remove(
        i * Math.floor(text.length / 32),
        i * Math.floor(text.length / 32)
      )
    expectedLength -= 32
  }
  const invoke = () => {
    switch (operation) {
      case 'insert':
        return state.insert(input(), 0)
      case 'insert.append':
        for (
          let start = 0;
          start < text.length;
          start += Math.ceil(text.length / 16)
        ) {
          const part = text.slice(start, start + Math.ceil(text.length / 16))
          retained = state.insert(
            textMode ? part : part.split(''),
            state.length()
          )
        }
        observedCode = state.value(midpoint)!.charCodeAt(0)
        return retained
      case 'replace':
        return state.replace(input(), 0, text.length - 1)
      case 'remove':
        expectedLength = 0
        return state.remove()
      case 'remove.middle':
        expectedLength = text.length - 1
        return state.remove(midpoint, midpoint)
      case 'replace.middle':
        return state.replace(textMode ? 'y' : ['y'], midpoint, midpoint)
      case 'apply':
        return state.apply(update, textMode)
      case 'apply.array':
        return state.apply(update)
      case 'concurrent.apply': {
        for (const gossip of concurrent!) state.apply(gossip, textMode)
        expectedLength = text.length * concurrent!.length
        const visible = textMode
          ? state.values(undefined, undefined, true)
          : state.values().join('')
        observedCode = visible.charCodeAt(midpoint)
        return visible
      }
      case 'merge':
        return state.merge(snapshot, textMode)
      case 'create':
        return (created = new Projection<string>(
          3,
          snapshot,
          undefined,
          textMode
        ))
      case 'value.random':
        return state.value(positions![cursor++ & 255])
      case 'values.range':
        return state.values(midpoint, midpoint + 31)
      case 'values.array':
        return state.values()
      case 'values.text':
        return textMode
          ? state.values(undefined, undefined, true)
          : state.values().join('')
      case 'sequence.array':
        return state.sequence()
      case 'sequence.text':
      case 'sequence.edited.text':
      case 'sequence.masked.text':
        return state.sequence(true)
    }
  }
  return {
    invoke,
    finish() {
      const visible = created ?? state
      assert.equal(visible.length(), expectedLength)
      if (expectedLength) {
        assert.equal(visible.value(0), 'x')
        assert.equal(visible.value(expectedLength - 1), 'x')
        if (operation === 'replace.middle')
          assert.equal(visible.value(midpoint), 'y')
      }
      if (operation === 'values.text') assert.equal(retained, text)
      if (operation === 'values.array')
        assert.equal((retained as unknown[]).length, text.length)
      if (operation === 'sequence.text')
        assert.equal((retained as unknown[])[1], text)
      if (operation === 'sequence.edited.text')
        assert.equal((retained as unknown[])[1], text.slice(1))
      if (operation === 'sequence.masked.text') {
        const footage = (retained as unknown[])[1] as string
        assert.equal(footage.length, text.length)
        for (let i = 0; i < 32; ++i)
          assert.equal(footage[i * Math.floor(text.length / 32)], '\0')
      }
      if (operation === 'insert.append' || operation === 'concurrent.apply')
        assert.equal(observedCode, 120)
      if (
        operation === 'apply' ||
        operation === 'apply.array' ||
        operation === 'merge'
      ) {
        const changes = (retained as [[number, number, string | string[]][]])[0]
        assert.equal(changes.length, 1)
        assert.equal(
          typeof changes[0][2] === 'string',
          operation !== 'apply.array' && textMode
        )
        assert.equal(changes[0][2].length, text.length)
      }
      created?.destroy()
      state.destroy()
    },
  }
}

/** Accumulates API intervals; bounds repeated fast cases without retaining large arrays. */
function measure(
  operation: Operation,
  representation: Representation,
  text: string,
  snapshot: ReturnType<Projection<string>['sequence']>,
  minimum: number
) {
  let calls = 0,
    milliseconds = 0
  let update: ReturnType<Projection<string>['insert']> | undefined
  let concurrent: Array<ReturnType<Projection<string>['insert']>> | undefined
  if (operation === 'apply' || operation === 'apply.array') {
    const source = new PeerProjection<string>(2)
    update = source.insert(
      representation === 'string' ? text : text.split(''),
      0
    )
    source.destroy()
  }
  if (operation === 'concurrent.apply') {
    concurrent = []
    for (let actor = 2; actor <= 5; ++actor) {
      const source = new PeerProjection<string>(actor)
      concurrent.push(
        source.insert(representation === 'string' ? text : text.split(''), 0)
      )
      source.destroy()
    }
  }
  const readonly =
    operation.startsWith('value') || operation.startsWith('sequence')
  if (readonly) {
    const work = prepare(operation, representation, text, snapshot)
    const batch =
      operation === 'value.random' ||
      operation === 'values.range' ||
      (representation === 'string' &&
        operation.endsWith('.text') &&
        operation !== 'sequence.edited.text')
        ? 128
        : 1
    do {
      const start = performance.now()
      for (let i = 0; i < batch; ++i) retained = work.invoke()
      milliseconds += performance.now() - start
      calls += batch
    } while (calls < 131072 && milliseconds < minimum)
    work.finish()
    return { calls, milliseconds }
  }
  do {
    const work = prepare(
      operation,
      representation,
      text,
      snapshot,
      update,
      concurrent
    )
    const start = performance.now()
    retained = work.invoke()
    milliseconds += performance.now() - start
    ++calls
    work.finish()
  } while (calls < 8192 && milliseconds < minimum)
  return { calls, milliseconds }
}

/** Alternates representations with identical payload sizes and measurement limits. */
async function main(): Promise<void> {
  let runs = 3,
    sizes = [1024, 65536, 1048576],
    representations: Representation[] = ['array', 'string']
  let output: string | null = 'benchmark/.results/text.json'
  const args = process.argv.slice(2)
  for (let i = 0; i < args.length; ++i) {
    if (args[i] === '--runs') runs = Number(args[++i])
    else if (args[i] === '--sizes') sizes = args[++i].split(',').map(Number)
    else if (args[i] === '--representations')
      representations = args[++i].split(',') as Representation[]
    else if (args[i] === '--output') output = args[++i]
    else if (args[i] === '--no-output') output = null
    else throw new TypeError(`Unknown text benchmark option: ${args[i]}`)
  }
  if (
    !Number.isInteger(runs) ||
    runs < 1 ||
    !sizes.length ||
    sizes.some((n) => !Number.isInteger(n) || n < 64 || n > 16777216) ||
    !representations.length ||
    representations.some((r) => r !== 'array' && r !== 'string')
  )
    throw new RangeError(
      'Runs must be positive; sizes must be integers in 64..16777216; representations must be array or string.'
    )
  const report: Report = {
    ...runSource(),
    environment: `Node ${process.versions.node}, V8 ${process.versions.v8}, ${platform()} ${arch()}, ${cpus()[0]?.model ?? 'unknown CPU'}`,
    runs,
    samples: [],
    space: [],
  }
  for (let run = 1; run <= runs; ++run)
    for (const size of sizes) {
      const text = 'x'.repeat(size)
      const modes = run % 2 ? representations : representations.toReversed()
      for (const representation of modes) {
        resetRuntime()
        const source = new Projection<string>(1)
        source.insert(text.split(''), 0)
        const snapshot = source.sequence(true)
        source.destroy()
        const before = measureRuntimeMemory().bytes
        const instance = new Projection<string>(1)
        const gossip = instance.insert(
          representation === 'string' ? text : text.split(''),
          0
        )
        const estimatedBytes = measureRuntimeMemory().bytes - before
        const encoded = encode(instance.sequence(true))
        const encodedUpdate = encode(gossip)
        report.space.push({
          run,
          size,
          representation,
          estimatedBytes,
          messagePackBytes: encoded.byteLength,
          gzipBytes: gzipSync(encoded, { level: 9 }).byteLength,
          updateMessagePackBytes: encodedUpdate.byteLength,
          updateGzipBytes: gzipSync(encodedUpdate, { level: 9 }).byteLength,
        })
        instance.destroy()
        for (const operation of operations) {
          globalThis.gc?.()
          measure(operation, representation, text, snapshot, 10)
          globalThis.gc?.()
          report.samples.push({
            run,
            size,
            representation,
            operation,
            ...measure(operation, representation, text, snapshot, 25),
          })
        }
        console.log(
          `Text benchmark: run ${run}/${runs}, ${size} code units, ${representation}`
        )
      }
    }
  const paths = await writeReportFiles(output, report, render(report))
  if (paths) {
    await updateTextReadme(report, paths.markdownPath)
    console.log(paths.markdownPath)
  }
}
await main()
