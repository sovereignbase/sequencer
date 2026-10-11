import { workerSource } from './source.js'
import {
  Operation,
  Ready,
  Failure,
  slots,
  type Opcode,
  type Response,
} from './protocol.js'
import type { U32List } from '../types/type.js'

type Call = {
  operation: Opcode
  id: number
  args: readonly unknown[]
  resolve: (value: any) => void
  reject: (error: unknown) => void
}
type Endpoint = {
  postMessage(message: unknown, transfer: ArrayBuffer[]): void
  terminate(): unknown
  ref?(): void
  unref?(): void
}

/** One worker owns the native heap. Generic content stays on the calling thread. */
class Runtime {
  private worker?: Endpoint
  private starting = false
  private ready = false
  private failure?: Error
  private nextProjection = 0
  private nextContent = 0
  private readonly content = new Map<
    number,
    Map<number, ReadonlyArray<unknown>>
  >()
  private readonly creationErrors = new Map<number, unknown>()
  private readonly free = Array.from({ length: slots }, (_, i) => slots - i - 1)
  private readonly calls: Array<Call | undefined> = []
  private readonly queue: Call[] = []
  private queueHead = 0
  private readonly buffers: ArrayBuffer[] = []
  private readonly finalizer = new FinalizationRegistry<number>((id) => {
    if (this.worker && !this.failure)
      void this.call(Operation.Destroy, id).catch(() => {})
  })

  create(owner: object, actorID: number, sequence?: unknown): number {
    const id = this.nextProjection++
    this.content.set(id, new Map())
    void this.call(Operation.Create, id, actorID, sequence).catch((error) => {
      this.creationErrors.set(id, error)
    })
    this.finalizer.register(owner, id, owner)
    return id
  }

  destroy(owner: object, id: number): Promise<void> {
    this.finalizer.unregister(owner)
    return this.call(Operation.Destroy, id)
  }

  call<T>(
    operation: Opcode,
    id: number,
    ...args: readonly unknown[]
  ): Promise<T> {
    if (this.failure) return Promise.reject(this.failure)
    const { promise, resolve, reject } = Promise.withResolvers<T>()
    this.queue.push({ operation, id, args, resolve, reject })
    try {
      this.worker?.ref?.()
      if (!this.starting) {
        this.starting = true
        void this.start().catch((error) => this.fail(error))
      }
      this.flush()
    } catch (error) {
      this.fail(error instanceof Error ? error : new Error(String(error)))
    }
    return promise
  }

  private async start(): Promise<void> {
    if (typeof Worker === 'undefined') {
      const { Worker: Thread } = await import('node:worker_threads')
      const worker = new Thread(
        `import('node:worker_threads').then(({parentPort}) => {
          globalThis.self = globalThis;
          self.postMessage = (message, transfer) => parentPort.postMessage(message, transfer);
          parentPort.on('message', data => self.onmessage({data}));
          ${workerSource}
        });`,
        { eval: true, name: 'sequencer' }
      )
      worker.on('message', (data) => this.complete(data))
      worker.on('error', (error) =>
        this.fail(error instanceof Error ? error : new Error(String(error)))
      )
      this.worker = worker
      return
    }
    const url = URL.createObjectURL(
      new Blob([workerSource], { type: 'text/javascript' })
    )
    try {
      const worker = new Worker(url, { name: 'sequencer' })
      worker.onmessage = (event) => this.complete(event.data)
      worker.onerror = (event) =>
        this.fail(new Error(event.message || 'Sequencer worker failed'))
      worker.onmessageerror = () =>
        this.fail(new Error('Sequencer worker response could not be received'))
      this.worker = worker
    } finally {
      URL.revokeObjectURL(url)
    }
  }

  private flush(): void {
    if (!this.ready) return
    while (this.free.length && this.queueHead < this.queue.length) {
      const call = this.queue[this.queueHead++]
      const error = this.creationErrors.get(call.id)
      if (error && call.operation !== Operation.Destroy) {
        call.reject(error)
        continue
      }
      const slot = this.free.pop()!
      this.calls[slot] = call
      this.send(slot)
    }
    if (this.queueHead === this.queue.length) {
      this.queue.length = 0
      this.queueHead = 0
    }
  }

