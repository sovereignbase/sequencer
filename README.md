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
| ESM      |    135.00 |         109.15 |                 39.03 |
| CommonJS |    135.14 |         109.84 |                 39.11 |

Both bundles include WASM. Terser uses three compression passes; gzip uses level 9.

### Average throughput during editing to checkpoint

Arithmetic means of 3 runs, in ops/s, from each phase's start to checkpoint.
Strips contain 1–100 Frames (visible entries). Headers show Strip counts and mean Frame counts.

**↑ Scale up (0 → 25,000 Strips)**

| Method / case  | 1,000 Strips<br>50,871 Frames | 5,000 Strips<br>252,214 Frames | 10,000 Strips<br>504,871 Frames | 15,000 Strips<br>758,280 Frames | 20,000 Strips<br>1,010,749 Frames | 25,000 Strips<br>1,264,003 Frames |
| -------------- | ----------------------------: | -----------------------------: | ------------------------------: | ------------------------------: | --------------------------------: | --------------------------------: |
| apply.random   |                       171,312 |                         86,111 |                          63,134 |                          49,294 |                            41,202 |                            34,638 |
| insert.head    |                     1,216,003 |                      1,014,807 |                       1,153,387 |                       1,187,412 |                         1,222,058 |                         1,241,029 |
| insert.random  |                       517,039 |                        243,957 |                         160,895 |                         127,050 |                           104,849 |                            87,753 |
| insert.tail    |                     1,451,116 |                        974,022 |                       1,138,350 |                       1,205,760 |                         1,258,287 |                         1,287,615 |
| remove.head    |                             — |                              — |                               — |                               — |                                 — |                                 — |
| remove.random  |                       367,098 |                        171,391 |                         115,858 |                          87,873 |                            71,015 |                            58,907 |
| remove.tail    |                             — |                              — |                               — |                               — |                                 — |                                 — |
| replace.head   |                       453,050 |                        434,757 |                         427,735 |                         381,243 |                           393,718 |                           409,818 |
| replace.random |                       280,835 |                        158,815 |                         109,841 |                          83,290 |                            67,744 |                            56,558 |
| replace.tail   |                       390,234 |                        445,117 |                         479,700 |                         493,526 |                           469,737 |                           464,188 |
| value.head     |                     2,663,014 |                      3,432,870 |                       3,649,219 |                       3,843,685 |                         4,017,219 |                         4,037,953 |
| value.random   |                       735,911 |                        238,468 |                         141,651 |                         100,967 |                            79,854 |                            65,021 |
| value.tail     |                     5,444,384 |                      5,380,815 |                       5,199,621 |                       5,217,019 |                         5,289,053 |                         5,221,842 |

**↓ Scale down (25,000 → 0 Strips)**

| Method / case  | 20,000 Strips<br>1,012,742 Frames | 15,000 Strips<br>755,860 Frames | 10,000 Strips<br>504,103 Frames | 5,000 Strips<br>251,203 Frames | 1,000 Strips<br>51,057 Frames | 0 Strips<br>0 Frames |
| -------------- | --------------------------------: | ------------------------------: | ------------------------------: | -----------------------------: | ----------------------------: | -------------------: |
| apply.random   |                            23,590 |                          24,577 |                          24,747 |                         25,548 |                        26,699 |               27,113 |
| insert.head    |                                 — |                               — |                               — |                              — |                             — |                    — |
| insert.random  |                            56,842 |                          60,169 |                          62,122 |                         64,352 |                        67,729 |               66,544 |
| insert.tail    |                                 — |                               — |                               — |                              — |                             — |                    — |
| remove.head    |                           599,335 |                         608,301 |                         612,534 |                        610,496 |                       616,048 |              619,160 |
| remove.random  |                            39,061 |                          42,171 |                          44,302 |                         46,760 |                        49,836 |               50,705 |
| remove.tail    |                           589,206 |                         569,250 |                         586,384 |                        590,360 |                       597,746 |              544,020 |
| replace.head   |                           426,651 |                         418,598 |                         340,182 |                        328,302 |                       336,654 |              266,001 |
| replace.random |                            38,942 |                          41,700 |                          43,712 |                         45,740 |                        48,621 |               48,149 |
| replace.tail   |                           211,473 |                         200,152 |                         196,495 |                        187,551 |                       187,320 |              167,910 |
| value.head     |                         2,083,773 |                       2,077,210 |                       2,049,168 |                      2,048,661 |                     2,105,594 |            2,136,609 |
| value.random   |                            43,055 |                          45,818 |                          48,018 |                         51,001 |                        54,358 |               55,608 |
| value.tail     |                         2,482,622 |                       2,423,032 |                       2,388,851 |                      2,417,826 |                     2,519,220 |            2,564,260 |

