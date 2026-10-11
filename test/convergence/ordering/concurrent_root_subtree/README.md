# Concurrent root subtree

Two replicas begin from the same empty Sequence and independently build their own documents by inserting at the head.

Actor 0:

```text
Project notes.

Draft:
Project notes.

Final:
Draft:
Project notes.

Reviewed:
Final:
Draft:
Project notes.
```

Actor 1:

```text
Shopping list.

Updated:
Shopping list.
```

The hostile delivery sends Actor 1's complete document subtree before Actor 0's root arrives. Even though Actor 1's root has already been fragmented by its child insertion, its root competitor remains represented by the `rightFragment`.

Session ordering determines one deterministic order for the complete root subtrees. Delivery order must not change that order or interleave their contents.

For example:

```text
Updated:
Shopping list.

Reviewed:
Final:
Draft:
Project notes.
```
