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

2026-11-21T14:18:32.371Z · [CI run](https://github.com/sovereignbase/sequencer/actions/runs/44912963007)

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
| apply.random   |                       458,165 |                        441,602 |                         430,442 |                         435,248 |                           435,834 |                           427,900 |
| insert.head    |                     2,061,020 |                      1,853,944 |                       1,977,558 |                       2,078,715 |                         2,047,280 |                         2,067,440 |
| insert.random  |                     1,065,714 |                      1,010,545 |                         942,141 |                         946,474 |                           913,280 |                           896,388 |
| insert.tail    |                     2,414,432 |                      2,408,123 |                       1,927,364 |                       1,870,934 |                         1,901,543 |                         1,824,313 |
| remove.head    |                             — |                              — |                               — |                               — |                                 — |                                 — |
| remove.random  |                       712,734 |                        588,018 |                         579,204 |                         585,255 |                           587,607 |                           578,762 |
| remove.tail    |                             — |                              — |                               — |                               — |                                 — |                                 — |
| replace.head   |                       708,389 |                        744,009 |                         760,642 |                         767,739 |                           779,790 |                           752,338 |
| replace.random |                       530,783 |                        407,343 |                         411,850 |                         418,142 |                           422,091 |                           422,724 |
| replace.tail   |                       500,831 |                        650,599 |                         602,252 |                         656,181 |                           684,552 |                           709,920 |
| value.head     |                     5,426,758 |                      6,961,423 |                       7,656,941 |                       8,127,586 |                         8,368,041 |                         8,518,400 |
| value.random   |                     2,212,862 |                      1,464,754 |                       1,316,118 |                       1,275,264 |                         1,240,785 |                         1,201,038 |
| value.tail     |                    10,386,273 |                     12,342,982 |                      13,188,197 |                      14,049,581 |                        14,654,929 |                        15,079,492 |

**↓ Scale down (25,000 → 0 Strips)**

| Method / case  | 20,000 Strips<br>1,012,742 Frames | 15,000 Strips<br>755,860 Frames | 10,000 Strips<br>504,103 Frames | 5,000 Strips<br>251,203 Frames | 1,000 Strips<br>51,057 Frames | 0 Strips<br>0 Frames |
| -------------- | --------------------------------: | ------------------------------: | ------------------------------: | -----------------------------: | ----------------------------: | -------------------: |
| apply.random   |                           361,312 |                         383,267 |                         368,316 |                        395,375 |                       414,175 |              419,771 |
| insert.head    |                                 — |                               — |                               — |                              — |                             — |                    — |
| insert.random  |                           717,841 |                         757,388 |                         811,883 |                        866,545 |                       907,085 |              924,629 |
| insert.tail    |                                 — |                               — |                               — |                              — |                             — |                    — |
| remove.head    |                         1,080,833 |                       1,078,646 |                       1,031,534 |                      1,062,364 |                     1,084,825 |            1,090,150 |
| remove.random  |                           531,638 |                         499,615 |                         530,897 |                        541,755 |                       537,537 |              547,652 |
| remove.tail    |                         1,157,907 |                       1,151,274 |                         986,281 |                      1,023,034 |                     1,043,947 |            1,051,088 |
| replace.head   |                           678,866 |                         581,916 |                         613,858 |                        630,421 |                       645,086 |              652,687 |
| replace.random |                           415,849 |                         415,078 |                         440,060 |                        441,263 |                       460,668 |              468,956 |
| replace.tail   |                           497,650 |                         306,932 |                         130,400 |                        135,190 |                       154,470 |              159,136 |
| value.head     |                         4,433,309 |                       4,450,913 |                       4,431,493 |                      4,413,641 |                     4,460,794 |            4,495,085 |
| value.random   |                           982,150 |                       1,013,601 |                       1,081,837 |                      1,146,974 |                     1,201,882 |            1,230,743 |
| value.tail     |                         7,619,173 |                       7,114,805 |                       6,887,569 |                      6,705,069 |                     6,773,815 |            6,845,817 |

#### API throughput at checkpoint

Checkpoint calls, in ops/s, averaged across runs.

**↑ Scale up (0 → 25,000 Strips)**

| Method                            | 1,000 Strips<br>50,871 Frames | 5,000 Strips<br>252,214 Frames | 10,000 Strips<br>504,871 Frames | 15,000 Strips<br>758,280 Frames | 20,000 Strips<br>1,010,749 Frames | 25,000 Strips<br>1,264,003 Frames |
| --------------------------------- | ----------------------------: | -----------------------------: | ------------------------------: | ------------------------------: | --------------------------------: | --------------------------------: |
| new Projection(actorID, sequence) |                         6,400 |                          1,876 |                           1,064 |                             737 |                               474 |                               407 |
| sequence()                        |                           665 |                            149 |                              87 |                              70 |                                52 |                                47 |
| values()                          |                         1,234 |                            332 |                             142 |                             103 |                               100 |                                86 |

**↓ Scale down (25,000 → 0 Strips)**

| Method                            | 20,000 Strips<br>1,012,742 Frames | 15,000 Strips<br>755,860 Frames | 10,000 Strips<br>504,103 Frames | 5,000 Strips<br>251,203 Frames | 1,000 Strips<br>51,057 Frames | 0 Strips<br>0 Frames |
| --------------------------------- | --------------------------------: | ------------------------------: | ------------------------------: | -----------------------------: | ----------------------------: | -------------------: |
| new Projection(actorID, sequence) |                               485 |                             732 |                           1,033 |                          2,193 |                         8,243 |               41,519 |
| sequence()                        |                                55 |                              70 |                              85 |                            115 |                           165 |                  678 |
| values()                          |                               101 |                             134 |                             191 |                            373 |                         1,544 |              130,317 |

#### Sequence disk size at checkpoint

Complete exported Sequences, including Footage and acknowledgements. Sizes are in KiB.

**↑ Scale up (0 → 25,000 Strips)**

| Encoding           | 1,000 Strips<br>50,871 Frames | 5,000 Strips<br>252,214 Frames | 10,000 Strips<br>504,871 Frames | 15,000 Strips<br>758,280 Frames | 20,000 Strips<br>1,010,749 Frames | 25,000 Strips<br>1,264,003 Frames |
| ------------------ | ----------------------------: | -----------------------------: | ------------------------------: | ------------------------------: | --------------------------------: | --------------------------------: |
| JSON               |                        277.41 |                       1,619.88 |                        3,264.57 |                        4,934.23 |                          7,103.60 |                          9,254.86 |
| JSON + gzip        |                         14.60 |                          73.42 |                          148.97 |                          226.04 |                            310.69 |                            392.32 |
| MessagePack        |                        164.81 |                         818.92 |                        1,646.03 |                        3,553.60 |                          5,126.26 |                          6,551.31 |
| MessagePack + gzip |                         12.38 |                          61.64 |                          124.81 |                          200.05 |                            263.46 |                            335.09 |

**↓ Scale down (25,000 → 0 Strips)**

| Encoding           | 20,000 Strips<br>1,012,742 Frames | 15,000 Strips<br>755,860 Frames | 10,000 Strips<br>504,103 Frames | 5,000 Strips<br>251,203 Frames | 1,000 Strips<br>51,057 Frames | 0 Strips<br>0 Frames |
| ------------------ | --------------------------------: | ------------------------------: | ------------------------------: | -----------------------------: | ----------------------------: | -------------------: |
| JSON               |                          7,563.83 |                        5,701.84 |                        3,807.90 |                       1,888.87 |                        381.23 |                 0.02 |
| JSON + gzip        |                            326.54 |                          247.42 |                          164.82 |                          79.62 |                         15.97 |                 0.03 |
| MessagePack        |                          5,314.83 |                        3,986.78 |                        2,656.60 |                       1,319.56 |                        266.79 |                 0.01 |
| MessagePack + gzip |                            278.14 |                          209.79 |                          140.00 |                          67.76 |                         13.65 |                 0.03 |

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
linux x64, AMD EPYC 9V45 96-Core Processor.
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

2026-11-21T14:20:10.084Z · [CI run](https://github.com/sovereignbase/sequencer/actions/runs/44912963007)

Arithmetic means of 3 runs. Ordinary Projection versus a static tuple with maxLength. Both contain the same values; replacements preserve the field count.

#### Throughput (ops/s)

| Indices | Method / case   | Projection | Static tuple | Tuple / Projection |
| ------: | --------------- | ---------: | -----------: | -----------------: |
|       2 | create.sequence |  1,106,907 |      996,817 |              0.90× |
|       2 | replace.random  |  1,656,948 |    2,922,490 |              1.76× |
|       2 | apply.replace   |    835,158 |    1,603,208 |              1.92× |
|       2 | value.random    | 46,861,032 |   97,392,821 |              2.08× |
|       4 | create.sequence |    860,340 |      851,365 |              0.99× |
|       4 | replace.random  |  1,263,849 |    2,833,714 |              2.24× |
|       4 | apply.replace   |    752,618 |    1,774,388 |              2.36× |
|       4 | value.random    | 34,916,163 |   97,066,606 |              2.78× |
|       8 | create.sequence |    666,803 |      718,174 |              1.08× |
|       8 | replace.random  |  1,208,805 |    2,804,785 |              2.32× |
|       8 | apply.replace   |    729,824 |    1,764,036 |              2.42× |
|       8 | value.random    | 29,093,108 |   99,491,532 |              3.42× |
|     100 | create.sequence |    116,591 |      134,981 |              1.16× |
|     100 | replace.random  |  1,194,650 |    2,875,589 |              2.41× |
|     100 | apply.replace   |    726,674 |    1,788,533 |              2.46× |
|     100 | value.random    | 19,393,396 |  101,155,680 |              5.22× |

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

Measured on Node 24.22.3, V8 13.6.233.17-node.63, linux x64, AMD EPYC 9V45 96-Core Processor. Fixtures are hydrated compacted snapshots after one replacement per field. Each case warms up for ≥25 ms and measures ≥50 ms of API time; mutation bursts restart after 4,096 replacements. Peer authoring, encoding, result checks, destruction and explicit JS process garbage collection are outside API timings. Memory estimates are the increase in live native allocator bytes plus retained JS array slots for one instance, including exercised runtime buffers. Unused WASM capacity, JS object headers and referenced payload objects are excluded.

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

2026-11-21T14:21:01.763Z · [CI run](https://github.com/sovereignbase/sequencer/actions/runs/44912963007)

3 runs; median throughput in ops/s. Sizes are UTF-16 code units.

| Operation            | 1,024 array | 1,024 string | 65,536 array | 65,536 string | 1,048,576 array | 1,048,576 string |
| -------------------- | ----------: | -----------: | -----------: | ------------: | --------------: | ---------------: |
| insert               |   1,023,440 |    3,931,544 |        4,776 |     4,098,108 |             279 |        3,318,784 |
| insert.append        |      93,139 |      533,663 |        1,184 |       159,523 |              53 |            2,219 |
| replace              |     352,691 |    1,170,612 |        1,825 |     1,113,946 |             134 |        1,077,277 |
| remove               |     501,028 |    1,744,824 |        3,412 |     1,602,819 |             240 |        1,509,613 |
| remove.middle        |     942,423 |    1,646,470 |        4,280 |     1,592,578 |             304 |        1,505,246 |
| replace.middle       |     799,472 |      995,680 |        4,261 |     1,235,778 |             303 |        1,193,642 |
| apply                |   1,793,396 |    1,721,329 |    1,567,962 |     2,170,886 |       1,569,657 |        1,506,422 |
| apply.array          |   2,523,100 |      945,424 |    2,643,081 |         4,227 |       2,623,927 |              279 |
| concurrent.apply     |      41,997 |      527,975 |          487 |         8,145 |              28 |              602 |
| merge                |     714,349 |    1,382,694 |        4,514 |     1,432,178 |             291 |        1,344,994 |
| create               |     654,592 |    1,291,168 |        4,485 |     1,304,979 |             292 |        1,332,363 |
| value.random         |  29,125,571 |   25,725,775 |   34,391,006 |    38,196,863 |      47,675,843 |       34,751,484 |
| values.range         |  16,863,594 |   14,238,998 |   19,845,607 |    14,433,252 |      20,034,079 |       13,935,565 |
| values.array         |   2,628,346 |    1,730,956 |        4,520 |         4,231 |             312 |              287 |
| values.text          |     205,906 |   28,138,161 |        2,322 |    27,937,436 |             143 |       24,420,386 |
| sequence.array       |   1,702,920 |    1,562,786 |        4,419 |         4,301 |             309 |              289 |
| sequence.text        |     247,114 |    8,772,168 |        3,664 |    11,681,884 |              42 |       10,894,917 |
| sequence.edited.text |     168,028 |      821,309 |        2,546 |        19,710 |              45 |            1,190 |
| sequence.masked.text |     202,357 |      536,551 |        3,996 |       544,526 |              49 |          531,625 |

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

Measured on Node 24.22.3, V8 13.6.233.17-node.63, linux x64, AMD EPYC 9V45 96-Core Processor. Splitting and text assembly are included where required; peer preparation, encoding and explicit JS process garbage collection are outside API timings.

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

2026-11-21T14:21:22.297Z · [CI run](https://github.com/sovereignbase/sequencer/actions/runs/44912963007)

3 runs, 6,000 edits. Median results; string Footage in both modes.

| Workload   | Words    | Snapshot KiB | Snapshot gzip KiB | Mean update B | Encode ops/s | Load ops/s | Receive batches/s |
| ---------- | -------- | -----------: | ----------------: | ------------: | -----------: | ---------: | ----------------: |
| append     | unpacked |         5.90 |              3.61 |         22.88 |       92,074 |    339,077 |               688 |
| append     | packed   |         5.90 |              3.61 |         13.98 |       94,075 |    418,427 |               837 |
| prepend    | unpacked |        40.07 |             18.07 |         22.94 |        5,270 |      1,472 |               579 |
| prepend    | packed   |        17.62 |              3.67 |         14.99 |       79,677 |      2,211 |               625 |
| random     | unpacked |       138.05 |             57.31 |         39.88 |        1,178 |        360 |               193 |
| random     | packed   |        54.84 |             36.96 |         29.60 |       43,066 |      1,067 |               227 |
| concurrent | unpacked |        92.24 |             42.77 |         32.34 |        1,617 |        427 |               243 |
| concurrent | packed   |        42.46 |             29.09 |         23.69 |       49,978 |      1,202 |               276 |

Measured on Node 24.22.3, V8 13.6.233.17-node.63, linux x64, AMD EPYC 9V45 96-Core Processor. Random and concurrent workloads mix insertion, removal and replacement. Concurrent authors edit independent views. Sizes use MessagePack; updates are encoded individually. Load includes decoding and construction. Receive includes decoding and applying one complete edit batch. Preparation, checks, destruction and explicit JS process garbage collection are outside timings.

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

2026-11-21T14:18:16.567Z · [CI run](https://github.com/sovereignbase/sequencer/actions/runs/44912963007)

The latest verification passed 336 Vitest tests and 144 compatibility checks.
The configured 100% coverage threshold is met (100% statements, 100% branches, 100% functions, 100% lines).
See the [test suites](test/README.md) and
[automated test report](https://sovereignbase.dev/sequencer/tests/).

### Works everywhere where JavaScript and Wasm works

2026-11-21T14:18:16.570Z · [CI run](https://github.com/sovereignbase/sequencer/actions/runs/44912963007)

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
