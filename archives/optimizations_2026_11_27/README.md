# Runtime follow-up, 27 November 2026

Starting revision: `1c7d7deb` (1.2.11). Candidate: `indices`.

## Changes

- Reuse already proven positive child-subtree prefixes when locating a competing subtree boundary. Only positive prefixes are cached; unresolved ancestry still uses canonical membership. No new cache or per-instance field is added.
- Store partial snapshot deletions as bits with one removed-prefix count per 32 Frames. Export surviving ranges rather than scanning every original Frame. Whole-Insertion deletion keeps its existing allocation-free path.
- Advance the Footage source index directly while materializing visible arrays; retain the existing one-span and missing-content paths.

Coordinates, wire words, Actor membership, ACK eligibility and exported results are unchanged. Snapshot export does not rewrite live history.

## Performance

Node 24.16.0, V8 13.6.233.17-node.49, Windows x64, Intel Core i5-10210U. Emscripten 7.0.1, CMake 4.5.1, unchanged Release `-O3 -flto`, SIMD, bulk memory, Wasm exceptions and allocator.

A fresh three-run six-suite baseline precedes source edits. The final guard has five complete runs of each candidate, baseline and byte-identical baseline control, with reversed build order on alternate pairs. Lifecycle/throughput use `lifecycle-pair-0` through `lifecycle-pair-4`; native entropy is fixed identically at `0x13579bdf` and `0x2468ace1` in the frozen harnesses. Production workloads, 64 warmups and timing/call limits remain unchanged.

703 timing and 302 memory/storage rows are compared. The final candidate has 113 timing medians more than 5% faster and 220 more than 5% slower; 26 slower medians are slower in all five pairs. The identical baseline control itself has 116 medians more than 5% faster and 150 more than 5% slower. Neither unfavorable samples nor control variation are discarded.

| Full lifecycle | Baseline µs/call | Candidate µs/call | Median change | Paired IQR, pp |
| -------------- | ---------------: | ----------------: | ------------: | -------------: |
| apply.random   |            3.112 |             3.201 |        +2.83% |          15.15 |
| create         |         1774.269 |          1707.054 |        -3.79% |          17.57 |
| insert.head    |            0.735 |             0.781 |        +6.30% |          29.16 |
| insert.random  |            1.697 |             1.708 |        +0.66% |          25.33 |
| insert.tail    |            0.712 |             0.752 |        +5.66% |          30.48 |
| remove.head    |            1.476 |             1.361 |        -7.78% |          10.04 |
| remove.random  |            2.084 |             2.058 |        -1.21% |          21.96 |
| remove.tail    |            1.351 |             1.312 |        -2.88% |           4.53 |
| replace.head   |            2.067 |             2.100 |        +1.55% |          14.11 |
| replace.random |            2.763 |             2.670 |        -3.36% |          17.51 |
| replace.tail   |           10.182 |             3.744 |       -63.23% |           8.50 |
| sequence       |        12123.717 |         12043.808 |        -0.66% |          16.92 |
| value.head     |            0.376 |             0.382 |        +1.65% |          23.44 |
| value.random   |            1.029 |             1.060 |        +2.93% |          22.68 |
| value.tail     |            0.203 |             0.198 |        -2.65% |          21.26 |
| values         |         7130.375 |          5135.550 |       -27.98% |          15.22 |

Scale-down replace.tail: 18.498 → 5.546 µs/call (-70.02%).

The separate five-pair lifecycle control before the direct-index change does not reproduce the earlier 23.11% full-values loss: it measures −2.58%, with a 22.57 pp paired IQR. The direct-index experiment against that candidate measures −23.52% full-values time, paired IQR 2.75 pp. These separate cohorts remain separate from the final comparison.

The full final tables are `lifecycle-followup/final-full-base-to-indices.json` and `final-full-base-to-control.json` inside the ZIP. Each row retains all observations, medians, IQRs and paired differences. Focused throughput controls retain the earlier unfavorable rows as well.

### Remaining timing differences

6 final timing rows have a median over 5% slower than both baseline copies and are slower than both in every matched run. The all-row no-regression criterion and external ranking targets are not established by this checkpoint.

| Row slower than both controls      | Baseline median | Candidate median |  Change | Paired IQR, pp |
| ---------------------------------- | --------------: | ---------------: | ------: | -------------: |
| throughput/15000/create.empty      |       658.10 ns |        742.56 ns | +12.83% |           6.63 |
| throughput/20000/insert.random     |       885.43 ns |        957.43 ns |  +8.13% |          56.49 |
| tuple/tuple/2/apply.replace        |      1091.40 ns |       1178.63 ns |  +7.99% |          45.34 |
| text/array/65536/values.range      |       134.07 ns |        160.91 ns | +20.02% |          17.23 |
| text/string/1048576/replace.middle |      1368.97 ns |       1634.05 ns | +19.36% |          27.97 |
| text/string/1048576/sequence.text  |       166.40 ns |        204.87 ns | +23.12% |          81.85 |

### Focused rechecks

A separate five-pair, three-build recheck selects the six rows above without changing fixture creation, warmups, timing windows or assertions. Different case selections are not pooled with the complete suite.

