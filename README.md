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

2026-11-27T16:46:20.444Z · [CI run](https://github.com/sovereignbase/sequencer/actions/runs/46035866481)

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
| apply.random   |                       385,543 |                        389,279 |                         367,074 |                         376,556 |                           374,161 |                           370,190 |
| insert.head    |                     1,340,921 |                      1,497,700 |                       1,498,699 |                       1,530,783 |                         1,526,063 |                         1,524,720 |
| insert.random  |                       774,757 |                        759,442 |                         729,899 |                         736,219 |                           699,486 |                           698,789 |
| insert.tail    |                     1,603,922 |                      1,795,614 |                       1,748,487 |                       1,492,540 |                         1,559,238 |                         1,544,667 |
| remove.head    |                             — |                              — |                               — |                               — |                                 — |                                 — |
| remove.random  |                       735,274 |                        632,275 |                         615,076 |                         619,633 |                           622,803 |                           618,463 |
| remove.tail    |                             — |                              — |                               — |                               — |                                 — |                                 — |
| replace.head   |                       580,895 |                        646,376 |                         619,500 |                         630,911 |                           641,914 |                           624,103 |
| replace.random |                       465,378 |                        462,234 |                         453,202 |                         448,544 |                           444,669 |                           445,334 |
| replace.tail   |                       529,241 |                        606,404 |                         632,168 |                         649,500 |                           641,981 |                           636,029 |
| value.head     |                     3,179,550 |                      4,358,003 |                       4,750,719 |                       5,080,340 |                         5,276,961 |                         5,400,283 |
| value.random   |                     1,586,781 |                      1,205,498 |                       1,104,476 |                       1,081,939 |                         1,062,692 |                         1,048,306 |
| value.tail     |                     5,266,051 |                      6,648,338 |                       7,144,677 |                       7,496,779 |                         7,726,012 |                         7,856,596 |

**↓ Scale down (25,000 → 0 Strips)**

| Method / case  | 20,000 Strips<br>1,012,742 Frames | 15,000 Strips<br>755,860 Frames | 10,000 Strips<br>504,103 Frames | 5,000 Strips<br>251,203 Frames | 1,000 Strips<br>51,057 Frames | 0 Strips<br>0 Frames |
| -------------- | --------------------------------: | ------------------------------: | ------------------------------: | -----------------------------: | ----------------------------: | -------------------: |
| apply.random   |                           334,230 |                         346,009 |                         360,686 |                        363,691 |                       373,296 |              377,320 |
| insert.head    |                                 — |                               — |                               — |                              — |                             — |                    — |
| insert.random  |                           520,932 |                         577,874 |                         608,929 |                        634,615 |                       654,174 |              664,902 |
| insert.tail    |                                 — |                               — |                               — |                              — |                             — |                    — |
| remove.head    |                           768,110 |                         825,466 |                         792,763 |                        828,769 |                       857,014 |              864,061 |
| remove.random  |                           527,679 |                         573,084 |                         594,360 |                        615,707 |                       635,603 |              645,242 |
| remove.tail    |                           925,576 |                         968,286 |                         984,165 |                        998,256 |                     1,012,687 |            1,019,670 |
| replace.head   |                           541,859 |                         518,828 |                         543,190 |                        550,718 |                       561,737 |              567,023 |
| replace.random |                           381,865 |                         391,128 |                         417,078 |                        424,818 |                       441,620 |              449,027 |
| replace.tail   |                            36,660 |                          49,298 |                          53,596 |                         65,747 |                        72,654 |               75,268 |
| value.head     |                         2,709,702 |                       2,871,912 |                       2,930,628 |                      2,967,494 |                     2,999,420 |            3,027,974 |
| value.random   |                           863,250 |                         918,843 |                         955,155 |                        977,706 |                     1,006,530 |            1,027,208 |
| value.tail     |                         4,006,571 |                       4,173,169 |                       4,196,645 |                      4,247,370 |                     4,296,725 |            4,337,217 |

#### API throughput at checkpoint

Checkpoint calls, in ops/s, averaged across runs.

**↑ Scale up (0 → 25,000 Strips)**

| Method                            | 1,000 Strips<br>50,871 Frames | 5,000 Strips<br>252,214 Frames | 10,000 Strips<br>504,871 Frames | 15,000 Strips<br>758,280 Frames | 20,000 Strips<br>1,010,749 Frames | 25,000 Strips<br>1,264,003 Frames |
| --------------------------------- | ----------------------------: | -----------------------------: | ------------------------------: | ------------------------------: | --------------------------------: | --------------------------------: |
| new Projection(actorID, sequence) |                         4,561 |                          1,334 |                             575 |                             480 |                               310 |                               266 |
| sequence()                        |                           497 |                            139 |                              86 |                              72 |                                47 |                                41 |
| values()                          |                           620 |                            282 |                             193 |                             130 |                                97 |                                81 |

**↓ Scale down (25,000 → 0 Strips)**

| Method                            | 20,000 Strips<br>1,012,742 Frames | 15,000 Strips<br>755,860 Frames | 10,000 Strips<br>504,103 Frames | 5,000 Strips<br>251,203 Frames | 1,000 Strips<br>51,057 Frames | 0 Strips<br>0 Frames |
| --------------------------------- | --------------------------------: | ------------------------------: | ------------------------------: | -----------------------------: | ----------------------------: | -------------------: |
| new Projection(actorID, sequence) |                               335 |                             443 |                             653 |                          1,345 |                         6,098 |               50,718 |
| sequence()                        |                                54 |                              66 |                              86 |                            109 |                           176 |                  730 |
| values()                          |                                98 |                             135 |                             206 |                            401 |                         1,712 |              159,288 |

#### Sequence disk size at checkpoint

Complete exported Sequences, including Footage and acknowledgements. Sizes are in KiB.

**↑ Scale up (0 → 25,000 Strips)**

| Encoding           | 1,000 Strips<br>50,871 Frames | 5,000 Strips<br>252,214 Frames | 10,000 Strips<br>504,871 Frames | 15,000 Strips<br>758,280 Frames | 20,000 Strips<br>1,010,749 Frames | 25,000 Strips<br>1,264,003 Frames |
| ------------------ | ----------------------------: | -----------------------------: | ------------------------------: | ------------------------------: | --------------------------------: | --------------------------------: |
| JSON               |                        277.28 |                       1,620.96 |                        3,266.98 |                        4,930.93 |                          7,104.24 |                          9,262.89 |
| JSON + gzip        |                         14.60 |                          73.45 |                          149.00 |                          226.00 |                            310.81 |                            392.56 |
| MessagePack        |                        164.69 |                         818.91 |                        1,646.03 |                        3,552.32 |                          5,125.38 |                          6,550.82 |
| MessagePack + gzip |                         12.38 |                          61.63 |                          124.80 |                          200.07 |                            263.53 |                            335.14 |

**↓ Scale down (25,000 → 0 Strips)**

| Encoding           | 20,000 Strips<br>1,012,742 Frames | 15,000 Strips<br>755,860 Frames | 10,000 Strips<br>504,103 Frames | 5,000 Strips<br>251,203 Frames | 1,000 Strips<br>51,057 Frames | 0 Strips<br>0 Frames |
| ------------------ | --------------------------------: | ------------------------------: | ------------------------------: | -----------------------------: | ----------------------------: | -------------------: |
| JSON               |                          7,571.11 |                        5,703.54 |                        3,812.22 |                       1,890.13 |                        381.23 |                 0.02 |
| JSON + gzip        |                            326.60 |                          247.19 |                          165.01 |                          79.66 |                         15.95 |                 0.03 |
| MessagePack        |                          5,314.57 |                        3,986.67 |                        2,658.64 |                       1,319.82 |                        266.79 |                 0.01 |
| MessagePack + gzip |                            278.18 |                          209.83 |                          139.98 |                          67.74 |                         13.65 |                 0.03 |

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
linux x64, INTEL(R) XEON(R) PLATINUM 8573C.
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

2026-11-27T16:48:35.797Z · [CI run](https://github.com/sovereignbase/sequencer/actions/runs/46035866481)

Arithmetic means of 3 runs. Ordinary Projection versus a static tuple with maxLength. Both contain the same values; replacements preserve the field count.

#### Throughput (ops/s)

| Indices | Method / case   | Projection | Static tuple | Tuple / Projection |
| ------: | --------------- | ---------: | -----------: | -----------------: |
|       2 | create.sequence |  1,107,749 |      882,732 |              0.80× |
|       2 | replace.random  |  1,516,558 |    1,911,743 |              1.26× |
|       2 | apply.replace   |    832,742 |    1,143,063 |              1.37× |
|       2 | value.random    | 33,837,748 |   67,897,800 |              2.01× |
|       4 | create.sequence |    818,094 |      775,636 |              0.95× |
|       4 | replace.random  |  1,149,322 |    1,886,567 |              1.64× |
|       4 | apply.replace   |    727,067 |    1,101,109 |              1.51× |
|       4 | value.random    | 25,037,819 |   68,797,109 |              2.75× |
|       8 | create.sequence |    540,090 |      606,980 |              1.12× |
|       8 | replace.random  |  1,104,864 |    1,958,919 |              1.77× |
|       8 | apply.replace   |    718,548 |    1,216,829 |              1.69× |
|       8 | value.random    | 19,648,730 |   66,542,505 |              3.39× |
|     100 | create.sequence |     88,549 |       92,548 |              1.05× |
|     100 | replace.random  |  1,112,203 |    1,892,095 |              1.70× |
|     100 | apply.replace   |    710,490 |    1,266,743 |              1.78× |
|     100 | value.random    | 12,565,323 |   64,695,729 |              5.15× |

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

Measured on Node 24.22.3, V8 13.6.233.17-node.63, linux x64, INTEL(R) XEON(R) PLATINUM 8573C. Fixtures are hydrated compacted snapshots after one replacement per field. Each case warms up for ≥25 ms and measures ≥50 ms of API time; mutation bursts restart after 4,096 replacements. Peer authoring, encoding, result checks, destruction and explicit JS process garbage collection are outside API timings. Memory estimates are the increase in live native allocator bytes plus retained JS array slots for one instance, including exercised runtime buffers. Unused WASM capacity, JS object headers and referenced payload objects are excluded.

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

2026-11-27T16:49:16.425Z · [CI run](https://github.com/sovereignbase/sequencer/actions/runs/46035866481)

3 runs; median throughput in ops/s. Sizes are UTF-16 code units.

| Operation            | 1,024 array | 1,024 string | 65,536 array | 65,536 string | 1,048,576 array | 1,048,576 string |
| -------------------- | ----------: | -----------: | -----------: | ------------: | --------------: | ---------------: |
| insert               |     668,707 |    2,536,669 |        3,909 |     3,068,802 |             252 |        2,116,613 |
| insert.append        |      71,215 |      312,631 |          888 |        82,947 |              39 |            1,945 |
| replace              |     421,468 |      728,804 |        3,398 |       745,677 |             215 |          690,190 |
| remove               |   1,149,068 |      953,748 |      643,695 |     1,171,496 |         150,495 |        1,071,452 |
| remove.middle        |     607,318 |    1,156,220 |        3,465 |     1,183,104 |             196 |        1,152,909 |
| replace.middle       |     525,989 |      772,770 |        3,437 |       865,529 |             195 |          788,454 |
| apply                |   1,288,493 |    1,285,874 |    1,113,207 |     1,306,016 |       1,170,796 |        1,019,021 |
| apply.array          |   1,853,375 |      616,022 |    1,867,394 |         3,930 |       1,863,949 |              246 |
| concurrent.apply     |      24,266 |      316,593 |          315 |         7,613 |              17 |              496 |
| merge                |     499,378 |      929,948 |        3,972 |       961,381 |             264 |          933,702 |
| create               |     479,244 |    1,150,875 |        4,045 |     1,133,962 |             268 |        1,071,547 |
| value.random         |  21,546,944 |   26,787,607 |   20,189,256 |    20,315,335 |      34,123,683 |       30,930,336 |
| values.range         |   9,267,985 |    7,108,154 |    9,411,696 |     7,576,098 |      11,805,852 |        8,589,762 |
| values.array         |   1,559,778 |      921,293 |        4,008 |         4,034 |             222 |              263 |
| values.text          |     118,288 |   18,498,721 |        1,486 |    17,905,771 |              92 |       16,023,623 |
| sequence.array       |   1,364,068 |      850,936 |        3,750 |         3,995 |             221 |              266 |
| sequence.text        |     147,836 |    7,176,446 |        2,345 |     7,233,945 |              29 |        6,619,183 |
| sequence.edited.text |      96,795 |      638,901 |        1,487 |        15,114 |              24 |              893 |
| sequence.masked.text |     126,777 |      373,718 |        2,380 |       372,603 |              30 |          399,917 |

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

Measured on Node 24.22.3, V8 13.6.233.17-node.63, linux x64, INTEL(R) XEON(R) PLATINUM 8573C. Splitting and text assembly are included where required; peer preparation, encoding and explicit JS process garbage collection are outside API timings.

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

2026-11-27T16:50:46.304Z · [CI run](https://github.com/sovereignbase/sequencer/actions/runs/46035866481)

3 runs, 6,000 edits. Median results; string Footage in both modes.

| Workload   | Words    | Snapshot KiB | Snapshot gzip KiB | Mean update B | Encode ops/s | Load ops/s | Receive batches/s |
| ---------- | -------- | -----------: | ----------------: | ------------: | -----------: | ---------: | ----------------: |
| append     | unpacked |         5.90 |              3.61 |         22.88 |       42,277 |    238,241 |               333 |
| append     | packed   |         5.90 |              3.61 |         13.98 |       43,784 |    245,877 |               391 |
| prepend    | unpacked |        40.07 |             18.07 |         22.94 |        2,730 |      1,063 |               269 |
| prepend    | packed   |         5.90 |              3.62 |         13.99 |       43,354 |      1,831 |               315 |
| random     | unpacked |       138.05 |             57.31 |         39.88 |          743 |        258 |               106 |
| random     | packed   |        49.58 |             35.37 |         23.45 |       28,026 |        652 |               134 |
| concurrent | unpacked |        92.22 |             42.73 |         32.34 |        1,017 |        251 |               115 |
| concurrent | packed   |        38.94 |             28.16 |         20.71 |       26,686 |        430 |               158 |

Measured on Node 24.22.3, V8 13.6.233.17-node.63, linux x64, INTEL(R) XEON(R) PLATINUM 8573C. Random and concurrent workloads mix insertion, removal and replacement. Concurrent authors edit independent views. Sizes use MessagePack; updates are encoded individually. Load includes decoding and construction. Receive includes decoding and applying one complete edit batch. Preparation, checks, destruction and explicit JS process garbage collection are outside timings.

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

2026-11-27T16:51:07.064Z · [CI run](https://github.com/sovereignbase/sequencer/actions/runs/46035866481)

3 runs, 6,000 edits per author. Concurrent authors edit independent views; causal authors exchange history before the second author edits. Median results.

| Workload              | Mode       | Author edits/s | Apply edits/s | Receive edits/s | Update/author KiB | Document KiB | Memory MiB |
| --------------------- | ---------- | -------------: | ------------: | --------------: | ----------------: | -----------: | ---------: |
| append                | individual |      1,938,714 |     4,816,121 |       1,818,413 |             76.05 |         5.99 |      0.012 |
| append                | batch      |      2,257,455 |   487,092,060 |     333,425,952 |              5.88 |         5.99 |      0.012 |
| prepend               | individual |      1,778,568 |     3,106,458 |       1,527,553 |             76.11 |         5.99 |      0.896 |
| prepend               | batch      |      1,971,729 |     3,756,781 |       3,464,587 |              5.89 |         5.99 |      0.896 |
| random.characters     | individual |      1,190,552 |     1,896,172 |       1,295,558 |             82.09 |        28.31 |      0.917 |
| random.characters     | batch      |      1,265,037 |     2,298,799 |       2,190,150 |             22.95 |        28.31 |      0.917 |
| random.words          | individual |      1,230,182 |     1,545,879 |       1,153,200 |            125.68 |        73.88 |      0.991 |
| random.words          | batch      |        967,254 |     2,096,587 |       1,973,253 |             59.71 |        73.88 |      0.991 |
| concurrent.characters | individual |      1,444,922 |     1,626,457 |       1,096,166 |             82.04 |        56.41 |      1.834 |
| concurrent.characters | batch      |      1,490,678 |     2,121,273 |       1,794,458 |             22.92 |        56.41 |      1.834 |
| concurrent.words      | individual |      1,507,273 |     1,658,851 |       1,100,499 |            125.74 |       147.81 |      1.981 |
| concurrent.words      | batch      |      1,520,206 |     1,946,921 |       1,650,004 |             59.79 |       147.81 |      1.981 |
| concurrent.mixed      | individual |        853,209 |     1,112,234 |         729,889 |            154.61 |        97.83 |      1.505 |
| concurrent.mixed      | batch      |      1,128,419 |     1,421,151 |       1,226,919 |             56.88 |        97.82 |      1.505 |
| causal.characters     | individual |      1,105,432 |     1,477,668 |       1,181,583 |             88.96 |        63.81 |      1.842 |
| causal.characters     | batch      |      1,362,183 |     2,068,774 |       1,696,790 |             23.18 |        63.81 |      1.842 |
| causal.words          | individual |      1,162,543 |     1,568,432 |       1,075,918 |            135.13 |       156.41 |      1.989 |
| causal.words          | batch      |      1,199,970 |     1,871,404 |       1,620,361 |             60.68 |       156.41 |      1.989 |
| causal.mixed          | individual |        785,937 |     1,071,013 |         868,736 |            161.05 |       103.75 |      1.509 |
| causal.mixed          | batch      |      1,004,852 |     1,337,839 |       1,202,090 |             57.34 |       103.75 |      1.509 |

Measured on Node 24.22.3, V8 13.6.233.17-node.63, linux x64, INTEL(R) XEON(R) PLATINUM 8573C. Both modes group each author's binary Gossip into one MessagePack message. Batch Footage is uncompressed. Receive includes MessagePack decoding; apply excludes it. Document size follows complete acknowledgement exchange. Memory estimates use one receiver recreated from that compact checkpoint in a fresh runtime, excluding the author runtime. Preparation, verification, destruction and explicit JS process garbage collection are outside timings.

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

2026-11-27T16:45:59.798Z · [CI run](https://github.com/sovereignbase/sequencer/actions/runs/46035866481)

The latest verification passed 403 Vitest tests and 153 compatibility checks.
The configured 100% coverage threshold is met (100% statements, 100% branches, 100% functions, 100% lines).
See the [test suites](test/README.md) and
[automated test report](https://sovereignbase.dev/sequencer/tests/).

### Works everywhere where JavaScript and Wasm works

2026-11-27T16:45:59.804Z · [CI run](https://github.com/sovereignbase/sequencer/actions/runs/46035866481)

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
