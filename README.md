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
| ESM      |    158.96 |         129.47 |                 46.18 |
| CommonJS |    159.10 |         130.50 |                 46.26 |

Both bundles include WASM. Terser uses three compression passes; gzip uses level 9.

### Average throughput during editing to checkpoint

Arithmetic means of 3 runs, in ops/s, from each phase's start to checkpoint.
Strips contain 1–100 Frames (visible entries). Headers show Strip counts and mean Frame counts.

**↑ Scale up (0 → 25,000 Strips)**

| Method / case  | 1,000 Strips<br>50,871 Frames | 5,000 Strips<br>252,214 Frames | 10,000 Strips<br>504,871 Frames | 15,000 Strips<br>758,280 Frames | 20,000 Strips<br>1,010,749 Frames | 25,000 Strips<br>1,264,003 Frames |
| -------------- | ----------------------------: | -----------------------------: | ------------------------------: | ------------------------------: | --------------------------------: | --------------------------------: |
| apply.random   |                       171,453 |                         85,179 |                          58,501 |                          44,348 |                            36,323 |                            30,990 |
| insert.head    |                     1,276,746 |                        960,179 |                       1,042,758 |                       1,064,696 |                         1,067,029 |                         1,069,362 |
| insert.random  |                       469,631 |                        248,663 |                         158,879 |                         119,231 |                            95,849 |                            80,824 |
| insert.tail    |                     1,341,595 |                      1,095,289 |                       1,177,829 |                       1,194,605 |                         1,197,486 |                         1,193,245 |
| remove.head    |                             — |                              — |                               — |                               — |                                 — |                                 — |
| remove.random  |                       349,893 |                        173,185 |                         113,529 |                          83,543 |                            66,557 |                            55,076 |
| remove.tail    |                             — |                              — |                               — |                               — |                                 — |                                 — |
| replace.head   |                       417,992 |                        400,907 |                         416,099 |                         404,921 |                           412,190 |                           415,949 |
| replace.random |                       272,164 |                        151,592 |                         104,777 |                          77,749 |                            62,754 |                            52,295 |
| replace.tail   |                       401,524 |                        426,873 |                         402,079 |                         419,609 |                           397,504 |                           378,710 |
| value.head     |                     2,376,498 |                      2,765,562 |                       3,050,230 |                       3,227,199 |                         3,396,157 |                         3,450,987 |
| value.random   |                       691,744 |                        248,566 |                         141,123 |                          97,002 |                            75,434 |                            61,822 |
| value.tail     |                     4,805,104 |                      4,436,324 |                       4,396,600 |                       4,425,266 |                         4,463,274 |                         4,357,543 |

**↓ Scale down (25,000 → 0 Strips)**

| Method / case  | 20,000 Strips<br>1,012,742 Frames | 15,000 Strips<br>755,860 Frames | 10,000 Strips<br>504,103 Frames | 5,000 Strips<br>251,203 Frames | 1,000 Strips<br>51,057 Frames | 0 Strips<br>0 Frames |
| -------------- | --------------------------------: | ------------------------------: | ------------------------------: | -----------------------------: | ----------------------------: | -------------------: |
| apply.random   |                            19,988 |                          20,193 |                          20,681 |                         20,759 |                        21,242 |               21,530 |
| insert.head    |                                 — |                               — |                               — |                              — |                             — |                    — |
| insert.random  |                            49,300 |                          49,351 |                          51,688 |                         50,838 |                        52,366 |               50,663 |
| insert.tail    |                                 — |                               — |                               — |                              — |                             — |                    — |
| remove.head    |                           481,597 |                         472,449 |                         475,588 |                        476,638 |                       478,416 |              481,279 |
| remove.random  |                            35,338 |                          36,452 |                          38,352 |                         39,318 |                        40,890 |               41,652 |
| remove.tail    |                           472,124 |                         452,527 |                         462,921 |                        414,675 |                       424,065 |              416,496 |
| replace.head   |                           362,540 |                         347,442 |                         332,980 |                        294,974 |                       287,270 |              210,123 |
| replace.random |                            34,497 |                          35,502 |                          37,360 |                         37,954 |                        39,083 |               38,305 |
| replace.tail   |                           178,494 |                         163,617 |                         153,538 |                        140,076 |                       137,526 |              120,463 |
| value.head     |                         1,740,991 |                       1,699,295 |                       1,703,356 |                      1,695,840 |                     1,731,440 |            1,755,420 |
| value.random   |                            39,064 |                          40,132 |                          42,401 |                         43,506 |                        45,321 |               46,294 |
| value.tail     |                         1,986,878 |                       1,939,252 |                       1,936,152 |                      1,937,988 |                     1,992,747 |            2,027,784 |

