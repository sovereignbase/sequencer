# Tuple benchmarks

Arithmetic means of 3 runs. Ordinary Projection versus a static tuple with maxLength. Both contain the same values; replacements preserve the field count.

## Throughput (ops/s)

| Indices | Method / case | Projection | Static tuple | Tuple / Projection |
| ---: | --- | ---: | ---: | ---: |
| 2 | create.empty | 2,526,427 | 2,167,143 | 0.86× |
| 2 | create.sequence | 817,107 | 730,445 | 0.89× |
| 2 | replace.random | 848,497 | 1,658,557 | 1.95× |
| 2 | apply.replace | 603,558 | 1,033,421 | 1.71× |
| 2 | apply.duplicate | 2,073,148 | 2,005,134 | 0.97× |
| 2 | merge.duplicate | 1,215,212 | 1,295,035 | 1.07× |
| 2 | length | 70,615,070 | 77,581,930 | 1.10× |
| 2 | value.random | 36,313,328 | 62,077,366 | 1.71× |
| 2 | values | 11,268,311 | 12,254,965 | 1.09× |
| 2 | sequence | 2,524,355 | 2,411,998 | 0.96× |
| 4 | create.empty | 2,517,551 | 2,278,737 | 0.91× |
| 4 | create.sequence | 603,464 | 640,262 | 1.06× |
| 4 | replace.random | 871,197 | 1,686,392 | 1.94× |
| 4 | apply.replace | 478,987 | 1,099,985 | 2.30× |
| 4 | apply.duplicate | 2,051,083 | 2,057,513 | 1.00× |
| 4 | merge.duplicate | 968,127 | 945,632 | 0.98× |
| 4 | length | 41,629,473 | 41,984,712 | 1.01× |
| 4 | value.random | 28,443,287 | 63,491,471 | 2.23× |
| 4 | values | 7,737,364 | 8,114,854 | 1.05× |
| 4 | sequence | 2,084,295 | 2,132,970 | 1.02× |
| 8 | create.empty | 2,536,738 | 2,174,462 | 0.86× |
| 8 | create.sequence | 450,797 | 501,648 | 1.11× |
| 8 | replace.random | 927,991 | 1,610,015 | 1.73× |
| 8 | apply.replace | 445,201 | 1,022,159 | 2.30× |
| 8 | apply.duplicate | 2,024,488 | 2,058,110 | 1.02× |
| 8 | merge.duplicate | 718,502 | 667,956 | 0.93× |
| 8 | length | 44,269,790 | 42,803,496 | 0.97× |
| 8 | value.random | 20,262,453 | 60,510,791 | 2.99× |
| 8 | values | 5,355,133 | 5,654,620 | 1.06× |
| 8 | sequence | 1,584,764 | 1,609,761 | 1.02× |
| 100 | create.empty | 2,294,842 | 2,016,199 | 0.88× |
| 100 | create.sequence | 79,027 | 97,885 | 1.24× |
| 100 | replace.random | 812,299 | 1,737,166 | 2.14× |
| 100 | apply.replace | 387,844 | 1,090,112 | 2.81× |
| 100 | apply.duplicate | 2,039,582 | 2,052,705 | 1.01× |
| 100 | merge.duplicate | 129,753 | 92,302 | 0.71× |
| 100 | length | 42,608,204 | 38,773,441 | 0.91× |
| 100 | value.random | 9,491,581 | 60,732,639 | 6.40× |
| 100 | values | 592,650 | 712,637 | 1.20× |
| 100 | sequence | 180,881 | 198,592 | 1.10× |

## Space (KiB)

| Indices | Mode | Estimated allocated memory | MessagePack | MessagePack + gzip |
| ---: | --- | ---: | ---: | ---: |
| 2 | Projection | 0.80 | 0.03 | 0.04 |
| 2 | Static tuple | 0.79 | 0.04 | 0.05 |
| 4 | Projection | 1.45 | 0.06 | 0.05 |
| 4 | Static tuple | 0.96 | 0.06 | 0.07 |
| 8 | Projection | 2.36 | 0.12 | 0.08 |
| 8 | Static tuple | 1.40 | 0.10 | 0.09 |
| 100 | Projection | 22.54 | 0.67 | 0.57 |
| 100 | Static tuple | 11.35 | 0.51 | 0.35 |

Measured on Node 24.22.2, V8 13.6.233.17-node.63, linux x64, AMD EPYC 7763 64-Core Processor. Fixtures are hydrated compacted snapshots after one replacement per field. Each case warms up for ≥25 ms and measures ≥50 ms of API time; mutation bursts restart after 4,096 replacements. Peer authoring, encoding, result checks, destruction and explicit JS process garbage collection are outside API timings. Memory estimates are the increase in live native allocator bytes plus retained JS array slots for one instance, including exercised runtime buffers. Unused WASM capacity, JS object headers and referenced payload objects are excluded.
