# `__create` Footage copy paths

## Target

- Date: 2026-08-03
- Operation: `__create`
- Workload: hydrate Sequencer's retained Reel and Diamond Types' retained bytes
  after appending 100 through 1,000,000 string Frames.
- Comparator: `diamond-types-node` 1.0.2 `Doc.fromBytes()` with the same lengths,
  warm-up policy, sample counts, process, and timer.
- Samples by length: 256, 128, 64, 16, and 16. The noisy allocation workload
  uses five independent serial process runs for the baseline and final result.

## Hypotheses

The benchmark Reel has one visible Strip through 10,000 Frames, ten Strips at
100,000 Frames, and one hundred Strips at 1,000,000 Frames. The original path
grew `Replica.footage` with `push(...footage)` for every Strip.

1. Preallocating the complete Footage address space should remove repeated
   growth and argument spreading from large snapshots.
2. Preallocation has avoidable fixed cost for small snapshots, so the small
   single-pass path should remain separate.
3. A valid single-Strip snapshot can use `slice()` to clone its Footage in one
   native array operation while preserving independent ownership.

## Baseline raw results

Values are per-call median microseconds with the within-run standard deviation
in parentheses, written as `median (SD)`.

|    Length | Sequencer runs                                                                                                | Diamond Types runs                                                                            |
| --------: | ------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------- |
|       100 | 9.70 (8.69); 8.00 (4.72); 8.60 (4.66); 7.80 (4.37); 8.50 (4.46)                                               | 15.75 (6.76); 15.50 (11.94); 20.70 (10.91); 14.35 (15.49); 17.90 (12.73)                      |
|     1,000 | 23.45 (149.99); 15.50 (121.09); 15.30 (104.01); 15.90 (106.99); 17.70 (144.54)                                | 24.25 (23.14); 23.45 (12.32); 26.10 (53.38); 25.75 (56.93); 23.75 (36.24)                     |
|    10,000 | 116.05 (799.49); 133.50 (612.67); 164.40 (659.64); 108.95 (405.79); 168.30 (468.62)                           | 32.30 (44.46); 47.10 (47.79); 78.05 (81.58); 48.15 (29.61); 52.95 (32.92)                     |
|   100,000 | 2,040.70 (1,019.25); 1,497.00 (1,394.71); 1,791.50 (1,048.75); 1,526.45 (997.26); 1,675.20 (1,013.61)         | 135.90 (7.62); 236.00 (11.79); 150.10 (9.49); 125.70 (11.07); 132.95 (17.94)                  |
| 1,000,000 | 24,788.45 (12,732.57); 26,480.90 (7,002.54); 20,211.00 (3,568.43); 23,111.25 (5,208.87); 22,796.80 (4,603.56) | 1,343.25 (219.80); 1,450.40 (321.77); 1,343.55 (333.70); 2,294.70 (568.93); 1,521.80 (450.08) |

## Attempts

### 1. Preallocate every non-empty Snapshot

The first candidate validated the Reel into a Strip list, allocated Footage
once, and copied values with indexed assignments. Three process medians by
length were:

|    Length | Candidate process medians, µs |
| --------: | ----------------------------- |
|       100 | 9.05; 10.65; 12.50            |
|     1,000 | 22.55; 26.90; 15.25           |
|    10,000 | 91.30; 130.35; 136.45         |
|   100,000 | 839.20; 641.95; 785.95        |
| 1,000,000 | 4,861.05; 5,068.05; 5,005.05  |

Decision: reject as a universal path. The large gains were clear, but indexed
copying added fixed cost to the 100 and 1,000 Frame cases.

### 2. Inline size-gated preallocation

A 100,000 Frame cutoff restored `push` below the cutoff. Five process medians
were 8.20/8.40/8.40/8.30/8.70 µs at 100 Frames,
20.70/16.40/22.30/13.90/17.25 µs at 1,000,
129.50/159.75/145.10/115.30/156.75 µs at 10,000,
863.95/568.35/535.65/717.50/829.45 µs at 100,000, and
5,514.75/10,001.70/6,211.25/4,886.10/4,890.05 µs at 1,000,000.

Decision: reject the inline structure. It duplicated substantial domain logic
inside `__create`, enlarged the hot function, and the small results remained
noisy.

### 3. Separate large-Snapshot unit

Large hydration moved to `create/hydrate_large_snapshot`, selected for at least
ten supplied Strips or one Strip spanning at least 100,000 Frames. The small
path returned to its original single pass. Five process medians were
8.00/7.80/9.45/8.50/9.40 µs at 100 Frames,
19.00/18.75/18.20/19.80/14.55 µs at 1,000,
122.60/124.30/89.20/103.50/96.50 µs at 10,000,
583.80/536.40/1,054.65/766.00/823.00 µs at 100,000, and
5,898.75/5,184.05/6,302.70/5,377.55/5,625.45 µs at 1,000,000.

