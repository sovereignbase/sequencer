# Byte words

Numeric output keeps its existing six-word coordinates and JSON transport.
Opt-in byte output keeps Footage outside Wasm and accepts previously written
version-one snapshots and standalone Gossip.

## Snapshot coordinates

Version three retains the Session dictionary, preceding-record start predictions,
zigzag start deltas and reversed insertion-count footer. Session token zero means
Session zero; token one introduces a four-byte little-endian literal; tokens
`2..count + 1` select previous literals. ACKs and coordinates share that dictionary.
Version one retains its original dictionary and control-bit meanings.

The coordinate control byte uses the following version-three fields:

| Bit | Meaning                                            |
| --- | -------------------------------------------------- |
| 0   | Insertion Session differs from the previous record |
| 1   | Explicit anchor Session                            |
| 2   | Explicit zigzag insertion-start delta              |
| 3   | Explicit zigzag anchor-start delta                 |
| 4   | Anchor diff is zero                                |
| 5   | Insertion magnitude differs from one               |
| 6   | Explicit anchor diff greater than one              |
| 7   | Negative insertion diff                            |

Bits 4 and 6 together encode anchor Session zero and anchor diff zero, with no
Session token. Bit 1 must then be clear. Otherwise the omitted anchor Session is
the current insertion Session, and omitted anchor diff is one. Field order is
Session, anchor Session, anchor-start delta, anchor diff, start delta, magnitude.
All predictions use modular uint32 arithmetic; zero and `INT32_MIN` effects are
invalid. Tuple mode and capacity remain in the snapshot header's upper bits.

Control `0xff` followed by a positive varuint repeats the preceding encoded
coordinate fields. Each repetition advances the normal predictions, reconstructing
a distinct canonical Insertion. Session references are never repeated this way,
so dictionary admission remains explicit. The footer counts expanded records;
a run cannot exceed the remaining declared count. A single repeated one-byte
record stays literal to avoid expanding short runs.

## Standalone coordinates

Standalone records retain raw four-byte Session IDs and the version-one control
layout. When the anchor Session equals the insertion Session, the otherwise
invalid flag combination `0x42` identifies an inline anchor. Its insertion Session
is explicit, its anchor Session is implied, bit 0 supplies an anchor diff greater
than one, and bit 4 supplies zero. With neither bit set the anchor diff is one.
Bits 0 and 4 cannot both be set. Start, anchor-start, magnitude and sign flags
keep their existing meanings. No cross-packet dictionary or retained decoding
state is needed.

## Removal packets and ACKs

A mask immediately followed by its matching author ACK can carry that ACK in
its metadata: `0xff`, standalone coordinates, then the Actor varuint. The Session
and endpoint are reconstructed from the mask. The effect must be negative.

Several consecutive masks from one removal use `0xff, 1`, the record count and
Actor, followed by version-three coordinates sharing one Session dictionary.
Their matching author frontier follows the last mask's Session and endpoint.
Canonical masks are applied in order; pending anchors and valid-prefix rejection
retain their existing behavior. Footage is never included in a removal packet.

A standalone ACK contains its Actor varuint and raw Session/end pairs. Consecutive
ACKs for the same Actor can share a packet. Consecutive nonzero claims for one
Session retain the last report, including a lower one. Zero reports remain in
order because their handling depends on Actor/Session identity. Claims are never
replaced with their maximum. Actor-only ACKs still establish membership.

Readers bound fields, uint32 values, references, record counts, repetitions,
tuple configuration and trailing bytes. Byte output requires a receiver supporting
these packet forms; older stored version-one data remains readable. JavaScript
copies buffers and binds Footage; coordinate packing and replay execute in Wasm.
