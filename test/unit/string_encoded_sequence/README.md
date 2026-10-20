# String-encoded Sequences

`sequence(true)` concatenates retained Footage directly from native spans. The
structural words are identical to an array snapshot. Footage follows canonical
Insertion order; the words reconstruct visible order after hydration.

Text Frames are UTF-16 code units, matching `split('')`. Checks include surrogate
pairs, combining characters, lone surrogates and NUL. Missing retained slots use
NUL so unacknowledged masks keep their original coordinates. Registered offline
history still resolves before acknowledgement permits compaction.

Other cases cover default array types, boolean flag inference, JSON hydration,
compact numeric metadata, merge Splices, continued editing, snapshot isolation
and `STRING_ENCODING_FAILED` with the original concatenation error as `cause`.
