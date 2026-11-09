# Tuple benchmarks

[All benchmarks](../README.md)

```powershell
npm run bench:tuple
npm run bench:tuple -- --sizes 2,4,8 --runs 3
```

Compares static tuples (`maxLength` supplied) with ordinary Projections through
the public API. Both hold the same field values. Each field is replaced once;
the compacted snapshot is hydrated into an isolated runtime for measurement.
Random replacements preserve the field count in both modes. Inserts and removals
are excluded because stable tuple indices and shifting sequence positions have
different semantics.

Three runs cover 2, 4, 8 and 100 indices. Bursts contain 131,072 calls for
individual reads, 512 for construction and 4,096 for other methods. Each case
warms up for at least 25 ms of API time, then measures at least 50 ms in repeated
bursts. Each burst starts from the same retained state, bounding mutation history.
Remote replacement Gossip is authored before timing;
results are checked against the author. Local results are checked against an
independent array of expected values.

Reports include ops/s, one-instance allocation estimates and MessagePack/gzip
KiB. Memory is sampled before export: live native allocator bytes plus retained
JS array slots, relative to an unused runtime. It includes buffers exercised by
hydration; unused WASM capacity, JS object headers and payload objects are excluded.
Results write automatically to
`benchmark/.results/tuple.json` and [tuple.md](../.results/tuple.md).
Report writes also refresh the README's **Tuple mode** benchmark section with
all configured sizes, including throughput and memory/storage estimates.
Lifecycle report writes preserve that section. CI runs both benchmarks.

`--sizes`, `--runs` and `--output` override defaults; `--no-output` preserves existing
reports. Sizes are limited to 1–100 indices. Comparison order alternates between runs.
Fixture work, peer calls,
encoding, validation, destruction and explicit JS process garbage collection are
outside timings.
