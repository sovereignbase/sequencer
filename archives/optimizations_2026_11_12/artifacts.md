# Artifact and live allocation comparison

All figures use the same release/LTO build, compiler and bundler. Minification uses Terser with three compress passes; gzip uses level 9. Brotli uses the same Node default for all builds. The generated glue excludes only the embedded Wasm string literal. Distribution totals include maps and declarations, without running package or publish hooks.

## coalesce

| Artifact                 | Baseline bytes | Candidate bytes | Difference | Change |
| :----------------------- | -------------: | --------------: | ---------: | -----: |
| wasm rawBytes            |          90954 |           91281 |        327 | 0.360% |
| wasm gzipBytes           |          36835 |           36948 |        113 | 0.307% |
| wasm brotliBytes         |          30195 |           30306 |        111 | 0.368% |
| glue rawBytes            |           4324 |            4324 |          0 | 0.000% |
| generatedModule rawBytes |         101307 |          101636 |        329 | 0.325% |
| index.js rawBytes        |         151219 |          151617 |        398 | 0.263% |
| index.js minBytes        |         123218 |          123590 |        372 | 0.302% |
| index.js gzipBytes       |          44257 |           44404 |        147 | 0.332% |
| index.js brotliBytes     |          36367 |           36542 |        175 | 0.481% |
| index.cjs rawBytes       |         151372 |          151770 |        398 | 0.263% |
| index.cjs minBytes       |         124521 |          124893 |        372 | 0.299% |
| index.cjs gzipBytes      |          44409 |           44562 |        153 | 0.345% |
| index.cjs brotliBytes    |          36527 |           36677 |        150 | 0.411% |
| distribution rawBytes    |        1060967 |         1064161 |       3194 | 0.301% |

Glue SHA-256: `a372b9cc078ccd067d982eb0428972d64207b51e118fbba7a3d6e5a62b9f85a4`.

## zero

| Artifact                 | Baseline bytes | Candidate bytes | Difference | Change |
| :----------------------- | -------------: | --------------: | ---------: | -----: |
| wasm rawBytes            |          90954 |           91237 |        283 | 0.311% |
| wasm gzipBytes           |          36835 |           36947 |        112 | 0.304% |
| wasm brotliBytes         |          30195 |           30334 |        139 | 0.460% |
| glue rawBytes            |           4324 |            4324 |          0 | 0.000% |
| generatedModule rawBytes |         101307 |          101577 |        270 | 0.267% |
| index.js rawBytes        |         151219 |          151538 |        319 | 0.211% |
| index.js minBytes        |         123218 |          123526 |        308 | 0.250% |
| index.js gzipBytes       |          44257 |           44367 |        110 | 0.249% |
| index.js brotliBytes     |          36367 |           36504 |        137 | 0.377% |
| index.cjs rawBytes       |         151372 |          151691 |        319 | 0.211% |
| index.cjs minBytes       |         124521 |          124829 |        308 | 0.247% |
| index.cjs gzipBytes      |          44409 |           44520 |        111 | 0.250% |
| index.cjs brotliBytes    |          36527 |           36688 |        161 | 0.441% |
| distribution rawBytes    |        1060967 |         1063741 |       2774 | 0.261% |

Glue SHA-256: `a372b9cc078ccd067d982eb0428972d64207b51e118fbba7a3d6e5a62b9f85a4`.

## zero-call

| Artifact                 | Baseline bytes | Candidate bytes | Difference | Change |
| :----------------------- | -------------: | --------------: | ---------: | -----: |
| wasm rawBytes            |          90954 |           91098 |        144 | 0.158% |
| wasm gzipBytes           |          36835 |           36892 |         57 | 0.155% |
| wasm brotliBytes         |          30195 |           30281 |         86 | 0.285% |
| glue rawBytes            |           4324 |            4324 |          0 | 0.000% |
| generatedModule rawBytes |         101307 |          101452 |        145 | 0.143% |
| index.js rawBytes        |         151219 |          151379 |        160 | 0.106% |
| index.js minBytes        |         123218 |          123373 |        155 | 0.126% |
| index.js gzipBytes       |          44257 |           44324 |         67 | 0.151% |
| index.js brotliBytes     |          36367 |           36474 |        107 | 0.294% |
| index.cjs rawBytes       |         151372 |          151532 |        160 | 0.106% |
| index.cjs minBytes       |         124521 |          124676 |        155 | 0.124% |
| index.cjs gzipBytes      |          44409 |           44477 |         68 | 0.153% |
| index.cjs brotliBytes    |          36527 |           36613 |         86 | 0.235% |
| distribution rawBytes    |        1060967 |         1062349 |       1382 | 0.130% |

