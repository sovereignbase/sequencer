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
| apply.random   |                       217,011 |                        157,139 |                         141,585 |                         135,346 |                           130,764 |                           125,581 |
| insert.head    |                     1,655,945 |                      1,638,027 |                       1,755,968 |                       1,846,393 |                         1,823,499 |                         1,847,910 |
| insert.random  |                       643,541 |                        445,667 |                         317,994 |                         290,689 |                           263,659 |                           248,858 |
| insert.tail    |                     1,852,155 |                      2,032,487 |                       2,085,743 |                       1,931,084 |                         1,938,720 |                         1,848,035 |
| remove.head    |                             — |                              — |                               — |                               — |                                 — |                                 — |
| remove.random  |                       443,948 |                        268,590 |                         206,067 |                         180,767 |                           162,617 |                           150,458 |
| remove.tail    |                             — |                              — |                               — |                               — |                                 — |                                 — |
| replace.head   |                       615,114 |                        567,561 |                         547,186 |                         578,737 |                           602,838 |                           588,590 |
| replace.random |                       368,699 |                        243,907 |                         189,707 |                         166,862 |                           150,246 |                           140,120 |
| replace.tail   |                       576,711 |                        555,431 |                         609,330 |                         641,514 |                           647,560 |                           666,064 |
| value.head     |                     3,308,412 |                      4,305,350 |                       4,609,457 |                       4,913,058 |                         5,017,144 |                         5,067,994 |
| value.random   |                       905,526 |                        394,404 |                         268,252 |                         222,953 |                           194,581 |                           176,051 |
| value.tail     |                     5,710,879 |                      6,033,748 |                       6,156,380 |                       6,358,370 |                         6,455,281 |                         6,457,180 |

**↓ Scale down (25,000 → 0 Strips)**

| Method / case  | 20,000 Strips<br>1,012,742 Frames | 15,000 Strips<br>755,860 Frames | 10,000 Strips<br>504,103 Frames | 5,000 Strips<br>251,203 Frames | 1,000 Strips<br>51,057 Frames | 0 Strips<br>0 Frames |
| -------------- | --------------------------------: | ------------------------------: | ------------------------------: | -----------------------------: | ----------------------------: | -------------------: |
| apply.random   |                           122,422 |                         130,434 |                         134,462 |                        139,717 |                       146,788 |              150,159 |
| insert.head    |                                 — |                               — |                               — |                              — |                             — |                    — |
| insert.random  |                           333,507 |                         342,386 |                         350,348 |                        364,532 |                       383,714 |              393,122 |
| insert.tail    |                                 — |                               — |                               — |                              — |                             — |                    — |
| remove.head    |                           842,205 |                         863,611 |                         811,528 |                        832,737 |                       846,807 |              853,232 |
| remove.random  |                           234,131 |                         252,866 |                         255,232 |                        263,022 |                       276,058 |              282,516 |
| remove.tail    |                           682,081 |                         750,923 |                         760,117 |                        774,205 |                       795,076 |              802,426 |
| replace.head   |                           595,508 |                         510,164 |                         494,746 |                        511,809 |                       525,052 |              530,775 |
| replace.random |                           246,468 |                         245,935 |                         251,941 |                        256,922 |                       267,117 |              272,651 |
| replace.tail   |                           237,918 |                         147,955 |                          49,016 |                         47,757 |                        53,056 |               54,912 |
| value.head     |                         2,813,813 |                       3,052,566 |                       3,039,984 |                      3,079,927 |                     3,151,856 |            3,170,159 |
| value.random   |                           381,715 |                         399,068 |                         404,145 |                        414,314 |                       434,035 |              446,291 |
| value.tail     |                         4,550,159 |                       4,688,583 |                       4,603,805 |                      4,607,044 |                     4,669,846 |            4,725,732 |

### API throughput at checkpoint

Checkpoint calls, in ops/s, averaged across runs.

**↑ Scale up (0 → 25,000 Strips)**

| Method                            | 1,000 Strips<br>50,871 Frames | 5,000 Strips<br>252,214 Frames | 10,000 Strips<br>504,871 Frames | 15,000 Strips<br>758,280 Frames | 20,000 Strips<br>1,010,749 Frames | 25,000 Strips<br>1,264,003 Frames |
| --------------------------------- | ----------------------------: | -----------------------------: | ------------------------------: | ------------------------------: | --------------------------------: | --------------------------------: |
| new Projection(actorID, sequence) |                         7,389 |                          1,574 |                             837 |                             525 |                               347 |                               264 |
| sequence()                        |                           742 |                            157 |                              92 |                              75 |                                49 |                                45 |
| values()                          |                         1,166 |                            377 |                             148 |                             103 |                               101 |                                86 |

**↓ Scale down (25,000 → 0 Strips)**

| Method                            | 20,000 Strips<br>1,012,742 Frames | 15,000 Strips<br>755,860 Frames | 10,000 Strips<br>504,103 Frames | 5,000 Strips<br>251,203 Frames | 1,000 Strips<br>51,057 Frames | 0 Strips<br>0 Frames |
| --------------------------------- | --------------------------------: | ------------------------------: | ------------------------------: | -----------------------------: | ----------------------------: | -------------------: |
| new Projection(actorID, sequence) |                               364 |                             496 |                             793 |                          1,695 |                         7,605 |               68,855 |
| sequence()                        |                                57 |                              68 |                              84 |                            115 |                           203 |                  816 |
| values()                          |                               106 |                             140 |                             192 |                            387 |                         1,706 |              243,045 |

