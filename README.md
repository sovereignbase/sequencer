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
| apply.random   |                       166,459 |                         94,869 |                          86,168 |                          82,842 |                            79,989 |                            76,979 |
| insert.head    |                     1,223,599 |                        854,437 |                         979,219 |                       1,060,480 |                         1,082,869 |                         1,104,429 |
| insert.random  |                       458,343 |                        240,834 |                         192,483 |                         171,244 |                           154,187 |                           144,026 |
| insert.tail    |                     1,388,709 |                        961,934 |                       1,091,272 |                       1,049,623 |                         1,090,038 |                         1,081,671 |
| remove.head    |                             — |                              — |                               — |                               — |                                 — |                                 — |
| remove.random  |                       317,411 |                        147,808 |                         112,865 |                          98,234 |                            88,104 |                            81,900 |
| remove.tail    |                             — |                              — |                               — |                               — |                                 — |                                 — |
| replace.head   |                       389,108 |                        346,636 |                         369,622 |                         383,364 |                           391,184 |                           386,080 |
| replace.random |                       269,419 |                        140,620 |                         108,008 |                          94,205 |                            83,576 |                            77,111 |
| replace.tail   |                       399,882 |                        365,757 |                         402,279 |                         379,606 |                           374,449 |                           387,279 |
| value.head     |                     2,361,517 |                      2,916,368 |                       3,041,807 |                       3,066,282 |                         3,057,992 |                         3,048,630 |
| value.random   |                       647,914 |                        222,967 |                         150,371 |                         124,045 |                           108,447 |                            98,458 |
| value.tail     |                     4,467,995 |                      4,478,785 |                       4,402,979 |                       4,349,197 |                         4,315,799 |                         4,250,755 |

**↓ Scale down (25,000 → 0 Strips)**

| Method / case  | 20,000 Strips<br>1,012,742 Frames | 15,000 Strips<br>755,860 Frames | 10,000 Strips<br>504,103 Frames | 5,000 Strips<br>251,203 Frames | 1,000 Strips<br>51,057 Frames | 0 Strips<br>0 Frames |
| -------------- | --------------------------------: | ------------------------------: | ------------------------------: | -----------------------------: | ----------------------------: | -------------------: |
| apply.random   |                            73,765 |                          79,266 |                          81,865 |                         80,898 |                        86,275 |               88,446 |
| insert.head    |                                 — |                               — |                               — |                              — |                             — |                    — |
| insert.random  |                           207,115 |                         221,444 |                         226,963 |                        237,731 |                       252,555 |              259,320 |
| insert.tail    |                                 — |                               — |                               — |                              — |                             — |                    — |
| remove.head    |                           381,069 |                         419,891 |                         425,150 |                        449,721 |                       469,715 |              475,143 |
| remove.random  |                           144,183 |                         155,427 |                         158,921 |                        166,382 |                       175,388 |              179,486 |
| remove.tail    |                           441,695 |                         470,206 |                         470,494 |                        481,099 |                       493,615 |              497,844 |
| replace.head   |                           385,401 |                         378,760 |                         383,026 |                        386,385 |                       390,698 |              394,219 |
| replace.random |                           134,745 |                         142,738 |                         148,492 |                        154,021 |                       161,765 |              165,447 |
| replace.tail   |                           108,355 |                          39,765 |                          29,683 |                         33,030 |                        35,524 |               36,820 |
| value.head     |                         1,954,756 |                       2,039,944 |                       2,069,423 |                      2,087,061 |                     2,128,368 |            2,142,231 |
| value.random   |                           221,142 |                         234,831 |                         241,485 |                        252,617 |                       268,342 |              276,030 |
| value.tail     |                         3,175,249 |                       3,209,667 |                       3,166,293 |                      3,183,738 |                     3,220,996 |            3,237,648 |

### API throughput at checkpoint

Checkpoint calls, in ops/s, averaged across runs.

**↑ Scale up (0 → 25,000 Strips)**

| Method                            | 1,000 Strips<br>50,871 Frames | 5,000 Strips<br>252,214 Frames | 10,000 Strips<br>504,871 Frames | 15,000 Strips<br>758,280 Frames | 20,000 Strips<br>1,010,749 Frames | 25,000 Strips<br>1,264,003 Frames |
| --------------------------------- | ----------------------------: | -----------------------------: | ------------------------------: | ------------------------------: | --------------------------------: | --------------------------------: |
| new Projection(actorID, sequence) |                         3,899 |                            989 |                             497 |                             341 |                               202 |                               188 |
| sequence()                        |                           467 |                            104 |                              58 |                              42 |                                35 |                                29 |
| values()                          |                           467 |                            213 |                              42 |                              60 |                                39 |                                45 |

**↓ Scale down (25,000 → 0 Strips)**

