import { execFile } from 'node:child_process'
import { fileURLToPath } from 'node:url'
import { promisify } from 'node:util'
import type { Outcome } from './suite.ts'

export const entry = fileURLToPath(new URL('./cli.ts', import.meta.url))

export async function runProcess(
  executable: string,
  args: string[]
): Promise<Outcome[]> {
  const { stdout } = await promisify(execFile)(executable, args, {
    timeout: 30_000,
    windowsHide: true,
  })
  return JSON.parse(stdout)
}
