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
| ESM      |    158.25 |         128.81 |                 45.84 |
| CommonJS |    158.39 |         129.85 |                 45.92 |

Both bundles include WASM. Terser uses three compression passes; gzip uses level 9.

### Average throughput during editing to checkpoint

Arithmetic means of 3 runs, in ops/s, from each phase's start to checkpoint.
Strips contain 1–100 Frames (visible entries). Headers show Strip counts and mean Frame counts.

**↑ Scale up (0 → 25,000 Strips)**

| Method / case  | 1,000 Strips<br>50,871 Frames | 5,000 Strips<br>252,214 Frames | 10,000 Strips<br>504,871 Frames | 15,000 Strips<br>758,280 Frames | 20,000 Strips<br>1,010,749 Frames | 25,000 Strips<br>1,264,003 Frames |
| -------------- | ----------------------------: | -----------------------------: | ------------------------------: | ------------------------------: | --------------------------------: | --------------------------------: |
| apply.random   |                       296,685 |                        200,809 |                         184,718 |                         181,239 |                           177,850 |                           172,557 |
| insert.head    |                     2,464,097 |                      1,789,511 |                       2,006,994 |                       2,252,964 |                         2,257,306 |                         2,334,272 |
| insert.random  |                       959,929 |                        594,791 |                         475,834 |                         429,377 |                           379,001 |                           351,721 |
| insert.tail    |                     2,529,605 |                      2,074,433 |                       1,645,843 |                       1,717,554 |                         1,813,317 |                         1,808,196 |
| remove.head    |                             — |                              — |                               — |                               — |                                 — |                                 — |
| remove.random  |                       649,034 |                        359,223 |                         266,186 |                         239,342 |                           214,041 |                           197,660 |
| remove.tail    |                             — |                              — |                               — |                               — |                                 — |                                 — |
| replace.head   |                       836,298 |                        749,173 |                         786,941 |                         837,900 |                           854,875 |                           827,208 |
| replace.random |                       514,238 |                        315,826 |                         251,660 |                         219,280 |                           196,107 |                           182,433 |
| replace.tail   |                       624,149 |                        697,256 |                         785,969 |                         833,513 |                           841,972 |                           859,598 |
| value.head     |                     5,572,227 |                      6,425,877 |                       6,810,017 |                       7,248,049 |                         7,381,978 |                         7,413,683 |
| value.random   |                     1,380,981 |                        546,721 |                         374,800 |                         308,787 |                           264,720 |                           237,331 |
| value.tail     |                     9,718,874 |                      9,989,203 |                      10,143,889 |                      10,403,879 |                        10,448,984 |                        10,493,061 |

**↓ Scale down (25,000 → 0 Strips)**

| Method / case  | 20,000 Strips<br>1,012,742 Frames | 15,000 Strips<br>755,860 Frames | 10,000 Strips<br>504,103 Frames | 5,000 Strips<br>251,203 Frames | 1,000 Strips<br>51,057 Frames | 0 Strips<br>0 Frames |
| -------------- | --------------------------------: | ------------------------------: | ------------------------------: | -----------------------------: | ----------------------------: | -------------------: |
| apply.random   |                           187,110 |                         195,410 |                         198,990 |                        208,155 |                       218,329 |              223,180 |
| insert.head    |                                 — |                               — |                               — |                              — |                             — |                    — |
| insert.random  |                           537,041 |                         575,653 |                         597,841 |                        624,899 |                       654,008 |              668,364 |
| insert.tail    |                                 — |                               — |                               — |                              — |                             — |                    — |
| remove.head    |                         1,138,049 |                       1,208,826 |                       1,163,976 |                      1,209,905 |                     1,240,864 |            1,247,274 |
| remove.random  |                           357,100 |                         355,502 |                         373,069 |                        378,411 |                       397,817 |              407,065 |
| remove.tail    |                         1,143,794 |                       1,176,375 |                       1,171,001 |                      1,186,632 |                     1,072,597 |            1,082,044 |
| replace.head   |                           791,946 |                         789,893 |                         796,627 |                        800,008 |                       768,473 |              773,412 |
| replace.random |                           328,602 |                         337,496 |                         348,562 |                        358,642 |                       373,540 |              380,833 |
| replace.tail   |                           237,146 |                          56,756 |                          60,398 |                         73,221 |                        79,790 |               82,562 |
| value.head     |                         4,366,176 |                       4,545,257 |                       4,666,256 |                      4,768,963 |                     4,823,217 |            4,886,636 |
| value.random   |                           554,237 |                         581,355 |                         600,199 |                        622,574 |                       652,122 |              670,627 |
| value.tail     |                         6,400,734 |                       6,307,256 |                       6,231,354 |                      6,218,332 |                     6,344,293 |            6,440,655 |