Glue SHA-256: `a372b9cc078ccd067d982eb0428972d64207b51e118fbba7a3d6e5a62b9f85a4`.

## reserve

| Artifact                 | Baseline bytes | Candidate bytes | Difference |  Change |
| :----------------------- | -------------: | --------------: | ---------: | ------: |
| wasm rawBytes            |          90954 |           90991 |         37 |  0.041% |
| wasm gzipBytes           |          36835 |           36856 |         21 |  0.057% |
| wasm brotliBytes         |          30195 |           30172 |        -23 | -0.076% |
| glue rawBytes            |           4324 |            4324 |          0 |  0.000% |
| generatedModule rawBytes |         101307 |          101348 |         41 |  0.040% |
| index.js rawBytes        |         151219 |          151268 |         49 |  0.032% |
| index.js minBytes        |         123218 |          123269 |         51 |  0.041% |
| index.js gzipBytes       |          44257 |           44281 |         24 |  0.054% |
| index.js brotliBytes     |          36367 |           36399 |         32 |  0.088% |
| index.cjs rawBytes       |         151372 |          151421 |         49 |  0.032% |
| index.cjs minBytes       |         124521 |          124572 |         51 |  0.041% |
| index.cjs gzipBytes      |          44409 |           44434 |         25 |  0.056% |
| index.cjs brotliBytes    |          36527 |           36586 |         59 |  0.162% |
| distribution rawBytes    |        1060967 |         1061337 |        370 |  0.035% |

Glue SHA-256: `a372b9cc078ccd067d982eb0428972d64207b51e118fbba7a3d6e5a62b9f85a4`.

## late-reserve

| Artifact                 | Baseline bytes | Candidate bytes | Difference | Change |
| :----------------------- | -------------: | --------------: | ---------: | -----: |
| wasm rawBytes            |          90954 |           91043 |         89 | 0.098% |
| wasm gzipBytes           |          36835 |           36906 |         71 | 0.193% |
| wasm brotliBytes         |          30195 |           30314 |        119 | 0.394% |
| glue rawBytes            |           4324 |            4324 |          0 | 0.000% |
| generatedModule rawBytes |         101307 |          101408 |        101 | 0.100% |
| index.js rawBytes        |         151219 |          151338 |        119 | 0.079% |
| index.js minBytes        |         123218 |          123338 |        120 | 0.097% |
| index.js gzipBytes       |          44257 |           44335 |         78 | 0.176% |
| index.js brotliBytes     |          36367 |           36475 |        108 | 0.297% |
| index.cjs rawBytes       |         151372 |          151491 |        119 | 0.079% |
| index.cjs minBytes       |         124521 |          124641 |        120 | 0.096% |
| index.cjs gzipBytes      |          44409 |           44492 |         83 | 0.187% |
| index.cjs brotliBytes    |          36527 |           36631 |        104 | 0.285% |
| distribution rawBytes    |        1060967 |         1061799 |        832 | 0.078% |

Glue SHA-256: `a372b9cc078ccd067d982eb0428972d64207b51e118fbba7a3d6e5a62b9f85a4`.

## input-cache

