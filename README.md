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

| group   | scenario                              |     n | ops | crlist ms | crlist ms/op | crlist ops/sec | yjs ms/op | yjs ops/sec | json-joy ms/op | json-joy ops/sec | automerge ms/op | automerge ops/sec | winner      |
| ------- | ------------------------------------- | ----: | --: | --------: | -----------: | -------------: | --------: | ----------: | -------------: | ---------------: | --------------: | ----------------: | ----------- |
| `crud`  | `create / hydrate snapshot`           | 5,000 | 250 |    931.72 |         3.73 |         268.32 |      7.16 |      139.64 |           9.51 |           105.17 |          161.09 |              6.21 | `crlist`    |
| `crud`  | `read / random indexed reads`         | 5,000 | 250 |      0.44 |         0.00 |     566,251.42 |      0.00 |  317,097.92 |           0.01 |       119,058.96 |            0.00 |      1,346,257.40 | `automerge` |
| `crud`  | `update / append after tail`          | 5,000 | 250 |      1.44 |         0.01 |     173,502.67 |      0.04 |   28,247.95 |           0.01 |        67,191.66 |            2.11 |            474.14 | `crlist`    |
| `crud`  | `update / insert before middle`       | 5,000 | 250 |      2.53 |         0.01 |      98,884.58 |      0.03 |   36,225.06 |           0.01 |        70,208.94 |            2.01 |            497.76 | `crlist`    |
| `crud`  | `update / insert at head`             | 5,000 | 250 |      1.44 |         0.01 |     173,550.85 |      0.02 |   40,084.02 |           0.05 |        18,293.44 |            1.87 |            535.11 | `crlist`    |
| `crud`  | `update / overwrite random`           | 5,000 | 250 |      2.06 |         0.01 |     121,471.26 |      0.04 |   26,806.78 |           0.02 |        48,635.29 |            2.10 |            476.80 | `crlist`    |
| `crud`  | `delete / single deletes from middle` | 5,000 | 250 |      0.95 |         0.00 |     262,687.82 |      0.03 |   34,603.51 |           0.05 |        21,055.47 |            0.29 |          3,421.99 | `crlist`    |
| `crud`  | `delete / range deletes`              | 5,000 | 250 |      2.22 |         0.01 |     112,719.24 |      0.03 |   34,886.97 |           0.11 |         9,141.37 |            0.48 |          2,075.54 | `crlist`    |
| `mags`  | `snapshot`                            | 5,000 | 250 |     35.56 |         0.14 |       7,031.04 |      4.21 |      237.67 |           8.87 |           112.73 |           15.46 |             64.69 | `crlist`    |
| `mags`  | `acknowledge`                         | 5,000 | 250 |     19.73 |         0.08 |      12,669.77 |     `n/a` |       `n/a` |          `n/a` |            `n/a` |           `n/a` |             `n/a` | `n/a`       |
| `mags`  | `garbage collect`                     | 5,000 | 250 |     98.48 |         0.39 |       2,538.66 |     `n/a` |       `n/a` |          `n/a` |            `n/a` |           `n/a` |             `n/a` | `n/a`       |
| `mags`  | `merge ordered deltas`                | 5,000 | 250 |      1.40 |         0.01 |     178,520.42 |      0.03 |   31,813.09 |           0.01 |       104,214.43 |            3.45 |            289.47 | `crlist`    |
| `mags`  | `merge shuffled gossip`               | 5,000 | 250 |     53.60 |         0.21 |       4,664.41 |      0.41 |    2,424.80 |           0.02 |        42,291.17 |            0.30 |          3,341.40 | `json-joy`  |
| `class` | `constructor / hydrate snapshot`      | 5,000 | 250 |    942.10 |         3.77 |         265.36 |      7.42 |      134.74 |          10.07 |            99.31 |          208.73 |              4.79 | `crlist`    |
| `class` | `append after tail`                   | 5,000 | 250 |      3.04 |         0.01 |      82,109.90 |      0.04 |   26,579.34 |           0.01 |       129,312.57 |            2.48 |            402.76 | `json-joy`  |
| `class` | `prepend before middle`               | 5,000 | 250 |      2.62 |         0.01 |      95,398.00 |      0.01 |  100,636.02 |           0.01 |       115,457.44 |            2.59 |            385.70 | `json-joy`  |
| `class` | `remove from middle`                  | 5,000 | 250 |      1.23 |         0.00 |     203,500.20 |      0.02 |   58,162.53 |           0.05 |        21,500.01 |            0.72 |          1,396.10 | `crlist`    |
| `class` | `find near tail`                      | 5,000 | 250 |     33.23 |         0.13 |       7,522.51 |      0.27 |    3,697.16 |           4.08 |           245.17 |            0.03 |         36,066.71 | `automerge` |
| `class` | `snapshot`                            | 5,000 | 250 |     49.87 |         0.20 |       5,012.86 |      5.30 |      188.78 |          14.36 |            69.62 |           20.54 |             48.69 | `crlist`    |
| `class` | `acknowledge`                         | 5,000 | 250 |     36.20 |         0.14 |       6,906.82 |     `n/a` |       `n/a` |          `n/a` |            `n/a` |           `n/a` |             `n/a` | `n/a`       |
| `class` | `garbage collect`                     | 5,000 | 250 |    116.08 |         0.46 |       2,153.70 |     `n/a` |       `n/a` |          `n/a` |            `n/a` |           `n/a` |             `n/a` | `n/a`       |
| `class` | `merge ordered deltas`                | 5,000 | 250 |      1.45 |         0.01 |     172,034.13 |      0.04 |   25,621.05 |           0.01 |       168,123.74 |            4.46 |            224.16 | `crlist`    |
| `class` | `merge shuffled gossip`               | 5,000 | 250 |    247.82 |         0.99 |       1,008.82 |      0.67 |    1,503.07 |           0.02 |        40,857.68 |            0.38 |          2,626.38 | `json-joy`  |

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
