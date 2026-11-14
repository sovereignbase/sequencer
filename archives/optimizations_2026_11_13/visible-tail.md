# Tail owner inside boundary lookup: rejected

Add the already known visible tail to find_frame's inner owner lookup. This
preserves the later original-coordinate insertion-boundary handling; unlike the
outer tail return, it does not bypass mask resolution at the fragment's first
Frame. No stored state or snapshot word changes.

All 279 tests pass with 100% TypeScript coverage, both typechecks pass, and all
192 exact snapshot and encoding pairs match. Native allocation shapes are
unchanged. The [artifact table](visible-tail-space.md) includes a 39 B raw Wasm
increase against compact-removals; no complete-suite acceptance is claimed.

The [five-pair apply target](visible-tail-tuple-target-tuple.md) leaves the
two-field ordinary apply.replace loss at +10.07% against the checkpoint
(paired +9.55%, IQR 21.63 pp), slower in every pair. The parent is +10.98%
(paired +11.55%, IQR 5.49 pp), also slower in every pair. This does not establish
the intended improvement.

The diagnostic profile has 853 selected samples; Traversal::find still accounts
for 64 (7.50%), versus 51 of 870 (5.86%) in the parent. Inspection of the full
caller stack corrects the initial hypothesis: these calls come directly from
anchor_strip's endpoint refresh, not find_frame. Merely adding the known tail
to boundary lookup does not remove that work. Reverted; the next experiment
reuses the other known visible endpoint when it owns every remaining Frame.

Raw frozen sources, profiles, samples and allocations remain under
`temp/optimization_2026_11_12/visible-tail*`.
