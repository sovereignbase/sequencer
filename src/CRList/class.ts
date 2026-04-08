import { indexFromPropertyKey } from '../.helpers/index.js'
import type {
  CRListReplica,
  CRListSnapshot,
  CRListEventListenerFor,
  CRListEventMap,
  CRListDelta,
  CRListAck,
} from '../.types/index.js'
import { __create, __read, __update, __delete } from '../core/crud/index.js'
import {
  __merge,
  __acknowledge,
  __garbageCollect,
  __snapshot,
} from '../core/mags/index.js'

export class CRList<T> {
  [index: number]: T
  declare private readonly state: CRListReplica<T>
  declare private readonly eventTarget: EventTarget

  constructor(snapshot?: CRListSnapshot<T>) {
    Object.defineProperties(this, {
      state: {
        value: __create(snapshot),
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
    })

    return new Proxy(this, {
      get(target, index, receiver) {
        const listIndex = indexFromPropertyKey(index)
        //for non Index Props
        if (listIndex === undefined) return Reflect.get(target, index, receiver)
        return __read(listIndex, target.state)
      },
      has(target, index) {
        const listIndex = indexFromPropertyKey(index)
        //for non Index Props
        if (listIndex === undefined) return Reflect.has(target, index)
        return listIndex >= 0 && listIndex < target.state.size
      },
      set(target, index, value) {
        const listIndex = indexFromPropertyKey(index)
        if (listIndex === undefined) return false
        try {
          const result = __update(
            listIndex,
            [value],
            target.state,
            target.size <= 0 ? 'after' : 'overwrite'
          )
          if (!result) return false
          const { delta, change } = result
          if (delta || change) {
            if (delta)
              target.eventTarget.dispatchEvent(
                new CustomEvent('delta', { detail: delta })
              )
            if (change)
              target.eventTarget.dispatchEvent(
                new CustomEvent('change', { detail: change })
              )
            return true
          }
          return false
        } catch {
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
          if (delta || change) {
            if (delta) {
              target.eventTarget.dispatchEvent(
                new CustomEvent('delta', { detail: delta })
              )
            }
            if (change) {
              target.eventTarget.dispatchEvent(
                new CustomEvent('change', { detail: change })
              )
            }
            return true
          }
          return false
        } catch {
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
            enumerable: true,
            configurable: true,
          }
        }

        return Reflect.getOwnPropertyDescriptor(target, index)
      },
    })
  }
  get size() {
    return this.state.size
  }
  prepend(value: T, beforeIndex?: number): void {
    const result = __update<T>(
      beforeIndex ? beforeIndex : 0,
      [value],
      this.state,
      'before'
    )
    if (!result) return
    const { delta, change } = result
    if (delta)
      this.eventTarget.dispatchEvent(
        new CustomEvent('delta', { detail: delta })
      )
    if (change)
      this.eventTarget.dispatchEvent(
        new CustomEvent('change', { detail: change })
      )
  }
  append(value: T, afterIndex?: number): void {
    const result = __update<T>(
      afterIndex ? afterIndex : 0,
      [value],
      this.state,
      'after'
    )
    if (!result) return
    const { delta, change } = result
    if (delta)
      this.eventTarget.dispatchEvent(
        new CustomEvent('delta', { detail: delta })
      )
    if (change)
      this.eventTarget.dispatchEvent(
        new CustomEvent('change', { detail: change })
      )
  }
  remove(index: number): void {
    const result = __delete(this.state, index, index + 1)
    if (!result) return
    const { delta, change } = result
    if (delta)
      this.eventTarget.dispatchEvent(
        new CustomEvent('delta', { detail: delta })
      )
    if (change)
      this.eventTarget.dispatchEvent(
        new CustomEvent('change', { detail: change })
      )
  }
  merge(delta: CRListDelta<T>) {
    const change = __merge(this.state, delta)
    if (change)
      this.eventTarget.dispatchEvent(
        new CustomEvent('change', { detail: change })
      )
  }
  acknowledge() {
    const ack = __acknowledge(this.state)
    if (ack)
      this.eventTarget.dispatchEvent(new CustomEvent('ack', { detail: ack }))
  }
  garbageCollect(frontiers: Array<CRListAck>) {
    void __garbageCollect(frontiers, this.state)
  }
  snapshot() {
    const snapshot = __snapshot(this.state)
    if (snapshot)
      this.eventTarget.dispatchEvent(
        new CustomEvent('snapshot', { detail: snapshot })
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
    this.eventTarget.addEventListener(
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
    this.eventTarget.removeEventListener(
      type,
      listener as EventListenerOrEventListenerObject | null,
      options
    )
  }
  toJSON(): CRListSnapshot<T> {
    return __snapshot<T>(this.state)
  }
  toString(): string {
    return JSON.stringify(this)
  }
  [Symbol.for('nodejs.util.inspect.custom')](): CRListSnapshot<T> {
    return this.toJSON()
  }
  [Symbol.for('Deno.customInspect')](): CRListSnapshot<T> {
    return this.toJSON()
  }
  *[Symbol.iterator](): IterableIterator<T> {
    for (let index = 0; index < this.size; index++) {
      const value = this[index]
      if (value !== undefined) yield value
    }
  }
  forEach(
    callback: (value: T, index: number, list: this) => void,
    thisArg?: unknown
  ): void {
    for (let index = 0; index < this.size; index++) {
      callback.call(thisArg, this[index], index, this)
    }
  }
}
