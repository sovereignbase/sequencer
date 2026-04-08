import { indexFromPropertyKey } from '../.helpers/index.js'
import type {
  CRListReplica,
  CRListSnapshot,
  CRListEventListenerFor,
  CRListEventMap,
} from '../.types/index.js'
import { __create, __read, __update, __delete } from '../core/crud/index.js'
import {
  __merge,
  __acknowledge,
  __garbageCollect,
  __snapshot,
} from '../core/mags/index.js'

export class CRList<T> {
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
        if (listIndex === undefined) return Reflect.has(target, index)
        return listIndex >= 0 && listIndex < target.state.size
      },
      set(target, index, value) {
        const listIndex = indexFromPropertyKey(index)
        if (listIndex === undefined) return false
        try {
          const delta = __update(
            listIndex,
            value,
            target.state,
            target.size <= 0 ? 'after' : 'overwrite'
          )
          if (delta) {
            target.eventTarget.dispatchEvent(
              new CustomEvent('delta', { detail: delta })
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
          const delta = __delete(target.state, listIndex, listIndex + 1)
          if (delta) {
            target.eventTarget.dispatchEvent(
              new CustomEvent('delta', { detail: delta })
            )
            return true
          }
          return false
        } catch {
          return false
        }
      },
    })
  }
  get size() {
    return this.state.size
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
}
