# Runtime optimization, 2026-11-23

Continues [the previous runtime round](../optimizations_2026_11_22/details.zip 'runtime/README.md').
The starting source includes direct Splice output and early byte ACK coalescing.
Native SHA-256 is
`b65114a061fcff4f239e6d1778e3e7e0116774de1f7f35c8da56450eac28a7f2`,
115,349 B. The rejected output-alignment experiment has been restored and all
original 357 tests pass at 100% TypeScript coverage.

Fresh complete three-run lifecycle, throughput, tuple, text and words baselines
are captured before new production changes. Matching benchmark factories use
the same native entropy and workload seeds. Node 24.16.0,
V8 13.6.233.17-node.49, Windows x64, Intel Core i5-10210U. Compiler settings
remain Emscripten 7, LLVM 24, Binaryen 133, Release `-O3 -flto`, SIMD, bulk
memory and Wasm exceptions. No external benchmark or adapter is changed or run.

## Narrow identifier slots

Session dictionaries, tuple pages and tuple Footage bindings indexed a single
uint32 identifier using a two-word Session/start slot whose second word was
always zero. Specialize the existing table at compile time: canonical identity
tables retain Session/start and 12-byte slots; identifier tables use 8-byte
slots. Both retain the original hash, 75% load limit, masked linear probing,
admission order and full uint32 keys. The shared table object has the same
fields and size. No Projection cache, protocol flag or public API is added.

The initial prototype passes all original 357 tests with 100% TypeScript
coverage and grows Wasm 115,349 → 115,662 B. Five alternating words-process
pairs show mixed results. Binary random/concurrent sequence medians are
-4.2%/-8.4%; append sequence is +13.3%. These short-window figures alone do
not justify retention. The first prototype is frozen as `key-width`.

The follow-up removes an unnecessary new setter overload, uses the existing
coordinate setter and preserves aggregate stores for canonical two-word slots.
One-word hashing ignores the unused second argument. Both slot sizes are
compile-time checked. The `narrow` build passes all original 357 tests at 100%
TypeScript coverage and is 115,693 B. A complete five-pair guard, targeted
timings, footprint controls and linked-code inspection determine its decision.

The empty-instance and edited-array baseline is unchanged when no one-word
index is allocated. A slot reduction is not a claim of a 33% reduction in whole
Projection memory. Byte snapshots and Gossip retain their existing format.

Decision: reject all three narrow-slot variants. Edited 8/100-slot tuples
save 2.30–2.60% live memory, but the five-pair complete guards do not support
retention. Excluding length, `narrow` has 54 timing rows better and 76 worse
by over 5%; the named-field follow-up has 38 better and 83 worse. For example, `narrow`
`remove.middle` at 20,000 Strips has a paired median +14.8%, paired IQR
1.9 percentage points, with four of five pairs slower. The named follow-up
checkpoint scale-down `values` at 5,000 Strips has paired median +16.60%,
IQR 3.28 percentage points. These costs outweigh the measured memory benefit.
All production changes from these experiments are restored from the fresh
baseline, preserving the preceding direct-Splice and byte-ACK changes.

Linked Wasm inspection finds the canonical two-word reserve unchanged:
293 WAT lines, seven loads and three stores. The three additional static
loads in `apply` belong to the specialized tuple lookup, not the canonical
Session/start path. Both the array-key and named-field versions have these
loads; static counts alone do not establish a dynamic load penalty.

## Actor membership

Hypothesis: replace the separate active and retired Actor sets with one
Actor-to-active map, retaining admission order and an active count. This
removes a container and combines the retired/admission lookups. Retired
Actors remain permanently excluded; complete equal-frontier consensus,
lower later reports and zero-frontier semantics remain unchanged. Test
smaller bucket allocation with load factor two against memory and latency
across sparse, dense and retired memberships before retaining it.

This is a scalar hash lookup with dependent node loads. SIMD and speculative
parallel node walks would add work; the proposed gain is removing state and
lookups, to be checked in generated Wasm and complete paired measurements.

Decision: reject the combined membership map after three identical footprint
controls. Empty Projection live allocation plus Footage estimate drops
264 → 248 B, but map-node storage offsets that saving: 100 active Actors
4,832 → 5,176 B (+7.12%), 2,000 active Actors 85,408 → 94,872 B (+11.08%),
and 2,000 retired Actors 45,128 → 54,656 B (+21.11%).
[Every membership footprint](details.zip 'membership-space.md') is recorded, including
small cardinalities and growth boundaries. Original 357 tests and 100%
TypeScript coverage pass. Wasm grows 115,349 → 115,627 B. The full timing
guard was stopped once the deterministic memory regression rejected the
candidate; there is no latency acceptance claim. The original sets and
quorum test are restored. No new protocol or persistent Actor state is kept.

