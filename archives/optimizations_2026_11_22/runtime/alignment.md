# Shared output alignment

**Rejected.** The short-call improvement does not establish a general benefit.
The complete five-pair guard against the starting implementation has 57 timing
medians improve over 5% and 58 worsen over 5%, excluding length. At 25,000
starting Strips, create.empty is +19.74% (paired +18.62%, 7.39-point IQR),
slower in every pair; at 20,000 it is +15.15%, also slower in every pair.
The full lifecycle's head insertion is +5.65% (paired +6.23%, 5.91-point IQR).
The requested no-regression criterion is not established. Restore the three
original declarations instead of retaining alignment hints on target results
alone. The pre-alignment Splice/ACK module is rebuilt and retested.

[Complete guard](alignment-performance.md). No test expectation changes.

The immediate parent is the retained direct-Splice/early-ACK build. Its shared 48-byte header starts at address 3128 (offset 56 within a 64-byte cache line), straddling two lines. Align the global Output to 64 bytes and its Result/Span vector metadata to 16 bytes, keeping those small descriptors within cache lines. No per-Projection field or public ABI record changes. Canonical output and algorithms are unchanged.

The final linked header moves to address 3200, aligned to 64 bytes. Dispatch remains 10,583 WAT lines with 146 static SIMD operations. This is a change in static addresses/alignment, not additional vectorization, ILP or independent memory streams. Cache-miss counts were not measured; a timing improvement cannot be attributed to hardware cache effects alone. Native bytes rise 115,349 → 115,350 B (+1 B). All original 357 tests pass with 100% TypeScript coverage.

## Short API controls

Five alternating fresh-process pairs of the original throughput cases with unchanged warm-up, duration, caps, inputs and seeds. Nanoseconds per call, lower is better.

| Case                  | Before ns | Candidate ns |   Change | Paired change (IQR pp) | Faster pairs |
| --------------------- | --------: | -----------: | -------: | ---------------------: | -----------: |
| 100/apply.duplicate   |  1,024.51 |     1,013.56 |  -1.069% |        -3.458% (10.31) |          3/5 |
| 1000/apply.duplicate  |  1,436.69 |     1,382.89 |  -3.745% |         2.287% (16.68) |          2/5 |
| 25000/apply.duplicate |    262.76 |       266.35 |   1.366% |       -2.317% (12.338) |          3/5 |
| 100/create.empty      |    573.98 |       534.82 |  -6.823% |       -9.439% (13.555) |          4/5 |
| 1000/create.empty     |    489.74 |       461.59 |  -5.748% |        -5.424% (0.977) |          4/5 |
| 25000/create.empty    |    556.99 |       537.97 |  -3.415% |       -0.201% (14.789) |          3/5 |
| 100/merge.duplicate   |  1,782.93 |     1,550.95 | -13.011% |       -12.392% (3.986) |          4/5 |
| 1000/merge.duplicate  |    830.49 |       721.78 |  -13.09% |       -13.091% (8.727) |          4/5 |
| 25000/merge.duplicate |    571.85 |        532.8 |  -6.829% |        -6.829% (7.282) |          4/5 |
| 100/remove.tail       | 1,598.902 |    1,488.719 |  -6.891% |       -12.05% (14.073) |          4/5 |
| 1000/remove.tail      |    631.46 |       622.77 |  -1.376% |        -1.376% (7.017) |          3/5 |
| 25000/remove.tail     |    882.61 |       863.62 |  -2.152% |        3.159% (12.041) |          2/5 |
| 100/replace.tail      |  1,432.73 |     1,402.33 |  -2.122% |        -0.468% (7.018) |          3/5 |
| 1000/replace.tail     |  1,065.89 |     1,107.54 |   3.908% |          1.844% (6.06) |          2/5 |
| 25000/replace.tail    |  1,352.32 |     1,251.66 |  -7.444% |        -2.363% (3.109) |          5/5 |
| 100/sequence          |    495.86 |       393.72 | -20.599% |       -6.684% (18.127) |          4/5 |
| 1000/sequence         |    260.45 |       258.81 |   -0.63% |        5.301% (13.577) |          2/5 |
| 25000/sequence        |     242.4 |       241.19 |  -0.499% |         -1.927% (9.76) |          3/5 |

## Ordinary words controls

Five alternating process pairs against the same parent; original 6,000-edit fixtures and timing boundaries. Microseconds per call, with IQRs. All 56 rows are retained.

