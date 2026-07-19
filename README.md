# Sequencer

A causality-encoding engine written in TypeScript and C++ for building high-performance, conflict-free replicated data types.

Sequencer provides a deterministic total ordering for distributed data. It allows independently operating replicas to make concurrent changes and later converge on the same logical state without relying on network arrival order or perfectly synchronized clocks.

## Understanding the Problem Sequencer Solves

Consider two editors, **A** and **B**, both working on the following text:

```text
Hello world
```

The text has 11 characters and 12 possible insertion positions.

Both editors begin from the same state.

Editor **A** makes two changes:

1. Replaces `H` with `Y`.
2. Inserts `w` after `Hello`.

A now sees:

```text
Yellow world
```

At roughly the same time, before receiving A's changes, editor **B** inserts `!` at the end of the original text:

```text
Hello world!
```

These changes are then exchanged over the network.

When A's changes arrive at B, B can produce the expected result:

```text
Yellow world!
```

However, if B's operation is represented only as something like:

```text
Insert "!" at position 11
```

then applying that operation to A's newer local state may produce:

```text
Yellow worl!d
```

The operation was correct relative to the state in which it was created, but the numeric position no longer represents the same logical location after concurrent edits.

This is the fundamental problem: **array indices and positions are not stable identities**.

### Why Network Ordering Is Not Enough

One possible solution is to introduce a central server that decides the order of operations.

However, this makes network arrival order part of the resulting state.

Depending on latency, the server may receive operations in a different order from the order in which users logically performed them. Two otherwise identical sets of operations could therefore produce different or unintuitive results depending on network conditions.

In other words:

```text
network latency → operation order → resulting state
```

For a conflict-free distributed system, this is undesirable.

### Why Wall-Clock Timestamps Are Not Enough

Another solution is to timestamp every operation.

However, wall clocks across different machines are never guaranteed to be perfectly synchronized. Clock skew can cause an operation created later to appear earlier, or an earlier operation to appear later.

Sequencer therefore does not rely exclusively on wall-clock timestamps to establish causality.

## Sequencer's Approach

Sequencer gives positions in a sequence stable, unique identifiers.

Instead of describing a change as:

```text
Insert "!" at position 11
```

an operation can logically describe its relationship to existing sequence elements:

```text
Insert "!" after <element-id>
```

The identity of that element remains stable even when other elements are inserted or removed around it.

From any set of sequence elements, Sequencer can reconstruct a deterministic ordering.

This means replicas can:

- Accept changes independently.
- Receive changes in different orders.
- Operate while temporarily disconnected.
- Merge concurrent changes.
- Eventually converge on the same sequence.

### Concurrent Insertions

A conflict occurs when multiple elements are inserted after the same element.

For example:

```text
A → insert X after element P
B → insert Y after element P
```

Both insertions are valid and neither operation has inherent causal priority over the other.

Sequencer resolves this deterministically using the identifiers of the conflicting elements.

Conceptually:

```text
smaller ID ← P → larger ID
```

Every replica applies the same comparison rule, so every replica independently reaches the same ordering.

Sequencer currently uses **UUID version 7** identifiers.

UUIDv7 provides globally unique identifiers with time-ordered properties. Sequencer uses these properties as part of its deterministic ordering strategy rather than relying exclusively on either wall-clock timestamps or purely random identifiers.

The encoded wall-clock component can influence ordering when appropriate, while correctness does not depend on clocks across replicas being perfectly synchronized.

## Use Cases

Sequencer can be used anywhere a distributed system requires a deterministic logical order.

Examples include:

### Text and Rich-Text Editors

Maintain stable ordering of characters, blocks, nodes, annotations, or other document elements across concurrent edits.

### Lists and Ordered Collections

Build replicated lists whose elements maintain deterministic positions regardless of the order in which updates arrive.

### Key-Value Data Models

Sequence writes to help determine the logically latest value rather than treating network arrival order as authoritative.

### Event and Operation Logs

Establish a deterministic ordering for operations originating from multiple independent actors.

### CRDTs

Use Sequencer as an ordering primitive when building higher-level conflict-free replicated data structures.

More generally, Sequencer is intended for systems where independently created changes must converge into a state that is both **deterministic** and **logically meaningful** across arbitrary periods of disconnection and synchronization.

## Assumptions

Sequencer assumes that participating actors maintain replicas of the Sequencer state and that those replicas are **eventually consistent**.

Each actor treats its own local replica as authoritative when determining where newly created data belongs in the sequence.

A particular replica used as the basis for generating new sequence operations should be under the sole control of that actor. Multiple independent actors should not concurrently mutate the same local replica as though they were a single actor.

Sequencer defines ordering and causality. It does not, by itself, establish whether a received operation is authorized or trustworthy.

Distributed applications using Sequencer should therefore authenticate actors and protect synchronization channels appropriately. Depending on the system's threat model, this may include cryptographic authentication, signatures, authenticated transport, or other mechanisms for verifying the origin and integrity of replicated changes.
