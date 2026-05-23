# Out-Of-Order Delete Observable Benchmark

## Fairness Issue

The latency benchmark for out-of-order delete delivery was not measuring the same
observable consumer result as the insert and overwrite out-of-order benchmarks.

For inserts and overwrites, the benchmark merged a delta into the remote replica
and then called `consume()`, which scans the remote visible state to confirm the
consumer can read the expected value.

For deletes, the benchmark skipped `consume()` and counted the delta as visible
immediately:

```js
if (op.type === 'delete' || consume(adapter, target, op)) visible++
```

That measured internal merge delivery for deletes, not the time until a consumer
could observe that the deleted value was absent.

## Why It Matters

The benchmark goal is consumer-visible latency:

1. Actor 1 deletes a value.
2. Actor 2 receives the delta.
3. Actor 2 can read the visible state and observe that the value is gone.

Skipping the consumer read for deletes made the delete row incomparable with the
insert/overwrite rows and with the stated observable-state benchmark goal.

It also exaggerated the apparent CRList gap. CRList's merge path was being
compared against libraries whose delete row avoided the same remote read check.

## Change

`benchmark/scenarios/latency.js` now calls `consume()` for every out-of-order
operation type:

```js
if (consume(adapter, target, op)) visible++
```

For delete operations, `consume()` checks that the deleted id can no longer be
found in the receiving replica's visible state.

## Before Results

Targeted benchmark before the fairness correction:

| Benchmark                                                    | CRList Before | Yjs Before | json-joy Before | Automerge Before |
| ------------------------------------------------------------ | ------------: | ---------: | --------------: | ---------------: |
| latency / out-of-order delete delivery to remote convergence |   226.1806 ms |  4.5740 ms |       5.4203 ms |       79.9322 ms |

## After Results

Targeted benchmark after the fairness correction:

| Benchmark                                                    | CRList After |  Yjs After | json-joy After | Automerge After |
| ------------------------------------------------------------ | -----------: | ---------: | -------------: | --------------: |
| latency / out-of-order delete delivery to remote convergence |  364.6978 ms | 94.6315 ms |   1851.9563 ms |      83.9736 ms |

Related out-of-order rows from the same run:

| Benchmark                                                    |      CRList |          Yjs |   json-joy |   Automerge |
| ------------------------------------------------------------ | ----------: | -----------: | ---------: | ----------: |
| latency / out-of-order append delivery to convergence        | 391.1838 ms |  224.1149 ms |        n/a | 138.8002 ms |
| latency / out-of-order prepend delivery to convergence       | 329.8054 ms |  214.7527 ms | 36.7382 ms | 130.1259 ms |
| latency / out-of-order middle insert delivery to convergence | 354.0566 ms | 1113.5364 ms |        n/a | 116.6422 ms |

## Result

This was a benchmark fairness correction, not a CRList runtime optimization.

The corrected row now measures the same observable consumer work for deletes as
for inserts and overwrites. CRList still has work to do on out-of-order delete
consumer latency, but the corrected gap is no longer the earlier
merge-only-vs-observable mismatch.

## Follow-Up

The remaining CRList cost in this row is now clearer: after fair measurement,
the benchmark spends meaningful time scanning visible state to prove an id is
absent. Further optimization should target the actual consumer-observable path
without weakening convergence.
