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
| ESM      |    158.96 |         129.47 |                 46.18 |
| CommonJS |    159.10 |         130.50 |                 46.26 |

Both bundles include WASM. Terser uses three compression passes; gzip uses level 9.

### Average throughput during editing to checkpoint

Arithmetic means of 3 runs, in ops/s, from each phase's start to checkpoint.
Strips contain 1–100 Frames (visible entries). Headers show Strip counts and mean Frame counts.

**↑ Scale up (0 → 25,000 Strips)**

| Method / case  | 1,000 Strips<br>50,871 Frames | 5,000 Strips<br>252,214 Frames | 10,000 Strips<br>504,871 Frames | 15,000 Strips<br>758,280 Frames | 20,000 Strips<br>1,010,749 Frames | 25,000 Strips<br>1,264,003 Frames |
| -------------- | ----------------------------: | -----------------------------: | ------------------------------: | ------------------------------: | --------------------------------: | --------------------------------: |
| apply.random   |                       165,146 |                         80,297 |                          54,380 |                          41,110 |                            33,538 |                            28,291 |
| insert.head    |                     1,122,612 |                        837,202 |                         921,657 |                         958,738 |                           972,684 |                           965,626 |
| insert.random  |                       450,279 |                        221,686 |                         139,522 |                         105,715 |                            84,912 |                            70,984 |
| insert.tail    |                     1,257,918 |                        966,648 |                       1,068,075 |                       1,110,791 |                         1,125,900 |                         1,120,143 |
| remove.head    |                             — |                              — |                               — |                               — |                                 — |                                 — |
| remove.random  |                       321,595 |                        152,089 |                          97,386 |                          73,599 |                            58,548 |                            48,596 |
| remove.tail    |                             — |                              — |                               — |                               — |                                 — |                                 — |
| replace.head   |                       443,538 |                        372,326 |                         387,006 |                         380,137 |                           368,832 |                           377,323 |
| replace.random |                       277,133 |                        139,536 |                          93,692 |                          69,874 |                            56,537 |                            46,830 |
| replace.tail   |                       396,605 |                        384,577 |                         367,733 |                         388,662 |                           373,868 |                           326,906 |
| value.head     |                     2,434,405 |                      3,017,725 |                       3,159,921 |                       3,255,278 |                         3,353,882 |                         3,376,975 |
| value.random   |                       648,315 |                        219,859 |                         123,644 |                          86,005 |                            67,010 |                            54,747 |
| value.tail     |                     4,638,685 |                      4,700,677 |                       4,599,267 |                       4,489,616 |                         4,427,938 |                         4,335,579 |

**↓ Scale down (25,000 → 0 Strips)**

| Method / case  | 20,000 Strips<br>1,012,742 Frames | 15,000 Strips<br>755,860 Frames | 10,000 Strips<br>504,103 Frames | 5,000 Strips<br>251,203 Frames | 1,000 Strips<br>51,057 Frames | 0 Strips<br>0 Frames |
| -------------- | --------------------------------: | ------------------------------: | ------------------------------: | -----------------------------: | ----------------------------: | -------------------: |
| apply.random   |                            17,938 |                          17,713 |                          17,324 |                         17,192 |                        17,475 |               17,723 |
| insert.head    |                                 — |                               — |                               — |                              — |                             — |                    — |
| insert.random  |                            43,876 |                          43,789 |                          43,227 |                         42,155 |                        43,057 |               42,481 |
| insert.tail    |                                 — |                               — |                               — |                              — |                             — |                    — |
| remove.head    |                           463,595 |                         461,812 |                         464,125 |                        465,124 |                       465,532 |              468,318 |
| remove.random  |                            31,986 |                          32,761 |                          33,073 |                         33,589 |                        34,651 |               35,236 |
| remove.tail    |                           458,417 |                         441,961 |                         453,605 |                        457,641 |                       460,637 |              426,206 |
| replace.head   |                           344,742 |                         332,817 |                         326,516 |                        286,836 |                       275,906 |              220,054 |
| replace.random |                            31,740 |                          32,287 |                          32,489 |                         32,466 |                        33,449 |               33,035 |
| replace.tail   |                           177,741 |                         160,539 |                         153,018 |                        138,043 |                       135,883 |              120,041 |
| value.head     |                         1,601,558 |                       1,562,009 |                       1,528,923 |                      1,523,295 |                     1,556,207 |            1,574,242 |
| value.random   |                            35,753 |                          36,152 |                          36,317 |                         36,833 |                        37,989 |               38,814 |
| value.tail     |                         1,851,210 |                       1,782,579 |                       1,751,515 |                      1,748,210 |                     1,784,081 |            1,809,761 |

### API throughput at checkpoint

Checkpoint calls, in ops/s, averaged across runs.

**↑ Scale up (0 → 25,000 Strips)**

| Method                            | 1,000 Strips<br>50,871 Frames | 5,000 Strips<br>252,214 Frames | 10,000 Strips<br>504,871 Frames | 15,000 Strips<br>758,280 Frames | 20,000 Strips<br>1,010,749 Frames | 25,000 Strips<br>1,264,003 Frames |
| --------------------------------- | ----------------------------: | -----------------------------: | ------------------------------: | ------------------------------: | --------------------------------: | --------------------------------: |
| new Projection(actorID, sequence) |                         4,095 |                            879 |                             555 |                             368 |                               269 |                               231 |
| sequence()                        |                           522 |                             79 |                              42 |                              27 |                                19 |                                12 |
| values()                          |                           594 |                            182 |                              52 |                              64 |                                25 |                                42 |

**↓ Scale down (25,000 → 0 Strips)**

