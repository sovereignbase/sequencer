import * as api from '../../dist/index.js'
import {
  ensurePassing,
  printResults,
  runCRListSuite,
} from '../e2e/shared/suite.mjs'

setTimeout(() => {
  console.error('integration stress watchdog timeout')
  process.exit(124)
}, 8_000).unref()

const results = await runCRListSuite(api, {
  label: 'integration stress',
  stressRounds: Number.parseInt(process.env.CRLIST_STRESS_ROUNDS ?? '5', 10),
  includeStress: true,
})

printResults(results)
ensurePassing(results)
