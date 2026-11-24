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

2026-11-24T18:14:42.402Z · local run

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
| apply.random   |                       279,947 |                        266,771 |                         252,907 |                         239,794 |                           243,350 |                           244,565 |
| insert.head    |                     1,067,613 |                      1,067,783 |                       1,104,047 |                       1,090,273 |                         1,113,082 |                         1,126,182 |
| insert.random  |                       612,219 |                        587,803 |                         544,224 |                         526,374 |                           513,265 |                           513,438 |
| insert.tail    |                     1,020,031 |                      1,182,459 |                       1,183,572 |                       1,058,453 |                         1,115,375 |                         1,116,774 |
| remove.head    |                             — |                              — |                               — |                               — |                                 — |                                 — |
| remove.random  |                       377,107 |                        339,703 |                         300,368 |                         301,905 |                           312,210 |                           316,358 |
| remove.tail    |                             — |                              — |                               — |                               — |                                 — |                                 — |
| replace.head   |                       397,695 |                        418,965 |                         418,049 |                         366,378 |                           381,279 |                           370,375 |
| replace.random |                       309,530 |                        270,015 |                         267,079 |                         261,948 |                           263,984 |                           265,783 |
| replace.tail   |                       386,177 |                        425,621 |                         387,088 |                         393,445 |                           401,343 |                           406,632 |
| value.head     |                     2,408,850 |                      2,784,877 |                       2,936,337 |                       2,993,586 |                         3,059,471 |                         2,987,255 |
| value.random   |                     1,163,039 |                        912,936 |                         823,334 |                         780,628 |                           782,097 |                           780,277 |
| value.tail     |                     4,677,913 |                      5,355,623 |                       5,638,621 |                       5,880,043 |                         6,069,780 |                         6,220,346 |

**↓ Scale down (25,000 → 0 Strips)**

| Method / case  | 20,000 Strips<br>1,012,742 Frames | 15,000 Strips<br>755,860 Frames | 10,000 Strips<br>504,103 Frames | 5,000 Strips<br>251,203 Frames | 1,000 Strips<br>51,057 Frames | 0 Strips<br>0 Frames |
| -------------- | --------------------------------: | ------------------------------: | ------------------------------: | -----------------------------: | ----------------------------: | -------------------: |
| apply.random   |                           243,283 |                         257,966 |                         265,065 |                        267,758 |                       255,131 |              257,439 |
| insert.head    |                                 — |                               — |                               — |                              — |                             — |                    — |
| insert.random  |                           412,251 |                         455,185 |                         478,072 |                        491,533 |                       501,315 |              509,355 |
| insert.tail    |                                 — |                               — |                               — |                              — |                             — |                    — |
| remove.head    |                           541,210 |                         535,884 |                         521,264 |                        525,526 |                       532,322 |              536,175 |
| remove.random  |                           359,764 |                         368,069 |                         352,355 |                        359,762 |                       365,476 |              370,197 |
| remove.tail    |                           597,693 |                         586,301 |                         592,771 |                        586,427 |                       586,856 |              590,448 |
| replace.head   |                           404,327 |                         396,071 |                         399,694 |                        396,865 |                       396,354 |              399,442 |
| replace.random |                           292,256 |                         289,821 |                         297,870 |                        296,570 |                       300,714 |              304,332 |
| replace.tail   |                           170,707 |                          46,636 |                          62,882 |                         61,446 |                        67,001 |               69,213 |
| value.head     |                         2,366,761 |                       2,407,417 |                       2,428,768 |                      2,407,629 |                     2,393,608 |            2,405,806 |
| value.random   |                           901,182 |                         901,964 |                         907,076 |                        907,624 |                       911,663 |              925,807 |
| value.tail     |                         4,817,170 |                       4,555,063 |                       4,472,425 |                      4,357,327 |                     4,314,245 |            4,320,051 |

#### API throughput at checkpoint

Checkpoint calls, in ops/s, averaged across runs.

**↑ Scale up (0 → 25,000 Strips)**

| Method                            | 1,000 Strips<br>50,871 Frames | 5,000 Strips<br>252,214 Frames | 10,000 Strips<br>504,871 Frames | 15,000 Strips<br>758,280 Frames | 20,000 Strips<br>1,010,749 Frames | 25,000 Strips<br>1,264,003 Frames |
| --------------------------------- | ----------------------------: | -----------------------------: | ------------------------------: | ------------------------------: | --------------------------------: | --------------------------------: |
| new Projection(actorID, sequence) |                         4,614 |                          1,081 |                             612 |                             392 |                               276 |                               236 |
| sequence()                        |                           501 |                            122 |                              77 |                              55 |                                44 |                                39 |
| values()                          |                           919 |                            326 |                             128 |                             113 |                                94 |                                79 |

