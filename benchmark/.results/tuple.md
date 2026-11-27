# Tuple benchmarks

2026-11-27T16:48:35.797Z · [CI run](https://github.com/sovereignbase/sequencer/actions/runs/46035866481)

Arithmetic means of 3 runs. Ordinary Projection versus a static tuple with maxLength. Both contain the same values; replacements preserve the field count.

## Throughput (ops/s)

| Indices | Method / case | Projection | Static tuple | Tuple / Projection |
| ---: | --- | ---: | ---: | ---: |
| 2 | create.empty | 3,112,836 | 2,901,023 | 0.93× |
| 2 | create.sequence | 1,107,749 | 882,732 | 0.80× |
| 2 | replace.random | 1,516,558 | 1,911,743 | 1.26× |
| 2 | apply.replace | 832,742 | 1,143,063 | 1.37× |
| 2 | apply.duplicate | 2,222,426 | 2,411,865 | 1.09× |
| 2 | merge.duplicate | 1,608,803 | 1,564,117 | 0.97× |
| 2 | length | 92,058,096 | 92,957,183 | 1.01× |
| 2 | value.random | 33,837,748 | 67,897,800 | 2.01× |
| 2 | values | 11,056,094 | 10,950,880 | 0.99× |
| 2 | sequence | 4,305,752 | 4,028,069 | 0.94× |
| 4 | create.empty | 3,183,578 | 2,833,853 | 0.89× |
| 4 | create.sequence | 818,094 | 775,636 | 0.95× |
| 4 | replace.random | 1,149,322 | 1,886,567 | 1.64× |
| 4 | apply.replace | 727,067 | 1,101,109 | 1.51× |
| 4 | apply.duplicate | 2,510,253 | 2,407,691 | 0.96× |
| 4 | merge.duplicate | 1,226,015 | 1,173,391 | 0.96× |
| 4 | length | 96,264,886 | 95,192,310 | 0.99× |
| 4 | value.random | 25,037,819 | 68,797,109 | 2.75× |
| 4 | values | 8,227,483 | 8,284,613 | 1.01× |
| 4 | sequence | 3,606,084 | 3,671,547 | 1.02× |
| 8 | create.empty | 3,027,153 | 3,064,865 | 1.01× |
| 8 | create.sequence | 540,090 | 606,980 | 1.12× |
| 8 | replace.random | 1,104,864 | 1,958,919 | 1.77× |
| 8 | apply.replace | 718,548 | 1,216,829 | 1.69× |
| 8 | apply.duplicate | 2,301,336 | 2,241,179 | 0.97× |
| 8 | merge.duplicate | 797,783 | 699,002 | 0.88× |
| 8 | length | 97,754,109 | 97,398,688 | 1.00× |
| 8 | value.random | 19,648,730 | 66,542,505 | 3.39× |
| 8 | values | 5,105,648 | 5,385,916 | 1.05× |
| 8 | sequence | 2,317,169 | 2,468,108 | 1.07× |
| 100 | create.empty | 2,620,684 | 2,847,762 | 1.09× |
| 100 | create.sequence | 88,549 | 92,548 | 1.05× |
| 100 | replace.random | 1,112,203 | 1,892,095 | 1.70× |
| 100 | apply.replace | 710,490 | 1,266,743 | 1.78× |
| 100 | apply.duplicate | 2,154,289 | 2,392,166 | 1.11× |
| 100 | merge.duplicate | 135,011 | 91,769 | 0.68× |
| 100 | length | 48,828,981 | 48,821,604 | 1.00× |
| 100 | value.random | 12,565,323 | 64,695,729 | 5.15× |
| 100 | values | 585,444 | 638,167 | 1.09× |
| 100 | sequence | 225,555 | 215,975 | 0.96× |

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

Measured on Node 24.22.3, V8 13.6.233.17-node.63, linux x64, INTEL(R) XEON(R) PLATINUM 8573C. Fixtures are hydrated compacted snapshots after one replacement per field. Each case warms up for ≥25 ms and measures ≥50 ms of API time; mutation bursts restart after 4,096 replacements. Peer authoring, encoding, result checks, destruction and explicit JS process garbage collection are outside API timings. Memory estimates are the increase in live native allocator bytes plus retained JS array slots for one instance, including exercised runtime buffers. Unused WASM capacity, JS object headers and referenced payload objects are excluded.
