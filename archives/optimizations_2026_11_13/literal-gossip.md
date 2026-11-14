# Copy fixed coordinates in the Insertion branch — rejected

Follow the generic copier experiment by placing the six-element literal only
inside the existing Insertion descriptor branch. Native `Output::expose` always
supplies six coordinate words for Insertions. Acknowledgements retain the
generic copier, and snapshot copying is unchanged. No new helper or allocation
is introduced beyond the existing result arrays.

All 277 tests pass with 100% TypeScript coverage; all 192 exact snapshot and
serialization comparisons pass. The [five-pair targeted comparison](literal-gossip-editing.md)
has seven medians over 5% faster and three over 5% slower against the checkpoint.
The intended eight-index replacement target is +11.33%, compared with the
bounded-clear parent's +9.27%. Paired changes (+7.36% and +7.73%) overlap widely;
this does not establish a useful improvement. Two-index ordinary Projection
`apply.replace` is slower in every pair (+6.75%, paired +2.42%, IQR 11.96 pp).

Reject and restore the parent. No complete guard or claim of improved array
representation is made for this attempt. The generic copier and original
descriptor decoding are restored before the next candidate. Raw samples and
frozen sources remain under `temp/optimization_2026_11_12/literal-gossip*`.

```powershell
node temp/optimization_2026_11_12/tuple-editing-control.mjs literal-gossip-editing fixed-table,bounded-release,literal-gossip 5
```
