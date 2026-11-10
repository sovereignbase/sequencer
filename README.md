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
| ESM      |    156.08 |         127.48 |                 45.19 |
| CommonJS |    156.22 |         128.51 |                 45.27 |

Both bundles include WASM. Terser uses three compression passes; gzip uses level 9.

### Average throughput during editing to checkpoint

Arithmetic means of 3 runs, in ops/s, from each phase's start to checkpoint.
Strips contain 1–100 Frames (visible entries). Headers show Strip counts and mean Frame counts.

**↑ Scale up (0 → 25,000 Strips)**

| Method / case  | 1,000 Strips<br>50,871 Frames | 5,000 Strips<br>252,214 Frames | 10,000 Strips<br>504,871 Frames | 15,000 Strips<br>758,280 Frames | 20,000 Strips<br>1,010,749 Frames | 25,000 Strips<br>1,264,003 Frames |
| -------------- | ----------------------------: | -----------------------------: | ------------------------------: | ------------------------------: | --------------------------------: | --------------------------------: |
| apply.random   |                       167,322 |                        110,202 |                         103,357 |                         100,824 |                            98,347 |                            94,750 |
| insert.head    |                     1,206,744 |                        914,173 |                       1,085,141 |                       1,203,460 |                         1,233,625 |                         1,272,831 |
| insert.random  |                       475,603 |                        302,628 |                         251,496 |                         225,906 |                           203,843 |                           190,844 |
| insert.tail    |                     1,374,250 |                      1,101,821 |                       1,281,716 |                       1,306,819 |                         1,353,339 |                         1,333,895 |
| remove.head    |                             — |                              — |                               — |                               — |                                 — |                                 — |
| remove.random  |                       304,259 |                        189,410 |                         149,715 |                         131,037 |                           116,306 |                           107,135 |
| remove.tail    |                             — |                              — |                               — |                               — |                                 — |                                 — |
| replace.head   |                       437,969 |                        440,688 |                         432,609 |                         457,557 |                           476,277 |                           468,447 |
| replace.random |                       281,754 |                        177,075 |                         137,419 |                         121,646 |                           109,962 |                           102,717 |
| replace.tail   |                       419,184 |                        439,755 |                         487,091 |                         507,280 |                           516,382 |                           504,535 |
| value.head     |                     2,243,505 |                      2,767,945 |                       3,165,718 |                       3,449,652 |                         3,634,268 |                         3,754,537 |
| value.random   |                       694,817 |                        289,500 |                         200,756 |                         165,698 |                           145,315 |                           131,805 |
| value.tail     |                     4,401,554 |                      4,736,895 |                       4,909,714 |                       5,043,147 |                         5,131,843 |                         5,115,893 |

**↓ Scale down (25,000 → 0 Strips)**

| Method / case  | 20,000 Strips<br>1,012,742 Frames | 15,000 Strips<br>755,860 Frames | 10,000 Strips<br>504,103 Frames | 5,000 Strips<br>251,203 Frames | 1,000 Strips<br>51,057 Frames | 0 Strips<br>0 Frames |
| -------------- | --------------------------------: | ------------------------------: | ------------------------------: | -----------------------------: | ----------------------------: | -------------------: |
| apply.random   |                           107,114 |                         109,792 |                         113,140 |                        117,992 |                       123,116 |              125,864 |
| insert.head    |                                 — |                               — |                               — |                              — |                             — |                    — |
| insert.random  |                           315,208 |                         326,632 |                         335,872 |                        350,181 |                       368,038 |              376,274 |
| insert.tail    |                                 — |                               — |                               — |                              — |                             — |                    — |
| remove.head    |                           730,551 |                         740,440 |                         708,189 |                        733,521 |                       751,511 |              754,114 |
| remove.random  |                           223,559 |                         229,368 |                         232,323 |                        229,787 |                       241,277 |              246,401 |
| remove.tail    |                           734,655 |                         735,977 |                         709,308 |                        711,296 |                       722,316 |              724,734 |
| replace.head   |                           531,463 |                         505,608 |                         509,267 |                        511,831 |                       517,431 |              519,484 |
| replace.random |                           204,590 |                         205,104 |                         205,913 |                        212,933 |                       222,954 |              227,192 |
| replace.tail   |                           242,108 |                         148,660 |                          47,926 |                         49,145 |                        51,965 |               53,822 |
| value.head     |                         2,903,700 |                       2,948,058 |                       2,905,054 |                      2,918,409 |                     2,950,206 |            2,957,895 |
| value.random   |                           323,220 |                         330,826 |                         338,997 |                        351,105 |                       368,874 |              378,653 |
| value.tail     |                         4,071,060 |                       3,972,037 |                       3,932,282 |                      3,957,943 |                     4,030,620 |            4,069,526 |

