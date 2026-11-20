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

2026-11-20T20:09:39.501Z · local run

#### Moderate bundle size

| Format   | Raw (KiB) | Minified (KiB) | Minified + gzip (KiB) |
| -------- | --------: | -------------: | --------------------: |
| ESM      |    151.04 |         121.31 |                 43.98 |
| CommonJS |    151.20 |         122.61 |                 44.17 |

Both bundles include WASM. Terser uses three compression passes; gzip uses level 9.

#### Average throughput during editing to checkpoint

Arithmetic means of 3 runs, in ops/s, from each phase's start to checkpoint.
Strips contain 1–100 Frames (visible entries). Headers show Strip counts and mean Frame counts.

**↑ Scale up (0 → 25,000 Strips)**

| Method / case  | 1,000 Strips<br>50,871 Frames | 5,000 Strips<br>252,214 Frames | 10,000 Strips<br>504,871 Frames | 15,000 Strips<br>758,280 Frames | 20,000 Strips<br>1,010,749 Frames | 25,000 Strips<br>1,264,003 Frames |
| -------------- | ----------------------------: | -----------------------------: | ------------------------------: | ------------------------------: | --------------------------------: | --------------------------------: |
| apply.random   |                       295,134 |                        225,730 |                         236,935 |                         235,809 |                           239,014 |                           232,420 |
| insert.head    |                     1,178,194 |                      1,088,107 |                       1,189,168 |                       1,204,832 |                         1,198,836 |                         1,208,255 |
| insert.random  |                       681,856 |                        502,356 |                         525,354 |                         519,980 |                           509,422 |                           513,233 |
| insert.tail    |                     1,350,253 |                      1,321,406 |                       1,366,973 |                       1,260,880 |                         1,268,370 |                         1,224,438 |
| remove.head    |                             — |                              — |                               — |                               — |                                 — |                                 — |
| remove.random  |                       429,720 |                        360,428 |                         358,039 |                         318,253 |                           322,761 |                           326,374 |
| remove.tail    |                             — |                              — |                               — |                               — |                                 — |                                 — |
| replace.head   |                       413,006 |                        425,365 |                         434,009 |                         422,437 |                           425,609 |                           415,824 |
| replace.random |                       350,013 |                        301,824 |                         270,903 |                         265,227 |                           266,701 |                           269,609 |
| replace.tail   |                       414,488 |                        355,526 |                         370,184 |                         379,311 |                           345,544 |                           360,245 |
| value.head     |                     2,320,211 |                      2,848,059 |                       3,089,984 |                       3,114,052 |                         3,168,490 |                         3,191,857 |
| value.random   |                     1,330,528 |                        954,856 |                         900,031 |                         819,688 |                           804,291 |                           799,718 |
| value.tail     |                     4,631,163 |                      5,242,254 |                       5,479,990 |                       5,700,073 |                         5,867,159 |                         5,961,936 |

**↓ Scale down (25,000 → 0 Strips)**

| Method / case  | 20,000 Strips<br>1,012,742 Frames | 15,000 Strips<br>755,860 Frames | 10,000 Strips<br>504,103 Frames | 5,000 Strips<br>251,203 Frames | 1,000 Strips<br>51,057 Frames | 0 Strips<br>0 Frames |
| -------------- | --------------------------------: | ------------------------------: | ------------------------------: | -----------------------------: | ----------------------------: | -------------------: |
| apply.random   |                           258,868 |                         250,403 |                         227,225 |                        226,825 |                       230,560 |              231,856 |
| insert.head    |                                 — |                               — |                               — |                              — |                             — |                    — |
| insert.random  |                           463,022 |                         461,710 |                         458,506 |                        463,468 |                       471,789 |              476,875 |
| insert.tail    |                                 — |                               — |                               — |                              — |                             — |                    — |
| remove.head    |                           511,187 |                         494,088 |                         467,915 |                        472,765 |                       479,162 |              479,677 |
| remove.random  |                           339,256 |                         333,565 |                         330,326 |                        331,780 |                       335,734 |              338,002 |
| remove.tail    |                           568,169 |                         427,478 |                         439,939 |                        450,531 |                       464,945 |              467,972 |
| replace.head   |                           391,839 |                         367,750 |                         366,134 |                        362,577 |                       346,357 |              347,177 |
| replace.random |                           277,695 |                         265,514 |                         255,992 |                        258,040 |                       262,009 |              263,527 |
| replace.tail   |                           157,553 |                          64,094 |                          57,018 |                         49,074 |                        55,233 |               57,054 |
| value.head     |                         1,728,815 |                       1,779,270 |                       1,833,305 |                      1,875,390 |                     1,925,883 |            1,932,796 |
| value.random   |                           768,855 |                         757,743 |                         751,148 |                        747,146 |                       755,036 |              765,994 |
| value.tail     |                         4,249,716 |                       4,079,262 |                       3,960,214 |                      3,873,608 |                     3,851,800 |            3,836,137 |

#### API throughput at checkpoint

