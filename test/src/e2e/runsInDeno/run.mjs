import { resolve } from 'node:path'
import { spawnSync } from 'node:child_process'

const root = process.cwd()
const script = resolve(process.cwd(), 'test', 'e2e', 'runsInDeno', 'runner.mjs')
const denoBin = resolve(root, 'node_modules', 'deno', 'bin.cjs')
const result = spawnSync(process.execPath, [denoBin, 'run', script], {
  stdio: 'inherit',
})
/** update to current package */

if (result.status !== 0) process.exit(result.status ?? 1)
