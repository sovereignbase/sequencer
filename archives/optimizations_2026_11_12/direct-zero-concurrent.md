# Concurrent editing replay

Five matched rounds with two warmups per build. Eight independent authors each make 128 edits against the same initial snapshot. Fixtures contain 256 or 4,096 initial four-Frame Insertions, authored at alternating endpoints. The public API receives ordered, reversed and deterministically shuffled Gossip, followed by duplicate replay.

Fixture generation, hydration, value/snapshot checks, duplicate checks, destruction and explicit JS process garbage collection are outside timing. Visible values must agree across delivery orders. Candidate snapshots must equal checkpoint snapshots for the same order, both before and after duplicate delivery. ACK metadata is not assumed identical across delivery orders. An initial diagnostic incorrectly required that; it failed on the unchanged checkpoint and is retained separately under `concurrent-diagnostic-invalid-cross-order-ack` in the temporary evidence directory. Production tests and expectations are unchanged.

Times are median ns per input batch, including all public API work and pending dependency release. Negative changes mean faster. IQR describes matched percentage differences; these short targeted bursts are diagnostic evidence, not a complete regression guard. All raw samples are retained.

| Initial Insertions / operation / position / delivery | Checkpoint ns | Candidate ns |  Change | Paired change | Paired IQR, pp | Slower pairs |
| :--------------------------------------------------- | ------------: | -----------: | ------: | ------------: | -------------: | -----------: |
| 256/insert/tail/ordered                              |       1078.42 |       698.24 | -35.25% |       -33.54% |          30.47 |          1/5 |
| 256/insert/tail/reverse                              |       4076.56 |      4444.82 |   9.03% |        -3.25% |          24.15 |          2/5 |
| 256/insert/tail/shuffled                             |       2514.26 |      2525.29 |   0.44% |         4.99% |           9.86 |          3/5 |
| 256/insert/random/ordered                            |       1266.11 |      1433.59 |  13.23% |        16.50% |          51.21 |          3/5 |
| 256/insert/random/reverse                            |       1045.80 |      1047.66 |   0.18% |        -0.43% |           7.02 |          2/5 |
| 256/insert/random/shuffled                           |       1190.23 |      1172.66 |  -1.48% |        -3.80% |           6.24 |          2/5 |
| 256/remove/tail/ordered                              |       1268.07 |      1223.24 |  -3.53% |         2.21% |          27.08 |          3/5 |
| 256/remove/tail/reverse                              |       1263.18 |      1350.88 |   6.94% |         4.30% |           8.04 |          4/5 |
| 256/remove/tail/shuffled                             |       1331.25 |      1321.58 |  -0.73% |        -0.52% |          11.62 |          2/5 |
| 256/remove/random/ordered                            |       1420.02 |      1264.16 | -10.98% |        -4.06% |          13.87 |          2/5 |
| 256/remove/random/reverse                            |       1605.08 |      1592.29 |  -0.80% |        -9.79% |          21.12 |          2/5 |
| 256/remove/random/shuffled                           |       1521.68 |      1421.09 |  -6.61% |        -6.31% |          18.16 |          2/5 |
| 256/replace/tail/ordered                             |       3705.66 |      2334.08 | -37.01% |       -36.57% |          11.15 |          0/5 |
| 256/replace/tail/reverse                             |       2162.01 |      1932.71 | -10.61% |       -11.50% |          13.25 |          2/5 |
| 256/replace/tail/shuffled                            |       2557.71 |      2566.02 |   0.32% |        -1.79% |           8.45 |          2/5 |
| 256/replace/random/ordered                           |       2153.32 |      2159.96 |   0.31% |        -5.63% |           6.68 |          1/5 |
| 256/replace/random/reverse                           |       2454.59 |      2246.68 |  -8.47% |       -10.32% |          10.12 |          1/5 |
| 256/replace/random/shuffled                          |       2368.07 |      2264.94 |  -4.35% |         3.08% |          14.91 |          3/5 |
| 4096/insert/tail/ordered                             |        612.79 |       676.66 |  10.42% |        13.09% |          42.57 |          3/5 |
| 4096/insert/tail/reverse                             |       3131.15 |      3035.45 |  -3.06% |        -0.66% |           7.32 |          2/5 |
| 4096/insert/tail/shuffled                            |       2370.61 |      2450.20 |   3.36% |         0.75% |          10.91 |          3/5 |
| 4096/insert/random/ordered                           |       1430.66 |      1768.65 |  23.62% |        26.09% |          22.82 |          5/5 |
| 4096/insert/random/reverse                           |       1790.82 |      1662.11 |  -7.19% |        -5.02% |           3.24 |          1/5 |
| 4096/insert/random/shuffled                          |       2043.95 |      1908.98 |  -6.60% |         4.95% |          13.12 |          3/5 |
| 4096/remove/tail/ordered                             |       1265.53 |      1298.14 |   2.58% |        -0.48% |          17.67 |          2/5 |
| 4096/remove/tail/reverse                             |       6255.37 |      5714.75 |  -8.64% |        -3.92% |          28.53 |          2/5 |
| 4096/remove/tail/shuffled                            |       4598.83 |      4588.28 |  -0.23% |         0.94% |          10.26 |          3/5 |
| 4096/remove/random/ordered                           |       2076.76 |      2227.64 |   7.27% |        10.22% |           6.96 |          4/5 |
| 4096/remove/random/reverse                           |       2417.97 |      2521.88 |   4.30% |         0.07% |           5.63 |          3/5 |
| 4096/remove/random/shuffled                          |       2304.79 |      2302.83 |  -0.08% |        -0.52% |          12.50 |          2/5 |
| 4096/replace/tail/ordered                            |       2452.15 |      2230.76 |  -9.03% |        -9.03% |          22.10 |          2/5 |
| 4096/replace/tail/reverse                            |       2601.27 |      2299.22 | -11.61% |        -9.20% |           9.63 |          1/5 |
| 4096/replace/tail/shuffled                           |       3472.46 |      3823.14 |  10.10% |        10.10% |          13.68 |          4/5 |
| 4096/replace/random/ordered                          |       3822.07 |      3822.27 |   0.01% |         0.01% |           5.15 |          3/5 |
| 4096/replace/random/reverse                          |       4439.16 |      3920.21 | -11.69% |         1.34% |          22.70 |          3/5 |
| 4096/replace/random/shuffled                         |       3655.57 |      3400.88 |  -6.97% |        -6.46% |          12.61 |          0/5 |

Builds: `fixed-table` (checkpoint `d3108d5`) and `direct-zero`. Commands and decision are in [direct-zero.md](direct-zero.md). Raw samples: `temp/optimization_2026_11_12/direct-zero-concurrent.json`. No external benchmark or competitor was run.
