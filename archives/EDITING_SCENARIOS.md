# Sequencer – Offline and Real-Time Text Editing Merge Test

## Objective

The purpose of this test was to verify how Sequencer orders real-time and offline edits that branch from the same document state.

The main goal was to confirm that concurrent branches do not interleave at the character or operation level, but instead preserve each branch's causal continuation as a coherent sequence.

The expected behavior was:

```text
[entire online session][entire offline session]
```

or:

```text
[entire offline session][entire online session]
```

depending on the ordering of the concurrent root operations.

An undesirable result would be something like:

```text
online1 offline1 online2 offline2
```

## Test Setup

All actors started from the same completed document state.

The online session was intentionally continued by multiple actors so that the test would not only verify a chain produced by a single actor.

```text
Online:
A → B → A

Offline:
C → C → C
```

Both branches edited the same position in the document without knowledge of the other branch's changes.

The operations were then merged while varying their arrival order.

## Minimal Test

Initial state:

```text
A
```

Online branch:

```text
A
A1
A11
A111
```

Offline branch:

```text
A
A2
A22
A222
```

Acceptable final results:

```text
A111222
```

or:

```text
A222111
```

### Result

When the online branch was ordered first:

```text
A111222
```

When the offline branch was ordered first:

```text
A222111
```

The contents of the branches did not interleave.

Results such as the following were not produced:

```text
A121212
A112212
A221121
```

## Actor Changes Within a Session

The online session continuation was intentionally produced by different actors:

```text
A → B → A
```

Despite the actor changes, the online branch remained a coherent sequence.

Changing actors therefore did not itself terminate the causal subtree.

This is important for real-time collaborative editing, where a shared online editing history may contain causally related operations from multiple users.

## Text Editing Test

The initial document was continued independently by two sessions.

Online session content:

```text
and shared
in real time
with both editors
```

Offline session content:

```text
but edited
offline
for several minutes.
```

When the online branch was ordered first, the materialized text was:

```text
The document is ready and shared in real time with both editors but edited offline for several minutes.
```

When the concurrent ordering was reversed, the order of the sessions also changed, while each session's own continuation still remained coherent.

## Operation Arrival Order

Operations from a branch were also intentionally delivered out of order:

```text
tail → middle → root
```

The final ordering still converged to the same result across all replicas.

This indicates that the final materialized ordering did not depend on network packet arrival order.

## Randomized Test

The ordering semantics were additionally tested with 10,000 randomized cases.

Result:

```text
10,000 / 10,000 PASS
```

In all tested cases, the causal tail of a session remained associated with its root operation and concurrent branches did not interleave.

## Why the Ordering Remains Stable

The current `insert_between` logic uses `subtree_end` before placing the losing concurrent sibling.

Conceptually:

```text
root A
├─ continuation
├─ continuation
└─ continuation

root B
├─ continuation
└─ continuation
```

If `root A` is ordered before `root B`, then `root B` is placed after the entire causal subtree of A:

```text
A subtree
B subtree
```

rather than:

```text
A root
B root
A continuation
B continuation
```

`subtree_end` also does not treat an actor change as a subtree boundary. As a result, a causal continuation produced by multiple online actors can remain part of the same subtree.

## Conclusion

The tested ordering semantics behave as intended for the basic offline and real-time text editing scenario.

Concurrent session roots determine the ordering between the sessions:

```text
ONLINE → OFFLINE
```

or:

```text
OFFLINE → ONLINE
```

After that ordering decision, the causal continuation of each branch remains associated with its own root.

This allows a longer offline editing session to be merged with a concurrently evolving online branch without causing the sequential inserts of the independent sessions to interleave unnecessarily.

## Scope

This test focused specifically on the behavior of the current `insert_between` / `subtree_end` ordering semantics.

The next useful test is to run the same scenario through the complete Sequencer runtime using a realistic editor workload where both sessions contain:

```text
insert
remove
replace
```

while varying both the initial document size and the duration of the offline session.

That would verify not only session continuity, but also the behavior of deletions and replacements during concurrent text editing.
