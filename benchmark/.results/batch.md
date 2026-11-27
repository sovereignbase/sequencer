# Batch benchmarks

2026-11-27T16:51:07.064Z · [CI run](https://github.com/sovereignbase/sequencer/actions/runs/46035866481)

3 runs, 6,000 edits per author. Concurrent authors edit independent views; causal authors exchange history before the second author edits. Median results.

| Workload | Mode | Author edits/s | Apply edits/s | Receive edits/s | Update/author KiB | Document KiB | Memory MiB |
| --- | --- | ---: | ---: | ---: | ---: | ---: | ---: |
| append | individual | 1,938,714 | 4,816,121 | 1,818,413 | 76.05 | 5.99 | 0.012 |
| append | batch | 2,257,455 | 487,092,060 | 333,425,952 | 5.88 | 5.99 | 0.012 |
| prepend | individual | 1,778,568 | 3,106,458 | 1,527,553 | 76.11 | 5.99 | 0.896 |
| prepend | batch | 1,971,729 | 3,756,781 | 3,464,587 | 5.89 | 5.99 | 0.896 |
| random.characters | individual | 1,190,552 | 1,896,172 | 1,295,558 | 82.09 | 28.31 | 0.917 |
| random.characters | batch | 1,265,037 | 2,298,799 | 2,190,150 | 22.95 | 28.31 | 0.917 |
| random.words | individual | 1,230,182 | 1,545,879 | 1,153,200 | 125.68 | 73.88 | 0.991 |
| random.words | batch | 967,254 | 2,096,587 | 1,973,253 | 59.71 | 73.88 | 0.991 |
| concurrent.characters | individual | 1,444,922 | 1,626,457 | 1,096,166 | 82.04 | 56.41 | 1.834 |
| concurrent.characters | batch | 1,490,678 | 2,121,273 | 1,794,458 | 22.92 | 56.41 | 1.834 |
| concurrent.words | individual | 1,507,273 | 1,658,851 | 1,100,499 | 125.74 | 147.81 | 1.981 |
| concurrent.words | batch | 1,520,206 | 1,946,921 | 1,650,004 | 59.79 | 147.81 | 1.981 |
| concurrent.mixed | individual | 853,209 | 1,112,234 | 729,889 | 154.61 | 97.83 | 1.505 |
| concurrent.mixed | batch | 1,128,419 | 1,421,151 | 1,226,919 | 56.88 | 97.82 | 1.505 |
| causal.characters | individual | 1,105,432 | 1,477,668 | 1,181,583 | 88.96 | 63.81 | 1.842 |
| causal.characters | batch | 1,362,183 | 2,068,774 | 1,696,790 | 23.18 | 63.81 | 1.842 |
| causal.words | individual | 1,162,543 | 1,568,432 | 1,075,918 | 135.13 | 156.41 | 1.989 |
| causal.words | batch | 1,199,970 | 1,871,404 | 1,620,361 | 60.68 | 156.41 | 1.989 |
| causal.mixed | individual | 785,937 | 1,071,013 | 868,736 | 161.05 | 103.75 | 1.509 |
| causal.mixed | batch | 1,004,852 | 1,337,839 | 1,202,090 | 57.34 | 103.75 | 1.509 |

## Timing dispersion

| Workload | Mode | Operation | Median ms | IQR ms |
| --- | --- | --- | ---: | ---: |
| append | individual | author | 3.095 | 0.244 |
| append | individual | apply | 1.246 | 2.172 |
| append | individual | receive | 3.300 | 4.524 |
| append | individual | encode | 5.234 | 0.922 |
| append | individual | decode | 7.304 | 1.701 |
| append | batch | author | 2.658 | 0.614 |
| append | batch | apply | 0.012 | 0.009 |
| append | batch | receive | 0.018 | 0.010 |
| append | batch | encode | 0.169 | 0.028 |
| append | batch | decode | 0.097 | 0.020 |
| prepend | individual | author | 3.373 | 0.713 |
| prepend | individual | apply | 1.931 | 1.295 |
| prepend | individual | receive | 3.928 | 1.273 |
| prepend | individual | encode | 4.724 | 0.518 |
| prepend | individual | decode | 5.281 | 1.063 |
| prepend | batch | author | 3.043 | 0.663 |
| prepend | batch | apply | 1.597 | 0.209 |
| prepend | batch | receive | 1.732 | 0.243 |
| prepend | batch | encode | 0.149 | 0.009 |
| prepend | batch | decode | 0.073 | 0.001 |
| random.characters | individual | author | 5.040 | 0.111 |
| random.characters | individual | apply | 3.164 | 0.435 |
| random.characters | individual | receive | 4.631 | 0.875 |
| random.characters | individual | encode | 4.185 | 0.284 |
| random.characters | individual | decode | 6.557 | 0.759 |
| random.characters | batch | author | 4.743 | 0.090 |
| random.characters | batch | apply | 2.610 | 0.286 |
| random.characters | batch | receive | 2.740 | 0.238 |
| random.characters | batch | encode | 0.138 | 0.001 |
| random.characters | batch | decode | 0.072 | 0.002 |
| random.words | individual | author | 4.877 | 0.458 |
| random.words | individual | apply | 3.881 | 0.812 |
| random.words | individual | receive | 5.203 | 0.577 |
| random.words | individual | encode | 4.056 | 0.273 |
| random.words | individual | decode | 7.202 | 1.165 |
| random.words | batch | author | 6.203 | 0.855 |
| random.words | batch | apply | 2.862 | 0.027 |
| random.words | batch | receive | 3.041 | 0.038 |
| random.words | batch | encode | 0.348 | 0.026 |
| random.words | batch | decode | 0.082 | 0.005 |
| concurrent.characters | individual | author | 8.305 | 0.715 |
| concurrent.characters | individual | apply | 7.378 | 0.357 |
| concurrent.characters | individual | receive | 10.947 | 1.159 |
| concurrent.characters | individual | encode | 6.582 | 0.614 |
| concurrent.characters | individual | decode | 10.487 | 2.157 |
| concurrent.characters | batch | author | 8.050 | 0.758 |
| concurrent.characters | batch | apply | 5.657 | 0.095 |
| concurrent.characters | batch | receive | 6.687 | 0.044 |
| concurrent.characters | batch | encode | 0.236 | 0.002 |
| concurrent.characters | batch | decode | 0.088 | 0.007 |
| concurrent.words | individual | author | 7.961 | 0.680 |
| concurrent.words | individual | apply | 7.234 | 0.159 |
| concurrent.words | individual | receive | 10.904 | 0.283 |
| concurrent.words | individual | encode | 6.378 | 0.401 |
| concurrent.words | individual | decode | 12.430 | 0.601 |
| concurrent.words | batch | author | 7.894 | 0.575 |
| concurrent.words | batch | apply | 6.164 | 0.092 |
| concurrent.words | batch | receive | 7.273 | 0.122 |
| concurrent.words | batch | encode | 0.654 | 0.011 |
| concurrent.words | batch | decode | 0.097 | 0.003 |
| concurrent.mixed | individual | author | 14.065 | 1.823 |
| concurrent.mixed | individual | apply | 10.789 | 0.481 |
| concurrent.mixed | individual | receive | 16.441 | 1.592 |
| concurrent.mixed | individual | encode | 7.921 | 0.685 |
| concurrent.mixed | individual | decode | 10.395 | 1.348 |
| concurrent.mixed | batch | author | 10.634 | 1.408 |
| concurrent.mixed | batch | apply | 8.444 | 0.114 |
| concurrent.mixed | batch | receive | 9.781 | 0.066 |
| concurrent.mixed | batch | encode | 0.474 | 0.038 |
| concurrent.mixed | batch | decode | 0.099 | 0.006 |
| causal.characters | individual | author | 10.855 | 0.901 |
| causal.characters | individual | apply | 8.121 | 0.605 |
| causal.characters | individual | receive | 10.156 | 0.329 |
| causal.characters | individual | encode | 6.063 | 0.168 |
| causal.characters | individual | decode | 12.693 | 0.875 |
| causal.characters | batch | author | 8.809 | 0.105 |
| causal.characters | batch | apply | 5.801 | 0.025 |
| causal.characters | batch | receive | 7.072 | 0.063 |
| causal.characters | batch | encode | 0.180 | 0.002 |
| causal.characters | batch | decode | 0.092 | 0.002 |
| causal.words | individual | author | 10.322 | 0.156 |
| causal.words | individual | apply | 7.651 | 0.137 |
| causal.words | individual | receive | 11.153 | 0.134 |
| causal.words | individual | encode | 7.707 | 0.688 |
| causal.words | individual | decode | 11.743 | 0.586 |
| causal.words | batch | author | 10.000 | 0.730 |
| causal.words | batch | apply | 6.412 | 0.037 |
| causal.words | batch | receive | 7.406 | 0.014 |
| causal.words | batch | encode | 0.479 | 0.007 |
| causal.words | batch | decode | 0.101 | 0.001 |
| causal.mixed | individual | author | 15.268 | 0.197 |
| causal.mixed | individual | apply | 11.204 | 0.511 |
| causal.mixed | individual | receive | 13.813 | 1.545 |
| causal.mixed | individual | encode | 9.261 | 0.307 |
| causal.mixed | individual | decode | 10.497 | 0.447 |
| causal.mixed | batch | author | 11.942 | 1.032 |
| causal.mixed | batch | apply | 8.970 | 0.074 |
| causal.mixed | batch | receive | 9.983 | 0.123 |
| causal.mixed | batch | encode | 0.372 | 0.013 |
| causal.mixed | batch | decode | 0.099 | 0.002 |

Measured on Node 24.22.3, V8 13.6.233.17-node.63, linux x64, INTEL(R) XEON(R) PLATINUM 8573C. Both modes group each author's binary Gossip into one MessagePack message. Batch Footage is uncompressed. Receive includes MessagePack decoding; apply excludes it. Document size follows complete acknowledgement exchange. Memory estimates use one receiver recreated from that compact checkpoint in a fresh runtime, excluding the author runtime. Preparation, verification, destruction and explicit JS process garbage collection are outside timings.
