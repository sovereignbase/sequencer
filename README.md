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
| ESM      |    147.79 |         120.39 |                 43.23 |
| CommonJS |    147.94 |         121.66 |                 43.38 |

Both bundles include WASM. Terser uses three compression passes; gzip uses level 9.

### Average throughput during editing to checkpoint

Arithmetic means of 3 runs, in ops/s, from each phase's start to checkpoint.
Strips contain 1–100 Frames (visible entries). Headers show Strip counts and mean Frame counts.

**↑ Scale up (0 → 25,000 Strips)**

| Method / case  | 1,000 Strips<br>50,871 Frames | 5,000 Strips<br>252,214 Frames | 10,000 Strips<br>504,871 Frames | 15,000 Strips<br>758,280 Frames | 20,000 Strips<br>1,010,749 Frames | 25,000 Strips<br>1,264,003 Frames |
| -------------- | ----------------------------: | -----------------------------: | ------------------------------: | ------------------------------: | --------------------------------: | --------------------------------: |
| apply.random   |                       164,493 |                        109,075 |                          94,913 |                          89,390 |                            83,950 |                            79,400 |
| insert.head    |                     1,215,054 |                      1,163,420 |                       1,252,447 |                       1,303,289 |                         1,282,123 |                         1,279,020 |
| insert.random  |                       491,220 |                        293,132 |                         215,616 |                         189,100 |                           160,711 |                           150,531 |
| insert.tail    |                     1,338,529 |                      1,297,476 |                       1,319,655 |                       1,219,665 |                         1,222,854 |                         1,167,927 |
| remove.head    |                             — |                              — |                               — |                               — |                                 — |                                 — |
| remove.random  |                       322,044 |                        174,150 |                         131,934 |                         112,372 |                            97,425 |                            89,084 |
| remove.tail    |                             — |                              — |                               — |                               — |                                 — |                                 — |
| replace.head   |                       419,402 |                        436,850 |                         445,213 |                         445,004 |                           438,671 |                           423,113 |
| replace.random |                       277,579 |                        161,921 |                         122,662 |                         104,014 |                            91,654 |                            83,569 |
| replace.tail   |                       414,052 |                        390,396 |                         424,140 |                         440,261 |                           439,958 |                           417,819 |
| value.head     |                     2,270,828 |                      2,646,318 |                       2,857,067 |                       2,955,627 |                         2,927,449 |                         2,900,403 |
| value.random   |                       658,524 |                        253,916 |                         174,194 |                         140,411 |                           118,814 |                           106,126 |
| value.tail     |                     4,720,933 |                      4,585,169 |                       4,483,169 |                       4,482,738 |                         4,393,273 |                         4,289,243 |

**↓ Scale down (25,000 → 0 Strips)**

| Method / case  | 20,000 Strips<br>1,012,742 Frames | 15,000 Strips<br>755,860 Frames | 10,000 Strips<br>504,103 Frames | 5,000 Strips<br>251,203 Frames | 1,000 Strips<br>51,057 Frames | 0 Strips<br>0 Frames |
| -------------- | --------------------------------: | ------------------------------: | ------------------------------: | -----------------------------: | ----------------------------: | -------------------: |
| apply.random   |                            79,508 |                          79,931 |                          83,046 |                         83,537 |                        89,107 |               91,258 |
| insert.head    |                                 — |                               — |                               — |                              — |                             — |                    — |
| insert.random  |                           237,882 |                         236,155 |                         245,213 |                        245,219 |                       260,598 |              266,817 |
| insert.tail    |                                 — |                               — |                               — |                              — |                             — |                    — |
| remove.head    |                           513,746 |                         512,013 |                         500,729 |                        467,143 |                       487,719 |              492,578 |
| remove.random  |                           152,940 |                         155,071 |                         163,129 |                        163,416 |                       173,115 |              177,023 |
| remove.tail    |                           491,089 |                         479,606 |                         494,720 |                        488,935 |                       503,029 |              507,357 |
| replace.head   |                           410,604 |                         393,222 |                         401,204 |                        388,179 |                       394,006 |              395,722 |
| replace.random |                           162,541 |                         157,470 |                         164,118 |                        161,985 |                       170,088 |              173,435 |
| replace.tail   |                           207,272 |                          27,391 |                          28,528 |                         32,788 |                        35,308 |               36,559 |
| value.head     |                         1,945,782 |                       1,921,024 |                       1,979,213 |                      1,936,854 |                     1,982,440 |            1,993,096 |
| value.random   |                           256,215 |                         249,865 |                         259,508 |                        259,254 |                       275,839 |              283,453 |
| value.tail     |                         3,494,179 |                       3,439,681 |                       3,477,149 |                      3,417,696 |                     3,470,509 |            3,482,616 |

