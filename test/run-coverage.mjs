import { readFileSync, rmSync } from 'node:fs'
import { resolve } from 'node:path'
import { spawnSync } from 'node:child_process'
import fg from 'fast-glob'

const coverageDir = resolve(process.cwd(), '.c8')
rmSync(coverageDir, { recursive: true, force: true })
/** update to current package */
const env = { ...process.env, NODE_V8_COVERAGE: coverageDir }

function run(command, args, envOverride = env) {
  const result = spawnSync(command, args, {
    stdio: 'inherit',
    env: envOverride,
    timeout: 120_000,
  })
  if (result.error) {
    console.error(result.error)
    process.exit(1)
  }
  if (result.status !== 0) process.exit(result.status ?? 1)
}

const unitTests = fg.sync('test/unit/**/*.test.js')
const integrationTests = fg.sync('test/integration/**/*.test.js')

run(process.execPath, ['--test', '--test-concurrency=1', ...unitTests])
run(process.execPath, ['--test', '--test-concurrency=1', ...integrationTests])

const c8Bin = resolve(process.cwd(), 'node_modules', 'c8', 'bin', 'c8.js')
run(
  process.execPath,
  [
    c8Bin,
    'report',
    '--check-coverage',
    '--lines',
    '100',
    '--functions',
    '100',
    '--statements',
    '100',
    '--temp-directory',
    coverageDir,
    '--reporter',
    'text',
    '--reporter',
    'lcov',
  ],
  process.env
)

const lcov = readFileSync(
  resolve(process.cwd(), 'coverage', 'lcov.info'),
  'utf8'
)
let sourceFile = ''
const uncoveredBranches = []
for (const line of lcov.split(/\r?\n/u)) {
  if (line.startsWith('SF:')) sourceFile = line.slice(3).replaceAll('\\', '/')
  if (!line.startsWith('BRDA:')) continue
  const [sourceLine, __, ___, count] = line.slice(5).split(',')
  if (count === '0' || count === '-')
    uncoveredBranches.push({ sourceFile, sourceLine: Number(sourceLine) })
}
const unexpectedUncoveredBranches = uncoveredBranches.filter(
  ({ sourceFile, sourceLine }) =>
    !sourceFile.endsWith('src/.helpers/assertListIndices/index.ts') ||
    sourceLine !== 7
)
/**
if (unexpectedUncoveredBranches.length > 0) {
  console.error('Unexpected uncovered branches:', unexpectedUncoveredBranches)
  process.exit(1)
}
 */

rmSync(coverageDir, { recursive: true, force: true })
