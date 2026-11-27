# Batch benchmarks

2026-11-27T22:08:29.187Z · [CI run](https://github.com/sovereignbase/sequencer/actions/runs/46073953475)

3 runs, 6,000 edits per author. Concurrent authors edit independent views; causal authors exchange history before the second author edits. Median results.

| Workload | Mode | Author edits/s | Apply edits/s | Receive edits/s | Update/author KiB | Document KiB | Memory MiB |
| --- | --- | ---: | ---: | ---: | ---: | ---: | ---: |
| append | individual | 2,660,884 | 5,312,847 | 2,100,397 | 76.05 | 5.99 | 0.012 |
| append | batch | 4,085,170 | 653,310,105 | 606,980,273 | 5.88 | 5.99 | 0.012 |
| prepend | individual | 2,149,846 | 3,630,838 | 1,934,161 | 76.11 | 5.99 | 0.896 |
| prepend | batch | 2,499,339 | 4,404,646 | 4,099,722 | 5.89 | 5.99 | 0.896 |
| random.characters | individual | 1,415,712 | 1,590,080 | 1,497,444 | 82.09 | 28.31 | 0.917 |
| random.characters | batch | 1,524,250 | 2,607,666 | 2,499,494 | 22.95 | 28.31 | 0.917 |
| random.words | individual | 1,515,178 | 2,030,855 | 1,473,380 | 125.68 | 73.88 | 0.991 |
| random.words | batch | 1,446,242 | 2,482,447 | 2,307,486 | 59.71 | 73.88 | 0.991 |
| concurrent.characters | individual | 1,766,899 | 1,790,774 | 1,451,264 | 82.04 | 56.41 | 1.834 |
| concurrent.characters | batch | 1,763,784 | 2,394,476 | 2,116,147 | 22.92 | 56.41 | 1.834 |
| concurrent.words | individual | 1,734,867 | 1,898,623 | 1,306,316 | 125.74 | 147.81 | 1.981 |
| concurrent.words | batch | 1,593,953 | 2,331,747 | 2,035,777 | 59.79 | 147.81 | 1.981 |
| concurrent.mixed | individual | 1,035,248 | 1,331,925 | 1,082,464 | 154.61 | 97.83 | 1.505 |
| concurrent.mixed | batch | 1,168,971 | 1,739,353 | 1,591,171 | 56.88 | 97.82 | 1.505 |
| causal.characters | individual | 1,471,811 | 1,997,798 | 1,456,535 | 88.96 | 63.81 | 1.842 |
| causal.characters | batch | 1,570,224 | 2,420,118 | 2,117,056 | 23.18 | 63.81 | 1.842 |
| causal.words | individual | 1,537,442 | 1,823,500 | 1,331,409 | 135.13 | 156.41 | 1.989 |
| causal.words | batch | 1,692,940 | 2,242,878 | 1,992,645 | 60.68 | 156.41 | 1.989 |
| causal.mixed | individual | 980,487 | 1,343,116 | 1,065,694 | 161.05 | 103.75 | 1.509 |
| causal.mixed | batch | 1,198,249 | 1,688,168 | 1,559,943 | 57.34 | 103.75 | 1.509 |

## Timing dispersion

| Workload | Mode | Operation | Median ms | IQR ms |
| --- | --- | --- | ---: | ---: |
| append | individual | author | 2.255 | 0.544 |
| append | individual | apply | 1.129 | 1.347 |
| append | individual | receive | 2.857 | 2.920 |
| append | individual | encode | 3.577 | 0.987 |
| append | individual | decode | 4.120 | 0.581 |
| append | batch | author | 1.469 | 0.197 |
| append | batch | apply | 0.009 | 0.005 |
| append | batch | receive | 0.010 | 0.004 |
| append | batch | encode | 0.094 | 0.002 |
| append | batch | decode | 0.055 | 0.017 |
| prepend | individual | author | 2.791 | 0.450 |
| prepend | individual | apply | 1.653 | 0.296 |
| prepend | individual | receive | 3.102 | 0.828 |
| prepend | individual | encode | 2.919 | 0.620 |
| prepend | individual | decode | 4.807 | 0.539 |
| prepend | batch | author | 2.401 | 0.140 |
| prepend | batch | apply | 1.362 | 0.249 |
| prepend | batch | receive | 1.464 | 0.253 |
| prepend | batch | encode | 0.099 | 0.003 |
| prepend | batch | decode | 0.061 | 0.011 |
| random.characters | individual | author | 4.238 | 0.176 |
| random.characters | individual | apply | 3.773 | 0.350 |
| random.characters | individual | receive | 4.007 | 0.588 |
| random.characters | individual | encode | 3.526 | 0.876 |
| random.characters | individual | decode | 5.209 | 0.284 |
| random.characters | batch | author | 3.936 | 0.736 |
| random.characters | batch | apply | 2.301 | 0.168 |
| random.characters | batch | receive | 2.400 | 0.179 |
| random.characters | batch | encode | 0.103 | 0.010 |
| random.characters | batch | decode | 0.063 | 0.003 |
| random.words | individual | author | 3.960 | 0.093 |
| random.words | individual | apply | 2.954 | 0.231 |
| random.words | individual | receive | 4.072 | 0.221 |
| random.words | individual | encode | 2.827 | 0.249 |
| random.words | individual | decode | 5.541 | 0.560 |
| random.words | batch | author | 4.149 | 0.123 |
| random.words | batch | apply | 2.417 | 0.012 |
| random.words | batch | receive | 2.600 | 0.006 |
| random.words | batch | encode | 0.236 | 0.012 |
| random.words | batch | decode | 0.069 | 0.005 |
| concurrent.characters | individual | author | 6.792 | 0.226 |
| concurrent.characters | individual | apply | 6.701 | 0.416 |
| concurrent.characters | individual | receive | 8.269 | 2.033 |
| concurrent.characters | individual | encode | 5.041 | 0.144 |
| concurrent.characters | individual | decode | 8.429 | 0.508 |
| concurrent.characters | batch | author | 6.804 | 0.268 |
| concurrent.characters | batch | apply | 5.012 | 0.334 |
| concurrent.characters | batch | receive | 5.671 | 0.069 |
| concurrent.characters | batch | encode | 0.173 | 0.056 |
| concurrent.characters | batch | decode | 0.078 | 0.019 |
| concurrent.words | individual | author | 6.917 | 0.252 |
| concurrent.words | individual | apply | 6.320 | 0.062 |
| concurrent.words | individual | receive | 9.186 | 0.715 |
| concurrent.words | individual | encode | 4.995 | 0.243 |
| concurrent.words | individual | decode | 9.009 | 0.527 |
| concurrent.words | batch | author | 7.528 | 0.727 |
| concurrent.words | batch | apply | 5.146 | 0.048 |
| concurrent.words | batch | receive | 5.895 | 0.156 |
| concurrent.words | batch | encode | 0.416 | 0.006 |
| concurrent.words | batch | decode | 0.081 | 0.002 |
| concurrent.mixed | individual | author | 11.591 | 1.660 |
| concurrent.mixed | individual | apply | 9.010 | 0.486 |
| concurrent.mixed | individual | receive | 11.086 | 0.944 |
| concurrent.mixed | individual | encode | 6.078 | 0.386 |
| concurrent.mixed | individual | decode | 8.243 | 0.980 |
| concurrent.mixed | batch | author | 10.265 | 0.440 |
| concurrent.mixed | batch | apply | 6.899 | 1.303 |
| concurrent.mixed | batch | receive | 7.542 | 0.074 |
| concurrent.mixed | batch | encode | 0.335 | 0.097 |
| concurrent.mixed | batch | decode | 0.084 | 0.020 |
| causal.characters | individual | author | 8.153 | 0.561 |
| causal.characters | individual | apply | 6.007 | 0.188 |
| causal.characters | individual | receive | 8.239 | 1.272 |
| causal.characters | individual | encode | 5.338 | 0.376 |
| causal.characters | individual | decode | 8.728 | 1.177 |
| causal.characters | batch | author | 7.642 | 0.544 |
| causal.characters | batch | apply | 4.958 | 0.026 |
| causal.characters | batch | receive | 5.668 | 0.164 |
| causal.characters | batch | encode | 0.135 | 0.008 |
| causal.characters | batch | decode | 0.083 | 0.007 |
| causal.words | individual | author | 7.805 | 0.613 |
| causal.words | individual | apply | 6.581 | 0.344 |
| causal.words | individual | receive | 9.013 | 0.994 |
| causal.words | individual | encode | 5.881 | 0.770 |
| causal.words | individual | decode | 8.875 | 0.230 |
| causal.words | batch | author | 7.088 | 0.571 |
| causal.words | batch | apply | 5.350 | 0.010 |
| causal.words | batch | receive | 6.022 | 0.100 |
| causal.words | batch | encode | 0.329 | 0.006 |
| causal.words | batch | decode | 0.086 | 0.001 |
| causal.mixed | individual | author | 12.239 | 0.355 |
| causal.mixed | individual | apply | 8.934 | 0.357 |
| causal.mixed | individual | receive | 11.260 | 1.007 |
| causal.mixed | individual | encode | 6.053 | 0.107 |
| causal.mixed | individual | decode | 7.200 | 0.529 |
| causal.mixed | batch | author | 10.015 | 0.712 |
| causal.mixed | batch | apply | 7.108 | 0.017 |
| causal.mixed | batch | receive | 7.693 | 0.100 |
| causal.mixed | batch | encode | 0.268 | 0.006 |
| causal.mixed | batch | decode | 0.091 | 0.004 |

Measured on Node 24.22.3, V8 13.6.233.17-node.63, linux x64, AMD EPYC 9V74 80-Core Processor. Both modes group each author's binary Gossip into one MessagePack message. Batch Footage is uncompressed. Receive includes MessagePack decoding; apply excludes it. Document size follows complete acknowledgement exchange. Memory estimates use one receiver recreated from that compact checkpoint in a fresh runtime, excluding the author runtime. Preparation, verification, destruction and explicit JS process garbage collection are outside timings.
