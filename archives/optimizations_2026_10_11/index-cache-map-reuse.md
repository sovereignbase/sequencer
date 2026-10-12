# Index Cache Map Reuse

## Idea And Rationale

In `__update`, the `case 'after'` and `case 'before'` branches invalidated the
index cache on every non-tail insertion by assigning `crListReplica.index = new Map()`.
For a batch of 100 inserts this allocates 100 Map objects — all immediately
discarded by the next iteration — creating unnecessary GC pressure.

The fix: reuse the existing Map by calling `.clear()` instead of allocating a
new one. If no Map exists yet, allocate once.

## Smallest Safe Change

In `src/core/crud/update/index.ts`, replaced:

```typescript
if (next) crListReplica.index = new Map()
```

and

```typescript
crListReplica.index = new Map()
```

with:

```typescript
if (next) {
  if (crListReplica.index) crListReplica.index.clear()
  else crListReplica.index = new Map()
}
```

and

```typescript
if (crListReplica.index) crListReplica.index.clear()
else crListReplica.index = new Map()
```

## Before Results

Measured in the same run immediately after the deferred-displaced-entry
optimization was applied.

| Benchmark                         | Before |
| --------------------------------- | -----: |
| crud / insert / batch after tail  |  ~175k |
| crud / insert / batch before tail |  ~170k |

## After Results

| Benchmark                         | After |
| --------------------------------- | ----: |
| crud / insert / batch after tail  | ~180k |
| crud / insert / batch before tail | ~180k |

Modest throughput improvement; main benefit is reduced GC pressure across all
non-tail batch operations.

## Verification

All 17 tests passed.

## Final Rationale

Kept. Correct, minimal, and reduces allocations for every non-tail batch insert.
