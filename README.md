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
| ESM      |    147.79 |         120.39 |                 43.23 |
| CommonJS |    147.94 |         121.66 |                 43.38 |

Both bundles include WASM. Terser uses three compression passes; gzip uses level 9.

### Average throughput during editing to checkpoint

Arithmetic means of 3 runs, in ops/s, from each phase's start to checkpoint.
Strips contain 1–100 Frames (visible entries). Headers show Strip counts and mean Frame counts.

**↑ Scale up (0 → 25,000 Strips)**

| Method / case  | 1,000 Strips<br>50,871 Frames | 5,000 Strips<br>252,214 Frames | 10,000 Strips<br>504,871 Frames | 15,000 Strips<br>758,280 Frames | 20,000 Strips<br>1,010,749 Frames | 25,000 Strips<br>1,264,003 Frames |
| -------------- | ----------------------------: | -----------------------------: | ------------------------------: | ------------------------------: | --------------------------------: | --------------------------------: |
| apply.random   |                       187,102 |                        122,591 |                         111,303 |                         104,019 |                            99,961 |                            95,467 |
| insert.head    |                     1,406,115 |                      1,278,834 |                       1,351,657 |                       1,424,151 |                         1,400,121 |                         1,421,502 |
| insert.random  |                       483,203 |                        339,157 |                         262,590 |                         231,602 |                           206,433 |                           192,232 |
| insert.tail    |                     1,516,078 |                      1,551,746 |                       1,560,168 |                       1,456,159 |                         1,451,822 |                         1,387,445 |
| remove.head    |                             — |                              — |                               — |                               — |                                 — |                                 — |
| remove.random  |                       384,231 |                        207,851 |                         155,889 |                         132,152 |                           118,746 |                           109,828 |
| remove.tail    |                             — |                              — |                               — |                               — |                                 — |                                 — |
| replace.head   |                       489,825 |                        427,439 |                         461,165 |                         478,083 |                           456,769 |                           452,655 |
| replace.random |                       309,714 |                        189,437 |                         144,684 |                         125,577 |                           112,731 |                           104,830 |
| replace.tail   |                       459,515 |                        409,117 |                         468,314 |                         499,700 |                           506,777 |                           518,646 |
| value.head     |                     3,017,849 |                      3,394,236 |                       3,466,334 |                       3,680,415 |                         3,811,817 |                         3,862,864 |
| value.random   |                       727,043 |                        295,144 |                         201,992 |                         166,663 |                           146,104 |                           132,587 |
| value.tail     |                     4,804,567 |                      4,861,111 |                       4,760,129 |                       4,903,972 |                         4,961,719 |                         4,949,394 |

**↓ Scale down (25,000 → 0 Strips)**

| Method / case  | 20,000 Strips<br>1,012,742 Frames | 15,000 Strips<br>755,860 Frames | 10,000 Strips<br>504,103 Frames | 5,000 Strips<br>251,203 Frames | 1,000 Strips<br>51,057 Frames | 0 Strips<br>0 Frames |
| -------------- | --------------------------------: | ------------------------------: | ------------------------------: | -----------------------------: | ----------------------------: | -------------------: |
| apply.random   |                            94,494 |                          99,210 |                         104,707 |                        111,235 |                       117,848 |              120,774 |
| insert.head    |                                 — |                               — |                               — |                              — |                             — |                    — |
| insert.random  |                           260,694 |                         266,144 |                         286,976 |                        301,709 |                       321,934 |              330,150 |
| insert.tail    |                                 — |                               — |                               — |                              — |                             — |                    — |
| remove.head    |                           734,773 |                         750,274 |                         718,893 |                        744,560 |                       760,499 |              764,323 |
| remove.random  |                           183,651 |                         187,172 |                         202,000 |                        217,048 |                       229,291 |              234,665 |
| remove.tail    |                           549,790 |                         593,731 |                         640,721 |                        677,732 |                       698,200 |              703,903 |
| replace.head   |                           514,678 |                         495,725 |                         468,792 |                        479,615 |                       488,138 |              492,039 |
| replace.random |                           185,473 |                         189,758 |                         199,813 |                        209,180 |                       218,973 |              223,564 |
| replace.tail   |                            15,437 |                          18,136 |                          23,849 |                         30,049 |                        34,020 |               35,290 |
| value.head     |                         2,666,457 |                       2,736,507 |                       2,781,358 |                      2,851,823 |                     2,901,197 |            2,922,004 |
| value.random   |                           274,643 |                         289,431 |                         305,615 |                        324,921 |                       344,098 |              353,954 |
| value.tail     |                         4,133,367 |                       4,121,425 |                       4,097,481 |                      4,175,642 |                     4,260,027 |            4,297,996 |

