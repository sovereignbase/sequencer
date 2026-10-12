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
public API call, weighted by call count across three runs.

| Operation                           | 100 initial Strips | 1,000 initial Strips | 10,000 initial Strips |
| ----------------------------------- | -----------------: | -------------------: | --------------------: |
| `new Projection(actorID, sequence)` |             21.059 |              200.042 |             2,377.293 |
| `insert`, random position           |              1.069 |                1.507 |                 1.298 |
| `remove`, middle                    |              1.271 |                1.591 |                 1.867 |
| `replace`, middle                   |              0.945 |                0.908 |                 2.728 |
| `sequence()`                        |             17.829 |              237.192 |             2,704.320 |
| `value`, random position            |              0.192 |                0.238 |                 0.731 |
| `values()`                          |             27.018 |              390.403 |             4,450.865 |

Environment: Node 24.16.0, V8 13.6.233.17-node.49, Windows x64, Intel Core
i5-10210U. Generated Strip lengths are 1–100 Frames. Each case warms up for
64 calls, then measures a burst of approximately 100 ms or at most 10,000 calls.

## Memory efficiency

Additional retained memory for 10,000 insertions containing 500,000 Frames:

| Construction         |  JS heap | External memory, including WASM |    Total |
| -------------------- | -------: | ------------------------------: | -------: |
| First construction   | 5.073 MB |                        1.412 MB | 6.485 MB |
| After initialization | 4.604 MB |                        1.049 MB | 5.653 MB |

Values are medians of three separate process measurements after garbage
collection, using 50 numeric Frames per insertion. Module import is excluded. The second
row initializes an empty Projection before measuring. These are additional heap
and external allocations, not whole-process RSS. WASM starts with 1 MiB of memory
and grows as needed.

### Moderate bundle size

| Format   |      Raw | Minified | Minified + gzip |
| -------- | -------: | -------: | --------------: |
| ESM      | 109.8 kB |  93.9 kB |         34.6 kB |
| CommonJS | 110.0 kB |  94.9 kB |         34.8 kB |

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
| 1,000 one-frame insertions                     |                                   44.9 B | 45.9 kB |      5.1 kB |          88.8% |
| 1,000 one-frame removals                       |                                   65.3 B | 66.3 kB |      7.7 kB |          88.5% |
| Snapshot containing 1,000 one-frame insertions |                                   43.9 B | 43.9 kB |      5.2 kB |          88.0% |

Gossip sizes include acknowledgements and content where present. Delta averages
measure individual Gossip packets; batch totals include their enclosing array.
Snapshot averages divide the complete Sequence size by its insertion count.
Sizes vary with Session IDs and content.

## Tests

### Behaviour guaranteed by excessive tests

`npm test` rebuilds the native WebAssembly module and TypeScript package,
typechecks tests, runs unit, convergence, integration and generative stress suites
with V8 coverage, then runs runtime and browser compatibility checks.

The latest verification passed 151 Vitest tests and 88 compatibility checks.
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
