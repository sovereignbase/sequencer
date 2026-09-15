# Baseline

Date: 2026-09-15

## Command

```text
node --expose-gc --experimental-strip-types benchmark/index.ts \
  --runs 1 --max-strips 100 --warmup-cycles 8 --no-output
```

## 100-Strip result

| operation     | average µs | maximum µs |
| ------------- | ---------: | ---------: |
| tailInsert    |      9.494 |     71.600 |
| headInsert    |      8.256 |     44.800 |
| randomFind    |      2.914 |    102.400 |
| randomRemove  |     14.176 |     76.400 |
| randomReplace |     17.020 |    171.900 |
| randomInsert  |     11.012 |    124.900 |
| randomIngest  |     29.709 |    127.800 |

The complete 100 -> 0 scope measured tailRemove at 35.058 µs average,
randomReplace at 23.244 µs, and randomIngest at 28.761 µs. Individual hot-path
outliers already exceeded 100 µs.

## 1,000-Strip scale probe

```text
visible Strips: 1,000
retained Deltas: 10,336
Frames: 50,842
create(snapshot): 82,702.5 µs
values: 2,531.5 µs
snapshot: 4,369.4 µs
```

Hot scale-up averages remained 3.807–34.557 µs, but maximum samples were
312.3–1,731.9 µs. The process did not reach the next scale-down checkpoint in
another minute and was stopped.
