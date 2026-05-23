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
| crud | create / empty list | 5,000 | 250 | 0 | 412,269.13 | 0.16 | 6,100.05 | 0.04 | 26,778.35 | 0.43 | 2,318.64 | crlist |
| crud | create / hydrate snapshot | 5,000 | 250 | 5.51 | 181.52 | 8.36 | 119.56 | 23.19 | 43.12 | 205.32 | 4.87 | crlist |
| crud | create / hydrate clean snapshot | 5,000 | 250 | 5.01 | 199.48 | 8.14 | 122.81 | 22.29 | 44.86 | 204.41 | 4.89 | crlist |
| crud | create / hydrate tombstoned snapshot | 5,000 | 250 | 4.12 | 242.46 | 4.24 | 235.62 | 10.64 | 93.96 | 216.76 | 4.61 | crlist |
| crud | read / head | 5,000 | 250 | 0 | 1,197,891.71 | 0 | 844,594.59 | 0 | 227,355.4 | 0 | 3,136,762.86 | automerge |
| crud | read / middle | 5,000 | 250 | 0 | 3,369,272.24 | 0 | 1,853,224.61 | 0 | 304,247.29 | 0 | 7,668,711.66 | automerge |
| crud | read / tail | 5,000 | 250 | 0 | 5,813,953.49 | 0 | 1,472,320.38 | 0 | 562,936.28 | 0 | 7,668,711.66 | automerge |
| crud | read / random indexed reads | 5,000 | 250 | 0 | 827,540.55 | 0 | 771,604.94 | 0.01 | 137,166.68 | 0 | 1,167,133.52 | automerge |
| crud | read / sequential indexed reads from head | 5,000 | 250 | 0 | 1,090,274.75 | 0 | 1,163,331.78 | 0.01 | 127,194.1 | 0 | 1,261,988.89 | automerge |
| crud | read / sequential indexed reads from middle | 5,000 | 250 | 0 | 2,673,796.79 | 0 | 1,883,948.76 | 0 | 228,707.35 | 0 | 8,038,585.21 | automerge |
| crud | read / sequential indexed reads from tail | 5,000 | 250 | 0 | 2,480,158.73 | 0 | 2,338,634.24 | 0 | 261,780.1 | 0 | 6,983,240.22 | automerge |
| crud | read / full iteration visible values | 5,000 | 250 | 0.78 | 1,274.31 | 0.25 | 3,995.96 | 2.14 | 467.88 | 0.08 | 12,610.98 | automerge |
| crud | read / collect visible values to array | 5,000 | 250 | 0.78 | 1,276.53 | 0.25 | 4,019.96 | 1.9 | 526.61 | 0.09 | 10,677.46 | automerge |
| crud | read / visible sparse over deleted entries | 5,000 | 250 | 0 | 2,055,921.05 | 0.04 | 24,007.99 | 0.04 | 27,897.74 | 0 | 9,259,259.26 | automerge |
| crud | find / head | 5,000 | 250 | 0 | 1,224,889.76 | 0 | 1,711,156.74 | 0 | 591,436.01 | 0 | 1,375,137.51 | yjs |
| crud | find / middle | 5,000 | 250 | 0.3 | 3,327.7 | 0.16 | 6,412.28 | 0.78 | 1,277.02 | 0.02 | 66,365.81 | automerge |
| crud | find / tail | 5,000 | 250 | 0.43 | 2,310.81 | 0.24 | 4,179.64 | 2.17 | 460.72 | 0.02 | 45,596.31 | automerge |
| crud | find / missing value | 5,000 | 250 | 0.48 | 2,099.98 | 0.27 | 3,731.8 | 1.81 | 551.73 | 0.04 | 28,243.48 | automerge |
| crud | append / single after tail | 5,000 | 250 | 0.01 | 97,234.65 | 0.03 | 29,921.13 | 0.04 | 25,416.32 | 2.4 | 416.42 | crlist |
| crud | append / batch after tail | 5,000 | 25,000 | 0.01 | 162,316.58 | 0 | 453,850.65 | 0.01 | 122,930.59 | 0.23 | 4,402.74 | yjs |
| crud | append / batch after deleted tail | 5,000 | 25,000 | 0.01 | 171,049.06 | 0 | 500,472.45 | 0.01 | 110,834.86 | 0.29 | 3,487.16 | yjs |
| crud | append / batch after garbage collection | 5,000 | 25,000 | 0.01 | 162,976.98 | 0 | 564,359.56 | 0.01 | 118,191.35 | 0.24 | 4,210.62 | yjs |
| crud | prepend / single before head | 5,000 | 250 | 0.01 | 84,146.75 | 0.02 | 54,219.35 | 0.05 | 20,802.3 | 2.55 | 391.41 | crlist |
| crud | prepend / batch before head | 5,000 | 25,000 | 0.01 | 140,496.24 | 0 | 674,803.9 | 0.01 | 130,322.64 | 0.25 | 4,036.43 | yjs |
| crud | prepend / batch before deleted head | 5,000 | 25,000 | 0.01 | 165,769.41 | 0 | 716,463.76 | 0.01 | 147,387.06 | 0.24 | 4,103.16 | yjs |
| crud | prepend / batch after garbage collection | 5,000 | 25,000 | 0.01 | 161,709.41 | 0 | 602,987.93 | 0.01 | 150,038.86 | 0.24 | 4,240.28 | yjs |
| crud | insert / single before head | 5,000 | 250 | 0.01 | 137,415.49 | 0.02 | 63,850.44 | 0.01 | 101,957.59 | 2.39 | 418.64 | crlist |
| crud | insert / single after head | 5,000 | 250 | 0.01 | 109,156.01 | 0.02 | 48,865.35 | 0.02 | 65,888.31 | 2.39 | 418.83 | crlist |
| crud | insert / single before middle | 5,000 | 250 | 0.01 | 86,929.31 | 0.02 | 48,364.32 | 0.01 | 104,362.35 | 2.76 | 362.38 | json-joy |
| crud | insert / single after middle | 5,000 | 250 | 0.01 | 111,557.34 | 0.02 | 45,961.8 | 0.01 | 107,213.31 | 3.04 | 329.27 | crlist |
| crud | insert / single before tail | 5,000 | 250 | 0.01 | 99,828.3 | 0.04 | 28,455.01 | 0.01 | 97,519.11 | 2.86 | 350.12 | crlist |
| crud | insert / single after tail | 5,000 | 250 | 0.01 | 146,481.51 | 0.04 | 27,734.64 | 0.01 | 130,684.79 | 3.01 | 331.77 | crlist |
| crud | insert / batch before head | 5,000 | 25,000 | 0.01 | 167,284.62 | 0 | 746,217.42 | 0.01 | 134,032.23 | 0.29 | 3,488.84 | yjs |
| crud | insert / batch after head | 5,000 | 25,000 | 0.01 | 160,303.99 | 0 | 636,009.32 | 0.01 | 155,230.43 | 0.24 | 4,215.5 | yjs |
| crud | insert / batch before middle | 5,000 | 25,000 | 0.01 | 132,304.04 | 0 | 580,113.7 | 0.01 | 156,129.39 | 0.23 | 4,261.81 | yjs |
| crud | insert / batch after middle | 5,000 | 25,000 | 0.01 | 146,707.59 | 0 | 739,194.46 | 0.01 | 122,170.35 | 0.24 | 4,160.02 | yjs |
| crud | insert / batch before tail | 5,000 | 25,000 | 0.02 | 49,934.41 | 0 | 568,960.26 | 0.01 | 161,878.73 | 0.23 | 4,432.55 | yjs |
| crud | insert / batch after tail | 5,000 | 25,000 | 0.01 | 147,827 | 0 | 420,425.98 | 0.01 | 125,990.98 | 0.24 | 4,212.21 | yjs |
| crud | insert / repeated before head | 5,000 | 250 | 0.01 | 112,193.15 | 0.01 | 79,126.44 | 0.01 | 114,842.21 | 2.53 | 395.73 | json-joy |
| crud | insert / repeated before middle | 5,000 | 250 | 0.01 | 116,219.61 | 0.02 | 60,061.5 | 0.01 | 127,622.65 | 2.93 | 341.79 | json-joy |
| crud | insert / repeated before tail | 5,000 | 250 | 0.01 | 125,382.42 | 0.02 | 63,587.34 | 0.04 | 23,696.01 | 2.54 | 394.43 | crlist |
| crud | insert / random positions | 5,000 | 250 | 0.01 | 107,397.54 | 0.04 | 24,147.82 | 0.07 | 13,732.11 | 2.31 | 432.72 | crlist |
| crud | insert / alternating head and tail | 5,000 | 250 | 0.06 | 16,322.59 | 0.01 | 71,389.82 | 0.01 | 110,850 | 2.58 | 387.84 | json-joy |
| crud | overwrite / head | 5,000 | 250 | 0.01 | 89,740.83 | 0.05 | 20,542.65 | 0.02 | 52,092.02 | 2.65 | 378.03 | crlist |
| crud | overwrite / middle | 5,000 | 250 | 0.01 | 111,786.8 | 0.04 | 24,279.39 | 0.01 | 102,745.36 | 2.64 | 379.2 | crlist |
| crud | overwrite / tail | 5,000 | 250 | 0.01 | 118,804.35 | 0.02 | 43,825.05 | 0.01 | 94,916.28 | 2.44 | 410.58 | crlist |
| crud | overwrite / random | 5,000 | 250 | 0.03 | 37,008.53 | 0.04 | 24,322.14 | 0.04 | 23,521 | 2.88 | 347.46 | crlist |
| crud | overwrite / same head repeatedly | 5,000 | 250 | 0.01 | 137,741.05 | 0.02 | 46,417.5 | 0.05 | 21,596.97 | 2.43 | 411.73 | crlist |
| crud | overwrite / same middle repeatedly | 5,000 | 250 | 0.01 | 125,125.13 | 0.03 | 37,939.15 | 0.05 | 20,127.85 | 2.43 | 411.45 | crlist |
| crud | overwrite / same tail repeatedly | 5,000 | 250 | 0.01 | 141,099.45 | 0.02 | 43,150.32 | 0.06 | 16,776.05 | 2.32 | 431.61 | crlist |
| crud | overwrite / random visible entries | 5,000 | 250 | 0.02 | 56,038.73 | 0.04 | 23,483.44 | 0.05 | 18,452.64 | 2.56 | 389.87 | crlist |
| crud | overwrite / after insert | 5,000 | 250 | 0.01 | 127,187.63 | 0.02 | 41,720.9 | 0.05 | 20,958.91 | 2.53 | 395.07 | crlist |
| crud | overwrite / after delete | 5,000 | 250 | 0.01 | 96,521.37 | 0.02 | 43,341.83 | 0.01 | 93,833.28 | 2.27 | 439.66 | crlist |
| crud | delete / head | 5,000 | 250 | 0.01 | 113,760.47 | 0.02 | 44,323.1 | 0.01 | 67,460 | 0.32 | 3,115.22 | crlist |
| crud | delete / middle | 5,000 | 250 | 0.01 | 114,563.28 | 0.02 | 54,691.43 | 0.04 | 25,749.84 | 0.31 | 3,192.2 | crlist |
| crud | delete / tail | 5,000 | 250 | 0 | 593,683.21 | 0.02 | 48,328.79 | 0 | 213,967.82 | 0.4 | 2,523.26 | crlist |
| crud | delete / range from head | 5,000 | 5,000 | 0 | 1,482,711.58 | 0 | 7,174,630.51 | 0 | 283,675.07 | 0.02 | 42,625.09 | yjs |
| crud | delete / range from middle | 5,000 | 5,000 | 0 | 707,243.59 | 0 | 5,650,355.97 | 0 | 205,651.3 | 0.02 | 41,344.76 | yjs |
| crud | delete / range from tail | 5,000 | 5,000 | 0 | 585,021.12 | 0 | 5,895,531.19 | 0.01 | 188,903.08 | 0.02 | 47,142.02 | yjs |
| crud | delete / every other entry | 5,000 | 2,500 | 0.01 | 89,745.66 | 0.12 | 8,232.5 | 0.11 | 9,488.24 | 0.31 | 3,267.45 | crlist |
| crud | delete / all entries from head one by one | 5,000 | 5,000 | 0.01 | 121,401.36 | 0.01 | 71,209.35 | 0.01 | 91,584.65 | 0.31 | 3,183.12 | crlist |
| crud | delete / all entries from middle outward | 5,000 | 5,000 | 0.01 | 96,231.02 | 0.01 | 81,688.53 | 0.01 | 109,880.69 | 0.27 | 3,676.65 | json-joy |
| crud | delete / all entries from tail one by one | 5,000 | 5,000 | 0 | 344,369.22 | 0.01 | 77,696.46 | 0.01 | 198,831.67 | 0.26 | 3,802.69 | crlist |
| crud | delete / all entries in random order | 5,000 | 5,000 | 0.19 | 5,373.15 | 14.27 | 70.06 | 10.36 | 96.52 | 0.47 | 2,150.33 | crlist |
| crud | delete / already deleted head | 5,000 | 250 | 0 | 295,124.54 | 0 | 225,245.52 | 0 | 500,700.98 | 0.04 | 22,664.84 | json-joy |
| crud | delete / already deleted middle | 5,000 | 250 | 0 | 610,053.68 | 0 | 253,961.8 | 0 | 951,655.88 | 0.03 | 36,243.97 | json-joy |
| crud | delete / already deleted tail | 5,000 | 250 | 0 | 1,440,092.17 | 0 | 209,170.01 | 0 | 1,164,415.46 | 0.03 | 33,494.55 | crlist |
| crud | mixed / append overwrite delete tail | 5,000 | 250 | 0.01 | 125,590.27 | 0.03 | 29,065.04 | 0.02 | 48,656.12 | 1.97 | 506.98 | crlist |
| crud | mixed / prepend overwrite delete head | 5,000 | 250 | 0.01 | 103,506.81 | 0.02 | 51,294.68 | 0.01 | 72,442.77 | 2.29 | 437.6 | crlist |
| crud | mixed / insert overwrite delete middle | 5,000 | 250 | 0.01 | 122,464.98 | 0.02 | 50,838.84 | 0.01 | 91,999.71 | 1.96 | 510.43 | crlist |
| crud | mixed / append prepend insert overwrite delete | 5,000 | 250 | 0.01 | 86,682.15 | 0.02 | 43,272.06 | 0.01 | 106,709.92 | 2.38 | 419.32 | json-joy |
| mags | snapshot | 5,000 | 250 | 0.16 | 6,168.54 | 4.5 | 222.07 | 10.06 | 99.44 | 18.38 | 54.4 | crlist |
| mags | snapshot / clean state | 5,000 | 250 | 0.15 | 6,490.05 | 4.42 | 226.45 | 8.25 | 121.22 | 18.86 | 53.03 | crlist |
| mags | snapshot / tombstoned state 50% deleted | 5,000 | 250 | 0.09 | 10,579.73 | 2.2 | 454.29 | 3.9 | 256.22 | 19.3 | 51.81 | crlist |
| mags | snapshot / tombstoned state 90% deleted | 5,000 | 250 | 0.03 | 32,774.42 | 0.46 | 2,185.15 | 0.64 | 1,565.39 | 19.4 | 51.54 | crlist |
| mags | snapshot / after garbage collection | 5,000 | 250 | 0.11 | 9,035.91 | 2.54 | 394.03 | 4.29 | 232.94 | 18.9 | 52.9 | crlist |
| mags | acknowledge | 5,000 | 250 | 0 | 1,696,065.13 | n/a | n/a | n/a | n/a | n/a | n/a | n/a |
| mags | acknowledge / clean state | 5,000 | 250 | 0 | 6,393,861.89 | n/a | n/a | n/a | n/a | n/a | n/a | n/a |
| mags | acknowledge / 50% deleted state | 5,000 | 250 | 0.05 | 19,339.22 | n/a | n/a | n/a | n/a | n/a | n/a | n/a |
| mags | acknowledge / 90% deleted state | 5,000 | 250 | 0.07 | 13,344.08 | n/a | n/a | n/a | n/a | n/a | n/a | n/a |
| mags | garbage collect | 5,000 | 250 | 0 | 1,506,931.89 | n/a | n/a | n/a | n/a | n/a | n/a | n/a |
| mags | garbage collect / no eligible tombstones | 5,000 | 250 | 0 | 4,340,277.78 | n/a | n/a | n/a | n/a | n/a | n/a | n/a |
| mags | garbage collect / 50% eligible tombstones | 5,000 | 250 | 0 | 670,780.79 | n/a | n/a | n/a | n/a | n/a | n/a | n/a |
| mags | garbage collect / 90% eligible tombstones | 5,000 | 250 | 0 | 540,190.15 | n/a | n/a | n/a | n/a | n/a | n/a | n/a |
| mags | garbage collect / partial frontiers 2 replicas | 5,000 | 250 | 0 | 3,676,470.59 | n/a | n/a | n/a | n/a | n/a | n/a | n/a |
| mags | garbage collect / partial frontiers 10 replicas | 5,000 | 250 | 0 | 2,354,048.96 | n/a | n/a | n/a | n/a | n/a | n/a | n/a |
| mags | post-gc read / full iteration visible values | 5,000 | 250 | 0.42 | 2,388.17 | 0.14 | 7,265.94 | 0.93 | 1,075.65 | 0.03 | 30,455.49 | automerge |
| mags | merge ordered deltas | 5,000 | 250 | 0.04 | 22,282.63 | 0.03 | 30,588.9 | 0.01 | 174,179.61 | 4.29 | 232.86 | json-joy |
| mags | merge shuffled gossip | 5,000 | 250 | 1.37 | 731.3 | 0.86 | 1,164.82 | n/a | n/a | 0.91 | 1,096.2 | yjs |
| mags | merge / append head delta into equal replica | 5,000 | 1 | 0.27 | 3,644.31 | 0.09 | 11,111.11 | 0.06 | 16,181.23 | 4.63 | 215.9 | json-joy |
| mags | merge / append tail delta into equal replica | 5,000 | 1 | 0.04 | 24,752.48 | 0.04 | 25,062.66 | 0.02 | 57,142.86 | 4.35 | 229.95 | json-joy |
| mags | merge / prepend head delta into equal replica | 5,000 | 1 | 0.27 | 3,741.11 | 0.04 | 22,727.27 | 0.01 | 84,033.61 | 4.75 | 210.48 | json-joy |
| mags | merge / insert middle delta into equal replica | 5,000 | 1 | 0.09 | 10,857.76 | 0.04 | 27,173.91 | 0.02 | 52,910.05 | 4.54 | 220.28 | json-joy |
| mags | merge / overwrite head delta into equal replica | 5,000 | 1 | 6.33 | 157.96 | 0.05 | 20,325.2 | 0.02 | 64,516.13 | 4.81 | 207.81 | json-joy |
| mags | merge / overwrite middle delta into equal replica | 5,000 | 1 | 0.09 | 11,098.78 | 0.05 | 19,801.98 | 0.02 | 46,082.95 | 4.45 | 224.74 | json-joy |
| mags | merge / overwrite tail delta into equal replica | 5,000 | 1 | 0.03 | 35,087.72 | 0.06 | 17,857.14 | 0.02 | 62,500 | 4.38 | 228.25 | json-joy |
| mags | merge / delete head delta into equal replica | 5,000 | 1 | 1.4 | 715.77 | 0.02 | 42,016.81 | 0.05 | 20,408.16 | 2.53 | 394.51 | yjs |
| mags | merge / delete middle delta into equal replica | 5,000 | 1 | 0.12 | 8,510.64 | 0.12 | 8,071.03 | 0.13 | 7,849.29 | 2.49 | 402.4 | crlist |
| mags | merge / delete tail delta into equal replica | 5,000 | 1 | 0.03 | 33,444.82 | 0.03 | 39,525.69 | 0.02 | 42,372.88 | 2.75 | 363.86 | json-joy |
| mags | merge / duplicate delta ignored | 5,000 | 250 | 0 | 788,394.83 | 0.03 | 32,430.05 | 0.01 | 85,423.36 | 0.04 | 26,572.85 | crlist |
| mags | merge / old delta ignored after merge | 5,000 | 250 | 0 | 1,090,274.75 | 0.03 | 31,749.66 | 0.01 | 195,970.84 | 0.04 | 26,834.98 | crlist |
| mags | merge / ordered 1,000 append deltas | 5,000 | 1,000 | 0 | 274,483.97 | 0.03 | 32,925.5 | 0.01 | 173,674.43 | 4.74 | 210.95 | crlist |
| mags | merge / ordered 1,000 prepend deltas | 5,000 | 1,000 | 0.06 | 15,959.68 | 0.02 | 55,713.72 | 0.02 | 63,253.11 | 4.93 | 202.98 | json-joy |
| mags | merge / ordered 1,000 middle insert deltas | 5,000 | 1,000 | 0.03 | 31,703.06 | 0.01 | 74,164.72 | 0.01 | 69,522.66 | 4.97 | 201.1 | yjs |
| mags | merge / shuffled 1,000 mixed deltas | 5,000 | 1,000 | 0.88 | 1,139.12 | 2.4 | 416.6 | n/a | n/a | 1.16 | 863.15 | crlist |
| mags | merge / reverse ordered 1,000 mixed deltas | 5,000 | 1,000 | 0.19 | 5,154.9 | 2.15 | 466.16 | n/a | n/a | 1.13 | 886.29 | crlist |
| mags | merge / concurrent prepends same head | 5,000 | 2 | 1.19 | 841.93 | 0.16 | 6,361.32 | n/a | n/a | 21.15 | 47.28 | yjs |
| mags | merge / concurrent appends same tail | 5,000 | 2 | 0.06 | 18,148.82 | 0.08 | 12,845.22 | n/a | n/a | 14.67 | 68.16 | crlist |
| mags | merge / concurrent inserts same middle position | 5,000 | 2 | 1.07 | 930.67 | 0.06 | 17,621.15 | n/a | n/a | 16.43 | 60.86 | yjs |
| mags | merge / concurrent overwrites same head | 5,000 | 2 | 2.41 | 414.3 | 0.06 | 15,847.86 | n/a | n/a | 11.35 | 88.09 | yjs |
| mags | merge / concurrent overwrites same middle | 5,000 | 2 | 1.07 | 935.8 | 0.08 | 12,383.9 | n/a | n/a | 20.13 | 49.67 | yjs |
| mags | merge / concurrent overwrites same tail | 5,000 | 2 | 0.03 | 32,840.72 | 0.06 | 17,905.1 | n/a | n/a | 18.86 | 53.03 | crlist |
| mags | merge / concurrent deletes same head | 5,000 | 2 | 2.05 | 488.46 | 0.04 | 23,228.8 | 0.03 | 39,215.69 | 8.02 | 124.72 | json-joy |
| mags | merge / concurrent deletes same middle | 5,000 | 2 | 0.96 | 1,042.54 | 0.03 | 30,864.2 | 0.04 | 26,041.67 | 23.99 | 41.68 | yjs |
| mags | merge / concurrent deletes same tail | 5,000 | 2 | 0.02 | 58,997.05 | 0.04 | 25,906.74 | 0.02 | 55,401.66 | 16.56 | 60.39 | crlist |
| mags | merge / concurrent overwrite delete same entry | 5,000 | 2 | 1.38 | 723.07 | 0.1 | 9,671.18 | 0.07 | 14,316.39 | 17.89 | 55.91 | json-joy |
| mags | merge / forked replicas rejoin after 250 ops each | 5,000 | 500 | 0.03 | 38,202.35 | 0.03 | 32,309.13 | n/a | n/a | 4.43 | 225.97 | crlist |
| mags | merge / 10 replicas gossip convergence | 5,000 | 100 | 0.01 | 144,571.35 | 0.02 | 59,815.77 | n/a | n/a | 8.8 | 113.61 | crlist |
| mags | merge / snapshot merge into stale replica | 5,000 | 5,350 | 0 | 894,065.74 | 0 | 245,957.79 | 0 | 209,839.31 | 0.04 | 25,076.61 | crlist |
| class | constructor / hydrate snapshot | 5,000 | 250 | 4.7 | 212.54 | 12.47 | 80.21 | 23.01 | 43.46 | 221.91 | 4.51 | crlist |
| class | read / head | 5,000 | 250 | 0 | 1,154,734.41 | 0 | 1,818,181.82 | 0 | 719,838.76 | 0 | 2,270,663.03 | automerge |
| class | read / middle | 5,000 | 250 | 0 | 1,510,574.02 | 0 | 4,960,317.46 | 0 | 3,164,556.96 | 0 | 10,245,901.64 | automerge |
| class | read / tail | 5,000 | 250 | 0 | 2,617,801.05 | 0 | 10,121,457.49 | 0 | 3,082,614.06 | 0 | 10,330,578.51 | automerge |
| class | find near head | 5,000 | 250 | 0 | 622,045.28 | 0 | 1,963,864.89 | 0 | 762,195.12 | 0 | 1,442,585.11 | yjs |
| class | find near middle | 5,000 | 250 | 1.42 | 704.66 | 0.18 | 5,560.86 | 1.1 | 909.75 | 0.02 | 65,068.58 | automerge |
| class | find near tail | 5,000 | 250 | 3.17 | 315.41 | 0.25 | 3,941.82 | 2.28 | 438.72 | 0.02 | 43,825.82 | automerge |
| class | iterate visible values | 5,000 | 250 | 0.12 | 8,051.45 | 0.41 | 2,420.75 | 2.23 | 448.94 | 0.12 | 8,335.61 | automerge |
| class | collect visible values to array | 5,000 | 250 | 0.12 | 8,544.38 | 0.38 | 2,601.71 | 2.3 | 435.06 | 0.09 | 10,992.2 | automerge |
| class | append / single after tail | 5,000 | 250 | 0.01 | 101,502.23 | 0.03 | 34,418.19 | 0.03 | 34,763.75 | 2.54 | 393.67 | crlist |
| class | append / batch after tail | 5,000 | 25,000 | 0.01 | 123,148.04 | 0 | 242,864.87 | 0.01 | 108,677.89 | 0.23 | 4,335.52 | yjs |
| class | prepend / single before head | 5,000 | 250 | 0.01 | 94,492.95 | 0.02 | 44,517.25 | 0.01 | 111,205.02 | 2.65 | 377.61 | json-joy |
| class | prepend / batch before head | 5,000 | 25,000 | 0.01 | 109,258.95 | 0 | 367,993.95 | 0.01 | 160,375.46 | 0.23 | 4,356.05 | yjs |
| class | insert / single before middle | 5,000 | 250 | 0.01 | 103,601.18 | 0.02 | 45,672.95 | 0.01 | 141,997.05 | 2.44 | 409.51 | json-joy |
| class | insert / batch before middle | 5,000 | 25,000 | 0.01 | 112,813.34 | 0 | 444,471.31 | 0.01 | 155,384.89 | 0.26 | 3,783.41 | yjs |
| class | overwrite / head | 5,000 | 250 | 0.03 | 30,517.21 | 0.03 | 36,053.19 | 0.05 | 18,905.88 | 3.04 | 329.3 | yjs |
| class | overwrite / middle | 5,000 | 250 | 0.01 | 99,194.54 | 0.03 | 33,924.06 | 0.05 | 21,418.78 | 2.67 | 375.18 | crlist |
| class | overwrite / tail | 5,000 | 250 | 0.01 | 105,267.59 | 0.03 | 30,175.38 | 0.06 | 17,133.73 | 2.39 | 417.89 | crlist |
| class | overwrite / random | 5,000 | 250 | 0.01 | 93,405.57 | 0.06 | 16,842.5 | 0.06 | 16,569.57 | 2.78 | 359.23 | crlist |
| class | remove / head | 5,000 | 250 | 0.01 | 108,253.23 | 0.02 | 54,150.06 | 0.09 | 11,623.31 | 0.35 | 2,874.12 | crlist |
| class | remove / middle | 5,000 | 250 | 0.01 | 119,663.03 | 0.02 | 44,712.32 | 0.01 | 144,083.91 | 0.3 | 3,320.6 | json-joy |
| class | remove / tail | 5,000 | 250 | 0 | 410,576.45 | 0.02 | 47,587.32 | 0 | 228,644.59 | 0.32 | 3,092.92 | crlist |
| class | remove / range from head | 5,000 | 5,000 | 0 | 1,957,560.1 | 0 | 3,628,447.02 | 0 | 450,349.02 | 0.02 | 50,509.64 | yjs |
| class | remove / range from middle | 5,000 | 5,000 | 0 | 1,310,272.54 | 0 | 3,092,911.05 | 0 | 243,309 | 0.03 | 39,840.07 | yjs |
| class | remove / range from tail | 5,000 | 5,000 | 0 | 612,377.37 | 0 | 6,156,877.23 | 0 | 239,669.06 | 0.02 | 49,786.17 | yjs |
| class | mixed / append overwrite remove tail | 5,000 | 250 | 0.01 | 115,329.61 | 0.03 | 37,928.21 | 0.05 | 20,721.95 | 1.86 | 538.49 | crlist |
| class | mixed / prepend overwrite remove head | 5,000 | 250 | 0.01 | 106,238.31 | 0.03 | 35,569.97 | 0.05 | 20,536.24 | 1.86 | 538.9 | crlist |
| class | mixed / insert overwrite remove middle | 5,000 | 250 | 0.02 | 60,259.84 | 0.03 | 32,633.67 | 0.01 | 132,443.31 | 2 | 500.22 | json-joy |
| class | paste / insert 10,000 entries at cursor | 5,000 | 10,000 | 0.02 | 49,832.54 | 0 | 450,194.93 | 0.01 | 68,325.66 | 0.2 | 4,878.32 | yjs |
| class | render / join visible entries to string | 5,000 | 250 | 0.24 | 4,103.85 | 0.59 | 1,705.1 | 3.63 | 275.68 | 0.21 | 4,817.03 | automerge |
| class | snapshot | 5,000 | 250 | 0.18 | 5,526.76 | 6.63 | 150.77 | 10.74 | 93.13 | 19.32 | 51.75 | crlist |
| class | snapshot / tombstoned state 50% deleted | 5,000 | 250 | 0.09 | 11,211.77 | 3.35 | 298.61 | 4.45 | 224.92 | 19.89 | 50.26 | crlist |
| class | snapshot / after garbage collection | 5,000 | 250 | 0.1 | 9,698.49 | 0.38 | 2,614.75 | 2.25 | 444.97 | 0.08 | 12,020.79 | automerge |
| class | acknowledge | 5,000 | 250 | 0.07 | 14,147.95 | n/a | n/a | n/a | n/a | n/a | n/a | n/a |
| class | acknowledge / 50% deleted state | 5,000 | 250 | 0.05 | 19,769.72 | n/a | n/a | n/a | n/a | n/a | n/a | n/a |
| class | acknowledge / 90% deleted state | 5,000 | 250 | 0.08 | 12,507.88 | n/a | n/a | n/a | n/a | n/a | n/a | n/a |
| class | garbage collect | 5,000 | 250 | 0.13 | 7,513.13 | 0.4 | 2,528.6 | 2.12 | 471.77 | 0.09 | 11,305.16 | automerge |
| class | garbage collect / no eligible tombstones | 5,000 | 250 | 0.11 | 8,991.45 | 0.41 | 2,449.94 | 2.2 | 454.91 | 0.09 | 10,607.15 | automerge |
| class | garbage collect / 90% eligible tombstones | 5,000 | 250 | 0.12 | 8,694.53 | 0.37 | 2,706.17 | 2.1 | 476.97 | 0.08 | 11,813.01 | automerge |
| class | merge ordered deltas | 5,000 | 250 | 0.02 | 45,395.12 | 0.02 | 56,595.66 | 0 | 234,829.98 | 4.3 | 232.67 | json-joy |
| class | merge shuffled gossip | 5,000 | 250 | 0.71 | 1,401.75 | 0.7 | 1,435.7 | n/a | n/a | 0.97 | 1,029.18 | yjs |
| class | merge / duplicate delta ignored | 5,000 | 250 | 0 | 907,111.76 | 0.04 | 23,440.06 | 0 | 262,770.65 | 0.04 | 22,597.85 | crlist |
| class | merge / concurrent prepends same head | 5,000 | 2 | 1.24 | 803.57 | 0.13 | 7,902.02 | n/a | n/a | 20.95 | 47.74 | yjs |
| class | merge / concurrent appends same tail | 5,000 | 2 | 0.09 | 11,514.1 | 0.04 | 27,662.52 | n/a | n/a | 11.3 | 88.5 | yjs |
| class | merge / concurrent inserts same middle position | 5,000 | 2 | 4.81 | 207.85 | 0.05 | 20,222.45 | n/a | n/a | 13.99 | 71.5 | yjs |
| class | merge / forked replicas rejoin after 250 ops each | 5,000 | 500 | 0.5 | 1,993.71 | 0.02 | 42,853.71 | n/a | n/a | 4.3 | 232.43 | yjs |
| latency | append tail write to remote visible | 5,000 | 250 | 0.44 | 2,284.03 | 0.44 | 2,298.27 | 12.15 | 82.29 | 7.38 | 135.42 | yjs |
| latency | prepend head write to remote visible | 5,000 | 250 | 0.07 | 14,004.11 | 0.04 | 22,485.65 | 0.02 | 54,771.71 | 7.38 | 135.46 | json-joy |
| latency | middle insert write to remote visible | 5,000 | 250 | 0.37 | 2,693.53 | 0.22 | 4,582.06 | 4.9 | 204.01 | 7.65 | 130.76 | yjs |
| latency | head insert write to remote visible | 5,000 | 250 | 0.06 | 15,500.22 | 0.05 | 20,198.76 | 0.05 | 21,863.47 | 9.35 | 106.95 | json-joy |
| latency | overwrite head write to remote visible | 5,000 | 250 | 1.06 | 946.55 | 0.07 | 14,847.99 | 0.02 | 55,423.77 | 8.96 | 111.55 | json-joy |
| latency | overwrite middle write to remote visible | 5,000 | 250 | 0.37 | 2,667.75 | 0.21 | 4,814.88 | 3.45 | 290.2 | 7.66 | 130.55 | yjs |
| latency | overwrite tail write to remote visible | 5,000 | 250 | 0.84 | 1,197.14 | 0.46 | 2,197.25 | 6.16 | 162.21 | 7.51 | 133.08 | yjs |
| latency | head delete to remote hidden | 5,000 | 250 | 1.91 | 522.34 | 0.4 | 2,489.14 | 6.39 | 156.37 | 3.27 | 306.25 | yjs |
| latency | middle delete to remote hidden | 5,000 | 250 | 0.87 | 1,155.02 | 0.45 | 2,198.45 | 6.4 | 156.25 | 3.19 | 313.12 | yjs |
| latency | tail delete to remote hidden | 5,000 | 250 | 0.42 | 2,379.98 | 0.39 | 2,568.86 | 5.92 | 168.88 | 3.18 | 314.55 | yjs |
| latency | append tail write to 10 remotes visible | 5,000 | 2,500 | 0.57 | 1,752.84 | 0.37 | 2,735 | 13.3 | 75.21 | 5.1 | 196.09 | yjs |
| latency | prepend head write to 10 remotes visible | 5,000 | 2,500 | 0.1 | 10,444.85 | 0.01 | 66,956.27 | 0.02 | 51,011.46 | 5.11 | 195.54 | yjs |
| latency | middle insert write to 10 remotes visible | 5,000 | 2,500 | 0.37 | 2,710.15 | 0.16 | 6,354.65 | 4.96 | 201.58 | 5.43 | 184.03 | yjs |
| latency | overwrite middle write to 10 remotes visible | 5,000 | 2,500 | 0.37 | 2,672.31 | 0.15 | 6,875.02 | 3.27 | 306.14 | 5.36 | 186.48 | yjs |
| latency | delete middle to 10 remotes hidden | 5,000 | 2,500 | 0.75 | 1,328.9 | 0.36 | 2,800.57 | 7.07 | 141.46 | 2.82 | 354.48 | yjs |
| latency | out-of-order write delivery to remote visible | 5,000 | 250 | 1.64 | 609.77 | 94.53 | 10.58 | n/a | n/a | 18.95 | 52.76 | crlist |
| latency | out-of-order delete delivery to remote convergence | 5,000 | 165 | 2.18 | 457.78 | 0.25 | 3,981.75 | 8.34 | 119.94 | 8.05 | 124.3 | yjs |
| latency | out-of-order append delivery to convergence | 5,000 | 250 | 1.68 | 596.41 | 25.05 | 39.93 | n/a | n/a | 22.58 | 44.29 | crlist |
| latency | out-of-order prepend delivery to convergence | 5,000 | 250 | 1.52 | 659.86 | 27.99 | 35.73 | 0.15 | 6,579.99 | 23.67 | 42.24 | json-joy |
| latency | out-of-order middle insert delivery to convergence | 5,000 | 250 | 1.62 | 618.52 | 122.21 | 8.18 | n/a | n/a | 21.66 | 46.17 | crlist |
| latency | out-of-order overwrite delivery to convergence | 5,000 | 129 | 2.56 | 391.08 | n/a | n/a | 264.39 | 3.78 | 102.27 | 9.78 | crlist |
| latency | offline burst 1,000 ops then sync | 5,000 | 1,000 | 0.02 | 49,901.2 | 0.04 | 27,053.5 | 0 | 209,912.05 | 5.17 | 193.35 | json-joy |
| latency | forked replicas mixed ops then converge | 5,000 | 500 | 0.01 | 86,381.15 | 0.01 | 88,665.06 | n/a | n/a | 3.71 | 269.25 | yjs |
| latency | duplicate shuffled gossip to convergence | 5,000 | 500 | 0.32 | 3,158.58 | 0.29 | 3,444.36 | n/a | n/a | 0.4 | 2,470.45 | yjs |
| latency | remote snapshot hydrate then apply pending deltas | 5,000 | 250 | 0.02 | 48,663.69 | 0.05 | 19,521.34 | 0.09 | 11,737.81 | 0.74 | 1,346.71 | crlist |
| workload | local app session | 5,000 | 250 | 0.02 | 52,324.24 | 0.03 | 36,044.87 | 0.01 | 116,360.25 | 1.31 | 761.75 | json-joy |
| workload | read heavy session | 5,000 | 250 | 0 | 1,317,870.32 | 0 | 2,055,921.05 | 0 | 311,642.98 | 0 | 2,738,225.63 | automerge |
| workload | write heavy session | 5,000 | 250 | 0.02 | 54,472.16 | 0.02 | 43,225.67 | 0.01 | 107,513.01 | 1.46 | 686.48 | json-joy |
| workload | append tail heavy session | 5,000 | 250 | 0.01 | 188,935.91 | 0.03 | 31,368.02 | 0.05 | 19,327.71 | 1.7 | 588.49 | crlist |
| workload | prepend head heavy session | 5,000 | 250 | 0.02 | 47,717.21 | 0.01 | 70,130.16 | 0.06 | 17,993.12 | 1.74 | 575.44 | yjs |
| workload | insert middle heavy session | 5,000 | 250 | 0.02 | 50,243.18 | 0.02 | 62,048.6 | 0.05 | 19,026.02 | 1.7 | 588.37 | yjs |
| workload | overwrite heavy session | 5,000 | 250 | 0.02 | 46,451.13 | 0.02 | 58,249.26 | 0.01 | 125,577.66 | 1.45 | 688.56 | json-joy |
| workload | delete heavy session | 5,000 | 250 | 0.02 | 66,015.32 | 0.01 | 70,055.48 | 0.01 | 189,868.61 | 0.23 | 4,361.08 | json-joy |
| workload | balanced append prepend insert overwrite delete session | 5,000 | 250 | 0.04 | 22,791.92 | 0.03 | 35,352.18 | 0.01 | 115,617.63 | 1.68 | 593.84 | json-joy |
| workload | random edit session | 5,000 | 250 | 0.02 | 42,616.3 | 0.03 | 33,724.54 | 0.05 | 20,814.95 | 1.48 | 677.75 | crlist |
| workload | text editing session | 5,000 | 250 | 0.02 | 46,462.36 | 0.03 | 35,172.63 | 0.01 | 88,526.91 | 1.87 | 535.55 | json-joy |
| workload | collaborative offline session | 5,000 | 500 | 0.01 | 87,459.99 | 0.01 | 91,084.64 | n/a | n/a | 3.7 | 270.17 | yjs |
| workload | sync and cleanup session | 5,000 | 252 | 0.01 | 69,511.49 | 0.02 | 51,234.23 | n/a | n/a | 4.17 | 239.55 | crlist |
| workload | long lived tombstoned session | 5,000 | 250 | 0.01 | 120,435.49 | 0.02 | 57,335.5 | 0.01 | 126,275.38 | 2.09 | 477.47 | json-joy |
| workload | sparse visible session | 5,000 | 250 | 0.01 | 109,198.92 | 0.22 | 4,450.64 | 0.03 | 37,610.39 | 1.08 | 921.99 | crlist |
| workload | post-gc edit session | 5,000 | 250 | 0.01 | 169,307.87 | 0.04 | 24,713.81 | 0.01 | 140,670.72 | 1.63 | 615.04 | crlist |

## License

Apache-2.0
