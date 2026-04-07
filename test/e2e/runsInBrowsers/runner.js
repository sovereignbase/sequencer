import * as api from '/dist/index.js'
import { printResults, runCRListSuite } from '../shared/suite.mjs'

const results = await runCRListSuite(api, { label: 'browser esm' })
printResults(results)
window.__CRLIST_RESULTS__ = results
const status = document.getElementById('status')
if (status)
  status.textContent = results.ok ? 'ok' : 'failed: ' + results.errors.length
