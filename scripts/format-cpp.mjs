import { spawnSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'
import glob from 'fast-glob'

const root = fileURLToPath(new URL('../', import.meta.url))
const files = await glob('src/c++/**/*.{c,cc,cpp,cxx,h,hh,hpp,hxx}', {
  cwd: root,
  onlyFiles: true,
})

if (files.length) {
  const result = spawnSync('clang-format', ['-i', '--style=file', ...files], {
    cwd: root,
    stdio: 'inherit',
  })
  if (result.error) throw result.error
  if (result.status !== 0) process.exit(result.status ?? 1)
}

console.log(`Formatted ${files.length} C++ files.`)
