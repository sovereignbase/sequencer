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

- Total: 160/160 passing.
- Groups: 13.

| group | result |
| --- | --- |
| `unit/public-api` | 13/13 passing |
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
| crud | create / empty list | 5,000 | 250 | 0.01 | 79,236.89 | 0.1 | 10,055 | 0.02 | 59,918.03 | 0.35 | 2,844.87 | crlist |
| crud | create / hydrate snapshot | 5,000 | 250 | 3.63 | 275.35 | 5.59 | 178.89 | 13.39 | 74.67 | 127.47 | 7.85 | crlist |
| crud | create / hydrate clean snapshot | 5,000 | 250 | 3.61 | 277.2 | 5.56 | 179.93 | 13.08 | 76.44 | 127 | 7.87 | crlist |
| crud | create / hydrate tombstoned snapshot | 5,000 | 250 | 1.65 | 606.89 | 2.8 | 356.63 | 6.59 | 151.79 | 112.21 | 8.91 | crlist |
| crud | read / head | 5,000 | 250 | 0 | 2,599,455.15 | 0 | 1,162,466.29 | 0 | 369,230.41 | 0 | 3,760,246.67 | automerge |
| crud | read / middle | 5,000 | 250 | 0 | 7,367,025.2 | 0 | 1,571,951.36 | 0 | 394,099.85 | 0 | 9,648,039.52 | automerge |
| crud | read / tail | 5,000 | 250 | 0 | 2,226,913.59 | 0 | 1,182,877.61 | 0 | 519,480.52 | 0 | 3,559,681.62 | automerge |
| crud | read / random indexed reads | 5,000 | 250 | 0 | 1,342,260.26 | 0 | 709,089.1 | 0 | 232,108.6 | 0 | 1,162,531.16 | crlist |
| crud | read / sequential indexed reads from head | 5,000 | 250 | 0 | 2,116,921.83 | 0 | 2,732,300.16 | 0 | 303,160.75 | 0 | 1,265,169.38 | yjs |
| crud | read / sequential indexed reads from middle | 5,000 | 250 | 0 | 9,778,994.72 | 0 | 7,559,721.8 | 0 | 713,777.91 | 0 | 8,877,840.91 | crlist |
| crud | read / sequential indexed reads from tail | 5,000 | 250 | 0 | 9,042,572.43 | 0 | 5,300,203.53 | 0 | 695,601.85 | 0 | 13,224,014.81 | automerge |
| crud | read / full iteration visible values | 5,000 | 250 | 0.35 | 2,844.69 | 0.18 | 5,697.99 | 1.24 | 806.25 | 0.05 | 21,043.2 | automerge |
| crud | read / collect visible values to array | 5,000 | 250 | 0.39 | 2,534.63 | 0.15 | 6,620.99 | 1.12 | 891.06 | 0.08 | 12,479.29 | automerge |
| crud | read / visible sparse over deleted entries | 5,000 | 250 | 0 | 6,213,341.29 | 0.03 | 38,936.13 | 0.02 | 64,208.94 | 0 | 2,852,155.66 | crlist |
| crud | find / head | 5,000 | 250 | 0 | 1,240,873.38 | 0 | 1,575,130.58 | 0 | 956,685.12 | 0 | 1,352,550.37 | yjs |
| crud | find / middle | 5,000 | 250 | 0.02 | 63,423.53 | 0.08 | 13,171.48 | 0.63 | 1,587.41 | 0.02 | 51,004.53 | crlist |
| crud | find / tail | 5,000 | 250 | 0.02 | 42,915.89 | 0.14 | 7,367.58 | 1.08 | 927.68 | 0.04 | 25,160.08 | crlist |
| crud | find / missing value | 5,000 | 250 | 0.16 | 6,090.52 | 0.3 | 3,301.76 | 2.13 | 469.62 | 0.05 | 21,202.98 | automerge |
| crud | append / single after tail | 5,000 | 250 | 0 | 261,174.34 | 0.02 | 49,295.04 | 0.01 | 105,617.9 | 1.49 | 672.21 | crlist |
| crud | append / batch after tail | 5,000 | 25,000 | 0 | 1,856,446.49 | 0 | 659,260.22 | 0 | 204,115.41 | 0.14 | 7,003.78 | crlist |
| crud | append / batch after deleted tail | 5,000 | 25,000 | 0 | 1,579,492.38 | 0 | 735,544.09 | 0.01 | 179,511.61 | 0.14 | 6,961.41 | crlist |
| crud | append / batch after garbage collection | 5,000 | 25,000 | 0 | 1,181,128.74 | 0 | 806,760 | 0 | 234,614.46 | 0.14 | 6,997.29 | crlist |
| crud | prepend / single before head | 5,000 | 250 | 0 | 217,545.29 | 0.01 | 85,626.73 | 0.01 | 112,369.3 | 1.56 | 639.29 | crlist |
| crud | prepend / batch before head | 5,000 | 25,000 | 0 | 1,365,358.83 | 0 | 1,180,466.23 | 0 | 250,950.78 | 0.14 | 7,093.18 | crlist |
| crud | prepend / batch before deleted head | 5,000 | 25,000 | 0 | 2,004,562.06 | 0 | 773,151.55 | 0 | 221,484.85 | 0.14 | 7,061.65 | crlist |
| crud | prepend / batch after garbage collection | 5,000 | 25,000 | 0 | 1,610,956.67 | 0 | 1,119,279.31 | 0 | 265,332.23 | 0.14 | 7,267.87 | crlist |
| crud | insert / single before head | 5,000 | 250 | 0 | 423,611.78 | 0.01 | 79,122.54 | 0.01 | 131,332.6 | 1.57 | 636.56 | crlist |
| crud | insert / single after head | 5,000 | 250 | 0 | 227,056.61 | 0.01 | 69,586.11 | 0.01 | 119,708.52 | 1.58 | 631.26 | crlist |
| crud | insert / single before middle | 5,000 | 250 | 0.01 | 188,107.68 | 0.02 | 59,632.07 | 0.01 | 162,847.35 | 1.55 | 647.22 | crlist |
| crud | insert / single after middle | 5,000 | 250 | 0 | 224,284.85 | 0.01 | 77,329.14 | 0.01 | 144,361.14 | 1.51 | 662.26 | crlist |
| crud | insert / single before tail | 5,000 | 250 | 0.01 | 180,468.93 | 0.01 | 83,609.69 | 0 | 216,580.73 | 1.49 | 670.97 | json-joy |
| crud | insert / single after tail | 5,000 | 250 | 0 | 462,034.62 | 0.02 | 64,827.38 | 0 | 258,299.69 | 1.49 | 670.17 | crlist |
| crud | insert / batch before head | 5,000 | 25,000 | 0 | 1,309,218.3 | 0 | 1,221,629.91 | 0 | 264,824.95 | 0.14 | 6,913.84 | crlist |
| crud | insert / batch after head | 5,000 | 25,000 | 0 | 1,956,566.88 | 0 | 1,128,842.26 | 0 | 259,922.59 | 0.14 | 7,027.54 | crlist |
| crud | insert / batch before middle | 5,000 | 25,000 | 0 | 1,047,334.76 | 0 | 883,324.31 | 0 | 248,842.4 | 0.15 | 6,878.63 | crlist |
| crud | insert / batch after middle | 5,000 | 25,000 | 0 | 1,342,953.39 | 0 | 1,257,160.91 | 0 | 254,416.03 | 0.15 | 6,889.51 | crlist |
| crud | insert / batch before tail | 5,000 | 25,000 | 0 | 1,362,779.32 | 0 | 903,041.55 | 0 | 215,320.26 | 0.14 | 6,918.28 | crlist |
| crud | insert / batch after tail | 5,000 | 25,000 | 0 | 1,299,594.27 | 0 | 722,059.18 | 0.01 | 196,837.1 | 0.14 | 6,899.76 | crlist |
| crud | insert / repeated before head | 5,000 | 250 | 0 | 347,592.5 | 0.01 | 115,262.99 | 0.01 | 188,343.78 | 1.57 | 636.56 | crlist |
| crud | insert / repeated before middle | 5,000 | 250 | 0 | 234,484.84 | 0.01 | 93,946.85 | 0 | 201,367.53 | 1.56 | 639.54 | crlist |
| crud | insert / repeated before tail | 5,000 | 250 | 0 | 309,335.12 | 0.01 | 103,298.32 | 0 | 247,181.39 | 1.44 | 693.52 | crlist |
| crud | insert / random positions | 5,000 | 250 | 0 | 288,654.27 | 0.04 | 22,904.44 | 0.01 | 74,927.31 | 1.52 | 660.01 | crlist |
| crud | insert / alternating head and tail | 5,000 | 250 | 0 | 427,002.26 | 0.02 | 60,495.15 | 0.01 | 192,683.13 | 1.57 | 637.39 | crlist |
| crud | overwrite / head | 5,000 | 250 | 0.01 | 152,760.19 | 0.02 | 52,708.78 | 0.02 | 62,513.52 | 1.69 | 591.75 | crlist |
| crud | overwrite / middle | 5,000 | 250 | 0.01 | 190,955 | 0.02 | 49,464.38 | 0.01 | 134,915.04 | 1.59 | 628.9 | crlist |
| crud | overwrite / tail | 5,000 | 250 | 0 | 272,259.98 | 0.02 | 61,416.78 | 0.01 | 125,117.49 | 1.55 | 643.65 | crlist |
| crud | overwrite / random | 5,000 | 250 | 0.01 | 85,213.48 | 0.04 | 27,683.24 | 0.01 | 118,727.73 | 1.79 | 557.38 | json-joy |
| crud | overwrite / same head repeatedly | 5,000 | 250 | 0 | 352,475.58 | 0.01 | 71,427.22 | 0 | 209,795.61 | 1.61 | 619.79 | crlist |
| crud | overwrite / same middle repeatedly | 5,000 | 250 | 0 | 284,685.51 | 0.01 | 67,807.86 | 0.01 | 189,001.9 | 1.58 | 632.03 | crlist |
| crud | overwrite / same tail repeatedly | 5,000 | 250 | 0 | 457,665.9 | 0.01 | 70,439.8 | 0.01 | 166,340.86 | 1.6 | 625.54 | crlist |
| crud | overwrite / random visible entries | 5,000 | 250 | 0.01 | 108,011.38 | 0.04 | 25,268.67 | 0.01 | 149,429.39 | 1.76 | 567.04 | json-joy |
| crud | overwrite / after insert | 5,000 | 250 | 0 | 350,840.75 | 0.02 | 49,332.91 | 0.01 | 158,558.21 | 1.58 | 632.04 | crlist |
| crud | overwrite / after delete | 5,000 | 250 | 0 | 314,844.01 | 0.02 | 42,785.21 | 0.01 | 185,227.17 | 1.62 | 617.48 | crlist |
| crud | delete / head | 5,000 | 250 | 0 | 220,151.62 | 0.02 | 56,911.46 | 0.07 | 13,338.54 | 0.24 | 4,155.54 | crlist |
| crud | delete / middle | 5,000 | 250 | 0 | 310,297.66 | 0.01 | 81,517.13 | 0.01 | 145,553.37 | 0.24 | 4,109.92 | crlist |
| crud | delete / tail | 5,000 | 250 | 0 | 428,929.03 | 0.02 | 60,756.57 | 0 | 229,456.53 | 0.24 | 4,094.55 | crlist |
| crud | delete / range from head | 5,000 | 5,000 | 0 | 1,573,016.1 | 0 | 5,832,264.08 | 0 | 522,060.39 | 0.01 | 77,121.68 | yjs |
| crud | delete / range from middle | 5,000 | 5,000 | 0 | 1,234,451.16 | 0 | 7,174,280.49 | 0 | 322,639.84 | 0.01 | 70,144.4 | yjs |
| crud | delete / range from tail | 5,000 | 5,000 | 0 | 1,517,476.93 | 0 | 9,798,388.36 | 0 | 790,755.37 | 0.01 | 71,538.9 | yjs |
| crud | delete / every other entry | 5,000 | 2,500 | 0 | 281,661.39 | 0.08 | 12,576.95 | 0.05 | 18,907.61 | 0.23 | 4,353.42 | crlist |
| crud | delete / all entries from head one by one | 5,000 | 5,000 | 0 | 225,954.42 | 0.01 | 100,992.04 | 0.01 | 123,623.34 | 0.21 | 4,795.3 | crlist |
| crud | delete / all entries from middle outward | 5,000 | 5,000 | 0 | 328,274.92 | 0.01 | 122,465.05 | 0 | 310,121.83 | 0.21 | 4,804.16 | crlist |
| crud | delete / all entries from tail one by one | 5,000 | 5,000 | 0 | 557,657.24 | 0.01 | 118,752.5 | 0 | 452,883.58 | 0.22 | 4,572.91 | crlist |
| crud | delete / all entries in random order | 5,000 | 5,000 | 0.1 | 10,244.96 | 9.9 | 101 | 6.43 | 155.5 | 0.25 | 3,951.96 | crlist |
| crud | delete / already deleted head | 5,000 | 250 | 0 | 304,095.56 | 0.01 | 120,576.41 | 0 | 614,166.11 | 0.02 | 53,739.37 | json-joy |
| crud | delete / already deleted middle | 5,000 | 250 | 0 | 366,179.65 | 0 | 228,239.42 | 0 | 1,266,977.5 | 0.02 | 64,174.23 | json-joy |
| crud | delete / already deleted tail | 5,000 | 250 | 0 | 1,203,184.11 | 0 | 231,217.29 | 0 | 637,576.19 | 0.03 | 35,571.74 | crlist |
| crud | mixed / append overwrite delete tail | 5,000 | 250 | 0 | 281,922.99 | 0.02 | 57,933.09 | 0.01 | 112,504.87 | 1.33 | 753.36 | crlist |
| crud | mixed / prepend overwrite delete head | 5,000 | 250 | 0 | 234,856.68 | 0.02 | 65,852.33 | 0.01 | 159,191.87 | 1.4 | 715.15 | crlist |
| crud | mixed / insert overwrite delete middle | 5,000 | 250 | 0 | 203,285.75 | 0.01 | 70,257.44 | 0.01 | 138,846.85 | 1.36 | 736.07 | crlist |
| crud | mixed / append prepend insert overwrite delete | 5,000 | 250 | 0 | 280,430.02 | 0.01 | 83,723.71 | 0 | 209,379.71 | 1.34 | 748.35 | crlist |
| mags | snapshot | 5,000 | 250 | 0.31 | 3,266.16 | 2.71 | 369.62 | 5.45 | 183.33 | 14.02 | 71.34 | crlist |
| mags | snapshot / clean state | 5,000 | 250 | 0.19 | 5,144.39 | 2.59 | 386 | 5.39 | 185.43 | 13.99 | 71.47 | crlist |
| mags | snapshot / tombstoned state 50% deleted | 5,000 | 250 | 0.07 | 14,630.88 | 1.31 | 762.26 | 2.54 | 394.35 | 14.02 | 71.34 | crlist |
| mags | snapshot / tombstoned state 90% deleted | 5,000 | 250 | 0.01 | 85,823.94 | 0.27 | 3,706.25 | 0.46 | 2,164.49 | 14.08 | 71 | crlist |
| mags | snapshot / after garbage collection | 5,000 | 250 | 0.06 | 16,549.2 | 1.3 | 766.83 | 2.55 | 391.53 | 14.06 | 71.12 | crlist |
| mags | acknowledge | 5,000 | 250 | 0 | 2,552,817.8 | n/a | n/a | n/a | n/a | n/a | n/a | n/a |
| mags | acknowledge / clean state | 5,000 | 250 | 0 | 5,113,101.81 | n/a | n/a | n/a | n/a | n/a | n/a | n/a |
| mags | acknowledge / 50% deleted state | 5,000 | 250 | 0 | 1,448,402.12 | n/a | n/a | n/a | n/a | n/a | n/a | n/a |
| mags | acknowledge / 90% deleted state | 5,000 | 250 | 0 | 2,438,786.46 | n/a | n/a | n/a | n/a | n/a | n/a | n/a |
| mags | garbage collect | 5,000 | 250 | 0 | 1,407,134.74 | n/a | n/a | n/a | n/a | n/a | n/a | n/a |
| mags | garbage collect / no eligible tombstones | 5,000 | 250 | 0 | 3,497,873.29 | n/a | n/a | n/a | n/a | n/a | n/a | n/a |
| mags | garbage collect / 50% eligible tombstones | 5,000 | 250 | 0 | 729,532.95 | n/a | n/a | n/a | n/a | n/a | n/a | n/a |
| mags | garbage collect / 90% eligible tombstones | 5,000 | 250 | 0 | 608,499.03 | n/a | n/a | n/a | n/a | n/a | n/a | n/a |
| mags | garbage collect / partial frontiers 2 replicas | 5,000 | 250 | 0 | 3,768,806.34 | n/a | n/a | n/a | n/a | n/a | n/a | n/a |
| mags | garbage collect / partial frontiers 10 replicas | 5,000 | 250 | 0 | 9,256,516.59 | n/a | n/a | n/a | n/a | n/a | n/a | n/a |
| mags | post-gc read / full iteration visible values | 5,000 | 250 | 0.18 | 5,699.91 | 0.07 | 14,736.6 | 0.53 | 1,872.93 | 0.02 | 40,149.01 | automerge |
| mags | merge ordered deltas | 5,000 | 250 | 0.01 | 133,638.03 | 0.02 | 62,426.01 | 0.04 | 28,105.32 | 2.6 | 385.18 | crlist |
| mags | merge shuffled gossip | 5,000 | 250 | 0.95 | 1,052.15 | 0.48 | 2,081.88 | n/a | n/a | 0.66 | 1,504.91 | yjs |
| mags | merge / append head delta into equal replica | 5,000 | 1 | 0.04 | 27,568.72 | 0.06 | 17,083.8 | 0.04 | 27,021.91 | 2.93 | 341.37 | crlist |
| mags | merge / append tail delta into equal replica | 5,000 | 1 | 0.08 | 13,286.74 | 0.03 | 32,279.93 | 0.01 | 96,506.47 | 2.96 | 338.07 | json-joy |
| mags | merge / prepend head delta into equal replica | 5,000 | 1 | 0.03 | 35,501.28 | 0.02 | 40,213.94 | 0.01 | 132,257.64 | 2.99 | 334.46 | json-joy |
| mags | merge / insert middle delta into equal replica | 5,000 | 1 | 0.06 | 17,103.08 | 0.02 | 43,389.6 | 0.01 | 74,454.62 | 2.93 | 341.19 | json-joy |
| mags | merge / overwrite head delta into equal replica | 5,000 | 1 | 0.03 | 33,085.19 | 0.02 | 41,483.45 | 0.01 | 115,287.06 | 3.24 | 308.21 | json-joy |
| mags | merge / overwrite middle delta into equal replica | 5,000 | 1 | 0.09 | 10,719.15 | 0.03 | 38,848.53 | 0.02 | 57,987.82 | 2.88 | 347.53 | json-joy |
| mags | merge / overwrite tail delta into equal replica | 5,000 | 1 | 0.03 | 34,286.5 | 0.03 | 38,934.75 | 0.01 | 106,609.81 | 3.23 | 309.21 | json-joy |
| mags | merge / delete head delta into equal replica | 5,000 | 1 | 0.03 | 34,751.18 | 0.01 | 70,696.36 | 0.02 | 64,147.8 | 1.49 | 673 | yjs |
| mags | merge / delete middle delta into equal replica | 5,000 | 1 | 0.11 | 9,249.67 | 0.04 | 27,251.67 | 0.02 | 51,255.77 | 1.49 | 672.57 | json-joy |
| mags | merge / delete tail delta into equal replica | 5,000 | 1 | 0.02 | 58,482.95 | 0.03 | 39,513.2 | 0.01 | 116,877.05 | 1.67 | 599.86 | json-joy |
| mags | merge / duplicate delta ignored | 5,000 | 250 | 0 | 849,946.96 | 0.03 | 39,997.96 | 0.01 | 104,448.72 | 0.02 | 41,386.72 | crlist |
| mags | merge / old delta ignored after merge | 5,000 | 250 | 0 | 945,554.95 | 0.02 | 57,881.93 | 0 | 451,486.84 | 0.02 | 40,649.11 | crlist |
| mags | merge / ordered 1,000 append deltas | 5,000 | 1,000 | 0 | 315,238.34 | 0.02 | 62,515.92 | 0 | 298,693.54 | 2.89 | 346.52 | crlist |
| mags | merge / ordered 1,000 prepend deltas | 5,000 | 1,000 | 0 | 334,722.77 | 0.01 | 124,307.51 | 0.01 | 124,939.7 | 2.96 | 337.53 | crlist |
| mags | merge / ordered 1,000 middle insert deltas | 5,000 | 1,000 | 0 | 370,719.81 | 0.01 | 142,502.09 | 0 | 329,207.49 | 2.94 | 340.55 | crlist |
| mags | merge / shuffled 1,000 mixed deltas | 5,000 | 1,000 | 1.01 | 989.77 | 1.14 | 877.51 | n/a | n/a | 0.78 | 1,279.77 | automerge |
| mags | merge / reverse ordered 1,000 mixed deltas | 5,000 | 1,000 | 0.28 | 3,555.4 | 1.08 | 929.42 | n/a | n/a | 0.78 | 1,285.97 | crlist |
| mags | merge / concurrent prepends same head | 5,000 | 2 | 0.06 | 15,743.82 | 0.1 | 10,151.15 | n/a | n/a | 10.71 | 93.41 | crlist |
| mags | merge / concurrent appends same tail | 5,000 | 2 | 0.02 | 45,590.28 | 0.03 | 31,788.92 | n/a | n/a | 7.07 | 141.42 | crlist |
| mags | merge / concurrent inserts same middle position | 5,000 | 2 | 0.09 | 11,653.72 | 0.04 | 27,638.82 | n/a | n/a | 8.86 | 112.8 | yjs |
| mags | merge / concurrent overwrites same head | 5,000 | 2 | 0.02 | 41,704.9 | 0.03 | 29,947.74 | n/a | n/a | 12.34 | 81.07 | crlist |
| mags | merge / concurrent overwrites same middle | 5,000 | 2 | 0.1 | 9,876.3 | 0.04 | 28,460.84 | n/a | n/a | 7.36 | 135.86 | yjs |
| mags | merge / concurrent overwrites same tail | 5,000 | 2 | 0.02 | 47,725.86 | 0.04 | 26,146.87 | n/a | n/a | 12.06 | 82.89 | crlist |
| mags | merge / concurrent deletes same head | 5,000 | 2 | 0.02 | 45,210 | 0.02 | 54,415.85 | 0.02 | 51,797.37 | 4.8 | 208.52 | yjs |
| mags | merge / concurrent deletes same middle | 5,000 | 2 | 0.11 | 8,970.98 | 0.02 | 45,138.58 | 0.02 | 60,547.35 | 6.61 | 151.34 | json-joy |
| mags | merge / concurrent deletes same tail | 5,000 | 2 | 0.01 | 91,261.69 | 0.02 | 44,926.66 | 0.02 | 65,960.89 | 6.43 | 155.48 | crlist |
| mags | merge / concurrent overwrite delete same entry | 5,000 | 2 | 0.14 | 7,131.07 | 0.15 | 6,537.57 | 0.06 | 15,962.71 | 10.89 | 91.8 | json-joy |
| mags | merge / forked replicas rejoin after 250 ops each | 5,000 | 500 | 0 | 215,394.5 | 0.01 | 111,772.06 | n/a | n/a | 2.69 | 371.79 | crlist |
| mags | merge / 10 replicas gossip convergence | 5,000 | 100 | 0 | 217,660.07 | 0.01 | 95,603.85 | n/a | n/a | 4.67 | 214.11 | crlist |
| mags | merge / snapshot merge into stale replica | 5,000 | 5,350 | 0 | 1,137,652.07 | 0 | 646,895.21 | 0.01 | 124,669.66 | 0.03 | 38,248.55 | crlist |
| class | constructor / hydrate snapshot | 5,000 | 250 | 3.66 | 272.96 | 5.6 | 178.54 | 13.54 | 73.87 | 130.73 | 7.65 | crlist |
| class | read / head | 5,000 | 250 | 0 | 3,129,224.45 | 0 | 4,111,571.61 | 0 | 1,740,922.83 | 0 | 3,835,120.5 | yjs |
| class | read / middle | 5,000 | 250 | 0 | 6,510,925.33 | 0 | 11,591,246.29 | 0 | 3,972,604.92 | 0 | 11,606,313.83 | automerge |
| class | read / tail | 5,000 | 250 | 0 | 1,537,468.1 | 0 | 3,170,818.32 | 0 | 2,227,131.81 | 0 | 3,987,940.47 | automerge |
| class | find near head | 5,000 | 250 | 0 | 1,091,812.71 | n/a | n/a | n/a | n/a | 0 | 1,675,008.21 | automerge |
| class | find near middle | 5,000 | 250 | 0.02 | 46,527.24 | n/a | n/a | n/a | n/a | 0.02 | 52,331.43 | automerge |
| class | find near tail | 5,000 | 250 | 0.14 | 7,274.24 | n/a | n/a | n/a | n/a | 0.04 | 26,836.18 | automerge |
| class | iterate visible values | 5,000 | 250 | 0.13 | 7,433.25 | 0.13 | 7,827.46 | 1.22 | 816.33 | 0.05 | 18,774.17 | automerge |
| class | collect visible values to array | 5,000 | 250 | 0.12 | 8,234.7 | 0.12 | 8,137.65 | 1.31 | 762.84 | 0.06 | 17,799.01 | automerge |
| class | append / single after tail | 5,000 | 250 | 0 | 326,672.27 | 0.01 | 70,375.59 | 0.01 | 191,620.07 | 1.53 | 652.1 | crlist |
| class | append / batch after tail | 5,000 | 25,000 | 0 | 1,935,846.06 | 0 | 726,454.77 | 0 | 211,699.14 | 0.15 | 6,801.46 | crlist |
| class | prepend / single before head | 5,000 | 250 | 0 | 275,989.06 | 0.01 | 116,746.76 | 0.01 | 186,215.99 | 1.64 | 610.79 | crlist |
| class | prepend / batch before head | 5,000 | 25,000 | 0 | 2,074,858.57 | 0 | 1,302,189.54 | 0 | 265,361.59 | 0.15 | 6,823.09 | crlist |
| class | insert / single before middle | 5,000 | 250 | 0 | 237,389.17 | 0.01 | 102,559.81 | 0 | 226,228.58 | 1.59 | 628.73 | crlist |
| class | insert / batch before middle | 5,000 | 25,000 | 0 | 1,472,981.74 | 0 | 1,310,942.44 | 0.01 | 179,113.7 | 0.15 | 6,748.45 | crlist |
| class | overwrite / head | 5,000 | 250 | 0 | 230,721.38 | 0.01 | 76,863.71 | 0.01 | 167,337.8 | 1.68 | 594.62 | crlist |
| class | overwrite / middle | 5,000 | 250 | 0 | 295,502.34 | 0.01 | 75,962.67 | 0.01 | 183,648.52 | 1.62 | 619.11 | crlist |
| class | overwrite / tail | 5,000 | 250 | 0 | 200,245.42 | 0.01 | 74,804.7 | 0.01 | 161,284.7 | 1.58 | 631.45 | crlist |
| class | overwrite / random | 5,000 | 250 | 0.02 | 61,734.74 | 0.05 | 22,041.39 | 0.01 | 128,443.7 | 1.88 | 532.41 | json-joy |
| class | remove / head | 5,000 | 250 | 0 | 237,785.89 | 0.01 | 79,904.8 | 0.01 | 94,553.38 | 0.26 | 3,798.6 | crlist |
| class | remove / middle | 5,000 | 250 | 0 | 330,298.99 | 0.01 | 107,887.34 | 0.01 | 136,559.19 | 0.24 | 4,186.62 | crlist |
| class | remove / tail | 5,000 | 250 | 0 | 437,073.63 | 0.01 | 97,891.88 | 0 | 354,931.63 | 0.23 | 4,420.56 | crlist |
| class | remove / range from head | 5,000 | 5,000 | 0 | 1,982,273.72 | 0 | 11,054,927.51 | 0 | 775,364.5 | 0.01 | 75,702.86 | yjs |
| class | remove / range from middle | 5,000 | 5,000 | 0 | 1,358,163.83 | 0 | 9,419,069.47 | 0 | 255,508.39 | 0.02 | 65,162.98 | yjs |
| class | remove / range from tail | 5,000 | 5,000 | 0 | 1,428,748.19 | 0 | 10,963,229.33 | 0 | 796,057.79 | 0.01 | 70,234.88 | yjs |
| class | mixed / append overwrite remove tail | 5,000 | 250 | 0 | 286,525.07 | 0.01 | 83,160.5 | 0.01 | 186,463.22 | 1.15 | 866.99 | crlist |
| class | mixed / prepend overwrite remove head | 5,000 | 250 | 0 | 377,681.16 | 0.01 | 106,661.11 | 0.01 | 196,057.67 | 1.22 | 821.86 | crlist |
| class | mixed / insert overwrite remove middle | 5,000 | 250 | 0 | 373,607.75 | 0.01 | 101,721.04 | 0 | 259,015.29 | 1.18 | 846.99 | crlist |
| class | paste / insert 10,000 entries at cursor | 5,000 | 10,000 | 0 | 743,842.56 | 0 | 1,417,050.6 | 0.01 | 173,086.83 | 0.13 | 7,451.2 | yjs |
| class | render / join visible entries to string | 5,000 | 250 | 0.22 | 4,620.57 | 0.2 | 4,917.54 | 1.3 | 770.02 | 0.13 | 7,597.02 | automerge |
| class | snapshot | 5,000 | 250 | 0.14 | 7,303.83 | 2.67 | 374.3 | 5.37 | 186.29 | 13.99 | 71.48 | crlist |
| class | snapshot / tombstoned state 50% deleted | 5,000 | 250 | 0.05 | 19,101.74 | 1.33 | 751.33 | 2.49 | 401 | 14.02 | 71.35 | crlist |
| class | snapshot / after garbage collection | 5,000 | 250 | 0.12 | 8,273.95 | 0.12 | 8,039.77 | 1.13 | 881.44 | 0.06 | 16,389.98 | automerge |
| class | acknowledge | 5,000 | 250 | 0.01 | 154,130.8 | n/a | n/a | n/a | n/a | n/a | n/a | n/a |
| class | acknowledge / 50% deleted state | 5,000 | 250 | 0.01 | 175,814.78 | n/a | n/a | n/a | n/a | n/a | n/a | n/a |
| class | acknowledge / 90% deleted state | 5,000 | 250 | 0.01 | 155,442.48 | n/a | n/a | n/a | n/a | n/a | n/a | n/a |
| class | garbage collect | 5,000 | 250 | 0.13 | 7,956.3 | 0.13 | 7,822.09 | 1.14 | 875.42 | 0.05 | 18,454.79 | automerge |
| class | garbage collect / no eligible tombstones | 5,000 | 250 | 0.11 | 8,723.39 | 0.18 | 5,465.51 | 1.18 | 849.88 | 0.06 | 18,154.71 | automerge |
| class | garbage collect / 90% eligible tombstones | 5,000 | 250 | 0.09 | 10,546.01 | 0.18 | 5,526.58 | 1.17 | 851.87 | 0.06 | 17,757.59 | automerge |
| class | merge ordered deltas | 5,000 | 250 | 0 | 211,088.21 | 0.01 | 107,191.29 | 0 | 291,689.76 | 2.56 | 390.45 | json-joy |
| class | merge shuffled gossip | 5,000 | 250 | 0.89 | 1,119.88 | 0.34 | 2,958.5 | n/a | n/a | 0.64 | 1,565.9 | yjs |
| class | merge / duplicate delta ignored | 5,000 | 250 | 0 | 892,067.03 | 0.03 | 32,931.65 | 0 | 468,105.19 | 0.03 | 35,748.16 | crlist |
| class | merge / concurrent prepends same head | 5,000 | 2 | 0.06 | 16,471.62 | 0.06 | 16,549.58 | n/a | n/a | 9.08 | 110.08 | yjs |
| class | merge / concurrent appends same tail | 5,000 | 2 | 0.02 | 56,524.32 | 0.02 | 49,551.56 | n/a | n/a | 7.26 | 137.68 | crlist |
| class | merge / concurrent inserts same middle position | 5,000 | 2 | 0.08 | 13,076 | 0.03 | 34,151.26 | n/a | n/a | 7.21 | 138.61 | yjs |
| class | merge / forked replicas rejoin after 250 ops each | 5,000 | 500 | 0.02 | 46,468.93 | 0.01 | 129,037.69 | n/a | n/a | 2.64 | 378.56 | yjs |
| latency | append tail write to remote visible | 5,000 | 250 | 0.12 | 8,044.09 | 0.17 | 6,047.08 | 7.47 | 133.85 | 4.65 | 214.92 | crlist |
| latency | prepend head write to remote visible | 5,000 | 250 | 0.01 | 141,811.55 | 0.02 | 51,804.33 | 0.01 | 80,668.79 | 4.69 | 213.18 | crlist |
| latency | middle insert write to remote visible | 5,000 | 250 | 0.04 | 27,771.04 | 0.09 | 10,771.06 | 2.74 | 364.35 | 4.81 | 208.02 | crlist |
| latency | head insert write to remote visible | 5,000 | 250 | 0 | 214,500.77 | 0.02 | 65,541.4 | 0.01 | 88,958.22 | 4.69 | 213.28 | crlist |
| latency | overwrite head write to remote visible | 5,000 | 250 | 0.01 | 128,050.55 | 0.02 | 48,973.55 | 0.01 | 92,198.97 | 4.76 | 210.05 | crlist |
| latency | overwrite middle write to remote visible | 5,000 | 250 | 0.03 | 29,210.32 | 0.09 | 10,877.93 | 1.91 | 524.44 | 4.85 | 206.22 | crlist |
| latency | overwrite tail write to remote visible | 5,000 | 250 | 0.12 | 8,475.99 | 0.15 | 6,551.93 | 3.79 | 264 | 4.67 | 214 | crlist |
| latency | head delete to remote hidden | 5,000 | 250 | 0.61 | 1,638.87 | 0.32 | 3,103.64 | 7.37 | 135.77 | 1.85 | 540.45 | yjs |
| latency | middle delete to remote hidden | 5,000 | 250 | 0.6 | 1,658.14 | 0.32 | 3,103.03 | 7.27 | 137.53 | 1.83 | 547.35 | yjs |
| latency | tail delete to remote hidden | 5,000 | 250 | 0.29 | 3,472.36 | 0.28 | 3,628.59 | 7.13 | 140.17 | 1.87 | 534.59 | yjs |
| latency | append tail write to 10 remotes visible | 5,000 | 2,500 | 0.13 | 7,457.94 | 0.14 | 7,025.45 | 9.35 | 106.9 | 3.23 | 309.53 | crlist |
| latency | prepend head write to 10 remotes visible | 5,000 | 2,500 | 0 | 271,064.94 | 0.01 | 122,524.86 | 0.01 | 71,302.53 | 3.2 | 312.45 | crlist |
| latency | middle insert write to 10 remotes visible | 5,000 | 2,500 | 0.05 | 19,773.31 | 0.08 | 12,013.62 | 3.54 | 282.33 | 3.23 | 309.72 | crlist |
| latency | overwrite middle write to 10 remotes visible | 5,000 | 2,500 | 0.05 | 21,286.65 | 0.08 | 13,216.02 | 2.58 | 388.1 | 3.2 | 312.46 | crlist |
| latency | delete middle to 10 remotes hidden | 5,000 | 2,500 | 0.7 | 1,431.01 | 0.32 | 3,145.43 | 9.85 | 101.48 | 1.72 | 580.93 | yjs |
| latency | out-of-order write delivery to remote visible | 5,000 | 250 | 1.38 | 725.56 | 87 | 11.49 | n/a | n/a | 16.58 | 60.3 | crlist |
| latency | out-of-order delete delivery to remote convergence | 5,000 | 165 | 2.21 | 452.16 | 0.3 | 3,329.09 | 9.23 | 108.37 | 7.41 | 135 | yjs |
| latency | out-of-order append delivery to convergence | 5,000 | 250 | 1.23 | 816.13 | 23.09 | 43.3 | n/a | n/a | 16.77 | 59.64 | crlist |
| latency | out-of-order prepend delivery to convergence | 5,000 | 250 | 1.38 | 725.96 | 23.7 | 42.2 | 0.06 | 17,709.71 | 16.97 | 58.94 | json-joy |
| latency | out-of-order middle insert delivery to convergence | 5,000 | 250 | 1.63 | 612.52 | 86.49 | 11.56 | n/a | n/a | 16.77 | 59.63 | crlist |
| latency | out-of-order overwrite delivery to convergence | 5,000 | 129 | 1.73 | 579.32 | n/a | n/a | 298.94 | 3.35 | 70.33 | 14.22 | crlist |
| latency | offline burst 1,000 ops then sync | 5,000 | 1,000 | 0 | 284,109.55 | 0.02 | 48,546.15 | 0 | 263,734.5 | 2.71 | 368.34 | crlist |
| latency | forked replicas mixed ops then converge | 5,000 | 500 | 0 | 340,663.27 | 0.01 | 138,911.62 | n/a | n/a | 2.72 | 367.51 | crlist |
| latency | duplicate shuffled gossip to convergence | 5,000 | 500 | 0.46 | 2,168.69 | 0.17 | 6,005.71 | n/a | n/a | 0.36 | 2,797.67 | yjs |
| latency | remote snapshot hydrate then apply pending deltas | 5,000 | 250 | 0.02 | 52,502.43 | 0.03 | 30,665.61 | 0.1 | 10,002.38 | 0.61 | 1,651.83 | crlist |
| workload | local app session | 5,000 | 250 | 0.01 | 146,398.99 | 0.01 | 99,044.5 | 0.01 | 176,153.72 | 1.07 | 936.96 | json-joy |
| workload | read heavy session | 5,000 | 250 | 0 | 2,101,211.14 | 0 | 4,952,750.76 | 0 | 441,586.11 | 0 | 2,820,047.15 | yjs |
| workload | write heavy session | 5,000 | 250 | 0.01 | 151,591.87 | 0.01 | 104,292.82 | 0.01 | 160,806.04 | 1.1 | 909.9 | json-joy |
| workload | append tail heavy session | 5,000 | 250 | 0 | 491,169.75 | 0.01 | 79,951.29 | 0 | 212,295.29 | 1.32 | 757.79 | crlist |
| workload | prepend head heavy session | 5,000 | 250 | 0.01 | 171,501.76 | 0.01 | 132,301.45 | 0.01 | 197,061.58 | 1.39 | 720.22 | json-joy |
| workload | insert middle heavy session | 5,000 | 250 | 0.01 | 131,308.59 | 0.01 | 111,964.28 | 0 | 219,127.36 | 1.39 | 717.39 | json-joy |
| workload | overwrite heavy session | 5,000 | 250 | 0.01 | 197,853.21 | 0.02 | 62,730.27 | 0 | 251,793.27 | 1.12 | 895.06 | json-joy |
| workload | delete heavy session | 5,000 | 250 | 0 | 209,891.25 | 0.02 | 61,607.33 | 0 | 360,622.35 | 0.21 | 4,739.86 | json-joy |
| workload | balanced append prepend insert overwrite delete session | 5,000 | 250 | 0.01 | 168,736.96 | 0.01 | 111,198.54 | 0 | 215,365.37 | 1.18 | 846.91 | json-joy |
| workload | random edit session | 5,000 | 250 | 0.01 | 101,992.98 | 0.02 | 64,089.52 | 0.01 | 92,503 | 1.08 | 923.34 | crlist |
| workload | text editing session | 5,000 | 250 | 0.01 | 137,102.44 | 0.01 | 81,916.16 | 0 | 230,375.89 | 1.42 | 706.34 | json-joy |
| workload | collaborative offline session | 5,000 | 500 | 0 | 350,742.8 | 0.01 | 142,591.56 | n/a | n/a | 2.75 | 364.2 | crlist |
| workload | sync and cleanup session | 5,000 | 252 | 0 | 261,829.34 | 0.01 | 147,914.29 | n/a | n/a | 2.72 | 367.37 | crlist |
| workload | long lived tombstoned session | 5,000 | 250 | 0 | 289,047.08 | 0.01 | 87,835.61 | 0 | 207,846.8 | 1.7 | 589.67 | crlist |
| workload | sparse visible session | 5,000 | 250 | 0 | 404,173.66 | 0.12 | 8,193.59 | 0.03 | 31,184.44 | 0.82 | 1,218.43 | crlist |
| workload | post-gc edit session | 5,000 | 250 | 0 | 605,869.67 | 0.01 | 89,179.65 | 0 | 228,068.27 | 1.31 | 765.4 | crlist |

## License

Apache-2.0
