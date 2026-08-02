import { resolve } from 'node:path'
import { run_command } from './.helpers/run_command.mjs'

const repository_directory = resolve(import.meta.dirname, '..')
const result = await run_command(
  process.execPath,
  [
    resolve(repository_directory, 'node_modules', '@playwright', 'test', 'cli.js'),
    'test',
  ],
  { cwd: repository_directory, timeout_ms: 300_000 }
)

process.exitCode = result.status
