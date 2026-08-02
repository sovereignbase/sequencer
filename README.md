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
| `__create` | 100 | 72,072 | 20,736 | 256 | 256 | 13.875 | 48.225 |
| `__read` | 100 | 17,313,019 | 142,816 | 131,072 | 256 | 0.05776 | 7.002 |
| `__length` | 100 | 61,919,505 | 29,708,853 | 131,072 | 131,072 | 0.01615 | 0.03366 |
| `__recover` | 100 | 901,713 | 346,500 | 256 | 256 | 1.109 | 2.886 |
| `__update` | 100 | 102,923 | 399,840 | 256 | 256 | 9.716 | 2.501 |
| `__delete` | 100 | 168,152 | 269,469 | 256 | 256 | 5.947 | 3.711 |
| `__merge` | 100 | 139,334 | 63,143 | 256 | 256 | 7.177 | 15.837 |
| `__acknowledge` | 100 | 4,679,457 | 1,980,983 | 4,096 | 4,096 | 0.2137 | 0.5048 |
| `__garbageCollect` | 100 | 159,515 | — | 256 | — | 6.269 | — |
| `__snapshot` | 100 | 132,153 | 125,078 | 256 | 256 | 7.567 | 7.995 |
| `__create` | 1,000 | 117,619 | 72,696 | 128 | 128 | 8.502 | 13.756 |
| `__read` | 1,000 | 9,345,794 | 680,272 | 65,536 | 128 | 0.1070 | 1.470 |
| `__length` | 1,000 | 21,034,918 | 35,561,878 | 65,536 | 65,536 | 0.04754 | 0.02812 |
| `__recover` | 1,000 | 266,312 | 782,473 | 128 | 128 | 3.755 | 1.278 |
| `__update` | 1,000 | 160,539 | 127,486 | 128 | 128 | 6.229 | 7.844 |
| `__delete` | 1,000 | 428,449 | 252,207 | 128 | 128 | 2.334 | 3.965 |
| `__merge` | 1,000 | 370,645 | 120,671 | 128 | 128 | 2.698 | 8.287 |
| `__acknowledge` | 1,000 | 4,401,408 | 2,742,732 | 2,048 | 2,048 | 0.2272 | 0.3646 |
| `__garbageCollect` | 1,000 | 404,858 | — | 128 | — | 2.470 | — |
| `__snapshot` | 1,000 | 293,513 | 71,434 | 128 | 128 | 3.407 | 13.999 |
| `__create` | 10,000 | 3,919 | 43,653 | 64 | 64 | 255.163 | 22.908 |
| `__read` | 10,000 | 13,370,771 | 224,618 | 32,768 | 64 | 0.07479 | 4.452 |
| `__length` | 10,000 | 33,898,305 | 24,402,147 | 32,768 | 32,768 | 0.02950 | 0.04098 |
| `__recover` | 10,000 | 31,977 | 232,558 | 64 | 64 | 31.272 | 4.300 |
| `__update` | 10,000 | 260,146 | 45,809 | 64 | 64 | 3.844 | 21.830 |
| `__delete` | 10,000 | 134,336 | 47,680 | 64 | 64 | 7.444 | 20.973 |
| `__merge` | 10,000 | 314,465 | 39,104 | 64 | 64 | 3.180 | 25.573 |
| `__acknowledge` | 10,000 | 3,716,091 | 3,340,013 | 1,024 | 1,024 | 0.2691 | 0.2994 |
| `__garbageCollect` | 10,000 | 418,760 | — | 64 | — | 2.388 | — |
| `__snapshot` | 10,000 | 36,488 | 77,423 | 64 | 64 | 27.406 | 12.916 |
| `__create` | 100,000 | 383 | 1,256 | 16 | 16 | 2,612.500 | 796.087 |
| `__read` | 100,000 | 4,512,635 | 20,113 | 8,192 | 16 | 0.2216 | 49.719 |
| `__length` | 100,000 | 20,759,809 | 8,635,579 | 8,192 | 8,192 | 0.04817 | 0.1158 |
| `__recover` | 100,000 | 2,561 | 17,210 | 16 | 16 | 390.463 | 58.106 |
| `__update` | 100,000 | 278,707 | 2,471 | 16 | 16 | 3.588 | 404.731 |
| `__delete` | 100,000 | 336,134 | 1,848 | 16 | 16 | 2.975 | 540.994 |
| `__merge` | 100,000 | 169,837 | 379 | 16 | 16 | 5.888 | 2,636.363 |
| `__acknowledge` | 100,000 | 4,885,198 | 1,743,983 | 256 | 256 | 0.2047 | 0.5734 |
| `__garbageCollect` | 100,000 | 198,491 | — | 16 | — | 5.038 | — |
| `__snapshot` | 100,000 | 2,998 | 7,322 | 16 | 16 | 333.569 | 136.569 |
| `__create` | 1,000,000 | 25 | 513 | 16 | 16 | 40,076.381 | 1,951.131 |
| `__read` | 1,000,000 | 4,135,649 | 625 | 8,192 | 16 | 0.2418 | 1,600.906 |
| `__length` | 1,000,000 | 13,101,009 | 11,816,141 | 8,192 | 8,192 | 0.07633 | 0.08463 |
| `__recover` | 1,000,000 | 145 | 700 | 16 | 16 | 6,917.075 | 1,428.856 |
| `__update` | 1,000,000 | 146,391 | 199 | 16 | 16 | 6.831 | 5,025.813 |
| `__delete` | 1,000,000 | 151,240 | 329 | 16 | 16 | 6.612 | 3,042.650 |
| `__merge` | 1,000,000 | 130,293 | 343 | 16 | 16 | 7.675 | 2,919.550 |
| `__acknowledge` | 1,000,000 | 2,942,908 | 1,118,443 | 256 | 256 | 0.3398 | 0.8941 |
| `__garbageCollect` | 1,000,000 | 196,541 | — | 16 | — | 5.088 | — |
| `__snapshot` | 1,000,000 | 184 | 1,304 | 16 | 16 | 5,445.019 | 766.725 |

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
