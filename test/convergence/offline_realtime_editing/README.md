# Three online and three offline editors

Every editor starts from a Snapshot containing:

```text
document
```

## Online causal chain

Three online editors hand the latest Snapshot forward:

```text
Actor 90: document -> online-1
                         |
Actor 91:                +-> online-2
                                  |
Actor 92:                         +-> online-3
```

This is one causal subtree:

```text
online-1 -> online-2 -> online-3
```

## Independent offline chains

Three other editors retain the original base and work without seeing any
online or peer-offline changes:

```text
Actor 80: offline-1-1 -> offline-1-2
Actor 70: offline-2-1 -> offline-2-2
Actor 60: offline-3-1 -> offline-3-2
```

The four roots compete after `document`. Their actor Clocks determine this
exact Projection:

```text
document
  -> online-1 -> online-2 -> online-3
  -> offline-1-1 -> offline-1-2
  -> offline-2-1 -> offline-2-2
  -> offline-3-1 -> offline-3-2
```

The causal children stay with their own root. No arrival order may produce an
interleaving such as:

```text
offline-1-1 -> offline-2-1 -> offline-1-2
```

## Offline data arriving during online editing

The explicit mid-session delivery begins with an online packet, then injects
offline packets between later online packets. Each offline branch is reversed,
so some children arrive before their roots:

```text
online packet
offline child
offline root
online packet
offline child
...
```

The receiver retries unresolved causal children after their roots arrive. The
network order must still produce the exact Projection shown above.

The suite also checks chronological delivery, complete reverse delivery, and
10,000 deterministic seeded shuffles of all six editors' packets.

## Mixed lifecycle

The same six-editor shape is repeated with hard deletes and native replace:

```text
online-1 -> online-trash -> remove online-trash
online-old -> replace with online-2

offline-1-1 -> offline-trash -> remove -> offline-1-2
offline-2-1 -> offline-old   -> replace with offline-2-2
offline-3-1 -> offline-trash -> remove
              offline-old   -> replace with offline-3-2
```

Removed values must never reappear, and every replace packet must resolve as
one Mask+Insert mutation. The final Projection remains exactly:

```text
document
  -> online-1 -> online-2 -> online-3
  -> offline-1-1 -> offline-1-2
  -> offline-2-1 -> offline-2-2
  -> offline-3-1 -> offline-3-2
```

Chronological, reversed, mid-online, and 64 additional seeded mixed-lifecycle
orders must all equal that result exactly.
