# Browser delivery

The browser starts from:

```text
base
```

Two actors edit its retained Snapshot independently:

```text
Actor 2: base -> left
Actor 3: base -> right
```

Two browser-side receivers use opposite network orders through the public
TypeScript/WebAssembly API:

```text
Receiver 4: left  -> right
Receiver 5: right -> left
```

Actor 3 has the larger competing Clock, so both receivers must project:

```text
base -> right -> left
```

This is the browser boundary proof for the same deterministic ordering tested
directly under Vitest.