### API throughput at checkpoint

Checkpoint calls, in ops/s, averaged across runs.

**↑ Scale up (0 → 25,000 Strips)**

| Method                            | 1,000 Strips<br>50,871 Frames | 5,000 Strips<br>252,214 Frames | 10,000 Strips<br>504,871 Frames | 15,000 Strips<br>758,280 Frames | 20,000 Strips<br>1,010,749 Frames | 25,000 Strips<br>1,264,003 Frames |
| --------------------------------- | ----------------------------: | -----------------------------: | ------------------------------: | ------------------------------: | --------------------------------: | --------------------------------: |
| new Projection(actorID, sequence) |                         4,600 |                          1,050 |                             603 |                             418 |                               287 |                               241 |
| sequence()                        |                           559 |                             96 |                              46 |                              29 |                                20 |                                14 |
| values()                          |                           663 |                            214 |                              65 |                              59 |                                37 |                                38 |

**↓ Scale down (25,000 → 0 Strips)**

| Method                            | 20,000 Strips<br>1,012,742 Frames | 15,000 Strips<br>755,860 Frames | 10,000 Strips<br>504,103 Frames | 5,000 Strips<br>251,203 Frames | 1,000 Strips<br>51,057 Frames | 0 Strips<br>0 Frames |
| --------------------------------- | --------------------------------: | ------------------------------: | ------------------------------: | -----------------------------: | ----------------------------: | -------------------: |
| new Projection(actorID, sequence) |                               284 |                             420 |                             503 |                          1,269 |                         5,331 |               21,152 |
| sequence()                        |                                14 |                              14 |                              10 |                             10 |                             8 |                    9 |
| values()                          |                                55 |                              33 |                              78 |                             84 |                           207 |              105,615 |

### Sequence disk size at checkpoint

Complete exported Sequences, including Footage and acknowledgements. Sizes are in KiB.

**↑ Scale up (0 → 25,000 Strips)**

| Encoding           | 1,000 Strips<br>50,871 Frames | 5,000 Strips<br>252,214 Frames | 10,000 Strips<br>504,871 Frames | 15,000 Strips<br>758,280 Frames | 20,000 Strips<br>1,010,749 Frames | 25,000 Strips<br>1,264,003 Frames |
| ------------------ | ----------------------------: | -----------------------------: | ------------------------------: | ------------------------------: | --------------------------------: | --------------------------------: |
| JSON               |                        277.17 |                       1,621.63 |                        3,261.64 |                        4,900.86 |                          7,041.20 |                          9,162.56 |
| JSON + gzip        |                         14.59 |                          73.79 |                          150.28 |                          226.66 |                            310.89 |                            391.35 |
| MessagePack        |                        164.81 |                         818.88 |                        1,639.69 |                        3,529.41 |                          5,081.04 |                          6,483.22 |
| MessagePack + gzip |                         12.38 |                          61.62 |                          124.91 |                          198.58 |                            263.54 |                            332.77 |

**↓ Scale down (25,000 → 0 Strips)**

| Encoding           | 20,000 Strips<br>1,012,742 Frames | 15,000 Strips<br>755,860 Frames | 10,000 Strips<br>504,103 Frames | 5,000 Strips<br>251,203 Frames | 1,000 Strips<br>51,057 Frames | 0 Strips<br>0 Frames |
| ------------------ | --------------------------------: | ------------------------------: | ------------------------------: | -----------------------------: | ----------------------------: | -------------------: |
| JSON               |                          7,446.36 |                        5,617.47 |                        3,769.77 |                       1,885.57 |                        383.22 |                 0.02 |
| JSON + gzip        |                            322.95 |                          244.24 |                          163.81 |                          80.60 |                         16.34 |                 0.03 |
| MessagePack        |                          5,237.17 |                        3,930.33 |                        2,628.38 |                       1,312.43 |                        266.67 |                 0.01 |
| MessagePack + gzip |                            274.96 |                          207.78 |                          137.38 |                          67.40 |                         13.67 |                 0.03 |

### Memory usage at checkpoint

One instance: WASM memory plus retained JS array slots, in KiB (1,024 bytes).

**↑ Scale up (0 → 25,000 Strips)**

