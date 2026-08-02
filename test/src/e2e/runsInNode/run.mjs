import { resolve } from 'node:path'
import { spawnSync } from 'node:child_process'

const script = resolve(process.cwd(), 'test', 'e2e', 'runsInNode', 'runner.mjs')
const result = spawnSync(process.execPath, [script], {
  stdio: 'inherit',
})

if (result.status !== 0) process.exit(result.status ?? 1)
/** update to current package */
