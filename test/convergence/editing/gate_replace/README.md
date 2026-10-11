# Local gate replace

A replacement removes and inserts at the same Projection boundary.

For example:

```text
The old draft remains.

↓ replace "old draft" with "new version"

The new version remains.

↓ insert "final " between "new" and "version"

The new final version remains.
```

For a replacement contained by one Strip, the local gate remains on the left side of the replacement insertion. Its numeric projected position therefore does not move.

A later indexed edit must resolve correctly from that existing gate state without requiring an intervening any call to recalculate it.
