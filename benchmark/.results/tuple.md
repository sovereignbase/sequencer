# Tuple benchmarks

2026-11-20T20:39:05.665Z · [CI run](https://github.com/sovereignbase/sequencer/actions/runs/44812418849)

Arithmetic means of 3 runs. Ordinary Projection versus a static tuple with maxLength. Both contain the same values; replacements preserve the field count.

## Throughput (ops/s)

| Indices | Method / case | Projection | Static tuple | Tuple / Projection |
| ---: | --- | ---: | ---: | ---: |
| 2 | create.empty | 3,690,065 | 3,482,774 | 0.94× |
| 2 | create.sequence | 1,000,695 | 900,000 | 0.90× |
| 2 | replace.random | 1,407,348 | 2,416,326 | 1.72× |
| 2 | apply.replace | 846,039 | 1,470,492 | 1.74× |
| 2 | apply.duplicate | 3,236,277 | 3,055,651 | 0.94× |
| 2 | merge.duplicate | 1,864,899 | 1,920,101 | 1.03× |
| 2 | length | 97,513,052 | 98,602,230 | 1.01× |
| 2 | value.random | 42,899,499 | 75,361,044 | 1.76× |
| 2 | values | 14,180,238 | 14,649,170 | 1.03× |
| 2 | sequence | 3,965,856 | 3,825,141 | 0.96× |
| 4 | create.empty | 3,600,541 | 3,385,469 | 0.94× |
| 4 | create.sequence | 797,824 | 781,453 | 0.98× |
| 4 | replace.random | 1,165,782 | 2,345,434 | 2.01× |
| 4 | apply.replace | 751,762 | 1,542,488 | 2.05× |
| 4 | apply.duplicate | 3,051,281 | 3,058,868 | 1.00× |
| 4 | merge.duplicate | 1,522,334 | 1,374,184 | 0.90× |
| 4 | length | 101,771,443 | 101,783,883 | 1.00× |
| 4 | value.random | 33,664,075 | 74,915,173 | 2.23× |
| 4 | values | 10,380,738 | 10,972,841 | 1.06× |
| 4 | sequence | 3,515,505 | 3,416,929 | 0.97× |
| 8 | create.empty | 3,539,480 | 3,576,005 | 1.01× |
| 8 | create.sequence | 577,600 | 627,836 | 1.09× |
| 8 | replace.random | 1,139,899 | 2,424,027 | 2.13× |
| 8 | apply.replace | 733,559 | 1,592,909 | 2.17× |
| 8 | apply.duplicate | 3,164,212 | 3,063,754 | 0.97× |
| 8 | merge.duplicate | 937,910 | 910,885 | 0.97× |
| 8 | length | 102,987,336 | 101,997,043 | 0.99× |
| 8 | value.random | 26,145,008 | 78,108,420 | 2.99× |
| 8 | values | 6,523,296 | 7,080,392 | 1.09× |
| 8 | sequence | 2,650,083 | 2,526,385 | 0.95× |
| 100 | create.empty | 3,358,482 | 3,236,987 | 0.96× |
| 100 | create.sequence | 107,544 | 112,754 | 1.05× |
| 100 | replace.random | 1,083,972 | 2,404,128 | 2.22× |
| 100 | apply.replace | 730,557 | 1,588,112 | 2.17× |
| 100 | apply.duplicate | 3,108,967 | 3,054,174 | 0.98× |
| 100 | merge.duplicate | 164,892 | 112,416 | 0.68× |
| 100 | length | 50,630,719 | 50,660,513 | 1.00× |
| 100 | value.random | 17,828,201 | 72,623,566 | 4.07× |
| 100 | values | 741,007 | 823,193 | 1.11× |
| 100 | sequence | 214,670 | 243,457 | 1.13× |

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

Measured on Node 24.22.3, V8 13.6.233.17-node.63, linux x64, AMD EPYC 9V74 80-Core Processor. Fixtures are hydrated compacted snapshots after one replacement per field. Each case warms up for ≥25 ms and measures ≥50 ms of API time; mutation bursts restart after 4,096 replacements. Peer authoring, encoding, result checks, destruction and explicit JS process garbage collection are outside API timings. Memory estimates are the increase in live native allocator bytes plus retained JS array slots for one instance, including exercised runtime buffers. Unused WASM capacity, JS object headers and referenced payload objects are excluded.
