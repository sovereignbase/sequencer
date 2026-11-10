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
| apply.random   |                       167,872 |                        114,358 |                         106,773 |                         101,674 |                            99,428 |                            94,969 |
| insert.head    |                     1,161,667 |                        923,355 |                       1,086,867 |                       1,212,878 |                         1,246,547 |                         1,289,876 |
| insert.random  |                       493,306 |                        304,235 |                         251,327 |                         226,806 |                           204,477 |                           191,590 |
| insert.tail    |                     1,366,377 |                      1,113,378 |                       1,285,546 |                       1,317,297 |                         1,370,610 |                         1,342,424 |
| remove.head    |                             — |                              — |                               — |                               — |                                 — |                                 — |
| remove.random  |                       315,244 |                        191,216 |                         149,141 |                         130,823 |                           117,075 |                           107,722 |
| remove.tail    |                             — |                              — |                               — |                               — |                                 — |                                 — |
| replace.head   |                       432,969 |                        431,014 |                         432,724 |                         428,099 |                           451,049 |                           449,277 |
| replace.random |                       280,185 |                        176,152 |                         139,558 |                         122,609 |                           109,490 |                           102,435 |
| replace.tail   |                       397,687 |                        379,264 |                         446,211 |                         479,146 |                           492,578 |                           507,475 |
| value.head     |                     2,390,359 |                      2,934,899 |                       3,377,594 |                       3,700,157 |                         3,877,081 |                         3,996,236 |
| value.random   |                       701,166 |                        289,845 |                         199,941 |                         165,709 |                           145,265 |                           131,942 |
| value.tail     |                     4,656,344 |                      4,754,862 |                       4,885,986 |                       5,049,799 |                         5,156,931 |                         5,169,035 |

**↓ Scale down (25,000 → 0 Strips)**

| Method / case  | 20,000 Strips<br>1,012,742 Frames | 15,000 Strips<br>755,860 Frames | 10,000 Strips<br>504,103 Frames | 5,000 Strips<br>251,203 Frames | 1,000 Strips<br>51,057 Frames | 0 Strips<br>0 Frames |
| -------------- | --------------------------------: | ------------------------------: | ------------------------------: | -----------------------------: | ----------------------------: | -------------------: |
| apply.random   |                           108,920 |                         111,949 |                         115,567 |                        120,767 |                       126,737 |              129,561 |
| insert.head    |                                 — |                               — |                               — |                              — |                             — |                    — |
| insert.random  |                           317,996 |                         333,747 |                         343,274 |                        357,907 |                       374,680 |              383,116 |
| insert.tail    |                                 — |                               — |                               — |                              — |                             — |                    — |
| remove.head    |                           739,316 |                         753,553 |                         631,505 |                        666,471 |                       686,740 |              691,633 |
| remove.random  |                           210,504 |                         215,298 |                         224,229 |                        235,476 |                       246,274 |              251,668 |
| remove.tail    |                           620,307 |                         640,086 |                         643,047 |                        583,231 |                       604,037 |              609,487 |
| replace.head   |                           458,061 |                         470,856 |                         484,066 |                        492,851 |                       499,863 |              503,138 |
| replace.random |                           206,085 |                         207,995 |                         215,327 |                        222,039 |                       231,029 |              235,629 |
| replace.tail   |                           209,965 |                         113,703 |                          64,805 |                         55,883 |                        58,662 |               60,741 |
| value.head     |                         2,893,862 |                       2,946,109 |                       2,934,181 |                      2,948,090 |                     2,981,197 |            3,002,371 |
| value.random   |                           327,472 |                         338,069 |                         346,789 |                        360,058 |                       377,545 |              387,876 |
| value.tail     |                         4,198,677 |                       4,157,661 |                       4,130,106 |                      4,118,959 |                     4,164,963 |            4,212,211 |

### API throughput at checkpoint

Checkpoint calls, in ops/s, averaged across runs.

**↑ Scale up (0 → 25,000 Strips)**

| Method                            | 1,000 Strips<br>50,871 Frames | 5,000 Strips<br>252,214 Frames | 10,000 Strips<br>504,871 Frames | 15,000 Strips<br>758,280 Frames | 20,000 Strips<br>1,010,749 Frames | 25,000 Strips<br>1,264,003 Frames |
| --------------------------------- | ----------------------------: | -----------------------------: | ------------------------------: | ------------------------------: | --------------------------------: | --------------------------------: |
| new Projection(actorID, sequence) |                         4,255 |                          1,014 |                             579 |                             384 |                               265 |                               220 |
| sequence()                        |                           558 |                            115 |                              67 |                              49 |                                37 |                                27 |
| values()                          |                           628 |                            211 |                              57 |                              65 |                                45 |                                50 |

