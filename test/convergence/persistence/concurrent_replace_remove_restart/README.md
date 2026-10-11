# Concurrent replace remove restart

Actor 1 builds and edits:

```text
old wooden house here
↓ insert "very " at the head
very old wooden house here

↓ replace "very old " with "new red "
new red wooden house here

↓ insert "The " at the head
The new red wooden house here
```

At the same time, Actor 2 independently inserts:

```text
Meanwhile,
```

Actor 1 never observes that concurrent insertion before creating the replacement. Its replacement remove may therefore remove `very old `, but it must not acquire ownership of `Meanwhile,` when the histories are later merged.

The test reconstructs the same Gossip history both continuously and through a restart after the concurrent operation has been delivered. In both cases the visible content must retain:

```text
The
new
red
wooden
house
here
Meanwhile,
```

while the replaced `very` and `old` content remains removed. Restart or stale redelivery must not expand the causal scope of the replacement remove to include Actor 2's concurrent root.