| Measurement            | 1,000 Strips<br>50,871 Frames | 5,000 Strips<br>252,214 Frames | 10,000 Strips<br>504,871 Frames | 15,000 Strips<br>758,280 Frames | 20,000 Strips<br>1,010,749 Frames | 25,000 Strips<br>1,264,003 Frames |
| ---------------------- | ----------------------------: | -----------------------------: | ------------------------------: | ------------------------------: | --------------------------------: | --------------------------------: |
| Estimated memory (KiB) |                      5,343.67 |                      25,100.58 |                       50,470.89 |                       82,701.27 |                         98,036.35 |                        153,462.93 |

**↓ Scale down (25,000 → 0 Strips)**

| Measurement            | 20,000 Strips<br>1,012,742 Frames | 15,000 Strips<br>755,860 Frames | 10,000 Strips<br>504,103 Frames | 5,000 Strips<br>251,203 Frames | 1,000 Strips<br>51,057 Frames | 0 Strips<br>0 Frames |
| ---------------------- | --------------------------------: | ------------------------------: | ------------------------------: | -----------------------------: | ----------------------------: | -------------------: |
| Estimated memory (KiB) |                        163,746.93 |                      174,034.00 |                      202,660.72 |                     293,941.85 |                    302,158.29 |           304,203.30 |

Measured on Node 24.22.2, V8 13.6.233.17-node.63,
linux x64, AMD EPYC 7763 64-Core Processor.
Peer synchronization, encoding and JS process garbage collection are outside API timings.
[Full lifecycle results](benchmark/.results/lifecycle.md) · [Throughput results](benchmark/.results/throughput.md).

### Tuple mode

Arithmetic means of 3 runs. Ordinary Projection versus a static tuple with maxLength. Both contain the same values; replacements preserve the field count.

#### Throughput (ops/s)

| Indices | Method / case   | Projection | Static tuple | Tuple / Projection |
| ------: | --------------- | ---------: | -----------: | -----------------: |
|       2 | create.sequence |    671,232 |      605,130 |              0.90× |
|       2 | replace.random  |    727,952 |    1,167,663 |              1.60× |
|       2 | apply.replace   |    496,236 |      649,176 |              1.31× |
|       2 | value.random    | 31,247,502 |   50,026,903 |              1.60× |
|       4 | create.sequence |    479,185 |      530,192 |              1.11× |
|       4 | replace.random  |    765,676 |    1,239,945 |              1.62× |
|       4 | apply.replace   |    396,319 |      755,856 |              1.91× |
|       4 | value.random    | 25,741,279 |   49,159,717 |              1.91× |
|       8 | create.sequence |    351,017 |      435,424 |              1.24× |
|       8 | replace.random  |    773,074 |    1,159,168 |              1.50× |
|       8 | apply.replace   |    353,373 |      631,010 |              1.79× |
|       8 | value.random    | 19,929,925 |   49,563,350 |              2.49× |
|     100 | create.sequence |     68,980 |      100,622 |              1.46× |
|     100 | replace.random  |    670,840 |    1,180,230 |              1.76× |
|     100 | apply.replace   |    331,266 |      730,372 |              2.20× |
|     100 | value.random    |  9,127,830 |   48,386,741 |              5.30× |

#### Space (KiB)

| Indices | Mode         | Estimated allocated memory | MessagePack | MessagePack + gzip |
| ------: | ------------ | -------------------------: | ----------: | -----------------: |
|       2 | Projection   |                       0.98 |        0.03 |               0.04 |
|       2 | Static tuple |                       0.90 |        0.04 |               0.05 |
|       4 | Projection   |                       1.57 |        0.06 |               0.05 |
|       4 | Static tuple |                       1.09 |        0.06 |               0.07 |
|       8 | Projection   |                       2.52 |        0.12 |               0.08 |
|       8 | Static tuple |                       1.55 |        0.10 |               0.09 |
|     100 | Projection   |                      23.78 |        0.67 |               0.57 |
|     100 | Static tuple |                      12.23 |        0.51 |               0.35 |

Measured on Node 24.22.2, V8 13.6.233.17-node.63, linux x64, AMD EPYC 7763 64-Core Processor. Fixtures are hydrated compacted snapshots after one replacement per field. Each case warms up for ≥25 ms and measures ≥50 ms of API time; mutation bursts restart after 4,096 replacements. Peer authoring, encoding, result checks, destruction and explicit JS process garbage collection are outside API timings. Memory estimates are the increase in live native allocator bytes plus retained JS array slots for one instance, including exercised runtime buffers. Unused WASM capacity, JS object headers and referenced payload objects are excluded.

[Full tuple results](benchmark/.results/tuple.md).

## Tests

### Behaviour guaranteed by excessive tests

The latest verification passed 271 Vitest tests and 117 compatibility checks.
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
