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
| crud | create / empty list | 5,000 | 250 | 0.01 | 72,129.01 | 0.11 | 8,997.13 | 0.02 | 58,168.77 | 0.34 | 2,979.59 | crlist |
| crud | create / hydrate snapshot | 5,000 | 250 | 3.67 | 272.25 | 5 | 200.17 | 13.1 | 76.35 | 133.88 | 7.47 | crlist |
| crud | create / hydrate clean snapshot | 5,000 | 250 | 3.58 | 279.3 | 4.77 | 209.49 | 12.7 | 78.71 | 135.52 | 7.38 | crlist |
| crud | create / hydrate tombstoned snapshot | 5,000 | 250 | 1.68 | 593.81 | 2.45 | 408.94 | 6.39 | 156.41 | 117.16 | 8.54 | crlist |
| crud | read / head | 5,000 | 250 | 0 | 2,368,119.43 | 0 | 1,604,065.34 | 0 | 261,068.25 | 0 | 3,913,833.05 | automerge |
| crud | read / middle | 5,000 | 250 | 0 | 6,852,131.01 | 0 | 1,168,868.82 | 0 | 610,848.17 | 0 | 6,204,859.65 | crlist |
| crud | read / tail | 5,000 | 250 | 0 | 2,000,512.13 | 0 | 1,217,018.79 | 0 | 518,578.6 | 0 | 2,789,369.16 | automerge |
| crud | read / random indexed reads | 5,000 | 250 | 0 | 1,097,054.19 | 0 | 838,057.18 | 0.01 | 179,610.86 | 0 | 939,598.83 | crlist |
| crud | read / sequential indexed reads from head | 5,000 | 250 | 0 | 2,118,679.98 | 0 | 2,920,594.87 | 0 | 324,780.77 | 0 | 1,200,687.75 | yjs |
| crud | read / sequential indexed reads from middle | 5,000 | 250 | 0 | 9,484,426.57 | 0 | 8,430,281.57 | 0 | 787,205.7 | 0 | 11,069,783.92 | automerge |
| crud | read / sequential indexed reads from tail | 5,000 | 250 | 0 | 6,209,483.12 | 0 | 8,634,385.58 | 0 | 751,312.54 | 0 | 11,035,578.71 | automerge |
| crud | read / full iteration visible values | 5,000 | 250 | 0.35 | 2,877.89 | 0.16 | 6,449.07 | 1.13 | 886.74 | 0.05 | 18,746.85 | automerge |
| crud | read / collect visible values to array | 5,000 | 250 | 0.36 | 2,806.59 | 0.15 | 6,833.41 | 1.03 | 972.66 | 0.09 | 11,584.3 | automerge |
| crud | read / visible sparse over deleted entries | 5,000 | 250 | 0 | 5,560,869.28 | 0.03 | 38,447.25 | 0.02 | 66,653.8 | 0 | 2,960,051.15 | crlist |
| crud | find / head | 5,000 | 250 | 0 | 1,245,255.58 | 0 | 1,822,064.47 | 0 | 896,635.82 | 0 | 1,250,550.24 | yjs |
| crud | find / middle | 5,000 | 250 | 0.02 | 54,231.79 | 0.08 | 12,473.16 | 0.57 | 1,768.54 | 0.02 | 45,750.02 | crlist |
| crud | find / tail | 5,000 | 250 | 0.03 | 34,595.25 | 0.13 | 7,583.55 | 1.08 | 927.74 | 0.04 | 22,887.24 | crlist |
| crud | find / missing value | 5,000 | 250 | 0.19 | 5,140.79 | 0.28 | 3,568.96 | 1.94 | 514.88 | 0.05 | 22,134.81 | automerge |
| crud | append / single after tail | 5,000 | 250 | 0 | 244,789.41 | 0.02 | 59,341.88 | 0.03 | 35,665.24 | 1.54 | 647.61 | crlist |
| crud | append / batch after tail | 5,000 | 25,000 | 0 | 1,692,604.13 | 0 | 608,259.66 | 0.01 | 194,921.8 | 0.15 | 6,873.29 | crlist |
| crud | append / batch after deleted tail | 5,000 | 25,000 | 0 | 1,155,548.79 | 0 | 676,626.46 | 0 | 201,647.49 | 0.15 | 6,691.19 | crlist |
| crud | append / batch after garbage collection | 5,000 | 25,000 | 0 | 1,467,540.41 | 0 | 839,373.83 | 0.01 | 188,886.94 | 0.15 | 6,746.22 | crlist |
| crud | prepend / single before head | 5,000 | 250 | 0 | 221,294.36 | 0.01 | 87,879.02 | 0.01 | 129,455.07 | 1.63 | 614.96 | crlist |
| crud | prepend / batch before head | 5,000 | 25,000 | 0 | 1,549,187.44 | 0 | 1,142,059.14 | 0 | 269,376.14 | 0.15 | 6,621.34 | crlist |
| crud | prepend / batch before deleted head | 5,000 | 25,000 | 0 | 1,445,933.79 | 0 | 807,336.58 | 0 | 275,059.3 | 0.15 | 6,731.04 | crlist |
| crud | prepend / batch after garbage collection | 5,000 | 25,000 | 0 | 1,989,444.17 | 0 | 1,289,551.84 | 0 | 290,743.21 | 0.14 | 7,093.72 | crlist |
| crud | insert / single before head | 5,000 | 250 | 0 | 437,155.41 | 0.01 | 112,860.7 | 0.01 | 161,926.75 | 1.6 | 625.97 | crlist |
| crud | insert / single after head | 5,000 | 250 | 0 | 230,100.45 | 0.01 | 87,154.63 | 0.01 | 121,374.25 | 1.61 | 622.97 | crlist |
| crud | insert / single before middle | 5,000 | 250 | 0 | 255,983.88 | 0.01 | 84,812.64 | 0.01 | 166,176.23 | 1.55 | 644.74 | crlist |
| crud | insert / single after middle | 5,000 | 250 | 0 | 264,803.58 | 0.01 | 98,765.98 | 0.01 | 144,298.31 | 1.54 | 648.25 | crlist |
| crud | insert / single before tail | 5,000 | 250 | 0 | 204,646.62 | 0.01 | 105,049.61 | 0 | 213,342.25 | 1.53 | 653.91 | json-joy |
| crud | insert / single after tail | 5,000 | 250 | 0 | 452,079.57 | 0.01 | 87,720.62 | 0 | 257,099.55 | 1.5 | 666.12 | crlist |
| crud | insert / batch before head | 5,000 | 25,000 | 0 | 1,971,411.69 | 0 | 1,373,753.26 | 0 | 286,082.35 | 0.15 | 6,822.18 | crlist |
| crud | insert / batch after head | 5,000 | 25,000 | 0 | 1,979,779.8 | 0 | 1,186,948.92 | 0 | 287,948.01 | 0.14 | 6,989.42 | crlist |
| crud | insert / batch before middle | 5,000 | 25,000 | 0 | 1,160,720.13 | 0 | 923,692.37 | 0 | 247,009.89 | 0.15 | 6,816.61 | crlist |
| crud | insert / batch after middle | 5,000 | 25,000 | 0 | 1,253,718.28 | 0 | 1,148,195.85 | 0 | 228,517.8 | 0.15 | 6,832.16 | crlist |
| crud | insert / batch before tail | 5,000 | 25,000 | 0 | 1,721,216.61 | 0 | 844,182.74 | 0 | 291,824.66 | 0.15 | 6,846.38 | crlist |
| crud | insert / batch after tail | 5,000 | 25,000 | 0 | 1,779,644.93 | 0 | 682,321.99 | 0.01 | 186,702.85 | 0.15 | 6,630.82 | crlist |
| crud | insert / repeated before head | 5,000 | 250 | 0 | 387,945.75 | 0.01 | 136,293.63 | 0 | 205,192.69 | 1.6 | 623.94 | crlist |
| crud | insert / repeated before middle | 5,000 | 250 | 0 | 322,969.88 | 0.01 | 106,410.06 | 0 | 223,222.66 | 1.58 | 633.25 | crlist |
| crud | insert / repeated before tail | 5,000 | 250 | 0 | 314,264.2 | 0.04 | 23,285.43 | 0 | 246,490.23 | 1.5 | 667.9 | crlist |
| crud | insert / random positions | 5,000 | 250 | 0 | 281,900.41 | 0.01 | 83,399.52 | 0.01 | 69,574.18 | 1.57 | 635.45 | crlist |
| crud | insert / alternating head and tail | 5,000 | 250 | 0 | 432,647.21 | 0.02 | 64,047.47 | 0.01 | 161,225 | 1.62 | 616.51 | crlist |
| crud | overwrite / head | 5,000 | 250 | 0.01 | 149,357.61 | 0.02 | 57,494.18 | 0.02 | 62,899.54 | 1.73 | 577.19 | crlist |
| crud | overwrite / middle | 5,000 | 250 | 0 | 237,991.66 | 0.01 | 67,456.94 | 0.01 | 135,713.42 | 1.67 | 600.33 | crlist |
| crud | overwrite / tail | 5,000 | 250 | 0 | 272,012.03 | 0.02 | 63,681.14 | 0.01 | 148,457.91 | 1.58 | 631.96 | crlist |
| crud | overwrite / random | 5,000 | 250 | 0.01 | 86,163.49 | 0.03 | 34,869.16 | 0.01 | 104,707.26 | 1.8 | 556.04 | json-joy |
| crud | overwrite / same head repeatedly | 5,000 | 250 | 0 | 340,843.25 | 0.01 | 88,165.85 | 0 | 218,565.09 | 1.7 | 589.38 | crlist |
| crud | overwrite / same middle repeatedly | 5,000 | 250 | 0 | 282,034.3 | 0.01 | 82,030.82 | 0.09 | 10,988.75 | 1.62 | 616.56 | crlist |
| crud | overwrite / same tail repeatedly | 5,000 | 250 | 0 | 491,910.05 | 0.01 | 83,976.06 | 0 | 212,792.94 | 1.58 | 632.2 | crlist |
| crud | overwrite / random visible entries | 5,000 | 250 | 0.01 | 109,571.85 | 0.04 | 25,911.55 | 0.01 | 152,776.62 | 2.12 | 472.18 | json-joy |
| crud | overwrite / after insert | 5,000 | 250 | 0 | 358,654.33 | 0.01 | 74,814.28 | 0.01 | 188,384.94 | 1.9 | 526.11 | crlist |
| crud | overwrite / after delete | 5,000 | 250 | 0 | 303,168.47 | 0.01 | 87,231.08 | 0.01 | 187,875.85 | 1.64 | 610.62 | crlist |
| crud | delete / head | 5,000 | 250 | 0 | 250,295.6 | 0.01 | 78,928.22 | 0.01 | 84,378.59 | 0.17 | 5,836.32 | crlist |
| crud | delete / middle | 5,000 | 250 | 0 | 317,291.9 | 0.01 | 95,420.94 | 0.01 | 140,236.17 | 0.17 | 5,751.55 | crlist |
| crud | delete / tail | 5,000 | 250 | 0 | 359,584.44 | 0.01 | 70,883.42 | 0 | 266,020.84 | 0.17 | 5,723.3 | crlist |
| crud | delete / range from head | 5,000 | 5,000 | 0 | 2,105,644.39 | 0 | 6,463,906.84 | 0 | 748,015.1 | 0.01 | 83,523.82 | yjs |
| crud | delete / range from middle | 5,000 | 5,000 | 0 | 1,333,076.67 | 0 | 5,253,723.31 | 0 | 576,993.89 | 0.01 | 73,523.56 | yjs |
| crud | delete / range from tail | 5,000 | 5,000 | 0 | 1,598,478.25 | 0 | 7,121,604.24 | 0 | 697,517.79 | 0.01 | 76,423.43 | yjs |
| crud | delete / every other entry | 5,000 | 2,500 | 0 | 295,126.04 | 0.07 | 15,313.41 | 0.07 | 14,198.02 | 0.17 | 5,966.39 | crlist |
| crud | delete / all entries from head one by one | 5,000 | 5,000 | 0 | 343,475.95 | 0.01 | 119,493.27 | 0.01 | 112,743.37 | 0.16 | 6,418.22 | crlist |
| crud | delete / all entries from middle outward | 5,000 | 5,000 | 0 | 346,938.19 | 0.01 | 135,033.1 | 0 | 221,320.45 | 0.16 | 6,351.08 | crlist |
| crud | delete / all entries from tail one by one | 5,000 | 5,000 | 0 | 672,594.38 | 0.01 | 125,134.03 | 0 | 341,348.4 | 0.15 | 6,552.74 | crlist |
| crud | delete / all entries in random order | 5,000 | 5,000 | 0.09 | 10,543.59 | 10.6 | 94.36 | 7.71 | 129.73 | 0.18 | 5,407.35 | crlist |
| crud | delete / already deleted head | 5,000 | 250 | 0 | 355,863.27 | 0 | 276,983.45 | 0 | 602,852.7 | 0.02 | 60,429.14 | json-joy |
| crud | delete / already deleted middle | 5,000 | 250 | 0 | 417,969.34 | 0 | 241,384.5 | 0 | 943,577.82 | 0.02 | 63,284.97 | json-joy |
| crud | delete / already deleted tail | 5,000 | 250 | 0 | 1,329,532.64 | 0 | 267,824.53 | 0 | 1,001,859.45 | 0.02 | 53,644.09 | crlist |
| crud | mixed / append overwrite delete tail | 5,000 | 250 | 0 | 257,954.54 | 0.02 | 65,662.66 | 0.01 | 121,785.83 | 1.36 | 735.31 | crlist |
| crud | mixed / prepend overwrite delete head | 5,000 | 250 | 0 | 277,262.99 | 0.02 | 59,717.88 | 0.08 | 12,056.44 | 1.4 | 713.94 | crlist |
| crud | mixed / insert overwrite delete middle | 5,000 | 250 | 0 | 284,068.96 | 0.01 | 80,610.71 | 0.01 | 137,563.01 | 1.35 | 739.78 | crlist |
| crud | mixed / append prepend insert overwrite delete | 5,000 | 250 | 0 | 348,353.89 | 0.01 | 99,102.41 | 0 | 214,914.37 | 1.38 | 726.1 | crlist |
| mags | snapshot | 5,000 | 250 | 0.31 | 3,209.07 | 2.69 | 372.36 | 5.38 | 185.93 | 15.11 | 66.2 | crlist |
| mags | snapshot / clean state | 5,000 | 250 | 0.2 | 4,902.47 | 2.55 | 392.86 | 5.7 | 175.46 | 14.85 | 67.33 | crlist |
| mags | snapshot / tombstoned state 50% deleted | 5,000 | 250 | 0.17 | 6,021.05 | 1.27 | 785.22 | 2.26 | 442.06 | 15.13 | 66.09 | crlist |
| mags | snapshot / tombstoned state 90% deleted | 5,000 | 250 | 0.02 | 54,277.36 | 0.26 | 3,837.54 | 0.36 | 2,793.04 | 15 | 66.65 | crlist |
| mags | snapshot / after garbage collection | 5,000 | 250 | 0.14 | 7,090.01 | 1.27 | 787.1 | 2.25 | 443.48 | 14.87 | 67.25 | crlist |
| mags | acknowledge | 5,000 | 250 | 0 | 2,575,248.77 | n/a | n/a | n/a | n/a | n/a | n/a | n/a |
| mags | acknowledge / clean state | 5,000 | 250 | 0 | 4,965,539.16 | n/a | n/a | n/a | n/a | n/a | n/a | n/a |
| mags | acknowledge / 50% deleted state | 5,000 | 250 | 0 | 1,515,326.01 | n/a | n/a | n/a | n/a | n/a | n/a | n/a |
| mags | acknowledge / 90% deleted state | 5,000 | 250 | 0 | 2,638,411.04 | n/a | n/a | n/a | n/a | n/a | n/a | n/a |
| mags | garbage collect | 5,000 | 250 | 0 | 1,268,262.99 | n/a | n/a | n/a | n/a | n/a | n/a | n/a |
| mags | garbage collect / no eligible tombstones | 5,000 | 250 | 0 | 3,833,238.78 | n/a | n/a | n/a | n/a | n/a | n/a | n/a |
| mags | garbage collect / 50% eligible tombstones | 5,000 | 250 | 0 | 661,541.92 | n/a | n/a | n/a | n/a | n/a | n/a | n/a |
| mags | garbage collect / 90% eligible tombstones | 5,000 | 250 | 0 | 1,134,532.91 | n/a | n/a | n/a | n/a | n/a | n/a | n/a |
| mags | garbage collect / partial frontiers 2 replicas | 5,000 | 250 | 0 | 3,813,882.53 | n/a | n/a | n/a | n/a | n/a | n/a | n/a |
| mags | garbage collect / partial frontiers 10 replicas | 5,000 | 250 | 0 | 10,608,503.78 | n/a | n/a | n/a | n/a | n/a | n/a | n/a |
| mags | post-gc read / full iteration visible values | 5,000 | 250 | 0.18 | 5,438.79 | 0.07 | 14,539.12 | 0.43 | 2,313.56 | 0.03 | 38,958.93 | automerge |
| mags | merge ordered deltas | 5,000 | 250 | 0.01 | 116,522.3 | 0.01 | 70,168.31 | 0 | 200,999.37 | 2.65 | 376.8 | json-joy |
| mags | merge shuffled gossip | 5,000 | 250 | 0.98 | 1,024.55 | 0.45 | 2,241.37 | n/a | n/a | 0.71 | 1,415.92 | yjs |
| mags | merge / append head delta into equal replica | 5,000 | 1 | 0.04 | 27,326.14 | 0.08 | 12,937.28 | 0.04 | 28,455.17 | 3.12 | 320.17 | json-joy |
| mags | merge / append tail delta into equal replica | 5,000 | 1 | 0.08 | 12,452.99 | 0.04 | 28,277.34 | 0.01 | 125,754.53 | 3.16 | 316.41 | json-joy |
| mags | merge / prepend head delta into equal replica | 5,000 | 1 | 0.03 | 32,769.69 | 0.03 | 37,950.66 | 0.01 | 123,869.69 | 3.04 | 328.94 | json-joy |
| mags | merge / insert middle delta into equal replica | 5,000 | 1 | 0.07 | 14,337.74 | 0.04 | 28,285.34 | 0.01 | 75,131.48 | 2.98 | 335.18 | json-joy |
| mags | merge / overwrite head delta into equal replica | 5,000 | 1 | 0.04 | 25,471.22 | 0.02 | 47,911.08 | 0.01 | 113,856.31 | 3.05 | 328.29 | json-joy |
| mags | merge / overwrite middle delta into equal replica | 5,000 | 1 | 0.1 | 10,115.31 | 0.03 | 30,056.21 | 0.02 | 65,560.87 | 2.98 | 335.47 | json-joy |
| mags | merge / overwrite tail delta into equal replica | 5,000 | 1 | 0.03 | 28,799.35 | 0.02 | 41,918.18 | 0.01 | 100,755.67 | 3.06 | 327.19 | json-joy |
| mags | merge / delete head delta into equal replica | 5,000 | 1 | 0.03 | 28,890.88 | 0.01 | 88,597.5 | 0.02 | 64,834.02 | 1.54 | 650.92 | yjs |
| mags | merge / delete middle delta into equal replica | 5,000 | 1 | 0.13 | 7,455.79 | 0.04 | 27,139.99 | 0.02 | 62,877.26 | 1.62 | 617.75 | json-joy |
| mags | merge / delete tail delta into equal replica | 5,000 | 1 | 0.02 | 46,635.27 | 0.01 | 81,639.32 | 0.01 | 116,645.28 | 1.55 | 647.18 | json-joy |
| mags | merge / duplicate delta ignored | 5,000 | 250 | 0 | 830,322.03 | 0.02 | 48,271.52 | 0.01 | 132,707.73 | 0.03 | 39,716.8 | crlist |
| mags | merge / old delta ignored after merge | 5,000 | 250 | 0 | 1,029,955.22 | 0.01 | 74,807.57 | 0 | 449,755.96 | 0.02 | 43,954.16 | crlist |
| mags | merge / ordered 1,000 append deltas | 5,000 | 1,000 | 0 | 315,766.8 | 0.01 | 72,909.65 | 0 | 345,848.67 | 3.03 | 330.51 | json-joy |
| mags | merge / ordered 1,000 prepend deltas | 5,000 | 1,000 | 0 | 337,800.18 | 0.01 | 125,645.87 | 0.01 | 130,632.94 | 3.08 | 324.34 | crlist |
| mags | merge / ordered 1,000 middle insert deltas | 5,000 | 1,000 | 0 | 347,572.93 | 0.01 | 110,661.57 | 0 | 371,642.77 | 3.04 | 328.79 | json-joy |
| mags | merge / shuffled 1,000 mixed deltas | 5,000 | 1,000 | 1.04 | 960.95 | 1.01 | 991.71 | n/a | n/a | 0.83 | 1,205.51 | automerge |
| mags | merge / reverse ordered 1,000 mixed deltas | 5,000 | 1,000 | 0.28 | 3,533.8 | 0.94 | 1,067.8 | n/a | n/a | 0.83 | 1,207.7 | crlist |
| mags | merge / concurrent prepends same head | 5,000 | 2 | 0.07 | 13,843.9 | 0.13 | 7,426.77 | n/a | n/a | 10.85 | 92.18 | crlist |
| mags | merge / concurrent appends same tail | 5,000 | 2 | 0.03 | 39,915.38 | 0.03 | 31,778.82 | n/a | n/a | 13.83 | 72.33 | crlist |
| mags | merge / concurrent inserts same middle position | 5,000 | 2 | 0.1 | 10,273.64 | 0.03 | 32,106.34 | n/a | n/a | 7.87 | 127.07 | yjs |
| mags | merge / concurrent overwrites same head | 5,000 | 2 | 0.03 | 37,664.78 | 0.03 | 33,450.41 | n/a | n/a | 8.06 | 124.14 | crlist |
| mags | merge / concurrent overwrites same middle | 5,000 | 2 | 0.11 | 9,239.33 | 0.03 | 28,912.18 | n/a | n/a | 13.92 | 71.82 | yjs |
| mags | merge / concurrent overwrites same tail | 5,000 | 2 | 0.02 | 41,760.63 | 0.03 | 30,474.33 | n/a | n/a | 7.96 | 125.66 | crlist |
| mags | merge / concurrent deletes same head | 5,000 | 2 | 0.03 | 34,597.89 | 0.02 | 60,096.15 | 0.02 | 47,786.3 | 6.94 | 144.04 | yjs |
| mags | merge / concurrent deletes same middle | 5,000 | 2 | 0.13 | 7,675.39 | 0.02 | 48,435.53 | 0.02 | 43,669.08 | 7.11 | 140.57 | yjs |
| mags | merge / concurrent deletes same tail | 5,000 | 2 | 0.02 | 66,302.01 | 0.02 | 46,801.14 | 0.02 | 47,992.71 | 6.95 | 143.96 | crlist |
| mags | merge / concurrent overwrite delete same entry | 5,000 | 2 | 0.12 | 8,048.81 | 0.07 | 13,416.07 | 0.07 | 15,282.69 | 12.62 | 79.23 | json-joy |
| mags | merge / forked replicas rejoin after 250 ops each | 5,000 | 500 | 0.01 | 199,421.68 | 0.01 | 109,721.57 | n/a | n/a | 2.8 | 357.15 | crlist |
| mags | merge / 10 replicas gossip convergence | 5,000 | 100 | 0 | 217,631.17 | 0.01 | 109,644.91 | n/a | n/a | 6.36 | 157.18 | crlist |
| mags | merge / snapshot merge into stale replica | 5,000 | 5,350 | 0 | 1,099,959.83 | 0 | 733,875.08 | 0.01 | 154,335.62 | 0.03 | 36,870.05 | crlist |
| class | constructor / hydrate snapshot | 5,000 | 250 | 3.59 | 278.74 | 4.75 | 210.31 | 13.15 | 76.04 | 136.19 | 7.34 | crlist |
| class | read / head | 5,000 | 250 | 0 | 3,078,703.99 | 0 | 4,264,174.11 | 0 | 2,077,947.98 | 0 | 3,510,348.51 | yjs |
| class | read / middle | 5,000 | 250 | 0 | 10,289,759.63 | 0 | 11,545,744.24 | 0 | 2,484,793.07 | 0 | 10,820,168.79 | yjs |
| class | read / tail | 5,000 | 250 | 0 | 2,366,774.28 | 0 | 2,864,968.31 | 0 | 1,741,104.7 | 0 | 3,682,861.44 | automerge |
| class | find near head | 5,000 | 250 | 0 | 1,253,755 | n/a | n/a | n/a | n/a | 0 | 1,518,851.99 | automerge |
| class | find near middle | 5,000 | 250 | 0.03 | 28,926.14 | n/a | n/a | n/a | n/a | 0.02 | 42,867.9 | automerge |
| class | find near tail | 5,000 | 250 | 0.05 | 18,461.77 | n/a | n/a | n/a | n/a | 0.04 | 22,643.86 | automerge |
| class | iterate visible values | 5,000 | 250 | 0.13 | 7,869.11 | 0.13 | 7,720.06 | 1.05 | 951.34 | 0.06 | 16,916.88 | automerge |
| class | collect visible values to array | 5,000 | 250 | 0.12 | 8,442.3 | 0.12 | 8,021.55 | 0.98 | 1,025.27 | 0.06 | 16,521.65 | automerge |
| class | append / single after tail | 5,000 | 250 | 0 | 325,492.01 | 0.01 | 77,320.05 | 0.01 | 194,031.29 | 1.6 | 625.77 | crlist |
| class | append / batch after tail | 5,000 | 25,000 | 0 | 1,703,387.04 | 0 | 669,586.74 | 0 | 206,213.84 | 0.15 | 6,471.01 | crlist |
| class | prepend / single before head | 5,000 | 250 | 0 | 270,890.54 | 0.01 | 124,600.34 | 0.01 | 199,988 | 1.68 | 595.42 | crlist |
| class | prepend / batch before head | 5,000 | 25,000 | 0 | 2,109,861.86 | 0 | 1,345,567.09 | 0 | 286,744.7 | 0.15 | 6,643.44 | crlist |
| class | insert / single before middle | 5,000 | 250 | 0 | 254,662.88 | 0.01 | 105,957.48 | 0 | 228,718.23 | 1.64 | 610.15 | crlist |
| class | insert / batch before middle | 5,000 | 25,000 | 0 | 1,450,491.25 | 0 | 1,344,292.44 | 0 | 279,180.29 | 0.15 | 6,608.87 | crlist |
| class | overwrite / head | 5,000 | 250 | 0 | 223,510.24 | 0.01 | 83,884.65 | 0.01 | 115,033.71 | 1.81 | 553 | crlist |
| class | overwrite / middle | 5,000 | 250 | 0 | 286,554.3 | 0.01 | 85,462.81 | 0.01 | 197,607.06 | 1.72 | 579.79 | crlist |
| class | overwrite / tail | 5,000 | 250 | 0 | 275,637.6 | 0.01 | 78,502.06 | 0.01 | 174,693.6 | 1.66 | 602.07 | crlist |
| class | overwrite / random | 5,000 | 250 | 0.01 | 72,770.46 | 0.05 | 21,568.92 | 0.01 | 111,344.94 | 1.92 | 519.72 | json-joy |
| class | remove / head | 5,000 | 250 | 0 | 234,172.29 | 0.01 | 77,755.01 | 0.01 | 92,616.98 | 0.21 | 4,872.08 | crlist |
| class | remove / middle | 5,000 | 250 | 0 | 332,986.14 | 0.01 | 117,635.27 | 0.01 | 158,971.39 | 0.19 | 5,168.09 | crlist |
| class | remove / tail | 5,000 | 250 | 0 | 505,648.09 | 0.01 | 102,298.69 | 0 | 362,177.12 | 0.18 | 5,670.21 | crlist |
| class | remove / range from head | 5,000 | 5,000 | 0 | 2,203,320.67 | 0 | 11,724,071.63 | 0 | 667,326.43 | 0.01 | 80,795.19 | yjs |
| class | remove / range from middle | 5,000 | 5,000 | 0 | 1,480,580.85 | 0 | 10,394,254.06 | 0 | 778,228.77 | 0.01 | 70,291.9 | yjs |
| class | remove / range from tail | 5,000 | 5,000 | 0 | 1,560,739.29 | 0 | 12,157,167.87 | 0 | 750,122.5 | 0.01 | 75,967.94 | yjs |
| class | mixed / append overwrite remove tail | 5,000 | 250 | 0 | 351,260.25 | 0.01 | 87,690.44 | 0.01 | 198,019.33 | 1.18 | 846.31 | crlist |
| class | mixed / prepend overwrite remove head | 5,000 | 250 | 0 | 391,817.59 | 0.01 | 113,211.41 | 0 | 233,290.56 | 1.27 | 790.46 | crlist |
| class | mixed / insert overwrite remove middle | 5,000 | 250 | 0 | 380,627.58 | 0.01 | 109,907.12 | 0 | 265,097.01 | 1.23 | 811.29 | crlist |
| class | paste / insert 10,000 entries at cursor | 5,000 | 10,000 | 0 | 919,492.12 | 0 | 1,470,588.02 | 0.01 | 126,752.35 | 0.14 | 7,115.08 | yjs |
| class | render / join visible entries to string | 5,000 | 250 | 0.18 | 5,639.58 | 0.21 | 4,688.3 | 1.15 | 871.52 | 0.15 | 6,881.49 | automerge |
| class | snapshot | 5,000 | 250 | 0.13 | 7,931.69 | 2.59 | 386.29 | 5.28 | 189.49 | 14.79 | 67.62 | crlist |
| class | snapshot / tombstoned state 50% deleted | 5,000 | 250 | 0.06 | 15,482.25 | 1.29 | 773.26 | 2.21 | 451.69 | 14.9 | 67.1 | crlist |
| class | snapshot / after garbage collection | 5,000 | 250 | 0.08 | 12,471.24 | 0.13 | 7,848.45 | 1.04 | 961.85 | 0.06 | 16,911.4 | automerge |
| class | acknowledge | 5,000 | 250 | 0.01 | 143,923.91 | n/a | n/a | n/a | n/a | n/a | n/a | n/a |
| class | acknowledge / 50% deleted state | 5,000 | 250 | 0 | 221,112.73 | n/a | n/a | n/a | n/a | n/a | n/a | n/a |
| class | acknowledge / 90% deleted state | 5,000 | 250 | 0.01 | 143,720.86 | n/a | n/a | n/a | n/a | n/a | n/a | n/a |
| class | garbage collect | 5,000 | 250 | 0.08 | 11,845.5 | 0.13 | 7,760.91 | 0.97 | 1,029.29 | 0.06 | 16,793.26 | automerge |
| class | garbage collect / no eligible tombstones | 5,000 | 250 | 0.09 | 11,367.93 | 0.2 | 5,097.94 | 1 | 1,004.72 | 0.06 | 16,698.16 | automerge |
| class | garbage collect / 90% eligible tombstones | 5,000 | 250 | 0.09 | 11,445.08 | 0.19 | 5,146.68 | 1 | 995.25 | 0.06 | 16,668.47 | automerge |
| class | merge ordered deltas | 5,000 | 250 | 0.01 | 171,535.06 | 0.01 | 100,576.63 | 0 | 324,447.37 | 2.65 | 376.69 | json-joy |
| class | merge shuffled gossip | 5,000 | 250 | 0.87 | 1,144.84 | 0.33 | 3,026.95 | n/a | n/a | 0.68 | 1,479.54 | yjs |
| class | merge / duplicate delta ignored | 5,000 | 250 | 0 | 561,140.78 | 0.03 | 32,982.51 | 0 | 472,118.57 | 0.03 | 34,668.56 | crlist |
| class | merge / concurrent prepends same head | 5,000 | 2 | 0.07 | 14,406.21 | 0.07 | 14,217.47 | n/a | n/a | 8 | 124.93 | crlist |
| class | merge / concurrent appends same tail | 5,000 | 2 | 0.02 | 48,504.84 | 0.02 | 40,539.17 | n/a | n/a | 7.79 | 128.39 | crlist |
| class | merge / concurrent inserts same middle position | 5,000 | 2 | 0.09 | 11,300.26 | 0.03 | 32,996.77 | n/a | n/a | 7.95 | 125.78 | yjs |
| class | merge / forked replicas rejoin after 250 ops each | 5,000 | 500 | 0.01 | 90,494.27 | 0.01 | 125,802.91 | n/a | n/a | 2.77 | 361.43 | yjs |
| latency | append tail write to remote visible | 5,000 | 250 | 0.09 | 11,102.93 | 0.16 | 6,203.62 | 10.43 | 95.89 | 4.92 | 203.06 | crlist |
| latency | prepend head write to remote visible | 5,000 | 250 | 0.01 | 130,543.67 | 0.02 | 51,730.11 | 0.01 | 70,706.78 | 4.94 | 202.26 | crlist |
| latency | middle insert write to remote visible | 5,000 | 250 | 0.04 | 24,384.46 | 0.09 | 11,385.3 | 2.89 | 345.54 | 4.97 | 201.05 | crlist |
| latency | head insert write to remote visible | 5,000 | 250 | 0.02 | 52,788.59 | 0.02 | 63,252.1 | 0.01 | 84,468.85 | 4.88 | 204.78 | json-joy |
| latency | overwrite head write to remote visible | 5,000 | 250 | 0.01 | 104,197.58 | 0.03 | 38,905.69 | 0.09 | 10,812.89 | 5 | 200.03 | crlist |
| latency | overwrite middle write to remote visible | 5,000 | 250 | 0.04 | 24,261.08 | 0.09 | 10,848.44 | 1.68 | 594.98 | 4.96 | 201.56 | crlist |
| latency | overwrite tail write to remote visible | 5,000 | 250 | 0.08 | 12,895.56 | 0.16 | 6,334.09 | 3.51 | 284.65 | 4.82 | 207.65 | crlist |
| latency | head delete to remote hidden | 5,000 | 250 | 0.65 | 1,529.54 | 0.33 | 3,048.48 | 6.66 | 150.04 | 1.82 | 548.01 | yjs |
| latency | middle delete to remote hidden | 5,000 | 250 | 0.68 | 1,477.04 | 0.33 | 3,022.46 | 7.13 | 140.21 | 1.81 | 552.49 | yjs |
| latency | tail delete to remote hidden | 5,000 | 250 | 0.21 | 4,658.4 | 0.29 | 3,487.7 | 6.55 | 152.67 | 1.76 | 568.74 | crlist |
| latency | append tail write to 10 remotes visible | 5,000 | 2,500 | 0.09 | 11,370.87 | 0.13 | 7,464.85 | 12.63 | 79.15 | 3.26 | 306.34 | crlist |
| latency | prepend head write to 10 remotes visible | 5,000 | 2,500 | 0 | 331,198.56 | 0.01 | 129,256.17 | 0.01 | 150,997.2 | 3.28 | 305.14 | crlist |
| latency | middle insert write to 10 remotes visible | 5,000 | 2,500 | 0.04 | 23,066.96 | 0.08 | 13,121.6 | 5.33 | 187.53 | 3.32 | 301.19 | crlist |
| latency | overwrite middle write to 10 remotes visible | 5,000 | 2,500 | 0.06 | 17,679.54 | 0.07 | 13,834.65 | 3.01 | 332.34 | 3.3 | 302.72 | crlist |
| latency | delete middle to 10 remotes hidden | 5,000 | 2,500 | 0.95 | 1,053.84 | 0.33 | 3,061.74 | 11.48 | 87.09 | 1.62 | 618.44 | yjs |
| latency | out-of-order write delivery to remote visible | 5,000 | 250 | 1.43 | 698.99 | 85.94 | 11.64 | n/a | n/a | 16.21 | 61.69 | crlist |
| latency | out-of-order delete delivery to remote convergence | 5,000 | 165 | 2.26 | 441.65 | 0.31 | 3,206.65 | 8.88 | 112.66 | 6.63 | 150.81 | yjs |
| latency | out-of-order append delivery to convergence | 5,000 | 250 | 1.22 | 817.09 | 21.3 | 46.94 | n/a | n/a | 16.24 | 61.59 | crlist |
| latency | out-of-order prepend delivery to convergence | 5,000 | 250 | 1.28 | 781.44 | 21.85 | 45.76 | 0.05 | 19,370.68 | 16.44 | 60.83 | json-joy |
| latency | out-of-order middle insert delivery to convergence | 5,000 | 250 | 1.34 | 744.32 | 85.74 | 11.66 | n/a | n/a | 15.96 | 62.67 | crlist |
| latency | out-of-order overwrite delivery to convergence | 5,000 | 129 | 1.81 | 551.99 | n/a | n/a | 267.82 | 3.73 | 76.75 | 13.03 | crlist |
| latency | offline burst 1,000 ops then sync | 5,000 | 1,000 | 0 | 285,017.62 | 0.02 | 57,769.08 | 0 | 330,693.52 | 2.82 | 355.17 | json-joy |
| latency | forked replicas mixed ops then converge | 5,000 | 500 | 0 | 323,082.78 | 0.01 | 147,736.15 | n/a | n/a | 2.84 | 352.19 | crlist |
| latency | duplicate shuffled gossip to convergence | 5,000 | 500 | 0.47 | 2,147.85 | 0.15 | 6,751.82 | n/a | n/a | 0.38 | 2,660.19 | yjs |
| latency | remote snapshot hydrate then apply pending deltas | 5,000 | 250 | 0.02 | 51,901.83 | 0.03 | 34,655.77 | 0.13 | 7,625.78 | 0.6 | 1,657.89 | crlist |
| workload | local app session | 5,000 | 250 | 0.01 | 151,447.5 | 0.01 | 97,342.85 | 0.01 | 184,633.88 | 1.1 | 905.91 | json-joy |
| workload | read heavy session | 5,000 | 250 | 0 | 2,506,516.94 | 0 | 5,122,530.94 | 0 | 611,432.32 | 0 | 3,191,706.67 | yjs |
| workload | write heavy session | 5,000 | 250 | 0 | 211,520.06 | 0.01 | 92,989.94 | 0 | 222,375.41 | 1.1 | 910.72 | json-joy |
| workload | append tail heavy session | 5,000 | 250 | 0 | 311,053.21 | 0.01 | 87,094.42 | 0 | 204,167.3 | 1.37 | 730.32 | crlist |
| workload | prepend head heavy session | 5,000 | 250 | 0.01 | 170,625.52 | 0.01 | 131,370.21 | 0 | 202,762.76 | 1.4 | 714.5 | json-joy |
| workload | insert middle heavy session | 5,000 | 250 | 0.01 | 145,362.27 | 0.01 | 117,049.42 | 0.02 | 53,463.26 | 1.45 | 687.49 | crlist |
| workload | overwrite heavy session | 5,000 | 250 | 0 | 222,377.59 | 0.02 | 56,321.88 | 0 | 267,431.45 | 1.13 | 883.35 | json-joy |
| workload | delete heavy session | 5,000 | 250 | 0 | 208,565.19 | 0.01 | 104,864.72 | 0.12 | 8,471.26 | 0.16 | 6,224.95 | crlist |
| workload | balanced append prepend insert overwrite delete session | 5,000 | 250 | 0.01 | 182,237.53 | 0.01 | 120,303.24 | 0.01 | 175,033.01 | 1.19 | 838.82 | crlist |
| workload | random edit session | 5,000 | 250 | 0.01 | 127,948.31 | 0.02 | 64,933.31 | 0.02 | 66,555.01 | 1.1 | 910.27 | crlist |
| workload | text editing session | 5,000 | 250 | 0.01 | 149,789.04 | 0.01 | 123,990.1 | 0 | 219,508.7 | 1.41 | 710.59 | json-joy |
| workload | collaborative offline session | 5,000 | 500 | 0 | 333,545.02 | 0.01 | 147,868.27 | n/a | n/a | 2.83 | 353.65 | crlist |
| workload | sync and cleanup session | 5,000 | 252 | 0 | 269,683.99 | 0.01 | 150,951.46 | n/a | n/a | 2.82 | 354.29 | crlist |
| workload | long lived tombstoned session | 5,000 | 250 | 0 | 234,443.28 | 0.01 | 96,595.14 | 0 | 223,923.44 | 1.61 | 620.27 | crlist |
| workload | sparse visible session | 5,000 | 250 | 0 | 455,176.91 | 0.1 | 10,313.01 | 0.01 | 114,452.51 | 0.84 | 1,185.17 | crlist |
| workload | post-gc edit session | 5,000 | 250 | 0 | 701,091.18 | 0.01 | 104,260.72 | 0 | 221,966.12 | 1.39 | 719.6 | crlist |

## License

Apache-2.0
