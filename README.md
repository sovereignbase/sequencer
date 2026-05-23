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

| group   | scenario                                           |     n | ops | crlist ms | crlist ms/op | crlist ops/sec | yjs ms/op | yjs ops/sec | json-joy ms/op | json-joy ops/sec | automerge ms/op | automerge ops/sec | winner    |
| ------- | -------------------------------------------------- | ----: | --: | --------: | -----------: | -------------: | --------: | ----------: | -------------: | ---------------: | --------------: | ----------------: | --------- |
| crud    | create / hydrate snapshot                          | 5,000 | 250 |  1,196.96 |         4.79 |         208.86 |      9.27 |      107.88 |          12.86 |            77.78 |          161.27 |               6.2 | crlist    |
| crud    | read / random indexed reads                        | 5,000 | 250 |      0.69 |            0 |     359,919.38 |         0 |  250,375.56 |           0.01 |       109,938.43 |               0 |       1,445,922.5 | automerge |
| crud    | update / append after tail                         | 5,000 | 250 |       1.8 |         0.01 |     138,557.89 |      0.02 |    40,340.8 |           0.02 |        44,789.22 |               2 |            498.99 | crlist    |
| crud    | update / insert before middle                      | 5,000 | 250 |      3.07 |         0.01 |      81,425.27 |      0.02 |   55,321.97 |           0.01 |        79,961.62 |            1.92 |             521.5 | crlist    |
| crud    | update / insert at head                            | 5,000 | 250 |      2.86 |         0.01 |      87,305.74 |      0.01 |  104,672.58 |           0.02 |        41,149.55 |            1.98 |            504.33 | yjs       |
| crud    | update / overwrite random                          | 5,000 | 250 |      5.63 |         0.02 |      44,397.09 |      0.05 |   20,391.02 |           0.03 |        34,526.57 |            2.23 |            448.79 | crlist    |
| crud    | delete / single deletes from middle                | 5,000 | 250 |      1.77 |         0.01 |     140,924.46 |      0.02 |    56,326.6 |           0.02 |         41,923.1 |            0.33 |          3,034.57 | crlist    |
| crud    | delete / range deletes                             | 5,000 | 250 |      6.06 |         0.02 |      41,262.98 |      0.02 |   40,741.83 |           0.07 |        13,344.01 |            0.42 |          2,365.95 | crlist    |
| mags    | snapshot                                           | 5,000 | 250 |     61.55 |         0.25 |       4,061.61 |      5.16 |      193.92 |           10.3 |            97.13 |           15.68 |             63.78 | crlist    |
| mags    | acknowledge                                        | 5,000 | 250 |     44.79 |         0.18 |        5,582.1 |       n/a |         n/a |            n/a |              n/a |             n/a |               n/a | n/a       |
| mags    | garbage collect                                    | 5,000 | 250 |    147.13 |         0.59 |       1,699.21 |       n/a |         n/a |            n/a |              n/a |             n/a |               n/a | n/a       |
| mags    | merge ordered deltas                               | 5,000 | 250 |      1.69 |         0.01 |     147,658.14 |      0.04 |   27,173.62 |           0.01 |        82,464.71 |            3.68 |            271.46 | crlist    |
| mags    | merge shuffled gossip                              | 5,000 | 250 |       n/a |          n/a |            n/a |      0.59 |    1,685.81 |            n/a |              n/a |            0.33 |          3,043.22 | automerge |
| class   | constructor / hydrate snapshot                     | 5,000 | 250 |  1,518.88 |         6.08 |          164.6 |      9.63 |       103.8 |          11.07 |            90.32 |             205 |              4.88 | crlist    |
| class   | append after tail                                  | 5,000 | 250 |      2.99 |         0.01 |      83,701.62 |      0.01 |   69,074.13 |           0.01 |       162,834.63 |            2.38 |            419.43 | json-joy  |
| class   | prepend before middle                              | 5,000 | 250 |      2.86 |         0.01 |      87,284.41 |      0.01 |  129,125.56 |           0.01 |       128,218.28 |            2.08 |            481.22 | yjs       |
| class   | remove from middle                                 | 5,000 | 250 |      1.99 |         0.01 |     125,514.61 |      0.01 |   76,115.09 |           0.01 |        99,407.53 |            0.37 |          2,673.64 | crlist    |
| class   | find near tail                                     | 5,000 | 250 |    119.12 |         0.48 |       2,098.66 |      0.21 |    4,715.35 |           1.71 |           585.14 |            0.02 |         40,475.34 | automerge |
| class   | snapshot                                           | 5,000 | 250 |     62.59 |         0.25 |       3,994.02 |      4.88 |      205.07 |           8.26 |           121.09 |           19.84 |              50.4 | crlist    |
| class   | acknowledge                                        | 5,000 | 250 |     38.72 |         0.15 |       6,456.58 |       n/a |         n/a |            n/a |              n/a |             n/a |               n/a | n/a       |
| class   | garbage collect                                    | 5,000 | 250 |    108.65 |         0.43 |       2,301.01 |       n/a |         n/a |            n/a |              n/a |             n/a |               n/a | n/a       |
| class   | merge ordered deltas                               | 5,000 | 250 |      1.29 |         0.01 |     193,963.85 |      0.03 |   34,196.92 |              0 |       258,371.23 |            4.92 |            203.07 | json-joy  |
| class   | merge shuffled gossip                              | 5,000 | 250 |       n/a |          n/a |            n/a |      0.45 |    2,221.81 |            n/a |              n/a |            0.71 |          1,400.93 | yjs       |
| latency | append write to remote visible                     | 5,000 | 250 |      3.61 |         0.01 |      69,202.24 |      0.07 |   14,698.45 |           0.02 |        54,034.19 |            8.78 |            113.89 | crlist    |
| latency | middle insert write to remote visible              | 5,000 | 250 |      8.29 |         0.03 |      30,168.46 |      0.05 |   19,072.32 |           0.02 |        61,106.77 |            8.26 |            121.13 | json-joy  |
| latency | head insert write to remote visible                | 5,000 | 250 |     22.31 |         0.09 |       11,207.6 |      0.05 |   19,615.07 |           0.02 |           43,743 |            8.65 |             115.6 | json-joy  |
| latency | head delete to remote hidden                       | 5,000 | 250 |    294.31 |         1.18 |         849.46 |      0.05 |   20,731.06 |           0.06 |        16,273.29 |            3.73 |            267.95 | yjs       |
| latency | middle delete to remote hidden                     | 5,000 | 250 |    258.47 |         1.03 |         967.23 |      0.05 |   21,973.39 |           0.06 |        18,026.59 |            3.06 |            326.98 | yjs       |
| latency | tail delete to remote hidden                       | 5,000 | 250 |    260.32 |         1.04 |         960.35 |      0.07 |    14,636.4 |           0.04 |        25,885.28 |            2.83 |            353.71 | json-joy  |
| latency | out-of-order write delivery to remote visible      | 5,000 | 250 |     36.86 |         0.15 |        6,781.7 |    207.42 |        4.82 |            n/a |              n/a |          224.72 |              4.45 | crlist    |
| latency | out-of-order delete delivery to remote convergence | 5,000 | 250 |    327.06 |         1.31 |         764.38 |      0.03 |   30,974.71 |           0.12 |         8,192.85 |            1.03 |            968.05 | yjs       |

## License

Apache-2.0