**↓ Scale down (25,000 → 0 Strips)**

| Method                            | 20,000 Strips<br>1,012,742 Frames | 15,000 Strips<br>755,860 Frames | 10,000 Strips<br>504,103 Frames | 5,000 Strips<br>251,203 Frames | 1,000 Strips<br>51,057 Frames | 0 Strips<br>0 Frames |
| --------------------------------- | --------------------------------: | ------------------------------: | ------------------------------: | -----------------------------: | ----------------------------: | -------------------: |
| new Projection(actorID, sequence) |                               254 |                             366 |                             551 |                          1,176 |                         5,283 |               52,647 |
| sequence()                        |                                39 |                              44 |                              57 |                             97 |                           147 |                  702 |
| values()                          |                                46 |                              69 |                              78 |                            142 |                           400 |              136,120 |

### Sequence disk size at checkpoint

Complete exported Sequences, including Footage and acknowledgements. Sizes are in KiB.

**↑ Scale up (0 → 25,000 Strips)**

| Encoding           | 1,000 Strips<br>50,871 Frames | 5,000 Strips<br>252,214 Frames | 10,000 Strips<br>504,871 Frames | 15,000 Strips<br>758,280 Frames | 20,000 Strips<br>1,010,749 Frames | 25,000 Strips<br>1,264,003 Frames |
| ------------------ | ----------------------------: | -----------------------------: | ------------------------------: | ------------------------------: | --------------------------------: | --------------------------------: |
| JSON               |                        277.29 |                       1,617.73 |                        3,264.01 |                        4,933.04 |                          7,106.62 |                          9,260.26 |
| JSON + gzip        |                         14.60 |                          73.38 |                          149.02 |                          226.06 |                            310.75 |                            392.52 |
| MessagePack        |                        164.81 |                         818.92 |                        1,646.03 |                        3,553.60 |                          5,126.26 |                          6,551.31 |
| MessagePack + gzip |                         12.38 |                          61.63 |                          124.81 |                          200.05 |                            263.47 |                            335.07 |

**↓ Scale down (25,000 → 0 Strips)**

| Encoding           | 20,000 Strips<br>1,012,742 Frames | 15,000 Strips<br>755,860 Frames | 10,000 Strips<br>504,103 Frames | 5,000 Strips<br>251,203 Frames | 1,000 Strips<br>51,057 Frames | 0 Strips<br>0 Frames |
| ------------------ | --------------------------------: | ------------------------------: | ------------------------------: | -----------------------------: | ----------------------------: | -------------------: |
| JSON               |                          7,571.15 |                        5,705.41 |                        3,808.29 |                       1,888.06 |                        380.62 |                 0.02 |
| JSON + gzip        |                            326.67 |                          247.34 |                          164.72 |                          79.63 |                         15.97 |                 0.03 |
| MessagePack        |                          5,314.83 |                        3,986.78 |                        2,657.64 |                       1,319.71 |                        266.79 |                 0.01 |
| MessagePack + gzip |                            278.13 |                          209.79 |                          139.96 |                          67.75 |                         13.65 |                 0.03 |

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
|       2 | create.sequence |    670,107 |      586,639 |              0.88× |
|       2 | replace.random  |    714,150 |    1,124,107 |              1.57× |
|       2 | apply.replace   |    562,920 |      667,889 |              1.19× |
|       2 | value.random    | 31,862,616 |   62,569,754 |              1.96× |
|       4 | create.sequence |    505,818 |      531,468 |              1.05× |
|       4 | replace.random  |    806,417 |    1,157,048 |              1.43× |
|       4 | apply.replace   |    395,916 |      744,964 |              1.88× |
|       4 | value.random    | 25,658,971 |   59,153,831 |              2.31× |
|       8 | create.sequence |    378,708 |      431,517 |              1.14× |
|       8 | replace.random  |    753,627 |    1,151,756 |              1.53× |
|       8 | apply.replace   |    380,570 |      820,246 |              2.16× |
|       8 | value.random    | 19,714,408 |   62,055,730 |              3.15× |
|     100 | create.sequence |     68,464 |       92,577 |              1.35× |
|     100 | replace.random  |    662,605 |    1,169,669 |              1.77× |
|     100 | apply.replace   |    348,940 |      730,188 |              2.09× |
|     100 | value.random    |  9,364,507 |   63,040,209 |              6.73× |

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
