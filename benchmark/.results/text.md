# Large string benchmarks

2026-11-24T12:57:00.894Z · [CI run](https://github.com/sovereignbase/sequencer/actions/runs/45397524890)

3 runs; times are median ns/call. IQR is Q3 minus Q1.

| UTF-16 code units | Operation | Representation | Median ns | IQR ns |
| ---: | --- | --- | ---: | ---: |
| 1024 | insert | array | 849.04 | 93.93 |
| 1024 | insert.append | array | 10179.96 | 2791.93 |
| 1024 | replace | array | 2401.88 | 73.31 |
| 1024 | remove | array | 1799.42 | 141.73 |
| 1024 | remove.middle | array | 1004.79 | 78.74 |
| 1024 | replace.middle | array | 1198.68 | 85.87 |
| 1024 | apply | array | 552.24 | 9.12 |
| 1024 | apply.array | array | 313.44 | 33.11 |
| 1024 | concurrent.apply | array | 21919.49 | 2138.39 |
| 1024 | merge | array | 1257.68 | 175.27 |
| 1024 | create | array | 1341.53 | 251.47 |
| 1024 | value.random | array | 32.92 | 1.11 |
| 1024 | values.range | array | 51.28 | 4.30 |
| 1024 | values.array | array | 320.07 | 76.04 |
| 1024 | values.text | array | 4489.33 | 115.19 |
| 1024 | sequence.array | array | 427.99 | 32.95 |
| 1024 | sequence.text | array | 3565.85 | 139.90 |
| 1024 | sequence.edited.text | array | 5675.01 | 367.22 |
| 1024 | sequence.masked.text | array | 4751.06 | 2871.04 |
| 1024 | insert | string | 221.10 | 38.72 |
| 1024 | insert.append | string | 1855.71 | 67.82 |
| 1024 | replace | string | 798.57 | 142.94 |
| 1024 | remove | string | 548.28 | 51.68 |
| 1024 | remove.middle | string | 582.70 | 27.61 |
| 1024 | replace.middle | string | 946.65 | 137.51 |
| 1024 | apply | string | 560.16 | 88.47 |
| 1024 | apply.array | string | 894.25 | 192.40 |
| 1024 | concurrent.apply | string | 1792.46 | 169.30 |
| 1024 | merge | string | 826.21 | 455.91 |
| 1024 | create | string | 703.64 | 41.98 |
| 1024 | value.random | string | 34.69 | 5.33 |
| 1024 | values.range | string | 72.61 | 2.99 |
| 1024 | values.array | string | 543.16 | 12.10 |
| 1024 | values.text | string | 36.13 | 3.84 |
| 1024 | sequence.array | string | 728.55 | 93.79 |
| 1024 | sequence.text | string | 87.30 | 10.47 |
| 1024 | sequence.edited.text | string | 1096.37 | 148.43 |
| 1024 | sequence.masked.text | string | 1863.73 | 86.32 |
| 65536 | insert | array | 222594.42 | 6206.03 |
| 65536 | insert.append | array | 758884.45 | 11215.54 |
| 65536 | replace | array | 504573.10 | 31760.13 |
| 65536 | remove | array | 264420.97 | 14503.75 |
| 65536 | remove.middle | array | 205568.16 | 7746.22 |
| 65536 | replace.middle | array | 210849.86 | 5395.27 |
| 65536 | apply | array | 634.01 | 44.90 |
| 65536 | apply.array | array | 408.51 | 28.25 |
| 65536 | concurrent.apply | array | 1957690.62 | 172038.01 |
| 65536 | merge | array | 217695.70 | 5749.11 |
| 65536 | create | array | 223960.99 | 13182.01 |
| 65536 | value.random | array | 33.90 | 5.42 |
| 65536 | values.range | array | 55.75 | 26.84 |
| 65536 | values.array | array | 200928.56 | 7861.90 |
| 65536 | values.text | array | 389959.75 | 29055.22 |
| 65536 | sequence.array | array | 198622.26 | 3200.66 |
| 65536 | sequence.text | array | 221450.42 | 85680.95 |
| 65536 | sequence.edited.text | array | 326390.13 | 71331.60 |
| 65536 | sequence.masked.text | array | 214755.03 | 32789.19 |
| 65536 | insert | string | 235.57 | 37.36 |
| 65536 | insert.append | string | 5568.14 | 237.86 |
| 65536 | replace | string | 731.09 | 6.04 |
| 65536 | remove | string | 537.85 | 5.46 |
| 65536 | remove.middle | string | 576.99 | 9.53 |
| 65536 | replace.middle | string | 744.05 | 48.07 |
| 65536 | apply | string | 548.51 | 77.21 |
| 65536 | apply.array | string | 226172.04 | 9144.85 |
| 65536 | concurrent.apply | string | 110305.31 | 5327.02 |
| 65536 | merge | string | 720.77 | 53.01 |
| 65536 | create | string | 666.48 | 36.66 |
| 65536 | value.random | string | 35.86 | 2.55 |
| 65536 | values.range | string | 86.11 | 16.28 |
| 65536 | values.array | string | 221113.98 | 7944.64 |
| 65536 | values.text | string | 32.14 | 4.41 |
| 65536 | sequence.array | string | 222882.41 | 4679.37 |
| 65536 | sequence.text | string | 87.42 | 3.69 |
| 65536 | sequence.edited.text | string | 47430.16 | 126.89 |
| 65536 | sequence.masked.text | string | 1855.52 | 207.93 |
| 1048576 | insert | array | 3331520.50 | 130492.69 |
| 1048576 | insert.append | array | 17957609.00 | 455580.75 |
| 1048576 | replace | array | 6981705.25 | 128392.00 |
| 1048576 | remove | array | 3789577.14 | 79692.00 |
| 1048576 | remove.middle | array | 2986559.78 | 85107.55 |
| 1048576 | replace.middle | array | 3142828.25 | 665462.92 |
| 1048576 | apply | array | 611.56 | 56.51 |
| 1048576 | apply.array | array | 353.57 | 10.37 |
| 1048576 | concurrent.apply | array | 32469233.00 | 991497.50 |
| 1048576 | merge | array | 3130106.50 | 77145.37 |
| 1048576 | create | array | 3001014.00 | 16218.11 |
| 1048576 | value.random | array | 25.03 | 3.73 |
| 1048576 | values.range | array | 47.04 | 5.11 |
| 1048576 | values.array | array | 2923139.00 | 574102.53 |
| 1048576 | values.text | array | 6450042.00 | 162064.70 |
| 1048576 | sequence.array | array | 2855207.44 | 98314.61 |
| 1048576 | sequence.text | array | 18122617.00 | 1024994.75 |
| 1048576 | sequence.edited.text | array | 20558178.00 | 534672.25 |
| 1048576 | sequence.masked.text | array | 18173368.50 | 213679.50 |
| 1048576 | insert | string | 240.00 | 15.25 |
| 1048576 | insert.append | string | 407156.84 | 8841.73 |
| 1048576 | replace | string | 845.25 | 17.51 |
| 1048576 | remove | string | 603.59 | 30.69 |
| 1048576 | remove.middle | string | 596.31 | 14.18 |
| 1048576 | replace.middle | string | 762.04 | 26.82 |
| 1048576 | apply | string | 527.01 | 54.16 |
| 1048576 | apply.array | string | 3370039.75 | 127605.69 |
| 1048576 | concurrent.apply | string | 1529793.18 | 72919.42 |
| 1048576 | merge | string | 699.31 | 36.64 |
| 1048576 | create | string | 636.78 | 11.17 |
| 1048576 | value.random | string | 28.57 | 1.55 |
| 1048576 | values.range | string | 69.96 | 9.44 |
| 1048576 | values.array | string | 3234886.12 | 88781.25 |
| 1048576 | values.text | string | 36.96 | 7.41 |
| 1048576 | sequence.array | string | 3235274.37 | 55159.06 |
| 1048576 | sequence.text | string | 89.86 | 5.84 |
| 1048576 | sequence.edited.text | string | 771841.45 | 37701.10 |
| 1048576 | sequence.masked.text | string | 1792.77 | 49.71 |

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

Measured on Node 24.22.3, V8 13.6.233.17-node.63, linux x64, AMD EPYC 9V45 96-Core Processor. Splitting and text assembly are included where required; peer preparation, encoding and explicit JS process garbage collection are outside API timings.
