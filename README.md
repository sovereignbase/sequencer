# Sequencer

A causality-encoding engine written in TypeScript and C++ to build high-performance, conflict-free replicated data types for use on the web.

Sequencer provides a deterministic total ordering for distributed data. It allows independently operating replicas to make concurrent changes and later converge on the same logical state without relying on network arrival order or perfectly synchronized clocks.

### Table of contents

- //links to headlines per hierarchy

## Usage

### Simple typed api

```ts
import * as sequencer from '@sovereignbase/sequencer'

const sequence = sequencer.__create(/*optional stored snapshot*/)
const { reel, change } = sequencer.__update(sequence, 0, 'Hello World', 'after')
console.log(sequencer.__read(sequence, 0)) // "Hello World"
```

## Benchmarks

### Exceptional performance

JavaScript/WASM performance measured using Node.js `24.16.0` on Intel Core i5-10210U at 1.60 GHz. Diamond Types 1.0.2 is included under its upstream description, “The world's fastest CRDT. WIP.” Results use equivalent public operations where available; `—` means Diamond Types has no public equivalent. [See the full benchmark report](./docs/benchmarks/index.html) for methodology, API differences, and variability.

| function | Sequence length | Sequencer ops/sec | Diamond Types ops/sec | Sequencer calls | Diamond Types calls | Sequencer avg µs/op | Diamond Types avg µs/op |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| `__create` | 100 | 82,857 | 12,263 | 256 | 256 | 12.069 | 81.548 |
| `__read` | 100 | 6,253,909 | 152,439 | 131,072 | 256 | 0.1599 | 6.560 |
| `__length` | 100 | 32,765,400 | 20,341,741 | 131,072 | 131,072 | 0.03052 | 0.04916 |
| `__recover` | 100 | 370,782 | 118,864 | 256 | 256 | 2.697 | 8.413 |
| `__update` | 100 | 83,689 | 251,383 | 256 | 256 | 11.949 | 3.978 |
| `__delete` | 100 | 104,778 | 139,412 | 256 | 256 | 9.544 | 7.173 |
| `__merge` | 100 | 133,976 | 61,335 | 256 | 256 | 7.464 | 16.304 |
| `__acknowledge` | 100 | 3,920,031 | 918,274 | 4,096 | 4,096 | 0.2551 | 1.089 |
| `__garbageCollect` | 100 | 169,837 | — | 256 | — | 5.888 | — |
| `__snapshot` | 100 | 167,084 | 52,083 | 256 | 256 | 5.985 | 19.200 |
| `__create` | 1,000 | 32,204 | 20,766 | 128 | 128 | 31.052 | 48.155 |
| `__read` | 1,000 | 7,189,073 | 229,200 | 65,536 | 128 | 0.1391 | 4.363 |
| `__length` | 1,000 | 22,644,928 | 19,124,116 | 65,536 | 65,536 | 0.04416 | 0.05229 |
| `__recover` | 1,000 | 59,266 | 280,191 | 128 | 128 | 16.873 | 3.569 |
| `__update` | 1,000 | 64,855 | 57,673 | 128 | 128 | 15.419 | 17.339 |
| `__delete` | 1,000 | 190,658 | 90,637 | 128 | 128 | 5.245 | 11.033 |
| `__merge` | 1,000 | 149,054 | 31,259 | 128 | 128 | 6.709 | 31.991 |
| `__acknowledge` | 1,000 | 3,025,719 | 1,183,992 | 2,048 | 2,048 | 0.3305 | 0.8446 |
| `__garbageCollect` | 1,000 | 185,874 | — | 128 | — | 5.380 | — |
| `__snapshot` | 1,000 | 125,031 | 39,392 | 128 | 128 | 7.998 | 25.386 |
| `__create` | 10,000 | 1,468 | 11,446 | 64 | 64 | 681.059 | 87.369 |
| `__read` | 10,000 | 3,206,156 | 83,879 | 32,768 | 64 | 0.3119 | 11.922 |
| `__length` | 10,000 | 11,298,158 | 3,097,893 | 32,768 | 32,768 | 0.08851 | 0.3228 |
| `__recover` | 10,000 | 23,783 | 64,763 | 64 | 64 | 42.047 | 15.441 |
| `__update` | 10,000 | 85,609 | 12,258 | 64 | 64 | 11.681 | 81.577 |
| `__delete` | 10,000 | 26,804 | 14,458 | 64 | 64 | 37.308 | 69.167 |
| `__merge` | 10,000 | 70,082 | 11,409 | 64 | 64 | 14.269 | 87.647 |
| `__acknowledge` | 10,000 | 2,937,720 | 1,122,712 | 1,024 | 1,024 | 0.3404 | 0.8907 |
| `__garbageCollect` | 10,000 | 28,069 | — | 64 | — | 35.627 | — |
| `__snapshot` | 10,000 | 11,794 | 17,459 | 64 | 64 | 84.788 | 57.277 |
| `__create` | 100,000 | 137 | 2,789 | 16 | 16 | 7,296.131 | 358.588 |
| `__read` | 100,000 | 3,590,664 | 16,442 | 8,192 | 16 | 0.2785 | 60.819 |
| `__length` | 100,000 | 10,207,206 | 7,077,141 | 8,192 | 8,192 | 0.09797 | 0.1413 |
| `__recover` | 100,000 | 1,110 | 3,967 | 16 | 16 | 901.181 | 252.081 |
| `__update` | 100,000 | 183,284 | 1,613 | 16 | 16 | 5.456 | 619.788 |
| `__delete` | 100,000 | 230,203 | 1,634 | 16 | 16 | 4.344 | 611.963 |
| `__merge` | 100,000 | 173,551 | 1,785 | 16 | 16 | 5.762 | 560.300 |
| `__acknowledge` | 100,000 | 3,363,606 | 931,099 | 256 | 256 | 0.2973 | 1.074 |
| `__garbageCollect` | 100,000 | 313,676 | — | 16 | — | 3.188 | — |
| `__snapshot` | 100,000 | 2,129 | 7,961 | 16 | 16 | 469.806 | 125.619 |
| `__create` | 1,000,000 | 21 | 382 | 16 | 16 | 48,649.350 | 2,618.969 |
| `__read` | 1,000,000 | 2,962,963 | 907 | 8,192 | 16 | 0.3375 | 1,102.306 |
| `__length` | 1,000,000 | 14,976,786 | 6,784,261 | 8,192 | 8,192 | 0.06677 | 0.1474 |
| `__recover` | 1,000,000 | 117 | 990 | 16 | 16 | 8,531.475 | 1,009.800 |
| `__update` | 1,000,000 | 92,217 | 300 | 16 | 16 | 10.844 | 3,336.531 |
| `__delete` | 1,000,000 | 113,882 | 409 | 16 | 16 | 8.781 | 2,447.544 |
| `__merge` | 1,000,000 | 79,962 | 324 | 16 | 16 | 12.506 | 3,088.831 |
| `__acknowledge` | 1,000,000 | 3,164,557 | 964,320 | 256 | 256 | 0.3160 | 1.037 |
| `__garbageCollect` | 1,000,000 | 209,688 | — | 16 | — | 4.769 | — |
| `__snapshot` | 1,000,000 | 194 | 1,051 | 16 | 16 | 5,150.231 | 951.231 |

