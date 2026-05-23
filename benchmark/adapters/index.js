import { automergeAdapter } from './automerge.js'
import { crlistAdapter } from './crlist.js'
import { jsonJoyAdapter } from './jsonJoy.js'
import { yjsAdapter } from './yjs.js'

export const adapters = new Map([
  ['crlist', crlistAdapter],
  ['yjs', yjsAdapter],
  ['jsonJoy', jsonJoyAdapter],
  ['automerge', automergeAdapter],
])
