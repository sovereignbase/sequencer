# Large string benchmarks

2026-11-22T17:32:52.835Z · [CI run](https://github.com/sovereignbase/sequencer/actions/runs/45049365331)

3 runs; times are median ns/call. IQR is Q3 minus Q1.

| UTF-16 code units | Operation | Representation | Median ns | IQR ns |
| ---: | --- | --- | ---: | ---: |
| 1024 | insert | array | 1451.79 | 150.50 |
| 1024 | insert.append | array | 14445.18 | 2242.81 |
| 1024 | replace | array | 4814.28 | 318.56 |
| 1024 | remove | array | 2760.27 | 112.59 |
| 1024 | remove.middle | array | 1568.67 | 33.07 |
| 1024 | replace.middle | array | 1916.12 | 27.32 |
| 1024 | apply | array | 879.20 | 48.48 |
| 1024 | apply.array | array | 584.59 | 57.42 |
| 1024 | concurrent.apply | array | 45935.68 | 990.41 |
| 1024 | merge | array | 1832.92 | 318.93 |
| 1024 | create | array | 2091.55 | 75.77 |
| 1024 | value.random | array | 36.53 | 8.43 |
| 1024 | values.range | array | 88.68 | 10.93 |
| 1024 | values.array | array | 840.91 | 115.09 |
| 1024 | values.text | array | 9421.99 | 662.60 |
| 1024 | sequence.array | array | 1060.12 | 85.30 |
| 1024 | sequence.text | array | 6159.43 | 64.25 |
| 1024 | sequence.edited.text | array | 9982.80 | 512.96 |
| 1024 | sequence.masked.text | array | 8038.23 | 489.65 |
| 1024 | insert | string | 470.81 | 45.49 |
| 1024 | insert.append | string | 2671.39 | 619.71 |
| 1024 | replace | string | 1647.79 | 72.06 |
| 1024 | remove | string | 1066.34 | 90.96 |
| 1024 | remove.middle | string | 952.18 | 28.97 |
| 1024 | replace.middle | string | 1238.10 | 73.01 |
| 1024 | apply | string | 988.36 | 82.57 |
| 1024 | apply.array | string | 1482.41 | 140.77 |
| 1024 | concurrent.apply | string | 3046.44 | 160.35 |
| 1024 | merge | string | 1123.39 | 105.18 |
| 1024 | create | string | 1221.83 | 80.10 |
| 1024 | value.random | string | 39.89 | 3.18 |
| 1024 | values.range | string | 130.81 | 18.93 |
| 1024 | values.array | string | 1175.53 | 113.79 |
| 1024 | values.text | string | 65.16 | 10.57 |
| 1024 | sequence.array | string | 1184.46 | 278.57 |
| 1024 | sequence.text | string | 163.48 | 39.77 |
| 1024 | sequence.edited.text | string | 1800.07 | 135.07 |
| 1024 | sequence.masked.text | string | 3038.85 | 37.14 |
| 65536 | insert | array | 283639.11 | 25413.22 |
| 65536 | insert.append | array | 1158076.14 | 1706.73 |
| 65536 | replace | array | 711277.11 | 65494.52 |
| 65536 | remove | array | 413260.86 | 25495.16 |
| 65536 | remove.middle | array | 322840.08 | 9965.01 |
| 65536 | replace.middle | array | 321747.13 | 39634.94 |
| 65536 | apply | array | 1402.52 | 142.63 |
| 65536 | apply.array | array | 733.43 | 149.11 |
| 65536 | concurrent.apply | array | 3572681.00 | 319296.12 |
| 65536 | merge | array | 283499.80 | 24100.94 |
| 65536 | create | array | 281127.13 | 20467.62 |
| 65536 | value.random | array | 41.38 | 2.13 |
| 65536 | values.range | array | 82.12 | 51.76 |
| 65536 | values.array | array | 246560.37 | 24528.48 |
| 65536 | values.text | array | 752687.62 | 1633.18 |
| 65536 | sequence.array | array | 238855.28 | 20226.72 |
| 65536 | sequence.text | array | 435361.37 | 141502.31 |
| 65536 | sequence.edited.text | array | 644498.72 | 126243.20 |
| 65536 | sequence.masked.text | array | 436710.77 | 215372.97 |
| 65536 | insert | string | 439.24 | 53.37 |
| 65536 | insert.append | string | 10234.12 | 3001.57 |
| 65536 | replace | string | 1689.23 | 144.25 |
| 65536 | remove | string | 972.61 | 42.21 |
| 65536 | remove.middle | string | 952.58 | 8.82 |
| 65536 | replace.middle | string | 1245.78 | 11.03 |
| 65536 | apply | string | 857.97 | 86.89 |
| 65536 | apply.array | string | 276482.33 | 4991.18 |
| 65536 | concurrent.apply | string | 134170.96 | 1221.69 |
| 65536 | merge | string | 1083.08 | 63.94 |
| 65536 | create | string | 1086.38 | 51.95 |
| 65536 | value.random | string | 42.21 | 4.67 |
| 65536 | values.range | string | 110.43 | 19.55 |
| 65536 | values.array | string | 276537.10 | 65846.97 |
| 65536 | values.text | string | 65.54 | 7.88 |
| 65536 | sequence.array | string | 278379.38 | 69860.98 |
| 65536 | sequence.text | string | 177.47 | 1.38 |
| 65536 | sequence.edited.text | string | 66519.51 | 329.23 |
| 65536 | sequence.masked.text | string | 3062.63 | 92.36 |
| 1048576 | insert | array | 4326491.83 | 23152.25 |
| 1048576 | insert.append | array | 26411638.00 | 196313.25 |
| 1048576 | replace | array | 10896794.00 | 36870.50 |
| 1048576 | remove | array | 5834249.20 | 62789.60 |
| 1048576 | remove.middle | array | 4722399.67 | 34652.08 |
| 1048576 | replace.middle | array | 4713665.33 | 58459.67 |
| 1048576 | apply | array | 1347.33 | 57.86 |
| 1048576 | apply.array | array | 591.90 | 4.32 |
| 1048576 | concurrent.apply | array | 60407908.00 | 1086494.50 |
| 1048576 | merge | array | 4254275.33 | 45146.64 |
| 1048576 | create | array | 4173012.33 | 17726.15 |
| 1048576 | value.random | array | 30.69 | 3.72 |
| 1048576 | values.range | array | 74.11 | 3.74 |
| 1048576 | values.array | array | 4542976.29 | 548626.29 |
| 1048576 | values.text | array | 12315214.33 | 152018.00 |
| 1048576 | sequence.array | array | 4517118.00 | 360586.75 |
| 1048576 | sequence.text | array | 38427552.00 | 127410.25 |
| 1048576 | sequence.edited.text | array | 42062533.00 | 1128408.50 |
| 1048576 | sequence.masked.text | array | 41290053.00 | 2396457.50 |
| 1048576 | insert | string | 511.04 | 53.61 |
| 1048576 | insert.append | string | 487763.12 | 5719.66 |
| 1048576 | replace | string | 1670.96 | 139.82 |
| 1048576 | remove | string | 1100.83 | 84.58 |
| 1048576 | remove.middle | string | 1051.26 | 64.34 |
| 1048576 | replace.middle | string | 1287.65 | 24.29 |
| 1048576 | apply | string | 1095.11 | 75.85 |
| 1048576 | apply.array | string | 4319952.83 | 41900.00 |
| 1048576 | concurrent.apply | string | 1903935.50 | 39210.06 |
| 1048576 | merge | string | 1112.24 | 25.45 |
| 1048576 | create | string | 1068.17 | 29.05 |
| 1048576 | value.random | string | 44.83 | 4.43 |
| 1048576 | values.range | string | 115.00 | 13.31 |
| 1048576 | values.array | string | 4178324.00 | 12642.42 |
| 1048576 | values.text | string | 48.68 | 0.57 |
| 1048576 | sequence.array | string | 4149284.43 | 30912.75 |
| 1048576 | sequence.text | string | 141.76 | 16.87 |
| 1048576 | sequence.edited.text | string | 1116941.22 | 2257.22 |
| 1048576 | sequence.masked.text | string | 3049.43 | 170.72 |

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
