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
| apply.random   |                       153,830 |                         84,025 |                          60,823 |                          47,305 |                            38,999 |                            32,698 |
| insert.head    |                     1,134,089 |                        963,049 |                       1,078,178 |                       1,117,017 |                         1,144,493 |                         1,165,255 |
| insert.random  |                       390,528 |                        228,632 |                         158,115 |                         123,005 |                            99,713 |                            83,118 |
| insert.tail    |                     1,293,840 |                      1,101,202 |                       1,222,363 |                       1,285,740 |                         1,321,027 |                         1,343,620 |
| remove.head    |                             — |                              — |                               — |                               — |                                 — |                                 — |
| remove.random  |                       329,331 |                        163,720 |                         111,771 |                          84,847 |                            68,204 |                            56,515 |
| remove.tail    |                             — |                              — |                               — |                               — |                                 — |                                 — |
| replace.head   |                       408,137 |                        387,533 |                         415,166 |                         420,351 |                           431,010 |                           439,200 |
| replace.random |                       274,988 |                        151,488 |                         102,869 |                          79,116 |                            63,882 |                            53,639 |
| replace.tail   |                       365,073 |                        391,557 |                         435,546 |                         437,706 |                           426,550 |                           419,668 |
| value.head     |                     1,754,259 |                      2,585,418 |                       2,935,897 |                       3,217,212 |                         3,414,780 |                         3,532,529 |
| value.random   |                       686,206 |                        229,530 |                         136,727 |                          97,287 |                            76,326 |                            62,100 |
| value.tail     |                     4,365,422 |                      4,717,266 |                       4,544,492 |                       4,639,252 |                         4,736,795 |                         4,784,282 |

**↓ Scale down (25,000 → 0 Strips)**

| Method / case  | 20,000 Strips<br>1,012,742 Frames | 15,000 Strips<br>755,860 Frames | 10,000 Strips<br>504,103 Frames | 5,000 Strips<br>251,203 Frames | 1,000 Strips<br>51,057 Frames | 0 Strips<br>0 Frames |
| -------------- | --------------------------------: | ------------------------------: | ------------------------------: | -----------------------------: | ----------------------------: | -------------------: |
| apply.random   |                            21,344 |                          21,982 |                          22,460 |                         23,045 |                        24,027 |               24,437 |
| insert.head    |                                 — |                               — |                               — |                              — |                             — |                    — |
| insert.random  |                            51,360 |                          53,360 |                          55,663 |                         57,233 |                        60,213 |               60,629 |
| insert.tail    |                                 — |                               — |                               — |                              — |                             — |                    — |
| remove.head    |                           590,188 |                         489,122 |                         515,830 |                        531,931 |                       545,125 |              549,615 |
| remove.random  |                            36,726 |                          38,814 |                          41,036 |                         42,983 |                        45,725 |               46,450 |
| remove.tail    |                           580,348 |                         558,971 |                         576,109 |                        584,313 |                       592,450 |              511,784 |
| replace.head   |                           408,878 |                         367,143 |                         375,150 |                        360,329 |                       362,580 |              305,194 |
| replace.random |                            36,088 |                          38,150 |                          40,038 |                         41,913 |                        44,336 |               44,440 |
| replace.tail   |                           202,070 |                         193,244 |                         185,447 |                        177,076 |                       177,953 |              166,386 |
| value.head     |                         2,112,462 |                       2,006,724 |                       1,967,759 |                      1,951,887 |                     1,996,830 |            2,025,945 |
| value.random   |                            39,684 |                          41,581 |                          43,908 |                         46,295 |                        49,267 |               50,475 |
| value.tail     |                         2,374,148 |                       2,263,305 |                       2,256,668 |                      2,275,349 |                     2,357,427 |            2,396,906 |

### API throughput at checkpoint

Checkpoint calls, in ops/s, averaged across runs.

**↑ Scale up (0 → 25,000 Strips)**

