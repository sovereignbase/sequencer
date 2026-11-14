# Separate sequence from the dispatcher: rejected

Mark the native sequence method noinline. The final module contains one separate
sequence function; runtime_dispatch shrinks from 15,001 to 7,427 WAT lines.
The native constructor remains one 759-line body. No algorithm, vectorized loop,
stored state, ABI or snapshot representation changes.

All 279 tests pass with 100% TypeScript coverage: 441 statements, 302 branches,
32 functions and 395 lines. All 192 exact snapshot and encoding comparisons pass.
The [collector](sequence-outline-space.md) confirms unchanged native allocations.
Raw Wasm shrinks just 13 B, from 88,890 to 88,877 B; its gzip grows 39 B and
Brotli 60 B. ESM minified/gzip grows from 43,922 to 44,027 B; minified/Brotli
grows from 36,543 to 36,587 B. The function split does not establish a bundle win.

The [five-pair apply target](outline-tuple-target-tuple.md) selects apply.replace
and apply.duplicate in both modes at 2, 4, 8 and 100 fields. The two-field ordinary
apply.replace median remains +22.63% against the checkpoint (paired +23.71%,
IQR 18.53 pp), although not slower in every pair. The parent median is +8.87% in
the same run. No full throughput or lifecycle acceptance is claimed for this
candidate. Reverted rather than carrying the artifact growth without an
established target benefit.

The diagnostic two-field ordinary apply.replace profiles use the unchanged
production burst, ten warmups and eighty sampled bursts at 100 µs. The
checkpoint has 771 selected samples, compact-removals 870. In compact-removals,
Traversal::find accounts for 51 samples (5.86%) and Traversal::insert 25 (2.87%).
Position resolution accounts for 64 (7.36%), versus 37 (4.80%) at the checkpoint.
These are sample shares, not independent timing measurements. Inspection finds
that insertion at the tail's first Frame bypasses the outer fast return and
the inner owner lookup lacks a tail case. The next experiment addresses that
known visible owner while retaining the subsequent original-boundary handling.

Raw profiles, linked inspection, frozen sources and all samples remain under
`temp/optimization_2026_11_12/sequence-outline*`, `outline-tuple-target*`,
`fixed-table-tiny-apply*` and `compact-removals-tiny-apply*`.