| Mode / workload / call      |       Before µs (IQR) |    Candidate µs (IQR) |   Change | Paired change (IQR pp) |
| --------------------------- | --------------------: | --------------------: | -------: | ---------------------: |
| numeric/append/sequence     |         0.994 (0.053) |         1.015 (0.183) |   2.177% |        2.992% (19.376) |
| numeric/append/encode       |         29.999 (1.48) |        29.168 (0.169) |  -2.771% |        -3.083% (2.833) |
| numeric/append/decode       |         2.687 (0.254) |         2.696 (0.152) |   0.356% |         1.717% (6.392) |
| numeric/append/create       |         1.937 (0.272) |         2.083 (0.076) |   7.512% |       -3.412% (16.662) |
| numeric/append/load         |         6.626 (0.116) |         6.946 (0.505) |   4.829% |        4.829% (12.854) |
| numeric/append/apply        |   2,962.441 (327.204) |   3,207.062 (299.843) |   8.257% |        8.257% (25.591) |
| numeric/append/receive      |  3,499.42 (1,980.179) | 3,676.607 (1,994.261) |   5.063% |       10.067% (92.771) |
| binary/append/sequence      |         0.976 (0.038) |         1.057 (0.189) |   8.241% |        3.873% (31.439) |
| binary/append/encode        |        35.237 (5.036) |        34.153 (5.835) |  -3.076% |       -0.537% (12.027) |
| binary/append/decode        |         1.873 (0.336) |         1.977 (0.295) |   5.569% |        1.476% (29.136) |
| binary/append/create        |         2.192 (0.031) |          2.208 (0.11) |   0.735% |         2.439% (5.669) |
| binary/append/load          |         6.048 (0.179) |          5.566 (0.59) |  -7.979% |      -10.597% (26.725) |
| binary/append/apply         |   1,523.385 (184.079) |    1,625.842 (63.044) |   6.726% |        8.518% (12.178) |
| binary/append/receive       |   3,438.507 (122.647) |   3,279.256 (224.226) |  -4.631% |        -5.875% (1.625) |
| numeric/prepend/sequence    |      476.366 (23.415) |      449.311 (23.195) |  -5.679% |         -9.014% (5.34) |
| numeric/prepend/encode      |      558.019 (34.256) |      544.243 (18.743) |  -2.469% |         2.065% (4.355) |
| numeric/prepend/decode      |      176.213 (10.299) |       162.213 (3.921) |  -7.945% |         -7.884% (3.55) |
| numeric/prepend/create      |      832.533 (14.263) |      782.641 (58.655) |  -5.993% |        -4.209% (5.974) |
| numeric/prepend/load        |   1,446.831 (134.647) |   1,398.694 (112.702) |  -3.327% |        -4.972% (1.803) |
| numeric/prepend/apply       |   2,352.859 (274.985) |   2,629.395 (155.281) |  11.753% |       11.753% (20.017) |
| numeric/prepend/receive     | 4,609.118 (1,742.683) |    4,013.785 (15.369) | -12.916% |      -12.916% (28.406) |
| binary/prepend/sequence     |      467.479 (83.055) |      423.755 (18.113) |  -9.353% |       -7.734% (15.555) |
| binary/prepend/encode       |        33.734 (8.161) |        31.502 (0.961) |  -6.616% |       -5.193% (20.903) |
| binary/prepend/decode       |           2.487 (0.4) |         2.267 (0.312) |  -8.869% |       -17.335% (23.37) |
| binary/prepend/create       |     852.522 (108.674) |       786.159 (9.674) |  -7.784% |       -10.92% (13.023) |
| binary/prepend/load         |     894.768 (106.983) |      843.913 (40.089) |  -5.684% |       -9.673% (18.367) |
| binary/prepend/apply        |   2,362.805 (206.527) |   2,529.945 (152.367) |   7.074% |        -1.177% (9.267) |
| binary/prepend/receive      |   3,709.321 (603.952) |   3,884.723 (203.875) |   4.729% |        0.494% (15.585) |
| numeric/random/sequence     |      928.439 (91.548) |      937.687 (56.514) |   0.996% |        -1.213% (6.924) |
| numeric/random/encode       |   2,225.322 (519.451) |    2,133.837 (88.331) |  -4.111% |       -2.843% (24.038) |
| numeric/random/decode       |     907.059 (219.628) |     1,045.846 (233.2) |  15.301% |        15.301% (45.72) |
| numeric/random/create       |    1,838.05 (147.431) |   1,721.017 (141.739) |  -6.367% |        -6.435% (3.223) |
| numeric/random/load         |   4,017.662 (736.644) |   3,832.857 (976.542) |    -4.6% |        -3.15% (34.747) |
| numeric/random/apply        |   7,795.543 (510.329) |   7,481.157 (780.486) |  -4.033% |       -2.364% (16.772) |
| numeric/random/receive      |   12,968.6 (1,475.29) |   12,518.6 (1,092.85) |   -3.47% |        -3.47% (20.615) |
| binary/random/sequence      |      907.445 (32.848) |      981.98 (103.979) |   8.214% |         6.021% (6.993) |
| binary/random/encode        |         79.14 (8.646) |           72 (10.017) |  -9.022% |         0.803% (2.539) |
| binary/random/decode        |         1.674 (0.535) |         1.682 (0.093) |   0.516% |         0.994% (3.244) |
| binary/random/create        |   1,913.748 (108.548) |    1,982.696 (67.991) |   3.603% |         6.246% (8.402) |
| binary/random/load          |    1,929.954 (72.138) |     1,958.05 (64.674) |   1.456% |         4.754% (8.462) |
| binary/random/apply         |   6,202.156 (444.031) |   6,385.825 (216.161) |   2.961% |         1.236% (9.401) |
| binary/random/receive       |   7,922.071 (705.679) |   7,809.286 (286.571) |  -1.424% |       -1.424% (11.839) |
| numeric/concurrent/sequence |      803.563 (25.622) |      785.681 (23.142) |  -2.225% |        -4.044% (5.189) |
| numeric/concurrent/encode   |    1,508.55 (161.488) |    1,516.682 (69.336) |   0.539% |         0.541% (7.838) |
| numeric/concurrent/decode   |       775.275 (44.99) |       822.043 (64.44) |   6.032% |         5.673% (2.698) |
| numeric/concurrent/create   |   2,343.768 (107.867) |   2,457.186 (113.195) |   4.839% |         0.104% (9.364) |
| numeric/concurrent/load     |     4,735.5 (311.476) |   4,605.291 (899.325) |   -2.75% |      -14.897% (14.332) |
| numeric/concurrent/apply    |   6,115.533 (584.146) |   5,602.733 (266.222) |  -8.385% |        -3.252% (2.448) |
| numeric/concurrent/receive  |    10,169.18 (642.99) |   10,152.88 (747.663) |   -0.16% |        -0.679% (9.303) |
| binary/concurrent/sequence  |      740.026 (10.413) |      748.987 (38.145) |   1.211% |         0.254% (9.539) |
| binary/concurrent/encode    |         65.401 (1.78) |        57.651 (4.367) | -11.849% |        -9.976% (7.369) |
| binary/concurrent/decode    |         2.777 (0.291) |         2.472 (0.185) |     -11% |        -4.009% (4.161) |
| binary/concurrent/create    |   2,332.677 (113.974) |    2,339.027 (85.478) |   0.272% |        -1.593% (3.802) |
| binary/concurrent/load      |   2,430.243 (123.733) |    2,437.862 (98.052) |   0.314% |         2.362% (2.489) |
| binary/concurrent/apply     |       5,008 (216.249) |   4,925.236 (204.702) |  -1.653% |         -1.086% (4.26) |
| binary/concurrent/receive   |    6,920.85 (512.754) |   6,921.325 (714.071) |   0.007% |        -0.025% (2.751) |

The complete before/after guard and final decision are recorded in the round README. Raw artifacts remain under `temp/optimization_2026_11_22_runtime/aligned*` and `alignment*`. No external benchmark was run.

## Longer binary snapshot control

Five alternating process pairs; same random/concurrent fixtures, 500 ms warm-up and 1,000 ms measured API time. Milliseconds per snapshot, lower is better.

| Workload   | Before ms | Candidate ms | Change | Paired change (IQR pp) |
| ---------- | --------: | -----------: | -----: | ---------------------: |
| random     |    0.8304 |       0.8144 | -1.93% |          -5.41% (9.65) |
| concurrent |    0.6767 |       0.6977 |  3.10% |           3.48% (3.34) |
