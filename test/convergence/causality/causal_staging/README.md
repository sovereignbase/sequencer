# Causal staging

One editor creates a short text in two dependent steps:

```text
Hello
Hello world
```

The second replica starts empty but receives the edits in reverse order:

```text
1. insert " world" after "Hello"
   -> accepted into pending, still invisible

2. insert "Hello"
   -> accepted and automatically unlocks the pending edit
```

The required Projection is then:

```text
Hello world
```

The receiver must equal the authoring replica exactly without redelivering ` world` or exchanging a retained Sequence. Packet order does not change causal order, and an unresolved edit is never partially materialized.
