# Pass replacement end as a scalar

Local replacement previously reserved one numeric input Word, wrote its
inclusive end into the heap and read it with the native Reader. Pass that end
in the existing dispatch operand instead. The ABI still has seven i32 operands;
there is no additional export, helper, public option or validation path.
Snapshot and Gossip input still use the operand as their numeric input address.
An input count of zero always constructs an empty span with a null pointer.

This removes one JS-to-Wasm reserve call, one heap write and one native Reader
step per local replacement. A diagnostic wrapper counts the existing reserve
export around one unchanged public replacement: the parent calls it once, the
candidate zero times, and both produce `['a', 'x', 'c']`. This is work-removal
evidence, not a timing result or SIMD/ILP/MLP claim.

All 277 tests pass with 100% TypeScript coverage: 441 statements, 301 branches,
32 functions and 395 lines. All 192 exact snapshot/serialization comparisons
pass. The [five-pair targeted comparison](scalar-end-editing.md) preserves both
modes and all four sizes, selecting their two production replacement cases.
Six of 16 medians improve over 5%, one worsens over 5%, and none is slower in
every pair. Eight-index ordinary replacement is -4.14% against the checkpoint;
its paired +0.18% with 23.87 pp IQR remains noisy. The parent is -2.80% in the
same comparison. No complete-suite acceptance is claimed from this subset.

Frozen sources, all raw measurements and the bridge-count diagnostic remain
under `temp/optimization_2026_11_12/scalar-end*` and `check-replace-bridge.mjs`.

```powershell
node temp/optimization_2026_11_12/tuple-editing-control.mjs scalar-end-editing fixed-table,bounded-release,scalar-end 5
node temp/optimization_2026_11_12/check-replace-bridge.mjs bounded-release scalar-end
```
