# Direct public-API follow-ups

Medians and IQRs in ns. Control is a separately loaded, byte-identical copy
of the baseline bundle. Negative change is faster. All variants use the same
inputs, warmup and measured call counts. No compiler or runtime flags change.
Explicit JS process garbage collection, fixture creation and final-state checks
are outside the timed loops.

## Fresh apply and merge

Ten counterbalanced rounds after four warmup bursts, with distinct monomorphic
callers for each variant/case. Fixtures have 100 or 20,000 insertion groups of
32 Frames; 1,000 fresh tail edits are authored outside timing. Bursts replay
the same Gossip into 64 small or 16 large freshly hydrated receivers. Every
receiver's complete values are checked against its author.

| Groups | Operation     | Before median (IQR) | Control median (IQR) | After median (IQR) | Change |
| -----: | ------------- | ------------------: | -------------------: | -----------------: | -----: |
|    100 | apply.insert  |        457.2 (26.7) |         460.9 (37.2) |       456.2 (42.9) |  -0.2% |
|    100 | apply.remove  |        870.5 (34.2) |         820.1 (21.1) |       782.5 (34.9) | -10.1% |
|    100 | apply.replace |     3,453.4 (205.8) |       3,419.1 (79.2) |     3,327.6 (94.2) |  -3.6% |
|    100 | merge.insert  |        923.2 (38.6) |         870.6 (72.6) |       880.5 (40.5) |  -4.6% |
|  20000 | apply.insert  |        759.9 (47.9) |         736.4 (45.4) |       729.8 (71.9) |  -4.0% |
|  20000 | apply.remove  |        960.3 (53.6) |        945.0 (171.8) |       856.7 (38.9) | -10.8% |
|  20000 | apply.replace |     3,750.8 (166.4) |      3,657.3 (164.9) |    3,667.7 (130.3) |  -2.2% |
|  20000 | merge.insert  |     1,166.7 (137.3) |       1,115.9 (51.8) |     1,120.8 (40.5) |  -3.9% |

## Local edit and read follow-ups

Ten counterbalanced rounds after four warmup bursts, with a separate named
caller for each variant/case. The same 100/20,000-group snapshots and numeric
payloads are used. Each edit burst contains 800 or 4,096 operations per receiver;
32 small or eight large receivers amortize the clock and cold-call costs.
Read/sequence bursts use the counts retained in the raw observations. Frame
counts and complete-value checksums agree across all variants.

| Groups | Operation    |     Before median (IQR) |    Control median (IQR) |      After median (IQR) | Change |
| -----: | ------------ | ----------------------: | ----------------------: | ----------------------: | -----: |
|    100 | remove.head  |            602.1 (61.9) |            584.2 (53.5) |            604.3 (69.1) |   0.4% |
|    100 | replace.head |            991.6 (81.2) |           940.6 (132.8) |            930.9 (56.0) |  -6.1% |
|    100 | insert.head  |            281.2 (58.1) |            232.9 (50.5) |            228.1 (17.1) | -18.9% |
|    100 | insert.tail  |            134.9 (48.4) |            152.5 (41.7) |              91.0 (7.2) | -32.5% |
|    100 | value.head   |              26.0 (1.8) |              26.9 (1.5) |              25.4 (1.1) |  -2.5% |
|    100 | value.middle |              26.6 (3.3) |              27.9 (2.1) |              24.5 (1.9) |  -7.8% |
|    100 | sequence     |      15,615.6 (1,968.2) |      15,256.6 (1,620.9) |      15,747.7 (4,066.2) |   0.8% |
|    100 | values       |      41,040.0 (4,839.5) |      39,862.3 (7,260.0) |     39,791.6 (23,825.4) |  -3.0% |
|  20000 | remove.head  |            614.7 (51.4) |            623.0 (20.5) |            587.1 (31.4) |  -4.5% |
|  20000 | replace.head |          1,099.7 (49.5) |          1,110.1 (57.0) |          1,109.2 (57.6) |   0.9% |
|  20000 | insert.head  |            273.3 (14.1) |            257.9 (23.6) |            248.2 (38.9) |  -9.2% |
|  20000 | insert.tail  |            197.7 (26.9) |            216.0 (21.2) |            168.0 (24.1) | -15.0% |
|  20000 | value.head   |              30.3 (7.0) |              30.5 (2.4) |              27.8 (2.0) |  -8.4% |
|  20000 | value.middle |              31.7 (7.0) |              34.6 (8.9) |              29.8 (2.2) |  -5.9% |
|  20000 | sequence     | 3,393,787.5 (245,537.5) | 3,447,525.0 (264,278.1) | 3,517,162.5 (295,543.8) |   3.6% |
|  20000 | values       | 5,770,265.6 (784,460.9) | 5,749,362.5 (563,326.6) | 5,790,625.0 (380,170.3) |   0.4% |

