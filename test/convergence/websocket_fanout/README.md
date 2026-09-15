# Regular WebSocket fanout

Three browser Replicas connect to one deliberately ignorant WebSocket relay.
The relay stores nothing, parses no Delta, and broadcasts each text frame.

All editors start their own timers. No editor waits for delivery, an ACK, or
another editor before executing its four assigned operations:

```text
editor 0: insert at 0, 75, 150, and 225 ms
editor 1: insert at 25, 100, 175, and 250 ms
editor 2: insert at 50, 125, 200, and 275 ms
```

Expected:

```text
each browser sends 4 local Deltas
each browser receives 8 peer Deltas
no local or peer Delta is rejected or left pending
all visible sequences are equal
```

This is the practical timer-driven FIFO case. It does not reorder one sender's
causal chain; causal-staging tests cover that adversarial case. A pass shows that
ordinary WebSocket fanout does not itself require a pending store.

Two stronger variants exposed separate semantic regressions: mixed hard
replace/remove traffic and three simultaneous offline Insert bursts were all
accepted (so pending was unnecessary) but live authors did not converge. Those
failures must not be misdiagnosed as relay ordering or pending-store problems.
