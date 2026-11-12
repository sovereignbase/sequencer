# Tuple benchmarks

Arithmetic means of 3 runs. Ordinary Projection versus a static tuple with maxLength. Both contain the same values; replacements preserve the field count.

## Throughput (ops/s)

| Indices | Method / case | Projection | Static tuple | Tuple / Projection |
| ---: | --- | ---: | ---: | ---: |
| 2 | create.empty | 2,847,383 | 2,880,465 | 1.01× |
| 2 | create.sequence | 1,122,688 | 995,790 | 0.89× |
| 2 | replace.random | 1,201,274 | 2,239,174 | 1.86× |
| 2 | apply.replace | 921,822 | 1,319,621 | 1.43× |
| 2 | apply.duplicate | 3,114,133 | 2,962,440 | 0.95× |
| 2 | merge.duplicate | 1,924,654 | 1,760,922 | 0.91× |
| 2 | length | 69,234,511 | 57,620,430 | 0.83× |
| 2 | value.random | 39,592,762 | 80,551,220 | 2.03× |
| 2 | values | 12,520,939 | 11,241,776 | 0.90× |
| 2 | sequence | 3,573,502 | 3,492,786 | 0.98× |
| 4 | create.empty | 2,965,975 | 2,867,526 | 0.97× |
| 4 | create.sequence | 819,669 | 879,791 | 1.07× |
| 4 | replace.random | 1,207,656 | 2,176,940 | 1.80× |
| 4 | apply.replace | 624,304 | 1,356,845 | 2.17× |
| 4 | apply.duplicate | 2,977,181 | 2,762,556 | 0.93× |
| 4 | merge.duplicate | 1,232,063 | 1,257,540 | 1.02× |
| 4 | length | 58,760,299 | 59,373,214 | 1.01× |
| 4 | value.random | 26,916,859 | 80,252,404 | 2.98× |
| 4 | values | 7,956,334 | 8,932,114 | 1.12× |
| 4 | sequence | 3,099,292 | 2,902,411 | 0.94× |
| 8 | create.empty | 2,991,964 | 2,662,446 | 0.89× |
| 8 | create.sequence | 548,986 | 633,154 | 1.15× |
| 8 | replace.random | 1,194,586 | 2,192,955 | 1.84× |
| 8 | apply.replace | 573,861 | 1,404,000 | 2.45× |
| 8 | apply.duplicate | 2,901,088 | 2,603,262 | 0.90× |
| 8 | merge.duplicate | 842,683 | 821,824 | 0.98× |
| 8 | length | 58,821,405 | 60,041,656 | 1.02× |
| 8 | value.random | 22,867,689 | 77,838,808 | 3.40× |
| 8 | values | 5,611,386 | 5,570,437 | 0.99× |
| 8 | sequence | 1,756,078 | 2,112,817 | 1.20× |
| 100 | create.empty | 2,897,529 | 2,635,131 | 0.91× |
| 100 | create.sequence | 104,336 | 131,404 | 1.26× |
| 100 | replace.random | 918,069 | 2,163,259 | 2.36× |
| 100 | apply.replace | 504,204 | 1,423,843 | 2.82× |
| 100 | apply.duplicate | 2,992,586 | 2,800,892 | 0.94× |
| 100 | merge.duplicate | 157,625 | 104,469 | 0.66× |
| 100 | length | 57,614,877 | 59,185,850 | 1.03× |
| 100 | value.random | 9,480,388 | 78,348,968 | 8.26× |
| 100 | values | 610,148 | 767,415 | 1.26× |
| 100 | sequence | 214,259 | 250,284 | 1.17× |

## Space (KiB)

| Indices | Mode | Estimated allocated memory | MessagePack | MessagePack + gzip |
| ---: | --- | ---: | ---: | ---: |
| 2 | Projection | 0.80 | 0.03 | 0.04 |
| 2 | Static tuple | 0.80 | 0.04 | 0.05 |
| 4 | Projection | 1.46 | 0.06 | 0.05 |
| 4 | Static tuple | 0.98 | 0.06 | 0.07 |
| 8 | Projection | 2.37 | 0.12 | 0.08 |
| 8 | Static tuple | 1.41 | 0.10 | 0.09 |
| 100 | Projection | 22.55 | 0.67 | 0.57 |
| 100 | Static tuple | 11.37 | 0.51 | 0.35 |

Measured on Node 24.22.2, V8 13.6.233.17-node.63, linux x64, INTEL(R) XEON(R) PLATINUM 8573C. Fixtures are hydrated compacted snapshots after one replacement per field. Each case warms up for ≥25 ms and measures ≥50 ms of API time; mutation bursts restart after 4,096 replacements. Peer authoring, encoding, result checks, destruction and explicit JS process garbage collection are outside API timings. Memory estimates are the increase in live native allocator bytes plus retained JS array slots for one instance, including exercised runtime buffers. Unused WASM capacity, JS object headers and referenced payload objects are excluded.
