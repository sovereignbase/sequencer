# Fixed six-word branch in the generic copier — rejected

The tiny-document profile attributes samples to coordinate allocation and copy
inside `readWords`. Try a six-element numeric array literal for count six, with
the generic loop retained for all other lengths. The specialized allocation
site can avoid the variable-length holey-array path; actual public timings
determine whether that helps.

All 277 tests pass at 100% TypeScript coverage, and all 192 exact snapshot and
serialization checks pass. The [five-pair targeted comparison](literal-words-editing.md)
has three medians over 5% faster and four over 5% slower than the checkpoint.
Ordinary two-index replacement is +10.38% (paired +7.93%, IQR 0.96 percentage
points), slower in every pair. The bounded-clear parent does not have that
every-pair replacement loss. Two-index `apply.replace` is also slower in every
pair (+9.85%, paired +9.23%, IQR 15.30 pp).

Reject this generic branch before continuing; no complete guard is claimed.
The follow-up moves fixed-width copying into the already existing Insertion
descriptor branch, keeping Acknowledgement and snapshot copying unchanged.
Frozen sources and all raw samples remain under
`temp/optimization_2026_11_12/literal-words*`.

```powershell
node temp/optimization_2026_11_12/tuple-editing-control.mjs literal-words-editing fixed-table,bounded-release,literal-words 5
```
