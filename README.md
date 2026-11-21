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
- [Packed words](#packed-words) · [Usage](#packed-words-usage) · [Benchmarks](#packed-words-benchmarks)
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

2026-11-21T13:58:25.277Z · [CI run](https://github.com/sovereignbase/sequencer/actions/runs/44911211827)

#### Moderate bundle size

| Format   | Raw (KiB) | Minified (KiB) | Minified + gzip (KiB) |
| -------- | --------: | -------------: | --------------------: |
| ESM      |    180.23 |         147.54 |                 50.66 |
| CommonJS |    180.39 |         148.90 |                 50.84 |

Both bundles include WASM. Terser uses three compression passes; gzip uses level 9.

#### Average throughput during editing to checkpoint

Arithmetic means of 3 runs, in ops/s, from each phase's start to checkpoint.
Strips contain 1–100 Frames (visible entries). Headers show Strip counts and mean Frame counts.

**↑ Scale up (0 → 25,000 Strips)**

| Method / case  | 1,000 Strips<br>50,871 Frames | 5,000 Strips<br>252,214 Frames | 10,000 Strips<br>504,871 Frames | 15,000 Strips<br>758,280 Frames | 20,000 Strips<br>1,010,749 Frames | 25,000 Strips<br>1,264,003 Frames |
| -------------- | ----------------------------: | -----------------------------: | ------------------------------: | ------------------------------: | --------------------------------: | --------------------------------: |
| apply.random   |                       354,404 |                        368,416 |                         368,965 |                         375,828 |                           371,969 |                           366,253 |
| insert.head    |                     1,389,315 |                      1,346,875 |                       1,191,343 |                       1,318,238 |                         1,335,566 |                         1,379,803 |
| insert.random  |                       849,717 |                        816,767 |                         806,855 |                         836,294 |                           801,069 |                           800,009 |
| insert.tail    |                     1,696,475 |                      1,799,445 |                       1,837,151 |                       1,766,728 |                         1,774,182 |                         1,693,127 |
| remove.head    |                             — |                              — |                               — |                               — |                                 — |                                 — |
| remove.random  |                       577,488 |                        529,268 |                         536,192 |                         537,531 |                           537,319 |                           533,881 |
| remove.tail    |                             — |                              — |                               — |                               — |                                 — |                                 — |
| replace.head   |                       497,081 |                        527,839 |                         516,615 |                         535,313 |                           547,273 |                           534,742 |
| replace.random |                       440,829 |                        429,210 |                         425,028 |                         422,222 |                           415,975 |                           416,741 |
| replace.tail   |                       477,506 |                        537,758 |                         577,544 |                         591,283 |                           585,874 |                           562,725 |
| value.head     |                     3,095,405 |                      3,938,562 |                       4,349,651 |                       4,695,243 |                         4,886,647 |                         5,005,457 |
| value.random   |                     1,803,542 |                      1,577,231 |                       1,475,000 |                       1,444,328 |                         1,407,720 |                         1,388,244 |
| value.tail     |                     5,595,309 |                      6,641,216 |                       7,339,744 |                       8,057,912 |                         8,371,982 |                         8,652,249 |

**↓ Scale down (25,000 → 0 Strips)**

| Method / case  | 20,000 Strips<br>1,012,742 Frames | 15,000 Strips<br>755,860 Frames | 10,000 Strips<br>504,103 Frames | 5,000 Strips<br>251,203 Frames | 1,000 Strips<br>51,057 Frames | 0 Strips<br>0 Frames |
| -------------- | --------------------------------: | ------------------------------: | ------------------------------: | -----------------------------: | ----------------------------: | -------------------: |
| apply.random   |                           380,522 |                         378,805 |                         372,455 |                        383,453 |                       391,386 |              393,657 |
| insert.head    |                                 — |                               — |                               — |                              — |                             — |                    — |
| insert.random  |                           700,613 |                         739,452 |                         770,454 |                        799,209 |                       818,027 |              827,271 |
| insert.tail    |                                 — |                               — |                               — |                              — |                             — |                    — |
| remove.head    |                           764,176 |                         774,187 |                         740,189 |                        753,617 |                       699,553 |              703,325 |
| remove.random  |                           539,262 |                         554,700 |                         563,192 |                        552,750 |                       565,155 |              571,208 |
| remove.tail    |                           828,105 |                         845,832 |                         851,289 |                        853,446 |                       856,039 |              857,504 |
| replace.head   |                           556,824 |                         536,771 |                         542,528 |                        540,946 |                       503,359 |              508,311 |
| replace.random |                           369,879 |                         382,676 |                         406,223 |                        386,781 |                       402,435 |              408,160 |
| replace.tail   |                           147,313 |                          70,320 |                          84,189 |                         91,510 |                        99,325 |              102,594 |
| value.head     |                         3,442,877 |                       3,558,226 |                       3,631,896 |                      3,672,735 |                     3,696,850 |            3,717,174 |
| value.random   |                         1,279,317 |                       1,304,252 |                       1,338,118 |                      1,366,369 |                     1,390,058 |            1,411,330 |
| value.tail     |                         6,106,192 |                       6,072,519 |                       5,997,588 |                      6,014,817 |                     6,080,442 |            6,117,595 |

#### API throughput at checkpoint

Checkpoint calls, in ops/s, averaged across runs.

**↑ Scale up (0 → 25,000 Strips)**

| Method                            | 1,000 Strips<br>50,871 Frames | 5,000 Strips<br>252,214 Frames | 10,000 Strips<br>504,871 Frames | 15,000 Strips<br>758,280 Frames | 20,000 Strips<br>1,010,749 Frames | 25,000 Strips<br>1,264,003 Frames |
| --------------------------------- | ----------------------------: | -----------------------------: | ------------------------------: | ------------------------------: | --------------------------------: | --------------------------------: |
| new Projection(actorID, sequence) |                         4,593 |                          1,444 |                             717 |                             473 |                               330 |                               277 |
| sequence()                        |                           559 |                            149 |                              94 |                              73 |                                51 |                                43 |
| values()                          |                         1,269 |                            389 |                             216 |                             137 |                               109 |                                89 |

**↓ Scale down (25,000 → 0 Strips)**

| Method                            | 20,000 Strips<br>1,012,742 Frames | 15,000 Strips<br>755,860 Frames | 10,000 Strips<br>504,103 Frames | 5,000 Strips<br>251,203 Frames | 1,000 Strips<br>51,057 Frames | 0 Strips<br>0 Frames |
| --------------------------------- | --------------------------------: | ------------------------------: | ------------------------------: | -----------------------------: | ----------------------------: | -------------------: |
| new Projection(actorID, sequence) |                               323 |                             457 |                             690 |                          1,431 |                         6,940 |               69,754 |
| sequence()                        |                                59 |                              60 |                              93 |                            114 |                           187 |                  763 |
| values()                          |                               112 |                             141 |                             232 |                            428 |                         1,871 |              210,274 |

#### Sequence disk size at checkpoint

Complete exported Sequences, including Footage and acknowledgements. Sizes are in KiB.

**↑ Scale up (0 → 25,000 Strips)**

| Encoding           | 1,000 Strips<br>50,871 Frames | 5,000 Strips<br>252,214 Frames | 10,000 Strips<br>504,871 Frames | 15,000 Strips<br>758,280 Frames | 20,000 Strips<br>1,010,749 Frames | 25,000 Strips<br>1,264,003 Frames |
| ------------------ | ----------------------------: | -----------------------------: | ------------------------------: | ------------------------------: | --------------------------------: | --------------------------------: |
| JSON               |                        277.52 |                       1,620.47 |                        3,263.94 |                        4,932.24 |                          7,106.09 |                          9,262.02 |
| JSON + gzip        |                         14.59 |                          73.47 |                          148.98 |                          226.00 |                            310.78 |                            392.48 |
| MessagePack        |                        164.81 |                         818.92 |                        1,646.03 |                        3,553.60 |                          5,126.26 |                          6,551.31 |
| MessagePack + gzip |                         12.38 |                          61.63 |                          124.81 |                          200.05 |                            263.47 |                            335.06 |

**↓ Scale down (25,000 → 0 Strips)**

| Encoding           | 20,000 Strips<br>1,012,742 Frames | 15,000 Strips<br>755,860 Frames | 10,000 Strips<br>504,103 Frames | 5,000 Strips<br>251,203 Frames | 1,000 Strips<br>51,057 Frames | 0 Strips<br>0 Frames |
| ------------------ | --------------------------------: | ------------------------------: | ------------------------------: | -----------------------------: | ----------------------------: | -------------------: |
| JSON               |                          7,573.01 |                        5,704.93 |                        3,812.52 |                       1,890.14 |                        381.38 |                 0.02 |
| JSON + gzip        |                            326.63 |                          247.30 |                          164.90 |                          79.63 |                         15.96 |                 0.03 |
| MessagePack        |                          5,314.83 |                        3,986.78 |                        2,658.67 |                       1,319.82 |                        266.79 |                 0.01 |
| MessagePack + gzip |                            278.06 |                          209.80 |                          139.96 |                          67.72 |                         13.65 |                 0.03 |

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
linux x64, AMD EPYC 7763 64-Core Processor.
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

2026-11-21T14:00:45.955Z · [CI run](https://github.com/sovereignbase/sequencer/actions/runs/44911211827)

Arithmetic means of 3 runs. Ordinary Projection versus a static tuple with maxLength. Both contain the same values; replacements preserve the field count.

#### Throughput (ops/s)

| Indices | Method / case   | Projection | Static tuple | Tuple / Projection |
| ------: | --------------- | ---------: | -----------: | -----------------: |
|       2 | create.sequence |    805,368 |      715,568 |              0.89× |
|       2 | replace.random  |  1,077,977 |    1,661,426 |              1.54× |
|       2 | apply.replace   |    666,437 |    1,013,541 |              1.52× |
|       2 | value.random    | 37,057,756 |   60,969,086 |              1.65× |
|       4 | create.sequence |    631,317 |      618,666 |              0.98× |
|       4 | replace.random  |    856,608 |    1,629,030 |              1.90× |
|       4 | apply.replace   |    609,957 |    1,087,129 |              1.78× |
|       4 | value.random    | 26,155,558 |   61,256,256 |              2.34× |
|       8 | create.sequence |    478,699 |      496,372 |              1.04× |
|       8 | replace.random  |    913,893 |    1,544,792 |              1.69× |
|       8 | apply.replace   |    617,312 |    1,059,039 |              1.72× |
|       8 | value.random    | 20,611,094 |   62,737,990 |              3.04× |
|     100 | create.sequence |     84,999 |       88,390 |              1.04× |
|     100 | replace.random  |    900,044 |    1,655,061 |              1.84× |
|     100 | apply.replace   |    615,624 |    1,096,672 |              1.78× |
|     100 | value.random    | 14,418,477 |   61,815,857 |              4.29× |

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

Measured on Node 24.22.3, V8 13.6.233.17-node.63, linux x64, AMD EPYC 7763 64-Core Processor. Fixtures are hydrated compacted snapshots after one replacement per field. Each case warms up for ≥25 ms and measures ≥50 ms of API time; mutation bursts restart after 4,096 replacements. Peer authoring, encoding, result checks, destruction and explicit JS process garbage collection are outside API timings. Memory estimates are the increase in live native allocator bytes plus retained JS array slots for one instance, including exercised runtime buffers. Unused WASM capacity, JS object headers and referenced payload objects are excluded.

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

2026-11-21T14:01:25.368Z · [CI run](https://github.com/sovereignbase/sequencer/actions/runs/44911211827)

3 runs; median throughput in ops/s. Sizes are UTF-16 code units.

| Operation            | 1,024 array | 1,024 string | 65,536 array | 65,536 string | 1,048,576 array | 1,048,576 string |
| -------------------- | ----------: | -----------: | -----------: | ------------: | --------------: | ---------------: |
| insert               |     722,179 |    2,356,330 |        3,256 |     2,875,573 |             234 |        2,324,803 |
| insert.append        |      72,233 |      299,620 |          884 |       104,859 |              39 |            2,054 |
| replace              |     234,306 |      649,237 |        1,516 |       589,105 |              94 |          608,107 |
| remove               |     332,002 |    1,088,192 |        2,464 |       904,067 |             174 |          830,264 |
| remove.middle        |     701,439 |    1,095,221 |        3,152 |     1,131,811 |             225 |        1,036,346 |
| replace.middle       |     532,740 |      801,743 |        3,235 |       819,823 |             225 |          778,687 |
| apply                |   1,101,311 |      974,156 |      804,304 |     1,079,533 |         739,555 |          997,699 |
| apply.array          |   1,875,578 |      615,436 |    1,754,896 |         3,706 |       1,741,236 |              236 |
| concurrent.apply     |      22,683 |      331,521 |          288 |         7,734 |              17 |              536 |
| merge                |     550,000 |      987,180 |        3,622 |       922,184 |             244 |          920,534 |
| create               |     486,667 |      843,702 |        3,670 |       894,092 |             246 |          884,586 |
| value.random         |  29,079,808 |   24,448,545 |   19,747,161 |    23,965,054 |      20,736,248 |       25,517,785 |
| values.range         |  11,782,364 |    8,558,664 |   10,316,418 |     8,970,108 |      11,245,580 |        6,707,919 |
| values.array         |   1,348,865 |    1,047,459 |        4,197 |         3,689 |             236 |              242 |
| values.text          |     107,817 |   19,979,096 |        1,350 |    20,193,060 |              82 |       20,349,976 |
| sequence.array       |   1,003,732 |      894,943 |        4,217 |         3,677 |             237 |              239 |
| sequence.text        |     165,834 |    6,532,887 |        2,418 |     5,591,333 |              31 |        6,311,548 |
| sequence.edited.text |      98,464 |      520,275 |        1,595 |        15,116 |              29 |              927 |
| sequence.masked.text |     120,110 |      336,145 |        2,412 |       330,838 |              31 |          335,737 |

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

Measured on Node 24.22.3, V8 13.6.233.17-node.63, linux x64, AMD EPYC 7763 64-Core Processor. Splitting and text assembly are included where required; peer preparation, encoding and explicit JS process garbage collection are outside API timings.

[Full text results](benchmark/.results/text.md).

<!-- END GENERATED:text:benchmarks -->

## Packed words

<a id="packed-words-usage"></a>

### Usage

Unpacked words remain the default. The optional final `binaryEncode` argument
returns `Uint8Array` metadata for binary serializers such as MessagePack.
Footage keeps its existing array or string representation.

```ts
const projection = new Projection<string>(1)
const gossip = projection.insert('Hello', 0, true)
const snapshot = projection.sequence(true, true)
const replica = new Projection<string>(2, snapshot, undefined, true)
replica.apply(projection.remove(0, 0, true), true, true)
projection.destroy()
replica.destroy()
```

<a id="packed-words-benchmarks"></a>

### Benchmarks

<!-- BEGIN GENERATED:words:benchmarks -->

2026-11-21T14:01:49.360Z · [CI run](https://github.com/sovereignbase/sequencer/actions/runs/44911211827)

3 runs, 6,000 edits. Median results; string Footage in both modes.

| Workload   | Words    | Snapshot KiB | Snapshot gzip KiB | Mean update B | Encode ops/s | Load ops/s | Receive batches/s |
| ---------- | -------- | -----------: | ----------------: | ------------: | -----------: | ---------: | ----------------: |
| append     | unpacked |         5.90 |              3.61 |         22.88 |       40,815 |    226,159 |               382 |
| append     | packed   |         5.90 |              3.61 |         13.98 |       52,747 |    267,425 |               418 |
| prepend    | unpacked |        40.07 |             18.07 |         22.94 |        2,524 |        826 |               300 |
| prepend    | packed   |        17.62 |              3.67 |         14.99 |       33,416 |      1,338 |               333 |
| random     | unpacked |       138.05 |             57.31 |         39.88 |          678 |        308 |               121 |
| random     | packed   |        54.84 |             36.96 |         29.60 |       23,979 |        618 |               128 |
| concurrent | unpacked |        92.23 |             42.75 |         32.34 |          937 |        298 |               145 |
| concurrent | packed   |        42.46 |             28.93 |         23.69 |       22,352 |        458 |               157 |

Measured on Node 24.22.3, V8 13.6.233.17-node.63, linux x64, AMD EPYC 7763 64-Core Processor. Random and concurrent workloads mix insertion, removal and replacement. Concurrent authors edit independent views. Sizes use MessagePack; updates are encoded individually. Load includes decoding and construction. Receive includes decoding and applying one complete edit batch. Preparation, checks, destruction and explicit JS process garbage collection are outside timings.

[Full words results](benchmark/.results/words.md).

<!-- END GENERATED:words:benchmarks -->

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

2026-11-21T13:58:04.452Z · [CI run](https://github.com/sovereignbase/sequencer/actions/runs/44911211827)

The latest verification passed 336 Vitest tests and 144 compatibility checks.
The configured 100% coverage threshold is met (100% statements, 100% branches, 100% functions, 100% lines).
See the [test suites](test/README.md) and
[automated test report](https://sovereignbase.dev/sequencer/tests/).

### Works everywhere where JavaScript and Wasm works

2026-11-21T13:58:04.455Z · [CI run](https://github.com/sovereignbase/sequencer/actions/runs/44911211827)

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
