# Batch benchmarks

2026-11-27T21:42:30.060Z · local run

5 runs, 6,000 edits per author. Concurrent authors edit independent views; causal authors exchange history before the second author edits. Median results.

| Workload | Mode | Author edits/s | Apply edits/s | Receive edits/s | Update/author KiB | Document KiB | Memory MiB |
| --- | --- | ---: | ---: | ---: | ---: | ---: | ---: |
| append | individual | 1,813,675 | 1,131,542 | 622,361 | 76.05 | 5.99 | 0.012 |
| append | batch | 1,874,531 | 182,926,829 | 169,971,671 | 5.88 | 5.99 | 0.012 |
| prepend | individual | 1,360,174 | 1,433,692 | 880,346 | 76.11 | 5.99 | 0.896 |
| prepend | batch | 1,699,043 | 2,114,985 | 1,874,649 | 5.89 | 5.99 | 0.896 |
| random.characters | individual | 876,399 | 1,008,386 | 808,124 | 82.09 | 28.31 | 0.917 |
| random.characters | batch | 1,222,668 | 1,490,017 | 1,417,234 | 22.95 | 28.31 | 0.917 |
| random.words | individual | 1,017,725 | 1,128,329 | 781,596 | 125.68 | 73.88 | 0.991 |
| random.words | batch | 1,141,900 | 1,725,129 | 1,617,076 | 59.71 | 73.88 | 0.991 |
| concurrent.characters | individual | 1,385,345 | 1,247,687 | 845,988 | 82.04 | 56.41 | 1.834 |
| concurrent.characters | batch | 1,371,225 | 1,798,831 | 1,655,401 | 22.92 | 56.41 | 1.834 |
| concurrent.words | individual | 1,272,089 | 1,302,451 | 899,780 | 125.74 | 147.81 | 1.981 |
| concurrent.words | batch | 1,373,186 | 1,645,053 | 1,535,528 | 59.79 | 147.81 | 1.981 |
| concurrent.mixed | individual | 709,685 | 945,634 | 699,341 | 154.61 | 97.82 | 1.505 |
| concurrent.mixed | batch | 910,015 | 1,190,925 | 1,182,919 | 56.88 | 97.82 | 1.505 |
| causal.characters | individual | 1,232,387 | 1,419,195 | 1,035,921 | 88.96 | 63.81 | 1.842 |
| causal.characters | batch | 1,203,925 | 1,796,273 | 1,654,009 | 23.18 | 63.81 | 1.842 |
| causal.words | individual | 1,105,471 | 1,335,544 | 877,899 | 135.13 | 156.41 | 1.989 |
| causal.words | batch | 1,222,868 | 1,612,643 | 1,479,637 | 60.68 | 156.41 | 1.989 |
| causal.mixed | individual | 719,136 | 937,544 | 693,594 | 161.05 | 103.75 | 1.509 |
| causal.mixed | batch | 853,485 | 1,244,904 | 1,137,851 | 57.34 | 103.75 | 1.509 |

## Timing dispersion

