import module from '../wasm/index.js'
import { SequencerError } from '../errors/class.js'
import { Operation, type Opcode } from './protocol.js'
import type { TupleParams } from '../types/type.js'

/** Footage bindings: undefined is released; null retains missing application content. */
type Bindings = Array<ReadonlyArray<unknown> | null | undefined>

/** Materializes ordered Footage spans, including undefined slots for omitted content. */
function readValues(
  content: Bindings,
  pointer: number,
  count: number,
  sequence?: boolean
): unknown[] {
  if (count === 1) {
    const heap = module.HEAPU32,
      begin = pointer >>> 2,
      source = content[heap[begin]],
      start = heap[begin + 1],
      size = heap[begin + 2]
    if (source && start + size <= source.length)
      return source.slice(start, start + size)
  }
  const heap = module.HEAPU32
  const begin = pointer >>> 2,
    end = begin + count * 3
  if (sequence && count > 1) {
    // Adjacent native spans sharing a source can be copied together, regardless
    // of which runtime fragments produced them. Snapshot order stays unchanged.
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
    // Bound argument count when concatenating many fragmented source arrays.
    for (let at = 0; at < parts.length; at += 16384)
      result = result.concat.apply(result, parts.slice(at, at + 16384))
    return result
  }
  let size = 0
  for (let at = begin; at < end; at += 3) size += heap[at + 2]
  const result = new Array<unknown>(size)
  // Every returned span is positive, so equal total size means one Frame per span.
  if (size === count) {
    for (let at = begin, target = 0; at < end; at += 3)
      result[target++] = content[heap[at]]?.[heap[at + 1]]
    return result
  }
  let target = 0
  for (let at = begin; at < end; at += 3) {
    const source = content[heap[at]],
      start = heap[at + 1],
      length = heap[at + 2]
    for (let j = 0; j < length; ++j) result[target++] = source?.[start + j]
  }
  return result
}
/** Copies borrowed WASM words into metadata that survives subsequent native calls. */
function readWords(pointer: number, count: number): number[] {
  const heap = module.HEAPU32
  const result = new Array<number>(count)
  for (let i = 0, at = pointer >>> 2; i < count; ++i) result[i] = heap[at + i]
  return result
}
/** Joins numeric output descriptors with retained JavaScript Footage references. */
function readGossip(
  content: Bindings,
  pointer: number,
  count: number
): unknown[] {
  const heap = module.HEAPU32
  const entries: unknown[] = []
  for (let at = pointer >>> 2, end = at + count * 4; at < end; at += 4) {
    const tuple = heap[at] === 2
    const coordinates = readWords(heap[at + 1], tuple ? 6 : heap[at + 2])
    if (heap[at] === 1) entries.push(coordinates)
    else {
      const source = content[heap[at + 3]] ?? undefined
      const footage =
        tuple && source && source.length !== 1
          ? source.slice(heap[at + 2], heap[at + 2] + 1)
          : source
      entries.push(
        footage === undefined ? [coordinates] : [coordinates, footage]
      )
    }
  }
  return entries
}

/** High-water handle; released handles are reused before allocating another. */
let nextProjection = 0
/** Per-Projection binding tables; token zero is reserved for absent content. */
const bindings: Array<Bindings | undefined> = []
/** Released handles available after native history and JavaScript bindings are cleared. */
const free: number[] = []
/** Best-effort collection fallback; explicit destroy supplies deterministic release. */
const finalizer = new FinalizationRegistry<number>(release)

/** Returns linear-memory bytes plus eight bytes per retained JavaScript array slot. */
function memory(): {
  bytes: number
  wasmBytes: number
  javascriptBytes: number
} {
  const arrays = new Set<ReadonlyArray<unknown>>([bindings, free])
  for (let id = 0; id < bindings.length; ++id) {
    const content = bindings[id]
    if (!content) continue
    arrays.add(content)
    // Multiple hydrated roots can retain the same flat Footage array.
    for (const footage of content) if (footage) arrays.add(footage)
  }
  let javascriptBytes = 0
  for (const array of arrays) javascriptBytes += array.length * 8
  const wasmBytes = module.HEAPU32.buffer.byteLength
  return { bytes: wasmBytes + javascriptBytes, wasmBytes, javascriptBytes }
}

