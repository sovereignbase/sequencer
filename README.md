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
| ESM      |    145.16 |         118.06 |                 42.90 |
| CommonJS |    145.31 |         119.32 |                 43.06 |

Both bundles include WASM. Terser uses three compression passes; gzip uses level 9.

### Average throughput during editing to checkpoint

Arithmetic means of 3 runs, in ops/s, from each phase's start to checkpoint.
Strips contain 1–100 Frames (visible entries). Headers show Strip counts and mean Frame counts.

**↑ Scale up (0 → 25,000 Strips)**

| Method / case  | 1,000 Strips<br>50,871 Frames | 5,000 Strips<br>252,214 Frames | 10,000 Strips<br>504,871 Frames | 15,000 Strips<br>758,280 Frames | 20,000 Strips<br>1,010,749 Frames | 25,000 Strips<br>1,264,003 Frames |
| -------------- | ----------------------------: | -----------------------------: | ------------------------------: | ------------------------------: | --------------------------------: | --------------------------------: |
| apply.random   |                       452,740 |                        408,311 |                         393,027 |                         393,250 |                           389,449 |                           383,321 |
| insert.head    |                     1,928,877 |                      1,651,777 |                       1,762,117 |                       1,864,292 |                         1,842,592 |                         1,858,958 |
| insert.random  |                       988,642 |                        911,371 |                         832,142 |                         827,984 |                           792,756 |                           752,857 |
| insert.tail    |                     2,081,973 |                      2,148,966 |                       2,097,119 |                       1,991,463 |                         1,988,870 |                         1,896,658 |
| remove.head    |                             — |                              — |                               — |                               — |                                 — |                                 — |
| remove.random  |                       654,484 |                        502,368 |                         490,340 |                         496,150 |                           498,224 |                           493,395 |
| remove.tail    |                             — |                              — |                               — |                               — |                                 — |                                 — |
| replace.head   |                       655,447 |                        653,965 |                         663,695 |                         669,537 |                           677,157 |                           652,868 |
| replace.random |                       465,950 |                        415,916 |                         404,293 |                         386,083 |                           388,266 |                           390,958 |
| replace.tail   |                       585,935 |                        636,155 |                         669,211 |                         683,165 |                           679,970 |                           652,945 |
| value.head     |                     4,618,126 |                      5,607,482 |                       6,021,907 |                       6,382,866 |                         6,561,522 |                         6,700,550 |
| value.random   |                     1,929,962 |                      1,238,145 |                       1,119,177 |                       1,074,298 |                         1,056,793 |                         1,046,363 |
| value.tail     |                     7,730,047 |                      8,596,622 |                       9,027,971 |                       9,553,621 |                         9,914,466 |                        10,151,977 |

**↓ Scale down (25,000 → 0 Strips)**

| Method / case  | 20,000 Strips<br>1,012,742 Frames | 15,000 Strips<br>755,860 Frames | 10,000 Strips<br>504,103 Frames | 5,000 Strips<br>251,203 Frames | 1,000 Strips<br>51,057 Frames | 0 Strips<br>0 Frames |
| -------------- | --------------------------------: | ------------------------------: | ------------------------------: | -----------------------------: | ----------------------------: | -------------------: |
| apply.random   |                           345,409 |                         356,538 |                         367,791 |                        376,946 |                       386,783 |              391,003 |
| insert.head    |                                 — |                               — |                               — |                              — |                             — |                    — |
| insert.random  |                           582,758 |                         587,985 |                         623,179 |                        660,165 |                       690,446 |              705,094 |
| insert.tail    |                                 — |                               — |                               — |                              — |                             — |                    — |
| remove.head    |                           697,635 |                         756,105 |                         737,953 |                        776,259 |                       801,499 |              808,110 |
| remove.random  |                           417,806 |                         446,623 |                         454,677 |                        469,829 |                       484,631 |              492,470 |
| remove.tail    |                           893,364 |                         914,538 |                         916,788 |                        930,496 |                       940,458 |              945,119 |
| replace.head   |                           550,124 |                         551,111 |                         523,409 |                        533,064 |                       542,829 |              549,048 |
| replace.random |                           354,968 |                         363,451 |                         378,908 |                        386,167 |                       399,582 |              406,724 |
| replace.tail   |                            40,975 |                          52,017 |                          56,258 |                         67,522 |                        77,535 |               80,248 |
| value.head     |                         2,975,242 |                       3,166,671 |                       3,187,795 |                      3,244,151 |                     3,295,516 |            3,324,273 |
| value.random   |                           851,392 |                         906,631 |                         929,186 |                        956,234 |                       990,069 |            1,012,501 |
| value.tail     |                         5,035,409 |                       5,009,964 |                       4,849,511 |                      4,794,561 |                     4,879,247 |            4,929,391 |

