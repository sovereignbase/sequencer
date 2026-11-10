# Matched allocation and API measurements

Latencies are ns per public call, or ns per construction plus initial fill.
Values in parentheses are interquartile ranges. The control is a separately
loaded byte-identical baseline. The baseline is the checkout named in the
[round report](README.md). Individual observations are retained below.

## Initial tuple fill procedure

Five matched pairs, counterbalanced variant order; 512 warm-up instances, then
10,000 concurrently live tuples (1,000 at 100 fields). The same input array is
used for every variant, and explicit destruction follows the measured loop.
`candidate2` has the lazy arena and shared queues; `candidate3` additionally
removes the binding sentinel and reserves final geometric batch capacity.

## Initial tuple fill

| Case       |           baseline |       candidate2 |         candidate3 | Change |
| ---------- | -----------------: | ---------------: | -----------------: | -----: |
| 2 fields   |    1,939.2 (279.7) |  1,822.6 (209.4) |    1,647.9 (166.1) | -15.0% |
| 4 fields   |    2,191.4 (197.0) |  2,069.6 (148.5) |    2,163.7 (266.9) |  -1.3% |
| 8 fields   |     2,892.8 (63.2) |   2,743.7 (98.7) |    2,410.4 (175.4) | -16.7% |
| 100 fields | 22,688.0 (2,115.6) | 20,552.8 (905.1) | 17,609.1 (1,803.3) | -22.4% |

## Distributed ESM application procedure

Ten counterbalanced pairs after three warm-up trials, using the same snapshot
and identical 4,096 preauthored replacement Gossip batches for every variant.
Each trial verifies the final public values against the author. Calls use the
actual distributed ESM, with one persistent package/Wasm instance per variant.

## Distributed ESM apply.replace

| Case           |        baseline |         control |      candidate3 | Change |
| -------------- | --------------: | --------------: | --------------: | -----: |
| projection/2   | 1,680.3 (125.3) | 1,727.0 (217.0) | 1,691.2 (131.2) |   0.7% |
| tuple/2        | 1,135.7 (176.3) |  1,114.4 (30.6) |  1,113.7 (86.4) |  -1.9% |
| projection/4   | 2,345.6 (114.4) | 2,341.0 (142.6) |  2,323.2 (61.0) |  -1.0% |
| tuple/4        | 1,252.3 (199.8) | 1,165.6 (387.2) |  1,189.5 (93.0) |  -5.0% |
| projection/8   | 2,579.7 (218.4) | 2,395.8 (125.4) | 2,458.0 (211.6) |  -4.7% |
| tuple/8        | 1,192.5 (107.6) |  1,067.2 (32.4) |  1,092.7 (47.0) |  -8.4% |
| projection/100 | 3,069.1 (308.8) | 2,936.0 (117.4) | 3,009.7 (164.0) |  -1.9% |
| tuple/100      |  1,042.4 (35.4) |  1,100.8 (83.9) |  1,055.7 (54.7) |   1.3% |

## Distributed ESM read procedure

Ten counterbalanced pairs for each mode, size and method; 32 live Projections
per variant. Each variant has an independent monomorphic caller. Scalar reads
use one million warm-up calls and two million measured calls per observation;
`values()` and `sequence()` use 5,000 warm-up and 10,000 measured calls.
Returned lengths or numeric values feed an observable sum. All variants receive
the same values. Each package keeps its single Wasm instance for the entire run.

## Distributed ESM reads

| Case                    |        baseline |         control |      candidate3 | Change |
| ----------------------- | --------------: | --------------: | --------------: | -----: |
| projection/2/length     |       6.0 (0.5) |       6.1 (0.2) |       5.9 (0.2) |  -1.0% |
| projection/2/value      |      17.0 (0.3) |      17.1 (0.3) |      18.0 (0.1) |   5.8% |
| projection/2/values     |   192.5 (107.3) |   185.3 (116.5) |   194.8 (124.5) |   1.2% |
| projection/2/sequence   |    237.3 (16.3) |    248.1 (21.7) |    224.4 (20.2) |  -5.4% |
| tuple/2/length          |       6.0 (0.3) |       5.8 (0.2) |       6.0 (0.3) |  -1.4% |
| tuple/2/value           |      19.2 (1.3) |      18.9 (1.9) |      18.5 (0.3) |  -3.8% |
| tuple/2/values          |    119.3 (15.7) |     121.9 (9.0) |     105.8 (6.3) | -11.3% |
| tuple/2/sequence        |    383.5 (49.0) |    369.6 (33.1) |    355.5 (41.2) |  -7.3% |
| projection/4/length     |       6.1 (0.6) |       6.1 (0.3) |       6.0 (0.2) |  -0.3% |
| projection/4/value      |      17.1 (1.4) |      17.4 (0.8) |      17.2 (0.7) |   0.5% |
| projection/4/values     |     103.8 (9.7) |     101.3 (7.1) |     95.4 (13.4) |  -8.1% |
| projection/4/sequence   |    223.7 (24.6) |    237.2 (51.6) |    231.1 (22.4) |   3.3% |
| tuple/4/length          |       6.1 (0.2) |       6.1 (0.3) |       6.1 (0.1) |   0.3% |
| tuple/4/value           |      19.2 (0.5) |      19.3 (0.4) |      19.4 (1.3) |   1.3% |
| tuple/4/values          |    118.9 (18.0) |    118.2 (13.9) |     111.9 (8.3) |  -5.9% |
| tuple/4/sequence        |    448.4 (38.8) |    444.5 (68.8) |    422.6 (20.5) |  -5.8% |
| projection/8/length     |       5.9 (0.1) |       6.1 (0.5) |       5.9 (0.3) |  -0.4% |
| projection/8/value      |      17.7 (0.8) |      17.9 (0.7) |      18.2 (0.5) |   3.2% |
| projection/8/values     |     107.6 (8.5) |    108.8 (11.3) |    103.6 (14.0) |  -3.7% |
| projection/8/sequence   |    248.0 (40.5) |    240.4 (28.6) |    240.7 (36.4) |  -2.9% |
| tuple/8/length          |       5.9 (0.6) |       6.0 (0.2) |       6.0 (0.4) |   1.2% |
| tuple/8/value           |      20.4 (0.4) |      21.2 (1.7) |      20.5 (0.2) |   0.4% |
| tuple/8/values          |    139.0 (14.8) |    142.2 (11.9) |     131.1 (7.8) |  -5.7% |
| tuple/8/sequence        |    578.3 (11.9) |    572.5 (35.6) |    543.7 (64.9) |  -6.0% |
| projection/100/length   |       6.1 (0.3) |       6.2 (0.2) |       5.9 (0.2) |  -3.0% |
| projection/100/value    |      18.7 (1.8) |      19.3 (1.7) |      18.0 (0.7) |  -4.0% |
| projection/100/values   |    172.1 (22.5) |    158.5 (21.7) |    150.9 (23.0) | -12.3% |
| projection/100/sequence |    303.3 (22.2) |    294.1 (57.5) |    315.4 (28.1) |   4.0% |
| tuple/100/length        |       6.0 (0.4) |       6.0 (0.4) |       6.1 (0.5) |   1.9% |
| tuple/100/value         |      21.1 (0.7) |      22.1 (0.9) |      23.8 (1.9) |  12.8% |
| tuple/100/values        |    812.6 (93.3) |    779.5 (82.4) |    775.6 (76.6) |  -4.6% |
| tuple/100/sequence      | 4,931.8 (213.1) | 4,796.3 (233.1) | 4,865.8 (301.9) |  -1.3% |

## Scalar-read rechecks

The first distributed-ESM sweep had a 5.8% slower ordinary two-field value read
and a 12.8% slower 100-field tuple value read. These cases were repeated in ten
counterbalanced pairs using one million warm-up and five million measured calls
per observation, with the intermediate shared-queue build as a fourth variant.
The differences narrowed to 1.0% in both cases, within the observed dispersion;
the slower result did not reproduce. The earlier observations remain above.

## Two-field scalar reads

| Case              |   baseline |    control | candidate2 | candidate3 | Change |
| ----------------- | ---------: | ---------: | ---------: | ---------: | -----: |
| projection/length |  6.1 (0.4) |  6.0 (0.3) |  6.1 (0.2) |  6.1 (0.3) |   0.1% |
| projection/value  | 17.5 (0.3) | 17.4 (0.7) | 17.7 (1.2) | 17.7 (0.9) |   1.0% |
| tuple/length      |  5.9 (0.1) |  5.9 (0.2) |  6.2 (0.3) |  6.0 (2.0) |   2.0% |
| tuple/value       | 19.4 (0.6) | 19.3 (0.3) | 19.1 (1.6) | 19.2 (1.2) |  -0.8% |

