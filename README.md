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
- [Batch](#batch) · [Usage](#batch-usage) · [Benchmarks](#batch-benchmarks)
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

projectionA.apply(replaceAcknowledgement?.[1])

const removeDelta = projectionA.remove(0, 0)
console.log(projectionA.value(0)) // undefined

const removeAcknowledgement = projectionB.apply(removeDelta)
console.log(projectionB.value(0)) // undefined

projectionA.apply(removeAcknowledgement?.[1])

const serializable = projectionA.sequence()

const acknowledgements = projectionB.merge(serializable)
projectionA.apply(acknowledgements?.[1])

projectionA.destroy()
projectionB.destroy()
```

<a id="projection-benchmarks"></a>

### Benchmarks

<!-- BEGIN GENERATED:projection:benchmarks -->

2026-11-27T22:04:09.294Z · [CI run](https://github.com/sovereignbase/sequencer/actions/runs/46073953475)

#### Moderate bundle size

| Format   | Raw (KiB) | Minified (KiB) | Minified + gzip (KiB) |
| -------- | --------: | -------------: | --------------------: |
| ESM      |    202.56 |         165.86 |                 56.94 |
| CommonJS |    202.74 |         167.48 |                 57.15 |

Both bundles include WASM. Terser uses three compression passes; gzip uses level 9.

#### Average throughput during editing to checkpoint

Arithmetic means of 3 runs, in ops/s, from each phase's start to checkpoint.
Strips contain 1–100 Frames (visible entries). Headers show Strip counts and mean Frame counts.

**↑ Scale up (0 → 25,000 Strips)**

| Method / case  | 1,000 Strips<br>50,871 Frames | 5,000 Strips<br>252,214 Frames | 10,000 Strips<br>504,871 Frames | 15,000 Strips<br>758,280 Frames | 20,000 Strips<br>1,010,749 Frames | 25,000 Strips<br>1,264,003 Frames |
| -------------- | ----------------------------: | -----------------------------: | ------------------------------: | ------------------------------: | --------------------------------: | --------------------------------: |
| apply.random   |                       511,566 |                        522,338 |                         497,924 |                         483,457 |                           479,435 |                           475,838 |
| insert.head    |                     1,753,163 |                      1,889,244 |                       1,920,085 |                       1,927,059 |                         1,916,648 |                         1,912,543 |
| insert.random  |                     1,041,976 |                      1,059,107 |                       1,006,064 |                         996,550 |                           938,762 |                           936,069 |
| insert.tail    |                     1,974,128 |                      2,195,413 |                       2,213,896 |                       2,107,771 |                         2,138,935 |                         2,074,415 |
| remove.head    |                             — |                              — |                               — |                               — |                                 — |                                 — |
| remove.random  |                       938,708 |                        843,079 |                         807,164 |                         806,409 |                           813,019 |                           811,270 |
| remove.tail    |                             — |                              — |                               — |                               — |                                 — |                                 — |
| replace.head   |                       742,289 |                        823,765 |                         867,619 |                         871,249 |                           872,982 |                           811,276 |
| replace.random |                       645,089 |                        599,194 |                         581,858 |                         568,706 |                           557,882 |                           559,463 |
| replace.tail   |                       666,468 |                        784,318 |                         792,194 |                         821,804 |                           820,886 |                           770,025 |
| value.head     |                     4,035,038 |                      5,486,567 |                       6,021,395 |                       6,427,558 |                         6,644,118 |                         6,727,968 |
| value.random   |                     2,489,292 |                      1,831,957 |                       1,601,534 |                       1,522,576 |                         1,473,436 |                         1,450,499 |
| value.tail     |                     7,353,537 |                      8,847,770 |                       9,116,697 |                       9,748,470 |                        10,165,418 |                        10,434,218 |

**↓ Scale down (25,000 → 0 Strips)**

| Method / case  | 20,000 Strips<br>1,012,742 Frames | 15,000 Strips<br>755,860 Frames | 10,000 Strips<br>504,103 Frames | 5,000 Strips<br>251,203 Frames | 1,000 Strips<br>51,057 Frames | 0 Strips<br>0 Frames |
| -------------- | --------------------------------: | ------------------------------: | ------------------------------: | -----------------------------: | ----------------------------: | -------------------: |
| apply.random   |                           492,348 |                         494,104 |                         501,632 |                        509,979 |                       521,712 |              526,356 |
| insert.head    |                                 — |                               — |                               — |                              — |                             — |                    — |
| insert.random  |                           814,577 |                         864,276 |                         908,086 |                        948,859 |                       974,173 |              987,717 |
| insert.tail    |                                 — |                               — |                               — |                              — |                             — |                    — |
| remove.head    |                         1,261,150 |                       1,278,690 |                       1,199,194 |                      1,238,288 |                     1,257,901 |            1,263,090 |
| remove.random  |                           832,817 |                         858,277 |                         878,452 |                        908,669 |                       930,297 |              941,501 |
| remove.tail    |                         1,340,132 |                       1,361,065 |                       1,378,275 |                      1,398,941 |                     1,406,275 |            1,411,058 |
| replace.head   |                           790,042 |                         736,028 |                         770,900 |                        782,856 |                       798,239 |              804,324 |
| replace.random |                           560,045 |                         548,021 |                         577,695 |                        591,320 |                       613,209 |              622,514 |
| replace.tail   |                           571,435 |                         348,951 |                         305,514 |                        357,676 |                       374,075 |              383,232 |
| value.head     |                         4,139,615 |                       4,096,927 |                       4,111,528 |                      4,171,053 |                     4,216,266 |            4,256,788 |
| value.random   |                         1,347,373 |                       1,372,210 |                       1,416,264 |                      1,455,139 |                     1,505,293 |            1,535,924 |
| value.tail     |                         5,791,722 |                       5,882,063 |                       5,934,457 |                      6,035,224 |                     6,150,736 |            6,216,768 |

#### API throughput at checkpoint

Checkpoint calls, in ops/s, averaged across runs.

**↑ Scale up (0 → 25,000 Strips)**

| Method                            | 1,000 Strips<br>50,871 Frames | 5,000 Strips<br>252,214 Frames | 10,000 Strips<br>504,871 Frames | 15,000 Strips<br>758,280 Frames | 20,000 Strips<br>1,010,749 Frames | 25,000 Strips<br>1,264,003 Frames |
| --------------------------------- | ----------------------------: | -----------------------------: | ------------------------------: | ------------------------------: | --------------------------------: | --------------------------------: |
| new Projection(actorID, sequence) |                         6,281 |                          1,692 |                             841 |                             579 |                               401 |                               347 |
| sequence()                        |                           670 |                            167 |                              97 |                              79 |                                52 |                                47 |
| values()                          |                         1,462 |                            439 |                             230 |                             150 |                               122 |                               100 |

**↓ Scale down (25,000 → 0 Strips)**

| Method                            | 20,000 Strips<br>1,012,742 Frames | 15,000 Strips<br>755,860 Frames | 10,000 Strips<br>504,103 Frames | 5,000 Strips<br>251,203 Frames | 1,000 Strips<br>51,057 Frames | 0 Strips<br>0 Frames |
| --------------------------------- | --------------------------------: | ------------------------------: | ------------------------------: | -----------------------------: | ----------------------------: | -------------------: |
| new Projection(actorID, sequence) |                               391 |                             545 |                             809 |                          1,632 |                         6,831 |               75,467 |
| sequence()                        |                                63 |                              70 |                              99 |                            127 |                           176 |                  997 |
| values()                          |                               124 |                             175 |                             276 |                            549 |                         1,769 |              246,153 |

#### Sequence disk size at checkpoint

Complete exported Sequences, including Footage and acknowledgements. Sizes are in KiB.

**↑ Scale up (0 → 25,000 Strips)**

| Encoding           | 1,000 Strips<br>50,871 Frames | 5,000 Strips<br>252,214 Frames | 10,000 Strips<br>504,871 Frames | 15,000 Strips<br>758,280 Frames | 20,000 Strips<br>1,010,749 Frames | 25,000 Strips<br>1,264,003 Frames |
| ------------------ | ----------------------------: | -----------------------------: | ------------------------------: | ------------------------------: | --------------------------------: | --------------------------------: |
| JSON               |                        277.40 |                       1,620.42 |                        3,264.58 |                        4,929.12 |                          7,100.77 |                          9,258.47 |
| JSON + gzip        |                         14.59 |                          73.43 |                          148.94 |                          225.88 |                            310.57 |                            392.54 |
| MessagePack        |                        164.81 |                         818.92 |                        1,646.03 |                        3,553.60 |                          5,126.26 |                          6,551.31 |
| MessagePack + gzip |                         12.38 |                          61.63 |                          124.81 |                          200.05 |                            263.47 |                            335.09 |

**↓ Scale down (25,000 → 0 Strips)**

| Encoding           | 20,000 Strips<br>1,012,742 Frames | 15,000 Strips<br>755,860 Frames | 10,000 Strips<br>504,103 Frames | 5,000 Strips<br>251,203 Frames | 1,000 Strips<br>51,057 Frames | 0 Strips<br>0 Frames |
| ------------------ | --------------------------------: | ------------------------------: | ------------------------------: | -----------------------------: | ----------------------------: | -------------------: |
| JSON               |                          7,566.08 |                        5,699.45 |                        3,808.05 |                       1,889.47 |                        380.93 |                 0.02 |
| JSON + gzip        |                            326.48 |                          247.15 |                          164.81 |                          79.69 |                         15.98 |                 0.03 |
| MessagePack        |                          5,314.83 |                        3,983.52 |                        2,657.04 |                       1,319.71 |                        266.79 |                 0.01 |
| MessagePack + gzip |                            278.14 |                          209.83 |                          140.04 |                          67.75 |                         13.66 |                 0.03 |

#### Memory usage at checkpoint

One instance after checkpoint compaction and recreation: live native allocation plus retained JS array slots and string code units, in MiB (1,048,576 bytes). Unused WASM capacity is excluded.

**↑ Scale up (0 → 25,000 Strips)**

| Measurement            | 1,000 Strips<br>50,871 Frames | 5,000 Strips<br>252,214 Frames | 10,000 Strips<br>504,871 Frames | 15,000 Strips<br>758,280 Frames | 20,000 Strips<br>1,010,749 Frames | 25,000 Strips<br>1,264,003 Frames |
| ---------------------- | ----------------------------: | -----------------------------: | ------------------------------: | ------------------------------: | --------------------------------: | --------------------------------: |
| Estimated memory (MiB) |                          0.62 |                           3.09 |                            6.19 |                            9.43 |                             12.82 |                             16.28 |

**↓ Scale down (25,000 → 0 Strips)**

| Measurement            | 20,000 Strips<br>1,012,742 Frames | 15,000 Strips<br>755,860 Frames | 10,000 Strips<br>504,103 Frames | 5,000 Strips<br>251,203 Frames | 1,000 Strips<br>51,057 Frames | 0 Strips<br>0 Frames |
| ---------------------- | --------------------------------: | ------------------------------: | ------------------------------: | -----------------------------: | ----------------------------: | -------------------: |
| Estimated memory (MiB) |                             13.34 |                            9.90 |                            7.14 |                           4.08 |                          1.81 |                 1.23 |

Measured on Node 24.22.3, V8 13.6.233.17-node.63,
linux x64, AMD EPYC 9V74 80-Core Processor.
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

2026-11-27T22:05:59.700Z · [CI run](https://github.com/sovereignbase/sequencer/actions/runs/46073953475)

Arithmetic means of 3 runs. Ordinary Projection versus a static tuple with maxLength. Both contain the same values; replacements preserve the field count.

#### Throughput (ops/s)

| Indices | Method / case   | Projection | Static tuple | Tuple / Projection |
| ------: | --------------- | ---------: | -----------: | -----------------: |
|       2 | create.sequence |  1,106,374 |    1,012,011 |              0.91× |
|       2 | replace.random  |  1,801,908 |    2,490,016 |              1.38× |
|       2 | apply.replace   |    970,459 |    1,425,182 |              1.47× |
|       2 | value.random    | 41,594,111 |   75,362,193 |              1.81× |
|       4 | create.sequence |    833,747 |      848,237 |              1.02× |
|       4 | replace.random  |  1,346,027 |    2,456,549 |              1.83× |
|       4 | apply.replace   |    877,772 |    1,551,454 |              1.77× |
|       4 | value.random    | 33,022,987 |   75,865,655 |              2.30× |
|       8 | create.sequence |    585,480 |      669,227 |              1.14× |
|       8 | replace.random  |  1,366,798 |    2,537,160 |              1.86× |
|       8 | apply.replace   |    874,157 |    1,495,499 |              1.71× |
|       8 | value.random    | 26,100,025 |   75,361,676 |              2.89× |
|     100 | create.sequence |    104,954 |      106,661 |              1.02× |
|     100 | replace.random  |  1,249,480 |    2,490,062 |              1.99× |
|     100 | apply.replace   |    884,127 |    1,550,163 |              1.75× |
|     100 | value.random    | 17,878,007 |   76,365,608 |              4.27× |

#### Memory and encoded size

| Indices | Mode         | Estimated allocated memory (MiB) | MessagePack (KiB) | MessagePack + gzip (KiB) |
| ------: | ------------ | -------------------------------: | ----------------: | -----------------------: |
|       2 | Projection   |                           0.0006 |              0.03 |                     0.04 |
|       2 | Static tuple |                           0.0007 |              0.04 |                     0.05 |
|       4 | Projection   |                           0.0013 |              0.06 |                     0.05 |
|       4 | Static tuple |                           0.0009 |              0.06 |                     0.07 |
|       8 | Projection   |                           0.0022 |              0.12 |                     0.08 |
|       8 | Static tuple |                           0.0013 |              0.10 |                     0.09 |
|     100 | Projection   |                           0.0196 |              0.67 |                     0.57 |
|     100 | Static tuple |                           0.0110 |              0.51 |                     0.35 |

Measured on Node 24.22.3, V8 13.6.233.17-node.63, linux x64, AMD EPYC 9V74 80-Core Processor. Fixtures are hydrated compacted snapshots after one replacement per field. Each case warms up for ≥25 ms and measures ≥50 ms of API time; mutation bursts restart after 4,096 replacements. Peer authoring, encoding, result checks, destruction and explicit JS process garbage collection are outside API timings. Memory estimates are the increase in live native allocator bytes plus retained JS array slots for one instance, including exercised runtime buffers. Unused WASM capacity, JS object headers and referenced payload objects are excluded.

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

2026-11-27T22:06:40.302Z · [CI run](https://github.com/sovereignbase/sequencer/actions/runs/46073953475)

3 runs; median throughput in ops/s. Sizes are UTF-16 code units.

| Operation            | 1,024 array | 1,024 string | 65,536 array | 65,536 string | 1,048,576 array | 1,048,576 string |
| -------------------- | ----------: | -----------: | -----------: | ------------: | --------------: | ---------------: |
| insert               |     779,188 |    3,136,676 |        4,234 |     2,908,992 |             273 |        2,510,332 |
| insert.append        |      86,234 |      433,695 |          973 |       105,621 |              44 |            2,267 |
| replace              |     491,911 |      931,565 |        3,474 |       979,926 |             238 |          877,673 |
| remove               |   1,279,170 |    1,529,143 |      510,846 |     1,377,240 |         150,057 |        1,292,390 |
| remove.middle        |     718,188 |    1,343,413 |        3,694 |     1,403,604 |             248 |        1,379,726 |
| replace.middle       |     583,774 |      960,542 |        3,667 |     1,045,163 |             271 |          979,902 |
| apply                |   1,589,960 |    1,576,783 |    1,370,471 |     1,525,262 |       1,379,130 |        1,513,625 |
| apply.array          |   2,163,142 |      670,343 |    2,121,846 |         4,372 |       2,168,498 |              251 |
| concurrent.apply     |      31,753 |      426,544 |          370 |         9,413 |              22 |              554 |
| merge                |     525,545 |    1,057,321 |        4,210 |     1,065,587 |             260 |        1,029,056 |
| create               |     545,866 |    1,259,348 |        4,265 |     1,286,138 |             266 |        1,301,526 |
| value.random         |  32,147,978 |   29,695,880 |   29,096,037 |    32,597,458 |      33,784,752 |       33,031,917 |
| values.range         |  13,651,234 |   11,226,784 |   12,377,326 |    11,515,320 |      14,954,356 |       10,651,085 |
| values.array         |   1,303,923 |    1,022,823 |        4,411 |         4,387 |             256 |              254 |
| values.text          |     144,286 |   22,600,970 |        1,719 |    21,851,189 |             105 |       22,052,988 |
| sequence.array       |   1,034,021 |      890,508 |        4,552 |         4,351 |             262 |              253 |
| sequence.text        |     193,733 |    9,326,928 |        2,954 |     9,066,014 |              37 |        8,998,520 |
| sequence.edited.text |     183,458 |    2,327,419 |        2,954 |       217,152 |              41 |           15,209 |
| sequence.masked.text |     154,624 |      447,360 |        2,851 |       449,764 |              41 |          446,167 |

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

Measured on Node 24.22.3, V8 13.6.233.17-node.63, linux x64, AMD EPYC 9V74 80-Core Processor. Splitting and text assembly are included where required; peer preparation, encoding and explicit JS process garbage collection are outside API timings.

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

2026-11-27T22:08:10.619Z · [CI run](https://github.com/sovereignbase/sequencer/actions/runs/46073953475)

3 runs, 6,000 edits. Median results; string Footage in both modes.

| Workload   | Words    | Snapshot KiB | Snapshot gzip KiB | Mean update B | Encode ops/s | Load ops/s | Receive batches/s |
| ---------- | -------- | -----------: | ----------------: | ------------: | -----------: | ---------: | ----------------: |
| append     | unpacked |         5.90 |              3.61 |         22.88 |       63,682 |    275,430 |               444 |
| append     | packed   |         5.90 |              3.61 |         13.98 |       62,717 |    402,380 |               499 |
| prepend    | unpacked |        40.07 |             18.07 |         22.94 |        3,436 |      1,239 |               369 |
| prepend    | packed   |         5.90 |              3.62 |         13.99 |       65,918 |      2,385 |               418 |
| random     | unpacked |       138.05 |             57.31 |         39.88 |          875 |        319 |               137 |
| random     | packed   |        49.58 |             35.37 |         23.45 |       35,079 |        752 |               184 |
| concurrent | unpacked |        92.22 |             42.78 |         32.34 |        1,255 |        387 |               173 |
| concurrent | packed   |        38.94 |             28.21 |         20.71 |       40,384 |        823 |               214 |

Measured on Node 24.22.3, V8 13.6.233.17-node.63, linux x64, AMD EPYC 9V74 80-Core Processor. Random and concurrent workloads mix insertion, removal and replacement. Concurrent authors edit independent views. Sizes use MessagePack; updates are encoded individually. Load includes decoding and construction. Receive includes decoding and applying one complete edit batch. Preparation, checks, destruction and explicit JS process garbage collection are outside timings.

[Full words results](benchmark/.results/words.md).

<!-- END GENERATED:words:benchmarks -->

## Batch

Collect local edits into one packed Gossip. Edits are immediately visible;
Footage stays in JavaScript.

<a id="batch-usage"></a>

### Usage

```ts
const projection = new Projection<string>(1)
const peer = new Projection<string>(2)
projection.apply([[1], [2]])
peer.apply([[1], [2]])
const gossip = projection.batch((edit) => {
  edit.insert('hello', 0)
  edit.replace('H', 0, 0)
})
const result = peer.apply(gossip, true, true)
projection.apply(result?.[1] ?? [])
projection.destroy()
peer.destroy()
```

<a id="batch-benchmarks"></a>

### Benchmarks

<!-- BEGIN GENERATED:batch:benchmarks -->

2026-11-27T22:08:29.187Z · [CI run](https://github.com/sovereignbase/sequencer/actions/runs/46073953475)

3 runs, 6,000 edits per author. Concurrent authors edit independent views; causal authors exchange history before the second author edits. Median results.

| Workload              | Mode       | Author edits/s | Apply edits/s | Receive edits/s | Update/author KiB | Document KiB | Memory MiB |
| --------------------- | ---------- | -------------: | ------------: | --------------: | ----------------: | -----------: | ---------: |
| append                | individual |      2,660,884 |     5,312,847 |       2,100,397 |             76.05 |         5.99 |      0.012 |
| append                | batch      |      4,085,170 |   653,310,105 |     606,980,273 |              5.88 |         5.99 |      0.012 |
| prepend               | individual |      2,149,846 |     3,630,838 |       1,934,161 |             76.11 |         5.99 |      0.896 |
| prepend               | batch      |      2,499,339 |     4,404,646 |       4,099,722 |              5.89 |         5.99 |      0.896 |
| random.characters     | individual |      1,415,712 |     1,590,080 |       1,497,444 |             82.09 |        28.31 |      0.917 |
| random.characters     | batch      |      1,524,250 |     2,607,666 |       2,499,494 |             22.95 |        28.31 |      0.917 |
| random.words          | individual |      1,515,178 |     2,030,855 |       1,473,380 |            125.68 |        73.88 |      0.991 |
| random.words          | batch      |      1,446,242 |     2,482,447 |       2,307,486 |             59.71 |        73.88 |      0.991 |
| concurrent.characters | individual |      1,766,899 |     1,790,774 |       1,451,264 |             82.04 |        56.41 |      1.834 |
| concurrent.characters | batch      |      1,763,784 |     2,394,476 |       2,116,147 |             22.92 |        56.41 |      1.834 |
| concurrent.words      | individual |      1,734,867 |     1,898,623 |       1,306,316 |            125.74 |       147.81 |      1.981 |
| concurrent.words      | batch      |      1,593,953 |     2,331,747 |       2,035,777 |             59.79 |       147.81 |      1.981 |
| concurrent.mixed      | individual |      1,035,248 |     1,331,925 |       1,082,464 |            154.61 |        97.83 |      1.505 |
| concurrent.mixed      | batch      |      1,168,971 |     1,739,353 |       1,591,171 |             56.88 |        97.82 |      1.505 |
| causal.characters     | individual |      1,471,811 |     1,997,798 |       1,456,535 |             88.96 |        63.81 |      1.842 |
| causal.characters     | batch      |      1,570,224 |     2,420,118 |       2,117,056 |             23.18 |        63.81 |      1.842 |
| causal.words          | individual |      1,537,442 |     1,823,500 |       1,331,409 |            135.13 |       156.41 |      1.989 |
| causal.words          | batch      |      1,692,940 |     2,242,878 |       1,992,645 |             60.68 |       156.41 |      1.989 |
| causal.mixed          | individual |        980,487 |     1,343,116 |       1,065,694 |            161.05 |       103.75 |      1.509 |
| causal.mixed          | batch      |      1,198,249 |     1,688,168 |       1,559,943 |             57.34 |       103.75 |      1.509 |

Measured on Node 24.22.3, V8 13.6.233.17-node.63, linux x64, AMD EPYC 9V74 80-Core Processor. Both modes group each author's binary Gossip into one MessagePack message. Batch Footage is uncompressed. Receive includes MessagePack decoding; apply excludes it. Document size follows complete acknowledgement exchange. Memory estimates use one receiver recreated from that compact checkpoint in a fresh runtime, excluding the author runtime. Preparation, verification, destruction and explicit JS process garbage collection are outside timings.

[Full batch results](benchmark/.results/batch.md).

<!-- END GENERATED:batch:benchmarks -->

## Errors

| Code                      | Meaning                                                             |
| ------------------------- | ------------------------------------------------------------------- |
| `PROJECTION_DESTROYED`    | An operation was called after the Projection was destroyed.         |
| `BATCH_CLOSED`            | An editor was used after its batch callback finished.               |
| `NATIVE_OPERATION_FAILED` | The native runtime reported an initialization or operation failure. |
| `STRING_ENCODING_FAILED`  | Footage concatenation as text failed.                               |
| `UNKNOWN_ERROR`           | All other errors.                                                   |

Invalid input to `apply()` or `merge()` returns `undefined` instead of throwing.

## Tests

### Behaviour guaranteed by excessive tests

2026-11-27T22:03:54.238Z · [CI run](https://github.com/sovereignbase/sequencer/actions/runs/46073953475)

The latest verification passed 404 Vitest tests and 153 compatibility checks.
The configured 100% coverage threshold is met (100% statements, 100% branches, 100% functions, 100% lines).
See the [test suites](test/README.md) and
[automated test report](https://sovereignbase.dev/sequencer/tests/).

### Works everywhere where JavaScript and Wasm works

2026-11-27T22:03:54.244Z · [CI run](https://github.com/sovereignbase/sequencer/actions/runs/46073953475)

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
