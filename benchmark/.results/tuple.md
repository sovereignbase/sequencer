# Tuple benchmarks

Arithmetic means of 3 runs. Ordinary Projection versus a static tuple with maxLength. Both contain the same values; replacements preserve the field count.

## Throughput (ops/s)

| Indices | Method / case | Projection | Static tuple | Tuple / Projection |
| ---: | --- | ---: | ---: | ---: |
| 2 | create.empty | 1,301,080 | 1,220,890 | 0.94× |
| 2 | create.sequence | 469,604 | 401,590 | 0.86× |
| 2 | replace.random | 588,444 | 800,354 | 1.36× |
| 2 | apply.replace | 425,111 | 527,211 | 1.24× |
| 2 | apply.duplicate | 853,041 | 575,913 | 0.68× |
| 2 | merge.duplicate | 698,495 | 695,097 | 1.00× |
| 2 | length | 57,361,106 | 48,017,855 | 0.84× |
| 2 | value.random | 27,772,078 | 44,951,228 | 1.62× |
| 2 | values | 3,891,055 | 3,271,610 | 0.84× |
| 2 | sequence | 1,284,840 | 1,337,604 | 1.04× |
| 4 | create.empty | 1,267,272 | 1,099,258 | 0.87× |
| 4 | create.sequence | 371,168 | 393,276 | 1.06× |
| 4 | replace.random | 652,779 | 928,128 | 1.42× |
| 4 | apply.replace | 284,757 | 602,494 | 2.12× |
| 4 | apply.duplicate | 787,188 | 662,158 | 0.84× |
| 4 | merge.duplicate | 587,216 | 561,827 | 0.96× |
| 4 | length | 18,446,832 | 19,663,788 | 1.07× |
| 4 | value.random | 15,881,983 | 35,579,299 | 2.24× |
| 4 | values | 2,593,500 | 2,728,091 | 1.05× |
| 4 | sequence | 1,150,664 | 1,245,054 | 1.08× |
| 8 | create.empty | 1,171,847 | 994,615 | 0.85× |
| 8 | create.sequence | 245,264 | 302,009 | 1.23× |
| 8 | replace.random | 582,248 | 980,154 | 1.68× |
| 8 | apply.replace | 234,801 | 503,042 | 2.14× |
| 8 | apply.duplicate | 976,251 | 831,615 | 0.85× |
| 8 | merge.duplicate | 389,055 | 347,783 | 0.89× |
| 8 | length | 23,045,676 | 20,996,118 | 0.91× |
| 8 | value.random | 10,269,621 | 31,284,326 | 3.05× |
| 8 | values | 2,088,907 | 2,252,186 | 1.08× |
| 8 | sequence | 848,460 | 1,033,023 | 1.22× |
| 100 | create.empty | 1,175,356 | 906,379 | 0.77× |
| 100 | create.sequence | 47,156 | 62,407 | 1.32× |
| 100 | replace.random | 531,998 | 781,341 | 1.47× |
| 100 | apply.replace | 244,130 | 631,967 | 2.59× |
| 100 | apply.duplicate | 611,755 | 527,480 | 0.86× |
| 100 | merge.duplicate | 70,545 | 60,973 | 0.86× |
| 100 | length | 20,661,479 | 19,286,032 | 0.93× |
| 100 | value.random | 6,520,938 | 36,127,913 | 5.54× |
| 100 | values | 395,386 | 452,509 | 1.14× |
| 100 | sequence | 133,463 | 153,534 | 1.15× |

## Space (KiB)

| Indices | Mode | Estimated allocated memory | MessagePack | MessagePack + gzip |
| ---: | --- | ---: | ---: | ---: |
| 2 | Projection | 0.84 | 0.03 | 0.04 |
| 2 | Static tuple | 0.84 | 0.04 | 0.05 |
| 4 | Projection | 1.51 | 0.06 | 0.05 |
| 4 | Static tuple | 1.02 | 0.06 | 0.07 |
| 8 | Projection | 2.45 | 0.12 | 0.08 |
| 8 | Static tuple | 1.49 | 0.10 | 0.09 |
| 100 | Projection | 23.34 | 0.67 | 0.57 |
| 100 | Static tuple | 12.16 | 0.51 | 0.35 |

Measured on Node 24.16.0, V8 13.6.233.17-node.49, win32 x64, Intel(R) Core(TM) i5-10210U CPU @ 1.60GHz. Fixtures are hydrated compacted snapshots after one replacement per field. Each case warms up for ≥25 ms and measures ≥50 ms of API time; mutation bursts restart after 4,096 replacements. Peer authoring, encoding, result checks, destruction and explicit JS process garbage collection are outside API timings. Memory estimates are the increase in live native allocator bytes plus retained JS array slots for one instance, including exercised runtime buffers. Unused WASM capacity, JS object headers and referenced payload objects are excluded.
