# Sequencer

A causality-encoding engine written in TypeScript and C++ to build high-performance, conflict-free replicated data types for use on the web.

Sequencer provides a deterministic total ordering for distributed data. It allows independently operating replicas to make concurrent changes and later converge on the same logical state without relying on network arrival order or perfectly synchronized clocks.

### Table of contents

- //links to headlines per hierarchy

## Usage

### Simple typed api

```ts
import * as sequencer from '@sovereignbase/sequencer'

const sequence = sequencer.__create(/*optional stored snapshot*/)
const { reel, change } = sequencer.__update(sequence, 0, 'Hello World', 'after')
console.log(sequencer.__read(sequence, 0)) // "Hello World"
```

## Benchmarks

### Unbeliveable performance

|function|troughput (ops/sec)|average time (ns)
performance benchamrks

### Small bundle size

|raw|min|min+gzip|
Bundle size benchmakrs

### Optimized data model

|per op avg reel bytes| x size reel bytes| gzipped|
Bytse size benchmarks (msgpacked)

## Why shoul you use it?

### Understanding the Problem Sequencer Solves

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

### Sequencer's Approach

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

## Tests

### Behaviour guaranteed by excessive tests

Every `npm test` run rebuilds the native WebAssembly module and verifies unit
behaviour, deterministic convergence, generative "stress" scenarios, V8 coverage,
the supported runtime matrix, desktop browsers, mobile browser emulations, and
module Web Workers. Every stage has a hard timeout, and all detailed evidence is
written to the [automated test report](https://sovereignbase.dev/sequencer/tests/).

### Works everywhere where ESM modules and Wasm works

Runtimes with tested support:

- Node.js
- Deno
- Bun
- Edge Runtime
- Cloudflare Workers through workerd
- Browser Window and Web Worker contexts
- Chromium, Firefox, and WebKit
- Mobile Chrome and Mobile Safari device profiles

## License

Apache-2.0
