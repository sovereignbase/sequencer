import { brotliCompressSync, gzipSync } from 'node:zlib'
import { encode } from '@msgpack/msgpack'
import { fileURLToPath } from 'node:url'
import path from 'node:path'
import {
  __acknowledge,
  __create,
  __delete,
  __garbageCollect,
  __snapshot,
  __update,
} from '../../dist/index.js'
import { adapters } from '../adapters/index.js'
import { value } from '../helpers/value.js'

const SMALL = 100
const MEDIUM = 1_000
const LARGE = 5_000
const BATCH = 100
const LIBRARIES = [
  ['crlist', 'crlist'],
  ['yjs', 'yjs'],
  ['jsonJoy', 'json-joy'],
  ['automerge', 'automerge'],
]

function ids(start, amount) {
  return Array.from({ length: amount }, (_, index) => start + index)
}

function values(start, amount) {
  return Array.from({ length: amount }, (_, index) => value(start + index))
}

function createState(size, chunk = BATCH) {
  const state = __create()
  for (let start = 0; start < size; start += chunk) {
    const amount = Math.min(chunk, size - start)
    void __update(state.size, values(start, amount), state, 'after')
  }
  return state
}

function createFragmentedState(size) {
  return createState(size, 1)
}

function must(result, label) {
  if (!result) throw new Error(`${label} produced no artifact`)
  return result
}

function deleteTailRatio(size, ratio) {
  const state = createState(size)
  const start = Math.floor(size * (1 - ratio))
  const result = must(__delete(state, start, size), `delete tail ${ratio}`)
  return { state, delta: result.delta }
}

function deleteEveryOther(size) {
  const state = createState(size)
  for (let index = state.size - 1; index >= 0; index -= 2)
    void must(__delete(state, index, index + 1), `delete sparse ${index}`)
  return state
}

function gc(state) {
  const ack = __acknowledge(state)
  if (ack) void __garbageCollect([ack, ack], state)
  return state
}

function payloadBlocks(payload) {
  return Array.isArray(payload?.blocks) ? payload.blocks.length : ''
}

function payloadDeletedRuns(payload) {
  return Array.isArray(payload?.deletedRuns) ? payload.deletedRuns.length : ''
}

function bytes(value) {
  return Buffer.byteLength(value)
}

function formatKiB(value) {
  return (value / 1024).toFixed(2)
}

function formatKiBValue(value) {
  return value == null ? 'n/a' : formatKiB(value)
}

function pad(value, width) {
  const text = String(value)
  return text.length >= width ? text : text + ' '.repeat(width - text.length)
}

function artifactBytes(artifact) {
  if (artifact == null) return undefined
  if (ArrayBuffer.isView(artifact)) return artifact.byteLength
  if (artifact instanceof ArrayBuffer) return artifact.byteLength
  if (typeof artifact.toBinary === 'function')
    return artifactBytes(artifact.toBinary())
  if (Array.isArray(artifact)) {
    const binaryLength = artifact.reduce((total, item) => {
      const length = artifactBytes(item)
      return length == null ? Number.NaN : total + length
    }, 0)
    return Number.isNaN(binaryLength)
      ? encode(artifact).byteLength
      : binaryLength
  }
  return encode(artifact).byteLength
}

function adapterState(adapter, size, chunk = BATCH) {
  let state = adapter.empty()
  for (let start = 0; start < size; start += chunk)
    state = adapter.append(state, ids(start, Math.min(chunk, size - start)))
  return state
}

function comparableState(key, adapter, size) {
  return key === 'crlist' ? createState(size) : adapter.create(size)
}

