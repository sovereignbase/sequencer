# Concurrent mixed editing profile

Profiled the checkpoint `d3108d5` through its public API. Two independent
authors start from the same 100-Frame snapshot and each make 2,000 or 6,000
deterministic mixed edits. Insertions carry 1–9 Frames; removals consume 1–9
Frames without emptying the author. No edits are delivered between authors
before replay. Each history is replayed into 24 fresh receivers with ordered,
reverse and shuffled delivery. All resulting values agree across delivery
orders. External benchmark files, adapters and runners are unchanged.

The inspector samples at a requested 100 microsecond interval. Authoring,
hydration, explicit JS process garbage collection, complete value checks and
destruction are outside the profiled replay. These are diagnostic self-sample
shares, not production API timing or competitor comparisons.

| Edits per author | Delivery | API calls | Self samples | position_of share |
| ---------------: | :------- | --------: | -----------: | ----------------: |
|            2,000 | ordered  |    96,000 |          677 |            36.93% |
|            2,000 | reverse  |    96,000 |          388 |            25.26% |
|            2,000 | shuffled |    96,000 |          437 |            24.94% |
|            6,000 | ordered  |   288,000 |        1,675 |            48.00% |
|            6,000 | reverse  |   288,000 |        1,340 |            39.33% |
|            6,000 | shuffled |   288,000 |        1,769 |            33.80% |

At 6,000 edits per author, native anchor placement accounts for 4.60% of ordered
and 4.92% of shuffled samples. JavaScript input staging (`apply`) accounts for
13.37% and 20.97%, respectively; result consumption (`readResult`) accounts for
8.48% and 9.27%. The short eight-author profile is retained separately but has
too few samples per case to justify precise percentage claims.

This identifies visible-position resolution and its index maintenance as the
main native follow-up for concurrent random editing. It is distinct from the
hidden-tail walk in repeated tail replacement. No optimization is accepted by
this profile alone.

```text
node --expose-gc P/profile-concurrent-mixed.mjs fixed-table
```

`P` is `temp/optimization_2026_11_12`. Raw inspector profiles use the prefix
`fixed-table-concurrent-mixed`; function names are resolved with the frozen
checkpoint symbol map. Workload source and all raw summaries are retained there.
