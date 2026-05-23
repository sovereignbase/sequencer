import {
  BATCH_SIZE,
  applyLocal,
  createArtifacts,
  createSparseState,
  createTombstonedState,
  createValues,
  findIndexById,
  maybeGarbageCollect,
  measured,
  mergeArtifacts,
  operation,
  positionFromName,
  readSequential,
  safeIndex,
  safeInsertIndex,
  visibleConvergence,
} from './shared.js'
import { random, shuffledIndices } from '../helpers/random.js'

function findById(adapter, state, id) {
  for (let index = 0; index < adapter.size(state); index++)
    if (adapter.readId(state, index) === id) return adapter.readId(state, index)
  return undefined
}

function hydrateState(adapter, definition, state) {
  const snapshot = adapter.snapshot(state)
  return measured(() => {
    for (let op = 0; op < definition.ops; op++) adapter.hydrate(snapshot)
    return definition.ops
  })
}

function createBenchmark(adapter, definition) {
  if (definition.name === 'create / empty list')
    return measured(() => {
      for (let op = 0; op < definition.ops; op++) adapter.empty()
      return definition.ops
    })

  if (definition.name === 'create / hydrate tombstoned snapshot')
    return hydrateState(
      adapter,
      definition,
      createTombstonedState(adapter, definition.n, 0.5)
    )

  return hydrateState(adapter, definition, adapter.create(definition.n))
}

function readBenchmark(adapter, definition) {
  const sparse = definition.name.includes('sparse')
  const state = sparse
    ? createSparseState(adapter, definition.n, 0.7)
    : adapter.create(definition.n)
  const size = adapter.size(state)

  if (definition.name.includes('full iteration'))
    return measured(() => {
      for (let op = 0; op < definition.ops; op++) adapter.ids(state)
      return definition.ops
    })

  if (definition.name.includes('collect visible values'))
    return measured(() => {
      for (let op = 0; op < definition.ops; op++) Array.from(adapter.ids(state))
      return definition.ops
    })

  if (definition.name.includes('sequential')) {
    const position = positionFromName(definition.name)
    const start = safeIndex(adapter, state, position)
    return measured(() => readSequential(adapter, state, start, definition.ops))
  }

  if (definition.name.includes('random')) {
    const rand = random(0x2211)
    return measured(() => {
      for (let op = 0; op < definition.ops; op++)
        adapter.readId(state, Math.floor(rand() * size))
      return definition.ops
    })
  }

  const index = safeIndex(adapter, state, positionFromName(definition.name))
  return measured(() => {
    for (let op = 0; op < definition.ops; op++) adapter.readId(state, index)
    return definition.ops
  })
}

function findBenchmark(adapter, definition) {
  const state = adapter.create(definition.n)
  const position = positionFromName(definition.name)
  const target =
    definition.name === 'find / missing value'
      ? 'missing'
      : adapter.readId(state, safeIndex(adapter, state, position))

  return measured(() => {
    for (let op = 0; op < definition.ops; op++) findById(adapter, state, target)
    return definition.ops
  })
}

function insertByName(adapter, state, name, values, op = 0) {
  if (name.includes('alternating'))
    return op % 2 === 0
      ? adapter.prepend(state, values)
      : adapter.append(state, values)

  const position = positionFromName(name)
  if (name.includes('prepend') || name.includes('before head'))
    return adapter.prepend(state, values)
  if (name.includes('append') || name.includes('after tail'))
    return adapter.append(state, values)

  const index = name.includes('before tail')
    ? Math.max(0, adapter.size(state) - 1)
    : safeInsertIndex(adapter, state, position, 0x3300 + op)
  if (name.includes('after')) {
    const afterIndex = Math.min(Math.max(0, index), adapter.size(state) - 1)
    return adapter.insertAfter(state, afterIndex, values)
  }
  return adapter.insertBefore(state, index, values)
}

function insertBenchmark(adapter, definition) {
  const batch = definition.name.includes('batch')
  const amount = batch ? BATCH_SIZE : 1
  let state = adapter.create(definition.n)

  if (definition.name.includes('deleted tail'))
    state = adapter.deleteAt(state, adapter.size(state) - 1)
  if (definition.name.includes('deleted head'))
    state = adapter.deleteAt(state, 0)
  if (definition.name.includes('garbage collection')) {
    state = createTombstonedState(adapter, definition.n, 0.25)
    maybeGarbageCollect(adapter, state)
  }

  return measured(() => {
    for (let op = 0; op < definition.ops; op++) {
      const values = createValues(definition.n + op * amount, amount)
      state = insertByName(adapter, state, definition.name, values, op)
    }
    return definition.ops * amount
  })
}

