# Local/remote replacement equivalence

Two continuously synchronized peers run a deterministic lifecycle workload. Every local Gossip update is delivered immediately to the other peer, and every returned acknowledgement is sent back before the next operation is created.

After each delivery, both peers therefore contain the same shared operations, regardless of which peer originally authored them.

The author and receiver must expose the same `projectionFrameCount` after every delivery and the same Footage at periodic checkpoints. In particular, applying a replacement remotely must produce exactly the same Projection as creating that replacement locally after a long sequence of fragmenting inserts, removals, and replacements.

For example, consider a document whose visible Footage is:

```text
The quick brown fox
```

If one peer replaces `brown` with `red`, its local Projection becomes:

```text
The quick red fox
```

The resulting Gossip operation is then delivered to the other peer. After applying that same operation remotely, the other peer must expose exactly the same Footage:

```text
The quick red fox
```

This must remain true even when the replaced range is no longer represented by one simple Strip internally, but has previously been split and fragmented by edits such as:

```text
The quick brown fox
The very quick brown fox
The very quick fox
The very quick silver fox
The very quick red fox
```

A replacement is therefore not considered correct merely because the local editing path produces the expected text. The same shared insertion and reduction operations must resolve to the same visible Projection when reconstructed through the remote Gossip path.

This test checks immediate convergence under ordered delivery. It does not test concurrently authored operations created before synchronization or convergence under different Gossip delivery orders.

The workload keeps a lightweight `StripIndex` only to choose valid local edit
boundaries and ranges. It is not an independent model of Projection semantics
and is not used as an expected result. The locally edited author is the oracle;
the assertion is that applying the same Gossip remotely reproduces that local
Projection exactly.
