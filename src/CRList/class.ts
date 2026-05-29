import { dispatchCRListEvent, indexFromPropertyKey } from '../.helpers/index.js'
import { CRListError } from '../.errors/class.js'
import type {
  CRListState,
  CRListSnapshot,
  CRListEventListenerFor,
  CRListEventMap,
  CRListDelta,
  CRListAck,
} from '../.types/type.js'
import { __create, __read, __update, __delete } from '../core/crud/index.js'
import {
  __merge,
  __acknowledge,
  __garbageCollect,
  __snapshot,
} from '../core/mags/index.js'

/**
 * A convergent replicated list.
 *
 * Numeric property access reads and mutates the live list projection:
 * `list[0]` reads the live value reference, `list[0] = value` writes an
 * entry, and `delete list[0]` removes one entry. Iteration, `find()`, and
 * `forEach()` expose the same live value references. Mutating returned objects
 * directly can mutate replica state without producing a CRDT delta, so callers
 * must isolate values before out-of-band mutation. Local mutations emit `delta`
 * and `change` events; remote merges emit `change` events.
 *
 * @typeParam T - The value type stored in the list.
 */
export class CRList<T> {
  /**
   * Reads or overwrites an entry in the live list projection by index.
   *
   * Reads return live value references.
   */
  [index: number]: T
  declare private readonly state: CRListState<T>
  declare private readonly eventTarget: EventTarget
  declare private readonly eventState: { hasListeners: boolean }

  /**
   * Creates a replicated list from an optional CRList snapshot.
   *
   * @param snapshot - A previously emitted CRList snapshot.
   */
  constructor(snapshot?: CRListSnapshot<T>) {
    void Object.defineProperties(this, {
      state: {
        value: __create<T>(snapshot),
        enumerable: false,
        configurable: false,
        writable: false,
      },
      eventTarget: {
        value: new EventTarget(),
        enumerable: false,
        configurable: false,
        writable: false,
      },
      eventState: {
        value: { hasListeners: false },
        enumerable: false,
        configurable: false,
        writable: false,
      },
    })

    return new Proxy(this, {
      get(target, index, receiver) {
        const listIndex = indexFromPropertyKey(index)
        // Preserve normal property access for non-index keys.
        if (listIndex === undefined) return Reflect.get(target, index, receiver)
        return __read(listIndex, target.state)
      },
      has(target, index) {
        const listIndex = indexFromPropertyKey(index)
        // Preserve normal property checks for non-index keys.
        if (listIndex === undefined) return Reflect.has(target, index)
        return listIndex >= 0 && listIndex < target.state.size
      },
      set(target, index, value) {
        const listIndex = indexFromPropertyKey(index)
        if (listIndex === undefined) return false
        try {
          const result = __update(listIndex, [value], target.state, 'overwrite')
          if (!result) return false
          const { delta, change } = result
          if (delta)
            void dispatchCRListEvent(
              target.eventTarget,
              'delta',
              delta,
              target.eventState.hasListeners
            )
          if (change)
            void dispatchCRListEvent(
              target.eventTarget,
              'change',
              change,
              target.eventState.hasListeners
            )
          return true
        } catch (error) {
          if (error instanceof CRListError) throw error
          return false
        }
      },
      deleteProperty(target, index) {
        const listIndex = indexFromPropertyKey(index)
        if (listIndex === undefined) return false
        try {
          const result = __delete(target.state, listIndex, listIndex + 1)
          if (!result) return false
          const { delta, change } = result
          if (delta)
            void dispatchCRListEvent(
              target.eventTarget,
              'delta',
              delta,
              target.eventState.hasListeners
            )
          if (change)
            void dispatchCRListEvent(
              target.eventTarget,
              'change',
              change,
              target.eventState.hasListeners
            )
          return true
        } catch (error) {
          if (error instanceof CRListError) throw error
          return false
        }
      },
      ownKeys(target) {
        return [
          ...Reflect.ownKeys(target),
          ...Array.from({ length: target.size }, (_, index) => String(index)),
        ]
      },

      getOwnPropertyDescriptor(target, index) {
        const listIndex = indexFromPropertyKey(index)

        if (listIndex !== undefined && listIndex < target.size) {
          return {
            value: __read(listIndex, target.state),
            writable: true,
            enumerable: true,
            configurable: true,
          }
        }
        // Preserve normal property checks for non-index keys.
        return Reflect.getOwnPropertyDescriptor(target, index)
      },
    })
  }

