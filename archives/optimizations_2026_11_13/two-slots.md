# Start identity tables with two slots

Reduce ContainmentTable's minimum capacity from eight slots to two. A Slot is
12 B; one key needs only one occupied slot plus an empty probe terminator. The
existing 75% load check grows before a second key can fill that initial table.
Eight-slot and larger capacities, hashing, probing and reservation rules are
otherwise unchanged. This changes one constant and adds no field or helper.

All 279 tests pass with 100% TypeScript coverage. All 192 exact snapshot and
encoding pairs and 27 long, sparse and dense removal checks pass. Same-order
snapshots and cross-order values also match in all 36 eight-author replay cases,
including duplicate replay.

The [three-run collector](two-slots-space.md), with 10,000 simultaneous instances
per shape, measures native single-root and eight-Frame instances at 414.56 B
versus 486.55 B in the parent. Eight-field tuples change from 1,038.61 to 966.61 B.
Empty instances remain 238.55 B. Edited eight-Frame instances change from
3,198.55 to 3,195.38 B; their final table layout is unchanged, so this small
difference includes allocator bookkeeping rather than a smaller class. Retained
JS array slots and application content are unchanged.

Wasm remains 88,952 B; ESM raw and minified each shrink 4 B against the parent.
ESM gzip grows 2 B while Brotli shrinks 64 B. CommonJS gzip grows 1 B and Brotli
shrinks 22 B. Several Brotli outputs remain larger than the checkpoint. The
smaller first allocation removes 72 B of initialization for one-key tables;
no additional SIMD, ILP or MLP benefit is claimed.

The extracted final modules have equal length and differ at exactly four bytes:
offsets 2,722, 2,733, 45,270 and 45,281 change from 8 to 2. Every other byte is
identical. No instruction layout, function ordering or other native body changes;
runtime differences arise from the smaller initial table and its growth/probing.

The [complete five-pair tuple follow-up](two-slots-tuple-tuple.md) includes both
modes and all production methods at 2, 4, 8 and 100 fields. Against the checkpoint,
26 of 72 non-length medians improve and four worsen by more than 5%; none is
slower in every pair. All eight native allocation rows shrink and every encoded
size matches. Against the immediate parent, twelve timing medians improve and
four worsen by more than 5%, with no every-pair loss.

The [five-pair selected throughput target](two-slots-target.md) includes seven
unchanged production cases at six checkpoints. Seventeen of 42 medians improve
and eight worsen over 5% against the checkpoint. Duplicate removal at 20,000 is
+5.28% (paired +6.03%, IQR 6.85 pp), slower in every pair. Against the parent,
three medians improve and fifteen worsen over 5%, but none worsens in every pair.
The 10,000-Strip snapshot constructor changes to +3.02% against the checkpoint,
paired -0.51% with 9.97 pp IQR; this selected result does not erase the earlier
full-suite constructor loss.

The [eight-author replay](two-slots-concurrent.md) improves thirty medians over
5% and worsens one. The slower case, 256/insert/tail/ordered, is +8.53% with
66.80 pp paired IQR and is slower in three of five pairs. No case is slower in
every pair. All samples are retained; these short bursts do not determine
complete-suite acceptance.

The complete five-pair, three-build guard uses raw prefix
`temp/optimization_2026_11_12/twoslotsfull-*`. Sources, collector output, exact
checks and selected samples remain under `two-slots*` in that directory.
Acceptance remains open.

## Complete guard

The [primary five-pair comparison](two-slots-performance.md) has 192 of 409
non-length medians over 5% faster and 61 over 5% slower, with nine every-pair
losses. The [identical-control comparison](two-slots-aa-performance.md) has 55
faster and 64 slower medians, with eleven every-pair losses despite identical
code. The [second checkpoint comparison](two-slots-control-performance.md) has
200 faster and 55 slower medians, with seven every-pair losses. Twenty native
space rows shrink and the remaining 76 space rows, including serialization, match.

Full-lifecycle random apply improves 69.08%, random removal 65.31%, random
replacement 60.66%, tail replacement 48.36% and random scalar reads 82.47%.
One case is slower in every pair against both checkpoint copies: 25,000-Strip
tail removal, +4.99% (paired +4.85%, IQR 9.06 pp). This requires follow-up.

The primary table also retains every-pair losses for 100-Strip head and random
ranges (+19.14% and +16.91%), 25,000-Strip whole values (+15.93%), duplicate apply
at 15,000 (+14.96%), insertion/removal apply at 1,000 (+12.22% and +9.41%),
20,000-Strip scalar head reads (+6.56%) and fixed hundred-field duplicate merge
(+2.70%). They are not dismissed by the mutual-checkpoint filter. All-row
acceptance remains open; the next JS experiment removes the unproven signed
slice hint while retaining the uint32 length correction.
