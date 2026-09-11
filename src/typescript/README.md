Rule #1 do as little work in typescript as possible.

- Validate only bare minimium. Wasm can do the rest as long as what it really gets are Uint32s it wont break.

Rule # 2 Do not change "user-space" typescript signature must not change.

- new methods can be added

- underlying runtime can be made more performant
