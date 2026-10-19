# Snapshot words

Gossip insertion coordinates remain six uint32 words. `Sequence` keeps two arrays,
`[words, footage]`, and the ordering and meaning of every insertion and ACK.
Footage stays in JavaScript. Packing and reconstruction execute in WASM.

Snapshots with fewer than 64 retained insertions keep the plain layout:

```text
[frontiersEnd, acknowledgementLength, ...acknowledgement, ..., six-word records...]
```

At the 64th exported insertion, the writer converts the first 63 records and ACK
prefix once, then writes the remaining records directly in compact form. The
complete metadata output is never built and repacked in a second pass.

Compact words begin with `[0, frontiersEnd, insertionCount]`. The ACK prefix
retains each original logical word count. Unsigned fields below `0x3fffffff`
occupy one word. Other uint32 values use `[0x3fffffff, low16, high16]`.
All compact words fit V8's signed 31-bit integer elements.

Each insertion begins with a control word. Its high bits carry `anchorStart`
when that value is at most `0xffffff`. Low bits describe explicit fields:

| Bit | Explicit field                       | Otherwise                                                                                     |
| --- | ------------------------------------ | --------------------------------------------------------------------------------------------- |
| 0   | insertion Session, low16 then high16 | Previous insertion Session, initially zero                                                    |
| 1   | anchor Session, low16 then high16    | Current insertion Session                                                                     |
| 2   | insertion start                      | Zero after a Session change; otherwise previous start + abs(previous diff) + 1, modulo uint32 |
| 3   | anchor start                         | Control word shifted right by six                                                             |
| 4   | anchor diff                          | One                                                                                           |
| 5   | insertion diff, zigzag encoded       | One                                                                                           |

Explicit fields follow that order. Start, anchor start, anchor diff and zigzag diff
use the unsigned-field representation above. The reader accepts both snapshot
layouts, checks boundaries and counts, and reconstructs the original coordinates
before hydration or merge. Old readers accept plain snapshots; compact snapshots
require the updated reader. Gossip remains interoperable.

Positive fragment chains begin with a non-offset arena node. Negative roots can
have consumed prefixes and are recognized by their containment identity. Snapshot
export uses this existing information to emit each insertion once without an
additional visitation hash table.

Snapshots with omitted Footage intervals begin with
`[0, frontiersEnd, 0x3ffffffe, insertionCount]`. Canonical records use the same
control words. Each positive record additionally stores zero for its complete
original Footage extent, or `rangeCount + 1` followed by pairs of gap length and
retained length. Gaps are relative to the preceding retained interval's end.
One denotes no retained Footage. Scalar values use the same escape representation.

A control word of `0x3ffffffe` introduces an affine run. It is followed by the
pattern width (one or two) and a repeat count of at least three. Each pattern
lane stores one ordinary coordinate record, six unsigned coordinate strides and
its Footage layout. The records are reconstructed in repeat order, then lane
order, with uint32 addition. A lane retains its authoring Session and signed diff;
those two strides must be zero. The header counts reconstructed records.

The writer holds at most six records to recognize runs. It neither sorts the
history nor builds a second complete metadata output. Equal intervals and exact
coordinate strides are required; no anchor or identity is rewritten. Literal
records and runs can be interleaved.

The flat Footage array contains those retained intervals in record order.
Canonical diffs, anchor triples and mask identities are unchanged. ACKs retain
their original frontiers: agreement permits Footage compaction through that
endpoint, not coordinate renumbering or removal of future Session operations.
Hydration materializes the canonical masks and assigns the surviving fragments
their packed physical offsets. The updated reader accepts all three layouts; readers
predating this layout cannot load snapshots containing omitted intervals.

Only positive insertions allocate JavaScript content bindings during hydration or
merge. WASM reports the exact binding count; JS attaches the original Footage after
native dispatch, before consuming spans, copies or appends. No coordinate parsing
is needed in the JavaScript runtime.
