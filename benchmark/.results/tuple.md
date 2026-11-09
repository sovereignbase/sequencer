# Tuple benchmarks

Arithmetic means of 3 runs. Ordinary Projection versus a static tuple with maxLength. Both contain the same values; replacements preserve the field count.

## Throughput (ops/s)

| Indices | Method / case | Projection | Static tuple | Tuple / Projection |
| ---: | --- | ---: | ---: | ---: |
| 2 | create.empty | 1,825,658 | 1,639,153 | 0.90× |
| 2 | create.sequence | 671,232 | 605,130 | 0.90× |
| 2 | replace.random | 727,952 | 1,167,663 | 1.60× |
| 2 | apply.replace | 496,236 | 649,176 | 1.31× |
| 2 | apply.duplicate | 1,042,062 | 827,449 | 0.79× |
| 2 | merge.duplicate | 938,761 | 920,916 | 0.98× |
| 2 | length | 67,765,545 | 68,154,110 | 1.01× |
| 2 | value.random | 31,247,502 | 50,026,903 | 1.60× |
| 2 | values | 5,352,421 | 4,893,772 | 0.91× |
| 2 | sequence | 2,152,085 | 2,021,650 | 0.94× |
| 4 | create.empty | 1,829,944 | 1,737,408 | 0.95× |
| 4 | create.sequence | 479,185 | 530,192 | 1.11× |
| 4 | replace.random | 765,676 | 1,239,945 | 1.62× |
| 4 | apply.replace | 396,319 | 755,856 | 1.91× |
| 4 | apply.duplicate | 881,500 | 790,546 | 0.90× |
| 4 | merge.duplicate | 770,002 | 728,110 | 0.95× |
| 4 | length | 30,427,672 | 31,569,611 | 1.04× |
| 4 | value.random | 25,741,279 | 49,159,717 | 1.91× |
| 4 | values | 4,148,607 | 4,167,777 | 1.00× |
| 4 | sequence | 1,865,898 | 1,707,118 | 0.91× |
| 8 | create.empty | 1,842,997 | 1,760,188 | 0.96× |
| 8 | create.sequence | 351,017 | 435,424 | 1.24× |
| 8 | replace.random | 773,074 | 1,159,168 | 1.50× |
| 8 | apply.replace | 353,373 | 631,010 | 1.79× |
| 8 | apply.duplicate | 822,522 | 818,234 | 0.99× |
| 8 | merge.duplicate | 510,211 | 468,782 | 0.92× |
| 8 | length | 31,498,982 | 31,047,532 | 0.99× |
| 8 | value.random | 19,929,925 | 49,563,350 | 2.49× |
| 8 | values | 3,046,632 | 3,042,558 | 1.00× |
| 8 | sequence | 1,413,222 | 1,345,643 | 0.95× |
| 100 | create.empty | 1,757,410 | 1,679,348 | 0.96× |
| 100 | create.sequence | 68,980 | 100,622 | 1.46× |
| 100 | replace.random | 670,840 | 1,180,230 | 1.76× |
| 100 | apply.replace | 331,266 | 730,372 | 2.20× |
| 100 | apply.duplicate | 807,717 | 798,736 | 0.99× |
| 100 | merge.duplicate | 117,180 | 83,020 | 0.71× |
| 100 | length | 32,272,487 | 30,746,248 | 0.95× |
| 100 | value.random | 9,127,830 | 48,386,741 | 5.30× |
| 100 | values | 519,736 | 514,178 | 0.99× |
| 100 | sequence | 157,556 | 175,650 | 1.11× |

## Space (KiB)

| Indices | Mode | Estimated allocated memory | MessagePack | MessagePack + gzip |
| ---: | --- | ---: | ---: | ---: |
| 2 | Projection | 0.98 | 0.03 | 0.04 |
| 2 | Static tuple | 0.90 | 0.04 | 0.05 |
| 4 | Projection | 1.57 | 0.06 | 0.05 |
| 4 | Static tuple | 1.09 | 0.06 | 0.07 |
| 8 | Projection | 2.52 | 0.12 | 0.08 |
| 8 | Static tuple | 1.55 | 0.10 | 0.09 |
| 100 | Projection | 23.78 | 0.67 | 0.57 |
| 100 | Static tuple | 12.23 | 0.51 | 0.35 |

Measured on Node 24.22.2, V8 13.6.233.17-node.63, linux x64, AMD EPYC 7763 64-Core Processor. Fixtures are hydrated compacted snapshots after one replacement per field. Each case warms up for ≥25 ms and measures ≥50 ms of API time; mutation bursts restart after 4,096 replacements. Peer authoring, encoding, result checks, destruction and explicit JS process garbage collection are outside API timings. Memory estimates are the increase in live native allocator bytes plus retained JS array slots for one instance, including exercised runtime buffers. Unused WASM capacity, JS object headers and referenced payload objects are excluded.