### API throughput at checkpoint

Checkpoint calls, in ops/s, averaged across runs.

**↑ Scale up (0 → 25,000 Strips)**

| Method                            | 1,000 Strips<br>50,871 Frames | 5,000 Strips<br>252,214 Frames | 10,000 Strips<br>504,871 Frames | 15,000 Strips<br>758,280 Frames | 20,000 Strips<br>1,010,749 Frames | 25,000 Strips<br>1,264,003 Frames |
| --------------------------------- | ----------------------------: | -----------------------------: | ------------------------------: | ------------------------------: | --------------------------------: | --------------------------------: |
| new Projection(actorID, sequence) |                         4,426 |                            957 |                             608 |                             419 |                               291 |                               244 |
| sequence()                        |                           512 |                            106 |                              56 |                              37 |                                26 |                                19 |
| values()                          |                           589 |                            245 |                              88 |                              55 |                                56 |                                36 |

**↓ Scale down (25,000 → 0 Strips)**

| Method                            | 20,000 Strips<br>1,012,742 Frames | 15,000 Strips<br>755,860 Frames | 10,000 Strips<br>504,103 Frames | 5,000 Strips<br>251,203 Frames | 1,000 Strips<br>51,057 Frames | 0 Strips<br>0 Frames |
| --------------------------------- | --------------------------------: | ------------------------------: | ------------------------------: | -----------------------------: | ----------------------------: | -------------------: |
| new Projection(actorID, sequence) |                               288 |                             417 |                             507 |                          1,262 |                         5,491 |               24,635 |
| sequence()                        |                                18 |                              15 |                              11 |                             13 |                            11 |                   10 |
| values()                          |                                50 |                              44 |                              78 |                            113 |                           219 |              142,331 |

### Sequence disk size at checkpoint

Complete exported Sequences, including Footage and acknowledgements. Sizes are in KiB.

**↑ Scale up (0 → 25,000 Strips)**

| Encoding           | 1,000 Strips<br>50,871 Frames | 5,000 Strips<br>252,214 Frames | 10,000 Strips<br>504,871 Frames | 15,000 Strips<br>758,280 Frames | 20,000 Strips<br>1,010,749 Frames | 25,000 Strips<br>1,264,003 Frames |
| ------------------ | ----------------------------: | -----------------------------: | ------------------------------: | ------------------------------: | --------------------------------: | --------------------------------: |
| JSON               |                        277.28 |                       1,622.15 |                        3,262.70 |                        4,902.58 |                          7,043.25 |                          9,165.30 |
| JSON + gzip        |                         14.59 |                          73.83 |                          150.34 |                          226.82 |                            311.04 |                            391.49 |
| MessagePack        |                        164.81 |                         818.88 |                        1,639.69 |                        3,529.41 |                          5,081.04 |                          6,483.22 |
| MessagePack + gzip |                         12.38 |                          61.62 |                          124.91 |                          198.59 |                            263.54 |                            332.77 |

**↓ Scale down (25,000 → 0 Strips)**

| Encoding           | 20,000 Strips<br>1,012,742 Frames | 15,000 Strips<br>755,860 Frames | 10,000 Strips<br>504,103 Frames | 5,000 Strips<br>251,203 Frames | 1,000 Strips<br>51,057 Frames | 0 Strips<br>0 Frames |
| ------------------ | --------------------------------: | ------------------------------: | ------------------------------: | -----------------------------: | ----------------------------: | -------------------: |
| JSON               |                          7,449.23 |                        5,619.66 |                        3,771.33 |                       1,886.28 |                        383.39 |                 0.02 |
| JSON + gzip        |                            323.06 |                          244.33 |                          163.87 |                          80.60 |                         16.34 |                 0.03 |
| MessagePack        |                          5,237.17 |                        3,930.33 |                        2,628.38 |                       1,312.43 |                        266.67 |                 0.01 |
| MessagePack + gzip |                            274.96 |                          207.78 |                          137.38 |                          67.41 |                         13.67 |                 0.03 |

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

Measured on Node 24.21.0, V8 13.6.233.17-node.53,
linux x64, AMD EPYC 7763 64-Core Processor.
Peer synchronization, encoding and JS process garbage collection are outside API timings.
[Full lifecycle results](benchmark/.results/lifecycle.md) · [Throughput results](benchmark/.results/throughput.md).

## Tests

### Behaviour guaranteed by excessive tests

The latest verification passed 221 Vitest tests and 104 compatibility checks (1 failed).
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
