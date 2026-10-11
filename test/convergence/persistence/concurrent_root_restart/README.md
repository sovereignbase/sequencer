# Concurrent root restart

Two editors begin from the same empty Sequence and independently create their own document.

Actor 0:

```text
Hello world.
This is the original document.
A new heading is added.
Another line is inserted above it.
One more line is inserted at the top.
```

Actor 1:

```text
A separate concurrent document.
```

The receiver is recreated after the first three Gossip packets and those packets are redelivered.

After all Gossip has been delivered, both the uninterrupted and restarted receivers must expose exactly the same Projection. Each root remains a complete subtree: no Frames are lost or duplicated, and content from the two independently created documents must not become interleaved.

For example:

```text
One more line is inserted at the top.
Another line is inserted above it.
A new heading is added.
Hello world.
This is the original document.
A separate concurrent document.
```
