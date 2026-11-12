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
| ESM      |    147.67 |         120.33 |                 43.22 |
| CommonJS |    147.82 |         121.60 |                 43.37 |

Both bundles include WASM. Terser uses three compression passes; gzip uses level 9.

### Average throughput during editing to checkpoint

Arithmetic means of 3 runs, in ops/s, from each phase's start to checkpoint.
Strips contain 1–100 Frames (visible entries). Headers show Strip counts and mean Frame counts.

**↑ Scale up (0 → 25,000 Strips)**

| Method / case  | 1,000 Strips<br>50,871 Frames | 5,000 Strips<br>252,214 Frames | 10,000 Strips<br>504,871 Frames | 15,000 Strips<br>758,280 Frames | 20,000 Strips<br>1,010,749 Frames | 25,000 Strips<br>1,264,003 Frames |
| -------------- | ----------------------------: | -----------------------------: | ------------------------------: | ------------------------------: | --------------------------------: | --------------------------------: |
| apply.random   |                       186,313 |                        122,937 |                         112,631 |                         106,293 |                           101,803 |                            97,340 |
| insert.head    |                     1,305,620 |                      1,233,830 |                       1,017,851 |                       1,124,299 |                         1,162,106 |                           992,404 |
| insert.random  |                       503,466 |                        337,618 |                         265,144 |                         232,717 |                           207,836 |                           193,960 |
| insert.tail    |                     1,486,581 |                      1,543,640 |                       1,571,576 |                       1,466,751 |                         1,466,216 |                         1,397,003 |
| remove.head    |                             — |                              — |                               — |                               — |                                 — |                                 — |
| remove.random  |                       356,459 |                        204,947 |                         156,574 |                         133,513 |                           119,891 |                           111,199 |
| remove.tail    |                             — |                              — |                               — |                               — |                                 — |                                 — |
| replace.head   |                       484,212 |                        439,695 |                         435,067 |                         434,454 |                           456,767 |                           453,104 |
| replace.random |                       311,183 |                        189,189 |                         146,344 |                         127,266 |                           114,033 |                           106,227 |
| replace.tail   |                       484,233 |                        448,472 |                         509,159 |                         532,459 |                           535,445 |                           543,676 |
| value.head     |                     2,939,184 |                      3,148,297 |                       3,330,450 |                       3,529,632 |                         3,646,231 |                         3,727,183 |
| value.random   |                       747,319 |                        297,603 |                         204,440 |                         168,534 |                           147,519 |                           134,178 |
| value.tail     |                     5,369,876 |                      5,090,694 |                       4,890,345 |                       4,933,021 |                         4,952,248 |                         4,927,459 |

**↓ Scale down (25,000 → 0 Strips)**

| Method / case  | 20,000 Strips<br>1,012,742 Frames | 15,000 Strips<br>755,860 Frames | 10,000 Strips<br>504,103 Frames | 5,000 Strips<br>251,203 Frames | 1,000 Strips<br>51,057 Frames | 0 Strips<br>0 Frames |
| -------------- | --------------------------------: | ------------------------------: | ------------------------------: | -----------------------------: | ----------------------------: | -------------------: |
| apply.random   |                           100,752 |                         104,676 |                         108,394 |                        114,001 |                       119,840 |              122,589 |
| insert.head    |                                 — |                               — |                               — |                              — |                             — |                    — |
| insert.random  |                           286,513 |                         272,164 |                         288,548 |                        300,067 |                       318,832 |              327,181 |
| insert.tail    |                                 — |                               — |                               — |                              — |                             — |                    — |
| remove.head    |                           760,052 |                         775,553 |                         741,448 |                        761,188 |                       773,208 |              777,026 |
| remove.random  |                           203,877 |                         217,671 |                         221,587 |                        232,029 |                       237,602 |              242,926 |
| remove.tail    |                           645,744 |                         700,512 |                         705,767 |                        726,140 |                       740,317 |              744,915 |
| replace.head   |                           525,282 |                         504,512 |                         452,984 |                        467,240 |                       475,941 |              480,534 |
| replace.random |                           198,518 |                         200,283 |                         207,500 |                        214,501 |                       222,586 |              227,229 |
| replace.tail   |                            80,273 |                         117,724 |                          40,417 |                         44,134 |                        47,788 |               49,418 |
| value.head     |                         2,548,584 |                       2,661,279 |                       2,676,666 |                      2,716,479 |                     2,738,955 |            2,745,051 |
| value.random   |                           296,609 |                         311,876 |                         320,128 |                        335,903 |                       352,502 |              362,361 |
| value.tail     |                         4,232,836 |                       4,238,773 |                       4,191,992 |                      4,172,898 |                     4,233,301 |            4,279,231 |

