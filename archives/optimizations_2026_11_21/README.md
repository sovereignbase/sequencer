# Concurrent bulk text and range reads

Starting checkout: `9011b23`, Sequencer 1.2.7. The complete lifecycle,
throughput and tuple suites were measured three times before source changes.
Build flags, fixtures, benchmark sources and deterministic Session seeds are
held constant between builds. Local measurements use Node 24.16.0, V8
13.6.233.17-node.49, Windows x64, Intel Core i5-10210U.

## B2.1 workload

The updated external adapter already uses string Footage for edits, Splices,
reads and snapshot hydration. Character-array materialization is not its
current bottleneck. The supplied result is 10 ms at N = 6,000; the external
run uses Node 24.22.1 on an i7-1185G7. It is not a controlled comparison with
the local measurements below.

The workload seeds both replicas with 100 characters before timing. Inside
the timed interval it performs two 6,000-character prepends, their MessagePack
encoding, decoding and replay, and three complete text reads. Update delivery
is synchronous, so the second author has already received the first update.
The final visible text consists of three source spans, not 12,100 native nodes.

A local diagnostic reproduces those public API calls without modifying or
running the external benchmark suite. CPU sampling over 3,000 repetitions puts
the largest sample counts in MessagePack UTF-8 counting, buffer growth and
encoding. Instrumented mean phase times are:

| Phase                   | Mean µs |
| :---------------------- | ------: |
| Two local inserts       |    2.17 |
| Two update encodes      |   64.16 |
| Two update decodes      |   10.52 |
| Two remote applications |    5.09 |
| Three text reads        |    1.91 |
| Text equality assertion |    9.84 |

These phase diagnostics include sampling and instrumentation overhead. They
identify where time is spent; they are not benchmark acceptance results.
The warmed total median is 74.90 µs, with an interquartile range of
62.80–106.80 µs. Means of individual phases must not be added to that median.

One fresh-process sampled run takes 2.998 ms, including 1.114 ms encoding,
0.367 ms decoding, 0.424 ms local insertion, 0.287 ms application and 0.555 ms
reading. First-call costs remain significant. This does not establish that
encoding and decoding are the only cold-path costs, or that they alone explain
the external 10 ms result. No new cross-library ranking is claimed.

Five further matched fresh-process diagnostics compare normal Wasm lazy
compilation with Node's `--no-wasm-lazy-compilation` flag. The flag is a
diagnostic only: it moves native compilation into module initialization before
the timed calls. It is not enabled in the library or acceptance benchmarks.

| Cold-path diagnostic, median | Normal µs | Eager Wasm compilation µs |
| :--------------------------- | --------: | ------------------------: |
| Total                        |  3,370.40 |                  1,518.50 |
| Local inserts                |    539.00 |                     35.30 |
| Update encoding              |  1,322.90 |                    862.90 |
| Update decoding              |    252.30 |                    201.30 |
| Remote application           |    319.30 |                     63.10 |
| Text reads                   |    468.50 |                    188.60 |

Each row is its own median, not a decomposition of the total median. Native
first-use compilation materially affects the short workload; initialization
policy and CPU contention also affect the other phases. Encoding/decoding
dominate after native compilation, while first-call JS costs remain. Further
B2.1 algorithm changes are not justified by these profiles. This conclusion
does not apply to the large number of edits in B2.2–B2.4 or to all other API
benchmarks.

## Range-walk candidate

`find_frame` already resolves the first visible Frame to its positive fragment.
After that fragment has been consumed, each following fragment starts at its
own original offset. The candidate removes repeated offset carry/clamp work
and bounds the visible count once. Hidden fragments still remain in Structural
Order and are skipped when producing Footage spans.

The final Wasm changes only `runtime_values` among its 105 defined functions.
That function has 31 → 6 integer-64 operations and 231 → 237 integer-32
operations, with unchanged 48 loads and 24 stores. Its walk still depends on
the preceding link: no new SIMD or independent memory streams are claimed.
The linked module shrinks from 90,620 to 90,563 bytes. No retained instance
state, allocation layout or serialized format changes.

Verification passes all 303 existing tests with 100% TypeScript statement,
branch, function and line coverage.

## Decision: rejected

The [complete five-pair comparison](details.zip 'performance.md') contains 409 non-length
timing rows: 145 medians improve by more than 5%, while 126 slow by more than
5%. All 96 memory/storage rows remain equal. The range-read results are mixed:
5,000-Strip middle reads improve 21.55%, but 20,000-Strip middle reads slow
27.62%. Eight-slot tuple `values()` slows in every matched pair: 239.68 →
346.38 ns/call, +44.52% by the ratio of medians; the paired median is +41.92%
with a 5.23-percentage-point IQR.

Several other measurements have wide dispersion, including unrelated scalar
reads. These are not attributed conclusively to the source change. Nevertheless,
the candidate does not establish a reliable improvement without regressions.
The [candidate patch](details.zip 'range-walk.patch') is archived and completely reverted;
runtime source, distributed artifacts and tests retain their starting versions.
No optimization is retained from this pass. No further benchmark runs follow
the stop request.

## Reproduction

The frozen workspaces and raw outputs remain in
`temp/optimization_2026_11_21`. Baseline and candidate benchmark sources are
identical; the candidate changes only the native range walk.

```powershell
node temp/optimization_2026_11_21/full.mjs baseline 3 baseline
node temp/optimization_2026_11_21/bulk-profile.mjs baseline 3000 profile
node temp/optimization_2026_11_21/bulk-cold.mjs
node temp/optimization_2026_11_21/full.mjs baseline,values 3 range
node temp/optimization_2026_11_21/full.mjs baseline,values 5 range 3
node temp/optimization_2026_11_21/compare.mjs range baseline values 5
npm run typecheck
npm run test:vitest
```

Native build: Emscripten 7.0.0, LLVM 24, Binaryen 133, CMake 4.4.5, Release
`-O3`, LTO, SIMD, bulk memory and Wasm exceptions. The installed linked modules
are extracted without recompilation and inspected with:

```powershell
C:/Users/jorts/emsdk/upstream/bin/wasm-dis.exe temp/optimization_2026_11_21/baseline-linked.wasm -o temp/optimization_2026_11_21/baseline.wat
C:/Users/jorts/emsdk/upstream/bin/wasm-dis.exe temp/optimization_2026_11_21/values-linked.wasm -o temp/optimization_2026_11_21/values.wat
node temp/optimization_2026_11_21/inspect-values.mjs
```

## Archived files

[details.zip](details.zip) contains the original reports, source files and measurements
with their original directory structure. `MANIFEST.sha256` records every file hash.
Temporary workspace paths in historical reports identify provenance, not included directories.
