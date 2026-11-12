# Isolated-process input-reservation target

Ten outer rounds rotate/reverse the pre-cache build, a byte-identical A/A copy and the input-cache build. Every build runs in a fresh Node process. The dynamic API loop has the same function name in every build. Each process retains the same four warmups, ten measured inner rounds, public API work and complete-value checks as the contiguous-source target. Hydration, explicit JS process garbage collection, checks and destruction remain outside API timing. No trace flags are used.

Each outer observation is the median of its ten inner samples. The table compares those ten independent-process medians; it does not treat all 100 inner observations as independent. Times are ns/call. IQR is the third minus first quartile. All raw inner samples remain in `P/isolated-flat-*-pairN.json`, where `P` is `temp/optimization_2026_11_12`.

## reserve → reserve-control

| Source groups / method       |  Before |   IQR |   After |    IQR | Difference | Change | Paired change | Paired IQR, pp | Slower pairs |
| :--------------------------- | ------: | ----: | ------: | -----: | ---------: | -----: | ------------: | -------------: | -----------: |
| 100/apply.insert             |  303.02 | 34.70 |  303.00 |  14.71 |      -0.02 | -0.01% |         0.35% |           7.96 |         6/10 |
| 100/apply.remove             |  694.86 | 36.79 |  700.95 |  24.27 |       6.09 |  0.88% |         0.36% |           5.02 |         5/10 |
| 100/apply.replace            | 3326.87 | 70.60 | 3227.32 | 144.93 |     -99.54 | -2.99% |        -1.71% |           2.84 |         2/10 |
| 100/merge.insert             |  592.41 | 58.51 |  582.67 |  57.13 |      -9.74 | -1.64% |        -1.84% |           7.18 |         2/10 |
| 100/apply.duplicateInsert    |  186.01 |  6.44 |  195.12 |  13.86 |       9.12 |  4.90% |         5.26% |           7.77 |         8/10 |
| 100/apply.duplicateRemove    |  363.97 | 13.81 |  372.29 |   9.10 |       8.32 |  2.29% |         2.50% |           3.27 |         8/10 |
| 100/apply.duplicateReplace   |  503.35 | 14.83 |  498.74 |  19.29 |      -4.61 | -0.92% |        -0.45% |           4.64 |         4/10 |
| 20000/apply.insert           |  425.36 | 16.91 |  420.48 |   7.99 |      -4.89 | -1.15% |        -1.81% |           4.65 |         4/10 |
| 20000/apply.remove           | 2220.03 | 57.62 | 2160.65 |  45.10 |     -59.38 | -2.67% |        -2.16% |           3.44 |         2/10 |
| 20000/apply.replace          | 4899.11 | 99.76 | 4888.43 |  86.46 |     -10.69 | -0.22% |         0.04% |           4.30 |         5/10 |
| 20000/merge.insert           |  712.50 | 31.33 |  708.28 |  16.87 |      -4.22 | -0.59% |        -0.95% |           2.87 |         3/10 |
| 20000/apply.duplicateInsert  |  278.99 | 16.46 |  266.67 |  36.68 |     -12.31 | -4.41% |        -3.42% |           8.98 |         3/10 |
| 20000/apply.duplicateRemove  |  452.51 | 16.37 |  459.64 |  12.69 |       7.13 |  1.57% |        -0.04% |           5.95 |         5/10 |
| 20000/apply.duplicateReplace |  590.92 | 27.78 |  576.53 |  21.11 |     -14.40 | -2.44% |        -2.13% |           7.58 |         5/10 |

## reserve → input-cache

| Source groups / method       |  Before |   IQR |   After |    IQR | Difference | Change | Paired change | Paired IQR, pp | Slower pairs |
| :--------------------------- | ------: | ----: | ------: | -----: | ---------: | -----: | ------------: | -------------: | -----------: |
| 100/apply.insert             |  303.02 | 34.70 |  293.86 |   8.91 |      -9.16 | -3.02% |        -2.27% |          13.54 |         4/10 |
| 100/apply.remove             |  694.86 | 36.79 |  702.59 |  48.16 |       7.73 |  1.11% |         1.29% |           9.16 |         6/10 |
| 100/apply.replace            | 3326.87 | 70.60 | 3352.78 | 164.57 |      25.92 |  0.78% |        -0.33% |           5.67 |         4/10 |
| 100/merge.insert             |  592.41 | 58.51 |  583.81 |  49.02 |      -8.60 | -1.45% |        -1.66% |          14.45 |         5/10 |
| 100/apply.duplicateInsert    |  186.01 |  6.44 |  202.92 |  16.92 |      16.91 |  9.09% |         9.11% |          13.67 |         8/10 |
| 100/apply.duplicateRemove    |  363.97 | 13.81 |  365.91 |  16.11 |       1.94 |  0.53% |        -0.37% |           8.65 |         5/10 |
| 100/apply.duplicateReplace   |  503.35 | 14.83 |  507.36 |  20.78 |       4.02 |  0.80% |         1.68% |           7.45 |         6/10 |
| 20000/apply.insert           |  425.36 | 16.91 |  422.69 |  15.81 |      -2.68 | -0.63% |        -0.10% |           8.45 |         4/10 |
| 20000/apply.remove           | 2220.03 | 57.62 | 2191.02 |  72.47 |     -29.00 | -1.31% |        -0.06% |           6.11 |         5/10 |
| 20000/apply.replace          | 4899.11 | 99.76 | 4908.59 | 102.13 |       9.48 |  0.19% |        -0.06% |           2.35 |         4/10 |
| 20000/merge.insert           |  712.50 | 31.33 |  712.14 |  29.72 |      -0.36 | -0.05% |        -1.08% |           3.82 |         3/10 |
| 20000/apply.duplicateInsert  |  278.99 | 16.46 |  277.86 |  48.53 |      -1.13 | -0.40% |        -2.75% |          13.65 |         5/10 |
| 20000/apply.duplicateRemove  |  452.51 | 16.37 |  457.35 |  19.98 |       4.84 |  1.07% |        -1.50% |          10.15 |         4/10 |
| 20000/apply.duplicateReplace |  590.92 | 27.78 |  593.64 |  24.98 |       2.71 |  0.46% |        -0.77% |           9.19 |         5/10 |
