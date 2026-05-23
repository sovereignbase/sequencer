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
| crud     | create / empty list                                     | 5,000 | 250    | 0            | 496,524.33     | 0.14      | 6,975.78      | 0.02           | 51,131.02        | 0.34            | 2,916             | crlist    |
| crud     | create / hydrate snapshot                               | 5,000 | 250    | 3.98         | 251.41         | 6.9       | 145.03        | 20.07          | 49.83            | 156.9           | 6.37              | crlist    |
| crud     | create / hydrate clean snapshot                         | 5,000 | 250    | 3.74         | 267.06         | 6.89      | 145.1         | 19.52          | 51.24            | 161.35          | 6.2               | crlist    |
| crud     | create / hydrate tombstoned snapshot                    | 5,000 | 250    | 2.59         | 386.73         | 3.51      | 285.06        | 9.53           | 104.92           | 191             | 5.24              | crlist    |
| crud     | read / head                                             | 5,000 | 250    | 0            | 1,867,064.97   | 0         | 1,009,285.43  | 0              | 259,255.42       | 0               | 3,556,187.77      | automerge |
| crud     | read / middle                                           | 5,000 | 250    | 0            | 6,596,306.07   | 0         | 2,172,024.33  | 0              | 736,377.03       | 0               | 9,157,509.16      | automerge |
| crud     | read / tail                                             | 5,000 | 250    | 0            | 7,022,471.91   | 0         | 2,189,141.86  | 0              | 720,876.59       | 0               | 4,970,178.93      | crlist    |
| crud     | read / random indexed reads                             | 5,000 | 250    | 0            | 472,054.38     | 0         | 815,394.65    | 0.01           | 186,025.75       | 0               | 1,339,046.6       | automerge |
| crud     | read / sequential indexed reads from head               | 5,000 | 250    | 0            | 387,296.67     | 0         | 1,245,019.92  | 0              | 261,478.92       | 0               | 1,339,046.6       | automerge |
| crud     | read / sequential indexed reads from middle             | 5,000 | 250    | 0            | 2,406,159.77   | 0         | 2,258,355.92  | 0              | 292,568.75       | 0               | 7,575,757.58      | automerge |
| crud     | read / sequential indexed reads from tail               | 5,000 | 250    | 0            | 2,579,979.36   | 0         | 2,735,229.76  | 0              | 307,049.86       | 0               | 6,544,502.62      | automerge |
| crud     | read / full iteration visible values                    | 5,000 | 250    | 0.93         | 1,079.11       | 0.21      | 4,813.41      | 1.97           | 507.49           | 0.09            | 11,612.51         | automerge |
| crud     | read / collect visible values to array                  | 5,000 | 250    | 0.86         | 1,167.37       | 0.2       | 4,996.4       | 1.82           | 549.92           | 0.09            | 11,081.95         | automerge |
| crud     | read / visible sparse over deleted entries              | 5,000 | 250    | 0            | 2,976,190.48   | 0.04      | 25,363.97     | 0.03           | 33,166.18        | 0               | 10,040,160.64     | automerge |
| crud     | find / head                                             | 5,000 | 250    | 0            | 938,438.44     | 0         | 1,413,227.81  | 0              | 684,556.41       | 0               | 1,599,488.16      | automerge |
| crud     | find / middle                                           | 5,000 | 250    | 0.25         | 4,026.92       | 0.11      | 9,102.36      | 0.85           | 1,178.33         | 0.02            | 59,526.64         | automerge |
| crud     | find / tail                                             | 5,000 | 250    | 0.48         | 2,085.33       | 0.18      | 5,474.9       | 1.74           | 575.06           | 0.02            | 46,879.69         | automerge |
| crud     | find / missing value                                    | 5,000 | 250    | 0.54         | 1,841.99       | 0.2       | 5,035.44      | 1.71           | 585.56           | 0.03            | 32,610.68         | automerge |
| crud     | append / single after tail                              | 5,000 | 250    | 0.01         | 113,947.13     | 0.03      | 35,893.24     | 0.03           | 31,380.62        | 1.86            | 538.49            | crlist    |
| crud     | append / batch after tail                               | 5,000 | 25,000 | 0.01         | 157,493.21     | 0         | 520,093.28    | 0.01           | 124,210.76       | 0.19            | 5,321.45          | yjs       |
| crud     | append / batch after deleted tail                       | 5,000 | 25,000 | 0.01         | 142,516.57     | 0         | 559,139.02    | 0.01           | 147,819.49       | 0.19            | 5,298.58          | yjs       |
| crud     | append / batch after garbage collection                 | 5,000 | 25,000 | 0.01         | 149,580.67     | 0         | 607,703.25    | 0.01           | 139,612.31       | 0.18            | 5,464.47          | yjs       |
| crud     | prepend / single before head                            | 5,000 | 250    | 0.03         | 31,012.75      | 0.02      | 45,914.53     | 0.04           | 23,774.65        | 1.84            | 543.01            | yjs       |
| crud     | prepend / batch before head                             | 5,000 | 25,000 | 0.01         | 164,663.37     | 0         | 736,140.68    | 0.01           | 172,557.79       | 0.19            | 5,343.92          | yjs       |
| crud     | prepend / batch before deleted head                     | 5,000 | 25,000 | 0.01         | 178,577.17     | 0         | 763,016.29    | 0.01           | 150,533.22       | 0.19            | 5,335.85          | yjs       |
| crud     | prepend / batch after garbage collection                | 5,000 | 25,000 | 0.01         | 191,469.06     | 0         | 745,545.37    | 0.01           | 198,982.32       | 0.18            | 5,580.44          | yjs       |
| crud     | insert / single before head                             | 5,000 | 250    | 0.01         | 141,988.98     | 0.02      | 59,306.35     | 0.01           | 124,427.63       | 2.1             | 476.6             | crlist    |
| crud     | insert / single after head                              | 5,000 | 250    | 0.01         | 97,816.73      | 0.02      | 58,800.01     | 0.01           | 77,193.85        | 1.92            | 521.68            | crlist    |
| crud     | insert / single before middle                           | 5,000 | 250    | 0.01         | 80,097.4       | 0.02      | 57,355.24     | 0.01           | 122,789.78       | 1.79            | 559.52            | json-joy  |
| crud     | insert / single after middle                            | 5,000 | 250    | 0.01         | 112,627.83     | 0.02      | 54,999.45     | 0.01           | 118,449.73       | 1.9             | 525.52            | json-joy  |
| crud     | insert / single before tail                             | 5,000 | 250    | 0.01         | 88,320.5       | 0.02      | 54,217        | 0.01           | 132,037.6        | 1.83            | 545.47            | json-joy  |
| crud     | insert / single after tail                              | 5,000 | 250    | 0.01         | 164,875.02     | 0.03      | 32,298.07     | 0.01           | 169,664.07       | 1.89            | 530.1             | json-joy  |
| crud     | insert / batch before head                              | 5,000 | 25,000 | 0            | 211,373.77     | 0         | 908,872.78    | 0.01           | 184,796.84       | 0.19            | 5,303.05          | yjs       |
| crud     | insert / batch after head                               | 5,000 | 25,000 | 0.01         | 185,327.54     | 0         | 849,762.07    | 0.01           | 170,023.96       | 0.19            | 5,322.39          | yjs       |
| crud     | insert / batch before middle                            | 5,000 | 25,000 | 0.01         | 185,421.98     | 0         | 822,771.69    | 0.01           | 165,254.95       | 0.19            | 5,185.12          | yjs       |
| crud     | insert / batch after middle                             | 5,000 | 25,000 | 0.01         | 180,481.44     | 0         | 863,757.76    | 0.01           | 122,690.9        | 0.19            | 5,276.46          | yjs       |
| crud     | insert / batch before tail                              | 5,000 | 25,000 | 0.01         | 157,303.64     | 0         | 671,685.5     | 0.01           | 162,328.91       | 0.19            | 5,268.71          | yjs       |
| crud     | insert / batch after tail                               | 5,000 | 25,000 | 0.01         | 179,107.6      | 0         | 533,311.72    | 0.01           | 132,921.6        | 0.19            | 5,334.86          | yjs       |
| crud     | insert / repeated before head                           | 5,000 | 250    | 0.01         | 170,485.54     | 0.01      | 101,399.31    | 0.01           | 123,359.32       | 1.92            | 520.42            | crlist    |
| crud     | insert / repeated before middle                         | 5,000 | 250    | 0.01         | 150,339.77     | 0.01      | 78,112.79     | 0.01           | 152,830.42       | 1.88            | 530.98            | json-joy  |
| crud     | insert / repeated before tail                           | 5,000 | 250    | 0.01         | 151,020.9      | 0.01      | 76,108.13     | 0.01           | 164,138.93       | 1.84            | 542.27            | json-joy  |
| crud     | insert / random positions                               | 5,000 | 250    | 0.01         | 110,277.9      | 0.03      | 34,335        | 0.05           | 18,801.37        | 1.89            | 530.09            | crlist    |
| crud     | insert / alternating head and tail                      | 5,000 | 250    | 0.06         | 16,885.84      | 0.01      | 99,466.86     | 0.01           | 123,098.13       | 1.89            | 529.74            | json-joy  |
| crud     | overwrite / head                                        | 5,000 | 250    | 0.01         | 109,591.44     | 0.03      | 35,041        | 0.02           | 56,815.6         | 2.11            | 473.58            | crlist    |
| crud     | overwrite / middle                                      | 5,000 | 250    | 0.01         | 135,633.68     | 0.02      | 57,121.97     | 0.01           | 92,785.04        | 2.02            | 494.3             | crlist    |
| crud     | overwrite / tail                                        | 5,000 | 250    | 0.01         | 86,224.74      | 0.02      | 54,310.05     | 0.01           | 105,334.12       | 1.92            | 519.82            | json-joy  |
| crud     | overwrite / random                                      | 5,000 | 250    | 0.01         | 117,969.04     | 0.03      | 31,104.97     | 0.01           | 84,482.29        | 2.19            | 456.69            | crlist    |
| crud     | overwrite / same head repeatedly                        | 5,000 | 250    | 0.01         | 162,179.7      | 0.02      | 60,564.95     | 0.01           | 116,020.05       | 2.01            | 497.42            | crlist    |
| crud     | overwrite / same middle repeatedly                      | 5,000 | 250    | 0.01         | 150,024        | 0.02      | 46,342.64     | 0.01           | 113,807.07       | 2.07            | 482.26            | crlist    |
| crud     | overwrite / same tail repeatedly                        | 5,000 | 250    | 0.01         | 129,145.57     | 0.02      | 56,182.3      | 0.01           | 90,038.18        | 1.92            | 519.67            | crlist    |
| crud     | overwrite / random visible entries                      | 5,000 | 250    | 0.01         | 119,651.57     | 0.03      | 29,745.26     | 0.05           | 20,075.97        | 2.2             | 455.12            | crlist    |
| crud     | overwrite / after insert                                | 5,000 | 250    | 0.01         | 149,593.11     | 0.02      | 49,409.07     | 0.04           | 24,577.27        | 1.99            | 503.47            | crlist    |
| crud     | overwrite / after delete                                | 5,000 | 250    | 0.01         | 112,984.14     | 0.02      | 46,466.67     | 0.04           | 24,712.59        | 1.99            | 501.87            | crlist    |
| crud     | delete / head                                           | 5,000 | 250    | 0.01         | 105,454.09     | 0.02      | 56,313.92     | 0.04           | 22,453.54        | 0.25            | 3,961.45          | crlist    |
| crud     | delete / middle                                         | 5,000 | 250    | 0.01         | 134,415.83     | 0.01      | 68,634.18     | 0.04           | 28,358.82        | 0.28            | 3,608.26          | crlist    |
| crud     | delete / tail                                           | 5,000 | 250    | 0            | 676,589.99     | 0.02      | 61,449.22     | 0              | 232,083.18       | 0.27            | 3,648.26          | crlist    |
| crud     | delete / range from head                                | 5,000 | 5,000  | 0            | 1,370,801.92   | 0         | 8,396,305.63  | 0              | 309,960.26       | 0.01            | 68,192.08         | yjs       |
| crud     | delete / range from middle                              | 5,000 | 5,000  | 0            | 942,631.45     | 0         | 6,856,829.4   | 0              | 270,404.74       | 0.02            | 58,977.22         | yjs       |
| crud     | delete / range from tail                                | 5,000 | 5,000  | 0            | 762,171.89     | 0         | 9,375,585.97  | 0              | 278,131.62       | 0.02            | 59,238.97         | yjs       |
| crud     | delete / every other entry                              | 5,000 | 2,500  | 0.01         | 103,955.29     | 0.1       | 10,258.19     | 0.1            | 9,963.56         | 0.26            | 3,808.52          | crlist    |
| crud     | delete / all entries from head one by one               | 5,000 | 5,000  | 0.01         | 143,661.65     | 0.01      | 90,747.89     | 0.01           | 108,820.09       | 0.23            | 4,316.91          | crlist    |
| crud     | delete / all entries from middle outward                | 5,000 | 5,000  | 0.01         | 108,064.18     | 0.01      | 96,511.12     | 0.01           | 161,622.43       | 0.21            | 4,654.6           | json-joy  |
| crud     | delete / all entries from tail one by one               | 5,000 | 5,000  | 0            | 861,000.14     | 0.01      | 86,620.28     | 0              | 236,513.97       | 0.22            | 4,562.24          | crlist    |
| crud     | delete / all entries in random order                    | 5,000 | 5,000  | 0.16         | 6,086.23       | 12.24     | 81.72         | 8.5            | 117.71           | 0.28            | 3,551.17          | crlist    |
| crud     | delete / already deleted head                           | 5,000 | 250    | 0            | 311,642.98     | 0         | 272,747.11    | 0              | 586,441.47       | 0.03            | 36,779.85         | json-joy  |
| crud     | delete / already deleted middle                         | 5,000 | 250    | 0            | 405,252.07     | 0         | 207,692.95    | 0              | 613,346.42       | 0.02            | 45,396.77         | json-joy  |
| crud     | delete / already deleted tail                           | 5,000 | 250    | 0            | 1,169,317.12   | 0         | 256,910.9     | 0              | 1,473,187.98     | 0.03            | 35,600.36         | json-joy  |
| crud     | mixed / append overwrite delete tail                    | 5,000 | 250    | 0.01         | 126,211.63     | 0.04      | 26,181.03     | 0.01           | 100,393.54       | 1.77            | 565.82            | crlist    |
| crud     | mixed / prepend overwrite delete head                   | 5,000 | 250    | 0.01         | 143,760.78     | 0.02      | 61,059.01     | 0.01           | 107,158.17       | 1.69            | 591.77            | crlist    |
| crud     | mixed / insert overwrite delete middle                  | 5,000 | 250    | 0.01         | 136,276.91     | 0.02      | 47,377.2      | 0.01           | 125,900.19       | 1.69            | 593.09            | crlist    |
| crud     | mixed / append prepend insert overwrite delete          | 5,000 | 250    | 0.01         | 141,418.71     | 0.02      | 46,083.8      | 0.01           | 122,561.04       | 1.71            | 585.67            | crlist    |
| mags     | snapshot                                                | 5,000 | 250    | 0.27         | 3,707.58       | 3.72      | 268.58        | 7.81           | 128.01           | 15.1            | 66.22             | crlist    |
| mags     | snapshot / clean state                                  | 5,000 | 250    | 0.23         | 4,350.51       | 3.88      | 258.02        | 9.33           | 107.14           | 23.04           | 43.4              | crlist    |
| mags     | snapshot / tombstoned state 50% deleted                 | 5,000 | 250    | 0.16         | 6,101.95       | 2.15      | 464.24        | 3.36           | 297.49           | 19.19           | 52.12             | crlist    |
| mags     | snapshot / tombstoned state 90% deleted                 | 5,000 | 250    | 0.03         | 29,111.4       | 0.43      | 2,303.36      | 0.58           | 1,734.91         | 20              | 49.99             | crlist    |
| mags     | snapshot / after garbage collection                     | 5,000 | 250    | 0.11         | 8,860.38       | 2.04      | 490.43        | 3.55           | 281.37           | 18.82           | 53.13             | crlist    |
| mags     | acknowledge                                             | 5,000 | 250    | 0            | 796,178.34     | n/a       | n/a           | n/a            | n/a              | n/a             | n/a               | n/a       |
| mags     | acknowledge / clean state                               | 5,000 | 250    | 0            | 10,162,601.63  | n/a       | n/a           | n/a            | n/a              | n/a             | n/a               | n/a       |
| mags     | acknowledge / 50% deleted state                         | 5,000 | 250    | 0.05         | 22,207.22      | n/a       | n/a           | n/a            | n/a              | n/a             | n/a               | n/a       |
| mags     | acknowledge / 90% deleted state                         | 5,000 | 250    | 0.08         | 13,034.82      | n/a       | n/a           | n/a            | n/a              | n/a             | n/a               | n/a       |
| mags     | garbage collect                                         | 5,000 | 250    | 0            | 1,818,181.82   | n/a       | n/a           | n/a            | n/a              | n/a             | n/a               | n/a       |
| mags     | garbage collect / no eligible tombstones                | 5,000 | 250    | 0            | 4,854,368.93   | n/a       | n/a           | n/a            | n/a              | n/a             | n/a               | n/a       |
| mags     | garbage collect / 50% eligible tombstones               | 5,000 | 250    | 0            | 703,234.88     | n/a       | n/a           | n/a            | n/a              | n/a             | n/a               | n/a       |
| mags     | garbage collect / 90% eligible tombstones               | 5,000 | 250    | 0            | 529,661.02     | n/a       | n/a           | n/a            | n/a              | n/a             | n/a               | n/a       |
| mags     | garbage collect / partial frontiers 2 replicas          | 5,000 | 250    | 0            | 4,038,772.21   | n/a       | n/a           | n/a            | n/a              | n/a             | n/a               | n/a       |
| mags     | garbage collect / partial frontiers 10 replicas         | 5,000 | 250    | 0            | 4,911,591.36   | n/a       | n/a           | n/a            | n/a              | n/a             | n/a               | n/a       |
| mags     | post-gc read / full iteration visible values            | 5,000 | 250    | 0.33         | 3,028.91       | 0.11      | 9,405.11      | 0.68           | 1,460.57         | 0.03            | 29,369.27         | automerge |
| mags     | merge ordered deltas                                    | 5,000 | 250    | 0.04         | 28,048.92      | 0.03      | 35,077.87     | 0.01           | 186,901.91       | 4.06            | 246.44            | json-joy  |
| mags     | merge shuffled gossip                                   | 5,000 | 250    | 0.69         | 1,452.63       | 0.79      | 1,272.99      | n/a            | n/a              | 0.94            | 1,064.97          | crlist    |
| mags     | merge / append head delta into equal replica            | 5,000 | 1      | 0.13         | 7,968.13       | 0.07      | 14,684.29     | 0.05           | 20,964.36        | 4.24            | 235.95            | json-joy  |
| mags     | merge / append tail delta into equal replica            | 5,000 | 1      | 0.05         | 19,646.37      | 0.03      | 31,055.9      | 0.01           | 94,339.62        | 3.97            | 252.08            | json-joy  |
| mags     | merge / prepend head delta into equal replica           | 5,000 | 1      | 0.2          | 5,063.29       | 0.04      | 23,866.35     | 0.01           | 117,647.06       | 4.04            | 247.71            | json-joy  |
| mags     | merge / insert middle delta into equal replica          | 5,000 | 1      | 0.12         | 8,064.52       | 0.04      | 22,935.78     | 0.02           | 61,349.69        | 4.15            | 241.1             | json-joy  |
| mags     | merge / overwrite head delta into equal replica         | 5,000 | 1      | 0.23         | 4,260.76       | 0.04      | 24,630.54     | 0.01           | 92,592.59        | 4.56            | 219.25            | json-joy  |
| mags     | merge / overwrite middle delta into equal replica       | 5,000 | 1      | 0.08         | 11,820.33      | 0.05      | 18,281.54     | 0.02           | 53,475.94        | 7.11            | 140.66            | json-joy  |
| mags     | merge / overwrite tail delta into equal replica         | 5,000 | 1      | 0.03         | 29,154.52      | 0.04      | 24,390.24     | 0.01           | 80,000           | 4.53            | 220.62            | json-joy  |
| mags     | merge / delete head delta into equal replica            | 5,000 | 1      | 0.24         | 4,191.11       | 0.03      | 38,759.69     | 0.02           | 52,631.58        | 2.54            | 393.14            | json-joy  |
| mags     | merge / delete middle delta into equal replica          | 5,000 | 1      | 0.09         | 11,587.49      | 0.09      | 10,683.76     | 0.08           | 12,771.39        | 2.53            | 394.84            | json-joy  |
| mags     | merge / delete tail delta into equal replica            | 5,000 | 1      | 0.03         | 38,910.51      | 0.02      | 51,546.39     | 0.01           | 84,033.61        | 2.26            | 441.91            | json-joy  |
| mags     | merge / duplicate delta ignored                         | 5,000 | 250    | 0            | 358,989.09     | 0.03      | 35,309.24     | 0.01           | 129,809.44       | 0.04            | 23,879.34         | crlist    |
| mags     | merge / old delta ignored after merge                   | 5,000 | 250    | 0            | 664,540.14     | 0.03      | 39,370.7      | 0              | 284,997.72       | 0.04            | 27,306.29         | crlist    |
| mags     | merge / ordered 1,000 append deltas                     | 5,000 | 1,000  | 0            | 319,060.69     | 0.02      | 51,770.02     | 0.01           | 83,059.93        | 4.5             | 222.36            | crlist    |
| mags     | merge / ordered 1,000 prepend deltas                    | 5,000 | 1,000  | 0.06         | 16,604.95      | 0.01      | 102,556.74    | 0.02           | 52,742.89        | 4.71            | 212.53            | yjs       |
| mags     | merge / ordered 1,000 middle insert deltas              | 5,000 | 1,000  | 0.02         | 51,931.06      | 0.01      | 94,784.93     | 0              | 252,652.85       | 4.78            | 209.42            | json-joy  |
| mags     | merge / shuffled 1,000 mixed deltas                     | 5,000 | 1,000  | 0.81         | 1,239.46       | 1.43      | 699.55        | n/a            | n/a              | 1.16            | 862.71            | crlist    |
| mags     | merge / reverse ordered 1,000 mixed deltas              | 5,000 | 1,000  | 0.23         | 4,309.05       | 1.4       | 713.62        | n/a            | n/a              | 1.17            | 857.73            | crlist    |
| mags     | merge / concurrent prepends same head                   | 5,000 | 2      | 1.03         | 971.02         | 0.11      | 9,425.07      | n/a            | n/a              | 18.85           | 53.06             | yjs       |
| mags     | merge / concurrent appends same tail                    | 5,000 | 2      | 0.04         | 22,650.06      | 0.04      | 26,246.72     | n/a            | n/a              | 18.05           | 55.41             | yjs       |
| mags     | merge / concurrent inserts same middle position         | 5,000 | 2      | 1.18         | 847.64         | 0.06      | 16,806.72     | n/a            | n/a              | 20.67           | 48.37             | yjs       |
| mags     | merge / concurrent overwrites same head                 | 5,000 | 2      | 1.02         | 984.98         | 0.05      | 19,193.86     | n/a            | n/a              | 22.12           | 45.21             | yjs       |
| mags     | merge / concurrent overwrites same middle               | 5,000 | 2      | 4.13         | 242.2          | 0.06      | 18,034.27     | n/a            | n/a              | 14.72           | 67.96             | yjs       |
| mags     | merge / concurrent overwrites same tail                 | 5,000 | 2      | 0.03         | 31,055.9       | 0.05      | 21,645.02     | n/a            | n/a              | 14.04           | 71.21             | crlist    |
| mags     | merge / concurrent deletes same head                    | 5,000 | 2      | 1.07         | 938.17         | 0.02      | 46,620.05     | 3.17           | 315.12           | 9.3             | 107.56            | yjs       |
| mags     | merge / concurrent deletes same middle                  | 5,000 | 2      | 0.95         | 1,051.36       | 0.03      | 33,003.3      | 0.02           | 40,567.95        | 9.69            | 103.22            | json-joy  |
| mags     | merge / concurrent deletes same tail                    | 5,000 | 2      | 0.01         | 67,114.09      | 0.03      | 32,520.33     | 0.01           | 73,529.41        | 8.2             | 121.95            | json-joy  |
| mags     | merge / concurrent overwrite delete same entry          | 5,000 | 2      | 1.31         | 761.9          | 0.08      | 12,150.67     | 0.08           | 12,928.25        | 11.2            | 89.25             | json-joy  |
| mags     | merge / forked replicas rejoin after 250 ops each       | 5,000 | 500    | 0.01         | 73,973.25      | 0.01      | 84,954.55     | n/a            | n/a              | 4.54            | 220.28            | yjs       |
| mags     | merge / 10 replicas gossip convergence                  | 5,000 | 100    | 0.01         | 135,648.4      | 0.01      | 67,920.94     | n/a            | n/a              | 8               | 125               | crlist    |
| mags     | merge / snapshot merge into stale replica               | 5,000 | 5,350  | 0            | 987,248.81     | 0         | 422,734.42    | 0              | 254,173.67       | 0.03            | 29,540.03         | crlist    |
| class    | constructor / hydrate snapshot                          | 5,000 | 250    | 4.1          | 243.82         | 7.75      | 129           | 20.06          | 49.86            | 179.55          | 5.57              | crlist    |
| class    | read / head                                             | 5,000 | 250    | 0            | 1,079,447.32   | 0         | 4,545,454.55  | 0              | 1,263,902.93     | 0               | 2,093,802.35      | yjs       |
| class    | read / middle                                           | 5,000 | 250    | 0            | 1,378,929.95   | 0         | 13,440,860.22 | 0              | 2,390,057.36     | 0               | 11,627,906.98     | yjs       |
| class    | read / tail                                             | 5,000 | 250    | 0            | 2,688,172.04   | 0         | 14,285,714.29 | 0              | 3,765,060.24     | 0               | 12,562,814.07     | yjs       |
| class    | find near head                                          | 5,000 | 250    | 0            | 567,665.76     | 0         | 2,793,296.09  | 0              | 839,771.58       | 0               | 1,563,477.17      | yjs       |
| class    | find near middle                                        | 5,000 | 250    | 1.21         | 823.65         | 0.1       | 9,971.28      | 0.87           | 1,148.92         | 0.01            | 77,401.78         | automerge |
| class    | find near tail                                          | 5,000 | 250    | 2.63         | 380.5          | 0.18      | 5,599.14      | 1.56           | 641.58           | 0.02            | 49,533.4          | automerge |
| class    | iterate visible values                                  | 5,000 | 250    | 0.11         | 9,264.96       | 0.25      | 4,060.21      | 1.76           | 569.29           | 0.08            | 13,107.67         | automerge |
| class    | collect visible values to array                         | 5,000 | 250    | 0.1          | 9,700.56       | 0.26      | 3,830.28      | 1.84           | 544.14           | 0.07            | 13,945.21         | automerge |
| class    | append / single after tail                              | 5,000 | 250    | 0.01         | 110,030.37     | 0.03      | 39,987.84     | 0.04           | 26,265.75        | 1.87            | 534.6             | crlist    |
| class    | append / batch after tail                               | 5,000 | 25,000 | 0.01         | 194,261.21     | 0         | 381,807.05    | 0.01           | 160,508.59       | 0.19            | 5,330.99          | yjs       |
| class    | prepend / single before head                            | 5,000 | 250    | 0.01         | 112,516.31     | 0.02      | 54,386.84     | 0.01           | 139,922.76       | 1.94            | 514.91            | json-joy  |
| class    | prepend / batch before head                             | 5,000 | 25,000 | 0            | 208,800        | 0         | 740,488.43    | 0.01           | 186,132.67       | 0.19            | 5,198.98          | yjs       |
| class    | insert / single before middle                           | 5,000 | 250    | 0.01         | 102,358.34     | 0.02      | 65,209.45     | 0.01           | 153,421.29       | 2.05            | 487.34            | json-joy  |
| class    | insert / batch before middle                            | 5,000 | 25,000 | 0.01         | 177,420.85     | 0         | 773,938.7     | 0.01           | 167,778.37       | 0.19            | 5,182.91          | yjs       |
| class    | overwrite / head                                        | 5,000 | 250    | 0.01         | 107,332.99     | 0.02      | 46,928.09     | 0.01           | 136,032.21       | 2.15            | 464.76            | json-joy  |
| class    | overwrite / middle                                      | 5,000 | 250    | 0.01         | 124,868.89     | 0.03      | 37,952.97     | 0.01           | 153,430.71       | 2.32            | 430.94            | json-joy  |
| class    | overwrite / tail                                        | 5,000 | 250    | 0.01         | 127,629.16     | 0.02      | 56,688.06     | 0.04           | 26,526.89        | 2.05            | 487.55            | crlist    |
| class    | overwrite / random                                      | 5,000 | 250    | 0.01         | 109,788.77     | 0.04      | 24,209.32     | 0.04           | 25,513.33        | 2.3             | 434.53            | crlist    |
| class    | remove / head                                           | 5,000 | 250    | 0.01         | 89,731.17      | 0.01      | 69,838.25     | 0.05           | 19,110.23        | 0.27            | 3,748.78          | crlist    |
| class    | remove / middle                                         | 5,000 | 250    | 0.01         | 112,994.35     | 0.01      | 81,314.03     | 0.03           | 29,659.86        | 0.25            | 4,052.59          | crlist    |
| class    | remove / tail                                           | 5,000 | 250    | 0            | 269,803.58     | 0.02      | 51,044.37     | 0              | 273,224.04       | 0.24            | 4,179             | json-joy  |
| class    | remove / range from head                                | 5,000 | 5,000  | 0            | 2,073,656.27   | 0         | 7,955,449.48  | 0              | 350,960.93       | 0.02            | 65,207.33         | yjs       |
| class    | remove / range from middle                              | 5,000 | 5,000  | 0            | 1,539,882.97   | 0         | 7,175,660.16  | 0              | 260,557.8        | 0.02            | 59,119.96         | yjs       |
| class    | remove / range from tail                                | 5,000 | 5,000  | 0            | 1,457,683.45   | 0         | 8,134,049.13  | 0              | 499,400.72       | 0.02            | 56,245.82         | yjs       |
| class    | mixed / append overwrite remove tail                    | 5,000 | 250    | 0.01         | 138,343.2      | 0.02      | 54,765.71     | 0.01           | 153,950.37       | 1.34            | 747.13            | json-joy  |
| class    | mixed / prepend overwrite remove head                   | 5,000 | 250    | 0.01         | 100,236.56     | 0.02      | 64,449.6      | 0.01           | 155,125.34       | 1.57            | 638.68            | json-joy  |
| class    | mixed / insert overwrite remove middle                  | 5,000 | 250    | 0.01         | 113,574.41     | 0.01      | 68,470.64     | 0.01           | 162,887.67       | 1.59            | 629.89            | json-joy  |
| class    | paste / insert 10,000 entries at cursor                 | 5,000 | 10,000 | 0.01         | 129,869.79     | 0         | 947,400.33    | 0.01           | 109,962.85       | 0.18            | 5,483.03          | yjs       |
| class    | render / join visible entries to string                 | 5,000 | 250    | 0.21         | 4,678.57       | 0.37      | 2,735.99      | 2.03           | 491.41           | 0.26            | 3,796.29          | crlist    |
| class    | snapshot                                                | 5,000 | 250    | 0.26         | 3,855.7        | 4.06      | 246.46        | 7.66           | 130.63           | 15.39           | 64.98             | crlist    |
| class    | snapshot / tombstoned state 50% deleted                 | 5,000 | 250    | 0.12         | 8,120.21       | 2.01      | 497.64        | 3.98           | 251.17           | 15.62           | 64.03             | crlist    |
| class    | snapshot / after garbage collection                     | 5,000 | 250    | 0.11         | 9,276.68       | 0.25      | 4,029.26      | 2.08           | 481.72           | 0.07            | 13,795.31         | automerge |
| class    | acknowledge                                             | 5,000 | 250    | 0.06         | 16,879.12      | n/a       | n/a           | n/a            | n/a              | n/a             | n/a               | n/a       |
| class    | acknowledge / 50% deleted state                         | 5,000 | 250    | 0.04         | 24,637.1       | n/a       | n/a           | n/a            | n/a              | n/a             | n/a               | n/a       |
| class    | acknowledge / 90% deleted state                         | 5,000 | 250    | 0.06         | 15,596.34      | n/a       | n/a           | n/a            | n/a              | n/a             | n/a               | n/a       |
| class    | garbage collect                                         | 5,000 | 250    | 0.09         | 10,724.87      | 0.24      | 4,169.96      | 1.61           | 619.95           | 0.07            | 13,698.78         | automerge |
| class    | garbage collect / no eligible tombstones                | 5,000 | 250    | 0.1          | 10,120.88      | 0.24      | 4,082.68      | 2              | 498.89           | 0.08            | 12,689.26         | automerge |
| class    | garbage collect / 90% eligible tombstones               | 5,000 | 250    | 0.09         | 11,016.66      | 0.24      | 4,108.62      | 1.95           | 511.75           | 0.07            | 14,404.07         | automerge |
| class    | merge ordered deltas                                    | 5,000 | 250    | 0.02         | 48,159.35      | 0.01      | 92,206.69     | 0              | 247,647.35       | 3.11            | 321.93            | json-joy  |
| class    | merge shuffled gossip                                   | 5,000 | 250    | 0.61         | 1,648.3        | 0.41      | 2,442.64      | n/a            | n/a              | 0.7             | 1,425.65          | yjs       |
| class    | merge / duplicate delta ignored                         | 5,000 | 250    | 0            | 681,198.91     | 0.03      | 33,863.41     | 0              | 327,997.9        | 0.04            | 25,039.56         | crlist    |
| class    | merge / concurrent prepends same head                   | 5,000 | 2      | 1.15         | 871.65         | 0.07      | 14,814.81     | n/a            | n/a              | 15.34           | 65.18             | yjs       |
| class    | merge / concurrent appends same tail                    | 5,000 | 2      | 0.03         | 35,906.64      | 0.03      | 36,101.08     | n/a            | n/a              | 11.16           | 89.62             | yjs       |
| class    | merge / concurrent inserts same middle position         | 5,000 | 2      | 0.87         | 1,146.59       | 0.04      | 24,096.39     | n/a            | n/a              | 9.69            | 103.16            | yjs       |
| class    | merge / forked replicas rejoin after 250 ops each       | 5,000 | 500    | 0.43         | 2,343.09       | 0.01      | 69,383.73     | n/a            | n/a              | 3.21            | 311.88            | yjs       |
| latency  | append tail write to remote visible                     | 5,000 | 250    | 0.4          | 2,478.8        | 0.25      | 3,974.66      | 11.27          | 88.76            | 5.9             | 169.36            | yjs       |
| latency  | prepend head write to remote visible                    | 5,000 | 250    | 0.06         | 15,400.63      | 0.03      | 32,035.67     | 0.02           | 57,536.08        | 5.98            | 167.26            | json-joy  |
| latency  | middle insert write to remote visible                   | 5,000 | 250    | 0.34         | 2,981.92       | 0.13      | 7,928.81      | 4.02           | 248.74           | 5.97            | 167.38            | yjs       |
| latency  | head insert write to remote visible                     | 5,000 | 250    | 0.07         | 14,629.21      | 0.03      | 39,928.45     | 0.02           | 62,493.75        | 5.92            | 168.95            | json-joy  |
| latency  | overwrite head write to remote visible                  | 5,000 | 250    | 0.09         | 11,072.82      | 0.04      | 28,205.56     | 0.04           | 27,764.2         | 5.87            | 170.36            | yjs       |
| latency  | overwrite middle write to remote visible                | 5,000 | 250    | 0.33         | 3,074.77       | 0.13      | 7,818.78      | 2.75           | 363.96           | 5.87            | 170.5             | yjs       |
| latency  | overwrite tail write to remote visible                  | 5,000 | 250    | 0.7          | 1,436.61       | 0.22      | 4,514.46      | 5.7            | 175.47           | 5.69            | 175.71            | yjs       |
| latency  | head delete to remote hidden                            | 5,000 | 250    | 0.63         | 1,582.17       | 0.25      | 3,977.13      | 5.48           | 182.33           | 2.2             | 455.38            | yjs       |
| latency  | middle delete to remote hidden                          | 5,000 | 250    | 0.83         | 1,206.39       | 0.26      | 3,856.65      | 5.55           | 180.09           | 2.55            | 391.65            | yjs       |
| latency  | tail delete to remote hidden                            | 5,000 | 250    | 0.37         | 2,696.37       | 0.21      | 4,795.22      | 5.44           | 183.87           | 2.22            | 451.35            | yjs       |
| latency  | append tail write to 10 remotes visible                 | 5,000 | 2,500  | 0.52         | 1,919.26       | 0.2       | 4,937.04      | 12.3           | 81.29            | 3.86            | 259.3             | yjs       |
| latency  | prepend head write to 10 remotes visible                | 5,000 | 2,500  | 0.09         | 11,369.35      | 0.01      | 91,710.14     | 0.01           | 77,517.7         | 3.93            | 254.33            | yjs       |
| latency  | middle insert write to 10 remotes visible               | 5,000 | 2,500  | 0.36         | 2,793.25       | 0.13      | 7,860.45      | 4.94           | 202.26           | 4.09            | 244.65            | yjs       |
| latency  | overwrite middle write to 10 remotes visible            | 5,000 | 2,500  | 0.34         | 2,907.26       | 0.11      | 9,194.04      | 3.21           | 311.82           | 3.83            | 260.81            | yjs       |
| latency  | delete middle to 10 remotes hidden                      | 5,000 | 2,500  | 0.67         | 1,482.06       | 0.23      | 4,389.67      | 6.44           | 155.36           | 1.9             | 525.23            | yjs       |
| latency  | out-of-order write delivery to remote visible           | 5,000 | 250    | 1.49         | 672.81         | 74.27     | 13.46         | n/a            | n/a              | 15.73           | 63.56             | crlist    |
| latency  | out-of-order delete delivery to remote convergence      | 5,000 | 165    | 2.13         | 468.47         | 0.21      | 4,684.62      | 8.43           | 118.67           | 6.28            | 159.31            | yjs       |
| latency  | out-of-order append delivery to convergence             | 5,000 | 250    | 1.49         | 671.19         | 23.18     | 43.13         | n/a            | n/a              | 16.4            | 60.97             | crlist    |
| latency  | out-of-order prepend delivery to convergence            | 5,000 | 250    | 1.33         | 752.71         | 25        | 40            | 0.11           | 9,180.58         | 16.99           | 58.85             | json-joy  |
| latency  | out-of-order middle insert delivery to convergence      | 5,000 | 250    | 1.39         | 720.69         | 77.37     | 12.93         | n/a            | n/a              | 15.62           | 64.01             | crlist    |
| latency  | out-of-order overwrite delivery to convergence          | 5,000 | 129    | 1.91         | 522.45         | n/a       | n/a           | 289.89         | 3.45             | 82.53           | 12.12             | crlist    |
| latency  | offline burst 1,000 ops then sync                       | 5,000 | 1,000  | 0.02         | 54,936.6       | 0.03      | 37,355.25     | 0              | 254,783.56       | 3.27            | 306.09            | json-joy  |
| latency  | forked replicas mixed ops then converge                 | 5,000 | 500    | 0.01         | 86,122.26      | 0.01      | 113,936.74    | n/a            | n/a              | 3.35            | 298.51            | yjs       |
| latency  | duplicate shuffled gossip to convergence                | 5,000 | 500    | 0.29         | 3,389.99       | 0.22      | 4,637.61      | n/a            | n/a              | 0.41            | 2,460.59          | yjs       |
| latency  | remote snapshot hydrate then apply pending deltas       | 5,000 | 250    | 0.02         | 54,851.02      | 0.05      | 21,716.66     | 0.1            | 10,407.78        | 0.73            | 1,373.68          | crlist    |
| workload | local app session                                       | 5,000 | 250    | 0.01         | 76,207.9       | 0.01      | 67,833.4      | 0.01           | 146,773.91       | 1.29            | 776.17            | json-joy  |
| workload | read heavy session                                      | 5,000 | 250    | 0            | 2,155,172.41   | 0         | 4,553,734.06  | 0              | 385,326.76       | 0               | 1,820,830.3       | yjs       |
| workload | write heavy session                                     | 5,000 | 250    | 0.01         | 79,377.68      | 0.01      | 72,010.83     | 0.03           | 29,128.36        | 1.35            | 742               | crlist    |
| workload | append tail heavy session                               | 5,000 | 250    | 0.01         | 185,721.71     | 0.02      | 52,334.1      | 0.03           | 30,468.85        | 1.53            | 655.33            | crlist    |
| workload | prepend head heavy session                              | 5,000 | 250    | 0.02         | 60,068.72      | 0.01      | 93,864.98     | 0.03           | 29,337.56        | 1.72            | 579.81            | yjs       |
| workload | insert middle heavy session                             | 5,000 | 250    | 0.02         | 64,150.27      | 0.01      | 77,294.09     | 0.03           | 29,823.33        | 1.61            | 621.18            | yjs       |
| workload | overwrite heavy session                                 | 5,000 | 250    | 0.01         | 70,859.67      | 0.01      | 72,518.42     | 0.01           | 131,302.52       | 1.23            | 812.51            | json-joy  |
| workload | delete heavy session                                    | 5,000 | 250    | 0.01         | 96,921.76      | 0.01      | 82,489.19     | 0              | 212,548.89       | 0.26            | 3,858.41          | json-joy  |
| workload | balanced append prepend insert overwrite delete session | 5,000 | 250    | 0.03         | 30,884.41      | 0.02      | 65,243.49     | 0.04           | 24,089.65        | 1.35            | 739.98            | yjs       |
| workload | random edit session                                     | 5,000 | 250    | 0.02         | 44,168.05      | 0.02      | 43,722.35     | 0.05           | 21,978.22        | 1.53            | 655.43            | crlist    |
| workload | text editing session                                    | 5,000 | 250    | 0.02         | 63,840.65      | 0.01      | 83,991.26     | 0.01           | 160,482.73       | 1.64            | 608.68            | json-joy  |
| workload | collaborative offline session                           | 5,000 | 500    | 0.01         | 90,601.05      | 0.01      | 114,739.43    | n/a            | n/a              | 3.22            | 310.31            | yjs       |
| workload | sync and cleanup session                                | 5,000 | 252    | 0.01         | 79,280.19      | 0.01      | 120,423.89    | n/a            | n/a              | 3.29            | 304.3             | yjs       |
| workload | long lived tombstoned session                           | 5,000 | 250    | 0.01         | 135,318        | 0.01      | 83,561.74     | 0.01           | 129,352.72       | 1.95            | 512.92            | crlist    |
| workload | sparse visible session                                  | 5,000 | 250    | 0.01         | 125,672.35     | 0.13      | 7,655.33      | 0.01           | 83,517.07        | 0.96            | 1,043.48          | crlist    |
| workload | post-gc edit session                                    | 5,000 | 250    | 0.01         | 180,180.18     | 0.02      | 52,132.21     | 0.01           | 166,035.73       | 1.78            | 562.42            | crlist    |

total wall time: 824,106.43 ms

## License

Apache-2.0
