# Large text guard

5 matched process pairs; baseline → baseline-copy. Nanoseconds per call, medians and IQR. Lower is better. All valid samples remain in the temporary round directory.

| Case                       |          Before (IQR) |        Candidate (IQR) | Change | Paired change (IQR) |
| -------------------------- | --------------------: | ---------------------: | -----: | ------------------: |
| binary/append/sequence     |        630.37 (42.23) |         637.09 (27.69) |  1.07% |   -0.65% (11.67 pp) |
| array/65536/replace.middle | 201,374.47 (2,927.35) | 202,638.61 (27,448.05) |  0.63% |     1.39% (8.17 pp) |
