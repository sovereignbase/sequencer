# Snapshot Footage copying

Measured 12 November 2026, using the unchanged runtime, compiler, flags and benchmark workloads from [the round](README.md). Native Wasm is byte-identical to emptydirect. The only runtime change from that build is replacing identity map with slice when a complete retained or private Footage array is first exported. This removes the per-Frame JavaScript callback and its function. Later snapshots still share the already exported array. No public signature, snapshot word, native record or ownership invariant changes.

Unlike [direct sharing](private_footage_copy.md), slice compacts spare array capacity. The intermediate private-only slice branch is unnecessary: slice preserves both private and retained array contents, including sparse slots, while creating a distinct array. The existing failure-injection test spies on slice instead of map; error code, original cause, retry, caller-array isolation and subsequent replay expectations are unchanged.

## First-export timings

Twelve measured rounds after three warmups; alternating build order. The first public sequence call is timed once per fresh instance. Numeric Footage, fixture setup, JS process garbage collection, full-value checks, subsequent editing and reconstruction are outside timing. Every timed snapshot is checked for isolation after extension and masking. All valid samples are retained. Nanoseconds/call, median (IQR). Private fixtures first extend their original input; retained fixtures hydrate an exported snapshot. Tables are separate matched invocations.

### Private Footage

|    Frames |             Previous map |                   Slice |  Change |
| --------: | -----------------------: | ----------------------: | ------: |
|       100 |      7,617.97 (4,193.36) |     2,910.16 (2,138.28) | -61.80% |
|    10,000 |   295,406.25 (17,926.56) |    27,996.87 (4,920.31) | -90.52% |
| 1,000,000 | 22,895,100 (4,611,937.5) | 3,884,012.5 (826,237.5) | -83.04% |

### Hydrated Footage

|    Frames |             Previous map |                  Slice |  Change |
| --------: | -----------------------: | ---------------------: | ------: |
|       100 |      9,093.75 (4,891.41) |      2,289.84 (796.48) | -74.82% |
|    10,000 |   291,078.13 (31,642.19) |    21,287.5 (2,135.94) | -92.69% |
| 1,000,000 | 24,425,862.5 (5,733,900) | 3,510,600 (612,481.25) | -85.63% |

## Retained memory

Five samples per size/build, explicit JS process garbage collection. The preallocated input and earlier snapshots remain live across both measurements; input storage is outside each delta. Median bytes after export, with IQR. These estimates cover numeric Footage, wrapper and bindings, not process RSS.

|    Frames |      Previous map |             Slice |
| --------: | ----------------: | ----------------: |
|    10,000 |    80,472 (1,304) |      80,472 (624) |
| 1,000,000 | 7,999,848 (8,408) | 7,999,848 (8,280) |

Three runs with 10,000 simultaneously live Projections in one Wasm instance, no peer. The instance container is preallocated. Native values are live allocator estimates, not reserved linear-memory capacity. JS heap values follow explicit JS process garbage collection. Small heap differences are reported, not claimed as a representation change.

| Shape     | Native B/instance before / after | JS B/instance before / after |
| --------- | -------------------------------: | ---------------------------: |
| empty     |                  262.56 / 262.56 |              202.56 / 202.56 |
| single    |                  542.56 / 542.56 |              402.43 / 402.43 |
| sequence8 |                  542.56 / 542.56 |                378.2 / 378.2 |
| tuple8    |              1,392.59 / 1,392.59 |              380.73 / 380.73 |
| edited8   |              3,514.38 / 3,514.38 |              914.86 / 908.92 |

## Artifacts

Same release settings, three-pass Terser and compression settings; bytes.