Decision: retain the architectural separation, then optimize the remaining
single-Strip copy independently.

### 4. Single-Strip `slice()` fast path

A valid one-Strip snapshot now clones supplied Footage with `slice()`. Missing
released Footage allocates the required stable holes, and pending state retains
an empty Footage array when appropriate. Invalid input still yields an empty
Replica.

## Final candidate raw results

|    Length | Sequencer runs                                                                                          | Diamond Types runs                                                                            |
| --------: | ------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------- |
|       100 | 7.70 (47.96); 8.10 (6.00); 9.20 (63.49); 7.45 (45.58); 8.75 (56.28)                                     | 22.00 (11.93); 16.75 (9.15); 20.45 (13.13); 17.05 (11.23); 19.05 (20.73)                      |
|     1,000 | 15.15 (7.95); 12.60 (6.52); 10.10 (5.86); 9.70 (6.08); 9.50 (4.95)                                      | 25.95 (88.66); 16.20 (54.93); 15.85 (20.85); 22.40 (45.37); 14.90 (74.18)                     |
|    10,000 | 63.70 (501.22); 64.65 (544.22); 67.45 (522.68); 74.65 (598.42); 54.70 (564.59)                          | 63.85 (43.93); 42.65 (19.50); 70.50 (15.88); 42.10 (97.70); 39.55 (68.89)                     |
|   100,000 | 457.70 (557.79); 722.25 (545.99); 648.10 (534.82); 886.20 (7,853.02); 824.65 (507.06)                   | 138.75 (16.51); 126.55 (22.22); 126.95 (7.55); 282.85 (14.14); 136.55 (22.43)                 |
| 1,000,000 | 6,434.30 (6,098.35); 5,307.00 (3,704.80); 6,436.25 (5,266.69); 6,176.90 (6,589.69); 5,093.20 (3,737.80) | 1,316.75 (366.32); 1,341.50 (563.65); 1,340.70 (291.98); 1,342.05 (483.73); 1,327.60 (721.63) |

## Median comparison

The table uses the median of the five process medians.

|    Length | Baseline Sequencer µs | Candidate Sequencer µs | Improvement | Candidate comparison       |
| --------: | --------------------: | ---------------------: | ----------: | -------------------------- |
|       100 |                  8.50 |                   8.10 |        4.7% | Sequencer 2.35x faster     |
|     1,000 |                 15.90 |                  10.10 |       36.5% | Sequencer 1.60x faster     |
|    10,000 |                133.50 |                  64.65 |       51.6% | Diamond Types 1.52x faster |
|   100,000 |              1,675.20 |                 722.25 |       56.9% | Diamond Types 5.29x faster |
| 1,000,000 |             23,111.25 |               6,176.90 |       73.3% | Diamond Types 4.61x faster |

Allocation and collection make the within-process standard deviations noisy,
especially because the benchmark intentionally retains created Sequencer
Replicas through each task. Five independent process medians therefore drive
the decision. The large-case improvement is much wider than that noise.

## Artifact impact

The baseline includes the retained `__recover` and `__acknowledge` changes.

| Artifact                 | Baseline bytes | Candidate bytes |  Delta |
| ------------------------ | -------------: | --------------: | -----: |
| Raw Wasm                 |         35,673 |          35,673 |      0 |
| ESM raw                  |         90,690 |          93,039 | +2,349 |
| ESM gzip                 |         27,136 |          27,432 |   +296 |
| ESM minified + gzip      |         18,944 |          19,153 |   +209 |
| CommonJS raw             |         90,986 |          93,335 | +2,349 |
| CommonJS gzip            |         27,243 |          27,542 |   +299 |
| CommonJS minified + gzip |         19,269 |          19,512 |   +243 |

## Correctness and decision

- `npm run build`: passed for each retained candidate.
- `npm run test:unit`: 20 tests passed across four files after the final code.
- Added coverage that mutating input Snapshot Footage after `__create` cannot
  mutate the created Replica, including the ten-Strip preallocated path.
- Added large-path malformed and pending Snapshot coverage.

Decision: retain the separate preallocated large path and single-Strip clone.
The final candidate improves every measured length, closes the largest
Sequencer gaps substantially, preserves value ownership, and adds 209 bytes to
the minified+gzip ESM artifact. Full repository tests and the complete benchmark
matrix remain part of final combined verification.
