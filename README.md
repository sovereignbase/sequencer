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

2026-11-27T21:42:28.739Z · local run

#### Moderate bundle size

| Format   | Raw (KiB) | Minified (KiB) | Minified + gzip (KiB) |
| -------- | --------: | -------------: | --------------------: |
| ESM      |    202.56 |         165.86 |                 56.94 |
| CommonJS |    202.74 |         167.48 |                 57.15 |

Both bundles include WASM. Terser uses three compression passes; gzip uses level 9.

#### Average throughput during editing to checkpoint

Arithmetic means of 5 runs, in ops/s, from each phase's start to checkpoint.
Strips contain 1–100 Frames (visible entries). Headers show Strip counts and mean Frame counts.

**↑ Scale up (0 → 25,000 Strips)**

| Method / case  | 1,000 Strips<br>50,378 Frames | 5,000 Strips<br>253,466 Frames | 10,000 Strips<br>507,223 Frames | 15,000 Strips<br>759,425 Frames | 20,000 Strips<br>1,010,222 Frames | 25,000 Strips<br>1,259,630 Frames |
| -------------- | ----------------------------: | -----------------------------: | ------------------------------: | ------------------------------: | --------------------------------: | --------------------------------: |
| apply.random   |                       234,969 |                        276,890 |                         291,858 |                         299,704 |                           281,361 |                           284,865 |
| insert.head    |                       846,092 |                      1,004,917 |                       1,154,238 |                       1,222,914 |                         1,178,029 |                         1,199,985 |
| insert.random  |                       489,266 |                        529,106 |                         571,218 |                         590,467 |                           539,603 |                           539,953 |
| insert.tail    |                       945,304 |                      1,120,591 |                       1,287,103 |                       1,317,392 |                         1,248,421 |                         1,242,475 |
| remove.head    |                             — |                              — |                               — |                               — |                                 — |                                 — |
| remove.random  |                       405,014 |                        470,445 |                         488,357 |                         495,482 |                           441,219 |                           447,656 |
| remove.tail    |                             — |                              — |                               — |                               — |                                 — |                                 — |
| replace.head   |                       379,376 |                        437,802 |                         485,045 |                         500,950 |                           471,903 |                           456,090 |
| replace.random |                       338,466 |                        348,380 |                         368,893 |                         364,543 |                           330,683 |                           331,499 |
| replace.tail   |                       423,199 |                        466,563 |                         488,908 |                         514,390 |                           467,164 |                           473,941 |
| value.head     |                     1,066,721 |                      2,175,812 |                       2,669,991 |                       2,903,877 |                         2,787,887 |                         2,869,531 |
| value.random   |                     1,173,684 |                      1,021,425 |                         981,538 |                         955,041 |                           870,528 |                           866,174 |
| value.tail     |                     4,953,546 |                      5,166,085 |                       5,661,377 |                       6,001,758 |                         5,895,019 |                         6,002,592 |

**↓ Scale down (25,000 → 0 Strips)**

| Method / case  | 20,000 Strips<br>1,010,259 Frames | 15,000 Strips<br>757,489 Frames | 10,000 Strips<br>505,651 Frames | 5,000 Strips<br>251,976 Frames | 1,000 Strips<br>50,090 Frames | 0 Strips<br>0 Frames |
| -------------- | --------------------------------: | ------------------------------: | ------------------------------: | -----------------------------: | ----------------------------: | -------------------: |
| apply.random   |                           292,165 |                         286,033 |                         288,999 |                        290,627 |                       295,339 |              297,971 |
| insert.head    |                                 — |                               — |                               — |                              — |                             — |                    — |
| insert.random  |                           489,702 |                         480,349 |                         501,978 |                        509,502 |                       523,727 |              531,952 |
| insert.tail    |                                 — |                               — |                               — |                              — |                             — |                    — |
| remove.head    |                           669,046 |                         662,854 |                         634,853 |                        643,626 |                       653,263 |              657,634 |
| remove.random  |                           432,916 |                         424,279 |                         432,056 |                        437,801 |                       447,474 |              454,046 |
| remove.tail    |                           719,049 |                         719,593 |                         719,164 |                        696,760 |                       706,090 |              710,559 |
| replace.head   |                           457,398 |                         448,376 |                         451,435 |                        440,949 |                       445,766 |              449,479 |
| replace.random |                           327,287 |                         320,983 |                         329,849 |                        330,655 |                       339,906 |              344,765 |
| replace.tail   |                           226,735 |                         119,845 |                         152,417 |                        151,960 |                       163,674 |              168,275 |
| value.head     |                         2,167,516 |                       2,152,989 |                       2,180,830 |                      2,162,023 |                     2,161,984 |            2,173,574 |
| value.random   |                           820,259 |                         805,069 |                         815,162 |                        816,268 |                       835,458 |              850,225 |
| value.tail     |                         3,973,845 |                       3,873,710 |                       3,872,325 |                      3,820,754 |                     3,808,200 |            3,824,751 |

