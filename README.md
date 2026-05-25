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
| crud     | create / empty list                                     | 5,000 | 250    | 0.03         | 29,941.91      | 0.15      | 6,736.62      | 0.02           | 44,642.86        | 0.37            | 2,678.04          | json-joy  |
| crud     | create / hydrate snapshot                               | 5,000 | 250    | 6.1          | 163.97         | 7.63      | 131.1         | 20.03          | 49.93            | 166.56          | 6                 | crlist    |
| crud     | create / hydrate clean snapshot                         | 5,000 | 250    | 6.25         | 159.88         | 7.1       | 140.75        | 21.24          | 47.08            | 165.47          | 6.04              | crlist    |
| crud     | create / hydrate tombstoned snapshot                    | 5,000 | 250    | 3.39         | 294.97         | 3.56      | 280.8         | 9.63           | 103.88           | 169.96          | 5.88              | crlist    |
| crud     | read / head                                             | 5,000 | 250    | 0            | 1,594,387.76   | 0         | 1,025,010.25  | 0              | 242,271.54       | 0               | 3,293,807.64      | automerge |
| crud     | read / middle                                           | 5,000 | 250    | 0            | 2,510,040.16   | 0         | 2,224,199.29  | 0              | 677,506.78       | 0               | 8,802,816.9       | automerge |
| crud     | read / tail                                             | 5,000 | 250    | 0            | 4,480,286.74   | 0         | 2,390,057.36  | 0              | 623,596.91       | 0               | 7,716,049.38      | automerge |
| crud     | read / random indexed reads                             | 5,000 | 250    | 0            | 609,013.4      | 0         | 814,332.25    | 0.01           | 154,952.27       | 0               | 1,208,313.19      | automerge |
| crud     | read / sequential indexed reads from head               | 5,000 | 250    | 0            | 702,444.51     | 0         | 1,104,728.24  | 0              | 261,834.94       | 0               | 1,255,650.43      | automerge |
| crud     | read / sequential indexed reads from middle             | 5,000 | 250    | 0            | 2,030,869.21   | 0         | 2,587,991.72  | 0              | 290,258.91       | 0               | 8,710,801.39      | automerge |
| crud     | read / sequential indexed reads from tail               | 5,000 | 250    | 0            | 2,808,988.76   | 0         | 2,059,308.07  | 0              | 308,109.44       | 0               | 8,250,825.08      | automerge |
| crud     | read / full iteration visible values                    | 5,000 | 250    | 1.02         | 977.49         | 0.24      | 4,109.02      | 1.81           | 553.41           | 0.08            | 11,987.25         | automerge |
| crud     | read / collect visible values to array                  | 5,000 | 250    | 1.29         | 774.81         | 0.22      | 4,472.03      | 2.03           | 492.55           | 0.1             | 10,431.01         | automerge |
| crud     | read / visible sparse over deleted entries              | 5,000 | 250    | 0            | 2,500,000      | 0.04      | 25,064.67     | 0.03           | 36,121.95        | 0               | 9,765,625         | automerge |
| crud     | find / head                                             | 5,000 | 250    | 0            | 703,234.88     | 0         | 1,882,530.12  | 0              | 543,596.43       | 0               | 1,580,278.13      | yjs       |
| crud     | find / middle                                           | 5,000 | 250    | 0.44         | 2,296.44       | 0.12      | 8,151.29      | 0.77           | 1,297.47         | 0.01            | 79,531.72         | automerge |
| crud     | find / tail                                             | 5,000 | 250    | 0.57         | 1,754.33       | 0.22      | 4,580.47      | 1.87           | 535.63           | 0.02            | 42,234.01         | automerge |
| crud     | find / missing value                                    | 5,000 | 250    | 0.62         | 1,611.3        | 0.23      | 4,417.02      | 1.89           | 528.79           | 0.03            | 32,051.69         | automerge |
| crud     | append / single after tail                              | 5,000 | 250    | 0.01         | 168,611.32     | 0.03      | 36,596.79     | 0.04           | 23,151.36        | 1.91            | 523.71            | crlist    |
| crud     | append / batch after tail                               | 5,000 | 25,000 | 0            | 1,010,962.88   | 0         | 486,662.53    | 0.01           | 124,405.09       | 0.19            | 5,334.35          | crlist    |
| crud     | append / batch after deleted tail                       | 5,000 | 25,000 | 0            | 1,196,097.85   | 0         | 559,169.03    | 0.01           | 151,697.56       | 0.19            | 5,327.63          | crlist    |
| crud     | append / batch after garbage collection                 | 5,000 | 25,000 | 0            | 1,036,866.84   | 0         | 634,583.8     | 0.01           | 147,132.3        | 0.19            | 5,295.71          | crlist    |
| crud     | prepend / single before head                            | 5,000 | 250    | 0.01         | 154,064.21     | 0.02      | 60,091.82     | 0.01           | 96,696.84        | 2.03            | 492.03            | crlist    |
| crud     | prepend / batch before head                             | 5,000 | 25,000 | 0            | 1,139,611.53   | 0         | 749,238.77    | 0.01           | 153,139.92       | 0.19            | 5,172.05          | crlist    |
| crud     | prepend / batch before deleted head                     | 5,000 | 25,000 | 0            | 1,098,587.22   | 0         | 808,099.09    | 0.01           | 186,746.38       | 0.2             | 5,125.86          | crlist    |
| crud     | prepend / batch after garbage collection                | 5,000 | 25,000 | 0            | 1,080,753.93   | 0         | 610,484.21    | 0.01           | 191,471.84       | 0.18            | 5,440.08          | crlist    |
| crud     | insert / single before head                             | 5,000 | 250    | 0.01         | 179,791.44     | 0.01      | 66,744.98     | 0.01           | 120,336.94       | 2.07            | 484.1             | crlist    |
| crud     | insert / single after head                              | 5,000 | 250    | 0.01         | 127,883.78     | 0.02      | 55,501.29     | 0.04           | 25,453.32        | 1.99            | 502.13            | crlist    |
| crud     | insert / single before middle                           | 5,000 | 250    | 0.01         | 126,974.45     | 0.02      | 50,537.72     | 0.04           | 24,652.16        | 1.99            | 502.03            | crlist    |
| crud     | insert / single after middle                            | 5,000 | 250    | 0.01         | 127,642.19     | 0.02      | 52,065.98     | 0.03           | 30,046.27        | 1.93            | 518.75            | crlist    |
| crud     | insert / single before tail                             | 5,000 | 250    | 0.01         | 78,288.92      | 0.03      | 30,714.42     | 0.04           | 28,442.71        | 2               | 500.38            | crlist    |
| crud     | insert / single after tail                              | 5,000 | 250    | 0.01         | 143,233.64     | 0.03      | 35,798.16     | 0.03           | 30,642.89        | 2.03            | 491.88            | crlist    |
| crud     | insert / batch before head                              | 5,000 | 25,000 | 0            | 715,000.72     | 0         | 787,443.74    | 0.01           | 176,125.3        | 0.19            | 5,136.55          | yjs       |
| crud     | insert / batch after head                               | 5,000 | 25,000 | 0            | 975,099.85     | 0         | 710,586.6     | 0.01           | 183,321.69       | 0.19            | 5,285.98          | crlist    |
| crud     | insert / batch before middle                            | 5,000 | 25,000 | 0            | 573,460.26     | 0         | 736,494.17    | 0.01           | 189,269.62       | 0.19            | 5,231.79          | yjs       |
| crud     | insert / batch after middle                             | 5,000 | 25,000 | 0            | 672,779.09     | 0         | 774,334.23    | 0.01           | 163,978.94       | 0.21            | 4,805.59          | yjs       |
| crud     | insert / batch before tail                              | 5,000 | 25,000 | 0            | 1,171,355.21   | 0         | 648,939.37    | 0.01           | 160,044.66       | 0.19            | 5,246.01          | crlist    |
| crud     | insert / batch after tail                               | 5,000 | 25,000 | 0            | 1,262,894.15   | 0         | 512,199.57    | 0.01           | 124,984.13       | 0.19            | 5,220.01          | crlist    |
| crud     | insert / repeated before head                           | 5,000 | 250    | 0            | 210,420        | 0.01      | 88,614.77     | 0.04           | 27,560.66        | 2.07            | 483.25            | crlist    |
| crud     | insert / repeated before middle                         | 5,000 | 250    | 0.01         | 133,390.25     | 0.01      | 67,892.35     | 0.04           | 27,378.66        | 2.08            | 480.68            | crlist    |
| crud     | insert / repeated before tail                           | 5,000 | 250    | 0.01         | 123,719.5      | 0.01      | 72,693.44     | 0.03           | 32,166.75        | 1.94            | 515.64            | crlist    |
| crud     | insert / random positions                               | 5,000 | 250    | 0.01         | 188,864.55     | 0.04      | 28,512.77     | 0.08           | 12,650.99        | 1.95            | 513.49            | crlist    |
| crud     | insert / alternating head and tail                      | 5,000 | 250    | 0.03         | 33,599.89      | 0.01      | 88,552        | 0.01           | 120,452.9        | 2               | 500.95            | json-joy  |
| crud     | overwrite / head                                        | 5,000 | 250    | 0.01         | 95,024.52      | 0.03      | 31,778.31     | 0.02           | 53,909.52        | 2.17            | 461.89            | crlist    |
| crud     | overwrite / middle                                      | 5,000 | 250    | 0.01         | 113,786.35     | 0.02      | 45,006.93     | 0.01           | 96,648.24        | 2.16            | 463.64            | crlist    |
| crud     | overwrite / tail                                        | 5,000 | 250    | 0.01         | 141,819.83     | 0.02      | 43,489.61     | 0.03           | 29,224.04        | 2               | 500.44            | crlist    |
| crud     | overwrite / random                                      | 5,000 | 250    | 0.03         | 34,736.21      | 0.03      | 29,050.85     | 0.04           | 25,802.99        | 2.26            | 441.8             | crlist    |
| crud     | overwrite / same head repeatedly                        | 5,000 | 250    | 0.01         | 137,121.54     | 0.02      | 50,509.13     | 0.04           | 27,673.54        | 2.17            | 460.81            | crlist    |
| crud     | overwrite / same middle repeatedly                      | 5,000 | 250    | 0.01         | 121,957.17     | 0.02      | 40,778.38     | 0.04           | 26,351.57        | 2.03            | 493.76            | crlist    |
| crud     | overwrite / same tail repeatedly                        | 5,000 | 250    | 0.01         | 148,703.31     | 0.02      | 48,340.94     | 0.04           | 26,133.95        | 2.01            | 498.67            | crlist    |
| crud     | overwrite / random visible entries                      | 5,000 | 250    | 0.03         | 32,777.86      | 0.04      | 27,520.61     | 0.04           | 26,447.19        | 2.32            | 430.8             | crlist    |
| crud     | overwrite / after insert                                | 5,000 | 250    | 0.01         | 88,990.14      | 0.02      | 46,752.57     | 0.05           | 21,581.31        | 2.04            | 490.04            | crlist    |
| crud     | overwrite / after delete                                | 5,000 | 250    | 0.01         | 101,071.36     | 0.02      | 48,110.23     | 0.01           | 113,188.75       | 2.15            | 465.34            | json-joy  |
| crud     | delete / head                                           | 5,000 | 250    | 0.01         | 102,796.05     | 0.02      | 49,113.02     | 0.03           | 38,948.7         | 0.26            | 3,899.95          | crlist    |
| crud     | delete / middle                                         | 5,000 | 250    | 0.01         | 123,866.62     | 0.02      | 62,162.77     | 0.04           | 27,155.91        | 0.27            | 3,747.89          | crlist    |
| crud     | delete / tail                                           | 5,000 | 250    | 0            | 366,837.86     | 0.02      | 56,919.08     | 0              | 226,346.76       | 0.26            | 3,863.83          | crlist    |
| crud     | delete / range from head                                | 5,000 | 5,000  | 0            | 668,932.12     | 0         | 8,607,333.45  | 0              | 338,767.16       | 0.02            | 49,555.24         | yjs       |
| crud     | delete / range from middle                              | 5,000 | 5,000  | 0            | 396,491.84     | 0         | 6,388,143.61  | 0              | 283,416.19       | 0.02            | 59,560.47         | yjs       |
| crud     | delete / range from tail                                | 5,000 | 5,000  | 0            | 466,087.48     | 0         | 8,420,343.55  | 0              | 256,064.9        | 0.02            | 59,080.98         | yjs       |
| crud     | delete / every other entry                              | 5,000 | 2,500  | 0.01         | 121,394.58     | 0.09      | 11,172.6      | 0.09           | 10,723.08        | 0.26            | 3,916.06          | crlist    |
| crud     | delete / all entries from head one by one               | 5,000 | 5,000  | 0.01         | 132,945.13     | 0.01      | 75,542.85     | 0.01           | 119,332.6        | 0.21            | 4,671.64          | crlist    |
| crud     | delete / all entries from middle outward                | 5,000 | 5,000  | 0.01         | 101,645.85     | 0.01      | 97,803.72     | 0.01           | 167,369.06       | 0.23            | 4,324.83          | json-joy  |
| crud     | delete / all entries from tail one by one               | 5,000 | 5,000  | 0            | 419,403.27     | 0.01      | 87,849.84     | 0              | 230,600.71       | 0.21            | 4,665.43          | crlist    |
| crud     | delete / all entries in random order                    | 5,000 | 5,000  | 0.17         | 5,780.96       | 13.19     | 75.81         | 9.37           | 106.74           | 0.27            | 3,694.74          | crlist    |
| crud     | delete / already deleted head                           | 5,000 | 250    | 0            | 337,427.45     | 0         | 236,764.85    | 0              | 549,450.55       | 0.02            | 41,618.81         | json-joy  |
| crud     | delete / already deleted middle                         | 5,000 | 250    | 0            | 477,828.75     | 0         | 310,636.18    | 0              | 983,864.62       | 0.03            | 38,743.47         | json-joy  |
| crud     | delete / already deleted tail                           | 5,000 | 250    | 0            | 2,003,205.13   | 0         | 256,515.49    | 0              | 813,272.61       | 0.03            | 29,725.81         | crlist    |
| crud     | mixed / append overwrite delete tail                    | 5,000 | 250    | 0.01         | 146,842.88     | 0.04      | 23,510.38     | 0.05           | 21,828.15        | 1.74            | 573.4             | crlist    |
| crud     | mixed / prepend overwrite delete head                   | 5,000 | 250    | 0.01         | 154,942.67     | 0.02      | 57,209.55     | 0.01           | 104,760.31       | 1.78            | 563.05            | crlist    |
| crud     | mixed / insert overwrite delete middle                  | 5,000 | 250    | 0.01         | 128,145.98     | 0.02      | 58,222.13     | 0.01           | 137,061.4        | 1.72            | 581.34            | json-joy  |
| crud     | mixed / append prepend insert overwrite delete          | 5,000 | 250    | 0.01         | 140,884.76     | 0.02      | 51,649.69     | 0.04           | 24,608.24        | 1.73            | 577.94            | crlist    |
| mags     | snapshot                                                | 5,000 | 250    | 4.44         | 225.3          | 3.76      | 265.74        | 7.85           | 127.41           | 15.82           | 63.21             | yjs       |
| mags     | snapshot / clean state                                  | 5,000 | 250    | 4.72         | 211.82         | 3.82      | 261.94        | 7.91           | 126.42           | 15.6            | 64.12             | yjs       |
| mags     | snapshot / tombstoned state 50% deleted                 | 5,000 | 250    | 2.04         | 490.55         | 1.96      | 511.43        | 3.57           | 280.23           | 15.88           | 62.97             | yjs       |
| mags     | snapshot / tombstoned state 90% deleted                 | 5,000 | 250    | 0.39         | 2,543.27       | 0.38      | 2,630.96      | 0.54           | 1,858.31         | 16.37           | 61.09             | yjs       |
| mags     | snapshot / after garbage collection                     | 5,000 | 250    | 2.19         | 457.28         | 1.93      | 517.98        | 3.53           | 283.45           | 15.58           | 64.2              | yjs       |
| mags     | acknowledge                                             | 5,000 | 250    | 0            | 964,134.21     | n/a       | n/a           | n/a            | n/a              | n/a             | n/a               | n/a       |
| mags     | acknowledge / clean state                               | 5,000 | 250    | 0            | 3,037,667.07   | n/a       | n/a           | n/a            | n/a              | n/a             | n/a               | n/a       |
| mags     | acknowledge / 50% deleted state                         | 5,000 | 250    | 0.49         | 2,037.02       | n/a       | n/a           | n/a            | n/a              | n/a             | n/a               | n/a       |
| mags     | acknowledge / 90% deleted state                         | 5,000 | 250    | 0.85         | 1,176.58       | n/a       | n/a           | n/a            | n/a              | n/a             | n/a               | n/a       |
| mags     | garbage collect                                         | 5,000 | 250    | 0            | 1,266,464.03   | n/a       | n/a           | n/a            | n/a              | n/a             | n/a               | n/a       |
| mags     | garbage collect / no eligible tombstones                | 5,000 | 250    | 0            | 6,313,131.31   | n/a       | n/a           | n/a            | n/a              | n/a             | n/a               | n/a       |
| mags     | garbage collect / 50% eligible tombstones               | 5,000 | 250    | 0.01         | 191,688.39     | n/a       | n/a           | n/a            | n/a              | n/a             | n/a               | n/a       |
| mags     | garbage collect / 90% eligible tombstones               | 5,000 | 250    | 0.01         | 145,628.24     | n/a       | n/a           | n/a            | n/a              | n/a             | n/a               | n/a       |
| mags     | garbage collect / partial frontiers 2 replicas          | 5,000 | 250    | 0            | 4,655,493.48   | n/a       | n/a           | n/a            | n/a              | n/a             | n/a               | n/a       |
| mags     | garbage collect / partial frontiers 10 replicas         | 5,000 | 250    | 0            | 5,995,203.84   | n/a       | n/a           | n/a            | n/a              | n/a             | n/a               | n/a       |
| mags     | post-gc read / full iteration visible values            | 5,000 | 250    | 0.47         | 2,137.94       | 0.11      | 9,475.26      | 0.71           | 1,411.05         | 0.03            | 29,931.52         | automerge |
| mags     | merge ordered deltas                                    | 5,000 | 250    | 0.24         | 4,247.29       | 0.02      | 53,395.98     | 0.01           | 189,638.17       | 3.38            | 295.69            | json-joy  |
| mags     | merge shuffled gossip                                   | 5,000 | 250    | 2.39         | 418.29         | 0.77      | 1,304.87      | n/a            | n/a              | 0.77            | 1,298.93          | yjs       |
| mags     | merge / append head delta into equal replica            | 5,000 | 1      | 0.67         | 1,503.76       | 0.08      | 12,531.33     | 0.05           | 21,505.38        | 3.74            | 267.63            | json-joy  |
| mags     | merge / append tail delta into equal replica            | 5,000 | 1      | 0.05         | 20,876.83      | 0.03      | 30,120.48     | 0.01           | 94,339.62        | 4.47            | 223.96            | json-joy  |
| mags     | merge / prepend head delta into equal replica           | 5,000 | 1      | 1.11         | 902.28         | 0.04      | 23,201.86     | 0.01           | 96,153.85        | 3.53            | 283.09            | json-joy  |
| mags     | merge / insert middle delta into equal replica          | 5,000 | 1      | 0.85         | 1,180.92       | 0.03      | 30,581.04     | 0.02           | 64,935.06        | 3.65            | 274.12            | json-joy  |
| mags     | merge / overwrite head delta into equal replica         | 5,000 | 1      | 1.79         | 558            | 0.03      | 29,585.8      | 0.01           | 72,463.77        | 3.41            | 293.49            | json-joy  |
| mags     | merge / overwrite middle delta into equal replica       | 5,000 | 1      | 0.52         | 1,919.75       | 0.04      | 22,421.52     | 0.05           | 19,920.32        | 3.8             | 262.86            | yjs       |
| mags     | merge / overwrite tail delta into equal replica         | 5,000 | 1      | 0.04         | 24,213.08      | 0.04      | 23,094.69     | 0.01           | 81,967.21        | 3.5             | 286.11            | json-joy  |
| mags     | merge / delete head delta into equal replica            | 5,000 | 1      | 2.12         | 472.34         | 0.02      | 45,454.55     | 0.02           | 60,606.06        | 2.2             | 454.32            | json-joy  |
| mags     | merge / delete middle delta into equal replica          | 5,000 | 1      | 0.53         | 1,900.78       | 0.1       | 10,471.2      | 0.06           | 15,822.78        | 1.92            | 522.08            | json-joy  |
| mags     | merge / delete tail delta into equal replica            | 5,000 | 1      | 0.03         | 37,453.18      | 0.02      | 43,103.45     | 0.01           | 91,743.12        | 2.11            | 474.16            | json-joy  |
| mags     | merge / duplicate delta ignored                         | 5,000 | 250    | 0            | 568,828.21     | 0.03      | 38,032.07     | 0.01           | 119,337.44       | 0.04            | 27,592.3          | crlist    |
| mags     | merge / old delta ignored after merge                   | 5,000 | 250    | 0            | 624,375.62     | 0.02      | 41,287.51     | 0              | 267,322.5        | 0.03            | 29,175.95         | crlist    |
| mags     | merge / ordered 1,000 append deltas                     | 5,000 | 1,000  | 0.01         | 170,861.31     | 0.02      | 52,137.37     | 0              | 244,349.42       | 3.7             | 270.11            | json-joy  |
| mags     | merge / ordered 1,000 prepend deltas                    | 5,000 | 1,000  | 0.57         | 1,769.27       | 0.01      | 97,510.56     | 0.02           | 51,472.1         | 3.83            | 261.04            | yjs       |
| mags     | merge / ordered 1,000 middle insert deltas              | 5,000 | 1,000  | 0.25         | 4,052.53       | 0.01      | 99,437.19     | 0.01           | 71,907.79        | 4.45            | 224.51            | yjs       |
| mags     | merge / shuffled 1,000 mixed deltas                     | 5,000 | 1,000  | 2.69         | 371.3          | 1.35      | 741.92        | n/a            | n/a              | 0.92            | 1,090.99          | automerge |
| mags     | merge / reverse ordered 1,000 mixed deltas              | 5,000 | 1,000  | 0.62         | 1,622.74       | 1.25      | 802.4         | n/a            | n/a              | 0.94            | 1,060.86          | crlist    |
| mags     | merge / concurrent prepends same head                   | 5,000 | 2      | 4.2          | 238.11         | 0.1       | 10,362.69     | n/a            | n/a              | 12.21           | 81.88             | yjs       |
| mags     | merge / concurrent appends same tail                    | 5,000 | 2      | 0.05         | 22,148.39      | 0.03      | 29,154.52     | n/a            | n/a              | 9.64            | 103.78            | yjs       |
| mags     | merge / concurrent inserts same middle position         | 5,000 | 2      | 3.28         | 304.85         | 0.05      | 20,986.36     | n/a            | n/a              | 15.72           | 63.62             | yjs       |
| mags     | merge / concurrent overwrites same head                 | 5,000 | 2      | 15.29        | 65.42          | 0.04      | 25,062.66     | n/a            | n/a              | 9.1             | 109.87            | yjs       |
| mags     | merge / concurrent overwrites same middle               | 5,000 | 2      | 4.89         | 204.35         | 0.05      | 21,276.6      | n/a            | n/a              | 8.95            | 111.77            | yjs       |
| mags     | merge / concurrent overwrites same tail                 | 5,000 | 2      | 0.04         | 24,242.42      | 0.05      | 19,550.34     | n/a            | n/a              | 15.72           | 63.61             | crlist    |
| mags     | merge / concurrent deletes same head                    | 5,000 | 2      | 4.79         | 208.89         | 0.02      | 43,859.65     | 0.02           | 47,619.05        | 7.73            | 129.33            | json-joy  |
| mags     | merge / concurrent deletes same middle                  | 5,000 | 2      | 3.69         | 271            | 0.03      | 38,834.95     | 0.03           | 39,920.16        | 5.56            | 179.98            | json-joy  |
| mags     | merge / concurrent deletes same tail                    | 5,000 | 2      | 0.02         | 46,728.97      | 0.04      | 25,252.53     | 0.02           | 61,919.5         | 5.95            | 168.12            | json-joy  |
| mags     | merge / concurrent overwrite delete same entry          | 5,000 | 2      | 3.61         | 277.36         | 0.09      | 11,363.64     | 0.07           | 14,471.78        | 7.21            | 138.79            | json-joy  |
| mags     | merge / forked replicas rejoin after 250 ops each       | 5,000 | 250    | n/a          | n/a            | 0.01      | 91,886.43     | n/a            | n/a              | 3.34            | 299.09            | yjs       |
| mags     | merge / 10 replicas gossip convergence                  | 5,000 | 100    | 0.01         | 137,362.64     | 0.01      | 82,372.32     | n/a            | n/a              | 6.89            | 145.22            | crlist    |
| mags     | merge / snapshot merge into stale replica               | 5,000 | 5,350  | 0            | 390,354.24     | 0         | 487,747.06    | 0.01           | 133,059.42       | 0.04            | 27,915.62         | yjs       |
| class    | constructor / hydrate snapshot                          | 5,000 | 250    | 6.72         | 148.83         | 7.4       | 135.05        | 19.42          | 51.5             | 182.5           | 5.48              | crlist    |
| class    | read / head                                             | 5,000 | 250    | 0            | 455,871.63     | 0         | 5,050,505.05  | 0              | 1,299,376.3      | 0               | 2,587,991.72      | yjs       |
| class    | read / middle                                           | 5,000 | 250    | 0            | 1,361,655.77   | 0         | 14,450,867.05 | 0              | 3,392,130.26     | 0               | 11,312,217.19     | yjs       |
| class    | read / tail                                             | 5,000 | 250    | 0            | 2,236,135.96   | 0         | 15,432,098.77 | 0              | 3,660,322.11     | 0               | 11,467,889.91     | yjs       |
| class    | find near head                                          | 5,000 | 250    | 0            | 562,556.26     | 0         | 2,903,600.46  | 0              | 744,269.13       | 0               | 1,736,111.11      | yjs       |
| class    | find near middle                                        | 5,000 | 250    | 1.82         | 549.9          | 0.09      | 10,699.22     | 0.91           | 1,096.06         | 0.02            | 65,751.41         | automerge |
| class    | find near tail                                          | 5,000 | 250    | 3.51         | 284.95         | 0.18      | 5,698.75      | 1.87           | 534.35           | 0.02            | 48,161.21         | automerge |
| class    | iterate visible values                                  | 5,000 | 250    | 0.15         | 6,893.03       | 0.26      | 3,828.99      | 2.49           | 402.34           | 0.1             | 9,701.43          | automerge |
| class    | collect visible values to array                         | 5,000 | 250    | 0.13         | 7,750.81       | 0.25      | 4,025.86      | 1.64           | 608.55           | 0.12            | 8,499.15          | automerge |
| class    | append / single after tail                              | 5,000 | 250    | 0.01         | 169,940.86     | 0.06      | 15,953.95     | 0.03           | 28,946.24        | 1.99            | 501.87            | crlist    |
| class    | append / batch after tail                               | 5,000 | 25,000 | 0            | 1,204,656.72   | 0         | 544,282.85    | 0.01           | 147,984.6        | 0.19            | 5,219.81          | crlist    |
| class    | prepend / single before head                            | 5,000 | 250    | 0.01         | 134,872.68     | 0.01      | 71,639.4      | 0.04           | 27,651.5         | 2               | 499.8             | crlist    |
| class    | prepend / batch before head                             | 5,000 | 25,000 | 0            | 1,375,182.9    | 0         | 791,454.82    | 0.01           | 154,734.19       | 0.21            | 4,777.76          | crlist    |
| class    | insert / single before middle                           | 5,000 | 250    | 0.01         | 156,416.19     | 0.02      | 61,429.59     | 0.01           | 149,414.3        | 2.01            | 498.48            | crlist    |
| class    | insert / batch before middle                            | 5,000 | 25,000 | 0            | 732,931.49     | 0         | 868,290.72    | 0.01           | 191,236.77       | 0.19            | 5,141.64          | yjs       |
| class    | overwrite / head                                        | 5,000 | 250    | 0.01         | 107,103.08     | 0.02      | 57,562.57     | 0.01           | 124,421.44       | 2.18            | 458.03            | json-joy  |
| class    | overwrite / middle                                      | 5,000 | 250    | 0.01         | 113,662.2      | 0.02      | 41,288.19     | 0.01           | 131,919.16       | 2.11            | 474.89            | json-joy  |
| class    | overwrite / tail                                        | 5,000 | 250    | 0.01         | 143,045.15     | 0.02      | 57,497.7      | 0.01           | 124,576.44       | 2.07            | 484.22            | crlist    |
| class    | overwrite / random                                      | 5,000 | 250    | 0.03         | 33,021.61      | 0.03      | 30,835.65     | 0.04           | 22,693.64        | 2.33            | 430.07            | crlist    |
| class    | remove / head                                           | 5,000 | 250    | 0.01         | 94,772.36      | 0.02      | 56,620.01     | 0.04           | 22,672.04        | 0.27            | 3,691.75          | crlist    |
| class    | remove / middle                                         | 5,000 | 250    | 0.01         | 102,257.85     | 0.01      | 93,321.89     | 0.03           | 32,596.22        | 0.31            | 3,251.71          | crlist    |
| class    | remove / tail                                           | 5,000 | 250    | 0.01         | 198,664.97     | 0.02      | 65,556.58     | 0              | 288,550.32       | 0.34            | 2,929.9           | json-joy  |
| class    | remove / range from head                                | 5,000 | 5,000  | 0            | 595,316.05     | 0         | 9,323,140.03  | 0              | 357,079.09       | 0.02            | 56,312.01         | yjs       |
| class    | remove / range from middle                              | 5,000 | 5,000  | 0            | 588,948.96     | 0         | 8,034,709.95  | 0              | 311,712.92       | 0.02            | 54,552.64         | yjs       |
| class    | remove / range from tail                                | 5,000 | 5,000  | 0            | 348,252.47     | 0         | 8,689,607.23  | 0              | 335,307.17       | 0.02            | 62,508.91         | yjs       |
| class    | mixed / append overwrite remove tail                    | 5,000 | 250    | 0.01         | 170,846.72     | 0.02      | 60,744.48     | 0.03           | 31,175.18        | 1.57            | 638.48            | crlist    |
| class    | mixed / prepend overwrite remove head                   | 5,000 | 250    | 0.01         | 144,241.86     | 0.01      | 82,467.43     | 0.04           | 27,747.56        | 1.56            | 642.52            | crlist    |
| class    | mixed / insert overwrite remove middle                  | 5,000 | 250    | 0.01         | 107,406.77     | 0.01      | 80,233.64     | 0.01           | 161,770.42       | 1.6             | 624.44            | json-joy  |
| class    | paste / insert 10,000 entries at cursor                 | 5,000 | 10,000 | 0            | 307,953.83     | 0         | 904,159.13    | 0.01           | 83,810.07        | 0.17            | 5,773.36          | yjs       |
| class    | render / join visible entries to string                 | 5,000 | 250    | 0.29         | 3,454.37       | 0.35      | 2,876.22      | 2.8            | 356.7            | 0.17            | 5,796.12          | automerge |
| class    | snapshot                                                | 5,000 | 250    | 4.47         | 223.54         | 3.86      | 258.96        | 8.4            | 119              | 15.57           | 64.21             | yjs       |
| class    | snapshot / tombstoned state 50% deleted                 | 5,000 | 250    | 2.07         | 483.11         | 2.02      | 494.14        | 4.2            | 238.05           | 15.78           | 63.36             | yjs       |
| class    | snapshot / after garbage collection                     | 5,000 | 250    | 0.14         | 7,256.96       | 0.26      | 3,853.43      | 2.56           | 390.5            | 0.07            | 13,988.91         | automerge |
| class    | acknowledge                                             | 5,000 | 250    | 0.45         | 2,247.17       | n/a       | n/a           | n/a            | n/a              | n/a             | n/a               | n/a       |
| class    | acknowledge / 50% deleted state                         | 5,000 | 250    | 0.51         | 1,961.67       | n/a       | n/a           | n/a            | n/a              | n/a             | n/a               | n/a       |
| class    | acknowledge / 90% deleted state                         | 5,000 | 250    | 0.82         | 1,223.2        | n/a       | n/a           | n/a            | n/a              | n/a             | n/a               | n/a       |
| class    | garbage collect                                         | 5,000 | 250    | 0.14         | 6,989.72       | 0.25      | 3,981.92      | 2.14           | 466.76           | 0.08            | 12,642.74         | automerge |
| class    | garbage collect / no eligible tombstones                | 5,000 | 250    | 0.17         | 5,781.96       | 0.25      | 3,978.14      | 2.22           | 449.94           | 0.08            | 12,763.7          | automerge |
| class    | garbage collect / 90% eligible tombstones               | 5,000 | 250    | 0.16         | 6,224.19       | 0.25      | 4,040.33      | 2.12           | 470.69           | 0.08            | 12,775.05         | automerge |
| class    | merge ordered deltas                                    | 5,000 | 250    | 0.23         | 4,264.41       | 0.02      | 65,373.15     | 0              | 250,601.44       | 3.1             | 322.78            | json-joy  |
| class    | merge shuffled gossip                                   | 5,000 | 250    | 2.31         | 432.54         | 0.41      | 2,440.42      | n/a            | n/a              | 0.72            | 1,382.89          | yjs       |
| class    | merge / duplicate delta ignored                         | 5,000 | 250    | 0            | 716,332.38     | 0.03      | 35,274.36     | 0              | 314,267.76       | 0.04            | 26,680.9          | crlist    |
| class    | merge / concurrent prepends same head                   | 5,000 | 2      | 5.99         | 166.9          | 0.08      | 13,037.81     | n/a            | n/a              | 17.05           | 58.65             | yjs       |
| class    | merge / concurrent appends same tail                    | 5,000 | 2      | 0.04         | 26,560.42      | 0.06      | 15,491.87     | n/a            | n/a              | 9.88            | 101.2             | crlist    |
| class    | merge / concurrent inserts same middle position         | 5,000 | 2      | 3.09         | 323.46         | 0.05      | 20,242.91     | n/a            | n/a              | 12.36           | 80.89             | yjs       |
| class    | merge / forked replicas rejoin after 250 ops each       | 5,000 | 500    | 1.63         | 612.79         | 0.01      | 97,416.51     | n/a            | n/a              | 3.32            | 301.24            | yjs       |
| latency  | append tail write to remote visible                     | 5,000 | 250    | 0.67         | 1,495.5        | 0.24      | 4,099.83      | 11.43          | 87.46            | 6.11            | 163.61            | yjs       |
| latency  | prepend head write to remote visible                    | 5,000 | 250    | 0.66         | 1,513.64       | 0.03      | 30,079.17     | 0.02           | 58,443.99        | 6.21            | 160.99            | json-joy  |
| latency  | middle insert write to remote visible                   | 5,000 | 250    | 0.59         | 1,705.6        | 0.13      | 7,690.18      | 4.21           | 237.63           | 5.99            | 167.03            | yjs       |
| latency  | head insert write to remote visible                     | 5,000 | 250    | 0.53         | 1,896.01       | 0.02      | 41,967.43     | 0.02           | 62,878.85        | 5.94            | 168.49            | json-joy  |
| latency  | overwrite head write to remote visible                  | 5,000 | 250    | 1.01         | 994.01         | 0.04      | 27,048.08     | 0.04           | 27,526.67        | 6.12            | 163.37            | json-joy  |
| latency  | overwrite middle write to remote visible                | 5,000 | 250    | 0.59         | 1,707.77       | 0.13      | 7,502.46      | 2.66           | 376.47           | 6.22            | 160.89            | yjs       |
| latency  | overwrite tail write to remote visible                  | 5,000 | 250    | 0.81         | 1,239.17       | 0.24      | 4,211.38      | 5.67           | 176.45           | 6.04            | 165.51            | yjs       |
| latency  | head delete to remote hidden                            | 5,000 | 250    | 1.77         | 566.25         | 0.27      | 3,669.14      | 5.5            | 181.96           | 2.31            | 432.74            | yjs       |
| latency  | middle delete to remote hidden                          | 5,000 | 250    | 1            | 997.33         | 0.27      | 3,674.83      | 5.66           | 176.76           | 2.23            | 447.58            | yjs       |
| latency  | tail delete to remote hidden                            | 5,000 | 250    | 0.69         | 1,441.41       | 0.24      | 4,199.46      | 5.36           | 186.5            | 2.41            | 414.37            | yjs       |
| latency  | append tail write to 10 remotes visible                 | 5,000 | 2,500  | 0.92         | 1,084.63       | 0.25      | 3,996.33      | 12.13          | 82.45            | 3.94            | 253.5             | yjs       |
| latency  | prepend head write to 10 remotes visible                | 5,000 | 2,500  | 0.59         | 1,702.58       | 0.01      | 87,682.99     | 0.01           | 70,725.96        | 4.02            | 248.74            | yjs       |
| latency  | middle insert write to 10 remotes visible               | 5,000 | 2,500  | 0.68         | 1,465.71       | 0.14      | 7,226.22      | 4.71           | 212.44           | 5.43            | 184.05            | yjs       |
| latency  | overwrite middle write to 10 remotes visible            | 5,000 | 2,500  | 0.73         | 1,369.86       | 0.14      | 7,093.33      | 3.13           | 319.25           | 5.26            | 189.97            | yjs       |
| latency  | delete middle to 10 remotes hidden                      | 5,000 | 2,500  | 1.19         | 843.55         | 0.27      | 3,681.9       | 6.44           | 155.32           | 2.76            | 362.16            | yjs       |
| latency  | out-of-order write delivery to remote visible           | 5,000 | 250    | 4.92         | 203.14         | 76.67     | 13.04         | n/a            | n/a              | 23.43           | 42.69             | crlist    |
| latency  | out-of-order delete delivery to remote convergence      | 5,000 | 165    | 6.32         | 158.13         | 0.21      | 4,715.36      | 7.61           | 131.34           | 8.87            | 112.69            | yjs       |
| latency  | out-of-order append delivery to convergence             | 5,000 | 250    | 4.57         | 218.69         | 22.61     | 44.22         | n/a            | n/a              | 28.67           | 34.88             | crlist    |
| latency  | out-of-order prepend delivery to convergence            | 5,000 | 250    | 4.98         | 200.97         | 22.65     | 44.15         | 0.11           | 9,303.33         | 24.47           | 40.86             | json-joy  |
| latency  | out-of-order middle insert delivery to convergence      | 5,000 | 250    | 4.27         | 234.29         | 74.17     | 13.48         | n/a            | n/a              | 33.05           | 30.26             | crlist    |
| latency  | out-of-order overwrite delivery to convergence          | 5,000 | 129    | 6.72         | 148.86         | n/a       | n/a           | 239.52         | 4.18             | 99.44           | 10.06             | crlist    |
| latency  | offline burst 1,000 ops then sync                       | 5,000 | 1,000  | 0.23         | 4,336.97       | 0.03      | 37,558.54     | 0              | 252,327.72       | 4.78            | 209.17            | json-joy  |
| latency  | forked replicas mixed ops then converge                 | 5,000 | 250    | n/a          | n/a            | 0.01      | 126,419.05    | n/a            | n/a              | 4.49            | 222.9             | yjs       |
| latency  | duplicate shuffled gossip to convergence                | 5,000 | 500    | 1.07         | 936.76         | 0.22      | 4,601.07      | n/a            | n/a              | 0.49            | 2,028.45          | yjs       |
| latency  | remote snapshot hydrate then apply pending deltas       | 5,000 | 250    | 0.04         | 24,265.72      | 0.04      | 24,635.15     | 0.1            | 10,453.91        | 1.33            | 750.5             | yjs       |
| workload | local app session                                       | 5,000 | 250    | 0.01         | 99,064.83      | 0.02      | 52,633.8      | 0.01           | 140,378.46       | 2.48            | 403.7             | json-joy  |
| workload | read heavy session                                      | 5,000 | 250    | 0            | 2,076,411.96   | 0         | 4,208,754.21  | 0              | 339,259.06       | 0               | 1,191,611.06      | yjs       |
| workload | write heavy session                                     | 5,000 | 250    | 0.01         | 120,784.62     | 0.01      | 70,944.12     | 0.01           | 175,413.98       | 2.02            | 493.95            | json-joy  |
| workload | append tail heavy session                               | 5,000 | 250    | 0            | 288,284.13     | 0.02      | 53,543.51     | 0.01           | 76,960.97        | 2.91            | 344.21            | crlist    |
| workload | prepend head heavy session                              | 5,000 | 250    | 0.01         | 103,674.21     | 0.01      | 92,363.39     | 0.01           | 124,850.18       | 2.52            | 396.57            | json-joy  |
| workload | insert middle heavy session                             | 5,000 | 250    | 0.01         | 100,450.02     | 0.01      | 76,949.12     | 0.01           | 131,371.52       | 2.52            | 396.99            | json-joy  |
| workload | overwrite heavy session                                 | 5,000 | 250    | 0.01         | 96,914.25      | 0.01      | 70,191.2      | 0.01           | 130,391.7        | 1.64            | 609.33            | json-joy  |
| workload | delete heavy session                                    | 5,000 | 250    | 0.01         | 127,713.92     | 0.02      | 63,067.61     | 0.05           | 19,757.07        | 0.3             | 3,346.58          | crlist    |
| workload | balanced append prepend insert overwrite delete session | 5,000 | 250    | 0.01         | 100,656.28     | 0.01      | 83,606.45     | 0.01           | 165,060.08       | 2.06            | 484.89            | json-joy  |
| workload | random edit session                                     | 5,000 | 250    | 0.01         | 66,875.32      | 0.02      | 42,656.29     | 0.04           | 23,414.38        | 2.7             | 369.91            | crlist    |
| workload | text editing session                                    | 5,000 | 250    | 0.01         | 117,145.4      | 0.01      | 79,557.03     | 0.01           | 160,215.33       | 3.05            | 327.75            | json-joy  |
| workload | collaborative offline session                           | 5,000 | 250    | n/a          | n/a            | 0.01      | 108,206.37    | n/a            | n/a              | 4.46            | 224.08            | yjs       |
| workload | sync and cleanup session                                | 5,000 | 252    | 0.17         | 6,009.09       | 0.01      | 86,451.35     | n/a            | n/a              | 4.49            | 222.59            | yjs       |
| workload | long lived tombstoned session                           | 5,000 | 250    | 0            | 219,298.25     | 0.02      | 62,423.53     | 0.01           | 151,194.44       | 2.93            | 341.64            | crlist    |
| workload | sparse visible session                                  | 5,000 | 250    | 0.01         | 167,683.95     | 0.14      | 7,038.19      | 0.02           | 41,835.4         | 1.86            | 536.37            | crlist    |
| workload | post-gc edit session                                    | 5,000 | 250    | 0            | 278,396.44     | 0.02      | 54,689.04     | 0.01           | 169,813.88       | 3.28            | 305.01            | crlist    |

total wall time: 824,106.43 ms

## License

Apache-2.0
