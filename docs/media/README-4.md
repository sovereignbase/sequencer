# Peer to peer fanout

Run with `npm run test:integration`.

Three browser pages communicate directly through a same-origin `BroadcastChannel`. There is no central Gossip relay or persisted server state; every page is both an editor and a peer.

## Causal pending across three peers

The first regression follows an explicit three-peer route.

A begins by writing:

```text
Hello
```

A sends that edit only to B. B then continues the text:

```text
Hello world
```

but B's ` world` edit reaches C before C has ever received `Hello`:

```text
A writes "Hello"

A --"Hello"--> B

B writes " world" after "Hello"

B --" world"--> C      # "Hello" is still missing at C

A --"Hello"--> C       # unlocks the retained " world"

B --" world"--> A
```

When C first receives ` world`, it accepts the edit but cannot materialize it:

```text
C:

(empty)
```

After the delayed parent arrives, C resolves the retained child automatically:

```text
Hello world
```

The child is never redelivered and no Sequence is exchanged. All three peers must end with exactly:

```text
Hello world
```

## Independent realtime editing

The second regression begins with three independent root edits:

```text
Editor 0:
Project notes.

Editor 1:
Shopping list.

Editor 2:
Travel plans.
```

Each receiver applies a different artificial network delay, so those concurrent roots may arrive in different orders. They have no causal dependencies and therefore require no pending state.

The editors then continue independently on their own timers with inserts, replacements, and removals. For example:

```text
Project notes.
↓ insert
Project notes.
Review tomorrow.

Shopping list.
↓ replace
Shopping list updated.

Travel plans.
↓ remove
Plans.
```

Editors do not wait for peer delivery or acknowledgements before making their next local edit. The artificial receive jitter remains shorter than the edit interval, preserving normal per-editor causal progression while allowing concurrent edits from different peers to arrive in different orders.

After synchronization, every peer must report:

```text
8 received peer Gossip updates
0 rejected peer Gossip updates
0 rejected local edits
identical final visible Projection
```

The timer-driven scenario verifies the normal no-pending realtime path, while the explicit A → B → C route verifies automatic causal staging and resolution when network delivery reverses a parent-child dependency.
