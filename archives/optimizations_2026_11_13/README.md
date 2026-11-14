# Traversal indexing and replicated editing

## Checkpoint: 14 November 2026

The checkpoint contains the arena-backed traversal directory, surviving endpoint
reuse, compact removal lookup, bounded Footage release, direct empty construction,
fitting snapshot-buffer reuse, two-slot initial identity tables and inline apply
input records. The signed slice hint, lazy binding/frontier storage, removal
intervals, indexed remote appends and combined validation/copy loops are absent.

The [latest complete five-pair comparison](inline-input-performance.md) measures
409 non-length timing rows against `d3108d5`: 225 median times decrease and 184
increase; 181 decrease over 5% and 139 increase over 5%. The
[complete positive-row inventory](inline-input-remaining-positives.md) retains
every positive change. This is a checkpoint, not an all-row performance win.

The [identical-code control](inline-input-aa-performance.md) has 60 rows over 5%
faster and 226 over 5% slower, despite identical distributed bundles and runtime
source. The [second checkpoint comparison](inline-input-control-performance.md)
has 246 rows over 5% faster and 89 over 5% slower. Measurement variability does
not establish that all primary differences are caused by the implementation;
none of the valid slower samples is discarded.

Two cases are slower in every pair against both checkpoint copies:

| Method / size                   | Primary median change | Paired change | Paired IQR |
| ------------------------------- | --------------------: | ------------: | ---------: |
| values.head / 20,000 Strips     |               +13.44% |       +13.06% |   28.44 pp |
| fixed tuple sequence / 8 fields |               +36.76% |       +32.01% |    9.11 pp |

The primary comparison has sixteen every-pair losses in total; the two-copy
filter does not remove the others from the report. Full-lifecycle random apply,
removal, replacement and scalar reads improve 66.09%, 64.89%, 58.10% and 81.92%.
Tail replacement improves 45.64%. Twenty native space rows decrease; all other
76 space rows, including encoded sizes, match.

The [three-run allocation collector](inline-input-space.md) measures about
414.56 native B per small single-root instance versus 534.55 B at the checkpoint;
empty instances use 238.55 versus 254.55 B. Eight-field tuples use 966.61 versus
1,054.61 B, and the edited eight-Frame shape uses 3,195.38 versus 3,505.26 B.
These are live native allocations, not reserved Wasm capacity or process RSS.

All 280 Vitest tests pass with 100% TypeScript coverage; both typechecks pass.
The retained runtime also passes 192 exact snapshot/encoding pairs, 27 long,
sparse and dense removal checks and 36 eight-author replay cases. Production
benchmark workloads and external adapters are unchanged. Raw complete-guard
samples use `inlineinputfull-*` in `temp/optimization_2026_11_12/`.

A diagnostic profile of the unchanged eight-field tuple sequence fixture has
116 measured samples: 38 in `readResult`, 24 in native dispatch, 18 in
`readValues`, and fourteen in native allocation/free. No code change was made
from this diagnostic before the checkpoint.

## Initial experiments

Continuation from checkpoint `d3108d5`. The
[previous round](../optimizations_2026_11_12/README.md) retains the complete
native experiments and their unresolved timing differences. No external
benchmark runner or adapter is changed.

The sole-visible-Strip tail candidate passes all 276 tests and all 192 exact
snapshot pairs, and substantially improves replicated tail replacement. Its
[three-build complete guard](../optimizations_2026_11_12/sole-tail-performance.md)
still has unresolved differences. In particular, 25,000-Strip full values is
slower in all five pairs against both baseline copies. The candidate is not
accepted as an all-row improvement.

## Array copying

