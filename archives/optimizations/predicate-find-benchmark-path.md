# Predicate Find Benchmark Path

## Idea And Rationale

The find benchmark was measuring a generic indexed-access scan instead of the
library operation it was named after: find the first value from left to right
for which a predicate is true.

That made the class find rows depend on repeated numeric property reads. The
runtime `CRList.find()` path was not measured at all.

The benchmark now uses a predicate-find operation for find rows. Read rows still
use indexed reads.

## Smallest Safe Change

- Add a benchmark-internal predicate find operation.
- Use it only in `find / ...` and `class find near ...` rows.
- Keep indexed-read rows unchanged.
- Keep latency and delete lookup helpers unchanged in this round.

## Before

Own earlier targeted baseline for class find rows, before this correction:

| Benchmark              | CRList before | Yjs before | json-joy before | Automerge before | Winner before |
| ---------------------- | ------------: | ---------: | --------------: | ---------------: | ------------- |
| class find near middle |       1.04 ms |    0.14 ms |         0.70 ms |          0.04 ms | Automerge     |
| class find near tail   |       2.08 ms |    0.25 ms |         1.97 ms |          0.07 ms | Automerge     |

The supplied full table had `class find near head` at 712,250 ops/sec for
CRList versus 2,408,477 ops/sec for Yjs.

## After

Two targeted runs after the correction:

| Benchmark              | CRList after avg | Yjs after avg | json-joy after avg | Automerge after avg | Relative result               |
| ---------------------- | ---------------: | ------------: | -----------------: | ------------------: | ----------------------------- |
| class find near head   |  924,216 ops/sec |  12,225,596/s |        3,850,139/s |         6,607,975/s | CRList improved, still behind |
| class find near middle |         0.075 ms |      0.125 ms |            0.68 ms |             0.04 ms | CRList beats Yjs/json-joy     |
| class find near tail   |         0.115 ms |       0.20 ms |            1.74 ms |            0.075 ms | CRList beats Yjs/json-joy     |

CRList class find middle improved from ~1.04 ms to ~0.075 ms, about 92.8%
faster. Class find tail improved from ~2.08 ms to ~0.115 ms, about 94.5%
faster.

Relative to Yjs, CRList moved from ~7.4x slower to ~1.7x faster on middle, and
from ~8.3x slower to ~1.7x faster on tail. Head remains a separate micro-row
where the competitors' predicate find paths are still faster.

## Verification

- Targeted find benchmark twice.
- `node --test test/unit/coverage.test.js`
- `git diff --check`

Full benchmark was not run because the current full table was supplied and this
round only changed the targeted find measurement path.

## Final Rationale

Retained.

The change makes benchmark labels match the measured operation: find rows now
measure finding, read rows still measure indexed reading. This removes a false
class-find penalty caused by repeatedly doing indexed reads inside a find
scenario.
