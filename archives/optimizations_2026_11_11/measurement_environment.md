# Measurement-window drift

The same frozen current-workspace is used by recoveryunified and recoveryscalar. The controllers, five workload seeds, Node 24.16.0, V8 13.6.233.17-node.49, machine metadata and benchmark configurations match. Comparing their baseline samples changes all 409 non-length timing medians by more than +5%. This is a diagnostic comparison of the same build across different time windows, not an optimization result or proof that a candidate regression is noise.

Selected rows, nanoseconds/call. Both columns contain the unchanged current build. The full diagnostic arrays remain in P/same-current-window-comparison.json, derived from the baseline arrays of the complete recoveryunified-current-to-unified-comparison.json and recoveryscalar-current-to-scalarreplace-comparison.json files. P = temp/optimization_2026_11_11.

| Row                                  | Earlier median | Later median |   Change | Paired change (IQR pp) |
| ------------------------------------ | -------------: | -----------: | -------: | ---------------------: |
| throughput/100/apply.duplicate       |         868.48 |     2,082.03 | +139.73% |       +142.08% (115.5) |
| throughput/100/create.empty          |         712.74 |     1,755.23 | +146.27% |      +146.27% (121.22) |
| throughput/100/value.head            |          216.1 |       395.24 |  +82.90% |        +89.42% (76.95) |
| throughput/25000/values              |    3,404,087.5 |    6,536,250 |  +92.01% |       +105.87% (27.83) |
| checkpoint/up/25000/create           |      4,152,100 |    8,977,700 | +116.22% |       +116.06% (15.69) |
| checkpoint/up/25000/sequence         |     25,717,900 |   54,434,200 | +111.66% |       +108.58% (72.81) |
| lifecycle/fullLifecycle/apply.random |      12,241.33 |    24,006.09 |  +96.11% |       +116.42% (99.02) |

At 00:34 on 12 November, Windows reports processor frequency 1,508 MHz, PercentProcessorPerformance 72, PercentPerformanceLimit 75, PerformanceLimitFlags 2, and PercentofMaximumFrequency 71. The earlier window did not record these counters, so the cause of the drift cannot be established from this observation. The active scheme is HP Optimized (recommended). No power settings or unrelated processes are changed.

Use fresh interleaved baseline/candidate runs within the same current window for acceptance, retain every valid sample and inspect dispersion. Do not compare an old fast absolute timing against a new slower window and attribute the whole difference to source. This observation also does not excuse slower candidate rows inside a matched window. The requested all-row goal remains unestablished.
