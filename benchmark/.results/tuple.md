# Tuple benchmarks

2026-11-27T21:42:29.855Z · local run

Arithmetic means of 5 runs. Ordinary Projection versus a static tuple with maxLength. Both contain the same values; replacements preserve the field count.

## Throughput (ops/s)

| Indices | Method / case | Projection | Static tuple | Tuple / Projection |
| ---: | --- | ---: | ---: | ---: |
| 2 | create.empty | 2,926,152 | 2,192,603 | 0.75× |
| 2 | create.sequence | 862,789 | 762,162 | 0.88× |
| 2 | replace.random | 1,031,360 | 1,409,348 | 1.37× |
| 2 | apply.replace | 573,333 | 770,593 | 1.34× |
| 2 | apply.duplicate | 1,564,799 | 1,570,104 | 1.00× |
| 2 | merge.duplicate | 1,474,851 | 1,408,953 | 0.96× |
| 2 | length | 126,168,949 | 115,844,848 | 0.92× |
| 2 | value.random | 29,816,071 | 46,711,029 | 1.57× |
| 2 | values | 11,565,736 | 10,672,751 | 0.92× |
| 2 | sequence | 3,107,180 | 2,582,853 | 0.83× |
| 4 | create.empty | 2,162,708 | 2,148,253 | 0.99× |
| 4 | create.sequence | 643,115 | 613,511 | 0.95× |
| 4 | replace.random | 921,970 | 1,392,683 | 1.51× |
| 4 | apply.replace | 602,846 | 906,500 | 1.50× |
| 4 | apply.duplicate | 1,515,092 | 1,550,698 | 1.02× |
| 4 | merge.duplicate | 1,137,483 | 1,086,381 | 0.96× |
| 4 | length | 33,130,740 | 30,486,383 | 0.92× |
| 4 | value.random | 20,803,565 | 49,813,390 | 2.39× |
| 4 | values | 5,500,457 | 5,359,096 | 0.97× |
| 4 | sequence | 2,199,721 | 2,154,844 | 0.98× |
| 8 | create.empty | 2,295,921 | 2,193,765 | 0.96× |
| 8 | create.sequence | 428,103 | 500,612 | 1.17× |
| 8 | replace.random | 918,801 | 1,281,066 | 1.39× |
| 8 | apply.replace | 539,563 | 888,601 | 1.65× |
| 8 | apply.duplicate | 1,575,653 | 1,505,539 | 0.96× |
| 8 | merge.duplicate | 851,112 | 755,487 | 0.89× |
| 8 | length | 32,689,590 | 32,957,161 | 1.01× |
| 8 | value.random | 15,832,620 | 49,228,662 | 3.11× |
| 8 | values | 4,116,284 | 4,347,849 | 1.06× |
| 8 | sequence | 1,451,403 | 1,650,212 | 1.14× |
| 100 | create.empty | 2,124,946 | 2,032,442 | 0.96× |
| 100 | create.sequence | 62,706 | 76,420 | 1.22× |
| 100 | replace.random | 864,726 | 1,425,262 | 1.65× |
| 100 | apply.replace | 559,762 | 911,188 | 1.63× |
| 100 | apply.duplicate | 1,250,811 | 1,482,264 | 1.19× |
| 100 | merge.duplicate | 92,835 | 69,426 | 0.75× |
| 100 | length | 32,138,606 | 29,628,829 | 0.92× |
| 100 | value.random | 11,077,040 | 45,412,575 | 4.10× |
| 100 | values | 486,735 | 609,260 | 1.25× |
| 100 | sequence | 158,665 | 170,926 | 1.08× |

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
