# Traversal directory: native memory and artifacts

Same allocator collector, toolchain, build flags, minifier and compression settings. Native figures are live allocated bytes per Projection, measured across 10,000 simultaneously live Projections (median of three fresh module runs). This is not reserved Wasm capacity or process RSS. Tuple register storage is unchanged; the Projection header and shared allocator bookkeeping are included. JS process heap estimates are retained in raw output and are not precise object-size measurements.

| Shape     | Checkpoint B/Projection | Directory B/Projection | Difference | Change |
| :-------- | ----------------------: | ---------------------: | ---------: | -----: |
| empty     |                254.5544 |               238.5544 |   -16.0000 | -6.29% |
| single    |                534.5544 |               486.5544 |   -48.0000 | -8.98% |
| sequence8 |                534.5544 |               486.5544 |   -48.0000 | -8.98% |
| tuple8    |               1054.6112 |              1038.6072 |   -16.0040 | -1.52% |
| edited8   |               3505.2584 |              3198.5720 |  -306.6864 | -8.75% |

| Artifact / encoding     | Checkpoint B | Directory B | Difference | Change |
| :---------------------- | -----------: | ----------: | ---------: | -----: |
| index.js / rawBytes     |       151339 |      150248 |      -1091 | -0.72% |
| index.js / minBytes     |       123281 |      122312 |       -969 | -0.79% |
| index.js / gzipBytes    |        44271 |       44074 |       -197 | -0.44% |
| index.js / brotliBytes  |        36532 |       36402 |       -130 | -0.36% |
| index.cjs / rawBytes    |       151492 |      150401 |      -1091 | -0.72% |
| index.cjs / minBytes    |       124584 |      123615 |       -969 | -0.78% |
| index.cjs / gzipBytes   |        44424 |       44222 |       -202 | -0.45% |
| index.cjs / brotliBytes |        36688 |       36553 |       -135 | -0.37% |
| wasm / rawBytes         |        90876 |       90241 |       -635 | -0.70% |
| wasm / gzipBytes        |        36806 |       36622 |       -184 | -0.50% |
| wasm / brotliBytes      |        30175 |       30171 |         -4 | -0.01% |

The arena retains one owning allocation. Canonical Insertions remain 36 B; the eight node lanes use 32 B/slot instead of 48 B. Block rows and cached sums occupy the end of the same allocation. Empty Projections allocate no arena. The class layout shrinks by 16 B on wasm32. Serialization is unchanged; exact snapshots and their JSON, MessagePack, gzip and V8 sizes agree in all 192 paired cases. Lifecycle storage/memory and timing acceptance still require the complete guard.

Commands:

```powershell
node --expose-gc archives/optimizations_2026_11_10/memory.ts temp/optimization_2026_11_12/directory-lazy-workspace/src temp/optimization_2026_11_12/directory-lazy-memory.json temp/optimization_2026_11_12/directory-lazy-workspace/dist
```

Raw checkpoint and candidate collector outputs, extracted Wasm and all intermediate minified outputs are retained under `temp/optimization_2026_11_12/fixed-table-memory*` and `directory-lazy-memory*`. No competitor was run.