| Artifact                 | Baseline bytes | Candidate bytes | Difference |  Change |
| :----------------------- | -------------: | --------------: | ---------: | ------: |
| wasm rawBytes            |          90954 |           90991 |         37 |  0.041% |
| wasm gzipBytes           |          36835 |           36856 |         21 |  0.057% |
| wasm brotliBytes         |          30195 |           30172 |        -23 | -0.076% |
| glue rawBytes            |           4324 |            4324 |          0 |  0.000% |
| generatedModule rawBytes |         101307 |          101348 |         41 |  0.040% |
| index.js rawBytes        |         151219 |          151619 |        400 |  0.265% |
| index.js minBytes        |         123218 |          123311 |         93 |  0.075% |
| index.js gzipBytes       |          44257 |           44312 |         55 |  0.124% |
| index.js brotliBytes     |          36367 |           36432 |         65 |  0.179% |
| index.cjs rawBytes       |         151372 |          151770 |        398 |  0.263% |
| index.cjs minBytes       |         124521 |          124709 |        188 |  0.151% |
| index.cjs gzipBytes      |          44409 |           44498 |         89 |  0.200% |
| index.cjs brotliBytes    |          36527 |           36570 |         43 |  0.118% |
| distribution rawBytes    |        1060967 |         1063132 |       2165 |  0.204% |

Glue SHA-256: `a372b9cc078ccd067d982eb0428972d64207b51e118fbba7a3d6e5a62b9f85a4`.

## rounded

| Artifact                 | Baseline bytes | Candidate bytes | Difference |  Change |
| :----------------------- | -------------: | --------------: | ---------: | ------: |
| wasm rawBytes            |          90954 |           90756 |       -198 | -0.218% |
| wasm gzipBytes           |          36835 |           36742 |        -93 | -0.252% |
| wasm brotliBytes         |          30195 |           30071 |       -124 | -0.411% |
| glue rawBytes            |           4324 |            4324 |          0 |  0.000% |
| generatedModule rawBytes |         101307 |          101106 |       -201 | -0.198% |
| index.js rawBytes        |         151219 |          150792 |       -427 | -0.282% |
| index.js minBytes        |         123218 |          122927 |       -291 | -0.236% |
| index.js gzipBytes       |          44257 |           44132 |       -125 | -0.282% |
| index.js brotliBytes     |          36367 |           36303 |        -64 | -0.176% |
| index.cjs rawBytes       |         151372 |          150945 |       -427 | -0.282% |
| index.cjs minBytes       |         124521 |          124230 |       -291 | -0.234% |
| index.cjs gzipBytes      |          44409 |           44287 |       -122 | -0.275% |
| index.cjs brotliBytes    |          36527 |           36462 |        -65 | -0.178% |
| distribution rawBytes    |        1060967 |         1057823 |      -3144 | -0.296% |

Glue SHA-256: `a372b9cc078ccd067d982eb0428972d64207b51e118fbba7a3d6e5a62b9f85a4`.

## denser

| Artifact                 | Baseline bytes | Candidate bytes | Difference |  Change |
| :----------------------- | -------------: | --------------: | ---------: | ------: |
| wasm rawBytes            |          90954 |           90796 |       -158 | -0.174% |
| wasm gzipBytes           |          36835 |           36755 |        -80 | -0.217% |
| wasm brotliBytes         |          30195 |           30130 |        -65 | -0.215% |
| glue rawBytes            |           4324 |            4324 |          0 |  0.000% |
| generatedModule rawBytes |         101307 |          101156 |       -151 | -0.149% |
| index.js rawBytes        |         151219 |          150860 |       -359 | -0.237% |
| index.js minBytes        |         123218 |          122995 |       -223 | -0.181% |
| index.js gzipBytes       |          44257 |           44148 |       -109 | -0.246% |
| index.js brotliBytes     |          36367 |           36306 |        -61 | -0.168% |
| index.cjs rawBytes       |         151372 |          151013 |       -359 | -0.237% |
| index.cjs minBytes       |         124521 |          124298 |       -223 | -0.179% |
| index.cjs gzipBytes      |          44409 |           44303 |       -106 | -0.239% |
| index.cjs brotliBytes    |          36527 |           36490 |        -37 | -0.101% |
| distribution rawBytes    |        1060967 |         1058279 |      -2688 | -0.253% |

