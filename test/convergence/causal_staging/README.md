# Causal staging

Actor 21 creates one causal chain:

```text
parent -> child
```

Actor 22 starts empty but receives the packets in this order:

```text
1. child  -> false, because parent is missing
2. parent -> accepted
3. child  -> accepted on retry
```

The required Projection is then:

```text
parent -> child
```

The receiver must equal the authoring replica exactly. Packet order does not
change causal order, and an unresolved child is never partially materialized.
