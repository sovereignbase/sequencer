import type {
  Acknowledgement,
  Insertion,
  Sequence,
} from '../../src/typescript/types/type.ts'

/** Author fixture metadata directly in the public snapshot layout. */
export function makeSequence<T>(
  frontiers: ReadonlyArray<Acknowledgement>,
  insertions: ReadonlyArray<Insertion<T>>
): Sequence<T> {
  const words = [0], footage: Array<T | undefined> = []
  for (const frontier of frontiers) words.push(frontier.length, ...frontier)
  words[0] = words.length
  for (const [coordinates, values] of insertions) {
    words.push(...coordinates)
    for (let i = 0; i < (coordinates[5] | 0); ++i) footage.push(values?.[i])
  }
  return [words, footage]
}

/** Inspect insertion identities and their corresponding spans in assertions. */
export function sequenceInsertions<T>([words, footage]: Sequence<T>): Insertion<T>[] {
  const result: Insertion<T>[] = []
  let offset = 0
  for (let at = words[0] ?? 0; at < words.length; at += 6) {
    const coordinates = Array.from(words.slice(at, at + 6))
    const count = coordinates[5] | 0
    result.push(count > 0 ? [coordinates, footage.slice(offset, offset + count)] : [coordinates])
    if (count > 0) offset += count
  }
  return result
}

export function sequenceFrontiers([words]: Sequence<unknown>): Acknowledgement[] {
  const frontiers: Acknowledgement[] = []
  for (let at = 1; at < (words[0] ?? 0); ) {
    const count = words[at++]
    frontiers.push(words.slice(at, at + count))
    at += count
  }
  return frontiers
}
