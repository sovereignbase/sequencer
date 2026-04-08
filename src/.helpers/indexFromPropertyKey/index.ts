export function indexFromPropertyKey(
  index: string | symbol
): number | undefined {
  if (typeof index !== 'string' || !/^(0|[1-9]\d*)$/.test(index))
    return undefined
  const listIndex = Number(index)
  return Number.isSafeInteger(listIndex) ? listIndex : undefined
}
