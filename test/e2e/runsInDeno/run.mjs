import { resolve } from 'node:path'
import { spawnSync } from 'node:child_process'

const script = resolve(process.cwd(), 'test', 'e2e', 'runsInDeno', 'runner.mjs')
const result =
  process.platform === 'win32'
    ? spawnSync('pwsh', ['-NoProfile', '-Command', `deno run "${script}"`], {
        stdio: 'inherit',
      })
    : spawnSync('deno', ['run', script], {
        stdio: 'inherit',
      })
/** update to current package */

if (result.status !== 0) process.exit(result.status ?? 1)
