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

2026-11-24T10:46:29.937Z · local run

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
| apply.random   |                       313,674 |                        283,092 |                         269,581 |                         271,025 |                           267,976 |                           257,103 |
| insert.head    |                     1,204,042 |                      1,130,646 |                       1,189,361 |                       1,236,701 |                         1,226,736 |                         1,234,827 |
| insert.random  |                       720,768 |                        655,697 |                         608,518 |                         602,774 |                           578,984 |                           571,724 |
| insert.tail    |                     1,330,592 |                      1,364,917 |                       1,367,160 |                       1,043,473 |                         1,068,774 |                         1,060,273 |
| remove.head    |                             — |                              — |                               — |                               — |                                 — |                                 — |
| remove.random  |                       424,453 |                        352,851 |                         308,030 |                         320,445 |                           329,934 |                           334,254 |
| remove.tail    |                             — |                              — |                               — |                               — |                                 — |                                 — |
| replace.head   |                       424,227 |                        440,389 |                         437,737 |                         442,715 |                           446,306 |                           436,026 |
| replace.random |                       350,248 |                        294,109 |                         286,028 |                         286,891 |                           285,132 |                           285,941 |
| replace.tail   |                       419,332 |                        442,829 |                         416,989 |                         396,165 |                           381,911 |                           394,608 |
| value.head     |                     2,604,254 |                      2,632,069 |                       2,894,268 |                       3,048,624 |                         3,089,856 |                         3,129,779 |
| value.random   |                     1,399,304 |                      1,025,613 |                         924,288 |                         897,677 |                           881,392 |                           866,001 |
| value.tail     |                     5,085,179 |                      5,683,573 |                       5,880,140 |                       6,207,608 |                         6,404,640 |                         6,496,077 |

**↓ Scale down (25,000 → 0 Strips)**

| Method / case  | 20,000 Strips<br>1,012,742 Frames | 15,000 Strips<br>755,860 Frames | 10,000 Strips<br>504,103 Frames | 5,000 Strips<br>251,203 Frames | 1,000 Strips<br>51,057 Frames | 0 Strips<br>0 Frames |
| -------------- | --------------------------------: | ------------------------------: | ------------------------------: | -----------------------------: | ----------------------------: | -------------------: |
| apply.random   |                           273,115 |                         270,361 |                         262,448 |                        268,463 |                       275,007 |              277,968 |
| insert.head    |                                 — |                               — |                               — |                              — |                             — |                    — |
| insert.random  |                           498,600 |                         513,188 |                         517,462 |                        535,316 |                       551,890 |              560,434 |
| insert.tail    |                                 — |                               — |                               — |                              — |                             — |                    — |
| remove.head    |                           532,574 |                         539,329 |                         520,322 |                        532,333 |                       542,799 |              546,720 |
| remove.random  |                           355,858 |                         365,635 |                         366,259 |                        376,212 |                       385,279 |              390,561 |
| remove.tail    |                           595,995 |                         594,483 |                         590,847 |                        593,430 |                       600,364 |              604,040 |
| replace.head   |                           415,433 |                         397,014 |                         396,826 |                        401,251 |                       404,735 |              407,645 |
| replace.random |                           297,059 |                         291,213 |                         296,497 |                        301,768 |                       309,883 |              314,474 |
| replace.tail   |                            87,630 |                         104,326 |                          74,527 |                         67,665 |                        73,128 |               75,591 |
| value.head     |                         2,338,198 |                       2,412,978 |                       2,413,317 |                      2,432,435 |                     2,439,792 |            2,450,914 |
| value.random   |                           885,600 |                         882,807 |                         882,941 |                        897,928 |                       926,204 |              940,914 |
| value.tail     |                         4,582,190 |                       4,475,622 |                       4,382,001 |                      4,320,849 |                     4,324,145 |            4,353,158 |

#### API throughput at checkpoint

Checkpoint calls, in ops/s, averaged across runs.

**↑ Scale up (0 → 25,000 Strips)**

