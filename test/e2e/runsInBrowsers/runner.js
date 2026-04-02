import * as api from '/dist/index.js'
import { printResults, runBytecodecSuite } from '../shared/suite.mjs'

const results = await runBytecodecSuite(api, { label: 'browser esm' })
printResults(results)
window.__BYTECODEC_RESULTS__ = results
const status = document.getElementById('status')
if (status)
  status.textContent = results.ok ? 'ok' : 'failed: ' + results.errors.length
