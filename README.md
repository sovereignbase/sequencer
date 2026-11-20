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

2026-11-20T20:37:15.352Z · [CI run](https://github.com/sovereignbase/sequencer/actions/runs/44812418849)

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
| apply.random   |                       457,365 |                        448,894 |                         443,178 |                         447,536 |                           445,639 |                           422,168 |
| insert.head    |                     1,792,894 |                      1,603,682 |                       1,764,347 |                       1,850,007 |                         1,819,281 |                         1,831,464 |
| insert.random  |                     1,026,991 |                      1,028,842 |                         971,794 |                         980,500 |                           942,179 |                           924,380 |
| insert.tail    |                     1,977,826 |                      2,153,623 |                       1,757,078 |                       1,700,979 |                         1,742,488 |                         1,698,800 |
| remove.head    |                             — |                              — |                               — |                               — |                                 — |                                 — |
| remove.random  |                       723,888 |                        569,333 |                         585,530 |                         595,071 |                           573,515 |                           573,515 |
| remove.tail    |                             — |                              — |                               — |                               — |                                 — |                                 — |
| replace.head   |                       585,631 |                        659,867 |                         688,599 |                         695,413 |                           707,428 |                           683,542 |
| replace.random |                       536,636 |                        453,822 |                         451,996 |                         449,807 |                           450,769 |                           448,907 |
| replace.tail   |                       524,826 |                        612,008 |                         607,200 |                         636,026 |                           648,191 |                           662,144 |
| value.head     |                     4,403,829 |                      5,524,051 |                       5,870,418 |                       6,267,665 |                         6,531,219 |                         6,666,624 |
| value.random   |                     2,478,137 |                      1,787,743 |                       1,599,795 |                       1,525,883 |                         1,482,470 |                         1,434,045 |
| value.tail     |                     7,609,491 |                      9,127,252 |                       9,524,358 |                      10,178,298 |                        10,541,437 |                        10,786,019 |

**↓ Scale down (25,000 → 0 Strips)**

| Method / case  | 20,000 Strips<br>1,012,742 Frames | 15,000 Strips<br>755,860 Frames | 10,000 Strips<br>504,103 Frames | 5,000 Strips<br>251,203 Frames | 1,000 Strips<br>51,057 Frames | 0 Strips<br>0 Frames |
| -------------- | --------------------------------: | ------------------------------: | ------------------------------: | -----------------------------: | ----------------------------: | -------------------: |
| apply.random   |                           421,326 |                         424,865 |                         417,596 |                        427,192 |                       440,464 |              444,401 |
| insert.head    |                                 — |                               — |                               — |                              — |                             — |                    — |
| insert.random  |                           743,275 |                         796,597 |                         833,736 |                        862,861 |                       896,588 |              910,006 |
| insert.tail    |                                 — |                               — |                               — |                              — |                             — |                    — |
| remove.head    |                           898,809 |                         936,472 |                         896,724 |                        913,163 |                       931,062 |              935,645 |
| remove.random  |                           558,424 |                         584,848 |                         595,673 |                        578,179 |                       599,893 |              608,836 |
| remove.tail    |                           984,700 |                       1,014,795 |                       1,016,362 |                      1,019,928 |                       912,800 |              917,236 |
| replace.head   |                           609,413 |                         602,448 |                         611,822 |                        608,192 |                       617,300 |              623,326 |
| replace.random |                           427,985 |                         400,594 |                         424,318 |                        415,301 |                       436,072 |              443,464 |
| replace.tail   |                            49,636 |                          67,029 |                          70,423 |                         79,546 |                        91,078 |               94,368 |
| value.head     |                         3,873,278 |                       4,111,634 |                       4,151,449 |                      4,199,626 |                     4,270,705 |            4,300,823 |
| value.random   |                         1,212,110 |                       1,252,220 |                       1,290,056 |                      1,321,429 |                     1,377,092 |            1,406,565 |
| value.tail     |                         6,642,354 |                       6,595,005 |                       6,426,947 |                      6,356,689 |                     6,526,666 |            6,606,173 |

#### API throughput at checkpoint

Checkpoint calls, in ops/s, averaged across runs.

**↑ Scale up (0 → 25,000 Strips)**

| Method                            | 1,000 Strips<br>50,871 Frames | 5,000 Strips<br>252,214 Frames | 10,000 Strips<br>504,871 Frames | 15,000 Strips<br>758,280 Frames | 20,000 Strips<br>1,010,749 Frames | 25,000 Strips<br>1,264,003 Frames |
| --------------------------------- | ----------------------------: | -----------------------------: | ------------------------------: | ------------------------------: | --------------------------------: | --------------------------------: |
| new Projection(actorID, sequence) |                         7,433 |                          1,830 |                             884 |                             586 |                               419 |                               355 |
| sequence()                        |                           706 |                            167 |                              97 |                              77 |                                51 |                                44 |
| values()                          |                         1,347 |                            409 |                             189 |                             130 |                               102 |                                71 |

**↓ Scale down (25,000 → 0 Strips)**

| Method                            | 20,000 Strips<br>1,012,742 Frames | 15,000 Strips<br>755,860 Frames | 10,000 Strips<br>504,103 Frames | 5,000 Strips<br>251,203 Frames | 1,000 Strips<br>51,057 Frames | 0 Strips<br>0 Frames |
| --------------------------------- | --------------------------------: | ------------------------------: | ------------------------------: | -----------------------------: | ----------------------------: | -------------------: |
| new Projection(actorID, sequence) |                               415 |                             576 |                             882 |                          1,839 |                         6,665 |               65,870 |
| sequence()                        |                                61 |                              74 |                              92 |                            120 |                           180 |                  839 |
| values()                          |                               107 |                             140 |                             206 |                            427 |                         1,762 |              182,942 |

#### Sequence disk size at checkpoint

Complete exported Sequences, including Footage and acknowledgements. Sizes are in KiB.

**↑ Scale up (0 → 25,000 Strips)**

| Encoding           | 1,000 Strips<br>50,871 Frames | 5,000 Strips<br>252,214 Frames | 10,000 Strips<br>504,871 Frames | 15,000 Strips<br>758,280 Frames | 20,000 Strips<br>1,010,749 Frames | 25,000 Strips<br>1,264,003 Frames |
| ------------------ | ----------------------------: | -----------------------------: | ------------------------------: | ------------------------------: | --------------------------------: | --------------------------------: |
| JSON               |                        277.30 |                       1,621.53 |                        3,266.29 |                        4,934.35 |                          7,108.15 |                          9,262.52 |
| JSON + gzip        |                         14.60 |                          73.42 |                          148.97 |                          226.03 |                            310.87 |                            392.47 |
| MessagePack        |                        164.81 |                         818.92 |                        1,646.03 |                        3,553.60 |                          5,126.26 |                          6,551.31 |
| MessagePack + gzip |                         12.38 |                          61.62 |                          124.81 |                          200.05 |                            263.43 |                            335.00 |

**↓ Scale down (25,000 → 0 Strips)**

| Encoding           | 20,000 Strips<br>1,012,742 Frames | 15,000 Strips<br>755,860 Frames | 10,000 Strips<br>504,103 Frames | 5,000 Strips<br>251,203 Frames | 1,000 Strips<br>51,057 Frames | 0 Strips<br>0 Frames |
| ------------------ | --------------------------------: | ------------------------------: | ------------------------------: | -----------------------------: | ----------------------------: | -------------------: |
| JSON               |                          7,572.23 |                        5,701.32 |                        3,810.91 |                       1,889.33 |                        381.07 |                 0.02 |
| JSON + gzip        |                            326.53 |                          247.23 |                          164.94 |                          79.60 |                         15.97 |                 0.03 |
| MessagePack        |                          5,314.83 |                        3,983.52 |                        2,657.04 |                       1,319.71 |                        266.79 |                 0.01 |
| MessagePack + gzip |                            278.06 |                          209.79 |                          140.03 |                          67.73 |                         13.65 |                 0.03 |

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
linux x64, AMD EPYC 9V74 80-Core Processor.
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

2026-11-20T20:39:46.144Z · [CI run](https://github.com/sovereignbase/sequencer/actions/runs/44812418849)

3 runs; median throughput in ops/s. Sizes are UTF-16 code units.

| Operation            | 1,024 array | 1,024 string | 65,536 array | 65,536 string | 1,048,576 array | 1,048,576 string |
| -------------------- | ----------: | -----------: | -----------: | ------------: | --------------: | ---------------: |
| insert               |     788,157 |    3,048,857 |        4,097 |     3,288,676 |             251 |        2,722,743 |
| insert.append        |      80,170 |      451,038 |          962 |       116,969 |              43 |            2,195 |
| replace              |     266,473 |      863,226 |        1,502 |       918,188 |             108 |          830,270 |
| remove               |     417,967 |    1,340,947 |        2,758 |     1,341,179 |             198 |        1,178,168 |
| remove.middle        |     675,570 |    1,348,359 |        3,414 |     1,407,417 |             257 |        1,278,923 |
| replace.middle       |     608,169 |    1,002,698 |        3,392 |     1,025,210 |             252 |          952,765 |
| apply                |   1,355,200 |    1,608,333 |    1,266,634 |     1,629,399 |       1,212,875 |        1,480,018 |
| apply.array          |   2,235,554 |      662,951 |    2,086,796 |         4,337 |       1,972,842 |              276 |
| concurrent.apply     |      30,282 |      424,061 |          359 |         9,341 |              21 |              546 |
| merge                |     521,872 |    1,165,509 |        3,791 |     1,145,166 |             257 |        1,101,898 |
| create               |     506,809 |    1,163,044 |        4,331 |     1,138,558 |             260 |        1,155,775 |
| value.random         |  31,798,704 |   27,781,181 |   32,122,790 |    23,590,393 |      34,527,122 |       27,293,742 |
| values.range         |  12,541,129 |   10,618,668 |   12,012,952 |     7,513,519 |      13,923,288 |       10,321,357 |
| values.array         |   1,290,257 |    1,038,709 |        4,396 |         4,318 |             257 |              251 |
| values.text          |     143,109 |   20,025,940 |        1,723 |    22,660,805 |             105 |       19,871,485 |
| sequence.array       |   1,046,248 |      811,387 |        4,434 |         4,348 |             249 |              251 |
| sequence.text        |     192,651 |    8,236,594 |        3,038 |     8,317,998 |              32 |        9,298,580 |
| sequence.edited.text |     123,472 |      628,505 |        2,102 |        16,282 |              27 |            1,021 |
| sequence.masked.text |     155,364 |      384,646 |        2,941 |       418,020 |              31 |          424,167 |

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

Measured on Node 24.22.3, V8 13.6.233.17-node.63, linux x64, AMD EPYC 9V74 80-Core Processor. Splitting and text assembly are included where required; peer preparation, encoding and explicit JS process garbage collection are outside API timings.

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

2026-11-20T20:36:57.354Z · [CI run](https://github.com/sovereignbase/sequencer/actions/runs/44812418849)

The latest verification passed 303 Vitest tests and 135 compatibility checks.
The configured 100% coverage threshold is met (100% statements, 100% branches, 100% functions, 100% lines).
See the [test suites](test/README.md) and
[automated test report](https://sovereignbase.dev/sequencer/tests/).

### Works everywhere where JavaScript and Wasm works

2026-11-20T20:36:57.357Z · [CI run](https://github.com/sovereignbase/sequencer/actions/runs/44812418849)

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
