# Large string benchmarks

2026-11-21T13:40:59.675Z · local run

3 runs; times are median ns/call. IQR is Q3 minus Q1.

| UTF-16 code units | Operation | Representation | Median ns | IQR ns |
| ---: | --- | --- | ---: | ---: |
| 1024 | insert | array | 3566.43 | 1791.51 |
| 1024 | insert.append | array | 32595.05 | 4648.25 |
| 1024 | replace | array | 13770.21 | 6040.31 |
| 1024 | remove | array | 8964.47 | 3444.51 |
| 1024 | remove.middle | array | 3233.45 | 434.41 |
| 1024 | replace.middle | array | 3942.18 | 2013.94 |
| 1024 | apply | array | 2173.68 | 215.56 |
| 1024 | apply.array | array | 1092.66 | 25.32 |
| 1024 | concurrent.apply | array | 135220.00 | 11884.47 |
| 1024 | merge | array | 4888.91 | 1232.54 |
| 1024 | create | array | 5431.31 | 610.38 |
| 1024 | value.random | array | 106.56 | 47.01 |
| 1024 | values.range | array | 296.58 | 91.93 |
| 1024 | values.array | array | 1620.50 | 114.34 |
| 1024 | values.text | array | 24810.22 | 2792.74 |
| 1024 | sequence.array | array | 2283.92 | 561.98 |
| 1024 | sequence.text | array | 18537.51 | 1869.72 |
| 1024 | sequence.edited.text | array | 25759.84 | 605.49 |
| 1024 | sequence.masked.text | array | 20873.79 | 783.04 |
| 1024 | insert | string | 747.94 | 260.13 |
| 1024 | insert.append | string | 10016.23 | 1609.96 |
| 1024 | replace | string | 3206.50 | 137.13 |
| 1024 | remove | string | 1963.94 | 332.95 |
| 1024 | remove.middle | string | 2273.28 | 414.73 |
| 1024 | replace.middle | string | 2700.46 | 771.21 |
| 1024 | apply | string | 1985.47 | 450.23 |
| 1024 | apply.array | string | 4650.80 | 664.18 |
| 1024 | concurrent.apply | string | 6964.43 | 2848.44 |
| 1024 | merge | string | 2307.84 | 914.31 |
| 1024 | create | string | 2357.26 | 718.62 |
| 1024 | value.random | string | 95.98 | 7.35 |
| 1024 | values.range | string | 318.86 | 57.15 |
| 1024 | values.array | string | 3423.95 | 110.00 |
| 1024 | values.text | string | 139.27 | 387.55 |
| 1024 | sequence.array | string | 4251.96 | 755.76 |
| 1024 | sequence.text | string | 510.53 | 62.39 |
| 1024 | sequence.edited.text | string | 4579.85 | 2529.26 |
| 1024 | sequence.masked.text | string | 6335.16 | 3635.90 |
| 65536 | insert | array | 363534.78 | 124776.37 |
| 65536 | insert.append | array | 1990376.92 | 122878.85 |
| 65536 | replace | array | 830100.00 | 252506.25 |
| 65536 | remove | array | 525233.33 | 52074.16 |
| 65536 | remove.middle | array | 413447.54 | 51137.50 |
| 65536 | replace.middle | array | 554920.31 | 109515.39 |
| 65536 | apply | array | 3228.72 | 681.63 |
| 65536 | apply.array | array | 1232.42 | 452.84 |
| 65536 | concurrent.apply | array | 7856350.00 | 6614470.00 |
| 65536 | merge | array | 438857.89 | 98158.67 |
| 65536 | create | array | 462463.64 | 94279.42 |
| 65536 | value.random | array | 131.86 | 58.33 |
| 65536 | values.range | array | 427.66 | 62.71 |
| 65536 | values.array | array | 277823.08 | 24750.49 |
| 65536 | values.text | array | 1698313.33 | 190993.07 |
| 65536 | sequence.array | array | 265052.63 | 123925.63 |
| 65536 | sequence.text | array | 930262.96 | 551898.15 |
| 65536 | sequence.edited.text | array | 1601187.50 | 209907.94 |
| 65536 | sequence.masked.text | array | 1094417.39 | 234670.37 |
| 65536 | insert | string | 764.16 | 119.95 |
| 65536 | insert.append | string | 20402.45 | 6201.46 |
| 65536 | replace | string | 3608.82 | 1053.85 |
| 65536 | remove | string | 2055.69 | 189.79 |
| 65536 | remove.middle | string | 2228.61 | 599.35 |
| 65536 | replace.middle | string | 2791.69 | 641.08 |
| 65536 | apply | string | 2644.67 | 596.68 |
| 65536 | apply.array | string | 372977.94 | 30000.58 |
| 65536 | concurrent.apply | string | 269157.45 | 12791.81 |
| 65536 | merge | string | 2389.55 | 270.32 |
| 65536 | create | string | 2419.53 | 279.63 |
| 65536 | value.random | string | 103.41 | 19.62 |
| 65536 | values.range | string | 335.83 | 69.60 |
| 65536 | values.array | string | 332328.95 | 55149.62 |
| 65536 | values.text | string | 242.07 | 76.39 |
| 65536 | sequence.array | string | 417906.67 | 77656.14 |
| 65536 | sequence.text | string | 487.84 | 28.78 |
| 65536 | sequence.edited.text | string | 191350.38 | 44617.07 |
| 65536 | sequence.masked.text | string | 6817.62 | 1283.38 |
| 1048576 | insert | array | 5452760.00 | 818441.67 |
| 1048576 | insert.append | array | 33146000.00 | 2071350.00 |
| 1048576 | replace | array | 13030450.00 | 1645983.33 |
| 1048576 | remove | array | 10007075.00 | 752525.00 |
| 1048576 | remove.middle | array | 4362000.00 | 902255.00 |
| 1048576 | replace.middle | array | 3763285.71 | 644860.42 |
| 1048576 | apply | array | 2443.71 | 311.50 |
| 1048576 | apply.array | array | 1028.42 | 129.52 |
| 1048576 | concurrent.apply | array | 109470900.00 | 3874700.00 |
| 1048576 | merge | array | 4858433.33 | 571757.14 |
| 1048576 | create | array | 4817900.00 | 536454.76 |
| 1048576 | value.random | array | 84.58 | 44.02 |
| 1048576 | values.range | array | 285.39 | 47.39 |
| 1048576 | values.array | array | 4362228.57 | 513457.14 |
| 1048576 | values.text | array | 25969000.00 | 2826325.00 |
| 1048576 | sequence.array | array | 4816457.14 | 626035.71 |
| 1048576 | sequence.text | array | 105669750.00 | 10013825.00 |
| 1048576 | sequence.edited.text | array | 87367200.00 | 15961775.00 |
| 1048576 | sequence.masked.text | array | 95537500.00 | 8040925.00 |
| 1048576 | insert | string | 746.07 | 36.54 |
| 1048576 | insert.append | string | 1061054.17 | 182429.91 |
| 1048576 | replace | string | 3308.43 | 1124.27 |
| 1048576 | remove | string | 2335.12 | 407.20 |
| 1048576 | remove.middle | string | 1986.99 | 1224.09 |
| 1048576 | replace.middle | string | 2367.65 | 52.03 |
| 1048576 | apply | string | 2396.92 | 317.68 |
| 1048576 | apply.array | string | 5068450.00 | 696242.50 |
| 1048576 | concurrent.apply | string | 1937653.85 | 104660.58 |
| 1048576 | merge | string | 2279.59 | 527.59 |
| 1048576 | create | string | 2288.76 | 341.81 |
| 1048576 | value.random | string | 86.74 | 22.56 |
| 1048576 | values.range | string | 353.87 | 126.66 |
| 1048576 | values.array | string | 4653366.67 | 178816.67 |
| 1048576 | values.text | string | 125.54 | 70.21 |
| 1048576 | sequence.array | string | 4695900.00 | 13651783.33 |
| 1048576 | sequence.text | string | 469.81 | 112.02 |
| 1048576 | sequence.edited.text | string | 3399037.50 | 169443.75 |
| 1048576 | sequence.masked.text | string | 7276.48 | 538.16 |

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
