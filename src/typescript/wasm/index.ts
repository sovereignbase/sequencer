import create_module, { type MainModule } from './raw/sequencer_wasm.mjs'
import type { Acknowledgement, Projection } from '../types/type.js'

export const wasm: MainModule = create_module()
export const no_projection_frame_index = 0xffff_ffff

function write_projection(projection: Projection): void {
  const start = wasm._prepare_projection_buffer(projection.length >>> 3) >>> 2
  wasm.HEAPU32.set(projection, start)
}

function write_acknowledgement(acknowledgement: Acknowledgement): void {
  const start = wasm._prepare_frontier_buffer(acknowledgement.length) >>> 2
  wasm.HEAPU32.set(acknowledgement, start)
}

export function read_projection(): Uint32Array {
  const wordCount = wasm._get_projection_buffer_word_count() >>> 0
  const start = wasm._get_projection_buffer_pointer() >>> 2
  const projection = wasm.HEAPU32.slice(start, start + wordCount)
  wasm._clear_projection_buffer()
  return projection
}

export function read_acknowledgement(sequenceId: number): Acknowledgement {
  const wordCount =
    wasm._get_cached_acknowledgement_word_count(sequenceId) >>> 0
  const start = wasm._get_cached_acknowledgement_pointer(sequenceId) >>> 2
  const acknowledgement = wasm.HEAPU32.slice(start, start + wordCount)
  wasm._consume_cached_acknowledgement(sequenceId)
  return acknowledgement
}

export function create_sequence<T>(
  actorId: number,
  frontiers: Array<Acknowledgement>,
  projection: Projection,
  footageLength: number
): number {
  let frontierWordCount = frontiers.length
  for (const frontier of frontiers) frontierWordCount += frontier.length
  let frontierStart = wasm._prepare_frontier_buffer(frontierWordCount) >>> 2
  for (const frontier of frontiers) {
    wasm.HEAPU32[frontierStart++] = frontier.length
    wasm.HEAPU32.set(frontier, frontierStart)
    frontierStart += frontier.length
  }

  const projectionStart =
    wasm._prepare_projection_buffer(projection.length >>> 3) >>> 2
  wasm.HEAPU32.set(projection, projectionStart)
  return wasm._create_projection(actorId, footageLength) >>> 0
}

export function clear_sequence(sequenceId: number): void {
  wasm._clear_projection(sequenceId)
}

export function get_projection_frame_count(sequenceId: number): number {
  return wasm._get_projection_frame_count(sequenceId) >>> 0
}

export function get_footage_frame_index(
  sequenceId: number,
  projectionFrameIndex: number
): number {
  return wasm._get_footage_frame_index(sequenceId, projectionFrameIndex) >>> 0
}

export function get_projection_footage_spans(
  sequenceId: number,
  startIndex: number,
  endIndex: number
): Uint32Array | false {
  const count =
    wasm._write_projection_footage_spans_to_buffer(
      sequenceId,
      startIndex,
      endIndex
    ) >>> 0
  return count === 0 ? false : read_footage_spans(count)
}

export function read_footage_spans(
  count = wasm._get_footage_span_buffer_count() >>> 0
): Uint32Array {
  const start = count === 0 ? 0 : wasm._get_footage_span_buffer_pointer() >>> 2
  return wasm.HEAPU32.subarray(start, start + count * 4)
}

export function clear_footage_spans(): void {
  wasm._clear_footage_span_buffer()
}

export function update_sequence(
  sequenceId: number,
  index: number,
  type: 1 | 2,
  length: number,
  footageIndex: number
): number {
  return (
    wasm._update_projection(sequenceId, index, type, length, footageIndex) >>> 0
  )
}

export function replace_sequence(
  sequenceId: number,
  index: number,
  length: number,
  footageIndex: number
): number {
  return wasm._replace_projection(sequenceId, index, length, footageIndex) >>> 0
}

export function remove_sequence(
  sequenceId: number,
  index: number,
  length: number
): number {
  return wasm._remove_projection(sequenceId, index, length) >>> 0
}

export function ingest_sequence<T>(
  sequenceId: number,
  acknowledgement: Acknowledgement,
  projection: Projection,
  footageIndex: number,
  footageLength: number
): Uint32Array | false | null {
  write_acknowledgement(acknowledgement)
  write_projection(projection)
  const status = wasm._ingest_projection(
    sequenceId,
    footageIndex,
    footageLength
  )
  if (status === 2) return null
  if (status !== 1) return false
  const count = wasm._get_footage_span_buffer_count() >>> 0
  return read_footage_spans(count)
}

export function snapshot_sequence(sequenceId: number): void {
  wasm._snapshot_projection(sequenceId)
}

export function read_snapshot_projection(): Uint32Array {
  return read_projection()
}

export function get_snapshot_frontiers(sequenceId: number): number[][] {
  const wordCount = wasm._snapshot_frontiers(sequenceId) >>> 0
  const start = wasm._get_frontier_buffer_pointer() >>> 2
  const words = wasm.HEAPU32.subarray(start, start + wordCount)
  const result: number[][] = []
  for (let offset = 0; offset < words.length;) {
    const length = words[offset++]
    void result.push(Array.from(words.subarray(offset, offset + length)))
    offset += length
  }
  wasm._clear_frontier_buffer()
  return result
}
