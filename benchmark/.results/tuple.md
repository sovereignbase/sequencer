# Tuple benchmarks

Arithmetic means of 3 runs. Ordinary Projection versus a static tuple with maxLength. Both contain the same values; replacements preserve the field count.

## Throughput (ops/s)

| Indices | Method / case | Projection | Static tuple | Tuple / Projection |
| ---: | --- | ---: | ---: | ---: |
| 2 | create.empty | 2,045,530 | 1,618,113 | 0.79× |
| 2 | create.sequence | 781,561 | 735,280 | 0.94× |
| 2 | replace.random | 804,229 | 1,341,210 | 1.67× |
| 2 | apply.replace | 552,922 | 871,018 | 1.58× |
| 2 | apply.duplicate | 1,686,302 | 1,446,833 | 0.86× |
| 2 | merge.duplicate | 1,115,510 | 1,059,946 | 0.95× |
| 2 | length | 68,063,712 | 68,356,186 | 1.00× |
| 2 | value.random | 31,209,443 | 53,673,417 | 1.72× |
| 2 | values | 9,349,169 | 10,058,164 | 1.08× |
| 2 | sequence | 2,258,807 | 2,099,868 | 0.93× |
| 4 | create.empty | 1,969,085 | 1,790,772 | 0.91× |
| 4 | create.sequence | 616,833 | 652,191 | 1.06× |
| 4 | replace.random | 826,973 | 1,538,723 | 1.86× |
| 4 | apply.replace | 445,795 | 978,114 | 2.19× |
| 4 | apply.duplicate | 1,670,349 | 1,573,149 | 0.94× |
| 4 | merge.duplicate | 867,324 | 826,511 | 0.95× |
| 4 | length | 67,322,800 | 69,179,354 | 1.03× |
| 4 | value.random | 23,167,935 | 44,704,914 | 1.93× |
| 4 | values | 6,081,874 | 7,215,083 | 1.19× |
| 4 | sequence | 1,779,359 | 1,707,197 | 0.96× |
| 8 | create.empty | 1,626,194 | 1,697,982 | 1.04× |
| 8 | create.sequence | 408,001 | 502,071 | 1.23× |
| 8 | replace.random | 870,069 | 1,442,283 | 1.66× |
| 8 | apply.replace | 395,921 | 996,469 | 2.52× |
| 8 | apply.duplicate | 1,743,996 | 1,672,042 | 0.96× |
| 8 | merge.duplicate | 561,530 | 554,086 | 0.99× |
| 8 | length | 37,762,980 | 39,042,020 | 1.03× |
| 8 | value.random | 19,688,055 | 54,908,066 | 2.79× |
| 8 | values | 4,391,646 | 5,050,807 | 1.15× |
| 8 | sequence | 1,395,127 | 1,490,995 | 1.07× |
| 100 | create.empty | 2,050,916 | 1,746,804 | 0.85× |
| 100 | create.sequence | 72,169 | 98,959 | 1.37× |
| 100 | replace.random | 751,739 | 1,562,404 | 2.08× |
| 100 | apply.replace | 337,867 | 1,035,577 | 3.07× |
| 100 | apply.duplicate | 1,762,298 | 1,725,940 | 0.98× |
| 100 | merge.duplicate | 113,052 | 76,210 | 0.67× |
| 100 | length | 34,902,015 | 36,580,629 | 1.05× |
| 100 | value.random | 9,019,048 | 56,218,759 | 6.23× |
| 100 | values | 506,275 | 610,265 | 1.21× |
| 100 | sequence | 161,391 | 184,233 | 1.14× |

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

Measured on Node 24.16.0, V8 13.6.233.17-node.49, win32 x64, Intel(R) Core(TM) i5-10210U CPU @ 1.60GHz. Fixtures are hydrated compacted snapshots after one replacement per field. Each case warms up for ≥25 ms and measures ≥50 ms of API time; mutation bursts restart after 4,096 replacements. Peer authoring, encoding, result checks, destruction and explicit JS process garbage collection are outside API timings. Memory estimates are the increase in live native allocator bytes plus retained JS array slots for one instance, including exercised runtime buffers. Unused WASM capacity, JS object headers and referenced payload objects are excluded.
