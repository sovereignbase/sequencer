# Text follow-up

Five rotated/reversed fresh-process rounds, including a byte-identical baseline copy and the direct-Splice-only build. Exact public calls, payloads and assertions from the text benchmark. Ordinary uses its original 10/25 ms warm-up/measurement windows. Long uses 100/250 ms in both builds, with original call caps. Setup and checks remain outside API time. Both diagnostics and every valid sample are retained. Values are microseconds per call; lower is faster.

| Size / representation / method / window | Build         |       Before µs (IQR) |         After µs (IQR) |   Change | Paired change (IQR pp) | Slower pairs |
| --------------------------------------- | ------------- | --------------------: | ---------------------: | -------: | ---------------------: | -----------: |
| 65536/string/values.range/ordinary      | baseline-copy |         0.158 (0.007) |          0.149 (0.003) |  -5.843% |        -4.718% (5.357) |          1/5 |
| 65536/string/values.range/ordinary      | direct-splice |         0.158 (0.007) |          0.145 (0.009) |  -8.332% |        -5.522% (5.325) |          1/5 |
| 65536/string/values.range/ordinary      | ack-final     |         0.158 (0.007) |          0.148 (0.003) |  -6.329% |        -5.365% (2.164) |          0/5 |
| 65536/string/values.range/long          | baseline-copy |         0.147 (0.019) |          0.141 (0.005) |  -3.853% |       -4.883% (14.538) |          2/5 |
| 65536/string/values.range/long          | direct-splice |         0.147 (0.019) |           0.14 (0.009) |  -4.771% |        -2.295% (7.598) |          2/5 |
| 65536/string/values.range/long          | ack-final     |         0.147 (0.019) |          0.142 (0.004) |  -3.286% |        -5.833% (9.601) |          2/5 |
| 65536/string/sequence.text/ordinary     | baseline-copy |          0.254 (0.11) |          0.218 (0.007) |  -14.32% |      -14.688% (27.229) |          1/5 |
| 65536/string/sequence.text/ordinary     | direct-splice |          0.254 (0.11) |          0.227 (0.015) | -10.768% |       -2.192% (33.563) |          1/5 |
| 65536/string/sequence.text/ordinary     | ack-final     |          0.254 (0.11) |          0.222 (0.035) | -12.631% |       -16.544% (11.56) |          1/5 |
| 65536/string/sequence.text/long         | baseline-copy |         0.179 (0.007) |          0.163 (0.001) |   -8.55% |        -7.602% (3.453) |          1/5 |
| 65536/string/sequence.text/long         | direct-splice |         0.179 (0.007) |          0.167 (0.012) |  -6.528% |         -6.528% (8.92) |          2/5 |
| 65536/string/sequence.text/long         | ack-final     |         0.179 (0.007) |          0.171 (0.003) |  -4.434% |        -4.434% (5.996) |          1/5 |
| 1048576/array/remove/ordinary           | baseline-copy |   5,677.02 (1,136.37) |       5,244.5 (565.74) |  -7.619% |       -3.554% (12.459) |          2/5 |
| 1048576/array/remove/ordinary           | direct-splice |   5,677.02 (1,136.37) |    5,519.32 (1,063.01) |  -2.778% |       -3.331% (20.431) |          2/5 |
| 1048576/array/remove/ordinary           | ack-final     |   5,677.02 (1,136.37) |       5,341.88 (32.86) |  -5.903% |       -6.274% (16.985) |          2/5 |
| 1048576/array/remove/long               | baseline-copy |    4,948.175 (697.46) |     4,672.052 (98.466) |   -5.58% |       -5.583% (16.095) |          1/5 |
| 1048576/array/remove/long               | direct-splice |    4,948.175 (697.46) |     4,691.887 (24.711) |  -5.179% |       -5.179% (16.716) |          1/5 |
| 1048576/array/remove/long               | ack-final     |    4,948.175 (697.46) |     4,700.737 (114.08) |  -5.001% |        -4.986% (4.569) |          0/5 |
| 1048576/array/concurrent.apply/ordinary | baseline-copy |   72,882.2 (10,273.5) |       70,054.3 (778.2) |   -3.88% |       -5.356% (15.959) |          2/5 |
| 1048576/array/concurrent.apply/ordinary | direct-splice |   72,882.2 (10,273.5) |     72,634.5 (7,089.2) |   -0.34% |       -3.939% (14.514) |          2/5 |
| 1048576/array/concurrent.apply/ordinary | ack-final     |   72,882.2 (10,273.5) |     73,238.6 (3,123.9) |   0.489% |        0.689% (11.922) |          3/5 |
| 1048576/array/concurrent.apply/long     | baseline-copy | 65,404.325 (2,340.95) | 65,324.675 (2,991.575) |  -0.122% |        -1.525% (7.015) |          2/5 |
| 1048576/array/concurrent.apply/long     | direct-splice | 65,404.325 (2,340.95) |   65,033.8 (2,235.425) |  -0.567% |        -1.572% (6.856) |          2/5 |
| 1048576/array/concurrent.apply/long     | ack-final     | 65,404.325 (2,340.95) |   64,243.35 (3,350.15) |  -1.775% |        -1.993% (5.326) |          2/5 |
| 1048576/array/merge/ordinary            | baseline-copy |   3,238.888 (451.974) |     3,194.862 (95.062) |  -1.359% |       -0.601% (13.417) |          2/5 |
| 1048576/array/merge/ordinary            | direct-splice |   3,238.888 (451.974) |     3,023.678 (22.833) |  -6.645% |         1.287% (9.346) |          3/5 |
| 1048576/array/merge/ordinary            | ack-final     |   3,238.888 (451.974) |    3,216.125 (282.325) |  -0.703% |          6.47% (8.479) |          4/5 |
| 1048576/array/merge/long                | baseline-copy |   3,219.232 (120.336) |    3,054.193 (107.976) |  -5.127% |        -2.882% (2.962) |          1/5 |
| 1048576/array/merge/long                | direct-splice |   3,219.232 (120.336) |    3,216.421 (156.457) |  -0.087% |         2.002% (9.875) |          3/5 |
| 1048576/array/merge/long                | ack-final     |   3,219.232 (120.336) |     3,207.485 (187.66) |  -0.365% |        -0.092% (3.378) |          2/5 |
| 1048576/string/value.random/ordinary    | baseline-copy |             0.085 (0) |          0.082 (0.002) |  -2.591% |        -3.022% (3.234) |          1/5 |
| 1048576/string/value.random/ordinary    | direct-splice |             0.085 (0) |          0.099 (0.011) |  17.567% |       17.691% (12.084) |          5/5 |
| 1048576/string/value.random/ordinary    | ack-final     |             0.085 (0) |          0.086 (0.003) |   2.039% |         2.147% (5.509) |          4/5 |
| 1048576/string/value.random/long        | baseline-copy |         0.097 (0.016) |          0.091 (0.006) |  -6.831% |        -3.655% (10.33) |          1/5 |
| 1048576/string/value.random/long        | direct-splice |         0.097 (0.016) |          0.088 (0.002) | -10.047% |      -10.631% (11.057) |          0/5 |
| 1048576/string/value.random/long        | ack-final     |         0.097 (0.016) |          0.089 (0.002) |   -8.87% |      -13.098% (16.046) |          2/5 |
