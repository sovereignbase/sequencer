# Batch benchmarks

2026-11-27T21:54:34.964Z · [CI run](https://github.com/sovereignbase/sequencer/actions/runs/46072517566)

3 runs, 6,000 edits per author. Concurrent authors edit independent views; causal authors exchange history before the second author edits. Median results.

| Workload | Mode | Author edits/s | Apply edits/s | Receive edits/s | Update/author KiB | Document KiB | Memory MiB |
| --- | --- | ---: | ---: | ---: | ---: | ---: | ---: |
| append | individual | 3,581,916 | 9,516,212 | 3,171,787 | 76.05 | 5.99 | 0.012 |
| append | batch | 5,149,459 | 723,589,001 | 560,957,367 | 5.88 | 5.99 | 0.012 |
| prepend | individual | 3,184,938 | 3,817,267 | 2,083,398 | 76.11 | 5.99 | 0.896 |
| prepend | batch | 4,000,541 | 6,825,100 | 6,077,667 | 5.89 | 5.99 | 0.896 |
| random.characters | individual | 1,762,065 | 2,306,441 | 1,845,499 | 82.09 | 28.31 | 0.917 |
| random.characters | batch | 2,231,660 | 3,523,852 | 3,482,007 | 22.95 | 28.31 | 0.917 |
| random.words | individual | 1,932,297 | 2,171,304 | 1,767,959 | 125.68 | 73.88 | 0.991 |
| random.words | batch | 2,255,130 | 3,419,384 | 3,151,183 | 59.71 | 73.88 | 0.991 |
| concurrent.characters | individual | 2,469,048 | 2,498,205 | 2,058,595 | 82.04 | 56.41 | 1.834 |
| concurrent.characters | batch | 2,194,148 | 3,487,948 | 2,936,891 | 22.92 | 56.41 | 1.834 |
| concurrent.words | individual | 2,415,713 | 2,424,144 | 1,644,530 | 125.74 | 147.81 | 1.981 |
| concurrent.words | batch | 2,595,710 | 3,156,396 | 2,721,154 | 59.79 | 147.81 | 1.981 |
| concurrent.mixed | individual | 1,351,326 | 1,679,153 | 1,337,607 | 154.61 | 97.83 | 1.505 |
| concurrent.mixed | batch | 1,618,458 | 2,284,227 | 2,051,307 | 56.88 | 97.83 | 1.505 |
| causal.characters | individual | 1,958,468 | 2,797,214 | 2,234,606 | 88.96 | 63.81 | 1.842 |
| causal.characters | batch | 2,441,259 | 3,382,577 | 3,003,946 | 23.18 | 63.81 | 1.842 |
| causal.words | individual | 1,923,797 | 2,340,529 | 1,856,387 | 135.13 | 156.41 | 1.989 |
| causal.words | batch | 2,169,493 | 3,080,908 | 2,705,779 | 60.68 | 156.41 | 1.989 |
| causal.mixed | individual | 1,298,134 | 1,748,381 | 1,319,304 | 161.05 | 103.75 | 1.509 |
| causal.mixed | batch | 1,596,316 | 2,350,261 | 2,165,106 | 57.34 | 103.75 | 1.509 |

## Timing dispersion

| Workload | Mode | Operation | Median ms | IQR ms |
| --- | --- | --- | ---: | ---: |
| append | individual | author | 1.675 | 0.152 |
| append | individual | apply | 0.631 | 0.773 |
| append | individual | receive | 1.892 | 2.169 |
| append | individual | encode | 2.617 | 0.776 |
| append | individual | decode | 3.919 | 0.395 |
| append | batch | author | 1.165 | 0.305 |
| append | batch | apply | 0.008 | 0.008 |
| append | batch | receive | 0.011 | 0.005 |
| append | batch | encode | 0.104 | 0.017 |
| append | batch | decode | 0.065 | 0.002 |
| prepend | individual | author | 1.884 | 0.142 |
| prepend | individual | apply | 1.572 | 0.081 |
| prepend | individual | receive | 2.880 | 0.066 |
| prepend | individual | encode | 2.379 | 0.298 |
| prepend | individual | decode | 4.038 | 0.629 |
| prepend | batch | author | 1.500 | 0.004 |
| prepend | batch | apply | 0.879 | 0.179 |
| prepend | batch | receive | 0.987 | 0.162 |
| prepend | batch | encode | 0.071 | 0.006 |
| prepend | batch | decode | 0.047 | 0.002 |
| random.characters | individual | author | 3.405 | 0.642 |
| random.characters | individual | apply | 2.601 | 0.033 |
| random.characters | individual | receive | 3.251 | 0.437 |
| random.characters | individual | encode | 2.367 | 1.076 |
| random.characters | individual | decode | 3.733 | 0.814 |
| random.characters | batch | author | 2.689 | 0.600 |
| random.characters | batch | apply | 1.703 | 0.144 |
| random.characters | batch | receive | 1.723 | 0.164 |
| random.characters | batch | encode | 0.084 | 0.019 |
| random.characters | batch | decode | 0.054 | 0.003 |
| random.words | individual | author | 3.105 | 0.212 |
| random.words | individual | apply | 2.763 | 0.233 |
| random.words | individual | receive | 3.394 | 0.232 |
| random.words | individual | encode | 2.011 | 0.468 |
| random.words | individual | decode | 4.465 | 0.532 |
| random.words | batch | author | 2.661 | 0.008 |
| random.words | batch | apply | 1.755 | 0.043 |
| random.words | batch | receive | 1.904 | 0.055 |
| random.words | batch | encode | 0.173 | 0.014 |
| random.words | batch | decode | 0.055 | 0.004 |
| concurrent.characters | individual | author | 4.860 | 0.602 |
| concurrent.characters | individual | apply | 4.803 | 0.056 |
| concurrent.characters | individual | receive | 5.829 | 1.650 |
| concurrent.characters | individual | encode | 3.623 | 0.247 |
| concurrent.characters | individual | decode | 7.049 | 0.426 |
| concurrent.characters | batch | author | 5.469 | 0.584 |
| concurrent.characters | batch | apply | 3.440 | 0.076 |
| concurrent.characters | batch | receive | 4.086 | 0.920 |
| concurrent.characters | batch | encode | 0.126 | 0.011 |
| concurrent.characters | batch | decode | 0.063 | 0.005 |
| concurrent.words | individual | author | 4.967 | 0.382 |
| concurrent.words | individual | apply | 4.950 | 0.218 |
| concurrent.words | individual | receive | 7.297 | 0.144 |
| concurrent.words | individual | encode | 4.580 | 0.661 |
| concurrent.words | individual | decode | 6.782 | 0.470 |
| concurrent.words | batch | author | 4.623 | 0.772 |
| concurrent.words | batch | apply | 3.802 | 0.107 |
| concurrent.words | batch | receive | 4.410 | 0.072 |
| concurrent.words | batch | encode | 0.327 | 0.027 |
| concurrent.words | batch | decode | 0.068 | 0.009 |
| concurrent.mixed | individual | author | 8.880 | 1.637 |
| concurrent.mixed | individual | apply | 7.146 | 0.929 |
| concurrent.mixed | individual | receive | 8.971 | 3.044 |
| concurrent.mixed | individual | encode | 5.138 | 0.459 |
| concurrent.mixed | individual | decode | 6.977 | 1.370 |
| concurrent.mixed | batch | author | 7.414 | 0.768 |
| concurrent.mixed | batch | apply | 5.253 | 1.235 |
| concurrent.mixed | batch | receive | 5.850 | 0.146 |
| concurrent.mixed | batch | encode | 0.300 | 0.063 |
| concurrent.mixed | batch | decode | 0.090 | 0.009 |
| causal.characters | individual | author | 6.127 | 0.307 |
| causal.characters | individual | apply | 4.290 | 0.257 |
| causal.characters | individual | receive | 5.370 | 0.701 |
| causal.characters | individual | encode | 4.005 | 0.452 |
| causal.characters | individual | decode | 7.102 | 0.080 |
| causal.characters | batch | author | 4.915 | 0.509 |
| causal.characters | batch | apply | 3.548 | 0.079 |
| causal.characters | batch | receive | 3.995 | 0.032 |
| causal.characters | batch | encode | 0.112 | 0.022 |
| causal.characters | batch | decode | 0.068 | 0.012 |
| causal.words | individual | author | 6.238 | 0.166 |
| causal.words | individual | apply | 5.127 | 0.578 |
| causal.words | individual | receive | 6.464 | 0.204 |
| causal.words | individual | encode | 4.018 | 0.698 |
| causal.words | individual | decode | 7.262 | 0.395 |
| causal.words | batch | author | 5.531 | 0.263 |
| causal.words | batch | apply | 3.895 | 0.058 |
| causal.words | batch | receive | 4.435 | 0.121 |
| causal.words | batch | encode | 0.236 | 0.014 |
| causal.words | batch | decode | 0.072 | 0.009 |
| causal.mixed | individual | author | 9.244 | 0.466 |
| causal.mixed | individual | apply | 6.863 | 0.348 |
| causal.mixed | individual | receive | 9.096 | 0.641 |
| causal.mixed | individual | encode | 4.794 | 0.882 |
| causal.mixed | individual | decode | 6.307 | 0.633 |
| causal.mixed | batch | author | 7.517 | 0.583 |
| causal.mixed | batch | apply | 5.106 | 0.102 |
| causal.mixed | batch | receive | 5.542 | 0.202 |
| causal.mixed | batch | encode | 0.214 | 0.026 |
| causal.mixed | batch | decode | 0.080 | 0.011 |

Measured on Node 24.22.3, V8 13.6.233.17-node.63, linux x64, AMD EPYC 9V45 96-Core Processor. Both modes group each author's binary Gossip into one MessagePack message. Batch Footage is uncompressed. Receive includes MessagePack decoding; apply excludes it. Document size follows complete acknowledgement exchange. Memory estimates use one receiver recreated from that compact checkpoint in a fresh runtime, excluding the author runtime. Preparation, verification, destruction and explicit JS process garbage collection are outside timings.
