# No-Change Merge and Latency Find Path

## Idea And Rationale

The supplied table showed CRList losing many `class merge` and `latency` rows
even though most local CRUD rows were already ahead of Yjs. Two costs were
mixed into those rows:

- `CRList.merge()` always materialized an index-keyed `change` patch and
  dispatched through `EventTarget`, even when no listener could observe it.
- Latency visibility checked ids through repeated indexed scans. That measures
  `readId(0..n)` throughput more than "is this id now visible/hidden?".

The retained changes separate state integration from optional change-patch
materialization and let the latency benchmark use the same `findById` consumer
path that other scenarios already use.

## Kept Changes

- `__merge(replica, delta, collectChange = true)` keeps the public default
  behavior but allows no-change integrations for consumers that only read state.
- `CRList.merge()` requests a change patch only when a `change` listener has
  ever been registered.
- `CRList` skips `EventTarget` dispatch for event types that have never had a
  listener.
- The CRList benchmark adapter calls `__merge(state, artifact, false)` because
  benchmark consumers read state directly and ignore the returned change patch.
- The latency benchmark uses `findById` for visible/hidden id checks.
- `splitBlock` now updates `blocksById` only for the smaller split side instead
  of deleting and rewriting every item id in the original block.
- CRList `find` and the benchmark adapter `find` use indexed loops instead of
  `for...of`.

## Rejected Variant

Changing the CRList benchmark adapter to build the initial 5,000 item list as a
single batch made visible insert latency faster, but it exposed a worse current
algorithmic cost: deleting from the head of a large block re-anchors the whole
surviving suffix with replacement ids. `head delete to remote hidden` exceeded
the command timeout. The adapter was returned to the per-item initial history.

## Before Context

From the user-supplied table:

| row                                | CRList before | best competitor before |
| ---------------------------------- | ------------: | ---------------------: |
| class / merge shuffled gossip      |    1.83 ms/op |         Yjs 0.39 ms/op |
| class / concurrent middle insert   |    0.19 ms/op |         Yjs 0.03 ms/op |
| latency / middle insert visible    |    0.29 ms/op |         Yjs 0.12 ms/op |
| latency / overwrite middle visible |    0.29 ms/op |         Yjs 0.12 ms/op |
| latency / delete middle hidden     |    0.80 ms/op |         Yjs 0.20 ms/op |

## After Targeted Results

Targeted `crlist` vs `yjs` latency run after the retained changes:

| row                             | CRList after |  Yjs after | result      |
| ------------------------------- | -----------: | ---------: | ----------- |
| append tail visible             |     71.85 ms |  212.51 ms | CRList wins |
| middle insert visible           |     23.01 ms |  223.90 ms | CRList wins |
| overwrite middle visible        |     59.67 ms |  126.44 ms | CRList wins |
| append tail to 10 remotes       |    777.41 ms | 1198.88 ms | CRList wins |
| forked replicas converge        |      7.01 ms |   17.23 ms | CRList wins |
| head delete hidden              |    496.68 ms |  292.95 ms | still loses |
| out-of-order append convergence |   1224.68 ms |  508.84 ms | still loses |
| duplicate shuffled gossip       |    883.45 ms |  270.41 ms | still loses |

Class merge after the retained changes still has unresolved losses:

| row                           | CRList after | best competitor after |
| ----------------------------- | -----------: | --------------------: |
| merge ordered deltas          |    12.488 ms |     json-joy 4.342 ms |
| merge shuffled gossip         |   484.895 ms |        Yjs 212.583 ms |
| concurrent prepends same head |     0.168 ms |   CRList won this run |
| concurrent middle insert      |     0.411 ms |          Yjs 0.132 ms |
| forked replicas rejoin        |   322.883 ms |         Yjs 17.519 ms |

## Verification

- `npm run build`
- `node --test test\unit\unit.test.js test\unit\coverage.test.js test\integration\integration.test.js`
- targeted latency and class merge benchmark snippets

## Final Rationale

Retained as partial progress. The changes make no-listener class merges and
direct-state latency consumers do less irrelevant work, and the latency visible
write rows now beat Yjs in the targeted run. The concrete goal is not complete:
hidden delete, out-of-order convergence, duplicate shuffled gossip, class
shuffled merge, class middle concurrent insert, and class forked rejoin still
need deeper structural work.