### API throughput at checkpoint

Checkpoint calls, in ops/s, averaged across runs.

**↑ Scale up (0 → 25,000 Strips)**

| Method                            | 1,000 Strips<br>50,871 Frames | 5,000 Strips<br>252,214 Frames | 10,000 Strips<br>504,871 Frames | 15,000 Strips<br>758,280 Frames | 20,000 Strips<br>1,010,749 Frames | 25,000 Strips<br>1,264,003 Frames |
| --------------------------------- | ----------------------------: | -----------------------------: | ------------------------------: | ------------------------------: | --------------------------------: | --------------------------------: |
| new Projection(actorID, sequence) |                         4,245 |                          1,002 |                             594 |                             393 |                               262 |                               217 |
| sequence()                        |                           517 |                            111 |                              66 |                              48 |                                35 |                                27 |
| values()                          |                           623 |                            229 |                              69 |                              52 |                                54 |                                35 |

**↓ Scale down (25,000 → 0 Strips)**

| Method                            | 20,000 Strips<br>1,012,742 Frames | 15,000 Strips<br>755,860 Frames | 10,000 Strips<br>504,103 Frames | 5,000 Strips<br>251,203 Frames | 1,000 Strips<br>51,057 Frames | 0 Strips<br>0 Frames |
| --------------------------------- | --------------------------------: | ------------------------------: | ------------------------------: | -----------------------------: | ----------------------------: | -------------------: |
| new Projection(actorID, sequence) |                               249 |                             363 |                             558 |                          1,201 |                         5,811 |               55,492 |
| sequence()                        |                                38 |                              43 |                              61 |                             94 |                           155 |                  726 |
| values()                          |                                59 |                              56 |                              94 |                            131 |                           535 |              130,586 |

### Sequence disk size at checkpoint

Complete exported Sequences, including Footage and acknowledgements. Sizes are in KiB.

**↑ Scale up (0 → 25,000 Strips)**

| Encoding           | 1,000 Strips<br>50,871 Frames | 5,000 Strips<br>252,214 Frames | 10,000 Strips<br>504,871 Frames | 15,000 Strips<br>758,280 Frames | 20,000 Strips<br>1,010,749 Frames | 25,000 Strips<br>1,264,003 Frames |
| ------------------ | ----------------------------: | -----------------------------: | ------------------------------: | ------------------------------: | --------------------------------: | --------------------------------: |
| JSON               |                        277.53 |                       1,620.47 |                        3,263.82 |                        4,927.67 |                          7,101.78 |                          9,256.67 |
| JSON + gzip        |                         14.59 |                          73.43 |                          148.95 |                          225.71 |                            310.67 |                            392.44 |
| MessagePack        |                        164.81 |                         818.92 |                        1,646.03 |                        3,553.60 |                          5,126.26 |                          6,551.31 |
| MessagePack + gzip |                         12.38 |                          61.63 |                          124.81 |                          200.05 |                            263.47 |                            335.09 |

**↓ Scale down (25,000 → 0 Strips)**

