# First visible block member — rejected

The profile identifies hidden structural prefixes inside weighted block lookup.
Try retaining the first visible member in each cold block record. An eight-bit
structural count and 24-bit ordinal leave one Word available in the existing
16-byte record; the maximum allocatable arena bounds directory ordinals well
below 24 bits. No node lane, arena byte or per-Projection field is added.

Build and split discover the first visible member during existing walks. Weight
changes clear the hint. A positive insertion seeds it when it supplies the
block's entire positive weight; otherwise insertion clears it. Lazy lookup
rediscovers an invalidated hint. Existing structural endpoints remain intact.

All 277 Vitest tests and 192 exact snapshot/serialization comparisons pass, with
100% TypeScript coverage. The [five-pair targeted comparison](first-visible-editing.md)
has eight medians over 5% faster and two over 5% slower against the checkpoint.
Eight-index ordinary Projection replacement is -8.85%, compared with the
bounded-clear parent's -6.21% in the same experiment. Two-index ordinary
Projection `apply.replace`, however, worsens 18.26% (paired +13.21%, IQR 6.93
percentage points), slower in every pair. The parent has no every-pair loss.

Reject and restore the parent before continuing. No complete guard, final linked
hot-path inspection or new memory collector is claimed for this targeted
failure. Its compiled 16-byte Record assertion passes, but unchanged allocation
size alone is not sufficient to retain the change. Frozen sources and every
raw sample remain under `temp/optimization_2026_11_12/first-visible*`.

```powershell
node temp/optimization_2026_11_12/tuple-editing-control.mjs first-visible-editing fixed-table,bounded-release,first-visible 5
```
