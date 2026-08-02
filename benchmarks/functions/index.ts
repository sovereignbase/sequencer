import { arch, cpus, platform } from 'node:os'
import { Bench } from 'tinybench'
import * as api from '../../dist/index.js'
import { create_diamond_types_benchmarks } from '../diamond_types/index.ts'
import type {
  Frontier,
  Reel,
  Replica,
  SequencePoint,
} from '../../dist/index.js'

type BenchmarkExecution = {
  after_each?: () => void
  before_each?: () => void
  release?: () => void
  run: () => void
}

type BenchmarkDefinition = {
  batch_size: number
  implementation: string
  name: string
  prepare: (sample_count: number) => BenchmarkExecution
  workload: string
}

const benchmark_sizes = [
  [100, 256],
  [1_000, 128],
  [10_000, 64],
  [100_000, 16],
  [1_000_000, 16],
] as const

/** Measures every public operation at each documented Sequence length. */
export async function run_function_benchmarks() {
  const base_state = api.__create<string>()
  const rows = []
  let base_length = 0
  let result_sink: unknown

  const require_result = <T>(result: T | false, operation: string): T => {
    if (result === false)
      throw new TypeError(`Benchmark setup failed for ${operation}.`)
    return result
  }
  const clone_frontier = (frontier: Frontier): Frontier =>
    frontier.map((point): SequencePoint => [point[0], point[1], point[2]])
  const release_memory = async (): Promise<void> => {
    const collect_garbage = (
      globalThis as typeof globalThis & { gc?: () => void }
    ).gc
    collect_garbage?.()
    await new Promise<void>((resolve_done) => setImmediate(resolve_done))
    collect_garbage?.()
    await new Promise<void>((resolve_done) => setImmediate(resolve_done))
  }

  for (const [sequence_length, measured_samples] of benchmark_sizes) {
    // Grow one stable baseline in bounded Strips to avoid argument-count limits.
    while (base_length < sequence_length) {
      const frame_count = Math.min(10_000, sequence_length - base_length)
      const values = Array<string>(frame_count).fill('a')
      require_result(
        api.__update(base_state, base_length, values, 'after'),
        '__update'
      )
      base_length += frame_count
    }

    console.log(
      `Benchmarking ${sequence_length.toLocaleString('en-US')} Frames...`
    )
    const snapshot: Reel<string> = api.__snapshot(base_state)
    const create_state = (): Replica<string> => api.__create<string>(snapshot)
    const middle_frame_index = sequence_length >> 1
    const merge_source = create_state()
    const merge_reel = require_result(
      api.__update(
        merge_source,
        middle_frame_index,
        ['b'],
        'after'
      ),
      '__merge'
    ).reel
    let read_index = 0

    const prepare_state_pool = (
      sample_count: number,
      operation: (state: Replica<string>) => unknown,
      prepare_state: () => Replica<string> = create_state
    ): BenchmarkExecution => {
      const state_pool = Array.from({ length: sample_count }, prepare_state)
      let current_state: Replica<string> | undefined
      return {
        before_each: () => {
          current_state = state_pool.pop()
          if (!current_state)
            throw new TypeError('Benchmark state pool was exhausted.')
        },
        run: () => {
          result_sink = operation(current_state!)
        },
        release: () => {
          current_state = undefined
          state_pool.length = 0
        },
      }
    }

    const definitions: Array<BenchmarkDefinition> = [
      {
        implementation: 'Sequencer',
        name: '__create',
        workload: 'Hydrate the retained Reel',
        batch_size: 1,
        prepare: () => {
          const created_states: Array<Replica<number>> = []
          return {
            run: () => {
              created_states.push(create_state())
            },
            release: () => {
              created_states.length = 0
            },
          }
        },
      },
      {
        implementation: 'Sequencer',
        name: '__read',
        workload: 'Read a rotating visible index',
        batch_size: 512,
        prepare: () => ({
          run: () => {
            result_sink = api.__read(base_state, read_index)
            read_index = (read_index + 1) % sequence_length
          },
        }),
      },
      {
        implementation: 'Sequencer',
        name: '__length',
        workload: 'Read the visible length',
        batch_size: 512,
        prepare: () => ({
          run: () => {
            result_sink = api.__length(base_state)
          },
        }),
      },
      {
        implementation: 'Sequencer',
        name: '__recover',
        workload: 'Recover all retained values',
        batch_size: 1,
        prepare: () => ({
          run: () => {
            result_sink = api.__recover(base_state)
          },
        }),
      },
      {
        implementation: 'Sequencer',
        name: '__update',
        workload: 'Insert one Frame at the midpoint',
        batch_size: 1,
        prepare: (sample_count) =>
          prepare_state_pool(sample_count, (state) =>
            api.__update(state, middle_frame_index, ['b'], 'after')
          ),
      },
      {
        implementation: 'Sequencer',
        name: '__delete',
        workload: 'Soft-delete one midpoint Frame',
        batch_size: 1,
        prepare: (sample_count) =>
          prepare_state_pool(sample_count, (state) =>
            api.__delete(state, middle_frame_index, middle_frame_index + 1)
          ),
      },
      {
        implementation: 'Sequencer',
        name: '__merge',
        workload: 'Merge one new midpoint Frame',
        batch_size: 1,
        prepare: (sample_count) =>
          prepare_state_pool(sample_count, (state) =>
            api.__merge(state, merge_reel)
          ),
      },
      {
        implementation: 'Sequencer',
        name: '__acknowledge',
        workload: 'Acknowledge materialized Realm progress',
        batch_size: 16,
        prepare: () => ({
          run: () => {
            result_sink = api.__acknowledge(base_state)
          },
        }),
      },
      {
        implementation: 'Sequencer',
        name: '__garbageCollect',
        workload: 'Release one soft-deleted Frame',
        batch_size: 1,
        prepare: (sample_count) => {
          type GarbageCollectionCase = {
            frontiers: Array<Frontier>
            state: Replica<string>
          }
          const case_pool: Array<GarbageCollectionCase> = Array.from(
            { length: sample_count },
            () => {
              const state = create_state()
              require_result(
                api.__delete(state, middle_frame_index, middle_frame_index + 1),
                '__garbageCollect'
              )
              const frontier = require_result(
                api.__acknowledge(state),
                '__acknowledge'
              )
              return {
                state,
                frontiers: [clone_frontier(frontier), clone_frontier(frontier)],
              }
            }
          )
          let current_case: GarbageCollectionCase | undefined
          return {
            before_each: () => {
              current_case = case_pool.pop()
              if (!current_case)
                throw new TypeError('Benchmark case pool was exhausted.')
            },
            run: () => {
              result_sink = api.__garbageCollect(
                current_case!.frontiers,
                current_case!.state
              )
            },
            release: () => {
              current_case = undefined
              case_pool.length = 0
            },
          }
        },
      },
      {
        implementation: 'Sequencer',
        name: '__snapshot',
        workload: 'Snapshot complete retained state',
        batch_size: 1,
        prepare: () => ({
          run: () => {
            result_sink = api.__snapshot(base_state)
          },
        }),
      },
    ]

    const diamond_types = create_diamond_types_benchmarks(
      sequence_length,
      (result) => {
        result_sink = result
      }
    )
    definitions.push(...diamond_types.definitions)

    for (const definition of definitions) {
      const warmup_samples = Math.max(1, measured_samples >> 2)
      const execution = definition.prepare(measured_samples + warmup_samples)
      const benchmark = new Bench({
        iterations: measured_samples,
        time: 0,
        warmup: true,
        warmupIterations: warmup_samples,
        warmupTime: 0,
        throws: true,
        timestampProvider: 'hrtimeNow',
      })
      benchmark.add(
        definition.name,
        () => {
          const started_at = process.hrtime.bigint()
          for (
            let call_index = 0;
            call_index < definition.batch_size;
            call_index++
          )
            execution.run()
          const duration_ms =
            Number(process.hrtime.bigint() - started_at) /
            1_000_000 /
            definition.batch_size
          return { overriddenDuration: duration_ms }
        },
        {
          async: false,
          afterEach: execution.after_each,
          beforeEach: execution.before_each,
        }
      )
      await benchmark.run()

      const result = benchmark.tasks[0].result
      if (result.state !== 'completed')
        throw new TypeError(`Benchmark failed for ${definition.name}.`)
      const average_time_microseconds = result.latency.mean * 1_000
      rows.push({
        implementation: definition.implementation,
        name: definition.name,
        sequence_length,
        workload: definition.workload,
        throughput_ops_per_second: 1_000_000 / average_time_microseconds,
        calls: result.latency.samplesCount * definition.batch_size,
        average_time_microseconds,
        relative_margin_of_error: result.latency.rme,
        samples: result.latency.samplesCount,
        batch_size: definition.batch_size,
      })

      execution.release?.()
      result_sink = undefined
      await release_memory()
    }

    diamond_types.release()
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
    methodology: {
      average_time: 'Arithmetic mean of measured per-call latency samples.',
      throughput: '1,000,000 divided by average_time_microseconds.',
      calls: 'Measured calls; setup and warmup calls are excluded.',
      comparison:
        'Both implementations use one-character strings and equivalent public operations. Diamond Types indexed reads use get() because it has no direct indexed-read API; garbage collection is unsupported.',
    },
    implementations: [
      {
        name: 'Sequencer',
        description: 'The package under test.',
      },
      {
        name: 'Diamond Types',
        version: '1.0.2',
        description: "The world's fastest CRDT. WIP.",
      },
    ],
    rows,
  }
}
