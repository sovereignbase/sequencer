# Overlapping remove gate

Two replicas independently remove the same retained text while concurrent content is inserted through and around that origin.

For example:

```text
old draft
```

One replica removes the complete origin:

```text
old draft
↓ remove

(empty)
```

Another replaces and then removes the same region:

```text
old draft
↓ replace

new version
↓ remove

(empty)
```

Meanwhile, concurrent edits retain anchors inside and around the original text:

```text
old | draft
    ↓ insert "middle"

old middle draft

↓ additional insertion from the empty head

tail content
```

Before the remote histories are applied, the receiver's gate is at the original
head. Remote operations retain that Strip while it is visible. If it is removed,
the gate follows neighbouring surviving content. `gatePosition` follows the
gate's visible start rather than preserving index zero.

`head` contains the first visible Frame. Non-visible structural Strips may
precede it.

The position is checked before convergence lookups, because local `value()`
calls may move the gate and update `gatePosition`. Every delivery order
must then resolve to the same visible Projection.
