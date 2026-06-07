# Wasm create range hydration

## Target

Move `__create` snapshot range hydration onto the existing C++/Wasm range math
engine without changing the TypeScript value/API ownership model.

## README baseline

Current README create rows:

| scenario | crlist ms/op | winner |
| --- | ---: | --- |
| create / empty list | 0.01 | crlist |
| create / hydrate snapshot | 3.62 | crlist |
| create / hydrate clean snapshot | 3.60 | crlist |
| create / hydrate tombstoned snapshot | 1.66 | crlist |

## Change

`__create` now validates uint32 range ids and previous range ids, keeps snapshot
ranges and JS values in TypeScript, and passes only scalar fields to
`_add_range_to`. Wasm receives range length, consumer reference, delete flag,
instance id lanes, range id lanes, and previous id lanes. Empty snapshots skip
`_resolve_order_for` because the current Wasm implementation expects at least
one linked range.

## Boundary

No JSON, MsgPack, serde, object copying, or JS object materialization was added
at the JS/Wasm boundary. TypeScript owns ranges and values. Wasm owns the range
ordering state.

## Verification

- `npm --prefix wasm run smoke`: pass.
- Create-only bundle parse check with `esbuild`: pass.
- Full `npm run build`: blocked by the current broader migration state:
  top-level await in `src/core/crud/index.ts` is incompatible with the CJS build,
  and old block-model files still import deleted `.helpers` modules.

## Result

No local before/after benchmark could be collected from this worktree because
the package build currently fails before benchmark execution. The expected
create-path effect is lower TypeScript ordering/index hydration work for valid
range snapshots because those scalar range records now enter the C++/Wasm
engine directly.
