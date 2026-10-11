# Runtime compatibility

Run `npm run test:compatibility` to build the package and execute the same public-API suite in Node (ESM and CommonJS), Bun, Deno, Edge Runtime, workerd, Chromium, Firefox, and WebKit.

The suite covers local editing, Footage identity, value types, ordered/shuffled/reverse delivery, duplicate apply/merge, concurrent insertion ordering, compaction, repeated JSON snapshot/hydration, and indexed traversal after hydration. Runtime adapters only load and execute this shared suite; expectations live in `.shared/suite.ts`.

JSON transport omits absent optional Footage fields, keeping masks as six-field tuples. Active receivers are registered before removals so compaction follows the acknowledgement model.

Bun and Deno use the installed npm binaries. workerd runs locally through Wrangler's Miniflare dependency. Browsers use Playwright's matching binaries; install them with `npx playwright install` if missing. A missing runtime or browser fails the suite instead of silently skipping its tests.
