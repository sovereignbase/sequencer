/** Formats or checks C++ source files using the repository's clang-format configuration. */
import { spawnSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'
import glob from 'fast-glob'

/** Repository directory used to resolve source paths and the formatting configuration. */
const root = fileURLToPath(new URL('../', import.meta.url))
/** Check mode reports formatting differences without modifying source files. */
const check = process.argv.slice(2).includes('--check')
if (process.argv.slice(2).some((argument) => argument !== '--check'))
  throw new Error('Usage: node scripts/format-cpp.ts [--check]')

/** C++ source and header paths relative to the repository directory. */
const files = await glob('src/c++/**/*.{c,cc,cpp,cxx,h,hh,hpp,hxx}', {
  cwd: root,
  onlyFiles: true,
})

if (files.length) {
  // One invocation applies .clang-format consistently across all matching files.
  const args = check ? ['--dry-run', '--Werror'] : ['-i']
  const result = spawnSync(
    'clang-format',
    [...args, '--style=file', ...files],
    {
      cwd: root,
      stdio: 'inherit',
      windowsHide: true,
    }
  )
  // Preserve launch failures and clang-format's exit status for npm and CI.
  if (result.error) throw result.error
  if (result.status !== 0) process.exit(result.status ?? 1)
}

console.log(`${check ? 'Checked' : 'Formatted'} ${files.length} C++ files.`)
