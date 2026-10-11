# Live replace then remove

Two continuously synchronized peers repeatedly replace and remove text from the same document.

For example:

```text
The old draft needs review.

↓ replace "old draft" with "new version"

The new version needs review.

↓ replace "needs review" with "is ready"

The new version is ready.

↓ insert "carefully checked and " through an anchor retained inside previously masked footage

The new version is carefully checked and ready.
```

Later, one of the logical strips is removed:

```text
The new version is carefully checked and ready.

↓ remove "carefully checked and "

The new version is ready.
```

The removal must produce exactly the same Projection on the local author and on the peer applying the resulting Gossip. Both live instances must expose the same `projectionFrameCount` and resolve identical Footage at every Projection position.
