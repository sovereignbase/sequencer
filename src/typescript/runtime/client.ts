import { workerSource } from './source.js'
import { Operation, Ready, Reserve, Failure, slots, wordsPerSlot, type Opcode, type Request, type Response } from './protocol.js'
import type { U32List } from '../types/type.js'

type Call = {
  operation: Opcode; id: number; args: readonly unknown[];
  resolve: (value: any) => void; reject: (error: unknown) => void; words: number;
}

/** One worker owns the native heap. Generic content stays on the calling thread. */
class Runtime {
  private worker?: Worker
  private heap?: Uint32Array
  private arena = 0
  private failure?: Error
  private nextProjection = 0
  private nextContent = 0
  private readonly content = new Map<number, Map<number, ReadonlyArray<unknown>>>()
  private readonly creationErrors = new Map<number, unknown>()
  private readonly free = Array.from({ length: slots }, (_, i) => slots - i - 1)
  private readonly calls: Array<Call | undefined> = []
  private readonly queue: Call[] = []
  private queueHead = 0
  private reservation?: number
  private readonly finalizer = new FinalizationRegistry<number>((id) => {
    if (this.worker && !this.failure) void this.call(Operation.Destroy, id).catch(() => {})
  })

  create(owner: object, actorID: number, sequence?: unknown): number {
    const id = this.nextProjection++
    this.content.set(id, new Map())
    void this.call(Operation.Create, id, actorID, sequence).catch(error => { this.creationErrors.set(id, error) })
    this.finalizer.register(owner, id, owner)
    return id
  }

  destroy(owner: object, id: number): Promise<void> {
    this.finalizer.unregister(owner)
    return this.call(Operation.Destroy, id)
  }

  call<T>(operation: Opcode, id: number, ...args: readonly unknown[]): Promise<T> {
    if (this.failure) return Promise.reject(this.failure)
    const { promise, resolve, reject } = Promise.withResolvers<T>()
    this.queue.push({ operation, id, args, resolve, reject, words: 0 })
    try { this.worker ??= this.start(); this.flush() }
    catch (error) { this.fail(error instanceof Error ? error : new Error(String(error))) }
    return promise
  }

  private start(): Worker {
    const url = URL.createObjectURL(new Blob([workerSource], { type: 'text/javascript' }))
    try {
      const worker = new Worker(url, { name: 'sequencer' })
      worker.onmessage = event => this.complete(event.data)
      worker.onerror = event => this.fail(new Error(event.message || 'Sequencer worker failed'))
      worker.onmessageerror = () => this.fail(new Error('Sequencer worker response could not be received'))
      return worker
    } finally { URL.revokeObjectURL(url) }
  }

  private flush(): void {
    if (!this.heap || this.reservation !== undefined) return
    while (this.free.length && this.queueHead < this.queue.length) {
      const call = this.queue[this.queueHead++]
      const error = this.creationErrors.get(call.id)
      if (error && call.operation !== Operation.Destroy) { call.reject(error); continue }
      const slot = this.free.pop()!
      this.calls[slot] = call
      call.words = this.inputSize(call)
      if (call.words > wordsPerSlot) {
        this.reservation = slot
        this.worker!.postMessage([Reserve, slot, call.words])
        break
      }
      this.send(slot, this.arena + slot * wordsPerSlot * 4)
    }
    if (this.queueHead === this.queue.length) { this.queue.length = 0; this.queueHead = 0 }
  }

  private inputSize({ operation, args }: Call): number {
    if (operation === Operation.Replace) return 1
    if (operation !== Operation.Create && operation !== Operation.Apply && operation !== Operation.Merge) return 0
    const sequence = operation === Operation.Create ? args[1] : args[0]
    const groups = operation === Operation.Apply ? [Array.isArray(sequence) ? sequence : [null]] :
      Array.isArray(sequence) && sequence.length === 2 && sequence.every(Array.isArray) ? sequence : [[], []]
    let words = operation === Operation.Apply ? 1 : 3
    for (const group of groups) for (const entry of group) {
      const data = Array.isArray(entry) && typeof entry[0] !== 'number' ? entry[0] : entry
      words += 4 + (Array.isArray(data) || data instanceof Uint32Array ? data.length : 0)
    }
    return words
  }

