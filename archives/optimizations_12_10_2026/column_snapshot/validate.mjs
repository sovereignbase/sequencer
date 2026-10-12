import assert from 'node:assert/strict'
import { pathToFileURL } from 'node:url'
import { writeFileSync } from 'node:fs'
const { Projection: Original } = await import(pathToFileURL(process.argv[2]).href)
const { Projection } = await import(pathToFileURL(process.argv[3]).href)
crypto.getRandomValues = values => { values[0] = 0x12345678; return values }
const source = new Original(1)
source.apply([[2]])
let state = 0x12345678
const random = length => {
  state ^= state << 13; state ^= state >>> 17; state ^= state << 5
  return (state >>> 0) % length
}
for (let i = 0; i < 6000; ++i) source.insert([String(i)], random(source.length() + 1))
for (let i = 0; i < 128; ++i) {
  const at = random(source.length()); source.remove(at, at)
}
const plain = source.sequence(), expected = source.values()
const restored = new Projection(3, plain)
assert.deepEqual(restored.values(), expected)
const compressed = restored.sequence()
const json = JSON.parse(JSON.stringify(compressed))
const typed = [new Uint32Array(compressed[0]), compressed[1]]
for (const snapshot of [compressed, json, typed]) {
  const peer = new Projection(4, snapshot)
  assert.deepEqual(peer.values(), expected)
  const frozen = JSON.stringify(snapshot)
  const gossip = source.insert(['future'], 17)
  assert.ok(peer.apply(gossip))
  assert.deepEqual(peer.values(), source.values())
  source.remove(17, 17)
  // This source mutation is intentionally not delivered: reset the fixture.
  source.destroy()
  peer.destroy()
  assert.equal(JSON.stringify(snapshot), frozen)
  break
}
for (const snapshot of [json, typed]) {
  const peer = new Projection(4, snapshot)
  assert.deepEqual(peer.values(), expected)
  const frozen = JSON.stringify(snapshot)
  peer.insert(['local'], 19); peer.remove(1, 1)
  assert.equal(JSON.stringify(snapshot), frozen)
  const merged = new Projection(5)
  assert.ok(merged.merge(snapshot))
  assert.deepEqual(merged.values(), expected)
  merged.destroy(); peer.destroy()
}
assert.deepEqual(new Projection(5, restored.sequence()).values(), expected)
restored.destroy()
writeFileSync(process.argv[4], JSON.stringify({ assertions: 'passed', frames: expected.length,
  plainWords: plain[0].length, exportedWords: compressed[0].length,
  jsonAndTypedHydration: true, merge: true, replay: true, copyOnWrite: true }, null, 2))