**↓ Scale down (25,000 → 0 Strips)**

| Method                            | 20,000 Strips<br>1,012,742 Frames | 15,000 Strips<br>755,860 Frames | 10,000 Strips<br>504,103 Frames | 5,000 Strips<br>251,203 Frames | 1,000 Strips<br>51,057 Frames | 0 Strips<br>0 Frames |
| --------------------------------- | --------------------------------: | ------------------------------: | ------------------------------: | -----------------------------: | ----------------------------: | -------------------: |
| new Projection(actorID, sequence) |                               265 |                             376 |                             553 |                          1,234 |                         5,889 |               58,251 |
| sequence()                        |                                48 |                              62 |                              71 |                            102 |                           162 |                  696 |
| values()                          |                               104 |                             125 |                             173 |                            357 |                         1,826 |              127,932 |

#### Sequence disk size at checkpoint

Complete exported Sequences, including Footage and acknowledgements. Sizes are in KiB.

**↑ Scale up (0 → 25,000 Strips)**

| Encoding           | 1,000 Strips<br>50,871 Frames | 5,000 Strips<br>252,214 Frames | 10,000 Strips<br>504,871 Frames | 15,000 Strips<br>758,280 Frames | 20,000 Strips<br>1,010,749 Frames | 25,000 Strips<br>1,264,003 Frames |
| ------------------ | ----------------------------: | -----------------------------: | ------------------------------: | ------------------------------: | --------------------------------: | --------------------------------: |
| JSON               |                        277.52 |                       1,619.82 |                        3,263.31 |                        4,934.27 |                          7,106.50 |                          9,254.76 |
| JSON + gzip        |                         14.59 |                          73.43 |                          148.96 |                          226.09 |                            310.66 |                            391.98 |
| MessagePack        |                        164.81 |                         818.92 |                        1,644.01 |                        3,552.55 |                          5,125.75 |                          6,551.02 |
| MessagePack + gzip |                         12.39 |                          61.62 |                          124.81 |                          200.13 |                            263.47 |                            335.09 |

**↓ Scale down (25,000 → 0 Strips)**

| Encoding           | 20,000 Strips<br>1,012,742 Frames | 15,000 Strips<br>755,860 Frames | 10,000 Strips<br>504,103 Frames | 5,000 Strips<br>251,203 Frames | 1,000 Strips<br>51,057 Frames | 0 Strips<br>0 Frames |
| ------------------ | --------------------------------: | ------------------------------: | ------------------------------: | -----------------------------: | ----------------------------: | -------------------: |
| JSON               |                          7,563.00 |                        5,697.32 |                        3,808.84 |                       1,887.00 |                        380.77 |                 0.02 |
| JSON + gzip        |                            326.18 |                          246.94 |                          164.81 |                          79.58 |                         15.97 |                 0.03 |
| MessagePack        |                          5,314.67 |                        3,986.70 |                        2,658.64 |                       1,319.82 |                        266.65 |                 0.01 |
| MessagePack + gzip |                            278.13 |                          209.80 |                          139.97 |                          67.74 |                         13.65 |                 0.03 |

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

2026-11-24T18:23:17.289Z · local run

Arithmetic means of 3 runs. Ordinary Projection versus a static tuple with maxLength. Both contain the same values; replacements preserve the field count.

#### Throughput (ops/s)

| Indices | Method / case   | Projection | Static tuple | Tuple / Projection |
| ------: | --------------- | ---------: | -----------: | -----------------: |
|       2 | create.sequence |    742,289 |      728,506 |              0.98× |
|       2 | replace.random  |  1,010,861 |    1,658,264 |              1.64× |
|       2 | apply.replace   |    601,951 |      988,562 |              1.64× |
|       2 | value.random    | 32,313,686 |   55,443,485 |              1.72× |
|       4 | create.sequence |    661,470 |      610,648 |              0.92× |
|       4 | replace.random  |    857,249 |    1,390,901 |              1.62× |
|       4 | apply.replace   |    565,387 |      896,333 |              1.59× |
|       4 | value.random    | 25,369,241 |   59,009,139 |              2.33× |
|       8 | create.sequence |    402,131 |      470,765 |              1.17× |
|       8 | replace.random  |    862,178 |    1,542,103 |              1.79× |
|       8 | apply.replace   |    557,977 |      998,195 |              1.79× |
|       8 | value.random    | 19,014,514 |   52,286,950 |              2.75× |
|     100 | create.sequence |     65,052 |       77,069 |              1.18× |
|     100 | replace.random  |    764,502 |    1,322,204 |              1.73× |
|     100 | apply.replace   |    552,943 |    1,023,364 |              1.85× |
|     100 | value.random    | 11,161,410 |   56,341,121 |              5.05× |

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

