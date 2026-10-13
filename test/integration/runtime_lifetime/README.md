# Runtime lifetime

Run `npx vitest run test/integration/runtime_lifetime --coverage.enabled=false`.

Failed native initialization must release the JavaScript bindings and leave the
next Projection usable. These cases inject real native error results at the ABI
boundary and exercise recovery through the public constructor.

A controlled FinalizationRegistry delivers owner cleanup without relying on JS
process garbage collection timing. Cleanup must release a handle once; reusing
it must preserve independent history in surviving and newly created Projections.
