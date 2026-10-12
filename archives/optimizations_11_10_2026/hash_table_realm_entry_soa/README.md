# HashTable Realm Entry SoA Experiment

## Decision

Reverted. The three-vector Structure-of-Arrays candidate did not satisfy the
repository's no-regression rule and was not committed.

The candidate reduced the 100,000-entry random lookup median by only 2.9%,
while increasing append/hydration cost by 50.7%, a middle insertion by 116.5%,
the minimum Realm table allocation by 6,144 bytes per HashTable, raw Wasm by
731 bytes, and the packed npm artifact by 1,267 bytes. The full public benchmark
matrix was mixed and contained many reproducible or unresolved regressions.

## Target and hypothesis

Target: `src/c++/classes/hash_table/index.hpp` at checkout
`564dc6640177a157d7c55564d3200501d13fb115`.

The baseline stored one Realm's containment index as:

```cpp
struct Entry {
  std::uint32_t counter_bits;
  std::uint32_t frame_count;
  std::uint32_t stable_position;
};

std::vector<Entry> entries;
```

`HashTable::get` binary-searches only `counter_bits`, so a search over 100,000
entries touches a 1.2 MiB 12-byte-stride array even though only 0.4 MiB of
counters are needed before the final containment check. The falsifiable
hypothesis was that three parallel `uint32_t` vectors would improve lookup
locality enough to outweigh the extra vector operations in `set`.

Relevant earlier archives discuss SoA for traversal links, but no prior archive
tested the HashTable Realm containment entries. Indexed link traversal and
HashTable binary search are different dependency structures, so those earlier
results were context rather than evidence that this candidate would win.

## Candidate

The temporary candidate replaced `Entry[]` with:

```cpp
std::vector<std::uint32_t> counter_bits;
std::vector<std::uint32_t> frame_counts;
std::vector<std::uint32_t> stable_positions;
```

`get` searched `counter_bits` and loaded the other arrays only for the final
entry. `set` appended, replaced, or inserted at the same index in all three
vectors. Realm probing, keys, containment semantics, resize policy, public API,
and all other runtime code remained unchanged.

Risks evaluated:

- parallel-array length and index synchronization;
- three allocations/reallocations instead of one during hydration;
- three middle shifts instead of one;
- larger metadata for every empty Realm slot;
- changed inlining and production-Wasm code layout;
- correctness of replacement, split insertion, duplicate handling, multi-Realm
  lookup, hydration, and convergence.

## Environment and commands

- OS: Windows, x86-64
- CPU: Intel Core i5-10210U at 1.60 GHz
- Node.js: 24.16.0
- V8: 13.6.233.17-node.49
- Emscripten: 5.0.7
- CMake: 4.3.3
- Ninja: 1.13.2
- production configuration: CMake Release, `-O3 -DNDEBUG -std=gnu++23
-msimd128`, single-file synchronous Wasm, memory growth enabled

Full-suite baseline and candidate, three independent serial processes each:

```powershell
npm run bench
```

Targeted kernel build:

```powershell
$compiler = 'C:\Users\jorts\emsdk\upstream\emscripten\em++.bat'
& $compiler .\archives\optimizations\hash_table_realm_entry_soa\reproduce\hash_table_benchmark.cpp `
  -O3 -DNDEBUG -std=c++23 -msimd128 `
  -sWASM=1 -sMODULARIZE=1 -sEXPORT_ES6=1 -sENVIRONMENT=node `
  -sSINGLE_FILE=1 -sWASM_ASYNC_COMPILATION=0 `
  -sALLOW_MEMORY_GROWTH=1 -sFILESYSTEM=0 -sDYNAMIC_EXECUTION=0 `
  "-sEXPORTED_FUNCTIONS=['_populate','_initialize_spaced','_insert_middle','_lookup_random_batch','_lookup_hot_batch']" `
  -o .\archives\optimizations\hash_table_realm_entry_soa\reproduce\hash_table_benchmark.mjs
node .\archives\optimizations\hash_table_realm_entry_soa\reproduce\run_targeted.mjs
```

