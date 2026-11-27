# Tuple benchmarks

2026-11-27T22:05:59.700Z · [CI run](https://github.com/sovereignbase/sequencer/actions/runs/46073953475)

Arithmetic means of 3 runs. Ordinary Projection versus a static tuple with maxLength. Both contain the same values; replacements preserve the field count.

## Throughput (ops/s)

| Indices | Method / case | Projection | Static tuple | Tuple / Projection |
| ---: | --- | ---: | ---: | ---: |
| 2 | create.empty | 3,542,012 | 3,596,605 | 1.02× |
| 2 | create.sequence | 1,106,374 | 1,012,011 | 0.91× |
| 2 | replace.random | 1,801,908 | 2,490,016 | 1.38× |
| 2 | apply.replace | 970,459 | 1,425,182 | 1.47× |
| 2 | apply.duplicate | 3,189,588 | 2,995,889 | 0.94× |
| 2 | merge.duplicate | 1,841,939 | 1,819,633 | 0.99× |
| 2 | length | 96,808,077 | 99,071,542 | 1.02× |
| 2 | value.random | 41,594,111 | 75,362,193 | 1.81× |
| 2 | values | 14,796,052 | 14,551,035 | 0.98× |
| 2 | sequence | 4,774,085 | 4,389,582 | 0.92× |
| 4 | create.empty | 3,540,474 | 3,481,842 | 0.98× |
| 4 | create.sequence | 833,747 | 848,237 | 1.02× |
| 4 | replace.random | 1,346,027 | 2,456,549 | 1.83× |
| 4 | apply.replace | 877,772 | 1,551,454 | 1.77× |
| 4 | apply.duplicate | 2,976,053 | 3,022,283 | 1.02× |
| 4 | merge.duplicate | 1,353,206 | 1,384,521 | 1.02× |
| 4 | length | 101,005,941 | 101,560,333 | 1.01× |
| 4 | value.random | 33,022,987 | 75,865,655 | 2.30× |
| 4 | values | 10,325,275 | 10,254,993 | 0.99× |
| 4 | sequence | 4,114,696 | 4,313,974 | 1.05× |
| 8 | create.empty | 3,653,296 | 3,500,661 | 0.96× |
| 8 | create.sequence | 585,480 | 669,227 | 1.14× |
| 8 | replace.random | 1,366,798 | 2,537,160 | 1.86× |
| 8 | apply.replace | 874,157 | 1,495,499 | 1.71× |
| 8 | apply.duplicate | 3,142,185 | 2,978,145 | 0.95× |
| 8 | merge.duplicate | 891,154 | 796,308 | 0.89× |
| 8 | length | 101,032,325 | 102,812,698 | 1.02× |
| 8 | value.random | 26,100,025 | 75,361,676 | 2.89× |
| 8 | values | 6,350,508 | 7,168,546 | 1.13× |
| 8 | sequence | 2,770,563 | 3,360,501 | 1.21× |
| 100 | create.empty | 3,620,346 | 3,176,002 | 0.88× |
| 100 | create.sequence | 104,954 | 106,661 | 1.02× |
| 100 | replace.random | 1,249,480 | 2,490,062 | 1.99× |
| 100 | apply.replace | 884,127 | 1,550,163 | 1.75× |
| 100 | apply.duplicate | 2,987,013 | 3,080,203 | 1.03× |
| 100 | merge.duplicate | 161,202 | 106,180 | 0.66× |
| 100 | length | 49,375,328 | 51,147,500 | 1.04× |
| 100 | value.random | 17,878,007 | 76,365,608 | 4.27× |
| 100 | values | 703,201 | 835,020 | 1.19× |
| 100 | sequence | 220,804 | 252,325 | 1.14× |

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

Measured on Node 24.22.3, V8 13.6.233.17-node.63, linux x64, AMD EPYC 9V74 80-Core Processor. Fixtures are hydrated compacted snapshots after one replacement per field. Each case warms up for ≥25 ms and measures ≥50 ms of API time; mutation bursts restart after 4,096 replacements. Peer authoring, encoding, result checks, destruction and explicit JS process garbage collection are outside API timings. Memory estimates are the increase in live native allocator bytes plus retained JS array slots for one instance, including exercised runtime buffers. Unused WASM capacity, JS object headers and referenced payload objects are excluded.
