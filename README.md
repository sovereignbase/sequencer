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
| crud     | create / empty list                                     | 5,000 | 250    | 0            | 619,118.38     | 0.16      | 6,432.72      | 0.02           | 41,937.16        | 0.31            | 3,247.37          | crlist    |
| crud     | create / hydrate snapshot                               | 5,000 | 250    | 3.78         | 264.67         | 7         | 142.93        | 20.98          | 47.66            | 153.48          | 6.52              | crlist    |
| crud     | create / hydrate clean snapshot                         | 5,000 | 250    | 3.49         | 286.87         | 6.79      | 147.38        | 20.6           | 48.54            | 157.19          | 6.36              | crlist    |
| crud     | create / hydrate tombstoned snapshot                    | 5,000 | 250    | 2.49         | 401.13         | 3.38      | 295.91        | 9.61           | 104.07           | 161.01          | 6.21              | crlist    |
| crud     | read / head                                             | 5,000 | 250    | 0            | 2,021,018.59   | 0         | 644,662.2     | 0              | 264,466.31       | 0               | 3,725,782.41      | automerge |
| crud     | read / middle                                           | 5,000 | 250    | 0            | 5,446,623.09   | 0         | 1,705,320.6   | 0              | 601,250.6        | 0               | 5,938,242.28      | automerge |
| crud     | read / tail                                             | 5,000 | 250    | 0            | 6,544,502.62   | 0         | 1,555,693.84  | 0              | 732,064.42       | 0               | 8,417,508.42      | automerge |
| crud     | read / random indexed reads                             | 5,000 | 250    | 0            | 445,553.38     | 0         | 541,359.9     | 0.01           | 189,753.32       | 0               | 1,167,678.65      | automerge |
| crud     | read / sequential indexed reads from head               | 5,000 | 250    | 0            | 738,552.44     | 0         | 528,541.23    | 0              | 280,049.29       | 0               | 1,434,308.66      | automerge |
| crud     | read / sequential indexed reads from middle             | 5,000 | 250    | 0            | 2,955,082.74   | 0         | 1,478,415.14  | 0.01           | 188,536.95       | 0               | 7,621,951.22      | automerge |
| crud     | read / sequential indexed reads from tail               | 5,000 | 250    | 0            | 2,790,178.57   | 0         | 2,049,180.33  | 0.01           | 191,233.84       | 0               | 5,995,203.84      | automerge |
| crud     | read / full iteration visible values                    | 5,000 | 250    | 0.88         | 1,136.42       | 0.25      | 4,041.79      | 2.24           | 447.07           | 0.07            | 14,208.34         | automerge |
| crud     | read / collect visible values to array                  | 5,000 | 250    | 0.68         | 1,480.69       | 0.23      | 4,353.3       | 3.43           | 291.78           | 0.09            | 11,074.69         | automerge |
| crud     | read / visible sparse over deleted entries              | 5,000 | 250    | 0            | 3,521,126.76   | 0.04      | 24,381.68     | 0.03           | 39,054.57        | 0               | 9,259,259.26      | automerge |
| crud     | find / head                                             | 5,000 | 250    | 0            | 830,288.94     | 0         | 2,014,504.43  | 0              | 606,060.61       | 0               | 1,204,238.92      | yjs       |
| crud     | find / middle                                           | 5,000 | 250    | 0.21         | 4,663.03       | 0.11      | 8,874.41      | 0.83           | 1,199.47         | 0.01            | 75,183.45         | automerge |
| crud     | find / tail                                             | 5,000 | 250    | 0.32         | 3,113.08       | 0.18      | 5,684.89      | 2.17           | 461.28           | 0.02            | 48,360.58         | automerge |
| crud     | find / missing value                                    | 5,000 | 250    | 0.35         | 2,882.68       | 0.2       | 4,942.48      | 1.91           | 522.29           | 0.03            | 31,130.15         | automerge |
| crud     | append / single after tail                              | 5,000 | 250    | 0.01         | 111,992.12     | 0.02      | 41,503.42     | 0.06           | 17,050.41        | 1.9             | 525.84            | crlist    |
| crud     | append / batch after tail                               | 5,000 | 25,000 | 0.01         | 177,075.14     | 0         | 512,629.13    | 0.01           | 104,546.61       | 0.18            | 5,589.19          | yjs       |
| crud     | append / batch after deleted tail                       | 5,000 | 25,000 | 0.01         | 199,757.89     | 0         | 626,571.13    | 0.01           | 126,524.69       | 0.18            | 5,553.59          | yjs       |
| crud     | append / batch after garbage collection                 | 5,000 | 25,000 | 0.01         | 193,114.47     | 0         | 626,313.69    | 0.01           | 135,792.74       | 0.18            | 5,503.28          | yjs       |
| crud     | prepend / single before head                            | 5,000 | 250    | 0.01         | 104,861.37     | 0.02      | 60,953.31     | 0.01           | 71,117.69        | 1.84            | 543.23            | crlist    |
| crud     | prepend / batch before head                             | 5,000 | 25,000 | 0.01         | 180,872.65     | 0         | 805,443.51    | 0.01           | 167,154.42       | 0.18            | 5,422.77          | yjs       |
| crud     | prepend / batch before deleted head                     | 5,000 | 25,000 | 0.01         | 175,455.46     | 0         | 879,250.74    | 0.01           | 168,244.46       | 0.18            | 5,464.09          | yjs       |
| crud     | prepend / batch after garbage collection                | 5,000 | 25,000 | 0.01         | 180,204.47     | 0         | 804,199.85    | 0.01           | 113,315.99       | 0.18            | 5,630.86          | yjs       |
| crud     | insert / single before head                             | 5,000 | 250    | 0.01         | 149,925.04     | 0.02      | 64,345.1      | 0.01           | 106,505.35       | 1.95            | 512.1             | crlist    |
| crud     | insert / single after head                              | 5,000 | 250    | 0.01         | 106,659.84     | 0.02      | 57,438.25     | 0.03           | 33,904.74        | 1.89            | 529.16            | crlist    |
| crud     | insert / single before middle                           | 5,000 | 250    | 0.01         | 91,743.12      | 0.02      | 54,828.17     | 0.06           | 17,899.59        | 1.77            | 566.53            | crlist    |
| crud     | insert / single after middle                            | 5,000 | 250    | 0.01         | 75,034.52      | 0.02      | 55,616.12     | 0.05           | 18,242.98        | 1.8             | 557.08            | crlist    |
| crud     | insert / single before tail                             | 5,000 | 250    | 0.01         | 103,868.05     | 0.03      | 29,628.58     | 0.05           | 20,307.37        | 1.98            | 504.45            | crlist    |
| crud     | insert / single after tail                              | 5,000 | 250    | 0.02         | 40,941.99      | 0.04      | 23,098.74     | 0.06           | 16,898.97        | 1.72            | 580.12            | crlist    |
| crud     | insert / batch before head                              | 5,000 | 25,000 | 0.01         | 190,815.95     | 0         | 833,930.98    | 0.01           | 125,083.81       | 0.19            | 5,390.03          | yjs       |
| crud     | insert / batch after head                               | 5,000 | 25,000 | 0.01         | 194,281.59     | 0         | 797,425.27    | 0.01           | 175,140.18       | 0.18            | 5,481.77          | yjs       |
| crud     | insert / batch before middle                            | 5,000 | 25,000 | 0.01         | 176,947.56     | 0         | 814,839.2     | 0.01           | 177,036.02       | 0.19            | 5,401.9           | yjs       |
| crud     | insert / batch after middle                             | 5,000 | 25,000 | 0.01         | 171,807.14     | 0         | 803,150.92    | 0.01           | 136,672.67       | 0.18            | 5,429.65          | yjs       |
| crud     | insert / batch before tail                              | 5,000 | 25,000 | 0.02         | 60,152.82      | 0         | 720,396.74    | 0.01           | 145,282.7        | 0.19            | 5,323.42          | yjs       |
| crud     | insert / batch after tail                               | 5,000 | 25,000 | 0            | 202,196.99     | 0         | 555,348.23    | 0.01           | 137,134.48       | 0.18            | 5,426.49          | yjs       |
| crud     | insert / repeated before head                           | 5,000 | 250    | 0.01         | 144,408.5      | 0.01      | 104,624.4     | 0.06           | 17,669.47        | 1.97            | 508.86            | crlist    |
| crud     | insert / repeated before middle                         | 5,000 | 250    | 0.01         | 133,354.67     | 0.02      | 64,160.14     | 0.04           | 24,305.12        | 1.91            | 522.21            | crlist    |
| crud     | insert / repeated before tail                           | 5,000 | 250    | 0.01         | 140,181.68     | 0.01      | 85,356.28     | 0.04           | 25,474.85        | 1.82            | 548.45            | crlist    |
| crud     | insert / random positions                               | 5,000 | 250    | 0.02         | 40,430.18      | 0.03      | 32,947.63     | 0.07           | 13,662.7         | 1.75            | 572.66            | crlist    |
| crud     | insert / alternating head and tail                      | 5,000 | 250    | 0.05         | 19,322.92      | 0.01      | 99,210.29     | 0.01           | 127,110.03       | 1.82            | 548.35            | json-joy  |
| crud     | overwrite / head                                        | 5,000 | 250    | 0.01         | 116,991.9      | 0.03      | 35,726.53     | 0.02           | 43,321.55        | 2.05            | 487.93            | crlist    |
| crud     | overwrite / middle                                      | 5,000 | 250    | 0.01         | 140,024.64     | 0.02      | 48,794.77     | 0.04           | 26,363.24        | 1.87            | 533.7             | crlist    |
| crud     | overwrite / tail                                        | 5,000 | 250    | 0.01         | 161,728.55     | 0.02      | 47,509.55     | 0.05           | 20,563.78        | 1.87            | 534.19            | crlist    |
| crud     | overwrite / random                                      | 5,000 | 250    | 0.01         | 116,392.76     | 0.03      | 29,532.67     | 0.05           | 19,893.69        | 2.44            | 409.49            | crlist    |
| crud     | overwrite / same head repeatedly                        | 5,000 | 250    | 0.01         | 144,919.14     | 0.02      | 51,678.52     | 0.04           | 26,170.89        | 1.99            | 502.3             | crlist    |
| crud     | overwrite / same middle repeatedly                      | 5,000 | 250    | 0.01         | 151,957.21     | 0.02      | 45,360.53     | 0.02           | 66,170.83        | 1.87            | 534.41            | crlist    |
| crud     | overwrite / same tail repeatedly                        | 5,000 | 250    | 0.01         | 184,488.23     | 0.02      | 47,352.07     | 0.01           | 68,225.85        | 1.83            | 547.72            | crlist    |
| crud     | overwrite / random visible entries                      | 5,000 | 250    | 0.01         | 158,538.91     | 0.03      | 29,289.44     | 0.01           | 110,619.47       | 2.13            | 469.95            | crlist    |
| crud     | overwrite / after insert                                | 5,000 | 250    | 0.01         | 145,738.6      | 0.02      | 48,307.31     | 0.01           | 83,929.23        | 1.94            | 516.04            | crlist    |
| crud     | overwrite / after delete                                | 5,000 | 250    | 0.01         | 162,548.76     | 0.02      | 47,864.3      | 0.01           | 66,787.78        | 1.92            | 521.84            | crlist    |
| crud     | delete / head                                           | 5,000 | 250    | 0            | 511,247.44     | 0.02      | 55,919.65     | 0.04           | 25,292.12        | 0.25            | 3,936.34          | crlist    |
| crud     | delete / middle                                         | 5,000 | 250    | 0            | 452,243.13     | 0.01      | 69,060.77     | 0.04           | 24,876.86        | 0.28            | 3,563.98          | crlist    |
| crud     | delete / tail                                           | 5,000 | 250    | 0            | 472,589.79     | 0.02      | 60,595.78     | 0              | 244,140.63       | 0.28            | 3,572.11          | crlist    |
| crud     | delete / range from head                                | 5,000 | 5,000  | 0            | 2,292,736.61   | 0         | 9,540,164.09  | 0              | 330,412.49       | 0.01            | 71,538.23         | yjs       |
| crud     | delete / range from middle                              | 5,000 | 5,000  | 0            | 1,863,307.74   | 0         | 7,416,196.97  | 0.01           | 181,807.6        | 0.02            | 63,173.11         | yjs       |
| crud     | delete / range from tail                                | 5,000 | 5,000  | 0            | 1,356,888.93   | 0         | 8,957,362.95  | 0              | 215,768.35       | 0.01            | 68,991.12         | yjs       |
| crud     | delete / every other entry                              | 5,000 | 2,500  | 0            | 416,375.2      | 0.09      | 10,614.82     | 0.1            | 10,101.21        | 0.22            | 4,492.57          | crlist    |
| crud     | delete / all entries from head one by one               | 5,000 | 5,000  | 0            | 1,373,475.44   | 0.01      | 92,293.15     | 0.01           | 92,873.1         | 0.2             | 5,073.65          | crlist    |
| crud     | delete / all entries from middle outward                | 5,000 | 5,000  | 0            | 245,208.62     | 0.01      | 98,610.77     | 0.01           | 148,136.3        | 0.21            | 4,755.54          | crlist    |
| crud     | delete / all entries from tail one by one               | 5,000 | 5,000  | 0            | 558,490.73     | 0.01      | 92,367.49     | 0              | 202,044.69       | 0.21            | 4,819.97          | crlist    |
| crud     | delete / all entries in random order                    | 5,000 | 5,000  | 0.13         | 7,699.9        | 12.82     | 77.98         | 9.95           | 100.54           | 0.25            | 3,953.54          | crlist    |
| crud     | delete / already deleted head                           | 5,000 | 250    | 0            | 656,340.25     | 0         | 230,925.55    | 0              | 493,680.88       | 0.03            | 36,303.44         | crlist    |
| crud     | delete / already deleted middle                         | 5,000 | 250    | 0            | 1,630,789.3    | 0         | 259,578.44    | 0              | 954,927.43       | 0.02            | 43,608.71         | crlist    |
| crud     | delete / already deleted tail                           | 5,000 | 250    | 0            | 1,739,735.56   | 0         | 206,202.57    | 0              | 1,041,232.82     | 0.02            | 46,450.27         | crlist    |
| crud     | mixed / append overwrite delete tail                    | 5,000 | 250    | 0.01         | 141,346.75     | 0.05      | 18,617.26     | 0.05           | 21,002.23        | 1.71            | 584.64            | crlist    |
| crud     | mixed / prepend overwrite delete head                   | 5,000 | 250    | 0            | 203,798.81     | 0.03      | 34,615.97     | 0.06           | 16,783.93        | 1.63            | 615.02            | crlist    |
| crud     | mixed / insert overwrite delete middle                  | 5,000 | 250    | 0.01         | 185,336.2      | 0.02      | 44,168.05     | 0.04           | 22,408.46        | 1.59            | 628.65            | crlist    |
| crud     | mixed / append prepend insert overwrite delete          | 5,000 | 250    | 0            | 202,823.3      | 0.02      | 40,513.39     | 0.05           | 18,816.23        | 1.73            | 579.36            | crlist    |
| mags     | snapshot                                                | 5,000 | 250    | 0.13         | 7,584.19       | 4.48      | 223.21        | 8.68           | 115.22           | 15              | 66.67             | crlist    |
| mags     | snapshot / clean state                                  | 5,000 | 250    | 0.12         | 8,247.75       | 4.49      | 222.84        | 10             | 100.01           | 14.98           | 66.75             | crlist    |
| mags     | snapshot / tombstoned state 50% deleted                 | 5,000 | 250    | 0.08         | 12,812.3       | 2.37      | 422.79        | 4.28           | 233.9            | 18.53           | 53.96             | crlist    |
| mags     | snapshot / tombstoned state 90% deleted                 | 5,000 | 250    | 0.02         | 40,446.53      | 0.44      | 2,260.08      | 0.68           | 1,477.13         | 15.45           | 64.74             | crlist    |
| mags     | snapshot / after garbage collection                     | 5,000 | 250    | 0.07         | 15,112.68      | 2.22      | 450.52        | 3.96           | 252.47           | 15.1            | 66.21             | crlist    |
| mags     | snapshot / size bytes clean state                       | 5,000 | 1      | 0            | n/a            | 0         | n/a           | 0              | n/a              | 0               | n/a               | n/a       |
| mags     | snapshot / size bytes tombstoned state                  | 5,000 | 1      | 0            | n/a            | 0         | n/a           | 0              | n/a              | 0               | n/a               | n/a       |
| mags     | acknowledge                                             | 5,000 | 250    | 0            | 1,889,644.75   | n/a       | n/a           | n/a            | n/a              | n/a             | n/a               | n/a       |
| mags     | acknowledge / clean state                               | 5,000 | 250    | 0            | 7,225,433.53   | n/a       | n/a           | n/a            | n/a              | n/a             | n/a               | n/a       |
| mags     | acknowledge / 50% deleted state                         | 5,000 | 250    | 0.05         | 21,908.68      | n/a       | n/a           | n/a            | n/a              | n/a             | n/a               | n/a       |
| mags     | acknowledge / 90% deleted state                         | 5,000 | 250    | 0.07         | 14,102.94      | n/a       | n/a           | n/a            | n/a              | n/a             | n/a               | n/a       |
| mags     | garbage collect                                         | 5,000 | 250    | 0            | 1,182,033.1    | n/a       | n/a           | n/a            | n/a              | n/a             | n/a               | n/a       |
| mags     | garbage collect / no eligible tombstones                | 5,000 | 250    | 0            | 5,010,020.04   | n/a       | n/a           | n/a            | n/a              | n/a             | n/a               | n/a       |
| mags     | garbage collect / 50% eligible tombstones               | 5,000 | 250    | 0            | 550,660.79     | n/a       | n/a           | n/a            | n/a              | n/a             | n/a               | n/a       |
| mags     | garbage collect / 90% eligible tombstones               | 5,000 | 250    | 0            | 528,317.84     | n/a       | n/a           | n/a            | n/a              | n/a             | n/a               | n/a       |
| mags     | garbage collect / partial frontiers 2 replicas          | 5,000 | 250    | 0            | 3,355,704.7    | n/a       | n/a           | n/a            | n/a              | n/a             | n/a               | n/a       |
| mags     | garbage collect / partial frontiers 10 replicas         | 5,000 | 250    | 0            | 5,010,020.04   | n/a       | n/a           | n/a            | n/a              | n/a             | n/a               | n/a       |
| mags     | post-gc read / full iteration visible values            | 5,000 | 250    | 0.31         | 3,209.87       | 0.12      | 8,505.51      | 0.82           | 1,217.5          | 0.03            | 28,588.75         | automerge |
| mags     | post-gc snapshot / size bytes                           | 5,000 | 1      | 0            | n/a            | 0         | n/a           | 0              | n/a              | 0               | n/a               | n/a       |
| mags     | delta / append head single op size bytes                | 5,000 | 1      | 0            | n/a            | 0         | n/a           | 0              | n/a              | 0               | n/a               | n/a       |
| mags     | delta / append tail single op size bytes                | 5,000 | 1      | 0            | n/a            | 0         | n/a           | 0              | n/a              | 0               | n/a               | n/a       |
| mags     | delta / prepend head single op size bytes               | 5,000 | 1      | 0            | n/a            | 0         | n/a           | 0              | n/a              | 0               | n/a               | n/a       |
| mags     | delta / insert middle single op size bytes              | 5,000 | 1      | 0            | n/a            | 0         | n/a           | 0              | n/a              | 0               | n/a               | n/a       |
| mags     | delta / overwrite head single op size bytes             | 5,000 | 1      | 0            | n/a            | 0         | n/a           | 0              | n/a              | 0               | n/a               | n/a       |
| mags     | delta / overwrite middle single op size bytes           | 5,000 | 1      | 0            | n/a            | 0         | n/a           | 0              | n/a              | 0               | n/a               | n/a       |
| mags     | delta / overwrite tail single op size bytes             | 5,000 | 1      | 0            | n/a            | 0         | n/a           | 0              | n/a              | 0               | n/a               | n/a       |
| mags     | delta / delete head single op size bytes                | 5,000 | 1      | 0            | n/a            | 0         | n/a           | 0              | n/a              | 0               | n/a               | n/a       |
| mags     | delta / delete middle single op size bytes              | 5,000 | 1      | 0            | n/a            | 0         | n/a           | 0              | n/a              | 0               | n/a               | n/a       |
| mags     | delta / delete tail single op size bytes                | 5,000 | 1      | 0            | n/a            | 0         | n/a           | 0              | n/a              | 0               | n/a               | n/a       |
| mags     | delta / range delete size bytes                         | 5,000 | 100    | 0            | n/a            | 0         | n/a           | 0              | n/a              | 0               | n/a               | n/a       |
| mags     | delta / batch append 100 ops size bytes                 | 5,000 | 100    | 0            | n/a            | 0         | n/a           | 0              | n/a              | 0               | n/a               | n/a       |
| mags     | delta / batch prepend 100 ops size bytes                | 5,000 | 100    | 0            | n/a            | 0         | n/a           | 0              | n/a              | 0               | n/a               | n/a       |
| mags     | delta / batch insert middle 100 ops size bytes          | 5,000 | 100    | 0            | n/a            | 0         | n/a           | 0              | n/a              | 0               | n/a               | n/a       |
| mags     | delta / batch overwrite 100 ops size bytes              | 5,000 | 100    | 0            | n/a            | 0         | n/a           | 0              | n/a              | 0               | n/a               | n/a       |
| mags     | delta / batch mixed 100 ops size bytes                  | 5,000 | 100    | 0            | n/a            | 0         | n/a           | 0              | n/a              | 0               | n/a               | n/a       |
| mags     | merge ordered deltas                                    | 5,000 | 250    | n/a          | n/a            | 0.03      | 36,391.69     | 0.01           | 91,001.75        | 3.15            | 317.71            | json-joy  |
| mags     | merge shuffled gossip                                   | 5,000 | 250    | n/a          | n/a            | 0.9       | 1,109.67      | n/a            | n/a              | 0.77            | 1,295.39          | automerge |
| mags     | merge / append head delta into equal replica            | 5,000 | 1      | 0.17         | 5,885.82       | 0.09      | 11,363.64     | 0.09           | 11,363.64        | 3.6             | 277.96            | yjs       |
| mags     | merge / append tail delta into equal replica            | 5,000 | 1      | 0.03         | 34,013.61      | 0.03      | 31,446.54     | 0.02           | 65,789.47        | 3.95            | 253.13            | json-joy  |
| mags     | merge / prepend head delta into equal replica           | 5,000 | 1      | 0.2          | 5,120.33       | 0.03      | 28,901.73     | 0.01           | 78,125           | 3.55            | 281.32            | json-joy  |
| mags     | merge / insert middle delta into equal replica          | 5,000 | 1      | 0.08         | 12,019.23      | 0.04      | 28,571.43     | 0.02           | 55,555.56        | 3.37            | 296.68            | json-joy  |
| mags     | merge / overwrite head delta into equal replica         | 5,000 | 1      | 0.88         | 1,130.33       | 0.06      | 16,155.09     | 0.02           | 60,606.06        | 3.24            | 308.43            | json-joy  |
| mags     | merge / overwrite middle delta into equal replica       | 5,000 | 1      | 0.83         | 1,207          | 0.07      | 14,662.76     | 0.03           | 32,573.29        | 3.79            | 263.81            | json-joy  |
| mags     | merge / overwrite tail delta into equal replica         | 5,000 | 1      | 0.95         | 1,055.85       | 0.06      | 15,649.45     | 0.02           | 54,644.81        | 3.52            | 284               | json-joy  |
| mags     | merge / delete head delta into equal replica            | 5,000 | 1      | 0.85         | 1,182.17       | 0.02      | 44,247.79     | 0.03           | 35,460.99        | 1.99            | 501.86            | yjs       |
| mags     | merge / delete middle delta into equal replica          | 5,000 | 1      | 4.16         | 240.32         | 0.11      | 8,944.54      | 0.08           | 12,422.36        | 1.98            | 505.13            | json-joy  |
| mags     | merge / delete tail delta into equal replica            | 5,000 | 1      | 0.81         | 1,232.44       | 0.02      | 42,735.04     | 0.01           | 76,923.08        | 1.77            | 565.67            | json-joy  |
| mags     | merge / duplicate delta ignored                         | 5,000 | 250    | 0            | 904,486.25     | 0.04      | 25,742.68     | 0.01           | 111,987.1        | 0.04            | 24,061.37         | crlist    |
| mags     | merge / old delta ignored after merge                   | 5,000 | 250    | 0            | 1,195,028.68   | 0.03      | 38,259.65     | 0              | 228,874.85       | 0.03            | 34,183.36         | crlist    |
| mags     | merge / ordered 1,000 append deltas                     | 5,000 | 1,000  | 0            | 396,919.9      | 0.02      | 42,123.89     | 0.01           | 125,585.54       | 3.5             | 285.91            | crlist    |
| mags     | merge / ordered 1,000 prepend deltas                    | 5,000 | 1,000  | 0.05         | 20,987.59      | 0.01      | 67,701.14     | 0.03           | 36,882.4         | 3.57            | 279.77            | yjs       |
| mags     | merge / ordered 1,000 middle insert deltas              | 5,000 | 1,000  | 0.02         | 50,105.22      | 0.01      | 77,533.8      | 0.01           | 94,353.86        | 3.55            | 281.65            | json-joy  |
| mags     | merge / shuffled 1,000 mixed deltas                     | 5,000 | 250    | n/a          | n/a            | 1.71      | 584.06        | n/a            | n/a              | 0.88            | 1,137.52          | automerge |
| mags     | merge / reverse ordered 1,000 mixed deltas              | 5,000 | 250    | n/a          | n/a            | 1.44      | 694.59        | n/a            | n/a              | 0.91            | 1,101.05          | automerge |
| mags     | merge / concurrent prepends same head                   | 5,000 | 2      | 0.99         | 1,007.2        | 0.12      | 8,616.98      | n/a            | n/a              | 11.46           | 87.26             | yjs       |
| mags     | merge / concurrent appends same tail                    | 5,000 | 2      | 0.88         | 1,142.14       | 0.04      | 27,322.4      | n/a            | n/a              | 8.28            | 120.72            | yjs       |
| mags     | merge / concurrent inserts same middle position         | 5,000 | 2      | 0.88         | 1,132.89       | 0.05      | 19,361.08     | n/a            | n/a              | 8.4             | 119.04            | yjs       |
| mags     | merge / concurrent overwrites same head                 | 5,000 | 2      | 1.61         | 622.96         | 0.04      | 22,246.94     | n/a            | n/a              | 15.69           | 63.72             | yjs       |
| mags     | merge / concurrent overwrites same middle               | 5,000 | 2      | 4.26         | 234.83         | 0.05      | 18,281.54     | n/a            | n/a              | 10.6            | 94.33             | yjs       |
| mags     | merge / concurrent overwrites same tail                 | 5,000 | 2      | 1.6          | 623.29         | 0.05      | 20,429.01     | n/a            | n/a              | 8.47            | 118.07            | yjs       |
| mags     | merge / concurrent deletes same head                    | 5,000 | 2      | 0.82         | 1,216.99       | 0.02      | 40,241.45     | 0.03           | 29,154.52        | 7.27            | 137.62            | yjs       |
| mags     | merge / concurrent deletes same middle                  | 5,000 | 2      | 4.79         | 208.83         | 0.03      | 30,030.03     | 0.02           | 46,403.71        | 8.04            | 124.41            | json-joy  |
| mags     | merge / concurrent deletes same tail                    | 5,000 | 2      | 0.99         | 1,011.68       | 0.04      | 27,247.96     | 0.02           | 60,790.27        | 14.36           | 69.62             | json-joy  |
| mags     | merge / concurrent overwrite delete same entry          | 5,000 | 2      | 1.44         | 694.35         | 0.13      | 7,770.01      | 0.07           | 14,306.15        | 9.38            | 106.63            | json-joy  |
| mags     | merge / forked replicas rejoin after 250 ops each       | 5,000 | 500    | 0.63         | 1,591.03       | 0.02      | 50,523.42     | n/a            | n/a              | 3.15            | 317.23            | yjs       |
| mags     | merge / 10 replicas gossip convergence                  | 5,000 | 100    | 0.96         | 1,043.22       | 0.01      | 79,201.65     | n/a            | n/a              | 6.37            | 157.03            | yjs       |
| mags     | merge / snapshot merge into stale replica               | 5,000 | 5,350  | 0            | 1,105,988.88   | 0         | 453,393.67    | 0.01           | 194,718.22       | 0.03            | 32,046.21         | crlist    |
| class    | constructor / hydrate snapshot                          | 5,000 | 250    | 3.46         | 289.15         | 9.97      | 100.3         | 20.4           | 49.01            | 171.72          | 5.82              | crlist    |
| class    | read / head                                             | 5,000 | 250    | 0            | 1,054,407.42   | 0         | 3,496,503.5   | 0              | 1,727,712.51     | 0               | 2,138,579.98      | yjs       |
| class    | read / middle                                           | 5,000 | 250    | 0            | 1,849,112.43   | 0         | 12,135,922.33 | 0              | 3,665,689.15     | 0               | 8,928,571.43      | yjs       |
| class    | read / tail                                             | 5,000 | 250    | 0            | 3,109,452.74   | 0         | 13,368,983.96 | 0              | 3,676,470.59     | 0               | 10,460,251.05     | yjs       |
| class    | find near head                                          | 5,000 | 250    | 0            | 754,375.38     | 0         | 1,481,920.57  | 0              | 950,209.05       | 0               | 1,653,439.15      | automerge |
| class    | find near middle                                        | 5,000 | 250    | 1.16         | 864.49         | 0.11      | 8,820.4       | 1.54           | 648.62           | 0.02            | 63,558.24         | automerge |
| class    | find near tail                                          | 5,000 | 250    | 2.43         | 411.09         | 0.19      | 5,260.33      | 2.02           | 493.88           | 0.02            | 52,690.37         | automerge |
| class    | iterate visible values                                  | 5,000 | 250    | 0.11         | 9,108.07       | 0.28      | 3,617.04      | 2.11           | 474.94           | 0.08            | 12,055.22         | automerge |
| class    | collect visible values to array                         | 5,000 | 250    | 0.1          | 9,602.46       | 0.27      | 3,656.45      | 2.01           | 498.73           | 0.08            | 13,149.31         | automerge |
| class    | append / single after tail                              | 5,000 | 250    | 0.01         | 102,308.07     | 0.03      | 37,894.29     | 0.03           | 33,340.45        | 1.95            | 512.96            | crlist    |
| class    | append / batch after tail                               | 5,000 | 25,000 | 0.01         | 157,189.4      | 0         | 491,913.92    | 0.01           | 131,910.04       | 0.18            | 5,511.33          | yjs       |
| class    | prepend / single before head                            | 5,000 | 250    | 0.01         | 121,607.16     | 0.02      | 59,451.62     | 0.01           | 132,492.45       | 1.9             | 526.93            | json-joy  |
| class    | prepend / batch before head                             | 5,000 | 25,000 | 0.01         | 139,432.13     | 0         | 629,895.87    | 0.01           | 165,430.46       | 0.18            | 5,440.24          | yjs       |
| class    | insert / single before middle                           | 5,000 | 250    | 0.01         | 119,634.4      | 0.02      | 57,971.01     | 0.02           | 49,176.78        | 1.93            | 517.73            | crlist    |
| class    | insert / batch before middle                            | 5,000 | 25,000 | 0.01         | 124,700.28     | 0         | 644,399.65    | 0.01           | 133,547.51       | 0.19            | 5,340.44          | yjs       |
| class    | overwrite / head                                        | 5,000 | 250    | 0.01         | 94,264.92      | 0.03      | 34,111.53     | 0.01           | 86,715.23        | 2.09            | 478.39            | crlist    |
| class    | overwrite / middle                                      | 5,000 | 250    | 0.01         | 107,874.87     | 0.04      | 27,282.15     | 0.01           | 91,528.15        | 2.04            | 490               | crlist    |
| class    | overwrite / tail                                        | 5,000 | 250    | 0.01         | 135,729.41     | 0.03      | 39,075.93     | 0.01           | 94,718.5         | 1.91            | 522.87            | crlist    |
| class    | overwrite / random                                      | 5,000 | 250    | 0.01         | 116,855.19     | 0.04      | 25,846.74     | 0.01           | 101,957.59       | 2.2             | 455.01            | crlist    |
| class    | remove / head                                           | 5,000 | 250    | 0            | 308,603.88     | 0.02      | 48,279.32     | 0.03           | 39,536.32        | 0.34            | 2,968.49          | crlist    |
| class    | remove / middle                                         | 5,000 | 250    | 0            | 413,154.85     | 0.01      | 79,925.83     | 0.04           | 26,544.35        | 0.24            | 4,216.24          | crlist    |
| class    | remove / tail                                           | 5,000 | 250    | 0            | 406,041.9      | 0.02      | 46,779.69     | 0              | 224,497.13       | 0.29            | 3,440.14          | crlist    |
| class    | remove / range from head                                | 5,000 | 5,000  | 0            | 455,913.19     | 0         | 4,474,272.93  | 0              | 293,835.91       | 0.02            | 59,014.32         | yjs       |
| class    | remove / range from middle                              | 5,000 | 5,000  | 0            | 460,205.99     | 0         | 4,363,001.75  | 0              | 291,882.17       | 0.02            | 59,333.8          | yjs       |
| class    | remove / range from tail                                | 5,000 | 5,000  | 0            | 471,591.34     | 0         | 4,978,592.05  | 0              | 292,177.25       | 0.02            | 64,301.82         | yjs       |
| class    | mixed / append overwrite remove tail                    | 5,000 | 250    | 0.01         | 147,076.13     | 0.03      | 38,910.51     | 0.01           | 143,934.6        | 1.31            | 765.85            | crlist    |
| class    | mixed / prepend overwrite remove head                   | 5,000 | 250    | 0.01         | 163,452.11     | 0.01      | 70,839.59     | 0.01           | 139,672.61       | 1.55            | 646.17            | crlist    |
| class    | mixed / insert overwrite remove middle                  | 5,000 | 250    | 0.01         | 168,022.04     | 0.02      | 48,537.09     | 0.01           | 152,318.28       | 1.5             | 664.59            | crlist    |
| class    | paste / insert 10,000 entries at cursor                 | 5,000 | 10,000 | 0.02         | 62,175.87      | 0         | 491,973.45    | 0.01           | 80,874.28        | 0.16            | 6,115.81          | yjs       |
| class    | render / join visible entries to string                 | 5,000 | 250    | 0.2          | 4,977.5        | 0.47      | 2,114.07      | 2.52           | 397.25           | 0.18            | 5,451.16          | automerge |
| class    | snapshot                                                | 5,000 | 250    | 0.13         | 7,642.46       | 4.5       | 222.4         | 8.45           | 118.36           | 15.53           | 64.4              | crlist    |
| class    | snapshot / tombstoned state 50% deleted                 | 5,000 | 250    | 0.08         | 13,166.14      | 2.3       | 434.39        | 3.83           | 260.83           | 15.29           | 65.41             | crlist    |
| class    | snapshot / after garbage collection                     | 5,000 | 250    | 0.1          | 9,760.29       | 0.27      | 3,683.1       | 1.85           | 541.44           | 0.07            | 14,557.82         | automerge |
| class    | acknowledge                                             | 5,000 | 250    | 0.06         | 15,812.98      | n/a       | n/a           | n/a            | n/a              | n/a             | n/a               | n/a       |
| class    | acknowledge / 50% deleted state                         | 5,000 | 250    | 0.04         | 25,794.47      | n/a       | n/a           | n/a            | n/a              | n/a             | n/a               | n/a       |
| class    | acknowledge / 90% deleted state                         | 5,000 | 250    | 0.08         | 12,246.44      | n/a       | n/a           | n/a            | n/a              | n/a             | n/a               | n/a       |
| class    | garbage collect                                         | 5,000 | 250    | 0.12         | 8,025.04       | 0.28      | 3,622.98      | 2.16           | 463.21           | 0.07            | 13,401.02         | automerge |
| class    | garbage collect / no eligible tombstones                | 5,000 | 250    | 0.1          | 9,942.81       | 0.35      | 2,855.92      | 1.99           | 503.53           | 0.07            | 13,780.48         | automerge |
| class    | garbage collect / 90% eligible tombstones               | 5,000 | 250    | 0.09         | 10,728         | 0.35      | 2,887.93      | 2.03           | 493.63           | 0.07            | 13,656.28         | automerge |
| class    | merge ordered deltas                                    | 5,000 | 250    | n/a          | n/a            | 0.02      | 49,541.25     | 0.01           | 193,993.95       | 2.95            | 339.03            | json-joy  |
| class    | merge shuffled gossip                                   | 5,000 | 250    | n/a          | n/a            | 0.54      | 1,855.17      | n/a            | n/a              | 0.7             | 1,433.26          | yjs       |
| class    | merge / duplicate delta ignored                         | 5,000 | 250    | 0            | 846,883.47     | 0.03      | 29,824.39     | 0              | 271,326.24       | 0.03            | 29,651.42         | crlist    |
| class    | merge / concurrent prepends same head                   | 5,000 | 2      | 3.15         | 317.61         | 0.12      | 8,536.06      | n/a            | n/a              | 10.49           | 95.29             | yjs       |
| class    | merge / concurrent appends same tail                    | 5,000 | 2      | 0.85         | 1,173.85       | 0.05      | 21,834.06     | n/a            | n/a              | 10.78           | 92.79             | yjs       |
| class    | merge / concurrent inserts same middle position         | 5,000 | 2      | 0.89         | 1,125.37       | 0.04      | 28,011.2      | n/a            | n/a              | 14.89           | 67.18             | yjs       |
| class    | merge / forked replicas rejoin after 250 ops each       | 5,000 | 500    | 0.53         | 1,875.42       | 0.01      | 78,566.94     | n/a            | n/a              | 3.15            | 317.4             | yjs       |
| latency  | append tail write to remote visible                     | 5,000 | 250    | 0.38         | 2,612.69       | 0.27      | 3,701.46      | 12.89          | 77.56            | 5.61            | 178.31            | yjs       |
| latency  | prepend head write to remote visible                    | 5,000 | 250    | 0.06         | 15,873.42      | 0.04      | 28,002.73     | 0.03           | 35,024.8         | 5.78            | 173.15            | json-joy  |
| latency  | middle insert write to remote visible                   | 5,000 | 250    | 0.34         | 2,966.44       | 0.17      | 5,906         | 4.66           | 214.45           | 5.69            | 175.61            | yjs       |
| latency  | head insert write to remote visible                     | 5,000 | 250    | 0.06         | 17,962.87      | 0.03      | 35,954.15     | 0.04           | 22,914.76        | 5.71            | 175.21            | yjs       |
| latency  | overwrite head write to remote visible                  | 5,000 | 250    | 0.8          | 1,245.59       | 0.05      | 22,193.62     | 0.03           | 31,289.5         | 5.74            | 174.29            | json-joy  |
| latency  | overwrite middle write to remote visible                | 5,000 | 250    | 0.98         | 1,015.85       | 0.18      | 5,517.33      | 3.59           | 278.51           | 5.67            | 176.41            | yjs       |
| latency  | overwrite tail write to remote visible                  | 5,000 | 250    | 1.48         | 677.84         | 0.28      | 3,633.74      | 6.9            | 144.94           | 5.57            | 179.56            | yjs       |
| latency  | head delete to remote hidden                            | 5,000 | 250    | 1.28         | 780.25         | 0.31      | 3,211.55      | 7.2            | 138.91           | 2.05            | 488.67            | yjs       |
| latency  | middle delete to remote hidden                          | 5,000 | 250    | 1.2          | 829.98         | 0.28      | 3,533.12      | 6.31           | 158.53           | 2.04            | 489.42            | yjs       |
| latency  | tail delete to remote hidden                            | 5,000 | 250    | 1.25         | 801.21         | 0.25      | 3,987.15      | 7.49           | 133.53           | 2.11            | 474.62            | yjs       |
| latency  | append tail write to 10 remotes visible                 | 5,000 | 2,500  | 0.52         | 1,930.55       | 0.25      | 4,066.98      | 13.15          | 76.06            | 3.76            | 265.63            | yjs       |
| latency  | prepend head write to 10 remotes visible                | 5,000 | 2,500  | 0.07         | 13,686.77      | 0.01      | 88,078.1      | 0.01           | 78,404.81        | 3.84            | 260.32            | yjs       |
| latency  | middle insert write to 10 remotes visible               | 5,000 | 2,500  | 0.33         | 3,053.83       | 0.13      | 7,415.43      | 4.58           | 218.29           | 3.82            | 261.45            | yjs       |
| latency  | overwrite middle write to 10 remotes visible            | 5,000 | 2,500  | 1.26         | 793.24         | 0.16      | 6,312.96      | 3.18           | 314.43           | 3.79            | 263.83            | yjs       |
| latency  | delete middle to 10 remotes hidden                      | 5,000 | 2,500  | 1.61         | 619.81         | 0.27      | 3,690.93      | 6.45           | 155.15           | 2.19            | 456.93            | yjs       |
| latency  | out-of-order write delivery to remote visible           | 5,000 | 250    | 1.44         | 695.11         | 89.93     | 11.12         | n/a            | n/a              | 16.09           | 62.15             | crlist    |
| latency  | out-of-order delete delivery to remote convergence      | 5,000 | 250    | 0.72         | 1,392.01       | 0         | 257,307.53    | 0.01           | 147,327.48       | 0.18            | 5,542.25          | yjs       |
| latency  | out-of-order append delivery to convergence             | 5,000 | 250    | 1.26         | 793.49         | 26.94     | 37.11         | n/a            | n/a              | 17.93           | 55.77             | crlist    |
| latency  | out-of-order prepend delivery to convergence            | 5,000 | 250    | 1.41         | 708.91         | 28.26     | 35.38         | 0.1            | 9,597.33         | 17.59           | 56.85             | json-joy  |
| latency  | out-of-order middle insert delivery to convergence      | 5,000 | 250    | 1.3          | 766.83         | 89.08     | 11.23         | n/a            | n/a              | 18.29           | 54.68             | crlist    |
| latency  | out-of-order overwrite delivery to convergence          | 5,000 | 129    | 1.87         | 533.8          | n/a       | n/a           | 232.79         | 4.3              | 77.26           | 12.94             | crlist    |
| latency  | offline burst 1,000 ops then sync                       | 5,000 | 250    | n/a          | n/a            | 0.03      | 34,752.03     | 0              | 258,926.49       | 3.23            | 309.58            | json-joy  |
| latency  | forked replicas mixed ops then converge                 | 5,000 | 500    | 0.61         | 1,629.87       | 0.02      | 64,321.92     | n/a            | n/a              | 3.19            | 313.54            | yjs       |
| latency  | duplicate shuffled gossip to convergence                | 5,000 | 250    | n/a          | n/a            | 0.23      | 4,265.54      | n/a            | n/a              | 0.44            | 2,268.45          | yjs       |
| latency  | remote snapshot hydrate then apply pending deltas       | 5,000 | 250    | n/a          | n/a            | 0.04      | 23,499.11     | 0.07           | 14,719.3         | 0.69            | 1,443.85          | yjs       |
| workload | local app session                                       | 5,000 | 250    | 0.01         | 76,131.31      | 0.02      | 62,471.89     | 0.01           | 136,888.79       | 1.4             | 712.51            | json-joy  |
| workload | read heavy session                                      | 5,000 | 250    | 0            | 1,454,333.92   | 0         | 4,416,961.13  | 0              | 414,731.25       | 0               | 3,132,832.08      | yjs       |
| workload | write heavy session                                     | 5,000 | 250    | 0.01         | 76,149.86      | 0.02      | 53,949.07     | 0.01           | 165,859.48       | 2.13            | 470.12            | json-joy  |
| workload | append tail heavy session                               | 5,000 | 250    | 0.01         | 192,263.32     | 0.02      | 49,121.7      | 0.02           | 63,419.58        | 1.78            | 562.38            | crlist    |
| workload | prepend head heavy session                              | 5,000 | 250    | 0.01         | 74,520.09      | 0.02      | 56,368.51     | 0.01           | 152,671.76       | 1.63            | 615.2             | json-joy  |
| workload | insert middle heavy session                             | 5,000 | 250    | 0.02         | 65,970.02      | 0.02      | 56,760.13     | 0.01           | 157,163.51       | 1.65            | 607.55            | json-joy  |
| workload | overwrite heavy session                                 | 5,000 | 250    | 0.01         | 67,726.82      | 0.02      | 40,125.83     | 0.01           | 156,015.98       | 1.26            | 794.36            | json-joy  |
| workload | delete heavy session                                    | 5,000 | 250    | 0.01         | 103,738.74     | 0.03      | 39,631.58     | 0              | 213,219.62       | 0.28            | 3,545.48          | json-joy  |
| workload | balanced append prepend insert overwrite delete session | 5,000 | 250    | 0.01         | 74,034.59      | 0.01      | 75,663.57     | 0.01           | 150,087.05       | 1.39            | 717.67            | json-joy  |
| workload | random edit session                                     | 5,000 | 250    | 0.02         | 50,088.16      | 0.03      | 39,302.61     | 0.04           | 28,194.11        | 1.23            | 811.57            | crlist    |
| workload | text editing session                                    | 5,000 | 250    | 0.01         | 67,480.03      | 0.01      | 76,059.51     | 0.01           | 172,366.24       | 1.75            | 571.57            | json-joy  |
| workload | collaborative offline session                           | 5,000 | 500    | 0.63         | 1,578.49       | 0.02      | 47,061.04     | n/a            | n/a              | 3.24            | 308.43            | yjs       |
| workload | sync and cleanup session                                | 5,000 | 250    | n/a          | n/a            | 0.02      | 57,146.12     | n/a            | n/a              | 3.19            | 313.43            | yjs       |
| workload | long lived tombstoned session                           | 5,000 | 250    | 0.01         | 148,880.42     | 0.02      | 56,497.18     | 0.01           | 162,358.75       | 1.86            | 536.32            | json-joy  |
| workload | sparse visible session                                  | 5,000 | 250    | 0.01         | 118,956.99     | 0.19      | 5,382.82      | 0.02           | 66,593.86        | 0.96            | 1,044.35          | crlist    |
| workload | post-gc edit session                                    | 5,000 | 250    | 0.01         | 160,184.53     | 0.02      | 41,850.11     | 0.01           | 164,625.31       | 1.61            | 621.15            | json-joy  |
| total wa | time: 820,335.7 ms                                      |       |        |              |                |           |               |                |                  |                 |                   |           |

## License

Apache-2.0