## Session dictionary count

Hypothesis: the byte writer's separate Session counter duplicates the existing
dictionary's count. Use `sessions.size() + 1` on new admission and remove the
counter. Admission order and every encoded byte remain unchanged. This
removes one writer field and its updates; targeted words measurements,
generated Wasm and a complete matched guard determine retention.

Decision: reject. All 357 tests pass and Wasm shrinks 115,349 → 115,268 B,
but five words pairs remain mixed: binary append sequence paired median
+21.0% (IQR 25.9 pp), random sequence +2.0% (2.4 pp), prepend sequence
-6.3% (4.7 pp). The [complete five-pair guard](details.zip 'dictionary.md') includes
`throughput/100/sequence` +24.12% by medians, +15.32% paired median
(IQR 5.08 pp), slower in all five pairs. This is an observed comparison,
not proof of a causal counter cost in that unchanged numeric path. There is
no sufficiently clear runtime or live-memory benefit to justify keeping
the 81-byte artifact saving with this unresolved guard. Restore the writer.

## Direct acknowledgement output

Hypothesis: `apply` and `merge` generate only three-word acknowledgements,
but retain each in a 40-byte general Gossip entry and then materialize a
second 16-byte output descriptor. Store three-word arrays directly and lend
that contiguous storage to numeric JavaScript output. Byte output needs
only one Actor prefix followed by the ordered Session/frontier pairs; every
generated report belongs to this Projection's Actor. Local insertion,
removal and replacement Gossip retain their general representation.

Numeric report count, order and values must remain identical. Binary output
must retain the exact existing bytes, including later lower frontiers and
zero-report barriers. No new wire format or compaction rule is introduced.
The target is less allocation and copying in the profiled `apply` path,
including positive-only calls which no longer build general descriptors.
No SIMD or extra speculative work is proposed: the gain must come from
removing the 40-byte copy and descriptor traversal, verified in linked Wasm.

The first build passes all original 357 tests and type checking, with 100%
TypeScript coverage (520 statements, 428 branches, 33 functions, 468 lines).
An additional temporary differential check compares 3,924 exact public
results against the starting build across numeric/byte metadata, array/text
Footage, three concurrent Actors, reversed delivery, duplicates, edits and
checkpoints. No production test expectation changes. Eight installed runtimes
pass 128 compatibility checks; Firefox is excluded only from this local run,
and CI configuration remains unchanged.

Three identical one-live-receiver controls apply 6,000 mixed concurrent edits
from four authors: 7,532 Splices and 4,513 visible Frames. With byte replies,
live allocation plus Footage estimate drops 1,871,450 → 1,814,082 B (−3.07%);
with numeric replies, 2,008,642 → 1,828,410 B (−8.97%). Empty instances remain
264 B. Footage estimate remains 43,770 B; metadata/document sizes remain
33,044/39,879 B. These are retained allocations, including shared native
output capacity, not RSS, allocator peak or a reduction in empty-instance cost.

Linked Wasm grows 115,349 → 115,412 B (+63 B). `apply` falls from 5,062 to
5,037 WAT lines and 148 to 147 stores. Its SIMD instruction count falls
69 → 65 as the larger general-entry copy is removed; fewer vector operations
here reflect less copied data, not a new vectorization claim. The canonical
identity reserve and frontier-observation instruction bodies remain unchanged.

[Five long apply pairs](details.zip 'long-compact-ack.md') use the same 6,000-edit fixtures,
500 ms warm-up and 1,000 ms measured API windows per workload. Median changes
for append/prepend/random/concurrent apply are −7.34/−1.39/−0.03/+0.12%;
paired medians are −3.08/−1.86/−0.05/−0.36%. Prepend receive is +2.57% by
medians, +3.42% paired with IQR 7.30 pp; this remains a follow-up target.
The complete guard and large-text controls determine the final decision.