#### API throughput at checkpoint

Checkpoint calls, in ops/s, averaged across runs.

**↑ Scale up (0 → 25,000 Strips)**

| Method                            | 1,000 Strips<br>50,378 Frames | 5,000 Strips<br>253,466 Frames | 10,000 Strips<br>507,223 Frames | 15,000 Strips<br>759,425 Frames | 20,000 Strips<br>1,010,222 Frames | 25,000 Strips<br>1,259,630 Frames |
| --------------------------------- | ----------------------------: | -----------------------------: | ------------------------------: | ------------------------------: | --------------------------------: | --------------------------------: |
| new Projection(actorID, sequence) |                         2,415 |                            874 |                             636 |                             375 |                               262 |                               216 |
| sequence()                        |                           385 |                            122 |                              79 |                              65 |                                47 |                                39 |
| values()                          |                           540 |                            237 |                             188 |                             144 |                               110 |                                85 |

**↓ Scale down (25,000 → 0 Strips)**

| Method                            | 20,000 Strips<br>1,010,259 Frames | 15,000 Strips<br>757,489 Frames | 10,000 Strips<br>505,651 Frames | 5,000 Strips<br>251,976 Frames | 1,000 Strips<br>50,090 Frames | 0 Strips<br>0 Frames |
| --------------------------------- | --------------------------------: | ------------------------------: | ------------------------------: | -----------------------------: | ----------------------------: | -------------------: |
| new Projection(actorID, sequence) |                               259 |                             348 |                             494 |                          1,064 |                         5,101 |               58,935 |
| sequence()                        |                                49 |                              61 |                              69 |                             97 |                           128 |                  678 |
| values()                          |                               110 |                             151 |                             182 |                            335 |                         1,755 |               79,711 |

#### Sequence disk size at checkpoint

Complete exported Sequences, including Footage and acknowledgements. Sizes are in KiB.

**↑ Scale up (0 → 25,000 Strips)**

| Encoding           | 1,000 Strips<br>50,378 Frames | 5,000 Strips<br>253,466 Frames | 10,000 Strips<br>507,223 Frames | 15,000 Strips<br>759,425 Frames | 20,000 Strips<br>1,010,222 Frames | 25,000 Strips<br>1,259,630 Frames |
| ------------------ | ----------------------------: | -----------------------------: | ------------------------------: | ------------------------------: | --------------------------------: | --------------------------------: |
| JSON               |                        273.81 |                       1,628.82 |                        3,271.29 |                        4,935.41 |                          7,102.38 |                          9,232.99 |
| JSON + gzip        |                         14.54 |                          73.39 |                          148.76 |                          226.03 |                            311.09 |                            392.33 |
| MessagePack        |                        163.16 |                         822.71 |                        1,652.78 |                        3,555.65 |                          5,124.99 |                          6,530.68 |
| MessagePack + gzip |                         12.35 |                          61.62 |                          124.74 |                          200.13 |                            263.48 |                            334.92 |

**↓ Scale down (25,000 → 0 Strips)**

| Encoding           | 20,000 Strips<br>1,010,259 Frames | 15,000 Strips<br>757,489 Frames | 10,000 Strips<br>505,651 Frames | 5,000 Strips<br>251,976 Frames | 1,000 Strips<br>50,090 Frames | 0 Strips<br>0 Frames |
| ------------------ | --------------------------------: | ------------------------------: | ------------------------------: | -----------------------------: | ----------------------------: | -------------------: |
| JSON               |                          7,559.55 |                        5,714.04 |                        3,822.43 |                       1,894.47 |                        373.91 |                 0.02 |
| JSON + gzip        |                            326.54 |                          247.27 |                          164.92 |                          79.70 |                         15.96 |                 0.03 |
| MessagePack        |                          5,305.92 |                        3,994.26 |                        2,666.42 |                       1,324.12 |                        262.08 |                 0.01 |
| MessagePack + gzip |                            278.16 |                          209.81 |                          139.86 |                          67.83 |                         13.63 |                 0.03 |

