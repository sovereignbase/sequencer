import assert from 'node:assert/strict'
import test from 'node:test' /** update to current package */
import {
  concat,
  fromBase64String,
  fromBase64UrlString,
  fromBigInt,
  fromHex,
  fromJSON,
  fromString,
  fromZ85String,
  toBase64String,
  toBase64UrlString,
  toBigInt,
  toHex,
  toJSON,
  toString,
  toZ85String,
} from '../../dist/index.js'

test('integration: utf8 -> base64 -> utf8', () => {
  const text = 'pipeline check'
  const bytes = fromString(text)
  const encoded = toBase64String(bytes)
  const decoded = fromBase64String(encoded)
  assert.equal(toString(decoded), text)
})

test('integration: utf8 -> base64url -> utf8', () => {
  const text = 'pipeline check'
  const bytes = fromString(text)
  const encoded = toBase64UrlString(bytes)
  const decoded = fromBase64UrlString(encoded)
  assert.equal(toString(decoded), text)
})

test('integration: utf8 -> hex -> utf8', () => {
  const text = 'pipeline check'
  const bytes = fromString(text)
  const encoded = toHex(bytes)
  const decoded = fromHex(encoded)
  assert.equal(toString(decoded), text)
})

test('integration: bigint -> bytes -> hex -> bigint', () => {
  const value = 0x1234567890abcdefn
  const bytes = fromBigInt(value)
  const encoded = toHex(bytes)
  const decoded = fromHex(encoded)
  assert.equal(toBigInt(decoded), value)
})

test('integration: json -> bytes -> base64url -> json', () => {
  const value = { ok: true, list: [1, 2, 3] }
  const bytes = fromJSON(value)
  const encoded = toBase64UrlString(bytes)
  const decoded = fromBase64UrlString(encoded)
  assert.deepStrictEqual(toJSON(decoded), value)
})

test('integration: z85 -> hex -> bytes', () => {
  const payload = Uint8Array.from([
    0x86, 0x4f, 0xd2, 0x6f, 0xb5, 0x59, 0xf7, 0x5b,
  ])
  const z85 = toZ85String(payload)
  const hex = toHex(fromZ85String(z85))
  assert.equal(hex, '864fd26fb559f75b')
})

test('integration: concat + base64url', () => {
  const left = fromString('left')
  const right = fromString('right')
  const merged = concat([left, right])
  const encoded = toBase64UrlString(merged)
  const decoded = fromBase64UrlString(encoded)
  assert.equal(toString(decoded), 'leftright')
})
