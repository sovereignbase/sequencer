# Local workload size controls

Three seeds, 6,000 edits per author. The same public calls, MessagePack envelopes and generated payloads are used before and after. Concurrent probes use two transaction-shaped edit batches; packets are replayed and the restored document is checked. Positions use a local seed, so these are controls rather than reruns of the external competition. No external adapter or benchmark was modified.

| Workload        | Document before / after B |  Change | Update before / after B |  Change |
| --------------- | ------------------------: | ------: | ----------------------: | ------: |
| append          |               6033 / 6033 |   0.00% |           20.98 / 20.98 |   0.00% |
| prepend         |              18031 / 6036 | -66.52% |           21.99 / 20.99 |  -4.55% |
| random          |             31696 / 28676 |  -9.53% |           22.44 / 21.93 |  -2.25% |
| randomWords     |             76611 / 75778 |  -1.09% |           29.57 / 29.43 |  -0.47% |
| concurrent      |             63929 / 58000 |  -9.27% |   128880.00 / 125923.00 |  -2.29% |
| concurrentWords |           152984 / 151243 |  -1.14% |   171378.00 / 170533.00 |  -0.49% |
| concurrentMixed |           164668 / 159578 |  -3.09% |   306209.00 / 267457.50 | -12.66% |
| mixed           |                   35 / 35 |   0.00% |           31.42 / 25.26 | -19.60% |

Updates are per call for ordinary probes and per transaction for concurrent probes. The outer text/Gossip envelope remains included.

## String update controls

Actor IDs require five varuint bytes. Three input seeds; the table shows medians. Bulk delete sums its insert and delete messages. Mixed strings use 6,000 randomly selected insert/delete calls, with words of 2–10 code units and deletion lengths of 1–9.

| Workload      | Before B | After B |  Change |
| ------------- | -------: | ------: | ------: |
| bulk-delete   |     6057 |    6050 |  -0.12% |
| mixed-strings |       48 |      36 | -25.00% |
