/** Benchmark entry retains diagnostics alongside the same public Projection implementation. */
import { runtime } from '../../src/typescript/runtime/client.js'
import module from '../../src/typescript/wasm/index.js'
import type { RuntimeMemoryResult } from './types.ts'
export { Projection } from '../../src/typescript/class.js'

/** Live native allocations plus retained JS array slots; excludes unused WASM pages. */
export const measureAllocatedMemory = (): number =>
  module._runtime_allocated() + runtime.memory().javascriptBytes

/** Samples the shared library without traversing native history or cloning Footage. */
export const measureRuntimeMemory = (): RuntimeMemoryResult => ({
  scope: 'single-instance-runtime' as const,
  measurement: 'wasm-linear-memory-plus-js-array-slots' as const,
  javascriptSlotBytes: 8 as const,
  ...runtime.memory(),
})
