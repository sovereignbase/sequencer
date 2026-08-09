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
  const left = api.create(snapshot)
  const right = api.create(snapshot)
  const left_result = api.insert(left, 1, ['left'])
  const right_result = api.insert(right, 1, ['right'])
  require_condition(left_result !== false, 'left update was rejected')
  require_condition(right_result !== false, 'right update was rejected')

  const forward = api.create(snapshot)
  const reverse = api.create(snapshot)
  api.merge(forward, left_result.delta)
  api.merge(forward, right_result.delta)
  api.merge(reverse, right_result.delta)
  api.merge(reverse, left_result.delta)
  const forward_projection = read_projection(forward)
  const reverse_projection = read_projection(reverse)
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
