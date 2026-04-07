import test from 'node:test'
import * as api from '../../dist/index.js'
import {
  ensurePassing,
  printResults,
  runCRListSuite,
} from '../e2e/shared/suite.mjs'

test('integration: CRList replicas converge under shuffled gossip', async () => {
  const results = await runCRListSuite(api, {
    label: 'integration',
    stressRounds: 32,
  })
  printResults(results)
  ensurePassing(results)
})
