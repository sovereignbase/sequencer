# empty-warm: production throughput control

Five matched rounds, baseline, identical baseline control and candidate. This
focused public-API diagnostic reads and recreates empty acknowledged snapshots
in ordinary and fixed-length tuple mode. Each case warms for 10,000 calls and
measures 100,000 calls in one timed loop. Creation includes destruction; sequence
and values reuse the populated fixture. Explicit JS process garbage collection
occurs before timing. This does not replace the lifecycle's single-call checkpoint
measurements. Build order rotates and reverses; every sample remains visible.

Times are median ns/call. Each IQR is the third minus first quartile. Paired changes compare matching seeds; negative means faster. No length case is selected in this subset.

## baseline → control

| Method                  |  Before |   IQR |   After |   IQR | Change | Paired change | Paired IQR, pp | Slower in every pair |
| :---------------------- | ------: | ----: | ------: | ----: | -----: | ------------: | -------------: | :------------------- |
| empty-sequence/create   | 1053.68 | 36.92 | 1055.28 | 70.34 |  0.15% |        -1.69% |           1.38 |                      |
| empty-sequence/sequence |  561.86 | 44.79 |  533.72 |  5.74 | -5.01% |        -5.01% |          11.18 |                      |
| empty-sequence/values   |   36.19 |  9.46 |   39.36 |  5.25 |  8.75% |        -1.77% |           6.87 |                      |
| empty-tuple/create      | 1204.37 | 59.63 | 1119.55 | 51.82 | -7.04% |        -4.60% |           6.56 |                      |
| empty-tuple/sequence    |  545.53 | 99.74 |  511.96 | 63.88 | -6.15% |        -6.15% |           3.81 |                      |
| empty-tuple/values      |  219.25 |  1.48 |  222.74 | 17.85 |  1.59% |         1.08% |           8.36 |                      |

## baseline → text-kind

| Method                  |  Before |   IQR |   After |    IQR | Change | Paired change | Paired IQR, pp | Slower in every pair |
| :---------------------- | ------: | ----: | ------: | -----: | -----: | ------------: | -------------: | :------------------- |
| empty-sequence/create   | 1053.68 | 36.92 | 1014.23 | 134.28 | -3.74% |        -2.78% |          10.05 |                      |
| empty-sequence/sequence |  561.86 | 44.79 |  537.94 |  27.64 | -4.26% |        -0.76% |           4.40 |                      |
| empty-sequence/values   |   36.19 |  9.46 |   36.88 |  12.52 |  1.88% |         4.96% |           6.93 |                      |
| empty-tuple/create      | 1204.37 | 59.63 | 1210.70 |  52.63 |  0.53% |         3.96% |           5.78 |                      |
| empty-tuple/sequence    |  545.53 | 99.74 |  538.24 |  67.80 | -1.34% |        -5.29% |           7.23 |                      |
| empty-tuple/values      |  219.25 |  1.48 |  217.27 |  10.92 | -0.90% |         2.30% |           3.51 |                      |
