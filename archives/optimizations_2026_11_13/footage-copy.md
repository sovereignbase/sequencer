# Test the Footage source once per span

Checkpoint profiles attribute about 82% of values samples to JavaScript
`readValues`. The visible multi-span loop previously tested `source?.` for every
Frame even though its source is constant throughout that span. The candidate
checks it once: present sources use the same indexed copy; missing sources fill
the already allocated destination range with explicit `undefined` values.
Short present sources still produce `undefined` for out-of-range elements.

Single-span slices, the one-Frame-per-span path and snapshot concatenation are
unchanged. There is no additional helper, array allocation, dependency or
per-Projection field. The earlier reader-separation experiment is fully reverted
before this change. All 276 existing tests and 192 exact snapshot/serialization
pairs pass, with 100% TypeScript coverage. No expected result changes.

The [five-pair complete lifecycle comparison](footage-copy-lifecycle.md) has
37 medians over 5% faster and three over 5% slower against the checkpoint.
Down/1,000 creation is +4.06%, slower in all five pairs (paired +4.97%, IQR
12.59 pp), so complete-suite acceptance is still required.

The [same-run comparison against the preceding native build](footage-copy-vs-parent.md)
isolates the JS change: 13 medians improve over 5%, seven worsen over 5%, and
none is slower in every pair. Values medians improve 19.15% at up/20,000,
15.48% at up/25,000, 12.03% at down/15,000, 15.88% at down/10,000 and 29.04%
at down/5,000. Up/5,000 values is +7.22% (paired +15.80%, IQR 34.37 pp), an
unresolved apparent loss. All samples and every slower row remain in the tables.
These targeted samples are not pooled with complete-suite samples.

The [memory/artifact measurements](footage-copy-space.md) retain the same live
native bytes as the preceding build. Against the checkpoint, raw ESM is 998
bytes smaller, minified ESM 935 bytes smaller, minified ESM gzip 177 bytes smaller
and Brotli 113 bytes smaller. CommonJS and every measured native-module encoding
also remain smaller. Serialization is unchanged.

The production Wasm SHA-256 remains
`CA40B758062A009D980B8F0BD43B3A243A36108695BF04AC2381B30CB175D2B7`.
The emitted JS places the source decision outside the Frame loop. Diagnostic
V8 bytecode grows from 716 to 745 bytes overall because the missing-source fill
is a separate branch; the present-source inner loop no longer executes the
nullish decision on each Frame. Static bytecode size is not a speed claim.
Optimized engines may already hoist that decision, so representative timings
determine acceptance. No SIMD, ILP or MLP improvement is claimed, and native
generated-code findings remain unchanged.

Raw data, frozen sources, hypotheses, test logs, bytecode and exact linked module
copies remain under `temp/optimization_2026_11_12/footage-copy*`. No external
runner or adapter is changed. The complete five-pair lifecycle/throughput/tuple
guard includes both unchanged checkpoint copies.

```powershell
node temp/optimization_2026_11_12/production-control.mjs footage-copy-lifecycle fixed-table,directory-lazy,footage-copy lifecycle-control.mjs 5
node temp/optimization_2026_11_12/full.mjs fixed-table,fixed-control,footage-copy 5 footagecopyfull
node --expose-gc archives/optimizations_2026_11_10/memory.ts temp/optimization_2026_11_12/footage-copy-workspace/src temp/optimization_2026_11_12/footage-copy-memory.json temp/optimization_2026_11_12/footage-copy-workspace/dist
```

## Complete guard

All five complete runs per build finished. The
[primary checkpoint comparison](footage-copy-performance.md) has 409 non-length
timing rows: 159 medians improve over 5%, 62 worsen over 5%, and 13 rows are
slower in every pair. The [identical checkpoint copies](footage-copy-aa-performance.md)
have 49 medians over 5% faster, 71 over 5% slower and 15 rows slower in every
pair. The [second checkpoint comparison](footage-copy-control-performance.md)
has 158 medians over 5% faster, 55 over 5% slower and 14 rows slower in every
pair. All 96 memory/storage rows remain reported: 19 native allocations shrink,
and 77 rows are unchanged. Both type checks and all 112 executed compatibility
checks pass. The all-row condition is still unmet.

No remove/apply(remove) row is slower in all five pairs in this complete guard.
Other cases remain unresolved. In particular, empty creation at 15,000 starting
workload Strips worsens 29.97% against the primary checkpoint (paired +31.33%,
IQR 4.93 pp) and 22.15% against its identical copy, slower in every pair against
both. Duplicate merge at 1,000 and middle range values at 1,000 are also slower
in every pair against both checkpoints. Several other read, creation, sequence
and tuple rows remain slower against one control; none is discarded.

## Constructor profile

Thirty diagnostic repetitions select the unchanged production `create.empty`
burst at 15,000 starting workload Strips. CPU sampling is filtered by the burst
stack; preparation, observation and collector cleanup outside that stack are
excluded. This is diagnostic work, not another set of acceptance timings.

JavaScript `create` has 153/260 (58.85%) classified create samples in the
checkpoint and 148/259 (57.14%) in the candidate. Native malloc has 37/260 and
20/259 samples; dispatch has 30/260 and 32/259. These shares do not establish
relative method times, but do not identify native allocation as the dominant
regression cause. The JS path still performs general input sizing, operation
selection and result decoding when no retained input exists.

The next experiment exports the existing scalar native constructor and invokes
it directly for undefined retained input. Snapshot construction keeps its
original general initialization and error-result path; finalizer registration
and cleanup remain unchanged.

Raw `*-create.cpuprofile`, `*-create-profile.json` and logs remain under the same
temporary directory. Reproduction:

```powershell
node --expose-gc temp/optimization_2026_11_12/profile-create.mjs fixed-table
node --expose-gc temp/optimization_2026_11_12/profile-create.mjs footage-copy
```
