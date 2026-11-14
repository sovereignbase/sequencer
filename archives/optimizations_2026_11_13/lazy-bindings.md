# Allocate JS bindings on first use: rejected

Empty Projections share an empty binding table. Allocate a private table when
Footage or reconstructed bindings are first retained. Tables with live bindings
remain private; local insertion still stages its binding before the native call.

All 279 tests pass with 100% TypeScript coverage: 453 statements, 314 branches,
33 functions and 406 lines. The additional lifetime test verifies that destroying
an edited Projection releases its binding slots while an empty Projection remains
alive. All 192 exact snapshot and encoding comparisons pass.

Across three fresh modules with 10,000 simultaneous Projections, median JS
process heap estimates change from 202.56 to 146.56 B for empty instances,
402.33 to 266.33 B for single-Frame instances, and 378.29 to 242.29 B for
eight-Frame instances. These are GC-based estimates, not exact object sizes.
The eight-Frame case is constructed empty and populated by insertion; it is not
recreated from a snapshot. The edited eight-Frame case increases from 909.57 to
917.55 B; native allocations are unchanged by this JS change.

The [five-pair targeted comparison](deferred-insert-target.md) contains all
70 selected production timings against compact-removals. Twelve medians improve
and fifteen worsen by more than 5%. Random insertion at 15,000 Strips is slower
in every pair (+6.93%, paired +5.75%, IQR 8.62 pp). Empty construction improves
by 3.76–8.61% across the selected checkpoints. Full-suite acceptance is open.

The [artifact and native allocation table](lazy-bindings-space.md) retains the
checkpoint comparison. ESM Brotli is 79 B larger and CommonJS Brotli 47 B larger
than the checkpoint, despite smaller raw and minified bundles. These differences
are not treated as wins. Raw heap measurements and frozen sources remain under
`temp/optimization_2026_11_12/lazy-bindings*`.

A [second five-pair comparison](lazy-frontier-target.md) repeats the apply
losses against compact-removals: apply.insert at 1,000 Strips is +35.17%
(paired +40.58%, IQR 10.98 pp), and apply.remove is +39.00% (paired +36.35%,
IQR 6.67 pp), both slower in every pair. Eight cases are slower in every pair;
13 medians improve and 24 worsen by more than 5%. Reverted to per-instance
binding tables rather than retaining these costs for the heap reduction.