### API throughput at checkpoint

Checkpoint calls, in ops/s, averaged across runs.

**↑ Scale up (0 → 25,000 Strips)**

| Method                            | 1,000 Strips<br>50,871 Frames | 5,000 Strips<br>252,214 Frames | 10,000 Strips<br>504,871 Frames | 15,000 Strips<br>758,280 Frames | 20,000 Strips<br>1,010,749 Frames | 25,000 Strips<br>1,264,003 Frames |
| --------------------------------- | ----------------------------: | -----------------------------: | ------------------------------: | ------------------------------: | --------------------------------: | --------------------------------: |
| new Projection(actorID, sequence) |                         5,037 |                          1,281 |                             723 |                             487 |                               334 |                               280 |
| sequence()                        |                           471 |                            131 |                              78 |                              61 |                                43 |                                38 |
| values()                          |                           943 |                            281 |                             121 |                              85 |                                84 |                                71 |

**↓ Scale down (25,000 → 0 Strips)**

| Method                            | 20,000 Strips<br>1,012,742 Frames | 15,000 Strips<br>755,860 Frames | 10,000 Strips<br>504,103 Frames | 5,000 Strips<br>251,203 Frames | 1,000 Strips<br>51,057 Frames | 0 Strips<br>0 Frames |
| --------------------------------- | --------------------------------: | ------------------------------: | ------------------------------: | -----------------------------: | ----------------------------: | -------------------: |
| new Projection(actorID, sequence) |                               324 |                             460 |                             682 |                          1,438 |                         6,352 |               58,473 |
| sequence()                        |                                49 |                              60 |                              74 |                             95 |                           118 |                  610 |
| values()                          |                                84 |                             115 |                             158 |                            311 |                         1,130 |              159,036 |

### Sequence disk size at checkpoint

Complete exported Sequences, including Footage and acknowledgements. Sizes are in KiB.

**↑ Scale up (0 → 25,000 Strips)**

| Encoding           | 1,000 Strips<br>50,871 Frames | 5,000 Strips<br>252,214 Frames | 10,000 Strips<br>504,871 Frames | 15,000 Strips<br>758,280 Frames | 20,000 Strips<br>1,010,749 Frames | 25,000 Strips<br>1,264,003 Frames |
| ------------------ | ----------------------------: | -----------------------------: | ------------------------------: | ------------------------------: | --------------------------------: | --------------------------------: |
| JSON               |                        277.53 |                       1,620.40 |                        3,265.62 |                        4,928.02 |                          7,104.50 |                          9,261.02 |
| JSON + gzip        |                         14.60 |                          73.45 |                          148.96 |                          225.80 |                            310.84 |                            392.56 |
| MessagePack        |                        164.81 |                         818.92 |                        1,646.03 |                        3,553.60 |                          5,126.26 |                          6,551.31 |
| MessagePack + gzip |                         12.38 |                          61.63 |                          124.81 |                          200.05 |                            263.49 |                            335.10 |

**↓ Scale down (25,000 → 0 Strips)**

| Encoding           | 20,000 Strips<br>1,012,742 Frames | 15,000 Strips<br>755,860 Frames | 10,000 Strips<br>504,103 Frames | 5,000 Strips<br>251,203 Frames | 1,000 Strips<br>51,057 Frames | 0 Strips<br>0 Frames |
| ------------------ | --------------------------------: | ------------------------------: | ------------------------------: | -----------------------------: | ----------------------------: | -------------------: |
| JSON               |                          7,564.41 |                        5,696.94 |                        3,807.55 |                       1,886.00 |                        381.36 |                 0.02 |
| JSON + gzip        |                            326.30 |                          247.08 |                          164.78 |                          79.50 |                         15.97 |                 0.03 |
| MessagePack        |                          5,314.83 |                        3,986.78 |                        2,658.67 |                       1,318.44 |                        266.79 |                 0.01 |
| MessagePack + gzip |                            278.12 |                          209.81 |                          139.97 |                          67.76 |                         13.66 |                 0.03 |