The first complete guard has 63 timing medians better and 43 worse by over
5%, excluding length; it is not accepted on that summary. Five selected
throughput runs use all 51 flagged rows with original seeds and configuration,
rotating the candidate and two copies of the exact baseline. The complete
[candidate follow-up](details.zip 'focus-compact-ack.md'),
[identical-source control](details.zip 'focus-baseline-copy.md') and
[candidate against the second baseline copy](details.zip 'focus-compact-ack-vs-baseline-copy.md')
retain every row. The original `create.sequence` increases do not repeat:
1,000/20,000 Strip medians are −13.26/−1.36%. A separate five-process
500 ms `value.head` control with 100,000 warm-up calls resolves its short
increase as −2.92% (paired IQR 1.06 pp); the unchanged baseline copy itself
varies −3.49%. This does not certify every other row as noise.

Five longer words controls select every flagged short-window row before
measurement: 30 cases, 250 ms warm-up and 750 ms measurement, increasing the
call cap so tiny snapshots reach the requested window. Their
[complete comparison](details.zip 'longwords-compact-ack.md') removes most large apparent
increases, but numeric append apply remains +6.11%, paired +7.06%
(IQR 6.55 pp). Five [longer text controls](details.zip 'longtext-compact-ack.md') cover all
23 flagged cases with 100/250 ms windows and the original call caps.
Array 1,024-unit apply changes from +10.09% in the original guard to −12.18%
in this follow-up. The append apply increase remains unresolved, so the
inline ACK reader is not retained as a final accepted candidate.

### ACK reader isolation

Follow-up hypothesis: keep the direct native representation but move ACK
reading out of the large `readResult` function. Its Splice loop then retains
the original final result-selection shape instead of sharing the function
with a new ACK loop. This tests JS code generation/register allocation,
not a change to the canonical algorithm. Native Wasm remains exactly the
same 115,412 bytes. All 357 tests and 3,924 exact public-result comparisons
pass before the three-build append experiment and complete guard.

Decision: reject reader isolation. V8 bytecode confirms the intended change:
`readResult` 2,691 → 2,475 bytes, 62 → 59 registers, frame 496 → 472 B,
matching the original baseline. Nevertheless, five rotated three-build
append controls show the isolated reader +1.88% versus baseline and +1.56%
versus the inline direct reader. The inline direct reader is +0.32%
(paired IQR 0.75 pp); its earlier +6.11% does not repeat. All results are
retained in [the isolated-reader comparison](details.zip 'append-ack-reader.md'),
[the direct-reader comparison](details.zip 'append-compact-ack.md') and
[the two-reader comparison](details.zip 'append-ack-reader-vs-compact-ack.md').
An unsuccessful targeted follow-up does not proceed to the complete guard;
the already guarded inline candidate is restored immediately.

The shared native SHA-256 for both reader variants is
`b39949d7f4d82ee48d4daa4994c86893327ab6951de1e3fd77cf03fadd34dee1`.
The 100-replay diagnostic profile still finds native apply, JS input staging,
position lookup and anchor placement as the leading work. Profiling times
are not substituted for paired timing measurements.

### Reject direct-output ABI; retain the existing JS reader for the next experiment

The later lifecycle/tuple controls expose an unresolved direct-output
regression: scale-up `apply.random` +9.91% by medians, +11.46% paired
(IQR 5.61 pp), slower in all five pairs. The identical-source control is
+2.91%/+0.35%. This rejects the inline direct-output variant despite its
memory saving. Original checkpoint `values` at 5,000 Strips resolves to
+0.13%, with the unchanged copy at +2.26%; most other original flags do
not repeat. [All lifecycle and tuple rows](details.zip 'phase-compact-ack.md') and
[their unchanged-source control](details.zip 'phase-baseline-copy.md') remain available.

The next `ack-storage` candidate keeps the three-word native reports but
exposes them using the existing Gossip descriptors. TypeScript returns
exactly to the starting source; no new helper, flag or reader path is kept.
Numeric reports retain 12 bytes plus a 16-byte descriptor instead of the
old 40+16 bytes. Byte output retains one descriptor for the complete Actor
report. This gives up some numeric memory saving to test whether the JS
reader changes caused the scale-up regression. It introduces no new format.

All original 357 tests pass at 100% TypeScript coverage (509 statements,
426 branches, 33 functions, 459 lines), together with 3,924 exact public
result comparisons. Native size is 115,750 B, +401 B versus the starting
build. Three identical mixed-edit footprint controls measure numeric
replies 2,008,642 → 1,893,954 B (−5.71%) and byte replies
1,871,450 → 1,814,106 B (−3.06%). Empty-instance cost, Footage and encoded
snapshot sizes remain unchanged.

