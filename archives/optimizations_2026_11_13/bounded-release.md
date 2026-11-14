# Bound single-Frame clearing to existing Footage

Keep the direct single-slot assignment only when the slot already exists.
This preserves `Array.fill`'s length clamp, avoids allocating omitted Footage,
and retains the original missing-binding behavior. Larger releases still use
`fill`. Deferred ordering and the native module are unchanged.

One public-API regression test extends the existing memory suite. Applying four
logical Frames with one supplied value and removing the omitted fourth Frame
must preserve both the three remaining values and the existing JS slot estimate.
The checkpoint and bounded candidate retain 32 estimated JS bytes; the rejected
unbounded attempt grew to 56. No existing expectation changes.

All 277 Vitest tests pass with 100% TypeScript coverage: 443 statements, 303
branches, 32 functions and 396 lines. Both type checks and all 192 exact snapshot
and serialization comparisons pass.

The [five-pair targeted replacement comparison](bounded-release-editing.md)
preserves the production workloads and selects 16 cases across both modes and
all four sizes. Five medians improve over 5%, three worsen over 5%, and none is
slower in all five matched pairs. Eight-index ordinary Projection replacement
is +1.55% against the checkpoint (paired +1.85%, IQR 11.15 percentage points).
The preceding constructor build is +19.38% in that same comparison. This is
partial improvement with overlapping distributions, not full acceptance or a
claim that every case improves.

The frozen candidate remains available for the complete guard. A separate
native experiment follows the remaining structural lookup cost; it does not
change this candidate's frozen source or measurements. Raw results and sources
remain under `temp/optimization_2026_11_12/bounded-release*`.

```powershell
node temp/optimization_2026_11_12/tuple-editing-control.mjs bounded-release-editing fixed-table,direct-create,bounded-release 5
node temp/optimization_2026_11_12/check-short-footage.mjs fixed-table single-release bounded-release
```
