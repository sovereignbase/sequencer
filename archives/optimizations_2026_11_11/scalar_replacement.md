# Empty replacement lifetime and scalar range input

**Decision:** retain the empty-binding lifetime fix; reject the scalar end-input experiment. Five complete matched runs contain 203 timing medians over 5% faster and 151 over 5% slower against current. The isolated emptydirect comparison has 99 faster and 150 slower medians over 5%. Length remains recorded but is excluded from the optimization decision. [Every baseline row](recovery-scalar-performance.md) and [every isolated row](recovery-scalar-native-performance.md) include paired differences and IQR. No claim that the remaining differences are only noise follows from these results.

An empty replacement no longer allocates a JavaScript Footage binding. Previously, repeated empty replacements leaked unused bindings in sequence mode: after one warm-up replacement, another 1,000 calls grew the binding-slot estimate from 40 to 8,040 bytes. Tuple mode already released these bindings. Both modes now have zero growth in this probe. These are binding-slot estimates, not complete JavaScript heap measurements.

The new runtime-memory test fails against the old build (56 to 8,056 estimated JavaScript bytes) and passes for both modes after the fix. No existing correctness expectation changes.

The rejected experiment passes replacement's inclusive end in the existing numeric dispatch argument. It avoids reserving a one-word input buffer, writing that word and constructing a native Reader for it. The omitted-bound sentinel and public error scope remain unchanged. Native dispatch creates an input span only when count is nonzero, so the scalar end is never treated as a memory address. No new export, operation or per-instance field is added. This scalar implementation has been fully restored to emptydirect sources and linked Wasm.

## Targeted replacements

Twelve measured rounds after four warmups; rotating/reversed variant order. Each burst makes 1,000 public calls on a fresh instance. Payload setup, correctness checks and JS process garbage collection are outside timing. All valid samples are retained. Nanoseconds/call, median (IQR). Each table is a separate invocation; compare builds within a table.

| Mode / replacement length |             anchor |               empty |         emptydirect |
| ------------------------- | -----------------: | ------------------: | ------------------: |
| Sequence / 0              |  1,187.25 (361.25) |    1,314.05 (534.9) |    1,320.1 (300.95) |
| Sequence / 1              | 10,115.25 (758.65) | 10,747.7 (1,771.63) | 10,047.4 (2,132.73) |
| Tuple / 0                 |   1,092.9 (146.65) |     1,086.9 (74.75) |    1,116.2 (189.75) |
| Tuple / 1                 |    2,054.8 (511.9) |    1,991.25 (680.6) |   2,026.75 (869.32) |

| Mode / replacement length |            anchor |         emptydirect |     scalarreplace |
| ------------------------- | ----------------: | ------------------: | ----------------: |
| Sequence / 0              |   759.65 (264.65) |     889.35 (388.43) |     740.6 (414.5) |
| Sequence / 1              |  8,039.4 (372.12) | 8,105.55 (1,081.63) |     8,180.1 (710) |
| Tuple / 0                 |       839.6 (435) |      834.7 (209.47) |   845.65 (233.75) |
| Tuple / 1                 | 1,484.95 (325.38) |      1,346.5 (94.9) | 1,473.45 (193.25) |

The first implementation always allocated and then released an empty token (empty). The direct fix avoids both steps (emptydirect). The final scalar variant additionally removes the input-buffer call. Targeted timing medians are mixed; the memory fix alone is not reported as a universal CPU improvement.

The complete isolated guard repeats slower results in all five pairs for hydrated creation at 5,000 groups (median +27.21%, paired +32.02%, paired IQR 8.26 percentage points), middle insertion at 10,000 groups (+17.74%, paired +24.77%, IQR 10.45 pp), four-field projection apply.replace (+16.69%, paired +22.63%, IQR 6.84 pp), and eight-field projection replace.random (+22.07%, paired +17.47%, IQR 7.71 pp). The source removes work, but the final build is not a reproducible overall improvement. No benchmark workload or test expectation is changed to accommodate it.

## Artifacts and live memory

Same release/LTO/SIMD/Wasm-exception configuration; three-pass Terser and identical compression settings. Anchor to scalarreplace, bytes.

| Artifact              |  Before |   After |    Difference |
| --------------------- | ------: | ------: | ------------: |
| index.js/rawBytes     | 151,636 | 151,497 | -139 (-0.09%) |
| index.js/minBytes     | 123,462 | 123,373 |  -89 (-0.07%) |
| index.js/gzipBytes    |  44,296 |  44,170 | -126 (-0.28%) |
| index.js/brotliBytes  |  36,474 |  36,368 | -106 (-0.29%) |
| index.cjs/rawBytes    | 151,789 | 151,650 | -139 (-0.09%) |
| index.cjs/minBytes    | 124,765 | 124,676 |  -89 (-0.07%) |
| index.cjs/gzipBytes   |  44,451 |  44,332 | -119 (-0.27%) |
| index.cjs/brotliBytes |  36,652 |  36,527 | -125 (-0.34%) |
| wasm/rawBytes         |  91,106 |  90,924 | -182 (-0.20%) |
| wasm/gzipBytes        |  36,841 |  36,739 | -102 (-0.28%) |
| wasm/brotliBytes      |  30,174 |  30,075 |  -99 (-0.33%) |

Three runs with 10,000 simultaneously live instances, one Wasm instance and no peer per sample. Native bytes are live allocator estimates; JS heap deltas follow explicit JS process garbage collection. The preallocated instance container is excluded. These are not process RSS.

| Shape     | Native B/instance before / after | JS B/instance before / after |
| --------- | -------------------------------: | ---------------------------: |
| empty     |                  262.56 / 262.56 |              202.56 / 202.56 |
| single    |                  542.56 / 542.56 |              402.43 / 402.33 |
| sequence8 |                  542.56 / 542.56 |               378.2 / 378.29 |
| tuple8    |              1,392.59 / 1,392.59 |              380.74 / 380.16 |
| edited8   |              3,514.38 / 3,514.35 |                    913 / 913 |

Persistent native layouts do not change. Small allocator and heap differences are not claimed as memory improvements. The empty-replacement lifetime fix removes retained unused bindings; it does not compress application Footage.

## Verification

All 276 tests pass with 100% statements, branches, functions and lines (432 statements, 295 branches, 33 functions and 386 lines). Both TypeScript checks pass. All 192 canonical snapshot/serialization comparisons pass, including exact JSON, MessagePack, gzip and V8 serialization sizes. ACK, DM, ordering and compaction expectations are unchanged.

No new SIMD, ILP or MLP gain is claimed. This removes one JS-to-Wasm transition and numeric staging per replacement. Existing native traversal and fixed-record vector transfers are unchanged.

Commands use P = temp/optimization_2026_11_11:

- node --expose-gc P/empty-binding-probe.mjs anchor (and scalarreplace)
- node --expose-gc P/empty-replace-guard.mjs anchor,empty,emptydirect empty-replace
- node --expose-gc P/empty-replace-guard.mjs anchor,emptydirect,scalarreplace scalar-replace
- node P/full.mjs current,emptydirect,scalarreplace 5 recoveryscalar

Raw samples, the failing old-build test, frozen sources and linked artifacts remain under P. No external workload or competitor was changed or run.
