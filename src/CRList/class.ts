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
 * Iteration, `find()`, and `forEach()` expose the same live value references. Mutating returned objects
 * directly can mutate replica state without producing a CRDT delta, so callers
 * must isolate values before out-of-band mutation. Local mutations emit `delta`
 * and `change` events; remote merges emit `change` events.
 *
 * @typeParam T - The value type stored in the list.
 */
export class CRList<T> {
  declare private readonly state: CRListState<T>
  declare private readonly eventTarget: EventTarget
  declare private readonly observedEventTypes: Set<keyof CRListEventMap<T>>

  /**
   * Creates a replicated list from an optional CRList snapshot.
   *
   * @param snapshot - A previously emitted CRList snapshot.
   */
  constructor(snapshot?: CRListSnapshot<T>) {
    // Define internal slots as non-enumerable properties.
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
      observedEventTypes: {
        // This tracks whether dispatch can have observable listener effects.
        value: new Set<keyof CRListEventMap<T>>(),
        enumerable: false,
        configurable: false,
        writable: false,
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
   * Reads an item in the live list projection by index.
   *
   * Returns a live value reference.
   *
   * @param index - The index to read.
   */
  get(index: number): T | undefined {
    return __read(index, this.state)
  }

  /**
   * Overwrites entries starting at an index.
   *
   * @param index - The index to start overwriting at.
   * @param values - Values to write.
   */
  set(index: number, values: Array<T>): void {
    // Overwrite values starting at the requested live index.
    const result = __update<T>(index, values, this.state, 'overwrite')

    // No-op updates do not emit events.
    if (!result) return

    // Split primitive result into gossip and visible change payloads.
    const { delta, change } = result

    // Emit local delta for gossip.
    if (delta) void this.emitCRListEvent('delta', delta)

    // Emit local visible projection patch.
    if (change) void this.emitCRListEvent('change', change)
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
      void this.emitCRListEvent('delta', delta)

    // Emit local visible projection patch.
    if (change) void this.emitCRListEvent('change', change)
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
      void this.emitCRListEvent('delta', delta)

    // Emit local visible projection patch.
    if (change) void this.emitCRListEvent('change', change)
  }

  /**
   * Removes one or more entries starting at an index.
   *
   * @param index - The first index to remove.
   * @param count - Number of entries to remove. Defaults to `1`.
   */
  delete(index: number, count = 1): void {
    // Convert count-based API into the primitive's half-open range.
    const result = __delete(this.state, index, index + count)

    // No-op deletes do not emit events.
    if (!result) return

    // Split primitive result into gossip and visible change payloads.
    const { delta, change } = result

    // Emit local delta for gossip.
    if (delta) void this.emitCRListEvent('delta', delta)

    // Emit local visible projection patch.
    if (change) void this.emitCRListEvent('change', change)
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
    // Start from the first block.
    let block = this.state.firstBlock

    // Track public list index while scanning block items.
    let index = 0

    // Walk live blocks in projection order.
    while (block) {
      // Test every live value in the current block.
      for (let offset = 0; offset < block.items.length; offset++) {
        const value = block.items[offset]
        if (
          thisArg === undefined
            ? predicate(value, index, this)
            : predicate.call(thisArg, value, index, this)
        )
          return value
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
    const change = __merge(
      this.state,
      delta,
      this.observedEventTypes.has('change')
    )

    // Remote merges emit only visible projection changes.
    if (change) void this.emitCRListEvent('change', change)
  }
  /**
   * Emits an acknowledgement frontier for currently retained deleted item ids.
   */
  acknowledge(): void {
    // Build an acknowledgement frontier for retained tombstones.
    const ack = __acknowledge(this.state)

    // Emit only when there is at least one tombstone to acknowledge.
    if (ack) void this.emitCRListEvent('ack', ack)
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
    void this.emitCRListEvent('snapshot', __snapshot<T>(this.state))
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
    // Mark this event type as potentially observable for future dispatches.
    if (listener) void this.observedEventTypes.add(type)

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
    // Start from the first block.
    let block = this.state.firstBlock

    // Track public list index while scanning block items.
    let index = 0

    // Walk live blocks in projection order.
    while (block) {
      // Invoke the callback for every live value in the current block.
      for (const value of block.items) {
        if (thisArg === undefined) void callback(value, index, this)
        else void callback.call(thisArg, value, index, this)
        index++
      }

      // Continue with the next projection block.
      block = block.nextBlock
    }
  }

  /**
   * Dispatches a CRList event only after the event type has been observed.
   *
   * Dispatching without listeners is consumer-invisible but expensive in hot
   * merge loops. The set is monotonic: removing a listener does not clear the
   * type, which preserves correctness for once/capture listener edge cases.
   */
  private emitCRListEvent<K extends keyof CRListEventMap<T>>(
    type: K,
    detail: CRListEventMap<T>[K]
  ): void {
    // Skip EventTarget work when no listener has ever watched this event type.
    if (!this.observedEventTypes.has(type)) return

    // Delegate actual event construction and dispatch to the shared helper.
    void this.eventTarget.dispatchEvent(new CustomEvent(type, { detail }))
  }
}