| Artifact              |  Before |   After |   Difference |
| --------------------- | ------: | ------: | -----------: |
| index.js/rawBytes     | 151,422 | 151,408 | -14 (-0.01%) |
| index.js/minBytes     | 123,281 | 123,279 |  -2 (-0.00%) |
| index.js/gzipBytes    |  44,231 |  44,226 |  -5 (-0.01%) |
| index.js/brotliBytes  |  36,376 |  36,396 |  20 (+0.05%) |
| index.cjs/rawBytes    | 151,575 | 151,561 | -14 (-0.01%) |
| index.cjs/minBytes    | 124,584 | 124,582 |  -2 (-0.00%) |
| index.cjs/gzipBytes   |  44,390 |  44,384 |  -6 (-0.01%) |
| index.cjs/brotliBytes |  36,541 |  36,520 | -21 (-0.06%) |
| wasm/rawBytes         |  90,952 |  90,952 |   0 (+0.00%) |
| wasm/gzipBytes        |  36,777 |  36,777 |   0 (+0.00%) |
| wasm/brotliBytes      |  30,175 |  30,175 |   0 (+0.00%) |

The ESM gzip/Brotli differences are deterministic and retained in the table; no all-encoding size win is claimed. No SIMD, ILP or MLP change is claimed. The copy uses the JavaScript engine's builtin instead of per-element callback work. Linked Wasm is unchanged, including graph walks and vector transfers.

## Verification

All 276 tests pass with 100% TypeScript coverage (434 statements, 295 branches, 32 functions, 388 lines). Both TypeScript checks and 192 exact canonical snapshot/serialization comparisons pass. JSON, MessagePack, gzip and V8 serialization sizes are unchanged. Correctness expectations are not weakened.

The five-run complete guard is complete. The requested all-row condition is **not established**. Of 409 non-length timing rows, 380 medians improve over 5% and 21 slow over 5% against current; the isolated emptydirect comparison has 175 faster and 106 slower medians over 5%. Median paired changes give 303 faster / 36 slower against current and 168 faster / 37 slower against emptydirect. [Every baseline row](recovery-slice-performance.md) and [every isolated row](recovery-slice-native-performance.md) retain medians, IQR and paired changes. Length remains in the tables but is excluded from the decision.

The [measurement-window drift](measurement_environment.md) is also visible within this run: a ratio of the separate medians can differ greatly from the median of the five pairwise ratios. Neither broad counts nor the large cold-export speedup prove that unrelated methods all improved. No old-window baseline is substituted for this matched comparison.

The isolated 10,000-group insert.sameIndex is slower in all five original pairs: median +15.78%, median paired change +11.39%, paired IQR 5.69 percentage points. Against current, four tuple read rows are slower in all five pairs: tuple/2 value.random, projection/4 values, tuple/4 values and projection/8 value.random.

Fresh five-run repetitions of the unchanged production suites are complete: [10,000-group throughput](slice-repeat-10k.md), [25,000-group throughput](slice-repeat-25k.md), and [all 80 tuple cases](slice-repeat-tuple.md). At 10,000 groups no non-length row is slower in all five pairs against either control. The sameIndex median paired change is +5.52%, with a 58.20-percentage-point IQR; its original consistent loss does not reproduce. At 25,000 groups value.random remains slower against current (+9.80% paired, IQR 2.88 points), while improving against emptydirect (-3.26%). Apply.remove is slower in every pair against emptydirect, but its paired median is +3.92%, with IQR 10.98 points.

The tuple repeat still has two all-pair read losses against current: tuple/2 value.random (+11.28% paired, IQR 10.32 points) and projection/8 value.random (+11.05%, IQR 9.42 points). Against emptydirect the all-pair loss is projection/100 values (+2.86%, IQR 1.58 points). Later matched tuple runs also remeasure the unchanged slicecopy control; the signs of its earlier tiny-read losses change. These comparisons show unstable attribution rather than proving every loss is measurement noise. The all-row condition remains unfulfilled, and subsequent tuple storage changes require their own complete guard.

Commands use P = temp/optimization_2026_11_11:

- node --expose-gc P/private-snapshot-guard.mjs emptydirect,slicecopy slice-copy-private
- node --expose-gc P/private-snapshot-guard.mjs emptydirect,slicecopy slice-copy-retained retained
- node --expose-gc P/snapshot-retained-memory.mjs slicecopy
- node P/shape-check.mjs slicecopy
- node P/full.mjs current,emptydirect,slicecopy 5 recoveryslicecopy

Raw distributions, frozen sources and linked artifacts remain under P. No external benchmark or competitor was changed or run.
