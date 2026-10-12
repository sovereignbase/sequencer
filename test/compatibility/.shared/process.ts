import { execFile } from 'node:child_process'
import { fileURLToPath } from 'node:url'
import { promisify } from 'node:util'
import type { Outcome } from './suite.ts'

/** Shared portable suite entry; runtimes write exactly one JSON outcome array to stdout. */
export const entry = fileURLToPath(new URL('./cli.ts', import.meta.url))

/**
 * Executes a runtime-owned process with bounded lifetime and structured outcomes.
 * @param executable Target runtime launcher.
 * @param args Exact launcher arguments, including the shared suite entry.
 * @returns Parsed target outcomes; launch failure and timeout reject the run.
 */
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
