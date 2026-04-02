import { resolve } from 'node:path'
import { spawnSync } from 'node:child_process'
/** update to current package */
const root = process.cwd()
const tasks = [
  ['Node', resolve(root, 'test', 'e2e', 'runsInNode', 'run.mjs')],
  ['Bun', resolve(root, 'test', 'e2e', 'runsInBun', 'run.mjs')],
  ['Deno', resolve(root, 'test', 'e2e', 'runsInDeno', 'run.mjs')],
  [
    'Cloudflare Workers',
    resolve(root, 'test', 'e2e', 'runsInCloudflareWorkers', 'run.mjs'),
  ],
  [
    'Edge Runtimes',
    resolve(root, 'test', 'e2e', 'runsInEdgeRuntimes', 'run.mjs'),
  ],
  ['Browsers', resolve(root, 'test', 'e2e', 'runsInBrowsers', 'run.mjs')],
]

for (const [label, script] of tasks) {
  console.log(`\n=== ${label} E2E ===`)
  const result = spawnSync(process.execPath, [script], {
    stdio: 'inherit',
    cwd: root,
  })
  if (result.status !== 0) process.exit(result.status ?? 1)
}

console.log('\nAll end-to-end runtime suites passed.')
