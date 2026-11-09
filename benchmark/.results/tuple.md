# Tuple benchmarks

Arithmetic means of 3 runs. Ordinary Projection versus a static tuple with maxLength. Both contain the same values; replacements preserve the field count.

## Throughput (ops/s)

| Indices | Method / case | Projection | Static tuple | Tuple / Projection |
| ---: | --- | ---: | ---: | ---: |
| 2 | create.empty | 1,484,001 | 1,377,320 | 0.93× |
| 2 | create.sequence | 610,508 | 615,668 | 1.01× |
| 2 | replace.random | 720,958 | 1,164,376 | 1.62× |
| 2 | apply.replace | 515,962 | 605,798 | 1.17× |
| 2 | apply.duplicate | 900,954 | 925,768 | 1.03× |
| 2 | merge.duplicate | 898,334 | 823,117 | 0.92× |
| 2 | length | 67,597,509 | 63,304,662 | 0.94× |
| 2 | value.random | 24,510,210 | 40,139,289 | 1.64× |
| 2 | values | 3,978,419 | 4,186,013 | 1.05× |
| 2 | sequence | 2,009,322 | 1,744,042 | 0.87× |
| 4 | create.empty | 1,539,241 | 1,407,831 | 0.91× |
| 4 | create.sequence | 454,900 | 531,467 | 1.17× |
| 4 | replace.random | 793,964 | 1,210,918 | 1.53× |
| 4 | apply.replace | 388,809 | 743,998 | 1.91× |
| 4 | apply.duplicate | 885,078 | 803,561 | 0.91× |
| 4 | merge.duplicate | 745,678 | 672,765 | 0.90× |
| 4 | length | 28,439,777 | 27,957,603 | 0.98× |
| 4 | value.random | 22,004,311 | 46,967,121 | 2.13× |
| 4 | values | 3,469,434 | 3,469,456 | 1.00× |
| 4 | sequence | 1,618,041 | 1,772,528 | 1.10× |
| 8 | create.empty | 1,597,580 | 1,560,791 | 0.98× |
| 8 | create.sequence | 309,994 | 340,727 | 1.10× |
| 8 | replace.random | 796,184 | 1,231,548 | 1.55× |
| 8 | apply.replace | 339,953 | 795,186 | 2.34× |
| 8 | apply.duplicate | 891,548 | 874,964 | 0.98× |
| 8 | merge.duplicate | 463,097 | 481,967 | 1.04× |
| 8 | length | 29,211,123 | 28,059,015 | 0.96× |
| 8 | value.random | 17,333,775 | 45,519,557 | 2.63× |
| 8 | values | 2,756,018 | 2,818,664 | 1.02× |
| 8 | sequence | 1,281,476 | 1,238,316 | 0.97× |
| 100 | create.empty | 1,549,537 | 1,440,477 | 0.93× |
| 100 | create.sequence | 56,642 | 94,815 | 1.67× |
| 100 | replace.random | 636,461 | 1,139,951 | 1.79× |
| 100 | apply.replace | 278,665 | 728,127 | 2.61× |
| 100 | apply.duplicate | 891,451 | 743,400 | 0.83× |
| 100 | merge.duplicate | 105,526 | 73,643 | 0.70× |
| 100 | length | 27,572,904 | 29,426,321 | 1.07× |
| 100 | value.random | 8,465,221 | 42,916,778 | 5.07× |
| 100 | values | 435,890 | 497,036 | 1.14× |
| 100 | sequence | 135,454 | 160,324 | 1.18× |

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

Measured on Node 24.16.0, V8 13.6.233.17-node.49, win32 x64, Intel(R) Core(TM) i5-10210U CPU @ 1.60GHz. Fixtures are hydrated compacted snapshots after one replacement per field. Each case warms up for ≥25 ms and measures ≥50 ms of API time; mutation bursts restart after 4,096 replacements. Peer authoring, encoding, result checks, destruction and explicit JS process garbage collection are outside API timings. Memory estimates are the increase in live native allocator bytes plus retained JS array slots for one instance, including exercised runtime buffers. Unused WASM capacity, JS object headers and referenced payload objects are excluded.