The earlier five-round 38-case local sweep used shorter bursts and exhibited
large differences between unchanged baseline copies. The final named-caller
follow-up did not reproduce the apparent small-document head-removal regression:
its median difference was +0.4%, within an 11.4% candidate IQR. Large-document
head removal was 4.5% faster. No general local-edit speedup is claimed.

Ten additional rounds cover length/value/values/sequence for ordinary and fixed
tuple modes at 2, 4, 8 and 100 fields. Their unchanged control also varies;
a 20–30% difference in some values bursts occurs between identical baseline
copies. These read sweeps do not establish a read improvement.

## Acknowledgements

Ten counterbalanced rounds, with 500,000 warmup calls and 1,000,000 measured
calls per sample. Inputs contain one Actor-only ACK or one ACK with the listed
number of Session/frontier pairs. Exported frontiers agree after every case.

| Session pairs | Before median (IQR) | Control median (IQR) | After median (IQR) | Change |
| ------------: | ------------------: | -------------------: | -----------------: | -----: |
|             0 |        218.5 (12.2) |          226.1 (7.0) |       195.1 (13.0) | -10.7% |
|             1 |        255.9 (12.7) |          249.4 (8.6) |       222.2 (10.4) | -13.2% |
|            32 |        911.3 (17.9) |         900.3 (20.2) |       835.5 (19.4) |  -8.3% |

## Allocation and snapshot size

Three runs at both 1,000 and 10,000 concurrently live Projections, using one
Wasm instance and no peer. Medians below are live native allocator bytes per
instance at 10,000 instances. The five shapes retain exactly the same native
allocation. Post-GC JS heap deltas vary slightly and are not object-size guarantees.

| Shape     | Before native B/instance | After native B/instance | Before JS heap B/instance | After JS heap B/instance |
| --------- | -----------------------: | ----------------------: | ------------------------: | -----------------------: |
| empty     |                   278.55 |                  278.55 |                    241.12 |                   241.14 |
| single    |                   558.56 |                  558.56 |                    445.86 |                   444.02 |
| sequence8 |                   558.56 |                  558.56 |                    417.68 |                   417.97 |
| tuple8    |                  1406.62 |                 1406.62 |                    421.70 |                   422.48 |
| edited8   |                  3593.79 |                 3593.79 |                   1123.92 |                  1123.00 |

All matched lifecycle snapshot sizes, tuple allocation/storage rows and JS array
slot estimates agree. Lifecycle live-native-allocation medians differ by −16 to
+24 bytes across the complete shared runtime; individual pairs differ slightly
with allocator chunk reuse. There is no new retained state or per-instance field.
Incoming ACKs and hydration's local three-word ACK no longer allocate temporary
vectors. Encoded formats and compression ratios do not change.

## Result

Fresh tail-removal application improves by 10–11% in the ten-round public-API
comparison. Insert/replace/merge follow-ups do not reproduce the complete-suite
apparent slowdowns. Some small gains also occur in the unchanged control, so
they are not all attributed to the implementation. Whole-lifecycle apply is
essentially unchanged: the five-pair median is 1.5% higher, with overlapping
distributions. The candidate is retained for removed allocation/copy work, the
specific removal-apply improvement and the smaller generated module; no general
speedup across all methods is claimed.
