export function value(id) {
  return { id, payload: { text: `value:${id}`, number: id } }
}

export function idsEqual(left, right) {
  if (left.length !== right.length) return false
  for (let index = 0; index < left.length; index++)
    if (left[index] !== right[index]) return false
  return true
}

export function validate(result, sourceIds, targetIds) {
  if (!idsEqual(sourceIds(), targetIds())) return undefined
  return result
}
