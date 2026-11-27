# Large string benchmarks

2026-11-27T21:52:16.397Z · [CI run](https://github.com/sovereignbase/sequencer/actions/runs/46072517566)

3 runs; times are median ns/call. IQR is Q3 minus Q1.

| UTF-16 code units | Operation | Representation | Median ns | IQR ns |
| ---: | --- | --- | ---: | ---: |
| 1024 | insert | array | 915.24 | 616.56 |
| 1024 | insert.append | array | 10107.07 | 3382.91 |
| 1024 | replace | array | 1371.13 | 21.92 |
| 1024 | remove | array | 521.01 | 23.87 |
| 1024 | remove.middle | array | 991.85 | 77.54 |
| 1024 | replace.middle | array | 1167.73 | 116.11 |
| 1024 | apply | array | 497.23 | 55.17 |
| 1024 | apply.array | array | 346.24 | 28.33 |
| 1024 | concurrent.apply | array | 20837.60 | 775.73 |
| 1024 | merge | array | 1381.85 | 102.00 |
| 1024 | create | array | 1185.51 | 78.76 |
| 1024 | value.random | array | 30.17 | 4.49 |
| 1024 | values.range | array | 56.43 | 2.24 |
| 1024 | values.array | array | 329.77 | 98.60 |
| 1024 | values.text | array | 4328.13 | 254.06 |
| 1024 | sequence.array | array | 365.84 | 83.71 |
| 1024 | sequence.text | array | 3562.79 | 76.40 |
| 1024 | sequence.edited.text | array | 3915.45 | 181.78 |
| 1024 | sequence.masked.text | array | 4670.29 | 1114.23 |
| 1024 | insert | string | 257.22 | 201.91 |
| 1024 | insert.append | string | 2039.65 | 385.08 |
| 1024 | replace | string | 771.13 | 19.09 |
| 1024 | remove | string | 560.96 | 44.07 |
| 1024 | remove.middle | string | 543.02 | 24.60 |
| 1024 | replace.middle | string | 799.66 | 93.10 |
| 1024 | apply | string | 474.79 | 49.98 |
| 1024 | apply.array | string | 977.99 | 148.78 |
| 1024 | concurrent.apply | string | 1923.27 | 19.30 |
| 1024 | merge | string | 736.91 | 72.79 |
| 1024 | create | string | 591.82 | 39.52 |
| 1024 | value.random | string | 27.90 | 4.23 |
| 1024 | values.range | string | 64.46 | 16.56 |
| 1024 | values.array | string | 561.26 | 40.28 |
| 1024 | values.text | string | 33.31 | 2.25 |
| 1024 | sequence.array | string | 682.04 | 49.30 |
| 1024 | sequence.text | string | 84.09 | 14.79 |
| 1024 | sequence.edited.text | string | 325.51 | 26.40 |
| 1024 | sequence.masked.text | string | 1688.61 | 82.41 |
| 65536 | insert | array | 223444.90 | 5297.53 |
| 65536 | insert.append | array | 739468.85 | 151604.41 |
| 65536 | replace | array | 219858.36 | 3094.01 |
| 65536 | remove | array | 742.10 | 15.92 |
| 65536 | remove.middle | array | 207043.25 | 7554.23 |
| 65536 | replace.middle | array | 207024.07 | 4482.61 |
| 65536 | apply | array | 514.19 | 22.24 |
| 65536 | apply.array | array | 334.85 | 41.77 |
| 65536 | concurrent.apply | array | 1830281.21 | 136158.64 |
| 65536 | merge | array | 219841.49 | 6291.73 |
| 65536 | create | array | 212546.56 | 9549.57 |
| 65536 | value.random | array | 27.39 | 1.90 |
| 65536 | values.range | array | 64.97 | 28.04 |
| 65536 | values.array | array | 201734.90 | 4302.04 |
| 65536 | values.text | array | 394603.03 | 15049.33 |
| 65536 | sequence.array | array | 203947.00 | 861.07 |
| 65536 | sequence.text | array | 245700.30 | 105883.19 |
| 65536 | sequence.edited.text | array | 224361.00 | 108965.64 |
| 65536 | sequence.masked.text | array | 214877.57 | 15587.99 |
| 65536 | insert | string | 206.11 | 6.53 |
| 65536 | insert.append | string | 6010.17 | 334.17 |
| 65536 | replace | string | 805.57 | 12.11 |
| 65536 | remove | string | 579.08 | 20.88 |
| 65536 | remove.middle | string | 575.24 | 34.64 |
| 65536 | replace.middle | string | 758.70 | 10.57 |
| 65536 | apply | string | 465.29 | 23.98 |
| 65536 | apply.array | string | 224047.88 | 7260.07 |
| 65536 | concurrent.apply | string | 110574.84 | 828.78 |
| 65536 | merge | string | 765.96 | 41.07 |
| 65536 | create | string | 554.48 | 56.43 |
| 65536 | value.random | string | 28.43 | 4.35 |
| 65536 | values.range | string | 74.27 | 10.25 |
| 65536 | values.array | string | 218985.13 | 3636.98 |
| 65536 | values.text | string | 32.55 | 3.71 |
| 65536 | sequence.array | string | 218304.70 | 1446.93 |
| 65536 | sequence.text | string | 81.58 | 6.20 |
| 65536 | sequence.edited.text | string | 2783.93 | 77.81 |
| 65536 | sequence.masked.text | string | 1638.87 | 62.25 |
| 1048576 | insert | array | 3263794.00 | 74612.62 |
| 1048576 | insert.append | array | 17171189.50 | 358346.25 |
| 1048576 | replace | array | 3252643.37 | 72885.50 |
| 1048576 | remove | array | 3235.95 | 1778.65 |
| 1048576 | remove.middle | array | 3208881.37 | 73659.94 |
| 1048576 | replace.middle | array | 3391552.67 | 60491.61 |
| 1048576 | apply | array | 572.30 | 12.45 |
| 1048576 | apply.array | array | 358.94 | 6.78 |
| 1048576 | concurrent.apply | array | 31348347.00 | 819386.50 |
| 1048576 | merge | array | 3187284.75 | 82817.94 |
| 1048576 | create | array | 3300268.38 | 599638.31 |
| 1048576 | value.random | array | 27.85 | 2.82 |
| 1048576 | values.range | array | 48.21 | 10.88 |
| 1048576 | values.array | array | 2995022.33 | 90327.78 |
| 1048576 | values.text | array | 6509990.00 | 117560.50 |
| 1048576 | sequence.array | array | 3230708.37 | 662674.73 |
| 1048576 | sequence.text | array | 18318757.00 | 2187944.25 |
| 1048576 | sequence.edited.text | array | 20488540.00 | 3404143.25 |
| 1048576 | sequence.masked.text | array | 22135644.00 | 2139009.25 |
| 1048576 | insert | string | 241.54 | 13.23 |
| 1048576 | insert.append | string | 412875.78 | 7519.37 |
| 1048576 | replace | string | 883.29 | 46.62 |
| 1048576 | remove | string | 583.47 | 31.51 |
| 1048576 | remove.middle | string | 563.63 | 14.06 |
| 1048576 | replace.middle | string | 758.37 | 12.89 |
| 1048576 | apply | string | 505.24 | 13.05 |
| 1048576 | apply.array | string | 3306354.75 | 130177.88 |
| 1048576 | concurrent.apply | string | 1585407.69 | 23343.21 |
| 1048576 | merge | string | 712.11 | 16.12 |
| 1048576 | create | string | 543.38 | 37.17 |
| 1048576 | value.random | string | 34.60 | 2.90 |
| 1048576 | values.range | string | 66.13 | 10.40 |
| 1048576 | values.array | string | 3318230.25 | 53127.69 |
| 1048576 | values.text | string | 42.60 | 3.36 |
| 1048576 | sequence.array | string | 3319289.12 | 45059.37 |
| 1048576 | sequence.text | string | 80.06 | 17.36 |
| 1048576 | sequence.edited.text | string | 36435.01 | 171.22 |
| 1048576 | sequence.masked.text | string | 1604.30 | 49.80 |

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