  private inputSize({ operation, args }: Call): number {
    if (operation === Operation.Replace) return 1
    if (
      operation !== Operation.Create &&
      operation !== Operation.Apply &&
      operation !== Operation.Merge
    )
      return 0
    const sequence = operation === Operation.Create ? args[1] : args[0]
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

  private send(slot: number): void {
    const call = this.calls[slot]!
    const { operation, id, args } = call
    const count = this.inputSize(call)
    const heap = new Uint32Array(count ? new ArrayBuffer((count + 8) * 4) : this.buffers.pop() ?? new ArrayBuffer(32)),
      base = 8,
      contents = this.content.get(id)
    const bind = (values: unknown): number => {
      if (!Array.isArray(values)) return 0
      const token = ++this.nextContent
      contents?.set(token, values)
      return token
    }
    const absent = 0xffffffff
    let a0 = 0,
      a1 = 0,
      a2 = 0
    if (operation === Operation.Insert || operation === Operation.Replace) {
      a0 = (args[0] as unknown[]).length
      a1 = bind(args[0])
      a2 = (args[1] as number | undefined) ?? absent
      if (operation === Operation.Replace)
        heap[base] = (args[2] as number | undefined) ?? absent
    } else if (
      operation === Operation.Remove ||
      operation === Operation.Values
    ) {
      a0 = (args[0] as number | undefined) ?? absent
      a1 = (args[1] as number | undefined) ?? absent
    } else if (
      operation === Operation.Retire ||
      operation === Operation.Value
    ) {
      a0 = args[0] as number
    } else if (
      operation === Operation.Create ||
      operation === Operation.Apply ||
      operation === Operation.Merge
    ) {
      a0 = operation === Operation.Create ? (args[0] as number) : 0
      const sequence = operation === Operation.Create ? args[1] : args[0]
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
    heap.set([slot, operation, id, a0, a1, a2, 0, count])
    this.worker!.postMessage(heap.buffer, [heap.buffer])
  }

  private complete(message: Response): void {
    if (!(message instanceof ArrayBuffer)) {
      if (message[0] === Failure) this.fail(message[1])
      else {
        this.ready = true
        this.flush()
      }
      return
    }
    const heap = new Uint32Array(message), slot = heap[7]
    const call = this.calls[slot]!
    try {
      const header = 0, content = this.content.get(call.id)
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
        const result: unknown[] = []
        for (let at = pointer >>> 2, end = at + count * 3; at < end; at += 3) {
          const source = content?.get(heap[at]),
            start = heap[at + 1],
            length = heap[at + 2]
          for (let j = 0; j < length; ++j) result.push(source?.[start + j])
        }
        return result
      }
      const words = (pointer: number, count: number): number[] => {
        const result = new Array<number>(count)
        for (let i = 0, at = pointer >>> 2; i < count; ++i) result[i] = heap[at + i]
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
          result = call.operation === Operation.Value ? items[0] : items
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
          for (let at = p1 >>> 2, end = at + n1 * 3; at < end; at += 3) {
            const coordinates = words(heap[at], 6),
              footage = values(heap[at + 1], heap[at + 2])
            insertions.push(
              footage.length ? [coordinates, footage] : [coordinates]
            )
          }
          result = [frontiers, insertions]
          break
        }
        case 6:
          if (call.operation === Operation.Destroy) {
            this.content.delete(call.id)
            this.creationErrors.delete(call.id)
          }
          break
        case 7:
          throw new Error(
            p0 === 1
              ? 'Projection has been destroyed'
              : `Native operation ${call.operation} failed`
          )
      }
      call.resolve(result)
    } catch (error) {
      if (call.operation === Operation.Create)
        this.creationErrors.set(call.id, error)
      call.reject(error)
    }
    this.calls[slot] = undefined
    if (message.byteLength === 32 && this.buffers.length < slots) this.buffers.push(message)
    this.free.push(slot)
    this.flush()
    if (this.free.length === slots && this.queue.length === 0)
      this.worker?.unref?.()
  }

  private fail(error: Error): void {
    this.failure = error
    this.worker?.terminate()
    for (const call of this.calls) call?.reject(error)
    for (let i = this.queueHead; i < this.queue.length; ++i)
      this.queue[i].reject(error)
    this.calls.length = this.queue.length = 0
    this.content.clear()
  }
}
export const runtime = new Runtime()
