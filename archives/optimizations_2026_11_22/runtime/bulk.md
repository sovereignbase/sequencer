# Bulk text control

Read the current external factory and B2.1 workload without editing or running
them. A local public-API diagnostic keeps four Projections, a 100-character
seed, two 6,000-character prepends, MessagePack transport, remote application
and three complete text reads. Text Footage and byte metadata are requested
in both compared versions. Native Session entropy is fixed in the isolated
benchmark module, equally for both builds.

Five fresh-process controls rotate build order. Each process records its first
bulk transaction and 300 subsequent repetitions. Only the measured library
build changes. These local results are not cross-library rankings.

| Build                             | Cold median ms | Cold IQR ms | Warm median ms |
| --------------------------------- | -------------: | ----------: | -------------: |
| 1.2.8                             |         2.3753 |      0.3941 |         0.1110 |
| 1.2.9                             |         2.1465 |      0.2119 |         0.0993 |
| Rejected shared-varuint candidate |         2.1411 |      0.1355 |         0.0999 |

The supplied external 2 → 10 ms regression does not reproduce in this control.
This does not establish that the external result is noise or that its cause has
been fixed. It rules out claiming a reproducible fivefold native slowdown from
these local data.

A separate starting-build CPU sample over 3,000 repetitions puts the largest
self-sample counts in MessagePack UTF-8 counting, string encoding, buffer growth
and UTF-8 encoding. Its instrumented first call is 2.7706 ms: inserts 0.4797 ms,
encoding 0.8662 ms, decoding 0.3912 ms, native application and result consumption
0.3365 ms, text reads 0.4388 ms, assertion 0.0589 ms. Phase timers themselves add
work, so these are diagnostic costs rather than acceptance timings.

Raw data, the public-call diagnostic and inspector output remain under
`temp/optimization_2026_11_22_runtime/cold-v128-baseline-shared-uint.json`,
`bulk.mjs`, `baseline-bulk.json` and `baseline-bulk.cpuprofile`.
