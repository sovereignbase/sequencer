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
| apply.random   |                       227,656 |                        147,500 |                         131,029 |                         123,561 |                           117,685 |                           112,924 |
| insert.head    |                     1,671,102 |                      1,099,782 |                       1,198,673 |                       1,299,453 |                         1,323,992 |                         1,368,007 |
| insert.random  |                       572,887 |                        396,778 |                         314,125 |                         279,402 |                           254,038 |                           238,038 |
| insert.tail    |                     1,880,870 |                      1,828,547 |                       1,803,735 |                       1,678,321 |                         1,676,596 |                         1,611,776 |
| remove.head    |                             — |                              — |                               — |                               — |                                 — |                                 — |
| remove.random  |                       411,606 |                        244,950 |                         193,066 |                         165,590 |                           151,783 |                           141,456 |
| remove.tail    |                             — |                              — |                               — |                               — |                                 — |                                 — |
| replace.head   |                       618,045 |                        610,950 |                         568,111 |                         583,731 |                           596,540 |                           578,108 |
| replace.random |                       345,334 |                        212,509 |                         170,850 |                         151,539 |                           138,991 |                           130,405 |
| replace.tail   |                       545,385 |                        576,596 |                         611,995 |                         628,304 |                           592,980 |                           608,568 |
| value.head     |                     4,067,622 |                      4,520,611 |                       4,669,360 |                       4,820,032 |                         4,895,821 |                         4,913,625 |
| value.random   |                       839,937 |                        356,612 |                         251,152 |                         209,537 |                           185,961 |                           169,577 |
| value.tail     |                     6,142,469 |                      6,526,058 |                       6,449,965 |                       6,344,522 |                         6,398,619 |                         6,420,248 |

**↓ Scale down (25,000 → 0 Strips)**

| Method / case  | 20,000 Strips<br>1,012,742 Frames | 15,000 Strips<br>755,860 Frames | 10,000 Strips<br>504,103 Frames | 5,000 Strips<br>251,203 Frames | 1,000 Strips<br>51,057 Frames | 0 Strips<br>0 Frames |
| -------------- | --------------------------------: | ------------------------------: | ------------------------------: | -----------------------------: | ----------------------------: | -------------------: |
| apply.random   |                           104,881 |                         103,988 |                         109,874 |                        115,167 |                       123,013 |              126,137 |
| insert.head    |                                 — |                               — |                               — |                              — |                             — |                    — |
| insert.random  |                           276,606 |                         270,227 |                         286,315 |                        292,731 |                       316,324 |              325,066 |
| insert.tail    |                                 — |                               — |                               — |                              — |                             — |                    — |
| remove.head    |                           922,585 |                         935,090 |                         893,658 |                        915,651 |                       934,785 |              938,432 |
| remove.random  |                           205,633 |                         210,017 |                         217,811 |                        226,345 |                       240,208 |              246,072 |
| remove.tail    |                           784,554 |                         816,922 |                         844,598 |                        740,675 |                       771,256 |              779,418 |
| replace.head   |                           482,774 |                         495,005 |                         480,195 |                        497,729 |                       510,166 |              515,392 |
| replace.random |                           194,574 |                         194,742 |                         203,071 |                        209,329 |                       220,410 |              225,256 |
| replace.tail   |                           134,297 |                          29,344 |                          31,138 |                         32,350 |                        36,532 |               37,947 |
| value.head     |                         2,919,675 |                       3,013,833 |                       3,055,245 |                      3,057,760 |                     3,081,882 |            3,081,745 |
| value.random   |                           290,043 |                         295,497 |                         308,521 |                        321,170 |                       344,164 |              354,278 |
| value.tail     |                         4,244,193 |                       4,289,206 |                       4,175,844 |                      4,101,437 |                     4,147,757 |            4,194,084 |

### API throughput at checkpoint

Checkpoint calls, in ops/s, averaged across runs.

**↑ Scale up (0 → 25,000 Strips)**

| Method                            | 1,000 Strips<br>50,871 Frames | 5,000 Strips<br>252,214 Frames | 10,000 Strips<br>504,871 Frames | 15,000 Strips<br>758,280 Frames | 20,000 Strips<br>1,010,749 Frames | 25,000 Strips<br>1,264,003 Frames |
| --------------------------------- | ----------------------------: | -----------------------------: | ------------------------------: | ------------------------------: | --------------------------------: | --------------------------------: |
| new Projection(actorID, sequence) |                         6,304 |                          1,523 |                             879 |                             581 |                               396 |                               329 |
| sequence()                        |                           499 |                            122 |                              77 |                              63 |                                42 |                                37 |
| values()                          |                           899 |                            250 |                             114 |                              80 |                                75 |                                64 |

**↓ Scale down (25,000 → 0 Strips)**

| Method                            | 20,000 Strips<br>1,012,742 Frames | 15,000 Strips<br>755,860 Frames | 10,000 Strips<br>504,103 Frames | 5,000 Strips<br>251,203 Frames | 1,000 Strips<br>51,057 Frames | 0 Strips<br>0 Frames |
| --------------------------------- | --------------------------------: | ------------------------------: | ------------------------------: | -----------------------------: | ----------------------------: | -------------------: |
| new Projection(actorID, sequence) |                               386 |                             561 |                             833 |                          1,717 |                         6,623 |               49,508 |
| sequence()                        |                                49 |                              60 |                              71 |                             91 |                           128 |                  617 |
| values()                          |                                80 |                             102 |                             141 |                            259 |                         1,151 |              156,232 |

### Sequence disk size at checkpoint

Complete exported Sequences, including Footage and acknowledgements. Sizes are in KiB.

