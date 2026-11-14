# Remaining positive timing medians

Latest completed full guard: `two-slots` against checkpoint `fixed-table`
(`d3108d5`), five matched runs per build. Positive means more time per call.
This is not a full-matrix measurement of the later `staged-input` working tree.

Of 409 non-length timing rows, 127 have a positive median change (61 exceed
+5%) and 282 improve. Every positive row is listed below, including changes
under +5%. Paired changes compare corresponding runs; IQR is in percentage
points. These are observed timings, not a claim that every difference is a
reproducible regression.

See the [complete timing and space comparison](two-slots-performance.md),
[identical-code control](two-slots-aa-performance.md), and
[second checkpoint comparison](two-slots-control-performance.md).

| Group                 | Positive medians | Above +5% |
| --------------------- | ---------------: | --------: |
| Throughput            |               90 |        46 |
| Lifecycle editing     |                4 |         4 |
| Lifecycle checkpoints |                7 |         4 |
| Tuple benchmarks      |               26 |         7 |

## Throughput

| Method / checkpoint                     | Median change | Paired change | Paired IQR |
| --------------------------------------- | ------------: | ------------: | ---------: |
| throughput/1000/apply.duplicate         |       +14.13% |        +9.94% |   13.56 pp |
| throughput/10000/apply.duplicate        |        +3.28% |        +9.63% |   13.28 pp |
| throughput/15000/apply.duplicate        |       +14.96% |       +11.32% |    8.43 pp |
| throughput/25000/apply.duplicate        |        +2.30% |        +4.87% |    5.28 pp |
| throughput/1000/apply.duplicateRemove   |       +26.64% |       +23.59% |    4.02 pp |
| throughput/5000/apply.duplicateRemove   |        +0.40% |        +0.40% |    6.37 pp |
| throughput/15000/apply.duplicateRemove  |        +7.96% |        +9.62% |   14.81 pp |
| throughput/20000/apply.duplicateRemove  |       +11.68% |       +11.68% |   13.02 pp |
| throughput/25000/apply.duplicateRemove  |        +7.77% |       +18.60% |   16.34 pp |
| throughput/1000/apply.duplicateReplace  |       +31.20% |       +19.75% |   22.89 pp |
| throughput/15000/apply.duplicateReplace |        +0.89% |        +6.54% |    9.93 pp |
| throughput/20000/apply.duplicateReplace |        +2.44% |        +2.44% |   25.96 pp |
| throughput/100/apply.insert             |       +16.24% |       +16.24% |   27.82 pp |
| throughput/1000/apply.insert            |       +12.22% |       +13.51% |   10.71 pp |
| throughput/15000/apply.insert           |        +7.23% |        +5.16% |    8.73 pp |
| throughput/20000/apply.insert           |        +0.46% |        +2.92% |   12.44 pp |
| throughput/25000/apply.insert           |        +4.69% |        +4.69% |   14.57 pp |
| throughput/100/apply.remove             |        +4.51% |       +10.34% |    9.71 pp |
| throughput/1000/apply.remove            |        +9.41% |        +7.03% |    3.74 pp |
| throughput/25000/apply.remove           |        +1.91% |        +1.49% |    1.95 pp |
| throughput/5000/create.empty            |        +9.10% |       +21.00% |   31.45 pp |
| throughput/15000/create.empty           |       +19.93% |       +36.62% |   34.66 pp |
| throughput/20000/create.empty           |        +0.60% |        -8.21% |   16.58 pp |
| throughput/1000/create.sequence         |        +5.70% |        +5.70% |    5.78 pp |
| throughput/10000/create.sequence        |        +3.56% |        -1.79% |    2.59 pp |
| throughput/20000/create.sequence        |        +3.69% |        +2.58% |   12.71 pp |
| throughput/25000/create.sequence        |        +4.93% |        +1.09% |   17.00 pp |
| throughput/5000/insert.head             |        +1.10% |        +1.85% |   27.33 pp |
| throughput/1000/insert.tail             |        +4.88% |        +4.88% |    8.57 pp |
| throughput/15000/insert.tail            |        +5.63% |        -0.24% |   10.56 pp |
| throughput/20000/insert.tail            |       +10.40% |        -2.83% |   11.54 pp |
| throughput/1000/merge.duplicate         |        +5.81% |        +5.82% |   19.55 pp |
| throughput/25000/merge.duplicate        |        +1.94% |        +9.31% |   32.52 pp |
| throughput/100/merge.insert             |        +8.45% |        +6.77% |   19.70 pp |
| throughput/1000/merge.insert            |        +4.20% |        +7.21% |    5.03 pp |
| throughput/15000/merge.insert           |        +2.47% |        +0.37% |    8.70 pp |
| throughput/25000/merge.insert           |        +6.16% |       +10.12% |   16.14 pp |
| throughput/100/remove.head              |        +6.63% |        +7.05% |   12.79 pp |
| throughput/25000/remove.head            |        +0.72% |        -1.06% |   16.58 pp |
| throughput/100/remove.sameIndex         |        +1.88% |        -9.24% |   28.07 pp |
| throughput/100/remove.tail              |        +0.26% |        -3.76% |   19.85 pp |
| throughput/25000/remove.tail            |        +4.99% |        +4.85% |    9.06 pp |
| throughput/100/retire                   |       +18.64% |        +4.56% |   55.22 pp |
| throughput/5000/retire                  |        +5.73% |        +0.87% |    7.80 pp |
| throughput/15000/retire                 |        +0.08% |        +0.79% |    8.06 pp |
| throughput/20000/retire                 |        +0.04% |        +6.37% |   10.16 pp |
| throughput/25000/retire                 |        +4.52% |        +3.12% |   19.50 pp |
| throughput/5000/value.head              |        +2.30% |        +1.95% |    2.90 pp |
| throughput/10000/value.head             |        +0.79% |        +1.57% |    8.12 pp |
| throughput/20000/value.head             |        +6.56% |        +7.26% |    4.58 pp |
| throughput/5000/value.middle            |        +5.54% |        -0.37% |    6.32 pp |
| throughput/10000/value.middle           |        +3.03% |        +2.86% |    0.25 pp |
| throughput/20000/value.middle           |        +7.24% |        +4.76% |    8.33 pp |
| throughput/25000/value.middle           |        +5.15% |        -1.06% |   15.09 pp |
| throughput/1000/value.random            |        +2.89% |        +6.72% |    4.35 pp |
| throughput/5000/value.random            |        +5.74% |        +8.62% |   14.42 pp |
| throughput/20000/value.random           |        +4.27% |       +10.09% |   10.43 pp |
| throughput/25000/value.random           |        +6.78% |        +1.53% |    5.38 pp |
| throughput/100/value.sameIndex          |       +11.11% |        +4.02% |    9.53 pp |
| throughput/10000/value.sameIndex        |        +4.22% |        +4.94% |   31.44 pp |
| throughput/25000/value.sameIndex        |        +1.54% |        -3.25% |    4.85 pp |
| throughput/1000/value.tail              |        +1.62% |        +0.05% |    6.90 pp |
| throughput/5000/value.tail              |        +3.53% |        +1.88% |    8.50 pp |
| throughput/20000/value.tail             |        +9.86% |       +14.26% |   29.11 pp |
| throughput/100/values                   |        +3.30% |        +2.63% |   22.10 pp |
| throughput/5000/values                  |        +5.31% |        +7.06% |   12.19 pp |
| throughput/10000/values                 |        +4.06% |        -2.11% |   10.85 pp |
| throughput/15000/values                 |        +3.99% |        +1.02% |   12.36 pp |
| throughput/20000/values                 |        +7.91% |        +1.43% |   12.02 pp |
| throughput/25000/values                 |       +15.93% |       +15.93% |   14.30 pp |
| throughput/100/values.head              |       +19.14% |        +9.43% |   15.42 pp |
| throughput/1000/values.head             |        +6.18% |        +3.90% |   12.36 pp |
| throughput/5000/values.head             |        +3.23% |        +0.58% |   22.45 pp |
| throughput/20000/values.head            |       +19.73% |        -2.99% |   31.29 pp |
| throughput/100/values.middle            |        +7.83% |       +11.77% |    7.22 pp |
| throughput/15000/values.middle          |        +2.29% |        +4.98% |   27.56 pp |
| throughput/20000/values.middle          |       +11.41% |        +6.39% |   37.31 pp |
| throughput/100/values.random            |       +16.91% |       +11.46% |    4.35 pp |
| throughput/1000/values.random           |        +4.47% |        +4.33% |    4.05 pp |
| throughput/5000/values.random           |       +17.06% |        +5.66% |   20.26 pp |
| throughput/15000/values.random          |       +10.99% |       +13.73% |   21.98 pp |
| throughput/20000/values.random          |        +7.01% |        +4.94% |    7.76 pp |
| throughput/25000/values.random          |        +5.25% |        +6.37% |   16.93 pp |
| throughput/100/values.sameIndex         |        +6.98% |        +6.98% |   10.78 pp |
| throughput/15000/values.sameIndex       |        +2.88% |        -2.00% |    9.33 pp |
| throughput/20000/values.sameIndex       |        +3.58% |        -6.03% |   11.76 pp |
| throughput/100/values.tail              |        +6.20% |        +3.06% |   19.62 pp |
| throughput/1000/values.tail             |        +3.06% |        +4.13% |    2.59 pp |
| throughput/5000/values.tail             |        +2.24% |        +2.43% |   10.79 pp |
| throughput/15000/values.tail            |        +6.52% |        +3.76% |   19.79 pp |

