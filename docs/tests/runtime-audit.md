# Runtime build/test audit — 2026-09-11

## Build

- `npm run build:wasm` and `npm run build`: passed.
- Public TypeScript signatures and `src/typescript/types/type.ts` are unchanged.
- `tsc --noEmit`, fixture formatting, and `git diff --check`: passed.

## Mask source-chain implementation

- One Mask now consumes its target's `larger_split` chain, skipping empty anchors
  and unrelated intervening inserts. Its identity, issued length, and ACK span
  remain unchanged. Inserts anchored inside a Mask do not split the Mask.
- Non-contiguous retained Footage uses span references on that same Mask.
  Snapshot/recovery and hard Footage collection consume all those spans. Trusted
  snapshot hydration reconstructs a single packed Footage block for the Mask.
- The full source span is checked before mutation. Missing fragments and
  continuations resolving directly to another Mask remain pending rather than
  being partly applied. General overlap resolution is still unfinished.
- Projection jumps are updated at each affected source fragment, using the
  existing Find implementation unchanged.
- Vitest: **141 passed, 3 failed, 144 total**; all **136 unit tests** passed.
  The remaining failures are the same mixed-order convergence, post-collection
  editing, and generative convergence regressions listed below.
- Ten standalone WASM tests pass: `mask_split`, `merge`, `update`, `before_insert`,
  `after_insert`, `initialize`, `snapshot`, `acknowledge`, `read`, and `find`.
  The two old assertions requiring a Mask to split were replaced with assertions
  that its identity/length and retained Footage remain intact.
- The new production tests cover 1/3/16 empty anchors and three content fragments
  separated by 1/16/64 inserted Strips, snapshots, recovery, hard collection,
  duplicate delivery, changed-index patches, and the next Mask's ACK frontier.
- Logs: `temp/mask-chain-full-tests.log`, `temp/mask-chain-build.log`, and
  `temp/chain-*-run.log`.
- Existing Find benchmark (`-O3 -msimd128`, Node): 1,000 Strips measured
  137.25 ns/query frame-to-strip and 209.55 ns/query strip-to-frame; 10,000 Strips
  measured 345.19 and 482.80 ns/query respectively. These are local lookup timings,
  not Mask throughput or a before/after speedup claim.

## Fixture migration

- Operations remain flat `[projection, footage]` Deltas, including batches.
- `create` receives trusted snapshots; unordered operations go through `merge`.
- Snapshot checks retain structural order and soft-masked Footage across restarts.
- Replicas use tuple access; ACKs use flat triples, exact frontier agreement,
  and immutable inputs. Releasing retained content explicitly requests hard GC.
- Convergence/browser/stress writers use separate WASM instances. Runtime smoke
  tests use encoded remote siblings with distinct Realms and check all content.
- Both root and forward siblings are expected in descending SequencePoint order.
- Merge patches describe the changed visible suffix, including removed tail slots.
- Previously vacuous browser/stress checks now merge actual operations rather
  than passing malformed nested tuples to snapshot initialization.

## Previous complete matrix run

- Vitest: **135 passed, 3 failed, 138 total**. All 130 unit tests passed.
- Failing regressions: mixed shuffled/reverse/restarted merge convergence;
  continued editing after acknowledged Mask collection; generative convergence.
- Stress failed on its first generated scenario: seed `98626254`, path `0`.
  Full diagnostics are in `temp/fixture-project-tests.log`.
- Node.js, Deno, Bun, and Edge Runtime contracts passed.
- Browser matrix: **12 passed**; 3 Firefox tests could not start because the
  Playwright Firefox executable is absent. Chromium/WebKit desktop/mobile pass.
- Cloudflare Workers still rejects random generation during global initialization.
- Fixture formatting checks passed. No failing runtime assertions were skipped
  or weakened to make the suite pass.

Machine-readable reports from this earlier matrix run are alongside this file.
Its native `after_insert` and `mask_split` failures are now fixed by source-chain
traversal; both pass in the current targeted run.

## Work remaining

1. Overlapping Masks: choose the greatest Mask identity for shared content while
   retaining both issued identities and counter spans for ACK/GC. Masks are not
   split into additional Strips.
2. Structural soft/hard GC and causal reattachment. Collecting Footage spans
   alone does not implement removal of the acknowledged Mask chain.
3. Merge dependencies into consumed source points; retained snapshots containing
   Mask Footage also need correct merge handling.
4. Workers-compatible initialization and installation of the missing Firefox
   test browser remain separate environment/runtime work.

Passing builds and bounded smoke tests does not establish complete CRDT
convergence or safe structural GC. The remaining failing regressions stay active.
