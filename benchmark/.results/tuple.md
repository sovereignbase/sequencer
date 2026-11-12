# Tuple benchmarks

Arithmetic means of 3 runs. Ordinary Projection versus a static tuple with maxLength. Both contain the same values; replacements preserve the field count.

## Throughput (ops/s)

| Indices | Method / case | Projection | Static tuple | Tuple / Projection |
| ---: | --- | ---: | ---: | ---: |
| 2 | create.empty | 2,462,215 | 2,083,479 | 0.85× |
| 2 | create.sequence | 816,712 | 730,409 | 0.89× |
| 2 | replace.random | 856,269 | 1,664,292 | 1.94× |
| 2 | apply.replace | 607,002 | 1,023,438 | 1.69× |
| 2 | apply.duplicate | 2,183,646 | 2,028,908 | 0.93× |
| 2 | merge.duplicate | 1,217,306 | 1,090,967 | 0.90× |
| 2 | length | 77,925,331 | 74,993,307 | 0.96× |
| 2 | value.random | 34,919,983 | 61,101,568 | 1.75× |
| 2 | values | 11,695,733 | 11,523,397 | 0.99× |
| 2 | sequence | 2,469,754 | 2,221,754 | 0.90× |
| 4 | create.empty | 2,359,975 | 2,112,596 | 0.90× |
| 4 | create.sequence | 602,058 | 650,219 | 1.08× |
| 4 | replace.random | 910,721 | 1,673,871 | 1.84× |
| 4 | apply.replace | 484,659 | 1,089,633 | 2.25× |
| 4 | apply.duplicate | 2,144,641 | 2,018,933 | 0.94× |
| 4 | merge.duplicate | 933,692 | 800,520 | 0.86× |
| 4 | length | 39,142,608 | 43,498,111 | 1.11× |
| 4 | value.random | 26,979,838 | 61,731,540 | 2.29× |
| 4 | values | 7,557,586 | 8,277,345 | 1.10× |
| 4 | sequence | 2,271,002 | 2,097,906 | 0.92× |
| 8 | create.empty | 2,547,143 | 2,095,707 | 0.82× |
| 8 | create.sequence | 446,165 | 519,604 | 1.16× |
| 8 | replace.random | 923,100 | 1,570,220 | 1.70× |
| 8 | apply.replace | 446,581 | 1,103,819 | 2.47× |
| 8 | apply.duplicate | 2,038,510 | 1,886,189 | 0.93× |
| 8 | merge.duplicate | 566,152 | 535,838 | 0.95× |
| 8 | length | 42,192,195 | 42,855,096 | 1.02× |
| 8 | value.random | 20,878,901 | 61,047,654 | 2.92× |
| 8 | values | 5,347,582 | 5,484,596 | 1.03× |
| 8 | sequence | 1,511,307 | 1,681,907 | 1.11× |
| 100 | create.empty | 2,314,606 | 2,137,828 | 0.92× |
| 100 | create.sequence | 83,844 | 104,172 | 1.24× |
| 100 | replace.random | 806,085 | 1,704,822 | 2.11× |
| 100 | apply.replace | 393,350 | 1,147,119 | 2.92× |
| 100 | apply.duplicate | 1,811,845 | 1,986,762 | 1.10× |
| 100 | merge.duplicate | 123,502 | 88,457 | 0.72× |
| 100 | length | 42,903,635 | 42,118,619 | 0.98× |
| 100 | value.random | 9,737,357 | 62,874,809 | 6.46× |
| 100 | values | 615,550 | 694,112 | 1.13× |
| 100 | sequence | 170,436 | 194,910 | 1.14× |

## Space (KiB)

| Indices | Mode | Estimated allocated memory | MessagePack | MessagePack + gzip |
| ---: | --- | ---: | ---: | ---: |
| 2 | Projection | 0.80 | 0.03 | 0.04 |
| 2 | Static tuple | 0.80 | 0.04 | 0.05 |
| 4 | Projection | 1.46 | 0.06 | 0.05 |
| 4 | Static tuple | 0.98 | 0.06 | 0.07 |
| 8 | Projection | 2.37 | 0.12 | 0.08 |
| 8 | Static tuple | 1.41 | 0.10 | 0.09 |
| 100 | Projection | 22.55 | 0.67 | 0.57 |
| 100 | Static tuple | 11.37 | 0.51 | 0.35 |

Measured on Node 24.22.2, V8 13.6.233.17-node.63, linux x64, AMD EPYC 7763 64-Core Processor. Fixtures are hydrated compacted snapshots after one replacement per field. Each case warms up for ≥25 ms and measures ≥50 ms of API time; mutation bursts restart after 4,096 replacements. Peer authoring, encoding, result checks, destruction and explicit JS process garbage collection are outside API timings. Memory estimates are the increase in live native allocator bytes plus retained JS array slots for one instance, including exercised runtime buffers. Unused WASM capacity, JS object headers and referenced payload objects are excluded.
