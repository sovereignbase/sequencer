# Historical percentage goal: endpointjump

Five complete matched runs of original e138158, baseline1c0a007 and the candidate.
All benchmark workloads, seeds, compiler settings and run counts match. Negative
latency changes are faster. Length is excluded: 409 timing rows remain.
The other full-suite reports retain every timing and space row with distributions.

## Sign changes

These counts describe medians, not statistical equivalence. A 5% cutoff below
selects a readable follow-up list; it does not prove smaller changes are noise.

- Earlier baseline wins against original: 307. Of these, 8 candidate medians now exceed original.
- Earlier baseline losses against original: 102. Of these, 96 shrink and 88 become wins.
- Candidate versus baseline: 372 medians faster, 37 slower.
- Earlier wins over 5% becoming losses over 5%: 0.
- Earlier losses over 5% that do not shrink: 1.

The requested condition is not established while these losses remain unresolved.
No aggregate or targeted speedup replaces the per-row comparison.

## Rows requiring follow-up

Nanoseconds/call. Includes every candidate loss over 5% against baseline, every
previous win over 5% now over 5% slower than original, and every previous loss
over 5% that fails to shrink.

| Row                             |     Original |     Baseline |    Candidate | Prior / original | Candidate / original | Candidate / baseline | Paired (IQR pp) |
| ------------------------------- | -----------: | -----------: | -----------: | ---------------: | -------------------: | -------------------: | --------------: |
| throughput/100/remove.middle    |      1,731.5 |     1,322.45 |     1,409.09 |          -23.62% |              -18.62% |               +6.55% |  +8.23% (26.41) |
| throughput/100/remove.sameIndex |     1,352.01 |      1,242.1 |     1,332.42 |           -8.13% |               -1.45% |               +7.27% |  +7.27% (44.73) |
| throughput/100/sequence         |       528.44 |       311.17 |       331.44 |          -41.12% |              -37.28% |               +6.51% |   +3.91% (7.88) |
| throughput/100/value.middle     |       322.36 |       269.42 |       304.54 |          -16.42% |               -5.53% |              +13.04% |  -2.41% (12.12) |
| throughput/100/value.random     |       229.36 |        220.8 |       245.67 |           -3.73% |               +7.11% |              +11.26% |    -0.04% (8.5) |
| throughput/100/value.sameIndex  |       200.19 |       177.11 |       209.54 |          -11.53% |               +4.67% |              +18.31% | +13.59% (19.16) |
| throughput/10000/values         | 1,208,897.66 | 1,242,803.91 | 1,451,789.84 |           +2.80% |              +20.09% |              +16.82% |  +6.87% (35.74) |
| throughput/15000/values         | 1,862,546.88 | 1,795,943.75 | 1,888,818.75 |           -3.58% |               +1.41% |               +5.17% |   +5.16% (7.32) |
| throughput/25000/values         | 3,586,634.38 | 3,290,959.38 | 3,482,796.88 |           -8.24% |               -2.90% |               +5.83% |   +9.71% (6.56) |
| lifecycle/scaleUp/value.head    |       360.84 |       343.36 |       363.37 |           -4.84% |               +0.70% |               +5.83% |   +5.92% (4.02) |
| lifecycle/scaleUp/value.tail    |       227.65 |       216.24 |       229.33 |           -5.01% |               +0.74% |               +6.05% |   +8.35% (6.41) |
| checkpoint/up/1000/sequence     |    2,594,200 |    2,595,800 |    2,884,800 |           +0.06% |              +11.20% |              +11.13% | +12.36% (19.82) |
| checkpoint/up/1000/values       |    1,614,800 |    1,635,800 |    1,775,900 |           +1.30% |               +9.98% |               +8.56% |  +4.98% (19.64) |
| checkpoint/up/5000/values       |    4,792,700 |    4,846,100 |    5,585,100 |           +1.11% |              +16.53% |              +15.25% | +15.25% (15.54) |
| checkpoint/up/20000/values      |   15,290,600 |   13,040,700 |   14,323,400 |          -14.71% |               -6.33% |               +9.84% |   +7.95% (5.84) |
| checkpoint/down/5000/sequence   |   11,722,600 |   12,322,000 |   12,533,400 |           +5.11% |               +6.92% |               +1.72% |  +0.88% (11.56) |
| checkpoint/down/0/sequence      |    1,409,600 |    1,430,500 |    1,596,900 |           +1.48% |              +13.29% |              +11.63% |   +7.02% (8.82) |
| tuple/tuple/2/value.random      |        18.58 |        18.41 |        19.42 |           -0.94% |               +4.50% |               +5.49% |   +5.44% (5.89) |
| tuple/projection/8/value.random |        55.93 |        52.61 |        55.28 |           -5.94% |               -1.18% |               +5.07% |   -2.39% (1.27) |

Raw matched samples and the complete row matrix are retained under
`temp/optimization_2026_11_11`. No external benchmark or competitor was changed.
