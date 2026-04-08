import {
  CRList,
  __acknowledge,
  __create,
  __delete,
  __garbageCollect,
  __merge,
  __read,
  __snapshot,
  __update,
} from '../dist/index.js'
import { v7 as uuidv7 } from 'uuid'

const RUN_TIMES = 250
const LIST_SIZE = 5_000

const BENCHMARKS = [
  {
    group: 'crud',
    name: 'create / hydrate snapshot',
    n: LIST_SIZE,
    ops: RUN_TIMES,
  },
  {
    group: 'crud',
    name: 'read / random indexed reads',
    n: LIST_SIZE,
    ops: RUN_TIMES,
  },
  {
    group: 'crud',
    name: 'update / append after tail',
    n: LIST_SIZE,
    ops: RUN_TIMES,
  },
  {
    group: 'crud',
    name: 'update / insert before middle',
    n: LIST_SIZE,
    ops: RUN_TIMES,
  },
  {
    group: 'crud',
    name: 'update / overwrite random',
    n: LIST_SIZE,
    ops: RUN_TIMES,
  },
  {
    group: 'crud',
    name: 'delete / single deletes from middle',
    n: LIST_SIZE,
    ops: RUN_TIMES,
  },
  {
    group: 'crud',
    name: 'delete / range deletes',
    n: LIST_SIZE,
    ops: RUN_TIMES,
  },
  { group: 'mags', name: 'snapshot', n: LIST_SIZE, ops: RUN_TIMES },
  { group: 'mags', name: 'acknowledge', n: LIST_SIZE, ops: RUN_TIMES },
  { group: 'mags', name: 'garbage collect', n: LIST_SIZE, ops: RUN_TIMES },
  { group: 'mags', name: 'merge ordered deltas', n: LIST_SIZE, ops: RUN_TIMES },
  {
    group: 'mags',
    name: 'merge shuffled gossip',
    n: LIST_SIZE,
    ops: RUN_TIMES,
  },
  { group: 'class', name: 'append after tail', n: LIST_SIZE, ops: RUN_TIMES },
  {
    group: 'class',
    name: 'prepend before middle',
    n: LIST_SIZE,
    ops: RUN_TIMES,
  },
  {
    group: 'class',
    name: 'remove from middle',
    n: LIST_SIZE,
    ops: RUN_TIMES,
  },
  { group: 'class', name: 'snapshot', n: LIST_SIZE, ops: RUN_TIMES },
  { group: 'class', name: 'acknowledge', n: LIST_SIZE, ops: RUN_TIMES },
  { group: 'class', name: 'garbage collect', n: LIST_SIZE, ops: RUN_TIMES },
  {
    group: 'class',
    name: 'merge ordered deltas',
    n: LIST_SIZE,
    ops: RUN_TIMES,
  },
  {
    group: 'class',
    name: 'merge shuffled gossip',
    n: LIST_SIZE,
    ops: RUN_TIMES,
  },
]

function value(id) {
  return { id, payload: { text: `value:${id}`, number: id } }
}

function random(seed) {
  let state = seed >>> 0
  return () => {
    state = (Math.imul(state, 1_664_525) + 1_013_904_223) >>> 0
    return state / 0x1_0000_0000
  }
}

function shuffledIndices(length, seed) {
  const indices = Array.from({ length }, (_, index) => index)
  const rand = random(seed)
  for (let index = indices.length - 1; index > 0; index--) {
    const nextIndex = Math.floor(rand() * (index + 1))
    ;[indices[index], indices[nextIndex]] = [indices[nextIndex], indices[index]]
  }
  return indices
}

function createSeededReplica(size) {
  const replica = __create()
  for (let index = 0; index < size; index++) {
    const result = __update(replica.size, [value(index)], replica, 'after')
    if (!result) throw new Error(`seed update failed at ${index}`)
  }
  return replica
}

function createSeededList(size) {
  const list = new CRList()
  for (let index = 0; index < size; index++) {
    list.append(value(index))
  }
  return list
}

function createSnapshot(size) {
  return __snapshot(createSeededReplica(size))
}

function collectAppendDeltas(source, amount, offset) {
  const deltas = []
  for (let index = 0; index < amount; index++) {
    const result = __update(
      source.size,
      [value(offset + index)],
      source,
      'after'
    )
    if (!result) throw new Error(`append delta failed at ${index}`)
    deltas.push(result.delta)
  }
  return deltas
}

