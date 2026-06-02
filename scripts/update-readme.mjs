import { spawnSync } from 'node:child_process'
import { readFileSync, writeFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { markdownTable } from '../benchmark/helpers/table.js'
import * as api from '../dist/index.js'
import { runCRListSuite } from '../test/e2e/shared/suite.mjs'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const readmePath = resolve(root, 'README.md')

function replaceSection(content, commandBlock, nextHeading, body) {
  const match = content.match(commandBlock)
  const eol = content.includes('\r\n') ? '\r\n' : '\n'

  if (!match) {
    throw new Error(`missing README command block: ${commandBlock}`)
  }

  const start = match.index + match[0].length
  const end = content.indexOf(nextHeading, start)

  if (end === -1) {
    throw new Error(`missing README heading: ${nextHeading}`)
  }

  return `${content.slice(0, start)}${eol}${eol}${body.replaceAll('\n', eol)}${eol}${eol}${content.slice(end)}`
}

function renderTestsBody() {
  const results = runCRListSuite(api, { label: 'README' })
  const passed = results.tests.filter((entry) => entry.ok).length
  const lines = [
    'Current test results:',
    '',
    `- Total: ${passed}/${results.tests.length} passing.`,
    `- Groups: ${results.groups.length}.`,
    '',
    '| group | result |',
    '| --- | --- |',
  ]

  for (const group of results.groups) {
    const groupPassed = group.tests.filter((entry) => entry.ok).length
    const status =
      groupPassed === group.tests.length
        ? `${groupPassed}/${group.tests.length} passing`
        : `${groupPassed}/${group.tests.length} FAILING`

    lines.push(`| \`${group.name}\` | ${status} |`)
  }

  if (results.errors.length > 0) {
    lines.push('', 'Failures:')

    for (const error of results.errors) {
      lines.push(`- \`${error.group}\` / ${error.name}: ${error.message}`)
    }
  }

  return lines.join('\n')
}

function renderBenchmarksBody() {
  const result = spawnSync(
    process.execPath,
    [resolve(root, 'benchmark', 'bench.js'), '--json'],
    { cwd: root, encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 }
  )

  if (result.status !== 0) {
    throw new Error(`benchmark failed: ${result.stderr}`)
  }

  const { node, platform, arch, rows } = JSON.parse(result.stdout)

  return [
    `Last measured on Node \`${node}\` (\`${platform} ${arch}\`):`,
    markdownTable(rows),
  ].join('\n')
}

function main() {
  const flags = new Set(process.argv.slice(2))
  const checkOnly = flags.has('--check')
  const skipBench = flags.has('--no-bench')
  const original = readFileSync(readmePath, 'utf8')

  let updated = replaceSection(
    original,
    /```sh\r?\nnpm run test\r?\n```/,
    '## Benchmarks',
    renderTestsBody()
  )

  if (!skipBench) {
    updated = replaceSection(
      updated,
      /```sh\r?\nnpm run bench\r?\n```/,
      '## License',
      renderBenchmarksBody()
    )
  }

  if (checkOnly) {
    if (updated !== original) {
      console.error('README is out of date. Run: npm run update-readme')
      process.exit(1)
    }

    console.log('README is up to date.')
    return
  }

  writeFileSync(readmePath, updated)
  console.log(`Updated README ${skipBench ? 'tests' : 'tests and benchmarks'}.`)
}

main()