### API throughput at checkpoint

Checkpoint calls, in ops/s, averaged across runs.

**↑ Scale up (0 → 25,000 Strips)**

| Method                            | 1,000 Strips<br>50,871 Frames | 5,000 Strips<br>252,214 Frames | 10,000 Strips<br>504,871 Frames | 15,000 Strips<br>758,280 Frames | 20,000 Strips<br>1,010,749 Frames | 25,000 Strips<br>1,264,003 Frames |
| --------------------------------- | ----------------------------: | -----------------------------: | ------------------------------: | ------------------------------: | --------------------------------: | --------------------------------: |
| new Projection(actorID, sequence) |                         6,046 |                          1,882 |                             934 |                             628 |                               422 |                               333 |
| sequence()                        |                           742 |                            156 |                              82 |                              64 |                                45 |                                35 |
| values()                          |                           904 |                            355 |                             142 |                              66 |                                93 |                                39 |

**↓ Scale down (25,000 → 0 Strips)**

| Method                            | 20,000 Strips<br>1,012,742 Frames | 15,000 Strips<br>755,860 Frames | 10,000 Strips<br>504,103 Frames | 5,000 Strips<br>251,203 Frames | 1,000 Strips<br>51,057 Frames | 0 Strips<br>0 Frames |
| --------------------------------- | --------------------------------: | ------------------------------: | ------------------------------: | -----------------------------: | ----------------------------: | -------------------: |
| new Projection(actorID, sequence) |                               400 |                             582 |                             891 |                          1,855 |                         7,422 |               43,023 |
| sequence()                        |                                49 |                              58 |                              75 |                            113 |                           186 |                  893 |
| values()                          |                               102 |                              65 |                             161 |                            188 |                           768 |              122,325 |

### Sequence disk size at checkpoint

Complete exported Sequences, including Footage and acknowledgements. Sizes are in KiB.

**↑ Scale up (0 → 25,000 Strips)**

| Encoding           | 1,000 Strips<br>50,871 Frames | 5,000 Strips<br>252,214 Frames | 10,000 Strips<br>504,871 Frames | 15,000 Strips<br>758,280 Frames | 20,000 Strips<br>1,010,749 Frames | 25,000 Strips<br>1,264,003 Frames |
| ------------------ | ----------------------------: | -----------------------------: | ------------------------------: | ------------------------------: | --------------------------------: | --------------------------------: |
| JSON               |                        277.64 |                       1,619.95 |                        3,261.78 |                        4,930.17 |                          7,107.64 |                          9,264.46 |
| JSON + gzip        |                         14.59 |                          73.45 |                          148.90 |                          226.09 |                            310.89 |                            392.56 |
| MessagePack        |                        164.81 |                         818.92 |                        1,645.04 |                        3,553.07 |                          5,126.00 |                          6,551.17 |
| MessagePack + gzip |                         12.39 |                          61.63 |                          124.79 |                          200.07 |                            263.49 |                            335.09 |

**↓ Scale down (25,000 → 0 Strips)**

| Encoding           | 20,000 Strips<br>1,012,742 Frames | 15,000 Strips<br>755,860 Frames | 10,000 Strips<br>504,103 Frames | 5,000 Strips<br>251,203 Frames | 1,000 Strips<br>51,057 Frames | 0 Strips<br>0 Frames |
| ------------------ | --------------------------------: | ------------------------------: | ------------------------------: | -----------------------------: | ----------------------------: | -------------------: |
| JSON               |                          7,574.62 |                        5,707.11 |                        3,810.18 |                       1,888.38 |                        381.08 |                 0.02 |
| JSON + gzip        |                            326.62 |                          247.18 |                          164.68 |                          79.63 |                         15.97 |                 0.03 |
| MessagePack        |                          5,314.75 |                        3,986.74 |                        2,658.65 |                       1,319.82 |                        266.79 |                 0.01 |
| MessagePack + gzip |                            278.15 |                          209.80 |                          139.97 |                          67.74 |                         13.65 |                 0.03 |

### Memory usage at checkpoint

One instance after checkpoint compaction and recreation: live native allocation plus retained JS array slots, in KiB (1,024 bytes). Unused WASM capacity is excluded.

**↑ Scale up (0 → 25,000 Strips)**