Glue SHA-256: `a372b9cc078ccd067d982eb0428972d64207b51e118fbba7a3d6e5a62b9f85a4`.

## arena-owner

| Artifact                 | Baseline bytes | Candidate bytes | Difference |  Change |
| :----------------------- | -------------: | --------------: | ---------: | ------: |
| wasm rawBytes            |          90954 |           90802 |       -152 | -0.167% |
| wasm gzipBytes           |          36835 |           36743 |        -92 | -0.250% |
| wasm brotliBytes         |          30195 |           30127 |        -68 | -0.225% |
| glue rawBytes            |           4324 |            4324 |          0 |  0.000% |
| generatedModule rawBytes |         101307 |          101094 |       -213 | -0.210% |
| index.js rawBytes        |         151219 |          150768 |       -451 | -0.298% |
| index.js minBytes        |         123218 |          122936 |       -282 | -0.229% |
| index.js gzipBytes       |          44257 |           44113 |       -144 | -0.325% |
| index.js brotliBytes     |          36367 |           36296 |        -71 | -0.195% |
| index.cjs rawBytes       |         151372 |          150921 |       -451 | -0.298% |
| index.cjs minBytes       |         124521 |          124239 |       -282 | -0.226% |
| index.cjs gzipBytes      |          44409 |           44268 |       -141 | -0.318% |
| index.cjs brotliBytes    |          36527 |           36433 |        -94 | -0.257% |
| distribution rawBytes    |        1060967 |         1057861 |      -3106 | -0.293% |

Glue SHA-256: `a372b9cc078ccd067d982eb0428972d64207b51e118fbba7a3d6e5a62b9f85a4`.

## entry-payload

| Artifact                 | Baseline bytes | Candidate bytes | Difference |  Change |
| :----------------------- | -------------: | --------------: | ---------: | ------: |
| wasm rawBytes            |          90954 |           90955 |          1 |  0.001% |
| wasm gzipBytes           |          36835 |           36823 |        -12 | -0.033% |
| wasm brotliBytes         |          30195 |           30238 |         43 |  0.142% |
| glue rawBytes            |           4324 |            4324 |          0 |  0.000% |
| generatedModule rawBytes |         101307 |          101326 |         19 |  0.019% |
| index.js rawBytes        |         151219 |          151204 |        -15 | -0.010% |
| index.js minBytes        |         123218 |          123215 |         -3 | -0.002% |
| index.js gzipBytes       |          44257 |           44272 |         15 |  0.034% |
| index.js brotliBytes     |          36367 |           36402 |         35 |  0.096% |
| index.cjs rawBytes       |         151372 |          151357 |        -15 | -0.010% |
| index.cjs minBytes       |         124521 |          124518 |         -3 | -0.002% |
| index.cjs gzipBytes      |          44409 |           44428 |         19 |  0.043% |
| index.cjs brotliBytes    |          36527 |           36559 |         32 |  0.088% |
| distribution rawBytes    |        1060967 |         1060641 |       -326 | -0.031% |

Glue SHA-256: `a372b9cc078ccd067d982eb0428972d64207b51e118fbba7a3d6e5a62b9f85a4`.

## hydration-call

| Artifact                 | Baseline bytes | Candidate bytes | Difference |  Change |
| :----------------------- | -------------: | --------------: | ---------: | ------: |
| wasm rawBytes            |          90954 |           90774 |       -180 | -0.198% |
| wasm gzipBytes           |          36835 |           36811 |        -24 | -0.065% |
| wasm brotliBytes         |          30195 |           30028 |       -167 | -0.553% |
| glue rawBytes            |           4324 |            4324 |          0 |  0.000% |
| generatedModule rawBytes |         101307 |          101064 |       -243 | -0.240% |
| index.js rawBytes        |         151219 |          150728 |       -491 | -0.325% |
| index.js minBytes        |         123218 |          122887 |       -331 | -0.269% |
| index.js gzipBytes       |          44257 |           44181 |        -76 | -0.172% |
| index.js brotliBytes     |          36367 |           36245 |       -122 | -0.335% |
| index.cjs rawBytes       |         151372 |          150881 |       -491 | -0.324% |
| index.cjs minBytes       |         124521 |          124190 |       -331 | -0.266% |
| index.cjs gzipBytes      |          44409 |           44338 |        -71 | -0.160% |
| index.cjs brotliBytes    |          36527 |           36401 |       -126 | -0.345% |
| distribution rawBytes    |        1060967 |         1058049 |      -2918 | -0.275% |

