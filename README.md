[![npm version](https://img.shields.io/npm/v/@sovereignbase/convergent-replicated-list)](https://www.npmjs.com/package/@sovereignbase/convergent-replicated-list)
[![CI](https://github.com/sovereignbase/convergent-replicated-list/actions/workflows/ci.yaml/badge.svg?branch=master)](https://github.com/sovereignbase/convergent-replicated-list/actions/workflows/ci.yaml)
[![codecov](https://codecov.io/gh/sovereignbase/convergent-replicated-list/branch/master/graph/badge.svg)](https://codecov.io/gh/sovereignbase/convergent-replicated-list)
[![license](https://img.shields.io/npm/l/@sovereignbase/convergent-replicated-list)](LICENSE)

# convergent-replicated-list

Convergent Replicated List (CR-List), a delta CRDT for an ordered sequence of entries.

- [Check the docs](https://sovereignbase.dev/convergent-replicated-list/docs/)
- [Read the specification](https://sovereignbase.dev/convergent-replicated-list/)

## Compatibility

- Runtimes: Node >= 20, modern browsers, Bun, Deno, Cloudflare Workers, Edge Runtime.
- Module format: ESM + CommonJS.
- Required globals / APIs: `EventTarget`, `CustomEvent`, `structuredClone`.
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

| group | scenario | n | ops | crlist ms | crlist ms/op | crlist ops/sec | yjs ms/op | yjs ops/sec | json-joy ms/op | json-joy ops/sec | automerge ms/op | automerge ops/sec | winner |
|---|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---|
| crud | create / hydrate snapshot | 5,000 | 250 | 2,096.39 | 8.39 | 119.25 | 15.07 | 66.34 | 19.3 | 51.82 | 232.99 | 4.29 | crlist |
| crud | read / random indexed reads | 5,000 | 250 | 0.35 | 0 | 712,047.85 | 0 | 213,949.51 | 0.01 | 72,573.15 | 0 | 1,487,209.99 | automerge |
| crud | update / append after tail | 5,000 | 250 | 3.75 | 0.01 | 66,712.92 | 0.04 | 26,447.75 | 0.03 | 34,200.66 | 2.79 | 358 | crlist |
| crud | update / insert before middle | 5,000 | 250 | 3.97 | 0.02 | 62,962.78 | 0.02 | 47,542.98 | 0.02 | 59,963.54 | 2.77 | 360.61 | crlist |
| crud | update / insert at head | 5,000 | 250 | 1.53 | 0.01 | 163,302.63 | 0.01 | 77,939.89 | 0.02 | 51,651.83 | 2.58 | 387.17 | crlist |
| crud | update / overwrite random | 5,000 | 250 | 3.77 | 0.02 | 66,267.3 | 0.07 | 14,168.64 | 0.05 | 19,413.25 | 2.91 | 343.26 | crlist |
| crud | delete / single deletes from middle | 5,000 | 250 | 1.94 | 0.01 | 129,098.89 | 0.03 | 31,265.24 | 0.13 | 7,665.23 | 0.42 | 2,369.86 | crlist |
| crud | delete / range deletes | 5,000 | 250 | 5.19 | 0.02 | 48,199.28 | 0.04 | 24,172.81 | 0.25 | 3,945.2 | 0.77 | 1,295.13 | crlist |
| mags | snapshot | 5,000 | 250 | 65.59 | 0.26 | 3,811.53 | 8.41 | 118.88 | 14.09 | 70.97 | 19.99 | 50.02 | crlist |
| mags | acknowledge | 5,000 | 250 | 76.25 | 0.31 | 3,278.61 | n/a | n/a | n/a | n/a | n/a | n/a | n/a |
| mags | garbage collect | 5,000 | 250 | 164.23 | 0.66 | 1,522.22 | n/a | n/a | n/a | n/a | n/a | n/a | n/a |
| mags | merge ordered deltas | 5,000 | 250 | 4.13 | 0.02 | 60,460.95 | 0.06 | 17,959 | 0.02 | 58,147.65 | 4.68 | 213.68 | crlist |
| mags | merge shuffled gossip | 5,000 | 250 | 478.37 | 1.91 | 522.61 | 0.64 | 1,555.98 | 0.09 | 11,595.98 | 0.41 | 2,456.81 | json-joy |
| class | constructor / hydrate snapshot | 5,000 | 250 | 1,886.2 | 7.54 | 132.54 | 12.85 | 77.8 | 18.34 | 54.51 | 211.32 | 4.73 | crlist |
| class | append after tail | 5,000 | 250 | 3.09 | 0.01 | 80,992.65 | 0.02 | 52,369.18 | 0.02 | 53,936.27 | 2.09 | 479.59 | crlist |
| class | prepend before middle | 5,000 | 250 | 7.79 | 0.03 | 32,077.6 | 0.01 | 81,163.56 | 0.01 | 80,744.14 | 2.68 | 372.46 | yjs |
| class | remove from middle | 5,000 | 250 | 1.82 | 0.01 | 137,287.2 | 0.03 | 37,143.24 | 0.03 | 35,865.43 | 0.57 | 1,761.16 | crlist |
| class | find near tail | 5,000 | 250 | 33.64 | 0.13 | 7,431.54 | 0.44 | 2,276.89 | 5.13 | 195.02 | 0.03 | 38,407.18 | automerge |
| class | snapshot | 5,000 | 250 | 83.09 | 0.33 | 3,008.93 | 7.99 | 125.19 | 14.86 | 67.28 | 19.63 | 50.93 | crlist |
| class | acknowledge | 5,000 | 250 | 46.72 | 0.19 | 5,351.54 | n/a | n/a | n/a | n/a | n/a | n/a | n/a |
| class | garbage collect | 5,000 | 250 | 156.68 | 0.63 | 1,595.56 | n/a | n/a | n/a | n/a | n/a | n/a | n/a |
| class | merge ordered deltas | 5,000 | 250 | 2.43 | 0.01 | 102,720.03 | 0.04 | 24,436.26 | 0.01 | 79,953.95 | 4.08 | 244.99 | crlist |
| class | merge shuffled gossip | 5,000 | 250 | 265.96 | 1.06 | 940 | 0.72 | 1,384.5 | 0.01 | 73,120.8 | 0.38 | 2,648.01 | json-joy |
|

These benchmarks compare the work a JavaScript consumer asks each library to do:
hydrate state, read indexed values, mutate list position, emit or apply deltas,
and materialize snapshots. CRList is strongest where its live linked projection
and index cache can be updated incrementally, especially local CRUD, snapshot
hydration, snapshots, and ordered append deltas.

The shuffled-gossip costs more than
json-joy because CRList immediately maintains a JS live projection and returns
index-keyed change patches from every merge.

json-joy's benchmark path applies compact JSON CRDT patches directly to its
model, so shuffled patch application is extremely cheap in this scenario. That
does not prove a weaker convergence model by itself, but it is a different
tradeoff from CRList's immediate event/change surface.

Yjs integrates updates
into a mature struct store with pending update/delete-set handling, which keeps
out-of-order gossip relatively cheap.

Automerge delegates change application and
indexed reads to its WASM-backed document store and lazy proxies, explaining its
very fast random reads and `find` path; its local writes are slower here because
each write goes through immutable document changes and change generation.

Analysis by ChatGPT-5.5.

## License

Apache-2.0
