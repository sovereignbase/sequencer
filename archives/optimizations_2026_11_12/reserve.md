# Reserve the known removal output

A nonempty ordinary sequence removal produces at least one mask and one Acknowledgement. Reserving two native Entries avoids capacity one, its allocation, copying the first 40-byte Entry and freeing that initial allocation. Later geometric capacities and return-by-value ownership are unchanged. Empty ranges and tuples retain their original path. No persistent field, ABI, canonical coordinate or snapshot word changes.

The final linked Wasm allocates 80 bytes before the nonempty sequence-removal loop. Remove grows from 2,568 to 2,593 WAT lines, with two additional conditional branches and two stores; no static load increase. This removes dynamic allocation work rather than adding SIMD, ILP or MLP. SIMD cannot avoid the allocation and its dependent copy. Other inspected computation functions are unchanged.

All 276 existing tests pass with 100% TypeScript coverage. All 192 canonical snapshot and serialization pairs match. Instance-native allocation is unchanged in all five shapes. Wasm grows by 37 B and minified ESM gzip by 24 B; [all artifacts and allocations](artifacts.md).

## Long local-operation target

Ten matched measured rounds follow four warmups at 100 and 20,000 source Insertions of 32 Frames. The source alternates head/tail authoring. Each sample hydrates fresh instances and checks complete visible contents after timing. Hydration, explicit JS process garbage collection, checks and destruction are outside API timing. Build order alternates directly. Every sample is retained.

These target distributions are mixed and do not establish acceptance. Times are median ns/call; IQR is the third minus first quartile. Negative changes are faster.

| Source groups / method |  Before |     IQR |   After |    IQR | Difference |  Change | Paired change | Paired IQR, pp |
| :--------------------- | ------: | ------: | ------: | -----: | ---------: | ------: | ------------: | -------------: |
| 100/remove.head        |  651.21 |  167.92 |  610.87 |  98.57 |     -40.34 |  -6.19% |        -4.57% |          20.44 |
| 100/remove.middle      |  624.42 |   52.38 |  557.09 |  31.33 |     -67.32 | -10.78% |        -7.55% |          12.28 |
| 100/remove.tail        |  572.33 |   98.49 |  505.29 |  82.19 |     -67.03 | -11.71% |       -17.09% |          25.54 |
| 100/remove.random      |  943.09 |  172.44 |  863.00 | 105.77 |     -80.09 |  -8.49% |       -13.33% |          17.02 |
| 100/replace.head       | 1387.96 |  352.75 | 1519.38 | 275.69 |     131.43 |   9.47% |         0.15% |          29.00 |
| 100/replace.middle     | 1293.03 |  388.45 | 1622.75 | 495.72 |     329.72 |  25.50% |         3.09% |          51.19 |
| 100/replace.tail       | 1311.71 |  240.98 | 1229.39 | 279.85 |     -82.31 |  -6.28% |         0.22% |          25.40 |
| 100/replace.random     | 1778.06 |  339.56 | 1523.44 | 219.99 |    -254.62 | -14.32% |       -15.66% |          28.34 |
| 20000/remove.head      |  844.06 |  237.42 |  888.20 | 197.43 |      44.15 |   5.23% |        -1.84% |          29.67 |
| 20000/remove.middle    | 1401.66 |  244.61 | 1039.52 | 302.02 |    -362.14 | -25.84% |       -30.80% |          18.79 |
| 20000/remove.tail      | 1090.29 |  244.99 |  863.11 |  90.29 |    -227.17 | -20.84% |       -25.07% |          25.84 |
| 20000/remove.random    | 3897.93 | 1177.45 | 3768.06 | 955.13 |    -129.87 |  -3.33% |         2.40% |          43.72 |
| 20000/replace.head     | 1852.36 |  753.47 | 1702.82 | 337.49 |    -149.54 |  -8.07% |        -6.74% |          38.27 |
| 20000/replace.middle   | 1985.10 |  548.57 | 1933.87 | 630.50 |     -51.23 |  -2.58% |        -6.57% |          38.99 |
| 20000/replace.tail     | 1981.06 |  544.31 | 1707.69 | 239.70 |    -273.37 | -13.80% |        -2.86% |          20.62 |
| 20000/replace.random   | 4721.61 |  647.94 | 4470.32 | 497.49 |    -251.29 |  -5.32% |         3.98% |          30.34 |

The [five-pair production control](reserve-control5000.md) includes an independently run byte-identical baseline copy. Even that A/A comparison has large differences and dispersion. It cannot establish candidate regressions or wins by itself.

## Complete guard and selected follow-up

The [five-pair complete comparison](reserve-performance.md) has 160 timing medians
over 5% faster and 92 over 5% slower, excluding length. In particular, 25,000-Strip
remove.tail is 14.07% slower in every pair. Several read and tuple rows are also
slower. Nonempty lifecycle checkpoints retain 32 additional native bytes across
the shared runtime; no per-Projection field is added. Serialized sizes match.
This complete result does not by itself meet the acceptance requirement.

The [ten-round selected production follow-up](reserve-selected.md) reruns nine
unchanged production cases at 100, 5,000 and 25,000 Strips, including an A/A copy.
Only the case list is selected by the temporary driver; source preparation,
warmup, burst timing, checks and observation remain production code. All samples
and original slower complete-suite rows are retained.

The 25,000-Strip remove.tail result becomes -0.29% (paired +0.43%, paired IQR
4.69 percentage points); the original 14% slowdown does not repeat. Head removal
improves by 5–7% at 5,000/25,000 Strips. No selected row is slower in every one of
the ten pairs. The 100-Strip value.middle result becomes +0.11%, rather than the
complete guard's +51.89%. Tuple follow-up is still required. These findings
resolve those particular large slowdowns, not every complete-suite row.

The [second ten-round follow-up](late-followup.md) also reruns the complete
[tuple suite](late-followup-tuple.md). The earlier reservation has no tuple
timing median over 5% slower, no case slower in every matched pair and no tuple
space change. The original large tuple regressions do not repeat there.

A smaller source placement of the same reservation moves it immediately before the
existing sequence-loop push. The loop already excludes tuples and empty ranges,
so the separate function-entry condition disappears. That one-line candidate
passes all tests and canonical pairs, but grows Wasm by 89 B and ESM min + gzip
by 78 B, compared with 37 B and 24 B for the earlier placement. The matched
follow-up does not establish a sufficient runtime advantage to retain that larger
build. It is removed; the earlier reservation remains the working candidate.
The original complete-suite differences, including 32 shared native bytes,
remain recorded. The all-metrics-negative objective is not claimed.

Raw source snapshots, symbol maps, generated-code inspection, all target distributions and logs remain under `temp/optimization_2026_11_12`.
