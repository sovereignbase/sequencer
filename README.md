# Sequencer

Sequencer provides a deterministic total ordering for distributed data. It allows independently operating replicas to make concurrent changes and later converge on the same state without relying on network arrival order or perfectly synchronized clocks.

## Usage

### Simple typed API

```ts
import { Projection } from '@sovereignbase/sequencer'

const projection = new Projection<string>(1)
const gossip = projection.insert(['Hello World'], 0)
console.log(projection.value(0)) // "Hello World"

projection.destroy()
```

## Benchmarks

### Exceptional performance

The [benchmark documentation](benchmark/README.md) describes both the dynamic
lifecycle workload and API throughput bursts. Full results are available for
[lifecycle](benchmark/.results/lifecycle.md) and
[throughput](benchmark/.results/throughput.md).

Latest throughput results, measured on 12 October 2026. Latencies are in µs per
public API call, weighted by call count across five runs.

| Operation                           | 100 initial insertions | 1,000 initial insertions | 10,000 initial insertions |
| ----------------------------------- | ---------------------: | -----------------------: | ------------------------: |
| `new Projection(actorID, sequence)` |                  1.732 |                    1.725 |                     1.648 |
| `insert`, random position           |                  1.043 |                    1.036 |                     1.081 |
| `remove`, middle                    |                  1.091 |                    1.269 |                     1.433 |
| `replace`, middle                   |                  1.145 |                    1.369 |                     1.430 |
| `sequence()`                        |                  0.353 |                    0.390 |                     0.363 |
| `value`, random position            |                  0.065 |                    0.053 |                     0.115 |
| `values()`                          |                  4.352 |                  147.965 |                  1156.844 |

Environment: Node 24.16.0, V8 13.6.233.17-node.49, Windows x64, Intel Core
i5-10210U. Generated Strip lengths are 1–100 Frames. Each case warms up for
64 calls, then measures a burst of approximately 100 ms or at most 10,000 calls.

## Memory efficiency

Retained-memory comparison for eight Projections, each containing 6,000
single-Frame insertions. These are five-run medians from isolated Node processes:

| Measurement                 | Before extension coalescing |  Current |
| --------------------------- | --------------------------: | -------: |
| Additional JS heap after GC |                    2.038 MB | 0.520 MB |
| Shared WASM memory capacity |                    7.406 MB | 1.049 MB |

Module import and a small warm-up are excluded from the heap delta. WASM
capacity includes the initial 1 MiB allocation. These are not process RSS or
per-Projection total memory. Measurements and complete before/after results are
retained in [the optimization report](archives/optimizations_12_10_2026/flat_sequence/README.md).

### Moderate bundle size

| Format   |      Raw | Minified | Minified + gzip |
| -------- | -------: | -------: | --------------: |
| ESM      | 117.9 kB |  99.7 kB |         36.4 kB |
| CommonJS | 118.0 kB | 100.6 kB |         36.6 kB |

Both bundles include the WASM module. Minified sizes use Terser with three
compression passes; source maps and type declarations are excluded. kB and MB
use decimal units.

### Compact data model

An insertion contains six uint32 structural words: 24 bytes before transport
framing or content. Numeric metadata accepts `Uint32Array` and JSON numeric
arrays. Generic content, called Footage, stays in JavaScript; only numeric
metadata enters WASM.

`sequence()` returns `[words, footage]`: one numeric array and one content
array, with no nested insertion or acknowledgement arrays. `words[0]` locates
the first six-word insertion record; preceding acknowledgements are length
prefixed. Positive insertion lengths identify successive spans of `footage`.
An empty Sequence is `[[], []]`. Construction and `merge()` accept numeric
arrays or `Uint32Array` metadata; exported numeric arrays can be sent as JSON.

```ts
const retained = projection.sequence()
const restored = new Projection<string>(2, retained)
```

Consecutive local insertions extend an intact insertion from the same Session
without reserving another zero in its logical clock. Gossip contains only the
new suffix, still using six structural words. A removal or fragmentation ends
the local extension chain. Retained snapshots remain unchanged by later edits.

Measured JSON transport sizes for 1,000 one-Frame insertions containing `'x'`,
their removal Gossip, and a snapshot captured before removal:

| Workload                                       | Average bytes per operation or insertion |    JSON | JSON + gzip | gzip reduction |
| ---------------------------------------------- | ---------------------------------------: | ------: | ----------: | -------------: |
| 1,000 one-frame insertions                     |                                   44.8 B | 45.8 kB |      5.1 kB |          88.9% |
| 1,000 one-frame removals                       |                                   67.8 B | 68.8 kB |      7.7 kB |          88.9% |
| Snapshot containing 1,000 one-frame insertions |                                    4.0 B |  4.0 kB |      0.1 kB |          98.3% |

Gossip sizes include acknowledgements and content where present. Delta averages
measure individual Gossip packets; batch totals include their enclosing array.
Snapshot averages divide the complete Sequence size by the 1,000 authored insertions. Consecutive insertions are retained as one insertion.
Sizes vary with Session IDs and content.

## Tests

### Behaviour guaranteed by excessive tests

`npm test` rebuilds the native WebAssembly module and TypeScript package,
typechecks tests, runs unit, convergence, integration and generative stress suites
with V8 coverage, then runs runtime and browser compatibility checks.

The latest verification passed 167 Vitest tests and 88 compatibility checks.
Convergence tests include 1,024 generated editing histories for each compaction
mode. See the [test suites](test/README.md) and
[automated test report](https://sovereignbase.dev/sequencer/tests/).

### Works everywhere where JavaScript and Wasm works

Runtimes covered by the latest compatibility verification:

- Node.js, ESM and CommonJS
- Deno
- Bun
- Edge Runtime
- Cloudflare Workers through workerd
- Chromium and WebKit browser windows

Firefox is also in the compatibility matrix; its matching Playwright browser
binary was unavailable in the latest run.

### Tested realtime and offline text editing behaviour examples

- [Online and offline editors](test/convergence/delivery/offline_realtime_editing/README.md): six editors converge through delayed, reversed and shuffled delivery, including offline changes arriving during online editing.
- [Concurrent replacements](test/convergence/delivery/concurrent_replacement_delivery/README.md): independent replacement histories retain the same surviving content across delivery orders.
- [Restart and redelivery](test/convergence/persistence/restart_redelivery/README.md): stored Sequences preserve visible content through hydration, duplicate delivery and further edits.
- [Peer-to-peer fanout](test/integration/fanout_peer_to_peer/README.md): independently editing browser peers synchronize through BroadcastChannel.
- [WebSocket fanout](test/integration/fanout_websocket/README.md): three browser peers converge through a stateless JSON Gossip relay.

## Credits

None of this could have been done without years of work from many great engineers of many great projects, to mention a few:

- AUTOMERGE

- YJS

- DIAMOND TYPES

## License

Apache-2.0
