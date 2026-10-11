import { Operation, type Opcode } from './protocol.js'
import type { Content } from './encode.js'

/** Resolves numeric spans against the caller's content, preserving its objects. */
export function decode(op: Opcode, heap: Uint32Array, offset: number, content: Content): unknown {
  const word = () => heap[offset++]
  const array = (count: number) => Array.from({ length: count }, word)
  const kind = word(), releases = word()
  for (let n = 0; n < releases; ++n) {
    const id = word(), start = word(), count = word()
    if (!count) content.delete(id)
    else (content.get(id) as unknown[] | undefined)?.fill(undefined, start, start + count)
  }
  const spans = (sparse = false) => {
    const count = word(), values: unknown[] = []
    let missing = true
    for (let n = 0; n < count; ++n) {
      const id = word(), start = word(), length = word(), source = content.get(id)
      if (id) missing = false
      if (!source && sparse) values.length += length
      else for (let i = 0; i < length; ++i) values.push(source?.[start + i])
    }
    return { values, missing }
  }
  const gossip = () => Array.from({ length: word() }, () => {
    if (word() === 1) return array(word())
    const coordinates = array(6), footage = content.get(word())
    return footage ? [coordinates, footage] : [coordinates]
  })
  switch (kind) {
    case 0: return undefined
    case 1: return word()
    case 2: return gossip()
    case 3: { const { values } = spans(); return op === Operation.Value ? values[0] : values }
    case 4: {
      const changes = Array.from({ length: word() }, () => {
        const start = word(), end = word(), { values } = spans(true)
        return values.length ? [start, end, values] : [start, end]
      })
      const replies = gossip()
      return replies.length ? [changes, replies] : [changes]
    }
    case 5: {
      const frontiers = Array.from({ length: word() }, () => array(word()))
      const insertions = Array.from({ length: word() }, () => {
        const coordinates = array(6), { values, missing } = spans()
        return (coordinates[5] | 0) > 0 && !missing ? [coordinates, values] : [coordinates]
      })
      return [frontiers, insertions]
    }
    case 6: return undefined
    default: throw new Error(word() === 1 ? 'Projection has been destroyed' : 'Native operation failed')
  }
}
