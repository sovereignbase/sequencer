/** Runs every build and test stage with finite process-tree timeouts. */
import {
  mkdirSync as make_directory,
  rmSync as remove_directory,
} from 'node:fs'
import { join, relative, resolve } from 'node:path'
import { run_command } from './.helpers/run_command.mjs'
import {
  write_pending_test_report,
  write_test_report,
} from './write-test-report.mjs'

const started_at = new Date()
const repository_directory = resolve(import.meta.dirname, '..')
const reports_directory = resolve(repository_directory, 'docs', 'tests')
if (
  relative(repository_directory, reports_directory) !== join('docs', 'tests')
) {
  console.error('Refusing to replace a report directory outside docs/tests.')
  process.exit(1)
}

remove_directory(reports_directory, { recursive: true, force: true })
make_directory(reports_directory, { recursive: true })
write_pending_test_report(reports_directory)

const npm_command = process.env.npm_execpath ? process.execPath : 'npm'
const npm_arguments = process.env.npm_execpath
  ? [process.env.npm_execpath]
  : []
const stages = []
const run_stage = async (id, label, script_name, timeout_ms) => {
  console.log(`\n=== ${label} ===`)
  const result = await run_command(
    npm_command,
    [...npm_arguments, 'run', script_name],
    {
    cwd: repository_directory,
    timeout_ms,
    }
  )
  const stage = {
    id,
    label,
    status: result.status,
    duration_ms: result.duration_ms,
  }
  stages.push(stage)
  return stage
}
const skip_stage = (id, label) =>
  stages.push({ id, label, status: null, duration_ms: 0 })

const wasm_build = await run_stage(
  'wasm_build',
  'C++ and Wasm build',
  'build:wasm',
  180_000
)
const typescript_build =
  wasm_build.status === 0
    ? await run_stage(
        'typescript_build',
        'TypeScript build',
        'build',
        120_000
      )
    : (skip_stage('typescript_build', 'TypeScript build'), stages.at(-1))

if (wasm_build.status === 0 && typescript_build.status === 0) {
  await run_stage(
    'vitest',
    'Unit, convergence, and stress',
    'test:vitest',
    240_000
  )
  await run_stage('runtimes', 'Runtime matrix', 'test:runtimes', 90_000)
  await run_stage('browser', 'Browser matrix', 'test:browser', 330_000)
} else {
  skip_stage('vitest', 'Unit, convergence, and stress')
  skip_stage('runtimes', 'Runtime matrix')
  skip_stage('browser', 'Browser matrix')
}

write_test_report(reports_directory, stages, started_at)
process.exitCode = stages.every(({ status }) => status === 0) ? 0 : 1
