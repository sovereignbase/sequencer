# Positive subtree endpoints

The [lifecycle profile](circular-directory.md) attributes most replacement
samples to repeated causal subtree walks. Positive subtrees retain their order
as live history grows. The candidate retains each positive root's last proven
endpoint and resumes the existing membership walk there. Mask roots retain the
complete walk; canonical ancestry and sibling ordering rules are unchanged.

The cache adds one four-byte arena lane and its pointer. Growth copies the lane;
freshly allocated nodes start with no retained endpoint. No extra allocation,
wire field or JavaScript state is introduced. The dependent membership walk does
not gain SIMD or MLP; the hypothesis is to avoid walking already proven nodes.

All 276 existing tests, all 192 exact snapshot/serialization pairs and all
eight-author replay and duplicate cases pass. The
[five-pair lifecycle comparison](subtree-cache-lifecycle.md) preserves all rows.
Against its paired checkpoint, full-lifecycle tail replacement is 47.06% faster,
random apply 66.48% faster, random removal 67.92% faster and random values 83.85%
faster. Head insertion remains 16.05% slower in every pair. This is an
experimental build, not an accepted all-row improvement.

Three fresh-module allocation runs with 10,000 simultaneously live Projections
give median native live bytes per instance of 246.5544 empty, 502.5544 single,
502.5544 intact eight-Frame instance, 1054.5560 eight-register tuple and 3299.8016
edited eight-Frame sequence. These include shared allocator bookkeeping, and are
not process RSS or reserved Wasm memory. Raw ESM is 150,572 bytes, minified ESM
122,648, minified ESM gzip 44,264 and Brotli 36,488. Raw Wasm is 90,515 bytes,
gzip 36,783 and Brotli 30,222.

Commands and raw results:

```powershell
node temp/optimization_2026_11_12/production-control.mjs subtree-cache-lifecycle fixed-table,directory-outlined,subtree-cache lifecycle-control.mjs 5
node temp/optimization_2026_11_12/lifecycle-report.mjs subtree-cache-lifecycle fixed-table subtree-cache 5
node --expose-gc archives/optimizations_2026_11_10/memory.ts temp/optimization_2026_11_12/subtree-cache-workspace/src temp/optimization_2026_11_12/subtree-cache-memory.json temp/optimization_2026_11_12/subtree-cache-workspace/dist
```

The subtree lane's memory cost motivates the next separate layout experiment:
move block ordinals from per-node lanes into stable per-block records and move
only the ordered weights and block tokens during directory relocation.
