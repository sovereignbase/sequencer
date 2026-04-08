import { CRList } from './dist/index.js'

const list = new CRList()
list.addEventListener('delta', (ev) => {
  console.log(ev.detail)
})

list[0] = 'moi'
list[0] = 'aasi'

console.log(list[0])
