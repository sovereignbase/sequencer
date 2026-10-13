import { spawnSync } from 'node:child_process'
import { readFile, writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = fileURLToPath(new URL('../', import.meta.url))
for (const args of [
  ['--build', '--preset', 'wasm-release'],
  [
    '--install',
    'temp/build/wasm-release',
    '--prefix',
    'src/typescript/wasm/raw',
  ],
]) {
  const result = spawnSync('cmake', args, { cwd: root, stdio: 'inherit' })
  if (result.error) throw result.error
  if (result.status !== 0) process.exit(result.status ?? 1)
}
const modulePath = join(
  root,
  'src',
  'typescript',
  'wasm',
  'raw',
  'sequencer_wasm.mjs'
)
const code = await readFile(modulePath, 'utf8')
// Synchronous compilation and no incoming hooks make initialization synchronous.
// Emscripten still marks both the factory and its run function as asynchronous.
await writeFile(
  modulePath,
  code
    .replace(/^async function Module/, 'function Module')
    .replace('async function run()', 'function run()')
    .replace('await run();', 'run();')
)
