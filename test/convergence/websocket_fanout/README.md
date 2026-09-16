# Regular WebSocket fanout

Three browser Replicas connect to one deliberately ignorant WebSocket relay.
The relay stores nothing, parses no Delta, and broadcasts each text frame.

All editors start their own timers. No editor waits for delivery, an ACK, or
another editor before executing its four assigned operations:

```text
editor 0: insert at 0, 75, 150, and 225 ms
editor 1: replace at 25, 100, 175, and 250 ms
editor 2: remove at 50, 125, 200, and 275 ms
```

Expected:

```text
each browser sends 4 local Deltas
each browser receives 8 peer Deltas
no local or peer Delta is rejected or left pending
all visible sequences are equal
the two Mask-issuing actors use distinct Mask sessions even under identical
host entropy
```

This is the practical timer-driven FIFO case. It does not reorder one sender's
causal chain; causal-staging tests cover that adversarial case. A pass shows that
ordinary WebSocket fanout does not itself require a pending store.

The test deliberately makes every browser context return the same random word.
This regresses the former WASM `std::random_device` collision, where editor 1's
replace Mask caused editor 2's remove Mask to be rejected as a duplicate.

The original hand-written WebSocket frame parser produced a divergent result
and was removed; transport correctness is part of the invariant being tested,
so the test now uses the maintained `ws` implementation.
