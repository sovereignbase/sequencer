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

### Unbeliveable performance

Measured on Node `24.16.0` / Intel(R) Core(TM) i5-10210U CPU @ 1.60GHz. [Full benchmark report](./docs/benchmarks/index.html).

| function | Sequence length | throughput (ops/sec) | calls | avg µs/op |
| --- | ---: | ---: | ---: | ---: |
| `__create` | 100 | 97,832 | 256 | 14.667 |
| `__read` | 100 | 30,402,149 | 131,072 | 0.037 |
| `__length` | 100 | 98,457,272 | 131,072 | 0.011 |
| `__recover` | 100 | 683,498 | 256 | 2.895 |
| `__update` | 100 | 260,515 | 256 | 4.676 |
| `__delete` | 100 | 436,983 | 256 | 2.773 |
| `__merge` | 100 | 435,190 | 256 | 2.958 |
| `__acknowledge` | 100 | 1,169,305 | 4,096 | 0.865 |
| `__garbageCollect` | 100 | 492,831 | 256 | 2.424 |
| `__snapshot` | 100 | 474,622 | 256 | 2.168 |
| `__create` | 1,000 | 123,863 | 128 | 8.809 |
| `__read` | 1,000 | 10,693,172 | 65,536 | 0.104 |
| `__length` | 1,000 | 31,697,486 | 65,536 | 0.037 |
| `__recover` | 1,000 | 73,368 | 128 | 20.147 |
| `__update` | 1,000 | 181,099 | 128 | 9.312 |
| `__delete` | 1,000 | 280,488 | 128 | 4.302 |
| `__merge` | 1,000 | 445,057 | 128 | 2.471 |
| `__acknowledge` | 1,000 | 1,592,640 | 2,048 | 0.652 |
| `__garbageCollect` | 1,000 | 746,821 | 128 | 1.517 |
| `__snapshot` | 1,000 | 357,724 | 128 | 3.414 |
| `__create` | 10,000 | 16,924 | 64 | 159.944 |
| `__read` | 10,000 | 9,000,340 | 32,768 | 0.127 |
| `__length` | 10,000 | 30,024,321 | 32,768 | 0.039 |
| `__recover` | 10,000 | 18,969 | 64 | 66.053 |
| `__update` | 10,000 | 366,696 | 64 | 4.134 |
| `__delete` | 10,000 | 570,152 | 64 | 2.716 |
| `__merge` | 10,000 | 494,549 | 64 | 2.842 |
| `__acknowledge` | 10,000 | 1,690,735 | 1,024 | 0.593 |
| `__garbageCollect` | 10,000 | 488,861 | 64 | 2.638 |
| `__snapshot` | 10,000 | 127,237 | 64 | 9.109 |
| `__create` | 100,000 | 417 | 16 | 2,987.138 |
| `__read` | 100,000 | 6,262,578 | 8,192 | 0.163 |
| `__length` | 100,000 | 30,314,687 | 8,192 | 0.034 |
| `__recover` | 100,000 | 894 | 16 | 1,374.712 |
| `__update` | 100,000 | 232,151 | 16 | 4.375 |
| `__delete` | 100,000 | 343,535 | 16 | 4.325 |
| `__merge` | 100,000 | 205,882 | 16 | 4.881 |
| `__acknowledge` | 100,000 | 1,195,798 | 256 | 0.875 |
| `__garbageCollect` | 100,000 | 494,959 | 16 | 2.062 |
| `__snapshot` | 100,000 | 7,745 | 16 | 161.750 |
| `__create` | 1,000,000 | 58 | 16 | 18,247.688 |
| `__read` | 1,000,000 | 10,066,895 | 8,192 | 0.101 |
| `__length` | 1,000,000 | 33,379,169 | 8,192 | 0.031 |
| `__recover` | 1,000,000 | 64 | 16 | 16,047.169 |
| `__update` | 1,000,000 | 186,245 | 16 | 5.381 |
| `__delete` | 1,000,000 | 207,388 | 16 | 4.831 |
| `__merge` | 1,000,000 | 143,121 | 16 | 7.006 |
| `__acknowledge` | 1,000,000 | 1,307,201 | 256 | 0.765 |
| `__garbageCollect` | 1,000,000 | 403,573 | 16 | 2.519 |
| `__snapshot` | 1,000,000 | 482 | 16 | 2,760.119 |

### Small bundle size

| format | raw | minified | minified + gzip |
| --- | ---: | ---: | ---: |
| ESM | 89.8 kB | 53.2 kB | 18.8 kB |
| CommonJS | 90.1 kB | 55.6 kB | 19.1 kB |

### Optimized data model

| Reel workload | average bytes/operation | MessagePack | MessagePack + gzip |
| --- | ---: | ---: | ---: |
| 1,000 one-Frame updates | 39.6 B | 39.6 kB | 7.8 kB |
| 1,000 one-Frame Masks | 36.0 B | 36.0 kB | 5.1 kB |
| Snapshot of 1,000 one-Frame Strips | 39.6 B | 39.6 kB | 7.8 kB |

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
