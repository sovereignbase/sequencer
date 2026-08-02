/** Exercises the built public API and its native Projector in any ESM runtime. */
export function run_runtime_contract(api) {
  const require_condition = (condition, message) => {
    if (!condition)
      throw new TypeError(`Sequencer runtime contract: ${message}`)
  }
  const read_projection = (state) =>
    Array.from({ length: api.__length(state) }, (_, index) =>
      api.__read(state, index)
    )

  const state = api.__create()
  require_condition(
    api.__update(state, 0, ['alpha', 'beta', 'gamma'], 'after') !== false,
    'initial update was rejected'
  )
  require_condition(
    api.__delete(state, 1, 2) !== false,
    'soft deletion was rejected'
  )
  require_condition(
    JSON.stringify(read_projection(state)) ===
      JSON.stringify(['alpha', 'gamma']),
    'projection is incorrect after deletion'
  )
  require_condition(
    JSON.stringify(api.__recover(state)) ===
      JSON.stringify(['alpha', 'beta', 'gamma']),
    'soft-deleted footage was not retained'
  )

  const base = api.__create()
  require_condition(
    api.__update(base, 0, ['base'], 'after') !== false,
    'base update was rejected'
  )
  const snapshot = api.__snapshot(base)
  const left = api.__create(snapshot)
  const right = api.__create(snapshot)
  const left_result = api.__update(left, 0, ['left'], 'after')
  const right_result = api.__update(right, 0, ['right'], 'after')
  require_condition(left_result !== false, 'left update was rejected')
  require_condition(right_result !== false, 'right update was rejected')

  const forward = api.__create(snapshot)
  const reverse = api.__create(snapshot)
  api.__merge(forward, left_result.reel)
  api.__merge(forward, right_result.reel)
  api.__merge(reverse, right_result.reel)
  api.__merge(reverse, left_result.reel)
  const forward_projection = read_projection(forward)
  const reverse_projection = read_projection(reverse)
  require_condition(
    JSON.stringify(forward_projection) === JSON.stringify(reverse_projection),
    'opposite delivery orders did not converge'
  )

  const hydrated = api.__create(api.__snapshot(state))
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
