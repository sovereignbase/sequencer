# Lifecycle optimization experiments — 2026-09-15

Target:

```text
hot edit and ingest maximum latency < 100 µs
cold create / values / snapshot maximum latency < 50,000 µs
preferred cold latency < 1,000 µs
0 -> 10,000 -> 0 lifecycle approximately one second
eventual scale: 1,000,000 visible Strips
```

ACK and Frontier observation remains part of successful ingest. Public API and
replicated results are immutable. Caches must remain bounded by current runtime
state.

## Experiments

| Experiment                                                                     | Decision  | Main result                                                        |
| ------------------------------------------------------------------------------ | --------- | ------------------------------------------------------------------ |
| [Baseline](details.zip '00_BASELINE.md')                                       | reference | create@1k 82.7 ms; scale-down did not finish in 60 s               |
| [Linear create-GC](details.zip '01_LINEAR_CREATE_GC.md')                       | retained  | create@1k 40.7 ms, 50.8% faster                                    |
| [Projected endpoint cache](details.zip '02_PROJECTED_ENDPOINT_CACHE.md')       | rejected  | warmup regressed from 1.9 s to over 40 s                           |
| [Gate/no-diff early return](details.zip '03_GATE_EARLY_RETURN.md')             | rejected  | prevented useful jump construction; tailRemove@300 250.1 µs        |
| [Position-directed Mask Gate](details.zip '04_POSITION_DIRECTED_MASK_GATE.md') | rejected  | navigation invariant failed: expected 30, received 513             |
| [Bidirectional Mask Gate](details.zip '05_BIDIRECTIONAL_MASK_GATE.md')         | rejected  | navigation invariant failed: expected 30, received 513             |
| [Zero-visible jump skip](details.zip '06_ZERO_VISIBLE_JUMP_SKIP.md')           | rejected  | 300 lifecycle regressed from 2.57 s to over 30 s before 100 Strips |
| [Final retained state](details.zip '07_FINAL_RETAINED_STATE.md')               | verified  | linear GC only; build and 23/23 tests pass                         |

Current source retains only the linear create-GC experiment. All navigation and
endpoint-cache experiments were fully reverted.

## Archived files

[details.zip](details.zip) contains the original reports, source files and measurements
with their original directory structure. `MANIFEST.sha256` records every file hash.
Temporary workspace paths in historical reports identify provenance, not included directories.
