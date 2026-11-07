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
| ESM      |    137.99 |         110.79 |                 39.32 |
| CommonJS |    138.13 |         111.81 |                 39.39 |

Both bundles include WASM. Terser uses three compression passes; gzip uses level 9.

### Average throughput during editing to checkpoint

Arithmetic means of 3 runs, in ops/s, from each phase's start to checkpoint.
Strips contain 1–100 Frames (visible entries). Headers show Strip counts and mean Frame counts.

**↑ Scale up (0 → 25,000 Strips)**

| Method / case  | 1,000 Strips<br>50,871 Frames | 5,000 Strips<br>252,214 Frames | 10,000 Strips<br>504,871 Frames | 15,000 Strips<br>758,280 Frames | 20,000 Strips<br>1,010,749 Frames | 25,000 Strips<br>1,264,003 Frames |
| -------------- | ----------------------------: | -----------------------------: | ------------------------------: | ------------------------------: | --------------------------------: | --------------------------------: |
| apply.random   |                       165,985 |                         85,410 |                          58,933 |                          44,681 |                            35,798 |                            30,185 |
| insert.head    |                     1,171,604 |                        946,193 |                       1,020,287 |                       1,031,067 |                         1,035,075 |                         1,034,712 |
| insert.random  |                       487,083 |                        246,646 |                         156,675 |                         118,184 |                            92,952 |                            77,645 |
| insert.tail    |                     1,327,193 |                      1,075,213 |                       1,171,475 |                       1,189,513 |                         1,188,543 |                         1,185,769 |
| remove.head    |                             — |                              — |                               — |                               — |                                 — |                                 — |
| remove.random  |                       341,100 |                        169,885 |                         112,135 |                          81,775 |                            64,392 |                            53,144 |
| remove.tail    |                             — |                              — |                               — |                               — |                                 — |                                 — |
| replace.head   |                       442,329 |                        401,319 |                         416,673 |                         405,186 |                           396,549 |                           395,301 |
| replace.random |                       292,609 |                        152,200 |                         104,287 |                          77,432 |                            60,847 |                            50,778 |
| replace.tail   |                       408,768 |                        421,877 |                         429,545 |                         439,846 |                           393,472 |                           381,731 |
| value.head     |                     2,322,768 |                      2,995,048 |                       3,213,704 |                       3,361,481 |                         3,471,223 |                         3,509,647 |
| value.random   |                       693,834 |                        243,522 |                         139,137 |                          95,930 |                            73,371 |                            59,718 |
| value.tail     |                     5,034,664 |                      4,926,487 |                       4,812,529 |                       4,733,387 |                         4,693,440 |                         4,631,285 |

**↓ Scale down (25,000 → 0 Strips)**

| Method / case  | 20,000 Strips<br>1,012,742 Frames | 15,000 Strips<br>755,860 Frames | 10,000 Strips<br>504,103 Frames | 5,000 Strips<br>251,203 Frames | 1,000 Strips<br>51,057 Frames | 0 Strips<br>0 Frames |
| -------------- | --------------------------------: | ------------------------------: | ------------------------------: | -----------------------------: | ----------------------------: | -------------------: |
| apply.random   |                            19,113 |                          19,067 |                          18,968 |                         19,255 |                        20,061 |               20,386 |
| insert.head    |                                 — |                               — |                               — |                              — |                             — |                    — |
| insert.random  |                            46,254 |                          46,438 |                          46,789 |                         46,752 |                        49,144 |               48,439 |
| insert.tail    |                                 — |                               — |                               — |                              — |                             — |                    — |
| remove.head    |                           469,567 |                         466,034 |                         464,599 |                        467,277 |                       471,939 |              475,590 |
| remove.random  |                            33,576 |                          34,244 |                          35,114 |                         36,407 |                        38,512 |               39,204 |
| remove.tail    |                           475,971 |                         453,132 |                         460,564 |                        434,895 |                       445,176 |              413,487 |
| replace.head   |                           363,303 |                         324,700 |                         326,893 |                        280,216 |                       285,607 |              222,238 |
| replace.random |                            32,569 |                          33,400 |                          34,262 |                         35,385 |                        37,339 |               37,014 |
| replace.tail   |                           166,392 |                         158,369 |                         153,017 |                        140,597 |                       140,426 |              125,903 |
| value.head     |                         1,679,150 |                       1,613,523 |                       1,582,074 |                      1,577,179 |                     1,621,531 |            1,643,982 |
| value.random   |                            37,178 |                          37,708 |                          38,597 |                         40,069 |                        42,515 |               43,495 |
| value.tail     |                         1,989,669 |                       1,893,127 |                       1,865,699 |                      1,874,690 |                     1,948,079 |            1,982,711 |