  /**
   * The current number of live entries.
   */
  get size(): number {
    return this.state.size
  }
  /**
   * Reads the live value at an index without going through the Proxy.
   *
   * @param index - The index to read.
   */
  get(index: number): T | undefined {
    return __read(index, this.state)
  }
  /**
   * Overwrites the entry at an index without going through the Proxy.
   *
   * @param index - The index to overwrite.
   * @param value - The value to write.
   */
  set(index: number, value: T): void {
    const result = __update(index, [value], this.state, 'overwrite')
    if (!result) return
    const { delta, change } = result
    if (delta)
      void dispatchCRListEvent(
        this.eventTarget,
        'delta',
        delta,
        this.eventState.hasListeners
      )
    if (change)
      void dispatchCRListEvent(
        this.eventTarget,
        'change',
        change,
        this.eventState.hasListeners
      )
  }
  /**
   * Inserts values before an index.
   *
   * If `beforeIndex` is omitted, values are inserted at the start of the list.
   *
   * @param values - Values to insert.
   * @param beforeIndex - The index to insert before.
   */
  prepend(values: Array<T>, beforeIndex?: number): void {
    const result = __update<T>(beforeIndex ?? 0, values, this.state, 'before')
    if (!result) return
    const { delta, change } = result
    if (delta)
      void dispatchCRListEvent(
        this.eventTarget,
        'delta',
        delta,
        this.eventState.hasListeners
      )
    if (change)
      void dispatchCRListEvent(
        this.eventTarget,
        'change',
        change,
        this.eventState.hasListeners
      )
  }
  /**
   * Inserts values after an index.
   *
   * If `afterIndex` is omitted, values are appended at the end of the list.
   *
   * @param values - Values to insert.
   * @param afterIndex - The index to insert after.
   */
  append(values: Array<T>, afterIndex?: number): void {
    const result = __update<T>(
      afterIndex ?? this.state.size,
      values,
      this.state,
      'after'
    )
    if (!result) return
    const { delta, change } = result
    if (delta)
      void dispatchCRListEvent(
        this.eventTarget,
        'delta',
        delta,
        this.eventState.hasListeners
      )
    if (change)
      void dispatchCRListEvent(
        this.eventTarget,
        'change',
        change,
        this.eventState.hasListeners
      )
  }
  /**
   * Overwrites entries starting at an index.
   *
   * @param index - The index to start overwriting at.
   * @param values - Values to write.
   */
  update(index: number, values: Array<T>): void {
    const result = __update<T>(index, values, this.state, 'overwrite')
    if (!result) return
    const { delta, change } = result
    if (delta)
      void dispatchCRListEvent(
        this.eventTarget,
        'delta',
        delta,
        this.eventState.hasListeners
      )
    if (change)
      void dispatchCRListEvent(
        this.eventTarget,
        'change',
        change,
        this.eventState.hasListeners
      )
  }
  /**
   * Removes one or more entries starting at an index.
   *
   * @param index - The first index to remove.
   * @param count - Number of entries to remove. Defaults to `1`.
   */
  remove(index: number, count = 1): void {
    const result = __delete(this.state, index, index + count)
    if (!result) return
    const { delta, change } = result
    if (delta)
      void dispatchCRListEvent(
        this.eventTarget,
        'delta',
        delta,
        this.eventState.hasListeners
      )
    if (change)
      void dispatchCRListEvent(
        this.eventTarget,
        'change',
        change,
        this.eventState.hasListeners
      )
  }

  /**
   * Returns the first live value matching a predicate in index order.
   *
   * Predicate values are live references. Mutating them directly can mutate the
   * list without emitting a delta.
   *
   * @param predicate - Function to test each live value.
   * @param thisArg - Optional `this` value for the predicate.
   */
  find(
    predicate: (this: unknown, value: T, index: number, list: this) => unknown,
    thisArg?: unknown
  ): T | undefined {
    let linkedListEntry = this.state.cache.get(0) ?? this.state.cursor
    while (linkedListEntry?.prev) linkedListEntry = linkedListEntry.prev
    let index = 0
    while (linkedListEntry) {
      for (const value of linkedListEntry.values) {
        if (predicate.call(thisArg, value, index, this)) return value
        index++
      }
      linkedListEntry = linkedListEntry.next
    }

    return undefined
  }

