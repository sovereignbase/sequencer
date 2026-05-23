import { CRList } from './dist/index.js'

const list = new CRList()

list[0] = 'Whats'

list[1] = 'up'

list.append(['dude!'])

delete list[0]

list.prepend(['What is'])

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

console.log(JSON.stringify(list))
console.log(JSON.stringify([...list]))

import { v7 as uuidv7 } from 'uuid'
