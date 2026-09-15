# Concurrent Mask and insert

Both editors start from:

```text
a -> b -> c
```

They edit the same Snapshot independently:

```text
Actor 31: remove Projection range [1, 2)  -> masks origin "b"
Actor 32: insert "beside" at index 2      -> anchors beside origin "b"
```

The test applies both possible orders:

```text
Mask -> Insert
Insert -> Mask
```

The Mask follows the origin operation and its source coordinates. It must not
consume the concurrent Insert merely because that Insert becomes adjacent in
Projection order.

Both replicas must therefore produce exactly:

```text
a -> beside -> c
```