Checkpoint calls, in ops/s, averaged across runs.

**↑ Scale up (0 → 25,000 Strips)**

| Method                            | 1,000 Strips<br>50,871 Frames | 5,000 Strips<br>252,214 Frames | 10,000 Strips<br>504,871 Frames | 15,000 Strips<br>758,280 Frames | 20,000 Strips<br>1,010,749 Frames | 25,000 Strips<br>1,264,003 Frames |
| --------------------------------- | ----------------------------: | -----------------------------: | ------------------------------: | ------------------------------: | --------------------------------: | --------------------------------: |
| new Projection(actorID, sequence) |                         4,363 |                          1,277 |                             570 |                             377 |                               226 |                               237 |
| sequence()                        |                           577 |                            119 |                              72 |                              59 |                                32 |                                37 |
| values()                          |                         1,009 |                            288 |                             118 |                              82 |                                77 |                                76 |

**↓ Scale down (25,000 → 0 Strips)**

| Method                            | 20,000 Strips<br>1,012,742 Frames | 15,000 Strips<br>755,860 Frames | 10,000 Strips<br>504,103 Frames | 5,000 Strips<br>251,203 Frames | 1,000 Strips<br>51,057 Frames | 0 Strips<br>0 Frames |
| --------------------------------- | --------------------------------: | ------------------------------: | ------------------------------: | -----------------------------: | ----------------------------: | -------------------: |
| new Projection(actorID, sequence) |                               284 |                             365 |                             436 |                          1,080 |                         5,215 |               45,779 |
| sequence()                        |                                46 |                              52 |                              56 |                             68 |                           131 |                  616 |
| values()                          |                                94 |                             109 |                             138 |                            304 |                         1,366 |              125,122 |

#### Sequence disk size at checkpoint

Complete exported Sequences, including Footage and acknowledgements. Sizes are in KiB.

**↑ Scale up (0 → 25,000 Strips)**

| Encoding           | 1,000 Strips<br>50,871 Frames | 5,000 Strips<br>252,214 Frames | 10,000 Strips<br>504,871 Frames | 15,000 Strips<br>758,280 Frames | 20,000 Strips<br>1,010,749 Frames | 25,000 Strips<br>1,264,003 Frames |
| ------------------ | ----------------------------: | -----------------------------: | ------------------------------: | ------------------------------: | --------------------------------: | --------------------------------: |
| JSON               |                        277.53 |                       1,620.42 |                        3,262.22 |                        4,927.37 |                          7,102.29 |                          9,259.11 |
| JSON + gzip        |                         14.60 |                          73.41 |                          148.84 |                          225.89 |                            310.66 |                            392.33 |
| MessagePack        |                        164.81 |                         818.92 |                        1,646.03 |                        3,553.60 |                          5,126.26 |                          6,551.31 |
| MessagePack + gzip |                         12.38 |                          61.63 |                          124.81 |                          200.05 |                            263.44 |                            335.07 |

**↓ Scale down (25,000 → 0 Strips)**

| Encoding           | 20,000 Strips<br>1,012,742 Frames | 15,000 Strips<br>755,860 Frames | 10,000 Strips<br>504,103 Frames | 5,000 Strips<br>251,203 Frames | 1,000 Strips<br>51,057 Frames | 0 Strips<br>0 Frames |
| ------------------ | --------------------------------: | ------------------------------: | ------------------------------: | -----------------------------: | ----------------------------: | -------------------: |
| JSON               |                          7,567.56 |                        5,701.88 |                        3,811.61 |                       1,888.59 |                        380.77 |                 0.02 |
| JSON + gzip        |                            326.28 |                          247.08 |                          164.73 |                          79.55 |                         15.97 |                 0.03 |
| MessagePack        |                          5,314.83 |                        3,986.78 |                        2,658.67 |                       1,319.82 |                        266.79 |                 0.01 |
| MessagePack + gzip |                            278.13 |                          209.80 |                          139.97 |                          67.74 |                         13.65 |                 0.03 |

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

2026-11-20T20:12:27.324Z · local run

Arithmetic means of 3 runs. Ordinary Projection versus a static tuple with maxLength. Both contain the same values; replacements preserve the field count.

#### Throughput (ops/s)

| Indices | Method / case   | Projection | Static tuple | Tuple / Projection |
| ------: | --------------- | ---------: | -----------: | -----------------: |
|       2 | create.sequence |    636,052 |      574,370 |              0.90× |
|       2 | replace.random  |    932,928 |    1,415,439 |              1.52× |
|       2 | apply.replace   |    581,495 |      864,794 |              1.49× |
|       2 | value.random    | 30,938,120 |   50,327,760 |              1.63× |
|       4 | create.sequence |    569,071 |      554,927 |              0.98× |
|       4 | replace.random  |    867,998 |    1,534,922 |              1.77× |
|       4 | apply.replace   |    565,872 |      954,786 |              1.69× |
|       4 | value.random    | 22,611,489 |   49,458,335 |              2.19× |
|       8 | create.sequence |    391,043 |      432,983 |              1.11× |
|       8 | replace.random  |    818,760 |    1,537,788 |              1.88× |
|       8 | apply.replace   |    552,256 |      965,143 |              1.75× |
|       8 | value.random    | 18,238,256 |   54,958,359 |              3.01× |
|     100 | create.sequence |     71,539 |       83,188 |              1.16× |
|     100 | replace.random  |    858,686 |    1,517,657 |              1.77× |
|     100 | apply.replace   |    569,486 |      951,118 |              1.67× |
|     100 | value.random    | 11,606,001 |   44,696,018 |              3.85× |

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

