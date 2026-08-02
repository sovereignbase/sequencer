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
| `__create` | 100 | 85,565 | 50,411 | 256 | 256 | 11.687 | 19.837 |
| `__read` | 100 | 26,968,716 | 394,166 | 131,072 | 256 | 0.03708 | 2.537 |
| `__length` | 100 | 90,334,237 | 50,100,200 | 131,072 | 131,072 | 0.01107 | 0.01996 |
| `__recover` | 100 | 366,032 | 715,308 | 256 | 256 | 2.732 | 1.398 |
| `__update` | 100 | 274,499 | 679,810 | 256 | 256 | 3.643 | 1.471 |
| `__delete` | 100 | 231,803 | 504,796 | 256 | 256 | 4.314 | 1.981 |
| `__merge` | 100 | 407,332 | 93,633 | 256 | 256 | 2.455 | 10.680 |
| `__acknowledge` | 100 | 1,482,580 | 3,226,847 | 4,096 | 4,096 | 0.6745 | 0.3099 |
| `__garbageCollect` | 100 | 396,668 | — | 256 | — | 2.521 | — |
| `__snapshot` | 100 | 374,813 | 144,697 | 256 | 256 | 2.668 | 6.911 |
| `__create` | 1,000 | 110,828 | 76,746 | 128 | 128 | 9.023 | 13.030 |
| `__read` | 1,000 | 16,350,556 | 750,751 | 65,536 | 128 | 0.06116 | 1.332 |
| `__length` | 1,000 | 31,938,678 | 35,348,180 | 65,536 | 65,536 | 0.03131 | 0.02829 |
| `__recover` | 1,000 | 70,131 | 444,050 | 128 | 128 | 14.259 | 2.252 |
| `__update` | 1,000 | 163,800 | 151,791 | 128 | 128 | 6.105 | 6.588 |
| `__delete` | 1,000 | 416,320 | 268,097 | 128 | 128 | 2.402 | 3.730 |
| `__merge` | 1,000 | 386,997 | 127,470 | 128 | 128 | 2.584 | 7.845 |
| `__acknowledge` | 1,000 | 1,547,269 | 3,585,515 | 2,048 | 2,048 | 0.6463 | 0.2789 |
| `__garbageCollect` | 1,000 | 574,383 | — | 128 | — | 1.741 | — |
| `__snapshot` | 1,000 | 239,292 | 138,793 | 128 | 128 | 4.179 | 7.205 |
| `__create` | 10,000 | 5,434 | 41,336 | 64 | 64 | 184.039 | 24.192 |
| `__read` | 10,000 | 12,365,525 | 229,621 | 32,768 | 64 | 0.08087 | 4.355 |
| `__length` | 10,000 | 32,393,910 | 31,525,851 | 32,768 | 32,768 | 0.03087 | 0.03172 |
| `__recover` | 10,000 | 8,693 | 248,818 | 64 | 64 | 115.039 | 4.019 |
| `__update` | 10,000 | 160,231 | 44,265 | 64 | 64 | 6.241 | 22.591 |
| `__delete` | 10,000 | 388,651 | 44,665 | 64 | 64 | 2.573 | 22.389 |
| `__merge` | 10,000 | 324,044 | 35,412 | 64 | 64 | 3.086 | 28.239 |
| `__acknowledge` | 10,000 | 1,597,189 | 3,093,102 | 1,024 | 1,024 | 0.6261 | 0.3233 |
| `__garbageCollect` | 10,000 | 465,766 | — | 64 | — | 2.147 | — |
| `__snapshot` | 10,000 | 104,745 | 69,725 | 64 | 64 | 9.547 | 14.342 |
| `__create` | 100,000 | 467 | 6,964 | 16 | 16 | 2,139.325 | 143.600 |
| `__read` | 100,000 | 10,147,133 | 35,398 | 8,192 | 16 | 0.09855 | 28.250 |
| `__length` | 100,000 | 29,112,082 | 15,313,936 | 8,192 | 8,192 | 0.03435 | 0.06530 |
| `__recover` | 100,000 | 698 | 35,126 | 16 | 16 | 1,431.950 | 28.469 |
| `__update` | 100,000 | 332,668 | 4,831 | 16 | 16 | 3.006 | 206.994 |
| `__delete` | 100,000 | 422,119 | 5,329 | 16 | 16 | 2.369 | 187.656 |
| `__merge` | 100,000 | 386,548 | 4,875 | 16 | 16 | 2.588 | 205.131 |
| `__acknowledge` | 100,000 | 1,588,058 | 3,303,601 | 256 | 256 | 0.6297 | 0.3027 |
| `__garbageCollect` | 100,000 | 361,141 | — | 16 | — | 2.769 | — |
| `__snapshot` | 100,000 | 9,864 | 15,079 | 16 | 16 | 101.375 | 66.319 |
| `__create` | 1,000,000 | 53 | 732 | 16 | 16 | 18,821.019 | 1,365.863 |
| `__read` | 1,000,000 | 9,587,728 | 2,389 | 8,192 | 16 | 0.1043 | 418.538 |
| `__length` | 1,000,000 | 34,106,412 | 18,152,115 | 8,192 | 8,192 | 0.02932 | 0.05509 |
| `__recover` | 1,000,000 | 55 | 2,480 | 16 | 16 | 18,037.288 | 403.250 |
| `__update` | 1,000,000 | 202,552 | 554 | 16 | 16 | 4.937 | 1,806.050 |
| `__delete` | 1,000,000 | 202,020 | 561 | 16 | 16 | 4.950 | 1,783.719 |
| `__merge` | 1,000,000 | 146,113 | 542 | 16 | 16 | 6.844 | 1,846.494 |
| `__acknowledge` | 1,000,000 | 1,544,879 | 2,210,922 | 256 | 256 | 0.6473 | 0.4523 |
| `__garbageCollect` | 1,000,000 | 204,583 | — | 16 | — | 4.888 | — |
| `__snapshot` | 1,000,000 | 352 | 1,657 | 16 | 16 | 2,842.225 | 603.325 |

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
