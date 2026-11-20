[![npm version](https://img.shields.io/npm/v/@sovereignbase/sequencer)](https://www.npmjs.com/package/@sovereignbase/sequencer)
[![JSR](https://jsr.io/badges/@sovereignbase/sequencer)](https://jsr.io/@sovereignbase/sequencer)
[![CI](https://github.com/sovereignbase/sequencer/actions/workflows/ci.yaml/badge.svg?branch=master)](https://github.com/sovereignbase/sequencer/actions/workflows/ci.yaml)
[![codecov](https://codecov.io/gh/sovereignbase/sequencer/branch/master/graph/badge.svg)](https://codecov.io/gh/sovereignbase/sequencer)
[![license](https://img.shields.io/npm/l/@sovereignbase/sequencer)](https://github.com/sovereignbase/sequencer/blob/master/LICENSE)

# Sequencer

Sequencer provides a total order guarantee for distributed editing. It allows independently operating actors to make concurrent edits and eventually converge on the same state without relying on network arrival order or perfectly synchronized clocks.

## Contents

- [Projection](#projection) · [Usage](#projection-usage) · [Benchmarks](#projection-benchmarks)
- [Tuple mode](#tuple-mode) · [Usage](#tuple-usage) · [Benchmarks](#tuple-benchmarks)
- [Text mode](#text-mode) · [Usage](#text-usage) · [Benchmarks](#text-benchmarks)
- [Errors](#errors) · [Tests](#tests)
- [Credits](#credits) · [License](#license)

## Projection

<a id="projection-usage"></a>

### Usage

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

projectionA.apply(replaceAcknowledgement?.[1] ?? [])

const removeDelta = projectionA.remove(0, 0)
console.log(projectionA.value(0)) // undefined

const removeAcknowledgement = projectionB.apply(removeDelta)
console.log(projectionB.value(0)) // undefined

projectionA.apply(removeAcknowledgement?.[1] ?? [])

const serializable = projectionA.sequence()

const acknowledgements = projectionB.merge(serializable)
projectionA.apply(acknowledgements?.[1] ?? [])

projectionA.destroy()
projectionB.destroy()
```

<a id="projection-benchmarks"></a>

### Benchmarks

<!-- BEGIN GENERATED:projection:benchmarks -->

2026-11-20T20:27:58.876Z · [CI run](https://github.com/sovereignbase/sequencer/actions/runs/44811048570)

#### Moderate bundle size

| Format   | Raw (KiB) | Minified (KiB) | Minified + gzip (KiB) |
| -------- | --------: | -------------: | --------------------: |
| ESM      |    151.04 |         121.31 |                 43.98 |
| CommonJS |    151.20 |         122.61 |                 44.17 |

Both bundles include WASM. Terser uses three compression passes; gzip uses level 9.

#### Average throughput during editing to checkpoint

Arithmetic means of 3 runs, in ops/s, from each phase's start to checkpoint.
Strips contain 1–100 Frames (visible entries). Headers show Strip counts and mean Frame counts.

**↑ Scale up (0 → 25,000 Strips)**

| Method / case  | 1,000 Strips<br>50,871 Frames | 5,000 Strips<br>252,214 Frames | 10,000 Strips<br>504,871 Frames | 15,000 Strips<br>758,280 Frames | 20,000 Strips<br>1,010,749 Frames | 25,000 Strips<br>1,264,003 Frames |
| -------------- | ----------------------------: | -----------------------------: | ------------------------------: | ------------------------------: | --------------------------------: | --------------------------------: |
| apply.random   |                       520,904 |                        457,970 |                         433,059 |                         433,487 |                           430,744 |                           410,566 |
| insert.head    |                     1,762,599 |                      1,763,334 |                       1,894,527 |                       1,997,629 |                         1,954,030 |                         1,976,047 |
| insert.random  |                     1,059,621 |                        962,275 |                         873,303 |                         860,019 |                           819,913 |                           811,647 |
| insert.tail    |                     2,389,932 |                      2,352,645 |                       2,325,474 |                       2,147,767 |                         2,146,361 |                         2,019,699 |
| remove.head    |                             — |                              — |                               — |                               — |                                 — |                                 — |
| remove.random  |                       772,585 |                        587,686 |                         558,891 |                         554,826 |                           555,254 |                           550,710 |
| remove.tail    |                             — |                              — |                               — |                               — |                                 — |                                 — |
| replace.head   |                       728,412 |                        726,636 |                         732,888 |                         736,375 |                           746,488 |                           717,635 |
| replace.random |                       540,331 |                        404,556 |                         414,612 |                         416,166 |                           420,138 |                           423,360 |
| replace.tail   |                       676,503 |                        714,045 |                         745,090 |                         759,509 |                           756,589 |                           766,683 |
| value.head     |                     4,632,552 |                      5,531,816 |                       6,008,928 |                       6,444,534 |                         6,715,724 |                         6,840,927 |
| value.random   |                     2,033,435 |                      1,340,407 |                       1,187,245 |                       1,135,856 |                         1,113,068 |                         1,094,826 |
| value.tail     |                     7,738,885 |                      8,763,395 |                       9,330,862 |                       9,921,319 |                        10,357,481 |                        10,614,624 |

**↓ Scale down (25,000 → 0 Strips)**

| Method / case  | 20,000 Strips<br>1,012,742 Frames | 15,000 Strips<br>755,860 Frames | 10,000 Strips<br>504,103 Frames | 5,000 Strips<br>251,203 Frames | 1,000 Strips<br>51,057 Frames | 0 Strips<br>0 Frames |
| -------------- | --------------------------------: | ------------------------------: | ------------------------------: | -----------------------------: | ----------------------------: | -------------------: |
| apply.random   |                           428,057 |                         421,327 |                         404,648 |                        416,896 |                       428,650 |              434,615 |
| insert.head    |                                 — |                               — |                               — |                              — |                             — |                    — |
| insert.random  |                           683,464 |                         709,313 |                         721,947 |                        715,190 |                       742,765 |              757,374 |
| insert.tail    |                                 — |                               — |                               — |                              — |                             — |                    — |
| remove.head    |                           934,667 |                         929,062 |                         864,779 |                        899,829 |                       919,222 |              926,299 |
| remove.random  |                           539,545 |                         542,714 |                         539,895 |                        534,342 |                       550,164 |              559,735 |
| remove.tail    |                         1,052,222 |                       1,063,226 |                       1,058,248 |                      1,069,988 |                     1,077,076 |            1,082,421 |
| replace.head   |                           655,587 |                         625,014 |                         612,941 |                        617,907 |                       624,002 |              628,896 |
| replace.random |                           431,875 |                         417,111 |                         427,710 |                        422,747 |                       437,821 |              445,667 |
| replace.tail   |                           405,632 |                         118,228 |                          99,115 |                        115,433 |                       124,573 |              128,632 |
| value.head     |                         3,498,299 |                       3,527,912 |                       3,504,979 |                      3,525,996 |                     3,539,402 |            3,572,101 |
| value.random   |                         1,028,182 |                       1,017,995 |                       1,020,071 |                      1,040,262 |                     1,069,641 |            1,094,118 |
| value.tail     |                         5,906,689 |                       5,647,691 |                       5,455,547 |                      5,424,522 |                     5,443,442 |            5,492,133 |

#### API throughput at checkpoint

Checkpoint calls, in ops/s, averaged across runs.

**↑ Scale up (0 → 25,000 Strips)**

| Method                            | 1,000 Strips<br>50,871 Frames | 5,000 Strips<br>252,214 Frames | 10,000 Strips<br>504,871 Frames | 15,000 Strips<br>758,280 Frames | 20,000 Strips<br>1,010,749 Frames | 25,000 Strips<br>1,264,003 Frames |
| --------------------------------- | ----------------------------: | -----------------------------: | ------------------------------: | ------------------------------: | --------------------------------: | --------------------------------: |
| new Projection(actorID, sequence) |                         6,777 |                          1,782 |                             976 |                             626 |                               429 |                               351 |
| sequence()                        |                           860 |                            188 |                             107 |                              91 |                                60 |                                52 |
| values()                          |                         1,386 |                            439 |                             224 |                             153 |                               115 |                                95 |

**↓ Scale down (25,000 → 0 Strips)**

| Method                            | 20,000 Strips<br>1,012,742 Frames | 15,000 Strips<br>755,860 Frames | 10,000 Strips<br>504,103 Frames | 5,000 Strips<br>251,203 Frames | 1,000 Strips<br>51,057 Frames | 0 Strips<br>0 Frames |
| --------------------------------- | --------------------------------: | ------------------------------: | ------------------------------: | -----------------------------: | ----------------------------: | -------------------: |
| new Projection(actorID, sequence) |                               411 |                             630 |                             948 |                          1,926 |                         7,542 |               58,023 |
| sequence()                        |                                68 |                              83 |                             100 |                            133 |                           206 |                  894 |
| values()                          |                               120 |                             152 |                             231 |                            422 |                         1,807 |              182,715 |

#### Sequence disk size at checkpoint

Complete exported Sequences, including Footage and acknowledgements. Sizes are in KiB.

**↑ Scale up (0 → 25,000 Strips)**

| Encoding           | 1,000 Strips<br>50,871 Frames | 5,000 Strips<br>252,214 Frames | 10,000 Strips<br>504,871 Frames | 15,000 Strips<br>758,280 Frames | 20,000 Strips<br>1,010,749 Frames | 25,000 Strips<br>1,264,003 Frames |
| ------------------ | ----------------------------: | -----------------------------: | ------------------------------: | ------------------------------: | --------------------------------: | --------------------------------: |
| JSON               |                        277.64 |                       1,619.36 |                        3,265.58 |                        4,934.10 |                          7,102.41 |                          9,255.38 |
| JSON + gzip        |                         14.59 |                          73.43 |                          148.94 |                          226.01 |                            310.71 |                            392.38 |
| MessagePack        |                        164.81 |                         818.92 |                        1,646.03 |                        3,553.60 |                          5,122.51 |                          6,546.40 |
| MessagePack + gzip |                         12.38 |                          61.61 |                          124.78 |                          200.04 |                            263.49 |                            335.26 |

**↓ Scale down (25,000 → 0 Strips)**

| Encoding           | 20,000 Strips<br>1,012,742 Frames | 15,000 Strips<br>755,860 Frames | 10,000 Strips<br>504,103 Frames | 5,000 Strips<br>251,203 Frames | 1,000 Strips<br>51,057 Frames | 0 Strips<br>0 Frames |
| ------------------ | --------------------------------: | ------------------------------: | ------------------------------: | -----------------------------: | ----------------------------: | -------------------: |
| JSON               |                          7,565.23 |                        5,700.70 |                        3,812.36 |                       1,888.90 |                        380.79 |                 0.02 |
| JSON + gzip        |                            326.52 |                          247.21 |                          164.89 |                          79.65 |                         15.97 |                 0.03 |
| MessagePack        |                          5,311.49 |                        3,985.75 |                        2,658.42 |                       1,319.81 |                        266.79 |                 0.01 |
| MessagePack + gzip |                            278.31 |                          209.90 |                          139.99 |                          67.73 |                         13.65 |                 0.03 |

#### Memory usage at checkpoint

One instance after checkpoint compaction and recreation: live native allocation plus retained JS array slots and string code units, in MiB (1,048,576 bytes). Unused WASM capacity is excluded.

**↑ Scale up (0 → 25,000 Strips)**

| Measurement            | 1,000 Strips<br>50,871 Frames | 5,000 Strips<br>252,214 Frames | 10,000 Strips<br>504,871 Frames | 15,000 Strips<br>758,280 Frames | 20,000 Strips<br>1,010,749 Frames | 25,000 Strips<br>1,264,003 Frames |
| ---------------------- | ----------------------------: | -----------------------------: | ------------------------------: | ------------------------------: | --------------------------------: | --------------------------------: |
| Estimated memory (MiB) |                          0.85 |                           4.02 |                            7.33 |                           10.50 |                             13.89 |                             17.03 |

**↓ Scale down (25,000 → 0 Strips)**

| Measurement            | 20,000 Strips<br>1,012,742 Frames | 15,000 Strips<br>755,860 Frames | 10,000 Strips<br>504,103 Frames | 5,000 Strips<br>251,203 Frames | 1,000 Strips<br>51,057 Frames | 0 Strips<br>0 Frames |
| ---------------------- | --------------------------------: | ------------------------------: | ------------------------------: | -----------------------------: | ----------------------------: | -------------------: |
| Estimated memory (MiB) |                             14.17 |                           11.36 |                            8.42 |                           5.56 |                          2.99 |                 1.52 |

Measured on Node 24.22.3, V8 13.6.233.17-node.63,
linux x64, Intel(R) Xeon(R) 6975P-C.
Peer synchronization, encoding and explicit JS process garbage collection are outside API timings.
[Full lifecycle results](benchmark/.results/lifecycle.md) · [Throughput results](benchmark/.results/throughput.md).

<!-- END GENERATED:projection:benchmarks -->

## Tuple mode

<a id="tuple-usage"></a>

### Usage

Each index represents an independent slot. Adding or removing values
never shifts other values. Empty slots return `undefined`.

Omit `maxLength` to allow dynamic growth.

```ts
const tuple = new Projection<string>(1, undefined, { enabled: 1, maxLength: 4 })
tuple.insert(['hello'], 2)
tuple.replace(['world'], 2, 2)
tuple.remove(2, 2)
```

<a id="tuple-benchmarks"></a>

### Benchmarks

<!-- BEGIN GENERATED:tuple:benchmarks -->

2026-11-20T20:29:38.168Z · [CI run](https://github.com/sovereignbase/sequencer/actions/runs/44811048570)

Arithmetic means of 3 runs. Ordinary Projection versus a static tuple with maxLength. Both contain the same values; replacements preserve the field count.

#### Throughput (ops/s)

| Indices | Method / case   | Projection | Static tuple | Tuple / Projection |
| ------: | --------------- | ---------: | -----------: | -----------------: |
|       2 | create.sequence |  1,389,764 |    1,158,795 |              0.83× |
|       2 | replace.random  |  1,679,861 |    2,776,287 |              1.65× |
|       2 | apply.replace   |  1,018,565 |    1,687,773 |              1.66× |
|       2 | value.random    | 47,013,036 |   93,230,315 |              1.98× |
|       4 | create.sequence |  1,093,403 |    1,035,008 |              0.95× |
|       4 | replace.random  |  1,303,559 |    2,764,990 |              2.12× |
|       4 | apply.replace   |    943,622 |    1,729,186 |              1.83× |
|       4 | value.random    | 32,622,876 |   93,034,000 |              2.85× |
|       8 | create.sequence |    758,556 |      819,272 |              1.08× |
|       8 | replace.random  |  1,315,043 |    2,757,137 |              2.10× |
|       8 | apply.replace   |    879,507 |    1,749,682 |              1.99× |
|       8 | value.random    | 25,351,604 |   91,231,418 |              3.60× |
|     100 | create.sequence |    123,945 |      130,200 |              1.05× |
|     100 | replace.random  |  1,231,417 |    2,802,886 |              2.28× |
|     100 | apply.replace   |    900,035 |    1,823,718 |              2.03× |
|     100 | value.random    | 17,776,308 |   90,538,354 |              5.09× |

#### Memory and encoded size

| Indices | Mode         | Estimated allocated memory (MiB) | MessagePack (KiB) | MessagePack + gzip (KiB) |
| ------: | ------------ | -------------------------------: | ----------------: | -----------------------: |
|       2 | Projection   |                           0.0007 |              0.03 |                     0.04 |
|       2 | Static tuple |                           0.0007 |              0.04 |                     0.05 |
|       4 | Projection   |                           0.0014 |              0.06 |                     0.05 |
|       4 | Static tuple |                           0.0009 |              0.06 |                     0.07 |
|       8 | Projection   |                           0.0022 |              0.12 |                     0.08 |
|       8 | Static tuple |                           0.0014 |              0.10 |                     0.09 |
|     100 | Projection   |                           0.0204 |              0.67 |                     0.57 |
|     100 | Static tuple |                           0.0111 |              0.51 |                     0.35 |

Measured on Node 24.22.3, V8 13.6.233.17-node.63, linux x64, Intel(R) Xeon(R) 6975P-C. Fixtures are hydrated compacted snapshots after one replacement per field. Each case warms up for ≥25 ms and measures ≥50 ms of API time; mutation bursts restart after 4,096 replacements. Peer authoring, encoding, result checks, destruction and explicit JS process garbage collection are outside API timings. Memory estimates are the increase in live native allocator bytes plus retained JS array slots for one instance, including exercised runtime buffers. Unused WASM capacity, JS object headers and referenced payload objects are excluded.

[Full tuple results](benchmark/.results/tuple.md).

<!-- END GENERATED:tuple:benchmarks -->

## Text mode

<a id="text-usage"></a>

### Usage

String inputs retain UTF-16 code units without creating character arrays.
Array results remain the default; `true` requests string Footage.

```ts
const text = new Projection<string>(1)
const gossip = text.insert('Hello', 0)
const replica = new Projection<string>(2)
replica.apply(gossip, true)
const visibleText = replica.values(undefined, undefined, true)
const snapshot = replica.sequence(true)
const restored = new Projection<string>(3, snapshot, undefined, true)
text.destroy()
replica.destroy()
restored.destroy()
```

<a id="text-benchmarks"></a>

### Benchmarks

<!-- BEGIN GENERATED:text:benchmarks -->

2026-11-20T20:30:14.425Z · [CI run](https://github.com/sovereignbase/sequencer/actions/runs/44811048570)

3 runs; median throughput in ops/s. Sizes are UTF-16 code units.

| Operation            | 1,024 array | 1,024 string | 65,536 array | 65,536 string | 1,048,576 array | 1,048,576 string |
| -------------------- | ----------: | -----------: | -----------: | ------------: | --------------: | ---------------: |
| insert               |     940,822 |    4,659,772 |        5,109 |     3,818,306 |             301 |        3,713,780 |
| insert.append        |     107,746 |      487,876 |        1,190 |       146,879 |              51 |            2,348 |
| replace              |     307,083 |    1,143,358 |        2,171 |     1,178,774 |             134 |        1,083,602 |
| remove               |     464,117 |    1,940,331 |        4,160 |     1,876,253 |             240 |        1,594,387 |
| remove.middle        |     826,088 |    1,755,977 |        5,546 |     1,810,108 |             292 |        1,653,128 |
| replace.middle       |     692,152 |    1,348,243 |        5,599 |     1,319,741 |             278 |        1,194,267 |
| apply                |   2,216,517 |    2,253,819 |    1,772,611 |     2,016,416 |       1,783,124 |        1,701,913 |
| apply.array          |   3,240,483 |      969,803 |    3,054,696 |         4,878 |       3,182,266 |              297 |
| concurrent.apply     |      30,892 |      572,270 |          410 |         9,187 |              17 |              610 |
| merge                |     745,950 |    1,575,418 |        5,211 |     1,609,246 |             311 |        1,489,268 |
| create               |     696,969 |    1,364,553 |        5,217 |     1,400,803 |             343 |        1,550,764 |
| value.random         |  30,138,097 |   28,727,663 |   29,766,664 |    23,970,393 |      23,963,267 |       23,948,004 |
| values.range         |  12,598,705 |   10,624,033 |   11,562,299 |    10,885,127 |      16,196,129 |       10,790,660 |
| values.array         |   1,688,911 |    1,342,440 |        4,985 |         4,971 |             295 |              311 |
| values.text          |     149,540 |   18,268,407 |        1,949 |    23,599,942 |             119 |       18,667,632 |
| sequence.array       |   1,497,558 |    1,174,715 |        5,098 |         5,011 |             297 |              319 |
| sequence.text        |     244,866 |    9,914,768 |        3,528 |    10,454,745 |              35 |        9,877,768 |
| sequence.edited.text |     156,718 |      818,655 |        2,362 |        19,007 |              31 |            1,095 |
| sequence.masked.text |     183,871 |      428,641 |        3,632 |       427,247 |              35 |          419,129 |

Encoded snapshots use string Footage in both representations.

#### Memory and encoded size

| UTF-16 code units | Representation | Estimated MiB | Snapshot MessagePack KiB | Snapshot gzip KiB | Gossip MessagePack KiB | Gossip gzip KiB |
| ----------------: | -------------- | ------------: | -----------------------: | ----------------: | ---------------------: | --------------: |
|              1024 | array          |        0.0082 |                     1.02 |              0.05 |                   2.02 |            0.05 |
|              1024 | string         |        0.0023 |                     1.02 |              0.05 |                   1.02 |            0.05 |
|             65536 | array          |        0.5004 |                    64.02 |              0.12 |                 128.02 |            0.18 |
|             65536 | string         |        0.1254 |                    64.02 |              0.12 |                  64.02 |            0.12 |
|           1048576 | array          |        8.0004 |                  1024.02 |              1.05 |                2048.02 |            2.05 |
|           1048576 | string         |        2.0004 |                  1024.02 |              1.05 |                1024.02 |            1.05 |

Measured on Node 24.22.3, V8 13.6.233.17-node.63, linux x64, Intel(R) Xeon(R) 6975P-C. Splitting and text assembly are included where required; peer preparation, encoding and explicit JS process garbage collection are outside API timings.

[Full text results](benchmark/.results/text.md).

<!-- END GENERATED:text:benchmarks -->

## Errors

| Code                      | Meaning                                                             |
| ------------------------- | ------------------------------------------------------------------- |
| `PROJECTION_DESTROYED`    | An operation was called after the Projection was destroyed.         |
| `NATIVE_OPERATION_FAILED` | The native runtime reported an initialization or operation failure. |
| `STRING_ENCODING_FAILED`  | Footage concatenation as text failed.                               |
| `UNKNOWN_ERROR`           | All other errors.                                                   |

Invalid input to `apply()` or `merge()` returns `undefined` instead of throwing.

## Tests

### Behaviour guaranteed by excessive tests

2026-11-20T20:27:41.932Z · [CI run](https://github.com/sovereignbase/sequencer/actions/runs/44811048570)

The latest verification passed 303 Vitest tests and 135 compatibility checks.
The configured 100% coverage threshold is met (100% statements, 100% branches, 100% functions, 100% lines).
See the [test suites](test/README.md) and
[automated test report](https://sovereignbase.dev/sequencer/tests/).

### Works everywhere where JavaScript and Wasm works

2026-11-20T20:27:41.934Z · [CI run](https://github.com/sovereignbase/sequencer/actions/runs/44811048570)

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

Licensed under the Apache License, Version 2.0.

Copyright © 2026 Sovereignbase.
