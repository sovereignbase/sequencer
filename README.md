[![npm version](https://img.shields.io/npm/v/@sovereignbase/convergent-replicated-list)](https://www.npmjs.com/package/@sovereignbase/convergent-replicated-list)
[![CI](https://github.com/sovereignbase/convergent-replicated-list/actions/workflows/ci.yaml/badge.svg?branch=master)](https://github.com/sovereignbase/convergent-replicated-list/actions/workflows/ci.yaml)
[![codecov](https://codecov.io/gh/sovereignbase/convergent-replicated-list/branch/master/graph/badge.svg)](https://codecov.io/gh/sovereignbase/convergent-replicated-list)
[![license](https://img.shields.io/npm/l/@sovereignbase/convergent-replicated-list)](LICENSE)

# convergent-replicated-list

Convergent Replicated List (CR-List), a delta CRDT for an ordered sequence of entries.

- [Check the docs](https://sovereignbase.dev/convergent-replicated-list/docs/)
- [Read the specification](https://sovereignbase.dev/convergent-replicated-list/)

## Compatibility

- Runtimes: modern browsers,Node, Bun, Deno, Cloudflare Workers, Edge Runtime.
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

Current test results:

- Total: 161/161 passing.
- Groups: 13.

| group | result |
| --- | --- |
| `unit/public-api` | 14/14 passing |
| `unit/local-mutations` | 14/14 passing |
| `unit/live-projection` | 10/10 passing |
| `unit/merge` | 20/20 passing |
| `unit/ordering` | 14/14 passing |
| `unit/tombstones` | 14/14 passing |
| `unit/snapshots` | 12/12 passing |
| `unit/acknowledgement-gc` | 12/12 passing |
| `unit/malformed-ingress` | 15/15 passing |
| `unit/structural` | 13/13 passing |
| `integration/convergence` | 14/14 passing |
| `stress` | 5/5 passing |
| `runtime/compatibility` | 4/4 passing |

## Benchmarks

```sh
npm run bench
```

Last measured on Node `v24.16.0` (`linux x64`):
| group | scenario | n | ops | crlist ms/op | crlist ops/sec | yjs ms/op | yjs ops/sec | json-joy ms/op | json-joy ops/sec | automerge ms/op | automerge ops/sec | winner |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| crud | create / empty list | 5,000 | 250 | 0.01 | 71,061.06 | 0.11 | 9,197.32 | 0.02 | 56,814.91 | 0.34 | 2,939.26 | crlist |
| crud | create / hydrate snapshot | 5,000 | 250 | 3.83 | 260.93 | 5.72 | 174.84 | 12.85 | 77.8 | 132.28 | 7.56 | crlist |
| crud | create / hydrate clean snapshot | 5,000 | 250 | 3.74 | 267.54 | 5.68 | 176.1 | 12.52 | 79.88 | 131.09 | 7.63 | crlist |
| crud | create / hydrate tombstoned snapshot | 5,000 | 250 | 1.72 | 582.2 | 2.88 | 347.03 | 6.29 | 159.04 | 115.11 | 8.69 | crlist |
| crud | read / head | 5,000 | 250 | 0 | 2,584,754.09 | 0 | 1,492,056.29 | 0 | 310,590.64 | 0 | 3,941,476.95 | automerge |
| crud | read / middle | 5,000 | 250 | 0 | 7,541,023.17 | 0 | 950,812.56 | 0 | 428,079.26 | 0 | 8,578,094.98 | automerge |
| crud | read / tail | 5,000 | 250 | 0 | 2,365,005.49 | 0 | 1,962,338.79 | 0 | 471,517.51 | 0 | 3,224,724.61 | automerge |
| crud | read / random indexed reads | 5,000 | 250 | 0 | 1,565,248.97 | 0 | 701,344.9 | 0 | 280,779.94 | 0 | 1,149,335.45 | crlist |
| crud | read / sequential indexed reads from head | 5,000 | 250 | 0 | 2,193,886.95 | 0 | 2,858,318.85 | 0 | 344,025.18 | 0 | 1,319,442.25 | yjs |
| crud | read / sequential indexed reads from middle | 5,000 | 250 | 0 | 10,910,836.64 | 0 | 7,378,113.56 | 0 | 693,104.44 | 0 | 11,882,129.28 | automerge |
| crud | read / sequential indexed reads from tail | 5,000 | 250 | 0 | 9,724,599.35 | 0 | 4,986,635.82 | 0 | 736,691.67 | 0 | 13,643,309.32 | automerge |
| crud | read / full iteration visible values | 5,000 | 250 | 0.35 | 2,845.48 | 0.14 | 6,909.11 | 1.06 | 942.21 | 0.05 | 19,345.26 | automerge |
| crud | read / collect visible values to array | 5,000 | 250 | 0.35 | 2,836.34 | 0.13 | 7,601.52 | 0.96 | 1,038.35 | 0.08 | 12,483.93 | automerge |
| crud | read / visible sparse over deleted entries | 5,000 | 250 | 0 | 8,385,041.09 | 0.02 | 41,329.62 | 0.02 | 47,305.69 | 0 | 3,521,970.05 | crlist |
| crud | find / head | 5,000 | 250 | 0 | 1,254,434.43 | 0 | 1,796,880.62 | 0 | 876,074.07 | 0 | 1,334,607.44 | yjs |
| crud | find / middle | 5,000 | 250 | 0.03 | 28,833.8 | 0.07 | 14,869.86 | 0.54 | 1,855.04 | 0.02 | 48,378.02 | automerge |
| crud | find / tail | 5,000 | 250 | 0.03 | 32,571.82 | 0.12 | 8,161.77 | 0.94 | 1,061.72 | 0.04 | 22,541.94 | crlist |
| crud | find / missing value | 5,000 | 250 | 0.14 | 7,115.93 | 0.27 | 3,677.04 | 1.88 | 532.98 | 0.05 | 19,344.77 | automerge |
| crud | append / single after tail | 5,000 | 250 | 0 | 295,909.82 | 0.02 | 48,772.95 | 0.01 | 107,037.78 | 1.49 | 673.3 | crlist |
| crud | append / batch after tail | 5,000 | 25,000 | 0 | 1,958,014.68 | 0 | 659,609.2 | 0.01 | 148,289 | 0.14 | 7,079.55 | crlist |
| crud | append / batch after deleted tail | 5,000 | 25,000 | 0 | 1,881,924.73 | 0 | 652,354.68 | 0.01 | 192,968.28 | 0.14 | 7,062.96 | crlist |
| crud | append / batch after garbage collection | 5,000 | 25,000 | 0 | 1,592,124.36 | 0 | 812,925.83 | 0 | 209,909.71 | 0.14 | 7,071.83 | crlist |
| crud | prepend / single before head | 5,000 | 250 | 0 | 239,214.31 | 0.01 | 83,902.44 | 0.01 | 117,396.36 | 1.55 | 647.09 | crlist |
| crud | prepend / batch before head | 5,000 | 25,000 | 0 | 1,436,238.23 | 0 | 1,134,727.67 | 0 | 210,433.15 | 0.14 | 7,143.96 | crlist |
| crud | prepend / batch before deleted head | 5,000 | 25,000 | 0 | 1,543,235.31 | 0 | 793,698.21 | 0 | 221,507.52 | 0.14 | 7,123.09 | crlist |
| crud | prepend / batch after garbage collection | 5,000 | 25,000 | 0 | 2,014,191.51 | 0 | 1,139,914.52 | 0 | 226,690.29 | 0.14 | 7,375.87 | crlist |
| crud | insert / single before head | 5,000 | 250 | 0 | 465,466.14 | 0.01 | 98,071.71 | 0.01 | 198,056.82 | 1.54 | 650.38 | crlist |
| crud | insert / single after head | 5,000 | 250 | 0 | 237,986.9 | 0.01 | 83,899.06 | 0.01 | 118,977.08 | 1.53 | 652.12 | crlist |
| crud | insert / single before middle | 5,000 | 250 | 0 | 256,019.27 | 0.01 | 67,920.87 | 0.01 | 184,719.28 | 1.49 | 671.64 | crlist |
| crud | insert / single after middle | 5,000 | 250 | 0 | 237,111.79 | 0.01 | 91,941.75 | 0.01 | 121,023.3 | 1.49 | 671.67 | crlist |
| crud | insert / single before tail | 5,000 | 250 | 0 | 258,114.07 | 0.01 | 94,832.86 | 0 | 237,448.02 | 1.47 | 679.33 | crlist |
| crud | insert / single after tail | 5,000 | 250 | 0 | 500,354.25 | 0.01 | 71,193.09 | 0 | 291,413.67 | 1.44 | 693.06 | crlist |
| crud | insert / batch before head | 5,000 | 25,000 | 0 | 1,986,410.88 | 0 | 1,349,315.42 | 0 | 273,490.45 | 0.14 | 7,174.18 | crlist |
| crud | insert / batch after head | 5,000 | 25,000 | 0 | 1,922,493.37 | 0 | 939,944.71 | 0 | 277,534.48 | 0.14 | 7,198.11 | crlist |
| crud | insert / batch before middle | 5,000 | 25,000 | 0 | 1,198,252.39 | 0 | 930,899.27 | 0 | 338,654.09 | 0.14 | 7,015.45 | crlist |
| crud | insert / batch after middle | 5,000 | 25,000 | 0 | 1,392,469.24 | 0 | 1,027,066.36 | 0 | 268,902.32 | 0.14 | 7,038.09 | crlist |
| crud | insert / batch before tail | 5,000 | 25,000 | 0 | 1,188,399.21 | 0 | 764,493.45 | 0 | 280,648.24 | 0.14 | 7,023.15 | crlist |
| crud | insert / batch after tail | 5,000 | 25,000 | 0 | 2,056,650.35 | 0 | 726,634.71 | 0.01 | 199,314.15 | 0.14 | 7,050.79 | crlist |
| crud | insert / repeated before head | 5,000 | 250 | 0 | 431,276.15 | 0.01 | 136,450.07 | 0 | 206,955.01 | 1.53 | 652.86 | crlist |
| crud | insert / repeated before middle | 5,000 | 250 | 0 | 384,925.1 | 0.01 | 111,404.08 | 0 | 218,747.35 | 1.53 | 654.25 | crlist |
| crud | insert / repeated before tail | 5,000 | 250 | 0 | 334,219.68 | 0.01 | 118,951.49 | 0 | 261,799.84 | 1.48 | 676.64 | crlist |
| crud | insert / random positions | 5,000 | 250 | 0 | 318,304.68 | 0.05 | 21,584.86 | 0.02 | 65,033.54 | 1.5 | 668.86 | crlist |
| crud | insert / alternating head and tail | 5,000 | 250 | 0 | 507,260.93 | 0.01 | 132,503.4 | 0.01 | 111,980.03 | 1.54 | 647.59 | crlist |
| crud | overwrite / head | 5,000 | 250 | 0.01 | 153,945.44 | 0.02 | 65,279.21 | 0.02 | 61,990.85 | 1.64 | 610.57 | crlist |
| crud | overwrite / middle | 5,000 | 250 | 0 | 244,900.68 | 0.02 | 49,848.01 | 0.01 | 136,881.3 | 1.6 | 624.12 | crlist |
| crud | overwrite / tail | 5,000 | 250 | 0 | 298,905.05 | 0.01 | 72,700.18 | 0.01 | 154,358.72 | 1.51 | 660.37 | crlist |
| crud | overwrite / random | 5,000 | 250 | 0.01 | 85,803.71 | 0.04 | 27,314.87 | 0.01 | 133,281.94 | 1.73 | 579.62 | json-joy |
| crud | overwrite / same head repeatedly | 5,000 | 250 | 0 | 353,824.99 | 0.01 | 83,482.8 | 0 | 214,140.83 | 1.63 | 613.24 | crlist |
| crud | overwrite / same middle repeatedly | 5,000 | 250 | 0.01 | 189,563.4 | 0.01 | 77,335.6 | 0 | 211,794.23 | 1.59 | 630.4 | json-joy |
| crud | overwrite / same tail repeatedly | 5,000 | 250 | 0 | 583,726.18 | 0.01 | 78,391.68 | 0 | 213,071.15 | 1.52 | 658.5 | crlist |
| crud | overwrite / random visible entries | 5,000 | 250 | 0.01 | 106,993.71 | 0.02 | 44,149.35 | 0.01 | 160,684.49 | 1.72 | 582.19 | json-joy |
| crud | overwrite / after insert | 5,000 | 250 | 0 | 371,814.11 | 0.02 | 52,424.28 | 0.01 | 188,338.67 | 1.58 | 634.33 | crlist |
| crud | overwrite / after delete | 5,000 | 250 | 0.01 | 197,118.13 | 0.01 | 86,600.87 | 0.01 | 191,580.72 | 1.56 | 642.15 | crlist |
| crud | delete / head | 5,000 | 250 | 0 | 235,291.9 | 0.01 | 85,517.89 | 0.01 | 89,228.77 | 0.19 | 5,265.95 | crlist |
| crud | delete / middle | 5,000 | 250 | 0 | 296,261.18 | 0.01 | 101,476.48 | 0.06 | 16,290.76 | 0.19 | 5,163.55 | crlist |
| crud | delete / tail | 5,000 | 250 | 0 | 615,080.29 | 0.01 | 72,138.58 | 0 | 248,072.97 | 0.19 | 5,220.45 | crlist |
| crud | delete / range from head | 5,000 | 5,000 | 0 | 1,933,365.4 | 0 | 5,105,140.37 | 0 | 818,119.45 | 0.01 | 81,458.87 | yjs |
| crud | delete / range from middle | 5,000 | 5,000 | 0 | 1,306,927.82 | 0 | 8,680,118.54 | 0 | 641,543.23 | 0.01 | 74,557.73 | yjs |
| crud | delete / range from tail | 5,000 | 5,000 | 0 | 1,472,076.76 | 0 | 6,215,457.59 | 0 | 868,918.89 | 0.01 | 76,633.75 | yjs |
| crud | delete / every other entry | 5,000 | 2,500 | 0.01 | 177,735.24 | 0.07 | 15,307.68 | 0.07 | 13,932.65 | 0.18 | 5,477.68 | crlist |
| crud | delete / all entries from head one by one | 5,000 | 5,000 | 0 | 277,148.47 | 0.01 | 117,236.3 | 0.01 | 94,712.11 | 0.17 | 5,825.3 | crlist |
| crud | delete / all entries from middle outward | 5,000 | 5,000 | 0 | 274,664.8 | 0.01 | 144,281.28 | 0 | 224,066.81 | 0.17 | 5,786.53 | crlist |
| crud | delete / all entries from tail one by one | 5,000 | 5,000 | 0 | 970,883.97 | 0.01 | 136,152.95 | 0 | 389,448.59 | 0.17 | 5,915.28 | crlist |
| crud | delete / all entries in random order | 5,000 | 5,000 | 0.11 | 9,013.73 | 9.92 | 100.76 | 6 | 166.58 | 0.2 | 5,127.83 | crlist |
| crud | delete / already deleted head | 5,000 | 250 | 0 | 323,240.05 | 0 | 308,471.36 | 0 | 336,332.98 | 0.03 | 29,699.01 | json-joy |
| crud | delete / already deleted middle | 5,000 | 250 | 0 | 324,008.37 | 0 | 224,599.18 | 0 | 1,177,928.45 | 0.02 | 59,368.26 | json-joy |
| crud | delete / already deleted tail | 5,000 | 250 | 0 | 1,091,231.3 | 0 | 255,835.61 | 0 | 1,119,078.95 | 0.02 | 48,656.69 | json-joy |
| crud | mixed / append overwrite delete tail | 5,000 | 250 | 0 | 219,977.67 | 0.02 | 62,422.72 | 0.01 | 111,364.92 | 1.28 | 779.36 | crlist |
| crud | mixed / prepend overwrite delete head | 5,000 | 250 | 0.01 | 197,222.32 | 0.02 | 65,197 | 0.08 | 12,759.81 | 1.33 | 752.52 | crlist |
| crud | mixed / insert overwrite delete middle | 5,000 | 250 | 0 | 207,948.28 | 0.01 | 80,272.72 | 0.01 | 166,001.55 | 1.3 | 771.12 | crlist |
| crud | mixed / append prepend insert overwrite delete | 5,000 | 250 | 0 | 379,193.5 | 0.01 | 91,017.82 | 0 | 208,266.17 | 1.32 | 755.09 | crlist |
| mags | snapshot | 5,000 | 250 | 0.17 | 6,023.72 | 2.76 | 361.93 | 5.04 | 198.36 | 14.33 | 69.8 | crlist |
| mags | snapshot / clean state | 5,000 | 250 | 0.12 | 8,368.5 | 2.65 | 376.77 | 4.93 | 202.95 | 14.28 | 70.01 | crlist |
| mags | snapshot / tombstoned state 50% deleted | 5,000 | 250 | 0.09 | 10,954.87 | 1.32 | 757.44 | 2.36 | 423.58 | 14.36 | 69.63 | crlist |
| mags | snapshot / tombstoned state 90% deleted | 5,000 | 250 | 0.01 | 90,847.18 | 0.27 | 3,718.68 | 0.43 | 2,338.25 | 14.43 | 69.28 | crlist |
| mags | snapshot / after garbage collection | 5,000 | 250 | 0.06 | 15,629.15 | 1.32 | 758.2 | 2.33 | 429.9 | 14.34 | 69.72 | crlist |
| mags | acknowledge | 5,000 | 250 | 0 | 4,043,606.25 | n/a | n/a | n/a | n/a | n/a | n/a | n/a |
| mags | acknowledge / clean state | 5,000 | 250 | 0 | 6,036,022.99 | n/a | n/a | n/a | n/a | n/a | n/a | n/a |
| mags | acknowledge / 50% deleted state | 5,000 | 250 | 0 | 2,239,962.73 | n/a | n/a | n/a | n/a | n/a | n/a | n/a |
| mags | acknowledge / 90% deleted state | 5,000 | 250 | 0 | 3,297,630.98 | n/a | n/a | n/a | n/a | n/a | n/a | n/a |
| mags | garbage collect | 5,000 | 250 | 0 | 2,094,100.5 | n/a | n/a | n/a | n/a | n/a | n/a | n/a |
| mags | garbage collect / no eligible tombstones | 5,000 | 250 | 0 | 5,329,694.93 | n/a | n/a | n/a | n/a | n/a | n/a | n/a |
| mags | garbage collect / 50% eligible tombstones | 5,000 | 250 | 0 | 1,055,457.98 | n/a | n/a | n/a | n/a | n/a | n/a | n/a |
| mags | garbage collect / 90% eligible tombstones | 5,000 | 250 | 0 | 1,171,289.36 | n/a | n/a | n/a | n/a | n/a | n/a | n/a |
| mags | garbage collect / partial frontiers 2 replicas | 5,000 | 250 | 0 | 3,242,331.89 | n/a | n/a | n/a | n/a | n/a | n/a | n/a |
| mags | garbage collect / partial frontiers 10 replicas | 5,000 | 250 | 0 | 11,239,996.4 | n/a | n/a | n/a | n/a | n/a | n/a | n/a |
| mags | post-gc read / full iteration visible values | 5,000 | 250 | 0.18 | 5,424.41 | 0.06 | 16,038.32 | 0.44 | 2,295.55 | 0.02 | 40,772.72 | automerge |
| mags | merge ordered deltas | 5,000 | 250 | 0.01 | 95,635.72 | 0.02 | 51,458.66 | 0 | 311,393 | 2.69 | 371.86 | json-joy |
| mags | merge shuffled gossip | 5,000 | 250 | 0.94 | 1,059.12 | 0.46 | 2,178.8 | n/a | n/a | 0.68 | 1,479.92 | yjs |
| mags | merge / append head delta into equal replica | 5,000 | 1 | 0.03 | 28,575.51 | 0.06 | 17,754.11 | 0.04 | 27,550.49 | 3.19 | 313.87 | crlist |
| mags | merge / append tail delta into equal replica | 5,000 | 1 | 0.09 | 10,563.34 | 0.02 | 40,020.81 | 0.01 | 119,531.44 | 2.84 | 352.53 | json-joy |
| mags | merge / prepend head delta into equal replica | 5,000 | 1 | 0.03 | 30,227.92 | 0.02 | 43,700.56 | 0.01 | 118,962.65 | 2.92 | 342.8 | json-joy |
| mags | merge / insert middle delta into equal replica | 5,000 | 1 | 0.03 | 28,822.6 | 0.02 | 44,559.31 | 0.01 | 74,710.5 | 3.1 | 322.22 | json-joy |
| mags | merge / overwrite head delta into equal replica | 5,000 | 1 | 0.03 | 34,765.68 | 0.02 | 47,573.74 | 0.01 | 106,986.2 | 2.97 | 336.3 | json-joy |
| mags | merge / overwrite middle delta into equal replica | 5,000 | 1 | 0.07 | 15,358.15 | 0.03 | 34,123.87 | 0.01 | 73,120.8 | 2.91 | 343.48 | json-joy |
| mags | merge / overwrite tail delta into equal replica | 5,000 | 1 | 0.02 | 42,151.41 | 0.02 | 41,074.51 | 0.01 | 88,175.65 | 2.97 | 336.92 | json-joy |
| mags | merge / delete head delta into equal replica | 5,000 | 1 | 0.04 | 25,217.5 | 0.01 | 91,149.39 | 0.02 | 62,383.03 | 1.56 | 642.45 | yjs |
| mags | merge / delete middle delta into equal replica | 5,000 | 1 | 0.09 | 11,488.57 | 0.02 | 40,476 | 0.02 | 57,730.05 | 1.58 | 633.82 | json-joy |
| mags | merge / delete tail delta into equal replica | 5,000 | 1 | 0.01 | 69,993.7 | 0.01 | 81,280.99 | 0.01 | 105,853.71 | 1.58 | 634.32 | json-joy |
| mags | merge / duplicate delta ignored | 5,000 | 250 | 0 | 804,992.24 | 0.02 | 47,255.92 | 0.01 | 144,839.96 | 0.03 | 30,394.59 | crlist |
| mags | merge / old delta ignored after merge | 5,000 | 250 | 0 | 930,568.43 | 0.01 | 68,304.03 | 0 | 444,505.29 | 0.03 | 39,578.66 | crlist |
| mags | merge / ordered 1,000 append deltas | 5,000 | 1,000 | 0 | 314,036.42 | 0.02 | 59,468.92 | 0 | 335,639.17 | 2.98 | 336.03 | json-joy |
| mags | merge / ordered 1,000 prepend deltas | 5,000 | 1,000 | 0 | 331,818.58 | 0.01 | 98,230.41 | 0.01 | 143,061.91 | 3 | 332.79 | crlist |
| mags | merge / ordered 1,000 middle insert deltas | 5,000 | 1,000 | 0 | 361,859.17 | 0.01 | 107,223.91 | 0.02 | 65,233.1 | 2.99 | 334.26 | crlist |
| mags | merge / shuffled 1,000 mixed deltas | 5,000 | 1,000 | 1 | 1,000.28 | 1.01 | 990.03 | n/a | n/a | 0.83 | 1,208.05 | automerge |
| mags | merge / reverse ordered 1,000 mixed deltas | 5,000 | 1,000 | 0.3 | 3,281.56 | 0.94 | 1,065.03 | n/a | n/a | 0.82 | 1,226.61 | crlist |
| mags | merge / concurrent prepends same head | 5,000 | 2 | 0.07 | 13,949.14 | 0.1 | 10,170.92 | n/a | n/a | 10.78 | 92.81 | crlist |
| mags | merge / concurrent appends same tail | 5,000 | 2 | 0.02 | 49,326.69 | 0.02 | 41,894.47 | n/a | n/a | 13.26 | 75.4 | crlist |
| mags | merge / concurrent inserts same middle position | 5,000 | 2 | 0.08 | 12,559.82 | 0.03 | 32,661.06 | n/a | n/a | 9.5 | 105.31 | yjs |
| mags | merge / concurrent overwrites same head | 5,000 | 2 | 0.02 | 43,386.77 | 0.03 | 37,174.03 | n/a | n/a | 13.5 | 74.09 | crlist |
| mags | merge / concurrent overwrites same middle | 5,000 | 2 | 0.08 | 12,702.85 | 0.03 | 37,348.27 | n/a | n/a | 9.58 | 104.42 | yjs |
| mags | merge / concurrent overwrites same tail | 5,000 | 2 | 0.02 | 49,290.22 | 0.03 | 37,815.05 | n/a | n/a | 13.3 | 75.21 | crlist |
| mags | merge / concurrent deletes same head | 5,000 | 2 | 0.03 | 38,905.96 | 0.02 | 66,209.82 | 0.02 | 47,882.4 | 6.83 | 146.48 | yjs |
| mags | merge / concurrent deletes same middle | 5,000 | 2 | 0.13 | 7,955.42 | 0.02 | 65,687.92 | 0.03 | 32,687.75 | 10.81 | 92.54 | yjs |
| mags | merge / concurrent deletes same tail | 5,000 | 2 | 0.01 | 77,827.07 | 0.01 | 67,123.1 | 0.01 | 72,537.36 | 4.95 | 201.84 | crlist |
| mags | merge / concurrent overwrite delete same entry | 5,000 | 2 | 0.14 | 7,264.64 | 0.07 | 14,845.39 | 0.06 | 16,472.16 | 8.21 | 121.84 | json-joy |
| mags | merge / forked replicas rejoin after 250 ops each | 5,000 | 500 | 0 | 200,769.75 | 0.01 | 89,425.25 | n/a | n/a | 2.78 | 360.3 | crlist |
| mags | merge / 10 replicas gossip convergence | 5,000 | 100 | 0 | 235,041.38 | 0.01 | 109,584.36 | n/a | n/a | 5.89 | 169.9 | crlist |
| mags | merge / snapshot merge into stale replica | 5,000 | 5,350 | 0 | 1,096,471.45 | 0 | 664,479.8 | 0.01 | 114,336.3 | 0.03 | 36,546.4 | crlist |
| class | constructor / hydrate snapshot | 5,000 | 250 | 3.68 | 271.98 | 5.6 | 178.44 | 12.62 | 79.25 | 136.2 | 7.34 | crlist |
| class | read / head | 5,000 | 250 | 0 | 3,252,878.8 | 0 | 4,163,058.68 | 0 | 1,952,819.87 | 0 | 3,584,743.33 | yjs |
| class | read / middle | 5,000 | 250 | 0 | 9,812,387.16 | 0 | 10,009,208.47 | 0 | 3,989,977.18 | 0 | 10,877,605.19 | automerge |
| class | read / tail | 5,000 | 250 | 0 | 2,337,103.86 | 0 | 2,733,076.79 | 0 | 2,277,178.12 | 0 | 4,205,851.18 | automerge |
| class | find near head | 5,000 | 250 | 0 | 1,241,267.68 | n/a | n/a | n/a | n/a | 0 | 1,663,218.26 | automerge |
| class | find near middle | 5,000 | 250 | 0.03 | 37,761.27 | n/a | n/a | n/a | n/a | 0.02 | 47,385.41 | automerge |
| class | find near tail | 5,000 | 250 | 0.06 | 17,923.58 | n/a | n/a | n/a | n/a | 0.04 | 23,705.17 | automerge |
| class | some near head | 5,000 | 250 | 0 | 1,460,698.45 | n/a | n/a | n/a | n/a | 0 | 1,303,311.98 | crlist |
| class | some near middle | 5,000 | 250 | 0.02 | 42,219.17 | n/a | n/a | n/a | n/a | 0.02 | 48,708.94 | automerge |
| class | some near tail | 5,000 | 250 | 0.05 | 21,365.28 | n/a | n/a | n/a | n/a | 0.04 | 24,849.87 | automerge |
| class | some missing value | 5,000 | 250 | 0.06 | 16,392.86 | n/a | n/a | n/a | n/a | 0.05 | 21,870.68 | automerge |
| class | iterate visible values | 5,000 | 250 | 0.08 | 11,982.86 | 0.15 | 6,819.38 | 1 | 1,003.56 | 0.06 | 17,177.6 | automerge |
| class | collect visible values to array | 5,000 | 250 | 0.05 | 18,831.84 | 0.14 | 6,929.95 | 0.92 | 1,090.55 | 0.06 | 16,984.62 | crlist |
| class | append / single after tail | 5,000 | 250 | 0 | 331,423.01 | 0.01 | 74,693.33 | 0 | 206,619.08 | 1.53 | 654.73 | crlist |
| class | append / batch after tail | 5,000 | 25,000 | 0 | 2,008,298.93 | 0 | 699,681.56 | 0.01 | 179,802.95 | 0.15 | 6,761.02 | crlist |
| class | prepend / single before head | 5,000 | 250 | 0 | 256,390.01 | 0.01 | 129,624.21 | 0.01 | 89,606.22 | 1.61 | 622.22 | crlist |
| class | prepend / batch before head | 5,000 | 25,000 | 0 | 990,808.08 | 0 | 1,297,736.59 | 0 | 265,538.45 | 0.15 | 6,843.63 | yjs |
| class | insert / single before middle | 5,000 | 250 | 0 | 272,396.73 | 0.01 | 100,765.94 | 0 | 244,507.39 | 1.57 | 637.03 | crlist |
| class | insert / batch before middle | 5,000 | 25,000 | 0 | 1,567,421.21 | 0 | 1,272,825.19 | 0 | 269,731.44 | 0.15 | 6,796.19 | crlist |
| class | overwrite / head | 5,000 | 250 | 0 | 241,322.06 | 0.01 | 83,760.23 | 0.01 | 159,952.09 | 1.71 | 585.97 | crlist |
| class | overwrite / middle | 5,000 | 250 | 0 | 304,310.62 | 0.01 | 84,213.33 | 0 | 202,172.79 | 1.64 | 611.6 | crlist |
| class | overwrite / tail | 5,000 | 250 | 0 | 262,858.79 | 0.01 | 68,322.94 | 0.01 | 194,353.03 | 1.62 | 618.78 | crlist |
| class | overwrite / random | 5,000 | 250 | 0.01 | 111,421.46 | 0.05 | 18,847.74 | 0.01 | 112,890.41 | 1.77 | 564.57 | json-joy |
| class | remove / head | 5,000 | 250 | 0 | 248,718.35 | 0.01 | 98,329.89 | 0.01 | 90,082.72 | 0.21 | 4,827.44 | crlist |
| class | remove / middle | 5,000 | 250 | 0 | 327,934.22 | 0.01 | 114,035.7 | 0.01 | 148,822.37 | 0.21 | 4,839.62 | crlist |
| class | remove / tail | 5,000 | 250 | 0 | 395,047.68 | 0.01 | 96,603.16 | 0 | 388,189.11 | 0.23 | 4,402.53 | crlist |
| class | remove / range from head | 5,000 | 5,000 | 0 | 2,092,079.97 | 0 | 11,330,237.91 | 0 | 726,345.01 | 0.01 | 83,349.58 | yjs |
| class | remove / range from middle | 5,000 | 5,000 | 0 | 1,467,548.68 | 0 | 9,672,339.82 | 0 | 768,960.1 | 0.01 | 73,339.37 | yjs |
| class | remove / range from tail | 5,000 | 5,000 | 0 | 1,677,045.34 | 0 | 9,670,824.48 | 0 | 841,716.27 | 0.01 | 77,179.19 | yjs |
| class | mixed / append overwrite remove tail | 5,000 | 250 | 0 | 320,257.44 | 0.01 | 75,209.78 | 0.04 | 23,984.06 | 1.11 | 898.27 | crlist |
| class | mixed / prepend overwrite remove head | 5,000 | 250 | 0 | 420,624.75 | 0.01 | 112,006.16 | 0 | 231,962.8 | 1.21 | 828.03 | crlist |
| class | mixed / insert overwrite remove middle | 5,000 | 250 | 0 | 417,249.43 | 0.01 | 106,387.91 | 0 | 263,826.07 | 1.18 | 847.14 | crlist |
| class | paste / insert 10,000 entries at cursor | 5,000 | 10,000 | 0 | 887,803.95 | 0 | 1,400,111.76 | 0.01 | 192,554.77 | 0.14 | 7,336.66 | yjs |
| class | render / join visible entries to string | 5,000 | 250 | 0.15 | 6,722.26 | 0.24 | 4,221.25 | 1.08 | 928.75 | 0.14 | 7,006.02 | automerge |
| class | snapshot | 5,000 | 250 | 0.11 | 8,770.41 | 2.79 | 358.73 | 4.67 | 214.28 | 14.39 | 69.5 | crlist |
| class | snapshot / tombstoned state 50% deleted | 5,000 | 250 | 0.06 | 17,482.43 | 1.38 | 725.59 | 2.25 | 444.07 | 14.54 | 68.78 | crlist |
| class | snapshot / after garbage collection | 5,000 | 250 | 0.07 | 14,100.32 | 0.15 | 6,869.51 | 0.92 | 1,081.28 | 0.06 | 16,107.82 | automerge |
| class | acknowledge | 5,000 | 250 | 0.01 | 110,270.31 | n/a | n/a | n/a | n/a | n/a | n/a | n/a |
| class | acknowledge / 50% deleted state | 5,000 | 250 | 0 | 206,410.62 | n/a | n/a | n/a | n/a | n/a | n/a | n/a |
| class | acknowledge / 90% deleted state | 5,000 | 250 | 0.01 | 144,103.93 | n/a | n/a | n/a | n/a | n/a | n/a | n/a |
| class | garbage collect | 5,000 | 250 | 0.07 | 13,799.36 | 0.15 | 6,801.58 | 0.94 | 1,068.84 | 0.06 | 17,076.9 | automerge |
| class | garbage collect / no eligible tombstones | 5,000 | 250 | 0.07 | 13,733.3 | 0.18 | 5,517.33 | 0.96 | 1,045.44 | 0.06 | 16,354.46 | automerge |
| class | garbage collect / 90% eligible tombstones | 5,000 | 250 | 0.07 | 14,423.92 | 0.18 | 5,506.06 | 0.96 | 1,043.5 | 0.06 | 16,652.34 | automerge |
| class | merge ordered deltas | 5,000 | 250 | 0 | 221,408.42 | 0.01 | 119,375.45 | 0 | 349,651.33 | 2.64 | 379.13 | json-joy |
| class | merge shuffled gossip | 5,000 | 250 | 0.84 | 1,194.22 | 0.31 | 3,243.3 | n/a | n/a | 0.71 | 1,411.45 | yjs |
| class | merge / duplicate delta ignored | 5,000 | 250 | 0 | 564,807.1 | 0.03 | 33,326.22 | 0 | 491,989.43 | 0.03 | 31,618.05 | crlist |
| class | merge / concurrent prepends same head | 5,000 | 2 | 0.05 | 21,028.73 | 0.04 | 23,091.49 | n/a | n/a | 13.57 | 73.68 | yjs |
| class | merge / concurrent appends same tail | 5,000 | 2 | 0.02 | 55,023.66 | 0.02 | 55,839.41 | n/a | n/a | 13.32 | 75.07 | yjs |
| class | merge / concurrent inserts same middle position | 5,000 | 2 | 0.04 | 22,692.46 | 0.02 | 41,536.86 | n/a | n/a | 13.57 | 73.68 | yjs |
| class | merge / forked replicas rejoin after 250 ops each | 5,000 | 500 | 0.01 | 75,173.41 | 0.01 | 139,348.35 | n/a | n/a | 2.75 | 364.09 | yjs |
| latency | append tail write to remote visible | 5,000 | 250 | 0.08 | 12,280.76 | 0.15 | 6,462.41 | 7.63 | 131.12 | 4.73 | 211.3 | crlist |
| latency | prepend head write to remote visible | 5,000 | 250 | 0.01 | 176,787.27 | 0.02 | 54,320.55 | 0.01 | 70,769.16 | 4.75 | 210.39 | crlist |
| latency | middle insert write to remote visible | 5,000 | 250 | 0.04 | 26,403.8 | 0.08 | 11,805.2 | 2.75 | 362.98 | 4.8 | 208.51 | crlist |
| latency | head insert write to remote visible | 5,000 | 250 | 0 | 241,368.66 | 0.02 | 65,679.24 | 0.01 | 86,883.21 | 4.74 | 211.14 | crlist |
| latency | overwrite head write to remote visible | 5,000 | 250 | 0.01 | 125,216.69 | 0.02 | 48,358.69 | 0.01 | 99,865.94 | 4.84 | 206.74 | crlist |
| latency | overwrite middle write to remote visible | 5,000 | 250 | 0.04 | 25,240.87 | 0.08 | 12,138.25 | 1.67 | 599.47 | 4.84 | 206.62 | crlist |
| latency | overwrite tail write to remote visible | 5,000 | 250 | 0.07 | 13,407.66 | 0.15 | 6,873.34 | 3.53 | 283.28 | 4.75 | 210.58 | crlist |
| latency | head delete to remote hidden | 5,000 | 250 | 0.59 | 1,698.6 | 0.31 | 3,191.72 | 6.36 | 157.22 | 1.86 | 538.73 | yjs |
| latency | middle delete to remote hidden | 5,000 | 250 | 0.65 | 1,550.3 | 0.31 | 3,214.61 | 6.7 | 149.26 | 1.83 | 546.64 | yjs |
| latency | tail delete to remote hidden | 5,000 | 250 | 0.24 | 4,248.75 | 0.27 | 3,738.94 | 6.16 | 162.28 | 1.88 | 530.97 | crlist |
| latency | append tail write to 10 remotes visible | 5,000 | 2,500 | 0.06 | 16,031.05 | 0.13 | 7,964.31 | 11.07 | 90.37 | 3.24 | 308.54 | crlist |
| latency | prepend head write to 10 remotes visible | 5,000 | 2,500 | 0 | 235,357.56 | 0.01 | 136,486.31 | 0.01 | 66,698.81 | 3.21 | 311.56 | crlist |
| latency | middle insert write to 10 remotes visible | 5,000 | 2,500 | 0.05 | 20,086.84 | 0.07 | 13,913.16 | 4.13 | 241.95 | 3.28 | 304.47 | crlist |
| latency | overwrite middle write to 10 remotes visible | 5,000 | 2,500 | 0.04 | 25,188.57 | 0.07 | 14,978.67 | 2.94 | 340.3 | 3.26 | 306.74 | crlist |
| latency | delete middle to 10 remotes hidden | 5,000 | 2,500 | 0.78 | 1,286.08 | 0.3 | 3,314.63 | 10.61 | 94.24 | 1.66 | 602.66 | yjs |
| latency | out-of-order write delivery to remote visible | 5,000 | 250 | 1.39 | 717.72 | 81.97 | 12.2 | n/a | n/a | 16.21 | 61.71 | crlist |
| latency | out-of-order delete delivery to remote convergence | 5,000 | 165 | 2.24 | 445.75 | 0.3 | 3,369.08 | 8.55 | 116.91 | 6.62 | 151.12 | yjs |
| latency | out-of-order append delivery to convergence | 5,000 | 250 | 1.18 | 847.76 | 20.89 | 47.88 | n/a | n/a | 16.88 | 59.23 | crlist |
| latency | out-of-order prepend delivery to convergence | 5,000 | 250 | 1.23 | 815.19 | 21.57 | 46.37 | 0.06 | 18,074.15 | 16.38 | 61.05 | json-joy |
| latency | out-of-order middle insert delivery to convergence | 5,000 | 250 | 1.23 | 811.56 | 81.63 | 12.25 | n/a | n/a | 16.32 | 61.29 | crlist |
| latency | out-of-order overwrite delivery to convergence | 5,000 | 129 | 1.64 | 609.78 | n/a | n/a | 260.36 | 3.84 | 75.24 | 13.29 | crlist |
| latency | offline burst 1,000 ops then sync | 5,000 | 1,000 | 0 | 319,398.51 | 0.02 | 56,542.75 | 0 | 317,348.49 | 2.8 | 357.27 | crlist |
| latency | forked replicas mixed ops then converge | 5,000 | 500 | 0 | 389,640.85 | 0.01 | 152,186.48 | n/a | n/a | 2.8 | 356.72 | crlist |
| latency | duplicate shuffled gossip to convergence | 5,000 | 500 | 0.45 | 2,218.87 | 0.15 | 6,546.28 | n/a | n/a | 0.36 | 2,772.07 | yjs |
| latency | remote snapshot hydrate then apply pending deltas | 5,000 | 250 | 0.02 | 53,906.18 | 0.03 | 31,330.62 | 0.03 | 30,534.87 | 0.62 | 1,617.34 | crlist |
| workload | local app session | 5,000 | 250 | 0 | 235,172.16 | 0.01 | 99,386.55 | 0.01 | 169,564.98 | 1.06 | 943.76 | crlist |
| workload | read heavy session | 5,000 | 250 | 0 | 3,018,375.87 | 0 | 4,705,439.49 | 0 | 573,689.23 | 0 | 3,394,064.46 | yjs |
| workload | write heavy session | 5,000 | 250 | 0.01 | 148,161.32 | 0.01 | 85,327.81 | 0.01 | 144,248.11 | 1.07 | 936.58 | crlist |
| workload | append tail heavy session | 5,000 | 250 | 0 | 293,691.28 | 0.02 | 54,437.99 | 0 | 232,434.03 | 1.32 | 756.32 | crlist |
| workload | prepend head heavy session | 5,000 | 250 | 0 | 281,663.8 | 0.01 | 71,003.28 | 0 | 213,238.53 | 1.35 | 738.28 | crlist |
| workload | insert middle heavy session | 5,000 | 250 | 0 | 235,680.74 | 0.01 | 127,816.24 | 0 | 253,844.99 | 1.35 | 739.26 | json-joy |
| workload | overwrite heavy session | 5,000 | 250 | 0 | 305,866.15 | 0.02 | 46,984.67 | 0 | 267,135.97 | 1.1 | 911.38 | crlist |
| workload | delete heavy session | 5,000 | 250 | 0 | 399,378.25 | 0.01 | 126,758.52 | 0 | 371,996.68 | 0.18 | 5,642.23 | crlist |
| workload | balanced append prepend insert overwrite delete session | 5,000 | 250 | 0 | 299,575.92 | 0.01 | 119,841.02 | 0 | 248,424 | 1.19 | 837.09 | crlist |
| workload | random edit session | 5,000 | 250 | 0.01 | 157,105.24 | 0.02 | 64,488.15 | 0.01 | 86,886.17 | 1.05 | 955.29 | crlist |
| workload | text editing session | 5,000 | 250 | 0 | 254,884.35 | 0.01 | 125,608.07 | 0 | 257,879.24 | 1.31 | 760.86 | json-joy |
| workload | collaborative offline session | 5,000 | 500 | 0 | 401,134.41 | 0.01 | 149,823.96 | n/a | n/a | 2.81 | 356.06 | crlist |
| workload | sync and cleanup session | 5,000 | 252 | 0 | 290,103 | 0.01 | 157,911.03 | n/a | n/a | 2.81 | 355.88 | crlist |
| workload | long lived tombstoned session | 5,000 | 250 | 0 | 293,025.52 | 0.01 | 107,354.1 | 0.06 | 16,457.51 | 1.62 | 616.94 | crlist |
| workload | sparse visible session | 5,000 | 250 | 0 | 337,574.62 | 0.11 | 9,443.66 | 0.01 | 95,318.31 | 0.81 | 1,234.93 | crlist |
| workload | post-gc edit session | 5,000 | 250 | 0 | 536,419.68 | 0.01 | 95,249.16 | 0 | 238,046.27 | 1.33 | 749.7 | crlist |

Bundle and byte size (KiB, smaller is better):

| group | scenario | n | crlist KiB | yjs KiB | json-joy KiB | automerge KiB | winner |
| --- | --- | --- | --- | --- | --- | --- | --- |
| bundle-size | raw / core-list | 0 | 61.5 | 230.54 | 439.93 | 3,668.97 | crlist |
| bundle-size | raw / class-list | 0 | 61.37 | 230.54 | 439.93 | 3,668.97 | crlist |
| bundle-size | minified / core-list | 0 | 22.75 | 76.7 | 167.97 | 3,616.34 | crlist |
| bundle-size | minified / class-list | 0 | 25.43 | 76.7 | 167.97 | 3,616.34 | crlist |
| bundle-size | gzip / core-list | 0 | 6.72 | 22.67 | 44.56 | 1,275.2 | crlist |
| bundle-size | gzip / class-list | 0 | 7.41 | 22.67 | 44.56 | 1,275.2 | crlist |
| bundle-size | brotli / core-list | 0 | 6.03 | 20.28 | 38.24 | 901.93 | crlist |
| bundle-size | brotli / class-list | 0 | 6.68 | 20.28 | 38.24 | 901.93 | crlist |
| byte-size | snapshot / empty | 0 | 0.02 | 0 | 0.02 | 0.12 | yjs |
| byte-size | snapshot / clean 100 | 100 | 3.6 | 4.08 | 6.01 | 1.5 | automerge |
| byte-size | snapshot / clean 5,000 | 5,000 | 208.46 | 218.54 | 346.04 | 72.66 | automerge |
| byte-size | snapshot / fragmented 1,000 single appends | 1,000 | 141.71 | 42.75 | 66.92 | 15.86 | automerge |
| byte-size | delta / append single into 100 | 101 | 0.15 | 0.06 | 0.08 | 0.18 | yjs |
| byte-size | delta / prepend single into 100 | 101 | 3.72 | 0.06 | 0.08 | 0.18 | yjs |
| byte-size | delta / middle insert single into 100 | 101 | 2.01 | 0.07 | 0.08 | 0.18 | yjs |
| byte-size | delta / overwrite middle single in 1,000 | 1,000 | 4.27 | 0.08 | 0.09 | 0.19 | yjs |
| byte-size | delta / delete head single from 1,000 | 999 | 7.5 | 0.01 | 0.02 | 0.11 | yjs |

## License

Apache-2.0
