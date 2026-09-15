# Linear create-time garbage collection

Date: 2026-09-15

Decision: retained.

## Problem

The create-time collector implemented its fixed point using repeated global
scans:

```text
while any origin was removed:
  rebuild every referenced Clock
  scan every origin
  scan every compacted Mask for every removable origin
```

This was superlinear and could approach cubic work.

## Implementation

The equivalent fixed point now uses:

```text
one pass: count incoming live references per origin
one pass: enqueue fully deleted origins with zero references
one queue: remove origins and decrement their parent reference
one pass: forget compacted Masks whose source was collected
existing link cleanup and Projection rebuild
```

An origin is still removed only when all its fragments are deleted and no live
operation references it. Removing a child can enqueue its now-unreferenced
deleted parent.

Temporary memory consists of two create-scoped `u32` vectors bounded by
`strip_count`. No persistent cache was added.

## Result

At the same 1,000-Strip scale-up checkpoint:

```text
create(snapshot): 82,702.5 -> 40,727.4 µs
change: 50.8% faster
```

This moved create under the 50,000 µs hard cold-path target. Scale-down was
still too slow, so Mask/navigation remains a separate hot-path problem.

## Verification

Production WASM verification before later rejected experiments:

```text
Vitest files: 10/10 passed
Vitest tests: 23/23 passed
10,000 deterministic convergence deliveries: passed
generative convergence stress: passed
```
