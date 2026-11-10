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
| ESM      |    155.49 |         126.93 |                 44.88 |
| CommonJS |    155.63 |         128.07 |                 44.97 |

Both bundles include WASM. Terser uses three compression passes; gzip uses level 9.

### Average throughput during editing to checkpoint

Arithmetic means of 3 runs, in ops/s, from each phase's start to checkpoint.
Strips contain 1–100 Frames (visible entries). Headers show Strip counts and mean Frame counts.

**↑ Scale up (0 → 25,000 Strips)**

| Method / case  | 1,000 Strips<br>50,871 Frames | 5,000 Strips<br>252,214 Frames | 10,000 Strips<br>504,871 Frames | 15,000 Strips<br>758,280 Frames | 20,000 Strips<br>1,010,749 Frames | 25,000 Strips<br>1,264,003 Frames |
| -------------- | ----------------------------: | -----------------------------: | ------------------------------: | ------------------------------: | --------------------------------: | --------------------------------: |
| apply.random   |                       146,918 |                         82,524 |                          75,109 |                          70,472 |                            68,240 |                            65,727 |
| insert.head    |                     1,135,697 |                        714,815 |                         872,603 |                         964,885 |                           961,016 |                         1,001,250 |
| insert.random  |                       433,655 |                        203,462 |                         168,064 |                         152,282 |                           138,079 |                           129,548 |
| insert.tail    |                     1,118,150 |                        806,205 |                         828,883 |                         860,860 |                           902,680 |                           876,153 |
| remove.head    |                             — |                              — |                               — |                               — |                                 — |                                 — |
| remove.random  |                       223,882 |                        127,765 |                         102,549 |                          86,449 |                            78,865 |                            73,726 |
| remove.tail    |                             — |                              — |                               — |                               — |                                 — |                                 — |
| replace.head   |                       357,256 |                        329,444 |                         306,814 |                         318,244 |                           321,421 |                           319,750 |
| replace.random |                       241,776 |                        119,950 |                          95,035 |                          81,445 |                            74,618 |                            70,365 |
| replace.tail   |                       385,632 |                        294,674 |                         337,077 |                         352,285 |                           354,944 |                           364,751 |
| value.head     |                     1,666,164 |                      2,200,042 |                       2,043,776 |                       2,201,577 |                         2,268,431 |                         2,338,805 |
| value.random   |                       584,423 |                        203,497 |                         140,850 |                         114,702 |                           100,862 |                            91,184 |
| value.tail     |                     4,066,720 |                      3,936,673 |                       3,960,073 |                       3,922,029 |                         3,816,974 |                         3,765,014 |

**↓ Scale down (25,000 → 0 Strips)**

| Method / case  | 20,000 Strips<br>1,012,742 Frames | 15,000 Strips<br>755,860 Frames | 10,000 Strips<br>504,103 Frames | 5,000 Strips<br>251,203 Frames | 1,000 Strips<br>51,057 Frames | 0 Strips<br>0 Frames |
| -------------- | --------------------------------: | ------------------------------: | ------------------------------: | -----------------------------: | ----------------------------: | -------------------: |
| apply.random   |                            63,374 |                          66,070 |                          69,020 |                         71,832 |                        75,733 |               77,506 |
| insert.head    |                                 — |                               — |                               — |                              — |                             — |                    — |
| insert.random  |                           181,267 |                         188,984 |                         196,407 |                        201,376 |                       213,321 |              218,353 |
| insert.tail    |                                 — |                               — |                               — |                              — |                             — |                    — |
| remove.head    |                           412,912 |                         427,827 |                         417,230 |                        428,970 |                       436,934 |              440,194 |
| remove.random  |                           123,629 |                         131,058 |                         135,730 |                        139,261 |                       146,139 |              149,306 |
| remove.tail    |                           345,229 |                         368,344 |                         388,225 |                        395,088 |                       408,562 |              410,116 |
| replace.head   |                           340,985 |                         330,944 |                         333,979 |                        327,233 |                       332,109 |              333,615 |
| replace.random |                           117,978 |                         123,410 |                         129,584 |                        133,845 |                       138,837 |              141,486 |
| replace.tail   |                            56,997 |                          48,081 |                          25,185 |                         26,784 |                        28,644 |               29,712 |
| value.head     |                         1,667,442 |                       1,732,951 |                       1,777,671 |                      1,815,188 |                     1,835,645 |            1,842,478 |
| value.random   |                           200,733 |                         204,719 |                         212,550 |                        220,011 |                       232,916 |              239,293 |
| value.tail     |                         3,163,893 |                       3,081,025 |                       3,125,818 |                      3,172,701 |                     3,209,515 |            3,180,710 |

