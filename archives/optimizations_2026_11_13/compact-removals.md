# Compact removal lookup

The checkpoint sequence profile spends 12.51% of sampled time allocating or
inserting removal-map nodes; the 20,000-Strip scale-down checkpoint shows 13.15%.
Replace that temporary node map with the existing ContainmentTable and a dense
vector of removal records. Tuple membership uses the same table without records.
Per-Frame marks, prefix counts, compaction rules and output traversal stay unchanged.

All 278 tests pass with 100% TypeScript coverage. All 192 exact snapshot and
encoding comparisons and 27 long, sparse and dense removal checks pass. The
linked module is 88,890 B, down 1,158 B from reserved-slot and 1,986 B from the
checkpoint. Temporary peak memory has not been measured.

The [five-pair lifecycle comparison](compact-removals-lifecycle.md) improves
52 of 75 timing medians by more than 5%; three worsen by more than 5%.
Head insertion remains slower in every pair against the checkpoint (+7.43%,
paired +7.37%, IQR 14.63 pp). All twelve sequence checkpoint medians improve,
by 7.11–35.70%. Against the [preceding candidate](compact-removals-vs-parent.md),
17 medians improve and ten worsen by more than 5%; none worsens in every pair.

The [long-insertion checks](compact-removals-long.md) have no every-pair loss
against the preceding candidate. These targeted results are not a full-suite
acceptance decision. Raw sources, profiles and samples remain under
`temp/optimization_2026_11_12/compact-removals*`.

## Complete guard

Five matched runs of all three suites, with the checkpoint, its byte-identical
control and compact-removals, retain every sample. The
[primary comparison](compact-removals-performance.md) has 204 of 409 non-length
timing medians over 5% faster and 74 over 5% slower. The
[identical-control comparison](compact-removals-aa-performance.md) has 71 faster
and 76 slower medians; it has fifteen every-pair losses despite identical code.
The [second checkpoint comparison](compact-removals-control-performance.md) has
201 faster and 77 slower medians. This does not establish all-row acceptance.

Full-lifecycle random apply improves 68.49%, random removal 67.60%, random
replacement 60.30%, tail replacement 42.16% and random scalar reads 82.44%.
All twelve sequence checkpoint medians improve, by 4.57–25.17%. The earlier
10,000-Strip scale-up and 20,000-Strip scale-down sequence losses become -4.57%
and -8.51%. Empty construction at 15,000 Strips remains +15.69% against the
primary checkpoint, and 20,000-Strip random range reads remain +6.53%; their
losses are not erased by failing the every-pair intersection filter.

Eight cases are slower in every pair against both independently run checkpoints:

| Case                       | Change vs primary | Paired change | Paired IQR, pp |
| :------------------------- | ----------------: | ------------: | -------------: |
| 25,000/create.sequence     |           +16.62% |       +16.33% |           3.92 |
| 100/value.middle           |           +26.95% |       +26.95% |           6.25 |
| 100/value.random           |           +27.31% |       +33.73% |          21.68 |
| 100/values.head            |           +42.66% |       +42.66% |          28.85 |
| 100/values.middle          |           +26.80% |       +17.58% |           7.08 |
| projection/2/apply.replace |           +31.27% |       +32.88% |          54.46 |
| tuple/2/apply.replace      |           +28.61% |       +19.44% |          79.19 |
| tuple/2/apply.duplicate    |           +25.22% |       +21.27% |          26.20 |

These require follow-up rather than dismissal as noise. The primary comparison
also has every-pair losses outside this intersection, including apply.duplicateRemove
at 1,000 Strips (+20.61%). All 96 space rows are retained: twenty native memory
rows shrink and the other 76 rows, including every serialized size, are unchanged.
No benchmark adapter is modified or executed.

The runtime source excluding generated Wasm is 182,952 normalized UTF-8 bytes
versus 183,041 at the checkpoint (-89 B). Physical lines increase from 4,498 to
4,539; nonempty code lines excluding comments increase from 3,514 to 3,597.
This is not a source-line reduction. Full raw results use prefix
`temp/optimization_2026_11_12/compactremovalsfull-*`.

## Selected production follow-up

The [five-pair throughput follow-up](compact-followup.md) selects thirteen
unchanged production cases at five checkpoints, including the original slower
reads, constructors and duplicate removal. Against the primary checkpoint,
17 of 65 medians improve and twelve worsen by more than 5%. The earlier
25,000-Strip constructor and 100-Strip read losses do not repeat in every pair.
At 15,000 Strips empty construction changes to -21.07%; random ranges at
20,000 change to -10.74%. These selected runs are not pooled with the full suite.
Sequence at 15,000 remains +13.78% (paired +14.87%, IQR 5.08 pp), and sequence
at 20,000 remains +8.05% (paired +4.51%, IQR 0.14 pp), both slower in every pair.

The [five-pair apply follow-up](compact-tuple-followup-tuple.md) selects
apply.replace and apply.duplicate in both modes at 2, 4, 8 and 100 fields.
Three of sixteen medians improve and two worsen by more than 5%. The two-field
ordinary Projection's apply.replace repeats its loss: +39.53% (paired +22.90%,
IQR 17.34 pp), slower in every pair. The fixed tuple's two-field apply.replace
changes to -1.60%; apply.duplicate is +5.58% and not slower in every pair.
The repeatable ordinary replacement loss remains open.

The [memory and artifact collector](compact-removals-space.md) measures the
candidate directly. Native allocation shapes remain smaller than the checkpoint;
serialized sizes are unchanged. The full-suite timing losses above remain part
of the decision, regardless of these space improvements.