  /**
   * Applies a remote gossip delta to this list.
   *
   * Emits a `change` event when the merge changes the live projection.
   *
   * @param delta - The remote CRList delta to merge.
   */
  merge(delta: CRListDelta<T>): void {
    const change = __merge(this.state, delta)
    if (change)
      void dispatchCRListEvent(
        this.eventTarget,
        'change',
        change,
        this.eventState.hasListeners
      )
  }
  /**
   * Emits an acknowledgement frontier for currently retained tombstones.
   */
  acknowledge(): void {
    const ack = __acknowledge(this.state)
    if (ack)
      void dispatchCRListEvent(
        this.eventTarget,
        'ack',
        ack,
        this.eventState.hasListeners
      )
  }
  /**
   * Garbage-collects tombstones that are covered by acknowledgement frontiers.
   *
   * @param frontiers - Replica acknowledgement frontiers.
   */
  garbageCollect(frontiers: Array<CRListAck>): void {
    void __garbageCollect(frontiers, this.state)
  }
  /**
   * Emits the current CRList snapshot.
   *
   * Snapshot value payloads are live references. Mutating them can mutate
   * replica state without emitting a delta.
   */
  snapshot(): void {
    const snapshot = __snapshot<T>(this.state)
    if (snapshot)
      void dispatchCRListEvent(
        this.eventTarget,
        'snapshot',
        snapshot,
        this.eventState.hasListeners
      )
  }
  /**
   * Registers an event listener.
   *
   * @param type - The event type to listen for.
   * @param listener - The listener to register.
   * @param options - Listener registration options.
   */
  addEventListener<K extends keyof CRListEventMap<T>>(
    type: K,
    listener: CRListEventListenerFor<T, K> | null,
    options?: boolean | AddEventListenerOptions
  ): void {
    if (listener) this.eventState.hasListeners = true
    void this.eventTarget.addEventListener(
      type,
      listener as EventListenerOrEventListenerObject | null,
      options
    )
  }

  /**
   * Removes an event listener.
   *
   * @param type - The event type to stop listening for.
   * @param listener - The listener to remove.
   * @param options - Listener removal options.
   */
  removeEventListener<K extends keyof CRListEventMap<T>>(
    type: K,
    listener: CRListEventListenerFor<T, K> | null,
    options?: boolean | EventListenerOptions
  ): void {
    void this.eventTarget.removeEventListener(
      type,
      listener as EventListenerOrEventListenerObject | null,
      options
    )
  }
  /**
   * Returns a CRList snapshot of this list.
   *
   * Snapshot value payloads are live references. Mutating them can mutate
   * replica state without emitting a delta.
   *
   * Called automatically by `JSON.stringify`.
   */
  toJSON(): CRListSnapshot<T> {
    return __snapshot<T>(this.state)
  }
  /**
   * Attempts to return this list snapshot as a JSON string.
   *
   * This can fail when list values are not JSON-compatible.
   */
  toString(): string {
    return JSON.stringify(this)
  }
  /**
   * Returns the Node.js console inspection representation.
   */
  [Symbol.for('nodejs.util.inspect.custom')](): CRListSnapshot<T> {
    return this.toJSON()
  }
  /**
   * Returns the Deno console inspection representation.
   */
  [Symbol.for('Deno.customInspect')](): CRListSnapshot<T> {
    return this.toJSON()
  }
  /**
   * Iterates over current live values in index order.
   */
  *[Symbol.iterator](): IterableIterator<T> {
    let linkedListEntry = this.state.cache.get(0) ?? this.state.cursor
    while (linkedListEntry?.prev) linkedListEntry = linkedListEntry.prev
    while (linkedListEntry) {
      yield* linkedListEntry.values
      linkedListEntry = linkedListEntry.next
    }
  }
  /**
   * Calls a function once for each live value in index order.
   *
   * Callback values are live references. Mutating them directly can mutate the
   * list without emitting a delta.
   *
   * @param callback - Function to call for each live value.
   * @param thisArg - Optional `this` value for the callback.
   */
  forEach(
    callback: (value: T, index: number, list: this) => void,
    thisArg?: unknown
  ): void {
    let linkedListEntry = this.state.cache.get(0) ?? this.state.cursor
    while (linkedListEntry?.prev) linkedListEntry = linkedListEntry.prev
    let index = 0
    while (linkedListEntry) {
      for (const value of linkedListEntry.values) {
        void callback.call(thisArg, value, index, this)
        index++
      }
      linkedListEntry = linkedListEntry.next
    }
  }
}