### API throughput at checkpoint

Checkpoint calls, in ops/s, averaged across runs.

**↑ Scale up (0 → 25,000 Strips)**

| Method                            | 1,000 Strips<br>50,871 Frames | 5,000 Strips<br>252,214 Frames | 10,000 Strips<br>504,871 Frames | 15,000 Strips<br>758,280 Frames | 20,000 Strips<br>1,010,749 Frames | 25,000 Strips<br>1,264,003 Frames |
| --------------------------------- | ----------------------------: | -----------------------------: | ------------------------------: | ------------------------------: | --------------------------------: | --------------------------------: |
| new Projection(actorID, sequence) |                         4,582 |                          1,140 |                             664 |                             450 |                               299 |                               257 |
| sequence()                        |                           453 |                            108 |                              66 |                              64 |                                40 |                                37 |
| values()                          |                         1,026 |                            285 |                             127 |                              88 |                                73 |                                76 |

**↓ Scale down (25,000 → 0 Strips)**

| Method                            | 20,000 Strips<br>1,012,742 Frames | 15,000 Strips<br>755,860 Frames | 10,000 Strips<br>504,103 Frames | 5,000 Strips<br>251,203 Frames | 1,000 Strips<br>51,057 Frames | 0 Strips<br>0 Frames |
| --------------------------------- | --------------------------------: | ------------------------------: | ------------------------------: | -----------------------------: | ----------------------------: | -------------------: |
| new Projection(actorID, sequence) |                               300 |                             391 |                             628 |                          1,241 |                         6,133 |               45,634 |
| sequence()                        |                                49 |                              58 |                              71 |                             74 |                           142 |                  638 |
| values()                          |                                99 |                             125 |                             166 |                            247 |                         1,508 |              125,372 |

### Sequence disk size at checkpoint

Complete exported Sequences, including Footage and acknowledgements. Sizes are in KiB.

**↑ Scale up (0 → 25,000 Strips)**

| Encoding           | 1,000 Strips<br>50,871 Frames | 5,000 Strips<br>252,214 Frames | 10,000 Strips<br>504,871 Frames | 15,000 Strips<br>758,280 Frames | 20,000 Strips<br>1,010,749 Frames | 25,000 Strips<br>1,264,003 Frames |
| ------------------ | ----------------------------: | -----------------------------: | ------------------------------: | ------------------------------: | --------------------------------: | --------------------------------: |
| JSON               |                        277.29 |                       1,619.89 |                        3,264.55 |                        4,931.97 |                          7,102.95 |                          9,255.33 |
| JSON + gzip        |                         14.59 |                          73.42 |                          148.99 |                          225.97 |                            310.72 |                            392.29 |
| MessagePack        |                        164.81 |                         818.92 |                        1,646.03 |                        3,553.60 |                          5,126.26 |                          6,551.31 |
| MessagePack + gzip |                         12.38 |                          61.63 |                          124.81 |                          200.05 |                            263.47 |                            335.11 |

**↓ Scale down (25,000 → 0 Strips)**

| Encoding           | 20,000 Strips<br>1,012,742 Frames | 15,000 Strips<br>755,860 Frames | 10,000 Strips<br>504,103 Frames | 5,000 Strips<br>251,203 Frames | 1,000 Strips<br>51,057 Frames | 0 Strips<br>0 Frames |
| ------------------ | --------------------------------: | ------------------------------: | ------------------------------: | -----------------------------: | ----------------------------: | -------------------: |
| JSON               |                          7,564.27 |                        5,697.73 |                        3,810.27 |                       1,889.96 |                        381.09 |                 0.02 |
| JSON + gzip        |                            326.36 |                          247.07 |                          164.90 |                          79.62 |                         15.97 |                 0.03 |
| MessagePack        |                          5,314.83 |                        3,986.78 |                        2,658.67 |                       1,319.82 |                        266.79 |                 0.01 |
| MessagePack + gzip |                            278.11 |                          209.76 |                          139.95 |                          67.74 |                         13.65 |                 0.03 |

### Memory usage at checkpoint

One instance after checkpoint compaction and recreation: live native allocation plus retained JS array slots, in KiB (1,024 bytes). Unused WASM capacity is excluded.

**↑ Scale up (0 → 25,000 Strips)**

