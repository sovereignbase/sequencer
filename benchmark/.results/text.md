# Large string benchmarks

2026-11-27T16:49:16.425Z · [CI run](https://github.com/sovereignbase/sequencer/actions/runs/46035866481)

3 runs; times are median ns/call. IQR is Q3 minus Q1.

| UTF-16 code units | Operation | Representation | Median ns | IQR ns |
| ---: | --- | --- | ---: | ---: |
| 1024 | insert | array | 1495.42 | 114.58 |
| 1024 | insert.append | array | 14042.04 | 2441.71 |
| 1024 | replace | array | 2372.66 | 109.33 |
| 1024 | remove | array | 870.27 | 33.81 |
| 1024 | remove.middle | array | 1646.58 | 192.16 |
| 1024 | replace.middle | array | 1901.18 | 152.08 |
| 1024 | apply | array | 776.10 | 103.70 |
| 1024 | apply.array | array | 539.56 | 39.68 |
| 1024 | concurrent.apply | array | 41210.65 | 1463.37 |
| 1024 | merge | array | 2002.49 | 191.62 |
| 1024 | create | array | 2086.62 | 144.30 |
| 1024 | value.random | array | 46.41 | 8.19 |
| 1024 | values.range | array | 107.90 | 11.53 |
| 1024 | values.array | array | 641.12 | 198.02 |
| 1024 | values.text | array | 8453.97 | 13.87 |
| 1024 | sequence.array | array | 733.10 | 184.81 |
| 1024 | sequence.text | array | 6764.24 | 250.35 |
| 1024 | sequence.edited.text | array | 10331.15 | 192.58 |
| 1024 | sequence.masked.text | array | 7887.84 | 166.98 |
| 1024 | insert | string | 394.22 | 54.92 |
| 1024 | insert.append | string | 3198.66 | 30.49 |
| 1024 | replace | string | 1372.11 | 38.60 |
| 1024 | remove | string | 1048.49 | 134.15 |
| 1024 | remove.middle | string | 864.89 | 28.60 |
| 1024 | replace.middle | string | 1294.05 | 187.94 |
| 1024 | apply | string | 777.68 | 121.01 |
| 1024 | apply.array | string | 1623.32 | 52.99 |
| 1024 | concurrent.apply | string | 3158.63 | 40.82 |
| 1024 | merge | string | 1075.33 | 200.74 |
| 1024 | create | string | 868.90 | 70.44 |
| 1024 | value.random | string | 37.33 | 1.21 |
| 1024 | values.range | string | 140.68 | 15.55 |
| 1024 | values.array | string | 1085.43 | 74.80 |
| 1024 | values.text | string | 54.06 | 5.35 |
| 1024 | sequence.array | string | 1175.18 | 24.65 |
| 1024 | sequence.text | string | 139.34 | 14.95 |
| 1024 | sequence.edited.text | string | 1565.19 | 89.17 |
| 1024 | sequence.masked.text | string | 2675.82 | 124.64 |
| 65536 | insert | array | 255843.22 | 12957.34 |
| 65536 | insert.append | array | 1126608.65 | 9768.78 |
| 65536 | replace | array | 294284.19 | 4453.44 |
| 65536 | remove | array | 1553.53 | 73.60 |
| 65536 | remove.middle | array | 288612.54 | 12824.01 |
| 65536 | replace.middle | array | 290936.24 | 19936.13 |
| 65536 | apply | array | 898.31 | 29.88 |
| 65536 | apply.array | array | 535.51 | 21.29 |
| 65536 | concurrent.apply | array | 3173833.88 | 232017.80 |
| 65536 | merge | array | 251746.36 | 11971.44 |
| 65536 | create | array | 247232.98 | 12119.31 |
| 65536 | value.random | array | 49.53 | 5.50 |
| 65536 | values.range | array | 106.25 | 30.78 |
| 65536 | values.array | array | 249480.84 | 11922.60 |
| 65536 | values.text | array | 672865.21 | 7917.78 |
| 65536 | sequence.array | array | 266680.62 | 43826.14 |
| 65536 | sequence.text | array | 426475.47 | 159981.66 |
| 65536 | sequence.edited.text | array | 672478.63 | 51568.28 |
| 65536 | sequence.masked.text | array | 420251.27 | 195851.55 |
| 65536 | insert | string | 325.86 | 74.66 |
| 65536 | insert.append | string | 12055.86 | 2887.58 |
| 65536 | replace | string | 1341.06 | 77.09 |
| 65536 | remove | string | 853.61 | 87.81 |
| 65536 | remove.middle | string | 845.23 | 17.16 |
| 65536 | replace.middle | string | 1155.36 | 25.26 |
| 65536 | apply | string | 765.69 | 23.80 |
| 65536 | apply.array | string | 254440.08 | 5107.43 |
| 65536 | concurrent.apply | string | 131351.26 | 1069.02 |
| 65536 | merge | string | 1040.17 | 56.46 |
| 65536 | create | string | 881.86 | 52.38 |
| 65536 | value.random | string | 49.22 | 8.41 |
| 65536 | values.range | string | 131.99 | 20.73 |
| 65536 | values.array | string | 247863.43 | 2176.83 |
| 65536 | values.text | string | 55.85 | 5.57 |
| 65536 | sequence.array | string | 250328.67 | 1347.07 |
| 65536 | sequence.text | string | 138.24 | 12.24 |
| 65536 | sequence.edited.text | string | 66165.04 | 756.04 |
| 65536 | sequence.masked.text | string | 2683.82 | 159.19 |
| 1048576 | insert | array | 3969577.29 | 28674.71 |
| 1048576 | insert.append | array | 25921123.50 | 1673443.75 |
| 1048576 | replace | array | 4640412.50 | 83531.83 |
| 1048576 | remove | array | 6644.75 | 182.56 |
| 1048576 | remove.middle | array | 5097471.00 | 68144.50 |
| 1048576 | replace.middle | array | 5131778.00 | 158774.15 |
| 1048576 | apply | array | 854.12 | 50.66 |
| 1048576 | apply.array | array | 536.50 | 3.51 |
| 1048576 | concurrent.apply | array | 57147370.00 | 290873.00 |
| 1048576 | merge | array | 3792704.86 | 16864.86 |
| 1048576 | create | array | 3736204.57 | 22058.79 |
| 1048576 | value.random | array | 29.31 | 2.63 |
| 1048576 | values.range | array | 84.70 | 0.81 |
| 1048576 | values.array | array | 4506163.43 | 82269.07 |
| 1048576 | values.text | array | 10831810.67 | 42801.83 |
| 1048576 | sequence.array | array | 4533798.29 | 113188.00 |
| 1048576 | sequence.text | array | 34468181.00 | 4245821.00 |
| 1048576 | sequence.edited.text | array | 40972984.00 | 6730810.00 |
| 1048576 | sequence.masked.text | array | 33737807.50 | 6325473.75 |
| 1048576 | insert | string | 472.45 | 75.81 |
| 1048576 | insert.append | string | 514150.10 | 6183.46 |
| 1048576 | replace | string | 1448.88 | 48.57 |
| 1048576 | remove | string | 933.31 | 122.59 |
| 1048576 | remove.middle | string | 867.37 | 21.53 |
| 1048576 | replace.middle | string | 1268.30 | 10.27 |
| 1048576 | apply | string | 981.33 | 28.37 |
| 1048576 | apply.array | string | 4069193.29 | 137996.56 |
| 1048576 | concurrent.apply | string | 2014297.92 | 21832.58 |
| 1048576 | merge | string | 1071.01 | 79.65 |
| 1048576 | create | string | 933.23 | 27.51 |
| 1048576 | value.random | string | 32.33 | 10.38 |
| 1048576 | values.range | string | 116.42 | 17.12 |
| 1048576 | values.array | string | 3797614.14 | 46479.21 |
| 1048576 | values.text | string | 62.41 | 6.38 |
| 1048576 | sequence.array | string | 3765917.57 | 27742.50 |
| 1048576 | sequence.text | string | 151.08 | 15.86 |
| 1048576 | sequence.edited.text | string | 1120120.00 | 8778.33 |
| 1048576 | sequence.masked.text | string | 2500.52 | 44.96 |

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

Measured on Node 24.22.3, V8 13.6.233.17-node.63, linux x64, INTEL(R) XEON(R) PLATINUM 8573C. Splitting and text assembly are included where required; peer preparation, encoding and explicit JS process garbage collection are outside API timings.
