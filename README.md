[![npm version](https://img.shields.io/npm/v/@sovereignbase/convergent-replicated-list)](https://www.npmjs.com/package/@sovereignbase/convergent-replicated-list)
[![CI](https://github.com/sovereignbase/convergent-replicated-list/actions/workflows/ci.yaml/badge.svg?branch=master)](https://github.com/sovereignbase/convergent-replicated-list/actions/workflows/ci.yaml)
[![codecov](https://codecov.io/gh/sovereignbase/convergent-replicated-list/branch/master/graph/badge.svg)](https://codecov.io/gh/sovereignbase/convergent-replicated-list)
[![license](https://img.shields.io/npm/l/@sovereignbase/convergent-replicated-list)](LICENSE)

# convergent-replicated-list

Convergent Replicated List (CR-List), a delta CRDT for an ordered sequence of entries.

- [Check the docs](https://sovereignbase.dev/convergent-replicated-list/docs/)
- [Read the specification](https://sovereignbase.dev/convergent-replicated-list/)

## Compatibility

- Runtimes: Node >= 22, modern browsers, Bun, Deno, Cloudflare Workers, Edge Runtime.
- Module format: ESM + CommonJS.
- Required globals / APIs: `EventTarget`, `CustomEvent`.
- TypeScript: bundled types.

## Goals

- Deterministic convergence of the live list projection under asynchronous gossip delivery.
- Consistent behavior across Node, browsers, worker, and edge runtimes.
- Garbage collection possibility without breaking live-view convergence.
- Event-driven API

## Installation

```sh
npm install @sovereignbase/convergent-replicated-list
# or
pnpm add @sovereignbase/convergent-replicated-list
# or
yarn add @sovereignbase/convergent-replicated-list
# or
bun add @sovereignbase/convergent-replicated-list
# or
deno add jsr:@sovereignbase/convergent-replicated-list
# or
vlt install jsr:@sovereignbase/convergent-replicated-list
```

## Usage

### Copy-paste example

```ts
import { CRList } from '@sovereignbase/convergent-replicated-list'

const alice = new CRList<string>()
const bob = new CRList<string>()

alice.addEventListener('delta', (event) => {
  bob.merge(event.detail)
})

alice.append('hello')
alice.append('world')
alice.prepend('first')

console.log([...alice]) // ['first', 'hello', 'world']
console.log([...bob]) // ['first', 'hello', 'world']
console.log(alice[1]) // 'hello'
```

### Hydrating from a snapshot

```ts
import {
  CRList,
  type CRListSnapshot,
} from '@sovereignbase/convergent-replicated-list'

const source = new CRList<string>()
let snapshot!: CRListSnapshot<string>

source.addEventListener(
  'snapshot',
  (event) => {
    snapshot = event.detail
  },
  { once: true }
)

source.append('draft')
source.append('ready')
source.snapshot()

const restored = new CRList<string>(snapshot)

console.log([...restored]) // ['draft', 'ready']
```

### Event channels

```ts
import { CRList } from '@sovereignbase/convergent-replicated-list'

const list = new CRList<string>()

list.addEventListener('delta', (event) => {
  console.log('delta', event.detail)
})

list.addEventListener('change', (event) => {
  console.log('change', event.detail)
})

list.addEventListener('snapshot', (event) => {
  console.log('snapshot', event.detail)
})

list.addEventListener('ack', (event) => {
  console.log('ack', event.detail)
})

list.append('a')
list[0] = 'b'
delete list[0]
```

### Iteration and JSON serialization

```ts
import { CRList } from '@sovereignbase/convergent-replicated-list'

const list = new CRList<string>()

list[0] = 'up'
list.append('dude!')
list.prepend('What is')

const snapshotJson = JSON.stringify(list)
const restored = new CRList<string>(JSON.parse(snapshotJson))

for (const value of list) {
  console.log(value)
}

for (const index in list) {
  console.log(index)
}

list.forEach((value, index, target) => {
  console.log(index, value, target.size)
})

const found = list.find((value, index, target) => {
  return index === 1 && target.size === 3 && value === 'up'
})

console.log(found) // 'up'
console.log([...restored]) // ['What is', 'up', 'dude!']
```

This example assumes your list values are JSON-compatible. For general
`structuredClone`-compatible values such as `Date`, `Map`, or `BigInt`, persist
snapshots with a structured-clone-capable store or an application-level codec
instead of plain `JSON.stringify` / `JSON.parse`.

Numeric reads, `for...of`, `find()`, and `forEach()` return detached copies of
visible values. Mutating those returned values does not mutate the underlying
replica state.

### Acknowledgements and garbage collection

```ts
import { CRList } from '@sovereignbase/convergent-replicated-list'

const alice = new CRList<string>()
const bob = new CRList<string>()
const frontiers = new Map<string, string>()

alice.addEventListener('delta', (event) => bob.merge(event.detail))
bob.addEventListener('delta', (event) => alice.merge(event.detail))

alice.addEventListener('ack', (event) => {
  frontiers.set('alice', event.detail)
})

bob.addEventListener('ack', (event) => {
  frontiers.set('bob', event.detail)
})

alice.append('x')
alice[0] = 'y'
delete alice[0]

alice.acknowledge()
bob.acknowledge()

alice.garbageCollect([...frontiers.values()])
bob.garbageCollect([...frontiers.values()])
```

### Advanced exports

If you need to build your own ordered-sequence CRDT binding instead of using the
high-level `CRList` class, the package also exports the core CRUD and MAGS
functions together with the replica and payload types.

Those low-level exports let you build custom list abstractions, protocol
wrappers, or framework-specific bindings while preserving the same convergence
rules as the default `CRList` binding.

```ts
import {
  __create,
  __update,
  __merge,
  __snapshot,
  type CRListDelta,
  type CRListSnapshot,
} from '@sovereignbase/convergent-replicated-list'

const source = __create<string>()
const target = __create<string>()
const local = __update(0, ['hello', 'world'], source, 'after')

if (local) {
  const outgoing: CRListDelta<string> = local.delta
  const remoteChange = __merge(target, outgoing)

  console.log(remoteChange)
}

const snapshot: CRListSnapshot<string> = __snapshot(target)
console.log(snapshot)
```

The intended split is:

- `__create`, `__read`, `__update`, `__delete` for local replica mutations.
- `__merge`, `__acknowledge`, `__garbageCollect`, `__snapshot` for gossip,
  compaction, and serialization.
- `CRList` when you want the default event-driven class API.

## Runtime behavior

### Validation and errors

Low-level exports can throw `CRListError` with stable error codes:

- `VALUE_NOT_CLONEABLE`
- `INDEX_OUT_OF_BOUNDS`
- `LIST_EMPTY`
- `LIST_INTEGRITY_VIOLATION`
- `UPDATE_EXPECTED_AN_ARRAY`

Ingress stays tolerant:

- malformed top-level merge payloads are ignored
- malformed snapshot values are dropped during hydration
- invalid UUIDs are ignored
- duplicate insert and delete deltas are idempotent
- stale or malicious deltas do not break convergence of the live view

### Safety and copying semantics

- Snapshots are detached structured-clone full-state payloads.
- Deltas are detached structured-clone gossip payloads intended to be forwarded
  as-is.
- `change` is a minimal index-keyed local patch.
- `toJSON()` returns a detached structured-clone snapshot.
- `JSON.stringify()` and `toString()` are only reliable when list values are
  JSON-compatible.
- Numeric reads, `for...of`, `find()`, and `forEach()` expose detached copies of visible values rather than mutable references into replica state.
- `for...of`, `find()`, `forEach()`, numeric indexing, `append()`, `prepend()`, `remove()`, `merge()`, `snapshot()`, `acknowledge()`, and `garbageCollect()` all operate on the live list projection.

### Convergence and compaction

- The convergence target is the live list projection, not internal cursor placement.
- Stable `predecessor` anchors determine deterministic ordering together with UUIDv7 sorting when placement cannot be resolved from a live predecessor chain.
- Tombstones remain until acknowledgement frontiers make them safe to collect.
- Garbage collection does not change the converged live projection for replicas that later catch up from delta or snapshot state.

## Tests

```sh
npm run test
```

What the current test suite covers:

- Coverage on built `dist/**/*.js`: `100%` statements, `100%` branches, `100%` functions, and `100%` lines, together with focused source-coverage tests for helper edge paths.
- Public `CRList` surface: indexing, iteration, `find`, `forEach`, proxy traps, events, JSON/inspect behavior.
- Core edge paths and malicious ingress handling for `__create`, `__read`, `__update`, `__delete`, `__merge`, `__snapshot`, `__acknowledge`, and `__garbageCollect`.
- Internal defensive branches under intentionally corrupt in-memory replica state.
- Integration convergence stress for:
  - local CRUD live-view semantics
  - snapshot hydration independent of value order
  - merge idempotency for duplicate insert/delete deltas
  - stale-peer acknowledgement and garbage collection recovery
  - shuffled asynchronous gossip delivery
  - shuffled delivery with replica restarts
  - concurrent insert after concurrently deleted predecessor
  - `100` aggressive deterministic convergence scenarios
- End-to-end runtime matrix for:
  - Node ESM
  - Node CJS
  - Bun ESM
  - Bun CJS
  - Deno ESM
  - Cloudflare Workers ESM
  - Edge Runtime ESM
  - Browsers via Playwright: Chromium, Firefox, WebKit, mobile Chrome, mobile Safari

## Benchmarks

```sh
npm run bench
```

Last measured on Node `v22.14.0` (`win32 x64`):

| group | scenario | n | ops | crlist ms/op | crlist ops/sec | yjs ms/op | yjs ops/sec | json-joy ms/op | json-joy ops/sec | automerge ms/op | automerge ops/sec | winner |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| crud | create / empty list | 5,000 | 250 | 0 | 583,294.45 | 0.18 | 5,571.94 | 0.02 | 53,113.51 | 0.34 | 2,947.03 | crlist |
| crud | create / hydrate snapshot | 5,000 | 250 | 3.46 | 288.76 | 9.03 | 110.78 | 18.55 | 53.91 | 160.71 | 6.22 | crlist |
| crud | create / hydrate clean snapshot | 5,000 | 250 | 3.51 | 284.77 | 8.53 | 117.22 | 18.88 | 52.96 | 160.14 | 6.24 | crlist |
| crud | create / hydrate tombstoned snapshot | 5,000 | 250 | 2.44 | 410.64 | 4.4 | 227.27 | 9.2 | 108.7 | 161.68 | 6.19 | crlist |
| crud | read / head | 5,000 | 250 | 0 | 1,175,917.22 | 0 | 550,539.53 | 0 | 244,045.29 | 0 | 3,373,819.16 | automerge |
| crud | read / middle | 5,000 | 250 | 0 | 7,961,783.44 | 0 | 916,422.29 | 0 | 683,433.57 | 0 | 8,064,516.13 | automerge |
| crud | read / tail | 5,000 | 250 | 0 | 8,474,576.27 | 0 | 1,009,693.05 | 0 | 688,136.53 | 0 | 9,727,626.46 | automerge |
| crud | read / random indexed reads | 5,000 | 250 | 0 | 829,737.8 | 0 | 415,075.54 | 0.01 | 177,834.68 | 0 | 1,305,483.03 | automerge |
| crud | read / sequential indexed reads from head | 5,000 | 250 | 0 | 862,068.97 | 0 | 762,892.89 | 0 | 261,834.94 | 0 | 1,229,709.79 | automerge |
| crud | read / sequential indexed reads from middle | 5,000 | 250 | 0 | 2,553,626.15 | 0 | 1,783,166.9 | 0 | 292,671.51 | 0 | 9,433,962.26 | automerge |
| crud | read / sequential indexed reads from tail | 5,000 | 250 | 0 | 3,136,762.86 | 0 | 2,258,355.92 | 0 | 296,068.21 | 0 | 7,396,449.7 | automerge |
| crud | read / full iteration visible values | 5,000 | 250 | 0.6 | 1,679.91 | 0.3 | 3,330.04 | 1.88 | 531.81 | 0.07 | 14,343.33 | automerge |
| crud | read / collect visible values to array | 5,000 | 250 | 0.59 | 1,686.75 | 0.24 | 4,154.16 | 1.57 | 635.25 | 0.09 | 11,518.24 | automerge |
| crud | read / visible sparse over deleted entries | 5,000 | 250 | 0 | 2,951,593.86 | 0.04 | 24,372.65 | 0.02 | 45,015.85 | 0 | 10,330,578.51 | automerge |
| crud | find / head | 5,000 | 250 | 0 | 1,381,215.47 | 0 | 1,838,235.29 | 0 | 655,307.99 | 0 | 1,637,197.12 | yjs |
| crud | find / middle | 5,000 | 250 | 0.2 | 5,001.17 | 0.13 | 7,414.94 | 0.72 | 1,388.37 | 0.01 | 81,118.79 | automerge |
| crud | find / tail | 5,000 | 250 | 0.65 | 1,541.22 | 0.23 | 4,382.01 | 1.65 | 607.04 | 0.02 | 50,712 | automerge |
| crud | find / missing value | 5,000 | 250 | 0.48 | 2,075.08 | 0.33 | 2,991.6 | 1.68 | 596.38 | 0.03 | 34,311.44 | automerge |
| crud | append / single after tail | 5,000 | 250 | 0.01 | 114,990.11 | 0.05 | 21,441.01 | 0.01 | 84,559.45 | 1.77 | 564.3 | crlist |
| crud | append / batch after tail | 5,000 | 25,000 | 0.01 | 174,856.72 | 0 | 327,724.87 | 0.01 | 126,154.38 | 0.18 | 5,450.98 | yjs |
| crud | append / batch after deleted tail | 5,000 | 25,000 | 0.01 | 190,267.58 | 0 | 506,374.24 | 0.01 | 157,324.53 | 0.18 | 5,472.65 | yjs |
| crud | append / batch after garbage collection | 5,000 | 25,000 | 0.01 | 187,246.28 | 0 | 425,156.33 | 0.01 | 156,701.01 | 0.18 | 5,563.28 | yjs |
| crud | prepend / single before head | 5,000 | 250 | 0.01 | 112,795.52 | 0.04 | 24,701.12 | 0.01 | 93,590.9 | 2.04 | 490.29 | crlist |
| crud | prepend / batch before head | 5,000 | 25,000 | 0.01 | 182,893.6 | 0 | 458,392.62 | 0.01 | 180,479.09 | 0.19 | 5,312.57 | yjs |
| crud | prepend / batch before deleted head | 5,000 | 25,000 | 0.01 | 191,870.67 | 0 | 646,414.08 | 0.01 | 173,786.95 | 0.19 | 5,365.48 | yjs |
| crud | prepend / batch after garbage collection | 5,000 | 25,000 | 0.01 | 199,418.34 | 0 | 677,797 | 0.01 | 198,482.48 | 0.19 | 5,292.68 | yjs |
| crud | insert / single before head | 5,000 | 250 | 0.01 | 122,129.95 | 0.03 | 37,967.38 | 0.01 | 89,589.68 | 2.1 | 476.97 | crlist |
| crud | insert / single after head | 5,000 | 250 | 0.01 | 108,450.46 | 0.02 | 50,539.76 | 0.01 | 78,171.41 | 1.99 | 503.71 | crlist |
| crud | insert / single before middle | 5,000 | 250 | 0.01 | 92,435.11 | 0.02 | 48,090.8 | 0.01 | 126,935.77 | 1.85 | 541.44 | json-joy |
| crud | insert / single after middle | 5,000 | 250 | 0.01 | 118,883.45 | 0.02 | 44,514.08 | 0.01 | 126,800.57 | 1.86 | 538.27 | json-joy |
| crud | insert / single before tail | 5,000 | 250 | 0.01 | 105,565.41 | 0.04 | 25,950.03 | 0.04 | 28,404.89 | 1.81 | 553.23 | crlist |
| crud | insert / single after tail | 5,000 | 250 | 0.01 | 170,380.97 | 0.06 | 17,784.86 | 0.01 | 171,915.83 | 1.74 | 573.36 | json-joy |
| crud | insert / batch before head | 5,000 | 25,000 | 0.01 | 193,719.31 | 0 | 721,124.03 | 0.01 | 163,549.31 | 0.18 | 5,418.81 | yjs |
| crud | insert / batch after head | 5,000 | 25,000 | 0.01 | 196,121.5 | 0 | 578,939.57 | 0.01 | 163,612.35 | 0.18 | 5,465.46 | yjs |
| crud | insert / batch before middle | 5,000 | 25,000 | 0.01 | 186,665.23 | 0 | 635,967.26 | 0.01 | 156,780.6 | 0.19 | 5,317.63 | yjs |
| crud | insert / batch after middle | 5,000 | 25,000 | 0.01 | 162,927.59 | 0 | 723,385.91 | 0.01 | 163,095.31 | 0.19 | 5,315.79 | yjs |
| crud | insert / batch before tail | 5,000 | 25,000 | 0.02 | 56,421.74 | 0 | 623,105.76 | 0.01 | 168,858.11 | 0.19 | 5,269.35 | yjs |
| crud | insert / batch after tail | 5,000 | 25,000 | 0.01 | 194,579.48 | 0 | 413,629.93 | 0.01 | 145,523.38 | 0.19 | 5,296.61 | yjs |
| crud | insert / repeated before head | 5,000 | 250 | 0.01 | 182,561.71 | 0.01 | 88,158.54 | 0.01 | 122,874.28 | 1.91 | 523.14 | crlist |
| crud | insert / repeated before middle | 5,000 | 250 | 0.01 | 155,666.25 | 0.02 | 63,595.43 | 0.01 | 176,765.89 | 1.94 | 514.69 | json-joy |
| crud | insert / repeated before tail | 5,000 | 250 | 0.01 | 165,980.61 | 0.02 | 51,275.74 | 0.01 | 185,956.56 | 1.65 | 607.26 | json-joy |
| crud | insert / random positions | 5,000 | 250 | 0.01 | 149,745.43 | 0.05 | 18,836.51 | 0.05 | 21,133.96 | 2.67 | 373.92 | crlist |
| crud | insert / alternating head and tail | 5,000 | 250 | 0.05 | 20,952.59 | 0.01 | 80,665.98 | 0.01 | 139,657 | 2.03 | 493.52 | json-joy |
| crud | overwrite / head | 5,000 | 250 | 0.01 | 112,405.02 | 0.06 | 15,601.89 | 0.02 | 62,261.85 | 2.09 | 478.58 | crlist |
| crud | overwrite / middle | 5,000 | 250 | 0.01 | 113,869.28 | 0.02 | 47,148.46 | 0.01 | 107,916.77 | 2.31 | 432.45 | crlist |
| crud | overwrite / tail | 5,000 | 250 | 0.02 | 43,058.9 | 0.02 | 40,025.62 | 0.01 | 110,040.05 | 1.88 | 530.97 | json-joy |
| crud | overwrite / random | 5,000 | 250 | 0.01 | 118,220.08 | 0.05 | 19,623.54 | 0.01 | 91,491.31 | 2.33 | 428.42 | crlist |
| crud | overwrite / same head repeatedly | 5,000 | 250 | 0.01 | 145,357.29 | 0.03 | 36,205.12 | 0.01 | 111,627.08 | 2.16 | 462.6 | crlist |
| crud | overwrite / same middle repeatedly | 5,000 | 250 | 0.01 | 146,998.29 | 0.03 | 36,654.74 | 0.01 | 120,059.55 | 1.99 | 501.52 | crlist |
| crud | overwrite / same tail repeatedly | 5,000 | 250 | 0.01 | 166,345.07 | 0.02 | 46,038.82 | 0.01 | 112,283.85 | 2.06 | 484.87 | crlist |
| crud | overwrite / random visible entries | 5,000 | 250 | 0.01 | 136,477.78 | 0.04 | 27,394.26 | 0.02 | 66,288.38 | 2.59 | 386.33 | crlist |
| crud | overwrite / after insert | 5,000 | 250 | 0.01 | 155,840.92 | 0.02 | 49,200.01 | 0.01 | 107,374.48 | 2.2 | 454.77 | crlist |
| crud | overwrite / after delete | 5,000 | 250 | 0.01 | 166,300.8 | 0.03 | 32,129.13 | 0.01 | 136,440.54 | 2.13 | 470.42 | crlist |
| crud | delete / head | 5,000 | 250 | 0.01 | 128,027.86 | 0.02 | 44,826.16 | 0.03 | 39,147.52 | 0.25 | 3,941.95 | crlist |
| crud | delete / middle | 5,000 | 250 | 0.01 | 131,870.45 | 0.02 | 46,850.7 | 0.04 | 27,892.45 | 0.27 | 3,727.79 | crlist |
| crud | delete / tail | 5,000 | 250 | 0 | 662,602.7 | 0.02 | 41,238.47 | 0 | 215,684.58 | 0.24 | 4,155.72 | crlist |
| crud | delete / range from head | 5,000 | 5,000 | 0 | 1,967,729.24 | 0 | 4,730,368.97 | 0 | 294,793.94 | 0.02 | 63,164.41 | yjs |
| crud | delete / range from middle | 5,000 | 5,000 | 0 | 612,564.93 | 0 | 3,573,470.55 | 0 | 250,096.29 | 0.02 | 61,511.13 | yjs |
| crud | delete / range from tail | 5,000 | 5,000 | 0 | 1,141,187.75 | 0 | 3,982,159.92 | 0 | 274,428.23 | 0.02 | 65,250.39 | yjs |
| crud | delete / every other entry | 5,000 | 2,500 | 0.01 | 130,597.4 | 0.11 | 8,908.9 | 0.09 | 10,753.32 | 0.25 | 4,049.03 | crlist |
| crud | delete / all entries from head one by one | 5,000 | 5,000 | 0.01 | 162,621.72 | 0.02 | 55,238.12 | 0.01 | 75,897.64 | 0.2 | 4,892.66 | crlist |
| crud | delete / all entries from middle outward | 5,000 | 5,000 | 0.01 | 124,464.8 | 0.01 | 76,920 | 0.01 | 158,465.04 | 0.22 | 4,511.9 | json-joy |
| crud | delete / all entries from tail one by one | 5,000 | 5,000 | 0 | 492,314.96 | 0.02 | 65,107.81 | 0 | 238,138.33 | 0.2 | 4,905.43 | crlist |
| crud | delete / all entries in random order | 5,000 | 5,000 | 0.15 | 6,675.66 | 14.86 | 67.28 | 8.1 | 123.53 | 0.25 | 3,961.93 | crlist |
| crud | delete / already deleted head | 5,000 | 250 | 0 | 457,456.54 | 0 | 254,893.96 | 0 | 579,642.94 | 0.02 | 40,047.42 | json-joy |
| crud | delete / already deleted middle | 5,000 | 250 | 0 | 662,778.37 | 0 | 277,161.86 | 0 | 1,110,124.33 | 0.02 | 44,908.3 | json-joy |
| crud | delete / already deleted tail | 5,000 | 250 | 0 | 1,516,070.35 | 0 | 245,098.04 | 0 | 1,217,730.15 | 0.02 | 41,829.1 | crlist |
| crud | mixed / append overwrite delete tail | 5,000 | 250 | 0.01 | 141,418.71 | 0.03 | 29,462.37 | 0.04 | 24,955.08 | 1.58 | 631.01 | crlist |
| crud | mixed / prepend overwrite delete head | 5,000 | 250 | 0.01 | 147,824.03 | 0.02 | 63,075.56 | 0.04 | 27,475.55 | 2.02 | 496.14 | crlist |
| crud | mixed / insert overwrite delete middle | 5,000 | 250 | 0.01 | 147,727.94 | 0.02 | 60,540.02 | 0.04 | 22,736.16 | 1.8 | 554.24 | crlist |
| crud | mixed / append prepend insert overwrite delete | 5,000 | 250 | 0.01 | 168,634.06 | 0.02 | 49,975.01 | 0.04 | 24,084.55 | 1.6 | 625.92 | crlist |
| mags | snapshot | 5,000 | 250 | 0.21 | 4,814.65 | 3.79 | 264.16 | 7.62 | 131.18 | 15.21 | 65.73 | crlist |
| mags | snapshot / clean state | 5,000 | 250 | 0.21 | 4,758.46 | 3.65 | 274.1 | 7.74 | 129.12 | 15.1 | 66.22 | crlist |
| mags | snapshot / tombstoned state 50% deleted | 5,000 | 250 | 0.11 | 8,860.35 | 1.84 | 542.93 | 3.33 | 300.45 | 15.09 | 66.29 | crlist |
| mags | snapshot / tombstoned state 90% deleted | 5,000 | 250 | 0.02 | 45,216.95 | 0.38 | 2,642.37 | 0.53 | 1,890.83 | 15.26 | 65.53 | crlist |
| mags | snapshot / after garbage collection | 5,000 | 250 | 0.12 | 8,673.03 | 1.9 | 526.82 | 3.43 | 291.91 | 15.16 | 65.98 | crlist |
| mags | snapshot / size bytes clean state | 5,000 | 1 | 0 | n/a | 0 | n/a | 0 | n/a | 0 | n/a | n/a |
| mags | snapshot / size bytes tombstoned state | 5,000 | 1 | 0 | n/a | 0 | n/a | 0 | n/a | 0 | n/a | n/a |
| mags | acknowledge | 5,000 | 250 | 0 | 2,035,830.62 | n/a | n/a | n/a | n/a | n/a | n/a | n/a |
| mags | acknowledge / clean state | 5,000 | 250 | 0 | 7,082,152.97 | n/a | n/a | n/a | n/a | n/a | n/a | n/a |
| mags | acknowledge / 50% deleted state | 5,000 | 250 | 0.04 | 23,333.96 | n/a | n/a | n/a | n/a | n/a | n/a | n/a |
| mags | acknowledge / 90% deleted state | 5,000 | 250 | 0.07 | 13,864.55 | n/a | n/a | n/a | n/a | n/a | n/a | n/a |
| mags | garbage collect | 5,000 | 250 | 0 | 1,276,161.31 | n/a | n/a | n/a | n/a | n/a | n/a | n/a |
| mags | garbage collect / no eligible tombstones | 5,000 | 250 | 0 | 5,555,555.56 | n/a | n/a | n/a | n/a | n/a | n/a | n/a |
| mags | garbage collect / 50% eligible tombstones | 5,000 | 250 | 0 | 544,069.64 | n/a | n/a | n/a | n/a | n/a | n/a | n/a |
| mags | garbage collect / 90% eligible tombstones | 5,000 | 250 | 0 | 694,444.44 | n/a | n/a | n/a | n/a | n/a | n/a | n/a |
| mags | garbage collect / partial frontiers 2 replicas | 5,000 | 250 | 0 | 4,310,344.83 | n/a | n/a | n/a | n/a | n/a | n/a | n/a |
| mags | garbage collect / partial frontiers 10 replicas | 5,000 | 250 | 0 | 5,154,639.18 | n/a | n/a | n/a | n/a | n/a | n/a | n/a |
| mags | post-gc read / full iteration visible values | 5,000 | 250 | 0.33 | 3,039.21 | 0.1 | 9,884.82 | 0.6 | 1,654.78 | 0.03 | 32,724.23 | automerge |
| mags | post-gc snapshot / size bytes | 5,000 | 1 | 0 | n/a | 0 | n/a | 0 | n/a | 0 | n/a | n/a |
| mags | delta / append head single op size bytes | 5,000 | 1 | 0 | n/a | 0 | n/a | 0 | n/a | 0 | n/a | n/a |
| mags | delta / append tail single op size bytes | 5,000 | 1 | 0 | n/a | 0 | n/a | 0 | n/a | 0 | n/a | n/a |
| mags | delta / prepend head single op size bytes | 5,000 | 1 | 0 | n/a | 0 | n/a | 0 | n/a | 0 | n/a | n/a |
| mags | delta / insert middle single op size bytes | 5,000 | 1 | 0 | n/a | 0 | n/a | 0 | n/a | 0 | n/a | n/a |
| mags | delta / overwrite head single op size bytes | 5,000 | 1 | 0 | n/a | 0 | n/a | 0 | n/a | 0 | n/a | n/a |
| mags | delta / overwrite middle single op size bytes | 5,000 | 1 | 0 | n/a | 0 | n/a | 0 | n/a | 0 | n/a | n/a |
| mags | delta / overwrite tail single op size bytes | 5,000 | 1 | 0 | n/a | 0 | n/a | 0 | n/a | 0 | n/a | n/a |
| mags | delta / delete head single op size bytes | 5,000 | 1 | 0 | n/a | 0 | n/a | 0 | n/a | 0 | n/a | n/a |
| mags | delta / delete middle single op size bytes | 5,000 | 1 | 0 | n/a | 0 | n/a | 0 | n/a | 0 | n/a | n/a |
| mags | delta / delete tail single op size bytes | 5,000 | 1 | 0 | n/a | 0 | n/a | 0 | n/a | 0 | n/a | n/a |
| mags | delta / range delete size bytes | 5,000 | 100 | 0 | n/a | 0 | n/a | 0 | n/a | 0 | n/a | n/a |
| mags | delta / batch append 100 ops size bytes | 5,000 | 100 | 0 | n/a | 0 | n/a | 0 | n/a | 0 | n/a | n/a |
| mags | delta / batch prepend 100 ops size bytes | 5,000 | 100 | 0 | n/a | 0 | n/a | 0 | n/a | 0 | n/a | n/a |
| mags | delta / batch insert middle 100 ops size bytes | 5,000 | 100 | 0 | n/a | 0 | n/a | 0 | n/a | 0 | n/a | n/a |
| mags | delta / batch overwrite 100 ops size bytes | 5,000 | 100 | 0 | n/a | 0 | n/a | 0 | n/a | 0 | n/a | n/a |
| mags | delta / batch mixed 100 ops size bytes | 5,000 | 100 | 0 | n/a | 0 | n/a | 0 | n/a | 0 | n/a | n/a |
| mags | merge ordered deltas | 5,000 | 250 | 0.35 | 2,819.36 | 0.02 | 61,993.21 | 0 | 206,423.91 | 3.26 | 306.91 | json-joy |
| mags | merge shuffled gossip | 5,000 | 250 | 0.62 | 1,601.54 | 0.73 | 1,372.19 | n/a | n/a | 0.7 | 1,434.24 | crlist |
| mags | merge / append head delta into equal replica | 5,000 | 1 | 0.19 | 5,324.81 | 0.1 | 10,288.07 | 0.07 | 13,568.52 | 3.38 | 296.21 | json-joy |
| mags | merge / append tail delta into equal replica | 5,000 | 1 | 0.03 | 33,112.58 | 0.03 | 33,222.59 | 0.01 | 93,457.94 | 3.32 | 301.15 | json-joy |
| mags | merge / prepend head delta into equal replica | 5,000 | 1 | 0.17 | 5,871.99 | 0.03 | 32,051.28 | 0.01 | 94,339.62 | 3.27 | 305.38 | json-joy |
| mags | merge / insert middle delta into equal replica | 5,000 | 1 | 0.08 | 11,947.43 | 0.03 | 35,971.22 | 0.01 | 67,114.09 | 3.37 | 297.15 | json-joy |
| mags | merge / overwrite head delta into equal replica | 5,000 | 1 | 0.99 | 1,013.07 | 0.03 | 30,959.75 | 0.01 | 84,033.61 | 3.23 | 309.3 | json-joy |
| mags | merge / overwrite middle delta into equal replica | 5,000 | 1 | 0.98 | 1,022.49 | 0.04 | 26,315.79 | 0.02 | 52,083.33 | 3.57 | 279.99 | json-joy |
| mags | merge / overwrite tail delta into equal replica | 5,000 | 1 | 0.9 | 1,111.36 | 0.05 | 20,283.98 | 0.01 | 84,745.76 | 3.37 | 296.39 | json-joy |
| mags | merge / delete head delta into equal replica | 5,000 | 1 | 0.85 | 1,182.31 | 0.02 | 42,194.09 | 0.02 | 52,356.02 | 2 | 500.98 | json-joy |
| mags | merge / delete middle delta into equal replica | 5,000 | 1 | 1.19 | 842.67 | 0.11 | 9,149.13 | 0.09 | 11,376.56 | 1.72 | 581.16 | json-joy |
| mags | merge / delete tail delta into equal replica | 5,000 | 1 | 1.06 | 940.82 | 0.02 | 42,016.81 | 0.01 | 99,009.9 | 1.77 | 563.82 | json-joy |
| mags | merge / duplicate delta ignored | 5,000 | 250 | 0 | 1,034,340.09 | 0.03 | 36,272.89 | 0.01 | 117,426.02 | 0.07 | 14,854.25 | crlist |
| mags | merge / old delta ignored after merge | 5,000 | 250 | 0 | 1,167,678.65 | 0.03 | 37,389.33 | 0 | 272,182.91 | 0.03 | 34,461.84 | crlist |
| mags | merge / ordered 1,000 append deltas | 5,000 | 1,000 | 0 | 396,510.71 | 0.03 | 37,317.75 | 0 | 222,657.64 | 4.18 | 239.16 | crlist |
| mags | merge / ordered 1,000 prepend deltas | 5,000 | 1,000 | 0.06 | 18,018.25 | 0.01 | 88,059.18 | 0.02 | 43,396.19 | 3.63 | 275.13 | yjs |
| mags | merge / ordered 1,000 middle insert deltas | 5,000 | 1,000 | 0.02 | 47,898.91 | 0.01 | 97,563.83 | 0.01 | 96,388.33 | 3.73 | 267.92 | yjs |
| mags | merge / shuffled 1,000 mixed deltas | 5,000 | 1,000 | 0.73 | 1,377.4 | 1.29 | 773.46 | n/a | n/a | 0.91 | 1,096.34 | crlist |
| mags | merge / reverse ordered 1,000 mixed deltas | 5,000 | 1,000 | 0.17 | 5,763.32 | 1.17 | 854.28 | n/a | n/a | 0.84 | 1,185.68 | crlist |
| mags | merge / concurrent prepends same head | 5,000 | 2 | 1.05 | 951.25 | 0.11 | 9,280.74 | n/a | n/a | 16.45 | 60.78 | yjs |
| mags | merge / concurrent appends same tail | 5,000 | 2 | 0.88 | 1,142.14 | 0.04 | 24,479.8 | n/a | n/a | 16.43 | 60.85 | yjs |
| mags | merge / concurrent inserts same middle position | 5,000 | 2 | 1.05 | 956.16 | 0.05 | 20,020.02 | n/a | n/a | 10.77 | 92.81 | yjs |
| mags | merge / concurrent overwrites same head | 5,000 | 2 | 2.22 | 449.9 | 0.04 | 24,600.25 | n/a | n/a | 8.49 | 117.82 | yjs |
| mags | merge / concurrent overwrites same middle | 5,000 | 2 | 6.89 | 145.2 | 0.05 | 22,148.39 | n/a | n/a | 15 | 66.66 | yjs |
| mags | merge / concurrent overwrites same tail | 5,000 | 2 | 1.77 | 565.28 | 0.04 | 25,125.63 | n/a | n/a | 14.87 | 67.23 | yjs |
| mags | merge / concurrent deletes same head | 5,000 | 2 | 2.09 | 477.51 | 0.02 | 47,846.89 | 0.02 | 45,558.09 | 7.75 | 128.98 | yjs |
| mags | merge / concurrent deletes same middle | 5,000 | 2 | 1.66 | 603.57 | 0.06 | 17,730.5 | 0.02 | 42,462.85 | 11.96 | 83.59 | json-joy |
| mags | merge / concurrent deletes same tail | 5,000 | 2 | 1.1 | 909.88 | 0.03 | 33,840.95 | 0.02 | 66,006.6 | 12.45 | 80.34 | json-joy |
| mags | merge / concurrent overwrite delete same entry | 5,000 | 2 | 7.8 | 128.24 | 0.07 | 14,566.64 | 0.11 | 9,442.87 | 16.51 | 60.57 | yjs |
| mags | merge / forked replicas rejoin after 250 ops each | 5,000 | 500 | 0.44 | 2,290.13 | 0.01 | 83,841.97 | n/a | n/a | 3.21 | 311.06 | yjs |
| mags | merge / 10 replicas gossip convergence | 5,000 | 100 | 1.24 | 806.5 | 0.05 | 20,920.94 | n/a | n/a | 6.85 | 145.92 | yjs |
| mags | merge / snapshot merge into stale replica | 5,000 | 5,350 | 0 | 448,449.29 | 0 | 403,107.32 | 0 | 242,140.61 | 0.03 | 29,164.09 | crlist |
| class | constructor / hydrate snapshot | 5,000 | 250 | 4.45 | 224.84 | 6.97 | 143.56 | 19.1 | 52.36 | 174.63 | 5.73 | crlist |
| class | read / head | 5,000 | 250 | 0 | 1,133,272.89 | 0 | 3,888,024.88 | 0 | 1,510,574.02 | 0 | 2,149,613.07 | yjs |
| class | read / middle | 5,000 | 250 | 0 | 1,237,011.38 | 0 | 15,625,000 | 0 | 3,315,649.87 | 0 | 11,111,111.11 | yjs |
| class | read / tail | 5,000 | 250 | 0 | 3,041,362.53 | 0 | 16,233,766.23 | 0 | 3,311,258.28 | 0 | 11,574,074.07 | yjs |
| class | find near head | 5,000 | 250 | 0 | 721,709.01 | 0 | 1,653,439.15 | 0 | 880,591.76 | 0 | 1,555,693.84 | yjs |
| class | find near middle | 5,000 | 250 | 1.53 | 653.42 | 0.09 | 11,699.68 | 0.88 | 1,131.24 | 0.02 | 62,567.26 | automerge |
| class | find near tail | 5,000 | 250 | 4.04 | 247.47 | 0.16 | 6,376.59 | 2.07 | 483.82 | 0.02 | 47,383.48 | automerge |
| class | iterate visible values | 5,000 | 250 | 0.12 | 8,057.76 | 0.24 | 4,175.56 | 1.87 | 533.61 | 0.08 | 13,319.13 | automerge |
| class | collect visible values to array | 5,000 | 250 | 0.11 | 9,324.46 | 0.23 | 4,344.24 | 2 | 498.87 | 0.09 | 10,684.99 | automerge |
| class | append / single after tail | 5,000 | 250 | 0.01 | 103,863.73 | 0.02 | 47,383.48 | 0.04 | 24,068.08 | 2.16 | 463.75 | crlist |
| class | append / batch after tail | 5,000 | 25,000 | 0.01 | 110,140.36 | 0 | 602,774.21 | 0.01 | 149,663.05 | 0.18 | 5,469.64 | yjs |
| class | prepend / single before head | 5,000 | 250 | 0.01 | 100,458.09 | 0.01 | 68,861.04 | 0.01 | 130,011.96 | 2.05 | 487.99 | json-joy |
| class | prepend / batch before head | 5,000 | 25,000 | 0.01 | 98,344.66 | 0 | 781,961.1 | 0 | 207,635.68 | 0.19 | 5,390.69 | yjs |
| class | insert / single before middle | 5,000 | 250 | 0.01 | 93,685.59 | 0.02 | 58,707.5 | 0.03 | 30,234.5 | 1.96 | 509.66 | crlist |
| class | insert / batch before middle | 5,000 | 25,000 | 0.01 | 111,602.06 | 0 | 667,934.85 | 0.01 | 186,150.27 | 0.19 | 5,308.63 | yjs |
| class | overwrite / head | 5,000 | 250 | 0.01 | 80,995.27 | 0.02 | 55,276.72 | 0.02 | 45,955.88 | 1.94 | 514.72 | crlist |
| class | overwrite / middle | 5,000 | 250 | 0.01 | 82,453.83 | 0.03 | 38,759.69 | 0.01 | 159,856.77 | 2.02 | 494.57 | json-joy |
| class | overwrite / tail | 5,000 | 250 | 0.01 | 80,932.34 | 0.02 | 59,956.35 | 0.01 | 128,014.75 | 1.96 | 509.34 | json-joy |
| class | overwrite / random | 5,000 | 250 | 0.01 | 88,636.77 | 0.04 | 27,969.52 | 0.01 | 107,628.72 | 2.04 | 490.48 | json-joy |
| class | remove / head | 5,000 | 250 | 0.01 | 98,779.09 | 0.02 | 49,558.93 | 0.03 | 39,574.5 | 0.26 | 3,842.45 | crlist |
| class | remove / middle | 5,000 | 250 | 0.01 | 72,871.43 | 0.01 | 97,412.72 | 0.04 | 25,259.41 | 0.27 | 3,760.27 | yjs |
| class | remove / tail | 5,000 | 250 | 0 | 371,581.45 | 0.02 | 65,107.56 | 0 | 261,151.15 | 0.28 | 3,514.87 | crlist |
| class | remove / range from head | 5,000 | 5,000 | 0.01 | 105,863.35 | 0 | 9,956,192.75 | 0 | 356,755.52 | 0.01 | 67,166.75 | yjs |
| class | remove / range from middle | 5,000 | 5,000 | 0.01 | 107,641.7 | 0 | 8,574,858.51 | 0 | 322,162.87 | 0.02 | 64,780.85 | yjs |
| class | remove / range from tail | 5,000 | 5,000 | 0.01 | 81,094.45 | 0 | 9,587,727.71 | 0 | 327,641.12 | 0.01 | 67,795.32 | yjs |
| class | mixed / append overwrite remove tail | 5,000 | 250 | 0.01 | 87,205.25 | 0.02 | 58,358.04 | 0.01 | 152,942.62 | 1.48 | 677.07 | json-joy |
| class | mixed / prepend overwrite remove head | 5,000 | 250 | 0.01 | 105,516.4 | 0.01 | 83,760.51 | 0.01 | 155,656.56 | 1.82 | 550.47 | json-joy |
| class | mixed / insert overwrite remove middle | 5,000 | 250 | 0.01 | 106,233.8 | 0.01 | 68,534.46 | 0.01 | 162,411.49 | 1.39 | 718.63 | json-joy |
| class | paste / insert 10,000 entries at cursor | 5,000 | 10,000 | 0.02 | 42,103.08 | 0 | 951,583.43 | 0.01 | 105,052.5 | 0.17 | 5,772.46 | yjs |
| class | render / join visible entries to string | 5,000 | 250 | 0.28 | 3,568.46 | 0.35 | 2,891.04 | 2.6 | 384.02 | 0.17 | 5,901.53 | automerge |
| class | snapshot | 5,000 | 250 | 0.17 | 6,008.13 | 3.74 | 267.13 | 8.73 | 114.55 | 15.38 | 65.02 | crlist |
| class | snapshot / tombstoned state 50% deleted | 5,000 | 250 | 0.14 | 7,158.73 | 1.85 | 539.8 | 3.1 | 322.54 | 15.29 | 65.4 | crlist |
| class | snapshot / after garbage collection | 5,000 | 250 | 0.22 | 4,540.47 | 0.25 | 3,933.69 | 1.86 | 538.65 | 0.08 | 13,314.8 | automerge |
| class | acknowledge | 5,000 | 250 | 0.09 | 11,570.54 | n/a | n/a | n/a | n/a | n/a | n/a | n/a |
| class | acknowledge / 50% deleted state | 5,000 | 250 | 0.05 | 18,302.01 | n/a | n/a | n/a | n/a | n/a | n/a | n/a |
| class | acknowledge / 90% deleted state | 5,000 | 250 | 0.07 | 14,118.15 | n/a | n/a | n/a | n/a | n/a | n/a | n/a |
| class | garbage collect | 5,000 | 250 | 0.13 | 7,581.94 | 0.23 | 4,428.45 | 1.78 | 562.63 | 0.07 | 13,861.4 | automerge |
| class | garbage collect / no eligible tombstones | 5,000 | 250 | 0.21 | 4,837.99 | 0.24 | 4,252.36 | 1.82 | 550.55 | 0.08 | 13,294.05 | automerge |
| class | garbage collect / 90% eligible tombstones | 5,000 | 250 | 0.16 | 6,392.54 | 0.25 | 4,079.55 | 1.69 | 591.18 | 0.08 | 13,072.1 | automerge |
| class | merge ordered deltas | 5,000 | 250 | 0.56 | 1,794.6 | 0.01 | 95,259.87 | 0 | 230,776.33 | 3.22 | 310.28 | json-joy |
| class | merge shuffled gossip | 5,000 | 250 | 0.65 | 1,531 | 0.39 | 2,559.41 | n/a | n/a | 0.68 | 1,462.42 | yjs |
| class | merge / duplicate delta ignored | 5,000 | 250 | 0 | 990,491.28 | 0.03 | 37,430.75 | 0 | 313,715.65 | 0.03 | 30,307.81 | crlist |
| class | merge / concurrent prepends same head | 5,000 | 2 | 1.67 | 599.16 | 0.07 | 13,431.83 | n/a | n/a | 9.29 | 107.6 | yjs |
| class | merge / concurrent appends same tail | 5,000 | 2 | 0.94 | 1,062.25 | 0.03 | 35,650.62 | n/a | n/a | 10.99 | 90.99 | yjs |
| class | merge / concurrent inserts same middle position | 5,000 | 2 | 1.59 | 627.88 | 0.04 | 25,940.34 | n/a | n/a | 11.26 | 88.78 | yjs |
| class | merge / forked replicas rejoin after 250 ops each | 5,000 | 500 | 0.86 | 1,158.7 | 0.01 | 73,332.06 | n/a | n/a | 3.2 | 312.98 | yjs |
| latency | append tail write to remote visible | 5,000 | 250 | 0.94 | 1,065.34 | 0.24 | 4,096.83 | 10.86 | 92.11 | 5.79 | 172.6 | yjs |
| latency | prepend head write to remote visible | 5,000 | 250 | 0.06 | 15,808.08 | 0.03 | 29,730.4 | 0.02 | 58,272.34 | 5.76 | 173.67 | json-joy |
| latency | middle insert write to remote visible | 5,000 | 250 | 0.36 | 2,793.55 | 0.13 | 7,767.35 | 3.9 | 256.34 | 5.74 | 174.34 | yjs |
| latency | head insert write to remote visible | 5,000 | 250 | 0.07 | 14,055.68 | 0.02 | 44,575.2 | 0.02 | 58,984.52 | 5.79 | 172.78 | json-joy |
| latency | overwrite head write to remote visible | 5,000 | 250 | 0.98 | 1,021.2 | 0.04 | 28,157.91 | 0.02 | 64,649.6 | 5.77 | 173.43 | json-joy |
| latency | overwrite middle write to remote visible | 5,000 | 250 | 1.59 | 627.88 | 0.13 | 7,549.61 | 2.73 | 365.66 | 5.8 | 172.5 | yjs |
| latency | overwrite tail write to remote visible | 5,000 | 250 | 1.62 | 617.03 | 0.23 | 4,282.4 | 5.6 | 178.56 | 5.74 | 174.15 | yjs |
| latency | head delete to remote hidden | 5,000 | 250 | 1.63 | 611.78 | 0.27 | 3,759.49 | 6.1 | 163.95 | 2.15 | 465.17 | yjs |
| latency | middle delete to remote hidden | 5,000 | 250 | 1.73 | 577.78 | 0.24 | 4,086.4 | 5.46 | 183.11 | 2.08 | 480.49 | yjs |
| latency | tail delete to remote hidden | 5,000 | 250 | 1.63 | 612.71 | 0.21 | 4,743 | 5.33 | 187.75 | 2.08 | 480.56 | yjs |
| latency | append tail write to 10 remotes visible | 5,000 | 2,500 | 0.64 | 1,574 | 0.2 | 4,982.9 | 11.93 | 83.85 | 3.82 | 261.53 | yjs |
| latency | prepend head write to 10 remotes visible | 5,000 | 2,500 | 0.09 | 11,716.74 | 0.01 | 97,163.6 | 0.01 | 80,234.16 | 3.84 | 260.3 | yjs |
| latency | middle insert write to 10 remotes visible | 5,000 | 2,500 | 0.38 | 2,612.49 | 0.11 | 8,900.45 | 4.63 | 216.2 | 3.9 | 256.59 | yjs |
| latency | overwrite middle write to 10 remotes visible | 5,000 | 2,500 | 1.79 | 557.94 | 0.1 | 9,630.07 | 3.18 | 314.23 | 3.89 | 257.28 | yjs |
| latency | delete middle to 10 remotes hidden | 5,000 | 2,500 | 2.6 | 384.73 | 0.23 | 4,296.53 | 6.66 | 150.16 | 1.94 | 514.24 | yjs |
| latency | out-of-order write delivery to remote visible | 5,000 | 250 | 1.98 | 504.27 | 73.83 | 13.55 | n/a | n/a | 18.53 | 53.97 | crlist |
| latency | out-of-order delete delivery to remote convergence | 5,000 | 250 | 1.11 | 900.38 | 0.01 | 100,688.71 | 0.01 | 148,844.96 | 0.17 | 6,022.78 | json-joy |
| latency | out-of-order append delivery to convergence | 5,000 | 250 | 2.1 | 476.46 | 21.89 | 45.68 | n/a | n/a | 16.18 | 61.81 | crlist |
| latency | out-of-order prepend delivery to convergence | 5,000 | 250 | 1.76 | 568.38 | 22.41 | 44.63 | 0.1 | 9,584.42 | 16.09 | 62.16 | json-joy |
| latency | out-of-order middle insert delivery to convergence | 5,000 | 250 | 1.88 | 532.47 | 73.67 | 13.57 | n/a | n/a | 15.28 | 65.43 | crlist |
| latency | out-of-order overwrite delivery to convergence | 5,000 | 129 | 2.4 | 416.67 | n/a | n/a | 238.97 | 4.18 | 76.94 | 13 | crlist |
| latency | offline burst 1,000 ops then sync | 5,000 | 1,000 | 0.64 | 1,565.3 | 0.03 | 35,781.38 | 0.01 | 83,633.02 | 3.26 | 306.59 | json-joy |
| latency | forked replicas mixed ops then converge | 5,000 | 500 | 0.38 | 2,603.54 | 0.01 | 87,836.41 | n/a | n/a | 3.31 | 302.26 | yjs |
| latency | duplicate shuffled gossip to convergence | 5,000 | 500 | 0.51 | 1,973.49 | 0.21 | 4,874.22 | n/a | n/a | 0.39 | 2,585.7 | yjs |
| latency | remote snapshot hydrate then apply pending deltas | 5,000 | 250 | 0.04 | 27,423.71 | 0.04 | 23,640.44 | 0.07 | 14,483.85 | 0.75 | 1,336.38 | crlist |
| workload | local app session | 5,000 | 250 | 0.01 | 69,871.44 | 0.01 | 69,376.99 | 0.01 | 134,466.44 | 1.25 | 802.91 | json-joy |
| workload | read heavy session | 5,000 | 250 | 0 | 1,671,122.99 | 0 | 4,734,848.48 | 0 | 206,696.98 | 0 | 1,483,679.53 | yjs |
| workload | write heavy session | 5,000 | 250 | 0.02 | 64,150.27 | 0.01 | 73,551.04 | 0.01 | 138,827.19 | 1.22 | 819.89 | json-joy |
| workload | append tail heavy session | 5,000 | 250 | 0.01 | 109,003.71 | 0.02 | 57,195.15 | 0.01 | 150,141.13 | 1.57 | 636.11 | json-joy |
| workload | prepend head heavy session | 5,000 | 250 | 0.02 | 51,263.12 | 0.01 | 91,270.86 | 0.01 | 147,806.55 | 1.69 | 593.45 | json-joy |
| workload | insert middle heavy session | 5,000 | 250 | 0.02 | 54,945.05 | 0.01 | 82,674.69 | 0.01 | 167,661.46 | 1.68 | 595.7 | json-joy |
| workload | overwrite heavy session | 5,000 | 250 | 0.03 | 38,561.2 | 0.01 | 81,221.57 | 0.01 | 147,911.49 | 1.31 | 764.23 | json-joy |
| workload | delete heavy session | 5,000 | 250 | 0.01 | 79,226.75 | 0.01 | 99,174.87 | 0 | 233,907.19 | 0.2 | 4,954.31 | json-joy |
| workload | balanced append prepend insert overwrite delete session | 5,000 | 250 | 0.03 | 38,897.79 | 0.01 | 75,503.61 | 0.01 | 160,658.06 | 1.48 | 673.6 | json-joy |
| workload | random edit session | 5,000 | 250 | 0.04 | 24,349.62 | 0.02 | 44,214.92 | 0.06 | 15,961.49 | 1.37 | 731.63 | yjs |
| workload | text editing session | 5,000 | 250 | 0.02 | 66,311.24 | 0.01 | 84,280.08 | 0.04 | 26,628.61 | 1.61 | 622.31 | yjs |
| workload | collaborative offline session | 5,000 | 500 | 0.43 | 2,307.02 | 0.01 | 108,761.86 | n/a | n/a | 3.28 | 304.44 | yjs |
| workload | sync and cleanup session | 5,000 | 252 | 0.21 | 4,689.65 | 0.01 | 114,411.24 | n/a | n/a | 3.32 | 301.58 | yjs |
| workload | long lived tombstoned session | 5,000 | 250 | 0.01 | 105,117.1 | 0.01 | 79,148.99 | 0.01 | 158,217.83 | 1.79 | 558.4 | json-joy |
| workload | sparse visible session | 5,000 | 250 | 0.01 | 104,436.46 | 0.13 | 7,605.26 | 0.01 | 74,638.01 | 1.13 | 883.2 | crlist |
| workload | post-gc edit session | 5,000 | 250 | 0.01 | 91,111.19 | 0.03 | 39,102.82 | 0.05 | 20,841.32 | 1.54 | 650.73 | crlist |

## License

Apache-2.0