| Flagged row                        | Focused change vs baseline | Focused change vs identical control | Paired IQR, pp |
| ---------------------------------- | -------------------------: | ----------------------------------: | -------------: |
| throughput/15000/create.empty      |                    -23.81% |                              -8.49% |          34.84 |
| throughput/20000/insert.random     |                     -0.43% |                              -4.42% |          17.12 |
| tuple/tuple/2/apply.replace        |                     -2.60% |                              +4.69% |           5.37 |
| text/array/65536/values.range      |                     +0.74% |                              -7.97% |          11.61 |
| text/string/1048576/replace.middle |                    +19.92% |                             +17.82% |          18.29 |
| text/string/1048576/sequence.text  |                    -13.31% |                              +3.41% |          14.79 |

The middle text replacement remained slower in that recheck. A further five-pair string-only control at 1,048,576 Frames measures 1578.66 → 1549.73 ns (-1.83%) for the retained candidate. A trial restricting child-prefix reuse to positive walk roots measures 1530.69 ns; its gain over the retained candidate is inconclusive, so it is rejected and fully restored. The rebuild reproduces the measured candidate's native factory and ESM/CommonJS artifacts exactly.

The earlier unfavorable results remain reported. The later controls do not reproduce a consistent loss across these six rows; they do not establish universal zero regression or external first-place rankings. All focused samples and the rejected guard trial remain archived.

## Memory and snapshot control

0 of 302 paired persistent-memory/storage rows change. The bitset reduces temporary compaction storage; it does not claim a general reduction in live Projection heap or RSS.

A separate 1,048,576-Frame text control removes one quarter of the original Insertion and exports 32 snapshots. Three fresh-process runs per build compare the child-prefix candidate before and after bitset compaction. Median snapshot time is 1,971,591 → 263,916 ns (−86.61%). The explicit deletion-map storage changes from 4 bytes per Frame to approximately 0.25 bytes per Frame, with one vector and its sentinel. Process external memory after explicit JS process garbage collection is 14,356,968 → 11,085,008 bytes in the middle samples. RSS samples overlap; no RSS reduction is established. Live per-instance estimates remain unchanged.

## Artifacts

Terser uses three compression passes; gzip level nine and Brotli quality eleven. Source maps are excluded.

| Artifact                                   | Baseline bytes | Candidate bytes | Change |
| ------------------------------------------ | -------------: | --------------: | -----: |
| WebAssembly                                |        121,374 |         123,975 | 2601 B |
| src/typescript/wasm/raw/sequencer_wasm.mjs |        134,489 |         137,211 | 2722 B |
| dist/index.js                              |        204,013 |         207,425 | 3412 B |
| dist/index.js minified                     |        166,801 |         169,840 | 3039 B |
| dist/index.js minified + gzip              |         57,843 |          58,307 |  464 B |
| dist/index.js minified + brotli            |         48,401 |          48,837 |  436 B |
| dist/index.cjs minified                    |        168,462 |         171,501 | 3039 B |
| dist/index.cjs minified + gzip             |         58,054 |          58,517 |  463 B |
| dist/index.cjs minified + brotli           |         48,614 |          48,971 |  357 B |

The gzip size increase pays for the measured subtree and compaction gains; it is not a bundle-size improvement. The 50 KiB gzip goal remains unmet. Raw linked Wasm SHA-256: `84730cd2145fdde912095ebb088750fbd6f88cc8701ad4b2b7c65a3eec6b1638`.

## Generated code and verification

Only two of 129 defined Wasm function bodies change at the same function indices: subtree_end grows 1,024 → 1,205 bytes and sequence grows 14,165 → 16,584 bytes. The other 127 bodies, including runtime_values, are byte-identical. The snapshot function emits 31 scalar i32.popcnt operations, four i32.ctz operations and three memory.fill operations. `code-inspection.json`, the matching symbols and extracted function WAT are included. The disassembly command is recorded there.

The dependent subtree walk benefits by skipping proved work, without claiming new memory-level parallelism. Bitset prefix counting remains scalar; its accumulated rank is dependent. Adding SIMD reductions or extra independent walkers was not justified by this profile. No SIMD/ILP/MLP speedup is inferred from source alone. The JS induction change is supported by public-API timings; no exact V8 machine-instruction saving is claimed.

404 Vitest tests pass with 100% statement, branch, function and line coverage. Type checking and 136 checks across eight compatibility runtimes pass. A new public-API test covers 31/32/33, 63/64/65 and 130 Frames, array/string Footage, overlapping removals, partial/full ACKs and numeric/binary snapshots. Existing expectations are unchanged. The exact mixed-edit differential control compares 91,324 public results with the starting build.

The broader nested-cache experiment was rejected because it adds work without improving on child-prefix reuse. Initial diagnostic counters had an incomplete injected finish path; only the second diagnostic native artifact contains valid aggregate counters. The saved diagnostic C++ predates that second artifact. Acceptance rests on the non-instrumented runs, profiles, exact results and generated production code.

Updated external results were inspected read-only. No external runner, adapter or competitor was modified or rerun; first/second-place performance, encoding, RSS and heap claims remain unverified. Update and document byte formats are unchanged in this follow-up.

[Complete records](details.zip): all full-suite and targeted samples, rejected attempts, frozen sources, profiles, test logs, source/module hashes and comparison scripts. `MANIFEST.sha256` verifies every archived record. The previous checkpoint is preserved inside the same ZIP, including its original manifest and reports. Recreate the byte-identical `control` workspace by copying `base`; `control-identity.json` verifies its source and generated output.
