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

### Average throughput during editing to checkpoint

Arithmetic means of 3 runs, in ops/s, from each phase's start to checkpoint.
Checkpoints are visible Strip counts; generated Strips contain 1–100 Frames.

**↑ Scale up (0 → 25,000 Strips)**

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

**↓ Scale down (25,000 → 0 Strips)**

| Method / case  |    20,000 |    15,000 |    10,000 |     5,000 |     1,000 |         0 |
| -------------- | --------: | --------: | --------: | --------: | --------: | --------: |
| apply.random   |    10,396 |    11,190 |    11,706 |    12,237 |    12,733 |    12,950 |
| insert.head    |         — |         — |         — |         — |         — |         — |
| insert.random  |    24,380 |    26,601 |    28,011 |    28,899 |    30,046 |    30,648 |
| insert.tail    |         — |         — |         — |         — |         — |         — |
| remove.head    |   236,742 |   263,535 |   276,625 |   285,910 |   291,791 |   294,476 |
| remove.random  |    18,252 |    20,102 |    21,532 |    22,667 |    23,697 |    24,155 |
| remove.tail    |   298,382 |   272,890 |   285,529 |   294,882 |   300,730 |   303,078 |
| replace.head   |   278,819 |   259,599 |   266,034 |   261,668 |   253,696 |   232,680 |
| replace.random |    18,958 |    20,732 |    22,004 |    22,973 |    23,920 |    24,377 |
| replace.tail   |   277,603 |   274,845 |   277,748 |   259,785 |   261,730 |   262,411 |
| value.head     | 1,299,875 | 1,369,050 | 1,399,347 | 1,442,090 | 1,490,280 | 1,510,644 |
| value.random   |    19,979 |    22,286 |    23,917 |    25,426 |    26,701 |    27,274 |
| value.tail     | 1,413,583 | 1,461,501 | 1,482,908 | 1,536,058 | 1,597,427 | 1,622,952 |

### API throughput at checkpoint

Checkpoint calls, in ops/s, averaged across runs.

**↑ Scale up (0 → 25,000 Strips)**

| Method                            | 1,000 | 5,000 | 10,000 | 15,000 | 20,000 | 25,000 |
| --------------------------------- | ----: | ----: | -----: | -----: | -----: | -----: |
| new Projection(actorID, sequence) | 3,260 |   806 |    415 |    272 |    199 |    147 |
| sequence()                        |   576 |    89 |     38 |     22 |     15 |      9 |
| values()                          |   712 |   163 |    110 |     81 |     60 |     38 |

**↓ Scale down (25,000 → 0 Strips)**

| Method                            | 20,000 | 15,000 | 10,000 | 5,000 | 1,000 |       0 |
| --------------------------------- | -----: | -----: | -----: | ----: | ----: | ------: |
| new Projection(actorID, sequence) |    178 |    242 |    353 |   570 | 2,815 |  31,261 |
| sequence()                        |      9 |      8 |      6 |     5 |     5 |  67,398 |
| values()                          |     54 |     62 |     76 |   111 |   256 | 121,361 |

### Sequence disk size at checkpoint

Complete exported Sequences, including Footage and acknowledgements. Sizes are in KiB.

**↑ Scale up (0 → 25,000 Strips)**

| Encoding           |  1,000 |    5,000 |   10,000 |   15,000 |   20,000 |   25,000 |
| ------------------ | -----: | -------: | -------: | -------: | -------: | -------: |
| JSON               | 277.28 | 1,622.17 | 3,262.71 | 4,902.58 | 7,043.23 | 9,165.29 |
| JSON + gzip        |  14.59 |    73.81 |   150.31 |   226.79 |   310.97 |   391.41 |
| MessagePack        | 164.58 |   817.78 | 1,637.41 | 3,526.01 | 5,076.46 | 6,477.56 |
| MessagePack + gzip |  12.38 |    61.60 |   124.87 |   198.51 |   263.46 |   332.76 |

**↓ Scale down (25,000 → 0 Strips)**

| Encoding           |   20,000 |   15,000 |   10,000 |    5,000 |  1,000 |    0 |
| ------------------ | -------: | -------: | -------: | -------: | -----: | ---: |
| JSON               | 7,449.24 | 5,619.69 | 3,771.40 | 1,886.30 | 383.40 | 0.02 |
| JSON + gzip        |   323.00 |   244.28 |   163.86 |    80.66 |  16.35 | 0.03 |
| MessagePack        | 5,231.75 | 3,926.13 | 2,625.64 | 1,311.05 | 266.40 | 0.01 |
| MessagePack + gzip |   274.90 |   207.71 |   137.37 |    67.39 |  13.67 | 0.03 |

### Memory usage at checkpoint

Estimated retained Sequence memory, in KiB (1,024 bytes).

**↑ Scale up (0 → 25,000 Strips)**

| Measurement            |  1,000 |    5,000 |   10,000 |   15,000 |   20,000 |    25,000 |
| ---------------------- | -----: | -------: | -------: | -------: | -------: | --------: |
| Estimated memory (KiB) | 418.62 | 2,074.46 | 4,153.16 | 6,237.60 | 8,313.67 | 10,396.46 |

**↓ Scale down (25,000 → 0 Strips)**

| Measurement            |   20,000 |   15,000 |   10,000 |    5,000 |  1,000 |    0 |
| ---------------------- | -------: | -------: | -------: | -------: | -----: | ---: |
| Estimated memory (KiB) | 8,354.76 | 6,242.44 | 4,163.23 | 2,074.77 | 421.52 | 0.02 |

Measured on Node 24.16.0, V8 13.6.233.17-node.49,
win32 x64, Intel(R) Core(TM) i5-10210U CPU @ 1.60GHz.
Peer synchronization, encoding and JS process garbage collection are outside API timings.
[Full lifecycle results](benchmark/.results/lifecycle.md) · [Throughput results](benchmark/.results/throughput.md).

## Tests

### Behaviour guaranteed by excessive tests

The latest verification passed 175 Vitest tests and 88 compatibility checks (1 failed).
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