function comparableRows() {
  const scenarios = [
    {
      kind: 'snapshot',
      scenario: 'empty',
      live: 0,
      artifact: (_key, adapter) => adapter.snapshot(adapter.empty()),
    },
    {
      kind: 'snapshot',
      scenario: 'clean 100',
      live: SMALL,
      artifact: (key, adapter) =>
        adapter.snapshot(comparableState(key, adapter, SMALL)),
    },
    {
      kind: 'snapshot',
      scenario: 'clean 5,000',
      live: LARGE,
      artifact: (key, adapter) =>
        adapter.snapshot(comparableState(key, adapter, LARGE)),
    },
    {
      kind: 'snapshot',
      scenario: 'fragmented 1,000 single appends',
      live: MEDIUM,
      artifact: (_key, adapter) =>
        adapter.snapshot(adapterState(adapter, MEDIUM, 1)),
    },
    {
      kind: 'delta',
      scenario: 'append single into 100',
      live: SMALL + 1,
      artifact: (key, adapter) =>
        adapter.change(comparableState(key, adapter, SMALL), {
          type: 'insert',
          index: SMALL,
          id: SMALL,
        }).artifact,
    },
    {
      kind: 'delta',
      scenario: 'prepend single into 100',
      live: SMALL + 1,
      artifact: (key, adapter) =>
        adapter.change(comparableState(key, adapter, SMALL), {
          type: 'insert',
          index: 0,
          id: SMALL,
        }).artifact,
    },
    {
      kind: 'delta',
      scenario: 'middle insert single into 100',
      live: SMALL + 1,
      artifact: (key, adapter) =>
        adapter.change(comparableState(key, adapter, SMALL), {
          type: 'insert',
          index: 50,
          id: SMALL,
        }).artifact,
    },
    {
      kind: 'delta',
      scenario: 'overwrite middle single in 1,000',
      live: MEDIUM,
      artifact: (key, adapter) =>
        adapter.change(comparableState(key, adapter, MEDIUM), {
          type: 'overwrite',
          index: 500,
          id: LARGE,
        }).artifact,
    },
    {
      kind: 'delta',
      scenario: 'delete head single from 1,000',
      live: MEDIUM - 1,
      artifact: (key, adapter) =>
        adapter.change(comparableState(key, adapter, MEDIUM), {
          type: 'delete',
          index: 0,
          id: 'delete-head',
        }).artifact,
    },
  ]

  return scenarios.map((scenario) => {
    const row = {
      kind: scenario.kind,
      scenario: scenario.scenario,
      live: scenario.live,
    }
    for (const [key, label] of LIBRARIES) {
      const adapter = adapters.get(key)
      row[label] = artifactBytes(scenario.artifact(key, adapter))
    }
    return row
  })
}

function sizeWinner(row) {
  const candidates = LIBRARIES.map(([, label]) => [label, row[label]]).filter(
    ([, value]) => value != null
  )
  if (candidates.length === 0) return 'n/a'
  candidates.sort(([, left], [, right]) => left - right)
  return candidates[0][0]
}

function measureCrlist(kind, scenario, payload, live) {
  const json = JSON.stringify(payload)
  const msgpack = encode(payload)
  return {
    library: 'crlist',
    kind,
    scenario,
    live,
    blocks: payloadBlocks(payload),
    deletedRuns: payloadDeletedRuns(payload),
    msgpack: msgpack.byteLength,
    msgpackGzip: gzipSync(msgpack).byteLength,
    msgpackBrotli: brotliCompressSync(msgpack).byteLength,
    json: bytes(json),
  }
}

function printComparableTable(rows) {
  const columns = [
    ['kind', (row) => row.kind],
    ['scenario', (row) => row.scenario],
    ['live', (row) => row.live.toLocaleString('en-US')],
    ['crlist KiB', (row) => formatKiBValue(row.crlist)],
    ['yjs KiB', (row) => formatKiBValue(row.yjs)],
    ['json-joy KiB', (row) => formatKiBValue(row['json-joy'])],
    ['automerge KiB', (row) => formatKiBValue(row.automerge)],
    ['winner', sizeWinner],
  ]
  const widths = columns.map(([header, getter]) =>
    Math.max(header.length, ...rows.map((row) => getter(row).length))
  )
  console.log('library return size (KiB, smaller is better)')
  console.log(
    columns.map(([header], index) => pad(header, widths[index])).join('  ')
  )
  console.log(widths.map((width) => '-'.repeat(width)).join('  '))
  for (const row of rows)
    console.log(
      columns
        .map(([, getter], index) => pad(getter(row), widths[index]))
        .join('  ')
    )
}

function printCrlistTable(rows) {
  const columns = [
    ['library', (row) => row.library],
    ['kind', (row) => row.kind],
    ['scenario', (row) => row.scenario],
    ['live', (row) => row.live.toLocaleString('en-US')],
    ['blocks', (row) => String(row.blocks)],
    ['deletedRuns', (row) => String(row.deletedRuns)],
    ['msgpack KiB', (row) => formatKiB(row.msgpack)],
    ['gzip KiB', (row) => formatKiB(row.msgpackGzip)],
    ['brotli KiB', (row) => formatKiB(row.msgpackBrotli)],
    ['json KiB', (row) => formatKiB(row.json)],
  ]
  const widths = columns.map(([header, getter]) =>
    Math.max(header.length, ...rows.map((row) => getter(row).length))
  )
  console.log('\ncrlist payload details (KiB)')
  console.log(
    columns.map(([header], index) => pad(header, widths[index])).join('  ')
  )
  console.log(widths.map((width) => '-'.repeat(width)).join('  '))
  for (const row of rows)
    console.log(
      columns
        .map(([, getter], index) => pad(getter(row), widths[index]))
        .join('  ')
    )
}

