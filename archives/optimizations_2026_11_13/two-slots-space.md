# Traversal directory: native memory and artifacts

Same allocator collector, toolchain, build flags, minifier and compression settings. Native figures are live allocated bytes per Projection, measured across 10,000 simultaneously live Projections (median of three fresh module runs). This is not reserved Wasm capacity or process RSS. Tuple register storage is unchanged; the Projection header and shared allocator bookkeeping are included. JS process heap estimates are retained in raw output and are not precise object-size measurements.

| Shape     | Checkpoint B/Projection | Directory B/Projection | Difference |  Change |
| :-------- | ----------------------: | ---------------------: | ---------: | ------: |
| empty     |                254.5544 |               238.5544 |   -16.0000 |  -6.29% |
| single    |                534.5544 |               414.5600 |  -119.9944 | -22.45% |
| sequence8 |                534.5544 |               414.5600 |  -119.9944 | -22.45% |
| tuple8    |               1054.6112 |               966.6112 |   -88.0000 |  -8.34% |
| edited8   |               3505.2584 |              3195.3816 |  -309.8768 |  -8.84% |

| Artifact / encoding     | Checkpoint B | Directory B | Difference | Change |
| :---------------------- | -----------: | ----------: | ---------: | -----: |
| index.js / rawBytes     |       151339 |      148825 |      -2514 | -1.66% |
| index.js / minBytes     |       123281 |      120984 |      -2297 | -1.86% |
| index.js / gzipBytes    |        44271 |       43953 |       -318 | -0.72% |
| index.js / brotliBytes  |        36532 |       36547 |         15 |  0.04% |
| index.cjs / rawBytes    |       151492 |      148980 |      -2512 | -1.66% |
| index.cjs / minBytes    |       124584 |      122278 |      -2306 | -1.85% |
| index.cjs / gzipBytes   |        44424 |       44106 |       -318 | -0.72% |
| index.cjs / brotliBytes |        36688 |       36748 |         60 |  0.16% |
| wasm / rawBytes         |        90876 |       88952 |      -1924 | -2.12% |
| wasm / gzipBytes        |        36806 |       36465 |       -341 | -0.93% |
| wasm / brotliBytes      |        30175 |       30213 |         38 |  0.13% |

The arena retains one owning allocation. Canonical Insertions remain 36 B; the eight node lanes use 32 B/slot instead of 48 B. Block rows and cached sums occupy the end of the same allocation. Empty Projections allocate no arena. The class layout shrinks by 16 B on wasm32. Serialization is unchanged; exact snapshots and their JSON, MessagePack, gzip and V8 sizes agree in all 192 paired cases. Lifecycle storage/memory and timing acceptance still require the complete guard.

Commands:

```powershell
node --expose-gc archives/optimizations_2026_11_10/memory.ts temp/optimization_2026_11_12/two-slots-workspace/src temp/optimization_2026_11_12/two-slots-memory.json temp/optimization_2026_11_12/two-slots-workspace/dist
```

Raw checkpoint and candidate collector outputs, extracted Wasm and all intermediate minified outputs are retained under `temp/optimization_2026_11_12/fixed-table-memory*` and `two-slots-memory*`. No competitor was run.
