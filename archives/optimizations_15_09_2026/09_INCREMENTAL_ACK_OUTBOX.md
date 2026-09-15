# Experiment 09 — incremental ACK outbox

Date: 2026-09-15

Create caches one full ACK. Successful ingest marks only Mask sessions whose
contiguous frontier advanced. Those pairs accumulate in a bounded native outbox;
the next accepted local edit copies and consumes it. Already-sent sessions are
not rescanned or emitted.

Retained. Atomic ACK-plus-Delta, replace, convergence, and stress tests passed.
