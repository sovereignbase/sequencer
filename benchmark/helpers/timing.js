export function time(fn) {
  const start = process.hrtime.bigint()
  const ops = fn()
  return { ms: Number(process.hrtime.bigint() - start) / 1_000_000, ops }
}

export function byteSize(value) {
  if (!value) return 0
  if (typeof value.byteLength === 'number') return value.byteLength
  if (Array.isArray(value))
    return value.reduce((sum, entry) => sum + byteSize(entry), 0)
  return Buffer.byteLength(JSON.stringify(value))
}

export function sizeResult(bytes, ops = 1) {
  return { bytes, ms: 0, ops }
}
