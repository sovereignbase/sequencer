import { arch, cpus, platform } from 'node:os'
import { Bench } from 'tinybench'
import * as api from '../../dist/index.js'
import type { Acknowledgement, Delta, Replica } from '../../dist/index.js'

type BenchmarkExecution = {
  after_each?: () => void
  before_each?: () => void
  release?: () => void
  run: () => void
}

type BenchmarkDefinition = {
  batch_size: number
  name: string
  operation_frame_count: number | null
  prepare: (sample_count: number) => BenchmarkExecution
  workload: string
}

const sequence_configurations = [
  [100, 256],
  [1_000, 128],
  [10_000, 64],
  [100_000, 16],
  [1_000_000, 16],
] as const

const strip_frame_counts = [1, 10] as const

/** Measures every public function across the Sequence/Strip length matrix. */
export async function run_throughput_benchmarks() {
  const rows = []
  let result_sink: unknown

  const require_result = <T>(result: T | false, operation: string): T => {
    if (result === false)
      throw new TypeError(`Benchmark setup failed for ${operation}.`)
    return result
  }
  const clone_frontier = (frontier: Acknowledgement): Acknowledgement =>
    frontier.map((point) => [point[0], point[1], point[2]])
  const release_memory = async (): Promise<void> => {
    const collect_garbage = (
      globalThis as typeof globalThis & { gc?: () => void }
    ).gc
    collect_garbage?.()
    await new Promise<void>((resolve_done) => setImmediate(resolve_done))
    collect_garbage?.()
    await new Promise<void>((resolve_done) => setImmediate(resolve_done))
  }

  for (const [
    sequence_frame_count,
    measured_samples,
  ] of sequence_configurations) {
    for (const strip_frame_count of strip_frame_counts) {
      const base_state = api.create<string>()
      const strip_values = Array.from({ length: strip_frame_count }, () => 'a')
      for (
        let frame_index = 0;
        frame_index < sequence_frame_count;
        frame_index += strip_frame_count
      )
        require_result(
          api.insert(base_state, frame_index, strip_values),
          'insert'
        )

      const retained_strip_count = sequence_frame_count / strip_frame_count
      console.log(
        `Benchmarking ${sequence_frame_count.toLocaleString('en-US')} Sequence Frames | ${strip_frame_count.toLocaleString('en-US')} Frames/Strip | ${retained_strip_count.toLocaleString('en-US')} retained Strips...`
      )
      const retained: Delta<string> = api.snapshot(base_state)
      if (retained.length !== retained_strip_count)
        throw new TypeError(
          `Expected ${retained_strip_count} retained Strips, received ${retained.length}.`
        )
      const create_state = (): Replica<string> => api.create<string>(retained)
      const operation_values = Array.from(
        { length: strip_frame_count },
        () => 'b'
      )
      const mutation_frame_index =
        (sequence_frame_count - strip_frame_count) >> 1
      const merge_source = create_state()
      const merge_delta = require_result(
        api.insert(merge_source, mutation_frame_index, operation_values),
        'merge'
      ).delta
      let find_index = 0

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
          name: 'create',
          workload: 'Hydrate retained state',
          batch_size: 1,
          operation_frame_count: sequence_frame_count,
          prepare: () => {
            const created_states: Array<Replica<string>> = []
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
          name: 'find',
          workload: 'Read one rotating visible index',
          batch_size: 512,
          operation_frame_count: 1,
          prepare: () => ({
            run: () => {
              result_sink = api.find(base_state, find_index)
              find_index = (find_index + 1) % sequence_frame_count
            },
          }),
        },
        {
          name: 'length',
          workload: 'Read visible length',
          batch_size: 512,
          operation_frame_count: null,
          prepare: () => ({
            run: () => {
              result_sink = api.length(base_state)
            },
          }),
        },
        {
          name: 'recover',
          workload: 'Recover all retained values',
          batch_size: 1,
          operation_frame_count: sequence_frame_count,
          prepare: () => ({
            run: () => {
              result_sink = api.recover(base_state)
            },
          }),
        },
        {
          name: 'values',
          workload: 'Read the complete visible Projection',
          batch_size: 1,
          operation_frame_count: sequence_frame_count,
          prepare: () => ({
            run: () => {
              result_sink = api.values(base_state)
            },
          }),
        },
        {
          name: 'insert',
          workload: 'Insert one Strip at the midpoint',
          batch_size: 1,
          operation_frame_count: strip_frame_count,
          prepare: (sample_count) =>
            prepare_state_pool(sample_count, (state) =>
              api.insert(state, mutation_frame_index, operation_values)
            ),
        },
        {
          name: 'merge',
          workload: 'Merge one new midpoint Strip',
          batch_size: 1,
          operation_frame_count: strip_frame_count,
          prepare: (sample_count) =>
            prepare_state_pool(sample_count, (state) =>
              api.merge(state, merge_delta)
            ),
        },
        {
          name: 'replace',
          workload: 'Replace one midpoint Strip',
          batch_size: 1,
          operation_frame_count: strip_frame_count,
          prepare: (sample_count) =>
            prepare_state_pool(sample_count, (state) =>
              api.replace(state, mutation_frame_index, operation_values)
            ),
        },
        {
          name: 'remove',
          workload: 'Soft-delete one midpoint Strip',
          batch_size: 1,
          operation_frame_count: strip_frame_count,
          prepare: (sample_count) =>
            prepare_state_pool(sample_count, (state) =>
              api.remove(
                state,
                mutation_frame_index,
                mutation_frame_index + strip_frame_count
              )
            ),
        },
        {
          name: 'compact',
          workload: 'Release one soft-deleted Strip',
          batch_size: 1,
          operation_frame_count: strip_frame_count,
          prepare: (sample_count) => {
            type CompactionCase = {
              frontiers: Array<Acknowledgement>
              state: Replica<string>
            }
            const case_pool: Array<CompactionCase> = Array.from(
              { length: sample_count },
              () => {
                const state = create_state()
                require_result(
                  api.remove(
                    state,
                    mutation_frame_index,
                    mutation_frame_index + strip_frame_count
                  ),
                  'compact'
                )
                const frontier = require_result(
                  api.acknowledge(state),
                  'acknowledge'
                )
                return {
                  state,
                  frontiers: [
                    clone_frontier(frontier),
                    clone_frontier(frontier),
                  ],
                }
              }
            )
            let current_case: CompactionCase | undefined
            return {
              before_each: () => {
                current_case = case_pool.pop()
                if (!current_case)
                  throw new TypeError('Benchmark case pool was exhausted.')
              },
              run: () => {
                result_sink = api.compact(
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
          name: 'acknowledge',
          workload: 'Acknowledge materialized Realm progress',
          batch_size: 16,
          operation_frame_count: null,
          prepare: () => ({
            run: () => {
              result_sink = api.acknowledge(base_state)
            },
          }),
        },
        {
          name: 'snapshot',
          workload: 'Snapshot complete retained state',
          batch_size: 1,
          operation_frame_count: sequence_frame_count,
          prepare: () => ({
            run: () => {
              result_sink = api.snapshot(base_state)
            },
          }),
        },
      ]

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
          implementation: 'Sequencer',
          name: definition.name,
          sequence_frame_count,
          strip_frame_count,
          retained_strip_count,
          operation_frame_count: definition.operation_frame_count,
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
    }
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
      matrix:
        'Every Sequence Frame count is measured at every Strip Frame count.',
      operation_frame_count:
        'Frames read or mutated by one timed call; null means no Frame-range operand.',
    },
    implementations: [
      {
        name: 'Sequencer',
        description: 'The package under test.',
      },
    ],
    rows,
  }
}
