[![npm version](https://img.shields.io/npm/v/@sovereignbase/sequencer)](https://www.npmjs.com/package/@sovereignbase/sequencer)
[![JSR](https://jsr.io/badges/@sovereignbase/sequencer)](https://jsr.io/@sovereignbase/sequencer)
[![CI](https://github.com/sovereignbase/sequencer/actions/workflows/ci.yaml/badge.svg?branch=master)](https://github.com/sovereignbase/sequencer/actions/workflows/ci.yaml)
[![codecov](https://codecov.io/gh/sovereignbase/sequencer/branch/master/graph/badge.svg)](https://codecov.io/gh/sovereignbase/sequencer)
[![license](https://img.shields.io/npm/l/@sovereignbase/sequencer)](LICENSE)

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
| ESM      |    123.83 |         100.04 |                 36.07 |
| CommonJS |    123.94 |         100.86 |                 36.28 |

Both bundles include WASM. Terser uses three compression passes; gzip uses level 9.

### Average throughput during editing to checkpoint

Arithmetic means of 3 runs, in ops/s, from each phase's start to checkpoint.
Checkpoints are visible Strip counts; generated Strips contain 1–100 Frames.

**↑ Scale up (0 → 25,000 Strips)**

| Method / case  |     1,000 |     5,000 |    10,000 |    15,000 |    20,000 |    25,000 |
| -------------- | --------: | --------: | --------: | --------: | --------: | --------: |
| apply.random   |   134,077 |    62,305 |    34,070 |    25,775 |    19,542 |    14,395 |
| insert.head    |   923,095 |   775,870 |   757,741 |   773,234 |   755,582 |   695,855 |
| insert.random  |   373,408 |   175,874 |    90,608 |    65,124 |    48,043 |    34,727 |
| insert.tail    | 1,039,842 |   900,165 |   905,536 |   923,371 |   905,146 |   815,951 |
| remove.head    |         — |         — |         — |         — |         — |         — |
| remove.random  |   258,452 |   120,385 |    63,768 |    46,896 |    34,293 |    24,619 |
| remove.tail    |         — |         — |         — |         — |         — |         — |
| replace.head   |   353,814 |   299,428 |   285,298 |   281,987 |   266,457 |   245,768 |
| replace.random |   210,597 |   113,862 |    64,762 |    47,706 |    35,380 |    25,336 |
| replace.tail   |   343,505 |   297,809 |   256,581 |   268,617 |   261,089 |   237,516 |
| value.head     | 1,849,070 | 2,277,995 | 2,099,195 | 2,090,242 | 2,013,711 | 1,813,861 |
| value.random   |   520,444 |   167,111 |    76,136 |    52,572 |    37,531 |    26,266 |
| value.tail     | 4,359,245 | 4,070,625 | 3,539,176 | 3,401,050 | 3,235,924 | 2,866,881 |

**↓ Scale down (25,000 → 0 Strips)**

| Method / case  |    20,000 |    15,000 |    10,000 |     5,000 |     1,000 |         0 |
| -------------- | --------: | --------: | --------: | --------: | --------: | --------: |
| apply.random   |     8,907 |     8,749 |     8,844 |     9,418 |     9,784 |     9,964 |
| insert.head    |         — |         — |         — |         — |         — |         — |
| insert.random  |    20,232 |    20,112 |    20,479 |    21,669 |    22,621 |    23,139 |
| insert.tail    |         — |         — |         — |         — |         — |         — |
| remove.head    |   241,069 |   229,494 |   224,694 |   230,808 |   234,160 |   236,802 |
| remove.random  |    14,891 |    15,310 |    15,866 |    17,104 |    17,922 |    18,322 |
| remove.tail    |   206,647 |   211,505 |   183,633 |   198,583 |   206,910 |   209,608 |
| replace.head   |   213,064 |   192,451 |   194,530 |   190,944 |   193,991 |   171,701 |
| replace.random |    15,664 |    15,819 |    16,350 |    17,435 |    18,217 |    18,619 |
| replace.tail   |   239,518 |   220,291 |   216,166 |   203,859 |   206,157 |   207,610 |
| value.head     | 1,053,908 |   961,024 |   964,913 | 1,007,215 | 1,036,494 | 1,052,262 |
| value.random   |    16,380 |    16,664 |    17,313 |    18,761 |    19,640 |    20,116 |
| value.tail     | 1,320,836 | 1,258,018 | 1,247,029 | 1,301,383 | 1,348,990 | 1,372,729 |

### API throughput at checkpoint

Checkpoint calls, in ops/s, averaged across runs.

**↑ Scale up (0 → 25,000 Strips)**

| Method                            | 1,000 | 5,000 | 10,000 | 15,000 | 20,000 | 25,000 |
| --------------------------------- | ----: | ----: | -----: | -----: | -----: | -----: |
| new Projection(actorID, sequence) | 3,353 |   814 |    346 |    253 |    180 |    137 |
| sequence()                        |   521 |    86 |     28 |     21 |     12 |      9 |
| values()                          |   675 |   177 |     86 |     77 |     50 |     45 |

**↓ Scale down (25,000 → 0 Strips)**

| Method                            | 20,000 | 15,000 | 10,000 | 5,000 | 1,000 |       0 |
| --------------------------------- | -----: | -----: | -----: | ----: | ----: | ------: |
| new Projection(actorID, sequence) |    186 |    227 |    321 |   686 | 2,354 |  25,239 |
| sequence()                        |      9 |      6 |      5 |     5 |     4 |  56,765 |
| values()                          |     54 |     40 |     68 |    91 |   258 | 105,551 |

### Sequence disk size at checkpoint

Complete exported Sequences, including Footage and acknowledgements. Sizes are in KiB.

**↑ Scale up (0 → 25,000 Strips)**

| Encoding           |  1,000 |    5,000 |   10,000 |   15,000 |   20,000 |   25,000 |
| ------------------ | -----: | -------: | -------: | -------: | -------: | -------: |
| JSON               | 277.52 | 1,623.28 | 3,264.99 | 4,905.95 | 7,047.84 | 9,170.93 |
| JSON + gzip        |  14.60 |    73.84 |   150.37 |   226.86 |   311.12 |   391.56 |
| MessagePack        | 164.81 |   818.88 | 1,639.69 | 3,529.41 | 5,081.04 | 6,483.22 |
| MessagePack + gzip |  12.38 |    61.62 |   124.91 |   198.59 |   263.54 |   332.77 |

**↓ Scale down (25,000 → 0 Strips)**

| Encoding           |   20,000 |   15,000 |   10,000 |    5,000 |  1,000 |    0 |
| ------------------ | -------: | -------: | -------: | -------: | -----: | ---: |
| JSON               | 7,454.61 | 5,623.91 | 3,774.10 | 1,887.69 | 383.66 | 0.02 |
| JSON + gzip        |   323.10 |   244.38 |   163.87 |    80.66 |  16.35 | 0.03 |
| MessagePack        | 5,237.17 | 3,930.33 | 2,628.38 | 1,312.43 | 266.67 | 0.01 |
| MessagePack + gzip |   274.96 |   207.78 |   137.38 |    67.40 |  13.67 | 0.03 |

### Memory usage at checkpoint

One instance: WASM memory plus retained JS array slots, in KiB (1,024 bytes).

**↑ Scale up (0 → 25,000 Strips)**

| Measurement            |    1,000 |     5,000 |    10,000 |    15,000 |    20,000 |     25,000 |
| ---------------------- | -------: | --------: | --------: | --------: | --------: | ---------: |
| Estimated memory (KiB) | 5,343.67 | 25,100.58 | 50,470.89 | 82,701.27 | 98,036.35 | 153,462.93 |

**↓ Scale down (25,000 → 0 Strips)**

| Measurement            |     20,000 |     15,000 |     10,000 |      5,000 |      1,000 |          0 |
| ---------------------- | ---------: | ---------: | ---------: | ---------: | ---------: | ---------: |
| Estimated memory (KiB) | 163,746.93 | 174,034.00 | 202,660.72 | 293,941.85 | 302,158.29 | 304,203.30 |

Measured on Node 24.16.0, V8 13.6.233.17-node.49,
win32 x64, Intel(R) Core(TM) i5-10210U CPU @ 1.60GHz.
Peer synchronization, encoding and JS process garbage collection are outside API timings.
[Full lifecycle results](benchmark/.results/lifecycle.md) · [Throughput results](benchmark/.results/throughput.md).

## Tests

### Behaviour guaranteed by excessive tests

The latest verification passed 178 Vitest tests and 88 compatibility checks (1 failed).
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