| Method                            | 20,000 Strips<br>1,012,742 Frames | 15,000 Strips<br>755,860 Frames | 10,000 Strips<br>504,103 Frames | 5,000 Strips<br>251,203 Frames | 1,000 Strips<br>51,057 Frames | 0 Strips<br>0 Frames |
| --------------------------------- | --------------------------------: | ------------------------------: | ------------------------------: | -----------------------------: | ----------------------------: | -------------------: |
| new Projection(actorID, sequence) |                               191 |                             315 |                             467 |                          1,061 |                         5,047 |               49,299 |
| sequence()                        |                                37 |                              42 |                              58 |                             84 |                           125 |                  745 |
| values()                          |                                44 |                              70 |                              70 |                            129 |                           459 |              101,606 |

### Sequence disk size at checkpoint

Complete exported Sequences, including Footage and acknowledgements. Sizes are in KiB.

**↑ Scale up (0 → 25,000 Strips)**

| Encoding           | 1,000 Strips<br>50,871 Frames | 5,000 Strips<br>252,214 Frames | 10,000 Strips<br>504,871 Frames | 15,000 Strips<br>758,280 Frames | 20,000 Strips<br>1,010,749 Frames | 25,000 Strips<br>1,264,003 Frames |
| ------------------ | ----------------------------: | -----------------------------: | ------------------------------: | ------------------------------: | --------------------------------: | --------------------------------: |
| JSON               |                        277.17 |                       1,620.46 |                        3,264.78 |                        4,932.08 |                          7,106.52 |                          9,256.11 |
| JSON + gzip        |                         14.59 |                          73.44 |                          148.93 |                          225.87 |                            310.74 |                            392.18 |
| MessagePack        |                        164.81 |                         818.92 |                        1,644.89 |                        3,552.40 |                          5,125.64 |                          6,550.96 |
| MessagePack + gzip |                         12.38 |                          61.63 |                          124.79 |                          200.08 |                            263.49 |                            335.11 |

**↓ Scale down (25,000 → 0 Strips)**

| Encoding           | 20,000 Strips<br>1,012,742 Frames | 15,000 Strips<br>755,860 Frames | 10,000 Strips<br>504,103 Frames | 5,000 Strips<br>251,203 Frames | 1,000 Strips<br>51,057 Frames | 0 Strips<br>0 Frames |
| ------------------ | --------------------------------: | ------------------------------: | ------------------------------: | -----------------------------: | ----------------------------: | -------------------: |
| JSON               |                          7,566.40 |                        5,696.15 |                        3,809.12 |                       1,889.13 |                        380.78 |                 0.02 |
| JSON + gzip        |                            326.28 |                          246.98 |                          164.81 |                          79.62 |                         15.97 |                 0.03 |
| MessagePack        |                          5,314.65 |                        3,986.69 |                        2,658.64 |                       1,319.82 |                        266.79 |                 0.01 |
| MessagePack + gzip |                            278.15 |                          209.81 |                          139.94 |                          67.73 |                         13.65 |                 0.03 |

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

Measured on Node 24.16.0, V8 13.6.233.17-node.49,
win32 x64, Intel(R) Core(TM) i5-10210U CPU @ 1.60GHz.
Peer synchronization, encoding and JS process garbage collection are outside API timings.
[Full lifecycle results](benchmark/.results/lifecycle.md) · [Throughput results](benchmark/.results/throughput.md).

### Tuple mode

Arithmetic means of 3 runs. Ordinary Projection versus a static tuple with maxLength. Both contain the same values; replacements preserve the field count.

#### Throughput (ops/s)

| Indices | Method / case   | Projection | Static tuple | Tuple / Projection |
| ------: | --------------- | ---------: | -----------: | -----------------: |
|       2 | create.sequence |    624,381 |      579,103 |              0.93× |
|       2 | replace.random  |    704,958 |      941,515 |              1.34× |
|       2 | apply.replace   |    466,619 |      587,984 |              1.26× |
|       2 | value.random    | 23,801,667 |   54,302,540 |              2.28× |
|       4 | create.sequence |    489,816 |      517,863 |              1.06× |
|       4 | replace.random  |    763,402 |    1,223,986 |              1.60× |
|       4 | apply.replace   |    350,401 |      668,482 |              1.91× |
|       4 | value.random    | 17,634,330 |   44,817,433 |              2.54× |
|       8 | create.sequence |    354,773 |      398,491 |              1.12× |
|       8 | replace.random  |    737,792 |    1,111,272 |              1.51× |
|       8 | apply.replace   |    324,842 |      684,244 |              2.11× |
|       8 | value.random    | 15,076,107 |   56,547,654 |              3.75× |
|     100 | create.sequence |     57,402 |       93,790 |              1.63× |
|     100 | replace.random  |    620,928 |    1,151,064 |              1.85× |
|     100 | apply.replace   |    282,753 |      742,871 |              2.63× |
|     100 | value.random    |  7,170,973 |   51,581,079 |              7.19× |

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
