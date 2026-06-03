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
| crud | create / empty list | 5,000 | 250 | 0.01 | 77,549.29 | 0.11 | 9,009.57 | 0.02 | 60,728.64 | 0.34 | 2,939.25 | crlist |
| crud | create / hydrate snapshot | 5,000 | 250 | 3.93 | 254.5 | 4.91 | 203.75 | 12.94 | 77.27 | 132.12 | 7.57 | crlist |
| crud | create / hydrate clean snapshot | 5,000 | 250 | 3.6 | 277.58 | 4.82 | 207.48 | 12.83 | 77.95 | 132.33 | 7.56 | crlist |
| crud | create / hydrate tombstoned snapshot | 5,000 | 250 | 1.61 | 621.91 | 2.44 | 410.14 | 6.51 | 153.62 | 115.82 | 8.63 | crlist |
| crud | read / head | 5,000 | 250 | 0 | 2,608,214.83 | 0 | 1,571,398.04 | 0 | 233,070.03 | 0 | 3,503,117.77 | automerge |
| crud | read / middle | 5,000 | 250 | 0 | 7,810,547.36 | 0 | 1,651,004.14 | 0 | 440,298.98 | 0 | 8,257,638.32 | automerge |
| crud | read / tail | 5,000 | 250 | 0 | 2,294,841.2 | 0 | 929,796.63 | 0 | 495,911.7 | 0 | 3,061,099.55 | automerge |
| crud | read / random indexed reads | 5,000 | 250 | 0 | 1,382,391.65 | 0 | 862,107.61 | 0 | 236,523.82 | 0 | 926,863.09 | crlist |
| crud | read / sequential indexed reads from head | 5,000 | 250 | 0 | 2,202,507.33 | 0 | 2,370,679.44 | 0 | 287,723.75 | 0 | 1,014,433.36 | yjs |
| crud | read / sequential indexed reads from middle | 5,000 | 250 | 0 | 9,789,333.54 | 0 | 8,184,645.6 | 0 | 867,531.42 | 0 | 9,898,246.03 | automerge |
| crud | read / sequential indexed reads from tail | 5,000 | 250 | 0 | 8,998,956.12 | 0 | 8,534,462.16 | 0 | 806,331.96 | 0 | 12,266,928.36 | automerge |
| crud | read / full iteration visible values | 5,000 | 250 | 0.35 | 2,856.71 | 0.16 | 6,332.4 | 1.13 | 883.77 | 0.05 | 19,384.53 | automerge |
| crud | read / collect visible values to array | 5,000 | 250 | 0.36 | 2,810.21 | 0.15 | 6,858.06 | 1.05 | 952.29 | 0.08 | 12,035.46 | automerge |
| crud | read / visible sparse over deleted entries | 5,000 | 250 | 0 | 8,013,847.93 | 0.02 | 42,037.61 | 0.02 | 66,067.62 | 0 | 2,271,447 | crlist |
| crud | find / head | 5,000 | 250 | 0 | 1,242,631.2 | 0 | 1,771,316.02 | 0 | 919,148.06 | 0 | 1,181,580.58 | yjs |
| crud | find / middle | 5,000 | 250 | 0.02 | 56,382.52 | 0.08 | 13,246.78 | 0.52 | 1,941.03 | 0.02 | 45,183.47 | crlist |
| crud | find / tail | 5,000 | 250 | 0.03 | 32,831.06 | 0.13 | 7,648.46 | 0.95 | 1,055.13 | 0.04 | 22,928.95 | crlist |
| crud | find / missing value | 5,000 | 250 | 0.15 | 6,859.38 | 0.28 | 3,581.54 | 1.93 | 517.25 | 0.05 | 19,594.85 | automerge |
| crud | append / single after tail | 5,000 | 250 | 0 | 267,014.71 | 0.02 | 58,219.39 | 0.01 | 104,655.63 | 1.55 | 643.1 | crlist |
| crud | append / batch after tail | 5,000 | 25,000 | 0 | 1,760,834.45 | 0 | 647,443.75 | 0.01 | 171,620.83 | 0.14 | 6,923.09 | crlist |
| crud | append / batch after deleted tail | 5,000 | 25,000 | 0 | 1,865,305.12 | 0 | 674,793.19 | 0.01 | 184,510.57 | 0.14 | 6,909.15 | crlist |
| crud | append / batch after garbage collection | 5,000 | 25,000 | 0 | 1,388,070.08 | 0 | 839,187.7 | 0.01 | 197,345.29 | 0.15 | 6,888.76 | crlist |
| crud | prepend / single before head | 5,000 | 250 | 0 | 240,030.8 | 0.01 | 93,253.41 | 0.01 | 112,158.32 | 1.63 | 613.46 | crlist |
| crud | prepend / batch before head | 5,000 | 25,000 | 0 | 1,385,031.12 | 0 | 1,048,926.9 | 0 | 255,674.2 | 0.14 | 6,992.17 | crlist |
| crud | prepend / batch before deleted head | 5,000 | 25,000 | 0 | 1,886,041.31 | 0 | 810,176.52 | 0 | 245,121.67 | 0.14 | 6,954.42 | crlist |
| crud | prepend / batch after garbage collection | 5,000 | 25,000 | 0 | 1,976,815.9 | 0 | 1,170,199.15 | 0 | 261,639.82 | 0.14 | 7,186.62 | crlist |
| crud | insert / single before head | 5,000 | 250 | 0 | 408,897.61 | 0.01 | 108,897.35 | 0.01 | 184,246.35 | 1.61 | 620.12 | crlist |
| crud | insert / single after head | 5,000 | 250 | 0 | 229,133.71 | 0.01 | 92,581.76 | 0.01 | 125,974.86 | 1.61 | 622.57 | crlist |
| crud | insert / single before middle | 5,000 | 250 | 0 | 254,661.58 | 0.01 | 87,426.95 | 0.01 | 178,494.55 | 1.56 | 640.94 | crlist |
| crud | insert / single after middle | 5,000 | 250 | 0 | 237,654.11 | 0.01 | 91,043.4 | 0.01 | 152,976.59 | 1.56 | 642.37 | crlist |
| crud | insert / single before tail | 5,000 | 250 | 0.01 | 173,468.72 | 0.01 | 98,368.96 | 0 | 224,820.55 | 1.56 | 642.42 | json-joy |
| crud | insert / single after tail | 5,000 | 250 | 0 | 453,793.81 | 0.01 | 84,729.82 | 0 | 270,562.48 | 1.51 | 662.7 | crlist |
| crud | insert / batch before head | 5,000 | 25,000 | 0 | 1,932,086.24 | 0 | 1,375,743.96 | 0 | 213,434.3 | 0.14 | 6,990.16 | crlist |
| crud | insert / batch after head | 5,000 | 25,000 | 0 | 1,869,278.93 | 0 | 1,186,283.58 | 0 | 283,731.74 | 0.14 | 7,009.56 | crlist |
| crud | insert / batch before middle | 5,000 | 25,000 | 0 | 929,325.95 | 0 | 931,252.83 | 0 | 279,140.75 | 0.15 | 6,790.82 | yjs |
| crud | insert / batch after middle | 5,000 | 25,000 | 0 | 1,360,735.28 | 0 | 1,344,371.52 | 0 | 287,012.34 | 0.16 | 6,197.74 | crlist |
| crud | insert / batch before tail | 5,000 | 25,000 | 0 | 1,778,771.61 | 0 | 871,953.19 | 0 | 356,673.38 | 0.15 | 6,751.76 | crlist |
| crud | insert / batch after tail | 5,000 | 25,000 | 0 | 1,474,795.91 | 0 | 709,567.8 | 0 | 219,353.5 | 0.15 | 6,814.35 | crlist |
| crud | insert / repeated before head | 5,000 | 250 | 0 | 419,154.35 | 0.01 | 136,460.13 | 0.01 | 198,078.01 | 1.61 | 620.98 | crlist |
| crud | insert / repeated before middle | 5,000 | 250 | 0 | 368,454.95 | 0.01 | 95,633.42 | 0 | 222,553.58 | 1.6 | 626.2 | crlist |
| crud | insert / repeated before tail | 5,000 | 250 | 0 | 321,115.53 | 0.05 | 21,476.5 | 0 | 243,976.23 | 1.52 | 658.65 | crlist |
| crud | insert / random positions | 5,000 | 250 | 0 | 305,315.54 | 0.01 | 79,863.3 | 0.02 | 66,241.34 | 1.6 | 623.94 | crlist |
| crud | insert / alternating head and tail | 5,000 | 250 | 0 | 476,697.14 | 0.01 | 130,216.68 | 0.01 | 187,852.55 | 1.62 | 617.45 | crlist |
| crud | overwrite / head | 5,000 | 250 | 0.01 | 153,303.6 | 0.02 | 62,852.67 | 0.02 | 66,278.8 | 1.74 | 573.54 | crlist |
| crud | overwrite / middle | 5,000 | 250 | 0.01 | 186,745.41 | 0.02 | 60,305.28 | 0.01 | 75,051.95 | 1.68 | 595.94 | crlist |
| crud | overwrite / tail | 5,000 | 250 | 0 | 287,816.5 | 0.02 | 59,890.91 | 0.01 | 110,976.8 | 1.6 | 626.68 | crlist |
| crud | overwrite / random | 5,000 | 250 | 0.01 | 91,944.11 | 0.03 | 35,027.75 | 0.01 | 117,326.94 | 1.81 | 553.9 | json-joy |
| crud | overwrite / same head repeatedly | 5,000 | 250 | 0.02 | 57,430.35 | 0.01 | 81,416.76 | 0 | 211,006.97 | 1.71 | 583.59 | json-joy |
| crud | overwrite / same middle repeatedly | 5,000 | 250 | 0 | 282,459.39 | 0.01 | 76,113.79 | 0.01 | 198,268.4 | 1.64 | 610.78 | crlist |
| crud | overwrite / same tail repeatedly | 5,000 | 250 | 0 | 476,042.68 | 0.01 | 77,447.02 | 0 | 201,838.51 | 1.59 | 628.6 | crlist |
| crud | overwrite / random visible entries | 5,000 | 250 | 0.01 | 103,260.77 | 0.04 | 23,020.51 | 0.01 | 162,310.47 | 1.84 | 543.51 | json-joy |
| crud | overwrite / after insert | 5,000 | 250 | 0 | 361,471.22 | 0.01 | 77,636.33 | 0.01 | 190,146.31 | 1.67 | 599.12 | crlist |
| crud | overwrite / after delete | 5,000 | 250 | 0 | 313,245.92 | 0.01 | 79,939.27 | 0.01 | 188,178.34 | 1.63 | 613.52 | crlist |
| crud | delete / head | 5,000 | 250 | 0 | 231,406.27 | 0.01 | 82,154.69 | 0.01 | 89,760.42 | 0.17 | 5,729.66 | crlist |
| crud | delete / middle | 5,000 | 250 | 0 | 274,447.21 | 0.01 | 102,878.2 | 0.01 | 163,323.54 | 0.18 | 5,654.06 | crlist |
| crud | delete / tail | 5,000 | 250 | 0 | 460,489.96 | 0.01 | 76,025 | 0.01 | 190,430.78 | 0.18 | 5,706.46 | crlist |
| crud | delete / range from head | 5,000 | 5,000 | 0 | 1,938,128.73 | 0 | 6,354,055.6 | 0 | 742,099.28 | 0.01 | 82,562.62 | yjs |
| crud | delete / range from middle | 5,000 | 5,000 | 0 | 1,230,398.82 | 0 | 4,894,072.69 | 0 | 643,595.73 | 0.01 | 73,650.14 | yjs |
| crud | delete / range from tail | 5,000 | 5,000 | 0 | 1,482,801.72 | 0 | 6,249,078.26 | 0 | 907,397.21 | 0.01 | 76,698.93 | yjs |
| crud | delete / every other entry | 5,000 | 2,500 | 0 | 246,203.27 | 0.06 | 15,395.15 | 0.06 | 15,712.25 | 0.18 | 5,606.9 | crlist |
| crud | delete / all entries from head one by one | 5,000 | 5,000 | 0 | 260,536.4 | 0.01 | 110,383.53 | 0.01 | 105,122.96 | 0.16 | 6,450.37 | crlist |
| crud | delete / all entries from middle outward | 5,000 | 5,000 | 0 | 314,648.74 | 0.01 | 128,165.53 | 0 | 235,561.93 | 0.16 | 6,367.33 | crlist |
| crud | delete / all entries from tail one by one | 5,000 | 5,000 | 0 | 945,827.9 | 0.01 | 119,219.7 | 0 | 320,376.56 | 0.15 | 6,506.57 | crlist |
| crud | delete / all entries in random order | 5,000 | 5,000 | 0.1 | 10,462.13 | 10.27 | 97.41 | 7.26 | 137.8 | 0.18 | 5,441.28 | crlist |
| crud | delete / already deleted head | 5,000 | 250 | 0 | 308,202.88 | 0 | 291,149.97 | 0 | 616,147.5 | 0.02 | 58,906.29 | json-joy |
| crud | delete / already deleted middle | 5,000 | 250 | 0 | 396,222.26 | 0 | 281,034.66 | 0 | 909,802.21 | 0.02 | 64,985.79 | json-joy |
| crud | delete / already deleted tail | 5,000 | 250 | 0 | 1,410,827.25 | 0 | 284,668.98 | 0 | 1,137,020.01 | 0.02 | 41,107.36 | crlist |
| crud | mixed / append overwrite delete tail | 5,000 | 250 | 0 | 303,293.53 | 0.01 | 70,265.62 | 0.01 | 146,890.76 | 1.37 | 727.48 | crlist |
| crud | mixed / prepend overwrite delete head | 5,000 | 250 | 0 | 255,615.88 | 0.02 | 64,044.23 | 0.01 | 167,150.18 | 1.37 | 729.98 | crlist |
| crud | mixed / insert overwrite delete middle | 5,000 | 250 | 0 | 225,911.3 | 0.01 | 81,618.53 | 0.01 | 165,807.89 | 1.43 | 700.39 | crlist |
| crud | mixed / append prepend insert overwrite delete | 5,000 | 250 | 0 | 351,153.68 | 0.01 | 93,573.28 | 0 | 213,459.38 | 1.36 | 737.99 | crlist |
| mags | snapshot | 5,000 | 250 | 0.31 | 3,224.07 | 2.64 | 378.25 | 4.85 | 206.21 | 14.82 | 67.48 | crlist |
| mags | snapshot / clean state | 5,000 | 250 | 0.2 | 4,949.67 | 2.5 | 399.51 | 4.85 | 206.09 | 14.86 | 67.3 | crlist |
| mags | snapshot / tombstoned state 50% deleted | 5,000 | 250 | 0.15 | 6,651.1 | 1.27 | 789.78 | 2.24 | 447.33 | 14.88 | 67.18 | crlist |
| mags | snapshot / tombstoned state 90% deleted | 5,000 | 250 | 0.03 | 35,469.2 | 0.26 | 3,858.74 | 0.36 | 2,783.08 | 14.96 | 66.85 | crlist |
| mags | snapshot / after garbage collection | 5,000 | 250 | 0.13 | 7,415.41 | 1.26 | 796.07 | 2.24 | 446.58 | 15.11 | 66.19 | crlist |
| mags | acknowledge | 5,000 | 250 | 0 | 2,562,420.56 | n/a | n/a | n/a | n/a | n/a | n/a | n/a |
| mags | acknowledge / clean state | 5,000 | 250 | 0 | 5,011,727.44 | n/a | n/a | n/a | n/a | n/a | n/a | n/a |
| mags | acknowledge / 50% deleted state | 5,000 | 250 | 0 | 2,550,395.82 | n/a | n/a | n/a | n/a | n/a | n/a | n/a |
| mags | acknowledge / 90% deleted state | 5,000 | 250 | 0 | 2,936,133.23 | n/a | n/a | n/a | n/a | n/a | n/a | n/a |
| mags | garbage collect | 5,000 | 250 | 0 | 1,692,310.82 | n/a | n/a | n/a | n/a | n/a | n/a | n/a |
| mags | garbage collect / no eligible tombstones | 5,000 | 250 | 0 | 4,490,587.73 | n/a | n/a | n/a | n/a | n/a | n/a | n/a |
| mags | garbage collect / 50% eligible tombstones | 5,000 | 250 | 0 | 1,013,360.14 | n/a | n/a | n/a | n/a | n/a | n/a | n/a |
| mags | garbage collect / 90% eligible tombstones | 5,000 | 250 | 0 | 755,819.05 | n/a | n/a | n/a | n/a | n/a | n/a | n/a |
| mags | garbage collect / partial frontiers 2 replicas | 5,000 | 250 | 0 | 4,301,001.27 | n/a | n/a | n/a | n/a | n/a | n/a | n/a |
| mags | garbage collect / partial frontiers 10 replicas | 5,000 | 250 | 0 | 10,953,382.4 | n/a | n/a | n/a | n/a | n/a | n/a | n/a |
| mags | post-gc read / full iteration visible values | 5,000 | 250 | 0.19 | 5,252.6 | 0.09 | 10,772.5 | 0.43 | 2,346.6 | 0.03 | 38,702.01 | automerge |
| mags | merge ordered deltas | 5,000 | 250 | 0.01 | 135,535.44 | 0.01 | 74,556.32 | 0.04 | 24,252.44 | 2.71 | 368.67 | crlist |
| mags | merge shuffled gossip | 5,000 | 250 | 0.97 | 1,035 | 0.44 | 2,288.37 | n/a | n/a | 0.69 | 1,451.97 | yjs |
| mags | merge / append head delta into equal replica | 5,000 | 1 | 0.04 | 28,175.36 | 0.06 | 15,471.49 | 0.03 | 29,612.08 | 3.07 | 325.83 | json-joy |
| mags | merge / append tail delta into equal replica | 5,000 | 1 | 0.08 | 12,211.5 | 0.02 | 46,836.21 | 0.01 | 129,349.37 | 2.99 | 334.73 | json-joy |
| mags | merge / prepend head delta into equal replica | 5,000 | 1 | 0.03 | 33,108.2 | 0.02 | 44,577.19 | 0.01 | 139,664.8 | 2.98 | 335.2 | json-joy |
| mags | merge / insert middle delta into equal replica | 5,000 | 1 | 0.06 | 15,930.42 | 0.02 | 57,750.06 | 0.01 | 81,314.03 | 3.19 | 313.51 | json-joy |
| mags | merge / overwrite head delta into equal replica | 5,000 | 1 | 0.03 | 30,771.12 | 0.02 | 60,295.45 | 0.01 | 103,680.66 | 3.07 | 325.36 | json-joy |
| mags | merge / overwrite middle delta into equal replica | 5,000 | 1 | 0.09 | 11,487.91 | 0.02 | 51,127.36 | 0.01 | 92,114.96 | 3 | 333.07 | json-joy |
| mags | merge / overwrite tail delta into equal replica | 5,000 | 1 | 0.02 | 40,973.53 | 0.02 | 49,975.01 | 0.01 | 70,072.17 | 3 | 333.39 | json-joy |
| mags | merge / delete head delta into equal replica | 5,000 | 1 | 0.03 | 37,780.04 | 0.01 | 101,574.4 | 0.01 | 75,471.7 | 1.53 | 652.9 | yjs |
| mags | merge / delete middle delta into equal replica | 5,000 | 1 | 0.11 | 9,279.97 | 0.04 | 25,505 | 0.02 | 60,812.45 | 1.64 | 608.33 | json-joy |
| mags | merge / delete tail delta into equal replica | 5,000 | 1 | 0.01 | 71,270.76 | 0.01 | 77,585.54 | 0.01 | 105,329.68 | 1.53 | 652.91 | json-joy |
| mags | merge / duplicate delta ignored | 5,000 | 250 | 0 | 930,904.54 | 0.01 | 72,979.58 | 0.01 | 95,111.21 | 0.03 | 38,821.85 | crlist |
| mags | merge / old delta ignored after merge | 5,000 | 250 | 0 | 1,073,684.84 | 0.02 | 66,005.75 | 0 | 325,164.34 | 0.02 | 43,507.76 | crlist |
| mags | merge / ordered 1,000 append deltas | 5,000 | 1,000 | 0 | 505,276.86 | 0.01 | 95,802.36 | 0 | 351,473.96 | 3.03 | 330.47 | crlist |
| mags | merge / ordered 1,000 prepend deltas | 5,000 | 1,000 | 0 | 337,848.34 | 0.01 | 164,835.45 | 0.01 | 125,163.4 | 3.08 | 324.6 | crlist |
| mags | merge / ordered 1,000 middle insert deltas | 5,000 | 1,000 | 0 | 379,353.75 | 0.01 | 113,424.52 | 0 | 390,537.89 | 3.06 | 326.83 | json-joy |
| mags | merge / shuffled 1,000 mixed deltas | 5,000 | 1,000 | 1.06 | 943.7 | 0.98 | 1,022.89 | n/a | n/a | 0.83 | 1,207.14 | automerge |
| mags | merge / reverse ordered 1,000 mixed deltas | 5,000 | 1,000 | 0.31 | 3,233.86 | 0.9 | 1,107.99 | n/a | n/a | 0.83 | 1,204.24 | crlist |
| mags | merge / concurrent prepends same head | 5,000 | 2 | 0.08 | 12,433.4 | 0.1 | 10,324.98 | n/a | n/a | 10.02 | 99.77 | crlist |
| mags | merge / concurrent appends same tail | 5,000 | 2 | 0.02 | 48,273.03 | 0.03 | 39,694.35 | n/a | n/a | 7.84 | 127.6 | crlist |
| mags | merge / concurrent inserts same middle position | 5,000 | 2 | 0.06 | 15,877.43 | 0.03 | 35,693.89 | n/a | n/a | 9.85 | 101.49 | yjs |
| mags | merge / concurrent overwrites same head | 5,000 | 2 | 0.02 | 42,563.15 | 0.02 | 41,911.15 | n/a | n/a | 10 | 99.98 | crlist |
| mags | merge / concurrent overwrites same middle | 5,000 | 2 | 0.08 | 12,251.15 | 0.03 | 34,467.31 | n/a | n/a | 9.94 | 100.63 | yjs |
| mags | merge / concurrent overwrites same tail | 5,000 | 2 | 0.02 | 50,303.08 | 0.03 | 38,546.04 | n/a | n/a | 7.77 | 128.7 | crlist |
| mags | merge / concurrent deletes same head | 5,000 | 2 | 0.03 | 39,443.84 | 0.02 | 66,524.75 | 0.02 | 48,875.86 | 11.05 | 90.51 | yjs |
| mags | merge / concurrent deletes same middle | 5,000 | 2 | 0.11 | 8,789.08 | 0.02 | 61,732.21 | 0.03 | 37,602.47 | 11.14 | 89.78 | yjs |
| mags | merge / concurrent deletes same tail | 5,000 | 2 | 0.01 | 66,858.33 | 0.02 | 60,699.87 | 0.02 | 53,655.26 | 11.08 | 90.25 | crlist |
| mags | merge / concurrent overwrite delete same entry | 5,000 | 2 | 0.12 | 8,078.72 | 0.05 | 19,099.64 | 0.08 | 12,196.46 | 8.48 | 117.96 | yjs |
| mags | merge / forked replicas rejoin after 250 ops each | 5,000 | 500 | 0 | 205,673.38 | 0.01 | 97,501.92 | n/a | n/a | 2.8 | 356.55 | crlist |
| mags | merge / 10 replicas gossip convergence | 5,000 | 100 | 0 | 222,403.6 | 0.01 | 105,583.8 | n/a | n/a | 5.52 | 181.02 | crlist |
| mags | merge / snapshot merge into stale replica | 5,000 | 5,350 | 0 | 1,163,280.69 | 0 | 684,942.47 | 0 | 384,658.44 | 0.03 | 36,662.25 | crlist |
| class | constructor / hydrate snapshot | 5,000 | 250 | 3.63 | 275.28 | 4.78 | 208.99 | 13.57 | 73.67 | 135.11 | 7.4 | crlist |
| class | read / head | 5,000 | 250 | 0 | 3,288,089.23 | 0 | 4,151,513.64 | 0 | 1,466,095.09 | 0 | 2,371,579 | yjs |
| class | read / middle | 5,000 | 250 | 0 | 10,896,094.84 | 0 | 8,896,480.55 | 0 | 4,063,058.67 | 0 | 11,109,629.83 | automerge |
| class | read / tail | 5,000 | 250 | 0 | 2,710,144.61 | 0 | 2,313,765.05 | 0 | 1,886,863.66 | 0 | 3,829,304.9 | automerge |
| class | find near head | 5,000 | 250 | 0 | 1,128,230.12 | n/a | n/a | n/a | n/a | 0 | 1,506,532.32 | automerge |
| class | find near middle | 5,000 | 250 | 0.03 | 35,400.3 | n/a | n/a | n/a | n/a | 0.02 | 43,827.05 | automerge |
| class | find near tail | 5,000 | 250 | 0.08 | 13,325.09 | n/a | n/a | n/a | n/a | 0.05 | 21,538.09 | automerge |
| class | iterate visible values | 5,000 | 250 | 0.1 | 9,869.29 | 0.13 | 7,457.81 | 1.1 | 908.03 | 0.06 | 17,474.11 | automerge |
| class | collect visible values to array | 5,000 | 250 | 0.13 | 7,675.8 | 0.13 | 7,447.24 | 1.04 | 963.49 | 0.06 | 17,137.06 | automerge |
| class | append / single after tail | 5,000 | 250 | 0 | 377,801.02 | 0.01 | 75,646.9 | 0 | 200,431.97 | 1.57 | 635.87 | crlist |
| class | append / batch after tail | 5,000 | 25,000 | 0 | 1,556,573.64 | 0 | 686,015.05 | 0 | 202,493.49 | 0.15 | 6,726.87 | crlist |
| class | prepend / single before head | 5,000 | 250 | 0 | 309,509.75 | 0.01 | 130,882.24 | 0 | 200,073.63 | 1.66 | 601.76 | crlist |
| class | prepend / batch before head | 5,000 | 25,000 | 0 | 2,103,361.9 | 0 | 1,357,266.76 | 0 | 282,632.94 | 0.15 | 6,472.78 | crlist |
| class | insert / single before middle | 5,000 | 250 | 0 | 240,600 | 0.01 | 105,318.28 | 0 | 235,120.18 | 1.67 | 600.23 | crlist |
| class | insert / batch before middle | 5,000 | 25,000 | 0 | 1,464,723.31 | 0 | 1,343,024.67 | 0 | 277,339.87 | 0.16 | 6,241.01 | crlist |
| class | overwrite / head | 5,000 | 250 | 0 | 233,831.93 | 0.01 | 81,161 | 0.01 | 181,385.49 | 1.76 | 567.39 | crlist |
| class | overwrite / middle | 5,000 | 250 | 0 | 292,339.88 | 0.04 | 26,656.53 | 0.01 | 88,699 | 1.7 | 588.11 | crlist |
| class | overwrite / tail | 5,000 | 250 | 0 | 261,666.12 | 0.02 | 50,867.09 | 0.01 | 189,003.33 | 1.62 | 615.78 | crlist |
| class | overwrite / random | 5,000 | 250 | 0.01 | 70,668.62 | 0.02 | 47,690.16 | 0.01 | 118,876.83 | 1.82 | 549.09 | json-joy |
| class | remove / head | 5,000 | 250 | 0 | 210,009.38 | 0.01 | 95,608.44 | 0.01 | 96,533.18 | 0.18 | 5,450.98 | crlist |
| class | remove / middle | 5,000 | 250 | 0 | 312,098.17 | 0.01 | 121,344.79 | 0.01 | 160,539.1 | 0.23 | 4,423.12 | crlist |
| class | remove / tail | 5,000 | 250 | 0 | 458,040.72 | 0.01 | 101,256.92 | 0 | 371,929.72 | 0.21 | 4,792.05 | crlist |
| class | remove / range from head | 5,000 | 5,000 | 0 | 1,874,296.2 | 0 | 12,390,806.02 | 0 | 860,130.71 | 0.01 | 80,199.96 | yjs |
| class | remove / range from middle | 5,000 | 5,000 | 0 | 1,282,570.89 | 0 | 9,973,908.26 | 0 | 343,090.37 | 0.01 | 71,972.24 | yjs |
| class | remove / range from tail | 5,000 | 5,000 | 0 | 1,485,475.32 | 0 | 12,607,351.6 | 0 | 912,413.92 | 0.01 | 75,358.97 | yjs |
| class | mixed / append overwrite remove tail | 5,000 | 250 | 0 | 296,961.49 | 0.01 | 97,432.88 | 0.01 | 184,986.5 | 1.2 | 835.3 | crlist |
| class | mixed / prepend overwrite remove head | 5,000 | 250 | 0 | 393,158.41 | 0.01 | 108,697.64 | 0 | 232,876.58 | 1.26 | 792.47 | crlist |
| class | mixed / insert overwrite remove middle | 5,000 | 250 | 0 | 376,700.61 | 0.01 | 109,449.71 | 0 | 250,498.49 | 1.23 | 812.47 | crlist |
| class | paste / insert 10,000 entries at cursor | 5,000 | 10,000 | 0 | 741,855.34 | 0 | 1,358,285.21 | 0.01 | 185,372.01 | 0.14 | 7,343.28 | yjs |
| class | render / join visible entries to string | 5,000 | 250 | 0.18 | 5,456.35 | 0.22 | 4,562.96 | 1.12 | 893.04 | 0.15 | 6,805.11 | automerge |
| class | snapshot | 5,000 | 250 | 0.13 | 7,992.52 | 2.57 | 389.84 | 4.72 | 211.87 | 14.98 | 66.77 | crlist |
| class | snapshot / tombstoned state 50% deleted | 5,000 | 250 | 0.05 | 18,232.98 | 1.28 | 780.2 | 2.27 | 439.59 | 14.91 | 67.07 | crlist |
| class | snapshot / after garbage collection | 5,000 | 250 | 0.1 | 10,439.58 | 0.13 | 7,532.72 | 1.02 | 982.77 | 0.06 | 17,893.03 | automerge |
| class | acknowledge | 5,000 | 250 | 0.01 | 111,483.66 | n/a | n/a | n/a | n/a | n/a | n/a | n/a |
| class | acknowledge / 50% deleted state | 5,000 | 250 | 0.01 | 173,681.07 | n/a | n/a | n/a | n/a | n/a | n/a | n/a |
| class | acknowledge / 90% deleted state | 5,000 | 250 | 0.01 | 170,874.27 | n/a | n/a | n/a | n/a | n/a | n/a | n/a |
| class | garbage collect | 5,000 | 250 | 0.1 | 10,233.85 | 0.13 | 7,570.24 | 0.97 | 1,034.15 | 0.06 | 16,923.35 | automerge |
| class | garbage collect / no eligible tombstones | 5,000 | 250 | 0.09 | 10,897.23 | 0.2 | 4,968.98 | 1.01 | 990.27 | 0.06 | 17,077.37 | automerge |
| class | garbage collect / 90% eligible tombstones | 5,000 | 250 | 0.08 | 12,353.87 | 0.2 | 4,911.77 | 1.02 | 980.62 | 0.06 | 16,425.07 | automerge |
| class | merge ordered deltas | 5,000 | 250 | 0 | 201,543.5 | 0.01 | 112,821.84 | 0 | 328,117.58 | 2.7 | 371.03 | json-joy |
| class | merge shuffled gossip | 5,000 | 250 | 0.9 | 1,114.06 | 0.31 | 3,204.39 | n/a | n/a | 0.66 | 1,512.7 | yjs |
| class | merge / duplicate delta ignored | 5,000 | 250 | 0 | 541,524.07 | 0.01 | 77,023.59 | 0 | 494,251.85 | 0.03 | 33,320.15 | crlist |
| class | merge / concurrent prepends same head | 5,000 | 2 | 0.05 | 19,204.36 | 0.19 | 5,170.76 | n/a | n/a | 8.04 | 124.44 | crlist |
| class | merge / concurrent appends same tail | 5,000 | 2 | 0.02 | 55,090.35 | 0.02 | 52,554.13 | n/a | n/a | 7.74 | 129.15 | crlist |
| class | merge / concurrent inserts same middle position | 5,000 | 2 | 0.06 | 15,815.78 | 0.02 | 41,587.82 | n/a | n/a | 13.86 | 72.17 | yjs |
| class | merge / forked replicas rejoin after 250 ops each | 5,000 | 500 | 0.01 | 70,960.18 | 0.01 | 138,083.75 | n/a | n/a | 2.78 | 360.23 | yjs |
| latency | append tail write to remote visible | 5,000 | 250 | 0.08 | 11,841.24 | 0.16 | 6,275.4 | 8.7 | 114.91 | 4.87 | 205.44 | crlist |
| latency | prepend head write to remote visible | 5,000 | 250 | 0.01 | 164,406.73 | 0.02 | 64,180.65 | 0.01 | 83,945.13 | 4.93 | 202.95 | crlist |
| latency | middle insert write to remote visible | 5,000 | 250 | 0.04 | 24,643.88 | 0.09 | 11,504.85 | 2.8 | 357.56 | 4.96 | 201.43 | crlist |
| latency | head insert write to remote visible | 5,000 | 250 | 0 | 225,165.38 | 0.01 | 71,598.34 | 0.01 | 94,205.81 | 4.91 | 203.71 | crlist |
| latency | overwrite head write to remote visible | 5,000 | 250 | 0.01 | 128,276.17 | 0.03 | 37,212.03 | 0.01 | 101,898.08 | 4.92 | 203.17 | crlist |
| latency | overwrite middle write to remote visible | 5,000 | 250 | 0.04 | 24,712.04 | 0.09 | 11,752.56 | 1.64 | 608.44 | 5.06 | 197.66 | crlist |
| latency | overwrite tail write to remote visible | 5,000 | 250 | 0.07 | 14,215.92 | 0.15 | 6,581.6 | 3.37 | 296.8 | 4.92 | 203.08 | crlist |
| latency | head delete to remote hidden | 5,000 | 250 | 0.62 | 1,605.02 | 0.34 | 2,924.78 | 6.43 | 155.43 | 1.85 | 541.19 | yjs |
| latency | middle delete to remote hidden | 5,000 | 250 | 0.7 | 1,433 | 0.34 | 2,961.52 | 6.35 | 157.51 | 2.05 | 486.67 | yjs |
| latency | tail delete to remote hidden | 5,000 | 250 | 0.23 | 4,362.02 | 0.29 | 3,505.5 | 6.47 | 154.66 | 1.78 | 561.82 | crlist |
| latency | append tail write to 10 remotes visible | 5,000 | 2,500 | 0.11 | 9,490.35 | 0.14 | 7,185.33 | 12.85 | 77.79 | 3.39 | 295.2 | crlist |
| latency | prepend head write to 10 remotes visible | 5,000 | 2,500 | 0 | 281,634.32 | 0.01 | 164,537.97 | 0.01 | 70,802.35 | 3.33 | 299.88 | crlist |
| latency | middle insert write to 10 remotes visible | 5,000 | 2,500 | 0.04 | 23,793.02 | 0.08 | 12,655.13 | 4.69 | 213.2 | 3.44 | 291.07 | crlist |
| latency | overwrite middle write to 10 remotes visible | 5,000 | 2,500 | 0.05 | 18,970.45 | 0.08 | 13,168.58 | 3.27 | 305.56 | 3.37 | 296.7 | crlist |
| latency | delete middle to 10 remotes hidden | 5,000 | 2,500 | 0.75 | 1,330.58 | 0.33 | 2,998.47 | 11.88 | 84.17 | 1.63 | 615.22 | yjs |
| latency | out-of-order write delivery to remote visible | 5,000 | 250 | 1.43 | 700.66 | 118.75 | 8.42 | n/a | n/a | 16.05 | 62.3 | crlist |
| latency | out-of-order delete delivery to remote convergence | 5,000 | 165 | 2.27 | 441.38 | 0.32 | 3,111.7 | 9.19 | 108.8 | 6.68 | 149.75 | yjs |
| latency | out-of-order append delivery to convergence | 5,000 | 250 | 1.31 | 764.8 | 21.56 | 46.38 | n/a | n/a | 16.39 | 61.03 | crlist |
| latency | out-of-order prepend delivery to convergence | 5,000 | 250 | 1.35 | 743.48 | 22.01 | 45.43 | 0.05 | 19,474.79 | 16.03 | 62.37 | json-joy |
| latency | out-of-order middle insert delivery to convergence | 5,000 | 250 | 1.3 | 766.84 | 118.35 | 8.45 | n/a | n/a | 16.79 | 59.57 | crlist |
| latency | out-of-order overwrite delivery to convergence | 5,000 | 129 | 1.77 | 565.77 | n/a | n/a | 271.5 | 3.68 | 77.58 | 12.89 | crlist |
| latency | offline burst 1,000 ops then sync | 5,000 | 1,000 | 0 | 254,652.44 | 0.02 | 57,186.16 | 0 | 298,472.45 | 2.83 | 352.91 | json-joy |
| latency | forked replicas mixed ops then converge | 5,000 | 500 | 0 | 372,306.92 | 0.01 | 108,460.34 | n/a | n/a | 2.82 | 354.27 | crlist |
| latency | duplicate shuffled gossip to convergence | 5,000 | 500 | 0.47 | 2,110.97 | 0.15 | 6,812.81 | n/a | n/a | 0.37 | 2,691.03 | yjs |
| latency | remote snapshot hydrate then apply pending deltas | 5,000 | 250 | 0.02 | 59,053.17 | 0.03 | 34,882.84 | 0.1 | 9,722.86 | 0.64 | 1,573.13 | crlist |
| workload | local app session | 5,000 | 250 | 0.01 | 164,366.74 | 0.01 | 104,290.47 | 0.01 | 196,385.87 | 1.1 | 912.7 | json-joy |
| workload | read heavy session | 5,000 | 250 | 0 | 3,068,990.92 | 0 | 5,445,673.96 | 0 | 632,989.92 | 0 | 2,986,393.99 | yjs |
| workload | write heavy session | 5,000 | 250 | 0 | 205,837.72 | 0.01 | 93,940.46 | 0.01 | 170,898.8 | 1.11 | 901.39 | crlist |
| workload | append tail heavy session | 5,000 | 250 | 0 | 316,731.53 | 0.02 | 64,280.26 | 0.01 | 151,092.46 | 1.37 | 728.18 | crlist |
| workload | prepend head heavy session | 5,000 | 250 | 0.01 | 187,416.97 | 0.01 | 82,644.22 | 0 | 202,990.79 | 1.41 | 711.66 | json-joy |
| workload | insert middle heavy session | 5,000 | 250 | 0.01 | 152,847.43 | 0.01 | 107,965.66 | 0 | 224,269.35 | 1.43 | 700.41 | json-joy |
| workload | overwrite heavy session | 5,000 | 250 | 0 | 228,845.94 | 0.01 | 122,887.2 | 0 | 261,249.67 | 1.14 | 876.28 | json-joy |
| workload | delete heavy session | 5,000 | 250 | 0 | 231,550.3 | 0.01 | 128,305.14 | 0.08 | 11,852.4 | 0.16 | 6,084.66 | crlist |
| workload | balanced append prepend insert overwrite delete session | 5,000 | 250 | 0.01 | 197,565.36 | 0.02 | 62,592.59 | 0 | 250,669.79 | 1.24 | 804.5 | json-joy |
| workload | random edit session | 5,000 | 250 | 0.01 | 113,861.86 | 0.02 | 53,220.02 | 0.01 | 103,165.62 | 1.09 | 913.42 | crlist |
| workload | text editing session | 5,000 | 250 | 0.01 | 159,823.76 | 0.01 | 122,022.77 | 0 | 234,132.38 | 1.37 | 727.39 | json-joy |
| workload | collaborative offline session | 5,000 | 500 | 0 | 379,841.65 | 0.01 | 152,686.95 | n/a | n/a | 2.83 | 353.72 | crlist |
| workload | sync and cleanup session | 5,000 | 252 | 0 | 284,674.03 | 0.01 | 75,390.12 | n/a | n/a | 2.84 | 352.07 | crlist |
| workload | long lived tombstoned session | 5,000 | 250 | 0 | 373,476.59 | 0.01 | 82,341.07 | 0 | 227,826.55 | 1.6 | 624.73 | crlist |
| workload | sparse visible session | 5,000 | 250 | 0 | 441,029.89 | 0.11 | 9,487.19 | 0.01 | 116,355.21 | 0.81 | 1,233.6 | crlist |
| workload | post-gc edit session | 5,000 | 250 | 0 | 695,721.87 | 0.01 | 105,147.96 | 0 | 245,365.05 | 1.39 | 720.94 | crlist |

## License

Apache-2.0