  private send(slot: number, pointer: number): void {
    const { operation, id, args, words } = this.calls[slot]!
    const heap = this.heap!, base = pointer >>> 2, contents = this.content.get(id)
    const bind = (values: unknown): number => {
      if (!Array.isArray(values)) return 0
      const token = ++this.nextContent
      contents?.set(token, values)
      return token
    }
    const absent = 0xffffffff
    let a0 = 0, a1 = 0, a2 = 0
    if (operation === Operation.Insert || operation === Operation.Replace) {
      a0 = (args[0] as unknown[]).length; a1 = bind(args[0]); a2 = (args[1] as number | undefined) ?? absent
      if (operation === Operation.Replace) heap[base] = (args[2] as number | undefined) ?? absent
    } else if (operation === Operation.Remove || operation === Operation.Values) {
      a0 = (args[0] as number | undefined) ?? absent; a1 = (args[1] as number | undefined) ?? absent
    } else if (operation === Operation.Retire || operation === Operation.Value) {
      a0 = args[0] as number
    } else if (operation === Operation.Create || operation === Operation.Apply || operation === Operation.Merge) {
      a0 = operation === Operation.Create ? args[0] as number : 0
      const sequence = operation === Operation.Create ? args[1] : args[0]
      const valid = operation === Operation.Create && sequence === undefined ||
        Array.isArray(sequence) && sequence.length === 2 && sequence.every(Array.isArray)
      const groups: unknown[][] = operation === Operation.Apply ? [Array.isArray(sequence) ? sequence : [null]] :
        valid && sequence !== undefined ? sequence as unknown[][] : [[], []]
      const entries = groups.reduce((n, group) => n + group.length, 0)
      let descriptor = base + (operation === Operation.Apply ? 1 : 3)
      let data = descriptor + entries * 4
      if (operation === Operation.Apply) heap[base] = entries
      else heap.set([valid ? 1 : 0, groups[0].length, groups[1].length], base)
      for (let group = 0; group < groups.length; ++group) for (const entry of groups[group]) {
        const insertion = Array.isArray(entry) && typeof entry[0] !== 'number'
        const numbers = insertion ? entry[0] : entry
        const numeric = numbers instanceof Uint32Array || Array.isArray(numbers) &&
          numbers.every((word: unknown) => Number.isInteger(word) && (word as number) >= 0 && (word as number) <= absent)
        const shape = insertion ? entry.length <= 2 && entry.length > 0 &&
          (entry[1] === undefined || Array.isArray(entry[1])) : true
        const tag = numeric && shape && !(operation !== Operation.Apply && group === 0 && insertion) ? insertion ? 0 : 1 : 2
        const count = Array.isArray(numbers) || numbers instanceof Uint32Array ? numbers.length : 0
        heap.set([tag, data - base, count, insertion ? bind(entry[1]) : 0], descriptor)
        if (numeric) heap.set(numbers as U32List, data)
        descriptor += 4; data += count
      }
    }
    const request: Request = [slot, operation, id, a0, a1, a2, pointer, words]
    this.worker!.postMessage(request)
  }

  private complete(message: Response): void {
    const [slot, pointer, count, memory] = message
    if (slot === Failure) { this.fail(pointer as unknown as Error); return }
    if (slot === Ready) {
      this.arena = pointer; this.heap = new Uint32Array(count as unknown as SharedArrayBuffer)
      this.flush(); return
    }
    if (memory) this.heap = new Uint32Array(memory)
    if (slot === Reserve) {
      this.send(pointer, count); this.reservation = undefined; this.flush(); return
    }
    const call = this.calls[slot]!
    try {
      const view = this.heap!.subarray(pointer >>> 2, (pointer >>> 2) + count)
      let at = 0
      const kind = view[at++], releases = view[at++], content = this.content.get(call.id)
      for (let n = 0; n < releases; ++n) {
        const token = view[at++], start = view[at++], length = view[at++]
        if (length === 0) content?.delete(token)
        else (content?.get(token) as unknown[] | undefined)?.fill(undefined, start, start + length)
      }
      const values = (): unknown[] => {
        const result: unknown[] = [], n = view[at++]
        for (let i = 0; i < n; ++i) {
          const token = view[at++], start = view[at++], length = view[at++], source = content?.get(token)
          const end = result.length + length
          for (let j = start; result.length < end; ++j) result.push(source?.[j])
        }
        return result
      }
      const coordinates = (): number[] => { const result = Array.from(view.subarray(at, at + 6)); at += 6; return result }
      const acknowledgement = (): number[] => {
        const length = view[at++], result = Array.from(view.subarray(at, at + length)); at += length; return result
      }
      const gossip = (): unknown[] => {
        const entries: unknown[] = [], n = view[at++]
        for (let i = 0; i < n; ++i) {
          if (view[at++] === 1) entries.push(acknowledgement())
          else {
            const words = coordinates(), token = view[at++], footage = content?.get(token)
            entries.push(footage === undefined ? [words] : [words, footage])
          }
        }
        return entries
      }
      let result: unknown
      switch (kind) {
        case 0: break
        case 1: result = view[at]; break
        case 2: result = gossip(); break
        case 3: { const items = values(); result = call.operation === Operation.Value ? items[0] : items; break }
        case 4: {
          const changes: unknown[] = [], n = view[at++]
          for (let i = 0; i < n; ++i) {
            const start = view[at++], end = view[at++], items = values()
            changes.push(items.length ? [start, end, items] : [start, end])
          }
          const receipts = gossip(); result = receipts.length ? [changes, receipts] : [changes]; break
        }
        case 5: {
          const frontiers: unknown[] = [], insertions: unknown[] = [], n = view[at++]
          for (let i = 0; i < n; ++i) frontiers.push(acknowledgement())
          const m = view[at++]
          for (let i = 0; i < m; ++i) {
            const words = coordinates(), footage = values()
            insertions.push(footage.length ? [words, footage] : [words])
          }
          result = [frontiers, insertions]; break
        }
        case 6: if (call.operation === Operation.Destroy) { this.content.delete(call.id); this.creationErrors.delete(call.id) } break
        case 7: throw new Error(view[at] === 1 ? 'Projection has been destroyed' : 'Native operation failed')
      }
      call.resolve(result)
    } catch (error) {
      if (call.operation === Operation.Create) this.creationErrors.set(call.id, error)
      call.reject(error)
    }
    this.calls[slot] = undefined; this.free.push(slot); this.flush()
  }

  private fail(error: Error): void {
    this.failure = error; this.worker?.terminate()
    for (const call of this.calls) call?.reject(error)
    for (let i = this.queueHead; i < this.queue.length; ++i) this.queue[i].reject(error)
    this.calls.length = this.queue.length = 0; this.content.clear()
  }
}
export const runtime = new Runtime()
