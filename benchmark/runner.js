import { adapters } from './adapters/index.js'
import { runClass } from './scenarios/class.js'
import { runCrud } from './scenarios/crud.js'
import { runLatency } from './scenarios/latency.js'
import { runMags } from './scenarios/mags.js'
import { runWorkload } from './scenarios/workload.js'

const runners = {
  class: runClass,
  crud: runCrud,
  latency: runLatency,
  mags: runMags,
  workload: runWorkload,
}

export function runBenchmark(library, definition) {
  const adapter = adapters.get(library)
  const runner = runners[definition.group]
  if (!adapter) throw new Error(`Unknown benchmark library: ${library}`)
  if (!runner) throw new Error(`Unknown benchmark group: ${definition.group}`)
  return runner(adapter, definition)
}
