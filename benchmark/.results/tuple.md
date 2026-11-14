# Tuple benchmarks

Arithmetic means of 3 runs. Ordinary Projection versus a static tuple with maxLength. Both contain the same values; replacements preserve the field count.

## Throughput (ops/s)

| Indices | Method / case | Projection | Static tuple | Tuple / Projection |
| ---: | --- | ---: | ---: | ---: |
| 2 | create.empty | 3,949,087 | 3,769,049 | 0.95× |
| 2 | create.sequence | 1,393,942 | 1,201,898 | 0.86× |
| 2 | replace.random | 1,608,002 | 2,806,884 | 1.75× |
| 2 | apply.replace | 994,698 | 1,704,356 | 1.71× |
| 2 | apply.duplicate | 3,630,965 | 3,319,295 | 0.91× |
| 2 | merge.duplicate | 2,539,087 | 2,224,879 | 0.88× |
| 2 | length | 131,620,073 | 131,444,756 | 1.00× |
| 2 | value.random | 45,776,197 | 90,445,688 | 1.98× |
| 2 | values | 14,957,262 | 15,567,352 | 1.04× |
| 2 | sequence | 3,968,955 | 4,173,297 | 1.05× |
| 4 | create.empty | 3,943,998 | 3,860,159 | 0.98× |
| 4 | create.sequence | 1,072,460 | 1,046,722 | 0.98× |
| 4 | replace.random | 1,334,885 | 2,836,181 | 2.12× |
| 4 | apply.replace | 898,035 | 1,791,710 | 2.00× |
| 4 | apply.duplicate | 3,515,172 | 3,523,468 | 1.00× |
| 4 | merge.duplicate | 1,771,791 | 1,597,843 | 0.90× |
| 4 | length | 64,807,857 | 67,242,749 | 1.04× |
| 4 | value.random | 32,848,547 | 87,674,638 | 2.67× |
| 4 | values | 9,579,010 | 10,322,291 | 1.08× |
| 4 | sequence | 4,158,148 | 3,462,616 | 0.83× |
| 8 | create.empty | 4,081,118 | 4,007,162 | 0.98× |
| 8 | create.sequence | 748,773 | 862,800 | 1.15× |
| 8 | replace.random | 1,266,738 | 2,748,942 | 2.17× |
| 8 | apply.replace | 899,863 | 1,769,542 | 1.97× |
| 8 | apply.duplicate | 3,617,728 | 3,525,359 | 0.97× |
| 8 | merge.duplicate | 1,175,294 | 1,103,844 | 0.94× |
| 8 | length | 65,758,764 | 65,194,896 | 0.99× |
| 8 | value.random | 25,031,024 | 89,617,677 | 3.58× |
| 8 | values | 6,745,951 | 6,832,045 | 1.01× |
| 8 | sequence | 2,974,279 | 2,834,145 | 0.95× |
| 100 | create.empty | 3,791,497 | 3,793,106 | 1.00× |
| 100 | create.sequence | 123,801 | 146,170 | 1.18× |
| 100 | replace.random | 1,287,895 | 2,857,508 | 2.22× |
| 100 | apply.replace | 880,013 | 1,727,774 | 1.96× |
| 100 | apply.duplicate | 3,406,208 | 3,493,943 | 1.03× |
| 100 | merge.duplicate | 183,969 | 131,239 | 0.71× |
| 100 | length | 65,748,097 | 65,409,829 | 0.99× |
| 100 | value.random | 17,185,330 | 88,930,330 | 5.17× |
| 100 | values | 740,095 | 856,323 | 1.16× |
| 100 | sequence | 263,923 | 278,456 | 1.06× |

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
