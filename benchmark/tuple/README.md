# Tuple benchmarks

[All benchmarks](../README.md)

```powershell
npm run bench:tuple
npm run bench:tuple -- --sizes 1000 --runs 3
```

Compares fixed tuples, dynamic tuples and ordinary sequences through the public
API. Each fixture contains one Frame per scattered Insertion. Tuple indices stay
fixed; ordinary sequence edits shift positions. Remote insert, remove and replace
Gossip is authored before timing. Apply results are checked against the author.

Three runs cover 100, 1,000 and 10,000 indices. Reports include ops/s, one-instance
memory estimates and MessagePack/gzip KiB. Results write automatically to
`benchmark/.results/tuple.json` and [tuple.md](../.results/tuple.md).

`--sizes`, `--runs` and `--output` override defaults; `--no-output` preserves existing
reports. `--baseline <bundle>` adds an earlier ESM bundle as an ordinary-sequence
control. Comparison order alternates between runs. Fixture work, peer calls,
encoding, validation, destruction and explicit JS process garbage collection are
outside timings.
