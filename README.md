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

2026-11-24T18:41:25.900Z · [CI run](https://github.com/sovereignbase/sequencer/actions/runs/45461530116)

#### Moderate bundle size

| Format   | Raw (KiB) | Minified (KiB) | Minified + gzip (KiB) |
| -------- | --------: | -------------: | --------------------: |
| ESM      |    203.42 |         166.79 |                 56.64 |
| CommonJS |    203.60 |         168.40 |                 56.85 |

Both bundles include WASM. Terser uses three compression passes; gzip uses level 9.

#### Average throughput during editing to checkpoint

Arithmetic means of 3 runs, in ops/s, from each phase's start to checkpoint.
Strips contain 1–100 Frames (visible entries). Headers show Strip counts and mean Frame counts.

**↑ Scale up (0 → 25,000 Strips)**

| Method / case  | 1,000 Strips<br>50,871 Frames | 5,000 Strips<br>252,214 Frames | 10,000 Strips<br>504,871 Frames | 15,000 Strips<br>758,280 Frames | 20,000 Strips<br>1,010,749 Frames | 25,000 Strips<br>1,264,003 Frames |
| -------------- | ----------------------------: | -----------------------------: | ------------------------------: | ------------------------------: | --------------------------------: | --------------------------------: |
| apply.random   |                       454,753 |                        409,209 |                         422,559 |                         434,829 |                           435,586 |                           432,433 |
| insert.head    |                     1,857,988 |                      1,681,026 |                       1,813,937 |                       1,843,972 |                         1,857,974 |                         1,869,009 |
| insert.random  |                     1,054,560 |                      1,078,829 |                       1,023,545 |                       1,023,819 |                           973,903 |                           960,146 |
| insert.tail    |                     2,220,241 |                      2,130,277 |                       2,080,364 |                       1,960,983 |                         2,024,755 |                         2,001,978 |
| remove.head    |                             — |                              — |                               — |                               — |                                 — |                                 — |
| remove.random  |                       776,341 |                        644,489 |                         636,403 |                         638,608 |                           642,551 |                           633,883 |
| remove.tail    |                             — |                              — |                               — |                               — |                                 — |                                 — |
| replace.head   |                       588,675 |                        663,209 |                         691,843 |                         700,057 |                           660,908 |                           626,872 |
| replace.random |                       578,006 |                        435,691 |                         453,432 |                         460,167 |                           462,812 |                           447,680 |
| replace.tail   |                       608,874 |                        602,624 |                         652,558 |                         677,022 |                           687,710 |                           699,162 |
| value.head     |                     4,366,181 |                      5,090,946 |                       5,478,409 |                       5,916,713 |                         6,141,151 |                         6,268,851 |
| value.random   |                     2,712,462 |                      1,911,797 |                       1,708,558 |                       1,641,236 |                         1,604,041 |                         1,569,644 |
| value.tail     |                     7,632,506 |                      8,380,815 |                       8,660,958 |                       9,448,871 |                         9,872,628 |                        10,200,929 |

**↓ Scale down (25,000 → 0 Strips)**

| Method / case  | 20,000 Strips<br>1,012,742 Frames | 15,000 Strips<br>755,860 Frames | 10,000 Strips<br>504,103 Frames | 5,000 Strips<br>251,203 Frames | 1,000 Strips<br>51,057 Frames | 0 Strips<br>0 Frames |
| -------------- | --------------------------------: | ------------------------------: | ------------------------------: | -----------------------------: | ----------------------------: | -------------------: |
| apply.random   |                           438,244 |                         446,797 |                         454,139 |                        441,313 |                       451,465 |              454,815 |
| insert.head    |                                 — |                               — |                               — |                              — |                             — |                    — |
| insert.random  |                           751,156 |                         822,650 |                         865,442 |                        904,122 |                       929,895 |              943,605 |
| insert.tail    |                                 — |                               — |                               — |                              — |                             — |                    — |
| remove.head    |                           494,651 |                         603,202 |                         646,257 |                        700,672 |                       735,330 |              743,098 |
| remove.random  |                           525,029 |                         570,906 |                         595,656 |                        594,748 |                       616,203 |              624,585 |
| remove.tail    |                         1,005,242 |                       1,011,792 |                       1,019,813 |                      1,027,742 |                     1,030,570 |            1,032,747 |
| replace.head   |                           657,688 |                         645,239 |                         603,190 |                        613,234 |                       626,560 |              632,048 |
| replace.random |                           418,253 |                         437,201 |                         458,835 |                        469,844 |                       487,060 |              493,584 |
| replace.tail   |                           169,109 |                          73,706 |                          85,178 |                         93,532 |                       103,012 |              106,461 |
| value.head     |                         4,104,956 |                       4,165,708 |                       4,236,468 |                      4,245,145 |                     4,306,992 |            4,336,696 |
| value.random   |                         1,453,691 |                       1,471,252 |                       1,492,777 |                      1,516,962 |                     1,566,037 |            1,595,833 |
| value.tail     |                         7,370,211 |                       6,964,236 |                       6,906,852 |                      6,815,712 |                     6,937,842 |            6,995,555 |

#### API throughput at checkpoint

Checkpoint calls, in ops/s, averaged across runs.

**↑ Scale up (0 → 25,000 Strips)**

| Method                            | 1,000 Strips<br>50,871 Frames | 5,000 Strips<br>252,214 Frames | 10,000 Strips<br>504,871 Frames | 15,000 Strips<br>758,280 Frames | 20,000 Strips<br>1,010,749 Frames | 25,000 Strips<br>1,264,003 Frames |
| --------------------------------- | ----------------------------: | -----------------------------: | ------------------------------: | ------------------------------: | --------------------------------: | --------------------------------: |
| new Projection(actorID, sequence) |                         6,650 |                          1,682 |                             869 |                             585 |                               395 |                               345 |
| sequence()                        |                           675 |                            167 |                             106 |                              82 |                                54 |                                44 |
| values()                          |                         1,428 |                            425 |                             228 |                             154 |                               115 |                                90 |

**↓ Scale down (25,000 → 0 Strips)**

| Method                            | 20,000 Strips<br>1,012,742 Frames | 15,000 Strips<br>755,860 Frames | 10,000 Strips<br>504,103 Frames | 5,000 Strips<br>251,203 Frames | 1,000 Strips<br>51,057 Frames | 0 Strips<br>0 Frames |
| --------------------------------- | --------------------------------: | ------------------------------: | ------------------------------: | -----------------------------: | ----------------------------: | -------------------: |
| new Projection(actorID, sequence) |                               359 |                             499 |                             803 |                          1,638 |                         7,847 |               66,352 |
| sequence()                        |                                59 |                              75 |                              96 |                            119 |                           205 |                  836 |
| values()                          |                               119 |                             157 |                             229 |                            428 |                         2,061 |              218,166 |

#### Sequence disk size at checkpoint

Complete exported Sequences, including Footage and acknowledgements. Sizes are in KiB.

**↑ Scale up (0 → 25,000 Strips)**

| Encoding           | 1,000 Strips<br>50,871 Frames | 5,000 Strips<br>252,214 Frames | 10,000 Strips<br>504,871 Frames | 15,000 Strips<br>758,280 Frames | 20,000 Strips<br>1,010,749 Frames | 25,000 Strips<br>1,264,003 Frames |
| ------------------ | ----------------------------: | -----------------------------: | ------------------------------: | ------------------------------: | --------------------------------: | --------------------------------: |
| JSON               |                        277.41 |                       1,619.30 |                        3,260.75 |                        4,927.93 |                          7,102.34 |                          9,260.78 |
| JSON + gzip        |                         14.59 |                          73.45 |                          148.84 |                          225.86 |                            310.82 |                            392.51 |
| MessagePack        |                        164.81 |                         818.36 |                        1,645.70 |                        3,553.49 |                          5,126.23 |                          6,551.29 |
| MessagePack + gzip |                         12.39 |                          61.61 |                          124.81 |                          200.05 |                            263.46 |                            335.08 |

**↓ Scale down (25,000 → 0 Strips)**

| Encoding           | 20,000 Strips<br>1,012,742 Frames | 15,000 Strips<br>755,860 Frames | 10,000 Strips<br>504,103 Frames | 5,000 Strips<br>251,203 Frames | 1,000 Strips<br>51,057 Frames | 0 Strips<br>0 Frames |
| ------------------ | --------------------------------: | ------------------------------: | ------------------------------: | -----------------------------: | ----------------------------: | -------------------: |
| JSON               |                          7,570.10 |                        5,701.87 |                        3,811.41 |                       1,889.41 |                        381.38 |                 0.02 |
| JSON + gzip        |                            326.50 |                          247.16 |                          164.83 |                          79.64 |                         15.97 |                 0.03 |
| MessagePack        |                          5,314.82 |                        3,985.15 |                        2,657.85 |                       1,319.76 |                        266.79 |                 0.01 |
| MessagePack + gzip |                            278.08 |                          209.77 |                          139.96 |                          67.74 |                         13.66 |                 0.03 |

#### Memory usage at checkpoint

One instance after checkpoint compaction and recreation: live native allocation plus retained JS array slots and string code units, in MiB (1,048,576 bytes). Unused WASM capacity is excluded.

**↑ Scale up (0 → 25,000 Strips)**

| Measurement            | 1,000 Strips<br>50,871 Frames | 5,000 Strips<br>252,214 Frames | 10,000 Strips<br>504,871 Frames | 15,000 Strips<br>758,280 Frames | 20,000 Strips<br>1,010,749 Frames | 25,000 Strips<br>1,264,003 Frames |
| ---------------------- | ----------------------------: | -----------------------------: | ------------------------------: | ------------------------------: | --------------------------------: | --------------------------------: |
| Estimated memory (MiB) |                          0.85 |                           3.98 |                            7.25 |                           10.38 |                             13.74 |                             16.84 |

**↓ Scale down (25,000 → 0 Strips)**

| Measurement            | 20,000 Strips<br>1,012,742 Frames | 15,000 Strips<br>755,860 Frames | 10,000 Strips<br>504,103 Frames | 5,000 Strips<br>251,203 Frames | 1,000 Strips<br>51,057 Frames | 0 Strips<br>0 Frames |
| ---------------------- | --------------------------------: | ------------------------------: | ------------------------------: | -----------------------------: | ----------------------------: | -------------------: |
| Estimated memory (MiB) |                             14.02 |                           11.25 |                            8.35 |                           5.52 |                          2.98 |                 1.52 |

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

2026-11-24T18:43:14.972Z · [CI run](https://github.com/sovereignbase/sequencer/actions/runs/45461530116)

Arithmetic means of 3 runs. Ordinary Projection versus a static tuple with maxLength. Both contain the same values; replacements preserve the field count.

#### Throughput (ops/s)

| Indices | Method / case   | Projection | Static tuple | Tuple / Projection |
| ------: | --------------- | ---------: | -----------: | -----------------: |
|       2 | create.sequence |    967,943 |      892,076 |              0.92× |
|       2 | replace.random  |  1,366,615 |    2,416,780 |              1.77× |
|       2 | apply.replace   |    815,105 |    1,467,173 |              1.80× |
|       2 | value.random    | 41,408,134 |   77,268,082 |              1.87× |
|       4 | create.sequence |    769,756 |      779,338 |              1.01× |
|       4 | replace.random  |  1,147,080 |    2,261,735 |              1.97× |
|       4 | apply.replace   |    749,738 |    1,475,648 |              1.97× |
|       4 | value.random    | 33,242,152 |   76,833,869 |              2.31× |
|       8 | create.sequence |    539,164 |      625,488 |              1.16× |
|       8 | replace.random  |  1,097,863 |    2,430,938 |              2.21× |
|       8 | apply.replace   |    727,298 |    1,595,261 |              2.19× |
|       8 | value.random    | 26,292,634 |   77,053,837 |              2.93× |
|     100 | create.sequence |    105,082 |      110,712 |              1.05× |
|     100 | replace.random  |  1,097,229 |    2,407,514 |              2.19× |
|     100 | apply.replace   |    735,019 |    1,511,833 |              2.06× |
|     100 | value.random    | 17,631,115 |   73,915,046 |              4.19× |

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

2026-11-24T18:43:53.254Z · [CI run](https://github.com/sovereignbase/sequencer/actions/runs/45461530116)

3 runs; median throughput in ops/s. Sizes are UTF-16 code units.

| Operation            | 1,024 array | 1,024 string | 65,536 array | 65,536 string | 1,048,576 array | 1,048,576 string |
| -------------------- | ----------: | -----------: | -----------: | ------------: | --------------: | ---------------: |
| insert               |     774,180 |    3,119,705 |        4,314 |     3,266,341 |             253 |        2,553,099 |
| insert.append        |      80,232 |      422,158 |          983 |       110,368 |              44 |            2,235 |
| replace              |     268,016 |      904,242 |        1,613 |       959,380 |             113 |          771,309 |
| remove               |     388,632 |    1,467,128 |        2,939 |     1,424,350 |             206 |        1,297,716 |
| remove.middle        |     714,910 |    1,361,029 |        3,745 |     1,364,006 |             265 |        1,330,827 |
| replace.middle       |     612,111 |    1,025,089 |        3,704 |     1,026,899 |             258 |          925,625 |
| apply                |   1,524,729 |    1,583,843 |    1,040,158 |     1,482,237 |       1,049,760 |        1,272,623 |
| apply.array          |   2,024,511 |      685,605 |    1,965,302 |         4,258 |       1,941,499 |              249 |
| concurrent.apply     |      30,493 |      419,854 |          367 |         8,738 |              21 |              555 |
| merge                |     516,396 |    1,077,236 |        4,346 |     1,122,887 |             257 |        1,109,673 |
| create               |     493,892 |    1,101,518 |        4,440 |     1,093,358 |             268 |        1,137,491 |
| value.random         |  24,186,547 |   31,339,311 |   26,154,835 |    26,154,877 |      34,472,837 |       25,294,597 |
| values.range         |  15,205,953 |   10,130,684 |   13,216,814 |    10,092,728 |      15,160,805 |       11,311,313 |
| values.array         |   1,335,435 |    1,056,678 |        4,635 |         4,516 |             269 |              257 |
| values.text          |     146,245 |   22,959,110 |        1,737 |    22,694,753 |             108 |       23,475,054 |
| sequence.array       |   1,042,869 |      835,550 |        4,636 |         4,484 |             268 |              260 |
| sequence.text        |     191,559 |    8,289,604 |        2,793 |     7,415,504 |              42 |        8,262,124 |
| sequence.edited.text |     109,644 |      706,995 |        1,857 |        18,323 |              36 |            1,145 |
| sequence.masked.text |     151,854 |      398,053 |        2,777 |       414,599 |              41 |          408,281 |

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

2026-11-24T18:44:14.312Z · [CI run](https://github.com/sovereignbase/sequencer/actions/runs/45461530116)

3 runs, 6,000 edits. Median results; string Footage in both modes.

| Workload   | Words    | Snapshot KiB | Snapshot gzip KiB | Mean update B | Encode ops/s | Load ops/s | Receive batches/s |
| ---------- | -------- | -----------: | ----------------: | ------------: | -----------: | ---------: | ----------------: |
| append     | unpacked |         5.90 |              3.61 |         22.88 |       65,684 |    284,990 |               491 |
| append     | packed   |         5.90 |              3.61 |         13.98 |       67,532 |    378,758 |               566 |
| prepend    | unpacked |        40.07 |             18.06 |         22.94 |        3,439 |      1,250 |               385 |
| prepend    | packed   |         5.90 |              3.61 |         13.99 |       67,479 |      2,452 |               401 |
| random     | unpacked |       138.05 |             57.31 |         39.88 |          883 |        308 |               147 |
| random     | packed   |        49.58 |             35.37 |         23.45 |       39,193 |        739 |               190 |
| concurrent | unpacked |        92.23 |             42.77 |         32.34 |        1,089 |        311 |               178 |
| concurrent | packed   |        38.94 |             28.17 |         20.71 |       40,398 |        561 |               225 |

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

2026-11-24T18:44:32.703Z · [CI run](https://github.com/sovereignbase/sequencer/actions/runs/45461530116)

3 runs, 6,000 edits per author. Concurrent authors edit independent views; causal authors exchange history before the second author edits. Median results.

| Workload              | Mode       | Author edits/s | Apply edits/s | Receive edits/s | Update/author KiB | Document KiB | Memory MiB |
| --------------------- | ---------- | -------------: | ------------: | --------------: | ----------------: | -----------: | ---------: |
| append                | individual |      2,700,033 |     6,486,984 |       2,323,216 |             76.05 |         5.99 |      0.012 |
| append                | batch      |      5,076,340 | 1,020,581,732 |     646,970,024 |              5.88 |         5.99 |      0.012 |
| prepend               | individual |      2,036,769 |     3,535,864 |       2,034,128 |             76.11 |         5.99 |      0.896 |
| prepend               | batch      |      2,215,252 |     4,442,210 |       4,121,004 |              5.89 |         5.99 |      0.896 |
| random.characters     | individual |      1,402,357 |     2,170,863 |       1,551,267 |             82.09 |        28.31 |      0.917 |
| random.characters     | batch      |      1,614,614 |     2,615,707 |       2,579,533 |             22.95 |        28.31 |      0.917 |
| random.words          | individual |      1,386,827 |     1,529,638 |       1,447,214 |            125.68 |        73.88 |      0.991 |
| random.words          | batch      |      1,530,974 |     2,510,610 |       2,324,839 |             59.71 |        73.88 |      0.991 |
| concurrent.characters | individual |      1,761,904 |     1,923,433 |       1,317,702 |             82.04 |        56.41 |      1.834 |
| concurrent.characters | batch      |      1,861,447 |     2,499,126 |       2,183,390 |             22.92 |        56.41 |      1.834 |
| concurrent.words      | individual |      1,756,846 |     1,883,383 |       1,275,943 |            125.74 |       147.81 |      1.981 |
| concurrent.words      | batch      |      1,787,911 |     2,321,452 |       2,031,196 |             59.79 |       147.81 |      1.981 |
| concurrent.mixed      | individual |      1,031,830 |     1,357,642 |       1,177,493 |            154.61 |        97.83 |      1.505 |
| concurrent.mixed      | batch      |      1,238,917 |     1,780,860 |       1,638,659 |             56.88 |        97.82 |      1.505 |
| causal.characters     | individual |      1,408,803 |     1,827,034 |       1,483,522 |             88.96 |        63.81 |      1.842 |
| causal.characters     | batch      |      1,537,621 |     2,437,142 |       2,111,555 |             23.18 |        63.81 |      1.842 |
| causal.words          | individual |      1,444,263 |     1,966,219 |       1,182,829 |            135.13 |       156.41 |      1.989 |
| causal.words          | batch      |      1,540,223 |     2,260,870 |       2,046,107 |             60.68 |       156.41 |      1.989 |
| causal.mixed          | individual |        940,838 |     1,326,274 |       1,136,768 |            161.05 |       103.75 |      1.509 |
| causal.mixed          | batch      |      1,166,120 |     1,698,096 |       1,596,488 |             57.34 |       103.75 |      1.509 |

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

2026-11-27T16:25:59.435Z · local run

The latest verification passed 403 Vitest tests and 136 compatibility checks.
The configured 100% coverage threshold is met (100% statements, 100% branches, 100% functions, 100% lines).
See the [test suites](test/README.md) and
[automated test report](https://sovereignbase.dev/sequencer/tests/).

### Works everywhere where JavaScript and Wasm works

2026-11-27T16:26:35.533Z · local run

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

Licensed under the Apache License, Version 2.0.

Copyright © 2026 Sovereignbase.
