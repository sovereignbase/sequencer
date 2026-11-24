# Large text guard

5 matched process pairs; baseline-copy → compact-ack. Nanoseconds per call, medians and IQR. Lower is better. All valid samples remain in the temporary round directory.

| Case                       |           Before (IQR) |       Candidate (IQR) | Change | Paired change (IQR) |
| -------------------------- | ---------------------: | --------------------: | -----: | ------------------: |
| binary/append/sequence     |         637.09 (27.69) |         645.03 (41.3) |  1.25% |     1.64% (5.89 pp) |
| array/65536/replace.middle | 202,638.61 (27,448.05) | 199,457.04 (4,803.39) | -1.57% |    -0.04% (6.19 pp) |
