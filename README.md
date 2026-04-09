[![npm version](https://img.shields.io/npm/v/@sovereignbase/convergent-replicated-list)](https://www.npmjs.com/package/@sovereignbase/convergent-replicated-list)
[![CI](https://github.com/sovereignbase/convergent-replicated-list/actions/workflows/ci.yaml/badge.svg?branch=master)](https://github.com/sovereignbase/convergent-replicated-list/actions/workflows/ci.yaml)
[![codecov](https://codecov.io/gh/sovereignbase/convergent-replicated-list/branch/master/graph/badge.svg)](https://codecov.io/gh/sovereignbase/convergent-replicated-list)
[![license](https://img.shields.io/npm/l/@sovereignbase/convergent-replicated-list)](LICENSE)

# convergent-replicated-list

Convergent Replicated List (CR-List), a delta CRDT for an ordered sequence of entries.

## Compatibility

- Runtimes: Node >= 20, modern browsers, Bun, Deno, Cloudflare Workers, Edge Runtime.
- Module format: ESM + CommonJS.
- Required globals / APIs: `EventTarget`, `CustomEvent`, `structuredClone`.
- TypeScript: bundled types.

## Goals

- Deterministic convergence of the live list projection under asynchronous gossip delivery.
- Consistent behavior across Node, browsers, worker, and edge runtimes.
- Garbage collection without breaking live-view convergence.
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

const serialized = JSON.stringify(list)
const restored = new CRList<string>(JSON.parse(serialized))

for (const value of list) {
  console.log(value)
}

for (const index in list) {
  console.log(index)
}

list.forEach((value, index, target) => {
  console.log(index, value, target.size)
})

console.log([...restored]) // ['What is', 'up', 'dude!']
```

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

const replica = __create<string>()
const local = __update(0, ['hello', 'world'], replica, 'after')

if (local) {
  const outgoing: CRListDelta<string> = local.delta
  const remoteChange = __merge(replica, outgoing)

  console.log(remoteChange)
}

const snapshot: CRListSnapshot<string> = __snapshot(replica)
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

- `DEFAULTS_NOT_CLONEABLE`
- `VALUE_NOT_CLONEABLE`
- `VALUE_TYPE_MISMATCH`
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

- Snapshots are serializable full-state payloads.
- Deltas are serializable gossip payloads.
- `change` is a minimal index-keyed local patch.
- `toJSON()` returns a detached serializable snapshot.
- `for...of`, `forEach()`, numeric indexing, `append()`, `prepend()`, `remove()`, `merge()`, `snapshot()`, `acknowledge()`, and `garbageCollect()` all operate on the live list projection.

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

- Unit coverage on built `dist/**/*.js` with `100%` statements, branches, functions, and lines.
- Public `CRList` surface: indexing, iteration, `forEach`, proxy traps, events, JSON/inspect behavior.
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

The benchmark runner currently uses:

- `LIST_SIZE = 5_000`
- `RUN_TIMES = 250`
- output columns: `group`, `scenario`, `n`, `ops`, `ms`, `ms/op`, `ops/sec`

Last measured on Node `v22.14.0` (`win32 x64`):

| group   | scenario                              |     n | ops |       ms | ms/op |    ops/sec |
| ------- | ------------------------------------- | ----: | --: | -------: | ----: | ---------: |
| `crud`  | `create / hydrate snapshot`           | 5,000 | 250 | 8,541.40 | 34.17 |      29.27 |
| `crud`  | `read / random indexed reads`         | 5,000 | 250 |    17.58 |  0.07 |  14,220.30 |
| `crud`  | `update / append after tail`          | 5,000 | 250 |     3.71 |  0.01 |  67,309.25 |
| `crud`  | `update / insert before middle`       | 5,000 | 250 |    26.13 |  0.10 |   9,569.38 |
| `crud`  | `update / overwrite random`           | 5,000 | 250 |    18.04 |  0.07 |  13,859.71 |
| `crud`  | `delete / single deletes from middle` | 5,000 | 250 |    19.41 |  0.08 |  12,877.04 |
| `crud`  | `delete / range deletes`              | 5,000 | 250 |     6.31 |  0.03 |  39,635.98 |
| `mags`  | `snapshot`                            | 5,000 | 250 | 5,382.36 | 21.53 |      46.45 |
| `mags`  | `acknowledge`                         | 5,000 | 250 |   500.11 |  2.00 |     499.89 |
| `mags`  | `garbage collect`                     | 5,000 | 250 |   204.62 |  0.82 |   1,221.75 |
| `mags`  | `merge ordered deltas`                | 5,000 | 250 |    12.35 |  0.05 |  20,239.31 |
| `mags`  | `merge shuffled gossip`               | 5,000 | 250 |   560.28 |  2.24 |     446.20 |
| `class` | `constructor / hydrate snapshot`      | 5,000 | 250 | 8,010.41 | 32.04 |      31.21 |
| `class` | `append after tail`                   | 5,000 | 250 |     2.45 |  0.01 | 102,140.87 |
| `class` | `prepend before middle`               | 5,000 | 250 |     8.02 |  0.03 |  31,184.90 |
| `class` | `remove from middle`                  | 5,000 | 250 |    24.46 |  0.10 |  10,220.35 |
| `class` | `snapshot`                            | 5,000 | 250 | 5,213.99 | 20.86 |      47.95 |
| `class` | `acknowledge`                         | 5,000 | 250 |   313.81 |  1.26 |     796.65 |
| `class` | `garbage collect`                     | 5,000 | 250 |   106.11 |  0.42 |   2,355.98 |
| `class` | `merge ordered deltas`                | 5,000 | 250 |     8.20 |  0.03 |  30,502.31 |
| `class` | `merge shuffled gossip`               | 5,000 | 250 |   365.12 |  1.46 |     684.70 |

## License

Apache-2.0
