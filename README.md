[![npm version](https://img.shields.io/npm/v/@sovereignbase/convergent-replicated-list)](https://www.npmjs.com/package/@sovereignbase/convergent-replicated-list)
[![CI](https://github.com/sovereignbase/convergent-replicated-list/actions/workflows/ci.yaml/badge.svg?branch=master)](https://github.com/sovereignbase/convergent-replicated-list/actions/workflows/ci.yaml)
[![codecov](https://codecov.io/gh/sovereignbase/convergent-replicated-list/branch/master/graph/badge.svg)](https://codecov.io/gh/sovereignbase/convergent-replicated-list)
[![license](https://img.shields.io/npm/l/@sovereignbase/convergent-replicated-list)](LICENSE)

# convergent-replicated-list

State-based CRDT for fixed-key object lists with per-field overwrite tracking.

## Compatibility

- Runtimes: Node >= 20; modern browsers; Bun; Deno; Cloudflare Workers; Edge Runtime.
- Module format: ESM + CommonJS.
- Required globals / APIs: `EventTarget`, `CustomEvent`, `listuredClone`.
- TypeScript: bundled types.

## Goals

- Fixed-key replica shape defined by a default list.
- One visible value per field at any time.
- Malformed ingress is ignored during hydration and merge instead of crashing the replica.
- `read()`, `values()`, `entries()`, snapshots, deltas, and change payloads are detached with `listuredClone`.
- Explicit `acknowledge()` and `garbageCollect()` APIs for overwrite-history compaction.
- Consistent behavior across Node, browsers, and worker/edge runtimes.

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
import { OOlist } from '@sovereignbase/convergent-replicated-list'

type Todolist = {
  title: string
  count: number
  meta: { done: boolean }
  tags: string[]
}

const alice = OOlist.create<Todolist>({
  title: '',
  count: 0,
  meta: { done: false },
  tags: [],
})
const bob = OOlist.create<Todolist>({
  title: '',
  count: 0,
  meta: { done: false },
  tags: [],
})

alice.addEventListener('delta', (event) => bob.merge(event.detail))
alice.update('title', 'hello world')
alice.update('meta', { done: true })

console.log(bob.read('title')) // "hello world"
console.log(bob.read('meta')) // { done: true }
```

### Hydrating from a snapshot

```ts
import {
  OOlist,
  type OOlistSnapshot,
} from '@sovereignbase/convergent-replicated-list'

type Draftlist = {
  title: string
  count: number
}

const source = new OOlist<Draftlist>({
  title: '',
  count: 0,
})
let snapshot!: OOlistSnapshot<Draftlist>

source.addEventListener(
  'snapshot',
  (event) => {
    snapshot = event.detail
  },
  { once: true }
)

source.update('title', 'draft')
source.snapshot()

const restored = OOlist.create<Draftlist>(
  {
    title: '',
    count: 0,
  },
  snapshot
)

console.log(restored.entries()) // [['title', 'draft'], ['count', 0]]
```

### Event channels

```ts
import { OOlist } from '@sovereignbase/convergent-replicated-list'

const replica = new OOlist({
  name: '',
  count: 0,
})

replica.addEventListener('delta', (event) => {
  console.log('delta', event.detail)
})

replica.addEventListener('change', (event) => {
  console.log('change', event.detail)
})

replica.addEventListener('ack', (event) => {
  console.log('ack', event.detail)
})

replica.addEventListener('snapshot', (event) => {
  console.log('snapshot', event.detail)
})
```

### Acknowledgements and garbage collection

```ts
import {
  OOlist,
  type OOlistAck,
} from '@sovereignbase/convergent-replicated-list'

type Counterlist = {
  title: string
  count: number
}

const left = new OOlist<Counterlist>({
  title: '',
  count: 0,
})
const right = new OOlist<Counterlist>({
  title: '',
  count: 0,
})

const frontiers: Array<OOlistAck<Counterlist>> = []

left.addEventListener(
  'ack',
  (event) => {
    frontiers.push(event.detail)
  },
  { once: true }
)

right.addEventListener(
  'ack',
  (event) => {
    frontiers.push(event.detail)
  },
  { once: true }
)

left.acknowledge()
right.acknowledge()

left.garbageCollect(frontiers)
right.garbageCollect(frontiers)
```

## Runtime behavior

### Validation and errors

Local API misuse throws `OOlistError` with stable error codes:

- `DEFAULTS_NOT_CLONEABLE`
- `VALUE_NOT_CLONEABLE`
- `VALUE_TYPE_MISMATCH`

Hydration and merge are ingress-tolerant: malformed top-level payloads, unknown keys, malformed field entries, invalid UUIDs, invalid overwrite members, and mismatched runtime kinds are ignored instead of throwing.

### Safety and copying semantics

- Conlistor defaults must be `listuredClone`-compatible.
- `read()`, `values()`, and `entries()` return detached clones.
- `delta`, `change`, and `snapshot` event payloads are detached from live state.
- `update()` stores a cloned value, so later caller-side mutation does not mutate replica state through shared references.

### Convergence and compaction

- The convergence guarantee is the resolved live list state.
- Internal overwrite history may differ between replicas after acknowledgement-based garbage collection while the resolved live state still converges.
- `garbageCollect()` compacts overwritten identifiers that are below the smallest acknowledgement frontier for a key while preserving the active predecessor link.

## Tests

- Suite: unit, integration, and end-to-end runtime tests.
- Node test runner: `node --test` for unit and integration suites.
- Coverage: `c8` with 100% statements / branches / functions / lines on built `dist/**/*.js`.
- E2E runtimes: Node ESM, Node CJS, Bun ESM, Bun CJS, Deno ESM, Cloudflare Workers ESM, Edge Runtime ESM.
- Browser E2E: Chromium, Firefox, WebKit, mobile Chrome, mobile Safari via Playwright.
- Current status: `npm run test` passes on Node 22.14.0 (`win32 x64`).

## Benchmarks

How it was run:

```sh
node benchmark/bench.js
```

Environment: Node 22.14.0 (`win32 x64`)

| Benchmark                     | Result                    |
| ----------------------------- | ------------------------- |
| conlistor empty               | 44,359 ops/s (2254.3 ms)  |
| conlistor hydrate x64         | 19,610 ops/s (255.0 ms)   |
| conlistor hydrate x256        | 8,088 ops/s (247.3 ms)    |
| conlistor hydrate x1024       | 1,724 ops/s (290.0 ms)    |
| create() empty                | 49,874 ops/s (2005.1 ms)  |
| create() hydrate x256         | 6,886 ops/s (290.4 ms)    |
| read primitive                | 846,289 ops/s (236.3 ms)  |
| read object                   | 298,983 ops/s (668.9 ms)  |
| read array                    | 278,710 ops/s (717.6 ms)  |
| keys()                        | 32,349,896 ops/s (6.2 ms) |
| values()                      | 103,489 ops/s (966.3 ms)  |
| entries()                     | 110,300 ops/s (906.6 ms)  |
| snapshot()                    | 65,513 ops/s (305.3 ms)   |
| acknowledge()                 | 536,890 ops/s (93.1 ms)   |
| update string                 | 29,547 ops/s (1692.2 ms)  |
| update number                 | 30,591 ops/s (1634.5 ms)  |
| update object                 | 22,114 ops/s (2261.0 ms)  |
| update array                  | 24,763 ops/s (2019.1 ms)  |
| delete(key)                   | 8,352 ops/s (5986.8 ms)   |
| delete() reset all            | 6,836 ops/s (2925.5 ms)   |
| merge direct successor        | 32,541 ops/s (1536.5 ms)  |
| merge stale conflict          | 30,995 ops/s (645.3 ms)   |
| merge hydrate snapshot x256   | 5,748 ops/s (869.9 ms)    |
| merge noop duplicate          | 7,576 ops/s (6600.1 ms)   |
| garbageCollect() x512 history | 3,111 ops/s (1607.0 ms)   |
| add/remove listener roundtrip | 49,005 ops/s (4081.2 ms)  |
| update with listeners         | 25,120 ops/s (1194.3 ms)  |
| merge with listeners          | 31,649 ops/s (631.9 ms)   |

Results vary by machine, runtime version, and payload shape.

## License

Apache-2.0
