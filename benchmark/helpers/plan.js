import { random } from './random.js'

export function indexFor(position, size, rand = Math.random) {
  if (position === 'head') return 0
  if (position === 'tail') return Math.max(0, size - 1)
  if (position === 'afterTail') return size
  if (position === 'middle') return Math.floor(size / 2)
  return Math.floor(rand() * Math.max(1, size))
}

export function insertIndexFor(position, size, rand = Math.random) {
  if (position === 'head') return 0
  if (position === 'tail' || position === 'afterTail') return size
  if (position === 'middle') return Math.floor(size / 2)
  return Math.floor(rand() * (size + 1))
}

export function createPlan(amount, initialSize, options = {}) {
  const {
    idPrefix = 'op',
    mixed = false,
    offset = initialSize,
    position = 'tail',
    seed = 0xc0ffee,
    type = 'insert',
  } = options
  const rand = random(seed)
  const ids = Array.from({ length: initialSize }, (_, index) => index)
  const operations = []

  for (let opIndex = 0; opIndex < amount; opIndex++) {
    const deleteOp = type === 'delete' || (mixed && opIndex % 5 === 4)
    const overwriteOp = type === 'overwrite' || (mixed && opIndex % 5 === 3)
    if (deleteOp) {
      if (ids.length === 0) continue
      const index = indexFor(position, ids.length, rand)
      const [id] = ids.splice(index, 1)
      operations.push({ type: 'delete', index, id })
      continue
    }
    if (overwriteOp) {
      if (ids.length === 0) continue
      const index = indexFor(position, ids.length, rand)
      const id = `${idPrefix}:${offset + opIndex}`
      ids[index] = id
      operations.push({ type: 'overwrite', index, id })
      continue
    }
    const index = insertIndexFor(position, ids.length, rand)
    const id = `${idPrefix}:${offset + opIndex}`
    ids.splice(index, 0, id)
    operations.push({ type: 'insert', index, id })
  }

  const finalIndexById = new Map(ids.map((id, index) => [id, index]))
  for (const operation of operations) {
    operation.finalIndex = finalIndexById.get(operation.id)
  }
  return operations
}

export function batchValues(start, amount) {
  return Array.from({ length: amount }, (_, index) => start + index)
}
