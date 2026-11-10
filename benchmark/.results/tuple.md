# Tuple benchmarks

Arithmetic means of 3 runs. Ordinary Projection versus a static tuple with maxLength. Both contain the same values; replacements preserve the field count.

## Throughput (ops/s)

| Indices | Method / case | Projection | Static tuple | Tuple / Projection |
| ---: | --- | ---: | ---: | ---: |
| 2 | create.empty | 1,708,585 | 1,461,948 | 0.86× |
| 2 | create.sequence | 655,035 | 567,631 | 0.87× |
| 2 | replace.random | 729,090 | 1,131,956 | 1.55× |
| 2 | apply.replace | 527,911 | 682,592 | 1.29× |
| 2 | apply.duplicate | 786,586 | 752,535 | 0.96× |
| 2 | merge.duplicate | 852,072 | 784,447 | 0.92× |
| 2 | length | 115,991,200 | 110,922,163 | 0.96× |
| 2 | value.random | 25,741,854 | 40,200,076 | 1.56× |
| 2 | values | 4,078,286 | 3,381,697 | 0.83× |
| 2 | sequence | 1,482,011 | 1,279,921 | 0.86× |
| 4 | create.empty | 1,213,629 | 1,113,270 | 0.92× |
| 4 | create.sequence | 368,804 | 384,430 | 1.04× |
| 4 | replace.random | 646,095 | 895,062 | 1.39× |
| 4 | apply.replace | 309,623 | 545,099 | 1.76× |
| 4 | apply.duplicate | 682,662 | 613,465 | 0.90× |
| 4 | merge.duplicate | 525,648 | 427,940 | 0.81× |
| 4 | length | 90,944,417 | 103,237,215 | 1.14× |
| 4 | value.random | 20,933,492 | 40,262,360 | 1.92× |
| 4 | values | 3,132,768 | 3,256,641 | 1.04× |
| 4 | sequence | 1,450,133 | 1,396,354 | 0.96× |
| 8 | create.empty | 1,428,232 | 1,381,754 | 0.97× |
| 8 | create.sequence | 321,304 | 377,905 | 1.18× |
| 8 | replace.random | 674,094 | 1,033,396 | 1.53× |
| 8 | apply.replace | 290,298 | 422,935 | 1.46× |
| 8 | apply.duplicate | 789,870 | 608,289 | 0.77× |
| 8 | merge.duplicate | 398,163 | 409,540 | 1.03× |
| 8 | length | 107,087,569 | 105,719,246 | 0.99× |
| 8 | value.random | 14,186,324 | 35,039,107 | 2.47× |
| 8 | values | 2,360,651 | 2,299,380 | 0.97× |
| 8 | sequence | 1,088,660 | 1,034,727 | 0.95× |
| 100 | create.empty | 1,437,581 | 1,298,502 | 0.90× |
| 100 | create.sequence | 51,410 | 81,770 | 1.59× |
| 100 | replace.random | 495,750 | 1,064,078 | 2.15× |
| 100 | apply.replace | 230,210 | 567,547 | 2.47× |
| 100 | apply.duplicate | 707,616 | 698,917 | 0.99× |
| 100 | merge.duplicate | 91,488 | 63,802 | 0.70× |
| 100 | length | 82,603,699 | 85,708,898 | 1.04× |
| 100 | value.random | 7,987,133 | 44,342,892 | 5.55× |
| 100 | values | 402,612 | 445,786 | 1.11× |
| 100 | sequence | 134,200 | 140,663 | 1.05× |

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
