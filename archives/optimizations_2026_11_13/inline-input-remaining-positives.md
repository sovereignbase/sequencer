# inline-input: remaining positive timing medians

Five complete matched runs against checkpoint `fixed-table` (`d3108d5`).
Positive means more time per call. Length is excluded as requested.

Of 409 timing rows, 184 have positive median changes,
including 139 over +5%; 225 have negative changes.
Every positive row is retained below. These observed signs do not by themselves
establish reproducible regressions.

See the [complete comparison](inline-input-performance.md),
[identical-code control](inline-input-aa-performance.md) and
[second checkpoint comparison](inline-input-control-performance.md).

| Group                 | Positive medians | Above +5% |
| --------------------- | ---------------: | --------: |
| Throughput            |              128 |        98 |
| Lifecycle editing     |                8 |         3 |
| Lifecycle checkpoints |                5 |         3 |
| Tuple benchmarks      |               43 |        35 |

## Throughput

| Method / checkpoint                     | Median change | Paired change | Paired IQR | Slower in every pair |
| --------------------------------------- | ------------: | ------------: | ---------: | :------------------- |
| throughput/100/apply.duplicate          |       +22.65% |       +13.66% |   61.15 pp |                      |
| throughput/1000/apply.duplicate         |        +8.23% |        +8.35% |   51.11 pp |                      |
| throughput/5000/apply.duplicate         |        +9.40% |       +10.29% |   49.40 pp |                      |
| throughput/10000/apply.duplicate        |       +12.70% |        +2.25% |   35.94 pp |                      |
| throughput/15000/apply.duplicate        |       +20.12% |        +6.14% |   22.14 pp |                      |
| throughput/20000/apply.duplicate        |        +3.19% |        +5.70% |   13.43 pp |                      |
| throughput/25000/apply.duplicate        |       +15.51% |       +14.91% |    0.93 pp | yes                  |
| throughput/100/apply.duplicateRemove    |        +0.64% |        +5.85% |   22.97 pp |                      |
| throughput/5000/apply.duplicateRemove   |        +4.16% |        -6.85% |   28.89 pp |                      |
| throughput/10000/apply.duplicateRemove  |       +32.84% |       +32.84% |   53.59 pp |                      |
| throughput/15000/apply.duplicateRemove  |        +4.49% |        +4.53% |   24.56 pp |                      |
| throughput/25000/apply.duplicateRemove  |       +67.58% |       +65.05% |   55.99 pp | yes                  |
| throughput/100/apply.duplicateReplace   |       +46.64% |       +44.00% |   55.46 pp |                      |
| throughput/5000/apply.duplicateReplace  |       +36.93% |       +35.20% |  203.51 pp | yes                  |
| throughput/10000/apply.duplicateReplace |        +3.90% |        -8.07% |   25.35 pp |                      |
| throughput/15000/apply.duplicateReplace |       +10.63% |       +22.10% |   42.11 pp |                      |
| throughput/20000/apply.duplicateReplace |        +5.12% |        -6.17% |   10.75 pp |                      |
| throughput/25000/apply.duplicateReplace |       +23.10% |       +15.36% |   14.30 pp |                      |
| throughput/100/apply.insert             |       +19.86% |        +9.10% |   47.90 pp |                      |
| throughput/5000/apply.insert            |       +67.63% |       +67.63% |   75.50 pp |                      |
| throughput/15000/apply.insert           |        +6.08% |        +6.08% |   34.01 pp |                      |
| throughput/5000/apply.remove            |        +4.99% |        +2.68% |    1.98 pp |                      |
| throughput/25000/apply.remove           |        +6.08% |        -6.19% |   32.51 pp |                      |
| throughput/100/create.empty             |       +29.23% |       +29.23% |   21.72 pp |                      |
| throughput/5000/create.empty            |       +21.69% |       +24.25% |    5.39 pp |                      |
| throughput/10000/create.empty           |        +6.53% |       +30.21% |   37.20 pp |                      |
| throughput/15000/create.empty           |       +18.73% |        -6.72% |   25.74 pp |                      |
| throughput/100/create.sequence          |       +28.57% |       +42.68% |   49.85 pp |                      |
| throughput/1000/create.sequence         |       +11.99% |       +16.24% |    4.48 pp |                      |
| throughput/5000/create.sequence         |        +2.06% |       +14.95% |   66.16 pp |                      |
| throughput/10000/create.sequence        |        +6.81% |        +6.81% |   13.47 pp |                      |
| throughput/20000/create.sequence        |        +1.07% |        +0.32% |    3.73 pp |                      |
| throughput/25000/create.sequence        |       +21.25% |        -3.98% |   25.74 pp |                      |
| throughput/100/insert.head              |       +27.63% |        -1.75% |   39.83 pp |                      |
| throughput/5000/insert.head             |        +0.94% |        +0.94% |   19.53 pp |                      |
| throughput/25000/insert.head            |        +3.60% |       +15.06% |   43.31 pp |                      |
| throughput/100/insert.middle            |        +5.32% |       +24.49% |   86.18 pp |                      |
| throughput/5000/insert.middle           |       +14.55% |       +14.55% |   22.37 pp |                      |
| throughput/25000/insert.middle          |        +5.78% |        -4.71% |   23.26 pp |                      |
| throughput/10000/insert.sameIndex       |        +5.13% |        +6.86% |   22.58 pp |                      |
| throughput/100/insert.tail              |        +3.69% |        +1.79% |   72.83 pp |                      |
| throughput/1000/insert.tail             |        +0.27% |       +14.22% |   58.66 pp |                      |
| throughput/5000/insert.tail             |       +11.87% |       +11.87% |    8.09 pp |                      |
| throughput/15000/insert.tail            |        +2.40% |        -1.03% |   16.66 pp |                      |
| throughput/20000/insert.tail            |        +1.10% |        +1.30% |   31.52 pp |                      |
| throughput/100/merge.duplicate          |       +27.80% |       +27.80% |   93.75 pp |                      |
| throughput/5000/merge.duplicate         |       +12.98% |        +9.74% |   25.34 pp |                      |
| throughput/10000/merge.duplicate        |       +14.41% |        +6.66% |   19.21 pp |                      |
| throughput/20000/merge.duplicate        |       +45.82% |       +33.32% |   66.58 pp |                      |
| throughput/1000/merge.insert            |        +5.09% |        +2.09% |   28.98 pp |                      |
| throughput/5000/merge.insert            |       +14.83% |       +26.26% |   14.34 pp | yes                  |
| throughput/15000/merge.insert           |        +8.98% |        +8.38% |   45.52 pp |                      |
| throughput/20000/merge.insert           |        +4.02% |        -1.75% |   13.44 pp |                      |
| throughput/100/remove.head              |        +8.54% |       +22.19% |   22.17 pp |                      |
| throughput/5000/remove.head             |       +30.60% |       +30.60% |   35.21 pp |                      |
| throughput/100/remove.random            |       +29.86% |       +59.63% |  122.25 pp |                      |
| throughput/5000/remove.random           |        +1.61% |       -12.77% |   52.51 pp |                      |
| throughput/100/remove.sameIndex         |        +6.63% |        +3.91% |   26.39 pp |                      |
| throughput/5000/remove.sameIndex        |        +6.08% |        +1.74% |   41.91 pp |                      |
| throughput/15000/remove.sameIndex       |        +6.70% |        +9.38% |   30.20 pp |                      |
| throughput/20000/remove.sameIndex       |        +1.02% |        -5.35% |   13.24 pp |                      |
| throughput/100/remove.tail              |        +5.88% |        -2.87% |   45.14 pp |                      |
| throughput/5000/remove.tail             |       +11.96% |        +5.92% |    2.32 pp |                      |
| throughput/15000/remove.tail            |       +14.73% |       +18.75% |   21.12 pp |                      |
| throughput/100/replace.head             |        +9.91% |       +18.03% |   55.02 pp |                      |
| throughput/100/replace.middle           |        +7.27% |       +16.23% |   93.55 pp |                      |
| throughput/5000/replace.tail            |        +2.65% |        -2.05% |   34.35 pp |                      |
| throughput/1000/retire                  |        +5.93% |        +7.58% |    5.97 pp |                      |
| throughput/5000/retire                  |       +20.06% |       +18.17% |   28.88 pp |                      |
| throughput/10000/retire                 |        +4.78% |        +0.25% |   16.71 pp |                      |
| throughput/20000/retire                 |        +7.76% |        +2.78% |    3.58 pp |                      |
| throughput/25000/retire                 |        +1.05% |        -1.84% |   33.92 pp |                      |
| throughput/10000/sequence               |       +10.45% |        +2.04% |   10.89 pp |                      |
| throughput/1000/value.head              |        +0.70% |        +0.70% |   69.80 pp |                      |
| throughput/10000/value.head             |       +14.98% |       +14.98% |   12.92 pp |                      |
| throughput/20000/value.head             |        +7.86% |        +8.79% |   49.02 pp |                      |
| throughput/25000/value.head             |       +13.69% |       +16.43% |   13.42 pp |                      |
| throughput/100/value.middle             |        +7.35% |        +8.50% |   30.87 pp |                      |
| throughput/1000/value.middle            |        +2.22% |        -6.64% |   81.81 pp |                      |
| throughput/5000/value.middle            |        +4.21% |       +31.05% |   66.27 pp |                      |
| throughput/10000/value.middle           |       +31.91% |       +17.96% |   11.62 pp | yes                  |
| throughput/15000/value.middle           |       +19.93% |        +7.09% |   12.40 pp |                      |
| throughput/20000/value.middle           |       +34.35% |       +27.63% |   31.51 pp |                      |
| throughput/25000/value.middle           |       +18.84% |       +54.74% |   73.12 pp |                      |
| throughput/1000/value.random            |        +5.79% |        +3.95% |   47.77 pp |                      |
| throughput/5000/value.random            |       +25.56% |       +23.88% |   19.66 pp |                      |
| throughput/10000/value.random           |        +7.80% |       +11.86% |   21.99 pp |                      |
| throughput/15000/value.random           |        +6.28% |        +8.15% |   28.66 pp |                      |
| throughput/20000/value.random           |       +23.99% |       +12.27% |   45.67 pp |                      |
| throughput/25000/value.random           |        +4.96% |        -0.85% |   16.04 pp |                      |
| throughput/100/value.sameIndex          |        +5.19% |        -3.23% |   69.71 pp |                      |
| throughput/5000/value.sameIndex         |       +37.11% |       +48.95% |   39.58 pp |                      |
| throughput/10000/value.sameIndex        |       +20.60% |       +29.75% |   48.34 pp |                      |
| throughput/15000/value.sameIndex        |       +50.89% |       +50.89% |   27.14 pp |                      |
| throughput/20000/value.sameIndex        |       +10.84% |       +11.38% |   31.56 pp | yes                  |
| throughput/25000/value.sameIndex        |        +1.20% |        +0.71% |   24.79 pp |                      |
| throughput/100/value.tail               |       +10.22% |       +22.65% |   24.32 pp |                      |
| throughput/1000/value.tail              |        +2.43% |        +2.43% |   56.48 pp |                      |
| throughput/5000/value.tail              |        +3.68% |        -7.85% |   33.93 pp |                      |
| throughput/10000/value.tail             |       +23.76% |       +19.31% |   41.55 pp |                      |
| throughput/15000/value.tail             |       +24.96% |       +18.97% |   36.68 pp |                      |
| throughput/20000/value.tail             |       +20.00% |       +16.17% |   11.84 pp | yes                  |
| throughput/25000/value.tail             |       +27.93% |       +18.59% |   28.50 pp |                      |
| throughput/100/values                   |       +10.16% |       +12.90% |   19.92 pp |                      |
| throughput/5000/values                  |       +12.35% |        +9.49% |   17.45 pp |                      |
| throughput/15000/values                 |        +8.18% |       +12.92% |   25.42 pp |                      |
| throughput/20000/values                 |       +23.59% |        +7.09% |    8.07 pp | yes                  |
| throughput/100/values.head              |        +5.63% |        +4.06% |   63.17 pp |                      |
| throughput/1000/values.head             |       +37.14% |       +18.57% |   83.89 pp |                      |
| throughput/10000/values.head            |       +24.73% |       +13.50% |   12.61 pp |                      |
| throughput/15000/values.head            |       +25.48% |       +17.40% |   21.15 pp |                      |
| throughput/20000/values.head            |       +13.44% |       +13.06% |   28.44 pp | yes                  |
| throughput/5000/values.middle           |        +2.12% |        -7.11% |   12.14 pp |                      |
| throughput/10000/values.middle          |       +11.74% |        +8.06% |   13.83 pp |                      |
| throughput/15000/values.middle          |       +13.69% |       +15.74% |   20.37 pp |                      |
| throughput/20000/values.middle          |       +11.47% |       +11.84% |   22.26 pp |                      |
| throughput/20000/values.random          |       +13.85% |       +13.51% |   22.28 pp |                      |
| throughput/100/values.sameIndex         |       +21.50% |       +19.72% |   68.96 pp |                      |
| throughput/1000/values.sameIndex        |        +9.36% |        +2.45% |   28.11 pp |                      |
| throughput/5000/values.sameIndex        |        +4.49% |        -3.31% |    6.83 pp |                      |
| throughput/10000/values.sameIndex       |       +24.51% |       +16.71% |   12.78 pp | yes                  |
| throughput/15000/values.sameIndex       |       +18.05% |       +17.36% |   35.85 pp |                      |
| throughput/20000/values.sameIndex       |       +19.67% |       +19.67% |   30.14 pp |                      |
| throughput/100/values.tail              |       +32.00% |       +30.72% |   66.38 pp |                      |
| throughput/10000/values.tail            |        +5.28% |       +16.47% |   15.66 pp |                      |
| throughput/15000/values.tail            |        +1.93% |        +1.93% |   20.47 pp |                      |
| throughput/20000/values.tail            |       +21.59% |       +20.91% |   27.36 pp |                      |
| throughput/25000/values.tail            |        +9.75% |       +10.40% |   38.82 pp |                      |

