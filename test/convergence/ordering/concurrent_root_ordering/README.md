# Concurrent root ordering

Four editors begin from a empty Sequence and independently edit their a document:

```text
Actor 0:
Hello world.
This is some text.

Actor 1:
Good morning.
Another paragraph follows.

Actor 2:
A quiet forest.
Birds move through the trees.

Actor 3:
Notes from today.
Everything is working well.
```

When the replicas are merged, the concurrent roots are ordered deterministically while each document remains a complete subtree. Content from different documents must not interleave.

For example:

```text
A quiet forest.
Birds move through the trees.
Hello world.
This is some text.
Notes from today.
Everything is working well.
Good morning.
Another paragraph follows.
```

Every delivery order must materialize the same Projection with the same deterministic root order and each document intact.