function collectMixedDeltas(source, amount, offset) {
  const deltas = []
  const rand = random(0xc0ffee)
  for (let index = 0; index < amount; index++) {
    if (index % 4 === 0 && source.size > 0) {
      const deleteIndex = Math.floor(rand() * source.size)
      const result = __delete(source, deleteIndex, deleteIndex + 1)
      if (result) deltas.push(result.delta)
      continue
    }

    const insertAt = Math.floor(rand() * (source.size + 1))
    const mode =
      insertAt === source.size || index % 2 === 0 ? 'after' : 'before'
    const listIndex =
      mode === 'after' ? insertAt : Math.min(insertAt, source.size - 1)
    const result = __update(listIndex, [value(offset + index)], source, mode)
    if (result) deltas.push(result.delta)
  }
  return deltas
}

function collectClassAppendDeltas(source, amount, offset) {
  const deltas = []
  source.addEventListener('delta', (event) => {
    deltas.push(event.detail)
  })
  for (let index = 0; index < amount; index++) {
    source.append(value(offset + index))
  }
  return deltas
}

function collectClassMixedDeltas(source, amount, offset) {
  const deltas = []
  const rand = random(0xc0ffee)
  source.addEventListener('delta', (event) => {
    deltas.push(event.detail)
  })
  for (let index = 0; index < amount; index++) {
    if (index % 4 === 0 && source.size > 0) {
      source.remove(Math.floor(rand() * source.size))
      continue
    }

    if (source.size === 0 || rand() < 0.5) {
      source.append(value(offset + index), source.size)
      continue
    }

    source.prepend(
      value(offset + index),
      Math.floor(rand() * Math.max(source.size, 1))
    )
  }
  return deltas
}

function createTombstoneIds(size) {
  return Array.from({ length: size }, () => uuidv7())
}

function time(fn) {
  const start = process.hrtime.bigint()
  const ops = fn()
  const end = process.hrtime.bigint()
  return { ms: Number(end - start) / 1_000_000, ops }
}

