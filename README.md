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
| apply.random   |                       323,472 |                        289,877 |                         295,038 |                         298,230 |                           298,240 |                           295,590 |
| insert.head    |                     1,404,441 |                      1,261,957 |                       1,372,790 |                       1,397,553 |                         1,374,668 |                         1,378,995 |
| insert.random  |                       734,261 |                        716,535 |                         701,951 |                         693,136 |                           661,462 |                           656,590 |
| insert.tail    |                     1,551,365 |                      1,544,261 |                       1,570,667 |                       1,464,934 |                         1,474,459 |                         1,423,137 |
| remove.head    |                             — |                              — |                               — |                               — |                                 — |                                 — |
| remove.random  |                       492,063 |                        422,099 |                         422,342 |                         417,502 |                           415,089 |                           408,689 |
| remove.tail    |                             — |                              — |                               — |                               — |                                 — |                                 — |
| replace.head   |                       460,635 |                        463,929 |                         478,815 |                         476,310 |                           479,168 |                           464,115 |
| replace.random |                       394,557 |                        346,714 |                         345,156 |                         337,108 |                           335,163 |                           333,569 |
| replace.tail   |                       416,183 |                        462,111 |                         428,881 |                         448,858 |                           455,032 |                           446,043 |
| value.head     |                     2,774,194 |                      3,167,388 |                       3,464,258 |                       3,530,050 |                         3,577,562 |                         3,582,235 |
| value.random   |                     1,516,111 |                      1,195,740 |                       1,153,078 |                       1,112,148 |                         1,090,628 |                         1,075,895 |
| value.tail     |                     5,317,455 |                      5,720,997 |                       6,100,178 |                       6,389,328 |                         6,589,793 |                         6,701,405 |

**↓ Scale down (25,000 → 0 Strips)**

| Method / case  | 20,000 Strips<br>1,012,742 Frames | 15,000 Strips<br>755,860 Frames | 10,000 Strips<br>504,103 Frames | 5,000 Strips<br>251,203 Frames | 1,000 Strips<br>51,057 Frames | 0 Strips<br>0 Frames |
| -------------- | --------------------------------: | ------------------------------: | ------------------------------: | -----------------------------: | ----------------------------: | -------------------: |
| apply.random   |                           261,996 |                         275,307 |                         260,070 |                        271,987 |                       281,965 |              284,722 |
| insert.head    |                                 — |                               — |                               — |                              — |                             — |                    — |
| insert.random  |                           559,828 |                         568,848 |                         579,425 |                        595,682 |                       616,400 |              624,593 |
| insert.tail    |                                 — |                               — |                               — |                              — |                             — |                    — |
| remove.head    |                           563,739 |                         556,580 |                         538,486 |                        549,325 |                       560,853 |              563,743 |
| remove.random  |                           387,065 |                         352,801 |                         366,470 |                        378,899 |                       391,385 |              396,131 |
| remove.tail    |                           614,999 |                         607,333 |                         604,755 |                        609,478 |                       616,352 |              618,888 |
| replace.head   |                           431,145 |                         414,233 |                         417,949 |                        419,276 |                       402,667 |              406,354 |
| replace.random |                           316,828 |                         311,104 |                         321,573 |                        325,114 |                       334,142 |              338,001 |
| replace.tail   |                           309,699 |                         189,956 |                          82,222 |                         73,537 |                        84,857 |               87,253 |
| value.head     |                         2,446,122 |                       2,407,061 |                       2,450,969 |                      2,486,534 |                     2,523,414 |            2,529,415 |
| value.random   |                           975,648 |                         986,078 |                       1,001,539 |                      1,014,212 |                     1,046,477 |            1,059,167 |
| value.tail     |                         4,693,978 |                       4,617,197 |                       4,534,427 |                      4,455,289 |                     4,439,082 |            4,458,985 |

### API throughput at checkpoint

Checkpoint calls, in ops/s, averaged across runs.

**↑ Scale up (0 → 25,000 Strips)**

| Method                            | 1,000 Strips<br>50,871 Frames | 5,000 Strips<br>252,214 Frames | 10,000 Strips<br>504,871 Frames | 15,000 Strips<br>758,280 Frames | 20,000 Strips<br>1,010,749 Frames | 25,000 Strips<br>1,264,003 Frames |
| --------------------------------- | ----------------------------: | -----------------------------: | ------------------------------: | ------------------------------: | --------------------------------: | --------------------------------: |
| new Projection(actorID, sequence) |                         4,997 |                          1,340 |                             698 |                             455 |                               311 |                               256 |
| sequence()                        |                           557 |                            157 |                              91 |                              76 |                                51 |                                47 |
| values()                          |                         1,230 |                            328 |                             133 |                             101 |                               102 |                                93 |

**↓ Scale down (25,000 → 0 Strips)**

| Method                            | 20,000 Strips<br>1,012,742 Frames | 15,000 Strips<br>755,860 Frames | 10,000 Strips<br>504,103 Frames | 5,000 Strips<br>251,203 Frames | 1,000 Strips<br>51,057 Frames | 0 Strips<br>0 Frames |
| --------------------------------- | --------------------------------: | ------------------------------: | ------------------------------: | -----------------------------: | ----------------------------: | -------------------: |
| new Projection(actorID, sequence) |                               300 |                             435 |                             608 |                          1,328 |                         5,640 |               52,165 |
| sequence()                        |                                54 |                              61 |                              83 |                            113 |                           175 |                  731 |
| values()                          |                               110 |                             141 |                             186 |                            315 |                         1,798 |              139,961 |

