import { spawnSync as spawn_sync } from 'node:child_process'
import { fileURLToPath as file_url_to_path } from 'node:url'
import { memoryUsage as memory_usage } from 'node:process'
import * as api from '../../dist/index.js'

const sequence_frame_counts = [100, 1_000, 10_000, 100_000, 1_000_000] as const
const strip_frame_counts = [1, 10] as const

const collect_garbage = async (): Promise<void> => {
  const collect = (globalThis as typeof globalThis & { gc?: () => void }).gc
  collect?.()
  await new Promise<void>((resolve_done) => setImmediate(resolve_done))
  collect?.()
  await new Promise<void>((resolve_done) => setImmediate(resolve_done))
}

const measure_scenario = async (
  sequence_frame_count: number,
  strip_frame_count: number
) => {
  await collect_garbage()
  const baseline = memory_usage()
  const state = api.create<string>()
  const strip_values = Array.from({ length: strip_frame_count }, () => 'a')

  for (
    let frame_index = 0;
    frame_index < sequence_frame_count;
    frame_index += strip_frame_count
  )
    if (api.insert(state, frame_index, strip_values) === false)
      throw new TypeError('Memory benchmark insertion failed.')

  await collect_garbage()
  const current = memory_usage()
  const rss_bytes = Math.max(0, current.rss - baseline.rss)
  void api.length(state)
  return {
    sequence_frame_count,
    strip_frame_count,
    retained_strip_count: sequence_frame_count / strip_frame_count,
    rss_bytes,
    rss_bytes_per_frame: rss_bytes / sequence_frame_count,
    heap_used_bytes: Math.max(0, current.heapUsed - baseline.heapUsed),
    external_bytes: Math.max(0, current.external - baseline.external),
    array_buffer_bytes: Math.max(
      0,
      current.arrayBuffers - baseline.arrayBuffers
    ),
  }
}

if (process.argv[2] === 'measure_scenario') {
  const sequence_frame_count = Number(process.argv[3])
  const strip_frame_count = Number(process.argv[4])
  process.stdout.write(
    JSON.stringify(
      await measure_scenario(sequence_frame_count, strip_frame_count)
    )
  )
}

/** Measures every Sequence/Strip memory scenario in a fresh process. */
export async function measure_memory_usage() {
  const rows = []
  for (const sequence_frame_count of sequence_frame_counts)
    for (const strip_frame_count of strip_frame_counts) {
      const result = spawn_sync(
        process.execPath,
        [
          '--expose-gc',
          '--experimental-strip-types',
          file_url_to_path(import.meta.url),
          'measure_scenario',
          String(sequence_frame_count),
          String(strip_frame_count),
        ],
        { encoding: 'utf8' }
      )
      if (result.status !== 0)
        throw new TypeError(
          `Memory benchmark failed for ${sequence_frame_count} Frames / ${strip_frame_count} Frames per Strip: ${result.stderr.trim()}`
        )
      rows.push(
        JSON.parse(result.stdout) as Awaited<
          ReturnType<typeof measure_scenario>
        >
      )
    }
  return rows
}
