# Large string benchmarks

2026-11-20T20:39:46.144Z · [CI run](https://github.com/sovereignbase/sequencer/actions/runs/44812418849)

3 runs; times are median ns/call. IQR is Q3 minus Q1.

| UTF-16 code units | Operation | Representation | Median ns | IQR ns |
| ---: | --- | --- | ---: | ---: |
| 1024 | insert | array | 1268.78 | 80.01 |
| 1024 | insert.append | array | 12473.44 | 2637.48 |
| 1024 | replace | array | 3752.72 | 135.08 |
| 1024 | remove | array | 2392.53 | 139.78 |
| 1024 | remove.middle | array | 1480.23 | 154.72 |
| 1024 | replace.middle | array | 1644.28 | 101.76 |
| 1024 | apply | array | 737.90 | 73.49 |
| 1024 | apply.array | array | 447.32 | 21.60 |
| 1024 | concurrent.apply | array | 33023.14 | 5652.44 |
| 1024 | merge | array | 1916.18 | 212.88 |
| 1024 | create | array | 1973.13 | 218.61 |
| 1024 | value.random | array | 31.45 | 5.67 |
| 1024 | values.range | array | 79.74 | 15.79 |
| 1024 | values.array | array | 775.04 | 228.35 |
| 1024 | values.text | array | 6987.68 | 108.85 |
| 1024 | sequence.array | array | 955.80 | 250.71 |
| 1024 | sequence.text | array | 5190.75 | 138.92 |
| 1024 | sequence.edited.text | array | 8099.03 | 525.25 |
| 1024 | sequence.masked.text | array | 6436.51 | 241.59 |
| 1024 | insert | string | 327.99 | 41.01 |
| 1024 | insert.append | string | 2217.11 | 179.85 |
| 1024 | replace | string | 1158.45 | 86.90 |
| 1024 | remove | string | 745.74 | 16.52 |
| 1024 | remove.middle | string | 741.64 | 16.51 |
| 1024 | replace.middle | string | 997.31 | 30.33 |
| 1024 | apply | string | 621.76 | 95.08 |
| 1024 | apply.array | string | 1508.41 | 140.32 |
| 1024 | concurrent.apply | string | 2358.15 | 12.40 |
| 1024 | merge | string | 857.99 | 36.25 |
| 1024 | create | string | 859.81 | 47.83 |
| 1024 | value.random | string | 36.00 | 4.53 |
| 1024 | values.range | string | 94.17 | 4.96 |
| 1024 | values.array | string | 962.73 | 61.39 |
| 1024 | values.text | string | 49.94 | 6.41 |
| 1024 | sequence.array | string | 1232.46 | 100.25 |
| 1024 | sequence.text | string | 121.41 | 5.84 |
| 1024 | sequence.edited.text | string | 1591.08 | 243.04 |
| 1024 | sequence.masked.text | string | 2599.80 | 56.68 |
| 65536 | insert | array | 244070.04 | 17351.88 |
| 65536 | insert.append | array | 1039171.04 | 15757.47 |
| 65536 | replace | array | 665709.58 | 38461.77 |
| 65536 | remove | array | 362641.68 | 29062.53 |
| 65536 | remove.middle | array | 292923.15 | 25182.96 |
| 65536 | replace.middle | array | 294804.25 | 11425.52 |
| 65536 | apply | array | 789.49 | 107.46 |
| 65536 | apply.array | array | 479.20 | 20.26 |
| 65536 | concurrent.apply | array | 2783032.56 | 11085.56 |
| 65536 | merge | array | 263804.27 | 51458.61 |
| 65536 | create | array | 230886.04 | 10181.97 |
| 65536 | value.random | array | 31.13 | 5.06 |
| 65536 | values.range | array | 83.24 | 51.78 |
| 65536 | values.array | array | 227496.50 | 10322.91 |
| 65536 | values.text | array | 580393.07 | 1937.64 |
| 65536 | sequence.array | array | 225512.62 | 10142.11 |
| 65536 | sequence.text | array | 329150.58 | 51893.36 |
| 65536 | sequence.edited.text | array | 475741.96 | 177676.79 |
| 65536 | sequence.masked.text | array | 339989.92 | 52476.70 |
| 65536 | insert | string | 304.07 | 19.87 |
| 65536 | insert.append | string | 8549.28 | 340.17 |
| 65536 | replace | string | 1089.10 | 17.58 |
| 65536 | remove | string | 745.61 | 29.11 |
| 65536 | remove.middle | string | 710.52 | 31.00 |
| 65536 | replace.middle | string | 975.41 | 13.63 |
| 65536 | apply | string | 613.72 | 18.86 |
| 65536 | apply.array | string | 230592.39 | 3692.02 |
| 65536 | concurrent.apply | string | 107059.05 | 1571.62 |
| 65536 | merge | string | 873.24 | 39.60 |
| 65536 | create | string | 878.30 | 50.34 |
| 65536 | value.random | string | 42.39 | 3.89 |
| 65536 | values.range | string | 133.09 | 21.88 |
| 65536 | values.array | string | 231587.94 | 5391.21 |
| 65536 | values.text | string | 44.13 | 5.62 |
| 65536 | sequence.array | string | 230001.52 | 810.56 |
| 65536 | sequence.text | string | 120.22 | 7.57 |
| 65536 | sequence.edited.text | string | 61419.22 | 112.09 |
| 65536 | sequence.masked.text | string | 2392.23 | 66.63 |
| 1048576 | insert | array | 3990092.75 | 124952.13 |
| 1048576 | insert.append | array | 23286270.00 | 411899.00 |
| 1048576 | replace | array | 9264589.67 | 164620.83 |
| 1048576 | remove | array | 5045078.20 | 150900.90 |
| 1048576 | remove.middle | array | 3888774.43 | 93756.14 |
| 1048576 | replace.middle | array | 3961039.86 | 115573.50 |
| 1048576 | apply | array | 824.49 | 26.32 |
| 1048576 | apply.array | array | 506.88 | 55.88 |
| 1048576 | concurrent.apply | array | 47934295.00 | 817383.00 |
| 1048576 | merge | array | 3893852.00 | 62455.81 |
| 1048576 | create | array | 3853348.38 | 31722.00 |
| 1048576 | value.random | array | 28.96 | 4.22 |
| 1048576 | values.range | array | 71.82 | 6.57 |
| 1048576 | values.array | array | 3885761.43 | 165252.79 |
| 1048576 | values.text | array | 9536509.00 | 42371.83 |
| 1048576 | sequence.array | array | 4011850.43 | 123810.50 |
| 1048576 | sequence.text | array | 31460100.50 | 5133595.00 |
| 1048576 | sequence.edited.text | array | 36875718.00 | 4610663.25 |
| 1048576 | sequence.masked.text | array | 32405738.50 | 5539057.50 |
| 1048576 | insert | string | 367.28 | 37.27 |
| 1048576 | insert.append | string | 455604.00 | 19267.74 |
| 1048576 | replace | string | 1204.43 | 45.50 |
| 1048576 | remove | string | 848.78 | 43.65 |
| 1048576 | remove.middle | string | 781.91 | 37.50 |
| 1048576 | replace.middle | string | 1049.58 | 12.56 |
| 1048576 | apply | string | 675.67 | 97.76 |
| 1048576 | apply.array | string | 3623403.71 | 65668.00 |
| 1048576 | concurrent.apply | string | 1830037.75 | 71133.63 |
| 1048576 | merge | string | 907.53 | 49.29 |
| 1048576 | create | string | 865.22 | 16.48 |
| 1048576 | value.random | string | 36.64 | 3.54 |
| 1048576 | values.range | string | 96.89 | 3.39 |
| 1048576 | values.array | string | 3983693.75 | 646824.02 |
| 1048576 | values.text | string | 50.32 | 4.13 |
| 1048576 | sequence.array | string | 3989483.25 | 249546.17 |
| 1048576 | sequence.text | string | 107.54 | 6.06 |
| 1048576 | sequence.edited.text | string | 979656.88 | 3614.02 |
| 1048576 | sequence.masked.text | string | 2357.56 | 38.63 |

Encoded snapshots use string Footage in both representations.

## Estimated retained memory and snapshot size

| UTF-16 code units | Representation | Estimated MiB | Snapshot MessagePack KiB | Snapshot gzip KiB | Gossip MessagePack KiB | Gossip gzip KiB |
| ---: | --- | ---: | ---: | ---: | ---: | ---: |
| 1024 | array | 0.0082 | 1.02 | 0.05 | 2.02 | 0.05 |
| 1024 | string | 0.0023 | 1.02 | 0.05 | 1.02 | 0.05 |
| 65536 | array | 0.5004 | 64.02 | 0.12 | 128.02 | 0.18 |
| 65536 | string | 0.1254 | 64.02 | 0.12 | 64.02 | 0.12 |
| 1048576 | array | 8.0004 | 1024.02 | 1.05 | 2048.02 | 2.05 |
| 1048576 | string | 2.0004 | 1024.02 | 1.05 | 1024.02 | 1.05 |

Measured on Node 24.22.3, V8 13.6.233.17-node.63, linux x64, AMD EPYC 9V74 80-Core Processor. Splitting and text assembly are included where required; peer preparation, encoding and explicit JS process garbage collection are outside API timings.