Glue SHA-256: `a372b9cc078ccd067d982eb0428972d64207b51e118fbba7a3d6e5a62b9f85a4`.

## dispatch-cap

| Artifact                 | Baseline bytes | Candidate bytes | Difference |  Change |
| :----------------------- | -------------: | --------------: | ---------: | ------: |
| wasm rawBytes            |          90954 |           90961 |          7 |  0.008% |
| wasm gzipBytes           |          36835 |           36776 |        -59 | -0.160% |
| wasm brotliBytes         |          30195 |           30162 |        -33 | -0.109% |
| glue rawBytes            |           4324 |            4324 |          0 |  0.000% |
| generatedModule rawBytes |         101307 |          101248 |        -59 | -0.058% |
| index.js rawBytes        |         151219 |          151073 |       -146 | -0.097% |
| index.js minBytes        |         123218 |          123139 |        -79 | -0.064% |
| index.js gzipBytes       |          44257 |           44154 |       -103 | -0.233% |
| index.js brotliBytes     |          36367 |           36356 |        -11 | -0.030% |
| index.cjs rawBytes       |         151372 |          151226 |       -146 | -0.096% |
| index.cjs minBytes       |         124521 |          124442 |        -79 | -0.063% |
| index.cjs gzipBytes      |          44409 |           44308 |       -101 | -0.227% |
| index.cjs brotliBytes    |          36527 |           36555 |         28 |  0.077% |
| distribution rawBytes    |        1060967 |         1059269 |      -1698 | -0.160% |

Glue SHA-256: `a372b9cc078ccd067d982eb0428972d64207b51e118fbba7a3d6e5a62b9f85a4`.

## positive-frontier

| Artifact                 | Baseline bytes | Candidate bytes | Difference |  Change |
| :----------------------- | -------------: | --------------: | ---------: | ------: |
| wasm rawBytes            |          90954 |           90942 |        -12 | -0.013% |
| wasm gzipBytes           |          36835 |           36840 |          5 |  0.014% |
| wasm brotliBytes         |          30195 |           30205 |         10 |  0.033% |
| glue rawBytes            |           4324 |            4324 |          0 |  0.000% |
| generatedModule rawBytes |         101307 |          101293 |        -14 | -0.014% |
| index.js rawBytes        |         151219 |          151212 |         -7 | -0.005% |
| index.js minBytes        |         123218 |          123207 |        -11 | -0.009% |
| index.js gzipBytes       |          44257 |           44262 |          5 |  0.011% |
| index.js brotliBytes     |          36367 |           36408 |         41 |  0.113% |
| index.cjs rawBytes       |         151372 |          151365 |         -7 | -0.005% |
| index.cjs minBytes       |         124521 |          124510 |        -11 | -0.009% |
| index.cjs gzipBytes      |          44409 |           44415 |          6 |  0.014% |
| index.cjs brotliBytes    |          36527 |           36578 |         51 |  0.140% |
| distribution rawBytes    |        1060967 |         1060869 |        -98 | -0.009% |

Glue SHA-256: `a372b9cc078ccd067d982eb0428972d64207b51e118fbba7a3d6e5a62b9f85a4`.

## frontier-overlap

