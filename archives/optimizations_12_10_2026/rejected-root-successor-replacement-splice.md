# Rejected Root Successor Replacement Splice

## Idea And Rationale

Head overwrite and head delete merge rows are still slower than Yjs and json-joy
because root replacement deltas fall back to a full deterministic projection
rebuild.

The attempted narrow change was to allow `trySpliceReplacement()` to accept a
root replacement when the replacement successor was already the first live node
after tombstones:

```ts
if (!predecessor && next?.prev !== undefined) return false
```

This was narrower than accepting arbitrary root cursor state because it required
the successor projection link to prove it was already at the live head.

## Before Results

Targeted benchmark before the attempted change:

| Benchmark                                                    | CRList Before |        Winner Before |
| ------------------------------------------------------------ | ------------: | -------------------: |
| mags / merge / overwrite head delta into equal replica       |     4.8064 ms |   json-joy 0.1339 ms |
| mags / merge / delete head delta into equal replica          |     3.6486 ms |   json-joy 0.0591 ms |
| mags / merge / concurrent prepends same head                 |    13.8516 ms |        yjs 0.4638 ms |
| mags / merge / concurrent overwrites same head               |     3.5123 ms |        yjs 0.1686 ms |
| mags / merge / concurrent deletes same head                  |     3.6568 ms |   json-joy 0.1141 ms |
| latency / overwrite head write to remote visible             |   213.8273 ms |   json-joy 9.4049 ms |
| latency / head delete to remote hidden                       |   403.4191 ms |      yjs 102.4699 ms |
| latency / out-of-order delete delivery to remote convergence |   354.0615 ms | automerge 65.1716 ms |

## After Results

No benchmark result was retained.

The targeted unit tests passed, but the integration convergence stress suite
failed:

```text
integration stress: 11/12 passed
- 100 aggressive deterministic convergence scenarios: Error: live view length 1 did not match size 12
```

## Verification

Failed command:

- `node --test test\unit\unit.test.js test\unit\coverage.test.js test\integration\integration.test.js`

## Final Rationale

The change was rejected and reverted.

Root replacement remains a high-value target, but this guard was still too weak
for shuffled convergence scenarios. Any future root replacement fast path must
prove the entire root subtree shape, not just the immediate successor's `prev`
link.
