# Sequencer

Sequencer provides a deterministic total ordering for distributed data. It allows independently operating replicas to make concurrent changes and later converge on the same state without relying on network arrival order or perfectly synchronized clocks.

## Usage

### Simple typed api

```ts
import * as sequencer from '@sovereignbase/sequencer'

const sequence = sequencer.__create(/*optional stored snapshot*/)
const { reel, change } = sequencer.__update(sequence, 0, 'Hello World', 'after')
console.log(sequencer.__read(sequence, 0)) // "Hello World"
```

## Benchmarks

### Exceptional performance

/// Summary and canonical live link to in detail benchmark readme

/// Auto inserted benchmark result and environment details.

## Memory effiency

|heap usage .... what ever is professional/smart

### Moderate bundle size

| format   |     raw | minified | minified + gzip |
| -------- | ------: | -------: | --------------: |
| ESM      | 91.3 kB |  53.8 kB |         19.0 kB |
| CommonJS | 91.6 kB |  56.3 kB |         19.3 kB |

### Compact data model

Average delta size and average replica/snapshot size

| Delta workload                             | average bytes per operation | MessagePack | MessagePack + gzip | gzip reduction |
| ------------------------------------------ | --------------------------: | ----------: | -----------------: | -------------: |
| 1,000 one-frame updates                    |                      39.6 B |     39.6 kB |             7.8 kB |          80.2% |
| 1,000 one-frame masks                      |                      36.0 B |     36.0 kB |             5.1 kB |          85.9% |
| Snapshot containing 1,000 one-frame strips |                      39.6 B |     39.6 kB |             7.8 kB |          80.2% |

## Tests

### Behaviour guaranteed by excessive tests

Every `npm test` run rebuilds the native WebAssembly module and verifies unit
behaviour, deterministic convergence, generative "stress" scenarios, V8 coverage,
the supported runtime matrix, desktop browsers, mobile browser emulations, and
module Web Workers. Every stage has a hard timeout, and all detailed evidence is
written to the [automated test report](https://sovereignbase.dev/sequencer/tests/).

### Works everywhere where JavaScript and Wasm works

Runtimes with tested support:

- Node.js
- Deno
- Bun
- Edge Runtime
- Cloudflare Workers through workerd
- Browser Window and Web Worker contexts
- Chromium, Firefox, and WebKit
- Mobile Chrome and Mobile Safari device profiles

### Tested realtime and offline text editing behaviour examples

## Credits

None of this could have been done without years of work from many great engineers of many great projects, to mention a few:

- AUTOMERGE

- YJS

- DIAMOND TYPES

## License

Apache-2.0