| Artifact                 | Baseline bytes | Candidate bytes | Difference | Change |
| :----------------------- | -------------: | --------------: | ---------: | -----: |
| wasm rawBytes            |          90954 |           90956 |          2 | 0.002% |
| wasm gzipBytes           |          36835 |           36848 |         13 | 0.035% |
| wasm brotliBytes         |          30195 |           30267 |         72 | 0.238% |
| glue rawBytes            |           4324 |            4324 |          0 | 0.000% |
| generatedModule rawBytes |         101307 |          101307 |          0 | 0.000% |
| index.js rawBytes        |         151219 |          151228 |          9 | 0.006% |
| index.js minBytes        |         123218 |          123223 |          5 | 0.004% |
| index.js gzipBytes       |          44257 |           44276 |         19 | 0.043% |
| index.js brotliBytes     |          36367 |           36398 |         31 | 0.085% |
| index.cjs rawBytes       |         151372 |          151381 |          9 | 0.006% |
| index.cjs minBytes       |         124521 |          124526 |          5 | 0.004% |
| index.cjs gzipBytes      |          44409 |           44429 |         20 | 0.045% |
| index.cjs brotliBytes    |          36527 |           36657 |        130 | 0.356% |
| distribution rawBytes    |        1060967 |         1060999 |         32 | 0.003% |

Glue SHA-256: `a372b9cc078ccd067d982eb0428972d64207b51e118fbba7a3d6e5a62b9f85a4`.

## fixed-table

| Artifact                 | Baseline bytes | Candidate bytes | Difference |  Change |
| :----------------------- | -------------: | --------------: | ---------: | ------: |
| wasm rawBytes            |          90954 |           90876 |        -78 | -0.086% |
| wasm gzipBytes           |          36835 |           36806 |        -29 | -0.079% |
| wasm brotliBytes         |          30195 |           30175 |        -20 | -0.066% |
| glue rawBytes            |           4324 |            4324 |          0 |  0.000% |
| generatedModule rawBytes |         101307 |          101283 |        -24 | -0.024% |
| index.js rawBytes        |         151219 |          151339 |        120 |  0.079% |
| index.js minBytes        |         123218 |          123281 |         63 |  0.051% |
| index.js gzipBytes       |          44257 |           44271 |         14 |  0.032% |
| index.js brotliBytes     |          36367 |           36532 |        165 |  0.454% |
| index.cjs rawBytes       |         151372 |          151492 |        120 |  0.079% |
| index.cjs minBytes       |         124521 |          124584 |         63 |  0.051% |
| index.cjs gzipBytes      |          44409 |           44424 |         15 |  0.034% |
| index.cjs brotliBytes    |          36527 |           36688 |        161 |  0.441% |
| distribution rawBytes    |        1060967 |         1059619 |      -1348 | -0.127% |

Glue SHA-256: `a372b9cc078ccd067d982eb0428972d64207b51e118fbba7a3d6e5a62b9f85a4`.

## Live allocation

Median bytes per instance over three runs of 10,000 simultaneously live Projections. The instance container is allocated before sampling. Native bytes are allocator deltas, excluding unused reserved Wasm capacity. JS heap deltas follow explicit JS process garbage collection. Small JS differences are not treated as proven representation changes. Collector setup/population durations are not API acceptance timings.

