# Actor membership memory

Three identical public-API runs; one live Projection per fresh runtime. Live native allocation plus retained JavaScript Footage slots, excluding unused Wasm pages. No per-Actor claims or content; the active case also includes the shared input buffer. Retired cases include permanent retirement state. Identifiers span the full uint32 range.

| Actors | State   | Before bytes | Candidate bytes | Change |
| -----: | ------- | -----------: | --------------: | -----: |
|      0 | active  |          280 |             264 | -5.71% |
|      0 | retired |          264 |             248 | -6.06% |
|      0 | mixed   |          280 |             264 | -5.71% |
|      1 | active  |          336 |             328 | -2.38% |
|      1 | retired |          296 |             288 | -2.70% |
|      1 | mixed   |          352 |             328 | -6.82% |
|      4 | active  |          448 |             456 |  1.79% |
|      4 | retired |          352 |             360 |  2.27% |
|      4 | mixed   |          464 |             456 | -1.72% |
|      8 | active  |          632 |             648 |  2.53% |
|      8 | retired |          448 |             464 |  3.57% |
|      8 | mixed   |          648 |             648 |  0.00% |
|    100 | active  |         4832 |            5176 |  7.12% |
|    100 | retired |         2664 |            3040 | 14.11% |
|    100 | mixed   |         5224 |            5176 | -0.92% |
|    768 | active  |        32240 |           36688 | 13.80% |
|    768 | retired |        15776 |           20280 | 28.55% |
|    768 | mixed   |        33824 |           36688 |  8.47% |
|    769 | active  |        32272 |           36728 | 13.81% |
|    769 | retired |        15792 |           20304 | 28.57% |
|    769 | mixed   |        33856 |           36728 |  8.48% |
|   1000 | active  |        42872 |           47576 | 10.97% |
|   1000 | retired |        22696 |           27456 | 20.97% |
|   1000 | mixed   |        46056 |           47576 |  3.30% |
|   1536 | active  |        64128 |           73112 | 14.01% |
|   1536 | retired |        31272 |           40320 | 28.93% |
|   1536 | mixed   |        67312 |           73112 |  8.62% |
|   1537 | active  |        64160 |           73152 | 14.01% |
|   1537 | retired |        31288 |           40344 | 28.94% |
|   1537 | mixed   |        67344 |           73152 |  8.62% |
|   2000 | active  |        85408 |           94872 | 11.08% |
|   2000 | retired |        45128 |           54656 | 21.11% |
|   2000 | mixed   |        91792 |           94872 |  3.36% |
