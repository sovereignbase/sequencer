import { crlistAdapter as adapter } from './adapters/crlist.js'
import { createPlan } from './helpers/plan.js'
import { createArtifacts, mergeArtifacts } from './scenarios/shared.js'
import { idsEqual } from './helpers/value.js'

const LIST_SIZE = 5_000
const OPS = 250

function forkedTest(name, leftOpts, rightOpts) {
  const snapshot = adapter.snapshot(adapter.create(LIST_SIZE))
  const leftArtifacts = createArtifacts(adapter, adapter.hydrate(snapshot),
    createPlan(OPS, LIST_SIZE, { idPrefix: 'left', ...leftOpts }))
  const rightArtifacts = createArtifacts(adapter, adapter.hydrate(snapshot),
    createPlan(OPS, LIST_SIZE, { idPrefix: 'right', ...rightOpts }))
  let left = leftArtifacts.state
  let right = rightArtifacts.state
  left = mergeArtifacts(adapter, left, rightArtifacts.artifacts)
  right = mergeArtifacts(adapter, right, leftArtifacts.artifacts)
  let leftIds, rightIds
  try { leftIds = adapter.ids(left) } catch (e) { console.log(`CRASH left: ${e.message}`); return }
  try { rightIds = adapter.ids(right) } catch (e) { console.log(`CRASH right: ${e.message}`); return }
  const converged = idsEqual(leftIds, rightIds)
  console.log(`${converged ? 'PASS' : 'FAIL'}: ${name}`)
  if (!converged) console.log(`  sizes: left=${leftIds.length} right=${rightIds.length}`)
}

forkedTest('latency forked (middle vs tail, mixed)', { mixed: true, position: 'middle' }, { mixed: true, position: 'tail' })
forkedTest('collaborative offline (middle vs tail, mixed)', { mixed: true, position: 'middle' }, { mixed: true, position: 'tail' })
forkedTest('both middle (mixed)', { mixed: true, position: 'middle' }, { mixed: true, position: 'middle' })
forkedTest('both tail (mixed)', { mixed: true, position: 'tail' }, { mixed: true, position: 'tail' })
forkedTest('insert only, middle vs tail', { mixed: false, position: 'middle' }, { mixed: false, position: 'tail' })
forkedTest('insert only, both middle', { mixed: false, position: 'middle' }, { mixed: false, position: 'middle' })
forkedTest('insert only, tail vs middle', { mixed: false, position: 'tail' }, { mixed: false, position: 'middle' })
