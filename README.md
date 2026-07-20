# Sequencer

A causality-encoding engine written in TypeScript and C++ to build high-performance, conflict-free replicated data types for use on the web.

Sequencer provides a deterministic total ordering for distributed data. It allows independently operating replicas to make concurrent changes and later converge on the same logical state without relying on network arrival order or perfectly synchronized clocks.

## Understanding the Problem Sequencer Solves

As an example, let's consider two editors, **A** and **B**, both working on the following text:

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

### Why Wall-Clock Timestamps Are Not Enough

Another solution is to timestamp every operation.

However, wall clocks across different machines are never guaranteed to be perfectly synchronized. Clock skew can cause an operation created later to appear earlier, or an earlier operation to appear later.

## Sequencer's Approach

Sequencer gives a stable unique identifier to every frame in a sequence.

Instead of describing a change as:

```text
Insert "!" at position 11
```

an operation can logically describe its relationship to existing sequence elements:

```text
Insert <frame-id> after <frame-id> and resolve possible sibling order with a deterministic rule
```

The identity of that frame remains stable even when other frames are inserted or removed around it.

From any set of sequence frames, Sequencer can reconstruct a deterministic ordering.

This means replicas can:

- Accept changes independently.
- Receive changes in different orders.
- Operate while temporarily disconnected.
- Merge concurrent changes.
- Eventually converge on the same sequence.

## Use Cases

Generally, Sequencer is intended for systems where independently created changes must converge into a state that is both **deterministic** and **logically meaningful** across arbitrary periods of disconnection and synchronization.

Examples include:

### Text and Rich-Text Editors

Maintain stable ordering of characters, blocks, nodes, annotations, or other document elements across concurrent edits.

### List, Collection...-Style Data.

Build replicated lists whose elements maintain deterministic positions regardless of the order in which updates arrive.

### Key-Value Data Models

Sequence writes to help determine the logically latest value rather than treating network arrival order as authoritative.

### Event and Operation Logs

Establish a deterministic ordering for operations originating from multiple independent actors.

## Assumptions

Sequencer assumes that participating actors maintain replicas of the Sequencer state and that those replicas all receive these changes via some channel resulting in **eventual consistency**.

Each actor treats its own local replica as authoritative when determining where newly created data belongs in the sequence.

A particular replica used as the basis for generating new sequence operations should be under the sole control of that actor. Multiple independent actors should not concurrently mutate the same replica as though they were a single actor.

Sequencer defines ordering and causality. It does not, by itself, establish whether a received operation is authorized or trustworthy.

Distributed applications using Sequencer should therefore authenticate actors and protect synchronization channels appropriately. Depending on the system's threat model, this may include cryptographic authentication, signatures, authenticated transport, or other mechanisms for verifying the origin and integrity of replicated changes.