The [complete five-pair guard](details.zip 'ack-storage.md') reports 75 non-length timing
medians improving over 5% and 34 slowing over 5%. Full-lifecycle apply improves
9.81%, growth apply 12.27%, random removal 4.38% and head replacement 9.37%.
Unresolved slower medians include checkpoint values at 5,000 Strips during
scale-down (+16.03%), scale-down random replacement (+12.99%) and growth tail
replacement (+12.57%). These are not declared noise or a completed
regression-free result. Retire remains secondary at the user's request.
The subsequent general round uses this explicitly recorded intermediate
baseline; [its record](details.zip 'general/README.md') keeps each later decision separate.

Five rotated [positional controls](details.zip 'storage-controls.md'), with an
identical-source copy, do not reproduce the earlier 5,000-Strip tail
replacement slowdown: −7.28% by medians, +4.11% paired with IQR 13.02 pp;
the identical copy is −0.78%/+5.36%. Empty creation is noisy even without
changes: the copy shows +22.89% by medians and +25.15% paired.

The further [lifecycle/tuple controls](details.zip 'storage-phase.md') and
[identical-source control](details.zip 'storage-phase-aa.md') preserve every row. Full
lifecycle apply repeats an improvement (−5.05% by medians, −6.64% paired,
IQR 6.78 pp); the copy is +3.04%/+7.91%. The former down/5,000 values flag
is +25.20% by medians but +6.19% paired with IQR 28.31 pp and only three
slower pairs; the copy is −12.61%/+5.70%. Neither this discrepancy nor
other overlapping distributions is labeled a proven absence of regression.
At 100 tuple fields, create is +6.16%, while the unchanged copy is +6.02%.
Remaining throughput flags are checked separately before a final decision.

### Final ACK-storage decision: reject

The [five-round throughput flag control](details.zip 'storage-flags.md') retains all 36
selected cases and their identical-source controls. Many apparent regressions
are also present in the unchanged copy: 1,000-Strip apply(remove) is +18.27%
while the copy is +20.82%; 5,000-Strip tail replacement is +8.55% while the
copy is +8.34%. They are not attributed to the change merely from those
medians. Other differences remain materially unfavorable: at 20,000 Strips,
head value reads are 210.97 ns versus 202.20 ns for the unchanged copy.
Candidate/copy paired change is +4.26% (IQR 2.41 pp), slower in all five
pairs. The original complete guard also flags this case (+5.79% versus its
baseline, paired IQR 1.87 pp).

The [artifact comparison](details.zip 'ack-storage-artifacts.md') also adds 401 native
bytes and 119 B minified ESM gzip. The measured 3.06% byte-reply scratch
allocation saving and repeated apply improvement do not establish the
requested improvement without regressions. Reject the three-word ACK-storage
candidate rather than claim that all unfavorable rows are noise. Restore
the previously retained direct Splice output and early byte ACK coalescing;
the original generic JS reader remains. No direct ACK ABI or extra reader
helper is retained.

## Reproduction

Temporary scripts and frozen workspaces retain identical benchmark sources,
native entropy and seeds. From the repository root:

```powershell
node temp/optimization_2026_11_23_runtime/prepare.mjs baseline
node temp/optimization_2026_11_23_runtime/full.mjs baseline,narrow 5 narrow
node temp/optimization_2026_11_23_runtime/compare.mjs narrow baseline narrow 5
node temp/optimization_2026_11_23_runtime/full.mjs baseline,named 5 named
node temp/optimization_2026_11_23_runtime/compare.mjs named baseline named 5
node --expose-gc temp/optimization_2026_11_23_runtime/footprint.mjs narrow
node --expose-gc temp/optimization_2026_11_23_runtime/membership-footprint.mjs baseline
node --expose-gc temp/optimization_2026_11_23_runtime/membership-footprint.mjs membership
```

Freeze `baseline` only from the documented starting build, before changes;
each candidate is frozen after its own build. The full guard uses unchanged
25,000-Strip lifecycle checkpoints, all throughput locations and tuple modes.
[Narrow-slot complete guard](details.zip 'narrow.md') and
[named-slot complete guard](details.zip 'named.md') report every timing and space row,
including unfavorable results. No external competitor was run, so no changed
competitive rank is claimed.

Raw baselines, frozen sources, profiles and measurements remain under
`temp/optimization_2026_11_23_runtime`. Important comparisons and decisions
belong in the Markdown record rather than committed raw JSON collections.

## Archived files

[details.zip](details.zip) contains the original reports, source files and measurements
with their original directory structure. `MANIFEST.sha256` records every file hash.
Temporary workspace paths in historical reports identify provenance, not included directories.
