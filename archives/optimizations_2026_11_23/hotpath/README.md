# Runtime hot paths

Continues [general runtime work](../general/README.md). Update-size changes
remain deferred. The source starts from the retained direct Splice output
and early byte ACK coalescing, native SHA-256
`b65114a061fcff4f239e6d1778e3e7e0116774de1f7f35c8da56450eac28a7f2`.
Fresh three-run lifecycle, throughput, tuple, text and words baselines precede
new source changes. Temporary workspaces and all valid samples are retained
under `temp/optimization_2026_11_23_hotpath`.

## One walk per directory split

The public-API mixed apply profile attributes 111 self samples to
`Traversal::insert`, behind apply's 172 samples and JS input staging's 155.
These sampled counts identify work, not API timing improvements. Directory
insertion includes splitting a full block. Its current split follows the
left half to locate the midpoint, then follows the right half to assign
block owners and add visible weights. Both structural endpoints are already
retained in the block record.

Hypothesis: walk backward from the retained last node through only the right
half, assigning the same owners and summing the same positive effects.
The final predecessor is the left block's last node; the last visited node
is the right block's first. This removes the separate midpoint walk and
needs no new index, field, allocation or public API. Integer weight addition
remains unsigned and order-independent. Masks and fragments remain ordinary
structural members, including zero-effect nodes.

This differs from the older circular-directory delta experiment, which changed
weight transfers and cached-sum refresh. Row movement, block counts, weights,
cached sums, circular gap selection and exported order remain unchanged here.
SIMD cannot gather an arbitrary doubly linked chain; the proposed benefit is
removing half its dependent link loads. Existing contiguous SIMD reductions
remain. Inspect final linked Wasm for removal of the midpoint loop before
attributing any speedup to compiler behavior.

Measure local and remote insert/remove/replace, acknowledged lifecycle
checkpoints, all tuple cases, large text, words, memory and artifacts.
Run existing convergence and public-API tests without expectation changes.
The candidate is accepted only after the complete baseline comparison and
resolution of reproducible unfavorable differences.

The fresh profile again identifies this path: native apply has 421 self
samples, JS apply staging 316, position lookup 269, anchor placement 198
and traversal insertion 128. Profiled durations are not acceptance timings.

The one-walk candidate passes all 357 original tests at unchanged 100%
TypeScript coverage, type checking and 3,924 exact public-result comparisons.
Native size falls 115,349 → 115,282 B. Final linked code-section comparison
finds 122 identical native function bodies; only `Traversal::insert`, which
inlines splitting, changes (2,359 → 2,292 encoded bytes). Long apply/receive
controls and the complete guard still determine retention.

The long five-pair control is mixed: seven of eight medians improve, including
prepend apply −3.51%, random apply −5.27% and prepend receive −3.69%.
Concurrent receive is +4.61%, paired +8.48% with IQR 6.19 pp, slower in
four pairs. It is not declared noise or accepted from the favorable cases.
The [complete targeted table](long-reverse.md) retains every sample summary.

The linked insertion body has 11 → 9 loops, 76 → 69 scalar load sites,
34 → 35 scalar store sites and unchanged 25 SIMD sites. The removed dependent
walk appears in final linked code; no new SIMD kernel or MLP gain is claimed.
Three memory controls match exactly: 1,871,450 B after apply and 2,016,738 B
after snapshot. Document and metadata encodings match. [All artifacts](reverse-artifacts.md)
include raw/minified ESM and CJS, glue, native, gzip and Brotli; several Brotli
sizes and raw-bundle gzip are slightly larger despite smaller raw/minified code.

An exact-path A/A diagnostic compares the same frozen baseline's fresh runs
and later baseline runs with matching seeds, compiler, fixture code and bundle.
Of 409 non-length timings, 344 medians rise over 5% without a source change;
full lifecycle apply changes +63.65% by medians, +15.92% paired. This exposes
substantial environment/process variation, not permission to dismiss unfavorable
candidate results. Before reviewing the complete candidate decision, extend
the alternating comparisons to six pairs: three complete ABBA blocks balance
which build runs first. The initial five-pair results remain preserved.

Decision: reject the backward split after the [six balanced full pairs](reverse-six.md).
Of 409 non-length timing medians, 232 improve over 5% and 62 slow over 5%.
Only 100-Strip `replace.sameIndex` is over 3% slower in every pair:
+31.36% by medians, +14.44% paired with IQR 6.96 pp. The latter is the
matched-input comparison; neither statistic is hidden. Full lifecycle head
removal remains +6.73%/+6.35% with IQR 12.26 pp and four slower pairs.
The retained memory/storage rows are unchanged. Fewer dependent link loads
and a smaller native body do not justify this reproducible regression.
The original forward split is restored while work continues on apply lookup.

