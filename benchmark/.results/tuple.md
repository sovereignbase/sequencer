# Tuple benchmarks

2026-11-24T18:43:14.972Z · [CI run](https://github.com/sovereignbase/sequencer/actions/runs/45461530116)

Arithmetic means of 3 runs. Ordinary Projection versus a static tuple with maxLength. Both contain the same values; replacements preserve the field count.

## Throughput (ops/s)

| Indices | Method / case | Projection | Static tuple | Tuple / Projection |
| ---: | --- | ---: | ---: | ---: |
| 2 | create.empty | 3,539,910 | 3,697,519 | 1.04× |
| 2 | create.sequence | 967,943 | 892,076 | 0.92× |
| 2 | replace.random | 1,366,615 | 2,416,780 | 1.77× |
| 2 | apply.replace | 815,105 | 1,467,173 | 1.80× |
| 2 | apply.duplicate | 3,194,286 | 3,178,722 | 1.00× |
| 2 | merge.duplicate | 1,746,361 | 1,804,706 | 1.03× |
| 2 | length | 99,392,037 | 98,844,885 | 0.99× |
| 2 | value.random | 41,408,134 | 77,268,082 | 1.87× |
| 2 | values | 13,541,203 | 15,012,846 | 1.11× |
| 2 | sequence | 3,256,069 | 3,086,319 | 0.95× |
| 4 | create.empty | 3,855,954 | 3,525,034 | 0.91× |
| 4 | create.sequence | 769,756 | 779,338 | 1.01× |
| 4 | replace.random | 1,147,080 | 2,261,735 | 1.97× |
| 4 | apply.replace | 749,738 | 1,475,648 | 1.97× |
| 4 | apply.duplicate | 3,151,829 | 3,074,274 | 0.98× |
| 4 | merge.duplicate | 1,377,721 | 1,387,332 | 1.01× |
| 4 | length | 50,256,223 | 50,975,940 | 1.01× |
| 4 | value.random | 33,242,152 | 76,833,869 | 2.31× |
| 4 | values | 9,702,918 | 9,752,843 | 1.01× |
| 4 | sequence | 3,306,841 | 3,248,395 | 0.98× |
| 8 | create.empty | 3,591,737 | 3,639,900 | 1.01× |
| 8 | create.sequence | 539,164 | 625,488 | 1.16× |
| 8 | replace.random | 1,097,863 | 2,430,938 | 2.21× |
| 8 | apply.replace | 727,298 | 1,595,261 | 2.19× |
| 8 | apply.duplicate | 3,079,234 | 3,083,540 | 1.00× |
| 8 | merge.duplicate | 933,079 | 863,391 | 0.93× |
| 8 | length | 50,751,040 | 50,508,152 | 1.00× |
| 8 | value.random | 26,292,634 | 77,053,837 | 2.93× |
| 8 | values | 6,185,451 | 6,548,821 | 1.06× |
| 8 | sequence | 2,511,459 | 2,452,368 | 0.98× |
| 100 | create.empty | 3,773,997 | 3,309,892 | 0.88× |
| 100 | create.sequence | 105,082 | 110,712 | 1.05× |
| 100 | replace.random | 1,097,229 | 2,407,514 | 2.19× |
| 100 | apply.replace | 735,019 | 1,511,833 | 2.06× |
| 100 | apply.duplicate | 3,164,145 | 3,109,046 | 0.98× |
| 100 | merge.duplicate | 148,782 | 108,657 | 0.73× |
| 100 | length | 48,945,841 | 47,612,501 | 0.97× |
| 100 | value.random | 17,631,115 | 73,915,046 | 4.19× |
| 100 | values | 742,545 | 836,478 | 1.13× |
| 100 | sequence | 238,181 | 241,832 | 1.02× |

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
