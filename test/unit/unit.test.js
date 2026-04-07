import test from 'node:test'
import * as api from '../../dist/index.js'
import {
  ensurePassing,
  printResults,
  runCRListSuite,
} from '../e2e/shared/suite.mjs'

test('unit: CRList core invariants', async () => {
  const results = await runCRListSuite(api, {
    label: 'unit',
    stressRounds: 4,
    includeStress: false,
  })
  printResults(results)
  ensurePassing(results)
})
