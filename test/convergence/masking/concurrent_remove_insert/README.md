# Concurrent remove and insert

Both editors start from:

```text
The old house
```

They edit independently from the same Sequence:

```text
Actor 31: delete "old "
The house

Actor 32: insert "small " after "old "
The old small house
```

The operations are concurrent: the deletion was authored without seeing `small `, so the new insertion is not part of the Mask.

The test delivers the same operations in both orders:

```text
Delete -> Insert
Insert -> Delete
```

In either order, the Mask removes only its original target, `old `, while the concurrent insertion remains:

```text
The small house
```
