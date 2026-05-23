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
| -------- | ------------------------------------------------------- | ----- | ------ | ------------ | -------------- | --------- | ------------- | -------------- | ---------------- | --------------- | ----------------- | --------- |
| crud     | create / empty list                                     | 5,000 | 250    | 0            | 264,214.75     | 0.16      | 6,324.12      | 0.02           | 51,402.25        | 0.36            | 2,775.11          | crlist    |
| crud     | create / hydrate snapshot                               | 5,000 | 250    | 3.68         | 271.76         | 7.98      | 125.36        | 19.34          | 51.71            | 157.9           | 6.33              | crlist    |
| crud     | create / hydrate clean snapshot                         | 5,000 | 250    | 4.54         | 220.45         | 7.06      | 141.64        | 19.08          | 52.41            | 157.53          | 6.35              | crlist    |
| crud     | create / hydrate tombstoned snapshot                    | 5,000 | 250    | 3.29         | 303.67         | 3.54      | 282.72        | 9.66           | 103.55           | 168.03          | 5.95              | crlist    |
| crud     | read / head                                             | 5,000 | 250    | 0            | 1,322,751.32   | 0         | 888,730.89    | 0              | 247,133.25       | 0               | 3,521,126.76      | automerge |
| crud     | read / middle                                           | 5,000 | 250    | 0            | 7,530,120.48   | 0         | 1,644,736.84  | 0              | 701,065.62       | 0               | 6,906,077.35      | crlist    |
| crud     | read / tail                                             | 5,000 | 250    | 0            | 7,552,870.09   | 0         | 1,966,955.15  | 0              | 697,155.61       | 0               | 9,025,270.76      | automerge |
| crud     | read / random indexed reads                             | 5,000 | 250    | 0            | 862,663.91     | 0         | 726,110.95    | 0.01           | 171,550.13       | 0               | 1,175,917.22      | automerge |
| crud     | read / sequential indexed reads from head               | 5,000 | 250    | 0            | 1,232,134.06   | 0         | 849,762.07    | 0              | 258,478.08       | 0               | 1,288,659.79      | automerge |
| crud     | read / sequential indexed reads from middle             | 5,000 | 250    | 0            | 2,732,240.44   | 0         | 1,956,181.53  | 0              | 277,407.9        | 0               | 8,305,647.84      | automerge |
| crud     | read / sequential indexed reads from tail               | 5,000 | 250    | 0            | 2,228,163.99   | 0         | 2,765,486.73  | 0              | 287,257.27       | 0               | 6,142,506.14      | automerge |
| crud     | read / full iteration visible values                    | 5,000 | 250    | 0.86         | 1,160.03       | 0.27      | 3,698.98      | 1.83           | 545.1            | 0.08            | 13,284.87         | automerge |
| crud     | read / collect visible values to array                  | 5,000 | 250    | 0.72         | 1,395.69       | 0.25      | 3,992.1       | 1.69           | 590.18           | 0.08            | 12,326.57         | automerge |
| crud     | read / visible sparse over deleted entries              | 5,000 | 250    | 0            | 2,628,811.78   | 0.03      | 30,917.64     | 0.02           | 51,054.79        | 0               | 10,330,578.51     | automerge |
| crud     | find / head                                             | 5,000 | 250    | 0            | 1,099,868.02   | 0         | 1,430,205.95  | 0              | 700,476.32       | 0               | 1,589,319.77      | automerge |
| crud     | find / middle                                           | 5,000 | 250    | 0.3          | 3,321.54       | 0.12      | 8,218.01      | 0.64           | 1,553.26         | 0.01            | 78,665.83         | automerge |
| crud     | find / tail                                             | 5,000 | 250    | 0.42         | 2,353.05       | 0.2       | 4,908.36      | 1.52           | 657.68           | 0.02            | 45,702.17         | automerge |
| crud     | find / missing value                                    | 5,000 | 250    | 0.45         | 2,198.43       | 0.21      | 4,804.5       | 1.63           | 615.28           | 0.03            | 29,916.12         | automerge |
| crud     | append / single after tail                              | 5,000 | 250    | 0.01         | 106,188.68     | 0.03      | 39,708.38     | 0.04           | 23,322.85        | 1.77            | 565.6             | crlist    |
| crud     | append / batch after tail                               | 5,000 | 25,000 | 0.01         | 157,428.65     | 0         | 520,954.89    | 0.01           | 145,351.79       | 0.18            | 5,504.64          | yjs       |
| crud     | append / batch after deleted tail                       | 5,000 | 25,000 | 0.01         | 130,337.92     | 0         | 634,962.56    | 0.01           | 151,449.71       | 0.18            | 5,464.28          | yjs       |
| crud     | append / batch after garbage collection                 | 5,000 | 25,000 | 0.01         | 172,664.93     | 0         | 703,029.21    | 0.01           | 140,562.05       | 0.18            | 5,478.08          | yjs       |
| crud     | prepend / single before head                            | 5,000 | 250    | 0.01         | 73,603.01      | 0.02      | 61,574.84     | 0.01           | 93,893.19        | 1.92            | 520.21            | json-joy  |
| crud     | prepend / batch before head                             | 5,000 | 25,000 | 0.01         | 100,852.65     | 0         | 655,634.52    | 0.01           | 187,078.14       | 0.19            | 5,352.29          | yjs       |
| crud     | prepend / batch before deleted head                     | 5,000 | 25,000 | 0.01         | 183,607.79     | 0         | 834,003.32    | 0.01           | 170,039.34       | 0.19            | 5,318.58          | yjs       |
| crud     | prepend / batch after garbage collection                | 5,000 | 25,000 | 0.01         | 175,928.73     | 0         | 837,232.04    | 0.01           | 186,921.62       | 0.18            | 5,607.9           | yjs       |
| crud     | insert / single before head                             | 5,000 | 250    | 0.01         | 135,457.3      | 0.02      | 48,763.36     | 0.01           | 120,755.45       | 1.89            | 527.84            | crlist    |
| crud     | insert / single after head                              | 5,000 | 250    | 0.02         | 49,635.67      | 0.02      | 60,012.48     | 0.01           | 81,316.68        | 1.81            | 551.7             | json-joy  |
| crud     | insert / single before middle                           | 5,000 | 250    | 0.02         | 45,540.66      | 0.02      | 51,921.08     | 0.01           | 79,544.37        | 1.73            | 578.12            | json-joy  |
| crud     | insert / single after middle                            | 5,000 | 250    | 0.01         | 110,156.42     | 0.02      | 54,593.5      | 0.04           | 24,421.22        | 1.88            | 532.2             | crlist    |
| crud     | insert / single before tail                             | 5,000 | 250    | 0.01         | 72,396.62      | 0.02      | 54,669.9      | 0.04           | 27,183.66        | 1.82            | 548.74            | crlist    |
| crud     | insert / single after tail                              | 5,000 | 250    | 0.01         | 100,486.35     | 0.04      | 24,979.77     | 0.03           | 29,647.55        | 1.75            | 572.56            | crlist    |
| crud     | insert / batch before head                              | 5,000 | 25,000 | 0.01         | 198,578.18     | 0         | 865,186.62    | 0.01           | 179,799.59       | 0.19            | 5,366.15          | yjs       |
| crud     | insert / batch after head                               | 5,000 | 25,000 | 0.01         | 159,842.36     | 0         | 876,713.1     | 0.01           | 173,158.61       | 0.18            | 5,423.25          | yjs       |
| crud     | insert / batch before middle                            | 5,000 | 25,000 | 0.01         | 131,440.73     | 0         | 908,070.57    | 0.01           | 181,109.81       | 0.19            | 5,352.83          | yjs       |
| crud     | insert / batch after middle                             | 5,000 | 25,000 | 0.01         | 162,857.33     | 0         | 875,126.46    | 0.01           | 130,738.85       | 0.19            | 5,345.86          | yjs       |
| crud     | insert / batch before tail                              | 5,000 | 25,000 | 0.01         | 141,834.8      | 0         | 746,585.12    | 0.01           | 168,042.03       | 0.19            | 5,389.78          | yjs       |
| crud     | insert / batch after tail                               | 5,000 | 25,000 | 0.01         | 145,318.34     | 0         | 568,457       | 0.01           | 149,739.06       | 0.19            | 5,333.23          | yjs       |
| crud     | insert / repeated before head                           | 5,000 | 250    | 0.01         | 175,549.47     | 0.01      | 102,454.82    | 0.01           | 139,938.43       | 1.93            | 516.91            | crlist    |
| crud     | insert / repeated before middle                         | 5,000 | 250    | 0.01         | 138,243.75     | 0.01      | 83,394.49     | 0.01           | 166,889.19       | 1.93            | 517.38            | json-joy  |
| crud     | insert / repeated before tail                           | 5,000 | 250    | 0.01         | 145,053.67     | 0.01      | 87,342.35     | 0.01           | 190,970.9        | 1.81            | 552.18            | json-joy  |
| crud     | insert / random positions                               | 5,000 | 250    | 0.01         | 127,655.23     | 0.03      | 32,638.35     | 0.02           | 48,159.35        | 1.72            | 579.96            | crlist    |
| crud     | insert / alternating head and tail                      | 5,000 | 250    | 0.06         | 16,338.37      | 0.01      | 96,113.18     | 0.01           | 133,368.9        | 2.25            | 444.97            | json-joy  |
| crud     | overwrite / head                                        | 5,000 | 250    | 0.01         | 70,739.37      | 0.03      | 31,761.36     | 0.02           | 62,942.17        | 2.11            | 473.68            | crlist    |
| crud     | overwrite / middle                                      | 5,000 | 250    | 0.01         | 70,521.86      | 0.02      | 49,148.74     | 0.04           | 28,509.2         | 1.88            | 530.53            | crlist    |
| crud     | overwrite / tail                                        | 5,000 | 250    | 0.01         | 120,737.95     | 0.02      | 48,896.89     | 0.03           | 33,998.8         | 1.92            | 521.03            | crlist    |
| crud     | overwrite / random                                      | 5,000 | 250    | 0.02         | 55,791.12      | 0.04      | 26,563.25     | 0.04           | 26,921.09        | 2.31            | 432.29            | crlist    |
| crud     | overwrite / same head repeatedly                        | 5,000 | 250    | 0.01         | 107,912.12     | 0.02      | 51,952.37     | 0.03           | 29,307.98        | 2.06            | 485.66            | crlist    |
| crud     | overwrite / same middle repeatedly                      | 5,000 | 250    | 0.01         | 152,095.88     | 0.02      | 43,608.71     | 0.03           | 29,356.16        | 1.88            | 531.79            | crlist    |
| crud     | overwrite / same tail repeatedly                        | 5,000 | 250    | 0.01         | 164,712.08     | 0.02      | 48,966.8      | 0.01           | 110,850          | 1.85            | 540.77            | crlist    |
| crud     | overwrite / random visible entries                      | 5,000 | 250    | 0.01         | 106,315.12     | 0.04      | 24,814.88     | 0.01           | 85,931.32        | 2.31            | 432.56            | crlist    |
| crud     | overwrite / after insert                                | 5,000 | 250    | 0.01         | 152,207        | 0.02      | 48,924.64     | 0.01           | 106,103.05       | 2.1             | 476.68            | crlist    |
| crud     | overwrite / after delete                                | 5,000 | 250    | 0.01         | 156,123.15     | 0.02      | 52,419.69     | 0.01           | 86,111.88        | 2.43            | 411.56            | crlist    |
| crud     | delete / head                                           | 5,000 | 250    | 0.02         | 41,823.5       | 0.02      | 57,948.17     | 0.03           | 35,498.76        | 0.26            | 3,921.09          | yjs       |
| crud     | delete / middle                                         | 5,000 | 250    | 0.01         | 136,963.79     | 0.01      | 68,225.85     | 0.04           | 23,349.65        | 0.28            | 3,606.13          | crlist    |
| crud     | delete / tail                                           | 5,000 | 250    | 0            | 657,030.22     | 0.02      | 56,928.16     | 0              | 225,530          | 0.28            | 3,589.5           | crlist    |
| crud     | delete / range from head                                | 5,000 | 5,000  | 0            | 2,154,522.34   | 0         | 8,967,001.43  | 0              | 279,237.57       | 0.02            | 56,420.93         | yjs       |
| crud     | delete / range from middle                              | 5,000 | 5,000  | 0            | 1,160,496.69   | 0         | 6,779,661.02  | 0              | 206,341.28       | 0.02            | 48,818.83         | yjs       |
| crud     | delete / range from tail                                | 5,000 | 5,000  | 0            | 802,181.93     | 0         | 5,305,039.79  | 0              | 244,195.47       | 0.02            | 60,221.45         | yjs       |
| crud     | delete / every other entry                              | 5,000 | 2,500  | 0.01         | 70,277.62      | 0.1       | 9,812.42      | 0.1            | 10,219.95        | 0.26            | 3,915.35          | crlist    |
| crud     | delete / all entries from head one by one               | 5,000 | 5,000  | 0.01         | 112,526.44     | 0.01      | 83,094.3      | 0.01           | 117,707.16       | 0.23            | 4,257.34          | json-joy  |
| crud     | delete / all entries from middle outward                | 5,000 | 5,000  | 0.01         | 87,983.25      | 0.01      | 101,199.21    | 0.01           | 174,389.81       | 0.25            | 4,028.32          | json-joy  |
| crud     | delete / all entries from tail one by one               | 5,000 | 5,000  | 0            | 531,575.59     | 0.01      | 98,885.36     | 0              | 234,257.87       | 0.2             | 5,003.49          | crlist    |
| crud     | delete / all entries in random order                    | 5,000 | 5,000  | 0.2          | 5,009.71       | 12.35     | 80.98         | 8.12           | 123.15           | 0.28            | 3,621.78          | crlist    |
| crud     | delete / already deleted head                           | 5,000 | 250    | 0            | 350,975.71     | 0         | 250,752.26    | 0              | 570,125.43       | 0.04            | 24,923.73         | json-joy  |
| crud     | delete / already deleted middle                         | 5,000 | 250    | 0            | 385,802.47     | 0         | 297,194.48    | 0              | 846,883.47       | 0.03            | 29,569.7          | json-joy  |
| crud     | delete / already deleted tail                           | 5,000 | 250    | 0            | 1,461,133.84   | 0         | 253,652.6     | 0              | 1,377,410.47     | 0.02            | 44,384.48         | crlist    |
| crud     | mixed / append overwrite delete tail                    | 5,000 | 250    | 0.01         | 100,563.15     | 0.03      | 35,335.69     | 0.01           | 74,595.69        | 1.7             | 586.79            | crlist    |
| crud     | mixed / prepend overwrite delete head                   | 5,000 | 250    | 0.01         | 152,839.76     | 0.02      | 53,335.61     | 0.01           | 107,162.76       | 1.62            | 617.21            | crlist    |
| crud     | mixed / insert overwrite delete middle                  | 5,000 | 250    | 0.03         | 38,590.37      | 0.02      | 58,777.89     | 0.01           | 127,909.95       | 1.59            | 628.2             | json-joy  |
| crud     | mixed / append prepend insert overwrite delete          | 5,000 | 250    | 0.01         | 122,082.23     | 0.02      | 51,655.03     | 0.01           | 132,107.38       | 1.74            | 573.1             | json-joy  |
| mags     | snapshot                                                | 5,000 | 250    | 0.21         | 4,786.17       | 3.88      | 258.04        | 7.62           | 131.3            | 17.57           | 56.91             | crlist    |
| mags     | snapshot / clean state                                  | 5,000 | 250    | 0.2          | 5,040.82       | 3.74      | 267.74        | 8.79           | 113.79           | 15.33           | 65.24             | crlist    |
| mags     | snapshot / tombstoned state 50% deleted                 | 5,000 | 250    | 0.12         | 8,324.45       | 1.93      | 518.22        | 3.32           | 301.2            | 15.35           | 65.13             | crlist    |
| mags     | snapshot / tombstoned state 90% deleted                 | 5,000 | 250    | 0.04         | 25,584.87      | 0.41      | 2,417.91      | 0.55           | 1,821.83         | 15.58           | 64.19             | crlist    |
| mags     | snapshot / after garbage collection                     | 5,000 | 250    | 0.14         | 6,919.96       | 1.94      | 516.06        | 3.16           | 316.79           | 15.16           | 65.97             | crlist    |
| mags     | acknowledge                                             | 5,000 | 250    | 0            | 1,976,284.58   | n/a       | n/a           | n/a            | n/a              | n/a             | n/a               | n/a       |
| mags     | acknowledge / clean state                               | 5,000 | 250    | 0            | 6,887,052.34   | n/a       | n/a           | n/a            | n/a              | n/a             | n/a               | n/a       |
| mags     | acknowledge / 50% deleted state                         | 5,000 | 250    | 0.05         | 20,579.35      | n/a       | n/a           | n/a            | n/a              | n/a             | n/a               | n/a       |
| mags     | acknowledge / 90% deleted state                         | 5,000 | 250    | 0.07         | 13,871.09      | n/a       | n/a           | n/a            | n/a              | n/a             | n/a               | n/a       |
| mags     | garbage collect                                         | 5,000 | 250    | 0            | 1,185,958.25   | n/a       | n/a           | n/a            | n/a              | n/a             | n/a               | n/a       |
| mags     | garbage collect / no eligible tombstones                | 5,000 | 250    | 0            | 6,234,413.97   | n/a       | n/a           | n/a            | n/a              | n/a             | n/a               | n/a       |
| mags     | garbage collect / 50% eligible tombstones               | 5,000 | 250    | 0            | 410,711.35     | n/a       | n/a           | n/a            | n/a              | n/a             | n/a               | n/a       |
| mags     | garbage collect / 90% eligible tombstones               | 5,000 | 250    | 0            | 415,765.84     | n/a       | n/a           | n/a            | n/a              | n/a             | n/a               | n/a       |
| mags     | garbage collect / partial frontiers 2 replicas          | 5,000 | 250    | 0            | 3,298,153.03   | n/a       | n/a           | n/a            | n/a              | n/a             | n/a               | n/a       |
| mags     | garbage collect / partial frontiers 10 replicas         | 5,000 | 250    | 0            | 3,541,076.49   | n/a       | n/a           | n/a            | n/a              | n/a             | n/a               | n/a       |
| mags     | post-gc read / full iteration visible values            | 5,000 | 250    | 0.67         | 1,499.48       | 0.1       | 10,289.89     | 0.58           | 1,723.87         | 0.03            | 34,980.2          | automerge |
| mags     | merge ordered deltas                                    | 5,000 | 250    | 0.06         | 18,108.72      | 0.02      | 54,352.55     | 0.01           | 175,895.31       | 3.05            | 327.86            | json-joy  |
| mags     | merge shuffled gossip                                   | 5,000 | 250    | 1.02         | 981.79         | 0.65      | 1,545.42      | n/a            | n/a              | 0.71            | 1,402.47          | yjs       |
| mags     | merge / append head delta into equal replica            | 5,000 | 1      | 0.15         | 6,697.92       | 0.07      | 14,306.15     | 0.05           | 20,920.5         | 3.61            | 276.66            | json-joy  |
| mags     | merge / append tail delta into equal replica            | 5,000 | 1      | 0.04         | 26,385.22      | 0.03      | 32,258.06     | 0.01           | 89,285.71        | 3.17            | 315.37            | json-joy  |
| mags     | merge / prepend head delta into equal replica           | 5,000 | 1      | 0.19         | 5,310.67       | 0.04      | 28,011.2      | 0.01           | 112,359.55       | 3.72            | 269.11            | json-joy  |
| mags     | merge / insert middle delta into equal replica          | 5,000 | 1      | 0.08         | 13,297.87      | 0.03      | 30,487.8      | 0.02           | 50,761.42        | 3.45            | 290.23            | json-joy  |
| mags     | merge / overwrite head delta into equal replica         | 5,000 | 1      | 0.28         | 3,617.95       | 0.06      | 16,129.03     | 0.01           | 84,033.61        | 3.58            | 279.33            | json-joy  |
| mags     | merge / overwrite middle delta into equal replica       | 5,000 | 1      | 0.09         | 11,695.91      | 0.05      | 21,459.23     | 0.01           | 73,529.41        | 3.28            | 305.08            | json-joy  |
| mags     | merge / overwrite tail delta into equal replica         | 5,000 | 1      | 0.03         | 33,003.3       | 0.03      | 30,959.75     | 0.01           | 84,033.61        | 3.34            | 299.85            | json-joy  |
| mags     | merge / delete head delta into equal replica            | 5,000 | 1      | 0.36         | 2,797.99       | 0.02      | 40,322.58     | 0.02           | 52,910.05        | 1.77            | 564.11            | json-joy  |
| mags     | merge / delete middle delta into equal replica          | 5,000 | 1      | 0.1          | 10,319.92      | 0.1       | 9,910.8       | 0.1            | 10,482.18        | 1.85            | 541.36            | json-joy  |
| mags     | merge / delete tail delta into equal replica            | 5,000 | 1      | 0.03         | 35,087.72      | 0.02      | 45,454.55     | 0.01           | 90,909.09        | 2.02            | 495.07            | json-joy  |
| mags     | merge / duplicate delta ignored                         | 5,000 | 250    | 0            | 750,075.01     | 0.03      | 36,154.86     | 0.01           | 123,219.48       | 0.08            | 13,294.55         | crlist    |
| mags     | merge / old delta ignored after merge                   | 5,000 | 250    | 0            | 908,430.23     | 0.02      | 42,874.29     | 0              | 269,978.4        | 0.03            | 29,480.09         | crlist    |
| mags     | merge / ordered 1,000 append deltas                     | 5,000 | 1,000  | 0.01         | 174,852.69     | 0.02      | 46,510.55     | 0              | 235,172.38       | 4.16            | 240.17            | json-joy  |
| mags     | merge / ordered 1,000 prepend deltas                    | 5,000 | 1,000  | 0.1          | 10,185.75      | 0.01      | 101,286.34    | 0.01           | 75,143.34        | 6.23            | 160.63            | yjs       |
| mags     | merge / ordered 1,000 middle insert deltas              | 5,000 | 1,000  | 0.03         | 38,037.42      | 0.01      | 101,426.05    | 0              | 259,033.8        | 6.51            | 153.72            | json-joy  |
| mags     | merge / shuffled 1,000 mixed deltas                     | 5,000 | 1,000  | 1.1          | 910.78         | 1.32      | 758.51        | n/a            | n/a              | 0.92            | 1,090.09          | automerge |
| mags     | merge / reverse ordered 1,000 mixed deltas              | 5,000 | 1,000  | 0.28         | 3,513.52       | 1.21      | 827.71        | n/a            | n/a              | 0.9             | 1,108.12          | crlist    |
| mags     | merge / concurrent prepends same head                   | 5,000 | 2      | 0.87         | 1,148.7        | 0.1       | 9,975.06      | n/a            | n/a              | 10.46           | 95.56             | yjs       |
| mags     | merge / concurrent appends same tail                    | 5,000 | 2      | 0.11         | 9,456.26       | 0.05      | 22,002.2      | n/a            | n/a              | 10.92           | 91.58             | yjs       |
| mags     | merge / concurrent inserts same middle position         | 5,000 | 2      | 1.21         | 827.54         | 0.05      | 19,342.36     | n/a            | n/a              | 15.95           | 62.71             | yjs       |
| mags     | merge / concurrent overwrites same head                 | 5,000 | 2      | 4.6          | 217.54         | 0.05      | 21,810.25     | n/a            | n/a              | 11.01           | 90.86             | yjs       |
| mags     | merge / concurrent overwrites same middle               | 5,000 | 2      | 1.27         | 789.23         | 0.04      | 23,364.49     | n/a            | n/a              | 9.33            | 107.14            | yjs       |
| mags     | merge / concurrent overwrites same tail                 | 5,000 | 2      | 0.06         | 15,847.86      | 1.74      | 575.79        | n/a            | n/a              | 16.45           | 60.79             | crlist    |
| mags     | merge / concurrent deletes same head                    | 5,000 | 2      | 2.04         | 489.27         | 0.03      | 35,842.29     | 0.02           | 50,251.26        | 11.92           | 83.9              | json-joy  |
| mags     | merge / concurrent deletes same middle                  | 5,000 | 2      | 0.85         | 1,176.82       | 0.03      | 34,722.22     | 0.02           | 46,620.05        | 5.66            | 176.76            | json-joy  |
| mags     | merge / concurrent deletes same tail                    | 5,000 | 2      | 0.02         | 60,790.27      | 0.03      | 35,650.62     | 0.02           | 65,789.47        | 14.54           | 68.8              | json-joy  |
| mags     | merge / concurrent overwrite delete same entry          | 5,000 | 2      | 0.94         | 1,067.81       | 0.07      | 14,255.17     | 0.06           | 16,051.36        | 7.56            | 132.25            | json-joy  |
| mags     | merge / forked replicas rejoin after 250 ops each       | 5,000 | 500    | 0.03         | 34,330.28      | 0.01      | 77,723.03     | n/a            | n/a              | 3.28            | 304.95            | yjs       |
| mags     | merge / 10 replicas gossip convergence                  | 5,000 | 100    | 0.01         | 115,114.54     | 0.01      | 83,395.88     | n/a            | n/a              | 6.31            | 158.4             | crlist    |
| mags     | merge / snapshot merge into stale replica               | 5,000 | 5,350  | 0            | 932,364.37     | 0         | 552,412.03    | 0              | 243,663.61       | 0.03            | 30,756.3          | crlist    |
| class    | constructor / hydrate snapshot                          | 5,000 | 250    | 4.71         | 212.24         | 7.12      | 140.53        | 18.65          | 53.62            | 198.29          | 5.04              | crlist    |
| class    | read / head                                             | 5,000 | 250    | 0            | 784,190.72     | 0         | 4,940,711.46  | 0              | 1,196,172.25     | 0               | 2,427,184.47      | yjs       |
| class    | read / middle                                           | 5,000 | 250    | 0            | 1,664,447.4    | 0         | 15,060,240.96 | 0              | 3,201,024.33     | 0               | 9,765,625         | yjs       |
| class    | read / tail                                             | 5,000 | 250    | 0            | 2,535,496.96   | 0         | 15,822,784.81 | 0              | 3,438,789.55     | 0               | 10,964,912.28     | yjs       |
| class    | find near head                                          | 5,000 | 250    | 0            | 736,811.08     | 0         | 3,125,000     | 0              | 796,431.98       | 0               | 1,236,399.6       | yjs       |
| class    | find near middle                                        | 5,000 | 250    | 1.38         | 726.42         | 0.1       | 10,353.6      | 1.08           | 922.92           | 0.01            | 75,576.65         | automerge |
| class    | find near tail                                          | 5,000 | 250    | 2.9          | 345.14         | 0.16      | 6,256.07      | 1.87           | 535.61           | 0.02            | 56,960.58         | automerge |
| class    | iterate visible values                                  | 5,000 | 250    | 0.12         | 8,616.5        | 0.23      | 4,265.59      | 2.17           | 461.54           | 0.08            | 12,574.12         | automerge |
| class    | collect visible values to array                         | 5,000 | 250    | 0.11         | 8,969.29       | 0.24      | 4,251.74      | 1.55           | 646.33           | 0.08            | 12,686.36         | automerge |
| class    | append / single after tail                              | 5,000 | 250    | 0.01         | 116,257.44     | 0.03      | 39,063.72     | 0.04           | 27,920.48        | 1.91            | 524.7             | crlist    |
| class    | append / batch after tail                               | 5,000 | 25,000 | 0.01         | 186,976        | 0         | 551,950.7     | 0.01           | 160,734.8        | 0.19            | 5,318.02          | yjs       |
| class    | prepend / single before head                            | 5,000 | 250    | 0.01         | 117,426.02     | 0.01      | 80,665.98     | 0.01           | 133,141.61       | 1.88            | 531.29            | json-joy  |
| class    | prepend / batch before head                             | 5,000 | 25,000 | 0            | 201,010.2      | 0         | 747,261.29    | 0.01           | 193,942.63       | 0.19            | 5,357.42          | yjs       |
| class    | insert / single before middle                           | 5,000 | 250    | 0.01         | 119,144.07     | 0.02      | 60,957.77     | 0.01           | 152,690.4        | 1.91            | 524.28            | json-joy  |
| class    | insert / batch before middle                            | 5,000 | 25,000 | 0.01         | 157,395.25     | 0         | 837,447.99    | 0.01           | 185,594.87       | 0.19            | 5,279.28          | yjs       |
| class    | overwrite / head                                        | 5,000 | 250    | 0.01         | 115,133.09     | 0.02      | 55,894.65     | 0.04           | 27,467.7         | 2.15            | 465.54            | crlist    |
| class    | overwrite / middle                                      | 5,000 | 250    | 0.03         | 32,872.25      | 0.02      | 49,455.01     | 0.04           | 23,554.91        | 1.87            | 534.32            | yjs       |
| class    | overwrite / tail                                        | 5,000 | 250    | 0.01         | 123,554.41     | 0.02      | 62,322.38     | 0.01           | 147,832.77       | 1.94            | 516.35            | json-joy  |
| class    | overwrite / random                                      | 5,000 | 250    | 0.01         | 84,493.71      | 0.03      | 29,451.61     | 0.01           | 106,116.56       | 2.31            | 433.48            | json-joy  |
| class    | remove / head                                           | 5,000 | 250    | 0.01         | 92,674.97      | 0.02      | 53,813.2      | 0.02           | 43,400.52        | 0.3             | 3,383.85          | crlist    |
| class    | remove / middle                                         | 5,000 | 250    | 0.01         | 102,825.65     | 0.01      | 88,983.8      | 0.03           | 30,599.38        | 0.26            | 3,862.64          | crlist    |
| class    | remove / tail                                           | 5,000 | 250    | 0            | 407,232.45     | 0.02      | 65,243.49     | 0              | 295,403.52       | 0.25            | 3,940.36          | crlist    |
| class    | remove / range from head                                | 5,000 | 5,000  | 0            | 1,925,817.51   | 0         | 8,975,049.36  | 0              | 353,754.4        | 0.02            | 54,645.05         | yjs       |
| class    | remove / range from middle                              | 5,000 | 5,000  | 0            | 1,449,443.41   | 0         | 7,806,401.25  | 0              | 331,870.89       | 0.02            | 57,956.63         | yjs       |
| class    | remove / range from tail                                | 5,000 | 5,000  | 0            | 1,424,136.26   | 0         | 8,812,125.48  | 0              | 338,964.67       | 0.02            | 63,849.38         | yjs       |
| class    | mixed / append overwrite remove tail                    | 5,000 | 250    | 0.01         | 131,606.65     | 0.02      | 56,256.89     | 0.01           | 156,210.95       | 1.41            | 711.67            | json-joy  |
| class    | mixed / prepend overwrite remove head                   | 5,000 | 250    | 0.01         | 125,476.81     | 0.01      | 78,049.39     | 0.01           | 142,759.25       | 1.67            | 600.33            | json-joy  |
| class    | mixed / insert overwrite remove middle                  | 5,000 | 250    | 0.01         | 119,858.09     | 0.01      | 75,160.84     | 0.01           | 149,799.27       | 1.68            | 596.94            | json-joy  |
| class    | paste / insert 10,000 entries at cursor                 | 5,000 | 10,000 | 0.01         | 137,970.62     | 0         | 682,598.52    | 0.01           | 97,798.75        | 0.17            | 5,788.79          | yjs       |
| class    | render / join visible entries to string                 | 5,000 | 250    | 0.22         | 4,642.05       | 0.35      | 2,893.06      | 2.71           | 369.06           | 0.17            | 5,992.23          | automerge |
| class    | snapshot                                                | 5,000 | 250    | 0.24         | 4,237.65       | 3.79      | 263.59        | 7.87           | 127.14           | 15.61           | 64.05             | crlist    |
| class    | snapshot / tombstoned state 50% deleted                 | 5,000 | 250    | 0.15         | 6,874.55       | 1.94      | 516.49        | 3.68           | 271.93           | 15.4            | 64.93             | crlist    |
| class    | snapshot / after garbage collection                     | 5,000 | 250    | 0.1          | 10,299.3       | 0.25      | 4,033.39      | 2.48           | 402.51           | 0.08            | 13,090.65         | automerge |
| class    | acknowledge                                             | 5,000 | 250    | 0.05         | 18,589.02      | n/a       | n/a           | n/a            | n/a              | n/a             | n/a               | n/a       |
| class    | acknowledge / 50% deleted state                         | 5,000 | 250    | 0.08         | 13,244.05      | n/a       | n/a           | n/a            | n/a              | n/a             | n/a               | n/a       |
| class    | acknowledge / 90% deleted state                         | 5,000 | 250    | 0.1          | 10,492.21      | n/a       | n/a           | n/a            | n/a              | n/a             | n/a               | n/a       |
| class    | garbage collect                                         | 5,000 | 250    | 0.12         | 8,513.1        | 0.25      | 4,066.89      | 1.97           | 508.6            | 0.08            | 13,075.79         | automerge |
| class    | garbage collect / no eligible tombstones                | 5,000 | 250    | 0.13         | 7,677.24       | 0.23      | 4,264.1       | 1.58           | 631.22           | 0.07            | 14,292.57         | automerge |
| class    | garbage collect / 90% eligible tombstones               | 5,000 | 250    | 0.11         | 9,454.76       | 0.24      | 4,188.87      | 1.73           | 579.23           | 0.07            | 14,070.48         | automerge |
| class    | merge ordered deltas                                    | 5,000 | 250    | 0.02         | 45,772.46      | 0.02      | 56,365.97     | 0              | 207,296.85       | 3.07            | 325.8             | json-joy  |
| class    | merge shuffled gossip                                   | 5,000 | 250    | 0.65         | 1,544.69       | 0.39      | 2,566.82      | n/a            | n/a              | 0.74            | 1,349.37          | yjs       |
| class    | merge / duplicate delta ignored                         | 5,000 | 250    | 0            | 1,068,832.83   | 0.03      | 37,707.96     | 0              | 315,457.41       | 0.04            | 27,427.02         | crlist    |
| class    | merge / concurrent prepends same head                   | 5,000 | 2      | 0.98         | 1,017.19       | 0.06      | 15,455.95     | n/a            | n/a              | 15.21           | 65.77             | yjs       |
| class    | merge / concurrent appends same tail                    | 5,000 | 2      | 0.02         | 44,843.05      | 0.03      | 31,595.58     | n/a            | n/a              | 9.04            | 110.58            | crlist    |
| class    | merge / concurrent inserts same middle position         | 5,000 | 2      | 0.99         | 1,014.2        | 0.04      | 26,212.32     | n/a            | n/a              | 10.83           | 92.38             | yjs       |
| class    | merge / forked replicas rejoin after 250 ops each       | 5,000 | 500    | 0.42         | 2,383.99       | 0.01      | 102,631.47    | n/a            | n/a              | 3.26            | 307.16            | yjs       |
| latency  | append tail write to remote visible                     | 5,000 | 250    | 0.41         | 2,440.4        | 0.24      | 4,095.83      | 11.13          | 89.82            | 5.92            | 168.85            | yjs       |
| latency  | prepend head write to remote visible                    | 5,000 | 250    | 0.06         | 17,264.72      | 0.03      | 32,283.89     | 0.02           | 60,488.75        | 5.77            | 173.25            | json-joy  |
| latency  | middle insert write to remote visible                   | 5,000 | 250    | 0.31         | 3,194.68       | 0.13      | 7,604.01      | 3.84           | 260.08           | 5.79            | 172.63            | yjs       |
| latency  | head insert write to remote visible                     | 5,000 | 250    | 0.06         | 16,872.63      | 0.02      | 42,702.19     | 0.02           | 57,873.05        | 5.87            | 170.27            | json-joy  |
| latency  | overwrite head write to remote visible                  | 5,000 | 250    | 0.08         | 12,646.83      | 0.04      | 26,393.02     | 0.04           | 26,800.45        | 5.89            | 169.75            | json-joy  |
| latency  | overwrite middle write to remote visible                | 5,000 | 250    | 0.34         | 2,932.47       | 0.14      | 6,924.21      | 2.94           | 339.61           | 5.82            | 171.69            | yjs       |
| latency  | overwrite tail write to remote visible                  | 5,000 | 250    | 0.83         | 1,206.19       | 0.23      | 4,342.88      | 5.62           | 177.9            | 5.76            | 173.75            | yjs       |
| latency  | head delete to remote hidden                            | 5,000 | 250    | 0.73         | 1,360.91       | 0.27      | 3,686.7       | 5.53           | 180.88           | 2.21            | 453.17            | yjs       |
| latency  | middle delete to remote hidden                          | 5,000 | 250    | 0.65         | 1,536.12       | 0.28      | 3,604.05      | 5.39           | 185.7            | 2.24            | 446.89            | yjs       |
| latency  | tail delete to remote hidden                            | 5,000 | 250    | 0.33         | 3,021.86       | 0.23      | 4,405.66      | 5.39           | 185.53           | 2.2             | 453.57            | yjs       |
| latency  | append tail write to 10 remotes visible                 | 5,000 | 2,500  | 0.47         | 2,132.75       | 0.21      | 4,855.2       | 11.88          | 84.15            | 4.05            | 246.69            | yjs       |
| latency  | prepend head write to 10 remotes visible                | 5,000 | 2,500  | 0.14         | 7,060.6        | 0.01      | 91,213.25     | 0.01           | 72,979.28        | 3.95            | 252.95            | yjs       |
| latency  | middle insert write to 10 remotes visible               | 5,000 | 2,500  | 0.34         | 2,910.61       | 0.13      | 7,817.54      | 4.71           | 212.28           | 4.04            | 247.33            | yjs       |
| latency  | overwrite middle write to 10 remotes visible            | 5,000 | 2,500  | 0.33         | 3,054.15       | 0.11      | 9,041.86      | 3.22           | 310.83           | 3.84            | 260.32            | yjs       |
| latency  | delete middle to 10 remotes hidden                      | 5,000 | 2,500  | 0.69         | 1,454.65       | 0.25      | 4,011.48      | 6.32           | 158.18           | 1.89            | 530.1             | yjs       |
| latency  | out-of-order write delivery to remote visible           | 5,000 | 250    | 1.38         | 725.44         | 72.98     | 13.7          | n/a            | n/a              | 20.46           | 48.88             | crlist    |
| latency  | out-of-order delete delivery to remote convergence      | 5,000 | 165    | 2.05         | 488.04         | 0.22      | 4,474.72      | 7.46           | 134              | 7.02            | 142.46            | yjs       |
| latency  | out-of-order append delivery to convergence             | 5,000 | 250    | 1.49         | 671.6          | 20.62     | 48.5          | n/a            | n/a              | 16.51           | 60.58             | crlist    |
| latency  | out-of-order prepend delivery to convergence            | 5,000 | 250    | 1.36         | 737.7          | 21.54     | 46.42         | 0.12           | 8,565.9          | 15.63           | 63.98             | json-joy  |
| latency  | out-of-order middle insert delivery to convergence      | 5,000 | 250    | 1.45         | 690.32         | 75.71     | 13.21         | n/a            | n/a              | 16.7            | 59.87             | crlist    |
| latency  | out-of-order overwrite delivery to convergence          | 5,000 | 129    | 2.15         | 464.91         | n/a       | n/a           | 242.72         | 4.12             | 75.71           | 13.21             | crlist    |
| latency  | offline burst 1,000 ops then sync                       | 5,000 | 1,000  | 0.02         | 54,560.73      | 0.03      | 39,603.96     | 0              | 261,910.37       | 3.33            | 300.51            | json-joy  |
| latency  | forked replicas mixed ops then converge                 | 5,000 | 500    | 0.01         | 102,857.38     | 0.01      | 73,691.97     | n/a            | n/a              | 3.25            | 308               | crlist    |
| latency  | duplicate shuffled gossip to convergence                | 5,000 | 500    | 0.29         | 3,469.52       | 0.23      | 4,381.49      | n/a            | n/a              | 0.41            | 2,460.63          | yjs       |
| latency  | remote snapshot hydrate then apply pending deltas       | 5,000 | 250    | 0.02         | 52,428.49      | 0.05      | 21,475.63     | 0.1            | 9,992.61         | 0.74            | 1,350.64          | crlist    |
| workload | local app session                                       | 5,000 | 250    | 0.01         | 70,675.37      | 0.01      | 68,069.81     | 0.04           | 27,522.13        | 1.23            | 813.43            | crlist    |
| workload | read heavy session                                      | 5,000 | 250    | 0            | 2,071,251.04   | 0         | 4,621,072.09  | 0              | 391,604.01       | 0               | 3,117,206.98      | yjs       |
| workload | write heavy session                                     | 5,000 | 250    | 0.01         | 88,436.1       | 0.01      | 70,285.92     | 0.01           | 140,260.32       | 1.22            | 820.27            | json-joy  |
| workload | append tail heavy session                               | 5,000 | 250    | 0.01         | 144,225.22     | 0.02      | 49,807.74     | 0.01           | 109,861.14       | 1.57            | 637.52            | crlist    |
| workload | prepend head heavy session                              | 5,000 | 250    | 0.01         | 69,427.09      | 0.01      | 83,439.02     | 0.01           | 151,781.92       | 1.71            | 583.18            | json-joy  |
| workload | insert middle heavy session                             | 5,000 | 250    | 0.01         | 73,477.55      | 0.02      | 59,778.58     | 0.04           | 27,004.26        | 1.6             | 626.77            | crlist    |
| workload | overwrite heavy session                                 | 5,000 | 250    | 0.01         | 77,973.93      | 0.01      | 76,767.18     | 0.03           | 28,581.88        | 1.32            | 755.64            | crlist    |
| workload | delete heavy session                                    | 5,000 | 250    | 0.01         | 103,601.18     | 0.02      | 63,892.86     | 0              | 257,360.51       | 0.23            | 4,290.09          | json-joy  |
| workload | balanced append prepend insert overwrite delete session | 5,000 | 250    | 0.01         | 67,369.1       | 0.01      | 80,783.27     | 0.01           | 155,734.13       | 1.38            | 722.38            | json-joy  |
| workload | random edit session                                     | 5,000 | 250    | 0.02         | 47,621.77      | 0.02      | 42,690.53     | 0.04           | 25,976.45        | 1.35            | 741.75            | crlist    |
| workload | text editing session                                    | 5,000 | 250    | 0.01         | 68,558.89      | 0.01      | 85,100.59     | 0.01           | 153,477.81       | 1.6             | 624.19            | json-joy  |
| workload | collaborative offline session                           | 5,000 | 500    | 0.01         | 106,700.81     | 0.01      | 126,036.65    | n/a            | n/a              | 3.25            | 308.16            | yjs       |
| workload | sync and cleanup session                                | 5,000 | 252    | 0.01         | 71,991.77      | 0.01      | 117,536.44    | n/a            | n/a              | 3.31            | 302.47            | yjs       |
| workload | long lived tombstoned session                           | 5,000 | 250    | 0.01         | 138,083.4      | 0.01      | 83,319.45     | 0.01           | 150,957.07       | 1.82            | 548.98            | json-joy  |
| workload | sparse visible session                                  | 5,000 | 250    | 0.01         | 81,053.04      | 0.12      | 8,197.15      | 0.01           | 96,536.28        | 1.14            | 874.84            | json-joy  |
| workload | post-gc edit session                                    | 5,000 | 250    | 0.01         | 156,045.19     | 0.02      | 53,775.01     | 0.04           | 28,205.56        | 1.95            | 512.04            | crlist    |

## License

Apache-2.0