| Method                            | 20,000 Strips<br>1,012,742 Frames | 15,000 Strips<br>755,860 Frames | 10,000 Strips<br>504,103 Frames | 5,000 Strips<br>251,203 Frames | 1,000 Strips<br>51,057 Frames | 0 Strips<br>0 Frames |
| --------------------------------- | --------------------------------: | ------------------------------: | ------------------------------: | -----------------------------: | ----------------------------: | -------------------: |
| new Projection(actorID, sequence) |                               266 |                             386 |                             479 |                          1,167 |                         4,991 |               18,336 |
| sequence()                        |                                13 |                              12 |                               7 |                              8 |                             7 |                    7 |
| values()                          |                                43 |                              41 |                              59 |                             76 |                           204 |               87,032 |

### Sequence disk size at checkpoint

Complete exported Sequences, including Footage and acknowledgements. Sizes are in KiB.

**↑ Scale up (0 → 25,000 Strips)**

| Encoding           | 1,000 Strips<br>50,871 Frames | 5,000 Strips<br>252,214 Frames | 10,000 Strips<br>504,871 Frames | 15,000 Strips<br>758,280 Frames | 20,000 Strips<br>1,010,749 Frames | 25,000 Strips<br>1,264,003 Frames |
| ------------------ | ----------------------------: | -----------------------------: | ------------------------------: | ------------------------------: | --------------------------------: | --------------------------------: |
| JSON               |                        277.29 |                       1,622.20 |                        3,262.86 |                        4,902.77 |                          7,043.50 |                          9,165.60 |
| JSON + gzip        |                         14.60 |                          73.85 |                          150.43 |                          226.96 |                            311.21 |                            391.70 |
| MessagePack        |                        164.81 |                         818.88 |                        1,639.69 |                        3,529.41 |                          5,081.04 |                          6,483.22 |
| MessagePack + gzip |                         12.38 |                          61.62 |                          124.91 |                          198.59 |                            263.54 |                            332.77 |

**↓ Scale down (25,000 → 0 Strips)**

| Encoding           | 20,000 Strips<br>1,012,742 Frames | 15,000 Strips<br>755,860 Frames | 10,000 Strips<br>504,103 Frames | 5,000 Strips<br>251,203 Frames | 1,000 Strips<br>51,057 Frames | 0 Strips<br>0 Frames |
| ------------------ | --------------------------------: | ------------------------------: | ------------------------------: | -----------------------------: | ----------------------------: | -------------------: |
| JSON               |                          7,449.19 |                        5,619.45 |                        3,771.17 |                       1,886.19 |                        383.37 |                 0.02 |
| JSON + gzip        |                            323.26 |                          244.47 |                          163.94 |                          80.65 |                         16.34 |                 0.03 |
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

### Tuple mode

Arithmetic means of 3 runs. Ordinary Projection versus a static tuple with maxLength. Both contain the same values; replacements preserve the field count.

#### Throughput (ops/s)

| Indices | Method / case   | Projection | Static tuple | Tuple / Projection |
| ------: | --------------- | ---------: | -----------: | -----------------: |
|       2 | create.sequence |    666,485 |      589,182 |              0.88× |
|       2 | replace.random  |    713,174 |    1,115,805 |              1.56× |
|       2 | apply.replace   |    508,935 |      700,611 |              1.38× |
|       2 | value.random    | 30,174,106 |   48,218,497 |              1.60× |
|       4 | create.sequence |    458,897 |      519,633 |              1.13× |
|       4 | replace.random  |    735,182 |    1,138,983 |              1.55× |
|       4 | apply.replace   |    417,043 |      707,797 |              1.70× |
|       4 | value.random    | 26,113,205 |   50,651,808 |              1.94× |
|       8 | create.sequence |    349,073 |      425,121 |              1.22× |
|       8 | replace.random  |    709,998 |    1,128,141 |              1.59× |
|       8 | apply.replace   |    412,048 |      735,958 |              1.79× |
|       8 | value.random    | 19,625,431 |   50,234,180 |              2.56× |
|     100 | create.sequence |     69,823 |       98,188 |              1.41× |
|     100 | replace.random  |    697,750 |    1,214,212 |              1.74× |
|     100 | apply.replace   |    323,195 |      751,943 |              2.33× |
|     100 | value.random    |  8,758,041 |   49,605,873 |              5.66× |

#### Space (KiB)

| Indices | Mode         | Estimated allocated memory | MessagePack | MessagePack + gzip |
| ------: | ------------ | -------------------------: | ----------: | -----------------: |
|       2 | Projection   |                       0.98 |        0.03 |               0.04 |
|       2 | Static tuple |                       0.90 |        0.04 |               0.05 |
|       4 | Projection   |                       1.57 |        0.06 |               0.05 |
|       4 | Static tuple |                       1.09 |        0.06 |               0.07 |
|       8 | Projection   |                       2.52 |        0.12 |               0.08 |
|       8 | Static tuple |                       1.55 |        0.10 |               0.09 |
|     100 | Projection   |                      23.78 |        0.67 |               0.57 |
|     100 | Static tuple |                      12.23 |        0.51 |               0.35 |

Measured on Node 24.22.2, V8 13.6.233.17-node.63, linux x64, AMD EPYC 7763 64-Core Processor. Fixtures are hydrated compacted snapshots after one replacement per field. Each case warms up for ≥25 ms and measures ≥50 ms of API time; mutation bursts restart after 4,096 replacements. Peer authoring, encoding, result checks, destruction and explicit JS process garbage collection are outside API timings. Memory estimates are the increase in live native allocator bytes plus retained JS array slots for one instance, including exercised runtime buffers. Unused WASM capacity, JS object headers and referenced payload objects are excluded.

[Full tuple results](benchmark/.results/tuple.md).

## Tests

### Behaviour guaranteed by excessive tests

The latest verification passed 271 Vitest tests and 117 compatibility checks.
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
