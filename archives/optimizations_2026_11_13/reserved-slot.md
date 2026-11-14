# Append only into reserved Strip slots

`Strips::append` has two callers: `Projection::allocate` reserves space before
appending, and `Strips::reserve` initializes the sentinel only after reserving
a nonempty arena. Remove append's second capacity check and implicit growth
path. Its documentation now states the reserved-slot precondition. Stable
indices, growth policy, initialization and arena lifetime remain unchanged.

Final linked Wasm confirms the work removal: `Projection::allocate` shrinks from
287 to 245 WAT lines, its reserve call sites decrease from two to one, and
scalar loads decrease from 20 to 18. This is not a SIMD/MLP improvement. The
directory's existing contiguous sum reductions retain their verified SIMD
instructions; linked structural walks remain scalar.

All 277 Vitest tests pass at 100% TypeScript coverage. Both type checks and all
192 exact snapshot/serialization comparisons pass. The compatibility runner
passes 112 checks across Node ESM/CJS, Bun, Deno, Edge, workerd, Chromium and
WebKit; Firefox fails to launch because its matching local Playwright binary
is absent. Its contract checks do not execute, and no Firefox success or
compatibility assertion failure is claimed.

The [five-pair targeted replacement table](reserved-slot-editing.md) has four of
16 medians over 5% faster and one over 5% slower against the checkpoint; none is
slower in all pairs. Eight-index ordinary replacement is +3.14% (paired +4.84%,
IQR 2.99 pp). The [eight-author replay table](reserved-slot-concurrent.md) checks
all 36 ordered, reversed and shuffled insert/remove/replace cases and duplicates.
All values and same-order snapshots agree with the checkpoint. Thirty-three
medians improve over 5%, two worsen over 5%, and none is slower in every pair.
These comparisons do not replace the complete production guard.

The [native memory and artifact table](reserved-slot-space.md) reports 16 fewer
live native bytes per empty Projection, 48 fewer per single/eight-Frame retained
instance and 306.71 fewer per edited eight-Frame instance. All measured artifact
encodings shrink against the checkpoint: ESM 150,289 bytes raw, 122,202 minified,
43,967 minified/gzip and 36,393 minified/Brotli; Wasm 90,048 bytes raw, 36,519
gzip and 30,116 Brotli. These gains include the preceding directory, constructor,
bounded-release and scalar-end changes.

Handwritten `.ts`, `.cpp` and `.hpp` source, excluding generated raw bindings,
occupies 182,719 normalized UTF-8 bytes versus 183,041 at the checkpoint, a
322-byte decrease. Physical lines increase from 4,498 to 4,532; nonempty lines
after comment stripping increase from 3,514 to 3,590. The change is not claimed
to reduce source line count. File count remains 40.

A complete five-pair lifecycle/throughput/tuple comparison against both unchanged
checkpoint copies is complete. The all-row objective is not met. Frozen
sources, raw data, exact native modules, symbols and inspection outputs remain
under `temp/optimization_2026_11_12/reserved-slot*` and `reservedslotfull*`.

```powershell
node temp/optimization_2026_11_12/tuple-editing-control.mjs reserved-slot-editing fixed-table,scalar-end,reserved-slot 5
node temp/optimization_2026_11_12/inspect-allocation.mjs scalar-end reserved-slot
node --expose-gc temp/optimization_2026_11_12/concurrent-guard.mjs reserved-slot-concurrent fixed-table,reserved-slot 5
node temp/optimization_2026_11_12/full.mjs fixed-table,fixed-control,reserved-slot 5 reservedslotfull
```

## Complete guard

The [primary comparison](reserved-slot-performance.md) includes all 409
non-length timing rows: 197 medians improve over 5%, 57 worsen over 5%, and six
are slower in every pair. The [unchanged checkpoint copies](reserved-slot-aa-performance.md)
have 53 medians over 5% faster, 69 over 5% slower and 18 every-pair slowdowns.
The [second checkpoint comparison](reserved-slot-control-performance.md) has
191 medians over 5% faster, 57 over 5% slower and 11 every-pair slowdowns.
All 96 allocation/storage rows remain reported: 20 shrink and 76 are unchanged.
Serialized storage remains unchanged; the exact snapshot checks also agree.

Four timing losses repeat in every pair against both checkpoint copies:

| Case                           | Primary change | Paired change | Paired IQR, pp |
| :----------------------------- | -------------: | ------------: | -------------: |
| throughput/15000/create.empty  |        +21.18% |       +21.16% |           5.58 |
| throughput/20000/values.random |        +24.66% |       +15.93% |          12.55 |
| checkpoint/up/10000/sequence   |         +8.63% |        +9.83% |          16.13 |
| checkpoint/down/20000/sequence |         +7.59% |        +7.52% |           0.10 |

Eight-index ordinary replacement (+6.03%) and 20,000-Strip insert merge (+5.79%)
are slower in every pair against the primary checkpoint only; the second
checkpoint's remaining slow cases stay visible in its complete table. No loss
is discarded merely because unchanged copies also vary.

Full-lifecycle random apply improves 68.87%, random remove 67.34%, random replace
60.65%, tail replace 51.42% and random single-Frame read 82.07%. No
remove/apply(remove) case is slower in every pair in the primary comparison.
The next diagnostics profile production checkpoint sequence and 20,000-Strip
random range values, preserving frozen API work and correctness checks.
