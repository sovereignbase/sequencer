# Synchronous WASM runtime

The package now loads one synchronous WASM module. `Projection` methods return
their results directly. Dedicated workers, RPC, Promise bookkeeping, transferable
message buffers and shared memory have been removed. C++ owns algorithms,
traversal, identities, frontiers, causal staging and compaction. JS keeps generic
Footage and attaches its values to the native numeric results.

## Measured result

Five alternating process runs of each implementation, identical fixed workload,
10,000 initial Strips, randomly generated lengths 1–100:

| Public operation           | TS model median |  WASM median | Speedup |
| -------------------------- | --------------: | -----------: | ------: |
| `value(random)`            |        4.076 µs |     0.683 µs |   5.97× |
| `insert(random)`           |        9.331 µs |     1.441 µs |   6.47× |
| `remove(middle)`           |        8.018 µs |     1.453 µs |   5.52× |
| `replace(middle)`          |        2.552 µs |     0.991 µs |   2.57× |
| `new Projection(sequence)` |    4,966.341 µs | 2,477.097 µs |   2.00× |
| `sequence()`               |    4,340.247 µs | 1,628.611 µs |   2.66× |
| `values()`                 |    8,050.117 µs | 4,019.202 µs |   2.00× |

[All 78 rows, medians and IQR](comparison.md), [machine-readable comparison](comparison.json).
These are public API timings including binding and Footage work, not native-only
kernel timings. Cached reads and incoming single operations do not all win.
WASM wins 63/78 median rows. For example, at 10,000 Strips, `length()` is
21.45 ns versus 16.46 ns, `apply.insert` is 1.187 µs versus 0.776 µs, and
`merge.insert` is 1.526 µs versus 0.913 µs. There is no claim of a universal
10× speedup. The five matched pairs were repeated after the final startup fix;
the earlier pairs are also retained under `before-seed-fix-*`.

Three fresh process measurements per implementation use a trusted snapshot with
10,000 insertions of 50 Frames. The first construction retains 6,485,192 bytes
median for WASM versus 8,505,400 bytes for JS: **23.8% less incremental heap plus
external memory**. After both implementations have constructed/destroyed an empty
Projection to initialize their random source, the medians are 5,652,576 versus
7,664,160 bytes: **26.2% less**. Both retain the same generic Footage values.
The earlier 33.5% claim is withdrawn: it mixed already-initialized WASM entropy
with the TS model's first construction. The final cold and steady measurements
apply the same initialization procedure to both implementations.

The probe runs GC before and after construction, drops the caller snapshot and
includes native allocation growth. Module import is complete before the first
measurement; cold results include first-use entropy initialization, steady
results exclude it equally for both implementations.
The module starts with 1 MiB of ordinary memory. Process RSS is recorded but is
not attributed exclusively to one Projection. Serialized snapshot estimates in
the benchmark are not used as evidence of runtime memory savings; the TS model
has a different tuple layout that the production footprint estimator does not
interpret.

## Changes and evidence

1. Direct `_runtime_length` and `_runtime_value` exports remove generic dispatch,
   output descriptors and intermediate result arrays from the smallest calls.
   Values are resolved with a content token and original Frame index.
2. Native outputs expose borrowed pointers/counts. Coordinates are copied once
   into independent public numeric arrays; no whole-result serialization is
   performed. Footage is never passed to native memory.
3. Footage references use dense per-Projection arrays instead of Maps. Local
   insert/replace pass the array reference and count without validation or a
   preliminary scan. Six-word insertion and four-word descriptor stores use
   direct indexing instead of temporary arrays.
4. `values()` allocates its output once from native span counts. Unmodified
   snapshots and positive insertion splices retain original Footage arrays.
5. Indexed SoA strips use one allocation with direct hot field lanes, cold
   six-word identities and two byte flags. There are no per-strip JS objects or
   proxy field accessors. Hydration reserves its known initial capacity once.
6. Containment uses a contiguous 12-byte `(session,start,strip)` slot table,
   75% load limit and linear probing. This replaces per-node hash allocations
   and 64-bit key operations. It is an AoS identity hash table, distinct from
   the rejected three-vector per-Realm table in
   [the earlier experiment](../hash_table_realm_entry_soa/README.md).
7. Retirement erases membership without shifting the admission vector. Export
   skips retired admissions; compaction compares claims to active membership.
8. Cross-file LTO exposes native component code to the optimizer. Native module
   seed generation advances a nonzero xorshift permutation; imported identities
   remain excluded, without storing every locally generated session in a set.

