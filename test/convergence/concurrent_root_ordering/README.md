# Concurrent root ordering

Four editors start from the same empty Snapshot and insert independently:

```text
Actor 11: insert "first"  at root
Actor 12: insert "second" at root
Actor 13: insert "third"  at root
Actor 14: insert "fourth" at root
```

All four operations compete at the same boundary. Larger actor Clocks are
ordered farther left, so the required Projection is:

```text
fourth -> third -> second -> first
```

The test delivers both:

```text
11 -> 12 -> 13 -> 14
14 -> 13 -> 12 -> 11
```

Both replicas must materialize the exact same Projection, with no missing or
duplicated values.