| Method                            | 1,000 Strips<br>50,871 Frames | 5,000 Strips<br>252,214 Frames | 10,000 Strips<br>504,871 Frames | 15,000 Strips<br>758,280 Frames | 20,000 Strips<br>1,010,749 Frames | 25,000 Strips<br>1,264,003 Frames |
| --------------------------------- | ----------------------------: | -----------------------------: | ------------------------------: | ------------------------------: | --------------------------------: | --------------------------------: |
| new Projection(actorID, sequence) |                         4,478 |                            937 |                             610 |                             420 |                               290 |                               244 |
| sequence()                        |                           526 |                             96 |                              54 |                              33 |                                25 |                                19 |
| values()                          |                           605 |                            211 |                              69 |                              63 |                                41 |                                44 |

**↓ Scale down (25,000 → 0 Strips)**

| Method                            | 20,000 Strips<br>1,012,742 Frames | 15,000 Strips<br>755,860 Frames | 10,000 Strips<br>504,103 Frames | 5,000 Strips<br>251,203 Frames | 1,000 Strips<br>51,057 Frames | 0 Strips<br>0 Frames |
| --------------------------------- | --------------------------------: | ------------------------------: | ------------------------------: | -----------------------------: | ----------------------------: | -------------------: |
| new Projection(actorID, sequence) |                               283 |                             417 |                             499 |                          1,272 |                         5,420 |               21,690 |
| sequence()                        |                                17 |                              14 |                              10 |                             12 |                            11 |                    9 |
| values()                          |                                62 |                              46 |                              72 |                             93 |                           206 |              115,260 |

### Sequence disk size at checkpoint

Complete exported Sequences, including Footage and acknowledgements. Sizes are in KiB.

**↑ Scale up (0 → 25,000 Strips)**

| Encoding           | 1,000 Strips<br>50,871 Frames | 5,000 Strips<br>252,214 Frames | 10,000 Strips<br>504,871 Frames | 15,000 Strips<br>758,280 Frames | 20,000 Strips<br>1,010,749 Frames | 25,000 Strips<br>1,264,003 Frames |
| ------------------ | ----------------------------: | -----------------------------: | ------------------------------: | ------------------------------: | --------------------------------: | --------------------------------: |
| JSON               |                        277.53 |                       1,623.31 |                        3,265.06 |                        4,906.05 |                          7,047.97 |                          9,171.10 |
| JSON + gzip        |                         14.60 |                          73.84 |                          150.42 |                          226.93 |                            311.21 |                            391.69 |
| MessagePack        |                        164.81 |                         818.88 |                        1,639.69 |                        3,529.41 |                          5,081.04 |                          6,483.22 |
| MessagePack + gzip |                         12.38 |                          61.61 |                          124.90 |                          198.57 |                            263.52 |                            332.75 |

**↓ Scale down (25,000 → 0 Strips)**

| Encoding           | 20,000 Strips<br>1,012,742 Frames | 15,000 Strips<br>755,860 Frames | 10,000 Strips<br>504,103 Frames | 5,000 Strips<br>251,203 Frames | 1,000 Strips<br>51,057 Frames | 0 Strips<br>0 Frames |
| ------------------ | --------------------------------: | ------------------------------: | ------------------------------: | -----------------------------: | ----------------------------: | -------------------: |
| JSON               |                          7,454.58 |                        5,623.78 |                        3,774.02 |                       1,887.64 |                        383.65 |                 0.02 |
| JSON + gzip        |                            323.18 |                          244.43 |                          163.92 |                          80.67 |                         16.35 |                 0.03 |
| MessagePack        |                          5,237.17 |                        3,930.33 |                        2,628.38 |                       1,312.43 |                        266.67 |                 0.01 |
| MessagePack + gzip |                            274.93 |                          207.75 |                          137.37 |                          67.40 |                         13.67 |                 0.03 |

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
linux x64, AMD EPYC 7763 64-Core Processor.
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
