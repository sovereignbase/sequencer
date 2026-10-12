# Restart and stale redelivery

The shared document initially contains no text:

```text
(empty)
```

Five independent editors then create one concurrent root insertion each:

```text
Actor 41:
Project notes.

Actor 42:
Shopping list.

Actor 43:
Travel plans.

Actor 44:
Meeting summary.

Actor 45:
Release checklist.
```

None of these edits observes any of the others, so all five are competing roots from the same empty origin.

One receiver gets the Gossip in its original collection order. Another receives the exact same operations in a seeded hostile shuffle and is recreated from its retained `Sequence` halfway through delivery:

```text
shuffled Gossip
↓
some mutations integrated
↓
create(sequence(receiver))
↓
remaining mutations integrated
```

After the restarted receiver has integrated the complete operation set, every original Gossip packet is delivered to it again:

```text
Project notes.        # stale redelivery
Shopping list.        # stale redelivery
Travel plans.         # stale redelivery
Meeting summary.      # stale redelivery
Release checklist.    # stale redelivery
```

Those packets must be idempotent. None may duplicate its text or alter the deterministic ordering of the concurrent roots.

For example, the final Projection may be:

```text
Release checklist.

Meeting summary.

Travel plans.

Shopping list.

Project notes.
```

The exact root order is determined by Sequencer competition rules, not network arrival order. The important invariant is:

```text
ordered Projection
  ==
restarted Projection
  ==
create(sequence(restarted)) Projection
```

Restarting from retained Sequence state, redelivering stale Gossip, and create-time compaction must all preserve the exact same visible document.