## Reuse a canonical miss during registration

Native apply first looks up the incoming canonical identity for duplicates,
then registers a new root after placement. Both operations probe the same
open-addressed table. A miss has already found the empty slot needed by set.
The current compiled apply body contains eight static instances of the
Containment hash's multiplication constants across its lookup and registration
branches. Source inspection confirms that placement, arena growth, tuple add
and parent lookup do not register identities between this miss and set.

Hypothesis: optionally return the empty slot from `get`, and let `set` use it
without hashing/probing again. If registration grows the table, invalidate
the slot and follow the original probe. Pending operations retain no slot;
duplicates still return before registration. Existing callers use the original
lookup/set behavior through default arguments. No table slot, instance field,
load factor, Session constraint, wire format or JS wrapper changes.

This removes repeated hash/probe work in apply rather than changing key widths
or introducing a per-Projection cache. It differs from the rejected narrower
containment-slot experiments. SIMD does not gather arbitrary probe chains;
inspect final linked code for the bypass and preserved ordinary callers.
Measure all original methods, memory and artifacts and run the unchanged
convergence/public-API tests before retention.

The lookup candidate passes all 357 original tests with unchanged 100%
TypeScript coverage, type checking and 3,924 exact public-result comparisons.
Its [six balanced long controls](long-hint.md) show random apply −6.93%
(paired −6.64%, IQR 8.33 pp), random receive −8.81% (paired −11.58%,
IQR 14.81 pp) and concurrent apply −4.66% (paired −8.18%, IQR 5.16 pp).
Prepend apply is +1.85% (paired +4.84%, IQR 5.89 pp); append apply/receive
are +0.48%/+0.54%. All cases remain visible; this is not a complete-suite
acceptance or a claim that every method improves.

Live allocation matches the parent exactly in three mixed-edit controls:
1,871,450 B after apply and 2,016,738 B after snapshot. No instance/slot
field is added. [Artifacts](hint-artifacts.md) include the native increase
115,349 → 115,530 B, minified ESM 156,540 → 156,767 B and gzip
53,615 → 53,734 B. These costs still require a meaningful runtime benefit.
Native comparison finds 115 unchanged function bodies and eight changed
bodies, including ordinary users of the shared table. Their timings are
guarded too, rather than assuming a default argument leaves generated code
unchanged.

The [complete six-pair matrix](hint.md) has 100 timing medians improve over
5% and 74 worsen over 5%, including length controls. Full-lifecycle apply is
−2.06% by medians, −3.18% paired (IQR 14.65 pp). Growing head/tail insertion
is −7.63%/−6.21%, but 10,000-Strip head replacement is slower in all six
pairs: +17.64% by medians, +4.85% paired (IQR 3.39 pp). The unrestricted
setter change is not accepted.

The generated ordinary setter callers also recompute a slot address during
registration. Test a narrower version: preserve the original two-argument
setter body and add a three-argument overload for apply's preceding miss.
The overload commits directly only while the table has capacity; otherwise
it delegates to the ordinary setter. This keeps the lookup reuse without
rewriting registration for local edits, tuple pages and the words writer.
Generated bodies and the complete timing guard must confirm the effect.

The narrowed `hint-overload` build passes the same 357 tests at 100%
TypeScript coverage, type checking and all 3,924 exact-result comparisons.
Wasm is 115,217 B, down 132 B from the starting build. The native apply
body shrinks 6,838 → 6,397 B; registration is shared in one new helper.
The original insert, remove, snapshot and tuple-slot bodies are byte-identical.
Minified ESM shrinks 156,540 → 156,343 B, gzip 53,615 → 53,586 B.
[All artifact sizes](hint-overload-artifacts.md) retain the small Brotli
increases too: native +13 B and minified CommonJS +12 B. Three mixed-edit
live-allocation controls and encoded document sizes match the starting build.
These are structural results, not runtime acceptance; timing controls follow.

The [six long pairs](long-hint-overload.md) are mixed: random apply −15.57%,
concurrent apply −21.49%, but append apply/receive +10.38%/+10.25%.
Paired IQRs are 83.89/28.30/32.09/27.15 pp respectively; those gains and
increases are not treated as established effects. The complete six-pair
guard runs next. A supplementary diagnostic is prepared before its results:
six fresh processes, the same original fixture and measure helpers, both
builds in one process, eight alternating 125 ms windows per operation after
250 ms warm-up. Numeric and byte modes both exercise all four workloads.
It checks the append flag and shorter-term process/environment variation;
it does not replace or alter any original suite, fixture, result or API check.