| Workload | Mode | Operation | Median ms | IQR ms |
| --- | --- | --- | ---: | ---: |
| append | individual | author | 3.308 | 2.216 |
| append | individual | apply | 5.303 | 0.402 |
| append | individual | receive | 9.641 | 3.468 |
| append | individual | encode | 7.665 | 1.557 |
| append | individual | decode | 7.429 | 0.360 |
| append | batch | author | 3.201 | 0.913 |
| append | batch | apply | 0.033 | 0.011 |
| append | batch | receive | 0.035 | 0.008 |
| append | batch | encode | 0.337 | 0.195 |
| append | batch | decode | 0.094 | 0.026 |
| prepend | individual | author | 4.411 | 0.760 |
| prepend | individual | apply | 4.185 | 0.505 |
| prepend | individual | receive | 6.816 | 1.545 |
| prepend | individual | encode | 6.612 | 2.746 |
| prepend | individual | decode | 7.247 | 2.604 |
| prepend | batch | author | 3.531 | 0.756 |
| prepend | batch | apply | 2.837 | 0.194 |
| prepend | batch | receive | 3.201 | 0.310 |
| prepend | batch | encode | 0.212 | 0.031 |
| prepend | batch | decode | 0.115 | 0.017 |
| random.characters | individual | author | 6.846 | 3.733 |
| random.characters | individual | apply | 5.950 | 0.642 |
| random.characters | individual | receive | 7.425 | 1.277 |
| random.characters | individual | encode | 5.251 | 3.221 |
| random.characters | individual | decode | 8.765 | 1.955 |
| random.characters | batch | author | 4.907 | 2.243 |
| random.characters | batch | apply | 4.027 | 1.011 |
| random.characters | batch | receive | 4.234 | 0.802 |
| random.characters | batch | encode | 0.187 | 0.124 |
| random.characters | batch | decode | 0.117 | 0.058 |
| random.words | individual | author | 5.896 | 0.636 |
| random.words | individual | apply | 5.318 | 0.267 |
| random.words | individual | receive | 7.677 | 0.936 |
| random.words | individual | encode | 4.292 | 0.776 |
| random.words | individual | decode | 7.771 | 0.758 |
| random.words | batch | author | 5.254 | 1.125 |
| random.words | batch | apply | 3.478 | 0.239 |
| random.words | batch | receive | 3.710 | 0.489 |
| random.words | batch | encode | 0.473 | 0.058 |
| random.words | batch | decode | 0.119 | 0.013 |
| concurrent.characters | individual | author | 8.662 | 1.142 |
| concurrent.characters | individual | apply | 9.618 | 0.616 |
| concurrent.characters | individual | receive | 14.185 | 3.032 |
| concurrent.characters | individual | encode | 7.890 | 0.454 |
| concurrent.characters | individual | decode | 10.350 | 0.833 |
| concurrent.characters | batch | author | 8.751 | 0.214 |
| concurrent.characters | batch | apply | 6.671 | 0.305 |
| concurrent.characters | batch | receive | 7.249 | 0.615 |
| concurrent.characters | batch | encode | 0.334 | 0.084 |
| concurrent.characters | batch | decode | 0.115 | 0.010 |
| concurrent.words | individual | author | 9.433 | 0.959 |
| concurrent.words | individual | apply | 9.213 | 0.553 |
| concurrent.words | individual | receive | 13.337 | 0.178 |
| concurrent.words | individual | encode | 8.806 | 1.275 |
| concurrent.words | individual | decode | 10.702 | 3.263 |
| concurrent.words | batch | author | 8.739 | 2.171 |
| concurrent.words | batch | apply | 7.295 | 0.857 |
| concurrent.words | batch | receive | 7.815 | 0.265 |
| concurrent.words | batch | encode | 0.786 | 0.096 |
| concurrent.words | batch | decode | 0.115 | 0.010 |
| concurrent.mixed | individual | author | 16.909 | 0.543 |
| concurrent.mixed | individual | apply | 12.690 | 0.446 |
| concurrent.mixed | individual | receive | 17.159 | 0.741 |
| concurrent.mixed | individual | encode | 8.756 | 0.116 |
| concurrent.mixed | individual | decode | 9.744 | 1.011 |
| concurrent.mixed | batch | author | 13.187 | 0.957 |
| concurrent.mixed | batch | apply | 10.076 | 0.211 |
| concurrent.mixed | batch | receive | 10.144 | 0.688 |
| concurrent.mixed | batch | encode | 0.584 | 0.054 |
| concurrent.mixed | batch | decode | 0.123 | 0.020 |
| causal.characters | individual | author | 9.737 | 1.138 |
| causal.characters | individual | apply | 8.456 | 0.415 |
| causal.characters | individual | receive | 11.584 | 1.256 |
| causal.characters | individual | encode | 7.387 | 1.001 |
| causal.characters | individual | decode | 10.735 | 2.227 |
| causal.characters | batch | author | 9.967 | 1.062 |
| causal.characters | batch | apply | 6.680 | 0.866 |
| causal.characters | batch | receive | 7.255 | 0.109 |
| causal.characters | batch | encode | 0.239 | 0.088 |
| causal.characters | batch | decode | 0.117 | 0.026 |
| causal.words | individual | author | 10.855 | 0.498 |
| causal.words | individual | apply | 8.985 | 0.418 |
| causal.words | individual | receive | 13.669 | 0.566 |
| causal.words | individual | encode | 8.934 | 0.606 |
| causal.words | individual | decode | 9.710 | 0.349 |
| causal.words | batch | author | 9.813 | 2.633 |
| causal.words | batch | apply | 7.441 | 0.675 |
| causal.words | batch | receive | 8.110 | 0.835 |
| causal.words | batch | encode | 0.646 | 0.213 |
| causal.words | batch | decode | 0.127 | 0.031 |
| causal.mixed | individual | author | 16.687 | 0.901 |
| causal.mixed | individual | apply | 12.799 | 0.459 |
| causal.mixed | individual | receive | 17.301 | 4.771 |
| causal.mixed | individual | encode | 9.583 | 0.481 |
| causal.mixed | individual | decode | 10.606 | 3.206 |
| causal.mixed | batch | author | 14.060 | 0.635 |
| causal.mixed | batch | apply | 9.639 | 0.381 |
| causal.mixed | batch | receive | 10.546 | 0.822 |
| causal.mixed | batch | encode | 0.443 | 0.046 |
| causal.mixed | batch | decode | 0.130 | 0.021 |

Measured on Node 24.16.0, V8 13.6.233.17-node.49, win32 x64, Intel(R) Core(TM) i5-10210U CPU @ 1.60GHz. Both modes group each author's binary Gossip into one MessagePack message. Batch Footage is uncompressed. Receive includes MessagePack decoding; apply excludes it. Document size follows complete acknowledgement exchange. Memory estimates use one receiver recreated from that compact checkpoint in a fresh runtime, excluding the author runtime. Preparation, verification, destruction and explicit JS process garbage collection are outside timings.