### Sequence disk size at checkpoint

Complete exported Sequences, including Footage and acknowledgements. Sizes are in KiB.

**↑ Scale up (0 → 25,000 Strips)**

| Encoding           | 1,000 Strips<br>50,871 Frames | 5,000 Strips<br>252,214 Frames | 10,000 Strips<br>504,871 Frames | 15,000 Strips<br>758,280 Frames | 20,000 Strips<br>1,010,749 Frames | 25,000 Strips<br>1,264,003 Frames |
| ------------------ | ----------------------------: | -----------------------------: | ------------------------------: | ------------------------------: | --------------------------------: | --------------------------------: |
| JSON               |                        277.41 |                       1,621.53 |                        3,265.19 |                        4,931.58 |                          7,105.60 |                          9,261.72 |
| JSON + gzip        |                         14.59 |                          73.44 |                          148.94 |                          226.02 |                            310.82 |                            392.32 |
| MessagePack        |                        164.81 |                         818.92 |                        1,646.03 |                        3,553.60 |                          5,126.26 |                          6,551.31 |
| MessagePack + gzip |                         12.38 |                          61.63 |                          124.81 |                          200.05 |                            263.43 |                            335.05 |

**↓ Scale down (25,000 → 0 Strips)**

| Encoding           | 20,000 Strips<br>1,012,742 Frames | 15,000 Strips<br>755,860 Frames | 10,000 Strips<br>504,103 Frames | 5,000 Strips<br>251,203 Frames | 1,000 Strips<br>51,057 Frames | 0 Strips<br>0 Frames |
| ------------------ | --------------------------------: | ------------------------------: | ------------------------------: | -----------------------------: | ----------------------------: | -------------------: |
| JSON               |                          7,567.69 |                        5,701.91 |                        3,810.88 |                       1,887.32 |                        381.06 |                 0.02 |
| JSON + gzip        |                            326.10 |                          247.15 |                          164.74 |                          79.61 |                         15.97 |                 0.03 |
| MessagePack        |                          5,314.83 |                        3,986.78 |                        2,658.67 |                       1,319.82 |                        266.79 |                 0.01 |
| MessagePack + gzip |                            278.11 |                          209.79 |                          139.97 |                          67.72 |                         13.66 |                 0.03 |

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
linux x64, INTEL(R) XEON(R) PLATINUM 8573C.
Peer synchronization, encoding and JS process garbage collection are outside API timings.
[Full lifecycle results](benchmark/.results/lifecycle.md) · [Throughput results](benchmark/.results/throughput.md).

### Tuple mode

Arithmetic means of 3 runs. Ordinary Projection versus a static tuple with maxLength. Both contain the same values; replacements preserve the field count.

#### Throughput (ops/s)

| Indices | Method / case   | Projection | Static tuple | Tuple / Projection |
| ------: | --------------- | ---------: | -----------: | -----------------: |
|       2 | create.sequence |  1,122,688 |      995,790 |              0.89× |
|       2 | replace.random  |  1,201,274 |    2,239,174 |              1.86× |
|       2 | apply.replace   |    921,822 |    1,319,621 |              1.43× |
|       2 | value.random    | 39,592,762 |   80,551,220 |              2.03× |
|       4 | create.sequence |    819,669 |      879,791 |              1.07× |
|       4 | replace.random  |  1,207,656 |    2,176,940 |              1.80× |
|       4 | apply.replace   |    624,304 |    1,356,845 |              2.17× |
|       4 | value.random    | 26,916,859 |   80,252,404 |              2.98× |
|       8 | create.sequence |    548,986 |      633,154 |              1.15× |
|       8 | replace.random  |  1,194,586 |    2,192,955 |              1.84× |
|       8 | apply.replace   |    573,861 |    1,404,000 |              2.45× |
|       8 | value.random    | 22,867,689 |   77,838,808 |              3.40× |
|     100 | create.sequence |    104,336 |      131,404 |              1.26× |
|     100 | replace.random  |    918,069 |    2,163,259 |              2.36× |
|     100 | apply.replace   |    504,204 |    1,423,843 |              2.82× |
|     100 | value.random    |  9,480,388 |   78,348,968 |              8.26× |

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

Measured on Node 24.22.2, V8 13.6.233.17-node.63, linux x64, INTEL(R) XEON(R) PLATINUM 8573C. Fixtures are hydrated compacted snapshots after one replacement per field. Each case warms up for ≥25 ms and measures ≥50 ms of API time; mutation bursts restart after 4,096 replacements. Peer authoring, encoding, result checks, destruction and explicit JS process garbage collection are outside API timings. Memory estimates are the increase in live native allocator bytes plus retained JS array slots for one instance, including exercised runtime buffers. Unused WASM capacity, JS object headers and referenced payload objects are excluded.

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
