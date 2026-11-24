# Native ACK storage positional controls

Five rotated/reversed process rounds, including an identical-source baseline copy. Original throughput fixtures, per-case seeds, 64-call warmup, 100 ms bursts and 10,000-call caps. Nanoseconds per call. Lower is better. Every valid sample is retained.

| Build / case                     |     Before (IQR) |  Candidate (IQR) | Change | Paired change (IQR) | Slower pairs |
| -------------------------------- | ---------------: | ---------------: | -----: | ------------------: | -----------: |
| ack-storage/1000/create.empty    |  640.18 (109.48) |  828.31 (193.67) | 29.39% |   29.70% (18.96 pp) |          4/5 |
| ack-storage/5000/replace.tail    | 2180.97 (153.73) | 2022.29 (492.14) | -7.28% |    4.11% (13.02 pp) |          3/5 |
| ack-storage/25000/replace.tail   | 1522.24 (547.53) |  1658.69 (72.69) |  8.96% |    8.12% (33.53 pp) |          3/5 |
| baseline-copy/1000/create.empty  |  640.18 (109.48) |  786.71 (118.64) | 22.89% |   25.15% (45.38 pp) |          3/5 |
| baseline-copy/5000/replace.tail  | 2180.97 (153.73) | 2163.93 (131.77) | -0.78% |    5.36% (26.20 pp) |          3/5 |
| baseline-copy/25000/replace.tail | 1522.24 (547.53) | 1511.94 (300.34) | -0.68% |    5.23% (18.95 pp) |          3/5 |
