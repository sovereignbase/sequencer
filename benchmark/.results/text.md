# Large string benchmarks

2026-11-20T20:13:10.487Z · local run

3 runs; times are median ns/call. IQR is Q3 minus Q1.

| UTF-16 code units | Operation | Representation | Median ns | IQR ns |
| ---: | --- | --- | ---: | ---: |
| 1024 | insert | array | 1963.50 | 212.33 |
| 1024 | insert.append | array | 16861.97 | 2153.51 |
| 1024 | replace | array | 6644.88 | 304.76 |
| 1024 | remove | array | 4197.90 | 154.60 |
| 1024 | remove.middle | array | 2097.49 | 268.90 |
| 1024 | replace.middle | array | 2441.13 | 138.78 |
| 1024 | apply | array | 767.88 | 101.98 |
| 1024 | apply.array | array | 575.93 | 24.54 |
| 1024 | concurrent.apply | array | 63371.14 | 3252.44 |
| 1024 | merge | array | 3024.60 | 251.02 |
| 1024 | create | array | 3268.26 | 1587.76 |
| 1024 | value.random | array | 51.17 | 17.25 |
| 1024 | values.range | array | 126.98 | 12.62 |
| 1024 | values.array | array | 1333.01 | 83.84 |
| 1024 | values.text | array | 13557.34 | 4575.95 |
| 1024 | sequence.array | array | 1452.85 | 54.59 |
| 1024 | sequence.text | array | 9431.61 | 141.09 |
| 1024 | sequence.edited.text | array | 14540.58 | 187.60 |
| 1024 | sequence.masked.text | array | 11045.05 | 467.23 |
| 1024 | insert | string | 391.98 | 38.46 |
| 1024 | insert.append | string | 3899.08 | 280.60 |
| 1024 | replace | string | 1489.75 | 201.62 |
| 1024 | remove | string | 1154.97 | 90.01 |
| 1024 | remove.middle | string | 1023.29 | 36.01 |
| 1024 | replace.middle | string | 1409.50 | 179.17 |
| 1024 | apply | string | 766.86 | 73.86 |
| 1024 | apply.array | string | 2347.34 | 70.34 |
| 1024 | concurrent.apply | string | 3569.80 | 193.50 |
| 1024 | merge | string | 1152.37 | 107.56 |
| 1024 | create | string | 1151.31 | 19.59 |
| 1024 | value.random | string | 52.33 | 1.07 |
| 1024 | values.range | string | 174.68 | 41.43 |
| 1024 | values.array | string | 1964.98 | 195.20 |
| 1024 | values.text | string | 68.48 | 2.15 |
| 1024 | sequence.array | string | 2200.81 | 78.14 |
| 1024 | sequence.text | string | 199.00 | 18.23 |
| 1024 | sequence.edited.text | string | 2523.82 | 520.23 |
| 1024 | sequence.masked.text | string | 4079.17 | 289.24 |
| 65536 | insert | array | 264528.12 | 11892.85 |
| 65536 | insert.append | array | 1131656.52 | 15898.26 |
| 65536 | replace | array | 668960.47 | 21131.06 |
| 65536 | remove | array | 411893.75 | 32347.24 |
| 65536 | remove.middle | array | 258965.98 | 9793.67 |
| 65536 | replace.middle | array | 241649.04 | 8833.43 |
| 65536 | apply | array | 1065.20 | 179.93 |
| 65536 | apply.array | array | 633.75 | 41.85 |
| 65536 | concurrent.apply | array | 4435716.67 | 469325.00 |
| 65536 | merge | array | 249767.19 | 23870.90 |
| 65536 | create | array | 253597.66 | 24193.51 |
| 65536 | value.random | array | 49.59 | 3.67 |
| 65536 | values.range | array | 145.87 | 17.40 |
| 65536 | values.array | array | 222256.35 | 11701.57 |
| 65536 | values.text | array | 825458.06 | 29357.51 |
| 65536 | sequence.array | array | 210976.98 | 1828.74 |
| 65536 | sequence.text | array | 628477.50 | 155697.39 |
| 65536 | sequence.edited.text | array | 908387.50 | 389917.19 |
| 65536 | sequence.masked.text | array | 697305.56 | 81776.87 |
| 65536 | insert | string | 372.18 | 56.54 |
| 65536 | insert.append | string | 16425.24 | 4190.51 |
| 65536 | replace | string | 1549.44 | 154.13 |
| 65536 | remove | string | 1114.34 | 148.37 |
| 65536 | remove.middle | string | 1058.50 | 89.21 |
| 65536 | replace.middle | string | 1335.53 | 71.33 |
| 65536 | apply | string | 708.00 | 43.71 |
| 65536 | apply.array | string | 248120.31 | 25244.95 |
| 65536 | concurrent.apply | string | 144743.35 | 7401.23 |
| 65536 | merge | string | 1157.09 | 51.76 |
| 65536 | create | string | 1099.56 | 55.97 |
| 65536 | value.random | string | 47.03 | 6.97 |
| 65536 | values.range | string | 158.39 | 3.26 |
| 65536 | values.array | string | 256055.47 | 8346.48 |
| 65536 | values.text | string | 69.24 | 23.05 |
| 65536 | sequence.array | string | 251768.75 | 27765.21 |
| 65536 | sequence.text | string | 213.61 | 21.80 |
| 65536 | sequence.edited.text | string | 101953.66 | 2351.66 |
| 65536 | sequence.masked.text | string | 3907.83 | 43.81 |
| 1048576 | insert | array | 3346587.50 | 41043.75 |
| 1048576 | insert.append | array | 26316700.00 | 813175.00 |
| 1048576 | replace | array | 8919266.67 | 530683.33 |
| 1048576 | remove | array | 5602000.00 | 314390.00 |
| 1048576 | remove.middle | array | 2542390.00 | 19455.00 |
| 1048576 | replace.middle | array | 2681880.00 | 291136.25 |
| 1048576 | apply | array | 1039.31 | 4.15 |
| 1048576 | apply.array | array | 560.63 | 133.80 |
| 1048576 | concurrent.apply | array | 68293600.00 | 1957550.00 |
| 1048576 | merge | array | 3315987.50 | 190764.29 |
| 1048576 | create | array | 3362737.50 | 1052793.33 |
| 1048576 | value.random | array | 52.12 | 3.07 |
| 1048576 | values.range | array | 154.92 | 28.87 |
| 1048576 | values.array | array | 2533060.00 | 150822.73 |
| 1048576 | values.text | array | 12898800.00 | 475050.00 |
| 1048576 | sequence.array | array | 2354200.00 | 90381.82 |
| 1048576 | sequence.text | array | 59511650.00 | 6796650.00 |
| 1048576 | sequence.edited.text | array | 50785200.00 | 5117950.00 |
| 1048576 | sequence.masked.text | array | 53901900.00 | 6472500.00 |
| 1048576 | insert | string | 411.12 | 20.06 |
| 1048576 | insert.append | string | 579093.18 | 22885.79 |
| 1048576 | replace | string | 1743.32 | 66.74 |
| 1048576 | remove | string | 1015.23 | 265.69 |
| 1048576 | remove.middle | string | 1072.81 | 77.64 |
| 1048576 | replace.middle | string | 1260.67 | 14.56 |
| 1048576 | apply | string | 687.10 | 68.99 |
| 1048576 | apply.array | string | 3495762.50 | 58331.25 |
| 1048576 | concurrent.apply | string | 1278655.00 | 71949.72 |
| 1048576 | merge | string | 1098.19 | 6.87 |
| 1048576 | create | string | 1091.35 | 13.19 |
| 1048576 | value.random | string | 45.15 | 8.74 |
| 1048576 | values.range | string | 162.31 | 12.66 |
| 1048576 | values.array | string | 3457000.00 | 203775.00 |
| 1048576 | values.text | string | 65.24 | 0.74 |
| 1048576 | sequence.array | string | 3307087.50 | 115325.00 |
| 1048576 | sequence.text | string | 188.44 | 4.20 |
| 1048576 | sequence.edited.text | string | 1749173.33 | 16020.00 |
| 1048576 | sequence.masked.text | string | 3704.20 | 109.67 |

Encoded snapshots use string Footage in both representations.

## Estimated retained memory and snapshot size

| UTF-16 code units | Representation | Estimated MiB | Snapshot MessagePack KiB | Snapshot gzip KiB | Gossip MessagePack KiB | Gossip gzip KiB |
| ---: | --- | ---: | ---: | ---: | ---: | ---: |
| 1024 | array | 0.0082 | 1.02 | 0.04 | 2.02 | 0.05 |
| 1024 | string | 0.0023 | 1.02 | 0.05 | 1.02 | 0.05 |
| 65536 | array | 0.5004 | 64.02 | 0.12 | 128.02 | 0.18 |
| 65536 | string | 0.1254 | 64.02 | 0.12 | 64.02 | 0.12 |
| 1048576 | array | 8.0004 | 1024.02 | 1.05 | 2048.02 | 2.05 |
| 1048576 | string | 2.0004 | 1024.02 | 1.05 | 1024.02 | 1.05 |

Measured on Node 24.16.0, V8 13.6.233.17-node.49, win32 x64, Intel(R) Core(TM) i5-10210U CPU @ 1.60GHz. Splitting and text assembly are included where required; peer preparation, encoding and explicit JS process garbage collection are outside API timings.
