import { spawnSync } from 'node:child_process'
import { chmod, mkdir, readFile, writeFile } from 'node:fs/promises'
import { delimiter, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = fileURLToPath(new URL('../', import.meta.url))
const shimDirectory = join(root, 'temp', 'build', 'tsc-compat')
await mkdir(shimDirectory, { recursive: true })
const tsc = join(root, 'node_modules', 'typescript', 'bin', 'tsc')
// Emscripten's declaration generator invokes deprecated --outFile with TS 6.
// Supply the compatibility flag without changing the installed toolchain.
if (process.platform === 'win32') {
  await writeFile(join(shimDirectory, 'tsc.cmd'),
    `@"${process.execPath}" "${tsc}" --ignoreDeprecations 6.0 %*\r\n`)
} else {
  const quote = (value) => `'${value.replaceAll("'", "'\\''")}'`
  const shim = join(shimDirectory, 'tsc')
  await writeFile(shim, `#!/bin/sh\nexec ${quote(process.execPath)} ${quote(tsc)} --ignoreDeprecations 6.0 "$@"\n`)
  await chmod(shim, 0o755)
}
const env = { ...process.env, PATH: `${shimDirectory}${delimiter}${process.env.PATH ?? ''}` }
for (const args of [
  ['--build', '--preset', 'wasm-release'],
  ['--install', 'temp/build/wasm-release', '--prefix', 'src/typescript/wasm/raw'],
]) {
  const result = spawnSync('cmake', args, { cwd: root, env, stdio: 'inherit' })
  if (result.error) throw result.error
  if (result.status !== 0) process.exit(result.status ?? 1)
}
const modulePath = join(root, 'src', 'typescript', 'wasm', 'raw', 'sequencer_wasm.mjs')
const code = await readFile(modulePath, 'utf8')
// Compilation is synchronous by CMake configuration; retain a sync factory.
if (code.startsWith('async function Module'))
  await writeFile(modulePath, code.replace(/^async function Module/, 'function Module'))