function crlistRows() {
  const cleanSmall = createState(SMALL)
  const cleanLarge = createState(LARGE)
  const fragmented = createFragmentedState(MEDIUM)
  const tail50 = deleteTailRatio(LARGE, 0.5)
  const tail90 = deleteTailRatio(LARGE, 0.9)
  const sparse = deleteEveryOther(MEDIUM)

  return [
    measureCrlist('snapshot', 'empty', __snapshot(__create()), 0),
    measureCrlist(
      'snapshot',
      'clean 100 batched',
      __snapshot(cleanSmall),
      SMALL
    ),
    measureCrlist(
      'snapshot',
      'clean 5,000 batched',
      __snapshot(cleanLarge),
      LARGE
    ),
    measureCrlist(
      'snapshot',
      'fragmented 1,000 single appends',
      __snapshot(fragmented),
      MEDIUM
    ),
    measureCrlist(
      'delta',
      'append single into 100',
      must(
        __update(SMALL, values(SMALL, 1), createState(SMALL), 'after'),
        'append single'
      ).delta,
      SMALL + 1
    ),
    measureCrlist(
      'delta',
      'append batch 100 into 100',
      must(
        __update(SMALL, values(SMALL, BATCH), createState(SMALL), 'after'),
        'append batch'
      ).delta,
      SMALL + BATCH
    ),
    measureCrlist(
      'delta',
      'prepend batch 100 into 100',
      must(
        __update(0, values(SMALL, BATCH), createState(SMALL), 'before'),
        'prepend batch'
      ).delta,
      SMALL + BATCH
    ),
    measureCrlist(
      'delta',
      'middle insert batch 100 into 100',
      must(
        __update(50, values(SMALL, BATCH), createState(SMALL), 'before'),
        'middle insert batch'
      ).delta,
      SMALL + BATCH
    ),
    measureCrlist(
      'delta',
      'overwrite middle 100 in 1,000',
      must(
        __update(450, values(LARGE, BATCH), createState(MEDIUM), 'overwrite'),
        'overwrite middle'
      ).delta,
      MEDIUM
    ),
    measureCrlist(
      'delta',
      'delete head single from 1,000',
      must(__delete(createState(MEDIUM), 0, 1), 'delete head').delta,
      MEDIUM - 1
    ),
    measureCrlist(
      'delta',
      'delete middle range 100 from 1,000',
      must(__delete(createState(MEDIUM), 450, 550), 'delete middle range')
        .delta,
      MEDIUM - BATCH
    ),
    measureCrlist(
      'snapshot',
      'tail 50% tombstoned before gc',
      __snapshot(tail50.state),
      tail50.state.size
    ),
    measureCrlist(
      'ack',
      'tail 50% tombstoned',
      __acknowledge(tail50.state),
      tail50.state.size
    ),
    measureCrlist(
      'snapshot',
      'tail 50% tombstoned after gc',
      __snapshot(gc(tail50.state)),
      tail50.state.size
    ),
    measureCrlist(
      'snapshot',
      'tail 90% tombstoned before gc',
      __snapshot(tail90.state),
      tail90.state.size
    ),
    measureCrlist(
      'ack',
      'tail 90% tombstoned',
      __acknowledge(tail90.state),
      tail90.state.size
    ),
    measureCrlist(
      'snapshot',
      'tail 90% tombstoned after gc',
      __snapshot(gc(tail90.state)),
      tail90.state.size
    ),
    measureCrlist(
      'snapshot',
      'sparse every other before gc',
      __snapshot(sparse),
      sparse.size
    ),
    measureCrlist(
      'ack',
      'sparse every other',
      __acknowledge(sparse),
      sparse.size
    ),
    measureCrlist(
      'snapshot',
      'sparse every other after gc',
      __snapshot(gc(sparse)),
      sparse.size
    ),
  ]
}

export function measureComparableByteSize() {
  return comparableRows()
}

export function measureCrlistByteSize() {
  return crlistRows()
}

export function measureByteSize() {
  return {
    comparable: measureComparableByteSize(),
    crlist: measureCrlistByteSize(),
  }
}

function main() {
  const rows = measureByteSize()
  printComparableTable(rows.comparable)
  printCrlistTable(rows.crlist)
}

if (
  process.argv[1] &&
  fileURLToPath(import.meta.url) === path.resolve(process.argv[1])
)
  main()
