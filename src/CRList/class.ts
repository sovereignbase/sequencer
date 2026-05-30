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
 * `list[0]` reads the live item reference, `list[0] = value` writes an
 * item, and `delete list[0]` removes one item. Iteration, `find()`, and
 * `forEach()` expose the same live value references. Mutating returned objects
 * directly can mutate replica state without producing a CRDT delta, so callers
 * must isolate values before out-of-band mutation. Local mutations emit `delta`
 * and `change` events; remote merges emit `change` events.
 *
 * @typeParam T - The value type stored in the list.
 */
export class CRList<T> {
  /**
   * Reads or overwrites an item in the live list projection by index.
   *
   * Reads return live value references.
   */
  [index: number]: T
  declare private readonly state: CRListState<T>
  declare private readonly eventTarget: EventTarget

  /**
   * Creates a replicated list from an optional CRList snapshot.
   *
   * @param snapshot - A previously emitted CRList snapshot.
   */
  constructor(snapshot?: CRListSnapshot<T>) {
    // Define internal slots as non-enumerable properties so proxy keys stay list-like.
    void Object.defineProperties(this, {
      state: {
        // Hydrate mutable replica state from the optional snapshot.
        value: __create<T>(snapshot),
        enumerable: false,
        configurable: false,
        writable: false,
      },
      eventTarget: {
        // EventTarget provides standard add/remove listener semantics.
        value: new EventTarget(),
        enumerable: false,
        configurable: false,
        writable: false,
      },
    })

    // Proxy numeric property operations into CRList reads, writes, and deletes.
    return new Proxy(this, {
      get(target, index, receiver) {
        // Numeric string keys address live list indexes.
        const listIndex = indexFromPropertyKey(index)

        // Preserve normal property access for non-index keys.
        if (listIndex === undefined) return Reflect.get(target, index, receiver)

        // Reads expose the live value reference at the requested index.
        return __read(listIndex, target.state)
      },
      has(target, index) {
        // Numeric string keys are checked against live list bounds.
        const listIndex = indexFromPropertyKey(index)

        // Preserve normal property checks for non-index keys.
        if (listIndex === undefined) return Reflect.has(target, index)

        // A live index exists when it falls inside the current size.
        return listIndex >= 0 && listIndex < target.state.size
      },
      set(target, index, value) {
        // Only canonical numeric property keys can write list entries.
        const listIndex = indexFromPropertyKey(index)
        if (listIndex === undefined) return false
        try {
          // Numeric assignment overwrites exactly one visible list position.
          const result = __update(listIndex, [value], target.state, 'overwrite')

          // Failed/no-op updates report proxy set failure.
          if (!result) return false

          // Split the primitive result into gossip and local-view payloads.
          const { delta, change } = result

          // Emit deltas only when blocks or deleted runs were produced.
          if (delta.blocks?.length || delta.deletedRuns?.length)
            void dispatchCRListEvent(target.eventTarget, 'delta', delta)

          // Emit visible change patch when the projection changed.
          if (change)
            void dispatchCRListEvent(target.eventTarget, 'change', change)

          // Returning true tells the proxy assignment succeeded.
          return true
        } catch (error) {
          // Public CRList errors should preserve their typed error contract.
          if (error instanceof CRListError) throw error

          // Unexpected failures are hidden from the proxy assignment operation.
          return false
        }
      },
      deleteProperty(target, index) {
        // Only canonical numeric property keys can delete list entries.
        const listIndex = indexFromPropertyKey(index)
        if (listIndex === undefined) return false
        try {
          // Delete exactly one live item at the requested index.
          const result = __delete(target.state, listIndex, listIndex + 1)

          // Failed/no-op deletes report proxy delete failure.
          if (!result) return false

          // Split the primitive result into gossip and local-view payloads.
          const { delta, change } = result

          // Emit deltas only when blocks or deleted runs were produced.
          if (delta.blocks?.length || delta.deletedRuns?.length)
            void dispatchCRListEvent(target.eventTarget, 'delta', delta)

          // Emit visible deletion patch when projection changed.
          if (change)
            void dispatchCRListEvent(target.eventTarget, 'change', change)

          // Returning true tells the proxy delete succeeded.
          return true
        } catch (error) {
          // Public CRList errors should preserve their typed error contract.
          if (error instanceof CRListError) throw error

          // Unexpected failures are hidden from the proxy delete operation.
          return false
        }
      },
      ownKeys(target) {
        // Combine ordinary object keys with enumerable live index keys.
        return [
          ...Reflect.ownKeys(target),
          ...Array.from({ length: target.size }, (_, index) => String(index)),
        ]
      },

      getOwnPropertyDescriptor(target, index) {
        // Numeric descriptors make live indexes enumerable and writable.
        const listIndex = indexFromPropertyKey(index)

        // Return a synthetic data descriptor for live list indexes.
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
    // Size is stored directly on mutable replica state.
    return this.state.size
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
    // Default prepend target is index 0.
    const result = __update<T>(beforeIndex ?? 0, values, this.state, 'before')

    // No-op updates do not emit events.
    if (!result) return

    // Split primitive result into gossip and visible change payloads.
    const { delta, change } = result

    // Emit local delta for gossip when data was actually produced.
    if (delta.blocks?.length || delta.deletedRuns?.length)
      void dispatchCRListEvent(this.eventTarget, 'delta', delta)

    // Emit local visible projection patch.
    if (change) void dispatchCRListEvent(this.eventTarget, 'change', change)
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
    // Default append target is the logical end of the live list.
    const result = __update<T>(
      afterIndex ?? this.state.size,
      values,
      this.state,
      'after'
    )

    // No-op updates do not emit events.
    if (!result) return

    // Split primitive result into gossip and visible change payloads.
    const { delta, change } = result

    // Emit local delta for gossip when data was actually produced.
    if (delta.blocks?.length || delta.deletedRuns?.length)
      void dispatchCRListEvent(this.eventTarget, 'delta', delta)

    // Emit local visible projection patch.
    if (change) void dispatchCRListEvent(this.eventTarget, 'change', change)
  }
  /**
   * Overwrites entries starting at an index.
   *
   * @param index - The index to start overwriting at.
   * @param values - Values to write.
   */
  update(index: number, values: Array<T>): void {
    // Overwrite values starting at the requested live index.
    const result = __update<T>(index, values, this.state, 'overwrite')

    // No-op updates do not emit events.
    if (!result) return

    // Split primitive result into gossip and visible change payloads.
    const { delta, change } = result

    // Emit local delta for gossip when data was actually produced.
    if (delta.blocks?.length || delta.deletedRuns?.length)
      void dispatchCRListEvent(this.eventTarget, 'delta', delta)

    // Emit local visible projection patch.
    if (change) void dispatchCRListEvent(this.eventTarget, 'change', change)
  }
  /**
   * Removes one or more entries starting at an index.
   *
   * @param index - The first index to remove.
   * @param count - Number of entries to remove. Defaults to `1`.
   */
  remove(index: number, count = 1): void {
    // Convert count-based API into the primitive's half-open range.
    const result = __delete(this.state, index, index + count)

    // No-op deletes do not emit events.
    if (!result) return

    // Split primitive result into gossip and visible change payloads.
    const { delta, change } = result

    // Emit local delta for gossip when data was actually produced.
    if (delta.blocks?.length || delta.deletedRuns?.length)
      void dispatchCRListEvent(this.eventTarget, 'delta', delta)

    // Emit local visible projection patch.
    if (change) void dispatchCRListEvent(this.eventTarget, 'change', change)
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
    // Start from the first block
    let block = this.state.firstBlock

    // Track public list index while scanning block items.
    let index = 0

    // Walk live blocks in projection order.
    while (block) {
      // Test every live value in the current block.
      for (const value of block.items) {
        if (predicate.call(thisArg, value, index, this)) return value
        index++
      }

      // Continue with the next projection block.
      block = block.nextBlock
    }

    // No value matched the predicate.
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
    // Apply the remote delta to local mutable state.
    const change = __merge(this.state, delta)

    // Remote merges emit only visible projection changes.
    if (change) void dispatchCRListEvent(this.eventTarget, 'change', change)
  }
  /**
   * Emits an acknowledgement frontier for currently retained deleted item ids.
   */
  acknowledge(): void {
    // Build an acknowledgement frontier for retained tombstones.
    const ack = __acknowledge(this.state)

    // Emit only when there is at least one tombstone to acknowledge.
    if (ack) void dispatchCRListEvent(this.eventTarget, 'ack', ack)
  }
  /**
   * Garbage-collects deleted item ids covered by acknowledgement frontiers.
   *
   * @param frontiers - Replica acknowledgement frontiers.
   */
  garbageCollect(frontiers: Array<CRListAck>): void {
    // Remove tombstones known to be acknowledged by every supplied frontier.
    void __garbageCollect(frontiers, this.state)
  }
  /**
   * Emits the current CRList snapshot.
   *
   * Snapshot value payloads are live references. Mutating them can mutate
   * replica state without emitting a delta.
   */
  snapshot(): void {
    // Emit a snapshot.
    void dispatchCRListEvent(
      this.eventTarget,
      'snapshot',
      __snapshot<T>(this.state)
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
    // Delegate listener registration to the internal EventTarget.
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
    // Delegate listener removal to the internal EventTarget.
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
    // JSON serialization uses the same snapshot primitive as snapshot events.
    return __snapshot<T>(this.state)
  }
  /**
   * Attempts to return this list snapshot as a JSON string.
   *
   * This can fail when list values are not JSON-compatible.
   */
  toString(): string {
    // Let JSON.stringify call toJSON and surface JSON compatibility errors.
    return JSON.stringify(this)
  }
  /**
   * Returns the Node.js console inspection representation.
   */
  [Symbol.for('nodejs.util.inspect.custom')](): CRListSnapshot<T> {
    // Node inspection should display the same structured snapshot as JSON.
    return this.toJSON()
  }
  /**
   * Returns the Deno console inspection representation.
   */
  [Symbol.for('Deno.customInspect')](): CRListSnapshot<T> {
    // Deno inspection should display the same structured snapshot as JSON.
    return this.toJSON()
  }
  /**
   * Iterates over current live values in index order.
   */
  *[Symbol.iterator](): IterableIterator<T> {
    // Iteration begins at the projection head.
    let block = this.state.firstBlock

    // Yield every block's items in projection order.
    while (block) {
      yield* block.items
      block = block.nextBlock
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
    // Start from the first block
    let block = this.state.firstBlock

    // Track public list index while scanning block items.
    let index = 0

    // Walk live blocks in projection order.
    while (block) {
      // Invoke the callback for every live value in the current block.
      for (const value of block.items) {
        void callback.call(thisArg, value, index, this)
        index++
      }

      // Continue with the next projection block.
      block = block.nextBlock
    }
  }
}
