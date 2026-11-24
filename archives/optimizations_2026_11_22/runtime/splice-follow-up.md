# Read and retirement follow-up

Five rotated fresh-process rounds of the original throughput cases, with unchanged seeds, 64-call warmup, 100 ms ceiling and 10,000-call cap. The third build is a byte-identical copy of the baseline implementation. It is an A/A control, not another candidate. Negative latency changes are faster.

| Case / Strips         | Before ns | Direct Splice ns |  Change | Paired change (IQR pp) | A/A change | A/A paired change (IQR pp) |
| --------------------- | --------: | ---------------: | ------: | ---------------------: | ---------: | -------------------------: |
| retire/100            |    399.73 |           484.60 |  21.23% |         10.11% (31.57) |     35.26% |             35.26% (74.90) |
| retire/1000           |    309.52 |           310.63 |   0.36% |          -0.70% (9.94) |     18.32% |              9.39% (13.37) |
| retire/20000          |    314.40 |           275.18 | -12.47% |        -15.04% (18.56) |     -6.92% |            -11.98% (24.88) |
| value.random/100      |    211.08 |           204.46 |  -3.14% |          4.20% (28.85) |      9.67% |              9.67% (57.80) |
| value.random/1000     |    220.29 |           193.02 | -12.38% |         -7.58% (12.28) |    -10.94% |            -15.42% (13.38) |
| value.random/20000    |    271.48 |           255.19 |  -6.00% |          -6.08% (0.44) |      3.27% |             -4.65% (17.10) |
| value.sameIndex/100   |    184.29 |           153.24 | -16.85% |         -0.36% (19.50) |    -14.55% |            -14.55% (16.49) |
| value.sameIndex/1000  |    178.93 |           157.24 | -12.12% |        -10.28% (12.67) |    -12.80% |              -6.46% (8.95) |
| value.sameIndex/20000 |    167.14 |           166.93 |  -0.13% |           1.52% (4.82) |      1.59% |              -3.65% (8.69) |
| value.tail/100        |    209.68 |           193.39 |  -7.77% |         -7.19% (25.27) |      6.25% |              6.91% (31.16) |
| value.tail/1000       |    172.17 |           172.06 |  -0.06% |          2.20% (12.14) |     -3.76% |              -6.23% (3.24) |
| value.tail/20000      |    175.46 |           177.05 |   0.91% |          -1.16% (6.80) |     -4.90% |              -3.51% (4.75) |
| values.head/100       |    475.59 |           478.46 |   0.60% |         -0.37% (19.76) |     -6.25% |             -2.59% (11.91) |
| values.head/1000      |    451.45 |           460.14 |   1.92% |         20.20% (58.58) |     -4.90% |              6.52% (16.18) |
| values.head/20000     |    337.54 |           277.13 | -17.90% |          0.61% (22.37) |    -18.33% |             -9.72% (10.48) |

No candidate row is slower in all five follow-up pairs. The earlier 20k same-index read median changed from +45.30% in the full suite to -0.10% here. At 100 Strips retirement remains +21.21% by ratio of medians, but the unchanged A/A copy is +35.29%; paired dispersion is large. These controls do not certify every call as equal, but they do not reproduce a stable read/retirement slowdown attributable to the representation change. All earlier full-suite results remain in the archive.
