# Tuple benchmarks

2026-11-24T12:47:45.127Z · [CI run](https://github.com/sovereignbase/sequencer/actions/runs/45395972158)

Arithmetic means of 3 runs. Ordinary Projection versus a static tuple with maxLength. Both contain the same values; replacements preserve the field count.

## Throughput (ops/s)

| Indices | Method / case | Projection | Static tuple | Tuple / Projection |
| ---: | --- | ---: | ---: | ---: |
| 2 | create.empty | 3,943,620 | 3,784,457 | 0.96× |
| 2 | create.sequence | 1,283,866 | 1,100,623 | 0.86× |
| 2 | replace.random | 1,691,122 | 2,765,027 | 1.64× |
| 2 | apply.replace | 990,599 | 1,598,864 | 1.61× |
| 2 | apply.duplicate | 3,506,616 | 3,202,009 | 0.91× |
| 2 | merge.duplicate | 2,391,935 | 2,242,587 | 0.94× |
| 2 | length | 137,250,009 | 138,541,204 | 1.01× |
| 2 | value.random | 45,696,722 | 94,017,513 | 2.06× |
| 2 | values | 15,442,880 | 15,047,285 | 0.97× |
| 2 | sequence | 3,884,626 | 4,177,118 | 1.08× |
| 4 | create.empty | 3,854,019 | 3,683,724 | 0.96× |
| 4 | create.sequence | 1,041,230 | 966,243 | 0.93× |
| 4 | replace.random | 1,318,831 | 2,726,757 | 2.07× |
| 4 | apply.replace | 900,702 | 1,689,486 | 1.88× |
| 4 | apply.duplicate | 3,261,102 | 3,296,178 | 1.01× |
| 4 | merge.duplicate | 1,757,111 | 1,682,812 | 0.96× |
| 4 | length | 67,808,032 | 67,743,758 | 1.00× |
| 4 | value.random | 33,417,180 | 92,517,459 | 2.77× |
| 4 | values | 10,026,762 | 10,621,047 | 1.06× |
| 4 | sequence | 4,051,849 | 3,620,391 | 0.89× |
| 8 | create.empty | 3,960,704 | 3,850,852 | 0.97× |
| 8 | create.sequence | 748,753 | 791,355 | 1.06× |
| 8 | replace.random | 1,324,400 | 2,700,266 | 2.04× |
| 8 | apply.replace | 871,454 | 1,672,391 | 1.92× |
| 8 | apply.duplicate | 3,320,580 | 3,253,600 | 0.98× |
| 8 | merge.duplicate | 1,049,447 | 1,127,804 | 1.07× |
| 8 | length | 67,490,812 | 67,685,099 | 1.00× |
| 8 | value.random | 24,890,563 | 93,125,254 | 3.74× |
| 8 | values | 6,639,929 | 7,274,898 | 1.10× |
| 8 | sequence | 2,975,061 | 2,826,694 | 0.95× |
| 100 | create.empty | 3,783,135 | 3,671,042 | 0.97× |
| 100 | create.sequence | 123,804 | 129,566 | 1.05× |
| 100 | replace.random | 1,328,305 | 2,752,585 | 2.07× |
| 100 | apply.replace | 880,519 | 1,746,853 | 1.98× |
| 100 | apply.duplicate | 3,334,631 | 3,275,227 | 0.98× |
| 100 | merge.duplicate | 173,364 | 127,583 | 0.74× |
| 100 | length | 67,100,883 | 66,485,194 | 0.99× |
| 100 | value.random | 16,706,246 | 90,545,030 | 5.42× |
| 100 | values | 761,293 | 860,830 | 1.13× |
| 100 | sequence | 255,759 | 280,789 | 1.10× |

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