The targeted workload used one Realm with 100,000 one-Frame entries. Every
process collected nine samples. Random lookup timed 2,000,000 deterministic
xorshift-selected lookups per sample; hot lookup timed 5,000,000 lookups in a
16-entry window. Populate timed construction plus 100,000 ordered `set` calls.
Middle insert initialized spaced counters outside the timer and timed one entry
inserted at the vector midpoint. Baseline and candidate used the identical
kernel, flags, runner, inputs, warm-up, iterations, and process count.

Correctness:

```powershell
npm run test:unit
npm run test
```

Production artifact inspection:

```powershell
wasm-dis.exe extracted-production-module.wasm -o production.wat
wasm-opt.exe extracted-production-module.wasm `
  --enable-simd --enable-bulk-memory --metrics
```

## Targeted results

Values are nanoseconds per operation. Each median and IQR combines all 27
samples from three processes. Raw samples and process medians are retained in
[`targeted_comparison.json`](./targeted_comparison.json).

| Kernel              |  Baseline median (IQR) |  Candidate median (IQR) |  Change |
| ------------------- | ---------------------: | ----------------------: | ------: |
| Random lookup       | 119.69 (113.25–125.34) |   116.25 (97.41–123.51) |   -2.9% |
| Hot-16 lookup       |    52.16 (51.30–53.39) |     51.80 (45.71–55.09) |   -0.7% |
| Populate, per entry |    25.12 (22.09–27.18) |     37.84 (33.40–45.14) |  +50.7% |
| One middle insert   | 41,200 (31,000–63,500) | 89,200 (62,400–152,300) | +116.5% |

The lookup distributions overlap materially. The small read improvement is not
strong enough to offset the clearly separated write regressions.

## Complete public benchmark suite

The suite contains 144 throughput rows: 12 public functions at every
combination of 100, 1,000, 10,000, and 100,000 Sequence Frames with 1, 10, and
100 Frames per retained Strip. It also measures all 12 memory scenarios, ESM
and CommonJS bundles, and three data workloads.

Across the three-run medians:

- 57 throughput rows improved by more than 5%;
- 70 throughput rows regressed by more than 5%;
- 17 rows remained within ±5%.

The low-sample public mutation rows were noisy and sometimes changed direction
between neighboring scenarios. Several affected large scenarios nevertheless
showed unacceptable candidate regressions, including 100,000/1 insert (+170%),
100,000/10 insert (+15.1%), 100,000/10 merge (+11.5%), 100,000/100 merge
(+39.2%), and 100,000/100 replace (+12.0%). Some other rows improved, which is
why the decision relies on the controlled targeted distributions as well as the
complete guard rather than an aggregate average.

Every row, all three raw values, medians, and percentage changes are retained in
[`full_comparison.json`](./full_comparison.json). No competitor comparison is
applicable because the current `npm run bench` suite is Sequencer-only.

## Memory and artifact impact

On wasm32, the baseline Realm is two identity words plus one 12-byte vector
object: 20 bytes. The candidate has three vector objects: 44 bytes. The final
WAT confirms the minimum 256-slot initialization changes from 5,120 bytes to
11,264 bytes, a fixed +6,144 bytes (+120%) per HashTable before entry payloads.
The payload remains 12 bytes per entry. RSS measurements were too page-granular
and noisy to expose this small fixed native allocation reliably; the 100,000
Frame scenario medians did not show a compensating memory reduction.

| Artifact                                | Baseline bytes | Candidate bytes |  Delta | Change |
| --------------------------------------- | -------------: | --------------: | -----: | -----: |
| Embedded raw Wasm                       |         29,925 |          30,656 |   +731 | +2.44% |
| Embedded Wasm gzip                      |         12,361 |          12,615 |   +254 | +2.05% |
| Embedded Wasm Brotli                    |         10,370 |          10,723 |   +353 | +3.40% |
| Generated glue without embedded payload |         12,614 |          12,614 |      0 |     0% |
| Generated single-file module            |         44,402 |          45,136 |   +734 | +1.65% |
| Single-file gzip                        |         17,373 |          17,677 |   +304 | +1.75% |
| Single-file Brotli                      |         14,340 |          14,628 |   +288 | +2.01% |
| ESM bundle raw                          |         87,369 |          88,140 |   +771 | +0.88% |
| ESM bundle gzip                         |         26,646 |          26,888 |   +242 | +0.91% |
| ESM bundle Brotli                       |         22,602 |          22,887 |   +285 | +1.26% |
| CommonJS bundle raw                     |         87,673 |          88,444 |   +771 | +0.88% |
| CommonJS bundle gzip                    |         26,761 |          27,006 |   +245 | +0.92% |
| CommonJS bundle Brotli                  |         22,717 |          22,983 |   +266 | +1.17% |
| npm package compressed                  |        141,648 |         142,915 | +1,267 | +0.89% |
| npm package unpacked                    |        594,863 |         601,779 | +6,916 | +1.16% |

## Generated-Wasm and parallelism analysis

The inspected artifact was the exact embedded Wasm decoded from
`src/typescript/wasm/raw/sequencer_wasm.mjs` after the production Release build.

| Wasm metric                      | Baseline | Candidate | Delta |
| -------------------------------- | -------: | --------: | ----: |
| Functions                        |       47 |        49 |    +2 |
| Total measured operations        |   14,243 |    14,603 |  +360 |
| Calls                            |      173 |       186 |   +13 |
| Loads                            |    1,258 |     1,305 |   +47 |
| Stores                           |      726 |       748 |   +22 |
| `v128.*` occurrences in WAT      |       54 |        56 |    +2 |
| `memory.copy` occurrences in WAT |       19 |        19 |     0 |

SIMD: the counter binary search is control-flow divergent and data-dependent,
so contiguous SIMD comparison would require speculative multi-entry work and a
lane reduction. The compiler did not vectorize the lookup. The two extra v128
occurrences belong to aggregate initialization/copy code, not a SIMD lookup,
and did not produce a representative win.

ILP: each next binary-search address depends on the preceding comparison. The
candidate did not create independent arithmetic or multiple accumulators. The
final Wasm instead contains more calls, loads, stores, and functions.

MLP: one lookup still has a single dependent search stream. SoA narrows the
cache footprint but does not create independently outstanding memory requests.
MLP could only be exposed by batching independent lookups, which this API and
candidate did not do.

## Correctness

The candidate passed:

- 21 unit tests;
- 29 combined unit, convergence, and stress tests;
- Node.js, Deno, Bun, Edge Runtime, and Cloudflare Workers runtime tests;
- 15 browser tests across Chromium, Firefox, WebKit, and mobile profiles.

The complete output is retained in
[`raw/candidate_tests.txt`](./raw/candidate_tests.txt).

## Final interpretation

The original cache-locality hypothesis was real but too weak for this data
structure and workload. A 12-byte AoS binary search is only modestly slower
than the 4-byte counter search at 100,000 entries on this machine, while three
independent vectors impose substantial allocation, mutation, metadata, and code
costs. This implementation is therefore a net regression and was fully
reverted.

A future retry would need to be materially different, such as one allocation
with separate hot/cold regions or a batched lookup API that creates genuine
MLP. It must first demonstrate that it avoids the append, middle-insert, fixed
Realm-memory, and artifact-size regressions measured here.

## Raw material

- [`raw/full`](./raw/full): three complete baseline and candidate suite runs.
- [`raw/targeted`](./raw/targeted): three targeted baseline and candidate runs.
- [`raw/artifacts`](./raw/artifacts): artifact, package, and Wasm metric output.
- [`reproduce`](./reproduce): targeted kernel, runner, and comparison scripts.
