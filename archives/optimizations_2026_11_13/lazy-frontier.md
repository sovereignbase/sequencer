# Allocate ACK state on first use: rejected

Group the five FrontierTable containers behind one owning pointer. Allocate
them on the first nonempty observation or retirement. A retired Actor still
remains retired even if no earlier observation exists; membership, claims,
consensus and export order are unchanged.

All 279 tests pass with 100% TypeScript coverage. Both typechecks and all 192
exact snapshot and encoding comparisons pass. The Projection header shrinks
from 228 to 148 B; State is 84 B and adds an allocation when populated. The
linked constructor changes from 31 scalar and five vector stores to 30 scalar
and two vector stores, with one out-of-line constructor body in both builds.
This storage change has no independent computation suitable for SIMD.

The [three-run memory collector](lazy-frontier-space.md) measures 158.55 native
B per empty Projection versus 238.55 in its immediate parent. Populated ACK
state costs more: the edited eight-Frame case grows from 3,198.55 to 3,204.39 B.
Wasm grows from 88,890 to 89,121 B. Both bundles remain smaller raw, minified
and gzipped than the checkpoint; ESM Brotli is 77 B larger and CommonJS Brotli
37 B larger. All costs are retained in the table.

The [five-pair target](lazy-frontier-target.md) compares compact-removals,
lazy-bindings and lazy-frontier over 70 production timings. Against
compact-removals, 13 medians improve and 23 worsen by more than 5%; eight cases
are slower in every pair. The [isolated parent comparison](lazy-frontier-vs-parent.md)
has 16 medians improve and 20 worsen by more than 5%. Apply.insert at 100 Strips
is +8.24% (paired +8.02%, IQR 2.13 pp), and tail insertion at 20,000 Strips is
+8.18% (paired +8.18%, IQR 3.87 pp), both slower in every pair.

Reverted along with lazy-bindings. The complete guard proceeds with
compact-removals. Raw samples, frozen sources, memory collector output and
linked-module inspection remain under `temp/optimization_2026_11_12/lazy-frontier*`.
