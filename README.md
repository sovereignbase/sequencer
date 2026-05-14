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

| group   | scenario                              |     n | ops | crlist ms | crlist ms/op | crlist ops/sec | yjs ms/op | yjs ops/sec | json-joy ms/op | json-joy ops/sec | winner     |
| ------- | ------------------------------------- | ----: | --: | --------: | -----------: | -------------: | --------: | ----------: | -------------: | ---------------: | ---------- |
| `crud`  | `create / hydrate snapshot`           | 5,000 | 250 |  5,260.62 |        21.04 |          47.52 |      7.24 |      138.15 |           9.47 |           105.62 | `yjs`      |
| `crud`  | `read / random indexed reads`         | 5,000 | 250 |     10.46 |         0.04 |      23,897.38 |      0.00 |  383,494.40 |           0.01 |       135,215.53 | `yjs`      |
| `crud`  | `update / append after tail`          | 5,000 | 250 |      3.43 |         0.01 |      72,824.73 |      0.08 |   13,097.71 |           0.01 |        97,874.17 | `json-joy` |
| `crud`  | `update / insert before middle`       | 5,000 | 250 |     19.47 |         0.08 |      12,842.58 |      0.02 |   58,644.15 |           0.01 |       104,650.68 | `json-joy` |
| `crud`  | `update / overwrite random`           | 5,000 | 250 |     12.77 |         0.05 |      19,573.76 |      0.04 |   23,804.54 |           0.02 |        47,827.67 | `json-joy` |
| `crud`  | `delete / single deletes from middle` | 5,000 | 250 |      9.00 |         0.04 |      27,792.60 |      0.02 |   58,645.52 |           0.05 |        21,442.85 | `yjs`      |
| `crud`  | `delete / range deletes`              | 5,000 | 250 |      6.88 |         0.03 |      36,337.21 |      0.04 |   26,594.33 |           0.14 |         7,011.64 | `crlist`   |
| `mags`  | `snapshot`                            | 5,000 | 250 |  3,559.39 |        14.24 |          70.24 |      3.94 |      253.99 |           8.53 |           117.19 | `yjs`      |
| `mags`  | `acknowledge`                         | 5,000 | 250 |     23.24 |         0.09 |      10,759.03 |     `n/a` |       `n/a` |          `n/a` |            `n/a` | `n/a`      |
| `mags`  | `garbage collect`                     | 5,000 | 250 |     84.17 |         0.34 |       2,970.07 |     `n/a` |       `n/a` |          `n/a` |            `n/a` | `n/a`      |
| `mags`  | `merge ordered deltas`                | 5,000 | 250 |      5.69 |         0.02 |      43,902.78 |      0.03 |   30,247.67 |           0.01 |       123,043.61 | `json-joy` |
| `mags`  | `merge shuffled gossip`               | 5,000 | 250 |    296.31 |         1.19 |         843.71 |      0.43 |    2,314.03 |          `n/a` |            `n/a` | `yjs`      |
| `class` | `constructor / hydrate snapshot`      | 5,000 | 250 |  5,747.69 |        22.99 |          43.50 |      7.35 |      136.07 |           9.56 |           104.59 | `yjs`      |
| `class` | `append after tail`                   | 5,000 | 250 |      4.16 |         0.02 |      60,109.16 |      0.01 |   75,133.74 |           0.01 |       168,440.91 | `json-joy` |
| `class` | `prepend before middle`               | 5,000 | 250 |      8.67 |         0.03 |      28,825.09 |      0.01 |  107,749.33 |           0.01 |       166,911.47 | `json-joy` |
| `class` | `remove from middle`                  | 5,000 | 250 |      4.18 |         0.02 |      59,841.54 |      0.01 |   88,655.63 |           0.03 |        32,358.27 | `yjs`      |
| `class` | `find near tail`                      | 5,000 | 250 |  4,725.12 |        18.90 |          52.91 |      0.19 |    5,268.23 |           2.18 |           459.41 | `yjs`      |
| `class` | `snapshot`                            | 5,000 | 250 |  3,915.17 |        15.66 |          63.85 |      3.90 |      256.50 |           8.33 |           120.11 | `yjs`      |
| `class` | `acknowledge`                         | 5,000 | 250 |     20.46 |         0.08 |      12,216.81 |     `n/a` |       `n/a` |          `n/a` |            `n/a` | `n/a`      |
| `class` | `garbage collect`                     | 5,000 | 250 |     81.15 |         0.32 |       3,080.87 |     `n/a` |       `n/a` |          `n/a` |            `n/a` | `n/a`      |
| `class` | `merge ordered deltas`                | 5,000 | 250 |      4.98 |         0.02 |      50,151.46 |      0.02 |   45,935.62 |           0.00 |       215,554.41 | `json-joy` |
| `class` | `merge shuffled gossip`               | 5,000 | 250 |    270.52 |         1.08 |         924.14 |      0.31 |    3,256.09 |          `n/a` |            `n/a` | `yjs`      |

## License

Apache-2.0
