# Local Gossip allocation controls

Three repetitions per case in one fresh measured runtime, with numeric and byte output. Live allocation plus retained JS Footage, not process RSS or peak memory. Bytes; lower is better. This candidate was rejected on timing grounds.

| Mode / operation / Frames | Before | Candidate | Change |
| ------------------------- | -----: | --------: | -----: |
| numeric/remove.all/1      |    944 |       920 |    -24 |
| numeric/tuple.insert/1    |    456 |       456 |      0 |
| numeric/remove.all/8      |   4464 |      4336 |   -128 |
| numeric/tuple.insert/8    |   1528 |      1464 |    -64 |
| numeric/remove.all/100    |  54840 |     53816 |  -1024 |
| numeric/tuple.insert/100  |  16280 |     15480 |   -800 |
| numeric/remove.all/1024   | 490024 |    473640 | -16384 |
| numeric/tuple.insert/1024 | 139704 |    131512 |  -8192 |
| bytes/remove.all/1        |    960 |       928 |    -32 |
| bytes/tuple.insert/1      |    472 |       472 |      0 |
| bytes/remove.all/8        |   4272 |      4144 |   -128 |
| bytes/tuple.insert/8      |   1664 |      1600 |    -64 |
| bytes/remove.all/100      |  53456 |     52432 |  -1024 |
| bytes/tuple.insert/100    |  18336 |     17536 |   -800 |
| bytes/remove.all/1024     | 462400 |    446016 | -16384 |
| bytes/tuple.insert/1024   | 156096 |    147904 |  -8192 |
