# Circular traversal directory

The linear gap still moved across the whole directory when editing alternated
between the two endpoints. The circular version moves the shorter side, retains
the visible weight before its logical head and keeps its four-word header in the
Strip arena. Its Projection member is one pointer and one capacity word.

Each following candidate changes one part of that implementation:

| Candidate            | Change                                                                   | Production lifecycle comparison             |
| :------------------- | :----------------------------------------------------------------------- | :------------------------------------------ |
| `directory-ring`     | Circular gap and retained rotation weight                                | [All rows](directory-ring-lifecycle.md)     |
| `directory-delta`    | Transfer split weight once; skip zero deltas and unchanged column stores | [All rows](directory-delta-lifecycle.md)    |
| `directory-range`    | Refresh changed groups instead of all cached sums                        | [All rows](directory-range-lifecycle.md)    |
| `directory-outlined` | Keep the general range refresh outside the insertion body                | [All rows](directory-outlined-lifecycle.md) |

Every comparison has five matched complete production lifecycle runs, identical
seeds, checkpoints, acknowledgement exchange, compaction and recreation. These
are targeted comparisons; they exclude the separate throughput and tuple suites.
Each candidate passes all 276 existing tests, 100% TypeScript coverage and all
192 exact snapshot/serialization pairs. No test expectations or benchmark
workloads change.

The ring build's [eight-author comparison](directory-ring-concurrent.md) verifies
ordered, reversed and shuffled insert/remove/replace replay and duplicates. Its
[memory and artifact comparison](directory-ring-space.md) measures 16 fewer
native bytes per empty Projection, 48 fewer for one intact Insertion and 9.66%
less native allocation for the edited eight-Frame fixture. The raw Wasm grows
612 bytes and minified ESM gzip grows 201 bytes. These costs are retained in the
record rather than hidden by the memory gain.

The linked ring insertion body contains 2,484 disassembly lines with five vector
load sites and fifteen vector-add sites. Inlining the general range refresh
expands that body to 3,655 lines with nine vector-load and twenty-seven vector-add
sites. The outlined candidate restores a separately linked refresh function.
Contiguous Frame reductions offer SIMD; row relocation uses independent column
loads and stores. Structural node walks remain dependent, so no MLP improvement
is claimed. Disassembly and symbol maps are retained with each frozen workspace
under `temp/optimization_2026_11_12`.

None of these intermediate candidates meets the no-regression condition.
Head insertion remains 18.05%, 13.57%, 10.18% and 12.70% slower, respectively,
in these separate lifecycle comparisons. Every run and every slower row remains
in the linked tables. The outlined build nevertheless reduces full-lifecycle
random apply time 68.68%, random removal 67.90%, random replacement 59.96% and
random value lookup 83.25% against its paired checkpoint runs.

Five complete lifecycle CPU profiles then identify a different bottleneck:
`subtree_end` accounts for 68.79% of timed native/JS replacement samples in the
outlined build, compared with 63.88% in the checkpoint. These are sampled shares,
not API timings or a precise head/tail breakdown. Random lookup is no longer the
largest replacement cost. Insertion samples attributed to `find_frame` fall
from 81.44% in the checkpoint to 14.11% in the outlined build; directory lookup
and insertion account for 29.01% and 19.41% of its insertion samples.

Profiling uses `node temp/optimization_2026_11_12/profile-lifecycle.mjs NAME 5`.
It filters samples by the production lifecycle timer's stack ancestry, excluding
untimed peer synchronization, model checks and reporting. Raw CPU profiles,
per-function counts, hypothesis files, commands and matched measurements remain
under the same temporary directory. No external runner or adapter is changed.
