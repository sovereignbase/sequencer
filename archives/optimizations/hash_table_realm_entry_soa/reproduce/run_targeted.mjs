import { cpus } from 'node:os'
const module_url = new URL('./hash_table_benchmark.mjs', import.meta.url).href
const sample_count = 9
const entry_count = 100_000
const random_iterations = 2_000_000
const hot_iterations = 5_000_000
let checksum = 0

const elapsed_nanoseconds = (started_at) =>
  Number(process.hrtime.bigint() - started_at)
const median = (samples) =>
  [...samples].sort((left, right) => left - right)[samples.length >> 1]
const summarize = (samples, operations) => ({
  raw_nanoseconds: samples,
  median_nanoseconds_per_operation: median(samples) / operations,
})

const random_samples = []
const hot_samples = []
{
  const create_module = (await import(module_url)).default
  const module = await create_module()
  checksum ^= module._populate(entry_count)
  module._lookup_random_batch(100_000, 0x6d2b79f5)
  module._lookup_hot_batch(100_000)
  for (let sample = 0; sample < sample_count; ++sample) {
    let started_at = process.hrtime.bigint()
    checksum ^= module._lookup_random_batch(random_iterations, 0x6d2b79f5)
    random_samples.push(elapsed_nanoseconds(started_at))
    started_at = process.hrtime.bigint()
    checksum ^= module._lookup_hot_batch(hot_iterations)
    hot_samples.push(elapsed_nanoseconds(started_at))
  }
}

const populate_samples = []
const middle_insert_samples = []
for (let sample = 0; sample < sample_count; ++sample) {
  const create_module = (await import(`${module_url}?sample=${sample}`)).default
  let module = await create_module()
  let started_at = process.hrtime.bigint()
  checksum ^= module._populate(entry_count)
  populate_samples.push(elapsed_nanoseconds(started_at))

  module = await create_module()
  checksum ^= module._initialize_spaced(entry_count)
  started_at = process.hrtime.bigint()
  checksum ^= module._insert_middle()
  middle_insert_samples.push(elapsed_nanoseconds(started_at))
}

console.log(
  JSON.stringify(
    {
      environment: {
        node: process.versions.node,
        v8: process.versions.v8,
        cpu: cpus()[0]?.model,
      },
      entry_count,
      sample_count,
      random_lookup: summarize(random_samples, random_iterations),
      hot_lookup: summarize(hot_samples, hot_iterations),
      populate: summarize(populate_samples, entry_count),
      middle_insert: summarize(middle_insert_samples, 1),
      checksum,
    },
    null,
    2
  )
)
