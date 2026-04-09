import { parentPort } from 'node:worker_threads'
import { assertListIndices } from '../../src/.helpers/assertListIndices/index.ts'
import { __create, __read, __update } from '../../dist/index.js'

const empty = __create()
assertListIndices(empty)

const singleton = __create()
__update(0, [{ id: 'only' }], singleton, 'after')
singleton.cursor = [...singleton.parentMap.values()].find(
  (entry) => entry.index === 0
)
assertListIndices(singleton)
if (singleton.cursor.index !== 0) {
  throw new Error('singleton cursor index mismatch')
}

const replica = __create()
__update(0, [{ id: 'a' }, { id: 'b' }, { id: 'c' }], replica, 'after')
replica.cursor = [...replica.parentMap.values()].find(
  (entry) => entry.index === 0
)
assertListIndices(replica)
if (replica.cursor.index !== 0) throw new Error('head cursor index mismatch')
if (__read(0, replica).id !== 'a') throw new Error('read 0 mismatch')
if (__read(1, replica).id !== 'b') throw new Error('read 1 mismatch')
if (__read(2, replica).id !== 'c') throw new Error('read 2 mismatch')

parentPort.postMessage('ok')
