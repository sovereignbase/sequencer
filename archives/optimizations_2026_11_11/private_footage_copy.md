# First private Footage snapshot

Measurements span 11–12 November 2026. This candidate replaces identity-map copying of private Footage with slice. Caller/retained Footage copying and failed-copy retry behavior remain unchanged. Native code revokes write ownership before export; later extensions and masking still detach exported arrays. No native field, public signature or snapshot word changes.

This conditional implementation is superseded by the simpler copy described in [snapshot_copy.md](snapshot_copy.md). Its full guard was stopped during pair 2, before all three builds completed that pair, so those partial samples do not establish full-suite acceptance. The valid completed files remain under the recoveryprivatecopy prefix. The replacement uses slice for both private and retained arrays and removes the conditional branch.

## Rejected direct sharing

Skipping the copy entirely makes the first private snapshot effectively independent of Footage length, but retains spare capacity in the grown JavaScript array. Five heap measurements hold the preallocated input and earlier snapshots live across explicit JS process garbage collection. Input storage is outside each delta. The million-Frame fixture needs about 12 MB before export; the previous map compacts it to 8 MB. Direct sharing keeps 12 MB. This 50% retained-heap increase rejects the experiment before running a complete suite; the targeted speedup is not used to claim acceptance.

Twelve measured rounds after three warmups; alternating order. Each fixture inserts a numeric array followed by a consecutive one-Frame suffix. The first public sequence call is timed once per instance. Setup, JS process garbage collection, full value checks, reconstruction and subsequent edit/snapshot-isolation checks are outside timing. All valid samples are retained. Nanoseconds/call, median (IQR). Separate tables are separate matched invocations.

|    Frames |              emptydirect |        privateexport |  Change |
| --------: | -----------------------: | -------------------: | ------: |
|       100 |      8,024.22 (5,967.58) |  2,035.16 (1,005.86) | -74.64% |
|    10,000 |  347,028.13 (135,564.06) |  3,365.63 (1,364.06) | -99.03% |
| 1,000,000 | 37,166,137.5 (4,948,450) | 11,387.5 (13,768.75) | -99.97% |

|    Frames |                emptydirect |           privatecopy |  Change |
| --------: | -------------------------: | --------------------: | ------: |
|       100 |        8,897.66 (1,728.91) |   2,289.06 (1,112.89) | -74.27% |
|    10,000 |     303,334.37 (16,743.75) |  28,703.12 (5,607.81) | -90.54% |
| 1,000,000 | 24,868,437.5 (4,640,637.5) | 3,912,150 (385,137.5) | -84.27% |

## Retained JavaScript heap

Five samples per size/build. Bytes after export relative to the preallocated-input baseline, median (IQR). These estimates cover the numeric Footage array, wrapper and binding state; they are not process RSS or reserved Wasm capacity.

|    Frames |      Previous map | Direct sharing (rejected) |     Private slice |
| --------: | ----------------: | ------------------------: | ----------------: |
|    10,000 |    80,472 (1,304) |             120,600 (624) |      80,472 (240) |
| 1,000,000 | 7,999,848 (8,408) |        11,999,976 (8,224) | 7,999,848 (8,280) |

Slice preserves the compact retained size without executing a JavaScript callback for every Frame. It still copies the array; the large targeted improvement is not described as zero-copy.

## Artifacts and correctness

The frozen native Wasm is byte-identical to emptydirect. Compiler flags and the production benchmark implementation are unchanged. No new SIMD, ILP or MLP gain is claimed: this removes per-element JavaScript callback work and uses the engine's array-copy builtin. The Wasm graph walks and vector transfers are unchanged.

Same release build, three-pass Terser and compression settings; bytes:

| Artifact              |  Before |   After |  Difference |
| --------------------- | ------: | ------: | ----------: |
| index.js/rawBytes     | 151,422 | 151,475 | 53 (+0.04%) |
| index.js/minBytes     | 123,281 | 123,308 | 27 (+0.02%) |
| index.js/gzipBytes    |  44,231 |  44,240 |  9 (+0.02%) |
| index.js/brotliBytes  |  36,376 |  36,399 | 23 (+0.06%) |
| index.cjs/rawBytes    | 151,575 | 151,628 | 53 (+0.03%) |
| index.cjs/minBytes    | 124,584 | 124,611 | 27 (+0.02%) |
| index.cjs/gzipBytes   |  44,390 |  44,397 |  7 (+0.02%) |
| index.cjs/brotliBytes |  36,541 |  36,543 |  2 (+0.01%) |
| wasm/rawBytes         |  90,952 |  90,952 |  0 (+0.00%) |
| wasm/gzipBytes        |  36,777 |  36,777 |  0 (+0.00%) |
| wasm/brotliBytes      |  30,175 |  30,175 |  0 (+0.00%) |

All 276 tests pass with 100% TypeScript coverage (435 statements, 297 branches, 33 functions, 389 lines). Both TypeScript checks and all 192 canonical snapshot/serialization comparisons pass. Existing extension snapshot-isolation and failed retained-copy retry tests remain unchanged. The targeted guard additionally checks subsequent extension, masking, caller-array isolation and reconstruction for every timed instance.

The three-run 10,000-live-instance collector retains unchanged native representation sizes. The first-export five-sample heap check above addresses grown Footage capacity directly; collector population timings are not used as performance evidence.

Commands use P = temp/optimization_2026_11_11:

- node --expose-gc P/private-snapshot-guard.mjs emptydirect,privateexport private-export
- node --expose-gc P/private-snapshot-guard.mjs emptydirect,privatecopy private-copy
- node --expose-gc P/snapshot-retained-memory.mjs emptydirect (and privateexport/privatecopy)
- node P/shape-check.mjs privatecopy
- node P/full.mjs current,emptydirect,privatecopy 5 recoveryprivatecopy

Frozen sources, artifacts and raw samples remain under P. No external benchmark or competitor was changed or run.
