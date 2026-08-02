import { Doc } from 'diamond-types-node'

/** Creates Diamond Types workloads matching Sequencer's public operations. */
export function create_diamond_types_benchmarks(
  sequence_length: number,
  write_result: (result: unknown) => void
) {
  const base_state = new Doc('benchmark_base')
  for (let frame_index = 0; frame_index < sequence_length; ) {
    const frame_count = Math.min(10_000, sequence_length - frame_index)
    base_state.ins(frame_index, 'a'.repeat(frame_count))
    frame_index += frame_count
  }

  const snapshot = base_state.toBytes()
  const middle_frame_index = sequence_length >> 1
  const create_state = (agent_name = 'benchmark') =>
    Doc.fromBytes(snapshot, agent_name)
  const merge_source = create_state('benchmark_source')
  const merge_version = merge_source.getLocalVersion()
  merge_source.ins(middle_frame_index + 1, 'b')
  const merge_patch = merge_source.getPatchSince(merge_version)
  merge_source.free()
  let read_index = 0

  const prepare_state_pool = (
    sample_count: number,
    operation: (state: Doc) => unknown
  ) => {
    const state_pool = Array.from({ length: sample_count }, () => create_state())
    let current_state: Doc | undefined
    return {
      before_each: () => {
        current_state = state_pool.pop()
      },
      run: () => {
        write_result(operation(current_state!))
      },
      after_each: () => {
        current_state?.free()
        current_state = undefined
      },
      release: () => {
        current_state?.free()
        for (const state of state_pool) state.free()
        state_pool.length = 0
      },
    }
  }

  return {
    definitions: [
      {
        implementation: 'Diamond Types',
        name: '__create',
        workload: 'Hydrate the retained snapshot',
        batch_size: 1,
        prepare: () => {
          let created_state: Doc | undefined
          return {
            run: () => {
              created_state = create_state()
              write_result(created_state)
            },
            after_each: () => {
              created_state?.free()
              created_state = undefined
            },
            release: () => {
              created_state?.free()
            },
          }
        },
      },
      {
        implementation: 'Diamond Types',
        name: '__read',
        workload: 'Read a rotating visible index through get()',
        batch_size: 1,
        prepare: () => ({
          run: () => {
            write_result(base_state.get()[read_index])
            read_index = (read_index + 1) % sequence_length
          },
        }),
      },
      {
        implementation: 'Diamond Types',
        name: '__length',
        workload: 'Read the visible length',
        batch_size: 512,
        prepare: () => ({
          run: () => {
            write_result(base_state.len())
          },
        }),
      },
      {
        implementation: 'Diamond Types',
        name: '__recover',
        workload: 'Read all visible values from clean state',
        batch_size: 1,
        prepare: () => ({
          run: () => {
            write_result(base_state.get())
          },
        }),
      },
      {
        implementation: 'Diamond Types',
        name: '__update',
        workload: 'Insert one character after the midpoint',
        batch_size: 1,
        prepare: (sample_count: number) =>
          prepare_state_pool(sample_count, (state) =>
            state.ins(middle_frame_index + 1, 'b')
          ),
      },
      {
        implementation: 'Diamond Types',
        name: '__delete',
        workload: 'Delete one midpoint character',
        batch_size: 1,
        prepare: (sample_count: number) =>
          prepare_state_pool(sample_count, (state) =>
            state.del(middle_frame_index, 1)
          ),
      },
      {
        implementation: 'Diamond Types',
        name: '__merge',
        workload: 'Merge one new midpoint character patch',
        batch_size: 1,
        prepare: (sample_count: number) =>
          prepare_state_pool(sample_count, (state) =>
            state.mergeBytes(merge_patch)
          ),
      },
      {
        implementation: 'Diamond Types',
        name: '__acknowledge',
        workload: 'Read the local causal frontier',
        batch_size: 16,
        prepare: () => ({
          run: () => {
            write_result(base_state.getLocalVersion())
          },
        }),
      },
      {
        implementation: 'Diamond Types',
        name: '__snapshot',
        workload: 'Serialize complete retained state',
        batch_size: 1,
        prepare: () => ({
          run: () => {
            write_result(base_state.toBytes())
          },
        }),
      },
    ],
    release: () => {
      base_state.free()
    },
  }
}
