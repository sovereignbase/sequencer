# Editing and apply experiments

The baseline is commit `7189b28764b778256f563ad132803112d0d29da7`.
A fresh complete three-run lifecycle, throughput and tuple baseline preceded
source changes. Checkpoints recreate both peers from the same compact snapshot.
These results therefore use the corrected checkpoint and live-allocation model.

Node 24.16.0, V8 13.6.233.17-node.49, Windows x64, Intel Core i5-10210U;
Emscripten 6.0.12, Clang 24.0.0, CMake 4.4.4. Release, LTO, SIMD, bulk memory
and Wasm exceptions remain unchanged. No competing implementation was measured.

## Position lookup: rejected

The initial public-API CPU profile attributed 23.185 ms of a 65.64 ms remote
replacement burst to `Projection::position_of`. The paired outward walks already
provide two independent memory streams. Each stream's next address depends on its
previous load, so SIMD cannot combine their iterations directly. Further
unrolling would add dependent work rather than remove the search.

The existing lookup records a position when its initial scan crosses the retained
gate. The experiments also tried stopping its final jump walk at that gate.
All versions retained jump construction: an earlier experiment had already shown
that skipping it damages subsequent local traversal.

| Version | Change                                                                                                           | Evidence and decision                                                                                                                                                                                                                                                                                          |
| ------- | ---------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1       | Stop the initial locating scan and final walk at the gate; resolve the target gate after jump repair.            | 272 tests passed. Targeted random insertion/replacement apply improved, but the full suite was mixed and ESM gzip grew by 13 B. Not retained.                                                                                                                                                                  |
| 2       | Remove the extra target-gate return from version 1.                                                              | 272 tests passed. Five matched complete-suite pairs improved growing apply latency by 21.3%, shrinking apply by 4.9%, and whole-lifecycle apply by 13.2%. All measured snapshot sizes and allocation estimates matched. Five direct public-API pairs nevertheless slowed head removal by 11.7–26.9%; rejected. |
| 3       | Preserve the original initial scan; use an int64 sentinel for the known position and separate final gate checks. | Five targeted pairs did not establish a clean overall gain. Head removal median was 5.3% slower with overlapping distributions. Rejected.                                                                                                                                                                      |
| 4       | Preserve the original optional position and initial scan; combine final head/gate endpoint checks.               | 272 tests passed. Five targeted pairs included a 21.8% higher median for fresh linear removal application. No reliable overall improvement; rejected.                                                                                                                                                          |

Version 2's lifecycle apply medians and IQRs, in ns:

| Phase           | Baseline median (IQR) | Candidate median (IQR) |
| --------------- | --------------------: | ---------------------: |
| Growing         |      13,194.6 (202.8) |       10,384.3 (162.0) |
| Shrinking       |      11,491.3 (252.3) |       10,926.3 (171.9) |
| Whole lifecycle |      12,336.3 (568.3) |       10,707.0 (206.8) |

The five direct head-removal pairs, in ns, were 1,085.6 → 1,320.3,
1,100.2 → 1,229.3, 1,422.5 → 1,680.1, 1,077.4 → 1,250.0 and
1,017.6 → 1,291.6. The cause was not established; register pressure remains
a hypothesis. The production position lookup was restored completely.

## Input validation and copying: rejected

Version 7 combined ordinary-array validation and input-buffer stores in one loop,
removing the second copy pass and six-word store branch. All 272 tests passed with
100% TypeScript coverage. The complete three-run suite was compared across all
424 timing rows. Five additional matched process pairs used 25 warmup replays
before ten measured replays for each fresh insert/remove/replace batch.

The combined loop reduced linear removal latency, but linear insertion in
64-entry batches increased from a 0.731 ms median to 0.843 ms (+15.4%). The five
baseline observations were 0.592, 0.831, 0.830, 0.731 and 0.700 ms; candidate
observations were 0.606, 0.847, 0.843, 0.923 and 0.814 ms. Rejected despite
removing 224 raw ESM bytes and 41 gzip bytes.

Version 8 retained the six-word stores and tested unsigned conversion equality
instead of separate integer and range checks. Complete three-run suites and five
longer-warmup process pairs showed mixed results without a dependable overall
gain. ESM gzip size was unchanged. Rejected; the original validation remains.

Two intervening diagnostics (versions 5 and 6) were discarded during the build
audit: restoring a file with its old modification time had left an older native
object in the incremental build. Their timings are not evidence for either
source change. Restored native files were rebuilt explicitly; versions 7 and 8
were verified against a byte-identical baseline Wasm module.

## Measurement files

Raw reports, frozen candidate sources/bundles, profiles, symbol maps, paired
observations and comparison scripts remain in the ignored directory
`temp/optimization_2026_11_10_editing/`. Baseline and candidate used identical
procedures within each comparison. Complete matched pairs used fixed primary
and peer Session entropy and identical per-pair workload seeds; production
entropy and benchmark implementations were not changed.

Short independent processes also produced large differences in unchanged
getters. Those differences are diagnostics, not claimed speedups. Direct
monomorphic callers and longer warmed bursts were used to investigate suspicious
rows before deciding whether to retain a change.
