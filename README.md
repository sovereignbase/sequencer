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
| ESM      |    138.11 |         110.79 |                 39.32 |
| CommonJS |    138.25 |         111.81 |                 39.39 |

Both bundles include WASM. Terser uses three compression passes; gzip uses level 9.

### Average throughput during editing to checkpoint

Arithmetic means of 3 runs, in ops/s, from each phase's start to checkpoint.
Strips contain 1–100 Frames (visible entries). Headers show Strip counts and mean Frame counts.

**↑ Scale up (0 → 25,000 Strips)**

| Method / case  | 1,000 Strips<br>50,871 Frames | 5,000 Strips<br>252,214 Frames | 10,000 Strips<br>504,871 Frames | 15,000 Strips<br>758,280 Frames | 20,000 Strips<br>1,010,749 Frames | 25,000 Strips<br>1,264,003 Frames |
| -------------- | ----------------------------: | -----------------------------: | ------------------------------: | ------------------------------: | --------------------------------: | --------------------------------: |
| apply.random   |                       222,682 |                        111,206 |                          77,568 |                          57,741 |                            45,507 |                            36,966 |
| insert.head    |                     1,581,575 |                      1,325,199 |                       1,431,864 |                       1,450,567 |                         1,455,699 |                         1,457,657 |
| insert.random  |                       685,519 |                        316,295 |                         202,729 |                         147,790 |                           115,036 |                            93,297 |
| insert.tail    |                     1,815,091 |                      1,468,146 |                       1,553,266 |                       1,593,290 |                         1,608,949 |                         1,621,562 |
| remove.head    |                             — |                              — |                               — |                               — |                                 — |                                 — |
| remove.random  |                       484,304 |                        219,574 |                         146,082 |                         104,723 |                            82,426 |                            67,376 |
| remove.tail    |                             — |                              — |                               — |                               — |                                 — |                                 — |
| replace.head   |                       611,028 |                        540,251 |                         496,428 |                         499,323 |                           507,235 |                           513,255 |
| replace.random |                       303,554 |                        188,377 |                         133,134 |                          99,551 |                            78,938 |                            65,044 |
| replace.tail   |                       523,743 |                        470,734 |                         475,726 |                         509,742 |                           440,130 |                           452,522 |
| value.head     |                     3,779,917 |                      4,568,770 |                       4,764,812 |                       4,762,057 |                         4,831,417 |                         4,806,810 |
| value.random   |                       980,378 |                        305,682 |                         176,700 |                         120,564 |                            92,016 |                            73,558 |
| value.tail     |                     6,646,882 |                      6,731,305 |                       7,040,676 |                       6,991,077 |                         6,951,948 |                         6,818,049 |

**↓ Scale down (25,000 → 0 Strips)**

| Method / case  | 20,000 Strips<br>1,012,742 Frames | 15,000 Strips<br>755,860 Frames | 10,000 Strips<br>504,103 Frames | 5,000 Strips<br>251,203 Frames | 1,000 Strips<br>51,057 Frames | 0 Strips<br>0 Frames |
| -------------- | --------------------------------: | ------------------------------: | ------------------------------: | -----------------------------: | ----------------------------: | -------------------: |
| apply.random   |                            22,053 |                          22,624 |                          22,972 |                         23,415 |                        24,092 |               24,476 |
| insert.head    |                                 — |                               — |                               — |                              — |                             — |                    — |
| insert.random  |                            50,837 |                          51,650 |                          52,909 |                         53,725 |                        55,747 |               56,090 |
| insert.tail    |                                 — |                               — |                               — |                              — |                             — |                    — |
| remove.head    |                           753,184 |                         751,969 |                         768,649 |                        708,719 |                       728,771 |              734,721 |
| remove.random  |                            38,936 |                          40,530 |                          42,258 |                         43,884 |                        45,727 |               46,523 |
| remove.tail    |                           732,162 |                         705,439 |                         737,020 |                        752,926 |                       767,228 |              630,944 |
| replace.head   |                           460,282 |                         454,051 |                         458,957 |                        438,621 |                       423,787 |              357,115 |
| replace.random |                            39,017 |                          40,711 |                          42,457 |                         43,888 |                        45,884 |               45,975 |
| replace.tail   |                           255,417 |                         237,228 |                         225,869 |                        219,381 |                       220,517 |              201,118 |
| value.head     |                         2,040,569 |                       1,924,624 |                       1,913,542 |                      1,930,963 |                     1,994,147 |            2,026,925 |
| value.random   |                            42,015 |                          42,863 |                          44,286 |                         45,871 |                        48,040 |               49,284 |
| value.tail     |                         2,385,154 |                       2,266,255 |                       2,273,253 |                      2,331,258 |                     2,440,549 |            2,491,993 |

### API throughput at checkpoint

Checkpoint calls, in ops/s, averaged across runs.

**↑ Scale up (0 → 25,000 Strips)**

| Method                            | 1,000 Strips<br>50,871 Frames | 5,000 Strips<br>252,214 Frames | 10,000 Strips<br>504,871 Frames | 15,000 Strips<br>758,280 Frames | 20,000 Strips<br>1,010,749 Frames | 25,000 Strips<br>1,264,003 Frames |
| --------------------------------- | ----------------------------: | -----------------------------: | ------------------------------: | ------------------------------: | --------------------------------: | --------------------------------: |
| new Projection(actorID, sequence) |                         4,977 |                          1,324 |                             737 |                             511 |                               351 |                               293 |
| sequence()                        |                           660 |                             99 |                              54 |                              35 |                                26 |                                18 |
| values()                          |                           803 |                            235 |                              71 |                              82 |                                35 |                                56 |

