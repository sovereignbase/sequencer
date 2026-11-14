# Traversal directory: native memory and artifacts

Same allocator collector, toolchain, build flags, minifier and compression settings. Native figures are live allocated bytes per Projection, measured across 10,000 simultaneously live Projections (median of three fresh module runs). This is not reserved Wasm capacity or process RSS. Tuple register storage is unchanged; the Projection header and shared allocator bookkeeping are included. JS process heap estimates are retained in raw output and are not precise object-size measurements.

| Shape     | Checkpoint B/Projection | Directory B/Projection | Difference |  Change |
| :-------- | ----------------------: | ---------------------: | ---------: | ------: |
| empty     |                254.5544 |               158.5544 |   -96.0000 | -37.71% |
| single    |                534.5544 |               406.5552 |  -127.9992 | -23.95% |
| sequence8 |                534.5544 |               406.5552 |  -127.9992 | -23.95% |
| tuple8    |               1054.6112 |               966.5456 |   -88.0656 |  -8.35% |
| edited8   |               3505.2584 |              3204.3888 |  -300.8696 |  -8.58% |

| Artifact / encoding     | Checkpoint B | Directory B | Difference | Change |
| :---------------------- | -----------: | ----------: | ---------: | -----: |
| index.js / rawBytes     |       151339 |      149801 |      -1538 | -1.02% |
| index.js / minBytes     |       123281 |      121346 |      -1935 | -1.57% |
| index.js / gzipBytes    |        44271 |       43942 |       -329 | -0.74% |
| index.js / brotliBytes  |        36532 |       36609 |         77 |  0.21% |
| index.cjs / rawBytes    |       151492 |      149956 |      -1536 | -1.01% |
| index.cjs / minBytes    |       124584 |      122768 |      -1816 | -1.46% |
| index.cjs / gzipBytes   |        44424 |       44128 |       -296 | -0.67% |
| index.cjs / brotliBytes |        36688 |       36725 |         37 |  0.10% |
| wasm / rawBytes         |        90876 |       89121 |      -1755 | -1.93% |
| wasm / gzipBytes        |        36806 |       36376 |       -430 | -1.17% |
| wasm / brotliBytes      |        30175 |       30148 |        -27 | -0.09% |

The arena retains one owning allocation. Canonical Insertions remain 36 B; the eight node lanes use 32 B/slot instead of 48 B. Block rows and cached sums occupy the end of the same allocation. Empty Projections allocate no arena. The class layout shrinks by 96 B on wasm32. Serialization is unchanged; exact snapshots and their JSON, MessagePack, gzip and V8 sizes agree in all 192 paired cases. Lifecycle storage/memory and timing acceptance still require the complete guard.

Commands:

```powershell
node --expose-gc archives/optimizations_2026_11_10/memory.ts temp/optimization_2026_11_12/lazy-frontier-workspace/src temp/optimization_2026_11_12/lazy-frontier-memory.json temp/optimization_2026_11_12/lazy-frontier-workspace/dist
```

Raw checkpoint and candidate collector outputs, extracted Wasm and all intermediate minified outputs are retained under `temp/optimization_2026_11_12/fixed-table-memory*` and `lazy-frontier-memory*`. No competitor was run.
