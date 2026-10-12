import module from '../wasm/index.js'
import { Operation, type Opcode } from './protocol.js'
import type { U32List } from '../types/type.js'

class Runtime {
  private nextProjection = 0
  private readonly content: Array<
    Array<ReadonlyArray<unknown> | undefined> | undefined
  > = []
  private readonly free: number[] = []
  // 0: mutable caller input; 1: private writable; 2: readonly; 3: packed readonly.
  private readonly mutable: Array<number[] | undefined> = []
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
    const pointer =
      module._runtime_insert(
        id,
        values.length,
        content.push(values) - 1,
        at
      ) >>> 2
    const heap = module.HEAPU32
    const coordinates = [
      heap[pointer],
      heap[pointer + 1],
      heap[pointer + 2],
      heap[pointer + 3],
      heap[pointer + 4],
      heap[pointer + 5],
    ]
    const token = heap[pointer + 6]
    if (token) {
      const mutable = this.mutable[id]!
      let footage = content[token] as unknown[]
      if (mutable[token] !== 1) {
        const base = heap[pointer + 8]
        footage = footage.slice(base, base + heap[pointer + 7])
        content[token] = footage
        mutable[token] = 1
      }
      const end = footage.length
      for (let i = 0; i < values.length; ++i) footage[end + i] = values[i]
      content.pop()
    }
    return [[coordinates, values]]
  }
  apply<T>(id: number, value: unknown): T {
    if (id < 0) throw new Error('Projection has been destroyed')
    const entries: unknown[] = Array.isArray(value) ? value : [null]
    let words = 1 + entries.length * 4
    for (const entry of entries) {
      const data =
        Array.isArray(entry) && typeof entry[0] !== 'number' ? entry[0] : entry
      words +=
        Array.isArray(data) || data instanceof Uint32Array ? data.length : 0
    }

    const pointer = module._runtime_reserve(words)
    const heap = module.HEAPU32,
      base = pointer >>> 2
    const contents = this.content[id]!,
      mutable = this.mutable[id]!
    const firstBinding = contents.length
    const absent = 0xffffffff

    let descriptor = base + 1
    let data = descriptor + entries.length * 4
    heap[base] = entries.length
    for (const entry of entries) {
      const insertion = Array.isArray(entry) && typeof entry[0] !== 'number'
      const numbers = insertion ? entry[0] : entry
      let numeric = numbers instanceof Uint32Array
      if (Array.isArray(numbers)) {
        numeric = true
        for (let i = 0; i < numbers.length; ++i) {
          const word = numbers[i]
          if (
            (!Number.isInteger(word) || word < 0 || word > absent) &&
            i in numbers
          ) {
            numeric = false
            break
          }
        }
      }
      const shape = insertion
        ? entry.length <= 2 &&
          entry.length > 0 &&
          (entry[1] === undefined || Array.isArray(entry[1]))
        : true
      const tag = numeric && shape ? (insertion ? 0 : 1) : 2
      const count =
        Array.isArray(numbers) || numbers instanceof Uint32Array
          ? numbers.length
          : 0
      heap[descriptor] = tag
      heap[descriptor + 1] = data - base
      heap[descriptor + 2] = count
      // Masks never own content. Rejected coordinates need no JS binding.
      heap[descriptor + 3] =
        insertion &&
        tag === 0 &&
        count === 6 &&
        numbers[5] > 0 &&
        numbers[5] < 0x80000000
          ? contents.push(entry[1]) - 1
          : 0
      if (heap[descriptor + 3]) mutable[heap[descriptor + 3]] = 2
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
    const resultPointer = module._runtime_dispatch(
      Operation.Apply,
      id,
      0,
      0,
      0,
      pointer,
      words
    )
    if (module.HEAPU32[resultPointer >>> 2] === 0) {
      // Entries after a rejected input were never consumed by WASM.
      const consumed = module.HEAPU32[(resultPointer >>> 2) + 11]
      contents.length = Math.max(firstBinding, consumed + 1)
      mutable.length = Math.min(mutable.length, contents.length)
    }
    return this.result(Operation.Apply, id, resultPointer) as T
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
    return 0
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
    const absent = 0xffffffff
    let a0 = 0,
      a1 = 0,
      a2 = 0
    let footage: ReadonlyArray<unknown> | undefined
    if (operation === Operation.Replace) {
      a0 = (value as unknown[]).length
      a1 = contents.push(value as unknown[]) - 1
      a2 = (at as number | undefined) ?? absent
      heap[base] = (end as number | undefined) ?? absent
    } else if (
      operation === Operation.Remove ||
      operation === Operation.Values
    ) {
      a0 = (value as number | undefined) ?? absent
      a1 = (at as number | undefined) ?? absent
    } else if (operation === Operation.Retire) {
      a0 = value as number
    } else if (
      operation === Operation.Create ||
      operation === Operation.Merge
    ) {
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
            sequence[0].every(
              (word: number) =>
                Number.isInteger(word) && word >= 0 && word <= absent
            )))
      a2 = valid ? 1 : 0
      if (valid && sequence !== undefined) {
        const words = sequence[0] as U32List
        heap.set(words, base)
        a1 = contents.length
        footage = sequence[1]
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
    if (footage !== undefined) {
      const bindings = module.HEAPU32[(resultPointer >>> 2) + 11]
      contents.length += bindings
      contents.fill(footage, a1)
      this.mutable[id]!.length = contents.length
      this.mutable[id]!.fill(2, a1)
    }
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
    if (kind === 3 && n0 === 1) {
      const at = p0 >>> 2,
        source = content[heap[at]],
        start = heap[at + 1],
        size = heap[at + 2]
      if (source && start + size <= source.length)
        return source.slice(start, start + size)
    }
    if (
      kind === 6 &&
      heap[header + 2] === 0 &&
      heap[header + 8] === 0 &&
      heap[header + 10] === 0
    )
      return
    if (
      kind === 4 &&
      n0 === 0 &&
      n1 === 0 &&
      heap[header + 8] === 0 &&
      heap[header + 10] === 0
    ) {
      let at = heap[header + 1] >>> 2
      const end = at + heap[header + 2] * 3
      // Empty results discard whole input bindings; no spans are consumed.
      for (; at < end; at += 3) {
        const token = heap[at]
        content[token] = undefined
        mutable[token] = 0
      }
      while (
        content.length > 1 &&
        content[content.length - 1] === undefined &&
        mutable[content.length - 1] === 0
      )
        content.pop()
      mutable.length = Math.min(mutable.length, content.length)
      return [[]]
    }
    for (
      let at = heap[header + 9] >>> 2, end = at + heap[header + 10] * 3;
      at < end;
      at += 3
    ) {
      const token = heap[at],
        start = heap[at + 1],
        count = heap[at + 2]
      content[token] = content[token]?.slice(start, start + count)
      mutable[token] = 1
    }
    const values = (pointer: number, count: number): unknown[] => {
      const begin = pointer >>> 2,
        end = begin + count * 3
      if (count === 1) {
        const source = content[heap[begin]],
          start = heap[begin + 1],
          size = heap[begin + 2]
        if (source && start + size <= source.length)
          return source.slice(start, start + size)
      }
      if (operation === Operation.Sequence && count > 1) {
        const parts: unknown[][] = []
        for (let at = begin; at < end;) {
          const source = content[heap[at]],
            start = heap[at + 1]
          let size = heap[at + 2]
          at += 3
          while (
            at < end &&
            content[heap[at]] === source &&
            heap[at + 1] === start + size
          ) {
            size += heap[at + 2]
            at += 3
          }
          if (source && start + size <= source.length)
            parts.push(
              start === 0 && size === source.length
                ? (source as unknown[])
                : source.slice(start, start + size)
            )
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
      if (size === count) {
        for (let at = begin, target = 0; at < end; at += 3)
          result[target++] = content[heap[at]]?.[heap[at + 1]]
        return result
      }
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
        result = items
        break
      }
      case 4: {
        const changes: unknown[] = []
        for (let at = p0 >>> 2, end = at + n0 * 4; at < end; at += 4) {
          const span = heap[at + 2] >>> 2
          const items =
            heap[at + 3] === 1 &&
            heap[span + 1] === 0 &&
            (content[heap[span]] === undefined ||
              content[heap[span]]?.length === heap[span + 2])
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
        // A literal allocation site keeps compact words in integer elements
        // independently of full uint32 Gossip's double-element feedback.
        let metadata: number[]
        if (n0 > 0 && heap[p0 >>> 2] === 0) {
          metadata = [0]
          metadata.length = n0
          for (let i = 0, at = p0 >>> 2; i < n0; ++i) metadata[i] = heap[at + i]
        } else metadata = words(p0, n0)
        const span = p1 >>> 2,
          token = heap[span]
        const shared =
          n1 === 1 &&
          heap[span + 1] === 0 &&
          content[token]?.length === heap[span + 2] &&
          !!mutable[token]
        if (shared && mutable[token] !== 3) {
          content[token] = content[token]!.map((value) => value)
          mutable[token] = 3
        }
        result = [metadata, shared ? content[token] : values(p1, n1)]
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
        offset = heap[at + 4],
        base = heap[at + 5]
      if (content[target] === undefined && source === undefined) continue
      let footage = content[target] as unknown[] | undefined
      if (mutable[target] !== 1 || footage === undefined) {
        footage =
          footage?.slice(base, base + offset) ?? new Array<unknown>(offset)
        content[target] = footage
        mutable[target] = 1
      }
      if (footage!.length < offset) footage!.length = offset
      if (source && start === 0 && count === source.length && count <= 4096)
        footage!.push.apply(footage, source as unknown[])
      else for (let i = 0; i < count; ++i) footage!.push(source?.[start + i])
    }
    let trim = false
    for (
      let at = heap[header + 1] >>> 2, end = at + heap[header + 2] * 3;
      at < end;
      at += 3
    ) {
      const token = heap[at],
        start = heap[at + 1],
        count = heap[at + 2]
      if (count === 0) {
        trim = true
        if (token === content.length - 1) {
          content.pop()
          mutable.length = Math.min(mutable.length, content.length)
        } else {
          content[token] = undefined
          mutable[token] = 0
        }
      } else if (mutable[token] === 1)
        (content[token] as unknown[] | undefined)?.fill(
          undefined,
          start,
          start + count
        )
    }
    if (trim) {
      while (
        content.length > 1 &&
        content[content.length - 1] === undefined &&
        mutable[content.length - 1] === 0
      )
        content.pop()
      mutable.length = Math.min(mutable.length, content.length)
    }
    return result
  }
}
export const runtime = new Runtime()
