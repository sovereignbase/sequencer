# Batch benchmarks

2026-11-24T12:57:36.764Z · [CI run](https://github.com/sovereignbase/sequencer/actions/runs/45397524890)

3 runs, 6,000 edits per author. Concurrent authors edit independent views; causal authors exchange history before the second author edits. Median results.

| Workload | Mode | Author edits/s | Apply edits/s | Receive edits/s | Update/author KiB | Document KiB | Memory MiB |
| --- | --- | ---: | ---: | ---: | ---: | ---: | ---: |
| append | individual | 3,260,753 | 6,030,902 | 2,435,853 | 76.05 | 5.99 | 0.012 |
| append | batch | 4,824,780 | 487,844,540 | 525,532,101 | 5.88 | 5.99 | 0.012 |
| prepend | individual | 2,718,984 | 5,240,440 | 2,340,126 | 76.11 | 5.99 | 0.942 |
| prepend | batch | 3,668,742 | 5,182,287 | 4,998,775 | 5.89 | 5.99 | 0.942 |
| random.characters | individual | 1,740,851 | 3,093,268 | 1,942,532 | 82.09 | 28.31 | 0.963 |
| random.characters | batch | 1,933,079 | 3,232,793 | 3,372,425 | 22.95 | 28.31 | 0.963 |
| random.words | individual | 2,065,129 | 2,307,116 | 1,881,406 | 125.68 | 73.88 | 1.036 |
| random.words | batch | 2,111,708 | 3,462,412 | 3,214,838 | 59.71 | 73.88 | 1.036 |
| concurrent.characters | individual | 2,200,883 | 2,545,232 | 1,836,867 | 82.04 | 56.41 | 1.926 |
| concurrent.characters | batch | 2,245,680 | 3,438,546 | 3,158,467 | 22.92 | 56.41 | 1.926 |
| concurrent.words | individual | 2,264,451 | 2,474,640 | 2,069,909 | 125.74 | 147.81 | 2.073 |
| concurrent.words | batch | 2,265,835 | 3,230,745 | 2,958,012 | 59.79 | 147.81 | 2.073 |
| concurrent.mixed | individual | 1,300,062 | 1,711,010 | 1,260,214 | 154.61 | 97.83 | 1.573 |
| concurrent.mixed | batch | 1,609,138 | 2,299,845 | 2,068,998 | 56.88 | 97.82 | 1.573 |
| causal.characters | individual | 2,140,863 | 2,890,974 | 1,805,708 | 88.96 | 63.81 | 1.933 |
| causal.characters | batch | 2,152,683 | 3,453,861 | 2,987,432 | 23.18 | 63.81 | 1.933 |
| causal.words | individual | 2,021,651 | 2,659,797 | 1,652,841 | 135.13 | 156.41 | 2.081 |
| causal.words | batch | 2,459,548 | 3,182,966 | 2,724,684 | 60.68 | 156.41 | 2.081 |
| causal.mixed | individual | 1,259,918 | 1,453,137 | 1,517,574 | 161.05 | 103.75 | 1.576 |
| causal.mixed | batch | 1,612,772 | 2,253,184 | 2,050,259 | 57.34 | 103.75 | 1.576 |

## Timing dispersion

| Workload | Mode | Operation | Median ms | IQR ms |
| --- | --- | --- | ---: | ---: |
| append | individual | author | 1.840 | 0.076 |
| append | individual | apply | 0.995 | 0.792 |
| append | individual | receive | 2.463 | 1.474 |
| append | individual | encode | 2.704 | 0.665 |
| append | individual | decode | 3.271 | 0.473 |
| append | batch | author | 1.244 | 0.245 |
| append | batch | apply | 0.012 | 0.002 |
| append | batch | receive | 0.011 | 0.002 |
| append | batch | encode | 0.101 | 0.025 |
| append | batch | decode | 0.070 | 0.016 |
| prepend | individual | author | 2.207 | 0.126 |
| prepend | individual | apply | 1.145 | 0.696 |
| prepend | individual | receive | 2.564 | 0.613 |
| prepend | individual | encode | 2.489 | 0.223 |
| prepend | individual | decode | 3.622 | 0.131 |
| prepend | batch | author | 1.635 | 0.194 |
| prepend | batch | apply | 1.158 | 0.196 |
| prepend | batch | receive | 1.200 | 0.690 |
| prepend | batch | encode | 0.084 | 0.016 |
| prepend | batch | decode | 0.054 | 0.010 |
| random.characters | individual | author | 3.447 | 0.287 |
| random.characters | individual | apply | 1.940 | 0.383 |
| random.characters | individual | receive | 3.089 | 0.688 |
| random.characters | individual | encode | 2.606 | 0.078 |
| random.characters | individual | decode | 4.289 | 0.763 |
| random.characters | batch | author | 3.104 | 0.271 |
| random.characters | batch | apply | 1.856 | 0.182 |
| random.characters | batch | receive | 1.779 | 0.121 |
| random.characters | batch | encode | 0.098 | 0.012 |
| random.characters | batch | decode | 0.056 | 0.011 |
| random.words | individual | author | 2.905 | 0.340 |
| random.words | individual | apply | 2.601 | 0.717 |
| random.words | individual | receive | 3.189 | 0.641 |
| random.words | individual | encode | 2.014 | 0.303 |
| random.words | individual | decode | 4.727 | 0.920 |
| random.words | batch | author | 2.841 | 0.340 |
| random.words | batch | apply | 1.733 | 0.057 |
| random.words | batch | receive | 1.866 | 0.072 |
| random.words | batch | encode | 0.172 | 0.005 |
| random.words | batch | decode | 0.057 | 0.002 |
| concurrent.characters | individual | author | 5.452 | 0.613 |
| concurrent.characters | individual | apply | 4.715 | 0.383 |
| concurrent.characters | individual | receive | 6.533 | 1.592 |
| concurrent.characters | individual | encode | 3.804 | 0.164 |
| concurrent.characters | individual | decode | 6.889 | 0.518 |
| concurrent.characters | batch | author | 5.344 | 0.563 |
| concurrent.characters | batch | apply | 3.490 | 0.029 |
| concurrent.characters | batch | receive | 3.799 | 0.087 |
| concurrent.characters | batch | encode | 0.128 | 0.009 |
| concurrent.characters | batch | decode | 0.061 | 0.002 |
| concurrent.words | individual | author | 5.299 | 0.285 |
| concurrent.words | individual | apply | 4.849 | 0.141 |
| concurrent.words | individual | receive | 5.797 | 0.728 |
| concurrent.words | individual | encode | 4.282 | 0.279 |
| concurrent.words | individual | decode | 7.452 | 0.780 |
| concurrent.words | batch | author | 5.296 | 0.425 |
| concurrent.words | batch | apply | 3.714 | 0.009 |
| concurrent.words | batch | receive | 4.057 | 0.075 |
| concurrent.words | batch | encode | 0.319 | 0.008 |
| concurrent.words | batch | decode | 0.065 | 0.001 |
| concurrent.mixed | individual | author | 9.230 | 0.442 |
| concurrent.mixed | individual | apply | 7.013 | 0.065 |
| concurrent.mixed | individual | receive | 9.522 | 0.981 |
| concurrent.mixed | individual | encode | 5.560 | 0.395 |
| concurrent.mixed | individual | decode | 6.041 | 0.120 |
| concurrent.mixed | batch | author | 7.457 | 0.116 |
| concurrent.mixed | batch | apply | 5.218 | 0.179 |
| concurrent.mixed | batch | receive | 5.800 | 0.214 |
| concurrent.mixed | batch | encode | 0.267 | 0.017 |
| concurrent.mixed | batch | decode | 0.072 | 0.004 |
| causal.characters | individual | author | 5.605 | 0.097 |
| causal.characters | individual | apply | 4.151 | 0.058 |
| causal.characters | individual | receive | 6.646 | 0.065 |
| causal.characters | individual | encode | 3.507 | 0.524 |
| causal.characters | individual | decode | 6.949 | 0.598 |
| causal.characters | batch | author | 5.574 | 0.555 |
| causal.characters | batch | apply | 3.474 | 0.051 |
| causal.characters | batch | receive | 4.017 | 0.126 |
| causal.characters | batch | encode | 0.107 | 0.012 |
| causal.characters | batch | decode | 0.065 | 0.005 |
| causal.words | individual | author | 5.936 | 0.123 |
| causal.words | individual | apply | 4.512 | 0.131 |
| causal.words | individual | receive | 7.260 | 0.701 |
| causal.words | individual | encode | 4.138 | 0.606 |
| causal.words | individual | decode | 7.192 | 0.688 |
| causal.words | batch | author | 4.879 | 0.616 |
| causal.words | batch | apply | 3.770 | 0.124 |
| causal.words | batch | receive | 4.404 | 0.101 |
| causal.words | batch | encode | 0.261 | 0.017 |
| causal.words | batch | decode | 0.075 | 0.009 |
| causal.mixed | individual | author | 9.524 | 0.894 |
| causal.mixed | individual | apply | 8.258 | 0.468 |
| causal.mixed | individual | receive | 7.907 | 1.328 |
| causal.mixed | individual | encode | 5.316 | 0.479 |
| causal.mixed | individual | decode | 6.666 | 0.760 |
| causal.mixed | batch | author | 7.441 | 0.607 |
| causal.mixed | batch | apply | 5.326 | 0.066 |
| causal.mixed | batch | receive | 5.853 | 0.162 |
| causal.mixed | batch | encode | 0.213 | 0.013 |
| causal.mixed | batch | decode | 0.077 | 0.007 |

Measured on Node 24.22.3, V8 13.6.233.17-node.63, linux x64, AMD EPYC 9V45 96-Core Processor. Both modes group each author's binary Gossip into one MessagePack message. Batch Footage is uncompressed. Receive includes MessagePack decoding; apply excludes it. Document size follows complete acknowledgement exchange. Memory estimates use one receiver recreated from that compact checkpoint in a fresh runtime, excluding the author runtime. Preparation, verification, destruction and explicit JS process garbage collection are outside timings.
