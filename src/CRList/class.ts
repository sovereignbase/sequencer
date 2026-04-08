import type {
  CRListReplica,
  CRListSnapshot,
  CRListEventListenerFor,
  CRListEventMap,
} from '../.types/index.js'
import { __create, __read, __update, __delete } from '../core/crud/index.js'
import { __snapshot } from '../core/mags/index.js'

export class CRList<T> {
  private readonly state: CRListReplica<T>
  private readonly eventTarget = new EventTarget()
  constructor(snapshot?: CRListSnapshot<T>) {
    this.state = __create(snapshot)
    new Proxy(this, {
      get(target, index) {
        return __read(Number(index), target.state)
      },
      has(target, index) {
        return Boolean(__read(Number(index), target.state))
      },
      set(target, index, value) {
        try {
          const delta = __update(
            Number(index),
            value,
            target.state,
            'overwrite'
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
        try {
          const delta = __delete(target.state, Number(index), Number(index))
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
      apply() {
        return
      },
      construct(target) {
        return new CRList(__snapshot(target.state))
      },
      defineProperty() {
        return false
      },
      getOwnPropertyDescriptor() {
        return
      },
      isExtensible() {
        return false
      },
      getPrototypeOf() {},
      preventExtensions() {
        return true
      },
    })
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
