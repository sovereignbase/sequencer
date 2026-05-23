/**
 * Parses a JavaScript property key as a safe non-negative list index.
 */
export function indexFromPropertyKey(
  index: string | symbol
): number | undefined {
  if (typeof index !== 'string') return undefined
  const listIndex = Number(index)
  if (!Number.isSafeInteger(listIndex) || listIndex < 0) return undefined
  return String(listIndex) === index ? listIndex : undefined
}
