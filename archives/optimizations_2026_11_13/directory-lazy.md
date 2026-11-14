# Build traversal weights on first use

The preceding directory starts maintaining weights at the ninth linked node,
including histories whose operations resolve entirely through the visible
endpoints and retained gate. The new version leaves that derived index inactive
until a fallback lookup uses it. Its existing zero block count identifies the
inactive state; no new flag, allocation or serialized field is introduced.

Visible-position fallback, structural-position fallback and visible endpoint
discovery each prepare the index before querying it. Once active, ordinary
maintenance, growth and width changes are unchanged. Growth of an inactive
directory copies no unused rows and initializes only its header. Hydration still
builds its finished directory and discovers its visible endpoints as before.

All 276 existing tests pass with 100% TypeScript coverage, all 192 exact
snapshot/serialization pairs match, and every eight-author replay/duplicate case
passes. Tests and expected results are unchanged. The
[concurrent comparison](directory-lazy-concurrent.md) retains all short-burst
samples; these diagnostics do not replace the complete guard.

The [five-pair production lifecycle comparison](directory-lazy-lifecycle.md)
has 34 timing medians over 5% faster, eight over 5% slower, and none slower in
every pair against the checkpoint. Full-lifecycle random apply improves 69.69%,
random removal 66.84%, random replacement 60.27%, tail replacement 46.82% and
random value lookup 83.00%. Head replacement improves 7.65%. All checkpoints,
acknowledgement exchange, compaction and recreation remain unchanged.

The [91-row throughput follow-up](directory-lazy-regressions.md) uses the same
selection as the preceding candidate's regression follow-up. It compares the
checkpoint, eager directory and deferred directory with five matched pairs.
The deferred version has 14 medians over 5% faster and 14 over 5% slower against
the checkpoint. Small head removal is 23.42% slower than the eager directory,
slower in every pair, despite other endpoint improvements. This apparent loss
triggers an additional direct comparison rather than acceptance.

The [ten-pair endpoint comparison](directory-lazy-endpoints.md) preserves the
production fixtures, warmups, work, timing bounds and checks. It selects tail
insertion, head/tail removal, duplicate merge and head-range values at 100,
1,000 and 20,000 starting workload Strips. Against the eager directory, no row
is slower in every pair. At 100, head removal changes by -0.77% (paired -2.20%,
IQR 29.78 pp); its earlier loss does not repeat in this selection. At 1,000,
head removal improves 9.80% (paired -10.40%, IQR 2.02 pp) and tail removal 4.87%.
One median, head-range values at 20,000, is 10.44% worse (paired +4.82%, IQR
22.19 pp). Every valid sample remains in the table. Different selections are
not pooled.

The [complete tuple follow-up](directory-lazy-tuple.md) uses five matched pairs
against both checkpoint copies. For the candidate, 17 non-length medians improve
over 5%, four worsen over 5%, and none is slower in every pair. The identical
checkpoint copy has 11 medians over 5% faster and 11 over 5% slower. This records
measurement variation without treating it as permission to dismiss regressions.

The [allocation and artifact comparison](directory-lazy-space.md) retains the
eager directory's native allocation sizes. Against the checkpoint, empty
Projections save 16 bytes, single intact roots 48 bytes and the edited eight-Frame
fixture 306.6864 bytes. Raw ESM shrinks 1,091 bytes, minified ESM 969 bytes,
minified ESM gzip 197 bytes and raw Wasm 635 bytes. Every measured encoding is
smaller; raw Wasm is 90,241 bytes. Reserved Wasm capacity and process RSS are not
reported as live per-Projection allocation.

This is skipped work, not a new SIMD, ILP or MLP algorithm. Built directories
retain their contiguous Frame sums. Dependent structural walks remain dependent.
The production-linked module, symbols, extracted function bodies, hypotheses and
all raw measurements remain under `temp/optimization_2026_11_12`. No external
runner or adapter is changed. The complete five-pair lifecycle/throughput/tuple
guard against both checkpoint copies determines final acceptance.

