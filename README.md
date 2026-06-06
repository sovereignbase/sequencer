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
| crud | create / empty list | 5,000 | 250 | 0.01 | 75,355.32 | 0.11 | 9,091.8 | 0.02 | 61,322.52 | 0.31 | 3,216.08 | crlist |
| crud | create / hydrate snapshot | 5,000 | 250 | 3.71 | 269.31 | 4.82 | 207.35 | 13.03 | 76.73 | 131.85 | 7.58 | crlist |
| crud | create / hydrate clean snapshot | 5,000 | 250 | 3.65 | 274 | 4.76 | 210.05 | 12.79 | 78.18 | 131.83 | 7.59 | crlist |
| crud | create / hydrate tombstoned snapshot | 5,000 | 250 | 1.74 | 574.9 | 2.43 | 411.9 | 6.2 | 161.17 | 115.14 | 8.69 | crlist |
| crud | read / head | 5,000 | 250 | 0 | 2,653,054.73 | 0 | 1,428,636.74 | 0 | 330,494.17 | 0 | 3,689,437.88 | automerge |
| crud | read / middle | 5,000 | 250 | 0 | 7,527,853.06 | 0 | 1,600,891.38 | 0 | 435,852.15 | 0 | 8,301,510.87 | automerge |
| crud | read / tail | 5,000 | 250 | 0 | 2,204,779.96 | 0 | 1,188,015.3 | 0 | 490,000.08 | 0 | 3,252,455.6 | automerge |
| crud | read / random indexed reads | 5,000 | 250 | 0 | 1,331,479.91 | 0 | 843,215.82 | 0 | 224,267.54 | 0 | 1,001,951.8 | crlist |
| crud | read / sequential indexed reads from head | 5,000 | 250 | 0 | 2,382,608.86 | 0 | 2,968,557.04 | 0 | 409,759.49 | 0 | 1,192,611.53 | yjs |
| crud | read / sequential indexed reads from middle | 5,000 | 250 | 0 | 10,824,853.86 | 0 | 8,410,711.88 | 0 | 825,725.65 | 0 | 11,129,412.81 | automerge |
| crud | read / sequential indexed reads from tail | 5,000 | 250 | 0 | 8,407,600.47 | 0 | 8,808,089.35 | 0 | 707,095.56 | 0 | 12,665,281.93 | automerge |
| crud | read / full iteration visible values | 5,000 | 250 | 0.35 | 2,838.24 | 0.16 | 6,345.41 | 1.09 | 920.11 | 0.05 | 19,614.69 | automerge |
| crud | read / collect visible values to array | 5,000 | 250 | 0.36 | 2,816.58 | 0.14 | 6,951.22 | 1 | 996.5 | 0.08 | 12,278.27 | automerge |
| crud | read / visible sparse over deleted entries | 5,000 | 250 | 0 | 7,248,057.52 | 0.02 | 42,961.28 | 0.02 | 64,035.31 | 0 | 2,429,212.74 | crlist |
| crud | find / head | 5,000 | 250 | 0 | 1,288,786.02 | 0 | 1,795,357.92 | 0 | 887,777.79 | 0 | 1,228,531.41 | yjs |
| crud | find / middle | 5,000 | 250 | 0.02 | 55,553.94 | 0.08 | 13,241.3 | 0.54 | 1,840.37 | 0.02 | 47,549 | crlist |
| crud | find / tail | 5,000 | 250 | 0.03 | 34,859.42 | 0.13 | 7,749.78 | 0.99 | 1,013.74 | 0.04 | 22,540.33 | crlist |
| crud | find / missing value | 5,000 | 250 | 0.19 | 5,258.15 | 0.28 | 3,608.01 | 1.96 | 511.31 | 0.04 | 22,424.57 | automerge |
| crud | append / single after tail | 5,000 | 250 | 0 | 273,916.47 | 0.02 | 61,966.59 | 0.01 | 105,864.2 | 1.57 | 636.57 | crlist |
| crud | append / batch after tail | 5,000 | 25,000 | 0 | 1,853,516.86 | 0 | 597,565.28 | 0 | 207,390.12 | 0.14 | 6,925.31 | crlist |
| crud | append / batch after deleted tail | 5,000 | 25,000 | 0 | 1,238,635.34 | 0 | 665,501.65 | 0 | 202,291.34 | 0.14 | 6,941.73 | crlist |
| crud | append / batch after garbage collection | 5,000 | 25,000 | 0 | 1,457,327.75 | 0 | 772,241.3 | 0 | 228,631.76 | 0.14 | 6,944.32 | crlist |
| crud | prepend / single before head | 5,000 | 250 | 0 | 222,290.59 | 0.01 | 104,301.39 | 0.01 | 134,707.06 | 1.62 | 615.92 | crlist |
| crud | prepend / batch before head | 5,000 | 25,000 | 0 | 1,574,147.91 | 0 | 1,256,323.64 | 0 | 269,781.3 | 0.14 | 7,004.97 | crlist |
| crud | prepend / batch before deleted head | 5,000 | 25,000 | 0 | 1,484,558.45 | 0 | 802,416.26 | 0 | 249,690.55 | 0.14 | 6,994.88 | crlist |
| crud | prepend / batch after garbage collection | 5,000 | 25,000 | 0 | 1,938,452.13 | 0 | 1,338,576.99 | 0 | 268,205.5 | 0.14 | 7,231.02 | crlist |
| crud | insert / single before head | 5,000 | 250 | 0 | 407,985.42 | 0.01 | 98,387 | 0.01 | 147,885.94 | 1.61 | 621.28 | crlist |
| crud | insert / single after head | 5,000 | 250 | 0 | 239,143.83 | 0.01 | 80,664.65 | 0.01 | 123,872.64 | 1.61 | 620.18 | crlist |
| crud | insert / single before middle | 5,000 | 250 | 0 | 245,987.21 | 0.01 | 71,973.06 | 0.01 | 159,888.36 | 1.56 | 640.32 | crlist |
| crud | insert / single after middle | 5,000 | 250 | 0 | 272,883.16 | 0.01 | 101,024.55 | 0.01 | 154,122.15 | 1.55 | 645.03 | crlist |
| crud | insert / single before tail | 5,000 | 250 | 0 | 255,436.72 | 0.01 | 108,004.61 | 0.01 | 179,206.46 | 1.54 | 650.31 | crlist |
| crud | insert / single after tail | 5,000 | 250 | 0 | 445,099.63 | 0.01 | 88,775.98 | 0 | 257,523.82 | 1.51 | 664.35 | crlist |
| crud | insert / batch before head | 5,000 | 25,000 | 0 | 1,940,106.43 | 0 | 1,394,920.37 | 0 | 277,649.48 | 0.14 | 6,975.71 | crlist |
| crud | insert / batch after head | 5,000 | 25,000 | 0 | 1,918,584.78 | 0 | 1,192,712.81 | 0 | 253,807.79 | 0.14 | 7,018.09 | crlist |
| crud | insert / batch before middle | 5,000 | 25,000 | 0 | 1,135,365.65 | 0 | 950,586.43 | 0 | 254,307.7 | 0.15 | 6,821.55 | crlist |
| crud | insert / batch after middle | 5,000 | 25,000 | 0 | 1,077,465.69 | 0 | 1,357,160.95 | 0 | 260,335.43 | 0.15 | 6,864.98 | yjs |
| crud | insert / batch before tail | 5,000 | 25,000 | 0 | 1,788,898.01 | 0 | 880,181.4 | 0 | 228,933.53 | 0.14 | 6,945.34 | crlist |
| crud | insert / batch after tail | 5,000 | 25,000 | 0 | 1,795,364.63 | 0 | 706,690.85 | 0.01 | 188,234.78 | 0.14 | 6,919.75 | crlist |
| crud | insert / repeated before head | 5,000 | 250 | 0 | 282,187.11 | 0.01 | 126,777.87 | 0 | 203,799.31 | 1.6 | 624.6 | crlist |
| crud | insert / repeated before middle | 5,000 | 250 | 0 | 334,018.74 | 0.01 | 101,277.88 | 0 | 223,534.62 | 1.57 | 636.41 | crlist |
| crud | insert / repeated before tail | 5,000 | 250 | 0 | 326,269.38 | 0.04 | 23,860.24 | 0 | 254,266.08 | 1.51 | 663.26 | crlist |
| crud | insert / random positions | 5,000 | 250 | 0 | 295,432.5 | 0.01 | 83,064.56 | 0.01 | 70,938.55 | 1.59 | 630.68 | crlist |
| crud | insert / alternating head and tail | 5,000 | 250 | 0 | 452,277.49 | 0.01 | 70,123.49 | 0.01 | 193,554.78 | 1.61 | 619.74 | crlist |
| crud | overwrite / head | 5,000 | 250 | 0.01 | 157,796.11 | 0.02 | 59,396.77 | 0.01 | 84,454.52 | 1.7 | 589.25 | crlist |
| crud | overwrite / middle | 5,000 | 250 | 0 | 240,681.76 | 0.02 | 59,939.43 | 0.01 | 127,019.16 | 1.67 | 600.53 | crlist |
| crud | overwrite / tail | 5,000 | 250 | 0 | 271,240.58 | 0.01 | 69,862.47 | 0.01 | 151,984.65 | 1.59 | 628.92 | crlist |
| crud | overwrite / random | 5,000 | 250 | 0.01 | 89,267.7 | 0.04 | 28,348.48 | 0.01 | 128,024.25 | 1.8 | 555.1 | json-joy |
| crud | overwrite / same head repeatedly | 5,000 | 250 | 0 | 349,307.39 | 0.01 | 87,887.36 | 0 | 205,693.6 | 1.7 | 588.13 | crlist |
| crud | overwrite / same middle repeatedly | 5,000 | 250 | 0 | 271,467.96 | 0.01 | 81,179.06 | 0.01 | 168,222.73 | 1.63 | 613.85 | crlist |
| crud | overwrite / same tail repeatedly | 5,000 | 250 | 0 | 552,256.74 | 0.01 | 85,179.6 | 0 | 208,149.81 | 1.58 | 632.87 | crlist |
| crud | overwrite / random visible entries | 5,000 | 250 | 0.01 | 111,418.08 | 0.04 | 23,723.93 | 0.01 | 164,467.62 | 1.82 | 548.02 | json-joy |
| crud | overwrite / after insert | 5,000 | 250 | 0 | 358,157.98 | 0.01 | 83,640.41 | 0.08 | 12,985.5 | 1.65 | 605.97 | crlist |
| crud | overwrite / after delete | 5,000 | 250 | 0 | 206,440.28 | 0.01 | 89,733.65 | 0.01 | 187,499.48 | 1.62 | 617.42 | crlist |
| crud | delete / head | 5,000 | 250 | 0 | 239,570.77 | 0.01 | 87,341.83 | 0.08 | 12,793.71 | 0.18 | 5,682.16 | crlist |
| crud | delete / middle | 5,000 | 250 | 0 | 321,070.17 | 0.01 | 103,068.9 | 0.01 | 143,953.58 | 0.18 | 5,625.62 | crlist |
| crud | delete / tail | 5,000 | 250 | 0 | 460,997.75 | 0.01 | 80,322.29 | 0 | 281,728.55 | 0.17 | 5,716.5 | crlist |
| crud | delete / range from head | 5,000 | 5,000 | 0 | 1,874,994.14 | 0 | 6,953,561.34 | 0 | 576,950.28 | 0.01 | 81,897.06 | yjs |
| crud | delete / range from middle | 5,000 | 5,000 | 0 | 1,425,454.16 | 0 | 4,626,035.89 | 0 | 297,991.77 | 0.01 | 71,736.48 | yjs |
| crud | delete / range from tail | 5,000 | 5,000 | 0 | 1,631,864.97 | 0 | 6,925,773.71 | 0 | 901,921.13 | 0.01 | 74,370.86 | yjs |
| crud | delete / every other entry | 5,000 | 2,500 | 0 | 273,945.01 | 0.06 | 15,580.86 | 0.07 | 15,231.47 | 0.17 | 5,898.38 | crlist |
| crud | delete / all entries from head one by one | 5,000 | 5,000 | 0 | 368,764.5 | 0.01 | 120,798.34 | 0.01 | 116,193.46 | 0.16 | 6,414.91 | crlist |
| crud | delete / all entries from middle outward | 5,000 | 5,000 | 0 | 353,533.93 | 0.01 | 137,894.93 | 0 | 257,746.16 | 0.16 | 6,288.82 | crlist |
| crud | delete / all entries from tail one by one | 5,000 | 5,000 | 0 | 605,661.53 | 0.01 | 132,058.73 | 0 | 363,078.6 | 0.15 | 6,484.63 | crlist |
| crud | delete / all entries in random order | 5,000 | 5,000 | 0.09 | 10,838.2 | 10.31 | 96.99 | 7.04 | 141.98 | 0.18 | 5,478.88 | crlist |
| crud | delete / already deleted head | 5,000 | 250 | 0 | 343,274.09 | 0 | 321,281.01 | 0 | 610,630.34 | 0.02 | 62,214.95 | json-joy |
| crud | delete / already deleted middle | 5,000 | 250 | 0 | 415,336.21 | 0 | 299,821.67 | 0 | 954,810.72 | 0.01 | 70,549.58 | json-joy |
| crud | delete / already deleted tail | 5,000 | 250 | 0 | 1,149,240.35 | 0 | 268,417.46 | 0 | 723,239.42 | 0.02 | 52,344.92 | crlist |
| crud | mixed / append overwrite delete tail | 5,000 | 250 | 0 | 286,734.73 | 0.02 | 66,660.16 | 0.01 | 145,148.84 | 1.35 | 742.6 | crlist |
| crud | mixed / prepend overwrite delete head | 5,000 | 250 | 0 | 244,884.61 | 0.01 | 78,951.47 | 0.09 | 11,540.61 | 1.4 | 715.13 | crlist |
| crud | mixed / insert overwrite delete middle | 5,000 | 250 | 0 | 204,456.83 | 0.01 | 81,192.82 | 0.01 | 177,166.25 | 1.35 | 740 | crlist |
| crud | mixed / append prepend insert overwrite delete | 5,000 | 250 | 0 | 289,827.52 | 0.01 | 96,116.69 | 0 | 214,462.31 | 1.38 | 724.69 | crlist |
| mags | snapshot | 5,000 | 250 | 0.32 | 3,102.58 | 2.64 | 378.86 | 5.8 | 172.54 | 14.91 | 67.09 | crlist |
| mags | snapshot / clean state | 5,000 | 250 | 0.2 | 4,985.94 | 2.51 | 399.1 | 6.78 | 147.44 | 14.92 | 67.02 | crlist |
| mags | snapshot / tombstoned state 50% deleted | 5,000 | 250 | 0.15 | 6,715.35 | 1.25 | 798.21 | 2.18 | 457.76 | 14.92 | 67 | crlist |
| mags | snapshot / tombstoned state 90% deleted | 5,000 | 250 | 0.02 | 56,605.06 | 0.25 | 3,934.82 | 0.35 | 2,827.53 | 14.95 | 66.88 | crlist |
| mags | snapshot / after garbage collection | 5,000 | 250 | 0.14 | 7,346.18 | 1.25 | 801 | 2.21 | 452.83 | 14.92 | 67.05 | crlist |
| mags | acknowledge | 5,000 | 250 | 0 | 3,330,580.05 | n/a | n/a | n/a | n/a | n/a | n/a | n/a |
| mags | acknowledge / clean state | 5,000 | 250 | 0 | 4,915,840.81 | n/a | n/a | n/a | n/a | n/a | n/a | n/a |
| mags | acknowledge / 50% deleted state | 5,000 | 250 | 0 | 2,438,453.44 | n/a | n/a | n/a | n/a | n/a | n/a | n/a |
| mags | acknowledge / 90% deleted state | 5,000 | 250 | 0 | 3,059,151.76 | n/a | n/a | n/a | n/a | n/a | n/a | n/a |
| mags | garbage collect | 5,000 | 250 | 0 | 1,579,399.58 | n/a | n/a | n/a | n/a | n/a | n/a | n/a |
| mags | garbage collect / no eligible tombstones | 5,000 | 250 | 0 | 4,082,832.51 | n/a | n/a | n/a | n/a | n/a | n/a | n/a |
| mags | garbage collect / 50% eligible tombstones | 5,000 | 250 | 0 | 768,150.63 | n/a | n/a | n/a | n/a | n/a | n/a | n/a |
| mags | garbage collect / 90% eligible tombstones | 5,000 | 250 | 0 | 795,643.69 | n/a | n/a | n/a | n/a | n/a | n/a | n/a |
| mags | garbage collect / partial frontiers 2 replicas | 5,000 | 250 | 0 | 3,979,370.94 | n/a | n/a | n/a | n/a | n/a | n/a | n/a |
| mags | garbage collect / partial frontiers 10 replicas | 5,000 | 250 | 0 | 11,064,884.48 | n/a | n/a | n/a | n/a | n/a | n/a | n/a |
| mags | post-gc read / full iteration visible values | 5,000 | 250 | 0.19 | 5,354.36 | 0.07 | 14,693.32 | 0.44 | 2,286.03 | 0.03 | 37,847.23 | automerge |
| mags | merge ordered deltas | 5,000 | 250 | 0.01 | 124,117.71 | 0.01 | 75,026.18 | 0.04 | 25,481.72 | 2.72 | 367.2 | crlist |
| mags | merge shuffled gossip | 5,000 | 250 | 0.98 | 1,023.73 | 0.43 | 2,314.91 | n/a | n/a | 0.68 | 1,462.53 | yjs |
| mags | merge / append head delta into equal replica | 5,000 | 1 | 0.03 | 30,212.39 | 0.05 | 21,267.55 | 0.03 | 31,479.21 | 3.1 | 322.12 | json-joy |
| mags | merge / append tail delta into equal replica | 5,000 | 1 | 0.09 | 11,697.55 | 0.03 | 33,893.71 | 0.01 | 104,777.87 | 2.87 | 348.38 | json-joy |
| mags | merge / prepend head delta into equal replica | 5,000 | 1 | 0.03 | 38,537.13 | 0.02 | 42,964.55 | 0.01 | 134,934.56 | 2.99 | 334.18 | json-joy |
| mags | merge / insert middle delta into equal replica | 5,000 | 1 | 0.06 | 17,266.09 | 0.02 | 53,197.15 | 0.01 | 87,665.47 | 3.18 | 314.93 | json-joy |
| mags | merge / overwrite head delta into equal replica | 5,000 | 1 | 0.03 | 29,376.34 | 0.02 | 60,514.37 | 0.01 | 96,562.38 | 3.02 | 330.84 | json-joy |
| mags | merge / overwrite middle delta into equal replica | 5,000 | 1 | 0.09 | 11,481.06 | 0.03 | 35,109.89 | 0.01 | 91,107.87 | 2.99 | 334.86 | json-joy |
| mags | merge / overwrite tail delta into equal replica | 5,000 | 1 | 0.03 | 38,989.39 | 0.02 | 44,183.27 | 0.01 | 97,789.95 | 3.32 | 301.41 | json-joy |
| mags | merge / delete head delta into equal replica | 5,000 | 1 | 0.03 | 37,565.74 | 0.01 | 81,175.42 | 0.01 | 75,414.78 | 1.55 | 644.14 | yjs |
| mags | merge / delete middle delta into equal replica | 5,000 | 1 | 0.11 | 9,000.41 | 0.03 | 35,750.04 | 0.02 | 56,637.97 | 1.61 | 621.64 | json-joy |
| mags | merge / delete tail delta into equal replica | 5,000 | 1 | 0.02 | 64,416.39 | 0.01 | 88,206.76 | 0.01 | 113,856.31 | 1.54 | 648.02 | json-joy |
| mags | merge / duplicate delta ignored | 5,000 | 250 | 0 | 882,067.57 | 0.02 | 50,818.1 | 0.01 | 102,625.24 | 0.03 | 33,779.47 | crlist |
| mags | merge / old delta ignored after merge | 5,000 | 250 | 0 | 1,025,998.81 | 0.01 | 68,395.65 | 0 | 446,469.23 | 0.02 | 41,636.67 | crlist |
| mags | merge / ordered 1,000 append deltas | 5,000 | 1,000 | 0 | 510,043.52 | 0.01 | 78,950.76 | 0 | 359,903.7 | 3.01 | 332.61 | crlist |
| mags | merge / ordered 1,000 prepend deltas | 5,000 | 1,000 | 0 | 310,441.87 | 0.01 | 144,969.98 | 0.01 | 141,081.83 | 3.07 | 325.32 | crlist |
| mags | merge / ordered 1,000 middle insert deltas | 5,000 | 1,000 | 0 | 375,495.18 | 0.01 | 133,727.78 | 0 | 372,444.89 | 3.05 | 327.91 | crlist |
| mags | merge / shuffled 1,000 mixed deltas | 5,000 | 1,000 | 1.02 | 978.83 | 0.99 | 1,006.02 | n/a | n/a | 0.83 | 1,210.64 | automerge |
| mags | merge / reverse ordered 1,000 mixed deltas | 5,000 | 1,000 | 0.28 | 3,516.72 | 0.92 | 1,091.68 | n/a | n/a | 0.83 | 1,203.33 | crlist |
| mags | merge / concurrent prepends same head | 5,000 | 2 | 0.07 | 13,910.62 | 0.1 | 9,661.84 | n/a | n/a | 14.06 | 71.12 | crlist |
| mags | merge / concurrent appends same tail | 5,000 | 2 | 0.02 | 46,280.23 | 0.02 | 42,015.92 | n/a | n/a | 9.77 | 102.33 | crlist |
| mags | merge / concurrent inserts same middle position | 5,000 | 2 | 0.06 | 16,157.05 | 0.05 | 19,469.65 | n/a | n/a | 9.93 | 100.75 | yjs |
| mags | merge / concurrent overwrites same head | 5,000 | 2 | 0.02 | 40,922.39 | 0.02 | 41,175.14 | n/a | n/a | 8.05 | 124.23 | yjs |
| mags | merge / concurrent overwrites same middle | 5,000 | 2 | 0.08 | 12,133.2 | 0.03 | 35,457.85 | n/a | n/a | 7.86 | 127.21 | yjs |
| mags | merge / concurrent overwrites same tail | 5,000 | 2 | 0.02 | 44,735.72 | 0.03 | 38,455.62 | n/a | n/a | 13.81 | 72.43 | crlist |
| mags | merge / concurrent deletes same head | 5,000 | 2 | 0.02 | 42,579.46 | 0.01 | 69,922.74 | 0.02 | 49,492.7 | 7.04 | 142 | yjs |
| mags | merge / concurrent deletes same middle | 5,000 | 2 | 0.11 | 9,443.9 | 0.02 | 58,735.43 | 0.02 | 52,401.29 | 7.17 | 139.54 | yjs |
| mags | merge / concurrent deletes same tail | 5,000 | 2 | 0.01 | 88,912.6 | 0.02 | 63,617.28 | 0.01 | 69,027.4 | 4.93 | 203.02 | crlist |
| mags | merge / concurrent overwrite delete same entry | 5,000 | 2 | 0.17 | 5,936.23 | 0.07 | 15,350.96 | 0.06 | 15,505.92 | 6.46 | 154.77 | json-joy |
| mags | merge / forked replicas rejoin after 250 ops each | 5,000 | 500 | 0 | 223,047.2 | 0.01 | 96,180.02 | n/a | n/a | 2.8 | 357.11 | crlist |
| mags | merge / 10 replicas gossip convergence | 5,000 | 100 | 0 | 223,633.6 | 0.01 | 109,706.26 | n/a | n/a | 5.97 | 167.55 | crlist |
| mags | merge / snapshot merge into stale replica | 5,000 | 5,350 | 0 | 1,151,143.9 | 0 | 735,323.83 | 0 | 407,731.66 | 0.03 | 37,036.01 | crlist |
| class | constructor / hydrate snapshot | 5,000 | 250 | 3.65 | 273.76 | 4.8 | 208.51 | 12.92 | 77.41 | 133.82 | 7.47 | crlist |
| class | read / head | 5,000 | 250 | 0 | 3,367,819.81 | 0 | 4,351,155.67 | 0 | 1,809,273.61 | 0 | 3,504,541.89 | yjs |
| class | read / middle | 5,000 | 250 | 0 | 10,853,520.88 | 0 | 11,388,483.97 | 0 | 4,103,675.25 | 0 | 11,315,801.39 | yjs |
| class | read / tail | 5,000 | 250 | 0 | 2,691,963.95 | 0 | 2,475,223.02 | 0 | 1,671,972.39 | 0 | 4,026,867.26 | automerge |
| class | find near head | 5,000 | 250 | 0 | 1,287,127.18 | n/a | n/a | n/a | n/a | 0 | 1,595,965.4 | automerge |
| class | find near middle | 5,000 | 250 | 0.04 | 28,417.85 | n/a | n/a | n/a | n/a | 0.02 | 44,011.16 | automerge |
| class | find near tail | 5,000 | 250 | 0.05 | 19,097.75 | n/a | n/a | n/a | n/a | 0.04 | 22,662.52 | automerge |
| class | iterate visible values | 5,000 | 250 | 0.12 | 8,179.74 | 0.13 | 7,851.42 | 1.06 | 939.13 | 0.06 | 17,250.5 | automerge |
| class | collect visible values to array | 5,000 | 250 | 0.11 | 9,329.29 | 0.12 | 8,059.04 | 0.98 | 1,023.99 | 0.06 | 17,003.24 | automerge |
| class | append / single after tail | 5,000 | 250 | 0 | 348,648.78 | 0.01 | 78,629.68 | 0.01 | 189,981.01 | 1.57 | 638.05 | crlist |
| class | append / batch after tail | 5,000 | 25,000 | 0 | 1,917,651.74 | 0 | 687,874.21 | 0.01 | 175,590.41 | 0.15 | 6,728.73 | crlist |
| class | prepend / single before head | 5,000 | 250 | 0 | 276,636.19 | 0.01 | 132,446.4 | 0.01 | 95,486.14 | 1.66 | 603.78 | crlist |
| class | prepend / batch before head | 5,000 | 25,000 | 0 | 2,185,146.98 | 0 | 1,370,941.21 | 0 | 266,961.81 | 0.15 | 6,759.94 | crlist |
| class | insert / single before middle | 5,000 | 250 | 0 | 260,175.46 | 0.01 | 105,843.99 | 0 | 233,140.23 | 1.65 | 607.51 | crlist |
| class | insert / batch before middle | 5,000 | 25,000 | 0 | 1,466,452.32 | 0 | 1,361,140.97 | 0 | 280,503.95 | 0.15 | 6,638.12 | crlist |
| class | overwrite / head | 5,000 | 250 | 0 | 241,777.63 | 0.01 | 81,869.43 | 0.01 | 171,289.66 | 1.75 | 570.52 | crlist |
| class | overwrite / middle | 5,000 | 250 | 0 | 290,684.83 | 0.01 | 87,231.05 | 0.01 | 198,101.4 | 1.69 | 590.04 | crlist |
| class | overwrite / tail | 5,000 | 250 | 0 | 269,033.59 | 0.01 | 74,096.2 | 0.01 | 152,879.02 | 1.62 | 615.52 | crlist |
| class | overwrite / random | 5,000 | 250 | 0.01 | 72,348.3 | 0.05 | 21,457.67 | 0.01 | 142,622.83 | 1.89 | 528.18 | json-joy |
| class | remove / head | 5,000 | 250 | 0 | 240,126.02 | 0.01 | 85,385.28 | 0.01 | 93,096.94 | 0.2 | 4,902.91 | crlist |
| class | remove / middle | 5,000 | 250 | 0 | 321,115.53 | 0.01 | 110,917.13 | 0.01 | 183,327.06 | 0.2 | 5,101.83 | crlist |
| class | remove / tail | 5,000 | 250 | 0 | 401,650.3 | 0.01 | 70,656.64 | 0 | 377,705.12 | 0.18 | 5,658.99 | crlist |
| class | remove / range from head | 5,000 | 5,000 | 0 | 2,030,292.78 | 0 | 7,447,735.52 | 0 | 764,959.82 | 0.01 | 78,881.24 | yjs |
| class | remove / range from middle | 5,000 | 5,000 | 0 | 1,420,926.44 | 0 | 6,101,899.28 | 0 | 750,748.95 | 0.01 | 69,065.68 | yjs |
| class | remove / range from tail | 5,000 | 5,000 | 0 | 1,504,298.23 | 0 | 7,266,808.13 | 0 | 925,910.67 | 0.01 | 75,757.83 | yjs |
| class | mixed / append overwrite remove tail | 5,000 | 250 | 0 | 291,016.78 | 0.01 | 83,086.4 | 0.04 | 23,276.43 | 1.17 | 853.06 | crlist |
| class | mixed / prepend overwrite remove head | 5,000 | 250 | 0 | 400,355.52 | 0.01 | 113,681.68 | 0 | 229,549.23 | 1.26 | 792.04 | crlist |
| class | mixed / insert overwrite remove middle | 5,000 | 250 | 0 | 390,295.69 | 0.01 | 110,122.94 | 0 | 266,656.71 | 1.22 | 818.5 | crlist |
| class | paste / insert 10,000 entries at cursor | 5,000 | 10,000 | 0 | 907,739.94 | 0 | 1,497,526.31 | 0.01 | 197,747 | 0.13 | 7,462.28 | yjs |
| class | render / join visible entries to string | 5,000 | 250 | 0.18 | 5,670.72 | 0.21 | 4,708.28 | 1.14 | 873.42 | 0.14 | 7,044.52 | automerge |
| class | snapshot | 5,000 | 250 | 0.12 | 8,101 | 2.55 | 392.41 | 5.07 | 197.29 | 14.8 | 67.58 | crlist |
| class | snapshot / tombstoned state 50% deleted | 5,000 | 250 | 0.06 | 16,003.62 | 1.28 | 782.26 | 2.19 | 456.85 | 14.85 | 67.36 | crlist |
| class | snapshot / after garbage collection | 5,000 | 250 | 0.09 | 11,543.76 | 0.12 | 8,047.97 | 0.99 | 1,010.93 | 0.06 | 15,928.09 | automerge |
| class | acknowledge | 5,000 | 250 | 0.01 | 151,784.04 | n/a | n/a | n/a | n/a | n/a | n/a | n/a |
| class | acknowledge / 50% deleted state | 5,000 | 250 | 0.01 | 198,795.46 | n/a | n/a | n/a | n/a | n/a | n/a | n/a |
| class | acknowledge / 90% deleted state | 5,000 | 250 | 0.01 | 141,891.55 | n/a | n/a | n/a | n/a | n/a | n/a | n/a |
| class | garbage collect | 5,000 | 250 | 0.08 | 12,128.87 | 0.13 | 7,869.81 | 0.97 | 1,025.99 | 0.06 | 17,614.93 | automerge |
| class | garbage collect / no eligible tombstones | 5,000 | 250 | 0.09 | 11,511.19 | 0.2 | 5,119.72 | 1 | 1,003.39 | 0.06 | 17,282.33 | automerge |
| class | garbage collect / 90% eligible tombstones | 5,000 | 250 | 0.09 | 11,660.54 | 0.19 | 5,136.57 | 0.98 | 1,023.72 | 0.06 | 17,107.66 | automerge |
| class | merge ordered deltas | 5,000 | 250 | 0.01 | 192,889.03 | 0.01 | 112,585.48 | 0 | 338,291.79 | 2.65 | 377.57 | json-joy |
| class | merge shuffled gossip | 5,000 | 250 | 0.88 | 1,137.48 | 0.3 | 3,322.83 | n/a | n/a | 0.67 | 1,495.93 | yjs |
| class | merge / duplicate delta ignored | 5,000 | 250 | 0 | 625,581.79 | 0.03 | 34,059.99 | 0 | 478,485.38 | 0.03 | 34,766.75 | crlist |
| class | merge / concurrent prepends same head | 5,000 | 2 | 0.05 | 19,896.34 | 0.05 | 20,574.86 | n/a | n/a | 8 | 125.01 | yjs |
| class | merge / concurrent appends same tail | 5,000 | 2 | 0.02 | 59,470.71 | 0.02 | 54,697.11 | n/a | n/a | 7.85 | 127.37 | crlist |
| class | merge / concurrent inserts same middle position | 5,000 | 2 | 0.05 | 19,511.43 | 0.02 | 42,318.19 | n/a | n/a | 9.9 | 101 | yjs |
| class | merge / forked replicas rejoin after 250 ops each | 5,000 | 500 | 0.01 | 93,591.39 | 0.01 | 131,171.35 | n/a | n/a | 2.76 | 362.9 | yjs |
| latency | append tail write to remote visible | 5,000 | 250 | 0.09 | 11,536.74 | 0.16 | 6,341.79 | 9.64 | 103.71 | 4.84 | 206.51 | crlist |
| latency | prepend head write to remote visible | 5,000 | 250 | 0.01 | 115,766.2 | 0.02 | 56,805.79 | 0.01 | 72,645.4 | 4.9 | 204.02 | crlist |
| latency | middle insert write to remote visible | 5,000 | 250 | 0.04 | 24,936.47 | 0.09 | 11,599.7 | 2.96 | 337.31 | 4.94 | 202.38 | crlist |
| latency | head insert write to remote visible | 5,000 | 250 | 0.02 | 61,837.79 | 0.01 | 71,633.32 | 0.01 | 89,967.83 | 4.9 | 204.27 | json-joy |
| latency | overwrite head write to remote visible | 5,000 | 250 | 0.01 | 136,490.97 | 0.02 | 43,023.85 | 0.01 | 99,577 | 5 | 199.81 | crlist |
| latency | overwrite middle write to remote visible | 5,000 | 250 | 0.04 | 24,974.84 | 0.08 | 11,923.54 | 1.7 | 586.55 | 4.94 | 202.54 | crlist |
| latency | overwrite tail write to remote visible | 5,000 | 250 | 0.08 | 12,784.16 | 0.15 | 6,467.53 | 3.43 | 291.19 | 4.78 | 209.14 | crlist |
| latency | head delete to remote hidden | 5,000 | 250 | 0.63 | 1,578.76 | 0.33 | 3,020.82 | 7.66 | 130.47 | 1.82 | 549.63 | yjs |
| latency | middle delete to remote hidden | 5,000 | 250 | 0.68 | 1,475.91 | 0.33 | 3,038.62 | 7.39 | 135.32 | 1.8 | 555.54 | yjs |
| latency | tail delete to remote hidden | 5,000 | 250 | 0.23 | 4,359.8 | 0.28 | 3,536.26 | 7.26 | 137.67 | 1.76 | 567.89 | crlist |
| latency | append tail write to 10 remotes visible | 5,000 | 2,500 | 0.07 | 14,594.62 | 0.13 | 7,542.74 | 13.16 | 75.98 | 3.27 | 305.99 | crlist |
| latency | prepend head write to 10 remotes visible | 5,000 | 2,500 | 0 | 237,503.13 | 0.01 | 132,848.84 | 0.01 | 68,872.09 | 3.27 | 306.27 | crlist |
| latency | middle insert write to 10 remotes visible | 5,000 | 2,500 | 0.04 | 23,428.57 | 0.08 | 12,860.86 | 4.75 | 210.37 | 3.32 | 301.57 | crlist |
| latency | overwrite middle write to 10 remotes visible | 5,000 | 2,500 | 0.04 | 24,888.2 | 0.07 | 14,093.15 | 3.27 | 305.63 | 3.28 | 304.78 | crlist |
| latency | delete middle to 10 remotes hidden | 5,000 | 2,500 | 0.8 | 1,245.1 | 0.33 | 3,063.36 | 10.88 | 91.89 | 1.59 | 627.27 | yjs |
| latency | out-of-order write delivery to remote visible | 5,000 | 250 | 1.38 | 724.59 | 85.87 | 11.65 | n/a | n/a | 16.11 | 62.07 | crlist |
| latency | out-of-order delete delivery to remote convergence | 5,000 | 165 | 2.32 | 431.37 | 0.31 | 3,277.43 | 9.34 | 107.12 | 6.48 | 154.34 | yjs |
| latency | out-of-order append delivery to convergence | 5,000 | 250 | 1.24 | 807.77 | 21.2 | 47.17 | n/a | n/a | 16.35 | 61.18 | crlist |
| latency | out-of-order prepend delivery to convergence | 5,000 | 250 | 1.29 | 772.24 | 21.76 | 45.95 | 0.05 | 19,582.24 | 16.1 | 62.13 | json-joy |
| latency | out-of-order middle insert delivery to convergence | 5,000 | 250 | 1.35 | 742.55 | 85.54 | 11.69 | n/a | n/a | 15.92 | 62.82 | crlist |
| latency | out-of-order overwrite delivery to convergence | 5,000 | 129 | 1.76 | 569.41 | n/a | n/a | 270.53 | 3.7 | 76.78 | 13.02 | crlist |
| latency | offline burst 1,000 ops then sync | 5,000 | 1,000 | 0 | 289,787.29 | 0.02 | 57,597.81 | 0 | 351,953.43 | 2.83 | 353.63 | json-joy |
| latency | forked replicas mixed ops then converge | 5,000 | 500 | 0 | 357,786.36 | 0.01 | 154,856.01 | n/a | n/a | 2.82 | 354.44 | crlist |
| latency | duplicate shuffled gossip to convergence | 5,000 | 500 | 0.46 | 2,163.29 | 0.15 | 6,891.1 | n/a | n/a | 0.37 | 2,698.5 | yjs |
| latency | remote snapshot hydrate then apply pending deltas | 5,000 | 250 | 0.02 | 55,964.98 | 0.03 | 36,113.98 | 0.04 | 25,786.46 | 0.61 | 1,641.38 | crlist |
| workload | local app session | 5,000 | 250 | 0.01 | 180,504.89 | 0.01 | 107,489.76 | 0.01 | 170,853.49 | 1.09 | 916.64 | crlist |
| workload | read heavy session | 5,000 | 250 | 0 | 3,041,621.55 | 0 | 5,688,799.89 | 0 | 562,955.29 | 0 | 2,893,217.14 | yjs |
| workload | write heavy session | 5,000 | 250 | 0.01 | 175,741.98 | 0.01 | 115,090 | 0 | 207,022.36 | 1.11 | 902.48 | json-joy |
| workload | append tail heavy session | 5,000 | 250 | 0 | 521,422.11 | 0.01 | 96,132.59 | 0 | 234,751.7 | 1.38 | 724.68 | crlist |
| workload | prepend head heavy session | 5,000 | 250 | 0.01 | 185,974.13 | 0.01 | 145,855.35 | 0 | 210,739.81 | 1.41 | 710.63 | json-joy |
| workload | insert middle heavy session | 5,000 | 250 | 0.01 | 140,871.5 | 0.01 | 128,169.57 | 0 | 230,320.28 | 1.41 | 708.22 | json-joy |
| workload | overwrite heavy session | 5,000 | 250 | 0 | 203,414.1 | 0.02 | 57,080.77 | 0 | 265,203.59 | 1.14 | 875.66 | json-joy |
| workload | delete heavy session | 5,000 | 250 | 0 | 242,411.31 | 0.01 | 113,660.49 | 0 | 346,625.26 | 0.16 | 6,086.15 | json-joy |
| workload | balanced append prepend insert overwrite delete session | 5,000 | 250 | 0.01 | 199,501.09 | 0.01 | 121,312.35 | 0 | 246,499.95 | 1.19 | 842.72 | json-joy |
| workload | random edit session | 5,000 | 250 | 0.01 | 109,828.9 | 0.01 | 68,707.18 | 0.01 | 100,006.64 | 1.09 | 916.29 | crlist |
| workload | text editing session | 5,000 | 250 | 0.01 | 184,516.96 | 0.01 | 123,856 | 0 | 253,862.52 | 1.41 | 707.64 | json-joy |
| workload | collaborative offline session | 5,000 | 500 | 0 | 349,971.2 | 0.01 | 156,494.82 | n/a | n/a | 2.81 | 355.85 | crlist |
| workload | sync and cleanup session | 5,000 | 252 | 0 | 277,545.27 | 0.01 | 152,128.64 | n/a | n/a | 2.81 | 355.73 | crlist |
| workload | long lived tombstoned session | 5,000 | 250 | 0 | 303,503.77 | 0.01 | 94,926.23 | 0 | 227,625.55 | 1.59 | 628.46 | crlist |
| workload | sparse visible session | 5,000 | 250 | 0 | 416,556.28 | 0.1 | 10,155.96 | 0.01 | 125,481.6 | 0.81 | 1,237.84 | crlist |
| workload | post-gc edit session | 5,000 | 250 | 0 | 692,749.13 | 0.01 | 100,803.85 | 0 | 227,929.16 | 1.37 | 729.63 | crlist |

## License

Apache-2.0
