/** Builds and installs the synchronous WASM module and its TypeScript declarations. */
import { spawnSync } from 'node:child_process'
import { readFile, writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'

/** Repository directory against which CMake resolves its build and install paths. */
const root = fileURLToPath(new URL('../', import.meta.url))

// Complete compilation before installing the generated module into the source tree.
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
  // A failed command must stop the build and preserve CMake's exit status.
  if (result.error) throw result.error
  if (result.status !== 0) process.exit(result.status ?? 1)
}
/** Installed JavaScript factory used by the TypeScript runtime. */
const modulePath = join(
  root,
  'src',
  'typescript',
  'wasm',
  'raw',
  'sequencer_wasm.mjs'
)
/** Emscripten output before synchronous initialization is restored. */
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
