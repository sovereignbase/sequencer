import { gzipSync as gzip } from 'node:zlib'
import { pack } from 'msgpackr'
import * as api from '../../dist/index.js'
import type { Delta } from '../../dist/index.js'

/** Measures serialized disk usage for common one-Frame operation workloads. */
export function measure_data_sizes() {
  const operation_count = 1_000
  const require_result = <T>(result: T | false, operation: string): T => {
    if (result === false)
      throw new TypeError(`Disk-usage setup failed for ${operation}.`)
    return result
  }
  const measure_delta = (
    name: string,
    delta: Delta<number>,
    operations: number
  ) => {
    const encoded = pack(delta)
    return {
      name,
      operations,
      average_bytes_per_operation: encoded.byteLength / operations,
      messagepack_bytes: encoded.byteLength,
      messagepack_gzip_bytes: gzip(encoded, { level: 9 }).byteLength,
    }
  }

  const insert_state = api.create<number>()
  const insert_delta: Delta<number> = []
  for (let index = 0; index < operation_count; index++) {
    const result = require_result(
      api.insert(insert_state, index, [index]),
      'insert'
    )
    insert_delta.push(...result.delta)
  }

  const remove_state = api.create<number>()
  require_result(
    api.insert(
      remove_state,
      0,
      Array.from({ length: operation_count }, (_, index) => index)
    ),
    'insert'
  )
  const remove_delta: Delta<number> = []
  for (let index = 0; index < operation_count; index++) {
    const result = require_result(api.remove(remove_state, 0, 1), 'remove')
    remove_delta.push(...result.delta)
  }

  return [
    measure_delta('1,000 one-Frame inserts', insert_delta, operation_count),
    measure_delta('1,000 one-Frame Masks', remove_delta, operation_count),
    measure_delta(
      'Snapshot containing 1,000 one-Frame Strips',
      api.snapshot(insert_state),
      operation_count
    ),
  ]
}