### API throughput at checkpoint

Checkpoint calls, in ops/s, averaged across runs.

**↑ Scale up (0 → 25,000 Strips)**

| Method                            | 1,000 Strips<br>50,871 Frames | 5,000 Strips<br>252,214 Frames | 10,000 Strips<br>504,871 Frames | 15,000 Strips<br>758,280 Frames | 20,000 Strips<br>1,010,749 Frames | 25,000 Strips<br>1,264,003 Frames |
| --------------------------------- | ----------------------------: | -----------------------------: | ------------------------------: | ------------------------------: | --------------------------------: | --------------------------------: |
| new Projection(actorID, sequence) |                         3,478 |                            686 |                             350 |                             311 |                               188 |                               151 |
| sequence()                        |                           371 |                             88 |                              47 |                              38 |                                29 |                                20 |
| values()                          |                           684 |                            240 |                             116 |                              76 |                                79 |                                64 |

**↓ Scale down (25,000 → 0 Strips)**

| Method                            | 20,000 Strips<br>1,012,742 Frames | 15,000 Strips<br>755,860 Frames | 10,000 Strips<br>504,103 Frames | 5,000 Strips<br>251,203 Frames | 1,000 Strips<br>51,057 Frames | 0 Strips<br>0 Frames |
| --------------------------------- | --------------------------------: | ------------------------------: | ------------------------------: | -----------------------------: | ----------------------------: | -------------------: |
| new Projection(actorID, sequence) |                               157 |                             287 |                             358 |                            987 |                         4,412 |               42,354 |
| sequence()                        |                                35 |                              38 |                              54 |                             75 |                           114 |                  584 |
| values()                          |                                92 |                             115 |                             177 |                            283 |                           845 |               76,729 |

### Sequence disk size at checkpoint

Complete exported Sequences, including Footage and acknowledgements. Sizes are in KiB.

**↑ Scale up (0 → 25,000 Strips)**

| Encoding           | 1,000 Strips<br>50,871 Frames | 5,000 Strips<br>252,214 Frames | 10,000 Strips<br>504,871 Frames | 15,000 Strips<br>758,280 Frames | 20,000 Strips<br>1,010,749 Frames | 25,000 Strips<br>1,264,003 Frames |
| ------------------ | ----------------------------: | -----------------------------: | ------------------------------: | ------------------------------: | --------------------------------: | --------------------------------: |
| JSON               |                        277.40 |                       1,621.52 |                        3,265.17 |                        4,931.58 |                          7,105.54 |                          9,265.26 |
| JSON + gzip        |                         14.59 |                          73.44 |                          148.97 |                          225.97 |                            310.77 |                            392.61 |
| MessagePack        |                        164.81 |                         818.92 |                        1,646.03 |                        3,553.60 |                          5,126.26 |                          6,551.31 |
| MessagePack + gzip |                         12.38 |                          61.63 |                          124.80 |                          200.04 |                            263.46 |                            335.09 |

**↓ Scale down (25,000 → 0 Strips)**

| Encoding           | 20,000 Strips<br>1,012,742 Frames | 15,000 Strips<br>755,860 Frames | 10,000 Strips<br>504,103 Frames | 5,000 Strips<br>251,203 Frames | 1,000 Strips<br>51,057 Frames | 0 Strips<br>0 Frames |
| ------------------ | --------------------------------: | ------------------------------: | ------------------------------: | -----------------------------: | ----------------------------: | -------------------: |
| JSON               |                          7,570.30 |                        5,705.02 |                        3,809.77 |                       1,888.34 |                        380.93 |                 0.02 |
| JSON + gzip        |                            326.38 |                          247.32 |                          164.73 |                          79.63 |                         15.97 |                 0.03 |
| MessagePack        |                          5,314.83 |                        3,986.78 |                        2,658.67 |                       1,319.82 |                        266.79 |                 0.01 |
| MessagePack + gzip |                            278.09 |                          209.80 |                          139.95 |                          67.72 |                         13.66 |                 0.03 |

