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
| apply.random   |                       519,428 |                        464,971 |                         442,655 |                         423,325 |                           423,459 |                           417,360 |
| insert.head    |                     2,034,916 |                      1,793,922 |                       1,928,320 |                       2,027,674 |                         1,990,086 |                         1,676,894 |
| insert.random  |                     1,060,593 |                        975,276 |                         894,241 |                         882,043 |                           836,371 |                           823,281 |
| insert.tail    |                     2,307,946 |                      2,414,445 |                       2,373,184 |                       2,181,978 |                         2,170,464 |                         2,027,098 |
| remove.head    |                             — |                              — |                               — |                               — |                                 — |                                 — |
| remove.random  |                       571,794 |                        510,084 |                         515,490 |                         522,270 |                           527,675 |                           523,220 |
| remove.tail    |                             — |                              — |                               — |                               — |                                 — |                                 — |
| replace.head   |                       690,956 |                        685,768 |                         629,461 |                         659,893 |                           681,271 |                           666,789 |
| replace.random |                       571,304 |                        446,687 |                         442,454 |                         436,436 |                           434,349 |                           433,371 |
| replace.tail   |                       605,124 |                        681,002 |                         711,811 |                         728,549 |                           725,139 |                           734,544 |
| value.head     |                     4,372,745 |                      5,273,278 |                       5,656,229 |                       6,051,763 |                         6,278,814 |                         6,429,527 |
| value.random   |                     2,119,172 |                      1,418,908 |                       1,248,525 |                       1,188,155 |                         1,160,177 |                         1,131,391 |
| value.tail     |                     7,101,007 |                      8,238,049 |                       8,565,217 |                       9,037,258 |                         9,423,383 |                         9,644,750 |

**↓ Scale down (25,000 → 0 Strips)**

| Method / case  | 20,000 Strips<br>1,012,742 Frames | 15,000 Strips<br>755,860 Frames | 10,000 Strips<br>504,103 Frames | 5,000 Strips<br>251,203 Frames | 1,000 Strips<br>51,057 Frames | 0 Strips<br>0 Frames |
| -------------- | --------------------------------: | ------------------------------: | ------------------------------: | -----------------------------: | ----------------------------: | -------------------: |
| apply.random   |                           434,461 |                         425,826 |                         428,987 |                        437,345 |                       447,290 |              452,592 |
| insert.head    |                                 — |                               — |                               — |                              — |                             — |                    — |
| insert.random  |                           700,632 |                         660,665 |                         684,017 |                        720,173 |                       750,525 |              765,146 |
| insert.tail    |                                 — |                               — |                               — |                              — |                             — |                    — |
| remove.head    |                           905,026 |                         924,636 |                         849,172 |                        880,514 |                       895,581 |              900,898 |
| remove.random  |                           527,557 |                         531,263 |                         526,049 |                        540,423 |                       552,758 |              560,933 |
| remove.tail    |                         1,041,761 |                       1,051,887 |                       1,038,394 |                      1,048,810 |                     1,050,027 |            1,054,491 |
| replace.head   |                           645,971 |                         564,793 |                         541,151 |                        556,657 |                       570,051 |              576,764 |
| replace.random |                           427,628 |                         411,292 |                         402,935 |                        413,366 |                       427,599 |              434,724 |
| replace.tail   |                           292,337 |                         231,506 |                         103,428 |                        114,742 |                       117,794 |              121,845 |
| value.head     |                         3,458,693 |                       3,618,618 |                       3,534,277 |                      3,551,731 |                     3,570,163 |            3,598,575 |
| value.random   |                         1,051,723 |                       1,043,767 |                       1,041,715 |                      1,062,755 |                     1,092,970 |            1,115,941 |
| value.tail     |                         5,950,447 |                       5,783,229 |                       5,451,085 |                      5,417,022 |                     5,447,845 |            5,497,293 |

### API throughput at checkpoint

Checkpoint calls, in ops/s, averaged across runs.

**↑ Scale up (0 → 25,000 Strips)**

| Method                            | 1,000 Strips<br>50,871 Frames | 5,000 Strips<br>252,214 Frames | 10,000 Strips<br>504,871 Frames | 15,000 Strips<br>758,280 Frames | 20,000 Strips<br>1,010,749 Frames | 25,000 Strips<br>1,264,003 Frames |
| --------------------------------- | ----------------------------: | -----------------------------: | ------------------------------: | ------------------------------: | --------------------------------: | --------------------------------: |
| new Projection(actorID, sequence) |                         7,152 |                          1,947 |                             884 |                             639 |                               418 |                               345 |
| sequence()                        |                           798 |                            176 |                             111 |                              93 |                                60 |                                53 |
| values()                          |                         1,477 |                            444 |                             232 |                             166 |                               120 |                               102 |

