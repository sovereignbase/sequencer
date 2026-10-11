# Apply equivalence at a fragmented boundary

The author and receiver begin empty and exchange every Gossip update and returned acknowledgement. The author first inserts some text, replaces that text, and then inserts new text at the head. For example:

```text
cat
↓ replace "cat" with "dog"
dog
↓ insert "A " at the head
A dog
```

Although the visible text is simply `A dog`, the Structural Order still contains the original insertion and the replacement that masks it. The edits have therefore fragmented the structure while retaining the stable coordinate system of the original insertion.

The regression then inserts text exactly at the visible boundary between the head insertion and the replaced text:

```text
A | dog
    ↑
insert "big "

A big dog
```

This corresponds to the tested operation:

```text
[3, 3, 2, 2]
        ↑
insert([7, 7], 2)

[3, 3, 7, 7, 2, 2]
```

The visible lookup identifies the selected fragment and a position relative to that fragment. When the Gossip operation is published, `anchorFrame` must be expressed in the stable coordinate system of the original Strip. The fragment's offset within that original Strip must therefore be added to the locally resolved position.

If that offset is omitted, the local editing path and the receiver's `apply` path can interpret the same visible boundary as different structural coordinates. In the text example, the author may resolve the insertion as:

```text
A | dog
    ↓
A big dog
```

while the receiver resolves the transmitted anchor against a different fragment of the original `cat` insertion.

The two replicas can then diverge even though they share exactly the same operations. More importantly, an incorrectly resolved boundary can disturb the replacement relationship and allow text from the original, already masked `cat` insertion to become visible again.

The test therefore verifies that a boundary insertion created locally and the same insertion reconstructed through Gossip resolve to the same stable structural anchor after prior replacement and fragmentation.
