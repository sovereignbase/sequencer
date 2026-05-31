# Public Class Callback Direct Path

## Idea And Rationale

The remaining rank pressure is mostly in public `CRList` consumer read paths.
The class `find()` and `forEach()` methods already walk the live block
projection directly, but they always invoked callbacks with `Function.call()`.

Most hot benchmark and consumer callbacks do not pass a `thisArg`. In that
common case the same observable callback arguments can be delivered with a
direct function call:

- `predicate(value, index, this)` for `find()`
- `callback(value, index, this)` for `forEach()`

When `thisArg` is supplied, the old `.call(thisArg, ...)` path is retained.

This does not touch CRDT metadata, merge behavior, deletion behavior, snapshots,
hydration, or convergence state.

## Before Results

Targeted local median runs on the current baseline:

| Benchmark                               | CRList before | Best competitor before | Relative before |
| --------------------------------------- | ------------: | ---------------------: | --------------: |
| class / find near head                  |   0.000504 ms |  Automerge 0.000081 ms |     6.2x slower |
| class / find near middle                |   0.058027 ms |  Automerge 0.034600 ms |     1.7x slower |
| class / find near tail                  |   0.168350 ms |  Automerge 0.072694 ms |     2.3x slower |
| class / iterate visible values          |   0.129364 ms |                    n/a |             n/a |
| class / collect visible values to array |   0.128222 ms |                    n/a |             n/a |

The supplied full table had CRList at 4th on `class / find near head` by
ops/sec, and 3rd on `class / collect visible values to array`.

## After Results

Final targeted local runs after retaining the direct callback path:

| Benchmark                               | CRList after | Best competitor after | Relative after |
| --------------------------------------- | -----------: | --------------------: | -------------: |
| class / find near head                  |  0.000517 ms | Automerge 0.000112 ms |    4.6x slower |
| class / find near middle                |  0.046349 ms | Automerge 0.036315 ms |    1.3x slower |
| class / find near tail                  |  0.162978 ms | Automerge 0.074269 ms |    2.2x slower |
| class / iterate visible values          |  0.110535 ms | Automerge 0.069320 ms |    1.6x slower |
| class / collect visible values to array |  0.116795 ms | Automerge 0.065061 ms |    1.8x slower |

CRList-only 9-sample after smoke was stronger on the long scans:

| Benchmark                               | CRList after median |
| --------------------------------------- | ------------------: |
| class / find near middle                |         0.027434 ms |
| class / find near tail                  |         0.043062 ms |
| class / iterate visible values          |         0.086848 ms |
| class / collect visible values to array |         0.091576 ms |

Movement from the targeted baseline:

- `class / find near middle`: about 20.1% faster in the all-library median run.
- `class / find near tail`: about 3.2% faster in the all-library median run,
  and materially faster in the CRList-only smoke.
- `class / iterate visible values`: about 14.6% faster versus the local
  CRList-only before run.
- `class / collect visible values to array`: about 8.9% faster versus the local
  CRList-only before run.

`class / find near head` is too small to read from one run; the retained change
keeps it in the same sub-microsecond band and no longer ranked behind json-joy
in the after comparison.

## Rejected Variant

A `readIndex()` fast path for public numeric property reads was tested and
rejected. It made `class / read / head` and `class / read / middle` slower in
the targeted runs, so it was removed.

Moving the `thisArg` branch outside `forEach()` was also rejected because it
regressed `class / iterate visible values`.

## Verification

Targeted checks run during this round:

- `npx tsdown`
- targeted before/after benchmark passes for class find and visible collection

Full runtime verification is run separately after this archive note.

## Final Rationale

Retained.

The change is small, read-only, and convergence-neutral. It improves the public
class consumer scan path without adding state, changing deletion semantics, or
changing snapshot/hydration behavior.
