# Rejected: synchronous inline Wasm gzip

The experiment gzipped Wasm before base64 encoding and bundled fflate 0.8.3's
synchronous gzip decoder. Both ESM and CommonJS initialized synchronously; the
decoder and its lookup tables were scoped to the shared runtime's one-time
initialization. No external runtime import was needed.

Decision: **rejected**. The smaller JavaScript source did not provide a useful
compressed-transfer saving. Brotli transfer and cold initialization became worse.
The build changes, experimental tests and direct fflate devDependency were removed.

## Complete bundle sizes

KiB, including the decoder. Terser uses three compression passes; outer gzip uses
level 9 and Brotli uses Node's default settings.

| Format   | Measurement       | Existing | gzip + base64 |
| -------- | ----------------- | -------: | ------------: |
| ESM      | Raw               |   156.08 |         90.91 |
| ESM      | Minified          |   127.48 |         65.45 |
| ESM      | Minified + gzip   |    45.19 |         45.13 |
| ESM      | Minified + Brotli |    36.89 |         43.27 |
| CommonJS | Raw               |   156.22 |         91.05 |
| CommonJS | Minified          |   128.51 |         66.49 |
| CommonJS | Minified + gzip   |    45.27 |         45.21 |
| CommonJS | Minified + Brotli |    36.95 |         43.33 |

Minification saved 63,513 bytes in either format. Outer gzip saved only 57 ESM
bytes and 62 CommonJS bytes; Brotli grew by 6,540 and 6,531 bytes respectively.
The raw Wasm remained 95,831 bytes; its gzip payload was 38,502 bytes before
base64 encoding. No algorithm or Wasm compilation flags changed.

## Cold initialization

Median milliseconds, with IQR in parentheses. Unminified ESM bundles, alternating
variant order, 30 fresh Node processes and 10 fresh Chromium browsers per variant.

| Measurement                                          |       Existing |  gzip + base64 |
| ---------------------------------------------------- | -------------: | -------------: |
| Node: JS parsing and initial compilation             |  1.916 (0.221) |  1.431 (0.090) |
| Node: evaluation through initialization              |  3.662 (0.340) | 10.571 (0.901) |
| Node: parsing, linking and initialization            |  5.789 (0.446) | 12.296 (0.863) |
| Chromium: local module import through initialization | 15.250 (7.800) | 20.600 (3.525) |

Node uses `vm.SourceTextModule` in a fresh context. Its evaluation includes lazy
compilation, decoding, decompression and Wasm compilation/instantiation. Chromium
imports an in-memory Blob module. Source preparation, process/browser launch,
network transfer and the subsequent public-API checks are outside the timings.
Browser distributions overlap; no significance claim is made for that difference.

Node parsing improved by about 0.49 ms, but complete initialization took about
6.51 ms longer. Wasm compilation medians were effectively unchanged:
0.821 ms before and 0.816 ms after. The extra work was in JavaScript initialization
and decoding. SIMD and runtime traversal changes were outside this experiment.

Node and Chromium create/edit smoke checks passed. The attempt was rejected
before completing full candidate verification; no new compatibility or coverage
result is claimed. Existing runtime code and test expectations were restored.

## Measurement context

Baseline: `aca1417` (runtime/build changes from `bff2484`). Node 24.16.0,
V8 13.6.233.17-node.49, Windows x64, Intel Core i5-10210U @ 1.60 GHz;
Emscripten 7.0.0. The preceding
[asynchronous gzip experiment](../optimizations_2026_11_09/wasm_gzip.md) measured
a different decoder and must not be treated as this implementation's result.

Local reproduction scripts, frozen bundles and raw observations remain under
`temp/esm_wasm_gzip/`: `startup.mjs`, `startup-child.mjs`, `startup.json`,
`sizes.json` and `rejected-inline-wasm.ts`. Important results are retained above;
the production build keeps its existing uncompressed embedded Wasm.