## Lifecycle editing

| Method / checkpoint                 | Median change | Paired change | Paired IQR |
| ----------------------------------- | ------------: | ------------: | ---------: |
| lifecycle/scaleUp/replace.tail      |       +10.36% |        +6.18% |   15.71 pp |
| lifecycle/scaleDown/remove.head     |       +11.48% |       +11.45% |   16.96 pp |
| lifecycle/scaleDown/replace.head    |        +6.31% |        +2.42% |    5.67 pp |
| lifecycle/fullLifecycle/remove.head |       +11.48% |       +11.45% |   16.96 pp |

## Lifecycle checkpoints

| Method / checkpoint         | Median change | Paired change | Paired IQR |
| --------------------------- | ------------: | ------------: | ---------: |
| checkpoint/up/1000/values   |        +3.98% |        +3.98% |    7.78 pp |
| checkpoint/up/20000/create  |        +0.83% |        +3.47% |   11.19 pp |
| checkpoint/down/5000/create |        +1.75% |        +1.16% |   18.66 pp |
| checkpoint/down/1000/create |       +16.20% |        +7.10% |    9.16 pp |
| checkpoint/down/1000/values |        +5.07% |        +8.84% |   28.74 pp |
| checkpoint/down/0/create    |        +6.67% |        +1.48% |   24.10 pp |
| checkpoint/down/0/values    |       +18.56% |        +0.00% |   21.05 pp |