### Memory usage at checkpoint

One instance after checkpoint compaction and recreation: live native allocation plus retained JS array slots, in KiB (1,024 bytes). Unused WASM capacity is excluded.

**↑ Scale up (0 → 25,000 Strips)**

| Measurement            | 1,000 Strips<br>50,871 Frames | 5,000 Strips<br>252,214 Frames | 10,000 Strips<br>504,871 Frames | 15,000 Strips<br>758,280 Frames | 20,000 Strips<br>1,010,749 Frames | 25,000 Strips<br>1,264,003 Frames |
| ---------------------- | ----------------------------: | -----------------------------: | ------------------------------: | ------------------------------: | --------------------------------: | --------------------------------: |
| Estimated memory (KiB) |                        911.13 |                       4,299.13 |                        7,873.50 |                       11,309.59 |                         14,956.04 |                         18,363.29 |

**↓ Scale down (25,000 → 0 Strips)**

| Measurement            | 20,000 Strips<br>1,012,742 Frames | 15,000 Strips<br>755,860 Frames | 10,000 Strips<br>504,103 Frames | 5,000 Strips<br>251,203 Frames | 1,000 Strips<br>51,057 Frames | 0 Strips<br>0 Frames |
| ---------------------- | --------------------------------: | ------------------------------: | ------------------------------: | -----------------------------: | ----------------------------: | -------------------: |
| Estimated memory (KiB) |                         15,244.41 |                       12,197.34 |                        8,992.53 |                       5,874.41 |                      3,098.40 |             1,560.42 |

Measured on Node 24.16.0, V8 13.6.233.17-node.49,
win32 x64, Intel(R) Core(TM) i5-10210U CPU @ 1.60GHz.
Peer synchronization, encoding and JS process garbage collection are outside API timings.
[Full lifecycle results](benchmark/.results/lifecycle.md) · [Throughput results](benchmark/.results/throughput.md).

### Tuple mode

Arithmetic means of 3 runs. Ordinary Projection versus a static tuple with maxLength. Both contain the same values; replacements preserve the field count.

#### Throughput (ops/s)

| Indices | Method / case   | Projection | Static tuple | Tuple / Projection |
| ------: | --------------- | ---------: | -----------: | -----------------: |
|       2 | create.sequence |    469,604 |      401,590 |              0.86× |
|       2 | replace.random  |    588,444 |      800,354 |              1.36× |
|       2 | apply.replace   |    425,111 |      527,211 |              1.24× |
|       2 | value.random    | 27,772,078 |   44,951,228 |              1.62× |
|       4 | create.sequence |    371,168 |      393,276 |              1.06× |
|       4 | replace.random  |    652,779 |      928,128 |              1.42× |
|       4 | apply.replace   |    284,757 |      602,494 |              2.12× |
|       4 | value.random    | 15,881,983 |   35,579,299 |              2.24× |
|       8 | create.sequence |    245,264 |      302,009 |              1.23× |
|       8 | replace.random  |    582,248 |      980,154 |              1.68× |
|       8 | apply.replace   |    234,801 |      503,042 |              2.14× |
|       8 | value.random    | 10,269,621 |   31,284,326 |              3.05× |
|     100 | create.sequence |     47,156 |       62,407 |              1.32× |
|     100 | replace.random  |    531,998 |      781,341 |              1.47× |
|     100 | apply.replace   |    244,130 |      631,967 |              2.59× |
|     100 | value.random    |  6,520,938 |   36,127,913 |              5.54× |

#### Space (KiB)

| Indices | Mode         | Estimated allocated memory | MessagePack | MessagePack + gzip |
| ------: | ------------ | -------------------------: | ----------: | -----------------: |
|       2 | Projection   |                       0.84 |        0.03 |               0.04 |
|       2 | Static tuple |                       0.84 |        0.04 |               0.05 |
|       4 | Projection   |                       1.51 |        0.06 |               0.05 |
|       4 | Static tuple |                       1.02 |        0.06 |               0.07 |
|       8 | Projection   |                       2.45 |        0.12 |               0.08 |
|       8 | Static tuple |                       1.49 |        0.10 |               0.09 |
|     100 | Projection   |                      23.34 |        0.67 |               0.57 |
|     100 | Static tuple |                      12.16 |        0.51 |               0.35 |

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
