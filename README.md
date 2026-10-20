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

Invalid input to `apply()` or `merge()` returns `undefined` instead of throwing.

## Benchmarks

### Moderate bundle size

| Format   | Raw (KiB) | Minified (KiB) | Minified + gzip (KiB) |
| -------- | --------: | -------------: | --------------------: |
| ESM      |    136.19 |         109.61 |                 39.20 |
| CommonJS |    136.33 |         110.32 |                 39.27 |

Both bundles include WASM. Terser uses three compression passes; gzip uses level 9.

### Average throughput during editing to checkpoint

Arithmetic means of 3 runs, in ops/s, from each phase's start to checkpoint.
Strips contain 1–100 Frames (visible entries). Headers show Strip counts and mean Frame counts.

**↑ Scale up (0 → 25,000 Strips)**

| Method / case  | 1,000 Strips<br>50,871 Frames | 5,000 Strips<br>252,214 Frames | 10,000 Strips<br>504,871 Frames | 15,000 Strips<br>758,280 Frames | 20,000 Strips<br>1,010,749 Frames | 25,000 Strips<br>1,264,003 Frames |
| -------------- | ----------------------------: | -----------------------------: | ------------------------------: | ------------------------------: | --------------------------------: | --------------------------------: |
| apply.random   |                       168,473 |                         87,171 |                          60,658 |                          46,603 |                            38,343 |                            32,658 |
| insert.head    |                     1,271,814 |                        999,755 |                       1,074,002 |                       1,093,264 |                         1,106,172 |                         1,105,184 |
| insert.random  |                       475,390 |                        255,768 |                         161,979 |                         124,466 |                           100,709 |                            85,015 |
| insert.tail    |                     1,470,843 |                      1,177,272 |                       1,266,352 |                       1,276,470 |                         1,281,022 |                         1,280,911 |
| remove.head    |                             — |                              — |                               — |                               — |                                 — |                                 — |
| remove.random  |                       358,067 |                        180,092 |                         117,059 |                          86,936 |                            69,330 |                            57,290 |
| remove.tail    |                             — |                              — |                               — |                               — |                                 — |                                 — |
| replace.head   |                       453,369 |                        416,649 |                         429,360 |                         394,513 |                           395,389 |                           403,713 |
| replace.random |                       298,112 |                        160,606 |                         108,525 |                          80,892 |                            65,452 |                            54,680 |
| replace.tail   |                       401,284 |                        449,608 |                         412,634 |                         430,354 |                           408,033 |                           387,953 |
| value.head     |                     2,827,881 |                      3,525,681 |                       3,620,595 |                       3,723,069 |                         3,810,856 |                         3,811,845 |
| value.random   |                       731,172 |                        255,071 |                         143,482 |                         100,113 |                            78,156 |                            63,980 |
| value.tail     |                     5,453,695 |                      5,310,238 |                       5,096,734 |                       5,044,621 |                         5,054,127 |                         4,915,815 |

**↓ Scale down (25,000 → 0 Strips)**

| Method / case  | 20,000 Strips<br>1,012,742 Frames | 15,000 Strips<br>755,860 Frames | 10,000 Strips<br>504,103 Frames | 5,000 Strips<br>251,203 Frames | 1,000 Strips<br>51,057 Frames | 0 Strips<br>0 Frames |
| -------------- | --------------------------------: | ------------------------------: | ------------------------------: | -----------------------------: | ----------------------------: | -------------------: |
| apply.random   |                            21,832 |                          22,291 |                          22,406 |                         22,966 |                        23,864 |               24,211 |
| insert.head    |                                 — |                               — |                               — |                              — |                             — |                    — |
| insert.random  |                            53,637 |                          55,767 |                          57,227 |                         57,796 |                        60,536 |               60,616 |
| insert.tail    |                                 — |                               — |                               — |                              — |                             — |                    — |
| remove.head    |                           493,654 |                         493,034 |                         492,611 |                        492,704 |                       494,704 |              497,520 |
| remove.random  |                            37,466 |                          39,462 |                          41,048 |                         43,073 |                        45,209 |               45,778 |
| remove.tail    |                           491,829 |                         472,405 |                         399,771 |                        416,614 |                       426,344 |              383,461 |
| replace.head   |                           380,504 |                         371,861 |                         365,935 |                        312,468 |                       315,039 |              271,629 |
| replace.random |                            35,794 |                          37,986 |                          39,619 |                         41,464 |                        43,674 |               43,633 |
| replace.tail   |                           198,219 |                         176,520 |                         166,748 |                        150,292 |                       149,123 |              140,224 |
| value.head     |                         1,820,081 |                       1,813,320 |                       1,792,267 |                      1,804,349 |                     1,844,976 |            1,872,844 |
| value.random   |                            41,888 |                          43,912 |                          45,754 |                         48,224 |                        51,108 |               52,192 |
| value.tail     |                         2,154,911 |                       2,130,711 |                       2,112,616 |                      2,133,349 |                     2,207,459 |            2,246,004 |

