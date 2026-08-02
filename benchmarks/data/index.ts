import { gzipSync as gzip } from 'node:zlib'
import { pack } from 'msgpackr'
import * as api from '../../dist/index.js'
import type { Reel } from '../../dist/index.js'

/** Measures MessagePack Reels for common one-frame operation workloads. */
export function measure_data_sizes() {
  const operation_count = 1_000
  const require_result = <T>(result: T | false, operation: string): T => {
    if (result === false)
      throw new TypeError(`Data-size setup failed for ${operation}.`)
    return result
  }
  const measure_reel = (
    name: string,
    reel: Reel<number>,
    operations: number
  ) => {
    const encoded = pack(reel)
    return {
      name,
      operations,
      average_bytes_per_operation: encoded.byteLength / operations,
      messagepack_bytes: encoded.byteLength,
      messagepack_gzip_bytes: gzip(encoded, { level: 9 }).byteLength,
    }
  }

  const update_state = api.__create<number>()
  const update_reel: Reel<number> = []
  for (let index = 0; index < operation_count; index++) {
    const result = require_result(
      api.__update(update_state, index === 0 ? 0 : index - 1, [index], 'after'),
      '__update'
    )
    update_reel.push(...result.reel)
  }

  const delete_state = api.__create<number>()
  require_result(
    api.__update(
      delete_state,
      0,
      Array.from({ length: operation_count }, (_, index) => index),
      'after'
    ),
    '__update'
  )
  const delete_reel: Reel<number> = []
  for (let index = 0; index < operation_count; index++) {
    const result = require_result(api.__delete(delete_state, 0, 1), '__delete')
    delete_reel.push(...result.reel)
  }

  return [
    measure_reel('1,000 one-frame updates', update_reel, operation_count),
    measure_reel('1,000 one-frame masks', delete_reel, operation_count),
    measure_reel(
      'Snapshot containing 1,000 one-frame strips',
      api.__snapshot(update_state),
      operation_count
    ),
  ]
}
