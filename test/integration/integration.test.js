import test from 'node:test'
import * as api from '../../dist/index.js'
import { resolve } from 'node:path'
import { spawnSync } from 'node:child_process'
import {
  ensurePassing,
  printResults,
  runCRListSuite,
} from '../e2e/shared/suite.mjs'

test('integration: CRList replicas converge under shuffled gossip', async () => {
  const results = await runCRListSuite(api, {
    label: 'integration',
    includeStress: false,
  })
  printResults(results)
  ensurePassing(results)

  const stressRunner = resolve(
    process.cwd(),
    'test',
    'integration',
    'convergence-stress-runner.mjs'
  )
  const result = spawnSync(process.execPath, [stressRunner], {
    stdio: 'inherit',
    timeout: 10_000,
  })
  if (result.error) throw result.error
  if (result.status !== 0)
    throw new Error(`convergence stress exited with ${result.status ?? 1}`)
})