```powershell
node temp/optimization_2026_11_12/production-control.mjs directory-lazy-lifecycle fixed-table,directory-records,directory-lazy lifecycle-control.mjs 5
node temp/optimization_2026_11_12/production-control.mjs directory-lazy-regressions fixed-table,directory-records,directory-lazy records-regression-production.mjs 5
node temp/optimization_2026_11_12/production-control.mjs directory-lazy-endpoints directory-records,directory-lazy lazy-endpoint-production.mjs 10
node temp/optimization_2026_11_12/tuple-control.mjs directory-lazy-tuple fixed-table,fixed-control,directory-lazy 5
node temp/optimization_2026_11_12/full.mjs fixed-table,fixed-control,directory-lazy 5 directorylazyfull
```

## Complete guard

The [five-pair complete comparison](directory-lazy-performance.md) contains
409 non-length timing rows: 149 medians improve more than 5%, 67 worsen more
than 5%, and 21 rows are slower in every pair against the primary checkpoint.
The [identical checkpoint copies](directory-lazy-aa-performance.md) have
63 medians over 5% faster, 81 over 5% slower and 14 rows slower in every pair.
Against the [second checkpoint](directory-lazy-control-performance.md), the
candidate has 163 medians over 5% faster, 63 over 5% slower and 12 rows slower
in every pair. The all-row condition is not met.

Full-lifecycle random apply improves 69.08%, random removal 67.09%, random
replacement 59.38%, tail replacement 47.45% and random value lookup 82.84%.
Head replacement is 3.22% slower (paired +0.25%, IQR 9.56 pp). Checkpoint values
at down/10,000 worsens 62.76% against the primary checkpoint and 76.39% against
its copy, slower in every pair against both. Short read and constructor cases
also remain slower; they are not discarded because other methods improve.

Nineteen native-allocation rows shrink and all 77 remaining memory/storage rows
are unchanged. Both TypeScript checks and all 112 executed compatibility checks
pass. Local browser binaries are not installed or changed by this experiment.

## Checkpoint read profile

Five diagnostic production lifecycle runs per build name the existing checkpoint
callbacks so their samples can be separated. API arguments, work and checks are
unchanged. JavaScript `readValues` accounts for 595/728 (81.73%) ordinary
checkpoint-values samples in the checkpoint and 585/717 (81.59%) in the candidate.
The down/10,000 callback has only 62 and 51 samples, respectively; it also spends
most samples in `readValues`, but this small sample does not establish a precise
cost ratio. Native `runtime_values` accounts for 10.85% and 11.58% of ordinary
checkpoint samples. Profiled API timings are not acceptance measurements.

Separate diagnostic copies record span counts, total Frames, one-Frame spans,
numeric descriptor fingerprints, source-array lengths and V8 array-kind flags.
All twelve records match exactly between builds for seed `editing-pair-0`.
Sources are packed Smi arrays in both. This rules out differences in these
observed positive spans/source shapes, not every internal runtime field.
The extra instrumentation is confined to diagnostic copies and its timings are
not compared. Production source and the measured frozen workspaces stay intact.

V8 trace-opt/trace-deopt diagnostics also record repeated on-stack optimization
of `readValues` and insufficient-feedback bailouts. This motivates a separate
experiment that moves the existing snapshot grouping/concatenation loop out of
the visible-array reader without changing either copying algorithm.

Raw diagnostics are `fixed-table-span-profile-0.json`,
`directory-lazy-span-profile-0.json`, `*-checkpoint-profile.json`,
`*-checkpoints.cpuprofile` and `*-tier-diagnostic.log` under the same temporary
directory. Commands:

```powershell
node temp/optimization_2026_11_12/prepare-span-profile.mjs
node --expose-gc --allow-natives-syntax temp/optimization_2026_11_12/span-profile.mjs fixed-table
node --expose-gc --allow-natives-syntax temp/optimization_2026_11_12/span-profile.mjs directory-lazy
node temp/optimization_2026_11_12/prepare-checkpoint-profile.mjs
node --expose-gc temp/optimization_2026_11_12/profile-checkpoints.mjs fixed-table 5
node --expose-gc temp/optimization_2026_11_12/profile-checkpoints.mjs directory-lazy 5
```

The V8 native-syntax flag is used only to inspect array kinds in these Node
diagnostics. It is not required by the library or used for acceptance timings.
