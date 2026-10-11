import module from '../wasm/index.js'
import { Operation, type Opcode } from './protocol.js'
import type { U32List } from '../types/type.js'

class Runtime {
  private nextProjection = 0
  private nextContent = 0
  private readonly content: Array<
    Map<number, ReadonlyArray<unknown>> | undefined
  > = []
  private readonly free: number[] = []
  private readonly finalizer = new FinalizationRegistry<number>((id) =>
    this.release(id)
  )

  create(owner: object, actorID: number, sequence?: unknown): number {
    const id = this.free.pop() ?? this.nextProjection++
    this.content[id] = new Map()
    try {
      this.call(Operation.Create, id, actorID, sequence)
    } catch (error) {
      this.release(id)
      throw error
    }
    this.finalizer.register(owner, id, owner)
    return id
  }
  destroy(owner: object, id: number): void {
    this.finalizer.unregister(owner)
    this.release(id)
  }
  private release(id: number): void {
    if (!this.content[id]) return
    module._runtime_dispatch(Operation.Destroy, id, 0, 0, 0, 0, 0)
    this.content[id] = undefined
    this.free.push(id)
  }
  length(id: number): number {
    if (id < 0) throw new Error('Projection has been destroyed')
    return module._runtime_length(id)
  }
  value<T>(id: number, at: number): T | undefined {
    if (id < 0) throw new Error('Projection has been destroyed')
    const pointer = module._runtime_value(id, at) >>> 2
    if (!pointer) return
    const heap = module.HEAPU32
    return this.content[id]!.get(heap[pointer])?.[heap[pointer + 1]] as
      T | undefined
  }
  private inputSize(operation: Opcode, value: unknown, other: unknown): number {
    if (operation === Operation.Replace) return 1
    if (
      operation !== Operation.Create &&
      operation !== Operation.Apply &&
      operation !== Operation.Merge
    )
      return 0
    const sequence = operation === Operation.Create ? other : value
    const groups =
      operation === Operation.Apply
        ? [Array.isArray(sequence) ? sequence : [null]]
        : Array.isArray(sequence) &&
            sequence.length === 2 &&
            sequence.every(Array.isArray)
          ? sequence
          : [[], []]
    let words = operation === Operation.Apply ? 1 : 3
    for (const group of groups)
      for (const entry of group) {
        const data =
          Array.isArray(entry) && typeof entry[0] !== 'number'
            ? entry[0]
            : entry
        words +=
          4 +
          (Array.isArray(data) || data instanceof Uint32Array ? data.length : 0)
      }
    return words
  }

