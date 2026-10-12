# Snapshot visitation by arena index — rejected

The original snapshot exporter allocates a hash node for every retained insertion,
including insertions that have no fragments and cannot appear a second time.
The experiment used the existing canonical arena index to recognize fragments.
Unfragmented insertions need no visitation entry. The public data model, snapshot
layout, acknowledgements, ordering, Footage ownership, and algorithms stay intact.

## Variants

1. A zero-initialized visitation vector indexed by canonical arena index.
2. Only allocate that vector for actual fragment chains, rather than every strip
   marked fragmented by a prior edit.
3. Eight stack entries for small surviving snapshots; promote to the indexed vector
   only after those entries fill. The first variant's arena-sized initialization
   regressed a heavily compacted small snapshot by approximately 41–45%.

The final variant is preserved in `experiment.patch`. It is not in production.

Five alternating targeted process pairs showed substantial large snapshot wins.
The initial vector changed prepend export from 1.531 to 0.922 ms, random character
export from 1.994 to 1.055 ms, and concurrent export from 2.116 to 1.398 ms.
The stack variant retained large-snapshot improvements and removed the small
compacted-snapshot initialization cost. All raw runs, including unfavorable
cold-call results, are retained in `matched-*`, `refined-*`, and `small-*` JSON.

Those wins were not sufficient for acceptance. The five-run complete suite is
retained as `baseline-five.*.json` and `candidate-five.*.json`. A further guard
used five isolated full-suite process pairs, alternating execution order and
fixing Session entropy with `seed.mjs`; workload dimensions and CLI workload seed
were unchanged. That comparison is `paired-suite-diff.json`. It still showed
regressions, including lifecycle `remove.tail` +20.4%, `replace.head` +13.6%,
and full-lifecycle random reads +12.2%. Several throughput medians also regressed.
Their complete distributions and IQRs are in the comparison; they are not hidden
behind the snapshot-export improvement.

One initial full-suite process exited with status 1 before report completion.
Its diagnostic was not sufficient to establish a cause. The completed repeat
was kept. An interrupted targeted process briefly overlapped the preliminary
suite; the acceptance guard uses the later serial process pairs. The partial
`target-*` files and preliminary reports are not the acceptance measurements.

`artifact-sizes.json` records the final stack variant: ESM 117,880 → 116,555 bytes;
gzip 39,268 → 38,914; WASM 73,175 → 72,233. JS outside the WASM literal is identical.
Snapshot bytes are unchanged for the same content and identities.

The original 167 tests passed for the first vector variant. The final stack variant
also passed the public-API snapshot/hydration/replay/COW diagnostic in `validation.json`.
This is not a claim of exhaustive model proof. It was rejected before release.

## Reproduction and analysis

The exact artifact paths used during the session were
`temp/strip-runs/session-baseline-dist/index.js`, `indices-candidate-dist/index.js`,
`indices-refined-dist/index.js`, and `indices-small-dist/index.js`.
`compare.mjs` compares every lifecycle and throughput row and reports medians,
IQRs, and raw distributions. It also accepts comma-separated per-process report
basenames. `memory.mjs` records isolated post-GC snapshot heap and exported WASM
memory capacity; these are not process RSS or allocator live-byte counts.

```powershell
node --import ./archives/optimizations_12_10_2026/sequence_indices/seed.mjs --expose-gc benchmark/index.ts --runs 1 --max-strips 10000 --output paired-candidate-1.json
node --expose-gc archives/optimizations_12_10_2026/column_snapshot/measure.mjs dist/index.js target.json
node --expose-gc archives/optimizations_12_10_2026/sequence_indices/memory.mjs dist/index.js memory.json
```

CPU profile: `CPU.20261012.193110.11396.0.001.cpuprofile`. Native dispatch accounted
for the largest sampled WASM function; inlining prevents attribution of every
sample to the visitation hash table. The allocation removal is also established
directly by the source change. No exact percentage of total CPU time is attributed
to the hash table.

SIMD: the structural walk remains dependent on the previous arena link. The small
table has early exits; no SIMD speedup is claimed. ILP: canonical root and output
position checks remain scalar. MLP: an indexed lookup removes hash-node pointer
chasing, but the next structural node is still dependent on the current node.
No independent-walker or MLP improvement is claimed.

Environment and compiler flags are identical to the column-snapshot experiment.
Decision: reverted, because the required full-suite regression guard did not pass.
The source-only wins must not be advertised as delivered runtime performance.
