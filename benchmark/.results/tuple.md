# Tuple benchmarks

Arithmetic means of 3 runs. Fixed and dynamic tuple modes use stable indices; ordinary sequences shift indices. Fixtures contain one Frame per scattered Insertion.

## Throughput (ops/s)

| Indices | Method / case | baseline | sequence | fixed | dynamic |
| ---: | --- | ---: | ---: | ---: | ---: |
| 100 | create.empty | 400,923 | 816,205 | 654,764 | 771,920 |
| 100 | create.sequence | 40,392 | 51,005 | 62,990 | 68,033 |
| 100 | insert.random | 1,035,241 | 1,117,085 | 2,871,521 | 2,235,608 |
| 100 | remove.random | 313,305 | 422,587 | 851,498 | 874,891 |
| 100 | replace.random | 258,891 | 357,249 | 638,801 | 606,948 |
| 100 | apply.insert | 304,595 | 400,873 | 720,747 | 718,530 |
| 100 | apply.remove | 155,486 | 223,358 | 313,512 | 261,081 |
| 100 | apply.replace | 118,000 | 192,231 | 359,872 | 369,386 |
| 100 | apply.duplicate | 417,947 | 749,690 | 910,145 | 938,095 |
| 100 | merge.duplicate | 18,592 | 45,255 | 52,578 | 27,017 |
| 100 | length | 12,011,889 | 9,111,396 | 5,498,776 | 12,558,629 |
| 100 | value.random | 2,606,871 | 3,576,103 | 8,431,271 | 6,751,626 |
| 100 | values | 68,660 | 61,517 | 76,595 | 68,252 |
| 100 | sequence | 23,631 | 32,362 | 28,558 | 38,538 |
| 1,000 | create.empty | 244,965 | 658,441 | 174,086 | 393,672 |
| 1,000 | create.sequence | 3,903 | 5,950 | 9,052 | 9,081 |
| 1,000 | insert.random | 800,271 | 789,868 | 2,683,158 | 3,060,029 |
| 1,000 | remove.random | 276,644 | 531,858 | 1,149,897 | 1,062,943 |
| 1,000 | replace.random | 256,094 | 442,078 | 846,648 | 838,873 |
| 1,000 | apply.insert | 297,681 | 414,271 | 826,195 | 817,301 |
| 1,000 | apply.remove | 165,358 | 300,084 | 408,884 | 402,319 |
| 1,000 | apply.replace | 148,211 | 183,004 | 443,972 | 356,146 |
| 1,000 | apply.duplicate | 469,842 | 715,549 | 946,775 | 913,584 |
| 1,000 | merge.duplicate | 4,664 | 10,072 | 7,266 | 6,943 |
| 1,000 | length | 11,242,792 | 11,209,511 | 14,296,959 | 14,771,621 |
| 1,000 | value.random | 2,983,970 | 3,188,747 | 7,489,809 | 7,426,538 |
| 1,000 | values | 13,077 | 12,238 | 20,615 | 10,904 |
| 1,000 | sequence | 5,143 | 5,930 | 9,765 | 5,372 |
| 10,000 | create.empty | 206,320 | 396,059 | 88,379 | 416,982 |
| 10,000 | create.sequence | 460 | 513 | 1,126 | 834 |
| 10,000 | insert.random | 466,428 | 555,553 | 2,796,216 | 2,059,791 |
| 10,000 | remove.random | 272,633 | 268,423 | 619,439 | 624,400 |
| 10,000 | replace.random | 219,642 | 217,485 | 542,578 | 508,828 |
| 10,000 | apply.insert | 186,630 | 143,402 | 455,457 | 462,688 |
| 10,000 | apply.remove | 131,307 | 164,002 | 366,273 | 321,059 |
| 10,000 | apply.replace | 103,470 | 119,996 | 290,515 | 271,419 |
| 10,000 | apply.duplicate | 358,036 | 372,548 | 444,486 | 531,773 |
| 10,000 | merge.duplicate | 960 | 959 | 679 | 770 |
| 10,000 | length | 11,162,499 | 11,461,964 | 10,127,477 | 10,683,991 |
| 10,000 | value.random | 1,006,170 | 1,005,955 | 5,736,117 | 5,266,084 |
| 10,000 | values | 2,380 | 1,795 | 2,083 | 2,454 |
| 10,000 | sequence | 540 | 537 | 867 | 877 |

## Space (KiB)

| Indices | Mode | Estimated library memory | MessagePack | MessagePack + gzip |
| ---: | --- | ---: | ---: | ---: |
| 100 | baseline | — | 0.57 | 0.50 |
| 100 | sequence | 1025.98 | 0.57 | 0.51 |
| 100 | fixed | 1025.59 | 0.51 | 0.34 |
| 100 | dynamic | 1025.59 | 0.51 | 0.34 |
| 1,000 | baseline | — | 9.16 | 6.44 |
| 1,000 | sequence | 1040.70 | 9.16 | 6.44 |
| 1,000 | fixed | 1039.65 | 8.07 | 4.02 |
| 1,000 | dynamic | 1039.65 | 8.07 | 4.02 |
| 10,000 | baseline | — | 109.75 | 77.55 |
| 10,000 | sequence | 3060.80 | 109.75 | 77.55 |
| 10,000 | fixed | 1692.27 | 87.17 | 42.51 |
| 10,000 | dynamic | 1692.27 | 87.17 | 42.51 |

Measured on Node 24.16.0, V8 13.6.233.17-node.49, win32 x64, Intel(R) Core(TM) i5-10210U CPU @ 1.60GHz. Peer authoring, encoding, validation, destruction and explicit JS process garbage collection are outside API timings. Constructor results are destroyed after each burst. Memory estimates include one instance's isolated WASM linear memory and retained JS array slots; referenced payload objects are excluded.