[Complete full-suite stage medians](stages.md) retain each three-run measurement
from the first synchronous build through the final build. Individual stage runs
are subject to process/JIT/thermal variation; they are not presented as proof of
every small independent improvement. The final paired guard additionally runs
the original synchronous build and final build in one process with alternating
order and five repetitions of every row. Its [full distributions](paired-guard.md)
are retained.

That guard improves 66/78 median rows but produces noisy cached-read outliers.
Five isolated-process follow-ups retain the same 64-call warmup and expose
remaining sensitivity to JIT tier transitions in very short bursts. A further
nine isolated process pairs warm 10,000 reads and measure one million calls per
cached read. This diagnostic changes neither the production benchmark nor its
published results. Before/final median nanoseconds are: head 50.18/46.66, middle
46.44/44.77, tail 47.46/45.18, length 11.57/11.98. Cached-read losses do not
persist in the warmed distributions. Length differs by 0.42 ns with overlapping
distributions; it is not treated as a performance improvement. Both the short
burst outliers and the longer diagnostic samples are retained, rather than
silently substituting warmed values in the full benchmark table.

The original synchronous CPU profile identified Footage output growth, binding,
constructor work and GC as meaningful costs. This motivates preallocation,
dense references and known native capacity. The final profile repeats construction,
values, sequence and valid random reads through the public API. It is diagnostic
sampling, not a competing latency benchmark.

## Correctness

- **151 tests in 41 files pass**, including public API unit, integration, stress
  and convergence cases; 1,024 generated histories for each compaction mode.
- **88 compatibility tests pass** in Node ESM/CJS, Bun, Deno, Edge Runtime,
  workerd, Chromium and WebKit. Firefox could not launch: the Playwright browser
  installation repeatedly fails with `ENOENT` for its expected executable after
  download. The failed launch and install logs are retained; Firefox is not
  counted as tested support in this run.
- `destroy()` is idempotent, rejects subsequent calls, and recycled native
  handles do not revive old instances or corrupt surviving instances.
- Runtime and test TypeScript checks pass. Existing API scenarios were converted
  to synchronous calls without dropping their checks.
- Entropy initialization happens once at the first Projection construction,
  rather than at module import, because workerd disallows global random values.
  The same synchronous module and seed generator are used in every environment.
- Five varied native throughput workloads finish. Three full native lifecycles
  grow from zero to 10,000 visible Strips and return to zero, checking indexed
  values and peer convergence at every checkpoint.

The five-varied-workload audit found a real repeated-middle-replacement failure
in both implementations on workload index 3. The failure is retained in
`measurements/final-js-throughput.log`; it was not discarded as a bad timing run.
The reduced history has three initial insertion lengths `[1,79,1]`, a high source
session and consecutive replacements without an intervening read. A fully
removed successor followed by an older mask could move the selected anchor
back into an ancestor whose subtree sorts after the intended visible boundary.
Native `select_anchor` now uses the fresh mask's free endpoint in that case.
Two checks in the existing compaction/hydration test exercise the history with
compaction enabled and disabled. An additional public-API probe completes
10,000 consecutive head, middle and tail replacements for the failing workload.
The external TS repository is unchanged.

The matched five-run timing comparison uses the same healthy run-0 workload for
both implementations. The separate varied five-run audit verifies the corrected
native runtime; it is not described as a passing five-varied-run TS comparison.
The external lifecycle additionally completed three workloads, but its timing
overlapped an independently started 100,000-Strip benchmark process. Those
timings are retained as diagnostic evidence and excluded from speedup claims.

## Generated code, SIMD, ILP and MLP

Final WASM SHA-256:
`11f8c131f85521f20df2ecd61e40ab0662b67bcae7c846a304d8d4b73b573ae5`.
Extraction uses the actual Emscripten binary-string decode expression
`(~code >> 8) & code`; magic bytes and successful disassembly verify it.

```powershell
node temp/performance/sizes-sync.mjs
& C:/Users/jorts/emsdk/upstream/bin/wasm-dis.exe temp/performance/final-sync.wasm -o temp/performance/final-sync.wat
```

The final linked module contains **45 `v128.load`, 83 `v128.store` and 41
`memory.copy`** instructions. The retained WAT excerpts and symbol map resolve
the five native hot functions; Binaryen local labels exclude the five imported
functions, whereas the symbol map and CPU profile use global indices.

