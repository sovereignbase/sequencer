# Tuple benchmarks

2026-11-20T20:29:38.168Z · [CI run](https://github.com/sovereignbase/sequencer/actions/runs/44811048570)

Arithmetic means of 3 runs. Ordinary Projection versus a static tuple with maxLength. Both contain the same values; replacements preserve the field count.

## Throughput (ops/s)

| Indices | Method / case | Projection | Static tuple | Tuple / Projection |
| ---: | --- | ---: | ---: | ---: |
| 2 | create.empty | 3,973,596 | 3,611,279 | 0.91× |
| 2 | create.sequence | 1,389,764 | 1,158,795 | 0.83× |
| 2 | replace.random | 1,679,861 | 2,776,287 | 1.65× |
| 2 | apply.replace | 1,018,565 | 1,687,773 | 1.66× |
| 2 | apply.duplicate | 3,791,092 | 3,518,469 | 0.93× |
| 2 | merge.duplicate | 2,402,691 | 2,293,427 | 0.95× |
| 2 | length | 78,536,980 | 67,966,651 | 0.87× |
| 2 | value.random | 47,013,036 | 93,230,315 | 1.98× |
| 2 | values | 14,229,262 | 13,327,221 | 0.94× |
| 2 | sequence | 4,059,850 | 4,153,919 | 1.02× |
| 4 | create.empty | 3,931,402 | 3,716,719 | 0.95× |
| 4 | create.sequence | 1,093,403 | 1,035,008 | 0.95× |
| 4 | replace.random | 1,303,559 | 2,764,990 | 2.12× |
| 4 | apply.replace | 943,622 | 1,729,186 | 1.83× |
| 4 | apply.duplicate | 3,711,019 | 3,561,744 | 0.96× |
| 4 | merge.duplicate | 1,752,041 | 1,765,074 | 1.01× |
| 4 | length | 67,879,912 | 67,882,436 | 1.00× |
| 4 | value.random | 32,622,876 | 93,034,000 | 2.85× |
| 4 | values | 10,396,130 | 10,490,078 | 1.01× |
| 4 | sequence | 4,186,416 | 3,703,979 | 0.88× |
| 8 | create.empty | 3,857,517 | 3,905,214 | 1.01× |
| 8 | create.sequence | 758,556 | 819,272 | 1.08× |
| 8 | replace.random | 1,315,043 | 2,757,137 | 2.10× |
| 8 | apply.replace | 879,507 | 1,749,682 | 1.99× |
| 8 | apply.duplicate | 3,558,453 | 3,573,372 | 1.00× |
| 8 | merge.duplicate | 1,154,532 | 1,095,937 | 0.95× |
| 8 | length | 66,741,445 | 65,761,476 | 0.99× |
| 8 | value.random | 25,351,604 | 91,231,418 | 3.60× |
| 8 | values | 6,768,629 | 6,946,820 | 1.03× |
| 8 | sequence | 2,859,521 | 2,683,285 | 0.94× |
| 100 | create.empty | 3,799,821 | 3,877,440 | 1.02× |
| 100 | create.sequence | 123,945 | 130,200 | 1.05× |
| 100 | replace.random | 1,231,417 | 2,802,886 | 2.28× |
| 100 | apply.replace | 900,035 | 1,823,718 | 2.03× |
| 100 | apply.duplicate | 3,467,802 | 3,298,541 | 0.95× |
| 100 | merge.duplicate | 183,891 | 132,209 | 0.72× |
| 100 | length | 66,727,866 | 66,000,396 | 0.99× |
| 100 | value.random | 17,776,308 | 90,538,354 | 5.09× |
| 100 | values | 746,508 | 828,727 | 1.11× |
| 100 | sequence | 255,586 | 280,919 | 1.10× |

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
