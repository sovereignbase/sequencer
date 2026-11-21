# Large string benchmarks

2026-11-21T14:21:01.763Z · [CI run](https://github.com/sovereignbase/sequencer/actions/runs/44912963007)

3 runs; times are median ns/call. IQR is Q3 minus Q1.

| UTF-16 code units | Operation | Representation | Median ns | IQR ns |
| ---: | --- | --- | ---: | ---: |
| 1024 | insert | array | 977.10 | 117.94 |
| 1024 | insert.append | array | 10736.67 | 2714.98 |
| 1024 | replace | array | 2835.34 | 223.98 |
| 1024 | remove | array | 1995.90 | 58.80 |
| 1024 | remove.middle | array | 1061.09 | 76.78 |
| 1024 | replace.middle | array | 1250.82 | 94.71 |
| 1024 | apply | array | 557.60 | 24.64 |
| 1024 | apply.array | array | 396.34 | 39.36 |
| 1024 | concurrent.apply | array | 23811.50 | 840.77 |
| 1024 | merge | array | 1399.88 | 149.86 |
| 1024 | create | array | 1527.67 | 133.20 |
| 1024 | value.random | array | 34.33 | 6.19 |
| 1024 | values.range | array | 59.30 | 2.88 |
| 1024 | values.array | array | 380.47 | 93.58 |
| 1024 | values.text | array | 4856.59 | 115.10 |
| 1024 | sequence.array | array | 587.23 | 103.33 |
| 1024 | sequence.text | array | 4046.71 | 173.82 |
| 1024 | sequence.edited.text | array | 5951.40 | 181.09 |
| 1024 | sequence.masked.text | array | 4941.77 | 74.52 |
| 1024 | insert | string | 254.35 | 33.41 |
| 1024 | insert.append | string | 1873.84 | 183.57 |
| 1024 | replace | string | 854.25 | 34.78 |
| 1024 | remove | string | 573.12 | 8.73 |
| 1024 | remove.middle | string | 607.36 | 10.88 |
| 1024 | replace.middle | string | 1004.34 | 126.56 |
| 1024 | apply | string | 580.95 | 93.03 |
| 1024 | apply.array | string | 1057.73 | 254.23 |
| 1024 | concurrent.apply | string | 1894.03 | 94.32 |
| 1024 | merge | string | 723.23 | 19.47 |
| 1024 | create | string | 774.49 | 31.87 |
| 1024 | value.random | string | 38.87 | 8.14 |
| 1024 | values.range | string | 70.23 | 15.70 |
| 1024 | values.array | string | 577.72 | 1.97 |
| 1024 | values.text | string | 35.54 | 1.42 |
| 1024 | sequence.array | string | 639.88 | 81.07 |
| 1024 | sequence.text | string | 114.00 | 18.28 |
| 1024 | sequence.edited.text | string | 1217.57 | 66.67 |
| 1024 | sequence.masked.text | string | 1863.76 | 65.91 |
| 65536 | insert | array | 209374.37 | 19459.97 |
| 65536 | insert.append | array | 844707.97 | 4703.55 |
| 65536 | replace | array | 547885.65 | 31822.26 |
| 65536 | remove | array | 293116.86 | 18516.56 |
| 65536 | remove.middle | array | 233646.01 | 7352.29 |
| 65536 | replace.middle | array | 234689.14 | 7422.80 |
| 65536 | apply | array | 637.77 | 36.34 |
| 65536 | apply.array | array | 378.35 | 21.58 |
| 65536 | concurrent.apply | array | 2053921.38 | 49845.66 |
| 65536 | merge | array | 221543.26 | 16887.93 |
| 65536 | create | array | 222963.18 | 16471.57 |
| 65536 | value.random | array | 29.08 | 3.77 |
| 65536 | values.range | array | 50.39 | 28.34 |
| 65536 | values.array | array | 221258.56 | 3870.66 |
| 65536 | values.text | array | 430572.24 | 11748.35 |
| 65536 | sequence.array | array | 226303.77 | 31884.97 |
| 65536 | sequence.text | array | 272922.49 | 52773.25 |
| 65536 | sequence.edited.text | array | 392734.14 | 115104.53 |
| 65536 | sequence.masked.text | array | 250227.72 | 65507.00 |
| 65536 | insert | string | 244.02 | 9.28 |
| 65536 | insert.append | string | 6268.67 | 394.53 |
| 65536 | replace | string | 897.71 | 31.35 |
| 65536 | remove | string | 623.90 | 20.05 |
| 65536 | remove.middle | string | 627.91 | 12.11 |
| 65536 | replace.middle | string | 809.21 | 17.09 |
| 65536 | apply | string | 460.64 | 28.81 |
| 65536 | apply.array | string | 236549.06 | 20027.12 |
| 65536 | concurrent.apply | string | 122777.36 | 23208.90 |
| 65536 | merge | string | 698.24 | 43.15 |
| 65536 | create | string | 766.30 | 8.01 |
| 65536 | value.random | string | 26.18 | 4.58 |
| 65536 | values.range | string | 69.28 | 3.06 |
| 65536 | values.array | string | 236373.09 | 20818.86 |
| 65536 | values.text | string | 35.79 | 2.80 |
| 65536 | sequence.array | string | 232478.18 | 56837.46 |
| 65536 | sequence.text | string | 85.60 | 10.05 |
| 65536 | sequence.edited.text | string | 50734.77 | 444.21 |
| 65536 | sequence.masked.text | string | 1836.46 | 109.58 |
| 1048576 | insert | array | 3584607.88 | 45530.69 |
| 1048576 | insert.append | array | 19009334.00 | 248648.25 |
| 1048576 | replace | array | 7441058.25 | 71648.12 |
| 1048576 | remove | array | 4174674.50 | 124345.05 |
| 1048576 | remove.middle | array | 3291993.63 | 49789.37 |
| 1048576 | replace.middle | array | 3298724.87 | 32496.63 |
| 1048576 | apply | array | 637.08 | 9.66 |
| 1048576 | apply.array | array | 381.11 | 10.48 |
| 1048576 | concurrent.apply | array | 35562691.00 | 1219681.00 |
| 1048576 | merge | array | 3431008.63 | 29219.13 |
| 1048576 | create | array | 3419930.63 | 54363.25 |
| 1048576 | value.random | array | 20.97 | 2.70 |
| 1048576 | values.range | array | 49.91 | 5.02 |
| 1048576 | values.array | array | 3204258.63 | 92637.13 |
| 1048576 | values.text | array | 6980115.25 | 197863.88 |
| 1048576 | sequence.array | array | 3233735.50 | 26433.62 |
| 1048576 | sequence.text | array | 23530583.50 | 2110920.50 |
| 1048576 | sequence.edited.text | array | 22406700.00 | 281203.25 |
| 1048576 | sequence.masked.text | array | 20563817.50 | 903934.00 |
| 1048576 | insert | string | 301.32 | 28.87 |
| 1048576 | insert.append | string | 450707.47 | 67264.11 |
| 1048576 | replace | string | 928.27 | 35.35 |
| 1048576 | remove | string | 662.42 | 35.09 |
| 1048576 | remove.middle | string | 664.34 | 45.03 |
| 1048576 | replace.middle | string | 837.77 | 16.43 |
| 1048576 | apply | string | 663.82 | 61.42 |
| 1048576 | apply.array | string | 3584471.50 | 42250.62 |
| 1048576 | concurrent.apply | string | 1660346.06 | 7810.94 |
| 1048576 | merge | string | 743.50 | 55.28 |
| 1048576 | create | string | 750.55 | 31.48 |
| 1048576 | value.random | string | 28.78 | 3.92 |
| 1048576 | values.range | string | 71.76 | 5.71 |
| 1048576 | values.array | string | 3486060.50 | 28123.13 |
| 1048576 | values.text | string | 40.95 | 4.26 |
| 1048576 | sequence.array | string | 3456592.12 | 18657.56 |
| 1048576 | sequence.text | string | 91.79 | 3.53 |
| 1048576 | sequence.edited.text | string | 840205.50 | 6502.69 |
| 1048576 | sequence.masked.text | string | 1881.03 | 225.24 |

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

Measured on Node 24.22.3, V8 13.6.233.17-node.63, linux x64, AMD EPYC 9V45 96-Core Processor. Splitting and text assembly are included where required; peer preparation, encoding and explicit JS process garbage collection are outside API timings.
