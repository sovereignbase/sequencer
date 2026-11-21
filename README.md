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

2026-11-21T13:47:05.712Z · local run

#### Moderate bundle size

| Format   | Raw (KiB) | Minified (KiB) | Minified + gzip (KiB) |
| -------- | --------: | -------------: | --------------------: |
| ESM      |    180.23 |         147.54 |                 50.66 |
| CommonJS |    180.39 |         148.90 |                 50.84 |

Both bundles include WASM. Terser uses three compression passes; gzip uses level 9.

#### Average throughput during editing to checkpoint

Arithmetic means of 3 runs, in ops/s, from each phase's start to checkpoint.
Strips contain 1–100 Frames (visible entries). Headers show Strip counts and mean Frame counts.

**↑ Scale up (0 → 25,000 Strips)**

| Method / case  | 1,000 Strips<br>50,871 Frames | 5,000 Strips<br>252,214 Frames | 10,000 Strips<br>504,871 Frames | 15,000 Strips<br>758,280 Frames | 20,000 Strips<br>1,010,749 Frames | 25,000 Strips<br>1,264,003 Frames |
| -------------- | ----------------------------: | -----------------------------: | ------------------------------: | ------------------------------: | --------------------------------: | --------------------------------: |
| apply.random   |                       143,891 |                        156,631 |                         153,959 |                         145,135 |                           143,418 |                           139,129 |
| insert.head    |                       569,906 |                        617,310 |                         669,141 |                         684,431 |                           664,803 |                           649,317 |
| insert.random  |                       356,387 |                        395,282 |                         365,069 |                         356,832 |                           301,490 |                           298,129 |
| insert.tail    |                       663,402 |                        754,062 |                         764,718 |                         709,007 |                           701,943 |                           666,980 |
| remove.head    |                             — |                              — |                               — |                               — |                                 — |                                 — |
| remove.random  |                       230,940 |                        233,192 |                         221,106 |                         212,883 |                           209,644 |                           199,923 |
| remove.tail    |                             — |                              — |                               — |                               — |                                 — |                                 — |
| replace.head   |                       199,076 |                        229,328 |                         233,061 |                         231,995 |                           218,817 |                           210,645 |
| replace.random |                       178,344 |                        190,630 |                         184,492 |                         179,521 |                           174,227 |                           169,878 |
| replace.tail   |                       196,926 |                        240,001 |                         248,597 |                         248,027 |                           239,222 |                           234,662 |
| value.head     |                     1,105,799 |                      1,462,108 |                       1,602,842 |                       1,647,516 |                         1,653,308 |                         1,641,039 |
| value.random   |                       742,085 |                        684,242 |                         613,609 |                         570,733 |                           542,508 |                           520,255 |
| value.tail     |                     2,343,725 |                      3,045,467 |                       3,226,144 |                       3,404,859 |                         3,442,169 |                         3,416,816 |

**↓ Scale down (25,000 → 0 Strips)**