| Shape     | Build             | Native bytes | JS heap bytes |
| :-------- | :---------------- | -----------: | ------------: |
| empty     | baseline          |       262.56 |        202.56 |
| empty     | coalesce          |       262.56 |        202.56 |
| empty     | zero              |       262.56 |        202.56 |
| empty     | zero-call         |       262.56 |        202.56 |
| empty     | reserve           |       262.56 |        202.56 |
| empty     | late-reserve      |       262.56 |        202.42 |
| empty     | input-cache       |       262.56 |        202.56 |
| empty     | rounded           |       262.56 |        202.56 |
| empty     | denser            |       262.56 |        202.56 |
| empty     | arena-owner       |       254.55 |        202.56 |
| empty     | entry-payload     |       262.56 |        202.43 |
| empty     | hydration-call    |       254.55 |        202.56 |
| empty     | dispatch-cap      |       254.55 |        202.56 |
| empty     | positive-frontier |       262.56 |        202.56 |
| empty     | frontier-overlap  |       262.56 |        202.56 |
| empty     | fixed-table       |       254.55 |        202.56 |
| single    | baseline          |       542.56 |        402.43 |
| single    | coalesce          |       542.56 |        405.72 |
| single    | zero              |       542.56 |        402.33 |
| single    | zero-call         |       542.56 |        402.43 |
| single    | reserve           |       542.56 |        402.33 |
| single    | late-reserve      |       542.56 |        402.43 |
| single    | input-cache       |       542.56 |        402.43 |
| single    | rounded           |       542.56 |        402.33 |
| single    | denser            |       542.56 |        402.43 |
| single    | arena-owner       |       534.55 |        402.43 |
| single    | entry-payload     |       542.56 |        402.43 |
| single    | hydration-call    |       534.55 |        402.43 |
| single    | dispatch-cap      |       534.55 |        402.33 |
| single    | positive-frontier |       542.56 |        402.43 |
| single    | frontier-overlap  |       542.56 |        402.33 |
| single    | fixed-table       |       534.55 |        402.33 |
| sequence8 | baseline          |       542.56 |        378.20 |
| sequence8 | coalesce          |       542.56 |        378.20 |
| sequence8 | zero              |       542.56 |        378.29 |
| sequence8 | zero-call         |       542.56 |        378.20 |
| sequence8 | reserve           |       542.56 |        378.29 |
| sequence8 | late-reserve      |       542.56 |        378.20 |
| sequence8 | input-cache       |       542.56 |        378.20 |
| sequence8 | rounded           |       542.56 |        378.29 |
| sequence8 | denser            |       542.56 |        378.29 |
| sequence8 | arena-owner       |       534.55 |        378.20 |
| sequence8 | entry-payload     |       542.56 |        378.20 |
| sequence8 | hydration-call    |       534.55 |        378.20 |
| sequence8 | dispatch-cap      |       534.55 |        378.29 |
| sequence8 | positive-frontier |       542.56 |        378.20 |
| sequence8 | frontier-overlap  |       542.56 |        378.29 |
| sequence8 | fixed-table       |       534.55 |        378.29 |
| tuple8    | baseline          |      1070.61 |        380.74 |
| tuple8    | coalesce          |      1070.61 |        380.73 |
| tuple8    | zero              |      1070.61 |        380.73 |
| tuple8    | zero-call         |      1070.61 |        380.74 |
| tuple8    | reserve           |      1070.61 |        380.73 |
| tuple8    | late-reserve      |      1070.61 |        380.74 |
| tuple8    | input-cache       |      1070.61 |        380.74 |
| tuple8    | rounded           |      1070.61 |        380.73 |
| tuple8    | denser            |      1070.61 |        380.16 |
| tuple8    | arena-owner       |      1070.55 |        380.74 |
| tuple8    | entry-payload     |      1074.57 |        380.73 |
| tuple8    | hydration-call    |      1070.55 |        380.74 |
| tuple8    | dispatch-cap      |      1070.55 |        380.74 |
| tuple8    | positive-frontier |      1070.61 |        380.73 |
| tuple8    | frontier-overlap  |      1070.61 |        380.73 |
| tuple8    | fixed-table       |      1054.61 |        380.73 |
| edited8   | baseline          |      3514.38 |        913.00 |
| edited8   | coalesce          |      3514.38 |        908.92 |
| edited8   | zero              |      3514.38 |        913.01 |
| edited8   | zero-call         |      3514.38 |        913.00 |
| edited8   | reserve           |      3515.28 |        913.02 |
| edited8   | late-reserve      |      3514.86 |        908.93 |
| edited8   | input-cache       |      3515.28 |        913.30 |
| edited8   | rounded           |      3515.28 |        913.02 |
| edited8   | denser            |      3515.28 |        909.08 |
| edited8   | arena-owner       |      3506.82 |        908.92 |
| edited8   | entry-payload     |      3513.75 |        914.86 |
| edited8   | hydration-call    |      3506.82 |        908.93 |
| edited8   | dispatch-cap      |      3506.82 |        908.93 |
| edited8   | positive-frontier |      3514.38 |        913.00 |
| edited8   | frontier-overlap  |      3514.38 |        913.00 |
| edited8   | fixed-table       |      3505.26 |        913.02 |
