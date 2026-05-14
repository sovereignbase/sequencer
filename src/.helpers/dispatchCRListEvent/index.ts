import type { CRListEventMap } from '../../.types/index.js'

/**
 * Dispatches a typed CRList event payload through an EventTarget.
 */
export function dispatchCRListEvent<T, K extends keyof CRListEventMap<T>>(
  eventTarget: EventTarget,
  type: K,
  detail: CRListEventMap<T>[K]
): void {
  void eventTarget.dispatchEvent(new CustomEvent(type, { detail }))
}