- Traversal: SoA reduces the hot working set; linked/indexed next addresses
  remain dependent. `find_frame` is scalar in the final artifact. Bidirectional
  search already provides independent candidate streams; this change does not
  claim extra SIMD or an MLP gain from a single dependent walk. No speculative
  lookahead, additional traversal index or manual unrolling was added.
- Containment: independent identity fields reside in the same 12-byte slot.
  Hash arithmetic is scalar; each collision probe depends on the last probe.
  SIMD gathers would add work at ordinary short probe lengths. The final code
  has no vectorized hash or artificially duplicated load streams.
- Hydration/growth: column copies use contiguous bulk `memory.copy` operations;
  known capacity removes intermediate copies. Final `reserve` remains a scalar
  column loop using bulk copies, not a hand-vectorized traversal kernel.
- Output: native fixed-width structure copies/initializations contain vector
  loads/stores elsewhere in the final module. Generic Footage cannot be SIMD
  copied into WASM. JS output preallocation removes growth work rather than
  claiming vector arithmetic.
- Direct reads: final native `length` contains three loads and no calls;
  native `value` contains six static loads and one `find_frame` call. LTO and
  flattened fields shorten wrappers, but the artifact does not justify a
  universal compiler-unrolling or latency-hiding claim.

## Artifact cost

| Artifact                | First sync raw | Final raw | First sync gzip | Final gzip | First sync Brotli | Final Brotli |
| ----------------------- | -------------: | --------: | --------------: | ---------: | ----------------: | -----------: |
| WASM                    |       69,638 B |  69,720 B |        28,314 B |   28,774 B |          23,387 B |     23,801 B |
| ESM single-file package |      106,549 B | 109,835 B |        36,004 B |   37,330 B |          30,057 B |     31,252 B |
| CJS single-file package |      106,683 B | 109,969 B |        36,088 B |   37,414 B |          30,097 B |     31,303 B |

Native raw size grows 82 B (0.12%); the ESM package grows 3,286 B (3.08%),
gzip 1,326 B (3.68%). These costs include cross-file inlining and the correctness
fix. Binary sizes and hashes for before-LTO and final builds are retained in
`measurements/sizes-sync.json`. The substantial public API and retained memory
improvements justify this measured size cost; there is no additional shared
memory or worker artifact.

## Reproduction

Measured 2026-10-12, Windows x64, Intel Core i5-10210U, Node 24.16.0,
V8 13.6.233.17-node.49, Emscripten 5.0.7, C++23 Release `-O3 -DNDEBUG`,
`-flto -msimd128 -mbulk-memory -fwasm-exceptions`, synchronous single-file WASM,
ordinary growable memory starting at 1 MiB. The package uses its normal tsdown
configuration. No benchmark-only native shortcuts are enabled.

```powershell
npm run build
npm run typecheck:runtime
npm run typecheck
npx vitest run --coverage.enabled=false
node --test --test-name-pattern 'node.esm|node.cjs|bun|deno|edge|workerd|chromium|webkit' test/compatibility/index.ts
node --expose-gc benchmark/index.ts --suite throughput --runs 5 --max-strips 10000 --burst-ms 100 --max-calls 10000 --warmup-cycles 64 --output temp/performance/final-throughput.json
node --expose-gc benchmark/index.ts --suite lifecycle --runs 3 --max-strips 10000 --warmup-cycles 64 --output temp/performance/final-lifecycle.json
node temp/performance/build-js-benchmark.mjs
node temp/performance/final-matched.mjs
node --expose-gc temp/performance/paired-suite.mjs
node --expose-gc temp/performance/memory.mjs wasm
node --expose-gc temp/performance/memory.mjs js
node --expose-gc temp/performance/memory.mjs wasm steady
node --expose-gc temp/performance/memory.mjs js steady
node --cpu-prof --cpu-prof-dir=temp/performance/final-profiles temp/performance/profile-sync.mjs
```

Seed is `sequencer-lifecycle-v1`. Throughput runs measure all 26 cases at
100/1,000/10,000 initial Strips; 64 warmup calls precede each measured burst,
which stops at 100 ms or 10,000 calls. Measurements are serialized, never run
alongside builds/tests. The matched benchmark bundles the actual TS `Projection`
with the identical benchmark source. Its only lifecycle-specific adjustment is
optional destruction at three cleanup sites outside timers, because the TS
model is GC-owned. It does not replace or adapt the competing implementation.

Raw full-suite JSON and logs, failed audit logs, memory samples, reproducer,
measurement scripts, generated-code excerpts and test results are retained in
`measurements`. Original synchronous timings, all attempted intermediate stages
and the final paired guard remain available for every row.
