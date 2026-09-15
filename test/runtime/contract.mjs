/** Exercises the built public API and native Projector in any ESM runtime. */
export function run_runtime_contract(api) {
  const require_condition = (condition, message) => {
    if (!condition)
      throw new TypeError(`Sequencer runtime contract: ${message}`)
  }
  const state = api.create(1)
  require_condition(
    api.insert(state, 0, ['alpha', 'beta', 'gamma']) !== false,
    'initial insertion was rejected'
  )
  require_condition(
    api.remove(state, 1, 2) !== false,
    'hard deletion was rejected'
  )
  require_condition(
    JSON.stringify(api.values(state)) === JSON.stringify(['alpha', 'gamma']),
    'projection is incorrect after deletion'
  )

  const base = api.create(2)
  require_condition(api.insert(base, 0, ['base']) !== false, 'base rejected')
  const retained = api.snapshot(base)
  const left = api.create(3, retained)
  const right = api.create(4, retained)
  const left_result = api.insert(left, 1, ['left'])
  const right_result = api.insert(right, 1, ['right'])
  require_condition(
    left_result !== false && right_result !== false,
    'branch rejected'
  )

  const forward = api.create(5, retained)
  const reverse = api.create(6, retained)
  api.ingest(forward, left_result)
  api.ingest(forward, right_result)
  api.ingest(reverse, right_result)
  api.ingest(reverse, left_result)
  const forward_projection = api.values(forward)
  require_condition(
    JSON.stringify(forward_projection) === JSON.stringify(api.values(reverse)),
    'opposite delivery orders did not converge'
  )
  require_condition(
    forward_projection[0] === 'base' &&
      forward_projection.slice(1).sort().join(',') === 'left,right',
    'concurrent siblings were lost'
  )

  const hydrated = api.create(7, api.snapshot(state))
  require_condition(
    JSON.stringify(api.values(hydrated)) === JSON.stringify(api.values(state)),
    'snapshot hydration changed the projection'
  )
  return {
    passed: true,
    assertions: 7,
    projection: api.values(state),
    converged_projection: forward_projection,
  }
}
