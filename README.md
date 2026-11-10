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
| apply.random   |                       146,171 |                         91,556 |                          86,197 |                          81,102 |                            78,841 |                            75,980 |
| insert.head    |                       931,005 |                        721,724 |                         851,676 |                         932,058 |                           959,116 |                           981,987 |
| insert.random  |                       426,320 |                        225,812 |                         190,177 |                         169,967 |                           154,152 |                           144,363 |
| insert.tail    |                     1,075,341 |                        856,898 |                       1,009,383 |                       1,011,598 |                         1,047,278 |                           901,897 |
| remove.head    |                             — |                              — |                               — |                               — |                                 — |                                 — |
| remove.random  |                       267,851 |                        146,592 |                         115,686 |                         100,122 |                            89,710 |                            83,039 |
| remove.tail    |                             — |                              — |                               — |                               — |                                 — |                                 — |
| replace.head   |                       366,950 |                        331,482 |                         357,695 |                         360,154 |                           367,036 |                           362,856 |
| replace.random |                       239,481 |                        133,882 |                         107,832 |                          94,214 |                            83,824 |                            78,208 |
| replace.tail   |                       352,941 |                        345,855 |                         379,447 |                         338,848 |                           350,992 |                           362,684 |
| value.head     |                     2,057,699 |                      2,403,342 |                       2,697,626 |                       2,684,639 |                         2,792,485 |                         2,838,319 |
| value.random   |                       583,209 |                        211,569 |                         152,405 |                         125,818 |                           110,572 |                            99,904 |
| value.tail     |                     4,433,598 |                      4,139,676 |                       4,269,335 |                       4,299,398 |                         4,270,988 |                         4,242,599 |

**↓ Scale down (25,000 → 0 Strips)**

| Method / case  | 20,000 Strips<br>1,012,742 Frames | 15,000 Strips<br>755,860 Frames | 10,000 Strips<br>504,103 Frames | 5,000 Strips<br>251,203 Frames | 1,000 Strips<br>51,057 Frames | 0 Strips<br>0 Frames |
| -------------- | --------------------------------: | ------------------------------: | ------------------------------: | -----------------------------: | ----------------------------: | -------------------: |
| apply.random   |                            68,906 |                          66,433 |                          72,770 |                         76,814 |                        81,569 |               83,685 |
| insert.head    |                                 — |                               — |                               — |                              — |                             — |                    — |
| insert.random  |                           206,458 |                         199,772 |                         213,196 |                        223,221 |                       235,176 |              241,009 |
| insert.tail    |                                 — |                               — |                               — |                              — |                             — |                    — |
| remove.head    |                           443,119 |                         428,692 |                         426,929 |                        440,906 |                       454,156 |              459,171 |
| remove.random  |                           148,453 |                         144,541 |                         153,227 |                        158,953 |                       162,798 |              166,654 |
| remove.tail    |                           428,260 |                         418,196 |                         430,602 |                        436,638 |                       447,527 |              452,141 |
| replace.head   |                           289,873 |                         294,082 |                         311,468 |                        307,531 |                       315,019 |              317,844 |
| replace.random |                           140,371 |                         136,294 |                         143,795 |                        148,426 |                       154,816 |              158,105 |
| replace.tail   |                           141,773 |                          34,774 |                          42,853 |                         36,403 |                        40,919 |               42,350 |
| value.head     |                         1,924,168 |                       1,858,854 |                       1,945,882 |                      1,991,125 |                     2,028,731 |            2,046,555 |
| value.random   |                           223,533 |                         220,156 |                         234,372 |                        245,535 |                       259,612 |              267,126 |
| value.tail     |                         3,190,002 |                       3,106,506 |                       3,152,450 |                      3,180,373 |                     3,231,156 |            3,248,100 |

### API throughput at checkpoint

Checkpoint calls, in ops/s, averaged across runs.

**↑ Scale up (0 → 25,000 Strips)**

| Method                            | 1,000 Strips<br>50,871 Frames | 5,000 Strips<br>252,214 Frames | 10,000 Strips<br>504,871 Frames | 15,000 Strips<br>758,280 Frames | 20,000 Strips<br>1,010,749 Frames | 25,000 Strips<br>1,264,003 Frames |
| --------------------------------- | ----------------------------: | -----------------------------: | ------------------------------: | ------------------------------: | --------------------------------: | --------------------------------: |
| new Projection(actorID, sequence) |                         2,899 |                          1,090 |                             525 |                             331 |                               237 |                               164 |
| sequence()                        |                           444 |                            100 |                              64 |                              49 |                                37 |                                27 |
| values()                          |                           518 |                            206 |                              48 |                              66 |                                34 |                                48 |

**↓ Scale down (25,000 → 0 Strips)**

| Method                            | 20,000 Strips<br>1,012,742 Frames | 15,000 Strips<br>755,860 Frames | 10,000 Strips<br>504,103 Frames | 5,000 Strips<br>251,203 Frames | 1,000 Strips<br>51,057 Frames | 0 Strips<br>0 Frames |
| --------------------------------- | --------------------------------: | ------------------------------: | ------------------------------: | -----------------------------: | ----------------------------: | -------------------: |
| new Projection(actorID, sequence) |                               216 |                             322 |                             464 |                          1,074 |                         5,268 |               44,859 |
| sequence()                        |                                39 |                              42 |                              59 |                             78 |                           128 |                  595 |
| values()                          |                                43 |                              67 |                              65 |                            119 |                           366 |               99,516 |

