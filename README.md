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
| crud     | create / empty list                                     | 5,000 | 250    | 0.03         | 30,849.72      | 0.14      | 6,949.99      | 0.02           | 40,419.72        | 0.34            | 2,908.07          | json-joy  |
| crud     | create / hydrate snapshot                               | 5,000 | 250    | 4.54         | 220.1          | 6.8       | 147.11        | 17.18          | 58.2             | 153.62          | 6.51              | crlist    |
| crud     | create / hydrate clean snapshot                         | 5,000 | 250    | 4.54         | 220.15         | 6.71      | 149.02        | 24.14          | 41.42            | 154.28          | 6.48              | crlist    |
| crud     | create / hydrate tombstoned snapshot                    | 5,000 | 250    | 2.77         | 361.43         | 3.31      | 302.01        | 10             | 100.03           | 161.98          | 6.17              | crlist    |
| crud     | read / head                                             | 5,000 | 250    | 0            | 1,926,040.06   | 0         | 972,762.65    | 0              | 251,004.02       | 0               | 3,477,051.46      | automerge |
| crud     | read / middle                                           | 5,000 | 250    | 0            | 5,841,121.5    | 0         | 2,380,952.38  | 0              | 682,128.24       | 0               | 9,803,921.57      | automerge |
| crud     | read / tail                                             | 5,000 | 250    | 0            | 6,038,647.34   | 0         | 1,653,439.15  | 0              | 697,934.12       | 0               | 9,505,703.42      | automerge |
| crud     | read / random indexed reads                             | 5,000 | 250    | 0            | 839,771.58     | 0         | 1,126,126.13  | 0.01           | 182,415.18       | 0               | 1,175,917.22      | automerge |
| crud     | read / sequential indexed reads from head               | 5,000 | 250    | 0            | 1,633,986.93   | 0         | 1,136,880.4   | 0              | 269,628.99       | 0               | 1,221,299.46      | crlist    |
| crud     | read / sequential indexed reads from middle             | 5,000 | 250    | 0            | 5,434,782.61   | 0         | 1,485,442.66  | 0              | 299,437.06       | 0               | 8,503,401.36      | automerge |
| crud     | read / sequential indexed reads from tail               | 5,000 | 250    | 0            | 5,040,322.58   | 0         | 2,994,011.98  | 0              | 218,169.12       | 0               | 6,393,861.89      | automerge |
| crud     | read / full iteration visible values                    | 5,000 | 250    | 0.48         | 2,070.26       | 0.21      | 4,710.64      | 2.13           | 468.8            | 0.09            | 11,194.9          | automerge |
| crud     | read / collect visible values to array                  | 5,000 | 250    | 0.51         | 1,955.6        | 0.2       | 5,009.6       | 1.83           | 545.76           | 0.08            | 12,565.53         | automerge |
| crud     | read / visible sparse over deleted entries              | 5,000 | 250    | 0            | 8,503,401.36   | 0.04      | 25,279.08     | 0.04           | 26,180.48        | 0               | 9,689,922.48      | automerge |
| crud     | find / head                                             | 5,000 | 250    | 0            | 1,475,796.93   | 0         | 1,785,714.29  | 0              | 633,392.45       | 0               | 1,581,277.67      | yjs       |
| crud     | find / middle                                           | 5,000 | 250    | 0.13         | 7,905.81       | 0.12      | 8,519.57      | 0.8            | 1,250.01         | 0.01            | 69,028.36         | automerge |
| crud     | find / tail                                             | 5,000 | 250    | 0.19         | 5,290.09       | 0.19      | 5,324.33      | 1.81           | 553.71           | 0.02            | 53,824.79         | automerge |
| crud     | find / missing value                                    | 5,000 | 250    | 0.2          | 4,983.51       | 0.2       | 5,067.61      | 1.69           | 593.45           | 0.03            | 30,669.2          | automerge |
| crud     | append / single after tail                              | 5,000 | 250    | 0.01         | 196,834.89     | 0.03      | 38,002.01     | 0.03           | 31,602.37        | 1.77            | 566.44            | crlist    |
| crud     | append / batch after tail                               | 5,000 | 25,000 | 0            | 1,540,148.59   | 0         | 523,802.64    | 0.01           | 127,622.38       | 0.18            | 5,577.07          | crlist    |
| crud     | append / batch after deleted tail                       | 5,000 | 25,000 | 0            | 1,490,339.62   | 0         | 593,108.55    | 0.01           | 126,622.93       | 0.18            | 5,554.79          | crlist    |
| crud     | append / batch after garbage collection                 | 5,000 | 25,000 | 0            | 1,331,380.64   | 0         | 702,697.23    | 0.01           | 150,131.94       | 0.18            | 5,653.91          | crlist    |
| crud     | prepend / single before head                            | 5,000 | 250    | 0.01         | 197,769.16     | 0.01      | 67,033.11     | 0.01           | 96,276.04        | 1.79            | 558.46            | crlist    |
| crud     | prepend / batch before head                             | 5,000 | 25,000 | 0            | 1,324,012.29   | 0         | 791,154.26    | 0.01           | 166,383.81       | 0.19            | 5,389.48          | crlist    |
| crud     | prepend / batch before deleted head                     | 5,000 | 25,000 | 0            | 1,299,849.22   | 0         | 894,643.23    | 0.01           | 185,413.86       | 0.19            | 5,306.7           | crlist    |
| crud     | prepend / batch after garbage collection                | 5,000 | 25,000 | 0            | 1,393,658.3    | 0         | 829,399.22    | 0.01           | 168,095.48       | 0.17            | 5,719.98          | crlist    |
| crud     | insert / single before head                             | 5,000 | 250    | 0            | 228,602.78     | 0.02      | 63,603.52     | 0.04           | 25,864.92        | 1.88            | 531               | crlist    |
| crud     | insert / single after head                              | 5,000 | 250    | 0.01         | 162,284.97     | 0.02      | 60,251.13     | 0.04           | 24,831.39        | 1.88            | 531.31            | crlist    |
| crud     | insert / single before middle                           | 5,000 | 250    | 0.01         | 138,427.46     | 0.02      | 53,450.78     | 0.04           | 26,806.49        | 1.86            | 536.55            | crlist    |
| crud     | insert / single after middle                            | 5,000 | 250    | 0.01         | 160,472.43     | 0.02      | 50,193.75     | 0.04           | 25,470.44        | 1.75            | 572.57            | crlist    |
| crud     | insert / single before tail                             | 5,000 | 250    | 0.01         | 137,559.15     | 0.02      | 53,740.33     | 0.04           | 24,982.76        | 1.72            | 580.66            | crlist    |
| crud     | insert / single after tail                              | 5,000 | 250    | 0.01         | 194,507.12     | 0.04      | 26,715.4      | 0.01           | 193,753.39       | 1.78            | 563.31            | crlist    |
| crud     | insert / batch before head                              | 5,000 | 25,000 | 0            | 1,165,425.1    | 0         | 819,733.95    | 0.01           | 161,975.85       | 0.18            | 5,432.13          | crlist    |
| crud     | insert / batch after head                               | 5,000 | 25,000 | 0            | 1,123,070.56   | 0         | 881,924.43    | 0.01           | 165,165.75       | 0.18            | 5,523.24          | crlist    |
| crud     | insert / batch before middle                            | 5,000 | 25,000 | 0            | 643,759.14     | 0         | 843,645.49    | 0.01           | 155,392.23       | 0.19            | 5,304.24          | yjs       |
| crud     | insert / batch after middle                             | 5,000 | 25,000 | 0            | 743,226.97     | 0         | 835,424.68    | 0.01           | 180,540.61       | 0.18            | 5,430.81          | yjs       |
| crud     | insert / batch before tail                              | 5,000 | 25,000 | 0            | 1,330,176.38   | 0         | 650,037.83    | 0.01           | 173,310.35       | 0.18            | 5,430.89          | crlist    |
| crud     | insert / batch after tail                               | 5,000 | 25,000 | 0            | 1,508,860.03   | 0         | 557,781.72    | 0.01           | 148,056.02       | 0.18            | 5,409.88          | crlist    |
| crud     | insert / repeated before head                           | 5,000 | 250    | 0            | 264,774.41     | 0.01      | 89,512.69     | 0.01           | 138,881.17       | 1.83            | 545.5             | crlist    |
| crud     | insert / repeated before middle                         | 5,000 | 250    | 0.01         | 168,112.43     | 0.01      | 69,879.25     | 0.01           | 146,207.38       | 1.8             | 554.89            | crlist    |
| crud     | insert / repeated before tail                           | 5,000 | 250    | 0.01         | 147,736.67     | 0.01      | 75,183.45     | 0.01           | 166,666.67       | 1.81            | 551.5             | json-joy  |
| crud     | insert / random positions                               | 5,000 | 250    | 0.01         | 162,548.76     | 0.03      | 31,316.16     | 0.05           | 21,670.35        | 1.81            | 554.01            | crlist    |
| crud     | insert / alternating head and tail                      | 5,000 | 250    | 0            | 328,601.47     | 0.01      | 95,660.82     | 0.01           | 117,123.45       | 1.81            | 552.89            | crlist    |
| crud     | overwrite / head                                        | 5,000 | 250    | 0.01         | 117,326.83     | 0.03      | 36,099.52     | 0.05           | 20,977.55        | 1.95            | 512.7             | crlist    |
| crud     | overwrite / middle                                      | 5,000 | 250    | 0.01         | 141,787.66     | 0.02      | 55,709.06     | 0.04           | 24,970.29        | 1.97            | 507.28            | crlist    |
| crud     | overwrite / tail                                        | 5,000 | 250    | 0.01         | 193,648.33     | 0.02      | 53,369.77     | 0.05           | 21,536.87        | 1.83            | 546.02            | crlist    |
| crud     | overwrite / random                                      | 5,000 | 250    | 0.02         | 57,019.04      | 0.03      | 30,326.92     | 0.01           | 88,445.48        | 2.02            | 496.24            | json-joy  |
| crud     | overwrite / same head repeatedly                        | 5,000 | 250    | 0.01         | 82,712.99      | 0.02      | 57,251.47     | 0.01           | 120,598.17       | 1.91            | 524.66            | json-joy  |
| crud     | overwrite / same middle repeatedly                      | 5,000 | 250    | 0.01         | 149,763.37     | 0.02      | 41,383.19     | 0.01           | 119,081.64       | 1.84            | 542.09            | crlist    |
| crud     | overwrite / same tail repeatedly                        | 5,000 | 250    | 0.01         | 186,344.66     | 0.02      | 57,003.44     | 0.01           | 111,861.83       | 1.84            | 542.85            | crlist    |
| crud     | overwrite / random visible entries                      | 5,000 | 250    | 0.02         | 60,286         | 0.03      | 29,335.15     | 0.01           | 89,282.53        | 2.03            | 491.94            | json-joy  |
| crud     | overwrite / after insert                                | 5,000 | 250    | 0.01         | 128,402.67     | 0.02      | 54,984.93     | 0.01           | 91,034.88        | 1.82            | 550.67            | crlist    |
| crud     | overwrite / after delete                                | 5,000 | 250    | 0.01         | 154,702.97     | 0.02      | 54,747.72     | 0.01           | 108,752.39       | 1.91            | 524.4             | crlist    |
| crud     | delete / head                                           | 5,000 | 250    | 0            | 201,013.11     | 0.02      | 55,063.65     | 0.05           | 19,889.26        | 0.25            | 3,930.45          | crlist    |
| crud     | delete / middle                                         | 5,000 | 250    | 0.01         | 195,633.46     | 0.01      | 71,223.04     | 0.04           | 24,838.55        | 0.27            | 3,716.46          | crlist    |
| crud     | delete / tail                                           | 5,000 | 250    | 0            | 467,377.08     | 0.02      | 62,597.03     | 0              | 247,524.75       | 0.25            | 4,002.79          | crlist    |
| crud     | delete / range from head                                | 5,000 | 5,000  | 0            | 927,953.68     | 0         | 9,558,401.84  | 0              | 439,409.78       | 0.02            | 53,650.03         | yjs       |
| crud     | delete / range from middle                              | 5,000 | 5,000  | 0            | 641,239.39     | 0         | 7,301,401.87  | 0              | 246,333.33       | 0.02            | 56,754.14         | yjs       |
| crud     | delete / range from tail                                | 5,000 | 5,000  | 0            | 590,151.55     | 0         | 9,718,172.98  | 0              | 274,361.97       | 0.01            | 67,928.23         | yjs       |
| crud     | delete / every other entry                              | 5,000 | 2,500  | 0            | 210,604.35     | 0.09      | 10,609.16     | 0.1            | 10,420.68        | 0.22            | 4,485.97          | crlist    |
| crud     | delete / all entries from head one by one               | 5,000 | 5,000  | 0            | 232,853.81     | 0.01      | 85,215.75     | 0.01           | 107,869.51       | 0.21            | 4,848.99          | crlist    |
| crud     | delete / all entries from middle outward                | 5,000 | 5,000  | 0            | 204,232.51     | 0.01      | 99,946.03     | 0.01           | 145,708.45       | 0.2             | 4,935.16          | crlist    |
| crud     | delete / all entries from tail one by one               | 5,000 | 5,000  | 0            | 490,441.3      | 0.01      | 92,757.32     | 0.01           | 199,933.62       | 0.19            | 5,320.1           | crlist    |
| crud     | delete / all entries in random order                    | 5,000 | 5,000  | 0.13         | 7,713.25       | 12.25     | 81.64         | 7.96           | 125.58           | 0.28            | 3,617.95          | crlist    |
| crud     | delete / already deleted head                           | 5,000 | 250    | 0            | 370,809.85     | 0         | 284,770.47    | 0              | 556,916.91       | 0.02            | 41,812.31         | json-joy  |
| crud     | delete / already deleted middle                         | 5,000 | 250    | 0            | 513,030.99     | 0         | 323,918.11    | 0              | 524,438.85       | 0.02            | 46,879.69         | json-joy  |
| crud     | delete / already deleted tail                           | 5,000 | 250    | 0            | 2,510,040.16   | 0         | 295,998.11    | 0              | 1,136,363.64     | 0.03            | 38,407.18         | crlist    |
| crud     | mixed / append overwrite delete tail                    | 5,000 | 250    | 0.01         | 191,365.58     | 0.04      | 27,121.73     | 0.01           | 96,599.69        | 1.58            | 633.5             | crlist    |
| crud     | mixed / prepend overwrite delete head                   | 5,000 | 250    | 0.01         | 160,699.36     | 0.02      | 62,423.53     | 0.01           | 103,173.62       | 1.6             | 625.57            | crlist    |
| crud     | mixed / insert overwrite delete middle                  | 5,000 | 250    | 0.01         | 197,378.81     | 0.02      | 60,644.28     | 0.01           | 125,175.25       | 1.97            | 506.8             | crlist    |
| crud     | mixed / append prepend insert overwrite delete          | 5,000 | 250    | 0            | 213,165.08     | 0.02      | 56,451.25     | 0.01           | 119,110.01       | 1.94            | 516.22            | crlist    |
| mags     | snapshot                                                | 5,000 | 250    | 0.21         | 4,712.56       | 3.59      | 278.61        | 7.65           | 130.76           | 15.01           | 66.62             | crlist    |
| mags     | snapshot / clean state                                  | 5,000 | 250    | 0.21         | 4,807.67       | 3.67      | 272.85        | 8.73           | 114.52           | 14.58           | 68.61             | crlist    |
| mags     | snapshot / tombstoned state 50% deleted                 | 5,000 | 250    | 0.12         | 8,112.54       | 1.74      | 574.15        | 3.21           | 311.21           | 14.77           | 67.72             | crlist    |
| mags     | snapshot / tombstoned state 90% deleted                 | 5,000 | 250    | 0.03         | 33,020.3       | 0.36      | 2,779.32      | 0.52           | 1,908.72         | 14.71           | 67.96             | crlist    |
| mags     | snapshot / after garbage collection                     | 5,000 | 250    | 0.12         | 8,482.05       | 1.83      | 547.49        | 3.15           | 317.92           | 14.49           | 69.04             | crlist    |
| mags     | acknowledge                                             | 5,000 | 250    | 0            | 1,924,557.35   | n/a       | n/a           | n/a            | n/a              | n/a             | n/a               | n/a       |
| mags     | acknowledge / clean state                               | 5,000 | 250    | 0            | 7,225,433.53   | n/a       | n/a           | n/a            | n/a              | n/a             | n/a               | n/a       |
| mags     | acknowledge / 50% deleted state                         | 5,000 | 250    | 0.51         | 1,963.6        | n/a       | n/a           | n/a            | n/a              | n/a             | n/a               | n/a       |
| mags     | acknowledge / 90% deleted state                         | 5,000 | 250    | 0.9          | 1,115.79       | n/a       | n/a           | n/a            | n/a              | n/a             | n/a               | n/a       |
| mags     | garbage collect                                         | 5,000 | 250    | 0            | 1,132,759.4    | n/a       | n/a           | n/a            | n/a              | n/a             | n/a               | n/a       |
| mags     | garbage collect / no eligible tombstones                | 5,000 | 250    | 0            | 5,434,782.61   | n/a       | n/a           | n/a            | n/a              | n/a             | n/a               | n/a       |
| mags     | garbage collect / 50% eligible tombstones               | 5,000 | 250    | 0            | 260,226.92     | n/a       | n/a           | n/a            | n/a              | n/a             | n/a               | n/a       |
| mags     | garbage collect / 90% eligible tombstones               | 5,000 | 250    | 0.01         | 77,593.97      | n/a       | n/a           | n/a            | n/a              | n/a             | n/a               | n/a       |
| mags     | garbage collect / partial frontiers 2 replicas          | 5,000 | 250    | 0            | 4,725,897.92   | n/a       | n/a           | n/a            | n/a              | n/a             | n/a               | n/a       |
| mags     | garbage collect / partial frontiers 10 replicas         | 5,000 | 250    | 0            | 4,545,454.55   | n/a       | n/a           | n/a            | n/a              | n/a             | n/a               | n/a       |
| mags     | post-gc read / full iteration visible values            | 5,000 | 250    | 0.22         | 4,647.65       | 0.09      | 10,561.54     | 0.69           | 1,455.3          | 0.03            | 32,356.6          | automerge |
| mags     | merge ordered deltas                                    | 5,000 | 250    | 0.02         | 50,528.53      | 0.02      | 66,191.85     | 0.01           | 190,360.16       | 2.92            | 342.83            | json-joy  |
| mags     | merge shuffled gossip                                   | 5,000 | 250    | 0.9          | 1,112.54       | 0.62      | 1,625.71      | n/a            | n/a              | 0.72            | 1,393.37          | yjs       |
| mags     | merge / append head delta into equal replica            | 5,000 | 1      | 0.07         | 15,267.18      | 0.06      | 15,847.86     | 0.05           | 21,367.52        | 3.25            | 307.47            | json-joy  |
| mags     | merge / append tail delta into equal replica            | 5,000 | 1      | 0.04         | 25,000         | 0.03      | 29,940.12     | 0.01           | 98,039.22        | 3.57            | 280.27            | json-joy  |
| mags     | merge / prepend head delta into equal replica           | 5,000 | 1      | 0.04         | 28,409.09      | 0.04      | 26,041.67     | 0.01           | 95,238.1         | 4.13            | 241.95            | json-joy  |
| mags     | merge / insert middle delta into equal replica          | 5,000 | 1      | 0.03         | 29,761.9       | 0.03      | 28,653.3      | 6              | 166.58           | 3.89            | 256.94            | crlist    |
| mags     | merge / overwrite head delta into equal replica         | 5,000 | 1      | 0.04         | 26,178.01      | 0.04      | 26,525.2      | 0.01           | 83,333.33        | 4.67            | 214.27            | json-joy  |
| mags     | merge / overwrite middle delta into equal replica       | 5,000 | 1      | 0.04         | 26,246.72      | 0.04      | 25,380.71     | 0.01           | 71,428.57        | 5.18            | 193.23            | json-joy  |
| mags     | merge / overwrite tail delta into equal replica         | 5,000 | 1      | 0.04         | 26,109.66      | 0.04      | 26,954.18     | 0.01           | 82,644.63        | 4.5             | 222.1             | json-joy  |
| mags     | merge / delete head delta into equal replica            | 5,000 | 1      | 0.03         | 28,985.51      | 0.02      | 49,504.95     | 0.02           | 56,497.18        | 1.86            | 536.42            | json-joy  |
| mags     | merge / delete middle delta into equal replica          | 5,000 | 1      | 0.04         | 24,096.39      | 0.1       | 10,070.49     | 0.08           | 12,771.39        | 1.98            | 504.21            | crlist    |
| mags     | merge / delete tail delta into equal replica            | 5,000 | 1      | 0.02         | 47,846.89      | 0.02      | 50,761.42     | 0.01           | 100,000          | 1.78            | 560.29            | json-joy  |
| mags     | merge / duplicate delta ignored                         | 5,000 | 250    | 0            | 690,417.01     | 0.03      | 39,722.26     | 0.01           | 112,622.76       | 0.03            | 33,325.34         | crlist    |
| mags     | merge / old delta ignored after merge                   | 5,000 | 250    | 0            | 718,803.91     | 0.02      | 42,050.73     | 0              | 289,184.5        | 0.03            | 33,138.04         | crlist    |
| mags     | merge / ordered 1,000 append deltas                     | 5,000 | 1,000  | 0            | 222,375.41     | 0.02      | 55,804.19     | 0.01           | 72,391.9         | 3.46            | 288.65            | crlist    |
| mags     | merge / ordered 1,000 prepend deltas                    | 5,000 | 1,000  | 0            | 245,960.11     | 0.01      | 114,208.7     | 0.01           | 80,055.72        | 3.75            | 266.99            | crlist    |
| mags     | merge / ordered 1,000 middle insert deltas              | 5,000 | 1,000  | 0.01         | 199,564.95     | 0.01      | 121,503.73    | 0.01           | 95,644.36        | 3.52            | 284.27            | crlist    |
| mags     | merge / shuffled 1,000 mixed deltas                     | 5,000 | 1,000  | 0.91         | 1,095.47       | 1.3       | 769.47        | n/a            | n/a              | 0.87            | 1,146.2           | automerge |
| mags     | merge / reverse ordered 1,000 mixed deltas              | 5,000 | 1,000  | 0.22         | 4,519.37       | 1.18      | 847.95        | n/a            | n/a              | 0.85            | 1,176.63          | crlist    |
| mags     | merge / concurrent prepends same head                   | 5,000 | 2      | 0.06         | 16,652.79      | 0.11      | 8,699.43      | n/a            | n/a              | 11.82           | 84.62             | crlist    |
| mags     | merge / concurrent appends same tail                    | 5,000 | 2      | 0.03         | 36,697.25      | 0.03      | 31,007.75     | n/a            | n/a              | 15.09           | 66.26             | crlist    |
| mags     | merge / concurrent inserts same middle position         | 5,000 | 2      | 0.04         | 28,089.89      | 0.05      | 20,512.82     | n/a            | n/a              | 8.7             | 114.95            | crlist    |
| mags     | merge / concurrent overwrites same head                 | 5,000 | 2      | 0.03         | 36,297.64      | 0.04      | 24,906.6      | n/a            | n/a              | 15.13           | 66.08             | crlist    |
| mags     | merge / concurrent overwrites same middle               | 5,000 | 2      | 0.03         | 30,534.35      | 0.05      | 20,790.02     | n/a            | n/a              | 10.69           | 93.5              | crlist    |
| mags     | merge / concurrent overwrites same tail                 | 5,000 | 2      | 0.03         | 31,645.57      | 0.04      | 26,212.32     | n/a            | n/a              | 11.76           | 85.07             | crlist    |
| mags     | merge / concurrent deletes same head                    | 5,000 | 2      | 0.04         | 27,397.26      | 0.02      | 43,572.98     | 0.02           | 48,661.8         | 11.41           | 87.62             | json-joy  |
| mags     | merge / concurrent deletes same middle                  | 5,000 | 2      | 0.04         | 24,360.54      | 0.03      | 31,897.93     | 0.02           | 49,875.31        | 6               | 166.53            | json-joy  |
| mags     | merge / concurrent deletes same tail                    | 5,000 | 2      | 0.01         | 68,728.52      | 0.03      | 36,630.04     | 0.02           | 64,516.13        | 7.67            | 130.42            | crlist    |
| mags     | merge / concurrent overwrite delete same entry          | 5,000 | 2      | 0.08         | 12,254.9       | 0.08      | 12,391.57     | 0.06           | 15,974.44        | 13.37           | 74.78             | json-joy  |
| mags     | merge / forked replicas rejoin after 250 ops each       | 5,000 | 500    | 0.01         | 136,552.33     | 0.01      | 94,628.87     | n/a            | n/a              | 3.13            | 319.17            | crlist    |
| mags     | merge / 10 replicas gossip convergence                  | 5,000 | 100    | 0.01         | 129,634.43     | 0.01      | 73,605.18     | n/a            | n/a              | 6.35            | 157.45            | crlist    |
| mags     | merge / snapshot merge into stale replica               | 5,000 | 5,350  | 0            | 721,851.18     | 0         | 447,837.41    | 0.01           | 87,967.23        | 0.03            | 32,508.23         | crlist    |
| class    | constructor / hydrate snapshot                          | 5,000 | 250    | 5.37         | 186.06         | 6.87      | 145.61        | 24.82          | 40.29            | 172.71          | 5.79              | crlist    |
| class    | read / head                                             | 5,000 | 250    | 0            | 1,149,425.29   | 0         | 4,921,259.84  | 0              | 1,096,010.52     | 0               | 2,175,805.05      | yjs       |
| class    | read / middle                                           | 5,000 | 250    | 0            | 1,533,742.33   | 0         | 14,705,882.35 | 0              | 3,234,152.65     | 0               | 11,961,722.49     | yjs       |
| class    | read / tail                                             | 5,000 | 250    | 0            | 2,714,440.83   | 0         | 15,822,784.81 | 0              | 3,056,234.72     | 0               | 7,183,908.05      | yjs       |
| class    | find near head                                          | 5,000 | 250    | 0            | 707,213.58     | 0         | 3,063,725.49  | 0              | 686,247.6        | 0               | 1,481,920.57      | yjs       |
| class    | find near middle                                        | 5,000 | 250    | 0.99         | 1,013.25       | 0.09      | 11,354.86     | 1.02           | 982.65           | 0.01            | 67,682.81         | automerge |
| class    | find near tail                                          | 5,000 | 250    | 1.94         | 514.81         | 0.15      | 6,485.39      | 1.97           | 506.53           | 0.02            | 51,212.72         | automerge |
| class    | iterate visible values                                  | 5,000 | 250    | 0.11         | 8,800.03       | 0.2       | 5,007.72      | 2.15           | 464.09           | 0.08            | 12,922.84         | automerge |
| class    | collect visible values to array                         | 5,000 | 250    | 0.11         | 9,171.48       | 0.2       | 5,054.21      | 1.63           | 615.38           | 0.08            | 12,232.54         | automerge |
| class    | append / single after tail                              | 5,000 | 250    | 0.01         | 189,393.94     | 0.02      | 42,611.94     | 0.04           | 25,583.3         | 1.85            | 539.62            | crlist    |
| class    | append / batch after tail                               | 5,000 | 25,000 | 0            | 1,355,623.4    | 0         | 547,623.53    | 0.01           | 164,912.22       | 0.19            | 5,277.65          | crlist    |
| class    | prepend / single before head                            | 5,000 | 250    | 0.01         | 185,089.21     | 0.01      | 68,553.25     | 0.01           | 135,943.45       | 1.96            | 510.75            | crlist    |
| class    | prepend / batch before head                             | 5,000 | 25,000 | 0            | 1,276,780.47   | 0         | 786,242.64    | 0.01           | 171,546.71       | 0.18            | 5,480.5           | crlist    |
| class    | insert / single before middle                           | 5,000 | 250    | 0.01         | 175,722.22     | 0.02      | 62,636.23     | 0.01           | 148,077.95       | 1.9             | 526.38            | crlist    |
| class    | insert / batch before middle                            | 5,000 | 25,000 | 0            | 957,876.43     | 0         | 699,236.15    | 0.01           | 184,123.27       | 0.18            | 5,408.03          | crlist    |
| class    | overwrite / head                                        | 5,000 | 250    | 0.01         | 139,283.53     | 0.02      | 57,557.27     | 0.01           | 122,886.35       | 1.97            | 507.07            | crlist    |
| class    | overwrite / middle                                      | 5,000 | 250    | 0.01         | 126,575.87     | 0.02      | 45,009.36     | 0.04           | 23,601.6         | 1.94            | 514.55            | crlist    |
| class    | overwrite / tail                                        | 5,000 | 250    | 0.01         | 178,088.05     | 0.02      | 63,537.25     | 0.03           | 31,504           | 1.88            | 532.23            | crlist    |
| class    | overwrite / random                                      | 5,000 | 250    | 0.03         | 34,467.07      | 0.03      | 29,071.8      | 0.04           | 27,660.68        | 2               | 500.25            | crlist    |
| class    | remove / head                                           | 5,000 | 250    | 0.01         | 136,462.88     | 0.02      | 65,412.49     | 0.05           | 20,312.82        | 0.28            | 3,624.07          | crlist    |
| class    | remove / middle                                         | 5,000 | 250    | 0.01         | 140,362.7      | 0.01      | 94,546.55     | 0.03           | 29,954.11        | 0.26            | 3,825.61          | crlist    |
| class    | remove / tail                                           | 5,000 | 250    | 0            | 244,690.22     | 0.02      | 64,419.71     | 0              | 291,749.33       | 0.26            | 3,917.22          | json-joy  |
| class    | remove / range from head                                | 5,000 | 5,000  | 0            | 910,846.36     | 0         | 8,925,383.79  | 0              | 337,570.97       | 0.01            | 74,046.43         | yjs       |
| class    | remove / range from middle                              | 5,000 | 5,000  | 0            | 890,059.81     | 0         | 7,836,990.6   | 0              | 272,980.9        | 0.02            | 55,781.1          | yjs       |
| class    | remove / range from tail                                | 5,000 | 5,000  | 0            | 663,235.53     | 0         | 8,944,543.83  | 0              | 487,158.5        | 0.02            | 59,707.41         | yjs       |
| class    | mixed / append overwrite remove tail                    | 5,000 | 250    | 0            | 201,126.31     | 0.02      | 60,515.1      | 0.03           | 30,551.14        | 1.35            | 741.12            | crlist    |
| class    | mixed / prepend overwrite remove head                   | 5,000 | 250    | 0            | 211,202.16     | 0.01      | 79,121.44     | 0.03           | 29,287.72        | 1.44            | 695.32            | crlist    |
| class    | mixed / insert overwrite remove middle                  | 5,000 | 250    | 0.01         | 192,411.3      | 0.01      | 72,756.9      | 0.01           | 164,106.6        | 1.53            | 653.11            | crlist    |
| class    | paste / insert 10,000 entries at cursor                 | 5,000 | 10,000 | 0            | 463,338.35     | 0         | 948,325.73    | 0.01           | 98,656.01        | 0.18            | 5,581.44          | yjs       |
| class    | render / join visible entries to string                 | 5,000 | 250    | 0.28         | 3,615.3        | 0.3       | 3,315.79      | 2.47           | 404.5            | 0.18            | 5,446.78          | automerge |
| class    | snapshot                                                | 5,000 | 250    | 0.26         | 3,802.45       | 3.57      | 280.04        | 7.74           | 129.23           | 14.86           | 67.31             | crlist    |
| class    | snapshot / tombstoned state 50% deleted                 | 5,000 | 250    | 0.12         | 8,296.25       | 2.02      | 495.45        | 3.1            | 323.06           | 16.31           | 61.3              | crlist    |
| class    | snapshot / after garbage collection                     | 5,000 | 250    | 0.13         | 7,910.19       | 0.19      | 5,269.4       | 1.78           | 562.59           | 0.07            | 13,723.14         | automerge |
| class    | acknowledge                                             | 5,000 | 250    | 0.53         | 1,881.5        | n/a       | n/a           | n/a            | n/a              | n/a             | n/a               | n/a       |
| class    | acknowledge / 50% deleted state                         | 5,000 | 250    | 0.53         | 1,875.1        | n/a       | n/a           | n/a            | n/a              | n/a             | n/a               | n/a       |
| class    | acknowledge / 90% deleted state                         | 5,000 | 250    | 0.89         | 1,122.01       | n/a       | n/a           | n/a            | n/a              | n/a             | n/a               | n/a       |
| class    | garbage collect                                         | 5,000 | 250    | 0.11         | 9,314.04       | 0.19      | 5,342.06      | 1.46           | 683.71           | 0.08            | 12,161.31         | automerge |
| class    | garbage collect / no eligible tombstones                | 5,000 | 250    | 0.11         | 9,208.24       | 0.19      | 5,212.81      | 2.09           | 478.86           | 0.08            | 12,641.2          | automerge |
| class    | garbage collect / 90% eligible tombstones               | 5,000 | 250    | 0.1          | 9,608.47       | 0.2       | 5,120.11      | 1.63           | 612.85           | 0.07            | 14,219.82         | automerge |
| class    | merge ordered deltas                                    | 5,000 | 250    | 0.01         | 105,610        | 0.02      | 58,028.88     | 0              | 219,413.73       | 2.89            | 345.47            | json-joy  |
| class    | merge shuffled gossip                                   | 5,000 | 250    | 0.82         | 1,219.29       | 0.35      | 2,860.48      | n/a            | n/a              | 0.7             | 1,425.11          | yjs       |
| class    | merge / duplicate delta ignored                         | 5,000 | 250    | 0            | 683,433.57     | 0.03      | 38,032.65     | 0              | 312,265.8        | 0.04            | 26,079.43         | crlist    |
| class    | merge / concurrent prepends same head                   | 5,000 | 2      | 0.08         | 12,217.47      | 0.08      | 12,070.01     | n/a            | n/a              | 10.21           | 97.93             | crlist    |
| class    | merge / concurrent appends same tail                    | 5,000 | 2      | 0.04         | 27,434.84      | 0.03      | 37,453.18     | n/a            | n/a              | 17.23           | 58.05             | yjs       |
| class    | merge / concurrent inserts same middle position         | 5,000 | 2      | 0.03         | 29,542.1       | 0.04      | 26,809.65     | n/a            | n/a              | 10.95           | 91.3              | crlist    |
| class    | merge / forked replicas rejoin after 250 ops each       | 5,000 | 500    | 0.57         | 1,752.43       | 0.01      | 105,670.27    | n/a            | n/a              | 3.12            | 320.15            | yjs       |
| latency  | append tail write to remote visible                     | 5,000 | 250    | 0.21         | 4,681.14       | 0.24      | 4,157.9       | 10.67          | 93.69            | 5.56            | 179.94            | crlist    |
| latency  | prepend head write to remote visible                    | 5,000 | 250    | 0.02         | 52,498.95      | 0.03      | 31,798.93     | 0.04           | 24,853.86        | 5.53            | 180.7             | crlist    |
| latency  | middle insert write to remote visible                   | 5,000 | 250    | 0.3          | 3,332.91       | 0.14      | 7,153.83      | 3.73           | 268.24           | 5.71            | 175.28            | yjs       |
| latency  | head insert write to remote visible                     | 5,000 | 250    | 0.01         | 98,120.02      | 0.02      | 43,068.55     | 0.02           | 57,357.87        | 5.49            | 182.31            | crlist    |
| latency  | overwrite head write to remote visible                  | 5,000 | 250    | 0.02         | 46,865.63      | 0.03      | 32,700.68     | 0.02           | 61,079.89        | 5.73            | 174.67            | json-joy  |
| latency  | overwrite middle write to remote visible                | 5,000 | 250    | 0.28         | 3,520.05       | 0.13      | 7,409.78      | 2.33           | 428.78           | 5.6             | 178.72            | yjs       |
| latency  | overwrite tail write to remote visible                  | 5,000 | 250    | 0.59         | 1,695.19       | 0.22      | 4,539.19      | 6.72           | 148.72           | 5.52            | 181.31            | yjs       |
| latency  | head delete to remote hidden                            | 5,000 | 250    | 0.62         | 1,613.51       | 0.23      | 4,318.27      | 5.98           | 167.2            | 2.19            | 457.06            | yjs       |
| latency  | middle delete to remote hidden                          | 5,000 | 250    | 0.58         | 1,716.78       | 0.24      | 4,128.46      | 5.91           | 169.09           | 2.11            | 472.98            | yjs       |
| latency  | tail delete to remote hidden                            | 5,000 | 250    | 0.2          | 5,015.55       | 0.2       | 4,896.13      | 5.39           | 185.69           | 2.04            | 489.77            | crlist    |
| latency  | append tail write to 10 remotes visible                 | 5,000 | 2,500  | 0.24         | 4,116.97       | 0.19      | 5,179.08      | 11.81          | 84.66            | 3.7             | 270.06            | yjs       |
| latency  | prepend head write to 10 remotes visible                | 5,000 | 2,500  | 0            | 260,647.45     | 0.01      | 106,102.6     | 0.01           | 80,876.83        | 4.11            | 243.41            | crlist    |
| latency  | middle insert write to 10 remotes visible               | 5,000 | 2,500  | 0.3          | 3,309.81       | 0.12      | 8,443.93      | 4.59           | 217.93           | 3.74            | 267.19            | yjs       |
| latency  | overwrite middle write to 10 remotes visible            | 5,000 | 2,500  | 0.29         | 3,444.79       | 0.1       | 9,613.56      | 3.27           | 305.9            | 3.68            | 271.82            | yjs       |
| latency  | delete middle to 10 remotes hidden                      | 5,000 | 2,500  | 0.67         | 1,493.55       | 0.22      | 4,511.95      | 6.26           | 159.78           | 1.84            | 543.78            | yjs       |
| latency  | out-of-order write delivery to remote visible           | 5,000 | 250    | 1.89         | 527.94         | 70.45     | 14.19         | n/a            | n/a              | 15.58           | 64.17             | crlist    |
| latency  | out-of-order delete delivery to remote convergence      | 5,000 | 165    | 3.02         | 330.67         | 0.21      | 4,801.91      | 6.95           | 143.86           | 7.28            | 137.34            | yjs       |
| latency  | out-of-order append delivery to convergence             | 5,000 | 250    | 1.87         | 534.98         | 22.02     | 45.41         | n/a            | n/a              | 14.98           | 66.76             | crlist    |
| latency  | out-of-order prepend delivery to convergence            | 5,000 | 250    | 1.84         | 542.39         | 24.6      | 40.65         | 0.11           | 9,188.07         | 16.79           | 59.57             | json-joy  |
| latency  | out-of-order middle insert delivery to convergence      | 5,000 | 250    | 1.79         | 560.05         | 72.57     | 13.78         | n/a            | n/a              | 16.14           | 61.96             | crlist    |
| latency  | out-of-order overwrite delivery to convergence          | 5,000 | 129    | 2.56         | 390.75         | n/a       | n/a           | 218.62         | 4.57             | 75.08           | 13.32             | crlist    |
| latency  | offline burst 1,000 ops then sync                       | 5,000 | 1,000  | 0.01         | 158,102.77     | 0.03      | 36,580.73     | 0              | 272,375.66       | 3.15            | 317.41            | json-joy  |
| latency  | forked replicas mixed ops then converge                 | 5,000 | 500    | 0.01         | 188,985.9      | 0.01      | 68,604.04     | n/a            | n/a              | 3.12            | 320.26            | crlist    |
| latency  | duplicate shuffled gossip to convergence                | 5,000 | 500    | 0.57         | 1,761.77       | 0.2       | 4,983.37      | n/a            | n/a              | 0.4             | 2,472.4           | yjs       |
| latency  | remote snapshot hydrate then apply pending deltas       | 5,000 | 250    | 0.02         | 42,904.46      | 0.04      | 25,082.52     | 0.07           | 15,325.95        | 0.7             | 1,436.78          | crlist    |
| workload | local app session                                       | 5,000 | 250    | 0.02         | 48,245.78      | 0.01      | 80,671.18     | 0.04           | 27,327.18        | 1.2             | 831.56            | yjs       |
| workload | read heavy session                                      | 5,000 | 250    | 0            | 2,289,377.29   | 0         | 5,376,344.09  | 0              | 395,381.94       | 0               | 1,251,251.25      | yjs       |
| workload | write heavy session                                     | 5,000 | 250    | 0.01         | 144,826.79     | 0.01      | 83,595.27     | 0.01           | 156,808.63       | 1.23            | 811.8             | json-joy  |
| workload | append tail heavy session                               | 5,000 | 250    | 0            | 374,644.09     | 0.02      | 58,995.66     | 0.01           | 168,123.74       | 1.47            | 680.14            | crlist    |
| workload | prepend head heavy session                              | 5,000 | 250    | 0.01         | 85,470.09      | 0.01      | 103,545.39    | 0.01           | 136,918.78       | 1.58            | 631.45            | json-joy  |
| workload | insert middle heavy session                             | 5,000 | 250    | 0.01         | 114,228.27     | 0.02      | 64,307.03     | 0.01           | 163,923.68       | 1.59            | 629.5             | json-joy  |
| workload | overwrite heavy session                                 | 5,000 | 250    | 0.01         | 149,280.47     | 0.01      | 85,960.87     | 0.01           | 153,817.76       | 1.38            | 723.14            | json-joy  |
| workload | delete heavy session                                    | 5,000 | 250    | 0            | 203,865.29     | 0.01      | 76,717.71     | 0.05           | 22,193.62        | 0.22            | 4,616.94          | crlist    |
| workload | balanced append prepend insert overwrite delete session | 5,000 | 250    | 0.01         | 158,740.24     | 0.01      | 79,645.74     | 0.01           | 158,508.75       | 1.41            | 710.73            | crlist    |
| workload | random edit session                                     | 5,000 | 250    | 0.02         | 63,592.2       | 0.02      | 41,243.24     | 0.04           | 26,968.43        | 1.2             | 834.73            | crlist    |
| workload | text editing session                                    | 5,000 | 250    | 0.01         | 142,702.21     | 0.01      | 77,373.03     | 0.01           | 152,634.47       | 1.64            | 610.01            | json-joy  |
| workload | collaborative offline session                           | 5,000 | 500    | 0            | 202,716.4      | 0.01      | 82,163.87     | n/a            | n/a              | 3.16            | 316.64            | crlist    |
| workload | sync and cleanup session                                | 5,000 | 252    | 0.02         | 51,970.55      | 0.01      | 119,660.17    | n/a            | n/a              | 3.16            | 316.49            | yjs       |
| workload | long lived tombstoned session                           | 5,000 | 250    | 0            | 263,657.46     | 0.01      | 85,402.93     | 0.01           | 167,594.02       | 1.75            | 571.37            | crlist    |
| workload | sparse visible session                                  | 5,000 | 250    | 0            | 244,379.28     | 0.13      | 7,670.01      | 0.01           | 74,111.4         | 0.94            | 1,060.4           | crlist    |
| workload | post-gc edit session                                    | 5,000 | 250    | 0            | 301,059.73     | 0.02      | 52,028.05     | 0.01           | 178,814.1        | 1.76            | 567.9             | crlist    |

## License

Apache-2.0
