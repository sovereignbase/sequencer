# External benchmark context

Read 12 November 2026. These are the supplied historical results, not fresh matched measurements of this round. Workloads and adapters are unchanged. Ratios and ranks describe those files only; cross-run environment differences prevent attributing every change to Sequencer. RSS is process memory, not a direct native-allocation measurement.

- benchmarks/results.previous.json: SHA-256 `44cde66803d567053246d6b2edd8b329536ba3ad6399661a5b872243504a4668`.
- benchmarks/results.json: SHA-256 `2a76f1163073c5e3c1ae7412ff4eac49687817500ef59ff221e582e7f18ea778`.

| Group / metric                                                                  |                Previous |           Current |  Change | Best competitor                 | Current / competitor | Rank |
| ------------------------------------------------------------------------------- | ----------------------: | ----------------: | ------: | ------------------------------- | -------------------: | ---: |
| 6000 / Bundle size                                                              |            150926 bytes |      144165 bytes |  -4.48% | yjs: 77969 bytes                |                 1.85 |    2 |
| 6000 / Bundle size (gzipped)                                                    |             51622 bytes |       49959 bytes |  -3.22% | yjs: 22972 bytes                |                 2.17 |    2 |
| 6000 / [B1.1] Append N characters (time)                                        |                   60 ms |             66 ms |  10.00% | diamond-types: 113 ms           |                 0.58 |    1 |
| 6000 / [B1.1] Append N characters (avgUpdateSize)                               |                31 bytes |          31 bytes |   0.00% | yjs: 27 bytes                   |                 1.15 |    3 |
| 6000 / [B1.1] Append N characters (docSize)                                     |              6033 bytes |        6033 bytes |   0.00% | yjs: 6031 bytes                 |                 1.00 |    2 |
| 6000 / [B1.1] Append N characters (rssPerDoc)                                   | unresolved: below-noise |   29184.000 bytes |       — | ywasm: 34560.000 bytes          |                 0.84 |    1 |
| 6000 / [B1.2] Insert string of length N (time)                                  |                   17 ms |             16 ms |  -5.88% | yjs: 4 ms                       |                 4.00 |    4 |
| 6000 / [B1.2] Insert string of length N (avgUpdateSize)                         |             12025 bytes |       12025 bytes |   0.00% | yjs: 6031 bytes                 |                 1.99 |    5 |
| 6000 / [B1.2] Insert string of length N (docSize)                               |              6033 bytes |        6033 bytes |   0.00% | yjs: 6031 bytes                 |                 1.00 |    2 |
| 6000 / [B1.3] Prepend N characters (time)                                       |                   81 ms |             86 ms |   6.17% | ywasm: 108 ms                   |                 0.80 |    1 |
| 6000 / [B1.3] Prepend N characters (avgUpdateSize)                              |                31 bytes |          31 bytes |   0.00% | yjs: 27 bytes                   |                 1.15 |    3 |
| 6000 / [B1.3] Prepend N characters (docSize)                                    |             41004 bytes |       41004 bytes |   0.00% | yjs: 6041 bytes                 |                 6.79 |    5 |
| 6000 / [B1.3] Prepend N characters (rssPerDoc)                                  |       1062912.000 bytes | 1050624.000 bytes |  -1.16% | loro: 199424.000 bytes          |                 5.27 |    3 |
| 6000 / [B1.4] Insert N characters at random positions (time)                    |                   70 ms |             72 ms |   2.86% | diamond-types: 135 ms           |                 0.53 |    1 |
| 6000 / [B1.4] Insert N characters at random positions (avgUpdateSize)           |                31 bytes |          31 bytes |   0.00% | yjs: 29 bytes                   |                 1.07 |    2 |
| 6000 / [B1.4] Insert N characters at random positions (docSize)                 |             54847 bytes |       54847 bytes |   0.00% | diamond-types: 20229 bytes      |                 2.71 |    5 |
| 6000 / [B1.4] Insert N characters at random positions (rssPerDoc)               |        912896.000 bytes |  963328.000 bytes |   5.52% | loro: 223232.000 bytes          |                 4.32 |    2 |
| 6000 / [B1.5] Insert N words at random positions (time)                         |                   73 ms |             82 ms |  12.33% | diamond-types: 134 ms           |                 0.61 |    1 |
| 6000 / [B1.5] Insert N words at random positions (avgUpdateSize)                |                41 bytes |          41 bytes |   0.00% | yjs: 36 bytes                   |                 1.14 |    3 |
| 6000 / [B1.5] Insert N words at random positions (docSize)                      |             94107 bytes |       94107 bytes |   0.00% | diamond-types: 55780 bytes      |                 1.69 |    4 |
| 6000 / [B1.5] Insert N words at random positions (rssPerDoc)                    |       1431808.000 bytes | 1414144.000 bytes |  -1.23% | loro: 363520.000 bytes          |                 3.89 |    3 |
| 6000 / [B1.6] Insert string, then delete it (time)                              |                   15 ms |             19 ms |  26.67% | ywasm: 5 ms                     |                 3.80 |    5 |
| 6000 / [B1.6] Insert string, then delete it (avgUpdateSize)                     |             12067 bytes |       12067 bytes |   0.00% | yjs: 6053 bytes                 |                 1.99 |    5 |
| 6000 / [B1.6] Insert string, then delete it (docSize)                           |                25 bytes |          25 bytes |   0.00% | yjs: 38 bytes                   |                 0.66 |    1 |
| 6000 / [B1.7] Insert/Delete strings at random positions (time)                  |                  106 ms |            114 ms |   7.55% | diamond-types: 122 ms           |                 0.93 |    1 |
| 6000 / [B1.7] Insert/Delete strings at random positions (avgUpdateSize)         |                61 bytes |          61 bytes |   0.00% | yjs: 31 bytes                   |                 1.97 |    3 |
| 6000 / [B1.7] Insert/Delete strings at random positions (docSize)               |             11831 bytes |       11825 bytes |  -0.05% | yjs: 31973 bytes                |                 0.37 |    1 |
| 6000 / [B1.7] Insert/Delete strings at random positions (rssPerDoc)             | unresolved: below-noise |  181504.000 bytes |       — | loro: 173568.000 bytes          |                 1.05 |    2 |
| 6000 / [B1.8] Append N numbers (time)                                           |                   65 ms |             74 ms |  13.85% | ywasm: 106 ms                   |                 0.70 |    1 |
| 6000 / [B1.8] Append N numbers (avgUpdateSize)                                  |                35 bytes |          35 bytes |   0.00% | yjs: 32 bytes                   |                 1.09 |    2 |
| 6000 / [B1.8] Append N numbers (docSize)                                        |             30033 bytes |       30033 bytes |   0.00% | yjs: 35663 bytes                |                 0.84 |    1 |
| 6000 / [B1.8] Append N numbers (rssPerDoc)                                      |         55296.000 bytes |  100096.000 bytes |  81.02% | ywasm: 110848.000 bytes         |                 0.90 |    1 |
| 6000 / [B1.9] Insert Array of N numbers (time)                                  |                   15 ms |             18 ms |  20.00% | yjs: 11 ms                      |                 1.64 |    2 |
| 6000 / [B1.9] Insert Array of N numbers (avgUpdateSize)                         |             30026 bytes |       30026 bytes |   0.00% | yjs: 35651 bytes                |                 0.84 |    1 |
| 6000 / [B1.9] Insert Array of N numbers (docSize)                               |             30033 bytes |       30033 bytes |   0.00% | yjs: 35651 bytes                |                 0.84 |    1 |
| 6000 / [B1.9] Insert Array of N numbers (rssPerDoc)                             | unresolved: below-noise |  101376.000 bytes |       — | ywasm: 112640.000 bytes         |                 0.90 |    1 |
| 6000 / [B1.10] Prepend N numbers (time)                                         |                   83 ms |             85 ms |   2.41% | ywasm: 93 ms                    |                 0.91 |    1 |
| 6000 / [B1.10] Prepend N numbers (avgUpdateSize)                                |                35 bytes |          35 bytes |   0.00% | yjs: 32 bytes                   |                 1.09 |    2 |
| 6000 / [B1.10] Prepend N numbers (docSize)                                      |             65004 bytes |       65004 bytes |   0.00% | yjs: 35688 bytes                |                 1.82 |    3 |
| 6000 / [B1.10] Prepend N numbers (rssPerDoc)                                    |       1057792.000 bytes | 1051136.000 bytes |  -0.63% | loro: 364800.000 bytes          |                 2.88 |    2 |
| 6000 / [B1.11] Insert N numbers at random positions (time)                      |                   73 ms |             78 ms |   6.85% | ywasm: 149 ms                   |                 0.52 |    1 |
| 6000 / [B1.11] Insert N numbers at random positions (avgUpdateSize)             |                35 bytes |          35 bytes |   0.00% | yjs: 34 bytes                   |                 1.03 |    2 |
| 6000 / [B1.11] Insert N numbers at random positions (docSize)                   |             78785 bytes |       78785 bytes |   0.00% | yjs: 59148 bytes                |                 1.33 |    3 |
| 6000 / [B1.11] Insert N numbers at random positions (rssPerDoc)                 |        929792.000 bytes |  935168.000 bytes |   0.58% | loro: 408320.000 bytes          |                 2.29 |    2 |
| 6000 / [B2.1] Concurrently insert string of length N at index 0 (time)          |                   17 ms |             22 ms |  29.41% | ywasm: 1 ms                     |                22.00 |    5 |
| 6000 / [B2.1] Concurrently insert string of length N at index 0 (updateSize)    |             12141 bytes |       12141 bytes |   0.00% | yjs: 6094 bytes                 |                 1.99 |    5 |
| 6000 / [B2.1] Concurrently insert string of length N at index 0 (docSize)       |             12165 bytes |       12165 bytes |   0.00% | yjs: 12152 bytes                |                 1.00 |    3 |
| 6000 / [B2.2] Concurrently insert N characters at random positions (time)       |                   79 ms |             85 ms |   7.59% | diamond-types: 64 ms            |                 1.33 |    3 |
| 6000 / [B2.2] Concurrently insert N characters at random positions (updateSize) |            179592 bytes |      179592 bytes |   0.00% | diamond-types: 20391 bytes      |                 8.81 |    5 |
| 6000 / [B2.2] Concurrently insert N characters at random positions (docSize)    |            110915 bytes |      110915 bytes |   0.00% | diamond-types: 40641 bytes      |                 2.73 |    5 |
| 6000 / [B2.2] Concurrently insert N characters at random positions (rssPerDoc)  |       1727744.000 bytes | 1718016.000 bytes |  -0.56% | loro: 320512.000 bytes          |                 5.36 |    3 |
| 6000 / [B2.3] Concurrently insert N words at random positions (time)            |                  101 ms |            101 ms |   0.00% | diamond-types: 66 ms            |                 1.53 |    2 |
| 6000 / [B2.3] Concurrently insert N words at random positions (updateSize)      |            239777 bytes |      239777 bytes |   0.00% | diamond-types: 55775 bytes      |                 4.30 |    5 |
| 6000 / [B2.3] Concurrently insert N words at random positions (docSize)         |            188620 bytes |      188620 bytes |   0.00% | diamond-types: 111428 bytes     |                 1.69 |    4 |
| 6000 / [B2.3] Concurrently insert N words at random positions (rssPerDoc)       |       2664960.000 bytes | 2664704.000 bytes |  -0.01% | loro: 580352.000 bytes          |                 4.59 |    3 |
| 6000 / [B2.4] Concurrently insert & delete (time)                               |                  173 ms |            195 ms |  12.72% | diamond-types: 86 ms            |                 2.27 |    2 |
| 6000 / [B2.4] Concurrently insert & delete (updateSize)                         |            529002 bytes |      529002 bytes |   0.00% | diamond-types: 86934 bytes      |                 6.09 |    5 |
| 6000 / [B2.4] Concurrently insert & delete (docSize)                            |            344390 bytes |      344384 bytes |  -0.00% | diamond-types: 173715 bytes     |                 1.98 |    4 |
| 6000 / [B2.4] Concurrently insert & delete (rssPerDoc)                          |       4712960.000 bytes | 4531712.000 bytes |  -3.85% | loro: 691456.000 bytes          |                 6.55 |    3 |
| 6000 / [B3.4] 20√N clients concurrently insert text in Array (time)             |                   13 ms |             11 ms | -15.38% | ywasm: 53 ms                    |                 0.21 |    1 |
| 6000 / [B3.4] 20√N clients concurrently insert text in Array (updateSize)       |             40470 bytes |       40470 bytes |   0.00% | yjs: 52740 bytes                |                 0.77 |    1 |
| 6000 / [B3.4] 20√N clients concurrently insert text in Array (docSize)          |             21991 bytes |       22001 bytes |   0.05% | yjs: 26585 bytes                |                 0.83 |    1 |
| 6000 / [B3.4] 20√N clients concurrently insert text in Array (rssPerDoc)        |        203520.000 bytes |  185600.000 bytes |  -8.81% | ywasm: 563200.000 bytes         |                 0.33 |    1 |
| 6000 / [B3.5] 20√N clients concurrently insert text (time)                      |                   12 ms |             11 ms |  -8.33% | ywasm: 53 ms                    |                 0.21 |    1 |
| 6000 / [B3.5] 20√N clients concurrently insert text (updateSize)                |             42440 bytes |       42440 bytes |   0.00% | yjs: 48116 bytes                |                 0.88 |    1 |
| 6000 / [B3.5] 20√N clients concurrently insert text (docSize)                   |             21988 bytes |       21999 bytes |   0.05% | yjs: 24320 bytes                |                 0.90 |    1 |
| 6000 / [B3.5] 20√N clients concurrently insert text (rssPerDoc)                 |        203264.000 bytes |  176640.000 bytes | -13.10% | diamond-types: 367872.000 bytes |                 0.48 |    1 |
| 6000 / [B4] Apply real-world editing dataset (time)                             |                  847 ms |            983 ms |  16.06% | diamond-types: 1192 ms          |                 0.82 |    1 |
| 6000 / [B4] Apply real-world editing dataset (docSize)                          |            146355 bytes |      146355 bytes |   0.00% | diamond-types: 109005 bytes     |                 1.34 |    2 |
| 6000 / [B4] Apply real-world editing dataset (rssPerDoc)                        |       1595648.000 bytes | 1629184.000 bytes |   2.10% | loro: 571904.000 bytes          |                 2.85 |    3 |
| 6000 / [B5] Grow, edit and shrink text lifecycle up 0 chunks (docSize)          |                18 bytes |          18 bytes |   0.00% | ywasm: 13 bytes                 |                 1.38 |    3 |
| 6000 / [B5] Grow, edit and shrink text lifecycle up 1 chunks (docSize)          |                89 bytes |          89 bytes |   0.00% | yjs: 102 bytes                  |                 0.87 |    1 |
| 6000 / [B5] Grow, edit and shrink text lifecycle up 1 chunks (rssPerDoc)        |         22272.000 bytes |   31744.000 bytes |  42.53% | loro: 24320.000 bytes           |                 1.31 |    2 |
| 6000 / [B5] Grow, edit and shrink text lifecycle up 10 chunks (docSize)         |               668 bytes |         668 bytes |   0.00% | yjs: 918 bytes                  |                 0.73 |    1 |
| 6000 / [B5] Grow, edit and shrink text lifecycle up 100 chunks (docSize)        |              6203 bytes |        6203 bytes |   0.00% | yjs: 9646 bytes                 |                 0.64 |    1 |
| 6000 / [B5] Grow, edit and shrink text lifecycle up 100 chunks (rssPerDoc)      |         60672.000 bytes |   33280.000 bytes | -45.15% | loro: 132352.000 bytes          |                 0.25 |    1 |
| 6000 / [B5] Grow, edit and shrink text lifecycle up 1000 chunks (docSize)       |             66007 bytes |       66007 bytes |   0.00% | yjs: 105822 bytes               |                 0.62 |    1 |
| 6000 / [B5] Grow, edit and shrink text lifecycle up 1000 chunks (rssPerDoc)     |        700160.000 bytes |  693504.000 bytes |  -0.95% | loro: 631040.000 bytes          |                 1.10 |    2 |
| 6000 / [B5] Grow, edit and shrink text lifecycle up 6000 chunks (docSize)       |            401259 bytes |      401259 bytes |   0.00% | yjs: 656409 bytes               |                 0.61 |    1 |
| 6000 / [B5] Grow, edit and shrink text lifecycle up 6000 chunks (rssPerDoc)     |       3566848.000 bytes | 3507968.000 bytes |  -1.65% | loro: 3495253.333 bytes         |                 1.00 |    2 |
| 6000 / [B5] Grow, edit and shrink text lifecycle down 1000 chunks (docSize)     |             68489 bytes |       68489 bytes |   0.00% | yjs: 697912 bytes               |                 0.10 |    1 |
| 6000 / [B5] Grow, edit and shrink text lifecycle down 1000 chunks (rssPerDoc)   |        708352.000 bytes |  653568.000 bytes |  -7.73% | loro: 4167168.000 bytes         |                 0.16 |    1 |
| 6000 / [B5] Grow, edit and shrink text lifecycle down 100 chunks (docSize)      |              7233 bytes |        7233 bytes |   0.00% | yjs: 703270 bytes               |                 0.01 |    1 |
| 6000 / [B5] Grow, edit and shrink text lifecycle down 10 chunks (docSize)       |               825 bytes |         825 bytes |   0.00% | yjs: 703106 bytes               |                 0.00 |    1 |
| 6000 / [B5] Grow, edit and shrink text lifecycle down 1 chunks (docSize)        |               128 bytes |         128 bytes |   0.00% | yjs: 702980 bytes               |                 0.00 |    1 |
| 6000 / [B5] Grow, edit and shrink text lifecycle down 0 chunks (docSize)        |                31 bytes |          31 bytes |   0.00% | yjs: 702903 bytes               |                 0.00 |    1 |
| 6000 / [B5] Grow, edit and shrink text lifecycle down 0 chunks (rssPerDoc)      | unresolved: below-noise |   27904.000 bytes |       — | loro: 3920457.143 bytes         |                 0.01 |    1 |
| 6000 / [B5] Grow, edit and shrink text lifecycle up (time)                      |              857.166 ms |        523.147 ms | -38.97% | loro: 2531.040 ms               |                 0.21 |    1 |
| 6000 / [B5] Grow, edit and shrink text lifecycle up apply.random (time)         |              206.376 ms |        117.099 ms | -43.26% | ywasm: 58.382 ms                |                 2.01 |    3 |
| 6000 / [B5] Grow, edit and shrink text lifecycle up create (time)               |                3.519 ms |          3.753 ms |   6.65% | diamond-types: 2.152 ms         |                 1.74 |    3 |
| 6000 / [B5] Grow, edit and shrink text lifecycle up encode (time)               |               23.431 ms |         19.313 ms | -17.58% | ywasm: 10.931 ms                |                 1.77 |    4 |
| 6000 / [B5] Grow, edit and shrink text lifecycle up insert.head (time)          |               29.881 ms |         20.436 ms | -31.61% | diamond-types: 20.791 ms        |                 0.98 |    1 |
| 6000 / [B5] Grow, edit and shrink text lifecycle up insert.random (time)        |               99.184 ms |         59.652 ms | -39.86% | diamond-types: 55.155 ms        |                 1.08 |    2 |
| 6000 / [B5] Grow, edit and shrink text lifecycle up insert.tail (time)          |               28.652 ms |         18.340 ms | -35.99% | diamond-types: 22.663 ms        |                 0.81 |    1 |
| 6000 / [B5] Grow, edit and shrink text lifecycle up load (time)                 |                6.357 ms |          5.340 ms | -16.00% | loro: 7.609 ms                  |                 0.70 |    1 |
| 6000 / [B5] Grow, edit and shrink text lifecycle up remove.random (time)        |               85.441 ms |         52.925 ms | -38.06% | diamond-types: 31.873 ms        |                 1.66 |    2 |
| 6000 / [B5] Grow, edit and shrink text lifecycle up replace.head (time)         |               82.885 ms |         49.309 ms | -40.51% | diamond-types: 174.788 ms       |                 0.28 |    1 |
| 6000 / [B5] Grow, edit and shrink text lifecycle up replace.random (time)       |              134.664 ms |         81.110 ms | -39.77% | diamond-types: 70.175 ms        |                 1.16 |    2 |
| 6000 / [B5] Grow, edit and shrink text lifecycle up replace.tail (time)         |               80.207 ms |         50.378 ms | -37.19% | diamond-types: 52.219 ms        |                 0.96 |    1 |
| 6000 / [B5] Grow, edit and shrink text lifecycle up value.head (time)           |                3.424 ms |          2.027 ms | -40.80% | loro: 15.688 ms                 |                 0.13 |    1 |
| 6000 / [B5] Grow, edit and shrink text lifecycle up value.random (time)         |               48.274 ms |         29.359 ms | -39.18% | loro: 11.333 ms                 |                 2.59 |    2 |
| 6000 / [B5] Grow, edit and shrink text lifecycle up value.tail (time)           |                1.572 ms |          0.980 ms | -37.66% | loro: 8.563 ms                  |                 0.11 |    1 |
| 6000 / [B5] Grow, edit and shrink text lifecycle up values (time)               |               23.298 ms |         13.125 ms | -43.66% | yjs: 1.141 ms                   |                11.50 |    4 |
| 6000 / [B5] Grow, edit and shrink text lifecycle down (time)                    |              994.787 ms |        722.845 ms | -27.34% | loro: 3519.613 ms               |                 0.21 |    1 |
| 6000 / [B5] Grow, edit and shrink text lifecycle down apply.random (time)       |              222.259 ms |        162.470 ms | -26.90% | diamond-types: 69.231 ms        |                 2.35 |    3 |
| 6000 / [B5] Grow, edit and shrink text lifecycle down encode (time)             |              136.711 ms |         90.903 ms | -33.51% | ywasm: 54.832 ms                |                 1.66 |    2 |
| 6000 / [B5] Grow, edit and shrink text lifecycle down insert.random (time)      |              105.475 ms |         80.017 ms | -24.14% | diamond-types: 55.354 ms        |                 1.45 |    2 |
| 6000 / [B5] Grow, edit and shrink text lifecycle down load (time)               |                1.400 ms |          1.196 ms | -14.57% | loro: 21.107 ms                 |                 0.06 |    1 |
| 6000 / [B5] Grow, edit and shrink text lifecycle down remove.head (time)        |               24.689 ms |         19.673 ms | -20.32% | diamond-types: 12.556 ms        |                 1.57 |    2 |
| 6000 / [B5] Grow, edit and shrink text lifecycle down remove.random (time)      |               99.988 ms |         74.381 ms | -25.61% | diamond-types: 40.215 ms        |                 1.85 |    2 |
| 6000 / [B5] Grow, edit and shrink text lifecycle down remove.tail (time)        |               29.766 ms |         14.341 ms | -51.82% | diamond-types: 13.593 ms        |                 1.06 |    2 |
| 6000 / [B5] Grow, edit and shrink text lifecycle down replace.head (time)       |               81.329 ms |         59.060 ms | -27.38% | diamond-types: 322.872 ms       |                 0.18 |    1 |
| 6000 / [B5] Grow, edit and shrink text lifecycle down replace.random (time)     |              141.348 ms |        105.975 ms | -25.03% | diamond-types: 72.902 ms        |                 1.45 |    2 |
| 6000 / [B5] Grow, edit and shrink text lifecycle down replace.tail (time)       |               79.933 ms |         61.708 ms | -22.80% | diamond-types: 62.425 ms        |                 0.99 |    1 |
| 6000 / [B5] Grow, edit and shrink text lifecycle down value.head (time)         |                4.414 ms |          3.270 ms | -25.92% | loro: 16.138 ms                 |                 0.20 |    1 |
| 6000 / [B5] Grow, edit and shrink text lifecycle down value.random (time)       |               61.064 ms |         44.765 ms | -26.69% | loro: 14.458 ms                 |                 3.10 |    2 |
| 6000 / [B5] Grow, edit and shrink text lifecycle down value.tail (time)         |                3.382 ms |          2.637 ms | -22.03% | loro: 10.466 ms                 |                 0.25 |    1 |
| 6000 / [B5] Grow, edit and shrink text lifecycle down values (time)             |                3.029 ms |          2.449 ms | -19.15% | loro: 3.112 ms                  |                 0.79 |    1 |
| 6000 / [B5] Grow, edit and shrink text lifecycle total (time)                   |             1851.954 ms |       1245.991 ms | -32.72% | loro: 6050.653 ms               |                 0.21 |    1 |
| 6000 / [B5] Grow, edit and shrink text lifecycle total apply.random (time)      |              428.635 ms |        279.569 ms | -34.78% | diamond-types: 132.090 ms       |                 2.12 |    3 |
| 6000 / [B5] Grow, edit and shrink text lifecycle total create (time)            |                3.519 ms |          3.753 ms |   6.65% | diamond-types: 2.152 ms         |                 1.74 |    3 |
| 6000 / [B5] Grow, edit and shrink text lifecycle total encode (time)            |              160.143 ms |        110.217 ms | -31.18% | ywasm: 65.762 ms                |                 1.68 |    2 |
| 6000 / [B5] Grow, edit and shrink text lifecycle total insert.head (time)       |               29.881 ms |         20.436 ms | -31.61% | diamond-types: 20.791 ms        |                 0.98 |    1 |
| 6000 / [B5] Grow, edit and shrink text lifecycle total insert.random (time)     |              204.658 ms |        139.670 ms | -31.75% | diamond-types: 110.509 ms       |                 1.26 |    2 |
| 6000 / [B5] Grow, edit and shrink text lifecycle total insert.tail (time)       |               28.652 ms |         18.340 ms | -35.99% | diamond-types: 22.663 ms        |                 0.81 |    1 |
| 6000 / [B5] Grow, edit and shrink text lifecycle total load (time)              |                7.758 ms |          6.536 ms | -15.75% | loro: 28.716 ms                 |                 0.23 |    1 |
| 6000 / [B5] Grow, edit and shrink text lifecycle total remove.head (time)       |               24.689 ms |         19.673 ms | -20.32% | diamond-types: 12.556 ms        |                 1.57 |    2 |
| 6000 / [B5] Grow, edit and shrink text lifecycle total remove.random (time)     |              185.429 ms |        127.306 ms | -31.35% | diamond-types: 72.088 ms        |                 1.77 |    2 |
| 6000 / [B5] Grow, edit and shrink text lifecycle total remove.tail (time)       |               29.766 ms |         14.341 ms | -51.82% | diamond-types: 13.593 ms        |                 1.06 |    2 |
| 6000 / [B5] Grow, edit and shrink text lifecycle total replace.head (time)      |              164.214 ms |        108.369 ms | -34.01% | diamond-types: 497.660 ms       |                 0.22 |    1 |
| 6000 / [B5] Grow, edit and shrink text lifecycle total replace.random (time)    |              276.012 ms |        187.084 ms | -32.22% | diamond-types: 143.077 ms       |                 1.31 |    2 |
| 6000 / [B5] Grow, edit and shrink text lifecycle total replace.tail (time)      |              160.140 ms |        112.086 ms | -30.01% | diamond-types: 114.644 ms       |                 0.98 |    1 |
| 6000 / [B5] Grow, edit and shrink text lifecycle total value.head (time)        |                7.838 ms |          5.297 ms | -32.42% | loro: 31.826 ms                 |                 0.17 |    1 |
| 6000 / [B5] Grow, edit and shrink text lifecycle total value.random (time)      |              109.338 ms |         74.124 ms | -32.21% | loro: 25.791 ms                 |                 2.87 |    2 |
| 6000 / [B5] Grow, edit and shrink text lifecycle total value.tail (time)        |                4.954 ms |          3.616 ms | -27.01% | loro: 19.029 ms                 |                 0.19 |    1 |
| 6000 / [B5] Grow, edit and shrink text lifecycle total values (time)            |               26.327 ms |         15.574 ms | -40.84% | loro: 6.389 ms                  |                 2.44 |    3 |
| 6000 / [B5] Grow, edit and shrink text lifecycle (time)                         |             1851.954 ms |       1245.991 ms | -32.72% | loro: 6050.653 ms               |                 0.21 |    1 |
| 6000 / [B5] Grow, edit and shrink text lifecycle (updateSize)                   |          13589844 bytes |    13589844 bytes |   0.00% | yjs: 6523102 bytes              |                 2.08 |    5 |
| 6000 / [B6] Concurrent Instance Capacity (time)                                 |            30049.765 ms |      30016.447 ms |  -0.11% | yjs: 14080.015 ms               |                 2.13 |    4 |
| 6000 / [B6] Concurrent Instance Capacity (rssPerInstance)                       |          1243.362 bytes |    1147.999 bytes |  -7.67% | diamond-types: 669.234 bytes    |                 1.72 |    2 |
