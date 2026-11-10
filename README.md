[![npm version](https://img.shields.io/npm/v/@sovereignbase/sequencer)](https://www.npmjs.com/package/@sovereignbase/sequencer)
[![JSR](https://jsr.io/badges/@sovereignbase/sequencer)](https://jsr.io/@sovereignbase/sequencer)
[![CI](https://github.com/sovereignbase/sequencer/actions/workflows/ci.yaml/badge.svg?branch=master)](https://github.com/sovereignbase/sequencer/actions/workflows/ci.yaml)
[![codecov](https://codecov.io/gh/sovereignbase/sequencer/branch/master/graph/badge.svg)](https://codecov.io/gh/sovereignbase/sequencer)
[![license](https://img.shields.io/npm/l/@sovereignbase/sequencer)](https://github.com/sovereignbase/sequencer/blob/master/LICENSE)

# Sequencer

Sequencer provides a total order guarantee for distributed editing. It allows independently operating actors to make concurrent edits and eventually converge on the same state without relying on network arrival order or perfectly synchronized clocks.

## Usage

### Simple typed API

```ts
import { Projection } from '@sovereignbase/sequencer'

const projectionA = new Projection<string>(1)

const projectionB = new Projection<string>(2)

const insertDelta = projectionA.insert(['Hello World'], 0)
console.log(projectionA.value(0)) // "Hello World"

projectionB.apply(insertDelta)
console.log(projectionB.value(0)) // "Hello World"

const replaceDelta = projectionA.replace(['Hello Dude'], 0, 0)
console.log(projectionA.value(0)) // "Hello Dude"

const replaceAcknowledgement = projectionB.apply(replaceDelta)
console.log(projectionB.value(0)) // "Hello Dude"

projectionA.apply(replaceAcknowledgement)

const removeDelta = projectionA.remove(0, 0)
console.log(projectionA.value(0)) // undefined

const removeAcknowledgement = projectionB.apply(removeDelta)
console.log(projectionB.value(0)) // undefined

projectionA.apply(removeAcknowledgement)

const serializable = projectionA.sequence()

const acknowledgements = projectionB.merge(serializable)
projectionA.apply(acknowledgements)

projectionA.destroy()
projectionB.destroy()
```

### Tuple mode

Each index represents an independent slot. Adding or removing values
never shifts other values. Empty slots return `undefined`.

Omit `maxLength` to allow dynamic growth.

```ts
const tuple = new Projection<string>(1, undefined, { enabled: 1, maxLength: 4 })
tuple.insert(['hello'], 2)
tuple.replace(['world'], 2, 2)
tuple.remove(2, 2)
```

### See documentation

- [How sequencer works?](INTERNALS.md)
- [Typescript](https://sovereignbase.dev/sequencer/classes/Projection.html)
- [C++](https://sovereignbase.dev/sequencer/c++)

### Errors

| Code                      | Meaning                                                             |
| ------------------------- | ------------------------------------------------------------------- |
| `PROJECTION_DESTROYED`    | An operation was called after the Projection was destroyed.         |
| `NATIVE_OPERATION_FAILED` | The native runtime reported an initialization or operation failure. |
| `STRING_ENCODING_FAILED`  | Snapshot Footage concatenation failed.                              |
| `UNKNOWN_ERROR`           | All other errors.                                                   |

Invalid input to `apply()` or `merge()` returns `undefined` instead of throwing.

## Benchmarks

### Moderate bundle size

| Format   | Raw (KiB) | Minified (KiB) | Minified + gzip (KiB) |
| -------- | --------: | -------------: | --------------------: |
| ESM      |    158.25 |         128.81 |                 45.84 |
| CommonJS |    158.39 |         129.85 |                 45.92 |

Both bundles include WASM. Terser uses three compression passes; gzip uses level 9.

### Average throughput during editing to checkpoint

Arithmetic means of 3 runs, in ops/s, from each phase's start to checkpoint.
Strips contain 1–100 Frames (visible entries). Headers show Strip counts and mean Frame counts.

**↑ Scale up (0 → 25,000 Strips)**

| Method / case  | 1,000 Strips<br>50,871 Frames | 5,000 Strips<br>252,214 Frames | 10,000 Strips<br>504,871 Frames | 15,000 Strips<br>758,280 Frames | 20,000 Strips<br>1,010,749 Frames | 25,000 Strips<br>1,264,003 Frames |
| -------------- | ----------------------------: | -----------------------------: | ------------------------------: | ------------------------------: | --------------------------------: | --------------------------------: |
| apply.random   |                       160,740 |                        115,882 |                         109,517 |                         104,563 |                           100,692 |                            96,366 |
| insert.head    |                     1,137,420 |                        926,867 |                       1,096,745 |                       1,212,964 |                         1,238,858 |                         1,277,709 |
| insert.random  |                       494,421 |                        310,219 |                         254,356 |                         227,129 |                           203,739 |                           190,666 |
| insert.tail    |                     1,343,823 |                      1,117,461 |                       1,279,032 |                       1,301,570 |                         1,345,044 |                         1,321,990 |
| remove.head    |                             — |                              — |                               — |                               — |                                 — |                                 — |
| remove.random  |                       353,930 |                        195,485 |                         151,216 |                         131,421 |                           117,277 |                           106,408 |
| remove.tail    |                             — |                              — |                               — |                               — |                                 — |                                 — |
| replace.head   |                       435,953 |                        451,459 |                         489,066 |                         450,089 |                           467,148 |                           463,894 |
| replace.random |                       290,244 |                        180,321 |                         142,108 |                         123,719 |                           110,994 |                           103,313 |
| replace.tail   |                       400,774 |                        408,248 |                         472,973 |                         495,987 |                           505,162 |                           516,644 |
| value.head     |                     2,388,873 |                      3,279,608 |                       3,624,201 |                       3,773,376 |                         3,896,405 |                         3,956,880 |
| value.random   |                       727,199 |                        294,862 |                         202,668 |                         166,275 |                           144,921 |                           131,271 |
| value.tail     |                     4,934,219 |                      5,206,217 |                       5,151,404 |                       5,190,625 |                         5,127,779 |                         5,122,336 |

**↓ Scale down (25,000 → 0 Strips)**

| Method / case  | 20,000 Strips<br>1,012,742 Frames | 15,000 Strips<br>755,860 Frames | 10,000 Strips<br>504,103 Frames | 5,000 Strips<br>251,203 Frames | 1,000 Strips<br>51,057 Frames | 0 Strips<br>0 Frames |
| -------------- | --------------------------------: | ------------------------------: | ------------------------------: | -----------------------------: | ----------------------------: | -------------------: |
| apply.random   |                           101,324 |                         106,252 |                         110,899 |                        116,238 |                       122,575 |              125,287 |
| insert.head    |                                 — |                               — |                               — |                              — |                             — |                    — |
| insert.random  |                           313,421 |                         327,377 |                         337,216 |                        353,322 |                       370,898 |              379,567 |
| insert.tail    |                                 — |                               — |                               — |                              — |                             — |                    — |
| remove.head    |                           709,246 |                         718,521 |                         695,346 |                        720,829 |                       738,659 |              743,438 |
| remove.random  |                           217,371 |                         226,107 |                         224,864 |                        235,734 |                       246,734 |              252,092 |
| remove.tail    |                           675,541 |                         689,253 |                         683,409 |                        697,138 |                       654,030 |              658,776 |
| replace.head   |                           529,900 |                         513,443 |                         516,213 |                        472,525 |                       483,030 |              486,975 |
| replace.random |                           205,838 |                         199,372 |                         208,835 |                        212,509 |                       220,329 |              224,932 |
| replace.tail   |                           144,972 |                          31,377 |                          31,996 |                         39,194 |                        42,673 |               44,292 |
| value.head     |                         2,769,252 |                       2,826,489 |                       2,862,589 |                      2,890,004 |                     2,926,565 |            2,946,596 |
| value.random   |                           322,133 |                         331,316 |                         340,750 |                        354,781 |                       373,126 |              383,423 |
| value.tail     |                         4,023,696 |                       4,017,942 |                       3,970,629 |                      4,012,936 |                     4,083,707 |            4,131,903 |

### API throughput at checkpoint

Checkpoint calls, in ops/s, averaged across runs.

**↑ Scale up (0 → 25,000 Strips)**

| Method                            | 1,000 Strips<br>50,871 Frames | 5,000 Strips<br>252,214 Frames | 10,000 Strips<br>504,871 Frames | 15,000 Strips<br>758,280 Frames | 20,000 Strips<br>1,010,749 Frames | 25,000 Strips<br>1,264,003 Frames |
| --------------------------------- | ----------------------------: | -----------------------------: | ------------------------------: | ------------------------------: | --------------------------------: | --------------------------------: |
| new Projection(actorID, sequence) |                         4,467 |                          1,214 |                             588 |                             390 |                               268 |                               221 |
| sequence()                        |                           535 |                            108 |                              59 |                              50 |                                33 |                                28 |
| values()                          |                           612 |                            230 |                              79 |                              39 |                                71 |                                24 |

**↓ Scale down (25,000 → 0 Strips)**

| Method                            | 20,000 Strips<br>1,012,742 Frames | 15,000 Strips<br>755,860 Frames | 10,000 Strips<br>504,103 Frames | 5,000 Strips<br>251,203 Frames | 1,000 Strips<br>51,057 Frames | 0 Strips<br>0 Frames |
| --------------------------------- | --------------------------------: | ------------------------------: | ------------------------------: | -----------------------------: | ----------------------------: | -------------------: |
| new Projection(actorID, sequence) |                               258 |                             371 |                             548 |                          1,198 |                         5,410 |               52,921 |
| sequence()                        |                                37 |                              47 |                              61 |                             91 |                           130 |                  670 |
| values()                          |                                78 |                              39 |                             111 |                            116 |                           384 |              136,044 |

### Sequence disk size at checkpoint

Complete exported Sequences, including Footage and acknowledgements. Sizes are in KiB.

**↑ Scale up (0 → 25,000 Strips)**

| Encoding           | 1,000 Strips<br>50,871 Frames | 5,000 Strips<br>252,214 Frames | 10,000 Strips<br>504,871 Frames | 15,000 Strips<br>758,280 Frames | 20,000 Strips<br>1,010,749 Frames | 25,000 Strips<br>1,264,003 Frames |
| ------------------ | ----------------------------: | -----------------------------: | ------------------------------: | ------------------------------: | --------------------------------: | --------------------------------: |
| JSON               |                        277.41 |                       1,620.45 |                        3,267.07 |                        4,928.70 |                          7,103.47 |                          9,263.60 |
| JSON + gzip        |                         14.59 |                          73.42 |                          148.94 |                          225.95 |                            310.82 |                            392.56 |
| MessagePack        |                        164.81 |                         818.92 |                        1,646.03 |                        3,553.60 |                          5,126.26 |                          6,551.31 |
| MessagePack + gzip |                         12.38 |                          61.62 |                          124.80 |                          200.05 |                            263.47 |                            335.08 |

**↓ Scale down (25,000 → 0 Strips)**

| Encoding           | 20,000 Strips<br>1,012,742 Frames | 15,000 Strips<br>755,860 Frames | 10,000 Strips<br>504,103 Frames | 5,000 Strips<br>251,203 Frames | 1,000 Strips<br>51,057 Frames | 0 Strips<br>0 Frames |
| ------------------ | --------------------------------: | ------------------------------: | ------------------------------: | -----------------------------: | ----------------------------: | -------------------: |
| JSON               |                          7,572.94 |                        5,701.19 |                        3,805.46 |                       1,888.50 |                        381.09 |                 0.02 |
| JSON + gzip        |                            326.55 |                          247.02 |                          164.65 |                          79.65 |                         15.97 |                 0.03 |
| MessagePack        |                          5,314.83 |                        3,986.78 |                        2,658.67 |                       1,319.82 |                        266.79 |                 0.01 |
| MessagePack + gzip |                            278.17 |                          209.81 |                          139.95 |                          67.72 |                         13.65 |                 0.03 |

### Memory usage at checkpoint

One instance after checkpoint compaction and recreation: live native allocation plus retained JS array slots, in KiB (1,024 bytes). Unused WASM capacity is excluded.

**↑ Scale up (0 → 25,000 Strips)**

| Measurement            | 1,000 Strips<br>50,871 Frames | 5,000 Strips<br>252,214 Frames | 10,000 Strips<br>504,871 Frames | 15,000 Strips<br>758,280 Frames | 20,000 Strips<br>1,010,749 Frames | 25,000 Strips<br>1,264,003 Frames |
| ---------------------- | ----------------------------: | -----------------------------: | ------------------------------: | ------------------------------: | --------------------------------: | --------------------------------: |
| Estimated memory (KiB) |                        915.04 |                       4,318.67 |                        7,912.60 |                       11,368.22 |                         15,034.19 |                         18,460.98 |

**↓ Scale down (25,000 → 0 Strips)**

| Measurement            | 20,000 Strips<br>1,012,742 Frames | 15,000 Strips<br>755,860 Frames | 10,000 Strips<br>504,103 Frames | 5,000 Strips<br>251,203 Frames | 1,000 Strips<br>51,057 Frames | 0 Strips<br>0 Frames |
| ---------------------- | --------------------------------: | ------------------------------: | ------------------------------: | -----------------------------: | ----------------------------: | -------------------: |
| Estimated memory (KiB) |                         15,322.58 |                       12,255.98 |                        9,031.64 |                       5,894.00 |                      3,102.37 |             1,560.48 |

Measured on Node 24.22.2, V8 13.6.233.17-node.63,
linux x64, AMD EPYC 7763 64-Core Processor.
Peer synchronization, encoding and JS process garbage collection are outside API timings.
[Full lifecycle results](benchmark/.results/lifecycle.md) · [Throughput results](benchmark/.results/throughput.md).

### Tuple mode

Arithmetic means of 3 runs. Ordinary Projection versus a static tuple with maxLength. Both contain the same values; replacements preserve the field count.

#### Throughput (ops/s)

| Indices | Method / case   | Projection | Static tuple | Tuple / Projection |
| ------: | --------------- | ---------: | -----------: | -----------------: |
|       2 | create.sequence |    641,597 |      586,505 |              0.91× |
|       2 | replace.random  |    720,980 |    1,112,010 |              1.54× |
|       2 | apply.replace   |    570,586 |      644,178 |              1.13× |
|       2 | value.random    | 32,630,286 |   51,102,048 |              1.57× |
|       4 | create.sequence |    500,541 |      523,887 |              1.05× |
|       4 | replace.random  |    704,908 |    1,104,899 |              1.57× |
|       4 | apply.replace   |    363,091 |      747,600 |              2.06× |
|       4 | value.random    | 25,542,810 |   50,737,358 |              1.99× |
|       8 | create.sequence |    373,806 |      432,468 |              1.16× |
|       8 | replace.random  |    803,283 |    1,120,062 |              1.39× |
|       8 | apply.replace   |    373,685 |      701,208 |              1.88× |
|       8 | value.random    | 20,021,137 |   49,471,544 |              2.47× |
|     100 | create.sequence |     68,603 |      100,482 |              1.46× |
|     100 | replace.random  |    644,162 |    1,178,702 |              1.83× |
|     100 | apply.replace   |    343,960 |      832,170 |              2.42× |
|     100 | value.random    |  9,361,001 |   51,591,993 |              5.51× |

#### Space (KiB)

| Indices | Mode         | Estimated allocated memory | MessagePack | MessagePack + gzip |
| ------: | ------------ | -------------------------: | ----------: | -----------------: |
|       2 | Projection   |                       0.86 |        0.03 |               0.04 |
|       2 | Static tuple |                       0.85 |        0.04 |               0.05 |
|       4 | Projection   |                       1.54 |        0.06 |               0.05 |
|       4 | Static tuple |                       1.04 |        0.06 |               0.07 |
|       8 | Projection   |                       2.49 |        0.12 |               0.08 |
|       8 | Static tuple |                       1.51 |        0.10 |               0.09 |
|     100 | Projection   |                      23.75 |        0.67 |               0.57 |
|     100 | Static tuple |                      12.18 |        0.51 |               0.35 |

Measured on Node 24.22.2, V8 13.6.233.17-node.63, linux x64, AMD EPYC 7763 64-Core Processor. Fixtures are hydrated compacted snapshots after one replacement per field. Each case warms up for ≥25 ms and measures ≥50 ms of API time; mutation bursts restart after 4,096 replacements. Peer authoring, encoding, result checks, destruction and explicit JS process garbage collection are outside API timings. Memory estimates are the increase in live native allocator bytes plus retained JS array slots for one instance, including exercised runtime buffers. Unused WASM capacity, JS object headers and referenced payload objects are excluded.

[Full tuple results](benchmark/.results/tuple.md).

## Tests

### Behaviour guaranteed by excessive tests

The latest verification passed 272 Vitest tests and 117 compatibility checks.
The configured 100% coverage threshold is met (100% statements, 100% branches, 100% functions, 100% lines).
See the [test suites](test/README.md) and
[automated test report](https://sovereignbase.dev/sequencer/tests/).

### Works everywhere where JavaScript and Wasm works

Runtimes covered by the latest compatibility verification:

- Node.js, ESM: passed
- Node.js, CommonJS: passed
- Deno: passed
- Bun: passed
- Edge Runtime: passed
- Cloudflare Workers through workerd: passed
- Chromium browser windows: passed
- Firefox browser windows: passed
- WebKit browser windows: passed

### Tested realtime and offline text editing behaviour examples

- [Online and offline editors](test/convergence/delivery/offline_realtime_editing/README.md): six editors converge through delayed, reversed and shuffled delivery, including offline changes arriving during online editing.
- [Concurrent replacements](test/convergence/delivery/concurrent_replacement_delivery/README.md): independent replacement histories retain the same surviving content across delivery orders.
- [Restart and redelivery](test/convergence/persistence/restart_redelivery/README.md): stored Sequences preserve visible content through hydration, duplicate delivery and further edits.
- [Peer-to-peer fanout](test/integration/fanout_peer_to_peer/README.md): independently editing browser peers synchronize through BroadcastChannel.
- [WebSocket fanout](test/integration/fanout_websocket/README.md): three browser peers converge through a stateless JSON Gossip relay.

## Credits

This could not have been made without years of work from many great engineers of many great projects, to mention a few:

- [AUTOMERGE](https://github.com/automerge)

- [YJS](https://github.com/yjs)

- [DIAMOND TYPES](https://github.com/josephg/diamond-types)

## License

Apache-2.0
