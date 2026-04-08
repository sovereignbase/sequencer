import { CRList } from './dist/index.js'

const list = new CRList()

list[0] = 'kakkaa'

list.append('moi')
list.prepend('moikka')

const serialized = JSON.stringify(list)

const list2 = new CRList(JSON.parse(serialized))

for (const value of list) {
  console.log(`THIS IS: ${value}`)
}

for (const index in list) {
  console.log(`THIS IS: ${index}`)
}

list.forEach((value, index, list) => {
  console.log(index, value, list.size)
})
