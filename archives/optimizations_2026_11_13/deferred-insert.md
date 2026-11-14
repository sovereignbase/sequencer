# Deferred insertion binding: rejected

Starting from lazy-bindings, pass a prospective binding token to local insertion
and retain Footage only when the native result creates a new root. Extensions
append directly to their existing binding, avoiding a temporary push/pop pair.

All 279 tests pass with 100% TypeScript coverage; all 192 exact snapshot and
encoding comparisons pass. The [five-pair targeted comparison](deferred-insert-target.md)
has sixteen medians over 5% faster and sixteen over 5% slower than compact-removals.
Two cases worsen in every pair: apply.insert at 1,000 Strips (+23.76%, paired
+22.74%, IQR 9.00 pp) and apply.replace at 100 Strips (+16.58%, paired +12.39%,
IQR 8.65 pp). Memory estimates do not establish an additional reduction.

Reverted to the eager insertion staging in lazy-bindings. Raw results and frozen
sources remain under `temp/optimization_2026_11_12/deferred-insert*`.
