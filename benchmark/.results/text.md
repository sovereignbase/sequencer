# Large string benchmarks

2026-11-24T18:43:53.254Z · [CI run](https://github.com/sovereignbase/sequencer/actions/runs/45461530116)

3 runs; times are median ns/call. IQR is Q3 minus Q1.

| UTF-16 code units | Operation | Representation | Median ns | IQR ns |
| ---: | --- | --- | ---: | ---: |
| 1024 | insert | array | 1291.69 | 20.81 |
| 1024 | insert.append | array | 12463.88 | 2977.47 |
| 1024 | replace | array | 3731.12 | 171.92 |
| 1024 | remove | array | 2573.13 | 391.64 |
| 1024 | remove.middle | array | 1398.78 | 142.56 |
| 1024 | replace.middle | array | 1633.69 | 221.66 |
| 1024 | apply | array | 655.85 | 13.02 |
| 1024 | apply.array | array | 493.95 | 41.80 |
| 1024 | concurrent.apply | array | 32794.52 | 443.85 |
| 1024 | merge | array | 1936.50 | 88.68 |
| 1024 | create | array | 2024.73 | 54.99 |
| 1024 | value.random | array | 41.35 | 1.35 |
| 1024 | values.range | array | 65.76 | 1.87 |
| 1024 | values.array | array | 748.82 | 179.98 |
| 1024 | values.text | array | 6837.86 | 102.76 |
| 1024 | sequence.array | array | 958.89 | 201.23 |
| 1024 | sequence.text | array | 5220.33 | 190.12 |
| 1024 | sequence.edited.text | array | 9120.45 | 460.35 |
| 1024 | sequence.masked.text | array | 6585.25 | 508.92 |
| 1024 | insert | string | 320.54 | 32.08 |
| 1024 | insert.append | string | 2368.78 | 76.96 |
| 1024 | replace | string | 1105.90 | 28.28 |
| 1024 | remove | string | 681.60 | 0.61 |
| 1024 | remove.middle | string | 734.74 | 31.65 |
| 1024 | replace.middle | string | 975.53 | 27.74 |
| 1024 | apply | string | 631.38 | 77.89 |
| 1024 | apply.array | string | 1458.57 | 39.55 |
| 1024 | concurrent.apply | string | 2381.78 | 59.66 |
| 1024 | merge | string | 928.30 | 39.24 |
| 1024 | create | string | 907.84 | 10.35 |
| 1024 | value.random | string | 31.91 | 0.38 |
| 1024 | values.range | string | 98.71 | 10.94 |
| 1024 | values.array | string | 946.36 | 96.11 |
| 1024 | values.text | string | 43.56 | 4.82 |
| 1024 | sequence.array | string | 1196.82 | 146.45 |
| 1024 | sequence.text | string | 120.63 | 20.33 |
| 1024 | sequence.edited.text | string | 1414.44 | 68.22 |
| 1024 | sequence.masked.text | string | 2512.23 | 60.49 |
| 65536 | insert | array | 231812.28 | 22411.47 |
| 65536 | insert.append | array | 1017120.44 | 20338.75 |
| 65536 | replace | array | 619921.53 | 90979.05 |
| 65536 | remove | array | 340296.78 | 16615.78 |
| 65536 | remove.middle | array | 267001.80 | 16393.95 |
| 65536 | replace.middle | array | 269973.01 | 2653.72 |
| 65536 | apply | array | 961.39 | 53.13 |
| 65536 | apply.array | array | 508.83 | 86.92 |
| 65536 | concurrent.apply | array | 2725728.40 | 92378.91 |
| 65536 | merge | array | 230086.40 | 17148.44 |
| 65536 | create | array | 225237.05 | 13976.41 |
| 65536 | value.random | array | 38.23 | 5.67 |
| 65536 | values.range | array | 75.66 | 37.52 |
| 65536 | values.array | array | 215761.91 | 8626.90 |
| 65536 | values.text | array | 575634.91 | 1813.33 |
| 65536 | sequence.array | array | 215724.95 | 8697.27 |
| 65536 | sequence.text | array | 358015.61 | 72718.16 |
| 65536 | sequence.edited.text | array | 538487.00 | 145076.19 |
| 65536 | sequence.masked.text | array | 360085.71 | 144454.45 |
| 65536 | insert | string | 306.15 | 52.56 |
| 65536 | insert.append | string | 9060.58 | 1520.38 |
| 65536 | replace | string | 1042.34 | 12.76 |
| 65536 | remove | string | 702.07 | 12.69 |
| 65536 | remove.middle | string | 733.13 | 6.89 |
| 65536 | replace.middle | string | 973.81 | 2.40 |
| 65536 | apply | string | 674.66 | 73.53 |
| 65536 | apply.array | string | 234839.42 | 4727.64 |
| 65536 | concurrent.apply | string | 114439.00 | 1123.35 |
| 65536 | merge | string | 890.56 | 48.02 |
| 65536 | create | string | 914.61 | 12.06 |
| 65536 | value.random | string | 38.23 | 3.92 |
| 65536 | values.range | string | 99.08 | 16.59 |
| 65536 | values.array | string | 221452.05 | 60223.22 |
| 65536 | values.text | string | 44.06 | 13.84 |
| 65536 | sequence.array | string | 222998.08 | 1601.68 |
| 65536 | sequence.text | string | 134.85 | 7.57 |
| 65536 | sequence.edited.text | string | 54576.97 | 534.52 |
| 65536 | sequence.masked.text | string | 2411.97 | 22.05 |
| 1048576 | insert | array | 3946175.50 | 148673.10 |
| 1048576 | insert.append | array | 22695250.00 | 54675.25 |
| 1048576 | replace | array | 8838349.33 | 197888.50 |
| 1048576 | remove | array | 4857532.83 | 27682.25 |
| 1048576 | remove.middle | array | 3779606.43 | 817961.63 |
| 1048576 | replace.middle | array | 3880732.29 | 39471.36 |
| 1048576 | apply | array | 952.60 | 9.90 |
| 1048576 | apply.array | array | 515.07 | 41.54 |
| 1048576 | concurrent.apply | array | 47355849.00 | 5121927.00 |
| 1048576 | merge | array | 3898034.25 | 78870.12 |
| 1048576 | create | array | 3736883.12 | 54809.69 |
| 1048576 | value.random | array | 29.01 | 0.08 |
| 1048576 | values.range | array | 65.96 | 4.34 |
| 1048576 | values.array | array | 3712055.86 | 49358.36 |
| 1048576 | values.text | array | 9247764.67 | 51273.33 |
| 1048576 | sequence.array | array | 3734681.14 | 79110.00 |
| 1048576 | sequence.text | array | 23739322.00 | 514225.50 |
| 1048576 | sequence.edited.text | array | 27450234.50 | 547915.00 |
| 1048576 | sequence.masked.text | array | 24156758.00 | 543209.50 |
| 1048576 | insert | string | 391.68 | 38.82 |
| 1048576 | insert.append | string | 447337.48 | 109380.60 |
| 1048576 | replace | string | 1296.50 | 68.48 |
| 1048576 | remove | string | 770.58 | 51.04 |
| 1048576 | remove.middle | string | 751.41 | 16.84 |
| 1048576 | replace.middle | string | 1080.35 | 31.22 |
| 1048576 | apply | string | 785.78 | 86.75 |
| 1048576 | apply.array | string | 4008914.50 | 318275.48 |
| 1048576 | concurrent.apply | string | 1802181.75 | 48115.06 |
| 1048576 | merge | string | 901.17 | 23.60 |
| 1048576 | create | string | 879.13 | 20.17 |
| 1048576 | value.random | string | 39.53 | 0.98 |
| 1048576 | values.range | string | 88.41 | 4.89 |
| 1048576 | values.array | string | 3895181.00 | 53601.12 |
| 1048576 | values.text | string | 42.60 | 3.80 |
| 1048576 | sequence.array | string | 3852792.50 | 214933.23 |
| 1048576 | sequence.text | string | 121.03 | 6.10 |
| 1048576 | sequence.edited.text | string | 873253.69 | 2847.09 |
| 1048576 | sequence.masked.text | string | 2449.29 | 76.51 |

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