## 100-field scalar reads

| Case              |   baseline |    control | candidate2 | candidate3 | Change |
| ----------------- | ---------: | ---------: | ---------: | ---------: | -----: |
| projection/length |  5.8 (0.2) |  5.9 (0.1) |  5.9 (0.3) |  5.9 (0.2) |   0.8% |
| projection/value  | 18.2 (1.1) | 17.4 (0.2) | 18.6 (1.4) | 18.1 (0.2) |  -0.1% |
| tuple/length      |  5.9 (0.2) |  5.9 (0.5) |  6.1 (0.3) |  5.9 (0.1) |  -0.5% |
| tuple/value       | 22.1 (1.7) | 22.2 (0.3) | 22.5 (0.7) | 22.3 (0.4) |   1.0% |

## Range-read follow-up

Ten matched pairs, fixed input and Session entropy, one persistent diagnostic
runtime per variant. The existing throughput fixture and burst implementation
are reused, with three warm-up and ten measured bursts per observation.

## Range reads

| Case                  |     baseline |      control |   candidate3 | Change |
| --------------------- | -----------: | -----------: | -----------: | -----: |
| 15000/values.head     | 226.2 (28.9) | 220.3 (12.9) | 228.9 (38.3) |   1.2% |
| 1000/values.sameIndex | 247.8 (45.2) | 222.1 (18.1) | 215.6 (18.4) | -13.0% |

## Diagnostic tuple-suite follow-up

All 80 existing tuple cases, five counterbalanced pairs, three warm-up and ten
measured bursts per observation; fixed Session entropy and one persistent
instrumented runtime per variant. This evaluates the existing benchmark harness.
In this harness some scalar getters repeatedly measured slower even though the
native getter work was unchanged. The distributed-ESM checks above investigate
that discrepancy without the diagnostic IIFE/private exports. These differences
are retained here rather than silently discarded.

## All tuple cases

| Case                           |           baseline |          control |       candidate3 | Change |
| ------------------------------ | -----------------: | ---------------: | ---------------: | -----: |
| projection/2/create.empty      |      635.6 (384.9) |    664.3 (100.6) |     577.0 (47.9) |  -9.2% |
| projection/2/create.sequence   |     1,549.3 (85.3) |   1,552.1 (92.0) |  1,551.9 (133.9) |   0.2% |
| projection/2/replace.random    |     1,254.2 (13.0) |   1,229.1 (40.1) |   1,166.6 (53.9) |  -7.0% |
| projection/2/apply.replace     |     1,791.1 (95.2) |  1,803.4 (105.7) |   1,713.0 (53.1) |  -4.4% |
| projection/2/apply.duplicate   |       769.0 (37.1) |      815.3 (8.5) |     774.2 (71.4) |   0.7% |
| projection/2/merge.duplicate   |       825.6 (44.9) |     861.9 (22.6) |     856.0 (15.4) |   3.7% |
| projection/2/length            |          9.8 (0.1) |        9.5 (0.2) |       10.1 (0.6) |   3.0% |
| projection/2/value.random      |         34.1 (3.0) |       33.4 (1.3) |       37.5 (2.7) |  10.2% |
| projection/2/values            |       267.4 (68.5) |     269.1 (10.5) |      269.9 (3.0) |   0.9% |
| projection/2/sequence          |      601.9 (137.5) |     591.0 (11.5) |     553.0 (35.2) |  -8.1% |
| tuple/2/create.empty           |      693.8 (147.2) |    807.6 (159.5) |    663.4 (247.3) |  -4.4% |
| tuple/2/create.sequence        |     1,872.0 (84.6) |   1,795.8 (77.9) |   1,741.0 (56.5) |  -7.0% |
| tuple/2/replace.random         |       798.7 (90.1) |     844.7 (83.5) |     808.7 (85.0) |   1.3% |
| tuple/2/apply.replace          |     1,106.6 (40.3) |   1,159.0 (76.1) |   1,140.7 (53.7) |   3.1% |
| tuple/2/apply.duplicate        |       829.8 (49.6) |     819.1 (27.2) |     794.5 (26.9) |  -4.3% |
| tuple/2/merge.duplicate        |        948.8 (6.9) |     855.1 (23.6) |     852.5 (31.9) | -10.1% |
| tuple/2/length                 |         10.3 (0.4) |        9.9 (0.0) |       13.5 (0.6) |  31.0% |
| tuple/2/value.random           |         23.2 (0.4) |       23.2 (1.3) |       25.7 (2.0) |  10.6% |
| tuple/2/values                 |       270.0 (36.2) |     286.5 (28.9) |     264.4 (11.9) |  -2.1% |
| tuple/2/sequence               |       598.2 (72.5) |     588.3 (63.9) |     539.4 (25.1) |  -9.8% |
| projection/4/create.empty      |       647.3 (30.3) |     673.7 (51.9) |     557.9 (59.7) | -13.8% |
| projection/4/create.sequence   |     2,315.8 (68.6) |   2,304.1 (44.1) |  1,915.2 (165.1) | -17.3% |
| projection/4/replace.random    |     1,143.8 (19.3) |   1,186.8 (12.8) |   1,094.3 (41.6) |  -4.3% |
| projection/4/apply.replace     |     2,445.6 (96.1) |  2,483.6 (327.9) |  2,285.7 (127.2) |  -6.5% |
| projection/4/apply.duplicate   |       808.6 (17.3) |     815.9 (29.0) |      782.5 (2.1) |  -3.2% |
| projection/4/merge.duplicate   |     1,142.1 (54.4) |   1,011.4 (69.1) |     976.5 (48.9) | -14.5% |
| projection/4/length            |         10.7 (1.0) |       10.3 (0.4) |       13.6 (0.4) |  27.5% |
| projection/4/value.random      |         41.0 (0.5) |       41.7 (1.3) |       46.4 (1.2) |  13.2% |
| projection/4/values            |       297.2 (41.8) |     313.2 (22.3) |     333.0 (81.3) |  12.0% |
| projection/4/sequence          |       593.0 (23.6) |     613.9 (60.1) |     570.6 (43.8) |  -3.8% |
| tuple/4/create.empty           |       699.5 (51.9) |    726.1 (197.3) |    687.9 (108.0) |  -1.7% |
| tuple/4/create.sequence        |    2,007.1 (260.7) |  1,978.1 (215.5) |  2,056.8 (178.9) |   2.5% |
| tuple/4/replace.random         |       780.4 (89.5) |     850.5 (45.1) |     784.9 (13.2) |   0.6% |
| tuple/4/apply.replace          |     1,149.1 (37.6) |   1,148.9 (13.3) |   1,106.1 (50.3) |  -3.7% |
| tuple/4/apply.duplicate        |       805.1 (21.3) |      814.8 (6.9) |     778.5 (65.8) |  -3.3% |
| tuple/4/merge.duplicate        |     1,141.5 (66.6) |   1,037.1 (43.2) |   1,035.5 (44.2) |  -9.3% |
| tuple/4/length                 |         10.3 (1.0) |       10.0 (0.3) |       13.5 (1.9) |  31.5% |
| tuple/4/value.random           |         23.5 (2.0) |       23.9 (0.5) |       25.1 (1.1) |   6.7% |
| tuple/4/values                 |       284.3 (28.3) |     302.6 (22.5) |     299.9 (25.9) |   5.5% |
| tuple/4/sequence               |       654.3 (51.7) |     660.7 (26.2) |     598.0 (21.3) |  -8.6% |
| projection/8/create.empty      |        603.1 (8.2) |     660.6 (34.0) |     594.0 (43.8) |  -1.5% |
| projection/8/create.sequence   |    3,027.3 (222.1) |   2,961.5 (77.4) |  2,954.8 (300.4) |  -2.4% |
| projection/8/replace.random    |     1,131.6 (31.1) |  1,105.9 (116.8) |   1,131.2 (30.1) |  -0.0% |
| projection/8/apply.replace     |    2,566.5 (151.7) |  2,583.3 (179.9) |   2,512.9 (26.3) |  -2.1% |
| projection/8/apply.duplicate   |       813.8 (45.5) |     817.9 (58.2) |     752.8 (55.5) |  -7.5% |
| projection/8/merge.duplicate   |     1,457.4 (28.9) |   1,356.2 (60.1) |  1,327.5 (226.1) |  -8.9% |
| projection/8/length            |          9.9 (0.3) |       10.4 (0.8) |       13.2 (2.5) |  32.2% |
| projection/8/value.random      |         51.2 (2.0) |       50.3 (2.0) |       57.3 (3.2) |  12.0% |
| projection/8/values            |       374.1 (43.8) |      363.1 (8.4) |     334.6 (28.7) | -10.5% |
| projection/8/sequence          |       779.4 (38.7) |     766.6 (41.3) |     785.9 (62.8) |   0.8% |
| tuple/8/create.empty           |       649.0 (18.5) |     686.8 (17.7) |     693.9 (51.7) |   6.9% |
| tuple/8/create.sequence        |     2,540.5 (42.0) |  2,395.3 (172.4) |  2,544.1 (207.9) |   0.1% |
| tuple/8/replace.random         |       792.7 (70.1) |     837.2 (52.2) |     788.5 (44.5) |  -0.5% |
| tuple/8/apply.replace          |     1,139.7 (57.8) |  1,278.2 (134.2) |   1,092.7 (40.0) |  -4.1% |
| tuple/8/apply.duplicate        |        815.3 (8.7) |     843.2 (41.9) |     790.0 (19.2) |  -3.1% |
| tuple/8/merge.duplicate        |     1,441.3 (55.7) |   1,365.2 (17.9) |   1,290.2 (40.6) | -10.5% |
| tuple/8/length                 |         10.1 (0.2) |       10.0 (0.2) |       13.8 (2.4) |  36.1% |
| tuple/8/value.random           |         23.7 (1.0) |       23.4 (0.9) |       26.3 (0.9) |  11.0% |
| tuple/8/values                 |       372.0 (41.8) |     363.3 (10.6) |      339.0 (2.0) |  -8.9% |
| tuple/8/sequence               |      835.2 (148.4) |     804.4 (57.5) |     766.7 (28.6) |  -8.2% |
| projection/100/create.empty    |      790.6 (117.6) |     791.1 (51.6) |     697.4 (72.5) | -11.8% |
| projection/100/create.sequence | 17,884.0 (1,140.5) | 17,162.3 (767.6) | 17,418.5 (503.5) |  -2.6% |
| projection/100/replace.random  |    1,431.4 (116.6) |  1,398.2 (201.6) |   1,385.4 (22.3) |  -3.2% |
| projection/100/apply.replace   |    3,028.6 (118.0) |   3,033.5 (49.8) |  2,939.4 (204.7) |  -2.9% |
| projection/100/apply.duplicate |       834.6 (53.5) |     823.4 (56.8) |     793.2 (39.5) |  -5.0% |
| projection/100/merge.duplicate |    8,571.3 (213.7) |   8,526.5 (29.4) |  8,554.3 (121.5) |  -0.2% |
| projection/100/length          |         10.9 (0.5) |       10.5 (0.3) |       14.6 (2.3) |  34.1% |
| projection/100/value.random    |       117.0 (25.3) |     115.4 (13.4) |      115.8 (7.3) |  -1.0% |
| projection/100/values          |    2,114.9 (121.3) |   2,037.3 (40.4) |   2,040.0 (54.2) |  -3.5% |
| projection/100/sequence        |    6,688.6 (186.7) |   6,446.1 (87.7) |   6,150.1 (40.8) |  -8.1% |
| tuple/100/create.empty         |       823.9 (82.5) |     803.9 (52.5) |     762.1 (26.6) |  -7.5% |
| tuple/100/create.sequence      |   10,291.7 (489.0) | 10,156.2 (434.7) | 10,099.2 (466.8) |  -1.9% |
| tuple/100/replace.random       |       805.7 (64.9) |     877.7 (80.5) |      813.5 (2.8) |   1.0% |
| tuple/100/apply.replace        |     1,275.0 (58.7) |    1,204.3 (3.1) |   1,194.1 (37.0) |  -6.3% |
| tuple/100/apply.duplicate      |       854.1 (35.0) |     869.9 (39.9) |     821.9 (17.4) |  -3.8% |
| tuple/100/merge.duplicate      |    12,794.1 (86.4) | 12,377.2 (218.0) | 12,303.1 (346.3) |  -3.8% |
| tuple/100/length               |         10.1 (0.2) |       10.3 (0.6) |       11.6 (3.3) |  14.0% |
| tuple/100/value.random         |         25.1 (0.3) |       25.4 (3.2) |       24.7 (2.2) |  -1.8% |
| tuple/100/values               |     1,918.4 (67.9) |   1,917.1 (94.4) |   1,946.4 (81.7) |   1.5% |
| tuple/100/sequence             |    5,822.7 (183.8) |   5,579.6 (93.3) |   5,580.4 (64.9) |  -4.2% |

