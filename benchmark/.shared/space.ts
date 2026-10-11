import { serialize } from 'node:v8'
import type { Sequence } from '../../dist/class.js'
import type {
  MemoryResult,
  ProcessMemoryResult,
  StorageResult,
} from './types.ts'

/** Comparable Sequence footprint; process memory includes the entire benchmark. */
export function measureSpace(
  sequence: Sequence<number>,
  stripCount: number,
  frameCount: number
): {
  memory: MemoryResult
  storage: StorageResult
} {
  const ratio = (bytes: number, units: number) =>
    units === 0 ? null : bytes / units
  const sequenceMetadataWordBytes =
    (sequence[0].reduce((words, ack) => words + ack.length, 0) +
      sequence[1].length * 6) *
    4
  const javascriptFootageSlotBytes =
    sequence[1].reduce(
      (slots, insertion) => slots + (insertion[6]?.length ?? 0),
      0
    ) * 8
  const bytes = sequenceMetadataWordBytes + javascriptFootageSlotBytes
  const sequenceBytes = serialize(sequence).byteLength
  return {
    memory: {
      bytes,
      bytesPerStrip: ratio(bytes, stripCount),
      bytesPerFrame: ratio(bytes, frameCount),
      measurement: 'estimated-sequence-words-plus-js-footage-slots',
      sequenceMetadataWordBytes,
      javascriptFootageSlotBytes,
    },
    storage: {
      serialization: 'node:v8.serialize',
      sequenceBytes,
      bytesPerStrip: ratio(sequenceBytes, stripCount),
      bytesPerFrame: ratio(sequenceBytes, frameCount),
    },
  }
}

export function measureProcessMemory(): ProcessMemoryResult {
  const memory = process.memoryUsage()
  return {
    scope: 'shared-process-not-attributable-to-one-replica',
    rssBytes: memory.rss,
    heapTotalBytes: memory.heapTotal,
    heapUsedBytes: memory.heapUsed,
    externalBytes: memory.external,
    arrayBufferBytes: memory.arrayBuffers,
  }
}