### API throughput at checkpoint

Checkpoint calls, in ops/s, averaged across runs.

**↑ Scale up (0 → 25,000 Strips)**

| Method                            | 1,000 Strips<br>50,871 Frames | 5,000 Strips<br>252,214 Frames | 10,000 Strips<br>504,871 Frames | 15,000 Strips<br>758,280 Frames | 20,000 Strips<br>1,010,749 Frames | 25,000 Strips<br>1,264,003 Frames |
| --------------------------------- | ----------------------------: | -----------------------------: | ------------------------------: | ------------------------------: | --------------------------------: | --------------------------------: |
| new Projection(actorID, sequence) |                         5,922 |                          1,101 |                             640 |                             435 |                               325 |                               264 |
| sequence()                        |                           493 |                            121 |                              78 |                              64 |                                38 |                                39 |
| values()                          |                           992 |                            290 |                             126 |                              85 |                                81 |                                67 |

**↓ Scale down (25,000 → 0 Strips)**

| Method                            | 20,000 Strips<br>1,012,742 Frames | 15,000 Strips<br>755,860 Frames | 10,000 Strips<br>504,103 Frames | 5,000 Strips<br>251,203 Frames | 1,000 Strips<br>51,057 Frames | 0 Strips<br>0 Frames |
| --------------------------------- | --------------------------------: | ------------------------------: | ------------------------------: | -----------------------------: | ----------------------------: | -------------------: |
| new Projection(actorID, sequence) |                               293 |                             447 |                             613 |                          1,355 |                         6,087 |               60,983 |
| sequence()                        |                                47 |                              60 |                              74 |                             98 |                           143 |                  609 |
| values()                          |                                81 |                             116 |                             167 |                            326 |                         1,270 |              190,117 |

### Sequence disk size at checkpoint

Complete exported Sequences, including Footage and acknowledgements. Sizes are in KiB.

**↑ Scale up (0 → 25,000 Strips)**

| Encoding           | 1,000 Strips<br>50,871 Frames | 5,000 Strips<br>252,214 Frames | 10,000 Strips<br>504,871 Frames | 15,000 Strips<br>758,280 Frames | 20,000 Strips<br>1,010,749 Frames | 25,000 Strips<br>1,264,003 Frames |
| ------------------ | ----------------------------: | -----------------------------: | ------------------------------: | ------------------------------: | --------------------------------: | --------------------------------: |
| JSON               |                        277.41 |                       1,621.53 |                        3,266.33 |                        4,931.50 |                          7,105.23 |                          9,265.10 |
| JSON + gzip        |                         14.60 |                          73.42 |                          148.97 |                          226.02 |                            310.94 |                            392.77 |
| MessagePack        |                        164.81 |                         818.92 |                        1,646.03 |                        3,553.60 |                          5,126.26 |                          6,551.31 |
| MessagePack + gzip |                         12.38 |                          61.63 |                          124.81 |                          200.03 |                            263.46 |                            335.04 |

**↓ Scale down (25,000 → 0 Strips)**

| Encoding           | 20,000 Strips<br>1,012,742 Frames | 15,000 Strips<br>755,860 Frames | 10,000 Strips<br>504,103 Frames | 5,000 Strips<br>251,203 Frames | 1,000 Strips<br>51,057 Frames | 0 Strips<br>0 Frames |
| ------------------ | --------------------------------: | ------------------------------: | ------------------------------: | -----------------------------: | ----------------------------: | -------------------: |
| JSON               |                          7,572.03 |                        5,699.70 |                        3,810.05 |                       1,889.25 |                        381.08 |                 0.02 |
| JSON + gzip        |                            326.42 |                          246.88 |                          164.92 |                          79.61 |                         15.97 |                 0.03 |
| MessagePack        |                          5,314.83 |                        3,986.78 |                        2,658.67 |                       1,319.82 |                        266.79 |                 0.01 |
| MessagePack + gzip |                            278.08 |                          209.76 |                          139.97 |                          67.73 |                         13.66 |                 0.03 |

### Memory usage at checkpoint

One instance after checkpoint compaction and recreation: live native allocation plus retained JS array slots, in KiB (1,024 bytes). Unused WASM capacity is excluded.

**↑ Scale up (0 → 25,000 Strips)**