| Encoding           | 20,000 Strips<br>1,012,742 Frames | 15,000 Strips<br>755,860 Frames | 10,000 Strips<br>504,103 Frames | 5,000 Strips<br>251,203 Frames | 1,000 Strips<br>51,057 Frames | 0 Strips<br>0 Frames |
| ------------------ | --------------------------------: | ------------------------------: | ------------------------------: | -----------------------------: | ----------------------------: | -------------------: |
| JSON               |                          7,567.20 |                        5,701.75 |                        3,809.36 |                       1,889.65 |                        381.10 |                 0.02 |
| JSON + gzip        |                            326.59 |                          247.40 |                          164.73 |                          79.62 |                         15.96 |                 0.03 |
| MessagePack        |                          5,314.83 |                        3,986.78 |                        2,657.44 |                       1,319.59 |                        266.66 |                 0.01 |
| MessagePack + gzip |                            278.14 |                          209.80 |                          139.96 |                          67.75 |                         13.65 |                 0.03 |

### Memory usage at checkpoint

One instance after checkpoint compaction and recreation: live native allocation plus retained JS array slots, in KiB (1,024 bytes). Unused WASM capacity is excluded.

**↑ Scale up (0 → 25,000 Strips)**

| Measurement            | 1,000 Strips<br>50,871 Frames | 5,000 Strips<br>252,214 Frames | 10,000 Strips<br>504,871 Frames | 15,000 Strips<br>758,280 Frames | 20,000 Strips<br>1,010,749 Frames | 25,000 Strips<br>1,264,003 Frames |
| ---------------------- | ----------------------------: | -----------------------------: | ------------------------------: | ------------------------------: | --------------------------------: | --------------------------------: |
| Estimated memory (KiB) |                        915.06 |                       4,318.70 |                        7,912.60 |                       11,368.21 |                         15,034.19 |                         18,460.97 |

**↓ Scale down (25,000 → 0 Strips)**

| Measurement            | 20,000 Strips<br>1,012,742 Frames | 15,000 Strips<br>755,860 Frames | 10,000 Strips<br>504,103 Frames | 5,000 Strips<br>251,203 Frames | 1,000 Strips<br>51,057 Frames | 0 Strips<br>0 Frames |
| ---------------------- | --------------------------------: | ------------------------------: | ------------------------------: | -----------------------------: | ----------------------------: | -------------------: |
| Estimated memory (KiB) |                         15,322.57 |                       12,255.96 |                        9,031.62 |                       5,893.97 |                      3,102.34 |             1,560.45 |

Measured on Node 24.22.2, V8 13.6.233.17-node.63,
linux x64, AMD EPYC 7763 64-Core Processor.
Peer synchronization, encoding and JS process garbage collection are outside API timings.
[Full lifecycle results](benchmark/.results/lifecycle.md) · [Throughput results](benchmark/.results/throughput.md).

### Tuple mode

Arithmetic means of 3 runs. Ordinary Projection versus a static tuple with maxLength. Both contain the same values; replacements preserve the field count.

#### Throughput (ops/s)

| Indices | Method / case   | Projection | Static tuple | Tuple / Projection |
| ------: | --------------- | ---------: | -----------: | -----------------: |
|       2 | create.sequence |    642,127 |      590,581 |              0.92× |
|       2 | replace.random  |    741,238 |    1,141,603 |              1.54× |
|       2 | apply.replace   |    513,999 |      685,896 |              1.33× |
|       2 | value.random    | 30,463,204 |   62,779,182 |              2.06× |
|       4 | create.sequence |    509,509 |      529,024 |              1.04× |
|       4 | replace.random  |    740,192 |    1,138,622 |              1.54× |
|       4 | apply.replace   |    408,364 |      749,708 |              1.84× |
|       4 | value.random    | 25,861,124 |   63,562,866 |              2.46× |
|       8 | create.sequence |    373,644 |      424,436 |              1.14× |
|       8 | replace.random  |    776,632 |    1,180,647 |              1.52× |
|       8 | apply.replace   |    360,469 |      756,171 |              2.10× |
|       8 | value.random    | 19,844,641 |   64,191,176 |              3.23× |
|     100 | create.sequence |     68,482 |       92,911 |              1.36× |
|     100 | replace.random  |    671,039 |    1,183,567 |              1.76× |
|     100 | apply.replace   |    336,418 |      772,618 |              2.30× |
|     100 | value.random    |  9,321,999 |   62,781,318 |              6.73× |

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