### API throughput at checkpoint

Checkpoint calls, in ops/s, averaged across runs.

**↑ Scale up (0 → 25,000 Strips)**

| Method                            | 1,000 Strips<br>50,871 Frames | 5,000 Strips<br>252,214 Frames | 10,000 Strips<br>504,871 Frames | 15,000 Strips<br>758,280 Frames | 20,000 Strips<br>1,010,749 Frames | 25,000 Strips<br>1,264,003 Frames |
| --------------------------------- | ----------------------------: | -----------------------------: | ------------------------------: | ------------------------------: | --------------------------------: | --------------------------------: |
| new Projection(actorID, sequence) |                         4,665 |                            968 |                             614 |                             420 |                               291 |                               244 |
| sequence()                        |                           611 |                            102 |                              50 |                              31 |                                21 |                                15 |
| values()                          |                           669 |                            251 |                              84 |                              50 |                                50 |                                31 |

**↓ Scale down (25,000 → 0 Strips)**

| Method                            | 20,000 Strips<br>1,012,742 Frames | 15,000 Strips<br>755,860 Frames | 10,000 Strips<br>504,103 Frames | 5,000 Strips<br>251,203 Frames | 1,000 Strips<br>51,057 Frames | 0 Strips<br>0 Frames |
| --------------------------------- | --------------------------------: | ------------------------------: | ------------------------------: | -----------------------------: | ----------------------------: | -------------------: |
| new Projection(actorID, sequence) |                               276 |                             420 |                             499 |                          1,294 |                         5,450 |               23,249 |
| sequence()                        |                                15 |                              14 |                              10 |                             12 |                            11 |                   10 |
| values()                          |                                46 |                              45 |                              68 |                             96 |                           258 |              150,052 |

### Sequence disk size at checkpoint

Complete exported Sequences, including Footage and acknowledgements. Sizes are in KiB.

**↑ Scale up (0 → 25,000 Strips)**

| Encoding           | 1,000 Strips<br>50,871 Frames | 5,000 Strips<br>252,214 Frames | 10,000 Strips<br>504,871 Frames | 15,000 Strips<br>758,280 Frames | 20,000 Strips<br>1,010,749 Frames | 25,000 Strips<br>1,264,003 Frames |
| ------------------ | ----------------------------: | -----------------------------: | ------------------------------: | ------------------------------: | --------------------------------: | --------------------------------: |
| JSON               |                        277.29 |                       1,622.20 |                        3,262.86 |                        4,902.77 |                          7,043.50 |                          9,165.60 |
| JSON + gzip        |                         14.60 |                          73.83 |                          150.38 |                          226.92 |                            311.16 |                            391.60 |
| MessagePack        |                        164.81 |                         818.88 |                        1,639.69 |                        3,529.41 |                          5,081.04 |                          6,483.22 |
| MessagePack + gzip |                         12.38 |                          61.62 |                          124.91 |                          198.59 |                            263.54 |                            332.77 |

**↓ Scale down (25,000 → 0 Strips)**

| Encoding           | 20,000 Strips<br>1,012,742 Frames | 15,000 Strips<br>755,860 Frames | 10,000 Strips<br>504,103 Frames | 5,000 Strips<br>251,203 Frames | 1,000 Strips<br>51,057 Frames | 0 Strips<br>0 Frames |
| ------------------ | --------------------------------: | ------------------------------: | ------------------------------: | -----------------------------: | ----------------------------: | -------------------: |
| JSON               |                          7,449.19 |                        5,619.45 |                        3,771.17 |                       1,886.19 |                        383.37 |                 0.02 |
| JSON + gzip        |                            323.17 |                          244.42 |                          163.89 |                          80.61 |                         16.33 |                 0.03 |
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

Measured on Node 24.22.0, V8 13.6.233.17-node.57,
linux x64, AMD EPYC 7763 64-Core Processor.
Peer synchronization, encoding and JS process garbage collection are outside API timings.
[Full lifecycle results](benchmark/.results/lifecycle.md) · [Throughput results](benchmark/.results/throughput.md).

## Tests

### Behaviour guaranteed by excessive tests

The latest verification passed 221 Vitest tests and 117 compatibility checks.
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
