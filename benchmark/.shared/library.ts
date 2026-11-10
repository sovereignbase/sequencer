/** Benchmark entry retains diagnostics alongside the same public Projection implementation. */
import { runtime } from '../../src/typescript/runtime/client.js'
import module from '../../src/typescript/wasm/index.js'
import type { RuntimeMemoryResult } from './types.ts'
export { Projection } from '../../src/typescript/class.js'

/** Samples live library allocation, excluding unused WASM capacity and the peer. */
export const measureRuntimeMemory = (): RuntimeMemoryResult => {
  const { javascriptBytes } = runtime.memory()
  const wasmBytes = module._runtime_allocated()
  return {
    scope: 'single-instance-runtime',
    measurement: 'wasm-live-allocation-plus-js-array-slots',
    javascriptSlotBytes: 8,
    bytes: wasmBytes + javascriptBytes,
    wasmBytes,
    javascriptBytes,
  }
}

/** Live native allocations plus retained JS array slots; excludes unused WASM pages. */
export const measureAllocatedMemory = (): number => measureRuntimeMemory().bytes
