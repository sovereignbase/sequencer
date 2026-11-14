# Reuse the sole surviving visible endpoint

The ordinary two-field apply.replace profile identifies endpoint discovery in
anchor_strip as an added traversal cost. After a removal, a surviving head or
tail may already own every remaining visible Frame. When its positive effect
equals frame_count, both endpoints are that Strip. Reuse it directly instead
of building or querying the traversal directory. Hidden history stays linked;
canonical coordinates, mask semantics and later placement are unchanged.

The four added lines have no stored state. This removes a dependent lookup;
there is no independent arithmetic suitable for SIMD. Existing block prefix
vectorization and transfer loops remain unchanged.

All 279 tests pass with 100% TypeScript coverage: 441 statements, 302 branches,
32 functions and 395 lines. All 192 exact snapshot and encoding comparisons
pass. The diagnostic profile contains no Traversal::find samples in the selected
two-field apply.replace burst, versus 51 of 870 samples in compact-removals.
Position resolution changes from 64 of 870 samples to 40 of 820; sample shares
are diagnostic, not an independent wall-time measurement.

The [first five-pair apply target](endpoint-reuse-tuple-target-tuple.md) is mixed:
seven of sixteen medians improve and one worsens by more than 5% against the
checkpoint. The two-field ordinary apply.replace median is +24.97%, paired
+31.09% with 38.31 pp IQR; it is not slower in every pair. This is not discarded.

A second variant places the checks only inside invalid-endpoint branches. It
passes the same tests and exact snapshots and likewise removes the sampled
lookup. The [four-build placement comparison](endpoint-placement-target-tuple.md)
selects the same sixteen production timings over five pairs. The original
four-line version improves five medians over 5% against the checkpoint, with
none over 5% slower and none slower in every pair. Against compact-removals,
six medians improve over 5%, none worsens over 5%, and none is slower in every
pair. Its two-field ordinary apply.replace median changes to -1.93% against
the checkpoint, but the paired median remains +12.14% with 18.53 pp IQR.
That uncertainty requires the complete guard.

The conditional variant has three medians improve and four worsen over 5%
against the checkpoint. Two-field ordinary apply.replace is +10.96%, paired
+17.02% with 8.42 pp IQR, slower in every pair. Fixed four-field duplicate apply
is +5.90%, also slower in every pair. That placement is reverted; its artifacts
and allocations remain in [its table](conditional-endpoint-space.md).

The [eight-author replay](endpoint-reuse-concurrent.md) checks ordered, reversed
and shuffled delivery plus duplicates for insert, remove and replace at tail
and random positions, with 256 and 4,096 starting Insertions. All 36 cases
preserve same-order canonical snapshots and cross-order visible values. The
combined candidate improves 32 medians over 5%; none worsens over 5% or in every
pair. These are combined-runtime gains, not gains attributed solely to four lines.

The [collector](endpoint-reuse-space.md) confirms unchanged native allocation
shapes against compact-removals. Relative to the checkpoint, native empty
instances save 16 B, intact single/eight-Frame instances 48 B, and edited
eight-Frame instances 306.71 B. Wasm is 88,969 B versus 90,876 B; ESM is
148,950 B raw, 120,943 B minified and 43,947 B minified/gzip. Brotli remains
larger than the checkpoint by 21 B for ESM, 46 B for CommonJS and 29 B for Wasm.
No all-artifact improvement is claimed.

The complete five-pair, three-build guard uses raw prefix
`temp/optimization_2026_11_12/endpointreusefull-*`. Candidate and conditional
sources, profiles and targeted samples remain under `endpoint-reuse*`,
`conditional-endpoint*` and `endpoint-placement-target*` in the same directory.
Complete-suite acceptance remains open.

## Complete guard

The [primary five-pair comparison](endpoint-reuse-performance.md) has 203 of 409
non-length medians over 5% faster and 66 over 5% slower. Its fourteen every-pair
losses remain in the table. The [identical-control comparison](endpoint-reuse-aa-performance.md)
has 47 faster and 84 slower medians, with eighteen every-pair losses despite
identical code. The [second checkpoint comparison](endpoint-reuse-control-performance.md)
has 210 faster and 67 slower medians, with twelve every-pair losses.

Full-lifecycle random apply improves 69.69%, random removal 68.22%, random
replacement 61.23%, tail replacement 50.43% and random scalar reads 82.91%.
All twelve sequence checkpoint medians improve, by 9.27–20.83%. Twenty of the
96 space rows shrink; the other 76, including every serialized size, match.

The ordinary two-field apply.replace result becomes +3.06% (paired +3.86%,
IQR 2.97 pp). This is smaller than the earlier repeated 10–40% losses, not a
claimed improvement over the checkpoint. Empty construction at 15,000 remains
+15.60% (paired +7.34%, IQR 11.97 pp). Random ranges at 20,000 are +3.04%.

Four cases are slower in every pair against both independently run checkpoints:

| Case                      | Change vs primary | Paired change | Paired IQR, pp |
| :------------------------ | ----------------: | ------------: | -------------: |
| 20,000/apply.duplicate    |           +18.55% |       +15.81% |           6.10 |
| 100/apply.duplicateRemove |           +12.79% |        +8.47% |          12.55 |
| 1,000/apply.insert        |           +16.95% |       +13.36% |           2.66 |
| 100/value.tail            |           +13.29% |       +11.47% |          27.76 |

Other every-pair losses against the primary include 25,000-Strip short sequence
calls (+16.01%), 10,000-Strip snapshot construction (+20.79%) and scale-up tail
replacement (+16.61%, paired +5.21%). They remain open even when absent from the
intersection above. The runtime source is 183,138 normalized UTF-8 bytes versus
183,041 at the checkpoint; physical lines are 4,543 versus 4,498. Neither an
all-row speedup nor a source reduction is established.
