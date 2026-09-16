# Causal staging

Actor 21 creates one causal chain:

```text
parent -> child
```

Actor 22 starts empty but receives the packets in this order:

```text
1. child  -> accepted into pending, still invisible
2. parent -> accepted and automatically unlocks child
```

The required Projection is then:

```text
parent -> child
```

The receiver must equal the authoring replica exactly without child redelivery
or snapshot exchange. Packet order does not change causal order, and an
unresolved child is never partially materialized.