### API throughput at checkpoint

Checkpoint calls, in ops/s, averaged across runs.

**↑ Scale up (0 → 25,000 Strips)**

| Method                            | 1,000 Strips<br>50,871 Frames | 5,000 Strips<br>252,214 Frames | 10,000 Strips<br>504,871 Frames | 15,000 Strips<br>758,280 Frames | 20,000 Strips<br>1,010,749 Frames | 25,000 Strips<br>1,264,003 Frames |
| --------------------------------- | ----------------------------: | -----------------------------: | ------------------------------: | ------------------------------: | --------------------------------: | --------------------------------: |
| new Projection(actorID, sequence) |                         7,114 |                          1,907 |                             966 |                             631 |                               432 |                               359 |
| sequence()                        |                           817 |                            182 |                             100 |                              82 |                                55 |                                49 |
| values()                          |                         1,329 |                            360 |                             171 |                             131 |                                97 |                                81 |

**↓ Scale down (25,000 → 0 Strips)**

| Method                            | 20,000 Strips<br>1,012,742 Frames | 15,000 Strips<br>755,860 Frames | 10,000 Strips<br>504,103 Frames | 5,000 Strips<br>251,203 Frames | 1,000 Strips<br>51,057 Frames | 0 Strips<br>0 Frames |
| --------------------------------- | --------------------------------: | ------------------------------: | ------------------------------: | -----------------------------: | ----------------------------: | -------------------: |
| new Projection(actorID, sequence) |                               421 |                             623 |                             922 |                          1,870 |                         8,386 |               40,951 |
| sequence()                        |                                65 |                              78 |                              91 |                            123 |                           204 |                  845 |
| values()                          |                               117 |                             146 |                             188 |                            354 |                         1,737 |              149,297 |

### Sequence disk size at checkpoint

Complete exported Sequences, including Footage and acknowledgements. Sizes are in KiB.

**↑ Scale up (0 → 25,000 Strips)**

| Encoding           | 1,000 Strips<br>50,871 Frames | 5,000 Strips<br>252,214 Frames | 10,000 Strips<br>504,871 Frames | 15,000 Strips<br>758,280 Frames | 20,000 Strips<br>1,010,749 Frames | 25,000 Strips<br>1,264,003 Frames |
| ------------------ | ----------------------------: | -----------------------------: | ------------------------------: | ------------------------------: | --------------------------------: | --------------------------------: |
| JSON               |                        277.17 |                       1,620.41 |                        3,265.62 |                        4,933.79 |                          7,105.55 |                          9,262.87 |
| JSON + gzip        |                         14.59 |                          73.43 |                          148.95 |                          225.99 |                            310.65 |                            392.53 |
| MessagePack        |                        164.81 |                         818.92 |                        1,646.03 |                        3,553.60 |                          5,126.26 |                          6,551.31 |
| MessagePack + gzip |                         12.38 |                          61.62 |                          124.80 |                          200.02 |                            263.44 |                            335.07 |

**↓ Scale down (25,000 → 0 Strips)**

| Encoding           | 20,000 Strips<br>1,012,742 Frames | 15,000 Strips<br>755,860 Frames | 10,000 Strips<br>504,103 Frames | 5,000 Strips<br>251,203 Frames | 1,000 Strips<br>51,057 Frames | 0 Strips<br>0 Frames |
| ------------------ | --------------------------------: | ------------------------------: | ------------------------------: | -----------------------------: | ----------------------------: | -------------------: |
| JSON               |                          7,571.88 |                        5,705.14 |                        3,811.69 |                       1,888.74 |                        381.23 |                 0.02 |
| JSON + gzip        |                            326.43 |                          247.20 |                          164.77 |                          79.64 |                         15.97 |                 0.03 |
| MessagePack        |                          5,314.83 |                        3,986.78 |                        2,658.67 |                       1,319.82 |                        266.79 |                 0.01 |
| MessagePack + gzip |                            278.09 |                          209.78 |                          139.97 |                          67.74 |                         13.65 |                 0.03 |

### Memory usage at checkpoint

One instance after checkpoint compaction and recreation: live native allocation plus retained JS array slots, in KiB (1,024 bytes). Unused WASM capacity is excluded.

**↑ Scale up (0 → 25,000 Strips)**

