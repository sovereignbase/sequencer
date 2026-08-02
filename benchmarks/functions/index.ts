import { cpus, platform, arch } from 'node:os'
import { Bench } from 'tinybench'
import * as api from '../../dist/index.js'
import type { Frontier, Reel, Replica } from '../../dist/index.js'

/** Measures every public operation against one documented fixed workload. */
export async function run_function_benchmarks() {
  const frame_count = 256
  const values = Array.from({ length: frame_count }, (_, index) => index)
  const retained_states: Array<Replica<number>> = []
  let result_sink: unknown
  let mutable_state: Replica<number> | undefined
  let garbage_collection_frontiers: Array<Frontier> = []
  let read_index = 0

  const require_result = <T>(result: T | false, operation: string): T => {
    if (result === false)
      throw new TypeError(`Benchmark setup failed for ${operation}.`)
    return result
  }
  const create_state = (): Replica<number> => {
    const state = api.__create<number>()
    require_result(api.__update(state, 0, values, 'after'), '__update')
    return state
  }
  const retain_mutable_state = (): void => {
    if (mutable_state) retained_states.push(mutable_state)
    mutable_state = undefined
  }

  // Initialize the issuing Realm before any measured update.
  retained_states.push(create_state())
  const stable_state = create_state()
  retained_states.push(stable_state)
  const merge_source = api.__create<number>()
  const merge_reel: Reel<number> = require_result(
    api.__update(merge_source, 0, values.slice(0, 16), 'after'),
    '__merge'
  ).reel
  retained_states.push(merge_source)

  const definitions: Array<{
    name: string
    workload: string
    batch_size: number
    mutates_state?: boolean
    before_each?: () => void
    run: () => void
    after_each?: () => void
  }> = [
    {
      name: '__create',
      workload: 'Create one empty Replica',
      batch_size: 1,
      mutates_state: true,
      run: () => {
        mutable_state = api.__create<number>()
      },
      after_each: retain_mutable_state,
    },
    {
      name: '__read',
      workload: 'Read a rotating index from one 256-Frame Strip',
      batch_size: 512,
      run: () => {
        result_sink = api.__read(stable_state, read_index)
        read_index = (read_index + 1) & 255
      },
    },
    {
      name: '__length',
      workload: 'Read the length of one 256-Frame Strip',
      batch_size: 512,
      run: () => {
        result_sink = api.__length(stable_state)
      },
    },
    {
      name: '__recover',
      workload: 'Recover one retained 256-Frame Strip',
      batch_size: 8,
      run: () => {
        result_sink = api.__recover(stable_state)
      },
    },
    {
      name: '__update',
      workload: 'Insert one Frame into one 256-Frame Strip',
      batch_size: 1,
      mutates_state: true,
      before_each: () => {
        mutable_state = create_state()
      },
      run: () => {
        result_sink = api.__update(mutable_state!, 127, [frame_count], 'after')
      },
      after_each: retain_mutable_state,
    },
    {
      name: '__delete',
      workload: 'Soft-delete one Frame from one 256-Frame Strip',
      batch_size: 1,
      mutates_state: true,
      before_each: () => {
        mutable_state = create_state()
      },
      run: () => {
        result_sink = api.__delete(mutable_state!, 128, 129)
      },
      after_each: retain_mutable_state,
    },
    {
      name: '__merge',
      workload: 'Merge one new 16-Frame Strip into an empty Replica',
      batch_size: 1,
      mutates_state: true,
      before_each: () => {
        mutable_state = api.__create<number>()
      },
      run: () => {
        result_sink = api.__merge(mutable_state!, merge_reel)
      },
      after_each: retain_mutable_state,
    },
    {
      name: '__acknowledge',
      workload: 'Acknowledge one Realm containing a 256-Frame Strip',
      batch_size: 16,
      run: () => {
        result_sink = api.__acknowledge(stable_state)
      },
    },
    {
      name: '__garbageCollect',
      workload: 'Release one soft-deleted Frame using two Frontiers',
      batch_size: 1,
      mutates_state: true,
      before_each: () => {
        mutable_state = create_state()
        require_result(
          api.__delete(mutable_state, 128, 129),
          '__garbageCollect'
        )
        const frontier = require_result(
          api.__acknowledge(mutable_state),
          '__acknowledge'
        )
        garbage_collection_frontiers = [
          frontier.map((point) => [...point]),
          frontier.map((point) => [...point]),
        ]
      },
      run: () => {
        result_sink = api.__garbageCollect(
          garbage_collection_frontiers,
          mutable_state!
        )
      },
      after_each: retain_mutable_state,
    },
    {
      name: '__snapshot',
      workload: 'Snapshot one retained 256-Frame Strip',
      batch_size: 8,
      run: () => {
        result_sink = api.__snapshot(stable_state)
      },
    },
  ]

  const rows = []
  for (const definition of definitions) {
    const iterations = definition.mutates_state ? 512 : 2_000
    const benchmark = new Bench({
      iterations,
      time: 0,
      warmup: true,
      warmupIterations: definition.mutates_state ? 128 : 256,
      warmupTime: 0,
      throws: true,
      timestampProvider: 'hrtimeNow',
    })
    benchmark.add(
      definition.name,
      () => {
        const started_at = process.hrtime.bigint()
        for (let iteration = 0; iteration < definition.batch_size; iteration++)
          definition.run()
        const duration_ms =
          Number(process.hrtime.bigint() - started_at) /
          1_000_000 /
          definition.batch_size
        return { overriddenDuration: duration_ms }
      },
      {
        async: false,
        beforeEach: definition.before_each,
        afterEach: definition.after_each,
      }
    )
    await benchmark.run()

    const result = benchmark.tasks[0].result
    if (result.state !== 'completed')
      throw new TypeError(`Benchmark failed for ${definition.name}.`)
    rows.push({
      name: definition.name,
      workload: definition.workload,
      throughput_ops_per_second: result.throughput.mean,
      average_time_ns: result.latency.mean * 1_000_000,
      relative_margin_of_error: result.latency.rme,
      samples: result.latency.samplesCount,
      batch_size: definition.batch_size,
    })
  }

  void result_sink
  return {
    generated_at: new Date().toISOString(),
    environment: {
      node: process.versions.node,
      v8: process.versions.v8,
      platform: platform(),
      architecture: arch(),
      cpu: cpus()[0]?.model ?? 'Unknown CPU',
    },
    rows,
  }
}
