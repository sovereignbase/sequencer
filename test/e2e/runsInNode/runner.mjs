import { createRequire } from 'node:module'
import * as esmApi from '../../../dist/index.js'
import {
  ensurePassing,
  printResults,
  runBytecodecSuite,
} from '../shared/suite.mjs'

const require = createRequire(import.meta.url)
const cjsApi = require('../../../dist/index.cjs')
/** update to current package */

for (const [label, api] of [
  ['node esm', esmApi],
  ['node cjs', cjsApi],
]) {
  const results = await runBytecodecSuite(api, { label })
  printResults(results)
  ensurePassing(results)
}
