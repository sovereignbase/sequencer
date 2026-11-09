# Tuple benchmarks

Arithmetic means of 3 runs. Ordinary Projection versus a static tuple with maxLength. Both contain the same values; replacements preserve the field count.

## Throughput (ops/s)

| Indices | Method / case | Projection | Static tuple | Tuple / Projection |
| ---: | --- | ---: | ---: | ---: |
| 2 | create.empty | 1,700,656 | 1,589,679 | 0.93× |
| 2 | create.sequence | 666,485 | 589,182 | 0.88× |
| 2 | replace.random | 713,174 | 1,115,805 | 1.56× |
| 2 | apply.replace | 508,935 | 700,611 | 1.38× |
| 2 | apply.duplicate | 786,970 | 731,917 | 0.93× |
| 2 | merge.duplicate | 837,497 | 823,305 | 0.98× |
| 2 | length | 67,882,997 | 69,326,567 | 1.02× |
| 2 | value.random | 30,174,106 | 48,218,497 | 1.60× |
| 2 | values | 5,142,913 | 4,956,315 | 0.96× |
| 2 | sequence | 2,148,924 | 2,019,791 | 0.94× |
| 4 | create.empty | 1,741,551 | 1,704,490 | 0.98× |
| 4 | create.sequence | 458,897 | 519,633 | 1.13× |
| 4 | replace.random | 735,182 | 1,138,983 | 1.55× |
| 4 | apply.replace | 417,043 | 707,797 | 1.70× |
| 4 | apply.duplicate | 887,708 | 820,628 | 0.92× |
| 4 | merge.duplicate | 754,390 | 707,937 | 0.94× |
| 4 | length | 30,660,400 | 32,352,545 | 1.06× |
| 4 | value.random | 26,113,205 | 50,651,808 | 1.94× |
| 4 | values | 3,472,613 | 3,790,165 | 1.09× |
| 4 | sequence | 1,848,762 | 1,707,042 | 0.92× |
| 8 | create.empty | 1,808,501 | 1,693,219 | 0.94× |
| 8 | create.sequence | 349,073 | 425,121 | 1.22× |
| 8 | replace.random | 709,998 | 1,128,141 | 1.59× |
| 8 | apply.replace | 412,048 | 735,958 | 1.79× |
| 8 | apply.duplicate | 877,086 | 761,606 | 0.87× |
| 8 | merge.duplicate | 489,402 | 486,277 | 0.99× |
| 8 | length | 30,957,985 | 31,051,292 | 1.00× |
| 8 | value.random | 19,625,431 | 50,234,180 | 2.56× |
| 8 | values | 3,337,576 | 2,981,798 | 0.89× |
| 8 | sequence | 1,320,636 | 1,165,575 | 0.88× |
| 100 | create.empty | 1,717,217 | 1,683,402 | 0.98× |
| 100 | create.sequence | 69,823 | 98,188 | 1.41× |
| 100 | replace.random | 697,750 | 1,214,212 | 1.74× |
| 100 | apply.replace | 323,195 | 751,943 | 2.33× |
| 100 | apply.duplicate | 777,987 | 852,390 | 1.10× |
| 100 | merge.duplicate | 116,592 | 77,987 | 0.67× |
| 100 | length | 30,664,167 | 31,234,275 | 1.02× |
| 100 | value.random | 8,758,041 | 49,605,873 | 5.66× |
| 100 | values | 515,316 | 488,211 | 0.95× |
| 100 | sequence | 153,474 | 184,712 | 1.20× |

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
