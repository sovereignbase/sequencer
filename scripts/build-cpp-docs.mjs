/** Builds the complete Doxygen, Breathe, and Sphinx C++ reference. */

import { spawnSync as spawn_sync } from 'node:child_process'
import { existsSync as exists_sync } from 'node:fs'
import { fileURLToPath as file_url_to_path } from 'node:url'

/** Absolute repository directory used as the working directory of both tools. */
const repository_directory = file_url_to_path(new URL('..', import.meta.url))

/** Conventional Windows installation path used when Doxygen is not on PATH. */
const windows_doxygen = 'C:\\Program Files\\doxygen\\bin\\doxygen.exe'

/** Platform-appropriate Doxygen executable. */
const doxygen_command =
  process.platform === 'win32' && exists_sync(windows_doxygen)
    ? windows_doxygen
    : 'doxygen'

/**
 * Runs one documentation command synchronously and forwards its output.
 *
 * @param {string} command Executable to run from the repository directory.
 * @param {Array<string>} arguments_ Exact command-line arguments.
 * @returns {void}
 * @throws When the executable cannot be started.
 */
function run(command, arguments_) {
  // Execute in the repository so every configured relative path stays stable.
  const result = spawn_sync(command, arguments_, {
    cwd: repository_directory,
    stdio: 'inherit',
  })

  // Preserve launch failures and each tool's original nonzero exit status.
  if (result.error) throw result.error
  if (result.status !== 0) process.exit(result.status ?? 1)
}

// Extract the complete documented C++ interface as Breathe-compatible XML.
run(doxygen_command, ['Doxyfile'])

// Render a clean Sphinx reference and reject every documentation warning.
run('python', [
  '-m',
  'sphinx',
  '-b',
  'html',
  '-E',
  '-a',
  '--fail-on-warning',
  '-d',
  '.sphinx/doctrees',
  '.',
  'docs/c++',
])