### Sequence disk size at checkpoint

Complete exported Sequences, including Footage and acknowledgements. Sizes are in KiB.

**↑ Scale up (0 → 25,000 Strips)**

| Encoding           | 1,000 Strips<br>50,871 Frames | 5,000 Strips<br>252,214 Frames | 10,000 Strips<br>504,871 Frames | 15,000 Strips<br>758,280 Frames | 20,000 Strips<br>1,010,749 Frames | 25,000 Strips<br>1,264,003 Frames |
| ------------------ | ----------------------------: | -----------------------------: | ------------------------------: | ------------------------------: | --------------------------------: | --------------------------------: |
| JSON               |                        277.52 |                       1,620.44 |                        3,263.68 |                        4,933.74 |                          7,108.51 |                          9,266.70 |
| JSON + gzip        |                         14.59 |                          73.43 |                          148.94 |                          226.11 |                            310.95 |                            392.57 |
| MessagePack        |                        164.81 |                         818.92 |                        1,646.03 |                        3,553.60 |                          5,126.26 |                          6,551.31 |
| MessagePack + gzip |                         12.38 |                          61.63 |                          124.81 |                          200.05 |                            263.43 |                            335.07 |

**↓ Scale down (25,000 → 0 Strips)**

| Encoding           | 20,000 Strips<br>1,012,742 Frames | 15,000 Strips<br>755,860 Frames | 10,000 Strips<br>504,103 Frames | 5,000 Strips<br>251,203 Frames | 1,000 Strips<br>51,057 Frames | 0 Strips<br>0 Frames |
| ------------------ | --------------------------------: | ------------------------------: | ------------------------------: | -----------------------------: | ----------------------------: | -------------------: |
| JSON               |                          7,572.92 |                        5,702.43 |                        3,809.24 |                       1,889.66 |                        381.23 |                 0.02 |
| JSON + gzip        |                            326.39 |                          247.02 |                          164.76 |                          79.63 |                         15.97 |                 0.03 |
| MessagePack        |                          5,314.83 |                        3,986.78 |                        2,658.67 |                       1,319.82 |                        266.79 |                 0.01 |
| MessagePack + gzip |                            278.12 |                          209.79 |                          139.97 |                          67.74 |                         13.66 |                 0.03 |

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

Measured on Node 24.16.0, V8 13.6.233.17-node.49,
win32 x64, Intel(R) Core(TM) i5-10210U CPU @ 1.60GHz.
Peer synchronization, encoding and JS process garbage collection are outside API timings.
[Full lifecycle results](benchmark/.results/lifecycle.md) · [Throughput results](benchmark/.results/throughput.md).

### Tuple mode

Arithmetic means of 3 runs. Ordinary Projection versus a static tuple with maxLength. Both contain the same values; replacements preserve the field count.

#### Throughput (ops/s)

| Indices | Method / case   | Projection | Static tuple | Tuple / Projection |
| ------: | --------------- | ---------: | -----------: | -----------------: |
|       2 | create.sequence |    909,703 |      752,195 |              0.83× |
|       2 | replace.random  |  1,136,323 |    1,742,885 |              1.53× |
|       2 | apply.replace   |    714,073 |    1,039,888 |              1.46× |
|       2 | value.random    | 33,727,845 |   60,057,407 |              1.78× |
|       4 | create.sequence |    656,628 |      673,267 |              1.03× |
|       4 | replace.random  |  1,021,323 |    1,757,956 |              1.72× |
|       4 | apply.replace   |    632,639 |    1,025,944 |              1.62× |
|       4 | value.random    | 26,322,494 |   60,273,574 |              2.29× |
|       8 | create.sequence |    459,958 |      554,021 |              1.20× |
|       8 | replace.random  |    930,567 |    1,621,424 |              1.74× |
|       8 | apply.replace   |    659,223 |    1,074,734 |              1.63× |
|       8 | value.random    | 20,622,551 |   62,071,602 |              3.01× |
|     100 | create.sequence |     76,491 |      108,179 |              1.41× |
|     100 | replace.random  |    942,654 |    1,647,656 |              1.75× |
|     100 | apply.replace   |    661,663 |    1,114,885 |              1.68× |
|     100 | value.random    | 13,817,940 |   61,706,122 |              4.47× |

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

Measured on Node 24.16.0, V8 13.6.233.17-node.49, win32 x64, Intel(R) Core(TM) i5-10210U CPU @ 1.60GHz. Fixtures are hydrated compacted snapshots after one replacement per field. Each case warms up for ≥25 ms and measures ≥50 ms of API time; mutation bursts restart after 4,096 replacements. Peer authoring, encoding, result checks, destruction and explicit JS process garbage collection are outside API timings. Memory estimates are the increase in live native allocator bytes plus retained JS array slots for one instance, including exercised runtime buffers. Unused WASM capacity, JS object headers and referenced payload objects are excluded.

[Full tuple results](benchmark/.results/tuple.md).

## Tests

### Behaviour guaranteed by excessive tests

The latest verification passed 280 Vitest tests and 112 compatibility checks (1 failed).
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
- Firefox browser windows: failed (matching Playwright browser binary unavailable)
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
