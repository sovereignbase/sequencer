# Shared test helpers

[All suites](../README.md)

| Helper                   | Responsibility                                                                              |
| ------------------------ | ------------------------------------------------------------------------------------------- |
| [replica.ts](replica.ts) | Seed creation, delivery/restart fixtures, indexed replica comparison, and seeded shuffling. |
| [browser.ts](browser.ts) | Bundle the current source in memory, launch Chromium, and load `Projection` into a page.    |

Stress Worker code stays in [stress/.helpers](../stress/.helpers/scenario.mjs). The shared runtime compatibility expectations stay in [compatibility/.shared/suite.ts](../compatibility/.shared/suite.ts); its adapters only load and execute that suite.
