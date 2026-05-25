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
      throw new Error(
        message || `expected ${actualJson} to equal ${expectedJson}`
      )
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
      for (const v of cursor.values) view.push(v)
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

  function assertReplicaLiveViewEqual(actualReplica, expectedReplica, message) {
    assertJsonEqual(
      liveView(actualReplica),
      liveView(expectedReplica),
      message || 'replica live view mismatch'
    )
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

  function assertDeltaIncludesValueIds(delta, expected) {
    const actual = new Set(
      (delta.values ?? []).flatMap((entry) =>
        (entry.values ?? []).map((v) => v?.id)
      )
    )
    for (const id of expected) {
      assert(actual.has(id), `delta missing value id ${id}`)
    }
  }

  function assertDeltaTombstoneCount(delta, expected) {
    assertEqual(
      delta.tombstones?.length ?? 0,
      expected,
      'delta tombstone count mismatch'
    )
  }

  function applyUpdate(replica, index, id, mode) {
    const result = api.__update(index, [value(id)], replica, mode)
    assert(result, `update returned false for ${mode}:${index}:${id}`)
    return result
  }

  function applyUpdateValues(replica, index, ids, mode) {
    const result = api.__update(
      index,
      ids.map((id) => value(id)),
      replica,
      mode
    )
    assert(
      result,
      `update returned false for ${mode}:${index}:${JSON.stringify(ids)}`
    )
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
    const r0 = replicas[0]
    for (let index = 1; index < replicas.length; index++) {
      const r1 = replicas[index]
      assertEqual(r1.size, r0.size, `replica ${index} diverged: size ${r1.size} !== ${r0.size}`)
      for (let i = 0; i < r0.size; i++) {
        assertJsonEqual(
          api.__read(i, r1),
          api.__read(i, r0),
          `replica ${index} diverged at index ${i}`
        )
      }
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
          console.log(
            `${label}: replay order=${orderIndex} delta=${deltaIndex}`
          )
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
    const rand = random(0xc0ffee)
    let serial = 0

    for (let round = 0; round < rounds; round++) {
      for (
        let replicaIndex = 0;
        replicaIndex < replicas.length;
        replicaIndex++
      ) {
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
        const deleteLength =
          1 + Math.floor(rand() * Math.min(3, replica.size - start))
        deltas.push(applyDelete(replica, start, start + deleteLength).delta)
      }
    }

    return deltas
  }

  function collectAggressiveScenarioDeltas(replicas, rounds, seed) {
    const deltas = []
    const rand = random(seed)
    let serial = 0

    for (let round = 0; round < rounds; round++) {
      for (
        let replicaIndex = 0;
        replicaIndex < replicas.length;
        replicaIndex++
      ) {
        let replica = replicas[replicaIndex]
        const width = 1 + Math.floor(rand() * 3)
        const ids = Array.from({ length: width }, () => {
          const id = `aggr-${seed}-${replicaIndex}-${round}-${serial}`
          serial++
          return id
        })
        const roll = rand()

        if (replica.size === 0 || roll < 0.35) {
          const mode =
            replica.size === 0
              ? rand() < 0.5
                ? 'after'
                : 'overwrite'
              : rand() < 0.5
                ? 'after'
                : 'before'
          const index =
            replica.size === 0
              ? 0
              : mode === 'after'
                ? Math.floor(rand() * (replica.size + 1))
                : Math.floor(rand() * replica.size)
          deltas.push(applyUpdateValues(replica, index, ids, mode).delta)
        } else if (roll < 0.7) {
          const index =
            replica.size === 0 ? 0 : Math.floor(rand() * (replica.size + 1))
          deltas.push(applyUpdateValues(replica, index, ids, 'overwrite').delta)
        } else {
          const start = Math.floor(rand() * replica.size)
          const deleteLength =
            1 + Math.floor(rand() * Math.min(3, replica.size - start))
          deltas.push(applyDelete(replica, start, start + deleteLength).delta)
        }

        if (rand() < 0.2) {
          replica = api.__create(api.__snapshot(replica))
          replicas[replicaIndex] = replica
        }
      }
    }

    const sampleSnapshot = api.__snapshot(replicas[0])
    const sampleValue = sampleSnapshot.values[0]
    deltas.push(undefined)
    deltas.push(false)
    deltas.push([])
    deltas.push({ tombstones: ['not-a-bigint'] })
    deltas.push({ values: 'not-an-array' })
    if (sampleValue) {
      deltas.push({
        values: [{ ...sampleValue, id: 'not-a-bigint' }],
      })
      deltas.push({
        values: [{ ...sampleValue, predecessor: 'not-a-bigint' }],
      })
    }

    return deltas
  }

  await runTest('exports shape', () => {
    for (const name of [
      'CRList',
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

  await runTest('class find matches index-order live values', () => {
    const list = new api.CRList()

    list.append([value('a')])
    list.append([value('b')])
    list.append([value('c')])

    const found = list.find(
      function (entry, index, target) {
        assertEqual(this.marker, true, 'find thisArg mismatch')
        assertEqual(target, list, 'find target mismatch')
        return index === 1 && entry.id === 'b'
      },
      { marker: true }
    )

    assertEqual(found?.id, 'b', 'find returned wrong value')
    found.id = 'mutated'
    assertEqual(list[1].id, 'mutated', 'find should expose live value state')
    assertEqual(
      list.find((entry) => entry.id === 'missing'),
      undefined,
      'missing find result should be undefined'
    )
    assertEqual(
      new api.CRList().find(() => true),
      undefined,
      'empty find result should be undefined'
    )
  })

  await runTest('crud live view and local delta semantics', () => {
    const replica = api.__create()

    assertDeltaIncludesValueIds(applyUpdate(replica, 0, 'a', 'after').delta, [
      'a',
    ])
    assertLiveIds(replica, ['a'])

    assertDeltaIncludesValueIds(applyUpdate(replica, 0, 'b', 'after').delta, [
      'b',
    ])
    assertLiveIds(replica, ['a', 'b'])

    assertDeltaIncludesValueIds(applyUpdate(replica, 0, 'c', 'before').delta, [
      'c',
    ])
    assertLiveIds(replica, ['c', 'a', 'b'])

    const overwriteDelta = applyUpdate(replica, 1, 'd', 'overwrite')
    assertDeltaIncludesValueIds(overwriteDelta.delta, ['d'])
    assertDeltaTombstoneCount(overwriteDelta.delta, 1)
    assertLiveIds(replica, ['c', 'd', 'b'])

    assertDeltaTombstoneCount(applyDelete(replica, 1, 3).delta, 2)
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

    assertJsonEqual(
      liveIds(rebuilt),
      liveIds(replica),
      'snapshot order changed live view'
    )
  })

  await runTest(
    'deleted predecessor successor re-anchor survives shuffled gossip and snapshots',
    () => {
      const source = seededReplica(4)
      const target = cloneReplica(source)

      const insertAnchor = applyUpdate(source, 1, 'anchor', 'after').delta
      const insertDeleted = applyUpdate(
        source,
        2,
        'deleted-parent',
        'after'
      ).delta
      const deleteInserted = applyDelete(source, 3, 4).delta

      for (const delta of [insertDeleted, deleteInserted, insertAnchor]) {
        api.__merge(target, delta)
      }

      assertReplicaLiveViewEqual(
        target,
        source,
        'shuffled re-anchor delivery diverged'
      )
      assertReplicaLiveViewEqual(
        api.__create(api.__snapshot(source)),
        source,
        'snapshot hydrate lost tombstoned predecessor successor order'
      )
      assertReplicaLiveViewEqual(
        api.__create({
          values: shuffled(api.__snapshot(source).values, 91),
          tombstones: shuffled(api.__snapshot(source).tombstones, 92),
        }),
        source,
        'shuffled snapshot hydrate lost re-anchor order'
      )
    }
  )

  await runTest(
    'merge is idempotent for duplicate insert and delete deltas',
    () => {
      const source = api.__create()
      const target = api.__create()

      const insert = applyUpdate(source, 0, 'inserted', 'after').delta
      assertChangeIds(api.__merge(target, insert), { 0: 'inserted' })
      assertEqual(
        api.__merge(target, insert),
        false,
        'duplicate insert changed target'
      )
      assertLiveIds(target, ['inserted'])

      const remove = applyDelete(source, 0, 1).delta
      assertChangeIds(api.__merge(target, remove), { 0: undefined })
      assertEqual(
        api.__merge(target, remove),
        false,
        'duplicate delete changed target'
      )
      assertLiveIds(target, [])
    }
  )

  await runTest(
    'garbage collect with complete frontier set converges after recovery',
    () => {
      const replicaIds = ['replica-a', 'replica-b', 'replica-c']
      const base = seededReplica(6)
      const replicas = Array.from({ length: replicaIds.length }, () =>
        cloneReplica(base)
      )
      const ackMaps = replicaIds.map(() => new Map())

      const publishAck = (sourceIndex, targetIndexes) => {
        const ack = api.__acknowledge(replicas[sourceIndex])
        if (typeof ack !== 'string') return
        for (const targetIndex of targetIndexes) {
          ackMaps[targetIndex].set(replicaIds[sourceIndex], ack)
        }
      }

      const gcReplica = (index) => {
        api.__garbageCollect(
          [...ackMaps[index].values()].filter(
            (frontier) => typeof frontier === 'string'
          ),
          replicas[index]
        )
      }

      const warmupDelete = applyDelete(replicas[0], 0, 1).delta
      api.__merge(replicas[1], warmupDelete)
      api.__merge(replicas[2], warmupDelete)

      publishAck(0, [0, 1, 2])
      publishAck(1, [0, 1, 2])
      publishAck(2, [0, 1, 2])

      const onlineDelete = applyDelete(replicas[0], 1, 3).delta
      const onlineInsert = applyUpdateValues(
        replicas[0],
        1,
        ['offline-a', 'offline-b', 'offline-c'],
        'before'
      ).delta
      const onlineOverwrite = applyUpdateValues(
        replicas[0],
        replicas[0].size,
        ['offline-tail'],
        'overwrite'
      ).delta

      for (const delta of [onlineDelete, onlineInsert, onlineOverwrite]) {
        api.__merge(replicas[1], delta)
      }

      for (const delta of [onlineDelete, onlineInsert, onlineOverwrite]) {
        api.__merge(replicas[2], delta)
      }

      for (let index = 0; index < replicas.length; index++) {
        publishAck(index, [0, 1, 2])
      }

      const tombstonesBeforeFinalGc = replicas.map(
        (replica) => replica.tombstones.size
      )
      for (let index = 0; index < replicas.length; index++) {
        gcReplica(index)
      }

      assertReplicasConverged(replicas)
      for (let index = 0; index < replicas.length; index++) {
        assert(
          replicas[index].tombstones.size <= tombstonesBeforeFinalGc[index],
          `gc failed to compact replica ${index}`
        )
        assertReplicaLiveViewEqual(
          api.__create(api.__snapshot(replicas[index])),
          replicas[index],
          `snapshot hydrate diverged after gc for replica ${index}`
        )
      }
    }
  )

  await runTest(
    'partial-frontier garbage collection is caller misuse and does not guarantee convergence',
    () => {
      const replicaIds = ['replica-a', 'replica-b', 'replica-c']
      const base = seededReplica(6)
      const replicas = Array.from({ length: replicaIds.length }, () =>
        cloneReplica(base)
      )
      const ackMaps = replicaIds.map(() => new Map())

      const publishAck = (sourceIndex, targetIndexes) => {
        const ack = api.__acknowledge(replicas[sourceIndex])
        if (typeof ack !== 'string') return
        for (const targetIndex of targetIndexes) {
          ackMaps[targetIndex].set(replicaIds[sourceIndex], ack)
        }
      }

      const gcReplica = (index) => {
        api.__garbageCollect(
          [...ackMaps[index].values()].filter(
            (frontier) => typeof frontier === 'string'
          ),
          replicas[index]
        )
      }

      const warmupDelete = applyDelete(replicas[0], 0, 1).delta
      api.__merge(replicas[1], warmupDelete)
      api.__merge(replicas[2], warmupDelete)

      publishAck(0, [0, 1, 2])
      publishAck(1, [0, 1, 2])
      publishAck(2, [0, 1, 2])
      const stalePeerFrontier = ackMaps[0].get(replicaIds[2])

      const onlineDelete = applyDelete(replicas[0], 1, 3).delta
      const onlineInsert = applyUpdateValues(
        replicas[0],
        1,
        ['offline-a', 'offline-b', 'offline-c'],
        'before'
      ).delta
      const onlineOverwrite = applyUpdateValues(
        replicas[0],
        replicas[0].size,
        ['offline-tail'],
        'overwrite'
      ).delta

      for (const delta of [onlineDelete, onlineInsert, onlineOverwrite]) {
        api.__merge(replicas[1], delta)
      }

      publishAck(0, [0, 1])
      publishAck(1, [0, 1])
      assertEqual(
        ackMaps[0].get(replicaIds[2]),
        stalePeerFrontier,
        'replica 2 frontier unexpectedly advanced'
      )
      assert(
        ackMaps[0].get(replicaIds[0]) !== stalePeerFrontier ||
          ackMaps[0].get(replicaIds[1]) !== stalePeerFrontier,
        'partial-frontier gc did not retain a stale peer frontier'
      )
      gcReplica(0)
      gcReplica(1)

      for (const delta of [onlineDelete, onlineInsert, onlineOverwrite]) {
        try {
          api.__merge(replicas[2], delta)
        } catch {}
      }
    }
  )

  if (includeStress) {
    await runTest(
      'replicas converge after shuffled async delta delivery',
      () => {
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
      }
    )

    await runTest(
      'replicas converge across shuffled delivery with restarts',
      () => {
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
      }
    )

    await runTest(
      'concurrent insert after concurrently deleted predecessor converges',
      () => {
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
      }
    )

    await runTest('100 aggressive deterministic convergence scenarios', () => {
      for (let scenario = 0; scenario < 100; scenario++) {
        const baseSize = scenario % 4
        const replicaCount = 3 + (scenario % 3)
        const rounds = 2 + (scenario % 4)
        const base = seededReplica(baseSize)
        const sources = Array.from({ length: replicaCount }, () =>
          cloneReplica(base)
        )
        const deltas = collectAggressiveScenarioDeltas(
          sources,
          rounds,
          50_000 + scenario
        )
        const targets = Array.from({ length: replicaCount }, () =>
          cloneReplica(base)
        )

        for (let index = 0; index < targets.length; index++) {
          if (scenario % 2 === 0) {
            mergeDeltas(targets[index], deltas, 60_000 + scenario * 10 + index)
          } else {
            targets[index] = mergeDeltasWithRestarts(
              targets[index],
              deltas,
              70_000 + scenario * 10 + index
            )
          }
        }

        assertReplicasConverged(targets)
        for (let index = 0; index < targets.length; index++) {
          assertReplicaLiveViewEqual(
            api.__create(api.__snapshot(targets[index])),
            targets[index],
            `scenario ${scenario} hydrate mismatch on replica ${index}`
          )
        }
      }
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