## Individual matched observations

Numbers are chronological observations in ns; no observations are discarded.

### Initial tuple fill

| Case | Variant    | Observations (ns)                                |
| ---- | ---------- | ------------------------------------------------ |
| 2    | baseline   | 3,036.4, 2,075.7, 1,747.0, 1,939.2, 1,796.1      |
| 2    | candidate2 | 2,839.2, 2,001.7, 1,822.6, 1,653.6, 1,792.2      |
| 2    | candidate3 | 2,511.6, 1,647.9, 1,754.5, 1,528.4, 1,588.5      |
| 4    | baseline   | 2,301.8, 2,387.2, 2,191.4, 2,104.8, 2,051.0      |
| 4    | candidate2 | 2,829.8, 1,876.8, 2,069.6, 2,084.7, 1,936.3      |
| 4    | candidate3 | 3,137.4, 2,361.6, 2,094.7, 2,163.7, 1,997.4      |
| 8    | baseline   | 2,682.9, 2,892.8, 2,929.1, 2,865.9, 2,947.9      |
| 8    | candidate2 | 2,730.6, 2,623.2, 2,829.3, 2,743.7, 2,832.3      |
| 8    | candidate3 | 2,572.9, 2,410.4, 2,397.5, 2,381.5, 2,638.6      |
| 100  | baseline   | 18,559.3, 23,193.6, 22,716.3, 22,688.0, 20,600.7 |
| 100  | candidate2 | 21,402.7, 20,497.6, 22,556.2, 20,271.0, 20,552.8 |
| 100  | candidate3 | 18,801.5, 16,998.2, 17,609.1, 16,348.8, 19,690.0 |

### Distributed ESM apply.replace

