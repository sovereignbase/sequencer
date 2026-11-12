# Tuple Version storage

Measured 12 November 2026. The control is slicecopy from [snapshot copying](snapshot_copy.md). Public tuple indices, replication coordinates, snapshot words and acknowledged compaction are unchanged.

## Change

Remove the unused Version at vector offset zero. Slot winners and active-chain links now use actual zero-based vector offsets; `UINT32_MAX` denotes an absent Version. Canonical root handles in the containment table remain one-based. This keeps the existing root representation while removing the allocation for an empty Version and avoiding subtraction on every winning-value lookup.

An eight-value local tuple previously required nine Version records, giving geometric capacity sixteen. It now stores eight records with capacity eight. Version records remain 40 bytes; this change removes spare records rather than packing fields or changing their meaning.

Hydration reserves the insertion count plus one, as before. Reserving only the insertion count shifted later vector growth earlier: the intermediate implementation used more memory at 39 of 195 checked edit positions. Preserving the spare slot avoids this regression without another field. Consequently this change does not claim a 40-byte saving for every hydrated tuple.

Fixed tuple reads also remove a duplicate bounds check. The public native read dispatch checks the Projection extent before looking up a register; range reads clip their range first. External tuple coordinates retain their existing validation. The occupied-register collector clips fixed ranges before its unchecked lookup.

## Memory

Three runs with 10,000 simultaneously live instances, one Wasm runtime, no peer included in the estimate. Native bytes include live allocator overhead and the amortized handle table. JavaScript heap deltas follow explicit JS process garbage collection. The preallocated instance container is excluded; these are not RSS or reserved linear-memory measurements.

| Shape                       | Native B/instance before |    After | JS B/instance before |  After |
| --------------------------- | -----------------------: | -------: | -------------------: | -----: |
| Empty sequence              |                   262.56 |   262.56 |               202.56 | 202.56 |
| One sequence value          |                   542.56 |   542.56 |               402.43 | 402.43 |
| Eight sequence values       |                   542.56 |   542.56 |               378.20 | 380.13 |
| Eight-field tuple           |                 1,392.59 | 1,070.61 |               380.73 | 380.73 |
| Eight values, each replaced |                 3,514.38 | 3,514.38 |               908.92 | 913.01 |

The populated tuple saves 321.98 native bytes per instance, about 23.1%. JavaScript representation is unchanged; the small heap differences are not claimed as gains. A separate five-run check of 10,000 empty fixed tuples saves 48 native bytes per instance at each tested length: 2, 8 and 100.

A five-run hydrated-growth check creates a snapshot in a separate peer runtime, reconstructs one measured instance and performs 64 scalar writes. Every write is checked through the public API. At each of the 65 checkpoints for lengths 2, 8 and 100, the candidate's median native live allocation is no greater than the control: 185 equal and 10 smaller. No peer allocation is counted. These finite fixtures do not prove an allocation bound for arbitrary documents.

## Generated code and artifacts

The first intermediate implementation retained one-based winner offsets and introduced two extra subtractions in `runtime_value`. Zero-based winner offsets remove both. In the final linked Wasm, that function has 317 disassembly lines versus 327 in the control; unsigned bounds comparisons fall from two to one. Existing loads and scalar stores remain. This removes work; no new SIMD, ILP or MLP acceleration is claimed.

Identical release build, three-pass Terser, gzip and Brotli settings; bytes:

| Artifact              |  Before |   After | Difference |
| --------------------- | ------: | ------: | ---------: |
| ESM raw               | 151,408 | 151,236 |       -172 |
| ESM min               | 123,279 | 123,212 |        -67 |
| ESM min + gzip        |  44,226 |  44,257 |        +31 |
| ESM min + Brotli      |  36,396 |  36,405 |         +9 |
| CommonJS raw          | 151,561 | 151,389 |       -172 |
| CommonJS min          | 124,582 | 124,515 |        -67 |
| CommonJS min + gzip   |  44,384 |  44,413 |        +29 |
| CommonJS min + Brotli |  36,520 |  36,530 |        +10 |
| Wasm raw              |  90,952 |  90,939 |        -13 |
| Wasm gzip             |  36,777 |  36,820 |        +43 |
| Wasm Brotli           |  30,175 |  30,212 |        +37 |

The compressed-size increases are deterministic costs, not timing noise. The change reduces raw/minified size and tuple allocation, not every artifact encoding.

## Verification and decision

All 276 tests pass with 100% TypeScript coverage: 434 statements, 295 branches, 32 functions and 388 lines. Both TypeScript checks pass. All 192 exact canonical snapshot/serialization comparisons pass; JSON, MessagePack, gzip and V8 serialization sizes are unchanged in those fixtures. Existing test expectations are preserved.

The [five-run, 80-case tuple comparison](tuplerange-tuple.md) is complete. Against current, 49 of 72 non-length paired medians improve over 5% and eight slow over 5%. Two scalar reads are slower in all five pairs: projection/2 value.random (+11.63%, paired IQR 10.39 percentage points) and tuple/4 value.random (+3.81%, IQR 1.71 points). The isolated slicecopy comparison remains mixed: 18 faster and 21 slower paired medians over 5%, including all-pair losses in merge, replacement, values and sequence at the shown sizes.

A separate [complete five-run guard](recovery-tuplestorage-performance.md) compares all 424 timing rows and 96 memory/storage rows. Excluding length, 274 paired medians improve over 5% and 15 slow over 5% against current. Only throughput/100 values.head (+16.93%, paired IQR 37.50 points) and lifecycle/scaleUp value.tail (+9.92%, IQR 9.38 points) are slower in every pair. All 64 encoded-storage medians are unchanged; live native and JavaScript memory medians do not increase. These whole-suite results do not repeat the same small-read loss pattern as the tuple-only run, but they also do not establish the all-row condition. The candidate remains under investigation. Length is recorded but excluded from the performance decision. No external benchmark or competitor is run or modified.

Commands use P = `temp/optimization_2026_11_11`:

- `node scripts/run-tests.ts vitest --coverage`
- `npm run typecheck` and `npm run typecheck:runtime`
- `node P/shape-check.mjs tuplerange`
- `node --expose-gc archives/optimizations_2026_11_10/memory.ts P/tuplerange-workspace/src P/tuplerange-memory.json P/tuplerange-workspace/dist`
- `node --expose-gc P/tuple-growth-memory.mjs`
- `node P/tuple-growth-summary.mjs`
- `node P/tuplerange-inspect.mjs`
- `node P/tuple-full.mjs current,slicecopy,tuplerange 5 tuplerange-tuple`

Frozen workspaces, linked symbol maps, disassembly and all raw samples remain under P.
