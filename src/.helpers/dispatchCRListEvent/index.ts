import type { CRListEventMap } from '../../.types/type.js'

/**
 * Dispatches a typed CRList event payload through an EventTarget.
 *
 * The type parameter couples the event name to its payload shape at compile
 * time while the runtime event remains a standard CustomEvent.
 */
export function dispatchCRListEvent<T, K extends keyof CRListEventMap<T>>(
  eventTarget: EventTarget,
  type: K,
  detail: CRListEventMap<T>[K]
): void {
  // Wrap the CRList payload in the DOM event detail slot.
  void eventTarget.dispatchEvent(new CustomEvent(type, { detail }))
}
