import { fileURLToPath } from 'node:url'
import { entry, runProcess } from '../.shared/process.ts'

export const run = () =>
  runProcess(
    fileURLToPath(
      new URL(
        `../../../node_modules/bun/bin/bun${process.platform === 'win32' ? '.exe' : ''}`,
        import.meta.url
      )
    ),
    [entry]
  )
