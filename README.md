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

JavaScript/WASM performance measured using Node.js `24.16.0` on Intel Core i5-10210U at 1.60 GHz. These results characterize Node.js, not browser runtimes. [See the full benchmark report](./docs/benchmarks/index.html) for methodology and variability.

| function | Sequence length | throughput (ops/sec) | calls | avg µs/op |
| --- | ---: | ---: | ---: | ---: |
| `__create` | 100 | 90,074 | 256 | 11.102 |
| `__read` | 100 | 18,152,115 | 131,072 | 0.05509 |
| `__length` | 100 | 58,309,038 | 131,072 | 0.01715 |
| `__recover` | 100 | 317,360 | 256 | 3.151 |
| `__update` | 100 | 264,971 | 256 | 3.774 |
| `__delete` | 100 | 289,101 | 256 | 3.459 |
| `__merge` | 100 | 385,060 | 256 | 2.597 |
| `__acknowledge` | 100 | 1,528,818 | 4,096 | 0.6541 |
| `__garbageCollect` | 100 | 396,511 | 256 | 2.522 |
| `__snapshot` | 100 | 389,408 | 256 | 2.568 |
| `__create` | 1,000 | 127,877 | 128 | 7.820 |
| `__read` | 1,000 | 15,080,682 | 65,536 | 0.06631 |
| `__length` | 1,000 | 38,138,825 | 65,536 | 0.02622 |
| `__recover` | 1,000 | 67,304 | 128 | 14.858 |
| `__update` | 1,000 | 184,060 | 128 | 5.433 |
| `__delete` | 1,000 | 336,814 | 128 | 2.969 |
| `__merge` | 1,000 | 408,664 | 128 | 2.447 |
| `__acknowledge` | 1,000 | 1,688,904 | 2,048 | 0.5921 |
| `__garbageCollect` | 1,000 | 604,230 | 128 | 1.655 |
| `__snapshot` | 1,000 | 303,674 | 128 | 3.293 |
| `__create` | 10,000 | 6,277 | 64 | 159.306 |
| `__read` | 10,000 | 10,850,694 | 32,768 | 0.09216 |
| `__length` | 10,000 | 39,354,585 | 32,768 | 0.02541 |
| `__recover` | 10,000 | 15,158 | 64 | 65.970 |
| `__update` | 10,000 | 206,058 | 64 | 4.853 |
| `__delete` | 10,000 | 342,936 | 64 | 2.916 |
| `__merge` | 10,000 | 355,492 | 64 | 2.813 |
| `__acknowledge` | 10,000 | 1,534,684 | 1,024 | 0.6516 |
| `__garbageCollect` | 10,000 | 393,856 | 64 | 2.539 |
| `__snapshot` | 10,000 | 104,526 | 64 | 9.567 |
| `__create` | 100,000 | 454 | 16 | 2,204.056 |
| `__read` | 100,000 | 10,085,729 | 8,192 | 0.09915 |
| `__length` | 100,000 | 26,497,085 | 8,192 | 0.03774 |
| `__recover` | 100,000 | 850 | 16 | 1,176.169 |
| `__update` | 100,000 | 399,042 | 16 | 2.506 |
| `__delete` | 100,000 | 381,825 | 16 | 2.619 |
| `__merge` | 100,000 | 374,672 | 16 | 2.669 |
| `__acknowledge` | 100,000 | 1,603,078 | 256 | 0.6238 |
| `__garbageCollect` | 100,000 | 255,167 | 16 | 3.919 |
| `__snapshot` | 100,000 | 4,685 | 16 | 213.438 |
| `__create` | 1,000,000 | 51 | 16 | 19,792.106 |
| `__read` | 1,000,000 | 5,151,984 | 8,192 | 0.1941 |
| `__length` | 1,000,000 | 17,743,080 | 8,192 | 0.05636 |
| `__recover` | 1,000,000 | 47 | 16 | 21,217.106 |
| `__update` | 1,000,000 | 111,421 | 16 | 8.975 |
| `__delete` | 1,000,000 | 163,773 | 16 | 6.106 |
| `__merge` | 1,000,000 | 151,515 | 16 | 6.600 |
| `__acknowledge` | 1,000,000 | 1,550,628 | 256 | 0.6449 |
| `__garbageCollect` | 1,000,000 | 397,931 | 16 | 2.513 |
| `__snapshot` | 1,000,000 | 361 | 16 | 2,768.219 |

### Small bundle size

| format | raw | minified | minified + gzip |
| --- | ---: | ---: | ---: |
| ESM | 89.8 kB | 53.2 kB | 18.8 kB |
| CommonJS | 90.1 kB | 55.6 kB | 19.2 kB |

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