| Method / case  | 20,000 Strips<br>1,012,742 Frames | 15,000 Strips<br>755,860 Frames | 10,000 Strips<br>504,103 Frames | 5,000 Strips<br>251,203 Frames | 1,000 Strips<br>51,057 Frames | 0 Strips<br>0 Frames |
| -------------- | --------------------------------: | ------------------------------: | ------------------------------: | -----------------------------: | ----------------------------: | -------------------: |
| apply.random   |                           157,309 |                         155,914 |                         145,172 |                        148,023 |                       154,866 |              155,821 |
| insert.head    |                                 — |                               — |                               — |                              — |                             — |                    — |
| insert.random  |                           295,150 |                         300,485 |                         268,530 |                        283,667 |                       302,919 |              306,961 |
| insert.tail    |                                 — |                               — |                               — |                              — |                             — |                    — |
| remove.head    |                           285,977 |                         243,036 |                         229,566 |                        243,698 |                       259,152 |              260,994 |
| remove.random  |                           220,880 |                         221,593 |                         212,252 |                        220,253 |                       229,857 |              231,775 |
| remove.tail    |                           300,656 |                         301,998 |                         287,964 |                        298,403 |                       308,884 |              309,985 |
| replace.head   |                           223,331 |                         213,641 |                         204,987 |                        210,670 |                       217,670 |              218,836 |
| replace.random |                           177,432 |                         171,682 |                         167,487 |                        167,456 |                       176,088 |              178,071 |
| replace.tail   |                           130,763 |                          34,108 |                          32,000 |                         31,542 |                        35,753 |               36,950 |
| value.head     |                         1,296,715 |                       1,277,382 |                       1,211,234 |                      1,254,573 |                     1,292,500 |            1,295,738 |
| value.random   |                           542,936 |                         539,716 |                         521,368 |                        536,184 |                       565,937 |              573,708 |
| value.tail     |                         2,601,122 |                       2,551,965 |                       2,425,715 |                      2,456,216 |                     2,515,200 |            2,513,196 |

#### API throughput at checkpoint

Checkpoint calls, in ops/s, averaged across runs.

**↑ Scale up (0 → 25,000 Strips)**

| Method                            | 1,000 Strips<br>50,871 Frames | 5,000 Strips<br>252,214 Frames | 10,000 Strips<br>504,871 Frames | 15,000 Strips<br>758,280 Frames | 20,000 Strips<br>1,010,749 Frames | 25,000 Strips<br>1,264,003 Frames |
| --------------------------------- | ----------------------------: | -----------------------------: | ------------------------------: | ------------------------------: | --------------------------------: | --------------------------------: |
| new Projection(actorID, sequence) |                         1,974 |                            756 |                             322 |                             215 |                               147 |                               114 |
| sequence()                        |                           240 |                             89 |                              45 |                              36 |                                25 |                                21 |
| values()                          |                           593 |                            219 |                              82 |                              57 |                                60 |                                51 |

**↓ Scale down (25,000 → 0 Strips)**

| Method                            | 20,000 Strips<br>1,012,742 Frames | 15,000 Strips<br>755,860 Frames | 10,000 Strips<br>504,103 Frames | 5,000 Strips<br>251,203 Frames | 1,000 Strips<br>51,057 Frames | 0 Strips<br>0 Frames |
| --------------------------------- | --------------------------------: | ------------------------------: | ------------------------------: | -----------------------------: | ----------------------------: | -------------------: |
| new Projection(actorID, sequence) |                               173 |                             227 |                             346 |                            558 |                         2,996 |               33,461 |
| sequence()                        |                                36 |                              40 |                              50 |                             54 |                            87 |                  391 |
| values()                          |                                81 |                              98 |                             142 |                            214 |                         1,106 |               96,644 |

#### Sequence disk size at checkpoint

Complete exported Sequences, including Footage and acknowledgements. Sizes are in KiB.

**↑ Scale up (0 → 25,000 Strips)**

| Encoding           | 1,000 Strips<br>50,871 Frames | 5,000 Strips<br>252,214 Frames | 10,000 Strips<br>504,871 Frames | 15,000 Strips<br>758,280 Frames | 20,000 Strips<br>1,010,749 Frames | 25,000 Strips<br>1,264,003 Frames |
| ------------------ | ----------------------------: | -----------------------------: | ------------------------------: | ------------------------------: | --------------------------------: | --------------------------------: |
| JSON               |                        277.07 |                       1,619.89 |                        3,265.59 |                        4,930.61 |                          7,108.09 |                          9,266.37 |
| JSON + gzip        |                         14.60 |                          73.44 |                          148.95 |                          225.91 |                            310.72 |                            392.64 |
| MessagePack        |                        164.81 |                         818.92 |                        1,646.03 |                        3,553.60 |                          5,126.26 |                          6,551.31 |
| MessagePack + gzip |                         12.38 |                          61.63 |                          124.81 |                          200.05 |                            263.44 |                            335.07 |

