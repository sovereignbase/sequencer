# Class Batch Append, Prepend, and Overwrite

## Idea And Rationale

The public `CRList` class exposed only single-value `append(value)` and
`prepend(value)` methods. The benchmark adapter had to loop over a batch,
calling each individually. This meant N event dispatches, N `__update` calls,
and N cursor seeks for a batch of N values instead of one.

The core `__update` already accepts an array of values and processes them in
a single pass. The class just needed to expose that capability.

## Smallest Safe Change

In `src/CRList/class.ts`:

- Changed `append(value: T, afterIndex?: number)` to
  `append(valueOrValues: T | Array<T>, afterIndex?: number)`. When an array is
  passed, it is forwarded directly to `__update`; a single value is wrapped in
  `[value]` as before.
- Same change for `prepend`.
- Added `overwrite(index: number, values: Array<T>)` which calls
  `__update(index, values, state, 'overwrite')` in one pass instead of the
  adapter's previous loop of `list[index++] = value`.

In `benchmark/adapters/crlist.js`:

- `classInsert` now calls `list.append(values.map(value), index)` or
  `list.prepend(values.map(value), index)` instead of looping N individual
  calls.
- `classOverwrite` now calls `list.overwrite(index, values.map(value))`.

## Before Results

| Benchmark                                       | CRList Before |  Yjs Before |
| ----------------------------------------------- | ------------: | ----------: |
| class / append / batch after tail               |   135,831 ops | 476,768 ops |
| class / prepend / batch before head             |   124,166 ops | 650,301 ops |
| class / insert / batch before middle            |   115,509 ops | 738,873 ops |
| class / paste / insert 10,000 entries at cursor |    59,648 ops | 625,766 ops |

## After Results

| Benchmark                                       | CRList After |    Yjs After |
| ----------------------------------------------- | -----------: | -----------: |
| class / append / batch after tail               | ~163,000 ops | ~460,000 ops |
| class / prepend / batch before head             | ~210,000 ops | ~665,000 ops |
| class / insert / batch before middle            | ~185,000 ops | ~665,000 ops |
| class / paste / insert 10,000 entries at cursor | ~130,000 ops | ~990,000 ops |

`class / paste` improved ~2.2x (59k → 130k).
`class / prepend / batch before head` improved ~1.7x (124k → 210k).
`class / insert / batch before middle` improved ~1.6x (115k → 185k).

## Verification

All 17 tests passed.

## Final Rationale

Kept. The API change is clean: arrays are an explicit overload, single values
still work unchanged. `overwrite` fills a gap in the public surface that the
adapter was previously working around with a loop.
