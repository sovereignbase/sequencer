# Runtime lifetime

Run `npx vitest run test/integration/runtime_lifetime --coverage.enabled=false`.

Failed native initialization must release the JavaScript bindings and leave the
next Projection usable. These cases inject real native error results at the ABI
boundary and exercise recovery through the public constructor.

Native failures must surface as `SequencerError` with the correct code and a
message naming the public operation. A reported operation failure must leave
the instance usable when native history has not been changed.

A controlled FinalizationRegistry delivers owner cleanup without relying on JS
process garbage collection timing. Cleanup must release a handle once; reusing
it must preserve independent history in surviving and newly created Projections.
