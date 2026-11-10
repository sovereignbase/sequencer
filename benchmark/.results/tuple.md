# Tuple benchmarks

Arithmetic means of 3 runs. Ordinary Projection versus a static tuple with maxLength. Both contain the same values; replacements preserve the field count.

## Throughput (ops/s)

| Indices | Method / case | Projection | Static tuple | Tuple / Projection |
| ---: | --- | ---: | ---: | ---: |
| 2 | create.empty | 3,713,667 | 3,325,471 | 0.90× |
| 2 | create.sequence | 1,006,568 | 895,755 | 0.89× |
| 2 | replace.random | 1,254,976 | 2,275,597 | 1.81× |
| 2 | apply.replace | 843,986 | 1,247,814 | 1.48× |
| 2 | apply.duplicate | 2,025,826 | 2,198,311 | 1.09× |
| 2 | merge.duplicate | 1,517,123 | 1,549,575 | 1.02× |
| 2 | length | 284,799,752 | 286,016,575 | 1.00× |
| 2 | value.random | 46,184,264 | 80,447,809 | 1.74× |
| 2 | values | 11,244,729 | 11,402,823 | 1.01× |
| 2 | sequence | 4,316,172 | 3,875,994 | 0.90× |
| 4 | create.empty | 3,524,048 | 3,313,628 | 0.94× |
| 4 | create.sequence | 776,727 | 854,875 | 1.10× |
| 4 | replace.random | 1,192,077 | 2,039,668 | 1.71× |
| 4 | apply.replace | 577,922 | 1,190,332 | 2.06× |
| 4 | apply.duplicate | 2,349,068 | 2,114,327 | 0.90× |
| 4 | merge.duplicate | 1,292,262 | 1,158,044 | 0.90× |
| 4 | length | 297,934,294 | 298,082,217 | 1.00× |
| 4 | value.random | 35,991,470 | 76,772,014 | 2.13× |
| 4 | values | 9,929,238 | 7,896,863 | 0.80× |
| 4 | sequence | 3,652,744 | 3,240,744 | 0.89× |
| 8 | create.empty | 3,716,121 | 3,299,638 | 0.89× |
| 8 | create.sequence | 614,406 | 727,145 | 1.18× |
| 8 | replace.random | 1,229,542 | 2,289,466 | 1.86× |
| 8 | apply.replace | 595,387 | 1,204,565 | 2.02× |
| 8 | apply.duplicate | 2,208,395 | 1,900,877 | 0.86× |
| 8 | merge.duplicate | 882,541 | 846,483 | 0.96× |
| 8 | length | 290,448,072 | 285,835,236 | 0.98× |
| 8 | value.random | 28,619,826 | 78,211,445 | 2.73× |
| 8 | values | 7,026,373 | 7,193,191 | 1.02× |
| 8 | sequence | 2,800,142 | 2,618,871 | 0.94× |
| 100 | create.empty | 3,586,808 | 3,171,753 | 0.88× |
| 100 | create.sequence | 122,035 | 172,455 | 1.41× |
| 100 | replace.random | 1,107,440 | 2,356,048 | 2.13× |
| 100 | apply.replace | 527,412 | 1,284,259 | 2.44× |
| 100 | apply.duplicate | 2,035,262 | 1,691,529 | 0.83× |
| 100 | merge.duplicate | 207,392 | 143,904 | 0.69× |
| 100 | length | 297,024,064 | 284,644,750 | 0.96× |
| 100 | value.random | 13,095,932 | 76,888,720 | 5.87× |
| 100 | values | 876,183 | 984,206 | 1.12× |
| 100 | sequence | 277,080 | 314,479 | 1.13× |

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

Measured on Node 24.22.2, V8 13.6.233.17-node.63, linux x64, AMD EPYC 9V45 96-Core Processor. Fixtures are hydrated compacted snapshots after one replacement per field. Each case warms up for ≥25 ms and measures ≥50 ms of API time; mutation bursts restart after 4,096 replacements. Peer authoring, encoding, result checks, destruction and explicit JS process garbage collection are outside API timings. Memory estimates are the increase in live native allocator bytes plus retained JS array slots for one instance, including exercised runtime buffers. Unused WASM capacity, JS object headers and referenced payload objects are excluded.
