# Large string benchmarks

2026-11-22T17:22:50.234Z · [CI run](https://github.com/sovereignbase/sequencer/actions/runs/45048530438)

3 runs; times are median ns/call. IQR is Q3 minus Q1.

| UTF-16 code units | Operation | Representation | Median ns | IQR ns |
| ---: | --- | --- | ---: | ---: |
| 1024 | insert | array | 1086.97 | 104.32 |
| 1024 | insert.append | array | 9493.17 | 1684.47 |
| 1024 | replace | array | 3326.73 | 254.69 |
| 1024 | remove | array | 2253.09 | 337.56 |
| 1024 | remove.middle | array | 1278.17 | 198.63 |
| 1024 | replace.middle | array | 1550.00 | 272.37 |
| 1024 | apply | array | 465.00 | 18.58 |
| 1024 | apply.array | array | 316.09 | 27.71 |
| 1024 | concurrent.apply | array | 33021.66 | 741.60 |
| 1024 | merge | array | 1526.35 | 176.48 |
| 1024 | create | array | 1537.63 | 138.88 |
| 1024 | value.random | array | 33.39 | 3.85 |
| 1024 | values.range | array | 86.57 | 14.49 |
| 1024 | values.array | array | 655.01 | 155.99 |
| 1024 | values.text | array | 6756.00 | 454.00 |
| 1024 | sequence.array | array | 740.18 | 89.82 |
| 1024 | sequence.text | array | 3789.27 | 103.72 |
| 1024 | sequence.edited.text | array | 6654.57 | 85.84 |
| 1024 | sequence.masked.text | array | 5576.26 | 249.48 |
| 1024 | insert | string | 259.20 | 27.74 |
| 1024 | insert.append | string | 2147.50 | 269.96 |
| 1024 | replace | string | 853.54 | 60.87 |
| 1024 | remove | string | 546.84 | 24.28 |
| 1024 | remove.middle | string | 586.88 | 12.16 |
| 1024 | replace.middle | string | 775.12 | 74.37 |
| 1024 | apply | string | 526.65 | 43.34 |
| 1024 | apply.array | string | 1096.04 | 56.51 |
| 1024 | concurrent.apply | string | 1845.77 | 59.14 |
| 1024 | merge | string | 701.43 | 43.46 |
| 1024 | create | string | 724.77 | 20.58 |
| 1024 | value.random | string | 35.87 | 5.48 |
| 1024 | values.range | string | 86.82 | 4.00 |
| 1024 | values.array | string | 785.74 | 60.57 |
| 1024 | values.text | string | 46.05 | 5.07 |
| 1024 | sequence.array | string | 958.72 | 69.07 |
| 1024 | sequence.text | string | 97.70 | 1.41 |
| 1024 | sequence.edited.text | string | 1209.85 | 135.60 |
| 1024 | sequence.masked.text | string | 2312.91 | 78.94 |
| 65536 | insert | array | 204219.36 | 7134.29 |
| 65536 | insert.append | array | 878252.28 | 46989.74 |
| 65536 | replace | array | 482202.02 | 34896.29 |
| 65536 | remove | array | 270934.46 | 21620.37 |
| 65536 | remove.middle | array | 214680.74 | 10259.12 |
| 65536 | replace.middle | array | 214140.63 | 4704.99 |
| 65536 | apply | array | 602.59 | 64.75 |
| 65536 | apply.array | array | 326.24 | 58.56 |
| 65536 | concurrent.apply | array | 2511037.10 | 53967.90 |
| 65536 | merge | array | 204587.42 | 5855.08 |
| 65536 | create | array | 205438.54 | 29226.04 |
| 65536 | value.random | array | 42.23 | 7.08 |
| 65536 | values.range | array | 56.85 | 30.52 |
| 65536 | values.array | array | 214685.81 | 5027.47 |
| 65536 | values.text | array | 529209.73 | 1347.04 |
| 65536 | sequence.array | array | 210712.06 | 1564.18 |
| 65536 | sequence.text | array | 286970.41 | 61875.86 |
| 65536 | sequence.edited.text | array | 434048.21 | 125800.31 |
| 65536 | sequence.masked.text | array | 288161.43 | 61949.14 |
| 65536 | insert | string | 219.29 | 4.19 |
| 65536 | insert.append | string | 7760.02 | 73.15 |
| 65536 | replace | string | 875.53 | 75.16 |
| 65536 | remove | string | 562.10 | 10.20 |
| 65536 | remove.middle | string | 568.39 | 11.86 |
| 65536 | replace.middle | string | 774.47 | 24.19 |
| 65536 | apply | string | 441.93 | 44.39 |
| 65536 | apply.array | string | 211075.84 | 15472.65 |
| 65536 | concurrent.apply | string | 99125.34 | 337.34 |
| 65536 | merge | string | 679.04 | 43.50 |
| 65536 | create | string | 677.35 | 51.59 |
| 65536 | value.random | string | 26.83 | 3.70 |
| 65536 | values.range | string | 90.89 | 13.21 |
| 65536 | values.array | string | 205146.29 | 636.62 |
| 65536 | values.text | string | 46.31 | 8.28 |
| 65536 | sequence.array | string | 200588.09 | 3714.71 |
| 65536 | sequence.text | string | 92.22 | 2.84 |
| 65536 | sequence.edited.text | string | 48539.51 | 174.89 |
| 65536 | sequence.masked.text | string | 2212.92 | 10.16 |
| 1048576 | insert | array | 3435712.13 | 45705.75 |
| 1048576 | insert.append | array | 20058860.00 | 1003790.25 |
| 1048576 | replace | array | 8690714.33 | 134042.33 |
| 1048576 | remove | array | 4550973.67 | 23490.75 |
| 1048576 | remove.middle | array | 3854607.43 | 52503.07 |
| 1048576 | replace.middle | array | 3794222.14 | 43160.86 |
| 1048576 | apply | array | 588.09 | 20.89 |
| 1048576 | apply.array | array | 347.61 | 17.42 |
| 1048576 | concurrent.apply | array | 55724674.00 | 54760.00 |
| 1048576 | merge | array | 3156523.62 | 109236.97 |
| 1048576 | create | array | 2928760.00 | 43772.22 |
| 1048576 | value.random | array | 20.72 | 2.78 |
| 1048576 | values.range | array | 54.88 | 0.08 |
| 1048576 | values.array | array | 3454040.13 | 26625.81 |
| 1048576 | values.text | array | 8742476.00 | 154712.17 |
| 1048576 | sequence.array | array | 3433029.13 | 159241.75 |
| 1048576 | sequence.text | array | 39375896.00 | 437328.25 |
| 1048576 | sequence.edited.text | array | 41419846.00 | 1433643.50 |
| 1048576 | sequence.masked.text | array | 38946492.50 | 1817671.50 |
| 1048576 | insert | string | 277.66 | 2.85 |
| 1048576 | insert.append | string | 404995.55 | 15603.56 |
| 1048576 | replace | string | 920.16 | 55.15 |
| 1048576 | remove | string | 716.08 | 24.56 |
| 1048576 | remove.middle | string | 623.04 | 13.69 |
| 1048576 | replace.middle | string | 870.31 | 16.79 |
| 1048576 | apply | string | 602.84 | 41.66 |
| 1048576 | apply.array | string | 3446228.25 | 44345.50 |
| 1048576 | concurrent.apply | string | 1730937.63 | 46179.38 |
| 1048576 | merge | string | 654.38 | 76.22 |
| 1048576 | create | string | 667.08 | 26.60 |
| 1048576 | value.random | string | 26.33 | 5.00 |
| 1048576 | values.range | string | 99.71 | 15.09 |
| 1048576 | values.array | string | 3296333.62 | 62688.06 |
| 1048576 | values.text | string | 39.77 | 9.42 |
| 1048576 | sequence.array | string | 3277350.37 | 45408.37 |
| 1048576 | sequence.text | string | 111.11 | 3.78 |
| 1048576 | sequence.edited.text | string | 868974.90 | 5812.95 |
| 1048576 | sequence.masked.text | string | 2189.45 | 85.36 |

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
