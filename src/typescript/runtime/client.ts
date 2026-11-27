import module from '../wasm/index.js'
import { SequencerError } from '../errors/class.js'
import { Operation, type Opcode } from './protocol.js'
import type { Batch, Gossip, TupleParams } from '../types/type.js'

/** Footage bindings: undefined is released; null retains missing application content. */
type Bindings = Array<ReadonlyArray<unknown> | string | null | undefined>

/** Concatenates native spans without materializing an intermediate character array. */
function readText(
  content: Bindings,
  pointer: number,
  count: number,
  description = 'Sequence'
): string {
  const heap = module.HEAPU32
  let text = ''
  let backingLength = 0
  try {
    if (count === 1) {
      const at = pointer >>> 2,
        source = content[heap[at]]
      if (
        typeof source === 'string' &&
        heap[at + 1] + heap[at + 2] <= source.length
      ) {
        const part = source.slice(heap[at + 1], heap[at + 1] + heap[at + 2])
        // Detach a short checkpoint from a much larger string backing.
        return description === 'Sequence' && source.length > part.length * 2
          ? (' ' + part).slice(1)
          : part
      }
    }
    for (let at = pointer >>> 2, end = at + count * 3; at < end; at += 3) {
      const source = content[heap[at]],
        start = heap[at + 1],
        length = heap[at + 2]
      if (typeof source === 'string') {
        if (description === 'Sequence')
          backingLength = Math.max(backingLength, source.length)
        const part = source.slice(start, start + length)
        text += part
        if (part.length < length) text += '\0'.repeat(length - part.length)
      } else if (!source) text += '\0'.repeat(length)
      else
        for (let i = 0; i < length; ++i) {
          const value = source[start + i]
          text += value === undefined ? '\0' : (value as string)
        }
    }
    return backingLength > text.length * 2 ? (' ' + text).slice(1) : text
  } catch (cause) {
    throw new SequencerError(
      'STRING_ENCODING_FAILED',
      `${description} Footage could not be encoded as a string.`,
      { cause }
    )
  }
}

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
      return typeof source === 'string'
        ? source.slice(start, start + size).split('')
        : source.slice(start, start + size)
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
      if (typeof source === 'string' && start + size <= source.length)
        parts.push(source.slice(start, start + size).split(''))
      else if (
        source &&
        typeof source !== 'string' &&
        start + size <= source.length
      )
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
    if (source)
      for (let at = start, end = start + length; at < end; ++at)
        result[target++] = source[at]
    else {
      result.fill(undefined, target, target + length)
      target += length
    }
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
/** Copies encoded bytes before the shared native output can be reused. */
function readBytes(pointer: number, count: number): Uint8Array {
  return module.HEAPU8.slice(pointer, pointer + count)
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
    const tag = heap[at],
      tuple = tag === 2 || tag === 5,
      binary = tag >= 3
    const coordinates = binary
      ? readBytes(heap[at + 1], heap[at + 2])
      : readWords(heap[at + 1], tuple ? 6 : heap[at + 2])
    if (tag === 1 || tag === 4) entries.push(coordinates)
    else {
      const source = content[heap[at + 3]] ?? undefined
      const offset = tag === 5 ? heap[(heap[at + 1] - 4) >>> 2] : heap[at + 2]
      const footage =
        tuple && source && source.length !== 1
          ? source.slice(offset, offset + 1)
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

/** Estimates retained slots at eight bytes and string code units at two bytes each. */
function memory(): {
  bytes: number
  wasmBytes: number
  javascriptBytes: number
} {
  const arrays = new Set<ReadonlyArray<unknown>>([bindings, free])
  const strings = new Set<string>()
  for (let id = 0; id < bindings.length; ++id) {
    const content = bindings[id]
    if (!content) continue
    arrays.add(content)
    // Multiple hydrated roots can retain the same flat Footage array.
    for (const footage of content)
      if (typeof footage === 'string') strings.add(footage)
      else if (footage) arrays.add(footage)
  }
  let javascriptBytes = 0
  for (const array of arrays) javascriptBytes += array.length * 8
  for (const text of strings) javascriptBytes += text.length * 2
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
  tupleParams?: TupleParams,
  stringFootage?: boolean
): number {
  // Seed once per runtime; individual Projections receive fresh native Session clocks.
  if (nextProjection === 0)
    module._runtime_seed(crypto.getRandomValues(new Uint32Array(1))[0])
  const id = free.pop() ?? nextProjection++
  bindings[id] = [undefined]
  try {
    if (sequence === undefined)
      module._runtime_create(
        id,
        actorID,
        tupleParams?.enabled ? 1 : 0,
        tupleParams?.maxLength ?? 0xffffffff
      )
    else
      call(Operation.Create, id, actorID, sequence, tupleParams, stringFootage)
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
  return module._runtime_length(id) >>> 0
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
export function values<T>(
  id: number,
  start?: number,
  end?: number,
  stringEncode?: boolean
): T[] | string {
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
  if (!count) return stringEncode ? '' : []
  const content = bindings[id]!
  if (stringEncode)
    return readText(content, spans, count, 'Projection.values()')
  if (count === 1) {
    const begin = spans >>> 2,
      source = content[heap[begin]],
      start = heap[begin + 1],
      end = start + heap[begin + 2]
    if (source && end <= source.length)
      return (
        typeof source === 'string'
          ? source.slice(start, end).split('')
          : source.slice(start, end)
      ) as T[]
  }
  return readValues(content, spans, count) as T[]
}
/** Exports native spans directly, with optional string Footage assembled in JavaScript. */
export function sequence<T>(
  id: number,
  stringEncode?: boolean,
  binaryEncode?: boolean
): T {
  if (id < 0)
    throw new SequencerError(
      'PROJECTION_DESTROYED',
      'Projection has been destroyed.'
    )
  return readResult(
    Operation.Sequence,
    id,
    module._runtime_dispatch(
      Operation.Sequence | (binaryEncode ? 128 : 0),
      id,
      0,
      0,
      0,
      0,
      0
    ),
    stringEncode,
    binaryEncode
  ) as T
}
/** Authors trusted local Frames through the dedicated six-word result path. */
export function insert<T>(
  id: number,
  values: T[] | string,
  at: number,
  binaryEncode?: boolean
): unknown {
  if (id < 0)
    throw new SequencerError(
      'PROJECTION_DESTROYED',
      'Projection has been destroyed.'
    )
  const content = bindings[id]!
  const count = values.length + (typeof values === 'string' ? 0x80000000 : 0)
  const incoming = content.length
  const pointer =
    (binaryEncode
      ? module._runtime_insert_binary(id, count, incoming, at)
      : module._runtime_insert(id, count, incoming, at)) >>> 2
  const heap = module.HEAPU32
  const token = heap[pointer + 6]
  // An extension reads its suffix directly; only retained or general results need a binding.
  if (!token || token === 0xffffffff) content.push(values)
  // Tuple batches contain one canonical Insertion per stable index.
  if (token === 0xffffffff)
    return readResult(
      Operation.Insert,
      id,
      heap[pointer + 7],
      undefined,
      binaryEncode
    )
  const coordinates = binaryEncode
    ? readBytes(heap[pointer], heap[pointer + 1])
    : [
        heap[pointer],
        heap[pointer + 1],
        heap[pointer + 2],
        heap[pointer + 3],
        heap[pointer + 4],
        heap[pointer + 5],
      ]
  // A nonzero target means the suffix extends an existing canonical Insertion.
  // Gossip retains the caller's suffix; only the internal binding is concatenated.
  if (token) {
    let footage = content[token] as unknown[] | string
    const extent = heap[pointer + 7]
    if (extent & 0x80000000) {
      // Preserve caller arrays and retained snapshots before extending private Footage.
      const base = heap[pointer + 8]
      footage = footage.slice(base, base + (extent & 0x7fffffff))
      content[token] = footage
    }
    if (typeof footage === 'string' && typeof values === 'string')
      content[token] = footage + values
    else {
      if (typeof footage === 'string')
        content[token] = footage = footage.split('')
      const end = footage.length
      for (let i = 0; i < values.length; ++i) footage[end + i] = values[i]
    }
  }
  return [[coordinates, values]]
}

/** Collects native coordinates while retaining application Footage in JavaScript. */
export function batch<T>(
  getId: () => number,
  edit: (batch: Batch<T>) => void
): Gossip<T, boolean, true> {
  const id = getId()
  if (id < 0)
    throw new SequencerError(
      'PROJECTION_DESTROYED',
      'Projection has been destroyed.'
    )
  let handle = module._runtime_batch_begin(id) >>> 0
  if (handle === 0xffffffff)
    throw new SequencerError(
      'NATIVE_OPERATION_FAILED',
      'Projection.batch() could not start.'
    )
  let active = true,
    owner: (() => number) | undefined = getId,
    text = '',
    parts: Array<Array<T> | string> | undefined,
    size = 0
  const mutate = (
    operation: Opcode,
    values?: Array<T> | string,
    start?: number,
    end?: number
  ) => {
    if (!active) throw new SequencerError('BATCH_CLOSED', 'Batch has finished.')
    const id = owner!()
    if (id < 0)
      throw new SequencerError(
        'PROJECTION_DESTROYED',
        'Projection has been destroyed.'
      )
    let content = 0,
      count = 0
    if (values !== undefined) {
      content = bindings[id]!.push(values) - 1
      count = values.length + (typeof values === 'string' ? 0x80000000 : 0)
      if (values.length) {
        size += values.length
        if (typeof values === 'string' && parts === undefined) text += values
        else {
          parts ??= text.length ? [text] : []
          parts.push(values)
        }
      }
    }
    const pointer = module._runtime_batch_edit(
      handle,
      operation,
      count,
      content,
      start ?? 0xffffffff,
      end ?? 0xffffffff,
      bindings[id]!.length
    )
    if (!pointer)
      throw new SequencerError(
        'NATIVE_OPERATION_FAILED',
        'Projection.batch() failed in the native runtime.'
      )
    if (pointer !== 1) {
      const heap = module.HEAPU32,
        header = pointer >>> 2
      if (operation === Operation.Insert && typeof values === 'string') {
        const at = heap[header + 7] >>> 2,
          content = bindings[id]!,
          token = heap[at],
          footage = content[token]
        // A complete private text root needs only concatenation and the suffix release.
        if (typeof footage === 'string' && footage.length === heap[at + 4]) {
          content[token] = footage + values
          content.pop()
          return
        }
      }
      readResult(operation, id, pointer)
    }
  }
  try {
    edit({
      insert: (values, at) => mutate(Operation.Insert, values, at),
      remove: (start, end) => mutate(Operation.Remove, undefined, start, end),
      replace: (values, start, end) =>
        mutate(Operation.Replace, values, start, end),
    })
    active = false
    const pointer = module._runtime_batch_end(handle, 1) >>> 2
    handle = -1
    if (!pointer)
      throw new SequencerError(
        'NATIVE_OPERATION_FAILED',
        'Projection.batch() could not finish.'
      )
    const heap = module.HEAPU32,
      first = heap[pointer],
      firstSize = heap[pointer + 1],
      second = heap[pointer + 2],
      secondSize = heap[pointer + 3]
    if (!firstSize) return []
    const words = new Uint8Array(firstSize + secondSize)
    words.set(module.HEAPU8.subarray(first, first + firstSize))
    words.set(module.HEAPU8.subarray(second, second + secondSize), firstSize)
    if (!size) return [[words]]
    let footage: Array<T | undefined> | string = text
    if (parts !== undefined) {
      if (parts.length === 1) footage = parts[0]
      else {
        const joined: Array<T | string | undefined> = []
        for (const part of parts)
          for (let i = 0; i < part.length; ++i) joined.push(part[i])
        footage = joined as Array<T | undefined>
      }
    }
    return [[words, footage]]
  } finally {
    active = false
    owner = undefined
    text = ''
    parts = undefined
    if (handle >= 0) module._runtime_batch_end(handle, 0)
  }
}

/** Reads only the binding count; native parsing validates the complete packet. */
function batchBindings(words: Uint8Array): number {
  let count = 0
  for (
    let at = 2, shift = 0;
    at < words.length && shift <= 28;
    ++at, shift += 7
  ) {
    const part = words[at]
    if (shift === 28 && part > 15) return 0
    count |= (part & 127) << shift
    if (!(part & 128)) return count >>> 2
  }
  return 0
}
/** Validates remote tuple lanes and supplies a descriptor batch to native application. */
export function apply<T>(
  id: number,
  value: unknown,
  stringEncode?: boolean,
  binaryEncode?: boolean
): T {
  if (id < 0)
    throw new SequencerError(
      'PROJECTION_DESTROYED',
      'Projection has been destroyed.'
    )
  // An invalid outer shape becomes a rejected descriptor; native prefix handling stays uniform.
  const entries: unknown[] = Array.isArray(value) ? value : [null]
  let words = 1 + entries.length * 3
  for (const entry of entries) {
    const data =
      Array.isArray(entry) && typeof entry[0] !== 'number' ? entry[0] : entry
    if (data instanceof Uint8Array) {
      words += Math.ceil(data.length / 4)
      if (
        Array.isArray(entry) &&
        data[0] === 255 &&
        (data[1] === 4 || data[1] === 5)
      )
        ++words
    } else if (Array.isArray(data) || data instanceof Uint32Array)
      words += data.length
  }

  // Each input record stores its tag, word count and content token before its payload.
  const pointer = module._runtime_reserve(words)
  const heap = module.HEAPU32,
    base = pointer >>> 2
  const bytes = module.HEAPU8
  const contents = bindings[id]!
  const firstBinding = contents.length
  const absent = 0xffffffff

  let data = base + 1,
    singleBatch = false
  heap[base] = entries.length
  for (const entry of entries) {
    const insertion = Array.isArray(entry) && typeof entry[0] !== 'number'
    const numbers = insertion ? entry[0] : entry
    const binary = numbers instanceof Uint8Array
    const packed =
      binary &&
      insertion &&
      numbers[0] === 255 &&
      (numbers[1] === 4 || numbers[1] === 5)
    let numeric = binary || numbers instanceof Uint32Array
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
    const footage = insertion ? entry[1] : undefined
    let text = false
    const shape = insertion
      ? entry.length <= 2 &&
        entry.length > 0 &&
        (footage === undefined ||
          Array.isArray(footage) ||
          (text = typeof footage === 'string'))
      : true
    const tag =
      numeric && shape
        ? binary
          ? insertion
            ? packed
              ? text
                ? 8
                : 7
              : text
                ? 5
                : 4
            : 6
          : insertion
            ? text
              ? 3
              : 0
            : 1
        : 2
    const count =
      binary || Array.isArray(numbers) || numbers instanceof Uint32Array
        ? numbers.length
        : 0
    heap[data] = tag
    heap[data + 1] = count
    // Masks never own content. Rejected coordinates need no JS binding.
    heap[data + 2] =
      insertion &&
      tag !== 2 &&
      (binary
        ? count > 0 && !(numbers[0] & 128)
        : count === 6 && numbers[5] > 0 && numbers[5] < 0x80000000)
        ? contents.push(footage ?? null) - 1
        : 0
    data += 3
    if (tag === 7 || tag === 8) {
      singleBatch = entries.length === 1
      const extent =
        (footage as Array<unknown> | string | undefined)?.length ?? 0
      const count = Math.min(batchBindings(numbers as Uint8Array), extent)
      if (count) {
        heap[data - 1] = contents.length
        for (let at = 0; at < count; ++at)
          contents.push(
            tag === 8 && (numbers as Uint8Array)[1] === 5
              ? (footage as string)[at]
              : (footage as Array<unknown> | string)
          )
      }
      heap[data++] = extent
    }
    if (binary) {
      bytes.set(numbers, data * 4)
    } else if (numeric) {
      if (insertion && count === 6) {
        heap[data] = numbers[0]
        heap[data + 1] = numbers[1]
        heap[data + 2] = numbers[2]
        heap[data + 3] = numbers[3]
        heap[data + 4] = numbers[4]
        heap[data + 5] = numbers[5]
      } else heap.set(numbers as ArrayLike<number>, data)
    }
    data += binary ? Math.ceil(count / 4) : count
  }
  const resultPointer = singleBatch
    ? module._runtime_apply_batch(
        id,
        pointer,
        words,
        binaryEncode ? 1 : 0,
        contents.length
      )
    : module._runtime_dispatch(
        Operation.Apply | (binaryEncode ? 128 : 0),
        id,
        contents.length,
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
  return readResult(
    Operation.Apply,
    id,
    resultPointer,
    stringEncode,
    binaryEncode
  ) as T
}
/** Sizes general-dispatch numeric storage; local scalar operations need no tuple validation. */
function inputSize(operation: Opcode, value: unknown, other: unknown): number {
  if (operation === Operation.Create || operation === Operation.Merge) {
    const sequence = operation === Operation.Create ? other : value
    return Array.isArray(sequence) &&
      (Array.isArray(sequence[0]) || sequence[0] instanceof Uint32Array)
      ? sequence[0].length
      : Array.isArray(sequence) && sequence[0] instanceof Uint8Array
        ? 1 + Math.ceil(sequence[0].length / 4)
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
  end?: unknown,
  stringEncode?: boolean,
  binaryEncode?: boolean
): T {
  if (id < 0)
    throw new SequencerError(
      'PROJECTION_DESTROYED',
      'Projection has been destroyed.'
    )
  const configuration =
    operation === Operation.Create && end !== undefined ? 2 : 0
  const count = inputSize(operation, value, at) + configuration
  let pointer = count ? module._runtime_reserve(count) : 0
  const heap = module.HEAPU32,
    base = pointer >>> 2,
    contents = bindings[id]!
  // UINT32_MAX represents omitted local range bounds, resolved against native length.
  const absent = 0xffffffff
  let a0 = 0,
    a1 = 0,
    a2 = 0
  let footage: ReadonlyArray<unknown> | string | undefined
  if (operation === Operation.Replace) {
    a0 = (value as unknown[] | string).length
    a1 = a0 ? contents.push(value as unknown[] | string) - 1 : contents.length
    if (typeof value === 'string') a0 += 0x80000000
    a2 = (at as number | undefined) ?? absent
    pointer = (end as number | undefined) ?? absent
  } else if (operation === Operation.Remove) {
    a0 = (value as number | undefined) ?? absent
    a1 = (at as number | undefined) ?? absent
    a2 = contents.length
  } else if (operation === Operation.Retire) {
    a0 = value as number
  } else {
    a0 = operation === Operation.Create ? (value as number) : 0
    const sequence = operation === Operation.Create ? at : value
    // Hydration trusts numeric lanes; merge validates lanes from external retained state.
    const valid =
      Array.isArray(sequence) &&
      sequence.length === 2 &&
      (Array.isArray(sequence[0]) ||
        sequence[0] instanceof Uint32Array ||
        sequence[0] instanceof Uint8Array) &&
      (Array.isArray(sequence[1]) || typeof sequence[1] === 'string') &&
      (operation === Operation.Create ||
        sequence[0] instanceof Uint32Array ||
        sequence[0] instanceof Uint8Array ||
        sequence[0].every(
          (word: number) => typeof word === 'number' && word === word >>> 0
        ))
    a2 = valid ? 1 : 0
    if (configuration) {
      const tuple = end as TupleParams
      heap[base] = tuple.enabled ? 1 : 0
      heap[base + 1] = tuple.maxLength ?? absent
      a2 |= 2
    }
    if (valid) {
      const words = sequence[0] as ArrayLike<number>
      if (words instanceof Uint8Array) {
        heap[base + configuration] = words.length
        module.HEAPU8.set(words, (base + configuration + 1) * 4)
        a2 |= 8
      } else heap.set(words, base + configuration)
      a1 = contents.length
      if (typeof sequence[1] === 'string') {
        if (stringEncode) {
          footage = sequence[1]
          a2 |= 4
        } else footage = sequence[1].split('')
      } else footage = sequence[1]
    }
  }

  const resultPointer = module._runtime_dispatch(
    operation | (binaryEncode ? 128 : 0),
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
    const roots = module.HEAPU32[(resultPointer >>> 2) + 11]
    const count = roots & 0x80000000 ? 1 : roots
    if (operation === Operation.Create && count) {
      const table = new Array<Bindings[number]>(count + 1)
      table[0] = undefined
      table.fill(footage, 1)
      bindings[id] = table
    } else {
      contents.length += count
      contents.fill(footage, a1)
    }
  }
  return readResult(
    operation,
    id,
    resultPointer,
    stringEncode,
    binaryEncode
  ) as T
}
/** Consumes borrowed native output before another call may overwrite its storage. */
function readResult(
  operation: Opcode,
  id: number,
  pointer: number,
  stringEncode?: boolean,
  binaryEncode?: boolean
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
  // Native replay is already applied; complete Footage updates before reporting encoding failure.
  let encodingFailure: unknown
  switch (kind) {
    case 0:
      break
    case 2:
      result = readGossip(content, p0, n0)
      break
    case 4: {
      const changes: unknown[] = []
      for (let at = p0 >>> 2, end = at + n0 * 5; at < end; at += 5) {
        if (heap[at + 4] === 0) {
          changes.push([heap[at], heap[at + 1]])
          continue
        }
        const span = at + 2,
          source = content[heap[span]]
        let items: unknown
        if (stringEncode) {
          try {
            items = readText(content, span * 4, 1, 'Splice')
          } catch (error) {
            encodingFailure = error
          }
        } else
          items =
            typeof source !== 'string' &&
            heap[span + 1] === 0 &&
            (source == null || source.length === heap[span + 2])
              ? (source ?? new Array<unknown>(heap[span + 2]))
              : readValues(content, span * 4, 1)
        changes.push([heap[at], heap[at + 1], items])
      }
      result = n1 ? [changes, readGossip(content, p1, n1)] : [changes]
      break
    }
    case 5: {
      // A literal allocation site keeps compact words in integer elements
      // independently of full uint32 Gossip's double-element feedback.
      let metadata: number[] | Uint8Array
      if (binaryEncode) metadata = readBytes(p0, n0)
      else if (n0 > 0 && heap[p0 >>> 2] === 0) {
        metadata = [0]
        metadata.length = n0
        for (let i = 0, at = p0 >>> 2; i < n0; ++i) metadata[i] = heap[at + i]
      } else metadata = readWords(p0, n0)
      if (stringEncode) {
        return [metadata, readText(content, p1, n1)]
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
      // Snapshot export has no deferred Footage mutations to consume below.
      return [
        metadata,
        shared ? content[token] : readValues(content, p1, n1, true),
      ]
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
      let name = ''
      for (const method in Operation)
        if (Operation[method as keyof typeof Operation] === operation) {
          name = method
          break
        }
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
    let at = heap[header + 9] >>> 2, end = at + heap[header + 10] * 4;
    at < end;
    at += 4
  ) {
    const token = heap[at],
      source = heap[at + 1],
      start = heap[at + 2],
      count = heap[at + 3]
    content[token] = content[source]?.slice(start, start + count) ?? null
  }
  for (
    let at = heap[header + 7] >>> 2, end = at + heap[header + 8] * 7;
    at < end;
    at += 7
  ) {
    const target = heap[at],
      source = content[heap[at + 1]],
      start = heap[at + 2],
      count = heap[at + 3],
      offset = heap[at + 4] & 0x7fffffff,
      base = heap[at + 5],
      prefix = heap[at + 6]
    if (content[prefix] == null && source == null) continue
    let footage = content[prefix] as unknown[] | string | null | undefined
    if (heap[at + 4] & 0x80000000 || footage == null) {
      footage =
        footage?.slice(base, base + offset) ?? new Array<unknown>(offset)
      content[target] = footage
    }
    if (typeof footage === 'string') {
      if (
        typeof source === 'string' &&
        footage.length === offset &&
        start + count <= source.length
      ) {
        content[target] = footage + source.slice(start, start + count)
        continue
      }
      content[target] = footage = footage.split('')
    }
    if (footage!.length < offset) footage!.length = offset
    if (
      source &&
      typeof source !== 'string' &&
      start === 0 &&
      count === source.length &&
      count <= 4096
    )
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
    } else if (count === 1) {
      const footage = content[token]
      if (footage && typeof footage !== 'string' && start < footage.length)
        (footage as unknown[])[start] = undefined
    } else
      (typeof content[token] === 'string'
        ? undefined
        : (content[token] as unknown[] | undefined)
      )?.fill(undefined, start, start + count)
  }
  if (trim) {
    while (content.length > 1 && content[content.length - 1] === undefined)
      content.pop()
  }
  if (encodingFailure) throw encodingFailure
  return result
}
/** Memory diagnostics for retained native and JavaScript state. */
export const runtime = { memory }
