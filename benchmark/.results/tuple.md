# Tuple benchmarks

Arithmetic means of 3 runs. Ordinary Projection versus a static tuple with maxLength. Both contain the same values; replacements preserve the field count.

## Throughput (ops/s)

| Indices | Method / case | Projection | Static tuple | Tuple / Projection |
| ---: | --- | ---: | ---: | ---: |
| 2 | create.empty | 2,614,557 | 2,507,302 | 0.96× |
| 2 | create.sequence | 909,703 | 752,195 | 0.83× |
| 2 | replace.random | 1,136,323 | 1,742,885 | 1.53× |
| 2 | apply.replace | 714,073 | 1,039,888 | 1.46× |
| 2 | apply.duplicate | 1,962,450 | 1,937,953 | 0.99× |
| 2 | merge.duplicate | 1,423,067 | 1,432,702 | 1.01× |
| 2 | length | 72,501,036 | 72,360,097 | 1.00× |
| 2 | value.random | 33,727,845 | 60,057,407 | 1.78× |
| 2 | values | 11,133,118 | 10,361,071 | 0.93× |
| 2 | sequence | 2,545,145 | 2,427,449 | 0.95× |
| 4 | create.empty | 2,555,365 | 2,537,402 | 0.99× |
| 4 | create.sequence | 656,628 | 673,267 | 1.03× |
| 4 | replace.random | 1,021,323 | 1,757,956 | 1.72× |
| 4 | apply.replace | 632,639 | 1,025,944 | 1.62× |
| 4 | apply.duplicate | 1,977,852 | 1,815,141 | 0.92× |
| 4 | merge.duplicate | 1,049,796 | 1,059,470 | 1.01× |
| 4 | length | 40,574,317 | 40,899,738 | 1.01× |
| 4 | value.random | 26,322,494 | 60,273,574 | 2.29× |
| 4 | values | 6,871,634 | 7,715,554 | 1.12× |
| 4 | sequence | 2,370,023 | 2,078,088 | 0.88× |
| 8 | create.empty | 2,573,873 | 2,104,756 | 0.82× |
| 8 | create.sequence | 459,958 | 554,021 | 1.20× |
| 8 | replace.random | 930,567 | 1,621,424 | 1.74× |
| 8 | apply.replace | 659,223 | 1,074,734 | 1.63× |
| 8 | apply.duplicate | 1,937,250 | 1,850,104 | 0.96× |
| 8 | merge.duplicate | 763,649 | 732,408 | 0.96× |
| 8 | length | 40,136,186 | 41,346,812 | 1.03× |
| 8 | value.random | 20,622,551 | 62,071,602 | 3.01× |
| 8 | values | 4,804,495 | 5,457,671 | 1.14× |
| 8 | sequence | 1,831,600 | 1,558,290 | 0.85× |
| 100 | create.empty | 2,463,257 | 2,496,360 | 1.01× |
| 100 | create.sequence | 76,491 | 108,179 | 1.41× |
| 100 | replace.random | 942,654 | 1,647,656 | 1.75× |
| 100 | apply.replace | 661,663 | 1,114,885 | 1.68× |
| 100 | apply.duplicate | 1,960,514 | 1,917,487 | 0.98× |
| 100 | merge.duplicate | 124,579 | 91,818 | 0.74× |
| 100 | length | 41,166,832 | 41,084,354 | 1.00× |
| 100 | value.random | 13,817,940 | 61,706,122 | 4.47× |
| 100 | values | 559,410 | 676,812 | 1.21× |
| 100 | sequence | 178,680 | 193,540 | 1.08× |

## Space (KiB)

| Indices | Mode | Estimated allocated memory | MessagePack | MessagePack + gzip |
| ---: | --- | ---: | ---: | ---: |
| 2 | Projection | 0.69 | 0.03 | 0.04 |
| 2 | Static tuple | 0.73 | 0.04 | 0.05 |
| 4 | Projection | 1.40 | 0.06 | 0.05 |
| 4 | Static tuple | 0.95 | 0.06 | 0.07 |
| 8 | Projection | 2.27 | 0.12 | 0.08 |
| 8 | Static tuple | 1.38 | 0.10 | 0.09 |
| 100 | Projection | 20.90 | 0.67 | 0.57 |
| 100 | Static tuple | 11.34 | 0.51 | 0.35 |

Measured on Node 24.16.0, V8 13.6.233.17-node.49, win32 x64, Intel(R) Core(TM) i5-10210U CPU @ 1.60GHz. Fixtures are hydrated compacted snapshots after one replacement per field. Each case warms up for ≥25 ms and measures ≥50 ms of API time; mutation bursts restart after 4,096 replacements. Peer authoring, encoding, result checks, destruction and explicit JS process garbage collection are outside API timings. Memory estimates are the increase in live native allocator bytes plus retained JS array slots for one instance, including exercised runtime buffers. Unused WASM capacity, JS object headers and referenced payload objects are excluded.