#### Memory usage at checkpoint

One instance after checkpoint compaction and recreation: live native allocation plus retained JS array slots and string code units, in MiB (1,048,576 bytes). Unused WASM capacity is excluded.

**↑ Scale up (0 → 25,000 Strips)**

| Measurement            | 1,000 Strips<br>50,378 Frames | 5,000 Strips<br>253,466 Frames | 10,000 Strips<br>507,223 Frames | 15,000 Strips<br>759,425 Frames | 20,000 Strips<br>1,010,222 Frames | 25,000 Strips<br>1,259,630 Frames |
| ---------------------- | ----------------------------: | -----------------------------: | ------------------------------: | ------------------------------: | --------------------------------: | --------------------------------: |
| Estimated memory (MiB) |                          0.62 |                           3.10 |                            6.21 |                            9.44 |                             12.82 |                             16.24 |

**↓ Scale down (25,000 → 0 Strips)**

| Measurement            | 20,000 Strips<br>1,010,259 Frames | 15,000 Strips<br>757,489 Frames | 10,000 Strips<br>505,651 Frames | 5,000 Strips<br>251,976 Frames | 1,000 Strips<br>50,090 Frames | 0 Strips<br>0 Frames |
| ---------------------- | --------------------------------: | ------------------------------: | ------------------------------: | -----------------------------: | ----------------------------: | -------------------: |
| Estimated memory (MiB) |                             13.32 |                            9.91 |                            7.15 |                           4.08 |                          1.80 |                 1.23 |

Measured on Node 24.16.0, V8 13.6.233.17-node.49,
win32 x64, Intel(R) Core(TM) i5-10210U CPU @ 1.60GHz.
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

2026-11-27T21:42:29.855Z · local run

Arithmetic means of 5 runs. Ordinary Projection versus a static tuple with maxLength. Both contain the same values; replacements preserve the field count.

#### Throughput (ops/s)

| Indices | Method / case   | Projection | Static tuple | Tuple / Projection |
| ------: | --------------- | ---------: | -----------: | -----------------: |
|       2 | create.sequence |    862,789 |      762,162 |              0.88× |
|       2 | replace.random  |  1,031,360 |    1,409,348 |              1.37× |
|       2 | apply.replace   |    573,333 |      770,593 |              1.34× |
|       2 | value.random    | 29,816,071 |   46,711,029 |              1.57× |
|       4 | create.sequence |    643,115 |      613,511 |              0.95× |
|       4 | replace.random  |    921,970 |    1,392,683 |              1.51× |
|       4 | apply.replace   |    602,846 |      906,500 |              1.50× |
|       4 | value.random    | 20,803,565 |   49,813,390 |              2.39× |
|       8 | create.sequence |    428,103 |      500,612 |              1.17× |
|       8 | replace.random  |    918,801 |    1,281,066 |              1.39× |
|       8 | apply.replace   |    539,563 |      888,601 |              1.65× |
|       8 | value.random    | 15,832,620 |   49,228,662 |              3.11× |
|     100 | create.sequence |     62,706 |       76,420 |              1.22× |
|     100 | replace.random  |    864,726 |    1,425,262 |              1.65× |
|     100 | apply.replace   |    559,762 |      911,188 |              1.63× |
|     100 | value.random    | 11,077,040 |   45,412,575 |              4.10× |

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

Measured on Node 24.16.0, V8 13.6.233.17-node.49, win32 x64, Intel(R) Core(TM) i5-10210U CPU @ 1.60GHz. Fixtures are hydrated compacted snapshots after one replacement per field. Each case warms up for ≥25 ms and measures ≥50 ms of API time; mutation bursts restart after 4,096 replacements. Peer authoring, encoding, result checks, destruction and explicit JS process garbage collection are outside API timings. Memory estimates are the increase in live native allocator bytes plus retained JS array slots for one instance, including exercised runtime buffers. Unused WASM capacity, JS object headers and referenced payload objects are excluded.

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

2026-11-27T21:42:29.926Z · local run

5 runs; median throughput in ops/s. Sizes are UTF-16 code units.