### Sequence disk size at checkpoint

Complete exported Sequences, including Footage and acknowledgements. Sizes are in KiB.

**↑ Scale up (0 → 25,000 Strips)**

| Encoding           | 1,000 Strips<br>50,871 Frames | 5,000 Strips<br>252,214 Frames | 10,000 Strips<br>504,871 Frames | 15,000 Strips<br>758,280 Frames | 20,000 Strips<br>1,010,749 Frames | 25,000 Strips<br>1,264,003 Frames |
| ------------------ | ----------------------------: | -----------------------------: | ------------------------------: | ------------------------------: | --------------------------------: | --------------------------------: |
| JSON               |                        277.30 |                       1,620.42 |                        3,265.52 |                        4,932.17 |                          7,108.60 |                          9,259.61 |
| JSON + gzip        |                         14.59 |                          73.45 |                          148.95 |                          226.02 |                            310.91 |                            392.49 |
| MessagePack        |                        164.81 |                         818.92 |                        1,646.03 |                        3,553.60 |                          5,126.26 |                          6,551.31 |
| MessagePack + gzip |                         12.38 |                          61.63 |                          124.81 |                          200.05 |                            263.43 |                            335.06 |

**↓ Scale down (25,000 → 0 Strips)**

| Encoding           | 20,000 Strips<br>1,012,742 Frames | 15,000 Strips<br>755,860 Frames | 10,000 Strips<br>504,103 Frames | 5,000 Strips<br>251,203 Frames | 1,000 Strips<br>51,057 Frames | 0 Strips<br>0 Frames |
| ------------------ | --------------------------------: | ------------------------------: | ------------------------------: | -----------------------------: | ----------------------------: | -------------------: |
| JSON               |                          7,569.89 |                        5,704.68 |                        3,812.65 |                       1,889.45 |                        381.38 |                 0.02 |
| JSON + gzip        |                            326.57 |                          247.37 |                          164.91 |                          79.62 |                         15.97 |                 0.03 |
| MessagePack        |                          5,314.83 |                        3,986.78 |                        2,658.67 |                       1,319.82 |                        266.79 |                 0.01 |
| MessagePack + gzip |                            278.09 |                          209.77 |                          139.95 |                          67.74 |                         13.66 |                 0.03 |

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

Measured on Node 24.16.0, V8 13.6.233.17-node.49,
win32 x64, Intel(R) Core(TM) i5-10210U CPU @ 1.60GHz.
Peer synchronization, encoding and JS process garbage collection are outside API timings.
[Full lifecycle results](benchmark/.results/lifecycle.md) · [Throughput results](benchmark/.results/throughput.md).

### Tuple mode

Arithmetic means of 3 runs. Ordinary Projection versus a static tuple with maxLength. Both contain the same values; replacements preserve the field count.

#### Throughput (ops/s)

| Indices | Method / case   | Projection | Static tuple | Tuple / Projection |
| ------: | --------------- | ---------: | -----------: | -----------------: |
|       2 | create.sequence |    655,035 |      567,631 |              0.87× |
|       2 | replace.random  |    729,090 |    1,131,956 |              1.55× |
|       2 | apply.replace   |    527,911 |      682,592 |              1.29× |
|       2 | value.random    | 25,741,854 |   40,200,076 |              1.56× |
|       4 | create.sequence |    368,804 |      384,430 |              1.04× |
|       4 | replace.random  |    646,095 |      895,062 |              1.39× |
|       4 | apply.replace   |    309,623 |      545,099 |              1.76× |
|       4 | value.random    | 20,933,492 |   40,262,360 |              1.92× |
|       8 | create.sequence |    321,304 |      377,905 |              1.18× |
|       8 | replace.random  |    674,094 |    1,033,396 |              1.53× |
|       8 | apply.replace   |    290,298 |      422,935 |              1.46× |
|       8 | value.random    | 14,186,324 |   35,039,107 |              2.47× |
|     100 | create.sequence |     51,410 |       81,770 |              1.59× |
|     100 | replace.random  |    495,750 |    1,064,078 |              2.15× |
|     100 | apply.replace   |    230,210 |      567,547 |              2.47× |
|     100 | value.random    |  7,987,133 |   44,342,892 |              5.55× |

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

Measured on Node 24.16.0, V8 13.6.233.17-node.49, win32 x64, Intel(R) Core(TM) i5-10210U CPU @ 1.60GHz. Fixtures are hydrated compacted snapshots after one replacement per field. Each case warms up for ≥25 ms and measures ≥50 ms of API time; mutation bursts restart after 4,096 replacements. Peer authoring, encoding, result checks, destruction and explicit JS process garbage collection are outside API timings. Memory estimates are the increase in live native allocator bytes plus retained JS array slots for one instance, including exercised runtime buffers. Unused WASM capacity, JS object headers and referenced payload objects are excluded.

[Full tuple results](benchmark/.results/tuple.md).

## Tests

### Behaviour guaranteed by excessive tests

The latest verification passed 272 Vitest tests and 104 compatibility checks.
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
- Firefox browser windows: skipped
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
