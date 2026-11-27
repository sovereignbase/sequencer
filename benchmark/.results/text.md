# Large string benchmarks

2026-11-27T21:42:29.926Z · local run

5 runs; times are median ns/call. IQR is Q3 minus Q1.

| UTF-16 code units | Operation | Representation | Median ns | IQR ns |
| ---: | --- | --- | ---: | ---: |
| 1024 | insert | array | 2175.84 | 583.14 |
| 1024 | insert.append | array | 12868.35 | 196.25 |
| 1024 | replace | array | 3138.98 | 142.78 |
| 1024 | remove | array | 1050.31 | 167.24 |
| 1024 | remove.middle | array | 2038.84 | 100.52 |
| 1024 | replace.middle | array | 2446.68 | 168.32 |
| 1024 | apply | array | 986.24 | 220.20 |
| 1024 | apply.array | array | 627.32 | 107.56 |
| 1024 | concurrent.apply | array | 64054.22 | 13827.29 |
| 1024 | merge | array | 3115.04 | 185.09 |
| 1024 | create | array | 3068.15 | 133.94 |
| 1024 | value.random | array | 45.70 | 3.73 |
| 1024 | values.range | array | 137.67 | 34.54 |
| 1024 | values.array | array | 1393.59 | 179.56 |
| 1024 | values.text | array | 13513.58 | 759.35 |
| 1024 | sequence.array | array | 1783.91 | 419.30 |
| 1024 | sequence.text | array | 10049.04 | 787.95 |
| 1024 | sequence.edited.text | array | 10012.17 | 743.23 |
| 1024 | sequence.masked.text | array | 11374.61 | 511.55 |
| 1024 | insert | string | 485.18 | 113.60 |
| 1024 | insert.append | string | 4473.93 | 193.54 |
| 1024 | replace | string | 1249.63 | 182.08 |
| 1024 | remove | string | 959.07 | 53.06 |
| 1024 | remove.middle | string | 1015.82 | 86.67 |
| 1024 | replace.middle | string | 1368.53 | 66.26 |
| 1024 | apply | string | 876.60 | 258.47 |
| 1024 | apply.array | string | 2428.33 | 206.63 |
| 1024 | concurrent.apply | string | 3863.78 | 265.23 |
| 1024 | merge | string | 1375.15 | 48.63 |
| 1024 | create | string | 1016.02 | 32.30 |
| 1024 | value.random | string | 69.21 | 17.24 |
| 1024 | values.range | string | 161.51 | 28.81 |
| 1024 | values.array | string | 1777.14 | 161.18 |
| 1024 | values.text | string | 70.00 | 18.69 |
| 1024 | sequence.array | string | 2055.88 | 231.99 |
| 1024 | sequence.text | string | 181.23 | 31.10 |
| 1024 | sequence.edited.text | string | 711.71 | 57.13 |
| 1024 | sequence.masked.text | string | 3502.57 | 1100.55 |
| 65536 | insert | array | 238585.71 | 21792.26 |
| 65536 | insert.append | array | 1063844.00 | 9012.00 |
| 65536 | replace | array | 255994.90 | 19462.75 |
| 65536 | remove | array | 2512.82 | 645.18 |
| 65536 | remove.middle | array | 230771.56 | 2826.94 |
| 65536 | replace.middle | array | 234684.40 | 36536.10 |
| 65536 | apply | array | 1170.98 | 827.40 |
| 65536 | apply.array | array | 719.46 | 200.83 |
| 65536 | concurrent.apply | array | 4274616.67 | 672571.43 |
| 65536 | merge | array | 214840.17 | 16878.43 |
| 65536 | create | array | 206870.25 | 8469.84 |
| 65536 | value.random | array | 52.66 | 32.05 |
| 65536 | values.range | array | 160.91 | 33.06 |
| 65536 | values.array | array | 223659.82 | 21248.41 |
| 65536 | values.text | array | 825448.39 | 59051.39 |
| 65536 | sequence.array | array | 204085.71 | 8565.87 |
| 65536 | sequence.text | array | 726537.14 | 193948.33 |
| 65536 | sequence.edited.text | array | 736785.29 | 37191.34 |
| 65536 | sequence.masked.text | array | 762712.12 | 104072.24 |
| 65536 | insert | string | 407.93 | 164.29 |
| 65536 | insert.append | string | 21224.28 | 557.00 |
| 65536 | replace | string | 1368.69 | 666.37 |
| 65536 | remove | string | 1083.83 | 422.35 |
| 65536 | remove.middle | string | 1024.46 | 334.34 |
| 65536 | replace.middle | string | 1343.25 | 136.80 |
| 65536 | apply | string | 857.78 | 411.63 |
| 65536 | apply.array | string | 252434.37 | 9141.41 |
| 65536 | concurrent.apply | string | 137298.36 | 6184.83 |
| 65536 | merge | string | 1080.00 | 536.87 |
| 65536 | create | string | 986.95 | 138.59 |
| 65536 | value.random | string | 60.72 | 4.48 |
| 65536 | values.range | string | 147.44 | 25.31 |
| 65536 | values.array | string | 260229.69 | 28915.63 |
| 65536 | values.text | string | 68.49 | 27.03 |
| 65536 | sequence.array | string | 249192.19 | 3373.44 |
| 65536 | sequence.text | string | 223.86 | 145.91 |
| 65536 | sequence.edited.text | string | 6361.21 | 179.06 |
| 65536 | sequence.masked.text | string | 3338.81 | 88.72 |
| 1048576 | insert | array | 3406937.50 | 523700.00 |
| 1048576 | insert.append | array | 21331000.00 | 3872800.00 |
| 1048576 | replace | array | 3398762.50 | 605591.07 |
| 1048576 | remove | array | 13699.18 | 1693.47 |
| 1048576 | remove.middle | array | 3306822.22 | 2024479.17 |
| 1048576 | replace.middle | array | 3240566.67 | 750680.00 |
| 1048576 | apply | array | 1194.60 | 357.74 |
| 1048576 | apply.array | array | 668.13 | 213.53 |
| 1048576 | concurrent.apply | array | 69994400.00 | 8667900.00 |
| 1048576 | merge | array | 3199412.50 | 65362.50 |
| 1048576 | create | array | 3246637.50 | 268790.28 |
| 1048576 | value.random | array | 61.11 | 13.73 |
| 1048576 | values.range | array | 125.90 | 21.31 |
| 1048576 | values.array | array | 2590700.00 | 486787.88 |
| 1048576 | values.text | array | 12949600.00 | 850350.00 |
| 1048576 | sequence.array | array | 2201816.67 | 223468.18 |
| 1048576 | sequence.text | array | 60776950.00 | 28451950.00 |
| 1048576 | sequence.edited.text | array | 50852300.00 | 5402350.00 |
| 1048576 | sequence.masked.text | array | 49894450.00 | 20407150.00 |
| 1048576 | insert | string | 512.16 | 69.89 |
| 1048576 | insert.append | string | 641079.49 | 140235.87 |
| 1048576 | replace | string | 1794.36 | 348.41 |
| 1048576 | remove | string | 1637.51 | 577.29 |
| 1048576 | remove.middle | string | 1176.28 | 300.26 |
| 1048576 | replace.middle | string | 1634.05 | 394.03 |
| 1048576 | apply | string | 1049.17 | 398.52 |
| 1048576 | apply.array | string | 3526762.50 | 488425.00 |
| 1048576 | concurrent.apply | string | 1402866.67 | 429530.59 |
| 1048576 | merge | string | 1360.08 | 170.69 |
| 1048576 | create | string | 1005.09 | 374.15 |
| 1048576 | value.random | string | 54.20 | 32.07 |
| 1048576 | values.range | string | 149.57 | 19.31 |
| 1048576 | values.array | string | 3160212.50 | 159648.61 |
| 1048576 | values.text | string | 65.47 | 1.68 |
| 1048576 | sequence.array | string | 3270075.00 | 88125.00 |
| 1048576 | sequence.text | string | 204.87 | 139.35 |
| 1048576 | sequence.edited.text | string | 95366.54 | 11532.71 |
| 1048576 | sequence.masked.text | string | 3377.37 | 695.72 |

Encoded snapshots use string Footage in both representations.

## Estimated retained memory and snapshot size

| UTF-16 code units | Representation | Estimated MiB | Snapshot MessagePack KiB | Snapshot gzip KiB | Gossip MessagePack KiB | Gossip gzip KiB |
| ---: | --- | ---: | ---: | ---: | ---: | ---: |
| 1024 | array | 0.0082 | 1.02 | 0.04 | 2.02 | 0.05 |
| 1024 | string | 0.0023 | 1.02 | 0.04 | 1.02 | 0.05 |
| 65536 | array | 0.5004 | 64.02 | 0.12 | 128.02 | 0.18 |
| 65536 | string | 0.1254 | 64.02 | 0.12 | 64.02 | 0.12 |
| 1048576 | array | 8.0004 | 1024.02 | 1.05 | 2048.02 | 2.05 |
| 1048576 | string | 2.0004 | 1024.02 | 1.05 | 1024.02 | 1.05 |

Measured on Node 24.16.0, V8 13.6.233.17-node.49, win32 x64, Intel(R) Core(TM) i5-10210U CPU @ 1.60GHz. Splitting and text assembly are included where required; peer preparation, encoding and explicit JS process garbage collection are outside API timings.
