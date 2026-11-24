# Batch benchmarks

2026-11-24T18:44:32.703Z · [CI run](https://github.com/sovereignbase/sequencer/actions/runs/45461530116)

3 runs, 6,000 edits per author. Concurrent authors edit independent views; causal authors exchange history before the second author edits. Median results.

| Workload | Mode | Author edits/s | Apply edits/s | Receive edits/s | Update/author KiB | Document KiB | Memory MiB |
| --- | --- | ---: | ---: | ---: | ---: | ---: | ---: |
| append | individual | 2,700,033 | 6,486,984 | 2,323,216 | 76.05 | 5.99 | 0.012 |
| append | batch | 5,076,340 | 1,020,581,732 | 646,970,024 | 5.88 | 5.99 | 0.012 |
| prepend | individual | 2,036,769 | 3,535,864 | 2,034,128 | 76.11 | 5.99 | 0.896 |
| prepend | batch | 2,215,252 | 4,442,210 | 4,121,004 | 5.89 | 5.99 | 0.896 |
| random.characters | individual | 1,402,357 | 2,170,863 | 1,551,267 | 82.09 | 28.31 | 0.917 |
| random.characters | batch | 1,614,614 | 2,615,707 | 2,579,533 | 22.95 | 28.31 | 0.917 |
| random.words | individual | 1,386,827 | 1,529,638 | 1,447,214 | 125.68 | 73.88 | 0.991 |
| random.words | batch | 1,530,974 | 2,510,610 | 2,324,839 | 59.71 | 73.88 | 0.991 |
| concurrent.characters | individual | 1,761,904 | 1,923,433 | 1,317,702 | 82.04 | 56.41 | 1.834 |
| concurrent.characters | batch | 1,861,447 | 2,499,126 | 2,183,390 | 22.92 | 56.41 | 1.834 |
| concurrent.words | individual | 1,756,846 | 1,883,383 | 1,275,943 | 125.74 | 147.81 | 1.981 |
| concurrent.words | batch | 1,787,911 | 2,321,452 | 2,031,196 | 59.79 | 147.81 | 1.981 |
| concurrent.mixed | individual | 1,031,830 | 1,357,642 | 1,177,493 | 154.61 | 97.83 | 1.505 |
| concurrent.mixed | batch | 1,238,917 | 1,780,860 | 1,638,659 | 56.88 | 97.82 | 1.505 |
| causal.characters | individual | 1,408,803 | 1,827,034 | 1,483,522 | 88.96 | 63.81 | 1.842 |
| causal.characters | batch | 1,537,621 | 2,437,142 | 2,111,555 | 23.18 | 63.81 | 1.842 |
| causal.words | individual | 1,444,263 | 1,966,219 | 1,182,829 | 135.13 | 156.41 | 1.989 |
| causal.words | batch | 1,540,223 | 2,260,870 | 2,046,107 | 60.68 | 156.41 | 1.989 |
| causal.mixed | individual | 940,838 | 1,326,274 | 1,136,768 | 161.05 | 103.75 | 1.509 |
| causal.mixed | batch | 1,166,120 | 1,698,096 | 1,596,488 | 57.34 | 103.75 | 1.509 |

## Timing dispersion

| Workload | Mode | Operation | Median ms | IQR ms |
| --- | --- | --- | ---: | ---: |
| append | individual | author | 2.222 | 0.276 |
| append | individual | apply | 0.925 | 2.283 |
| append | individual | receive | 2.583 | 1.420 |
| append | individual | encode | 2.813 | 1.066 |
| append | individual | decode | 4.459 | 0.786 |
| append | batch | author | 1.182 | 0.230 |
| append | batch | apply | 0.006 | 0.004 |
| append | batch | receive | 0.009 | 0.004 |
| append | batch | encode | 0.077 | 0.006 |
| append | batch | decode | 0.052 | 0.003 |
| prepend | individual | author | 2.946 | 0.181 |
| prepend | individual | apply | 1.697 | 0.280 |
| prepend | individual | receive | 2.950 | 0.948 |
| prepend | individual | encode | 3.224 | 0.156 |
| prepend | individual | decode | 3.366 | 0.576 |
| prepend | batch | author | 2.708 | 0.509 |
| prepend | batch | apply | 1.351 | 0.174 |
| prepend | batch | receive | 1.456 | 0.174 |
| prepend | batch | encode | 0.092 | 0.032 |
| prepend | batch | decode | 0.054 | 0.002 |
| random.characters | individual | author | 4.279 | 0.878 |
| random.characters | individual | apply | 2.764 | 0.565 |
| random.characters | individual | receive | 3.868 | 0.353 |
| random.characters | individual | encode | 3.089 | 1.304 |
| random.characters | individual | decode | 4.551 | 0.674 |
| random.characters | batch | author | 3.716 | 0.533 |
| random.characters | batch | apply | 2.294 | 0.312 |
| random.characters | batch | receive | 2.326 | 0.309 |
| random.characters | batch | encode | 0.083 | 0.004 |
| random.characters | batch | decode | 0.055 | 0.006 |
| random.words | individual | author | 4.326 | 0.466 |
| random.words | individual | apply | 3.922 | 1.020 |
| random.words | individual | receive | 4.146 | 0.186 |
| random.words | individual | encode | 3.055 | 0.197 |
| random.words | individual | decode | 6.234 | 1.204 |
| random.words | batch | author | 3.919 | 0.258 |
| random.words | batch | apply | 2.390 | 0.103 |
| random.words | batch | receive | 2.581 | 0.117 |
| random.words | batch | encode | 0.232 | 0.001 |
| random.words | batch | decode | 0.057 | 0.007 |
| concurrent.characters | individual | author | 6.811 | 0.299 |
| concurrent.characters | individual | apply | 6.239 | 0.650 |
| concurrent.characters | individual | receive | 9.107 | 2.340 |
| concurrent.characters | individual | encode | 5.519 | 0.349 |
| concurrent.characters | individual | decode | 7.513 | 0.867 |
| concurrent.characters | batch | author | 6.447 | 0.060 |
| concurrent.characters | batch | apply | 4.802 | 0.009 |
| concurrent.characters | batch | receive | 5.496 | 0.548 |
| concurrent.characters | batch | encode | 0.130 | 0.006 |
| concurrent.characters | batch | decode | 0.064 | 0.001 |
| concurrent.words | individual | author | 6.830 | 0.115 |
| concurrent.words | individual | apply | 6.372 | 0.218 |
| concurrent.words | individual | receive | 9.405 | 0.737 |
| concurrent.words | individual | encode | 5.245 | 0.390 |
| concurrent.words | individual | decode | 9.479 | 0.696 |
| concurrent.words | batch | author | 6.712 | 0.843 |
| concurrent.words | batch | apply | 5.169 | 0.287 |
| concurrent.words | batch | receive | 5.908 | 0.150 |
| concurrent.words | batch | encode | 0.397 | 0.022 |
| concurrent.words | batch | decode | 0.071 | 0.008 |
| concurrent.mixed | individual | author | 11.630 | 1.569 |
| concurrent.mixed | individual | apply | 8.839 | 0.057 |
| concurrent.mixed | individual | receive | 10.191 | 0.618 |
| concurrent.mixed | individual | encode | 5.705 | 0.184 |
| concurrent.mixed | individual | decode | 8.295 | 0.248 |
| concurrent.mixed | batch | author | 9.686 | 0.434 |
| concurrent.mixed | batch | apply | 6.738 | 0.062 |
| concurrent.mixed | batch | receive | 7.323 | 0.086 |
| concurrent.mixed | batch | encode | 0.291 | 0.009 |
| concurrent.mixed | batch | decode | 0.084 | 0.005 |
| causal.characters | individual | author | 8.518 | 0.509 |
| causal.characters | individual | apply | 6.568 | 0.495 |
| causal.characters | individual | receive | 8.089 | 0.959 |
| causal.characters | individual | encode | 4.418 | 0.944 |
| causal.characters | individual | decode | 8.829 | 0.242 |
| causal.characters | batch | author | 7.804 | 0.440 |
| causal.characters | batch | apply | 4.924 | 0.062 |
| causal.characters | batch | receive | 5.683 | 0.230 |
| causal.characters | batch | encode | 0.109 | 0.005 |
| causal.characters | batch | decode | 0.070 | 0.001 |
| causal.words | individual | author | 8.309 | 0.384 |
| causal.words | individual | apply | 6.103 | 0.027 |
| causal.words | individual | receive | 10.145 | 0.031 |
| causal.words | individual | encode | 5.410 | 0.406 |
| causal.words | individual | decode | 9.330 | 0.578 |
| causal.words | batch | author | 7.791 | 0.032 |
| causal.words | batch | apply | 5.308 | 0.028 |
| causal.words | batch | receive | 5.865 | 0.040 |
| causal.words | batch | encode | 0.324 | 0.013 |
| causal.words | batch | decode | 0.076 | 0.001 |
| causal.mixed | individual | author | 12.755 | 0.363 |
| causal.mixed | individual | apply | 9.048 | 0.448 |
| causal.mixed | individual | receive | 10.556 | 0.300 |
| causal.mixed | individual | encode | 5.927 | 1.068 |
| causal.mixed | individual | decode | 8.223 | 0.629 |
| causal.mixed | batch | author | 10.291 | 0.186 |
| causal.mixed | batch | apply | 7.067 | 0.111 |
| causal.mixed | batch | receive | 7.516 | 0.128 |
| causal.mixed | batch | encode | 0.252 | 0.005 |
| causal.mixed | batch | decode | 0.074 | 0.006 |

Measured on Node 24.22.3, V8 13.6.233.17-node.63, linux x64, AMD EPYC 9V74 80-Core Processor. Both modes group each author's binary Gossip into one MessagePack message. Batch Footage is uncompressed. Receive includes MessagePack decoding; apply excludes it. Document size follows complete acknowledgement exchange. Memory estimates use one receiver recreated from that compact checkpoint in a fresh runtime, excluding the author runtime. Preparation, verification, destruction and explicit JS process garbage collection are outside timings.
