# Direct empty construction

The preceding constructor profile identifies the general JS request/result path
as significant work even when there is no retained input. Export the existing
native constructor and call it with scalar arguments for that case. Retained
snapshots keep their original initialization path. Finalizer registration,
cleanup, session allocation and public behavior remain unchanged.

The native function is not inlined: final linked inspection finds one body and
one call from the general dispatch path, avoiding duplicated constructor code.
No SIMD, ILP or MLP improvement is claimed; this change removes protocol work.

## Measurements

Five rotating matched rounds use the unchanged production workloads against
both the checkpoint and preceding span-wide source-check build. The
[targeted table](direct-create-target.md) includes all 32 selected constructor,
duplicate, read and sequence rows. Empty construction improves 39.17% at 100,
21.58% at 1,000, 11.81% at 15,000 and 13.61% at 25,000 starting workload Strips.
Fourteen medians improve over 5%; six worsen over 5%; none is slower in all
five pairs. These are targeted results, not complete-suite acceptance.

The [complete tuple follow-up](direct-create-tuple.md) retains all 72 non-length
timing rows and 24 space rows. Thirty timing medians improve over 5%, six worsen
over 5%. Ordinary Projection with eight indices has a repeated replace loss:
+17.21%, paired +17.21%, paired IQR 3.80 percentage points, slower in all five
pairs. The all-row condition is not met. This case is profiled separately
before another native change.

The [memory and artifact table](direct-create-space.md) includes the native
allocation decrease inherited from the directory changes: 16 bytes per empty
instance, 48 bytes per single-Insertion or eight-Frame instance, and
306.69 bytes per edited eight-Frame instance. All measured artifact encodings
remain smaller than the checkpoint: ESM 150,428 bytes raw, 122,389 minified,
44,012 minified/gzip and 36,403 minified/Brotli; native Wasm 90,250 bytes raw,
36,505 gzip and 30,170 Brotli. Collector figures describe live library
allocations, not process RSS or releasable Wasm page capacity.

All 276 existing Vitest tests pass with 100% TypeScript coverage: 439 statements,
297 branches, 32 functions and 393 lines. Both type checks pass. All 192 exact
snapshot/serialization comparisons pass. Constructor fault injection follows
the new native entry point; general error-header injection uses a valid empty
retained snapshot. Existing error, recovery and cleanup assertions remain
unchanged. Complete production guard and compatibility results remain pending
for this candidate.

## Tiny-document profile

Eighty repetitions preserve the production eight-index ordinary Projection
fixture, 4,096 random replacements per burst, native module and result checks.
The diagnostic copy only exports the existing burst and suppresses the CLI.
Samples are filtered to replacement calls inside that burst, excluding fixture
authoring. Diagnostic elapsed times are not acceptance measurements.

Of 619 classified candidate samples, 69 (11.15%) are in directory lookup:
48 from removal position lookup and 21 from hidden-endpoint discovery. The
checkpoint classifies 502 samples overall; sample shares alone do not prove
relative elapsed time. The candidate's bounded structural block walk still
passes hidden history even though only eight Frames survive. The next
experiment searches a selected block from its nearer weighted endpoint,
without another metadata field or allocation.

Raw outputs, linked constructor inspection, profiles and frozen builds remain
under `temp/optimization_2026_11_12/direct-create*` and
`fixed-table-tiny-replace*`.

```powershell
node temp/optimization_2026_11_12/production-control.mjs direct-create-target fixed-table,footage-copy,direct-create create-production.mjs 5
node temp/optimization_2026_11_12/tuple-control.mjs direct-create-tuple fixed-table,footage-copy,direct-create 5
node --expose-gc temp/optimization_2026_11_12/profile-tiny-replace.mjs fixed-table
node --expose-gc temp/optimization_2026_11_12/profile-tiny-replace.mjs direct-create
```
