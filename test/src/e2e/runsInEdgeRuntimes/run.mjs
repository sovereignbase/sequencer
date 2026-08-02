import { resolve } from 'node:path'
import { spawnSync } from 'node:child_process'

const script = resolve(
  process.cwd(),
  'test',
  'e2e',
  'runsInEdgeRuntimes',
  'runner.mjs'
)
const result = spawnSync(process.execPath, [script], {
  stdio: 'inherit',
}) /** update to current package */

if (result.status !== 0) process.exit(result.status ?? 1)
