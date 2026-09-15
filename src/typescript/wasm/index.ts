import create_module, { type MainModule } from './raw/sequencer_wasm.mjs'
import type { Acknowledgement, Delta } from '../types/type.js'

export const wasm: MainModule = create_module()
export const no_projection_frame_index = 0xffff_ffff

function write_deltas(deltas: Array<Delta<unknown>>): void {
  const start = wasm._prepare_projection_buffer(deltas.length) >>> 2
  for (let delta = 0; delta < deltas.length; ++delta)
    for (let word = 0; word < 8; ++word)
      wasm.HEAPU32[start + delta * 8 + word] = deltas[delta][word] as number
}

function write_acknowledgement(acknowledgement: Acknowledgement): void {
  const start = wasm._prepare_frontier_buffer(acknowledgement.length) >>> 2
  wasm.HEAPU32.set(acknowledgement, start)
}

export function read_deltas<T>(): Array<Delta<T>> {
  const wordCount = wasm._get_projection_buffer_word_count() >>> 0
  const start = wasm._get_projection_buffer_pointer() >>> 2
  const words = wasm.HEAPU32
  const deltas = new Array<Delta<T>>(wordCount / 8)
  for (let delta = 0; delta < deltas.length; ++delta) {
    const offset = start + delta * 8
    deltas[delta] = [
      words[offset],
      words[offset + 1],
      words[offset + 2],
      words[offset + 3],
      words[offset + 4],
      words[offset + 5],
      words[offset + 6],
      words[offset + 7],
    ] as Delta<T>
  }
  wasm._clear_projection_buffer()
  return deltas
}

export function read_acknowledgement(sequenceId: number): Acknowledgement {
  const wordCount =
    wasm._get_cached_acknowledgement_word_count(sequenceId) >>> 0
  const start = wasm._get_cached_acknowledgement_pointer(sequenceId) >>> 2
  return Array.from(wasm.HEAPU32.subarray(start, start + wordCount))
}

export function create_sequence<T>(
  actorId: number,
  frontiers: Array<Acknowledgement>,
  projection: Array<Delta<T>>,
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
    wasm._prepare_projection_buffer(projection.length) >>> 2
  for (let strip = 0; strip < projection.length; ++strip)
    for (let word = 0; word < 8; ++word)
      wasm.HEAPU32[projectionStart + strip * 8 + word] = projection[strip][
        word
      ] as number
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

export function ingest_sequence<T>(
  sequenceId: number,
  acknowledgement: Acknowledgement,
  deltas: Array<Delta<T>>,
  footageIndex: number,
  footageLength: number
): Uint32Array | false {
  write_acknowledgement(acknowledgement)
  write_deltas(deltas)
  const accepted =
    wasm._ingest_projection(sequenceId, footageIndex, footageLength) !== 0
  if (!accepted) return false
  const count = wasm._get_footage_span_buffer_count() >>> 0
  return read_footage_spans(count)
}

export function snapshot_sequence(sequenceId: number): void {
  wasm._snapshot_projection(sequenceId)
}

export function read_snapshot_deltas<T>(): Array<Delta<T>> {
  return read_deltas<T>()
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