**↓ Scale down (25,000 → 0 Strips)**

| Encoding           | 20,000 Strips<br>1,012,742 Frames | 15,000 Strips<br>755,860 Frames | 10,000 Strips<br>504,103 Frames | 5,000 Strips<br>251,203 Frames | 1,000 Strips<br>51,057 Frames | 0 Strips<br>0 Frames |
| ------------------ | --------------------------------: | ------------------------------: | ------------------------------: | -----------------------------: | ----------------------------: | -------------------: |
| JSON               |                          7,573.26 |                        5,699.04 |                        3,809.96 |                       1,888.43 |                        381.08 |                 0.02 |
| JSON + gzip        |                            326.50 |                          247.12 |                          164.82 |                          79.60 |                         15.97 |                 0.03 |
| MessagePack        |                          5,314.83 |                        3,986.78 |                        2,658.67 |                       1,319.82 |                        266.79 |                 0.01 |
| MessagePack + gzip |                            278.13 |                          209.79 |                          139.97 |                          67.74 |                         13.65 |                 0.03 |

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

2026-11-20T20:39:05.665Z · [CI run](https://github.com/sovereignbase/sequencer/actions/runs/44812418849)

Arithmetic means of 3 runs. Ordinary Projection versus a static tuple with maxLength. Both contain the same values; replacements preserve the field count.

#### Throughput (ops/s)

| Indices | Method / case   | Projection | Static tuple | Tuple / Projection |
| ------: | --------------- | ---------: | -----------: | -----------------: |
|       2 | create.sequence |  1,000,695 |      900,000 |              0.90× |
|       2 | replace.random  |  1,407,348 |    2,416,326 |              1.72× |
|       2 | apply.replace   |    846,039 |    1,470,492 |              1.74× |
|       2 | value.random    | 42,899,499 |   75,361,044 |              1.76× |
|       4 | create.sequence |    797,824 |      781,453 |              0.98× |
|       4 | replace.random  |  1,165,782 |    2,345,434 |              2.01× |
|       4 | apply.replace   |    751,762 |    1,542,488 |              2.05× |
|       4 | value.random    | 33,664,075 |   74,915,173 |              2.23× |
|       8 | create.sequence |    577,600 |      627,836 |              1.09× |
|       8 | replace.random  |  1,139,899 |    2,424,027 |              2.13× |
|       8 | apply.replace   |    733,559 |    1,592,909 |              2.17× |
|       8 | value.random    | 26,145,008 |   78,108,420 |              2.99× |
|     100 | create.sequence |    107,544 |      112,754 |              1.05× |
|     100 | replace.random  |  1,083,972 |    2,404,128 |              2.22× |
|     100 | apply.replace   |    730,557 |    1,588,112 |              2.17× |
|     100 | value.random    | 17,828,201 |   72,623,566 |              4.07× |

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

2026-11-21T13:40:59.675Z · local run

3 runs; median throughput in ops/s. Sizes are UTF-16 code units.

| Operation            | 1,024 array | 1,024 string | 65,536 array | 65,536 string | 1,048,576 array | 1,048,576 string |
| -------------------- | ----------: | -----------: | -----------: | ------------: | --------------: | ---------------: |
| insert               |     280,392 |    1,337,011 |        2,751 |     1,308,626 |             183 |        1,340,358 |
| insert.append        |      30,680 |       99,838 |          502 |        49,014 |              30 |              942 |
| replace              |      72,621 |      311,866 |        1,205 |       277,099 |              77 |          302,258 |
| remove               |     111,552 |      509,180 |        1,904 |       486,455 |             100 |          428,244 |
| remove.middle        |     309,268 |      439,893 |        2,419 |       448,710 |             229 |          503,274 |
| replace.middle       |     253,667 |      370,307 |        1,802 |       358,206 |             266 |          422,359 |
| apply                |     460,049 |      503,658 |      309,720 |       378,120 |         409,213 |          417,201 |
| apply.array          |     915,195 |      215,017 |      811,410 |         2,681 |         972,367 |              197 |
| concurrent.apply     |       7,395 |      143,587 |          127 |         3,715 |               9 |              516 |
| merge                |     204,544 |      433,306 |        2,279 |       418,489 |             206 |          438,675 |
| create               |     184,118 |      424,221 |        2,162 |       413,303 |             208 |          436,918 |
| value.random         |   9,384,540 |   10,419,161 |    7,583,956 |     9,670,356 |      11,822,561 |       11,528,996 |
| values.range         |   3,371,801 |    3,136,151 |    2,338,306 |     2,977,660 |       3,503,962 |        2,825,923 |
| values.array         |     617,095 |      292,060 |        3,599 |         3,009 |             229 |              215 |
| values.text          |      40,306 |    7,180,532 |          589 |     4,131,014 |              39 |        7,965,675 |
| sequence.array       |     437,843 |      235,185 |        3,773 |         2,393 |             208 |              213 |
| sequence.text        |      53,945 |    1,958,743 |        1,075 |     2,049,848 |               9 |        2,128,524 |
| sequence.edited.text |      38,820 |      218,348 |          625 |         5,226 |              11 |              294 |
| sequence.masked.text |      47,907 |      157,849 |          914 |       146,679 |              10 |          137,429 |

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

2026-11-21T13:40:32.990Z · local run

3 runs, 6,000 edits. Median results; string Footage in both modes.

| Workload   | Words    | Snapshot KiB | Snapshot gzip KiB | Mean update B | Encode ops/s | Load ops/s | Receive batches/s |
| ---------- | -------- | -----------: | ----------------: | ------------: | -----------: | ---------: | ----------------: |
| append     | unpacked |         5.90 |              3.61 |         22.88 |       14,659 |    105,475 |               128 |
| append     | packed   |         5.90 |              3.61 |         13.98 |       15,094 |     64,717 |               149 |
| prepend    | unpacked |        40.07 |             18.07 |         22.94 |        1,295 |        333 |                91 |
| prepend    | packed   |        17.62 |              3.67 |         14.99 |       17,431 |        747 |               109 |
| random     | unpacked |       138.05 |             57.31 |         39.88 |          237 |        112 |                38 |
| random     | packed   |        54.84 |             36.96 |         29.60 |        7,993 |        268 |                50 |
| concurrent | unpacked |        92.24 |             42.78 |         32.34 |          345 |        127 |                40 |
| concurrent | packed   |        42.46 |             28.93 |         23.69 |        9,377 |        227 |                59 |

Measured on Node 24.16.0, V8 13.6.233.17-node.49, win32 x64, Intel(R) Core(TM) i5-10210U CPU @ 1.60GHz. Random and concurrent workloads mix insertion, removal and replacement. Concurrent authors edit independent views. Sizes use MessagePack; updates are encoded individually. Load includes decoding and construction. Receive includes decoding and applying one complete edit batch. Preparation, checks, destruction and explicit JS process garbage collection are outside timings.

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

2026-11-21T13:38:11.907Z · local run

The latest verification passed 336 Vitest tests and 128 compatibility checks (1 failed).
The configured 100% coverage threshold is met (100% statements, 100% branches, 100% functions, 100% lines).
See the [test suites](test/README.md) and
[automated test report](https://sovereignbase.dev/sequencer/tests/).

### Works everywhere where JavaScript and Wasm works

2026-11-21T13:38:49.809Z · local run

Runtimes covered by the latest compatibility verification:

- Node.js, ESM: passed
- Node.js, CommonJS: passed
- Deno: passed
- Bun: passed
- Edge Runtime: passed
- Cloudflare Workers through workerd: passed
- Chromium browser windows: passed
- Firefox browser windows: failed (matching Playwright browser binary unavailable)
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
