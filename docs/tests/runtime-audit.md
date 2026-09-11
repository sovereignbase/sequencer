# Runtime build/test audit — 2026-09-11

## Build

- `npm test`: both WASM and TypeScript build stages passed.
- Public TypeScript signatures and `src/typescript/types/type.ts` are unchanged.
- This fixture migration does not change runtime implementation.

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

## Latest complete run

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

Machine-readable suite reports are alongside this file. Native tests were not
changed in this migration. The preceding native audit compiled all 19 sources;
`merge`, `update`, and `before_insert` passed, while `after_insert` failed its
`visible == "YX"` assertion and `mask_split` failed source split-link preservation.
Those diagnostics remain in `temp/native-mask-test-audit.json`.

## Work remaining

1. Mask splits and overlaps: traverse source fragments/zero anchors correctly,
   choose the greatest Mask identity for shared content, and retain both issued
   identities and counter spans for ACK/GC.
2. Structural soft/hard GC and causal reattachment. Collecting Footage spans
   alone does not implement removal of the acknowledged Mask chain.
3. Mask split-chain handling and merge dependencies into consumed source points;
   retained snapshots containing Mask Footage also need correct merge handling.
4. Workers-compatible initialization and installation of the missing Firefox
   test browser remain separate environment/runtime work.

Passing builds and bounded smoke tests does not establish complete CRDT
convergence or safe structural GC. The remaining failing regressions stay active.
