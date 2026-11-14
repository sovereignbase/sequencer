# Mixed concurrent replay: traversal directory

3 matched rounds of the same two-author insert/remove histories, 24 fresh receiving Projections per case. Build order rotates and reverses. All input, canonical snapshot and visible-value SHA-256 hashes match across builds for every pair and delivery order. No external runner or adapter is changed.

Times are median ns/apply, with IQR. Negative changes mean faster. All raw samples, including slower results, remain under `temp/optimization_2026_11_12/directory-gap-mixed-*`.

## fixed-table → directory-gap

| Edits / delivery |  Before |    IQR |   After |    IQR |  Change | Paired change | Paired IQR, pp | Slower in every pair |
| :--------------- | ------: | -----: | ------: | -----: | ------: | ------------: | -------------: | :------------------- |
| 2000/ordered     | 2568.13 | 107.34 | 1718.55 |  15.98 | -33.08% |       -32.25% |           2.61 |                      |
| 2000/reverse     | 2228.16 | 111.22 | 1640.00 |  36.49 | -26.40% |       -26.40% |           2.04 |                      |
| 2000/shuffled    | 2443.61 |  88.76 | 1841.59 | 151.00 | -24.64% |       -20.26% |           5.46 |                      |
| 6000/ordered     | 3032.31 |  26.01 | 1816.57 |  44.58 | -40.09% |       -40.88% |           1.51 |                      |
| 6000/reverse     | 2552.63 | 206.51 | 1682.43 |  66.28 | -34.09% |       -30.97% |           4.46 |                      |
| 6000/shuffled    | 3060.84 | 129.70 | 2120.99 |  15.91 | -30.71% |       -30.71% |           3.47 |                      |
