# Final retained state

Date: 2026-09-15

## Source decision

The source retains only:

```text
linear reference-count queue garbage collection
```

The projected endpoint cache, Gate/no-diff early return, position-directed Gate
search, bidirectional Gate search, and zero-visible jump skip are absent. The
production WASM and distribution bundles were rebuilt after every rejected
candidate was reverted.

## Verification

```text
TypeScript noEmit: passed
Vitest files: 10/10 passed
Vitest tests: 23/23 passed
10,000 deterministic convergence deliveries: passed
generative convergence stress: passed
production WASM build: passed
distribution build: passed
```

## Final smoke benchmark

The repeated final command completed the 0 -> 100 -> 0 lifecycle in 2.1
seconds:

```text
node --expose-gc --experimental-strip-types benchmark/index.ts \
  --runs 1 --max-strips 100 --warmup-cycles 64 --no-output
```

Full-lifecycle averages:

| operation     | average µs | maximum µs |
| ------------- | ---------: | ---------: |
| tailInsert    |     14.696 |    166.700 |
| headInsert    |     11.138 |     42.700 |
| headRemove    |     44.304 |    488.600 |
| tailRemove    |     54.572 |    820.000 |
| randomFind    |      4.601 |     87.600 |
| randomRemove  |     21.658 |    112.300 |
| randomReplace |     26.095 |    356.900 |
| randomInsert  |     15.479 |    191.100 |
| randomIngest  |     39.673 |    181.300 |

All hot averages are below 100 µs at this scale, but the maximum-latency target
is not achieved. The first final smoke invocation exited once in
`randomIngest -> replace`; an immediate identical rerun completed. This was not
treated as an optimization result or hidden by a source change and should be
rechecked when work resumes.

Cold operations remained below the 50,000 µs hard limit in this smoke run.
Create at the 1,000-Strip scale-up checkpoint was previously measured at
40,727.4 µs with the retained linear collector.