| Measurement            | 1,000 Strips<br>50,871 Frames | 5,000 Strips<br>252,214 Frames | 10,000 Strips<br>504,871 Frames | 15,000 Strips<br>758,280 Frames | 20,000 Strips<br>1,010,749 Frames | 25,000 Strips<br>1,264,003 Frames |
| ---------------------- | ----------------------------: | -----------------------------: | ------------------------------: | ------------------------------: | --------------------------------: | --------------------------------: |
| Estimated memory (KiB) |                        903.19 |                       4,259.97 |                        7,795.29 |                       11,192.31 |                         14,799.68 |                         18,167.88 |

**↓ Scale down (25,000 → 0 Strips)**

| Measurement            | 20,000 Strips<br>1,012,742 Frames | 15,000 Strips<br>755,860 Frames | 10,000 Strips<br>504,103 Frames | 5,000 Strips<br>251,203 Frames | 1,000 Strips<br>51,057 Frames | 0 Strips<br>0 Frames |
| ---------------------- | --------------------------------: | ------------------------------: | ------------------------------: | -----------------------------: | ----------------------------: | -------------------: |
| Estimated memory (KiB) |                         15,088.07 |                       12,080.06 |                        8,914.31 |                       5,835.25 |                      3,090.49 |             1,560.35 |

Measured on Node 24.22.2, V8 13.6.233.17-node.63,
linux x64, AMD EPYC 7763 64-Core Processor.
Peer synchronization, encoding and JS process garbage collection are outside API timings.
[Full lifecycle results](benchmark/.results/lifecycle.md) · [Throughput results](benchmark/.results/throughput.md).

### Tuple mode

Arithmetic means of 3 runs. Ordinary Projection versus a static tuple with maxLength. Both contain the same values; replacements preserve the field count.

#### Throughput (ops/s)

| Indices | Method / case   | Projection | Static tuple | Tuple / Projection |
| ------: | --------------- | ---------: | -----------: | -----------------: |
|       2 | create.sequence |    817,107 |      730,445 |              0.89× |
|       2 | replace.random  |    848,497 |    1,658,557 |              1.95× |
|       2 | apply.replace   |    603,558 |    1,033,421 |              1.71× |
|       2 | value.random    | 36,313,328 |   62,077,366 |              1.71× |
|       4 | create.sequence |    603,464 |      640,262 |              1.06× |
|       4 | replace.random  |    871,197 |    1,686,392 |              1.94× |
|       4 | apply.replace   |    478,987 |    1,099,985 |              2.30× |
|       4 | value.random    | 28,443,287 |   63,491,471 |              2.23× |
|       8 | create.sequence |    450,797 |      501,648 |              1.11× |
|       8 | replace.random  |    927,991 |    1,610,015 |              1.73× |
|       8 | apply.replace   |    445,201 |    1,022,159 |              2.30× |
|       8 | value.random    | 20,262,453 |   60,510,791 |              2.99× |
|     100 | create.sequence |     79,027 |       97,885 |              1.24× |
|     100 | replace.random  |    812,299 |    1,737,166 |              2.14× |
|     100 | apply.replace   |    387,844 |    1,090,112 |              2.81× |
|     100 | value.random    |  9,491,581 |   60,732,639 |              6.40× |

#### Space (KiB)

| Indices | Mode         | Estimated allocated memory | MessagePack | MessagePack + gzip |
| ------: | ------------ | -------------------------: | ----------: | -----------------: |
|       2 | Projection   |                       0.80 |        0.03 |               0.04 |
|       2 | Static tuple |                       0.79 |        0.04 |               0.05 |
|       4 | Projection   |                       1.45 |        0.06 |               0.05 |
|       4 | Static tuple |                       0.96 |        0.06 |               0.07 |
|       8 | Projection   |                       2.36 |        0.12 |               0.08 |
|       8 | Static tuple |                       1.40 |        0.10 |               0.09 |
|     100 | Projection   |                      22.54 |        0.67 |               0.57 |
|     100 | Static tuple |                      11.35 |        0.51 |               0.35 |

Measured on Node 24.22.2, V8 13.6.233.17-node.63, linux x64, AMD EPYC 7763 64-Core Processor. Fixtures are hydrated compacted snapshots after one replacement per field. Each case warms up for ≥25 ms and measures ≥50 ms of API time; mutation bursts restart after 4,096 replacements. Peer authoring, encoding, result checks, destruction and explicit JS process garbage collection are outside API timings. Memory estimates are the increase in live native allocator bytes plus retained JS array slots for one instance, including exercised runtime buffers. Unused WASM capacity, JS object headers and referenced payload objects are excluded.

[Full tuple results](benchmark/.results/tuple.md).

## Tests

### Behaviour guaranteed by excessive tests

The latest verification passed 276 Vitest tests and 126 compatibility checks.
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
