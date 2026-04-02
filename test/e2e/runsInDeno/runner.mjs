import * as api from '../../../dist/index.js'
import {
  ensurePassing,
  printResults,
  runBytecodecSuite,
} from '../shared/suite.mjs'

const results = await runBytecodecSuite(api, { label: 'deno esm' })
printResults(results)
ensurePassing(results)
/** update to current package */
