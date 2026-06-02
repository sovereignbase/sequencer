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
| crud | create / empty list | 5,000 | 250 | 0.01 | 74,281.09 | 0.11 | 8,977.83 | 0.02 | 55,146.58 | 0.36 | 2,801.97 | crlist |
| crud | create / hydrate snapshot | 5,000 | 250 | 3.72 | 268.53 | 5.8 | 172.3 | 12.67 | 78.9 | 129.62 | 7.71 | crlist |
| crud | create / hydrate clean snapshot | 5,000 | 250 | 3.57 | 279.76 | 5.77 | 173.36 | 12.31 | 81.24 | 128.93 | 7.76 | crlist |
| crud | create / hydrate tombstoned snapshot | 5,000 | 250 | 1.95 | 512.33 | 2.91 | 344.04 | 6.1 | 163.89 | 113.13 | 8.84 | crlist |
| crud | read / head | 5,000 | 250 | 0 | 1,848,948.32 | 0 | 1,599,273.29 | 0 | 207,393.15 | 0 | 4,007,951.78 | automerge |
| crud | read / middle | 5,000 | 250 | 0 | 5,180,273.52 | 0 | 1,594,072.6 | 0 | 415,809.41 | 0 | 8,870,910.51 | automerge |
| crud | read / tail | 5,000 | 250 | 0 | 1,765,873.44 | 0 | 942,535.5 | 0 | 495,493.98 | 0 | 3,183,658.92 | automerge |
| crud | read / random indexed reads | 5,000 | 250 | 0 | 1,565,464.6 | 0 | 664,612.57 | 0 | 220,568.25 | 0 | 1,238,206.09 | crlist |
| crud | read / sequential indexed reads from head | 5,000 | 250 | 0 | 2,806,277.08 | 0 | 2,922,985.19 | 0 | 356,367 | 0 | 1,347,461.92 | yjs |
| crud | read / sequential indexed reads from middle | 5,000 | 250 | 0 | 11,934,313.54 | 0 | 8,112,405.49 | 0 | 831,562.11 | 0 | 11,860,145.17 | crlist |
| crud | read / sequential indexed reads from tail | 5,000 | 250 | 0 | 9,314,456.04 | 0 | 8,008,200.4 | 0 | 770,910.17 | 0 | 13,917,497.08 | automerge |
| crud | read / full iteration visible values | 5,000 | 250 | 0.35 | 2,822.33 | 0.15 | 6,678.78 | 1.03 | 973.43 | 0.05 | 19,693.18 | automerge |
| crud | read / collect visible values to array | 5,000 | 250 | 0.36 | 2,744.02 | 0.13 | 7,764.71 | 0.97 | 1,034.34 | 0.08 | 12,530.08 | automerge |
| crud | read / visible sparse over deleted entries | 5,000 | 250 | 0 | 8,438,818.57 | 0.02 | 40,762.49 | 0.02 | 51,880.45 | 0 | 3,677,227.66 | crlist |
| crud | find / head | 5,000 | 250 | 0 | 1,246,366.84 | 0 | 1,764,626.99 | 0 | 905,885.72 | 0 | 1,332,778.9 | yjs |
| crud | find / middle | 5,000 | 250 | 0.02 | 58,669.17 | 0.07 | 14,656.43 | 0.49 | 2,024.97 | 0.02 | 46,878.89 | crlist |
| crud | find / tail | 5,000 | 250 | 0.03 | 38,126.84 | 0.12 | 8,121.29 | 0.89 | 1,128.34 | 0.04 | 23,776.87 | crlist |
| crud | find / missing value | 5,000 | 250 | 0.15 | 6,685.38 | 0.26 | 3,835.27 | 1.79 | 557.96 | 0.06 | 18,161.05 | automerge |
| crud | append / single after tail | 5,000 | 250 | 0 | 295,412.95 | 0.02 | 48,610.52 | 0.01 | 99,376.99 | 1.49 | 669.89 | crlist |
| crud | append / batch after tail | 5,000 | 25,000 | 0 | 1,914,810.39 | 0 | 658,980.18 | 0.01 | 160,136.11 | 0.14 | 7,114.02 | crlist |
| crud | append / batch after deleted tail | 5,000 | 25,000 | 0 | 1,915,996.87 | 0 | 670,241.75 | 0.01 | 189,097.22 | 0.14 | 7,174.24 | crlist |
| crud | append / batch after garbage collection | 5,000 | 25,000 | 0 | 2,039,129.59 | 0 | 840,770.03 | 0 | 239,497.41 | 0.14 | 6,932.24 | crlist |
| crud | prepend / single before head | 5,000 | 250 | 0.01 | 195,068.21 | 0.01 | 97,167.45 | 0.01 | 111,177.47 | 1.55 | 646.02 | crlist |
| crud | prepend / batch before head | 5,000 | 25,000 | 0 | 1,421,516.16 | 0 | 1,082,925.26 | 0 | 255,300.23 | 0.14 | 7,126.52 | crlist |
| crud | prepend / batch before deleted head | 5,000 | 25,000 | 0 | 2,000,545.43 | 0 | 810,614.25 | 0 | 250,109.09 | 0.14 | 7,113.7 | crlist |
| crud | prepend / batch after garbage collection | 5,000 | 25,000 | 0 | 1,990,045.79 | 0 | 1,168,639.6 | 0.01 | 178,378.92 | 0.14 | 7,370.46 | crlist |
| crud | insert / single before head | 5,000 | 250 | 0 | 456,555.96 | 0.01 | 101,763.27 | 0.01 | 195,230.44 | 1.53 | 654.09 | crlist |
| crud | insert / single after head | 5,000 | 250 | 0 | 229,931.15 | 0.01 | 77,469.58 | 0.01 | 127,601.8 | 1.54 | 650.93 | crlist |
| crud | insert / single before middle | 5,000 | 250 | 0 | 264,413.72 | 0.02 | 63,828.71 | 0.07 | 13,620.35 | 1.49 | 670.7 | crlist |
| crud | insert / single after middle | 5,000 | 250 | 0 | 236,479.3 | 0.01 | 93,906.1 | 0.01 | 129,424.51 | 1.49 | 669.8 | crlist |
| crud | insert / single before tail | 5,000 | 250 | 0 | 207,847.32 | 0.01 | 101,366.83 | 0 | 230,522.04 | 1.48 | 674.01 | json-joy |
| crud | insert / single after tail | 5,000 | 250 | 0 | 446,419.8 | 0.01 | 76,645.1 | 0 | 285,053.29 | 1.47 | 678.04 | crlist |
| crud | insert / batch before head | 5,000 | 25,000 | 0 | 2,028,593.27 | 0 | 1,344,062.18 | 0 | 276,519.24 | 0.14 | 7,129.28 | crlist |
| crud | insert / batch after head | 5,000 | 25,000 | 0 | 1,986,093.85 | 0 | 1,146,558.1 | 0 | 282,681.4 | 0.14 | 7,160.13 | crlist |
| crud | insert / batch before middle | 5,000 | 25,000 | 0 | 1,180,125.09 | 0 | 889,532.23 | 0 | 284,568.15 | 0.14 | 6,991.44 | crlist |
| crud | insert / batch after middle | 5,000 | 25,000 | 0 | 1,391,272.83 | 0 | 1,152,928.76 | 0 | 279,523.48 | 0.14 | 6,988.9 | crlist |
| crud | insert / batch before tail | 5,000 | 25,000 | 0 | 1,294,823.15 | 0 | 744,545.69 | 0 | 225,482.98 | 0.14 | 7,050.39 | crlist |
| crud | insert / batch after tail | 5,000 | 25,000 | 0 | 1,866,050.84 | 0 | 728,108.33 | 0 | 202,580.74 | 0.14 | 7,048.7 | crlist |
| crud | insert / repeated before head | 5,000 | 250 | 0.04 | 27,256.21 | 0.01 | 128,975.74 | 0 | 224,285.65 | 1.53 | 652.83 | json-joy |
| crud | insert / repeated before middle | 5,000 | 250 | 0 | 360,959.75 | 0.01 | 96,355.15 | 0 | 237,474.41 | 1.51 | 660.7 | crlist |
| crud | insert / repeated before tail | 5,000 | 250 | 0 | 347,837.7 | 0.04 | 22,292.46 | 0 | 264,652.48 | 1.44 | 693.57 | crlist |
| crud | insert / random positions | 5,000 | 250 | 0 | 328,981.13 | 0.01 | 83,435.32 | 0.08 | 12,140.22 | 1.52 | 659.89 | crlist |
| crud | insert / alternating head and tail | 5,000 | 250 | 0 | 501,589.03 | 0.01 | 77,059.56 | 0.01 | 194,183.66 | 1.54 | 648.4 | crlist |
| crud | overwrite / head | 5,000 | 250 | 0.01 | 175,268.62 | 0.02 | 59,229.66 | 0.01 | 80,560.6 | 1.64 | 611.59 | crlist |
| crud | overwrite / middle | 5,000 | 250 | 0 | 250,613 | 0.02 | 61,863.06 | 0.01 | 116,353.64 | 1.61 | 621.71 | crlist |
| crud | overwrite / tail | 5,000 | 250 | 0 | 225,161.53 | 0.02 | 58,887.36 | 0.01 | 114,780.25 | 1.53 | 652.84 | crlist |
| crud | overwrite / random | 5,000 | 250 | 0.02 | 60,670.76 | 0.03 | 32,751.21 | 0.01 | 110,090.55 | 1.73 | 577.6 | json-joy |
| crud | overwrite / same head repeatedly | 5,000 | 250 | 0 | 350,786.11 | 0.01 | 85,072.3 | 0 | 217,534.12 | 1.64 | 610.47 | crlist |
| crud | overwrite / same middle repeatedly | 5,000 | 250 | 0.01 | 193,399.21 | 0.01 | 68,463.87 | 0 | 207,930.81 | 1.57 | 637.21 | json-joy |
| crud | overwrite / same tail repeatedly | 5,000 | 250 | 0 | 555,324.79 | 0.01 | 78,373.52 | 0 | 211,331.24 | 1.53 | 653.08 | crlist |
| crud | overwrite / random visible entries | 5,000 | 250 | 0.01 | 70,471.27 | 0.04 | 26,314.73 | 0.01 | 75,345.82 | 1.76 | 568.69 | json-joy |
| crud | overwrite / after insert | 5,000 | 250 | 0 | 391,360.02 | 0.01 | 81,484.27 | 0.01 | 128,049.04 | 1.58 | 631.33 | crlist |
| crud | overwrite / after delete | 5,000 | 250 | 0 | 348,736.81 | 0.01 | 82,966.73 | 0.01 | 135,219.63 | 1.55 | 644.78 | crlist |
| crud | delete / head | 5,000 | 250 | 0.01 | 167,699.47 | 0.01 | 76,340.98 | 0.01 | 91,098.64 | 0.19 | 5,236.55 | crlist |
| crud | delete / middle | 5,000 | 250 | 0 | 327,766.55 | 0.01 | 92,649.55 | 0.01 | 160,597.99 | 0.19 | 5,293.6 | crlist |
| crud | delete / tail | 5,000 | 250 | 0 | 618,074.48 | 0.01 | 82,084.39 | 0 | 248,155.95 | 0.19 | 5,330.36 | crlist |
| crud | delete / range from head | 5,000 | 5,000 | 0 | 2,016,796.69 | 0 | 5,501,288.4 | 0 | 547,950.61 | 0.01 | 83,733.11 | yjs |
| crud | delete / range from middle | 5,000 | 5,000 | 0 | 1,394,807.52 | 0 | 8,266,471.36 | 0 | 618,305.15 | 0.01 | 73,856.26 | yjs |
| crud | delete / range from tail | 5,000 | 5,000 | 0 | 1,618,960.75 | 0 | 6,637,038.92 | 0 | 780,487.8 | 0.01 | 76,608.01 | yjs |
| crud | delete / every other entry | 5,000 | 2,500 | 0 | 270,914.43 | 0.07 | 15,107.71 | 0.07 | 14,790.24 | 0.18 | 5,443.77 | crlist |
| crud | delete / all entries from head one by one | 5,000 | 5,000 | 0 | 368,628.07 | 0.01 | 111,638.8 | 0.01 | 103,532.83 | 0.17 | 5,802.03 | crlist |
| crud | delete / all entries from middle outward | 5,000 | 5,000 | 0 | 368,982.94 | 0.01 | 141,445.19 | 0 | 252,637.37 | 0.17 | 5,829.21 | crlist |
| crud | delete / all entries from tail one by one | 5,000 | 5,000 | 0 | 771,184.48 | 0.01 | 124,171.27 | 0 | 388,739.85 | 0.17 | 5,865.06 | crlist |
| crud | delete / all entries in random order | 5,000 | 5,000 | 0.1 | 9,953.21 | 9.47 | 105.54 | 5.56 | 179.72 | 0.2 | 5,053.65 | crlist |
| crud | delete / already deleted head | 5,000 | 250 | 0 | 327,645.84 | 0 | 285,141.07 | 0 | 327,684.92 | 0.02 | 48,049.77 | json-joy |
| crud | delete / already deleted middle | 5,000 | 250 | 0 | 363,992.68 | 0 | 276,539.19 | 0 | 1,133,375.65 | 0.02 | 52,214.77 | json-joy |
| crud | delete / already deleted tail | 5,000 | 250 | 0 | 1,097,579.18 | 0 | 261,625.05 | 0 | 553,109.58 | 0.03 | 30,216.21 | crlist |
| crud | mixed / append overwrite delete tail | 5,000 | 250 | 0 | 291,037.1 | 0.02 | 59,649.09 | 0.01 | 161,250.79 | 1.28 | 783.11 | crlist |
| crud | mixed / prepend overwrite delete head | 5,000 | 250 | 0 | 269,622.01 | 0.02 | 65,456.54 | 0.01 | 136,494.7 | 1.33 | 752.14 | crlist |
| crud | mixed / insert overwrite delete middle | 5,000 | 250 | 0 | 209,492.88 | 0.01 | 72,312.77 | 0.01 | 133,733.96 | 1.29 | 773.67 | crlist |
| crud | mixed / append prepend insert overwrite delete | 5,000 | 250 | 0 | 292,278.01 | 0.01 | 94,085.49 | 0 | 219,560.95 | 1.32 | 758.99 | crlist |
| mags | snapshot | 5,000 | 250 | 0.14 | 6,990.69 | 2.68 | 372.73 | 4.8 | 208.34 | 14.4 | 69.45 | crlist |
| mags | snapshot / clean state | 5,000 | 250 | 0.12 | 8,530.38 | 2.55 | 392.78 | 4.72 | 211.67 | 14.3 | 69.94 | crlist |
| mags | snapshot / tombstoned state 50% deleted | 5,000 | 250 | 0.08 | 12,391.59 | 1.28 | 779.69 | 2.26 | 441.64 | 14.37 | 69.57 | crlist |
| mags | snapshot / tombstoned state 90% deleted | 5,000 | 250 | 0.01 | 89,898.31 | 0.26 | 3,894.2 | 0.43 | 2,323.65 | 14.27 | 70.05 | crlist |
| mags | snapshot / after garbage collection | 5,000 | 250 | 0.07 | 15,304.06 | 1.3 | 768.7 | 2.29 | 436.88 | 14.31 | 69.89 | crlist |
| mags | acknowledge | 5,000 | 250 | 0 | 3,582,688.45 | n/a | n/a | n/a | n/a | n/a | n/a | n/a |
| mags | acknowledge / clean state | 5,000 | 250 | 0 | 4,957,956.53 | n/a | n/a | n/a | n/a | n/a | n/a | n/a |
| mags | acknowledge / 50% deleted state | 5,000 | 250 | 0 | 2,786,850.52 | n/a | n/a | n/a | n/a | n/a | n/a | n/a |
| mags | acknowledge / 90% deleted state | 5,000 | 250 | 0 | 1,439,984.33 | n/a | n/a | n/a | n/a | n/a | n/a | n/a |
| mags | garbage collect | 5,000 | 250 | 0 | 2,177,814.17 | n/a | n/a | n/a | n/a | n/a | n/a | n/a |
| mags | garbage collect / no eligible tombstones | 5,000 | 250 | 0 | 4,652,028.28 | n/a | n/a | n/a | n/a | n/a | n/a | n/a |
| mags | garbage collect / 50% eligible tombstones | 5,000 | 250 | 0 | 762,522.91 | n/a | n/a | n/a | n/a | n/a | n/a | n/a |
| mags | garbage collect / 90% eligible tombstones | 5,000 | 250 | 0 | 685,799.56 | n/a | n/a | n/a | n/a | n/a | n/a | n/a |
| mags | garbage collect / partial frontiers 2 replicas | 5,000 | 250 | 0 | 5,171,700.46 | n/a | n/a | n/a | n/a | n/a | n/a | n/a |
| mags | garbage collect / partial frontiers 10 replicas | 5,000 | 250 | 0 | 7,074,937.74 | n/a | n/a | n/a | n/a | n/a | n/a | n/a |
| mags | post-gc read / full iteration visible values | 5,000 | 250 | 0.21 | 4,778.71 | 0.07 | 14,911.36 | 0.45 | 2,242.98 | 0.02 | 40,398.94 | automerge |
| mags | merge ordered deltas | 5,000 | 250 | 0.01 | 120,636.98 | 0.02 | 64,173.98 | 0 | 308,129.57 | 2.63 | 380.9 | json-joy |
| mags | merge shuffled gossip | 5,000 | 250 | 0.93 | 1,076.8 | 0.49 | 2,048.87 | n/a | n/a | 0.68 | 1,480.81 | yjs |
| mags | merge / append head delta into equal replica | 5,000 | 1 | 0.04 | 27,398.76 | 0.05 | 21,187.34 | 0.04 | 27,857.48 | 2.93 | 341.88 | json-joy |
| mags | merge / append tail delta into equal replica | 5,000 | 1 | 0.07 | 15,304.09 | 0.04 | 26,441.04 | 0.01 | 101,132.69 | 2.75 | 363.71 | json-joy |
| mags | merge / prepend head delta into equal replica | 5,000 | 1 | 0.02 | 48,033.05 | 0.02 | 48,079.23 | 0.01 | 132,030.63 | 2.85 | 351.27 | json-joy |
| mags | merge / insert middle delta into equal replica | 5,000 | 1 | 0.04 | 27,270.99 | 0.03 | 30,128.65 | 0.01 | 75,221.9 | 2.87 | 348.01 | json-joy |
| mags | merge / overwrite head delta into equal replica | 5,000 | 1 | 0.03 | 37,217.61 | 0.02 | 51,161.36 | 0.01 | 110,913.93 | 2.87 | 348.85 | json-joy |
| mags | merge / overwrite middle delta into equal replica | 5,000 | 1 | 0.06 | 16,099.17 | 0.02 | 47,192.07 | 0.01 | 98,145.06 | 3.06 | 326.99 | json-joy |
| mags | merge / overwrite tail delta into equal replica | 5,000 | 1 | 0.02 | 57,201.69 | 0.02 | 49,412 | 0.01 | 107,793.47 | 2.84 | 352.16 | json-joy |
| mags | merge / delete head delta into equal replica | 5,000 | 1 | 0.02 | 47,418.09 | 0.01 | 93,196.64 | 0.01 | 68,273.37 | 1.5 | 665.54 | yjs |
| mags | merge / delete middle delta into equal replica | 5,000 | 1 | 0.09 | 11,220.2 | 0.03 | 38,125.74 | 0.02 | 58,438.52 | 1.52 | 657.75 | json-joy |
| mags | merge / delete tail delta into equal replica | 5,000 | 1 | 0.01 | 91,987.86 | 0.01 | 84,588.06 | 0.01 | 122,925.63 | 1.48 | 677.18 | json-joy |
| mags | merge / duplicate delta ignored | 5,000 | 250 | 0 | 875,377.73 | 0.02 | 47,306.99 | 0.01 | 136,330.64 | 0.03 | 35,117.24 | crlist |
| mags | merge / old delta ignored after merge | 5,000 | 250 | 0 | 819,247.73 | 0.01 | 69,386.33 | 0 | 425,806.61 | 0.03 | 39,640.37 | crlist |
| mags | merge / ordered 1,000 append deltas | 5,000 | 1,000 | 0 | 302,654.92 | 0.01 | 70,119.23 | 0 | 344,968.43 | 2.9 | 345.18 | json-joy |
| mags | merge / ordered 1,000 prepend deltas | 5,000 | 1,000 | 0 | 286,374.42 | 0.01 | 138,138.66 | 0.01 | 147,503.33 | 2.95 | 339.39 | crlist |
| mags | merge / ordered 1,000 middle insert deltas | 5,000 | 1,000 | 0 | 358,159.78 | 0.01 | 101,608.37 | 0.01 | 68,512.1 | 2.97 | 336.42 | crlist |
| mags | merge / shuffled 1,000 mixed deltas | 5,000 | 1,000 | 0.99 | 1,015.19 | 1.01 | 993.79 | n/a | n/a | 0.8 | 1,246.61 | automerge |
| mags | merge / reverse ordered 1,000 mixed deltas | 5,000 | 1,000 | 0.27 | 3,662.57 | 0.94 | 1,060.05 | n/a | n/a | 0.8 | 1,245.04 | crlist |
| mags | merge / concurrent prepends same head | 5,000 | 2 | 0.07 | 14,165.11 | 0.1 | 10,277.91 | n/a | n/a | 13.22 | 75.66 | crlist |
| mags | merge / concurrent appends same tail | 5,000 | 2 | 0.02 | 59,769.29 | 0.03 | 38,785.25 | n/a | n/a | 7.44 | 134.39 | crlist |
| mags | merge / concurrent inserts same middle position | 5,000 | 2 | 0.04 | 23,065.12 | 0.03 | 33,260.71 | n/a | n/a | 13.15 | 76.06 | yjs |
| mags | merge / concurrent overwrites same head | 5,000 | 2 | 0.02 | 47,837.73 | 0.03 | 35,969.28 | n/a | n/a | 13.26 | 75.4 | crlist |
| mags | merge / concurrent overwrites same middle | 5,000 | 2 | 0.06 | 16,802.2 | 0.03 | 34,448.31 | n/a | n/a | 9.39 | 106.49 | yjs |
| mags | merge / concurrent overwrites same tail | 5,000 | 2 | 0.02 | 56,107.28 | 0.03 | 35,756.43 | n/a | n/a | 7.4 | 135.08 | crlist |
| mags | merge / concurrent deletes same head | 5,000 | 2 | 0.02 | 40,467.81 | 0.01 | 73,475.39 | 0.02 | 55,161.76 | 6.63 | 150.88 | yjs |
| mags | merge / concurrent deletes same middle | 5,000 | 2 | 0.09 | 11,670.11 | 0.02 | 42,401.63 | 0.02 | 56,503.56 | 10.4 | 96.19 | json-joy |
| mags | merge / concurrent deletes same tail | 5,000 | 2 | 0.01 | 107,152.42 | 0.02 | 65,863.14 | 0.01 | 75,789.15 | 10.38 | 96.34 | crlist |
| mags | merge / concurrent overwrite delete same entry | 5,000 | 2 | 0.11 | 9,323.62 | 0.05 | 21,513.94 | 0.07 | 14,153.98 | 5.93 | 168.55 | yjs |
| mags | merge / forked replicas rejoin after 250 ops each | 5,000 | 500 | 0 | 227,236.68 | 0.01 | 107,485.88 | n/a | n/a | 2.74 | 365.11 | crlist |
| mags | merge / 10 replicas gossip convergence | 5,000 | 100 | 0 | 239,093.17 | 0.01 | 105,506.27 | n/a | n/a | 5.3 | 188.77 | crlist |
| mags | merge / snapshot merge into stale replica | 5,000 | 5,350 | 0 | 735,597.82 | 0 | 581,007.55 | 0.01 | 118,279.14 | 0.03 | 36,823.03 | crlist |
| class | constructor / hydrate snapshot | 5,000 | 250 | 3.67 | 272.66 | 5.76 | 173.46 | 12.67 | 78.9 | 132.2 | 7.56 | crlist |
| class | read / head | 5,000 | 250 | 0 | 3,384,461.26 | 0 | 3,880,240.26 | 0 | 2,161,040.76 | 0 | 3,592,005.63 | yjs |
| class | read / middle | 5,000 | 250 | 0 | 10,737,447.92 | 0 | 11,075,668.97 | 0 | 4,730,547.99 | 0 | 12,008,838.51 | automerge |
| class | read / tail | 5,000 | 250 | 0 | 2,697,977.6 | 0 | 3,456,189.34 | 0 | 2,541,089.42 | 0 | 4,077,970.8 | automerge |
| class | find near head | 5,000 | 250 | 0 | 978,377.85 | n/a | n/a | n/a | n/a | 0 | 1,536,268.22 | automerge |
| class | find near middle | 5,000 | 250 | 0.03 | 34,221.57 | n/a | n/a | n/a | n/a | 0.02 | 46,834.33 | automerge |
| class | find near tail | 5,000 | 250 | 0.08 | 13,260.95 | n/a | n/a | n/a | n/a | 0.04 | 22,501.61 | automerge |
| class | iterate visible values | 5,000 | 250 | 0.11 | 9,195.64 | 0.15 | 6,626.44 | 1.01 | 993.74 | 0.06 | 17,503.57 | automerge |
| class | collect visible values to array | 5,000 | 250 | 0.09 | 11,183.71 | 0.15 | 6,884.44 | 0.93 | 1,075.76 | 0.06 | 17,126.58 | automerge |
| class | append / single after tail | 5,000 | 250 | 0 | 400,557.58 | 0.01 | 77,745.12 | 0.01 | 165,387.78 | 1.51 | 660.08 | crlist |
| class | append / batch after tail | 5,000 | 25,000 | 0 | 2,054,841.58 | 0 | 732,599.38 | 0.01 | 173,826.38 | 0.14 | 6,900.29 | crlist |
| class | prepend / single before head | 5,000 | 250 | 0 | 269,444.75 | 0.01 | 135,024.93 | 0.01 | 189,201.01 | 1.59 | 628.52 | crlist |
| class | prepend / batch before head | 5,000 | 25,000 | 0 | 2,260,723.04 | 0 | 1,328,824.54 | 0 | 276,832.8 | 0.14 | 6,925.85 | crlist |
| class | insert / single before middle | 5,000 | 250 | 0 | 245,260.58 | 0.01 | 103,290.97 | 0 | 237,164.87 | 1.56 | 642.9 | crlist |
| class | insert / batch before middle | 5,000 | 25,000 | 0 | 1,546,723.9 | 0 | 1,288,894.78 | 0 | 270,783.66 | 0.15 | 6,839.74 | crlist |
| class | overwrite / head | 5,000 | 250 | 0 | 249,662.71 | 0.01 | 78,829.71 | 0.01 | 182,265.03 | 1.68 | 596.22 | crlist |
| class | overwrite / middle | 5,000 | 250 | 0 | 305,795.81 | 0.01 | 80,563.66 | 0.01 | 195,629.63 | 1.62 | 615.96 | crlist |
| class | overwrite / tail | 5,000 | 250 | 0 | 207,236.36 | 0.02 | 48,772.06 | 0.01 | 199,895.41 | 1.58 | 631.65 | crlist |
| class | overwrite / random | 5,000 | 250 | 0.02 | 65,613.53 | 0.06 | 16,198.48 | 0.01 | 108,891.85 | 1.78 | 561.16 | json-joy |
| class | remove / head | 5,000 | 250 | 0 | 260,385.75 | 0.01 | 101,604.83 | 0.01 | 94,223.35 | 0.2 | 4,935.29 | crlist |
| class | remove / middle | 5,000 | 250 | 0 | 333,318.67 | 0.01 | 97,205.2 | 0.01 | 165,635.97 | 0.24 | 4,133.72 | crlist |
| class | remove / tail | 5,000 | 250 | 0 | 450,376.6 | 0.02 | 66,425.89 | 0 | 391,281.01 | 0.19 | 5,205.24 | crlist |
| class | remove / range from head | 5,000 | 5,000 | 0 | 1,939,698.65 | 0 | 6,916,365.92 | 0 | 226,303.14 | 0.01 | 81,419.05 | yjs |
| class | remove / range from middle | 5,000 | 5,000 | 0 | 997,684.77 | 0 | 5,320,303.56 | 0 | 929,297.56 | 0.01 | 73,072.33 | yjs |
| class | remove / range from tail | 5,000 | 5,000 | 0 | 1,499,666.32 | 0 | 6,924,037.77 | 0 | 330,721.43 | 0.01 | 78,795.97 | yjs |
| class | mixed / append overwrite remove tail | 5,000 | 250 | 0 | 302,404.6 | 0.01 | 81,893.05 | 0.01 | 186,990.82 | 1.12 | 890.26 | crlist |
| class | mixed / prepend overwrite remove head | 5,000 | 250 | 0 | 408,364.61 | 0.01 | 111,427.62 | 0 | 244,584.89 | 1.21 | 823.7 | crlist |
| class | mixed / insert overwrite remove middle | 5,000 | 250 | 0 | 398,670.04 | 0.01 | 103,280.26 | 0 | 268,392.68 | 1.17 | 857.57 | crlist |
| class | paste / insert 10,000 entries at cursor | 5,000 | 10,000 | 0 | 740,062.35 | 0 | 1,424,593.96 | 0.01 | 148,402.79 | 0.13 | 7,493.34 | yjs |
| class | render / join visible entries to string | 5,000 | 250 | 0.25 | 3,938.13 | 0.22 | 4,576.68 | 1.08 | 922.21 | 0.14 | 7,015.24 | automerge |
| class | snapshot | 5,000 | 250 | 0.13 | 7,985.94 | 2.7 | 370.15 | 4.57 | 218.86 | 14.36 | 69.64 | crlist |
| class | snapshot / tombstoned state 50% deleted | 5,000 | 250 | 0.06 | 16,767.09 | 1.36 | 735.4 | 2.22 | 449.95 | 14.3 | 69.94 | crlist |
| class | snapshot / after garbage collection | 5,000 | 250 | 0.07 | 13,886.29 | 0.15 | 6,697.45 | 0.92 | 1,089.26 | 0.06 | 17,819.47 | automerge |
| class | acknowledge | 5,000 | 250 | 0.01 | 110,961.83 | n/a | n/a | n/a | n/a | n/a | n/a | n/a |
| class | acknowledge / 50% deleted state | 5,000 | 250 | 0 | 204,943.73 | n/a | n/a | n/a | n/a | n/a | n/a | n/a |
| class | acknowledge / 90% deleted state | 5,000 | 250 | 0.01 | 173,388.48 | n/a | n/a | n/a | n/a | n/a | n/a | n/a |
| class | garbage collect | 5,000 | 250 | 0.08 | 13,256.96 | 0.15 | 6,533.84 | 0.91 | 1,102.45 | 0.06 | 17,234.52 | automerge |
| class | garbage collect / no eligible tombstones | 5,000 | 250 | 0.07 | 14,894.93 | 0.2 | 5,015.36 | 0.96 | 1,039.6 | 0.06 | 17,287.78 | automerge |
| class | garbage collect / 90% eligible tombstones | 5,000 | 250 | 0.06 | 16,386.64 | 0.2 | 5,044.08 | 0.96 | 1,039.3 | 0.06 | 17,635.47 | automerge |
| class | merge ordered deltas | 5,000 | 250 | 0 | 200,909.4 | 0.01 | 118,073.57 | 0 | 341,716.79 | 2.57 | 389.78 | json-joy |
| class | merge shuffled gossip | 5,000 | 250 | 0.86 | 1,165.54 | 0.37 | 2,702.02 | n/a | n/a | 0.64 | 1,556.73 | yjs |
| class | merge / duplicate delta ignored | 5,000 | 250 | 0 | 931,240.9 | 0.02 | 41,687.62 | 0 | 467,864.27 | 0.03 | 31,198.15 | crlist |
| class | merge / concurrent prepends same head | 5,000 | 2 | 0.05 | 19,039.46 | 0.04 | 25,094.73 | n/a | n/a | 7.6 | 131.59 | yjs |
| class | merge / concurrent appends same tail | 5,000 | 2 | 0.01 | 71,628.11 | 0.02 | 55,887.78 | n/a | n/a | 12.83 | 77.96 | crlist |
| class | merge / concurrent inserts same middle position | 5,000 | 2 | 0.04 | 25,205.42 | 0.02 | 41,728.39 | n/a | n/a | 13.21 | 75.68 | yjs |
| class | merge / forked replicas rejoin after 250 ops each | 5,000 | 500 | 0.01 | 76,660.65 | 0.01 | 132,527.88 | n/a | n/a | 2.65 | 376.93 | yjs |
| latency | append tail write to remote visible | 5,000 | 250 | 0.07 | 13,989.3 | 0.16 | 6,066.57 | 7.41 | 135.04 | 4.69 | 213.36 | crlist |
| latency | prepend head write to remote visible | 5,000 | 250 | 0.01 | 119,341.88 | 0.02 | 53,674.73 | 0.01 | 85,421.64 | 4.71 | 212.43 | crlist |
| latency | middle insert write to remote visible | 5,000 | 250 | 0.04 | 22,695.12 | 0.1 | 10,398.8 | 2.56 | 391.35 | 4.73 | 211.29 | crlist |
| latency | head insert write to remote visible | 5,000 | 250 | 0 | 237,865.75 | 0.01 | 66,767.12 | 0.01 | 96,172.34 | 4.67 | 214.34 | crlist |
| latency | overwrite head write to remote visible | 5,000 | 250 | 0.01 | 75,591.18 | 0.03 | 35,765.54 | 0.08 | 12,473.18 | 4.79 | 208.77 | crlist |
| latency | overwrite middle write to remote visible | 5,000 | 250 | 0.05 | 22,112.42 | 0.09 | 11,423.05 | 1.66 | 603.33 | 4.75 | 210.5 | crlist |
| latency | overwrite tail write to remote visible | 5,000 | 250 | 0.07 | 14,961.5 | 0.14 | 7,074.96 | 3.21 | 311.25 | 4.61 | 216.82 | crlist |
| latency | head delete to remote hidden | 5,000 | 250 | 0.63 | 1,584.48 | 0.31 | 3,182.88 | 6.22 | 160.77 | 1.79 | 557.68 | yjs |
| latency | middle delete to remote hidden | 5,000 | 250 | 0.64 | 1,565.97 | 0.31 | 3,180.34 | 6.14 | 162.76 | 1.8 | 554.48 | yjs |
| latency | tail delete to remote hidden | 5,000 | 250 | 0.24 | 4,212.44 | 0.26 | 3,854.79 | 6.16 | 162.33 | 1.79 | 559.99 | crlist |
| latency | append tail write to 10 remotes visible | 5,000 | 2,500 | 0.1 | 10,177.37 | 0.14 | 7,131.67 | 10.21 | 97.94 | 3.09 | 323.64 | crlist |
| latency | prepend head write to 10 remotes visible | 5,000 | 2,500 | 0 | 213,184.58 | 0.01 | 138,230.01 | 0.01 | 67,549.62 | 3.12 | 320.29 | crlist |
| latency | middle insert write to 10 remotes visible | 5,000 | 2,500 | 0.05 | 21,477.28 | 0.07 | 13,504.18 | 3.66 | 273.11 | 3.15 | 317.47 | crlist |
| latency | overwrite middle write to 10 remotes visible | 5,000 | 2,500 | 0.05 | 18,430.94 | 0.07 | 14,536.82 | 2.44 | 410.02 | 3.13 | 319.26 | crlist |
| latency | delete middle to 10 remotes hidden | 5,000 | 2,500 | 0.69 | 1,443.39 | 0.3 | 3,292.55 | 10.37 | 96.44 | 1.55 | 645.48 | yjs |
| latency | out-of-order write delivery to remote visible | 5,000 | 250 | 1.36 | 734.17 | 80.5 | 12.42 | n/a | n/a | 15.9 | 62.9 | crlist |
| latency | out-of-order delete delivery to remote convergence | 5,000 | 165 | 2.24 | 447.13 | 0.3 | 3,353.43 | 8.05 | 124.23 | 6.92 | 144.61 | yjs |
| latency | out-of-order append delivery to convergence | 5,000 | 250 | 1.32 | 756.36 | 21.28 | 46.99 | n/a | n/a | 16.06 | 62.28 | crlist |
| latency | out-of-order prepend delivery to convergence | 5,000 | 250 | 1.21 | 825.03 | 21.67 | 46.16 | 0.05 | 19,756.55 | 15.62 | 64 | json-joy |
| latency | out-of-order middle insert delivery to convergence | 5,000 | 250 | 1.28 | 783.52 | 80.39 | 12.44 | n/a | n/a | 16.79 | 59.56 | crlist |
| latency | out-of-order overwrite delivery to convergence | 5,000 | 129 | 1.71 | 583.16 | n/a | n/a | 252.11 | 3.97 | 73.45 | 13.62 | crlist |
| latency | offline burst 1,000 ops then sync | 5,000 | 1,000 | 0 | 245,661.5 | 0.02 | 55,721.43 | 0 | 359,942.44 | 2.73 | 366.25 | json-joy |
| latency | forked replicas mixed ops then converge | 5,000 | 500 | 0 | 384,353.43 | 0.01 | 153,944.92 | n/a | n/a | 2.73 | 366.37 | crlist |
| latency | duplicate shuffled gossip to convergence | 5,000 | 500 | 0.44 | 2,253.91 | 0.15 | 6,576.37 | n/a | n/a | 0.36 | 2,787.41 | yjs |
| latency | remote snapshot hydrate then apply pending deltas | 5,000 | 250 | 0.02 | 56,467.76 | 0.03 | 31,880.31 | 0.04 | 27,149.09 | 0.63 | 1,585.3 | crlist |
| workload | local app session | 5,000 | 250 | 0.01 | 149,366.09 | 0.01 | 95,781.77 | 0.01 | 180,860.87 | 1.06 | 945.59 | json-joy |
| workload | read heavy session | 5,000 | 250 | 0 | 3,407,572.99 | 0 | 4,448,002.85 | 0 | 661,667.99 | 0 | 2,823,742.02 | yjs |
| workload | write heavy session | 5,000 | 250 | 0 | 225,683.1 | 0.01 | 92,947.58 | 0 | 218,988.78 | 1.07 | 934.33 | crlist |
| workload | append tail heavy session | 5,000 | 250 | 0 | 549,492.82 | 0.02 | 54,141.15 | 0 | 225,956.84 | 1.35 | 742.02 | crlist |
| workload | prepend head heavy session | 5,000 | 250 | 0.01 | 199,948.33 | 0.01 | 68,726.46 | 0.1 | 10,425.75 | 1.34 | 744.52 | crlist |
| workload | insert middle heavy session | 5,000 | 250 | 0 | 206,311.31 | 0.01 | 123,419.98 | 0 | 242,109.88 | 1.35 | 740.01 | json-joy |
| workload | overwrite heavy session | 5,000 | 250 | 0 | 213,353 | 0.02 | 61,000.43 | 0 | 270,340.7 | 1.07 | 938.08 | json-joy |
| workload | delete heavy session | 5,000 | 250 | 0 | 237,088.4 | 0.01 | 110,586.15 | 0.03 | 29,041.82 | 0.18 | 5,671.83 | crlist |
| workload | balanced append prepend insert overwrite delete session | 5,000 | 250 | 0 | 206,069.32 | 0.01 | 121,401.83 | 0 | 218,511.22 | 1.14 | 880.93 | json-joy |
| workload | random edit session | 5,000 | 250 | 0.01 | 123,281.03 | 0.02 | 61,210.61 | 0.01 | 95,507.92 | 1.04 | 958.53 | crlist |
| workload | text editing session | 5,000 | 250 | 0.01 | 172,474.22 | 0.01 | 119,591.82 | 0 | 256,073.03 | 1.36 | 736.71 | json-joy |
| workload | collaborative offline session | 5,000 | 500 | 0 | 352,140.45 | 0.01 | 150,428.56 | n/a | n/a | 2.74 | 364.72 | crlist |
| workload | sync and cleanup session | 5,000 | 252 | 0 | 285,893.54 | 0.01 | 156,536.9 | n/a | n/a | 2.75 | 364.05 | crlist |
| workload | long lived tombstoned session | 5,000 | 250 | 0 | 343,803.29 | 0.01 | 92,328.23 | 0 | 247,424.8 | 1.6 | 625.57 | crlist |
| workload | sparse visible session | 5,000 | 250 | 0 | 431,491.27 | 0.13 | 7,964.97 | 0.01 | 97,274.14 | 0.8 | 1,251.91 | crlist |
| workload | post-gc edit session | 5,000 | 250 | 0 | 700,548.95 | 0.01 | 96,725.16 | 0 | 256,517.86 | 1.3 | 768.75 | crlist |

## License

Apache-2.0
