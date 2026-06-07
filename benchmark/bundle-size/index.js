import { brotliCompressSync, gzipSync } from 'node:zlib'
import { mkdir, rm, writeFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import path from 'node:path'
import { build } from 'esbuild'
import { minify } from 'terser'

const root = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  '..',
  '..'
)

const workdir = path.join(root, 'benchmark', 'bundle-size', '.tmp')

const entries = [
  {
    library: 'crlist',
    scope: 'core-list',
    source: `
      import {
        __create,
        __delete,
        __merge,
        __read,
        __snapshot,
        __update
      } from '../../../dist/index.js'

      export function exercise() {
        const state = __create()
        const inserted = __update(0, [{ id: 'a' }, { id: 'b' }], state, 'after')
        const read = __read(0, state)
        __update(1, [{ id: 'c' }], state, 'overwrite')
        __delete(state, 0, 1)
        const clone = __create(__snapshot(state))
        if (inserted?.delta) __merge(clone, inserted.delta)
        return [read, __snapshot(clone)]
      }
    `,
  },
  {
    library: 'crlist',
    scope: 'class-list',
    source: `
      import { CRList } from '../../../dist/index.js'

      export function exercise() {
        const list = new CRList()
        list.append([{ id: 'a' }, { id: 'b' }])
        const read = list.get(0)
        list.set(1, [{ id: 'c' }])
        list.delete(0)
        list.merge(list.toJSON())
        return [read, list.toJSON()]
      }
    `,
  },
  {
    library: 'yjs',
    scope: 'array-list',
    source: `
      import * as Y from 'yjs'

      export function exercise() {
        const doc = new Y.Doc()
        const list = doc.getArray('list')
        list.push([{ id: 'a' }, { id: 'b' }])
        const read = list.get(0)
        list.delete(0, 1)
        list.insert(0, [{ id: 'c' }])
        const snapshot = Y.encodeStateAsUpdate(doc)
        const clone = new Y.Doc()
        Y.applyUpdate(clone, snapshot)
        return [read, Y.encodeStateVector(clone)]
      }
    `,
  },
  {
    library: 'jsonJoy',
    scope: 'array-model',
    source: `
      import { Model } from 'json-joy/lib/json-crdt/model/Model.js'

      export function exercise() {
        const model = Model.create()
        model.api.set([{ id: 'a' }, { id: 'b' }])
        model.api.flush()
        const list = model.api.get().asArr()
        const read = list.get(0)?.view()
        list.upd(1, { id: 'c' })
        list.del(0, 1)
        const patch = model.api.flush()
        const clone = Model.fromBinary(model.toBinary())
        clone.applyPatch(patch)
        return [read, clone.toBinary()]
      }
    `,
  },
  {
    library: 'automerge',
    scope: 'list',
    source: `
      import * as Automerge from '@automerge/automerge'

      export function exercise() {
        const doc = Automerge.from({ list: [{ id: 'a' }, { id: 'b' }] })
        const next = Automerge.change(doc, draft => {
          draft.list[0] = { id: 'c' }
          draft.list.deleteAt(1, 1)
          draft.list.insertAt(1, { id: 'd' })
        })
        const changes = Automerge.getChanges(doc, next)
        const merged = Automerge.applyChanges(doc, changes)[0]
        return Automerge.save(merged)
      }
    `,
  },
]

function kibibytes(bytes) {
  return bytes / 1024
}

function formatKiB(bytes) {
  return kibibytes(bytes).toFixed(2)
}

function byteLength(value) {
  return Buffer.byteLength(value)
}

function pad(value, width) {
  const text = String(value)
  return text.length >= width ? text : text + ' '.repeat(width - text.length)
}

function printTable(rows) {
  const columns = [
    ['library', (row) => row.library],
    ['scope', (row) => row.scope],
    ['raw KiB', (row) => formatKiB(row.raw)],
    ['min KiB', (row) => formatKiB(row.minified)],
    ['gzip KiB', (row) => formatKiB(row.gzip)],
    ['brotli KiB', (row) => formatKiB(row.brotli)],
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

function winner(rows, metric) {
  return rows.toSorted((left, right) => left[metric] - right[metric]).at(0)
}

function printWinners(rows) {
  const metrics = [
    ['raw', 'raw'],
    ['minified', 'minified'],
    ['gzip', 'gzip'],
    ['brotli', 'brotli'],
  ]
  const winnerRows = metrics.map(([label, metric]) => {
    const row = winner(rows, metric)
    return {
      metric: label,
      winner: row.library,
      scope: row.scope,
      kib: row[metric],
    }
  })
  const columns = [
    ['metric', (row) => row.metric],
    ['winner', (row) => row.winner],
    ['scope', (row) => row.scope],
    ['KiB', (row) => formatKiB(row.kib)],
  ]
  const widths = columns.map(([header, getter]) =>
    Math.max(header.length, ...winnerRows.map((row) => getter(row).length))
  )
  console.log('\nbundle winners (smaller is better)')
  console.log(
    columns.map(([header], index) => pad(header, widths[index])).join('  ')
  )
  console.log(widths.map((width) => '-'.repeat(width)).join('  '))
  for (const row of winnerRows)
    console.log(
      columns
        .map(([, getter], index) => pad(getter(row), widths[index]))
        .join('  ')
    )
}

async function measure(entry) {
  await mkdir(workdir, { recursive: true })
  const entryPath = path.join(workdir, `${entry.library}-${entry.scope}.js`)
  await writeFile(entryPath, entry.source)

  const bundled = await build({
    absWorkingDir: root,
    bundle: true,
    entryPoints: [entryPath],
    format: 'esm',
    legalComments: 'none',
    loader: { '.wasm': 'binary' },
    logLevel: 'silent',
    minify: false,
    platform: 'browser',
    sourcemap: false,
    target: ['es2022'],
    treeShaking: true,
    write: false,
  })

  const source = bundled.outputFiles[0].text
  const minified = await minify(source, {
    compress: true,
    ecma: 2022,
    format: { comments: false },
    module: true,
    mangle: true,
    toplevel: true,
  })
  if (!minified.code)
    throw new Error(`${entry.library}:${entry.scope} minification failed`)

  return {
    library: entry.library,
    scope: entry.scope,
    raw: byteLength(source),
    minified: byteLength(minified.code),
    gzip: gzipSync(minified.code).byteLength,
    brotli: brotliCompressSync(minified.code).byteLength,
  }
}

export async function measureBundleSize() {
  await rm(workdir, { recursive: true, force: true })
  await mkdir(workdir, { recursive: true })
  try {
    const rows = []
    for (const entry of entries) rows.push(await measure(entry))
    return rows
  } finally {
    await rm(workdir, { recursive: true, force: true })
  }
}

async function main() {
  const rows = await measureBundleSize()
  printTable(rows)
  printWinners(rows)
}

if (
  process.argv[1] &&
  fileURLToPath(import.meta.url) === path.resolve(process.argv[1])
)
  await main()
