# Batch benchmarks

2026-11-24T10:34:49.509Z · local run

5 runs, 6,000 edits per author. Concurrent authors edit independent views; causal authors exchange history before the second author edits. Median results.

| Workload | Mode | Author edits/s | Apply edits/s | Receive edits/s | Update/author KiB | Document KiB | Memory MiB |
| --- | --- | ---: | ---: | ---: | ---: | ---: | ---: |
| append | individual | 1,897,893 | 3,698,453 | 1,344,809 | 76.05 | 5.99 | 0.012 |
| append | batch | 2,811,621 | 382,165,605 | 288,461,538 | 5.88 | 5.99 | 0.012 |
| prepend | individual | 1,448,925 | 2,436,350 | 1,277,248 | 76.11 | 5.99 | 0.942 |
| prepend | batch | 2,024,701 | 3,299,604 | 2,907,118 | 5.89 | 5.99 | 0.942 |
| random.characters | individual | 1,127,650 | 1,740,341 | 1,211,730 | 82.09 | 28.31 | 0.963 |
| random.characters | batch | 1,248,284 | 2,056,414 | 1,871,374 | 22.95 | 28.31 | 0.963 |
| random.words | individual | 1,165,773 | 1,583,531 | 939,717 | 125.68 | 73.88 | 1.036 |
| random.words | batch | 1,228,199 | 1,830,049 | 1,662,096 | 59.71 | 73.88 | 1.036 |
| concurrent.characters | individual | 1,286,132 | 1,500,450 | 1,030,671 | 82.04 | 56.41 | 1.926 |
| concurrent.characters | batch | 1,126,454 | 1,798,831 | 1,458,523 | 22.92 | 56.41 | 1.926 |
| concurrent.words | individual | 1,258,152 | 1,456,717 | 901,747 | 125.74 | 147.81 | 2.073 |
| concurrent.words | batch | 1,459,392 | 1,624,563 | 1,557,491 | 59.79 | 147.81 | 2.073 |
| concurrent.mixed | individual | 790,415 | 1,026,492 | 725,334 | 154.61 | 97.82 | 1.573 |
| concurrent.mixed | batch | 1,016,949 | 1,247,907 | 1,162,701 | 56.88 | 97.83 | 1.573 |
| causal.characters | individual | 1,171,486 | 1,562,968 | 1,042,209 | 88.96 | 63.81 | 1.933 |
| causal.characters | batch | 1,264,449 | 1,764,395 | 1,471,093 | 23.18 | 63.81 | 1.933 |
| causal.words | individual | 1,090,423 | 1,266,544 | 720,773 | 135.13 | 156.41 | 2.081 |
| causal.words | batch | 1,342,177 | 1,645,098 | 1,508,220 | 60.68 | 156.41 | 2.081 |
| causal.mixed | individual | 730,611 | 963,121 | 715,444 | 161.05 | 103.75 | 1.576 |
| causal.mixed | batch | 878,188 | 1,189,332 | 1,132,642 | 57.34 | 103.75 | 1.576 |

## Timing dispersion

