import { encode } from '@msgpack/msgpack'
import { gzipSync } from 'node:zlib'
import type { Sequence } from '../../dist/index.js'
import type { EncodedSequenceSizes } from '../.shared/types.ts'

/**
 * Measures transport encodings outside the public API's timed regions.
 * @param sequence Complete checkpoint Sequence, including Footage and acknowledgements.
 * @returns JSON and MessagePack sizes, before and after level-nine gzip.
 */
export function measureEncodedSequence(
  sequence: Sequence<number>
): EncodedSequenceSizes {
  // Numeric arrays preserve the wire coordinates independently of typed-array encodings.
  const transport = [Array.from(sequence[0]), sequence[1]]
  const json = Buffer.from(JSON.stringify(transport))
  const messagePack = encode(transport)
  return {
    jsonBytes: json.byteLength,
    jsonGzipBytes: gzipSync(json, { level: 9 }).byteLength,
    messagePackBytes: messagePack.byteLength,
    messagePackGzipBytes: gzipSync(messagePack, { level: 9 }).byteLength,
  }
}
