# Tuple benchmarks

2026-11-21T14:20:10.084Z · [CI run](https://github.com/sovereignbase/sequencer/actions/runs/44912963007)

Arithmetic means of 3 runs. Ordinary Projection versus a static tuple with maxLength. Both contain the same values; replacements preserve the field count.

## Throughput (ops/s)

| Indices | Method / case | Projection | Static tuple | Tuple / Projection |
| ---: | --- | ---: | ---: | ---: |
| 2 | create.empty | 4,680,324 | 4,461,081 | 0.95× |
| 2 | create.sequence | 1,106,907 | 996,817 | 0.90× |
| 2 | replace.random | 1,656,948 | 2,922,490 | 1.76× |
| 2 | apply.replace | 835,158 | 1,603,208 | 1.92× |
| 2 | apply.duplicate | 3,830,350 | 3,361,952 | 0.88× |
| 2 | merge.duplicate | 2,209,611 | 2,211,170 | 1.00× |
| 2 | length | 274,579,616 | 286,479,012 | 1.04× |
| 2 | value.random | 46,861,032 | 97,392,821 | 2.08× |
| 2 | values | 22,706,972 | 22,954,787 | 1.01× |
| 2 | sequence | 4,142,516 | 4,114,687 | 0.99× |
| 4 | create.empty | 4,591,795 | 4,259,501 | 0.93× |
| 4 | create.sequence | 860,340 | 851,365 | 0.99× |
| 4 | replace.random | 1,263,849 | 2,833,714 | 2.24× |
| 4 | apply.replace | 752,618 | 1,774,388 | 2.36× |
| 4 | apply.duplicate | 3,925,763 | 3,299,207 | 0.84× |
| 4 | merge.duplicate | 1,764,922 | 1,637,208 | 0.93× |
| 4 | length | 294,416,216 | 290,829,882 | 0.99× |
| 4 | value.random | 34,916,163 | 97,066,606 | 2.78× |
| 4 | values | 14,935,894 | 16,204,072 | 1.08× |
| 4 | sequence | 4,307,518 | 3,185,654 | 0.74× |
| 8 | create.empty | 4,659,444 | 4,270,443 | 0.92× |
| 8 | create.sequence | 666,803 | 718,174 | 1.08× |
| 8 | replace.random | 1,208,805 | 2,804,785 | 2.32× |
| 8 | apply.replace | 729,824 | 1,764,036 | 2.42× |
| 8 | apply.duplicate | 3,892,738 | 3,674,771 | 0.94× |
| 8 | merge.duplicate | 1,127,600 | 1,073,584 | 0.95× |
| 8 | length | 294,928,464 | 289,971,014 | 0.98× |
| 8 | value.random | 29,093,108 | 99,491,532 | 3.42× |
| 8 | values | 9,334,694 | 10,188,385 | 1.09× |
| 8 | sequence | 3,080,817 | 2,865,807 | 0.93× |
| 100 | create.empty | 4,547,633 | 4,273,009 | 0.94× |
| 100 | create.sequence | 116,591 | 134,981 | 1.16× |
| 100 | replace.random | 1,194,650 | 2,875,589 | 2.41× |
| 100 | apply.replace | 726,674 | 1,788,533 | 2.46× |
| 100 | apply.duplicate | 3,828,361 | 3,486,484 | 0.91× |
| 100 | merge.duplicate | 202,769 | 137,461 | 0.68× |
| 100 | length | 294,622,583 | 290,272,008 | 0.99× |
| 100 | value.random | 19,393,396 | 101,155,680 | 5.22× |
| 100 | values | 940,256 | 1,160,918 | 1.23× |
| 100 | sequence | 276,448 | 311,413 | 1.13× |

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

Measured on Node 24.22.3, V8 13.6.233.17-node.63, linux x64, AMD EPYC 9V45 96-Core Processor. Fixtures are hydrated compacted snapshots after one replacement per field. Each case warms up for ≥25 ms and measures ≥50 ms of API time; mutation bursts restart after 4,096 replacements. Peer authoring, encoding, result checks, destruction and explicit JS process garbage collection are outside API timings. Memory estimates are the increase in live native allocator bytes plus retained JS array slots for one instance, including exercised runtime buffers. Unused WASM capacity, JS object headers and referenced payload objects are excluded.
