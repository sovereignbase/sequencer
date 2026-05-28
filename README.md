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
| crud     | create / empty list                                     | 5,000 | 250    | 0.01         | 67,945.86      | 0.14      | 6,905.41      | 0.02           | 50,203.83        | 0.38            | 2,639.34          | crlist    |
| crud     | create / hydrate snapshot                               | 5,000 | 250    | 4.45         | 224.91         | 6.84      | 146.11        | 18.47          | 54.15            | 152.03          | 6.58              | crlist    |
| crud     | create / hydrate clean snapshot                         | 5,000 | 250    | 4.53         | 220.54         | 6.61      | 151.18        | 18.32          | 54.6             | 151.83          | 6.59              | crlist    |
| crud     | create / hydrate tombstoned snapshot                    | 5,000 | 250    | 2.37         | 422.08         | 3.44      | 290.58        | 8.97           | 111.5            | 160.6           | 6.23              | crlist    |
| crud     | read / head                                             | 5,000 | 250    | 0            | 1,322,051.82   | 0         | 891,265.6     | 0              | 245,362.65       | 0               | 3,546,099.29      | automerge |
| crud     | read / middle                                           | 5,000 | 250    | 0            | 6,596,306.07   | 0         | 2,085,070.89  | 0              | 710,429.1        | 0               | 8,389,261.74      | automerge |
| crud     | read / tail                                             | 5,000 | 250    | 0            | 6,377,551.02   | 0         | 2,216,312.06  | 0              | 667,913.44       | 0               | 9,090,909.09      | automerge |
| crud     | read / random indexed reads                             | 5,000 | 250    | 0            | 862,068.97     | 0         | 774,713.36    | 0.01           | 152,160.68       | 0               | 1,188,777.94      | automerge |
| crud     | read / sequential indexed reads from head               | 5,000 | 250    | 0            | 1,676,727.03   | 0         | 1,458,576.43  | 0              | 265,336.45       | 0               | 1,241,927.47      | crlist    |
| crud     | read / sequential indexed reads from middle             | 5,000 | 250    | 0            | 6,203,473.95   | 0         | 2,620,545.07  | 0.03           | 29,128.36        | 0               | 8,503,401.36      | automerge |
| crud     | read / sequential indexed reads from tail               | 5,000 | 250    | 0            | 4,798,464.49   | 0         | 2,645,502.65  | 0              | 303,582.27       | 0               | 7,331,378.3       | automerge |
| crud     | read / full iteration visible values                    | 5,000 | 250    | 0.51         | 1,968.29       | 0.23      | 4,427.94      | 1.81           | 551.66           | 0.07            | 14,251.84         | automerge |
| crud     | read / collect visible values to array                  | 5,000 | 250    | 0.62         | 1,620.18       | 0.19      | 5,189.46      | 1.91           | 522.52           | 0.08            | 11,869.89         | automerge |
| crud     | read / visible sparse over deleted entries              | 5,000 | 250    | 0            | 6,738,544.47   | 0.03      | 29,704.97     | 0.03           | 29,575.3         | 0               | 8,561,643.84      | automerge |
| crud     | find / head                                             | 5,000 | 250    | 0            | 1,469,723.69   | 0         | 2,246,181.49  | 0              | 607,238.28       | 0               | 1,558,603.49      | yjs       |
| crud     | find / middle                                           | 5,000 | 250    | 0.15         | 6,716.93       | 0.11      | 9,265.92      | 0.89           | 1,125.71         | 0.01            | 72,413.39         | automerge |
| crud     | find / tail                                             | 5,000 | 250    | 0.19         | 5,340.32       | 0.18      | 5,632.57      | 1.99           | 501.76           | 0.02            | 46,505.57         | automerge |
| crud     | find / missing value                                    | 5,000 | 250    | 0.2          | 4,970.29       | 0.19      | 5,330.37      | 1.79           | 558.41           | 0.03            | 33,466.75         | automerge |
| crud     | append / single after tail                              | 5,000 | 250    | 0.01         | 196,047.68     | 0.02      | 44,028.81     | 0.03           | 31,233.21        | 1.76            | 568.27            | crlist    |
| crud     | append / batch after tail                               | 5,000 | 25,000 | 0            | 1,280,658.98   | 0         | 540,200.65    | 0.01           | 146,570.06       | 0.18            | 5,548.38          | crlist    |
| crud     | append / batch after deleted tail                       | 5,000 | 25,000 | 0            | 1,512,090.68   | 0         | 520,715.09    | 0.01           | 134,121.68       | 0.18            | 5,576.15          | crlist    |
| crud     | append / batch after garbage collection                 | 5,000 | 25,000 | 0            | 1,476,851.82   | 0         | 718,221.57    | 0.01           | 160,390.99       | 0.18            | 5,613.09          | crlist    |
| crud     | prepend / single before head                            | 5,000 | 250    | 0            | 201,304.45     | 0.01      | 71,109.59     | 0.01           | 99,868.17        | 1.82            | 550.87            | crlist    |
| crud     | prepend / batch before head                             | 5,000 | 25,000 | 0            | 1,641,863.58   | 0         | 824,614.41    | 0.01           | 166,400.43       | 0.18            | 5,528.33          | crlist    |
| crud     | prepend / batch before deleted head                     | 5,000 | 25,000 | 0            | 1,582,889.6    | 0         | 900,777.55    | 0.01           | 190,205.19       | 0.18            | 5,495.74          | crlist    |
| crud     | prepend / batch after garbage collection                | 5,000 | 25,000 | 0            | 1,352,499.15   | 0         | 844,828.63    | 0.01           | 167,120.01       | 0.17            | 5,733.93          | crlist    |
| crud     | insert / single before head                             | 5,000 | 250    | 0            | 241,173.07     | 0.01      | 67,794.77     | 0.01           | 122,363.08       | 1.87            | 535.61            | crlist    |
| crud     | insert / single after head                              | 5,000 | 250    | 0.01         | 156,966.16     | 0.02      | 65,625.41     | 0.01           | 78,110.35        | 1.84            | 543.71            | crlist    |
| crud     | insert / single before middle                           | 5,000 | 250    | 0.01         | 159,469.29     | 0.02      | 63,861.85     | 0.01           | 119,388.73       | 1.77            | 565.42            | crlist    |
| crud     | insert / single after middle                            | 5,000 | 250    | 0.01         | 153,638.15     | 0.02      | 63,137.69     | 0.01           | 124,044.85       | 1.8             | 556.08            | crlist    |
| crud     | insert / single before tail                             | 5,000 | 250    | 0.01         | 152,383.27     | 0.02      | 51,963.17     | 0.01           | 135,486.67       | 1.7             | 588.79            | crlist    |
| crud     | insert / single after tail                              | 5,000 | 250    | 0.01         | 174,410.49     | 0.03      | 37,295.62     | 0.01           | 171,221.15       | 1.72            | 582.26            | crlist    |
| crud     | insert / batch before head                              | 5,000 | 25,000 | 0            | 1,406,351.08   | 0         | 900,764.57    | 0.01           | 175,589.54       | 0.18            | 5,472.17          | crlist    |
| crud     | insert / batch after head                               | 5,000 | 25,000 | 0            | 958,342.76     | 0         | 854,554.78    | 0.01           | 182,166.48       | 0.18            | 5,475.28          | crlist    |
| crud     | insert / batch before middle                            | 5,000 | 25,000 | 0            | 721,215.57     | 0         | 800,648.2     | 0.01           | 164,871.11       | 0.18            | 5,469.85          | yjs       |
| crud     | insert / batch after middle                             | 5,000 | 25,000 | 0            | 794,399.8      | 0         | 742,009.3     | 0.01           | 184,706.86       | 0.18            | 5,440.43          | crlist    |
| crud     | insert / batch before tail                              | 5,000 | 25,000 | 0            | 1,498,845.89   | 0         | 720,874.51    | 0.01           | 161,145.71       | 0.18            | 5,453.1           | crlist    |
| crud     | insert / batch after tail                               | 5,000 | 25,000 | 0            | 1,610,980.44   | 0         | 521,009.17    | 0.01           | 137,346.71       | 0.18            | 5,415.58          | crlist    |
| crud     | insert / repeated before head                           | 5,000 | 250    | 0            | 268,326.71     | 0.01      | 90,803.43     | 0.04           | 27,620.65        | 1.88            | 531.97            | crlist    |
| crud     | insert / repeated before middle                         | 5,000 | 250    | 0.01         | 163,580.45     | 0.01      | 67,675.48     | 0.04           | 27,892.45        | 1.79            | 558.24            | crlist    |
| crud     | insert / repeated before tail                           | 5,000 | 250    | 0.01         | 169,101.73     | 0.01      | 70,428.49     | 0.03           | 29,912.18        | 1.7             | 589.12            | crlist    |
| crud     | insert / random positions                               | 5,000 | 250    | 0            | 220,070.42     | 0.04      | 28,026.59     | 0.07           | 14,344.81        | 1.75            | 572.51            | crlist    |
| crud     | insert / alternating head and tail                      | 5,000 | 250    | 0            | 233,426.7      | 0.01      | 93,992.03     | 0.04           | 28,422.66        | 1.77            | 566.15            | crlist    |
| crud     | overwrite / head                                        | 5,000 | 250    | 0.01         | 121,607.16     | 0.03      | 30,689.53     | 0.03           | 36,569.49        | 1.96            | 510.18            | crlist    |
| crud     | overwrite / middle                                      | 5,000 | 250    | 0.01         | 145,053.67     | 0.02      | 50,565.32     | 0.01           | 108,084.74       | 1.93            | 518.63            | crlist    |
| crud     | overwrite / tail                                        | 5,000 | 250    | 0.01         | 185,915.07     | 0.02      | 46,647.01     | 0.04           | 27,146.18        | 1.85            | 541.44            | crlist    |
| crud     | overwrite / random                                      | 5,000 | 250    | 0.02         | 56,689.34      | 0.03      | 29,493.31     | 0.04           | 25,657.6         | 2.09            | 478.61            | crlist    |
| crud     | overwrite / same head repeatedly                        | 5,000 | 250    | 0.01         | 174,947.52     | 0.02      | 48,328.79     | 0.03           | 28,775.65        | 2.05            | 487.79            | crlist    |
| crud     | overwrite / same middle repeatedly                      | 5,000 | 250    | 0.01         | 149,880.1      | 0.02      | 42,028.81     | 0.04           | 28,205.24        | 1.84            | 542.29            | crlist    |
| crud     | overwrite / same tail repeatedly                        | 5,000 | 250    | 0.01         | 185,707.92     | 0.02      | 45,172.83     | 0.04           | 27,795.07        | 1.86            | 537.13            | crlist    |
| crud     | overwrite / random visible entries                      | 5,000 | 250    | 0.02         | 55,064.87      | 0.04      | 26,986.18     | 0.04           | 27,215.62        | 2.17            | 460.89            | crlist    |
| crud     | overwrite / after insert                                | 5,000 | 250    | 0.01         | 139,415.57     | 0.02      | 46,065.97     | 0.04           | 25,907.27        | 1.83            | 545.37            | crlist    |
| crud     | overwrite / after delete                                | 5,000 | 250    | 0.01         | 154,206.76     | 0.02      | 56,095.32     | 0.01           | 119,594.34       | 1.93            | 518.42            | crlist    |
| crud     | delete / head                                           | 5,000 | 250    | 0.01         | 191,277.74     | 0.02      | 64,406.43     | 0.02           | 41,449.75        | 0.27            | 3,765.31          | crlist    |
| crud     | delete / middle                                         | 5,000 | 250    | 0.01         | 193,993.95     | 0.01      | 67,816.84     | 0.03           | 29,702.5         | 0.27            | 3,691.48          | crlist    |
| crud     | delete / tail                                           | 5,000 | 250    | 0            | 452,324.95     | 0.02      | 60,366.06     | 0              | 257,360.51       | 0.25            | 3,987.11          | crlist    |
| crud     | delete / range from head                                | 5,000 | 5,000  | 0            | 1,197,977.81   | 0         | 9,543,806.07  | 0              | 339,858.62       | 0.01            | 73,052.85         | yjs       |
| crud     | delete / range from middle                              | 5,000 | 5,000  | 0            | 625,101.58     | 0         | 6,943,480.07  | 0              | 269,057.33       | 0.02            | 57,305.08         | yjs       |
| crud     | delete / range from tail                                | 5,000 | 5,000  | 0            | 726,828.7      | 0         | 9,219,988.94  | 0              | 286,123.03       | 0.02            | 63,076.44         | yjs       |
| crud     | delete / every other entry                              | 5,000 | 2,500  | 0            | 247,025.81     | 0.09      | 11,137.91     | 0.09           | 11,046.81        | 0.21            | 4,669.88          | crlist    |
| crud     | delete / all entries from head one by one               | 5,000 | 5,000  | 0            | 240,844.3      | 0.01      | 93,787.34     | 0.01           | 121,377.19       | 0.2             | 5,051.78          | crlist    |
| crud     | delete / all entries from middle outward                | 5,000 | 5,000  | 0.01         | 182,438.47     | 0.01      | 108,917.99    | 0.01           | 170,476.82       | 0.21            | 4,854.88          | crlist    |
| crud     | delete / all entries from tail one by one               | 5,000 | 5,000  | 0            | 518,569.99     | 0.01      | 100,070.65    | 0              | 241,664.98       | 0.2             | 4,919.29          | crlist    |
| crud     | delete / all entries in random order                    | 5,000 | 5,000  | 0.14         | 6,923.34       | 11.57     | 86.43         | 9.38           | 106.6            | 0.25            | 4,049.41          | crlist    |
| crud     | delete / already deleted head                           | 5,000 | 250    | 0            | 425,604.36     | 0         | 298,900.05    | 0              | 542,888.17       | 0.02            | 41,255.49         | json-joy  |
| crud     | delete / already deleted middle                         | 5,000 | 250    | 0            | 572,868.93     | 0         | 301,531.78    | 0              | 579,508.58       | 0.02            | 45,542.32         | json-joy  |
| crud     | delete / already deleted tail                           | 5,000 | 250    | 0            | 2,510,040.16   | 0         | 284,252.42    | 0              | 1,255,020.08     | 0.03            | 28,630.33         | crlist    |
| crud     | mixed / append overwrite delete tail                    | 5,000 | 250    | 0.01         | 192,218.98     | 0.03      | 32,529.63     | 0.01           | 107,670.44       | 1.72            | 580.27            | crlist    |
| crud     | mixed / prepend overwrite delete head                   | 5,000 | 250    | 0            | 252,729.48     | 0.02      | 66,017.06     | 0.01           | 106,791.97       | 1.65            | 607.07            | crlist    |
| crud     | mixed / insert overwrite delete middle                  | 5,000 | 250    | 0            | 227,396.76     | 0.02      | 63,088.3      | 0.01           | 122,946.79       | 1.59            | 628.26            | crlist    |
| crud     | mixed / append prepend insert overwrite delete          | 5,000 | 250    | 0            | 235,871.31     | 0.02      | 47,260.77     | 0.01           | 123,756.25       | 1.61            | 621.16            | crlist    |
| mags     | snapshot                                                | 5,000 | 250    | 0.27         | 3,720.64       | 3.71      | 269.36        | 7.72           | 129.56           | 14.53           | 68.84             | crlist    |
| mags     | snapshot / clean state                                  | 5,000 | 250    | 0.24         | 4,215.2        | 3.51      | 284.52        | 7.53           | 132.88           | 14.7            | 68.04             | crlist    |
| mags     | snapshot / tombstoned state 50% deleted                 | 5,000 | 250    | 0.15         | 6,844.29       | 1.71      | 586.24        | 3.21           | 311.62           | 14.75           | 67.78             | crlist    |
| mags     | snapshot / tombstoned state 90% deleted                 | 5,000 | 250    | 0.05         | 18,302.15      | 0.35      | 2,866.22      | 0.54           | 1,848.99         | 14.79           | 67.62             | crlist    |
| mags     | snapshot / after garbage collection                     | 5,000 | 250    | 0.11         | 8,948.77       | 1.72      | 580.94        | 3.06           | 327.01           | 14.72           | 67.93             | crlist    |
| mags     | acknowledge                                             | 5,000 | 250    | 0            | 1,839,587.93   | n/a       | n/a           | n/a            | n/a              | n/a             | n/a               | n/a       |
| mags     | acknowledge / clean state                               | 5,000 | 250    | 0            | 8,038,585.21   | n/a       | n/a           | n/a            | n/a              | n/a             | n/a               | n/a       |
| mags     | acknowledge / 50% deleted state                         | 5,000 | 250    | 0.5          | 1,980.6        | n/a       | n/a           | n/a            | n/a              | n/a             | n/a               | n/a       |
| mags     | acknowledge / 90% deleted state                         | 5,000 | 250    | 0.92         | 1,087.05       | n/a       | n/a           | n/a            | n/a              | n/a             | n/a               | n/a       |
| mags     | garbage collect                                         | 5,000 | 250    | 0            | 1,058,425.06   | n/a       | n/a           | n/a            | n/a              | n/a             | n/a               | n/a       |
| mags     | garbage collect / no eligible tombstones                | 5,000 | 250    | 0            | 5,494,505.49   | n/a       | n/a           | n/a            | n/a              | n/a             | n/a               | n/a       |
| mags     | garbage collect / 50% eligible tombstones               | 5,000 | 250    | 0            | 259,686.3      | n/a       | n/a           | n/a            | n/a              | n/a             | n/a               | n/a       |
| mags     | garbage collect / 90% eligible tombstones               | 5,000 | 250    | 0.01         | 162,116.59     | n/a       | n/a           | n/a            | n/a              | n/a             | n/a               | n/a       |
| mags     | garbage collect / partial frontiers 2 replicas          | 5,000 | 250    | 0            | 4,464,285.71   | n/a       | n/a           | n/a            | n/a              | n/a             | n/a               | n/a       |
| mags     | garbage collect / partial frontiers 10 replicas         | 5,000 | 250    | 0            | 5,020,080.32   | n/a       | n/a           | n/a            | n/a              | n/a             | n/a               | n/a       |
| mags     | post-gc read / full iteration visible values            | 5,000 | 250    | 0.22         | 4,538.57       | 0.11      | 8,767.01      | 0.59           | 1,696.82         | 0.03            | 32,693.41         | automerge |
| mags     | merge ordered deltas                                    | 5,000 | 250    | 0.01         | 103,365.58     | 0.02      | 60,694.34     | 0.03           | 38,821.68        | 3.02            | 331.17            | crlist    |
| mags     | merge shuffled gossip                                   | 5,000 | 250    | 0.9          | 1,105.82       | 0.61      | 1,646.07      | n/a            | n/a              | 0.73            | 1,377.94          | yjs       |
| mags     | merge / append head delta into equal replica            | 5,000 | 1      | 0.06         | 17,361.11      | 0.07      | 14,124.29     | 0.05           | 19,880.72        | 3.34            | 299.54            | json-joy  |
| mags     | merge / append tail delta into equal replica            | 5,000 | 1      | 0.15         | 6,891.8        | 0.03      | 33,333.33     | 0.01           | 87,719.3         | 4.87            | 205.17            | json-joy  |
| mags     | merge / prepend head delta into equal replica           | 5,000 | 1      | 0.04         | 23,529.41      | 0.04      | 26,041.67     | 0.01           | 107,526.88       | 3.63            | 275.74            | json-joy  |
| mags     | merge / insert middle delta into equal replica          | 5,000 | 1      | 0.04         | 24,875.62      | 0.03      | 31,545.74     | 0.02           | 45,248.87        | 3.48            | 287.68            | json-joy  |
| mags     | merge / overwrite head delta into equal replica         | 5,000 | 1      | 0.11         | 8,787.35       | 0.03      | 35,087.72     | 0.01           | 90,090.09        | 3.19            | 313.22            | json-joy  |
| mags     | merge / overwrite middle delta into equal replica       | 5,000 | 1      | 0.03         | 31,746.03      | 0.05      | 21,505.38     | 0.01           | 68,027.21        | 3.26            | 306.92            | json-joy  |
| mags     | merge / overwrite tail delta into equal replica         | 5,000 | 1      | 0.04         | 23,364.49      | 0.03      | 33,003.3      | 0.01           | 80,000           | 3.29            | 303.72            | json-joy  |
| mags     | merge / delete head delta into equal replica            | 5,000 | 1      | 0.11         | 8,779.63       | 0.02      | 42,016.81     | 0.02           | 46,948.36        | 1.97            | 508.26            | json-joy  |
| mags     | merge / delete middle delta into equal replica          | 5,000 | 1      | 0.04         | 25,575.45      | 0.1       | 10,504.2      | 0.07           | 13,586.96        | 2.11            | 474.59            | crlist    |
| mags     | merge / delete tail delta into equal replica            | 5,000 | 1      | 0.02         | 44,052.86      | 0.02      | 53,191.49     | 0.01           | 87,719.3         | 1.84            | 544.22            | json-joy  |
| mags     | merge / duplicate delta ignored                         | 5,000 | 250    | 0            | 729,927.01     | 0.03      | 39,608.35     | 0.01           | 123,842.08       | 0.03            | 33,428.72         | crlist    |
| mags     | merge / old delta ignored after merge                   | 5,000 | 250    | 0            | 668,627.98     | 0.02      | 44,866.39     | 0              | 282,645.56       | 0.03            | 28,694.08         | crlist    |
| mags     | merge / ordered 1,000 append deltas                     | 5,000 | 1,000  | 0.01         | 197,168.66     | 0.02      | 56,510.27     | 0.02           | 54,361.71        | 3.39            | 294.86            | crlist    |
| mags     | merge / ordered 1,000 prepend deltas                    | 5,000 | 1,000  | 0            | 257,619.08     | 0.01      | 116,527.03    | 0.01           | 84,450.19        | 3.49            | 286.15            | crlist    |
| mags     | merge / ordered 1,000 middle insert deltas              | 5,000 | 1,000  | 0.01         | 199,744.33     | 0.01      | 119,049.04    | 0              | 226,983.84       | 3.43            | 291.22            | json-joy  |
| mags     | merge / shuffled 1,000 mixed deltas                     | 5,000 | 1,000  | 0.98         | 1,022.31       | 1.19      | 841.12        | n/a            | n/a              | 0.86            | 1,156.76          | automerge |
| mags     | merge / reverse ordered 1,000 mixed deltas              | 5,000 | 1,000  | 0.22         | 4,480.44       | 1.19      | 843.41        | n/a            | n/a              | 0.84            | 1,188.03          | crlist    |
| mags     | merge / concurrent prepends same head                   | 5,000 | 2      | 1.23         | 811.89         | 0.09      | 10,911.07     | n/a            | n/a              | 12.35           | 80.95             | yjs       |
| mags     | merge / concurrent appends same tail                    | 5,000 | 2      | 0.04         | 28,409.09      | 0.03      | 29,498.53     | n/a            | n/a              | 15.83           | 63.16             | yjs       |
| mags     | merge / concurrent inserts same middle position         | 5,000 | 2      | 0.62         | 1,620.48       | 0.05      | 21,008.4      | n/a            | n/a              | 18.38           | 54.41             | yjs       |
| mags     | merge / concurrent overwrites same head                 | 5,000 | 2      | 0.77         | 1,292.24       | 0.04      | 24,479.8      | n/a            | n/a              | 8.79            | 113.78            | yjs       |
| mags     | merge / concurrent overwrites same middle               | 5,000 | 2      | 0.81         | 1,227.45       | 0.05      | 21,231.42     | n/a            | n/a              | 15.49           | 64.54             | yjs       |
| mags     | merge / concurrent overwrites same tail                 | 5,000 | 2      | 0.03         | 36,166.37      | 0.04      | 25,773.2      | n/a            | n/a              | 8.46            | 118.2             | crlist    |
| mags     | merge / concurrent deletes same head                    | 5,000 | 2      | 0.75         | 1,339.41       | 0.02      | 43,763.68     | 0.02           | 49,261.08        | 12.01           | 83.28             | json-joy  |
| mags     | merge / concurrent deletes same middle                  | 5,000 | 2      | 0.84         | 1,189.41       | 0.03      | 32,258.06     | 0.02           | 53,333.33        | 7.32            | 136.6             | json-joy  |
| mags     | merge / concurrent deletes same tail                    | 5,000 | 2      | 0.01         | 84,388.19      | 0.03      | 35,523.98     | 0.01           | 72,202.17        | 5.4             | 185.21            | crlist    |
| mags     | merge / concurrent overwrite delete same entry          | 5,000 | 2      | 4.47         | 223.77         | 0.08      | 12,674.27     | 0.06           | 16,246.95        | 9.11            | 109.82            | json-joy  |
| mags     | merge / forked replicas rejoin after 250 ops each       | 5,000 | 500    | 0.01         | 92,006.48      | 0.01      | 92,781.59     | n/a            | n/a              | 3.09            | 323.16            | yjs       |
| mags     | merge / 10 replicas gossip convergence                  | 5,000 | 100    | 0.01         | 145,285.49     | 0.01      | 82,101.81     | n/a            | n/a              | 6.15            | 162.66            | crlist    |
| mags     | merge / snapshot merge into stale replica               | 5,000 | 5,350  | 0            | 529,346.58     | 0         | 510,452.35    | 0              | 251,449.95       | 0.03            | 32,518.19         | crlist    |
| class    | constructor / hydrate snapshot                          | 5,000 | 250    | 5.36         | 186.43         | 7.3       | 137.04        | 17.35          | 57.65            | 169.59          | 5.9               | crlist    |
| class    | read / head                                             | 5,000 | 250    | 0            | 1,070,205.48   | 0         | 4,537,205.08  | 0              | 1,537,515.38     | 0               | 2,181,500.87      | yjs       |
| class    | read / middle                                           | 5,000 | 250    | 0            | 1,761,804.09   | 0         | 13,736,263.74 | 0              | 4,105,090.31     | 0               | 11,627,906.98     | yjs       |
| class    | read / tail                                             | 5,000 | 250    | 0            | 2,747,252.75   | 0         | 14,534,883.72 | 0              | 3,987,240.83     | 0               | 11,013,215.86     | yjs       |
| class    | find near head                                          | 5,000 | 250    | 0            | 632,431.07     | 0         | 2,717,391.3   | 0              | 918,442.32       | 0               | 1,551,831.16      | yjs       |
| class    | find near middle                                        | 5,000 | 250    | 0.98         | 1,019.6        | 0.1       | 10,417.8      | 0.76           | 1,314.38         | 0.01            | 83,985.62         | automerge |
| class    | find near tail                                          | 5,000 | 250    | 2.09         | 478.36         | 0.18      | 5,697.2       | 1.89           | 529.06           | 0.02            | 49,919.13         | automerge |
| class    | iterate visible values                                  | 5,000 | 250    | 0.14         | 7,217.05       | 0.2       | 4,961.58      | 1.74           | 575.92           | 0.08            | 12,592.56         | automerge |
| class    | collect visible values to array                         | 5,000 | 250    | 0.13         | 7,556.43       | 0.2       | 4,894.26      | 1.7            | 587.73           | 0.08            | 12,658.74         | automerge |
| class    | append / single after tail                              | 5,000 | 250    | 0.01         | 165,190.96     | 0.05      | 19,743.02     | 0.04           | 27,261.92        | 1.76            | 568.91            | crlist    |
| class    | append / batch after tail                               | 5,000 | 25,000 | 0            | 1,452,871.75   | 0         | 540,765.03    | 0.01           | 166,511.81       | 0.18            | 5,579.69          | crlist    |
| class    | prepend / single before head                            | 5,000 | 250    | 0            | 207,900.21     | 0.01      | 73,607.35     | 0.05           | 20,965.42        | 1.91            | 524.37            | crlist    |
| class    | prepend / batch before head                             | 5,000 | 25,000 | 0            | 1,697,032.23   | 0         | 800,156.19    | 0.01           | 179,865.04       | 0.18            | 5,496.72          | crlist    |
| class    | insert / single before middle                           | 5,000 | 250    | 0.01         | 169,033.13     | 0.01      | 68,414.43     | 0.01           | 157,470.4        | 1.86            | 538.93            | crlist    |
| class    | insert / batch before middle                            | 5,000 | 25,000 | 0            | 871,851.74     | 0         | 851,231.9     | 0.01           | 196,014.32       | 0.19            | 5,333.63          | crlist    |
| class    | overwrite / head                                        | 5,000 | 250    | 0.01         | 147,266.73     | 0.02      | 56,363.43     | 0.01           | 125,068.79       | 1.96            | 509.73            | crlist    |
| class    | overwrite / middle                                      | 5,000 | 250    | 0.01         | 137,151.63     | 0.03      | 39,703.34     | 0.01           | 150,330.73       | 1.86            | 537.03            | json-joy  |
| class    | overwrite / tail                                        | 5,000 | 250    | 0.01         | 167,537.86     | 0.02      | 56,170.94     | 0.01           | 143,348.62       | 1.89            | 530.45            | crlist    |
| class    | overwrite / random                                      | 5,000 | 250    | 0.02         | 56,823.35      | 0.04      | 28,031.93     | 0.01           | 111,418.13       | 2.15            | 464.42            | json-joy  |
| class    | remove / head                                           | 5,000 | 250    | 0.01         | 133,618.39     | 0.02      | 63,513.03     | 0.02           | 43,584.38        | 0.25            | 4,052.85          | crlist    |
| class    | remove / middle                                         | 5,000 | 250    | 0.01         | 139,594.62     | 0.01      | 92,822.93     | 0.03           | 31,902.81        | 0.28            | 3,632.43          | crlist    |
| class    | remove / tail                                           | 5,000 | 250    | 0            | 234,785.88     | 0.01      | 66,866.37     | 0              | 281,341.44       | 0.24            | 4,095.63          | json-joy  |
| class    | remove / range from head                                | 5,000 | 5,000  | 0            | 427,888.03     | 0         | 7,828,401.44  | 0              | 348,585.09       | 0.02            | 61,764.23         | yjs       |
| class    | remove / range from middle                              | 5,000 | 5,000  | 0            | 880,064.77     | 0         | 6,820,351.93  | 0              | 321,122.13       | 0.02            | 63,059.81         | yjs       |
| class    | remove / range from tail                                | 5,000 | 5,000  | 0            | 855,300.3      | 0         | 9,351,037.97  | 0              | 329,935          | 0.01            | 67,113.82         | yjs       |
| class    | mixed / append overwrite remove tail                    | 5,000 | 250    | 0            | 202,052.86     | 0.02      | 61,171.06     | 0.01           | 157,808.36       | 1.41            | 709.84            | crlist    |
| class    | mixed / prepend overwrite remove head                   | 5,000 | 250    | 0.01         | 187,659.51     | 0.01      | 80,440.17     | 0.01           | 155,347.05       | 1.47            | 678.96            | crlist    |
| class    | mixed / insert overwrite remove middle                  | 5,000 | 250    | 0.01         | 158,800.74     | 0.01      | 75,656.7      | 0.01           | 163,751.88       | 1.47            | 680.89            | json-joy  |
| class    | paste / insert 10,000 entries at cursor                 | 5,000 | 10,000 | 0            | 413,395.67     | 0         | 981,026.94    | 0.01           | 86,748.85        | 0.17            | 6,031.58          | yjs       |
| class    | render / join visible entries to string                 | 5,000 | 250    | 0.25         | 3,968.03       | 0.31      | 3,272.87      | 1.95           | 511.71           | 0.17            | 5,876.26          | automerge |
| class    | snapshot                                                | 5,000 | 250    | 0.24         | 4,242.89       | 3.66      | 273.38        | 6.91           | 144.79           | 14.94           | 66.92             | crlist    |
| class    | snapshot / tombstoned state 50% deleted                 | 5,000 | 250    | 0.11         | 8,708.1        | 1.83      | 544.97        | 3.07           | 326.2            | 14.77           | 67.72             | crlist    |
| class    | snapshot / after garbage collection                     | 5,000 | 250    | 0.11         | 9,055.71       | 0.19      | 5,161         | 1.68           | 594.27           | 0.07            | 13,806.36         | automerge |
| class    | acknowledge                                             | 5,000 | 250    | 0.57         | 1,766.63       | n/a       | n/a           | n/a            | n/a              | n/a             | n/a               | n/a       |
| class    | acknowledge / 50% deleted state                         | 5,000 | 250    | 0.54         | 1,862.08       | n/a       | n/a           | n/a            | n/a              | n/a             | n/a               | n/a       |
| class    | acknowledge / 90% deleted state                         | 5,000 | 250    | 0.9          | 1,110.14       | n/a       | n/a           | n/a            | n/a              | n/a             | n/a               | n/a       |
| class    | garbage collect                                         | 5,000 | 250    | 0.11         | 8,786.14       | 0.19      | 5,189.26      | 1.85           | 540.64           | 0.07            | 13,790.21         | automerge |
| class    | garbage collect / no eligible tombstones                | 5,000 | 250    | 0.11         | 8,759.67       | 0.19      | 5,262.81      | 1.9            | 526.87           | 0.07            | 13,921.68         | automerge |
| class    | garbage collect / 90% eligible tombstones               | 5,000 | 250    | 0.1          | 9,681.63       | 0.19      | 5,328.38      | 2.22           | 451.1            | 0.07            | 14,248.91         | automerge |
| class    | merge ordered deltas                                    | 5,000 | 250    | 0.01         | 99,860.2       | 0.01      | 103,263.11    | 0.01           | 78,190.97        | 2.95            | 338.82            | yjs       |
| class    | merge shuffled gossip                                   | 5,000 | 250    | 0.73         | 1,361.68       | 0.36      | 2,765.81      | n/a            | n/a              | 0.68            | 1,467.48          | yjs       |
| class    | merge / duplicate delta ignored                         | 5,000 | 250    | 0            | 604,448.74     | 0.03      | 35,796.62     | 0              | 332,181.77       | 0.03            | 30,338.7          | crlist    |
| class    | merge / concurrent prepends same head                   | 5,000 | 2      | 0.76         | 1,322.31       | 0.07      | 15,003.75     | n/a            | n/a              | 9.86            | 101.39            | yjs       |
| class    | merge / concurrent appends same tail                    | 5,000 | 2      | 0.04         | 27,359.78      | 0.02      | 40,160.64     | n/a            | n/a              | 14.7            | 68.04             | yjs       |
| class    | merge / concurrent inserts same middle position         | 5,000 | 2      | 0.63         | 1,584.16       | 0.03      | 30,030.03     | n/a            | n/a              | 10.98           | 91.1              | yjs       |
| class    | merge / forked replicas rejoin after 250 ops each       | 5,000 | 500    | 0.54         | 1,839.7        | 0.01      | 69,768.09     | n/a            | n/a              | 3.11            | 321.85            | yjs       |
| latency  | append tail write to remote visible                     | 5,000 | 250    | 0.21         | 4,819.65       | 0.25      | 3,938.72      | 12.17          | 82.16            | 5.52            | 181.07            | crlist    |
| latency  | prepend head write to remote visible                    | 5,000 | 250    | 0.01         | 134,069.82     | 0.03      | 31,806.21     | 0.02           | 61,381.33        | 5.68            | 175.94            | crlist    |
| latency  | middle insert write to remote visible                   | 5,000 | 250    | 0.29         | 3,427.87       | 0.12      | 8,166.47      | 3.84           | 260.27           | 5.61            | 178.34            | yjs       |
| latency  | head insert write to remote visible                     | 5,000 | 250    | 0.01         | 156,386.84     | 0.02      | 44,491.9      | 0.02           | 64,916.52        | 5.62            | 177.81            | crlist    |
| latency  | overwrite head write to remote visible                  | 5,000 | 250    | 0.05         | 19,319.04      | 0.04      | 26,684.31     | 0.02           | 64,202.98        | 5.57            | 179.65            | json-joy  |
| latency  | overwrite middle write to remote visible                | 5,000 | 250    | 0.28         | 3,550.74       | 0.14      | 7,298.59      | 2.49           | 400.86           | 5.65            | 176.91            | yjs       |
| latency  | overwrite tail write to remote visible                  | 5,000 | 250    | 0.56         | 1,778.14       | 0.23      | 4,414.99      | 5.87           | 170.34           | 5.46            | 183.06            | yjs       |
| latency  | head delete to remote hidden                            | 5,000 | 250    | 0.64         | 1,561.93       | 0.25      | 4,019.99      | 5.47           | 182.79           | 2.19            | 457.45            | yjs       |
| latency  | middle delete to remote hidden                          | 5,000 | 250    | 0.65         | 1,550.17       | 0.25      | 3,951.74      | 5.69           | 175.88           | 2.06            | 485.42            | yjs       |
| latency  | tail delete to remote hidden                            | 5,000 | 250    | 0.2          | 4,963.4        | 0.21      | 4,754.67      | 5.37           | 186.06           | 2.17            | 459.85            | crlist    |
| latency  | append tail write to 10 remotes visible                 | 5,000 | 2,500  | 0.24         | 4,120.04       | 0.22      | 4,636.38      | 11.87          | 84.26            | 3.69            | 270.95            | yjs       |
| latency  | prepend head write to 10 remotes visible                | 5,000 | 2,500  | 0            | 223,409.77     | 0.01      | 97,102.46     | 0.02           | 64,964.59        | 3.78            | 264.75            | crlist    |
| latency  | middle insert write to 10 remotes visible               | 5,000 | 2,500  | 0.29         | 3,390          | 0.11      | 8,888.55      | 4.58           | 218.3            | 3.81            | 262.16            | yjs       |
| latency  | overwrite middle write to 10 remotes visible            | 5,000 | 2,500  | 0.3          | 3,369.67       | 0.11      | 9,422.89      | 3.17           | 315.23           | 3.77            | 265.56            | yjs       |
| latency  | delete middle to 10 remotes hidden                      | 5,000 | 2,500  | 0.64         | 1,565.01       | 0.23      | 4,432.42      | 6.47           | 154.64           | 1.85            | 540.09            | yjs       |
| latency  | out-of-order write delivery to remote visible           | 5,000 | 250    | 1.73         | 577.85         | 71.14     | 14.06         | n/a            | n/a              | 15.32           | 65.27             | crlist    |
| latency  | out-of-order delete delivery to remote convergence      | 5,000 | 165    | 2.56         | 390.31         | 0.21      | 4,823.13      | 7.18           | 139.29           | 6.38            | 156.86            | yjs       |
| latency  | out-of-order append delivery to convergence             | 5,000 | 250    | 1.71         | 586.39         | 26.55     | 37.66         | n/a            | n/a              | 21.06           | 47.48             | crlist    |
| latency  | out-of-order prepend delivery to convergence            | 5,000 | 250    | 1.64         | 608.17         | 27.6      | 36.23         | 0.11           | 8,917.39         | 19.42           | 51.49             | json-joy  |
| latency  | out-of-order middle insert delivery to convergence      | 5,000 | 250    | 1.63         | 611.76         | 78.16     | 12.79         | n/a            | n/a              | 18.03           | 55.45             | crlist    |
| latency  | out-of-order overwrite delivery to convergence          | 5,000 | 129    | 2.79         | 358.41         | n/a       | n/a           | 236.96         | 4.22             | 74.22           | 13.47             | crlist    |
| latency  | offline burst 1,000 ops then sync                       | 5,000 | 1,000  | 0.01         | 169,170.39     | 0.03      | 37,579.01     | 0              | 262,591.25       | 3.16            | 316.38            | json-joy  |
| latency  | forked replicas mixed ops then converge                 | 5,000 | 500    | 0.01         | 173,719.69     | 0.01      | 80,285.17     | n/a            | n/a              | 3.12            | 320.21            | crlist    |
| latency  | duplicate shuffled gossip to convergence                | 5,000 | 500    | 0.39         | 2,537.25       | 0.21      | 4,867.46      | n/a            | n/a              | 0.38            | 2,650.03          | yjs       |
| latency  | remote snapshot hydrate then apply pending deltas       | 5,000 | 250    | 0.03         | 38,568.94      | 0.04      | 23,782.8      | 0.1            | 10,031.3         | 0.83            | 1,212.03          | crlist    |
| workload | local app session                                       | 5,000 | 250    | 0.02         | 47,913.83      | 0.01      | 71,063.1      | 0.04           | 27,496.4         | 1.3             | 768.83            | yjs       |
| workload | read heavy session                                      | 5,000 | 250    | 0            | 2,673,796.79   | 0         | 4,699,248.12  | 0              | 408,697.07       | 0               | 2,840,909.09      | yjs       |
| workload | write heavy session                                     | 5,000 | 250    | 0.01         | 156,181.67     | 0.01      | 76,626        | 0.01           | 155,675.94       | 1.19            | 840.8             | crlist    |
| workload | append tail heavy session                               | 5,000 | 250    | 0            | 393,514.87     | 0.02      | 59,140.8      | 0.01           | 111,140.75       | 1.58            | 631.65            | crlist    |
| workload | prepend head heavy session                              | 5,000 | 250    | 0.01         | 193,184.45     | 0.01      | 96,472.95     | 0.01           | 140,189.54       | 1.56            | 641               | crlist    |
| workload | insert middle heavy session                             | 5,000 | 250    | 0.01         | 149,387.51     | 0.01      | 71,442.86     | 0.01           | 157,798.4        | 1.61            | 622.89            | json-joy  |
| workload | overwrite heavy session                                 | 5,000 | 250    | 0.01         | 167,257.64     | 0.01      | 82,723.93     | 0.03           | 31,714.62        | 1.34            | 745.55            | crlist    |
| workload | delete heavy session                                    | 5,000 | 250    | 0            | 211,972.19     | 0.01      | 76,583.75     | 0.03           | 38,870.58        | 0.2             | 5,033.07          | crlist    |
| workload | balanced append prepend insert overwrite delete session | 5,000 | 250    | 0.01         | 161,571.77     | 0.01      | 89,789.18     | 0.01           | 136,873.8        | 1.38            | 725.29            | crlist    |
| workload | random edit session                                     | 5,000 | 250    | 0.01         | 116,333.18     | 0.02      | 43,016.67     | 0.04           | 27,023.23        | 1.22            | 822.34            | crlist    |
| workload | text editing session                                    | 5,000 | 250    | 0.01         | 128,819.5      | 0.01      | 90,533.79     | 0.01           | 153,496.65       | 1.68            | 596.86            | json-joy  |
| workload | collaborative offline session                           | 5,000 | 500    | 0            | 226,346.76     | 0.01      | 123,961.82    | n/a            | n/a              | 3.11            | 321.48            | crlist    |
| workload | sync and cleanup session                                | 5,000 | 252    | 0.02         | 57,550.01      | 0.01      | 118,511.5     | n/a            | n/a              | 3.1             | 322.84            | yjs       |
| workload | long lived tombstoned session                           | 5,000 | 250    | 0            | 271,473.56     | 0.01      | 74,839.1      | 0.01           | 169,262.02       | 1.79            | 558.67            | crlist    |
| workload | sparse visible session                                  | 5,000 | 250    | 0            | 249,426.32     | 0.13      | 7,465.2       | 0.01           | 101,022.35       | 0.97            | 1,028.85          | crlist    |
| workload | post-gc edit session                                    | 5,000 | 250    | 0            | 349,454.85     | 0.02      | 56,616.17     | 0.05           | 20,507.27        | 1.52            | 657.51            | crlist    |

## License

Apache-2.0