| Method                            | 1,000 Strips<br>50,871 Frames | 5,000 Strips<br>252,214 Frames | 10,000 Strips<br>504,871 Frames | 15,000 Strips<br>758,280 Frames | 20,000 Strips<br>1,010,749 Frames | 25,000 Strips<br>1,264,003 Frames |
| --------------------------------- | ----------------------------: | -----------------------------: | ------------------------------: | ------------------------------: | --------------------------------: | --------------------------------: |
| new Projection(actorID, sequence) |                         4,289 |                          1,058 |                             597 |                             431 |                               301 |                               245 |
| sequence()                        |                           510 |                            109 |                              72 |                              65 |                                46 |                                43 |
| values()                          |                         1,181 |                            287 |                             125 |                              89 |                                92 |                                85 |

**↓ Scale down (25,000 → 0 Strips)**

| Method                            | 20,000 Strips<br>1,012,742 Frames | 15,000 Strips<br>755,860 Frames | 10,000 Strips<br>504,103 Frames | 5,000 Strips<br>251,203 Frames | 1,000 Strips<br>51,057 Frames | 0 Strips<br>0 Frames |
| --------------------------------- | --------------------------------: | ------------------------------: | ------------------------------: | -----------------------------: | ----------------------------: | -------------------: |
| new Projection(actorID, sequence) |                               280 |                             407 |                             595 |                          1,271 |                         6,049 |               60,130 |
| sequence()                        |                                51 |                              63 |                              72 |                            102 |                           154 |                  732 |
| values()                          |                               110 |                             133 |                             179 |                            326 |                         1,717 |              116,402 |

#### Sequence disk size at checkpoint

Complete exported Sequences, including Footage and acknowledgements. Sizes are in KiB.

**↑ Scale up (0 → 25,000 Strips)**

| Encoding           | 1,000 Strips<br>50,871 Frames | 5,000 Strips<br>252,214 Frames | 10,000 Strips<br>504,871 Frames | 15,000 Strips<br>758,280 Frames | 20,000 Strips<br>1,010,749 Frames | 25,000 Strips<br>1,264,003 Frames |
| ------------------ | ----------------------------: | -----------------------------: | ------------------------------: | ------------------------------: | --------------------------------: | --------------------------------: |
| JSON               |                        277.30 |                       1,621.00 |                        3,263.02 |                        4,930.44 |                          7,104.57 |                          9,260.08 |
| JSON + gzip        |                         14.59 |                          73.44 |                          148.95 |                          225.97 |                            310.64 |                            392.23 |
| MessagePack        |                        164.81 |                         818.92 |                        1,646.03 |                        3,553.60 |                          5,126.26 |                          6,551.31 |
| MessagePack + gzip |                         12.38 |                          61.62 |                          124.80 |                          200.03 |                            263.44 |                            335.07 |

**↓ Scale down (25,000 → 0 Strips)**

| Encoding           | 20,000 Strips<br>1,012,742 Frames | 15,000 Strips<br>755,860 Frames | 10,000 Strips<br>504,103 Frames | 5,000 Strips<br>251,203 Frames | 1,000 Strips<br>51,057 Frames | 0 Strips<br>0 Frames |
| ------------------ | --------------------------------: | ------------------------------: | ------------------------------: | -----------------------------: | ----------------------------: | -------------------: |
| JSON               |                          7,565.70 |                        5,699.33 |                        3,808.61 |                       1,885.76 |                        381.36 |                 0.02 |
| JSON + gzip        |                            326.36 |                          247.11 |                          164.75 |                          79.51 |                         15.97 |                 0.03 |
| MessagePack        |                          5,314.83 |                        3,986.78 |                        2,658.67 |                       1,319.82 |                        266.79 |                 0.01 |
| MessagePack + gzip |                            278.13 |                          209.78 |                          139.96 |                          67.72 |                         13.65 |                 0.03 |

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

2026-11-24T10:48:59.150Z · local run

Arithmetic means of 3 runs. Ordinary Projection versus a static tuple with maxLength. Both contain the same values; replacements preserve the field count.

#### Throughput (ops/s)

