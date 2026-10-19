import type {
  Acknowledgement,
  Insertion,
  Sequence,
} from '../../src/typescript/types/type.ts'
import { sequenceMetadata } from '../../benchmark/.shared/sequence.ts'

/**
 * Authors plain snapshot fixtures without invoking runtime export.
 * @param frontiers Actor claims, including membership-only Acknowledgements.
 * @param insertions Dependency-compatible canonical coordinates and optional Footage.
 * @returns Flat metadata and positive Frame spans; signed diffs use uint32 bit patterns.
 */
export function makeSequence<T>(
  frontiers: ReadonlyArray<Acknowledgement>,
  insertions: ReadonlyArray<Insertion<T>>
): Sequence<T> {
  const words = [0],
    footage: Array<T | undefined> = []
  for (const frontier of frontiers) words.push(frontier.length, ...frontier)
  words[0] = words.length
  for (const [coordinates, values] of insertions) {
    words.push(...coordinates)
    for (let i = 0; i < (coordinates[5] | 0); ++i) footage.push(values?.[i])
  }
  return [words, footage]
}

/** Expands plain or compact export records for assertions; runtime fragments are not serialized roots. */
export function sequenceInsertions<T>([
  words,
  footage,
]: Sequence<T>): Insertion<T>[] {
  const result: Insertion<T>[] = []
  let offset = 0
  const metadata = sequenceMetadata(words)
  for (const [index, coordinates] of metadata.insertions.entries()) {
    const count = metadata.ranges[index].reduce(
      (sum, [, length]) => sum + length,
      0
    )
    result.push(
      (coordinates[5] | 0) > 0
        ? [coordinates, footage.slice(offset, offset + count)]
        : [coordinates]
    )
    if (count > 0) offset += count
  }
  return result
}

/** Reads retained Actor claims independently of plain or compact record layout. */
export function sequenceFrontiers([
  words,
]: Sequence<unknown>): Acknowledgement[] {
  return sequenceMetadata(words).frontiers
}