2026-11-24T18:20:33.091Z · local run

3 runs; median throughput in ops/s. Sizes are UTF-16 code units.

| Operation            | 1,024 array | 1,024 string | 65,536 array | 65,536 string | 1,048,576 array | 1,048,576 string |
| -------------------- | ----------: | -----------: | -----------: | ------------: | --------------: | ---------------: |
| insert               |     371,880 |    2,465,242 |        3,702 |     2,249,870 |             303 |        2,309,427 |
| insert.append        |      56,694 |      292,153 |          735 |        64,954 |              39 |            1,953 |
| replace              |     120,037 |      716,015 |        1,224 |       713,334 |             131 |          565,719 |
| remove               |     231,228 |      818,995 |        2,269 |       900,279 |             207 |        1,076,252 |
| remove.middle        |     434,174 |    1,111,639 |        3,636 |     1,104,683 |             354 |        1,012,521 |
| replace.middle       |     389,376 |      752,900 |        3,989 |       814,128 |             349 |          713,098 |
| apply                |   1,259,300 |    1,285,020 |      664,062 |     1,558,867 |         811,692 |          952,924 |
| apply.array          |   1,851,007 |      447,044 |    1,514,933 |         4,296 |       1,624,398 |              265 |
| concurrent.apply     |      16,291 |      275,226 |          189 |         6,118 |              16 |              816 |
| merge                |     367,232 |      871,768 |        3,235 |       657,659 |             315 |          961,717 |
| create               |     358,961 |      825,848 |        3,986 |       698,916 |             337 |          891,181 |
| value.random         |  21,049,994 |   20,737,272 |   17,930,506 |    14,638,864 |      27,738,932 |       21,129,739 |
| values.range         |   9,005,352 |    7,153,297 |    7,656,030 |     5,828,686 |      10,062,646 |        5,975,391 |
| values.array         |     723,765 |      650,089 |        4,141 |         3,940 |             465 |              280 |
| values.text          |      74,637 |   16,219,975 |        1,082 |    17,855,275 |              78 |       11,786,308 |
| sequence.array       |     440,765 |      475,259 |        3,882 |         4,216 |             337 |              254 |
| sequence.text        |     117,769 |    4,885,887 |        1,214 |     5,540,634 |              16 |        4,110,719 |
| sequence.edited.text |      66,711 |      461,047 |        1,131 |        12,479 |              17 |              500 |
| sequence.masked.text |      85,940 |      263,411 |        1,346 |       272,378 |              19 |          257,870 |

Encoded snapshots use string Footage in both representations.

#### Memory and encoded size

| UTF-16 code units | Representation | Estimated MiB | Snapshot MessagePack KiB | Snapshot gzip KiB | Gossip MessagePack KiB | Gossip gzip KiB |
| ----------------: | -------------- | ------------: | -----------------------: | ----------------: | ---------------------: | --------------: |
|              1024 | array          |        0.0082 |                     1.02 |              0.05 |                   2.02 |            0.05 |
|              1024 | string         |        0.0023 |                     1.02 |              0.04 |                   1.02 |            0.05 |
|             65536 | array          |        0.5004 |                    64.02 |              0.12 |                 128.02 |            0.18 |
|             65536 | string         |        0.1254 |                    64.02 |              0.12 |                  64.02 |            0.12 |
|           1048576 | array          |        8.0004 |                  1024.02 |              1.05 |                2048.02 |            2.04 |
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

2026-11-24T18:22:12.058Z · local run

3 runs, 6,000 edits. Median results; string Footage in both modes.

| Workload   | Words    | Snapshot KiB | Snapshot gzip KiB | Mean update B | Encode ops/s | Load ops/s | Receive batches/s |
| ---------- | -------- | -----------: | ----------------: | ------------: | -----------: | ---------: | ----------------: |
| append     | unpacked |         5.90 |              3.61 |         22.88 |       30,766 |    211,289 |               297 |
| append     | packed   |         5.90 |              3.61 |         13.98 |       32,728 |    226,108 |               340 |
| prepend    | unpacked |        40.07 |             18.07 |         22.94 |        2,044 |        832 |               219 |
| prepend    | packed   |         5.90 |              3.62 |         13.99 |       33,284 |      1,769 |               276 |
| random     | unpacked |       138.05 |             57.31 |         39.88 |          529 |        229 |                94 |
| random     | packed   |        49.58 |             35.37 |         23.45 |       15,311 |        586 |               137 |
| concurrent | unpacked |        92.24 |             42.78 |         32.34 |          670 |        334 |               112 |
| concurrent | packed   |        38.94 |             28.17 |         20.71 |       19,178 |        653 |               152 |

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

2026-11-24T17:35:22.497Z · local run

The latest verification passed 395 Vitest tests and 153 compatibility checks.
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
