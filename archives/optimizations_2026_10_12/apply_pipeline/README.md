# Apply pipeline

The baseline is the published npm 0.0.1 ESM, retained at `baseline/index.js`.
Its SHA-256 is `fe60aca1f7d5efaa3bb1bab568f229252a1a8517eb0db44e59c28493970a4548`.
It already includes insertion extensions and flat snapshots.

The baseline CPU profile sampled the public API with linear and random documents,
fresh insert/remove/replace Gossip, batches of one or 64 entries, and duplicate
delivery. The largest named JS consumers are `call` and `result`. Native dispatch,
anchoring, apply and position lookup also account for substantial samples.
This profile includes GC and diagnostic serialization; it is not a percentage
breakdown for every application workload.

The implementation removes temporary entry groups and validation callbacks,
passes the retained Result directly to native apply, and retains a splice's single
content span inline. Repeated imported Sessions avoid redundant hash insertion.
Masks allocate no JS content binding. Positive insertions with omitted Footage
retain distinct bindings, including through masking and later extension.

Empty results avoid unrelated result helpers. Freed trailing bindings are reclaimed
after duplicate batches; bindings that WASM never read after rejected input are
discarded. Active missing-content bindings remain protected by their ownership
state. Hydration and merge allocate bindings only for positive insertions, using
the exact count reported by WASM before JS consumes result spans.

`duplicate-memory.mjs` applies a 64-entry duplicate batch 10,000 times, then
rejects 1,000 batches with an invalid first entry. Both variants retain 64 Frames.
The final isolated run measured 14,536,856 versus 136,904 bytes of post-GC heap
growth and 360.681 versus 190.973 ms. This includes runtime/JIT overhead; it is
not an allocator-live-byte count. The final table below also records rejected-input growth.

`measure.mjs` generates updates through the public API outside timing and checks
the receiver's complete values against the sender after every burst. `local.mjs`
isolates local calls using the same trusted Sequence. CPU-profiled runs and the
early runs overlapping compilation are diagnostics, not acceptance measurements.
Only the final isolated comparison is retained below.

```powershell
node --expose-gc measure.mjs baseline/index.js baseline.json 6000
node --expose-gc measure.mjs ../../../dist/index.js candidate.json 6000
node --expose-gc duplicate-memory.mjs ../../../dist/index.js memory.json
```

The complete performance comparison, compact snapshot format, memory/storage
measurements and validation are recorded in `../streaming_snapshot/`.

## Final isolated apply comparison

Three isolated process pairs; each author generates 3,000 operations outside timing.
Values are elapsed burst milliseconds. Insert/remove/replace inputs and receiver
values are checked through the public API; duplicate rows time 100,000 redeliveries.
Batch sizes count authored Gossip updates per call before their entries are flattened. Duplicate rows repeat one already-applied update. The same Node and compiler environment
is used as in the [streaming snapshot report](../streaming_snapshot/README.md).

| Document | Operation                 | Batch | 0.0.1 ms | Checkpoint ms | Change |
| -------- | ------------------------- | ----: | -------: | ------------: | -----: |
| linear   | `apply.insert`            |     1 |   11.302 |         8.993 | -20.4% |
| linear   | `apply.insert`            |    64 |    5.712 |         3.014 | -47.2% |
| linear   | `apply.duplicate.insert`  |     1 |   70.202 |        63.238 |  -9.9% |
| linear   | `apply.remove`            |     1 |   13.205 |        10.759 | -18.5% |
| linear   | `apply.remove`            |    64 |    5.680 |         5.507 |  -3.0% |
| linear   | `apply.duplicate.remove`  |     1 |  140.409 |       120.789 | -14.0% |
| linear   | `apply.replace`           |     1 |   54.185 |        50.099 |  -7.5% |
| linear   | `apply.replace`           |    64 |   47.709 |        54.186 | +13.6% |
| linear   | `apply.duplicate.replace` |     1 |  150.153 |       160.571 |  +6.9% |
| random   | `apply.insert`            |     1 |   11.278 |        11.904 |  +5.5% |
| random   | `apply.insert`            |    64 |    8.567 |         8.626 |  +0.7% |
| random   | `apply.duplicate.insert`  |     1 |   50.182 |        60.277 | +20.1% |
| random   | `apply.remove`            |     1 |   15.418 |        13.968 |  -9.4% |
| random   | `apply.remove`            |    64 |   11.583 |        11.352 |  -2.0% |
| random   | `apply.duplicate.remove`  |     1 |   86.477 |       117.005 | +35.3% |
| random   | `apply.replace`           |     1 |   23.907 |        22.348 |  -6.5% |
| random   | `apply.replace`           |    64 |   21.033 |        19.478 |  -7.4% |
| random   | `apply.duplicate.replace` |     1 |  130.883 |       129.873 |  -0.8% |

## Duplicate and rejected-input binding cleanup

One isolated run per variant: 64 duplicate entries repeated 10,000 times, followed
by 1,000 batches rejected at their first entry. Both retain 64 visible Frames.
Heap values are post-GC process deltas, including runtime and JIT allocation.

| Measurement                                 |        0.0.1 | Checkpoint |
| ------------------------------------------- | -----------: | ---------: |
| Heap growth after duplicates                | 14,536,856 B |  136,904 B |
| Additional heap growth after rejected input |     14,152 B |   42,584 B |
| Duplicate burst                             |   360.681 ms | 190.973 ms |
