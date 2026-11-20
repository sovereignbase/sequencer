# Large string benchmarks

2026-11-20T20:30:14.425Z · [CI run](https://github.com/sovereignbase/sequencer/actions/runs/44811048570)

3 runs; times are median ns/call. IQR is Q3 minus Q1.

| UTF-16 code units | Operation | Representation | Median ns | IQR ns |
| ---: | --- | --- | ---: | ---: |
| 1024 | insert | array | 1062.90 | 24.70 |
| 1024 | insert.append | array | 9281.05 | 1569.78 |
| 1024 | replace | array | 3256.44 | 257.06 |
| 1024 | remove | array | 2154.63 | 318.20 |
| 1024 | remove.middle | array | 1210.53 | 138.49 |
| 1024 | replace.middle | array | 1444.77 | 242.33 |
| 1024 | apply | array | 451.16 | 42.78 |
| 1024 | apply.array | array | 308.60 | 34.38 |
| 1024 | concurrent.apply | array | 32371.12 | 1014.59 |
| 1024 | merge | array | 1340.57 | 154.55 |
| 1024 | create | array | 1434.78 | 120.76 |
| 1024 | value.random | array | 33.18 | 4.64 |
| 1024 | values.range | array | 79.37 | 13.15 |
| 1024 | values.array | array | 592.10 | 90.92 |
| 1024 | values.text | array | 6687.19 | 369.89 |
| 1024 | sequence.array | array | 667.75 | 96.89 |
| 1024 | sequence.text | array | 4083.86 | 192.57 |
| 1024 | sequence.edited.text | array | 6380.88 | 118.58 |
| 1024 | sequence.masked.text | array | 5438.60 | 221.89 |
| 1024 | insert | string | 214.60 | 19.71 |
| 1024 | insert.append | string | 2049.70 | 73.70 |
| 1024 | replace | string | 874.62 | 35.99 |
| 1024 | remove | string | 515.38 | 7.53 |
| 1024 | remove.middle | string | 569.48 | 9.62 |
| 1024 | replace.middle | string | 741.71 | 15.31 |
| 1024 | apply | string | 443.69 | 59.48 |
| 1024 | apply.array | string | 1031.14 | 15.66 |
| 1024 | concurrent.apply | string | 1747.43 | 168.10 |
| 1024 | merge | string | 634.75 | 66.74 |
| 1024 | create | string | 732.84 | 20.36 |
| 1024 | value.random | string | 34.81 | 6.28 |
| 1024 | values.range | string | 94.13 | 11.10 |
| 1024 | values.array | string | 744.91 | 58.36 |
| 1024 | values.text | string | 54.74 | 12.86 |
| 1024 | sequence.array | string | 851.27 | 122.32 |
| 1024 | sequence.text | string | 100.86 | 3.12 |
| 1024 | sequence.edited.text | string | 1221.52 | 6.95 |
| 1024 | sequence.masked.text | string | 2332.95 | 27.04 |
| 65536 | insert | array | 195722.27 | 17462.49 |
| 65536 | insert.append | array | 840395.77 | 64628.19 |
| 65536 | replace | array | 460698.13 | 36033.57 |
| 65536 | remove | array | 240387.70 | 12063.19 |
| 65536 | remove.middle | array | 180301.58 | 6393.11 |
| 65536 | replace.middle | array | 178597.02 | 10187.56 |
| 65536 | apply | array | 564.14 | 18.50 |
| 65536 | apply.array | array | 327.36 | 10.20 |
| 65536 | concurrent.apply | array | 2440649.64 | 25576.82 |
| 65536 | merge | array | 191905.37 | 6396.42 |
| 65536 | create | array | 191683.73 | 15026.49 |
| 65536 | value.random | array | 33.59 | 6.34 |
| 65536 | values.range | array | 86.49 | 16.46 |
| 65536 | values.array | array | 200612.28 | 1519.27 |
| 65536 | values.text | array | 512984.22 | 4617.59 |
| 65536 | sequence.array | array | 196168.80 | 1414.50 |
| 65536 | sequence.text | array | 283476.36 | 52984.42 |
| 65536 | sequence.edited.text | array | 423281.31 | 109536.22 |
| 65536 | sequence.masked.text | array | 275312.54 | 51062.99 |
| 65536 | insert | string | 261.90 | 9.53 |
| 65536 | insert.append | string | 6808.31 | 483.55 |
| 65536 | replace | string | 848.34 | 71.39 |
| 65536 | remove | string | 532.98 | 42.43 |
| 65536 | remove.middle | string | 552.45 | 49.50 |
| 65536 | replace.middle | string | 757.72 | 21.33 |
| 65536 | apply | string | 495.93 | 54.67 |
| 65536 | apply.array | string | 205014.50 | 1444.66 |
| 65536 | concurrent.apply | string | 108846.61 | 4820.38 |
| 65536 | merge | string | 621.41 | 30.00 |
| 65536 | create | string | 713.88 | 63.88 |
| 65536 | value.random | string | 41.72 | 1.15 |
| 65536 | values.range | string | 91.87 | 3.94 |
| 65536 | values.array | string | 201151.85 | 3459.47 |
| 65536 | values.text | string | 42.37 | 6.83 |
| 65536 | sequence.array | string | 199545.84 | 1678.43 |
| 65536 | sequence.text | string | 95.65 | 2.21 |
| 65536 | sequence.edited.text | string | 52612.04 | 285.57 |
| 65536 | sequence.masked.text | string | 2340.57 | 59.37 |
| 1048576 | insert | array | 3326402.13 | 32164.31 |
| 1048576 | insert.append | array | 19613240.00 | 999515.00 |
| 1048576 | replace | array | 7485960.25 | 211118.88 |
| 1048576 | remove | array | 4166890.00 | 218496.46 |
| 1048576 | remove.middle | array | 3423912.13 | 306733.19 |
| 1048576 | replace.middle | array | 3598272.57 | 251923.47 |
| 1048576 | apply | array | 560.81 | 28.17 |
| 1048576 | apply.array | array | 314.24 | 26.98 |
| 1048576 | concurrent.apply | array | 57408878.00 | 1710377.00 |
| 1048576 | merge | array | 3216335.00 | 183321.85 |
| 1048576 | create | array | 2916325.67 | 115129.76 |
| 1048576 | value.random | array | 41.73 | 10.15 |
| 1048576 | values.range | array | 61.74 | 12.22 |
| 1048576 | values.array | array | 3387788.38 | 85106.00 |
| 1048576 | values.text | array | 8373181.50 | 144372.08 |
| 1048576 | sequence.array | array | 3366331.62 | 354828.43 |
| 1048576 | sequence.text | array | 28881598.00 | 7450182.75 |
| 1048576 | sequence.edited.text | array | 32108368.00 | 389865.75 |
| 1048576 | sequence.masked.text | array | 28517951.50 | 170681.00 |
| 1048576 | insert | string | 269.27 | 26.75 |
| 1048576 | insert.append | string | 425952.66 | 3543.04 |
| 1048576 | replace | string | 922.85 | 68.27 |
| 1048576 | remove | string | 627.20 | 35.98 |
| 1048576 | remove.middle | string | 604.91 | 5.90 |
| 1048576 | replace.middle | string | 837.33 | 24.53 |
| 1048576 | apply | string | 587.57 | 71.03 |
| 1048576 | apply.array | string | 3362998.50 | 13760.69 |
| 1048576 | concurrent.apply | string | 1639920.44 | 16614.66 |
| 1048576 | merge | string | 671.47 | 23.94 |
| 1048576 | create | string | 644.84 | 32.63 |
| 1048576 | value.random | string | 41.76 | 4.01 |
| 1048576 | values.range | string | 92.67 | 2.69 |
| 1048576 | values.array | string | 3210497.00 | 33555.25 |
| 1048576 | values.text | string | 53.57 | 8.39 |
| 1048576 | sequence.array | string | 3135055.00 | 19659.88 |
| 1048576 | sequence.text | string | 101.24 | 6.03 |
| 1048576 | sequence.edited.text | string | 913430.54 | 1271.21 |
| 1048576 | sequence.masked.text | string | 2385.90 | 96.14 |

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

Measured on Node 24.22.3, V8 13.6.233.17-node.63, linux x64, Intel(R) Xeon(R) 6975P-C. Splitting and text assembly are included where required; peer preparation, encoding and explicit JS process garbage collection are outside API timings.