**↓ Scale down (25,000 → 0 Strips)**

| Method                            | 20,000 Strips<br>1,012,742 Frames | 15,000 Strips<br>755,860 Frames | 10,000 Strips<br>504,103 Frames | 5,000 Strips<br>251,203 Frames | 1,000 Strips<br>51,057 Frames | 0 Strips<br>0 Frames |
| --------------------------------- | --------------------------------: | ------------------------------: | ------------------------------: | -----------------------------: | ----------------------------: | -------------------: |
| new Projection(actorID, sequence) |                               403 |                             599 |                             907 |                          2,007 |                         8,129 |               62,019 |
| sequence()                        |                                70 |                              82 |                             103 |                            136 |                           207 |                  916 |
| values()                          |                               127 |                             162 |                             244 |                            459 |                         1,870 |              207,221 |

### Sequence disk size at checkpoint

Complete exported Sequences, including Footage and acknowledgements. Sizes are in KiB.

**↑ Scale up (0 → 25,000 Strips)**

| Encoding           | 1,000 Strips<br>50,871 Frames | 5,000 Strips<br>252,214 Frames | 10,000 Strips<br>504,871 Frames | 15,000 Strips<br>758,280 Frames | 20,000 Strips<br>1,010,749 Frames | 25,000 Strips<br>1,264,003 Frames |
| ------------------ | ----------------------------: | -----------------------------: | ------------------------------: | ------------------------------: | --------------------------------: | --------------------------------: |
| JSON               |                        277.64 |                       1,620.43 |                        3,261.13 |                        4,928.75 |                          7,104.68 |                          9,258.87 |
| JSON + gzip        |                         14.58 |                          73.45 |                          148.87 |                          225.96 |                            310.84 |                            392.44 |
| MessagePack        |                        164.81 |                         818.92 |                        1,646.03 |                        3,553.60 |                          5,126.26 |                          6,551.31 |
| MessagePack + gzip |                         12.38 |                          61.63 |                          124.81 |                          200.05 |                            263.44 |                            335.07 |

**↓ Scale down (25,000 → 0 Strips)**

| Encoding           | 20,000 Strips<br>1,012,742 Frames | 15,000 Strips<br>755,860 Frames | 10,000 Strips<br>504,103 Frames | 5,000 Strips<br>251,203 Frames | 1,000 Strips<br>51,057 Frames | 0 Strips<br>0 Frames |
| ------------------ | --------------------------------: | ------------------------------: | ------------------------------: | -----------------------------: | ----------------------------: | -------------------: |
| JSON               |                          7,567.49 |                        5,700.50 |                        3,809.52 |                       1,888.41 |                        380.78 |                 0.02 |
| JSON + gzip        |                            326.47 |                          247.10 |                          164.80 |                          79.65 |                         15.97 |                 0.03 |
| MessagePack        |                          5,314.83 |                        3,986.78 |                        2,658.67 |                       1,319.82 |                        266.79 |                 0.01 |
| MessagePack + gzip |                            278.09 |                          209.77 |                          139.97 |                          67.73 |                         13.65 |                 0.03 |

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
|       2 | create.sequence |  1,433,007 |    1,225,458 |              0.86× |
|       2 | replace.random  |  1,687,497 |    2,836,460 |              1.68× |
|       2 | apply.replace   |  1,022,119 |    1,668,452 |              1.63× |
|       2 | value.random    | 46,341,298 |   91,660,100 |              1.98× |
|       4 | create.sequence |  1,008,936 |    1,020,942 |              1.01× |
|       4 | replace.random  |  1,304,817 |    2,742,278 |              2.10× |
|       4 | apply.replace   |    940,268 |    1,704,136 |              1.81× |
|       4 | value.random    | 33,122,458 |   90,501,441 |              2.73× |
|       8 | create.sequence |    701,949 |      839,981 |              1.20× |
|       8 | replace.random  |  1,305,707 |    2,778,208 |              2.13× |
|       8 | apply.replace   |    901,418 |    1,772,045 |              1.97× |
|       8 | value.random    | 25,295,634 |   91,078,995 |              3.60× |
|     100 | create.sequence |    124,022 |      146,611 |              1.18× |
|     100 | replace.random  |  1,252,053 |    2,750,257 |              2.20× |
|     100 | apply.replace   |    883,928 |    1,749,881 |              1.98× |
|     100 | value.random    | 17,633,658 |   91,429,823 |              5.18× |

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
