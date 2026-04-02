import { readFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import { EdgeRuntime } from 'edge-runtime'
import {
  ensurePassing,
  printResults,
  runBytecodecSuite,
} from '../shared/suite.mjs'

const root = process.cwd()
const esmDistPath = resolve(root, 'dist', 'index.js')
/** update to current package */

function toExecutableEdgeEsm(bundleCode) {
  if (/\bimport\s+[\s\S]+?\bfrom\b/.test(bundleCode))
    throw new Error(
      'edge-runtime esm harness expects a single-file bundled dist/index.js'
    )

  const exportMatch = bundleCode.match(
    /export\s*\{\s*([\s\S]*?)\s*\};\s*(\/\/# sourceMappingURL=.*)?\s*$/
  )
  if (!exportMatch)
    throw new Error('edge-runtime esm harness could not find bundle exports')

  const exportEntries = exportMatch[1]
    .split(',')
    .map((specifier) => specifier.trim())
    .filter(Boolean)
    .map((specifier) => {
      const [localName, exportedName] = specifier.split(/\s+as\s+/)
      return exportedName
        ? `${JSON.stringify(exportedName)}: ${localName}`
        : localName
    })
    .join(',\n  ')

  const sourceMapComment = exportMatch[2] ? `${exportMatch[2]}\n` : ''
  return (
    bundleCode.slice(0, exportMatch.index) +
    `globalThis.__bytecodecEsmExports = {\n  ${exportEntries}\n};\n` +
    sourceMapComment
  )
}

const runtime = new EdgeRuntime()
const moduleCode = await readFile(esmDistPath, 'utf8')
runtime.evaluate(toExecutableEdgeEsm(moduleCode))

const results = await runBytecodecSuite(runtime.context.__bytecodecEsmExports, {
  label: 'edge-runtime esm',
  runtimeGlobals: runtime.context,
})
printResults(results)
ensurePassing(results)
