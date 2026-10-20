[![npm version](https://img.shields.io/npm/v/@sovereignbase/sequencer)](https://www.npmjs.com/package/@sovereignbase/sequencer)
[![JSR](https://jsr.io/badges/@sovereignbase/sequencer)](https://jsr.io/@sovereignbase/sequencer)
[![CI](https://github.com/sovereignbase/sequencer/actions/workflows/ci.yaml/badge.svg?branch=master)](https://github.com/sovereignbase/sequencer/actions/workflows/ci.yaml)
[![codecov](https://codecov.io/gh/sovereignbase/sequencer/branch/master/graph/badge.svg)](https://codecov.io/gh/sovereignbase/sequencer)
[![license](https://img.shields.io/npm/l/@sovereignbase/sequencer)](https://github.com/sovereignbase/sequencer/blob/master/LICENSE)

# Sequencer

Sequencer provides a deterministic total ordering for distributed data. It allows independently operating actors to make concurrent changes and eventually converge on the same state without relying on network arrival order or perfectly synchronized clocks.

## Usage

### Simple typed API

```ts
import { Projection } from '@sovereignbase/sequencer'

const projection = new Projection<string>(1)

const gossip0 = projection.insert(['Hello World'], 0)
console.log(projection.value(0)) // "Hello World"
const gossip1 = projection.replace(['Hello Dude'], 0, 0)
console.log(projection.value(0)) // "Hello Dude"
const gossip2 = projection.remove(0, 0)
console.log(projection.value(0)) // undefined

projection.destroy()
```

### See documentation

- [How sequencer works?](INTERNALS.md)
- [Typescript](https://sovereignbase.dev/sequencer/classes/Projection.html)
- [C++](https://sovereignbase.dev/sequencer/c++)

Register active Actors, including offline Actors, before removals. When every
active Actor acknowledges the same complete removal Session frontier,
`sequence()` omits its masks and deleted Footage. Actor membership remains.
See the [compaction contract](INTERNALS.md#compaction).

### Errors

Library-reported failures throw `SequencerError`, with a stable `SequencerErrorCode`
and a message prefixed with `{@sovereignbase/sequencer}`. Both are exported from
the package. The constructor accepts standard `ErrorOptions`, including `cause`.

| Code                      | Meaning                                                             |
| ------------------------- | ------------------------------------------------------------------- |
| `PROJECTION_DESTROYED`    | An operation was called after the Projection was destroyed.         |
| `NATIVE_OPERATION_FAILED` | The native runtime reported an initialization or operation failure. |

Invalid Gossip or Sequence input to `apply()` or `merge()` returns `undefined`.
Platform errors retain their original types.

## Benchmarks

### Moderate bundle size

| Format   | Raw (KiB) | Minified (KiB) | Minified + gzip (KiB) |
| -------- | --------: | -------------: | --------------------: |
| ESM      |    135.00 |         109.15 |                 39.03 |
| CommonJS |    135.14 |         109.84 |                 39.11 |

Both bundles include WASM. Terser uses three compression passes; gzip uses level 9.

### Average throughput during editing to checkpoint

Arithmetic means of 3 runs, in ops/s, from each phase's start to checkpoint.
Strips contain 1–100 Frames (visible entries). Headers show Strip counts and mean Frame counts.

**↑ Scale up (0 → 25,000 Strips)**

| Method / case  | 1,000 Strips<br>50,871 Frames | 5,000 Strips<br>252,214 Frames | 10,000 Strips<br>504,871 Frames | 15,000 Strips<br>758,280 Frames | 20,000 Strips<br>1,010,749 Frames | 25,000 Strips<br>1,264,003 Frames |
| -------------- | ----------------------------: | -----------------------------: | ------------------------------: | ------------------------------: | --------------------------------: | --------------------------------: |
| apply.random   |                       172,644 |                         86,112 |                          63,466 |                          50,118 |                            41,757 |                            35,575 |
| insert.head    |                     1,225,863 |                      1,041,158 |                       1,166,726 |                       1,039,508 |                           953,026 |                         1,004,119 |
| insert.random  |                       509,599 |                        248,202 |                         167,286 |                         131,087 |                           107,863 |                            90,841 |
| insert.tail    |                     1,397,746 |                      1,179,580 |                       1,322,784 |                       1,378,229 |                         1,412,952 |                         1,435,310 |
| remove.head    |                             — |                              — |                               — |                               — |                                 — |                                 — |
| remove.random  |                       335,709 |                        171,669 |                         115,989 |                          88,861 |                            72,087 |                            60,207 |
| remove.tail    |                             — |                              — |                               — |                               — |                                 — |                                 — |
| replace.head   |                       467,267 |                        425,645 |                         446,242 |                         428,544 |                           445,058 |                           454,149 |
| replace.random |                       293,905 |                        161,657 |                         110,607 |                          84,301 |                            68,205 |                            57,510 |
| replace.tail   |                       403,030 |                        462,289 |                         487,634 |                         499,137 |                           475,489 |                           470,351 |
| value.head     |                     2,672,941 |                      3,380,739 |                       3,537,246 |                       3,725,826 |                         3,923,044 |                         3,976,611 |
| value.random   |                       757,673 |                        241,201 |                         142,486 |                         102,163 |                            80,991 |                            66,456 |
| value.tail     |                     5,479,404 |                      5,529,615 |                       5,330,921 |                       5,270,166 |                         5,291,738 |                         5,222,839 |

**↓ Scale down (25,000 → 0 Strips)**

| Method / case  | 20,000 Strips<br>1,012,742 Frames | 15,000 Strips<br>755,860 Frames | 10,000 Strips<br>504,103 Frames | 5,000 Strips<br>251,203 Frames | 1,000 Strips<br>51,057 Frames | 0 Strips<br>0 Frames |
| -------------- | --------------------------------: | ------------------------------: | ------------------------------: | -----------------------------: | ----------------------------: | -------------------: |
| apply.random   |                            25,115 |                          26,159 |                          26,764 |                         27,865 |                        29,164 |               29,591 |
| insert.head    |                                 — |                               — |                               — |                              — |                             — |                    — |
| insert.random  |                            60,860 |                          65,074 |                          68,298 |                         70,108 |                        74,084 |               74,132 |
| insert.tail    |                                 — |                               — |                               — |                              — |                             — |                    — |
| remove.head    |                           475,163 |                         507,966 |                         529,655 |                        543,387 |                       555,661 |              559,501 |
| remove.random  |                            41,603 |                          44,884 |                          47,571 |                         50,782 |                        53,571 |               54,263 |
| remove.tail    |                           592,586 |                         586,490 |                         593,554 |                        594,425 |                       601,545 |              518,847 |
| replace.head   |                           436,876 |                         395,983 |                         401,665 |                        375,582 |                       378,878 |              308,767 |
| replace.random |                            40,169 |                          43,602 |                          45,935 |                         48,950 |                        52,129 |               52,035 |
| replace.tail   |                           230,133 |                         209,960 |                         203,472 |                        190,121 |                       190,392 |              176,910 |
| value.head     |                         2,242,186 |                       2,187,419 |                       2,134,307 |                      2,139,694 |                     2,207,554 |            2,235,975 |
| value.random   |                            45,565 |                          48,809 |                          51,776 |                         55,407 |                        59,164 |               60,475 |
| value.tail     |                         2,587,266 |                       2,563,242 |                       2,548,554 |                      2,576,852 |                     2,693,682 |            2,743,080 |

### API throughput at checkpoint

Checkpoint calls, in ops/s, averaged across runs.

**↑ Scale up (0 → 25,000 Strips)**

| Method                            | 1,000 Strips<br>50,871 Frames | 5,000 Strips<br>252,214 Frames | 10,000 Strips<br>504,871 Frames | 15,000 Strips<br>758,280 Frames | 20,000 Strips<br>1,010,749 Frames | 25,000 Strips<br>1,264,003 Frames |
| --------------------------------- | ----------------------------: | -----------------------------: | ------------------------------: | ------------------------------: | --------------------------------: | --------------------------------: |
| new Projection(actorID, sequence) |                         4,463 |                            962 |                             619 |                             426 |                               294 |                               248 |
| sequence()                        |                           565 |                            106 |                              54 |                              38 |                                27 |                                20 |
| values()                          |                           601 |                            251 |                              91 |                              57 |                                57 |                                35 |

**↓ Scale down (25,000 → 0 Strips)**

| Method                            | 20,000 Strips<br>1,012,742 Frames | 15,000 Strips<br>755,860 Frames | 10,000 Strips<br>504,103 Frames | 5,000 Strips<br>251,203 Frames | 1,000 Strips<br>51,057 Frames | 0 Strips<br>0 Frames |
| --------------------------------- | --------------------------------: | ------------------------------: | ------------------------------: | -----------------------------: | ----------------------------: | -------------------: |
| new Projection(actorID, sequence) |                               288 |                             422 |                             511 |                          1,291 |                         5,191 |               24,548 |
| sequence()                        |                                19 |                              17 |                              12 |                             13 |                            11 |                   11 |
| values()                          |                                69 |                              37 |                              87 |                             87 |                           183 |              154,987 |

### Sequence disk size at checkpoint

Complete exported Sequences, including Footage and acknowledgements. Sizes are in KiB.

**↑ Scale up (0 → 25,000 Strips)**

| Encoding           | 1,000 Strips<br>50,871 Frames | 5,000 Strips<br>252,214 Frames | 10,000 Strips<br>504,871 Frames | 15,000 Strips<br>758,280 Frames | 20,000 Strips<br>1,010,749 Frames | 25,000 Strips<br>1,264,003 Frames |
| ------------------ | ----------------------------: | -----------------------------: | ------------------------------: | ------------------------------: | --------------------------------: | --------------------------------: |
| JSON               |                        277.64 |                       1,623.83 |                        3,266.13 |                        4,907.69 |                          7,050.09 |                          9,173.79 |
| JSON + gzip        |                         14.59 |                          73.86 |                          150.40 |                          226.94 |                            311.21 |                            391.69 |
| MessagePack        |                        164.81 |                         818.88 |                        1,639.69 |                        3,529.41 |                          5,081.04 |                          6,483.22 |
| MessagePack + gzip |                         12.38 |                          61.61 |                          124.90 |                          198.55 |                            263.51 |                            332.75 |

**↓ Scale down (25,000 → 0 Strips)**

| Encoding           | 20,000 Strips<br>1,012,742 Frames | 15,000 Strips<br>755,860 Frames | 10,000 Strips<br>504,103 Frames | 5,000 Strips<br>251,203 Frames | 1,000 Strips<br>51,057 Frames | 0 Strips<br>0 Frames |
| ------------------ | --------------------------------: | ------------------------------: | ------------------------------: | -----------------------------: | ----------------------------: | -------------------: |
| JSON               |                          7,457.36 |                        5,626.00 |                        3,775.51 |                       1,888.37 |                        383.81 |                 0.02 |
| JSON + gzip        |                            323.20 |                          244.46 |                          163.94 |                          80.70 |                         16.36 |                 0.03 |
| MessagePack        |                          5,237.17 |                        3,930.33 |                        2,628.38 |                       1,312.43 |                        266.67 |                 0.01 |
| MessagePack + gzip |                            274.92 |                          207.73 |                          137.36 |                          67.38 |                         13.67 |                 0.03 |

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

The latest verification passed 212 Vitest tests and 108 compatibility checks.
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
