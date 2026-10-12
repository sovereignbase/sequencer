import { createRequire } from 'node:module'
import { entry, runProcess } from '../.shared/process.ts'

/** Executes the portable suite in Deno without importing repository config or lock behavior. */
export const run = () =>
  runProcess(process.execPath, [
    createRequire(import.meta.url).resolve('deno/bin.cjs'),
    'run',
    '--no-config',
    '--no-lock',
    entry,
  ])
