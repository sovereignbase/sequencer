# Byte words

Byte metadata encodes the same canonical coordinates and ACKs as numeric words.
Footage stays outside the byte stream. Numeric output remains the default.

Unsigned integers use little-endian base-128 groups, at most five bytes per
uint32. Session literals use four little-endian bytes rather than five-byte
varints for random IDs. Standalone Gossip entries have no shared encoding state.

Snapshots share a Session dictionary: reference zero introduces a four-byte
literal; references `1..count` select earlier literals. ACKs and coordinates use
the same dictionary. It exists only while writing or reading that snapshot.

## Coordinates

One control byte precedes optional fields. The preceding insertion Session is
initially zero. Anchor coordinates default to the current Session, start zero
and diff one. A zero anchor Session instead defaults its start and diff to zero.

| Bit | Explicit field or meaning                            |
| --- | ---------------------------------------------------- |
| 0   | Insertion Session differs from the preceding Session |
| 1   | Anchor Session differs from the insertion Session    |
| 2   | Zigzag-encoded insertion-start delta                 |
| 3   | Explicit anchor start or snapshot anchor-start delta |
| 4   | Anchor diff differs from one                         |
| 5   | Insertion magnitude differs from one                 |
| 6   | Anchor Session is zero; bit 1 must be clear          |
| 7   | Negative insertion diff                              |

Fields follow this order: insertion Session, anchor Session, anchor start,
anchor diff, insertion-start delta and magnitude. Same-Session anchors predict
`start = anchorStart + anchorDiff + 1`; other anchors predict zero. Deltas and
predictions use modular uint32 arithmetic. Magnitude is unsigned; the control
byte supplies its sign. Zero and `INT32_MIN` diffs remain invalid.

Snapshots predict insertion start from the preceding record's start plus its
magnitude plus one, or zero after a Session change. An anchor in that preceding
Session predicts its start from the preceding record; other anchors predict
zero. Explicit snapshot starts use zigzag deltas. Predictions change only the
encoding; every original uint32 coordinate is reconstructed exactly.

## ACKs and snapshots

A standalone ACK contains its Actor varuint, then Session/end pairs until its
byte boundary. A snapshot prefixes each ACK with its logical word count and
uses dictionary Session references. Actor membership is retained even when
acknowledged Session pairs are omitted by compaction.

Snapshot header low six bits contain version one. Bit 7 marks tuple mode and
bit 6 marks fixed tuple capacity. Fixed tuples store capacity; dynamic tuples
store current length. The following varuint counts ACKs. ACKs precede retained
coordinates in Structural Order. The final reversed varuint contains insertion
count, allowing the reader to reserve exact record capacity without moving or
repacking the encoded prefix. An empty ordinary Sequence has zero metadata bytes.

Readers check field bounds, uint32 overflow, dictionary references, record and
ACK counts, tuple configuration and trailing bytes before accepting a snapshot.
Gossip retains valid-prefix application on rejection. JS copies input/output
bytes; coordinate packing, validation and reconstruction execute in Wasm.
