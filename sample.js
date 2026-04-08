import { CRList } from './dist/index.js'

const list = new CRList()

list[0] = 'up'

list.append('dude!')
list.prepend('What is')

const serialized = JSON.stringify(list)

const list2 = new CRList(JSON.parse(serialized))

for (const value of list) {
  console.log(`${value}`)
}

for (const index in list) {
  console.log(`${index}`)
}

list.forEach((value, index, list) => {
  console.log(index, value, list.size)
})
