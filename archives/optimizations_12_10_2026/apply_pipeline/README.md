# Apply pipeline

The baseline is the published npm 0.0.1 ESM, retained at `baseline/index.js`.
Its SHA-256 is `fe60aca1f7d5efaa3bb1bab568f229252a1a8517eb0db44e59c28493970a4548`.
It already includes insertion extensions and flat snapshots.

`baseline.cpuprofile` samples the public API with linear and random documents,
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
The initial isolated run measured 14,536,856 versus 136,736 bytes of post-GC heap
growth and 360.681 versus 141.395 ms. This includes runtime/JIT overhead; it is
not an allocator-live-byte count. The raw results are retained and final runs
are recorded separately.

`measure.mjs` generates updates through the public API outside timing and checks
the receiver's complete values against the sender after every burst. `local.mjs`
isolates local calls using the same trusted Sequence. CPU-profiled runs and the
early `paired-*` runs overlapping compilation are diagnostics, not acceptance
measurements. Final isolated runs use separate filenames.

```powershell
node --expose-gc measure.mjs baseline/index.js baseline.json 6000
node --expose-gc measure.mjs ../../../dist/index.js candidate.json 6000
node --expose-gc duplicate-memory.mjs ../../../dist/index.js memory.json
```

The complete performance comparison, compact snapshot format, memory/storage
measurements and validation are recorded in `../streaming_snapshot/`.
