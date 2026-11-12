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
| ESM      |    147.67 |         120.33 |                 43.22 |
| CommonJS |    147.82 |         121.60 |                 43.37 |

Both bundles include WASM. Terser uses three compression passes; gzip uses level 9.

### Average throughput during editing to checkpoint

Arithmetic means of 3 runs, in ops/s, from each phase's start to checkpoint.
Strips contain 1–100 Frames (visible entries). Headers show Strip counts and mean Frame counts.

**↑ Scale up (0 → 25,000 Strips)**

| Method / case  | 1,000 Strips<br>50,871 Frames | 5,000 Strips<br>252,214 Frames | 10,000 Strips<br>504,871 Frames | 15,000 Strips<br>758,280 Frames | 20,000 Strips<br>1,010,749 Frames | 25,000 Strips<br>1,264,003 Frames |
| -------------- | ----------------------------: | -----------------------------: | ------------------------------: | ------------------------------: | --------------------------------: | --------------------------------: |
| apply.random   |                       176,125 |                        106,904 |                          90,695 |                          81,542 |                            78,984 |                            74,054 |
| insert.head    |                     1,278,074 |                        914,782 |                       1,041,929 |                       1,053,622 |                         1,067,029 |                         1,081,320 |
| insert.random  |                       519,744 |                        293,745 |                         221,854 |                         179,507 |                           163,072 |                           148,874 |
| insert.tail    |                     1,404,717 |                      1,343,560 |                       1,353,474 |                       1,193,958 |                         1,208,528 |                         1,153,043 |
| remove.head    |                             — |                              — |                               — |                               — |                                 — |                                 — |
| remove.random  |                       344,388 |                        175,229 |                         127,198 |                          99,322 |                            90,860 |                            80,833 |
| remove.tail    |                             — |                              — |                               — |                               — |                                 — |                                 — |
| replace.head   |                       458,836 |                        458,861 |                         417,732 |                         411,275 |                           417,499 |                           401,426 |
| replace.random |                       288,532 |                        154,259 |                         117,374 |                          90,518 |                            83,670 |                            76,368 |
| replace.tail   |                       465,220 |                        392,824 |                         427,997 |                         435,425 |                           417,909 |                           407,436 |
| value.head     |                     2,586,039 |                      2,842,303 |                       2,976,961 |                       2,889,434 |                         2,937,624 |                         2,896,376 |
| value.random   |                       665,978 |                        250,811 |                         169,412 |                         128,620 |                           114,490 |                           100,987 |
| value.tail     |                     4,550,048 |                      4,599,617 |                       4,472,384 |                       4,286,336 |                         4,249,130 |                         4,177,628 |

**↓ Scale down (25,000 → 0 Strips)**

| Method / case  | 20,000 Strips<br>1,012,742 Frames | 15,000 Strips<br>755,860 Frames | 10,000 Strips<br>504,103 Frames | 5,000 Strips<br>251,203 Frames | 1,000 Strips<br>51,057 Frames | 0 Strips<br>0 Frames |
| -------------- | --------------------------------: | ------------------------------: | ------------------------------: | -----------------------------: | ----------------------------: | -------------------: |
| apply.random   |                            72,125 |                          76,655 |                          78,467 |                         76,474 |                        79,286 |               81,085 |
| insert.head    |                                 — |                               — |                               — |                              — |                             — |                    — |
| insert.random  |                           206,529 |                         222,707 |                         230,990 |                        223,880 |                       232,201 |              237,797 |
| insert.tail    |                                 — |                               — |                               — |                              — |                             — |                    — |
| remove.head    |                           470,816 |                         487,378 |                         481,975 |                        470,201 |                       470,185 |              472,038 |
| remove.random  |                           141,927 |                         142,130 |                         150,416 |                        145,205 |                       150,290 |              153,582 |
| remove.tail    |                           444,446 |                         462,920 |                         476,232 |                        447,321 |                       450,044 |              453,068 |
| replace.head   |                           386,814 |                         381,032 |                         363,258 |                        352,733 |                       333,653 |              335,475 |
| replace.random |                           142,859 |                         147,613 |                         152,859 |                        148,873 |                       152,667 |              155,548 |
| replace.tail   |                           191,096 |                          92,431 |                         110,867 |                         33,352 |                        35,995 |               37,288 |
| value.head     |                         1,856,564 |                       1,933,677 |                       1,973,199 |                      1,858,305 |                     1,860,417 |            1,870,474 |
| value.random   |                           220,899 |                         233,017 |                         240,594 |                        235,226 |                       244,155 |              250,826 |
| value.tail     |                         3,461,207 |                       3,473,361 |                       3,427,893 |                      3,242,586 |                     3,236,076 |            3,238,913 |

