# Rejected Class Batch Insert

## Idea And Rationale

The class API batch and paste benchmarks were not giving CRList the same unit of
work as Yjs.

Core CRList already accepts multiple inserted values in one `__update()` call,
but the public class API only exposes single-value `append()` and `prepend()`.
The benchmark adapter therefore inserted batch values one at a time through the
public class API, while Yjs received one batch insert.

Arrays can be legitimate CRList values, so overloading `append(array)` or
`prepend(array)` would be ambiguous. The smallest clear public surface appeared
to be a new batch method:

```ts
list.insert(index, values, mode)
```

## Smallest Safe Change

Added `CRList.insert(index, values, mode = 'before')`, which called the existing
core `__update(index, values, state, mode)` once and emitted one `delta` event
and one `change` event.

Updated the CRList benchmark adapter so class append/prepend/insert batch paths
used this public batch method.

## Before Results

Targeted benchmark before the change:

| Benchmark                                       | CRList Before |  Winner Before |
| ----------------------------------------------- | ------------: | -------------: |
| class / append / batch after tail               |   187.7849 ms | yjs 89.1683 ms |
| class / prepend / batch before head             |   228.1245 ms | yjs 45.5002 ms |
| class / insert / batch before middle            |   201.9319 ms | yjs 40.0370 ms |
| class / paste / insert 10,000 entries at cursor |   174.9325 ms | yjs 10.9314 ms |

## After Results

Targeted benchmark after the change:

| Benchmark                                       | CRList After |   Winner After |
| ----------------------------------------------- | -----------: | -------------: |
| class / append / batch after tail               |  142.5906 ms | yjs 78.5376 ms |
| class / prepend / batch before head             |  156.3251 ms | yjs 51.6194 ms |
| class / insert / batch before middle            |  158.4606 ms | yjs 40.9468 ms |
| class / paste / insert 10,000 entries at cursor |  148.6339 ms | yjs 13.7254 ms |

## Verification

Targeted tests passed while the experiment was present:

- `node --test test\unit\unit.test.js test\unit\coverage.test.js test\integration\integration.test.js`

The integration stress suite reported `12/12 passed`.

## Final Rationale

The change was rejected and reverted.

The benchmark improvement was real but modest, and the class API already allows
array values as normal payloads. Adding a separate public batch insertion method
would increase the public surface area without closing the remaining paste gap.

The reverted result leaves the class API focused on its existing operations and
keeps this as evidence that the remaining batch/paste cost should be addressed
inside existing insertion semantics or benchmark grouping, not by adding a weakly
justified method.
