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

2026-11-27T16:32:46.847Z · [CI run](https://github.com/sovereignbase/sequencer/actions/runs/46034007280)

#### Moderate bundle size

| Format   | Raw (KiB) | Minified (KiB) | Minified + gzip (KiB) |
| -------- | --------: | -------------: | --------------------: |
| ESM      |    199.23 |         162.89 |                 56.49 |
| CommonJS |    199.41 |         164.51 |                 56.69 |

Both bundles include WASM. Terser uses three compression passes; gzip uses level 9.

#### Average throughput during editing to checkpoint

Arithmetic means of 3 runs, in ops/s, from each phase's start to checkpoint.
Strips contain 1–100 Frames (visible entries). Headers show Strip counts and mean Frame counts.

**↑ Scale up (0 → 25,000 Strips)**

| Method / case  | 1,000 Strips<br>50,871 Frames | 5,000 Strips<br>252,214 Frames | 10,000 Strips<br>504,871 Frames | 15,000 Strips<br>758,280 Frames | 20,000 Strips<br>1,010,749 Frames | 25,000 Strips<br>1,264,003 Frames |
| -------------- | ----------------------------: | -----------------------------: | ------------------------------: | ------------------------------: | --------------------------------: | --------------------------------: |
| apply.random   |                       352,116 |                        357,607 |                         361,004 |                         368,692 |                           362,182 |                           356,064 |
| insert.head    |                     1,263,880 |                      1,368,558 |                       1,449,420 |                       1,481,135 |                         1,474,849 |                         1,476,873 |
| insert.random  |                       705,278 |                        739,573 |                         730,058 |                         727,054 |                           679,003 |                           668,775 |
| insert.tail    |                     1,409,798 |                      1,610,993 |                       1,657,619 |                       1,593,311 |                         1,627,501 |                         1,585,941 |
| remove.head    |                             — |                              — |                               — |                               — |                                 — |                                 — |
| remove.random  |                       635,289 |                        578,511 |                         589,427 |                         573,806 |                           573,438 |                           568,946 |
| remove.tail    |                             — |                              — |                               — |                               — |                                 — |                                 — |
| replace.head   |                       512,875 |                        615,255 |                         651,773 |                         659,231 |                           661,658 |                           642,208 |
| replace.random |                       434,987 |                        404,924 |                         414,154 |                         412,701 |                           406,869 |                           406,064 |
| replace.tail   |                       457,385 |                        565,942 |                         617,262 |                         642,858 |                           640,353 |                           634,273 |
| value.head     |                     2,826,483 |                      3,847,327 |                       4,277,322 |                       4,685,136 |                         4,855,863 |                         4,986,334 |
| value.random   |                     1,551,696 |                      1,232,481 |                       1,142,406 |                       1,110,420 |                         1,066,749 |                         1,038,843 |
| value.tail     |                     4,961,535 |                      6,535,572 |                       7,048,015 |                       7,770,026 |                         8,161,743 |                         8,367,262 |

**↓ Scale down (25,000 → 0 Strips)**

| Method / case  | 20,000 Strips<br>1,012,742 Frames | 15,000 Strips<br>755,860 Frames | 10,000 Strips<br>504,103 Frames | 5,000 Strips<br>251,203 Frames | 1,000 Strips<br>51,057 Frames | 0 Strips<br>0 Frames |
| -------------- | --------------------------------: | ------------------------------: | ------------------------------: | -----------------------------: | ----------------------------: | -------------------: |
| apply.random   |                           372,554 |                         368,275 |                         379,203 |                        381,641 |                       389,543 |              393,063 |
| insert.head    |                                 — |                               — |                               — |                              — |                             — |                    — |
| insert.random  |                           590,060 |                         613,144 |                         639,414 |                        665,149 |                       684,618 |              693,849 |
| insert.tail    |                                 — |                               — |                               — |                              — |                             — |                    — |
| remove.head    |                           943,935 |                         954,046 |                         895,649 |                        923,159 |                       941,666 |              944,872 |
| remove.random  |                           588,031 |                         597,778 |                         606,898 |                        624,961 |                       641,495 |              648,965 |
| remove.tail    |                         1,052,408 |                       1,057,885 |                       1,061,871 |                      1,074,317 |                     1,080,821 |            1,083,339 |
| replace.head   |                           604,411 |                         525,216 |                         554,670 |                        557,611 |                       570,009 |              575,458 |
| replace.random |                           416,946 |                         397,905 |                         416,426 |                        423,407 |                       434,450 |              440,568 |
| replace.tail   |                           239,568 |                         239,980 |                          81,643 |                         74,788 |                        84,231 |               87,159 |
| value.head     |                         3,076,655 |                       3,090,382 |                       3,121,262 |                      3,141,437 |                     3,134,858 |            3,151,505 |
| value.random   |                           984,141 |                         981,547 |                       1,006,294 |                      1,033,560 |                     1,064,919 |            1,082,176 |
| value.tail     |                         5,004,581 |                       4,868,295 |                       4,810,352 |                      4,832,211 |                     4,813,569 |            4,846,301 |

#### API throughput at checkpoint

Checkpoint calls, in ops/s, averaged across runs.

**↑ Scale up (0 → 25,000 Strips)**

| Method                            | 1,000 Strips<br>50,871 Frames | 5,000 Strips<br>252,214 Frames | 10,000 Strips<br>504,871 Frames | 15,000 Strips<br>758,280 Frames | 20,000 Strips<br>1,010,749 Frames | 25,000 Strips<br>1,264,003 Frames |
| --------------------------------- | ----------------------------: | -----------------------------: | ------------------------------: | ------------------------------: | --------------------------------: | --------------------------------: |
| new Projection(actorID, sequence) |                         4,914 |                          1,305 |                             678 |                             450 |                               325 |                               277 |
| sequence()                        |                           550 |                            118 |                              78 |                              66 |                                45 |                                38 |
| values()                          |                         1,095 |                            303 |                             182 |                             128 |                               103 |                                80 |

**↓ Scale down (25,000 → 0 Strips)**

| Method                            | 20,000 Strips<br>1,012,742 Frames | 15,000 Strips<br>755,860 Frames | 10,000 Strips<br>504,103 Frames | 5,000 Strips<br>251,203 Frames | 1,000 Strips<br>51,057 Frames | 0 Strips<br>0 Frames |
| --------------------------------- | --------------------------------: | ------------------------------: | ------------------------------: | -----------------------------: | ----------------------------: | -------------------: |
| new Projection(actorID, sequence) |                               313 |                             435 |                             649 |                          1,318 |                         6,279 |               51,905 |
| sequence()                        |                                48 |                              63 |                              78 |                             93 |                           156 |                  729 |
| values()                          |                               103 |                             137 |                             169 |                            362 |                         1,608 |              163,589 |

#### Sequence disk size at checkpoint

Complete exported Sequences, including Footage and acknowledgements. Sizes are in KiB.

**↑ Scale up (0 → 25,000 Strips)**

| Encoding           | 1,000 Strips<br>50,871 Frames | 5,000 Strips<br>252,214 Frames | 10,000 Strips<br>504,871 Frames | 15,000 Strips<br>758,280 Frames | 20,000 Strips<br>1,010,749 Frames | 25,000 Strips<br>1,264,003 Frames |
| ------------------ | ----------------------------: | -----------------------------: | ------------------------------: | ------------------------------: | --------------------------------: | --------------------------------: |
| JSON               |                        277.41 |                       1,621.53 |                        3,265.02 |                        4,929.59 |                          7,103.76 |                          9,256.57 |
| JSON + gzip        |                         14.60 |                          73.42 |                          148.89 |                          225.75 |                            310.64 |                            392.28 |
| MessagePack        |                        164.81 |                         818.92 |                        1,646.03 |                        3,553.60 |                          5,126.26 |                          6,551.31 |
| MessagePack + gzip |                         12.38 |                          61.63 |                          124.81 |                          200.05 |                            263.48 |                            335.07 |

**↓ Scale down (25,000 → 0 Strips)**

| Encoding           | 20,000 Strips<br>1,012,742 Frames | 15,000 Strips<br>755,860 Frames | 10,000 Strips<br>504,103 Frames | 5,000 Strips<br>251,203 Frames | 1,000 Strips<br>51,057 Frames | 0 Strips<br>0 Frames |
| ------------------ | --------------------------------: | ------------------------------: | ------------------------------: | -----------------------------: | ----------------------------: | -------------------: |
| JSON               |                          7,567.15 |                        5,697.21 |                        3,808.45 |                       1,887.78 |                        381.22 |                 0.02 |
| JSON + gzip        |                            326.51 |                          246.99 |                          164.82 |                          79.61 |                         15.97 |                 0.03 |
| MessagePack        |                          5,314.83 |                        3,986.78 |                        2,658.67 |                       1,319.82 |                        266.79 |                 0.01 |
| MessagePack + gzip |                            278.07 |                          209.78 |                          139.97 |                          67.74 |                         13.65 |                 0.03 |

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

2026-11-27T16:35:13.504Z · [CI run](https://github.com/sovereignbase/sequencer/actions/runs/46034007280)

Arithmetic means of 3 runs. Ordinary Projection versus a static tuple with maxLength. Both contain the same values; replacements preserve the field count.

#### Throughput (ops/s)

| Indices | Method / case   | Projection | Static tuple | Tuple / Projection |
| ------: | --------------- | ---------: | -----------: | -----------------: |
|       2 | create.sequence |    887,618 |      787,672 |              0.89× |
|       2 | replace.random  |  1,269,871 |    1,697,620 |              1.34× |
|       2 | apply.replace   |    754,444 |    1,140,975 |              1.51× |
|       2 | value.random    | 34,410,875 |   59,171,604 |              1.72× |
|       4 | create.sequence |    673,803 |      689,055 |              1.02× |
|       4 | replace.random  |  1,082,679 |    1,639,732 |              1.51× |
|       4 | apply.replace   |    654,657 |    1,115,408 |              1.70× |
|       4 | value.random    | 27,779,695 |   62,754,762 |              2.26× |
|       8 | create.sequence |    467,174 |      510,945 |              1.09× |
|       8 | replace.random  |    973,164 |    1,637,181 |              1.68× |
|       8 | apply.replace   |    643,235 |    1,146,295 |              1.78× |
|       8 | value.random    | 21,790,134 |   61,974,904 |              2.84× |
|     100 | create.sequence |     78,379 |       86,318 |              1.10× |
|     100 | replace.random  |  1,025,051 |    1,645,546 |              1.61× |
|     100 | apply.replace   |    669,202 |    1,141,603 |              1.71× |
|     100 | value.random    | 14,960,938 |   60,339,511 |              4.03× |

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

2026-11-27T16:35:52.975Z · [CI run](https://github.com/sovereignbase/sequencer/actions/runs/46034007280)

3 runs; median throughput in ops/s. Sizes are UTF-16 code units.

| Operation            | 1,024 array | 1,024 string | 65,536 array | 65,536 string | 1,048,576 array | 1,048,576 string |
| -------------------- | ----------: | -----------: | -----------: | ------------: | --------------: | ---------------: |
| insert               |     723,202 |    2,081,686 |        3,412 |     2,033,536 |             224 |        1,832,665 |
| insert.append        |      68,877 |      284,303 |          867 |        98,383 |              38 |            1,981 |
| replace              |     420,229 |      722,446 |        2,773 |       618,575 |             188 |          611,284 |
| remove               |     951,059 |      949,016 |      402,392 |     1,124,133 |         111,386 |          780,253 |
| remove.middle        |     649,558 |    1,099,204 |        3,224 |     1,109,182 |             198 |        1,026,288 |
| replace.middle       |     544,606 |      821,390 |        3,110 |       820,749 |             228 |          725,702 |
| apply                |   1,047,661 |    1,126,686 |      702,298 |     1,018,187 |         849,425 |          818,462 |
| apply.array          |   1,697,510 |      641,541 |    1,632,956 |         3,530 |       1,717,390 |              225 |
| concurrent.apply     |      22,388 |      316,833 |          285 |         7,369 |              17 |              526 |
| merge                |     501,038 |      870,471 |        3,478 |       864,606 |             238 |          888,651 |
| create               |     495,947 |    1,053,715 |        3,537 |     1,003,890 |             237 |        1,020,050 |
| value.random         |  24,806,169 |   24,852,418 |   18,580,359 |    22,750,768 |      28,944,714 |       23,322,370 |
| values.range         |  12,053,144 |    7,795,330 |   12,454,008 |     8,488,659 |      11,264,930 |        7,308,204 |
| values.array         |   1,271,917 |      853,927 |        4,082 |         3,562 |             229 |              231 |
| values.text          |     100,225 |   14,461,908 |        1,320 |    19,861,654 |              82 |       18,984,620 |
| sequence.array       |   1,033,378 |      785,500 |        4,061 |         3,607 |             222 |              237 |
| sequence.text        |     154,705 |    4,812,430 |        2,273 |     6,576,361 |              31 |        6,751,707 |
| sequence.edited.text |      93,471 |      639,541 |        1,410 |        16,078 |              26 |              962 |
| sequence.masked.text |     115,374 |      355,814 |        2,255 |       366,472 |              30 |          370,202 |

Encoded snapshots use string Footage in both representations.

#### Memory and encoded size

| UTF-16 code units | Representation | Estimated MiB | Snapshot MessagePack KiB | Snapshot gzip KiB | Gossip MessagePack KiB | Gossip gzip KiB |
| ----------------: | -------------- | ------------: | -----------------------: | ----------------: | ---------------------: | --------------: |
|              1024 | array          |        0.0082 |                     1.02 |              0.05 |                   2.02 |            0.05 |
|              1024 | string         |        0.0023 |                     1.02 |              0.05 |                   1.02 |            0.05 |
|             65536 | array          |        0.5004 |                    64.02 |              0.12 |                 128.02 |            0.18 |
|             65536 | string         |        0.1254 |                    64.02 |              0.12 |                  64.02 |            0.12 |
|           1048576 | array          |        8.0004 |                  1024.02 |              1.05 |                2048.02 |            2.04 |
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

2026-11-27T16:37:25.171Z · [CI run](https://github.com/sovereignbase/sequencer/actions/runs/46034007280)

3 runs, 6,000 edits. Median results; string Footage in both modes.

| Workload   | Words    | Snapshot KiB | Snapshot gzip KiB | Mean update B | Encode ops/s | Load ops/s | Receive batches/s |
| ---------- | -------- | -----------: | ----------------: | ------------: | -----------: | ---------: | ----------------: |
| append     | unpacked |         5.90 |              3.61 |         22.88 |       40,429 |    216,091 |               388 |
| append     | packed   |         5.90 |              3.61 |         13.98 |       36,311 |    269,052 |               397 |
| prepend    | unpacked |        40.07 |             18.07 |         22.94 |        2,612 |        968 |               277 |
| prepend    | packed   |         5.90 |              3.61 |         13.99 |       36,040 |      1,821 |               299 |
| random     | unpacked |       138.05 |             57.31 |         39.88 |          677 |        236 |               112 |
| random     | packed   |        49.58 |             35.37 |         23.45 |       28,622 |        591 |               138 |
| concurrent | unpacked |        92.23 |             42.75 |         32.34 |          945 |        259 |               144 |
| concurrent | packed   |        38.94 |             28.17 |         20.71 |       30,466 |        459 |               159 |

Measured on Node 24.22.3, V8 13.6.233.17-node.63, linux x64, AMD EPYC 7763 64-Core Processor. Random and concurrent workloads mix insertion, removal and replacement. Concurrent authors edit independent views. Sizes use MessagePack; updates are encoded individually. Load includes decoding and construction. Receive includes decoding and applying one complete edit batch. Preparation, checks, destruction and explicit JS process garbage collection are outside timings.

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

2026-11-27T16:37:45.962Z · [CI run](https://github.com/sovereignbase/sequencer/actions/runs/46034007280)

3 runs, 6,000 edits per author. Concurrent authors edit independent views; causal authors exchange history before the second author edits. Median results.

| Workload              | Mode       | Author edits/s | Apply edits/s | Receive edits/s | Update/author KiB | Document KiB | Memory MiB |
| --------------------- | ---------- | -------------: | ------------: | --------------: | ----------------: | -----------: | ---------: |
| append                | individual |      1,901,286 |     2,862,727 |       1,417,657 |             76.05 |         5.99 |      0.012 |
| append                | batch      |      2,036,249 |   780,843,311 |     456,794,823 |              5.88 |         5.99 |      0.012 |
| prepend               | individual |      1,578,610 |     1,852,902 |       1,549,199 |             76.11 |         5.99 |      0.896 |
| prepend               | batch      |      1,780,230 |     3,747,487 |       3,349,427 |              5.89 |         5.99 |      0.896 |
| random.characters     | individual |      1,107,083 |     1,866,659 |       1,217,447 |             82.09 |        28.31 |      0.917 |
| random.characters     | batch      |      1,159,392 |     2,230,166 |       2,120,520 |             22.95 |        28.31 |      0.917 |
| random.words          | individual |      1,153,376 |     1,758,406 |       1,075,147 |            125.68 |        73.88 |      0.991 |
| random.words          | batch      |      1,196,044 |     2,076,292 |       1,944,341 |             59.71 |        73.88 |      0.991 |
| concurrent.characters | individual |      1,322,786 |     1,551,242 |         975,441 |             82.04 |        56.41 |      1.834 |
| concurrent.characters | batch      |      1,323,010 |     1,973,661 |       1,804,233 |             22.92 |        56.41 |      1.834 |
| concurrent.words      | individual |      1,351,688 |     1,571,207 |         890,601 |            125.74 |       147.81 |      1.981 |
| concurrent.words      | batch      |      1,185,068 |     1,916,476 |       1,733,534 |             59.79 |       147.81 |      1.981 |
| concurrent.mixed      | individual |        790,946 |     1,083,448 |         899,821 |            154.61 |        97.83 |      1.505 |
| concurrent.mixed      | batch      |        984,614 |     1,411,226 |       1,259,428 |             56.88 |        97.82 |      1.505 |
| causal.characters     | individual |      1,069,233 |     1,651,497 |       1,265,308 |             88.96 |        63.81 |      1.842 |
| causal.characters     | batch      |      1,311,984 |     2,005,317 |       1,775,234 |             23.18 |        63.81 |      1.842 |
| causal.words          | individual |      1,158,111 |     1,496,337 |       1,042,118 |            135.13 |       156.41 |      1.989 |
| causal.words          | batch      |      1,175,839 |     1,834,324 |       1,651,315 |             60.68 |       156.41 |      1.989 |
| causal.mixed          | individual |        771,632 |     1,159,007 |         728,556 |            161.05 |       103.75 |      1.509 |
| causal.mixed          | batch      |        970,533 |     1,368,038 |       1,296,037 |             57.34 |       103.75 |      1.509 |

Measured on Node 24.22.3, V8 13.6.233.17-node.63, linux x64, AMD EPYC 7763 64-Core Processor. Both modes group each author's binary Gossip into one MessagePack message. Batch Footage is uncompressed. Receive includes MessagePack decoding; apply excludes it. Document size follows complete acknowledgement exchange. Memory estimates use one receiver recreated from that compact checkpoint in a fresh runtime, excluding the author runtime. Preparation, verification, destruction and explicit JS process garbage collection are outside timings.

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

2026-11-27T16:32:25.579Z · [CI run](https://github.com/sovereignbase/sequencer/actions/runs/46034007280)

The latest verification passed 403 Vitest tests and 153 compatibility checks.
The configured 100% coverage threshold is met (100% statements, 100% branches, 100% functions, 100% lines).
See the [test suites](test/README.md) and
[automated test report](https://sovereignbase.dev/sequencer/tests/).

### Works everywhere where JavaScript and Wasm works

2026-11-27T16:32:25.586Z · [CI run](https://github.com/sovereignbase/sequencer/actions/runs/46034007280)

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
