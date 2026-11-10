# Tuple benchmarks

Arithmetic means of 3 runs. Ordinary Projection versus a static tuple with maxLength. Both contain the same values; replacements preserve the field count.

## Throughput (ops/s)

| Indices | Method / case | Projection | Static tuple | Tuple / Projection |
| ---: | --- | ---: | ---: | ---: |
| 2 | create.empty | 1,740,945 | 1,500,544 | 0.86× |
| 2 | create.sequence | 624,381 | 579,103 | 0.93× |
| 2 | replace.random | 704,958 | 941,515 | 1.34× |
| 2 | apply.replace | 466,619 | 587,984 | 1.26× |
| 2 | apply.duplicate | 816,870 | 768,437 | 0.94× |
| 2 | merge.duplicate | 797,958 | 783,203 | 0.98× |
| 2 | length | 62,651,701 | 56,097,239 | 0.90× |
| 2 | value.random | 23,801,667 | 54,302,540 | 2.28× |
| 2 | values | 4,190,715 | 4,151,470 | 0.99× |
| 2 | sequence | 1,772,317 | 1,710,093 | 0.96× |
| 4 | create.empty | 1,631,132 | 1,499,461 | 0.92× |
| 4 | create.sequence | 489,816 | 517,863 | 1.06× |
| 4 | replace.random | 763,402 | 1,223,986 | 1.60× |
| 4 | apply.replace | 350,401 | 668,482 | 1.91× |
| 4 | apply.duplicate | 916,254 | 912,175 | 1.00× |
| 4 | merge.duplicate | 667,184 | 640,913 | 0.96× |
| 4 | length | 28,095,143 | 32,868,955 | 1.17× |
| 4 | value.random | 17,634,330 | 44,817,433 | 2.54× |
| 4 | values | 2,978,696 | 3,274,555 | 1.10× |
| 4 | sequence | 1,343,625 | 1,444,375 | 1.07× |
| 8 | create.empty | 1,568,244 | 1,466,237 | 0.93× |
| 8 | create.sequence | 354,773 | 398,491 | 1.12× |
| 8 | replace.random | 737,792 | 1,111,272 | 1.51× |
| 8 | apply.replace | 324,842 | 684,244 | 2.11× |
| 8 | apply.duplicate | 842,652 | 860,269 | 1.02× |
| 8 | merge.duplicate | 449,324 | 453,502 | 1.01× |
| 8 | length | 26,702,502 | 25,381,521 | 0.95× |
| 8 | value.random | 15,076,107 | 56,547,654 | 3.75× |
| 8 | values | 2,538,873 | 2,836,805 | 1.12× |
| 8 | sequence | 1,121,207 | 1,233,654 | 1.10× |
| 100 | create.empty | 1,539,721 | 1,488,768 | 0.97× |
| 100 | create.sequence | 57,402 | 93,790 | 1.63× |
| 100 | replace.random | 620,928 | 1,151,064 | 1.85× |
| 100 | apply.replace | 282,753 | 742,871 | 2.63× |
| 100 | apply.duplicate | 902,895 | 783,004 | 0.87× |
| 100 | merge.duplicate | 93,261 | 70,268 | 0.75× |
| 100 | length | 26,632,461 | 25,918,002 | 0.97× |
| 100 | value.random | 7,170,973 | 51,581,079 | 7.19× |
| 100 | values | 403,144 | 452,950 | 1.12× |
| 100 | sequence | 124,773 | 135,677 | 1.09× |

## Space (KiB)

| Indices | Mode | Estimated allocated memory | MessagePack | MessagePack + gzip |
| ---: | --- | ---: | ---: | ---: |
| 2 | Projection | 0.86 | 0.03 | 0.04 |
| 2 | Static tuple | 0.85 | 0.04 | 0.05 |
| 4 | Projection | 1.54 | 0.06 | 0.05 |
| 4 | Static tuple | 1.04 | 0.06 | 0.07 |
| 8 | Projection | 2.49 | 0.12 | 0.08 |
| 8 | Static tuple | 1.51 | 0.10 | 0.09 |
| 100 | Projection | 23.75 | 0.67 | 0.57 |
| 100 | Static tuple | 12.18 | 0.51 | 0.35 |

Measured on Node 24.16.0, V8 13.6.233.17-node.49, win32 x64, Intel(R) Core(TM) i5-10210U CPU @ 1.60GHz. Fixtures are hydrated compacted snapshots after one replacement per field. Each case warms up for ≥25 ms and measures ≥50 ms of API time; mutation bursts restart after 4,096 replacements. Peer authoring, encoding, result checks, destruction and explicit JS process garbage collection are outside API timings. Memory estimates are the increase in live native allocator bytes plus retained JS array slots for one instance, including exercised runtime buffers. Unused WASM capacity, JS object headers and referenced payload objects are excluded.
