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

JavaScript/WASM performance measured using Node.js `24.16.0` on Intel Core i5-10210U at 1.60 GHz. These results characterize Node.js, not browser runtimes. [See the full benchmark report](https://sovereignbase.dev/sequencer/benchmarks/) for methodology and variability.

| function | Sequence length | throughput (ops/sec) | calls | avg µs/op |
| --- | ---: | ---: | ---: | ---: |
| `__create` | 100 | 124,938 | 256 | 8.004 |
| `__read` | 100 | 18,439,978 | 131,072 | 0.05423 |
| `__length` | 100 | 65,832,785 | 131,072 | 0.01519 |
| `__recover` | 100 | 432,339 | 256 | 2.313 |
| `__update` | 100 | 217,533 | 256 | 4.597 |
| `__delete` | 100 | 304,692 | 256 | 3.282 |
| `__merge` | 100 | 229,885 | 256 | 4.350 |
| `__acknowledge` | 100 | 1,577,287 | 4,096 | 0.6340 |
| `__garbageCollect` | 100 | 319,591 | 256 | 3.129 |
| `__snapshot` | 100 | 347,464 | 256 | 2.878 |
| `__create` | 1,000 | 143,431 | 128 | 6.972 |
| `__read` | 1,000 | 18,358,730 | 65,536 | 0.05447 |
| `__length` | 1,000 | 42,194,093 | 65,536 | 0.02370 |
| `__recover` | 1,000 | 80,334 | 128 | 12.448 |
| `__update` | 1,000 | 87,268 | 128 | 11.459 |
| `__delete` | 1,000 | 365,230 | 128 | 2.738 |
| `__merge` | 1,000 | 431,779 | 128 | 2.316 |
| `__acknowledge` | 1,000 | 1,403,312 | 2,048 | 0.7126 |
| `__garbageCollect` | 1,000 | 665,336 | 128 | 1.503 |
| `__snapshot` | 1,000 | 312,012 | 128 | 3.205 |
| `__create` | 10,000 | 7,499 | 64 | 133.353 |
| `__read` | 10,000 | 11,415,525 | 32,768 | 0.08760 |
| `__length` | 10,000 | 38,080,731 | 32,768 | 0.02626 |
| `__recover` | 10,000 | 16,148 | 64 | 61.928 |
| `__update` | 10,000 | 160,565 | 64 | 6.228 |
| `__delete` | 10,000 | 317,763 | 64 | 3.147 |
| `__merge` | 10,000 | 359,195 | 64 | 2.784 |
| `__acknowledge` | 10,000 | 1,746,420 | 1,024 | 0.5726 |
| `__garbageCollect` | 10,000 | 461,681 | 64 | 2.166 |
| `__snapshot` | 10,000 | 126,807 | 64 | 7.886 |
| `__create` | 100,000 | 547 | 16 | 1,826.750 |
| `__read` | 100,000 | 11,987,533 | 8,192 | 0.08342 |
| `__length` | 100,000 | 30,184,123 | 8,192 | 0.03313 |
| `__recover` | 100,000 | 879 | 16 | 1,137.431 |
| `__update` | 100,000 | 387,447 | 16 | 2.581 |
| `__delete` | 100,000 | 512,821 | 16 | 1.950 |
| `__merge` | 100,000 | 233,918 | 16 | 4.275 |
| `__acknowledge` | 100,000 | 1,287,664 | 256 | 0.7766 |
| `__garbageCollect` | 100,000 | 412,371 | 16 | 2.425 |
| `__snapshot` | 100,000 | 5,837 | 16 | 171.319 |
| `__create` | 1,000,000 | 54 | 16 | 18,681.300 |
| `__read` | 1,000,000 | 7,440,476 | 8,192 | 0.1344 |
| `__length` | 1,000,000 | 30,978,934 | 8,192 | 0.03228 |
| `__recover` | 1,000,000 | 51 | 16 | 19,694.256 |
| `__update` | 1,000,000 | 133,103 | 16 | 7.513 |
| `__delete` | 1,000,000 | 196,541 | 16 | 5.088 |
| `__merge` | 1,000,000 | 154,297 | 16 | 6.481 |
| `__acknowledge` | 1,000,000 | 1,362,398 | 256 | 0.7340 |
| `__garbageCollect` | 1,000,000 | 401,929 | 16 | 2.488 |
| `__snapshot` | 1,000,000 | 355 | 16 | 2,816.769 |

### Small bundle size

| format | raw | minified | minified + gzip |
| --- | ---: | ---: | ---: |
| ESM | 89.8 kB | 53.2 kB | 18.8 kB |
| CommonJS | 90.1 kB | 55.6 kB | 19.1 kB |

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
