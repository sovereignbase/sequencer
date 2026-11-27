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

2026-11-27T21:50:10.339Z · [CI run](https://github.com/sovereignbase/sequencer/actions/runs/46072517566)

#### Moderate bundle size

| Format   | Raw (KiB) | Minified (KiB) | Minified + gzip (KiB) |
| -------- | --------: | -------------: | --------------------: |
| ESM      |    202.56 |         165.86 |                 56.94 |
| CommonJS |    202.74 |         167.48 |                 57.15 |

Both bundles include WASM. Terser uses three compression passes; gzip uses level 9.

#### Average throughput during editing to checkpoint

Arithmetic means of 3 runs, in ops/s, from each phase's start to checkpoint.
Strips contain 1–100 Frames (visible entries). Headers show Strip counts and mean Frame counts.

**↑ Scale up (0 → 25,000 Strips)**

| Method / case  | 1,000 Strips<br>50,871 Frames | 5,000 Strips<br>252,214 Frames | 10,000 Strips<br>504,871 Frames | 15,000 Strips<br>758,280 Frames | 20,000 Strips<br>1,010,749 Frames | 25,000 Strips<br>1,264,003 Frames |
| -------------- | ----------------------------: | -----------------------------: | ------------------------------: | ------------------------------: | --------------------------------: | --------------------------------: |
| apply.random   |                       638,606 |                        683,722 |                         665,571 |                         655,694 |                           655,251 |                           645,888 |
| insert.head    |                     2,484,057 |                      2,761,385 |                       2,762,716 |                       2,775,439 |                         2,814,340 |                         2,818,296 |
| insert.random  |                     1,351,443 |                      1,453,035 |                       1,403,634 |                       1,359,140 |                         1,307,355 |                         1,309,240 |
| insert.tail    |                     2,771,832 |                      3,114,165 |                       3,047,465 |                       2,850,759 |                         2,972,243 |                         2,906,598 |
| remove.head    |                             — |                              — |                               — |                               — |                                 — |                                 — |
| remove.random  |                     1,232,359 |                      1,178,985 |                       1,144,894 |                       1,118,047 |                         1,137,320 |                         1,122,616 |
| remove.tail    |                             — |                              — |                               — |                               — |                                 — |                                 — |
| replace.head   |                       990,502 |                      1,112,986 |                       1,160,759 |                       1,157,711 |                         1,186,269 |                         1,151,875 |
| replace.random |                       813,090 |                        818,574 |                         799,550 |                         758,910 |                           762,640 |                           764,156 |
| replace.tail   |                       856,552 |                      1,046,923 |                       1,103,449 |                       1,108,440 |                         1,122,140 |                         1,116,985 |
| value.head     |                     5,566,227 |                      7,649,920 |                       8,138,223 |                       8,663,087 |                         8,984,508 |                         9,232,600 |
| value.random   |                     3,123,300 |                      2,440,305 |                       2,159,465 |                       1,965,071 |                         1,935,627 |                         1,892,171 |
| value.tail     |                    10,502,971 |                     13,280,741 |                      14,400,576 |                      15,265,644 |                        15,873,417 |                        16,088,976 |

**↓ Scale down (25,000 → 0 Strips)**

| Method / case  | 20,000 Strips<br>1,012,742 Frames | 15,000 Strips<br>755,860 Frames | 10,000 Strips<br>504,103 Frames | 5,000 Strips<br>251,203 Frames | 1,000 Strips<br>51,057 Frames | 0 Strips<br>0 Frames |
| -------------- | --------------------------------: | ------------------------------: | ------------------------------: | -----------------------------: | ----------------------------: | -------------------: |
| apply.random   |                           657,084 |                         651,210 |                         671,994 |                        677,800 |                       674,954 |              679,819 |
| insert.head    |                                 — |                               — |                               — |                              — |                             — |                    — |
| insert.random  |                         1,179,798 |                       1,221,982 |                       1,282,025 |                      1,331,087 |                     1,312,785 |            1,330,086 |
| insert.tail    |                                 — |                               — |                               — |                              — |                             — |                    — |
| remove.head    |                         1,752,553 |                       1,725,887 |                       1,593,394 |                      1,641,762 |                     1,614,738 |            1,620,099 |
| remove.random  |                         1,154,792 |                       1,168,038 |                       1,190,701 |                      1,229,266 |                     1,215,271 |            1,228,825 |
| remove.tail    |                         1,883,196 |                       1,870,109 |                       1,881,198 |                      1,897,755 |                     1,836,472 |            1,841,249 |
| replace.head   |                         1,075,788 |                       1,020,516 |                       1,015,180 |                      1,026,373 |                     1,011,602 |            1,020,492 |
| replace.random |                           761,120 |                         695,957 |                         745,426 |                        767,644 |                       763,847 |              775,120 |
| replace.tail   |                         1,152,228 |                         370,669 |                         434,890 |                        435,670 |                       438,484 |              450,198 |
| value.head     |                         5,331,883 |                       5,242,751 |                       5,268,591 |                      5,292,680 |                     5,179,018 |            5,216,293 |
| value.random   |                         1,816,163 |                       1,784,329 |                       1,836,773 |                      1,871,919 |                     1,895,224 |            1,931,478 |
| value.tail     |                         7,650,631 |                       7,433,550 |                       7,496,780 |                      7,592,886 |                     7,472,648 |            7,583,460 |

#### API throughput at checkpoint

Checkpoint calls, in ops/s, averaged across runs.

**↑ Scale up (0 → 25,000 Strips)**

| Method                            | 1,000 Strips<br>50,871 Frames | 5,000 Strips<br>252,214 Frames | 10,000 Strips<br>504,871 Frames | 15,000 Strips<br>758,280 Frames | 20,000 Strips<br>1,010,749 Frames | 25,000 Strips<br>1,264,003 Frames |
| --------------------------------- | ----------------------------: | -----------------------------: | ------------------------------: | ------------------------------: | --------------------------------: | --------------------------------: |
| new Projection(actorID, sequence) |                         8,057 |                          2,300 |                           1,054 |                             765 |                               531 |                               458 |
| sequence()                        |                           836 |                            196 |                             116 |                              98 |                                68 |                                57 |
| values()                          |                         1,867 |                            564 |                             313 |                             212 |                               170 |                               133 |

**↓ Scale down (25,000 → 0 Strips)**

| Method                            | 20,000 Strips<br>1,012,742 Frames | 15,000 Strips<br>755,860 Frames | 10,000 Strips<br>504,103 Frames | 5,000 Strips<br>251,203 Frames | 1,000 Strips<br>51,057 Frames | 0 Strips<br>0 Frames |
| --------------------------------- | --------------------------------: | ------------------------------: | ------------------------------: | -----------------------------: | ----------------------------: | -------------------: |
| new Projection(actorID, sequence) |                               532 |                             715 |                           1,049 |                          2,167 |                         8,808 |               72,214 |
| sequence()                        |                                73 |                              89 |                             117 |                            119 |                           202 |                1,215 |
| values()                          |                               153 |                             211 |                             325 |                            672 |                         2,218 |              194,407 |

#### Sequence disk size at checkpoint

Complete exported Sequences, including Footage and acknowledgements. Sizes are in KiB.

**↑ Scale up (0 → 25,000 Strips)**

| Encoding           | 1,000 Strips<br>50,871 Frames | 5,000 Strips<br>252,214 Frames | 10,000 Strips<br>504,871 Frames | 15,000 Strips<br>758,280 Frames | 20,000 Strips<br>1,010,749 Frames | 25,000 Strips<br>1,264,003 Frames |
| ------------------ | ----------------------------: | -----------------------------: | ------------------------------: | ------------------------------: | --------------------------------: | --------------------------------: |
| JSON               |                        277.29 |                       1,618.79 |                        3,264.91 |                        4,934.51 |                          7,105.24 |                          9,261.44 |
| JSON + gzip        |                         14.59 |                          73.46 |                          149.04 |                          226.09 |                            310.81 |                            392.45 |
| MessagePack        |                        164.81 |                         818.92 |                        1,646.03 |                        3,553.60 |                          5,126.26 |                          6,551.31 |
| MessagePack + gzip |                         12.38 |                          61.63 |                          124.81 |                          200.02 |                            263.38 |                            335.01 |

**↓ Scale down (25,000 → 0 Strips)**

| Encoding           | 20,000 Strips<br>1,012,742 Frames | 15,000 Strips<br>755,860 Frames | 10,000 Strips<br>504,103 Frames | 5,000 Strips<br>251,203 Frames | 1,000 Strips<br>51,057 Frames | 0 Strips<br>0 Frames |
| ------------------ | --------------------------------: | ------------------------------: | ------------------------------: | -----------------------------: | ----------------------------: | -------------------: |
| JSON               |                          7,572.65 |                        5,705.40 |                        3,810.39 |                       1,889.05 |                        380.94 |                 0.02 |
| JSON + gzip        |                            326.54 |                          247.16 |                          164.74 |                          79.63 |                         15.97 |                 0.03 |
| MessagePack        |                          5,314.83 |                        3,986.78 |                        2,658.67 |                       1,319.82 |                        266.79 |                 0.01 |
| MessagePack + gzip |                            278.09 |                          209.77 |                          139.97 |                          67.74 |                         13.65 |                 0.03 |

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

2026-11-27T21:51:36.675Z · [CI run](https://github.com/sovereignbase/sequencer/actions/runs/46072517566)

Arithmetic means of 3 runs. Ordinary Projection versus a static tuple with maxLength. Both contain the same values; replacements preserve the field count.

#### Throughput (ops/s)

| Indices | Method / case   | Projection | Static tuple | Tuple / Projection |
| ------: | --------------- | ---------: | -----------: | -----------------: |
|       2 | create.sequence |  1,588,667 |    1,343,134 |              0.85× |
|       2 | replace.random  |  2,464,067 |    3,060,140 |              1.24× |
|       2 | apply.replace   |  1,159,706 |    1,902,650 |              1.64× |
|       2 | value.random    | 54,431,071 |  108,013,627 |              1.98× |
|       4 | create.sequence |  1,154,279 |    1,117,291 |              0.97× |
|       4 | replace.random  |  1,894,437 |    3,296,243 |              1.74× |
|       4 | apply.replace   |  1,063,946 |    2,031,294 |              1.91× |
|       4 | value.random    | 39,784,806 |  106,948,540 |              2.69× |
|       8 | create.sequence |    789,027 |      843,370 |              1.07× |
|       8 | replace.random  |  1,795,336 |    3,167,106 |              1.76× |
|       8 | apply.replace   |  1,032,328 |    1,788,855 |              1.73× |
|       8 | value.random    | 32,967,162 |  109,393,288 |              3.32× |
|     100 | create.sequence |    138,798 |      149,523 |              1.08× |
|     100 | replace.random  |  1,697,062 |    3,246,802 |              1.91× |
|     100 | apply.replace   |  1,050,619 |    2,049,471 |              1.95× |
|     100 | value.random    | 20,971,075 |  107,647,088 |              5.13× |

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

2026-11-27T21:52:16.397Z · [CI run](https://github.com/sovereignbase/sequencer/actions/runs/46072517566)

3 runs; median throughput in ops/s. Sizes are UTF-16 code units.

| Operation            | 1,024 array | 1,024 string | 65,536 array | 65,536 string | 1,048,576 array | 1,048,576 string |
| -------------------- | ----------: | -----------: | -----------: | ------------: | --------------: | ---------------: |
| insert               |   1,092,610 |    3,887,773 |        4,475 |     4,851,873 |             306 |        4,140,132 |
| insert.append        |      98,941 |      490,279 |        1,352 |       166,385 |              58 |            2,422 |
| replace              |     729,327 |    1,296,801 |        4,548 |     1,241,357 |             307 |        1,132,134 |
| remove               |   1,919,335 |    1,782,670 |    1,347,523 |     1,726,881 |         309,029 |        1,713,885 |
| remove.middle        |   1,008,215 |    1,841,543 |        4,830 |     1,738,400 |             312 |        1,774,208 |
| replace.middle       |     856,366 |    1,250,539 |        4,830 |     1,318,039 |             295 |        1,318,621 |
| apply                |   2,011,152 |    2,106,191 |    1,944,820 |     2,149,219 |       1,747,340 |        1,979,254 |
| apply.array          |   2,888,154 |    1,022,509 |    2,986,388 |         4,463 |       2,785,956 |              302 |
| concurrent.apply     |      47,990 |      519,947 |          546 |         9,044 |              32 |              631 |
| merge                |     723,667 |    1,357,019 |        4,549 |     1,305,551 |             314 |        1,404,284 |
| create               |     843,522 |    1,689,707 |        4,705 |     1,803,503 |             303 |        1,840,335 |
| value.random         |  33,140,792 |   35,837,323 |   36,507,174 |    35,169,827 |      35,906,428 |       28,898,702 |
| values.range         |  17,719,997 |   15,513,554 |   15,391,668 |    13,464,142 |      20,741,052 |       15,121,176 |
| values.array         |   3,032,383 |    1,781,693 |        4,957 |         4,567 |             334 |              301 |
| values.text          |     231,047 |   30,018,741 |        2,534 |    30,719,746 |             154 |       23,474,112 |
| sequence.array       |   2,733,439 |    1,466,196 |        4,903 |         4,581 |             310 |              301 |
| sequence.text        |     280,679 |   11,892,522 |        4,070 |    12,258,267 |              55 |       12,490,518 |
| sequence.edited.text |     255,398 |    3,072,067 |        4,457 |       359,204 |              49 |           27,446 |
| sequence.masked.text |     214,119 |      592,202 |        4,654 |       610,178 |              45 |          623,326 |

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

2026-11-27T21:54:17.712Z · [CI run](https://github.com/sovereignbase/sequencer/actions/runs/46072517566)

3 runs, 6,000 edits. Median results; string Footage in both modes.

| Workload   | Words    | Snapshot KiB | Snapshot gzip KiB | Mean update B | Encode ops/s | Load ops/s | Receive batches/s |
| ---------- | -------- | -----------: | ----------------: | ------------: | -----------: | ---------: | ----------------: |
| append     | unpacked |         5.90 |              3.61 |         22.88 |       99,569 |    374,996 |               700 |
| append     | packed   |         5.90 |              3.61 |         13.98 |       95,140 |    410,951 |               816 |
| prepend    | unpacked |        40.07 |             18.07 |         22.94 |        5,332 |      1,780 |               583 |
| prepend    | packed   |         5.90 |              3.61 |         13.99 |       90,033 |      3,551 |               645 |
| random     | unpacked |       138.05 |             57.31 |         39.88 |        1,241 |        452 |               193 |
| random     | packed   |        49.58 |             35.38 |         23.45 |       51,456 |      1,094 |               251 |
| concurrent | unpacked |        92.22 |             42.78 |         32.34 |        1,531 |        431 |               237 |
| concurrent | packed   |        38.94 |             28.15 |         20.71 |       52,951 |        778 |               315 |

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

2026-11-27T21:54:34.964Z · [CI run](https://github.com/sovereignbase/sequencer/actions/runs/46072517566)

3 runs, 6,000 edits per author. Concurrent authors edit independent views; causal authors exchange history before the second author edits. Median results.

| Workload              | Mode       | Author edits/s | Apply edits/s | Receive edits/s | Update/author KiB | Document KiB | Memory MiB |
| --------------------- | ---------- | -------------: | ------------: | --------------: | ----------------: | -----------: | ---------: |
| append                | individual |      3,581,916 |     9,516,212 |       3,171,787 |             76.05 |         5.99 |      0.012 |
| append                | batch      |      5,149,459 |   723,589,001 |     560,957,367 |              5.88 |         5.99 |      0.012 |
| prepend               | individual |      3,184,938 |     3,817,267 |       2,083,398 |             76.11 |         5.99 |      0.896 |
| prepend               | batch      |      4,000,541 |     6,825,100 |       6,077,667 |              5.89 |         5.99 |      0.896 |
| random.characters     | individual |      1,762,065 |     2,306,441 |       1,845,499 |             82.09 |        28.31 |      0.917 |
| random.characters     | batch      |      2,231,660 |     3,523,852 |       3,482,007 |             22.95 |        28.31 |      0.917 |
| random.words          | individual |      1,932,297 |     2,171,304 |       1,767,959 |            125.68 |        73.88 |      0.991 |
| random.words          | batch      |      2,255,130 |     3,419,384 |       3,151,183 |             59.71 |        73.88 |      0.991 |
| concurrent.characters | individual |      2,469,048 |     2,498,205 |       2,058,595 |             82.04 |        56.41 |      1.834 |
| concurrent.characters | batch      |      2,194,148 |     3,487,948 |       2,936,891 |             22.92 |        56.41 |      1.834 |
| concurrent.words      | individual |      2,415,713 |     2,424,144 |       1,644,530 |            125.74 |       147.81 |      1.981 |
| concurrent.words      | batch      |      2,595,710 |     3,156,396 |       2,721,154 |             59.79 |       147.81 |      1.981 |
| concurrent.mixed      | individual |      1,351,326 |     1,679,153 |       1,337,607 |            154.61 |        97.83 |      1.505 |
| concurrent.mixed      | batch      |      1,618,458 |     2,284,227 |       2,051,307 |             56.88 |        97.83 |      1.505 |
| causal.characters     | individual |      1,958,468 |     2,797,214 |       2,234,606 |             88.96 |        63.81 |      1.842 |
| causal.characters     | batch      |      2,441,259 |     3,382,577 |       3,003,946 |             23.18 |        63.81 |      1.842 |
| causal.words          | individual |      1,923,797 |     2,340,529 |       1,856,387 |            135.13 |       156.41 |      1.989 |
| causal.words          | batch      |      2,169,493 |     3,080,908 |       2,705,779 |             60.68 |       156.41 |      1.989 |
| causal.mixed          | individual |      1,298,134 |     1,748,381 |       1,319,304 |            161.05 |       103.75 |      1.509 |
| causal.mixed          | batch      |      1,596,316 |     2,350,261 |       2,165,106 |             57.34 |       103.75 |      1.509 |

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

2026-11-27T21:49:58.862Z · [CI run](https://github.com/sovereignbase/sequencer/actions/runs/46072517566)

The latest verification passed 404 Vitest tests and 153 compatibility checks.
The configured 100% coverage threshold is met (100% statements, 100% branches, 100% functions, 100% lines).
See the [test suites](test/README.md) and
[automated test report](https://sovereignbase.dev/sequencer/tests/).

### Works everywhere where JavaScript and Wasm works

2026-11-27T21:49:58.866Z · [CI run](https://github.com/sovereignbase/sequencer/actions/runs/46072517566)

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
