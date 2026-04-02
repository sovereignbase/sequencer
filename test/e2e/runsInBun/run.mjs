import { resolve } from 'node:path'
import { spawnSync } from 'node:child_process'

const script = resolve(process.cwd(), 'test', 'e2e', 'runsInBun', 'runner.mjs')
const result = spawnSync('bun', [script], {
  stdio: 'inherit',
})

if (result.status !== 0) process.exit(result.status ?? 1)

/** update to current package */
