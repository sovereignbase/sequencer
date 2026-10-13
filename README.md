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

### See documentation

- [Typescript](https://sovereignbase.dev/sequencer/)
- [C++](https://sovereignbase.dev/sequencer/c++)

## Benchmarks

### Moderate bundle size

| Format   | Raw (KiB) | Minified (KiB) | Minified + gzip (KiB) |
| -------- | --------: | -------------: | --------------------: |
| ESM      |    123.24 |          99.79 |                 35.96 |
| CommonJS |    123.38 |         100.61 |                 36.17 |

Both bundles include WASM. Terser uses three compression passes; gzip uses level 9.

### Average throughput during editing from 0 to checkpoint

Arithmetic means of 3 runs during growth, in ops/s. Checkpoints
are visible Strip counts; generated Strips contain 1–100 Frames.

| Method / case  |     1,000 |     5,000 |    10,000 |    15,000 |    20,000 |    25,000 |
| -------------- | --------: | --------: | --------: | --------: | --------: | --------: |
| apply.random   |   145,900 |    79,387 |    47,925 |    33,976 |    25,896 |    19,884 |
| insert.head    | 1,052,146 | 1,197,396 | 1,152,874 | 1,128,474 | 1,077,498 | 1,032,497 |
| insert.random  |   523,818 |   235,233 |   127,276 |    88,122 |    65,638 |    49,502 |
| insert.tail    | 1,422,144 | 1,504,970 | 1,426,703 | 1,358,933 | 1,311,540 | 1,245,953 |
| remove.head    |         — |         — |         — |         — |         — |         — |
| remove.random  |   308,975 |   149,467 |    87,843 |    62,319 |    46,469 |    34,917 |
| remove.tail    |         — |         — |         — |         — |         — |         — |
| replace.head   |   431,740 |   413,895 |   407,298 |   362,795 |   362,934 |   338,091 |
| replace.random |   277,578 |   141,801 |    85,428 |    61,094 |    46,504 |    35,305 |
| replace.tail   |   428,221 |   469,082 |   447,541 |   434,501 |   360,466 |   348,059 |
| value.head     | 2,753,892 | 2,961,546 | 2,880,016 | 2,821,845 | 2,825,855 | 2,745,345 |
| value.random   |   638,771 |   203,903 |   104,236 |    69,467 |    51,141 |    37,704 |
| value.tail     | 5,396,266 | 4,633,949 | 4,258,285 | 4,024,233 | 3,852,143 | 3,614,923 |

### API throughput at checkpoint

Checkpoint calls, in ops/s, averaged across runs.

| Method                            | 1,000 | 5,000 | 10,000 | 15,000 | 20,000 | 25,000 |
| --------------------------------- | ----: | ----: | -----: | -----: | -----: | -----: |
| new Projection(actorID, sequence) | 3,260 |   806 |    415 |    272 |    199 |    147 |
| sequence()                        |   576 |    89 |     38 |     22 |     15 |      9 |
| values()                          |   712 |   163 |    110 |     81 |     60 |     38 |

### Sequence disk size at checkpoint

Complete exported Sequences, including Footage and acknowledgements. Sizes are in KiB.

| Encoding           |  1,000 |   5,000 |  10,000 |  15,000 |  20,000 |  25,000 |
| ------------------ | -----: | ------: | ------: | ------: | ------: | ------: |
| JSON               | 277.28 | 1622.17 | 3262.71 | 4902.58 | 7043.23 | 9165.29 |
| JSON + gzip        |  14.59 |   73.81 |  150.31 |  226.79 |  310.97 |  391.41 |
| MessagePack        | 164.58 |  817.78 | 1637.41 | 3526.01 | 5076.46 | 6477.56 |
| MessagePack + gzip |  12.38 |   61.60 |  124.87 |  198.51 |  263.46 |  332.76 |

### Memory usage at checkpoint

| Measurement              |     1,000 |     5,000 |    10,000 |    15,000 |    20,000 |    25,000 |
| ------------------------ | --------: | --------: | --------: | --------: | --------: | --------: |
| Visible Frames           |    50,871 |   252,214 |   504,871 |   758,280 | 1,010,749 | 1,264,003 |
| Local edit calls         |     6,000 |    30,000 |    60,000 |    90,000 |   120,000 |   150,000 |
| Estimated Sequence (KiB) |    418.62 |   2074.46 |   4153.16 |   6237.60 |   8313.67 |  10396.46 |
| Process heap used (KiB)  |  14309.77 |  35368.21 |  61813.08 |  88103.01 | 114616.55 | 140184.66 |
| Process RSS (KiB)        | 548537.33 | 578304.00 | 620449.33 | 642669.33 | 656937.33 | 684636.00 |

Sequence memory estimates use four bytes per metadata word and eight per Footage slot.
Process memory includes both peers and the benchmark fixtures.

Measured on Node 24.16.0, V8 13.6.233.17-node.49,
win32 x64, Intel(R) Core(TM) i5-10210U CPU @ 1.60GHz.
Peer synchronization, encoding and garbage collection are outside API timings. [Full lifecycle results](benchmark/.results/lifecycle.md).

## Tests

### Behaviour guaranteed by excessive tests

The latest verification passed 170 Vitest tests and 88 compatibility checks (1 failed).
The configured 100% coverage threshold remains unmet (95.66% statements, 94.94% branches, 100% functions, 97.23% lines).
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
