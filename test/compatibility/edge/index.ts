import { EdgeRuntime } from 'edge-runtime'
import type { Outcome } from '../.shared/suite.ts'

/** Executes the neutral compatibility bundle inside an Edge Runtime isolate. */
export function run(source: string): Outcome[] {
  const runtime = new EdgeRuntime({ initialCode: source })
  return runtime.evaluate('Compatibility.runSuite()')
}
