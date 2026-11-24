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

2026-11-24T12:46:06.559Z · [CI run](https://github.com/sovereignbase/sequencer/actions/runs/45395972158)

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
| apply.random   |                       485,295 |                        457,714 |                         446,996 |                         445,770 |                           441,598 |                           433,576 |
| insert.head    |                     1,895,162 |                      1,766,916 |                       1,916,378 |                       2,015,973 |                         1,971,838 |                         1,977,273 |
| insert.random  |                     1,025,992 |                        970,373 |                         894,085 |                         884,153 |                           837,328 |                           824,826 |
| insert.tail    |                     2,044,427 |                      2,240,942 |                       2,240,795 |                       2,077,941 |                         2,104,992 |                         1,997,807 |
| remove.head    |                             — |                              — |                               — |                               — |                                 — |                                 — |
| remove.random  |                       720,216 |                        491,083 |                         524,707 |                         536,861 |                           545,143 |                           543,426 |
| remove.tail    |                             — |                              — |                               — |                               — |                                 — |                                 — |
| replace.head   |                       699,498 |                        750,057 |                         759,786 |                         759,118 |                           765,894 |                           734,802 |
| replace.random |                       558,872 |                        435,975 |                         445,743 |                         441,298 |                           440,285 |                           440,814 |
| replace.tail   |                       674,902 |                        686,322 |                         732,396 |                         708,566 |                           658,470 |                           681,493 |
| value.head     |                     4,594,051 |                      5,224,864 |                       5,648,959 |                       6,108,056 |                         6,351,320 |                         6,536,055 |
| value.random   |                     2,019,964 |                      1,406,209 |                       1,266,803 |                       1,211,339 |                         1,181,104 |                         1,154,888 |
| value.tail     |                     7,408,972 |                      8,805,962 |                       9,349,578 |                       9,944,866 |                        10,339,629 |                        10,624,237 |

**↓ Scale down (25,000 → 0 Strips)**

| Method / case  | 20,000 Strips<br>1,012,742 Frames | 15,000 Strips<br>755,860 Frames | 10,000 Strips<br>504,103 Frames | 5,000 Strips<br>251,203 Frames | 1,000 Strips<br>51,057 Frames | 0 Strips<br>0 Frames |
| -------------- | --------------------------------: | ------------------------------: | ------------------------------: | -----------------------------: | ----------------------------: | -------------------: |
| apply.random   |                           374,748 |                         394,058 |                         372,954 |                        390,082 |                       404,616 |              410,970 |
| insert.head    |                                 — |                               — |                               — |                              — |                             — |                    — |
| insert.random  |                           693,852 |                         713,504 |                         720,035 |                        740,961 |                       763,171 |              776,605 |
| insert.tail    |                                 — |                               — |                               — |                              — |                             — |                    — |
| remove.head    |                           974,426 |                         972,516 |                         899,664 |                        920,914 |                       945,397 |              951,930 |
| remove.random  |                           556,586 |                         559,934 |                         553,795 |                        563,015 |                       577,720 |              587,182 |
| remove.tail    |                         1,138,332 |                       1,136,017 |                       1,122,234 |                      1,126,333 |                     1,131,158 |            1,136,920 |
| replace.head   |                           672,945 |                         639,883 |                         636,260 |                        634,162 |                       640,972 |              645,097 |
| replace.random |                           443,862 |                         393,454 |                         410,585 |                        410,760 |                       427,732 |              435,573 |
| replace.tail   |                           417,923 |                         308,696 |                         107,156 |                        102,009 |                       112,405 |              116,096 |
| value.head     |                         3,653,237 |                       3,673,327 |                       3,594,758 |                      3,555,162 |                     3,588,884 |            3,621,250 |
| value.random   |                         1,061,650 |                       1,068,641 |                       1,069,099 |                      1,077,560 |                     1,110,916 |            1,135,637 |
| value.tail     |                         6,299,323 |                       6,092,868 |                       5,812,829 |                      5,602,149 |                     5,666,535 |            5,720,096 |

#### API throughput at checkpoint

Checkpoint calls, in ops/s, averaged across runs.

**↑ Scale up (0 → 25,000 Strips)**

| Method                            | 1,000 Strips<br>50,871 Frames | 5,000 Strips<br>252,214 Frames | 10,000 Strips<br>504,871 Frames | 15,000 Strips<br>758,280 Frames | 20,000 Strips<br>1,010,749 Frames | 25,000 Strips<br>1,264,003 Frames |
| --------------------------------- | ----------------------------: | -----------------------------: | ------------------------------: | ------------------------------: | --------------------------------: | --------------------------------: |
| new Projection(actorID, sequence) |                         6,570 |                          1,698 |                             921 |                             645 |                               440 |                               371 |
| sequence()                        |                           842 |                            177 |                             111 |                              93 |                                61 |                                53 |
| values()                          |                         1,370 |                            426 |                             233 |                             151 |                               117 |                                99 |

**↓ Scale down (25,000 → 0 Strips)**

| Method                            | 20,000 Strips<br>1,012,742 Frames | 15,000 Strips<br>755,860 Frames | 10,000 Strips<br>504,103 Frames | 5,000 Strips<br>251,203 Frames | 1,000 Strips<br>51,057 Frames | 0 Strips<br>0 Frames |
| --------------------------------- | --------------------------------: | ------------------------------: | ------------------------------: | -----------------------------: | ----------------------------: | -------------------: |
| new Projection(actorID, sequence) |                               432 |                             603 |                             941 |                          1,816 |                         7,204 |               63,185 |
| sequence()                        |                                72 |                              82 |                             100 |                            133 |                           195 |                  895 |
| values()                          |                               126 |                             167 |                             239 |                            457 |                         1,977 |              205,968 |

#### Sequence disk size at checkpoint

Complete exported Sequences, including Footage and acknowledgements. Sizes are in KiB.

**↑ Scale up (0 → 25,000 Strips)**

| Encoding           | 1,000 Strips<br>50,871 Frames | 5,000 Strips<br>252,214 Frames | 10,000 Strips<br>504,871 Frames | 15,000 Strips<br>758,280 Frames | 20,000 Strips<br>1,010,749 Frames | 25,000 Strips<br>1,264,003 Frames |
| ------------------ | ----------------------------: | -----------------------------: | ------------------------------: | ------------------------------: | --------------------------------: | --------------------------------: |
| JSON               |                        277.64 |                       1,620.99 |                        3,265.02 |                        4,930.56 |                          7,104.38 |                          9,261.51 |
| JSON + gzip        |                         14.59 |                          73.46 |                          149.01 |                          226.09 |                            310.88 |                            392.75 |
| MessagePack        |                        164.81 |                         818.92 |                        1,646.03 |                        3,553.60 |                          5,126.26 |                          6,551.31 |
| MessagePack + gzip |                         12.38 |                          61.63 |                          124.81 |                          200.05 |                            263.43 |                            335.03 |

**↓ Scale down (25,000 → 0 Strips)**

| Encoding           | 20,000 Strips<br>1,012,742 Frames | 15,000 Strips<br>755,860 Frames | 10,000 Strips<br>504,103 Frames | 5,000 Strips<br>251,203 Frames | 1,000 Strips<br>51,057 Frames | 0 Strips<br>0 Frames |
| ------------------ | --------------------------------: | ------------------------------: | ------------------------------: | -----------------------------: | ----------------------------: | -------------------: |
| JSON               |                          7,570.63 |                        5,705.40 |                        3,810.41 |                       1,888.32 |                        381.23 |                 0.02 |
| JSON + gzip        |                            326.72 |                          247.47 |                          164.77 |                          79.60 |                         15.97 |                 0.03 |
| MessagePack        |                          5,314.83 |                        3,986.78 |                        2,658.67 |                       1,319.82 |                        266.79 |                 0.01 |
| MessagePack + gzip |                            278.10 |                          209.80 |                          139.97 |                          67.74 |                         13.66 |                 0.03 |

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

2026-11-24T12:47:45.127Z · [CI run](https://github.com/sovereignbase/sequencer/actions/runs/45395972158)

Arithmetic means of 3 runs. Ordinary Projection versus a static tuple with maxLength. Both contain the same values; replacements preserve the field count.

#### Throughput (ops/s)

| Indices | Method / case   | Projection | Static tuple | Tuple / Projection |
| ------: | --------------- | ---------: | -----------: | -----------------: |
|       2 | create.sequence |  1,283,866 |    1,100,623 |              0.86× |
|       2 | replace.random  |  1,691,122 |    2,765,027 |              1.64× |
|       2 | apply.replace   |    990,599 |    1,598,864 |              1.61× |
|       2 | value.random    | 45,696,722 |   94,017,513 |              2.06× |
|       4 | create.sequence |  1,041,230 |      966,243 |              0.93× |
|       4 | replace.random  |  1,318,831 |    2,726,757 |              2.07× |
|       4 | apply.replace   |    900,702 |    1,689,486 |              1.88× |
|       4 | value.random    | 33,417,180 |   92,517,459 |              2.77× |
|       8 | create.sequence |    748,753 |      791,355 |              1.06× |
|       8 | replace.random  |  1,324,400 |    2,700,266 |              2.04× |
|       8 | apply.replace   |    871,454 |    1,672,391 |              1.92× |
|       8 | value.random    | 24,890,563 |   93,125,254 |              3.74× |
|     100 | create.sequence |    123,804 |      129,566 |              1.05× |
|     100 | replace.random  |  1,328,305 |    2,752,585 |              2.07× |
|     100 | apply.replace   |    880,519 |    1,746,853 |              1.98× |
|     100 | value.random    | 16,706,246 |   90,545,030 |              5.42× |

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

2026-11-24T12:48:22.527Z · [CI run](https://github.com/sovereignbase/sequencer/actions/runs/45395972158)

3 runs; median throughput in ops/s. Sizes are UTF-16 code units.

| Operation            | 1,024 array | 1,024 string | 65,536 array | 65,536 string | 1,048,576 array | 1,048,576 string |
| -------------------- | ----------: | -----------: | -----------: | ------------: | --------------: | ---------------: |
| insert               |     999,018 |    4,235,146 |        5,132 |     4,578,350 |             302 |        3,589,497 |
| insert.append        |     104,996 |      487,481 |        1,190 |       172,527 |              53 |            2,397 |
| replace              |     331,421 |    1,087,864 |        2,210 |     1,198,263 |             145 |        1,060,561 |
| remove               |     554,678 |    1,918,422 |        4,128 |     1,925,557 |             258 |        1,554,330 |
| remove.middle        |     906,097 |    1,830,852 |        5,425 |     1,796,589 |             314 |        1,723,381 |
| replace.middle       |     747,776 |    1,347,091 |        5,571 |     1,331,676 |             329 |        1,164,517 |
| apply                |   2,176,551 |    2,254,924 |    1,757,017 |     2,143,997 |       1,665,384 |        2,163,379 |
| apply.array          |   2,984,478 |      961,074 |    3,161,495 |         4,982 |       3,027,125 |              304 |
| concurrent.apply     |      31,780 |      569,547 |          418 |         9,724 |              20 |              640 |
| merge                |     749,916 |    1,508,378 |        5,483 |     1,437,332 |             356 |        1,461,784 |
| create               |     766,392 |    1,418,314 |        5,712 |     1,372,372 |             387 |        1,498,439 |
| value.random         |  28,191,340 |   38,128,284 |   28,924,485 |    27,387,082 |      47,951,124 |       29,269,726 |
| values.range         |  15,497,847 |    9,021,070 |   14,913,923 |    10,956,427 |      18,442,678 |       11,887,003 |
| values.array         |   2,311,951 |    1,199,302 |        5,029 |         5,114 |             309 |              316 |
| values.text          |     158,866 |   25,647,272 |        1,973 |    25,927,563 |             124 |       22,777,317 |
| sequence.array       |   1,801,582 |    1,277,991 |        5,345 |         5,258 |             315 |              343 |
| sequence.text        |     260,475 |   10,690,885 |        3,472 |    10,247,305 |              28 |        9,358,954 |
| sequence.edited.text |     153,663 |      766,972 |        2,342 |        20,731 |              25 |            1,161 |
| sequence.masked.text |     192,232 |      429,692 |        3,474 |       412,830 |              28 |          422,925 |

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

2026-11-24T12:48:43.054Z · [CI run](https://github.com/sovereignbase/sequencer/actions/runs/45395972158)

3 runs, 6,000 edits. Median results; string Footage in both modes.

| Workload   | Words    | Snapshot KiB | Snapshot gzip KiB | Mean update B | Encode ops/s | Load ops/s | Receive batches/s |
| ---------- | -------- | -----------: | ----------------: | ------------: | -----------: | ---------: | ----------------: |
| append     | unpacked |         5.90 |              3.61 |         22.88 |       64,429 |    325,897 |               565 |
| append     | packed   |         5.90 |              3.61 |         13.98 |       67,832 |    360,275 |               594 |
| prepend    | unpacked |        40.07 |             18.07 |         22.94 |        3,999 |      1,214 |               425 |
| prepend    | packed   |         5.90 |              3.62 |         13.99 |       66,966 |      1,838 |               468 |
| random     | unpacked |       138.05 |             57.31 |         39.88 |          944 |        373 |               153 |
| random     | packed   |        49.58 |             35.38 |         23.45 |       37,136 |        850 |               200 |
| concurrent | unpacked |        92.23 |             42.76 |         32.34 |        1,328 |        449 |               200 |
| concurrent | packed   |        38.94 |             28.21 |         20.71 |       40,299 |        964 |               243 |

Measured on Node 24.22.3, V8 13.6.233.17-node.63, linux x64, Intel(R) Xeon(R) 6975P-C. Random and concurrent workloads mix insertion, removal and replacement. Concurrent authors edit independent views. Sizes use MessagePack; updates are encoded individually. Load includes decoding and construction. Receive includes decoding and applying one complete edit batch. Preparation, checks, destruction and explicit JS process garbage collection are outside timings.

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

2026-11-24T12:49:00.874Z · [CI run](https://github.com/sovereignbase/sequencer/actions/runs/45395972158)

3 runs, 6,000 edits per author. Concurrent authors edit independent views; causal authors exchange history before the second author edits. Median results.

| Workload              | Mode       | Author edits/s | Apply edits/s | Receive edits/s | Update/author KiB | Document KiB | Memory MiB |
| --------------------- | ---------- | -------------: | ------------: | --------------: | ----------------: | -----------: | ---------: |
| append                | individual |      3,140,023 |     7,000,268 |       2,833,594 |             76.05 |         5.99 |      0.012 |
| append                | batch      |      3,656,771 |   722,282,412 |     653,452,407 |              5.88 |         5.99 |      0.012 |
| prepend               | individual |      2,553,860 |     3,205,176 |       1,734,661 |             76.11 |         5.99 |      0.942 |
| prepend               | batch      |      2,846,112 |     5,328,436 |       4,866,369 |              5.89 |         5.99 |      0.942 |
| random.characters     | individual |      1,694,587 |     2,135,335 |       1,508,884 |             82.09 |        28.31 |      0.963 |
| random.characters     | batch      |      1,753,250 |     3,069,129 |       2,943,640 |             22.95 |        28.31 |      0.963 |
| random.words          | individual |      1,672,417 |     1,790,042 |       1,583,830 |            125.68 |        73.88 |      1.036 |
| random.words          | batch      |      1,819,723 |     2,850,000 |       2,629,578 |             59.71 |        73.88 |      1.036 |
| concurrent.characters | individual |      2,091,259 |     2,376,454 |       1,431,581 |             82.04 |        56.41 |      1.926 |
| concurrent.characters | batch      |      1,860,782 |     2,713,684 |       2,588,613 |             22.92 |        56.41 |      1.926 |
| concurrent.words      | individual |      2,018,795 |     2,290,486 |       1,318,839 |            125.74 |       147.81 |      2.073 |
| concurrent.words      | batch      |      2,139,035 |     2,594,215 |       2,357,279 |             59.79 |       147.81 |      2.073 |
| concurrent.mixed      | individual |      1,231,562 |     1,400,546 |       1,191,740 |            154.61 |        97.83 |      1.573 |
| concurrent.mixed      | batch      |      1,534,096 |     1,871,013 |       1,689,501 |             56.88 |        97.82 |      1.573 |
| causal.characters     | individual |      1,788,977 |     2,016,944 |       1,675,961 |             88.96 |        63.81 |      1.933 |
| causal.characters     | batch      |      1,674,968 |     2,745,853 |       2,482,753 |             23.18 |        63.81 |      1.933 |
| causal.words          | individual |      1,754,488 |     2,171,273 |       1,481,982 |            135.13 |       156.41 |      2.081 |
| causal.words          | batch      |      1,703,196 |     2,502,377 |       2,200,346 |             60.68 |       156.41 |      2.081 |
| causal.mixed          | individual |      1,132,533 |     1,333,633 |       1,189,285 |            161.05 |       103.75 |      1.576 |
| causal.mixed          | batch      |      1,293,392 |     1,793,854 |       1,650,436 |             57.34 |       103.75 |      1.576 |

Measured on Node 24.22.3, V8 13.6.233.17-node.63, linux x64, Intel(R) Xeon(R) 6975P-C. Both modes group each author's binary Gossip into one MessagePack message. Batch Footage is uncompressed. Receive includes MessagePack decoding; apply excludes it. Document size follows complete acknowledgement exchange. Memory estimates use one receiver recreated from that compact checkpoint in a fresh runtime, excluding the author runtime. Preparation, verification, destruction and explicit JS process garbage collection are outside timings.

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

2026-11-24T12:45:49.602Z · [CI run](https://github.com/sovereignbase/sequencer/actions/runs/45395972158)

The latest verification passed 388 Vitest tests and 153 compatibility checks.
The configured 100% coverage threshold is met (100% statements, 100% branches, 100% functions, 100% lines).
See the [test suites](test/README.md) and
[automated test report](https://sovereignbase.dev/sequencer/tests/).

### Works everywhere where JavaScript and Wasm works

2026-11-24T12:45:49.607Z · [CI run](https://github.com/sovereignbase/sequencer/actions/runs/45395972158)

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
