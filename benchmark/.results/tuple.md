# Tuple benchmarks

Arithmetic means of 3 runs. Ordinary Projection versus a static tuple with maxLength. Both contain the same values; replacements preserve the field count.

## Throughput (ops/s)

| Indices | Method / case | Projection | Static tuple | Tuple / Projection |
| ---: | --- | ---: | ---: | ---: |
| 2 | create.empty | 2,598,116 | 2,440,702 | 0.94× |
| 2 | create.sequence | 833,115 | 728,739 | 0.87× |
| 2 | replace.random | 1,007,276 | 1,541,315 | 1.53× |
| 2 | apply.replace | 725,842 | 941,281 | 1.30× |
| 2 | apply.duplicate | 1,504,288 | 1,386,931 | 0.92× |
| 2 | merge.duplicate | 1,254,545 | 1,147,632 | 0.91× |
| 2 | length | 93,243,200 | 86,245,564 | 0.92× |
| 2 | value.random | 42,168,976 | 75,752,142 | 1.80× |
| 2 | values | 8,429,542 | 8,599,601 | 1.02× |
| 2 | sequence | 3,469,798 | 3,410,437 | 0.98× |
| 4 | create.empty | 2,484,249 | 2,448,662 | 0.99× |
| 4 | create.sequence | 640,112 | 670,344 | 1.05× |
| 4 | replace.random | 1,019,018 | 1,630,451 | 1.60× |
| 4 | apply.replace | 552,925 | 1,017,676 | 1.84× |
| 4 | apply.duplicate | 1,568,432 | 1,365,555 | 0.87× |
| 4 | merge.duplicate | 984,484 | 892,393 | 0.91× |
| 4 | length | 37,572,682 | 38,031,859 | 1.01× |
| 4 | value.random | 32,450,853 | 77,008,706 | 2.37× |
| 4 | values | 6,584,939 | 6,585,680 | 1.00× |
| 4 | sequence | 3,270,361 | 2,934,301 | 0.90× |
| 8 | create.empty | 2,611,714 | 2,367,808 | 0.91× |
| 8 | create.sequence | 476,754 | 550,834 | 1.16× |
| 8 | replace.random | 1,029,086 | 1,724,635 | 1.68× |
| 8 | apply.replace | 515,766 | 1,029,664 | 2.00× |
| 8 | apply.duplicate | 1,364,705 | 1,395,076 | 1.02× |
| 8 | merge.duplicate | 706,530 | 608,879 | 0.86× |
| 8 | length | 37,927,928 | 38,481,378 | 1.01× |
| 8 | value.random | 25,605,553 | 76,437,508 | 2.99× |
| 8 | values | 5,162,376 | 5,099,174 | 0.99× |
| 8 | sequence | 2,275,450 | 2,416,938 | 1.06× |
| 100 | create.empty | 2,527,666 | 2,195,831 | 0.87× |
| 100 | create.sequence | 88,657 | 122,782 | 1.38× |
| 100 | replace.random | 896,178 | 1,808,913 | 2.02× |
| 100 | apply.replace | 417,774 | 1,089,658 | 2.61× |
| 100 | apply.duplicate | 1,538,748 | 1,337,946 | 0.87× |
| 100 | merge.duplicate | 144,942 | 103,291 | 0.71× |
| 100 | length | 39,597,718 | 34,333,240 | 0.87× |
| 100 | value.random | 11,824,378 | 77,704,289 | 6.57× |
| 100 | values | 664,446 | 782,276 | 1.18× |
| 100 | sequence | 198,662 | 235,781 | 1.19× |

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

Measured on Node 24.22.2, V8 13.6.233.17-node.63, linux x64, AMD EPYC 9V74 80-Core Processor. Fixtures are hydrated compacted snapshots after one replacement per field. Each case warms up for ≥25 ms and measures ≥50 ms of API time; mutation bursts restart after 4,096 replacements. Peer authoring, encoding, result checks, destruction and explicit JS process garbage collection are outside API timings. Memory estimates are the increase in live native allocator bytes plus retained JS array slots for one instance, including exercised runtime buffers. Unused WASM capacity, JS object headers and referenced payload objects are excluded.
