# Tuple benchmarks

2026-11-24T18:23:17.289Z · local run

Arithmetic means of 3 runs. Ordinary Projection versus a static tuple with maxLength. Both contain the same values; replacements preserve the field count.

## Throughput (ops/s)

| Indices | Method / case | Projection | Static tuple | Tuple / Projection |
| ---: | --- | ---: | ---: | ---: |
| 2 | create.empty | 2,620,044 | 2,450,829 | 0.94× |
| 2 | create.sequence | 742,289 | 728,506 | 0.98× |
| 2 | replace.random | 1,010,861 | 1,658,264 | 1.64× |
| 2 | apply.replace | 601,951 | 988,562 | 1.64× |
| 2 | apply.duplicate | 1,816,994 | 1,685,898 | 0.93× |
| 2 | merge.duplicate | 1,223,253 | 1,207,891 | 0.99× |
| 2 | length | 61,545,617 | 64,089,095 | 1.04× |
| 2 | value.random | 32,313,686 | 55,443,485 | 1.72× |
| 2 | values | 10,368,062 | 9,510,594 | 0.92× |
| 2 | sequence | 2,197,170 | 2,156,297 | 0.98× |
| 4 | create.empty | 2,438,978 | 2,315,126 | 0.95× |
| 4 | create.sequence | 661,470 | 610,648 | 0.92× |
| 4 | replace.random | 857,249 | 1,390,901 | 1.62× |
| 4 | apply.replace | 565,387 | 896,333 | 1.59× |
| 4 | apply.duplicate | 1,745,054 | 1,693,732 | 0.97× |
| 4 | merge.duplicate | 1,076,116 | 1,039,278 | 0.97× |
| 4 | length | 39,969,638 | 37,845,675 | 0.95× |
| 4 | value.random | 25,369,241 | 59,009,139 | 2.33× |
| 4 | values | 6,878,400 | 7,394,569 | 1.08× |
| 4 | sequence | 2,222,112 | 1,646,064 | 0.74× |
| 8 | create.empty | 2,622,241 | 2,343,323 | 0.89× |
| 8 | create.sequence | 402,131 | 470,765 | 1.17× |
| 8 | replace.random | 862,178 | 1,542,103 | 1.79× |
| 8 | apply.replace | 557,977 | 998,195 | 1.79× |
| 8 | apply.duplicate | 1,620,699 | 1,618,649 | 1.00× |
| 8 | merge.duplicate | 698,124 | 661,753 | 0.95× |
| 8 | length | 36,515,007 | 35,646,795 | 0.98× |
| 8 | value.random | 19,014,514 | 52,286,950 | 2.75× |
| 8 | values | 4,325,320 | 4,589,267 | 1.06× |
| 8 | sequence | 1,525,641 | 1,381,110 | 0.91× |
| 100 | create.empty | 1,996,408 | 2,070,263 | 1.04× |
| 100 | create.sequence | 65,052 | 77,069 | 1.18× |
| 100 | replace.random | 764,502 | 1,322,204 | 1.73× |
| 100 | apply.replace | 552,943 | 1,023,364 | 1.85× |
| 100 | apply.duplicate | 1,426,133 | 1,636,385 | 1.15× |
| 100 | merge.duplicate | 112,881 | 69,753 | 0.62× |
| 100 | length | 37,125,234 | 35,809,365 | 0.96× |
| 100 | value.random | 11,161,410 | 56,341,121 | 5.05× |
| 100 | values | 498,830 | 607,517 | 1.22× |
| 100 | sequence | 172,568 | 182,919 | 1.06× |

## Memory and encoded size

| Indices | Mode | Estimated allocated memory (MiB) | MessagePack (KiB) | MessagePack + gzip (KiB) |
| ---: | --- | ---: | ---: | ---: |
| 2 | Projection | 0.0006 | 0.03 | 0.04 |
| 2 | Static tuple | 0.0007 | 0.04 | 0.05 |
| 4 | Projection | 0.0013 | 0.06 | 0.05 |
| 4 | Static tuple | 0.0009 | 0.06 | 0.07 |
| 8 | Projection | 0.0022 | 0.12 | 0.08 |
| 8 | Static tuple | 0.0013 | 0.10 | 0.09 |
| 100 | Projection | 0.0196 | 0.67 | 0.57 |
| 100 | Static tuple | 0.0110 | 0.51 | 0.35 |

Measured on Node 24.16.0, V8 13.6.233.17-node.49, win32 x64, Intel(R) Core(TM) i5-10210U CPU @ 1.60GHz. Fixtures are hydrated compacted snapshots after one replacement per field. Each case warms up for ≥25 ms and measures ≥50 ms of API time; mutation bursts restart after 4,096 replacements. Peer authoring, encoding, result checks, destruction and explicit JS process garbage collection are outside API timings. Memory estimates are the increase in live native allocator bytes plus retained JS array slots for one instance, including exercised runtime buffers. Unused WASM capacity, JS object headers and referenced payload objects are excluded.
