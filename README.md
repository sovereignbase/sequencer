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
| `__create` | 100 | 71,149 | 51,230 | 256 | 256 | 14.055 | 19.520 |
| `__read` | 100 | 15,010,507 | 290,951 | 131,072 | 256 | 0.06662 | 3.437 |
| `__length` | 100 | 79,176,564 | 29,222,677 | 131,072 | 131,072 | 0.01263 | 0.03422 |
| `__recover` | 100 | 628,931 | 356,252 | 256 | 256 | 1.590 | 2.807 |
| `__update` | 100 | 137,137 | 586,510 | 256 | 256 | 7.292 | 1.705 |
| `__delete` | 100 | 390,472 | 413,565 | 256 | 256 | 2.561 | 2.418 |
| `__merge` | 100 | 360,881 | 161,394 | 256 | 256 | 2.771 | 6.196 |
| `__acknowledge` | 100 | 4,526,935 | 3,524,850 | 4,096 | 4,096 | 0.2209 | 0.2837 |
| `__garbageCollect` | 100 | 249,626 | — | 256 | — | 4.006 | — |
| `__snapshot` | 100 | 348,068 | 148,898 | 256 | 256 | 2.873 | 6.716 |
| `__create` | 1,000 | 97,523 | 33,436 | 128 | 128 | 10.254 | 29.908 |
| `__read` | 1,000 | 13,655,606 | 313,185 | 65,536 | 128 | 0.07323 | 3.193 |
| `__length` | 1,000 | 26,336,582 | 20,064,205 | 65,536 | 65,536 | 0.03797 | 0.04984 |
| `__recover` | 1,000 | 125,031 | 352,485 | 128 | 128 | 7.998 | 2.837 |
| `__update` | 1,000 | 66,181 | 83,167 | 128 | 128 | 15.110 | 12.024 |
| `__delete` | 1,000 | 210,128 | 174,398 | 128 | 128 | 4.759 | 5.734 |
| `__merge` | 1,000 | 286,779 | 99,930 | 128 | 128 | 3.487 | 10.007 |
| `__acknowledge` | 1,000 | 4,407,228 | 2,348,520 | 2,048 | 2,048 | 0.2269 | 0.4258 |
| `__garbageCollect` | 1,000 | 338,409 | — | 128 | — | 2.955 | — |
| `__snapshot` | 1,000 | 154,178 | 71,731 | 128 | 128 | 6.486 | 13.941 |
| `__create` | 10,000 | 2,483 | 17,098 | 64 | 64 | 402.755 | 58.486 |
| `__read` | 10,000 | 6,770,481 | 99,771 | 32,768 | 64 | 0.1477 | 10.023 |
| `__length` | 10,000 | 18,853,695 | 18,060,321 | 32,768 | 32,768 | 0.05304 | 0.05537 |
| `__recover` | 10,000 | 44,168 | 123,320 | 64 | 64 | 22.641 | 8.109 |
| `__update` | 10,000 | 189,645 | 19,888 | 64 | 64 | 5.273 | 50.281 |
| `__delete` | 10,000 | 318,878 | 18,908 | 64 | 64 | 3.136 | 52.889 |
| `__merge` | 10,000 | 279,252 | 17,346 | 64 | 64 | 3.581 | 57.650 |
| `__acknowledge` | 10,000 | 5,238,345 | 978,474 | 1,024 | 1,024 | 0.1909 | 1.022 |
| `__garbageCollect` | 10,000 | 246,609 | — | 64 | — | 4.055 | — |
| `__snapshot` | 10,000 | 54,206 | 34,876 | 64 | 64 | 18.448 | 28.673 |
| `__create` | 100,000 | 305 | 5,732 | 16 | 16 | 3,278.513 | 174.463 |
| `__read` | 100,000 | 4,474,273 | 20,937 | 8,192 | 16 | 0.2235 | 47.763 |
| `__length` | 100,000 | 4,321,521 | 11,213,277 | 8,192 | 8,192 | 0.2314 | 0.08918 |
| `__recover` | 100,000 | 1,642 | 14,055 | 16 | 16 | 609.100 | 71.150 |
| `__update` | 100,000 | 290 | 3,888 | 16 | 16 | 3,450.894 | 257.206 |
| `__delete` | 100,000 | 278,242 | 4,566 | 16 | 16 | 3.594 | 219.000 |
| `__merge` | 100,000 | 384 | 2,766 | 16 | 16 | 2,602.388 | 361.488 |
| `__acknowledge` | 100,000 | 4,923,683 | 1,444,669 | 256 | 256 | 0.2031 | 0.6922 |
| `__garbageCollect` | 100,000 | 207,512 | — | 16 | — | 4.819 | — |
| `__snapshot` | 100,000 | 2,596 | 7,198 | 16 | 16 | 385.156 | 138.931 |
| `__create` | 1,000,000 | 74 | 652 | 16 | 16 | 13,531.744 | 1,532.606 |
| `__read` | 1,000,000 | 4,251,701 | 1,798 | 8,192 | 16 | 0.2352 | 556.094 |
| `__length` | 1,000,000 | 8,110,300 | 14,760,148 | 8,192 | 8,192 | 0.1233 | 0.06775 |
| `__recover` | 1,000,000 | 155 | 1,993 | 16 | 16 | 6,471.050 | 501.819 |
| `__update` | 1,000,000 | 78 | 469 | 16 | 16 | 12,867.006 | 2,130.356 |
| `__delete` | 1,000,000 | 179,759 | 521 | 16 | 16 | 5.563 | 1,917.775 |
| `__merge` | 1,000,000 | 85 | 527 | 16 | 16 | 11,818.538 | 1,898.925 |
| `__acknowledge` | 1,000,000 | 4,522,840 | 2,066,116 | 256 | 256 | 0.2211 | 0.4840 |
| `__garbageCollect` | 1,000,000 | 361,141 | — | 16 | — | 2.769 | — |
| `__snapshot` | 1,000,000 | 284 | 1,693 | 16 | 16 | 3,519.063 | 590.738 |

### Small bundle size

| format | raw | minified | minified + gzip |
| --- | ---: | ---: | ---: |
| ESM | 93.0 kB | 54.3 kB | 19.2 kB |
| CommonJS | 93.3 kB | 56.9 kB | 19.5 kB |

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
