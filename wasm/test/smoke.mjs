import createModule from '../dist/crlist_wasm.mjs'

const module = await createModule()

const major = module.ccall('crlist_version_major', 'number', [], [])
const minor = module.ccall('crlist_version_minor', 'number', [], [])
const patch = module.ccall('crlist_version_patch', 'number', [], [])
const sum = module.ccall('crlist_add', 'number', ['number', 'number'], [19, 23])

if (sum !== 42) throw new Error(`crlist_add returned ${sum}`)

console.log(`crlist_wasm ${major}.${minor}.${patch} smoke ok`)
