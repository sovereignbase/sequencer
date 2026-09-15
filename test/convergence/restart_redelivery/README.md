# Restart and stale redelivery

The shared base is:

```text
base-0 -> base-1 -> base-2
```

Two editors then create mixed operations from that base:

```text
Actor 41:
  insert "left-0, left-1" at index 1
  insert "left-child" inside that new branch
  remove a range spanning its local branch

Actor 42:
  replace base-1 with "right"
  insert "right-initial" at the head
```

One receiver gets author order. Another gets a seeded shuffle, is recreated
from `snapshot(receiver)` halfway through accepted packets, and is finally sent
every old packet again:

```text
hostile packets -> create(snapshot) -> stale redelivery
```

The expected relationship is exact equality:

```text
ordered Projection
  == restarted Projection
  == create(snapshot(restarted)) Projection
```

Stale packets must be idempotent, and create-time compaction must not change the
visible result.