| Indices | Method / case   | Projection | Static tuple | Tuple / Projection |
| ------: | --------------- | ---------: | -----------: | -----------------: |
|       2 | create.sequence |    670,414 |      707,336 |              1.06× |
|       2 | replace.random  |    890,266 |    1,160,063 |              1.30× |
|       2 | apply.replace   |    529,783 |      794,765 |              1.50× |
|       2 | value.random    | 30,119,010 |   53,596,746 |              1.78× |
|       4 | create.sequence |    625,074 |      619,153 |              0.99× |
|       4 | replace.random  |    924,093 |    1,494,621 |              1.62× |
|       4 | apply.replace   |    588,859 |      964,755 |              1.64× |
|       4 | value.random    | 23,387,943 |   50,819,167 |              2.17× |
|       8 | create.sequence |    446,737 |      489,030 |              1.09× |
|       8 | replace.random  |    894,716 |    1,542,476 |              1.72× |
|       8 | apply.replace   |    586,050 |      951,459 |              1.62× |
|       8 | value.random    | 17,055,331 |   49,881,755 |              2.92× |
|     100 | create.sequence |     60,899 |       80,206 |              1.32× |
|     100 | replace.random  |    806,509 |    1,523,735 |              1.89× |
|     100 | apply.replace   |    565,152 |      976,821 |              1.73× |
|     100 | value.random    | 10,804,386 |   45,055,943 |              4.17× |

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

2026-11-24T10:49:58.459Z · local run

3 runs; median throughput in ops/s. Sizes are UTF-16 code units.

| Operation            | 1,024 array | 1,024 string | 65,536 array | 65,536 string | 1,048,576 array | 1,048,576 string |
| -------------------- | ----------: | -----------: | -----------: | ------------: | --------------: | ---------------: |
| insert               |     491,086 |    3,053,412 |        3,810 |     2,536,301 |             282 |        2,109,709 |
| insert.append        |      57,378 |      246,849 |          909 |        60,979 |              39 |            1,692 |
| replace              |     143,010 |      556,099 |        1,494 |       664,611 |             109 |          576,426 |
| remove               |     240,780 |      805,950 |        2,498 |       859,556 |             192 |          694,596 |
| remove.middle        |     451,335 |      856,268 |        4,100 |       986,489 |             353 |        1,051,267 |
| replace.middle       |     373,469 |      663,777 |        3,876 |       700,914 |             377 |          746,213 |
| apply                |   1,079,799 |    1,054,488 |      798,861 |     1,008,358 |         812,465 |          964,661 |
| apply.array          |   1,639,679 |      432,954 |    1,625,461 |         3,703 |       1,686,846 |              283 |
| concurrent.apply     |      15,229 |      256,206 |          257 |         6,686 |              13 |              708 |
| merge                |     370,369 |      837,311 |        4,026 |       824,576 |             301 |          898,936 |
| create               |     343,466 |      765,765 |        4,663 |       833,189 |             307 |          892,608 |
| value.random         |  18,534,461 |   15,671,720 |   15,420,235 |    19,658,638 |      21,115,783 |       19,958,278 |
| values.range         |   8,683,255 |    5,766,628 |    8,608,207 |     6,520,119 |       8,067,111 |        6,803,563 |
| values.array         |     792,147 |      512,617 |        4,529 |         4,034 |             377 |              278 |
| values.text          |      73,717 |   14,799,192 |        1,242 |    14,993,880 |              78 |       16,105,773 |
| sequence.array       |     717,066 |      492,959 |        4,527 |         4,000 |             394 |              293 |
| sequence.text        |     102,460 |    4,338,411 |        1,429 |     4,751,861 |              16 |        4,923,175 |
| sequence.edited.text |      68,158 |      398,826 |        1,079 |         9,063 |              15 |              578 |
| sequence.masked.text |      81,940 |      258,363 |        1,530 |       244,162 |              16 |          264,171 |

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

2026-11-24T10:49:37.992Z · local run

3 runs, 6,000 edits. Median results; string Footage in both modes.

