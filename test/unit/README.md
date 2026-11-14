# Public API

Run `npm run test:unit` to verify the consumer contract of `Projection`: constructor, actor ID, editing and reading methods, Gossip/Change results, snapshots, validation, and retirement.

Tests use public methods and the documented wire types. They do not inspect runtime strips, cursors, jumps, tables, or session clocks. Constructor input is trusted; malformed-input expectations belong to `apply` and `merge`. Local edit positions stay within the documented valid ranges.

Structured-error checks cover the exported `SequencerError`, stable codes,
package-prefixed messages, standard `cause`, and rejection by every operational
method after destruction. Repeated `destroy()` calls remain safe.
Range reads also cover sparse Footage beyond the signed 32-bit index boundary.
Omitted suffix Footage retains its Frames after snapshot hydration.

Convergence, integration, stress, and runtime compatibility remain separate suites.

[String-encoded Sequences](string_encoded_sequence/README.md) cover optional
string Footage, automatic hydration and concatenation errors.

[Tuples](tuple/README.md) cover stable indices, optional fixed capacity,
configuration persistence and local edits.
