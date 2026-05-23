# Shuffled Gossip Tombstoned Predecessor Convergence

## Question

The failing shuffled gossip path was whether CRList could converge when deltas
arrive out of causal order after a live successor had been inserted behind an
entry that was later deleted.

## Is This Realistic?

Yes.

This can happen whenever delivery does not guarantee causal order:

- unordered gossip between peers
- retry delivery where an older delta arrives after a newer one
- offline burst sync where queued operations are replayed in transport order
- duplicate shuffled delivery during peer-to-peer fanout
- snapshot hydration of a state whose visible order depends on tombstoned
  predecessor relationships

The consumer-visible failure is not only theoretical. Actor 1 can insert a value,
insert another value after it, delete the first inserted value, and then Actor 2
can receive those deltas in a different order. If the remaining live successor is
still stably anchored to the deleted predecessor, another replica can rebuild a
different visible order.

## Failure Shape

The bad shape was:

1. A live entry is inserted.
2. A successor is inserted after that live entry.
3. The predecessor entry is deleted.
4. The local linked list still reads correctly because pointer order is already
   present in memory.
5. The durable CRDT metadata still says the successor's predecessor is the
   deleted entry.
6. A shuffled merge or snapshot rebuild reconstructs from metadata and places
   the successor differently.

That means the merge path and the snapshot hydrate path can disagree with the
source replica even though the source looked correct locally.

## Fix

`src/core/crud/delete/index.ts` now detects when the first live successor after a
deleted range would remain anchored to a deleted predecessor. In that case delete
emits a replacement entry for the successor, anchored to the predecessor before
the deleted range, and tombstones the old successor identity.

This keeps the delta monotonic:

- deleted identities stay deleted
- the successor's consumer-visible value remains visible in the same position
- remote replicas do not need non-commutative backward reparenting
- snapshot hydration and shuffled gossip reconstruct the same observable order

## Tests Added

`test/e2e/shared/suite.mjs` includes:

- `deleted predecessor successor re-anchor survives shuffled gossip and snapshots`

The test verifies all of these observable results:

- shuffled delta delivery converges
- normal snapshot hydration preserves order
- shuffled snapshot value and tombstone hydration preserves order

`test/unit/coverage.test.js` includes:

- a targeted unit test proving delete emits a successor replacement when needed
- public-surface branch coverage for empty iteration and numeric property lookup
- additional index-walk coverage for delete merge paths

## Result

`npm run test` passed after the change.

The full suite covered:

- build
- unit and coverage tests
- integration stress convergence
- Node, Bun, Deno, Cloudflare Workers, Edge Runtime, and browser E2E suites

Coverage after the change was:

- statements: 100%
- lines: 100%
- functions: 100%
- branches: 99.51%

The convergence fix is retained because it fixes a realistic out-of-order
delivery and snapshot hydration failure without weakening convergence.
