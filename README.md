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
| apply.random   |                       293,967 |                        195,518 |                         181,928 |                         173,731 |                           161,700 |                           154,340 |
| insert.head    |                     2,439,858 |                      1,690,475 |                       1,912,632 |                       2,071,213 |                         2,011,277 |                         2,065,346 |
| insert.random  |                       923,193 |                        566,205 |                         456,927 |                         407,792 |                           357,793 |                           330,347 |
| insert.tail    |                     2,493,274 |                      1,946,070 |                       2,124,776 |                       2,076,433 |                         1,885,168 |                         1,857,430 |
| remove.head    |                             — |                              — |                               — |                               — |                                 — |                                 — |
| remove.random  |                       634,908 |                        343,852 |                         271,690 |                         238,038 |                           210,815 |                           193,162 |
| remove.tail    |                             — |                              — |                               — |                               — |                                 — |                                 — |
| replace.head   |                       807,383 |                        768,131 |                         795,645 |                         721,193 |                           736,979 |                           720,336 |
| replace.random |                       492,583 |                        261,557 |                         207,919 |                         190,792 |                           175,825 |                           165,732 |
| replace.tail   |                       712,937 |                        714,180 |                         777,484 |                         793,293 |                           789,149 |                           795,798 |
| value.head     |                     5,222,115 |                      6,828,259 |                       7,116,583 |                       7,304,801 |                         7,340,240 |                         7,361,315 |
| value.random   |                     1,271,324 |                        524,104 |                         363,157 |                         298,806 |                           255,574 |                           228,268 |
| value.tail     |                     9,208,116 |                      9,410,236 |                       9,466,269 |                       9,667,364 |                         9,796,364 |                         9,702,427 |

**↓ Scale down (25,000 → 0 Strips)**

| Method / case  | 20,000 Strips<br>1,012,742 Frames | 15,000 Strips<br>755,860 Frames | 10,000 Strips<br>504,103 Frames | 5,000 Strips<br>251,203 Frames | 1,000 Strips<br>51,057 Frames | 0 Strips<br>0 Frames |
| -------------- | --------------------------------: | ------------------------------: | ------------------------------: | -----------------------------: | ----------------------------: | -------------------: |
| apply.random   |                           151,447 |                         159,331 |                         169,824 |                        175,852 |                       185,655 |              190,029 |
| insert.head    |                                 — |                               — |                               — |                              — |                             — |                    — |
| insert.random  |                           423,623 |                         451,153 |                         482,638 |                        504,159 |                       534,407 |              547,916 |
| insert.tail    |                                 — |                               — |                               — |                              — |                             — |                    — |
| remove.head    |                         1,069,630 |                       1,124,537 |                       1,099,253 |                      1,125,843 |                     1,155,965 |            1,163,695 |
| remove.random  |                           309,203 |                         294,356 |                         314,693 |                        304,017 |                       324,284 |              332,640 |
| remove.tail    |                         1,085,631 |                       1,081,420 |                       1,062,739 |                      1,064,625 |                     1,081,608 |            1,089,446 |
| replace.head   |                           713,117 |                         731,465 |                         739,915 |                        716,192 |                       722,546 |              727,562 |
| replace.random |                           254,831 |                         253,121 |                         264,984 |                        268,572 |                       285,116 |              291,924 |
| replace.tail   |                           339,249 |                          62,540 |                          58,656 |                         70,116 |                        79,002 |               81,740 |
| value.head     |                         4,037,564 |                       4,106,793 |                       4,107,523 |                      4,075,528 |                     4,132,078 |            4,163,632 |
| value.random   |                           435,630 |                         456,359 |                         486,992 |                        503,724 |                       531,877 |              547,570 |
| value.tail     |                         5,815,275 |                       5,811,832 |                       5,709,232 |                      5,528,250 |                     5,673,907 |            5,768,944 |

### API throughput at checkpoint

Checkpoint calls, in ops/s, averaged across runs.

**↑ Scale up (0 → 25,000 Strips)**

| Method                            | 1,000 Strips<br>50,871 Frames | 5,000 Strips<br>252,214 Frames | 10,000 Strips<br>504,871 Frames | 15,000 Strips<br>758,280 Frames | 20,000 Strips<br>1,010,749 Frames | 25,000 Strips<br>1,264,003 Frames |
| --------------------------------- | ----------------------------: | -----------------------------: | ------------------------------: | ------------------------------: | --------------------------------: | --------------------------------: |
| new Projection(actorID, sequence) |                         5,964 |                          1,639 |                             925 |                             604 |                               400 |                               324 |
| sequence()                        |                           586 |                            136 |                              77 |                              53 |                                41 |                                32 |
| values()                          |                         1,319 |                            344 |                             135 |                              95 |                                91 |                                76 |

**↓ Scale down (25,000 → 0 Strips)**

