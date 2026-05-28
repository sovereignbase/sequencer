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
| crud | create / empty list | 5,000 | 250 | 0.03 | 33,825.84 | 0.3 | 3,370.54 | 0.04 | 25,321.33 | 0.98 | 1,020.72 | crlist |
| crud | create / hydrate snapshot | 5,000 | 250 | 6.77 | 147.61 | 11.86 | 84.33 | 32.12 | 31.13 | 420.16 | 2.38 | crlist |
| crud | create / hydrate clean snapshot | 5,000 | 250 | 7.19 | 139.17 | 10.92 | 91.61 | 31.22 | 32.03 | 425.32 | 2.35 | crlist |
| crud | create / hydrate tombstoned snapshot | 5,000 | 250 | 4.12 | 242.47 | 5.59 | 178.97 | 15.38 | 65.03 | 398.45 | 2.51 | crlist |
| crud | read / head | 5,000 | 250 | 0 | 1,196,172.25 | 0 | 464,684.01 | 0.06 | 17,087.82 | 0 | 1,577,287.07 | automerge |
| crud | read / middle | 5,000 | 250 | 0 | 3,188,775.51 | 0 | 1,068,376.07 | 0 | 398,089.17 | 0 | 2,429,543.25 | crlist |
| crud | read / tail | 5,000 | 250 | 0 | 4,595,588.24 | 0 | 760,109.46 | 0 | 527,314.91 | 0 | 4,058,441.56 | crlist |
| crud | read / random indexed reads | 5,000 | 250 | 0 | 620,039.68 | 0 | 340,367.6 | 0.01 | 106,112.05 | 0 | 504,744.6 | crlist |
| crud | read / sequential indexed reads from head | 5,000 | 250 | 0 | 953,470.63 | 0 | 441,462.12 | 0.01 | 160,792.38 | 0 | 609,310.26 | crlist |
| crud | read / sequential indexed reads from middle | 5,000 | 250 | 0 | 2,530,364.37 | 0 | 645,661.16 | 0 | 206,117.57 | 0 | 4,378,283.71 | automerge |
| crud | read / sequential indexed reads from tail | 5,000 | 250 | 0 | 2,818,489.29 | 0 | 273,074.82 | 0.01 | 126,807 | 0 | 4,325,259.52 | automerge |
| crud | read / full iteration visible values | 5,000 | 250 | 0.98 | 1,024.63 | 0.4 | 2,478.92 | 3.33 | 300.59 | 0.19 | 5,205.9 | automerge |
| crud | read / collect visible values to array | 5,000 | 250 | 0.61 | 1,628.68 | 0.36 | 2,769.7 | 2.79 | 358 | 0.19 | 5,345.52 | automerge |
| crud | read / visible sparse over deleted entries | 5,000 | 250 | 0 | 1,444,251.88 | 0.06 | 15,469.34 | 0.03 | 36,986.63 | 0 | 3,639,010.19 | automerge |
| crud | find / head | 5,000 | 250 | 0 | 774,473.36 | 0 | 1,248,751.25 | 0 | 544,306.55 | 0 | 690,607.73 | yjs |
| crud | find / middle | 5,000 | 250 | 0.21 | 4,713.26 | 0.22 | 4,463.37 | 1.06 | 939.04 | 0.04 | 27,567.35 | automerge |
| crud | find / tail | 5,000 | 250 | 0.31 | 3,193.29 | 0.33 | 3,052.59 | 3.13 | 319.49 | 0.05 | 19,993.76 | automerge |
| crud | find / missing value | 5,000 | 250 | 0.35 | 2,885.88 | 0.41 | 2,421.55 | 1.84 | 543.32 | 0.08 | 13,032.58 | automerge |
| crud | append / single after tail | 5,000 | 250 | 0.01 | 113,332.43 | 0.05 | 19,103.36 | 0.05 | 21,824.91 | 4.64 | 215.65 | crlist |
| crud | append / batch after tail | 5,000 | 25,000 | 0 | 697,951.65 | 0 | 260,545.85 | 0.01 | 79,908.3 | 0.45 | 2,215.33 | crlist |
| crud | append / batch after deleted tail | 5,000 | 25,000 | 0 | 670,989.63 | 0 | 321,357.83 | 0.01 | 92,770.75 | 0.45 | 2,217 | crlist |
| crud | append / batch after garbage collection | 5,000 | 25,000 | 0 | 852,270.79 | 0 | 343,319.35 | 0.01 | 80,687.09 | 0.45 | 2,229.82 | crlist |
| crud | prepend / single before head | 5,000 | 250 | 0.01 | 129,991.68 | 0.03 | 30,669.2 | 0.06 | 16,125.7 | 4.84 | 206.46 | crlist |
| crud | prepend / batch before head | 5,000 | 25,000 | 0 | 1,141,635.92 | 0 | 446,303.45 | 0.01 | 104,218.43 | 0.45 | 2,209.61 | crlist |
| crud | prepend / batch before deleted head | 5,000 | 25,000 | 0 | 775,076.03 | 0 | 642,767.71 | 0.01 | 103,399.31 | 0.45 | 2,215.28 | crlist |
| crud | prepend / batch after garbage collection | 5,000 | 25,000 | 0 | 990,907.43 | 0 | 412,539.21 | 0.01 | 90,553.76 | 0.45 | 2,242.98 | crlist |
| crud | insert / single before head | 5,000 | 250 | 0.01 | 121,506.68 | 0.03 | 33,473.03 | 0.08 | 12,039.72 | 5.04 | 198.55 | crlist |
| crud | insert / single after head | 5,000 | 250 | 0.01 | 82,568.2 | 0.04 | 26,982.4 | 0.08 | 12,375.56 | 5.39 | 185.54 | crlist |
| crud | insert / single before middle | 5,000 | 250 | 0.01 | 79,754.99 | 0.04 | 26,564.94 | 0.07 | 15,265.12 | 4.58 | 218.34 | crlist |
| crud | insert / single after middle | 5,000 | 250 | 0.01 | 82,429.36 | 0.04 | 26,052.25 | 0.07 | 14,290.94 | 4.53 | 220.71 | crlist |
| crud | insert / single before tail | 5,000 | 250 | 0.01 | 77,220.08 | 0.04 | 25,792.61 | 0.01 | 70,149.84 | 4.58 | 218.44 | crlist |
| crud | insert / single after tail | 5,000 | 250 | 0.01 | 98,634.89 | 0.07 | 13,874.32 | 0.01 | 84,095.8 | 4.56 | 219.27 | crlist |
| crud | insert / batch before head | 5,000 | 25,000 | 0 | 919,614.64 | 0 | 440,818.37 | 0.01 | 89,531.57 | 0.47 | 2,128.5 | crlist |
| crud | insert / batch after head | 5,000 | 25,000 | 0 | 879,479.63 | 0 | 497,653.07 | 0.01 | 96,483.67 | 0.47 | 2,147.28 | crlist |
| crud | insert / batch before middle | 5,000 | 25,000 | 0 | 407,363.17 | 0 | 652,961.44 | 0.01 | 109,018.73 | 0.46 | 2,170.18 | yjs |
| crud | insert / batch after middle | 5,000 | 25,000 | 0 | 418,907.12 | 0 | 546,580.7 | 0.01 | 98,910.6 | 0.46 | 2,163.51 | yjs |
| crud | insert / batch before tail | 5,000 | 25,000 | 0 | 986,539.65 | 0 | 450,357.13 | 0.01 | 119,441.78 | 0.45 | 2,200.83 | crlist |
| crud | insert / batch after tail | 5,000 | 25,000 | 0 | 651,652.59 | 0 | 432,904.18 | 0.01 | 87,865.8 | 0.46 | 2,163.91 | crlist |
| crud | insert / repeated before head | 5,000 | 250 | 0.01 | 139,610.21 | 0.01 | 67,049.29 | 0.01 | 74,001.72 | 4.68 | 213.59 | crlist |
| crud | insert / repeated before middle | 5,000 | 250 | 0.01 | 95,928.78 | 0.02 | 45,431.42 | 0.01 | 91,605.29 | 4.58 | 218.28 | crlist |
| crud | insert / repeated before tail | 5,000 | 250 | 0.01 | 83,757.71 | 0.02 | 47,134.24 | 0.01 | 84,834.91 | 4.4 | 227.32 | json-joy |
| crud | insert / random positions | 5,000 | 250 | 0.01 | 90,625.68 | 0.05 | 19,643.74 | 0.03 | 39,056.4 | 5.1 | 196.19 | crlist |
| crud | insert / alternating head and tail | 5,000 | 250 | 0.05 | 21,685.76 | 0.02 | 55,456.97 | 0.01 | 115,532.14 | 4.86 | 205.89 | json-joy |
| crud | overwrite / head | 5,000 | 250 | 0.01 | 82,107.2 | 0.05 | 18,975.33 | 0.09 | 11,389.99 | 5.44 | 183.93 | crlist |
| crud | overwrite / middle | 5,000 | 250 | 0.02 | 64,457.91 | 0.03 | 29,992.2 | 0.01 | 91,491.31 | 5.11 | 195.57 | json-joy |
| crud | overwrite / tail | 5,000 | 250 | 0.01 | 93,769.93 | 0.03 | 30,145.54 | 0.03 | 38,513.68 | 4.81 | 207.87 | crlist |
| crud | overwrite / random | 5,000 | 250 | 0.05 | 21,439.54 | 0.07 | 13,675.1 | 0.05 | 21,827.96 | 5.37 | 186.29 | json-joy |
| crud | overwrite / same head repeatedly | 5,000 | 250 | 0.01 | 76,665.95 | 0.04 | 26,090.59 | 0.05 | 18,314.08 | 5.02 | 199.34 | crlist |
| crud | overwrite / same middle repeatedly | 5,000 | 250 | 0.01 | 72,615.31 | 0.05 | 20,761.71 | 0.02 | 63,953.34 | 5.6 | 178.44 | crlist |
| crud | overwrite / same tail repeatedly | 5,000 | 250 | 0.01 | 79,772.81 | 0.04 | 24,134.54 | 0.01 | 96,625.83 | 4.67 | 214.09 | json-joy |
| crud | overwrite / random visible entries | 5,000 | 250 | 0.06 | 16,280.71 | 0.07 | 14,201.16 | 0.02 | 50,212.9 | 5.33 | 187.58 | json-joy |
| crud | overwrite / after insert | 5,000 | 250 | 0.02 | 52,673.72 | 0.04 | 25,452.81 | 0.02 | 58,995.66 | 4.74 | 211.02 | json-joy |
| crud | overwrite / after delete | 5,000 | 250 | 0.01 | 75,645.25 | 0.04 | 25,985.37 | 0.02 | 63,870.01 | 4.76 | 210.01 | crlist |
| crud | delete / head | 5,000 | 250 | 0.01 | 79,151.5 | 0.03 | 29,569.35 | 0.06 | 17,371.73 | 0.77 | 1,296.23 | crlist |
| crud | delete / middle | 5,000 | 250 | 0.01 | 79,516.54 | 0.03 | 36,742.55 | 0.07 | 14,246.96 | 0.68 | 1,461.58 | crlist |
| crud | delete / tail | 5,000 | 250 | 0 | 317,057.7 | 0.03 | 32,725.51 | 0.01 | 125,018.75 | 0.59 | 1,691.08 | crlist |
| crud | delete / range from head | 5,000 | 5,000 | 0 | 443,168.12 | 0 | 4,463,488.66 | 0 | 233,187.2 | 0.04 | 24,220.92 | yjs |
| crud | delete / range from middle | 5,000 | 5,000 | 0 | 266,954.27 | 0 | 3,702,606.64 | 0.01 | 169,900.44 | 0.05 | 21,091.74 | yjs |
| crud | delete / range from tail | 5,000 | 5,000 | 0 | 302,751.4 | 0 | 4,628,343.98 | 0.01 | 183,455.27 | 0.04 | 25,225.05 | yjs |
| crud | delete / every other entry | 5,000 | 2,500 | 0.01 | 83,308.06 | 0.18 | 5,439.11 | 0.12 | 8,490.13 | 0.62 | 1,622.56 | crlist |
| crud | delete / all entries from head one by one | 5,000 | 5,000 | 0.01 | 97,603.83 | 0.02 | 49,614.79 | 0.02 | 65,842.49 | 0.56 | 1,800.32 | crlist |
| crud | delete / all entries from middle outward | 5,000 | 5,000 | 0.01 | 109,110.75 | 0.02 | 48,441.35 | 0.01 | 88,836.14 | 0.57 | 1,760.14 | crlist |
| crud | delete / all entries from tail one by one | 5,000 | 5,000 | 0 | 396,350.41 | 0.02 | 43,532.43 | 0.01 | 134,662 | 0.54 | 1,860.69 | crlist |
| crud | delete / all entries in random order | 5,000 | 5,000 | 0.22 | 4,458.79 | 16.65 | 60.06 | 13.08 | 76.44 | 0.67 | 1,486.95 | crlist |
| crud | delete / already deleted head | 5,000 | 250 | 0 | 206,868.02 | 0.01 | 186,832.08 | 0 | 228,164.64 | 0.1 | 9,753.97 | json-joy |
| crud | delete / already deleted middle | 5,000 | 250 | 0 | 250,903.25 | 0 | 259,848.25 | 0 | 452,079.57 | 0.07 | 14,808.5 | json-joy |
| crud | delete / already deleted tail | 5,000 | 250 | 0 | 1,145,213.01 | 0 | 208,925.29 | 0 | 464,080.19 | 0.07 | 15,263.17 | crlist |
| crud | mixed / append overwrite delete tail | 5,000 | 250 | 0.01 | 155,356.7 | 0.06 | 16,415.4 | 0.03 | 39,518.19 | 4.18 | 239.51 | crlist |
| crud | mixed / prepend overwrite delete head | 5,000 | 250 | 0.01 | 179,365.76 | 0.03 | 33,251.76 | 0.09 | 11,525.15 | 4.31 | 231.83 | crlist |
| crud | mixed / insert overwrite delete middle | 5,000 | 250 | 0.01 | 180,076.35 | 0.03 | 28,891.71 | 0.08 | 12,737.3 | 3.99 | 250.73 | crlist |
| crud | mixed / append prepend insert overwrite delete | 5,000 | 250 | 0.01 | 161,592.66 | 0.04 | 25,261.71 | 0.02 | 55,858.43 | 4.25 | 235.39 | crlist |
| mags | snapshot | 5,000 | 250 | 0.38 | 2,605.8 | 4.86 | 205.88 | 19.54 | 51.17 | 40.24 | 24.85 | crlist |
| mags | snapshot / clean state | 5,000 | 250 | 0.42 | 2,368.86 | 4.9 | 203.92 | 17.51 | 57.12 | 40.89 | 24.45 | crlist |
| mags | snapshot / tombstoned state 50% deleted | 5,000 | 250 | 0.24 | 4,203.66 | 2.51 | 397.88 | 7.72 | 129.56 | 41.38 | 24.17 | crlist |
| mags | snapshot / tombstoned state 90% deleted | 5,000 | 250 | 0.08 | 11,805.15 | 0.45 | 2,203.84 | 1.37 | 731.87 | 41.29 | 24.22 | crlist |
| mags | snapshot / after garbage collection | 5,000 | 250 | 0.15 | 6,794.18 | 3.48 | 287.62 | 8.07 | 123.85 | 44.15 | 22.65 | crlist |
| mags | acknowledge | 5,000 | 250 | 0 | 643,004.12 | n/a | n/a | n/a | n/a | n/a | n/a | n/a |
| mags | acknowledge / clean state | 5,000 | 250 | 0 | 3,906,250 | n/a | n/a | n/a | n/a | n/a | n/a | n/a |
| mags | acknowledge / 50% deleted state | 5,000 | 250 | 0.76 | 1,320.45 | n/a | n/a | n/a | n/a | n/a | n/a | n/a |
| mags | acknowledge / 90% deleted state | 5,000 | 250 | 1.26 | 793.07 | n/a | n/a | n/a | n/a | n/a | n/a | n/a |
| mags | garbage collect | 5,000 | 250 | 0 | 808,015.51 | n/a | n/a | n/a | n/a | n/a | n/a | n/a |
| mags | garbage collect / no eligible tombstones | 5,000 | 250 | 0 | 2,783,964.37 | n/a | n/a | n/a | n/a | n/a | n/a | n/a |
| mags | garbage collect / 50% eligible tombstones | 5,000 | 250 | 0.01 | 120,761.28 | n/a | n/a | n/a | n/a | n/a | n/a | n/a |
| mags | garbage collect / 90% eligible tombstones | 5,000 | 250 | 0.01 | 76,492.37 | n/a | n/a | n/a | n/a | n/a | n/a | n/a |
| mags | garbage collect / partial frontiers 2 replicas | 5,000 | 250 | 0 | 2,238,137.87 | n/a | n/a | n/a | n/a | n/a | n/a | n/a |
| mags | garbage collect / partial frontiers 10 replicas | 5,000 | 250 | 0 | 2,642,706.13 | n/a | n/a | n/a | n/a | n/a | n/a | n/a |
| mags | post-gc read / full iteration visible values | 5,000 | 250 | 0.39 | 2,594.66 | 0.18 | 5,611.92 | 1.56 | 641.08 | 0.07 | 13,651.43 | automerge |
| mags | merge ordered deltas | 5,000 | 250 | 0.07 | 14,624.84 | 0.05 | 18,295.45 | 0.01 | 84,765.88 | 8.19 | 122.15 | json-joy |
| mags | merge shuffled gossip | 5,000 | 250 | 1.44 | 692.45 | 1.09 | 914.02 | n/a | n/a | 1.95 | 513.75 | yjs |
| mags | merge / append head delta into equal replica | 5,000 | 1 | 0.64 | 1,550.63 | 0.11 | 9,469.7 | 0.1 | 9,960.16 | 8.68 | 115.26 | json-joy |
| mags | merge / append tail delta into equal replica | 5,000 | 1 | 0.04 | 22,371.36 | 0.04 | 23,980.82 | 0.03 | 28,901.73 | 8.13 | 123.07 | json-joy |
| mags | merge / prepend head delta into equal replica | 5,000 | 1 | 0.48 | 2,088.55 | 0.04 | 24,449.88 | 0.02 | 48,780.49 | 8.53 | 117.23 | json-joy |
| mags | merge / insert middle delta into equal replica | 5,000 | 1 | 0.28 | 3,571.43 | 0.03 | 29,239.77 | 0.06 | 16,863.41 | 8.31 | 120.36 | yjs |
| mags | merge / overwrite head delta into equal replica | 5,000 | 1 | 0.69 | 1,449.28 | 0.03 | 33,003.3 | 0.04 | 25,641.03 | 8.6 | 116.23 | yjs |
| mags | merge / overwrite middle delta into equal replica | 5,000 | 1 | 0.24 | 4,128.82 | 0.07 | 15,290.52 | 0.04 | 23,201.86 | 8.43 | 118.59 | json-joy |
| mags | merge / overwrite tail delta into equal replica | 5,000 | 1 | 0.05 | 18,587.36 | 0.07 | 14,430.01 | 0.03 | 34,013.61 | 8.34 | 119.93 | json-joy |
| mags | merge / delete head delta into equal replica | 5,000 | 1 | 0.6 | 1,655.63 | 0.04 | 28,490.03 | 0.06 | 15,898.25 | 4.57 | 218.65 | yjs |
| mags | merge / delete middle delta into equal replica | 5,000 | 1 | 0.28 | 3,531.07 | 0.16 | 6,131.21 | 0.21 | 4,699.25 | 5.66 | 176.68 | yjs |
| mags | merge / delete tail delta into equal replica | 5,000 | 1 | 0.02 | 43,103.45 | 0.03 | 29,761.9 | 0.04 | 24,271.84 | 4.54 | 220.39 | crlist |
| mags | merge / duplicate delta ignored | 5,000 | 250 | 0 | 658,761.53 | 0.05 | 21,558.79 | 0.02 | 51,885.52 | 0.1 | 9,554.93 | crlist |
| mags | merge / old delta ignored after merge | 5,000 | 250 | 0 | 495,049.5 | 0.04 | 23,698.93 | 0.01 | 118,900.41 | 0.09 | 11,280.11 | crlist |
| mags | merge / ordered 1,000 append deltas | 5,000 | 1,000 | 0.01 | 131,278.39 | 0.04 | 28,534.17 | 0.04 | 25,993.27 | 9.01 | 110.99 | crlist |
| mags | merge / ordered 1,000 prepend deltas | 5,000 | 1,000 | 0.06 | 17,098.28 | 0.01 | 71,430.1 | 0.04 | 23,579.68 | 9.56 | 104.64 | yjs |
| mags | merge / ordered 1,000 middle insert deltas | 5,000 | 1,000 | 0.06 | 17,955.19 | 0.02 | 57,381.89 | 0.01 | 112,451.79 | 9.37 | 106.75 | json-joy |
| mags | merge / shuffled 1,000 mixed deltas | 5,000 | 1,000 | 1.54 | 649.06 | 1.88 | 531.55 | n/a | n/a | 2.43 | 412.13 | crlist |
| mags | merge / reverse ordered 1,000 mixed deltas | 5,000 | 1,000 | 0.39 | 2,569.2 | 1.53 | 652.15 | n/a | n/a | 2.69 | 371.87 | crlist |
| mags | merge / concurrent prepends same head | 5,000 | 2 | 1.55 | 645.81 | 0.11 | 9,246.42 | n/a | n/a | 45.41 | 22.02 | yjs |
| mags | merge / concurrent appends same tail | 5,000 | 2 | 0.06 | 17,346.05 | 0.04 | 25,740.03 | n/a | n/a | 38.33 | 26.09 | yjs |
| mags | merge / concurrent inserts same middle position | 5,000 | 2 | 1.33 | 750.5 | 0.05 | 19,646.37 | n/a | n/a | 44.92 | 22.26 | yjs |
| mags | merge / concurrent overwrites same head | 5,000 | 2 | 2.01 | 497.97 | 0.05 | 20,833.33 | n/a | n/a | 39.03 | 25.62 | yjs |
| mags | merge / concurrent overwrites same middle | 5,000 | 2 | 1.69 | 590.98 | 0.05 | 19,157.09 | n/a | n/a | 39.07 | 25.6 | yjs |
| mags | merge / concurrent overwrites same tail | 5,000 | 2 | 0.05 | 18,315.02 | 0.06 | 15,612.8 | n/a | n/a | 38.71 | 25.84 | crlist |
| mags | merge / concurrent deletes same head | 5,000 | 2 | 2.38 | 419.89 | 0.05 | 19,723.87 | 0.04 | 25,510.2 | 30.61 | 32.67 | json-joy |
| mags | merge / concurrent deletes same middle | 5,000 | 2 | 1.3 | 766.99 | 0.03 | 29,717.68 | 0.05 | 19,960.08 | 19.54 | 51.17 | yjs |
| mags | merge / concurrent deletes same tail | 5,000 | 2 | 0.02 | 45,045.05 | 0.04 | 23,668.64 | 0.03 | 33,898.31 | 20.4 | 49.03 | crlist |
| mags | merge / concurrent overwrite delete same entry | 5,000 | 2 | 2.5 | 400.52 | 0.1 | 10,090.82 | 0.11 | 8,818.34 | 26.11 | 38.3 | yjs |
| mags | merge / forked replicas rejoin after 250 ops each | 5,000 | 500 | 0.04 | 22,687.05 | 0.02 | 49,622.87 | n/a | n/a | 8.43 | 118.68 | yjs |
| mags | merge / 10 replicas gossip convergence | 5,000 | 100 | 0.01 | 87,374.4 | 0.02 | 40,829.66 | n/a | n/a | 14.87 | 67.24 | crlist |
| mags | merge / snapshot merge into stale replica | 5,000 | 5,350 | 0 | 396,102.65 | 0 | 341,490.81 | 0.01 | 81,556.49 | 0.09 | 10,824.82 | crlist |
| class | constructor / hydrate snapshot | 5,000 | 250 | 7.96 | 125.6 | 10.38 | 96.31 | 39.32 | 25.43 | 442.2 | 2.26 | crlist |
| class | read / head | 5,000 | 250 | 0 | 959,692.9 | 0 | 1,665,556.3 | 0 | 696,184.91 | 0 | 1,145,737.86 | yjs |
| class | read / middle | 5,000 | 250 | 0 | 1,481,920.57 | 0 | 11,961,722.49 | 0 | 1,865,671.64 | 0 | 5,376,344.09 | yjs |
| class | read / tail | 5,000 | 250 | 0 | 1,871,257.49 | 0 | 8,532,423.21 | 0 | 1,860,119.05 | 0 | 5,494,505.49 | yjs |
| class | find near head | 5,000 | 250 | 0 | 401,026.63 | 0 | 2,340,823.97 | 0 | 451,589.6 | 0 | 706,015.25 | yjs |
| class | find near middle | 5,000 | 250 | 1.43 | 699.66 | 0.12 | 8,280.5 | 1.91 | 524.01 | 0.04 | 27,508.8 | automerge |
| class | find near tail | 5,000 | 250 | 3.69 | 270.94 | 0.19 | 5,201.33 | 4.99 | 200.2 | 0.05 | 20,917.88 | automerge |
| class | iterate visible values | 5,000 | 250 | 0.17 | 5,875.74 | 0.43 | 2,320.21 | 3.97 | 251.9 | 0.17 | 5,984.73 | automerge |
| class | collect visible values to array | 5,000 | 250 | 0.18 | 5,545.87 | 0.47 | 2,137.25 | 3.85 | 259.52 | 0.17 | 6,000.8 | automerge |
| class | append / single after tail | 5,000 | 250 | 0.01 | 119,961.61 | 0.04 | 27,817.03 | 0.08 | 13,062.2 | 4.38 | 228.31 | crlist |
| class | append / batch after tail | 5,000 | 25,000 | 0 | 1,026,247.3 | 0 | 332,601.61 | 0.01 | 68,471.67 | 0.44 | 2,279.97 | crlist |
| class | prepend / single before head | 5,000 | 250 | 0.01 | 184,094.26 | 0.03 | 29,264.41 | 0.03 | 31,794.48 | 4.74 | 210.93 | crlist |
| class | prepend / batch before head | 5,000 | 25,000 | 0 | 759,989.3 | 0 | 402,816.49 | 0.01 | 82,561.22 | 0.45 | 2,204.26 | crlist |
| class | insert / single before middle | 5,000 | 250 | 0.01 | 88,737.44 | 0.03 | 31,894.26 | 0.02 | 43,221.94 | 5.46 | 183.26 | crlist |
| class | insert / batch before middle | 5,000 | 25,000 | 0 | 497,428.3 | 0 | 442,117.14 | 0.01 | 83,843.13 | 0.46 | 2,172.8 | crlist |
| class | overwrite / head | 5,000 | 250 | 0.05 | 19,586.18 | 0.04 | 25,440.37 | 0.12 | 8,383.86 | 5.76 | 173.74 | yjs |
| class | overwrite / middle | 5,000 | 250 | 0.02 | 64,278.92 | 0.04 | 22,547.51 | 0.02 | 59,149.2 | 5.04 | 198.52 | crlist |
| class | overwrite / tail | 5,000 | 250 | 0.01 | 79,266.94 | 0.04 | 27,852.05 | 0.02 | 50,729.49 | 4.82 | 207.54 | crlist |
| class | overwrite / random | 5,000 | 250 | 0.05 | 19,377.59 | 0.07 | 14,277.15 | 0.02 | 49,795.84 | 5.59 | 178.94 | json-joy |
| class | remove / head | 5,000 | 250 | 0.02 | 48,765.26 | 0.03 | 36,359.93 | 0.06 | 17,960.03 | 0.75 | 1,325.92 | crlist |
| class | remove / middle | 5,000 | 250 | 0.02 | 60,441.95 | 0.02 | 51,872.6 | 0.08 | 12,323.22 | 0.82 | 1,213.62 | crlist |
| class | remove / tail | 5,000 | 250 | 0.01 | 185,514.99 | 0.03 | 38,378.88 | 0.01 | 128,218.28 | 0.61 | 1,629.3 | crlist |
| class | remove / range from head | 5,000 | 5,000 | 0 | 360,487.67 | 0 | 4,667,662.43 | 0.01 | 162,206.53 | 0.04 | 26,329.83 | yjs |
| class | remove / range from middle | 5,000 | 5,000 | 0 | 367,528.15 | 0 | 3,942,595.81 | 0.01 | 134,460.29 | 0.04 | 23,520.83 | yjs |
| class | remove / range from tail | 5,000 | 5,000 | 0 | 460,837.99 | 0 | 4,628,772.45 | 0.01 | 152,030.21 | 0.04 | 25,116.58 | yjs |
| class | mixed / append overwrite remove tail | 5,000 | 250 | 0.01 | 146,421.46 | 0.03 | 28,946.91 | 0.02 | 54,048.21 | 4.06 | 246.02 | crlist |
| class | mixed / prepend overwrite remove head | 5,000 | 250 | 0.01 | 163,228 | 0.03 | 37,660.24 | 0.02 | 66,663.11 | 3.75 | 266.42 | crlist |
| class | mixed / insert overwrite remove middle | 5,000 | 250 | 0.01 | 91,921.9 | 0.03 | 34,521.8 | 0.03 | 38,286.01 | 3.68 | 271.69 | crlist |
| class | paste / insert 10,000 entries at cursor | 5,000 | 10,000 | 0 | 290,565.91 | 0 | 506,891.19 | 0.03 | 38,237.31 | 0.41 | 2,453.94 | yjs |
| class | render / join visible entries to string | 5,000 | 250 | 0.44 | 2,278.6 | 0.56 | 1,785.8 | 4.84 | 206.61 | 0.41 | 2,419.04 | automerge |
| class | snapshot | 5,000 | 250 | 0.3 | 3,368.04 | 5.18 | 193.17 | 16.79 | 59.56 | 41.57 | 24.05 | crlist |
| class | snapshot / tombstoned state 50% deleted | 5,000 | 250 | 0.23 | 4,425.71 | 2.61 | 382.85 | 7.78 | 128.58 | 40.99 | 24.4 | crlist |
| class | snapshot / after garbage collection | 5,000 | 250 | 0.23 | 4,384.43 | 0.37 | 2,733.1 | 3.93 | 254.13 | 0.21 | 4,731.71 | automerge |
| class | acknowledge | 5,000 | 250 | 0.63 | 1,587.93 | n/a | n/a | n/a | n/a | n/a | n/a | n/a |
| class | acknowledge / 50% deleted state | 5,000 | 250 | 0.77 | 1,296.36 | n/a | n/a | n/a | n/a | n/a | n/a | n/a |
| class | acknowledge / 90% deleted state | 5,000 | 250 | 1.38 | 724.14 | n/a | n/a | n/a | n/a | n/a | n/a | n/a |
| class | garbage collect | 5,000 | 250 | 0.2 | 4,905.94 | 0.32 | 3,106.68 | 3.81 | 262.39 | 0.17 | 5,910.39 | automerge |
| class | garbage collect / no eligible tombstones | 5,000 | 250 | 0.22 | 4,501.49 | 0.35 | 2,869.75 | 5.12 | 195.14 | 0.17 | 5,874.27 | automerge |
| class | garbage collect / 90% eligible tombstones | 5,000 | 250 | 0.19 | 5,346.22 | 0.3 | 3,351.27 | 3.63 | 275.39 | 0.17 | 5,817.66 | automerge |
| class | merge ordered deltas | 5,000 | 250 | 0.06 | 17,887.42 | 0.01 | 80,458.29 | 0.01 | 108,314.2 | 7.97 | 125.4 | json-joy |
| class | merge shuffled gossip | 5,000 | 250 | 1.33 | 754.33 | 0.64 | 1,559.27 | n/a | n/a | 2.74 | 365.47 | yjs |
| class | merge / duplicate delta ignored | 5,000 | 250 | 0 | 325,436.08 | 0.03 | 32,111.8 | 0.01 | 83,252.86 | 0.11 | 8,786.82 | crlist |
| class | merge / concurrent prepends same head | 5,000 | 2 | 1.76 | 568.29 | 0.07 | 14,265.34 | n/a | n/a | 26.99 | 37.05 | yjs |
| class | merge / concurrent appends same tail | 5,000 | 2 | 0.06 | 15,772.87 | 0.03 | 39,682.54 | n/a | n/a | 26.37 | 37.92 | yjs |
| class | merge / concurrent inserts same middle position | 5,000 | 2 | 1.34 | 744.1 | 0.04 | 22,624.43 | n/a | n/a | 26.47 | 37.77 | yjs |
| class | merge / forked replicas rejoin after 250 ops each | 5,000 | 500 | 0.79 | 1,271.75 | 0.02 | 43,054.46 | n/a | n/a | 8.45 | 118.36 | yjs |
| latency | append tail write to remote visible | 5,000 | 250 | 0.24 | 4,162.11 | 0.5 | 2,010.65 | 26.42 | 37.85 | 15 | 66.67 | crlist |
| latency | prepend head write to remote visible | 5,000 | 250 | 0.07 | 15,344.48 | 0.06 | 17,175.28 | 0.04 | 25,896.54 | 14.65 | 68.27 | json-joy |
| latency | middle insert write to remote visible | 5,000 | 250 | 0.43 | 2,322.19 | 0.23 | 4,270.05 | 9.65 | 103.62 | 15.59 | 64.16 | yjs |
| latency | head insert write to remote visible | 5,000 | 250 | 0.07 | 13,504.61 | 0.03 | 37,021.68 | 0.04 | 24,596.13 | 14.4 | 69.44 | yjs |
| latency | overwrite head write to remote visible | 5,000 | 250 | 0.27 | 3,766.94 | 0.05 | 21,373.92 | 0.11 | 9,200.65 | 15.13 | 66.11 | yjs |
| latency | overwrite middle write to remote visible | 5,000 | 250 | 0.68 | 1,464.74 | 0.21 | 4,752.78 | 7.73 | 129.3 | 15.41 | 64.88 | yjs |
| latency | overwrite tail write to remote visible | 5,000 | 250 | 0.91 | 1,095.03 | 0.39 | 2,582.14 | 12.28 | 81.45 | 14.34 | 69.75 | yjs |
| latency | head delete to remote hidden | 5,000 | 250 | 0.9 | 1,112.38 | 0.5 | 1,995.86 | 12.3 | 81.31 | 5.47 | 182.81 | yjs |
| latency | middle delete to remote hidden | 5,000 | 250 | 0.91 | 1,103.05 | 0.4 | 2,479.67 | 12.05 | 82.96 | 5.53 | 180.99 | yjs |
| latency | tail delete to remote hidden | 5,000 | 250 | 0.24 | 4,174.44 | 0.27 | 3,688.56 | 11.97 | 83.53 | 5.94 | 168.3 | crlist |
| latency | append tail write to 10 remotes visible | 5,000 | 2,500 | 0.35 | 2,886.65 | 0.28 | 3,556.99 | 28.1 | 35.59 | 9.79 | 102.11 | yjs |
| latency | prepend head write to 10 remotes visible | 5,000 | 2,500 | 0.13 | 7,916.58 | 0.02 | 56,992.27 | 0.04 | 25,429.63 | 10.51 | 95.15 | yjs |
| latency | middle insert write to 10 remotes visible | 5,000 | 2,500 | 0.71 | 1,400.71 | 0.2 | 5,009.41 | 10.48 | 95.46 | 10.01 | 99.86 | yjs |
| latency | overwrite middle write to 10 remotes visible | 5,000 | 2,500 | 0.54 | 1,841.97 | 0.15 | 6,765.32 | 6.63 | 150.86 | 10.15 | 98.5 | yjs |
| latency | delete middle to 10 remotes hidden | 5,000 | 2,500 | 0.97 | 1,030.54 | 0.3 | 3,288.54 | 13.2 | 75.76 | 4.86 | 205.79 | yjs |
| latency | out-of-order write delivery to remote visible | 5,000 | 250 | 2.33 | 429 | 87.66 | 11.41 | n/a | n/a | 58.01 | 17.24 | crlist |
| latency | out-of-order delete delivery to remote convergence | 5,000 | 165 | 3.59 | 278.36 | 0.35 | 2,825.74 | 16.3 | 61.35 | 23.05 | 43.39 | yjs |
| latency | out-of-order append delivery to convergence | 5,000 | 250 | 2.64 | 379.44 | 38.24 | 26.15 | n/a | n/a | 38.83 | 25.75 | crlist |
| latency | out-of-order prepend delivery to convergence | 5,000 | 250 | 2.03 | 492.82 | 32.25 | 31.01 | 0.24 | 4,090.47 | 41.27 | 24.23 | json-joy |
| latency | out-of-order middle insert delivery to convergence | 5,000 | 250 | 2.76 | 361.88 | 105.91 | 9.44 | n/a | n/a | 39.75 | 25.16 | crlist |
| latency | out-of-order overwrite delivery to convergence | 5,000 | 129 | 4.46 | 224.43 | n/a | n/a | 522.35 | 1.91 | 213.29 | 4.69 | crlist |
| latency | offline burst 1,000 ops then sync | 5,000 | 1,000 | 0.05 | 20,218.85 | 0.05 | 19,640.08 | 0.01 | 102,341.58 | 8.63 | 115.92 | json-joy |
| latency | forked replicas mixed ops then converge | 5,000 | 500 | 0.01 | 66,677.34 | 0.01 | 104,718.62 | n/a | n/a | 8.95 | 111.77 | yjs |
| latency | duplicate shuffled gossip to convergence | 5,000 | 500 | 0.83 | 1,202.81 | 0.41 | 2,466.85 | n/a | n/a | 1.15 | 866.17 | yjs |
| latency | remote snapshot hydrate then apply pending deltas | 5,000 | 250 | 0.04 | 28,536.53 | 0.06 | 17,727.86 | 0.16 | 6,368.99 | 2.04 | 491.03 | crlist |
| workload | local app session | 5,000 | 250 | 0.01 | 83,311.12 | 0.01 | 66,721.82 | 0.09 | 10,647.95 | 3.12 | 320.44 | crlist |
| workload | read heavy session | 5,000 | 250 | 0 | 2,052,545.16 | 0 | 4,355,400.7 | 0.01 | 194,386.13 | 0 | 1,322,751.32 | yjs |
| workload | write heavy session | 5,000 | 250 | 0.01 | 102,522.04 | 0.02 | 64,812.17 | 0.02 | 45,462.81 | 3.04 | 329.2 | crlist |
| workload | append tail heavy session | 5,000 | 250 | 0 | 220,341.97 | 0.03 | 38,716.47 | 0.01 | 74,493.44 | 3.83 | 261.36 | crlist |
| workload | prepend head heavy session | 5,000 | 250 | 0.01 | 85,925.42 | 0.02 | 56,360.89 | 0.02 | 57,851.62 | 4.35 | 229.66 | crlist |
| workload | insert middle heavy session | 5,000 | 250 | 0.02 | 61,687.27 | 0.02 | 64,201.34 | 0.01 | 72,852.31 | 4.55 | 219.95 | json-joy |
| workload | overwrite heavy session | 5,000 | 250 | 0.02 | 58,995.66 | 0.02 | 48,805.25 | 0.01 | 70,283.95 | 3.45 | 289.91 | json-joy |
| workload | delete heavy session | 5,000 | 250 | 0.01 | 71,930.03 | 0.01 | 69,319.28 | 0.02 | 52,884.31 | 0.64 | 1,561.48 | crlist |
| workload | balanced append prepend insert overwrite delete session | 5,000 | 250 | 0.02 | 57,782.09 | 0.02 | 53,148.52 | 0.01 | 70,557.69 | 3.59 | 278.77 | json-joy |
| workload | random edit session | 5,000 | 250 | 0.03 | 38,280.74 | 0.03 | 31,760.95 | 0.16 | 6,303.96 | 3.22 | 310.47 | crlist |
| workload | text editing session | 5,000 | 250 | 0.02 | 60,760.72 | 0.02 | 51,184.41 | 0.01 | 68,534.46 | 4.09 | 244.36 | json-joy |
| workload | collaborative offline session | 5,000 | 500 | 0.03 | 33,770.78 | 0.02 | 50,769.15 | n/a | n/a | 8.86 | 112.88 | yjs |
| workload | sync and cleanup session | 5,000 | 252 | 0.06 | 17,887.56 | 0.02 | 57,063.29 | n/a | n/a | 8.38 | 119.3 | yjs |
| workload | long lived tombstoned session | 5,000 | 250 | 0.01 | 120,001.92 | 0.03 | 36,608.04 | 0.01 | 71,133.87 | 5.11 | 195.59 | crlist |
| workload | sparse visible session | 5,000 | 250 | 0.01 | 109,237.09 | 0.26 | 3,796.13 | 0.05 | 21,427.04 | 2.73 | 366.82 | crlist |
| workload | post-gc edit session | 5,000 | 250 | 0.01 | 175,648.14 | 0.04 | 26,331.31 | 0.03 | 38,448.53 | 4.14 | 241.64 | crlist |

## License

Apache-2.0
