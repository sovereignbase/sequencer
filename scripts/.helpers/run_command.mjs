import { spawn, spawnSync as spawn_sync } from 'node:child_process'
import { join } from 'node:path'

/** Runs one command with live output and a hard process-tree timeout. */
export function run_command(
  command,
  arguments_ = [],
  { cwd, timeout_ms, environment = process.env } = {}
) {
  return new Promise((resolve_result) => {
    const started_at = performance.now()
    const child_environment = { ...environment }
    let system_directory

    if (process.platform === 'win32') {
      const system_root =
        child_environment.SystemRoot ??
        child_environment.WINDIR ??
        'C:\\Windows'
      system_directory = join(system_root, 'System32')
      const path_key =
        Object.keys(child_environment).find(
          (key) => key.toLowerCase() === 'path'
        ) ?? 'Path'
      child_environment[path_key] =
        `${system_directory};${child_environment[path_key] ?? ''}`
    }

    const child = spawn(command, arguments_, {
      cwd,
      env: child_environment,
      detached: process.platform !== 'win32',
      shell: process.platform === 'win32' && /\.(?:cmd|bat)$/i.test(command),
      stdio: ['ignore', 'pipe', 'pipe'],
      windowsHide: true,
    })
    let standard_output = ''
    let standard_error = ''
    let settled = false
    let timed_out = false

    child.stdout?.on('data', (chunk) => {
      standard_output += chunk
      process.stdout.write(chunk)
    })
    child.stderr?.on('data', (chunk) => {
      standard_error += chunk
      process.stderr.write(chunk)
    })

    const finish = (status, signal, error) => {
      if (settled) return
      settled = true
      clearTimeout(timeout)
      clearTimeout(forced_finish)
      resolve_result({
        status: timed_out ? 124 : (status ?? 1),
        signal,
        error,
        timed_out,
        duration_ms: Math.round(performance.now() - started_at),
        standard_output,
        standard_error,
      })
    }

    let forced_finish
    const timeout = setTimeout(() => {
      timed_out = true
      console.error(`\nTimed out after ${timeout_ms} ms: ${command}`)

      if (process.platform === 'win32' && child.pid && system_directory) {
        spawn_sync(
          join(system_directory, 'taskkill.exe'),
          ['/pid', String(child.pid), '/t', '/f'],
          {
            env: child_environment,
            stdio: 'ignore',
            windowsHide: true,
          }
        )
      } else if (child.pid) {
        try {
          process.kill(-child.pid, 'SIGTERM')
        } catch {
          child.kill('SIGTERM')
        }
      }

      forced_finish = setTimeout(() => {
        child.stdout?.destroy()
        child.stderr?.destroy()
        child.unref()
        finish(124, 'TIMEOUT')
      }, 5_000)
    }, timeout_ms)

    child.once('error', (error) => finish(1, null, error))
    child.once('close', (status, signal) => finish(status, signal))
  })
}