| Operation            | 1,024 array | 1,024 string | 65,536 array | 65,536 string | 1,048,576 array | 1,048,576 string |
| -------------------- | ----------: | -----------: | -----------: | ------------: | --------------: | ---------------: |
| insert               |     459,592 |    2,061,088 |        4,191 |     2,451,374 |             294 |        1,952,522 |
| insert.append        |      77,710 |      223,517 |          940 |        47,116 |              47 |            1,560 |
| replace              |     318,575 |      800,234 |        3,906 |       730,626 |             294 |          557,302 |
| remove               |     952,104 |    1,042,677 |      397,960 |       922,658 |          72,997 |          610,682 |
| remove.middle        |     490,474 |      984,426 |        4,333 |       976,121 |             302 |          850,136 |
| replace.middle       |     408,717 |      730,711 |        4,261 |       744,463 |             309 |          611,978 |
| apply                |   1,013,949 |    1,140,772 |      853,983 |     1,165,806 |         837,097 |          953,134 |
| apply.array          |   1,594,084 |      411,805 |    1,389,935 |         3,961 |       1,496,720 |              284 |
| concurrent.apply     |      15,612 |      258,814 |          234 |         7,283 |              14 |              713 |
| merge                |     321,023 |      727,195 |        4,655 |       925,922 |             313 |          735,249 |
| create               |     325,930 |      984,237 |        4,834 |     1,013,222 |             308 |          994,935 |
| value.random         |  21,883,995 |   14,447,813 |   18,989,062 |    16,468,814 |      16,363,341 |       18,450,191 |
| values.range         |   7,263,538 |    6,191,608 |    6,214,653 |     6,782,334 |       7,942,843 |        6,685,948 |
| values.array         |     717,571 |      562,702 |        4,471 |         3,843 |             386 |              316 |
| values.text          |      74,000 |   14,285,932 |        1,211 |    14,601,520 |              77 |       15,273,965 |
| sequence.array       |     560,566 |      486,411 |        4,900 |         4,013 |             454 |              306 |
| sequence.text        |      99,512 |    5,517,868 |        1,376 |     4,467,133 |              16 |        4,881,161 |
| sequence.edited.text |      99,878 |    1,405,063 |        1,357 |       157,203 |              20 |           10,486 |
| sequence.masked.text |      87,915 |      285,505 |        1,311 |       299,508 |              20 |          296,088 |

Encoded snapshots use string Footage in both representations.

#### Memory and encoded size

| UTF-16 code units | Representation | Estimated MiB | Snapshot MessagePack KiB | Snapshot gzip KiB | Gossip MessagePack KiB | Gossip gzip KiB |
| ----------------: | -------------- | ------------: | -----------------------: | ----------------: | ---------------------: | --------------: |
|              1024 | array          |        0.0082 |                     1.02 |              0.04 |                   2.02 |            0.05 |
|              1024 | string         |        0.0023 |                     1.02 |              0.04 |                   1.02 |            0.05 |
|             65536 | array          |        0.5004 |                    64.02 |              0.12 |                 128.02 |            0.18 |
|             65536 | string         |        0.1254 |                    64.02 |              0.12 |                  64.02 |            0.12 |
|           1048576 | array          |        8.0004 |                  1024.02 |              1.05 |                2048.02 |            2.05 |
|           1048576 | string         |        2.0004 |                  1024.02 |              1.05 |                1024.02 |            1.05 |

Measured on Node 24.16.0, V8 13.6.233.17-node.49, win32 x64, Intel(R) Core(TM) i5-10210U CPU @ 1.60GHz. Splitting and text assembly are included where required; peer preparation, encoding and explicit JS process garbage collection are outside API timings.

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

2026-11-27T21:42:30.008Z · local run

5 runs, 6,000 edits. Median results; string Footage in both modes.

| Workload   | Words    | Snapshot KiB | Snapshot gzip KiB | Mean update B | Encode ops/s | Load ops/s | Receive batches/s |
| ---------- | -------- | -----------: | ----------------: | ------------: | -----------: | ---------: | ----------------: |
| append     | unpacked |         5.90 |              3.61 |         22.88 |       29,947 |    176,630 |               179 |
| append     | packed   |         5.90 |              3.61 |         13.98 |       25,913 |    183,022 |               292 |
| prepend    | unpacked |        40.07 |             18.06 |         22.94 |        1,848 |        749 |               253 |
| prepend    | packed   |         5.90 |              3.62 |         13.99 |       26,666 |      1,530 |               251 |
| random     | unpacked |       138.05 |             57.31 |         39.88 |          457 |        236 |                80 |
| random     | packed   |        49.58 |             35.38 |         23.45 |       11,897 |        488 |               119 |
| concurrent | unpacked |        92.24 |             42.76 |         32.34 |          602 |        206 |                94 |
| concurrent | packed   |        38.94 |             28.15 |         20.71 |       15,580 |        418 |               119 |

