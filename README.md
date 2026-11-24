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

2026-11-24T12:54:42.437Z · [CI run](https://github.com/sovereignbase/sequencer/actions/runs/45397524890)

#### Moderate bundle size

| Format   | Raw (KiB) | Minified (KiB) | Minified + gzip (KiB) |
| -------- | --------: | -------------: | --------------------: |
| ESM      |    206.08 |         169.60 |                 57.58 |
| CommonJS |    206.26 |         171.20 |                 57.80 |

Both bundles include WASM. Terser uses three compression passes; gzip uses level 9.

#### Average throughput during editing to checkpoint

Arithmetic means of 3 runs, in ops/s, from each phase's start to checkpoint.
Strips contain 1–100 Frames (visible entries). Headers show Strip counts and mean Frame counts.

**↑ Scale up (0 → 25,000 Strips)**

| Method / case  | 1,000 Strips<br>50,871 Frames | 5,000 Strips<br>252,214 Frames | 10,000 Strips<br>504,871 Frames | 15,000 Strips<br>758,280 Frames | 20,000 Strips<br>1,010,749 Frames | 25,000 Strips<br>1,264,003 Frames |
| -------------- | ----------------------------: | -----------------------------: | ------------------------------: | ------------------------------: | --------------------------------: | --------------------------------: |
| apply.random   |                       589,658 |                        466,864 |                         489,948 |                         468,961 |                           478,893 |                           464,367 |
| insert.head    |                     2,476,200 |                      2,109,854 |                       1,733,537 |                       1,891,369 |                         1,918,420 |                         1,998,748 |
| insert.random  |                     1,399,686 |                      1,351,227 |                       1,237,460 |                       1,224,939 |                         1,167,076 |                         1,155,198 |
| insert.tail    |                     2,717,284 |                      2,830,927 |                       2,815,415 |                       2,611,473 |                         2,610,195 |                         2,466,683 |
| remove.head    |                             — |                              — |                               — |                               — |                                 — |                                 — |
| remove.random  |                       905,756 |                        763,886 |                         695,941 |                         642,484 |                           662,089 |                           670,114 |
| remove.tail    |                             — |                              — |                               — |                               — |                                 — |                                 — |
| replace.head   |                       822,753 |                        867,063 |                         885,726 |                         882,886 |                           894,889 |                           866,572 |
| replace.random |                       725,317 |                        606,737 |                         583,188 |                         565,253 |                           560,077 |                           560,155 |
| replace.tail   |                       772,942 |                        834,005 |                         878,270 |                         890,316 |                           890,626 |                           907,749 |
| value.head     |                     5,548,058 |                      6,657,665 |                       7,176,342 |                       7,667,113 |                         8,006,526 |                         8,214,226 |
| value.random   |                     3,457,496 |                      2,178,346 |                       1,899,806 |                       1,773,219 |                         1,706,190 |                         1,654,560 |
| value.tail     |                    10,049,832 |                     11,752,807 |                      12,485,553 |                      13,361,167 |                        13,956,123 |                        14,353,435 |

**↓ Scale down (25,000 → 0 Strips)**

| Method / case  | 20,000 Strips<br>1,012,742 Frames | 15,000 Strips<br>755,860 Frames | 10,000 Strips<br>504,103 Frames | 5,000 Strips<br>251,203 Frames | 1,000 Strips<br>51,057 Frames | 0 Strips<br>0 Frames |
| -------------- | --------------------------------: | ------------------------------: | ------------------------------: | -----------------------------: | ----------------------------: | -------------------: |
| apply.random   |                           519,651 |                         533,143 |                         524,084 |                        541,654 |                       554,042 |              557,933 |
| insert.head    |                                 — |                               — |                               — |                              — |                             — |                    — |
| insert.random  |                           988,278 |                       1,064,655 |                       1,112,240 |                      1,166,668 |                     1,200,694 |            1,217,828 |
| insert.tail    |                                 — |                               — |                               — |                              — |                             — |                    — |
| remove.head    |                         1,140,423 |                       1,175,960 |                       1,131,964 |                      1,005,022 |                     1,039,540 |            1,047,090 |
| remove.random  |                           708,194 |                         647,455 |                         601,475 |                        625,741 |                       656,606 |              668,706 |
| remove.tail    |                         1,265,440 |                       1,277,481 |                       1,107,109 |                      1,144,465 |                     1,167,001 |            1,174,450 |
| replace.head   |                           801,935 |                         784,727 |                         791,852 |                        790,818 |                       797,211 |              803,819 |
| replace.random |                           556,310 |                         557,515 |                         583,095 |                        569,828 |                       590,312 |              599,339 |
| replace.tail   |                            69,081 |                          77,964 |                          89,446 |                        101,544 |                       118,328 |              122,619 |
| value.head     |                         4,590,917 |                       4,769,872 |                       4,841,308 |                      4,906,909 |                     4,990,683 |            5,037,692 |
| value.random   |                         1,515,744 |                       1,569,256 |                       1,628,187 |                      1,681,881 |                     1,732,478 |            1,770,765 |
| value.tail     |                         8,257,044 |                       7,986,176 |                       7,955,332 |                      7,948,593 |                     8,066,578 |            8,157,548 |

#### API throughput at checkpoint

Checkpoint calls, in ops/s, averaged across runs.

**↑ Scale up (0 → 25,000 Strips)**

| Method                            | 1,000 Strips<br>50,871 Frames | 5,000 Strips<br>252,214 Frames | 10,000 Strips<br>504,871 Frames | 15,000 Strips<br>758,280 Frames | 20,000 Strips<br>1,010,749 Frames | 25,000 Strips<br>1,264,003 Frames |
| --------------------------------- | ----------------------------: | -----------------------------: | ------------------------------: | ------------------------------: | --------------------------------: | --------------------------------: |
| new Projection(actorID, sequence) |                         7,063 |                          2,061 |                           1,133 |                             772 |                               534 |                               435 |
| sequence()                        |                           731 |                            180 |                             107 |                              87 |                                61 |                                52 |
| values()                          |                         1,544 |                            480 |                             222 |                             165 |                               127 |                               103 |

**↓ Scale down (25,000 → 0 Strips)**

| Method                            | 20,000 Strips<br>1,012,742 Frames | 15,000 Strips<br>755,860 Frames | 10,000 Strips<br>504,103 Frames | 5,000 Strips<br>251,203 Frames | 1,000 Strips<br>51,057 Frames | 0 Strips<br>0 Frames |
| --------------------------------- | --------------------------------: | ------------------------------: | ------------------------------: | -----------------------------: | ----------------------------: | -------------------: |
| new Projection(actorID, sequence) |                               529 |                             775 |                           1,115 |                          2,258 |                         9,559 |               50,934 |
| sequence()                        |                                68 |                              91 |                             106 |                            138 |                           221 |                  867 |
| values()                          |                               132 |                             181 |                             251 |                            507 |                         2,124 |              177,493 |

#### Sequence disk size at checkpoint

Complete exported Sequences, including Footage and acknowledgements. Sizes are in KiB.

**↑ Scale up (0 → 25,000 Strips)**

| Encoding           | 1,000 Strips<br>50,871 Frames | 5,000 Strips<br>252,214 Frames | 10,000 Strips<br>504,871 Frames | 15,000 Strips<br>758,280 Frames | 20,000 Strips<br>1,010,749 Frames | 25,000 Strips<br>1,264,003 Frames |
| ------------------ | ----------------------------: | -----------------------------: | ------------------------------: | ------------------------------: | --------------------------------: | --------------------------------: |
| JSON               |                        277.64 |                       1,619.85 |                        3,265.34 |                        4,932.75 |                          7,106.69 |                          9,263.61 |
| JSON + gzip        |                         14.59 |                          73.43 |                          149.00 |                          225.91 |                            310.74 |                            392.52 |
| MessagePack        |                        164.81 |                         818.92 |                        1,646.03 |                        3,553.60 |                          5,124.43 |                          6,548.88 |
| MessagePack + gzip |                         12.38 |                          61.63 |                          124.81 |                          200.05 |                            263.61 |                            335.19 |

**↓ Scale down (25,000 → 0 Strips)**

| Encoding           | 20,000 Strips<br>1,012,742 Frames | 15,000 Strips<br>755,860 Frames | 10,000 Strips<br>504,103 Frames | 5,000 Strips<br>251,203 Frames | 1,000 Strips<br>51,057 Frames | 0 Strips<br>0 Frames |
| ------------------ | --------------------------------: | ------------------------------: | ------------------------------: | -----------------------------: | ----------------------------: | -------------------: |
| JSON               |                          7,572.51 |                        5,706.05 |                        3,810.66 |                       1,888.38 |                        381.22 |                 0.02 |
| JSON + gzip        |                            326.43 |                          247.32 |                          164.80 |                          79.58 |                         15.97 |                 0.03 |
| MessagePack        |                          5,313.17 |                        3,986.28 |                        2,658.56 |                       1,319.82 |                        266.79 |                 0.01 |
| MessagePack + gzip |                            278.26 |                          209.86 |                          139.99 |                          67.74 |                         13.65 |                 0.03 |

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

2026-11-24T12:56:09.937Z · [CI run](https://github.com/sovereignbase/sequencer/actions/runs/45397524890)

Arithmetic means of 3 runs. Ordinary Projection versus a static tuple with maxLength. Both contain the same values; replacements preserve the field count.

#### Throughput (ops/s)

| Indices | Method / case   | Projection | Static tuple | Tuple / Projection |
| ------: | --------------- | ---------: | -----------: | -----------------: |
|       2 | create.sequence |  1,217,869 |    1,103,185 |              0.91× |
|       2 | replace.random  |  1,809,289 |    3,296,363 |              1.82× |
|       2 | apply.replace   |  1,015,385 |    1,867,271 |              1.84× |
|       2 | value.random    | 50,762,207 |  103,553,271 |              2.04× |
|       4 | create.sequence |    921,099 |      922,581 |              1.00× |
|       4 | replace.random  |  1,213,463 |    3,155,771 |              2.60× |
|       4 | apply.replace   |    948,053 |    2,062,560 |              2.18× |
|       4 | value.random    | 37,768,965 |  101,514,356 |              2.69× |
|       8 | create.sequence |    716,853 |      767,666 |              1.07× |
|       8 | replace.random  |  1,414,790 |    3,238,223 |              2.29× |
|       8 | apply.replace   |    894,550 |    2,001,417 |              2.24× |
|       8 | value.random    | 30,047,750 |  105,627,053 |              3.52× |
|     100 | create.sequence |    138,064 |      144,499 |              1.05× |
|     100 | replace.random  |  1,317,746 |    2,945,536 |              2.24× |
|     100 | apply.replace   |    905,872 |    2,017,176 |              2.23× |
|     100 | value.random    | 21,175,005 |  106,574,836 |              5.03× |

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

2026-11-24T12:57:00.894Z · [CI run](https://github.com/sovereignbase/sequencer/actions/runs/45397524890)

3 runs; median throughput in ops/s. Sizes are UTF-16 code units.

| Operation            | 1,024 array | 1,024 string | 65,536 array | 65,536 string | 1,048,576 array | 1,048,576 string |
| -------------------- | ----------: | -----------: | -----------: | ------------: | --------------: | ---------------: |
| insert               |   1,177,803 |    4,522,921 |        4,492 |     4,245,030 |             300 |        4,166,582 |
| insert.append        |      98,232 |      538,878 |        1,318 |       179,593 |              56 |            2,456 |
| replace              |     416,341 |    1,252,238 |        1,982 |     1,367,817 |             143 |        1,183,084 |
| remove               |     555,734 |    1,823,888 |        3,782 |     1,859,245 |             264 |        1,656,743 |
| remove.middle        |     995,234 |    1,716,150 |        4,865 |     1,733,146 |             335 |        1,676,993 |
| replace.middle       |     834,249 |    1,056,359 |        4,743 |     1,343,992 |             318 |        1,312,266 |
| apply                |   1,810,803 |    1,785,209 |    1,577,268 |     1,823,118 |       1,635,150 |        1,897,486 |
| apply.array          |   3,190,447 |    1,118,252 |    2,447,916 |         4,421 |       2,828,301 |              297 |
| concurrent.apply     |      45,621 |      557,894 |          511 |         9,066 |              31 |              654 |
| merge                |     795,112 |    1,210,348 |        4,594 |     1,387,404 |             319 |        1,429,973 |
| create               |     745,420 |    1,421,181 |        4,465 |     1,500,430 |             333 |        1,570,404 |
| value.random         |  30,376,271 |   28,830,820 |   29,498,411 |    27,882,878 |      39,950,196 |       35,003,396 |
| values.range         |  19,500,978 |   13,771,946 |   17,938,410 |    11,612,732 |      21,257,869 |       14,293,409 |
| values.array         |   3,124,308 |    1,841,064 |        4,977 |         4,523 |             342 |              309 |
| values.text          |     222,750 |   27,674,723 |        2,564 |    31,113,530 |             155 |       27,052,894 |
| sequence.array       |   2,336,494 |    1,372,593 |        5,035 |         4,487 |             350 |              309 |
| sequence.text        |     280,438 |   11,455,054 |        4,516 |    11,439,598 |              55 |       11,128,897 |
| sequence.edited.text |     176,211 |      912,104 |        3,064 |        21,084 |              49 |            1,296 |
| sequence.masked.text |     210,479 |      536,558 |        4,656 |       538,934 |              55 |          557,795 |

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

2026-11-24T12:57:19.818Z · [CI run](https://github.com/sovereignbase/sequencer/actions/runs/45397524890)

3 runs, 6,000 edits. Median results; string Footage in both modes.

| Workload   | Words    | Snapshot KiB | Snapshot gzip KiB | Mean update B | Encode ops/s | Load ops/s | Receive batches/s |
| ---------- | -------- | -----------: | ----------------: | ------------: | -----------: | ---------: | ----------------: |
| append     | unpacked |         5.90 |              3.61 |         22.88 |      100,112 |    384,139 |               675 |
| append     | packed   |         5.90 |              3.61 |         13.98 |       96,240 |    424,809 |               812 |
| prepend    | unpacked |        40.07 |             18.07 |         22.94 |        5,187 |      1,488 |               543 |
| prepend    | packed   |         5.90 |              3.62 |         13.99 |       91,660 |      2,387 |               620 |
| random     | unpacked |       138.05 |             57.31 |         39.88 |        1,236 |        460 |               206 |
| random     | packed   |        49.58 |             35.38 |         23.45 |       49,618 |      1,088 |               264 |
| concurrent | unpacked |        92.24 |             42.71 |         32.34 |        1,679 |        439 |               263 |
| concurrent | packed   |        38.94 |             28.17 |         20.71 |       58,507 |        773 |               296 |

Measured on Node 24.22.3, V8 13.6.233.17-node.63, linux x64, AMD EPYC 9V45 96-Core Processor. Random and concurrent workloads mix insertion, removal and replacement. Concurrent authors edit independent views. Sizes use MessagePack; updates are encoded individually. Load includes decoding and construction. Receive includes decoding and applying one complete edit batch. Preparation, checks, destruction and explicit JS process garbage collection are outside timings.

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

2026-11-24T12:57:36.764Z · [CI run](https://github.com/sovereignbase/sequencer/actions/runs/45397524890)

3 runs, 6,000 edits per author. Concurrent authors edit independent views; causal authors exchange history before the second author edits. Median results.

| Workload              | Mode       | Author edits/s | Apply edits/s | Receive edits/s | Update/author KiB | Document KiB | Memory MiB |
| --------------------- | ---------- | -------------: | ------------: | --------------: | ----------------: | -----------: | ---------: |
| append                | individual |      3,260,753 |     6,030,902 |       2,435,853 |             76.05 |         5.99 |      0.012 |
| append                | batch      |      4,824,780 |   487,844,540 |     525,532,101 |              5.88 |         5.99 |      0.012 |
| prepend               | individual |      2,718,984 |     5,240,440 |       2,340,126 |             76.11 |         5.99 |      0.942 |
| prepend               | batch      |      3,668,742 |     5,182,287 |       4,998,775 |              5.89 |         5.99 |      0.942 |
| random.characters     | individual |      1,740,851 |     3,093,268 |       1,942,532 |             82.09 |        28.31 |      0.963 |
| random.characters     | batch      |      1,933,079 |     3,232,793 |       3,372,425 |             22.95 |        28.31 |      0.963 |
| random.words          | individual |      2,065,129 |     2,307,116 |       1,881,406 |            125.68 |        73.88 |      1.036 |
| random.words          | batch      |      2,111,708 |     3,462,412 |       3,214,838 |             59.71 |        73.88 |      1.036 |
| concurrent.characters | individual |      2,200,883 |     2,545,232 |       1,836,867 |             82.04 |        56.41 |      1.926 |
| concurrent.characters | batch      |      2,245,680 |     3,438,546 |       3,158,467 |             22.92 |        56.41 |      1.926 |
| concurrent.words      | individual |      2,264,451 |     2,474,640 |       2,069,909 |            125.74 |       147.81 |      2.073 |
| concurrent.words      | batch      |      2,265,835 |     3,230,745 |       2,958,012 |             59.79 |       147.81 |      2.073 |
| concurrent.mixed      | individual |      1,300,062 |     1,711,010 |       1,260,214 |            154.61 |        97.83 |      1.573 |
| concurrent.mixed      | batch      |      1,609,138 |     2,299,845 |       2,068,998 |             56.88 |        97.82 |      1.573 |
| causal.characters     | individual |      2,140,863 |     2,890,974 |       1,805,708 |             88.96 |        63.81 |      1.933 |
| causal.characters     | batch      |      2,152,683 |     3,453,861 |       2,987,432 |             23.18 |        63.81 |      1.933 |
| causal.words          | individual |      2,021,651 |     2,659,797 |       1,652,841 |            135.13 |       156.41 |      2.081 |
| causal.words          | batch      |      2,459,548 |     3,182,966 |       2,724,684 |             60.68 |       156.41 |      2.081 |
| causal.mixed          | individual |      1,259,918 |     1,453,137 |       1,517,574 |            161.05 |       103.75 |      1.576 |
| causal.mixed          | batch      |      1,612,772 |     2,253,184 |       2,050,259 |             57.34 |       103.75 |      1.576 |

Measured on Node 24.22.3, V8 13.6.233.17-node.63, linux x64, AMD EPYC 9V45 96-Core Processor. Both modes group each author's binary Gossip into one MessagePack message. Batch Footage is uncompressed. Receive includes MessagePack decoding; apply excludes it. Document size follows complete acknowledgement exchange. Memory estimates use one receiver recreated from that compact checkpoint in a fresh runtime, excluding the author runtime. Preparation, verification, destruction and explicit JS process garbage collection are outside timings.

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

2026-11-24T12:54:28.063Z · [CI run](https://github.com/sovereignbase/sequencer/actions/runs/45397524890)

The latest verification passed 388 Vitest tests and 153 compatibility checks.
The configured 100% coverage threshold is met (100% statements, 100% branches, 100% functions, 100% lines).
See the [test suites](test/README.md) and
[automated test report](https://sovereignbase.dev/sequencer/tests/).

### Works everywhere where JavaScript and Wasm works

2026-11-24T12:54:28.067Z · [CI run](https://github.com/sovereignbase/sequencer/actions/runs/45397524890)

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