| Measurement            | 1,000 Strips<br>50,871 Frames | 5,000 Strips<br>252,214 Frames | 10,000 Strips<br>504,871 Frames | 15,000 Strips<br>758,280 Frames | 20,000 Strips<br>1,010,749 Frames | 25,000 Strips<br>1,264,003 Frames |
| ---------------------- | ----------------------------: | -----------------------------: | ------------------------------: | ------------------------------: | --------------------------------: | --------------------------------: |
| Estimated memory (KiB) |                        903.19 |                       4,259.97 |                        7,795.29 |                       11,192.31 |                         14,799.68 |                         18,167.88 |

**↓ Scale down (25,000 → 0 Strips)**

| Measurement            | 20,000 Strips<br>1,012,742 Frames | 15,000 Strips<br>755,860 Frames | 10,000 Strips<br>504,103 Frames | 5,000 Strips<br>251,203 Frames | 1,000 Strips<br>51,057 Frames | 0 Strips<br>0 Frames |
| ---------------------- | --------------------------------: | ------------------------------: | ------------------------------: | -----------------------------: | ----------------------------: | -------------------: |
| Estimated memory (KiB) |                         15,088.07 |                       12,080.06 |                        8,914.31 |                       5,835.25 |                      3,090.49 |             1,560.35 |

Measured on Node 24.16.0, V8 13.6.233.17-node.49,
win32 x64, Intel(R) Core(TM) i5-10210U CPU @ 1.60GHz.
Peer synchronization, encoding and JS process garbage collection are outside API timings.
[Full lifecycle results](benchmark/.results/lifecycle.md) · [Throughput results](benchmark/.results/throughput.md).

### Tuple mode

Arithmetic means of 3 runs. Ordinary Projection versus a static tuple with maxLength. Both contain the same values; replacements preserve the field count.

#### Throughput (ops/s)

| Indices | Method / case   | Projection | Static tuple | Tuple / Projection |
| ------: | --------------- | ---------: | -----------: | -----------------: |
|       2 | create.sequence |    816,712 |      730,409 |              0.89× |
|       2 | replace.random  |    856,269 |    1,664,292 |              1.94× |
|       2 | apply.replace   |    607,002 |    1,023,438 |              1.69× |
|       2 | value.random    | 34,919,983 |   61,101,568 |              1.75× |
|       4 | create.sequence |    602,058 |      650,219 |              1.08× |
|       4 | replace.random  |    910,721 |    1,673,871 |              1.84× |
|       4 | apply.replace   |    484,659 |    1,089,633 |              2.25× |
|       4 | value.random    | 26,979,838 |   61,731,540 |              2.29× |
|       8 | create.sequence |    446,165 |      519,604 |              1.16× |
|       8 | replace.random  |    923,100 |    1,570,220 |              1.70× |
|       8 | apply.replace   |    446,581 |    1,103,819 |              2.47× |
|       8 | value.random    | 20,878,901 |   61,047,654 |              2.92× |
|     100 | create.sequence |     83,844 |      104,172 |              1.24× |
|     100 | replace.random  |    806,085 |    1,704,822 |              2.11× |
|     100 | apply.replace   |    393,350 |    1,147,119 |              2.92× |
|     100 | value.random    |  9,737,357 |   62,874,809 |              6.46× |

#### Space (KiB)

| Indices | Mode         | Estimated allocated memory | MessagePack | MessagePack + gzip |
| ------: | ------------ | -------------------------: | ----------: | -----------------: |
|       2 | Projection   |                       0.80 |        0.03 |               0.04 |
|       2 | Static tuple |                       0.80 |        0.04 |               0.05 |
|       4 | Projection   |                       1.46 |        0.06 |               0.05 |
|       4 | Static tuple |                       0.98 |        0.06 |               0.07 |
|       8 | Projection   |                       2.37 |        0.12 |               0.08 |
|       8 | Static tuple |                       1.41 |        0.10 |               0.09 |
|     100 | Projection   |                      22.55 |        0.67 |               0.57 |
|     100 | Static tuple |                      11.37 |        0.51 |               0.35 |

Measured on Node 24.22.2, V8 13.6.233.17-node.63, linux x64, AMD EPYC 7763 64-Core Processor. Fixtures are hydrated compacted snapshots after one replacement per field. Each case warms up for ≥25 ms and measures ≥50 ms of API time; mutation bursts restart after 4,096 replacements. Peer authoring, encoding, result checks, destruction and explicit JS process garbage collection are outside API timings. Memory estimates are the increase in live native allocator bytes plus retained JS array slots for one instance, including exercised runtime buffers. Unused WASM capacity, JS object headers and referenced payload objects are excluded.

[Full tuple results](benchmark/.results/tuple.md).

## Tests

### Behaviour guaranteed by excessive tests

The latest verification passed 276 Vitest tests and 112 compatibility checks.
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