| Measurement            | 1,000 Strips<br>50,871 Frames | 5,000 Strips<br>252,214 Frames | 10,000 Strips<br>504,871 Frames | 15,000 Strips<br>758,280 Frames | 20,000 Strips<br>1,010,749 Frames | 25,000 Strips<br>1,264,003 Frames |
| ---------------------- | ----------------------------: | -----------------------------: | ------------------------------: | ------------------------------: | --------------------------------: | --------------------------------: |
| Estimated memory (KiB) |                        874.97 |                       4,115.83 |                        7,507.03 |                       10,747.80 |                         14,223.19 |                         17,435.14 |

**↓ Scale down (25,000 → 0 Strips)**

| Measurement            | 20,000 Strips<br>1,012,742 Frames | 15,000 Strips<br>755,860 Frames | 10,000 Strips<br>504,103 Frames | 5,000 Strips<br>251,203 Frames | 1,000 Strips<br>51,057 Frames | 0 Strips<br>0 Frames |
| ---------------------- | --------------------------------: | ------------------------------: | ------------------------------: | -----------------------------: | ----------------------------: | -------------------: |
| Estimated memory (KiB) |                         14,511.58 |                       11,635.55 |                        8,626.05 |                       5,691.11 |                      3,062.25 |             1,560.34 |

Measured on Node 24.22.2, V8 13.6.233.17-node.63,
linux x64, Intel(R) Xeon(R) 6975P-C.
Peer synchronization, encoding and JS process garbage collection are outside API timings.
[Full lifecycle results](benchmark/.results/lifecycle.md) · [Throughput results](benchmark/.results/throughput.md).

### Tuple mode

Arithmetic means of 3 runs. Ordinary Projection versus a static tuple with maxLength. Both contain the same values; replacements preserve the field count.

#### Throughput (ops/s)

| Indices | Method / case   | Projection | Static tuple | Tuple / Projection |
| ------: | --------------- | ---------: | -----------: | -----------------: |
|       2 | create.sequence |  1,393,942 |    1,201,898 |              0.86× |
|       2 | replace.random  |  1,608,002 |    2,806,884 |              1.75× |
|       2 | apply.replace   |    994,698 |    1,704,356 |              1.71× |
|       2 | value.random    | 45,776,197 |   90,445,688 |              1.98× |
|       4 | create.sequence |  1,072,460 |    1,046,722 |              0.98× |
|       4 | replace.random  |  1,334,885 |    2,836,181 |              2.12× |
|       4 | apply.replace   |    898,035 |    1,791,710 |              2.00× |
|       4 | value.random    | 32,848,547 |   87,674,638 |              2.67× |
|       8 | create.sequence |    748,773 |      862,800 |              1.15× |
|       8 | replace.random  |  1,266,738 |    2,748,942 |              2.17× |
|       8 | apply.replace   |    899,863 |    1,769,542 |              1.97× |
|       8 | value.random    | 25,031,024 |   89,617,677 |              3.58× |
|     100 | create.sequence |    123,801 |      146,170 |              1.18× |
|     100 | replace.random  |  1,287,895 |    2,857,508 |              2.22× |
|     100 | apply.replace   |    880,013 |    1,727,774 |              1.96× |
|     100 | value.random    | 17,185,330 |   88,930,330 |              5.17× |

#### Space (KiB)

| Indices | Mode         | Estimated allocated memory | MessagePack | MessagePack + gzip |
| ------: | ------------ | -------------------------: | ----------: | -----------------: |
|       2 | Projection   |                       0.69 |        0.03 |               0.04 |
|       2 | Static tuple |                       0.73 |        0.04 |               0.05 |
|       4 | Projection   |                       1.40 |        0.06 |               0.05 |
|       4 | Static tuple |                       0.95 |        0.06 |               0.07 |
|       8 | Projection   |                       2.27 |        0.12 |               0.08 |
|       8 | Static tuple |                       1.38 |        0.10 |               0.09 |
|     100 | Projection   |                      20.90 |        0.67 |               0.57 |
|     100 | Static tuple |                      11.34 |        0.51 |               0.35 |

Measured on Node 24.22.2, V8 13.6.233.17-node.63, linux x64, Intel(R) Xeon(R) 6975P-C. Fixtures are hydrated compacted snapshots after one replacement per field. Each case warms up for ≥25 ms and measures ≥50 ms of API time; mutation bursts restart after 4,096 replacements. Peer authoring, encoding, result checks, destruction and explicit JS process garbage collection are outside API timings. Memory estimates are the increase in live native allocator bytes plus retained JS array slots for one instance, including exercised runtime buffers. Unused WASM capacity, JS object headers and referenced payload objects are excluded.

[Full tuple results](benchmark/.results/tuple.md).

## Tests

### Behaviour guaranteed by excessive tests

The latest verification passed 280 Vitest tests and 126 compatibility checks.
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
