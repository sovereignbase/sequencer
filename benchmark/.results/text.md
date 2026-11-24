# Large string benchmarks

2026-11-24T10:49:58.459Z · local run

3 runs; times are median ns/call. IQR is Q3 minus Q1.

| UTF-16 code units | Operation | Representation | Median ns | IQR ns |
| ---: | --- | --- | ---: | ---: |
| 1024 | insert | array | 2036.30 | 206.99 |
| 1024 | insert.append | array | 17428.36 | 2249.76 |
| 1024 | replace | array | 6992.53 | 212.01 |
| 1024 | remove | array | 4153.17 | 167.13 |
| 1024 | remove.middle | array | 2215.65 | 249.18 |
| 1024 | replace.middle | array | 2677.60 | 220.95 |
| 1024 | apply | array | 926.10 | 75.60 |
| 1024 | apply.array | array | 609.88 | 119.48 |
| 1024 | concurrent.apply | array | 65664.57 | 6284.59 |
| 1024 | merge | array | 2700.01 | 783.05 |
| 1024 | create | array | 2911.50 | 1022.97 |
| 1024 | value.random | array | 53.95 | 21.12 |
| 1024 | values.range | array | 115.16 | 48.86 |
| 1024 | values.array | array | 1262.39 | 230.70 |
| 1024 | values.text | array | 13565.38 | 1884.19 |
| 1024 | sequence.array | array | 1394.57 | 800.94 |
| 1024 | sequence.text | array | 9759.88 | 2214.49 |
| 1024 | sequence.edited.text | array | 14671.77 | 6036.52 |
| 1024 | sequence.masked.text | array | 12204.05 | 6081.42 |
| 1024 | insert | string | 327.50 | 273.51 |
| 1024 | insert.append | string | 4051.05 | 854.46 |
| 1024 | replace | string | 1798.24 | 121.59 |
| 1024 | remove | string | 1240.77 | 162.79 |
| 1024 | remove.middle | string | 1167.86 | 143.71 |
| 1024 | replace.middle | string | 1506.53 | 104.09 |
| 1024 | apply | string | 948.33 | 375.63 |
| 1024 | apply.array | string | 2309.72 | 383.12 |
| 1024 | concurrent.apply | string | 3903.11 | 1331.31 |
| 1024 | merge | string | 1194.30 | 765.20 |
| 1024 | create | string | 1305.88 | 218.12 |
| 1024 | value.random | string | 63.81 | 10.47 |
| 1024 | values.range | string | 173.41 | 22.41 |
| 1024 | values.array | string | 1950.77 | 187.12 |
| 1024 | values.text | string | 67.57 | 23.99 |
| 1024 | sequence.array | string | 2028.57 | 258.92 |
| 1024 | sequence.text | string | 230.50 | 21.43 |
| 1024 | sequence.edited.text | string | 2507.36 | 254.50 |
| 1024 | sequence.masked.text | string | 3870.53 | 334.57 |
| 65536 | insert | array | 262446.87 | 3649.93 |
| 65536 | insert.append | array | 1099908.70 | 38456.87 |
| 65536 | replace | array | 669500.00 | 21063.95 |
| 65536 | remove | array | 400306.25 | 94028.36 |
| 65536 | remove.middle | array | 243889.32 | 42019.97 |
| 65536 | replace.middle | array | 257997.94 | 24742.24 |
| 65536 | apply | array | 1251.78 | 52.78 |
| 65536 | apply.array | array | 615.21 | 189.70 |
| 65536 | concurrent.apply | array | 3888257.14 | 146077.38 |
| 65536 | merge | array | 248372.66 | 26528.59 |
| 65536 | create | array | 214452.99 | 21868.67 |
| 65536 | value.random | array | 64.85 | 1.16 |
| 65536 | values.range | array | 116.17 | 14.89 |
| 65536 | values.array | array | 220775.59 | 10582.17 |
| 65536 | values.text | array | 805156.25 | 8094.30 |
| 65536 | sequence.array | array | 220881.75 | 13612.20 |
| 65536 | sequence.text | array | 699594.44 | 118530.18 |
| 65536 | sequence.edited.text | array | 926562.96 | 59934.37 |
| 65536 | sequence.masked.text | array | 653530.77 | 90304.69 |
| 65536 | insert | string | 394.27 | 44.90 |
| 65536 | insert.append | string | 16398.96 | 3002.01 |
| 65536 | replace | string | 1504.64 | 234.22 |
| 65536 | remove | string | 1163.39 | 165.30 |
| 65536 | remove.middle | string | 1013.70 | 71.66 |
| 65536 | replace.middle | string | 1426.71 | 54.60 |
| 65536 | apply | string | 991.71 | 68.99 |
| 65536 | apply.array | string | 270059.38 | 31184.34 |
| 65536 | concurrent.apply | string | 149565.48 | 2840.30 |
| 65536 | merge | string | 1212.74 | 86.18 |
| 65536 | create | string | 1200.21 | 36.10 |
| 65536 | value.random | string | 50.87 | 3.30 |
| 65536 | values.range | string | 153.37 | 7.29 |
| 65536 | values.array | string | 247862.50 | 25936.00 |
| 65536 | values.text | string | 66.69 | 1.52 |
| 65536 | sequence.array | string | 250018.75 | 34938.61 |
| 65536 | sequence.text | string | 210.44 | 12.29 |
| 65536 | sequence.edited.text | string | 110342.73 | 4223.31 |
| 65536 | sequence.masked.text | string | 4095.64 | 91.99 |
| 1048576 | insert | array | 3544837.50 | 75450.00 |
| 1048576 | insert.append | array | 25456050.00 | 908925.00 |
| 1048576 | replace | array | 9176800.00 | 258516.67 |
| 1048576 | remove | array | 5213880.00 | 238410.00 |
| 1048576 | remove.middle | array | 2835822.22 | 591075.00 |
| 1048576 | replace.middle | array | 2649790.00 | 1470680.00 |
| 1048576 | apply | array | 1230.82 | 177.79 |
| 1048576 | apply.array | array | 592.82 | 85.15 |
| 1048576 | concurrent.apply | array | 75720100.00 | 7134000.00 |
| 1048576 | merge | array | 3327000.00 | 215452.68 |
| 1048576 | create | array | 3252400.00 | 364487.50 |
| 1048576 | value.random | array | 47.36 | 7.65 |
| 1048576 | values.range | array | 123.96 | 32.96 |
| 1048576 | values.array | array | 2651620.00 | 2251154.55 |
| 1048576 | values.text | array | 12800700.00 | 541650.00 |
| 1048576 | sequence.array | array | 2540910.00 | 80654.55 |
| 1048576 | sequence.text | array | 60675350.00 | 2672000.00 |
| 1048576 | sequence.edited.text | array | 67837450.00 | 4042000.00 |
| 1048576 | sequence.masked.text | array | 61237050.00 | 696900.00 |
| 1048576 | insert | string | 474.00 | 76.70 |
| 1048576 | insert.append | string | 591188.37 | 134856.31 |
| 1048576 | replace | string | 1734.83 | 126.83 |
| 1048576 | remove | string | 1439.69 | 191.76 |
| 1048576 | remove.middle | string | 951.23 | 47.06 |
| 1048576 | replace.middle | string | 1340.10 | 67.42 |
| 1048576 | apply | string | 1036.63 | 79.35 |
| 1048576 | apply.array | string | 3537375.00 | 79793.75 |
| 1048576 | concurrent.apply | string | 1411855.56 | 122953.45 |
| 1048576 | merge | string | 1112.43 | 161.08 |
| 1048576 | create | string | 1120.31 | 36.19 |
| 1048576 | value.random | string | 50.10 | 11.12 |
| 1048576 | values.range | string | 146.98 | 2.25 |
| 1048576 | values.array | string | 3595512.50 | 111231.25 |
| 1048576 | values.text | string | 62.09 | 3.87 |
| 1048576 | sequence.array | string | 3414325.00 | 71350.00 |
| 1048576 | sequence.text | string | 203.12 | 2.72 |
| 1048576 | sequence.edited.text | string | 1728926.67 | 207314.66 |
| 1048576 | sequence.masked.text | string | 3785.43 | 47.82 |

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

Measured on Node 24.16.0, V8 13.6.233.17-node.49, win32 x64, Intel(R) Core(TM) i5-10210U CPU @ 1.60GHz. Splitting and text assembly are included where required; peer preparation, encoding and explicit JS process garbage collection are outside API timings.
