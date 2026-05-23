export function time(fn) {
  const start = process.hrtime.bigint()
  const ops = fn()
  return { ms: Number(process.hrtime.bigint() - start) / 1_000_000, ops }
}
