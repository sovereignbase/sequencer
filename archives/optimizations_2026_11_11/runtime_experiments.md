# Runtime follow-ups

Measured 12 November 2026. Controls, five matched production tuple runs, all raw
samples and isolated builds remain under `temp/optimization_2026_11_11` (P).
Length is recorded but excluded from decisions. No external workload is changed
or run. These experiments follow [snapshot copying](snapshot_copy.md).

## Rejected runtime namespace

Changing flat named runtime calls to calls on one module-level client object
does not establish a useful benefit. Native Wasm and per-instance representation
are unchanged. The candidate and control both use the same generated IIFE;
neither introduces strict mode. No claim about optimized receiver coercion is
supported by the measurements.

The [80-case comparison](namespace-tuple.md) has ten paired medians over 5% faster
and six over 5% slower than slicecopy. None is slower in every pair, but the tiny
read changes are small and inconsistent. Raw ESM grows 237 bytes, minified ESM
178 bytes and minified/gzipped ESM 49 bytes. The source change is removed rather
than adding an object and exports for an unproven gain. This early rejection has
no complete-suite or full-test acceptance claim.

## Rejected direct tuple-value pointer

Returning the winning Version's content pointer directly removes three scalar
stores from linked `runtime_value`: five become two, and WAT function length
falls from 327 to 286 lines. JavaScript still consumes only the two content words;
empty registers return a null pointer. Native live allocation is unchanged.

The [80-case comparison](tupleptr-tuple.md) does not establish a sufficient read
gain. Against slicecopy, five paired medians improve over 5% and five slow over
5%. Empty fixed-tuple construction at length 100 is 6.88% slower paired, IQR
0.86 percentage points, and slower in every pair. Small read changes do not
justify retaining that loss. The source is restored before the Version-storage
experiment. All 276 tests, 100% TypeScript coverage, both type checks and 192
canonical comparisons passed; correctness alone does not accept the change.

## External-word predicate

Candidate wordcheck changes only two JavaScript predicates over tuplerange.
Numeric type plus equality with ToUint32 replaces Number.isInteger and two bounds
comparisons. BigInt, Symbol and objects are rejected before bitwise conversion;
sparse-array and invalid-prefix semantics remain. Copying stays separate from
validation. Linked Wasm is byte-identical, so no new native SIMD/ILP/MLP claim is
made. Generated ESM retains both the type guard and unsigned conversion.

All 276 tests pass with 100% TypeScript coverage: 434 statements, 293 branches,
32 functions and 388 lines. Both type checks, 192 canonical comparisons and
272 matched public-API invalid/boundary/sparse-input cases pass.

Ten measured rounds after four warmups, rotating and reversing three-build
order, compare fourteen public remote-operation cases at 100 and 20,000 groups.
Fixtures, duplicate preparation and result checks are outside timing. Relative
to tuplerange, duplicate apply medians improve 6.98–16.37%. Fresh insert/remove/
replace and merge results are mixed: the 20,000-group apply.remove median is
15.83% slower with paired IQR 38.14 points. These target results do not prove a
universal gain.

The five-run complete guard is finished: [all rows against current](recovery-wordcheck-performance.md)
and [all isolated rows against tuplerange](recovery-wordcheck-isolated-performance.md).
Of 409 non-length timing rows, 282 paired medians improve over 5% and 17 slow
over 5% against current. The isolated comparison has 94 faster and 49 slower
paired medians over 5%. Its all-pair slower rows include 25,000-group apply.insert
(+7.23%, paired IQR 4.33 points), 100-group insert.middle (+6.19%, IQR 1.51),
insert.random (+10.05%, IQR 10.81), other insertion/range cases and checkpoint
create/sequence. All 96 memory/storage medians match tuplerange exactly. This
candidate is not accepted as regression-free.

A fresh five-run [100-group throughput repetition](wordcheck-repeat-100.md)
includes all 39 production cases, with no changed workload or call limit. The
wordcheck/tuplerange comparison has no non-length row slower in every pair.
Its insert.middle paired median is +0.49% (IQR 7.57 points), and insert.random
is -1.86% (IQR 7.53). The earlier consistent small-insertion losses therefore
do not reproduce; other whole-suite slower rows still require investigation.
The same repetition includes the next Splice candidate, whose comparison is
shown in the linked table. A second complete guard remeasures all four builds.

Commands:

- `node --expose-gc P/inlineack-replication.mjs current,tuplerange,wordcheck wordcheck`
- `node P/summarize-replication.mjs wordcheck tuplerange wordcheck`
- `node P/wordcheck-inputs.mjs`
- `node P/full.mjs current,tuplerange,wordcheck 5 recoverywordcheck`

Raw distributions are retained; no unfavorable valid sample is discarded.
