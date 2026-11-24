# Large string benchmarks

2026-11-24T12:48:22.527Z · [CI run](https://github.com/sovereignbase/sequencer/actions/runs/45395972158)

3 runs; times are median ns/call. IQR is Q3 minus Q1.

| UTF-16 code units | Operation | Representation | Median ns | IQR ns |
| ---: | --- | --- | ---: | ---: |
| 1024 | insert | array | 1000.98 | 67.12 |
| 1024 | insert.append | array | 9524.15 | 1568.57 |
| 1024 | replace | array | 3017.31 | 290.95 |
| 1024 | remove | array | 1802.85 | 249.65 |
| 1024 | remove.middle | array | 1103.63 | 158.80 |
| 1024 | replace.middle | array | 1337.30 | 184.70 |
| 1024 | apply | array | 459.44 | 67.16 |
| 1024 | apply.array | array | 335.07 | 22.15 |
| 1024 | concurrent.apply | array | 31465.90 | 787.77 |
| 1024 | merge | array | 1333.48 | 132.44 |
| 1024 | create | array | 1304.82 | 154.43 |
| 1024 | value.random | array | 35.47 | 7.08 |
| 1024 | values.range | array | 64.53 | 4.40 |
| 1024 | values.array | array | 432.54 | 81.03 |
| 1024 | values.text | array | 6294.62 | 300.29 |
| 1024 | sequence.array | array | 555.07 | 55.05 |
| 1024 | sequence.text | array | 3839.13 | 12.38 |
| 1024 | sequence.edited.text | array | 6507.76 | 130.88 |
| 1024 | sequence.masked.text | array | 5202.04 | 37.18 |
| 1024 | insert | string | 236.12 | 44.28 |
| 1024 | insert.append | string | 2051.36 | 106.13 |
| 1024 | replace | string | 919.23 | 39.43 |
| 1024 | remove | string | 521.26 | 21.92 |
| 1024 | remove.middle | string | 546.19 | 16.07 |
| 1024 | replace.middle | string | 742.34 | 126.31 |
| 1024 | apply | string | 443.47 | 28.92 |
| 1024 | apply.array | string | 1040.50 | 8.97 |
| 1024 | concurrent.apply | string | 1755.78 | 41.83 |
| 1024 | merge | string | 662.96 | 110.14 |
| 1024 | create | string | 705.06 | 36.03 |
| 1024 | value.random | string | 26.23 | 9.31 |
| 1024 | values.range | string | 110.85 | 0.81 |
| 1024 | values.array | string | 833.82 | 185.44 |
| 1024 | values.text | string | 38.99 | 11.57 |
| 1024 | sequence.array | string | 782.48 | 63.57 |
| 1024 | sequence.text | string | 93.54 | 1.92 |
| 1024 | sequence.edited.text | string | 1303.83 | 144.35 |
| 1024 | sequence.masked.text | string | 2327.25 | 148.43 |
| 65536 | insert | array | 194844.98 | 9877.71 |
| 65536 | insert.append | array | 840257.20 | 71794.51 |
| 65536 | replace | array | 452574.93 | 72012.92 |
| 65536 | remove | array | 242221.72 | 18235.77 |
| 65536 | remove.middle | array | 184327.49 | 12953.07 |
| 65536 | replace.middle | array | 179516.16 | 13659.40 |
| 65536 | apply | array | 569.15 | 63.26 |
| 65536 | apply.array | array | 316.31 | 27.49 |
| 65536 | concurrent.apply | array | 2391791.91 | 37553.18 |
| 65536 | merge | array | 182373.25 | 12198.82 |
| 65536 | create | array | 175061.94 | 10941.16 |
| 65536 | value.random | array | 34.57 | 4.82 |
| 65536 | values.range | array | 67.05 | 17.60 |
| 65536 | values.array | array | 198849.00 | 6192.43 |
| 65536 | values.text | array | 506820.28 | 7503.36 |
| 65536 | sequence.array | array | 187096.75 | 8138.16 |
| 65536 | sequence.text | array | 288012.65 | 32300.57 |
| 65536 | sequence.edited.text | array | 427060.77 | 103747.70 |
| 65536 | sequence.masked.text | array | 287820.48 | 38330.49 |
| 65536 | insert | string | 218.42 | 28.54 |
| 65536 | insert.append | string | 5796.19 | 85.23 |
| 65536 | replace | string | 834.54 | 44.78 |
| 65536 | remove | string | 519.33 | 16.75 |
| 65536 | remove.middle | string | 556.61 | 6.76 |
| 65536 | replace.middle | string | 750.93 | 4.38 |
| 65536 | apply | string | 466.42 | 71.04 |
| 65536 | apply.array | string | 200727.68 | 3439.24 |
| 65536 | concurrent.apply | string | 102834.22 | 1716.54 |
| 65536 | merge | string | 695.73 | 69.89 |
| 65536 | create | string | 728.67 | 17.37 |
| 65536 | value.random | string | 36.51 | 6.60 |
| 65536 | values.range | string | 91.27 | 3.82 |
| 65536 | values.array | string | 195552.78 | 2136.81 |
| 65536 | values.text | string | 38.57 | 0.75 |
| 65536 | sequence.array | string | 190192.38 | 7895.05 |
| 65536 | sequence.text | string | 97.59 | 5.31 |
| 65536 | sequence.edited.text | string | 48236.24 | 190.87 |
| 65536 | sequence.masked.text | string | 2422.30 | 62.18 |
| 1048576 | insert | array | 3316553.00 | 30960.06 |
| 1048576 | insert.append | array | 18708326.50 | 208863.50 |
| 1048576 | replace | array | 6897814.25 | 339442.87 |
| 1048576 | remove | array | 3868682.00 | 139675.50 |
| 1048576 | remove.middle | array | 3188972.12 | 45980.69 |
| 1048576 | replace.middle | array | 3039692.22 | 76483.35 |
| 1048576 | apply | array | 600.46 | 55.56 |
| 1048576 | apply.array | array | 330.35 | 18.92 |
| 1048576 | concurrent.apply | array | 51146085.00 | 1475643.00 |
| 1048576 | merge | array | 2810297.22 | 103749.58 |
| 1048576 | create | array | 2581579.30 | 53886.50 |
| 1048576 | value.random | array | 20.85 | 2.54 |
| 1048576 | values.range | array | 54.22 | 0.43 |
| 1048576 | values.array | array | 3234866.63 | 117448.72 |
| 1048576 | values.text | array | 8092663.75 | 79662.25 |
| 1048576 | sequence.array | array | 3172217.38 | 34728.31 |
| 1048576 | sequence.text | array | 36061119.50 | 3345504.25 |
| 1048576 | sequence.edited.text | array | 39247124.50 | 4425952.00 |
| 1048576 | sequence.masked.text | array | 35806304.50 | 3772000.50 |
| 1048576 | insert | string | 278.59 | 29.48 |
| 1048576 | insert.append | string | 417244.08 | 8117.51 |
| 1048576 | replace | string | 942.90 | 44.88 |
| 1048576 | remove | string | 643.36 | 28.75 |
| 1048576 | remove.middle | string | 580.25 | 28.36 |
| 1048576 | replace.middle | string | 858.73 | 19.44 |
| 1048576 | apply | string | 462.24 | 41.31 |
| 1048576 | apply.array | string | 3285727.75 | 28925.44 |
| 1048576 | concurrent.apply | string | 1563660.44 | 12815.73 |
| 1048576 | merge | string | 684.10 | 35.01 |
| 1048576 | create | string | 667.36 | 43.09 |
| 1048576 | value.random | string | 34.16 | 0.81 |
| 1048576 | values.range | string | 84.13 | 4.42 |
| 1048576 | values.array | string | 3167622.37 | 63788.06 |
| 1048576 | values.text | string | 43.90 | 2.80 |
| 1048576 | sequence.array | string | 2918617.44 | 26504.83 |
| 1048576 | sequence.text | string | 106.85 | 4.52 |
| 1048576 | sequence.edited.text | string | 860958.60 | 6529.83 |
| 1048576 | sequence.masked.text | string | 2364.48 | 106.89 |

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