| Case           | Variant    | Observations (ns)                                                                        |
| -------------- | ---------- | ---------------------------------------------------------------------------------------- |
| projection/2   | baseline   | 1,899.9, 1,684.2, 1,693.7, 1,616.1, 1,534.1, 1,517.5, 1,676.4, 1,661.5, 2,007.0, 1,772.5 |
| projection/2   | control    | 2,309.3, 2,119.5, 1,689.6, 1,593.7, 1,751.7, 1,678.8, 1,809.4, 1,702.3, 1,593.0, 1,928.2 |
| projection/2   | candidate3 | 1,995.6, 1,849.2, 1,651.8, 1,542.4, 1,659.8, 1,623.0, 1,690.9, 1,692.2, 1,691.5, 1,816.0 |
| tuple/2        | baseline   | 1,386.2, 1,492.0, 1,084.6, 1,095.9, 1,168.8, 1,274.7, 1,071.4, 1,087.5, 1,239.7, 1,102.5 |
| tuple/2        | control    | 1,229.2, 1,073.3, 1,110.7, 1,139.6, 1,211.7, 1,114.1, 1,082.1, 1,133.1, 1,106.2, 1,114.6 |
| tuple/2        | candidate3 | 1,108.5, 1,177.5, 1,068.7, 1,055.0, 1,089.6, 1,118.9, 1,254.2, 1,071.5, 1,135.1, 1,171.5 |
| projection/4   | baseline   | 2,477.2, 2,514.6, 2,300.2, 2,426.7, 2,300.1, 2,242.8, 2,288.7, 2,377.6, 2,329.2, 2,362.1 |
| projection/4   | control    | 4,304.6, 2,453.8, 2,345.6, 2,307.7, 2,264.3, 2,311.3, 2,336.4, 2,539.1, 2,443.4, 2,247.9 |
| projection/4   | candidate3 | 2,839.6, 2,400.8, 2,331.2, 2,326.9, 2,319.6, 2,296.2, 2,194.8, 2,368.0, 2,302.8, 2,277.1 |
| tuple/4        | baseline   | 1,324.7, 1,351.3, 1,029.2, 1,154.2, 1,116.6, 1,041.4, 1,362.5, 1,326.2, 1,320.2, 1,184.4 |
| tuple/4        | control    | 1,109.8, 1,124.7, 1,082.3, 1,145.5, 1,070.8, 1,185.6, 1,761.3, 1,192.8, 1,603.4, 1,712.3 |
| tuple/4        | candidate3 | 1,180.1, 1,136.2, 1,061.0, 1,060.0, 1,248.0, 1,184.1, 1,329.9, 1,275.5, 1,216.6, 1,194.9 |
| projection/8   | baseline   | 2,736.1, 2,483.5, 2,420.8, 2,794.4, 2,493.9, 2,728.9, 2,671.4, 2,502.7, 2,633.6, 2,525.9 |
| projection/8   | control    | 2,365.5, 2,370.9, 2,299.8, 2,535.4, 2,420.7, 2,270.2, 2,432.9, 2,370.8, 2,612.2, 2,512.0 |
| projection/8   | candidate3 | 2,479.1, 2,360.8, 2,322.6, 3,890.9, 2,394.4, 2,532.9, 2,333.4, 2,437.0, 2,596.8, 2,650.3 |
| tuple/8        | baseline   | 1,347.0, 1,139.3, 1,257.0, 1,258.2, 1,177.1, 1,131.4, 1,126.2, 1,207.9, 1,214.2, 1,138.5 |
| tuple/8        | control    | 1,098.3, 1,065.1, 1,061.9, 1,063.5, 1,046.0, 1,130.9, 1,044.8, 1,069.2, 1,118.7, 1,083.9 |
| tuple/8        | candidate3 | 1,117.7, 1,084.9, 1,165.3, 1,101.8, 1,080.1, 1,062.2, 1,100.4, 1,028.0, 1,152.3, 1,050.3 |
| projection/100 | baseline   | 3,088.1, 3,390.9, 3,605.4, 3,171.2, 3,517.6, 3,050.0, 3,027.4, 2,954.4, 3,027.1, 2,817.4 |
| projection/100 | control    | 2,888.5, 3,075.0, 2,917.2, 2,979.3, 3,092.7, 2,855.7, 2,981.9, 2,954.9, 2,846.0, 2,798.4 |
| projection/100 | candidate3 | 3,078.3, 3,878.3, 3,396.3, 2,920.6, 2,970.4, 2,938.2, 2,837.3, 3,049.0, 3,092.6, 2,786.4 |
| tuple/100      | baseline   | 1,025.3, 1,048.9, 1,074.8, 1,055.2, 1,022.4, 1,035.9, 1,066.7, 1,031.5, 1,072.0, 1,027.4 |
| tuple/100      | control    | 1,150.8, 1,041.2, 1,158.5, 1,143.5, 1,074.3, 1,062.1, 1,121.7, 1,037.1, 1,080.0, 1,208.1 |
| tuple/100      | candidate3 | 990.4, 1,015.7, 1,002.1, 1,081.7, 1,074.3, 1,052.9, 1,019.8, 1,063.0, 1,139.4, 1,058.6   |

### Distributed ESM reads

