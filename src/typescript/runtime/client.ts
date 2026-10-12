import module from '../wasm/index.js'
import { Operation, type Opcode } from './protocol.js'
import type { U32List } from '../types/type.js'

class Runtime {
  private nextProjection = 0
  private readonly content: Array<
    Array<ReadonlyArray<unknown> | undefined> | undefined
  > = []
  private readonly free: number[] = []
  private readonly mutable: Array<boolean[] | undefined> = []
  private readonly finalizer = new FinalizationRegistry<number>((id) =>
    this.release(id)
  )

  create(owner: object, actorID: number, sequence?: unknown): number {
    if (this.nextProjection === 0)
      module._runtime_seed(crypto.getRandomValues(new Uint32Array(1))[0])
    const id = this.free.pop() ?? this.nextProjection++
    this.content[id] = [undefined]
    this.mutable[id] = []
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
    this.mutable[id] = undefined
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
    return this.content[id]![heap[pointer]]?.[heap[pointer + 1]] as
      T | undefined
  }
  insert<T>(id: number, values: T[], at: number): unknown {
    if (id < 0) throw new Error('Projection has been destroyed')
    const content = this.content[id]!
    const pointer = module._runtime_insert(id, values.length, content.push(values) - 1, at) >>> 2
    const heap = module.HEAPU32
    const coordinates = [heap[pointer], heap[pointer + 1], heap[pointer + 2],
      heap[pointer + 3], heap[pointer + 4], heap[pointer + 5]]
    const token = heap[pointer + 6]
    if (token) {
      const mutable = this.mutable[id]!
      let footage = content[token] as unknown[]
      if (!mutable[token]) {
        const base = heap[pointer + 8]
        footage = footage.slice(base, base + heap[pointer + 7])
        content[token] = footage
        mutable[token] = true
      }
      const end = footage.length
      for (let i = 0; i < values.length; ++i) footage[end + i] = values[i]
      content.pop()
    }
    return [[coordinates, values]]
  }
  private inputSize(operation: Opcode, value: unknown, other: unknown): number {
    if (operation === Operation.Replace) return 1
    if (operation === Operation.Create || operation === Operation.Merge) {
      const sequence = operation === Operation.Create ? other : value
      return Array.isArray(sequence) &&
        (Array.isArray(sequence[0]) || sequence[0] instanceof Uint32Array)
        ? sequence[0].length
        : 0
    }
    if (operation !== Operation.Apply) return 0
    const groups = [Array.isArray(value) ? value : [null]]
    let words = 1
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
      return contents.push(Array.isArray(values) ? values : undefined) - 1
    }
    const absent = 0xffffffff
    let a0 = 0,
      a1 = 0,
      a2 = 0
    if (operation === Operation.Insert || operation === Operation.Replace) {
      a0 = (value as unknown[]).length
      a1 = contents.push(value as unknown[]) - 1
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
    } else if (operation === Operation.Create || operation === Operation.Merge) {
      a0 = operation === Operation.Create ? (value as number) : 0
      const sequence = operation === Operation.Create ? at : value
      const valid =
        (operation === Operation.Create && sequence === undefined) ||
        (Array.isArray(sequence) &&
          sequence.length === 2 &&
          (Array.isArray(sequence[0]) || sequence[0] instanceof Uint32Array) &&
          Array.isArray(sequence[1]) &&
          (operation === Operation.Create ||
            sequence[0] instanceof Uint32Array ||
            sequence[0].every((word: number) =>
              Number.isInteger(word) && word >= 0 && word <= absent)))
      a2 = valid ? 1 : 0
      if (valid && sequence !== undefined) {
        const words = sequence[0] as U32List
        heap.set(words, base)
        const start = words[0] ?? 0
        if (start >= 1 && start <= words.length && (words.length - start) % 6 === 0) {
          a1 = contents.length
          contents.length += (words.length - start) / 6
          contents.fill(sequence[1], a1)
        }
      }
    } else if (operation === Operation.Apply) {
      const groups: unknown[][] = [Array.isArray(value) ? value : [null]]
      const entries = groups[0].length
      let descriptor = base + 1
      let data = descriptor + entries * 4
      heap[base] = entries
      for (let group = 0; group < groups.length; ++group)
        for (const entry of groups[group]) {
          const insertion = Array.isArray(entry) && typeof entry[0] !== 'number'
          const numbers = insertion ? entry[0] : entry
          const numeric =
            numbers instanceof Uint32Array ||
            (Array.isArray(numbers) &&
              numbers.every(
                  (word: unknown) =>
                    Number.isInteger(word) &&
                    (word as number) >= 0 &&
                    (word as number) <= absent
                ))
          const shape = insertion
            ? entry.length <= 2 &&
              entry.length > 0 &&
              (entry[1] === undefined || Array.isArray(entry[1]))
            : true
          const tag =
            numeric &&
            shape
              ? insertion
                ? 0
                : 1
              : 2
          const count =
            Array.isArray(numbers) || numbers instanceof Uint32Array
              ? numbers.length
              : 0
          heap[descriptor] = tag
          heap[descriptor + 1] = data - base
          heap[descriptor + 2] = count
          heap[descriptor + 3] = insertion ? bind(entry[1]) : 0
          if (numeric) {
            if (insertion && count === 6) {
              heap[data] = numbers[0]
              heap[data + 1] = numbers[1]
              heap[data + 2] = numbers[2]
              heap[data + 3] = numbers[3]
              heap[data + 4] = numbers[4]
              heap[data + 5] = numbers[5]
            } else heap.set(numbers as U32List, data)
          }
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
    const mutable = this.mutable[id]!
    for (let at = heap[header + 9] >>> 2, end = at + heap[header + 10] * 3; at < end; at += 3) {
      const token = heap[at], start = heap[at + 1], count = heap[at + 2]
      content[token] = content[token]?.slice(start, start + count)
      mutable[token] = true
    }
    const values = (pointer: number, count: number): unknown[] => {
      const begin = pointer >>> 2,
        end = begin + count * 3
      if (count === 1) {
        const source = content[heap[begin]], start = heap[begin + 1], size = heap[begin + 2]
        if (source && start + size <= source.length) return source.slice(start, start + size)
      }
      if (operation === Operation.Sequence && count > 1) {
        const parts: unknown[][] = []
        for (let at = begin; at < end;) {
          const source = content[heap[at]], start = heap[at + 1]
          let size = heap[at + 2]
          at += 3
          while (at < end && content[heap[at]] === source && heap[at + 1] === start + size) {
            size += heap[at + 2]
            at += 3
          }
          if (source && start + size <= source.length)
            parts.push(start === 0 && size === source.length ? source as unknown[] : source.slice(start, start + size))
          else {
            const items: unknown[] = []
            for (let i = 0; i < size; ++i) items.push(source?.[start + i])
            parts.push(items)
          }
        }
        let result: unknown[] = []
        for (let at = 0; at < parts.length; at += 4096)
          result = result.concat.apply(result, parts.slice(at, at + 4096))
        return result
      }
      let size = 0
      for (let at = begin; at < end; at += 3) size += heap[at + 2]
      const result = new Array<unknown>(size)
      let target = 0
      for (let at = pointer >>> 2, end = at + count * 3; at < end; at += 3) {
        const source = content[heap[at]],
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
          const footage = content[heap[at + 3]]
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
          const span = heap[at + 2] >>> 2
          const items =
            heap[at + 3] === 1 && heap[span + 1] === 0 &&
            (content[heap[span]] === undefined || content[heap[span]]?.length === heap[span + 2])
              ? (content[heap[span]] ?? new Array<unknown>(heap[span + 2]))
              : values(heap[at + 2], heap[at + 3])
          changes.push(
            heap[at + 3]
              ? [heap[at], heap[at + 1], items]
              : [heap[at], heap[at + 1]]
          )
        }
        const receipts = gossip(p1, n1)
        result = receipts.length ? [changes, receipts] : [changes]
        break
      }
      case 5: {
        const span = p1 >>> 2, token = heap[span]
        const shared = n1 === 1 && heap[span + 1] === 0 &&
          content[token]?.length === heap[span + 2]
        if (shared) mutable[token] = false
        result = [words(p0, n0), shared ? content[token] : values(p1, n1)]
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

    for (
      let at = heap[header + 7] >>> 2, end = at + heap[header + 8] * 6;
      at < end;
      at += 6
    ) {
      const target = heap[at],
        source = content[heap[at + 1]],
        start = heap[at + 2],
        count = heap[at + 3],
        offset = heap[at + 4], base = heap[at + 5]
      if (content[target] === undefined && source === undefined) continue
      let footage = content[target] as unknown[] | undefined
      if (!mutable[target]) {
        footage = footage?.slice(base, base + offset) ?? new Array<unknown>(offset)
        content[target] = footage
        mutable[target] = true
      }
      if (source && start === 0 && count === source.length && count <= 4096)
        footage!.push.apply(footage, source as unknown[])
      else
        for (let i = 0; i < count; ++i) footage!.push(source?.[start + i])
    }
    for (
      let at = heap[header + 1] >>> 2, end = at + heap[header + 2] * 3;
      at < end;
      at += 3
    ) {
      const token = heap[at],
        start = heap[at + 1],
        count = heap[at + 2]
      if (count === 0) {
        if (token === content.length - 1) {
          content.pop()
          mutable.length = Math.min(mutable.length, content.length)
        } else {
          content[token] = undefined
          mutable[token] = false
        }
      } else if (mutable[token])
        (content[token] as unknown[] | undefined)?.fill(
          undefined,
          start,
          start + count
        )
    }
    return result
  }
}
export const runtime = new Runtime()
