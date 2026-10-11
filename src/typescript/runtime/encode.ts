import { Operation, type Opcode } from './protocol.js'
import type { U32List } from '../types/type.js'

export type Content = Map<number, ReadonlyArray<unknown>>
export type Arguments = readonly [unknown?, unknown?, unknown?]
let nextContent = 1
const isList = (value: unknown): value is U32List => Array.isArray(value) || value instanceof Uint32Array

/** Counts framing words without touching application content. */
function gossipSize(value: unknown): number {
  if (!Array.isArray(value)) return 2
  let size = 1
  for (const entry of value) {
    if (Array.isArray(entry) && isList(entry[0])) size += 8
    else if (isList(entry)) size += 2 + entry.length
    else ++size
  }
  return size
}
function sequenceSize(value: unknown): number {
  if (!Array.isArray(value) || value.length !== 2) return 3
  return gossipSize(value[0]) + gossipSize(value[1])
}
export function inputSize(op: Opcode, args: Arguments): number {
  if (op === Operation.Create) return args[1] === undefined ? 2 : sequenceSize(args[1])
  if (op === Operation.Apply) return gossipSize(args[0])
  if (op === Operation.Merge) return sequenceSize(args[0])
  return op === Operation.Replace ? 1 : 0
}

/** Writes numeric metadata directly into a leased region of WASM memory. */
export function encode(op: Opcode, args: Arguments, heap: Uint32Array, offset: number, content: Content): [number, number, number, number] {
  const begin = offset
  const word = (value: number) => { heap[offset++] = value }
  const bind = (values: ReadonlyArray<unknown> | undefined) => {
    if (!values) return 0
    const id = nextContent++
    content.set(id, values)
    return id
  }
  const acknowledgement = (entry: unknown) => {
    if (!isList(entry)) { word(0); return }
    const valid = entry.every(Number.isSafeInteger)
    word(valid ? entry.length : 0)
    if (valid) for (const value of entry) word(value)
  }
  const gossip = (value: unknown) => {
    if (!Array.isArray(value)) { word(1); word(2); return }
    word(value.length)
    for (const entry of value) {
      if (Array.isArray(entry) && isList(entry[0])) {
        const coordinates = entry[0]
        if ((entry.length !== 1 && entry.length !== 2) || coordinates.length !== 6 ||
            !coordinates.every(Number.isSafeInteger) || (entry[1] !== undefined && !Array.isArray(entry[1]))) {
          word(2); continue
        }
        word(0)
        for (let i = 0; i < 6; ++i) word(coordinates[i])
        word(bind(entry[1]))
      } else if (isList(entry)) { word(1); acknowledgement(entry) }
      else word(2)
    }
  }
  const sequence = (value: unknown) => {
    if (!Array.isArray(value) || value.length !== 2 || !Array.isArray(value[0]) || !Array.isArray(value[1])) {
      word(0); word(1); word(2); return
    }
    word(value[0].length)
    for (const a of value[0]) acknowledgement(a)
    gossip(value[1])
  }
  let a = 0, b = 0, c = 0
  switch (op) {
    case Operation.Create: a = args[0] as number; args[1] === undefined ? (word(0), word(0)) : sequence(args[1]); break
    case Operation.Apply: gossip(args[0]); break
    case Operation.Merge: sequence(args[0]); break
    case Operation.Insert: { const values = args[0] as unknown[]; a = values.length; b = bind(values); c = args[1] as number; break }
    case Operation.Replace: { const values = args[0] as unknown[]; a = values.length; b = bind(values); c = (args[1] ?? -1) as number; word((args[2] ?? -1) as number); break }
    case Operation.Remove:
    case Operation.Values: a = (args[0] ?? -1) as number; b = (args[1] ?? -1) as number; break
    case Operation.Value:
    case Operation.Retire: a = args[0] as number
  }
  return [a, b, c, offset - begin]
}
