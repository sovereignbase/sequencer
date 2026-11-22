# Tuple benchmarks

2026-11-22T17:32:13.284Z · [CI run](https://github.com/sovereignbase/sequencer/actions/runs/45049365331)

Arithmetic means of 3 runs. Ordinary Projection versus a static tuple with maxLength. Both contain the same values; replacements preserve the field count.

## Throughput (ops/s)

| Indices | Method / case | Projection | Static tuple | Tuple / Projection |
| ---: | --- | ---: | ---: | ---: |
| 2 | create.empty | 2,898,014 | 2,750,350 | 0.95× |
| 2 | create.sequence | 796,001 | 695,036 | 0.87× |
| 2 | replace.random | 1,094,331 | 1,604,289 | 1.47× |
| 2 | apply.replace | 633,563 | 1,014,522 | 1.60× |
| 2 | apply.duplicate | 1,902,684 | 1,919,062 | 1.01× |
| 2 | merge.duplicate | 1,260,625 | 1,285,881 | 1.02× |
| 2 | length | 77,167,175 | 74,139,842 | 0.96× |
| 2 | value.random | 35,948,053 | 60,644,258 | 1.69× |
| 2 | values | 12,140,847 | 11,410,589 | 0.94× |
| 2 | sequence | 2,540,375 | 2,483,010 | 0.98× |
| 4 | create.empty | 2,848,800 | 2,718,247 | 0.95× |
| 4 | create.sequence | 611,509 | 617,383 | 1.01× |
| 4 | replace.random | 908,608 | 1,596,397 | 1.76× |
| 4 | apply.replace | 617,634 | 1,051,957 | 1.70× |
| 4 | apply.duplicate | 1,932,946 | 1,940,854 | 1.00× |
| 4 | merge.duplicate | 993,892 | 988,646 | 0.99× |
| 4 | length | 41,726,455 | 42,619,069 | 1.02× |
| 4 | value.random | 27,571,062 | 61,597,032 | 2.23× |
| 4 | values | 7,516,010 | 8,205,050 | 1.09× |
| 4 | sequence | 2,468,284 | 2,178,516 | 0.88× |
| 8 | create.empty | 2,833,225 | 2,650,375 | 0.94× |
| 8 | create.sequence | 456,854 | 497,842 | 1.09× |
| 8 | replace.random | 893,231 | 1,612,278 | 1.80× |
| 8 | apply.replace | 580,975 | 1,048,244 | 1.80× |
| 8 | apply.duplicate | 1,940,893 | 1,823,049 | 0.94× |
| 8 | merge.duplicate | 707,409 | 671,825 | 0.95× |
| 8 | length | 42,969,553 | 42,781,023 | 1.00× |
| 8 | value.random | 21,098,420 | 62,991,566 | 2.99× |
| 8 | values | 4,963,007 | 5,057,683 | 1.02× |
| 8 | sequence | 1,909,770 | 1,744,208 | 0.91× |
| 100 | create.empty | 2,741,456 | 2,594,354 | 0.95× |
| 100 | create.sequence | 79,668 | 87,748 | 1.10× |
| 100 | replace.random | 863,651 | 1,605,716 | 1.86× |
| 100 | apply.replace | 550,933 | 1,094,186 | 1.99× |
| 100 | apply.duplicate | 1,888,045 | 1,842,793 | 0.98× |
| 100 | merge.duplicate | 124,250 | 85,742 | 0.69× |
| 100 | length | 41,855,604 | 42,878,864 | 1.02× |
| 100 | value.random | 15,467,120 | 59,873,341 | 3.87× |
| 100 | values | 592,851 | 719,385 | 1.21× |
| 100 | sequence | 182,303 | 195,467 | 1.07× |

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

Measured on Node 24.22.3, V8 13.6.233.17-node.63, linux x64, AMD EPYC 7763 64-Core Processor. Fixtures are hydrated compacted snapshots after one replacement per field. Each case warms up for ≥25 ms and measures ≥50 ms of API time; mutation bursts restart after 4,096 replacements. Peer authoring, encoding, result checks, destruction and explicit JS process garbage collection are outside API timings. Memory estimates are the increase in live native allocator bytes plus retained JS array slots for one instance, including exercised runtime buffers. Unused WASM capacity, JS object headers and referenced payload objects are excluded.
