/**
 * Parses a JavaScript property key as a safe non-negative list index.
 */
export function indexFromPropertyKey(
  propertyKey: string | symbol
): number | undefined {
  if (typeof propertyKey !== 'string') return undefined
  const listIndex = Number(propertyKey)
  if (!Number.isSafeInteger(listIndex) || listIndex < 0) return undefined
  return String(listIndex) === propertyKey ? listIndex : undefined
}
