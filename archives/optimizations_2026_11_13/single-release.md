# Clear single Frame slots without Array.fill — unbounded attempt rejected

The ordinary eight-index replacement profile classifies 156 of 619 samples
inside `readResult`. Capture the exact benchmark bundle, including the
`new Function` line offset, before assigning those samples to source lines:
72 ticks map to the masked-slot `Array.fill` call and 20 to the preceding
copy-on-write slice. These shares identify work; they are not independent
elapsed-time measurements.

When a deferred release covers exactly one Frame, assign `undefined` directly
to that private array slot. Larger spans keep `fill`. Missing bindings stay
missing, and deferred release still follows Gossip/Splice consumption, copies
and extensions. No native state, wire format, allocation or helper is added.
The native module is the preceding constructor build; the rejected bidirectional
block search is absent.

## Targeted comparison

[Five rotating matched rounds](single-release-editing.md) select the production
tuple benchmark's two replacement cases for 2, 4, 8 and 100 indices in both
modes. The temporary entry changes only case selection. Original fixtures,
runtime resets, 25 ms API warmup, JS process GC, 50 ms API work and correctness
checks remain unchanged. Raw outputs are retained for all 16 selected timing
rows and 24 space rows; this is not the complete suite.

Against the checkpoint, six medians improve over 5% and four worsen over 5%.
Eight-index ordinary Projection replacement changes from the preceding build's
+13.42% to +8.32% (candidate paired +4.65%, IQR 8.57 percentage points); it is
no longer slower in every pair. Ordinary two-index `apply.replace` remains
+8.08%, slower in every pair. Fixed eight-index tuple `apply.replace` is +0.87%,
also slower in every pair. The all-row objective remains unmet.

All 276 existing Vitest tests pass with 100% coverage: 443 statements, 301
branches, 32 functions and 396 lines. All 192 exact snapshot/serialization
comparisons pass. The complete five-pair guard was interrupted before completion
when source review found that assignment could grow short Footage arrays, while
`fill` clamps its range to the existing length. Its incomplete raw runs remain
retained but are not used for acceptance. The follow-up bounds the assignment
by the existing array length and adds a public-API memory regression check.
The exact reproducer reports 32 JS slot bytes before and after in the checkpoint,
32 before and 56 after in the unbounded attempt, and 32 before and after in the
bounded follow-up. Removing the omitted fourth Frame must not allocate its
absent Footage slot. Existing materialized values agree in all three builds.

```powershell
node temp/optimization_2026_11_12/check-short-footage.mjs fixed-table single-release bounded-release
```

## Reproduction

Frozen sources, line-matched diagnostic bundle, profiles and raw measurements
remain under `temp/optimization_2026_11_12/`. `dump-benchmark-code.mjs` uses the
same build settings and entry as the production benchmark and adds only the
two wrapper line offsets to its saved diagnostic source. No runtime algorithm
or benchmark adapter is replaced.

```powershell
node temp/optimization_2026_11_12/dump-benchmark-code.mjs direct-create
node temp/optimization_2026_11_12/tuple-editing-control.mjs single-release-editing fixed-table,direct-create,single-release 5
node temp/optimization_2026_11_12/full.mjs fixed-table,fixed-control,single-release 5 singlereleasefull
```
