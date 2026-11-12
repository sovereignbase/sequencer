# Inline authored Acknowledgements

This experiment removes dynamic storage from native Gossip output. Five complete matched runs have 244 timing medians over 5% faster and 36 over 5% slower against current. The isolated directnative comparison has 104 faster and 64 slower medians over 5%. **The all-row condition is not met.** Before: directnative. Candidate: inlineack. The earlier continuation baseline is current. [Every current comparison row](recovery-inline-performance.md) and [every isolated comparison row](recovery-inline-native-performance.md) include dispersion and paired differences.

## Representation

Incoming and retained Acknowledgements still accept arbitrary Actor/Session frontier lists. Native apply and remove only author one or three words. Their output Entry now stores either an Insertion or an inline three-word array in a trivial union, selected by an explicit word count. Zero selects Insertion; one or three selects the Acknowledgement. No Session value is used as a tag. Frontier observation consumes the same counted words. The public Gossip, six coordinate words, output descriptors and snapshot schema are unchanged.

The size assertion changes Entry from 52 to 40 bytes, a 23.1% reduction. Authored Acknowledgements no longer allocate a separate vector payload. Projection and Strip layouts do not change in this experiment.

## Targeted remote calls

Ten measured rounds after four warmups, with rotating order. Each call uses the public API. Duplicate inputs are applied before timing. Fixtures, authoring, snapshot checks and JS process garbage collection remain outside the interval. Median nanoseconds/call and IQR; all valid samples are retained.

| Initial groups / call        |     Current (IQR) | Directnative (IQR) |   Inlineack (IQR) | Versus directnative |
| ---------------------------- | ----------------: | -----------------: | ----------------: | ------------------: |
| 100/apply.insert             |    488.13 (67.14) |      345.9 (51.88) |    285.46 (46.48) |             -17.47% |
| 100/apply.remove             |    841.58 (45.83) |     787.91 (35.09) |     753.4 (83.14) |              -4.38% |
| 100/apply.replace            | 3,566.72 (210.17) |  3,486.44 (224.42) | 3,403.52 (184.01) |              -2.38% |
| 100/merge.insert             | 1,019.66 (108.79) |    700.09 (120.35) |      629.46 (136) |             -10.09% |
| 100/apply.duplicateInsert    |    366.35 (22.59) |     260.34 (90.29) |    232.61 (41.02) |             -10.65% |
| 100/apply.duplicateRemove    |    513.02 (50.93) |     502.57 (55.75) |    408.34 (43.04) |             -18.75% |
| 100/apply.duplicateReplace   |    879.19 (98.29) |     666.75 (40.35) |    610.37 (20.96) |              -8.46% |
| 20000/apply.insert           |     914.1 (87.86) |     540.1 (158.51) |    536.3 (102.17) |              -0.70% |
| 20000/apply.remove           | 1,015.88 (147.04) |      875.2 (90.24) |    823.35 (67.09) |              -5.92% |
| 20000/apply.replace          | 3,645.32 (411.25) |  3,569.25 (118.34) | 3,425.55 (248.17) |              -4.03% |
| 20000/merge.insert           | 1,237.75 (109.95) |     783.23 (48.86) |    831.08 (94.02) |              +6.11% |
| 20000/apply.duplicateInsert  |   408.55 (110.41) |    334.13 (117.21) |       276 (23.49) |             -17.40% |
| 20000/apply.duplicateRemove  |   596.92 (101.61) |    654.25 (135.82) |    525.23 (85.28) |             -19.72% |
| 20000/apply.duplicateReplace |   957.05 (114.06) |      793.6 (82.74) |    643.33 (97.75) |             -18.94% |

All 14 medians improve against current. Against directnative, 13 improve and large-document merge.insert is slower. These targeted rows do not replace the complete guard.

## Live instance memory

Three runs of 10,000 simultaneously live Projections in one Wasm instance. The instance container is allocated before sampling. Native bytes are live allocator bytes, not total reserved linear memory. JS heap deltas follow explicit JS process garbage collection; application object contents are outside the slot estimate.

| Shape     | Native B/instance before |    After | JS B/instance before |  After |
| --------- | -----------------------: | -------: | -------------------: | -----: |
| empty     |                   262.56 |   262.56 |               202.56 | 202.56 |
| single    |                   542.56 |   542.56 |               402.43 | 402.33 |
| sequence8 |                   542.56 |   542.56 |                378.2 | 378.29 |
| tuple8    |                 1,390.66 | 1,392.59 |               380.73 | 380.73 |
| edited8   |                 3,511.93 | 3,514.38 |               914.84 |    913 |

Persistent representation sizes stay unchanged. The collector observes about 1.93 more native bytes per tuple instance and 2.46 more per edited instance; these small allocator differences are reported rather than claimed as savings. Shared output Entry storage is smaller. The heap collector timings are not used as throughput evidence.

## Artifacts

Same release/LTO/SIMD/Wasm-exception settings and three-pass Terser procedure.

| Artifact              | Before bytes | After bytes |      Difference |
| --------------------- | -----------: | ----------: | --------------: |
| index.js/rawBytes     |      155,657 |     151,564 | -4,093 (-2.63%) |
| index.js/minBytes     |      127,424 |     123,392 | -4,032 (-3.16%) |
| index.js/gzipBytes    |       45,579 |      44,208 | -1,371 (-3.01%) |
| index.js/brotliBytes  |       37,385 |      36,469 |   -916 (-2.45%) |
| index.cjs/rawBytes    |      155,810 |     151,717 | -4,093 (-2.63%) |
| index.cjs/minBytes    |      128,727 |     124,695 | -4,032 (-3.13%) |
| index.cjs/gzipBytes   |       45,734 |      44,362 | -1,372 (-3.00%) |
| index.cjs/brotliBytes |       37,525 |      36,547 |   -978 (-2.61%) |
| wasm/rawBytes         |       94,342 |      91,043 | -3,299 (-3.50%) |
| wasm/gzipBytes        |       38,023 |      36,794 | -1,229 (-3.23%) |
| wasm/brotliBytes      |       31,076 |      30,175 |   -901 (-2.90%) |

## Generated Wasm and correctness

All 274 tests and both type checks pass. The 192 exact canonical snapshot comparisons against the original frozen build pass, including JSON, MessagePack, gzip and V8 serialization sizes. Correctness expectations were not weakened.

Linked artifacts were extracted from the distributed module and disassembled with the same wasm-dis. The old Entry-vector destructor and Entry slow-append symbols disappear. The following counts are static call sites within each linked function, not runtime call totals.

| Function                       | Direct new sites before / after | Direct free sites before / after | WAT lines before / after |
| ------------------------------ | ------------------------------: | -------------------------------: | -----------------------: |
| sequencer::Projection::apply(  |                           2 / 1 |                          18 / 15 |              5548 / 5479 |
| sequencer::Projection::remove( |                           3 / 3 |                           12 / 7 |              2594 / 2528 |

SIMD: fixed copies and vector stores remain in generated code; no new SIMD kernel is claimed. ILP: eliminating payload allocation removes serialized work, without claiming instruction overlap. MLP: exposing inline output removes a payload indirection; the underlying graph traversal is unchanged and no additional independent memory stream is claimed.

Raw distributions, frozen builds, memory samples and WAT inspection are under `temp/optimization_2026_11_11`. Reproduce the full guard with `node P/full.mjs current,directnative,inlineack 5 recoveryinline`, where P is that directory. No external benchmark or competitor was changed or run.
