# Long apply windows

5 alternating matched process pairs; baseline → compact-ack. Nanoseconds per call, medians and IQR. Lower is better. All valid samples remain in the temporary round directory.

| Case               |              Before (IQR) |           Candidate (IQR) | Change | Paired change (IQR) |
| ------------------ | ------------------------: | ------------------------: | -----: | ------------------: |
| append/apply       | 1,331,819.44 (387,598.95) |  1,234,034.03 (40,701.11) | -7.34% |   -3.08% (23.30 pp) |
| append/receive     |  2,213,215.93 (77,595.99) |  2,206,049.12 (16,121.73) | -0.32% |    -0.38% (4.08 pp) |
| prepend/apply      |  2,027,312.35 (10,369.97) |   1,999,131.94 (12,207.5) | -1.39% |    -1.86% (1.85 pp) |
| prepend/receive    |  2,986,108.63 (15,676.58) | 3,062,709.79 (117,782.52) |  2.57% |     3.42% (7.30 pp) |
| random/apply       |   5,269,713.68 (1,922.11) |  5,268,387.89 (34,036.95) | -0.03% |    -0.05% (1.45 pp) |
| random/receive     |   6,199,082.1 (12,072.22) |   6,119,323.78 (82,644.5) | -1.29% |    -1.29% (1.27 pp) |
| concurrent/apply   |  4,380,517.9 (131,914.73) |   4,385,731.44 (36,516.4) |  0.12% |    -0.36% (3.48 pp) |
| concurrent/receive | 5,670,729.94 (453,842.92) |  5,423,052.97 (76,311.22) | -4.37% |    -4.70% (6.56 pp) |