2026-11-20T20:13:10.487Z · local run

3 runs; median throughput in ops/s. Sizes are UTF-16 code units.

| Operation            | 1,024 array | 1,024 string | 65,536 array | 65,536 string | 1,048,576 array | 1,048,576 string |
| -------------------- | ----------: | -----------: | -----------: | ------------: | --------------: | ---------------: |
| insert               |     509,294 |    2,551,151 |        3,780 |     2,686,871 |             299 |        2,432,376 |
| insert.append        |      59,305 |      256,471 |          884 |        60,882 |              38 |            1,727 |
| replace              |     150,492 |      671,255 |        1,495 |       645,395 |             112 |          573,617 |
| remove               |     238,214 |      865,825 |        2,428 |       897,390 |             179 |          984,994 |
| remove.middle        |     476,761 |      977,239 |        3,862 |       944,737 |             393 |          932,127 |
| replace.middle       |     409,647 |      709,473 |        4,138 |       748,764 |             373 |          793,230 |
| apply                |   1,302,281 |    1,304,023 |      938,793 |     1,412,438 |         962,180 |        1,455,398 |
| apply.array          |   1,736,329 |      426,014 |    1,577,903 |         4,030 |       1,783,700 |              286 |
| concurrent.apply     |      15,780 |      280,128 |          225 |         6,909 |              15 |              782 |
| merge                |     330,623 |      867,778 |        4,004 |       864,235 |             302 |          910,586 |
| create               |     305,973 |      868,579 |        3,943 |       909,454 |             297 |          916,300 |
| value.random         |  19,542,859 |   19,108,655 |   20,163,992 |    21,262,734 |      19,187,820 |       22,148,397 |
| values.range         |   7,874,983 |    5,724,893 |    6,855,338 |     6,313,528 |       6,454,936 |        6,161,078 |
| values.array         |     750,181 |      508,910 |        4,499 |         3,905 |             395 |              289 |
| values.text          |      73,761 |   14,602,008 |        1,211 |    14,442,877 |              78 |       15,327,907 |
| sequence.array       |     688,301 |      454,378 |        4,740 |         3,972 |             425 |              302 |
| sequence.text        |     106,026 |    5,025,207 |        1,591 |     4,681,411 |              17 |        5,306,688 |
| sequence.edited.text |      68,773 |      396,224 |        1,101 |         9,808 |              20 |              572 |
| sequence.masked.text |      90,538 |      245,148 |        1,434 |       255,897 |              19 |          269,964 |

Encoded snapshots use string Footage in both representations.

#### Memory and encoded size

| UTF-16 code units | Representation | Estimated MiB | Snapshot MessagePack KiB | Snapshot gzip KiB | Gossip MessagePack KiB | Gossip gzip KiB |
| ----------------: | -------------- | ------------: | -----------------------: | ----------------: | ---------------------: | --------------: |
|              1024 | array          |        0.0082 |                     1.02 |              0.04 |                   2.02 |            0.05 |
|              1024 | string         |        0.0023 |                     1.02 |              0.05 |                   1.02 |            0.05 |
|             65536 | array          |        0.5004 |                    64.02 |              0.12 |                 128.02 |            0.18 |
|             65536 | string         |        0.1254 |                    64.02 |              0.12 |                  64.02 |            0.12 |
|           1048576 | array          |        8.0004 |                  1024.02 |              1.05 |                2048.02 |            2.05 |
|           1048576 | string         |        2.0004 |                  1024.02 |              1.05 |                1024.02 |            1.05 |

Measured on Node 24.16.0, V8 13.6.233.17-node.49, win32 x64, Intel(R) Core(TM) i5-10210U CPU @ 1.60GHz. Splitting and text assembly are included where required; peer preparation, encoding and explicit JS process garbage collection are outside API timings.

[Full text results](benchmark/.results/text.md).

<!-- END GENERATED:text:benchmarks -->

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

2026-11-20T20:04:49.752Z · local run

The latest verification passed 303 Vitest tests and 120 compatibility checks.
The configured 100% coverage threshold is met (100% statements, 100% branches, 100% functions, 100% lines).
See the [test suites](test/README.md) and
[automated test report](https://sovereignbase.dev/sequencer/tests/).

### Works everywhere where JavaScript and Wasm works

2026-11-20T20:04:58.019Z · local run

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
