# Tuple benchmarks

2026-11-24T12:56:09.937Z · [CI run](https://github.com/sovereignbase/sequencer/actions/runs/45397524890)

Arithmetic means of 3 runs. Ordinary Projection versus a static tuple with maxLength. Both contain the same values; replacements preserve the field count.

## Throughput (ops/s)

| Indices | Method / case | Projection | Static tuple | Tuple / Projection |
| ---: | --- | ---: | ---: | ---: |
| 2 | create.empty | 4,973,966 | 4,802,219 | 0.97× |
| 2 | create.sequence | 1,217,869 | 1,103,185 | 0.91× |
| 2 | replace.random | 1,809,289 | 3,296,363 | 1.82× |
| 2 | apply.replace | 1,015,385 | 1,867,271 | 1.84× |
| 2 | apply.duplicate | 3,913,668 | 4,059,374 | 1.04× |
| 2 | merge.duplicate | 2,367,416 | 2,155,009 | 0.91× |
| 2 | length | 292,411,308 | 310,805,409 | 1.06× |
| 2 | value.random | 50,762,207 | 103,553,271 | 2.04× |
| 2 | values | 20,798,818 | 23,151,019 | 1.11× |
| 2 | sequence | 4,888,030 | 4,525,362 | 0.93× |
| 4 | create.empty | 5,119,887 | 4,931,911 | 0.96× |
| 4 | create.sequence | 921,099 | 922,581 | 1.00× |
| 4 | replace.random | 1,213,463 | 3,155,771 | 2.60× |
| 4 | apply.replace | 948,053 | 2,062,560 | 2.18× |
| 4 | apply.duplicate | 4,302,399 | 4,176,626 | 0.97× |
| 4 | merge.duplicate | 1,747,063 | 1,572,704 | 0.90× |
| 4 | length | 324,358,936 | 313,622,069 | 0.97× |
| 4 | value.random | 37,768,965 | 101,514,356 | 2.69× |
| 4 | values | 14,911,513 | 17,856,271 | 1.20× |
| 4 | sequence | 5,176,646 | 4,078,675 | 0.79× |
| 8 | create.empty | 4,953,360 | 4,817,019 | 0.97× |
| 8 | create.sequence | 716,853 | 767,666 | 1.07× |
| 8 | replace.random | 1,414,790 | 3,238,223 | 2.29× |
| 8 | apply.replace | 894,550 | 2,001,417 | 2.24× |
| 8 | apply.duplicate | 4,115,177 | 3,858,531 | 0.94× |
| 8 | merge.duplicate | 1,228,066 | 1,113,204 | 0.91× |
| 8 | length | 308,312,712 | 308,850,838 | 1.00× |
| 8 | value.random | 30,047,750 | 105,627,053 | 3.52× |
| 8 | values | 9,771,947 | 10,854,461 | 1.11× |
| 8 | sequence | 3,417,567 | 3,071,676 | 0.90× |
| 100 | create.empty | 4,771,775 | 4,375,353 | 0.92× |
| 100 | create.sequence | 138,064 | 144,499 | 1.05× |
| 100 | replace.random | 1,317,746 | 2,945,536 | 2.24× |
| 100 | apply.replace | 905,872 | 2,017,176 | 2.23× |
| 100 | apply.duplicate | 4,005,741 | 3,713,583 | 0.93× |
| 100 | merge.duplicate | 214,906 | 144,817 | 0.67× |
| 100 | length | 321,678,263 | 321,519,780 | 1.00× |
| 100 | value.random | 21,175,005 | 106,574,836 | 5.03× |
| 100 | values | 1,026,919 | 1,247,068 | 1.21× |
| 100 | sequence | 297,631 | 334,358 | 1.12× |

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
