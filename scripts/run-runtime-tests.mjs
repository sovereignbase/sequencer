import {
  mkdirSync as make_directory,
  writeFileSync as write_file,
} from 'node:fs'
import { resolve } from 'node:path'
import { run_command } from './.helpers/run_command.mjs'

const repository_directory = resolve(import.meta.dirname, '..')
const report_directory = resolve(repository_directory, 'docs', 'tests')
const binary_directory = resolve(repository_directory, 'node_modules', '.bin')
const binary = (name) =>
  resolve(binary_directory, `${name}${process.platform === 'win32' ? '.cmd' : ''}`)
const runtime_binary = (name) =>
  process.platform === 'win32'
    ? resolve(
        repository_directory,
        'node_modules',
        name,
        ...(name === 'bun' ? ['bin', 'bun.exe'] : ['deno.exe'])
      )
    : binary(name)
const runner = (file_name) =>
  resolve(repository_directory, 'test', 'runtime', file_name)
const runtime_marker = 'SEQUENCER_RUNTIME_RESULT='

const specifications = [
  {
    name: 'Node.js',
    command: process.execPath,
    arguments: [runner('module.mjs')],
  },
  {
    name: 'Deno',
    command: runtime_binary('deno'),
    arguments: ['run', runner('module.mjs')],
  },
  {
    name: 'Bun',
    command: runtime_binary('bun'),
    arguments: ['run', runner('module.mjs')],
  },
  {
    name: 'Edge Runtime',
    command: process.execPath,
    arguments: [runner('edge_runtime.mjs')],
  },
  {
    name: 'Cloudflare Workers',
    command: process.execPath,
    arguments: [runner('cloudflare_workers.mjs')],
  },
]

const results = await Promise.all(
  specifications.map(async (specification) => {
    console.log(`\n[Runtime] ${specification.name}`)
    const command_result = await run_command(
      specification.command,
      specification.arguments,
      { cwd: repository_directory, timeout_ms: 60_000 }
    )
    const result_line = command_result.standard_output
      .split(/\r?\n/)
      .findLast((line) => line.startsWith(runtime_marker))
    let detail

    if (result_line) {
      try {
        detail = JSON.parse(result_line.slice(runtime_marker.length))
      } catch {}
    }

    return {
      name: specification.name,
      status:
        command_result.status === 0 && detail?.passed === true
          ? 'passed'
          : command_result.timed_out
            ? 'timed_out'
            : 'failed',
      duration_ms: command_result.duration_ms,
      version: detail?.version,
      assertions: detail?.assertions,
      error:
        command_result.error?.message ??
        (!detail ? command_result.standard_error.trim() || 'No result returned.' : undefined),
    }
  })
)

make_directory(report_directory, { recursive: true })
write_file(
  resolve(report_directory, 'runtime-results.json'),
  `${JSON.stringify({ generated_at: new Date().toISOString(), results }, null, 2)}\n`
)

const all_passed = results.every(({ status }) => status === 'passed')
for (const result of results) {
  console.log(
    `${result.status === 'passed' ? 'PASS' : 'FAIL'} ${result.name}${result.version ? ` ${result.version}` : ''} (${result.duration_ms} ms)`
  )
}
process.exitCode = all_passed ? 0 : 1
