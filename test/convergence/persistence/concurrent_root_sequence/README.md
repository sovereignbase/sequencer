# Concurrent root sequence

Three replicas begin from the same empty Sequence and independently create their own documents.

Actor 0 builds one document by repeatedly inserting at its head:

```text
Project notes.

Draft:
Project notes.

Updated:
Draft:
Project notes.

Final:
Updated:
Draft:
Project notes.
```

Actor 1 independently creates:

```text
Shopping list.
```

Actor 2 independently creates:

```text
Travel plans.
```

Actor 0's logical zero-reservation remains the Structural Order head of its subtree even if the visible root fragment is ordered behind other concurrent root subtrees.

After all Gossip has been delivered, the resulting Sequence is used to recreate a fresh Projection. The recreated Projection must preserve the same deterministic root ordering and keep every root's complete subtree intact.

For example:

```text
Travel plans.

Shopping list.

Final:
Updated:
Draft:
Project notes.
```
