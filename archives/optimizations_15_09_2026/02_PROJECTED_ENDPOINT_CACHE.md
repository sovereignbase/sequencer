# Projected Head/Tail endpoint cache

Date: 2026-09-15

Decision: rejected and fully reverted.

## Hypothesis

Store the first and last visible Strip as two Projector `u32` fields and update
them during split, insert, Mask, and create rebuild. Endpoint deletes could then
avoid walking historical invisible structural nodes.

The cache was bounded to eight bytes per Replica.

## Result

Semantic tests passed 23/23, but the 64-cycle warmup regressed:

```text
before: approximately 1.9 seconds
candidate: over 40 seconds without completion
```

The duplicate endpoint state interacted badly with Gate/jump maintenance even
though visible results remained correct.

## Rationale

A second independently maintained ordering index is not justified without a
simpler update invariant. The experiment was removed before further profiling.
