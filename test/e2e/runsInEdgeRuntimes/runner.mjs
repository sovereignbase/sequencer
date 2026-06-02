import { readFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import * as bytecodec from '@sovereignbase/bytecodec'
import * as uuid from 'uuid'
import * as utils from '@sovereignbase/utils'
import { EdgeRuntime } from 'edge-runtime'
import {
  ensurePassing,
  printResults,
  runCRListSuite,
} from '../shared/suite.mjs'

const root = process.cwd()
const esmDistPath = resolve(root, 'dist', 'index.js')

function toDestructure(specifiers, globalName) {
  const members = specifiers
    .split(',')
    .map((part) => part.trim())
    .filter(Boolean)
    .map((part) => {
      const [left, right] = part.split(/\s+as\s+/)
      return right ? `${left.trim()}: ${right.trim()}` : left.trim()
    })
    .join(', ')

  return `const { ${members} } = ${globalName};\n`
}

function replaceNamedImports(bundleCode, packageName, globalName) {
  const pattern = new RegExp(
    `import\\s*\\{([^}]*)\\}\\s*from\\s*["']${packageName.replace(
      /[.*+?^${}()|[\]\\]/g,
      '\\$&'
    )}["'];\\s*`,
    'g'
  )

  return bundleCode.replace(pattern, (_, specifiers) =>
    toDestructure(specifiers, globalName)
  )
}

function toExecutableEdgeEsm(bundleCode) {
  const withoutImports = replaceNamedImports(
    replaceNamedImports(
      replaceNamedImports(bundleCode, 'uuid', 'globalThis.__CRLIST_UUID'),
      '@sovereignbase/bytecodec',
      'globalThis.__CRLIST_BYTECODEC'
    ),
    '@sovereignbase/utils',
    'globalThis.__CRLIST_UTILS'
  )

  const exportMatch = withoutImports.match(
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
    withoutImports.slice(0, exportMatch.index) +
    `globalThis.__crListEsmExports = {\n  ${exportEntries}\n};\n` +
    sourceMapComment
  )
}

const runtime = new EdgeRuntime()
runtime.context.__CRLIST_BYTECODEC = bytecodec
runtime.context.__CRLIST_UUID = uuid
runtime.context.__CRLIST_UTILS = utils
runtime.evaluate(`
  if (typeof globalThis.CustomEvent === 'undefined') {
    globalThis.CustomEvent = class CustomEvent extends Event {
      constructor(type, init = {}) {
        super(type, init)
        this.detail = init.detail ?? null
      }
    }
  }
`)
const moduleCode = await readFile(esmDistPath, 'utf8')
runtime.evaluate(toExecutableEdgeEsm(moduleCode))

const results = await runCRListSuite(runtime.context.__crListEsmExports, {
  label: 'edge-runtime esm',
  profile: 'runtime',
  runtimeGlobals: runtime.context,
})
printResults(results)
ensurePassing(results)
