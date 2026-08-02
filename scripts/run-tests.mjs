/**
 * Runs both test engines even when one fails, then writes one stable report
 * landing page linking their detailed output and V8 coverage.
 */
import { mkdirSync as make_directory, rmSync as remove_directory, writeFileSync as write_file } from 'node:fs'
import { dirname, join, relative, resolve } from 'node:path'
import { fileURLToPath as file_url_to_path } from 'node:url'
import { spawnSync as spawn_sync } from 'node:child_process'

// Resolve and validate the one generated report directory this script owns.
const script_directory = dirname(file_url_to_path(import.meta.url))
const repository_directory = resolve(script_directory, '..')
const reports_directory = resolve(repository_directory, 'docs', 'tests')
if (relative(repository_directory, reports_directory) !== join('docs', 'tests')) {
  console.error('Refusing to replace a report directory outside docs/tests.')
  process.exit(1)
}

// Start from an empty report tree so stale successes cannot survive failures.
remove_directory(reports_directory, { recursive: true, force: true })
make_directory(reports_directory, { recursive: true })

// Run both independent engines and retain both exit states for the landing page.
const npm_command = process.platform === 'win32' ? 'npm.cmd' : 'npm'
const run_script = (script_name) =>
  spawn_sync(npm_command, ['run', script_name], {
    cwd: repository_directory,
    stdio: 'inherit',
  }).status ?? 1

const vitest_status = run_script('test:vitest')
const playwright_status = run_script('test:browser')
const status_label = (status) => (status === 0 ? 'Passed' : 'Failed')
const overall_status = vitest_status === 0 && playwright_status === 0

// Publish a compact index even when either detailed runner failed to start.
write_file(
  resolve(reports_directory, 'index.html'),
  `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Sequencer test report</title>
    <style>
      :root { color-scheme: dark; font-family: system-ui, sans-serif; background: #090909; color: #f7f7f7; }
      body { margin: 0; min-height: 100vh; display: grid; place-items: center; }
      main { width: min(42rem, calc(100% - 2rem)); }
      section { display: grid; gap: 1rem; padding: 1.5rem; border: 1px solid #303030; border-radius: 1rem; background: #111; }
      h1, p { margin: 0; }
      nav { display: grid; gap: .75rem; }
      a { display: flex; justify-content: space-between; padding: 1rem; border: 1px solid #303030; border-radius: .75rem; color: inherit; text-decoration: none; }
      .passed { color: #7ee787; }
      .failed { color: #ff7b72; }
    </style>
  </head>
  <body>
    <main>
      <section>
        <h1>Sequencer tests</h1>
        <p class="${overall_status ? 'passed' : 'failed'}">${overall_status ? 'All test engines passed.' : 'At least one test engine failed.'}</p>
        <nav>
          <a href="./vitest/index.html"><span>Vitest</span><strong class="${vitest_status === 0 ? 'passed' : 'failed'}">${status_label(vitest_status)}</strong></a>
          <a href="./coverage/index.html"><span>V8 coverage</span><strong>Open</strong></a>
          <a href="./playwright/index.html"><span>Playwright</span><strong class="${playwright_status === 0 ? 'passed' : 'failed'}">${status_label(playwright_status)}</strong></a>
        </nav>
      </section>
    </main>
  </body>
</html>
`
)

process.exitCode = overall_status ? 0 : 1
