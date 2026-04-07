# Rust/WASM CRList Experiment

Status: archived experiment.

This documents the Rust/WASM CRList experiment before removing the experimental
`rust/` workspace.

## Goal

Evaluate whether a Rust implementation of the CRList core, compiled to
WebAssembly, is faster than the current TypeScript implementation.

The important comparison is the usable JavaScript-facing path, not just native
Rust. A native Rust benchmark can show whether the internal data-structure code
is fast, but it does not prove that a WASM package is faster once JavaScript data
must cross the WASM boundary.

## Dependency Check

The experiment used:

- `wasm-bindgen 0.2.117`
- `serde 1.0.228`
- `serde_json 1.0.x`
- `serde-wasm-bindgen 0.6.5`

Checked dependency state:

- `wasm-bindgen 0.2.117`: MIT OR Apache-2.0, current at test time, not yanked.
- `serde 1.0.228`: MIT OR Apache-2.0, current at test time, not yanked.
- `serde-wasm-bindgen 0.6.5`: MIT, not yanked, used only for JS/WASM value conversion.

## TypeScript Baseline

Existing TypeScript benchmark, `n = 5,000`:

```text
group   scenario                    n      ops    ms         ms/op  ops/sec
------  --------------------------  -----  -----  ---------  -----  ---------
create  hydrate snapshot            5,000  1,000  50,435.43  50.44  19.83
read    random indexed reads        5,000  1,000  77.69      0.08   12,871.57
update  append after tail           5,000  1,000  13.18      0.01   75,870.81
update  insert before middle        5,000  1,000  77.89      0.08   12,837.98
update  overwrite random            5,000  1,000  78.90      0.08   12,674.79
delete  single deletes from middle  5,000  1,000  37.95      0.04   26,349.00
delete  range deletes               5,000  626    22.40      0.04   27,943.68
mags    snapshot                    5,000  1,000  39,123.60  39.12  25.56
mags    acknowledge                 5,000  1,000  2,859.43   2.86   349.72
mags    garbage collect             5,000  1,000  863.28     0.86   1,158.37
mags    merge ordered deltas        5,000  1,000  22.08      0.02   45,299.29
mags    merge shuffled gossip       5,000  1,000  4,181.36   4.18   239.16
```

This is the production-relevant baseline.

## Native Rust Result

Native Rust looked fast when benchmarked without the JavaScript/WASM boundary:

```text
create hydrate snapshot      ops= 1000 ms=     33.73 ms/op=  0.0337 ops/sec=  29649.13
read random indexed reads    ops= 1000 ms=      4.39 ms/op=  0.0044 ops/sec= 227650.42
merge ordered deltas         ops= 1000 ms=      3.14 ms/op=  0.0031 ops/sec= 318877.55
merge reversed gossip        ops= 1000 ms=    883.53 ms/op=  0.8835 ops/sec=   1131.83
```

This result does not translate directly to the package API. It only shows that
the Rust data-structure code can be fast when the input is already in Rust-owned
memory.

## Node/WASM Object API Result

Node/WASM benchmark using normal JavaScript objects through `serde-wasm-bindgen`:

```text
wasm object create hydrate snapshot ops=  100 ms=  27499.50 ms/op=274.9950 ops/sec=      3.64
wasm object read random indexed reads ops= 1000 ms=     29.31 ms/op=  0.0293 ops/sec=  34113.97
wasm object merge ordered deltas ops= 1000 ms=    100.03 ms/op=  0.1000 ops/sec=   9996.76
wasm object merge reversed gossip ops=  250 ms=    506.10 ms/op=  2.0244 ops/sec=    493.97
```

Compared to TypeScript:

- Create is much worse: `274.9950ms/op` vs `50.44ms/op`.
- Ordered merge is worse: `0.1000ms/op` vs `0.02ms/op`.
- Reversed/shuffled merge is faster than the shown TypeScript shuffled baseline:
  `2.0244ms/op` vs `4.18ms/op`, but this was not the main hot-path target and
  used a smaller `ops = 250` run.
- Read is faster: `0.0293ms/op` vs `0.08ms/op`, but read was already cheap in
  TypeScript and is not enough to justify a WASM core.

## Node/WASM JSON Bytes API Result

Second boundary experiment: pass pre-encoded JSON bytes into WASM and parse with
`serde_json::from_slice`.

```text
wasm bytes create hydrate snapshot ops=  100 ms=  48612.21 ms/op=486.1221 ops/sec=      2.06
wasm bytes merge ordered deltas  ops= 1000 ms=     25.76 ms/op=  0.0258 ops/sec=  38814.30
wasm bytes merge reversed gossip ops=  250 ms=    536.01 ms/op=  2.1441 ops/sec=    466.41
```

Compared to object WASM:

- JSON bytes improved ordered merge: `0.0258ms/op` vs `0.1000ms/op`.
- JSON bytes made create worse: `486.1221ms/op` vs `274.9950ms/op`.
- JSON bytes did not improve reversed gossip: `2.1441ms/op` vs `2.0244ms/op`.

Compared to TypeScript:

- Ordered merge is close but still slower: `0.0258ms/op` vs `0.02ms/op`.
- Create is far worse: `486.1221ms/op` vs `50.44ms/op`.
- Reversed/shuffled is better than the shown TypeScript shuffled baseline, but
  the result does not compensate for create and ordered-merge regressions.

## Conclusion

Native Rust alone looked fast. The usable WASM package did not.

For the current JavaScript-facing CRList API, Rust/WASM is not a good replacement
for the TypeScript core:

- Normal JS object ingress through `serde-wasm-bindgen` is too expensive for
  large snapshots and hot ordered deltas.
- JSON bytes reduce some object conversion cost for small deltas, but Rust-side
  JSON parsing makes full snapshot hydration much worse.
- The TypeScript core remains faster for the important `create` and ordered
  merge benchmark rows.

The accurate interpretation is:

> Rust can make the internal data-structure work fast, but the JS-to-WASM data
> boundary dominates with this API shape. Passing large CRList snapshots or
> deltas as object graphs, or as JSON bytes, does not produce a net performance
> win over the TypeScript implementation.

## Future Work

A future WASM attempt would need a different boundary design before it is worth
revisiting:

- keep replica state resident in WASM memory
- move the replication/network layer into WASM as well
- let WASM talk to the network directly instead of round-tripping deltas through
  JavaScript object graphs
- emit only minimal events to the frontend
- avoid returning large object graphs on hot paths
- benchmark against the TypeScript baseline after every boundary change

In other words, the application would need to be a full WASM runtime for the
replicated data layer, with a thin frontend event boundary. Anything less keeps
the expensive JS/WASM object boundary in the hot path and is likely to remain a
net regression.

Until then, archive the Rust workspace and keep the TypeScript core.

## Archived Workspace

The experimental Rust workspace is archived under `docs/rust-experiment/archive`.
The original top-level `rust/target/` directory was intentionally omitted because
it is Cargo build cache and can be regenerated from the archived `Cargo.toml` and
`Cargo.lock`.
