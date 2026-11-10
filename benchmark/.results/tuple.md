# Tuple benchmarks

Arithmetic means of 3 runs. Ordinary Projection versus a static tuple with maxLength. Both contain the same values; replacements preserve the field count.

## Throughput (ops/s)

| Indices | Method / case | Projection | Static tuple | Tuple / Projection |
| ---: | --- | ---: | ---: | ---: |
| 2 | create.empty | 2,004,575 | 1,610,853 | 0.80× |
| 2 | create.sequence | 678,647 | 608,867 | 0.90× |
| 2 | replace.random | 700,964 | 1,072,984 | 1.53× |
| 2 | apply.replace | 590,765 | 691,576 | 1.17× |
| 2 | apply.duplicate | 1,067,903 | 928,465 | 0.87× |
| 2 | merge.duplicate | 901,204 | 876,407 | 0.97× |
| 2 | length | 69,627,570 | 67,580,284 | 0.97× |
| 2 | value.random | 31,408,632 | 52,939,345 | 1.69× |
| 2 | values | 5,122,688 | 5,286,638 | 1.03× |
| 2 | sequence | 2,216,157 | 2,040,818 | 0.92× |
| 4 | create.empty | 1,941,052 | 1,807,184 | 0.93× |
| 4 | create.sequence | 520,021 | 545,237 | 1.05× |
| 4 | replace.random | 804,066 | 1,149,831 | 1.43× |
| 4 | apply.replace | 440,549 | 765,649 | 1.74× |
| 4 | apply.duplicate | 957,742 | 881,470 | 0.92× |
| 4 | merge.duplicate | 770,103 | 683,983 | 0.89× |
| 4 | length | 31,690,780 | 31,161,543 | 0.98× |
| 4 | value.random | 26,957,662 | 63,941,478 | 2.37× |
| 4 | values | 4,167,575 | 4,269,929 | 1.02× |
| 4 | sequence | 1,826,171 | 1,943,584 | 1.06× |
| 8 | create.empty | 1,995,546 | 1,732,679 | 0.87× |
| 8 | create.sequence | 383,417 | 442,536 | 1.15× |
| 8 | replace.random | 848,319 | 1,105,360 | 1.30× |
| 8 | apply.replace | 389,188 | 794,364 | 2.04× |
| 8 | apply.duplicate | 877,322 | 943,042 | 1.07× |
| 8 | merge.duplicate | 462,093 | 508,802 | 1.10× |
| 8 | length | 30,151,918 | 30,970,375 | 1.03× |
| 8 | value.random | 18,935,249 | 61,050,583 | 3.22× |
| 8 | values | 3,286,827 | 3,377,400 | 1.03× |
| 8 | sequence | 1,382,458 | 1,527,638 | 1.11× |
| 100 | create.empty | 1,943,854 | 1,743,911 | 0.90× |
| 100 | create.sequence | 69,739 | 92,715 | 1.33× |
| 100 | replace.random | 677,009 | 1,178,842 | 1.74× |
| 100 | apply.replace | 338,100 | 797,540 | 2.36× |
| 100 | apply.duplicate | 917,937 | 843,888 | 0.92× |
| 100 | merge.duplicate | 113,086 | 77,819 | 0.69× |
| 100 | length | 31,124,276 | 31,298,985 | 1.01× |
| 100 | value.random | 9,006,528 | 62,560,913 | 6.95× |
| 100 | values | 485,957 | 575,760 | 1.18× |
| 100 | sequence | 154,333 | 166,789 | 1.08× |

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

Measured on Node 24.22.2, V8 13.6.233.17-node.63, linux x64, AMD EPYC 7763 64-Core Processor. Fixtures are hydrated compacted snapshots after one replacement per field. Each case warms up for ≥25 ms and measures ≥50 ms of API time; mutation bursts restart after 4,096 replacements. Peer authoring, encoding, result checks, destruction and explicit JS process garbage collection are outside API timings. Memory estimates are the increase in live native allocator bytes plus retained JS array slots for one instance, including exercised runtime buffers. Unused WASM capacity, JS object headers and referenced payload objects are excluded.
