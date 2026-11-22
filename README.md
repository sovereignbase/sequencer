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

2026-11-22T17:20:29.404Z · [CI run](https://github.com/sovereignbase/sequencer/actions/runs/45048530438)

#### Moderate bundle size

| Format   | Raw (KiB) | Minified (KiB) | Minified + gzip (KiB) |
| -------- | --------: | -------------: | --------------------: |
| ESM      |    185.92 |         152.88 |                 52.24 |
| CommonJS |    186.08 |         154.25 |                 52.40 |

Both bundles include WASM. Terser uses three compression passes; gzip uses level 9.

#### Average throughput during editing to checkpoint

Arithmetic means of 3 runs, in ops/s, from each phase's start to checkpoint.
Strips contain 1–100 Frames (visible entries). Headers show Strip counts and mean Frame counts.

**↑ Scale up (0 → 25,000 Strips)**

| Method / case  | 1,000 Strips<br>50,871 Frames | 5,000 Strips<br>252,214 Frames | 10,000 Strips<br>504,871 Frames | 15,000 Strips<br>758,280 Frames | 20,000 Strips<br>1,010,749 Frames | 25,000 Strips<br>1,264,003 Frames |
| -------------- | ----------------------------: | -----------------------------: | ------------------------------: | ------------------------------: | --------------------------------: | --------------------------------: |
| apply.random   |                       495,550 |                        457,406 |                         432,824 |                         430,905 |                           427,032 |                           417,749 |
| insert.head    |                     1,818,920 |                      1,736,375 |                       1,836,407 |                       1,933,224 |                         1,887,495 |                         1,907,699 |
| insert.random  |                     1,040,267 |                        959,354 |                         867,961 |                         855,814 |                           811,473 |                           802,955 |
| insert.tail    |                     2,182,941 |                      2,311,003 |                       2,253,247 |                       2,089,751 |                         2,083,804 |                         1,968,937 |
| remove.head    |                             — |                              — |                               — |                               — |                                 — |                                 — |
| remove.random  |                       710,962 |                        574,175 |                         557,776 |                         550,458 |                           518,564 |                           517,869 |
| remove.tail    |                             — |                              — |                               — |                               — |                                 — |                                 — |
| replace.head   |                       739,474 |                        747,725 |                         677,556 |                         628,439 |                           619,860 |                           620,018 |
| replace.random |                       570,186 |                        474,343 |                         451,969 |                         418,980 |                           421,329 |                           422,412 |
| replace.tail   |                       664,795 |                        574,628 |                         656,814 |                         691,991 |                           698,110 |                           713,754 |
| value.head     |                     4,608,532 |                      5,494,985 |                       5,795,705 |                       6,271,002 |                         6,556,968 |                         6,739,732 |
| value.random   |                     2,142,688 |                      1,354,937 |                       1,201,276 |                       1,150,565 |                         1,127,559 |                         1,104,893 |
| value.tail     |                     7,500,752 |                      8,612,836 |                       8,953,673 |                       9,661,449 |                        10,101,512 |                        10,390,448 |

**↓ Scale down (25,000 → 0 Strips)**

| Method / case  | 20,000 Strips<br>1,012,742 Frames | 15,000 Strips<br>755,860 Frames | 10,000 Strips<br>504,103 Frames | 5,000 Strips<br>251,203 Frames | 1,000 Strips<br>51,057 Frames | 0 Strips<br>0 Frames |
| -------------- | --------------------------------: | ------------------------------: | ------------------------------: | -----------------------------: | ----------------------------: | -------------------: |
| apply.random   |                           404,882 |                         400,695 |                         395,312 |                        396,337 |                       410,642 |              416,275 |
| insert.head    |                                 — |                               — |                               — |                              — |                             — |                    — |
| insert.random  |                           548,655 |                         601,937 |                         638,268 |                        655,040 |                       684,715 |              698,561 |
| insert.tail    |                                 — |                               — |                               — |                              — |                             — |                    — |
| remove.head    |                           869,238 |                         874,144 |                         843,812 |                        779,726 |                       814,390 |              823,728 |
| remove.random  |                           509,593 |                         519,672 |                         526,840 |                        526,200 |                       543,913 |              553,493 |
| remove.tail    |                         1,079,006 |                       1,063,675 |                       1,069,989 |                      1,085,561 |                     1,093,368 |            1,099,191 |
| replace.head   |                           639,889 |                         614,424 |                         620,629 |                        626,725 |                       633,473 |              640,573 |
| replace.random |                           418,393 |                         405,880 |                         421,060 |                        416,540 |                       432,513 |              440,466 |
| replace.tail   |                           272,743 |                          66,357 |                          73,993 |                         87,821 |                        97,902 |              101,376 |
| value.head     |                         3,351,218 |                       3,415,721 |                       3,465,106 |                      3,529,135 |                     3,563,424 |            3,594,884 |
| value.random   |                         1,000,344 |                       1,014,746 |                       1,032,264 |                      1,053,220 |                     1,087,945 |            1,113,211 |
| value.tail     |                         5,708,412 |                       5,470,653 |                       5,339,048 |                      5,348,961 |                     5,418,734 |            5,472,358 |

#### API throughput at checkpoint

Checkpoint calls, in ops/s, averaged across runs.

**↑ Scale up (0 → 25,000 Strips)**

| Method                            | 1,000 Strips<br>50,871 Frames | 5,000 Strips<br>252,214 Frames | 10,000 Strips<br>504,871 Frames | 15,000 Strips<br>758,280 Frames | 20,000 Strips<br>1,010,749 Frames | 25,000 Strips<br>1,264,003 Frames |
| --------------------------------- | ----------------------------: | -----------------------------: | ------------------------------: | ------------------------------: | --------------------------------: | --------------------------------: |
| new Projection(actorID, sequence) |                         6,714 |                          1,904 |                             938 |                             622 |                               418 |                               349 |
| sequence()                        |                           743 |                            173 |                             112 |                              90 |                                58 |                                50 |
| values()                          |                         1,428 |                            395 |                             154 |                             117 |                               112 |                                92 |

**↓ Scale down (25,000 → 0 Strips)**

| Method                            | 20,000 Strips<br>1,012,742 Frames | 15,000 Strips<br>755,860 Frames | 10,000 Strips<br>504,103 Frames | 5,000 Strips<br>251,203 Frames | 1,000 Strips<br>51,057 Frames | 0 Strips<br>0 Frames |
| --------------------------------- | --------------------------------: | ------------------------------: | ------------------------------: | -----------------------------: | ----------------------------: | -------------------: |
| new Projection(actorID, sequence) |                               421 |                             626 |                             904 |                          1,855 |                         7,823 |               57,137 |
| sequence()                        |                                66 |                              83 |                             102 |                            133 |                           201 |                  896 |
| values()                          |                               117 |                             161 |                             220 |                            413 |                         1,984 |              187,895 |

#### Sequence disk size at checkpoint

Complete exported Sequences, including Footage and acknowledgements. Sizes are in KiB.

**↑ Scale up (0 → 25,000 Strips)**

| Encoding           | 1,000 Strips<br>50,871 Frames | 5,000 Strips<br>252,214 Frames | 10,000 Strips<br>504,871 Frames | 15,000 Strips<br>758,280 Frames | 20,000 Strips<br>1,010,749 Frames | 25,000 Strips<br>1,264,003 Frames |
| ------------------ | ----------------------------: | -----------------------------: | ------------------------------: | ------------------------------: | --------------------------------: | --------------------------------: |
| JSON               |                        277.17 |                       1,620.98 |                        3,266.17 |                        4,927.93 |                          7,100.22 |                          9,260.28 |
| JSON + gzip        |                         14.60 |                          73.43 |                          148.99 |                          225.87 |                            310.72 |                            392.71 |
| MessagePack        |                        164.81 |                         818.92 |                        1,646.03 |                        3,550.40 |                          5,122.32 |                          6,548.73 |
| MessagePack + gzip |                         12.38 |                          61.63 |                          124.81 |                          200.07 |                            263.57 |                            335.20 |

**↓ Scale down (25,000 → 0 Strips)**

| Encoding           | 20,000 Strips<br>1,012,742 Frames | 15,000 Strips<br>755,860 Frames | 10,000 Strips<br>504,103 Frames | 5,000 Strips<br>251,203 Frames | 1,000 Strips<br>51,057 Frames | 0 Strips<br>0 Frames |
| ------------------ | --------------------------------: | ------------------------------: | ------------------------------: | -----------------------------: | ----------------------------: | -------------------: |
| JSON               |                          7,570.92 |                        5,703.41 |                        3,812.22 |                       1,888.25 |                        381.09 |                 0.02 |
| JSON + gzip        |                            326.81 |                          247.25 |                          164.84 |                          79.60 |                         15.97 |                 0.03 |
| MessagePack        |                          5,313.37 |                        3,986.11 |                        2,658.55 |                       1,318.56 |                        266.79 |                 0.01 |
| MessagePack + gzip |                            278.22 |                          209.87 |                          139.97 |                          67.76 |                         13.65 |                 0.03 |

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

2026-11-22T17:22:12.560Z · [CI run](https://github.com/sovereignbase/sequencer/actions/runs/45048530438)

Arithmetic means of 3 runs. Ordinary Projection versus a static tuple with maxLength. Both contain the same values; replacements preserve the field count.

#### Throughput (ops/s)

| Indices | Method / case   | Projection | Static tuple | Tuple / Projection |
| ------: | --------------- | ---------: | -----------: | -----------------: |
|       2 | create.sequence |  1,352,395 |    1,195,988 |              0.88× |
|       2 | replace.random  |  1,651,223 |    2,618,775 |              1.59× |
|       2 | apply.replace   |    981,293 |    1,606,043 |              1.64× |
|       2 | value.random    | 45,239,841 |   91,756,251 |              2.03× |
|       4 | create.sequence |  1,036,455 |      988,613 |              0.95× |
|       4 | replace.random  |  1,334,931 |    2,611,388 |              1.96× |
|       4 | apply.replace   |    841,725 |    1,687,321 |              2.00× |
|       4 | value.random    | 32,481,787 |   91,041,650 |              2.80× |
|       8 | create.sequence |    734,173 |      772,371 |              1.05× |
|       8 | replace.random  |  1,246,310 |    2,633,071 |              2.11× |
|       8 | apply.replace   |    847,552 |    1,665,198 |              1.96× |
|       8 | value.random    | 25,846,106 |   91,638,799 |              3.55× |
|     100 | create.sequence |    123,299 |      127,153 |              1.03× |
|     100 | replace.random  |  1,278,420 |    2,694,143 |              2.11× |
|     100 | apply.replace   |    867,267 |    1,697,573 |              1.96× |
|     100 | value.random    | 17,046,608 |   90,594,094 |              5.31× |

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

2026-11-22T17:22:50.234Z · [CI run](https://github.com/sovereignbase/sequencer/actions/runs/45048530438)

3 runs; median throughput in ops/s. Sizes are UTF-16 code units.

| Operation            | 1,024 array | 1,024 string | 65,536 array | 65,536 string | 1,048,576 array | 1,048,576 string |
| -------------------- | ----------: | -----------: | -----------: | ------------: | --------------: | ---------------: |
| insert               |     919,986 |    3,858,054 |        4,897 |     4,560,244 |             291 |        3,601,508 |
| insert.append        |     105,339 |      465,657 |        1,139 |       128,866 |              50 |            2,469 |
| replace              |     300,596 |    1,171,598 |        2,074 |     1,142,171 |             115 |        1,086,770 |
| remove               |     443,835 |    1,828,701 |        3,691 |     1,779,031 |             220 |        1,396,495 |
| remove.middle        |     782,369 |    1,703,913 |        4,658 |     1,759,370 |             259 |        1,605,035 |
| replace.middle       |     645,161 |    1,290,117 |        4,670 |     1,291,200 |             264 |        1,149,022 |
| apply                |   2,150,539 |    1,898,796 |    1,659,508 |     2,262,797 |       1,700,409 |        1,658,813 |
| apply.array          |   3,163,701 |      912,376 |    3,065,266 |         4,738 |       2,876,804 |              290 |
| concurrent.apply     |      30,283 |      541,779 |          398 |        10,088 |              18 |              578 |
| merge                |     655,158 |    1,425,660 |        4,888 |     1,472,664 |             317 |        1,528,157 |
| create               |     650,353 |    1,379,753 |        4,868 |     1,476,347 |             341 |        1,499,074 |
| value.random         |  29,952,899 |   27,880,126 |   23,679,423 |    37,272,450 |      48,257,783 |       37,982,900 |
| values.range         |  11,550,681 |   11,518,082 |   17,591,111 |    11,001,773 |      18,222,647 |       10,029,236 |
| values.array         |   1,526,692 |    1,272,688 |        4,658 |         4,875 |             290 |              303 |
| values.text          |     148,016 |   21,717,382 |        1,890 |    21,593,488 |             114 |       25,144,921 |
| sequence.array       |   1,351,028 |    1,043,060 |        4,746 |         4,985 |             291 |              305 |
| sequence.text        |     263,903 |   10,235,591 |        3,485 |    10,843,211 |              25 |        8,999,772 |
| sequence.edited.text |     150,273 |      826,551 |        2,304 |        20,602 |              24 |            1,151 |
| sequence.masked.text |     179,332 |      432,356 |        3,470 |       451,892 |              26 |          456,736 |

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

2026-11-22T17:23:11.562Z · [CI run](https://github.com/sovereignbase/sequencer/actions/runs/45048530438)

3 runs, 6,000 edits. Median results; string Footage in both modes.

| Workload   | Words    | Snapshot KiB | Snapshot gzip KiB | Mean update B | Encode ops/s | Load ops/s | Receive batches/s |
| ---------- | -------- | -----------: | ----------------: | ------------: | -----------: | ---------: | ----------------: |
| append     | unpacked |         5.90 |              3.61 |         22.88 |       62,071 |    308,346 |               489 |
| append     | packed   |         5.90 |              3.61 |         13.98 |       65,825 |    388,225 |               539 |
| prepend    | unpacked |        40.07 |             18.07 |         22.94 |        3,951 |      1,178 |               393 |
| prepend    | packed   |         5.90 |              3.62 |         13.99 |       66,776 |      1,792 |               437 |
| random     | unpacked |       138.05 |             57.31 |         39.88 |          931 |        375 |               135 |
| random     | packed   |        49.58 |             35.37 |         23.45 |       32,028 |        855 |               194 |
| concurrent | unpacked |        92.24 |             42.77 |         32.34 |        1,317 |        431 |               183 |
| concurrent | packed   |        38.94 |             28.15 |         20.71 |       37,149 |        552 |               217 |

Measured on Node 24.22.3, V8 13.6.233.17-node.63, linux x64, Intel(R) Xeon(R) 6975P-C. Random and concurrent workloads mix insertion, removal and replacement. Concurrent authors edit independent views. Sizes use MessagePack; updates are encoded individually. Load includes decoding and construction. Receive includes decoding and applying one complete edit batch. Preparation, checks, destruction and explicit JS process garbage collection are outside timings.

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

2026-11-22T17:20:11.938Z · [CI run](https://github.com/sovereignbase/sequencer/actions/runs/45048530438)

The latest verification passed 357 Vitest tests and 144 compatibility checks.
The configured 100% coverage threshold is met (100% statements, 100% branches, 100% functions, 100% lines).
See the [test suites](test/README.md) and
[automated test report](https://sovereignbase.dev/sequencer/tests/).

### Works everywhere where JavaScript and Wasm works

2026-11-22T17:20:11.943Z · [CI run](https://github.com/sovereignbase/sequencer/actions/runs/45048530438)

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
