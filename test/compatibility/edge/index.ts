import { EdgeRuntime } from 'edge-runtime'
import type { Outcome } from '../.shared/suite.ts'

export function run(source: string): Outcome[] {
  const runtime = new EdgeRuntime({ initialCode: source })
  return runtime.evaluate('Compatibility.runSuite()')
}
