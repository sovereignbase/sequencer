/** Public calls identify unexpected failures without replacing their original causes. */
import { expect, it, vi } from 'vitest'
import { Projection, SequencerError } from '../../../src/typescript/class.ts'
import module from '../../../src/typescript/wasm/index.ts'

/** Faults enter at native exports, after valid public arguments reach the runtime. */
const operations = [
  ['constructor', '_runtime_dispatch', () => new Projection<string>(2)],
  ['apply', '_runtime_dispatch', (p: Projection<string>) => p.apply([])],
  ['insert', '_runtime_insert', (p: Projection<string>) => p.insert(['b'], 1)],
  ['length', '_runtime_length', (p: Projection<string>) => p.length()],
  ['merge', '_runtime_dispatch', (p: Projection<string>) => p.merge([[], []])],
  ['remove', '_runtime_dispatch', (p: Projection<string>) => p.remove(0, 0)],
  [
    'replace',
    '_runtime_dispatch',
    (p: Projection<string>) => p.replace(['b'], 0, 0),
  ],
  ['retire', '_runtime_dispatch', (p: Projection<string>) => p.retire(2)],
  ['sequence', '_runtime_dispatch', (p: Projection<string>) => p.sequence()],
  ['value', '_runtime_value', (p: Projection<string>) => p.value(0)],
  ['values', '_runtime_dispatch', (p: Projection<string>) => p.values()],
  ['destroy', '_runtime_dispatch', (p: Projection<string>) => p.destroy()],
] as const

it.each(operations)(
  '%s names an unexpected platform failure and preserves its cause',
  (name, entry, invoke) => {
    const projection = new Projection<string>(1)
    projection.insert(['a'], 0)
    const cause = new WebAssembly.RuntimeError('unreachable')
    const stack = cause.stack
    const fault = vi.spyOn(module, entry).mockImplementationOnce(() => {
      throw cause
    })
    try {
      let failure: unknown
      try {
        invoke(projection)
      } catch (error) {
        failure = error
      }
      expect(failure).toBeInstanceOf(SequencerError)
      expect(failure).toMatchObject({
        name: 'SequencerError',
        code: 'UNKNOWN_ERROR',
        message: `{@sovereignbase/sequencer} Projection.${name}() failed.`,
      })
      expect((failure as SequencerError).cause).toBe(cause)
      expect(cause.stack).toBe(stack)
    } finally {
      fault.mockRestore()
      projection.destroy()
    }
  }
)

it.each(operations)(
  '%s passes an existing SequencerError through unchanged',
  (_name, entry, invoke) => {
    const projection = new Projection<string>(1)
    projection.insert(['a'], 0)
    const cause = new RangeError('Underlying failure')
    const error = new SequencerError(
      'NATIVE_OPERATION_FAILED',
      'Native operation failed.',
      { cause }
    )
    const fault = vi.spyOn(module, entry).mockImplementationOnce(() => {
      throw error
    })
    try {
      let failure: unknown
      try {
        invoke(projection)
      } catch (caught) {
        failure = caught
      }
      expect(failure).toBe(error)
      expect(error.cause).toBe(cause)
    } finally {
      fault.mockRestore()
      projection.destroy()
    }
  }
)

it.each([undefined, null, 'failure'])(
  'preserves the thrown value %s without coercion',
  (cause) => {
    const projection = new Projection<string>(1)
    const fault = vi
      .spyOn(module, '_runtime_length')
      .mockImplementationOnce(() => {
        throw cause
      })
    try {
      let failure: unknown
      try {
        projection.length()
      } catch (caught) {
        failure = caught
      }
      expect(failure).toBeInstanceOf(SequencerError)
      expect(failure).toHaveProperty('cause', cause)
      expect((failure as SequencerError).code).toBe('UNKNOWN_ERROR')
    } finally {
      fault.mockRestore()
      projection.destroy()
    }
  }
)

it('identifies a JavaScript input-access failure without changing the Projection', () => {
  const projection = new Projection<string>(1)
  projection.insert(['a'], 0)
  const cause = new DOMException('Unavailable', 'InvalidStateError')
  const values = new Proxy(['b'], {
    get(target, property, receiver) {
      if (property === 'length') throw cause
      return Reflect.get(target, property, receiver)
    },
  })
  try {
    expect(() => projection.insert(values, 1)).toThrowError(
      expect.objectContaining({
        code: 'UNKNOWN_ERROR',
        message: '{@sovereignbase/sequencer} Projection.insert() failed.',
        cause,
      })
    )
    expect(projection.values()).toEqual(['a'])
  } finally {
    projection.destroy()
  }
})
