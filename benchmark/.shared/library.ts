/** Benchmark entry retains diagnostics alongside the same public Projection implementation. */
import { runtime } from '../../src/typescript/runtime/client.js'
import type { RuntimeMemoryResult } from './types.ts'
export { Projection } from '../../src/typescript/class.js'

/** Samples the shared library without traversing native history or cloning Footage. */
export const measureRuntimeMemory = (): RuntimeMemoryResult => ({
  scope: 'single-instance-runtime' as const,
  measurement: 'wasm-linear-memory-plus-js-array-slots' as const,
  javascriptSlotBytes: 8 as const,
  ...runtime.memory(),
})