### Memory usage at checkpoint

One instance after checkpoint compaction and recreation: live native allocation plus retained JS array slots, in KiB (1,024 bytes). Unused WASM capacity is excluded.

**↑ Scale up (0 → 25,000 Strips)**

| Measurement            | 1,000 Strips<br>50,871 Frames | 5,000 Strips<br>252,214 Frames | 10,000 Strips<br>504,871 Frames | 15,000 Strips<br>758,280 Frames | 20,000 Strips<br>1,010,749 Frames | 25,000 Strips<br>1,264,003 Frames |
| ---------------------- | ----------------------------: | -----------------------------: | ------------------------------: | ------------------------------: | --------------------------------: | --------------------------------: |
| Estimated memory (KiB) |                        903.21 |                       4,259.98 |                        7,795.30 |                       11,192.32 |                         14,799.69 |                         18,167.89 |

**↓ Scale down (25,000 → 0 Strips)**

| Measurement            | 20,000 Strips<br>1,012,742 Frames | 15,000 Strips<br>755,860 Frames | 10,000 Strips<br>504,103 Frames | 5,000 Strips<br>251,203 Frames | 1,000 Strips<br>51,057 Frames | 0 Strips<br>0 Frames |
| ---------------------- | --------------------------------: | ------------------------------: | ------------------------------: | -----------------------------: | ----------------------------: | -------------------: |
| Estimated memory (KiB) |                         15,088.08 |                       12,080.07 |                        8,914.32 |                       5,835.26 |                      3,090.50 |             1,560.35 |

Measured on Node 24.22.2, V8 13.6.233.17-node.63,
linux x64, AMD EPYC 7763 64-Core Processor.
Peer synchronization, encoding and JS process garbage collection are outside API timings.
[Full lifecycle results](benchmark/.results/lifecycle.md) · [Throughput results](benchmark/.results/throughput.md).

### Tuple mode

Arithmetic means of 3 runs. Ordinary Projection versus a static tuple with maxLength. Both contain the same values; replacements preserve the field count.

#### Throughput (ops/s)

| Indices | Method / case   | Projection | Static tuple | Tuple / Projection |
| ------: | --------------- | ---------: | -----------: | -----------------: |
|       2 | create.sequence |    816,712 |      730,409 |              0.89× |
|       2 | replace.random  |    856,269 |    1,664,292 |              1.94× |
|       2 | apply.replace   |    607,002 |    1,023,438 |              1.69× |
|       2 | value.random    | 34,919,983 |   61,101,568 |              1.75× |
|       4 | create.sequence |    602,058 |      650,219 |              1.08× |
|       4 | replace.random  |    910,721 |    1,673,871 |              1.84× |
|       4 | apply.replace   |    484,659 |    1,089,633 |              2.25× |
|       4 | value.random    | 26,979,838 |   61,731,540 |              2.29× |
|       8 | create.sequence |    446,165 |      519,604 |              1.16× |
|       8 | replace.random  |    923,100 |    1,570,220 |              1.70× |
|       8 | apply.replace   |    446,581 |    1,103,819 |              2.47× |
|       8 | value.random    | 20,878,901 |   61,047,654 |              2.92× |
|     100 | create.sequence |     83,844 |      104,172 |              1.24× |
|     100 | replace.random  |    806,085 |    1,704,822 |              2.11× |
|     100 | apply.replace   |    393,350 |    1,147,119 |              2.92× |
|     100 | value.random    |  9,737,357 |   62,874,809 |              6.46× |

#### Space (KiB)

| Indices | Mode         | Estimated allocated memory | MessagePack | MessagePack + gzip |
| ------: | ------------ | -------------------------: | ----------: | -----------------: |
|       2 | Projection   |                       0.80 |        0.03 |               0.04 |
|       2 | Static tuple |                       0.80 |        0.04 |               0.05 |
|       4 | Projection   |                       1.46 |        0.06 |               0.05 |
|       4 | Static tuple |                       0.98 |        0.06 |               0.07 |
|       8 | Projection   |                       2.37 |        0.12 |               0.08 |
|       8 | Static tuple |                       1.41 |        0.10 |               0.09 |
|     100 | Projection   |                      22.55 |        0.67 |               0.57 |
|     100 | Static tuple |                      11.37 |        0.51 |               0.35 |

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