**↑ Scale up (0 → 25,000 Strips)**

| Encoding           | 1,000 Strips<br>50,871 Frames | 5,000 Strips<br>252,214 Frames | 10,000 Strips<br>504,871 Frames | 15,000 Strips<br>758,280 Frames | 20,000 Strips<br>1,010,749 Frames | 25,000 Strips<br>1,264,003 Frames |
| ------------------ | ----------------------------: | -----------------------------: | ------------------------------: | ------------------------------: | --------------------------------: | --------------------------------: |
| JSON               |                        277.52 |                       1,619.85 |                        3,261.03 |                        4,930.24 |                          7,105.12 |                          9,259.93 |
| JSON + gzip        |                         14.59 |                          73.47 |                          148.85 |                          225.92 |                            310.78 |                            392.48 |
| MessagePack        |                        164.81 |                         818.92 |                        1,643.74 |                        3,551.21 |                          5,125.02 |                          6,550.56 |
| MessagePack + gzip |                         12.38 |                          61.63 |                          124.78 |                          200.18 |                            263.52 |                            335.07 |

**↓ Scale down (25,000 → 0 Strips)**

| Encoding           | 20,000 Strips<br>1,012,742 Frames | 15,000 Strips<br>755,860 Frames | 10,000 Strips<br>504,103 Frames | 5,000 Strips<br>251,203 Frames | 1,000 Strips<br>51,057 Frames | 0 Strips<br>0 Frames |
| ------------------ | --------------------------------: | ------------------------------: | ------------------------------: | -----------------------------: | ----------------------------: | -------------------: |
| JSON               |                          7,569.54 |                        5,704.20 |                        3,808.94 |                       1,888.17 |                        381.08 |                 0.02 |
| JSON + gzip        |                            326.44 |                          247.22 |                          164.64 |                          79.67 |                         15.97 |                 0.03 |
| MessagePack        |                          5,314.43 |                        3,986.62 |                        2,658.62 |                       1,319.82 |                        266.79 |                 0.01 |
| MessagePack + gzip |                            278.09 |                          209.74 |                          139.94 |                          67.74 |                         13.65 |                 0.03 |

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

Measured on Node 24.22.2, V8 13.6.233.17-node.63,
linux x64, AMD EPYC 9V74 80-Core Processor.
Peer synchronization, encoding and JS process garbage collection are outside API timings.
[Full lifecycle results](benchmark/.results/lifecycle.md) · [Throughput results](benchmark/.results/throughput.md).

### Tuple mode

Arithmetic means of 3 runs. Ordinary Projection versus a static tuple with maxLength. Both contain the same values; replacements preserve the field count.

#### Throughput (ops/s)

| Indices | Method / case   | Projection | Static tuple | Tuple / Projection |
| ------: | --------------- | ---------: | -----------: | -----------------: |
|       2 | create.sequence |    988,936 |      935,200 |              0.95× |
|       2 | replace.random  |  1,006,509 |    2,361,673 |              2.35× |
|       2 | apply.replace   |    733,725 |    1,377,365 |              1.88× |
|       2 | value.random    | 41,731,045 |   77,229,482 |              1.85× |
|       4 | create.sequence |    758,390 |      813,234 |              1.07× |
|       4 | replace.random  |  1,177,001 |    2,296,066 |              1.95× |
|       4 | apply.replace   |    574,055 |    1,338,316 |              2.33× |
|       4 | value.random    | 33,213,185 |   75,074,993 |              2.26× |
|       8 | create.sequence |    573,428 |      661,632 |              1.15× |
|       8 | replace.random  |  1,139,984 |    2,236,021 |              1.96× |
|       8 | apply.replace   |    512,594 |    1,366,643 |              2.67× |
|       8 | value.random    | 25,782,250 |   75,675,133 |              2.94× |
|     100 | create.sequence |     96,461 |      125,967 |              1.31× |
|     100 | replace.random  |    950,523 |    2,398,159 |              2.52× |
|     100 | apply.replace   |    474,383 |    1,477,357 |              3.11× |
|     100 | value.random    | 11,662,772 |   76,202,273 |              6.53× |

#### Space (KiB)

| Indices | Mode         | Estimated allocated memory | MessagePack | MessagePack + gzip |
| ------: | ------------ | -------------------------: | ----------: | -----------------: |
|       2 | Projection   |                       0.80 |        0.03 |               0.04 |
|       2 | Static tuple |                       0.79 |        0.04 |               0.05 |
|       4 | Projection   |                       1.45 |        0.06 |               0.05 |
|       4 | Static tuple |                       0.96 |        0.06 |               0.07 |
|       8 | Projection   |                       2.36 |        0.12 |               0.08 |
|       8 | Static tuple |                       1.40 |        0.10 |               0.09 |
|     100 | Projection   |                      22.54 |        0.67 |               0.57 |
|     100 | Static tuple |                      11.35 |        0.51 |               0.35 |

Measured on Node 24.22.2, V8 13.6.233.17-node.63, linux x64, AMD EPYC 9V74 80-Core Processor. Fixtures are hydrated compacted snapshots after one replacement per field. Each case warms up for ≥25 ms and measures ≥50 ms of API time; mutation bursts restart after 4,096 replacements. Peer authoring, encoding, result checks, destruction and explicit JS process garbage collection are outside API timings. Memory estimates are the increase in live native allocator bytes plus retained JS array slots for one instance, including exercised runtime buffers. Unused WASM capacity, JS object headers and referenced payload objects are excluded.

[Full tuple results](benchmark/.results/tuple.md).

## Tests

### Behaviour guaranteed by excessive tests

The latest verification passed 276 Vitest tests and 126 compatibility checks.
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
