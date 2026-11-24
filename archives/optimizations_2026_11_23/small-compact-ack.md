# Large text guard

5 matched process pairs; baseline → compact-ack. Nanoseconds per call, medians and IQR. Lower is better. All valid samples remain in the temporary round directory.

| Case                       |          Before (IQR) |       Candidate (IQR) | Change | Paired change (IQR) |
| -------------------------- | --------------------: | --------------------: | -----: | ------------------: |
| binary/append/sequence     |        630.37 (42.23) |         645.03 (41.3) |  2.33% |     0.44% (3.11 pp) |
| array/65536/replace.middle | 201,374.47 (2,927.35) | 199,457.04 (4,803.39) | -0.95% |    -0.24% (2.63 pp) |
