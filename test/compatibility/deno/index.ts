import { createRequire } from 'node:module'
import { entry, runProcess } from '../.shared/process.ts'

export const run = () =>
  runProcess(process.execPath, [
    createRequire(import.meta.url).resolve('deno/bin.cjs'),
    'run',
    '--no-config',
    '--no-lock',
    entry,
  ])
