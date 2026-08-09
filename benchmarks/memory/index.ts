import { memoryUsage as memory_usage } from 'node:process'
import * as api from '../../dist/index.js'

const sequence_lengths = [100, 1_000, 10_000, 100_000, 1_000_000] as const

const collect_garbage = async (): Promise<void> => {
  const collect = (globalThis as typeof globalThis & { gc?: () => void }).gc
  collect?.()
  await new Promise<void>((resolve_done) => setImmediate(resolve_done))
  collect?.()
  await new Promise<void>((resolve_done) => setImmediate(resolve_done))
}

/** Measures cumulative process-memory growth of one retained Sequencer state. */
export async function measure_memory_usage() {
  await collect_garbage()
  const baseline = memory_usage()
  const state = api.create<string>()
  const rows = []
  let sequence_length = 0

  for (const target_length of sequence_lengths) {
    while (sequence_length < target_length) {
      if (api.insert(state, sequence_length, ['a']) === false)
        throw new TypeError('Memory benchmark insertion failed.')
      sequence_length++
    }

    await collect_garbage()
    const current = memory_usage()
    const rss_bytes = Math.max(0, current.rss - baseline.rss)
    rows.push({
      sequence_length,
      rss_bytes,
      rss_bytes_per_frame: rss_bytes / sequence_length,
      heap_used_bytes: Math.max(0, current.heapUsed - baseline.heapUsed),
      external_bytes: Math.max(0, current.external - baseline.external),
      array_buffer_bytes: Math.max(
        0,
        current.arrayBuffers - baseline.arrayBuffers
      ),
    })
  }

  void state
  return rows
}
