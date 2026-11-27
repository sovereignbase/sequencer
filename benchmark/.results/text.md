# Large string benchmarks

2026-11-27T16:35:52.975Z · [CI run](https://github.com/sovereignbase/sequencer/actions/runs/46034007280)

3 runs; times are median ns/call. IQR is Q3 minus Q1.

| UTF-16 code units | Operation | Representation | Median ns | IQR ns |
| ---: | --- | --- | ---: | ---: |
| 1024 | insert | array | 1382.74 | 210.50 |
| 1024 | insert.append | array | 14518.58 | 2488.75 |
| 1024 | replace | array | 2379.65 | 191.20 |
| 1024 | remove | array | 1051.46 | 76.15 |
| 1024 | remove.middle | array | 1539.51 | 85.74 |
| 1024 | replace.middle | array | 1836.19 | 65.24 |
| 1024 | apply | array | 954.51 | 77.80 |
| 1024 | apply.array | array | 589.10 | 3.97 |
| 1024 | concurrent.apply | array | 44665.79 | 1378.26 |
| 1024 | merge | array | 1995.86 | 234.47 |
| 1024 | create | array | 2016.34 | 250.11 |
| 1024 | value.random | array | 40.31 | 4.19 |
| 1024 | values.range | array | 82.97 | 6.81 |
| 1024 | values.array | array | 786.21 | 164.52 |
| 1024 | values.text | array | 9977.53 | 524.15 |
| 1024 | sequence.array | array | 967.70 | 54.89 |
| 1024 | sequence.text | array | 6463.92 | 290.26 |
| 1024 | sequence.edited.text | array | 10698.48 | 46.60 |
| 1024 | sequence.masked.text | array | 8667.43 | 410.60 |
| 1024 | insert | string | 480.38 | 21.62 |
| 1024 | insert.append | string | 3517.38 | 386.10 |
| 1024 | replace | string | 1384.19 | 81.94 |
| 1024 | remove | string | 1053.72 | 41.05 |
| 1024 | remove.middle | string | 909.75 | 43.67 |
| 1024 | replace.middle | string | 1217.45 | 49.62 |
| 1024 | apply | string | 887.56 | 44.37 |
| 1024 | apply.array | string | 1558.75 | 157.97 |
| 1024 | concurrent.apply | string | 3156.23 | 173.78 |
| 1024 | merge | string | 1148.80 | 62.15 |
| 1024 | create | string | 949.02 | 49.54 |
| 1024 | value.random | string | 40.24 | 2.66 |
| 1024 | values.range | string | 128.28 | 16.37 |
| 1024 | values.array | string | 1171.06 | 88.41 |
| 1024 | values.text | string | 69.15 | 4.21 |
| 1024 | sequence.array | string | 1273.08 | 47.75 |
| 1024 | sequence.text | string | 207.80 | 34.13 |
| 1024 | sequence.edited.text | string | 1563.62 | 308.05 |
| 1024 | sequence.masked.text | string | 2810.45 | 25.20 |
| 65536 | insert | array | 293084.76 | 15874.93 |
| 65536 | insert.append | array | 1152835.00 | 23790.30 |
| 65536 | replace | array | 360559.73 | 17865.24 |
| 65536 | remove | array | 2485.14 | 276.99 |
| 65536 | remove.middle | array | 310170.12 | 5762.58 |
| 65536 | replace.middle | array | 321582.33 | 13254.25 |
| 65536 | apply | array | 1423.90 | 195.03 |
| 65536 | apply.array | array | 612.39 | 51.50 |
| 65536 | concurrent.apply | array | 3508622.63 | 180260.54 |
| 65536 | merge | array | 287523.60 | 23021.22 |
| 65536 | create | array | 282689.31 | 20048.91 |
| 65536 | value.random | array | 53.82 | 8.16 |
| 65536 | values.range | array | 80.30 | 56.07 |
| 65536 | values.array | array | 244992.24 | 17899.57 |
| 65536 | values.text | array | 757834.24 | 350389.36 |
| 65536 | sequence.array | array | 246248.95 | 21821.61 |
| 65536 | sequence.text | array | 439982.40 | 179266.32 |
| 65536 | sequence.edited.text | array | 709364.53 | 111396.26 |
| 65536 | sequence.masked.text | array | 443448.40 | 207760.10 |
| 65536 | insert | string | 491.75 | 48.62 |
| 65536 | insert.append | string | 10164.32 | 2869.43 |
| 65536 | replace | string | 1616.62 | 226.01 |
| 65536 | remove | string | 889.57 | 25.51 |
| 65536 | remove.middle | string | 901.57 | 19.76 |
| 65536 | replace.middle | string | 1218.40 | 6.92 |
| 65536 | apply | string | 982.14 | 160.45 |
| 65536 | apply.array | string | 283325.88 | 1860.15 |
| 65536 | concurrent.apply | string | 135697.96 | 41498.03 |
| 65536 | merge | string | 1156.60 | 13.62 |
| 65536 | create | string | 996.12 | 31.44 |
| 65536 | value.random | string | 43.95 | 6.71 |
| 65536 | values.range | string | 117.80 | 7.76 |
| 65536 | values.array | string | 280741.11 | 2704.63 |
| 65536 | values.text | string | 50.35 | 2.11 |
| 65536 | sequence.array | string | 277267.31 | 6129.13 |
| 65536 | sequence.text | string | 152.06 | 8.62 |
| 65536 | sequence.edited.text | string | 62197.23 | 1094.49 |
| 65536 | sequence.masked.text | string | 2728.72 | 56.89 |
| 1048576 | insert | array | 4457062.00 | 587422.57 |
| 1048576 | insert.append | array | 26532433.00 | 1498731.50 |
| 1048576 | replace | array | 5319185.20 | 51294.30 |
| 1048576 | remove | array | 8977.78 | 612.32 |
| 1048576 | remove.middle | array | 5044472.67 | 93874.25 |
| 1048576 | replace.middle | array | 4386718.17 | 51029.58 |
| 1048576 | apply | array | 1177.27 | 98.65 |
| 1048576 | apply.array | array | 582.28 | 10.24 |
| 1048576 | concurrent.apply | array | 60242170.00 | 343347.50 |
| 1048576 | merge | array | 4203209.50 | 2273.92 |
| 1048576 | create | array | 4226186.00 | 181683.54 |
| 1048576 | value.random | array | 34.55 | 7.56 |
| 1048576 | values.range | array | 88.77 | 15.52 |
| 1048576 | values.array | array | 4372712.00 | 107816.71 |
| 1048576 | values.text | array | 12265402.00 | 44877.83 |
| 1048576 | sequence.array | array | 4512776.86 | 139608.07 |
| 1048576 | sequence.text | array | 32626049.50 | 4416436.75 |
| 1048576 | sequence.edited.text | array | 38061152.00 | 3269286.50 |
| 1048576 | sequence.masked.text | array | 33179159.50 | 4929735.00 |
| 1048576 | insert | string | 545.65 | 53.47 |
| 1048576 | insert.append | string | 504828.10 | 4159.55 |
| 1048576 | replace | string | 1635.90 | 201.11 |
| 1048576 | remove | string | 1281.64 | 95.03 |
| 1048576 | remove.middle | string | 974.39 | 164.51 |
| 1048576 | replace.middle | string | 1377.98 | 139.86 |
| 1048576 | apply | string | 1221.80 | 237.28 |
| 1048576 | apply.array | string | 4446554.50 | 107205.08 |
| 1048576 | concurrent.apply | string | 1902616.93 | 25698.87 |
| 1048576 | merge | string | 1125.30 | 68.07 |
| 1048576 | create | string | 980.34 | 71.29 |
| 1048576 | value.random | string | 42.88 | 5.85 |
| 1048576 | values.range | string | 136.83 | 27.27 |
| 1048576 | values.array | string | 4321674.50 | 66373.75 |
| 1048576 | values.text | string | 52.67 | 21.34 |
| 1048576 | sequence.array | string | 4227238.17 | 49827.00 |
| 1048576 | sequence.text | string | 148.11 | 21.62 |
| 1048576 | sequence.edited.text | string | 1039680.36 | 9998.42 |
| 1048576 | sequence.masked.text | string | 2701.23 | 79.61 |

Encoded snapshots use string Footage in both representations.

## Estimated retained memory and snapshot size

| UTF-16 code units | Representation | Estimated MiB | Snapshot MessagePack KiB | Snapshot gzip KiB | Gossip MessagePack KiB | Gossip gzip KiB |
| ---: | --- | ---: | ---: | ---: | ---: | ---: |
| 1024 | array | 0.0082 | 1.02 | 0.05 | 2.02 | 0.05 |
| 1024 | string | 0.0023 | 1.02 | 0.05 | 1.02 | 0.05 |
| 65536 | array | 0.5004 | 64.02 | 0.12 | 128.02 | 0.18 |
| 65536 | string | 0.1254 | 64.02 | 0.12 | 64.02 | 0.12 |
| 1048576 | array | 8.0004 | 1024.02 | 1.05 | 2048.02 | 2.04 |
| 1048576 | string | 2.0004 | 1024.02 | 1.05 | 1024.02 | 1.05 |

Measured on Node 24.22.3, V8 13.6.233.17-node.63, linux x64, AMD EPYC 7763 64-Core Processor. Splitting and text assembly are included where required; peer preparation, encoding and explicit JS process garbage collection are outside API timings.
