# Long apply windows

6 matched process pairs; baseline → hint. Nanoseconds per call, medians and IQR. Lower is better. All valid samples remain in the temporary round directory.

| Case               |                 Before (IQR) |            Candidate (IQR) | Change | Paired change (IQR) |
| ------------------ | ---------------------------: | -------------------------: | -----: | ------------------: |
| append/apply       |    3,442,276.94 (120,631.55) |   3,458,970.11 (355,357.1) |  0.48% |     1.07% (5.72 pp) |
| append/receive     |    6,159,231.03 (358,808.44) |  6,192,541.56 (336,491.94) |  0.54% |    4.34% (17.88 pp) |
| prepend/apply      |    5,477,380.69 (354,027.07) |   5,578,758.53 (87,421.17) |  1.85% |     4.84% (5.89 pp) |
| prepend/receive    |    8,260,034.68 (500,410.49) |  8,031,412.19 (265,215.87) | -2.77% |    -3.95% (1.56 pp) |
| random/apply       |   14,691,248.07 (502,074.53) | 13,672,958.11 (922,808.24) | -6.93% |    -6.64% (8.33 pp) |
| random/receive     | 18,113,405.51 (3,781,439.53) |    16,516,908.55 (732,899) | -8.81% |  -11.58% (14.81 pp) |
| concurrent/apply   |   12,143,584.94 (709,030.85) | 11,577,348.28 (212,123.75) | -4.66% |    -8.18% (5.16 pp) |
| concurrent/receive |   14,965,876.12 (359,180.03) | 14,718,591.79 (508,895.31) | -1.65% |    -1.09% (1.04 pp) |