## Tuple benchmarks

| Method / checkpoint                  | Median change | Paired change | Paired IQR |
| ------------------------------------ | ------------: | ------------: | ---------: |
| tuple/tuple/2/create.sequence        |        +9.37% |        +3.18% |   17.86 pp |
| tuple/tuple/2/replace.random         |       +11.50% |       +11.40% |   15.18 pp |
| tuple/tuple/2/apply.replace          |        +4.41% |        +5.41% |    8.77 pp |
| tuple/projection/2/apply.duplicate   |        +7.84% |        +7.84% |   21.40 pp |
| tuple/tuple/2/apply.duplicate        |        +5.03% |        +0.30% |   19.62 pp |
| tuple/projection/2/value.random      |        +0.60% |        +1.68% |    2.12 pp |
| tuple/tuple/2/value.random           |        +5.46% |        +8.61% |    5.99 pp |
| tuple/projection/2/values            |        +1.39% |        +1.68% |    6.43 pp |
| tuple/tuple/2/values                 |        +1.82% |        +6.65% |    7.05 pp |
| tuple/tuple/2/sequence               |        +2.59% |        +5.77% |   19.01 pp |
| tuple/tuple/4/create.sequence        |        +0.03% |        +0.03% |    4.66 pp |
| tuple/tuple/4/apply.duplicate        |        +8.59% |        +8.59% |    8.77 pp |
| tuple/tuple/4/value.random           |        +1.23% |        +2.31% |    5.59 pp |
| tuple/tuple/4/sequence               |        +0.77% |        -4.02% |    5.56 pp |
| tuple/projection/8/create.sequence   |        +3.76% |        -1.04% |    7.16 pp |
| tuple/tuple/8/apply.replace          |        +0.86% |        -6.47% |    7.39 pp |
| tuple/tuple/8/apply.duplicate        |        +0.56% |        +0.23% |    3.77 pp |
| tuple/projection/8/value.random      |        +5.06% |        +1.69% |    3.82 pp |
| tuple/projection/8/values            |        +0.91% |        -0.96% |    1.38 pp |
| tuple/tuple/100/create.sequence      |        +0.51% |        +2.53% |    3.64 pp |
| tuple/tuple/100/apply.replace        |        +0.12% |        -1.84% |    8.24 pp |
| tuple/projection/100/apply.duplicate |        +1.51% |        -3.33% |   13.76 pp |
| tuple/tuple/100/apply.duplicate      |        +4.33% |        +1.20% |   10.37 pp |
| tuple/tuple/100/merge.duplicate      |        +2.70% |        +0.69% |    4.27 pp |
| tuple/projection/100/values          |        +2.79% |        -0.11% |    1.67 pp |
| tuple/tuple/100/values               |        +2.25% |        +0.77% |    2.35 pp |
