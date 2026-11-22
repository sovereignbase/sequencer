# Tuple benchmarks

2026-11-22T17:22:12.560Z · [CI run](https://github.com/sovereignbase/sequencer/actions/runs/45048530438)

Arithmetic means of 3 runs. Ordinary Projection versus a static tuple with maxLength. Both contain the same values; replacements preserve the field count.

## Throughput (ops/s)

| Indices | Method / case | Projection | Static tuple | Tuple / Projection |
| ---: | --- | ---: | ---: | ---: |
| 2 | create.empty | 3,836,940 | 3,669,674 | 0.96× |
| 2 | create.sequence | 1,352,395 | 1,195,988 | 0.88× |
| 2 | replace.random | 1,651,223 | 2,618,775 | 1.59× |
| 2 | apply.replace | 981,293 | 1,606,043 | 1.64× |
| 2 | apply.duplicate | 3,419,189 | 3,185,988 | 0.93× |
| 2 | merge.duplicate | 2,288,093 | 2,129,571 | 0.93× |
| 2 | length | 133,546,531 | 135,653,171 | 1.02× |
| 2 | value.random | 45,239,841 | 91,756,251 | 2.03× |
| 2 | values | 14,810,035 | 15,386,649 | 1.04× |
| 2 | sequence | 4,393,239 | 3,652,448 | 0.83× |
| 4 | create.empty | 3,858,295 | 3,660,345 | 0.95× |
| 4 | create.sequence | 1,036,455 | 988,613 | 0.95× |
| 4 | replace.random | 1,334,931 | 2,611,388 | 1.96× |
| 4 | apply.replace | 841,725 | 1,687,321 | 2.00× |
| 4 | apply.duplicate | 3,453,882 | 3,236,971 | 0.94× |
| 4 | merge.duplicate | 1,750,459 | 1,634,361 | 0.93× |
| 4 | length | 65,200,027 | 66,023,115 | 1.01× |
| 4 | value.random | 32,481,787 | 91,041,650 | 2.80× |
| 4 | values | 9,932,663 | 10,179,382 | 1.02× |
| 4 | sequence | 3,788,446 | 3,581,060 | 0.95× |
| 8 | create.empty | 3,924,249 | 3,774,671 | 0.96× |
| 8 | create.sequence | 734,173 | 772,371 | 1.05× |
| 8 | replace.random | 1,246,310 | 2,633,071 | 2.11× |
| 8 | apply.replace | 847,552 | 1,665,198 | 1.96× |
| 8 | apply.duplicate | 3,391,914 | 3,172,624 | 0.94× |
| 8 | merge.duplicate | 1,119,541 | 1,002,083 | 0.90× |
| 8 | length | 65,696,788 | 67,331,574 | 1.02× |
| 8 | value.random | 25,846,106 | 91,638,799 | 3.55× |
| 8 | values | 6,511,730 | 6,794,293 | 1.04× |
| 8 | sequence | 2,870,110 | 2,767,689 | 0.96× |
| 100 | create.empty | 3,715,542 | 3,703,690 | 1.00× |
| 100 | create.sequence | 123,299 | 127,153 | 1.03× |
| 100 | replace.random | 1,278,420 | 2,694,143 | 2.11× |
| 100 | apply.replace | 867,267 | 1,697,573 | 1.96× |
| 100 | apply.duplicate | 3,266,866 | 3,238,020 | 0.99× |
| 100 | merge.duplicate | 173,001 | 124,391 | 0.72× |
| 100 | length | 65,866,915 | 65,134,353 | 0.99× |
| 100 | value.random | 17,046,608 | 90,594,094 | 5.31× |
| 100 | values | 754,681 | 864,628 | 1.15× |
| 100 | sequence | 243,971 | 276,137 | 1.13× |

## Memory and encoded size

| Indices | Mode | Estimated allocated memory (MiB) | MessagePack (KiB) | MessagePack + gzip (KiB) |
| ---: | --- | ---: | ---: | ---: |
| 2 | Projection | 0.0007 | 0.03 | 0.04 |
| 2 | Static tuple | 0.0007 | 0.04 | 0.05 |
| 4 | Projection | 0.0014 | 0.06 | 0.05 |
| 4 | Static tuple | 0.0009 | 0.06 | 0.07 |
| 8 | Projection | 0.0022 | 0.12 | 0.08 |
| 8 | Static tuple | 0.0014 | 0.10 | 0.09 |
| 100 | Projection | 0.0204 | 0.67 | 0.57 |
| 100 | Static tuple | 0.0111 | 0.51 | 0.35 |

Measured on Node 24.22.3, V8 13.6.233.17-node.63, linux x64, Intel(R) Xeon(R) 6975P-C. Fixtures are hydrated compacted snapshots after one replacement per field. Each case warms up for ≥25 ms and measures ≥50 ms of API time; mutation bursts restart after 4,096 replacements. Peer authoring, encoding, result checks, destruction and explicit JS process garbage collection are outside API timings. Memory estimates are the increase in live native allocator bytes plus retained JS array slots for one instance, including exercised runtime buffers. Unused WASM capacity, JS object headers and referenced payload objects are excluded.