| Workload   | Words    | Snapshot KiB | Snapshot gzip KiB | Mean update B | Encode ops/s | Load ops/s | Receive batches/s |
| ---------- | -------- | -----------: | ----------------: | ------------: | -----------: | ---------: | ----------------: |
| append     | unpacked |         5.90 |              3.61 |         22.88 |       27,045 |    152,753 |               234 |
| append     | packed   |         5.90 |              3.61 |         13.98 |       29,175 |    188,646 |               333 |
| prepend    | unpacked |        40.07 |             18.07 |         22.94 |        1,794 |        688 |               238 |
| prepend    | packed   |         5.90 |              3.61 |         13.99 |       30,197 |      1,143 |               254 |
| random     | unpacked |       138.05 |             57.31 |         39.88 |          439 |        205 |                80 |
| random     | packed   |        49.58 |             35.37 |         23.45 |       14,630 |        494 |               130 |
| concurrent | unpacked |        92.23 |             42.79 |         32.34 |          659 |        251 |               107 |
| concurrent | packed   |        38.94 |             28.16 |         20.71 |       17,492 |        409 |               145 |

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

2026-11-24T10:34:49.509Z · local run

5 runs, 6,000 edits per author. Concurrent authors edit independent views; causal authors exchange history before the second author edits. Median results.

| Workload              | Mode       | Author edits/s | Apply edits/s | Receive edits/s | Update/author KiB | Document KiB | Memory MiB |
| --------------------- | ---------- | -------------: | ------------: | --------------: | ----------------: | -----------: | ---------: |
| append                | individual |      1,897,893 |     3,698,453 |       1,344,809 |             76.05 |         5.99 |      0.012 |
| append                | batch      |      2,811,621 |   382,165,605 |     288,461,538 |              5.88 |         5.99 |      0.012 |
| prepend               | individual |      1,448,925 |     2,436,350 |       1,277,248 |             76.11 |         5.99 |      0.942 |
| prepend               | batch      |      2,024,701 |     3,299,604 |       2,907,118 |              5.89 |         5.99 |      0.942 |
| random.characters     | individual |      1,127,650 |     1,740,341 |       1,211,730 |             82.09 |        28.31 |      0.963 |
| random.characters     | batch      |      1,248,284 |     2,056,414 |       1,871,374 |             22.95 |        28.31 |      0.963 |
| random.words          | individual |      1,165,773 |     1,583,531 |         939,717 |            125.68 |        73.88 |      1.036 |
| random.words          | batch      |      1,228,199 |     1,830,049 |       1,662,096 |             59.71 |        73.88 |      1.036 |
| concurrent.characters | individual |      1,286,132 |     1,500,450 |       1,030,671 |             82.04 |        56.41 |      1.926 |
| concurrent.characters | batch      |      1,126,454 |     1,798,831 |       1,458,523 |             22.92 |        56.41 |      1.926 |
| concurrent.words      | individual |      1,258,152 |     1,456,717 |         901,747 |            125.74 |       147.81 |      2.073 |
| concurrent.words      | batch      |      1,459,392 |     1,624,563 |       1,557,491 |             59.79 |       147.81 |      2.073 |
| concurrent.mixed      | individual |        790,415 |     1,026,492 |         725,334 |            154.61 |        97.82 |      1.573 |
| concurrent.mixed      | batch      |      1,016,949 |     1,247,907 |       1,162,701 |             56.88 |        97.83 |      1.573 |
| causal.characters     | individual |      1,171,486 |     1,562,968 |       1,042,209 |             88.96 |        63.81 |      1.933 |
| causal.characters     | batch      |      1,264,449 |     1,764,395 |       1,471,093 |             23.18 |        63.81 |      1.933 |
| causal.words          | individual |      1,090,423 |     1,266,544 |         720,773 |            135.13 |       156.41 |      2.081 |
| causal.words          | batch      |      1,342,177 |     1,645,098 |       1,508,220 |             60.68 |       156.41 |      2.081 |
| causal.mixed          | individual |        730,611 |       963,121 |         715,444 |            161.05 |       103.75 |      1.576 |
| causal.mixed          | batch      |        878,188 |     1,189,332 |       1,132,642 |             57.34 |       103.75 |      1.576 |

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

2026-11-24T10:56:31.546Z · local run

The latest verification passed 388 Vitest tests and 136 compatibility checks.
The configured 100% coverage threshold is met (100% statements, 100% branches, 100% functions, 100% lines).
See the [test suites](test/README.md) and
[automated test report](https://sovereignbase.dev/sequencer/tests/).

### Works everywhere where JavaScript and Wasm works

2026-11-24T10:57:43.329Z · local run

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
