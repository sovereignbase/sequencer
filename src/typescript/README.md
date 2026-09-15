# TypeScript adapter

TypeScript is a thin synchronous adapter over the native Projector. It owns the
consumer Footage array, performs the unavoidable copies across Wasm linear
memory, and maps native Footage spans to visible values or changes.

Local `insert`, `remove`, and `replace` return replication packets containing
an acknowledgement and a Delta. `ingest` accepts exactly one such packet.
Frontier maintenance and safe automatic collection happen entirely in C++.

`create(actorId, snapshot?)` copies snapshot metadata into the reusable native
buffers once. Native creation restores the projection and collects safe history
before returning. `snapshot` returns `[frontiers, projection]`; each insert
Delta owns only the Footage required by that persisted snapshot.

Deletes are hard. There is no recovery API, explicit acknowledgement API, or
public compaction API.
