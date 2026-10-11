import { workerSource } from './source.js'
import { Operation, type Opcode, type Request, type Response } from './protocol.js'

type Resolve = (value: unknown) => void
type Reject = (reason: unknown) => void

/** One lazy worker per loaded runtime. Arrays index reusable in-flight RPC slots. */
class Runtime {
  private worker?: Worker
  private failure?: Error
  private nextProjection = 0
  private readonly free: number[] = []
  private readonly generations: number[] = []
  private readonly resolves: Array<Resolve | undefined> = []
  private readonly rejects: Array<Reject | undefined> = []
  // Invocation arguments stay on the main thread. Content-ID/span bindings are
  // filled in with the new native ABI; generic Footage never enters the worker.
  private readonly inputs: Array<readonly unknown[] | undefined> = []
  private readonly creationErrors: Array<unknown> = []
  private readonly finalizer = new FinalizationRegistry<number>((id) => {
    if (this.worker && !this.failure)
      void this.call(Operation.Destroy, id).catch(() => {})
  })

  create(owner: object, actorID: number, sequence?: unknown): number {
    const id = this.nextProjection++
    // CREATE is queued before all calls for this handle. No ready Promise chain.
    void this.call(Operation.Create, id, actorID, sequence).catch((error) => {
      this.creationErrors[id] = error
    })
    this.finalizer.register(owner, id, owner)
    return id
  }

  destroy(owner: object, id: number): Promise<void> {
    this.finalizer.unregister(owner)
    return this.call(Operation.Destroy, id)
  }

  call<T>(operation: Opcode, id: number, arg0?: unknown, arg1?: unknown, arg2?: unknown): Promise<T> {
    if (this.failure) return Promise.reject(this.failure)
    if (operation !== Operation.Create && this.creationErrors[id])
      return Promise.reject(this.creationErrors[id])
    const slot = this.free.pop() ?? this.generations.length
    const generation = (this.generations[slot] ?? 0) + 1
    this.generations[slot] = generation
    const { promise, resolve, reject } = Promise.withResolvers<T>()
    this.resolves[slot] = resolve as Resolve
    this.rejects[slot] = reject
    this.inputs[slot] = [arg0, arg1, arg2]
    try {
      const worker = this.worker ?? this.start()
      // Numeric control-plane scaffold. Payload/content-ID encoding belongs to
      // the new ABI stage, not an adaptation of the old runtime.
      const request: Request = [slot, generation, operation, id]
      worker.postMessage(request)
    } catch (error) {
      this.complete([slot, generation, 1, error instanceof Error ? error : new Error(String(error))])
    }
    return promise
  }

  private start(): Worker {
    if (!workerSource) throw new Error('Build the package to inline the dedicated worker')
    const url = URL.createObjectURL(new Blob([workerSource], { type: 'text/javascript' }))
    try {
      const worker = new Worker(url, { name: 'sequencer' })
      worker.onmessage = (event: MessageEvent<Response>) => this.complete(event.data)
      worker.onerror = (event) => this.fail(new Error(event.message || 'Sequencer worker failed'))
      worker.onmessageerror = () => this.fail(new Error('Sequencer worker response could not be received'))
      return this.worker = worker
    } finally {
      URL.revokeObjectURL(url)
    }
  }

  private complete([slot, generation, status, value]: Response): void {
    if (this.generations[slot] !== generation) return
    const resolve = this.resolves[slot]
    const reject = this.rejects[slot]
    if (!resolve || !reject) return
    this.resolves[slot] = undefined
    this.rejects[slot] = undefined
    this.inputs[slot] = undefined
    this.free.push(slot)
    if (status === 0) resolve(value)
    else reject(value instanceof Error ? value : new Error(String(value)))
  }

  private fail(error: Error): void {
    this.failure = error
    this.worker?.terminate()
    for (let slot = 0; slot < this.rejects.length; ++slot) {
      this.rejects[slot]?.(error)
      this.resolves[slot] = undefined
      this.rejects[slot] = undefined
      this.inputs[slot] = undefined
    }
  }
}

export const runtime = new Runtime()
