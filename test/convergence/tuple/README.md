# Tuple convergence

[Convergence](../README.md) · [test.ts](test.ts)

Each stable index displays the greatest active `(session, start)` identity.
Losing versions remain available until explicitly removed. Local removal targets
every observed version; unseen concurrent versions survive.

Cases cover reordered and duplicate delivery, removal before insertion,
replacement, packed snapshots, restart, merge and acknowledged compaction.
Compaction removes eligible masks and deleted versions while preserving indices
and Actor membership.