**↓ Scale down (25,000 → 0 Strips)**

| Method                            | 20,000 Strips<br>1,012,742 Frames | 15,000 Strips<br>755,860 Frames | 10,000 Strips<br>504,103 Frames | 5,000 Strips<br>251,203 Frames | 1,000 Strips<br>51,057 Frames | 0 Strips<br>0 Frames |
| --------------------------------- | --------------------------------: | ------------------------------: | ------------------------------: | -----------------------------: | ----------------------------: | -------------------: |
| new Projection(actorID, sequence) |                               342 |                             509 |                             637 |                          1,497 |                         5,718 |               21,261 |
| sequence()                        |                                15 |                              14 |                              10 |                             11 |                             9 |                    9 |
| values()                          |                                60 |                              65 |                              63 |                            102 |                           261 |               80,582 |

### Sequence disk size at checkpoint

Complete exported Sequences, including Footage and acknowledgements. Sizes are in KiB.

**↑ Scale up (0 → 25,000 Strips)**

| Encoding           | 1,000 Strips<br>50,871 Frames | 5,000 Strips<br>252,214 Frames | 10,000 Strips<br>504,871 Frames | 15,000 Strips<br>758,280 Frames | 20,000 Strips<br>1,010,749 Frames | 25,000 Strips<br>1,264,003 Frames |
| ------------------ | ----------------------------: | -----------------------------: | ------------------------------: | ------------------------------: | --------------------------------: | --------------------------------: |
| JSON               |                        276.93 |                       1,620.48 |                        3,259.34 |                        4,897.48 |                          7,036.63 |                          9,156.93 |
| JSON + gzip        |                         14.59 |                          73.82 |                          150.33 |                          226.79 |                            310.97 |                            391.44 |
| MessagePack        |                        164.57 |                         817.74 |                        1,637.39 |                        3,525.99 |                          5,076.50 |                          6,477.57 |
| MessagePack + gzip |                         12.38 |                          61.60 |                          124.87 |                          198.52 |                            263.47 |                            332.76 |

**↓ Scale down (25,000 → 0 Strips)**

| Encoding           | 20,000 Strips<br>1,012,742 Frames | 15,000 Strips<br>755,860 Frames | 10,000 Strips<br>504,103 Frames | 5,000 Strips<br>251,203 Frames | 1,000 Strips<br>51,057 Frames | 0 Strips<br>0 Frames |
| ------------------ | --------------------------------: | ------------------------------: | ------------------------------: | -----------------------------: | ----------------------------: | -------------------: |
| JSON               |                          7,440.96 |                        5,613.18 |                        3,766.93 |                       1,884.14 |                        382.94 |                 0.02 |
| JSON + gzip        |                            323.08 |                          244.36 |                          163.85 |                          80.60 |                         16.33 |                 0.03 |
| MessagePack        |                          5,231.72 |                        3,926.05 |                        2,625.50 |                       1,311.01 |                        266.38 |                 0.01 |
| MessagePack + gzip |                            274.91 |                          207.72 |                          137.37 |                          67.38 |                         13.67 |                 0.03 |

### Memory usage at checkpoint

One instance: WASM memory plus retained JS array slots, in KiB (1,024 bytes).

**↑ Scale up (0 → 25,000 Strips)**

| Measurement            | 1,000 Strips<br>50,871 Frames | 5,000 Strips<br>252,214 Frames | 10,000 Strips<br>504,871 Frames | 15,000 Strips<br>758,280 Frames | 20,000 Strips<br>1,010,749 Frames | 25,000 Strips<br>1,264,003 Frames |
| ---------------------- | ----------------------------: | -----------------------------: | ------------------------------: | ------------------------------: | --------------------------------: | --------------------------------: |
| Estimated memory (KiB) |                      5,343.67 |                      25,100.58 |                       50,470.89 |                       82,701.27 |                         98,036.35 |                        153,462.93 |

**↓ Scale down (25,000 → 0 Strips)**

| Measurement            | 20,000 Strips<br>1,012,742 Frames | 15,000 Strips<br>755,860 Frames | 10,000 Strips<br>504,103 Frames | 5,000 Strips<br>251,203 Frames | 1,000 Strips<br>51,057 Frames | 0 Strips<br>0 Frames |
| ---------------------- | --------------------------------: | ------------------------------: | ------------------------------: | -----------------------------: | ----------------------------: | -------------------: |
| Estimated memory (KiB) |                        163,746.93 |                      174,034.00 |                      202,660.72 |                     293,941.85 |                    302,158.29 |           304,203.30 |

Measured on Node 24.21.0, V8 13.6.233.17-node.53,
linux x64, AMD EPYC 9V74 80-Core Processor.
Peer synchronization, encoding and JS process garbage collection are outside API timings.
[Full lifecycle results](benchmark/.results/lifecycle.md) · [Throughput results](benchmark/.results/throughput.md).

## Tests

### Behaviour guaranteed by excessive tests

The latest verification passed 249 Vitest tests and 117 compatibility checks.
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
