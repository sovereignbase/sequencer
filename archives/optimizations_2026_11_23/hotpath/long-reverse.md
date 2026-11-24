# Long apply windows

5 matched process pairs; baseline → reverse. Nanoseconds per call, medians and IQR. Lower is better. All valid samples remain in the temporary round directory.

| Case               |                 Before (IQR) |             Candidate (IQR) | Change | Paired change (IQR) |
| ------------------ | ---------------------------: | --------------------------: | -----: | ------------------: |
| append/apply       |    4,711,075.12 (397,527.24) |   4,335,322.08 (340,592.34) | -7.98% |  -13.09% (15.16 pp) |
| append/receive     |    8,361,416.67 (569,711.87) |      7,953,776.19 (805,945) | -4.88% |   -7.79% (14.09 pp) |
| prepend/apply      |    6,741,607.38 (242,263.53) |   6,504,649.35 (194,005.61) | -3.51% |    -3.77% (6.83 pp) |
| prepend/receive    |     10,736,426.6 (38,291.49) |  10,340,738.14 (289,908.42) | -3.69% |    -3.48% (2.82 pp) |
| random/apply       | 18,433,430.91 (1,308,031.42) |  17,461,786.21 (554,210.71) | -5.27% |    -2.50% (4.55 pp) |
| random/receive     | 21,303,646.81 (1,463,210.74) | 20,846,662.5 (1,804,380.56) | -2.15% |    -4.19% (4.52 pp) |
| concurrent/apply   |   14,561,234.78 (710,512.34) |  14,464,297.14 (189,094.75) | -0.67% |    -4.82% (4.30 pp) |
| concurrent/receive |   17,893,242.86 (892,051.98) |  18,718,464.81 (892,060.84) |  4.61% |     8.48% (6.19 pp) |
