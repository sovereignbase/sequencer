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

2026-11-22T17:29:46.431Z · [CI run](https://github.com/sovereignbase/sequencer/actions/runs/45049365331)

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
| apply.random   |                       354,753 |                        326,527 |                         319,364 |                         320,724 |                           321,388 |                           318,322 |
| insert.head    |                     1,348,004 |                      1,210,886 |                       1,305,656 |                       1,381,340 |                         1,374,443 |                         1,397,016 |
| insert.random  |                       795,390 |                        759,482 |                         720,977 |                         718,848 |                           690,418 |                           685,633 |
| insert.tail    |                     1,498,454 |                      1,562,326 |                       1,593,284 |                       1,535,271 |                         1,567,586 |                         1,511,352 |
| remove.head    |                             — |                              — |                               — |                               — |                                 — |                                 — |
| remove.random  |                       537,804 |                        413,385 |                         420,519 |                         428,994 |                           437,214 |                           438,739 |
| remove.tail    |                             — |                              — |                               — |                               — |                                 — |                                 — |
| replace.head   |                       500,878 |                        507,039 |                         519,344 |                         525,099 |                           503,727 |                           499,911 |
| replace.random |                       417,293 |                        330,296 |                         310,960 |                         297,455 |                           307,606 |                           315,773 |
| replace.tail   |                       471,708 |                        497,907 |                         523,617 |                         501,383 |                           510,543 |                           525,357 |
| value.head     |                     3,348,985 |                      3,896,554 |                       4,243,352 |                       4,561,193 |                         4,815,836 |                         4,972,345 |
| value.random   |                     1,659,156 |                      1,221,030 |                       1,135,535 |                       1,102,398 |                         1,081,935 |                         1,074,113 |
| value.tail     |                     6,084,557 |                      6,655,838 |                       6,948,406 |                       7,630,375 |                         8,098,572 |                         8,432,781 |

**↓ Scale down (25,000 → 0 Strips)**

| Method / case  | 20,000 Strips<br>1,012,742 Frames | 15,000 Strips<br>755,860 Frames | 10,000 Strips<br>504,103 Frames | 5,000 Strips<br>251,203 Frames | 1,000 Strips<br>51,057 Frames | 0 Strips<br>0 Frames |
| -------------- | --------------------------------: | ------------------------------: | ------------------------------: | -----------------------------: | ----------------------------: | -------------------: |
| apply.random   |                           325,250 |                         324,870 |                         318,032 |                        327,981 |                       337,219 |              340,357 |
| insert.head    |                                 — |                               — |                               — |                              — |                             — |                    — |
| insert.random  |                           581,092 |                         614,132 |                         634,501 |                        661,418 |                       686,668 |              697,481 |
| insert.tail    |                                 — |                               — |                               — |                              — |                             — |                    — |
| remove.head    |                           724,023 |                         736,198 |                         700,174 |                        719,093 |                       732,981 |              736,322 |
| remove.random  |                           445,828 |                         459,881 |                         438,294 |                        437,051 |                       454,088 |              460,727 |
| remove.tail    |                           799,941 |                         804,319 |                         803,961 |                        806,761 |                       726,488 |              730,595 |
| replace.head   |                           503,488 |                         488,325 |                         494,282 |                        494,249 |                       499,786 |              503,590 |
| replace.random |                           345,111 |                         341,647 |                         353,353 |                        335,484 |                       349,665 |              355,339 |
| replace.tail   |                           101,097 |                         136,510 |                          74,820 |                         82,244 |                        93,631 |               96,456 |
| value.head     |                         3,211,889 |                       3,328,782 |                       3,335,619 |                      3,354,748 |                     3,381,170 |            3,402,660 |
| value.random   |                           975,797 |                       1,002,962 |                       1,013,836 |                      1,042,558 |                     1,081,589 |            1,101,321 |
| value.tail     |                         5,686,482 |                       5,509,522 |                       5,318,776 |                      5,234,268 |                     5,315,848 |            5,348,220 |

#### API throughput at checkpoint

Checkpoint calls, in ops/s, averaged across runs.

**↑ Scale up (0 → 25,000 Strips)**

| Method                            | 1,000 Strips<br>50,871 Frames | 5,000 Strips<br>252,214 Frames | 10,000 Strips<br>504,871 Frames | 15,000 Strips<br>758,280 Frames | 20,000 Strips<br>1,010,749 Frames | 25,000 Strips<br>1,264,003 Frames |
| --------------------------------- | ----------------------------: | -----------------------------: | ------------------------------: | ------------------------------: | --------------------------------: | --------------------------------: |
| new Projection(actorID, sequence) |                         4,892 |                          1,247 |                             693 |                             456 |                               320 |                               264 |
| sequence()                        |                           571 |                            130 |                              79 |                              67 |                                43 |                                37 |
| values()                          |                           959 |                            287 |                             127 |                              91 |                                90 |                                74 |

**↓ Scale down (25,000 → 0 Strips)**

| Method                            | 20,000 Strips<br>1,012,742 Frames | 15,000 Strips<br>755,860 Frames | 10,000 Strips<br>504,103 Frames | 5,000 Strips<br>251,203 Frames | 1,000 Strips<br>51,057 Frames | 0 Strips<br>0 Frames |
| --------------------------------- | --------------------------------: | ------------------------------: | ------------------------------: | -----------------------------: | ----------------------------: | -------------------: |
| new Projection(actorID, sequence) |                               305 |                             437 |                             658 |                          1,369 |                         4,904 |               47,120 |
| sequence()                        |                                48 |                              61 |                              77 |                             94 |                           149 |                  613 |
| values()                          |                                95 |                             122 |                             172 |                            297 |                         1,310 |              116,071 |

#### Sequence disk size at checkpoint

Complete exported Sequences, including Footage and acknowledgements. Sizes are in KiB.

**↑ Scale up (0 → 25,000 Strips)**

| Encoding           | 1,000 Strips<br>50,871 Frames | 5,000 Strips<br>252,214 Frames | 10,000 Strips<br>504,871 Frames | 15,000 Strips<br>758,280 Frames | 20,000 Strips<br>1,010,749 Frames | 25,000 Strips<br>1,264,003 Frames |
| ------------------ | ----------------------------: | -----------------------------: | ------------------------------: | ------------------------------: | --------------------------------: | --------------------------------: |
| JSON               |                        277.41 |                       1,619.88 |                        3,261.02 |                        4,929.60 |                          7,103.44 |                          9,262.36 |
| JSON + gzip        |                         14.59 |                          73.44 |                          148.97 |                          226.09 |                            310.82 |                            392.54 |
| MessagePack        |                        164.81 |                         818.92 |                        1,646.03 |                        3,553.60 |                          5,126.26 |                          6,551.31 |
| MessagePack + gzip |                         12.38 |                          61.63 |                          124.80 |                          200.05 |                            263.47 |                            335.09 |

**↓ Scale down (25,000 → 0 Strips)**

| Encoding           | 20,000 Strips<br>1,012,742 Frames | 15,000 Strips<br>755,860 Frames | 10,000 Strips<br>504,103 Frames | 5,000 Strips<br>251,203 Frames | 1,000 Strips<br>51,057 Frames | 0 Strips<br>0 Frames |
| ------------------ | --------------------------------: | ------------------------------: | ------------------------------: | -----------------------------: | ----------------------------: | -------------------: |
| JSON               |                          7,571.37 |                        5,703.57 |                        3,809.45 |                       1,889.64 |                        381.23 |                 0.02 |
| JSON + gzip        |                            326.46 |                          247.17 |                          164.71 |                          79.66 |                         15.97 |                 0.03 |
| MessagePack        |                          5,314.83 |                        3,986.78 |                        2,658.67 |                       1,319.82 |                        266.79 |                 0.01 |
| MessagePack + gzip |                            278.14 |                          209.80 |                          139.97 |                          67.74 |                         13.65 |                 0.03 |

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

2026-11-22T17:32:13.284Z · [CI run](https://github.com/sovereignbase/sequencer/actions/runs/45049365331)

Arithmetic means of 3 runs. Ordinary Projection versus a static tuple with maxLength. Both contain the same values; replacements preserve the field count.

#### Throughput (ops/s)

| Indices | Method / case   | Projection | Static tuple | Tuple / Projection |
| ------: | --------------- | ---------: | -----------: | -----------------: |
|       2 | create.sequence |    796,001 |      695,036 |              0.87× |
|       2 | replace.random  |  1,094,331 |    1,604,289 |              1.47× |
|       2 | apply.replace   |    633,563 |    1,014,522 |              1.60× |
|       2 | value.random    | 35,948,053 |   60,644,258 |              1.69× |
|       4 | create.sequence |    611,509 |      617,383 |              1.01× |
|       4 | replace.random  |    908,608 |    1,596,397 |              1.76× |
|       4 | apply.replace   |    617,634 |    1,051,957 |              1.70× |
|       4 | value.random    | 27,571,062 |   61,597,032 |              2.23× |
|       8 | create.sequence |    456,854 |      497,842 |              1.09× |
|       8 | replace.random  |    893,231 |    1,612,278 |              1.80× |
|       8 | apply.replace   |    580,975 |    1,048,244 |              1.80× |
|       8 | value.random    | 21,098,420 |   62,991,566 |              2.99× |
|     100 | create.sequence |     79,668 |       87,748 |              1.10× |
|     100 | replace.random  |    863,651 |    1,605,716 |              1.86× |
|     100 | apply.replace   |    550,933 |    1,094,186 |              1.99× |
|     100 | value.random    | 15,467,120 |   59,873,341 |              3.87× |

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

2026-11-22T17:32:52.835Z · [CI run](https://github.com/sovereignbase/sequencer/actions/runs/45049365331)

3 runs; median throughput in ops/s. Sizes are UTF-16 code units.

| Operation            | 1,024 array | 1,024 string | 65,536 array | 65,536 string | 1,048,576 array | 1,048,576 string |
| -------------------- | ----------: | -----------: | -----------: | ------------: | --------------: | ---------------: |
| insert               |     688,804 |    2,124,020 |        3,526 |     2,276,655 |             231 |        1,956,777 |
| insert.append        |      69,227 |      374,337 |          864 |        97,712 |              38 |            2,050 |
| replace              |     207,715 |      606,874 |        1,406 |       591,987 |              92 |          598,458 |
| remove               |     362,283 |      937,784 |        2,420 |     1,028,157 |             171 |          908,402 |
| remove.middle        |     637,483 |    1,050,226 |        3,098 |     1,049,779 |             212 |          951,238 |
| replace.middle       |     521,888 |      807,691 |        3,108 |       802,711 |             212 |          776,610 |
| apply                |   1,137,392 |    1,011,773 |      713,004 |     1,165,545 |         742,210 |          913,151 |
| apply.array          |   1,710,611 |      674,578 |    1,363,464 |         3,617 |       1,689,469 |              231 |
| concurrent.apply     |      21,770 |      328,252 |          280 |         7,453 |              17 |              525 |
| merge                |     545,578 |      890,159 |        3,527 |       923,291 |             235 |          899,088 |
| create               |     478,115 |      818,443 |        3,557 |       920,484 |             240 |          936,182 |
| value.random         |  27,374,098 |   25,066,912 |   24,164,902 |    23,691,985 |      32,587,263 |       22,304,771 |
| values.range         |  11,276,517 |    7,644,465 |   12,177,050 |     9,055,558 |      13,493,945 |        8,695,689 |
| values.array         |   1,189,189 |      850,677 |        4,056 |         3,616 |             220 |              239 |
| values.text          |     106,135 |   15,346,728 |        1,329 |    15,257,769 |              81 |       20,541,451 |
| sequence.array       |     943,288 |      844,263 |        4,187 |         3,592 |             221 |              241 |
| sequence.text        |     162,353 |    6,116,984 |        2,297 |     5,634,693 |              26 |        7,054,344 |
| sequence.edited.text |     100,172 |      555,534 |        1,552 |        15,033 |              24 |              895 |
| sequence.masked.text |     124,406 |      329,072 |        2,290 |       326,516 |              24 |          327,930 |

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

2026-11-22T17:33:17.991Z · [CI run](https://github.com/sovereignbase/sequencer/actions/runs/45049365331)

3 runs, 6,000 edits. Median results; string Footage in both modes.

| Workload   | Words    | Snapshot KiB | Snapshot gzip KiB | Mean update B | Encode ops/s | Load ops/s | Receive batches/s |
| ---------- | -------- | -----------: | ----------------: | ------------: | -----------: | ---------: | ----------------: |
| append     | unpacked |         5.90 |              3.61 |         22.88 |       51,539 |    217,596 |               334 |
| append     | packed   |         5.90 |              3.61 |         13.98 |       42,172 |    193,971 |               392 |
| prepend    | unpacked |        40.07 |             18.07 |         22.94 |        2,628 |        756 |               273 |
| prepend    | packed   |         5.90 |              3.62 |         13.99 |       39,072 |      1,318 |               299 |
| random     | unpacked |       138.05 |             57.31 |         39.88 |          674 |        264 |               103 |
| random     | packed   |        49.58 |             35.38 |         23.45 |       29,457 |        605 |               150 |
| concurrent | unpacked |        92.24 |             42.76 |         32.34 |          919 |        290 |               132 |
| concurrent | packed   |        38.94 |             28.16 |         20.71 |       28,975 |        455 |               157 |

Measured on Node 24.22.3, V8 13.6.233.17-node.63, linux x64, AMD EPYC 7763 64-Core Processor. Random and concurrent workloads mix insertion, removal and replacement. Concurrent authors edit independent views. Sizes use MessagePack; updates are encoded individually. Load includes decoding and construction. Receive includes decoding and applying one complete edit batch. Preparation, checks, destruction and explicit JS process garbage collection are outside timings.

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

2026-11-22T17:29:23.601Z · [CI run](https://github.com/sovereignbase/sequencer/actions/runs/45049365331)

The latest verification passed 357 Vitest tests and 144 compatibility checks.
The configured 100% coverage threshold is met (100% statements, 100% branches, 100% functions, 100% lines).
See the [test suites](test/README.md) and
[automated test report](https://sovereignbase.dev/sequencer/tests/).

### Works everywhere where JavaScript and Wasm works

2026-11-22T17:29:23.607Z · [CI run](https://github.com/sovereignbase/sequencer/actions/runs/45049365331)

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
