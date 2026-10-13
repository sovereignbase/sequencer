import { createRequire } from 'node:module'
import { dirname, resolve } from 'node:path'
import { entry, runProcess } from '../.shared/process.ts'

/** Uses Bun from PATH, falling back to the npm package's declared executable. */
export async function run() {
  try {
    return await runProcess('bun', [entry])
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== 'ENOENT') throw error
    const require = createRequire(import.meta.url)
    const manifestPath = require.resolve('bun/package.json')
    const { bin } = require(manifestPath) as { bin: { bun: string } }
    return runProcess(resolve(dirname(manifestPath), bin.bun), [entry])
  }
}
