# Public API comparison — 0.0.1 and the 0.0.2 checkpoint

Two opposing-order process pairs, three runs per process: six runs per variant.
Each throughput fixture uses 2,048 warmup calls, up to 8,192 measured calls,
and a disabled time cutoff. Initial workload sizes are 100, 1,000 and 10,000.
Session entropy is fixed by `../sequence_indices/seed.mjs`; the workload seed
is `sequencer-lifecycle-v1`. This is a warmed diagnostic, not the default 100 ms benchmark.

Values below are median latency in µs. IQR is the width of the interquartile
range across independent run means, not a confidence interval or per-call dispersion.
Negative changes mean lower latency. Of 161 rows with actual calls, 157 improved;
four lifecycle rows without calls are omitted. Remaining regressions are included.

Environment: Node 24.16.0, V8 13.6.233.17-node.49, Windows x64, Intel Core i5-10210U.
Production build: Emscripten 5.0.7, C++23 Release, O3, LTO, SIMD and bulk memory.

## Lifecycle

| Phase or initial size | Operation | 0.0.1 µs | 0.0.1 IQR µs | 0.0.2 µs | 0.0.2 IQR µs | Change |
| --- | --- | ---: | ---: | ---: | ---: | ---: |
| scaleUp | `apply.random` | 66.239 | 25.134 | 38.520 | 5.228 | -41.8% |
| scaleUp | `create` | 1920.820 | 666.360 | 1173.460 | 490.240 | -38.9% |
| scaleUp | `insert.head` | 2.427 | 0.869 | 1.636 | 0.304 | -32.6% |
| scaleUp | `insert.random` | 24.307 | 6.987 | 14.808 | 1.807 | -39.1% |
| scaleUp | `insert.tail` | 2.103 | 0.738 | 1.302 | 0.214 | -38.1% |
| scaleUp | `remove.random` | 35.506 | 11.856 | 21.502 | 3.087 | -39.4% |
| scaleUp | `replace.head` | 7.067 | 4.116 | 4.778 | 1.534 | -32.4% |
| scaleUp | `replace.random` | 35.344 | 12.419 | 21.912 | 2.510 | -38.0% |
| scaleUp | `replace.tail` | 6.572 | 2.674 | 4.404 | 2.374 | -33.0% |
| scaleUp | `sequence` | 16925.080 | 6645.420 | 10716.820 | 1257.860 | -36.7% |
| scaleUp | `value.head` | 0.989 | 0.456 | 0.542 | 0.131 | -45.2% |
| scaleUp | `value.random` | 30.837 | 9.847 | 17.668 | 1.675 | -42.7% |
| scaleUp | `value.tail` | 0.648 | 0.237 | 0.426 | 0.051 | -34.3% |
| scaleUp | `values` | 5800.980 | 2764.420 | 4220.020 | 1728.600 | -27.3% |
| scaleDown | `apply.random` | 110.109 | 12.477 | 62.613 | 8.254 | -43.1% |
| scaleDown | `create` | 228.260 | 39.100 | 176.640 | 18.980 | -22.6% |
| scaleDown | `insert.random` | 37.951 | 2.687 | 24.724 | 4.148 | -34.9% |
| scaleDown | `remove.head` | 10.785 | 3.860 | 4.753 | 0.832 | -55.9% |
| scaleDown | `remove.random` | 52.330 | 7.045 | 31.981 | 4.756 | -38.9% |
| scaleDown | `remove.tail` | 8.451 | 1.657 | 5.074 | 1.374 | -40.0% |
| scaleDown | `replace.head` | 11.613 | 2.400 | 6.296 | 0.777 | -45.8% |
| scaleDown | `replace.random` | 53.234 | 7.389 | 33.228 | 6.568 | -37.6% |
| scaleDown | `replace.tail` | 9.396 | 1.731 | 6.701 | 2.317 | -28.7% |
| scaleDown | `sequence` | 94956.660 | 35001.160 | 66558.780 | 6979.780 | -29.9% |
| scaleDown | `value.head` | 1.610 | 0.527 | 0.938 | 0.084 | -41.7% |
| scaleDown | `value.random` | 42.927 | 3.753 | 27.799 | 4.790 | -35.2% |
| scaleDown | `value.tail` | 1.148 | 0.373 | 0.750 | 0.062 | -34.6% |
| scaleDown | `values` | 1217.500 | 206.120 | 1063.420 | 60.740 | -12.7% |
| fullLifecycle | `apply.random` | 86.196 | 20.046 | 50.566 | 7.486 | -41.3% |
| fullLifecycle | `create` | 1066.710 | 336.050 | 680.350 | 245.770 | -36.2% |
| fullLifecycle | `insert.head` | 2.427 | 0.869 | 1.636 | 0.304 | -32.6% |
| fullLifecycle | `insert.random` | 30.250 | 5.276 | 19.426 | 3.048 | -35.8% |
| fullLifecycle | `insert.tail` | 2.103 | 0.738 | 1.302 | 0.214 | -38.1% |
| fullLifecycle | `remove.head` | 10.785 | 3.860 | 4.753 | 0.832 | -55.9% |
| fullLifecycle | `remove.random` | 42.045 | 7.555 | 26.485 | 4.254 | -37.0% |
| fullLifecycle | `remove.tail` | 8.451 | 1.657 | 5.074 | 1.374 | -40.0% |
| fullLifecycle | `replace.head` | 9.535 | 3.076 | 5.738 | 0.878 | -39.8% |
| fullLifecycle | `replace.random` | 44.869 | 9.435 | 27.570 | 4.257 | -38.6% |
| fullLifecycle | `replace.tail` | 7.984 | 3.061 | 6.025 | 1.526 | -24.5% |
| fullLifecycle | `sequence` | 57899.890 | 17214.830 | 38637.800 | 4501.610 | -33.3% |
| fullLifecycle | `value.head` | 1.373 | 0.402 | 0.715 | 0.096 | -47.9% |
| fullLifecycle | `value.random` | 35.612 | 5.957 | 21.932 | 3.233 | -38.4% |
| fullLifecycle | `value.tail` | 0.973 | 0.319 | 0.588 | 0.051 | -39.5% |
| fullLifecycle | `values` | 3444.410 | 1474.320 | 2641.720 | 858.170 | -23.3% |

