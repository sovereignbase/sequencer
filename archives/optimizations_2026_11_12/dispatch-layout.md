# Hydration in the shared dispatch function

Linked-code inspection finds a non-local consequence of the positive-rounding
change. LTO inlines `Projection::hydrate` into `runtime_dispatch`, whereas the
baseline calls it out of line. All other general operations enter that same
dispatch function. This is a testable explanation for further investigation,
not an established cause of the observed timing differences.

| Build                           | Dispatch body, Wasm bytes | Separate hydration body, Wasm bytes |
| :------------------------------ | ------------------------: | ----------------------------------: |
| Session baseline                |                    17,113 |                               3,662 |
| Rounding + removal reservation  |                    20,748 |                             Inlined |
| Above + arena pointer removal   |                    20,737 |                             Inlined |
| Isolated smaller Gossip payload |                    17,101 |                               3,662 |

The dispatch body grows by approximately 21% in the rounding combination even
though the complete Wasm module shrinks. WAT line counts independently change
from 12,910 to 15,600. The baseline has one direct call to hydration; the
rounding build instead contains its allocation, anchoring and frontier calls.
Both builds retain two direct calls to `Projection::remove`; removal inlining
is not the difference found here.

The next layout experiment can preserve the smaller arena and equivalent
rounding while keeping hydration out of the shared hot dispatch body. A single
call-site no-inline annotation can test that hypothesis without adding state or
changing the algorithm. Generated code must first confirm the intended layout;
only matched representative timing and the complete regression guard can accept
it. No speed gain is assumed from function size alone.

## Call-site hint

The Clang call-site no-inline attempt passes all 276 tests and 192 canonical
snapshot pairs, but final Wasm still contains hydration inside dispatch. The
dispatch body is 20,709 B and no separate hydration function remains. The
targeted control is stopped after inspecting that failure; incomplete samples
under `dispatch-control-*` are diagnostics, not acceptance evidence. The
ineffective source annotation is removed.

## Combined-function size limit

The next candidate changes Binaryen's maximum combined function size from its
default 409,600 B to 16,384 B. This is one global code-layout bound, not a
workload-specific branch or a new runtime export. Other release/LTO/SIMD flags
and source semantics remain unchanged. The exact CMake link option is
`-sBINARYEN_EXTRA_PASSES=--inline-max-combined-binary-size=16384`.

Final dispatch is 16,278 encoded Wasm bytes, smaller than both the session
baseline (17,113 B) and the preceding combination (20,737 B). Hydration is a
separate 3,633-byte function again. The intended layout is present; performance
is not inferred from it. This does not introduce SIMD, ILP or MLP streams.

The existing allocation savings from the arena pointer removal remain. Whole
Wasm is 90,961 B, seven bytes larger than the session baseline; ESM min + gzip
is 44,154 B, 103 B smaller. ESM min + Brotli is 36,356 B (-11 B); CommonJS min +
Brotli is 36,555 B (+28 B). These are separate metrics, not an all-artifact win.
The controlled target compares the baseline, an identical A/A copy, the
preceding combination and the size-limited build in independent processes,
with rotated/reversed order and unchanged production cases.

The [five-round target](dispatch-cap-control.md) remains mixed: apply(remove)
medians improve 5.02%/8.00% at 10,000/25,000 Strips, but apply(insert) regresses
9.37% at 1,000 and 6.89% at 25,000. Empty-creation observations overlap large
A/A differences and do not establish a benefit. The bound also outlines other
dispatch code; this is not an isolated hydration-only change. Raising the
bound to 18,000 B reproduces the byte-identical generated module, so no second
timing run is substituted for these results. Both bounds are removed. The
code-size hypothesis did not establish a sufficient representative speed gain.

Evidence: each frozen release's `*-memory.wasm`, linker symbols and `*.wat` in
`temp/optimization_2026_11_12`. `dispatch-calls.mjs` resolves direct calls by the
matching symbol map. `function-sizes.mjs` reads encoded function-body lengths
from the final module's code section, excluding the five imported functions.
No intermediate LLVM output is substituted for linked Wasm.
