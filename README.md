[![npm version](https://img.shields.io/npm/v/@sovereignbase/sequencer)](https://www.npmjs.com/package/@sovereignbase/sequencer)
[![JSR](https://jsr.io/badges/@sovereignbase/sequencer)](https://jsr.io/@sovereignbase/sequencer)
[![CI](https://github.com/sovereignbase/sequencer/actions/workflows/ci.yaml/badge.svg?branch=master)](https://github.com/sovereignbase/sequencer/actions/workflows/ci.yaml)
[![codecov](https://codecov.io/gh/sovereignbase/sequencer/branch/master/graph/badge.svg)](https://codecov.io/gh/sovereignbase/sequencer)
[![license](https://img.shields.io/npm/l/@sovereignbase/sequencer)](https://github.com/sovereignbase/sequencer/blob/master/LICENSE)

# Sequencer

Sequencer provides a total order guarantee for distributed editing. It allows independently operating actors to make concurrent edits and eventually converge on the same state without relying on network arrival order or perfectly synchronized clocks.

## Usage

### Simple typed API

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

projectionA.apply(replaceAcknowledgement)

const removeDelta = projectionA.remove(0, 0)
console.log(projectionA.value(0)) // undefined

const removeAcknowledgement = projectionB.apply(removeDelta)
console.log(projectionB.value(0)) // undefined

projectionA.apply(removeAcknowledgement)

const serializable = projectionA.sequence()

const acknowledgements = projectionB.merge(serializable)
projectionA.apply(acknowledgements)

projectionA.destroy()
projectionB.destroy()
```

### Tuple mode

Each index represents an independent slot. Adding or removing values
never shifts other values. Empty slots return `undefined`.

Omit `maxLength` to allow dynamic growth.

```ts
const tuple = new Projection<string>(1, undefined, { enabled: 1, maxLength: 4 })
tuple.insert(['hello'], 2)
tuple.replace(['world'], 2, 2)
tuple.remove(2, 2)
```

### See documentation

- [How sequencer works?](INTERNALS.md)
- [Typescript](https://sovereignbase.dev/sequencer/classes/Projection.html)
- [C++](https://sovereignbase.dev/sequencer/c++)

### Errors

| Code                      | Meaning                                                             |
| ------------------------- | ------------------------------------------------------------------- |
| `PROJECTION_DESTROYED`    | An operation was called after the Projection was destroyed.         |
| `NATIVE_OPERATION_FAILED` | The native runtime reported an initialization or operation failure. |
| `STRING_ENCODING_FAILED`  | Snapshot Footage concatenation failed.                              |
| `UNKNOWN_ERROR`           | All other errors.                                                   |

Invalid input to `apply()` or `merge()` returns `undefined` instead of throwing.

## Benchmarks

### Moderate bundle size

| Format   | Raw (KiB) | Minified (KiB) | Minified + gzip (KiB) |
| -------- | --------: | -------------: | --------------------: |
| ESM      |    155.49 |         126.93 |                 44.88 |
| CommonJS |    155.63 |         128.07 |                 44.97 |

Both bundles include WASM. Terser uses three compression passes; gzip uses level 9.

### Average throughput during editing to checkpoint

Arithmetic means of 3 runs, in ops/s, from each phase's start to checkpoint.
Strips contain 1–100 Frames (visible entries). Headers show Strip counts and mean Frame counts.

**↑ Scale up (0 → 25,000 Strips)**

| Method / case  | 1,000 Strips<br>50,871 Frames | 5,000 Strips<br>252,214 Frames | 10,000 Strips<br>504,871 Frames | 15,000 Strips<br>758,280 Frames | 20,000 Strips<br>1,010,749 Frames | 25,000 Strips<br>1,264,003 Frames |
| -------------- | ----------------------------: | -----------------------------: | ------------------------------: | ------------------------------: | --------------------------------: | --------------------------------: |
| apply.random   |                       215,137 |                        155,480 |                         144,676 |                         138,885 |                           132,084 |                           127,076 |
| insert.head    |                     1,723,415 |                      1,282,928 |                       1,523,541 |                       1,679,042 |                         1,703,949 |                         1,758,709 |
| insert.random  |                       626,595 |                        422,210 |                         352,811 |                         318,126 |                           287,085 |                           269,018 |
| insert.tail    |                     1,901,628 |                      1,607,257 |                       1,806,438 |                       1,789,484 |                         1,827,612 |                         1,765,531 |
| remove.head    |                             — |                              — |                               — |                               — |                                 — |                                 — |
| remove.random  |                       467,741 |                        228,970 |                         199,012 |                         179,288 |                           163,209 |                           152,377 |
| remove.tail    |                             — |                              — |                               — |                               — |                                 — |                                 — |
| replace.head   |                       617,128 |                        622,656 |                         653,192 |                         660,977 |                           666,775 |                           613,655 |
| replace.random |                       368,499 |                        242,816 |                         195,371 |                         172,027 |                           155,557 |                           143,422 |
| replace.tail   |                       524,137 |                        563,453 |                         632,850 |                         656,240 |                           662,147 |                           674,638 |
| value.head     |                     3,641,763 |                      4,847,385 |                       5,164,832 |                       5,411,530 |                         5,506,529 |                         5,537,109 |
| value.random   |                       943,287 |                        414,499 |                         286,725 |                         235,773 |                           206,367 |                           186,952 |
| value.tail     |                     5,296,508 |                      6,894,288 |                       7,074,341 |                       7,244,187 |                         7,186,331 |                         7,234,858 |

**↓ Scale down (25,000 → 0 Strips)**

| Method / case  | 20,000 Strips<br>1,012,742 Frames | 15,000 Strips<br>755,860 Frames | 10,000 Strips<br>504,103 Frames | 5,000 Strips<br>251,203 Frames | 1,000 Strips<br>51,057 Frames | 0 Strips<br>0 Frames |
| -------------- | --------------------------------: | ------------------------------: | ------------------------------: | -----------------------------: | ----------------------------: | -------------------: |
| apply.random   |                           138,213 |                         140,539 |                         145,220 |                        151,708 |                       158,973 |              162,508 |
| insert.head    |                                 — |                               — |                               — |                              — |                             — |                    — |
| insert.random  |                           412,447 |                         426,420 |                         436,827 |                        457,640 |                       479,773 |              490,960 |
| insert.tail    |                                 — |                               — |                               — |                              — |                             — |                    — |
| remove.head    |                           971,057 |                         791,700 |                         790,460 |                        841,692 |                       874,858 |              882,400 |
| remove.random  |                           292,507 |                         294,750 |                         289,414 |                        303,961 |                       311,386 |              318,375 |
| remove.tail    |                           702,612 |                         770,776 |                         782,452 |                        819,364 |                       797,161 |              804,277 |
| replace.head   |                           655,456 |                         644,545 |                         613,358 |                        621,501 |                       628,745 |              633,529 |
| replace.random |                           263,395 |                         263,788 |                         271,434 |                        279,730 |                       291,297 |              296,915 |
| replace.tail   |                           457,106 |                          55,539 |                          53,101 |                         60,198 |                        68,024 |               70,444 |
| value.head     |                         3,862,548 |                       3,899,978 |                       3,881,505 |                      3,970,947 |                     4,033,342 |            4,053,426 |
| value.random   |                           426,452 |                         435,437 |                         446,474 |                        466,307 |                       489,899 |              503,640 |
| value.tail     |                         5,483,706 |                       5,410,490 |                       5,307,600 |                      5,305,504 |                     5,419,505 |            5,489,450 |

### API throughput at checkpoint

Checkpoint calls, in ops/s, averaged across runs.

**↑ Scale up (0 → 25,000 Strips)**

| Method                            | 1,000 Strips<br>50,871 Frames | 5,000 Strips<br>252,214 Frames | 10,000 Strips<br>504,871 Frames | 15,000 Strips<br>758,280 Frames | 20,000 Strips<br>1,010,749 Frames | 25,000 Strips<br>1,264,003 Frames |
| --------------------------------- | ----------------------------: | -----------------------------: | ------------------------------: | ------------------------------: | --------------------------------: | --------------------------------: |
| new Projection(actorID, sequence) |                         4,960 |                          1,317 |                             732 |                             486 |                               324 |                               271 |
| sequence()                        |                           604 |                            126 |                              74 |                              53 |                                39 |                                30 |
| values()                          |                         1,252 |                            367 |                             147 |                              98 |                                93 |                                79 |

**↓ Scale down (25,000 → 0 Strips)**

| Method                            | 20,000 Strips<br>1,012,742 Frames | 15,000 Strips<br>755,860 Frames | 10,000 Strips<br>504,103 Frames | 5,000 Strips<br>251,203 Frames | 1,000 Strips<br>51,057 Frames | 0 Strips<br>0 Frames |
| --------------------------------- | --------------------------------: | ------------------------------: | ------------------------------: | -----------------------------: | ----------------------------: | -------------------: |
| new Projection(actorID, sequence) |                               316 |                             459 |                             680 |                          1,476 |                         7,173 |               54,268 |
| sequence()                        |                                42 |                              50 |                              69 |                            102 |                           179 |                  709 |
| values()                          |                                99 |                             132 |                             189 |                            374 |                         1,710 |              119,818 |

### Sequence disk size at checkpoint

Complete exported Sequences, including Footage and acknowledgements. Sizes are in KiB.

**↑ Scale up (0 → 25,000 Strips)**

| Encoding           | 1,000 Strips<br>50,871 Frames | 5,000 Strips<br>252,214 Frames | 10,000 Strips<br>504,871 Frames | 15,000 Strips<br>758,280 Frames | 20,000 Strips<br>1,010,749 Frames | 25,000 Strips<br>1,264,003 Frames |
| ------------------ | ----------------------------: | -----------------------------: | ------------------------------: | ------------------------------: | --------------------------------: | --------------------------------: |
| JSON               |                        277.41 |                       1,618.83 |                        3,262.24 |                        4,929.24 |                          7,106.75 |                          9,260.37 |
| JSON + gzip        |                         14.59 |                          73.39 |                          148.91 |                          225.94 |                            310.76 |                            392.42 |
| MessagePack        |                        164.81 |                         817.84 |                        1,645.78 |                        3,553.50 |                          5,126.22 |                          6,551.29 |
| MessagePack + gzip |                         12.38 |                          61.62 |                          124.84 |                          200.06 |                            263.47 |                            335.10 |

**↓ Scale down (25,000 → 0 Strips)**

| Encoding           | 20,000 Strips<br>1,012,742 Frames | 15,000 Strips<br>755,860 Frames | 10,000 Strips<br>504,103 Frames | 5,000 Strips<br>251,203 Frames | 1,000 Strips<br>51,057 Frames | 0 Strips<br>0 Frames |
| ------------------ | --------------------------------: | ------------------------------: | ------------------------------: | -----------------------------: | ----------------------------: | -------------------: |
| JSON               |                          7,564.86 |                        5,699.82 |                        3,811.09 |                       1,888.70 |                        381.08 |                 0.02 |
| JSON + gzip        |                            326.24 |                          247.20 |                          164.89 |                          79.63 |                         15.97 |                 0.03 |
| MessagePack        |                          5,314.83 |                        3,986.78 |                        2,658.67 |                       1,319.82 |                        266.79 |                 0.01 |
| MessagePack + gzip |                            278.14 |                          209.81 |                          139.97 |                          67.74 |                         13.65 |                 0.03 |

### Memory usage at checkpoint

One instance after checkpoint compaction and recreation: live native allocation plus retained JS array slots, in KiB (1,024 bytes). Unused WASM capacity is excluded.

**↑ Scale up (0 → 25,000 Strips)**

| Measurement            | 1,000 Strips<br>50,871 Frames | 5,000 Strips<br>252,214 Frames | 10,000 Strips<br>504,871 Frames | 15,000 Strips<br>758,280 Frames | 20,000 Strips<br>1,010,749 Frames | 25,000 Strips<br>1,264,003 Frames |
| ---------------------- | ----------------------------: | -----------------------------: | ------------------------------: | ------------------------------: | --------------------------------: | --------------------------------: |
| Estimated memory (KiB) |                        911.13 |                       4,299.13 |                        7,873.50 |                       11,309.59 |                         14,956.04 |                         18,363.29 |

**↓ Scale down (25,000 → 0 Strips)**

| Measurement            | 20,000 Strips<br>1,012,742 Frames | 15,000 Strips<br>755,860 Frames | 10,000 Strips<br>504,103 Frames | 5,000 Strips<br>251,203 Frames | 1,000 Strips<br>51,057 Frames | 0 Strips<br>0 Frames |
| ---------------------- | --------------------------------: | ------------------------------: | ------------------------------: | -----------------------------: | ----------------------------: | -------------------: |
| Estimated memory (KiB) |                         15,244.41 |                       12,197.34 |                        8,992.53 |                       5,874.41 |                      3,098.40 |             1,560.42 |

Measured on Node 24.22.2, V8 13.6.233.17-node.63,
linux x64, AMD EPYC 9V74 80-Core Processor.
Peer synchronization, encoding and JS process garbage collection are outside API timings.
[Full lifecycle results](benchmark/.results/lifecycle.md) · [Throughput results](benchmark/.results/throughput.md).

### Tuple mode

Arithmetic means of 3 runs. Ordinary Projection versus a static tuple with maxLength. Both contain the same values; replacements preserve the field count.

#### Throughput (ops/s)

| Indices | Method / case   | Projection | Static tuple | Tuple / Projection |
| ------: | --------------- | ---------: | -----------: | -----------------: |
|       2 | create.sequence |    833,115 |      728,739 |              0.87× |
|       2 | replace.random  |  1,007,276 |    1,541,315 |              1.53× |
|       2 | apply.replace   |    725,842 |      941,281 |              1.30× |
|       2 | value.random    | 42,168,976 |   75,752,142 |              1.80× |
|       4 | create.sequence |    640,112 |      670,344 |              1.05× |
|       4 | replace.random  |  1,019,018 |    1,630,451 |              1.60× |
|       4 | apply.replace   |    552,925 |    1,017,676 |              1.84× |
|       4 | value.random    | 32,450,853 |   77,008,706 |              2.37× |
|       8 | create.sequence |    476,754 |      550,834 |              1.16× |
|       8 | replace.random  |  1,029,086 |    1,724,635 |              1.68× |
|       8 | apply.replace   |    515,766 |    1,029,664 |              2.00× |
|       8 | value.random    | 25,605,553 |   76,437,508 |              2.99× |
|     100 | create.sequence |     88,657 |      122,782 |              1.38× |
|     100 | replace.random  |    896,178 |    1,808,913 |              2.02× |
|     100 | apply.replace   |    417,774 |    1,089,658 |              2.61× |
|     100 | value.random    | 11,824,378 |   77,704,289 |              6.57× |

#### Space (KiB)

| Indices | Mode         | Estimated allocated memory | MessagePack | MessagePack + gzip |
| ------: | ------------ | -------------------------: | ----------: | -----------------: |
|       2 | Projection   |                       0.84 |        0.03 |               0.04 |
|       2 | Static tuple |                       0.84 |        0.04 |               0.05 |
|       4 | Projection   |                       1.51 |        0.06 |               0.05 |
|       4 | Static tuple |                       1.02 |        0.06 |               0.07 |
|       8 | Projection   |                       2.45 |        0.12 |               0.08 |
|       8 | Static tuple |                       1.49 |        0.10 |               0.09 |
|     100 | Projection   |                      23.34 |        0.67 |               0.57 |
|     100 | Static tuple |                      12.16 |        0.51 |               0.35 |

Measured on Node 24.22.2, V8 13.6.233.17-node.63, linux x64, AMD EPYC 9V74 80-Core Processor. Fixtures are hydrated compacted snapshots after one replacement per field. Each case warms up for ≥25 ms and measures ≥50 ms of API time; mutation bursts restart after 4,096 replacements. Peer authoring, encoding, result checks, destruction and explicit JS process garbage collection are outside API timings. Memory estimates are the increase in live native allocator bytes plus retained JS array slots for one instance, including exercised runtime buffers. Unused WASM capacity, JS object headers and referenced payload objects are excluded.

[Full tuple results](benchmark/.results/tuple.md).

## Tests

### Behaviour guaranteed by excessive tests

The latest verification passed 272 Vitest tests and 117 compatibility checks.
The configured 100% coverage threshold is met (100% statements, 100% branches, 100% functions, 100% lines).
See the [test suites](test/README.md) and
[automated test report](https://sovereignbase.dev/sequencer/tests/).

### Works everywhere where JavaScript and Wasm works

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

Apache-2.0
