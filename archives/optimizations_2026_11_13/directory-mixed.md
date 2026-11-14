# Mixed concurrent replay: traversal directory

Five matched rounds of the same two-author insert/remove histories, 24 fresh receiving Projections per case. Build order rotates and reverses. All input, canonical snapshot and visible-value SHA-256 hashes match across builds for every pair and delivery order. No external runner or adapter is changed.

Times are median ns/apply, with IQR. Negative changes mean faster. All raw samples, including slower results, remain under `temp/optimization_2026_11_12/directory-mixed-control-*`.

## fixed-table → fixed-control

| Edits / delivery |  Before |    IQR |   After |    IQR | Change | Paired change | Paired IQR, pp | Slower in every pair |
| :--------------- | ------: | -----: | ------: | -----: | -----: | ------------: | -------------: | :------------------- |
| 2000/ordered     | 2612.94 | 151.64 | 2599.40 | 172.62 | -0.52% |        -0.52% |           2.71 |                      |
| 2000/reverse     | 2176.61 |  65.65 | 2266.81 | 185.84 |  4.14% |         3.16% |           5.02 |                      |
| 2000/shuffled    | 2417.65 | 148.65 | 2412.97 | 133.75 | -0.19% |        -0.94% |           3.13 |                      |
| 6000/ordered     | 3175.94 | 147.22 | 3116.79 | 231.48 | -1.86% |        -2.50% |          13.91 |                      |
| 6000/reverse     | 2782.02 | 354.56 | 2704.80 | 330.87 | -2.78% |       -13.90% |          15.43 |                      |
| 6000/shuffled    | 3114.30 |  82.05 | 3069.98 | 150.11 | -1.42% |         2.31% |           6.89 |                      |

## fixed-table → directory

| Edits / delivery |  Before |    IQR |   After |    IQR |  Change | Paired change | Paired IQR, pp | Slower in every pair |
| :--------------- | ------: | -----: | ------: | -----: | ------: | ------------: | -------------: | :------------------- |
| 2000/ordered     | 2612.94 | 151.64 | 1816.32 | 147.03 | -30.49% |       -29.56% |           8.52 |                      |
| 2000/reverse     | 2176.61 |  65.65 | 1683.51 |  84.62 | -22.65% |       -20.54% |           9.69 |                      |
| 2000/shuffled    | 2417.65 | 148.65 | 2073.97 | 315.79 | -14.22% |       -15.33% |           9.63 |                      |
| 6000/ordered     | 3175.94 | 147.22 | 1763.90 | 274.49 | -44.46% |       -42.80% |          11.50 |                      |
| 6000/reverse     | 2782.02 | 354.56 | 1704.08 |  98.25 | -38.75% |       -41.35% |          11.35 |                      |
| 6000/shuffled    | 3114.30 |  82.05 | 2189.06 |  16.04 | -29.71% |       -28.51% |           1.56 |                      |
