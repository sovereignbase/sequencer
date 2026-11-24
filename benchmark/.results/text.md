# Large string benchmarks

2026-11-24T18:20:33.091Z · local run

3 runs; times are median ns/call. IQR is Q3 minus Q1.

| UTF-16 code units | Operation | Representation | Median ns | IQR ns |
| ---: | --- | --- | ---: | ---: |
| 1024 | insert | array | 2689.04 | 834.64 |
| 1024 | insert.append | array | 17638.59 | 3622.07 |
| 1024 | replace | array | 8330.76 | 1135.60 |
| 1024 | remove | array | 4324.74 | 579.94 |
| 1024 | remove.middle | array | 2303.22 | 266.66 |
| 1024 | replace.middle | array | 2568.21 | 301.89 |
| 1024 | apply | array | 794.09 | 117.76 |
| 1024 | apply.array | array | 540.25 | 48.87 |
| 1024 | concurrent.apply | array | 61383.82 | 3735.50 |
| 1024 | merge | array | 2723.07 | 258.43 |
| 1024 | create | array | 2785.82 | 173.07 |
| 1024 | value.random | array | 47.51 | 8.50 |
| 1024 | values.range | array | 111.05 | 8.73 |
| 1024 | values.array | array | 1381.66 | 444.03 |
| 1024 | values.text | array | 13398.18 | 424.48 |
| 1024 | sequence.array | array | 2268.78 | 498.97 |
| 1024 | sequence.text | array | 8491.21 | 2143.41 |
| 1024 | sequence.edited.text | array | 14989.93 | 1160.40 |
| 1024 | sequence.masked.text | array | 11636.02 | 1567.02 |
| 1024 | insert | string | 405.64 | 85.16 |
| 1024 | insert.append | string | 3422.86 | 459.90 |
| 1024 | replace | string | 1396.62 | 85.65 |
| 1024 | remove | string | 1221.01 | 428.09 |
| 1024 | remove.middle | string | 899.57 | 168.67 |
| 1024 | replace.middle | string | 1328.20 | 82.86 |
| 1024 | apply | string | 778.20 | 64.68 |
| 1024 | apply.array | string | 2236.91 | 344.46 |
| 1024 | concurrent.apply | string | 3633.38 | 516.70 |
| 1024 | merge | string | 1147.09 | 77.85 |
| 1024 | create | string | 1210.88 | 266.88 |
| 1024 | value.random | string | 48.22 | 7.33 |
| 1024 | values.range | string | 139.80 | 19.86 |
| 1024 | values.array | string | 1538.25 | 267.36 |
| 1024 | values.text | string | 61.65 | 4.17 |
| 1024 | sequence.array | string | 2104.12 | 284.01 |
| 1024 | sequence.text | string | 204.67 | 20.11 |
| 1024 | sequence.edited.text | string | 2168.98 | 174.48 |
| 1024 | sequence.masked.text | string | 3796.35 | 497.12 |
| 65536 | insert | array | 270116.13 | 57334.69 |
| 65536 | insert.append | array | 1361205.26 | 395315.00 |
| 65536 | replace | array | 817169.77 | 259187.90 |
| 65536 | remove | array | 440731.25 | 24739.39 |
| 65536 | remove.middle | array | 275058.24 | 55789.29 |
| 65536 | replace.middle | array | 250660.00 | 68675.09 |
| 65536 | apply | array | 1505.88 | 267.13 |
| 65536 | apply.array | array | 660.10 | 172.19 |
| 65536 | concurrent.apply | array | 5291500.00 | 1530716.07 |
| 65536 | merge | array | 309162.96 | 55432.77 |
| 65536 | create | array | 250857.00 | 24768.87 |
| 65536 | value.random | array | 55.77 | 22.81 |
| 65536 | values.range | array | 130.62 | 35.15 |
| 65536 | values.array | array | 241475.00 | 35633.07 |
| 65536 | values.text | array | 924007.14 | 191465.15 |
| 65536 | sequence.array | array | 257625.98 | 95085.88 |
| 65536 | sequence.text | array | 823665.63 | 250949.37 |
| 65536 | sequence.edited.text | array | 884400.00 | 160998.64 |
| 65536 | sequence.masked.text | array | 742717.65 | 76199.51 |
| 65536 | insert | string | 444.47 | 72.53 |
| 65536 | insert.append | string | 15395.57 | 2837.66 |
| 65536 | replace | string | 1401.87 | 168.69 |
| 65536 | remove | string | 1110.77 | 449.40 |
| 65536 | remove.middle | string | 905.24 | 59.84 |
| 65536 | replace.middle | string | 1228.31 | 27.28 |
| 65536 | apply | string | 641.49 | 85.10 |
| 65536 | apply.array | string | 232763.89 | 1957.67 |
| 65536 | concurrent.apply | string | 163454.90 | 31597.09 |
| 65536 | merge | string | 1520.54 | 553.39 |
| 65536 | create | string | 1430.79 | 224.24 |
| 65536 | value.random | string | 68.31 | 15.02 |
| 65536 | values.range | string | 171.57 | 56.38 |
| 65536 | values.array | string | 253827.34 | 10491.41 |
| 65536 | values.text | string | 56.01 | 3.68 |
| 65536 | sequence.array | string | 237178.13 | 7659.38 |
| 65536 | sequence.text | string | 180.48 | 10.26 |
| 65536 | sequence.edited.text | string | 80134.19 | 3772.70 |
| 65536 | sequence.masked.text | string | 3671.37 | 541.21 |
| 1048576 | insert | array | 3299825.00 | 751437.50 |
| 1048576 | insert.append | array | 25496700.00 | 3161925.00 |
| 1048576 | replace | array | 7629825.00 | 2415241.67 |
| 1048576 | remove | array | 4825416.67 | 903833.33 |
| 1048576 | remove.middle | array | 2823281.82 | 834313.33 |
| 1048576 | replace.middle | array | 2866872.73 | 926480.00 |
| 1048576 | apply | array | 1231.99 | 73.88 |
| 1048576 | apply.array | array | 615.61 | 397.61 |
| 1048576 | concurrent.apply | array | 62319400.00 | 1344300.00 |
| 1048576 | merge | array | 3175787.50 | 416489.68 |
| 1048576 | create | array | 2969122.22 | 461630.56 |
| 1048576 | value.random | array | 36.05 | 20.54 |
| 1048576 | values.range | array | 99.38 | 15.76 |
| 1048576 | values.array | array | 2148800.00 | 564666.67 |
| 1048576 | values.text | array | 12825250.00 | 1389933.33 |
| 1048576 | sequence.array | array | 2969455.56 | 509535.42 |
| 1048576 | sequence.text | array | 61613050.00 | 1776975.00 |
| 1048576 | sequence.edited.text | array | 58225950.00 | 14485550.00 |
| 1048576 | sequence.masked.text | array | 53310800.00 | 8814200.00 |
| 1048576 | insert | string | 433.01 | 27.09 |
| 1048576 | insert.append | string | 511938.78 | 133006.33 |
| 1048576 | replace | string | 1767.66 | 347.53 |
| 1048576 | remove | string | 929.15 | 89.93 |
| 1048576 | remove.middle | string | 987.63 | 71.78 |
| 1048576 | replace.middle | string | 1402.33 | 234.19 |
| 1048576 | apply | string | 1049.40 | 350.02 |
| 1048576 | apply.array | string | 3768962.50 | 793076.39 |
| 1048576 | concurrent.apply | string | 1224966.67 | 457315.06 |
| 1048576 | merge | string | 1039.81 | 99.84 |
| 1048576 | create | string | 1122.11 | 114.64 |
| 1048576 | value.random | string | 47.33 | 4.34 |
| 1048576 | values.range | string | 167.35 | 16.60 |
| 1048576 | values.array | string | 3575887.50 | 608262.50 |
| 1048576 | values.text | string | 84.84 | 6.32 |
| 1048576 | sequence.array | string | 3929837.50 | 772886.11 |
| 1048576 | sequence.text | string | 243.27 | 46.98 |
| 1048576 | sequence.edited.text | string | 2000969.23 | 521896.89 |
| 1048576 | sequence.masked.text | string | 3877.93 | 288.30 |

Encoded snapshots use string Footage in both representations.

## Estimated retained memory and snapshot size

| UTF-16 code units | Representation | Estimated MiB | Snapshot MessagePack KiB | Snapshot gzip KiB | Gossip MessagePack KiB | Gossip gzip KiB |
| ---: | --- | ---: | ---: | ---: | ---: | ---: |
| 1024 | array | 0.0082 | 1.02 | 0.05 | 2.02 | 0.05 |
| 1024 | string | 0.0023 | 1.02 | 0.04 | 1.02 | 0.05 |
| 65536 | array | 0.5004 | 64.02 | 0.12 | 128.02 | 0.18 |
| 65536 | string | 0.1254 | 64.02 | 0.12 | 64.02 | 0.12 |
| 1048576 | array | 8.0004 | 1024.02 | 1.05 | 2048.02 | 2.04 |
| 1048576 | string | 2.0004 | 1024.02 | 1.05 | 1024.02 | 1.05 |

Measured on Node 24.16.0, V8 13.6.233.17-node.49, win32 x64, Intel(R) Core(TM) i5-10210U CPU @ 1.60GHz. Splitting and text assembly are included where required; peer preparation, encoding and explicit JS process garbage collection are outside API timings.
