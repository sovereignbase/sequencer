# Long apply windows

6 matched process pairs; baseline → hint-overload. Nanoseconds per call, medians and IQR. Lower is better. All valid samples remain in the temporary round directory.

| Case               |                 Before (IQR) |             Candidate (IQR) |  Change | Paired change (IQR) |
| ------------------ | ---------------------------: | --------------------------: | ------: | ------------------: |
| append/apply       |    2,369,764.82 (312,668.18) |   2,615,855.07 (681,915.56) |  10.38% |   10.50% (32.09 pp) |
| append/receive     |    4,136,411.95 (215,124.25) |   4,560,461.48 (905,265.14) |  10.25% |   15.88% (27.15 pp) |
| prepend/apply      |    3,329,751.35 (238,057.67) |    3,258,860.59 (287,094.8) |  -2.13% |   -4.52% (17.63 pp) |
| prepend/receive    |    5,089,045.82 (359,922.28) |   5,289,848.26 (881,840.37) |   3.95% |   -1.48% (14.36 pp) |
| random/apply       |  9,220,891.99 (4,518,494.46) | 7,785,525.94 (5,165,627.49) | -15.57% |  -13.16% (83.89 pp) |
| random/receive     | 13,713,535.27 (6,458,529.37) | 9,503,943.92 (1,249,172.17) | -30.70% |  -20.67% (19.81 pp) |
| concurrent/apply   |  8,175,048.14 (4,178,943.81) |   6,418,317.42 (309,472.51) | -21.49% |  -20.87% (28.30 pp) |
| concurrent/receive |  9,033,982.43 (2,949,404.54) |   9,235,885.56 (234,102.68) |   2.23% |    1.37% (25.51 pp) |
