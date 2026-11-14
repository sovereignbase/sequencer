# Traversal directory: native memory and artifacts

Same allocator collector, toolchain, build flags, minifier and compression settings. Native figures are live allocated bytes per Projection, measured across 10,000 simultaneously live Projections (median of three fresh module runs). This is not reserved Wasm capacity or process RSS. Native tuple storage is unchanged; the small reported tuple difference is shared allocator bookkeeping amortization. JS process heap estimates are retained in raw output and are not precise object-size measurements.

| Shape     | Checkpoint B/Projection | Directory B/Projection | Difference | Change |
| :-------- | ----------------------: | ---------------------: | ---------: | -----: |
| empty     |                254.5544 |               246.5544 |    -8.0000 | -3.14% |
| single    |                534.5544 |               494.5552 |   -39.9992 | -7.48% |
| sequence8 |                534.5544 |               494.5552 |   -39.9992 | -7.48% |
| tuple8    |               1054.6112 |              1054.5560 |    -0.0552 | -0.01% |
| edited8   |               3505.2584 |              3155.2640 |  -349.9944 | -9.98% |

| Artifact / encoding     | Checkpoint B | Directory B | Difference | Change |
| :---------------------- | -----------: | ----------: | ---------: | -----: |
| index.js / rawBytes     |       151339 |      153466 |       2127 |  1.41% |
| index.js / minBytes     |       123281 |      125292 |       2011 |  1.63% |
| index.js / gzipBytes    |        44271 |       44528 |        257 |  0.58% |
| index.js / brotliBytes  |        36532 |       36501 |        -31 | -0.08% |
| index.cjs / rawBytes    |       151492 |      153619 |       2127 |  1.40% |
| index.cjs / minBytes    |       124584 |      126595 |       2011 |  1.61% |
| index.cjs / gzipBytes   |        44424 |       44684 |        260 |  0.59% |
| index.cjs / brotliBytes |        36688 |       36675 |        -13 | -0.04% |
| wasm / rawBytes         |        90876 |       92506 |       1630 |  1.79% |
| wasm / gzipBytes        |        36806 |       37039 |        233 |  0.63% |
| wasm / brotliBytes      |        30175 |       30235 |         60 |  0.20% |

The arena retains one owning allocation. Canonical Insertions remain 36 B; the eight node lanes use 32 B/slot instead of 48 B. Block rows and cached sums occupy the end of the same allocation. Empty Projections allocate no arena. The class layout shrinks by 8 B on wasm32. Serialization is unchanged; exact snapshots and their JSON, MessagePack, gzip and V8 sizes agree in all 192 paired cases. Lifecycle storage/memory and timing acceptance still require the complete guard.

Commands:

```powershell
node --expose-gc archives/optimizations_2026_11_10/memory.ts temp/optimization_2026_11_12/directory-workspace/src temp/optimization_2026_11_12/directory-memory.json temp/optimization_2026_11_12/directory-workspace/dist
```

Raw checkpoint and candidate collector outputs, extracted Wasm and all intermediate minified outputs are retained under `temp/optimization_2026_11_12/fixed-table-memory*` and `directory-memory*`. No competitor was run.
