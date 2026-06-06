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
| crud | create / empty list | 5,000 | 250 | 0.01 | 74,747.71 | 0.11 | 9,096.19 | 0.02 | 60,113.73 | 0.31 | 3,183.22 | crlist |
| crud | create / hydrate snapshot | 5,000 | 250 | 3.69 | 270.88 | 4.85 | 206.14 | 13.24 | 75.54 | 131.92 | 7.58 | crlist |
| crud | create / hydrate clean snapshot | 5,000 | 250 | 3.57 | 279.77 | 4.78 | 209.29 | 12.83 | 77.94 | 132.21 | 7.56 | crlist |
| crud | create / hydrate tombstoned snapshot | 5,000 | 250 | 1.65 | 604.62 | 2.47 | 405.37 | 6.43 | 155.49 | 117.13 | 8.54 | crlist |
| crud | read / head | 5,000 | 250 | 0 | 2,486,300.48 | 0 | 1,542,134.19 | 0 | 339,557.19 | 0 | 3,718,522.71 | automerge |
| crud | read / middle | 5,000 | 250 | 0 | 7,296,713.56 | 0 | 1,348,232.2 | 0 | 442,770.97 | 0 | 8,162,998.76 | automerge |
| crud | read / tail | 5,000 | 250 | 0 | 2,755,549.68 | 0 | 1,184,065.32 | 0 | 483,976.51 | 0 | 3,009,691.21 | automerge |
| crud | read / random indexed reads | 5,000 | 250 | 0 | 1,170,631.2 | 0 | 727,090.82 | 0.01 | 163,800.49 | 0 | 954,916.48 | crlist |
| crud | read / sequential indexed reads from head | 5,000 | 250 | 0 | 2,344,116.27 | 0 | 2,732,927.4 | 0 | 293,049.57 | 0 | 1,147,541.74 | yjs |
| crud | read / sequential indexed reads from middle | 5,000 | 250 | 0 | 9,701,579.42 | 0 | 8,290,224.17 | 0 | 813,961.06 | 0 | 10,281,296.27 | automerge |
| crud | read / sequential indexed reads from tail | 5,000 | 250 | 0 | 8,703,826.2 | 0 | 8,424,883.74 | 0 | 719,940.33 | 0 | 11,753,091.06 | automerge |
| crud | read / full iteration visible values | 5,000 | 250 | 0.35 | 2,861.93 | 0.16 | 6,426.58 | 1.2 | 834.43 | 0.05 | 19,093.83 | automerge |
| crud | read / collect visible values to array | 5,000 | 250 | 0.36 | 2,803.22 | 0.15 | 6,827.62 | 1.02 | 976.33 | 0.08 | 12,013.68 | automerge |
| crud | read / visible sparse over deleted entries | 5,000 | 250 | 0 | 6,539,880.19 | 0.02 | 42,968.51 | 0.01 | 67,022.17 | 0 | 2,637,353.36 | crlist |
| crud | find / head | 5,000 | 250 | 0 | 1,358,799.04 | 0 | 1,742,342.41 | 0 | 955,577.13 | 0 | 1,204,291.13 | yjs |
| crud | find / middle | 5,000 | 250 | 0.02 | 56,424.33 | 0.07 | 13,590.36 | 0.53 | 1,895.77 | 0.02 | 45,971.78 | crlist |
| crud | find / tail | 5,000 | 250 | 0.03 | 34,735.73 | 0.13 | 7,632.96 | 0.94 | 1,067.76 | 0.04 | 22,636.34 | crlist |
| crud | find / missing value | 5,000 | 250 | 0.18 | 5,411.24 | 0.27 | 3,639.54 | 2 | 500.71 | 0.05 | 21,450.62 | automerge |
| crud | append / single after tail | 5,000 | 250 | 0 | 266,170.38 | 0.02 | 62,587.17 | 0.01 | 106,891.78 | 1.58 | 634.78 | crlist |
| crud | append / batch after tail | 5,000 | 25,000 | 0 | 1,869,005.86 | 0 | 614,632.74 | 0.01 | 185,708.51 | 0.15 | 6,718.18 | crlist |
| crud | append / batch after deleted tail | 5,000 | 25,000 | 0 | 1,954,918.94 | 0 | 682,738.1 | 0.01 | 164,709.62 | 0.15 | 6,527.73 | crlist |
| crud | append / batch after garbage collection | 5,000 | 25,000 | 0 | 1,925,785.76 | 0 | 836,398.04 | 0 | 223,412.24 | 0.15 | 6,602.94 | crlist |
| crud | prepend / single before head | 5,000 | 250 | 0.01 | 170,604.56 | 0.01 | 89,832.31 | 0.01 | 128,242.48 | 1.65 | 607.21 | crlist |
| crud | prepend / batch before head | 5,000 | 25,000 | 0 | 1,444,023.55 | 0 | 1,048,687.94 | 0 | 268,003.14 | 0.15 | 6,595.94 | crlist |
| crud | prepend / batch before deleted head | 5,000 | 25,000 | 0 | 1,979,601.4 | 0 | 801,218.29 | 0 | 266,791.78 | 0.15 | 6,714.52 | crlist |
| crud | prepend / batch after garbage collection | 5,000 | 25,000 | 0 | 1,950,766.71 | 0 | 1,310,073.97 | 0 | 265,460.47 | 0.14 | 7,061.18 | crlist |
| crud | insert / single before head | 5,000 | 250 | 0 | 424,388.41 | 0.01 | 113,468.58 | 0.01 | 193,348.95 | 1.61 | 620.57 | crlist |
| crud | insert / single after head | 5,000 | 250 | 0 | 223,730.46 | 0.01 | 88,808.65 | 0.01 | 119,476.83 | 1.65 | 607.63 | crlist |
| crud | insert / single before middle | 5,000 | 250 | 0 | 247,447.58 | 0.01 | 85,701.73 | 0.01 | 168,404.03 | 1.6 | 623.23 | crlist |
| crud | insert / single after middle | 5,000 | 250 | 0 | 241,155.85 | 0.01 | 94,861.86 | 0.01 | 186,423.87 | 1.58 | 632.78 | crlist |
| crud | insert / single before tail | 5,000 | 250 | 0 | 217,878.21 | 0.01 | 94,297.81 | 0.01 | 143,987.4 | 1.54 | 650.94 | crlist |
| crud | insert / single after tail | 5,000 | 250 | 0 | 496,826.27 | 0.01 | 86,519.47 | 0 | 261,431.35 | 1.5 | 665.5 | crlist |
| crud | insert / batch before head | 5,000 | 25,000 | 0 | 2,006,618.79 | 0 | 1,383,135.81 | 0 | 279,634.79 | 0.14 | 6,914.48 | crlist |
| crud | insert / batch after head | 5,000 | 25,000 | 0 | 1,942,576.66 | 0 | 940,173.42 | 0 | 284,926.93 | 0.15 | 6,854.87 | crlist |
| crud | insert / batch before middle | 5,000 | 25,000 | 0 | 1,174,718.3 | 0 | 962,465.95 | 0 | 287,981.74 | 0.15 | 6,487.18 | crlist |
| crud | insert / batch after middle | 5,000 | 25,000 | 0 | 1,370,405.84 | 0 | 1,173,690.9 | 0 | 229,271.68 | 0.15 | 6,709.5 | crlist |
| crud | insert / batch before tail | 5,000 | 25,000 | 0 | 1,266,538.78 | 0 | 832,131.87 | 0 | 287,229.51 | 0.15 | 6,625.39 | crlist |
| crud | insert / batch after tail | 5,000 | 25,000 | 0 | 1,798,975.95 | 0 | 715,491.44 | 0 | 219,070.1 | 0.15 | 6,715.12 | crlist |
| crud | insert / repeated before head | 5,000 | 250 | 0.01 | 171,408.16 | 0.01 | 134,085.28 | 0 | 200,028.16 | 1.64 | 609.45 | json-joy |
| crud | insert / repeated before middle | 5,000 | 250 | 0 | 327,316.81 | 0.01 | 98,717.58 | 0 | 201,772.86 | 1.58 | 633.69 | crlist |
| crud | insert / repeated before tail | 5,000 | 250 | 0 | 313,218.05 | 0.04 | 23,105.98 | 0 | 249,248.76 | 1.5 | 666.31 | crlist |
| crud | insert / random positions | 5,000 | 250 | 0 | 295,588.98 | 0.01 | 79,143.08 | 0.01 | 69,909.52 | 1.58 | 634.19 | crlist |
| crud | insert / alternating head and tail | 5,000 | 250 | 0 | 440,629.57 | 0.01 | 70,360.56 | 0.03 | 33,504.58 | 1.61 | 622.01 | crlist |
| crud | overwrite / head | 5,000 | 250 | 0.01 | 165,423.13 | 0.02 | 58,161.79 | 0.01 | 85,289.45 | 1.72 | 579.88 | crlist |
| crud | overwrite / middle | 5,000 | 250 | 0 | 245,170.39 | 0.02 | 60,964.92 | 0.01 | 94,333.46 | 1.67 | 600.28 | crlist |
| crud | overwrite / tail | 5,000 | 250 | 0 | 272,017.65 | 0.02 | 59,281.84 | 0.01 | 131,124.98 | 1.59 | 629.59 | crlist |
| crud | overwrite / random | 5,000 | 250 | 0.01 | 85,307.84 | 0.03 | 31,308.62 | 0.01 | 132,591.04 | 1.8 | 555.58 | json-joy |
| crud | overwrite / same head repeatedly | 5,000 | 250 | 0 | 343,604.35 | 0.01 | 87,098.48 | 0 | 224,275.39 | 1.7 | 588.2 | crlist |
| crud | overwrite / same middle repeatedly | 5,000 | 250 | 0 | 295,232.58 | 0.01 | 75,521.79 | 0 | 209,942.01 | 1.63 | 612.52 | crlist |
| crud | overwrite / same tail repeatedly | 5,000 | 250 | 0 | 449,815.85 | 0.01 | 77,571.77 | 0 | 203,913.84 | 1.65 | 607.12 | crlist |
| crud | overwrite / random visible entries | 5,000 | 250 | 0.01 | 109,692.09 | 0.04 | 25,189.3 | 0.01 | 154,843.73 | 1.82 | 548.61 | json-joy |
| crud | overwrite / after insert | 5,000 | 250 | 0 | 361,142.25 | 0.01 | 73,693.55 | 0.01 | 190,699.22 | 1.65 | 607.65 | crlist |
| crud | overwrite / after delete | 5,000 | 250 | 0 | 207,967.14 | 0.02 | 47,876.22 | 0.01 | 115,775.21 | 1.61 | 620.3 | crlist |
| crud | delete / head | 5,000 | 250 | 0 | 254,382.24 | 0.02 | 56,452.91 | 0.01 | 90,553.5 | 0.17 | 5,733.78 | crlist |
| crud | delete / middle | 5,000 | 250 | 0 | 309,704.91 | 0.01 | 109,273.33 | 0.01 | 149,847.66 | 0.18 | 5,698.53 | crlist |
| crud | delete / tail | 5,000 | 250 | 0 | 599,383.83 | 0.01 | 73,111.02 | 0 | 250,238.23 | 0.17 | 5,784.93 | crlist |
| crud | delete / range from head | 5,000 | 5,000 | 0 | 2,187,029.52 | 0 | 6,158,947.66 | 0 | 200,312.66 | 0.01 | 83,222.68 | yjs |
| crud | delete / range from middle | 5,000 | 5,000 | 0 | 1,333,340.44 | 0 | 7,855,410.18 | 0 | 695,687.6 | 0.01 | 73,427.07 | yjs |
| crud | delete / range from tail | 5,000 | 5,000 | 0 | 1,556,781.75 | 0 | 6,782,456.77 | 0 | 482,952.27 | 0.01 | 76,175.36 | yjs |
| crud | delete / every other entry | 5,000 | 2,500 | 0 | 318,519.1 | 0.06 | 15,527.4 | 0.07 | 15,373.81 | 0.17 | 5,966.11 | crlist |
| crud | delete / all entries from head one by one | 5,000 | 5,000 | 0 | 281,572.39 | 0.01 | 118,004.66 | 0.01 | 114,127.19 | 0.16 | 6,404.47 | crlist |
| crud | delete / all entries from middle outward | 5,000 | 5,000 | 0 | 287,299.31 | 0.01 | 127,427.85 | 0.01 | 199,855.75 | 0.16 | 6,314.39 | crlist |
| crud | delete / all entries from tail one by one | 5,000 | 5,000 | 0 | 821,867.33 | 0.01 | 122,384.02 | 0 | 401,305.43 | 0.15 | 6,480.65 | crlist |
| crud | delete / all entries in random order | 5,000 | 5,000 | 0.09 | 10,719.83 | 11.18 | 89.41 | 7.4 | 135.11 | 0.18 | 5,471.62 | crlist |
| crud | delete / already deleted head | 5,000 | 250 | 0 | 335,679.96 | 0 | 302,748.47 | 0 | 353,271.51 | 0.02 | 55,143.85 | json-joy |
| crud | delete / already deleted middle | 5,000 | 250 | 0 | 406,920.25 | 0 | 244,230.06 | 0 | 955,686.72 | 0.02 | 63,962.6 | json-joy |
| crud | delete / already deleted tail | 5,000 | 250 | 0 | 1,387,270.41 | 0 | 279,588.58 | 0 | 1,196,899.55 | 0.02 | 40,334.93 | crlist |
| crud | mixed / append overwrite delete tail | 5,000 | 250 | 0 | 304,833.81 | 0.02 | 63,663.48 | 0.01 | 116,977.45 | 1.37 | 729.4 | crlist |
| crud | mixed / prepend overwrite delete head | 5,000 | 250 | 0 | 230,097.06 | 0.01 | 69,340.53 | 0.01 | 161,386.95 | 1.38 | 723.95 | crlist |
| crud | mixed / insert overwrite delete middle | 5,000 | 250 | 0 | 230,071.44 | 0.02 | 47,375.65 | 0.08 | 12,236.75 | 1.38 | 725.86 | crlist |
| crud | mixed / append prepend insert overwrite delete | 5,000 | 250 | 0 | 369,158.98 | 0.01 | 91,382.22 | 0 | 225,460.44 | 1.35 | 739.64 | crlist |
| mags | snapshot | 5,000 | 250 | 0.31 | 3,266.64 | 2.73 | 366.93 | 4.75 | 210.35 | 14.85 | 67.34 | crlist |
| mags | snapshot / clean state | 5,000 | 250 | 0.15 | 6,868.42 | 2.56 | 390.82 | 4.84 | 206.57 | 14.83 | 67.44 | crlist |
| mags | snapshot / tombstoned state 50% deleted | 5,000 | 250 | 0.08 | 12,477.47 | 1.27 | 789.24 | 2.31 | 433.2 | 14.95 | 66.88 | crlist |
| mags | snapshot / tombstoned state 90% deleted | 5,000 | 250 | 0.01 | 83,259.51 | 0.28 | 3,533.83 | 0.37 | 2,728.26 | 14.97 | 66.81 | crlist |
| mags | snapshot / after garbage collection | 5,000 | 250 | 0.07 | 15,281.56 | 1.27 | 786.84 | 2.24 | 447.29 | 14.77 | 67.71 | crlist |
| mags | acknowledge | 5,000 | 250 | 0 | 3,034,238.35 | n/a | n/a | n/a | n/a | n/a | n/a | n/a |
| mags | acknowledge / clean state | 5,000 | 250 | 0 | 4,205,285.2 | n/a | n/a | n/a | n/a | n/a | n/a | n/a |
| mags | acknowledge / 50% deleted state | 5,000 | 250 | 0 | 2,142,520.46 | n/a | n/a | n/a | n/a | n/a | n/a | n/a |
| mags | acknowledge / 90% deleted state | 5,000 | 250 | 0 | 3,065,152.89 | n/a | n/a | n/a | n/a | n/a | n/a | n/a |
| mags | garbage collect | 5,000 | 250 | 0 | 2,103,686.5 | n/a | n/a | n/a | n/a | n/a | n/a | n/a |
| mags | garbage collect / no eligible tombstones | 5,000 | 250 | 0 | 3,659,089.91 | n/a | n/a | n/a | n/a | n/a | n/a | n/a |
| mags | garbage collect / 50% eligible tombstones | 5,000 | 250 | 0 | 806,727.46 | n/a | n/a | n/a | n/a | n/a | n/a | n/a |
| mags | garbage collect / 90% eligible tombstones | 5,000 | 250 | 0 | 718,366.03 | n/a | n/a | n/a | n/a | n/a | n/a | n/a |
| mags | garbage collect / partial frontiers 2 replicas | 5,000 | 250 | 0 | 4,042,494.7 | n/a | n/a | n/a | n/a | n/a | n/a | n/a |
| mags | garbage collect / partial frontiers 10 replicas | 5,000 | 250 | 0 | 11,508,539.34 | n/a | n/a | n/a | n/a | n/a | n/a | n/a |
| mags | post-gc read / full iteration visible values | 5,000 | 250 | 0.18 | 5,455.77 | 0.09 | 10,624.52 | 0.43 | 2,318.23 | 0.03 | 37,913.08 | automerge |
| mags | merge ordered deltas | 5,000 | 250 | 0.01 | 136,896.51 | 0.02 | 55,341.04 | 0 | 310,908.15 | 2.66 | 376.32 | json-joy |
| mags | merge shuffled gossip | 5,000 | 250 | 0.94 | 1,066.66 | 0.44 | 2,292.82 | n/a | n/a | 0.7 | 1,435.64 | yjs |
| mags | merge / append head delta into equal replica | 5,000 | 1 | 0.03 | 29,523.78 | 0.08 | 11,772.05 | 0.03 | 29,462.89 | 2.99 | 334.45 | crlist |
| mags | merge / append tail delta into equal replica | 5,000 | 1 | 0.09 | 11,751.3 | 0.02 | 41,312.07 | 0.01 | 96,842.92 | 2.94 | 340.49 | json-joy |
| mags | merge / prepend head delta into equal replica | 5,000 | 1 | 0.03 | 33,283.41 | 0.02 | 45,242.73 | 0.01 | 136,780.19 | 2.98 | 335.89 | json-joy |
| mags | merge / insert middle delta into equal replica | 5,000 | 1 | 0.05 | 20,295.09 | 0.02 | 50,428.64 | 0.01 | 86,527.65 | 2.98 | 335.46 | json-joy |
| mags | merge / overwrite head delta into equal replica | 5,000 | 1 | 0.03 | 33,608.93 | 0.02 | 58,390.75 | 0.01 | 104,997.9 | 3.12 | 320.1 | json-joy |
| mags | merge / overwrite middle delta into equal replica | 5,000 | 1 | 0.07 | 13,914.4 | 0.02 | 48,564.91 | 0.01 | 74,962.52 | 2.94 | 339.9 | json-joy |
| mags | merge / overwrite tail delta into equal replica | 5,000 | 1 | 0.03 | 38,345.03 | 0.02 | 44,397.09 | 0.01 | 96,376.25 | 2.98 | 335.45 | json-joy |
| mags | merge / delete head delta into equal replica | 5,000 | 1 | 0.03 | 33,597.63 | 0.01 | 105,887.34 | 0.01 | 69,103.72 | 1.51 | 660.63 | yjs |
| mags | merge / delete middle delta into equal replica | 5,000 | 1 | 0.09 | 11,558.02 | 0.03 | 35,801.23 | 0.02 | 45,823.21 | 1.78 | 563.12 | json-joy |
| mags | merge / delete tail delta into equal replica | 5,000 | 1 | 0.02 | 65,819.79 | 0.01 | 91,274.19 | 0.01 | 118,441.31 | 1.51 | 662.57 | json-joy |
| mags | merge / duplicate delta ignored | 5,000 | 250 | 0 | 883,598.3 | 0.01 | 75,278.78 | 0.01 | 131,767.37 | 0.02 | 42,006.45 | crlist |
| mags | merge / old delta ignored after merge | 5,000 | 250 | 0 | 1,056,479.39 | 0.02 | 46,505.84 | 0 | 437,462.93 | 0.02 | 44,096.27 | crlist |
| mags | merge / ordered 1,000 append deltas | 5,000 | 1,000 | 0 | 331,471.35 | 0.01 | 79,173.58 | 0 | 331,565.98 | 3 | 332.8 | json-joy |
| mags | merge / ordered 1,000 prepend deltas | 5,000 | 1,000 | 0 | 372,362.51 | 0.01 | 178,354.66 | 0.01 | 127,150.46 | 3.06 | 326.56 | crlist |
| mags | merge / ordered 1,000 middle insert deltas | 5,000 | 1,000 | 0 | 376,784.36 | 0.01 | 129,356.42 | 0 | 372,765.6 | 3.04 | 328.61 | crlist |
| mags | merge / shuffled 1,000 mixed deltas | 5,000 | 1,000 | 1.06 | 945.88 | 1.04 | 957.91 | n/a | n/a | 0.83 | 1,205.43 | automerge |
| mags | merge / reverse ordered 1,000 mixed deltas | 5,000 | 1,000 | 0.28 | 3,553.23 | 0.92 | 1,086.93 | n/a | n/a | 0.83 | 1,207.56 | crlist |
| mags | merge / concurrent prepends same head | 5,000 | 2 | 0.05 | 18,264.17 | 0.1 | 9,837.92 | n/a | n/a | 9.79 | 102.19 | crlist |
| mags | merge / concurrent appends same tail | 5,000 | 2 | 0.02 | 46,844.99 | 0.02 | 42,918.45 | n/a | n/a | 9.82 | 101.81 | crlist |
| mags | merge / concurrent inserts same middle position | 5,000 | 2 | 0.07 | 13,635.12 | 0.03 | 38,604.82 | n/a | n/a | 14.02 | 71.31 | yjs |
| mags | merge / concurrent overwrites same head | 5,000 | 2 | 0.02 | 41,717.07 | 0.02 | 41,082.1 | n/a | n/a | 10.28 | 97.32 | crlist |
| mags | merge / concurrent overwrites same middle | 5,000 | 2 | 0.08 | 12,621.64 | 0.03 | 35,884.74 | n/a | n/a | 10.15 | 98.57 | yjs |
| mags | merge / concurrent overwrites same tail | 5,000 | 2 | 0.02 | 43,020.93 | 0.03 | 38,522.29 | n/a | n/a | 14.02 | 71.35 | crlist |
| mags | merge / concurrent deletes same head | 5,000 | 2 | 0.03 | 37,306.47 | 0.01 | 71,296.16 | 0.02 | 50,404.5 | 6.98 | 143.27 | yjs |
| mags | merge / concurrent deletes same middle | 5,000 | 2 | 0.09 | 11,490.88 | 0.02 | 60,921.75 | 0.02 | 53,508.84 | 5.07 | 197.23 | yjs |
| mags | merge / concurrent deletes same tail | 5,000 | 2 | 0.01 | 79,057.63 | 0.02 | 63,437.69 | 0.02 | 53,195.73 | 7.05 | 141.83 | crlist |
| mags | merge / concurrent overwrite delete same entry | 5,000 | 2 | 0.18 | 5,440.83 | 0.05 | 19,845.01 | 0.07 | 13,824.85 | 12.62 | 79.26 | yjs |
| mags | merge / forked replicas rejoin after 250 ops each | 5,000 | 500 | 0 | 221,648.79 | 0.01 | 82,000.94 | n/a | n/a | 2.79 | 358.58 | crlist |
| mags | merge / 10 replicas gossip convergence | 5,000 | 100 | 0 | 245,404.19 | 0.01 | 109,457.09 | n/a | n/a | 5.65 | 176.87 | crlist |
| mags | merge / snapshot merge into stale replica | 5,000 | 5,350 | 0 | 1,177,628.41 | 0 | 683,118.37 | 0 | 441,426.21 | 0.03 | 36,527.36 | crlist |
| class | constructor / hydrate snapshot | 5,000 | 250 | 3.63 | 275.57 | 4.86 | 205.74 | 13.11 | 76.26 | 136.6 | 7.32 | crlist |
| class | read / head | 5,000 | 250 | 0 | 3,222,646.18 | 0 | 4,228,115.28 | 0 | 2,406,043.98 | 0 | 3,308,453.76 | yjs |
| class | read / middle | 5,000 | 250 | 0 | 10,462,002.01 | 0 | 9,728,383.53 | 0 | 4,727,774.73 | 0 | 10,563,677.85 | automerge |
| class | read / tail | 5,000 | 250 | 0 | 2,599,725.47 | 0 | 2,898,584.33 | 0 | 1,689,166.36 | 0 | 3,589,684.68 | automerge |
| class | find near head | 5,000 | 250 | 0 | 1,173,383.9 | n/a | n/a | n/a | n/a | 0 | 1,249,437.75 | automerge |
| class | find near middle | 5,000 | 250 | 0.03 | 29,687.08 | n/a | n/a | n/a | n/a | 0.02 | 42,339.03 | automerge |
| class | find near tail | 5,000 | 250 | 0.05 | 18,628.92 | n/a | n/a | n/a | n/a | 0.05 | 21,253.6 | automerge |
| class | iterate visible values | 5,000 | 250 | 0.13 | 7,999.32 | 0.13 | 7,555.88 | 1.06 | 945.58 | 0.06 | 16,741.77 | automerge |
| class | collect visible values to array | 5,000 | 250 | 0.11 | 8,796.01 | 0.14 | 7,365.98 | 0.95 | 1,048.34 | 0.06 | 15,935.61 | automerge |
| class | append / single after tail | 5,000 | 250 | 0 | 251,527.02 | 0.01 | 82,124.08 | 0.01 | 194,656.3 | 1.58 | 632.47 | crlist |
| class | append / batch after tail | 5,000 | 25,000 | 0 | 1,822,137.11 | 0 | 685,184.37 | 0 | 212,876.32 | 0.16 | 6,300.17 | crlist |
| class | prepend / single before head | 5,000 | 250 | 0 | 290,759.21 | 0.01 | 129,430.07 | 0 | 201,759.83 | 1.67 | 597.76 | crlist |
| class | prepend / batch before head | 5,000 | 25,000 | 0 | 2,102,617.84 | 0 | 1,347,148.18 | 0 | 348,541.68 | 0.16 | 6,306.99 | crlist |
| class | insert / single before middle | 5,000 | 250 | 0 | 239,442.04 | 0.01 | 104,050.39 | 0 | 218,465.39 | 1.96 | 511.27 | crlist |
| class | insert / batch before middle | 5,000 | 25,000 | 0 | 1,389,649.18 | 0 | 1,026,105.14 | 0 | 288,484.28 | 0.16 | 6,157.13 | crlist |
| class | overwrite / head | 5,000 | 250 | 0 | 229,747.53 | 0.01 | 84,666.64 | 0.01 | 168,522.32 | 1.77 | 565.97 | crlist |
| class | overwrite / middle | 5,000 | 250 | 0 | 285,253.32 | 0.01 | 81,492.18 | 0.01 | 194,227.56 | 1.71 | 584 | crlist |
| class | overwrite / tail | 5,000 | 250 | 0 | 275,475.72 | 0.01 | 72,787.22 | 0.01 | 189,957.77 | 1.67 | 599.99 | crlist |
| class | overwrite / random | 5,000 | 250 | 0.01 | 68,562.01 | 0.02 | 45,574.58 | 0.01 | 118,501.27 | 1.86 | 538.66 | json-joy |
| class | remove / head | 5,000 | 250 | 0 | 235,409.11 | 0.01 | 98,466.41 | 0.08 | 12,348.76 | 0.19 | 5,186.15 | crlist |
| class | remove / middle | 5,000 | 250 | 0 | 346,412.96 | 0.01 | 111,817.2 | 0.01 | 151,347.75 | 0.23 | 4,391.24 | crlist |
| class | remove / tail | 5,000 | 250 | 0 | 483,030.18 | 0.03 | 38,819.37 | 0 | 313,497.31 | 0.21 | 4,870.37 | crlist |
| class | remove / range from head | 5,000 | 5,000 | 0 | 1,952,264.78 | 0 | 7,804,695.3 | 0 | 918,704.4 | 0.01 | 79,451.74 | yjs |
| class | remove / range from middle | 5,000 | 5,000 | 0 | 1,494,350.61 | 0 | 6,166,939.04 | 0 | 286,802.5 | 0.01 | 70,720.27 | yjs |
| class | remove / range from tail | 5,000 | 5,000 | 0 | 1,593,243.12 | 0 | 7,646,312.18 | 0 | 665,986.3 | 0.01 | 75,489.23 | yjs |
| class | mixed / append overwrite remove tail | 5,000 | 250 | 0.01 | 179,413.52 | 0.01 | 91,511.87 | 0 | 217,735.71 | 1.2 | 831.89 | json-joy |
| class | mixed / prepend overwrite remove head | 5,000 | 250 | 0 | 385,379.03 | 0.01 | 115,566.11 | 0.01 | 168,748.92 | 1.28 | 782.42 | crlist |
| class | mixed / insert overwrite remove middle | 5,000 | 250 | 0 | 392,610.13 | 0.01 | 112,817.31 | 0 | 268,628.01 | 1.23 | 815.28 | crlist |
| class | paste / insert 10,000 entries at cursor | 5,000 | 10,000 | 0 | 888,147.27 | 0 | 1,486,461.46 | 0.01 | 138,651.02 | 0.14 | 7,175.61 | yjs |
| class | render / join visible entries to string | 5,000 | 250 | 0.18 | 5,536.29 | 0.21 | 4,671.02 | 1.13 | 882.37 | 0.15 | 6,872.3 | automerge |
| class | snapshot | 5,000 | 250 | 0.13 | 7,740.27 | 2.57 | 388.53 | 4.67 | 214.33 | 15.15 | 66.01 | crlist |
| class | snapshot / tombstoned state 50% deleted | 5,000 | 250 | 0.06 | 15,633.87 | 1.28 | 779.55 | 2.2 | 454.72 | 15.09 | 66.29 | crlist |
| class | snapshot / after garbage collection | 5,000 | 250 | 0.09 | 11,025.43 | 0.13 | 7,562.81 | 0.99 | 1,012.44 | 0.05 | 19,811.24 | automerge |
| class | acknowledge | 5,000 | 250 | 0.01 | 151,066.44 | n/a | n/a | n/a | n/a | n/a | n/a | n/a |
| class | acknowledge / 50% deleted state | 5,000 | 250 | 0.01 | 171,692.33 | n/a | n/a | n/a | n/a | n/a | n/a | n/a |
| class | acknowledge / 90% deleted state | 5,000 | 250 | 0.01 | 138,197.06 | n/a | n/a | n/a | n/a | n/a | n/a | n/a |
| class | garbage collect | 5,000 | 250 | 0.08 | 11,845.74 | 0.13 | 7,668.58 | 0.97 | 1,028.1 | 0.06 | 16,975.88 | automerge |
| class | garbage collect / no eligible tombstones | 5,000 | 250 | 0.09 | 10,875.42 | 0.2 | 4,990.19 | 0.97 | 1,032.75 | 0.06 | 16,175.56 | automerge |
| class | garbage collect / 90% eligible tombstones | 5,000 | 250 | 0.09 | 10,620.35 | 0.22 | 4,612.6 | 1.01 | 988.2 | 0.06 | 16,538.07 | automerge |
| class | merge ordered deltas | 5,000 | 250 | 0.01 | 172,867.06 | 0.01 | 119,424.72 | 0 | 298,594.81 | 2.66 | 376.06 | json-joy |
| class | merge shuffled gossip | 5,000 | 250 | 0.88 | 1,135.73 | 0.3 | 3,354.77 | n/a | n/a | 0.69 | 1,450.5 | yjs |
| class | merge / duplicate delta ignored | 5,000 | 250 | 0 | 570,090.33 | 0.01 | 76,529.88 | 0 | 445,608.17 | 0.03 | 33,682.24 | crlist |
| class | merge / concurrent prepends same head | 5,000 | 2 | 0.06 | 15,950.49 | 0.07 | 14,488.87 | n/a | n/a | 8.34 | 119.86 | crlist |
| class | merge / concurrent appends same tail | 5,000 | 2 | 0.02 | 56,652.41 | 0.02 | 57,935.75 | n/a | n/a | 14.35 | 69.71 | yjs |
| class | merge / concurrent inserts same middle position | 5,000 | 2 | 0.07 | 14,385.59 | 0.02 | 48,874.66 | n/a | n/a | 10.14 | 98.57 | yjs |
| class | merge / forked replicas rejoin after 250 ops each | 5,000 | 500 | 0.01 | 71,488.59 | 0.01 | 138,930.76 | n/a | n/a | 2.77 | 361.06 | yjs |
| latency | append tail write to remote visible | 5,000 | 250 | 0.09 | 11,553.35 | 0.16 | 6,141.86 | 8.69 | 115.04 | 5.03 | 198.91 | crlist |
| latency | prepend head write to remote visible | 5,000 | 250 | 0.01 | 150,271.63 | 0.02 | 64,621.86 | 0.01 | 82,954.32 | 4.91 | 203.75 | crlist |
| latency | middle insert write to remote visible | 5,000 | 250 | 0.04 | 24,911.66 | 0.09 | 10,701.56 | 2.95 | 338.58 | 4.96 | 201.66 | crlist |
| latency | head insert write to remote visible | 5,000 | 250 | 0.02 | 65,450.42 | 0.02 | 43,911.69 | 0.01 | 91,121.09 | 4.94 | 202.59 | json-joy |
| latency | overwrite head write to remote visible | 5,000 | 250 | 0.01 | 139,765.45 | 0.02 | 55,528.79 | 0.01 | 88,067.4 | 5.11 | 195.78 | crlist |
| latency | overwrite middle write to remote visible | 5,000 | 250 | 0.04 | 24,728.35 | 0.09 | 11,597.6 | 1.69 | 590.88 | 4.97 | 201.03 | crlist |
| latency | overwrite tail write to remote visible | 5,000 | 250 | 0.08 | 13,183.39 | 0.15 | 6,577.33 | 3.37 | 296.96 | 4.9 | 204 | crlist |
| latency | head delete to remote hidden | 5,000 | 250 | 0.63 | 1,576.84 | 0.34 | 2,926.8 | 6.35 | 157.42 | 1.83 | 546.48 | yjs |
| latency | middle delete to remote hidden | 5,000 | 250 | 0.68 | 1,474.9 | 0.34 | 2,926.14 | 6.38 | 156.75 | 1.88 | 531.96 | yjs |
| latency | tail delete to remote hidden | 5,000 | 250 | 0.21 | 4,658.09 | 0.29 | 3,489.09 | 6.53 | 153.23 | 1.89 | 528.28 | crlist |
| latency | append tail write to 10 remotes visible | 5,000 | 2,500 | 0.09 | 11,643.8 | 0.14 | 7,199.68 | 13.03 | 76.75 | 3.35 | 298.74 | crlist |
| latency | prepend head write to 10 remotes visible | 5,000 | 2,500 | 0 | 212,867.74 | 0.01 | 172,768.03 | 0.01 | 68,859.18 | 3.31 | 302.16 | crlist |
| latency | middle insert write to 10 remotes visible | 5,000 | 2,500 | 0.04 | 24,406.34 | 0.08 | 12,095.44 | 4.8 | 208.37 | 3.37 | 296.41 | crlist |
| latency | overwrite middle write to 10 remotes visible | 5,000 | 2,500 | 0.06 | 17,622.5 | 0.08 | 13,248.09 | 3.46 | 288.88 | 3.35 | 298.7 | crlist |
| latency | delete middle to 10 remotes hidden | 5,000 | 2,500 | 0.8 | 1,254.04 | 0.33 | 3,033.26 | 11.57 | 86.45 | 1.68 | 594.81 | yjs |
| latency | out-of-order write delivery to remote visible | 5,000 | 250 | 1.42 | 704.14 | 118.15 | 8.46 | n/a | n/a | 16.33 | 61.24 | crlist |
| latency | out-of-order delete delivery to remote convergence | 5,000 | 165 | 2.29 | 435.88 | 0.31 | 3,176.52 | 8.67 | 115.32 | 6.75 | 148.17 | yjs |
| latency | out-of-order append delivery to convergence | 5,000 | 250 | 1.28 | 783.47 | 21.7 | 46.08 | n/a | n/a | 16.73 | 59.76 | crlist |
| latency | out-of-order prepend delivery to convergence | 5,000 | 250 | 1.36 | 736.73 | 21.88 | 45.7 | 0.05 | 19,468.51 | 16.43 | 60.88 | json-joy |
| latency | out-of-order middle insert delivery to convergence | 5,000 | 250 | 1.34 | 745.52 | 119.66 | 8.36 | n/a | n/a | 16.24 | 61.56 | crlist |
| latency | out-of-order overwrite delivery to convergence | 5,000 | 129 | 1.75 | 572.25 | n/a | n/a | 276.49 | 3.62 | 76.9 | 13 | crlist |
| latency | offline burst 1,000 ops then sync | 5,000 | 1,000 | 0 | 305,382.68 | 0.02 | 57,083.2 | 0 | 342,313.47 | 2.89 | 346.45 | json-joy |
| latency | forked replicas mixed ops then converge | 5,000 | 500 | 0 | 354,462.86 | 0.01 | 150,282.52 | n/a | n/a | 2.81 | 355.47 | crlist |
| latency | duplicate shuffled gossip to convergence | 5,000 | 500 | 0.47 | 2,147.41 | 0.15 | 6,807.82 | n/a | n/a | 0.37 | 2,684.14 | yjs |
| latency | remote snapshot hydrate then apply pending deltas | 5,000 | 250 | 0.02 | 57,552.72 | 0.03 | 35,713.81 | 0.03 | 30,334.79 | 0.63 | 1,592.93 | crlist |
| workload | local app session | 5,000 | 250 | 0.01 | 161,808.42 | 0.01 | 103,114.34 | 0.01 | 175,002.5 | 1.1 | 905 | json-joy |
| workload | read heavy session | 5,000 | 250 | 0 | 3,050,156.78 | 0 | 5,426,642.64 | 0 | 548,699.25 | 0 | 2,305,996.51 | yjs |
| workload | write heavy session | 5,000 | 250 | 0 | 218,039.93 | 0.01 | 106,756.4 | 0 | 209,647.47 | 1.11 | 899.19 | crlist |
| workload | append tail heavy session | 5,000 | 250 | 0 | 314,754.03 | 0.02 | 64,113.84 | 0.01 | 163,727.32 | 1.37 | 729.09 | crlist |
| workload | prepend head heavy session | 5,000 | 250 | 0.01 | 189,943.05 | 0.01 | 81,604.62 | 0.01 | 194,507.57 | 1.4 | 714.1 | json-joy |
| workload | insert middle heavy session | 5,000 | 250 | 0.01 | 153,077.56 | 0.01 | 108,612.07 | 0 | 244,261.32 | 1.42 | 703.21 | json-joy |
| workload | overwrite heavy session | 5,000 | 250 | 0 | 230,790.39 | 0.02 | 66,003.52 | 0 | 250,301.11 | 1.13 | 881.18 | json-joy |
| workload | delete heavy session | 5,000 | 250 | 0 | 232,358.64 | 0.01 | 107,453.49 | 0 | 356,444.73 | 0.16 | 6,081.18 | json-joy |
| workload | balanced append prepend insert overwrite delete session | 5,000 | 250 | 0.01 | 195,604.99 | 0.01 | 125,593.18 | 0 | 207,144.15 | 1.3 | 767.92 | json-joy |
| workload | random edit session | 5,000 | 250 | 0.01 | 134,571.75 | 0.02 | 63,737.3 | 0.01 | 99,909.68 | 1.09 | 917.72 | crlist |
| workload | text editing session | 5,000 | 250 | 0.01 | 166,477.77 | 0.01 | 128,060.91 | 0 | 247,447.82 | 1.41 | 707.04 | json-joy |
| workload | collaborative offline session | 5,000 | 500 | 0 | 385,110.99 | 0.01 | 148,382.44 | n/a | n/a | 2.82 | 354.8 | crlist |
| workload | sync and cleanup session | 5,000 | 252 | 0 | 275,385.16 | 0.01 | 154,899.57 | n/a | n/a | 2.81 | 355.9 | crlist |
| workload | long lived tombstoned session | 5,000 | 250 | 0 | 345,334.87 | 0.01 | 95,598.27 | 0 | 217,477.73 | 1.6 | 624.55 | crlist |
| workload | sparse visible session | 5,000 | 250 | 0 | 471,675.86 | 0.12 | 8,254.38 | 0.01 | 112,712.43 | 0.82 | 1,214.4 | crlist |
| workload | post-gc edit session | 5,000 | 250 | 0 | 695,993.03 | 0.01 | 105,149.68 | 0 | 232,371.59 | 1.39 | 721.35 | crlist |

## License

Apache-2.0
