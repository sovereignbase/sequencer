/**
 * Parses a JavaScript property key as a safe non-negative list index.
 *
 * Proxy traps receive property keys as strings or symbols. CRList only treats
 * canonical non-negative integer strings as list indexes, so ordinary object
 * properties such as `size`, `toJSON`, and symbols keep normal semantics.
 */
export function indexFromPropertyKey(
  propertyKey: string | symbol
): number | undefined {
  // Symbols and named properties are never list indexes.
  if (typeof propertyKey !== 'string') return undefined

  // Number parsing accepts the ECMAScript numeric grammar for candidate keys.
  const listIndex = Number(propertyKey)

  // Reject non-integers, unsafe integers, and negative numeric strings.
  if (!Number.isSafeInteger(listIndex) || listIndex < 0) return undefined

  // Require canonical string form so values like "01" and "1.0" stay properties.
  return String(listIndex) === propertyKey ? listIndex : undefined
}
