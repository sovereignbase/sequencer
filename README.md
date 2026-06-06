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
| crud | create / empty list | 5,000 | 250 | 0.01 | 73,420.88 | 0.11 | 9,058.78 | 0.02 | 59,229.68 | 0.33 | 3,034.14 | crlist |
| crud | create / hydrate snapshot | 5,000 | 250 | 3.62 | 276.15 | 5.81 | 172.06 | 12.85 | 77.81 | 130.55 | 7.66 | crlist |
| crud | create / hydrate clean snapshot | 5,000 | 250 | 3.6 | 277.96 | 5.79 | 172.67 | 12.51 | 79.93 | 129.79 | 7.7 | crlist |
| crud | create / hydrate tombstoned snapshot | 5,000 | 250 | 1.66 | 602 | 2.94 | 340.3 | 6.1 | 163.84 | 113.97 | 8.77 | crlist |
| crud | read / head | 5,000 | 250 | 0 | 2,488,106.85 | 0 | 1,634,125.78 | 0 | 309,789.73 | 0 | 4,096,077.6 | automerge |
| crud | read / middle | 5,000 | 250 | 0 | 7,909,390.03 | 0 | 900,349.34 | 0 | 572,374.46 | 0 | 8,823,633.22 | automerge |
| crud | read / tail | 5,000 | 250 | 0 | 2,078,224.37 | 0 | 967,364.98 | 0 | 510,197.83 | 0 | 2,964,965.96 | automerge |
| crud | read / random indexed reads | 5,000 | 250 | 0 | 1,484,878 | 0 | 767,153.55 | 0 | 297,970.58 | 0 | 1,039,976.7 | crlist |
| crud | read / sequential indexed reads from head | 5,000 | 250 | 0 | 2,794,295.17 | 0 | 2,935,340.32 | 0 | 345,809.21 | 0 | 1,092,094.11 | yjs |
| crud | read / sequential indexed reads from middle | 5,000 | 250 | 0 | 10,742,061.62 | 0 | 7,324,075.7 | 0 | 645,152.97 | 0 | 11,478,420.57 | automerge |
| crud | read / sequential indexed reads from tail | 5,000 | 250 | 0 | 10,114,905.32 | 0 | 7,771,215.42 | 0 | 842,417.4 | 0 | 14,618,173.31 | automerge |
| crud | read / full iteration visible values | 5,000 | 250 | 0.35 | 2,893.43 | 0.14 | 6,978.57 | 0.92 | 1,084.71 | 0.05 | 19,697.02 | automerge |
| crud | read / collect visible values to array | 5,000 | 250 | 0.35 | 2,822.92 | 0.13 | 7,511.21 | 0.97 | 1,028.62 | 0.08 | 12,775.43 | automerge |
| crud | read / visible sparse over deleted entries | 5,000 | 250 | 0 | 8,365,120.79 | 0.03 | 39,659.2 | 0.02 | 58,312.3 | 0 | 3,354,398.96 | crlist |
| crud | find / head | 5,000 | 250 | 0 | 1,236,161.18 | 0 | 1,800,517.11 | 0 | 844,297.95 | 0 | 1,355,270.65 | yjs |
| crud | find / middle | 5,000 | 250 | 0.02 | 55,177 | 0.07 | 14,363.6 | 0.51 | 1,961.13 | 0.02 | 48,614 | crlist |
| crud | find / tail | 5,000 | 250 | 0.03 | 37,635.14 | 0.12 | 8,241.22 | 0.87 | 1,145.5 | 0.04 | 22,580.86 | crlist |
| crud | find / missing value | 5,000 | 250 | 0.15 | 6,531.27 | 0.26 | 3,842.48 | 1.81 | 552.41 | 0.05 | 19,052.99 | automerge |
| crud | append / single after tail | 5,000 | 250 | 0 | 291,533.29 | 0.02 | 48,147.81 | 0.01 | 105,011.88 | 1.5 | 665.42 | crlist |
| crud | append / batch after tail | 5,000 | 25,000 | 0 | 2,037,050.03 | 0 | 661,935.63 | 0 | 211,166.75 | 0.14 | 7,107.51 | crlist |
| crud | append / batch after deleted tail | 5,000 | 25,000 | 0 | 2,008,402.03 | 0 | 682,087.56 | 0.01 | 159,452.66 | 0.14 | 7,072.07 | crlist |
| crud | append / batch after garbage collection | 5,000 | 25,000 | 0 | 1,686,508.32 | 0 | 797,043.49 | 0.01 | 199,267.74 | 0.14 | 7,079.97 | crlist |
| crud | prepend / single before head | 5,000 | 250 | 0 | 201,774 | 0.01 | 87,754.43 | 0.01 | 104,883.41 | 1.55 | 645.99 | crlist |
| crud | prepend / batch before head | 5,000 | 25,000 | 0 | 1,516,297.38 | 0 | 1,189,397.8 | 0 | 252,813.66 | 0.14 | 7,095.71 | crlist |
| crud | prepend / batch before deleted head | 5,000 | 25,000 | 0 | 1,948,556.09 | 0 | 762,908.91 | 0 | 260,065.1 | 0.14 | 7,080.57 | crlist |
| crud | prepend / batch after garbage collection | 5,000 | 25,000 | 0 | 2,127,478.15 | 0 | 1,105,458.73 | 0 | 259,366.86 | 0.14 | 7,330.54 | crlist |
| crud | insert / single before head | 5,000 | 250 | 0 | 464,971.81 | 0.01 | 85,472.95 | 0 | 200,758.22 | 1.54 | 651.17 | crlist |
| crud | insert / single after head | 5,000 | 250 | 0 | 239,703.99 | 0.02 | 65,321.57 | 0.01 | 120,367.94 | 1.54 | 649.32 | crlist |
| crud | insert / single before middle | 5,000 | 250 | 0 | 242,624.46 | 0.02 | 62,864.93 | 0.01 | 162,889.69 | 1.5 | 668.21 | crlist |
| crud | insert / single after middle | 5,000 | 250 | 0 | 262,433.3 | 0.01 | 75,390.83 | 0.01 | 146,507.1 | 1.49 | 671.11 | crlist |
| crud | insert / single before tail | 5,000 | 250 | 0 | 200,507.69 | 0.01 | 83,296.29 | 0.01 | 92,721.61 | 1.48 | 677.51 | crlist |
| crud | insert / single after tail | 5,000 | 250 | 0 | 502,764.2 | 0.02 | 61,160.34 | 0 | 243,410.63 | 1.45 | 688.83 | crlist |
| crud | insert / batch before head | 5,000 | 25,000 | 0 | 1,591,821.75 | 0 | 1,310,407.15 | 0 | 273,184.18 | 0.14 | 7,126.93 | crlist |
| crud | insert / batch after head | 5,000 | 25,000 | 0 | 2,038,131.48 | 0 | 1,113,275.81 | 0 | 278,384.9 | 0.14 | 7,167.08 | crlist |
| crud | insert / batch before middle | 5,000 | 25,000 | 0 | 1,207,390.35 | 0 | 881,415.74 | 0 | 274,297.73 | 0.14 | 6,996.36 | crlist |
| crud | insert / batch after middle | 5,000 | 25,000 | 0 | 1,398,511.27 | 0 | 1,231,334.14 | 0 | 278,201.26 | 0.14 | 6,997.84 | crlist |
| crud | insert / batch before tail | 5,000 | 25,000 | 0 | 1,900,485.85 | 0 | 746,160.43 | 0 | 294,708.56 | 0.14 | 7,105.6 | crlist |
| crud | insert / batch after tail | 5,000 | 25,000 | 0 | 1,194,438.83 | 0 | 710,375.08 | 0 | 226,817.22 | 0.14 | 7,096.91 | crlist |
| crud | insert / repeated before head | 5,000 | 250 | 0 | 465,605.71 | 0.01 | 120,236.82 | 0.07 | 13,698.72 | 1.54 | 648.38 | crlist |
| crud | insert / repeated before middle | 5,000 | 250 | 0 | 376,788.05 | 0.01 | 96,782.49 | 0 | 228,388.09 | 1.53 | 654.2 | crlist |
| crud | insert / repeated before tail | 5,000 | 250 | 0 | 339,665.61 | 0.01 | 100,769.84 | 0 | 263,080.91 | 1.45 | 690.14 | crlist |
| crud | insert / random positions | 5,000 | 250 | 0 | 332,067.05 | 0.05 | 19,368.85 | 0.02 | 61,367.43 | 1.51 | 661.46 | crlist |
| crud | insert / alternating head and tail | 5,000 | 250 | 0 | 494,984.81 | 0.01 | 82,850.45 | 0.01 | 112,366.01 | 1.54 | 649.49 | crlist |
| crud | overwrite / head | 5,000 | 250 | 0.01 | 156,022.79 | 0.02 | 55,030.83 | 0.01 | 82,963.92 | 1.75 | 571.25 | crlist |
| crud | overwrite / middle | 5,000 | 250 | 0.01 | 175,166.57 | 0.02 | 49,579.04 | 0.01 | 111,291.5 | 1.59 | 628.73 | crlist |
| crud | overwrite / tail | 5,000 | 250 | 0 | 200,449.81 | 0.02 | 58,730.35 | 0.01 | 146,738.85 | 1.53 | 653.75 | crlist |
| crud | overwrite / random | 5,000 | 250 | 0.01 | 101,081.12 | 0.04 | 25,820.6 | 0.01 | 124,199.78 | 1.76 | 566.58 | json-joy |
| crud | overwrite / same head repeatedly | 5,000 | 250 | 0 | 363,988.44 | 0.01 | 72,873.8 | 0 | 211,267.49 | 1.62 | 616.99 | crlist |
| crud | overwrite / same middle repeatedly | 5,000 | 250 | 0 | 295,182.04 | 0.01 | 66,776.82 | 0.01 | 138,402.17 | 1.58 | 634.1 | crlist |
| crud | overwrite / same tail repeatedly | 5,000 | 250 | 0 | 490,018.33 | 0.02 | 58,337.11 | 0 | 208,363.72 | 1.56 | 641.78 | crlist |
| crud | overwrite / random visible entries | 5,000 | 250 | 0.01 | 73,833.65 | 0.04 | 23,809.52 | 0.01 | 111,646.07 | 1.73 | 579.14 | json-joy |
| crud | overwrite / after insert | 5,000 | 250 | 0 | 386,487.17 | 0.01 | 68,842.02 | 0.01 | 187,143.96 | 1.56 | 640.88 | crlist |
| crud | overwrite / after delete | 5,000 | 250 | 0 | 330,168.99 | 0.03 | 37,449.27 | 0.01 | 189,696.3 | 1.58 | 631.44 | crlist |
| crud | delete / head | 5,000 | 250 | 0.01 | 169,171.76 | 0.02 | 55,905.57 | 0.01 | 85,795.9 | 0.2 | 5,095.9 | crlist |
| crud | delete / middle | 5,000 | 250 | 0.01 | 70,467.14 | 0.01 | 94,457.89 | 0.01 | 167,066.51 | 0.19 | 5,260.01 | json-joy |
| crud | delete / tail | 5,000 | 250 | 0 | 599,979.36 | 0.01 | 72,491.88 | 0.01 | 174,722.91 | 0.19 | 5,293.28 | crlist |
| crud | delete / range from head | 5,000 | 5,000 | 0 | 1,997,877.45 | 0 | 5,767,065.9 | 0 | 589,436.91 | 0.01 | 81,632.52 | yjs |
| crud | delete / range from middle | 5,000 | 5,000 | 0 | 1,390,157.41 | 0 | 7,142,959.19 | 0 | 614,809.83 | 0.01 | 75,191.59 | yjs |
| crud | delete / range from tail | 5,000 | 5,000 | 0 | 1,579,821.26 | 0 | 5,715,487.6 | 0 | 869,182.32 | 0.01 | 78,015.51 | yjs |
| crud | delete / every other entry | 5,000 | 2,500 | 0 | 315,397.24 | 0.08 | 12,931.09 | 0.07 | 14,620.95 | 0.18 | 5,585.59 | crlist |
| crud | delete / all entries from head one by one | 5,000 | 5,000 | 0 | 227,015.17 | 0.01 | 126,588.33 | 0.01 | 116,695.98 | 0.17 | 5,907.1 | crlist |
| crud | delete / all entries from middle outward | 5,000 | 5,000 | 0 | 355,450.94 | 0.01 | 132,280.84 | 0 | 226,856.25 | 0.17 | 5,973.51 | crlist |
| crud | delete / all entries from tail one by one | 5,000 | 5,000 | 0 | 1,005,390.5 | 0.01 | 134,803.68 | 0 | 349,033.73 | 0.17 | 6,048 | crlist |
| crud | delete / all entries in random order | 5,000 | 5,000 | 0.1 | 10,385.67 | 9.28 | 107.8 | 5.73 | 174.45 | 0.21 | 4,873.46 | crlist |
| crud | delete / already deleted head | 5,000 | 250 | 0 | 312,688.79 | 0.01 | 111,157.15 | 0 | 574,085.77 | 0.03 | 30,009.17 | json-joy |
| crud | delete / already deleted middle | 5,000 | 250 | 0 | 349,788.31 | 0 | 239,396.19 | 0 | 935,173.76 | 0.02 | 60,550.66 | json-joy |
| crud | delete / already deleted tail | 5,000 | 250 | 0 | 1,155,401.5 | 0 | 267,319.64 | 0 | 703,383.27 | 0.03 | 37,911.54 | crlist |
| crud | mixed / append overwrite delete tail | 5,000 | 250 | 0 | 202,122.12 | 0.02 | 56,104.41 | 0.01 | 155,479.6 | 1.28 | 784.05 | crlist |
| crud | mixed / prepend overwrite delete head | 5,000 | 250 | 0 | 280,571.33 | 0.02 | 48,481.85 | 0.01 | 164,880.79 | 1.33 | 749.78 | crlist |
| crud | mixed / insert overwrite delete middle | 5,000 | 250 | 0 | 224,785.17 | 0.01 | 71,296.55 | 0.01 | 136,689.55 | 1.29 | 773.47 | crlist |
| crud | mixed / append prepend insert overwrite delete | 5,000 | 250 | 0 | 296,243.28 | 0.01 | 86,405.81 | 0.01 | 162,815.32 | 1.33 | 752.73 | crlist |
| mags | snapshot | 5,000 | 250 | 0.3 | 3,306.7 | 2.75 | 364.02 | 4.93 | 202.79 | 14.36 | 69.61 | crlist |
| mags | snapshot / clean state | 5,000 | 250 | 0.2 | 4,910.38 | 2.69 | 371.57 | 4.69 | 213.39 | 14.29 | 70 | crlist |
| mags | snapshot / tombstoned state 50% deleted | 5,000 | 250 | 0.16 | 6,375.97 | 1.32 | 758.15 | 2.29 | 437.04 | 14.39 | 69.51 | crlist |
| mags | snapshot / tombstoned state 90% deleted | 5,000 | 250 | 0.02 | 55,515.68 | 0.27 | 3,760.48 | 0.44 | 2,273.76 | 14.41 | 69.41 | crlist |
| mags | snapshot / after garbage collection | 5,000 | 250 | 0.13 | 7,674.29 | 1.32 | 758.99 | 2.35 | 425.19 | 14.31 | 69.87 | crlist |
| mags | acknowledge | 5,000 | 250 | 0 | 3,644,421.12 | n/a | n/a | n/a | n/a | n/a | n/a | n/a |
| mags | acknowledge / clean state | 5,000 | 250 | 0 | 6,929,622.75 | n/a | n/a | n/a | n/a | n/a | n/a | n/a |
| mags | acknowledge / 50% deleted state | 5,000 | 250 | 0 | 1,672,699.54 | n/a | n/a | n/a | n/a | n/a | n/a | n/a |
| mags | acknowledge / 90% deleted state | 5,000 | 250 | 0 | 3,141,137.59 | n/a | n/a | n/a | n/a | n/a | n/a | n/a |
| mags | garbage collect | 5,000 | 250 | 0 | 1,521,819.85 | n/a | n/a | n/a | n/a | n/a | n/a | n/a |
| mags | garbage collect / no eligible tombstones | 5,000 | 250 | 0 | 3,062,862.18 | n/a | n/a | n/a | n/a | n/a | n/a | n/a |
| mags | garbage collect / 50% eligible tombstones | 5,000 | 250 | 0 | 873,557.76 | n/a | n/a | n/a | n/a | n/a | n/a | n/a |
| mags | garbage collect / 90% eligible tombstones | 5,000 | 250 | 0 | 736,865.37 | n/a | n/a | n/a | n/a | n/a | n/a | n/a |
| mags | garbage collect / partial frontiers 2 replicas | 5,000 | 250 | 0 | 3,874,767.51 | n/a | n/a | n/a | n/a | n/a | n/a | n/a |
| mags | garbage collect / partial frontiers 10 replicas | 5,000 | 250 | 0 | 11,622,501.16 | n/a | n/a | n/a | n/a | n/a | n/a | n/a |
| mags | post-gc read / full iteration visible values | 5,000 | 250 | 0.19 | 5,378.22 | 0.06 | 15,884 | 0.44 | 2,252.88 | 0.03 | 39,034.31 | automerge |
| mags | merge ordered deltas | 5,000 | 250 | 0.01 | 117,126.41 | 0.02 | 59,487.81 | 0 | 325,522.53 | 2.67 | 374.77 | json-joy |
| mags | merge shuffled gossip | 5,000 | 250 | 1.01 | 986.82 | 0.47 | 2,138.18 | n/a | n/a | 0.68 | 1,466.7 | yjs |
| mags | merge / append head delta into equal replica | 5,000 | 1 | 0.03 | 32,343.62 | 0.05 | 19,257.43 | 0.04 | 28,267.75 | 3.01 | 332.77 | crlist |
| mags | merge / append tail delta into equal replica | 5,000 | 1 | 0.06 | 16,840.12 | 0.03 | 37,425.15 | 0.01 | 113,934.15 | 2.84 | 352.39 | json-joy |
| mags | merge / prepend head delta into equal replica | 5,000 | 1 | 0.02 | 47,824.01 | 0.02 | 44,638.87 | 0.01 | 106,860.44 | 3.01 | 332.24 | json-joy |
| mags | merge / insert middle delta into equal replica | 5,000 | 1 | 0.04 | 24,742.68 | 0.02 | 43,759.85 | 0.01 | 83,111.7 | 2.89 | 346.45 | json-joy |
| mags | merge / overwrite head delta into equal replica | 5,000 | 1 | 0.03 | 38,096.69 | 0.02 | 44,361.64 | 0.01 | 110,168.56 | 2.94 | 339.63 | json-joy |
| mags | merge / overwrite middle delta into equal replica | 5,000 | 1 | 0.09 | 10,803.34 | 0.02 | 41,675.35 | 0.01 | 91,324.2 | 2.91 | 343.52 | json-joy |
| mags | merge / overwrite tail delta into equal replica | 5,000 | 1 | 0.03 | 38,791.26 | 0.02 | 43,624.31 | 0.01 | 72,695.55 | 3.57 | 279.82 | json-joy |
| mags | merge / delete head delta into equal replica | 5,000 | 1 | 0.02 | 42,949.79 | 0.01 | 91,734.7 | 0.01 | 67,581.27 | 1.56 | 640.23 | yjs |
| mags | merge / delete middle delta into equal replica | 5,000 | 1 | 0.1 | 10,511.05 | 0.03 | 31,535.79 | 0.02 | 59,484.86 | 1.55 | 643.63 | json-joy |
| mags | merge / delete tail delta into equal replica | 5,000 | 1 | 0.01 | 72,960.75 | 0.01 | 80,301.94 | 0.01 | 118,119.54 | 1.66 | 601.21 | json-joy |
| mags | merge / duplicate delta ignored | 5,000 | 250 | 0 | 879,532.23 | 0.02 | 45,934.83 | 0.01 | 130,585.74 | 0.03 | 29,678.03 | crlist |
| mags | merge / old delta ignored after merge | 5,000 | 250 | 0 | 891,024.18 | 0.02 | 59,909.84 | 0 | 313,176.07 | 0.03 | 37,955.14 | crlist |
| mags | merge / ordered 1,000 append deltas | 5,000 | 1,000 | 0 | 530,577.44 | 0.01 | 83,792.82 | 0 | 273,838.91 | 2.99 | 334.73 | crlist |
| mags | merge / ordered 1,000 prepend deltas | 5,000 | 1,000 | 0 | 347,692.33 | 0.01 | 135,807.27 | 0.01 | 146,930.65 | 3.05 | 328.08 | crlist |
| mags | merge / ordered 1,000 middle insert deltas | 5,000 | 1,000 | 0 | 339,548.77 | 0.01 | 115,993.55 | 0 | 385,187.68 | 3.04 | 328.7 | json-joy |
| mags | merge / shuffled 1,000 mixed deltas | 5,000 | 1,000 | 0.98 | 1,020.45 | 1.05 | 951.09 | n/a | n/a | 0.82 | 1,216.74 | automerge |
| mags | merge / reverse ordered 1,000 mixed deltas | 5,000 | 1,000 | 0.27 | 3,714.34 | 0.97 | 1,034.66 | n/a | n/a | 0.81 | 1,230.01 | crlist |
| mags | merge / concurrent prepends same head | 5,000 | 2 | 0.06 | 17,578.86 | 0.09 | 10,579.04 | n/a | n/a | 9.27 | 107.83 | crlist |
| mags | merge / concurrent appends same tail | 5,000 | 2 | 0.02 | 46,371.44 | 0.02 | 42,618.48 | n/a | n/a | 9.49 | 105.39 | crlist |
| mags | merge / concurrent inserts same middle position | 5,000 | 2 | 0.05 | 21,504.45 | 0.03 | 35,256.58 | n/a | n/a | 7.66 | 130.5 | yjs |
| mags | merge / concurrent overwrites same head | 5,000 | 2 | 0.02 | 46,937.34 | 0.03 | 38,672 | n/a | n/a | 7.87 | 126.99 | crlist |
| mags | merge / concurrent overwrites same middle | 5,000 | 2 | 0.07 | 13,870.59 | 0.03 | 38,191.99 | n/a | n/a | 13.31 | 75.16 | yjs |
| mags | merge / concurrent overwrites same tail | 5,000 | 2 | 0.02 | 55,560.19 | 0.03 | 35,444.65 | n/a | n/a | 13.25 | 75.5 | crlist |
| mags | merge / concurrent deletes same head | 5,000 | 2 | 0.02 | 40,915.69 | 0.01 | 71,963.15 | 0.02 | 48,665.35 | 6.83 | 146.41 | yjs |
| mags | merge / concurrent deletes same middle | 5,000 | 2 | 0.09 | 10,872.28 | 0.01 | 66,697.79 | 0.02 | 61,178.92 | 6.94 | 144.12 | yjs |
| mags | merge / concurrent deletes same tail | 5,000 | 2 | 0.01 | 83,315.98 | 0.02 | 65,993.53 | 0.01 | 76,985.26 | 6.81 | 146.89 | crlist |
| mags | merge / concurrent overwrite delete same entry | 5,000 | 2 | 0.11 | 9,438.1 | 0.08 | 13,023.55 | 0.06 | 17,282.2 | 8.21 | 121.79 | json-joy |
| mags | merge / forked replicas rejoin after 250 ops each | 5,000 | 500 | 0 | 219,851.93 | 0.01 | 117,842.01 | n/a | n/a | 2.77 | 361.39 | crlist |
| mags | merge / 10 replicas gossip convergence | 5,000 | 100 | 0 | 248,395.37 | 0.01 | 99,767.04 | n/a | n/a | 6 | 166.53 | crlist |
| mags | merge / snapshot merge into stale replica | 5,000 | 5,350 | 0 | 1,156,390.96 | 0 | 605,475.4 | 0 | 460,085.08 | 0.03 | 37,134.97 | crlist |
| class | constructor / hydrate snapshot | 5,000 | 250 | 3.67 | 272.38 | 5.9 | 169.51 | 12.44 | 80.38 | 132.22 | 7.56 | crlist |
| class | read / head | 5,000 | 250 | 0 | 3,285,453.33 | 0 | 4,000,896.2 | 0 | 2,074,929.87 | 0 | 3,636,469.42 | yjs |
| class | read / middle | 5,000 | 250 | 0 | 9,862,711.06 | 0 | 9,437,879.87 | 0 | 3,936,449.95 | 0 | 12,130,622.54 | automerge |
| class | read / tail | 5,000 | 250 | 0 | 2,593,630.04 | 0 | 2,549,901.57 | 0 | 2,028,233 | 0 | 3,941,476.95 | automerge |
| class | find near head | 5,000 | 250 | 0 | 1,011,359.59 | n/a | n/a | n/a | n/a | 0 | 1,284,594.12 | automerge |
| class | find near middle | 5,000 | 250 | 0.03 | 34,793.68 | n/a | n/a | n/a | n/a | 0.02 | 47,825.11 | automerge |
| class | find near tail | 5,000 | 250 | 0.08 | 12,958.14 | n/a | n/a | n/a | n/a | 0.04 | 23,140.01 | automerge |
| class | iterate visible values | 5,000 | 250 | 0.11 | 9,211.51 | 0.12 | 8,375.04 | 1.04 | 965.28 | 0.06 | 17,133.16 | automerge |
| class | collect visible values to array | 5,000 | 250 | 0.09 | 10,936.44 | 0.12 | 8,604.7 | 1.03 | 975.03 | 0.06 | 17,419.53 | automerge |
| class | append / single after tail | 5,000 | 250 | 0 | 362,945.32 | 0.01 | 71,911.12 | 0.01 | 192,486.85 | 1.53 | 654.46 | crlist |
| class | append / batch after tail | 5,000 | 25,000 | 0 | 2,082,143.21 | 0 | 703,216.82 | 0 | 200,834.67 | 0.14 | 6,932.38 | crlist |
| class | prepend / single before head | 5,000 | 250 | 0 | 321,678.29 | 0.01 | 126,286.61 | 0 | 217,364.46 | 1.62 | 618.73 | crlist |
| class | prepend / batch before head | 5,000 | 25,000 | 0 | 2,348,595.23 | 0 | 1,280,644.35 | 0 | 281,403.26 | 0.14 | 6,933.67 | crlist |
| class | insert / single before middle | 5,000 | 250 | 0 | 244,725.91 | 0.01 | 90,261.44 | 0 | 229,267.35 | 1.56 | 639.63 | crlist |
| class | insert / batch before middle | 5,000 | 25,000 | 0 | 1,562,440.43 | 0 | 1,271,732.7 | 0 | 281,357.48 | 0.15 | 6,816.48 | crlist |
| class | overwrite / head | 5,000 | 250 | 0 | 239,732.04 | 0.02 | 64,814.26 | 0.01 | 164,852.52 | 1.69 | 591.25 | crlist |
| class | overwrite / middle | 5,000 | 250 | 0 | 318,581.73 | 0.02 | 62,048.63 | 0 | 200,725.82 | 1.63 | 612.57 | crlist |
| class | overwrite / tail | 5,000 | 250 | 0 | 207,046.54 | 0.01 | 73,263.85 | 0.01 | 196,423.21 | 1.55 | 643.79 | crlist |
| class | overwrite / random | 5,000 | 250 | 0.01 | 74,317.55 | 0.05 | 21,008.42 | 0.01 | 110,704.46 | 1.84 | 544.23 | json-joy |
| class | remove / head | 5,000 | 250 | 0 | 259,904.98 | 0.01 | 86,907.49 | 0.01 | 86,928.4 | 0.23 | 4,415.35 | crlist |
| class | remove / middle | 5,000 | 250 | 0 | 365,080.22 | 0.01 | 101,260.94 | 0.01 | 135,771.13 | 0.21 | 4,685.9 | crlist |
| class | remove / tail | 5,000 | 250 | 0 | 457,236.5 | 0.02 | 62,502.61 | 0 | 404,009.06 | 0.19 | 5,168.54 | crlist |
| class | remove / range from head | 5,000 | 5,000 | 0 | 2,143,141.26 | 0 | 6,945,158.25 | 0 | 704,218.21 | 0.01 | 80,877.91 | yjs |
| class | remove / range from middle | 5,000 | 5,000 | 0 | 1,494,783.5 | 0 | 8,264,708.7 | 0 | 851,936.79 | 0.01 | 72,488.84 | yjs |
| class | remove / range from tail | 5,000 | 5,000 | 0 | 1,638,652.27 | 0 | 9,541,074.32 | 0 | 828,712.16 | 0.01 | 74,757.44 | yjs |
| class | mixed / append overwrite remove tail | 5,000 | 250 | 0 | 360,867 | 0.01 | 92,075.61 | 0.01 | 174,294.61 | 1.16 | 865.21 | crlist |
| class | mixed / prepend overwrite remove head | 5,000 | 250 | 0 | 452,478.04 | 0.01 | 109,935.78 | 0 | 256,067.26 | 1.21 | 825.52 | crlist |
| class | mixed / insert overwrite remove middle | 5,000 | 250 | 0 | 405,711.11 | 0.01 | 102,583.92 | 0 | 273,092.12 | 1.18 | 850.17 | crlist |
| class | paste / insert 10,000 entries at cursor | 5,000 | 10,000 | 0 | 794,638.92 | 0 | 1,409,916.42 | 0.01 | 132,320.76 | 0.13 | 7,569.58 | yjs |
| class | render / join visible entries to string | 5,000 | 250 | 0.17 | 5,716.93 | 0.21 | 4,877.01 | 1.1 | 911.71 | 0.14 | 6,965.55 | automerge |
| class | snapshot | 5,000 | 250 | 0.12 | 8,406.46 | 2.72 | 368.27 | 4.45 | 224.64 | 14.4 | 69.45 | crlist |
| class | snapshot / tombstoned state 50% deleted | 5,000 | 250 | 0.05 | 19,288.82 | 1.34 | 746.62 | 2.16 | 463.05 | 14.35 | 69.68 | crlist |
| class | snapshot / after garbage collection | 5,000 | 250 | 0.08 | 13,086.49 | 0.12 | 8,515.7 | 0.96 | 1,038.34 | 0.06 | 16,352.47 | automerge |
| class | acknowledge | 5,000 | 250 | 0.01 | 102,844.39 | n/a | n/a | n/a | n/a | n/a | n/a | n/a |
| class | acknowledge / 50% deleted state | 5,000 | 250 | 0.01 | 164,656.76 | n/a | n/a | n/a | n/a | n/a | n/a | n/a |
| class | acknowledge / 90% deleted state | 5,000 | 250 | 0.01 | 148,015.7 | n/a | n/a | n/a | n/a | n/a | n/a | n/a |
| class | garbage collect | 5,000 | 250 | 0.08 | 12,734.44 | 0.12 | 8,399.68 | 0.95 | 1,056.8 | 0.06 | 17,843.21 | automerge |
| class | garbage collect / no eligible tombstones | 5,000 | 250 | 0.07 | 13,958.88 | 0.19 | 5,387.47 | 0.96 | 1,036.29 | 0.06 | 17,175.25 | automerge |
| class | garbage collect / 90% eligible tombstones | 5,000 | 250 | 0.07 | 15,232.01 | 0.18 | 5,476.41 | 0.96 | 1,043.65 | 0.06 | 16,955.48 | automerge |
| class | merge ordered deltas | 5,000 | 250 | 0 | 203,862.96 | 0.01 | 92,156.9 | 0 | 343,760.27 | 2.63 | 379.63 | json-joy |
| class | merge shuffled gossip | 5,000 | 250 | 0.85 | 1,177.9 | 0.37 | 2,721.54 | n/a | n/a | 0.65 | 1,543.98 | yjs |
| class | merge / duplicate delta ignored | 5,000 | 250 | 0 | 585,344.38 | 0.02 | 43,292.11 | 0 | 480,479.1 | 0.03 | 31,712.9 | crlist |
| class | merge / concurrent prepends same head | 5,000 | 2 | 0.05 | 21,975.61 | 0.05 | 21,886.39 | n/a | n/a | 7.92 | 126.32 | crlist |
| class | merge / concurrent appends same tail | 5,000 | 2 | 0.02 | 56,567.49 | 0.02 | 53,705.69 | n/a | n/a | 7.65 | 130.64 | crlist |
| class | merge / concurrent inserts same middle position | 5,000 | 2 | 0.05 | 21,862.46 | 0.03 | 38,686.96 | n/a | n/a | 9.87 | 101.27 | yjs |
| class | merge / forked replicas rejoin after 250 ops each | 5,000 | 500 | 0.01 | 70,733.43 | 0.01 | 118,173.25 | n/a | n/a | 2.75 | 363.86 | yjs |
| latency | append tail write to remote visible | 5,000 | 250 | 0.08 | 13,229.18 | 0.16 | 6,289.77 | 7.85 | 127.41 | 4.74 | 211.06 | crlist |
| latency | prepend head write to remote visible | 5,000 | 250 | 0.01 | 140,509.59 | 0.02 | 47,143.02 | 0.01 | 86,997.49 | 4.81 | 207.74 | crlist |
| latency | middle insert write to remote visible | 5,000 | 250 | 0.04 | 23,052.36 | 0.09 | 10,977.82 | 2.74 | 364.61 | 4.75 | 210.56 | crlist |
| latency | head insert write to remote visible | 5,000 | 250 | 0 | 250,451.56 | 0.02 | 56,873.84 | 0.01 | 97,636.04 | 4.79 | 208.76 | crlist |
| latency | overwrite head write to remote visible | 5,000 | 250 | 0.01 | 135,724.55 | 0.03 | 32,562.67 | 0.08 | 12,058.48 | 4.84 | 206.45 | crlist |
| latency | overwrite middle write to remote visible | 5,000 | 250 | 0.05 | 21,360.38 | 0.1 | 10,343.55 | 1.68 | 596.68 | 4.82 | 207.63 | crlist |
| latency | overwrite tail write to remote visible | 5,000 | 250 | 0.07 | 14,490.55 | 0.15 | 6,839.29 | 3.3 | 303.1 | 4.72 | 212.01 | crlist |
| latency | head delete to remote hidden | 5,000 | 250 | 0.58 | 1,735.98 | 0.32 | 3,077.47 | 6.74 | 148.43 | 1.85 | 539.16 | yjs |
| latency | middle delete to remote hidden | 5,000 | 250 | 0.64 | 1,574.4 | 0.33 | 3,062.4 | 6.71 | 148.94 | 1.83 | 545.66 | yjs |
| latency | tail delete to remote hidden | 5,000 | 250 | 0.24 | 4,237.16 | 0.26 | 3,803.42 | 6.69 | 149.47 | 1.82 | 549.64 | crlist |
| latency | append tail write to 10 remotes visible | 5,000 | 2,500 | 0.1 | 10,029.13 | 0.13 | 7,756.03 | 10.8 | 92.56 | 3.18 | 314.8 | crlist |
| latency | prepend head write to 10 remotes visible | 5,000 | 2,500 | 0 | 260,124.38 | 0.01 | 135,566.81 | 0.01 | 132,760.02 | 3.25 | 307.64 | crlist |
| latency | middle insert write to 10 remotes visible | 5,000 | 2,500 | 0.04 | 24,718.77 | 0.07 | 14,031.25 | 4.07 | 245.63 | 3.26 | 306.54 | crlist |
| latency | overwrite middle write to 10 remotes visible | 5,000 | 2,500 | 0.05 | 18,433.77 | 0.07 | 14,885.63 | 2.9 | 345.32 | 3.25 | 307.77 | crlist |
| latency | delete middle to 10 remotes hidden | 5,000 | 2,500 | 0.7 | 1,437.24 | 0.31 | 3,233.51 | 10.09 | 99.11 | 1.63 | 612.34 | yjs |
| latency | out-of-order write delivery to remote visible | 5,000 | 250 | 1.36 | 737.02 | 82.01 | 12.19 | n/a | n/a | 15.83 | 63.16 | crlist |
| latency | out-of-order delete delivery to remote convergence | 5,000 | 165 | 2.27 | 440.31 | 0.29 | 3,444.97 | 9.48 | 105.5 | 6.74 | 148.28 | yjs |
| latency | out-of-order append delivery to convergence | 5,000 | 250 | 1.25 | 802.15 | 21.26 | 47.04 | n/a | n/a | 16.24 | 61.57 | crlist |
| latency | out-of-order prepend delivery to convergence | 5,000 | 250 | 1.2 | 830.33 | 21.78 | 45.91 | 0.06 | 17,485.41 | 15.89 | 62.92 | json-joy |
| latency | out-of-order middle insert delivery to convergence | 5,000 | 250 | 1.28 | 780.5 | 81.68 | 12.24 | n/a | n/a | 16.16 | 61.88 | crlist |
| latency | out-of-order overwrite delivery to convergence | 5,000 | 129 | 1.69 | 592.6 | n/a | n/a | 276.53 | 3.62 | 75.23 | 13.29 | crlist |
| latency | offline burst 1,000 ops then sync | 5,000 | 1,000 | 0 | 301,854.08 | 0.02 | 54,957.6 | 0 | 343,224.84 | 2.8 | 357.65 | json-joy |
| latency | forked replicas mixed ops then converge | 5,000 | 500 | 0 | 388,500.69 | 0.01 | 146,521.69 | n/a | n/a | 2.81 | 355.55 | crlist |
| latency | duplicate shuffled gossip to convergence | 5,000 | 500 | 0.45 | 2,218.71 | 0.16 | 6,425.52 | n/a | n/a | 0.36 | 2,756.04 | yjs |
| latency | remote snapshot hydrate then apply pending deltas | 5,000 | 250 | 0.02 | 53,421.11 | 0.03 | 29,836.29 | 0.03 | 31,356.42 | 0.64 | 1,558.02 | crlist |
| workload | local app session | 5,000 | 250 | 0.01 | 154,223.5 | 0.01 | 76,549.05 | 0.01 | 169,219.05 | 1.1 | 910.53 | json-joy |
| workload | read heavy session | 5,000 | 250 | 0 | 3,111,387.68 | 0 | 4,659,832.25 | 0 | 653,483.72 | 0 | 2,362,993.63 | yjs |
| workload | write heavy session | 5,000 | 250 | 0.01 | 163,317.03 | 0.01 | 89,745.95 | 0.01 | 146,911.57 | 1.08 | 925.24 | crlist |
| workload | append tail heavy session | 5,000 | 250 | 0 | 557,427.27 | 0.02 | 51,514.21 | 0 | 212,030.26 | 1.32 | 757.42 | crlist |
| workload | prepend head heavy session | 5,000 | 250 | 0 | 230,683.06 | 0.02 | 62,804.49 | 0 | 207,187.24 | 1.35 | 740.52 | crlist |
| workload | insert middle heavy session | 5,000 | 250 | 0.01 | 161,831.05 | 0.01 | 113,909.9 | 0 | 237,955.64 | 1.36 | 736.61 | json-joy |
| workload | overwrite heavy session | 5,000 | 250 | 0 | 204,452.32 | 0.02 | 61,983.12 | 0.08 | 13,055.42 | 1.1 | 911.9 | crlist |
| workload | delete heavy session | 5,000 | 250 | 0 | 231,717.7 | 0.01 | 114,204.48 | 0 | 400,809.96 | 0.17 | 5,816.39 | json-joy |
| workload | balanced append prepend insert overwrite delete session | 5,000 | 250 | 0 | 226,312.34 | 0.01 | 109,525.14 | 0 | 269,514.17 | 1.15 | 871.87 | json-joy |
| workload | random edit session | 5,000 | 250 | 0.01 | 105,466.27 | 0.02 | 62,881.71 | 0.01 | 92,289.78 | 1.06 | 941.65 | crlist |
| workload | text editing session | 5,000 | 250 | 0.01 | 170,095.8 | 0.01 | 71,347.32 | 0 | 250,438.77 | 1.36 | 734.95 | json-joy |
| workload | collaborative offline session | 5,000 | 500 | 0 | 379,793.76 | 0.01 | 131,780.47 | n/a | n/a | 2.82 | 354.67 | crlist |
| workload | sync and cleanup session | 5,000 | 252 | 0 | 291,120.82 | 0.01 | 148,277.36 | n/a | n/a | 2.8 | 357.65 | crlist |
| workload | long lived tombstoned session | 5,000 | 250 | 0 | 257,101.13 | 0.01 | 95,004.91 | 0 | 240,478.03 | 1.59 | 629.76 | crlist |
| workload | sparse visible session | 5,000 | 250 | 0 | 414,622.58 | 0.1 | 9,785.47 | 0.01 | 102,614.7 | 0.8 | 1,252.99 | crlist |
| workload | post-gc edit session | 5,000 | 250 | 0 | 720,525.46 | 0.01 | 91,062.51 | 0 | 249,517.18 | 1.28 | 784.18 | crlist |

## License

Apache-2.0
