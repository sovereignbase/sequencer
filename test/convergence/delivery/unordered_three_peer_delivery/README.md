# Unordered three-peer delivery

Three peers begin from the same empty Sequence and edit independently.

Actor 0:

```text
Write the report.
Write the final report.
Publish the final report.
```

Actor 1:

```text
Buy coffee.
Buy fresh coffee.
Buy fresh tea.
```

Actor 2:

```text
Plan the trip.
Plan the summer trip.
Plan summer.
```

Their edits contain inserts, removes, and replacements. The resulting Gossip is delivered to fresh receivers both chronologically and in a deterministic mixed order.

The test repeats this for every relative ordering of the three peers' increase and decrease Session IDs. For any fixed Session ordering, both delivery orders must produce the same Projection.

Removed or replaced local content remains absent, every surviving insertion remains present, and each peer's surviving subtree remains intact.

For example:

```text
Publish the final report.
Buy fresh tea.
Plan summer.
```

The exact subtree order may change with the tested Session-ID ordering, but Gossip arrival order must never change the result within that ordering.
