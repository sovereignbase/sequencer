# String Footage

Strings address UTF-16 code units, including NUL and unpaired surrogates. Array
results remain the default; explicit text reads and Splices preserve strings.
Snapshot hydration retains strings only when the fourth constructor argument is true.
Checks cover local extension, mixed array/text suffixes, JSON Gossip, invalid
prefix handling, short or missing Footage, fixed tuples and retained snapshots.

Deterministic edits compare array and string storage after every operation,
including compaction and recreation. Offline masks preserve missing slots;
concurrent and duplicate replay preserve the same visible order. Encoding
failures retain their original cause.
