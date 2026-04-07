const TEST_TIMEOUT_MS = 10_000

export async function runCRListSuite(api, options = {}) {
  const {
    label = 'runtime',
    stressRounds = 24,
    includeStress = false,
    verbose = false,
  } = options
  const results = { label, ok: true, errors: [], tests: [] }

  function assert(condition, message) {
    if (!condition) throw new Error(message || 'assertion failed')
  }

  function assertEqual(actual, expected, message) {
    if (actual !== expected)
      throw new Error(message || `expected ${actual} to equal ${expected}`)
  }

  function assertJsonEqual(actual, expected, message) {
    const actualJson = JSON.stringify(actual)
    const expectedJson = JSON.stringify(expected)
    if (actualJson !== expectedJson)
      throw new Error(message || `expected ${actualJson} to equal ${expectedJson}`)
  }

  async function withTimeout(promise, ms, name) {
    let timer
    const timeout = new Promise((_, reject) => {
      timer = setTimeout(() => {
        reject(new Error(`timeout after ${ms}ms${name ? `: ${name}` : ''}`))
      }, ms)
    })
    return Promise.race([promise.finally(() => clearTimeout(timer)), timeout])
  }

  async function runTest(name, fn) {
    try {
      if (verbose) console.log(`${label}: ${name}`)
      await withTimeout(Promise.resolve().then(fn), TEST_TIMEOUT_MS, name)
      results.tests.push({ name, ok: true })
    } catch (error) {
      results.ok = false
      results.tests.push({ name, ok: false })
      results.errors.push({ name, message: String(error) })
    }
  }

  function value(id) {
    return { id, payload: { text: `value:${id}` } }
  }

  function valueIds(values) {
    return values.map((entry) => entry?.id)
  }

  function liveView(replica) {
    if (replica.size === 0) return []
    if (!replica.cursor) throw new Error('replica has size but no cursor')
    const limit = Math.max(replica.size, replica.parentMap?.size ?? 0) + 10
    const seen = new Set()
    let head = replica.cursor

    for (let step = 0; head.prev; step++) {
      if (step > limit) throw new Error('prev traversal exceeded list limit')
      if (seen.has(head)) throw new Error('cycle detected while finding head')
      seen.add(head)
      head = head.prev
    }

    const view = []
    seen.clear()
    for (let cursor = head, step = 0; cursor; cursor = cursor.next, step++) {
      if (step > limit) throw new Error('next traversal exceeded list limit')
      if (seen.has(cursor)) throw new Error('cycle detected while reading list')
      seen.add(cursor)
      view.push(cursor.value)
    }
    if (view.length !== replica.size)
      throw new Error(
        `live view length ${view.length} did not match size ${replica.size}`
      )
    return view
  }

  function liveIds(replica) {
    return valueIds(liveView(replica))
  }

  function assertLiveIds(replica, expected, message) {
    assertJsonEqual(liveIds(replica), expected, message)
  }

  function assertChangeIds(change, expected) {
    assertJsonEqual(
      Object.keys(change).sort((a, b) => Number(a) - Number(b)),
      Object.keys(expected).sort((a, b) => Number(a) - Number(b)),
      'change keys mismatch'
    )
    for (const [key, expectedValue] of Object.entries(expected)) {
      assert(Object.hasOwn(change, key), `change missing key ${key}`)
      const actualValue = change[key]
      if (expectedValue === undefined) {
        assert(actualValue === undefined, `expected change[${key}] undefined`)
      } else {
        assertEqual(actualValue?.id, expectedValue, `change[${key}] mismatch`)
      }
    }
  }

  function applyUpdate(replica, index, id, mode) {
    const result = api.__update(index, value(id), replica, mode)
    assert(result, `update returned false for ${mode}:${index}:${id}`)
    return result
  }

  function applyDelete(replica, start, end) {
    const result = api.__delete(replica, start, end)
    assert(result, `delete returned false for ${start}:${end}`)
    return result
  }

  function cloneReplica(replica) {
    return api.__create(api.__snapshot(replica))
  }

  function seededReplica(size) {
    const replica = api.__create()
    for (let index = 0; index < size; index++) {
      applyUpdate(replica, replica.size, `base-${index}`, 'after')
    }
    return replica
  }

  function random(seed) {
    let state = seed >>> 0
    return () => {
      state = (Math.imul(state, 1_664_525) + 1_013_904_223) >>> 0
      return state / 0x1_0000_0000
    }
  }

  function shuffled(values, seed) {
    const next = values.slice()
    const rand = random(seed)
    for (let index = next.length - 1; index > 0; index--) {
      const other = Math.floor(rand() * (index + 1))
      ;[next[index], next[other]] = [next[other], next[index]]
    }
    return next
  }

  function shuffledIndices(length, seed) {
    return shuffled(
      Array.from({ length }, (_, index) => index),
      seed
    )
  }

  function assertReplicasConverged(replicas) {
    const expected = liveIds(replicas[0])
    for (let index = 1; index < replicas.length; index++) {
      assertJsonEqual(
        liveIds(replicas[index]),
        expected,
        `replica ${index} diverged`
      )
    }
  }

  function mergeDeltas(replica, deltas, seed, options = {}) {
    const { label = 'merge', verboseMerges = false } = options
    const order = shuffledIndices(deltas.length, seed)
    for (let orderIndex = 0; orderIndex < order.length; orderIndex++) {
      const deltaIndex = order[orderIndex]
      if (verboseMerges)
        console.log(`${label}: merge order=${orderIndex} delta=${deltaIndex}`)
      api.__merge(replica, deltas[deltaIndex])
      if (deltaIndex % 3 === 0) {
        if (verboseMerges)
          console.log(`${label}: replay order=${orderIndex} delta=${deltaIndex}`)
        api.__merge(replica, deltas[deltaIndex])
      }
    }
  }

  function mergeDeltasWithRestarts(replica, deltas, seed, options = {}) {
    const { label = 'restart-merge', verboseMerges = false } = options
    let current = replica
    const order = shuffledIndices(deltas.length, seed)
    for (let index = 0; index < order.length; index++) {
      const deltaIndex = order[index]
      if (verboseMerges)
        console.log(`${label}: merge order=${index} delta=${deltaIndex}`)
      api.__merge(current, deltas[deltaIndex])
      if (deltaIndex % 3 === 0) {
        if (verboseMerges)
          console.log(`${label}: replay order=${index} delta=${deltaIndex}`)
        api.__merge(current, deltas[deltaIndex])
      }
      if (index % 7 === 0) current = cloneReplica(current)
      if (index % 11 === 0) current = api.__create(api.__snapshot(current))
    }
    return current
  }

  function collectStressDeltas(replicas, rounds) {
    const deltas = []
    const rand = random(0xC0FFEE)
    let serial = 0

    for (let round = 0; round < rounds; round++) {
      for (let replicaIndex = 0; replicaIndex < replicas.length; replicaIndex++) {
        const replica = replicas[replicaIndex]
        const roll = rand()
        const id = `r${replicaIndex}-${round}-${serial++}`

        if (replica.size === 0 || roll < 0.42) {
          const mode = replica.size === 0 || rand() < 0.5 ? 'after' : 'before'
          const index =
            replica.size === 0
              ? 0
              : mode === 'after'
                ? Math.floor(rand() * (replica.size + 1))
                : Math.floor(rand() * replica.size)
          deltas.push(applyUpdate(replica, index, id, mode).delta)
          continue
        }

        if (roll < 0.7) {
          const index = Math.floor(rand() * replica.size)
          deltas.push(applyUpdate(replica, index, id, 'overwrite').delta)
          continue
        }

        const start = Math.floor(rand() * replica.size)
        const deleteLength = 1 + Math.floor(rand() * Math.min(3, replica.size - start))
        deltas.push(applyDelete(replica, start, start + deleteLength).delta)
      }
    }

    return deltas
  }

  await runTest('exports shape', () => {
    for (const name of [
      '__create',
      '__read',
      '__update',
      '__delete',
      '__merge',
      '__snapshot',
      '__acknowledge',
      '__garbageCollect',
    ]) {
      assert(typeof api[name] === 'function', `missing ${name}`)
    }
  })

  await runTest('crud live view and minimum change semantics', () => {
    const replica = api.__create()

    assertChangeIds(applyUpdate(replica, 0, 'a', 'after').change, { 0: 'a' })
    assertLiveIds(replica, ['a'])

    assertChangeIds(applyUpdate(replica, 0, 'b', 'after').change, { 1: 'b' })
    assertLiveIds(replica, ['a', 'b'])

    assertChangeIds(applyUpdate(replica, 0, 'c', 'before').change, { 0: 'c' })
    assertLiveIds(replica, ['c', 'a', 'b'])

    assertChangeIds(applyUpdate(replica, 1, 'd', 'overwrite').change, { 1: 'd' })
    assertLiveIds(replica, ['c', 'd', 'b'])

    assertChangeIds(applyDelete(replica, 1, 3).change, {
      1: undefined,
      2: undefined,
    })
    assertLiveIds(replica, ['c'])
  })

  await runTest('snapshot hydrate is independent of value order', () => {
    const replica = seededReplica(8)
    applyUpdate(replica, 2, 'before-2', 'before')
    applyUpdate(replica, 4, 'after-4', 'after')
    applyUpdate(replica, 3, 'overwrite-3', 'overwrite')

    const snapshot = api.__snapshot(replica)
    const rebuilt = api.__create({
      values: shuffled(snapshot.values, 123),
      tombstones: shuffled(snapshot.tombstones, 456),
    })

    assertJsonEqual(liveIds(rebuilt), liveIds(replica), 'snapshot order changed live view')
  })

  await runTest('merge is idempotent for duplicate insert and delete deltas', () => {
    const source = api.__create()
    const target = api.__create()

    const insert = applyUpdate(source, 0, 'inserted', 'after').delta
    assertChangeIds(api.__merge(target, insert), { 0: 'inserted' })
    assertEqual(api.__merge(target, insert), false, 'duplicate insert changed target')
    assertLiveIds(target, ['inserted'])

    const remove = applyDelete(source, 0, 1).delta
    assertChangeIds(api.__merge(target, remove), { 0: undefined })
    assertEqual(api.__merge(target, remove), false, 'duplicate delete changed target')
    assertLiveIds(target, [])
  })

  if (includeStress) {
    await runTest('replicas converge after shuffled async delta delivery', () => {
      const base = seededReplica(6)
      const replicas = Array.from({ length: 5 }, () => cloneReplica(base))
      const deltas = collectStressDeltas(replicas, stressRounds)

      for (let index = 0; index < replicas.length; index++) {
        mergeDeltas(replicas[index], deltas, 10_000 + index, {
          label: `replica-${index}`,
          verboseMerges: verbose,
        })
      }

      assertReplicasConverged(replicas)
    })

    await runTest('replicas converge across shuffled delivery with restarts', () => {
      const base = seededReplica(6)
      const replicas = Array.from({ length: 5 }, () => cloneReplica(base))
      const deltas = collectStressDeltas(replicas, stressRounds)
      const restartedReplicas = replicas.map((replica, index) =>
        mergeDeltasWithRestarts(replica, deltas, 20_000 + index, {
          label: `restart-replica-${index}`,
          verboseMerges: verbose,
        })
      )

      assertReplicasConverged(restartedReplicas)
    })

    await runTest('concurrent insert after concurrently deleted predecessor converges', () => {
      const base = seededReplica(1)
      const deleteFirst = cloneReplica(base)
      const insertAfterFirst = cloneReplica(base)
      const deleteThenInsert = cloneReplica(base)
      const insertThenDelete = cloneReplica(base)

      const deleteDelta = applyDelete(deleteFirst, 0, 1).delta
      const insertDelta = applyUpdate(
        insertAfterFirst,
        0,
        'after-deleted',
        'after'
      ).delta

      api.__merge(deleteThenInsert, deleteDelta)
      api.__merge(deleteThenInsert, insertDelta)

      api.__merge(insertThenDelete, insertDelta)
      api.__merge(insertThenDelete, deleteDelta)

      assertJsonEqual(
        liveIds(deleteThenInsert),
        liveIds(insertThenDelete),
        'delta order changed live view'
      )
    })
  }

  return results
}

export function printResults(results) {
  const passed = results.tests.filter((test) => test.ok).length
  console.log(`${results.label}: ${passed}/${results.tests.length} passed`)
  if (!results.ok) {
    for (const error of results.errors)
      console.error(`  - ${error.name}: ${error.message}`)
  }
}

export function ensurePassing(results) {
  if (results.ok) return
  throw new Error(
    `${results.label} failed with ${results.errors.length} failing tests`
  )
}
