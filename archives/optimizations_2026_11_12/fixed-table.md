# Identity table checkpoint

The identity table owns a power-of-two slot array and stores its probe mask
directly. Slot order, hashing, the 75% occupancy limit and canonical identities
are unchanged. No API or serialized field changes.

The table occupies 12 rather than 16 bytes in Wasm. Three live-allocation runs
measure about 8 fewer allocator bytes per ordinary instance and 16 fewer for an
eight-slot tuple. Snapshot bytes are unchanged across 192 exact baseline/candidate
pairs. All 276 tests pass with 100% TypeScript coverage.

| Artifact            | Before, bytes | After, bytes |
| :------------------ | ------------: | -----------: |
| Wasm                |        90,954 |       90,876 |
| ESM                 |       151,219 |      151,339 |
| ESM minified        |       123,218 |      123,281 |
| ESM minified + gzip |        44,257 |       44,271 |
| ESM Brotli          |        36,367 |       36,532 |

The ESM content outside the inline Wasm literal is byte-identical. The literal's
escaping accounts for the larger raw JavaScript despite the smaller Wasm.

The [five-round production comparison](fixed-table-control.md) includes an
identical-build control, all 39 throughput cases and 1,000, 10,000 and 25,000
starting Strips. Excluding length, 76 timing medians increase and 38 decrease;
38 increases exceed 5%. Both candidate and identical-build controls vary, so
these are observed differences, not individually established causal regressions.
In particular, 10,000-Strip random removal is 9.75% slower and 25,000-Strip head
reads are 18.62% slower. These differences remain unresolved.

The full lifecycle and tuple regression guard has not been completed for this
candidate. This is a user-requested checkpoint of the current mixed result,
not an all-row performance acceptance. Further work targets replicated removal,
replacement, concurrent placement and the other weaknesses in the supplied
[external results](external-results.md).

Final linked Wasm inspection finds two fewer static `i32.store` sites in table
reservation and one fewer `i32.load` site in destruction. Hash probing remains
dependent scalar work: no SIMD, ILP or MLP improvement is claimed. Sources,
disassembly, raw measurements and frozen builds are retained under
`temp/optimization_2026_11_12` with the `fixed-table` prefix. See
[all artifact measurements](artifacts.md) for compression and allocation details.
