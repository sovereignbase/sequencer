# Large string benchmarks

2026-11-27T22:06:40.302Z · [CI run](https://github.com/sovereignbase/sequencer/actions/runs/46073953475)

3 runs; times are median ns/call. IQR is Q3 minus Q1.

| UTF-16 code units | Operation | Representation | Median ns | IQR ns |
| ---: | --- | --- | ---: | ---: |
| 1024 | insert | array | 1283.39 | 58.22 |
| 1024 | insert.append | array | 11596.31 | 3069.95 |
| 1024 | replace | array | 2032.89 | 28.88 |
| 1024 | remove | array | 781.76 | 75.00 |
| 1024 | remove.middle | array | 1392.39 | 168.66 |
| 1024 | replace.middle | array | 1712.99 | 147.97 |
| 1024 | apply | array | 628.95 | 54.37 |
| 1024 | apply.array | array | 462.29 | 50.99 |
| 1024 | concurrent.apply | array | 31493.29 | 359.74 |
| 1024 | merge | array | 1902.79 | 42.35 |
| 1024 | create | array | 1831.95 | 23.40 |
| 1024 | value.random | array | 31.11 | 2.70 |
| 1024 | values.range | array | 73.25 | 4.53 |
| 1024 | values.array | array | 766.92 | 204.12 |
| 1024 | values.text | array | 6930.67 | 227.62 |
| 1024 | sequence.array | array | 967.10 | 124.10 |
| 1024 | sequence.text | array | 5161.74 | 345.85 |
| 1024 | sequence.edited.text | array | 5450.84 | 234.68 |
| 1024 | sequence.masked.text | array | 6467.32 | 100.16 |
| 1024 | insert | string | 318.81 | 14.88 |
| 1024 | insert.append | string | 2305.77 | 145.66 |
| 1024 | replace | string | 1073.46 | 36.93 |
| 1024 | remove | string | 653.96 | 98.82 |
| 1024 | remove.middle | string | 744.37 | 30.46 |
| 1024 | replace.middle | string | 1041.08 | 44.63 |
| 1024 | apply | string | 634.20 | 92.08 |
| 1024 | apply.array | string | 1491.77 | 53.03 |
| 1024 | concurrent.apply | string | 2344.42 | 110.74 |
| 1024 | merge | string | 945.79 | 33.01 |
| 1024 | create | string | 794.06 | 43.92 |
| 1024 | value.random | string | 33.67 | 4.88 |
| 1024 | values.range | string | 89.07 | 7.82 |
| 1024 | values.array | string | 977.69 | 208.17 |
| 1024 | values.text | string | 44.25 | 4.32 |
| 1024 | sequence.array | string | 1122.95 | 32.82 |
| 1024 | sequence.text | string | 107.22 | 4.56 |
| 1024 | sequence.edited.text | string | 429.66 | 16.04 |
| 1024 | sequence.masked.text | string | 2235.34 | 23.58 |
| 65536 | insert | array | 236208.04 | 25710.84 |
| 65536 | insert.append | array | 1027889.08 | 11562.14 |
| 65536 | replace | array | 287867.63 | 14693.29 |
| 65536 | remove | array | 1957.54 | 30.09 |
| 65536 | remove.middle | array | 270698.69 | 17230.53 |
| 65536 | replace.middle | array | 272682.85 | 4609.91 |
| 65536 | apply | array | 729.68 | 87.27 |
| 65536 | apply.array | array | 471.29 | 5.94 |
| 65536 | concurrent.apply | array | 2704422.70 | 87654.00 |
| 65536 | merge | array | 237504.47 | 9791.59 |
| 65536 | create | array | 234459.15 | 9543.82 |
| 65536 | value.random | array | 34.37 | 4.04 |
| 65536 | values.range | array | 80.79 | 40.08 |
| 65536 | values.array | array | 226695.14 | 10794.70 |
| 65536 | values.text | array | 581879.70 | 3410.45 |
| 65536 | sequence.array | array | 219660.96 | 15701.35 |
| 65536 | sequence.text | array | 338572.85 | 60113.27 |
| 65536 | sequence.edited.text | array | 338523.64 | 180667.95 |
| 65536 | sequence.masked.text | array | 350720.47 | 60352.39 |
| 65536 | insert | string | 343.76 | 32.03 |
| 65536 | insert.append | string | 9467.83 | 390.54 |
| 65536 | replace | string | 1020.48 | 89.14 |
| 65536 | remove | string | 726.09 | 57.48 |
| 65536 | remove.middle | string | 712.45 | 29.23 |
| 65536 | replace.middle | string | 956.79 | 13.64 |
| 65536 | apply | string | 655.62 | 92.35 |
| 65536 | apply.array | string | 228733.45 | 1286.69 |
| 65536 | concurrent.apply | string | 106239.88 | 1290.29 |
| 65536 | merge | string | 938.45 | 42.72 |
| 65536 | create | string | 777.52 | 22.06 |
| 65536 | value.random | string | 30.68 | 1.00 |
| 65536 | values.range | string | 86.84 | 11.67 |
| 65536 | values.array | string | 227936.90 | 2322.33 |
| 65536 | values.text | string | 45.76 | 11.68 |
| 65536 | sequence.array | string | 229839.04 | 4116.84 |
| 65536 | sequence.text | string | 110.30 | 7.81 |
| 65536 | sequence.edited.text | string | 4605.06 | 47.56 |
| 65536 | sequence.masked.text | string | 2223.39 | 48.79 |
| 1048576 | insert | array | 3661441.57 | 192357.80 |
| 1048576 | insert.append | array | 22959665.00 | 324784.00 |
| 1048576 | replace | array | 4200257.50 | 175854.36 |
| 1048576 | remove | array | 6664.15 | 118.49 |
| 1048576 | remove.middle | array | 4038522.57 | 46930.50 |
| 1048576 | replace.middle | array | 3687505.14 | 61430.57 |
| 1048576 | apply | array | 725.09 | 80.48 |
| 1048576 | apply.array | array | 461.15 | 15.33 |
| 1048576 | concurrent.apply | array | 46432718.00 | 1158058.50 |
| 1048576 | merge | array | 3839746.50 | 32247.38 |
| 1048576 | create | array | 3760903.25 | 16057.00 |
| 1048576 | value.random | array | 29.60 | 0.90 |
| 1048576 | values.range | array | 66.87 | 4.16 |
| 1048576 | values.array | array | 3909525.86 | 77687.21 |
| 1048576 | values.text | array | 9539654.67 | 69279.67 |
| 1048576 | sequence.array | array | 3821730.71 | 33832.64 |
| 1048576 | sequence.text | array | 26697929.50 | 5444628.25 |
| 1048576 | sequence.edited.text | array | 24185633.00 | 1257826.00 |
| 1048576 | sequence.masked.text | array | 24299432.50 | 422124.50 |
| 1048576 | insert | string | 398.35 | 22.32 |
| 1048576 | insert.append | string | 441196.67 | 7174.86 |
| 1048576 | replace | string | 1139.38 | 16.63 |
| 1048576 | remove | string | 773.76 | 127.60 |
| 1048576 | remove.middle | string | 724.78 | 34.91 |
| 1048576 | replace.middle | string | 1020.51 | 14.68 |
| 1048576 | apply | string | 660.67 | 8.62 |
| 1048576 | apply.array | string | 3987664.62 | 200074.51 |
| 1048576 | concurrent.apply | string | 1803868.63 | 26638.78 |
| 1048576 | merge | string | 971.76 | 12.21 |
| 1048576 | create | string | 768.33 | 10.33 |
| 1048576 | value.random | string | 30.27 | 4.44 |
| 1048576 | values.range | string | 93.89 | 4.33 |
| 1048576 | values.array | string | 3939584.50 | 16987.75 |
| 1048576 | values.text | string | 45.35 | 3.61 |
| 1048576 | sequence.array | string | 3946522.63 | 215590.71 |
| 1048576 | sequence.text | string | 111.13 | 4.84 |
| 1048576 | sequence.edited.text | string | 65749.61 | 504.71 |
| 1048576 | sequence.masked.text | string | 2241.31 | 97.07 |

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
