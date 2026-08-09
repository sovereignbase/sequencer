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

| function           | Sequence length | Sequencer ops/sec | Diamond Types ops/sec | Sequencer calls | Diamond Types calls | Sequencer avg µs/op | Diamond Types avg µs/op |
| ------------------ | --------------: | ----------------: | --------------------: | --------------: | ------------------: | ------------------: | ----------------------: |
| `__create`         |             100 |            53,359 |                31,036 |             256 |                 256 |              18.741 |                  32.221 |
| `__read`           |             100 |        10,493,179 |               213,995 |         131,072 |                 256 |             0.09530 |                   4.673 |
| `__length`         |             100 |        36,429,872 |            20,699,648 |         131,072 |             131,072 |             0.02745 |                 0.04831 |
| `__recover`        |             100 |           392,927 |               222,668 |             256 |                 256 |               2.545 |                   4.491 |
| `__update`         |             100 |           163,532 |               309,406 |             256 |                 256 |               6.115 |                   3.232 |
| `__delete`         |             100 |           259,538 |               290,698 |             256 |                 256 |               3.853 |                   3.440 |
| `__merge`          |             100 |           116,904 |                56,117 |             256 |                 256 |               8.554 |                  17.820 |
| `__acknowledge`    |             100 |         6,729,475 |             1,395,089 |           4,096 |               4,096 |              0.1486 |                  0.7168 |
| `__garbageCollect` |             100 |           270,856 |                     — |             256 |                   — |               3.692 |                       — |
| `__snapshot`       |             100 |           255,558 |                73,779 |             256 |                 256 |               3.913 |                  13.554 |
| `__create`         |           1,000 |            79,853 |                39,769 |             128 |                 128 |              12.523 |                  25.145 |
| `__read`           |           1,000 |         9,861,933 |               434,972 |          65,536 |                 128 |              0.1014 |                   2.299 |
| `__length`         |           1,000 |        19,988,007 |            26,567,481 |          65,536 |              65,536 |             0.05003 |                 0.03764 |
| `__recover`        |           1,000 |           164,663 |               302,755 |             128 |                 128 |               6.073 |                   3.303 |
| `__update`         |           1,000 |           111,919 |                48,940 |             128 |                 128 |               8.935 |                  20.433 |
| `__delete`         |           1,000 |           302,663 |                93,853 |             128 |                 128 |               3.304 |                  10.655 |
| `__merge`          |           1,000 |           252,589 |                37,518 |             128 |                 128 |               3.959 |                  26.654 |
| `__acknowledge`    |           1,000 |         2,948,983 |             1,162,520 |           2,048 |               2,048 |              0.3391 |                  0.8602 |
| `__garbageCollect` |           1,000 |           527,704 |                     — |             128 |                   — |               1.895 |                       — |
| `__snapshot`       |           1,000 |           156,715 |                54,864 |             128 |                 128 |               6.381 |                  18.227 |
| `__create`         |          10,000 |             2,573 |                17,225 |              64 |                  64 |             388.702 |                  58.055 |
| `__read`           |          10,000 |         5,020,080 |               103,040 |          32,768 |                  64 |              0.1992 |                   9.705 |
| `__length`         |          10,000 |        16,350,556 |            12,603,983 |          32,768 |              32,768 |             0.06116 |                 0.07934 |
| `__recover`        |          10,000 |            16,344 |               106,826 |              64 |                  64 |              61.183 |                   9.361 |
| `__update`         |          10,000 |            38,438 |                 7,982 |              64 |                  64 |              26.016 |                 125.289 |
| `__delete`         |          10,000 |           172,891 |                13,819 |              64 |                  64 |               5.784 |                  72.364 |
| `__merge`          |          10,000 |            46,100 |                10,454 |              64 |                  64 |              21.692 |                  95.656 |
| `__acknowledge`    |          10,000 |         3,225,806 |               968,054 |           1,024 |               1,024 |              0.3100 |                   1.033 |
| `__garbageCollect` |          10,000 |            46,893 |                     — |              64 |                   — |              21.325 |                       — |
| `__snapshot`       |          10,000 |            43,301 |                22,213 |              64 |                  64 |              23.094 |                  45.019 |
| `__create`         |         100,000 |               142 |                 1,438 |              16 |                  16 |           7,056.825 |                 695.625 |
| `__read`           |         100,000 |         4,083,299 |                10,018 |           8,192 |                  16 |              0.2449 |                  99.819 |
| `__length`         |         100,000 |        12,274,457 |             6,877,579 |           8,192 |               8,192 |             0.08147 |                  0.1454 |
| `__recover`        |         100,000 |               878 |                17,337 |              16 |                  16 |           1,138.744 |                  57.681 |
| `__update`         |         100,000 |            98,580 |                 1,812 |              16 |                  16 |              10.144 |                 551.969 |
| `__delete`         |         100,000 |           190,694 |                 1,930 |              16 |                  16 |               5.244 |                 518.012 |
| `__merge`          |         100,000 |            89,485 |                 1,372 |              16 |                  16 |              11.175 |                 728.825 |
| `__acknowledge`    |         100,000 |         4,182,350 |             1,050,089 |             256 |                 256 |              0.2391 |                  0.9523 |
| `__garbageCollect` |         100,000 |           320,616 |                     — |              16 |                   — |               3.119 |                       — |
| `__snapshot`       |         100,000 |             1,559 |                 4,558 |              16 |                  16 |             641.431 |                 219.381 |
| `__create`         |       1,000,000 |                18 |                   267 |              16 |                  16 |          56,965.988 |               3,747.700 |
| `__read`           |       1,000,000 |         2,768,549 |                   754 |           8,192 |                  16 |              0.3612 |               1,327.000 |
| `__length`         |       1,000,000 |        22,381,379 |             8,496,177 |           8,192 |               8,192 |             0.04468 |                  0.1177 |
| `__recover`        |       1,000,000 |                58 |                   897 |              16 |                  16 |          17,147.762 |               1,115.063 |
| `__update`         |       1,000,000 |            99,443 |                   246 |              16 |                  16 |              10.056 |               4,072.900 |
| `__delete`         |       1,000,000 |           108,401 |                   269 |              16 |                  16 |               9.225 |               3,723.856 |
| `__merge`          |       1,000,000 |            59,018 |                   262 |              16 |                  16 |              16.944 |               3,811.575 |
| `__acknowledge`    |       1,000,000 |         6,385,696 |             1,419,849 |             256 |                 256 |              0.1566 |                  0.7043 |
| `__garbageCollect` |       1,000,000 |           235,627 |                     — |              16 |                   — |               4.244 |                       — |
| `__snapshot`       |       1,000,000 |               156 |                   912 |              16 |                  16 |           6,398.656 |               1,096.031 |

## Memory effiency

|heap usage .... what ever is professional/smart

### Small bundle size

| format   |     raw | minified | minified + gzip |
| -------- | ------: | -------: | --------------: |
| ESM      | 91.3 kB |  53.8 kB |         19.0 kB |
| CommonJS | 91.6 kB |  56.3 kB |         19.3 kB |

### Compact data model

Average delta size and average replica/snapshot size

| Delta workload                             | average bytes per operation | MessagePack | MessagePack + gzip | gzip reduction |
| ------------------------------------------ | --------------------------: | ----------: | -----------------: | -------------: |
| 1,000 one-frame updates                    |                      39.6 B |     39.6 kB |             7.8 kB |          80.2% |
| 1,000 one-frame masks                      |                      36.0 B |     36.0 kB |             5.1 kB |          85.9% |
| Snapshot containing 1,000 one-frame strips |                      39.6 B |     39.6 kB |             7.8 kB |          80.2% |

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
