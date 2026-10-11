# Overlapping remove ownership

Three replicas begin from the same text:

```text
The quick brown fox jumps high
```

They edit overlapping parts independently.

For example:

```text
Actor 0:
remove "brown fox"

The quick jumps high
```

```text
Actor 1:
replace "fox jumps" with "dog runs"

The quick brown dog runs high
```

```text
Actor 2:
remove "brown fox jumps"

The quick high
```

The three reducing operations overlap the same original text. A removed original Frame must have one deterministic concurrent remove owner, rather than being removed independently by multiple overlapping removes.

At the same time, replacement and insertion Footage that was authored concurrently must remain present unless it is causally removed by its own branch.

For example, after all operations are merged:

```text
The quick
dog runs
high
```

Chronological, reverse, and deterministic mixed Gossip delivery must expose the same `projectionFrameCount` and resolve the same Footage at every Projection position.
