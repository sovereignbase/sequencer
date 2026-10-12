import { serialize } from 'node:v8'
import type { Sequence } from '../../dist/index.js'
import type {
  MemoryResult,
  ProcessMemoryResult,
  StorageResult,
} from './types.ts'

/**
 * Measures exported representation, distinct from live native or process memory.
 * @param sequence Retained metadata and Footage after export compaction.
 * @param stripCount Workload grouping or retained positive-root count, as selected by the suite.
 * @param frameCount Visible Frame count used as the report denominator.
 * @returns Four-byte word plus eight-byte slot estimates, and actual V8 serialization size.
 */
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
  // This is a comparable representation estimate, not V8 numeric-array storage
  // accounting, native arena allocation, or the size of objects referenced by Footage.
  const sequenceMetadataWordBytes = sequence[0].length * 4
  const javascriptFootageSlotBytes = sequence[1].length * 8
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

/** Captures the shared Node process, including fixtures, results and every Projection. */
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