| Case                    | Variant    | Observations (ns)                                                                        |
| ----------------------- | ---------- | ---------------------------------------------------------------------------------------- |
| projection/2/length     | baseline   | 6.6, 6.3, 6.0, 5.8, 5.7, 5.8, 6.1, 6.0, 5.9, 6.6                                         |
| projection/2/length     | control    | 8.1, 6.1, 6.3, 6.1, 6.1, 5.7, 6.0, 6.7, 5.7, 6.1                                         |
| projection/2/length     | candidate3 | 6.5, 6.1, 5.9, 6.0, 5.7, 5.8, 5.8, 5.9, 6.0, 5.7                                         |
| projection/2/value      | baseline   | 17.3, 17.0, 16.9, 20.7, 17.1, 17.4, 16.9, 17.0, 16.9, 17.0                               |
| projection/2/value      | control    | 17.1, 17.2, 17.0, 20.3, 17.3, 16.9, 17.4, 17.1, 16.9, 17.0                               |
| projection/2/value      | candidate3 | 18.0, 18.1, 18.0, 18.6, 18.0, 17.9, 18.0, 18.1, 18.0, 18.0                               |
| projection/2/values     | baseline   | 298.9, 244.5, 284.7, 222.2, 216.5, 126.3, 129.3, 168.5, 138.2, 129.5                     |
| projection/2/values     | control    | 263.1, 252.6, 272.8, 213.8, 258.3, 135.3, 130.4, 156.7, 128.6, 155.9                     |
| projection/2/values     | candidate3 | 371.0, 240.9, 274.8, 250.0, 166.2, 119.0, 123.1, 223.5, 123.5, 116.8                     |
| projection/2/sequence   | baseline   | 543.2, 307.5, 243.0, 236.4, 243.2, 228.1, 238.2, 226.4, 219.4, 218.8                     |
| projection/2/sequence   | control    | 385.0, 246.0, 255.3, 253.4, 232.2, 231.0, 226.1, 250.1, 215.5, 251.6                     |
| projection/2/sequence   | candidate3 | 507.1, 249.2, 230.5, 242.2, 225.5, 221.2, 218.3, 223.2, 215.6, 215.5                     |
| tuple/2/length          | baseline   | 6.0, 5.9, 6.2, 6.1, 5.9, 8.0, 6.3, 6.0, 5.9, 6.1                                         |
| tuple/2/length          | control    | 5.7, 5.8, 6.0, 5.8, 5.8, 14.4, 5.7, 5.8, 6.1, 5.9                                        |
| tuple/2/length          | candidate3 | 5.7, 5.7, 6.7, 6.0, 5.9, 6.6, 5.7, 6.0, 6.0, 5.8                                         |
| tuple/2/value           | baseline   | 19.3, 18.9, 20.4, 19.9, 19.1, 20.4, 18.7, 19.1, 22.1, 18.8                               |
| tuple/2/value           | control    | 18.7, 21.3, 19.2, 18.7, 19.1, 18.7, 18.5, 21.3, 21.0, 18.5                               |
| tuple/2/value           | candidate3 | 18.3, 18.3, 21.8, 18.6, 18.6, 18.4, 18.4, 18.6, 19.9, 18.2                               |
| tuple/2/values          | baseline   | 206.1, 116.7, 109.7, 134.7, 119.8, 118.8, 121.4, 115.3, 111.6, 179.9                     |
| tuple/2/values          | control    | 255.7, 104.5, 115.7, 133.2, 126.9, 122.9, 120.6, 122.2, 111.6, 121.5                     |
| tuple/2/values          | candidate3 | 291.8, 97.8, 105.1, 110.6, 106.0, 111.6, 109.3, 101.9, 105.5, 103.5                      |
| tuple/2/sequence        | baseline   | 454.3, 416.1, 398.5, 370.9, 362.6, 363.1, 423.5, 396.2, 361.7, 355.4                     |
| tuple/2/sequence        | control    | 443.8, 386.8, 369.7, 361.6, 396.4, 386.5, 350.9, 350.3, 346.3, 369.4                     |
| tuple/2/sequence        | candidate3 | 413.6, 386.9, 397.7, 365.0, 339.0, 335.5, 335.8, 347.6, 363.4, 344.1                     |
| projection/4/length     | baseline   | 5.7, 6.6, 6.2, 6.4, 5.8, 5.8, 6.2, 5.9, 5.7, 6.5                                         |
| projection/4/length     | control    | 13.3, 5.8, 5.9, 6.2, 6.1, 6.2, 6.0, 6.3, 6.0, 6.3                                        |
| projection/4/length     | candidate3 | 6.8, 6.2, 6.1, 5.9, 5.8, 6.1, 5.9, 6.1, 5.9, 6.0                                         |
| projection/4/value      | baseline   | 19.7, 17.9, 16.9, 17.0, 16.9, 17.1, 18.6, 20.5, 17.0, 17.1                               |
| projection/4/value      | control    | 17.3, 17.2, 17.5, 17.1, 17.1, 17.9, 18.1, 18.0, 17.2, 18.1                               |
| projection/4/value      | candidate3 | 16.9, 17.3, 16.9, 16.9, 18.0, 17.6, 18.0, 17.7, 17.1, 16.9                               |
| projection/4/values     | baseline   | 152.4, 101.8, 105.5, 112.3, 108.7, 102.0, 101.8, 93.3, 115.1, 91.6                       |
| projection/4/values     | control    | 128.2, 95.8, 103.6, 103.1, 111.3, 99.6, 98.2, 102.9, 94.2, 89.4                          |
| projection/4/values     | candidate3 | 125.3, 88.9, 95.2, 103.0, 108.2, 95.5, 89.0, 85.3, 99.8, 84.4                            |
| projection/4/sequence   | baseline   | 244.8, 225.5, 255.4, 221.0, 242.7, 218.4, 218.7, 219.2, 221.9, 262.3                     |
| projection/4/sequence   | control    | 308.6, 276.5, 243.5, 319.9, 230.8, 219.8, 252.2, 216.1, 218.5, 218.1                     |
| projection/4/sequence   | candidate3 | 232.6, 235.8, 252.9, 231.0, 220.2, 209.5, 231.2, 204.1, 256.6, 210.1                     |
| tuple/4/length          | baseline   | 6.1, 5.9, 6.1, 6.0, 6.5, 5.8, 6.1, 6.1, 6.3, 6.9                                         |
| tuple/4/length          | control    | 6.4, 6.1, 5.9, 6.0, 6.0, 6.1, 6.0, 6.1, 7.9, 6.3                                         |
| tuple/4/length          | candidate3 | 5.8, 5.8, 6.1, 6.1, 6.0, 6.1, 6.1, 6.1, 6.2, 8.4                                         |
| tuple/4/value           | baseline   | 18.8, 19.3, 19.1, 19.2, 18.8, 18.7, 20.6, 19.0, 19.3, 19.6                               |
| tuple/4/value           | control    | 19.1, 19.3, 20.5, 19.4, 19.0, 19.0, 19.6, 20.2, 19.3, 19.3                               |
| tuple/4/value           | candidate3 | 18.9, 19.1, 18.8, 20.2, 19.0, 20.8, 23.2, 19.0, 20.3, 19.7                               |
| tuple/4/values          | baseline   | 148.4, 111.7, 125.6, 131.4, 137.0, 119.2, 118.6, 111.9, 111.6, 112.0                     |
| tuple/4/values          | control    | 115.8, 118.0, 131.6, 134.2, 132.2, 122.7, 118.4, 115.4, 113.2, 111.4                     |
| tuple/4/values          | candidate3 | 117.3, 116.6, 114.7, 120.9, 204.8, 109.0, 108.7, 106.5, 107.6, 109.1                     |
| tuple/4/sequence        | baseline   | 525.5, 442.1, 454.8, 429.0, 427.6, 435.8, 476.0, 473.7, 491.9, 439.2                     |
| tuple/4/sequence        | control    | 442.5, 480.6, 420.2, 503.0, 425.2, 493.4, 497.8, 446.6, 416.1, 418.0                     |
| tuple/4/sequence        | candidate3 | 444.7, 405.8, 417.8, 397.4, 401.7, 428.0, 465.8, 429.7, 426.2, 419.0                     |
| projection/8/length     | baseline   | 5.8, 6.0, 7.1, 5.9, 5.7, 6.0, 5.8, 5.9, 5.9, 5.7                                         |
| projection/8/length     | control    | 6.1, 6.4, 6.8, 6.2, 5.8, 6.5, 6.1, 6.1, 5.7, 5.7                                         |
| projection/8/length     | candidate3 | 5.8, 6.1, 6.5, 6.2, 5.7, 6.0, 5.8, 5.8, 5.8, 5.9                                         |
| projection/8/value      | baseline   | 18.3, 17.4, 17.2, 18.5, 19.3, 17.3, 18.1, 17.5, 17.8, 17.6                               |
| projection/8/value      | control    | 18.1, 17.8, 17.6, 17.7, 21.4, 17.7, 20.4, 18.0, 17.7, 18.6                               |
| projection/8/value      | candidate3 | 18.7, 18.4, 17.8, 18.2, 19.8, 18.7, 18.2, 18.2, 18.1, 17.8                               |
| projection/8/values     | baseline   | 216.5, 106.4, 125.3, 111.8, 108.7, 103.9, 102.2, 102.7, 100.2, 110.7                     |
| projection/8/values     | control    | 122.2, 113.9, 111.7, 100.9, 107.8, 109.9, 126.9, 101.9, 102.5, 100.1                     |
| projection/8/values     | candidate3 | 115.9, 104.7, 108.1, 104.7, 108.1, 102.6, 88.8, 88.3, 92.9, 94.0                         |
| projection/8/sequence   | baseline   | 249.4, 328.9, 224.0, 222.3, 219.2, 212.4, 265.7, 246.5, 255.6, 267.8                     |
| projection/8/sequence   | control    | 247.6, 233.7, 241.3, 216.6, 215.1, 215.1, 239.4, 250.1, 275.4, 257.3                     |
| projection/8/sequence   | candidate3 | 271.7, 206.5, 209.8, 211.2, 275.0, 207.5, 239.5, 247.3, 241.9, 244.5                     |
| tuple/8/length          | baseline   | 7.3, 6.5, 5.8, 5.9, 5.7, 6.8, 5.8, 5.9, 5.7, 6.0                                         |
| tuple/8/length          | control    | 7.3, 5.9, 6.2, 6.1, 6.0, 5.9, 6.1, 5.8, 5.8, 5.9                                         |
| tuple/8/length          | candidate3 | 6.6, 6.4, 6.3, 6.0, 5.9, 6.5, 6.0, 5.8, 5.7, 5.9                                         |
| tuple/8/value           | baseline   | 20.3, 20.8, 20.7, 21.0, 20.3, 20.9, 20.4, 20.4, 20.4, 20.3                               |
| tuple/8/value           | control    | 20.5, 20.8, 22.7, 21.4, 23.2, 21.0, 20.8, 20.9, 24.3, 22.0                               |
| tuple/8/value           | candidate3 | 20.6, 20.2, 20.5, 24.1, 20.4, 20.3, 20.5, 20.6, 20.4, 22.0                               |
| tuple/8/values          | baseline   | 208.9, 157.0, 136.7, 140.2, 138.0, 138.5, 174.1, 138.1, 137.5, 139.4                     |
| tuple/8/values          | control    | 158.7, 138.0, 144.7, 150.4, 139.7, 138.9, 156.4, 138.2, 149.9, 134.4                     |
| tuple/8/values          | candidate3 | 193.0, 133.8, 130.8, 133.9, 129.7, 134.1, 124.5, 122.0, 124.8, 131.3                     |
| tuple/8/sequence        | baseline   | 581.0, 613.8, 578.3, 578.3, 559.4, 566.1, 552.2, 579.3, 588.5, 576.6                     |
| tuple/8/sequence        | control    | 596.1, 572.6, 572.5, 554.5, 559.0, 582.0, 595.5, 594.2, 543.9, 541.2                     |
| tuple/8/sequence        | candidate3 | 634.8, 588.6, 572.0, 533.2, 543.1, 544.2, 513.8, 515.0, 514.8, 588.9                     |
| projection/100/length   | baseline   | 6.1, 6.0, 6.1, 6.5, 5.7, 6.0, 6.4, 6.4, 6.0, 6.1                                         |
| projection/100/length   | control    | 5.9, 6.7, 5.9, 6.2, 6.1, 6.2, 7.1, 6.1, 6.1, 6.3                                         |
| projection/100/length   | candidate3 | 6.0, 5.8, 6.7, 6.1, 5.7, 5.9, 6.6, 5.9, 6.0, 5.9                                         |
| projection/100/value    | baseline   | 24.7, 18.5, 20.5, 18.3, 20.3, 18.9, 19.4, 18.2, 18.2, 18.3                               |
| projection/100/value    | control    | 21.1, 21.1, 19.0, 19.2, 18.9, 19.3, 22.4, 19.7, 19.1, 19.4                               |
| projection/100/value    | candidate3 | 18.3, 17.6, 17.7, 18.5, 17.7, 17.7, 18.7, 18.5, 17.9, 18.0                               |
| projection/100/values   | baseline   | 189.8, 178.9, 184.2, 162.7, 160.2, 221.2, 151.2, 151.6, 165.3, 180.7                     |
| projection/100/values   | control    | 194.9, 155.1, 180.0, 181.5, 161.8, 164.2, 155.1, 151.1, 149.6, 154.0                     |
| projection/100/values   | candidate3 | 177.6, 141.3, 165.8, 176.2, 155.0, 140.3, 142.1, 163.8, 146.8, 143.0                     |
| projection/100/sequence | baseline   | 308.5, 323.3, 298.1, 291.3, 293.4, 432.6, 315.0, 311.1, 276.2, 276.0                     |
| projection/100/sequence | control    | 344.5, 371.2, 285.9, 279.1, 280.6, 323.7, 363.9, 302.3, 285.7, 280.2                     |
| projection/100/sequence | candidate3 | 433.1, 317.6, 286.2, 293.8, 317.9, 324.5, 289.9, 313.3, 294.5, 323.5                     |
| tuple/100/length        | baseline   | 6.0, 5.8, 5.7, 6.3, 6.7, 6.6, 6.2, 6.0, 5.9, 5.8                                         |
| tuple/100/length        | control    | 5.8, 6.0, 5.7, 6.9, 6.3, 6.7, 5.9, 5.8, 5.9, 6.0                                         |
| tuple/100/length        | candidate3 | 6.2, 6.0, 5.9, 6.9, 6.9, 6.5, 5.9, 6.1, 6.0, 5.9                                         |
| tuple/100/value         | baseline   | 21.1, 21.1, 21.1, 22.5, 21.1, 21.0, 21.1, 21.4, 22.1, 22.0                               |
| tuple/100/value         | control    | 21.9, 22.9, 21.5, 22.1, 25.8, 21.7, 22.4, 22.0, 21.8, 25.6                               |
| tuple/100/value         | candidate3 | 23.0, 23.2, 23.1, 26.1, 24.0, 23.6, 23.9, 23.7, 26.0, 25.6                               |
| tuple/100/values        | baseline   | 808.2, 844.5, 864.6, 838.7, 834.0, 725.8, 723.2, 816.9, 799.8, 724.8                     |
| tuple/100/values        | control    | 732.4, 867.3, 820.3, 751.5, 720.3, 728.3, 817.6, 773.3, 785.7, 862.3                     |
| tuple/100/values        | candidate3 | 769.2, 786.0, 804.5, 711.9, 709.2, 823.2, 806.3, 723.3, 781.9, 723.3                     |
| tuple/100/sequence      | baseline   | 5,340.0, 4,927.3, 5,002.6, 5,147.0, 4,794.5, 4,734.1, 4,936.4, 4,734.5, 4,973.9, 4,778.2 |
| tuple/100/sequence      | control    | 4,950.7, 4,866.7, 5,620.9, 4,787.4, 4,805.2, 4,679.4, 4,661.6, 5,656.9, 4,748.2, 4,657.7 |
| tuple/100/sequence      | candidate3 | 4,781.8, 5,394.2, 4,977.5, 5,061.2, 4,728.7, 4,949.8, 4,767.4, 4,666.0, 5,262.1, 4,719.3 |

