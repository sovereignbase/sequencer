# Batch benchmarks

2026-11-27T16:37:45.962Z · [CI run](https://github.com/sovereignbase/sequencer/actions/runs/46034007280)

3 runs, 6,000 edits per author. Concurrent authors edit independent views; causal authors exchange history before the second author edits. Median results.

| Workload | Mode | Author edits/s | Apply edits/s | Receive edits/s | Update/author KiB | Document KiB | Memory MiB |
| --- | --- | ---: | ---: | ---: | ---: | ---: | ---: |
| append | individual | 1,901,286 | 2,862,727 | 1,417,657 | 76.05 | 5.99 | 0.012 |
| append | batch | 2,036,249 | 780,843,311 | 456,794,823 | 5.88 | 5.99 | 0.012 |
| prepend | individual | 1,578,610 | 1,852,902 | 1,549,199 | 76.11 | 5.99 | 0.896 |
| prepend | batch | 1,780,230 | 3,747,487 | 3,349,427 | 5.89 | 5.99 | 0.896 |
| random.characters | individual | 1,107,083 | 1,866,659 | 1,217,447 | 82.09 | 28.31 | 0.917 |
| random.characters | batch | 1,159,392 | 2,230,166 | 2,120,520 | 22.95 | 28.31 | 0.917 |
| random.words | individual | 1,153,376 | 1,758,406 | 1,075,147 | 125.68 | 73.88 | 0.991 |
| random.words | batch | 1,196,044 | 2,076,292 | 1,944,341 | 59.71 | 73.88 | 0.991 |
| concurrent.characters | individual | 1,322,786 | 1,551,242 | 975,441 | 82.04 | 56.41 | 1.834 |
| concurrent.characters | batch | 1,323,010 | 1,973,661 | 1,804,233 | 22.92 | 56.41 | 1.834 |
| concurrent.words | individual | 1,351,688 | 1,571,207 | 890,601 | 125.74 | 147.81 | 1.981 |
| concurrent.words | batch | 1,185,068 | 1,916,476 | 1,733,534 | 59.79 | 147.81 | 1.981 |
| concurrent.mixed | individual | 790,946 | 1,083,448 | 899,821 | 154.61 | 97.83 | 1.505 |
| concurrent.mixed | batch | 984,614 | 1,411,226 | 1,259,428 | 56.88 | 97.82 | 1.505 |
| causal.characters | individual | 1,069,233 | 1,651,497 | 1,265,308 | 88.96 | 63.81 | 1.842 |
| causal.characters | batch | 1,311,984 | 2,005,317 | 1,775,234 | 23.18 | 63.81 | 1.842 |
| causal.words | individual | 1,158,111 | 1,496,337 | 1,042,118 | 135.13 | 156.41 | 1.989 |
| causal.words | batch | 1,175,839 | 1,834,324 | 1,651,315 | 60.68 | 156.41 | 1.989 |
| causal.mixed | individual | 771,632 | 1,159,007 | 728,556 | 161.05 | 103.75 | 1.509 |
| causal.mixed | batch | 970,533 | 1,368,038 | 1,296,037 | 57.34 | 103.75 | 1.509 |

## Timing dispersion

| Workload | Mode | Operation | Median ms | IQR ms |
| --- | --- | --- | ---: | ---: |
| append | individual | author | 3.156 | 0.248 |
| append | individual | apply | 2.096 | 1.176 |
| append | individual | receive | 4.232 | 3.480 |
| append | individual | encode | 5.190 | 0.451 |
| append | individual | decode | 7.570 | 0.198 |
| append | batch | author | 2.947 | 0.491 |
| append | batch | apply | 0.008 | 0.011 |
| append | batch | receive | 0.013 | 0.011 |
| append | batch | encode | 0.117 | 0.051 |
| append | batch | decode | 0.068 | 0.020 |
| prepend | individual | author | 3.801 | 0.202 |
| prepend | individual | apply | 3.238 | 0.270 |
| prepend | individual | receive | 3.873 | 1.008 |
| prepend | individual | encode | 4.739 | 0.125 |
| prepend | individual | decode | 6.572 | 0.064 |
| prepend | batch | author | 3.370 | 0.778 |
| prepend | batch | apply | 1.601 | 0.205 |
| prepend | batch | receive | 1.791 | 0.236 |
| prepend | batch | encode | 0.123 | 0.013 |
| prepend | batch | decode | 0.072 | 0.003 |
| random.characters | individual | author | 5.420 | 1.529 |
| random.characters | individual | apply | 3.214 | 0.317 |
| random.characters | individual | receive | 4.928 | 0.894 |
| random.characters | individual | encode | 4.262 | 1.746 |
| random.characters | individual | decode | 7.239 | 0.152 |
| random.characters | batch | author | 5.175 | 0.671 |
| random.characters | batch | apply | 2.690 | 0.265 |
| random.characters | batch | receive | 2.829 | 0.293 |
| random.characters | batch | encode | 0.118 | 0.011 |
| random.characters | batch | decode | 0.072 | 0.007 |
| random.words | individual | author | 5.202 | 0.272 |
| random.words | individual | apply | 3.412 | 0.275 |
| random.words | individual | receive | 5.581 | 0.265 |
| random.words | individual | encode | 3.920 | 0.859 |
| random.words | individual | decode | 7.321 | 0.872 |
| random.words | batch | author | 5.017 | 0.859 |
| random.words | batch | apply | 2.890 | 0.029 |
| random.words | batch | receive | 3.086 | 0.021 |
| random.words | batch | encode | 0.279 | 0.009 |
| random.words | batch | decode | 0.075 | 0.005 |
| concurrent.characters | individual | author | 9.072 | 1.019 |
| concurrent.characters | individual | apply | 7.736 | 0.668 |
| concurrent.characters | individual | receive | 12.302 | 2.825 |
| concurrent.characters | individual | encode | 7.669 | 1.205 |
| concurrent.characters | individual | decode | 10.601 | 1.301 |
| concurrent.characters | batch | author | 9.070 | 0.617 |
| concurrent.characters | batch | apply | 6.080 | 0.560 |
| concurrent.characters | batch | receive | 6.651 | 0.082 |
| concurrent.characters | batch | encode | 0.204 | 0.058 |
| concurrent.characters | batch | decode | 0.095 | 0.034 |
| concurrent.words | individual | author | 8.878 | 0.670 |
| concurrent.words | individual | apply | 7.637 | 0.200 |
| concurrent.words | individual | receive | 13.474 | 0.330 |
| concurrent.words | individual | encode | 7.317 | 0.774 |
| concurrent.words | individual | decode | 12.262 | 1.627 |
| concurrent.words | batch | author | 10.126 | 0.407 |
| concurrent.words | batch | apply | 6.261 | 0.156 |
| concurrent.words | batch | receive | 6.922 | 0.077 |
| concurrent.words | batch | encode | 0.493 | 0.008 |
| concurrent.words | batch | decode | 0.099 | 0.009 |
| concurrent.mixed | individual | author | 15.172 | 1.318 |
| concurrent.mixed | individual | apply | 11.076 | 0.769 |
| concurrent.mixed | individual | receive | 13.336 | 1.353 |
| concurrent.mixed | individual | encode | 8.446 | 0.919 |
| concurrent.mixed | individual | decode | 11.891 | 0.726 |
| concurrent.mixed | batch | author | 12.188 | 1.179 |
| concurrent.mixed | batch | apply | 8.503 | 0.096 |
| concurrent.mixed | batch | receive | 9.528 | 0.198 |
| concurrent.mixed | batch | encode | 0.400 | 0.024 |
| concurrent.mixed | batch | decode | 0.095 | 0.011 |
| causal.characters | individual | author | 11.223 | 0.812 |
| causal.characters | individual | apply | 7.266 | 0.245 |
| causal.characters | individual | receive | 9.484 | 1.381 |
| causal.characters | individual | encode | 7.302 | 0.672 |
| causal.characters | individual | decode | 12.971 | 0.433 |
| causal.characters | batch | author | 9.146 | 0.720 |
| causal.characters | batch | apply | 5.984 | 0.086 |
| causal.characters | batch | receive | 6.760 | 0.072 |
| causal.characters | batch | encode | 0.163 | 0.009 |
| causal.characters | batch | decode | 0.093 | 0.004 |
| causal.words | individual | author | 10.362 | 0.597 |
| causal.words | individual | apply | 8.020 | 0.331 |
| causal.words | individual | receive | 11.515 | 0.731 |
| causal.words | individual | encode | 7.760 | 1.017 |
| causal.words | individual | decode | 13.043 | 1.165 |
| causal.words | batch | author | 10.205 | 0.313 |
| causal.words | batch | apply | 6.542 | 0.063 |
| causal.words | batch | receive | 7.267 | 0.272 |
| causal.words | batch | encode | 0.419 | 0.002 |
| causal.words | batch | decode | 0.108 | 0.004 |
| causal.mixed | individual | author | 15.551 | 0.392 |
| causal.mixed | individual | apply | 10.354 | 0.244 |
| causal.mixed | individual | receive | 16.471 | 2.245 |
| causal.mixed | individual | encode | 8.810 | 0.780 |
| causal.mixed | individual | decode | 10.515 | 0.349 |
| causal.mixed | batch | author | 12.364 | 0.575 |
| causal.mixed | batch | apply | 8.772 | 0.098 |
| causal.mixed | batch | receive | 9.259 | 0.143 |
| causal.mixed | batch | encode | 0.312 | 0.019 |
| causal.mixed | batch | decode | 0.099 | 0.005 |

Measured on Node 24.22.3, V8 13.6.233.17-node.63, linux x64, AMD EPYC 7763 64-Core Processor. Both modes group each author's binary Gossip into one MessagePack message. Batch Footage is uncompressed. Receive includes MessagePack decoding; apply excludes it. Document size follows complete acknowledgement exchange. Memory estimates use one receiver recreated from that compact checkpoint in a fresh runtime, excluding the author runtime. Preparation, verification, destruction and explicit JS process garbage collection are outside timings.