Linked inspection uses `wasm-dis` on the byte-extracted installed module,
not compiler intermediate output. After normalizing relocated direct-call
indices and symbol-only exception clone suffixes, 118 of 121 distinct named
bodies match. Apply and two exception type-info routines differ; the latter
retain identical instruction counts. Apply has 281 → 259 scalar/vector load
sites and 191 → 183 store sites, excluding the new shared registration helper.
Its 69 SIMD instructions remain unchanged. These static counts are not
dynamic work savings. The helper's capacity-valid branch increments count
and writes the three slot words, then returns without hashing or probing.
No new SIMD, independent probe streams or claimed MLP gain is involved;
the intended gain is deleting a repeated dependent hash/probe chain.

The [complete six-pair guard](hint-overload.md) finishes with 92 non-length
timing medians better and 113 worse by over 5%, out of 409. Full-lifecycle
apply is −3.24% by medians, −2.06% paired (IQR 2.12 pp). The prior
10,000-Strip head-replacement flag is now −10.89%/−6.57% (IQR 15.32 pp).
Other increases remain unresolved, including 10,000-Strip create +10.29%
(paired +8.66%, IQR 5.50 pp) and 15,000-Strip tail value +13.86%
(paired +10.48%, IQR 3.49 pp), both slower in all six pairs. The candidate
is not accepted from the apply improvement or the smaller binary alone.

Follow-up controls continue on 24 November. In addition to the predeclared
interleaved words diagnostic, select every throughput/tuple flag over 5%,
or paired increase over 3% with IQR below twice the increase. Selected
throughput cases run on baseline, candidate and the exact baseline path
within each fresh process, with per-case rotated/reversed order. Retain the
original fixture, case seed, warmup, cap, assertions and timing boundaries.
Six analogous lifecycle controls retain the complete original workloads;
tuple controls use the original 25/50 ms warmup/measurement windows.
These diagnostic order changes supplement the original complete guard;
all original unfavorable results remain available.

The [interleaved words control](interleaved-hint-overload.md) does not repeat
the earlier append increase: binary apply is +3.33% by medians, +1.25%
paired (IQR 16.84 pp), with three slower pairs. Binary random receive is
−3.88%/−5.22% (IQR 1.83 pp), faster in all six. Numeric concurrent apply
remains inconclusive: +1.80%/+5.80%, IQR 8.99 pp and five slower pairs.

The subsequent [three-label throughput diagnostic](interleaved-throughput-hint-overload.md)
has an important limitation: baseline and its control invoke the same imported
benchmark functions twice per case, versus once for the candidate. This can
unequally train shared JavaScript feedback even though native instances reset.
The unchanged baseline control itself has paired increases of 8–34% on
several reads. Its large candidate increases cannot isolate the production
change from unequal code exposure. Neither gains nor losses from this
diagnostic are accepted as isolated effects. Raw samples and the complete
table remain; the similarly designed phase diagnostic is stopped after two
complete rounds and a partial third, before its decision.

Before drawing a conclusion, run an equal-exposure control: six fresh processes,
every selected throughput and tuple case on each build twice, in ABBA/BAAB
order alternating by case and process. Preserve original fixtures, assertions,
warm-up, timing windows and call caps. Aggregate total API time / actual calls
for each build within a process. Complete lifecycle workloads run once per
build, alternating first build between processes. Retain every valid sample
and report within-build repeat differences as well. The original complete
six-pair guard remains the primary record and is not overwritten.

## Final lookup decision

Reject `hint-overload` after the [equal-exposure controls](balanced-hint-overload.md).
At 100 Strips, `create.sequence` is +5.73% by medians and +4.90% paired
(IQR 0.91 pp), slower in all six processes. Full-lifecycle apply is
+1.21%/+0.50% (IQR 15.55 pp), so its earlier complete-guard gain does
not repeat. Some target cases improve, including the repeated binary
random-receive control, but they do not establish a useful overall gain
meeting the no-regression requirement. The 132-byte native reduction and
unchanged memory footprint do not justify retention.

Restore only the canonical-lookup experiment from the frozen starting source.
The previously retained direct Splice output and early byte ACK coalescing
remain. Backward split, unrestricted cached setter and apply-only cached
setter are all rejected; no new per-Projection state or wire change survives
this hot-path round. Continue with the separately requested batch API.

A separate diagnostic counted zero-effect masks before considering an early
return from visible-position lookup. In the existing 6,000-edit workloads,
random editing has zero such cases among 4,320 masks; concurrent editing
has 11 among 2,219. This is not a leading source of work in those fixtures.
No production change is made for this hypothesis.
