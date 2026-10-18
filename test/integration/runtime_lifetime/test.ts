/** Native failures and collector callbacks must release handles without affecting other Projections. */
import { afterAll, beforeAll, describe, expect, it, vi } from 'vitest'

/** Controlled collector delivery avoids depending on when the JS process collects an owner. */
class Collector {
  static instance: Collector
  readonly owners = new Map<object, number>()
  constructor(readonly cleanup: (handle: number) => void) {
    Collector.instance = this
  }
  register(owner: object, handle: number, token: object): void {
    expect(token).toBe(owner)
    this.owners.set(token, handle)
  }
  unregister(token: object): boolean {
    return this.owners.delete(token)
  }
}

let Projection: typeof import('../../../src/typescript/class.ts').Projection
let SequencerError: typeof import('../../../src/typescript/class.ts').SequencerError
let module: typeof import('../../../src/typescript/wasm/index.ts').default

beforeAll(async () => {
  vi.stubGlobal('FinalizationRegistry', Collector)
  vi.resetModules()
  ;({ Projection, SequencerError } =
    await import('../../../src/typescript/class.ts'))
  ;({ default: module } = await import('../../../src/typescript/wasm/index.ts'))
})
afterAll(() => {
  vi.restoreAllMocks()
  vi.unstubAllGlobals()
})

describe('runtime lifetime', () => {
  it.each([
    [
      'missing native handle',
      'PROJECTION_DESTROYED',
      'Projection has been destroyed.',
    ],
    [
      'rejected native initialization',
      'NATIVE_OPERATION_FAILED',
      'Projection initialization failed.',
    ],
  ] as const)('releases bindings after %s', (failure, code, message) => {
    const collector = Collector.instance
    const owners = collector.owners.size
    const dispatch = module._runtime_dispatch
    // Force real native error results at the ABI boundary; public construction owns cleanup.
    const fault = vi
      .spyOn(module, '_runtime_dispatch')
      .mockImplementationOnce((_operation, id, actor) =>
        failure === 'missing native handle'
          ? dispatch(7, 0xffffffff, 0, 0, 0, 0, 0)
          : dispatch(0, id, actor, 0, 0, 0, 0)
      )
    try {
      expect(() => new Projection<string>(1)).toThrowError(
        expect.objectContaining({
          name: 'SequencerError',
          code,
          message: `{@sovereignbase/sequencer} ${message}`,
        })
      )
      expect(collector.owners.size).toBe(owners)
      const recovered = new Projection<string>(2)
      try {
        recovered.insert(['recovered'], 0)
        expect(recovered.values()).toEqual(['recovered'])
        expect(collector.owners.size).toBe(owners + 1)
      } finally {
        recovered.destroy()
      }
      expect(collector.owners.size).toBe(owners)
    } finally {
      fault.mockRestore()
    }
  })

  it('identifies a failed operation without changing the live Projection', () => {
    const projection = new Projection<string>(1)
    projection.insert(['a', 'b', 'c'], 0)
    const dispatch = module._runtime_dispatch
    // An unsupported native opcode returns an operation failure without editing history.
    const fault = vi
      .spyOn(module, '_runtime_dispatch')
      .mockImplementationOnce((_operation, id) =>
        dispatch(12, id, 0, 0, 0, 0, 0)
      )
    try {
      let failure: unknown
      try {
        projection.remove(1, 1)
      } catch (error) {
        failure = error
      }
      expect(failure).toBeInstanceOf(SequencerError)
      expect(failure).toMatchObject({
        code: 'NATIVE_OPERATION_FAILED',
        message:
          '{@sovereignbase/sequencer} Projection.remove() failed in the native runtime.',
      })
      expect(projection.values()).toEqual(['a', 'b', 'c'])
      projection.remove(1, 1)
      expect(projection.values()).toEqual(['a', 'c'])
    } finally {
      fault.mockRestore()
      projection.destroy()
    }
  })

  it('releases collected owners once and reuses their handles without shared history', () => {
    const collected = new Projection<string>(1)
    const survivor = new Projection<string>(2)
    collected.insert(['collected'], 0)
    survivor.insert(['survivor'], 0)
    const collector = Collector.instance
    const handle = collector.owners.get(collected)!
    collector.owners.delete(collected)
    collector.cleanup(handle)
    // A late cleanup for an already empty slot must not add another free handle.
    collector.cleanup(handle)
    const replacement = new Projection<string>(3)
    const independent = new Projection<string>(4)
    try {
      expect(collector.owners.get(replacement)).toBe(handle)
      expect(collector.owners.get(independent)).not.toBe(handle)
      replacement.insert(['replacement'], 0)
      independent.insert(['independent'], 0)
      expect(replacement.values()).toEqual(['replacement'])
      expect(independent.values()).toEqual(['independent'])
      expect(survivor.values()).toEqual(['survivor'])
    } finally {
      replacement.destroy()
      independent.destroy()
      survivor.destroy()
    }
    expect(collector.owners.size).toBe(0)
  })
})
