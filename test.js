import { CRList } from './dist/index.js'

const list = new CRList()

list.append('moi')
list.prepend('moikka')

const serialized = JSON.stringify(list)

const list2 = new CRList(JSON.parse(serialized))

console.log(list2)