function runBenchmark(definition) {
  switch (`${definition.group}:${definition.name}`) {
    case 'crud:create / hydrate snapshot': {
      const snapshot = createSnapshot(definition.n)
      return time(() => {
        for (let index = 0; index < definition.ops; index++) __create(snapshot)
        return definition.ops
      })
    }
    case 'crud:read / random indexed reads': {
      const replica = createSeededReplica(definition.n)
      const rand = random(0x1234)
      return time(() => {
        for (let index = 0; index < definition.ops; index++) {
          __read(Math.floor(rand() * replica.size), replica)
        }
        return definition.ops
      })
    }
    case 'crud:update / append after tail': {
      const replica = createSeededReplica(definition.n)
      return time(() => {
        for (let index = 0; index < definition.ops; index++) {
          __update(
            replica.size,
            [value(definition.n + index)],
            replica,
            'after'
          )
        }
        return definition.ops
      })
    }
    case 'crud:update / insert before middle': {
      const replica = createSeededReplica(definition.n)
      return time(() => {
        for (let index = 0; index < definition.ops; index++) {
          __update(
            Math.floor(replica.size / 2),
            [value(definition.n + index)],
            replica,
            'before'
          )
        }
        return definition.ops
      })
    }
    case 'crud:update / overwrite random': {
      const replica = createSeededReplica(definition.n)
      const rand = random(0x5678)
      return time(() => {
        for (let index = 0; index < definition.ops; index++) {
          __update(
            Math.floor(rand() * replica.size),
            [value(definition.n + index)],
            replica,
            'overwrite'
          )
        }
        return definition.ops
      })
    }
    case 'crud:delete / single deletes from middle': {
      const replica = createSeededReplica(definition.n)
      return time(() => {
        let deleted = 0
        while (deleted < definition.ops && replica.size > 0) {
          const index = Math.floor(replica.size / 2)
          __delete(replica, index, index + 1)
          deleted++
        }
        return deleted
      })
    }
    case 'crud:delete / range deletes': {
      const replica = createSeededReplica(definition.n)
      return time(() => {
        let deletedRanges = 0
        while (deletedRanges < definition.ops && replica.size > 0) {
          const start = Math.floor(replica.size / 3)
          const end = Math.min(replica.size, start + 8)
          __delete(replica, start, end)
          deletedRanges++
        }
        return deletedRanges
      })
    }
    case 'mags:snapshot': {
      const replica = createSeededReplica(definition.n)
      return time(() => {
        for (let index = 0; index < definition.ops; index++) __snapshot(replica)
        return definition.ops
      })
    }
    case 'mags:acknowledge': {
      const replica = __create({
        values: [],
        tombstones: createTombstoneIds(definition.n),
      })
      return time(() => {
        for (let index = 0; index < definition.ops; index++) {
          __acknowledge(replica)
        }
        return definition.ops
      })
    }
    case 'mags:garbage collect': {
      const tombstones = createTombstoneIds(definition.n)
      const frontier = tombstones[tombstones.length - 1]
      const replicas = Array.from({ length: definition.ops }, () =>
        __create({ values: [], tombstones })
      )
      return time(() => {
        for (const replica of replicas) __garbageCollect([frontier], replica)
        return definition.ops
      })
    }
    case 'mags:merge ordered deltas': {
      const source = createSeededReplica(definition.n)
      const target = createSeededReplica(definition.n)
      const deltas = collectAppendDeltas(source, definition.ops, definition.n)
      return time(() => {
        for (const delta of deltas) __merge(target, delta)
        return deltas.length
      })
    }
    case 'mags:merge shuffled gossip': {
      const source = createSeededReplica(definition.n)
      const target = createSeededReplica(definition.n)
      const deltas = collectMixedDeltas(source, definition.ops, definition.n)
      const order = shuffledIndices(deltas.length, 0xbeef)
      return time(() => {
        for (const index of order) __merge(target, deltas[index])
        return order.length
      })
    }
    case 'class:append after tail': {
      const list = createSeededList(definition.n)
      return time(() => {
        for (let index = 0; index < definition.ops; index++) {
          list.append(value(definition.n + index))
        }
        return definition.ops
      })
    }
    case 'class:prepend before middle': {
      const list = createSeededList(definition.n)
      return time(() => {
        for (let index = 0; index < definition.ops; index++) {
          list.prepend(value(definition.n + index), Math.floor(list.size / 2))
        }
        return definition.ops
      })
    }
    case 'class:remove from middle': {
      const list = createSeededList(definition.n)
      return time(() => {
        let removed = 0
        while (removed < definition.ops && list.size > 0) {
          list.remove(Math.floor(list.size / 2))
          removed++
        }
        return removed
      })
    }
    case 'class:snapshot': {
      const list = createSeededList(definition.n)
      return time(() => {
        for (let index = 0; index < definition.ops; index++) list.snapshot()
        return definition.ops
      })
    }
    case 'class:acknowledge': {
      const list = new CRList({
        values: [],
        tombstones: createTombstoneIds(definition.n),
      })
      return time(() => {
        for (let index = 0; index < definition.ops; index++) {
          list.acknowledge()
        }
        return definition.ops
      })
    }
    case 'class:garbage collect': {
      const tombstones = createTombstoneIds(definition.n)
      const frontier = tombstones[tombstones.length - 1]
      const lists = Array.from(
        { length: definition.ops },
        () => new CRList({ values: [], tombstones })
      )
      return time(() => {
        for (const list of lists) list.garbageCollect([frontier])
        return definition.ops
      })
    }
    case 'class:merge ordered deltas': {
      const source = createSeededList(definition.n)
      const target = createSeededList(definition.n)
      const deltas = collectClassAppendDeltas(
        source,
        definition.ops,
        definition.n
      )
      return time(() => {
        for (const delta of deltas) target.merge(delta)
        return deltas.length
      })
    }
    case 'class:merge shuffled gossip': {
      const source = createSeededList(definition.n)
      const target = createSeededList(definition.n)
      const deltas = collectClassMixedDeltas(
        source,
        definition.ops,
        definition.n
      )
      const order = shuffledIndices(deltas.length, 0xbeef)
      return time(() => {
        for (const index of order) target.merge(deltas[index])
        return order.length
      })
    }
    default:
      throw new Error(
        `unknown benchmark: ${definition.group}:${definition.name}`
      )
  }
}

function formatNumber(number) {
  return new Intl.NumberFormat('en-US', { maximumFractionDigits: 2 }).format(
    number
  )
}

function pad(value, width) {
  return String(value).padEnd(width, ' ')
}

function printTable(rows) {
  const columns = [
    ['group', (row) => row.group],
    ['scenario', (row) => row.name],
    ['n', (row) => formatNumber(row.n)],
    ['ops', (row) => formatNumber(row.ops)],
    ['ms', (row) => formatNumber(row.ms)],
    ['ms/op', (row) => formatNumber(row.msPerOp)],
    ['ops/sec', (row) => formatNumber(row.opsPerSecond)],
  ]
  const widths = columns.map(([header, getter]) =>
    Math.max(header.length, ...rows.map((row) => getter(row).length))
  )
  console.log(
    columns.map(([header], index) => pad(header, widths[index])).join('  ')
  )
  console.log(widths.map((width) => '-'.repeat(width)).join('  '))
  for (const row of rows) {
    console.log(
      columns
        .map(([, getter], index) => pad(getter(row), widths[index]))
        .join('  ')
    )
  }
}

const rows = BENCHMARKS.map((definition) => {
  const result = runBenchmark(definition)
  return {
    ...definition,
    ops: result.ops,
    ms: result.ms,
    msPerOp: result.ms / result.ops,
    opsPerSecond: result.ops / (result.ms / 1_000),
  }
})

console.log('CRList benchmark')
console.log(
  `node=${process.version} platform=${process.platform} arch=${process.arch}`
)
console.log('')
printTable(rows)
