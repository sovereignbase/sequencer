# Batch benchmarks

2026-11-24T12:49:00.874Z · [CI run](https://github.com/sovereignbase/sequencer/actions/runs/45395972158)

3 runs, 6,000 edits per author. Concurrent authors edit independent views; causal authors exchange history before the second author edits. Median results.

| Workload | Mode | Author edits/s | Apply edits/s | Receive edits/s | Update/author KiB | Document KiB | Memory MiB |
| --- | --- | ---: | ---: | ---: | ---: | ---: | ---: |
| append | individual | 3,140,023 | 7,000,268 | 2,833,594 | 76.05 | 5.99 | 0.012 |
| append | batch | 3,656,771 | 722,282,412 | 653,452,407 | 5.88 | 5.99 | 0.012 |
| prepend | individual | 2,553,860 | 3,205,176 | 1,734,661 | 76.11 | 5.99 | 0.942 |
| prepend | batch | 2,846,112 | 5,328,436 | 4,866,369 | 5.89 | 5.99 | 0.942 |
| random.characters | individual | 1,694,587 | 2,135,335 | 1,508,884 | 82.09 | 28.31 | 0.963 |
| random.characters | batch | 1,753,250 | 3,069,129 | 2,943,640 | 22.95 | 28.31 | 0.963 |
| random.words | individual | 1,672,417 | 1,790,042 | 1,583,830 | 125.68 | 73.88 | 1.036 |
| random.words | batch | 1,819,723 | 2,850,000 | 2,629,578 | 59.71 | 73.88 | 1.036 |
| concurrent.characters | individual | 2,091,259 | 2,376,454 | 1,431,581 | 82.04 | 56.41 | 1.926 |
| concurrent.characters | batch | 1,860,782 | 2,713,684 | 2,588,613 | 22.92 | 56.41 | 1.926 |
| concurrent.words | individual | 2,018,795 | 2,290,486 | 1,318,839 | 125.74 | 147.81 | 2.073 |
| concurrent.words | batch | 2,139,035 | 2,594,215 | 2,357,279 | 59.79 | 147.81 | 2.073 |
| concurrent.mixed | individual | 1,231,562 | 1,400,546 | 1,191,740 | 154.61 | 97.83 | 1.573 |
| concurrent.mixed | batch | 1,534,096 | 1,871,013 | 1,689,501 | 56.88 | 97.82 | 1.573 |
| causal.characters | individual | 1,788,977 | 2,016,944 | 1,675,961 | 88.96 | 63.81 | 1.933 |
| causal.characters | batch | 1,674,968 | 2,745,853 | 2,482,753 | 23.18 | 63.81 | 1.933 |
| causal.words | individual | 1,754,488 | 2,171,273 | 1,481,982 | 135.13 | 156.41 | 2.081 |
| causal.words | batch | 1,703,196 | 2,502,377 | 2,200,346 | 60.68 | 156.41 | 2.081 |
| causal.mixed | individual | 1,132,533 | 1,333,633 | 1,189,285 | 161.05 | 103.75 | 1.576 |
| causal.mixed | batch | 1,293,392 | 1,793,854 | 1,650,436 | 57.34 | 103.75 | 1.576 |

## Timing dispersion

| Workload | Mode | Operation | Median ms | IQR ms |
| --- | --- | --- | ---: | ---: |
| append | individual | author | 1.911 | 0.137 |
| append | individual | apply | 0.857 | 1.303 |
| append | individual | receive | 2.117 | 2.864 |
| append | individual | encode | 3.308 | 0.390 |
| append | individual | decode | 4.778 | 0.707 |
| append | batch | author | 1.641 | 0.389 |
| append | batch | apply | 0.008 | 0.005 |
| append | batch | receive | 0.009 | 0.004 |
| append | batch | encode | 0.091 | 0.027 |
| append | batch | decode | 0.051 | 0.003 |
| prepend | individual | author | 2.349 | 0.173 |
| prepend | individual | apply | 1.872 | 0.341 |
| prepend | individual | receive | 3.459 | 0.589 |
| prepend | individual | encode | 3.095 | 0.262 |
| prepend | individual | decode | 3.898 | 0.822 |
| prepend | batch | author | 2.108 | 0.093 |
| prepend | batch | apply | 1.126 | 0.131 |
| prepend | batch | receive | 1.233 | 0.159 |
| prepend | batch | encode | 0.095 | 0.005 |
| prepend | batch | decode | 0.054 | 0.002 |
| random.characters | individual | author | 3.541 | 0.190 |
| random.characters | individual | apply | 2.810 | 0.458 |
| random.characters | individual | receive | 3.976 | 0.460 |
| random.characters | individual | encode | 3.058 | 0.232 |
| random.characters | individual | decode | 4.674 | 0.866 |
| random.characters | batch | author | 3.422 | 0.078 |
| random.characters | batch | apply | 1.955 | 0.170 |
| random.characters | batch | receive | 2.038 | 0.165 |
| random.characters | batch | encode | 0.090 | 0.003 |
| random.characters | batch | decode | 0.054 | 0.001 |
| random.words | individual | author | 3.588 | 0.238 |
| random.words | individual | apply | 3.352 | 0.791 |
| random.words | individual | receive | 3.788 | 0.465 |
| random.words | individual | encode | 2.521 | 0.386 |
| random.words | individual | decode | 4.920 | 0.585 |
| random.words | batch | author | 3.297 | 0.066 |
| random.words | batch | apply | 2.105 | 0.031 |
| random.words | batch | receive | 2.282 | 0.065 |
| random.words | batch | encode | 0.225 | 0.017 |
| random.words | batch | decode | 0.057 | 0.003 |
| concurrent.characters | individual | author | 5.738 | 0.243 |
| concurrent.characters | individual | apply | 5.050 | 0.784 |
| concurrent.characters | individual | receive | 8.382 | 0.239 |
| concurrent.characters | individual | encode | 4.861 | 0.242 |
| concurrent.characters | individual | decode | 7.016 | 0.635 |
| concurrent.characters | batch | author | 6.449 | 0.386 |
| concurrent.characters | batch | apply | 4.422 | 0.109 |
| concurrent.characters | batch | receive | 4.636 | 0.091 |
| concurrent.characters | batch | encode | 0.145 | 0.005 |
| concurrent.characters | batch | decode | 0.061 | 0.001 |
| concurrent.words | individual | author | 5.944 | 0.295 |
| concurrent.words | individual | apply | 5.239 | 0.104 |
| concurrent.words | individual | receive | 9.099 | 0.625 |
| concurrent.words | individual | encode | 5.123 | 0.170 |
| concurrent.words | individual | decode | 7.452 | 0.223 |
| concurrent.words | batch | author | 5.610 | 0.119 |
| concurrent.words | batch | apply | 4.626 | 0.073 |
| concurrent.words | batch | receive | 5.091 | 0.124 |
| concurrent.words | batch | encode | 0.423 | 0.028 |
| concurrent.words | batch | decode | 0.071 | 0.009 |
| concurrent.mixed | individual | author | 9.744 | 0.576 |
| concurrent.mixed | individual | apply | 8.568 | 0.385 |
| concurrent.mixed | individual | receive | 10.069 | 0.227 |
| concurrent.mixed | individual | encode | 5.788 | 0.290 |
| concurrent.mixed | individual | decode | 7.156 | 0.631 |
| concurrent.mixed | batch | author | 7.822 | 0.623 |
| concurrent.mixed | batch | apply | 6.414 | 0.054 |
| concurrent.mixed | batch | receive | 7.103 | 0.099 |
| concurrent.mixed | batch | encode | 0.341 | 0.022 |
| concurrent.mixed | batch | decode | 0.069 | 0.013 |
| causal.characters | individual | author | 6.708 | 0.593 |
| causal.characters | individual | apply | 5.950 | 0.466 |
| causal.characters | individual | receive | 7.160 | 0.250 |
| causal.characters | individual | encode | 4.159 | 0.280 |
| causal.characters | individual | decode | 8.354 | 0.721 |
| causal.characters | batch | author | 7.164 | 0.558 |
| causal.characters | batch | apply | 4.370 | 0.021 |
| causal.characters | batch | receive | 4.833 | 0.042 |
| causal.characters | batch | encode | 0.118 | 0.003 |
| causal.characters | batch | decode | 0.061 | 0.012 |
| causal.words | individual | author | 6.840 | 0.427 |
| causal.words | individual | apply | 5.527 | 0.496 |
| causal.words | individual | receive | 8.097 | 0.754 |
| causal.words | individual | encode | 4.497 | 0.551 |
| causal.words | individual | decode | 9.291 | 0.303 |
| causal.words | batch | author | 7.046 | 0.179 |
| causal.words | batch | apply | 4.795 | 0.054 |
| causal.words | batch | receive | 5.454 | 0.133 |
| causal.words | batch | encode | 0.317 | 0.013 |
| causal.words | batch | decode | 0.074 | 0.012 |
| causal.mixed | individual | author | 10.596 | 0.345 |
| causal.mixed | individual | apply | 8.998 | 0.078 |
| causal.mixed | individual | receive | 10.090 | 0.796 |
| causal.mixed | individual | encode | 5.891 | 0.576 |
| causal.mixed | individual | decode | 7.802 | 0.201 |
| causal.mixed | batch | author | 9.278 | 0.425 |
| causal.mixed | batch | apply | 6.690 | 0.019 |
| causal.mixed | batch | receive | 7.271 | 0.117 |
| causal.mixed | batch | encode | 0.240 | 0.004 |
| causal.mixed | batch | decode | 0.064 | 0.008 |

Measured on Node 24.22.3, V8 13.6.233.17-node.63, linux x64, Intel(R) Xeon(R) 6975P-C. Both modes group each author's binary Gossip into one MessagePack message. Batch Footage is uncompressed. Receive includes MessagePack decoding; apply excludes it. Document size follows complete acknowledgement exchange. Memory estimates use one receiver recreated from that compact checkpoint in a fresh runtime, excluding the author runtime. Preparation, verification, destruction and explicit JS process garbage collection are outside timings.
