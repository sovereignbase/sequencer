[![npm version](https://img.shields.io/npm/v/@sovereignbase/sequencer)](https://www.npmjs.com/package/@sovereignbase/sequencer)
[![JSR](https://jsr.io/badges/@sovereignbase/sequencer)](https://jsr.io/@sovereignbase/sequencer)
[![CI](https://github.com/sovereignbase/sequencer/actions/workflows/ci.yaml/badge.svg?branch=master)](https://github.com/sovereignbase/sequencer/actions/workflows/ci.yaml)
[![codecov](https://codecov.io/gh/sovereignbase/sequencer/branch/master/graph/badge.svg)](https://codecov.io/gh/sovereignbase/sequencer)
[![license](https://img.shields.io/npm/l/@sovereignbase/sequencer)](https://github.com/sovereignbase/sequencer/blob/master/LICENSE)

# Sequencer

Sequencer provides a deterministic total ordering for distributed data. It allows independently operating actors to make concurrent changes and eventually converge on the same state without relying on network arrival order or perfectly synchronized clocks.

## Usage

### Simple typed API

```ts
import { Projection } from '@sovereignbase/sequencer'

const projection = new Projection<string>(1)

const gossip0 = projection.insert(['Hello World'], 0)
console.log(projection.value(0)) // "Hello World"
const gossip1 = projection.replace(['Hello Dude'], 0, 0)
console.log(projection.value(0)) // "Hello Dude"
const gossip2 = projection.remove(0, 0)
console.log(projection.value(0)) // undefined

projection.destroy()
```

For text stored as UTF-16 code units, `projection.sequence(true)` returns string
Footage. Construction and merge accept either form; `sequence()` keeps array
Footage. See [Projection.sequence](https://sovereignbase.dev/sequencer/classes/Projection.html#sequence).

### See documentation

- [How sequencer works?](INTERNALS.md)
- [Typescript](https://sovereignbase.dev/sequencer/classes/Projection.html)
- [C++](https://sovereignbase.dev/sequencer/c++)

### Errors

Library-reported failures throw `SequencerError`, with a stable `SequencerErrorCode`
and a message prefixed with `{@sovereignbase/sequencer}`. Both are exported from
the package. The constructor accepts standard `ErrorOptions`, including `cause`.

| Code                      | Meaning                                                                      |
| ------------------------- | ---------------------------------------------------------------------------- |
| `PROJECTION_DESTROYED`    | An operation was called after the Projection was destroyed.                  |
| `NATIVE_OPERATION_FAILED` | The native runtime reported an initialization or operation failure.          |
| `STRING_ENCODING_FAILED`  | Snapshot Footage concatenation failed; `cause` preserves the original error. |

Invalid Gossip or Sequence input to `apply()` or `merge()` returns `undefined`.
Platform errors retain their original types.

## Benchmarks

### Moderate bundle size

| Format   | Raw (KiB) | Minified (KiB) | Minified + gzip (KiB) |
| -------- | --------: | -------------: | --------------------: |
| ESM      |    136.19 |         109.61 |                 39.20 |
| CommonJS |    136.33 |         110.32 |                 39.27 |

Both bundles include WASM. Terser uses three compression passes; gzip uses level 9.

### Average throughput during editing to checkpoint

Arithmetic means of 3 runs, in ops/s, from each phase's start to checkpoint.
Strips contain 1–100 Frames (visible entries). Headers show Strip counts and mean Frame counts.

**↑ Scale up (0 → 25,000 Strips)**

| Method / case  | 1,000 Strips<br>50,871 Frames | 5,000 Strips<br>252,214 Frames | 10,000 Strips<br>504,871 Frames | 15,000 Strips<br>758,280 Frames | 20,000 Strips<br>1,010,749 Frames | 25,000 Strips<br>1,264,003 Frames |
| -------------- | ----------------------------: | -----------------------------: | ------------------------------: | ------------------------------: | --------------------------------: | --------------------------------: |
| apply.random   |                       191,042 |                        108,824 |                          72,378 |                          52,563 |                            41,422 |                            33,864 |
| insert.head    |                     1,532,073 |                      1,378,301 |                       1,140,039 |                       1,145,632 |                         1,139,251 |                         1,124,774 |
| insert.random  |                       616,496 |                        341,999 |                         200,089 |                         139,741 |                           104,298 |                            81,558 |
| insert.tail    |                     1,803,900 |                      1,590,639 |                       1,659,512 |                       1,602,082 |                         1,547,791 |                         1,505,424 |
| remove.head    |                             — |                              — |                               — |                               — |                                 — |                                 — |
| remove.random  |                       425,345 |                        235,670 |                         147,663 |                         103,517 |                            77,402 |                            59,951 |
| remove.tail    |                             — |                              — |                               — |                               — |                                 — |                                 — |
| replace.head   |                       563,255 |                        525,764 |                         512,751 |                         470,085 |                           464,897 |                           457,956 |
| replace.random |                       346,015 |                        203,234 |                         136,819 |                          96,431 |                            74,615 |                            58,862 |
| replace.tail   |                       500,392 |                        563,042 |                         546,942 |                         538,525 |                           483,592 |                           449,217 |
| value.head     |                     3,475,187 |                      4,594,269 |                       4,521,889 |                       4,063,467 |                         3,692,919 |                         3,298,828 |
| value.random   |                       840,018 |                        338,959 |                         182,090 |                         115,249 |                            82,862 |                            63,153 |
| value.tail     |                     6,423,115 |                      6,945,152 |                       6,637,827 |                       6,169,507 |                         5,791,232 |                         5,336,157 |

**↓ Scale down (25,000 → 0 Strips)**

| Method / case  | 20,000 Strips<br>1,012,742 Frames | 15,000 Strips<br>755,860 Frames | 10,000 Strips<br>504,103 Frames | 5,000 Strips<br>251,203 Frames | 1,000 Strips<br>51,057 Frames | 0 Strips<br>0 Frames |
| -------------- | --------------------------------: | ------------------------------: | ------------------------------: | -----------------------------: | ----------------------------: | -------------------: |
| apply.random   |                            21,650 |                          22,791 |                          23,383 |                         24,319 |                        25,377 |               25,694 |
| insert.head    |                                 — |                               — |                               — |                              — |                             — |                    — |
| insert.random  |                            45,133 |                          49,275 |                          52,605 |                         54,644 |                        57,513 |               57,418 |
| insert.tail    |                                 — |                               — |                               — |                              — |                             — |                    — |
| remove.head    |                           544,089 |                         554,739 |                         568,104 |                        579,865 |                       591,121 |              595,756 |
| remove.random  |                            34,673 |                          38,551 |                          41,538 |                         44,375 |                        47,117 |               47,810 |
| remove.tail    |                           564,497 |                         553,501 |                         497,767 |                        522,984 |                       540,625 |              485,588 |
| replace.head   |                           385,386 |                         379,445 |                         378,269 |                        317,938 |                       323,483 |              249,368 |
| replace.random |                            35,565 |                          38,413 |                          41,329 |                         43,988 |                        46,563 |               46,316 |
| replace.tail   |                           225,640 |                         204,938 |                         199,846 |                        177,846 |                       179,850 |              165,852 |
| value.head     |                         1,403,943 |                       1,475,896 |                       1,512,930 |                      1,577,655 |                     1,657,563 |            1,687,835 |
| value.random   |                            35,092 |                          38,711 |                          42,102 |                         45,727 |                        49,021 |               50,150 |
| value.tail     |                         1,897,101 |                       1,922,493 |                       1,947,365 |                      2,011,003 |                     2,098,378 |            2,136,653 |

### API throughput at checkpoint

Checkpoint calls, in ops/s, averaged across runs.

**↑ Scale up (0 → 25,000 Strips)**

| Method                            | 1,000 Strips<br>50,871 Frames | 5,000 Strips<br>252,214 Frames | 10,000 Strips<br>504,871 Frames | 15,000 Strips<br>758,280 Frames | 20,000 Strips<br>1,010,749 Frames | 25,000 Strips<br>1,264,003 Frames |
| --------------------------------- | ----------------------------: | -----------------------------: | ------------------------------: | ------------------------------: | --------------------------------: | --------------------------------: |
| new Projection(actorID, sequence) |                         4,230 |                          1,157 |                             666 |                             400 |                               290 |                               211 |
| sequence()                        |                           590 |                            108 |                              47 |                              30 |                                21 |                                14 |
| values()                          |                           568 |                            272 |                             100 |                              39 |                                60 |                                21 |

**↓ Scale down (25,000 → 0 Strips)**

| Method                            | 20,000 Strips<br>1,012,742 Frames | 15,000 Strips<br>755,860 Frames | 10,000 Strips<br>504,103 Frames | 5,000 Strips<br>251,203 Frames | 1,000 Strips<br>51,057 Frames | 0 Strips<br>0 Frames |
| --------------------------------- | --------------------------------: | ------------------------------: | ------------------------------: | -----------------------------: | ----------------------------: | -------------------: |
| new Projection(actorID, sequence) |                               268 |                             398 |                             454 |                          1,290 |                         4,766 |               19,393 |
| sequence()                        |                                15 |                              14 |                              11 |                             11 |                            10 |                   10 |
| values()                          |                                55 |                              34 |                              80 |                             85 |                           271 |              116,284 |

### Sequence disk size at checkpoint

Complete exported Sequences, including Footage and acknowledgements. Sizes are in KiB.

**↑ Scale up (0 → 25,000 Strips)**

| Encoding           | 1,000 Strips<br>50,871 Frames | 5,000 Strips<br>252,214 Frames | 10,000 Strips<br>504,871 Frames | 15,000 Strips<br>758,280 Frames | 20,000 Strips<br>1,010,749 Frames | 25,000 Strips<br>1,264,003 Frames |
| ------------------ | ----------------------------: | -----------------------------: | ------------------------------: | ------------------------------: | --------------------------------: | --------------------------------: |
| JSON               |                        277.40 |                       1,622.74 |                        3,263.89 |                        4,904.34 |                          7,045.69 |                          9,168.27 |
| JSON + gzip        |                         14.59 |                          73.81 |                          150.32 |                          226.80 |                            311.07 |                            391.49 |
| MessagePack        |                        164.81 |                         818.88 |                        1,639.69 |                        3,529.41 |                          5,081.04 |                          6,483.22 |
| MessagePack + gzip |                         12.38 |                          61.62 |                          124.91 |                          198.58 |                            263.54 |                            332.77 |

**↓ Scale down (25,000 → 0 Strips)**

| Encoding           | 20,000 Strips<br>1,012,742 Frames | 15,000 Strips<br>755,860 Frames | 10,000 Strips<br>504,103 Frames | 5,000 Strips<br>251,203 Frames | 1,000 Strips<br>51,057 Frames | 0 Strips<br>0 Frames |
| ------------------ | --------------------------------: | ------------------------------: | ------------------------------: | -----------------------------: | ----------------------------: | -------------------: |
| JSON               |                          7,451.87 |                        5,621.67 |                        3,772.59 |                       1,886.94 |                        383.51 |                 0.02 |
| JSON + gzip        |                            323.06 |                          244.28 |                          163.83 |                          80.58 |                         16.33 |                 0.03 |
| MessagePack        |                          5,237.17 |                        3,930.33 |                        2,628.38 |                       1,312.43 |                        266.67 |                 0.01 |
| MessagePack + gzip |                            274.96 |                          207.77 |                          137.38 |                          67.41 |                         13.67 |                 0.03 |

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

Measured on Node 24.22.0, V8 13.6.233.17-node.57,
linux x64, INTEL(R) XEON(R) PLATINUM 8573C.
Peer synchronization, encoding and JS process garbage collection are outside API timings.
[Full lifecycle results](benchmark/.results/lifecycle.md) · [Throughput results](benchmark/.results/throughput.md).

## Tests

### Behaviour guaranteed by excessive tests

The latest verification passed 221 Vitest tests and 117 compatibility checks.
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
