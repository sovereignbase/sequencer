# Browser fanout

Runs the current `Projection` implementation in Chromium. Two replicas author
concurrent insertions after the same retained `base` Frame. Two receivers apply
the same Gossip in opposite orders and must expose the same visible Projection,
containing `base` followed by both surviving insertions.

Actor IDs do not determine the relative order of the insertions. Competing
insertions are ordered using their Session coordinates.

Run with `npm run test:integration`. The test bundles `src/class.ts` in memory
and uses Playwright to launch the browser from Vitest.
