/** Isolated benchmark runtimes use the same public implementation and independent WASM allocations. */
import { fileURLToPath } from 'node:url'
import { build } from 'tsdown'
import type { Projection as PublicProjection } from '../../dist/index.js'
import type { RuntimeMemoryResult } from './types.ts'

type Library = {
  Projection: typeof PublicProjection
  measureRuntimeMemory: () => RuntimeMemoryResult
}

const built = await build({
  config: false,
  entry: fileURLToPath(new URL('./library.ts', import.meta.url)),
  format: 'iife',
  globalName: 'SequencerBenchmark',
  platform: 'neutral',
  target: 'es2024',
  dts: false,
  write: false,
  clean: false,
  logLevel: 'silent',
})
const chunk = built.bundles[0].chunks.find(
  (chunk) => chunk.type === 'chunk' && chunk.isEntry
)
if (chunk?.type !== 'chunk') throw new Error('Missing benchmark library bundle')
// Evaluate only our generated bundle. A factory avoids retaining old WASM instances
// in Node's module cache when a measured run or fixture is replaced.
const createLibrary = new Function(
  chunk.code + '\nreturn SequencerBenchmark;'
) as () => Library

/** Public API constructor for the measured instance. */
export let Projection: typeof PublicProjection
export type Projection<T> = PublicProjection<T>
/** Peer and temporary constructor measurements have independent native allocation. */
export let PeerProjection: typeof PublicProjection
/** Samples the measured instance's runtime, excluding its peer. */
export let measureRuntimeMemory: () => RuntimeMemoryResult

/** Starts an independent measurement without retaining earlier native high-water capacity. */
export function resetRuntime(): void {
  const primary = createLibrary()
  const peer = createLibrary()
  Projection = primary.Projection
  PeerProjection = peer.Projection
  measureRuntimeMemory = primary.measureRuntimeMemory
}
resetRuntime()
