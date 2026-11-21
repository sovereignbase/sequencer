# Large string benchmarks

2026-11-21T14:01:25.368Z · [CI run](https://github.com/sovereignbase/sequencer/actions/runs/44911211827)

3 runs; times are median ns/call. IQR is Q3 minus Q1.

| UTF-16 code units | Operation | Representation | Median ns | IQR ns |
| ---: | --- | --- | ---: | ---: |
| 1024 | insert | array | 1384.70 | 242.38 |
| 1024 | insert.append | array | 13844.02 | 2401.40 |
| 1024 | replace | array | 4267.92 | 209.84 |
| 1024 | remove | array | 3012.03 | 322.99 |
| 1024 | remove.middle | array | 1425.64 | 128.70 |
| 1024 | replace.middle | array | 1877.09 | 255.99 |
| 1024 | apply | array | 908.01 | 106.05 |
| 1024 | apply.array | array | 533.17 | 21.75 |
| 1024 | concurrent.apply | array | 44085.48 | 633.20 |
| 1024 | merge | array | 1818.18 | 385.76 |
| 1024 | create | array | 2054.79 | 188.42 |
| 1024 | value.random | array | 34.39 | 5.60 |
| 1024 | values.range | array | 84.87 | 15.52 |
| 1024 | values.array | array | 741.36 | 141.96 |
| 1024 | values.text | array | 9275.01 | 302.37 |
| 1024 | sequence.array | array | 996.28 | 45.53 |
| 1024 | sequence.text | array | 6030.12 | 28.15 |
| 1024 | sequence.edited.text | array | 10156.01 | 435.99 |
| 1024 | sequence.masked.text | array | 8325.71 | 577.12 |
| 1024 | insert | string | 424.39 | 48.53 |
| 1024 | insert.append | string | 3337.56 | 416.39 |
| 1024 | replace | string | 1540.27 | 95.95 |
| 1024 | remove | string | 918.96 | 106.90 |
| 1024 | remove.middle | string | 913.06 | 90.10 |
| 1024 | replace.middle | string | 1247.28 | 32.13 |
| 1024 | apply | string | 1026.53 | 115.62 |
| 1024 | apply.array | string | 1624.86 | 145.26 |
| 1024 | concurrent.apply | string | 3016.40 | 39.74 |
| 1024 | merge | string | 1012.99 | 52.61 |
| 1024 | create | string | 1185.25 | 55.99 |
| 1024 | value.random | string | 40.90 | 4.94 |
| 1024 | values.range | string | 116.84 | 19.16 |
| 1024 | values.array | string | 954.69 | 24.34 |
| 1024 | values.text | string | 50.05 | 6.84 |
| 1024 | sequence.array | string | 1117.39 | 293.25 |
| 1024 | sequence.text | string | 153.07 | 16.26 |
| 1024 | sequence.edited.text | string | 1922.06 | 294.04 |
| 1024 | sequence.masked.text | string | 2974.91 | 83.21 |
| 65536 | insert | array | 307109.91 | 86766.83 |
| 65536 | insert.append | array | 1131615.87 | 23859.41 |
| 65536 | replace | array | 659699.21 | 61489.54 |
| 65536 | remove | array | 405859.55 | 36294.56 |
| 65536 | remove.middle | array | 317272.85 | 23564.93 |
| 65536 | replace.middle | array | 309103.67 | 26004.58 |
| 65536 | apply | array | 1243.31 | 35.23 |
| 65536 | apply.array | array | 569.83 | 132.71 |
| 65536 | concurrent.apply | array | 3468063.12 | 251805.23 |
| 65536 | merge | array | 276124.05 | 18689.93 |
| 65536 | create | array | 272469.32 | 16222.82 |
| 65536 | value.random | array | 50.64 | 8.61 |
| 65536 | values.range | array | 96.93 | 36.24 |
| 65536 | values.array | array | 238268.74 | 15057.86 |
| 65536 | values.text | array | 740749.85 | 3055.50 |
| 65536 | sequence.array | array | 237118.05 | 12720.50 |
| 65536 | sequence.text | array | 413629.74 | 87798.42 |
| 65536 | sequence.edited.text | array | 627114.35 | 68229.73 |
| 65536 | sequence.masked.text | array | 414626.79 | 199105.04 |
| 65536 | insert | string | 347.76 | 10.62 |
| 65536 | insert.append | string | 9536.65 | 2613.18 |
| 65536 | replace | string | 1697.49 | 155.98 |
| 65536 | remove | string | 1106.11 | 107.25 |
| 65536 | remove.middle | string | 883.54 | 34.17 |
| 65536 | replace.middle | string | 1219.78 | 11.45 |
| 65536 | apply | string | 926.33 | 64.09 |
| 65536 | apply.array | string | 269818.78 | 2334.73 |
| 65536 | concurrent.apply | string | 129296.26 | 1227.99 |
| 65536 | merge | string | 1084.38 | 18.20 |
| 65536 | create | string | 1118.45 | 21.19 |
| 65536 | value.random | string | 41.73 | 1.61 |
| 65536 | values.range | string | 111.48 | 13.91 |
| 65536 | values.array | string | 271086.82 | 4107.36 |
| 65536 | values.text | string | 49.52 | 7.95 |
| 65536 | sequence.array | string | 271940.99 | 2405.61 |
| 65536 | sequence.text | string | 178.85 | 16.34 |
| 65536 | sequence.edited.text | string | 66156.15 | 173.88 |
| 65536 | sequence.masked.text | string | 3022.62 | 67.84 |
| 1048576 | insert | array | 4274227.83 | 28039.33 |
| 1048576 | insert.append | array | 25604667.00 | 113811.25 |
| 1048576 | replace | array | 10583761.33 | 286549.50 |
| 1048576 | remove | array | 5738542.40 | 377787.00 |
| 1048576 | remove.middle | array | 4438086.67 | 4362.92 |
| 1048576 | replace.middle | array | 4452573.17 | 30911.67 |
| 1048576 | apply | array | 1352.16 | 148.31 |
| 1048576 | apply.array | array | 574.30 | 77.34 |
| 1048576 | concurrent.apply | array | 59332753.00 | 1529934.00 |
| 1048576 | merge | array | 4099087.00 | 46143.60 |
| 1048576 | create | array | 4060847.71 | 55679.93 |
| 1048576 | value.random | array | 48.22 | 10.06 |
| 1048576 | values.range | array | 88.92 | 9.55 |
| 1048576 | values.array | array | 4238948.57 | 45841.21 |
| 1048576 | values.text | array | 12131009.33 | 106199.50 |
| 1048576 | sequence.array | array | 4226320.57 | 78631.21 |
| 1048576 | sequence.text | array | 31965089.00 | 600501.00 |
| 1048576 | sequence.edited.text | array | 34044170.50 | 2193657.75 |
| 1048576 | sequence.masked.text | array | 32331611.50 | 1338501.25 |
| 1048576 | insert | string | 430.14 | 10.02 |
| 1048576 | insert.append | string | 486908.12 | 9067.23 |
| 1048576 | replace | string | 1644.45 | 123.46 |
| 1048576 | remove | string | 1204.44 | 78.44 |
| 1048576 | remove.middle | string | 964.93 | 18.55 |
| 1048576 | replace.middle | string | 1284.21 | 9.47 |
| 1048576 | apply | string | 1002.31 | 39.84 |
| 1048576 | apply.array | string | 4241218.83 | 65369.67 |
| 1048576 | concurrent.apply | string | 1864768.79 | 16400.79 |
| 1048576 | merge | string | 1086.33 | 21.16 |
| 1048576 | create | string | 1130.47 | 130.18 |
| 1048576 | value.random | string | 39.19 | 8.64 |
| 1048576 | values.range | string | 149.08 | 17.01 |
| 1048576 | values.array | string | 4132314.86 | 60246.08 |
| 1048576 | values.text | string | 49.14 | 0.34 |
| 1048576 | sequence.array | string | 4188206.83 | 34040.95 |
| 1048576 | sequence.text | string | 158.44 | 34.06 |
| 1048576 | sequence.edited.text | string | 1079093.71 | 1043.23 |
| 1048576 | sequence.masked.text | string | 2978.53 | 77.14 |

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

Measured on Node 24.22.3, V8 13.6.233.17-node.63, linux x64, AMD EPYC 7763 64-Core Processor. Splitting and text assembly are included where required; peer preparation, encoding and explicit JS process garbage collection are outside API timings.