### Small bundle size

| format | raw | minified | minified + gzip |
| --- | ---: | ---: | ---: |
| ESM | 91.3 kB | 53.8 kB | 19.0 kB |
| CommonJS | 91.6 kB | 56.3 kB | 19.3 kB |

### Compact data model

| Reel workload | average bytes per operation | MessagePack | MessagePack + gzip | gzip reduction |
| --- | ---: | ---: | ---: | ---: |
| 1,000 one-frame updates | 39.6 B | 39.6 kB | 7.8 kB | 80.2% |
| 1,000 one-frame masks | 36.0 B | 36.0 kB | 5.1 kB | 85.9% |
| Snapshot containing 1,000 one-frame strips | 39.6 B | 39.6 kB | 7.8 kB | 80.2% |

## Why shoul you use it?

### Understanding the Problem Sequencer Solves

As an example, let's consider two editors, **A** and **B**, both working on the following text:

```text
Hello world
```

The text has 11 characters and 12 possible insertion positions.

Both editors begin from the same state.

Editor **A** makes two changes:

1. Replaces `H` with `Y`.
2. Inserts `w` after `Hello`.

A now sees:

```text
Yellow world
```

At roughly the same time, before receiving A's changes, editor **B** inserts `!` at the end of the original text:

```text
Hello world!
```

These changes are then exchanged over the network.

When A's changes arrive at B, B can produce the expected result:

```text
Yellow world!
```

However, if B's operation is represented only as something like:

```text
Insert "!" at position 11
```

then applying that operation to A's newer local state may produce:

```text
Yellow worl!d
```

The operation was correct relative to the state in which it was created, but the numeric position no longer represents the same logical location after concurrent edits.

This is the fundamental problem: **array indices and positions are not stable identities**.

### Why Network Ordering Is Not Enough

One possible solution is to introduce a central server that decides the order of operations.

However, this makes network arrival order part of the resulting state.

Depending on latency, the server may receive operations in a different order from the order in which users logically performed them. Two otherwise identical sets of operations could therefore produce different or unintuitive results depending on network conditions.

In other words:

```text
network latency → operation order → resulting state
```

### Why Wall-Clock Timestamps Are Not Enough

Another solution is to timestamp every operation.

However, wall clocks across different machines are never guaranteed to be perfectly synchronized. Clock skew can cause an operation created later to appear earlier, or an earlier operation to appear later.

### Sequencer's Approach

Sequencer gives a stable unique identifier to every frame in a sequence.

Instead of describing a change as:

```text
Insert "!" at position 11
```

an operation can logically describe its relationship to existing sequence elements:

```text
Insert <frame-id> after <frame-id> and resolve possible sibling order with a deterministic rule
```

The identity of that frame remains stable even when other frames are inserted or removed around it.

From any set of sequence frames, Sequencer can reconstruct a deterministic ordering.

This means replicas can:

- Accept changes independently.
- Receive changes in different orders.
- Operate while temporarily disconnected.
- Merge concurrent changes.
- Eventually converge on the same sequence.

## Tests

### Behaviour guaranteed by excessive tests

Every `npm test` run rebuilds the native WebAssembly module and verifies unit
behaviour, deterministic convergence, generative "stress" scenarios, V8 coverage,
the supported runtime matrix, desktop browsers, mobile browser emulations, and
module Web Workers. Every stage has a hard timeout, and all detailed evidence is
written to the [automated test report](https://sovereignbase.dev/sequencer/tests/).

### Works everywhere where ESM modules and Wasm works

Runtimes with tested support:

- Node.js
- Deno
- Bun
- Edge Runtime
- Cloudflare Workers through workerd
- Browser Window and Web Worker contexts
- Chromium, Firefox, and WebKit
- Mobile Chrome and Mobile Safari device profiles

## License

Apache-2.0
