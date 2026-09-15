# Zero-visible jump skip in Mask Gate search

Date: 2026-09-15

Decision: rejected and fully reverted.

## Hypothesis

Preserve right-first Gate semantics but use an existing structural jump when
its cumulative visible length is zero. Such a range appears to contain only
tombstones and could be skipped without adding memory.

## Verification before benchmark

```text
Vitest files: 10/10 passed
Vitest tests: 23/23 passed
10,000 deterministic convergence deliveries: passed
generative convergence stress: passed
```

## Result

The same 300-Strip benchmark used for the clean comparison regressed severely:

```text
clean source: complete in 2.57 seconds
candidate: did not reach the 100-Strip checkpoint in 30 seconds
```

The process was stopped. The jump graph is maintained and locally rewritten as
a navigation cache; it is not a monotonic one-direction skip list suitable for
this loop.

## Rationale

Passing semantic tests is insufficient when a cache changes traversal
complexity. The experiment was fully reverted.