## Lifecycle editing

| Method / checkpoint                  | Median change | Paired change | Paired IQR | Slower in every pair |
| ------------------------------------ | ------------: | ------------: | ---------: | :------------------- |
| lifecycle/scaleUp/insert.head        |        +3.27% |        -0.37% |   26.14 pp |                      |
| lifecycle/scaleUp/replace.tail       |        +0.77% |        +0.77% |   31.67 pp |                      |
| lifecycle/scaleDown/remove.head      |       +13.93% |       +14.10% |   16.44 pp |                      |
| lifecycle/scaleDown/replace.head     |       +11.00% |        +9.31% |    9.81 pp |                      |
| lifecycle/fullLifecycle/insert.head  |        +3.27% |        -0.37% |   26.14 pp |                      |
| lifecycle/fullLifecycle/remove.head  |       +13.93% |       +14.10% |   16.44 pp |                      |
| lifecycle/fullLifecycle/replace.head |        +4.28% |        +5.77% |   26.34 pp |                      |
| lifecycle/fullLifecycle/value.head   |        +2.02% |        -6.23% |   25.89 pp |                      |

## Lifecycle checkpoints

| Method / checkpoint          | Median change | Paired change | Paired IQR | Slower in every pair |
| ---------------------------- | ------------: | ------------: | ---------: | :------------------- |
| checkpoint/up/20000/create   |        +4.27% |        +3.41% |   18.29 pp |                      |
| checkpoint/down/15000/create |       +12.73% |        -1.04% |   24.34 pp |                      |
| checkpoint/down/1000/create  |       +10.39% |       +10.39% |   45.59 pp |                      |
| checkpoint/down/0/create     |       +29.82% |       +12.14% |   37.26 pp | yes                  |
| checkpoint/down/0/values     |        +4.65% |        +4.65% |   28.05 pp |                      |