### Two-field scalar recheck

| Case              | Variant    | Observations (ns)                                          |
| ----------------- | ---------- | ---------------------------------------------------------- |
| projection/length | baseline   | 7.8, 6.0, 6.0, 6.4, 6.3, 5.9, 6.1, 7.0, 6.0, 5.9           |
| projection/length | control    | 6.6, 5.9, 6.2, 5.8, 6.1, 5.9, 5.9, 6.5, 5.9, 6.0           |
| projection/length | candidate2 | 6.4, 6.1, 6.1, 5.9, 6.1, 6.9, 6.1, 6.2, 6.1, 6.3           |
| projection/length | candidate3 | 6.7, 6.0, 6.1, 6.3, 6.0, 6.0, 6.0, 7.3, 6.1, 6.0           |
| projection/value  | baseline   | 17.6, 17.5, 17.3, 17.4, 17.8, 18.4, 17.6, 18.1, 17.3, 17.4 |
| projection/value  | control    | 17.5, 17.9, 17.2, 17.2, 19.2, 17.9, 18.8, 17.3, 17.4, 17.1 |
| projection/value  | candidate2 | 17.5, 20.5, 17.7, 17.6, 17.7, 17.6, 17.9, 19.1, 17.5, 19.3 |
| projection/value  | candidate3 | 17.5, 17.5, 17.4, 17.8, 18.5, 17.6, 17.5, 18.0, 18.7, 18.7 |
| tuple/length      | baseline   | 5.9, 12.1, 5.9, 5.9, 5.9, 5.8, 5.8, 5.8, 6.6, 5.8          |
| tuple/length      | control    | 5.9, 5.9, 5.8, 6.6, 6.1, 6.2, 5.9, 5.8, 5.9, 5.9           |
| tuple/length      | candidate2 | 5.9, 6.3, 6.0, 6.3, 6.0, 18.1, 6.1, 6.2, 6.1, 6.6          |
| tuple/length      | candidate3 | 5.9, 8.4, 5.9, 5.9, 5.9, 9.5, 6.0, 11.3, 5.9, 6.3          |
| tuple/value       | baseline   | 19.5, 19.3, 19.3, 20.9, 20.1, 19.2, 19.4, 19.4, 19.3, 20.3 |
| tuple/value       | control    | 20.1, 19.1, 19.1, 19.3, 19.5, 19.3, 19.1, 19.3, 19.4, 20.8 |
| tuple/value       | candidate2 | 20.6, 18.5, 18.9, 21.4, 18.8, 20.1, 18.9, 19.1, 19.1, 25.2 |
| tuple/value       | candidate3 | 20.1, 18.7, 18.7, 18.5, 18.6, 19.6, 18.8, 20.8, 19.9, 19.9 |

### 100-field scalar recheck

| Case              | Variant    | Observations (ns)                                          |
| ----------------- | ---------- | ---------------------------------------------------------- |
| projection/length | baseline   | 6.5, 5.8, 5.8, 5.8, 5.8, 6.1, 5.8, 5.8, 6.5, 5.8           |
| projection/length | control    | 6.3, 5.9, 5.8, 5.8, 6.0, 6.8, 5.9, 5.8, 6.0, 5.9           |
| projection/length | candidate2 | 6.3, 6.0, 5.9, 5.9, 5.9, 7.6, 6.3, 5.9, 6.1, 5.9           |
| projection/length | candidate3 | 6.0, 5.9, 5.8, 5.9, 6.4, 6.4, 5.8, 5.9, 5.8, 5.8           |
| projection/value  | baseline   | 18.0, 20.2, 18.1, 21.9, 18.1, 18.2, 17.9, 19.5, 18.2, 18.4 |
| projection/value  | control    | 17.1, 17.5, 17.4, 17.3, 17.2, 18.3, 17.4, 17.5, 18.1, 17.5 |
| projection/value  | candidate2 | 18.5, 18.0, 18.0, 19.5, 18.1, 25.4, 19.3, 18.8, 20.0, 17.9 |
| projection/value  | candidate3 | 18.4, 18.0, 18.0, 18.2, 18.2, 19.3, 17.9, 18.0, 18.2, 18.1 |
| tuple/length      | baseline   | 6.2, 5.8, 5.9, 5.9, 5.9, 5.9, 5.9, 7.0, 6.3, 5.8           |
| tuple/length      | control    | 5.9, 5.9, 6.9, 6.2, 5.9, 5.8, 15.9, 6.5, 5.9, 6.0          |
| tuple/length      | candidate2 | 6.2, 6.0, 6.3, 7.3, 6.0, 6.0, 6.0, 9.1, 6.2, 6.1           |
| tuple/length      | candidate3 | 6.0, 5.8, 5.9, 5.9, 5.8, 5.9, 6.0, 6.1, 5.9, 5.9           |
| tuple/value       | baseline   | 24.7, 21.8, 21.7, 22.1, 25.0, 21.8, 22.1, 22.1, 23.9, 21.9 |
| tuple/value       | control    | 24.1, 22.3, 22.4, 21.6, 21.5, 22.0, 22.8, 22.0, 22.3, 22.1 |
| tuple/value       | candidate2 | 22.6, 21.5, 22.5, 23.2, 22.0, 21.5, 23.1, 22.5, 21.8, 22.4 |
| tuple/value       | candidate3 | 22.5, 22.3, 22.1, 22.2, 23.5, 22.2, 23.1, 22.3, 22.7, 22.2 |

### Range reads

