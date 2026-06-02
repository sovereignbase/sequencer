import * as api from '../../../dist/index.js'
import {
  ensurePassing,
  printResults,
  runCRListSuite,
} from '../shared/suite.mjs'

const results = await runCRListSuite(api, {
  label: 'deno esm',
  profile: 'runtime',
})
printResults(results)
ensurePassing(results)
/** update to current package */