## Throughput

| Phase or initial size | Operation | 0.0.1 µs | 0.0.1 IQR µs | 0.0.2 µs | 0.0.2 IQR µs | Change |
| --- | --- | ---: | ---: | ---: | ---: | ---: |
| 100 | `apply.duplicate` | 2.238 | 2.218 | 1.640 | 1.263 | -26.7% |
| 1000 | `apply.duplicate` | 2.241 | 0.858 | 1.866 | 1.073 | -16.7% |
| 10000 | `apply.duplicate` | 2.389 | 0.872 | 0.959 | 0.341 | -59.9% |
| 100 | `apply.duplicateRemove` | 2.300 | 2.960 | 1.678 | 2.481 | -27.1% |
| 1000 | `apply.duplicateRemove` | 4.265 | 1.938 | 1.889 | 0.124 | -55.7% |
| 10000 | `apply.duplicateRemove` | 2.199 | 2.811 | 1.894 | 1.207 | -13.9% |
| 100 | `apply.duplicateReplace` | 2.802 | 2.571 | 2.463 | 2.252 | -12.1% |
| 1000 | `apply.duplicateReplace` | 4.578 | 2.291 | 2.924 | 0.679 | -36.1% |
| 10000 | `apply.duplicateReplace` | 2.795 | 1.479 | 2.100 | 0.687 | -24.9% |
| 100 | `apply.insert` | 3.069 | 2.211 | 2.805 | 2.407 | -8.6% |
| 1000 | `apply.insert` | 7.822 | 2.959 | 3.885 | 0.337 | -50.3% |
| 10000 | `apply.insert` | 3.990 | 0.724 | 2.608 | 1.893 | -34.6% |
| 100 | `apply.remove` | 4.823 | 2.009 | 5.705 | 3.752 | +18.3% |
| 1000 | `apply.remove` | 7.525 | 3.138 | 4.132 | 0.702 | -45.1% |
| 10000 | `apply.remove` | 6.122 | 3.894 | 4.003 | 1.410 | -34.6% |
| 100 | `apply.replace` | 50.116 | 8.646 | 37.672 | 10.621 | -24.8% |
| 1000 | `apply.replace` | 58.137 | 22.955 | 36.040 | 13.881 | -38.0% |
| 10000 | `apply.replace` | 56.635 | 9.442 | 32.907 | 11.837 | -41.9% |
| 100 | `create.empty` | 2.418 | 0.478 | 1.225 | 0.060 | -49.3% |
| 1000 | `create.empty` | 2.456 | 0.415 | 1.168 | 0.383 | -52.5% |
| 10000 | `create.empty` | 2.575 | 0.693 | 1.325 | 0.344 | -48.5% |
| 100 | `create.sequence` | 6.425 | 2.358 | 3.957 | 0.390 | -38.4% |
| 1000 | `create.sequence` | 4.532 | 0.788 | 4.550 | 0.992 | +0.4% |
| 10000 | `create.sequence` | 4.815 | 0.960 | 4.028 | 0.782 | -16.3% |
| 100 | `insert.head` | 1.020 | 0.346 | 1.010 | 0.479 | -0.9% |
| 1000 | `insert.head` | 1.062 | 0.384 | 0.894 | 0.103 | -15.8% |
| 10000 | `insert.head` | 0.967 | 0.283 | 0.917 | 0.038 | -5.2% |
| 100 | `insert.middle` | 1.078 | 1.471 | 0.978 | 0.431 | -9.2% |
| 1000 | `insert.middle` | 1.044 | 0.183 | 0.887 | 0.149 | -15.0% |
| 10000 | `insert.middle` | 1.145 | 0.539 | 0.990 | 0.425 | -13.5% |
| 100 | `insert.random` | 2.668 | 0.784 | 2.249 | 1.183 | -15.7% |
| 1000 | `insert.random` | 2.727 | 0.297 | 2.235 | 0.424 | -18.0% |
| 10000 | `insert.random` | 2.356 | 0.887 | 2.092 | 0.563 | -11.2% |
| 100 | `insert.sameIndex` | 1.131 | 0.712 | 0.993 | 0.232 | -12.1% |
| 1000 | `insert.sameIndex` | 1.058 | 0.211 | 1.029 | 0.085 | -2.7% |
| 10000 | `insert.sameIndex` | 1.182 | 0.496 | 0.975 | 0.271 | -17.5% |
| 100 | `insert.tail` | 1.627 | 1.056 | 1.281 | 0.222 | -21.3% |
| 1000 | `insert.tail` | 2.428 | 1.024 | 1.257 | 0.081 | -48.2% |
| 10000 | `insert.tail` | 1.494 | 0.156 | 1.423 | 0.187 | -4.8% |
| 100 | `length` | 0.069 | 0.008 | 0.065 | 0.015 | -7.2% |
| 1000 | `length` | 0.094 | 0.037 | 0.063 | 0.001 | -33.1% |
| 10000 | `length` | 0.063 | 0.003 | 0.065 | 0.011 | +3.4% |
| 100 | `merge.duplicate` | 3.892 | 1.682 | 1.701 | 1.039 | -56.3% |
| 1000 | `merge.duplicate` | 4.184 | 2.344 | 1.705 | 0.219 | -59.2% |
| 10000 | `merge.duplicate` | 4.414 | 1.549 | 1.768 | 0.300 | -59.9% |
| 100 | `merge.insert` | 5.235 | 3.875 | 3.065 | 0.671 | -41.4% |
| 1000 | `merge.insert` | 8.021 | 2.866 | 4.932 | 1.742 | -38.5% |
| 10000 | `merge.insert` | 5.981 | 1.585 | 3.193 | 0.522 | -46.6% |
| 100 | `remove.head` | 4.331 | 3.745 | 1.940 | 0.736 | -55.2% |
| 1000 | `remove.head` | 3.378 | 1.158 | 2.488 | 0.526 | -26.3% |
| 10000 | `remove.head` | 3.252 | 0.709 | 2.604 | 0.558 | -19.9% |
| 100 | `remove.middle` | 3.986 | 2.163 | 3.008 | 0.763 | -24.5% |
| 1000 | `remove.middle` | 5.423 | 2.107 | 3.801 | 2.091 | -29.9% |
| 10000 | `remove.middle` | 5.936 | 1.683 | 3.213 | 0.259 | -45.9% |
| 100 | `remove.random` | 4.428 | 1.932 | 2.890 | 1.109 | -34.7% |
| 1000 | `remove.random` | 9.701 | 4.240 | 4.079 | 1.095 | -58.0% |
| 10000 | `remove.random` | 5.528 | 2.694 | 3.895 | 0.735 | -29.5% |
| 100 | `remove.sameIndex` | 3.334 | 1.861 | 1.717 | 1.827 | -48.5% |
| 1000 | `remove.sameIndex` | 3.077 | 0.927 | 2.423 | 0.159 | -21.3% |
| 10000 | `remove.sameIndex` | 3.809 | 1.797 | 2.114 | 0.415 | -44.5% |
| 100 | `remove.tail` | 2.132 | 0.856 | 1.573 | 0.516 | -26.2% |
| 1000 | `remove.tail` | 2.401 | 0.678 | 2.230 | 0.428 | -7.1% |
| 10000 | `remove.tail` | 2.706 | 0.561 | 2.033 | 0.564 | -24.9% |
| 100 | `replace.head` | 4.079 | 2.223 | 3.625 | 1.507 | -11.1% |
| 1000 | `replace.head` | 4.679 | 2.126 | 3.368 | 0.630 | -28.0% |
| 10000 | `replace.head` | 4.179 | 1.314 | 3.081 | 1.070 | -26.3% |
| 100 | `replace.middle` | 3.990 | 1.872 | 2.554 | 0.732 | -36.0% |
| 1000 | `replace.middle` | 4.170 | 1.082 | 3.136 | 0.363 | -24.8% |
| 10000 | `replace.middle` | 4.190 | 1.325 | 3.318 | 1.943 | -20.8% |
| 100 | `replace.random` | 5.106 | 2.736 | 4.927 | 1.021 | -3.5% |
| 1000 | `replace.random` | 6.899 | 1.456 | 5.236 | 0.414 | -24.1% |
| 10000 | `replace.random` | 7.581 | 4.390 | 5.141 | 1.505 | -32.2% |
| 100 | `replace.sameIndex` | 3.121 | 0.460 | 2.580 | 0.318 | -17.3% |
| 1000 | `replace.sameIndex` | 4.372 | 1.170 | 3.191 | 0.237 | -27.0% |
| 10000 | `replace.sameIndex` | 5.114 | 1.372 | 3.535 | 1.561 | -30.9% |
| 100 | `replace.tail` | 3.424 | 0.900 | 2.534 | 0.383 | -26.0% |
| 1000 | `replace.tail` | 4.372 | 0.478 | 3.252 | 0.778 | -25.6% |
| 10000 | `replace.tail` | 3.870 | 0.716 | 2.947 | 1.278 | -23.8% |
| 100 | `retire` | 0.384 | 0.056 | 0.266 | 0.031 | -30.8% |
| 1000 | `retire` | 0.817 | 0.665 | 0.448 | 0.154 | -45.1% |
| 10000 | `retire` | 1.300 | 0.343 | 0.577 | 0.125 | -55.6% |
| 100 | `sequence` | 0.965 | 0.310 | 0.716 | 0.087 | -25.8% |
| 1000 | `sequence` | 1.706 | 1.091 | 1.057 | 0.314 | -38.0% |
| 10000 | `sequence` | 1.357 | 0.395 | 0.849 | 0.158 | -37.4% |
| 100 | `value.head` | 0.355 | 0.315 | 0.177 | 0.143 | -50.1% |
| 1000 | `value.head` | 0.277 | 0.094 | 0.170 | 0.050 | -38.6% |
| 10000 | `value.head` | 0.213 | 0.049 | 0.193 | 0.086 | -9.4% |
| 100 | `value.middle` | 0.242 | 0.090 | 0.200 | 0.037 | -17.4% |
| 1000 | `value.middle` | 0.278 | 0.131 | 0.196 | 0.043 | -29.5% |
| 10000 | `value.middle` | 0.220 | 0.041 | 0.198 | 0.025 | -10.0% |
| 100 | `value.random` | 0.313 | 0.139 | 0.230 | 0.134 | -26.6% |
| 1000 | `value.random` | 0.261 | 0.161 | 0.260 | 0.075 | -0.4% |
| 10000 | `value.random` | 0.336 | 0.090 | 0.267 | 0.050 | -20.4% |
| 100 | `value.sameIndex` | 0.259 | 0.068 | 0.226 | 0.078 | -12.8% |
| 1000 | `value.sameIndex` | 0.268 | 0.075 | 0.254 | 0.062 | -5.4% |
| 10000 | `value.sameIndex` | 0.225 | 0.096 | 0.182 | 0.025 | -19.0% |
| 100 | `value.tail` | 0.244 | 0.116 | 0.195 | 0.058 | -19.9% |
| 1000 | `value.tail` | 0.233 | 0.209 | 0.217 | 0.036 | -6.5% |
| 10000 | `value.tail` | 0.258 | 0.132 | 0.189 | 0.035 | -26.7% |
| 100 | `values` | 8.518 | 3.533 | 7.100 | 0.824 | -16.6% |
| 1000 | `values` | 400.660 | 171.096 | 279.117 | 107.068 | -30.3% |
| 10000 | `values` | 2099.307 | 840.150 | 1778.642 | 233.484 | -15.3% |
| 100 | `values.head` | 0.879 | 0.583 | 0.859 | 0.451 | -2.3% |
| 1000 | `values.head` | 1.574 | 0.865 | 0.587 | 0.620 | -62.7% |
| 10000 | `values.head` | 0.892 | 0.462 | 0.473 | 0.096 | -46.9% |
| 100 | `values.middle` | 0.851 | 0.624 | 0.490 | 0.105 | -42.4% |
| 1000 | `values.middle` | 1.035 | 0.610 | 0.448 | 0.142 | -56.7% |
| 10000 | `values.middle` | 1.740 | 0.879 | 0.419 | 0.129 | -75.9% |
| 100 | `values.random` | 0.880 | 0.076 | 0.470 | 0.013 | -46.5% |
| 1000 | `values.random` | 1.667 | 1.247 | 0.486 | 0.202 | -70.8% |
| 10000 | `values.random` | 0.933 | 0.138 | 0.940 | 0.245 | +0.7% |
| 100 | `values.sameIndex` | 0.891 | 0.351 | 0.522 | 0.157 | -41.4% |
| 1000 | `values.sameIndex` | 1.083 | 0.350 | 0.612 | 0.167 | -43.5% |
| 10000 | `values.sameIndex` | 1.152 | 0.458 | 0.772 | 0.247 | -33.0% |
| 100 | `values.tail` | 0.851 | 0.223 | 0.444 | 0.041 | -47.8% |
| 1000 | `values.tail` | 1.597 | 0.755 | 0.624 | 0.398 | -60.9% |
| 10000 | `values.tail` | 1.080 | 0.589 | 0.380 | 0.069 | -64.9% |

The 100-insertion `apply.remove` row regressed 18.3% with wide overlap:
baseline run means were 4.294, 5.478, 3.468, 7.608, 4.823 and 3.107 µs;
candidate run means were 7.551, 3.119, 1.891, 6.297, 2.544 and 5.705 µs.
These samples do not establish a universal speedup across every document shape.

See [the experiment report](README.md) for targeted document-shape timings,
storage, memory, validation and remaining work.