| Case                  | Variant    | Observations (ns)                                                    |
| --------------------- | ---------- | -------------------------------------------------------------------- |
| 15000/values.head     | baseline   | 292.9, 272.4, 216.2, 225.6, 211.3, 225.7, 226.6, 255.5, 219.3, 232.7 |
| 15000/values.head     | control    | 222.4, 220.5, 220.1, 210.2, 207.8, 222.6, 257.0, 208.6, 228.9, 209.5 |
| 15000/values.head     | candidate3 | 299.3, 256.4, 232.2, 270.5, 204.9, 221.5, 239.5, 206.5, 211.4, 225.6 |
| 1000/values.sameIndex | baseline   | 405.0, 232.7, 233.6, 283.5, 238.7, 226.6, 232.7, 290.3, 262.1, 256.9 |
| 1000/values.sameIndex | control    | 212.4, 203.7, 223.3, 231.9, 220.9, 207.5, 213.0, 235.5, 226.8, 268.4 |
| 1000/values.sameIndex | candidate3 | 232.0, 203.3, 210.8, 225.5, 201.4, 210.1, 229.7, 217.4, 213.8, 273.8 |

## Live-allocation observations

Three complete runs. Every row is a separate fresh Wasm instance with no peer.
Native and heap values are the measured per-instance deltas in bytes; reserved
Wasm capacity is MiB for the complete sample, not per instance.

