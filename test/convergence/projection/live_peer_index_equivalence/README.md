# Live peer index equivalence through jumps

Two live editors continuously synchronize the same document. Every local edit is delivered immediately to the other peer and every acknowledgement is returned to its author.

The workload repeatedly edits already edited regions:

```text
old text
↓ replace
new text
↓ remove
(empty)
↓ insert
fresh text
```

and later performs the same kind of insert, replace, and remove operations around the head, middle, and tail:

```text
The old draft reads poorly and stops here
        ↓ replace
The new draft reads poorly and stops here
                         ↓ remove
The new draft reads and stops here
                     ↓ insert
The new draft reads clearly and stops here
```

These edits leave reducing Mask Strips between visible Footage. The two continuously running peers may therefore reach the same Projection with different local gate and jump caches.

After every Gossip round they must nevertheless expose the same document at every Projection position:

```text
left.projectionFrameCount === right.projectionFrameCount

left.value(position) === right.value(position)
```

After the complete edit history, both peers must read:

```text
The final draft reads clearly and ends here
```

The local traversal state is intentionally irrelevant: different jump paths must resolve every Projection position to the same Footage.
