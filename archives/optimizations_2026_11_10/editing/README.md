# Direct Insertion application and borrowed Acknowledgements

Baseline: `7189b28764b778256f563ad132803112d0d29da7`.
The later [toolchain refresh](toolchain.md) records the SDK 7 publication build;
the optimization comparisons below retain their original SDK 6 measurements.
The [earlier experiments](attempts.md) record rejected lookup and input-copy
changes. The current change preserves the original traversal and JavaScript
validation.

## Removed work

The numeric reader now returns an Insertion or an Acknowledgement view over the
existing input buffer. Applying an Acknowledgement no longer allocates a vector,
copies its words and frees that vector immediately afterward. FrontierTable
consumes the view synchronously and retains its own membership and claims.

Decoded Insertions enter the existing insertion algorithm directly. Canonical
Gossip iteration handles Acknowledgements before calling that same algorithm;
the ABI no longer constructs a temporary Entry or passes a one-element Gossip
span for each insertion. Pending dependencies, masks, extension handling, jump
maintenance and Splice ordering are unchanged.

Hydration also supplies its three-word local Acknowledgement from a stack array
instead of allocating a temporary vector. Both paths use the same frontier
observation rules. No new retained buffer, cache or per-Projection field is added.

An intermediate version removed the Acknowledgement allocation but repackaged
every Insertion into an Entry. Its final linked Wasm contained two `v128`
load/store pairs for that extra copy, plus initialization of the Entry tag and
empty frontier. The direct insertion entry point removes that aggregate entirely.
The vector copies were compiler-generated, not an explicit SIMD optimization.

## Artifact size

Bytes, with unchanged build flags, Terser three-pass minification, gzip level 9
and default Brotli. Distributed bundle compression is applied after minification.

| Artifact                   | Baseline |   After | Saved |
| -------------------------- | -------: | ------: | ----: |
| ESM raw                    |  162,047 | 158,769 | 3,278 |
| ESM minified               |  131,906 | 128,892 | 3,014 |
| ESM minified + gzip        |   46,938 |  46,004 |   934 |
| ESM minified + Brotli      |   38,385 |  37,633 |   752 |
| CommonJS raw               |  162,190 | 158,912 | 3,278 |
| CommonJS minified          |  132,967 | 129,953 | 3,014 |
| CommonJS minified + gzip   |   47,021 |  46,087 |   934 |
| CommonJS minified + Brotli |   38,385 |  37,688 |   697 |
| Wasm raw                   |   97,129 |  94,815 | 2,314 |
| Wasm gzip                  |   39,190 |  38,354 |   836 |
| Wasm Brotli                |   31,825 |  31,225 |   600 |

Generated Emscripten glue excluding its embedded Wasm literal is byte-identical:
5,424 raw bytes, 2,075 gzip bytes and 1,860 Brotli bytes. The complete embedded
glue file shrinks from 108,779 to 106,253 bytes. The raw Wasm SHA-256 changes from
`455205ad6f310196a833d0c07eb7bcb311ef231ec17a562204adb46e094b9dcf`
to `aaefdbd8126104e37d82b33d2704ee0c8cbf71a44fd5e625325c802d830072b3`.

## Measurement procedure

Node 24.16.0, V8 13.6.233.17-node.49, Windows x64, Intel Core i5-10210U;
Emscripten 6.0.12, Clang 24.0.0 and CMake 4.4.4. Release/LTO, SIMD, bulk memory
and Wasm exceptions remain unchanged. No external competitor was measured.

The fresh baseline and candidate run all lifecycle, throughput and tuple cases
three times. Additional complete matched pairs fix primary/peer Session entropy
and use the same workload seed within each pair. Timing, live native allocation,
retained JS array slots and snapshot sizes are compared separately.

Long direct-ESM apply measurements use 3,000 authored edits, batches of one or 64,
32 freshly hydrated receivers per burst, two warmup bursts and five
counterbalanced measured pairs. Both versions receive identical Gossip generated
outside timing. Every receiver's complete values are checked against its author
after each burst. A burst covers 96,000 edits. Creation, explicit JS process
garbage collection, validation of measured results and destruction are untimed.

Raw reports, paired observations, source/bundle snapshots and scripts remain in
`temp/optimization_2026_11_10_editing/`. The standard commands are:

```powershell
npm run build
node --expose-gc benchmark/index.ts --output temp/optimization_2026_11_10_editing/candidate10.json
node --expose-gc benchmark/tuple/index.ts --runs 3 --output temp/optimization_2026_11_10_editing/candidate10-tuple.json
npm run test:vitest
npm run typecheck
```

## Parallelism

The removed copy is unnecessary work; widening or unrolling it would retain the
allocation and payload traversal. Frontier updates depend on individual hash
lookups, membership admission and claim replacement. Applying those updates
directly preserves their order. No SIMD, ILP or MLP speedup is claimed for them.
The insertion algorithm's existing independent outward traversal streams remain
unchanged.

## Verification and result

All 272 tests and 104 local compatibility checks pass; TypeScript statement,
branch, function and line coverage remain 100%. No test expectations change.

The [complete matched comparison](performance.md) includes all 424 timing rows
and 96 memory/storage rows. The [direct public-API follow-ups](measurements.md)
include medians, IQRs and the unchanged-baseline control. Fresh tail-removal apply
improves by 10–11%; Acknowledgement-only apply improves by 8–13%. General
lifecycle apply remains near baseline. Apparent local head-removal and merge
regressions do not reproduce with warmed, separate named callers.

Three runs with 1,000 and 10,000 simultaneously live instances retain exactly the
same per-instance native allocation for all five shapes. Matched snapshot sizes,
tuple memory/storage and retained JS array-slot estimates agree. The complete
shared runtime's live native allocation varies by a few allocator bytes; it is
not a new per-instance allocation. The changes remove temporary allocation, not
retained metadata or application data.

Final linked Wasm was inspected with:

```powershell
C:/Users/jorts/emsdk/upstream/bin/wasm-dis.exe temp/optimization_2026_11_10_editing/baseline-memory.wasm -o temp/optimization_2026_11_10_editing/baseline.wat
C:/Users/jorts/emsdk/upstream/bin/wasm-dis.exe temp/optimization_2026_11_10_editing/candidate10-memory.wasm -o temp/optimization_2026_11_10_editing/candidate10.wat
```

The symbol maps identify the baseline's Gossip-span `apply` at function 52 and
the retained direct-Insertion `apply` at function 53. The Gossip wrappers are
inlined; they do not add another emitted wrapper function. The ABI calls the
Insertion algorithm without constructing an Entry. Position lookup and Frame
lookup retain their 2,318-byte and 3,019-byte function bodies, respectively;
binary hashes also reflect relocated helper calls and are not claimed identical.
