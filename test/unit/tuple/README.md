# Tuple API

[Unit](../README.md) · [test.ts](test.ts)

Tuple mode keeps indices stable. Fixed length includes empty registers; dynamic
length retains the highest written boundary. Each Frame has its own six-word
Insertion, with `anchorDiff` holding the index.

These cases cover local ranges, sparse indices, Footage ownership, snapshot
configuration, string Footage, remote validation and destruction.
