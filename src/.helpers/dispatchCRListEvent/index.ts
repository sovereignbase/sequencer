import type { CRListEventMap } from '../../.types/type.js'

/**
 * Dispatches a typed CRList event payload through an EventTarget.
 */
export function dispatchCRListEvent<T, K extends keyof CRListEventMap<T>>(
  eventTarget: EventTarget,
  type: K,
  detail: CRListEventMap<T>[K],
  observed = true
): void {
  if (!observed) return
  void eventTarget.dispatchEvent(new CustomEvent(type, { detail }))
}