## Tuple benchmarks

| Method / checkpoint                  | Median change | Paired change | Paired IQR | Slower in every pair |
| ------------------------------------ | ------------: | ------------: | ---------: | :------------------- |
| tuple/tuple/2/create.sequence        |        +3.51% |        +9.37% |   24.63 pp |                      |
| tuple/projection/2/apply.duplicate   |        +4.63% |        -4.39% |    8.78 pp |                      |
| tuple/projection/2/value.random      |       +12.74% |       +21.05% |   26.45 pp |                      |
| tuple/tuple/2/value.random           |        +5.58% |        +0.24% |   29.76 pp |                      |
| tuple/projection/2/values            |        +6.21% |       -13.08% |   93.19 pp |                      |
| tuple/tuple/2/values                 |       +13.89% |       +29.27% |   13.47 pp |                      |
| tuple/projection/2/sequence          |       +16.40% |       +23.25% |   35.47 pp |                      |
| tuple/projection/4/replace.random    |        +4.20% |        +8.14% |   24.96 pp |                      |
| tuple/tuple/4/replace.random         |        +9.12% |        +9.12% |   42.28 pp |                      |
| tuple/projection/4/apply.duplicate   |        +5.30% |        +5.30% |   15.07 pp |                      |
| tuple/projection/4/value.random      |        +0.48% |        +9.70% |   35.36 pp |                      |
| tuple/projection/4/values            |       +10.58% |       +10.73% |   40.83 pp |                      |
| tuple/tuple/4/sequence               |        +7.33% |       +36.37% |   53.17 pp |                      |
| tuple/projection/8/create.empty      |       +33.47% |       +17.77% |   55.00 pp |                      |
| tuple/projection/8/create.sequence   |       +15.02% |       +13.02% |   42.11 pp |                      |
| tuple/tuple/8/create.sequence        |        +4.36% |       -12.79% |   38.23 pp |                      |
| tuple/projection/8/replace.random    |       +11.81% |       +15.00% |   31.31 pp |                      |
| tuple/tuple/8/replace.random         |        +7.66% |        +4.15% |    6.66 pp |                      |
| tuple/tuple/8/apply.replace          |        +3.92% |        +3.15% |    2.93 pp |                      |
| tuple/projection/8/apply.duplicate   |       +39.89% |       +32.64% |   22.77 pp |                      |
| tuple/tuple/8/apply.duplicate        |       +19.38% |       +34.82% |   10.90 pp | yes                  |
| tuple/projection/8/value.random      |        +2.20% |       +20.14% |   99.16 pp |                      |
| tuple/tuple/8/value.random           |       +20.26% |       +11.67% |   37.51 pp | yes                  |
| tuple/projection/8/values            |       +48.88% |       +33.38% |   63.51 pp |                      |
| tuple/tuple/8/values                 |       +27.75% |       +14.60% |  125.03 pp |                      |
| tuple/projection/8/sequence          |       +18.16% |       +43.55% |   44.34 pp | yes                  |
| tuple/tuple/8/sequence               |       +36.76% |       +32.01% |    9.11 pp | yes                  |
| tuple/projection/100/create.empty    |       +38.14% |       +47.49% |   58.10 pp |                      |
| tuple/tuple/100/create.empty         |       +99.63% |       +78.91% |  111.55 pp |                      |
| tuple/projection/100/create.sequence |       +40.37% |       +19.80% |  102.52 pp |                      |
| tuple/tuple/100/create.sequence      |       +34.31% |       +50.84% |  120.86 pp |                      |
| tuple/projection/100/replace.random  |       +22.22% |       +15.17% |   36.17 pp |                      |
| tuple/tuple/100/replace.random       |       +14.93% |       +21.27% |   32.48 pp |                      |
| tuple/tuple/100/apply.replace        |       +21.56% |        +6.63% |   41.07 pp |                      |
| tuple/projection/100/apply.duplicate |        +9.07% |        -3.25% |   41.06 pp |                      |
| tuple/tuple/100/apply.duplicate      |       +17.46% |        -1.02% |   26.36 pp |                      |
| tuple/projection/100/merge.duplicate |       +23.49% |        +4.90% |   38.81 pp |                      |
| tuple/tuple/100/merge.duplicate      |       +27.80% |       +23.19% |   89.34 pp |                      |
| tuple/tuple/100/value.random         |       +20.12% |       +25.03% |   18.28 pp |                      |
| tuple/projection/100/values          |        +2.59% |        -0.85% |   39.63 pp |                      |
| tuple/tuple/100/values               |       +20.24% |       +21.83% |    3.31 pp |                      |
| tuple/projection/100/sequence        |       +12.57% |       +12.57% |   18.70 pp | yes                  |
| tuple/tuple/100/sequence             |        +6.57% |        +8.37% |   50.09 pp |                      |
