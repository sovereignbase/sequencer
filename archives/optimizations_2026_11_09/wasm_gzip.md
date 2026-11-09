# Inline WASM gzip — 9 November 2026

Exploratory measurement; packaging decision deferred.

Compared the current embedded binary string with WASM compressed by bytecodec
before base64 encoding. ESM bundle sizes include the bundled bytecodec decoders.
Terser uses three passes; outer gzip uses level 9.

| Bundle (KiB)    | Current | gzip → base64 | Reduction |
| --------------- | ------: | ------------: | --------: |
| Raw             |  158.92 |         88.19 |     44.5% |
| Minified        |  129.47 |         64.25 |     50.4% |
| Minified + gzip |   46.18 |         44.37 |      3.9% |

The gzip-compressed transfer saves only 1.81 KiB: outer gzip already compresses
the existing representation effectively.

Warm base64 decoding plus gzip decompression had a 0.89 ms median on Node 24.16.0
(50 samples after 10 warmup calls), excluding WASM compilation and instantiation.
Bytecodec requires asynchronous initialization; synchronous CommonJS loading
would need a separate solution. Create, edit and snapshot restoration checks
passed in Node and Chromium.

## Cold parsing and initialization

Medians in milliseconds, alternating variant order. Each sample starts a fresh
Node process (30 per variant) or Chromium browser (20 per variant), avoiding
cross-sample JavaScript and WASM compilation caches.

| Measurement                                          | Current | gzip → base64 |
| ---------------------------------------------------- | ------: | ------------: |
| Node: JS parsing and initial compilation             |    1.67 |          1.07 |
| Node: evaluation through initialization              |    4.22 |          9.21 |
| Node: compilation, linking and initialization        |    6.11 |         10.47 |
| Chromium: local module import through initialization |   12.95 |         11.60 |

Node uses `vm.SourceTextModule`: construction measures parsing and initial
bytecode compilation; evaluation includes lazy compilation, payload decoding,
WASM compilation/instantiation and asynchronous waits. The gzip path also loads
Node built-ins on first use. Chromium imports an in-memory Blob module without
tracing. Source preparation, process/browser launch and API checks are untimed;
network transfer is excluded. These measure module readiness, before the first
Projection operation.

The smaller source saves about 0.60 ms in Node's initial JS compilation, but cold
Node initialization takes about 4.36 ms longer overall. Chromium's median import
is 1.35 ms faster in this run; samples overlap substantially (current 11.0–17.3 ms,
gzip 9.9–16.2 ms). This does not establish a startup improvement across runtimes.

Measured on Node 24.16.0 / V8 13.6.233.17-node.49 and Chromium 158.0.8127.18,
Windows x64, Intel Core i5-10210U @ 1.60 GHz. Packaging decision remains deferred.