| Variant    | Run | Instances | Shape     | Native B/instance | JS heap B/instance | Wasm capacity MiB |
| ---------- | --: | --------: | --------- | ----------------: | -----------------: | ----------------: |
| baseline   |   1 |      1000 | empty     |             660.1 |              629.8 |             1.000 |
| baseline   |   1 |      1000 | single    |             764.1 |              491.7 |             1.000 |
| baseline   |   1 |      1000 | sequence8 |             764.1 |              408.4 |             1.000 |
| baseline   |   1 |      1000 | tuple8    |           1,452.7 |              442.6 |             1.500 |
| baseline   |   1 |      1000 | edited8   |           3,659.8 |            1,137.1 |             3.875 |
| baseline   |   1 |     10000 | empty     |             662.6 |              244.8 |             6.750 |
| baseline   |   1 |     10000 | single    |             766.6 |              441.9 |             8.125 |
| baseline   |   1 |     10000 | sequence8 |             766.6 |              419.8 |             8.125 |
| baseline   |   1 |     10000 | tuple8    |           1,454.6 |              424.7 |            14.125 |
| baseline   |   1 |     10000 | edited8   |           3,662.1 |            1,121.6 |            35.438 |
| baseline   |   2 |      1000 | empty     |             660.1 |              201.2 |             1.000 |
| baseline   |   2 |      1000 | single    |             764.1 |              446.4 |             1.000 |
| baseline   |   2 |      1000 | sequence8 |             764.1 |              430.2 |             1.000 |
| baseline   |   2 |      1000 | tuple8    |           1,452.7 |              430.2 |             1.500 |
| baseline   |   2 |      1000 | edited8   |           3,659.8 |            1,136.9 |             3.875 |
| baseline   |   2 |     10000 | empty     |             662.6 |              241.1 |             6.750 |
| baseline   |   2 |     10000 | single    |             766.6 |              445.6 |             8.125 |
| baseline   |   2 |     10000 | sequence8 |             766.6 |              419.7 |             8.125 |
| baseline   |   2 |     10000 | tuple8    |           1,454.6 |              421.6 |            14.125 |
| baseline   |   2 |     10000 | edited8   |           3,662.1 |            1,124.0 |            35.438 |
| baseline   |   3 |      1000 | empty     |             660.1 |              201.0 |             1.000 |
| baseline   |   3 |      1000 | single    |             764.1 |              460.0 |             1.000 |
| baseline   |   3 |      1000 | sequence8 |             764.1 |              428.6 |             1.000 |
| baseline   |   3 |      1000 | tuple8    |           1,452.7 |              420.3 |             1.500 |
| baseline   |   3 |      1000 | edited8   |           3,659.8 |            1,134.1 |             3.875 |
| baseline   |   3 |     10000 | empty     |             662.6 |              241.1 |             6.750 |
| baseline   |   3 |     10000 | single    |             766.6 |              445.9 |             8.125 |
| baseline   |   3 |     10000 | sequence8 |             766.6 |              419.7 |             8.125 |
| baseline   |   3 |     10000 | tuple8    |           1,454.6 |              421.5 |            14.125 |
| baseline   |   3 |     10000 | edited8   |           3,662.1 |            1,124.2 |            35.438 |
| candidate1 |   1 |      1000 | empty     |             308.1 |              629.7 |             1.000 |
| candidate1 |   1 |      1000 | single    |             588.1 |              483.7 |             1.000 |
| candidate1 |   1 |      1000 | sequence8 |             588.1 |              408.4 |             1.000 |
| candidate1 |   1 |      1000 | tuple8    |           1,452.7 |              442.6 |             1.500 |
| candidate1 |   1 |      1000 | edited8   |           3,657.0 |            1,136.8 |             3.875 |
| candidate1 |   1 |     10000 | empty     |             310.6 |              244.2 |             3.188 |
| candidate1 |   1 |     10000 | single    |             590.6 |              441.9 |             6.750 |
| candidate1 |   1 |     10000 | sequence8 |             590.6 |              421.3 |             6.750 |
| candidate1 |   1 |     10000 | tuple8    |           1,454.6 |              422.3 |            14.125 |
| candidate1 |   1 |     10000 | edited8   |           3,659.1 |            1,121.7 |            42.563 |
| candidate1 |   2 |      1000 | empty     |             308.1 |              201.2 |             1.000 |
| candidate1 |   2 |      1000 | single    |             588.1 |              446.4 |             1.000 |
| candidate1 |   2 |      1000 | sequence8 |             588.1 |              430.2 |             1.000 |
| candidate1 |   2 |      1000 | tuple8    |           1,452.7 |              430.4 |             1.500 |
| candidate1 |   2 |      1000 | edited8   |           3,657.0 |            1,136.7 |             3.875 |
| candidate1 |   2 |     10000 | empty     |             310.6 |              241.1 |             3.188 |
| candidate1 |   2 |     10000 | single    |             590.6 |              445.6 |             6.750 |
| candidate1 |   2 |     10000 | sequence8 |             590.6 |              418.3 |             6.750 |
| candidate1 |   2 |     10000 | tuple8    |           1,454.6 |              421.6 |            14.125 |
| candidate1 |   2 |     10000 | edited8   |           3,659.1 |            1,124.0 |            42.563 |
| candidate1 |   3 |      1000 | empty     |             308.1 |              201.0 |             1.000 |
| candidate1 |   3 |      1000 | single    |             588.1 |              460.0 |             1.000 |
| candidate1 |   3 |      1000 | sequence8 |             588.1 |              428.6 |             1.000 |
| candidate1 |   3 |      1000 | tuple8    |           1,452.7 |              420.3 |             1.500 |
| candidate1 |   3 |      1000 | edited8   |           3,657.0 |            1,134.1 |             3.875 |
| candidate1 |   3 |     10000 | empty     |             310.6 |              241.1 |             3.188 |
| candidate1 |   3 |     10000 | single    |             590.6 |              445.9 |             6.750 |
| candidate1 |   3 |     10000 | sequence8 |             590.6 |              419.7 |             6.750 |
| candidate1 |   3 |     10000 | tuple8    |           1,454.6 |              421.5 |            14.125 |
| candidate1 |   3 |     10000 | edited8   |           3,659.1 |            1,124.2 |            42.563 |
| candidate2 |   1 |      1000 | empty     |             276.1 |              629.7 |             1.000 |
| candidate2 |   1 |      1000 | single    |             556.1 |              483.4 |             1.000 |
| candidate2 |   1 |      1000 | sequence8 |             556.1 |              412.4 |             1.000 |
| candidate2 |   1 |      1000 | tuple8    |           1,420.7 |              440.9 |             1.500 |
| candidate2 |   1 |      1000 | edited8   |           3,592.4 |            1,137.1 |             3.875 |
| candidate2 |   1 |     10000 | empty     |             278.6 |              244.8 |             3.188 |
| candidate2 |   1 |     10000 | single    |             558.6 |              442.7 |             5.625 |
| candidate2 |   1 |     10000 | sequence8 |             558.6 |              433.0 |             5.625 |
| candidate2 |   1 |     10000 | tuple8    |           1,422.6 |              423.4 |            14.125 |
| candidate2 |   1 |     10000 | edited8   |           3,593.8 |            1,122.2 |            35.438 |
| candidate2 |   2 |      1000 | empty     |             276.1 |              206.6 |             1.000 |
| candidate2 |   2 |      1000 | single    |             556.1 |              446.4 |             1.000 |
| candidate2 |   2 |      1000 | sequence8 |             556.1 |              430.2 |             1.000 |
| candidate2 |   2 |      1000 | tuple8    |           1,420.7 |              430.3 |             1.500 |
| candidate2 |   2 |      1000 | edited8   |           3,592.4 |            1,136.8 |             3.875 |
| candidate2 |   2 |     10000 | empty     |             278.6 |              241.1 |             3.188 |
| candidate2 |   2 |     10000 | single    |             558.6 |              445.6 |             5.625 |
| candidate2 |   2 |     10000 | sequence8 |             558.6 |              417.6 |             5.625 |
| candidate2 |   2 |     10000 | tuple8    |           1,422.6 |              421.6 |            14.125 |
| candidate2 |   2 |     10000 | edited8   |           3,593.8 |            1,124.0 |            35.438 |
| candidate2 |   3 |      1000 | empty     |             276.1 |              201.0 |             1.000 |
| candidate2 |   3 |      1000 | single    |             556.1 |              460.0 |             1.000 |
| candidate2 |   3 |      1000 | sequence8 |             556.1 |              681.2 |             1.000 |
| candidate2 |   3 |      1000 | tuple8    |           1,420.7 |              420.3 |             1.500 |
| candidate2 |   3 |      1000 | edited8   |           3,592.4 |            1,134.1 |             3.875 |
| candidate2 |   3 |     10000 | empty     |             278.6 |              241.1 |             3.188 |
| candidate2 |   3 |     10000 | single    |             558.6 |              445.9 |             5.625 |
| candidate2 |   3 |     10000 | sequence8 |             558.6 |              419.7 |             5.625 |
| candidate2 |   3 |     10000 | tuple8    |           1,422.6 |              421.6 |            14.125 |
| candidate2 |   3 |     10000 | edited8   |           3,593.8 |            1,124.2 |            35.438 |
| candidate3 |   1 |      1000 | empty     |             276.1 |              629.7 |             1.000 |
| candidate3 |   1 |      1000 | single    |             556.1 |              484.9 |             1.000 |
| candidate3 |   1 |      1000 | sequence8 |             556.1 |              408.3 |             1.000 |
| candidate3 |   1 |      1000 | tuple8    |           1,404.7 |              442.6 |             1.500 |
| candidate3 |   1 |      1000 | edited8   |           3,592.4 |            1,137.1 |             3.875 |
| candidate3 |   1 |     10000 | empty     |             278.6 |              244.8 |             3.188 |
| candidate3 |   1 |     10000 | single    |             558.6 |              442.6 |             5.625 |
| candidate3 |   1 |     10000 | sequence8 |             558.6 |              417.7 |             5.625 |
| candidate3 |   1 |     10000 | tuple8    |           1,406.6 |              413.6 |            14.125 |
| candidate3 |   1 |     10000 | edited8   |           3,593.8 |            1,122.3 |            35.438 |
| candidate3 |   2 |      1000 | empty     |             276.1 |              207.2 |             1.000 |
| candidate3 |   2 |      1000 | single    |             556.1 |              446.4 |             1.000 |
| candidate3 |   2 |      1000 | sequence8 |             556.1 |              430.2 |             1.000 |
| candidate3 |   2 |      1000 | tuple8    |           1,404.7 |              430.3 |             1.500 |
| candidate3 |   2 |      1000 | edited8   |           3,592.4 |            1,136.8 |             3.875 |
| candidate3 |   2 |     10000 | empty     |             278.6 |              241.1 |             3.188 |
| candidate3 |   2 |     10000 | single    |             558.6 |              445.6 |             5.625 |
| candidate3 |   2 |     10000 | sequence8 |             558.6 |              417.6 |             5.625 |
| candidate3 |   2 |     10000 | tuple8    |           1,406.6 |              421.6 |            14.125 |
| candidate3 |   2 |     10000 | edited8   |           3,593.8 |            1,124.0 |            35.438 |
| candidate3 |   3 |      1000 | empty     |             276.1 |              201.0 |             1.000 |
| candidate3 |   3 |      1000 | single    |             556.1 |              454.1 |             1.000 |
| candidate3 |   3 |      1000 | sequence8 |             556.1 |              430.0 |             1.000 |
| candidate3 |   3 |      1000 | tuple8    |           1,404.7 |              418.9 |             1.500 |
| candidate3 |   3 |      1000 | edited8   |           3,592.4 |            1,134.1 |             3.875 |
| candidate3 |   3 |     10000 | empty     |             278.6 |              241.1 |             3.188 |
| candidate3 |   3 |     10000 | single    |             558.6 |              445.9 |             5.625 |
| candidate3 |   3 |     10000 | sequence8 |             558.6 |              419.7 |             5.625 |
| candidate3 |   3 |     10000 | tuple8    |           1,406.6 |              421.6 |            14.125 |
| candidate3 |   3 |     10000 | edited8   |           3,593.8 |            1,124.2 |            35.438 |
| candidate4 |   1 |      1000 | empty     |             277.1 |              629.7 |             1.000 |
| candidate4 |   1 |      1000 | single    |             566.1 |              491.4 |             1.000 |
| candidate4 |   1 |      1000 | sequence8 |             566.1 |              408.3 |             1.000 |
| candidate4 |   1 |      1000 | tuple8    |           1,432.8 |              442.6 |             1.813 |
| candidate4 |   1 |      1000 | edited8   |           3,604.6 |            1,142.5 |             3.875 |
| candidate4 |   1 |     10000 | empty     |             279.5 |              244.2 |             3.188 |
| candidate4 |   1 |     10000 | single    |             568.5 |              442.6 |             5.625 |
| candidate4 |   1 |     10000 | sequence8 |             568.5 |              419.8 |             5.625 |
| candidate4 |   1 |     10000 | tuple8    |           1,434.6 |              423.7 |            17.000 |
| candidate4 |   1 |     10000 | edited8   |           3,606.6 |            1,122.3 |            35.438 |
| candidate4 |   2 |      1000 | empty     |             277.1 |              207.2 |             1.000 |
| candidate4 |   2 |      1000 | single    |             566.1 |              446.4 |             1.000 |
| candidate4 |   2 |      1000 | sequence8 |             566.1 |              430.2 |             1.000 |
| candidate4 |   2 |      1000 | tuple8    |           1,432.8 |              430.3 |             1.813 |
| candidate4 |   2 |      1000 | edited8   |           3,604.6 |            1,136.8 |             3.875 |
| candidate4 |   2 |     10000 | empty     |             279.5 |              241.1 |             3.188 |
| candidate4 |   2 |     10000 | single    |             568.5 |              445.6 |             5.625 |
| candidate4 |   2 |     10000 | sequence8 |             568.5 |              417.6 |             5.625 |
| candidate4 |   2 |     10000 | tuple8    |           1,434.6 |              421.6 |            17.000 |
| candidate4 |   2 |     10000 | edited8   |           3,606.6 |            1,124.0 |            35.438 |
| candidate4 |   3 |      1000 | empty     |             277.1 |              201.0 |             1.000 |
| candidate4 |   3 |      1000 | single    |             566.1 |              460.0 |             1.000 |
| candidate4 |   3 |      1000 | sequence8 |             566.1 |              430.0 |             1.000 |
| candidate4 |   3 |      1000 | tuple8    |           1,432.8 |              418.9 |             1.813 |
| candidate4 |   3 |      1000 | edited8   |           3,604.6 |            1,134.1 |             3.875 |
| candidate4 |   3 |     10000 | empty     |             279.5 |              241.1 |             3.188 |
| candidate4 |   3 |     10000 | single    |             568.5 |              445.9 |             5.625 |
| candidate4 |   3 |     10000 | sequence8 |             568.5 |              419.7 |             5.625 |
| candidate4 |   3 |     10000 | tuple8    |           1,434.6 |              421.6 |            17.000 |
| candidate4 |   3 |     10000 | edited8   |           3,606.6 |            1,124.2 |            35.438 |

`candidate4` is the rejected emmalloc build; it is not part of the final source.
