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

| group    | scenario                                                | n     | ops    | crlist ms/op | crlist ops/sec | yjs ms/op | yjs ops/sec   | json-joy ms/op | json-joy ops/sec | automerge ms/op | automerge ops/sec | winner    |
| -------- | ------------------------------------------------------- | ----- | ------ | ------------ | -------------- | --------- | ------------- | -------------- | ---------------- | --------------- | ----------------- | --------- |
| crud     | create / empty list                                     | 5,000 | 250    | 0            | 460,489.96     | 0.17      | 5,993.16      | 0.02           | 45,005.31        | 0.35            | 2,870.67          | crlist    |
| crud     | create / hydrate snapshot                               | 5,000 | 250    | 3.73         | 267.91         | 6.94      | 144.05        | 21.18          | 47.23            | 155.5           | 6.43              | crlist    |
| crud     | create / hydrate clean snapshot                         | 5,000 | 250    | 3.55         | 281.88         | 6.74      | 148.39        | 19.25          | 51.95            | 156.82          | 6.38              | crlist    |
| crud     | create / hydrate tombstoned snapshot                    | 5,000 | 250    | 2.68         | 373.54         | 3.48      | 287.25        | 9.24           | 108.26           | 158.91          | 6.29              | crlist    |
| crud     | read / head                                             | 5,000 | 250    | 0            | 1,372,872.05   | 0         | 783,208.02    | 0              | 258,184.45       | 0               | 3,320,053.12      | automerge |
| crud     | read / middle                                           | 5,000 | 250    | 0            | 6,009,615.38   | 0         | 2,006,420.55  | 0              | 686,059.28       | 0               | 8,960,573.48      | automerge |
| crud     | read / tail                                             | 5,000 | 250    | 0            | 7,645,259.94   | 0         | 2,179,598.95  | 0              | 695,603.78       | 0               | 8,960,573.48      | automerge |
| crud     | read / random indexed reads                             | 5,000 | 250    | 0            | 816,726.56     | 0         | 750,976.27    | 0.01           | 178,762.96       | 0               | 1,210,653.75      | automerge |
| crud     | read / sequential indexed reads from head               | 5,000 | 250    | 0            | 1,196,172.25   | 0         | 1,115,075.83  | 0              | 251,332.06       | 0               | 1,317,870.32      | automerge |
| crud     | read / sequential indexed reads from middle             | 5,000 | 250    | 0            | 3,172,588.83   | 0         | 933,881.21    | 0              | 294,846.09       | 0               | 8,532,423.21      | automerge |
| crud     | read / sequential indexed reads from tail               | 5,000 | 250    | 0            | 4,280,821.92   | 0         | 930,405.66    | 0              | 298,400.57       | 0               | 8,710,801.39      | automerge |
| crud     | read / full iteration visible values                    | 5,000 | 250    | 0.65         | 1,535.69       | 0.24      | 4,182.77      | 2              | 499.99           | 0.07            | 13,334.12         | automerge |
| crud     | read / collect visible values to array                  | 5,000 | 250    | 0.66         | 1,521.73       | 0.2       | 4,934.45      | 1.65           | 606.88           | 0.09            | 10,552.98         | automerge |
| crud     | read / visible sparse over deleted entries              | 5,000 | 250    | 0            | 3,506,311.36   | 0.03      | 30,914.19     | 0.02           | 48,790.01        | 0               | 7,507,507.51      | automerge |
| crud     | find / head                                             | 5,000 | 250    | 0            | 1,284,026.71   | 0         | 1,151,012.89  | 0              | 628,456.51       | 0               | 1,646,903.82      | automerge |
| crud     | find / middle                                           | 5,000 | 250    | 0.2          | 4,976.86       | 0.12      | 8,619.35      | 0.71           | 1,405.84         | 0.01            | 74,402.55         | automerge |
| crud     | find / tail                                             | 5,000 | 250    | 0.27         | 3,669.84       | 0.18      | 5,629.34      | 1.86           | 538.59           | 0.02            | 50,227.03         | automerge |
| crud     | find / missing value                                    | 5,000 | 250    | 0.32         | 3,152.34       | 0.2       | 4,979         | 2.19           | 457.15           | 0.03            | 31,336.57         | automerge |
| crud     | append / single after tail                              | 5,000 | 250    | 0.01         | 85,013.77      | 0.03      | 31,966.45     | 0.04           | 25,539.39        | 1.85            | 541.3             | crlist    |
| crud     | append / batch after tail                               | 5,000 | 25,000 | 0.01         | 190,502.61     | 0         | 513,246.9     | 0.01           | 136,157.94       | 0.18            | 5,473.51          | yjs       |
| crud     | append / batch after deleted tail                       | 5,000 | 25,000 | 0.01         | 190,176.4      | 0         | 648,341.93    | 0.01           | 151,357.74       | 0.18            | 5,479.44          | yjs       |
| crud     | append / batch after garbage collection                 | 5,000 | 25,000 | 0.01         | 159,754.31     | 0         | 651,727.34    | 0.01           | 144,604.96       | 0.18            | 5,525.3           | yjs       |
| crud     | prepend / single before head                            | 5,000 | 250    | 0.01         | 94,855.06      | 0.02      | 58,468.59     | 0.01           | 96,094.71        | 2.33            | 428.46            | json-joy  |
| crud     | prepend / batch before head                             | 5,000 | 25,000 | 0.01         | 176,953.07     | 0         | 786,388.56    | 0.01           | 176,705.42       | 0.19            | 5,387.88          | yjs       |
| crud     | prepend / batch before deleted head                     | 5,000 | 25,000 | 0            | 200,634.16     | 0         | 855,382.24    | 0.01           | 165,318.66       | 0.19            | 5,394.78          | yjs       |
| crud     | prepend / batch after garbage collection                | 5,000 | 25,000 | 0.01         | 194,057.64     | 0         | 807,410.09    | 0.01           | 196,340.68       | 0.18            | 5,585.56          | yjs       |
| crud     | insert / single before head                             | 5,000 | 250    | 0.01         | 147,771.6      | 0.01      | 68,605.93     | 0.03           | 30,071.57        | 2               | 500.85            | crlist    |
| crud     | insert / single after head                              | 5,000 | 250    | 0.01         | 119,127.04     | 0.02      | 61,499.1      | 0.04           | 24,650.7         | 1.83            | 546.12            | crlist    |
| crud     | insert / single before middle                           | 5,000 | 250    | 0.01         | 97,102.46      | 0.02      | 53,290.13     | 0.04           | 28,494.25        | 1.79            | 557.48            | crlist    |
| crud     | insert / single after middle                            | 5,000 | 250    | 0.01         | 121,951.22     | 0.02      | 54,051.72     | 0.03           | 29,286.69        | 1.88            | 531               | crlist    |
| crud     | insert / single before tail                             | 5,000 | 250    | 0.01         | 112,425.24     | 0.02      | 54,508.98     | 0.03           | 29,518.03        | 1.73            | 577.77            | crlist    |
| crud     | insert / single after tail                              | 5,000 | 250    | 0.01         | 155,627.49     | 0.03      | 33,473.92     | 0.03           | 30,653.78        | 1.99            | 501.75            | crlist    |
| crud     | insert / batch before head                              | 5,000 | 25,000 | 0.01         | 176,188.73     | 0         | 872,350.67    | 0.01           | 150,783.26       | 0.2             | 4,911.82          | yjs       |
| crud     | insert / batch after head                               | 5,000 | 25,000 | 0.01         | 171,166.64     | 0         | 852,102.31    | 0.01           | 162,386.17       | 0.19            | 5,266.5           | yjs       |
| crud     | insert / batch before middle                            | 5,000 | 25,000 | 0.01         | 165,358.35     | 0         | 871,836.54    | 0.01           | 162,944.26       | 0.19            | 5,274.54          | yjs       |
| crud     | insert / batch after middle                             | 5,000 | 25,000 | 0.01         | 168,860.84     | 0         | 807,751.83    | 0.01           | 168,022.04       | 0.18            | 5,413.5           | yjs       |
| crud     | insert / batch before tail                              | 5,000 | 25,000 | 0.02         | 61,010.34      | 0         | 728,395.78    | 0.01           | 148,400.27       | 0.19            | 5,287.53          | yjs       |
| crud     | insert / batch after tail                               | 5,000 | 25,000 | 0.01         | 194,448.12     | 0         | 536,783.64    | 0.01           | 152,483.56       | 0.19            | 5,369.13          | yjs       |
| crud     | insert / repeated before head                           | 5,000 | 250    | 0.01         | 194,204.93     | 0.01      | 96,183.44     | 0.04           | 24,909.83        | 2.01            | 498.14            | crlist    |
| crud     | insert / repeated before middle                         | 5,000 | 250    | 0.01         | 128,126.28     | 0.01      | 67,791.09     | 0.03           | 29,530.58        | 1.89            | 528.18            | crlist    |
| crud     | insert / repeated before tail                           | 5,000 | 250    | 0.01         | 127,968.88     | 0.01      | 75,907.09     | 0.04           | 24,905.11        | 1.72            | 580.01            | crlist    |
| crud     | insert / random positions                               | 5,000 | 250    | 0.01         | 120,580.72     | 0.03      | 33,253.08     | 0.08           | 12,767.67        | 1.81            | 553.16            | crlist    |
| crud     | insert / alternating head and tail                      | 5,000 | 250    | 0.06         | 17,932.33      | 0.01      | 91,464.53     | 0.01           | 123,341.06       | 1.96            | 510.41            | json-joy  |
| crud     | overwrite / head                                        | 5,000 | 250    | 0.01         | 102,153.39     | 0.03      | 33,969.7      | 0.02           | 59,577.71        | 1.97            | 506.54            | crlist    |
| crud     | overwrite / middle                                      | 5,000 | 250    | 0.01         | 142,775.56     | 0.02      | 48,112.08     | 0.01           | 107,624.09       | 1.83            | 546.19            | crlist    |
| crud     | overwrite / tail                                        | 5,000 | 250    | 0.01         | 145,298.15     | 0.02      | 51,162.41     | 0.01           | 106,997.65       | 2.04            | 489.53            | crlist    |
| crud     | overwrite / random                                      | 5,000 | 250    | 0.01         | 124,663.41     | 0.03      | 32,088.72     | 0.01           | 85,005.1         | 2.17            | 460.54            | crlist    |
| crud     | overwrite / same head repeatedly                        | 5,000 | 250    | 0.01         | 140,734.07     | 0.02      | 56,175.99     | 0.01           | 119,286.19       | 1.92            | 519.77            | crlist    |
| crud     | overwrite / same middle repeatedly                      | 5,000 | 250    | 0.01         | 144,416.84     | 0.02      | 45,495.91     | 0.01           | 116,893.44       | 2.21            | 452.71            | crlist    |
| crud     | overwrite / same tail repeatedly                        | 5,000 | 250    | 0.01         | 169,376.69     | 0.02      | 49,885.26     | 0.03           | 30,478.14        | 1.86            | 537.32            | crlist    |
| crud     | overwrite / random visible entries                      | 5,000 | 250    | 0.01         | 147,727.94     | 0.04      | 28,061.2      | 0.04           | 25,107.46        | 2.22            | 449.76            | crlist    |
| crud     | overwrite / after insert                                | 5,000 | 250    | 0.01         | 143,135.23     | 0.02      | 49,750.25     | 0.01           | 106,705.37       | 1.97            | 508               | crlist    |
| crud     | overwrite / after delete                                | 5,000 | 250    | 0.01         | 149,316.13     | 0.02      | 52,972.84     | 0.01           | 110,360.66       | 2.02            | 494.49            | crlist    |
| crud     | delete / head                                           | 5,000 | 250    | 0.01         | 145,577.36     | 0.02      | 64,718.22     | 0.02           | 40,927.92        | 0.26            | 3,875.37          | crlist    |
| crud     | delete / middle                                         | 5,000 | 250    | 0.01         | 140,710.31     | 0.01      | 74,133.38     | 0.03           | 29,186.17        | 0.37            | 2,715.63          | crlist    |
| crud     | delete / tail                                           | 5,000 | 250    | 0            | 682,687.06     | 0.02      | 57,413.19     | 0              | 243,997.66       | 0.42            | 2,384.17          | crlist    |
| crud     | delete / range from head                                | 5,000 | 5,000  | 0            | 2,053,135.14   | 0         | 9,663,703.13  | 0              | 336,068.93       | 0.01            | 71,086.24         | yjs       |
| crud     | delete / range from middle                              | 5,000 | 5,000  | 0            | 1,237,164.42   | 0         | 7,447,125.41  | 0              | 268,825.88       | 0.02            | 60,890.21         | yjs       |
| crud     | delete / range from tail                                | 5,000 | 5,000  | 0            | 1,143,301.4    | 0         | 9,286,775.63  | 0              | 281,362.02       | 0.02            | 65,598.55         | yjs       |
| crud     | delete / every other entry                              | 5,000 | 2,500  | 0.01         | 99,794.03      | 0.09      | 11,680.81     | 0.09           | 11,426.05        | 0.3             | 3,339.03          | crlist    |
| crud     | delete / all entries from head one by one               | 5,000 | 5,000  | 0.01         | 152,803.8      | 0.01      | 93,210.37     | 0.01           | 110,600.38       | 0.21            | 4,690.8           | crlist    |
| crud     | delete / all entries from middle outward                | 5,000 | 5,000  | 0.01         | 124,096.88     | 0.01      | 101,689.06    | 0.01           | 161,066.39       | 0.22            | 4,644.26          | json-joy  |
| crud     | delete / all entries from tail one by one               | 5,000 | 5,000  | 0            | 515,591.49     | 0.01      | 93,614.55     | 0.01           | 157,521          | 0.21            | 4,774             | crlist    |
| crud     | delete / all entries in random order                    | 5,000 | 5,000  | 0.15         | 6,731.05       | 12.69     | 78.8          | 8.59           | 116.41           | 0.26            | 3,838.57          | crlist    |
| crud     | delete / already deleted head                           | 5,000 | 250    | 0            | 553,587.25     | 0         | 271,650.55    | 0              | 553,464.69       | 0.03            | 38,951.12         | crlist    |
| crud     | delete / already deleted middle                         | 5,000 | 250    | 0            | 651,211.25     | 0         | 313,087.04    | 0              | 1,162,790.7      | 0.02            | 44,227.44         | json-joy  |
| crud     | delete / already deleted tail                           | 5,000 | 250    | 0            | 1,558,603.49   | 0         | 251,610.31    | 0              | 1,147,842.06     | 0.03            | 36,998.12         | crlist    |
| crud     | mixed / append overwrite delete tail                    | 5,000 | 250    | 0.01         | 137,589.43     | 0.03      | 35,264.41     | 0.01           | 107,921.43       | 1.7             | 587.74            | crlist    |
| crud     | mixed / prepend overwrite delete head                   | 5,000 | 250    | 0.01         | 157,937.96     | 0.02      | 49,040.76     | 0.01           | 110,214.7        | 1.8             | 554.5             | crlist    |
| crud     | mixed / insert overwrite delete middle                  | 5,000 | 250    | 0.01         | 141,876.17     | 0.02      | 59,181.4      | 0.01           | 125,413.87       | 1.61            | 622.06            | crlist    |
| crud     | mixed / append prepend insert overwrite delete          | 5,000 | 250    | 0.01         | 161,061.72     | 0.01      | 67,112.29     | 0.01           | 134,894.51       | 1.61            | 621.79            | crlist    |
| mags     | snapshot                                                | 5,000 | 250    | 0.21         | 4,857.15       | 3.76      | 265.74        | 7.56           | 132.27           | 15.23           | 65.64             | crlist    |
| mags     | snapshot / clean state                                  | 5,000 | 250    | 0.24         | 4,209.09       | 3.61      | 277.3         | 7.11           | 140.68           | 15.01           | 66.62             | crlist    |
| mags     | snapshot / tombstoned state 50% deleted                 | 5,000 | 250    | 0.14         | 7,392.6        | 1.92      | 520.85        | 3.17           | 315.66           | 15.3            | 65.34             | crlist    |
| mags     | snapshot / tombstoned state 90% deleted                 | 5,000 | 250    | 0.06         | 16,613.06      | 0.4       | 2,526.89      | 0.52           | 1,912.1          | 16.33           | 61.23             | crlist    |
| mags     | snapshot / after garbage collection                     | 5,000 | 250    | 0.13         | 7,854.72       | 2.08      | 481.59        | 3.31           | 301.81           | 18.73           | 53.4              | crlist    |
| mags     | acknowledge                                             | 5,000 | 250    | 0            | 1,962,323.39   | n/a       | n/a           | n/a            | n/a              | n/a             | n/a               | n/a       |
| mags     | acknowledge / clean state                               | 5,000 | 250    | 0            | 7,440,476.19   | n/a       | n/a           | n/a            | n/a              | n/a             | n/a               | n/a       |
| mags     | acknowledge / 50% deleted state                         | 5,000 | 250    | 0.05         | 21,514.44      | n/a       | n/a           | n/a            | n/a              | n/a             | n/a               | n/a       |
| mags     | acknowledge / 90% deleted state                         | 5,000 | 250    | 0.07         | 13,517.75      | n/a       | n/a           | n/a            | n/a              | n/a             | n/a               | n/a       |
| mags     | garbage collect                                         | 5,000 | 250    | 0            | 1,098,901.1    | n/a       | n/a           | n/a            | n/a              | n/a             | n/a               | n/a       |
| mags     | garbage collect / no eligible tombstones                | 5,000 | 250    | 0            | 4,911,591.36   | n/a       | n/a           | n/a            | n/a              | n/a             | n/a               | n/a       |
| mags     | garbage collect / 50% eligible tombstones               | 5,000 | 250    | 0            | 817,527.8      | n/a       | n/a           | n/a            | n/a              | n/a             | n/a               | n/a       |
| mags     | garbage collect / 90% eligible tombstones               | 5,000 | 250    | 0            | 542,770.3      | n/a       | n/a           | n/a            | n/a              | n/a             | n/a               | n/a       |
| mags     | garbage collect / partial frontiers 2 replicas          | 5,000 | 250    | 0            | 5,353,319.06   | n/a       | n/a           | n/a            | n/a              | n/a             | n/a               | n/a       |
| mags     | garbage collect / partial frontiers 10 replicas         | 5,000 | 250    | 0            | 6,756,756.76   | n/a       | n/a           | n/a            | n/a              | n/a             | n/a               | n/a       |
| mags     | post-gc read / full iteration visible values            | 5,000 | 250    | 0.35         | 2,817.63       | 0.12      | 8,387.69      | 0.62           | 1,620.32         | 0.04            | 23,407.8          | automerge |
| mags     | merge ordered deltas                                    | 5,000 | 250    | 0.04         | 27,602.96      | 0.02      | 52,840.72     | 0.01           | 194,039.12       | 4.27            | 234.1             | json-joy  |
| mags     | merge shuffled gossip                                   | 5,000 | 250    | 0.83         | 1,201.49       | 1.2       | 830.64        | n/a            | n/a              | 1.21            | 823.6             | crlist    |
| mags     | merge / append head delta into equal replica            | 5,000 | 1      | 0.16         | 6,377.55       | 0.1       | 10,020.04     | 0.04           | 22,624.43        | 4.48            | 223.21            | json-joy  |
| mags     | merge / append tail delta into equal replica            | 5,000 | 1      | 0.04         | 27,700.83      | 0.05      | 20,449.9      | 0.01           | 91,743.12        | 4.19            | 238.41            | json-joy  |
| mags     | merge / prepend head delta into equal replica           | 5,000 | 1      | 0.19         | 5,399.57       | 0.05      | 18,214.94     | 0.01           | 101,010.1        | 6.89            | 145.2             | json-joy  |
| mags     | merge / insert middle delta into equal replica          | 5,000 | 1      | 0.07         | 13,661.2       | 0.09      | 11,587.49     | 0.01           | 69,930.07        | 3.95            | 253.23            | json-joy  |
| mags     | merge / overwrite head delta into equal replica         | 5,000 | 1      | 0.27         | 3,725.78       | 0.08      | 12,315.27     | 0.01           | 79,365.08        | 7.6             | 131.52            | json-joy  |
| mags     | merge / overwrite middle delta into equal replica       | 5,000 | 1      | 0.08         | 12,224.94      | 0.09      | 11,086.47     | 0.03           | 31,948.88        | 4.77            | 209.61            | json-joy  |
| mags     | merge / overwrite tail delta into equal replica         | 5,000 | 1      | 0.03         | 32,679.74      | 0.05      | 19,607.84     | 0.01           | 75,757.58        | 4.33            | 230.98            | json-joy  |
| mags     | merge / delete head delta into equal replica            | 5,000 | 1      | 0.22         | 4,452.36       | 0.02      | 41,322.31     | 0.02           | 47,846.89        | 2.87            | 348.71            | json-joy  |
| mags     | merge / delete middle delta into equal replica          | 5,000 | 1      | 0.08         | 11,820.33      | 0.11      | 8,726         | 0.09           | 11,376.56        | 2.57            | 389.85            | crlist    |
| mags     | merge / delete tail delta into equal replica            | 5,000 | 1      | 0.03         | 39,215.69      | 0.03      | 33,783.78     | 0.02           | 59,171.6         | 3.92            | 255.05            | json-joy  |
| mags     | merge / duplicate delta ignored                         | 5,000 | 250    | 0            | 797,193.88     | 0.03      | 30,592.27     | 0.01           | 117,200.32       | 0.06            | 17,842.61         | crlist    |
| mags     | merge / old delta ignored after merge                   | 5,000 | 250    | 0            | 1,110,124.33   | 0.03      | 31,404.67     | 0              | 265,872.59       | 0.05            | 21,608.17         | crlist    |
| mags     | merge / ordered 1,000 append deltas                     | 5,000 | 1,000  | 0            | 285,347.41     | 0.03      | 37,949.94     | 0.02           | 46,652.02        | 4.64            | 215.48            | crlist    |
| mags     | merge / ordered 1,000 prepend deltas                    | 5,000 | 1,000  | 0.06         | 16,296.73      | 0.01      | 77,665.08     | 0.01           | 77,695.25        | 3.83            | 261.34            | json-joy  |
| mags     | merge / ordered 1,000 middle insert deltas              | 5,000 | 1,000  | 0.02         | 52,340.67      | 0.01      | 77,309.03     | 0              | 267,494.12       | 3.62            | 276.47            | json-joy  |
| mags     | merge / shuffled 1,000 mixed deltas                     | 5,000 | 1,000  | 0.69         | 1,453.7        | 1.5       | 665.66        | n/a            | n/a              | 0.88            | 1,142.69          | crlist    |
| mags     | merge / reverse ordered 1,000 mixed deltas              | 5,000 | 1,000  | 0.22         | 4,494.57       | 1.3       | 766.59        | n/a            | n/a              | 0.88            | 1,138.32          | crlist    |
| mags     | merge / concurrent prepends same head                   | 5,000 | 2      | 1.11         | 903.06         | 0.1       | 10,346.61     | n/a            | n/a              | 10.18           | 98.22             | yjs       |
| mags     | merge / concurrent appends same tail                    | 5,000 | 2      | 0.04         | 23,391.81      | 0.05      | 21,786.49     | n/a            | n/a              | 8.58            | 116.53            | crlist    |
| mags     | merge / concurrent inserts same middle position         | 5,000 | 2      | 1.29         | 778.06         | 0.04      | 22,857.14     | n/a            | n/a              | 11.54           | 86.64             | yjs       |
| mags     | merge / concurrent overwrites same head                 | 5,000 | 2      | 4.97         | 201.04         | 0.09      | 10,989.01     | n/a            | n/a              | 15.38           | 65.01             | yjs       |
| mags     | merge / concurrent overwrites same middle               | 5,000 | 2      | 1.05         | 949.58         | 0.05      | 21,953.9      | n/a            | n/a              | 11.91           | 83.93             | yjs       |
| mags     | merge / concurrent overwrites same tail                 | 5,000 | 2      | 0.03         | 31,746.03      | 1.56      | 639.45        | n/a            | n/a              | 10.25           | 97.59             | crlist    |
| mags     | merge / concurrent deletes same head                    | 5,000 | 2      | 1.3          | 767.34         | 0.02      | 41,928.72     | 0.02           | 47,281.32        | 12.11           | 82.6              | json-joy  |
| mags     | merge / concurrent deletes same middle                  | 5,000 | 2      | 0.93         | 1,076.6        | 0.03      | 33,388.98     | 0.02           | 53,908.36        | 6.09            | 164.24            | json-joy  |
| mags     | merge / concurrent deletes same tail                    | 5,000 | 2      | 0.02         | 45,351.47      | 0.03      | 32,362.46     | 0.01           | 69,686.41        | 5.62            | 177.95            | json-joy  |
| mags     | merge / concurrent overwrite delete same entry          | 5,000 | 2      | 1.18         | 845.2          | 0.1       | 10,362.69     | 0.06           | 16,750.42        | 7.09            | 141.06            | json-joy  |
| mags     | merge / forked replicas rejoin after 250 ops each       | 5,000 | 500    | 0.01         | 80,123.07      | 0.01      | 73,789.85     | n/a            | n/a              | 3.21            | 311.93            | crlist    |
| mags     | merge / 10 replicas gossip convergence                  | 5,000 | 100    | 0.01         | 146,584.58     | 0.01      | 69,793.41     | n/a            | n/a              | 6.61            | 151.22            | crlist    |
| mags     | merge / snapshot merge into stale replica               | 5,000 | 5,350  | 0            | 1,078,042.19   | 0         | 431,967.19    | 0              | 237,533.91       | 0.03            | 30,275.18         | crlist    |
| class    | constructor / hydrate snapshot                          | 5,000 | 250    | 3.52         | 283.85         | 7.49      | 133.45        | 18.35          | 54.49            | 173.8           | 5.75              | crlist    |
| class    | read / head                                             | 5,000 | 250    | 0            | 1,006,846.56   | 0         | 4,664,179.1   | 0              | 1,143,641.35     | 0               | 2,645,502.65      | yjs       |
| class    | read / middle                                           | 5,000 | 250    | 0            | 1,568,381.43   | 0         | 14,285,714.29 | 0              | 3,639,010.19     | 0               | 10,593,220.34     | yjs       |
| class    | read / tail                                             | 5,000 | 250    | 0            | 2,665,245.2    | 0         | 15,337,423.31 | 0              | 3,725,782.41     | 0               | 11,792,452.83     | yjs       |
| class    | find near head                                          | 5,000 | 250    | 0            | 701,262.27     | 0         | 2,735,229.76  | 0              | 796,178.34       | 0               | 1,349,892.01      | yjs       |
| class    | find near middle                                        | 5,000 | 250    | 1.13         | 882.35         | 0.09      | 10,603.69     | 0.84           | 1,197.5          | 0.01            | 75,063.8          | automerge |
| class    | find near tail                                          | 5,000 | 250    | 2.27         | 441.29         | 0.17      | 5,860.29      | 1.52           | 657.06           | 0.02            | 52,515.49         | automerge |
| class    | iterate visible values                                  | 5,000 | 250    | 0.11         | 9,183.51       | 0.24      | 4,123.43      | 1.69           | 591.03           | 0.07            | 13,556.6          | automerge |
| class    | collect visible values to array                         | 5,000 | 250    | 0.1          | 10,147.09      | 0.25      | 4,040.8       | 1.67           | 598.55           | 0.07            | 13,687.38         | automerge |
| class    | append / single after tail                              | 5,000 | 250    | 0.01         | 115,692.54     | 0.02      | 41,840.3      | 0.03           | 38,495.89        | 2.01            | 496.39            | crlist    |
| class    | append / batch after tail                               | 5,000 | 25,000 | 0.01         | 143,175.48     | 0         | 539,804.07    | 0.01           | 135,756.98       | 0.18            | 5,446.42          | yjs       |
| class    | prepend / single before head                            | 5,000 | 250    | 0.01         | 118,320.79     | 0.01      | 69,438.66     | 0.01           | 134,177.76       | 1.88            | 531.23            | json-joy  |
| class    | prepend / batch before head                             | 5,000 | 25,000 | 0.01         | 133,435.88     | 0         | 742,302.32    | 0.01           | 187,659.37       | 0.18            | 5,433.94          | yjs       |
| class    | insert / single before middle                           | 5,000 | 250    | 0.01         | 104,049.61     | 0.01      | 68,298.55     | 0.01           | 164,128.15       | 1.89            | 529.24            | json-joy  |
| class    | insert / batch before middle                            | 5,000 | 25,000 | 0.01         | 132,576.13     | 0         | 813,465.79    | 0.01           | 192,302.51       | 0.19            | 5,329             | yjs       |
| class    | overwrite / head                                        | 5,000 | 250    | 0.01         | 97,618.12      | 0.02      | 49,777.99     | 0.01           | 128,965.7        | 2.05            | 487.92            | json-joy  |
| class    | overwrite / middle                                      | 5,000 | 250    | 0.01         | 110,424.03     | 0.02      | 43,057.42     | 0.01           | 121,672.26       | 2               | 499.01            | json-joy  |
| class    | overwrite / tail                                        | 5,000 | 250    | 0.01         | 121,548.04     | 0.02      | 55,580.26     | 0.05           | 20,154.3         | 1.95            | 513.93            | crlist    |
| class    | overwrite / random                                      | 5,000 | 250    | 0.01         | 107,245.51     | 0.04      | 22,578.66     | 0.01           | 107,476.03       | 2.18            | 459.49            | json-joy  |
| class    | remove / head                                           | 5,000 | 250    | 0.01         | 119,434.36     | 0.02      | 47,323.39     | 0.02           | 42,784.78        | 0.28            | 3,618.16          | crlist    |
| class    | remove / middle                                         | 5,000 | 250    | 0.01         | 138,213.18     | 0.02      | 59,966.42     | 0.03           | 31,454.06        | 0.26            | 3,873.87          | crlist    |
| class    | remove / tail                                           | 5,000 | 250    | 0            | 476,009.14     | 0.02      | 57,540.05     | 0              | 254,323.5        | 0.32            | 3,166.85          | crlist    |
| class    | remove / range from head                                | 5,000 | 5,000  | 0            | 2,100,310.85   | 0         | 8,085,381.63  | 0              | 344,910.84       | 0.02            | 62,901.63         | yjs       |
| class    | remove / range from middle                              | 5,000 | 5,000  | 0            | 1,524,855.14   | 0         | 6,845,564.07  | 0              | 306,921.7        | 0.02            | 50,705.47         | yjs       |
| class    | remove / range from tail                                | 5,000 | 5,000  | 0            | 1,580,328.08   | 0         | 6,183,527.08  | 0              | 338,735.03       | 0.02            | 63,003.64         | yjs       |
| class    | mixed / append overwrite remove tail                    | 5,000 | 250    | 0.01         | 125,382.42     | 0.03      | 35,418.29     | 0.03           | 31,038.16        | 1.51            | 663.87            | crlist    |
| class    | mixed / prepend overwrite remove head                   | 5,000 | 250    | 0.01         | 118,153.03     | 0.02      | 66,255        | 0.03           | 30,464.03        | 1.48            | 673.87            | crlist    |
| class    | mixed / insert overwrite remove middle                  | 5,000 | 250    | 0.03         | 39,362.02      | 0.02      | 44,027.26     | 0.01           | 166,046.76       | 1.48            | 676.3             | json-joy  |
| class    | paste / insert 10,000 entries at cursor                 | 5,000 | 10,000 | 0.02         | 56,265.85      | 0         | 798,734.8     | 0.01           | 105,814.62       | 0.17            | 5,839.69          | yjs       |
| class    | render / join visible entries to string                 | 5,000 | 250    | 0.21         | 4,739.48       | 0.38      | 2,634.25      | 2.3            | 434.01           | 0.18            | 5,607.61          | automerge |
| class    | snapshot                                                | 5,000 | 250    | 0.25         | 3,938.23       | 3.81      | 262.42        | 8.56           | 116.83           | 15.23           | 65.67             | crlist    |
| class    | snapshot / tombstoned state 50% deleted                 | 5,000 | 250    | 0.13         | 7,863.27       | 1.94      | 516.41        | 3.82           | 261.67           | 15.35           | 65.14             | crlist    |
| class    | snapshot / after garbage collection                     | 5,000 | 250    | 0.11         | 9,115.4        | 0.24      | 4,253.87      | 2.46           | 405.97           | 0.07            | 14,637.43         | automerge |
| class    | acknowledge                                             | 5,000 | 250    | 0.05         | 19,395.18      | n/a       | n/a           | n/a            | n/a              | n/a             | n/a               | n/a       |
| class    | acknowledge / 50% deleted state                         | 5,000 | 250    | 0.04         | 23,490.94      | n/a       | n/a           | n/a            | n/a              | n/a             | n/a               | n/a       |
| class    | acknowledge / 90% deleted state                         | 5,000 | 250    | 0.09         | 10,676.78      | n/a       | n/a           | n/a            | n/a              | n/a             | n/a               | n/a       |
| class    | garbage collect                                         | 5,000 | 250    | 0.12         | 8,038.15       | 0.24      | 4,114.77      | 2.18           | 459.18           | 0.08            | 12,906.82         | automerge |
| class    | garbage collect / no eligible tombstones                | 5,000 | 250    | 0.11         | 9,115.9        | 0.24      | 4,163.61      | 1.8            | 555.29           | 0.08            | 12,905.02         | automerge |
| class    | garbage collect / 90% eligible tombstones               | 5,000 | 250    | 0.1          | 9,931          | 0.24      | 4,114.1       | 1.79           | 558.63           | 0.08            | 12,873.86         | automerge |
| class    | merge ordered deltas                                    | 5,000 | 250    | 0.03         | 39,437.15      | 0.01      | 91,227.56     | 0              | 241,010.32       | 3.08            | 324.96            | json-joy  |
| class    | merge shuffled gossip                                   | 5,000 | 250    | 0.59         | 1,685.35       | 0.37      | 2,732.91      | n/a            | n/a              | 0.73            | 1,368.79          | yjs       |
| class    | merge / duplicate delta ignored                         | 5,000 | 250    | 0            | 1,067,008.11   | 0.03      | 36,073.99     | 0              | 303,508.56       | 0.04            | 28,209.38         | crlist    |
| class    | merge / concurrent prepends same head                   | 5,000 | 2      | 0.92         | 1,085.48       | 0.09      | 11,587.49     | n/a            | n/a              | 11.26           | 88.85             | yjs       |
| class    | merge / concurrent appends same tail                    | 5,000 | 2      | 0.02         | 46,838.41      | 0.03      | 34,662.05     | n/a            | n/a              | 11.79           | 84.85             | crlist    |
| class    | merge / concurrent inserts same middle position         | 5,000 | 2      | 3.63         | 275.12         | 0.04      | 22,988.51     | n/a            | n/a              | 12.04           | 83.09             | yjs       |
| class    | merge / forked replicas rejoin after 250 ops each       | 5,000 | 500    | 0.57         | 1,758.86       | 0.01      | 72,355.76     | n/a            | n/a              | 3.31            | 302.33            | yjs       |
| latency  | append tail write to remote visible                     | 5,000 | 250    | 0.53         | 1,879.59       | 0.24      | 4,092.45      | 10.69          | 93.55            | 5.76            | 173.67            | yjs       |
| latency  | prepend head write to remote visible                    | 5,000 | 250    | 0.06         | 17,201.76      | 0.03      | 30,175.74     | 0.02           | 62,362.8         | 5.79            | 172.86            | json-joy  |
| latency  | middle insert write to remote visible                   | 5,000 | 250    | 0.35         | 2,830.75       | 0.15      | 6,868.17      | 3.8            | 263.01           | 5.81            | 172.11            | yjs       |
| latency  | head insert write to remote visible                     | 5,000 | 250    | 0.06         | 16,834         | 0.03      | 39,660.51     | 0.02           | 57,680.77        | 5.72            | 174.82            | json-joy  |
| latency  | overwrite head write to remote visible                  | 5,000 | 250    | 0.09         | 11,468.36      | 0.04      | 26,553.65     | 0.05           | 18,399.13        | 5.81            | 172.2             | yjs       |
| latency  | overwrite middle write to remote visible                | 5,000 | 250    | 0.32         | 3,149.7        | 0.13      | 7,645.61      | 2.61           | 383.16           | 5.79            | 172.65            | yjs       |
| latency  | overwrite tail write to remote visible                  | 5,000 | 250    | 0.64         | 1,566.39       | 0.22      | 4,513.64      | 5.45           | 183.56           | 5.59            | 178.88            | yjs       |
| latency  | head delete to remote hidden                            | 5,000 | 250    | 0.69         | 1,451.88       | 0.24      | 4,193.82      | 5.44           | 183.69           | 2.24            | 445.93            | yjs       |
| latency  | middle delete to remote hidden                          | 5,000 | 250    | 0.67         | 1,493.13       | 0.24      | 4,234.32      | 5.41           | 184.77           | 2.13            | 468.43            | yjs       |
| latency  | tail delete to remote hidden                            | 5,000 | 250    | 0.32         | 3,170.52       | 0.2       | 4,879.53      | 5.39           | 185.52           | 2.22            | 449.58            | yjs       |
| latency  | append tail write to 10 remotes visible                 | 5,000 | 2,500  | 0.44         | 2,256.56       | 0.21      | 4,826.87      | 11.64          | 85.91            | 3.84            | 260.35            | yjs       |
| latency  | prepend head write to 10 remotes visible                | 5,000 | 2,500  | 0.07         | 14,808.32      | 0.01      | 92,943.71     | 0.01           | 74,880.34        | 3.87            | 258.53            | yjs       |
| latency  | middle insert write to 10 remotes visible               | 5,000 | 2,500  | 0.33         | 2,992.98       | 0.11      | 8,906.32      | 4.58           | 218.17           | 3.91            | 255.61            | yjs       |
| latency  | overwrite middle write to 10 remotes visible            | 5,000 | 2,500  | 0.32         | 3,168.46       | 0.12      | 8,691.01      | 3.28           | 305.24           | 3.97            | 252.13            | yjs       |
| latency  | delete middle to 10 remotes hidden                      | 5,000 | 2,500  | 0.64         | 1,560.1        | 0.23      | 4,262.44      | 6.25           | 160.07           | 1.91            | 522.92            | yjs       |
| latency  | out-of-order write delivery to remote visible           | 5,000 | 250    | 1.42         | 703.23         | 73.09     | 13.68         | n/a            | n/a              | 15.7            | 63.7              | crlist    |
| latency  | out-of-order delete delivery to remote convergence      | 5,000 | 165    | 1.97         | 507.44         | 0.22      | 4,537.52      | 8.3            | 120.48           | 6.51            | 153.72            | yjs       |
| latency  | out-of-order append delivery to convergence             | 5,000 | 250    | 1.29         | 777.51         | 22.53     | 44.39         | n/a            | n/a              | 17.57           | 56.91             | crlist    |
| latency  | out-of-order prepend delivery to convergence            | 5,000 | 250    | 1.67         | 598.1          | 23.15     | 43.2          | 0.1            | 9,580.89         | 15.78           | 63.37             | json-joy  |
| latency  | out-of-order middle insert delivery to convergence      | 5,000 | 250    | 1.32         | 759.14         | 72.97     | 13.7          | n/a            | n/a              | 16.9            | 59.19             | crlist    |
| latency  | out-of-order overwrite delivery to convergence          | 5,000 | 129    | 1.85         | 539.35         | n/a       | n/a           | 245.73         | 4.07             | 75.68           | 13.21             | crlist    |
| latency  | offline burst 1,000 ops then sync                       | 5,000 | 1,000  | 0.02         | 57,744.39      | 0.03      | 37,036.21     | 0              | 233,715.85       | 3.25            | 308.02            | json-joy  |
| latency  | forked replicas mixed ops then converge                 | 5,000 | 500    | 0.01         | 105,683.67     | 0.01      | 120,360.12    | n/a            | n/a              | 3.34            | 299.05            | yjs       |
| latency  | duplicate shuffled gossip to convergence                | 5,000 | 500    | 0.29         | 3,433.78       | 0.2       | 4,927.97      | n/a            | n/a              | 0.43            | 2,348.4           | yjs       |
| latency  | remote snapshot hydrate then apply pending deltas       | 5,000 | 250    | 0.02         | 54,798.12      | 0.04      | 27,958.26     | 0.11           | 8,990.32         | 0.76            | 1,321.58          | crlist    |
| workload | local app session                                       | 5,000 | 250    | 0.01         | 81,645.98      | 0.01      | 77,908.32     | 0.03           | 28,999.63        | 1.2             | 833.09            | crlist    |
| workload | read heavy session                                      | 5,000 | 250    | 0            | 2,014,504.43   | 0         | 5,341,880.34  | 0              | 403,551.25       | 0               | 1,572,327.04      | yjs       |
| workload | write heavy session                                     | 5,000 | 250    | 0.01         | 77,976.36      | 0.01      | 88,121.25     | 0.01           | 156,926.75       | 1.19            | 839.61            | json-joy  |
| workload | append tail heavy session                               | 5,000 | 250    | 0            | 202,987.98     | 0.02      | 51,221.11     | 0.01           | 174,581.01       | 1.62            | 615.67            | crlist    |
| workload | prepend head heavy session                              | 5,000 | 250    | 0.01         | 66,769.94      | 0.01      | 101,820.55    | 0.01           | 143,818.67       | 1.6             | 626.42            | json-joy  |
| workload | insert middle heavy session                             | 5,000 | 250    | 0.02         | 66,629.35      | 0.01      | 83,836.35     | 0.01           | 156,995.73       | 1.62            | 616.11            | json-joy  |
| workload | overwrite heavy session                                 | 5,000 | 250    | 0.01         | 74,280.96      | 0.01      | 88,624.2      | 0.01           | 129,876.88       | 1.35            | 739.6             | json-joy  |
| workload | delete heavy session                                    | 5,000 | 250    | 0.01         | 108,370.54     | 0.01      | 97,469.69     | 0              | 224,860.59       | 0.29            | 3,436.44          | json-joy  |
| workload | balanced append prepend insert overwrite delete session | 5,000 | 250    | 0.02         | 64,871.04      | 0.01      | 84,200.6      | 0.01           | 175,685.17       | 1.56            | 639.19            | json-joy  |
| workload | random edit session                                     | 5,000 | 250    | 0.02         | 50,570.43      | 0.02      | 40,649.75     | 0.01           | 81,643.32        | 1.26            | 796.08            | json-joy  |
| workload | text editing session                                    | 5,000 | 250    | 0.01         | 73,125.07      | 0.02      | 61,300.05     | 0.01           | 156,828.3        | 1.65            | 605.76            | json-joy  |
| workload | collaborative offline session                           | 5,000 | 500    | 0.01         | 116,767.87     | 0.01      | 108,389.33    | n/a            | n/a              | 3.24            | 308.27            | crlist    |
| workload | sync and cleanup session                                | 5,000 | 252    | 0.01         | 89,311.03      | 0.01      | 75,608.65     | n/a            | n/a              | 3.28            | 305.26            | crlist    |
| workload | long lived tombstoned session                           | 5,000 | 250    | 0.01         | 150,602.41     | 0.01      | 79,126.44     | 0.01           | 130,391.7        | 1.78            | 560.84            | crlist    |
| workload | sparse visible session                                  | 5,000 | 250    | 0.01         | 130,958.62     | 0.12      | 8,035.9       | 0.01           | 73,041.75        | 1.05            | 951.54            | crlist    |
| workload | post-gc edit session                                    | 5,000 | 250    | 0.01         | 184,801.89     | 0.02      | 54,508.98     | 0.01           | 176,503.81       | 1.58            | 632.7             | crlist    |

## License

Apache-2.0