| Measurement            | 1,000 Strips<br>50,871 Frames | 5,000 Strips<br>252,214 Frames | 10,000 Strips<br>504,871 Frames | 15,000 Strips<br>758,280 Frames | 20,000 Strips<br>1,010,749 Frames | 25,000 Strips<br>1,264,003 Frames |
| ---------------------- | ----------------------------: | -----------------------------: | ------------------------------: | ------------------------------: | --------------------------------: | --------------------------------: |
| Estimated memory (KiB) |                        915.04 |                       4,318.67 |                        7,912.60 |                       11,368.22 |                         15,034.19 |                         18,460.98 |

**↓ Scale down (25,000 → 0 Strips)**

| Measurement            | 20,000 Strips<br>1,012,742 Frames | 15,000 Strips<br>755,860 Frames | 10,000 Strips<br>504,103 Frames | 5,000 Strips<br>251,203 Frames | 1,000 Strips<br>51,057 Frames | 0 Strips<br>0 Frames |
| ---------------------- | --------------------------------: | ------------------------------: | ------------------------------: | -----------------------------: | ----------------------------: | -------------------: |
| Estimated memory (KiB) |                         15,322.58 |                       12,255.98 |                        9,031.64 |                       5,894.00 |                      3,102.37 |             1,560.48 |

Measured on Node 24.22.2, V8 13.6.233.17-node.63,
linux x64, AMD EPYC 9V45 96-Core Processor.
Peer synchronization, encoding and JS process garbage collection are outside API timings.
[Full lifecycle results](benchmark/.results/lifecycle.md) · [Throughput results](benchmark/.results/throughput.md).

### Tuple mode

Arithmetic means of 3 runs. Ordinary Projection versus a static tuple with maxLength. Both contain the same values; replacements preserve the field count.

#### Throughput (ops/s)

| Indices | Method / case   | Projection | Static tuple | Tuple / Projection |
| ------: | --------------- | ---------: | -----------: | -----------------: |
|       2 | create.sequence |  1,006,568 |      895,755 |              0.89× |
|       2 | replace.random  |  1,254,976 |    2,275,597 |              1.81× |
|       2 | apply.replace   |    843,986 |    1,247,814 |              1.48× |
|       2 | value.random    | 46,184,264 |   80,447,809 |              1.74× |
|       4 | create.sequence |    776,727 |      854,875 |              1.10× |
|       4 | replace.random  |  1,192,077 |    2,039,668 |              1.71× |
|       4 | apply.replace   |    577,922 |    1,190,332 |              2.06× |
|       4 | value.random    | 35,991,470 |   76,772,014 |              2.13× |
|       8 | create.sequence |    614,406 |      727,145 |              1.18× |
|       8 | replace.random  |  1,229,542 |    2,289,466 |              1.86× |
|       8 | apply.replace   |    595,387 |    1,204,565 |              2.02× |
|       8 | value.random    | 28,619,826 |   78,211,445 |              2.73× |
|     100 | create.sequence |    122,035 |      172,455 |              1.41× |
|     100 | replace.random  |  1,107,440 |    2,356,048 |              2.13× |
|     100 | apply.replace   |    527,412 |    1,284,259 |              2.44× |
|     100 | value.random    | 13,095,932 |   76,888,720 |              5.87× |

#### Space (KiB)

| Indices | Mode         | Estimated allocated memory | MessagePack | MessagePack + gzip |
| ------: | ------------ | -------------------------: | ----------: | -----------------: |
|       2 | Projection   |                       0.86 |        0.03 |               0.04 |
|       2 | Static tuple |                       0.85 |        0.04 |               0.05 |
|       4 | Projection   |                       1.54 |        0.06 |               0.05 |
|       4 | Static tuple |                       1.04 |        0.06 |               0.07 |
|       8 | Projection   |                       2.49 |        0.12 |               0.08 |
|       8 | Static tuple |                       1.51 |        0.10 |               0.09 |
|     100 | Projection   |                      23.75 |        0.67 |               0.57 |
|     100 | Static tuple |                      12.18 |        0.51 |               0.35 |

Measured on Node 24.22.2, V8 13.6.233.17-node.63, linux x64, AMD EPYC 9V45 96-Core Processor. Fixtures are hydrated compacted snapshots after one replacement per field. Each case warms up for ≥25 ms and measures ≥50 ms of API time; mutation bursts restart after 4,096 replacements. Peer authoring, encoding, result checks, destruction and explicit JS process garbage collection are outside API timings. Memory estimates are the increase in live native allocator bytes plus retained JS array slots for one instance, including exercised runtime buffers. Unused WASM capacity, JS object headers and referenced payload objects are excluded.

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
