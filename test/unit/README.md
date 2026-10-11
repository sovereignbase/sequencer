# Public API

Run `npm run test:unit` to verify the consumer contract of `Projection`: constructor, actor ID, editing and reading methods, Gossip/Change results, snapshots, validation, and retirement.

Tests use public methods and the documented wire types. They do not inspect runtime strips, cursors, jumps, tables, or session clocks. Constructor input is trusted; malformed-input expectations belong to `apply` and `merge`. Local edit positions stay within the documented valid ranges.

Convergence, integration, stress, and runtime compatibility remain separate suites.