  call<T>(
    operation: Opcode,
    id: number,
    value?: unknown,
    at?: unknown,
    end?: unknown
  ): T {
    if (id < 0) throw new Error('Projection has been destroyed')
    const count = this.inputSize(operation, value, at)
    const pointer = count ? module._runtime_reserve(count) : 0
    const heap = module.HEAPU32,
      base = pointer >>> 2,
      contents = this.content[id]!
    const bind = (values: unknown): number => {
      if (!Array.isArray(values)) return 0
      const token = ++this.nextContent
      contents.set(token, values)
      return token
    }
    const absent = 0xffffffff
    let a0 = 0,
      a1 = 0,
      a2 = 0
    if (operation === Operation.Insert || operation === Operation.Replace) {
      a0 = (value as unknown[]).length
      a1 = bind(value)
      a2 = (at as number | undefined) ?? absent
      if (operation === Operation.Replace)
        heap[base] = (end as number | undefined) ?? absent
    } else if (
      operation === Operation.Remove ||
      operation === Operation.Values
    ) {
      a0 = (value as number | undefined) ?? absent
      a1 = (at as number | undefined) ?? absent
    } else if (
      operation === Operation.Retire ||
      operation === Operation.Value
    ) {
      a0 = value as number
    } else if (
      operation === Operation.Create ||
      operation === Operation.Apply ||
      operation === Operation.Merge
    ) {
      a0 = operation === Operation.Create ? (value as number) : 0
      const sequence = operation === Operation.Create ? at : value
      const valid =
        (operation === Operation.Create && sequence === undefined) ||
        (Array.isArray(sequence) &&
          sequence.length === 2 &&
          sequence.every(Array.isArray))
      const groups: unknown[][] =
        operation === Operation.Apply
          ? [Array.isArray(sequence) ? sequence : [null]]
          : valid && sequence !== undefined
            ? (sequence as unknown[][])
            : [[], []]
      const entries = groups.reduce((n, group) => n + group.length, 0)
      let descriptor = base + (operation === Operation.Apply ? 1 : 3)
      let data = descriptor + entries * 4
      if (operation === Operation.Apply) heap[base] = entries
      else heap.set([valid ? 1 : 0, groups[0].length, groups[1].length], base)
      for (let group = 0; group < groups.length; ++group)
        for (const entry of groups[group]) {
          const insertion = Array.isArray(entry) && typeof entry[0] !== 'number'
          const numbers = insertion ? entry[0] : entry
          const numeric =
            numbers instanceof Uint32Array ||
            (Array.isArray(numbers) &&
              (operation === Operation.Create ||
                numbers.every(
                  (word: unknown) =>
                    Number.isInteger(word) &&
                    (word as number) >= 0 &&
                    (word as number) <= absent
                )))
          const shape = insertion
            ? entry.length <= 2 &&
              entry.length > 0 &&
              (entry[1] === undefined || Array.isArray(entry[1]))
            : true
          const tag =
            numeric &&
            shape &&
            !(operation !== Operation.Apply && group === 0 && insertion)
              ? insertion
                ? 0
                : 1
              : 2
          const count =
            Array.isArray(numbers) || numbers instanceof Uint32Array
              ? numbers.length
              : 0
          heap.set(
            [tag, data - base, count, insertion ? bind(entry[1]) : 0],
            descriptor
          )
          if (numeric) heap.set(numbers as U32List, data)
          descriptor += 4
          data += count
        }
    }

    const resultPointer = module._runtime_dispatch(
      operation,
      id,
      a0,
      a1,
      a2,
      pointer,
      count
    )
    return this.result(operation, id, resultPointer) as T
  }
  private result(operation: Opcode, id: number, pointer: number): unknown {
    const heap = module.HEAPU32,
      header = pointer >>> 2,
      content = this.content[id]!
    const kind = heap[header],
      p0 = heap[header + 3],
      n0 = heap[header + 4],
      p1 = heap[header + 5],
      n1 = heap[header + 6]
    for (
      let at = heap[header + 1] >>> 2, end = at + heap[header + 2] * 3;
      at < end;
      at += 3
    ) {
      const token = heap[at],
        start = heap[at + 1],
        length = heap[at + 2]
      if (length === 0) content?.delete(token)
      else
        (content?.get(token) as unknown[] | undefined)?.fill(
          undefined,
          start,
          start + length
        )
    }
    const values = (pointer: number, count: number): unknown[] => {
      const begin = pointer >>> 2,
        end = begin + count * 3
      let size = 0
      for (let at = begin; at < end; at += 3) size += heap[at + 2]
      const result = new Array<unknown>(size)
      let target = 0
      for (let at = pointer >>> 2, end = at + count * 3; at < end; at += 3) {
        const source = content?.get(heap[at]),
          start = heap[at + 1],
          length = heap[at + 2]
        for (let j = 0; j < length; ++j) result[target++] = source?.[start + j]
      }
      return result
    }
    const words = (pointer: number, count: number): number[] => {
      const result = new Array<number>(count)
      for (let i = 0, at = pointer >>> 2; i < count; ++i)
        result[i] = heap[at + i]
      return result
    }
    const gossip = (pointer: number, count: number): unknown[] => {
      const entries: unknown[] = []
      for (let at = pointer >>> 2, end = at + count * 4; at < end; at += 4) {
        const coordinates = words(heap[at + 1], heap[at + 2])
        if (heap[at] === 1) entries.push(coordinates)
        else {
          const footage = content?.get(heap[at + 3])
          entries.push(
            footage === undefined ? [coordinates] : [coordinates, footage]
          )
        }
      }
      return entries
    }
    let result: unknown
    switch (kind) {
      case 0:
        break
      case 1:
        result = p0
        break
      case 2:
        result = gossip(p0, n0)
        break
      case 3: {
        const items = values(p0, n0)
        result = operation === Operation.Value ? items[0] : items
        break
      }
      case 4: {
        const changes: unknown[] = []
        for (let at = p0 >>> 2, end = at + n0 * 4; at < end; at += 4) {
          const items = values(heap[at + 2], heap[at + 3])
          changes.push(
            items.length
              ? [heap[at], heap[at + 1], items]
              : [heap[at], heap[at + 1]]
          )
        }
        const receipts = gossip(p1, n1)
        result = receipts.length ? [changes, receipts] : [changes]
        break
      }
      case 5: {
        const frontiers: unknown[] = [],
          insertions: unknown[] = []
        for (let at = p0 >>> 2, end = at + n0 * 2; at < end; at += 2)
          frontiers.push(words(heap[at], heap[at + 1]))
        for (let at = p1 >>> 2, end = at + n1 * 4; at < end; at += 4) {
          const coordinates = words(heap[at], 6),
            footage = heap[at + 3]
              ? content?.get(heap[at + 3])
              : heap[at + 2]
                ? values(heap[at + 1], heap[at + 2])
                : undefined
          insertions.push(
            footage === undefined ? [coordinates] : [coordinates, footage]
          )
        }
        result = [frontiers, insertions]
        break
      }
      case 6:
        if (operation === Operation.Destroy) {
          this.content[id] = undefined
        }
        break
      case 7:
        throw new Error(
          p0 === 1
            ? 'Projection has been destroyed'
            : `Native operation ${operation} failed`
        )
    }

    return result
  }
}
export const runtime = new Runtime()