### API throughput at checkpoint

Checkpoint calls, in ops/s, averaged across runs.

**↑ Scale up (0 → 25,000 Strips)**

| Method                            | 1,000 Strips<br>50,871 Frames | 5,000 Strips<br>252,214 Frames | 10,000 Strips<br>504,871 Frames | 15,000 Strips<br>758,280 Frames | 20,000 Strips<br>1,010,749 Frames | 25,000 Strips<br>1,264,003 Frames |
| --------------------------------- | ----------------------------: | -----------------------------: | ------------------------------: | ------------------------------: | --------------------------------: | --------------------------------: |
| new Projection(actorID, sequence) |                         5,481 |                          1,240 |                             666 |                             373 |                               301 |                               234 |
| sequence()                        |                           568 |                            120 |                              65 |                              55 |                                39 |                                33 |
| values()                          |                         1,076 |                            263 |                             117 |                              76 |                                80 |                                67 |

**↓ Scale down (25,000 → 0 Strips)**

| Method                            | 20,000 Strips<br>1,012,742 Frames | 15,000 Strips<br>755,860 Frames | 10,000 Strips<br>504,103 Frames | 5,000 Strips<br>251,203 Frames | 1,000 Strips<br>51,057 Frames | 0 Strips<br>0 Frames |
| --------------------------------- | --------------------------------: | ------------------------------: | ------------------------------: | -----------------------------: | ----------------------------: | -------------------: |
| new Projection(actorID, sequence) |                               298 |                             392 |                             592 |                          1,049 |                         5,287 |               49,295 |
| sequence()                        |                                42 |                              45 |                              64 |                             63 |                            90 |                  473 |
| values()                          |                                87 |                             112 |                             150 |                            308 |                         1,043 |              103,853 |

### Sequence disk size at checkpoint

Complete exported Sequences, including Footage and acknowledgements. Sizes are in KiB.

**↑ Scale up (0 → 25,000 Strips)**

| Encoding           | 1,000 Strips<br>50,871 Frames | 5,000 Strips<br>252,214 Frames | 10,000 Strips<br>504,871 Frames | 15,000 Strips<br>758,280 Frames | 20,000 Strips<br>1,010,749 Frames | 25,000 Strips<br>1,264,003 Frames |
| ------------------ | ----------------------------: | -----------------------------: | ------------------------------: | ------------------------------: | --------------------------------: | --------------------------------: |
| JSON               |                        277.40 |                       1,619.90 |                        3,265.69 |                        4,929.28 |                          7,100.26 |                          9,253.31 |
| JSON + gzip        |                         14.59 |                          73.45 |                          148.97 |                          225.95 |                            310.65 |                            392.10 |
| MessagePack        |                        164.81 |                         818.92 |                        1,646.03 |                        3,553.60 |                          5,126.26 |                          6,551.31 |
| MessagePack + gzip |                         12.38 |                          61.63 |                          124.81 |                          200.03 |                            263.45 |                            335.07 |

**↓ Scale down (25,000 → 0 Strips)**

| Encoding           | 20,000 Strips<br>1,012,742 Frames | 15,000 Strips<br>755,860 Frames | 10,000 Strips<br>504,103 Frames | 5,000 Strips<br>251,203 Frames | 1,000 Strips<br>51,057 Frames | 0 Strips<br>0 Frames |
| ------------------ | --------------------------------: | ------------------------------: | ------------------------------: | -----------------------------: | ----------------------------: | -------------------: |
| JSON               |                          7,556.21 |                        5,696.63 |                        3,811.70 |                       1,888.79 |                        381.07 |                 0.02 |
| JSON + gzip        |                            326.16 |                          247.13 |                          164.92 |                          79.64 |                         15.97 |                 0.03 |
| MessagePack        |                          5,311.03 |                        3,984.10 |                        2,657.98 |                       1,319.77 |                        266.79 |                 0.01 |
| MessagePack + gzip |                            278.19 |                          209.95 |                          140.02 |                          67.74 |                         13.66 |                 0.03 |

