import { brotliCompressSync, gzipSync } from 'node:zlib'
import { encode } from '@msgpack/msgpack'
import {
  __acknowledge,
  __create,
  __delete,
  __garbageCollect,
  __snapshot,
  __update,
} from '../../dist/index.js'
import { value } from '../helpers/value.js'

const SMALL = 100
const MEDIUM = 1_000
const LARGE = 5_000
const BATCH = 100

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

function formatBytes(value) {
  return new Intl.NumberFormat('en-US').format(value)
}

function formatKiB(value) {
  return (value / 1024).toFixed(2)
}

function pad(value, width) {
  const text = String(value)
  return text.length >= width ? text : text + ' '.repeat(width - text.length)
}

function measure(kind, scenario, payload, live) {
  const json = JSON.stringify(payload)
  const msgpack = encode(payload)
  return {
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

function printTable(rows) {
  const columns = [
    ['kind', (row) => row.kind],
    ['scenario', (row) => row.scenario],
    ['live', (row) => formatBytes(row.live)],
    ['blocks', (row) => String(row.blocks)],
    ['deletedRuns', (row) => String(row.deletedRuns)],
    ['msgpack B', (row) => formatBytes(row.msgpack)],
    ['msgpack KiB', (row) => formatKiB(row.msgpack)],
    ['gzip B', (row) => formatBytes(row.msgpackGzip)],
    ['brotli B', (row) => formatBytes(row.msgpackBrotli)],
    ['json B', (row) => formatBytes(row.json)],
  ]
  const widths = columns.map(([header, getter]) =>
    Math.max(header.length, ...rows.map((row) => getter(row).length))
  )
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

function rows() {
  const cleanSmall = createState(SMALL)
  const cleanLarge = createState(LARGE)
  const fragmented = createFragmentedState(MEDIUM)
  const tail50 = deleteTailRatio(LARGE, 0.5)
  const tail90 = deleteTailRatio(LARGE, 0.9)
  const sparse = deleteEveryOther(MEDIUM)

  return [
    measure('snapshot', 'empty', __snapshot(__create()), 0),
    measure('snapshot', 'clean 100 batched', __snapshot(cleanSmall), SMALL),
    measure('snapshot', 'clean 5,000 batched', __snapshot(cleanLarge), LARGE),
    measure(
      'snapshot',
      'fragmented 1,000 single appends',
      __snapshot(fragmented),
      MEDIUM
    ),
    measure(
      'delta',
      'append single into 100',
      must(
        __update(SMALL, values(SMALL, 1), createState(SMALL), 'after'),
        'append single'
      ).delta,
      SMALL + 1
    ),
    measure(
      'delta',
      'append batch 100 into 100',
      must(
        __update(SMALL, values(SMALL, BATCH), createState(SMALL), 'after'),
        'append batch'
      ).delta,
      SMALL + BATCH
    ),
    measure(
      'delta',
      'prepend batch 100 into 100',
      must(
        __update(0, values(SMALL, BATCH), createState(SMALL), 'before'),
        'prepend batch'
      ).delta,
      SMALL + BATCH
    ),
    measure(
      'delta',
      'middle insert batch 100 into 100',
      must(
        __update(50, values(SMALL, BATCH), createState(SMALL), 'before'),
        'middle insert batch'
      ).delta,
      SMALL + BATCH
    ),
    measure(
      'delta',
      'overwrite middle 100 in 1,000',
      must(
        __update(450, values(LARGE, BATCH), createState(MEDIUM), 'overwrite'),
        'overwrite middle'
      ).delta,
      MEDIUM
    ),
    measure(
      'delta',
      'delete head single from 1,000',
      must(__delete(createState(MEDIUM), 0, 1), 'delete head').delta,
      MEDIUM - 1
    ),
    measure(
      'delta',
      'delete middle range 100 from 1,000',
      must(__delete(createState(MEDIUM), 450, 550), 'delete middle range')
        .delta,
      MEDIUM - BATCH
    ),
    measure(
      'snapshot',
      'tail 50% tombstoned before gc',
      __snapshot(tail50.state),
      tail50.state.size
    ),
    measure(
      'ack',
      'tail 50% tombstoned',
      __acknowledge(tail50.state),
      tail50.state.size
    ),
    measure(
      'snapshot',
      'tail 50% tombstoned after gc',
      __snapshot(gc(tail50.state)),
      tail50.state.size
    ),
    measure(
      'snapshot',
      'tail 90% tombstoned before gc',
      __snapshot(tail90.state),
      tail90.state.size
    ),
    measure(
      'ack',
      'tail 90% tombstoned',
      __acknowledge(tail90.state),
      tail90.state.size
    ),
    measure(
      'snapshot',
      'tail 90% tombstoned after gc',
      __snapshot(gc(tail90.state)),
      tail90.state.size
    ),
    measure(
      'snapshot',
      'sparse every other before gc',
      __snapshot(sparse),
      sparse.size
    ),
    measure('ack', 'sparse every other', __acknowledge(sparse), sparse.size),
    measure(
      'snapshot',
      'sparse every other after gc',
      __snapshot(gc(sparse)),
      sparse.size
    ),
  ]
}

printTable(rows())
