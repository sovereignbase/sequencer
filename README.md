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
| crud | create / empty list | 5,000 | 250 | 0.01 | 72,262.69 | 0.14 | 7,011.62 | 0.02 | 51,079.83 | 0.33 | 3,037.48 | crlist |
| crud | create / hydrate snapshot | 5,000 | 250 | 4.83 | 207.18 | 6.79 | 147.37 | 18.26 | 54.77 | 151.42 | 6.6 | crlist |
| crud | create / hydrate clean snapshot | 5,000 | 250 | 4.57 | 218.64 | 6.72 | 148.73 | 17.87 | 55.96 | 152.44 | 6.56 | crlist |
| crud | create / hydrate tombstoned snapshot | 5,000 | 250 | 2.34 | 427 | 3.28 | 305.3 | 8.79 | 113.75 | 160.49 | 6.23 | crlist |
| crud | read / head | 5,000 | 250 | 0 | 2,064,409.58 | 0 | 943,752.36 | 0 | 264,186.83 | 0 | 3,725,782.41 | automerge |
| crud | read / middle | 5,000 | 250 | 0 | 6,393,861.89 | 0 | 2,406,159.77 | 0 | 376,903.36 | 0 | 8,771,929.82 | automerge |
| crud | read / tail | 5,000 | 250 | 0 | 6,393,861.89 | 0 | 2,145,922.75 | 0 | 690,989.5 | 0 | 9,765,625 | automerge |
| crud | read / random indexed reads | 5,000 | 250 | 0 | 769,230.77 | 0 | 862,068.97 | 0.03 | 30,708 | 0 | 1,269,035.53 | automerge |
| crud | read / sequential indexed reads from head | 5,000 | 250 | 0 | 1,696,065.13 | 0 | 1,113,089.94 | 0 | 277,685.22 | 0 | 1,267,105.93 | crlist |
| crud | read / sequential indexed reads from middle | 5,000 | 250 | 0 | 5,773,672.06 | 0 | 2,948,113.21 | 0 | 295,893.01 | 0 | 8,680,555.56 | automerge |
| crud | read / sequential indexed reads from tail | 5,000 | 250 | 0 | 5,296,610.17 | 0 | 2,527,805.86 | 0 | 277,315.59 | 0 | 7,668,711.66 | automerge |
| crud | read / full iteration visible values | 5,000 | 250 | 0.53 | 1,893.67 | 0.2 | 4,989.38 | 1.56 | 640.01 | 0.07 | 13,407.99 | automerge |
| crud | read / collect visible values to array | 5,000 | 250 | 0.56 | 1,785.26 | 0.2 | 5,064.62 | 1.63 | 613.39 | 0.09 | 11,559.14 | automerge |
| crud | read / visible sparse over deleted entries | 5,000 | 250 | 0 | 6,578,947.37 | 0.04 | 27,682.73 | 0.02 | 45,060.47 | 0 | 10,683,760.68 | automerge |
| crud | find / head | 5,000 | 250 | 0 | 583,158.39 | 0 | 912,741.88 | 0 | 600,528.47 | 0 | 1,272,912.42 | automerge |
| crud | find / middle | 5,000 | 250 | 0.06 | 16,348.85 | 0.1 | 9,696.2 | 0.63 | 1,590.24 | 0.03 | 38,627.94 | automerge |
| crud | find / tail | 5,000 | 250 | 0.05 | 18,461.63 | 0.19 | 5,244.86 | 1.34 | 747.13 | 0.06 | 17,214.9 | crlist |
| crud | find / missing value | 5,000 | 250 | 0.25 | 3,946.14 | 0.37 | 2,685.51 | 3.09 | 323.2 | 0.06 | 17,776.89 | automerge |
| crud | append / single after tail | 5,000 | 250 | 0 | 222,697.31 | 0.03 | 38,908.08 | 0.04 | 24,685.26 | 2.03 | 493.5 | crlist |
| crud | append / batch after tail | 5,000 | 25,000 | 0 | 1,440,009.22 | 0 | 546,761.21 | 0.01 | 147,025.61 | 0.18 | 5,566.5 | crlist |
| crud | append / batch after deleted tail | 5,000 | 25,000 | 0 | 1,306,547.37 | 0 | 652,377 | 0.01 | 139,013.07 | 0.18 | 5,525.21 | crlist |
| crud | append / batch after garbage collection | 5,000 | 25,000 | 0 | 1,305,858.08 | 0 | 667,966.98 | 0.01 | 154,727.19 | 0.18 | 5,632.23 | crlist |
| crud | prepend / single before head | 5,000 | 250 | 0.01 | 184,243.5 | 0.02 | 62,961.19 | 0.01 | 96,678.14 | 1.83 | 545.26 | crlist |
| crud | prepend / batch before head | 5,000 | 25,000 | 0 | 1,746,724.89 | 0 | 741,208.53 | 0.01 | 168,657.27 | 0.18 | 5,492.08 | crlist |
| crud | prepend / batch before deleted head | 5,000 | 25,000 | 0 | 1,709,577.05 | 0 | 830,186.92 | 0.01 | 193,658.39 | 0.18 | 5,451.59 | crlist |
| crud | prepend / batch after garbage collection | 5,000 | 25,000 | 0 | 1,408,054.07 | 0 | 768,942.12 | 0 | 203,900.37 | 0.18 | 5,506.6 | crlist |
| crud | insert / single before head | 5,000 | 250 | 0 | 231,588.7 | 0.02 | 59,296.51 | 0.01 | 128,021.3 | 2.01 | 497.95 | crlist |
| crud | insert / single after head | 5,000 | 250 | 0.02 | 66,218.15 | 0.02 | 58,256.05 | 0.01 | 83,472.45 | 1.92 | 521.12 | json-joy |
| crud | insert / single before middle | 5,000 | 250 | 0.01 | 113,004.57 | 0.02 | 52,569.6 | 0.01 | 131,475.15 | 1.81 | 550.97 | json-joy |
| crud | insert / single after middle | 5,000 | 250 | 0.01 | 152,225.54 | 0.02 | 52,015.06 | 0.04 | 26,329.92 | 1.68 | 595.5 | crlist |
| crud | insert / single before tail | 5,000 | 250 | 0.01 | 98,939.37 | 0.02 | 47,844.14 | 0.01 | 148,951.38 | 1.78 | 562.97 | json-joy |
| crud | insert / single after tail | 5,000 | 250 | 0.01 | 194,749.55 | 0.03 | 30,051.69 | 0.01 | 198,349.73 | 1.71 | 583.83 | json-joy |
| crud | insert / batch before head | 5,000 | 25,000 | 0 | 1,383,202.39 | 0 | 782,200.86 | 0.01 | 195,373.4 | 0.18 | 5,507.98 | crlist |
| crud | insert / batch after head | 5,000 | 25,000 | 0 | 1,604,518.32 | 0 | 892,723.23 | 0.01 | 171,383.37 | 0.18 | 5,612.7 | crlist |
| crud | insert / batch before middle | 5,000 | 25,000 | 0 | 692,169.9 | 0 | 906,924.18 | 0.01 | 199,919.23 | 0.18 | 5,495.11 | yjs |
| crud | insert / batch after middle | 5,000 | 25,000 | 0 | 785,592.86 | 0 | 818,719.2 | 0.01 | 193,011.14 | 0.19 | 5,277.45 | yjs |
| crud | insert / batch before tail | 5,000 | 25,000 | 0 | 1,130,704.97 | 0 | 730,240.42 | 0 | 204,666.56 | 0.18 | 5,443.18 | crlist |
| crud | insert / batch after tail | 5,000 | 25,000 | 0 | 1,492,840.34 | 0 | 506,777.64 | 0.01 | 123,145.98 | 0.18 | 5,507.21 | crlist |
| crud | insert / repeated before head | 5,000 | 250 | 0 | 298,471.82 | 0.01 | 96,480.4 | 0.01 | 135,817.9 | 1.77 | 563.56 | crlist |
| crud | insert / repeated before middle | 5,000 | 250 | 0.01 | 196,078.43 | 0.01 | 76,145.22 | 0.01 | 160,493.03 | 1.77 | 565.92 | crlist |
| crud | insert / repeated before tail | 5,000 | 250 | 0.01 | 145,213.75 | 0.01 | 68,921.79 | 0.01 | 179,830.24 | 2.03 | 492.76 | json-joy |
| crud | insert / random positions | 5,000 | 250 | 0 | 214,500.21 | 0.03 | 33,038.19 | 0.04 | 24,202.29 | 1.85 | 539.22 | crlist |
| crud | insert / alternating head and tail | 5,000 | 250 | 0 | 333,377.78 | 0.01 | 98,595.99 | 0.01 | 127,942.68 | 1.8 | 554.99 | crlist |
| crud | overwrite / head | 5,000 | 250 | 0.01 | 118,528.35 | 0.03 | 33,881.77 | 0.02 | 57,300.02 | 2 | 499.68 | crlist |
| crud | overwrite / middle | 5,000 | 250 | 0.01 | 144,233.54 | 0.02 | 54,976.47 | 0.01 | 115,372.19 | 1.84 | 544.22 | crlist |
| crud | overwrite / tail | 5,000 | 250 | 0.01 | 186,678.61 | 0.02 | 46,077 | 0.01 | 112,953.51 | 2.05 | 488.6 | crlist |
| crud | overwrite / random | 5,000 | 250 | 0.02 | 55,674.33 | 0.04 | 27,436.65 | 0.03 | 30,792.35 | 2.07 | 482.09 | crlist |
| crud | overwrite / same head repeatedly | 5,000 | 250 | 0.02 | 63,618.09 | 0.02 | 56,682.92 | 0.04 | 26,661.83 | 1.89 | 528.36 | crlist |
| crud | overwrite / same middle repeatedly | 5,000 | 250 | 0.01 | 154,454.47 | 0.02 | 47,852.38 | 0.03 | 30,585.53 | 2.12 | 472.34 | crlist |
| crud | overwrite / same tail repeatedly | 5,000 | 250 | 0.01 | 196,772.92 | 0.02 | 50,483.63 | 0.03 | 29,689.45 | 1.81 | 552.75 | crlist |
| crud | overwrite / random visible entries | 5,000 | 250 | 0.02 | 55,006.71 | 0.04 | 26,577.37 | 0.04 | 25,900.03 | 2.08 | 480.6 | crlist |
| crud | overwrite / after insert | 5,000 | 250 | 0.01 | 147,024.23 | 0.02 | 52,141.99 | 0.04 | 27,748.8 | 1.88 | 530.7 | crlist |
| crud | overwrite / after delete | 5,000 | 250 | 0.01 | 158,267.92 | 0.02 | 51,091.31 | 0.03 | 29,531.63 | 1.84 | 543.97 | crlist |
| crud | delete / head | 5,000 | 250 | 0.01 | 199,936.02 | 0.02 | 56,738.23 | 0.05 | 19,060.83 | 0.26 | 3,863.81 | crlist |
| crud | delete / middle | 5,000 | 250 | 0 | 202,461.94 | 0.01 | 71,590.16 | 0.04 | 25,259.41 | 0.29 | 3,500.24 | crlist |
| crud | delete / tail | 5,000 | 250 | 0 | 457,289.19 | 0.02 | 52,329.72 | 0 | 249,252.24 | 0.25 | 3,965.55 | crlist |
| crud | delete / range from head | 5,000 | 5,000 | 0 | 1,153,030.16 | 0 | 9,699,321.05 | 0 | 470,008.74 | 0.01 | 68,267.4 | yjs |
| crud | delete / range from middle | 5,000 | 5,000 | 0 | 574,692.83 | 0 | 7,199,424.05 | 0 | 255,164.53 | 0.02 | 58,128.52 | yjs |
| crud | delete / range from tail | 5,000 | 5,000 | 0 | 625,547.35 | 0 | 7,952,918.72 | 0 | 315,423.58 | 0.02 | 58,196.99 | yjs |
| crud | delete / every other entry | 5,000 | 2,500 | 0.01 | 198,545.06 | 0.09 | 10,594.05 | 0.09 | 11,422.33 | 0.23 | 4,358.09 | crlist |
| crud | delete / all entries from head one by one | 5,000 | 5,000 | 0 | 250,910.81 | 0.01 | 83,663.67 | 0.01 | 118,463.76 | 0.2 | 5,047.11 | crlist |
| crud | delete / all entries from middle outward | 5,000 | 5,000 | 0 | 207,424.98 | 0.01 | 102,005.43 | 0.01 | 175,832.83 | 0.21 | 4,700.22 | crlist |
| crud | delete / all entries from tail one by one | 5,000 | 5,000 | 0 | 472,956.36 | 0.01 | 96,034.36 | 0 | 223,451.7 | 0.2 | 5,001.57 | crlist |
| crud | delete / all entries in random order | 5,000 | 5,000 | 0.13 | 7,626.87 | 12.55 | 79.71 | 7.79 | 128.29 | 0.24 | 4,114.91 | crlist |
| crud | delete / already deleted head | 5,000 | 250 | 0 | 410,172.27 | 0.01 | 85,295.12 | 0 | 537,172.32 | 0.02 | 42,170.61 | json-joy |
| crud | delete / already deleted middle | 5,000 | 250 | 0 | 621,581.3 | 0 | 251,509.05 | 0 | 994,035.79 | 0.03 | 36,835.67 | json-joy |
| crud | delete / already deleted tail | 5,000 | 250 | 0 | 2,192,982.46 | 0.01 | 79,511.48 | 0 | 1,310,272.54 | 0.02 | 46,208.16 | crlist |
| crud | mixed / append overwrite delete tail | 5,000 | 250 | 0.01 | 195,786.67 | 0.04 | 27,129.68 | 0.04 | 23,944.98 | 1.56 | 640.01 | crlist |
| crud | mixed / prepend overwrite delete head | 5,000 | 250 | 0 | 231,867.93 | 0.02 | 59,222.06 | 0.03 | 28,866.69 | 1.6 | 625.76 | crlist |
| crud | mixed / insert overwrite delete middle | 5,000 | 250 | 0.01 | 197,145.34 | 0.02 | 45,920.43 | 0.03 | 28,883.7 | 1.55 | 644.08 | crlist |
| crud | mixed / append prepend insert overwrite delete | 5,000 | 250 | 0 | 210,296.1 | 0.02 | 55,095.2 | 0.03 | 30,452.15 | 1.6 | 625.23 | crlist |
| mags | snapshot | 5,000 | 250 | 0.21 | 4,764.1 | 3.77 | 264.98 | 7.32 | 136.53 | 14.46 | 69.14 | crlist |
| mags | snapshot / clean state | 5,000 | 250 | 0.21 | 4,667.12 | 3.68 | 271.51 | 9.65 | 103.6 | 14.93 | 67 | crlist |
| mags | snapshot / tombstoned state 50% deleted | 5,000 | 250 | 0.12 | 8,280.59 | 1.78 | 561.31 | 3.17 | 315.3 | 14.92 | 67.03 | crlist |
| mags | snapshot / tombstoned state 90% deleted | 5,000 | 250 | 0.03 | 29,775.37 | 0.36 | 2,802 | 0.5 | 1,992.81 | 14.66 | 68.21 | crlist |
| mags | snapshot / after garbage collection | 5,000 | 250 | 0.12 | 8,234.19 | 1.81 | 552.64 | 3.22 | 310.77 | 15.01 | 66.61 | crlist |
| mags | acknowledge | 5,000 | 250 | 0 | 2,118,644.07 | n/a | n/a | n/a | n/a | n/a | n/a | n/a |
| mags | acknowledge / clean state | 5,000 | 250 | 0 | 7,331,378.3 | n/a | n/a | n/a | n/a | n/a | n/a | n/a |
| mags | acknowledge / 50% deleted state | 5,000 | 250 | 0.51 | 1,967.27 | n/a | n/a | n/a | n/a | n/a | n/a | n/a |
| mags | acknowledge / 90% deleted state | 5,000 | 250 | 0.91 | 1,094.01 | n/a | n/a | n/a | n/a | n/a | n/a | n/a |
| mags | garbage collect | 5,000 | 250 | 0 | 928,677.56 | n/a | n/a | n/a | n/a | n/a | n/a | n/a |
| mags | garbage collect / no eligible tombstones | 5,000 | 250 | 0 | 5,567,928.73 | n/a | n/a | n/a | n/a | n/a | n/a | n/a |
| mags | garbage collect / 50% eligible tombstones | 5,000 | 250 | 0 | 248,138.96 | n/a | n/a | n/a | n/a | n/a | n/a | n/a |
| mags | garbage collect / 90% eligible tombstones | 5,000 | 250 | 0.02 | 65,709.93 | n/a | n/a | n/a | n/a | n/a | n/a | n/a |
| mags | garbage collect / partial frontiers 2 replicas | 5,000 | 250 | 0 | 4,302,925.99 | n/a | n/a | n/a | n/a | n/a | n/a | n/a |
| mags | garbage collect / partial frontiers 10 replicas | 5,000 | 250 | 0 | 5,020,080.32 | n/a | n/a | n/a | n/a | n/a | n/a | n/a |
| mags | post-gc read / full iteration visible values | 5,000 | 250 | 0.23 | 4,288.46 | 0.1 | 10,523.88 | 0.6 | 1,658.47 | 0.03 | 33,353.79 | automerge |
| mags | merge ordered deltas | 5,000 | 250 | 0.01 | 97,068.53 | 0.01 | 70,635.44 | 0.01 | 186,748.34 | 3.06 | 327.08 | json-joy |
| mags | merge shuffled gossip | 5,000 | 250 | 0.82 | 1,216.35 | 0.6 | 1,667.4 | n/a | n/a | 0.7 | 1,428.97 | yjs |
| mags | merge / append head delta into equal replica | 5,000 | 1 | 0.06 | 17,123.29 | 0.06 | 16,207.46 | 0.08 | 12,690.36 | 4.29 | 233.23 | crlist |
| mags | merge / append tail delta into equal replica | 5,000 | 1 | 0.04 | 27,472.53 | 0.03 | 30,864.2 | 0.01 | 93,457.94 | 3.69 | 271.19 | json-joy |
| mags | merge / prepend head delta into equal replica | 5,000 | 1 | 0.04 | 28,409.09 | 0.06 | 16,835.02 | 0.01 | 102,040.82 | 3.25 | 307.92 | json-joy |
| mags | merge / insert middle delta into equal replica | 5,000 | 1 | 0.03 | 31,746.03 | 0.03 | 33,112.58 | 0.02 | 63,291.14 | 3.21 | 311.93 | json-joy |
| mags | merge / overwrite head delta into equal replica | 5,000 | 1 | 0.04 | 26,178.01 | 0.03 | 32,258.06 | 0.02 | 51,813.47 | 3.16 | 316.17 | json-joy |
| mags | merge / overwrite middle delta into equal replica | 5,000 | 1 | 0.03 | 29,585.8 | 0.03 | 33,003.3 | 0.01 | 72,463.77 | 3.24 | 308.93 | json-joy |
| mags | merge / overwrite tail delta into equal replica | 5,000 | 1 | 0.04 | 28,248.59 | 0.03 | 34,482.76 | 0.01 | 90,909.09 | 3.52 | 284.36 | json-joy |
| mags | merge / delete head delta into equal replica | 5,000 | 1 | 0.03 | 31,746.03 | 0.02 | 41,841 | 0.02 | 52,910.05 | 1.7 | 589.73 | json-joy |
| mags | merge / delete middle delta into equal replica | 5,000 | 1 | 0.04 | 25,188.92 | 0.11 | 9,478.67 | 0.08 | 13,003.9 | 1.79 | 558.63 | crlist |
| mags | merge / delete tail delta into equal replica | 5,000 | 1 | 0.02 | 48,780.49 | 0.03 | 38,759.69 | 0.01 | 86,956.52 | 1.9 | 526.18 | json-joy |
| mags | merge / duplicate delta ignored | 5,000 | 250 | 0 | 707,814.27 | 0.03 | 32,990.23 | 0.01 | 127,733.5 | 0.03 | 33,278.76 | crlist |
| mags | merge / old delta ignored after merge | 5,000 | 250 | 0 | 702,444.51 | 0.03 | 29,254.48 | 0 | 281,151.6 | 0.03 | 34,014.53 | crlist |
| mags | merge / ordered 1,000 append deltas | 5,000 | 1,000 | 0 | 223,538.62 | 0.02 | 47,549.99 | 0 | 212,363.82 | 3.45 | 289.8 | crlist |
| mags | merge / ordered 1,000 prepend deltas | 5,000 | 1,000 | 0 | 235,377.19 | 0.01 | 104,652.87 | 0.01 | 78,633.66 | 3.48 | 287.1 | crlist |
| mags | merge / ordered 1,000 middle insert deltas | 5,000 | 1,000 | 0.01 | 187,515.24 | 0.01 | 145,836.37 | 0 | 264,809.47 | 3.42 | 292.03 | json-joy |
| mags | merge / shuffled 1,000 mixed deltas | 5,000 | 1,000 | 0.85 | 1,178 | 1.22 | 820.39 | n/a | n/a | 0.86 | 1,166.3 | crlist |
| mags | merge / reverse ordered 1,000 mixed deltas | 5,000 | 1,000 | 0.23 | 4,303.22 | 1.14 | 877.07 | n/a | n/a | 0.84 | 1,186.68 | crlist |
| mags | merge / concurrent prepends same head | 5,000 | 2 | 0.07 | 14,194.46 | 0.11 | 9,099.18 | n/a | n/a | 11.94 | 83.72 | crlist |
| mags | merge / concurrent appends same tail | 5,000 | 2 | 0.03 | 34,542.31 | 0.03 | 29,027.58 | n/a | n/a | 10.53 | 95 | crlist |
| mags | merge / concurrent inserts same middle position | 5,000 | 2 | 0.03 | 29,585.8 | 0.05 | 20,597.32 | n/a | n/a | 15.19 | 65.83 | crlist |
| mags | merge / concurrent overwrites same head | 5,000 | 2 | 0.03 | 38,610.04 | 0.04 | 23,696.68 | n/a | n/a | 8.65 | 115.66 | crlist |
| mags | merge / concurrent overwrites same middle | 5,000 | 2 | 0.03 | 28,860.03 | 0.04 | 25,157.23 | n/a | n/a | 11.04 | 90.58 | crlist |
| mags | merge / concurrent overwrites same tail | 5,000 | 2 | 0.03 | 30,303.03 | 0.04 | 22,857.14 | n/a | n/a | 8.29 | 120.56 | crlist |
| mags | merge / concurrent deletes same head | 5,000 | 2 | 0.03 | 29,629.63 | 0.03 | 36,697.25 | 0.02 | 45,558.09 | 7.7 | 129.84 | json-joy |
| mags | merge / concurrent deletes same middle | 5,000 | 2 | 0.04 | 24,038.46 | 0.03 | 35,273.37 | 0.02 | 48,543.69 | 5.58 | 179.24 | json-joy |
| mags | merge / concurrent deletes same tail | 5,000 | 2 | 0.01 | 67,796.61 | 0.02 | 44,742.73 | 0.02 | 59,171.6 | 11.43 | 87.46 | crlist |
| mags | merge / concurrent overwrite delete same entry | 5,000 | 2 | 0.08 | 12,254.9 | 0.07 | 15,060.24 | 0.06 | 16,625.1 | 8.99 | 111.25 | json-joy |
| mags | merge / forked replicas rejoin after 250 ops each | 5,000 | 500 | 0.01 | 133,230.3 | 0.01 | 87,627.06 | n/a | n/a | 3.15 | 316.98 | crlist |
| mags | merge / 10 replicas gossip convergence | 5,000 | 100 | 0.01 | 126,566.26 | 0.01 | 91,166.01 | n/a | n/a | 6.02 | 166.21 | crlist |
| mags | merge / snapshot merge into stale replica | 5,000 | 5,350 | 0 | 691,321.65 | 0 | 327,265.16 | 0 | 234,449.63 | 0.03 | 32,260.53 | crlist |
| class | constructor / hydrate snapshot | 5,000 | 250 | 5.36 | 186.57 | 6.7 | 149.3 | 17.6 | 56.81 | 169.98 | 5.88 | crlist |
| class | read / head | 5,000 | 250 | 0 | 1,267,748.48 | 0 | 5,353,319.06 | 0 | 1,339,046.6 | 0 | 2,505,010.02 | yjs |
| class | read / middle | 5,000 | 250 | 0 | 1,663,339.99 | 0 | 15,625,000 | 0 | 3,709,198.81 | 0 | 10,822,510.82 | yjs |
| class | read / tail | 5,000 | 250 | 0 | 2,711,496.75 | 0 | 16,129,032.26 | 0 | 3,546,099.29 | 0 | 10,869,565.22 | yjs |
| class | find near head | 5,000 | 250 | 0 | 596,374.05 | 0 | 3,703,703.7 | 0 | 1,238,850.35 | 0 | 1,876,876.88 | yjs |
| class | find near middle | 5,000 | 250 | 0.06 | 15,830.6 | 0.08 | 12,126.8 | 0.75 | 1,327.81 | 0.03 | 36,249.75 | automerge |
| class | find near tail | 5,000 | 250 | 0.09 | 10,699.81 | 0.16 | 6,435.69 | 1.67 | 600.43 | 0.05 | 19,292.65 | automerge |
| class | iterate visible values | 5,000 | 250 | 0.14 | 6,944.44 | 0.23 | 4,268.53 | 1.57 | 637.26 | 0.07 | 13,793.18 | automerge |
| class | collect visible values to array | 5,000 | 250 | 0.12 | 8,037.45 | 0.23 | 4,256.33 | 1.57 | 636.35 | 0.08 | 12,213.23 | automerge |
| class | append / single after tail | 5,000 | 250 | 0 | 217,315.72 | 0.02 | 42,326.25 | 0.03 | 34,564.28 | 2.23 | 447.87 | crlist |
| class | append / batch after tail | 5,000 | 25,000 | 0 | 1,485,442.66 | 0 | 576,930.18 | 0.01 | 148,384.6 | 0.19 | 5,328.24 | crlist |
| class | prepend / single before head | 5,000 | 250 | 0 | 202,069.19 | 0.01 | 73,120.8 | 0.01 | 86,022.99 | 2.31 | 432.44 | crlist |
| class | prepend / batch before head | 5,000 | 25,000 | 0 | 1,665,844.85 | 0 | 850,843.7 | 0.01 | 174,450.53 | 0.18 | 5,410.59 | crlist |
| class | insert / single before middle | 5,000 | 250 | 0.01 | 148,192.06 | 0.02 | 63,809.69 | 0.01 | 174,179.61 | 1.87 | 534.11 | json-joy |
| class | insert / batch before middle | 5,000 | 25,000 | 0 | 783,544.32 | 0 | 843,272.71 | 0.01 | 191,286.08 | 0.18 | 5,427.04 | yjs |
| class | overwrite / head | 5,000 | 250 | 0.01 | 156,250 | 0.02 | 53,438.21 | 0.04 | 27,837.78 | 1.98 | 505.25 | crlist |
| class | overwrite / middle | 5,000 | 250 | 0.01 | 156,926.75 | 0.02 | 42,878.7 | 0.03 | 30,091.84 | 1.87 | 533.93 | crlist |
| class | overwrite / tail | 5,000 | 250 | 0 | 200,256.33 | 0.02 | 56,825.93 | 0.04 | 26,892.42 | 1.91 | 523 | crlist |
| class | overwrite / random | 5,000 | 250 | 0.02 | 56,977.46 | 0.03 | 30,738.21 | 0.04 | 24,254.89 | 2.11 | 474.54 | crlist |
| class | remove / head | 5,000 | 250 | 0.01 | 135,589.54 | 0.02 | 60,471.19 | 0.06 | 17,223.44 | 0.28 | 3,626.48 | crlist |
| class | remove / middle | 5,000 | 250 | 0.01 | 123,878.9 | 0.01 | 101,391.09 | 0.04 | 26,535.62 | 0.31 | 3,185.54 | crlist |
| class | remove / tail | 5,000 | 250 | 0 | 234,918.25 | 0.01 | 70,220.77 | 0 | 229,948.49 | 0.24 | 4,171.6 | crlist |
| class | remove / range from head | 5,000 | 5,000 | 0 | 844,024.31 | 0 | 9,861,932.94 | 0 | 293,996.59 | 0.02 | 62,898.07 | yjs |
| class | remove / range from middle | 5,000 | 5,000 | 0 | 852,907.56 | 0 | 8,369,601.61 | 0 | 288,006.82 | 0.02 | 61,179.07 | yjs |
| class | remove / range from tail | 5,000 | 5,000 | 0 | 709,834.04 | 0 | 9,569,377.99 | 0 | 273,866.06 | 0.02 | 64,153.23 | yjs |
| class | mixed / append overwrite remove tail | 5,000 | 250 | 0 | 236,317.23 | 0.01 | 67,191.66 | 0.01 | 144,675.93 | 1.52 | 659.49 | crlist |
| class | mixed / prepend overwrite remove head | 5,000 | 250 | 0 | 208,159.87 | 0.01 | 73,898.91 | 0.01 | 156,425.98 | 1.46 | 686.55 | crlist |
| class | mixed / insert overwrite remove middle | 5,000 | 250 | 0.01 | 185,294.99 | 0.01 | 67,483.67 | 0.01 | 161,404.87 | 1.37 | 729.66 | crlist |
| class | paste / insert 10,000 entries at cursor | 5,000 | 10,000 | 0 | 565,374.22 | 0 | 849,091.05 | 0.01 | 83,137.75 | 0.17 | 5,867.37 | yjs |
| class | render / join visible entries to string | 5,000 | 250 | 0.23 | 4,296.05 | 0.36 | 2,790.36 | 2.06 | 484.27 | 0.18 | 5,683.08 | automerge |
| class | snapshot | 5,000 | 250 | 0.26 | 3,789.55 | 3.56 | 280.57 | 7.36 | 135.89 | 14.83 | 67.42 | crlist |
| class | snapshot / tombstoned state 50% deleted | 5,000 | 250 | 0.12 | 8,600.29 | 1.77 | 565.25 | 2.97 | 336.7 | 14.9 | 67.1 | crlist |
| class | snapshot / after garbage collection | 5,000 | 250 | 0.18 | 5,652.14 | 0.24 | 4,159.15 | 1.79 | 557.33 | 0.07 | 13,862.32 | automerge |
| class | acknowledge | 5,000 | 250 | 0.58 | 1,738.14 | n/a | n/a | n/a | n/a | n/a | n/a | n/a |
| class | acknowledge / 50% deleted state | 5,000 | 250 | 0.53 | 1,885.68 | n/a | n/a | n/a | n/a | n/a | n/a | n/a |
| class | acknowledge / 90% deleted state | 5,000 | 250 | 0.93 | 1,073.94 | n/a | n/a | n/a | n/a | n/a | n/a | n/a |
| class | garbage collect | 5,000 | 250 | 0.13 | 7,996.78 | 0.23 | 4,331.65 | 1.71 | 583.62 | 0.08 | 13,114.96 | automerge |
| class | garbage collect / no eligible tombstones | 5,000 | 250 | 0.11 | 9,041.56 | 0.24 | 4,176.06 | 1.52 | 656.4 | 0.07 | 13,720.58 | automerge |
| class | garbage collect / 90% eligible tombstones | 5,000 | 250 | 0.11 | 9,169.7 | 0.23 | 4,413.46 | 1.68 | 595.95 | 0.07 | 13,906.12 | automerge |
| class | merge ordered deltas | 5,000 | 250 | 0.01 | 119,766.22 | 0.02 | 57,897.17 | 0 | 252,016.13 | 3.04 | 328.66 | json-joy |
| class | merge shuffled gossip | 5,000 | 250 | 0.68 | 1,461.06 | 0.37 | 2,737.9 | n/a | n/a | 0.66 | 1,523.46 | yjs |
| class | merge / duplicate delta ignored | 5,000 | 250 | 0 | 603,864.73 | 0.03 | 38,341.79 | 0 | 322,663.91 | 0.03 | 30,151.36 | crlist |
| class | merge / concurrent prepends same head | 5,000 | 2 | 0.08 | 12,539.18 | 0.12 | 8,572.65 | n/a | n/a | 9.45 | 105.83 | crlist |
| class | merge / concurrent appends same tail | 5,000 | 2 | 0.11 | 9,165.9 | 0.03 | 38,834.95 | n/a | n/a | 8.59 | 116.37 | yjs |
| class | merge / concurrent inserts same middle position | 5,000 | 2 | 0.04 | 27,173.91 | 0.04 | 27,247.96 | n/a | n/a | 10.13 | 98.72 | yjs |
| class | merge / forked replicas rejoin after 250 ops each | 5,000 | 500 | 0.25 | 4,034.01 | 0.01 | 110,132.16 | n/a | n/a | 3.03 | 329.85 | yjs |
| latency | append tail write to remote visible | 5,000 | 250 | 0.23 | 4,395.23 | 0.23 | 4,257.87 | 10.34 | 96.67 | 5.49 | 182.27 | crlist |
| latency | prepend head write to remote visible | 5,000 | 250 | 0.01 | 127,051.89 | 0.03 | 30,478.88 | 0.02 | 58,319.92 | 5.6 | 178.46 | crlist |
| latency | middle insert write to remote visible | 5,000 | 250 | 0.28 | 3,631.27 | 0.14 | 7,086.31 | 4.15 | 240.97 | 5.69 | 175.61 | yjs |
| latency | head insert write to remote visible | 5,000 | 250 | 0.01 | 142,385.24 | 0.03 | 39,580.76 | 0.02 | 60,591.37 | 5.57 | 179.51 | crlist |
| latency | overwrite head write to remote visible | 5,000 | 250 | 0.01 | 74,513.43 | 0.03 | 28,841.05 | 0.04 | 25,717.78 | 5.59 | 178.8 | crlist |
| latency | overwrite middle write to remote visible | 5,000 | 250 | 0.28 | 3,540.41 | 0.13 | 7,590.27 | 2.41 | 414.42 | 5.58 | 179.1 | yjs |
| latency | overwrite tail write to remote visible | 5,000 | 250 | 0.58 | 1,735 | 0.21 | 4,678.67 | 5.44 | 183.98 | 5.49 | 182.17 | yjs |
| latency | head delete to remote hidden | 5,000 | 250 | 0.62 | 1,603.11 | 0.26 | 3,911.23 | 5.35 | 187.05 | 2.11 | 473.61 | yjs |
| latency | middle delete to remote hidden | 5,000 | 250 | 0.62 | 1,609.25 | 0.25 | 3,987.11 | 6.33 | 158 | 2.06 | 485.07 | yjs |
| latency | tail delete to remote hidden | 5,000 | 250 | 0.18 | 5,620.44 | 0.21 | 4,858.06 | 5.47 | 182.91 | 2.12 | 471.65 | crlist |
| latency | append tail write to 10 remotes visible | 5,000 | 2,500 | 0.24 | 4,183.56 | 0.2 | 5,043.35 | 11.85 | 84.42 | 4.05 | 246.81 | yjs |
| latency | prepend head write to 10 remotes visible | 5,000 | 2,500 | 0 | 222,665.57 | 0.01 | 90,649.67 | 0.01 | 79,785.79 | 3.77 | 265.33 | crlist |
| latency | middle insert write to 10 remotes visible | 5,000 | 2,500 | 0.33 | 3,074.78 | 0.11 | 9,364.35 | 4.63 | 216.02 | 3.75 | 266.43 | yjs |
| latency | overwrite middle write to 10 remotes visible | 5,000 | 2,500 | 0.31 | 3,233.75 | 0.11 | 9,016.01 | 3.24 | 308.17 | 3.77 | 265.48 | yjs |
| latency | delete middle to 10 remotes hidden | 5,000 | 2,500 | 0.65 | 1,537.87 | 0.23 | 4,286.95 | 6.22 | 160.74 | 1.82 | 549.93 | yjs |
| latency | out-of-order write delivery to remote visible | 5,000 | 248 | 1.69 | 590.27 | 73.62 | 13.58 | n/a | n/a | 16.22 | 61.66 | crlist |
| latency | out-of-order delete delivery to remote convergence | 5,000 | 165 | 2.39 | 418.34 | 0.22 | 4,601.48 | 7.9 | 126.54 | 6.27 | 159.6 | yjs |
| latency | out-of-order append delivery to convergence | 5,000 | 250 | 1.53 | 654.34 | 21.48 | 46.57 | n/a | n/a | 14.94 | 66.92 | crlist |
| latency | out-of-order prepend delivery to convergence | 5,000 | 248 | 1.52 | 659.69 | 22.39 | 44.67 | 0.1 | 9,608.92 | 16.79 | 59.58 | json-joy |
| latency | out-of-order middle insert delivery to convergence | 5,000 | 248 | 1.5 | 666.58 | 70.14 | 14.26 | n/a | n/a | 16.11 | 62.09 | crlist |
| latency | out-of-order overwrite delivery to convergence | 5,000 | 129 | 2.09 | 478.23 | n/a | n/a | 239.12 | 4.18 | 72.4 | 13.81 | crlist |
| latency | offline burst 1,000 ops then sync | 5,000 | 1,000 | 0.01 | 181,679.44 | 0.03 | 36,871.66 | 0.01 | 109,419.96 | 3.2 | 312.08 | crlist |
| latency | forked replicas mixed ops then converge | 5,000 | 500 | 0.01 | 197,800.46 | 0.01 | 85,068.74 | n/a | n/a | 3.11 | 321.2 | crlist |
| latency | duplicate shuffled gossip to convergence | 5,000 | 500 | 0.39 | 2,585.59 | 0.2 | 5,045.83 | n/a | n/a | 0.39 | 2,576.62 | yjs |
| latency | remote snapshot hydrate then apply pending deltas | 5,000 | 250 | 0.03 | 33,562.45 | 0.04 | 22,935.99 | 0.1 | 9,971.32 | 0.69 | 1,455.53 | crlist |
| workload | local app session | 5,000 | 250 | 0.01 | 122,693.36 | 0.01 | 67,485.49 | 0.04 | 25,823.25 | 1.28 | 780.29 | crlist |
| workload | read heavy session | 5,000 | 250 | 0 | 2,538,071.07 | 0 | 4,990,019.96 | 0 | 319,325.58 | 0 | 2,512,562.81 | yjs |
| workload | write heavy session | 5,000 | 250 | 0.01 | 124,794.09 | 0.01 | 75,131.48 | 0.01 | 153,214.44 | 1.39 | 719.86 | json-joy |
| workload | append tail heavy session | 5,000 | 250 | 0 | 342,888.49 | 0.02 | 63,606.76 | 0.01 | 157,878.12 | 1.61 | 621.81 | crlist |
| workload | prepend head heavy session | 5,000 | 250 | 0.01 | 162,993.87 | 0.01 | 94,578.75 | 0.01 | 125,062.53 | 2.03 | 493.49 | crlist |
| workload | insert middle heavy session | 5,000 | 250 | 0.02 | 42,841.23 | 0.01 | 72,911.81 | 0.01 | 152,895.85 | 2.32 | 431.28 | json-joy |
| workload | overwrite heavy session | 5,000 | 250 | 0.01 | 143,777.32 | 0.01 | 69,810.95 | 0.01 | 148,359.15 | 1.97 | 506.46 | json-joy |
| workload | delete heavy session | 5,000 | 250 | 0.01 | 157,599.45 | 0.02 | 62,644.08 | 0 | 234,455.59 | 0.27 | 3,721.01 | json-joy |
| workload | balanced append prepend insert overwrite delete session | 5,000 | 250 | 0.01 | 137,370.19 | 0.01 | 73,661.57 | 0.01 | 152,364.7 | 1.66 | 604.06 | json-joy |
| workload | random edit session | 5,000 | 250 | 0.02 | 59,710.05 | 0.02 | 40,946.69 | 0.06 | 16,807.29 | 1.51 | 660.63 | crlist |
| workload | text editing session | 5,000 | 250 | 0.01 | 134,698.28 | 0.01 | 83,951.78 | 0.03 | 30,337.6 | 1.82 | 547.99 | crlist |
| workload | collaborative offline session | 5,000 | 500 | 0 | 211,488.03 | 0.01 | 84,026.55 | n/a | n/a | 3.16 | 316.51 | crlist |
| workload | sync and cleanup session | 5,000 | 252 | 0.03 | 35,126.85 | 0.01 | 119,981.76 | n/a | n/a | 3.18 | 314.64 | yjs |
| workload | long lived tombstoned session | 5,000 | 250 | 0 | 262,081.98 | 0.01 | 80,801.55 | 0.01 | 162,749.82 | 1.79 | 560.07 | crlist |
| workload | sparse visible session | 5,000 | 250 | 0 | 234,038.57 | 0.13 | 7,908.91 | 0.01 | 76,403.53 | 1.02 | 979.92 | crlist |
| workload | post-gc edit session | 5,000 | 250 | 0 | 261,451.58 | 0.02 | 55,084.28 | 0.04 | 25,758.59 | 1.55 | 644.62 | crlist |

## License

Apache-2.0