### Memory usage at checkpoint

One instance after checkpoint compaction and recreation: live native allocation plus retained JS array slots, in KiB (1,024 bytes). Unused WASM capacity is excluded.

**↑ Scale up (0 → 25,000 Strips)**

| Measurement            | 1,000 Strips<br>50,871 Frames | 5,000 Strips<br>252,214 Frames | 10,000 Strips<br>504,871 Frames | 15,000 Strips<br>758,280 Frames | 20,000 Strips<br>1,010,749 Frames | 25,000 Strips<br>1,264,003 Frames |
| ---------------------- | ----------------------------: | -----------------------------: | ------------------------------: | ------------------------------: | --------------------------------: | --------------------------------: |
| Estimated memory (KiB) |                        903.21 |                       4,259.98 |                        7,795.30 |                       11,192.32 |                         14,799.69 |                         18,167.89 |

**↓ Scale down (25,000 → 0 Strips)**

| Measurement            | 20,000 Strips<br>1,012,742 Frames | 15,000 Strips<br>755,860 Frames | 10,000 Strips<br>504,103 Frames | 5,000 Strips<br>251,203 Frames | 1,000 Strips<br>51,057 Frames | 0 Strips<br>0 Frames |
| ---------------------- | --------------------------------: | ------------------------------: | ------------------------------: | -----------------------------: | ----------------------------: | -------------------: |
| Estimated memory (KiB) |                         15,088.08 |                       12,080.07 |                        8,914.32 |                       5,835.26 |                      3,090.50 |             1,560.35 |

Measured on Node 24.16.0, V8 13.6.233.17-node.49,
win32 x64, Intel(R) Core(TM) i5-10210U CPU @ 1.60GHz.
Peer synchronization, encoding and JS process garbage collection are outside API timings.
[Full lifecycle results](benchmark/.results/lifecycle.md) · [Throughput results](benchmark/.results/throughput.md).

### Tuple mode

Arithmetic means of 3 runs. Ordinary Projection versus a static tuple with maxLength. Both contain the same values; replacements preserve the field count.

#### Throughput (ops/s)

| Indices | Method / case   | Projection | Static tuple | Tuple / Projection |
| ------: | --------------- | ---------: | -----------: | -----------------: |
|       2 | create.sequence |    781,561 |      735,280 |              0.94× |
|       2 | replace.random  |    804,229 |    1,341,210 |              1.67× |
|       2 | apply.replace   |    552,922 |      871,018 |              1.58× |
|       2 | value.random    | 31,209,443 |   53,673,417 |              1.72× |
|       4 | create.sequence |    616,833 |      652,191 |              1.06× |
|       4 | replace.random  |    826,973 |    1,538,723 |              1.86× |
|       4 | apply.replace   |    445,795 |      978,114 |              2.19× |
|       4 | value.random    | 23,167,935 |   44,704,914 |              1.93× |
|       8 | create.sequence |    408,001 |      502,071 |              1.23× |
|       8 | replace.random  |    870,069 |    1,442,283 |              1.66× |
|       8 | apply.replace   |    395,921 |      996,469 |              2.52× |
|       8 | value.random    | 19,688,055 |   54,908,066 |              2.79× |
|     100 | create.sequence |     72,169 |       98,959 |              1.37× |
|     100 | replace.random  |    751,739 |    1,562,404 |              2.08× |
|     100 | apply.replace   |    337,867 |    1,035,577 |              3.07× |
|     100 | value.random    |  9,019,048 |   56,218,759 |              6.23× |

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

Measured on Node 24.16.0, V8 13.6.233.17-node.49, win32 x64, Intel(R) Core(TM) i5-10210U CPU @ 1.60GHz. Fixtures are hydrated compacted snapshots after one replacement per field. Each case warms up for ≥25 ms and measures ≥50 ms of API time; mutation bursts restart after 4,096 replacements. Peer authoring, encoding, result checks, destruction and explicit JS process garbage collection are outside API timings. Memory estimates are the increase in live native allocator bytes plus retained JS array slots for one instance, including exercised runtime buffers. Unused WASM capacity, JS object headers and referenced payload objects are excluded.

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