The runtime currently passes both bounds to `slice`, even when a returned span
reaches the source array's end. In the
[V8 code shipped with Node 24.16.0](https://raw.githubusercontent.com/nodejs/node/v24.16.0/deps/v8/src/builtins/array-slice.tq),
an undefined end enables the whole-array clone path when start is zero. The
candidate omits the end argument only when the requested end equals source
length. Partial middle ranges retain both bounds. Results remain fresh arrays.

Twelve matched isolated copy rounds, after four warmups and rotating/reversed
order, measure about 32–45% shorter copies for complete one/eight-element arrays.
Large arrays show small mixed differences. This does not establish an API gain.
Raw samples, all slower results and fixture checks are in
`temp/optimization_2026_11_12/slice-control.json`.

The combined build passes all 276 tests with 100% TypeScript coverage, including
the added conditional branches, and all 192 exact snapshot/serialization pairs.
The public-API comparison separates four combinations: checkpoint, tail-only,
copy-only and tail-plus-copy, plus a byte-identical checkpoint copy. The full
acceptance criterion is unchanged.

The [concurrent profile](../optimizations_2026_11_12/concurrent-profile.md)
identifies position resolution as the main native follow-up. It remains separate
from this copy experiment.

Temporary frozen workspaces and raw data continue under
`temp/optimization_2026_11_12` to preserve the original paired baseline. Current
candidate names are `sole-tail`, `slice-only` and `sole-slice`.

### Decision

The copy change is removed. The [ten-round values comparison](values-control.md)
does not establish the expected production API benefit. At 25,000 starting
Strips, full values changes by +5.52% for copy-only and +1.24% for the combined
build; the unchanged checkpoint copy changes by +2.07%. Tail-only changes by
+1.83%, so its earlier 8.76% loss does not repeat in this isolated subset. These
different case selections are not pooled with the full-suite samples.

The [five-round complete tuple comparison](tuple-control.md) also remains mixed.
The combined build has 7 non-length medians over 5% faster and 7 over 5% slower.
Eight-slot tuple replacement is 7.18% slower (paired IQR 1.17 percentage points)
and values is 10.05% slower, each slower in all five pairs. No space row changes.
This does not justify retaining a copy change by its isolated microbenchmark.
The tail-only build has 14 medians over 5% faster and none over 5% slower in this
tuple follow-up, but its earlier full-suite differences are not thereby erased.

The next hypothesis replaces per-Strip jump distances with a smaller contiguous
traversal directory. It must preserve visible ownership, original-coordinate
insertion boundaries, consumer Splices, convergence and canonical snapshots.
No benchmark or expected result is changed to accommodate it.

The [traversal directory experiment](directory.md) records implementation,
unchanged semantic checks, final linked SIMD instructions and the complete
guard status. Its measured [mixed concurrent replay](directory-mixed.md),
[eight-author replay](directory-concurrent.md), and
[native memory and artifacts](directory-space.md) remain separate from the
rejected Footage-copying experiment above.

The [known-head follow-up](directory-head.md) removes the large head-insertion
loss in its five-round targeted comparison but still fails same-index insertion.
Its gate-boundary follow-up is measured separately; neither intermediate build
is presented as meeting the all-row condition.

The [gate-boundary comparison](directory-gate.md) retains every slower result.
The next experiment uses a movable gap in the same directory allocation to
remove redundant prefix reductions and repeated interior shifts.

The [gap experiment](directory-gap.md) reduces every measured bundle encoding
and preserves the native memory savings, but alternating endpoints expose a
linear-gap movement regression. Its frozen full guard continues unchanged;
the next build uses the shorter circular route and cached rotation weight.

The [circular directory follow-ups](circular-directory.md) retain the complete
targeted tables and explain the lifecycle profile. The
[positive subtree endpoint experiment](subtree-cache.md) addresses the measured
replacement bottleneck; its head-insertion regression remains unresolved.

The [stable block record layout](directory-records.md) removes a per-node lane
and reduces relocation stores. Its complete lifecycle comparison is improved,
with smaller native allocations and artifacts; the complete guard also checks
every throughput and tuple row against two unchanged checkpoint builds.

The [deferred directory experiment](directory-lazy.md) removes maintenance before
the first actual index query. It retains all semantic checks and memory savings;
the ten-pair endpoint comparison and complete tuple follow-up are recorded
alongside its remaining apparent timing losses.

The [reader separation experiment](footage-readers.md) is rejected and reverted:
its scale-up gains accompany repeated scale-down read losses. The following
experiment instead removes repeated missing-source checks from the Frame loop.

The [span-wide source check](footage-copy.md) improves most targeted checkpoint
read medians while retaining native memory and artifact savings. Its complete
guard determines acceptance; the remaining apparent losses stay reported.

The [direct constructor experiment](direct-create.md) removes the general
protocol from empty construction and improves its targeted timings. A repeated
eight-index ordinary Projection replacement loss remains; its profile isolates
structural walks inside the directory lookup for the next experiment.

The [bidirectional block-search experiment](directory-bidirectional.md) does not
resolve the small-document replacement loss and is reverted. Profiling then
identifies one-slot Footage clearing in the JS result path as another target.

The [single-slot release experiment](single-release.md) replaces one-Frame
`Array.fill` calls with direct assignment. Its unbounded attempt is rejected
because a short Footage array can grow; the interrupted guard is not used for
acceptance. A bounded follow-up preserves the checkpoint's memory behavior and
adds one public-API regression check for that observed failure.

The [bounded release follow-up](bounded-release.md) preserves the checkpoint's
short-Footage memory behavior, passes all 277 tests at 100% coverage and improves
the targeted replacement comparison. Complete-suite acceptance remains open.

The [first-visible-member experiment](first-visible.md) fits a lookup hint into
the existing cold block record, but introduces a repeated small apply loss and
is reverted before another candidate is built.

The [generic six-word-copy experiment](literal-words.md) introduces a repeated
two-index replacement loss and is reverted. Its follow-up specializes the
existing Insertion descriptor branch instead of the general metadata copier.

The [Insertion-branch copy experiment](literal-gossip.md) does not establish a
targeted replacement benefit and is reverted. The next protocol change removes
the single-word input buffer used only to carry replacement's inclusive end.

The [scalar replacement-end experiment](scalar-end.md) removes one reserve
bridge call, heap write and Reader step from local replacement. Tests and exact
snapshots pass, and the targeted comparison has no every-pair slowdown; the
complete guard remains required.

The [reserved-slot append change](reserved-slot.md) removes the redundant growth
path, verified in the linked module. Every measured artifact encoding and native
allocation shape remains smaller than the checkpoint. Targeted replacement and
eight-author replay have no every-pair slowdown. Its complete guard improves
197 of 409 medians over 5%, but four cases remain slower in every pair against
both checkpoint copies. They are retained and profiled; acceptance remains open.

The [removal-interval experiments](removal-ranges.md) preserve exact snapshots
and improve long sparse insertions, but introduce repeated dense-removal and
checkpoint losses. Both builds are reverted; the dense prefix map remains.

The [bounded signed-slice experiment](signed-slice.md) follows the measured JS
slice hotspot. Its uint32 boundary test also fixes signed native length
interpretation. All 278 tests pass; the 40-row targeted comparison remains
mixed and complete-suite acceptance is open.

The [compact removal lookup](compact-removals.md) retains the dense prefix
algorithm while removing temporary hash nodes. Every sequence checkpoint median
improves in its five-pair lifecycle comparison; the complete guard remains open.

[Lazy JS binding tables](lazy-bindings.md) reduce the empty-instance JS heap
estimate by 56 B, but are reverted after repeatable apply losses. The
[lazy ACK state experiment](lazy-frontier.md) also reduces empty-instance
memory but is reverted after apply and tail-insertion losses.
The [deferred local insertion experiment](deferred-insert.md) is reverted after
repeatable apply losses.

The compact lookup's [complete guard and follow-ups](compact-removals.md)
preserve the large lifecycle gains and improve every sequence checkpoint median,
but retain a two-field ordinary apply.replace loss and short sequence differences.
The [sequence outlining experiment](sequence-outline.md) is reverted. Its profile
leads to a [tail boundary lookup experiment](visible-tail.md), also reverted
after inspecting the full caller stack. The
[surviving endpoint reuse](endpoint-reuse.md) removes the sampled endpoint
discovery lookup. Its complete guard preserves the large lifecycle gains but
retains four every-pair losses against both checkpoint copies.

[Snapshot output reuse](snapshot-reuse.md) removes repeated fitting-buffer
allocations without retaining a larger previous snapshot's capacities. Exact
state and alternating-snapshot allocation checks pass. Its complete guard retains
three every-pair losses against both checkpoint copies.

[Two-slot initial identity tables](two-slots.md) save about 72 native bytes for
single-root instances and small tuples without adding state or helper code.
The complete guard retains 127 positive non-length timing medians, including
61 above +5%. The [positive-row inventory](remaining-positive-timings.md) lists
all of them; nine are slower in every primary pair. Acceptance remains open.

[Removing the signed slice hint](plain-slice.md) preserves the unsigned-length
fix. [Inline input records](inline-input.md) remove one internal word per apply
entry and reduce Wasm size; their selected comparison still has losses and
their complete guard is summarized above.

The [indexed append](indexed-append.md) and [hoisted-source append](span-append.md)
experiments reduce some remote Footage heap estimates but introduce replay or
merge losses. Both are reverted; the existing bulk append remains.

[Combined input validation and copying](staged-input.md) also introduces
repeatable losses and is reverted. The inline-input complete guard uses the
separate validation and copy loops.
