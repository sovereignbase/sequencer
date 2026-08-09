# Diamond Types benchmark dependency

`diamond-types-node` 1.0.2 is the official Node.js/Wasm wrapper for Joseph
Gentle's Diamond Types text CRDT. Upstream describes the project as “The world's
fastest CRDT. WIP.” and warns that the JavaScript API is still in flux.

Dependency evaluation on 2026-08-02:

- Maintenance: upstream's latest commit was `e143890a` on 2026-07-31, within
  the required 12-month window. The npm wrapper release itself is about three
  years old.
- License: `ISC OR Apache-2.0`, compatible with this Apache-2.0 repository.
- Security: the wrapper declares no runtime dependencies, and the GitHub
  Advisory Database returned no advisories affecting `diamond-types-node`.
- API stability: explicitly WIP; the benchmark pins compatible release 1.0.2
  through the lockfile and uses only its documented `Doc` API.
- Adoption: the upstream repository had approximately 1,824 stars and 43 forks.

The comparison uses each library's public Node.js API and natural snapshot and
patch formats. Diamond Types supports plain text, so both implementations use
one-character strings. Diamond Types has no direct indexed-read API: its
`__read` comparison necessarily materializes the public full string with
`get()` before selecting a character. It also has no public compaction
operation, which is reported as unsupported rather than approximated.
