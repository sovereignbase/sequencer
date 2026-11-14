# Tuple benchmarks

Arithmetic means of 3 runs. Ordinary Projection versus a static tuple with maxLength. Both contain the same values; replacements preserve the field count.

## Throughput (ops/s)

| Indices | Method / case | Projection | Static tuple | Tuple / Projection |
| ---: | --- | ---: | ---: | ---: |
| 2 | create.empty | 3,779,876 | 3,692,093 | 0.98× |
| 2 | create.sequence | 1,433,007 | 1,225,458 | 0.86× |
| 2 | replace.random | 1,687,497 | 2,836,460 | 1.68× |
| 2 | apply.replace | 1,022,119 | 1,668,452 | 1.63× |
| 2 | apply.duplicate | 3,646,420 | 3,544,800 | 0.97× |
| 2 | merge.duplicate | 2,371,922 | 2,218,752 | 0.94× |
| 2 | length | 78,032,939 | 68,368,903 | 0.88× |
| 2 | value.random | 46,341,298 | 91,660,100 | 1.98× |
| 2 | values | 14,802,098 | 13,235,602 | 0.89× |
| 2 | sequence | 3,755,190 | 3,804,565 | 1.01× |
| 4 | create.empty | 3,737,992 | 3,628,658 | 0.97× |
| 4 | create.sequence | 1,008,936 | 1,020,942 | 1.01× |
| 4 | replace.random | 1,304,817 | 2,742,278 | 2.10× |
| 4 | apply.replace | 940,268 | 1,704,136 | 1.81× |
| 4 | apply.duplicate | 3,689,639 | 3,513,120 | 0.95× |
| 4 | merge.duplicate | 1,817,503 | 1,706,863 | 0.94× |
| 4 | length | 65,633,968 | 65,978,817 | 1.01× |
| 4 | value.random | 33,122,458 | 90,501,441 | 2.73× |
| 4 | values | 9,525,004 | 10,323,488 | 1.08× |
| 4 | sequence | 3,565,686 | 3,224,682 | 0.90× |
| 8 | create.empty | 3,891,839 | 3,710,065 | 0.95× |
| 8 | create.sequence | 701,949 | 839,981 | 1.20× |
| 8 | replace.random | 1,305,707 | 2,778,208 | 2.13× |
| 8 | apply.replace | 901,418 | 1,772,045 | 1.97× |
| 8 | apply.duplicate | 3,482,797 | 3,413,012 | 0.98× |
| 8 | merge.duplicate | 1,079,264 | 1,075,283 | 1.00× |
| 8 | length | 65,686,909 | 67,525,914 | 1.03× |
| 8 | value.random | 25,295,634 | 91,078,995 | 3.60× |
| 8 | values | 6,518,967 | 7,215,173 | 1.11× |
| 8 | sequence | 2,755,297 | 2,480,533 | 0.90× |
| 100 | create.empty | 3,836,300 | 3,798,923 | 0.99× |
| 100 | create.sequence | 124,022 | 146,611 | 1.18× |
| 100 | replace.random | 1,252,053 | 2,750,257 | 2.20× |
| 100 | apply.replace | 883,928 | 1,749,881 | 1.98× |
| 100 | apply.duplicate | 3,309,023 | 3,488,944 | 1.05× |
| 100 | merge.duplicate | 185,910 | 133,996 | 0.72× |
| 100 | length | 65,674,611 | 67,112,170 | 1.02× |
| 100 | value.random | 17,633,658 | 91,429,823 | 5.18× |
| 100 | values | 762,536 | 852,940 | 1.12× |
| 100 | sequence | 249,157 | 275,946 | 1.11× |

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

Measured on Node 24.22.2, V8 13.6.233.17-node.63, linux x64, Intel(R) Xeon(R) 6975P-C. Fixtures are hydrated compacted snapshots after one replacement per field. Each case warms up for ≥25 ms and measures ≥50 ms of API time; mutation bursts restart after 4,096 replacements. Peer authoring, encoding, result checks, destruction and explicit JS process garbage collection are outside API timings. Memory estimates are the increase in live native allocator bytes plus retained JS array slots for one instance, including exercised runtime buffers. Unused WASM capacity, JS object headers and referenced payload objects are excluded.
