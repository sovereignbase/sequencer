# Remove the signed slice hint

Restore ordinary single-span slice arguments. The unsigned native length
normalization remains, and large uint32 offsets still work. This removes one
branch condition and two numeric coercions from the range path; it changes
neither spans nor copied values. The earlier hint had no established production
benefit in its selected comparison.

All 279 tests pass with 100% TypeScript coverage: 441 statements, 301 branches,
32 functions and 394 lines. All 192 exact snapshot and encoding pairs match.
The raw native module is byte-identical to two-slots (SHA-256
`8bcb7eb620847caa374bc26a3147b8f4a4560bf3744270af69d33beae38a3705`).
The [collector](plain-slice-space.md) records allocations and artifacts.

The [ten-pair production target](plain-slice-target.md) selects nine unchanged
cases at 100, 1,000, 15,000, 20,000 and 25,000 starting Strips. Against the
checkpoint, fifteen of 45 medians improve and five worsen by more than 5%.
No case is slower in every pair. The two-slots parent has eighteen medians
improve and ten worsen over 5%, also with no every-pair loss.

The earlier 25,000-Strip tail-removal loss does not repeat: two-slots is -9.86%
(paired -11.08%, IQR 10.27 pp), and plain-slice -8.01% (paired -11.32%,
IQR 7.13 pp). At 100 Strips, head ranges change to -7.59% and random ranges
to -10.37%. Whole values at 25,000 are -0.73%, paired +1.46% with 8.87 pp IQR.

Large uncertain medians remain: insertion apply at 1,000 is +35.83%, paired
+7.36% with 60.97 pp IQR; the parent is +20.72%, paired +16.76% with 64.47 pp
IQR. Neither is slower in every pair. These selected data are not pooled with
the complete suite and do not erase its slower rows. Complete acceptance remains
open; the next experiment removes a redundant offset word from apply input.

Raw sources, native hash verification, tests and all ten-pair samples remain
under `temp/optimization_2026_11_12/plain-slice*`.
