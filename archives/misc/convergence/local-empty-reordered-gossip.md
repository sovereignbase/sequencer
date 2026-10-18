# Empty local views and delayed Gossip

18 October 2026. Baseline: `44ed0c526887a77d0a82004d8377bbb349dc9f67` (1.0.0).

[Issue #2](https://github.com/sovereignbase/sequencer/issues/2) reports `length() === 14` while `values().length === 7` after disconnected edits and reordered, duplicate Gossip.

## Cause and correction

`insert()` called `insert_first()` whenever the visible Frame count was zero. That helper replaced the structural head and reset the structural count even when retained history still existed. Containment still resolved old anchors, so delayed Insertions could grow the visible count on a chain disconnected from the new root.

The correction distinguishes empty visible content from absent history. A new root in retained history uses normal sibling placement and jump indexing. Only a genuinely empty structure uses `insert_first()`. The production source change is nine added lines and one replaced line in `algorithms/insert.cpp`; the embedded WASM is rebuilt.

No public API, wire format, storage field, local validation or per-read bookkeeping is added. Nonempty-view editing paths keep their existing algorithms. The formerly broken path now preserves history required for correct replay; discarding that history is not a valid performance baseline for that path.

## Verification

The three new public-API regressions failed against the original embedded WASM and pass with the correction. Two small cases deliver an insertion at either end of a removed origin after a new local root. They check both live peers, duplicate delivery, and snapshots before and after delayed delivery. The full case exercises the reported 60-edit history with three registered Actors, indexed reads, shuffled duplicate delivery, fresh replay and hydration.

- 181 Vitest tests passed across 45 files; TypeScript coverage is 100% for statements, branches, functions and lines.
- 88 compatibility checks passed. Firefox could not launch because its matching Playwright executable is absent locally.
- Typechecking and C++ formatting checks passed.

## Performance measurements

Measured on Node 24.16.0, V8 13.6.233.17-node.49, win32 x64, Intel(R) Core(TM) i5-10210U CPU @ 1.60GHz.

The existing throughput fixtures cover all 39 API cases. A paired comparison used the same initial Sequence for both implementations at 100, 1,000, 5,000 and 25,000 workload groups, three runs each, alternating execution order (468 pairs). Its geometric mean throughput ratio was **0.9902×**. Independently timed whole-suite runs varied substantially even for unchanged `length()`; they do not establish a regression or an improvement.

The warmed comparison below retained each runtime across three warmup fixtures and twelve alternating measured pairs per case at 1,000 workload groups. It reused the existing fixture and burst implementations. Scalar reads repeated prepared inputs for at least 50 ms; setup, observations, explicit JS process garbage collection and destruction remained outside timings. The geometric mean across cases was **1.0219×**. This aggregate does not demonstrate an improvement in every method. Both the geometric mean and median of paired ratios are included so occasional slow bursts remain visible.

Positive changes mean higher ops/s. These are measurements of this patch, not claims of algorithmic improvements to unchanged methods.

| Case                     | Paired geometric mean change | Paired median change |
| ------------------------ | ---------------------------: | -------------------: |
| `apply.duplicate`        |                       +1.07% |               +2.35% |
| `apply.duplicateRemove`  |                       +3.85% |               +1.73% |
| `apply.duplicateReplace` |                       -1.36% |               +0.33% |
| `apply.insert`           |                       -0.83% |               -1.12% |
| `apply.remove`           |                       +0.69% |               -2.01% |
| `apply.replace`          |                       -2.35% |               -3.23% |
| `create.empty`           |                      +16.91% |              +18.85% |
| `create.sequence`        |                       +2.00% |               -0.67% |
| `insert.head`            |                       +1.58% |               -5.99% |
| `insert.middle`          |                       -8.75% |               -7.05% |
| `insert.random`          |                       -4.46% |               -4.50% |
| `insert.sameIndex`       |                       -0.27% |               +1.19% |
| `insert.tail`            |                       -4.13% |               -5.03% |
| `length`                 |                       -0.37% |               +1.15% |
| `merge.duplicate`        |                      +10.79% |               +6.49% |
| `merge.insert`           |                       -0.68% |               -0.69% |
| `remove.head`            |                       -1.18% |               -1.43% |
| `remove.middle`          |                       +1.36% |               -0.24% |
| `remove.random`          |                       +5.36% |               +0.29% |
| `remove.sameIndex`       |                       +2.87% |               +1.10% |
| `remove.tail`            |                       +3.44% |               +1.47% |
| `replace.head`           |                       +1.97% |               +3.80% |
| `replace.middle`         |                       -0.48% |               -0.66% |
| `replace.random`         |                       -2.50% |               -1.38% |
| `replace.sameIndex`      |                       +2.61% |               +2.42% |
| `replace.tail`           |                       +3.90% |               +6.48% |
| `retire`                 |                      +67.60% |             +103.49% |
| `sequence`               |                       -6.94% |               -3.59% |
| `value.head`             |                       +1.54% |               +2.30% |
| `value.middle`           |                       +1.75% |               +0.54% |
| `value.random`           |                       +6.53% |               +5.94% |
| `value.sameIndex`        |                       -0.58% |               -3.45% |
| `value.tail`             |                       -1.74% |               -3.35% |
| `values`                 |                       -0.15% |               -2.15% |
| `values.head`            |                       +0.94% |               +3.83% |
| `values.middle`          |                       +1.84% |               +1.26% |
| `values.random`          |                       +3.05% |               +5.22% |
| `values.sameIndex`       |                       +0.09% |               -2.72% |
| `values.tail`            |                       -1.01% |               +0.73% |

The two initially consistent negative results were checked again with forty warmed, alternating pairs per case. Their 95% intervals below use the paired log-ratio mean and Student t (39 degrees of freedom); both include unchanged throughput.

| Case            | Paired geometric mean change | Approximate 95% interval |
| --------------- | ---------------------------: | -----------------------: |
| `apply.replace` |                       +0.62% |         -1.11% to +2.39% |
| `insert.random` |                       -0.76% |         -3.98% to +2.56% |

No repeatable throughput regression was established by those follow-up measurements. Strict improvement across all metrics was not established either. No unrelated hot-path changes were made to chase noisy timings.

The unmodified benchmark CLI can reproduce the standard workload controls:

```powershell
node --expose-gc benchmark/index.ts --suite throughput --max-strips 5000 --runs 3 --no-output
node --expose-gc benchmark/index.ts --suite lifecycle --max-strips 5000 --runs 3 --no-output
```

## Memory and bundle size

All twelve lifecycle memory observations (three runs, four checkpoints) were byte-identical between versions. The model measures one instance: the complete WASM linear-memory buffer plus eight bytes per retained JS array slot. It excludes application value objects and JS engine bookkeeping.

| Checkpoint | Baseline KiB, mean | Corrected KiB, mean |
| ---------- | -----------------: | ------------------: |
| ↑ 1,000    |            5343.67 |             5343.67 |
| ↑ 5,000    |           25100.58 |            25100.58 |
| ↓ 1,000    |           46370.40 |            46370.40 |
| ↓ 0        |           48408.35 |            48408.35 |

The rebuilt ESM bundle changes as follows (bytes; Terser with three passes, gzip level nine):

| Bundle          | Baseline | Corrected | Difference |
| --------------- | -------: | --------: | ---------: |
| Raw             |  126,801 |   126,853 |        +52 |
| Minified        |  102,444 |   102,497 |        +53 |
| Minified + gzip |   36,934 |    36,982 |        +48 |

Snapshot encodings remain unchanged. Independently generated native Session IDs vary, so small JSON or compressed-size differences between independent histories do not measure a format change. The correction makes previously disconnected retained history available to export again.