function overwriteBenchmark(adapter, definition) {
  let state = adapter.create(definition.n)
  if (definition.name.includes('after insert'))
    state = adapter.insertBefore(state, Math.floor(definition.n / 2), [-1])
  if (definition.name.includes('after delete'))
    state = adapter.deleteAt(state, Math.floor(definition.n / 2))

  const fixed = safeIndex(adapter, state, positionFromName(definition.name))
  const rand = random(0x4400)

  return measured(() => {
    for (let op = 0; op < definition.ops; op++) {
      const randomIndex = Math.floor(rand() * adapter.size(state))
      const index =
        definition.name.includes('random') && !definition.name.includes('same')
          ? randomIndex
          : Math.min(fixed, adapter.size(state) - 1)
      state = adapter.overwrite(state, index, [`overwrite:${op}`])
    }
    return definition.ops
  })
}

function duplicateDeleteBenchmark(adapter, definition) {
  const source = adapter.create(definition.n)
  let target = adapter.hydrate(adapter.snapshot(source))
  const index = safeIndex(adapter, source, positionFromName(definition.name))
  const result = adapter.change(source, { type: 'delete', index })
  target = adapter.merge(target, result.artifact)

  const duplicate = measured(() => {
    for (let op = 0; op < definition.ops; op++)
      target = adapter.merge(target, result.artifact)
    return definition.ops
  })
  return visibleConvergence(duplicate, adapter, result.state, target)
}

function deleteAllFromMiddle(adapter, state) {
  let removed = 0
  while (adapter.size(state) > 0) {
    state = adapter.deleteAt(state, Math.floor(adapter.size(state) / 2))
    removed++
  }
  return removed
}

function deleteBenchmark(adapter, definition) {
  if (definition.name.includes('already deleted'))
    return duplicateDeleteBenchmark(adapter, definition)

  let state = adapter.create(definition.n)
  const position = positionFromName(definition.name)

  if (definition.name.includes('all entries from middle outward'))
    return measured(() => deleteAllFromMiddle(adapter, state))

  if (definition.name.includes('all entries in random order')) {
    const order = shuffledIndices(definition.n, 0x5500)
    return measured(() => {
      for (const id of order) {
        const index = findIndexById(adapter, state, id)
        if (index >= 0) state = adapter.deleteAt(state, index)
      }
      return order.length
    })
  }

  if (definition.name.includes('all entries')) {
    return measured(() => {
      let removed = 0
      while (adapter.size(state) > 0) {
        const index = position === 'tail' ? adapter.size(state) - 1 : 0
        state = adapter.deleteAt(state, index)
        removed++
      }
      return removed
    })
  }

  if (definition.name.includes('every other')) {
    return measured(() => {
      let removed = 0
      for (let index = adapter.size(state) - 1; index >= 0; index -= 2) {
        state = adapter.deleteAt(state, index)
        removed++
      }
      return removed
    })
  }

  const range = definition.name.includes('range') ? BATCH_SIZE : 1
  return measured(() => {
    let removed = 0
    for (let op = 0; op < definition.ops && adapter.size(state) > 0; op++) {
      const index = Math.min(
        safeIndex(adapter, state, position, 0x5600 + op),
        Math.max(0, adapter.size(state) - range)
      )
      const count = Math.min(range, adapter.size(state) - index)
      state = adapter.deleteRange(state, index, count)
      removed += count
    }
    return removed
  })
}

function mixedBenchmark(adapter, definition) {
  let state = adapter.create(definition.n)
  const position = positionFromName(definition.name)
  const operations = ['insert', 'overwrite', 'delete', 'insert', 'overwrite']

  return measured(() => {
    for (let op = 0; op < definition.ops; op++) {
      const kind = operations[op % operations.length]
      const current = operation(
        kind,
        position,
        `mixed:${op}`,
        adapter.size(state)
      )
      state = applyLocal(adapter, state, current)
    }
    return definition.ops
  })
}

export function runCrud(adapter, definition) {
  if (definition.name.startsWith('create /'))
    return createBenchmark(adapter, definition)
  if (definition.name.startsWith('read /'))
    return readBenchmark(adapter, definition)
  if (definition.name.startsWith('find /'))
    return findBenchmark(adapter, definition)
  if (
    definition.name.startsWith('append /') ||
    definition.name.startsWith('prepend /') ||
    definition.name.startsWith('insert /')
  )
    return insertBenchmark(adapter, definition)
  if (definition.name.startsWith('overwrite /'))
    return overwriteBenchmark(adapter, definition)
  if (definition.name.startsWith('delete /'))
    return deleteBenchmark(adapter, definition)
  if (definition.name.startsWith('mixed /'))
    return mixedBenchmark(adapter, definition)
  throw new Error(`Unhandled crud benchmark: ${definition.name}`)
}