/**
 * Allocates matching native history and JavaScript bindings.
 * @param owner Projection whose collection may release the handle.
 * @param actorID Actor used for Acknowledgements.
 * @param sequence Optional trusted retained state.
 * @returns Native handle, registered only after successful hydration.
 */
export function create(
  owner: object,
  actorID: number,
  sequence?: unknown,
  tupleParams?: TupleParams
): number {
  // Seed once per runtime; individual Projections receive fresh native Session clocks.
  if (nextProjection === 0)
    module._runtime_seed(crypto.getRandomValues(new Uint32Array(1))[0])
  const id = free.pop() ?? nextProjection++
  bindings[id] = [undefined]
  try {
    call(Operation.Create, id, actorID, sequence, tupleParams)
  } catch (error) {
    // Failed hydration must release both sides before this handle can be reused.
    release(id)
    throw error
  }
  finalizer.register(owner, id, owner)
  return id
}
/** Releases a live handle and cancels its owner's collection callback. */
export function destroy(owner: object, id: number): void {
  finalizer.unregister(owner)
  release(id)
}
/** Returns a fully cleared handle to the free list exactly once. */
function release(id: number): void {
  if (!bindings[id]) return
  module._runtime_dispatch(Operation.Destroy, id, 0, 0, 0, 0, 0)
  bindings[id] = undefined
  free.push(id)
}
/** Reads the maintained Frame count through the dedicated scalar export. */
export function length(id: number): number {
  if (id < 0)
    throw new SequencerError(
      'PROJECTION_DESTROYED',
      'Projection has been destroyed.'
    )
  return module._runtime_length(id)
}
/** Resolves one visible Frame natively, then reads its JavaScript binding slot. */
export function value<T>(id: number, at: number): T | undefined {
  if (id < 0)
    throw new SequencerError(
      'PROJECTION_DESTROYED',
      'Projection has been destroyed.'
    )
  const pointer = module._runtime_value(id, at) >>> 2
  if (!pointer) return
  // Native allocation may grow memory; acquire the current view after the call.
  const heap = module.HEAPU32
  return bindings[id]![heap[pointer]]?.[heap[pointer + 1]] as T | undefined
}
/** Reads an inclusive visible range without mutation descriptors or input storage. */
export function values<T>(id: number, start?: number, end?: number): T[] {
  if (id < 0)
    throw new SequencerError(
      'PROJECTION_DESTROYED',
      'Projection has been destroyed.'
    )
  const pointer =
    module._runtime_values(id, start ?? 0, end ?? 0xffffffff) >>> 2
  if (!pointer)
    throw new SequencerError(
      'NATIVE_OPERATION_FAILED',
      'Projection.values() failed in the native runtime.'
    )
  const heap = module.HEAPU32
  const spans = heap[pointer],
    count = heap[pointer + 1]
  if (!count) return []
  const content = bindings[id]!
  if (count === 1) {
    const begin = spans >>> 2,
      source = content[heap[begin]],
      start = heap[begin + 1],
      size = heap[begin + 2]
    if (source && start + size <= source.length)
      return source.slice(start, start + size) as T[]
  }
  return readValues(content, spans, count) as T[]
}
/** Exports native spans directly, with optional string Footage assembled in JavaScript. */
export function sequence<T>(id: number, stringEncode?: boolean): T {
  if (id < 0)
    throw new SequencerError(
      'PROJECTION_DESTROYED',
      'Projection has been destroyed.'
    )
  return readResult(
    Operation.Sequence,
    id,
    module._runtime_dispatch(Operation.Sequence, id, 0, 0, 0, 0, 0),
    stringEncode
  ) as T
}
/** Authors trusted local Frames through the dedicated six-word result path. */
export function insert<T>(id: number, values: T[], at: number): unknown {
  if (id < 0)
    throw new SequencerError(
      'PROJECTION_DESTROYED',
      'Projection has been destroyed.'
    )
  const content = bindings[id]!
  const pointer =
    module._runtime_insert(id, values.length, content.push(values) - 1, at) >>>
    2
  const heap = module.HEAPU32
  // Tuple batches contain one canonical Insertion per stable index.
  if (heap[pointer + 6] === 0xffffffff)
    return readResult(Operation.Insert, id, heap[pointer + 7])
  const coordinates = [
    heap[pointer],
    heap[pointer + 1],
    heap[pointer + 2],
    heap[pointer + 3],
    heap[pointer + 4],
    heap[pointer + 5],
  ]
  // A nonzero target means the suffix extends an existing canonical Insertion.
  // Gossip retains the caller's suffix; only the internal binding is concatenated.
  const token = heap[pointer + 6]
  if (token) {
    let footage = content[token] as unknown[]
    const extent = heap[pointer + 7]
    if (extent & 0x80000000) {
      // Preserve caller arrays and retained snapshots before extending private Footage.
      const base = heap[pointer + 8]
      footage = footage.slice(base, base + (extent & 0x7fffffff))
      content[token] = footage
    }
    const end = footage.length
    for (let i = 0; i < values.length; ++i) footage[end + i] = values[i]
    content.pop()
  }
  return [[coordinates, values]]
}
/** Validates remote tuple lanes and supplies a descriptor batch to native application. */
export function apply<T>(id: number, value: unknown): T {
  if (id < 0)
    throw new SequencerError(
      'PROJECTION_DESTROYED',
      'Projection has been destroyed.'
    )
  // An invalid outer shape becomes a rejected descriptor; native prefix handling stays uniform.
  const entries: unknown[] = Array.isArray(value) ? value : [null]
  let words = 1 + entries.length * 4
  for (const entry of entries) {
    const data =
      Array.isArray(entry) && typeof entry[0] !== 'number' ? entry[0] : entry
    words +=
      Array.isArray(data) || data instanceof Uint32Array ? data.length : 0
  }

  // Input consists of an entry count, four-word descriptors, then numeric payloads.
  // Descriptor payload offsets are relative to this buffer, unlike output byte pointers.
  const pointer = module._runtime_reserve(words)
  const heap = module.HEAPU32,
    base = pointer >>> 2
  const contents = bindings[id]!
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
          (typeof word !== 'number' || word !== word >>> 0) &&
          // Sparse JSON-style arrays retain the same present-element validation semantics.
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
        ? contents.push(entry[1] ?? null) - 1
        : 0
    if (numeric) {
      if (insertion && count === 6) {
        heap[data] = numbers[0]
        heap[data + 1] = numbers[1]
        heap[data + 2] = numbers[2]
        heap[data + 3] = numbers[3]
        heap[data + 4] = numbers[4]
        heap[data + 5] = numbers[5]
      } else heap.set(numbers as ArrayLike<number>, data)
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
  }
  return readResult(Operation.Apply, id, resultPointer) as T
}
/** Sizes general-dispatch numeric storage; local scalar operations need no tuple validation. */
function inputSize(operation: Opcode, value: unknown, other: unknown): number {
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

/** Executes general ABI operations while leaving all Frame resolution to WASM. */
export function call<T>(
  operation: Exclude<
    Opcode,
    | typeof Operation.Apply
    | typeof Operation.Insert
    | typeof Operation.Sequence
    | typeof Operation.Destroy
  >,
  id: number,
  value?: unknown,
  at?: unknown,
  end?: unknown
): T {
  if (id < 0)
    throw new SequencerError(
      'PROJECTION_DESTROYED',
      'Projection has been destroyed.'
    )
  const configuration =
    operation === Operation.Create && end !== undefined ? 2 : 0
  const count = inputSize(operation, value, at) + configuration
  const pointer = count ? module._runtime_reserve(count) : 0
  const heap = module.HEAPU32,
    base = pointer >>> 2,
    contents = bindings[id]!
  // UINT32_MAX represents omitted local range bounds, resolved against native length.
  const absent = 0xffffffff
  let a0 = 0,
    a1 = 0,
    a2 = 0
  let footage: ReadonlyArray<unknown> | undefined
  if (operation === Operation.Replace) {
    a0 = (value as unknown[]).length
    a1 = a0 ? contents.push(value as unknown[]) - 1 : 0
    a2 = (at as number | undefined) ?? absent
    heap[base] = (end as number | undefined) ?? absent
  } else if (operation === Operation.Remove) {
    a0 = (value as number | undefined) ?? absent
    a1 = (at as number | undefined) ?? absent
  } else if (operation === Operation.Retire) {
    a0 = value as number
  } else {
    a0 = operation === Operation.Create ? (value as number) : 0
    const sequence = operation === Operation.Create ? at : value
    // Hydration trusts numeric lanes; merge validates lanes from external retained state.
    const valid =
      (operation === Operation.Create && sequence === undefined) ||
      (Array.isArray(sequence) &&
        sequence.length === 2 &&
        (Array.isArray(sequence[0]) || sequence[0] instanceof Uint32Array) &&
        (Array.isArray(sequence[1]) || typeof sequence[1] === 'string') &&
        (operation === Operation.Create ||
          sequence[0] instanceof Uint32Array ||
          sequence[0].every(
            (word: number) => typeof word === 'number' && word === word >>> 0
          )))
    a2 = valid ? 1 : 0
    if (configuration) {
      const tuple = end as TupleParams
      heap[base] = tuple.enabled ? 1 : 0
      heap[base + 1] = tuple.maxLength ?? absent
      a2 |= 2
    }
    if (valid && sequence !== undefined) {
      const words = sequence[0] as ArrayLike<number>
      heap.set(words, base + configuration)
      a1 = contents.length
      footage =
        typeof sequence[1] === 'string' ? sequence[1].split('') : sequence[1]
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
    // Native parsing counts only positive roots. Each binds the same flat array
    // at its own native content_start; JavaScript never walks snapshot coordinates.
    const bindings = module.HEAPU32[(resultPointer >>> 2) + 11]
    contents.length += bindings
    contents.fill(footage, a1)
  }
  return readResult(operation, id, resultPointer) as T
}
/** Consumes borrowed native output before another call may overwrite its storage. */
function readResult(
  operation: Opcode,
  id: number,
  pointer: number,
  stringEncode?: boolean
): unknown {
  const heap = module.HEAPU32,
    header = pointer >>> 2,
    content = bindings[id]!
  // Header: kind, release pointer/count, primary pointer/count, secondary pointer/count,
  // append pointer/count, copy pointer/count, consumed token, binding count or snapshot state.
  const kind = heap[header],
    p0 = heap[header + 3],
    n0 = heap[header + 4],
    p1 = heap[header + 5],
    n1 = heap[header + 6]
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
    }
    while (content.length > 1 && content[content.length - 1] === undefined)
      content.pop()
    return [[]]
  }
  let result: unknown
  switch (kind) {
    case 0:
      break
    case 2:
      result = readGossip(content, p0, n0)
      break
    case 4: {
      const changes: unknown[] = []
      for (let at = p0 >>> 2, end = at + n0 * 4; at < end; at += 4) {
        if (heap[at + 3] === 0) {
          changes.push([heap[at], heap[at + 1]])
          continue
        }
        const span = heap[at + 2] >>> 2
        const items =
          heap[span + 1] === 0 &&
          (content[heap[span]] == null ||
            content[heap[span]]?.length === heap[span + 2])
            ? (content[heap[span]] ?? new Array<unknown>(heap[span + 2]))
            : readValues(content, heap[at + 2], heap[at + 3])
        changes.push([heap[at], heap[at + 1], items])
      }
      result = n1 ? [changes, readGossip(content, p1, n1)] : [changes]
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
      } else metadata = readWords(p0, n0)
      if (stringEncode) {
        let text = ''
        try {
          // Consume native spans directly; no intermediate Footage array is needed.
          for (let at = p1 >>> 2, end = at + n1 * 3; at < end; at += 3) {
            const source = content[heap[at]],
              start = heap[at + 1],
              count = heap[at + 2]
            for (let i = 0; i < count; ++i) {
              const value = source?.[start + i]
              // Retained missing slots still occupy one original Frame coordinate.
              text += value === undefined ? '\0' : (value as string)
            }
          }
        } catch (cause) {
          throw new SequencerError(
            'STRING_ENCODING_FAILED',
            'Sequence Footage could not be encoded as a string.',
            { cause }
          )
        }
        result = [metadata, text]
        break
      }
      const span = p1 >>> 2,
        token = heap[span]
      const state = heap[header + 11] >>> 2
      // A full private or retained span can back multiple snapshots. Native
      // ownership is revoked at export, so later edits will first detach it.
      const shared =
        n1 === 1 &&
        heap[span + 1] === 0 &&
        content[token]?.length === heap[span + 2] &&
        !!state &&
        (heap[state] & 0xff) !== 0
      if (shared && (heap[state] & 0xff) !== 3) {
        content[token] = content[token]!.slice()
        heap[state] = (heap[state] & 0xffffff00) | 3
      }
      result = [
        metadata,
        shared ? content[token] : readValues(content, p1, n1, true),
      ]
      break
    }
    case 6:
      break
    case 7: {
      if (p0 === 1)
        throw new SequencerError(
          'PROJECTION_DESTROYED',
          'Projection has been destroyed.'
        )
      // Resolve the public method name only on failure; successful calls do no extra work.
      const name = Object.entries(Operation).find(
        ([, opcode]) => opcode === operation
      )![0]
      throw new SequencerError(
        'NATIVE_OPERATION_FAILED',
        operation === Operation.Create
          ? 'Projection initialization failed.'
          : `Projection.${name.toLowerCase()}() failed in the native runtime.`
      )
    }
  }

  // Splices retain the input spans' original offsets. Rebase private bindings only
  // after those spans have been read, before applying appends and masked-slot releases.
  for (
    let at = heap[header + 9] >>> 2, end = at + heap[header + 10] * 3;
    at < end;
    at += 3
  ) {
    const token = heap[at],
      start = heap[at + 1],
      count = heap[at + 2]
    content[token] = content[token]?.slice(start, start + count) ?? null
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
      offset = heap[at + 4] & 0x7fffffff,
      base = heap[at + 5]
    if (content[target] == null && source == null) continue
    let footage = content[target] as unknown[] | null | undefined
    if (heap[at + 4] & 0x80000000 || footage == null) {
      footage =
        footage?.slice(base, base + offset) ?? new Array<unknown>(offset)
      content[target] = footage
    }
    if (footage!.length < offset) footage!.length = offset
    if (source && start === 0 && count === source.length && count <= 4096)
      footage!.push.apply(footage, source as unknown[])
    else for (let i = 0; i < count; ++i) footage!.push(source?.[start + i])
  }
  // Deferred releases run last so returned Gossip and Splices retain their values.
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
      } else {
        content[token] = undefined
      }
    } else
      (content[token] as unknown[] | undefined)?.fill(
        undefined,
        start,
        start + count
      )
  }
  if (trim) {
    while (content.length > 1 && content[content.length - 1] === undefined)
      content.pop()
  }
  return result
}
/** Memory diagnostics for retained native and JavaScript state. */
export const runtime = { memory }