| Method                            | 20,000 Strips<br>1,012,742 Frames | 15,000 Strips<br>755,860 Frames | 10,000 Strips<br>504,103 Frames | 5,000 Strips<br>251,203 Frames | 1,000 Strips<br>51,057 Frames | 0 Strips<br>0 Frames |
| --------------------------------- | --------------------------------: | ------------------------------: | ------------------------------: | -----------------------------: | ----------------------------: | -------------------: |
| new Projection(actorID, sequence) |                               387 |                             589 |                             864 |                          1,816 |                         7,660 |               30,243 |
| sequence()                        |                                46 |                              54 |                              73 |                             98 |                           195 |                  693 |
| values()                          |                                85 |                             131 |                             184 |                            303 |                         1,720 |               93,204 |

### Sequence disk size at checkpoint

Complete exported Sequences, including Footage and acknowledgements. Sizes are in KiB.

**↑ Scale up (0 → 25,000 Strips)**

| Encoding           | 1,000 Strips<br>50,871 Frames | 5,000 Strips<br>252,214 Frames | 10,000 Strips<br>504,871 Frames | 15,000 Strips<br>758,280 Frames | 20,000 Strips<br>1,010,749 Frames | 25,000 Strips<br>1,264,003 Frames |
| ------------------ | ----------------------------: | -----------------------------: | ------------------------------: | ------------------------------: | --------------------------------: | --------------------------------: |
| JSON               |                        277.53 |                       1,620.42 |                        3,265.67 |                        4,932.53 |                          7,109.32 |                          9,267.67 |
| JSON + gzip        |                         14.59 |                          73.41 |                          148.95 |                          225.90 |                            310.70 |                            392.56 |
| MessagePack        |                        164.81 |                         818.92 |                        1,646.03 |                        3,553.60 |                          5,126.26 |                          6,551.31 |
| MessagePack + gzip |                         12.38 |                          61.63 |                          124.81 |                          200.05 |                            263.44 |                            335.05 |

**↓ Scale down (25,000 → 0 Strips)**

| Encoding           | 20,000 Strips<br>1,012,742 Frames | 15,000 Strips<br>755,860 Frames | 10,000 Strips<br>504,103 Frames | 5,000 Strips<br>251,203 Frames | 1,000 Strips<br>51,057 Frames | 0 Strips<br>0 Frames |
| ------------------ | --------------------------------: | ------------------------------: | ------------------------------: | -----------------------------: | ----------------------------: | -------------------: |
| JSON               |                          7,574.01 |                        5,702.43 |                        3,809.67 |                       1,889.05 |                        381.23 |                 0.02 |
| JSON + gzip        |                            326.40 |                          246.95 |                          164.77 |                          79.64 |                         15.97 |                 0.03 |
| MessagePack        |                          5,314.83 |                        3,986.78 |                        2,658.67 |                       1,319.82 |                        266.79 |                 0.01 |
| MessagePack + gzip |                            278.06 |                          209.72 |                          139.94 |                          67.74 |                         13.66 |                 0.03 |

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
linux x64, AMD EPYC 9V45 96-Core Processor.
Peer synchronization, encoding and JS process garbage collection are outside API timings.
[Full lifecycle results](benchmark/.results/lifecycle.md) · [Throughput results](benchmark/.results/throughput.md).

### Tuple mode

Arithmetic means of 3 runs. Ordinary Projection versus a static tuple with maxLength. Both contain the same values; replacements preserve the field count.

#### Throughput (ops/s)

| Indices | Method / case   | Projection | Static tuple | Tuple / Projection |
| ------: | --------------- | ---------: | -----------: | -----------------: |
|       2 | create.sequence |  1,034,777 |      942,194 |              0.91× |
|       2 | replace.random  |  1,342,796 |    2,464,250 |              1.84× |
|       2 | apply.replace   |    939,828 |    1,342,049 |              1.43× |
|       2 | value.random    | 52,531,115 |  107,034,213 |              2.04× |
|       4 | create.sequence |    808,967 |      845,087 |              1.04× |
|       4 | replace.random  |  1,315,320 |    2,384,826 |              1.81× |
|       4 | apply.replace   |    685,554 |    1,389,832 |              2.03× |
|       4 | value.random    | 39,011,507 |  102,813,179 |              2.64× |
|       8 | create.sequence |    631,012 |      723,831 |              1.15× |
|       8 | replace.random  |  1,312,218 |    2,482,251 |              1.89× |
|       8 | apply.replace   |    653,852 |    1,281,210 |              1.96× |
|       8 | value.random    | 29,609,387 |  106,896,482 |              3.61× |
|     100 | create.sequence |    121,809 |      151,506 |              1.24× |
|     100 | replace.random  |  1,121,205 |    2,544,838 |              2.27× |
|     100 | apply.replace   |    555,843 |    1,327,691 |              2.39× |
|     100 | value.random    | 12,917,939 |  105,872,242 |              8.20× |

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