| Workload | Mode | Operation | Median ms | IQR ms |
| --- | --- | --- | ---: | ---: |
| append | individual | author | 3.161 | 0.412 |
| append | individual | apply | 1.622 | 0.693 |
| append | individual | receive | 4.462 | 2.107 |
| append | individual | encode | 4.349 | 0.761 |
| append | individual | decode | 5.719 | 0.332 |
| append | batch | author | 2.134 | 0.412 |
| append | batch | apply | 0.016 | 0.005 |
| append | batch | receive | 0.021 | 0.048 |
| append | batch | encode | 0.397 | 0.328 |
| append | batch | decode | 0.112 | 0.059 |
| prepend | individual | author | 4.141 | 2.091 |
| prepend | individual | apply | 2.463 | 0.751 |
| prepend | individual | receive | 4.698 | 1.713 |
| prepend | individual | encode | 5.239 | 2.581 |
| prepend | individual | decode | 7.016 | 2.685 |
| prepend | batch | author | 2.963 | 0.377 |
| prepend | batch | apply | 1.818 | 0.612 |
| prepend | batch | receive | 2.064 | 0.855 |
| prepend | batch | encode | 0.215 | 0.011 |
| prepend | batch | decode | 0.107 | 0.006 |
| random.characters | individual | author | 5.321 | 0.324 |
| random.characters | individual | apply | 3.448 | 0.867 |
| random.characters | individual | receive | 4.952 | 1.185 |
| random.characters | individual | encode | 4.331 | 0.218 |
| random.characters | individual | decode | 4.463 | 0.815 |
| random.characters | batch | author | 4.807 | 0.673 |
| random.characters | batch | apply | 2.918 | 0.495 |
| random.characters | batch | receive | 3.206 | 0.256 |
| random.characters | batch | encode | 0.191 | 0.034 |
| random.characters | batch | decode | 0.099 | 0.006 |
| random.words | individual | author | 5.147 | 0.549 |
| random.words | individual | apply | 3.789 | 0.102 |
| random.words | individual | receive | 6.385 | 0.640 |
| random.words | individual | encode | 4.119 | 1.136 |
| random.words | individual | decode | 7.061 | 1.075 |
| random.words | batch | author | 4.885 | 1.957 |
| random.words | batch | apply | 3.279 | 0.211 |
| random.words | batch | receive | 3.610 | 0.153 |
| random.words | batch | encode | 0.403 | 0.026 |
| random.words | batch | decode | 0.110 | 0.008 |
| concurrent.characters | individual | author | 9.330 | 0.877 |
| concurrent.characters | individual | apply | 7.998 | 2.102 |
| concurrent.characters | individual | receive | 11.643 | 0.217 |
| concurrent.characters | individual | encode | 6.474 | 1.897 |
| concurrent.characters | individual | decode | 10.791 | 1.038 |
| concurrent.characters | batch | author | 10.653 | 3.505 |
| concurrent.characters | batch | apply | 6.671 | 1.267 |
| concurrent.characters | batch | receive | 8.227 | 1.452 |
| concurrent.characters | batch | encode | 0.449 | 0.276 |
| concurrent.characters | batch | decode | 0.129 | 0.047 |
| concurrent.words | individual | author | 9.538 | 1.931 |
| concurrent.words | individual | apply | 8.238 | 1.498 |
| concurrent.words | individual | receive | 13.307 | 1.256 |
| concurrent.words | individual | encode | 7.680 | 0.393 |
| concurrent.words | individual | decode | 13.023 | 2.647 |
| concurrent.words | batch | author | 8.223 | 2.833 |
| concurrent.words | batch | apply | 7.387 | 0.460 |
| concurrent.words | batch | receive | 7.705 | 0.729 |
| concurrent.words | batch | encode | 0.751 | 0.057 |
| concurrent.words | batch | decode | 0.138 | 0.065 |
| concurrent.mixed | individual | author | 15.182 | 1.093 |
| concurrent.mixed | individual | apply | 11.690 | 0.639 |
| concurrent.mixed | individual | receive | 16.544 | 0.450 |
| concurrent.mixed | individual | encode | 8.308 | 2.218 |
| concurrent.mixed | individual | decode | 11.842 | 0.497 |
| concurrent.mixed | batch | author | 11.800 | 1.239 |
| concurrent.mixed | batch | apply | 9.616 | 0.907 |
| concurrent.mixed | batch | receive | 10.321 | 0.862 |
| concurrent.mixed | batch | encode | 0.541 | 0.041 |
| concurrent.mixed | batch | decode | 0.119 | 0.007 |
| causal.characters | individual | author | 10.243 | 0.137 |
| causal.characters | individual | apply | 7.678 | 0.085 |
| causal.characters | individual | receive | 11.514 | 0.213 |
| causal.characters | individual | encode | 6.136 | 1.091 |
| causal.characters | individual | decode | 11.163 | 1.099 |
| causal.characters | batch | author | 9.490 | 1.277 |
| causal.characters | batch | apply | 6.801 | 0.669 |
| causal.characters | batch | receive | 8.157 | 2.176 |
| causal.characters | batch | encode | 0.246 | 0.022 |
| causal.characters | batch | decode | 0.119 | 0.010 |
| causal.words | individual | author | 11.005 | 0.753 |
| causal.words | individual | apply | 9.475 | 0.558 |
| causal.words | individual | receive | 16.649 | 7.032 |
| causal.words | individual | encode | 9.154 | 2.805 |
| causal.words | individual | decode | 11.068 | 2.103 |
| causal.words | batch | author | 8.941 | 0.851 |
| causal.words | batch | apply | 7.294 | 0.265 |
| causal.words | batch | receive | 7.956 | 1.054 |
| causal.words | batch | encode | 0.587 | 0.040 |
| causal.words | batch | decode | 0.130 | 0.006 |
| causal.mixed | individual | author | 16.425 | 0.666 |
| causal.mixed | individual | apply | 12.460 | 0.352 |
| causal.mixed | individual | receive | 16.773 | 1.202 |
| causal.mixed | individual | encode | 8.219 | 1.959 |
| causal.mixed | individual | decode | 10.206 | 1.783 |
| causal.mixed | batch | author | 13.665 | 0.706 |
| causal.mixed | batch | apply | 10.090 | 0.161 |
| causal.mixed | batch | receive | 10.595 | 1.108 |
| causal.mixed | batch | encode | 0.441 | 0.011 |
| causal.mixed | batch | decode | 0.110 | 0.001 |

Measured on Node 24.16.0, V8 13.6.233.17-node.49, win32 x64, Intel(R) Core(TM) i5-10210U CPU @ 1.60GHz. Both modes group each author's binary Gossip into one MessagePack message. Batch Footage is uncompressed. Receive includes MessagePack decoding; apply excludes it. Document size follows complete acknowledgement exchange. Memory estimates use one receiver recreated from that compact checkpoint in a fresh runtime, excluding the author runtime. Preparation, verification, destruction and explicit JS process garbage collection are outside timings.
