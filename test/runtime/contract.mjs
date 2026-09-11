/** Exercises the built public API and its native Projector in any ESM runtime. */
export function run_runtime_contract(api) {
  const require_condition = (condition, message) => {
    if (!condition)
      throw new TypeError(`Sequencer runtime contract: ${message}`)
  }
  const read_projection = (state) => api.values(state)

  const state = api.create()
  require_condition(
    api.insert(state, 0, ['alpha', 'beta', 'gamma']) !== false,
    'initial update was rejected'
  )
  require_condition(
    api.remove(state, 1, 2) !== false,
    'soft deletion was rejected'
  )
  require_condition(
    JSON.stringify(read_projection(state)) ===
      JSON.stringify(['alpha', 'gamma']),
    'projection is incorrect after deletion'
  )
  require_condition(
    JSON.stringify(api.recover(state)) ===
      JSON.stringify(['alpha', 'beta', 'gamma']),
    'soft-deleted footage was not retained'
  )

  const base = api.create()
  require_condition(
    api.insert(base, 0, ['base']) !== false,
    'base update was rejected'
  )
  const snapshot = api.snapshot(base)
  const parent_end = [snapshot[0][2], snapshot[0][3], snapshot[0][4] + 1]
  const remote_insert = (realm, value) => [
    [1, 1, realm, 0, 0, ...parent_end, 0xffff_ffff, 0xffff_ffff, 1, 1],
    [value],
  ]
  const left_result = remote_insert((parent_end[0] ^ 1) >>> 0, 'left')
  const right_result = remote_insert((parent_end[0] ^ 2) >>> 0, 'right')

  const forward = api.create(snapshot)
  const reverse = api.create(snapshot)
  api.merge(forward, left_result)
  api.merge(forward, right_result)
  api.merge(reverse, right_result)
  api.merge(reverse, left_result)
  const forward_projection = read_projection(forward)
  const reverse_projection = read_projection(reverse)
  const expected = [
    'base',
    ...(left_result[0][2] > right_result[0][2]
      ? ['left', 'right']
      : ['right', 'left']),
  ]
  require_condition(
    JSON.stringify(forward_projection) === JSON.stringify(expected),
    'remote siblings were lost or ordered incorrectly'
  )
  require_condition(
    JSON.stringify(forward_projection) === JSON.stringify(reverse_projection),
    'opposite delivery orders did not converge'
  )

  const hydrated = api.create(api.snapshot(state))
  require_condition(
    JSON.stringify(read_projection(hydrated)) ===
      JSON.stringify(read_projection(state)),
    'snapshot hydration changed the projection'
  )

  return {
    passed: true,
    assertions: 8,
    projection: read_projection(state),
    converged_projection: forward_projection,
  }
}
