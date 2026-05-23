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
| crud     | create / empty list                                     | 5,000 | 250    | 0            | 300,192.12     | 0.27      | 3,732.42      | 0.02           | 41,394.84        | 0.4             | 2,485.47          | crlist    |
| crud     | create / hydrate snapshot                               | 5,000 | 250    | 5.35         | 187            | 10.36     | 96.48         | 26.42          | 37.85            | 198.85          | 5.03              | crlist    |
| crud     | create / hydrate clean snapshot                         | 5,000 | 250    | 5.6          | 178.44         | 8.48      | 117.89        | 23.01          | 43.45            | 202.32          | 4.94              | crlist    |
| crud     | create / hydrate tombstoned snapshot                    | 5,000 | 250    | 5.23         | 191.09         | 4.32      | 231.36        | 12.04          | 83.07            | 282.06          | 3.55              | yjs       |
| crud     | read / head                                             | 5,000 | 250    | 0            | 557,413.6      | 0         | 801,025.31    | 0              | 203,185.96       | 0               | 1,408,450.7       | automerge |
| crud     | read / middle                                           | 5,000 | 250    | 0            | 3,443,526.17   | 0         | 1,874,062.97  | 0              | 596,231.81       | 0               | 6,157,635.47      | automerge |
| crud     | read / tail                                             | 5,000 | 250    | 0            | 2,604,166.67   | 0         | 1,915,708.81  | 0              | 574,977          | 0               | 6,648,936.17      | automerge |
| crud     | read / random indexed reads                             | 5,000 | 250    | 0            | 376,676.21     | 0         | 698,519.14    | 0.01           | 130,541.49       | 0               | 1,066,552.9       | automerge |
| crud     | read / sequential indexed reads from head               | 5,000 | 250    | 0            | 521,159.06     | 0         | 1,051,303.62  | 0.01           | 195,373.55       | 0               | 1,067,463.71      | automerge |
| crud     | read / sequential indexed reads from middle             | 5,000 | 250    | 0            | 1,136,363.64   | 0         | 2,208,480.57  | 0.01           | 143,217.23       | 0               | 7,530,120.48      | automerge |
| crud     | read / sequential indexed reads from tail               | 5,000 | 250    | 0            | 1,216,545.01   | 0         | 2,321,262.77  | 0              | 260,281.1        | 0               | 7,022,471.91      | automerge |
| crud     | read / full iteration visible values                    | 5,000 | 250    | 1.1          | 906.67         | 0.25      | 3,997.26      | 3.32           | 301.1            | 0.1             | 10,521.27         | automerge |
| crud     | read / collect visible values to array                  | 5,000 | 250    | 1.09         | 921.48         | 0.27      | 3,743.41      | 2.52           | 397.56           | 0.09            | 11,203.98         | automerge |
| crud     | read / visible sparse over deleted entries              | 5,000 | 250    | 0            | 1,867,064.97   | 0.05      | 19,398.49     | 0.02           | 43,719.29        | 0               | 9,727,626.46      | automerge |
| crud     | find / head                                             | 5,000 | 250    | 0            | 911,410.86     | 0         | 941,619.59    | 0              | 576,036.87       | 0               | 1,443,418.01      | automerge |
| crud     | find / middle                                           | 5,000 | 250    | 0.46         | 2,177.37       | 0.15      | 6,662.7       | 0.8            | 1,250.84         | 0.02            | 52,572.92         | automerge |
| crud     | find / tail                                             | 5,000 | 250    | 0.9          | 1,114.74       | 0.25      | 4,052.57      | 2.32           | 430.11           | 0.03            | 36,568.95         | automerge |
| crud     | find / missing value                                    | 5,000 | 250    | 1.12         | 891.92         | 0.28      | 3,619.23      | 1.92           | 521.37           | 0.04            | 26,973.08         | automerge |
| crud     | append / single after tail                              | 5,000 | 250    | 0.01         | 81,948.41      | 0.04      | 24,412.87     | 0.04           | 27,062.43        | 2.26            | 443.05            | crlist    |
| crud     | append / batch after tail                               | 5,000 | 25,000 | 0.01         | 81,208.7       | 0         | 350,573.12    | 0.01           | 118,233.66       | 0.25            | 4,033.39          | yjs       |
| crud     | append / batch after deleted tail                       | 5,000 | 25,000 | 0.01         | 107,027.79     | 0         | 459,642.47    | 0.01           | 118,143.43       | 0.22            | 4,500.7           | yjs       |
| crud     | append / batch after garbage collection                 | 5,000 | 25,000 | 0.01         | 122,559.29     | 0         | 536,447.3     | 0.01           | 120,423.49       | 0.22            | 4,571.37          | yjs       |
| crud     | prepend / single before head                            | 5,000 | 250    | 0.01         | 85,901.8       | 0.02      | 50,174.61     | 0.05           | 20,822.23        | 2.56            | 390.89            | crlist    |
| crud     | prepend / batch before head                             | 5,000 | 25,000 | 0.01         | 110,171.08     | 0         | 529,414.26    | 0.01           | 139,858.11       | 0.31            | 3,272.18          | yjs       |
| crud     | prepend / batch before deleted head                     | 5,000 | 25,000 | 0.01         | 104,363.13     | 0         | 681,676.27    | 0.01           | 163,343.5        | 0.24            | 4,202.71          | yjs       |
| crud     | prepend / batch after garbage collection                | 5,000 | 25,000 | 0.01         | 129,161.39     | 0         | 463,884.72    | 0.01           | 159,376.98       | 0.22            | 4,449.45          | yjs       |
| crud     | insert / single before head                             | 5,000 | 250    | 0.01         | 112,369.65     | 0.03      | 32,737.51     | 0.01           | 108,197.01       | 2.39            | 417.97            | crlist    |
| crud     | insert / single after head                              | 5,000 | 250    | 0.01         | 87,482.94      | 0.02      | 47,605.45     | 0.01           | 67,047.5         | 2.74            | 364.43            | crlist    |
| crud     | insert / single before middle                           | 5,000 | 250    | 0.01         | 71,713.38      | 0.02      | 43,956.82     | 0.01           | 108,361.15       | 2.42            | 413.72            | json-joy  |
| crud     | insert / single after middle                            | 5,000 | 250    | 0.01         | 82,423.92      | 0.03      | 38,700.89     | 0.02           | 63,116.97        | 2.33            | 428.75            | crlist    |
| crud     | insert / single before tail                             | 5,000 | 250    | 0.06         | 18,151.19      | 0.04      | 26,430.41     | 0.01           | 110,428.91       | 2.56            | 390.61            | json-joy  |
| crud     | insert / single after tail                              | 5,000 | 250    | 0.01         | 77,385.01      | 0.04      | 24,196.67     | 0.01           | 115,665.77       | 4.87            | 205.29            | json-joy  |
| crud     | insert / batch before head                              | 5,000 | 25,000 | 0.01         | 121,446.54     | 0         | 541,105.63    | 0.01           | 129,145.84       | 0.25            | 4,072.79          | yjs       |
| crud     | insert / batch after head                               | 5,000 | 25,000 | 0.01         | 105,217.97     | 0         | 449,110.4     | 0.01           | 162,708.19       | 0.24            | 4,123.36          | yjs       |
| crud     | insert / batch before middle                            | 5,000 | 25,000 | 0.01         | 103,841.25     | 0         | 658,320.91    | 0.01           | 165,720.51       | 0.23            | 4,283.06          | yjs       |
| crud     | insert / batch after middle                             | 5,000 | 25,000 | 0.01         | 112,075.86     | 0         | 691,704.53    | 0.01           | 145,027.5        | 0.24            | 4,205.31          | yjs       |
| crud     | insert / batch before tail                              | 5,000 | 25,000 | 0.03         | 32,650.32      | 0         | 588,837.99    | 0.01           | 137,150.36       | 0.24            | 4,103.24          | yjs       |
| crud     | insert / batch after tail                               | 5,000 | 25,000 | 0.01         | 123,516.57     | 0         | 428,217.84    | 0.01           | 117,278.39       | 0.24            | 4,214.56          | yjs       |
| crud     | insert / repeated before head                           | 5,000 | 250    | 0.01         | 75,079.58      | 0.01      | 81,321.97     | 0.01           | 110,170.99       | 3.15            | 317.13            | json-joy  |
| crud     | insert / repeated before middle                         | 5,000 | 250    | 0.01         | 92,295.2       | 0.02      | 60,541.48     | 0.01           | 130,924.33       | 2.47            | 404.05            | json-joy  |
| crud     | insert / repeated before tail                           | 5,000 | 250    | 0.01         | 90,790.24      | 0.02      | 63,432.46     | 0.01           | 133,077.82       | 2.51            | 399.19            | json-joy  |
| crud     | insert / random positions                               | 5,000 | 250    | 0.01         | 92,620.04      | 0.04      | 22,925.26     | 0.06           | 17,357.01        | 2.82            | 355.03            | crlist    |
| crud     | insert / alternating head and tail                      | 5,000 | 250    | 0.13         | 7,685.14       | 0.01      | 74,640.23     | 0.01           | 120,895.59       | 3.33            | 300.67            | json-joy  |
| crud     | overwrite / head                                        | 5,000 | 250    | 0.04         | 27,256.27      | 0.04      | 27,275.31     | 0.02           | 54,792.12        | 5.73            | 174.47            | json-joy  |
| crud     | overwrite / middle                                      | 5,000 | 250    | 0.01         | 97,698.23      | 0.03      | 39,719.74     | 0.04           | 23,564.68        | 2.55            | 392.13            | crlist    |
| crud     | overwrite / tail                                        | 5,000 | 250    | 0.01         | 79,161.52      | 0.03      | 39,857.79     | 0.04           | 22,710.34        | 2.52            | 396.52            | crlist    |
| crud     | overwrite / random                                      | 5,000 | 250    | 0.01         | 94,418.01      | 0.04      | 22,812.3      | 0.05           | 20,491.64        | 2.91            | 343.62            | crlist    |
| crud     | overwrite / same head repeatedly                        | 5,000 | 250    | 0.01         | 109,812.88     | 0.02      | 41,745.29     | 0.05           | 19,967.73        | 3.4             | 293.71            | crlist    |
| crud     | overwrite / same middle repeatedly                      | 5,000 | 250    | 0.01         | 105,418.51     | 0.03      | 29,113.78     | 0.06           | 17,254.23        | 3.43            | 291.77            | crlist    |
| crud     | overwrite / same tail repeatedly                        | 5,000 | 250    | 0.01         | 85,080.32      | 0.03      | 39,447.11     | 0.05           | 18,609.91        | 2.96            | 337.33            | crlist    |
| crud     | overwrite / random visible entries                      | 5,000 | 250    | 0.01         | 102,220.22     | 0.04      | 22,434.6      | 0.06           | 16,944.1         | 2.8             | 356.97            | crlist    |
| crud     | overwrite / after insert                                | 5,000 | 250    | 0.01         | 107,982.03     | 0.03      | 39,429.69     | 0.05           | 19,742.25        | 2.7             | 370.86            | crlist    |
| crud     | overwrite / after delete                                | 5,000 | 250    | 0.01         | 106,396.56     | 0.03      | 36,586.08     | 0.04           | 22,632.63        | 2.68            | 373.31            | crlist    |
| crud     | delete / head                                           | 5,000 | 250    | 0.01         | 102,207.69     | 0.02      | 42,800.89     | 0.05           | 18,691.59        | 1.03            | 970.69            | crlist    |
| crud     | delete / middle                                         | 5,000 | 250    | 0.02         | 65,999.63      | 0.03      | 38,865.74     | 0.04           | 26,351.85        | 0.4             | 2,484.07          | crlist    |
| crud     | delete / tail                                           | 5,000 | 250    | 0            | 483,558.99     | 0.03      | 32,136.15     | 0              | 203,965.08       | 0.36            | 2,766.48          | crlist    |
| crud     | delete / range from head                                | 5,000 | 5,000  | 0            | 496,568.71     | 0         | 6,839,945.28  | 0              | 279,856.49       | 0.02            | 44,729.08         | yjs       |
| crud     | delete / range from middle                              | 5,000 | 5,000  | 0            | 517,346.63     | 0         | 5,453,157.38  | 0              | 201,034.93       | 0.02            | 45,210.53         | yjs       |
| crud     | delete / range from tail                                | 5,000 | 5,000  | 0            | 814,226.16     | 0         | 6,849,315.07  | 0              | 214,611.62       | 0.02            | 45,040.18         | yjs       |
| crud     | delete / every other entry                              | 5,000 | 2,500  | 0.01         | 95,427.86      | 0.13      | 7,828.32      | 0.11           | 8,702.37         | 0.35            | 2,850.85          | crlist    |
| crud     | delete / all entries from head one by one               | 5,000 | 5,000  | 0.01         | 113,115.26     | 0.02      | 62,513.75     | 0.01           | 90,643.59        | 0.33            | 3,014.71          | crlist    |
| crud     | delete / all entries from middle outward                | 5,000 | 5,000  | 0.01         | 91,053.45      | 0.01      | 78,850.42     | 0.01           | 139,226.9        | 0.33            | 3,019.19          | json-joy  |
| crud     | delete / all entries from tail one by one               | 5,000 | 5,000  | 0            | 366,558.17     | 0.01      | 76,959.07     | 0              | 216,409.93       | 0.32            | 3,097.71          | crlist    |
| crud     | delete / all entries in random order                    | 5,000 | 5,000  | 0.28         | 3,596.3        | 16.67     | 59.97         | 11.11          | 89.98            | 0.4             | 2,516.11          | crlist    |
| crud     | delete / already deleted head                           | 5,000 | 250    | 0            | 358,166.19     | 0         | 241,545.89    | 0              | 414,662.46       | 0.05            | 21,625.36         | json-joy  |
| crud     | delete / already deleted middle                         | 5,000 | 250    | 0            | 534,530.68     | 0         | 252,755.03    | 0              | 818,598.56       | 0.04            | 23,156.94         | json-joy  |
| crud     | delete / already deleted tail                           | 5,000 | 250    | 0            | 1,207,729.47   | 0         | 249,575.72    | 0              | 923,190.55       | 0.04            | 25,943.3          | crlist    |
| crud     | mixed / append overwrite delete tail                    | 5,000 | 250    | 0.01         | 71,182.48      | 0.04      | 23,352.26     | 0.01           | 90,948.78        | 2.76            | 362.82            | json-joy  |
| crud     | mixed / prepend overwrite delete head                   | 5,000 | 250    | 0.01         | 112,511.25     | 0.02      | 53,540.07     | 0.01           | 89,921.59        | 2.92            | 342.71            | crlist    |
| crud     | mixed / insert overwrite delete middle                  | 5,000 | 250    | 0.01         | 98,974.62      | 0.03      | 39,836.83     | 0.01           | 110,438.66       | 2.68            | 372.61            | json-joy  |
| crud     | mixed / append prepend insert overwrite delete          | 5,000 | 250    | 0.01         | 81,865.22      | 0.02      | 45,337.49     | 0.01           | 111,786.8        | 2.69            | 371.39            | json-joy  |
| mags     | snapshot                                                | 5,000 | 250    | 0.31         | 3,216.65       | 4.36      | 229.38        | 9.12           | 109.71           | 23.96           | 41.74             | crlist    |
| mags     | snapshot / clean state                                  | 5,000 | 250    | 0.24         | 4,131.37       | 4.48      | 223.42        | 8.88           | 112.65           | 22.99           | 43.5              | crlist    |
| mags     | snapshot / tombstoned state 50% deleted                 | 5,000 | 250    | 0.16         | 6,063.08       | 2.4       | 416.76        | 4.06           | 246.32           | 24.59           | 40.66             | crlist    |
| mags     | snapshot / tombstoned state 90% deleted                 | 5,000 | 250    | 0.06         | 18,173.1       | 0.48      | 2,081.84      | 0.69           | 1,451.22         | 22.84           | 43.78             | crlist    |
| mags     | snapshot / after garbage collection                     | 5,000 | 250    | 0.23         | 4,261.92       | 2.25      | 444.92        | 4.08           | 244.9            | 24.06           | 41.56             | crlist    |
| mags     | acknowledge                                             | 5,000 | 250    | 0.01         | 148,482.51     | n/a       | n/a           | n/a            | n/a              | n/a             | n/a               | n/a       |
| mags     | acknowledge / clean state                               | 5,000 | 250    | 0            | 4,950,495.05   | n/a       | n/a           | n/a            | n/a              | n/a             | n/a               | n/a       |
| mags     | acknowledge / 50% deleted state                         | 5,000 | 250    | 0.08         | 12,469.33      | n/a       | n/a           | n/a            | n/a              | n/a             | n/a               | n/a       |
| mags     | acknowledge / 90% deleted state                         | 5,000 | 250    | 0.11         | 9,154.19       | n/a       | n/a           | n/a            | n/a              | n/a             | n/a               | n/a       |
| mags     | garbage collect                                         | 5,000 | 250    | 0            | 834,724.54     | n/a       | n/a           | n/a            | n/a              | n/a             | n/a               | n/a       |
| mags     | garbage collect / no eligible tombstones                | 5,000 | 250    | 0            | 3,477,051.46   | n/a       | n/a           | n/a            | n/a              | n/a             | n/a               | n/a       |
| mags     | garbage collect / 50% eligible tombstones               | 5,000 | 250    | 0            | 235,006.58     | n/a       | n/a           | n/a            | n/a              | n/a             | n/a               | n/a       |
| mags     | garbage collect / 90% eligible tombstones               | 5,000 | 250    | 0            | 207,107.94     | n/a       | n/a           | n/a            | n/a              | n/a             | n/a               | n/a       |
| mags     | garbage collect / partial frontiers 2 replicas          | 5,000 | 250    | 0            | 1,589,319.77   | n/a       | n/a           | n/a            | n/a              | n/a             | n/a               | n/a       |
| mags     | garbage collect / partial frontiers 10 replicas         | 5,000 | 250    | 0            | 1,759,324.42   | n/a       | n/a           | n/a            | n/a              | n/a             | n/a               | n/a       |
| mags     | post-gc read / full iteration visible values            | 5,000 | 250    | 1.26         | 796.59         | 0.12      | 8,295.56      | 0.78           | 1,284.28         | 0.06            | 17,877.57         | automerge |
| mags     | merge ordered deltas                                    | 5,000 | 250    | 0.07         | 14,993.4       | 0.02      | 52,831.78     | 0.01           | 151,579.46       | 5.87            | 170.31            | json-joy  |
| mags     | merge shuffled gossip                                   | 5,000 | 250    | 1.04         | 958.75         | 0.87      | 1,154.67      | n/a            | n/a              | 1.73            | 577.68            | yjs       |
| mags     | merge / append head delta into equal replica            | 5,000 | 1      | 0.19         | 5,399.57       | 0.11      | 9,469.7       | 0.09           | 10,570.82        | 7.62            | 131.27            | json-joy  |
| mags     | merge / append tail delta into equal replica            | 5,000 | 1      | 0.06         | 16,806.72      | 0.04      | 24,449.88     | 0.01           | 69,444.44        | 7.3             | 136.91            | json-joy  |
| mags     | merge / prepend head delta into equal replica           | 5,000 | 1      | 0.27         | 3,698.22       | 0.04      | 24,038.46     | 0.01           | 84,033.61        | 7.63            | 131.09            | json-joy  |
| mags     | merge / insert middle delta into equal replica          | 5,000 | 1      | 0.1          | 10,000         | 0.04      | 25,125.63     | 0.02           | 47,846.89        | 7.7             | 129.83            | json-joy  |
| mags     | merge / overwrite head delta into equal replica         | 5,000 | 1      | 1.49         | 669.84         | 0.04      | 23,364.49     | 0.01           | 69,444.44        | 7.64            | 130.93            | json-joy  |
| mags     | merge / overwrite middle delta into equal replica       | 5,000 | 1      | 0.1          | 9,551.1        | 0.04      | 23,201.86     | 0.02           | 60,606.06        | 5.27            | 189.89            | json-joy  |
| mags     | merge / overwrite tail delta into equal replica         | 5,000 | 1      | 0.05         | 19,011.41      | 0.05      | 22,026.43     | 0.02           | 66,225.17        | 4.6             | 217.49            | json-joy  |
| mags     | merge / delete head delta into equal replica            | 5,000 | 1      | 2.32         | 430.72         | 0.03      | 37,453.18     | 0.03           | 34,364.26        | 4.24            | 236.12            | yjs       |
| mags     | merge / delete middle delta into equal replica          | 5,000 | 1      | 0.21         | 4,784.69       | 0.1       | 9,940.36      | 0.09           | 10,881.39        | 4.37            | 228.77            | json-joy  |
| mags     | merge / delete tail delta into equal replica            | 5,000 | 1      | 1.99         | 502.13         | 0.03      | 38,022.81     | 0.02           | 58,823.53        | 5.83            | 171.52            | json-joy  |
| mags     | merge / duplicate delta ignored                         | 5,000 | 250    | 0            | 403,225.81     | 0.03      | 28,875.36     | 0.04           | 25,694.26        | 0.04            | 24,231.38         | crlist    |
| mags     | merge / old delta ignored after merge                   | 5,000 | 250    | 0            | 499,400.72     | 0.04      | 28,298.47     | 0.01           | 182,441.8        | 0.07            | 14,924.13         | crlist    |
| mags     | merge / ordered 1,000 append deltas                     | 5,000 | 1,000  | 0.01         | 148,524.41     | 0.02      | 48,787.87     | 0.01           | 115,695.21       | 7.14            | 140.13            | crlist    |
| mags     | merge / ordered 1,000 prepend deltas                    | 5,000 | 1,000  | 0.12         | 8,171.19       | 0.01      | 74,147.12     | 0.02           | 41,618.11        | 6.38            | 156.78            | yjs       |
| mags     | merge / ordered 1,000 middle insert deltas              | 5,000 | 1,000  | 0.03         | 28,930.75      | 0.01      | 83,066.14     | 0.01           | 190,981.84       | 6.23            | 160.47            | json-joy  |
| mags     | merge / shuffled 1,000 mixed deltas                     | 5,000 | 1,000  | 1.02         | 983.9          | 1.6       | 626.93        | n/a            | n/a              | 1.58            | 634.57            | crlist    |
| mags     | merge / reverse ordered 1,000 mixed deltas              | 5,000 | 1,000  | 0.21         | 4,718.59       | 1.58      | 632.62        | n/a            | n/a              | 1.52            | 659.45            | crlist    |
| mags     | merge / concurrent prepends same head                   | 5,000 | 2      | 1.43         | 700.6          | 0.12      | 8,223.68      | n/a            | n/a              | 25.33           | 39.48             | yjs       |
| mags     | merge / concurrent appends same tail                    | 5,000 | 2      | 1.24         | 804.28         | 0.04      | 24,449.88     | n/a            | n/a              | 13.07           | 76.5              | yjs       |
| mags     | merge / concurrent inserts same middle position         | 5,000 | 2      | 1.9          | 526.84         | 0.05      | 19,379.84     | n/a            | n/a              | 34.97           | 28.6              | yjs       |
| mags     | merge / concurrent overwrites same head                 | 5,000 | 2      | 6.36         | 157.25         | 0.05      | 20,576.13     | n/a            | n/a              | 25.54           | 39.16             | yjs       |
| mags     | merge / concurrent overwrites same middle               | 5,000 | 2      | 1.42         | 706.54         | 0.05      | 18,570.1      | n/a            | n/a              | 25.34           | 39.47             | yjs       |
| mags     | merge / concurrent overwrites same tail                 | 5,000 | 2      | 1.2          | 831.5          | 0.05      | 20,161.29     | n/a            | n/a              | 17.71           | 56.47             | yjs       |
| mags     | merge / concurrent deletes same head                    | 5,000 | 2      | 3.97         | 252.16         | 0.03      | 36,764.71     | 0.03           | 37,878.79        | 22.7            | 44.05             | json-joy  |
| mags     | merge / concurrent deletes same middle                  | 5,000 | 2      | 1.29         | 774.2          | 0.04      | 27,210.88     | 0.02           | 44,543.43        | 24.63           | 40.59             | json-joy  |
| mags     | merge / concurrent deletes same tail                    | 5,000 | 2      | 1.17         | 853.1          | 0.03      | 34,602.08     | 0.02           | 51,679.59        | 12.76           | 78.37             | json-joy  |
| mags     | merge / concurrent overwrite delete same entry          | 5,000 | 2      | 1.55         | 643.69         | 0.08      | 12,202.56     | 0.11           | 8,904.72         | 14.21           | 70.39             | yjs       |
| mags     | merge / forked replicas rejoin after 250 ops each       | 5,000 | 500    | 0.17         | 5,899.32       | 0.01      | 73,179.66     | n/a            | n/a              | 6.37            | 157               | yjs       |
| mags     | merge / 10 replicas gossip convergence                  | 5,000 | 100    | 1.67         | 599.18         | 0.01      | 71,802.97     | n/a            | n/a              | 11.85           | 84.38             | yjs       |
| mags     | merge / snapshot merge into stale replica               | 5,000 | 5,350  | 0            | 280,968.21     | 0         | 446,372.7     | 0              | 208,124.24       | 0.07            | 14,856.9          | yjs       |
| class    | constructor / hydrate snapshot                          | 5,000 | 250    | 7.27         | 137.63         | 8.47      | 118.11        | 22.36          | 44.72            | 243.24          | 4.11              | crlist    |
| class    | read / head                                             | 5,000 | 250    | 0            | 461,936.44     | 0         | 4,071,661.24  | 0              | 1,269,035.53     | 0               | 2,155,172.41      | yjs       |
| class    | read / middle                                           | 5,000 | 250    | 0            | 738,989.06     | 0         | 12,019,230.77 | 0              | 2,840,909.09     | 0               | 8,591,065.29      | yjs       |
| class    | read / tail                                             | 5,000 | 250    | 0            | 2,006,420.55   | 0         | 12,135,922.33 | 0              | 2,799,552.07     | 0               | 4,440,497.34      | yjs       |
| class    | find near head                                          | 5,000 | 250    | 0            | 316,816.63     | 0         | 1,180,358.83  | 0              | 753,012.05       | 0               | 1,311,647.43      | automerge |
| class    | find near middle                                        | 5,000 | 250    | 2.53         | 395.18         | 0.11      | 9,097.49      | 1.15           | 868.32           | 0.02            | 51,803.81         | automerge |
| class    | find near tail                                          | 5,000 | 250    | 5            | 200.08         | 0.2       | 5,035.64      | 2.04           | 489.24           | 0.03            | 36,109.43         | automerge |
| class    | iterate visible values                                  | 5,000 | 250    | 0.17         | 5,912.81       | 0.25      | 4,007.08      | 2.1            | 476.64           | 0.08            | 12,355.07         | automerge |
| class    | collect visible values to array                         | 5,000 | 250    | 0.14         | 7,261.51       | 0.23      | 4,424.79      | 2.21           | 452.46           | 0.09            | 11,226.92         | automerge |
| class    | append / single after tail                              | 5,000 | 250    | 0.01         | 78,924.11      | 0.02      | 40,154.19     | 0.03           | 30,359.7         | 2.51            | 398.65            | crlist    |
| class    | append / batch after tail                               | 5,000 | 25,000 | 0.01         | 101,816.65     | 0         | 494,445.4     | 0.01           | 133,909.97       | 0.23            | 4,300.82          | yjs       |
| class    | prepend / single before head                            | 5,000 | 250    | 0.02         | 53,968.87      | 0.02      | 64,642.91     | 0.01           | 118,821.29       | 2.74            | 365.23            | json-joy  |
| class    | prepend / batch before head                             | 5,000 | 25,000 | 0.01         | 83,483.44      | 0         | 533,195.7     | 0.01           | 146,214.73       | 0.23            | 4,387.05          | yjs       |
| class    | insert / single before middle                           | 5,000 | 250    | 0.01         | 80,598.36      | 0.02      | 53,846.82     | 0.05           | 21,708.17        | 2.39            | 418.65            | crlist    |
| class    | insert / batch before middle                            | 5,000 | 25,000 | 0.01         | 85,392.78      | 0         | 719,658.48    | 0.01           | 150,497.15       | 0.23            | 4,260.34          | yjs       |
| class    | overwrite / head                                        | 5,000 | 250    | 0.01         | 71,300.23      | 0.02      | 45,929.71     | 0.01           | 106,428.27       | 2.52            | 396.81            | json-joy  |
| class    | overwrite / middle                                      | 5,000 | 250    | 0.02         | 46,473.58      | 0.03      | 32,431.31     | 0.01           | 118,945.67       | 3.78            | 264.57            | json-joy  |
| class    | overwrite / tail                                        | 5,000 | 250    | 0.02         | 51,843.56      | 0.02      | 46,648.75     | 0.04           | 26,347.13        | 3.03            | 330.42            | crlist    |
| class    | overwrite / random                                      | 5,000 | 250    | 0.02         | 40,665.61      | 0.04      | 27,112.32     | 0.04           | 23,249.54        | 2.34            | 427.67            | crlist    |
| class    | remove / head                                           | 5,000 | 250    | 0.04         | 23,658.56      | 0.02      | 61,087.35     | 0.07           | 13,703.21        | 0.28            | 3,602.28          | yjs       |
| class    | remove / middle                                         | 5,000 | 250    | 0.01         | 87,296.6       | 0.02      | 62,175.13     | 0.05           | 19,868.23        | 0.29            | 3,465.13          | crlist    |
| class    | remove / tail                                           | 5,000 | 250    | 0            | 216,506.45     | 0.02      | 59,795.74     | 0              | 211,130.82       | 0.38            | 2,634.62          | crlist    |
| class    | remove / range from head                                | 5,000 | 5,000  | 0.02         | 47,520.48      | 0         | 6,840,881.11  | 0              | 281,564.82       | 0.02            | 66,630.42         | yjs       |
| class    | remove / range from middle                              | 5,000 | 5,000  | 0.01         | 69,049.42      | 0         | 6,985,191.39  | 0              | 250,507.28       | 0.02            | 61,535.81         | yjs       |
| class    | remove / range from tail                                | 5,000 | 5,000  | 0.01         | 80,288.14      | 0         | 8,244,023.08  | 0              | 254,958.95       | 0.02            | 60,643.55         | yjs       |
| class    | mixed / append overwrite remove tail                    | 5,000 | 250    | 0.01         | 92,985.2       | 0.02      | 48,187.2      | 0.01           | 124,266.83       | 1.46            | 684.06            | json-joy  |
| class    | mixed / prepend overwrite remove head                   | 5,000 | 250    | 0.01         | 84,625.28      | 0.02      | 65,114.34     | 0.01           | 128,040.97       | 1.53            | 652.91            | json-joy  |
| class    | mixed / insert overwrite remove middle                  | 5,000 | 250    | 0.01         | 83,480.82      | 0.02      | 55,613.64     | 0.01           | 133,554.14       | 1.82            | 548.35            | json-joy  |
| class    | paste / insert 10,000 entries at cursor                 | 5,000 | 10,000 | 0.03         | 37,160.49      | 0         | 865,606.01    | 0.02           | 66,397.8         | 0.2             | 5,107.1           | yjs       |
| class    | render / join visible entries to string                 | 5,000 | 250    | 0.48         | 2,087.48       | 0.35      | 2,846.13      | 2.7            | 370.53           | 0.17            | 5,801             | automerge |
| class    | snapshot                                                | 5,000 | 250    | 0.5          | 1,997.84       | 4.35      | 229.76        | 8.84           | 113.12           | 15.79           | 63.34             | crlist    |
| class    | snapshot / tombstoned state 50% deleted                 | 5,000 | 250    | 0.16         | 6,396.4        | 2.27      | 441.35        | 4.4            | 227.05           | 15.78           | 63.37             | crlist    |
| class    | snapshot / after garbage collection                     | 5,000 | 250    | 0.21         | 4,861.23       | 0.22      | 4,465.86      | 2.14           | 468.15           | 0.07            | 14,034.61         | automerge |
| class    | acknowledge                                             | 5,000 | 250    | 0.08         | 12,972.52      | n/a       | n/a           | n/a            | n/a              | n/a             | n/a               | n/a       |
| class    | acknowledge / 50% deleted state                         | 5,000 | 250    | 0.08         | 12,283.87      | n/a       | n/a           | n/a            | n/a              | n/a             | n/a               | n/a       |
| class    | acknowledge / 90% deleted state                         | 5,000 | 250    | 0.11         | 9,326.76       | n/a       | n/a           | n/a            | n/a              | n/a             | n/a               | n/a       |
| class    | garbage collect                                         | 5,000 | 250    | 0.15         | 6,605.12       | 0.21      | 4,681.35      | 2.07           | 483.42           | 0.08            | 13,062.67         | automerge |
| class    | garbage collect / no eligible tombstones                | 5,000 | 250    | 0.14         | 7,257.15       | 0.22      | 4,521.73      | 2.7            | 370.28           | 0.08            | 12,670.61         | automerge |
| class    | garbage collect / 90% eligible tombstones               | 5,000 | 250    | 0.16         | 6,216.79       | 0.21      | 4,839.46      | 2.31           | 433.38           | 0.08            | 12,553.92         | automerge |
| class    | merge ordered deltas                                    | 5,000 | 250    | 0.03         | 36,511.27      | 0.01      | 71,318.54     | 0.01           | 194,931.77       | 3.18            | 314.82            | json-joy  |
| class    | merge shuffled gossip                                   | 5,000 | 250    | 0.9          | 1,111.87       | 0.48      | 2,093.31      | n/a            | n/a              | 0.85            | 1,169.91          | yjs       |
| class    | merge / duplicate delta ignored                         | 5,000 | 250    | 0            | 418,550.14     | 0.03      | 35,912.32     | 0              | 267,809.32       | 0.04            | 26,273.48         | crlist    |
| class    | merge / concurrent prepends same head                   | 5,000 | 2      | 1.56         | 642.34         | 0.07      | 13,755.16     | n/a            | n/a              | 14.96           | 66.85             | yjs       |
| class    | merge / concurrent appends same tail                    | 5,000 | 2      | 1.17         | 851.21         | 0.03      | 31,496.06     | n/a            | n/a              | 10.81           | 92.48             | yjs       |
| class    | merge / concurrent inserts same middle position         | 5,000 | 2      | 1.2          | 833.33         | 0.05      | 22,123.89     | n/a            | n/a              | 8.79            | 113.81            | yjs       |
| class    | merge / forked replicas rejoin after 250 ops each       | 5,000 | 500    | 0.66         | 1,514.97       | 0.02      | 58,762        | n/a            | n/a              | 3.3             | 303.11            | yjs       |
| latency  | append tail write to remote visible                     | 5,000 | 250    | 0.6          | 1,668.31       | 0.27      | 3,669.59      | 13.23          | 75.59            | 9.02            | 110.9             | yjs       |
| latency  | prepend head write to remote visible                    | 5,000 | 250    | 0.08         | 12,313.21      | 0.04      | 27,665.27     | 0.02           | 49,581.53        | 10.33           | 96.78             | json-joy  |
| latency  | middle insert write to remote visible                   | 5,000 | 250    | 0.44         | 2,253.29       | 0.15      | 6,693.48      | 6.09           | 164.1            | 8.32            | 120.2             | yjs       |
| latency  | head insert write to remote visible                     | 5,000 | 250    | 0.12         | 8,245.38       | 0.03      | 37,005.79     | 0.03           | 31,637.56        | 10.36           | 96.49             | yjs       |
| latency  | overwrite head write to remote visible                  | 5,000 | 250    | 1.48         | 673.5          | 0.04      | 22,415.09     | 0.03           | 29,760.13        | 7.47            | 133.94            | json-joy  |
| latency  | overwrite middle write to remote visible                | 5,000 | 250    | 0.44         | 2,293.12       | 0.16      | 6,443.12      | 3.31           | 302.35           | 6.89            | 145.19            | yjs       |
| latency  | overwrite tail write to remote visible                  | 5,000 | 250    | 0.92         | 1,082.44       | 0.28      | 3,508.97      | 6.59           | 151.64           | 5.9             | 169.54            | yjs       |
| latency  | head delete to remote hidden                            | 5,000 | 250    | 3.13         | 319.47         | 0.3       | 3,362.17      | 6.93           | 144.39           | 2.36            | 422.98            | yjs       |
| latency  | middle delete to remote hidden                          | 5,000 | 250    | 0.86         | 1,156.77       | 0.29      | 3,471.25      | 6.42           | 155.74           | 2.21            | 452.32            | yjs       |
| latency  | tail delete to remote hidden                            | 5,000 | 250    | 1.99         | 503.21         | 0.3       | 3,363.21      | 6.39           | 156.59           | 2.37            | 421.64            | yjs       |
| latency  | append tail write to 10 remotes visible                 | 5,000 | 2,500  | 0.67         | 1,492.57       | 0.24      | 4,102.69      | 13.68          | 73.09            | 3.95            | 253               | yjs       |
| latency  | prepend head write to 10 remotes visible                | 5,000 | 2,500  | 0.15         | 6,619.82       | 0.01      | 88,250.66     | 0.02           | 54,422.01        | 4.03            | 248.04            | yjs       |
| latency  | middle insert write to 10 remotes visible               | 5,000 | 2,500  | 0.48         | 2,068.73       | 0.14      | 6,926.48      | 5.35           | 186.97           | 4.03            | 248.3             | yjs       |
| latency  | overwrite middle write to 10 remotes visible            | 5,000 | 2,500  | 0.45         | 2,230.12       | 0.13      | 7,693.3       | 3.59           | 278.54           | 4               | 249.81            | yjs       |
| latency  | delete middle to 10 remotes hidden                      | 5,000 | 2,500  | 0.96         | 1,043.43       | 0.27      | 3,688.23      | 7.74           | 129.2            | 1.95            | 512.76            | yjs       |
| latency  | out-of-order write delivery to remote visible           | 5,000 | 250    | 2.33         | 429.89         | 88.06     | 11.36         | n/a            | n/a              | 18.12           | 55.19             | crlist    |
| latency  | out-of-order delete delivery to remote convergence      | 5,000 | 250    | 1.31         | 760.81         | 0         | 261,862.37    | 0.01           | 129,708.42       | 0.19            | 5,132.9           | yjs       |
| latency  | out-of-order append delivery to convergence             | 5,000 | 250    | 1.69         | 592.71         | 27        | 37.03         | n/a            | n/a              | 17.74           | 56.37             | crlist    |
| latency  | out-of-order prepend delivery to convergence            | 5,000 | 250    | 1.86         | 538.38         | 26.86     | 37.24         | 0.12           | 8,510.52         | 16.33           | 61.25             | json-joy  |
| latency  | out-of-order middle insert delivery to convergence      | 5,000 | 250    | 1.74         | 575.63         | 85.96     | 11.63         | n/a            | n/a              | 16.36           | 61.13             | crlist    |
| latency  | out-of-order overwrite delivery to convergence          | 5,000 | 129    | 3.29         | 304.25         | n/a       | n/a           | 279.45         | 3.58             | 76.4            | 13.09             | crlist    |
| latency  | offline burst 1,000 ops then sync                       | 5,000 | 1,000  | 0.02         | 41,285.12      | 0.03      | 36,446.73     | 0              | 231,803.43       | 3.31            | 301.76            | json-joy  |
| latency  | forked replicas mixed ops then converge                 | 5,000 | 500    | 0.13         | 7,964.33       | 0.01      | 76,094.24     | n/a            | n/a              | 3.34            | 299.1             | yjs       |
| latency  | duplicate shuffled gossip to convergence                | 5,000 | 500    | 0.37         | 2,723.92       | 0.22      | 4,574.87      | n/a            | n/a              | 0.39            | 2,555.8           | yjs       |
| latency  | remote snapshot hydrate then apply pending deltas       | 5,000 | 250    | 0.02         | 42,884.59      | 0.05      | 22,123.5      | 0.08           | 11,798.69        | 0.71            | 1,414.55          | crlist    |
| workload | local app session                                       | 5,000 | 250    | 0.02         | 49,735.41      | 0.02      | 65,357.77     | 0.01           | 121,124.03       | 1.29            | 772.68            | json-joy  |
| workload | read heavy session                                      | 5,000 | 250    | 0            | 1,708,817.5    | 0         | 3,955,696.2   | 0              | 318,918.23       | 0               | 2,653,927.81      | yjs       |
| workload | write heavy session                                     | 5,000 | 250    | 0.02         | 48,196.49      | 0.02      | 50,626.76     | 0.01           | 120,948.23       | 1.3             | 767.42            | json-joy  |
| workload | append tail heavy session                               | 5,000 | 250    | 0.01         | 175,574.13     | 0.02      | 46,128.01     | 0.01           | 142,685.92       | 1.57            | 636.97            | crlist    |
| workload | prepend head heavy session                              | 5,000 | 250    | 0.02         | 46,766.56      | 0.01      | 79,979.53     | 0.01           | 71,255.52        | 1.66            | 603.81            | yjs       |
| workload | insert middle heavy session                             | 5,000 | 250    | 0.02         | 40,129.7       | 0.02      | 42,028.81     | 0.01           | 129,721.88       | 1.57            | 635.29            | json-joy  |
| workload | overwrite heavy session                                 | 5,000 | 250    | 0.03         | 39,946.95      | 0.02      | 60,816.89     | 0.01           | 122,705.41       | 1.25            | 797.89            | json-joy  |
| workload | delete heavy session                                    | 5,000 | 250    | 0.01         | 71,322.61      | 0.02      | 55,560.49     | 0              | 205,052.49       | 0.24            | 4,166.36          | json-joy  |
| workload | balanced append prepend insert overwrite delete session | 5,000 | 250    | 0.02         | 40,401.43      | 0.02      | 64,591.14     | 0.04           | 22,661.97        | 1.45            | 690.36            | yjs       |
| workload | random edit session                                     | 5,000 | 250    | 0.03         | 32,206.95      | 0.03      | 35,081.32     | 0.05           | 20,528.99        | 1.32            | 758.71            | yjs       |
| workload | text editing session                                    | 5,000 | 250    | 0.03         | 31,452.08      | 0.02      | 66,418.7      | 0.01           | 131,164.74       | 1.62            | 618.82            | json-joy  |
| workload | collaborative offline session                           | 5,000 | 500    | 0.1          | 9,845.16       | 0.01      | 81,699.35     | n/a            | n/a              | 3.38            | 295.46            | yjs       |
| workload | sync and cleanup session                                | 5,000 | 252    | 0.01         | 76,149.03      | 0.01      | 105,283.11    | n/a            | n/a              | 3.3             | 303               | yjs       |
| workload | long lived tombstoned session                           | 5,000 | 250    | 0.01         | 110,497.24     | 0.02      | 63,668.31     | 0.02           | 59,378.19        | 1.79            | 559.57            | crlist    |
| workload | sparse visible session                                  | 5,000 | 250    | 0.01         | 97,690.59      | 0.15      | 6,480.85      | 0.02           | 62,232.4         | 1.1             | 908.92            | crlist    |
| workload | post-gc edit session                                    | 5,000 | 250    | 0.01         | 154,971.49     | 0.02      | 46,034.58     | 0.01           | 139,657          | 1.59            | 630.52            | crlist    |

## License

Apache-2.0
