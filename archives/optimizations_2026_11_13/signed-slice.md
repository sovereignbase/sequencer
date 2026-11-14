# Narrow bounded slice indices

The 20,000-Strip random range profile classifies 145 of 166 candidate values
samples in JS `values`; 109 position ticks map to its single-span `slice` line.
The checkpoint has the same dominant path. Source-line mapping uses the exact
benchmark bundle with its two `new Function` wrapper line offsets. These are
diagnostic sample shares, not independent method timings.

When a single span's exclusive end fits signed int32 and the source array,
explicitly narrow its slice arguments with `| 0`. Larger uint32 offsets retain
the existing materialization path. No Frame, hole, application value, public
argument, output shape or native algorithm is changed. This tests a JS numeric
representation hypothesis; it does not establish a portable engine fast path.

The new public-API boundary test uses sparse Footage with two present values
beyond the signed index boundary. It initially exposes an existing separate
bug: the native uint32 length is returned to JS as signed i32. Normalize that
scalar with `>>> 0`; length 2,147,483,649 and both large-offset range reads then
agree with the Frame model. No large Footage buffer is copied or enumerated.

All 278 Vitest tests pass with 100% TypeScript coverage: 441 statements, 302
branches, 32 functions and 395 lines. All 192 exact snapshot/serialization
comparisons pass. Existing expectations remain unchanged.

The [five-pair targeted table](signed-slice-values.md) includes all five production
range positions plus whole values, random scalar read and sequence guards at
100, 1,000, 10,000, 20,000 and 25,000 starting Strips. Fixtures, preparation,
warmup, work, correctness checks and timing limits are unchanged. Against the
checkpoint, 12 of 40 medians improve over 5%, eight worsen over 5%, and none is
slower in every pair. Against the preceding retained candidate, 14 improve over
5%, seven worsen over 5%, with no every-pair loss. Random range reads remain
mixed: at 20,000 the median is +5.17% versus the checkpoint, paired -1.57% with
18.75 pp IQR. This is not a completed regression decision or universal speedup.

Raw profiles, line mappings, failed pre-normalization test output, frozen
sources and all samples remain under `temp/optimization_2026_11_12/`.

```powershell
node --expose-gc temp/optimization_2026_11_12/profile-random-values.mjs reserved-slot
node temp/optimization_2026_11_12/dump-benchmark-code.mjs reserved-slot
node temp/optimization_2026_11_12/read-profile-lines.mjs reserved-slot
node temp/optimization_2026_11_12/production-control.mjs signed-slice-values fixed-table,reserved-slot,signed-slice values-production.mjs 5
```
