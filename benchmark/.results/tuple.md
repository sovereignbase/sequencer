# Tuple benchmarks

2026-11-27T21:51:36.675Z · [CI run](https://github.com/sovereignbase/sequencer/actions/runs/46072517566)

Arithmetic means of 3 runs. Ordinary Projection versus a static tuple with maxLength. Both contain the same values; replacements preserve the field count.

## Throughput (ops/s)

| Indices | Method / case | Projection | Static tuple | Tuple / Projection |
| ---: | --- | ---: | ---: | ---: |
| 2 | create.empty | 5,078,201 | 5,036,807 | 0.99× |
| 2 | create.sequence | 1,588,667 | 1,343,134 | 0.85× |
| 2 | replace.random | 2,464,067 | 3,060,140 | 1.24× |
| 2 | apply.replace | 1,159,706 | 1,902,650 | 1.64× |
| 2 | apply.duplicate | 4,433,769 | 4,169,119 | 0.94× |
| 2 | merge.duplicate | 2,322,867 | 2,220,410 | 0.96× |
| 2 | length | 145,844,154 | 148,121,444 | 1.02× |
| 2 | value.random | 54,431,071 | 108,013,627 | 1.98× |
| 2 | values | 20,087,445 | 21,840,195 | 1.09× |
| 2 | sequence | 7,748,627 | 7,993,585 | 1.03× |
| 4 | create.empty | 5,168,662 | 4,920,245 | 0.95× |
| 4 | create.sequence | 1,154,279 | 1,117,291 | 0.97× |
| 4 | replace.random | 1,894,437 | 3,296,243 | 1.74× |
| 4 | apply.replace | 1,063,946 | 2,031,294 | 1.91× |
| 4 | apply.duplicate | 4,525,245 | 4,264,993 | 0.94× |
| 4 | merge.duplicate | 1,872,253 | 1,691,114 | 0.90× |
| 4 | length | 150,760,606 | 155,372,828 | 1.03× |
| 4 | value.random | 39,784,806 | 106,948,540 | 2.69× |
| 4 | values | 14,536,212 | 15,544,844 | 1.07× |
| 4 | sequence | 5,658,179 | 5,624,613 | 0.99× |
| 8 | create.empty | 5,320,588 | 5,029,468 | 0.95× |
| 8 | create.sequence | 789,027 | 843,370 | 1.07× |
| 8 | replace.random | 1,795,336 | 3,167,106 | 1.76× |
| 8 | apply.replace | 1,032,328 | 1,788,855 | 1.73× |
| 8 | apply.duplicate | 4,226,533 | 4,163,129 | 0.98× |
| 8 | merge.duplicate | 1,254,348 | 1,158,657 | 0.92× |
| 8 | length | 153,256,846 | 153,535,846 | 1.00× |
| 8 | value.random | 32,967,162 | 109,393,288 | 3.32× |
| 8 | values | 9,351,959 | 10,401,591 | 1.11× |
| 8 | sequence | 3,904,366 | 4,355,466 | 1.12× |
| 100 | create.empty | 5,161,208 | 4,622,101 | 0.90× |
| 100 | create.sequence | 138,798 | 149,523 | 1.08× |
| 100 | replace.random | 1,697,062 | 3,246,802 | 1.91× |
| 100 | apply.replace | 1,050,619 | 2,049,471 | 1.95× |
| 100 | apply.duplicate | 3,916,372 | 4,309,161 | 1.10× |
| 100 | merge.duplicate | 220,509 | 147,444 | 0.67× |
| 100 | length | 65,812,545 | 66,503,676 | 1.01× |
| 100 | value.random | 20,971,075 | 107,647,088 | 5.13× |
| 100 | values | 993,464 | 1,218,023 | 1.23× |
| 100 | sequence | 330,353 | 338,701 | 1.03× |

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

Measured on Node 24.22.3, V8 13.6.233.17-node.63, linux x64, AMD EPYC 9V45 96-Core Processor. Fixtures are hydrated compacted snapshots after one replacement per field. Each case warms up for ≥25 ms and measures ≥50 ms of API time; mutation bursts restart after 4,096 replacements. Peer authoring, encoding, result checks, destruction and explicit JS process garbage collection are outside API timings. Memory estimates are the increase in live native allocator bytes plus retained JS array slots for one instance, including exercised runtime buffers. Unused WASM capacity, JS object headers and referenced payload objects are excluded.