Measured on Node 24.16.0, V8 13.6.233.17-node.49, win32 x64, Intel(R) Core(TM) i5-10210U CPU @ 1.60GHz. Random and concurrent workloads mix insertion, removal and replacement. Concurrent authors edit independent views. Sizes use MessagePack; updates are encoded individually. Load includes decoding and construction. Receive includes decoding and applying one complete edit batch. Preparation, checks, destruction and explicit JS process garbage collection are outside timings.

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

2026-11-27T21:42:30.060Z · local run

5 runs, 6,000 edits per author. Concurrent authors edit independent views; causal authors exchange history before the second author edits. Median results.

| Workload              | Mode       | Author edits/s | Apply edits/s | Receive edits/s | Update/author KiB | Document KiB | Memory MiB |
| --------------------- | ---------- | -------------: | ------------: | --------------: | ----------------: | -----------: | ---------: |
| append                | individual |      1,813,675 |     1,131,542 |         622,361 |             76.05 |         5.99 |      0.012 |
| append                | batch      |      1,874,531 |   182,926,829 |     169,971,671 |              5.88 |         5.99 |      0.012 |
| prepend               | individual |      1,360,174 |     1,433,692 |         880,346 |             76.11 |         5.99 |      0.896 |
| prepend               | batch      |      1,699,043 |     2,114,985 |       1,874,649 |              5.89 |         5.99 |      0.896 |
| random.characters     | individual |        876,399 |     1,008,386 |         808,124 |             82.09 |        28.31 |      0.917 |
| random.characters     | batch      |      1,222,668 |     1,490,017 |       1,417,234 |             22.95 |        28.31 |      0.917 |
| random.words          | individual |      1,017,725 |     1,128,329 |         781,596 |            125.68 |        73.88 |      0.991 |
| random.words          | batch      |      1,141,900 |     1,725,129 |       1,617,076 |             59.71 |        73.88 |      0.991 |
| concurrent.characters | individual |      1,385,345 |     1,247,687 |         845,988 |             82.04 |        56.41 |      1.834 |
| concurrent.characters | batch      |      1,371,225 |     1,798,831 |       1,655,401 |             22.92 |        56.41 |      1.834 |
| concurrent.words      | individual |      1,272,089 |     1,302,451 |         899,780 |            125.74 |       147.81 |      1.981 |
| concurrent.words      | batch      |      1,373,186 |     1,645,053 |       1,535,528 |             59.79 |       147.81 |      1.981 |
| concurrent.mixed      | individual |        709,685 |       945,634 |         699,341 |            154.61 |        97.82 |      1.505 |
| concurrent.mixed      | batch      |        910,015 |     1,190,925 |       1,182,919 |             56.88 |        97.82 |      1.505 |
| causal.characters     | individual |      1,232,387 |     1,419,195 |       1,035,921 |             88.96 |        63.81 |      1.842 |
| causal.characters     | batch      |      1,203,925 |     1,796,273 |       1,654,009 |             23.18 |        63.81 |      1.842 |
| causal.words          | individual |      1,105,471 |     1,335,544 |         877,899 |            135.13 |       156.41 |      1.989 |
| causal.words          | batch      |      1,222,868 |     1,612,643 |       1,479,637 |             60.68 |       156.41 |      1.989 |
| causal.mixed          | individual |        719,136 |       937,544 |         693,594 |            161.05 |       103.75 |      1.509 |
| causal.mixed          | batch      |        853,485 |     1,244,904 |       1,137,851 |             57.34 |       103.75 |      1.509 |

Measured on Node 24.16.0, V8 13.6.233.17-node.49, win32 x64, Intel(R) Core(TM) i5-10210U CPU @ 1.60GHz. Both modes group each author's binary Gossip into one MessagePack message. Batch Footage is uncompressed. Receive includes MessagePack decoding; apply excludes it. Document size follows complete acknowledgement exchange. Memory estimates use one receiver recreated from that compact checkpoint in a fresh runtime, excluding the author runtime. Preparation, verification, destruction and explicit JS process garbage collection are outside timings.

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

2026-11-27T21:35:32.466Z · local run

The latest verification passed 404 Vitest tests and 136 compatibility checks.
The configured 100% coverage threshold is met (100% statements, 100% branches, 100% functions, 100% lines).
See the [test suites](test/README.md) and
[automated test report](https://sovereignbase.dev/sequencer/tests/).

### Works everywhere where JavaScript and Wasm works

2026-11-27T21:08:55.107Z · local run

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
