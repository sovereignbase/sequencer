# One-instance retained memory

Three fresh runtimes per build. Each receives the same 6,000 mixed edits after
fixture authors have been destroyed. One Projection is alive in the measured
runtime. It returns 7,532 Splices and retains 4,513 visible Frames. Values are
the library's live Wasm allocation plus bound JavaScript Footage estimate,
not process RSS, WebAssembly page reservation or a measured allocation peak.
Caller-owned returned arrays are outside this estimate and identical across
the builds.

| Point          | Starting bytes | Direct Splice bytes | Splice + early byte ACK bytes |
| -------------- | -------------: | ------------------: | ----------------------------: |
| Empty instance |            264 |                 264 |                           264 |
| After apply    |      2,117,218 |           1,953,370 |                     1,871,450 |
| After sequence |      2,262,506 |           2,098,658 |                     2,016,738 |

Every repetition returns these exact counts. After apply, direct output saves
163,848 B (-7.74%). Early coalescing saves another 81,920 B, bringing the total
reduction to 245,768 B (-11.61%). The native output buffers are shared by all
Projection instances in that Wasm runtime; this is not a reduction in the size
of each empty instance. JavaScript Footage remains 43,770 B after editing.

The snapshot has 33,044 metadata bytes and 39,879 MessagePack document bytes in
all builds. No disk-size improvement is claimed. The complete lifecycle guard
also measures checkpoint memory after compacting, destroying and recreating
the instance; that distinct scenario need not retain the same output scratch.

Source: `memory.mjs` and the three `*-memory.json` files under
`temp/optimization_2026_11_22_runtime`. No peer runtime is charged to the instance.