### API throughput at checkpoint

Checkpoint calls, in ops/s, averaged across runs.

**↑ Scale up (0 → 25,000 Strips)**

| Method                            | 1,000 Strips<br>50,871 Frames | 5,000 Strips<br>252,214 Frames | 10,000 Strips<br>504,871 Frames | 15,000 Strips<br>758,280 Frames | 20,000 Strips<br>1,010,749 Frames | 25,000 Strips<br>1,264,003 Frames |
| --------------------------------- | ----------------------------: | -----------------------------: | ------------------------------: | ------------------------------: | --------------------------------: | --------------------------------: |
| new Projection(actorID, sequence) |                         4,510 |                          1,017 |                             603 |                             413 |                               289 |                               240 |
| sequence()                        |                           565 |                             89 |                              50 |                              28 |                                20 |                                14 |
| values()                          |                           609 |                            199 |                              56 |                              67 |                                26 |                                46 |

**↓ Scale down (25,000 → 0 Strips)**

| Method                            | 20,000 Strips<br>1,012,742 Frames | 15,000 Strips<br>755,860 Frames | 10,000 Strips<br>504,103 Frames | 5,000 Strips<br>251,203 Frames | 1,000 Strips<br>51,057 Frames | 0 Strips<br>0 Frames |
| --------------------------------- | --------------------------------: | ------------------------------: | ------------------------------: | -----------------------------: | ----------------------------: | -------------------: |
| new Projection(actorID, sequence) |                               284 |                             415 |                             503 |                          1,262 |                         5,291 |               22,337 |
| sequence()                        |                                13 |                              12 |                               9 |                             10 |                             9 |                    8 |
| values()                          |                                47 |                              41 |                              64 |                             88 |                           214 |              107,640 |

### Sequence disk size at checkpoint

Complete exported Sequences, including Footage and acknowledgements. Sizes are in KiB.

**↑ Scale up (0 → 25,000 Strips)**

| Encoding           | 1,000 Strips<br>50,871 Frames | 5,000 Strips<br>252,214 Frames | 10,000 Strips<br>504,871 Frames | 15,000 Strips<br>758,280 Frames | 20,000 Strips<br>1,010,749 Frames | 25,000 Strips<br>1,264,003 Frames |
| ------------------ | ----------------------------: | -----------------------------: | ------------------------------: | ------------------------------: | --------------------------------: | --------------------------------: |
| JSON               |                        277.52 |                       1,623.28 |                        3,264.99 |                        4,905.99 |                          7,047.80 |                          9,170.95 |
| JSON + gzip        |                         14.59 |                          73.83 |                          150.36 |                          226.86 |                            311.16 |                            391.64 |
| MessagePack        |                        164.81 |                         818.88 |                        1,639.69 |                        3,529.41 |                          5,081.04 |                          6,483.22 |
| MessagePack + gzip |                         12.38 |                          61.62 |                          124.91 |                          198.59 |                            263.54 |                            332.77 |

**↓ Scale down (25,000 → 0 Strips)**

| Encoding           | 20,000 Strips<br>1,012,742 Frames | 15,000 Strips<br>755,860 Frames | 10,000 Strips<br>504,103 Frames | 5,000 Strips<br>251,203 Frames | 1,000 Strips<br>51,057 Frames | 0 Strips<br>0 Frames |
| ------------------ | --------------------------------: | ------------------------------: | ------------------------------: | -----------------------------: | ----------------------------: | -------------------: |
| JSON               |                          7,454.66 |                        5,623.90 |                        3,774.14 |                       1,887.68 |                        383.67 |                 0.02 |
| JSON + gzip        |                            323.14 |                          244.37 |                          163.89 |                          80.65 |                         16.35 |                 0.03 |
| MessagePack        |                          5,237.17 |                        3,930.33 |                        2,628.38 |                       1,312.43 |                        266.67 |                 0.01 |
| MessagePack + gzip |                            274.96 |                          207.78 |                          137.38 |                          67.41 |                         13.67 |                 0.03 |

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

Measured on Node 24.22.2, V8 13.6.233.17-node.63,
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
