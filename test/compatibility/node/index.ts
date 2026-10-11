import { createRequire } from 'node:module'
import { runSuite } from '../.shared/suite.ts'

export const esm = () => runSuite()
export const cjs = () =>
  runSuite(createRequire(import.meta.url)('../../../dist/class.cjs').Projection)
