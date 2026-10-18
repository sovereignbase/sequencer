import { createRequire } from 'node:module'
import { runSuite } from '../.shared/suite.ts'

/** Executes the packaged ESM constructor imported by the shared suite. */
export const esm = () => runSuite()
/** Executes the same contracts with the packaged CommonJS constructor. */
export const cjs = () => {
  const { Projection, SequencerError } = createRequire(import.meta.url)(
    '../../../dist/index.cjs'
  )
  return runSuite(Projection, SequencerError)
}
